'use client';

import styles from '@/shared/styles/components/spinner.module.css';
import { cn } from '@/shared/utils';
import { FC, ReactNode } from 'react';

export const Spinner: FC<{
  className?: string;
  variant?: 'white' | 'primary';
  message?: ReactNode;
}> = ({ className, variant, message }) => (
  <div className="flex flex-col gap-4 items-center justify-center">
    <div className={cn(className, styles[variant || 'white'], 'mx-auto')} />
    {message && <div className="text-center text-sm text-gray-500">{message}</div>}
  </div>
);
