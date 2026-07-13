import { create } from "zustand";
import { notificationsService } from "@/services/notifications.service";
import { NotificationLog, BroadcastNotificationDto } from "@/types/notifications";
import { toast } from "sonner";

interface NotificationsState {
  logs: NotificationLog[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchHistory: (page?: number, limit?: number) => Promise<void>;
  sendBroadcast: (dto: BroadcastNotificationDto) => Promise<boolean>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  logs: [],
  total: 0,
  page: 1,
  limit: 10,
  pages: 1,
  isLoading: false,
  isActionLoading: false,
  error: null,

  fetchHistory: async (page = 1, limit = 10) => {
    const hasData = get().logs.length > 0;
    if (!hasData) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await notificationsService.getHistory(page, limit);
      if (response.success && response.data) {
        set({
          logs: response.data.history || [],
          total: response.data.pagination?.total || 0,
          page: response.data.pagination?.page || 1,
          limit: response.data.pagination?.limit || 10,
          pages: response.data.pagination?.pages || 1,
        });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load broadcast history" });
    } finally {
      set({ isLoading: false });
    }
  },

  sendBroadcast: async (dto: BroadcastNotificationDto) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await notificationsService.broadcast(dto);
      if (response.success) {
        toast.success(response.message || "Push notification broadcast dispatched successfully!");
        await get().fetchHistory(1); // Refresh logs
        return true;
      }
      return false;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to broadcast notification";
      set({ error: errMsg });
      toast.error(errMsg);
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },
}));
