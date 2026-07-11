import { api } from "./api";
import {
  UserListResponse,
  UserDetailsResponse,
  UserBookingsResponse,
} from "@/types/users";

export const usersService = {
  async getUsers(params: {
    search?: string;
    status?: "active" | "suspended" | "deleted";
    page?: number;
    limit?: number;
  }): Promise<UserListResponse> {
    const response = await api.get<UserListResponse>("/api/v1/admin/users", {
      params,
    });
    return response.data;
  },

  async getUserDetails(id: string): Promise<UserDetailsResponse> {
    const response = await api.get<UserDetailsResponse>(`/api/v1/admin/users/${id}`);
    return response.data;
  },

  async suspendUser(id: string, reason: string): Promise<any> {
    const response = await api.patch(`/api/v1/admin/users/${id}/suspend`, { reason });
    return response.data;
  },

  async activateUser(id: string): Promise<any> {
    const response = await api.patch(`/api/v1/admin/users/${id}/activate`);
    return response.data;
  },

  async deleteUser(id: string): Promise<any> {
    const response = await api.delete(`/api/v1/admin/users/${id}`);
    return response.data;
  },

  async getUserBookings(id: string): Promise<UserBookingsResponse> {
    const response = await api.get<UserBookingsResponse>(`/api/v1/admin/users/${id}/bookings`);
    return response.data;
  },

  async exportCsv(): Promise<Blob> {
    const response = await api.get("/api/v1/admin/users/export/csv", {
      responseType: "blob",
    });
    return response.data;
  },

  async exportPdf(): Promise<Blob> {
    const response = await api.get("/api/v1/admin/users/export/pdf", {
      responseType: "blob",
    });
    return response.data;
  },
};
