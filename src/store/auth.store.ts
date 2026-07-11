import { create } from "zustand";
import Cookies from "js-cookie";
import { authService } from "@/services/auth.service";
import { AdminUser } from "@/types/auth";

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AdminUser | null) => void;
  setLoading: (loading: boolean) => void;
  fetchUser: () => Promise<AdminUser | null>;
  login: (data: any, rememberMe?: boolean) => Promise<AdminUser>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.getMe();
      if (response.success && response.data) {
        set({ user: response.data, isAuthenticated: true, isLoading: false });
        return response.data;
      }
      throw new Error("Failed to fetch user profile");
    } catch (error) {
      Cookies.remove("auth_token");
      set({ user: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },

  login: async (data, rememberMe = true) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(data);
      Cookies.set("auth_token", response.accessToken, { expires: rememberMe ? 7 : 1 });
      const adminUser: AdminUser = {
        adminId: response.admin.id,
        email: response.admin.email,
        name: response.admin.name,
        role: response.admin.role,
      };
      set({ user: adminUser, isAuthenticated: true, isLoading: false });
      return adminUser;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      Cookies.remove("auth_token");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
