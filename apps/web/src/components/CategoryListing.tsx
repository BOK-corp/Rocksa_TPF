import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@rocksa/ui";
import type { Category } from "@rocksa/domain";
import { TopNav } from "./TopNav.tsx";
import { CategorySidebar } from "./CategorySidebar.tsx";
import { ProductCard } from "./ProductCard.tsx";
import { useSpecimens } from "../data/api-specimens.ts";

export interface ListingSearch {
  sub?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  minPrice?: number;
  maxPrice?: number;
}

const RATINGS = [4.9, 4.7, 5.0, 4.6, 4.8, 4.5, 4.9];
const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);

interface Props {
  category: string;
  search: ListingSearch;
  /** When true (modal background), filter controls are inert. */
  inert?: boolean;
}

export const CategoryListing = ({ category, search, inert = false }: Props) => {
  const navigate = useNavigate();
  const { data: all = [], isLoading } = useSpecimens();

  const items = useMemo(() => {
    return all
      .filter((s) => s.category === (category as Category))
      .filter((s) => {
        if (search.sub && s.subcategory !== search.sub) return false;
        if (search.minPrice && s.priceCents < search.minPrice * 100) return false;
        if (search.maxPrice && s.priceCents > search.maxPrice * 100) return false;
        return true;
      });
  }, [all, category, search]);

  const subcategories = useMemo(
    () =>
      Array.from(
        new Set(
          all
            .filter((s) => s.category === (category as Category))
            .map((s) => s.subcategory)
            .filter((v): v is string => !!v),
        ),
      ),
    [all, category],
  );

  const setSearch = (next: Partial<ListingSearch>) => {
    if (inert) return;
    navigate({
      to: "/c/$category",
      params: { category },
      search: (prev) => ({ ...prev, ...next }) as ListingSearch,
    });
  };

  return (
    <div aria-hidden={inert} className={inert ? "pointer-events-none" : ""}>
      <TopNav />
      <div className="flex">
        <CategorySidebar />
        <main className="flex-1 px-10 py-10">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-display text-5xl">{titleCase(category)}</h1>
              <p className="text-ink-500 mt-1">
                Displaying {items.length} curated specimens.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-ink-500">Sort By:</span>
              <Select
                value={search.sort ?? "newest"}
                onValueChange={(v) =>
                  setSearch({ sort: v as ListingSearch["sort"] })
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-asc">Price ↑</SelectItem>
                  <SelectItem value="price-desc">Price ↓</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
            <aside className="space-y-6 text-sm">
              {subcategories.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-500">
                    Sub-categories
                  </p>
                  <div className="mt-3 space-y-2">
                    {subcategories.map((sub) => (
                      <label
                        key={sub}
                        className="flex items-center gap-2 text-ink-700"
                      >
                        <Checkbox
                          checked={search.sub === sub}
                          onCheckedChange={(v) =>
                            setSearch({ sub: v ? sub : undefined })
                          }
                        />
                        {sub}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-500">
                  Filters
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <Label htmlFor="price-min">Price Range</Label>
                    <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <Input
                        id="price-min"
                        placeholder="Min"
                        inputMode="numeric"
                        defaultValue={search.minPrice ?? ""}
                        onBlur={(e) =>
                          setSearch({
                            minPrice: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                      />
                      <span className="text-ink-400">–</span>
                      <Input
                        placeholder="Max"
                        inputMode="numeric"
                        defaultValue={search.maxPrice ?? ""}
                        onBlur={(e) =>
                          setSearch({
                            maxPrice: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/5]" />
                  ))
                : items.map((s, i) => (
                    <ProductCard
                      key={s.id}
                      specimen={s}
                      rating={RATINGS[i % RATINGS.length]}
                      variant="grid"
                    />
                  ))}
              {!isLoading && items.length === 0 && (
                <p className="col-span-full rounded-md border border-dashed border-ink-700/10 bg-white p-10 text-center text-ink-500">
                  No specimens match these filters.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
