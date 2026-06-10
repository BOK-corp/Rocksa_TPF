import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@rocksa/db";
import { cartItems, specimens } from "@rocksa/db/schema";
import { requireAuth, type AuthUser } from "../auth.ts";

export const cartRouter = new Hono<{ Variables: { user: AuthUser } }>();
cartRouter.use("*", requireAuth);

cartRouter.get("/", async (c) => {
  const user = c.get("user");
  const rows = await db
    .select({
      specimenSlug: cartItems.specimenSlug,
      qty: cartItems.qty,
      unitPriceCents: specimens.priceCents,
    })
    .from(cartItems)
    .innerJoin(specimens, eq(specimens.slug, cartItems.specimenSlug))
    .where(eq(cartItems.userUid, user.uid));
  return c.json({
    items: rows.map((r) => ({
      specimenId: r.specimenSlug,
      qty: r.qty,
      unitPriceCents: r.unitPriceCents,
    })),
  });
});

const upsertBody = z.object({
  items: z.array(
    z.object({
      specimenId: z.string(),
      qty: z.number().int().min(0),
    }),
  ),
});

cartRouter.put("/", async (c) => {
  const user = c.get("user");
  const body = upsertBody.parse(await c.req.json());

  await db.delete(cartItems).where(eq(cartItems.userUid, user.uid));
  const rows = body.items
    .filter((i) => i.qty > 0)
    .map((i) => ({
      userUid: user.uid,
      specimenSlug: i.specimenId,
      qty: i.qty,
    }));
  if (rows.length > 0) await db.insert(cartItems).values(rows);
  return c.json({ ok: true });
});

cartRouter.delete("/items/:slug", async (c) => {
  const user = c.get("user");
  const slug = c.req.param("slug");
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.userUid, user.uid), eq(cartItems.specimenSlug, slug)));
  return c.json({ ok: true });
});
