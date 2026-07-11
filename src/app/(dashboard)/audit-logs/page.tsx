"use client";

import { useState } from "react";
import { Search, Eye, Filter, Calendar } from "lucide-react";

interface AuditLogItem {
  id: string;
  adminName: string;
  action: string;
  module: "Turfs" | "Bookings" | "Fees" | "Settlements" | "Users";
  timestamp: string;
  ipAddress: string;
}

const dummyLogs: AuditLogItem[] = [
  {
    id: "LOG-001",
    adminName: "Super Admin",
    action: "Approved Green Field Arena listed under Mumbai BKC",
    module: "Turfs",
    timestamp: "May 20, 2025, 11:34 AM",
    ipAddress: "192.168.1.12",
  },
  {
    id: "LOG-002",
    adminName: "Super Admin",
    action: "Modified Base Commission Fee from 12% to 15%",
    module: "Fees",
    timestamp: "May 19, 2025, 04:12 PM",
    ipAddress: "192.168.1.12",
  },
  {
    id: "LOG-003",
    adminName: "Admin Assistant",
    action: "Initiated Settlement payout reference SET-502 to Sandeep Patil",
    module: "Settlements",
    timestamp: "May 19, 2025, 02:45 PM",
    ipAddress: "192.168.1.48",
  },
  {
    id: "LOG-004",
    adminName: "Super Admin",
    action: "Blocked user account USR-004 (Amit Kumar) due to spam reports",
    module: "Users",
    timestamp: "May 18, 2025, 09:20 AM",
    ipAddress: "192.168.1.12",
  },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<"All" | "Turfs" | "Bookings" | "Fees" | "Settlements" | "Users">("All");

  const filteredLogs = dummyLogs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.adminName.toLowerCase().includes(search.toLowerCase()) ||
      l.ipAddress.includes(search);
    const matchesModule = moduleFilter === "All" || l.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">Audit Activity Logs</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Track and review administrative actions, system modifications, and IP addresses</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#ece8f8] flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a79fc0]" />
          <input
            type="text"
            placeholder="Search action logs, admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#ece8f8] py-2 pl-10 pr-4 text-xs text-[#1e1b33] outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(["All", "Turfs", "Bookings", "Fees", "Settlements", "Users"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setModuleFilter(tab)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                moduleFilter === tab
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/10"
                  : "bg-[#f8f7fd] text-[#5b4e79] hover:bg-[#f3effc]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Logs View */}
      <div className="bg-white rounded-3xl border border-[#ece8f8] overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#f6f4fd] bg-[#faf9fe]">
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Log ID</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Admin Operator</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Action</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Module</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Timestamp</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6f4fd]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#fcfbfe] transition-colors text-xs">
                  <td className="px-6 py-4 font-bold text-[#241c3d]">{log.id}</td>
                  <td className="px-6 py-4 font-bold text-[#5b4e79]">{log.adminName}</td>
                  <td className="px-6 py-4 text-[#241c3d] font-semibold leading-relaxed max-w-sm">{log.action}</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-purple-50 border border-purple-100 text-[#7c3aed] text-[9px] font-bold px-2 py-0.5">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#8a7fa8] font-medium">{log.timestamp}</td>
                  <td className="px-6 py-4 text-[#8a7fa8] font-mono">{log.ipAddress}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm font-semibold text-[#8a7fa8]">
                    No system log entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-[#f6f4fd] p-4 space-y-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 bg-[#faf9fe] rounded-2xl border border-[#ece8f8] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#241c3d]">{log.id}</span>
                <span className="rounded bg-purple-50 border border-purple-100 text-[#7c3aed] text-[9px] font-bold px-2 py-0.5">
                  {log.module}
                </span>
              </div>

              <div className="pt-2 border-t border-[#f1eefb] space-y-1.5 text-left">
                <p className="text-xs font-bold text-[#5b4e79]">{log.adminName}</p>
                <p className="text-xs text-[#241c3d] font-semibold leading-relaxed">{log.action}</p>
                <p className="text-[10px] text-[#8a7fa8] flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {log.timestamp}
                </p>
                <p className="text-[10px] text-[#8a7fa8] font-mono">
                  IP: {log.ipAddress}
                </p>
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="py-8 text-center text-sm font-semibold text-[#8a7fa8]">
              No system log entries found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
