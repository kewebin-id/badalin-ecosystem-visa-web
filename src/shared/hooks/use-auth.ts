'use client';

import { IUser } from '@/packages/pilgrim/auth/domain/response';
import { signOut as nextAuthSignout, useSession } from 'next-auth/react';

/**
 * Client-side auth hook using NextAuth session
 * @returns User session data, loading state, and logout function
 */
export const useAuth = () => {
  const { status, data: session, update } = useSession();

  const isLoadingAuth = status === 'loading';
  const isLoggedIn = status === 'authenticated';

  const user = session?.user as unknown as IUser & { token: string };

  const signOut = async () => {
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
      redirect: false,
      callbackUrl: window.location.href,
    });
  };

  return {
    isLoggedIn,
    isLoadingAuth,
    signOut,
    session,
    user,
    update,
  };
};
