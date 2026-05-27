import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "@rocksa/db";
import { specimens } from "@rocksa/db/schema";

export const specimensRouter = new Hono();

specimensRouter.get("/", async (c) => {
  const category = c.req.query("category");
  const rows = category
    ? await db.select().from(specimens).where(eq(specimens.category, category))
    : await db.select().from(specimens);
  return c.json({ items: rows });
});

specimensRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await db
    .select()
    .from(specimens)
    .where(eq(specimens.slug, slug))
    .limit(1);
  if (!row[0]) return c.json({ error: "not found" }, 404);
  return c.json({ item: row[0] });
});
