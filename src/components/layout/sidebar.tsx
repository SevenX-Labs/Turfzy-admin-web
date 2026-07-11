"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Coins,
  BarChart3,
  Receipt,
  Bell,
  Settings,
  History,
  User,
  Crown,
  ChevronDown,
  X,
} from "lucide-react";
import { useUIStore } from "@/store/ui.store";

// Custom Turf/Soccer Pitch Icon
const TurfIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const menuItems: SidebarItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Turfs", href: "/turfs", icon: TurfIcon },
    { name: "Owners", href: "/owners", icon: UserCheck },
    { name: "Bookings", href: "/bookings", icon: Calendar },
    { name: "Settlements", href: "/settlements", icon: Coins },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Platform Fees", href: "/platform-fees", icon: Receipt },
    { name: "Notifications", href: "/notifications", icon: Bell, badge: 8 },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Audit Logs", href: "/audit-logs", icon: History },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-purple-950/20 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between bg-white border-r border-[#ece8f8] px-6 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header & Close Button */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#5b21b6] shadow-lg shadow-purple-500/30 flex items-center justify-center text-white">
                <TurfIcon className="h-5.5 w-5.5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#241c3d] leading-none">Turfzy</h1>
                <p className="text-[11px] font-medium text-[#8a7fa8] mt-0.5">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-[#8a7fa8] hover:bg-purple-50 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white shadow-lg shadow-purple-500/25"
                      : "text-[#5b4e79] hover:bg-[#f6f4fd] hover:text-[#7c3aed]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105 ${
                        isActive ? "text-white" : "text-[#8a7fa8] group-hover:text-[#7c3aed]"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white text-[#7c3aed]"
                          : "bg-[#ff4d6a] text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Premium Card & User Profile */}
        <div className="mt-6 space-y-6">
          {/* Go Premium Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#fdfbf7] to-[#fbf8f0] border border-[#f5efe2] p-4.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fef5e7] text-[#eab308]">
                <Crown className="h-4 w-4" fill="currentColor" />
              </div>
              <h3 className="text-sm font-bold text-[#78590c]">Go Premium</h3>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[#948460]">
              Unlock advanced features and reports.
            </p>
            <button className="mt-3.5 w-full rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] py-2 text-center text-xs font-semibold text-white shadow-md shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
              Upgrade Now
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between border-t border-[#ece8f8] pt-4.5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-purple-100 bg-[#f3effc]">
                <img
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
                  alt="Admin Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-[#241c3d]">Admin</p>
                <p className="text-[11px] font-medium text-[#8a7fa8]">Super Admin</p>
              </div>
            </div>
            <button className="rounded-lg p-1 text-[#8a7fa8] hover:bg-[#f6f4fd] hover:text-[#241c3d]">
              <ChevronDown className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
