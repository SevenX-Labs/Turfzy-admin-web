"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSettlementsStore } from "@/store/settlements.store";
import {
  Search,
  Plus,
  Landmark,
  PiggyBank,
  RefreshCw,
  FileSpreadsheet,
  FileDown,
  Building,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TableSkeleton, CardSkeleton } from "@/components/ui/skeleton-loaders";

export default function SettlementsPage() {
  const router = useRouter();
  const {
    settlements,
    pagination,
    isLoading,
    statusFilter,
    currentPage,
    setStatusFilter,
    setCurrentPage,
    fetchSettlements,
    exportCsvReport,
    exportPdfReport,
  } = useSettlementsStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  // Compute stats client-side based on currently loaded settlements
  const totalAmount = settlements.reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = settlements
    .filter((item) => item.status === "PENDING")
    .reduce((sum, item) => sum + item.amount, 0);
  const settledAmount = settlements
    .filter((item) => item.status === "PAID" || item.status === "COMPLETED")
    .reduce((sum, item) => sum + item.amount, 0);

  // Search logic on the loaded settlements
  const filteredSettlements = settlements.filter((s) => {
    const matchesSearch =
      s.owner?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.notes?.toLowerCase().includes(search.toLowerCase()) ||
      s.period?.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "PAID":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-100";
      default:
        return "text-rose-600 bg-rose-50 border-rose-100";
    }
  };

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">Payout Settlements</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Manage bank transfer distributions and payout status</p>
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
            onClick={() => router.push("/settlements/create")}
            className="clay-btn-purple px-5 py-2.5 text-xs font-extrabold flex items-center gap-1.5 shadow-[0_5px_0_#7c62db]"
          >
            <Plus className="h-4 w-4" />
            Create Settlement
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="clay-card-yellow p-5 flex items-center gap-4 text-[#241c3d]">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-yellow flex-shrink-0">
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-955 uppercase">Pending Payouts</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5">₹{pendingAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="clay-card-green p-5 flex items-center gap-4 text-[#241c3d]">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-green flex-shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-950 uppercase">Settled / Paid Payouts</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5">₹{settledAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="clay-card-purple p-5 flex items-center gap-4 text-[#241c3d]">
          <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-purple flex-shrink-0">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#5b4e79] uppercase">Total Payouts Sum</p>
            <p className="text-xl font-black text-[#241c3d] mt-0.5">₹{totalAmount.toLocaleString()}</p>
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
            placeholder="Search notes, period, owner name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full clay-input py-2 pl-10 pr-4 text-xs text-[#1e1b33] placeholder:text-[#a79fc0]"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-2.5 px-1 -my-2.5">
          {(["ALL", "PENDING", "PAID", "COMPLETED"] as const).map((tab) => {
            const isTabActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 text-xs font-extrabold transition-all duration-150 whitespace-nowrap ${
                  isTabActive
                    ? "clay-btn-purple shadow-[0_4px_0_#7c62db]"
                    : "rounded-xl bg-[#f8f7fd] border-2 border-[#f1effb] text-[#5b4e79] hover:bg-[#f3effc]"
                }`}
              >
                {tab === "ALL" ? "All Settlements" : tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Settlements Table / Cards */}
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
              <table className="w-full border-collapse text-left min-w-[900px]">
                <thead>
                  <tr className="border-b-2 border-[#f1effb] pb-3">
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Settlement ID</th>
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Owner / Partner</th>
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Period & Notes</th>
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Bookings</th>
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Payout Amount</th>
                    <th className="pb-4 pr-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Status</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1effb]">
                  {filteredSettlements.map((s) => (
                    <tr key={s.id} className="hover:bg-[#faf9fd]/50 transition-colors">
                      <td className="py-4 pr-4 text-xs font-bold text-[#241c3d] max-w-[120px] truncate" title={s.id}>
                        {s.id.slice(0, 8)}...
                      </td>
                      <td className="py-4 pr-4">
                        <p className="text-xs font-extrabold text-[#241c3d]">{s.owner?.name || "N/A"}</p>
                        <p className="text-[10px] text-[#8a7fa8] font-bold mt-0.5">{s.owner?.contactNumber}</p>
                      </td>
                      <td className="py-4 pr-4 max-w-[200px]">
                        <p className="text-xs text-[#241c3d] font-extrabold truncate">{s.period || "Ad-hoc payout"}</p>
                        <p className="text-[10px] text-[#8a7fa8] font-semibold mt-0.5 truncate">{s.notes || "No notes attached"}</p>
                      </td>
                      <td className="py-4 pr-4 text-xs font-bold text-[#5b4e79]">
                        {s.bookingCount ? `${s.bookingCount} Bookings` : "Manual"}
                      </td>
                      <td className="py-4 pr-4 text-xs font-black text-purple-600">₹{s.amount.toLocaleString()}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-extrabold border ${getStatusColor(s.status)}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => router.push(`/settlements/${s.id}`)}
                          className="clay-btn-purple py-1.5 px-4 text-xs font-extrabold shadow-[0_4px_0_#7c62db]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredSettlements.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs font-extrabold text-[#8a7fa8]">
                        No payout settlements found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden space-y-5">
              {filteredSettlements.map((s) => (
                <div key={s.id} className="p-5 bg-white rounded-3xl border-2 border-[#f1effb] shadow-[0_6px_0_#e4e2f2] space-y-3.5 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-[#8a7fa8]">ID: {s.id.slice(0, 8)}...</span>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold border ${getStatusColor(s.status)}`}>
                      {s.status}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#f1effb] space-y-2">
                    <div>
                      <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Owner</p>
                      <p className="text-xs font-extrabold text-[#241c3d]">{s.owner?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Period & Notes</p>
                      <p className="text-xs font-extrabold text-[#241c3d]">{s.period || "Ad-hoc payout"}</p>
                      <p className="text-[10px] text-[#5b4e79] font-bold mt-0.5">{s.notes}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Bookings Count</p>
                        <p className="text-xs font-extrabold text-[#241c3d]">{s.bookingCount ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Amount</p>
                        <p className="text-xs font-black text-purple-600">₹{s.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f1effb]">
                    <button
                      onClick={() => router.push(`/settlements/${s.id}`)}
                      className="clay-btn-purple py-2 w-full text-xs font-extrabold shadow-[0_4px_0_#7c62db]"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
              {filteredSettlements.length === 0 && (
                <div className="py-12 text-center text-xs font-extrabold text-[#8a7fa8]">
                  No payout settlements found.
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-[#f1effb] pt-5 mt-5">
                <p className="text-xs font-extrabold text-[#8a7fa8]">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-[#ece8f8] bg-white text-[#5b4e79] hover:bg-[#f8f7fd] disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                    disabled={currentPage === pagination.pages}
                    className="p-2 rounded-xl border border-[#ece8f8] bg-white text-[#5b4e79] hover:bg-[#f8f7fd] disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
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
