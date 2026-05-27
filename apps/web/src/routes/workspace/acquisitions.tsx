import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, CardBody } from "@rocksa/ui";
import { WorkspaceLayout } from "../../components/WorkspaceLayout.tsx";
import {
  ArrowRightIcon,
  DiamondIcon,
  PlusIcon,
  TruckIcon,
  VaultIcon,
} from "../../components/Icons.tsx";

export const Route = createFileRoute("/workspace/acquisitions")({ component: Acquisitions });

const SHIPMENTS = [
  {
    name: "Paraiba Tourmaline Rough",
    sub: "124.5 ct • Uncut",
    origin: "São José da Batalha",
    status: "In Transit",
    tone: "brand" as const,
    eta: "Oct 12",
    dot: "bg-brand-600",
  },
  {
    name: "Lapis Lazuli Block",
    sub: "5.2 kg • Premium Grade",
    origin: "Badakhshan Province",
    status: "Pending Customs",
    tone: "warning" as const,
    eta: "TBD",
    dot: "bg-ink-400",
  },
  {
    name: "Idar-Oberstein Parcel",
    sub: "Precision Cuts • Mixed",
    origin: "Germany",
    status: "Out for Delivery",
    tone: "success" as const,
    eta: "Today",
    dot: "bg-rose-500",
  },
];

function Acquisitions() {
  return (
    <WorkspaceLayout>
      <div className="p-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-5xl">Acquisitions Tracking</h1>
            <p className="text-ink-500 mt-1">
              Monitor active inbound logistics and global pipeline.
            </p>
          </div>
          <Button>
            <PlusIcon className="h-4 w-4" /> New Acquisition
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Active Shipments", value: "14", hint: "+2 arriving this week", icon: TruckIcon, tone: "text-brand-600" },
            { label: "Pending Clearance", value: "3", hint: "Requires documentation", icon: VaultIcon, tone: "text-ink-500" },
            { label: "Est. Pipeline Value", value: "$1.2M", hint: "Across 8 origins", icon: DiamondIcon, tone: "text-brand-600" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <p className="text-xs uppercase tracking-wider text-ink-500">
                      {s.label}
                    </p>
                    <Icon className={s.tone} />
                  </div>
                  <p className="font-display text-5xl mt-3">{s.value}</p>
                  <p className="text-xs text-brand-600 mt-1">{s.hint}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Incoming Shipments</h2>
                <a className="text-sm font-medium text-brand-600">View All</a>
              </div>
              <table className="mt-4 w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                    <th className="py-2">Specimen</th>
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
                            ◆
                          </span>
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-ink-500">{s.sub}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={"h-2 w-2 rounded-full " + s.dot} />
                          {s.origin}
                        </div>
                      </td>
                      <td>
                        <Badge tone={s.tone}>{s.status}</Badge>
                      </td>
                      <td className="text-brand-600">{s.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Active Origins</h2>
                <span className="text-brand-600">🌐</span>
              </div>
              <div className="mt-4 grid aspect-[16/10] place-items-center rounded-md bg-surface-soft text-ink-400">
                world map
              </div>
              <ul className="mt-4 space-y-3">
                {[
                  ["Brazil, South America", "Tourmaline, Quartz • 2 Shipments"],
                  ["Afghanistan, Central Asia", "Lapis Lazuli, Spinel • 1 Pending"],
                  ["Idar-Oberstein, Germany", "Cutters & Faceting • 1 Arriving"],
                ].map(([title, sub]) => (
                  <li
                    key={title}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-xs text-ink-500">{sub}</p>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-ink-400" />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
