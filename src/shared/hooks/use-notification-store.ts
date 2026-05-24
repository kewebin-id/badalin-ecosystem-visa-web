import { store } from '@/shared/context';
import { ESetValue } from '@/shared/context/actions/actions.type';
import { INotification } from '@/shared/context/reducers/reducer.d';
import { useContext } from 'react';
import { useNotificationController } from '@/packages/notification/presentation/controller';

export { type INotification };

export const useNotificationStore = () => {
  const { state, dispatch } = useContext(store);

  const notifications = state.notifications;
  const unreadCount = state.unreadCount;

  const setNotifications = (list: INotification[]) => {
    dispatch({ type: ESetValue.SET_NOTIFICATIONS, payload: list });
  };

  const addNotification = (item: INotification) => {
    dispatch({ type: ESetValue.ADD_NOTIFICATION, payload: item });
  };

  const setUnreadCount = (count: number) => {
    dispatch({ type: ESetValue.SET_UNREAD_COUNT, payload: count });
  };

  const incrementUnreadCount = () => {
    dispatch({ type: ESetValue.INCREMENT_UNREAD_COUNT });
  };

  const decrementUnreadCount = () => {
    dispatch({ type: ESetValue.DECREMENT_UNREAD_COUNT });
  };

  const markAsReadLocal = (id: string) => {
    dispatch({ type: ESetValue.MARK_NOTIFICATION_READ, payload: id });
  };

  return {
    notifications,
    unreadCount,
    setNotifications,
    addNotification,
    setUnreadCount,
    incrementUnreadCount,
    decrementUnreadCount,
    markAsReadLocal,
  };
};
