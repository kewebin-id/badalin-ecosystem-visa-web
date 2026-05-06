'use client';

import { IUser } from '@/packages/pilgrim/auth/domain/response';
import { signOut as nextAuthSignout, useSession } from 'next-auth/react';
import { useCallback } from 'react';

/**
 * Client-side auth hook using NextAuth session
 * @returns User session data, loading state, and logout function
 */
export const useAuth = () => {
  const { status, data: session, update } = useSession();

  const isLoadingAuth = status === 'loading';
  const isLoggedIn = status === 'authenticated';

  const user = session?.user as unknown as IUser & { token: string };

  const signOut = useCallback(async () => {
    const isProvider = user?.role === 'PROVIDER';
    const slug = user?.agency?.slug || 'p';
    const callbackUrl = isProvider ? `/${slug}/auth/login` : '/auth/login';

    // Cleanup OneSignal external user ID
    try {
      const { NotificationRepository } = await import('@/packages/notification/repository');
      const { NotificationUseCase } = await import('@/packages/notification/usecase');
      const repository = new NotificationRepository();
      const useCase = new NotificationUseCase(repository);
      await useCase.cleanup();
    } catch (error) {
      // Silently fail if notification cleanup fails
      console.error('Failed to cleanup OneSignal:', error);
    }

    // Clear remember me credentials
    localStorage.removeItem('cos_saved_credentials');

    return nextAuthSignout({
      callbackUrl,
      redirect: true,
    });
  }, [user?.role, user?.agency?.slug]);

  return {
    isLoggedIn,
    isLoadingAuth,
    signOut,
    session,
    user,
    token: user?.token,
    update,
  };
};
