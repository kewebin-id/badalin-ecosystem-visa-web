'use client';

import { Button, Card } from '@/components/atoms';
import { Skeleton } from '@/components/atoms/skeleton';
import { DialogDrawer, HeaderPageContent, LoadingOverlay } from '@/components/molecules';
import {
  LogisticsForm,
  SelectMembersForm,
  SummaryForm,
  TransportRawdahForm,
} from '@/components/organisms';
import { useManagementController } from '@/packages/pilgrim/management/presentation/controller';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Clock, Info, Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { TWizardForm, useTransactionController, useTransactionForm } from '../controller';

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
  const tDashboard = useTranslations('PilgrimManagement');
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
  const [breakdown, setBreakdown] = useState<string>('');

  const { useCreateTransaction, useUpdateTransaction, useTransactionDetail, usePreviewSubmission } =
    useTransactionController();
  const previewMutation = usePreviewSubmission();

  useEffect(() => {
    setIsValidated(false);
  }, [step]);

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
    try {
      setApiErrors([]);
      setApiWarnings([]);
      form.clearErrors();

      const values = form.getValues() as TWizardForm;
      const res = await previewMutation.mutateAsync(values);

      if (res.data?.totalAmount !== undefined) {
        setTotalAmount(res.data.totalAmount);
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
            form.setError(mappedPath, { message: err.message });
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
    previewMutation,
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
    if (isValid) setStep((s: number) => s + 1);
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

  const getFieldLabel = (key: string) => {
    const mapping: Record<string, string> = {
      pilgrimIds: tDashboard('familyGroup'),
      departureFlightNo: `${t('form.departureSection')} - ${t('form.flightNo')}`,
      departureCarrier: `${t('form.departureSection')} - ${t('form.carrier')}`,
      departureFlightEta: `${t('form.departureSection')} - ${t('form.flightEta')}`,
      departureFlightEtd: `${t('form.departureSection')} - ${t('form.flightEtd')}`,
      returnFlightNo: `${t('form.returnSection')} - ${t('form.flightNo')}`,
      returnCarrier: `${t('form.returnSection')} - ${t('form.carrier')}`,
      returnFlightEta: `${t('form.returnSection')} - ${t('form.flightEta')}`,
      returnFlightEtd: `${t('form.returnSection')} - ${t('form.flightEtd')}`,
      hotelMakkahName: t('form.hotelMakkahName'),
      hotelMakkahResvNo: t('form.hotelMakkahResvNo'),
      hotelMakkahCheckIn: `${tDashboard('makkah')} - ${t('form.hotelCheckin')}`,
      hotelMakkahCheckOut: `${tDashboard('makkah')} - ${t('form.hotelCheckout')}`,
      hotelMadinahName: t('form.hotelMadinahName'),
      hotelMadinahResvNo: t('form.hotelMadinahResvNo'),
      hotelMadinahCheckIn: `${tDashboard('madinah')} - ${t('form.hotelCheckin')}`,
      hotelMadinahCheckOut: `${tDashboard('madinah')} - ${t('form.hotelCheckout')}`,
      departureTicketUrls: t('form.uploadDepartureTicket'),
      returnTicketUrls: t('form.uploadReturnTicket'),
      hotelMakkahVoucherUrls: t('form.uploadHotelMakkah'),
      hotelMadinahVoucherUrls: t('form.uploadHotelMadinah'),
    };

    const label =
      mapping[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

    return (
      <span className="inline-flex items-center">
        <span className="text-danger-500 mr-1 font-black">*</span>
        {label}
      </span>
    );
  };

  const flattenErrors = (
    errorsObj: Record<string, unknown>,
    prefix = '',
  ): { key: string; message: string }[] => {
    return Object.entries(errorsObj).reduce(
      (acc: { key: string; message: string }[], [key, value]) => {
        const currentPath = prefix ? `${prefix}.${key}` : key;
        const val = value as Record<string, unknown> | undefined;

        if (val && typeof val.message === 'string') {
          acc.push({ key: currentPath, message: val.message });
        } else if (typeof val === 'object' && val !== null) {
          acc.push(...flattenErrors(val, currentPath));
        }
        return acc;
      },
      [],
    );
  };

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
                breakdown={breakdown}
                isLoading={previewMutation.isPending}
              />
            )}
          </Card>

          {step === 3 && (apiErrors.length > 0 || Object.keys(errors).length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center -mb-6 relative z-10"
            >
              <button
                type="button"
                onClick={() => setShowErrorModal(true)}
                className="group flex items-center gap-2 px-4 py-2 bg-danger-50 border border-danger-100 rounded-full shadow-lg shadow-danger-500/10 hover:bg-danger-100 transition-all active:scale-95"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-white group-hover:scale-110 transition-transform">
                  <AlertCircle className="size-3.5" />
                </div>
                <span className="text-xs font-bold text-danger-700">
                  {t('validationErrorTitle')} ({apiErrors.length + Object.keys(errors).length})
                </span>
                <div className="h-4 w-[1px] bg-danger-200 mx-1" />
                <span className="text-[10px] font-black uppercase tracking-widest text-danger-500 group-hover:translate-x-0.5 transition-transform">
                  {tCommon('detail')} ➔
                </span>
              </button>
            </motion.div>
          )}

          <div className="flex gap-3 rounded-3xl border border-gray-100 shadow-sm p-6 bg-white">
            {step > 0 && (
              <Button type="button" variant="primaryOutline" onClick={prevStep} className="flex-1">
                <ArrowLeft className="size-4 mr-2" /> {tCommon('back')}
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={nextStep} disabled={!isStepValid} className="flex-1">
                {tCommon('continue')} <ArrowRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isValidated || createMutation.isPending || updateMutation.isPending}
                className="flex-1 shadow-lg shadow-primary-500/20"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Clock className="size-4 mr-2 animate-spin" />
                ) : (
                  <Plane className="size-4 mr-2" />
                )}
                {id ? tCommon('edit') : t('addTransaction')}
              </Button>
            )}
          </div>

          <DialogDrawer
            open={showErrorModal}
            setOpen={setShowErrorModal}
            title={t('validationErrorTitle')}
            description={t('validationErrorDesc')}
            cancelButton={t('fixErrors')}
            onCancel={() => setShowErrorModal(false)}
          >
            <div className="space-y-4">
              <div className="bg-danger-50 border border-danger-100 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="size-5 text-danger-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-danger-900">
                    {t('form.validationRequiredBanner')}
                  </p>
                  <p className="text-xs text-danger-700">{t('form.validationRequiredDesc')}</p>
                </div>
              </div>
              <div className="space-y-2">
                {Object.keys(errors).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {t('form.formIssues')}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {flattenErrors(errors).map((err) => (
                        <li key={err.key} className="text-sm text-gray-600">
                          <span className="font-semibold">{getFieldLabel(err.key)}</span>:{' '}
                          {err.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {apiErrors.length > 0 && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {t('form.systemBusinessRules')}
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      {apiErrors.map((error: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-sm text-danger-600 font-medium leading-relaxed"
                        >
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {apiWarnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 mt-4">
                    <AlertCircle className="size-5 text-amber-500 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-amber-900 uppercase">
                        {t('form.attentionWarnings')}
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {apiWarnings.map((warning: string, idx: number) => (
                          <li key={idx} className="text-[11px] text-amber-800 leading-tight">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 mt-4">
                  <Info className="size-5 text-blue-500 shrink-0" />
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    {t('form.stepInstructions')}
                  </p>
                </div>
              </div>
            </div>
          </DialogDrawer>
        </form>
      </FormProvider>
    </div>
  );
};
