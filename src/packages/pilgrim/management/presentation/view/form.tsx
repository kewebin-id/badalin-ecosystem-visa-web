'use client';

import { Button } from '@/components/atoms';
import { Skeleton } from '@/components/atoms/skeleton';
import { DatePicker, HeaderPageContent } from '@/components/molecules';
import { DialogDrawer } from '@/components/molecules/dialog-drawer';
import { InputFile, UploadFile } from '@/components/molecules/input/file';
import { InputSelect } from '@/components/molecules/input/select';
import { InputText } from '@/components/molecules/input/text';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider } from 'react-hook-form';
import { INusukCompatibility, RELATIONS, TRelation } from '../../domain/member';
import { DocumentUploadField } from '../components/document-upload-field';
import { TManagementForm, useManagementController, useManagementForm } from '../controller';

const FormSkeleton = () => (
  <div className="mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
    <Skeleton className="h-24 w-full rounded-3xl" />
    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-4">
      <Skeleton className="size-24 rounded-full" />
    </section>
    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <Skeleton className="h-4 w-32" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <Skeleton className="h-[200px] w-full rounded-2xl" />
      </div>
    </section>
    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <Skeleton className="h-4 w-32" />
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-2xl" />
        ))}
      </div>
    </section>
  </div>
);

export const MemberFormView = () => {
  const t = useTranslations('PilgrimManagement');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { useMemberDetail, useCreateMember, useUpdateMember, useProcessOcr } =
    useManagementController();
  const { data: detailRes, isPending: isLoadingDetail } = useMemberDetail(id);
  const createMutation = useCreateMember();
  const updateMutation = useUpdateMember();

  const [passportPreview, setPassportPreview] = useState<string>();
  const [ktpPreview, setKtpPreview] = useState<string>();
  const [selfiePreview, setSelfiePreview] = useState<string>();

  const initialData = detailRes?.data;
  const form = useManagementForm(initialData);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isValid },
    watch,
  } = form;

  const [nusukCompatibility, setNusukCompatibility] = useState<{
    passport?: INusukCompatibility;
    ktp?: INusukCompatibility;
  }>({});

  const [isWarningConfirmed, setIsWarningConfirmed] = useState<boolean>(false);
  const [rejectedDialogMessage, setRejectedDialogMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setPassportPreview(initialData.passportUrl);
      setKtpPreview(initialData.ktpUrl);
      setSelfiePreview(initialData.selfieUrl);

      reset({
        ...initialData,
        relation: initialData.relation as TRelation,
      });
    } else {
      setPassportPreview(undefined);
      setKtpPreview(undefined);
      setSelfiePreview(undefined);
      reset({
        fullName: '',
        passportNumber: '',
        passportExpiry: '',
        dob: '',
        nik: '',
        gender: 'Male',
        maritalStatus: '',
        relation: 'SELF',
        ocrConfidence: 0,
        selfieUrl: '',
        ktpUrl: '',
        passportUrl: '',
      });
    }
  }, [initialData, reset]);

  const [isAutoDetected, setIsAutoDetected] = useState<Record<string, boolean>>({});

  const ocrMutation = useProcessOcr((data) => {
    const fields = [];
    if (data.fullName) {
      setValue('fullName', data.fullName);
      fields.push('fullName');
    }
    if (data.passportNumber) {
      setValue('passportNumber', data.passportNumber);
      fields.push('passportNumber');
    }
    if (data.passportExpiry) {
      setValue('passportExpiry', data.passportExpiry);
      fields.push('passportExpiry');
    }
    if (data.dob) {
      setValue('dob', data.dob);
      fields.push('dob');
    }
    if (data.nik) {
      setValue('nik', data.nik);
      fields.push('nik');
    }
    if (data.relation) {
      setValue('relation', data?.relation as TRelation);
      fields.push('relation');
    }
    if (data.gender) {
      setValue('gender', data.gender as any);
      fields.push('gender');
    }
    if (data.maritalStatus) {
      setValue('maritalStatus', data.maritalStatus);
      fields.push('maritalStatus');
    }
    if (data.confidence) setValue('ocrConfidence', data.confidence);
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
        [ocrMutation.variables?.type === 'passport' ? 'passport' : 'ktp']: data.nusuk_compatibility,
      }));
      setIsWarningConfirmed(false);

      if (data.nusuk_compatibility.status === 'REJECTED') {
        setRejectedDialogMessage(data.nusuk_compatibility.message);
      }
    }

    const newAutoDetected = { ...isAutoDetected };
    fields.forEach((f) => (newAutoDetected[f] = true));
    setIsAutoDetected(newAutoDetected);
  });

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
    };

    if (id) {
      updateMutation.mutate({ id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const selfieValue = useMemo<UploadFile[]>(
    () => (selfiePreview ? [{ name: 'selfie.jpg', base64: selfiePreview }] : []),
    [selfiePreview],
  );
  const passportValue = useMemo<UploadFile[]>(
    () => (passportPreview ? [{ name: 'passport.jpg', base64: passportPreview }] : []),
    [passportPreview],
  );
  const ktpValue = useMemo<UploadFile[]>(
    () => (ktpPreview ? [{ name: 'ktp.jpg', base64: ktpPreview }] : []),
    [ktpPreview],
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

  if (id && isLoadingDetail) {
    return <FormSkeleton />;
  }

  return (
    <div className="mx-auto space-y-8 pb-20">
      <HeaderPageContent
        title={id ? t('editMember') : t('addMember')}
        subtitle={t('formSubtitle')}
        onBack={() => router.back()}
      />

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
                setValue('selfieUrl', file?.base64);
              }}
              capture="user"
              className="w-fit"
            />
          </section>

          {/* OCR Section */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
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
                  setValue('passportUrl', file?.base64);
                  if (rawFile) {
                    ocrMutation.mutate({ file: rawFile, type: 'passport' });
                  }
                }}
                onRetake={() => {
                  setPassportPreview(undefined);
                  setValue('passportUrl', '');
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
                  setValue('ktpUrl', file?.base64);
                  if (rawFile) {
                    ocrMutation.mutate({ file: rawFile, type: 'ktp' });
                  }
                }}
                onRetake={() => {
                  setKtpPreview(undefined);
                  setValue('ktpUrl', '');
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
                required
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

          <div className="flex justify-end gap-3 rounded-3xl border border-gray-100 shadow-sm p-6 bg-white">
            <Button variant="primaryOutline" type="button" onClick={() => router.back()}>
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={
                !isValid ||
                nusukCompatibility.passport?.status === 'REJECTED' ||
                nusukCompatibility.ktp?.status === 'REJECTED' ||
                (nusukCompatibility.passport?.status === 'WARNING' && !isWarningConfirmed) ||
                (nusukCompatibility.ktp?.status === 'WARNING' && !isWarningConfirmed)
              }
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            >
              {id ? t('saveChanges') : t('addMember')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
