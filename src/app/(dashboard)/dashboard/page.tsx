"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Wallet,
  TrendingUp,
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
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
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

// --- Static Data Mockups matching the image ---
const statCards = [
  {
    title: "Total Users",
    value: "12,580",
    change: "+18.2%",
    timeframe: "vs last 7 days",
    isPositive: true,
    color: "from-purple-500 to-indigo-500",
    bgLight: "bg-purple-50 text-purple-600",
    icon: Users,
  },
  {
    title: "Total Turfs",
    value: "865",
    change: "+10.5%",
    timeframe: "vs last 7 days",
    isPositive: true,
    color: "from-blue-500 to-sky-500",
    bgLight: "bg-blue-50 text-blue-600",
    icon: TurfIcon,
  },
  {
    title: "Today's Bookings",
    value: "342",
    change: "+22.4%",
    timeframe: "vs yesterday",
    isPositive: true,
    color: "from-pink-500 to-rose-500",
    bgLight: "bg-pink-50 text-pink-600",
    icon: Calendar,
  },
  {
    title: "Today's Revenue",
    value: "₹1,42,000",
    change: "+12.7%",
    timeframe: "vs yesterday",
    isPositive: true,
    color: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50 text-amber-600",
    icon: Wallet,
  },
];

const revenueData = [
  { day: "Mon", amount: 25000 },
  { day: "Tue", amount: 75000 },
  { day: "Wed", amount: 65000 },
  { day: "Thu", amount: 110000 },
  { day: "Fri", amount: 90000 },
  { day: "Sat", amount: 142000 },
  { day: "Sun", amount: 95000 },
];

const bookingsByCity = [
  { name: "Mumbai", value: 45, color: "#8b5cf6" },
  { name: "Pune", value: 25, color: "#ec4899" },
  { name: "Thane", value: 15, color: "#a78bfa" },
  { name: "Nashik", value: 10, color: "#10b981" },
  { name: "Nagpur", value: 5, color: "#3b82f6" },
];

const recentBookings = [
  {
    id: "#4587",
    turf: "Elite Arena",
    city: "Mumbai",
    price: "₹1,200",
    status: "Confirmed",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&h=80&fit=crop&q=80",
  },
  {
    id: "#4586",
    turf: "Playground Sports",
    city: "Pune",
    price: "₹800",
    status: "Pending",
    image: "https://images.unsplash.com/photo-1489945052260-4f21d52268b9?w=80&h=80&fit=crop&q=80",
  },
  {
    id: "#4585",
    turf: "Turf World",
    city: "Thane",
    price: "₹1,500",
    status: "Confirmed",
    image: "https://images.unsplash.com/photo-1518605333140-552d48123fad?w=80&h=80&fit=crop&q=80",
  },
  {
    id: "#4584",
    turf: "Goal Station",
    city: "Nashik",
    price: "₹900",
    status: "Cancelled",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=80&h=80&fit=crop&q=80",
  },
];

const pendingApprovals = [
  {
    name: "Green Field Arena",
    city: "Andheri, Mumbai",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=80&h=80&fit=crop&q=80",
  },
  {
    name: "Victory Turf",
    city: "Hinjewadi, Pune",
    image: "https://images.unsplash.com/photo-1524191632731-067f967cc996?w=80&h=80&fit=crop&q=80",
  },
  {
    name: "Kick Off Ground",
    city: "Ghodbunder, Thane",
    image: "https://images.unsplash.com/photo-1575361204480-aadea2d1d7b8?w=80&h=80&fit=crop&q=80",
  },
  {
    name: "Blue Arena",
    city: "Nashik Road, Nashik",
    image: "https://images.unsplash.com/photo-1568194157720-8ece7114207f?w=80&h=80&fit=crop&q=80",
  },
];

const recentSettlements = [
  {
    owner: "Rohit Sharma",
    turf: "Elite Arena, Mumbai",
    amount: "₹25,000",
    date: "May 20, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rohit",
  },
  {
    owner: "Sandeep Patil",
    turf: "Playground Sports, Pune",
    amount: "₹18,500",
    date: "May 19, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sandeep",
  },
  {
    owner: "Amit Verma",
    turf: "Turf World, Thane",
    amount: "₹21,000",
    date: "May 19, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Amit",
  },
  {
    owner: "Vikram Singh",
    turf: "Goal Station, Nashik",
    amount: "₹15,300",
    date: "May 18, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram",
  },
];

const recentActivities = [
  {
    type: "user",
    text: "New user registered",
    detail: "Rahul Verma",
    time: "2 min ago",
    color: "bg-purple-100 text-purple-600",
  },
  {
    type: "booking",
    text: "New booking received",
    detail: "Booking #4587",
    time: "10 min ago",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    type: "payment",
    text: "Payment received",
    detail: "₹1,200 from Rahul",
    time: "15 min ago",
    color: "bg-amber-100 text-amber-600",
  },
  {
    type: "turf",
    text: "Turf approved",
    detail: "Green Field Arena",
    time: "1 hour ago",
    color: "bg-rose-100 text-rose-600",
  },
  {
    type: "settlement",
    text: "Settlement completed",
    detail: "₹25,000 to Rohit Sharma",
    time: "2 hours ago",
    color: "bg-blue-100 text-blue-600",
  },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8b5cf6] border-t-transparent" />
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (value === 0) return "0";
    if (value >= 100000) return `₹${value / 100000}L`;
    return `₹${value / 1000}K`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ---------------- SECTION 1: GREETING BANNER ---------------- */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#ebdffc] via-[#e2d2fa] to-[#c6a3f2] p-8 lg:p-10 shadow-sm border border-[#decbf9]/40">
        {/* Abstract shapes & glow */}
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-32 w-32 rounded-full bg-[#a78bfa]/20 blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 relative z-10">
          {/* Left Greeting Text */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <h2 className="text-3xl font-extrabold text-[#241c3d] tracking-tight">
                Good Morning, Admin! <span className="inline-block animate-[wave_1.8s_infinite] origin-[70%_70%]">👋</span>
              </h2>
              <p className="text-[#5b4e79] text-[15px] font-medium mt-1">
                Here's what's happening on your platform today.
              </p>
            </div>

            {/* Today's Summary mini card */}
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/50 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-[#8b5cf6] flex items-center justify-center text-white shadow-sm shadow-[#8b5cf6]/20">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-[#8a7fa8] uppercase tracking-wider">Today's Summary</p>
                <p className="text-sm font-bold text-[#241c3d]">May 20, 2025</p>
              </div>
            </div>
          </div>

          {/* Right 3D Stadium Illustration & Uptime Card */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-end gap-6 w-full">
            {/* Stadium Visual */}
            <div className="relative w-64 h-36 flex-shrink-0">
              {/* Stadium outer shadow & rim */}
              <div className="absolute inset-0 rounded-[50%] bg-[#9e7adc] shadow-[0_12px_24px_rgba(107,33,168,0.25)] border-t border-white/30" />
              {/* Pitch */}
              <div className="absolute inset-[8px] rounded-[50%] bg-gradient-to-b from-[#6ee7b7] to-[#10b981] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-2 border border-white/40 rounded-[50%]" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-white/40" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/40" />
              </div>

              {/* Floating soccer ball */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center">
                <span className="text-4xl filter drop-shadow-[0_8px_4px_rgba(0,0,0,0.15)] leading-none select-none">⚽</span>
              </div>

              {/* Floodlights */}
              <div className="absolute -top-6 left-4 flex flex-col items-center">
                <div className="grid grid-cols-3 gap-0.5 mb-0.5 bg-white/10 p-0.5 rounded-sm">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className="h-1 w-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,1)]" />
                  ))}
                </div>
                <div className="w-0.5 h-10 bg-purple-950/20" />
              </div>
              <div className="absolute -top-6 right-4 flex flex-col items-center">
                <div className="grid grid-cols-3 gap-0.5 mb-0.5 bg-white/10 p-0.5 rounded-sm">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className="h-1 w-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,1)]" />
                  ))}
                </div>
                <div className="w-0.5 h-10 bg-purple-950/20" />
              </div>
            </div>

            {/* Uptime Status Card */}
            <div className="w-full sm:w-48 bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-md flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-[#241c3d]">All Systems</span>
              </div>
              <p className="text-[11px] font-semibold text-[#8a7fa8] mt-0.5">Operational</p>
              
              <div className="mt-3.5 flex items-baseline justify-between">
                <span className="text-xs font-extrabold text-[#10b981]">99.98%</span>
                <span className="text-[9px] font-bold text-[#8a7fa8]">Uptime</span>
              </div>

              {/* Sparkline visualization */}
              <div className="h-6 w-full mt-1.5 flex items-end gap-0.5">
                {[45, 55, 48, 60, 52, 70, 65, 80, 75, 90, 85, 95].map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-purple-100 rounded-sm group relative hover:bg-purple-300 transition-colors"
                    style={{ height: `${val}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-purple-950 text-white text-[8px] px-1 py-0.5 rounded shadow">
                      {val}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 2: STAT CARDS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-3xl p-6 shadow-sm border border-[#ece8f8] hover:shadow-md hover:scale-[1.01] transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[12px] font-bold text-[#8a7fa8] uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-2xl font-extrabold text-[#241c3d] mt-1.5">
                    {card.value}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md shadow-purple-500/10`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
              </div>

              <div className="mt-4.5 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {card.change}
                </span>
                <span className="text-[11px] font-semibold text-[#8a7fa8]">
                  {card.timeframe}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- SECTION 3: CHARTS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-[#ece8f8] flex flex-col justify-between min-h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#241c3d]">Revenue Overview</h3>
              <p className="text-xs text-[#8a7fa8] mt-0.5">Weekly booking income visualization</p>
            </div>
            {/* Filter Dropdown */}
            <button className="flex items-center gap-1.5 rounded-xl border border-[#ece8f8] px-3.5 py-1.5 text-xs font-semibold text-[#5b4e79] hover:bg-[#f6f4fd] transition-colors">
              This Week
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Area Chart Container */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8a7fa8", fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8a7fa8", fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ stroke: "#ebdffc", strokeWidth: 1.5 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-[#ece8f8] bg-white p-3 shadow-lg shadow-purple-950/5">
                          <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">May 20</p>
                          <p className="text-sm font-black text-[#241c3d] mt-0.5">
                            ₹{payload[0].value?.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings by City Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-[#ece8f8] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#241c3d]">Bookings by City</h3>
            <p className="text-xs text-[#8a7fa8] mt-0.5">Distribution of users by urban areas</p>
          </div>

          {/* Donut Chart Content */}
          <div className="flex items-center justify-between gap-4 py-4 flex-1">
            <div className="h-40 w-40 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingsByCity}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {bookingsByCity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Inner content */}
              <div className="absolute text-center">
                <p className="text-[10px] font-bold text-[#8a7fa8] uppercase tracking-wider">Total</p>
                <p className="text-lg font-black text-[#241c3d]">100%</p>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="space-y-2.5 text-left flex-1 pl-2">
              {bookingsByCity.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-[#5b4e79]">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#241c3d]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 4: THREE LISTS SIDE BY SIDE ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Recent Bookings */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#ece8f8]">
          <div className="flex items-center justify-between border-b border-[#f6f4fd] pb-4 mb-4">
            <h4 className="font-bold text-[#241c3d] text-[15px]">Recent Bookings</h4>
            <button className="text-[11px] font-bold text-[#8b5cf6] hover:text-[#6d28d9] transition-colors uppercase tracking-wider">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl bg-purple-50">
                    <img
                      src={booking.image}
                      alt={booking.turf}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#241c3d]">Booking {booking.id}</p>
                    <p className="text-[10px] font-medium text-[#8a7fa8]">{booking.turf}, {booking.city}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-[#241c3d]">{booking.price}</p>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold mt-1 ${
                      booking.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-600"
                        : booking.status === "Pending"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Pending Turf Approvals */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#ece8f8]">
          <div className="flex items-center justify-between border-b border-[#f6f4fd] pb-4 mb-4">
            <h4 className="font-bold text-[#241c3d] text-[15px]">Pending Turf Approvals</h4>
            <button className="text-[11px] font-bold text-[#8b5cf6] hover:text-[#6d28d9] transition-colors uppercase tracking-wider">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((turf) => (
              <div key={turf.name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl bg-purple-50">
                    <img
                      src={turf.image}
                      alt={turf.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#241c3d]">{turf.name}</p>
                    <p className="text-[10px] font-medium text-[#8a7fa8]">{turf.city}</p>
                  </div>
                </div>

                <div>
                  <span className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[9px] font-bold text-amber-600">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Recent Settlements */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#ece8f8]">
          <div className="flex items-center justify-between border-b border-[#f6f4fd] pb-4 mb-4">
            <h4 className="font-bold text-[#241c3d] text-[15px]">Recent Settlements</h4>
            <button className="text-[11px] font-bold text-[#8b5cf6] hover:text-[#6d28d9] transition-colors uppercase tracking-wider">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentSettlements.map((settlement) => (
              <div key={settlement.owner} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-[#f3effc] border border-purple-50">
                    <img
                      src={settlement.avatar}
                      alt={settlement.owner}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#241c3d]">{settlement.owner}</p>
                    <p className="text-[10px] font-medium text-[#8a7fa8]">{settlement.turf}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-[#241c3d]">{settlement.amount}</p>
                  <p className="text-[9px] text-[#8a7fa8] mt-0.5">{settlement.date}</p>
                </div>

                <div>
                  <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold text-emerald-600">
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 5: RECENT ACTIVITIES FOOTER ---------------- */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#ece8f8] overflow-hidden">
        <h4 className="font-bold text-[#241c3d] text-[15px] border-b border-[#f6f4fd] pb-4 mb-4 text-left">
          Recent Activities
        </h4>

        {/* Horizontal scroll on mobile, flex row on desktop */}
        <div className="flex flex-row overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-purple-100 scrollbar-track-transparent">
          {recentActivities.map((act, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-[#faf9fe] rounded-2xl p-3 border border-[#ece8f8] min-w-[240px] flex-shrink-0"
            >
              <div className={`h-9 w-9 rounded-xl ${act.color} flex items-center justify-center flex-shrink-0`}>
                {act.type === "user" && <Users className="h-4.5 w-4.5" />}
                {act.type === "booking" && <Calendar className="h-4.5 w-4.5" />}
                {act.type === "payment" && <Wallet className="h-4.5 w-4.5" />}
                {act.type === "turf" && <TurfIcon className="h-4.5 w-4.5" />}
                {act.type === "settlement" && <ShieldCheck className="h-4.5 w-4.5" />}
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-[#241c3d] leading-tight">{act.text}</p>
                <p className="text-[10px] font-semibold text-[#8a7fa8] mt-0.5 leading-none">{act.detail}</p>
                <div className="flex items-center gap-1 mt-1 text-[9px] text-[#b3a8d6] font-medium">
                  <Clock className="h-3 w-3" />
                  <span>{act.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
