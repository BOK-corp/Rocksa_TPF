import { createFileRoute } from "@tanstack/react-router";
import { CategoryListing } from "../../../components/CategoryListing.tsx";
import { specimensQueryOptions } from "../../../data/specimens-query.ts";
import { parseListingSearch } from "../../../lib/listing-search.ts";

export const Route = createFileRoute("/c/$category/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(specimensQueryOptions),
  validateSearch: parseListingSearch,
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const search = Route.useSearch();
  return <CategoryListing category={category} search={search} />;
}
