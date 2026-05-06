'use client';

import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { Skeleton } from '@/components/atoms/skeleton';
import { StatusBadge } from '@/components/molecules/badge-status';
import { DataTable } from '@/components/templates/datatable';
import { EmptyState } from '@/components/templates/empty-state';
import { ROUTES } from '@/shared/constants/routes';
import { formatDate, thousandFormat } from '@/shared/utils';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pencil, Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { ITransaction } from '../../domain/transaction';

import { getTransactionDisplayStatus } from '@/packages/pilgrim/transaction/domain/utils';

interface TransactionListViewProps {
  transactions: ITransaction[];
  loading: boolean;
  isFetching?: boolean;
  onViewDetail: (id: string) => void;
  pageCount: number;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (
    pagination: import('@tanstack/react-table').Updater<
      import('@tanstack/react-table').PaginationState
    >,
  ) => void;
  search: string;
  onSearchChange: (value?: string) => void;
  onRetry?: () => void;
}

export const TransactionListView = ({
  transactions,
  loading,
  isFetching,
  onViewDetail,
  pageCount,
  pagination,
  onPaginationChange,
  onSearchChange,
}: TransactionListViewProps) => {
  const t = useTranslations('VisaTransaction');

  const columns = useMemo<ColumnDef<ITransaction>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <span className="font-bold text-foreground">
            {row.original.id.split('-')[0].toUpperCase()}
          </span>
        ),
      },
      {
        accessorKey: 'route',
        header: t('form.tripRoute'),
        cell: ({ row }) => (
          <span className="text-muted-foreground font-medium">{row.original.route || 'Umrah'}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: t('form.date'),
        cell: ({ row }) => (
          <span className="text-muted-foreground whitespace-nowrap">
            {formatDate(row.original.createdAt, 'D MMMM YYYY', false)}
          </span>
        ),
      },
      {
        id: 'members',
        header: t('stepTitles.selectMembers'),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {t('form.membersCount', { count: row.original.pilgrimIds.length })}
          </span>
        ),
      },
      {
        accessorKey: 'invoiceAmount',
        header: t('form.estimatedTotal'),
        cell: ({ row }) => (
          <span className="font-bold text-foreground">
            IDR {thousandFormat(row.original.invoiceAmount)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const displayStatus = getTransactionDisplayStatus(row.original);
          return (
            <StatusBadge
              status={displayStatus.status}
              label={t(displayStatus.labelKey as Parameters<typeof t>[0])}
            />
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) =>
          row.original.paymentStatus === 'PENDING' ? (
            <Button
              variant="transparent"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-primary-default"
              asChild
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Link href={`${ROUTES.PILGRIM.TRANSACTION.FORM}?id=${row.original.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          ) : null,
      },
    ],
    [t],
  );

  const onPaginationChangeCallback = useCallback(onPaginationChange, [onPaginationChange]);

  const table = useReactTable({
    data: transactions,
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: onPaginationChangeCallback,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (loading || (isFetching && transactions.length === 0)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl md:hidden" />
        <Skeleton className="h-[400px] w-full rounded-2xl hidden md:block" />
        <div className="md:hidden space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block lg:p-0.5">
        <DataTable
          table={table}
          columns={columns}
          loading={loading}
          onRowClick={(row) => onViewDetail(row.id)}
          searchKey="id"
          searchPlaceholder={t('form.tripRoute')}
          onSearchChange={onSearchChange}
          delayDebounce={1000}
          emptyTitle={t('emptyTitle')}
          emptyDescription={t('emptyDescription')}
          emptyAction={
            <Button href={ROUTES.PILGRIM.TRANSACTION.FORM} size="md">
              <Plane size={18} />
              <span>{t('addTransaction')}</span>
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {transactions.length === 0 ? (
          <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
        ) : (
          transactions.map((tx) => (
            <Card
              key={tx.id}
              className="p-4 hover:border-primary-default/20 transition-all cursor-pointer group"
              onClick={() => onViewDetail(tx.id)}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground truncate">
                    {tx.id.split('-')[0].toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">{tx.route || 'Umrah'}</p>
                </div>
                {(() => {
                  const displayStatus = getTransactionDisplayStatus(tx);
                  return (
                    <StatusBadge
                      status={displayStatus.status}
                      label={t(displayStatus.labelKey as Parameters<typeof t>[0])}
                    />
                  );
                })()}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {t('form.estimatedTotal')}
                  </span>
                  <span className="text-sm font-black text-foreground">
                    IDR {thousandFormat(tx.invoiceAmount)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {tx.paymentStatus === 'PENDING' && (
                    <Button
                      variant="transparent"
                      size="icon"
                      className="h-9 w-9 text-gray-400 hover:text-primary-default"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href={`${ROUTES.PILGRIM.TRANSACTION.FORM}?id=${tx.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
};
