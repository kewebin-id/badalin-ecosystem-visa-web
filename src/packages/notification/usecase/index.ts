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

    // TODO: Implement routing based on available ROUTES if needed
    // The previous routes (booking, approval, trip, finance, carpool) were removed from constants/routes.ts
    return null;
  }
}
