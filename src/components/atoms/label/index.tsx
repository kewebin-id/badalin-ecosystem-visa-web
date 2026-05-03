'use client';

import { cn } from '@/shared/utils';
import * as React from 'react';

export const Label = ({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    {...props}
    data-slot="label"
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    )}
  >
    {children}
  </label>
);
