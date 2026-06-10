import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, CardBody, Separator, Skeleton } from "@rocksa/ui";
import { ArrowRightIcon, DocIcon, PlusIcon, VaultIcon } from "../../components/Icons.tsx";
import { WorkspacePageHeader } from "../../components/WorkspacePageHeader.tsx";
import {
  downloadReport,
  formatFileSize,
  useGenerateReport,
  useReports,
  useToggleSchedule,
  type ReportKind,
} from "../../data/api-reports.ts";

export const Route = createFileRoute("/workspace/reports")({ component: Reports });

const GENERATORS: Array<{
  kind: ReportKind;
  icon: typeof VaultIcon;
  title: string;
  body: string;
  eta: string;
}> = [
  {
    kind: "financial_valuation",
    icon: VaultIcon,
    title: "Financial Valuation",
    body: "Comprehensive appraisal of current inventory based on real-time market data and historical acquisitions.",
    eta: "ESTIMATED 2 MINS",
  },
  {
    kind: "inventory_audit",
    icon: DocIcon,
    title: "Inventory Audit",
    body: "Detailed ledger of all physical assets, including status changes, certification updates, and location tracking.",
    eta: "ESTIMATED 1 MIN",
  },
  {
    kind: "tax_compliance",
    icon: DocIcon,
    title: "Tax Compliance",
    body: "Generate specialized reports formatted for cross-border transit, import/export duties, and capital gains assessment.",
    eta: "ESTIMATED 3 MINS",
  },
];

function Reports() {
  const { data, isLoading, isError } = useReports();
  const generate = useGenerateReport();
  const toggle = useToggleSchedule();

  const monthlySchedule = data?.schedules.find((s) =>
    s.title.toLowerCase().includes("monthly"),
  );

  const onGenerate = (kind: ReportKind) => {
    void generate.mutateAsync(kind);
  };

  return (
    <div className="p-6 md:p-10">
      <WorkspacePageHeader
        title="Document Vault"
        subtitle="Generate, schedule, and review highly detailed curator reports for the gemstone collection."
        action={<Button variant="secondary">⚙ Export Settings</Button>}
      />

      {isError && (
        <p className="mt-6 text-sm text-ink-500">
          Unable to load reports. Ensure the API is running.
        </p>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {GENERATORS.slice(0, 2).map((g) => {
          const Icon = g.icon;
          return (
            <Card key={g.kind}>
              <CardBody className="space-y-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                  <Icon />
                </span>
                <h3 className="font-display text-xl">{g.title}</h3>
                <p className="text-sm text-ink-500">{g.body}</p>
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-brand-600">
                    {g.eta}
                  </p>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-white disabled:opacity-50"
                    onClick={() => onGenerate(g.kind)}
                    disabled={generate.isPending}
                    aria-label={`Generate ${g.title}`}
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </CardBody>
            </Card>
          );
        })}

        <Card>
          <CardBody className="space-y-4">
            <h3 className="font-display text-xl">📅 Scheduled Runs</h3>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center justify-between rounded-md border border-ink-700/5 p-3">
                <div>
                  <p className="text-sm font-medium">
                    {monthlySchedule?.title ?? "Monthly Audit"}
                  </p>
                  <p className="text-xs text-ink-500">1st of every month</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={monthlySchedule?.enabled ?? false}
                  className={
                    "inline-flex h-6 w-11 items-center rounded-full px-1 transition-colors " +
                    (monthlySchedule?.enabled ? "bg-brand-600" : "bg-ink-300")
                  }
                  onClick={() => {
                    if (!monthlySchedule) return;
                    void toggle.mutateAsync({
                      id: monthlySchedule.id,
                      enabled: !monthlySchedule.enabled,
                    });
                  }}
                >
                  <span
                    className={
                      "h-4 w-4 rounded-full bg-white transition-transform " +
                      (monthlySchedule?.enabled ? "translate-x-5" : "")
                    }
                  />
                </button>
              </div>
            )}
            <button
              type="button"
              className="w-full rounded-md border border-dashed border-brand-300 px-3 py-2 text-sm text-brand-600"
            >
              <PlusIcon className="inline h-4 w-4" /> Add Schedule
            </button>
          </CardBody>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardBody className="space-y-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
              <DocIcon />
            </span>
            <h3 className="font-display text-2xl">Tax Compliance</h3>
            <p className="max-w-md text-sm text-ink-500">
              Generate specialized reports formatted for cross-border transit,
              import/export duties, and capital gains assessment for high-value
              mineral assets.
            </p>
            <Button
              className="self-start"
              onClick={() => onGenerate("tax_compliance")}
              disabled={generate.isPending}
            >
              Generate Report ⚡
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Report Library</h2>
              <span className="text-sm font-medium text-brand-600">View All</span>
            </div>
            <ul className="mt-4 space-y-3">
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              {data?.library.map((report) => {
                const date = report.generatedAt
                  ? new Date(report.generatedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—";
                return (
                  <li
                    key={report.id}
                    className="flex items-center gap-3 rounded-md border border-ink-700/5 p-3"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-rose-50 text-[10px] font-bold text-rose-600">
                      PDF
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{report.title}</p>
                      <p className="text-xs text-ink-500">
                        {date} • {formatFileSize(report.fileSizeBytes)}
                      </p>
                    </div>
                    {report.fileUrl && (
                      <button
                        type="button"
                        className="text-xs font-medium text-brand-600"
                        onClick={() =>
                          void downloadReport(report.fileUrl, report.title)
                        }
                      >
                        Download
                      </button>
                    )}
                  </li>
                );
              })}
              {!isLoading && data?.library.length === 0 && (
                <li className="text-sm text-ink-500">No reports generated yet.</li>
              )}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
