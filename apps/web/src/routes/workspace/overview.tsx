import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, CardBody } from "@rocksa/ui";
import { TruckIcon, VaultIcon, DiamondIcon } from "../../components/Icons.tsx";
import { WorkspacePageHeader } from "../../components/WorkspacePageHeader.tsx";

export const Route = createFileRoute("/workspace/overview")({ component: Overview });

const STAT_ICONS = [VaultIcon, DiamondIcon, TruckIcon] as const;

const STATS = [
  { label: "Total Acquisitions", value: "1,248", hint: "+12 this month", hintTone: "ink" as const },
  { label: "Collection Value", value: "$4.2M", hint: "Estimated", hintTone: "ink" as const },
  { label: "Pending Shipments", value: "7", hint: "2 delayed", hintTone: "danger" as const },
];

const SHIPMENTS = [
  {
    icon: "💎",
    name: "Amethyst Geode Cluster",
    origin: "Uruguay",
    status: "In Transit",
    statusTone: "brand" as const,
    eta: "Oct 24",
  },
  {
    icon: "△",
    name: "Obsidian Block",
    origin: "Mexico",
    status: "Customs Hold",
    statusTone: "danger" as const,
    eta: "Pending",
  },
  {
    icon: "◆",
    name: "Lapis Lazuli Slab",
    origin: "Afghanistan",
    status: "Processing",
    statusTone: "neutral" as const,
    eta: "Nov 02",
  },
];

const ACTIVITY = [
  { title: "New appraisal registered for Sapphire Matrix.", time: "2 hours ago", dot: "brand" },
  { title: "Shipment #SHP-8492 cleared customs.", time: "Yesterday", dot: "neutral" },
  { title: "Added 3 new Tourmaline specimens to inventory.", time: "Oct 18", dot: "neutral" },
];

function Overview() {
  return (
    <div className="p-6 md:p-10">
      <WorkspacePageHeader
        title="Overview"
        subtitle="At-a-glance summary of your curated collection and recent logistical activities."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {STATS.map((s, i) => {
          const Icon = STAT_ICONS[i] ?? VaultIcon;
          return (
            <Card key={s.label}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-wider text-ink-500">{s.label}</p>
                  <Icon className="text-brand-600" />
                </div>
                <p className="font-display text-5xl mt-3">{s.value}</p>
                <p
                  className={
                    "text-xs mt-1 " + (s.hintTone === "danger" ? "text-rose-600" : "text-ink-400")
                  }
                >
                  {s.hint}
                </p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardBody>
            <h2 className="font-display text-2xl">Active Shipments</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="py-2">Item</th>
                  <th>Origin</th>
                  <th>Status</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {SHIPMENTS.map((s) => (
                  <tr key={s.name} className="border-t border-ink-700/5">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                          {s.icon}
                        </span>
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td>{s.origin}</td>
                    <td>
                      <Badge tone={s.statusTone}>{s.status}</Badge>
                    </td>
                    <td>{s.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="font-display text-2xl">Recent Activity</h2>
            <ul className="mt-4 space-y-4">
              {ACTIVITY.map((a) => (
                <li key={a.title} className="flex gap-3 text-sm">
                  <span
                    className={
                      "mt-1 h-2 w-2 shrink-0 rounded-full " +
                      (a.dot === "brand" ? "bg-brand-600" : "bg-ink-400")
                    }
                  />
                  <div>
                    <p className="text-ink-900">{a.title}</p>
                    <p className="text-xs text-ink-500">{a.time}</p>
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
