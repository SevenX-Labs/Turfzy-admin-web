"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useOwnersStore } from "@/store/owners.store";
import {
  ShieldCheck,
  ShieldAlert,
  Calendar,
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Wallet,
  MapPin,
  Building,
  CreditCard,
  Hash,
  Send,
  Plus,
  Star,
  CheckCircle,
  FileText,
} from "lucide-react";
import { DetailSkeleton } from "@/components/ui/skeleton-loaders";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OwnerDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const ownerId = resolvedParams.id;

  const {
    selectedOwner,
    bankDetails,
    settlementHistory,
    isLoading,
    isActionLoading,
    fetchOwnerDetails,
    suspendOwner,
    activateOwner,
    clearSelectedOwner,
  } = useOwnersStore();

  const [suspendReason, setSuspendReason] = useState("");
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  useEffect(() => {
    fetchOwnerDetails(ownerId);
    return () => {
      clearSelectedOwner();
    };
  }, [ownerId, fetchOwnerDetails, clearSelectedOwner]);

  // Handle suspension
  const handleSuspendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendReason.trim()) return;
    const success = await suspendOwner(ownerId, suspendReason);
    if (success) {
      setShowSuspendModal(false);
      setSuspendReason("");
    }
  };

  // Handle activation
  const handleActivate = async () => {
    if (confirm("Are you sure you want to reactivate this owner account?")) {
      await activateOwner(ownerId);
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

  if (isLoading && !selectedOwner) {
    return <DetailSkeleton />;
  }

  if (!selectedOwner) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-sm font-bold text-[#8a7fa8]">Owner profile not found.</p>
        <Link href="/owners" className="clay-btn-purple py-2 px-5 text-xs font-extrabold shadow-[0_4px_0_#7c62db] inline-block">
          Back to Owners
        </Link>
      </div>
    );
  }

  const { owner, turfCount, totalEarnings, rating, activeBookings } = selectedOwner;
  const profile = owner.profile;
  const name = profile?.name || "No Name";
  const email = profile?.email || "No Email";
  const contactNumber = profile?.contactNumber || "N/A";
  const avatarSeed = encodeURIComponent(name);
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link href="/owners" className="p-2 rounded-xl bg-[#f8f7fd] border-2 border-[#f1effb] hover:bg-[#f3effc] transition-colors">
          <ArrowLeft className="h-4.5 w-4.5 text-[#5b4e79]" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">Owner Profile</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Audit turf properties, payouts, and partner control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Account Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="clay-card-white p-6 text-center space-y-4">
            <div className="h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-white/40 shadow-md mx-auto">
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#241c3d]">{name}</h3>
              <p className="text-[11px] font-bold text-[#8a7fa8] mt-0.5">{owner.id}</p>
            </div>

            <div className="pt-2">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold border ${
                  owner.isBanned
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}
              >
                {owner.isBanned ? "SUSPENDED" : "ACTIVE"}
              </span>
            </div>

            <div className="pt-4 border-t border-[#f1effb] text-left space-y-3">
              <div className="flex items-center gap-2.5 text-xs">
                <Mail className="h-4 w-4 text-[#a79fc0] flex-shrink-0" />
                <span className="font-bold text-[#5b4e79] truncate">{email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Phone className="h-4 w-4 text-[#a79fc0] flex-shrink-0" />
                <span className="font-bold text-[#5b4e79]">{owner.phone}</span>
              </div>
              {contactNumber !== "N/A" && contactNumber !== owner.phone && (
                <div className="flex items-center gap-2.5 text-xs">
                  <Phone className="h-4 w-4 text-[#a79fc0] flex-shrink-0" />
                  <span className="font-bold text-[#5b4e79]">Alt: {contactNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-xs">
                <Clock className="h-4 w-4 text-[#a79fc0] flex-shrink-0" />
                <span className="font-semibold text-[#8a7fa8]">Registered: {formatDate(owner.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Account Status Actions */}
          <div className="clay-card-white p-6 space-y-4">
            <h4 className="text-sm font-extrabold text-[#241c3d]">Partner Account Control</h4>
            
            <div className="space-y-3 pt-2">
              {owner.isBanned ? (
                <button
                  onClick={handleActivate}
                  disabled={isActionLoading}
                  className="w-full clay-btn-purple py-2.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#7c62db] disabled:opacity-50"
                >
                  <CheckCircle className="h-4.5 w-4.5" />
                  Activate Partner
                </button>
              ) : (
                <button
                  onClick={() => setShowSuspendModal(true)}
                  disabled={isActionLoading}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#be123c] border-2 border-rose-500 hover:shadow-[0_2px_0_#be123c] hover:translate-y-[2px] transition-all disabled:opacity-50"
                >
                  <ShieldAlert className="h-4.5 w-4.5" />
                  Suspend Partner
                </button>
              )}
            </div>

            {owner.isBanned && (
              <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left space-y-2">
                <p className="text-[11px] font-black text-rose-800 uppercase flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Suspension Details
                </p>
                <p className="text-xs font-bold text-rose-700">Reason: {owner.banReason || "No reason provided"}</p>
                {owner.bannedAt && (
                  <p className="text-[10px] text-rose-600">Banned at: {formatDate(owner.bannedAt)}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payout summaries, bank account, and settlement lists */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="clay-card-purple p-4 flex flex-col justify-between text-[#241c3d] h-24">
              <span className="text-[9px] font-bold text-[#5b4e79] uppercase">Earnings (Net)</span>
              <p className="text-base font-black text-[#241c3d]">₹{totalEarnings.toLocaleString()}</p>
            </div>
            <div className="clay-card-yellow p-4 flex flex-col justify-between text-[#241c3d] h-24">
              <span className="text-[9px] font-bold text-amber-950 uppercase">Listed Turfs</span>
              <p className="text-base font-black text-[#241c3d]">{turfCount} turfs</p>
            </div>
            <div className="clay-card-blue p-4 flex flex-col justify-between text-[#241c3d] h-24">
              <span className="text-[9px] font-bold text-blue-955 uppercase">Active Bookings</span>
              <p className="text-base font-black text-[#241c3d]">{activeBookings}</p>
            </div>
            <div className="clay-card-peach p-4 flex flex-col justify-between text-[#241c3d] h-24">
              <span className="text-[9px] font-bold text-rose-955 uppercase">Reviews Rating</span>
              <p className="text-base font-black text-[#241c3d] flex items-center gap-1">
                {rating.average > 0 ? rating.average.toFixed(1) : "N/A"}
                {rating.average > 0 && <Star className="h-4 w-4 fill-amber-400 stroke-amber-500 flex-shrink-0" />}
              </p>
            </div>
          </div>

          {/* Registered Bank Account details */}
          <div className="clay-card-white p-6">
            <h4 className="text-sm font-extrabold text-[#241c3d] mb-4 flex items-center gap-1.5">
              <Building className="h-4.5 w-4.5 text-[#a79fc0]" />
              Bank Settlement Profile
            </h4>
            
            {bankDetails && (bankDetails.accountNumber || bankDetails.upiId) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-left">
                {bankDetails.accountNumber ? (
                  <div className="space-y-3 p-4 rounded-2xl bg-[#f8f7fd] border border-[#f1effb]">
                    <p className="text-[10px] font-black text-[#8a7fa8] uppercase flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5" />
                      Direct Bank Transfer
                    </p>
                    <div className="space-y-1.5">
                      <p className="text-[#5b4e79] font-semibold">Holder: <span className="font-extrabold text-[#241c3d]">{bankDetails.accountHolderName || "N/A"}</span></p>
                      <p className="text-[#5b4e79] font-semibold">Account: <span className="font-extrabold text-[#241c3d]">{bankDetails.accountNumber}</span></p>
                      <p className="text-[#5b4e79] font-semibold">Bank: <span className="font-extrabold text-[#241c3d]">{bankDetails.bankName || "N/A"}</span></p>
                      <p className="text-[#5b4e79] font-semibold">IFSC: <span className="font-extrabold text-[#241c3d]">{bankDetails.ifscCode || "N/A"}</span></p>
                    </div>
                  </div>
                ) : null}

                {bankDetails.upiId ? (
                  <div className="space-y-3 p-4 rounded-2xl bg-[#f8f7fd] border border-[#f1effb] flex flex-col justify-between">
                    <p className="text-[10px] font-black text-[#8a7fa8] uppercase flex items-center gap-1">
                      <Send className="h-3.5 w-3.5" />
                      UPI Transfer
                    </p>
                    <div>
                      <p className="text-[#5b4e79] font-semibold">UPI ID: <span className="font-extrabold text-[#241c3d]">{bankDetails.upiId}</span></p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center">
                No bank account details or UPI ID configured by owner yet.
              </div>
            )}
          </div>

          {/* Settlement logs */}
          <div className="clay-card-white p-6">
            <h4 className="text-sm font-extrabold text-[#241c3d] border-b border-[#f1effb] pb-4 mb-4 flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-[#a79fc0]" />
              Payout Settlement History
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#f1effb] pb-3">
                    <th className="pb-3 text-xs font-extrabold text-[#8a7fa8] uppercase">Settlement ID</th>
                    <th className="pb-3 text-xs font-extrabold text-[#8a7fa8] uppercase">Amount</th>
                    <th className="pb-3 text-xs font-extrabold text-[#8a7fa8] uppercase">Reference ID</th>
                    <th className="pb-3 text-xs font-extrabold text-[#8a7fa8] uppercase">Date</th>
                    <th className="pb-3 text-xs font-extrabold text-[#8a7fa8] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1effb]">
                  {settlementHistory.map((s) => {
                    let statusClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
                    if (s.status === "FAILED") {
                      statusClass = "bg-rose-50 text-rose-600 border-rose-200";
                    } else if (s.status === "PENDING") {
                      statusClass = "bg-amber-50 text-amber-600 border-amber-200";
                    }

                    return (
                      <tr key={s.id} className="hover:bg-[#faf9fd]/50 transition-colors">
                        <td className="py-3 text-xs font-extrabold text-[#241c3d] truncate max-w-[120px]">
                          {s.id}
                        </td>
                        <td className="py-3 text-xs font-black text-[#241c3d]">
                          ₹{s.amount.toLocaleString()}
                        </td>
                        <td className="py-3 text-xs font-semibold text-[#5b4e79]">
                          {s.referenceId || "N/A"}
                        </td>
                        <td className="py-3 text-[11px] text-[#8a7fa8] font-bold">
                          {formatDate(s.createdAt)}
                        </td>
                        <td className="py-3">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-extrabold border ${statusClass}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {settlementHistory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-xs font-bold text-[#8a7fa8]">
                        No payout settlements records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Suspension Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md clay-card-white p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-base font-extrabold text-[#241c3d] flex items-center gap-1.5">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                Suspend Turf Partner Account
              </h3>
              <p className="text-xs text-[#8a7fa8] mt-1 font-bold">Specify the reason for suspending the partner account.</p>
            </div>
            
            <form onSubmit={handleSuspendSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-extrabold text-[#5b4e79] mb-1.5">Suspension Reason</label>
                <textarea
                  required
                  rows={3}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="e.g. KYC document verification failure / Repeated booking cancellations"
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
