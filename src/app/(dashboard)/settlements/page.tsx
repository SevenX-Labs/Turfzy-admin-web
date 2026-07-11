"use client";

import { useState } from "react";
import { Search, Plus, Landmark, PiggyBank, RefreshCw } from "lucide-react";

interface SettlementItem {
  id: string;
  ownerName: string;
  turfName: string;
  amount: string;
  bankName: string;
  accountNo: string;
  payoutDate: string;
  status: "Paid" | "Pending";
}

const dummySettlements: SettlementItem[] = [
  {
    id: "SET-501",
    ownerName: "Rohit Sharma",
    turfName: "Elite Arena",
    amount: "₹25,000",
    bankName: "HDFC Bank",
    accountNo: "******8921",
    payoutDate: "May 20, 2025",
    status: "Paid",
  },
  {
    id: "SET-502",
    ownerName: "Sandeep Patil",
    turfName: "Playground Sports",
    amount: "₹18,500",
    bankName: "ICICI Bank",
    accountNo: "******1204",
    payoutDate: "May 19, 2025",
    status: "Paid",
  },
  {
    id: "SET-503",
    ownerName: "Amit Verma",
    turfName: "Turf World",
    amount: "₹21,000",
    bankName: "SBI Bank",
    accountNo: "******4567",
    payoutDate: "May 19, 2025",
    status: "Paid",
  },
  {
    id: "SET-504",
    ownerName: "Vikram Singh",
    turfName: "Goal Station",
    amount: "₹15,300",
    bankName: "Axis Bank",
    accountNo: "******7890",
    payoutDate: "May 18, 2025",
    status: "Paid",
  },
  {
    id: "SET-505",
    ownerName: "Vinay Kumar",
    turfName: "Green Field Arena",
    amount: "₹12,400",
    bankName: "HDFC Bank",
    accountNo: "******9988",
    payoutDate: "May 15, 2025",
    status: "Pending",
  },
];

export default function SettlementsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Paid" | "Pending">("All");

  const filteredSettlements = dummySettlements.filter((s) => {
    const matchesSearch =
      s.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      s.turfName.toLowerCase().includes(search.toLowerCase()) ||
      s.bankName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241c3d]">Payout Settlements</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5">Manage bank transfer distributions and payout status</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
          <Plus className="h-4 w-4" />
          Create Settlement
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Pending Settlements</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">₹48,000</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Settled Today</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">₹1,20,000</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Last Sync Date</p>
            <p className="text-xs font-bold text-[#241c3d] mt-1.5">2 min ago</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#ece8f8] flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a79fc0]" />
          <input
            type="text"
            placeholder="Search bank name, owner, turf..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#ece8f8] py-2 pl-10 pr-4 text-xs text-[#1e1b33] outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(["All", "Paid", "Pending"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                filter === tab
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/10"
                  : "bg-[#f8f7fd] text-[#5b4e79] hover:bg-[#f3effc]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Settlements Table / Cards */}
      <div className="bg-white rounded-3xl border border-[#ece8f8] overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#f6f4fd] bg-[#faf9fe]">
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Settlement ID</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Owner</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Turf</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Bank Account</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Payout Amount</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Date</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Status</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6f4fd]">
              {filteredSettlements.map((s) => (
                <tr key={s.id} className="hover:bg-[#fcfbfe] transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-[#241c3d]">{s.id}</td>
                  <td className="px-6 py-4 text-xs font-bold text-[#5b4e79]">{s.ownerName}</td>
                  <td className="px-6 py-4 text-xs text-[#241c3d] font-bold">{s.turfName}</td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-[#241c3d]">{s.bankName}</p>
                    <p className="text-[10px] text-[#8a7fa8] mt-0.5">{s.accountNo}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-[#241c3d]">{s.amount}</td>
                  <td className="px-6 py-4 text-xs text-[#8a7fa8] font-medium">{s.payoutDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                        s.status === "Paid"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-xl border border-[#ece8f8] px-3 py-1.5 text-xs font-semibold text-[#5b4e79] hover:bg-[#f6f4fd] transition-all">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSettlements.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm font-semibold text-[#8a7fa8]">
                    No settlements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-[#f6f4fd] p-4 space-y-4">
          {filteredSettlements.map((s) => (
            <div key={s.id} className="p-4 bg-[#faf9fe] rounded-2xl border border-[#ece8f8] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#241c3d]">{s.id}</span>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    s.status === "Paid"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="pt-2 border-t border-[#f1eefb] space-y-1 text-left">
                <p className="text-xs font-bold text-[#241c3d]">
                  {s.ownerName}
                </p>
                <p className="text-[11px] text-[#5b4e79] font-medium">
                  {s.turfName}
                </p>
                <p className="text-[10px] text-[#8a7fa8]">
                  Bank: {s.bankName} ({s.accountNo})
                </p>
                <p className="text-[10px] text-[#8a7fa8]">
                  Payout Date: {s.payoutDate}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f1eefb]">
                <span className="text-xs font-black text-[#241c3d]">
                  {s.amount}
                </span>
                <button className="rounded-xl border border-[#ece8f8] bg-white px-3 py-1.5 text-xs font-semibold text-[#5b4e79] hover:bg-[#f6f4fd] transition-all">
                  Inspect Bank Logs
                </button>
              </div>
            </div>
          ))}
          {filteredSettlements.length === 0 && (
            <div className="py-8 text-center text-sm font-semibold text-[#8a7fa8]">
              No payouts found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
