import { api } from "./api";
import { LoginResponse, MeResponse, AdminUser } from "@/types/auth";

export const authService = {
  async login(data: any): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/api/v1/admin/auth/login", data);
    return response.data;
  },

  async logout(): Promise<{ success: boolean }> {
    const response = await api.post<{ success: boolean }>("/api/v1/admin/auth/logout");
    return response.data;
  },

  async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>("/api/v1/admin/auth/me");
    return response.data;
  },
};
