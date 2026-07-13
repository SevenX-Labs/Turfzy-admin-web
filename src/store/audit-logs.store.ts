import { create } from "zustand";
import { auditLogsService, GetAuditLogsParams } from "@/services/audit-logs.service";
import { AuditLog } from "@/types/audit-logs";

interface AuditLogsState {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  isLoading: boolean;
  error: string | null;

  fetchLogs: (params: GetAuditLogsParams) => Promise<void>;
}

export const useAuditLogsStore = create<AuditLogsState>((set, get) => ({
  logs: [],
  total: 0,
  page: 1,
  limit: 10,
  pages: 1,
  isLoading: false,
  error: null,

  fetchLogs: async (params) => {
    const hasData = get().logs.length > 0;
    if (!hasData) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await auditLogsService.getAuditLogs(params);
      if (response.success) {
        set({
          logs: response.data.logs,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          pages: response.data.pages,
        });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load audit activity logs" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
