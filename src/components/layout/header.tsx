"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useUIStore } from "@/store/ui.store";

export default function Header() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="flex h-20 w-full items-center justify-between bg-transparent px-6 lg:px-8">
      {/* Left: Mobile Toggle Menu & Search */}
      <div className="flex flex-1 items-center gap-4">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-[#ece8f8] text-[#5b4e79] shadow-sm hover:bg-[#f6f4fd] hover:text-[#7c3aed] transition-colors"
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
            className="w-full rounded-full border border-[#ece8f8] bg-white py-2.5 pl-12 pr-4 text-sm text-[#1e1b33] placeholder:text-[#a79fc0] outline-none transition focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10"
          />
        </div>
      </div>

      {/* Right: Notifications & User Avatar */}
      <div className="flex items-center gap-4">
        {/* Mobile Search Icon (only visible on extra small screens) */}
        <button className="flex sm:hidden h-11 w-11 items-center justify-center rounded-2xl bg-white border border-[#ece8f8] text-[#5b4e79] hover:bg-[#f6f4fd] transition-colors">
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications Icon with Badge */}
        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-[#ece8f8] text-[#5b4e79] shadow-sm hover:bg-[#f6f4fd] transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff4d6a] text-[9px] font-bold text-white shadow-sm shadow-[#ff4d6a]/20">
            8
          </span>
        </button>

        {/* User profile avatar */}
        <div className="flex h-11 w-11 overflow-hidden rounded-full border-2 border-purple-100 bg-[#f3effc] cursor-pointer">
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
            alt="Admin User"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
