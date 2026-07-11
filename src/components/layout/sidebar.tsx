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
  LogOut,
} from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const handleLogout = () => {
    Cookies.remove("auth_token");
    router.push("/login");
  };

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
        className={`fixed top-4 bottom-4 left-4 z-50 flex w-72 flex-col justify-between px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 clay-sidebar text-white ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:flex"
        }`}
      >
        {/* Top Header & Navigation Container */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center text-[#9c83f3]">
                <TurfIcon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h1 className="text-base font-extrabold text-white leading-none">Turfzy</h1>
                <p className="text-[10px] font-bold text-purple-200 mt-0.5">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-purple-200 hover:bg-white/10 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center justify-between px-4 py-3 text-[13px] font-extrabold transition-all duration-200 ${
                    isActive
                      ? "clay-sidebar-active text-[#7c3aed]"
                      : "text-purple-100 hover:bg-white/15 hover:text-white rounded-xl"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105 ${
                        isActive ? "text-[#7c3aed]" : "text-purple-200 group-hover:text-white"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-[#ff4d6a] text-white"
                          : "bg-[#ff4d6a] text-white border border-white/20"
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
        <div className="mt-6 space-y-6 flex-shrink-0">

          {/* User Profile */}
          <div className="flex items-center justify-between border-t border-white/20 pt-4.5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-white/40 shadow-sm flex-shrink-0">
                <img
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
                  alt="Admin Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-white">Admin</p>
                <p className="text-[10px] font-bold text-purple-200 mt-0.5">Super Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-purple-200 hover:bg-white/10 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
