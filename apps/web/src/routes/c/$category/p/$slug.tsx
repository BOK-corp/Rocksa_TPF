import { createFileRoute, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Dialog,
  DialogContent,
  Separator,
} from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { useSpecimen } from "../../../../data/api-specimens.ts";
import {
  specimenQueryOptions,
  specimensQueryOptions,
} from "../../../../data/specimens-query.ts";
import {
  CloseIcon,
  ShareIcon,
  ShieldIcon,
} from "../../../../components/Icons.tsx";
import { CategoryListing } from "../../../../components/CategoryListing.tsx";
import { TopNav } from "../../../../components/TopNav.tsx";
import { useCart } from "../../../../state/cart.tsx";
import { restoreListingScroll } from "../../../../lib/listing-scroll.ts";

interface Search {
  modal?: boolean;
}

export const Route = createFileRoute("/c/$category/p/$slug")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(specimensQueryOptions);
    return context.queryClient.ensureQueryData(
      specimenQueryOptions(params.slug),
    );
  },
  component: ProductRoute,
  validateSearch: (s: Record<string, unknown>): Search => ({
    modal: s["modal"] === "1" || s["modal"] === true || s["modal"] === "true",
  }),
});

function ProductRoute() {
  const { slug, category } = Route.useParams();
  const { modal } = Route.useSearch();
  const location = useLocation();
  const listingSearch = location.state?.listingSearch ?? {};
  const { data: specimen, isLoading } = useSpecimen(slug);
  const navigate = useNavigate();
  const { add } = useCart();
  const [reportOpen, setReportOpen] = useState(true);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-ink-500">
        Loading…
      </main>
    );
  }

  if (!specimen) {
    return (
      <main className="p-10">
        <p className="text-ink-500">Specimen not found.</p>
        <Link to="/c/$category" params={{ category }} className="text-brand-600">
          ← Back to category
        </Link>
      </main>
    );
  }

  const sku = `SAP-${specimen.slug.slice(0, 4).toUpperCase()}`;
  const curatorNote =
    specimen.originCountry &&
    `Sourced from ${specimen.originCountry}, this specimen was hand-selected for saturation, clarity, and provenance documentation suitable for editorial presentation.`;

  const body = (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="rounded-md border border-ink-700/5 bg-white p-6">
        <img
          src={specimen.imageUrl}
          alt={specimen.name}
          className="aspect-square w-full rounded-md object-cover"
        />
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              className={
                "aspect-square overflow-hidden rounded-md border " +
                (i === 0 ? "border-brand-600" : "border-ink-700/10")
              }
            >
              <img
                src={specimen.imageUrl}
                alt=""
                className="h-full w-full object-cover opacity-80"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2 text-xs">
          <Badge tone="neutral">{sku}</Badge>
          <Badge
            tone={specimen.stockStatus === "in_stock" ? "success" : "warning"}
          >
            ● {specimen.stockStatus.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
        <h2 className="font-display text-4xl leading-tight">{specimen.name}</h2>
        <div className="flex items-baseline gap-3">
          <p className="font-display text-3xl text-brand-600">
            {formatPrice(specimen.priceCents)}
          </p>
          {specimen.compareAtCents && (
            <p className="text-ink-400 line-through">
              {formatPrice(specimen.compareAtCents)}
            </p>
          )}
        </div>
        <p className="text-sm text-ink-700 leading-relaxed">
          {specimen.description}
        </p>
        <Separator />
        <div className="flex gap-3">
          <Button className="flex-1" onClick={() => add(specimen)}>
            <ShieldIcon className="h-4 w-4" /> Add to Collection
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href);
            }}
          >
            <ShareIcon className="h-4 w-4" /> Share
          </Button>
        </div>

        <Card>
          <CardBody>
            <button
              type="button"
              className="flex w-full items-center justify-between text-left"
              onClick={() => setReportOpen((v) => !v)}
              aria-expanded={reportOpen}
            >
              <p className="font-display text-lg">Gemological Report</p>
              <span className="text-brand-600">{reportOpen ? "▾" : "▸"}</span>
            </button>
            {reportOpen && (
              <>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {Object.entries(specimen.attributes).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-2 border-b border-ink-700/5 pb-2"
                    >
                      <dt className="text-ink-500">{k}</dt>
                      <dd className="font-medium text-ink-900">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-sm">
                  <p className="text-ink-700">↓ Full PDF Report</p>
                  <a className="text-brand-600">Download</a>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        {curatorNote && (
          <Card className="bg-brand-50/40">
            <CardBody>
              <p className="font-display text-lg">Curator's Note</p>
              <p className="mt-2 text-sm text-ink-700 leading-relaxed">
                {curatorNote}
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );

  const closeModal = () => {
    navigate({
      to: "/c/$category",
      params: { category },
      search: listingSearch,
    });
    restoreListingScroll();
  };

  if (modal) {
    return (
      <>
        <CategoryListing
          category={category}
          search={listingSearch}
          inert
        />
        <Dialog open onOpenChange={(open) => !open && closeModal()}>
          <DialogContent className="max-h-[90vh] w-[92vw] overflow-y-auto">
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-soft text-ink-700 hover:bg-ink-700/10"
            >
              <CloseIcon />
            </button>
            {body}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div>
      <TopNav />
      <div className="mx-auto max-w-6xl p-10">
        <Link
          to="/c/$category"
          params={{ category }}
          className="text-sm text-brand-600"
        >
          ← Back to {category}
        </Link>
        <div className="mt-6">{body}</div>
      </div>
    </div>
  );
}
