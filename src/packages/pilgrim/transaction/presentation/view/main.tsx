'use client';

import { Button } from '@/components/atoms/button';
import { EmptyState } from '@/components/templates/empty-state';
import { ROUTES } from '@/shared/constants/routes';
import { AlertCircle, IdCardLanyard, RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTransactionController } from '../controller';
import { TransactionListView } from './list';

export const TransactionManagementView = () => {
  const t = useTranslations('VisaTransaction');
  const router = useRouter();

  const [search, setSearch] = useState<string>('');
  const [{ pageIndex, pageSize }, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { useTransactions } = useTransactionController();
  const {
    data: transactionsRes,
    isLoading,
    refetch,
    isFetching,
  } = useTransactions({
    page: pageIndex + 1,
    limit: pageSize,
    search: search || undefined,
  });

  const transactions = transactionsRes?.data?.items || [];
  const pageCount = transactionsRes?.data?.totalPages || 0;
  const hasError = transactionsRes?.error;

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div className="text-left w-full flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {t('title') === 'VisaTransaction.title' ? 'Transaksi & Pengajuan' : t('title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('description') === 'VisaTransaction.description'
              ? 'Kelola pengajuan visa'
              : t('description')}
          </p>
        </div>
        <div>
          <Button
            onClick={() => router.push(ROUTES.PILGRIM.TRANSACTION.FORM)}
            size="md"
            className="w-fit"
          >
            <IdCardLanyard className="size-4" />
            {t('addTransaction') === 'VisaTransaction.addTransaction'
              ? 'Ajukan Visa'
              : t('addTransaction')}
          </Button>
        </div>
      </div>

      {hasError && !isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-danger-50 border border-danger-100 rounded-3xl space-y-4">
          <div className="h-12 w-12 rounded-full bg-danger-100 flex items-center justify-center text-danger-600">
            <AlertCircle className="size-6" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-danger-900">Gagal Mengambil Data</h3>
            <p className="text-sm text-danger-700 max-w-md">
              {transactionsRes?.message ||
                'Terjadi kesalahan saat menghubungi server. Silakan coba beberapa saat lagi.'}
            </p>
          </div>
          <Button variant="primaryOutline" onClick={() => refetch()} className="gap-2">
            <RefreshCcw className="size-4" /> Coba Lagi
          </Button>
        </div>
      ) : transactions.length === 0 && !isLoading ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          action={
            <Button
              onClick={() => router.push(ROUTES.PILGRIM.TRANSACTION.FORM)}
              size="lg"
              className="w-fit"
            >
              {t('addTransaction') === 'VisaTransaction.addTransaction'
                ? 'Ajukan Visa'
                : t('addTransaction')}
            </Button>
          }
        />
      ) : (
        <TransactionListView
          transactions={transactions}
          onViewDetail={(id) => router.push(`${ROUTES.PILGRIM.TRANSACTION.INDEX}/${id}`)}
          loading={isLoading}
          isFetching={isFetching}
          pageCount={pageCount}
          pagination={{ pageIndex, pageSize }}
          onPaginationChange={setPagination}
          search={search}
          onSearchChange={(val?: string) => {
            setSearch(val || '');
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          onRetry={refetch}
        />
      )}
    </div>
  );
};
