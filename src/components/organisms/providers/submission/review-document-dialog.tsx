'use client';

import { DialogDrawer, InputTextarea } from '@/components/molecules';
import { ProviderSubmission } from '@/packages/provider/submissions/domain/entities';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface ReviewDocumentDialogProps {
  submission: ProviderSubmission | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rejectReason: string;
  setRejectReason: (val: string) => void;
  onReject: (id: string) => void;
  onVerify: (id: string) => void;
  renderPaymentBadge: (status: ProviderSubmission['paymentStatus']) => React.ReactNode;
  renderReviewBadge: (status: ProviderSubmission['reviewStatus']) => React.ReactNode;
}

export const ReviewDocumentDialog: FC<ReviewDocumentDialogProps> = ({
  submission,
  isOpen,
  onOpenChange,
  rejectReason,
  setRejectReason,
  onReject,
  onVerify,
  renderPaymentBadge,
  renderReviewBadge,
}) => {
  const t = useTranslations('ProviderSubmissions.dialogs.review');
  if (!submission) return null;

  return (
    <DialogDrawer
      open={isOpen}
      setOpen={(o) => {
        onOpenChange(o);
        if (!o) setRejectReason('');
      }}
      title={t('title', { id: submission.id })}
      description={t('description')}
      onSubmit={() => onVerify(submission.id)}
      submitButton={
        <>
          <CheckCircle2 className="h-4 w-4" />
          {t('verify')}
        </>
      }
      disabledSubmitButton={false}
      onCancel={() => onReject(submission.id)}
      cancelButton={
        <>
          <XCircle className="h-4 w-4" />
          {t('reject')}
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">{t('leader')}</p>
            <p className="font-medium">{submission.leaderName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('members')}</p>
            <p className="font-medium">
              {t('participantsCount', { count: submission.totalMembers })}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('reviewStatus')}</p>
            {renderReviewBadge(submission.reviewStatus)}
          </div>
          <div>
            <p className="text-muted-foreground">{t('payment')}</p>
            {renderPaymentBadge(submission.paymentStatus)}
          </div>
        </div>

        {submission.rejectionReason && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm">
            <p className="font-medium text-destructive mb-0.5">{t('previousRejection')}</p>
            <p className="text-foreground/80">{submission.rejectionReason}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <InputTextarea
            useLabelInside
            label={t('rejectionReasonLabel')}
            value={rejectReason}
            setValue={setRejectReason}
          />
        </div>
      </div>
    </DialogDrawer>
  );
};
