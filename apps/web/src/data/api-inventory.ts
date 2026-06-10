import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, StockStatus } from "@rocksa/domain";
import { api } from "../lib/api.ts";

export interface InventorySpecimenRow {
  slug: string;
  name: string;
  category: Category;
  stockStatus: StockStatus;
  priceCents: number;
  imageUrl: string;
  createdAt: string;
}

export interface InventoryShipmentRow {
  id: string;
  name: string;
  sub: string;
  origin: string;
  status: string;
  eta: string | null;
  imageUrl: string;
}

export interface InventoryActivityRow {
  id: string;
  title: string;
  createdAt: string;
}

export interface InventoryOriginRow {
  origin: string;
  summary: string;
  pendingLabel: string;
}

interface OverviewResponse {
  stats: {
    totalAcquisitions: number;
    acquisitionsThisMonth: number;
    collectionValueCents: number;
    pendingShipments: number;
    delayedShipments: number;
  };
  shipments: InventoryShipmentRow[];
  activity: InventoryActivityRow[];
}

interface AcquisitionsResponse {
  stats: {
    activeShipments: number;
    arrivingThisWeek: number;
    pendingClearance: number;
    pipelineValueCents: number;
    originCount: number;
    totalSpecimens: number;
  };
  shipments: InventoryShipmentRow[];
  origins: InventoryOriginRow[];
}

interface InventoryListResponse {
  items: InventorySpecimenRow[];
  total: number;
  nextCursor: string | null;
}

const inventoryKey = (
  view: string,
  params?: Record<string, string | undefined>,
) => ["inventory", view, params] as const;

export const fetchInventoryOverview = (): Promise<OverviewResponse> =>
  api("/v1/inventory?view=overview");

export const fetchInventoryAcquisitions = (): Promise<AcquisitionsResponse> =>
  api("/v1/inventory?view=acquisitions");

export const fetchInventoryList = (params: {
  category?: string;
  cursor?: string;
  limit?: number;
}): Promise<InventoryListResponse> => {
  const search = new URLSearchParams({ view: "inventory" });
  if (params.category) search.set("category", params.category);
  if (params.cursor) search.set("cursor", params.cursor);
  if (params.limit) search.set("limit", String(params.limit));
  return api(`/v1/inventory?${search.toString()}`);
};

export const useInventoryOverview = () =>
  useQuery({
    queryKey: inventoryKey("overview"),
    queryFn: fetchInventoryOverview,
    staleTime: 30_000,
  });

export const useInventoryAcquisitions = () =>
  useQuery({
    queryKey: inventoryKey("acquisitions"),
    queryFn: fetchInventoryAcquisitions,
    staleTime: 30_000,
  });

export const useInventoryList = (category: string, cursor?: string) =>
  useQuery({
    queryKey: inventoryKey("inventory", { category, cursor }),
    queryFn: () => fetchInventoryList({ category, cursor, limit: 20 }),
    staleTime: 30_000,
  });

export interface CreateSpecimenInput {
  name: string;
  category: Category;
  subcategory?: string;
  description: string;
  priceCents: number;
  originCountry?: string;
  stockStatus?: StockStatus;
}

export interface CreateAcquisitionInput {
  name: string;
  origin: string;
  category: Category;
  estimatedValueCents: number;
  notes?: string;
}

export const useCreateSpecimen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSpecimenInput) =>
      api("/v1/inventory/specimens", { method: "POST", body: input }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["inventory"] });
      await qc.invalidateQueries({ queryKey: ["specimens"] });
    },
  });
};

export const useCreateAcquisition = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAcquisitionInput) =>
      api("/v1/inventory/acquisitions", { method: "POST", body: input }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};
