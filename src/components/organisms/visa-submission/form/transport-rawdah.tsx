'use client';

import { Button, Card } from '@/components/atoms';
import { DatePicker } from '@/components/molecules/date-picker';
import { InputFile } from '@/components/molecules/input/file';
import { InputSelect } from '@/components/molecules/input/select';
import { InputText } from '@/components/molecules/input/text';
import { TWizardForm } from '@/packages/pilgrim/transaction/presentation/controller';
import { getTodayRiyadh } from '@/shared/utils';
import {
  Bus,
  CalendarCheck,
  Car,
  History,
  MoreHorizontal,
  Plus,
  Train,
  Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Path, useFieldArray, useFormContext } from 'react-hook-form';

const TRANSPORT_TYPE_OPTIONS = [
  { label: 'Bus', value: 'BUS' },
  { label: 'Train', value: 'TRAIN' },
  { label: 'Taxi', value: 'TAXI' },
  { label: 'MPV', value: 'MPV' },
  { label: 'Other', value: 'OTHER' },
];

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'BUS':
      return <Bus className="size-4" />;
    case 'TRAIN':
      return <Train className="size-4" />;
    case 'TAXI':
      return <Car className="size-4" />;
    case 'MPV':
      return <Car className="size-4" />;
    default:
      return <MoreHorizontal className="size-4" />;
  }
};

export const TransportRawdahForm = () => {
  const t = useTranslations('VisaTransaction');
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TWizardForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'transportations',
  });
  const { trigger } = useFormContext<TWizardForm>();

  const departureFlightEta = watch('departureFlightEta');
  const returnFlightEtd = watch('returnFlightEtd');

  useEffect(() => {
    const transportFields = fields.map((_, index) => `transportations.${index}.date` as Path<TWizardForm>);
    const rawdahFields: Path<TWizardForm>[] = ['rawdahMenTime', 'rawdahWomenTime'];
    trigger([...transportFields, ...rawdahFields]);
  }, [departureFlightEta, returnFlightEtd, fields.length, trigger]);

  const handleAddTransport = (type: 'BUS' | 'TRAIN' | 'TAXI' | 'MPV' | 'OTHER') => {
    append({
      type,
      company: '',
      date: '',
      time: '',
      from: '',
      to: '',
      total: 1,
      imageUrls: [],
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-primary-default/10 flex items-center justify-center text-primary-default">
              <Bus className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{t('form.transportSection')}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {t('form.transportSectionDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {TRANSPORT_TYPE_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                variant="primaryOutline"
                size="sm"
                onClick={() =>
                  handleAddTransport(opt.value as 'BUS' | 'TRAIN' | 'TAXI' | 'MPV' | 'OTHER')
                }
                className="rounded-full h-8 px-4 text-[10px]!"
              >
                <Plus className="size-3 mr-1" /> {t(`form.transportTypeOptions.${opt.value}`)}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card
              key={field.id}
              className="p-6 relative group overflow-hidden border-primary-100 bg-white shadow-sm!"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-default" />

              <div className="flex items-center justify-between mb-6 w-full">
                <div className="flex items-center gap-2 w-full">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    {getTransportIcon(watch(`transportations.${index}.type`) as string)}
                  </div>
                  <span className="text-sm font-bold uppercase tracking-tight">
                    {t(`form.transportTypeOptions.${watch(`transportations.${index}.type`)}`)}{' '}
                    {t('form.entry')} #{index + 1}
                  </span>
                </div>
                <div>
                  <Button
                    type="button"
                    variant="dangerOutline"
                    size="icon"
                    onClick={() => remove(index)}
                    className="rounded-xl h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <InputFile
                    label={t('form.uploadTransportProof')}
                    maxFiles={2}
                    value={(watch(`transportations.${index}.imageUrls`) || []).map(
                      (url: string, i: number) => ({
                        name: `proof-${i + 1}.jpg`,
                        base64: url,
                      }),
                    )}
                    onChange={(files: { base64: string }[]) => {
                      const base64s = files
                        .map((f: { base64: string }) => f.base64)
                        .filter(Boolean) as string[];
                      setValue(`transportations.${index}.imageUrls`, base64s, {
                        shouldValidate: true,
                      });
                    }}
                    errorMessage={
                      (errors.transportations?.[index] as Record<string, { message?: string }>)
                        ?.imageUrls?.message
                    }
                  />
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputSelect
                    useLabelInside
                    size="lg"
                    label={t('form.transportType')}
                    options={TRANSPORT_TYPE_OPTIONS.map((opt) => ({
                      ...opt,
                      label: t(`form.transportTypeOptions.${opt.value}`),
                    }))}
                    name={`transportations.${index}.type`}
                    required
                    errorMessage={
                      (errors.transportations?.[index] as Record<string, { message?: string }>)
                        ?.type?.message
                    }
                  />
                  <InputText
                    useLabelInside
                    size="lg"
                    label={t('form.companyCarrier')}
                    type="text"
                    register={register}
                    name={`transportations.${index}.company`}
                    required
                    errorMessage={
                      (errors.transportations?.[index] as Record<string, { message?: string }>)
                        ?.company?.message
                    }
                  />
                  <InputText
                    useLabelInside
                    size="lg"
                    label={t('form.totalUnit')}
                    type="number"
                    register={register}
                    name={`transportations.${index}.total`}
                    required
                    errorMessage={
                      (errors.transportations?.[index] as Record<string, { message?: string }>)
                        ?.total?.message
                    }
                  />

                  <InputText
                    useLabelInside
                    size="lg"
                    label={t('form.routeFrom')}
                    type="text"
                    register={register}
                    name={`transportations.${index}.from`}
                    required
                    errorMessage={
                      (errors.transportations?.[index] as Record<string, { message?: string }>)
                        ?.from?.message
                    }
                  />
                  <InputText
                    useLabelInside
                    size="lg"
                    label={t('form.routeTo')}
                    type="text"
                    register={register}
                    name={`transportations.${index}.to`}
                    required
                    errorMessage={
                      (errors.transportations?.[index] as Record<string, { message?: string }>)?.to
                        ?.message
                    }
                  />

                  <DatePicker
                    useLabelInside
                    name={`transportations.${index}.date`}
                    size="lg"
                    label={t('form.dateAndTime')}
                    showTime={true}
                    required
                    value={watch(`transportations.${index}.date`)}
                    onChange={(val) => {
                      const isoString = val as string;
                      setValue(`transportations.${index}.date`, isoString, {
                        shouldValidate: true,
                      });
                      setValue(`transportations.${index}.time`, isoString, {
                        shouldValidate: true,
                      });
                    }}
                    minDate={watch('departureFlightEta') || getTodayRiyadh().toISOString()}
                    maxDate={watch('returnFlightEtd')}
                    errorMessage={
                      (errors.transportations?.[index] as Record<string, { message?: string }>)
                        ?.date?.message ||
                      (errors.transportations?.[index] as Record<string, { message?: string }>)
                        ?.time?.message
                    }
                  />
                </div>
              </div>
            </Card>
          ))}

          {fields.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-100 rounded-[32px] bg-gray-50/50">
              <History className="size-10 text-gray-200 mb-2" />
              <p className="text-sm font-medium text-gray-400">{t('form.noTransportAdded')}</p>
              <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">
                {t('form.optionalSection')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 border border-gray-100 rounded-[32px] bg-gray-50/30 space-y-8">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
            <CalendarCheck className="size-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{t('form.rawdahSection')}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {t('form.rawdahSectionDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DatePicker
            useLabelInside
            name="rawdahMenTime"
            size="lg"
            label={t('form.rawdahMenTime')}
            showTime={true}
            value={watch('rawdahMenTime')}
            onChange={(val) => setValue('rawdahMenTime', val as string, { shouldValidate: true })}
            minDate={watch('departureFlightEta') || getTodayRiyadh().toISOString()}
            maxDate={watch('returnFlightEtd')}
            errorMessage={errors.rawdahMenTime?.message}
          />
          <DatePicker
            useLabelInside
            name="rawdahWomenTime"
            size="lg"
            label={t('form.rawdahWomenTime')}
            showTime={true}
            value={watch('rawdahWomenTime')}
            onChange={(val) => setValue('rawdahWomenTime', val as string, { shouldValidate: true })}
            minDate={watch('departureFlightEta') || getTodayRiyadh().toISOString()}
            maxDate={watch('returnFlightEtd')}
            errorMessage={errors.rawdahWomenTime?.message}
          />
        </div>
      </div>
    </div>
  );
};
