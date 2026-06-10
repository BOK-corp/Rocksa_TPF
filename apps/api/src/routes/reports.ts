import { Hono } from "hono";
import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "@rocksa/db";
import { reports } from "@rocksa/db/schema";
import { requireAuth, requireCurator, type AuthUser } from "../auth.ts";

export const reportsRouter = new Hono<{ Variables: { user: AuthUser } }>();
reportsRouter.use("*", requireAuth);
reportsRouter.use("*", requireCurator);

const REPORT_KINDS = {
  financial_valuation: {
    title: "Financial Valuation",
    filePrefix: "Q_Valuation_Report",
    etaMinutes: 2,
  },
  inventory_audit: {
    title: "Inventory Audit",
    filePrefix: "Inventory_Audit",
    etaMinutes: 1,
  },
  tax_compliance: {
    title: "Tax Compliance",
    filePrefix: "Tax_Compliance_Review",
    etaMinutes: 3,
  },
} as const;

type ReportKind = keyof typeof REPORT_KINDS;

// Minimal valid PDF bytes for fixture downloads.
const fixturePdf = (title: string): string => {
  const body = `BT /F1 18 Tf 72 720 Td (${title}) Tj ET`;
  const pdf = `%PDF-1.4
1 0 obj<</Type /Catalog /Pages 2 0 R>>endobj
2 0 obj<</Type /Pages /Kids [3 0 R] /Count 1>>endobj
3 0 obj<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<</Font<</F1<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>>>>>>>endobj
4 0 obj<</Length ${body.length}>>stream
${body}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000306 00000 n 
trailer<</Size 5 /Root 1 0 R>>
startxref
400
%%EOF`;
  return pdf;
};

const formatFileName = (kind: ReportKind): string => {
  const meta = REPORT_KINDS[kind];
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `${meta.filePrefix}_${stamp}.pdf`;
};

reportsRouter.get("/", async (c) => {
  const user = c.get("user");
  const library = await db
    .select()
    .from(reports)
    .where(and(eq(reports.userUid, user.uid), isNotNull(reports.fileUrl)))
    .orderBy(desc(reports.generatedAt));

  let schedules = await db
    .select()
    .from(reports)
    .where(and(eq(reports.userUid, user.uid), isNotNull(reports.cronSchedule)));

  if (schedules.length === 0) {
    await db.insert(reports).values({
      userUid: user.uid,
      kind: "inventory_audit",
      title: "Monthly Audit",
      cronSchedule: "0 0 1 * *",
      enabled: 1,
    });
    schedules = await db
      .select()
      .from(reports)
      .where(and(eq(reports.userUid, user.uid), isNotNull(reports.cronSchedule)));
  }

  return c.json({
    library: library.map((row) => ({
      id: row.id,
      kind: row.kind,
      title: row.title,
      generatedAt: row.generatedAt?.toISOString() ?? null,
      fileUrl: row.fileUrl,
      fileSizeBytes: row.fileSizeBytes,
    })),
    schedules: schedules.map((row) => ({
      id: row.id,
      kind: row.kind,
      title: row.title,
      cronSchedule: row.cronSchedule,
      enabled: row.enabled === 1,
    })),
  });
});

const generateBody = z.object({
  kind: z.enum(["financial_valuation", "inventory_audit", "tax_compliance"]),
});

reportsRouter.post("/generate", async (c) => {
  const user = c.get("user");
  const body = generateBody.parse(await c.req.json());
  const meta = REPORT_KINDS[body.kind];
  const title = formatFileName(body.kind);
  const fileSizeBytes = Buffer.byteLength(fixturePdf(meta.title));

  // TODO(queue): dispatch async report generation job; v1 returns fixture synchronously.
  const inserted = await db
    .insert(reports)
    .values({
      userUid: user.uid,
      kind: body.kind,
      title,
      generatedAt: new Date(),
      fileUrl: "pending",
      fileSizeBytes,
    })
    .returning();

  const row = inserted[0]!;
  const fileUrl = `/v1/reports/${row.id}/download`;
  await db.update(reports).set({ fileUrl }).where(eq(reports.id, row.id));

  return c.json({
    report: {
      ...row,
      fileUrl,
      jobId: row.id,
      status: "completed",
    },
  });
});

const scheduleBody = z.object({
  kind: z.enum(["inventory_audit"]),
  cronSchedule: z.string().default("0 0 1 * *"),
  title: z.string().default("Monthly Audit"),
});

reportsRouter.post("/schedules", async (c) => {
  const user = c.get("user");
  const body = scheduleBody.parse(await c.req.json());
  const inserted = await db
    .insert(reports)
    .values({
      userUid: user.uid,
      kind: body.kind,
      title: body.title,
      cronSchedule: body.cronSchedule,
      enabled: 1,
    })
    .returning();
  return c.json({ schedule: inserted[0] });
});

const toggleBody = z.object({ enabled: z.boolean() });

reportsRouter.patch("/schedules/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = toggleBody.parse(await c.req.json());
  const updated = await db
    .update(reports)
    .set({ enabled: body.enabled ? 1 : 0 })
    .where(and(eq(reports.id, id), eq(reports.userUid, user.uid)))
    .returning();
  if (!updated[0]) return c.json({ error: "not found" }, 404);
  return c.json({
    schedule: { ...updated[0], enabled: updated[0].enabled === 1 },
  });
});

reportsRouter.get("/:id/download", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const row = await db
    .select()
    .from(reports)
    .where(
      and(
        eq(reports.id, id),
        eq(reports.userUid, user.uid),
        isNotNull(reports.fileUrl),
        isNull(reports.cronSchedule),
      ),
    )
    .limit(1);
  if (!row[0]) return c.json({ error: "not found" }, 404);

  return new Response(fixturePdf(row[0].title), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${row[0].title}"`,
    },
  });
});
