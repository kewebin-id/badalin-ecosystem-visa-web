'use client';

import { Button, Image } from '@/components/atoms';
import { DialogDrawer } from '@/components/molecules/dialog-drawer';
import { ImagePreviewModal } from '@/components/molecules/image-preview-modal';
import { InputFile, UploadFile } from '@/components/molecules/input/file';
import { cn } from '@/shared/utils/merge-class';
import { Eye, FileText, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { INusukCompatibility } from '../../domain/member';
import { GuideBlock, NusukIndicator } from './nusuk-indicator';

interface DocumentUploadFieldProps {
  label: string;
  type: 'passport' | 'ktp';
  value?: string;
  onChange: (files: UploadFile[], rawFiles?: File[]) => void;
  onRetake: () => void;
  compatibility?: INusukCompatibility;
  isReadingOcr?: boolean;
  isWarningConfirmed: boolean;
  onWarningConfirm: (confirmed: boolean) => void;
  disabled?: boolean;
}

export const DocumentUploadField = ({
  label,
  type,
  value,
  onChange,
  onRetake,
  compatibility,
  isReadingOcr,
  isWarningConfirmed,
  onWarningConfirm,
  disabled,
}: DocumentUploadFieldProps) => {
  const tNusuk = useTranslations('PilgrimManagement.nusuk');

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isExampleOpen, setIsExampleOpen] = useState<boolean>(false);

  const passportValue: UploadFile[] = value ? [{ name: `${type}.jpg`, base64: value }] : [];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground pl-1">
        {label}
      </label>

      <div
        className={cn(
          'relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all group',
          value
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 bg-gray-50 hover:border-primary-default/20 hover:bg-primary-default/5 cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        onClick={() => !value && !disabled && setIsDrawerOpen(true)}
      >
        {value ? (
          <>
            <Image height={100} width={200} src={value} alt={label} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="primaryOutline"
                size="sm"
                className="h-8 rounded-full"
                onClick={() => setIsPreviewOpen(true)}
              >
                <Eye className="size-3.5 mr-1.5" />
                {tNusuk('preview')}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="h-8 rounded-full"
                onClick={() => setIsDrawerOpen(true)}
                disabled={disabled}
              >
                <Plus className="size-3.5 mr-1.5" />
                {tNusuk('change')}
              </Button>
            </div>
          </>
        ) : (
          <Button
            type="button"
            variant="transparent"
            className="flex flex-col items-center gap-2 h-auto w-full py-8 text-muted-foreground hover:text-primary-default"
            onClick={() => setIsDrawerOpen(true)}
            disabled={disabled}
          >
            <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-primary-default/10 transition-colors">
              <Plus className="size-5" />
            </div>
            <span className="text-sm font-medium">{tNusuk('clickToUpload', { label })}</span>
          </Button>
        )}
      </div>

      <NusukIndicator
        compatibility={compatibility}
        isWarningConfirmed={isWarningConfirmed}
        onWarningConfirm={onWarningConfirm}
        onRetake={onRetake}
        variant="compact"
      />

      <DialogDrawer
        open={isDrawerOpen}
        setOpen={setIsDrawerOpen}
        title={tNusuk('uploadTitle', { label })}
        onSubmit={() => setIsDrawerOpen(false)}
        submitButton={tNusuk('done')}
        disabledSubmitButton={false}
      >
        <div className="space-y-6 pb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-primary-default/5 p-3 rounded-xl border border-primary-default/10">
              <div className="flex items-center gap-2 text-primary-default w-full">
                <FileText className="size-4" />
                <span className="text-sm font-bold">{tNusuk('documentConditions')}</span>
              </div>
              <p
                className="text-primary-default text-xs font-bold underline hover:no-underline px-0 h-auto cursor-pointer text-nowrap"
                onClick={() => setIsExampleOpen(true)}
              >
                {tNusuk('viewExample')}
              </p>
            </div>
            <GuideBlock hideExample />
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-3">
            <p className="text-sm font-bold">{tNusuk('selectOrDrag')}</p>
            <InputFile
              allowedTypes={['.png', '.jpeg', '.jpg', '.webp']}
              label=""
              maxFiles={1}
              isDragDrop
              value={passportValue}
              onChange={(files, rawFiles) => {
                onChange(files, rawFiles);
              }}
              disabled={isReadingOcr}
              isReadingOcr={isReadingOcr}
              isTouched={true}
              className="border-none p-0"
            />
          </div>
        </div>
      </DialogDrawer>

      {value && (
        <ImagePreviewModal
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          imageSrc={value}
          imageAlt={label}
          imageName={`${type}-preview.jpg`}
        />
      )}

      {process.env.NEXT_PUBLIC_DUMMY_PASSPORT_URL && (
        <ImagePreviewModal
          open={isExampleOpen}
          onOpenChange={setIsExampleOpen}
          imageSrc={process.env.NEXT_PUBLIC_DUMMY_PASSPORT_URL}
          imageAlt="Example Passport"
          imageName="example-passport.jpg"
        />
      )}
    </div>
  );
};
