'use client';

import { Button } from '@/components/atoms/button';
import { Skeleton } from '@/components/atoms/skeleton';
import { IVisaHistory } from '@/packages/pilgrim/dashboard/domain';
import { useDashboardController } from '@/packages/pilgrim/dashboard/presentation/controller';
import { ROUTES } from '@/shared/constants/routes';
import { Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TransactionCard } from './transaction-card';

export const HistoryList = () => {
  const t = useTranslations('TransactionHistory');
  const { useGetHistory } = useDashboardController();
  const { data: history = [], isLoading, isError, error } = useGetHistory();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-2 rounded-full" />
            <Skeleton className="h-8 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-[180px] bg-white rounded-[2rem] border border-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-50/30 rounded-3xl border border-dashed border-red-200">
        <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-2xl">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-red-900">{t('errorTitle')}</h3>
        <p className="text-red-600/80 max-w-md text-center px-6">
          {(error as Error)?.message || t('errorDefault')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-2 bg-primary-default rounded-full shadow-[0_0_15px_rgba(var(--primary-default),0.3)]" />
          <h2 className="text-3xl font-black text-dark-950 tracking-tight">{t('title')}</h2>
        </div>
        <p className="text-sm font-medium text-gray-400">{t('total', { count: history.length })}</p>
      </div>

      {!history || history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-bold text-dark-900">{t('emptyTitle')}</h3>
          <p className="text-gray-500 mb-6">{t('emptyDescription')}</p>
          <div>
            <Button href={ROUTES.PILGRIM.TRANSACTION.FORM} size="md" className="w-fit">
              <Plane size={18} />
              <span>{t('applyNow')}</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {history?.slice(0, 3).map((item: IVisaHistory) => (
              <TransactionCard key={item.transactionId} transaction={item} />
            ))}
          </div>

          {history.length > 3 && (
            <div className="flex justify-center pt-2">
              <Button variant="transparent" href={ROUTES.PILGRIM.TRANSACTION.INDEX} size="md">
                {t('viewAll')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
