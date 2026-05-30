'use client';

import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { StatusBadge } from '@/components/molecules/badge-status';
import { ITransaction } from '@/packages/pilgrim/transaction/domain/transaction';
import { formatDate } from '@/shared/utils';
import { Download, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getTransactionDisplayStatus } from '@/packages/pilgrim/transaction/domain/utils';

interface DetailSidebarActionsProps {
  transaction: ITransaction;
  onEdit: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
  onResubmit?: () => void;
  isResubmitting?: boolean;
}

export const DetailSidebarActions = ({
  transaction,
  onEdit,
  onDownload,
  isDownloading,
  onResubmit,
  isResubmitting,
}: DetailSidebarActionsProps) => {
  const t = useTranslations('VisaTransaction');

  const displayStatus = getTransactionDisplayStatus(transaction);

  return (
    <Card className="p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6 bg-white sticky top-24 overflow-hidden">
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
          {t('detail.statusTitle')}
        </p>
        <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center gap-3 border border-gray-100">
          <StatusBadge
            status={displayStatus.status}
            label={t(displayStatus.labelKey as Parameters<typeof t>[0])}
            className="text-xs font-black px-4 py-1.5 rounded-full"
          />
          {transaction.updatedAt && (
            <p className="text-[10px] text-muted-foreground italic font-medium">
              {t('detail.statusAsOf')} {formatDate(transaction.updatedAt, 'DD MMMM YYYY, HH:mm')}
            </p>
          )}
        </div>
      </div>

      {(transaction.paymentStatus === 'PENDING' ||
        transaction.status === 'ON_FIXING' ||
        (transaction.paymentStatus === 'COMPLETED' && transaction.status === 'ISSUED')) && (
        <div className="pt-6 border-t border-gray-50 flex flex-col gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
            {transaction.paymentStatus === 'COMPLETED' && transaction.status === 'ISSUED'
              ? t('detail.downloadVisa')
              : t('detail.actionTitle')}
          </p>

          {transaction.paymentStatus === 'COMPLETED' && transaction.status === 'ISSUED' ? (
            <Button
              className="w-full rounded-2xl shadow-lg shadow-primary-500/20 py-6"
              size="lg"
              onClick={onDownload}
              disabled={isDownloading}
            >
              <Download className={`size-5 mr-3 ${isDownloading ? 'animate-bounce' : ''}`} />
              {isDownloading ? t('detail.downloading') : t('detail.downloadVisa')}
            </Button>
          ) : (
            <>
              {(transaction.paymentStatus === 'PENDING' || transaction.status === 'ON_FIXING') && (
                <>
                  <Button
                    variant="primaryOutline"
                    className="w-full rounded-2xl border-primary-default/10 py-6"
                    onClick={onEdit}
                  >
                    <Pencil className="size-4 mr-2" /> {t('detail.editSubmission')}
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground italic leading-relaxed px-2">
                    {t('detail.editHint')}
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )}

      {transaction.status === 'ON_FIXING' && (
        <div className="pt-6 border-t border-gray-50 flex flex-col gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
            Aksi Revisi
          </p>
          <Button
            className="w-full rounded-2xl shadow-lg shadow-primary-500/20 py-6"
            size="lg"
            onClick={onResubmit}
            disabled={isResubmitting}
          >
            {isResubmitting ? 'Mengirim Ulang...' : 'Submit Revision'}
          </Button>
          <p className="text-[10px] text-center text-muted-foreground italic leading-relaxed px-2">
            Klik tombol ini jika Anda sudah menyelesaikan semua revisi data yang diminta.
          </p>
        </div>
      )}
    </Card>
  );
};
