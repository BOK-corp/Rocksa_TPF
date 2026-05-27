import { createFileRoute } from "@tanstack/react-router";
import {
  CategoryListing,
  type ListingSearch,
} from "../../../components/CategoryListing.tsx";

export const Route = createFileRoute("/c/$category/")({
  component: CategoryPage,
  validateSearch: (search: Record<string, unknown>): ListingSearch => ({
    sub: typeof search["sub"] === "string" ? search["sub"] : undefined,
    sort: search["sort"] as ListingSearch["sort"],
    minPrice: search["minPrice"] ? Number(search["minPrice"]) : undefined,
    maxPrice: search["maxPrice"] ? Number(search["maxPrice"]) : undefined,
  }),
});

function CategoryPage() {
  const { category } = Route.useParams();
  const search = Route.useSearch();
  return <CategoryListing category={category} search={search} />;
}
