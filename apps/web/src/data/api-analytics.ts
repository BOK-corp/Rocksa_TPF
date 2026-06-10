import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.ts";

export type AnalyticsRange = "12m" | "3y" | "all";
export type TrajectoryRange = "1y" | "3y" | "all";

export interface AnalyticsResponse {
  range: AnalyticsRange;
  trajectory: TrajectoryRange;
  stats: {
    totalPortfolioValueCents: number;
    totalSpecimens: number;
    averageAcquisitionCostCents: number;
    highestValuedAsset: { name: string; priceCents: number } | null;
    yoyChangePct: number;
    momChangePct: number;
  };
  trajectoryPoints: Array<{
    month: string;
    label: string;
    valueCents: number;
  }>;
  distribution: Array<{
    category: string;
    count: number;
    pct: number;
  }>;
}

export const fetchAnalytics = (
  range: AnalyticsRange,
  trajectory: TrajectoryRange,
): Promise<AnalyticsResponse> =>
  api(`/v1/analytics?range=${range}&trajectory=${trajectory}`);

export const useAnalytics = (
  range: AnalyticsRange,
  trajectory: TrajectoryRange,
) =>
  useQuery({
    queryKey: ["analytics", range, trajectory] as const,
    queryFn: () => fetchAnalytics(range, trajectory),
    staleTime: 30_000,
  });
