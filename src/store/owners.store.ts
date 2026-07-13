import { create } from "zustand";
import { ownersService } from "@/services/owners.service";
import { OwnerAuth, OwnerDetails, BankDetails, SettlementRecord } from "@/types/owners";

interface OwnersState {
  owners: OwnerAuth[];
  stats: {
    total: number;
    active: number;
    suspended: number;
  } | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null;
  selectedOwner: OwnerDetails | null;
  bankDetails: BankDetails | null;
  settlementHistory: SettlementRecord[];
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchOwners: (params: {
    search?: string;
    status?: "active" | "suspended";
    page?: number;
    limit?: number;
  }) => Promise<void>;
  
  fetchOwnerStats: () => Promise<void>;
  fetchOwnerDetails: (id: string) => Promise<void>;
  fetchOwnerBankDetails: (id: string) => Promise<void>;
  fetchOwnerSettlements: (id: string) => Promise<void>;
  
  suspendOwner: (id: string, reason: string) => Promise<boolean>;
  activateOwner: (id: string) => Promise<boolean>;
  
  exportCsv: () => Promise<void>;
  exportPdf: () => Promise<void>;
  
  clearSelectedOwner: () => void;
}

export const useOwnersStore = create<OwnersState>((set, get) => ({
  owners: [],
  stats: null,
  pagination: null,
  selectedOwner: null,
  bankDetails: null,
  settlementHistory: [],
  isLoading: false,
  isActionLoading: false,
  error: null,

  fetchOwners: async (params) => {
    const hasData = get().owners.length > 0;
    if (!hasData) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await ownersService.getOwners(params);
      if (response.success) {
        set({
          owners: response.data.owners,
          pagination: response.data.pagination,
        });
      } else {
        set({ error: "Failed to fetch owners" });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error fetching owners" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOwnerStats: async () => {
    if (get().stats) return; // Cache stats across navigation
    try {
      const [allRes, activeRes, suspendedRes] = await Promise.all([
        ownersService.getOwners({ limit: 1 }),
        ownersService.getOwners({ status: "active", limit: 1 }),
        ownersService.getOwners({ status: "suspended", limit: 1 }),
      ]);
      set({
        stats: {
          total: allRes.data.pagination.total,
          active: activeRes.data.pagination.total,
          suspended: suspendedRes.data.pagination.total,
        },
      });
    } catch (err) {
      console.error("Error fetching owner stats", err);
    }
  },

  fetchOwnerDetails: async (id) => {
    const hasDetails = get().selectedOwner?.owner.id === id;
    if (!hasDetails) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await ownersService.getOwnerDetails(id);
      if (response.success) {
        set({
          selectedOwner: response.data,
          bankDetails: response.data.bankDetails,
          settlementHistory: response.data.settlementSummary,
        });
      } else {
        set({ error: "Failed to fetch owner details" });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error fetching owner details" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOwnerBankDetails: async (id) => {
    try {
      const response = await ownersService.getBankDetails(id);
      if (response.success && "accountHolderName" in response.data) {
        set({ bankDetails: response.data as BankDetails });
      }
    } catch (err) {
      console.error("Error fetching owner bank details", err);
    }
  },

  fetchOwnerSettlements: async (id) => {
    try {
      const response = await ownersService.getSettlements(id);
      if (response.success) {
        set({ settlementHistory: response.data });
      }
    } catch (err) {
      console.error("Error fetching owner settlements", err);
    }
  },

  suspendOwner: async (id, reason) => {
    set({ isActionLoading: true });
    try {
      await ownersService.suspendOwner(id, reason);
      const selected = get().selectedOwner;
      if (selected && selected.owner.id === id) {
        await get().fetchOwnerDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to suspend owner" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  activateOwner: async (id) => {
    set({ isActionLoading: true });
    try {
      await ownersService.activateOwner(id);
      const selected = get().selectedOwner;
      if (selected && selected.owner.id === id) {
        await get().fetchOwnerDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to activate owner" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  exportCsv: async () => {
    try {
      const blob = await ownersService.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `owners_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      console.error("CSV Export failed", err);
    }
  },

  exportPdf: async () => {
    try {
      const blob = await ownersService.exportPdf();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `owners_report_${new Date().toISOString().slice(0,10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      console.error("PDF Export failed", err);
    }
  },

  clearSelectedOwner: () => {
    set({ selectedOwner: null, bankDetails: null, settlementHistory: [] });
  },
}));
