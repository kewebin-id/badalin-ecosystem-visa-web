'use client';

import { Image, NotFoundComp } from '@/components/atoms';
import { DialogDrawer } from '@/components/molecules';
import { ProviderSubmission } from '@/packages/provider/submissions/domain/entities';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface VerifyPaymentDialogProps {
  submission: ProviderSubmission | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
  renderPaymentBadge: (status: ProviderSubmission['paymentStatus']) => React.ReactNode;
  formatCurrency: (amount: number) => string;
  submitting?: boolean;
}

export const VerifyPaymentDialog: FC<VerifyPaymentDialogProps> = ({
  submission,
  isOpen,
  onOpenChange,
  onConfirm,
  renderPaymentBadge,
  formatCurrency,
  submitting,
}) => {
  const t = useTranslations('ProviderSubmissions.dialogs.payment');
  if (!submission) return null;

  return (
    <DialogDrawer
      open={isOpen}
      setOpen={onOpenChange}
      title={t('title', { id: submission.id })}
      description={t('description')}
      onSubmit={
        submission.paymentStatus !== 'COMPLETED' ? () => onConfirm(submission.id) : undefined
      }
      submitButton={
        <>
          <CheckCircle2 className="h-4 w-4" />
          {t('markAsCompleted')}
        </>
      }
      disabledSubmitButton={submitting}
      submitting={submitting}
      onCancel={() => onOpenChange(false)}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">{t('leader')}</p>
            <p className="font-medium">{submission.leaderName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('amount')}</p>
            <p className="font-medium">{formatCurrency(submission.amount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('status')}</p>
            {renderPaymentBadge(submission.paymentStatus)}
          </div>
          <div>
            <p className="text-muted-foreground">{t('members')}</p>
            <p className="font-medium">
              {t('participantsCount', { count: submission.totalMembers })}
            </p>
          </div>
        </div>
        <div className="border rounded-xl overflow-hidden bg-muted/30 relative h-64">
          {submission.paymentProofUrl ? (
            <Image
              src={submission.paymentProofUrl}
              alt={t('proofAlt')}
              fill
              width={400}
              height={400}
              className="object-contain"
            />
          ) : (
            <NotFoundComp className="w-full h-full" label={t('noProof')} message="" />
          )}
        </div>
      </div>
    </DialogDrawer>
  );
};
