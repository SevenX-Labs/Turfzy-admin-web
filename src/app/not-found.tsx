import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f7fd] px-4 text-center font-sans">
      <h2 className="text-6xl font-black text-purple-600">404</h2>
      <h3 className="mt-4 text-xl font-bold text-[#241c3d]">Page Not Found</h3>
      <p className="mt-2 text-sm text-[#8a7fa8]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 hover:brightness-105 active:scale-95 transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
}
