import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardBody, Button, Skeleton } from "@rocksa/ui";
import {
  ArrowRightIcon,
  DiamondIcon,
  PlusIcon,
  TruckIcon,
  VaultIcon,
} from "../../components/Icons.tsx";
import { WorkspacePageHeader } from "../../components/WorkspacePageHeader.tsx";
import { ShipmentStatusBadge } from "../../components/ShipmentStatusBadge.tsx";
import { NewAcquisitionSheet } from "../../components/workspace/NewAcquisitionSheet.tsx";
import { useInventoryAcquisitions } from "../../data/api-inventory.ts";
import {
  formatCompactMoney,
  formatCount,
  formatEta,
} from "../../lib/format-stats.ts";
import { gemPlaceholder, paletteFor } from "../../data/placeholder.ts";

export const Route = createFileRoute("/workspace/acquisitions")({
  component: Acquisitions,
});

function Acquisitions() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data, isLoading, isError } = useInventoryAcquisitions();

  const statCards = data
    ? [
        {
          label: "Active Shipments",
          value: formatCount(data.stats.activeShipments),
          hint: `+${formatCount(data.stats.arrivingThisWeek)} arriving this week`,
          icon: TruckIcon,
          tone: "text-brand-600",
        },
        {
          label: "Pending Clearance",
          value: formatCount(data.stats.pendingClearance),
          hint: "Requires documentation",
          icon: VaultIcon,
          tone: "text-ink-500",
        },
        {
          label: "Est. Pipeline Value",
          value: formatCompactMoney(data.stats.pipelineValueCents),
          hint: `Across ${formatCount(data.stats.originCount)} origins`,
          icon: DiamondIcon,
          tone: "text-brand-600",
        },
      ]
    : [];

  return (
    <div className="p-6 md:p-10">
      <WorkspacePageHeader
        title="Acquisitions Tracking"
        subtitle="Monitor active inbound logistics and global pipeline."
        action={
          <Button onClick={() => setSheetOpen(true)}>
            <PlusIcon className="h-4 w-4" /> New Acquisition
          </Button>
        }
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        {statCards.map((s) => {
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
                <p className="mt-3 font-display text-5xl">{s.value}</p>
                <p className="mt-1 text-xs text-brand-600">{s.hint}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {isError && (
        <p className="mt-6 text-sm text-ink-500">
          Unable to load acquisitions data. Ensure the API and database are running.
        </p>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Incoming Shipments</h2>
              <span className="text-sm font-medium text-brand-600">View All</span>
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
                {data?.shipments.map((s) => (
                  <tr key={s.id} className="border-t border-ink-700/5">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            s.imageUrl ||
                            gemPlaceholder(s.name, paletteFor(undefined))
                          }
                          alt=""
                          className="h-8 w-8 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{s.name}</p>
                          {s.sub && (
                            <p className="text-xs text-ink-500">{s.sub}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand-600" />
                        {s.origin}
                      </div>
                    </td>
                    <td>
                      <ShipmentStatusBadge status={s.status} />
                    </td>
                    <td className="text-brand-600">{formatEta(s.eta)}</td>
                  </tr>
                ))}
                {!isLoading && data?.shipments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-ink-500">
                      No incoming shipments.
                    </td>
                  </tr>
                )}
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
              {data?.origins.map((origin) => (
                <li
                  key={origin.origin}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium">{origin.origin}</p>
                    <p className="text-xs text-ink-500">{origin.summary}</p>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-ink-400" />
                </li>
              ))}
              {!isLoading && data?.origins.length === 0 && (
                <li className="text-sm text-ink-500">No active origins.</li>
              )}
            </ul>
          </CardBody>
        </Card>
      </div>

      <NewAcquisitionSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
