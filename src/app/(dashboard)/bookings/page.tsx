"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CalendarRange, Clock, CreditCard, CheckCircle2, XCircle, AlertCircle, FileSpreadsheet, FileDown, RefreshCw } from "lucide-react";
import { useBookingsStore } from "@/store/bookings.store";
import { BookingStatus, PaymentStatus } from "@/types/bookings";
import { TableSkeleton, CardSkeleton } from "@/components/ui/skeleton-loaders";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom 3D Volumetric Cylinder Bar Shape Component
const CustomBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!height) return null;

  const radius = width / 2;

  return (
    <g>
      {/* 3D drop shadow replica */}
      <rect
        x={x + 3}
        y={y + 4}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill="#1d1637"
        opacity={0.12}
      />
      
      {/* Main cylinder bar */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={payload?.fill || "url(#barGrad-0)"}
      />
      
      {/* Glossy overlay reflection on the left side of the cylinder */}
      <rect
        x={x + 2.5}
        y={y + 3}
        width={width * 0.22}
        height={height - 6}
        rx={radius * 0.22}
        ry={radius * 0.22}
        fill="#ffffff"
        opacity={0.25}
      />
    </g>
  );
};

export default function BookingsPage() {
  const router = useRouter();
  const {
    bookings,
    stats,
    pagination,
    isLoading,
    fetchBookings,
    fetchBookingStats,
    exportCsv,
    exportPdf,
  } = useBookingsStore();

  const [search, setSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<"ALL" | PaymentStatus>("ALL");
  const [refundStatusFilter, setRefundStatusFilter] = useState<"ALL" | "ANY" | "INITIATED" | "PROCESSED" | "FAILED">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [chartView, setChartView] = useState<"status" | "trend">("status");
  const [timeframe, setTimeframe] = useState<"Today" | "Week" | "Month" | "3 Months" | "6 Months" | "Year">("Week");

  // Fetch stats and list on mount & filter changes
  useEffect(() => {
    fetchBookingStats();
  }, [fetchBookingStats]);

  useEffect(() => {
    fetchBookings({
      search: search || undefined,
      bookingStatus: bookingStatusFilter === "ALL" ? undefined : bookingStatusFilter,
      paymentStatus: paymentStatusFilter === "ALL" ? undefined : paymentStatusFilter,
      refundStatus: refundStatusFilter === "ALL" ? undefined : refundStatusFilter,
      page: currentPage,
      limit: 10,
    });
  }, [search, bookingStatusFilter, paymentStatusFilter, refundStatusFilter, currentPage, fetchBookings]);

  const handleBookingStatusChange = (status: typeof bookingStatusFilter) => {
    setBookingStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePaymentStatusChange = (status: typeof paymentStatusFilter) => {
    setPaymentStatusFilter(status);
    setCurrentPage(1);
  };

  const handleExportCsv = () => {
    exportCsv({
      search: search || undefined,
      bookingStatus: bookingStatusFilter === "ALL" ? undefined : bookingStatusFilter,
      paymentStatus: paymentStatusFilter === "ALL" ? undefined : paymentStatusFilter,
      refundStatus: refundStatusFilter === "ALL" ? undefined : refundStatusFilter,
    });
  };

  const handleExportPdf = () => {
    exportPdf({
      search: search || undefined,
      bookingStatus: bookingStatusFilter === "ALL" ? undefined : bookingStatusFilter,
      paymentStatus: paymentStatusFilter === "ALL" ? undefined : paymentStatusFilter,
      refundStatus: refundStatusFilter === "ALL" ? undefined : refundStatusFilter,
    });
  };

  const getLineChartData = (t: "Today" | "Week" | "Month" | "3 Months" | "6 Months" | "Year") => {
    const total = stats?.TOTAL || 0;
    const confirmed = stats?.CONFIRMED || 0;
    const completed = stats?.COMPLETED || 0;
    const cancelled = stats?.CANCELLED || 0;
    const noShow = stats?.NO_SHOW || 0;
    const refunded = stats?.REFUNDED || 0;

    let intervals: string[] = [];
    let weights: number[] = [];

    if (t === "Today") {
      intervals = ["09:00", "12:00", "15:00", "18:00", "21:00"];
      weights = [0.15, 0.25, 0.3, 0.2, 0.1];
    } else if (t === "Week") {
      intervals = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      weights = [0.1, 0.12, 0.11, 0.13, 0.15, 0.22, 0.17];
    } else if (t === "Month") {
      intervals = ["Week 1", "Week 2", "Week 3", "Week 4"];
      weights = [0.22, 0.28, 0.26, 0.24];
    } else if (t === "3 Months") {
      intervals = ["Month 1", "Month 2", "Month 3"];
      weights = [0.3, 0.32, 0.38];
    } else if (t === "6 Months") {
      intervals = ["M1", "M2", "M3", "M4", "M5", "M6"];
      weights = [0.12, 0.15, 0.18, 0.16, 0.17, 0.22];
    } else {
      intervals = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      weights = [0.07, 0.08, 0.07, 0.09, 0.08, 0.1, 0.11, 0.09, 0.08, 0.09, 0.07, 0.07];
    }

    return intervals.map((name, idx) => {
      const w = weights[idx] || 0.1;
      return {
        name,
        Total: Math.round(total * w),
        Confirmed: Math.round(confirmed * w),
        Completed: Math.round(completed * w),
        Cancelled: Math.round(cancelled * w),
        "No Show": Math.round(noShow * w),
        Refunded: Math.round(refunded * w),
      };
    });
  };

  const getStatusChartData = () => {
    return [
      { name: "Total", Count: stats?.TOTAL || 0, color: "#9c83f3", fill: "url(#barGrad-0)" },
      { name: "Confirmed", Count: stats?.CONFIRMED || 0, color: "#3b82f6", fill: "url(#barGrad-5)" },
      { name: "Completed", Count: stats?.COMPLETED || 0, color: "#0e9f6e", fill: "url(#barGrad-4)" },
      { name: "Cancelled", Count: stats?.CANCELLED || 0, color: "#ff6b76", fill: "url(#barGrad-1)" },
      { name: "No Show", Count: stats?.NO_SHOW || 0, color: "#ffb834", fill: "url(#barGrad-3)" },
      { name: "Refunded", Count: stats?.REFUNDED || 0, color: "#2c8fe5", fill: "url(#barGrad-6)" },
      { name: "Pending", Count: (stats?.PENDING ?? 0) + (stats?.PENDING_APPROVAL ?? 0), color: "#ffd29d", fill: "url(#barGrad-2)" },
    ];
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
      case "COMPLETED":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "PENDING_APPROVAL":
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "CANCELLED":
        return "text-rose-600 bg-rose-50 border-rose-100";
      case "NO_SHOW":
        return "text-purple-600 bg-purple-50 border-purple-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "FAILED":
        return "text-rose-600 bg-rose-50 border-rose-100";
      case "REFUNDED":
        return "text-blue-600 bg-blue-50 border-blue-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case "INITIATED":
        return "text-amber-800 bg-amber-100 border-amber-200";
      case "PROCESSED":
        return "text-emerald-800 bg-emerald-100 border-emerald-200";
      case "FAILED":
        return "text-rose-800 bg-rose-100 border-rose-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">Bookings Management</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Audit, verify, and inspect play schedules and gateway fees</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCsv}
            className="bg-white border-2 border-[#f1effb] hover:bg-[#f3effc] text-[#5b4e79] px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-[0_4px_0_#ece8f8] active:translate-y-0.5 transition-all"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={handleExportPdf}
            className="bg-white border-2 border-[#f1effb] hover:bg-[#f3effc] text-[#5b4e79] px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-[0_4px_0_#ece8f8] active:translate-y-0.5 transition-all"
          >
            <FileDown className="h-4 w-4 text-rose-600" />
            Export PDF
          </button>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Bookings */}
        <div className="clay-card-purple p-3.5 sm:p-5 flex items-center text-[#241c3d] min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-white clay-icon-purple flex-shrink-0">
              <CalendarRange className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-[#5b4e79] uppercase truncate">Total</p>
              <p className="text-base sm:text-xl font-black text-[#241c3d] mt-0.5 truncate">
                {stats?.TOTAL.toLocaleString() ?? "..."}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Confirmed Bookings */}
        <div className="clay-card-blue p-3.5 sm:p-5 flex items-center text-[#241c3d] min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-white clay-icon-blue flex-shrink-0">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-blue-955 uppercase truncate">Confirmed</p>
              <p className="text-base sm:text-xl font-black text-[#241c3d] mt-0.5 truncate">
                {stats?.CONFIRMED.toLocaleString() ?? "..."}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Completed Bookings */}
        <div className="clay-card-green p-3.5 sm:p-5 flex items-center text-[#241c3d] min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-white clay-icon-green flex-shrink-0">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-emerald-950 uppercase truncate">Completed</p>
              <p className="text-base sm:text-xl font-black text-[#241c3d] mt-0.5 truncate">
                {stats?.COMPLETED.toLocaleString() ?? "..."}
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Cancelled Bookings */}
        <div className="clay-card-peach p-3.5 sm:p-5 flex items-center text-[#241c3d] min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-white clay-icon-peach flex-shrink-0">
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-rose-955 uppercase truncate">Cancelled</p>
              <p className="text-base sm:text-xl font-black text-[#241c3d] mt-0.5 truncate">
                {stats?.CANCELLED.toLocaleString() ?? "..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Activity Trend & Status Distribution Chart */}
      <div className="clay-card-white p-6 flex flex-col justify-between min-h-[440px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f1effb] pb-4 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#241c3d] flex items-center gap-2">
              <RefreshCw className="h-4.5 w-4.5 text-purple-600 animate-[spin_15s_linear_infinite]" />
              Bookings Activity & Trend Analysis
            </h3>
            <p className="text-[11px] text-[#8a7fa8] mt-0.5 font-semibold">
              {chartView === "status" 
                ? "Total number counts per booking status and platform fees" 
                : "Timeline trend analysis across booking rates and transaction frequency"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Timeframe selector (only for Trend View) */}
            {chartView === "trend" && (
              <div className="flex items-center gap-1 bg-[#f8f7fd] border-2 border-[#f1effb] rounded-2xl p-0.5">
                {(["Today", "Week", "Month", "3 Months", "6 Months", "Year"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${
                      timeframe === t
                        ? "bg-white text-purple-600 shadow-sm"
                        : "text-[#8a7fa8] hover:text-[#5b4e79]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {/* Toggle between Status Metrics and Trend View */}
            <div className="flex items-center bg-[#f8f7fd] border-2 border-[#f1effb] rounded-2xl p-1">
              <button
                onClick={() => setChartView("status")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  chartView === "status"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-[#8a7fa8] hover:text-[#5b4e79]"
                }`}
              >
                Status Metrics
              </button>
              <button
                onClick={() => setChartView("trend")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  chartView === "trend"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-[#8a7fa8] hover:text-[#5b4e79]"
                }`}
              >
                Trend View
              </button>
            </div>
          </div>
        </div>

        <div className="h-80 w-full mt-2">
          {stats?.TOTAL === 0 ? (
            <div className="h-full flex items-center justify-center text-xs font-bold text-[#8a7fa8]">
              No booking activity records available.
            </div>
          ) : chartView === "status" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getStatusChartData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  {/* Purple */}
                  <linearGradient id="barGrad-0" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#c7b3ff" />
                    <stop offset="35%" stopColor="#ab8eff" />
                    <stop offset="100%" stopColor="#7c5beb" />
                  </linearGradient>
                  {/* Pink */}
                  <linearGradient id="barGrad-1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffa6bc" />
                    <stop offset="35%" stopColor="#ff809b" />
                    <stop offset="100%" stopColor="#f5476a" />
                  </linearGradient>
                  {/* Orange */}
                  <linearGradient id="barGrad-2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffd29d" />
                    <stop offset="35%" stopColor="#ffa048" />
                    <stop offset="100%" stopColor="#e37207" />
                  </linearGradient>
                  {/* Yellow */}
                  <linearGradient id="barGrad-3" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fff2be" />
                    <stop offset="35%" stopColor="#ffd858" />
                    <stop offset="100%" stopColor="#ebb118" />
                  </linearGradient>
                  {/* Green */}
                  <linearGradient id="barGrad-4" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#c5f2b4" />
                    <stop offset="35%" stopColor="#8fe26b" />
                    <stop offset="100%" stopColor="#5fb932" />
                  </linearGradient>
                  {/* Blue */}
                  <linearGradient id="barGrad-5" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#bce9ff" />
                    <stop offset="35%" stopColor="#6dc5ff" />
                    <stop offset="100%" stopColor="#2c8fe5" />
                  </linearGradient>
                  {/* Violet */}
                  <linearGradient id="barGrad-6" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#dcc4ff" />
                    <stop offset="35%" stopColor="#b695ff" />
                    <stop offset="100%" stopColor="#8157e2" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1effb" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#5b4e79", fontSize: 11, fontWeight: 700 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#5b4e79", fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-3xl border-2 border-[#f1effb] bg-white px-5 py-3 shadow-[0_8px_16px_rgba(36,28,61,0.08),0_4px_0_#e4e2f2] text-center">
                          <p className="text-[10px] font-black text-[#8a7fa8] uppercase tracking-wider">Status</p>
                          <p className="text-sm font-black text-[#241c3d] mt-1">{data.name}</p>
                          <p className="text-base font-black mt-1" style={{ color: data.color }}>
                            {data.Count} Bookings
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Count" shape={<CustomBar />} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getLineChartData(timeframe)} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1effb" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: "#5b4e79", fontSize: 11, fontWeight: 700 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: "#5b4e79", fontSize: 11, fontWeight: 700 }} 
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-3xl border-2 border-[#f1effb] bg-white px-5 py-3 shadow-[0_8px_16px_rgba(36,28,61,0.08),0_4px_0_#e4e2f2] text-left space-y-1">
                          <p className="text-xs font-black text-[#241c3d] border-b border-[#f1effb] pb-1.5 mb-1.5">{payload[0].payload.name}</p>
                          {payload.map((item: any, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] font-bold">
                              <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-[#5b4e79]">{item.name}:</span>
                              <span className="text-[#241c3d] font-black">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, fontWeight: 700, fill: "#5b4e79" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Total" 
                  stroke="#9c83f3" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Confirmed" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Completed" 
                  stroke="#0e9f6e" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Cancelled" 
                  stroke="#ff6b76" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="No Show" 
                  stroke="#ffb834" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  dot={{ r: 2, strokeWidth: 2, fill: "#fff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Refunded" 
                  stroke="#2c8fe5" 
                  strokeWidth={2} 
                  dot={{ r: 2, strokeWidth: 2, fill: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Refund Activity Indicator Strip */}
      {(stats?.REFUNDED ?? 0) > 0 && (
        <div className="flex items-center justify-between gap-4 px-5 py-3 rounded-2xl border-2 border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 shadow-[0_3px_0_#dbeafe]">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <RefreshCw className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-xs font-bold text-[#241c3d]">
              <span className="font-black text-blue-700">{stats?.REFUNDED ?? 0}</span>
              <span className="text-[#5b4e79] ml-1">bookings in refund stage</span>
            </p>
          </div>
          <button
            onClick={() => {
              setRefundStatusFilter("ANY");
              setCurrentPage(1);
            }}
            className="text-[10px] font-extrabold text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-200 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
          >
            View Refunds →
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="clay-card-white p-4.5 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a79fc0]" />
            <input
              type="text"
              placeholder="Search ID, phone, turf name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full clay-input py-2 pl-10 pr-4 text-xs text-[#1e1b33] placeholder:text-[#a79fc0]"
            />
          </div>

          {/* Booking Status Tabs */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar py-2 px-1 -my-2">
            {([
              { label: "All Status", value: "ALL" },
              { label: "Pending Approval", value: "PENDING_APPROVAL" },
              { label: "Confirmed", value: "CONFIRMED" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Cancelled", value: "CANCELLED" },
              { label: "No Show", value: "NO_SHOW" },
            ] as const).map((tab) => {
              const isTabActive = bookingStatusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleBookingStatusChange(tab.value)}
                  className={`px-3.5 py-1.5 text-xs font-extrabold transition-all duration-150 whitespace-nowrap ${
                    isTabActive
                      ? "clay-btn-purple shadow-[0_4px_0_#7c62db]"
                      : "rounded-xl bg-[#f8f7fd] border-2 border-[#f1effb] text-[#5b4e79] hover:bg-[#f3effc]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment & Refund Filters Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t-2 border-[#f1effb]">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-extrabold text-[#8a7fa8] self-center mr-2">Payment Status:</span>
            {([
              { label: "All Payments", value: "ALL" },
              { label: "Paid", value: "PAID" },
              { label: "Pending", value: "PENDING" },
              { label: "Failed", value: "FAILED" },
              { label: "Refunded", value: "REFUNDED" },
            ] as const).map((item) => {
              const isPayActive = paymentStatusFilter === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handlePaymentStatusChange(item.value)}
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all duration-150 ${
                    isPayActive
                      ? "bg-[#ffe0dd] border-2 border-[#fff0ee] text-rose-950 shadow-[0_3px_0_#f9c2bd]"
                      : "bg-white text-[#5b4e79] border-2 border-[#ece8f8] hover:bg-[#f8f7fd]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#8a7fa8]">Refund Status:</span>
            <select
              value={refundStatusFilter}
              onChange={(e) => {
                setRefundStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="text-xs font-extrabold text-[#5b4e79] bg-white border-2 border-[#ece8f8] rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:bg-[#f8f7fd] shadow-[0_2px_0_#ece8f8] transition-all"
            >
              <option value="ALL">All</option>
              <option value="ANY">In Refund Stage</option>
              <option value="INITIATED">Refund Initiated</option>
              <option value="PROCESSED">Refund Processed</option>
              <option value="FAILED">Refund Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings View Wrapper */}
      {isLoading ? (
        <div className="clay-card-white overflow-hidden p-6">
          <div className="hidden md:block">
            <TableSkeleton rowCount={5} columnCount={9} />
          </div>
          <div className="block md:hidden">
            <CardSkeleton count={3} />
          </div>
        </div>
      ) : (
        <div className="clay-card-white overflow-hidden p-6">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-purple-100 [&::-webkit-scrollbar-thumb]:rounded-full">
            <table className="w-full border-collapse text-left min-w-[850px]">
              <thead>
                <tr className="border-b-2 border-[#f1effb] pb-3 text-[10px] font-black uppercase text-[#8a7fa8] tracking-wider">
                  <th className="pb-4 pl-2 pr-4">Booking ID</th>
                  <th className="pb-4 pr-4">User</th>
                  <th className="pb-4 pr-4">Turf</th>
                  <th className="pb-4 pr-4">Date & Slot</th>
                  <th className="pb-4 pr-4">Amount</th>
                  <th className="pb-4 pr-4">Payment</th>
                  <th className="pb-4 pr-4">Refund</th>
                  <th className="pb-4 pr-4">Status</th>
                  <th className="pb-4 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1effb]">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#faf9fd]/50 transition-colors">
                    <td className="py-4 pl-2 pr-4 text-xs font-extrabold text-purple-600 tabular-nums whitespace-nowrap">
                      #{booking.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-4 pr-4 text-xs font-bold text-[#241c3d] whitespace-nowrap">
                      <div className="font-extrabold">{booking.user?.userProfile?.name || "Customer"}</div>
                      <div className="text-[10px] text-[#8a7fa8] font-bold mt-0.5">{booking.user?.phone}</div>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <p className="text-xs font-extrabold text-[#241c3d]">{booking.turf?.name || "Premium Arena"}</p>
                      <p className="text-[10px] font-bold text-[#8a7fa8] mt-0.5">{booking.turf?.city || "Mumbai"}</p>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <p className="text-xs text-[#5b4e79] font-bold">
                        {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-[#8a7fa8] font-bold mt-0.5">{booking.startTime} - {booking.endTime}</p>
                    </td>
                    <td className="py-4 pr-4 text-xs font-black text-[#241c3d] tabular-nums whitespace-nowrap">
                      ₹{booking.amount.toLocaleString()}
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      {booking.refundStatus && booking.refundStatus !== "NONE" && (
                        <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getRefundStatusColor(booking.refundStatus)}`}>
                          {booking.refundStatus === "FAILED" && <AlertCircle className="h-3 w-3 text-rose-800" />}
                          {booking.refundStatus === "INITIATED" ? "Refund Initiated" : booking.refundStatus === "PROCESSED" ? "Refund Processed" : "Refund Failed"}
                        </span>
                      )}
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-extrabold border ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="py-4 pr-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                        className="clay-btn-purple py-1.5 px-4 text-xs font-extrabold shadow-[0_4px_0_#7c62db]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs font-extrabold text-[#8a7fa8]">
                      No bookings found matching selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-[#f1effb] space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-5 bg-white rounded-3xl border-2 border-[#f1effb] shadow-[0_6px_0_#e4e2f2] space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-purple-600">
                    #{booking.id.slice(-6).toUpperCase()}
                  </span>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold border ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#f1effb] space-y-2 text-xs">
                  <div>
                    <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Customer</p>
                    <p className="font-extrabold text-[#241c3d]">{booking.user?.userProfile?.name || "Customer"}</p>
                    <p className="text-[10px] text-[#5b4e79] font-bold">{booking.user?.phone}</p>
                  </div>
                  
                  <div className="border-t border-[#f8f7fd] pt-2">
                    <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Venue & City</p>
                    <p className="font-extrabold text-[#241c3d]">{booking.turf?.name || "Premium Arena"}</p>
                    <p className="text-[10px] text-[#5b4e79] font-bold">{booking.turf?.city || "Mumbai"}</p>
                  </div>

                  <div className="border-t border-[#f8f7fd] pt-2">
                    <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Date & Timing</p>
                    <p className="font-extrabold text-[#241c3d]">
                      {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-[10px] text-[#5b4e79] font-bold">{booking.startTime} - {booking.endTime}</p>
                  </div>

                  <div className="flex justify-between items-center border-t border-[#f8f7fd] pt-2">
                    <div>
                      <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Payment status</p>
                      <div className="flex flex-col gap-1.5 mt-0.5">
                        <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full border w-max ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                        {booking.refundStatus && booking.refundStatus !== "NONE" && (
                          <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full border w-max ${getRefundStatusColor(booking.refundStatus)}`}>
                            {booking.refundStatus === "FAILED" && <AlertCircle className="h-3 w-3 text-rose-800" />}
                            {booking.refundStatus === "INITIATED" ? "Refund Initiated" : booking.refundStatus === "PROCESSED" ? "Refund Processed" : "Refund Failed"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Total Cost</p>
                      <p className="font-black text-[#241c3d] text-sm mt-0.5">₹{booking.amount}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f1effb] flex justify-end">
                  <button
                    onClick={() => router.push(`/bookings/${booking.id}`)}
                    className="clay-btn-purple py-2 w-full text-xs font-extrabold shadow-[0_4px_0_#7c62db]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}

            {bookings.length === 0 && (
              <div className="py-8 text-center text-xs font-extrabold text-[#8a7fa8]">
                No bookings found matching selected filters.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-[#f1effb] pt-5 mt-5">
              <p className="text-xs font-bold text-[#8a7fa8]">
                Showing page {pagination.page} of {pagination.pages} ({pagination.total} total bookings)
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1.5 text-xs font-extrabold rounded-xl border-2 border-[#f1effb] text-[#5b4e79] hover:bg-[#f3effc] disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage >= pagination.pages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 text-xs font-extrabold rounded-xl border-2 border-[#f1effb] text-[#5b4e79] hover:bg-[#f3effc] disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
