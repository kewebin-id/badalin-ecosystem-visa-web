'use client';

import { CountdownTimer, Image } from '@/components/atoms';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { ImagePreviewModal } from '@/components/molecules/image-preview-modal';
import { InputFile, UploadFile } from '@/components/molecules/input/file';
import { PAYMENT_STEPS } from '@/packages/pilgrim/transaction/domain/constant';
import { ITransaction } from '@/packages/pilgrim/transaction/domain/transaction';
import { cn, currencyFormat } from '@/shared/utils';
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  Landmark,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

interface DetailPaymentTabProps {
  transaction: ITransaction;
  onUpload: (files: UploadFile[], rawFiles?: File[]) => void;
  isUploading: boolean;
}

export const DetailPaymentTab = ({ transaction, onUpload, isUploading }: DetailPaymentTabProps) => {
  const t = useTranslations('VisaTransaction');
  const [showPreview, setShowPreview] = useState(false);
  const proofUrl = transaction.proofOfPayment || transaction.paymentProofUrl;

  const handleCopy = () => {
    const bankNumber = transaction.agency?.bankAccountNumber;
    if (bankNumber) {
      navigator.clipboard.writeText(bankNumber);
      toast.success(t('detail.copySuccess'));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 text-center border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-white to-gray-50/50 rounded-[2.5rem]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 opacity-60">
          {t('detail.totalInvoice')}
        </p>
        <p className="text-4xl font-black text-foreground">
          {currencyFormat(transaction.invoiceAmount)}
        </p>
      </Card>

      {transaction.paymentStatus === 'PENDING' && transaction.paymentDeadline && (
        <CountdownTimer deadline={transaction.paymentDeadline} />
      )}

      {transaction.paymentStatus === 'PENDING' && (
        <div className="bg-primary-default/5 rounded-3xl p-6 space-y-2 border border-primary-default/10">
          <p className="text-xs font-black text-primary-default uppercase tracking-widest">
            {t('detail.transferTo')}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-foreground">
                {transaction.agency?.bankName || 'Bank'} •{' '}
                {transaction.agency?.bankAccountNumber || '-'}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                a.n. {transaction.agency?.bankAccountName || '-'}
              </p>
            </div>
            <div>
              <Button
                variant="transparent"
                size="sm"
                className="text-primary-default font-black h-8 hover:bg-white px-3 rounded-xl border border-primary-default/10 w-fit"
                onClick={handleCopy}
              >
                {t('detail.copy')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {transaction.paymentStatus === 'PENDING' &&
        !transaction.paymentProofUrl &&
        !transaction.proofOfPayment && (
          <InputFile
            maxFiles={3}
            isDragDrop={true}
            onChange={onUpload}
            isReadingOcr={isUploading}
            allowedTypes={['.png', '.jpeg', '.jpg', '.pdf']}
            dropzoneText={t('detail.uploadProof')}
            className="w-full bg-white!"
          />
        )}

      {transaction.paymentStatus === 'CHECKING' && (
        <Card className="bg-gradient-to-r from-warning-50 to-white border-warning-100/50 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-warning-500/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all duration-700 group-hover:scale-150" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="size-14 rounded-2xl bg-info-500 flex items-center justify-center text-white shadow-xl shadow-warning-500/20 shrink-0 animate-pulse">
              <ShieldCheck className="size-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-black text-foreground tracking-tight">
                  {t('detail.proofReceived')}
                </p>
                <div className="size-1.5 rounded-full bg-warning-500 animate-ping" />
              </div>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[280px]">
                {t('detail.checkingStatus')}
              </p>
            </div>
            <Badge variant="info">{t(`payment.${transaction.paymentStatus}`)}</Badge>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-center gap-2 sm:gap-4 py-8 max-w-lg mx-auto overflow-x-auto no-scrollbar">
        {PAYMENT_STEPS.map((step, i) => {
          const activeIdx = PAYMENT_STEPS.findIndex((s) => s.key === transaction.paymentStatus);
          const isCompleted = i <= activeIdx;
          const StepIcon = step.icon;
          return (
            <div
              key={step.key}
              className="flex items-center flex-1 last:flex-initial relative min-w-[80px] sm:min-w-[100px]"
            >
              <div className="flex flex-col items-center z-10 w-full text-center group">
                <div
                  className={cn(
                    'h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center transition-all duration-700',
                    isCompleted
                      ? 'bg-primary-default text-white shadow-xl shadow-primary-default/20 scale-105'
                      : 'bg-gray-100 text-muted-foreground/40 group-hover:bg-gray-200',
                  )}
                >
                  <StepIcon className="size-6 sm:size-7" strokeWidth={isCompleted ? 2.5 : 1.5} />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-black mt-4 uppercase tracking-[0.15em] leading-tight transition-colors duration-500',
                    isCompleted ? 'text-primary-default' : 'text-muted-foreground/50',
                  )}
                >
                  {t(`payment.${step.key}`)}
                </span>
              </div>
              {i < PAYMENT_STEPS.length - 1 && (
                <div
                  className={cn(
                    'absolute left-[calc(50%+28px)] right-[calc(-50%+28px)] top-6 sm:top-7 h-0.5 transition-all duration-1000 delay-300',
                    i < activeIdx
                      ? 'bg-primary-default shadow-[0_0_10px_rgba(var(--primary-default),0.5)]'
                      : 'bg-gray-100',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {proofUrl && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-primary-default rounded-full shadow-[0_0_12px_rgba(var(--primary-default),0.4)]" />
            <h3 className="text-base font-black text-foreground uppercase tracking-[0.2em]">
              {t('detail.paymentProof')}
            </h3>
          </div>

          <Card className="p-0 overflow-hidden border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-white rounded-[2.5rem]">
            <div className="grid grid-cols-1 md:grid-cols-12 h-full">
              {/* Image Preview Side */}
              <div
                className="md:col-span-5 relative group cursor-pointer overflow-hidden bg-gray-50 min-h-[280px]"
                onClick={() => setShowPreview(true)}
              >
                <Image
                  src={proofUrl}
                  alt={t('detail.paymentProof')}
                  width={400}
                  height={600}
                  className="w-full h-[400px] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary-default/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white p-4 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                    <Eye className="size-8 text-primary-default" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  <Badge className="bg-white/95 backdrop-blur-md text-foreground border-0 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 shadow-xl rounded-xl">
                    {t('detail.clickToPreview')}
                  </Badge>
                </div>
              </div>

              {/* Data Side */}
              <div className="md:col-span-7 p-8 sm:p-10 space-y-8 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Calendar className="size-3.5 text-primary-default/40" />
                      {t('detail.transferTime')}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {transaction.resultSnapshot?.date
                        ? moment(transaction.resultSnapshot.date).format('DD MMM YYYY')
                        : '-'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Wallet className="size-3.5 text-primary-default/40" />
                      {t('detail.detectedAmount')}
                    </p>
                    <p className="text-base font-black text-primary-default">
                      {transaction.resultSnapshot?.amount
                        ? currencyFormat(transaction.resultSnapshot.amount)
                        : '-'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                      <User className="size-3.5 text-primary-default/40" />
                      {t('detail.senderName')}
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {transaction.resultSnapshot?.fullName || '-'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                      <User className="size-3.5 text-primary-default/40" />
                      {t('detail.recipientName')}
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {transaction.resultSnapshot?.recipientName || '-'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                      <CreditCard className="size-3.5 text-primary-default/40" />
                      {t('detail.recipientAccount')}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {transaction.resultSnapshot?.recipientAccount || '-'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Landmark className="size-3.5 text-primary-default/40" />
                      {t('detail.bankName')}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {transaction.resultSnapshot?.bankName || '-'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-primary-default/40" />
                      {t('detail.transferStatusLabel')}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-black border-primary-default/20 text-primary-default bg-primary-default/5 px-2 py-0"
                    >
                      {transaction.resultSnapshot?.transferStatus || '-'}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] flex items-center gap-2">
                      <FileText className="size-3.5 text-primary-default/40" />
                      {t('detail.notes')}
                    </p>
                    <p className="text-sm font-bold text-foreground truncate max-w-[150px]">
                      {transaction.resultSnapshot?.notes || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <ImagePreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        imageSrc={proofUrl || ''}
        imageAlt={t('detail.paymentProof')}
        imageName={`${t('detail.paymentProof')} - ${transaction.id.split('-')[0].toUpperCase()}`}
      />
    </div>
  );
};
