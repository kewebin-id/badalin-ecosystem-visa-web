'use client';

import { DialogDrawer } from '@/components/molecules';
import { UploadFile } from '@/components/molecules/input/file';
import { ISubmissionListItem } from '@/packages/provider/submissions/domain/response';
import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ConfirmVisaDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  submission: ISubmissionListItem;
  memberStatuses: Record<string, { valid: boolean; reason?: string }>;
  visaFiles: Record<string, UploadFile[]>;
  isSubmitting: boolean;
  isComplete: boolean;
  onFinalSubmit: () => void;
}

export const ConfirmVisaDialog = ({
  open,
  setOpen,
  submission,
  memberStatuses,
  visaFiles,
  isSubmitting,
  isComplete,
  onFinalSubmit,
}: ConfirmVisaDialogProps) => {
  const tq = useTranslations('ProviderSubmissions.quickReview');

  return (
    <DialogDrawer
      open={open}
      setOpen={setOpen}
      title={tq('confirmVisaTitle')}
      description={tq('confirmVisaDesc')}
      submitButton={tq('submitVisa')}
      disabledSubmitButton={!isComplete}
      submitting={isSubmitting}
      onSubmit={() => {
        setOpen(false);
        onFinalSubmit();
      }}
      onCancel={() => setOpen(false)}
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {tq('listMembers')}
          </span>
        </div>
        {(submission.members || [])
          .filter((m) => memberStatuses[m.id]?.valid)
          .map((m) => (
            <div key={m.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-black text-gray-900">{m.fullName}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {visaFiles[m.id]?.length > 0 ? (
                  visaFiles[m.id].map((file, idx) => (
                    <div
                      key={idx}
                      className="relative group size-12 rounded-lg border border-gray-200 overflow-hidden bg-white"
                    >
                      <img src={file.base64} alt={file.name} className="size-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="size-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-red-400 italic">{tq('noVisaFile')}</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </DialogDrawer>
  );
};
