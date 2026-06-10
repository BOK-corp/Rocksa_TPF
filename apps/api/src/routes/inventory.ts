import { Hono } from "hono";
import {
  and,
  count,
  desc,
  eq,
  gte,
  inArray,
  lt,
  ne,
  or,
  sql,
  sum,
} from "drizzle-orm";
import { z } from "zod";
import { db } from "@rocksa/db";
import {
  auditLog,
  orderItems,
  orders,
  shipments,
  specimens,
} from "@rocksa/db/schema";
import { requireAuth, requireCurator, type AuthUser } from "../auth.ts";

export const inventoryRouter = new Hono<{ Variables: { user: AuthUser } }>();
inventoryRouter.use("*", requireAuth);
inventoryRouter.use("*", requireCurator);

const ACTIVE_SHIPMENT_STATUSES = [
  "in_transit",
  "pending_customs",
  "customs_hold",
  "out_for_delivery",
] as const;

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);

const monthStart = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const encodeCursor = (createdAt: Date, slug: string): string =>
  `${createdAt.toISOString()}|${slug}`;

const decodeCursor = (
  raw: string | undefined,
): { createdAt: Date; slug: string } | null => {
  if (!raw) return null;
  const [at, slug] = raw.split("|");
  if (!at || !slug) return null;
  return { createdAt: new Date(at), slug };
};

const specimenStats = async () => {
  const [totalRow] = await db.select({ value: count() }).from(specimens);
  const [monthRow] = await db
    .select({ value: count() })
    .from(specimens)
    .where(gte(specimens.createdAt, monthStart()));
  const [valueRow] = await db
    .select({ value: sum(specimens.priceCents) })
    .from(specimens)
    .where(ne(specimens.stockStatus, "sold"));
  return {
    totalAcquisitions: Number(totalRow?.value ?? 0),
    acquisitionsThisMonth: Number(monthRow?.value ?? 0),
    collectionValueCents: Number(valueRow?.value ?? 0),
  };
};

const shipmentStats = async () => {
  const now = new Date();
  const [pendingRow] = await db
    .select({ value: count() })
    .from(shipments)
    .where(inArray(shipments.status, [...ACTIVE_SHIPMENT_STATUSES]));
  const [delayedRow] = await db
    .select({ value: count() })
    .from(shipments)
    .where(
      and(
        inArray(shipments.status, [...ACTIVE_SHIPMENT_STATUSES]),
        lt(shipments.eta, now),
      ),
    );
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const [arrivingRow] = await db
    .select({ value: count() })
    .from(shipments)
    .where(
      and(
        eq(shipments.status, "in_transit"),
        lt(shipments.eta, weekAhead),
        gte(shipments.eta, now),
      ),
    );
  const [clearanceRow] = await db
    .select({ value: count() })
    .from(shipments)
    .where(inArray(shipments.status, ["pending_customs", "customs_hold"]));
  const [pipelineRow] = await db
    .select({ value: sum(orders.totalCents) })
    .from(orders)
    .where(eq(orders.status, "fulfilling"));
  const [originRow] = await db
    .select({ value: count(sql`distinct ${shipments.origin}`) })
    .from(shipments)
    .where(inArray(shipments.status, [...ACTIVE_SHIPMENT_STATUSES]));

  return {
    pendingShipments: Number(pendingRow?.value ?? 0),
    delayedShipments: Number(delayedRow?.value ?? 0),
    activeShipments: Number(pendingRow?.value ?? 0),
    arrivingThisWeek: Number(arrivingRow?.value ?? 0),
    pendingClearance: Number(clearanceRow?.value ?? 0),
    pipelineValueCents: Number(pipelineRow?.value ?? 0),
    originCount: Number(originRow?.value ?? 0),
  };
};

const listShipments = async (limit = 10) => {
  const rows = await db
    .select({
      id: shipments.id,
      status: shipments.status,
      origin: shipments.origin,
      eta: shipments.eta,
      specimenSlug: shipments.specimenSlug,
      specimenName: specimens.name,
      subcategory: specimens.subcategory,
      imageUrl: specimens.imageUrl,
      attributes: specimens.attributes,
    })
    .from(shipments)
    .innerJoin(specimens, eq(specimens.slug, shipments.specimenSlug))
    .where(inArray(shipments.status, [...ACTIVE_SHIPMENT_STATUSES]))
    .orderBy(desc(shipments.eta))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    name: row.specimenName,
    sub: row.subcategory ?? Object.values(row.attributes ?? {})[0] ?? "",
    origin: row.origin ?? row.specimenSlug,
    status: row.status,
    eta: row.eta?.toISOString() ?? null,
    imageUrl: row.imageUrl,
  }));
};

const listActivity = async (limit = 5) => {
  const rows = await db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
  return rows.map((row) => ({
    id: row.id,
    title:
      (row.payloadJson?.title as string | undefined) ??
      `${row.action} on ${row.target ?? "workspace"}`,
    createdAt: row.createdAt.toISOString(),
  }));
};

const listOrigins = async () => {
  const rows = await db
    .select({
      origin: shipments.origin,
      status: shipments.status,
      specimenName: specimens.name,
      category: specimens.category,
    })
    .from(shipments)
    .innerJoin(specimens, eq(specimens.slug, shipments.specimenSlug))
    .where(inArray(shipments.status, [...ACTIVE_SHIPMENT_STATUSES]));

  const grouped = new Map<
    string,
    { specimens: Set<string>; shipments: number; pending: number }
  >();
  for (const row of rows) {
    const key = row.origin ?? "Unknown";
    const entry = grouped.get(key) ?? {
      specimens: new Set<string>(),
      shipments: 0,
      pending: 0,
    };
    entry.specimens.add(row.specimenName);
    entry.shipments += 1;
    if (row.status === "pending_customs" || row.status === "customs_hold") {
      entry.pending += 1;
    }
    grouped.set(key, entry);
  }

  return [...grouped.entries()]
    .map(([origin, data]) => ({
      origin,
      shipments: data.shipments,
      summary: `${[...data.specimens].slice(0, 2).join(", ")} • ${data.shipments} shipment${data.shipments === 1 ? "" : "s"}`,
      pendingLabel:
        data.pending > 0 ? `${data.pending} pending` : `${data.shipments} active`,
    }))
    .sort((a, b) => b.shipments - a.shipments)
    .map(({ origin, summary, pendingLabel }) => ({
      origin,
      summary,
      pendingLabel,
    }));
};

inventoryRouter.get("/", async (c) => {
  const view = c.req.query("view") ?? "inventory";
  const category = c.req.query("category");
  const cursor = decodeCursor(c.req.query("cursor"));
  const limit = Math.min(Number(c.req.query("limit") ?? 20), 50);

  if (view === "overview") {
    const [specimen, shipment] = await Promise.all([
      specimenStats(),
      shipmentStats(),
    ]);
    const [activeShipments, activity] = await Promise.all([
      listShipments(8),
      listActivity(5),
    ]);
    return c.json({
      stats: {
        totalAcquisitions: specimen.totalAcquisitions,
        acquisitionsThisMonth: specimen.acquisitionsThisMonth,
        collectionValueCents: specimen.collectionValueCents,
        pendingShipments: shipment.pendingShipments,
        delayedShipments: shipment.delayedShipments,
      },
      shipments: activeShipments,
      activity,
    });
  }

  if (view === "acquisitions") {
    const [specimen, shipment] = await Promise.all([
      specimenStats(),
      shipmentStats(),
    ]);
    const [shipmentsList, origins] = await Promise.all([
      listShipments(12),
      listOrigins(),
    ]);
    return c.json({
      stats: {
        activeShipments: shipment.activeShipments,
        arrivingThisWeek: shipment.arrivingThisWeek,
        pendingClearance: shipment.pendingClearance,
        pipelineValueCents: shipment.pipelineValueCents,
        originCount: shipment.originCount || origins.length,
        totalSpecimens: specimen.totalAcquisitions,
      },
      shipments: shipmentsList,
      origins,
    });
  }

  const filters = [];
  if (category && category !== "all") {
    filters.push(eq(specimens.category, category));
  }
  if (cursor) {
    filters.push(
      or(
        lt(specimens.createdAt, cursor.createdAt),
        and(
          eq(specimens.createdAt, cursor.createdAt),
          lt(specimens.slug, cursor.slug),
        ),
      )!,
    );
  }

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  const [totalRow] = await db
    .select({ value: count() })
    .from(specimens)
    .where(
      category && category !== "all"
        ? eq(specimens.category, category)
        : undefined,
    );

  const rows = await db
    .select()
    .from(specimens)
    .where(whereClause)
    .orderBy(desc(specimens.createdAt), desc(specimens.slug))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page.at(-1);
  const nextCursor =
    hasMore && last ? encodeCursor(last.createdAt, last.slug) : null;

  return c.json({
    items: page.map((row) => ({
      slug: row.slug,
      name: row.name,
      category: row.category,
      stockStatus: row.stockStatus,
      priceCents: row.priceCents,
      imageUrl: row.imageUrl,
      createdAt: row.createdAt.toISOString(),
    })),
    total: Number(totalRow?.value ?? 0),
    nextCursor,
  });
});

const createSpecimenBody = z.object({
  name: z.string().min(1),
  category: z.enum(["igneous", "metamorphic", "sedimentary", "crystals"]),
  subcategory: z.string().optional(),
  description: z.string().min(1),
  priceCents: z.number().int().min(1),
  originCountry: z.string().optional(),
  stockStatus: z
    .enum(["in_stock", "low_stock", "on_display", "reserved", "sold"])
    .optional(),
});

inventoryRouter.post("/specimens", async (c) => {
  const user = c.get("user");
  const body = createSpecimenBody.parse(await c.req.json());
  const base = slugify(body.name);
  let slug = base || `specimen-${Date.now()}`;
  let suffix = 1;
  while (true) {
    const existing = await db
      .select({ slug: specimens.slug })
      .from(specimens)
      .where(eq(specimens.slug, slug))
      .limit(1);
    if (!existing[0]) break;
    slug = `${base}-${suffix++}`;
  }

  const inserted = await db
    .insert(specimens)
    .values({
      slug,
      name: body.name,
      category: body.category,
      subcategory: body.subcategory ?? null,
      description: body.description,
      priceCents: body.priceCents,
      originCountry: body.originCountry ?? null,
      stockStatus: body.stockStatus ?? "in_stock",
      attributes: {},
    })
    .returning();

  await db.insert(auditLog).values({
    actorUid: user.uid,
    action: "inventory.created",
    target: slug,
    payloadJson: { title: `Added ${body.name} to inventory.` },
  });

  return c.json({ specimen: inserted[0] }, 201);
});

const createAcquisitionBody = z.object({
  name: z.string().min(1),
  origin: z.string().min(1),
  category: z.enum(["igneous", "metamorphic", "sedimentary", "crystals"]),
  estimatedValueCents: z.number().int().min(1),
  notes: z.string().optional(),
});

inventoryRouter.post("/acquisitions", async (c) => {
  const user = c.get("user");
  const body = createAcquisitionBody.parse(await c.req.json());

  const order = await db
    .insert(orders)
    .values({
      userUid: user.uid,
      reference: `ACQ-${Date.now().toString(36).toUpperCase()}`,
      status: "fulfilling",
      subtotalCents: body.estimatedValueCents,
      shippingCents: 0,
      totalCents: body.estimatedValueCents,
    })
    .returning();

  const intakeSlug = `${slugify(body.name)}-intake-${Date.now().toString(36)}`;
  await db.insert(specimens).values({
    slug: intakeSlug,
    name: body.name,
    category: body.category,
    description: body.notes ?? "Acquisition intake pending inspection.",
    priceCents: body.estimatedValueCents,
    originCountry: body.origin,
    stockStatus: "on_display",
    attributes: {},
  });

  const shipment = await db
    .insert(shipments)
    .values({
      orderId: order[0]!.id,
      specimenSlug: intakeSlug,
      origin: body.origin,
      status: "pending_customs",
      eta: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    })
    .returning();

  await db.insert(auditLog).values({
    actorUid: user.uid,
    action: "acquisition.intake",
    target: shipment[0]!.id,
    payloadJson: {
      title: `New acquisition intake: ${body.name} from ${body.origin}.`,
      notes: body.notes ?? null,
    },
  });

  return c.json({ order: order[0], shipment: shipment[0] }, 201);
});
