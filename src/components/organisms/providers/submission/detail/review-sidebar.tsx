'use client';

import { Badge, Button, Card } from '@/components/atoms';
import { ISubmissionListItem } from '@/packages/provider/submissions/domain/response';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DetailReviewSidebarProps {
  submission: ISubmissionListItem;
  paymentAction: 'APPROVE' | 'REJECT' | null;
  memberStatuses: Record<string, { valid: boolean; reason?: string }>;
  logisticsValid: boolean | null;
  onFinalSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const DetailReviewSidebar = ({
  submission,
  paymentAction,
  memberStatuses,
  logisticsValid,
  onFinalSubmit,
  onCancel,
  isSubmitting,
}: DetailReviewSidebarProps) => {
  const t = useTranslations('ProviderSubmissions.detail');
  const ta = useTranslations('ProviderSubmissions.detail.actions');
  const ts = useTranslations('ProviderSubmissions.status');

  const validMembersCount = Object.values(memberStatuses).filter((s) => s.valid).length;
  const totalMembers = submission.members?.length || 0;

  return (
    <Card className="p-6 sticky top-6 border-2 border-gray-900 shadow-xl shadow-gray-100 h-fit">
      <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">
        {t('sections.allIn')}
      </h3>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <span className="text-sm font-medium text-gray-500">{t('table.payment')}</span>
          {paymentAction === 'APPROVE' ? (
            <Badge className="bg-green-500 text-white border-none">
              {ts('verified').toUpperCase()}
            </Badge>
          ) : paymentAction === 'REJECT' ? (
            <Badge className="bg-red-500 text-white border-none">
              {ts('rejected').toUpperCase()}
            </Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-400 border-none">
              {ts('pending').toUpperCase()}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <span className="text-sm font-medium text-gray-500">
            {t('table.members')} ({validMembersCount}/{totalMembers})
          </span>
          {validMembersCount === totalMembers ? (
            <Badge className="bg-green-500 text-white border-none">ALL VALID</Badge>
          ) : (
            <Badge className="bg-yellow-500 text-white border-none">INCOMPLETE</Badge>
          )}
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <span className="text-sm font-medium text-gray-500">{t('manifest.title')}</span>
          {logisticsValid === true ? (
            <Badge className="bg-green-500 text-white border-none">SESUAI</Badge>
          ) : logisticsValid === false ? (
            <Badge className="bg-red-500 text-white border-none">ANOMALI</Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-400 border-none">
              {ts('pending').toUpperCase()}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={onFinalSubmit} disabled={isSubmitting}>
          {ta('submit')}
        </Button>
        <Button variant="transparent" onClick={onCancel}>
          {ta('cancel')}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex gap-2">
          <Info className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed text-gray-400 font-medium">{ta('warning')}</p>
        </div>
      </div>
    </Card>
  );
};
