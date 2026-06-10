import { Hono } from "hono";
import { eq, inArray } from "drizzle-orm";
import { db } from "@rocksa/db";
import { specimenAttrs, specimens } from "@rocksa/db/schema";

export const specimensRouter = new Hono();

const attrsBySpecimenId = async (ids: string[]) => {
  if (ids.length === 0) return new Map<string, Record<string, string>>();
  const rows = await db
    .select()
    .from(specimenAttrs)
    .where(inArray(specimenAttrs.specimenId, ids));
  const map = new Map<string, Record<string, string>>();
  for (const row of rows) {
    const attrs = map.get(row.specimenId) ?? {};
    attrs[row.key] = row.value;
    map.set(row.specimenId, attrs);
  }
  return map;
};

const withAttributes = async (
  rows: (typeof specimens.$inferSelect)[],
) => {
  const attrs = await attrsBySpecimenId(rows.map((r) => r.id));
  return rows.map((row) => ({
    ...row,
    attributes: attrs.get(row.id) ?? {},
  }));
};

specimensRouter.get("/", async (c) => {
  const category = c.req.query("category");
  const rows = category
    ? await db.select().from(specimens).where(eq(specimens.category, category))
    : await db.select().from(specimens);
  return c.json({ items: await withAttributes(rows) });
});

specimensRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await db.select().from(specimens).where(eq(specimens.slug, slug)).limit(1);
  if (!row[0]) return c.json({ error: "not found" }, 404);
  const [item] = await withAttributes(row);
  return c.json({ item });
});
