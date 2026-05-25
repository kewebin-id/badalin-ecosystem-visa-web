'use client';

import { useNotificationController } from '@/packages/notification/presentation/controller';
import { INotification, useNotificationStore } from '@/shared/hooks/use-notification-store';
import { InfiniteScroll } from '@/components/molecules';
import { cn } from '@/shared/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

dayjs.extend(relativeTime);

export const NotificationCenterView = () => {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const { notifications, setNotifications, decrementUnreadCount, markAsReadLocal } =
    useNotificationStore();

  const { useNotifications, useMarkAsRead } = useNotificationController();

  const {
    data: historyRes,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications();
  const markAsReadMutation = useMarkAsRead();

  useEffect(() => {
    refetch();
  }, [refetch]);

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

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.isRead) {
      decrementUnreadCount();
      markAsReadLocal(notification.id);
      markAsReadMutation.mutate(notification.id);
    }

    if (notification.targetUrl) {
      router.push(notification.targetUrl);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{t('notifications')}</h1>
        </div>

        <div className="p-4 md:p-6 bg-gray-50/30">
          {notifications.length === 0 ? (
            <div className="py-20 text-center text-gray-500 text-sm flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-gray-100 border-dashed">
              <div className="p-4 bg-gray-50 rounded-full">
                <Bell className="size-8 text-gray-300" />
              </div>
              <p className="text-base text-gray-500">{t('emptyNotifications')}</p>
            </div>
          ) : (
            <InfiniteScroll
              isLoading={isFetchingNextPage}
              hasNextPage={!!hasNextPage}
              onLoadMore={() => fetchNextPage()}
              label={t('notifications')}
            >
              <div className="flex flex-col gap-3">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={cn(
                      'p-4 md:p-5 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md flex items-start gap-4 group',
                      !item.isRead
                        ? 'bg-blue-50/50 border-blue-100/50 hover:bg-blue-50'
                        : 'bg-white border-gray-100 hover:border-gray-200',
                    )}
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div
                        className={cn(
                          'p-2.5 rounded-full transition-colors',
                          !item.isRead
                            ? 'bg-blue-100/80 text-blue-600'
                            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200',
                        )}
                      >
                        <Bell className="size-5" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h4
                          className={cn(
                            'text-sm md:text-base text-gray-900',
                            !item.isRead ? 'font-bold' : 'font-medium',
                          )}
                        >
                          {item.title}
                        </h4>
                        <span className="text-[11px] md:text-xs text-gray-400 font-medium whitespace-nowrap pt-0.5">
                          {dayjs(item.createdAt).fromNow()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed pr-8">{item.message}</p>
                    </div>
                    {!item.isRead && (
                      <div className="flex-shrink-0 mt-3 mr-1">
                        <div className="size-2.5 bg-blue-500 rounded-full shadow-sm ring-4 ring-blue-50" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};
