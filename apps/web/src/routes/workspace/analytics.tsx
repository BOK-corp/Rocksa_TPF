import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, CardBody } from "@rocksa/ui";
import { WorkspacePageHeader } from "../../components/WorkspacePageHeader.tsx";

export const Route = createFileRoute("/workspace/analytics")({ component: Analytics });

const POINTS = [
  [0, 80],
  [50, 90],
  [100, 88],
  [150, 95],
  [200, 110],
  [250, 140],
  [300, 130],
  [350, 150],
  [400, 175],
  [450, 165],
  [500, 180],
  [550, 200],
];

const DIST = [
  { label: "Crystals", pct: 45, color: "bg-brand-600" },
  { label: "Metamorphic", pct: 30, color: "bg-brand-200" },
  { label: "Igneous", pct: 15, color: "bg-ink-200" },
  { label: "Sedimentary", pct: 10, color: "bg-ink-400" },
];

function Analytics() {
  const max = Math.max(...POINTS.map(([, y]) => y!));
  const path = POINTS.map(
    ([x, y], i) => `${i === 0 ? "M" : "L"}${x},${250 - (y! / max) * 200}`,
  ).join(" ");

  return (
    <div className="p-6 md:p-10">
      <WorkspacePageHeader
        title="Performance Analytics"
        subtitle="Insights and valuation metrics for your curated collection."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">Export Report</Button>
            <Button>📅 Last 12 Months</Button>
          </div>
        }
      />

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Portfolio Value", value: "$2.4M", hint: "↗ +14.2% YoY", tone: "brand" },
          { label: "Total Specimens", value: "1,842", hint: "Across 4 categories" },
          {
            label: "Average Acquisition Cost",
            value: "$1,302",
            hint: "↘ -2.1% MoM",
            tone: "danger",
          },
          {
            label: "Highest Valued Asset",
            value: "Paraiba Tourma",
            hint: "Est. $145,000",
            featured: true,
          },
        ].map((s) => (
          <Card key={s.label} className={s.featured ? "bg-brand-600 text-white" : ""}>
            <CardBody>
              <p
                className={
                  "text-xs uppercase tracking-wider " +
                  (s.featured ? "text-white/80" : "text-ink-500")
                }
              >
                {s.label}
              </p>
              <p className={"font-display mt-3 " + (s.featured ? "text-3xl" : "text-4xl")}>
                {s.value}
              </p>
              <p
                className={
                  "text-xs mt-1 " +
                  (s.featured
                    ? "text-white/80"
                    : s.tone === "brand"
                      ? "text-brand-600"
                      : s.tone === "danger"
                        ? "text-rose-600"
                        : "text-ink-500")
                }
              >
                {s.hint}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Valuation Trajectory</h2>
              <div className="flex gap-1 rounded-md bg-surface-soft p-1 text-xs">
                <button className="rounded bg-white px-3 py-1">1Y</button>
                <button className="px-3 py-1 text-ink-500">3Y</button>
                <button className="px-3 py-1 text-ink-500">All</button>
              </div>
            </div>
            <svg viewBox="0 0 600 260" className="mt-6 w-full">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgb(124,58,237)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(124,58,237)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${path} L550,250 L0,250 Z`} fill="url(#g)" />
              <path d={path} stroke="rgb(109,40,217)" strokeWidth={3} fill="none" />
              {POINTS.map(([x], i) => (
                <text key={i} x={x ?? 0} y={258} fontSize={10} fill="#8a8499">
                  {["Jan", "", "Mar", "", "May", "", "Jul", "", "Sep", "", "Nov", ""][i]}
                </text>
              ))}
            </svg>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="font-display text-2xl">Asset Distribution</h2>
            <div className="mt-6 flex flex-col items-center">
              <div className="grid h-32 w-32 place-items-center rounded-full bg-surface-soft">
                <div>
                  <p className="text-center font-display text-3xl">1.8k</p>
                  <p className="text-center text-xs uppercase tracking-wider text-ink-500">Items</p>
                </div>
              </div>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              {DIST.map((d) => (
                <li key={d.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className={"h-2 w-2 rounded-full " + d.color} />
                    {d.label}
                  </span>
                  <span className="font-medium">{d.pct}%</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
