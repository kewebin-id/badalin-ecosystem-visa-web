'use client';

import { SessionProvider as ReactSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  return <ReactSessionProvider>{children}</ReactSessionProvider>;
};
