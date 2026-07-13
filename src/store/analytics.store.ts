import { create } from "zustand";
import { analyticsService } from "@/services/analytics.service";
import { AnalyticsData } from "@/types/analytics";

interface AnalyticsState {
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;

  fetchAnalytics: () => Promise<void>;
  exportCsvReport: () => Promise<void>;
  exportPdfReport: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  analytics: null,
  isLoading: false,
  error: null,

  fetchAnalytics: async () => {
    const hasData = get().analytics !== null;
    if (!hasData) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await analyticsService.getAnalytics();
      if (response.success) {
        set({ analytics: response.data });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load system analytics" });
    } finally {
      set({ isLoading: false });
    }
  },

  exportCsvReport: async () => {
    try {
      const blob = await analyticsService.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `analytics-summary-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("CSV Export failed", err);
    }
  },

  exportPdfReport: async () => {
    try {
      const blob = await analyticsService.exportPdf();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `analytics-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF Export failed", err);
    }
  },
}));
