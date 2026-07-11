"use client";

import { useState } from "react";
import { Search, UserCheck, UserX, UserMinus, Plus, Mail, Phone, Calendar } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingsCount: number;
  status: "Active" | "Blocked" | "Inactive";
  joinedDate: string;
  avatar: string;
}

const dummyUsers: UserItem[] = [
  {
    id: "USR-001",
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 98765 43210",
    bookingsCount: 24,
    status: "Active",
    joinedDate: "Jan 12, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul",
  },
  {
    id: "USR-002",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 98210 87654",
    bookingsCount: 18,
    status: "Active",
    joinedDate: "Feb 05, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Priya",
  },
  {
    id: "USR-003",
    name: "Saurabh Joshi",
    email: "saurabh.j@example.com",
    phone: "+91 91234 56789",
    bookingsCount: 5,
    status: "Inactive",
    joinedDate: "Mar 20, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Saurabh",
  },
  {
    id: "USR-004",
    name: "Amit Kumar",
    email: "amit.k@example.com",
    phone: "+91 95555 44444",
    bookingsCount: 12,
    status: "Blocked",
    joinedDate: "Apr 02, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Amit",
  },
  {
    id: "USR-005",
    name: "Neha Sharma",
    email: "neha.s@example.com",
    phone: "+91 99887 76655",
    bookingsCount: 30,
    status: "Active",
    joinedDate: "Apr 15, 2025",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Neha",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Blocked" | "Inactive">("All");

  const filteredUsers = dummyUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchesFilter = filter === "All" || u.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241c3d]">Users Management</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5">Manage, audit, and inspect user profiles</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
          <Plus className="h-4 w-4" />
          Add New User
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Active Users</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">11,200</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <UserX className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Blocked Users</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">140</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <UserMinus className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Inactive Users</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">1,240</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#ece8f8] flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a79fc0]" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#ece8f8] py-2 pl-10 pr-4 text-xs text-[#1e1b33] outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(["All", "Active", "Blocked", "Inactive"] as const).map((tab) => (
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
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">User</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Contact</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Bookings</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Joined Date</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Status</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6f4fd]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#fcfbfe] transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border border-purple-100 bg-[#f3effc]">
                      <img src={user.avatar} alt={user.name} className="h-full w-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#241c3d]">{user.name}</p>
                      <p className="text-[10px] font-semibold text-[#8a7fa8]">{user.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs text-[#5b4e79] flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-[#a79fc0]" />
                        {user.email}
                      </p>
                      <p className="text-xs text-[#5b4e79] flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-[#a79fc0]" />
                        {user.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#241c3d]">
                    {user.bookingsCount} bookings
                  </td>
                  <td className="px-6 py-4 text-xs text-[#8a7fa8] font-medium">
                    {user.joinedDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : user.status === "Blocked"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-xl border border-[#ece8f8] px-3 py-1.5 text-xs font-semibold text-[#5b4e79] hover:bg-[#f6f4fd] transition-all">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm font-semibold text-[#8a7fa8]">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-[#f6f4fd] p-4 space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 bg-[#faf9fe] rounded-2xl border border-[#ece8f8] space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full border border-purple-100 bg-[#f3effc]">
                  <img src={user.avatar} alt={user.name} className="h-full w-full" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-[#241c3d]">{user.name}</p>
                      <p className="text-[10px] font-semibold text-[#8a7fa8]">{user.id}</p>
                    </div>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : user.status === "Blocked"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#f1eefb] space-y-1.5 text-left">
                <p className="text-[11px] text-[#5b4e79] flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#a79fc0]" />
                  {user.email}
                </p>
                <p className="text-[11px] text-[#5b4e79] flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#a79fc0]" />
                  {user.phone}
                </p>
                <p className="text-[11px] text-[#5b4e79] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#a79fc0]" />
                  Joined {user.joinedDate}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f1eefb]">
                <span className="text-xs font-bold text-[#241c3d]">
                  {user.bookingsCount} bookings
                </span>
                <button className="rounded-xl border border-[#ece8f8] bg-white px-3 py-1.5 text-xs font-semibold text-[#5b4e79] hover:bg-[#f6f4fd] transition-all">
                  Manage User
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="py-8 text-center text-sm font-semibold text-[#8a7fa8]">
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
