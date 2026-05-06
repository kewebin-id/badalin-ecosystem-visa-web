'use client';

import { Skeleton } from '@/components/atoms';
import { cn } from '@/shared/utils';
export const DashboardSkeleton = () => {
  const CardWrapper = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={cn(
        'rounded-[1.25rem] border border-gray-100 shadow-sm bg-white overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  );

  return (
    <div className="space-y-8 w-full">
      <div>
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-4 w-48 mt-2 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <CardWrapper key={i} className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-12 rounded-lg" />
                <Skeleton className="h-3 w-20 rounded-lg" />
              </div>
            </div>
          </CardWrapper>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
        <CardWrapper className="flex-[2] p-8">
          <Skeleton className="h-4 w-40 rounded-lg mb-8" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </CardWrapper>
        <CardWrapper className="flex-[1] p-8">
          <Skeleton className="h-4 w-40 rounded-lg mb-8" />
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        </CardWrapper>
      </div>
    </div>
  );
};
