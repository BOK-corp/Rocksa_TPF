import type { ListingSearch } from "./lib/listing-search.ts";

declare module "@tanstack/react-router" {
  interface HistoryState {
    listingSearch?: ListingSearch;
  }
}
