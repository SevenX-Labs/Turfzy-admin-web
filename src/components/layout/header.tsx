"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";

export default function Header() {
  const { toggleSidebar } = useUIStore();
  const { user } = useAuthStore();

  return (
    <header className="flex h-20 w-full items-center justify-between bg-transparent px-6 lg:px-8">
      {/* Left: Mobile Toggle Menu & Search */}
      <div className="flex flex-1 items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-2xl bg-white border-2 border-[#f1effb] text-[#5b4e79] shadow-[0_4px_0_#e4e2f2] hover:bg-[#f6f4fd] hover:text-[#7c3aed] active:translate-y-0.5 active:shadow-[0_2px_0_#e4e2f2] transition-all"
          aria-label="Open Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-lg hidden sm:block">
          <Search className="pointer-events-none absolute left-4.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#a79fc0]" />
          <input
            type="text"
            placeholder="Search for turfs, owners, bookings..."
            className="w-full clay-input py-2.5 pl-12 pr-4 text-sm text-[#1e1b33] placeholder:text-[#a79fc0]"
          />
        </div>
      </div>

      {/* Right: Notifications & User Avatar */}
      <div className="flex items-center gap-4">
        {/* Mobile Search Icon (only visible on extra small screens) */}
        <button className="flex sm:hidden h-11 w-11 items-center justify-center rounded-2xl bg-white border-2 border-[#f1effb] text-[#5b4e79] shadow-[0_4px_0_#e4e2f2] hover:bg-[#f6f4fd] active:translate-y-0.5 active:shadow-[0_2px_0_#e4e2f2] transition-all">
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications Icon with Badge */}
        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white border-2 border-[#f1effb] text-[#5b4e79] shadow-[0_4px_0_#e4e2f2] hover:bg-[#f6f4fd] active:translate-y-0.5 active:shadow-[0_2px_0_#e4e2f2] transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#ff4d6a] text-[8px] font-extrabold text-white border border-white">
            8
          </span>
        </button>

        {/* User profile avatar */}
        <div className="flex h-11 w-11 overflow-hidden rounded-2xl border-2 border-white bg-white/40 shadow-md cursor-pointer">
          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || "Admin"}`}
            alt={user?.name || "Admin User"}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
