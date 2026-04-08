import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Filters Skeleton */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>

      {/* Events Grid Skeleton - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-14" />
              </div>
              <Skeleton className="h-6 w-3/4 mt-2" />
            </div>
            {/* Card Content */}
            <div className="px-6 pb-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
            {/* Card Footer */}
            <div className="p-6 pt-0">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}