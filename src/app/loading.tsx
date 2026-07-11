export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f8f7fd]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        <p className="text-sm font-semibold text-[#8a7fa8] animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  );
}
