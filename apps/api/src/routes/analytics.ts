import { Hono } from "hono";
import { count, desc, eq, ne, sql, sum } from "drizzle-orm";
import { db } from "@rocksa/db";
import { specimens } from "@rocksa/db/schema";
import { requireAuth, requireCurator, type AuthUser } from "../auth.ts";

export const analyticsRouter = new Hono<{ Variables: { user: AuthUser } }>();
analyticsRouter.use("*", requireAuth);
analyticsRouter.use("*", requireCurator);

type RangeKey = "12m" | "3y" | "all";
type TrajectoryKey = "1y" | "3y" | "all";

const rangeStart = (range: RangeKey): Date | null => {
  const now = new Date();
  if (range === "all") return null;
  if (range === "3y") {
    return new Date(now.getFullYear() - 3, now.getMonth(), 1);
  }
  return new Date(now.getFullYear(), now.getMonth() - 11, 1);
};

const trajectoryStart = (key: TrajectoryKey): Date | null => {
  const now = new Date();
  if (key === "all") return null;
  if (key === "3y") return new Date(now.getFullYear() - 3, now.getMonth(), 1);
  return new Date(now.getFullYear() - 1, now.getMonth(), 1);
};

const monthKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const monthLabel = (key: string): string => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y!, m! - 1, 1).toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
};

analyticsRouter.get("/", async (c) => {
  const range = (c.req.query("range") ?? "12m") as RangeKey;
  const trajectory = (c.req.query("trajectory") ?? "1y") as TrajectoryKey;
  const rangeFrom = rangeStart(range);
  const trajectoryFrom = trajectoryStart(trajectory);

  const specimenRows = await db
    .select()
    .from(specimens)
    .where(ne(specimens.stockStatus, "sold"))
    .orderBy(desc(specimens.createdAt));

  const inRange = rangeFrom
    ? specimenRows.filter((s) => s.createdAt >= rangeFrom)
    : specimenRows;

  const [totalRow] = await db
    .select({ value: count() })
    .from(specimens)
    .where(ne(specimens.stockStatus, "sold"));
  const [valueRow] = await db
    .select({ value: sum(specimens.priceCents) })
    .from(specimens)
    .where(ne(specimens.stockStatus, "sold"));
  const [avgRow] = await db
    .select({ value: sql<number>`avg(${specimens.priceCents})` })
    .from(specimens)
    .where(ne(specimens.stockStatus, "sold"));
  const top = await db
    .select()
    .from(specimens)
    .where(ne(specimens.stockStatus, "sold"))
    .orderBy(desc(specimens.priceCents))
    .limit(1);

  const totalPortfolioValueCents = Number(valueRow?.value ?? 0);
  const totalSpecimens = Number(totalRow?.value ?? 0);
  const averageAcquisitionCostCents = Math.round(Number(avgRow?.value ?? 0));
  const highest = top[0] ?? null;

  const monthlyAdds = new Map<string, number>();
  for (const row of specimenRows) {
    if (trajectoryFrom && row.createdAt < trajectoryFrom) continue;
    const key = monthKey(row.createdAt);
    monthlyAdds.set(key, (monthlyAdds.get(key) ?? 0) + row.priceCents);
  }

  const sortedMonths = [...monthlyAdds.keys()].sort();
  let running = 0;
  if (trajectoryFrom) {
    running = specimenRows
      .filter((s) => s.createdAt < trajectoryFrom)
      .reduce((sum, s) => sum + s.priceCents, 0);
  }

  const trajectoryPoints = sortedMonths.map((key) => {
    running += monthlyAdds.get(key) ?? 0;
    return {
      month: key,
      label: monthLabel(key),
      valueCents: running,
    };
  });

  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  const valueYearAgo = specimenRows
    .filter((s) => s.createdAt <= yearAgo)
    .reduce((sum, s) => sum + s.priceCents, 0);
  const yoyChangePct =
    valueYearAgo > 0
      ? ((totalPortfolioValueCents - valueYearAgo) / valueYearAgo) * 100
      : 0;

  const rangeValueCents = inRange.reduce((sum, s) => sum + s.priceCents, 0);
  const priorRangeFrom = rangeFrom
    ? new Date(
        rangeFrom.getTime() -
          (Date.now() - rangeFrom.getTime()),
      )
    : null;
  const priorRangeValueCents = priorRangeFrom
    ? specimenRows
        .filter(
          (s) => s.createdAt >= priorRangeFrom && rangeFrom && s.createdAt < rangeFrom,
        )
        .reduce((sum, s) => sum + s.priceCents, 0)
    : 0;
  const momChangePct =
    priorRangeValueCents > 0
      ? ((rangeValueCents - priorRangeValueCents) / priorRangeValueCents) * 100
      : 0;

  const categoryCounts = new Map<string, number>();
  for (const row of specimenRows) {
    categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);
  }
  const distribution = [...categoryCounts.entries()]
    .map(([category, itemCount]) => ({
      category,
      count: itemCount,
      pct: totalSpecimens > 0 ? Math.round((itemCount / totalSpecimens) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return c.json({
    range,
    trajectory,
    stats: {
      totalPortfolioValueCents,
      totalSpecimens,
      averageAcquisitionCostCents,
      highestValuedAsset: highest
        ? { name: highest.name, priceCents: highest.priceCents }
        : null,
      yoyChangePct,
      momChangePct,
    },
    trajectoryPoints,
    distribution,
  });
});
