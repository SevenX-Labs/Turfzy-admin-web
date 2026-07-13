"use client";

import { useEffect, useState } from "react";
import { usePlatformFeeStore } from "@/store/platform-fee.store";
import { PlatformFeeSlab } from "@/types/platform-fee";
import {
  Coins,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { CardSkeleton } from "@/components/ui/skeleton-loaders";

export default function PlatformFeesPage() {
  const {
    slabs,
    isLoading,
    isActionLoading,
    error,
    fetchSlabs,
    createSlab,
    updateSlab,
    deleteSlab,
  } = usePlatformFeeStore();

  // Edit / Form state
  const [editingSlab, setEditingSlab] = useState<PlatformFeeSlab | null>(null);
  const [minAmount, setMinAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const [platformFee, setPlatformFee] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    fetchSlabs();
  }, [fetchSlabs]);

  // Sync edit mode form
  const startEditing = (slab: PlatformFeeSlab) => {
    setEditingSlab(slab);
    setMinAmount(slab.minAmount);
    setMaxAmount(slab.maxAmount);
    setPlatformFee(slab.platformFee);
    setIsActive(slab.isActive);
    setValidationError(null);
  };

  const cancelEditing = () => {
    setEditingSlab(null);
    setMinAmount(0);
    setMaxAmount(0);
    setPlatformFee(0);
    setIsActive(true);
    setValidationError(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (minAmount < 0 || maxAmount < 0 || platformFee < 0) {
      setValidationError("All monetary values must be greater than or equal to 0.");
      return;
    }

    if (minAmount > maxAmount) {
      setValidationError("Minimum range amount cannot exceed maximum range amount.");
      return;
    }

    // Check overlap with other slabs (optional warning or prevention)
    const isOverlap = slabs.some((s) => {
      if (editingSlab && s.id === editingSlab.id) return false;
      return (
        (minAmount >= s.minAmount && minAmount <= s.maxAmount) ||
        (maxAmount >= s.minAmount && maxAmount <= s.maxAmount) ||
        (s.minAmount >= minAmount && s.minAmount <= maxAmount)
      );
    });

    if (isOverlap) {
      setValidationError("Warning: This amount range overlaps with an existing platform fee slab.");
      return;
    }

    if (editingSlab) {
      const success = await updateSlab(editingSlab.id, {
        minAmount,
        maxAmount,
        platformFee,
        isActive,
      });
      if (success) {
        cancelEditing();
      }
    } else {
      const success = await createSlab({
        minAmount,
        maxAmount,
        platformFee,
        isActive,
      });
      if (success) {
        cancelEditing();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this platform fee slab?")) {
      const success = await deleteSlab(id);
      if (success && editingSlab?.id === id) {
        cancelEditing();
      }
    }
  };

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-[#241c3d]">Platform Fee Slabs</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Configure custom platform service fees applied on booking amount ranges</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Slabs List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#241c3d] flex items-center gap-2">
              <Coins className="h-4.5 w-4.5 text-purple-500" />
              Active Fee Slabs ({slabs.length})
            </h3>
          </div>

          {isLoading ? (
            <CardSkeleton count={3} />
          ) : slabs.length === 0 ? (
            <div className="clay-card-white p-8 text-center">
              <HelpCircle className="h-8 w-8 text-[#a79fc0] mx-auto opacity-70" />
              <p className="text-xs font-bold text-[#8a7fa8] mt-3">No platform fee configurations found.</p>
              <p className="text-[10px] text-[#b4accd] mt-1">Use the panel on the right to set up fee ranges.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {slabs.map((slab) => {
                const isCurrentEditing = editingSlab?.id === slab.id;
                return (
                  <div
                    key={slab.id}
                    className={`clay-card-white p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-150 ${
                      isCurrentEditing ? "border-2 border-purple-500 bg-purple-50/10 shadow-[0_4px_0_#9c83f3]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        slab.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                      }`}>
                        <Sparkles className="h-4.5 w-4.5" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-extrabold text-[#241c3d]">
                            ₹{slab.minAmount.toLocaleString()} - ₹{slab.maxAmount.toLocaleString()}
                          </p>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            slab.isActive 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                              : "bg-rose-50 text-rose-500 border-rose-100"
                          }`}>
                            {slab.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8a7fa8] font-bold mt-1">
                          Applied Service Fee: <span className="text-[#241c3d] font-extrabold">₹{slab.platformFee}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => startEditing(slab)}
                        className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 transition-colors"
                        title="Edit range"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(slab.id)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                        title="Delete range"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Slab Editor Form */}
        <div className="lg:col-span-5 clay-card-white p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#f1effb] pb-4">
            <Plus className="h-5 w-5 text-purple-600" />
            <h3 className="font-extrabold text-[#241c3d]">
              {editingSlab ? "Update Slab Range" : "Add Service Fee Slab"}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Range Amounts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider">Min Booking Amt</label>
                <input
                  type="number"
                  min="0"
                  value={minAmount}
                  onChange={(e) => setMinAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full clay-input py-2 px-3 text-xs text-[#1e1b33]"
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider">Max Booking Amt</label>
                <input
                  type="number"
                  min="0"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full clay-input py-2 px-3 text-xs text-[#1e1b33]"
                  required
                />
              </div>
            </div>

            {/* Platform Fee */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider">Applied Platform Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={platformFee}
                onChange={(e) => setPlatformFee(Math.max(0, Number(e.target.value)))}
                className="w-full clay-input py-2 px-3 text-xs text-[#1e1b33]"
                required
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2.5 pt-1 text-xs text-left font-bold text-[#5b4e79]">
              <input
                type="checkbox"
                id="slabActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-[#e4e2f2] text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="slabActive" className="select-none">Enable fee range immediately</label>
            </div>

            {/* Validation errors */}
            {(validationError || error) && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2.5 text-rose-700 text-[10px] font-bold leading-normal text-left">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
                <span>{validationError || error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3">
              {editingSlab && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="flex-1 bg-white border-2 border-[#f1effb] hover:bg-[#f3effc] text-[#5b4e79] py-2.5 rounded-2xl text-xs font-extrabold shadow-[0_4px_0_#ece8f8] active:translate-y-0.5 transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isActionLoading}
                className="flex-1 clay-btn-purple py-2.5 text-xs font-extrabold shadow-[0_4px_0_#7c62db] flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {editingSlab ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isActionLoading ? "Saving..." : editingSlab ? "Update Slab" : "Create Slab"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
