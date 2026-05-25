import { store } from '@/shared/context';
import { ESetValue } from '@/shared/context/actions/actions.type';
import { INotification } from '@/shared/context/reducers/reducer.d';
import { useCallback, useContext } from 'react';

export { type INotification };

export const useNotificationStore = () => {
  const { state, dispatch } = useContext(store);

  const notifications = state.notifications;
  const unreadCount = state.unreadCount;

  const setNotifications = useCallback(
    (list: INotification[]) => {
      dispatch({ type: ESetValue.SET_NOTIFICATIONS, payload: list });
    },
    [dispatch],
  );

  const addNotification = useCallback(
    (item: INotification) => {
      dispatch({ type: ESetValue.ADD_NOTIFICATION, payload: item });
    },
    [dispatch],
  );

  const setUnreadCount = useCallback(
    (count: number) => {
      dispatch({ type: ESetValue.SET_UNREAD_COUNT, payload: count });
    },
    [dispatch],
  );

  const incrementUnreadCount = useCallback(() => {
    dispatch({ type: ESetValue.INCREMENT_UNREAD_COUNT });
  }, [dispatch]);

  const decrementUnreadCount = useCallback(() => {
    dispatch({ type: ESetValue.DECREMENT_UNREAD_COUNT });
  }, [dispatch]);

  const markAsReadLocal = useCallback(
    (id: string) => {
      dispatch({ type: ESetValue.MARK_NOTIFICATION_READ, payload: id });
    },
    [dispatch],
  );

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
