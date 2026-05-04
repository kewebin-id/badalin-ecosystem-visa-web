'use client';

import { DialogDrawer } from '@/components/molecules/dialog-drawer';
import { cn } from '@/shared/utils';
import { CheckCircle2, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PaymentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string | null;
}

export const PaymentStatusDialog = ({
  open,
  onOpenChange,
  message,
}: PaymentStatusDialogProps) => {
  const t = useTranslations('VisaTransaction.dialog');

  return (
    <DialogDrawer
      open={open}
      setOpen={onOpenChange}
      title={message ? t('successWithNoteTitle') : t('successTitle')}
      onSubmit={() => onOpenChange(false)}
      submitButton={t('okButton')}
      disabledSubmitButton={false}
    >
      <div className="flex flex-col items-center text-center p-4 space-y-4">
        <div
          className={cn(
            'size-20 rounded-full flex items-center justify-center shadow-lg',
            message
              ? 'bg-warning-500/10 text-warning-600'
              : 'bg-primary-default/10 text-primary-default',
          )}
        >
          {message ? (
            <FileText className="size-10" />
          ) : (
            <CheckCircle2 className="size-10" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground">
            {message ? t('attentionHeading') : t('checkingHeading')}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message ? t('successWithNoteDesc') : t('successDesc')}
          </p>
        </div>

        {message && (
          <div className="w-full bg-warning-500/5 border border-warning-200 rounded-2xl p-4 text-left">
            <p className="text-xs font-black text-warning-700 uppercase tracking-widest mb-1">
              {t('systemNote')}
            </p>
            <p className="text-sm font-medium text-warning-600 italic">
              "{message}"
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground font-medium pt-2">
          {t('footer')}
        </p>
      </div>
    </DialogDrawer>
  );
};
