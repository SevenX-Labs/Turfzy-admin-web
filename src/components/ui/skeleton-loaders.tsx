import { Skeleton } from "./skeleton";

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
}

export function TableSkeleton({ rowCount = 5, columnCount = 5 }: TableSkeletonProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-[#f1effb] pb-3">
            {Array.from({ length: columnCount }).map((_, i) => (
              <th key={i} className="pb-4 pr-4">
                <Skeleton className="h-4 w-20 bg-[#f1effb]" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1effb]">
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr key={rowIndex} className="transition-colors">
              {Array.from({ length: columnCount }).map((_, colIndex) => {
                // Generate slightly varied widths for a natural look
                const widths = ["w-24", "w-32", "w-16", "w-40", "w-28"];
                const width = widths[(rowIndex + colIndex) % widths.length];
                return (
                  <td key={colIndex} className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      {colIndex === 0 && (
                        <Skeleton className="h-10 w-10 rounded-2xl bg-[#f1effb] flex-shrink-0" />
                      )}
                      <div className="space-y-1">
                        <Skeleton className={`h-3.5 ${width} bg-[#f1effb] rounded-lg`} />
                        {colIndex === 0 && (
                          <Skeleton className="h-2.5 w-16 bg-[#faf9fd] rounded" />
                        )}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 bg-white rounded-3xl border-2 border-[#f1effb] shadow-[0_6px_0_#e4e2f2] space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 rounded-2xl bg-[#f1effb] flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32 bg-[#f1effb] rounded-lg" />
              <Skeleton className="h-2.5 w-20 bg-[#faf9fd] rounded" />
            </div>
            <Skeleton className="h-5 w-16 bg-[#f1effb] rounded-full" />
          </div>
          <div className="pt-3 border-t border-[#f1effb] space-y-2">
            <Skeleton className="h-3.5 w-full bg-[#f1effb] rounded-lg" />
            <Skeleton className="h-3.5 w-2/3 bg-[#f1effb] rounded-lg" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[#f1effb]">
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-10 bg-[#faf9fd] rounded" />
              <Skeleton className="h-4 w-20 bg-[#f1effb] rounded-lg" />
            </div>
            <Skeleton className="h-8 w-24 bg-[#ebdffc] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface StatsSkeletonProps {
  count?: number;
}

export function StatsSkeleton({ count = 3 }: StatsSkeletonProps) {
  const gridCols = count === 4 ? "sm:grid-cols-4" : count === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="clay-card-white p-5 flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-2xl bg-[#f1effb] flex-shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-2.5 w-16 bg-[#f1effb] rounded" />
            <Skeleton className="h-5 w-24 bg-[#f1effb] rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-7 pb-12 text-left">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-[#f1effb] rounded-lg" />
          <Skeleton className="h-3 w-40 bg-[#faf9fd] rounded" />
        </div>
        <Skeleton className="h-10 w-32 bg-[#ebdffc] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="clay-card-white p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-24 w-24 rounded-3xl bg-[#f1effb] mb-4" />
              <Skeleton className="h-5 w-40 bg-[#f1effb] rounded-lg mb-2" />
              <Skeleton className="h-3 w-28 bg-[#faf9fd] rounded" />
            </div>
            <div className="border-t border-[#f1effb] pt-4 space-y-3">
              <Skeleton className="h-4 w-full bg-[#faf9fd] rounded" />
              <Skeleton className="h-4 w-full bg-[#faf9fd] rounded" />
              <Skeleton className="h-4 w-full bg-[#faf9fd] rounded" />
            </div>
          </div>
        </div>

        {/* Right Column details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="clay-card-white p-6 space-y-6">
            <div className="flex gap-4 border-b border-[#f1effb] pb-3">
              <Skeleton className="h-6 w-20 bg-[#ebdffc] rounded-lg" />
              <Skeleton className="h-6 w-20 bg-[#f1effb] rounded-lg" />
              <Skeleton className="h-6 w-20 bg-[#f1effb] rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16 bg-[#faf9fd] rounded" />
                <Skeleton className="h-8 w-full bg-[#f1effb] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16 bg-[#faf9fd] rounded" />
                <Skeleton className="h-8 w-full bg-[#f1effb] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16 bg-[#faf9fd] rounded" />
                <Skeleton className="h-8 w-full bg-[#f1effb] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16 bg-[#faf9fd] rounded" />
                <Skeleton className="h-8 w-full bg-[#f1effb] rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
