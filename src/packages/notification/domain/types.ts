import { ResponseREST } from '@/shared/utils/rest-api/types';

export interface INotificationPayload {
  type: 'booking' | 'approval' | 'trip' | 'carpool' | 'finance';
  id: string;
  title: string;
  message: string;
}

export interface INotificationRepository {
  initialize(): Promise<void>;
  setExternalUserId(userId: string): Promise<void>;
  removeExternalUserId(): Promise<void>;
  requestPermission(): Promise<boolean>;
  onNotificationClick(handler: (data: INotificationPayload | undefined) => void): void;
  getNotifications(params?: {
    page?: number;
    limit?: number;
  }): Promise<ResponseREST<Record<string, unknown>>>;
  getUnreadCount(): Promise<ResponseREST<{ count: number }>>;
  markAsRead(id: string): Promise<ResponseREST<void>>;
}
