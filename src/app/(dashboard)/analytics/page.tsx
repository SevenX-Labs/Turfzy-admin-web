"use client";

import { useEffect } from "react";
import { useAnalyticsStore } from "@/store/analytics.store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  TrendingUp,
  CalendarRange,
  FileSpreadsheet,
  FileDown,
  Building2,
  Award,
  Crown,
  MapPin,
  Clock,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { StatsSkeleton } from "@/components/ui/skeleton-loaders";

// Custom 3D Volumetric Cylinder Bar Shape Component for Peak Hours
const CustomBar = (props: any) => {
  const { x, y, width, height, index } = props;
  if (!height) return null;

  const radius = width / 2;

  return (
    <g>
      {/* 3D drop shadow replica */}
      <rect
        x={x + 2}
        y={y + 3}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill="#1d1637"
        opacity={0.1}
      />
      
      {/* Main cylinder bar */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={`url(#barGrad-${index % 5})`}
      />
      
      {/* Glossy overlay reflection on the left side of the cylinder */}
      <rect
        x={x + 2}
        y={y + 2}
        width={width * 0.2}
        height={height - 4}
        rx={radius * 0.2}
        ry={radius * 0.2}
        fill="#ffffff"
        opacity={0.2}
      />
    </g>
  );
};

export default function AnalyticsPage() {
  const {
    analytics,
    isLoading,
    fetchAnalytics,
    exportCsvReport,
    exportPdfReport,
  } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (!analytics) {
    return (
      <div className="space-y-7 pb-12 text-left">
        {/* Page Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-gray-100 rounded-lg animate-pulse mt-1.5" />
          </div>
        </div>

        {/* Metrics Row Skeleton */}
        <StatsSkeleton count={4} />

        {/* Main Grid: Peak Hours & City breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Chart Skeleton */}
          <div className="lg:col-span-8 clay-card-white p-6 min-h-[350px] flex flex-col justify-between">
            <div>
              <div className="h-5 w-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-3 w-64 bg-gray-100 rounded-lg animate-pulse mt-1" />
            </div>
            <div className="h-64 w-full bg-gray-50/50 rounded-3xl animate-pulse mt-4 flex items-end justify-between p-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-6 bg-purple-200/50 rounded-t-lg animate-pulse" style={{ height: `${30 + i * 8}%` }} />
              ))}
            </div>
          </div>

          {/* Right City split Skeleton */}
          <div className="lg:col-span-4 clay-card-white p-6 flex flex-col justify-between">
            <div>
              <div className="h-5 w-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-3 w-64 bg-gray-100 rounded-lg animate-pulse mt-1" />
            </div>
            <div className="space-y-4 mt-5 flex-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <div className="h-3.5 w-16 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-3.5 w-24 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-purple-200 rounded-full animate-pulse" style={{ width: `${80 - i * 15}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rankings Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="clay-card-white p-6 space-y-4">
            <div className="h-5 w-48 bg-gray-200 rounded-lg animate-pulse border-b border-[#f1effb] pb-3.5" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-lg bg-gray-100 animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-32 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-3 w-24 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                  </div>
                  <div className="h-4.5 w-16 bg-purple-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="clay-card-white p-6 space-y-4">
            <div className="h-5 w-48 bg-gray-200 rounded-lg animate-pulse border-b border-[#f1effb] pb-3.5" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-lg bg-gray-100 animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-32 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-3 w-24 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                  </div>
                  <div className="h-4.5 w-16 bg-purple-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const summary = analytics?.summary || {
    totalRevenue: 0,
    totalPlatformFee: 0,
    completedCount: 0,
    totalBookingsCount: 0,
    cancellationRate: 0,
    noShowRate: 0,
  };

  const peakHoursData = analytics?.peakHours || [];
  const topTurfs = analytics?.topTurfs || [];
  const topOwners = analytics?.topOwners || [];
  const cityAnalytics = analytics?.cityAnalytics || [];

  return (
    <div className="space-y-7 pb-12 text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">System Analytics</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Audit transaction growth, bookings frequency, and performance metrics</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportCsvReport}
            className="bg-white border-2 border-[#f1effb] hover:bg-[#f3effc] text-[#5b4e79] px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-[0_4px_0_#ece8f8] active:translate-y-0.5 transition-all"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={exportPdfReport}
            className="bg-white border-2 border-[#f1effb] hover:bg-[#f3effc] text-[#5b4e79] px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-[0_4px_0_#ece8f8] active:translate-y-0.5 transition-all"
          >
            <FileDown className="h-4 w-4 text-rose-600" />
            Export PDF
          </button>
          <button
            onClick={fetchAnalytics}
            className="p-2.5 rounded-2xl border-2 border-[#f1effb] bg-white text-[#5b4e79] hover:bg-[#f3effc] shadow-[0_4px_0_#ece8f8] transition-all"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="clay-card-purple p-3.5 sm:p-5 flex items-center text-[#241c3d] min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-white clay-icon-purple flex-shrink-0">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-[#5b4e79] uppercase truncate">Revenue</p>
              <p className="text-base sm:text-xl font-black text-[#241c3d] mt-0.5 truncate">
                ₹{summary.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="clay-card-green p-3.5 sm:p-5 flex items-center text-[#241c3d] min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-white clay-icon-green flex-shrink-0">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-emerald-950 uppercase truncate">Platform Fee</p>
              <p className="text-base sm:text-xl font-black text-[#241c3d] mt-0.5 truncate">
                ₹{summary.totalPlatformFee.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="clay-card-blue p-3.5 sm:p-5 flex items-center text-[#241c3d] min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-white clay-icon-blue flex-shrink-0">
              <CalendarRange className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-blue-955 uppercase truncate">Bookings</p>
              <p className="text-base sm:text-xl font-black text-[#241c3d] mt-0.5 truncate">
                {summary.totalBookingsCount}
              </p>
            </div>
          </div>
        </div>

        <div className="clay-card-peach p-3.5 sm:p-5 flex items-center text-[#241c3d] min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-white clay-icon-peach flex-shrink-0">
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-rose-955 uppercase truncate">Cancel Rate</p>
              <p className="text-base sm:text-xl font-black text-[#241c3d] mt-0.5 truncate">
                {summary.cancellationRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Peak Hours & City breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left: Peak Hours Bar Chart */}
        <div className="lg:col-span-8 clay-card-white p-6 flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="text-base font-extrabold text-[#241c3d] flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-purple-600" />
              Peak Demand Booking Hours
            </h3>
            <p className="text-[11px] text-[#8a7fa8] mt-0.5 font-semibold">Aggregated slots usage by time of day</p>
          </div>

          <div className="h-64 w-full mt-5">
            {peakHoursData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs font-bold text-[#8a7fa8]">
                No slot booking frequency records available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {/* Define 5 gradients for custom cylinder bars */}
                    <linearGradient id="barGrad-0" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#c7b3ff" />
                      <stop offset="100%" stopColor="#7c5beb" />
                    </linearGradient>
                    <linearGradient id="barGrad-1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ffa6bc" />
                      <stop offset="100%" stopColor="#f5476a" />
                    </linearGradient>
                    <linearGradient id="barGrad-2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ffd29d" />
                      <stop offset="100%" stopColor="#e37207" />
                    </linearGradient>
                    <linearGradient id="barGrad-3" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fff2be" />
                      <stop offset="100%" stopColor="#ebb118" />
                    </linearGradient>
                    <linearGradient id="barGrad-4" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#bce9ff" />
                      <stop offset="100%" stopColor="#2c8fe5" />
                    </linearGradient>
                  </defs>

                  <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fill: "#5b4e79", fontSize: 11, fontWeight: 700 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#5b4e79", fontSize: 11, fontWeight: 700 }} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-3xl border-2 border-[#f1effb] bg-white px-5 py-3 shadow-[0_8px_16px_rgba(36,28,61,0.08),0_4px_0_#e4e2f2] text-center">
                            <p className="text-xs font-black text-[#241c3d]">{data.hour}</p>
                            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase tracking-wider mt-1">Bookings Count</p>
                            <p className="text-sm font-extrabold text-purple-600 mt-0.5">
                              {payload[0].value} Bookings
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" shape={<CustomBar />} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right: City Analytics Breakdown */}
        <div className="lg:col-span-4 clay-card-white p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#241c3d] flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-purple-600" />
              Regional Split (Cities)
            </h3>
            <p className="text-[11px] text-[#8a7fa8] mt-0.5 font-semibold">Total tickets and income per city</p>
          </div>

          <div className="mt-5 flex-1 overflow-y-auto max-h-[250px] pr-1 space-y-4 no-scrollbar">
            {cityAnalytics.length === 0 ? (
              <div className="py-12 text-center text-xs font-bold text-[#8a7fa8]">
                No regional bookings logs.
              </div>
            ) : (
              cityAnalytics.map((c, index) => {
                const totalCitiesRevenue = cityAnalytics.reduce((sum, item) => sum + item.revenue, 0);
                const percentShare = totalCitiesRevenue > 0 ? Math.round((c.revenue / totalCitiesRevenue) * 100) : 0;
                
                return (
                  <div key={c.city} className="space-y-1.5 text-left text-xs font-bold">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#241c3d] font-extrabold">{c.city}</span>
                      <span className="text-[#8a7fa8]">{c.bookingsCount} Bookings (₹{c.revenue.toLocaleString()})</span>
                    </div>
                    <div className="w-full h-3 bg-[#f8f7fd] border-2 border-[#f1effb] rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                        style={{ width: `${Math.max(5, percentShare)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Rankings Grid: Top Turfs & Top Owners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        
        {/* Top Performing Turf Arenas */}
        <div className="clay-card-white p-6 space-y-4 text-left">
          <h3 className="text-base font-extrabold text-[#241c3d] flex items-center gap-2 border-b border-[#f1effb] pb-3.5">
            <Award className="h-5 w-5 text-amber-500" />
            Top 5 Turf Arenas
          </h3>

          <div className="divide-y divide-[#f1effb] space-y-3.5">
            {topTurfs.length === 0 ? (
              <p className="text-xs font-bold text-[#8a7fa8] py-6 text-center">No arena ranking entries.</p>
            ) : (
              topTurfs.slice(0, 5).map((turf, i) => (
                <div key={turf.id || i} className="flex items-center justify-between pt-3.5 first:pt-0 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black border border-amber-200">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-extrabold text-[#241c3d]">{turf.name}</p>
                      <p className="text-[10px] text-[#8a7fa8] font-bold mt-0.5">{turf.bookingsCount} bookings completed</p>
                    </div>
                  </div>
                  <span className="font-black text-purple-600">₹{turf.revenue.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Performing Turf Owners */}
        <div className="clay-card-white p-6 space-y-4 text-left">
          <h3 className="text-base font-extrabold text-[#241c3d] flex items-center gap-2 border-b border-[#f1effb] pb-3.5">
            <Crown className="h-5 w-5 text-purple-500" />
            Top 5 Turf Owners / Partners
          </h3>

          <div className="divide-y divide-[#f1effb] space-y-3.5">
            {topOwners.length === 0 ? (
              <p className="text-xs font-bold text-[#8a7fa8] py-6 text-center">No partner ranking entries.</p>
            ) : (
              topOwners.slice(0, 5).map((owner, i) => (
                <div key={owner.id || i} className="flex items-center justify-between pt-3.5 first:pt-0 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-black border border-purple-200">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-extrabold text-[#241c3d]">{owner.name}</p>
                      <p className="text-[10px] text-[#8a7fa8] font-bold mt-0.5">Partner Profile</p>
                    </div>
                  </div>
                  <span className="font-black text-purple-600">₹{owner.revenue.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
