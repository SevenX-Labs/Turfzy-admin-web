"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Phone, Calendar, MapPin, Download, UserCheck, UserX, Users } from "lucide-react";
import { useUsersStore } from "@/store/users.store";
import Link from "next/link";

export default function UsersPage() {
  const {
    users,
    stats,
    pagination,
    isLoading,
    fetchUsers,
    fetchUserStats,
    exportCsv,
    exportPdf,
  } = useUsersStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "deleted">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch stats on mount
  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  // Fetch users when parameters change
  useEffect(() => {
    fetchUsers({
      search: search || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      page: currentPage,
      limit: 10,
    });
  }, [search, statusFilter, currentPage, fetchUsers]);

  // Handle filter tab click
  const handleFilterChange = (status: typeof statusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset page on filter change
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
          <h2 className="text-2xl font-black text-[#241c3d]">Users Management</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Manage, audit, and inspect user profiles</p>
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
            <p className="text-[10px] font-bold text-[#5b4e79] uppercase">Total Users</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5">
              {stats?.total.toLocaleString() ?? "..."}
            </p>
          </div>
        </div>
        <div className="clay-card-yellow p-5 flex items-center gap-4 text-[#241c3d]">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-yellow">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-950 uppercase">Active Users</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5">
              {stats?.active.toLocaleString() ?? "..."}
            </p>
          </div>
        </div>
        <div className="clay-card-peach p-5 flex items-center gap-4 text-[#241c3d]">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-peach">
            <UserX className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-rose-950 uppercase">Suspended Users</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5">
              {stats?.suspended.toLocaleString() ?? "..."}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="clay-card-white p-4.5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a79fc0]" />
          <input
            type="text"
            placeholder="Search users by name, email or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full clay-input py-2 pl-10 pr-4 text-xs text-[#1e1b33] placeholder:text-[#a79fc0]"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto py-2.5 px-1 -my-2.5">
          {([
            { label: "All Users", value: "all" },
            { label: "Active", value: "active" },
            { label: "Suspended", value: "suspended" },
            { label: "Deleted", value: "deleted" },
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
          <div className="py-24 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto" />
            <p className="text-xs font-bold text-[#8a7fa8] mt-3 animate-pulse">Loading users database...</p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#f1effb] pb-3">
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase">User</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Contact</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Location</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Registered At</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Status</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1effb]">
                  {users.map((user) => {
                    const profile = user.userProfile;
                    const name = profile?.name || "No Name";
                    const email = profile?.email || "No Email";
                    const city = profile?.city || "N/A";
                    const avatarSeed = encodeURIComponent(name);
                    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

                    let statusLabel = "Active";
                    let statusClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
                    if (user.deletedAt) {
                      statusLabel = "Deleted";
                      statusClass = "bg-slate-50 text-slate-500 border-slate-200";
                    } else if (user.isBanned) {
                      statusLabel = "Suspended";
                      statusClass = "bg-rose-50 text-rose-600 border-rose-200";
                    }

                    return (
                      <tr key={user.id} className="hover:bg-[#faf9fd]/50 transition-colors">
                        <td className="py-4 flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-2xl border-2 border-white bg-white/40 shadow-sm flex-shrink-0">
                            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-[#241c3d]">{name}</p>
                            <p className="text-[10px] font-bold text-[#8a7fa8] mt-0.5">{user.id}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="space-y-1">
                            <p className="text-[11px] text-[#5b4e79] font-bold flex items-center gap-1.5">
                              <Mail className="h-3.5 w-3.5 text-[#a79fc0] flex-shrink-0" />
                              {email}
                            </p>
                            <p className="text-[11px] text-[#5b4e79] font-bold flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-[#a79fc0] flex-shrink-0" />
                              {user.phone}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="text-xs font-extrabold text-[#241c3d] flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#a79fc0]" />
                            {city}
                          </div>
                        </td>
                        <td className="py-4 text-[11px] text-[#8a7fa8] font-bold">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-4">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-extrabold border ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link href={`/users/${user.id}`}>
                            <button className="clay-btn-purple py-1.5 px-4 text-xs font-extrabold shadow-[0_4px_0_#7c62db]">
                              Manage
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-xs font-extrabold text-[#8a7fa8]">
                        No users found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-[#f1effb] space-y-4">
              {users.map((user) => {
                const profile = user.userProfile;
                const name = profile?.name || "No Name";
                const email = profile?.email || "No Email";
                const city = profile?.city || "N/A";
                const avatarSeed = encodeURIComponent(name);
                const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

                let statusLabel = "Active";
                let statusClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
                if (user.deletedAt) {
                  statusLabel = "Deleted";
                  statusClass = "bg-slate-50 text-slate-500 border-slate-200";
                } else if (user.isBanned) {
                  statusLabel = "Suspended";
                  statusClass = "bg-rose-50 text-rose-600 border-rose-200";
                }

                return (
                  <div key={user.id} className="p-5 bg-white rounded-3xl border-2 border-[#f1effb] shadow-[0_6px_0_#e4e2f2] space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-2xl border-2 border-white bg-white/40 shadow-sm flex-shrink-0">
                        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-extrabold text-[#241c3d]">{name}</p>
                            <p className="text-[10px] font-bold text-[#8a7fa8] mt-0.5">{user.id}</p>
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
                        {user.phone}
                      </p>
                      <p className="text-[11px] text-[#5b4e79] font-bold flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#a79fc0] flex-shrink-0" />
                        {city}
                      </p>
                      <p className="text-[11px] text-[#5b4e79] font-bold flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#a79fc0] flex-shrink-0" />
                        Joined {formatDate(user.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-end pt-3 border-t border-[#f1effb]">
                      <Link href={`/users/${user.id}`}>
                        <button className="clay-btn-purple py-1.5 px-4 text-xs font-extrabold shadow-[0_4px_0_#7c62db]">
                          Manage User
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
              {users.length === 0 && (
                <div className="py-8 text-center text-xs font-extrabold text-[#8a7fa8]">
                  No users found matching your query.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-[#f1effb] pt-5 mt-5">
                <p className="text-xs font-bold text-[#8a7fa8]">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total users)
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
