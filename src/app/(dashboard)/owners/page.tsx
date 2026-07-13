"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Phone, Calendar, Landmark, Download, ShieldCheck, ShieldAlert, Users, Award } from "lucide-react";
import { useOwnersStore } from "@/store/owners.store";
import Link from "next/link";
import { TableSkeleton, CardSkeleton } from "@/components/ui/skeleton-loaders";

export default function OwnersPage() {
  const {
    owners,
    stats,
    pagination,
    isLoading,
    fetchOwners,
    fetchOwnerStats,
    exportCsv,
    exportPdf,
  } = useOwnersStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch stats on mount
  useEffect(() => {
    fetchOwnerStats();
  }, [fetchOwnerStats]);

  // Fetch owners when parameters change
  useEffect(() => {
    fetchOwners({
      search: search || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      page: currentPage,
      limit: 10,
    });
  }, [search, statusFilter, currentPage, fetchOwners]);

  // Handle filter tab click
  const handleFilterChange = (status: typeof statusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">Owners Management</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Manage partner accounts, payouts profiles, and listing permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCsv()}
            className="clay-btn-purple px-4 py-2.5 text-xs font-extrabold flex items-center gap-1.5 shadow-[0_4px_0_#7c62db]"
          >
            <Download className="h-4 w-4" />
            CSV Export
          </button>
          <button
            onClick={() => exportPdf()}
            className="clay-btn-purple px-4 py-2.5 text-xs font-extrabold flex items-center gap-1.5 shadow-[0_4px_0_#7c62db]"
          >
            <Download className="h-4 w-4" />
            PDF Export
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="clay-card-purple p-5 flex items-center gap-4 text-[#241c3d]">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-purple">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5b4e79] uppercase">Total Owners</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5">
              {stats?.total.toLocaleString() ?? "..."}
            </p>
          </div>
        </div>
        <div className="clay-card-yellow p-5 flex items-center gap-4 text-[#241c3d]">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-yellow">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-955 uppercase">Active Owners</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5">
              {stats?.active.toLocaleString() ?? "..."}
            </p>
          </div>
        </div>
        <div className="clay-card-peach p-5 flex items-center gap-4 text-[#241c3d]">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-peach">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-rose-950 uppercase">Suspended Owners</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5">
              {stats?.suspended.toLocaleString() ?? "..."}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="clay-card-white p-4.5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a79fc0]" />
          <input
            type="text"
            placeholder="Search owners by name, email or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full clay-input py-2 pl-10 pr-4 text-xs text-[#1e1b33] placeholder:text-[#a79fc0]"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-2.5 px-1 -my-2.5">
          {([
            { label: "All Owners", value: "all" },
            { label: "Active", value: "active" },
            { label: "Suspended", value: "suspended" },
          ] as const).map((tab) => {
            const isTabActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleFilterChange(tab.value)}
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

      {/* Responsive View (Table / Card Grid) */}
      <div className="clay-card-white overflow-hidden p-6">
        {isLoading ? (
          <>
            <div className="hidden md:block">
              <TableSkeleton rowCount={5} columnCount={7} />
            </div>
            <div className="block md:hidden">
              <CardSkeleton count={3} />
            </div>
          </>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#f1effb] pb-3">
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Owner</th>
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Contact</th>
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Turfs Owned</th>
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Total Earnings</th>
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Joined Date</th>
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Status</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1effb]">
                  {owners.map((owner) => {
                    const profile = owner.profile;
                    const name = profile?.name || "No Name";
                    const email = profile?.email || "No Email";
                    const turfsOwned = profile?.totalTurfs ?? 0;
                    const totalEarnings = profile?.totalEarnings ?? 0;
                    const avatarSeed = encodeURIComponent(name);
                    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

                    let statusLabel = "Active";
                    let statusClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
                    if (owner.isBanned) {
                      statusLabel = "Suspended";
                      statusClass = "bg-rose-50 text-rose-600 border-rose-200";
                    }

                    return (
                      <tr key={owner.id} className="hover:bg-[#faf9fd]/50 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-2xl border-2 border-white bg-white/40 shadow-sm flex-shrink-0">
                              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-[#241c3d]">{name}</p>
                              <p className="text-[10px] font-bold text-[#8a7fa8] mt-0.5">{owner.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="space-y-1">
                            <p className="text-[11px] text-[#5b4e79] font-bold flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-[#a79fc0] flex-shrink-0" />
                              {email}
                            </p>
                            <p className="text-[11px] text-[#5b4e79] font-bold flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-[#a79fc0] flex-shrink-0" />
                              {owner.phone}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-xs font-extrabold text-[#241c3d]">
                          {turfsOwned} turfs
                        </td>
                        <td className="py-4 pr-4 text-xs font-black text-[#241c3d]">
                          ₹{totalEarnings.toLocaleString()}
                        </td>
                        <td className="py-4 pr-4 text-[11px] text-[#8a7fa8] font-bold">
                          {formatDate(owner.createdAt)}
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-extrabold border ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link href={`/owners/${owner.id}`}>
                            <button className="clay-btn-purple py-1.5 px-4 text-xs font-extrabold shadow-[0_4px_0_#7c62db]">
                              Manage
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {owners.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs font-extrabold text-[#8a7fa8]">
                        No owners found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-[#f1effb] space-y-4">
              {owners.map((owner) => {
                const profile = owner.profile;
                const name = profile?.name || "No Name";
                const email = profile?.email || "No Email";
                const turfsOwned = profile?.totalTurfs ?? 0;
                const totalEarnings = profile?.totalEarnings ?? 0;
                const avatarSeed = encodeURIComponent(name);
                const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

                let statusLabel = "Active";
                let statusClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
                if (owner.isBanned) {
                  statusLabel = "Suspended";
                  statusClass = "bg-rose-50 text-rose-600 border-rose-200";
                }

                return (
                  <div key={owner.id} className="p-5 bg-white rounded-3xl border-2 border-[#f1effb] shadow-[0_6px_0_#e4e2f2] space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-2xl border-2 border-white bg-white/40 shadow-sm flex-shrink-0">
                        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-extrabold text-[#241c3d]">{name}</p>
                            <p className="text-[10px] font-bold text-[#8a7fa8] mt-0.5">{owner.id}</p>
                          </div>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold border ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#f1effb] space-y-2 text-left">
                      <p className="text-[11px] text-[#5b4e79] font-bold flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-[#a79fc0] flex-shrink-0" />
                        {email}
                      </p>
                      <p className="text-[11px] text-[#5b4e79] font-bold flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-[#a79fc0] flex-shrink-0" />
                        {owner.phone}
                      </p>
                      <p className="text-[11px] text-[#5b4e79] font-bold flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#a79fc0] flex-shrink-0" />
                        Joined {formatDate(owner.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#f1effb]">
                      <div className="text-left">
                        <p className="text-[9px] text-[#8a7fa8] font-bold uppercase leading-none">Earnings</p>
                        <p className="text-xs font-black text-[#241c3d] mt-1">₹{totalEarnings.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#5b4e79] bg-[#f8f7fd] px-2.5 py-1 rounded-xl border border-[#f1effb]">
                          {turfsOwned} turfs
                        </span>
                        <Link href={`/owners/${owner.id}`}>
                          <button className="clay-btn-purple py-1.5 px-4 text-xs font-extrabold shadow-[0_4px_0_#7c62db]">
                            Manage
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              {owners.length === 0 && (
                <div className="py-8 text-center text-xs font-extrabold text-[#8a7fa8]">
                  No owners found matching your query.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-[#f1effb] pt-5 mt-5">
                <p className="text-xs font-bold text-[#8a7fa8]">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total owners)
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
    </div>
  );
}
