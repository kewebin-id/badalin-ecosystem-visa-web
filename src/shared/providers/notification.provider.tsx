'use client';

import { NotificationRepository } from '@/packages/notification/repository';
import { NotificationUseCase } from '@/packages/notification/usecase';
import { useAuth } from '@/shared/hooks';
import Logger from '@/shared/utils/logger';
import { useRouter } from 'next/navigation';
import { FC, ReactNode, useEffect, useRef } from 'react';

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const useCaseRef = useRef<NotificationUseCase | null>(null);
  const initializedRef = useRef(false);

  // Initialize OneSignal once on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined' || initializedRef.current) return;

    const repository = new NotificationRepository();
    const useCase = new NotificationUseCase(repository);
    useCaseRef.current = useCase;

    useCase.initialize().then(() => {
      // Setup notification click handler
      useCase.setupNotificationClickHandler((url) => {
        router.push(url);
      });
      initializedRef.current = true;
    });
  }, [router]);

  // Sync user when authenticated
  useEffect(() => {
    const userId = user?.employeeId || user?.id;
    if (!useCaseRef.current || !isLoggedIn || !userId) return;

    Logger.info(`Syncing user: ${userId}`, { location: 'NotificationProvider' });
    useCaseRef.current.syncUser(userId);
  }, [isLoggedIn, user?.employeeId, user?.id]);

  return <>{children}</>;
};
