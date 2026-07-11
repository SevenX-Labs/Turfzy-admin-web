"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useUsersStore } from "@/store/users.store";
import {
  User as UserIcon,
  Wallet,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  const {
    selectedUser,
    selectedUserBookings,
    isLoading,
    isActionLoading,
    fetchUserDetails,
    fetchUserBookings,
    suspendUser,
    activateUser,
    deleteUser,
    clearSelectedUser,
  } = useUsersStore();

  const [suspendReason, setSuspendReason] = useState("");
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  // Fetch details and bookings on mount/id change
  useEffect(() => {
    fetchUserDetails(userId);
    fetchUserBookings(userId);
    return () => {
      clearSelectedUser();
    };
  }, [userId, fetchUserDetails, fetchUserBookings, clearSelectedUser]);

  // Handle suspension
  const handleSuspendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendReason.trim()) return;
    const success = await suspendUser(userId, suspendReason);
    if (success) {
      setShowSuspendModal(false);
      setSuspendReason("");
    }
  };

  // Handle activation
  const handleActivate = async () => {
    if (confirm("Are you sure you want to reactivate this user account?")) {
      await activateUser(userId);
    }
  };

  // Handle deletion
  const handleDelete = async () => {
    if (confirm("Are you sure you want to soft delete this user account? This cannot be undone.")) {
      await deleteUser(userId);
    }
  };

  // Format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  if (isLoading && !selectedUser) {
    return (
      <div className="py-24 text-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto" />
        <p className="text-xs font-bold text-[#8a7fa8] mt-3 animate-pulse">Loading user profile details...</p>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-sm font-bold text-[#8a7fa8]">User profile not found.</p>
        <Link href="/users" className="clay-btn-purple py-2 px-5 text-xs font-extrabold shadow-[0_4px_0_#7c62db] inline-block">
          Back to Users
        </Link>
      </div>
    );
  }

  const { profile, bookingHistorySummary, totalBookings, totalSpent, status } = selectedUser;
  const userProfile = profile.userProfile;
  const name = userProfile?.name || "No Name";
  const email = userProfile?.email || "No Email";
  const city = userProfile?.city || "N/A";
  const avatarSeed = encodeURIComponent(name);
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link href="/users" className="p-2 rounded-xl bg-[#f8f7fd] border-2 border-[#f1effb] hover:bg-[#f3effc] transition-colors">
          <ArrowLeft className="h-4.5 w-4.5 text-[#5b4e79]" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">User Profile</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Audit booking activity and account control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main info card */}
          <div className="clay-card-white p-6 text-center space-y-4">
            <div className="h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-white/40 shadow-md mx-auto">
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#241c3d]">{name}</h3>
              <p className="text-[11px] font-bold text-[#8a7fa8] mt-0.5">{profile.id}</p>
            </div>

            {/* Status pill */}
            <div className="pt-2">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold border ${
                  status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : status === "DELETED"
                    ? "bg-slate-50 text-slate-500 border-slate-200"
                    : "bg-rose-50 text-rose-600 border-rose-200"
                }`}
              >
                {status}
              </span>
            </div>

            {/* Profile fields */}
            <div className="pt-4 border-t border-[#f1effb] text-left space-y-3">
              <div className="flex items-center gap-2.5 text-xs">
                <Mail className="h-4 w-4 text-[#a79fc0] flex-shrink-0" />
                <span className="font-bold text-[#5b4e79] truncate">{email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Phone className="h-4 w-4 text-[#a79fc0] flex-shrink-0" />
                <span className="font-bold text-[#5b4e79]">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <MapPin className="h-4 w-4 text-[#a79fc0] flex-shrink-0" />
                <span className="font-bold text-[#5b4e79]">{city}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Clock className="h-4 w-4 text-[#a79fc0] flex-shrink-0" />
                <span className="font-semibold text-[#8a7fa8]">Registered: {formatDate(profile.createdAt)}</span>
              </div>
              {profile.deletedAt && (
                <div className="flex items-center gap-2.5 text-xs bg-slate-50 text-slate-600 p-2.5 rounded-xl border border-slate-200">
                  <AlertTriangle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <span className="font-semibold">Deleted at: {formatDate(profile.deletedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action controls card */}
          {status !== "DELETED" && (
            <div className="clay-card-white p-6 space-y-4">
              <h4 className="text-sm font-extrabold text-[#241c3d]">Account Status Actions</h4>
              
              <div className="space-y-3.5 pt-2">
                {profile.isBanned ? (
                  <button
                    onClick={handleActivate}
                    disabled={isActionLoading}
                    className="w-full clay-btn-purple py-2.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#7c62db] disabled:opacity-50"
                  >
                    <CheckCircle className="h-4.5 w-4.5" />
                    Activate Account
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSuspendModal(true)}
                    disabled={isActionLoading}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#be123c] border-2 border-rose-500 hover:shadow-[0_2px_0_#be123c] hover:translate-y-[2px] transition-all disabled:opacity-50"
                  >
                    <ShieldAlert className="h-4.5 w-4.5" />
                    Suspend User
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  disabled={isActionLoading}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#94a3b8] border-2 border-slate-200 hover:shadow-[0_2px_0_#94a3b8] hover:translate-y-[2px] transition-all disabled:opacity-50"
                >
                  <Trash2 className="h-4.5 w-4.5 text-slate-500" />
                  Soft Delete User
                </button>
              </div>

              {/* Ban details display */}
              {profile.isBanned && (
                <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left space-y-2">
                  <p className="text-[11px] font-black text-rose-800 uppercase flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Suspension Details
                  </p>
                  <p className="text-xs font-bold text-rose-700">Reason: {profile.banReason || "No reason provided"}</p>
                  {profile.bannedAt && (
                    <p className="text-[10px] text-rose-600">Banned at: {formatDate(profile.bannedAt)}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Booking stats & booking history */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stat counters row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="clay-card-purple p-5 flex items-center gap-4 text-[#241c3d]">
              <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-purple">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#5b4e79] uppercase">Total Bookings</p>
                <p className="text-xl font-black text-[#241c3d] mt-0.5">{totalBookings}</p>
              </div>
            </div>
            <div className="clay-card-yellow p-5 flex items-center gap-4 text-[#241c3d]">
              <div className="h-10 w-10 flex items-center justify-center text-white clay-icon-yellow">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-amber-950 uppercase">Total Spent</p>
                <p className="text-xl font-black text-[#241c3d] mt-0.5">₹{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Booking Summary breakdown */}
          <div className="clay-card-white p-6">
            <h4 className="text-sm font-extrabold text-[#241c3d] mb-4">Booking Status Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["COMPLETED", "CONFIRMED", "PENDING", "CANCELLED"].map((st) => {
                const count = bookingHistorySummary[st] || 0;
                let bg = "bg-[#f8f7fd]";
                let text = "text-[#5b4e79]";
                if (st === "COMPLETED" || st === "CONFIRMED") {
                  bg = "bg-emerald-50";
                  text = "text-emerald-700";
                } else if (st === "CANCELLED") {
                  bg = "bg-rose-50";
                  text = "text-rose-700";
                } else if (st === "PENDING") {
                  bg = "bg-amber-50";
                  text = "text-amber-700";
                }
                return (
                  <div key={st} className={`p-4 rounded-2xl ${bg} text-center space-y-1`}>
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#8a7fa8]">{st}</p>
                    <p className={`text-lg font-black ${text}`}>{count}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking History list */}
          <div className="clay-card-white p-6">
            <h4 className="text-sm font-extrabold text-[#241c3d] border-b border-[#f1effb] pb-4 mb-4">
              Booking History List
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#f1effb] pb-3">
                    <th className="pb-3 text-xs font-extrabold text-[#8a7fa8] uppercase">Turf</th>
                    <th className="pb-3 text-xs font-extrabold text-[#8a7fa8] uppercase">Amount</th>
                    <th className="pb-3 text-xs font-extrabold text-[#8a7fa8] uppercase">Date / Slot</th>
                    <th className="pb-3 text-xs font-extrabold text-[#8a7fa8] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1effb]">
                  {selectedUserBookings.map((b) => {
                    let statusClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
                    if (b.bookingStatus === "CANCELLED") {
                      statusClass = "bg-rose-50 text-rose-600 border-rose-200";
                    } else if (b.bookingStatus === "PENDING") {
                      statusClass = "bg-amber-50 text-amber-600 border-amber-200";
                    }

                    return (
                      <tr key={b.id} className="hover:bg-[#faf9fd]/50 transition-colors">
                        <td className="py-3.5">
                          <p className="text-xs font-extrabold text-[#241c3d]">{b.turf.name}</p>
                          <p className="text-[10px] font-bold text-[#8a7fa8] mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#a79fc0]" />
                            {b.turf.city}
                          </p>
                        </td>
                        <td className="py-3.5 text-xs font-extrabold text-[#241c3d]">
                          ₹{b.amount}
                        </td>
                        <td className="py-3.5">
                          <p className="text-[11px] text-[#5b4e79] font-bold">{formatDate(b.bookingDate)}</p>
                          <p className="text-[10px] text-[#8a7fa8] font-bold mt-0.5">{b.timeSlot}</p>
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-extrabold border ${statusClass}`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {selectedUserBookings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-xs font-bold text-[#8a7fa8]">
                        No bookings found for this user.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Suspension Dialog Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md clay-card-white p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-base font-extrabold text-[#241c3d] flex items-center gap-1.5">
                <ShieldAlert className="h-5 w-5 text-rose-600 animate-pulse" />
                Suspend User Account
              </h3>
              <p className="text-xs text-[#8a7fa8] mt-1 font-bold">Specify the reason for suspending the user account.</p>
            </div>
            
            <form onSubmit={handleSuspendSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-extrabold text-[#5b4e79] mb-1.5">Suspension Reason</label>
                <textarea
                  required
                  rows={3}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="e.g. Violating platform booking guidelines / Spam reviews"
                  className="w-full clay-input p-3 text-xs text-[#1e1b33] placeholder:text-[#a79fc0] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuspendModal(false)}
                  className="px-4 py-2 text-xs font-extrabold rounded-xl border-2 border-[#f1effb] text-[#5b4e79] hover:bg-[#f3effc] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-extrabold clay-btn-purple shadow-[0_4px_0_#7c62db] bg-rose-600 hover:bg-rose-700 text-white shadow-rose-950 border-rose-500"
                >
                  Confirm Suspension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
