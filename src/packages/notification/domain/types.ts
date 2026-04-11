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
}
