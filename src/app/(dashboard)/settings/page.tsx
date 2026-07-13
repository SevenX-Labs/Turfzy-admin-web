"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/settings.store";
import {
  Settings,
  Shield,
  CreditCard,
  HelpCircle,
  Save,
  AlertCircle,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { DetailSkeleton } from "@/components/ui/skeleton-loaders";

export default function SettingsPage() {
  const {
    settings,
    isLoading,
    isActionLoading,
    error,
    fetchSettings,
    updateSettings,
  } = useSettingsStore();

  // Form states
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [bookingWindowDays, setBookingWindowDays] = useState(90);
  const [termsUrl, setTermsUrl] = useState("");
  const [privacyUrl, setPrivacyUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Sync settings when loaded
  useEffect(() => {
    if (settings) {
      setMaintenanceMode(settings.maintenanceMode);
      setBookingWindowDays(settings.bookingWindowDays);
      setTermsUrl(settings.termsUrl || "");
      setPrivacyUrl(settings.privacyUrl || "");
      setContactEmail(settings.contactEmail || "");
      setContactPhone(settings.contactPhone || "");
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!contactEmail.trim() || !contactPhone.trim()) {
      setValidationError("System contact email and phone number are required.");
      return;
    }

    if (bookingWindowDays < 1) {
      setValidationError("Booking window days must be at least 1 day.");
      return;
    }

    await updateSettings({
      maintenanceMode,
      bookingWindowDays,
      termsUrl: termsUrl.trim(),
      privacyUrl: privacyUrl.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
    });
  };

  if (isLoading && !settings) {
    return <DetailSkeleton />;
  }

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-[#241c3d]">Global Settings</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Manage portal preferences, security levels, and payment gateway keys</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Side: Information helper card */}
        <div className="lg:col-span-4 clay-card-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f1effb] pb-3">
            <HelpCircle className="h-4.5 w-4.5 text-purple-600" />
            <h4 className="text-xs font-extrabold text-[#241c3d]">System Configuration Guide</h4>
          </div>
          
          <div className="space-y-3 text-xs text-[#5b4e79] leading-relaxed font-semibold">
            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl">
              <p className="font-extrabold text-amber-900">Maintenance Mode</p>
              <p className="text-[10px] text-amber-800 mt-1">Enabling maintenance mode blocks customer and owner app traffic, displaying a standard server under maintenance card.</p>
            </div>
            
            <div className="p-3 bg-purple-50/30 border border-purple-100 rounded-2xl">
              <p className="font-extrabold text-purple-950">Booking Window</p>
              <p className="text-[10px] text-purple-800 mt-1">Sets the maximum advanced duration (in days) users are allowed to schedule slots in advance.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration form */}
        <form onSubmit={handleSave} className="lg:col-span-8 clay-card-white p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#f1effb] pb-4">
            <Settings className="h-5 w-5 text-purple-600" />
            <h3 className="font-extrabold text-[#241c3d]">General Preferences</h3>
          </div>

          {/* Maintenance Mode toggle */}
          <div className="flex items-center justify-between p-4 bg-[#f8f7fd] border-2 border-[#f1effb] rounded-3xl">
            <div className="space-y-0.5 text-left">
              <p className="text-xs font-extrabold text-[#241c3d]">Server Maintenance Mode</p>
              <p className="text-[10px] text-[#8a7fa8] font-bold">Restrict platform access during updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#e4e2f2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Booking Window Days */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#8a7fa8]" />
                Booking Window (Days)
              </label>
              <input
                type="number"
                min="1"
                value={bookingWindowDays}
                onChange={(e) => setBookingWindowDays(Math.max(1, Number(e.target.value)))}
                className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33]"
                required
              />
            </div>

            {/* Support Email */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-[#8a7fa8]" />
                System Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33]"
                required
              />
            </div>

            {/* Support Phone */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-[#8a7fa8]" />
                System Contact Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33]"
                required
              />
            </div>

            {/* Terms URL */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-[#8a7fa8]" />
                Terms of Use URL
              </label>
              <input
                type="url"
                value={termsUrl}
                onChange={(e) => setTermsUrl(e.target.value)}
                className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33]"
                placeholder="https://..."
              />
            </div>

            {/* Privacy Policy URL */}
            <div className="space-y-1.5 text-left md:col-span-2">
              <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-[#8a7fa8]" />
                Privacy Policy URL
              </label>
              <input
                type="url"
                value={privacyUrl}
                onChange={(e) => setPrivacyUrl(e.target.value)}
                className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33]"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Validation/API error messages */}
          {(validationError || error) && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2.5 text-rose-700 text-[10px] font-bold leading-normal text-left">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-[#f1effb]">
            <button
              type="submit"
              disabled={isActionLoading}
              className="flex items-center gap-2 clay-btn-purple px-6 py-2.5 text-xs font-extrabold shadow-[0_5px_0_#7c62db] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isActionLoading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
