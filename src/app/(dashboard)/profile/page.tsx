"use client";

import { useState } from "react";
import { User, Lock, Mail, Phone, ShieldAlert, Save } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("admin@turfzy.com");
  const [phone, setPhone] = useState("+91 99999 88888");

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">My Profile</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Manage operator details, security access, and notification feeds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#ece8f8] flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-purple-100 bg-[#f3effc]">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
              alt="Admin User"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#241c3d]">{name}</h3>
            <p className="text-xs font-semibold text-purple-600 bg-purple-50 rounded-full px-3 py-1 mt-1 inline-block">
              Super Admin
            </p>
          </div>
          <p className="text-[10px] text-[#8a7fa8]">Logged in from IP: 192.168.1.12 · Mumbai, India</p>
        </div>

        {/* Right Side: Inputs */}
        <div className="lg:col-span-8 space-y-6">
          {/* General Information */}
          <div className="bg-white rounded-3xl p-6 border border-[#ece8f8] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#f6f4fd] pb-4">
              <User className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-[#241c3d]">General Info</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5b4e79]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#ece8f8] py-2.5 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5b4e79]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#ece8f8] py-2.5 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5b4e79]">Mobile Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#ece8f8] py-2.5 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#f6f4fd]">
              <button className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Security details */}
          <div className="bg-white rounded-3xl p-6 border border-[#ece8f8] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#f6f4fd] pb-4">
              <Lock className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-[#241c3d]">Security Credentials</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5b4e79]">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#ece8f8] py-2.5 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5b4e79]">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-[#ece8f8] py-2.5 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#f6f4fd]">
              <button className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
