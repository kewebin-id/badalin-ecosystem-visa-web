'use client';

import { useAuth } from '@/shared/hooks/use-auth';
import { ReactNode } from 'react';

interface HasRoleProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export const HasRole = ({ children, allowedRoles, fallback = null }: HasRoleProps) => {
  const { user } = useAuth();

  if (!user || !user.role) return <>{fallback}</>;

  if (allowedRoles.includes('*')) return <>{children}</>;

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
};
