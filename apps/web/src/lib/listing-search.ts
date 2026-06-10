import type { ListingSort } from "@rocksa/domain";

export interface ListingSearch {
  sub?: string;
  sort?: ListingSort;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  clarity?: string;
}

export interface ListingLocationState {
  listingSearch?: ListingSearch;
}

export const parseListingSearch = (
  search: Record<string, unknown>,
): ListingSearch => ({
  sub: typeof search["sub"] === "string" ? search["sub"] : undefined,
  sort:
    search["sort"] === "price-asc" ||
    search["sort"] === "price-desc" ||
    search["sort"] === "newest"
      ? search["sort"]
      : undefined,
  minPrice:
    search["minPrice"] !== undefined && search["minPrice"] !== ""
      ? Number(search["minPrice"])
      : undefined,
  maxPrice:
    search["maxPrice"] !== undefined && search["maxPrice"] !== ""
      ? Number(search["maxPrice"])
      : undefined,
  color: typeof search["color"] === "string" ? search["color"] : undefined,
  clarity:
    typeof search["clarity"] === "string" ? search["clarity"] : undefined,
});
