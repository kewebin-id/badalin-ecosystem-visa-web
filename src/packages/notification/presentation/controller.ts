import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { NotificationRepository } from '../repository';
import { NotificationUseCase } from '../usecase';

const repository = new NotificationRepository();
const useCase = new NotificationUseCase(repository);

export const useNotificationController = () => {
  const t = useTranslations('Dashboard');

  const useNotifications = () => {
    return useInfiniteQuery({
      queryKey: ['notifications'],
      queryFn: ({ pageParam = 1 }) =>
        useCase.getNotifications({ page: pageParam as number, limit: 10 }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        // Assuming the response is an array or has a data array
        const listData = lastPage?.data as unknown;
        const dataArray = Array.isArray(listData)
          ? listData
          : (listData as { data?: unknown[] })?.data || [];

        // If we received a full page (10 items), there might be a next page
        if (dataArray.length === 10) {
          return allPages.length + 1;
        }

        // Otherwise, we reached the end
        return undefined;
      },
    });
  };

  const useUnreadCount = () => {
    return useQuery({
      queryKey: ['notifications-unread-count'],
      queryFn: () => useCase.getUnreadCount(),
    });
  };

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => useCase.markAsRead(id),
    onError: (error) => {
      console.error('Failed to mark as read:', error);
      toast.error(t('markAsReadError'));
    },
  });

  return {
    useNotifications,
    useUnreadCount,
    useMarkAsRead: () => markAsReadMutation,
  };
};
