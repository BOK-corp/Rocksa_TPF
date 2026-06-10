import { Hono } from "hono";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@rocksa/db";
import { orderItems, orders, specimens } from "@rocksa/db/schema";
import { orderReference } from "@rocksa/domain";
import { requireAuth, type AuthUser } from "../auth.ts";

export const ordersRouter = new Hono<{ Variables: { user: AuthUser } }>();
ordersRouter.use("*", requireAuth);

const createBody = z.object({
  items: z.array(
    z.object({
      specimenId: z.string(),
      qty: z.number().int().min(1),
    }),
  ),
  shippingCents: z.number().int().min(0).optional().default(0),
});

ordersRouter.post("/", async (c) => {
  const user = c.get("user");
  const body = createBody.parse(await c.req.json());

  const slugs = body.items.map((i) => i.specimenId);
  const rows = await db
    .select()
    .from(specimens)
    .where(inArray(specimens.slug, slugs));
  const bySlug = new Map(rows.map((r) => [r.slug, r]));

  let subtotal = 0;
  const lines = body.items
    .filter((i) => bySlug.has(i.specimenId))
    .map((i) => {
      const specimen = bySlug.get(i.specimenId)!;
      subtotal += specimen.priceCents * i.qty;
      return {
        specimenSlug: i.specimenId,
        qty: i.qty,
        unitPriceCents: specimen.priceCents,
      };
    });

  const shippingCents = body.shippingCents;
  const totalCents = subtotal + shippingCents;
  const specimenSlugs = lines.map((l) => l.specimenSlug);

  const order = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(orders)
      .values({
        userUid: user.uid,
        reference: orderReference(),
        status: "pending_payment",
        subtotalCents: subtotal,
        shippingCents,
        totalCents,
      })
      .returning();
    const created = inserted[0]!;

    if (lines.length > 0) {
      await tx
        .insert(orderItems)
        .values(lines.map((l) => ({ orderId: created.id, ...l })));

      await tx
        .update(specimens)
        .set({ stockStatus: "reserved" })
        .where(inArray(specimens.slug, specimenSlugs));
    }

    return created;
  });

  return c.json({ order });
});

ordersRouter.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const row = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userUid, user.uid)))
    .limit(1);
  if (!row[0]) return c.json({ error: "not found" }, 404);
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));
  return c.json({ order: row[0], items });
});

ordersRouter.get("/", async (c) => {
  const user = c.get("user");
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userUid, user.uid))
    .orderBy(desc(orders.createdAt));
  return c.json({ orders: rows });
});
