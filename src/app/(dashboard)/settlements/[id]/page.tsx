"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useSettlementsStore } from "@/store/settlements.store";
import { ownersService } from "@/services/owners.service";
import {
  ArrowLeft,
  Calendar,
  Building,
  CreditCard,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Hash,
  Send,
} from "lucide-react";
import { DetailSkeleton } from "@/components/ui/skeleton-loaders";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SettlementDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const settlementId = resolvedParams.id;

  const {
    selectedSettlement,
    isLoading,
    isActionLoading,
    error,
    fetchSettlementDetails,
    markAsPaid,
    clearSelectedSettlement,
  } = useSettlementsStore();

  const [bankDetails, setBankDetails] = useState<any>(null);
  const [isBankLoading, setIsBankLoading] = useState(false);

  // Form states for paying
  const [txRef, setTxRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettlementDetails(settlementId);
    return () => {
      clearSelectedSettlement();
    };
  }, [settlementId, fetchSettlementDetails, clearSelectedSettlement]);

  // Load bank details once settlement details are loaded
  useEffect(() => {
    if (selectedSettlement?.ownerProfileId) {
      const loadBankDetails = async () => {
        setIsBankLoading(true);
        try {
          const response = await ownersService.getBankDetails(selectedSettlement.ownerProfileId);
          if (response.success) {
            setBankDetails(response.data);
          }
        } catch (err) {
          console.error("Failed to load bank details", err);
        } finally {
          setIsBankLoading(false);
        }
      };
      loadBankDetails();
    }
  }, [selectedSettlement]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!txRef || txRef.trim().length < 4) {
      setValidationError("Please enter a valid Transaction UTR / Reference ID (minimum 4 characters).");
      return;
    }

    const success = await markAsPaid(settlementId, {
      txRef: txRef.trim(),
      notes: paymentNotes.trim() || undefined,
    });

    if (success) {
      setTxRef("");
      setPaymentNotes("");
    }
  };

  if (isLoading && !selectedSettlement) {
    return <DetailSkeleton />;
  }

  if (!selectedSettlement) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-sm font-bold text-[#8a7fa8]">Settlement record not found.</p>
        <Link href="/settlements" className="clay-btn-purple py-2 px-5 text-xs font-extrabold shadow-[0_4px_0_#7c62db] inline-block">
          Back to Settlements
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "PAID":
        return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-100";
      default:
        return "text-rose-600 bg-rose-50 border-rose-100";
    }
  };

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link href="/settlements" className="p-2 rounded-xl bg-[#f8f7fd] border-2 border-[#f1effb] hover:bg-[#f3effc] transition-colors">
          <ArrowLeft className="h-4.5 w-4.5 text-[#5b4e79]" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">Settlement Detail</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Review bank details, transaction logs, and payout verification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        
        {/* Left Columns (Details & Bank accounts) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="clay-card-white p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f1effb] pb-4">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-xs text-[#8a7fa8] font-bold">Settlement Record Reference</p>
                  <p className="text-xs font-black text-[#241c3d] tracking-wider uppercase">{selectedSettlement.id}</p>
                </div>
              </div>
              
              <span className={`rounded-full px-3.5 py-1 text-[10px] font-extrabold border self-start sm:self-auto ${getStatusColor(selectedSettlement.status)}`}>
                {selectedSettlement.status}
              </span>
            </div>

            {/* Aggregates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a7fa8] font-bold uppercase">Period Range</p>
                  <p className="text-xs font-black text-[#241c3d] mt-0.5">
                    {selectedSettlement.period || "Ad-hoc manual payout"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a7fa8] font-bold uppercase">Bookings Count</p>
                  <p className="text-xs font-black text-[#241c3d] mt-0.5">
                    {selectedSettlement.bookingCount ? `${selectedSettlement.bookingCount} Bookings` : "Manual"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#8a7fa8] font-bold uppercase">Payout Amount</p>
                  <p className="text-sm font-black text-[#0e9f6e] mt-0.5">
                    ₹{selectedSettlement.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {selectedSettlement.notes && (
              <div className="p-3 bg-[#f8f7fd] border border-[#f1effb] rounded-2xl text-xs">
                <p className="font-bold text-[#8a7fa8] uppercase text-[9px]">Administrative Notes</p>
                <p className="text-[#5b4e79] mt-1 font-semibold">{selectedSettlement.notes}</p>
              </div>
            )}
          </div>

          {/* Bank/UPI Payout Address Details */}
          <div className="clay-card-white p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
              <Building className="h-4.5 w-4.5 text-purple-500" />
              Recipient Settlement Bank Account
            </h3>

            {isBankLoading ? (
              <p className="text-xs font-bold text-[#8a7fa8] py-4 animate-pulse">Loading bank details...</p>
            ) : bankDetails ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-left font-semibold text-[#5b4e79]">
                <div>
                  <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Bank Account Holder</p>
                  <p className="font-extrabold text-[#241c3d] mt-0.5">{bankDetails.bankHolderName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Bank Name</p>
                  <p className="font-extrabold text-[#241c3d] mt-0.5">{bankDetails.bankName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Account Number</p>
                  <p className="font-mono text-[#241c3d] mt-0.5">{bankDetails.accountNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#8a7fa8] uppercase">IFSC Code</p>
                  <p className="font-mono text-[#241c3d] mt-0.5">{bankDetails.ifscCode || "N/A"}</p>
                </div>
                {bankDetails.upiId && (
                  <div className="col-span-1 sm:col-span-2 border-t border-[#f8f7fd] pt-3">
                    <p className="text-[9px] font-black text-[#8a7fa8] uppercase">UPI VPA Address</p>
                    <p className="font-mono text-[#241c3d] mt-0.5">{bankDetails.upiId}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-2.5 text-amber-800 text-xs font-bold">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                <span>The partner has not configured bank transfer accounts. please verify before payout.</span>
              </div>
            )}
          </div>

          {/* Paid transaction Reference if paid */}
          {(selectedSettlement.status === "PAID" || selectedSettlement.status === "COMPLETED") && (
            <div className="clay-card-white p-6 border-2 border-emerald-100 bg-emerald-50/10 space-y-4 text-left">
              <h3 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                Transaction Verification & Reference
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[9px] font-black text-emerald-800 uppercase">UTR / Txn Ref ID</p>
                  <p className="font-mono font-black text-emerald-950 mt-0.5">{selectedSettlement.txRef}</p>
                </div>
                {selectedSettlement.paidAt && (
                  <div>
                    <p className="text-[9px] font-black text-emerald-800 uppercase">Paid Timestamp</p>
                    <p className="font-extrabold text-emerald-900 mt-0.5">
                      {new Date(selectedSettlement.paidAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Owner profile & Payment execution) */}
        <div className="space-y-6">
          
          {/* Recipient Profile */}
          <div className="clay-card-white p-6 space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-purple-500" />
              Recipient Account
            </h3>
            <div className="space-y-3 pt-1 text-xs">
              <div>
                <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Partner Name</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">{selectedSettlement.owner?.name || "N/A"}</p>
              </div>
              <div className="border-t border-[#f8f7fd] pt-2.5">
                <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Email</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">{selectedSettlement.owner?.email || "N/A"}</p>
              </div>
              <div className="border-t border-[#f8f7fd] pt-2.5">
                <p className="text-[9px] font-black text-[#8a7fa8] uppercase">Contact Number</p>
                <p className="font-extrabold text-[#241c3d] mt-0.5">{selectedSettlement.owner?.contactNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Submit payout verification card (if status is PENDING) */}
          {selectedSettlement.status === "PENDING" && (
            <div className="clay-card-white p-6 space-y-4 text-left">
              <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
                <Send className="h-4.5 w-4.5 text-purple-500" />
                Settle Payout
              </h3>
              
              <form onSubmit={handlePay} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider">Transaction UTR / Ref ID</label>
                  <input
                    type="text"
                    placeholder="e.g. UTR193029103"
                    value={txRef}
                    onChange={(e) => setTxRef(e.target.value)}
                    className="w-full clay-input py-2 px-3 text-xs text-[#1e1b33] placeholder:text-[#a79fc0]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider">Transfer Notes (Optional)</label>
                  <textarea
                    placeholder="IMPS transfer notes..."
                    rows={2}
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="w-full clay-input py-2 px-3 text-xs text-[#1e1b33] placeholder:text-[#a79fc0]"
                  />
                </div>

                {/* Errors */}
                {(validationError || error) && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-rose-700 text-[10px] font-bold leading-normal">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{validationError || error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="w-full clay-btn-purple py-2.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#7c62db] bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-emerald-950 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isActionLoading ? "Processing..." : "Mark as Paid"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
