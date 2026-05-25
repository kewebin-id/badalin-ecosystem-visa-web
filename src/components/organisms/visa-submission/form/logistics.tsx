'use client';

import { DatePicker } from '@/components/molecules/date-picker';
import { InputFile } from '@/components/molecules/input/file';
import { InputSelect } from '@/components/molecules/input/select';
import { InputText } from '@/components/molecules/input/text';
import { ILogisticsOcrResponse } from '@/packages/pilgrim/transaction/domain/transaction';
import {
  TWizardForm,
  useTransactionController,
} from '@/packages/pilgrim/transaction/presentation/controller';
import { dateUtil, getTodayRiyadh } from '@/shared/utils';
import { isBase64 } from '@/shared/utils/validator';
import { AlertTriangle, Building2, History as HistoryIcon, Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Path, useFormContext, useWatch } from 'react-hook-form';

const ROOM_TYPE_OPTIONS = [
  { label: 'Double (DBL)', value: 'DBL' },
  { label: 'Triple (TRPL)', value: 'TRPL' },
  { label: 'Quadruple (QUAD)', value: 'QUAD' },
  { label: 'Quintuple (QUINT)', value: 'QUINT' },
];

export const LogisticsForm = () => {
  const t = useTranslations('VisaTransaction.form');
  const {
    control,
    watch,
    setValue,
    register,
    trigger,
    formState: { errors, touchedFields, isSubmitted },
  } = useFormContext<TWizardForm>();
  const [isAutoDetected, setIsAutoDetected] = useState<Record<string, boolean>>({});
  const [showHotelSyncWarning, setShowHotelSyncWarning] = useState<boolean>(false);
  const { useProcessOcr } = useTransactionController();
  const handleOcrSuccess = (data: ILogisticsOcrResponse) => {
    const ocrData = data.ocr || data;
    const fieldsUpdated: Path<TWizardForm>[] = [];
    const isReturn =
      ocrData.type === 'RETURN' || (ocrData.category === 'FLIGHT' && ocrData.isReturn);
    const prefix = isReturn ? 'return' : 'departure';

    const flightNo = ocrData.flightNo || ocrData.flightNumber || ocrData.flight_no;

    if (flightNo) {
      setValue(`${prefix}FlightNo` as Path<TWizardForm>, flightNo, { shouldValidate: true });
      fieldsUpdated.push(`${prefix}FlightNo` as Path<TWizardForm>);
    }
    if (ocrData.carrier) {
      const fieldName = (
        prefix === 'departure' ? 'departureCarrier' : 'returnCarrier'
      ) as Path<TWizardForm>;
      setValue(fieldName, ocrData.carrier, { shouldValidate: true });
      fieldsUpdated.push(fieldName);
    }
    if (ocrData.date) {
      setValue(`${prefix}FlightDate` as Path<TWizardForm>, ocrData.date, { shouldValidate: true });
      fieldsUpdated.push(`${prefix}FlightDate` as Path<TWizardForm>);
    }
    if (ocrData.eta) {
      setValue(`${prefix}FlightEta` as Path<TWizardForm>, ocrData.eta, { shouldValidate: true });
      fieldsUpdated.push(`${prefix}FlightEta` as Path<TWizardForm>);
    }
    if (ocrData.etd) {
      setValue(`${prefix}FlightEtd` as Path<TWizardForm>, ocrData.etd, { shouldValidate: true });
      fieldsUpdated.push(`${prefix}FlightEtd` as Path<TWizardForm>);
    }

    if (ocrData.hotelCheckin || ocrData.city === 'MAKKAH' || ocrData.type === 'HOTEL_MECCA') {
      const hotelPrefix =
        ocrData.city === 'MADINAH' || ocrData.type === 'HOTEL_MEDINA'
          ? 'hotelMadinah'
          : 'hotelMakkah';
      if (ocrData.hotelName)
        setValue(`${hotelPrefix}Name`, ocrData.hotelName, {
          shouldValidate: true,
        });
      if (ocrData.hotelCheckin)
        setValue(`${hotelPrefix}CheckIn`, ocrData.hotelCheckin, {
          shouldValidate: true,
        });
      if (ocrData.hotelCheckout)
        setValue(`${hotelPrefix}CheckOut`, ocrData.hotelCheckout, {
          shouldValidate: true,
        });
      fieldsUpdated.push(`${hotelPrefix}Name`, `${hotelPrefix}CheckIn`, `${hotelPrefix}CheckOut`);
    }

    if (ocrData.confidence) setValue('ocrConfidence', ocrData.confidence);

    const newAutoDetected = { ...isAutoDetected };
    fieldsUpdated.forEach((f) => (newAutoDetected[f as string] = true));
    setIsAutoDetected(newAutoDetected);
  };

  const departureTicketOcr = useProcessOcr((data: ILogisticsOcrResponse) => {
    handleOcrSuccess(data);
    const field = 'departureTicketUrls' as Path<TWizardForm>;
    const prevValues = (watch(field) as string[])?.filter((e) => !isBase64(e)) || [];
    setValue(
      field,
      [...prevValues, data?.publicUrl || ''] as import('react-hook-form').PathValue<
        TWizardForm,
        Path<TWizardForm>
      >,
      { shouldValidate: true },
    );
  });

  const returnTicketOcr = useProcessOcr((data: ILogisticsOcrResponse) => {
    handleOcrSuccess(data);
    const field = 'returnTicketUrls' as Path<TWizardForm>;
    const prevValues = (watch(field) as string[])?.filter((e) => !isBase64(e)) || [];
    setValue(
      field,
      [...prevValues, data?.publicUrl || ''] as import('react-hook-form').PathValue<
        TWizardForm,
        Path<TWizardForm>
      >,
      { shouldValidate: true },
    );
  });

  const makkahHotelOcr = useProcessOcr((data: ILogisticsOcrResponse) => {
    handleOcrSuccess(data);
    const field = 'hotelMakkahVoucherUrls' as Path<TWizardForm>;
    const prevValues = (watch(field) as string[])?.filter((e) => !isBase64(e)) || [];
    setValue(
      field,
      [...prevValues, data?.publicUrl || ''] as import('react-hook-form').PathValue<
        TWizardForm,
        Path<TWizardForm>
      >,
      { shouldValidate: true },
    );
  });

  const madinahHotelOcr = useProcessOcr((data: ILogisticsOcrResponse) => {
    handleOcrSuccess(data);
    const field = 'hotelMadinahVoucherUrls' as Path<TWizardForm>;
    const prevValues = (watch(field) as string[])?.filter((e) => !isBase64(e)) || [];
    setValue(
      field,
      [...prevValues, data?.publicUrl || ''] as import('react-hook-form').PathValue<
        TWizardForm,
        Path<TWizardForm>
      >,
      { shouldValidate: true },
    );
  });

  useEffect(() => {
    const subscription = watch((_, { name, type }) => {
      if (type === 'change' && name && isAutoDetected[name]) {
        setIsAutoDetected((prev) => {
          const newState = { ...prev };
          delete newState[name];
          return newState;
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isAutoDetected]);

  const departureFlightEtd = useWatch({ control, name: 'departureFlightEtd' });
  const departureFlightEta = useWatch({ control, name: 'departureFlightEta' });
  const returnFlightEtd = useWatch({ control, name: 'returnFlightEtd' });
  const returnFlightEta = useWatch({ control, name: 'returnFlightEta' });
  const hotelMakkahCheckIn = useWatch({ control, name: 'hotelMakkahCheckIn' });
  const hotelMakkahCheckOut = useWatch({ control, name: 'hotelMakkahCheckOut' });
  const hotelMadinahCheckIn = useWatch({ control, name: 'hotelMadinahCheckIn' });
  const hotelMadinahCheckOut = useWatch({ control, name: 'hotelMadinahCheckOut' });
  const isFlightFilled = !!departureFlightEta && !!returnFlightEtd;

  const makkahMinDate = useMemo(() => {
    const base = departureFlightEta || getTodayRiyadh().toISOString();
    if (hotelMadinahCheckIn && hotelMadinahCheckOut && hotelMakkahCheckIn) {
      if (dateUtil(hotelMadinahCheckIn).isBefore(dateUtil(hotelMakkahCheckIn))) {
        return hotelMadinahCheckOut;
      }
    }
    return base;
  }, [departureFlightEta, hotelMadinahCheckIn, hotelMadinahCheckOut, hotelMakkahCheckIn]);

  const madinahMinDate = useMemo(() => {
    const base = departureFlightEta || getTodayRiyadh().toISOString();
    if (hotelMakkahCheckIn && hotelMakkahCheckOut && hotelMadinahCheckIn) {
      if (dateUtil(hotelMakkahCheckIn).isBefore(dateUtil(hotelMadinahCheckIn))) {
        return hotelMakkahCheckOut;
      }
    }
    return base;
  }, [departureFlightEta, hotelMakkahCheckIn, hotelMakkahCheckOut, hotelMadinahCheckIn]);

  const prevFlightDates = useRef({ departureFlightEta, returnFlightEtd });
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const hasChanged =
      prevFlightDates.current.departureFlightEta !== departureFlightEta ||
      prevFlightDates.current.returnFlightEtd !== returnFlightEtd;

    if (!hasChanged) return;

    const fieldsToReset: Path<TWizardForm>[] = [
      'hotelMakkahCheckIn',
      'hotelMakkahCheckOut',
      'hotelMadinahCheckIn',
      'hotelMadinahCheckOut',
    ];

    let hasResetted = false;
    fieldsToReset.forEach((field) => {
      if (watch(field)) {
        setValue(field, '', { shouldValidate: true });
        hasResetted = true;
      }
    });

    if (hasResetted) {
      setShowHotelSyncWarning(true);
    }

    prevFlightDates.current = { departureFlightEta, returnFlightEtd };
  }, [departureFlightEta, returnFlightEtd, setValue, watch]);

  useEffect(() => {
    const fieldsToRevalidate: Path<TWizardForm>[] = [
      'hotelMakkahCheckIn',
      'hotelMakkahCheckOut',
      'hotelMadinahCheckIn',
      'hotelMadinahCheckOut',
    ];
    trigger(fieldsToRevalidate);
  }, [departureFlightEta, returnFlightEtd, trigger]);

  return (
    <div className="space-y-6">
      <div className="p-6 border border-gray-100 rounded-[32px] bg-gray-50/30 space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-primary-default/10 flex items-center justify-center text-primary-default">
            <Plane className="size-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{t('departureSection')}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {t('flightDepartureDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <InputFile
              label=""
              dropzoneText={t('dropzoneDepartureTicket')}
              maxFiles={4}
              isDragDrop
              required={true}
              value={(watch('departureTicketUrls') || []).map((url: string, i: number) => ({
                name: `dep-ticket-${i + 1}.jpg`,
                base64: url,
              }))}
              onChange={(files, rawFiles) => {
                const base64s = files.map((f) => f.base64).filter(Boolean) as string[];
                setValue('departureTicketUrls', base64s, { shouldValidate: true });
                const rawFile = rawFiles?.[rawFiles.length - 1];
                if (rawFile)
                  departureTicketOcr.mutate({ file: rawFile, ocrType: 'DEPARTURE_TICKET' });
              }}
              errorMessage={errors.departureTicketUrls?.message}
              isReadingOcr={departureTicketOcr.isPending}
            />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputText
              useLabelInside
              size="lg"
              label={t('carrier')}
              type="text"
              register={register}
              name="departureCarrier"
              required
              errorMessage={errors.departureCarrier?.message}
            />
            <InputText
              useLabelInside
              size="lg"
              label={t('flightNo')}
              type="text"
              register={register}
              name="departureFlightNo"
              required
              errorMessage={errors.departureFlightNo?.message}
            />
            <InputText
              useLabelInside
              size="lg"
              label={t('flightFrom')}
              type="text"
              register={register}
              name="departureFlightFrom"
              required
              errorMessage={errors.departureFlightFrom?.message}
            />
            <InputText
              useLabelInside
              size="lg"
              label={t('flightTo')}
              type="text"
              register={register}
              name="departureFlightTo"
              required
              errorMessage={errors.departureFlightTo?.message}
            />

            <DatePicker
              useLabelInside
              name="departureFlightEtd"
              size="lg"
              label={t('flightEtd')}
              required
              showTime
              value={departureFlightEtd}
              onChange={(val) => {
                setValue('departureFlightEtd', val as string, { shouldValidate: true });
                setValue('departureFlightEta', '', { shouldValidate: true });
              }}
              errorMessage={errors.departureFlightEtd?.message}
              minDate={getTodayRiyadh().toISOString()}
              isAutoDetected={isAutoDetected['departureFlightEtd']}
              confidence={isAutoDetected['departureFlightEtd'] ? watch('ocrConfidence') : undefined}
            />
            <DatePicker
              useLabelInside
              name="departureFlightEta"
              size="lg"
              label={t('flightEta')}
              required
              showTime
              value={departureFlightEta}
              onChange={(val) =>
                setValue('departureFlightEta', val as string, { shouldValidate: true })
              }
              errorMessage={errors.departureFlightEta?.message}
              minDate={departureFlightEtd || getTodayRiyadh().toISOString()}
              isAutoDetected={isAutoDetected['departureFlightEta']}
              confidence={isAutoDetected['departureFlightEta'] ? watch('ocrConfidence') : undefined}
            />
          </div>
        </div>
      </div>

      <div className="p-6 border border-gray-100 rounded-[32px] bg-gray-50/30 space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <HistoryIcon className="size-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{t('returnSection')}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {t('flightReturnDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <InputFile
              label=""
              dropzoneText={t('dropzoneReturnTicket')}
              maxFiles={4}
              isDragDrop
              required={true}
              value={(watch('returnTicketUrls') || []).map((url: string, i: number) => ({
                name: `ret-ticket-${i + 1}.jpg`,
                base64: url,
              }))}
              onChange={(files, rawFiles) => {
                const base64s = files.map((f) => f.base64).filter(Boolean) as string[];
                setValue('returnTicketUrls', base64s, { shouldValidate: true });
                const rawFile = rawFiles?.[rawFiles.length - 1];
                if (rawFile) returnTicketOcr.mutate({ file: rawFile, ocrType: 'RETURN_TICKET' });
              }}
              errorMessage={errors.returnTicketUrls?.message}
              isReadingOcr={returnTicketOcr.isPending}
            />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputText
              useLabelInside
              size="lg"
              label={t('carrier')}
              type="text"
              register={register}
              name="returnCarrier"
              required
              errorMessage={errors.returnCarrier?.message}
            />
            <InputText
              useLabelInside
              size="lg"
              label={t('flightNo')}
              type="text"
              register={register}
              name="returnFlightNo"
              required
              errorMessage={errors.returnFlightNo?.message}
            />
            <InputText
              useLabelInside
              size="lg"
              label={t('flightFrom')}
              type="text"
              register={register}
              name="returnFlightFrom"
              required
              errorMessage={errors.returnFlightFrom?.message}
            />
            <InputText
              useLabelInside
              size="lg"
              label={t('flightTo')}
              type="text"
              register={register}
              name="returnFlightTo"
              required
              errorMessage={errors.returnFlightTo?.message}
            />

            <DatePicker
              useLabelInside
              name="returnFlightEtd"
              size="lg"
              label={t('flightEtd')}
              required
              showTime
              value={returnFlightEtd}
              onChange={(val) => {
                setValue('returnFlightEtd', val as string, { shouldValidate: true });
                setValue('returnFlightEta', '', { shouldValidate: true });
              }}
              errorMessage={errors.returnFlightEtd?.message}
              minDate={departureFlightEta || getTodayRiyadh().toISOString()}
            />
            <DatePicker
              useLabelInside
              name="returnFlightEta"
              size="lg"
              label={t('flightEta')}
              required
              showTime
              value={returnFlightEta}
              onChange={(val) =>
                setValue('returnFlightEta', val as string, { shouldValidate: true })
              }
              errorMessage={errors.returnFlightEta?.message}
              minDate={returnFlightEtd || getTodayRiyadh().toISOString()}
            />
          </div>
        </div>
      </div>

      <div className="p-6 border border-gray-100 rounded-[32px] bg-gray-50/30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <Building2 className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{t('hotelMakkahSection')}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {t('makkahHotelDesc')}
              </p>
            </div>
          </div>
          {showHotelSyncWarning && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[10px] font-bold text-orange-600 animate-pulse">
              <AlertTriangle className="size-3" />
              Data penerbangan berubah, silakan sesuaikan kembali tanggal hotel.
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <InputFile
              label=""
              dropzoneText={t('dropzoneHotelMakkah')}
              maxFiles={5}
              isDragDrop
              required={true}
              value={(watch('hotelMakkahVoucherUrls') || []).map((url: string, i: number) => ({
                name: `makkah-hotel-${i + 1}.jpg`,
                base64: url,
              }))}
              onChange={(files, rawFiles) => {
                const base64s = files.map((f) => f.base64).filter(Boolean) as string[];
                setValue('hotelMakkahVoucherUrls', base64s, { shouldValidate: true });
                const rawFile = rawFiles?.[rawFiles.length - 1];
                if (rawFile) makkahHotelOcr.mutate({ file: rawFile, ocrType: 'HOTEL_MECCA' });
              }}
              errorMessage={errors.hotelMakkahVoucherUrls?.message}
              isReadingOcr={makkahHotelOcr.isPending}
            />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputText
              useLabelInside
              size="lg"
              label={t('hotelMakkahName')}
              type="text"
              register={register}
              name="hotelMakkahName"
              required
              errorMessage={errors.hotelMakkahName?.message}
            />
            <InputText
              useLabelInside
              size="lg"
              label={t('hotelMakkahResvNo')}
              type="text"
              register={register}
              name="hotelMakkahResvNo"
              required
              errorMessage={errors.hotelMakkahResvNo?.message}
            />
            <InputSelect
              useLabelInside
              size="lg"
              label={t('roomType')}
              options={ROOM_TYPE_OPTIONS.map((opt) => ({
                ...opt,
                label: t(`roomTypeOptions.${opt.value}`),
              }))}
              name="hotelMakkahRoomType"
              required
              errorMessage={errors.hotelMakkahRoomType?.message}
            />

            <DatePicker
              useLabelInside
              name="hotelMakkahCheckIn"
              size="lg"
              label={t('hotelCheckin')}
              required
              value={hotelMakkahCheckIn}
              onChange={(val) => {
                setValue('hotelMakkahCheckIn', val as string, { shouldValidate: true });
                setShowHotelSyncWarning(false);
              }}
              errorMessage={
                touchedFields.hotelMakkahCheckIn || isSubmitted
                  ? errors.hotelMakkahCheckIn?.message
                  : undefined
              }
              minDate={makkahMinDate}
              maxDate={returnFlightEtd}
              disabled={!isFlightFilled}
              disabledTooltip="Isi data penerbangan terlebih dahulu"
              isAutoDetected={isAutoDetected['hotelMakkahCheckIn']}
              confidence={isAutoDetected['hotelMakkahCheckIn'] ? watch('ocrConfidence') : undefined}
            />
            <DatePicker
              useLabelInside
              name="hotelMakkahCheckOut"
              size="lg"
              label={t('hotelCheckout')}
              required
              value={hotelMakkahCheckOut}
              onChange={(val) => {
                setValue('hotelMakkahCheckOut', val as string, { shouldValidate: true });
                setShowHotelSyncWarning(false);
              }}
              errorMessage={
                touchedFields.hotelMakkahCheckOut || isSubmitted
                  ? errors.hotelMakkahCheckOut?.message
                  : undefined
              }
              minDate={hotelMakkahCheckIn || makkahMinDate}
              maxDate={returnFlightEtd}
              disabled={!isFlightFilled}
              disabledTooltip="Isi data penerbangan terlebih dahulu"
              isAutoDetected={isAutoDetected['hotelMakkahCheckOut']}
              confidence={
                isAutoDetected['hotelMakkahCheckOut'] ? watch('ocrConfidence') : undefined
              }
            />
          </div>
        </div>
      </div>

      <div className="p-6 border border-gray-100 rounded-[32px] bg-gray-50/30 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Building2 className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{t('hotelMadinahSection')}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {t('madinahHotelDesc')}
              </p>
            </div>
          </div>
          {showHotelSyncWarning && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[10px] font-bold text-orange-600 animate-pulse">
              <AlertTriangle className="size-3" />
              Data penerbangan berubah, silakan sesuaikan kembali tanggal hotel.
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <InputFile
              label=""
              dropzoneText={t('dropzoneHotelMadinah')}
              maxFiles={5}
              isDragDrop
              required={true}
              value={(watch('hotelMadinahVoucherUrls') || []).map((url: string, i: number) => ({
                name: `madinah-hotel-${i + 1}.jpg`,
                base64: url,
              }))}
              onChange={(files, rawFiles) => {
                const base64s = files.map((f) => f.base64).filter(Boolean) as string[];
                setValue('hotelMadinahVoucherUrls', base64s, { shouldValidate: true });
                const rawFile = rawFiles?.[rawFiles.length - 1];
                if (rawFile) madinahHotelOcr.mutate({ file: rawFile, ocrType: 'HOTEL_MEDINA' });
              }}
              errorMessage={errors.hotelMadinahVoucherUrls?.message}
              isReadingOcr={madinahHotelOcr.isPending}
            />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputText
              useLabelInside
              size="lg"
              label={t('hotelMadinahName')}
              type="text"
              register={register}
              name="hotelMadinahName"
              required
              errorMessage={errors.hotelMadinahName?.message}
            />
            <InputText
              useLabelInside
              size="lg"
              label={t('hotelMadinahResvNo')}
              type="text"
              register={register}
              name="hotelMadinahResvNo"
              required
              errorMessage={errors.hotelMadinahResvNo?.message}
            />
            <InputSelect
              useLabelInside
              size="lg"
              label={t('roomType')}
              options={ROOM_TYPE_OPTIONS.map((opt) => ({
                ...opt,
                label: t(`roomTypeOptions.${opt.value}`),
              }))}
              name="hotelMadinahRoomType"
              required
              errorMessage={errors.hotelMadinahRoomType?.message}
            />
            <DatePicker
              useLabelInside
              name="hotelMadinahCheckIn"
              size="lg"
              label={t('hotelCheckin')}
              required
              value={hotelMadinahCheckIn}
              onChange={(val) => {
                setValue('hotelMadinahCheckIn', val as string, { shouldValidate: true });
                setShowHotelSyncWarning(false);
              }}
              errorMessage={
                touchedFields.hotelMadinahCheckIn || isSubmitted
                  ? errors.hotelMadinahCheckIn?.message
                  : undefined
              }
              minDate={madinahMinDate}
              maxDate={returnFlightEtd}
              disabled={!isFlightFilled}
              disabledTooltip="Isi data penerbangan terlebih dahulu"
            />
            <DatePicker
              useLabelInside
              name="hotelMadinahCheckOut"
              size="lg"
              label={t('hotelCheckout')}
              required
              value={hotelMadinahCheckOut}
              onChange={(val) => {
                setValue('hotelMadinahCheckOut', val as string, { shouldValidate: true });
                setShowHotelSyncWarning(false);
              }}
              errorMessage={
                touchedFields.hotelMadinahCheckOut || isSubmitted
                  ? errors.hotelMadinahCheckOut?.message
                  : undefined
              }
              minDate={hotelMadinahCheckIn || madinahMinDate}
              maxDate={returnFlightEtd}
              disabled={!isFlightFilled}
              disabledTooltip="Isi data penerbangan terlebih dahulu"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
