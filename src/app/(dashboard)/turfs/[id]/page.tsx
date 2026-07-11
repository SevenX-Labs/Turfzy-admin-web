"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useTurfsStore } from "@/store/turfs.store";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CircleDollarSign,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Info,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Lightbulb,
  DollarSign,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TurfDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const turfId = resolvedParams.id;

  const {
    selectedTurf,
    isLoading,
    isActionLoading,
    fetchTurfDetails,
    activateTurf,
    deactivateTurf,
    suspendTurf,
    featureTurf,
    unfeatureTurf,
    clearSelectedTurf,
  } = useTurfsStore();

  const [suspendReason, setSuspendReason] = useState("");
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  useEffect(() => {
    fetchTurfDetails(turfId);
    return () => {
      clearSelectedTurf();
    };
  }, [turfId, fetchTurfDetails, clearSelectedTurf]);

  // Action Handlers
  const handleActivate = async () => {
    if (confirm("Are you sure you want to approve/activate this turf listing?")) {
      await activateTurf(turfId);
    }
  };

  const handleDeactivate = async () => {
    if (confirm("Are you sure you want to deactivate this turf listing?")) {
      await deactivateTurf(turfId);
    }
  };

  const handleSuspendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendReason.trim()) return;
    const success = await suspendTurf(turfId, suspendReason);
    if (success) {
      setShowSuspendModal(false);
      setSuspendReason("");
    }
  };

  const handleFeatureToggle = async () => {
    if (!selectedTurf) return;
    if (selectedTurf.isFeatured) {
      if (confirm("Remove this turf from featured list?")) {
        await unfeatureTurf(turfId);
      }
    } else {
      if (confirm("Feature this turf? It will display on the client app's home screen.")) {
        await featureTurf(turfId);
      }
    }
  };

  if (isLoading && !selectedTurf) {
    return (
      <div className="py-24 text-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto" />
        <p className="text-xs font-bold text-[#8a7fa8] mt-3 animate-pulse">Loading turf details...</p>
      </div>
    );
  }

  if (!selectedTurf) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-sm font-bold text-[#8a7fa8]">Turf listing profile not found.</p>
        <Link href="/turfs" className="clay-btn-purple py-2 px-5 text-xs font-extrabold shadow-[0_4px_0_#7c62db] inline-block">
          Back to Turfs
        </Link>
      </div>
    );
  }

  // Facility amenities checklist
  const amenities = [
    { label: "Flood Lights", value: selectedTurf.floodLights },
    { label: "Parking", value: selectedTurf.parking },
    { label: "Washroom", value: selectedTurf.washroom },
    { label: "Changing Room", value: selectedTurf.changingRoom },
    { label: "Drinking Water", value: selectedTurf.drinkingWater },
    { label: "Seating Area", value: selectedTurf.seatingArea },
    { label: "Cafeteria", value: selectedTurf.cafeteria },
  ];

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link href="/turfs" className="p-2 rounded-xl bg-[#f8f7fd] border-2 border-[#f1effb] hover:bg-[#f3effc] transition-colors">
          <ArrowLeft className="h-4.5 w-4.5 text-[#5b4e79]" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">Turf / Pitch Profile</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Review and audit stadium parameters, rates, and visibility</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Left Column: Visual Images, Description & Amenities */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gallery Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Day Turf", url: selectedTurf.groundDayUrl },
              { label: "Night Turf", url: selectedTurf.groundNightUrl },
              { label: "Entrance View", url: selectedTurf.entranceUrl },
            ].map((img, idx) => {
              const fallback = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&h=300&fit=crop&q=80";
              return (
                <div key={idx} className="clay-card-white overflow-hidden p-2 flex flex-col justify-between h-48">
                  <div className="h-36 rounded-2xl overflow-hidden bg-purple-50">
                    <img src={img.url || fallback} alt={img.label} className="h-full w-full object-cover" />
                  </div>
                  <p className="text-[10px] font-extrabold text-[#5b4e79] text-center uppercase">{img.label}</p>
                </div>
              );
            })}
          </div>

          {/* About description */}
          <div className="clay-card-white p-6 space-y-3">
            <h3 className="text-sm font-extrabold text-[#241c3d]">About Turf Arena</h3>
            <p className="text-xs text-[#5b4e79] font-medium leading-relaxed">
              {selectedTurf.description || "No description provided."}
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="clay-card-white p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-1.5">
              <CircleDollarSign className="h-4.5 w-4.5 text-[#a79fc0]" />
              Pricing & Tariff Plans
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#f8f7fd] border border-[#f1effb] space-y-3">
                <p className="text-[10px] font-black text-[#8a7fa8] uppercase">Weekday Pricing</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-[#5b4e79]">Day Hours</span>
                  <span className="font-black text-[#241c3d] text-sm">₹{selectedTurf.weekdayDayPrice}/hr</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#f1effb] pt-2">
                  <span className="font-bold text-[#5b4e79]">Night Hours (Floodlights)</span>
                  <span className="font-black text-[#241c3d] text-sm">₹{selectedTurf.weekdayNightPrice}/hr</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#ffe0dd]/20 border border-[#ffe0dd] space-y-3">
                <p className="text-[10px] font-black text-rose-900 uppercase">Weekend Pricing</p>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-rose-900">Day Hours</span>
                  <span className="font-black text-[#241c3d] text-sm">₹{selectedTurf.weekendDayPrice}/hr</span>
                </div>
                <div className="flex justify-between items-center border-t border-[#ffe0dd] pt-2">
                  <span className="font-bold text-rose-900">Night Hours (Floodlights)</span>
                  <span className="font-black text-[#241c3d] text-sm">₹{selectedTurf.weekendNightPrice}/hr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="clay-card-white p-6 space-y-4 text-xs">
              <h4 className="text-xs font-black text-[#241c3d] uppercase tracking-wider">Slot Scheduling</h4>
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="font-bold text-[#8a7fa8]">Operating Hours</span>
                  <span className="font-extrabold text-[#5b4e79]">{selectedTurf.openTime} - {selectedTurf.closeTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[#8a7fa8]">Min Slot Duration</span>
                  <span className="font-extrabold text-[#5b4e79]">{selectedTurf.minSlotDurationMins} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[#8a7fa8]">Approval Flow</span>
                  <span className="font-extrabold text-[#5b4e79]">{selectedTurf.bookingApprovalType}</span>
                </div>
              </div>
            </div>

            <div className="clay-card-white p-6 space-y-4 text-xs">
              <h4 className="text-xs font-black text-[#241c3d] uppercase tracking-wider">Cancellation Policy</h4>
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="font-bold text-[#8a7fa8]">Refund Threshold</span>
                  <span className="font-extrabold text-[#5b4e79]">{selectedTurf.cancellationAllowedBeforeHours} hours prior</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[#8a7fa8]">Refund Percentage</span>
                  <span className="font-extrabold text-[#5b4e79]">{selectedTurf.cancellationRefundPercentage}% return</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Listing Actions, Details, Owner Profile */}
        <div className="space-y-6">
          
          {/* Turf Status Info & Quick Specs */}
          <div className="clay-card-white p-6 space-y-4 text-left">
            <h3 className="text-sm font-black text-[#241c3d]">{selectedTurf.name}</h3>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#8a7fa8]">Status</span>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-extrabold border ${
                    selectedTurf.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : selectedTurf.status === "PENDING_APPROVAL"
                      ? "bg-amber-50 text-amber-600 border-amber-200 animate-pulse"
                      : "bg-rose-50 text-rose-600 border-rose-200"
                  }`}
                >
                  {selectedTurf.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#8a7fa8]">Featured listing</span>
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-extrabold border ${
                    selectedTurf.isFeatured
                      ? "bg-amber-50 text-amber-600 border-amber-200"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  }`}
                >
                  {selectedTurf.isFeatured ? "FEATURED" : "STANDARD"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#8a7fa8]">Sports Type</span>
                <span className="font-extrabold text-[#5b4e79]">{selectedTurf.sportsType}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#8a7fa8]">Pitch Size</span>
                <span className="font-extrabold text-[#5b4e79]">{selectedTurf.turfSize}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#8a7fa8]">Average Rating</span>
                <span className="font-extrabold text-[#5b4e79]">
                  {selectedTurf.averageRating > 0 ? selectedTurf.averageRating.toFixed(1) : "N/A"}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f1effb] space-y-1 text-xs">
              <p className="font-bold text-[#8a7fa8] flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#a79fc0]" />
                Address
              </p>
              <p className="font-semibold text-[#5b4e79] mt-1 pl-4.5">
                {selectedTurf.address}, {selectedTurf.city} - {selectedTurf.pincode}
              </p>
            </div>
          </div>

          {/* Action Panel */}
          <div className="clay-card-white p-6 space-y-4">
            <h4 className="text-sm font-extrabold text-[#241c3d]">Listing Controls</h4>
            
            <div className="space-y-3 pt-2">
              {/* Approval controls */}
              {selectedTurf.status !== "ACTIVE" ? (
                <button
                  onClick={handleActivate}
                  disabled={isActionLoading}
                  className="w-full clay-btn-purple py-2.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#7c62db] disabled:opacity-50"
                >
                  <CheckCircle className="h-4.5 w-4.5" />
                  Approve & Activate
                </button>
              ) : (
                <button
                  onClick={handleDeactivate}
                  disabled={isActionLoading}
                  className="w-full bg-[#f8f7fd] border-2 border-[#ece8f8] hover:bg-[#f3effc] text-[#5b4e79] py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#ece8f8] disabled:opacity-50"
                >
                  <XCircle className="h-4.5 w-4.5" />
                  Deactivate listing
                </button>
              )}

              {/* Suspension control */}
              {selectedTurf.status !== "SUSPENDED" && (
                <button
                  onClick={() => setShowSuspendModal(true)}
                  disabled={isActionLoading}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#be123c] border-2 border-rose-500 hover:shadow-[0_2px_0_#be123c] hover:translate-y-[2px] transition-all disabled:opacity-50"
                >
                  <ShieldAlert className="h-4.5 w-4.5" />
                  Suspend listing
                </button>
              )}

              {/* Feature toggle */}
              <button
                onClick={handleFeatureToggle}
                disabled={isActionLoading}
                className={`w-full py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all border-2 disabled:opacity-50 ${
                  selectedTurf.isFeatured
                    ? "bg-amber-100 hover:bg-amber-250 border-amber-300 text-amber-900 shadow-[0_4px_0_#f59e0b]"
                    : "clay-btn-purple shadow-[0_4px_0_#7c62db]"
                }`}
              >
                <Sparkles className="h-4.5 w-4.5" />
                {selectedTurf.isFeatured ? "Remove Featured Status" : "Pin to Featured Listings"}
              </button>
            </div>

            {selectedTurf.status === "SUSPENDED" && (
              <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left space-y-2">
                <p className="text-[11px] font-black text-rose-800 uppercase flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Suspension Reason
                </p>
                <p className="text-xs font-bold text-rose-700">{selectedTurf.suspensionReason || "Suspended by Administrator"}</p>
                {selectedTurf.suspendedAt && (
                  <p className="text-[10px] text-rose-600">Suspended: {new Date(selectedTurf.suspendedAt).toLocaleDateString()}</p>
                )}
              </div>
            )}
          </div>

          {/* Owner Profile details card */}
          <div className="clay-card-white p-6 text-left space-y-4">
            <h4 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-1.5">
              <Building2 className="h-4.5 w-4.5 text-[#a79fc0]" />
              Owner Information
            </h4>
            
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <p className="text-[9px] font-bold text-[#8a7fa8] uppercase">Full Name</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">{selectedTurf.owner?.name || "N/A"}</p>
              </div>
              <div className="border-t border-[#f1effb] pt-2">
                <p className="text-[9px] font-bold text-[#8a7fa8] uppercase">Email</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">{selectedTurf.owner?.email || "N/A"}</p>
              </div>
              <div className="border-t border-[#f1effb] pt-2">
                <p className="text-[9px] font-bold text-[#8a7fa8] uppercase">Phone number</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">{selectedTurf.owner?.contactNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Amenities details card */}
          <div className="clay-card-white p-6 space-y-4 text-left">
            <h4 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-1.5">
              <Lightbulb className="h-4.5 w-4.5 text-[#a79fc0]" />
              Stadium Amenities
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              {amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${item.value ? "bg-emerald-500" : "bg-gray-300"}`} />
                  <span className={`font-semibold ${item.value ? "text-[#241c3d] font-bold" : "text-[#8a7fa8]"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
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
                Suspend Turf Arena listing
              </h3>
              <p className="text-xs text-[#8a7fa8] mt-1 font-bold">Specify the reason for suspending the turf listing.</p>
            </div>
            
            <form onSubmit={handleSuspendSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-extrabold text-[#5b4e79] mb-1.5">Suspension Reason</label>
                <textarea
                  required
                  rows={3}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="e.g. Double booking reports / Fake address documentation / Pricing plan violations"
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
