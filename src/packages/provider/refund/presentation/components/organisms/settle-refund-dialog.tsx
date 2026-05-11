'use client';

import { DialogDrawer } from '@/components/molecules';
import { InputFile, UploadFile } from '@/components/molecules/input/file';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRefundController } from '../../controller';

interface SettleRefundDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  submissionId: string;
  onSuccess?: () => void;
}

export const SettleRefundDialog = ({
  open,
  setOpen,
  submissionId,
  onSuccess,
}: SettleRefundDialogProps) => {
  const t = useTranslations('RefundManagement.dialog');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const { useSettleRefund } = useRefundController();
  const settleMutation = useSettleRefund();

  const handleSubmit = async () => {
    if (files.length === 0) return;

    settleMutation.mutate(
      { submissionId, file: files[0].base64 },
      {
        onSuccess: () => {
          setOpen(false);
          setFiles([]);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <DialogDrawer
      open={open}
      setOpen={setOpen}
      title={t('title')}
      submitButton={t('submit')}
      cancelButton={t('cancel')}
      onSubmit={handleSubmit}
      disabledSubmitButton={files.length === 0 || settleMutation.isPending}
      submitting={settleMutation.isPending}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">{t('description')}</p>
        <InputFile
          maxFiles={1}
          value={files}
          onChange={(newFiles) => setFiles(newFiles)}
          label={t('label')}
          required
          isDragDrop
          dropzoneText={t('dropzone')}
        />
      </div>
    </DialogDrawer>
  );
};
