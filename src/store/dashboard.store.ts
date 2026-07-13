import { create } from "zustand";
import { dashboardService } from "@/services/dashboard.service";
import {
  DashboardStats,
  RecentActivity,
  Past7DaysChart,
  RevenueStats,
  RecentBooking,
} from "@/types/dashboard";

interface DashboardState {
  stats: DashboardStats | null;
  recentActivity: RecentActivity | null;
  past7DaysCharts: Past7DaysChart[];
  
  revenueStats: RevenueStats | null;
  
  fullCharts: {
    bookingChart: { date: string; bookings: number }[];
    revenueChart: { date: string; revenue: number }[];
    userGrowth: { date: string; count: number }[];
    ownerGrowth: { date: string; count: number }[];
  } | null;

  recentBookings: RecentBooking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null;

  isLoading: boolean;
  isRevenueLoading: boolean;
  isChartsLoading: boolean;
  isRecentBookingsLoading: boolean;
  error: string | null;

  fetchDashboardData: () => Promise<void>;
  fetchRevenueStats: () => Promise<void>;
  fetchChartData: () => Promise<void>;
  fetchRecentBookings: (page?: number, limit?: number) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  recentActivity: null,
  past7DaysCharts: [],
  revenueStats: null,
  fullCharts: null,
  recentBookings: [],
  pagination: null,

  isLoading: false,
  isRevenueLoading: false,
  isChartsLoading: false,
  isRecentBookingsLoading: false,
  error: null,

  fetchDashboardData: async () => {
    const hasData = get().stats !== null;
    if (!hasData) {
      set({ isLoading: true });
    }
    set({ error: null });
    try {
      const response = await dashboardService.getDashboard();
      if (response.success) {
        set({
          stats: response.data.stats,
          recentActivity: response.data.recentActivity,
          past7DaysCharts: response.data.charts,
        });
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (err: any) {
      set({
        error: err.message || "Something went wrong while fetching dashboard data",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRevenueStats: async () => {
    set({ isRevenueLoading: true, error: null });
    try {
      const response = await dashboardService.getRevenue();
      if (response.success) {
        set({
          revenueStats: response.data,
          isRevenueLoading: false,
        });
      } else {
        throw new Error("Failed to fetch revenue stats");
      }
    } catch (err: any) {
      set({
        isRevenueLoading: false,
        error: err.message || "Something went wrong while fetching revenue stats",
      });
    }
  },

  fetchChartData: async () => {
    set({ isChartsLoading: true, error: null });
    try {
      const response = await dashboardService.getCharts();
      if (response.success) {
        set({
          fullCharts: response.data,
          isChartsLoading: false,
        });
      } else {
        throw new Error("Failed to fetch chart data");
      }
    } catch (err: any) {
      set({
        isChartsLoading: false,
        error: err.message || "Something went wrong while fetching chart data",
      });
    }
  },

  fetchRecentBookings: async (page = 1, limit = 10) => {
    set({ isRecentBookingsLoading: true, error: null });
    try {
      const response = await dashboardService.getRecentBookings(page, limit);
      if (response.success) {
        set({
          recentBookings: response.data.bookings,
          pagination: response.data.pagination,
          isRecentBookingsLoading: false,
        });
      } else {
        throw new Error("Failed to fetch recent bookings");
      }
    } catch (err: any) {
      set({
        isRecentBookingsLoading: false,
        error: err.message || "Something went wrong while fetching recent bookings",
      });
    }
  },
}));
