import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Button, Card, CardBody, Skeleton } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { WorkspacePageHeader } from "../../components/WorkspacePageHeader.tsx";
import {
  useAnalytics,
  type AnalyticsRange,
  type TrajectoryRange,
} from "../../data/api-analytics.ts";
import {
  formatCompactMoney,
  formatCount,
  formatPct,
} from "../../lib/format-stats.ts";

export const Route = createFileRoute("/workspace/analytics")({ component: Analytics });

const CHART_COLORS = ["#6d28d9", "#c4b5fd", "#d4d4d8", "#a3a3a3"];

const RANGE_OPTIONS: { key: AnalyticsRange; label: string }[] = [
  { key: "12m", label: "Last 12 Months" },
  { key: "3y", label: "Last 3 Years" },
  { key: "all", label: "All Time" },
];

const TRAJECTORY_OPTIONS: { key: TrajectoryRange; label: string }[] = [
  { key: "1y", label: "1Y" },
  { key: "3y", label: "3Y" },
  { key: "all", label: "All" },
];

function Analytics() {
  const [range, setRange] = useState<AnalyticsRange>("12m");
  const [trajectory, setTrajectory] = useState<TrajectoryRange>("1y");
  const { data, isLoading, isError } = useAnalytics(range, trajectory);

  const chartData =
    data?.trajectoryPoints.map((p) => ({
      label: p.label,
      value: p.valueCents / 100,
    })) ?? [];

  const distribution = data?.distribution ?? [];
  const highestName = data?.stats.highestValuedAsset?.name ?? "—";
  const highestShort =
    highestName.length > 14 ? `${highestName.slice(0, 14)}…` : highestName;

  return (
    <div className="p-6 md:p-10">
      <WorkspacePageHeader
        title="Performance Analytics"
        subtitle="Insights and valuation metrics for your curated collection."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary">Export Report</Button>
            {RANGE_OPTIONS.map((opt) => (
              <Button
                key={opt.key}
                variant={range === opt.key ? "primary" : "secondary"}
                onClick={() => setRange(opt.key)}
              >
                📅 {opt.label}
              </Button>
            ))}
          </div>
        }
      />

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        {data && (
          <>
            <Card>
              <CardBody>
                <p className="text-xs uppercase tracking-wider text-ink-500">
                  Total Portfolio Value
                </p>
                <p className="mt-3 font-display text-4xl">
                  {formatCompactMoney(data.stats.totalPortfolioValueCents)}
                </p>
                <p className="mt-1 text-xs text-brand-600">
                  {formatPct(data.stats.yoyChangePct)} YoY
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs uppercase tracking-wider text-ink-500">
                  Total Specimens
                </p>
                <p className="mt-3 font-display text-4xl">
                  {formatCount(data.stats.totalSpecimens)}
                </p>
                <p className="mt-1 text-xs text-ink-500">Across 4 categories</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xs uppercase tracking-wider text-ink-500">
                  Average Acquisition Cost
                </p>
                <p className="mt-3 font-display text-4xl">
                  {formatPrice(data.stats.averageAcquisitionCostCents)}
                </p>
                <p
                  className={
                    "mt-1 text-xs " +
                    (data.stats.momChangePct < 0
                      ? "text-rose-600"
                      : "text-ink-500")
                  }
                >
                  {formatPct(data.stats.momChangePct)} MoM
                </p>
              </CardBody>
            </Card>
            <Card className="bg-brand-600 text-white">
              <CardBody>
                <p className="text-xs uppercase tracking-wider text-white/80">
                  Highest Valued Asset
                </p>
                <p className="mt-3 font-display text-3xl">{highestShort}</p>
                <p className="mt-1 text-xs text-white/80">
                  Est.{" "}
                  {data.stats.highestValuedAsset
                    ? formatPrice(data.stats.highestValuedAsset.priceCents)
                    : "—"}
                </p>
              </CardBody>
            </Card>
          </>
        )}
      </div>

      {isError && (
        <p className="mt-6 text-sm text-ink-500">
          Unable to load analytics. Ensure the API and database are running.
        </p>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Valuation Trajectory</h2>
              <div className="flex gap-1 rounded-md bg-surface-soft p-1 text-xs">
                {TRAJECTORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setTrajectory(opt.key)}
                    className={
                      "rounded px-3 py-1 " +
                      (trajectory === opt.key
                        ? "bg-white text-ink-900"
                        : "text-ink-500")
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 h-64">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8e4ef" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: number) =>
                        v >= 1_000_000
                          ? `$${(v / 1_000_000).toFixed(1)}M`
                          : `$${(v / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatPrice(Math.round(value * 100)),
                        "Portfolio",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6d28d9"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="font-display text-2xl">Asset Distribution</h2>
            <div className="mt-6 h-40">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="count"
                      nameKey="category"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {distribution.map((_, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, _name, item) => [
                        `${value} items (${item.payload.pct}%)`,
                        item.payload.category,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {distribution.map((d, i) => (
                <li key={d.category} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 capitalize">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                    {d.category}
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
