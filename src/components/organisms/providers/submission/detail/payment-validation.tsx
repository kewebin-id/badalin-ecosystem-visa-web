'use client';

import { Card, Image } from '@/components/atoms';
import { InputTextarea } from '@/components/molecules';
import { ISubmissionListItem } from '@/packages/provider/submissions/domain/response';
import { cn, currencyFormat } from '@/shared/utils';
import { CheckCircle2, Info, ZoomIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ValidationToggle } from './validation-toggle';

interface DetailPaymentValidationProps {
  submission: ISubmissionListItem;
  paymentAction: 'APPROVE' | 'REJECT' | null;
  setPaymentAction: (action: 'APPROVE' | 'REJECT' | null) => void;
  paymentReason: string;
  setPaymentReason: (reason: string) => void;
  onPreview: (image: { src: string; alt: string } | null) => void;
}

export const DetailPaymentValidation = ({
  submission,
  paymentAction,
  setPaymentAction,
  paymentReason,
  setPaymentReason,
  onPreview,
}: DetailPaymentValidationProps) => {
  const t = useTranslations('ProviderSubmissions.detail.payment');
  const ts = useTranslations('ProviderSubmissions.detail.sections');

  return (
    <Card className="overflow-hidden border-2 border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-xl">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">1. {ts('payment')}</h3>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div
            className="group relative h-64 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 cursor-zoom-in"
            onClick={() =>
              onPreview({
                src: submission.proofOfPayment || '',
                alt: 'Bukti Transfer',
              })
            }
          >
            {submission.proofOfPayment ? (
              <>
                <Image
                  height={400}
                  width={400}
                  src={submission.proofOfPayment}
                  alt="Bukti Transfer"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg">
                    <ZoomIn className="h-5 w-5 text-gray-900" />
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 font-medium">
                {t('noProof')}
              </div>
            )}
          </div>
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {t('ocrResult')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-500">{t('nominal')}:</p>
              <p className="font-bold text-gray-900">{currencyFormat(submission.totalAmount)}</p>
              <p className="text-gray-500">{t('ocrStatus')}:</p>
              <p className="font-bold text-green-600">{t('successRead')}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <ValidationToggle
            isValid={paymentAction === 'APPROVE' ? true : paymentAction === 'REJECT' ? false : null}
            onToggle={(valid) => setPaymentAction(valid ? 'APPROVE' : 'REJECT')}
            labels={{
              valid: t('approve'),
              invalid: t('reject'),
            }}
          />
          <InputTextarea
            useLabelInside
            label={t('reasonLabel')}
            placeholder={t('reasonPlaceholder')}
            value={paymentReason}
            setValue={setPaymentReason}
            disabled={paymentAction !== 'REJECT'}
            className={cn(paymentAction === 'REJECT' ? 'border-red-200' : '')}
          />
        </div>
      </div>
    </Card>
  );
};
