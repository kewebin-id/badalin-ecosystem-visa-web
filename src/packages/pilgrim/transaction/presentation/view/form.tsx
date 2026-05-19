'use client';

import { Card } from '@/components/atoms';
import { Skeleton } from '@/components/atoms/skeleton';
import { HeaderPageContent, LoadingOverlay } from '@/components/molecules';
import {
  LogisticsForm,
  SelectMembersForm,
  SummaryForm,
  TransportRawdahForm,
} from '@/components/organisms';
import { useManagementController } from '@/packages/pilgrim/management/presentation/controller';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { TWizardForm, useTransactionController, useTransactionForm } from '../controller';
import { TransactionErrorDrawer } from './components/error-drawer';
import { TransactionFormFooter } from './components/form-footer';

const FormSkeleton = () => (
  <div className="mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
    <Skeleton className="h-24 w-full rounded-3xl" />
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="flex-1 h-1.5 rounded-full" />
      ))}
    </div>
    <Skeleton className="h-[400px] w-full rounded-3xl" />
    <Skeleton className="h-24 w-full rounded-3xl" />
  </div>
);

export const TransactionFormView = () => {
  const t = useTranslations('VisaTransaction');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const stepTitles = [
    t('stepTitles.selectMembers'),
    t('stepTitles.logistics'),
    t('stepTitles.transport'),
    t('stepTitles.summary'),
  ];

  const [step, setStep] = useState<number>(0);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [apiWarnings, setApiWarnings] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('IDR');
  const [breakdown, setBreakdown] = useState<string>('');

  const { useCreateTransaction, useUpdateTransaction, useTransactionDetail, usePreviewSubmission } =
    useTransactionController();
  const previewMutation = usePreviewSubmission();

  const { useMembers } = useManagementController();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const { data: detailRes, isLoading: isLoadingDetail } = useTransactionDetail(id);
  const { members } = useMembers({ page: 1, limit: 100 });
  const completeMembers = useMemo(() => members?.filter((m) => m.isComplete) || [], [members]);

  const form = useTransactionForm(detailRes?.data);
  const {
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (detailRes?.data) {
    } else if (!id) {
      reset({
        pilgrimIds: [],
        departureFlightNo: '',
        departureCarrier: '',
        departureFlightDate: '',
        departureFlightEta: '',
        departureFlightEtd: '',
        returnFlightNo: '',
        returnCarrier: '',
        returnFlightDate: '',
        returnFlightEta: '',
        returnFlightEtd: '',
        hotelMakkahName: '',
        hotelMakkahResvNo: '',
        hotelMakkahCheckIn: '',
        hotelMakkahCheckOut: '',
        hotelMadinahName: '',
        hotelMadinahResvNo: '',
        hotelMadinahCheckIn: '',
        hotelMadinahCheckOut: '',
        hotelMakkahRoomType: '',
        hotelMadinahRoomType: '',
        transportations: [],
        rawdahMenTime: '',
        rawdahWomenTime: '',
        notes: '',
        departureTicketUrls: [],
        returnTicketUrls: [],
        hotelMakkahVoucherUrls: [],
        hotelMadinahVoucherUrls: [],
        ocrConfidence: 0,
      });
    }
  }, [detailRes?.data, id, reset]);

  const getStepFields = (s: number): (keyof TWizardForm)[] => {
    if (s === 0) return ['pilgrimIds'];
    if (s === 1)
      return [
        'departureFlightNo',
        'departureCarrier',
        'departureFlightEta',
        'departureFlightEtd',
        'returnFlightNo',
        'returnCarrier',
        'returnFlightEta',
        'returnFlightEtd',
        'hotelMakkahName',
        'hotelMakkahResvNo',
        'hotelMakkahCheckIn',
        'hotelMakkahCheckOut',
        'hotelMakkahRoomType',
        'hotelMadinahName',
        'hotelMadinahResvNo',
        'hotelMadinahCheckIn',
        'hotelMadinahCheckOut',
        'hotelMadinahRoomType',
        'departureTicketUrls',
        'returnTicketUrls',
        'hotelMakkahVoucherUrls',
        'hotelMadinahVoucherUrls',
      ];
    if (s === 2) return ['transportations', 'rawdahMenTime', 'rawdahWomenTime'];
    return [];
  };

  const onSubmit = (form: TWizardForm) => {
    if (id) {
      updateMutation.mutate({ id, form });
    } else {
      createMutation.mutate(form);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.keys(errors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [errors]);

  const mapBackendPathToFrontend = useCallback((path: string) => {
    if (path.startsWith('flights.0.')) {
      const field = path.replace('flights.0.', '');
      if (field === 'flightNo') return 'departureFlightNo';
      if (field === 'etd') return 'departureFlightEtd';
      if (field === 'eta') return 'departureFlightEta';
    }
    if (path.startsWith('flights.1.')) {
      const field = path.replace('flights.1.', '');
      if (field === 'flightNo') return 'returnFlightNo';
      if (field === 'etd') return 'returnFlightEtd';
      if (field === 'eta') return 'returnFlightEta';
    }
    if (path.startsWith('hotels.0.')) {
      const field = path.replace('hotels.0.', '');
      if (field === 'name') return 'hotelMakkahName';
      if (field === 'resvNo') return 'hotelMakkahResvNo';
      if (field === 'checkIn') return 'hotelMakkahCheckIn';
      if (field === 'checkOut') return 'hotelMakkahCheckOut';
      if (field === 'roomType') return 'hotelMakkahRoomType';
    }
    if (path.startsWith('hotels.1.')) {
      const field = path.replace('hotels.1.', '');
      if (field === 'name') return 'hotelMadinahName';
      if (field === 'resvNo') return 'hotelMadinahResvNo';
      if (field === 'checkIn') return 'hotelMadinahCheckIn';
      if (field === 'checkOut') return 'hotelMadinahCheckOut';
      if (field === 'roomType') return 'hotelMadinahRoomType';
    }
    return path;
  }, []);

  const handleValidateSubmission = useCallback(async () => {
    if (previewMutation.isPending || isValidated) return;

    try {
      setApiErrors([]);
      setApiWarnings([]);
      form.clearErrors();

      const values = form.getValues() as TWizardForm;
      const res = await previewMutation.mutateAsync(values);

      if (res.data?.totalAmount !== undefined) {
        setTotalAmount(res.data.totalAmount);
        setCurrency((res.data as unknown as { currency?: string }).currency || 'IDR');
        setBreakdown(res.data.breakdown || '');
      }

      if (res.data?.isValid) {
        setIsValidated(true);
        setApiErrors([]);
        setApiWarnings(res.data.warnings || []);
      } else {
        const errors = res.data?.errors || [];
        const systemErrors: string[] = [];
        errors.forEach((err) => {
          if (err.path === 'agencySlug' || err.path === 'pilgrimIds') {
            systemErrors.push(err.message);
          } else {
            const mappedPath = mapBackendPathToFrontend(err.path) as keyof TWizardForm;
            form.setError(mappedPath, { type: 'server', message: err.message });
          }
        });
        const displayMessage =
          res.message?.includes('Cannot POST') || res.message?.includes('404')
            ? 'The submission preview service is currently unavailable. Please contact support.'
            : res.message || 'Validation failed';

        setApiErrors(
          systemErrors.length > 0 ? systemErrors : errors.length === 0 ? [displayMessage] : [],
        );
        setApiWarnings(res.data?.warnings || []);
        setShowErrorModal(true);
      }
    } catch {}
  }, [
    form,
    previewMutation.mutateAsync,
    isValidated,
    mapBackendPathToFrontend,
    setTotalAmount,
    setBreakdown,
    setIsValidated,
    setApiErrors,
    setApiWarnings,
    setShowErrorModal,
  ]);

  useEffect(() => {
    if (step === 3 && !isValidated) {
      handleValidateSubmission();
    }
  }, [step, isValidated, handleValidateSubmission]);

  const nextStep = async () => {
    const fieldsToValidate = getStepFields(step);
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (step === 0) {
        const currentIds = form.getValues('pilgrimIds') || [];
        const filteredIds = currentIds.filter((id) => {
          const member = members?.find((m) => m.id === id);
          return member?.isComplete;
        });
        form.setValue('pilgrimIds', filteredIds);
      }
      setStep((s: number) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const firstError = Object.keys(errors).find((key) =>
        fieldsToValidate.includes(key as keyof TWizardForm),
      );
      if (firstError) {
        const element = document.getElementsByName(firstError)[0];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
    }
  };

  const prevStep = () => setStep((s: number) => s - 1);

  if (id && isLoadingDetail) {
    return <FormSkeleton />;
  }

  const selectedIds = watch('pilgrimIds') || [];
  const isStepValid = getStepFields(step).every((field) => {
    const value = watch(field);
    const hasError = !!errors[field];
    const isOptional = ['transportations', 'rawdahMenTime', 'rawdahWomenTime'].includes(
      field as string,
    );

    if (isOptional) return !hasError;
    if (Array.isArray(value)) return value.length > 0 && !hasError;
    return !!value && !hasError;
  });

  return (
    <div className="mx-auto space-y-8 pb-20">
      <LoadingOverlay
        isLoading={createMutation.isPending || updateMutation.isPending}
        message={t('form.processingDataAndImages')}
      />
      <HeaderPageContent
        title={id ? tCommon('edit') : t('addTransaction')}
        subtitle={`${t('step')} ${step + 1}: ${stepTitles[step]}`}
        onBack={() => router.back()}
        extra={
          selectedIds?.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                Lead Group
              </p>
              <p className="text-xl font-black text-foreground leading-tight">
                {completeMembers.find((m) => m.id === selectedIds[0])?.fullName || '-'}
              </p>
            </div>
          )
        }
      />

      <div className="flex gap-2">
        {stepTitles.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-primary-default' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card className="p-6!">
            {step === 0 && <SelectMembersForm />}
            {step === 1 && <LogisticsForm />}
            {step === 2 && <TransportRawdahForm />}
            {step === 3 && (
              <SummaryForm
                totalAmount={totalAmount}
                currency={currency}
                breakdown={breakdown}
                isLoading={previewMutation.isPending}
              />
            )}
          </Card>

          <TransactionFormFooter
            step={step}
            prevStep={prevStep}
            nextStep={nextStep}
            isStepValid={isStepValid}
            isValidated={isValidated}
            isPending={previewMutation.isPending}
            isCreating={createMutation.isPending}
            isUpdating={updateMutation.isPending}
            id={id}
            apiErrors={apiErrors}
            formErrors={errors}
            onShowErrors={() => setShowErrorModal(true)}
          />

          <TransactionErrorDrawer
            open={showErrorModal}
            setOpen={setShowErrorModal}
            errors={errors}
            apiErrors={apiErrors}
            apiWarnings={apiWarnings}
          />
        </form>
      </FormProvider>
    </div>
  );
};
