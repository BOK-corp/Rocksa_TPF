import { queryOptions } from "@tanstack/react-query";
import type { Specimen } from "@rocksa/domain";
import { apiOptional } from "../lib/api.ts";
import { SPECIMENS } from "./specimens.ts";
import { gemPlaceholder, paletteFor } from "./placeholder.ts";

export interface SpecimenRow {
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

export const normalizeSpecimen = (r: SpecimenRow): Specimen => ({
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
  imageUrl:
    r.imageUrl || gemPlaceholder(r.slug, paletteFor(r.attributes?.["Color"])),
  attributes: r.attributes ?? {},
});

export const fetchAllSpecimens = async (): Promise<Specimen[]> => {
  const res = await apiOptional<{ items: SpecimenRow[] }>("/v1/specimens", {
    auth: false,
  });
  return res ? res.items.map(normalizeSpecimen) : SPECIMENS;
};

export const fetchSpecimen = async (
  slug: string,
): Promise<Specimen | undefined> => {
  const res = await apiOptional<{ item: SpecimenRow }>(`/v1/specimens/${slug}`, {
    auth: false,
  });
  return res
    ? normalizeSpecimen(res.item)
    : SPECIMENS.find((s) => s.slug === slug);
};

export const specimensQueryOptions = queryOptions({
  queryKey: ["specimens"] as const,
  queryFn: fetchAllSpecimens,
  staleTime: 60_000,
});

export const specimenQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["specimen", slug] as const,
    queryFn: () => fetchSpecimen(slug),
    staleTime: 60_000,
  });
