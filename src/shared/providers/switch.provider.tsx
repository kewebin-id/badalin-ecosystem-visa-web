'use client';

import { SplashScreen } from '@/components/templates';
import { FC, ReactNode } from 'react';
import { useAuth } from '../hooks';

export const SwitchProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoadingAuth } = useAuth();

  return isLoadingAuth ? <SplashScreen /> : children;
};
