import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center text-center font-sans">
      <h2 className="text-3xl font-bold text-[#241c3d]">Unauthorized Access</h2>
      <p className="mt-2 text-sm text-[#8a7fa8] max-w-sm">
        You do not have the required permissions to access this administrative section. Please contact the main administrator.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-xl bg-purple-600 px-4.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-95 transition-all"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
