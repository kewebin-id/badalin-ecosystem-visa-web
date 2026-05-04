'use client';

import { CountdownTimer } from '@/components/atoms';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { InputFile, UploadFile } from '@/components/molecules/input/file';
import { PAYMENT_STEPS } from '@/packages/pilgrim/transaction/domain/constant';
import { ITransaction } from '@/packages/pilgrim/transaction/domain/transaction';
import { currencyFormat } from '@/shared/utils';
import { ShieldCheck, Calendar, Wallet, User, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useState } from 'react';
import { ImagePreviewModal } from '@/components/molecules/image-preview-modal';
import moment from 'moment';
import { Image } from '@/components/atoms';
import { cn } from '@/shared/utils';

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
        <div className="bg-warning-500/5 rounded-3xl p-6 flex items-center gap-5 border border-warning-200">
          <div className="size-12 rounded-2xl bg-warning-500 flex items-center justify-center text-white shadow-lg shadow-warning-500/20 shrink-0">
            <ShieldCheck className="size-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">{t('detail.proofReceived')}</p>
            <p className="text-xs text-muted-foreground font-medium">
              {t('detail.checkingStatus')}
            </p>
          </div>
          <Badge className="bg-warning-500 text-white border-0 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider">
            {t('payment.Checking')}
          </Badge>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 py-4">
        {PAYMENT_STEPS.map((step, i) => {
          const activeIdx = PAYMENT_STEPS.findIndex((s) => s.key === transaction.paymentStatus);
          const isCompleted = i <= activeIdx;
          const StepIcon = step.icon;
          return (
            <div
              key={step.key}
              className="flex items-center flex-1 last:flex-initial relative max-w-[120px]"
            >
              <div className="flex flex-col items-center z-10 w-full text-center">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-primary-default text-white shadow-lg shadow-primary-500/30' : 'bg-muted text-muted-foreground'}`}
                >
                  <StepIcon className="size-6" strokeWidth={1.5} />
                </div>
                <span
                  className={`text-[9px] font-black mt-3 uppercase tracking-wider leading-tight ${isCompleted ? 'text-primary-default' : 'text-muted-foreground opacity-50'}`}
                >
                  {t(`payment.${step.key}`)}
                </span>
              </div>
              {i < PAYMENT_STEPS.length - 1 && (
                <div
                  className={`absolute left-[calc(50%+24px)] right-[calc(-50%+24px)] top-6 h-0.5 transition-all duration-500 ${i < activeIdx ? 'bg-primary-default' : 'bg-muted'}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {proofUrl && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-primary-default rounded-full" />
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
              Bukti Transfer
            </h3>
          </div>

          <Card className="p-0 overflow-hidden border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem]">
            <div className="grid grid-cols-1 md:grid-cols-5 h-full">
              {/* Image Preview Side */}
              <div 
                className="md:col-span-2 relative group cursor-pointer overflow-hidden bg-gray-100 min-h-[200px]"
                onClick={() => setShowPreview(true)}
              >
                <Image
                  src={proofUrl}
                  alt="Bukti Transfer"
                  width={400}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
                    <Eye className="size-6 text-white" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur-sm text-foreground border-0 text-[10px] font-black uppercase tracking-widest px-3">
                    Klik untuk Preview
                  </Badge>
                </div>
              </div>

              {/* Data Side */}
              <div className="md:col-span-3 p-6 space-y-5 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      Waktu Transfer
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {transaction.resultSnapshot?.date 
                        ? moment(transaction.resultSnapshot.date).format('DD MMM YYYY') 
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      Waktu Upload
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {moment(transaction.updatedAt || transaction.createdAt).format('DD MMM YYYY, HH:mm')}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Wallet className="size-3" />
                      Nominal Terdeteksi
                    </p>
                    <p className="text-sm font-bold text-primary-default">
                      {transaction.resultSnapshot?.amount 
                        ? currencyFormat(transaction.resultSnapshot.amount) 
                        : '-'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <User className="size-3" />
                      Nama Pengirim
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {transaction.resultSnapshot?.fullName || '-'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50">
                  <div className="bg-gray-50/50 rounded-2xl p-3 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-muted-foreground">Status Pengecekan</p>
                    <Badge className={cn(
                      "text-[10px] font-black uppercase tracking-widest border-0",
                      transaction.paymentStatus === 'COMPLETED' ? "bg-primary-default text-white" : "bg-warning-500 text-white"
                    )}>
                      {transaction.paymentStatus}
                    </Badge>
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
        imageAlt="Bukti Transfer"
        imageName={`Bukti Transfer - ${transaction.id.split('-')[0].toUpperCase()}`}
      />
    </div>
  );
};
