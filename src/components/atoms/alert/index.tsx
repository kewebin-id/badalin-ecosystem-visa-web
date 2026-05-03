'use client';

import { cn } from '@/shared/utils';
import * as React from 'react';

const Alert = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    data-slot="alert"
    className={cn(
      'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
      className,
    )}
  >
    {children}
  </div>
);

const AlertTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h5
    data-slot="alert-title"
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
  >
    {children}
  </h5>
);

const AlertDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div data-slot="alert-description" className={cn('text-sm [&_p]:leading-relaxed', className)}>
    {children}
  </div>
);

export { Alert, AlertDescription, AlertTitle };
