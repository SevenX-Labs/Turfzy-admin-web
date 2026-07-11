"use client";

import { useState } from "react";
import { Send, Bell, History, Users, Megaphone } from "lucide-react";

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("All");

  const pastBroadcasts = [
    { id: "BRD-01", title: "Maintenance Window", message: "Platform will be down for 2 hours on Sat midnight.", target: "All", sentTime: "2 hours ago", status: "Sent" },
    { id: "BRD-02", title: "Monsoon Discounts!", message: "Get up to 20% off on all booking fees this weekend.", target: "Players", sentTime: "1 day ago", status: "Sent" },
    { id: "BRD-03", title: "Update GST Invoice details", message: "Please update your tax records before May 25.", target: "Owners", sentTime: "3 days ago", status: "Sent" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    alert(`Broadcast Sent: "${title}" to ${target}`);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">Broadcast Alerts</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Send real-time alerts and system updates to app users and owners</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Compose Broadcast */}
        <form onSubmit={handleSend} className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#ece8f8] space-y-5 text-left">
          <div className="flex items-center gap-2 border-b border-[#f6f4fd] pb-4">
            <Megaphone className="h-5 w-5 text-purple-600" />
            <h3 className="font-bold text-[#241c3d]">Compose Broadcast</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5b4e79]">Target Audience</label>
            <div className="grid grid-cols-3 gap-2">
              {(["All", "Players", "Owners"] as const).map((seg) => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setTarget(seg)}
                  className={`rounded-xl py-2 text-xs font-bold transition-all border ${
                    target === seg
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-[#f8f7fd] border-transparent text-[#5b4e79]"
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5b4e79]">Message Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. System Maintenance Update"
              className="w-full rounded-xl border border-[#ece8f8] py-2.5 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5b4e79]">Message Body</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message description here..."
              className="w-full rounded-xl border border-[#ece8f8] py-2.5 px-3.5 text-xs text-[#1e1b33] outline-none focus:border-purple-600 resize-none"
            />
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
            <Send className="h-4 w-4" />
            Send Broadcast
          </button>
        </form>

        {/* Right List: Broadcast logs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#ece8f8]">
          <div className="flex items-center gap-2 border-b border-[#f6f4fd] pb-4 mb-4">
            <History className="h-5 w-5 text-purple-600" />
            <h3 className="font-bold text-[#241c3d]">Broadcast History Log</h3>
          </div>

          <div className="space-y-4">
            {pastBroadcasts.map((brd) => (
              <div key={brd.id} className="p-4 bg-[#faf9fe] rounded-2xl border border-[#ece8f8] text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#241c3d]">{brd.title}</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[9px] font-bold">
                    {brd.sentTime}
                  </span>
                </div>
                <p className="text-[11px] text-[#5b4e79] leading-relaxed">{brd.message}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[#f1eefb]">
                  <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                    To: {brd.target}
                  </span>
                  <span className="text-[9px] font-semibold text-[#8a7fa8]">{brd.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
