'use client';

import { cn } from '@/shared/utils';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
  iconClassName,
}: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
    {icon || (
      <div
        className={cn(
          iconClassName,
          'bg-contain bg-center bg-no-repeat h-[180px] w-full no-repeat',
        )}
        style={{
          backgroundImage: `url(/assets/images/illustration-not-found.webp)`,
        }}
      />
    )}
    <h3 className="mt-2 text-lg font-semibold">{title}</h3>
    <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
    {action}
  </div>
);
