'use client';

import { Button } from '@/components/atoms';
import { DatePicker } from '@/components/molecules';
import { DialogDrawer } from '@/components/molecules/dialog-drawer';
import { InputFile, UploadFile } from '@/components/molecules/input/file';
import { InputSelect } from '@/components/molecules/input/select';
import { InputText } from '@/components/molecules/input/text';
import { DocumentUploadField } from '@/components/organisms/pilgrim-management/document-upload-field';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider } from 'react-hook-form';
import { INusukCompatibility, RELATIONS, TRelation } from '../../domain/member';
import { TManagementForm } from '../../domain/request';
import { useManagementController, useManagementForm } from '../controller';
import { Loader2 } from 'lucide-react';

export const PilgrimCreateForm = () => {
  const t = useTranslations('PilgrimManagement');
  const tCommon = useTranslations('Common');
  const router = useRouter();

  const { useCreateMember, useProcessOcr } = useManagementController();
  const createMutation = useCreateMember();

  const [passportPreview, setPassportPreview] = useState<string>();
  const [ktpPreview, setKtpPreview] = useState<string>();
  const [selfiePreview, setSelfiePreview] = useState<string>();
  const [employmentCertificatePreview, setEmploymentCertificatePreview] = useState<string>();

  const form = useManagementForm(undefined, { mode: 'onChange' });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = form;

  const [nusukCompatibility, setNusukCompatibility] = useState<{
    passport?: INusukCompatibility;
    ktp?: INusukCompatibility;
  }>({});

  const [isWarningConfirmed, setIsWarningConfirmed] = useState<boolean>(false);
  const [rejectedDialogMessage, setRejectedDialogMessage] = useState<string | null>(null);
  const [isAutoDetected, setIsAutoDetected] = useState<Record<string, boolean>>({});

  const ocrMutation = useProcessOcr(
    (data) => {
      const fields = [];
      if (data.fullName) {
        setValue('fullName', data.fullName, { shouldDirty: true, shouldValidate: true });
        fields.push('fullName');
      }
      if (data.passportNumber) {
        setValue('passportNumber', data.passportNumber, {
          shouldDirty: true,
          shouldValidate: true,
        });
        fields.push('passportNumber');
      }
      if (data.passportExpiry) {
        const formattedExpiry = dayjs(data.passportExpiry).isValid()
          ? dayjs(data.passportExpiry).format('YYYY-MM-DD')
          : data.passportExpiry;
        setValue('passportExpiry', formattedExpiry, { shouldDirty: true, shouldValidate: true });
        fields.push('passportExpiry');
      }
      if (data.dob) {
        const formattedDob = dayjs(data.dob).isValid()
          ? dayjs(data.dob).format('YYYY-MM-DD')
          : data.dob;
        setValue('dob', formattedDob, { shouldDirty: true, shouldValidate: true });
        fields.push('dob');
      }
      if (data.nik) {
        setValue('nik', data.nik, { shouldDirty: true, shouldValidate: true });
        fields.push('nik');
      }
      if (data.relation) {
        setValue('relation', data?.relation as TRelation, {
          shouldDirty: true,
          shouldValidate: true,
        });
        fields.push('relation');
      }
      if (data.gender) {
        setValue('gender', data.gender as 'Male' | 'Female', {
          shouldDirty: true,
          shouldValidate: true,
        });
        fields.push('gender');
      }
      if (data.maritalStatus) {
        setValue('maritalStatus', data.maritalStatus, { shouldDirty: true, shouldValidate: true });
        fields.push('maritalStatus');
      }
      if (data.confidence)
        setValue('ocrConfidence', data.confidence, { shouldDirty: true, shouldValidate: true });
      if (data.publicUrl) {
        if (ocrMutation.variables?.type === 'passport') {
          setValue('passportUrl', data.publicUrl);
          setPassportPreview(data.publicUrl);
        } else {
          setValue('ktpUrl', data.publicUrl);
          setKtpPreview(data.publicUrl);
        }
      }

      if (data.nusuk_compatibility) {
        setNusukCompatibility((prev) => ({
          ...prev,
          [ocrMutation.variables?.type === 'passport' ? 'passport' : 'ktp']:
            data.nusuk_compatibility,
        }));
        setIsWarningConfirmed(false);

        if (data.nusuk_compatibility.status === 'REJECTED') {
          setRejectedDialogMessage(data.nusuk_compatibility.message);
        }
      }

      const newAutoDetected = { ...isAutoDetected };
      fields.forEach((f) => (newAutoDetected[f] = true));
      setIsAutoDetected(newAutoDetected);
    },
    (type) => {
      if (type === 'passport') {
        setPassportPreview(undefined);
        setValue('passportUrl', '');
        setNusukCompatibility((prev) => ({ ...prev, passport: undefined }));
      } else {
        setKtpPreview(undefined);
        setValue('ktpUrl', '');
        setNusukCompatibility((prev) => ({ ...prev, ktp: undefined }));
      }
    },
  );

  useEffect(() => {
    const subscription = form.watch((_, { name, type }) => {
      if (type === 'change' && name && isAutoDetected[name]) {
        setIsAutoDetected((prev) => {
          const newState = { ...prev };
          delete newState[name];
          return newState;
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isAutoDetected]);

  const onSubmit = (data: TManagementForm) => {
    const payload = {
      ...data,
      passportUrl: data.passportUrl || passportPreview,
      ktpUrl: data.ktpUrl || ktpPreview,
      selfieUrl: data.selfieUrl || selfiePreview,
      employmentCertificateUrl: data.employmentCertificateUrl || employmentCertificatePreview,
    };
    createMutation.mutate(payload);
  };

  const selfieValue = useMemo<UploadFile[]>(
    () => (selfiePreview ? [{ name: 'selfie.jpg', base64: selfiePreview }] : []),
    [selfiePreview],
  );

  const genderOptions = useMemo(
    () => [
      { label: t('male'), value: 'Male' },
      { label: t('female'), value: 'Female' },
    ],
    [t],
  );

  const relationOptions = useMemo(
    () =>
      RELATIONS.map((r) => ({
        label: t(`relations.${r}`),
        value: r,
      })),
    [t],
  );

  const maritalStatusOptions = useMemo(
    () => [
      { label: t('maritalStatuses.Single'), value: 'Single' },
      { label: t('maritalStatuses.Married'), value: 'Married' },
      { label: t('maritalStatuses.Divorced'), value: 'Divorced' },
      { label: t('maritalStatuses.Widowed'), value: 'Widowed' },
    ],
    [t],
  );

  return (
    <div className="space-y-8 relative">
      {ocrMutation.isPending && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-5 bg-white p-8 rounded-3xl shadow-xl max-w-sm text-center border border-gray-100 mx-4">
            <Loader2 className="size-10 text-primary-default animate-spin" />
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-base font-extrabold text-gray-900 leading-tight">
                {t('ocrLoadingTitle')}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                {t('ocrLoadingSubtitle')}
              </p>
            </div>
          </div>
        </div>
      )}
      <DialogDrawer
        open={!!rejectedDialogMessage}
        setOpen={(open) => !open && setRejectedDialogMessage(null)}
        title={t('nusuk.validationFailed')}
        description={rejectedDialogMessage || ''}
        onSubmit={() => setRejectedDialogMessage(null)}
        submitButton={t('nusuk.iUnderstand')}
      >
        <div className="text-sm text-gray-700">
          {t('nusuk.validationDesc')}
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>{t('nusuk.validationList1')}</li>
            <li>{t('nusuk.validationList2')}</li>
            <li>{t('nusuk.validationList3')}</li>
            <li>{t('nusuk.validationList4')}</li>
          </ul>
        </div>
      </DialogDrawer>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Selfie Section */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-4">
            <InputFile
              label={t('photoSection')}
              maxFiles={1}
              value={selfieValue}
              onChange={(files) => {
                const file = files[0];
                setSelfiePreview(file?.base64);
                setValue('selfieUrl', file?.base64 || '', {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              capture="user"
              className="w-fit"
            />
          </section>

          {/* OCR Section */}
          <section
            id="tour-pilgrim-ocr"
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t('documentSection')}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <DocumentUploadField
                label={t('passportPhoto')}
                type="passport"
                value={passportPreview}
                onChange={(files, rawFiles) => {
                  const file = files[0];
                  const rawFile = rawFiles?.[0];
                  setPassportPreview(file?.base64);
                  setValue('passportUrl', file?.base64 || '', {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  if (rawFile) {
                    ocrMutation.mutate({ file: rawFile, type: 'passport' });
                  }
                }}
                onRetake={() => {
                  setPassportPreview(undefined);
                  setValue('passportUrl', '', { shouldValidate: true, shouldDirty: true });
                  setNusukCompatibility((prev) => ({ ...prev, passport: undefined }));
                }}
                compatibility={nusukCompatibility.passport}
                isReadingOcr={ocrMutation.isPending && ocrMutation.variables?.type === 'passport'}
                isWarningConfirmed={isWarningConfirmed}
                onWarningConfirm={setIsWarningConfirmed}
                disabled={ocrMutation.isPending && ocrMutation.variables?.type === 'passport'}
              />
              <DocumentUploadField
                label={t('ktpPhoto')}
                type="ktp"
                value={ktpPreview}
                onChange={(files, rawFiles) => {
                  const file = files[0];
                  const rawFile = rawFiles?.[0];
                  setKtpPreview(file?.base64);
                  setValue('ktpUrl', file?.base64 || '', {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  if (rawFile) {
                    ocrMutation.mutate({ file: rawFile, type: 'ktp' });
                  }
                }}
                onRetake={() => {
                  setKtpPreview(undefined);
                  setValue('ktpUrl', '', { shouldValidate: true, shouldDirty: true });
                  setNusukCompatibility((prev) => ({ ...prev, ktp: undefined }));
                }}
                compatibility={nusukCompatibility.ktp}
                isReadingOcr={ocrMutation.isPending && ocrMutation.variables?.type === 'ktp'}
                isWarningConfirmed={isWarningConfirmed}
                onWarningConfirm={setIsWarningConfirmed}
                disabled={ocrMutation.isPending && ocrMutation.variables?.type === 'ktp'}
              />
            </div>
          </section>

          {/* Identity Section */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t('identitySection')}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <InputText
                useLabelInside
                size="lg"
                type="text"
                label={t('fullName')}
                placeholder={t('namePlaceholder')}
                register={register}
                name="fullName"
                required
                errorMessage={errors.fullName?.message}
                isAutoDetected={isAutoDetected['fullName']}
                confidence={isAutoDetected['fullName'] ? form.watch('ocrConfidence') : undefined}
              />
              <InputText
                useLabelInside
                size="lg"
                type="text"
                label={t('passportNumber')}
                placeholder={t('passportPlaceholder')}
                register={register}
                name="passportNumber"
                required
                errorMessage={errors.passportNumber?.message}
                isAutoDetected={isAutoDetected['passportNumber']}
                confidence={
                  isAutoDetected['passportNumber'] ? form.watch('ocrConfidence') : undefined
                }
              />
              <Controller
                name="passportExpiry"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    useLabelInside
                    size="lg"
                    label={t('passportExpiry')}
                    value={field.value}
                    onChange={field.onChange}
                    required
                    errorMessage={errors.passportExpiry?.message}
                    isAutoDetected={isAutoDetected['passportExpiry']}
                    confidence={
                      isAutoDetected['passportExpiry'] ? form.watch('ocrConfidence') : undefined
                    }
                  />
                )}
              />
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    useLabelInside
                    size="lg"
                    label={t('birthDate')}
                    value={field.value}
                    onChange={field.onChange}
                    required
                    errorMessage={errors.dob?.message}
                    isAutoDetected={isAutoDetected['dob']}
                    confidence={isAutoDetected['dob'] ? form.watch('ocrConfidence') : undefined}
                  />
                )}
              />
              <InputText
                useLabelInside
                size="lg"
                type="text"
                label={t('nikLabel')}
                placeholder={t('nikPlaceholder')}
                register={register}
                name="nik"
                required={!form.watch('dob') || dayjs().diff(dayjs(form.watch('dob')), 'year') >= 17}
                errorMessage={errors.nik?.message}
                isAutoDetected={isAutoDetected['nik']}
                confidence={isAutoDetected['nik'] ? form.watch('ocrConfidence') : undefined}
              />
              <InputSelect
                useLabelInside
                size="lg"
                label={t('gender')}
                placeholder={t('genderPlaceholder')}
                register={register}
                name="gender"
                options={genderOptions}
                required
                errorMessage={errors.gender?.message}
                isAutoDetected={isAutoDetected['gender']}
                confidence={isAutoDetected['gender'] ? form.watch('ocrConfidence') : undefined}
              />
              <InputSelect
                useLabelInside
                size="lg"
                label={t('maritalStatus')}
                placeholder={t('maritalStatusPlaceholder')}
                register={register}
                name="maritalStatus"
                options={maritalStatusOptions}
                required
                errorMessage={errors.maritalStatus?.message}
                isAutoDetected={isAutoDetected['maritalStatus']}
                confidence={
                  isAutoDetected['maritalStatus'] ? form.watch('ocrConfidence') : undefined
                }
              />
              <InputSelect
                useLabelInside
                size="lg"
                label={t('relation')}
                placeholder={t('relationPlaceholder')}
                register={register}
                name="relation"
                options={relationOptions}
                required
                errorMessage={errors.relation?.message}
              />
            </div>
          </section>

          {/* Employment Certificate Section */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t('additionalDocumentOptional')}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <InputFile
                label={t('employmentCertificate')}
                maxFiles={1}
                allowedTypes={['.png', '.jpeg', '.jpg', '.pdf']}
                value={
                  employmentCertificatePreview
                    ? [
                        {
                          name: 'employment-certificate',
                          base64: employmentCertificatePreview,
                        },
                      ]
                    : []
                }
                onChange={(files) => {
                  const file = files[0];
                  setEmploymentCertificatePreview(file?.base64);
                  setValue('employmentCertificateUrl', file?.base64 || '', {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
            </div>
          </section>

          <div className="flex justify-end gap-3 rounded-3xl border border-gray-100 shadow-sm p-6 bg-white">
            <Button variant="primaryOutline" type="button" onClick={() => router.back()}>
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              isSubmitting={createMutation.isPending}
            >
              {t('addMember')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
