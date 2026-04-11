'use client';

import { Spinner } from '@/components/atoms';
import { FC } from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px] w-screen h-screen">
      <div className="flex flex-col items-center justify-center gap-4 bg-white/90 rounded-lg p-8 shadow-lg">
        <Spinner variant="primary" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};
