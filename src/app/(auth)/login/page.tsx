"use client";

import { useState, type FormEvent } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: wire up to your auth endpoint
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#b9a2f7] via-[#d3c3fb] to-[#f1e8fe] p-4 sm:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-[2.25rem] overflow-hidden shadow-2xl shadow-purple-950/25 bg-white">
        {/* ---------------- LEFT: illustration panel ---------------- */}
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#ecdffc] via-[#ddc7fa] to-[#c6a3f2] p-9 lg:p-10">
          {/* brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#5b21b6] shadow-lg shadow-purple-900/30 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="white" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="2.4" stroke="white" strokeWidth="1.6" />
                  <path d="M2 12h3M19 12h3M12 5v2M12 17v2" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-[#241c3d] leading-tight">Turfzy</p>
                <p className="text-xs text-[#5b4e79]">Admin Panel</p>
              </div>
            </div>

            <h1 className="mt-8 text-3xl font-bold text-[#241c3d] leading-tight">
              Welcome Back! <span className="inline-block animate-[wave_1.6s_ease-in-out_infinite]">👋</span>
            </h1>
            <p className="mt-2 text-sm text-[#5b4e79] max-w-[15rem]">
              Sign in to access your Turfzy admin dashboard
            </p>
          </div>

          {/* scene */}
          <div className="relative mt-8 h-72">
            {/* clouds */}
            <div className="absolute top-1 left-8 h-6 w-16 rounded-full bg-white/70 blur-[1px]" />
            <div className="absolute top-6 left-16 h-8 w-20 rounded-full bg-white/60 blur-[1px]" />
            <div className="absolute top-0 right-6 h-7 w-16 rounded-full bg-white/50 blur-[1px]" />

            {/* floodlight */}
            <div className="absolute top-2 left-2 flex flex-col items-center">
              <div className="grid grid-cols-3 gap-0.5 mb-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="h-1 w-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.8)]" />
                ))}
              </div>
              <div className="w-0.5 h-16 bg-[#8f7bb8]" />
            </div>

            {/* skyline */}
            <div className="absolute bottom-16 left-0 right-0 flex items-end gap-1.5 opacity-30">
              {[10, 16, 8, 20, 12, 18, 9].map((h, i) => (
                <div key={i} className="w-4 bg-[#7a63a8] rounded-t-sm" style={{ height: h * 3 }} />
              ))}
            </div>

            {/* stadium bowl */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-40">
              <div className="absolute inset-0 rounded-[50%] bg-gradient-to-b from-[#b79aec] to-[#a37fe0] shadow-inner" />
              <div className="absolute inset-[10px] rounded-[50%] bg-gradient-to-b from-[#9fe0ac] to-[#5fb96f] overflow-hidden">
                <div className="absolute inset-0 border-2 border-white/60 m-3 rounded-[50%]" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-2 border-white/60" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-3 border-2 border-white/70 border-l-0" />
              </div>
              {/* flag */}
              <div className="absolute -top-6 right-3 w-0.5 h-8 bg-[#5b4e79]">
                <span className="absolute top-0 left-0 h-2 w-3.5 bg-[#7c3aed]" />
              </div>
            </div>

            {/* calendar card */}
            <div className="absolute bottom-2 right-0 w-16 h-16 rounded-xl bg-white shadow-lg shadow-purple-950/20 p-1.5">
              <div className="flex justify-between px-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6]" />
              </div>
              <div className="mt-1 grid grid-cols-3 gap-0.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="h-1 w-1 rounded-full bg-[#e4d9fb] mx-auto" />
                ))}
              </div>
              <BadgeCheck className="h-6 w-6 text-[#7c3aed] mx-auto mt-1" strokeWidth={2.5} />
            </div>

            {/* ball */}
            <div className="absolute bottom-0 left-0 h-11 w-11 rounded-full bg-white shadow-lg shadow-purple-950/20 flex items-center justify-center text-xl leading-none">
              ⚽
            </div>

            {/* phone mockup */}
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-32 rounded-2xl bg-[#1f1a30] p-1.5 shadow-2xl shadow-purple-950/40 rotate-[-4deg]">
              <div className="rounded-[14px] bg-white px-2.5 py-3 flex flex-col items-center">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" strokeWidth={2.5} />
                <p className="mt-1.5 text-[9px] font-semibold text-[#241c3d]">Booking Confirmed!</p>
                <div className="mt-1.5 w-full rounded-md bg-[#f3effc] px-1.5 py-1">
                  <p className="text-[8px] font-bold text-[#241c3d]">Elite Arena</p>
                  <p className="text-[7px] text-[#8a7fa8]">Mon, 20 May · 7:00 PM</p>
                </div>
                <div className="mt-1.5 w-full rounded-md bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] py-1 text-center">
                  <span className="text-[7px] font-semibold text-white">View Booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT: form panel ---------------- */}
        <div className="bg-white px-7 py-10 sm:px-12 sm:py-12 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-20 w-20 rounded-full bg-[#f2ecfd] flex items-center justify-center">
                <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-[#c4b0f7]" />
                <span className="absolute bottom-1 -left-2 h-1 w-1 rounded-full bg-[#c4b0f7]" />
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#5b21b6] flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Lock className="h-6 w-6 text-white" strokeWidth={2.4} fill="white" />
                </div>
              </div>

              <h2 className="mt-5 text-2xl font-bold text-[#1e1b33]">Admin Login</h2>
              <p className="mt-1.5 text-sm text-[#6b6280]">
                Please sign in to continue to your Turfzy admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1e1b33] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#a79fc0]" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@turfzy.com"
                    className="w-full rounded-xl border border-[#e6e1f2] bg-[#faf9fd] py-3 pl-11 pr-4 text-sm text-[#1e1b33] placeholder:text-[#a79fc0] outline-none transition focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#1e1b33] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#a79fc0]" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#e6e1f2] bg-[#faf9fd] py-3 pl-11 pr-11 text-sm text-[#1e1b33] placeholder:text-[#a79fc0] outline-none transition focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a79fc0] hover:text-[#6b6280] transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#4b4360]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#7c3aed] cursor-pointer"
                  />
                  Remember me
                </label>
                <a href="#" className="font-medium text-[#7c3aed] hover:text-[#5b21b6] transition">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/40 hover:brightness-105 active:scale-[0.99] disabled:opacity-70"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 pt-1">
                <span className="h-px flex-1 bg-[#ece7f7]" />
                <span className="text-xs font-medium text-[#a79fc0]">OR</span>
                <span className="h-px flex-1 bg-[#ece7f7]" />
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#e6e1f2] bg-white py-3.5 text-sm font-semibold text-[#4b4360] transition hover:bg-[#faf9fd]"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-[#7c3aed]" />
                Login with OTP
              </button>
            </form>

            <p className="mt-7 text-center text-xs text-[#a79fc0]">
              Secure login protected by{" "}
              <span className="font-semibold text-[#4b4360]">Turfzy</span>{" "}
              <ShieldCheck className="inline h-3.5 w-3.5 text-[#7c3aed] -mt-0.5" />
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}