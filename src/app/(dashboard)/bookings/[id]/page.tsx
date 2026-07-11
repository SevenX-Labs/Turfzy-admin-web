"use client";

import { use } from "react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">Booking Details</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Detailed view for booking reference {resolvedParams.id}</p>
      </div>
      <div className="rounded-3xl border border-[#ece8f8] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-[#8a7fa8]">Detailed transaction list and activity logging for booking {resolvedParams.id} is coming soon.</p>
        <Link href="/bookings" className="mt-4 inline-block text-xs font-bold text-purple-600 hover:text-purple-700">
          &larr; Back to Bookings
        </Link>
      </div>
    </div>
  );
}
