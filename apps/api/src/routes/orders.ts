import { Hono } from "hono";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@rocksa/db";
import {
  orderItems,
  orders,
  specimenAttrs,
  specimens,
} from "@rocksa/db/schema";
import { orderReference } from "@rocksa/domain";
import { requireAuth, type AuthUser } from "../auth.ts";

export const ordersRouter = new Hono<{ Variables: { user: AuthUser } }>();
ordersRouter.use("*", requireAuth);

const createBody = z.object({
  items: z.array(
    z.object({
      specimenId: z.string().uuid(),
      qty: z.number().int().min(1),
    }),
  ),
});

const specimenSnapshots = async (ids: string[]) => {
  if (ids.length === 0) return new Map<string, Record<string, unknown>>();
  const rows = await db
    .select()
    .from(specimens)
    .where(inArray(specimens.id, ids));
  const attrs = await db
    .select()
    .from(specimenAttrs)
    .where(inArray(specimenAttrs.specimenId, ids));
  const attrsById = new Map<string, Record<string, string>>();
  for (const row of attrs) {
    const current = attrsById.get(row.specimenId) ?? {};
    current[row.key] = row.value;
    attrsById.set(row.specimenId, current);
  }
  return new Map(
    rows.map((row) => [
      row.id,
      {
        id: row.id,
        slug: row.slug,
        name: row.name,
        category: row.category,
        subcategory: row.subcategory,
        priceCents: row.priceCents,
        imageUrl: row.imageUrl,
        attributes: attrsById.get(row.id) ?? {},
      },
    ]),
  );
};

ordersRouter.post("/", async (c) => {
  const user = c.get("user");
  const body = createBody.parse(await c.req.json());

  const specimenIds = body.items.map((i) => i.specimenId);
  const snapshots = await specimenSnapshots(specimenIds);

  let subtotal = 0;
  const lines = body.items
    .filter((i) => snapshots.has(i.specimenId))
    .map((i) => {
      const snapshot = snapshots.get(i.specimenId)!;
      const unitPriceCents = snapshot.priceCents as number;
      subtotal += unitPriceCents * i.qty;
      return {
        specimenId: i.specimenId,
        qty: i.qty,
        unitPriceCents,
        snapshotJson: snapshot,
      };
    });

  const inserted = await db
    .insert(orders)
    .values({
      userId: user.id,
      reference: orderReference(),
      status: "pending_payment",
      subtotalCents: subtotal,
      shippingCents: 0,
      totalCents: subtotal,
    })
    .returning();
  const order = inserted[0]!;

  if (lines.length > 0) {
    await db.insert(orderItems).values(lines.map((l) => ({ orderId: order.id, ...l })));
  }
  return c.json({ order });
});

ordersRouter.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const row = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userId, user.id)))
    .limit(1);
  if (!row[0]) return c.json({ error: "not found" }, 404);
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return c.json({ order: row[0], items });
});

ordersRouter.get("/", async (c) => {
  const user = c.get("user");
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));
  return c.json({ orders: rows });
});
