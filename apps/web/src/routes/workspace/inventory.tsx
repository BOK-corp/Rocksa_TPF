import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, CardBody } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useSpecimens } from "../../data/api-specimens.ts";
import { PlusIcon } from "../../components/Icons.tsx";
import { WorkspacePageHeader } from "../../components/WorkspacePageHeader.tsx";

export const Route = createFileRoute("/workspace/inventory")({ component: Inventory });

const STATUS_TONE = {
  in_stock: "brand",
  low_stock: "warning",
  on_display: "neutral",
  reserved: "warning",
  sold: "danger",
} as const;

function Inventory() {
  const { data: items = [] } = useSpecimens();

  return (
    <div className="p-6 md:p-10">
      <WorkspacePageHeader
        title="Inventory"
        subtitle="Manage and track your comprehensive gemstone and mineral collection."
        action={
          <Button>
            <PlusIcon className="h-4 w-4" /> Add New Specimen
          </Button>
        }
      />

      <div className="mt-8 flex items-center justify-between rounded-md border border-ink-700/5 bg-white p-3">
        <div className="flex gap-2">
          {["All", "Igneous", "Crystals", "Metamorphic"].map((t, i) => (
            <button
              key={t}
              className={
                "rounded-full px-4 py-1.5 text-sm " +
                (i === 0 ? "bg-ink-900 text-white" : "border border-ink-700/10 text-ink-700")
              }
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-sm text-ink-500">
          Sort by: <span className="text-ink-900">Date Added (Newest)</span>
        </p>
      </div>

      <Card className="mt-4">
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                <th className="px-6 py-3">Specimen</th>
                <th>ID</th>
                <th>Category</th>
                <th>Status</th>
                <th>Value</th>
                <th className="px-6">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-t border-ink-700/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={s.imageUrl} alt="" className="h-10 w-10 rounded-md object-cover" />
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-ink-500">
                    #{s.category.slice(0, 3).toUpperCase()}-{s.id.padStart(3, "0")}
                  </td>
                  <td className="capitalize">{s.category}</td>
                  <td>
                    <Badge tone={STATUS_TONE[s.stockStatus]}>
                      {s.stockStatus.replace("_", " ")}
                    </Badge>
                  </td>
                  <td>{formatPrice(s.priceCents)}</td>
                  <td className="px-6">Oct {((Number(s.id) * 3) % 28) + 1}, 2024</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-ink-700/5 px-6 py-3 text-sm text-ink-500">
            <span>Showing 1–{items.length} of 124 specimens</span>
            <div className="flex gap-2">
              <button className="h-8 w-8 rounded-md border border-ink-700/10">‹</button>
              <button className="h-8 w-8 rounded-md border border-ink-700/10">›</button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
