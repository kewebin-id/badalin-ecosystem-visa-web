'use client';

import { Button } from '@/components/atoms';
import { DialogDrawer } from '@/components/molecules';
import { ProviderSubmission } from '@/packages/provider/submissions/domain/entities';
import { ClipboardCheck, Eye, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface ActionMenuDrawerProps {
  submission: ProviderSubmission | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVerifyPayment: () => void;
  onReviewDocuments: () => void;
  onManifest: () => void;
}

export const ActionMenuDrawer: FC<ActionMenuDrawerProps> = ({
  submission,
  isOpen,
  onOpenChange,
  onVerifyPayment,
  onReviewDocuments,
  onManifest,
}) => {
  const t = useTranslations('ProviderSubmissions');

  if (!submission) return null;

  return (
    <DialogDrawer
      open={isOpen}
      setOpen={onOpenChange}
      title={t('table.action')}
      description={submission.leaderName}
      cancelButton={null}
    >
      <div className="space-y-3 pb-4">
        <Button
          className="w-full h-14 justify-start gap-4 rounded-2xl bg-primary-default text-white font-bold px-6 shadow-lg shadow-primary-100 cursor-pointer"
          onClick={onVerifyPayment}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
            <Eye className="h-5 w-5" />
          </div>
          {t('table.payment')}
        </Button>

        <Button
          className="w-full h-14 justify-start gap-4 rounded-2xl bg-success-default text-white font-bold px-6 shadow-lg shadow-success-100 cursor-pointer"
          onClick={onReviewDocuments}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          {t('table.review')}
        </Button>

        <Button
          className="w-full h-14 justify-start gap-4 rounded-2xl bg-gray-900 text-white font-bold px-6 shadow-lg shadow-gray-200 cursor-pointer"
          onClick={onManifest}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
            <MapPin className="h-5 w-5" />
          </div>
          Manifest & Logistics
        </Button>
      </div>
    </DialogDrawer>
  );
};
