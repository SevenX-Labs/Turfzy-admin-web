import { create } from "zustand";
import { platformFeeService } from "@/services/platform-fee.service";
import { PlatformFeeSlab, CreateSlabDto, UpdateSlabDto } from "@/types/platform-fee";
import { toast } from "sonner";

interface PlatformFeeState {
  slabs: PlatformFeeSlab[];
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchSlabs: () => Promise<void>;
  createSlab: (dto: CreateSlabDto) => Promise<boolean>;
  updateSlab: (id: string, dto: UpdateSlabDto) => Promise<boolean>;
  deleteSlab: (id: string) => Promise<boolean>;
}

export const usePlatformFeeStore = create<PlatformFeeState>((set, get) => ({
  slabs: [],
  isLoading: false,
  isActionLoading: false,
  error: null,

  fetchSlabs: async () => {
    const hasData = get().slabs.length > 0;
    if (!hasData) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const slabs = await platformFeeService.getSlabs();
      // Sort by minAmount to display them in logical order
      const sortedSlabs = [...slabs].sort((a, b) => a.minAmount - b.minAmount);
      set({ slabs: sortedSlabs });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch platform fee slabs" });
    } finally {
      set({ isLoading: false });
    }
  },

  createSlab: async (dto: CreateSlabDto) => {
    set({ isActionLoading: true, error: null });
    try {
      await platformFeeService.createSlab(dto);
      toast.success("Platform fee slab created successfully");
      await get().fetchSlabs();
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to create platform fee slab";
      set({ error: errMsg });
      toast.error(errMsg);
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  updateSlab: async (id: string, dto: UpdateSlabDto) => {
    set({ isActionLoading: true, error: null });
    try {
      await platformFeeService.updateSlab(id, dto);
      toast.success("Platform fee slab updated successfully");
      await get().fetchSlabs();
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to update platform fee slab";
      set({ error: errMsg });
      toast.error(errMsg);
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  deleteSlab: async (id: string) => {
    set({ isActionLoading: true, error: null });
    try {
      await platformFeeService.deleteSlab(id);
      toast.success("Platform fee slab deleted successfully");
      await get().fetchSlabs();
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to delete platform fee slab";
      set({ error: errMsg });
      toast.error(errMsg);
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },
}));
