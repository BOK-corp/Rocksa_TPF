import { Link } from "@tanstack/react-router";
import { Badge } from "@rocksa/ui";
import { formatPrice, type Specimen } from "@rocksa/domain";
import { PlusIcon, StarIcon } from "./Icons.tsx";
import { useCart } from "../state/cart.tsx";

interface Props {
  specimen: Specimen;
  rating?: number;
  variant?: "rail" | "grid";
}

export const ProductCard = ({ specimen, rating, variant = "rail" }: Props) => {
  const { add } = useCart();

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-ink-700/5 bg-white">
      <Link
        to="/c/$category/p/$slug"
        params={{ category: specimen.category, slug: specimen.slug }}
        search={{ modal: true }}
        className="relative block aspect-square overflow-hidden bg-surface-soft"
      >
        {specimen.stockStatus === "low_stock" && (
          <Badge tone="brand" className="absolute left-3 top-3 z-10">
            LOW STOCK
          </Badge>
        )}
        {specimen.stockStatus === "in_stock" && variant === "rail" && (
          <Badge tone="neutral" className="absolute left-3 top-3 z-10 bg-surface-muted">
            IN STOCK
          </Badge>
        )}
        <img
          src={specimen.imageUrl}
          alt={specimen.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[11px] uppercase tracking-wider text-ink-500">
          {specimen.subcategory ?? specimen.category}
        </p>
        <h3 className="font-display text-lg leading-tight">{specimen.name}</h3>
        <p className="line-clamp-2 text-xs text-ink-500">
          {specimen.description}
        </p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            {variant === "grid" && typeof rating === "number" && (
              <p className="flex items-center gap-1 text-xs text-ink-500">
                <StarIcon className="h-3 w-3 text-ink-700" /> {rating.toFixed(1)}
              </p>
            )}
            <p className="font-display text-lg text-brand-600">
              {formatPrice(specimen.priceCents)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => add(specimen)}
            aria-label={`Add ${specimen.name} to cart`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-brand-200 text-brand-600 hover:bg-brand-50"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
