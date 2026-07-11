"use client";

import { useState } from "react";
import { Settings, Shield, CreditCard, HelpCircle, Save } from "lucide-react";

export default function SettingsPage() {
  const [appName, setAppName] = useState("Turfzy");
  const [supportEmail, setSupportEmail] = useState("support@turfzy.com");
  const [razorpayMode, setRazorpayMode] = useState("Sandbox");

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">Global Settings</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Manage portal preferences, security levels, and payment gateway keys</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Navigation segments (mocked list) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#ece8f8] space-y-1">
          <button className="w-full flex items-center gap-3 rounded-xl bg-purple-50 text-[#7c3aed] px-4 py-3 text-xs font-bold transition-all">
            <Settings className="h-4 w-4" />
            General Information
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl text-[#5b4e79] hover:bg-[#f6f4fd] px-4 py-3 text-xs font-bold transition-all">
            <CreditCard className="h-4 w-4 text-[#8a7fa8]" />
            Payment Gateway
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl text-[#5b4e79] hover:bg-[#f6f4fd] px-4 py-3 text-xs font-bold transition-all">
            <Shield className="h-4 w-4 text-[#8a7fa8]" />
            Security & MFA
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl text-[#5b4e79] hover:bg-[#f6f4fd] px-4 py-3 text-xs font-bold transition-all">
            <HelpCircle className="h-4 w-4 text-[#8a7fa8]" />
            Support Desk
          </button>
        </div>

        {/* Right Side: Configuration details */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#ece8f8] space-y-6">
          <div className="flex items-center gap-2 border-b border-[#f6f4fd] pb-4">
            <Settings className="h-5 w-5 text-purple-600" />
            <h3 className="font-bold text-[#241c3d]">General Preferences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5b4e79]">Platform/App Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full rounded-xl border border-[#ece8f8] py-2.5 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5b4e79]">System Contact Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-xl border border-[#ece8f8] py-2.5 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="space-y-1.5 border-t border-[#f6f4fd] pt-4">
            <label className="text-xs font-bold text-[#5b4e79]">Payment Gateway Environment</label>
            <div className="flex gap-3 mt-1">
              {["Sandbox", "Live Production"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRazorpayMode(mode)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                    razorpayMode === mode
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-[#f8f7fd] border-transparent text-[#5b4e79]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#f6f4fd]">
            <button className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
              <Save className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
