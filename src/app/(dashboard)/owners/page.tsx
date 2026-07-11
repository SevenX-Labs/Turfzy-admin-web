"use client";

import { useState } from "react";
import { Search, Plus, ShieldCheck, Mail, Phone, Calendar, Landmark } from "lucide-react";

interface OwnerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  turfsOwned: number;
  totalEarnings: string;
  status: "Verified" | "Pending" | "Suspended";
  joinedDate: string;
  avatar: string;
}

const dummyOwners: OwnerItem[] = [
  {
    id: "OWN-401",
    name: "Rohit Sharma",
    email: "rohit.sharma@example.com",
    phone: "+91 90123 45678",
    turfsOwned: 2,
    totalEarnings: "₹3,45,000",
    status: "Verified",
    joinedDate: "Dec 10, 2024",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rohit",
  },
  {
    id: "OWN-402",
    name: "Sandeep Patil",
    email: "sandeep.patil@example.com",
    phone: "+91 93210 12345",
    turfsOwned: 1,
    totalEarnings: "₹1,85,500",
    status: "Verified",
    joinedDate: "Jan 18, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sandeep",
  },
  {
    id: "OWN-403",
    name: "Amit Verma",
    email: "amit.verma@example.com",
    phone: "+91 98888 77777",
    turfsOwned: 3,
    totalEarnings: "₹6,12,000",
    status: "Verified",
    joinedDate: "Feb 02, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Amit",
  },
  {
    id: "OWN-404",
    name: "Vikram Singh",
    email: "vikram.s@example.com",
    phone: "+91 95555 66666",
    turfsOwned: 1,
    totalEarnings: "₹98,000",
    status: "Verified",
    joinedDate: "Mar 10, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vikram",
  },
  {
    id: "OWN-405",
    name: "Vinay Kumar",
    email: "vinay.k@example.com",
    phone: "+91 97777 88888",
    turfsOwned: 2,
    totalEarnings: "₹0",
    status: "Pending",
    joinedDate: "May 01, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Vinay",
  },
];

export default function OwnersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Verified" | "Pending" | "Suspended">("All");

  const filteredOwners = dummyOwners.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchesFilter = filter === "All" || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241c3d]">Owners Management</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5">Manage partner accounts, payouts profiles, and listing permissions</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
          <Plus className="h-4 w-4" />
          Add New Owner
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Verified Owners</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">380</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Pending Audits</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">40</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Total Settlements Paid</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">₹12.4L</p>
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
            placeholder="Search owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#ece8f8] py-2 pl-10 pr-4 text-xs text-[#1e1b33] outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(["All", "Verified", "Pending", "Suspended"] as const).map((tab) => (
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

      {/* Responsive View (Table / Card Grid) */}
      <div className="bg-white rounded-3xl border border-[#ece8f8] overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#f6f4fd] bg-[#faf9fe]">
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Owner</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Contact</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Turfs Owned</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Total Earnings</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Joined Date</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Status</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6f4fd]">
              {filteredOwners.map((owner) => (
                <tr key={owner.id} className="hover:bg-[#fcfbfe] transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border border-purple-100 bg-[#f3effc]">
                      <img src={owner.avatar} alt={owner.name} className="h-full w-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#241c3d]">{owner.name}</p>
                      <p className="text-[10px] font-semibold text-[#8a7fa8]">{owner.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs text-[#5b4e79] flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-[#a79fc0]" />
                        {owner.email}
                      </p>
                      <p className="text-xs text-[#5b4e79] flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-[#a79fc0]" />
                        {owner.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#241c3d]">
                    {owner.turfsOwned} turfs
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-[#241c3d]">
                    {owner.totalEarnings}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#8a7fa8] font-medium">
                    {owner.joinedDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        owner.status === "Verified"
                          ? "bg-emerald-50 text-emerald-600"
                          : owner.status === "Pending"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {owner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-xl border border-[#ece8f8] px-3 py-1.5 text-xs font-semibold text-[#5b4e79] hover:bg-[#f6f4fd] transition-all">
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOwners.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm font-semibold text-[#8a7fa8]">
                    No owners found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-[#f6f4fd] p-4 space-y-4">
          {filteredOwners.map((owner) => (
            <div key={owner.id} className="p-4 bg-[#faf9fe] rounded-2xl border border-[#ece8f8] space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full border border-purple-100 bg-[#f3effc]">
                  <img src={owner.avatar} alt={owner.name} className="h-full w-full" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-[#241c3d]">{owner.name}</p>
                      <p className="text-[10px] font-semibold text-[#8a7fa8]">{owner.id}</p>
                    </div>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        owner.status === "Verified"
                          ? "bg-emerald-50 text-emerald-600"
                          : owner.status === "Pending"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {owner.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#f1eefb] space-y-1.5 text-left">
                <p className="text-[11px] text-[#5b4e79] flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#a79fc0]" />
                  {owner.email}
                </p>
                <p className="text-[11px] text-[#5b4e79] flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#a79fc0]" />
                  {owner.phone}
                </p>
                <p className="text-[11px] text-[#5b4e79] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#a79fc0]" />
                  Joined {owner.joinedDate}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f1eefb]">
                <div className="text-left">
                  <p className="text-[10px] text-[#8a7fa8] font-bold uppercase leading-none">Earnings</p>
                  <p className="text-xs font-black text-[#241c3d] mt-1">{owner.totalEarnings}</p>
                </div>
                <button className="rounded-xl border border-[#ece8f8] bg-white px-3 py-1.5 text-xs font-semibold text-[#5b4e79] hover:bg-[#f6f4fd] transition-all">
                  Configure Owner
                </button>
              </div>
            </div>
          ))}
          {filteredOwners.length === 0 && (
            <div className="py-8 text-center text-sm font-semibold text-[#8a7fa8]">
              No owners found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
