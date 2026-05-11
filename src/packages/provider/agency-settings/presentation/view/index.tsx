'use client';

import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { Skeleton } from '@/components/atoms/skeleton';
import { HeaderPageContent, LoadingOverlay } from '@/components/molecules';
import { InputText } from '@/components/molecules/input/text';
import { unformatRupiah } from '@/shared/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Clock, CreditCard, DollarSign, Globe, Info, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AgencyFormValues, getAgencySchema } from '../../domain/request';
import { useAgencySettingsController } from '../controller/index';

export const AgencySettingsView = () => {
  const t = useTranslations('AgencySettings');
  const tCommon = useTranslations('Common');

  const { useAgencyData, useUpdateAgency } = useAgencySettingsController();
  const { data: res, isPending: isLoadingData } = useAgencyData();
  const { mutate: updateAgency, isPending: isUpdating } = useUpdateAgency(t);

  const agency = res?.data;

  const slugCooldownDaysLeft = useMemo<number>(() => {
    if (!agency?.lastSlugUpdate) return 0;
    const lastUpdate = new Date(agency.lastSlugUpdate).getTime();
    const daysPassed = Math.floor((Date.now() - lastUpdate) / (1000 * 60 * 60 * 24));
    const daysLeft = 90 - daysPassed;
    return daysLeft > 0 ? daysLeft : 0;
  }, [agency?.lastSlugUpdate]);

  const isSlugLocked = useMemo<boolean>(() => {
    if (!agency) return false;
    const isTempSlug = !agency.slug || agency.slug.startsWith('temp-') || agency.slug === 'p';
    return !isTempSlug && slugCooldownDaysLeft > 0;
  }, [agency, slugCooldownDaysLeft]);

  const methods = useForm<AgencyFormValues>({
    resolver: zodResolver(getAgencySchema(t)),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      visaPrice: 0,
      bankName: '',
      bankAccountName: '',
      bankAccountNumber: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = methods;

  useEffect(() => {
    if (agency) {
      reset({
        name: agency.name || '',
        slug: agency.slug || '',
        visaPrice: Number(agency.visaPrice) || 0,
        bankName: agency.bankName || '',
        bankAccountName: agency.bankAccountName || '',
        bankAccountNumber: agency.bankAccountNumber || '',
      });
    }
  }, [agency, reset]);

  const onSubmit = (values: AgencyFormValues) => {
    const payload = {
      ...values,
      visaPrice: Math.abs(Number(values.visaPrice)) || 0,
    };
    updateAgency(payload);
  };

  if (isLoadingData && !agency) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <Skeleton className="h-64 w-full rounded-[2rem]" />
            <Skeleton className="h-52 w-full rounded-[2rem]" />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <Skeleton className="h-80 w-full rounded-[2rem]" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <LoadingOverlay isLoading={isUpdating} message={t('updating')} />

      <HeaderPageContent title={t('title')} subtitle={t('subtitle')} hideBack />

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* ── Left Column ── */}
          <div className="lg:col-span-7 space-y-8">
            {/* Agency Identity */}
            <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm space-y-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none select-none">
                <Building2 size={120} />
              </div>
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                  <Globe size={20} />
                </div>
                <h3 className="text-base font-bold text-gray-900">{t('sections.identity')}</h3>
              </div>
              <div className="space-y-5">
                <InputText
                  useLabelInside
                  type="text"
                  size="lg"
                  label={t('fields.name')}
                  placeholder={t('placeholders.name')}
                  register={register}
                  name="name"
                  errorMessage={errors.name?.message}
                />
                <div id="tour-agency-slug">
                  <InputText
                    useLabelInside
                    type="text"
                    size="lg"
                    label={t('fields.slug')}
                    placeholder={t('placeholders.slug')}
                    register={register}
                    name="slug"
                    errorMessage={errors.slug?.message}
                    disabled={isSlugLocked}
                  />
                  {isSlugLocked ? (
                    <div className="mt-2 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                      <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-medium text-amber-800 leading-relaxed">
                        {t('hints.slugCooldown', { days: slugCooldownDaysLeft })}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-start gap-2.5 rounded-xl bg-blue-50/60 border border-blue-100 px-4 py-3">
                      <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-medium text-blue-800 leading-relaxed">
                        {t('hints.slug')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Visa Pricing */}
            <div id="tour-visa-pricing">
              <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm space-y-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none select-none">
                  <DollarSign size={120} />
                </div>
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600">
                    <DollarSign size={20} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{t('sections.pricing')}</h3>
                </div>
                <div className="space-y-4">
                  <InputText
                    useLabelInside
                    type="price"
                    size="lg"
                    label={t('fields.visaPrice')}
                    placeholder={t('placeholders.visaPrice')}
                    register={register}
                    name="visaPrice"
                    errorMessage={errors.visaPrice?.message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value;
                      const numeric = unformatRupiah(val);
                      methods.setValue('visaPrice', numeric ? Number(numeric) : 0, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                  <div className="flex items-start gap-2.5 rounded-xl bg-orange-50/60 border border-orange-100 px-4 py-3">
                    <Info size={16} className="text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-orange-800 leading-relaxed">
                      {t('hints.visaPrice')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-5 space-y-8">
            {/* Bank Info */}
            <div id="tour-bank-info">
              <Card className="p-8 rounded-[2rem] border-gray-100 shadow-sm space-y-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none select-none">
                  <CreditCard size={120} />
                </div>
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{t('sections.bank')}</h3>
                </div>
                <div className="space-y-5">
                  <InputText
                    useLabelInside
                    type="text"
                    size="lg"
                    label={t('fields.bankName')}
                    placeholder={t('placeholders.bankName')}
                    register={register}
                    name="bankName"
                    errorMessage={errors.bankName?.message}
                  />
                  <InputText
                    useLabelInside
                    type="text"
                    size="lg"
                    label={t('fields.bankAccountName')}
                    placeholder={t('placeholders.bankAccountName')}
                    register={register}
                    name="bankAccountName"
                    errorMessage={errors.bankAccountName?.message}
                  />
                  <InputText
                    useLabelInside
                    type="text"
                    size="lg"
                    label={t('fields.bankAccountNumber')}
                    placeholder={t('placeholders.bankAccountNumber')}
                    register={register}
                    name="bankAccountNumber"
                    errorMessage={errors.bankAccountNumber?.message}
                  />
                  <div className="flex items-start gap-2.5 rounded-xl bg-green-50/60 border border-green-100 px-4 py-3">
                    <Info size={16} className="text-green-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-green-800 leading-relaxed">
                      {t('hints.bank')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl h-14 shadow-lg text-base font-semibold gap-2"
              disabled={isUpdating || !isDirty}
              isSubmitting={isUpdating}
            >
              <Save size={20} />
              {isUpdating ? t('updating') : t('save')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
