'use client';

import { useAuth } from '@/shared/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export const RoleGuard = ({
  children,
  allowedRoles,
  fallbackPath = '/unauthorized',
}: RoleGuardProps) => {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
      return;
    }

    if (!user?.role) {
      router.push(fallbackPath);
      return;
    }

    if (allowedRoles.includes('*')) {
      return;
    }

    const hasRequiredRole = allowedRoles.includes(user.role);

    if (!hasRequiredRole) {
      router.push(fallbackPath);
    }
  }, [isLoggedIn, user, allowedRoles, fallbackPath, router]);

  if (!isLoggedIn || !user) {
    return null;
  }

  if (allowedRoles.includes('*')) {
    return <>{children}</>;
  }

  const hasRequiredRole = user?.role ? allowedRoles.includes(user.role) : false;

  if (!hasRequiredRole) {
    return null;
  }

  return <>{children}</>;
};
