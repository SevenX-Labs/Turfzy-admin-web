import { create } from "zustand";
import { bookingsService } from "@/services/bookings.service";
import { BookingItem, BookingStats, BookingStatus, PaymentStatus } from "@/types/bookings";

interface BookingsState {
  bookings: BookingItem[];
  stats: BookingStats | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null;
  selectedBooking: any | null;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchBookings: (params: {
    search?: string;
    bookingStatus?: BookingStatus;
    paymentStatus?: PaymentStatus;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  
  fetchBookingStats: () => Promise<void>;
  fetchBookingDetails: (id: string) => Promise<void>;
  
  markNoShow: (id: string) => Promise<boolean>;
  
  exportCsv: (params: {
    search?: string;
    bookingStatus?: BookingStatus;
    paymentStatus?: PaymentStatus;
  }) => Promise<void>;
  
  exportPdf: (params: {
    search?: string;
    bookingStatus?: BookingStatus;
    paymentStatus?: PaymentStatus;
  }) => Promise<void>;
  
  clearSelectedBooking: () => void;
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  stats: null,
  pagination: null,
  selectedBooking: null,
  isLoading: false,
  isActionLoading: false,
  error: null,

  fetchBookings: async (params) => {
    const hasData = get().bookings.length > 0;
    if (!hasData) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await bookingsService.getBookings(params);
      if (response.success) {
        set({
          bookings: response.data.bookings,
          pagination: response.data.pagination,
        });
      } else {
        set({ error: "Failed to fetch bookings list" });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error fetching bookings list" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBookingStats: async () => {
    if (get().stats) return; // Cache stats across navigation
    try {
      const response = await bookingsService.getBookingStats();
      if (response.success) {
        set({ stats: response.data });
      }
    } catch (err) {
      console.error("Error fetching booking stats", err);
    }
  },

  fetchBookingDetails: async (id) => {
    const hasDetails = get().selectedBooking?.id === id;
    if (!hasDetails) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await bookingsService.getBookingDetails(id);
      if (response.success) {
        set({ selectedBooking: response.data });
      } else {
        set({ error: "Failed to fetch booking details" });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Error fetching booking details" });
    } finally {
      set({ isLoading: false });
    }
  },

  markNoShow: async (id) => {
    set({ isActionLoading: true, error: null });
    try {
      await bookingsService.markNoShow(id);
      const selected = get().selectedBooking;
      if (selected && selected.id === id) {
        await get().fetchBookingDetails(id);
      }
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to mark booking as no-show" });
      return false;
    } finally {
      set({ isActionLoading: false });
    }
  },

  exportCsv: async (params) => {
    try {
      const blob = await bookingsService.exportCsv(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bookings_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error("Error exporting bookings CSV", err);
    }
  },

  exportPdf: async (params) => {
    try {
      const blob = await bookingsService.exportPdf(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bookings_report_${new Date().toISOString().split("T")[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error("Error exporting bookings PDF", err);
    }
  },

  clearSelectedBooking: () => {
    set({ selectedBooking: null });
  },
}));
