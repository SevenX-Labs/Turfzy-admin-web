"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useBookingsStore } from "@/store/bookings.store";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CircleDollarSign,
  User,
  MapPin,
  Building,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hash,
  Laptop,
  RefreshCw,
} from "lucide-react";
import { DetailSkeleton } from "@/components/ui/skeleton-loaders";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const {
    selectedBooking,
    isLoading,
    isActionLoading,
    fetchBookingDetails,
    markNoShow,
    clearSelectedBooking,
  } = useBookingsStore();

  useEffect(() => {
    fetchBookingDetails(bookingId);
    return () => {
      clearSelectedBooking();
    };
  }, [bookingId, fetchBookingDetails, clearSelectedBooking]);

  const handleMarkNoShow = async () => {
    if (confirm("Are you sure you want to mark this booking's customer as a No-Show?")) {
      await markNoShow(bookingId);
    }
  };

  if (isLoading && !selectedBooking) {
    return <DetailSkeleton />;
  }

  if (!selectedBooking) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-sm font-bold text-[#8a7fa8]">Booking record not found.</p>
        <Link href="/bookings" className="clay-btn-purple py-2 px-5 text-xs font-extrabold shadow-[0_4px_0_#7c62db] inline-block">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "COMPLETED":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "PENDING_APPROVAL":
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "CANCELLED":
        return "text-rose-600 bg-rose-50 border-rose-100";
      case "NO_SHOW":
        return "text-purple-600 bg-purple-50 border-purple-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "FAILED":
        return "text-rose-600 bg-rose-50 border-rose-100";
      case "REFUNDED":
        return "text-blue-600 bg-blue-50 border-blue-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case "INITIATED":
        return "text-amber-800 bg-amber-100 border-amber-200";
      case "PROCESSED":
        return "text-emerald-800 bg-emerald-100 border-emerald-200";
      case "FAILED":
        return "text-rose-800 bg-rose-100 border-rose-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const refundSteps = [
    { key: "INITIATED", label: "Initiated", description: "Refund request submitted" },
    { key: "PROCESSED", label: "Processed", description: "Amount sent to bank" },
    { key: "COMPLETED", label: "Completed", description: "Credited to customer" },
  ];

  const getRefundStepIndex = (status: string) => {
    if (status === "FAILED") return -1; // special failed state
    if (status === "INITIATED") return 0;
    if (status === "PROCESSED") return 1;
    return -2; // NONE
  };

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link href="/bookings" className="p-2 rounded-xl bg-[#f8f7fd] border-2 border-[#f1effb] hover:bg-[#f3effc] transition-colors">
          <ArrowLeft className="h-4.5 w-4.5 text-[#5b4e79]" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">Booking Audit</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Review payment status, check-in logs, and cancellation reasons</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Left Columns (Booking Info & Pricing) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="clay-card-white p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f1effb] pb-4">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-xs text-[#8a7fa8] font-bold">Booking Reference</p>
                  <p className="text-sm font-black text-[#241c3d] tracking-wider uppercase">{selectedBooking.id}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold border ${getStatusColor(selectedBooking.bookingStatus)}`}>
                  {selectedBooking.bookingStatus}
                </span>
                <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold border ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                  Payment: {selectedBooking.paymentStatus}
                </span>
              </div>
            </div>

            {/* Timing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a7fa8] font-bold uppercase">Booking Date</p>
                  <p className="text-xs font-black text-[#241c3d] mt-0.5">
                    {new Date(selectedBooking.bookingDate).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a7fa8] font-bold uppercase">Slot Interval</p>
                  <p className="text-xs font-black text-[#241c3d] mt-0.5">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a7fa8] font-bold uppercase">Duration</p>
                  <p className="text-xs font-black text-[#241c3d] mt-0.5">
                    {selectedBooking.durationMins} minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing breakdown details */}
          <div className="clay-card-white p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
              <CircleDollarSign className="h-4.5 w-4.5 text-purple-500" />
              Financial Aggregates
            </h3>

            <div className="border border-[#f1effb] rounded-2xl overflow-hidden text-xs">
              <div className="bg-[#f8f7fd] px-4 py-3 border-b border-[#f1effb] flex justify-between font-bold text-[#8a7fa8] uppercase text-[10px]">
                <span>Description</span>
                <span>Amount</span>
              </div>
              <div className="p-4 space-y-3 font-semibold text-[#5b4e79]">
                <div className="flex justify-between">
                  <span>Ground Charge (Owner Share)</span>
                  <span className="font-extrabold text-[#241c3d]">₹{selectedBooking.groundCharge}</span>
                </div>
                <div className="flex justify-between border-t border-[#f8f7fd] pt-2">
                  <span>Platform Fee (Booking Charge)</span>
                  <span className="font-extrabold text-[#241c3d]">₹{selectedBooking.platformFee}</span>
                </div>
                <div className="flex justify-between border-t border-[#f8f7fd] pt-2">
                  <span>Deposit Amount</span>
                  <span className="font-extrabold text-[#241c3d]">₹{selectedBooking.depositAmount}</span>
                </div>
                <div className="flex justify-between border-t-2 border-[#f1effb] pt-3 font-black text-sm text-[#241c3d]">
                  <span>Total Amount Paid</span>
                  <span className="text-purple-600">₹{selectedBooking.amount}</span>
                </div>
                {selectedBooking.refundAmount > 0 && (
                  <div className="flex justify-between border-t border-[#f8f7fd] pt-2">
                    <span className="text-blue-700 font-bold">Refunded Amount</span>
                    <span className="font-extrabold text-blue-700">₹{selectedBooking.refundAmount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cancellation Reason details */}
          {selectedBooking.bookingStatus === "CANCELLED" && (
            <div className="clay-card-white p-6 border-2 border-rose-100 bg-rose-50/10 space-y-3 text-left">
              <h3 className="text-sm font-extrabold text-rose-950 flex items-center gap-2">
                <XCircle className="h-4.5 w-4.5 text-rose-600" />
                Cancellation Reference Details
              </h3>
              <div className="text-xs space-y-2 text-rose-900 font-bold">
                <p>
                  Reason: <span className="font-extrabold text-rose-950">{selectedBooking.cancelReason || "User Cancellation"}</span>
                </p>
                {selectedBooking.cancelledAt && (
                  <p className="text-[11px] text-rose-700">
                    Cancelled Date: {new Date(selectedBooking.cancelledAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Refund Progress Tracker */}
          {selectedBooking.refundStatus && selectedBooking.refundStatus !== "NONE" && (() => {
            const stepIndex = getRefundStepIndex(selectedBooking.refundStatus);
            const isFailed = selectedBooking.refundStatus === "FAILED";

            return (
              <div className={`clay-card-white p-6 space-y-5 border-2 ${
                isFailed ? "border-rose-200 bg-rose-50/20" : "border-blue-100 bg-blue-50/10"
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
                    <RefreshCw className={`h-4.5 w-4.5 ${isFailed ? "text-rose-500" : "text-blue-500"}`} />
                    Refund Progress Tracker
                  </h3>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold border ${getRefundStatusColor(selectedBooking.refundStatus)}`}>
                    {selectedBooking.refundStatus === "INITIATED" ? "Refund Initiated" : selectedBooking.refundStatus === "PROCESSED" ? "Refund Processed" : "Refund Failed"}
                  </span>
                </div>

                {/* Failed State */}
                {isFailed && (
                  <div className="flex items-center gap-3 bg-rose-100/60 border border-rose-200 rounded-2xl p-4">
                    <div className="h-10 w-10 rounded-xl bg-rose-200 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-rose-700" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-rose-900">Refund Processing Failed</p>
                      <p className="text-[11px] text-rose-700 font-bold mt-0.5">
                        The refund could not be processed. Please check the gateway dashboard for more details.
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress Steps */}
                {!isFailed && (
                  <div className="relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-[18px] left-[18px] right-[18px] h-1 bg-[#f1effb] rounded-full z-0" />
                    {/* Progress Bar Fill */}
                    <div
                      className="absolute top-[18px] left-[18px] h-1 rounded-full z-[1] transition-all duration-700 ease-out"
                      style={{
                        width: stepIndex === 0 ? "0%" : stepIndex === 1 ? "calc(50% - 18px)" : "calc(100% - 36px)",
                        background: "linear-gradient(90deg, #3b82f6, #0e9f6e)",
                      }}
                    />

                    <div className="relative z-10 flex justify-between">
                      {refundSteps.map((step, i) => {
                        const isActive = i === stepIndex;
                        const isCompleted = i < stepIndex;
                        const isPending = i > stepIndex;

                        return (
                          <div key={step.key} className="flex flex-col items-center text-center w-1/3">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-black border-2 transition-all duration-300 ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
                                : isActive
                                ? "bg-blue-500 border-blue-400 shadow-[0_0_0_4px_rgba(59,130,246,0.2)] animate-pulse"
                                : "bg-[#e4e2f2] border-[#d8d5ed] text-[#8a7fa8]"
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="h-4.5 w-4.5" />
                              ) : (
                                <span>{i + 1}</span>
                              )}
                            </div>
                            <p className={`text-[10px] font-extrabold mt-2 ${
                              isCompleted ? "text-emerald-700" : isActive ? "text-blue-700" : "text-[#8a7fa8]"
                            }`}>
                              {step.label}
                            </p>
                            <p className={`text-[9px] font-bold mt-0.5 ${
                              isPending ? "text-[#b5aed0]" : "text-[#5b4e79]"
                            }`}>
                              {step.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Refund Amount & Reason */}
                <div className="border-t border-[#f1effb] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {selectedBooking.refundAmount > 0 && (
                    <div className="p-3 bg-[#f8f7fd] border border-[#f1effb] rounded-xl space-y-1">
                      <p className="text-[9px] font-bold text-[#8a7fa8] uppercase">Refunded Amount</p>
                      <p className="text-sm font-black text-blue-700">₹{selectedBooking.refundAmount}</p>
                    </div>
                  )}
                  {selectedBooking.cancelReason && (
                    <div className="p-3 bg-[#f8f7fd] border border-[#f1effb] rounded-xl space-y-1">
                      <p className="text-[9px] font-bold text-[#8a7fa8] uppercase">Refund Reason</p>
                      <p className="font-extrabold text-[#241c3d]">{selectedBooking.cancelReason}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Gateway audit trail */}
          <div className="clay-card-white p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
              <CreditCard className="h-4.5 w-4.5 text-purple-500" />
              Gateway & Transaction Audit Trails
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-[#5b4e79]">
              <div className="p-3 bg-[#f8f7fd] border border-[#f1effb] rounded-xl space-y-1">
                <p className="text-[9px] font-bold text-[#8a7fa8] uppercase">Razorpay Order ID</p>
                <p className="font-mono text-[#241c3d] break-all">{selectedBooking.razorpayOrderId || "N/A"}</p>
              </div>
              <div className="p-3 bg-[#f8f7fd] border border-[#f1effb] rounded-xl space-y-1">
                <p className="text-[9px] font-bold text-[#8a7fa8] uppercase">Razorpay Payment ID</p>
                <p className="font-mono text-[#241c3d] break-all">{selectedBooking.razorpayPaymentId || "N/A"}</p>
              </div>
              {selectedBooking.razorpayRefundId && (
                <div className="col-span-1 sm:col-span-2 p-3 bg-blue-50/30 border border-blue-100 rounded-xl space-y-1">
                  <p className="text-[9px] font-bold text-[#8a7fa8] uppercase">Razorpay Refund ID</p>
                  <p className="font-mono text-blue-900 break-all">{selectedBooking.razorpayRefundId}</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (User, Turf & Actions) */}
        <div className="space-y-6">
          
          {/* Customer Profile Card */}
          <div className="clay-card-white p-6 space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-purple-500" />
              Customer Profile
            </h3>
            
            <div className="space-y-3 pt-1 text-xs">
              <div>
                <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Name</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">
                  {selectedBooking.user?.userProfile?.name || "Customer Account"}
                </p>
              </div>
              <div className="border-t border-[#f8f7fd] pt-2.5">
                <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Phone number</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">{selectedBooking.user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Turf details card */}
          <div className="clay-card-white p-6 space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
              <Building className="h-4.5 w-4.5 text-purple-500" />
              Turf Venue Reference
            </h3>
            
            <div className="space-y-3 pt-1 text-xs">
              <div>
                <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Name</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">{selectedBooking.turf?.name}</p>
              </div>
              <div className="border-t border-[#f8f7fd] pt-2.5">
                <p className="text-[9px] font-black text-[#8a7fa8] uppercase">City</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">{selectedBooking.turf?.city}</p>
              </div>
              <div className="border-t border-[#f8f7fd] pt-2.5">
                <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Owner / Partner</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">{selectedBooking.turf?.owner?.name}</p>
                <p className="text-[10px] text-[#5b4e79] font-bold mt-0.5">{selectedBooking.turf?.owner?.contactNumber}</p>
              </div>
            </div>
          </div>

          {/* Action Control Panel */}
          {selectedBooking.bookingStatus === "CONFIRMED" && (
            <div className="clay-card-white p-6 space-y-4 text-left">
              <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-purple-500" />
                Administrative Controls
              </h3>
              
              <button
                onClick={handleMarkNoShow}
                disabled={isActionLoading}
                className="w-full clay-btn-purple py-2.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#7c62db] bg-rose-600 hover:bg-rose-700 text-white border-rose-500 shadow-rose-950 transition-all disabled:opacity-50"
              >
                <XCircle className="h-4.5 w-4.5" />
                Mark as No-Show
              </button>
            </div>
          )}

          {/* Checkin logs */}
          {selectedBooking.visitedAt && (
            <div className="clay-card-white p-6 space-y-4 text-left">
              <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
                <Laptop className="h-4.5 w-4.5 text-purple-500" />
                Check-in / Verification Logs
              </h3>
              
              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Checked In At</p>
                  <p className="font-extrabold text-emerald-600 mt-0.5">
                    {new Date(selectedBooking.visitedAt).toLocaleString()}
                  </p>
                </div>
                {selectedBooking.scannedDevice && (
                  <div className="border-t border-[#f8f7fd] pt-2.5">
                    <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Scanned Device</p>
                    <p className="font-mono text-[10px] text-[#241c3d] mt-0.5 break-all">
                      {selectedBooking.scannedDevice}
                    </p>
                  </div>
                )}
                {selectedBooking.scanIpAddress && (
                  <div className="border-t border-[#f8f7fd] pt-2.5">
                    <p className="text-[9px] font-black text-[#8a7fa8] uppercase">IP Address</p>
                    <p className="font-mono text-[10px] text-[#241c3d] mt-0.5">
                      {selectedBooking.scanIpAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
