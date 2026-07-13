import { create } from "zustand";
import { turfsService } from "@/services/turfs.service";
import { TurfItem, TurfStatus } from "@/types/turfs";

interface TurfsState {
  turfs: TurfItem[];
  stats: {
    total: number;
    active: number;
    pendingApproval: number;
  } | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null;
  selectedTurf: TurfItem | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchTurfs: (params: {
    search?: string;
    status?: TurfStatus;
    city?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  
  fetchTurfStats: () => Promise<void>;
  fetchTurfDetails: (id: string) => Promise<void>;
  
  activateTurf: (id: string) => Promise<boolean>;
  deactivateTurf: (id: string) => Promise<boolean>;
  suspendTurf: (id: string, reason: string) => Promise<boolean>;
  featureTurf: (id: string) => Promise<boolean>;
  unfeatureTurf: (id: string) => Promise<boolean>;
  
  clearSelectedTurf: () => void;
}

export const useTurfsStore = create<TurfsState>((set, get) => ({
  turfs: [],
  stats: null,
  pagination: null,
  selectedTurf: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  fetchTurfs: async (params) => {
    const hasData = get().turfs.length > 0;
    if (!hasData) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await turfsService.getTurfs(params);
      if (response.success) {
        set({
          turfs: response.data.turfs,
          pagination: response.data.pagination,
        });
      } else {
        set({ error: "Failed to fetch turfs" });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error fetching turfs" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTurfStats: async () => {
    if (get().stats) return; // Cache stats across navigation
    try {
      const [allRes, activeRes, pendingRes] = await Promise.all([
        turfsService.getTurfs({ limit: 1 }),
        turfsService.getTurfs({ status: "ACTIVE", limit: 1 }),
        turfsService.getTurfs({ status: "PENDING_APPROVAL", limit: 1 }),
      ]);
      set({
        stats: {
          total: allRes.data.pagination.total,
          active: activeRes.data.pagination.total,
          pendingApproval: pendingRes.data.pagination.total,
        },
      });
    } catch (err) {
      console.error("Error fetching turf stats", err);
    }
  },

  fetchTurfDetails: async (id) => {
    const hasDetails = get().selectedTurf?.id === id;
    if (!hasDetails) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await turfsService.getTurfDetails(id);
      if (response.success) {
        set({ selectedTurf: response.data });
      } else {
        set({ error: "Failed to fetch turf details" });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error fetching turf details" });
    } finally {
      set({ isLoading: false });
    }
  },

  activateTurf: async (id) => {
    set({ isActionLoading: true });
    try {
      await turfsService.activateTurf(id);
      const selected = get().selectedTurf;
      if (selected && selected.id === id) {
        await get().fetchTurfDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to activate turf" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  deactivateTurf: async (id) => {
    set({ isActionLoading: true });
    try {
      await turfsService.deactivateTurf(id);
      const selected = get().selectedTurf;
      if (selected && selected.id === id) {
        await get().fetchTurfDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to deactivate turf" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  suspendTurf: async (id, reason) => {
    set({ isActionLoading: true });
    try {
      await turfsService.suspendTurf(id, reason);
      const selected = get().selectedTurf;
      if (selected && selected.id === id) {
        await get().fetchTurfDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to suspend turf" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  featureTurf: async (id) => {
    set({ isActionLoading: true });
    try {
      await turfsService.featureTurf(id);
      const selected = get().selectedTurf;
      if (selected && selected.id === id) {
        await get().fetchTurfDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to feature turf" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  unfeatureTurf: async (id) => {
    set({ isActionLoading: true });
    try {
      await turfsService.unfeatureTurf(id);
      const selected = get().selectedTurf;
      if (selected && selected.id === id) {
        await get().fetchTurfDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to unfeature turf" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  clearSelectedTurf: () => {
    set({ selectedTurf: null });
  },
}));
