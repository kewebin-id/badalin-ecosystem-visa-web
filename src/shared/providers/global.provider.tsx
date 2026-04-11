'use client';

import { Toaster } from '@/components/atoms';
import { queryClient } from '@/shared/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import { ToastClassnames } from 'sonner';
import { StateProvider } from '../context';
import { NotificationProvider } from './notification.provider';

const classNames: ToastClassnames = {
  success: 'bg-primary-default!',
  error: 'bg-danger-default!',
  info: 'bg-info-default!',
};

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [queryClientState] = useState(() => queryClient);

  return (
    <StateProvider>
      <Toaster
        richColors
        position="bottom-center"
        theme="light"
        toastOptions={{
          className: '!rounded-full !px-5 !py-4 !shadow-xl !text-white !border-0',
          classNames,
        }}
      />
      <QueryClientProvider client={queryClientState}>
        <NotificationProvider>{children}</NotificationProvider>
      </QueryClientProvider>
      {process.env.NEXT_PUBLIC_DEV_TOOLS === 'true' && <ReactQueryDevtools initialIsOpen={false} />}
    </StateProvider>
  );
};
