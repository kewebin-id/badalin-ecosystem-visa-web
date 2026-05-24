import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import Logger from '@/shared/utils/logger';
import { INotificationPayload, INotificationRepository } from '../domain/types';

export class NotificationUseCase {
  constructor(private repository: INotificationRepository) {}

  async initialize(): Promise<void> {
    await this.repository.initialize();
  }

  async syncUser(userId: string): Promise<void> {
    if (!userId) {
      Logger.info('Cannot sync user: userId is empty', {
        location: 'NotificationUseCase.syncUser',
      });
      return;
    }
    await this.repository.setExternalUserId(userId);
  }

  async cleanup(): Promise<void> {
    await this.repository.removeExternalUserId();
  }

  async requestPermission(): Promise<boolean> {
    return await this.repository.requestPermission();
  }

  setupNotificationClickHandler(navigate: (url: string) => void): void {
    this.repository.onNotificationClick((data?: INotificationPayload) => {
      if (!data) return;
      const route = this.getRouteFromNotification(data);
      if (route) {
        Logger.info(`Navigating to: ${route}`, {
          location: 'NotificationUseCase.setupNotificationClickHandler',
        });
        navigate(route);
      }
    });
  }

  private getRouteFromNotification(data: INotificationPayload): string | null {
    if (!data?.type || !data?.id) return null;
    return null;
  }

  async getNotifications(params?: {
    page?: number;
    limit?: number;
  }): Promise<IUsecaseResponse<Record<string, unknown>>> {
    try {
      const res = await this.repository.getNotifications(params);
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal mengambil data notifikasi'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }
      return {
        message: res.message,
        data: res.data,
      };
    } catch {
      return { error: new Error('Terjadi kesalahan saat mengambil data notifikasi') };
    }
  }

  async getUnreadCount(): Promise<IUsecaseResponse<{ count: number }>> {
    try {
      const res = await this.repository.getUnreadCount();
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal mengambil jumlah notifikasi'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }
      return {
        message: res.message,
        data: res.data,
      };
    } catch {
      return { error: new Error('Terjadi kesalahan saat mengambil jumlah notifikasi') };
    }
  }

  async markAsRead(id: string): Promise<IUsecaseResponse<void>> {
    try {
      const res = await this.repository.markAsRead(id);
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal menandai notifikasi'),
        };
      }
      return {
        message: res.message,
      };
    } catch {
      return { error: new Error('Terjadi kesalahan saat menandai notifikasi') };
    }
  }
}
