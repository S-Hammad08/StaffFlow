import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { ReportSummary } from "../types/report.types";

export async function getReportSummary() {
  const response = await api.get<ApiResponse<ReportSummary>>("/reports/summary");
  return response.data.data;
}

export const reportKeys = {
  all: ["reports"] as const,
  summary: () => [...reportKeys.all, "summary"] as const,
};
