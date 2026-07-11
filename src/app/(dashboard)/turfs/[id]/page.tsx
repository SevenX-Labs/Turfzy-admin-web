"use client";

import { use } from "react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TurfDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">Turf/Arena Profile</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Profile audit for turf reference {resolvedParams.id}</p>
      </div>
      <div className="rounded-3xl border border-[#ece8f8] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-[#8a7fa8]">Turf pricing metrics, location coordinates, slot availability, and review history for turf {resolvedParams.id} is coming soon.</p>
        <Link href="/turfs" className="mt-4 inline-block text-xs font-bold text-purple-600 hover:text-purple-700">
          &larr; Back to Turfs
        </Link>
      </div>
    </div>
  );
}
