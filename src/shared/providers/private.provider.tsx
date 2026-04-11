'use client';

import { SplashScreen } from '@/components/templates';
import { usePathname, useRouter } from 'next/navigation';
import { FC, ReactNode } from 'react';
// import { authRoute } from '../constants';
import { useAuth } from '../hooks';

export const PrivateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoadingAuth, isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (!isLoadingAuth && !isLoggedIn) {
  //     if (pathname !== authRoute) {
  //       router.replace(`${authRoute}?callbackUrl=${encodeURI(pathname)}` as never);
  //     }
  //   }
  // }, [isLoadingAuth, isLoggedIn, router, pathname]);

  if (isLoadingAuth || !isLoggedIn) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};
