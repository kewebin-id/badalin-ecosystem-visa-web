'use client';

import { Skeleton } from '@/components/atoms/skeleton';

export const MemberDetailSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="flex flex-col items-center gap-4 py-4">
      <Skeleton className="h-28 w-28 rounded-3xl" />
      <div className="space-y-2 flex flex-col items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="grid gap-3">
            {[1, 2].map((j) => (
              <div key={j} className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
