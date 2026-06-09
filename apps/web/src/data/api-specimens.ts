import { useQuery } from "@tanstack/react-query";
import type { Specimen } from "@rocksa/domain";
import { apiOptional } from "../lib/api.ts";
import { SPECIMENS } from "./specimens.ts";
import { gemPlaceholder, paletteFor } from "./placeholder.ts";

interface SpecimenRow {
  slug: string;
  name: string;
  category: Specimen["category"];
  subcategory: string | null;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  stockStatus: Specimen["stockStatus"];
  originCountry: string | null;
  imageUrl: string;
  attributes: Record<string, string>;
  createdAt?: string;
}

const normalize = (r: SpecimenRow): Specimen => ({
  // id === slug so the rest of the SPA (cart lookups) keeps working.
  id: r.slug,
  slug: r.slug,
  name: r.name,
  category: r.category,
  subcategory: r.subcategory,
  description: r.description,
  priceCents: r.priceCents,
  compareAtCents: r.compareAtCents,
  stockStatus: r.stockStatus,
  originCountry: r.originCountry,
  imageUrl: r.imageUrl || gemPlaceholder(r.slug, paletteFor(r.attributes?.["Color"])),
  attributes: r.attributes ?? {},
});

const fetchAll = async (): Promise<Specimen[]> => {
  const res = await apiOptional<{ items: SpecimenRow[] }>("/v1/specimens", {
    auth: false,
  });
  return res ? res.items.map(normalize) : SPECIMENS;
};

const fetchOne = async (slug: string): Promise<Specimen | undefined> => {
  const res = await apiOptional<{ item: SpecimenRow }>(`/v1/specimens/${slug}`, {
    auth: false,
  });
  return res ? normalize(res.item) : SPECIMENS.find((s) => s.slug === slug);
};

export const useSpecimens = () =>
  useQuery({ queryKey: ["specimens"], queryFn: fetchAll, staleTime: 60_000 });

export const useSpecimen = (slug: string) =>
  useQuery({
    queryKey: ["specimen", slug],
    queryFn: () => fetchOne(slug),
    staleTime: 60_000,
  });

export const useSpecimensByCategory = (category: string) =>
  useQuery({
    queryKey: ["specimens", category],
    queryFn: async () => (await fetchAll()).filter((s) => s.category === category),
    staleTime: 60_000,
  });

export const useSpecimenLookup = (): ((id: string) => Specimen | undefined) => {
  const { data = [] } = useSpecimens();
  const byId = new Map(data.map((s) => [s.id, s]));
  return (id) => byId.get(id);
};
