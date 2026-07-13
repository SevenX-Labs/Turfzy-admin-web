import { create } from "zustand";
import { settingsService } from "@/services/settings.service";
import { PlatformSettings, UpdateSettingsDto } from "@/types/settings";
import { toast } from "sonner";

interface SettingsState {
  settings: PlatformSettings | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchSettings: () => Promise<void>;
  updateSettings: (dto: UpdateSettingsDto) => Promise<boolean>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  fetchSettings: async () => {
    const hasData = get().settings !== null;
    if (!hasData) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await settingsService.getSettings();
      if (response.success) {
        set({ settings: response.data });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load site settings" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (dto: UpdateSettingsDto) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await settingsService.updateSettings(dto);
      if (response.success) {
        set({ settings: response.data });
        toast.success("Platform settings updated successfully");
        return true;
      }
      return false;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to update platform settings";
      set({ error: errMsg });
      toast.error(errMsg);
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },
}));
