import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Card, CardBody, Skeleton } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { PlusIcon } from "../../components/Icons.tsx";
import { WorkspacePageHeader } from "../../components/WorkspacePageHeader.tsx";
import { AddSpecimenSheet } from "../../components/workspace/AddSpecimenSheet.tsx";
import { useInventoryList } from "../../data/api-inventory.ts";
import { gemPlaceholder, paletteFor } from "../../data/placeholder.ts";

export const Route = createFileRoute("/workspace/inventory")({ component: Inventory });

const FILTERS = [
  { key: "all", label: "All" },
  { key: "igneous", label: "Igneous" },
  { key: "crystals", label: "Crystals" },
  { key: "metamorphic", label: "Metamorphic" },
  { key: "sedimentary", label: "Sedimentary" },
] as const;

const STATUS_TONE = {
  in_stock: "brand",
  low_stock: "warning",
  on_display: "neutral",
  reserved: "warning",
  sold: "danger",
} as const;

const formatSpecimenId = (category: string, slug: string): string =>
  `#${category.slice(0, 3).toUpperCase()}-${slug.slice(0, 8).toUpperCase()}`;

const formatDateAdded = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function Inventory() {
  const [category, setCategory] = useState("all");
  const [cursor, setCursor] = useState<string | undefined>();
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data, isLoading, isError } = useInventoryList(category, cursor);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const start = cursorStack.length * 20 + 1;
  const end = Math.min(start + items.length - 1, total);

  const selectCategory = (key: string) => {
    setCategory(key);
    setCursor(undefined);
    setCursorStack([]);
  };

  const nextPage = () => {
    if (!data?.nextCursor) return;
    setCursorStack((prev) => [...prev, cursor ?? ""]);
    setCursor(data.nextCursor);
  };

  const prevPage = () => {
    if (cursorStack.length === 0) return;
    const prev = [...cursorStack];
    const last = prev.pop()!;
    setCursorStack(prev);
    setCursor(last || undefined);
  };

  return (
    <div className="p-6 md:p-10">
      <WorkspacePageHeader
        title="Inventory"
        subtitle="Manage and track your comprehensive gemstone and mineral collection."
        action={
          <Button onClick={() => setSheetOpen(true)}>
            <PlusIcon className="h-4 w-4" /> Add New Specimen
          </Button>
        }
      />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-md border border-ink-700/5 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => selectCategory(f.key)}
              className={
                "rounded-full px-4 py-1.5 text-sm " +
                (category === f.key
                  ? "bg-ink-900 text-white"
                  : "border border-ink-700/10 text-ink-700")
              }
            >
              {f.label}
            </button>
          ))}
          <button
            type="button"
            className="rounded-full border border-ink-700/10 px-4 py-1.5 text-sm text-ink-700"
          >
            Filters
          </button>
        </div>
        <p className="text-sm text-ink-500">
          Sort by: <span className="text-ink-900">Date Added (Newest)</span>
        </p>
      </div>

      <Card className="mt-4">
        <CardBody className="p-0">
          {isLoading && <Skeleton className="m-4 h-48 w-full" />}
          {isError && (
            <p className="p-6 text-sm text-ink-500">
              Unable to load inventory. Ensure the API is running and you are signed
              in as a curator.
            </p>
          )}
          {!isLoading && !isError && (
            <>
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
                    <tr key={s.slug} className="border-t border-ink-700/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              s.imageUrl ||
                              gemPlaceholder(s.slug, paletteFor(undefined))
                            }
                            alt=""
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-ink-500">
                        {formatSpecimenId(s.category, s.slug)}
                      </td>
                      <td className="capitalize">{s.category}</td>
                      <td>
                        <Badge tone={STATUS_TONE[s.stockStatus]}>
                          {s.stockStatus.replaceAll("_", " ")}
                        </Badge>
                      </td>
                      <td>{formatPrice(s.priceCents)}</td>
                      <td className="px-6">{formatDateAdded(s.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between border-t border-ink-700/5 px-6 py-3 text-sm text-ink-500">
                <span>
                  {total === 0
                    ? "No specimens found"
                    : `Showing ${start}–${end} of ${total} specimens`}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-md border border-ink-700/10 disabled:opacity-40"
                    onClick={prevPage}
                    disabled={cursorStack.length === 0}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="h-8 w-8 rounded-md border border-ink-700/10 disabled:opacity-40"
                    onClick={nextPage}
                    disabled={!data?.nextCursor}
                  >
                    ›
                  </button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <AddSpecimenSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
