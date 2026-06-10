import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, CardBody, Separator } from "@rocksa/ui";
import { ArrowRightIcon, DocIcon, PlusIcon, VaultIcon } from "../../components/Icons.tsx";
import { WorkspacePageHeader } from "../../components/WorkspacePageHeader.tsx";

export const Route = createFileRoute("/workspace/reports")({ component: Reports });

const GENERATORS = [
  {
    icon: VaultIcon,
    title: "Financial Valuation",
    body: "Comprehensive appraisal of current inventory based on real-time market data and historical acquisitions.",
    eta: "ESTIMATED 2 MINS",
  },
  {
    icon: DocIcon,
    title: "Inventory Audit",
    body: "Detailed ledger of all physical assets, including status changes, certification updates, and location tracking.",
    eta: "ESTIMATED 1 MIN",
  },
];

const LIBRARY = [
  ["Q3_Valuation_Report_FINAL.pdf", "Oct 12, 2023 • 2.4 MB"],
  ["Inventory_Audit_Sept.pdf", "Sep 30, 2023 • 1.1 MB"],
  ["Tax_Compliance_2022_Review.pdf", "Jan 15, 2023 • 4.7 MB"],
];

function Reports() {
  return (
    <div className="p-6 md:p-10">
      <WorkspacePageHeader
        title="Document Vault"
        subtitle="Generate, schedule, and review highly detailed curator reports for the gemstone collection."
        action={<Button variant="secondary">⚙ Export Settings</Button>}
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {GENERATORS.map((g) => {
          const Icon = g.icon;
          return (
            <Card key={g.title}>
              <CardBody className="space-y-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                  <Icon />
                </span>
                <h3 className="font-display text-xl">{g.title}</h3>
                <p className="text-sm text-ink-500">{g.body}</p>
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-brand-600">{g.eta}</p>
                  <button className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-white">
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
            <div className="flex items-center justify-between rounded-md border border-ink-700/5 p-3">
              <div>
                <p className="text-sm font-medium">Monthly Audit</p>
                <p className="text-xs text-ink-500">1st of every month</p>
              </div>
              <span className="inline-flex h-6 w-11 items-center rounded-full bg-brand-600 px-1">
                <span className="ml-auto h-4 w-4 rounded-full bg-white" />
              </span>
            </div>
            <button className="w-full rounded-md border border-dashed border-brand-300 px-3 py-2 text-sm text-brand-600">
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
            <p className="text-sm text-ink-500 max-w-md">
              Generate specialized reports formatted for cross-border transit, import/export duties,
              and capital gains assessment for high-value mineral assets.
            </p>
            <Button className="self-start">Generate Report ⚡</Button>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Report Library</h2>
              <a className="text-sm font-medium text-brand-600">View All</a>
            </div>
            <ul className="mt-4 space-y-3">
              {LIBRARY.map(([name, meta]) => (
                <li
                  key={name}
                  className="flex items-center gap-3 rounded-md border border-ink-700/5 p-3"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-rose-50 text-rose-600 text-[10px] font-bold">
                    PDF
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-ink-500">{meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
