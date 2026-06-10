import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, apiDownload } from "../lib/api.ts";

const API_BASE =
  (import.meta.env["VITE_API_URL"] as string | undefined) ??
  "http://localhost:8787";

export type ReportKind =
  | "financial_valuation"
  | "inventory_audit"
  | "tax_compliance";

export interface ReportRow {
  id: string;
  kind: ReportKind;
  title: string;
  generatedAt: string | null;
  fileUrl: string | null;
  fileSizeBytes: number | null;
}

export interface ScheduleRow {
  id: string;
  kind: ReportKind;
  title: string;
  cronSchedule: string | null;
  enabled: boolean;
}

interface ReportsResponse {
  library: ReportRow[];
  schedules: ScheduleRow[];
}

export const fetchReports = (): Promise<ReportsResponse> => api("/v1/reports");

export const useReports = () =>
  useQuery({
    queryKey: ["reports"] as const,
    queryFn: fetchReports,
    staleTime: 15_000,
  });

export const downloadReport = async (
  fileUrl: string | null,
  filename: string,
): Promise<void> => {
  if (!fileUrl) return;
  const path = fileUrl.startsWith("http")
    ? fileUrl.replace(API_BASE, "")
    : fileUrl;
  await apiDownload(path, filename);
};

export const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return "—";
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
};

export const useGenerateReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (kind: ReportKind) =>
      api<{ report: ReportRow & { jobId: string; status: string } }>(
        "/v1/reports/generate",
        { method: "POST", body: { kind } },
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useToggleSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      api(`/v1/reports/schedules/${id}`, {
        method: "PATCH",
        body: { enabled },
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};
