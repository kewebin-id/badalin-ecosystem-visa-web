'use client';

import { Badge, Button, Card } from '@/components/atoms';
import { DialogDrawer } from '@/components/molecules';
import { UploadFile } from '@/components/molecules/input/file';
import { ISubmissionListItem } from '@/packages/provider/submissions/domain/response';
import { cn } from '@/shared/utils';
import { Info, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface DetailReviewSidebarProps {
  submission: ISubmissionListItem;
  paymentAction: 'APPROVE' | 'REJECT' | null;
  memberStatuses: Record<string, { valid: boolean; reason?: string }>;
  logisticsValid: boolean | null;
  onFinalSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isVisaPhase?: boolean;
  visaFiles?: Record<string, UploadFile[]>;
}

export const DetailReviewSidebar = ({
  submission,
  paymentAction,
  memberStatuses,
  logisticsValid,
  onFinalSubmit,
  onCancel,
  isSubmitting,
  isVisaPhase,
  visaFiles = {},
}: DetailReviewSidebarProps) => {
  const t = useTranslations('ProviderSubmissions.detail');
  const ta = useTranslations('ProviderSubmissions.detail.actions');
  const ts = useTranslations('ProviderSubmissions.status');
  const tq = useTranslations('ProviderSubmissions.quickReview');

  const [showConfirm, setShowConfirm] = useState(false);

  const validMembersCount = Object.values(memberStatuses).filter((s) => s.valid).length;
  const totalMembers = submission.members?.length || 0;
  const isAllMembersProcessed = Object.keys(memberStatuses).length === totalMembers;

  const uploadedMembersCount = Object.keys(visaFiles).length;
  const isAllVisasUploaded = uploadedMembersCount === totalMembers;

  const isComplete = isVisaPhase
    ? isAllVisasUploaded
    : paymentAction !== null && logisticsValid !== null && isAllMembersProcessed;

  return (
    <>
      <Card className="p-6 sticky top-6 border-2 border-gray-900 shadow-xl shadow-gray-100 h-fit">
        <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">
          {t('sections.allIn')}
        </h3>

        <div className="space-y-4 mb-8">
          {!isVisaPhase && (
            <>
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
            </>
          )}
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm font-medium text-gray-500">
              {t('table.members')} (
              {isVisaPhase ? uploadedMembersCount : validMembersCount}/{totalMembers})
            </span>
            {isVisaPhase ? (
              <Badge
                className={cn(
                  isAllVisasUploaded ? 'bg-green-500' : 'bg-yellow-500',
                  'text-white border-none',
                )}
              >
                {isAllVisasUploaded ? 'READY' : 'UPLOADING'}
              </Badge>
            ) : isAllMembersProcessed ? (
              <Badge
                className={cn(
                  validMembersCount === totalMembers ? 'bg-green-500' : 'bg-blue-500',
                  'text-white border-none',
                )}
              >
                {validMembersCount === totalMembers ? 'ALL VALID' : 'CHECKED'}
              </Badge>
            ) : (
              <Badge className="bg-yellow-500 text-white border-none">INCOMPLETE</Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => (isVisaPhase ? setShowConfirm(true) : onFinalSubmit())}
            disabled={isSubmitting || !isComplete}
          >
            {isVisaPhase ? tq('submitVisa') : ta('submit')}
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

      <DialogDrawer
        open={showConfirm}
        setOpen={setShowConfirm}
        title={tq('confirmVisaTitle')}
        description={tq('confirmVisaDesc')}
        submitButton={tq('submitVisa')}
        onSubmit={() => {
          setShowConfirm(false);
          onFinalSubmit();
        }}
        onCancel={() => setShowConfirm(false)}
      >
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              List Jamaah & File
            </span>
          </div>
          {submission.members?.map((m) => (
            <div key={m.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-black text-gray-900">{m.fullName}</p>
              <div className="mt-2 space-y-1">
                {visaFiles[m.id]?.length > 0 ? (
                  visaFiles[m.id].map((file, idx) => (
                    <p
                      key={idx}
                      className="text-[10px] text-green-600 font-bold flex items-center gap-1"
                    >
                      <div className="h-1 w-1 bg-green-500 rounded-full" />
                      {file.name}
                    </p>
                  ))
                ) : (
                  <p className="text-[10px] text-red-400 italic">Belum ada file visa</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogDrawer>
    </>
  );
};
