'use client';

import { FC, ReactNode } from 'react';

interface BackButtonProps {
  children?: ReactNode;
  className?: string;
}

export const BackButton: FC<BackButtonProps> = ({ children, className }) => {
  return (
    <button onClick={() => window.history.back()} className={className}>
      {children || 'Kembali'}
    </button>
  );
};
