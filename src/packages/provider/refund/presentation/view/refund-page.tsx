'use client';

import { Button } from '@/components/atoms';
import { DataTable } from '@/components/templates/datatable';
import { StatusBadge } from '@/components/molecules/badge-status';
import { formatRupiah } from '@/shared/utils';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AlertCircle, Upload } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { IRefundListItem } from '../../domain/response';
import { useRefundController } from '../controller';
import { SettleRefundDialog } from './settle-refund-dialog';

export const RefundPage = () => {
  const t = useTranslations('RefundManagement');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { useRefundList } = useRefundController();
  const { refunds, pagination, isLoading } = useRefundList(
    pageIndex + 1,
    pageSize,
    search || undefined,
  );
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const columns: ColumnDef<IRefundListItem>[] = [
    {
      accessorKey: 'fullName',
      header: t('table.pilgrim'),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{row.original.fullName}</span>
          <span className="text-xs text-gray-500 font-medium tracking-wide">
            {row.original.passportNumber}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'submissionId',
      header: t('table.submissionId'),
      cell: ({ row }) => (
        <code className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
          {row.original.submissionId}
        </code>
      ),
    },
    {
      accessorKey: 'refundAmount',
      header: t('table.amount'),
      cell: ({ row }) => (
        <span className="font-black text-primary-default text-base">
          {formatRupiah(row.original.refundAmount)}
        </span>
      ),
    },
    {
      accessorKey: 'refundStatus',
      header: t('table.status'),
      cell: ({ row }) => {
        const isSettled = row.original.refundStatus === 'SETTLED';
        return (
          <StatusBadge
            status={isSettled ? 'verified' : 'pending'}
            label={isSettled ? t('status.settled') : t('status.pending')}
          />
        );
      },
    },
    {
      accessorKey: 'deadline',
      header: t('table.deadline'),
      cell: ({ row }) => {
        if (!row.original.deadline) return '-';
        const deadline = new Date(row.original.deadline);
        const isOverdue = deadline < new Date();
        return (
          <div className="flex items-center gap-1.5">
            <span className={isOverdue ? 'text-red-500 font-bold' : 'text-gray-600 font-medium'}>
              {deadline.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
            {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: t('table.actions'),
      cell: ({ row }) => {
        const isSettled = row.original.refundStatus === 'SETTLED';
        const deadline = row.original.deadline ? new Date(row.original.deadline) : null;
        const isOverdue = deadline ? deadline < new Date() : false;

        if (isSettled) {
          return (
            <StatusBadge status="verified" label={t('status.settled')} className="w-fit h-8" />
          );
        }

        if (isOverdue) {
          return (
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs bg-red-50 px-3 py-2 rounded-xl border border-red-100 w-fit">
              <AlertCircle className="w-3.5 h-3.5" />
              {t('table.callCS')}
            </div>
          );
        }

        return (
          <Button
            size="sm"
            variant="primaryOutline"
            onClick={() => setSelectedSubmissionId(row.original.submissionId)}
            className="h-9 rounded-xl px-4"
          >
            <Upload className="w-3.5 h-3.5 mr-2" />
            {t('table.settleAction')}
          </Button>
        );
      },
    },
  ];

  const onSearchChange = useCallback((val?: string) => {
    setSearch(val || '');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const onPaginationChange = useCallback(setPagination, [setPagination]);

  const table = useReactTable({
    data: refunds,
    columns,
    pageCount: pagination?.totalPages || 0,
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
          {t('title')}
        </h1>
        <p className="text-sm text-gray-500 font-medium">{t('subtitle')}</p>
      </div>

      <DataTable
        columns={columns}
        table={table}
        loading={isLoading}
        emptyTitle={t('empty.title')}
        emptyDescription={t('empty.description')}
        searchKey="fullName"
        searchPlaceholder={t('table.searchPlaceholder')}
        onSearchChange={onSearchChange}
        delayDebounce={1000}
      />

      {selectedSubmissionId && (
        <SettleRefundDialog
          open={!!selectedSubmissionId}
          setOpen={(open) => !open && setSelectedSubmissionId(null)}
          submissionId={selectedSubmissionId}
        />
      )}
    </div>
  );
};
