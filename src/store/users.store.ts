import { create } from "zustand";
import { usersService } from "@/services/users.service";
import { UserAuth, UserDetails, UserBooking } from "@/types/users";

interface UsersState {
  users: UserAuth[];
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
  selectedUser: UserDetails | null;
  selectedUserBookings: UserBooking[];
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchUsers: (params: {
    search?: string;
    status?: "active" | "suspended" | "deleted";
    page?: number;
    limit?: number;
  }) => Promise<void>;
  
  fetchUserStats: () => Promise<void>;
  
  fetchUserDetails: (id: string) => Promise<void>;
  fetchUserBookings: (id: string) => Promise<void>;
  
  suspendUser: (id: string, reason: string) => Promise<boolean>;
  activateUser: (id: string) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  
  exportCsv: () => Promise<void>;
  exportPdf: () => Promise<void>;
  
  clearSelectedUser: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  stats: null,
  pagination: null,
  selectedUser: null,
  selectedUserBookings: [],
  isLoading: false,
  isActionLoading: false,
  error: null,

  fetchUsers: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersService.getUsers(params);
      if (response.success) {
        set({
          users: response.data.users,
          pagination: response.data.pagination,
        });
      } else {
        set({ error: "Failed to fetch users" });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error fetching users" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserStats: async () => {
    try {
      const [allRes, activeRes, suspendedRes] = await Promise.all([
        usersService.getUsers({ limit: 1 }),
        usersService.getUsers({ status: "active", limit: 1 }),
        usersService.getUsers({ status: "suspended", limit: 1 }),
      ]);
      set({
        stats: {
          total: allRes.data.pagination.total,
          active: activeRes.data.pagination.total,
          suspended: suspendedRes.data.pagination.total,
        },
      });
    } catch (err) {
      console.error("Error fetching user stats", err);
    }
  },

  fetchUserDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await usersService.getUserDetails(id);
      if (response.success) {
        set({ selectedUser: response.data });
      } else {
        set({ error: "Failed to fetch user details" });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error fetching user details" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserBookings: async (id) => {
    try {
      const response = await usersService.getUserBookings(id);
      if (response.success) {
        set({ selectedUserBookings: response.data });
      }
    } catch (err: any) {
      console.error("Error fetching user bookings", err);
    }
  },

  suspendUser: async (id, reason) => {
    set({ isActionLoading: true });
    try {
      await usersService.suspendUser(id, reason);
      // Refresh details if open
      const selected = get().selectedUser;
      if (selected && selected.profile.id === id) {
        await get().fetchUserDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to suspend user" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  activateUser: async (id) => {
    set({ isActionLoading: true });
    try {
      await usersService.activateUser(id);
      // Refresh details if open
      const selected = get().selectedUser;
      if (selected && selected.profile.id === id) {
        await get().fetchUserDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to activate user" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  deleteUser: async (id) => {
    set({ isActionLoading: true });
    try {
      await usersService.deleteUser(id);
      // Refresh details if open
      const selected = get().selectedUser;
      if (selected && selected.profile.id === id) {
        await get().fetchUserDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete user" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  exportCsv: async () => {
    try {
      const blob = await usersService.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `users_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      console.error("CSV Export failed", err);
    }
  },

  exportPdf: async () => {
    try {
      const blob = await usersService.exportPdf();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `users_report_${new Date().toISOString().slice(0,10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      console.error("PDF Export failed", err);
    }
  },

  clearSelectedUser: () => {
    set({ selectedUser: null, selectedUserBookings: [] });
  },
}));
