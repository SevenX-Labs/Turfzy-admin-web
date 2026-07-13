"use client";

import { useEffect, useState } from "react";
import { useAuditLogsStore } from "@/store/audit-logs.store";
import { Search, Calendar, RefreshCw, Clock, Terminal, User } from "lucide-react";
import { TableSkeleton, CardSkeleton } from "@/components/ui/skeleton-loaders";

export default function AuditLogsPage() {
  const {
    logs,
    total,
    page,
    pages,
    isLoading,
    fetchLogs,
  } = useAuditLogsStore();

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(1);

  // Trigger search and filter refetches
  useEffect(() => {
    fetchLogs({
      search: search.trim() || undefined,
      action: actionFilter || undefined,
      page: pageIndex,
      limit: 10,
    });
  }, [fetchLogs, search, actionFilter, pageIndex]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPageIndex(1); // Reset page index on search change
  };

  const handleActionFilterChange = (val: string) => {
    setActionFilter(val);
    setPageIndex(1); // Reset page index on filter change
  };

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">Audit Activity Logs</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Track and review administrative actions, system modifications, and IP addresses</p>
        </div>
        <button
          onClick={() => fetchLogs({ search: search.trim() || undefined, action: actionFilter || undefined, page: pageIndex })}
          className="p-2.5 rounded-2xl border-2 border-[#f1effb] bg-white text-[#5b4e79] hover:bg-[#f3effc] shadow-[0_4px_0_#ece8f8] active:translate-y-0.5 transition-all self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="clay-card-white p-4.5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs text-left">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a79fc0]" />
          <input
            type="text"
            placeholder="Search action logs, admin..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full clay-input py-2 pl-10 pr-4 text-xs text-[#1e1b33] placeholder:text-[#a79fc0]"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto py-2.5 px-1 -my-2.5 no-scrollbar">
          {([
            { label: "All Actions", value: "" },
            { label: "Create", value: "CREATE" },
            { label: "Update", value: "UPDATE" },
            { label: "Delete", value: "DELETE" },
            { label: "Login", value: "LOGIN" },
            { label: "Logout", value: "LOGOUT" },
          ] as const).map((tab) => {
            const isTabActive = actionFilter === tab.value;
            return (
              <button
                key={tab.label}
                onClick={() => handleActionFilterChange(tab.value)}
                className={`px-3.5 py-1.5 text-xs font-extrabold whitespace-nowrap transition-all duration-150 rounded-xl ${
                  isTabActive
                    ? "clay-btn-purple shadow-[0_4px_0_#7c62db]"
                    : "bg-[#f8f7fd] border-2 border-[#f1effb] text-[#5b4e79] hover:bg-[#f3effc]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Logs list/table */}
      <div className="clay-card-white overflow-hidden p-6">
        {isLoading ? (
          <>
            <div className="hidden md:block">
              <TableSkeleton rowCount={5} columnCount={5} />
            </div>
            <div className="block md:hidden">
              <CardSkeleton count={3} />
            </div>
          </>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center">
            <Terminal className="h-8 w-8 text-[#a79fc0] mx-auto opacity-70" />
            <p className="text-xs font-bold text-[#8a7fa8] mt-3">No activity logs matched your criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#f1effb] pb-3">
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Admin Operator</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Action</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Module</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase">IP Address</th>
                    <th className="pb-4 text-xs font-extrabold text-[#8a7fa8] uppercase">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1effb]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#faf9fd]/50 transition-colors text-xs font-semibold text-[#5b4e79]">
                      <td className="py-4 font-extrabold text-[#241c3d]">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#8a7fa8]" />
                          <span>{log.admin?.name || "System"}</span>
                        </div>
                      </td>
                      <td className="py-4 text-[#241c3d] font-bold leading-relaxed max-w-md">{log.action}</td>
                      <td className="py-4">
                        <span className="rounded-md bg-[#f3effc] border border-purple-100 text-[#7c3aed] text-[9px] font-black px-2.5 py-0.5">
                          {log.module}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-[#8a7fa8]">{log.ipAddress || "N/A"}</td>
                      <td className="py-4 text-[#8a7fa8] flex items-center gap-1 mt-0.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden divide-y divide-[#f1effb] space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="p-4.5 bg-white rounded-3xl border-2 border-[#f1effb] shadow-[0_6px_0_#e4e2f2] space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#241c3d]">
                      <User className="h-3.5 w-3.5 text-[#8a7fa8]" />
                      <span>{log.admin?.name || "System"}</span>
                    </div>
                    <span className="rounded bg-purple-50 border border-purple-100 text-[#7c3aed] text-[9px] font-black px-2 py-0.5">
                      {log.module}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#f1effb] space-y-1.5">
                    <p className="text-xs text-[#241c3d] font-semibold leading-relaxed">{log.action}</p>
                    <div className="flex justify-between items-center text-[10px] text-[#8a7fa8] font-bold">
                      <p className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-mono">IP: {log.ipAddress || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {pages > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-[#f1effb]">
                <button
                  onClick={() => setPageIndex(page - 1)}
                  disabled={page <= 1}
                  className="clay-btn-purple px-4 py-2 text-[10px] font-black uppercase disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-xs font-bold text-[#5b4e79]">
                  Page {page} of {pages}
                </span>
                <button
                  onClick={() => setPageIndex(page + 1)}
                  disabled={page >= pages}
                  className="clay-btn-purple px-4 py-2 text-[10px] font-black uppercase disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
