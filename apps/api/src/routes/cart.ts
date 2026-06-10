import { Hono } from "hono";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@rocksa/db";
import { cartItems, carts, specimens } from "@rocksa/db/schema";
import { requireAuth, type AuthUser } from "../auth.ts";

export const cartRouter = new Hono<{ Variables: { user: AuthUser } }>();
cartRouter.use("*", requireAuth);

const getOrCreateCart = async (userId: string) => {
  const existing = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .orderBy(desc(carts.updatedAt))
    .limit(1);
  if (existing[0]) return existing[0];
  const inserted = await db.insert(carts).values({ userId }).returning();
  return inserted[0]!;
};

cartRouter.get("/", async (c) => {
  const user = c.get("user");
  const cart = await getOrCreateCart(user.id);
  const rows = await db
    .select({
      specimenId: cartItems.specimenId,
      qty: cartItems.qty,
      unitPriceCents: specimens.priceCents,
    })
    .from(cartItems)
    .innerJoin(specimens, eq(specimens.id, cartItems.specimenId))
    .where(eq(cartItems.cartId, cart.id));
  return c.json({ items: rows });
});

const upsertBody = z.object({
  items: z.array(
    z.object({
      specimenId: z.string().uuid(),
      qty: z.number().int().min(0),
    }),
  ),
});

cartRouter.put("/", async (c) => {
  const user = c.get("user");
  const body = upsertBody.parse(await c.req.json());
  const cart = await getOrCreateCart(user.id);

  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
  const rows = body.items
    .filter((i) => i.qty > 0)
    .map((i) => ({
      cartId: cart.id,
      specimenId: i.specimenId,
      qty: i.qty,
    }));
  if (rows.length > 0) await db.insert(cartItems).values(rows);
  await db
    .update(carts)
    .set({ updatedAt: new Date() })
    .where(eq(carts.id, cart.id));
  return c.json({ ok: true });
});

cartRouter.delete("/items/:slug", async (c) => {
  const user = c.get("user");
  const slug = c.req.param("slug");
  const cart = await getOrCreateCart(user.id);
  const specimen = await db
    .select({ id: specimens.id })
    .from(specimens)
    .where(eq(specimens.slug, slug))
    .limit(1);
  if (!specimen[0]) return c.json({ error: "not found" }, 404);
  await db
    .delete(cartItems)
    .where(
      and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.specimenId, specimen[0].id),
      ),
    );
  return c.json({ ok: true });
});
