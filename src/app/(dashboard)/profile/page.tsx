"use client";

import { useState, useEffect } from "react";
import { User, Lock, Mail, Phone, ShieldAlert, Save } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || "Admin");
  const [email, setEmail] = useState(user?.email || "admin@turfzy.com");
  const [phone, setPhone] = useState("+91 99999 88888");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-[#241c3d]">My Profile</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Manage operator details, security access, and notification feeds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-4 clay-card-white p-6 flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 overflow-hidden rounded-3xl border-2 border-white bg-white/40 shadow-sm flex-shrink-0">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
              alt="Admin User"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#241c3d]">{name}</h3>
            <p className="text-xs font-extrabold text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-3 py-1 mt-1 inline-block">
              {user?.role || "Super Admin"}
            </p>
          </div>
          <p className="text-[10px] font-bold text-[#8a7fa8]">Logged in from IP: 192.168.1.12 · Mumbai, India</p>
        </div>

        {/* Right Side: Inputs */}
        <div className="lg:col-span-8 space-y-7">
          {/* General Information */}
          <div className="clay-card-white p-6 space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-[#f1effb] pb-4">
              <User className="h-5 w-5 text-purple-600" />
              <h3 className="font-extrabold text-[#241c3d]">General Info</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5b4e79]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5b4e79]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5b4e79]">Mobile Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t-2 border-[#f1effb]">
              <button className="flex items-center gap-2 clay-btn-purple px-5 py-3 text-xs font-extrabold shadow-[0_5px_0_#7c62db]">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>

          {/* Security details */}
          <div className="clay-card-white p-6 space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-[#f1effb] pb-4">
              <Lock className="h-5 w-5 text-purple-600" />
              <h3 className="font-extrabold text-[#241c3d]">Security Credentials</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5b4e79]">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5b4e79]">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t-2 border-[#f1effb]">
              <button className="clay-btn-purple px-5 py-3 text-xs font-extrabold shadow-[0_5px_0_#7c62db]">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
