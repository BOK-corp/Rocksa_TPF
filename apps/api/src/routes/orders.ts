import { Hono } from "hono";
import { and, desc, eq } from "drizzle-orm";
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
});

ordersRouter.post("/", async (c) => {
  const user = c.get("user");
  const body = createBody.parse(await c.req.json());

  const rows = await db.select().from(specimens);
  const priceBySlug = new Map(rows.map((r) => [r.slug, r.priceCents]));

  let subtotal = 0;
  const lines = body.items
    .filter((i) => priceBySlug.has(i.specimenId))
    .map((i) => {
      const unitPriceCents = priceBySlug.get(i.specimenId) ?? 0;
      subtotal += unitPriceCents * i.qty;
      return {
        specimenSlug: i.specimenId,
        qty: i.qty,
        unitPriceCents,
      };
    });

  const inserted = await db
    .insert(orders)
    .values({
      userUid: user.uid,
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
    .where(and(eq(orders.id, id), eq(orders.userUid, user.uid)))
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
    .where(eq(orders.userUid, user.uid))
    .orderBy(desc(orders.createdAt));
  return c.json({ orders: rows });
});
