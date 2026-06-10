import type { Category, Specimen } from "./types.ts";

export type ListingSort = "newest" | "price-asc" | "price-desc";

export interface ListingFilters {
  category?: Category;
  subcategory?: string;
  color?: string;
  clarity?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
}

export const filterSpecimens = (
  items: ReadonlyArray<Specimen>,
  filters: ListingFilters,
): Specimen[] =>
  items.filter((s) => {
    if (filters.category && s.category !== filters.category) return false;
    if (filters.subcategory && s.subcategory !== filters.subcategory) return false;
    if (filters.color && s.attributes["Color"] !== filters.color) return false;
    if (filters.clarity && s.attributes["Clarity"] !== filters.clarity)
      return false;
    if (
      filters.minPriceCents !== undefined &&
      s.priceCents < filters.minPriceCents
    )
      return false;
    if (
      filters.maxPriceCents !== undefined &&
      s.priceCents > filters.maxPriceCents
    )
      return false;
    return true;
  });

export const sortSpecimens = (
  items: ReadonlyArray<Specimen>,
  sort: ListingSort = "newest",
): Specimen[] => {
  const copy = [...items];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.priceCents - b.priceCents);
    case "price-desc":
      return copy.sort((a, b) => b.priceCents - a.priceCents);
    default:
      return copy;
  }
};

export const applyListing = (
  items: ReadonlyArray<Specimen>,
  filters: ListingFilters,
  sort: ListingSort = "newest",
): Specimen[] => sortSpecimens(filterSpecimens(items, filters), sort);

export const attributeValues = (
  items: ReadonlyArray<Specimen>,
  key: string,
): string[] =>
  Array.from(
    new Set(
      items
        .map((s) => s.attributes[key])
        .filter((v): v is string => typeof v === "string" && v.length > 0),
    ),
  ).sort();
