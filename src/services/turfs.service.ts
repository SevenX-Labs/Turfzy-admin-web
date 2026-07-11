import { api } from "./api";
import { TurfListResponse, TurfDetailsResponse, TurfStatus } from "@/types/turfs";

export const turfsService = {
  async getTurfs(params: {
    search?: string;
    status?: TurfStatus;
    city?: string;
    page?: number;
    limit?: number;
  }): Promise<TurfListResponse> {
    const response = await api.get<TurfListResponse>("/api/v1/admin/turfs", {
      params,
    });
    return response.data;
  },

  async getTurfDetails(id: string): Promise<TurfDetailsResponse> {
    const response = await api.get<TurfDetailsResponse>(`/api/v1/admin/turfs/${id}`);
    return response.data;
  },

  async activateTurf(id: string): Promise<any> {
    const response = await api.patch(`/api/v1/admin/turfs/${id}/activate`);
    return response.data;
  },

  async deactivateTurf(id: string): Promise<any> {
    const response = await api.patch(`/api/v1/admin/turfs/${id}/deactivate`);
    return response.data;
  },

  async suspendTurf(id: string, reason: string): Promise<any> {
    const response = await api.patch(`/api/v1/admin/turfs/${id}/suspend`, { reason });
    return response.data;
  },

  async featureTurf(id: string): Promise<any> {
    const response = await api.patch(`/api/v1/admin/turfs/${id}/feature`);
    return response.data;
  },

  async unfeatureTurf(id: string): Promise<any> {
    const response = await api.patch(`/api/v1/admin/turfs/${id}/unfeature`);
    return response.data;
  },
};
