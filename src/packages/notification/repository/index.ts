import { oneSignalConfig } from '@/shared/config/onesignal.config';
import Logger from '@/shared/utils/logger';
import OneSignal from 'react-onesignal';
import { INotificationPayload, INotificationRepository } from '../domain/types';

export class NotificationRepository implements INotificationRepository {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized || typeof window === 'undefined') return;

    try {
      await OneSignal.init({
        appId: oneSignalConfig.appId,
        allowLocalhostAsSecureOrigin: oneSignalConfig.allowLocalhostAsSecureOrigin,
      });
      this.initialized = true;
      Logger.info('OneSignal initialized', { location: 'NotificationRepository.initialize' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Can only be used on:')) {
        Logger.info(`OneSignal skipped: ${errorMessage}`, {
          location: 'NotificationRepository.initialize',
        });
      } else {
        Logger.error(error, { location: 'NotificationRepository.initialize' });
      }
    }
  }

  async setExternalUserId(userId: string): Promise<void> {
    if (!this.initialized) return;

    try {
      await OneSignal.login(userId);
      Logger.info(`External user ID set: ${userId}`, {
        location: 'NotificationRepository.setExternalUserId',
      });
    } catch (error) {
      Logger.error(error, { location: 'NotificationRepository.setExternalUserId' });
    }
  }

  async removeExternalUserId(): Promise<void> {
    if (!this.initialized) return;

    try {
      await OneSignal.logout();
      Logger.info('External user ID removed', {
        location: 'NotificationRepository.removeExternalUserId',
      });
    } catch (error) {
      Logger.error(error, { location: 'NotificationRepository.removeExternalUserId' });
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.initialized) return false;

    try {
      const permission = await OneSignal.Notifications.requestPermission();
      return permission;
    } catch (error) {
      Logger.error(error, { location: 'NotificationRepository.requestPermission' });
      return false;
    }
  }

  onNotificationClick(handler: (data: INotificationPayload | undefined) => void): void {
    if (!this.initialized) return;

    OneSignal.Notifications.addEventListener('click', (event) => {
      const additionalData = event.notification.additionalData;
      const payload =
        additionalData && typeof additionalData === 'object'
          ? (additionalData as INotificationPayload)
          : undefined;
      handler(payload);
    });
  }
}
