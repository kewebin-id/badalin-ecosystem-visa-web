import { ESetValue } from '../actions/actions.type';
import { IState, INotification } from './reducer';

export const initialState: IState = {
  sampleState: undefined,
  notifications: [],
  unreadCount: 0,
};

export const reducer = (state: IState, action: { type: ESetValue; payload?: unknown }): IState => {
  switch (action.type) {
    case ESetValue.SET_SAMPLE_STATE:
      return { ...state, sampleState: action?.payload };
    case ESetValue.SET_NOTIFICATIONS:
      return { ...state, notifications: action?.payload as INotification[] };
    case ESetValue.ADD_NOTIFICATION:
      return { ...state, notifications: [action?.payload as INotification, ...state.notifications] };
    case ESetValue.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action?.payload as number };
    case ESetValue.INCREMENT_UNREAD_COUNT:
      return { ...state, unreadCount: state.unreadCount + 1 };
    case ESetValue.DECREMENT_UNREAD_COUNT:
      return { ...state, unreadCount: Math.max(0, state.unreadCount - 1) };
    case ESetValue.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action?.payload ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    default:
      throw new Error();
  }
};
