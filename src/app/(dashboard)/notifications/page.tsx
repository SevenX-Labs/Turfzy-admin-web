"use client";

import { useEffect, useState } from "react";
import { useNotificationsStore } from "@/store/notifications.store";
import { NotificationTarget } from "@/types/notifications";
import {
  Send,
  Megaphone,
  History,
  AlertCircle,
  Clock,
  RefreshCw,
  Users,
} from "lucide-react";
import { CardSkeleton } from "@/components/ui/skeleton-loaders";

export default function NotificationsPage() {
  const {
    logs,
    total,
    page,
    pages,
    isLoading,
    isActionLoading,
    error,
    fetchHistory,
    sendBroadcast,
  } = useNotificationsStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState<NotificationTarget>("ALL_USERS");
  const [city, setCity] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim() || !body.trim()) {
      setValidationError("Please enter a title and message body.");
      return;
    }

    if (target === "BY_CITY" && !city.trim()) {
      setValidationError("Please enter the target city name.");
      return;
    }

    const success = await sendBroadcast({
      target,
      title: title.trim(),
      body: body.trim(),
      city: target === "BY_CITY" ? city.trim() : undefined,
    });

    if (success) {
      setTitle("");
      setBody("");
      setCity("");
    }
  };

  const getTargetLabel = (tgt: NotificationTarget) => {
    switch (tgt) {
      case "ALL_USERS":
        return "All Users (Players)";
      case "ALL_OWNERS":
        return "All Owners (Partners)";
      case "BY_CITY":
        return "By City Focus";
      case "PROMOTIONAL":
        return "Promotional Segment";
    }
  };

  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#241c3d]">Broadcast Alerts</h2>
          <p className="text-xs text-[#8a7fa8] mt-0.5 font-bold">Send real-time alerts and push updates to mobile devices</p>
        </div>
        <button
          onClick={() => fetchHistory(1)}
          className="p-2.5 rounded-2xl border-2 border-[#f1effb] bg-white text-[#5b4e79] hover:bg-[#f3effc] shadow-[0_4px_0_#ece8f8] active:translate-y-0.5 transition-all self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Form: Compose Broadcast */}
        <form onSubmit={handleSend} className="lg:col-span-5 clay-card-white p-6 space-y-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-[#f1effb] pb-4">
            <Megaphone className="h-5 w-5 text-purple-600" />
            <h3 className="font-extrabold text-[#241c3d]">Compose Broadcast</h3>
          </div>

          {/* Target segments */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider">Target Segment</label>
            <div className="grid grid-cols-2 gap-2">
              {(["ALL_USERS", "ALL_OWNERS", "BY_CITY", "PROMOTIONAL"] as const).map((seg) => {
                const isActive = target === seg;
                return (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => setTarget(seg)}
                    className={`py-2 text-[10px] font-black uppercase transition-all duration-150 rounded-xl ${
                      isActive
                        ? "clay-btn-purple shadow-[0_4px_0_#7c62db]"
                        : "bg-[#f8f7fd] border-2 border-[#f1effb] text-[#5b4e79] hover:bg-[#f3effc]"
                    }`}
                  >
                    {seg.replace("_", " ")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* City field (if target is BY_CITY) */}
          {target === "BY_CITY" && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider">City Name</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bangalore"
                className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33] placeholder:text-[#a79fc0]"
                required
              />
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider">Notification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. System Maintenance Alert"
              className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33] placeholder:text-[#a79fc0]"
              required
            />
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#5b4e79] uppercase tracking-wider">Message Description</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter push body details..."
              rows={4}
              className="w-full clay-input py-2.5 px-3.5 text-xs text-[#1e1b33] placeholder:text-[#a79fc0] resize-none"
              required
            />
          </div>

          {/* Validation errors */}
          {(validationError || error) && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-rose-700 text-[10px] font-bold leading-normal">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isActionLoading}
            className="w-full clay-btn-purple py-3 text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_5px_0_#7c62db] mt-2 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {isActionLoading ? "Broadcasting..." : "Dispatch Broadcast"}
          </button>
        </form>

        {/* Right List: Broadcast History logs */}
        <div className="lg:col-span-7 clay-card-white p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f1effb] pb-4">
            <History className="h-5 w-5 text-purple-600" />
            <h3 className="font-extrabold text-[#241c3d]">Broadcast Log History</h3>
          </div>

          {isLoading ? (
            <CardSkeleton count={3} />
          ) : logs.length === 0 ? (
            <p className="text-xs font-bold text-[#8a7fa8] py-8 text-center">No past broadcast notifications found.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="p-4 bg-white rounded-3xl border-2 border-[#f1effb] shadow-[0_4px_0_#e4e2f2] text-left space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-extrabold text-[#241c3d]">{log.title}</span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-[#8a7fa8] flex-shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(log.sentTime).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5b4e79] font-semibold leading-relaxed">{log.message}</p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f8f7fd]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-extrabold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-lg">
                        {getTargetLabel(log.target)}
                      </span>
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                        Sent to {log.sentCount} recipients
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-[#8a7fa8]">
                      By: {log.sentBy}
                    </span>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-between items-center pt-4 border-t border-[#f1effb]">
                  <button
                    onClick={() => fetchHistory(page - 1)}
                    disabled={page <= 1}
                    className="clay-btn-purple px-4 py-2 text-[10px] font-black uppercase disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-xs font-bold text-[#5b4e79]">
                    Page {page} of {pages}
                  </span>
                  <button
                    onClick={() => fetchHistory(page + 1)}
                    disabled={page >= pages}
                    className="clay-btn-purple px-4 py-2 text-[10px] font-black uppercase disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
