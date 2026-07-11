import Link from "next/link";

export default function CreateSettlementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#241c3d]">Create Settlement</h2>
        <p className="text-xs text-[#8a7fa8] mt-0.5">Initiate a new bank payout settlement for turf owners</p>
      </div>
      <div className="rounded-3xl border border-[#ece8f8] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-[#8a7fa8]">Settlement creation inputs, amount validation, and owner selection is coming soon.</p>
        <Link href="/settlements" className="mt-4 inline-block text-xs font-bold text-purple-600 hover:text-purple-700">
          &larr; Back to Settlements
        </Link>
      </div>
    </div>
  );
}
