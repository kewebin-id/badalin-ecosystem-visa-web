'use client';

import { DropdownDrawer } from '@/components/molecules';
import { useNotificationController } from '@/packages/notification/presentation/controller';
import { INotification, useNotificationStore } from '@/shared/hooks/use-notification-store';
import { cn } from '@/shared/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/shared/constants/routes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

dayjs.extend(relativeTime);

export const NotificationDropdown = () => {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const [open, setOpen] = useState<boolean>(false);
  const {
    notifications,
    unreadCount,
    setNotifications,
    setUnreadCount,
    decrementUnreadCount,
    markAsReadLocal,
  } = useNotificationStore();

  const { useNotifications, useUnreadCount, useMarkAsRead } = useNotificationController();

  const { data: historyRes } = useNotifications();
  const { data: countRes } = useUnreadCount();
  const markAsReadMutation = useMarkAsRead();

  const pages = historyRes?.pages;

  useEffect(() => {
    if (pages) {
      const allNotifs: INotification[] = [];
      pages.forEach((page: unknown) => {
        const listData = (page as { data?: unknown })?.data;
        const pageArray = Array.isArray(listData)
          ? listData
          : listData && typeof listData === 'object' && 'data' in listData
            ? (listData as { data: INotification[] }).data
            : [];
        allNotifs.push(...(pageArray as INotification[]));
      });
      setNotifications(allNotifs);
    }
  }, [pages, setNotifications]);

  useEffect(() => {
    const countData = countRes?.data as unknown;
    const responseRoot = countRes as unknown;

    if (typeof countData === 'number') {
      setUnreadCount(countData);
    } else if (countData && typeof countData === 'object' && 'count' in countData) {
      const nestedCount = (countData as { count: unknown }).count;
      if (typeof nestedCount === 'number') {
        setUnreadCount(nestedCount);
      }
    } else if (responseRoot && typeof responseRoot === 'object' && 'count' in responseRoot) {
      const rootCount = (responseRoot as { count: unknown }).count;
      if (typeof rootCount === 'number') {
        setUnreadCount(rootCount);
      }
    }
  }, [countRes, setUnreadCount]);

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.isRead) {
      decrementUnreadCount();
      markAsReadLocal(notification.id);
      markAsReadMutation.mutate(notification.id);
    }

    if (notification.targetUrl) {
      setOpen(false);
      router.push(notification.targetUrl);
    }
  };

  return (
    <>
      <DropdownDrawer
        open={open}
        setOpen={setOpen}
        title={t('notifications')}
        trigger={
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
            <Bell className="size-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        }
        showCloseButton={false}
        headerRight={
          unreadCount > 0 && (
            <span className="text-xs text-primary-default font-medium bg-primary-default/10 px-2 py-0.5 rounded-full">
              {t('newNotifications', { count: unreadCount })}
            </span>
          )
        }
        description="Notifications List"
        descriptionClassName="sr-only"
      >
        <div className="flex flex-col gap-2">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
              <Bell className="size-8 text-gray-300 mb-2" />
              <p>{t('emptyNotifications')}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={cn(
                    'p-4 border border-gray-100 rounded-lg mb-2 cursor-pointer transition-colors hover:bg-gray-50',
                    !item.isRead ? 'bg-primary-default/5 border-primary-default/20' : 'bg-white',
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <h4
                      className={cn(
                        'text-sm text-gray-900',
                        !item.isRead ? 'font-semibold' : 'font-medium',
                      )}
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 font-medium">
                      {dayjs(item.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              ))}
              {notifications.length > 10 && (
                <Link
                  href={ROUTES.PILGRIM.NOTIFICATIONS}
                  onClick={() => setOpen(false)}
                  className="mt-2 text-sm text-center text-primary-default font-medium hover:underline py-2 block w-full"
                >
                  {t('viewAllNotifications')}
                </Link>
              )}
            </div>
          )}
        </div>
      </DropdownDrawer>
    </>
  );
};
