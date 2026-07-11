"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Star, ShieldAlert, Sparkles, SlidersHorizontal } from "lucide-react";
import { useTurfsStore } from "@/store/turfs.store";
import { TurfStatus } from "@/types/turfs";
import Link from "next/link";

export default function TurfsPage() {
  const {
    turfs,
    stats,
    pagination,
    isLoading,
    fetchTurfs,
    fetchTurfStats,
  } = useTurfsStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TurfStatus>("ALL");
  const [cityFilter, setCityFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch stats on mount
  useEffect(() => {
    fetchTurfStats();
  }, [fetchTurfStats]);

  // Fetch turfs when filters change
  useEffect(() => {
    fetchTurfs({
      search: search || undefined,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      city: cityFilter === "ALL" ? undefined : cityFilter,
      page: currentPage,
      limit: 9,
    });
  }, [search, statusFilter, cityFilter, currentPage, fetchTurfs]);

  // Handle status tab change
  const handleStatusChange = (status: typeof statusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle city tab change
  const handleCityChange = (city: string) => {
    setCityFilter(city);
    setCurrentPage(1);
  };

  // Helper to format sports tag
  const getSportsTags = (sportsType: string) => {
    if (sportsType === "BOTH") return ["Football", "Cricket"];
    if (sportsType === "FOOTBALL") return ["Football"];
    if (sportsType === "CRICKET") return ["Cricket"];
    return [sportsType];
  };

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">Turfs Management</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Manage arena listings, rates, and approval applications</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="clay-card-purple p-5 flex items-center gap-4 text-[#241c3d] min-w-0">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-purple flex-shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-[#5b4e79] uppercase truncate">Total Listed</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5 truncate">
              {stats?.total.toLocaleString() ?? "..."}
            </p>
          </div>
        </div>
        <div className="clay-card-blue p-5 flex items-center gap-4 text-[#241c3d] min-w-0">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-blue flex-shrink-0">
            <Star className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-blue-950 uppercase truncate">Active</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5 truncate">
              {stats?.active.toLocaleString() ?? "..."}
            </p>
          </div>
        </div>
        <div className="clay-card-yellow p-5 flex items-center gap-4 text-[#241c3d] min-w-0">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-yellow flex-shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-amber-955 uppercase truncate">Pending Review</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5 truncate">
              {stats?.pendingApproval.toLocaleString() ?? "..."}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="clay-card-white p-4.5 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a79fc0]" />
            <input
              type="text"
              placeholder="Search turfs, location, owner..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full clay-input py-2 pl-10 pr-4 text-xs text-[#1e1b33] placeholder:text-[#a79fc0]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto py-2.5 px-1 -my-2.5">
            {([
              { label: "All Status", value: "ALL" },
              { label: "Pending Approval", value: "PENDING_APPROVAL" },
              { label: "Active", value: "ACTIVE" },
              { label: "Suspended", value: "SUSPENDED" },
              { label: "Inactive", value: "INACTIVE" },
            ] as const).map((tab) => {
              const isTabActive = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleStatusChange(tab.value)}
                  className={`px-4 py-2 text-xs font-extrabold transition-all duration-150 whitespace-nowrap ${
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

        {/* City Filter Tags */}
        <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-[#f1effb]">
          <span className="text-xs font-extrabold text-[#8a7fa8] self-center mr-2">City:</span>
          {(["ALL", "Mumbai", "Pune", "Thane", "Nashik"] as const).map((city) => {
            const isCityActive = cityFilter === city;
            return (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all duration-150 ${
                  isCityActive
                    ? "bg-[#ffe0dd] border-2 border-[#fff0ee] text-rose-950 shadow-[0_3px_0_#f9c2bd]"
                    : "bg-white text-[#5b4e79] border-2 border-[#ece8f8] hover:bg-[#f8f7fd]"
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Turf Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto" />
          <p className="text-xs font-bold text-[#8a7fa8] mt-3 animate-pulse">Loading turfs directory...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {turfs.map((turf) => {
              const image =
                turf.groundDayUrl ||
                turf.groundNightUrl ||
                turf.entranceUrl ||
                "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&h=300&fit=crop&q=80";

              let statusLabel = "Active";
              let statusClass = "bg-emerald-500 text-white border-emerald-300";

              if (turf.status === "PENDING_APPROVAL") {
                statusLabel = "Pending Approval";
                statusClass = "bg-amber-500 text-white border-amber-300 animate-pulse";
              } else if (turf.status === "SUSPENDED") {
                statusLabel = "Suspended";
                statusClass = "bg-rose-650 text-white border-rose-500";
              } else if (turf.status === "INACTIVE") {
                statusLabel = "Inactive";
                statusClass = "bg-gray-500 text-white border-gray-400";
              } else if (turf.status === "MAINTENANCE") {
                statusLabel = "Maintenance";
                statusClass = "bg-blue-500 text-white border-blue-400";
              }

              return (
                <div key={turf.id} className="clay-card-white overflow-hidden flex flex-col">
                  {/* Visual Header */}
                  <div className="relative h-44 w-full bg-purple-50 overflow-hidden rounded-t-[1.5rem]">
                    <img src={image} alt={turf.name} className="h-full w-full object-cover" />

                    {/* Featured Star Indicator */}
                    {turf.isFeatured && (
                      <div className="absolute top-4 left-4 bg-amber-400 border border-amber-300 rounded-full p-1.5 text-white shadow-md">
                        <Sparkles className="h-3.5 w-3.5 fill-current" />
                      </div>
                    )}

                    {/* Badge Status */}
                    <span className={`absolute top-4 right-4 rounded-full px-2.5 py-1 text-[9px] font-extrabold shadow-md border ${statusClass}`}>
                      {statusLabel}
                    </span>

                    {/* Price Tag */}
                    <span className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm text-white rounded-lg px-2.5 py-1 text-[10px] font-black">
                      ₹{turf.weekdayDayPrice.toLocaleString()}/hr
                    </span>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-extrabold text-[#241c3d] line-clamp-1">{turf.name}</h3>
                        {turf.averageRating > 0 && (
                          <div className="flex items-center gap-1 text-[11px] font-black text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>{turf.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-[#5b4e79] font-bold flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#a79fc0] flex-shrink-0" />
                        <span className="line-clamp-1">{turf.address}, {turf.city}</span>
                      </p>

                      <p className="text-[11px] text-[#8a7fa8] font-bold">
                        Owner: <span className="font-extrabold text-[#5b4e79]">{turf.owner?.name || "N/A"}</span>
                      </p>
                    </div>

                    {/* Sports tags & actions */}
                    <div className="pt-3 border-t-2 border-[#f1effb] flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {getSportsTags(turf.sportsType).map((sport) => (
                          <span key={sport} className="rounded-md bg-purple-50 border border-purple-100 text-[#7c3aed] text-[9px] font-bold px-2 py-0.5">
                            {sport}
                          </span>
                        ))}
                      </div>
                      <Link href={`/turfs/${turf.id}`}>
                        <button className="clay-btn-purple py-1.5 px-4 text-xs font-extrabold shadow-[0_4px_0_#7c62db]">
                          Manage
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {turfs.length === 0 && (
              <div className="col-span-full clay-card-white p-12 text-center text-xs font-extrabold text-[#8a7fa8]">
                No turfs found matching your filter selection.
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-[#f1effb] pt-5 mt-5">
              <p className="text-xs font-bold text-[#8a7fa8]">
                Showing page {pagination.page} of {pagination.pages} ({pagination.total} total turfs)
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
        </>
      )}
    </div>
  );
}
