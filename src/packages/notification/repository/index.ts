import { oneSignalConfig } from '@/shared/config/onesignal.config';
import { endpoints } from '@/shared/constants';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { ResponseREST } from '@/shared/utils/rest-api/types';
import OneSignal from 'react-onesignal';
import { INotificationPayload, INotificationRepository } from '../domain/types';

export class NotificationRepository implements INotificationRepository {
  private initialized = false;
  private api = new RestAPI();

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

  async getNotifications(params?: {
    page?: number;
    limit?: number;
  }): Promise<ResponseREST<Record<string, unknown>>> {
    return await this.api.get({
      endpoint: endpoints.nextApi.visa.notifications.base,
      queryParam: params,
      isNextApi: true,
    });
  }

  async getUnreadCount(): Promise<ResponseREST<{ count: number }>> {
    return await this.api.get({
      endpoint: endpoints.nextApi.visa.notifications.unreadCount,
      isNextApi: true,
    });
  }

  async markAsRead(id: string): Promise<ResponseREST<void>> {
    return await this.api.patch({
      endpoint: endpoints.nextApi.visa.notifications.markAsRead(id),
      isNextApi: true,
    });
  }
}
