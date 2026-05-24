export interface INotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  targetUrl?: string;
  data?: unknown;
}

export interface IState {
  sampleState?: unknown;
  notifications: INotification[];
  unreadCount: number;
}
