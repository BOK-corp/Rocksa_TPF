import { useQuery } from "@tanstack/react-query";
import type { Specimen } from "@rocksa/domain";
import {
  fetchAllSpecimens,
  specimenQueryOptions,
  specimensQueryOptions,
} from "./specimens-query.ts";

export const useSpecimens = () => useQuery(specimensQueryOptions);

export const useSpecimen = (slug: string) => useQuery(specimenQueryOptions(slug));

export const useSpecimensByCategory = (category: string) =>
  useQuery({
    queryKey: ["specimens", "category", category] as const,
    queryFn: async () =>
      (await fetchAllSpecimens()).filter((s) => s.category === category),
    staleTime: 60_000,
  });

export const useSpecimenLookup = (): ((id: string) => Specimen | undefined) => {
  const { data = [] } = useSpecimens();
  const byId = new Map(data.map((s) => [s.id, s]));
  return (id) => byId.get(id);
};
