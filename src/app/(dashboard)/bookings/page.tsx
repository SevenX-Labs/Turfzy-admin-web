"use client";

import { useState } from "react";
import { Search, Plus, CalendarRange, Clock, CreditCard, Filter } from "lucide-react";

interface BookingItem {
  id: string;
  userName: string;
  turfName: string;
  city: string;
  bookingDate: string;
  slotTime: string;
  price: string;
  paymentMode: "Razorpay" | "Cash";
  status: "Confirmed" | "Pending" | "Cancelled";
}

const dummyBookings: BookingItem[] = [
  {
    id: "#4587",
    userName: "Rahul Verma",
    turfName: "Elite Arena",
    city: "Mumbai",
    bookingDate: "May 20, 2025",
    slotTime: "07:00 PM - 08:00 PM",
    price: "₹1,200",
    paymentMode: "Razorpay",
    status: "Confirmed",
  },
  {
    id: "#4586",
    userName: "Priya Patel",
    turfName: "Playground Sports",
    city: "Pune",
    bookingDate: "May 20, 2025",
    slotTime: "06:00 PM - 07:00 PM",
    price: "₹800",
    paymentMode: "Cash",
    status: "Pending",
  },
  {
    id: "#4585",
    userName: "Neha Sharma",
    turfName: "Turf World",
    city: "Thane",
    bookingDate: "May 19, 2025",
    slotTime: "08:00 PM - 09:00 PM",
    price: "₹1,500",
    paymentMode: "Razorpay",
    status: "Confirmed",
  },
  {
    id: "#4584",
    userName: "Amit Kumar",
    turfName: "Goal Station",
    city: "Nashik",
    bookingDate: "May 19, 2025",
    slotTime: "05:00 PM - 06:00 PM",
    price: "₹900",
    paymentMode: "Razorpay",
    status: "Cancelled",
  },
  {
    id: "#4583",
    userName: "Saurabh Joshi",
    turfName: "Elite Arena",
    city: "Mumbai",
    bookingDate: "May 18, 2025",
    slotTime: "09:00 PM - 10:00 PM",
    price: "₹1,200",
    paymentMode: "Razorpay",
    status: "Confirmed",
  },
];

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Confirmed" | "Pending" | "Cancelled">("All");

  const filteredBookings = dummyBookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.userName.toLowerCase().includes(search.toLowerCase()) ||
      b.turfName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#241c3d]">Bookings Management</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5">Audit, verify, and inspect play schedules and gateway fees</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
          <Plus className="h-4 w-4" />
          New Booking
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CalendarRange className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Total Bookings</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">14,580</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Pending Payments</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">342</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#ece8f8] flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8a7fa8] uppercase">Razorpay Payments</p>
            <p className="text-xl font-extrabold text-[#241c3d] mt-0.5">85%</p>
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
            placeholder="Search booking ID, user, turf..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#ece8f8] py-2 pl-10 pr-4 text-xs text-[#1e1b33] outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(["All", "Confirmed", "Pending", "Cancelled"] as const).map((tab) => (
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

      {/* Bookings View */}
      <div className="bg-white rounded-3xl border border-[#ece8f8] overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#f6f4fd] bg-[#faf9fe]">
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Booking ID</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">User</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Turf</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Date & Slot</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Price</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Payment</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase">Status</th>
                <th className="px-6 py-4.5 text-xs font-bold text-[#8a7fa8] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f6f4fd]">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#fcfbfe] transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-[#241c3d]">{booking.id}</td>
                  <td className="px-6 py-4 text-xs font-bold text-[#5b4e79]">{booking.userName}</td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-[#241c3d]">{booking.turfName}</p>
                    <p className="text-[9px] font-semibold text-[#8a7fa8]">{booking.city}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-[#5b4e79] flex items-center gap-1">
                      {booking.bookingDate}
                    </p>
                    <p className="text-[10px] text-[#8a7fa8] mt-0.5">{booking.slotTime}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-[#241c3d]">{booking.price}</td>
                  <td className="px-6 py-4 text-xs text-[#8a7fa8] font-bold">{booking.paymentMode}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-600"
                          : booking.status === "Pending"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-xl border border-[#ece8f8] px-3 py-1.5 text-xs font-semibold text-[#5b4e79] hover:bg-[#f6f4fd] transition-all">
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm font-semibold text-[#8a7fa8]">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-[#f6f4fd] p-4 space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="p-4 bg-[#faf9fe] rounded-2xl border border-[#ece8f8] space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#241c3d]">{booking.id}</span>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    booking.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-600"
                      : booking.status === "Pending"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="pt-2 border-t border-[#f1eefb] space-y-1 text-left">
                <p className="text-xs font-bold text-[#241c3d]">
                  {booking.userName}
                </p>
                <p className="text-[11px] text-[#5b4e79] font-medium">
                  {booking.turfName} ({booking.city})
                </p>
                <p className="text-[10px] text-[#8a7fa8]">
                  Date: {booking.bookingDate} · {booking.slotTime}
                </p>
                <p className="text-[10px] text-[#8a7fa8]">
                  Payment: {booking.paymentMode}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#f1eefb]">
                <span className="text-xs font-black text-[#241c3d]">
                  {booking.price}
                </span>
                <button className="rounded-xl border border-[#ece8f8] bg-white px-3 py-1.5 text-xs font-semibold text-[#5b4e79] hover:bg-[#f6f4fd] transition-all">
                  Audit Details
                </button>
              </div>
            </div>
          ))}
          {filteredBookings.length === 0 && (
            <div className="py-8 text-center text-sm font-semibold text-[#8a7fa8]">
              No bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
