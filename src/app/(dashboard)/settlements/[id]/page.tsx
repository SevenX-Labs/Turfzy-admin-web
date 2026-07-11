"use client";

import { use } from "react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SettlementDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">Settlement Details</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Details for payout settlement {resolvedParams.id}</p>
      </div>
      <div className="rounded-3xl border border-[#ece8f8] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-[#8a7fa8]">Settlement logs, bank transaction credentials, and verification for settlement {resolvedParams.id} is coming soon.</p>
        <Link href="/settlements" className="mt-4 inline-block text-xs font-bold text-purple-600 hover:text-purple-700">
          &larr; Back to Settlements
        </Link>
      </div>
    </div>
  );
}
