import { api } from "./api";
import {
  BookingListResponse,
  BookingDetailsResponse,
  BookingStatsResponse,
  BookingStatus,
  PaymentStatus,
} from "@/types/bookings";

export const bookingsService = {
  async getBookings(params: {
    search?: string;
    bookingStatus?: BookingStatus;
    paymentStatus?: PaymentStatus;
    refundStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<BookingListResponse> {
    const response = await api.get<BookingListResponse>("/api/v1/admin/bookings", {
      params,
    });
    return response.data;
  },

  async getBookingStats(): Promise<BookingStatsResponse> {
    const response = await api.get<BookingStatsResponse>("/api/v1/admin/bookings/stats");
    return response.data;
  },

  async getBookingDetails(id: string): Promise<BookingDetailsResponse> {
    const response = await api.get<BookingDetailsResponse>(`/api/v1/admin/bookings/${id}`);
    return response.data;
  },

  async markNoShow(id: string): Promise<any> {
    const response = await api.patch(`/api/v1/admin/bookings/${id}/no-show`);
    return response.data;
  },

  async exportCsv(params: {
    search?: string;
    bookingStatus?: BookingStatus;
    paymentStatus?: PaymentStatus;
    refundStatus?: string;
  }): Promise<Blob> {
    const response = await api.get("/api/v1/admin/bookings/export/csv", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  async exportPdf(params: {
    search?: string;
    bookingStatus?: BookingStatus;
    paymentStatus?: PaymentStatus;
    refundStatus?: string;
  }): Promise<Blob> {
    const response = await api.get("/api/v1/admin/bookings/export/pdf", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};
