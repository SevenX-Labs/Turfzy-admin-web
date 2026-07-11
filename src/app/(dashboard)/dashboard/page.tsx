"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/dashboard.store";
import { useAuthStore } from "@/store/auth.store";
import {
  Users,
  Calendar,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Coins,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Custom Turf/Soccer Pitch Icon
const TurfIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

// Custom 3D Volumetric Cylinder Bar Shape Component
const CustomBar = (props: any) => {
  const { x, y, width, height, index } = props;
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
        fill={`url(#barGrad-${index % 7})`}
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

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    stats,
    recentActivity,
    past7DaysCharts,
    isLoading,
    fetchDashboardData,
  } = useDashboardStore();

  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    fetchDashboardData();

    // Time of day greeting
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [fetchDashboardData]);

  if (isLoading || !stats) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center bg-[#f8f7fd]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="text-sm font-semibold text-[#8a7fa8] animate-pulse">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  // Map 7 days chart data
  const revenueData = past7DaysCharts.map((item, index) => {
    const dateObj = new Date(item.date);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    return {
      day: dayName,
      amount: item.revenue,
      bookings: item.bookings,
      users: item.users,
    };
  });

  // Map financial data to donut chart
  const settlementData = [
    { name: "Completed Settlements", value: stats.completedSettlements ?? 0, color: "#9c83f3" },
    { name: "Pending Settlements", value: stats.pendingSettlements ?? 0, color: "#ff8b94" },
    { name: "Platform Fees Earned", value: stats.platformFeeEarned ?? 0, color: "#ffb3ba" },
  ];

  const totalFinanceValue = settlementData.reduce((acc, curr) => acc + curr.value, 0);

  // Dynamic stat cards
  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalUsers.toLocaleString(),
      change: "Active",
      timeframe: "on platform",
      icon: Users,
      clayClass: "clay-card-purple",
      iconClass: "clay-icon-purple",
    },
    {
      title: "Total Owners",
      value: stats.totalOwners.toLocaleString(),
      change: "Registered",
      timeframe: "partners",
      icon: Users,
      clayClass: "clay-card-peach",
      iconClass: "clay-icon-peach",
    },
    {
      title: "Total Listed Turfs",
      value: stats.totalTurfs.toLocaleString(),
      change: "Active",
      timeframe: "grounds",
      icon: TurfIcon,
      clayClass: "clay-card-yellow",
      iconClass: "clay-icon-yellow",
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings.toLocaleString(),
      change: `${stats.activeBookings} active`,
      timeframe: "today",
      icon: Calendar,
      clayClass: "clay-card-blue",
      iconClass: "clay-icon-blue",
    },
  ];

  const formatYAxis = (value: number) => {
    if (value === 0) return "0";
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "COMPLETED":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "PENDING_APPROVAL":
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "CANCELLED":
        return "text-rose-600 bg-rose-50 border-rose-100";
      default:
        return "text-purple-600 bg-purple-50 border-purple-100";
    }
  };

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* ---------------- SECTION 1: GREETING BANNER ---------------- */}
      <div className="relative overflow-hidden clay-card-purple p-6 text-[#241c3d]">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight relative z-10">
          {greeting}, {user?.name || "Admin"}!{" "}
          <span className="inline-block animate-[wave_1.6s_ease-in-out_infinite]">👋</span>
        </h2>
        <p className="text-xs text-purple-950/80 font-bold mt-1.5 relative z-10">
          Here is a breakdown of Turfzy's platform activity, financial settlements, and operational status.
        </p>
      </div>

      {/* ---------------- SECTION 2: STAT CARDS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`${card.clayClass} p-6 flex flex-col justify-between h-44`}
            >
              <div className="flex flex-col items-start gap-4">
                <div className={`h-11 w-11 flex items-center justify-center text-white ${card.iconClass}`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-bold text-[#5b4e79]">
                    {card.title}
                  </p>
                  <p className="text-2xl font-black text-[#241c3d] mt-1">
                    {card.value}
                  </p>
                </div>
              </div>

              <p className="text-[11px] font-semibold text-[#8a7fa8] mt-1 leading-normal">
                <span className="font-extrabold text-[#7c3aed] mr-1 inline-block">
                  {card.change}
                </span>
                <span className="inline-block">
                  {card.timeframe}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* ---------------- SECTION 3: CHARTS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Revenue Overview (Bar chart cylinder) */}
        <div className="lg:col-span-8 clay-card-white p-6 flex flex-col justify-between min-h-[350px]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-extrabold text-[#241c3d]">Revenue Overview</h3>
              <p className="text-[11px] text-[#8a7fa8] mt-0.5 font-semibold">Weekly booking income aggregates</p>
            </div>
            {/* Filter Indicator */}
            <span className="flex items-center gap-1.5 rounded-full border-2 border-[#f1effb] px-3.5 py-1.5 text-xs font-extrabold text-[#5b4e79] bg-white shadow-sm">
              Last 7 Days
            </span>
          </div>

          {/* Volumetric Cylindrical Bar Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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

                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#5b4e79", fontSize: 11, fontWeight: 700 }}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#5b4e79", fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-3xl border-2 border-[#f1effb] bg-white px-5 py-3 shadow-[0_8px_16px_rgba(36,28,61,0.08),0_4px_0_#e4e2f2] text-center">
                          <p className="text-[9px] font-black text-[#8a7fa8] uppercase tracking-wider">Revenue</p>
                          <p className="text-sm font-black text-[#241c3d] mt-1">
                            ₹{payload[0].value?.toLocaleString()}
                          </p>
                          <p className="text-[9px] text-purple-600 font-bold mt-1">
                            {payload[0].payload.bookings} Bookings
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" shape={<CustomBar />} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Finance & Settlements Donut Chart */}
        <div className="lg:col-span-4 clay-card-white p-6 flex flex-col justify-between overflow-hidden">
          <div>
            <h3 className="text-base font-extrabold text-[#241c3d]">Finance & Settlements</h3>
            <p className="text-[11px] text-[#8a7fa8] mt-0.5 font-semibold">Distribution of platform fees & payouts</p>
          </div>

          <div className="flex items-center justify-center py-4 flex-1">
            <div className="h-36 w-36 relative flex items-center justify-center flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="pieGrad-0" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#c7b3ff" />
                      <stop offset="100%" stopColor="#7c5beb" />
                    </linearGradient>
                    <linearGradient id="pieGrad-1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffa6bc" />
                      <stop offset="100%" stopColor="#f5476a" />
                    </linearGradient>
                    <linearGradient id="pieGrad-2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffd29d" />
                      <stop offset="100%" stopColor="#e37207" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={settlementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={4}
                    cornerRadius={6}
                    dataKey="value"
                  >
                    {settlementData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#pieGrad-${index % 3})`}
                        style={{
                          filter: "drop-shadow(2px 4px 5px rgba(29, 22, 55, 0.12))",
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-[9px] font-bold text-[#8a7fa8] uppercase tracking-wider">Gross</p>
                <p className="text-xs font-black text-[#241c3d] truncate max-w-[80px]">
                  ₹{(totalFinanceValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>

          {/* Finance legends */}
          <div className="space-y-2.5 pt-4 border-t-2 border-[#f1effb]">
            {settlementData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-bold text-[#5b4e79]">{item.name}</span>
                </div>
                <span className="font-extrabold text-[#241c3d] tabular-nums">
                  ₹{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 4: RECENT BOOKINGS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Recent Bookings */}
        <div className="lg:col-span-12 clay-card-white p-6">
          <div className="flex items-center justify-between border-b border-[#f1effb] pb-4 mb-4">
            <h4 className="font-extrabold text-[#241c3d] text-[15px]">Recent Bookings</h4>
            <button
              onClick={() => router.push("/bookings")}
              className="text-[10px] font-extrabold text-[#9c83f3] hover:brightness-95 transition-all uppercase tracking-wider"
            >
              See All
            </button>
          </div>

          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-purple-100 [&::-webkit-scrollbar-thumb]:rounded-full">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-[#f1effb] text-[#8a7fa8] text-[10px] font-black uppercase tracking-wider">
                  <th className="pb-3 pl-2 pr-4">ID</th>
                  <th className="pb-3 pr-4">Venue / Turf</th>
                  <th className="pb-3 pr-4">Customer Phone</th>
                  <th className="pb-3 pr-4">Booking Date</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8f7fd]">
                {recentActivity?.bookings && recentActivity.bookings.length > 0 ? (
                  recentActivity.bookings.map((booking) => (
                    <tr key={booking.id} className="text-xs hover:bg-[#faf9fd]/80 transition-colors group">
                      <td className="py-3.5 pl-2 pr-4 font-extrabold text-purple-600 tabular-nums whitespace-nowrap">
                        #{booking.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <div className="font-extrabold text-[#241c3d]">{booking.turf?.name || "Premium Turf"}</div>
                        <div className="text-[10px] text-[#8a7fa8] font-bold mt-0.5">{booking.turf?.city || "Mumbai"}</div>
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-[#5b4e79] whitespace-nowrap">
                        {booking.user?.phone}
                      </td>
                      <td className="py-3.5 pr-4 text-[#8a7fa8] font-bold whitespace-nowrap">
                        {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-3.5 pr-4 font-black text-[#241c3d] tabular-nums whitespace-nowrap">
                        ₹{booking.amount}
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusColor(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/bookings/${booking.id}`)}
                          className="h-8 w-8 rounded-full bg-white border-2 border-[#f1effb] text-[#9c83f3] shadow-[0_3px_0_#e4e2f2] inline-flex items-center justify-center hover:bg-[#f6f4fd] transition-all active:translate-y-0.5 active:shadow-[0_1px_0_#e4e2f2]"
                          title="View Booking Details"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-xs text-[#8a7fa8] text-center py-8 font-bold">
                      No recent bookings recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 5: PENDING APPROVALS BANNER ---------------- */}
      {stats.pendingManualApprovals > 0 && (
        <div className="relative overflow-hidden clay-card-purple p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="h-12 w-12 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center text-[#ffc5bb] flex-shrink-0 animate-bounce">
              <Coins className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-purple-950">Pending Manual Approvals</h4>
              <p className="text-xs text-purple-900 font-bold mt-0.5">
                You have {stats.pendingManualApprovals} booking requests waiting for manual validation.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/bookings")}
            className="clay-btn-purple px-6 py-2.5 text-xs font-extrabold flex items-center gap-1.5 bg-white border-2 border-white text-purple-600 shadow-[0_5px_0_#7c62db] hover:brightness-105"
          >
            Review Approvals
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
