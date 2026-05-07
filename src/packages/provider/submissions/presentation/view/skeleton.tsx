import { Card, Skeleton } from '@/components/atoms';

export const SubmissionsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>

      {/* Stats/Table Card Skeleton */}
      <Card className="overflow-hidden !p-0">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-3 w-48 rounded-md" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          {/* Table Header Placeholder */}
          <div className="flex justify-between pb-4 border-b border-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-20 rounded" />
            ))}
          </div>
          {/* Table Rows Placeholder */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0"
            >
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
export const SubmissionDetailSkeleton = () => {
  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1 Skeleton */}
          <Card className="p-0 overflow-hidden">
            <Skeleton className="h-16 w-full rounded-none" />
            <div className="p-6 grid grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            </div>
          </Card>

          {/* Section 2 Skeleton */}
          <Card className="p-0 overflow-hidden">
            <Skeleton className="h-16 w-full rounded-none" />
            <div className="p-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center p-6 border-b border-gray-50">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-4">
          <Card className="p-6 sticky top-24">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="space-y-4 mb-8">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-14 w-full rounded-2xl" />
          </Card>
        </div>
      </div>
    </div>
  );
};
