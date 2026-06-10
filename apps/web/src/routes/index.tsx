import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Card, CardBody } from "@rocksa/ui";
import { TopNav } from "../components/TopNav.tsx";
import { CategorySidebar } from "../components/CategorySidebar.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { ArrowRightIcon, ChevronIcon } from "../components/Icons.tsx";
import { useSpecimens } from "../data/api-specimens.ts";
import { specimensQueryOptions } from "../data/specimens-query.ts";

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(specimensQueryOptions),
  component: Landing,
});

const PAGE_SIZE = 4;

function Landing() {
  const { data = [] } = useSpecimens();
  const [page, setPage] = useState(0);
  const featured =
    data.find((s) => s.slug === "amethyst-geode-slice") ??
    data.find((s) => s.category === "crystals") ??
    data[0];
  const maxPage = Math.max(0, Math.ceil(data.length / PAGE_SIZE) - 1);
  const trending = data.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div>
      <TopNav />
      <div className="flex">
        <CategorySidebar heading="The Collection" subheading="Curator's Workspace" />
        <main className="flex-1 px-10 py-10">
          <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="relative overflow-hidden rounded-md bg-ink-900 text-white">
              {featured && (
                <img
                  src={featured.imageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
              )}
              <div className="relative z-10 max-w-md p-8">
                <Badge tone="brand" className="bg-brand-200/90 text-brand-700">
                  NEW ACQUISITION
                </Badge>
                <h1 className="font-display text-4xl mt-4 leading-tight">
                  {featured?.name ?? "Featured Specimen"}
                </h1>
                <p className="text-sm mt-3 text-white/85 max-w-sm">
                  {featured?.description ??
                    "Exceptional clarity and saturation from our latest catalog."}
                </p>
                <Button asChild className="mt-6">
                  <Link
                    to="/c/$category"
                    params={{ category: featured?.category ?? "crystals" }}
                  >
                    Explore Collection <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardBody>
                  <h3 className="font-display text-xl">Curator's Notes</h3>
                  <p className="text-sm text-ink-500 mt-2">
                    Recent assay confirms high silica purity and optimal crystalline structure
                    across the latest batch of South American imports.
                  </p>
                  <a className="mt-3 inline-block text-sm font-medium text-brand-600">
                    READ FULL REPORT
                  </a>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h3 className="font-display text-xl">Investment Grade</h3>
                  <p className="text-sm text-ink-500 mt-2">
                    Track market values and historical data for premium mineral acquisitions within
                    your workspace.
                  </p>
                  <a className="mt-3 inline-block text-sm font-medium text-brand-600">
                    VIEW METRICS
                  </a>
                </CardBody>
              </Card>
            </div>
          </section>

          <section className="mt-12">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl">Trending Now</h2>
              <div className="flex gap-2 text-ink-500">
                <button
                  type="button"
                  aria-label="Previous specimens"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-ink-700/10 disabled:opacity-40"
                >
                  <ChevronIcon className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="Next specimens"
                  disabled={page >= maxPage}
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-ink-700/10 disabled:opacity-40"
                >
                  <ChevronIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trending.map((s) => (
                <ProductCard key={s.id} specimen={s} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
