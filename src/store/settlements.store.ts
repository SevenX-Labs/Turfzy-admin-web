import { create } from "zustand";
import { settlementsService } from "@/services/settlements.service";
import { SettlementItem, SettlementPagination } from "@/types/settlements";

interface SettlementsState {
  settlements: SettlementItem[];
  pagination: SettlementPagination | null;
  selectedSettlement: SettlementItem | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
  statusFilter: string; // "ALL", "PENDING", "PAID", "COMPLETED"
  currentPage: number;

  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  fetchSettlements: () => Promise<void>;
  fetchSettlementDetails: (id: string) => Promise<void>;
  createManualSettlement: (payload: {
    ownerProfileId: string;
    amount: number;
    notes?: string;
    bookingCount?: number;
    period?: string;
  }) => Promise<boolean>;
  markAsPaid: (id: string, payload: { txRef: string; notes?: string }) => Promise<boolean>;
  exportCsvReport: () => Promise<void>;
  exportPdfReport: () => Promise<void>;
  clearSelectedSettlement: () => void;
}

export const useSettlementsStore = create<SettlementsState>((set, get) => ({
  settlements: [],
  pagination: null,
  selectedSettlement: null,
  isLoading: false,
  isActionLoading: false,
  error: null,
  statusFilter: "ALL",
  currentPage: 1,

  setStatusFilter: (status) => {
    set({ statusFilter: status, currentPage: 1 });
    get().fetchSettlements();
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().fetchSettlements();
  },

  fetchSettlements: async () => {
    const hasData = get().settlements.length > 0;
    if (!hasData) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const { statusFilter, currentPage } = get();
      const statusParam = statusFilter === "ALL" ? undefined : statusFilter;
      const response = await settlementsService.getSettlements({
        status: statusParam,
        page: currentPage,
        limit: 10,
      });
      if (response.success) {
        set({
          settlements: response.data.settlements,
          pagination: response.data.pagination,
        });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch settlements" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSettlementDetails: async (id) => {
    const hasDetails = get().selectedSettlement?.id === id;
    if (!hasDetails) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await settlementsService.getSettlementDetails(id);
      if (response.success) {
        set({ selectedSettlement: response.data });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load settlement details" });
    } finally {
      set({ isLoading: false });
    }
  },

  createManualSettlement: async (payload) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await settlementsService.createSettlement(payload);
      if (response.success) {
        get().fetchSettlements();
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create manual settlement" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  markAsPaid: async (id, payload) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await settlementsService.paySettlement(id, payload);
      if (response.success) {
        set({ selectedSettlement: response.data });
        get().fetchSettlements();
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to submit payment reference" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  exportCsvReport: async () => {
    try {
      const { statusFilter } = get();
      const statusParam = statusFilter === "ALL" ? undefined : statusFilter;
      const blob = await settlementsService.exportCsv(statusParam);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `settlements-report-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("CSV Export failed", err);
    }
  },

  exportPdfReport: async () => {
    try {
      const { statusFilter } = get();
      const statusParam = statusFilter === "ALL" ? undefined : statusFilter;
      const blob = await settlementsService.exportPdf(statusParam);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `settlements-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF Export failed", err);
    }
  },

  clearSelectedSettlement: () => {
    set({ selectedSettlement: null });
  },
}));
