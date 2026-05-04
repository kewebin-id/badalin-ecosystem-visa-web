'use client';

import { NotFoundComp } from '@/components/atoms';
import { Skeleton } from '@/components/atoms/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';
import { HeaderPageContent } from '@/components/molecules';
import { UploadFile } from '@/components/molecules/input/file';
import {
  DetailLogisticsTab,
  DetailPaymentTab,
  DetailSidebarActions,
  PaymentStatusDialog,
} from '@/components/organisms/transactions/detail';
import { ITransaction } from '@/packages/pilgrim/transaction/domain/transaction';
import { ROUTES } from '@/shared/constants/routes';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTransactionController } from '../controller';

export const TransactionDetailView = () => {
  const t = useTranslations('VisaTransaction');
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { useTransactionDetail, useUploadProof } = useTransactionController();
  const { data: detailRes, isLoading, refetch } = useTransactionDetail(id);
  const transaction = detailRes?.data || null;

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastUploadedData, setLastUploadedData] = useState<ITransaction | null>(null);

  const uploadMutation = useUploadProof();
  const handleUpload = (_: UploadFile[], rawFiles?: File[]) => {
    const file = rawFiles?.[0];
    if (file && transaction) {
      uploadMutation.mutate(
        { id: transaction.id, file },
        {
          onSuccess: (res) => {
            setLastUploadedData(res.data || null);
            setShowSuccessDialog(true);
            refetch();
          },
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20 animate-in fade-in duration-500">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="size-10 rounded-2xl" />
          <Skeleton className="h-8 w-48 rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <NotFoundComp
          label={t('notFoundTitle')}
          message={t('notFoundDescription')}
          actionButton={t('backToList')}
          actionHref={ROUTES.PILGRIM.TRANSACTION.INDEX}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <HeaderPageContent
        title={transaction.id.split('-')[0].toUpperCase()}
        subtitle="Detail Transaksi"
        onBack={() => router.push(ROUTES.PILGRIM.TRANSACTION.INDEX)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content - Logistics */}
        <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
          <Tabs defaultValue="logistik" className="w-full">
            <TabsList>
              <TabsTrigger value="logistik">{t('detail.logistics')}</TabsTrigger>
              <TabsTrigger value="pembayaran" className="relative">
                <div className="flex items-center gap-2">
                  {t('detail.paymentStatus')}
                  {transaction.paymentStatus !== 'PENDING' && (
                    <CheckCircle2 className="size-4 text-primary-default" />
                  )}
                </div>
                {transaction.paymentStatus === 'PENDING' && (
                  <span className="absolute top-1/2 -translate-y-1/2 right-4 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-danger-500"></span>
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="logistik" className="mt-6 space-y-6">
              <DetailLogisticsTab transaction={transaction} />
            </TabsContent>

            <TabsContent value="pembayaran" className="mt-6 space-y-6">
              <DetailPaymentTab
                transaction={transaction}
                onUpload={handleUpload}
                isUploading={uploadMutation.isPending}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Summary & Actions */}
        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
          <DetailSidebarActions
            transaction={transaction}
            onEdit={() => router.push(`${ROUTES.PILGRIM.TRANSACTION.FORM}?id=${transaction.id}`)}
          />
        </div>
      </div>

      <PaymentStatusDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        message={lastUploadedData?.resultSnapshot?.message}
      />
    </div>
  );
};
