"use client";

import { use } from "react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">User Profile</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Profile audit for player/user reference {resolvedParams.id}</p>
      </div>
      <div className="rounded-3xl border border-[#ece8f8] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-[#8a7fa8]">User bookings history, account metadata, and block list controls for user {resolvedParams.id} is coming soon.</p>
        <Link href="/users" className="mt-4 inline-block text-xs font-bold text-purple-600 hover:text-purple-700">
          &larr; Back to Users
        </Link>
      </div>
    </div>
  );
}
