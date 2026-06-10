import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody, Skeleton } from "@rocksa/ui";
import { TruckIcon, VaultIcon, DiamondIcon } from "../../components/Icons.tsx";
import { WorkspacePageHeader } from "../../components/WorkspacePageHeader.tsx";
import { ShipmentStatusBadge } from "../../components/ShipmentStatusBadge.tsx";
import { useInventoryOverview } from "../../data/api-inventory.ts";
import {
  formatCompactMoney,
  formatCount,
  formatEta,
  formatRelativeTime,
} from "../../lib/format-stats.ts";
import { gemPlaceholder, paletteFor } from "../../data/placeholder.ts";

export const Route = createFileRoute("/workspace/overview")({ component: Overview });

function Overview() {
  const { data, isLoading, isError } = useInventoryOverview();

  return (
    <div className="p-6 md:p-10">
      <WorkspacePageHeader
        title="Overview"
        subtitle="At-a-glance summary of your curated collection and recent logistical activities."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        {!isLoading && data && (
          <>
            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-wider text-ink-500">
                    Total Acquisitions
                  </p>
                  <VaultIcon className="text-brand-600" />
                </div>
                <p className="mt-3 font-display text-5xl">
                  {formatCount(data.stats.totalAcquisitions)}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  +{formatCount(data.stats.acquisitionsThisMonth)} this month
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-wider text-ink-500">
                    Collection Value
                  </p>
                  <DiamondIcon className="text-brand-600" />
                </div>
                <p className="mt-3 font-display text-5xl">
                  {formatCompactMoney(data.stats.collectionValueCents)}
                </p>
                <p className="mt-1 text-xs text-ink-400">Estimated</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-start justify-between">
                  <p className="text-xs uppercase tracking-wider text-ink-500">
                    Pending Shipments
                  </p>
                  <TruckIcon className="text-brand-600" />
                </div>
                <p className="mt-3 font-display text-5xl">
                  {formatCount(data.stats.pendingShipments)}
                </p>
                <p
                  className={
                    "mt-1 text-xs " +
                    (data.stats.delayedShipments > 0
                      ? "text-rose-600"
                      : "text-ink-400")
                  }
                >
                  {data.stats.delayedShipments > 0
                    ? `${formatCount(data.stats.delayedShipments)} delayed`
                    : "On schedule"}
                </p>
              </CardBody>
            </Card>
          </>
        )}
      </div>

      {isError && (
        <p className="mt-6 text-sm text-ink-500">
          Unable to load overview data. Ensure the API and database are running.
        </p>
      )}

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
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td>{s.origin}</td>
                    <td>
                      <ShipmentStatusBadge status={s.status} />
                    </td>
                    <td>{formatEta(s.eta)}</td>
                  </tr>
                ))}
                {!isLoading && data?.shipments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-ink-500">
                      No active shipments.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="font-display text-2xl">Recent Activity</h2>
            <ul className="mt-4 space-y-4">
              {data?.activity.map((a) => (
                <li key={a.id} className="flex gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                  <div>
                    <p className="text-ink-900">{a.title}</p>
                    <p className="text-xs text-ink-500">
                      {formatRelativeTime(a.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
              {!isLoading && data?.activity.length === 0 && (
                <li className="text-sm text-ink-500">No recent activity.</li>
              )}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
