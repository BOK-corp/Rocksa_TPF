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
  return c.json({
    items: rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      category: row.category,
      subcategory: row.subcategory,
      description: row.description,
      priceCents: row.priceCents,
      compareAtCents: row.compareAtCents,
      stockStatus: row.stockStatus,
      originCountry: row.originCountry,
      imageUrl: row.imageUrl,
      attributes: row.attributes,
      createdAt: row.createdAt,
    })),
  });
});

specimensRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await db
    .select()
    .from(specimens)
    .where(eq(specimens.slug, slug))
    .limit(1);
  if (!row[0]) return c.json({ error: "not found" }, 404);
  const item = row[0];
  return c.json({
    item: {
      slug: item.slug,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      description: item.description,
      priceCents: item.priceCents,
      compareAtCents: item.compareAtCents,
      stockStatus: item.stockStatus,
      originCountry: item.originCountry,
      imageUrl: item.imageUrl,
      attributes: item.attributes,
      createdAt: item.createdAt,
    },
  });
});
