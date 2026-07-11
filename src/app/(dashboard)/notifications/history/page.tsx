import Link from "next/link";

export default function NotificationsHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">Notifications History</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Logs of all broadcasts and system notification events sent</p>
      </div>
      <div className="rounded-3xl border border-[#ece8f8] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-[#8a7fa8]">Notification records, filter criteria, and delivery status logs is coming soon.</p>
        <Link href="/notifications" className="mt-4 inline-block text-xs font-bold text-purple-600 hover:text-purple-700">
          &larr; Back to Notifications
        </Link>
      </div>
    </div>
  );
}
