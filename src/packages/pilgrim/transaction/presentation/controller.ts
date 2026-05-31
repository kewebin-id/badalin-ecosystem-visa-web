import { ROUTES } from '@/shared/constants';
import { dateUtil, dayjs, isBase64 } from '@/shared/utils';
import { RestAPI } from '@/shared/utils/rest-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  ICreateTransactionRequest,
  ILogisticsOcrResponse,
  ITransaction,
  TOcrType,
} from '../domain/transaction';
import { TransactionRepository } from '../repository';
import { TransactionUseCase } from '../usecase';

const api = new RestAPI();
const repository = new TransactionRepository(api);
const useCase = new TransactionUseCase(repository);

const toLocalYYYYMMDD = (val?: string | dayjs.Dayjs | Date | null) => {
  if (!val) return '';
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return val;
  }
  const d = dateUtil(val);
  return `${d.year()}-${String(d.month() + 1).padStart(2, '0')}-${String(d.date()).padStart(2, '0')}`;
};

const getWizardSchema = (
  t: (key: string, values?: Record<string, string | number | boolean>) => string,
) =>
  z
    .object({
      pilgrimIds: z.array(z.string()).min(1, t('form.validationRequired')),
      departureFlightNo: z.string().min(1, t('form.validationRequired')),
      departureCarrier: z.string().min(1, t('form.validationRequired')),
      departureFlightFrom: z.string().min(1, t('form.validationRequired')),
      departureFlightTo: z.string().min(1, t('form.validationRequired')),
      departureFlightDate: z.string().optional(),
      departureFlightEta: z
        .string()
        .min(1, 'Tanggal kedatangan tidak boleh kosong / Arrival date cannot be empty'),
      departureFlightEtd: z
        .string()
        .min(1, 'Tanggal keberangkatan tidak boleh kosong / Departure date cannot be empty'),
      returnFlightNo: z.string().min(1, t('form.validationRequired')),
      returnCarrier: z.string().min(1, t('form.validationRequired')),
      returnFlightFrom: z.string().min(1, t('form.validationRequired')),
      returnFlightTo: z.string().min(1, t('form.validationRequired')),
      returnFlightDate: z.string().optional(),
      returnFlightEta: z
        .string()
        .min(
          1,
          'Tanggal kedatangan kepulangan tidak boleh kosong / Return arrival date cannot be empty',
        ),
      returnFlightEtd: z
        .string()
        .min(
          1,
          'Tanggal keberangkatan kepulangan tidak boleh kosong / Return departure date cannot be empty',
        ),
      hotelMakkahName: z.string().min(1, t('form.validationRequired')),
      hotelMakkahResvNo: z.string().min(1, t('form.validationRequired')),
      hotelMakkahCheckIn: z.string().min(1, t('form.validationRequired')),
      hotelMakkahCheckOut: z.string().min(1, t('form.validationRequired')),
      hotelMadinahName: z.string().min(1, t('form.validationRequired')),
      hotelMadinahResvNo: z.string().min(1, t('form.validationRequired')),
      hotelMadinahCheckIn: z.string().min(1, t('form.validationRequired')),
      hotelMadinahCheckOut: z.string().min(1, t('form.validationRequired')),
      hotelMakkahRoomType: z.string().min(1, t('form.validationRequired')),
      hotelMadinahRoomType: z.string().min(1, t('form.validationRequired')),
      transportations: z
        .array(
          z.object({
            type: z.enum(['BUS', 'TRAIN', 'TAXI', 'MPV', 'OTHER']),
            company: z.string().min(1, t('form.validationRequired')),
            date: z.string().min(1, t('form.validationRequired')),
            time: z.string().min(1, t('form.validationRequired')),
            from: z.string().min(1, t('form.validationRequired')),
            to: z.string().min(1, t('form.validationRequired')),
            total: z.number().min(1, t('form.validationRequired')),
            imageUrls: z.array(z.string()).optional(),
          }),
        )
        .optional(),
      rawdahMenTime: z.string().optional(),
      rawdahWomenTime: z.string().optional(),
      notes: z.string().optional(),
      departureTicketUrls: z.array(z.string()).min(1, t('form.validationRequired')),
      returnTicketUrls: z.array(z.string()).min(1, t('form.validationRequired')),
      hotelMakkahVoucherUrls: z.array(z.string()).min(1, t('form.validationRequired')),
      hotelMadinahVoucherUrls: z.array(z.string()).min(1, t('form.validationRequired')),
      ocrConfidence: z.number().optional(),
    })
    .refine(
      (data) => {
        if (data.departureFlightEtd) {
          return dateUtil(data.departureFlightEtd).isAfter(dateUtil().subtract(1, 'minute'));
        }
        return true;
      },
      {
        message: 'Keberangkatan (ETD) tidak boleh di masa lalu',
        path: ['departureFlightEtd'],
      },
    )
    .refine(
      (data) => {
        if (data.departureFlightEtd && data.departureFlightEta) {
          return dateUtil(data.departureFlightEta).isAfter(dateUtil(data.departureFlightEtd));
        }
        return true;
      },
      {
        message:
          'Waktu tiba (ETA) tidak boleh sebelum waktu keberangkatan (ETD) / ETA cannot be before ETD.',
        path: ['departureFlightEta'],
      },
    )
    .refine(
      (data) => {
        if (data.departureFlightEta && data.returnFlightEtd) {
          return dateUtil(data.returnFlightEtd).isAfter(dateUtil(data.departureFlightEta));
        }
        return true;
      },
      {
        message:
          'Tanggal kepulangan harus setelah tanggal tiba di tujuan / Return flight must be after departure landing.',
        path: ['returnFlightEtd'],
      },
    )
    .refine(
      (data) => {
        if (data.returnFlightEtd && data.returnFlightEta) {
          return dateUtil(data.returnFlightEta).isAfter(dateUtil(data.returnFlightEtd));
        }
        return true;
      },
      {
        message:
          'Waktu tiba kepulangan (ETA) tidak boleh sebelum waktu keberangkatan kepulangan (ETD) / Return ETA cannot be before Return ETD.',
        path: ['returnFlightEta'],
      },
    )
    .superRefine((data, ctx) => {
      const landing = data.departureFlightEta
        ? dateUtil(data.departureFlightEta).startOf('day')
        : null;
      const takeoff = data.returnFlightEtd ? dateUtil(data.returnFlightEtd).startOf('day') : null;


      const validateBoundary = (fieldDate: string | undefined, path: (string | number)[]) => {
        if (!fieldDate) return;
        const dateObj = dateUtil(fieldDate).startOf('day');
        if (landing && dateObj.isBefore(landing, 'day')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('form.hotelCheckinBeforeLanding', {
              date: landing.format('DD MMM YYYY'),
            }),
            path,
          });
        }
        if (takeoff && dateObj.isAfter(takeoff, 'day')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('form.hotelCheckoutAfterTakeoff', {
              date: takeoff.format('DD MMM YYYY'),
            }),
            path,
          });
        }
      };

      validateBoundary(data.hotelMakkahCheckIn, ['hotelMakkahCheckIn']);
      validateBoundary(data.hotelMakkahCheckOut, ['hotelMakkahCheckOut']);
      validateBoundary(data.hotelMadinahCheckIn, ['hotelMadinahCheckIn']);
      validateBoundary(data.hotelMadinahCheckOut, ['hotelMadinahCheckOut']);

      if (data.hotelMakkahCheckIn && data.hotelMadinahCheckIn) {
        const makkahIn = dateUtil(data.hotelMakkahCheckIn).startOf('day');
        const madinahIn = dateUtil(data.hotelMadinahCheckIn).startOf('day');

        if (makkahIn.isBefore(madinahIn, 'day')) {
          if (
            data.hotelMakkahCheckOut &&
            madinahIn.isBefore(dateUtil(data.hotelMakkahCheckOut).startOf('day'), 'day')
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Tanggal check-in harus setelah atau sama dengan tanggal check-out hotel sebelumnya / Check-in date must be on or after the previous hotel's check-out date.",
              path: ['hotelMadinahCheckIn'],
            });
          }
        } else if (madinahIn.isBefore(makkahIn, 'day')) {
          if (
            data.hotelMadinahCheckOut &&
            makkahIn.isBefore(dateUtil(data.hotelMadinahCheckOut).startOf('day'), 'day')
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Tanggal check-in harus setelah atau sama dengan tanggal check-out hotel sebelumnya / Check-in date must be on or after the previous hotel's check-out date.",
              path: ['hotelMakkahCheckIn'],
            });
          }
        }
      }

      if (data.transportations) {
        data.transportations.forEach((item, index) => {
          validateBoundary(item.date, ['transportations', index, 'date']);
        });
      }
    });

const saudiTimezone = 'Asia/Riyadh';

const parseToSaudi = (val?: string | dayjs.Dayjs | Date | null, includeTime: boolean = false) => {
  if (!val) return '';

  if (!includeTime) {
    const dateStr = toLocalYYYYMMDD(val);
    return dayjs.tz(`${dateStr}T00:00:00`, saudiTimezone).toISOString();
  }

  const d = dateUtil(val);
  const faceValue = `${d.format('YYYY-MM-DD')}T${d.format('HH:mm:ss')}`;
  return dayjs.tz(faceValue, saudiTimezone).toISOString();
};

export type TWizardForm = z.infer<ReturnType<typeof getWizardSchema>>;

export const transformToRequest = (data: TWizardForm): ICreateTransactionRequest => {
  return {
    pilgrimIds: data.pilgrimIds,
    rawdahMenTime: data.rawdahMenTime ? parseToSaudi(data.rawdahMenTime, true) : '',
    rawdahWomenTime: data.rawdahWomenTime ? parseToSaudi(data.rawdahWomenTime, true) : '',
    flights: [
      {
        type: 'DEPARTURE',
        flightNo: data.departureFlightNo,
        carrier: data.departureCarrier,
        from: data.departureFlightFrom,
        to: data.departureFlightTo,
        flightDate: data.departureFlightEta
          ? dayjs(parseToSaudi(data.departureFlightEta)).format('YYYY-MM-DD')
          : '',
        eta: data.departureFlightEta ? parseToSaudi(data.departureFlightEta, true) : '',
        etd: data.departureFlightEtd ? dayjs(data.departureFlightEtd).toISOString() : '',
        imageUrls: data.departureTicketUrls,
      },
      {
        type: 'RETURN',
        flightNo: data.returnFlightNo,
        carrier: data.returnCarrier,
        from: data.returnFlightFrom,
        to: data.returnFlightTo,
        flightDate: data.returnFlightEtd
          ? dayjs(parseToSaudi(data.returnFlightEtd)).format('YYYY-MM-DD')
          : '',
        eta: data.returnFlightEta ? dayjs(data.returnFlightEta).toISOString() : '',
        etd: data.returnFlightEtd ? parseToSaudi(data.returnFlightEtd, true) : '',
        imageUrls: data.returnTicketUrls,
      },
    ],
    hotels: [
      {
        name: data.hotelMakkahName,
        resvNo: data.hotelMakkahResvNo,
        checkIn: data.hotelMakkahCheckIn ? parseToSaudi(data.hotelMakkahCheckIn) : '',
        checkOut: data.hotelMakkahCheckOut ? parseToSaudi(data.hotelMakkahCheckOut) : '',
        city: 'MAKKAH',
        roomType: data.hotelMakkahRoomType,
        imageUrls: data.hotelMakkahVoucherUrls,
      },
      {
        name: data.hotelMadinahName,
        resvNo: data.hotelMadinahResvNo,
        checkIn: data.hotelMadinahCheckIn ? parseToSaudi(data.hotelMadinahCheckIn) : '',
        checkOut: data.hotelMadinahCheckOut ? parseToSaudi(data.hotelMadinahCheckOut) : '',
        city: 'MADINAH',
        roomType: data.hotelMadinahRoomType,
        imageUrls: data.hotelMadinahVoucherUrls,
      },
    ],
    transportations:
      data.transportations?.map((t) => ({
        type: t.type,
        company: t.company,
        date: t.date ? parseToSaudi(t.date, true) : '',
        time: t.time ? parseToSaudi(t.time, true) : '',
        from: t.from,
        to: t.to,
        totalVehicle: t.total,
        imageUrls: t.imageUrls || [],
      })) || [],
    notes: data.notes,
    ocrConfidence: data.ocrConfidence,
  };
};

export interface IPreviewFormResponse {
  isValid: boolean;
  totalAmount: number;
  breakdown: string;
  errors: { path: string; message: string }[];
  warnings: string[];
}

export const useTransactionController = () => {
  const t = useTranslations('VisaTransaction');
  const queryClient = useQueryClient();
  const router = useRouter();

  const wizardSchema = useMemo(() => getWizardSchema(t as (key: string) => string), [t]);

  const handleUploadImages = async (form: TWizardForm): Promise<TWizardForm> => {
    const uploadedForm = { ...form };
    const uploadList = async (urls: string[]) => {
      if (!urls) return [];
      return await Promise.all(
        urls.map(async (url) => {
          if (isBase64(url)) {
            const res = await useCase.upload(url);
            return res.data?.publicUrl || url;
          }
          return url;
        }),
      );
    };
    uploadedForm.departureTicketUrls = await uploadList(form.departureTicketUrls);
    uploadedForm.returnTicketUrls = await uploadList(form.returnTicketUrls);
    uploadedForm.hotelMakkahVoucherUrls = await uploadList(form.hotelMakkahVoucherUrls);
    uploadedForm.hotelMadinahVoucherUrls = await uploadList(form.hotelMadinahVoucherUrls);
    if (form.transportations && form.transportations.length > 0) {
      uploadedForm.transportations = await Promise.all(
        form.transportations.map(async (t) => ({
          ...t,
          imageUrls: t.imageUrls ? await uploadList(t.imageUrls) : [],
        })),
      );
    }
    return uploadedForm;
  };

  const useTransactions = (params?: { page?: number; limit?: number; search?: string }) => {
    return useQuery({
      queryKey: ['visa-transactions', params],
      queryFn: () => useCase.getTransactions(params),
    });
  };

  const useTransactionDetail = (id: string | null) => {
    return useQuery({
      queryKey: ['visa-transaction', id],
      queryFn: () => useCase.getTransactionDetail(id!),
      enabled: !!id,
    });
  };

  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownloadAllVisas = async (transaction: ITransaction) => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();
      const folder = zip.folder('visas');

      const membersWithVisas = transaction.members.filter((m) => m.visaUrl);

      if (membersWithVisas.length === 0) {
        toast.error(t('detail.noVisaToDownload'));
        return;
      }

      toast.info(t('detail.preparingVisas', { count: membersWithVisas.length }));

      const downloadPromises = membersWithVisas.map(async (member) => {
        try {
          const response = await fetch(member.visaUrl!);
          const blob = await response.blob();
          const extension = member.visaUrl!.split('.').pop()?.split('?')[0] || 'jpg';
          const fileName = `${member.fullName.toLowerCase().replace(/\s+/g, '-')}_visa.${extension}`;
          folder?.file(fileName, blob);
        } catch (error) {
          console.error(`Failed to download visa for ${member.fullName}`, error);
        }
      });

      await Promise.all(downloadPromises);
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `visas_${transaction.id.slice(0, 8)}.zip`);
      toast.success(t('detail.downloadSuccess'));
    } catch (error) {
      console.error('Error generating zip', error);
      toast.error(t('detail.downloadError'));
    } finally {
      setIsDownloading(false);
    }
  };

  const createTransactionMutation = useMutation({
    mutationFn: async (form: TWizardForm) => {
      const uploadedForm = await handleUploadImages(form);
      return useCase.createTransaction(transformToRequest(uploadedForm));
    },
    onSuccess: (res) => {
      if (!res.error) {
        queryClient.invalidateQueries({ queryKey: ['visa-transactions'] });
        toast.success('Pengajuan visa berhasil dibuat!');
        router.push(ROUTES.PILGRIM.TRANSACTION.INDEX);
      } else {
        const errorMsg = res.message || res.error.message || 'Gagal membuat pengajuan';
        toast.error(errorMsg);
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, form, autoResubmit }: { id: string; form: TWizardForm; autoResubmit?: boolean }) => {
      const uploadedForm = await handleUploadImages(form);
      const updateRes = await useCase.updateTransaction(id, transformToRequest(uploadedForm));
      if (updateRes.error) return updateRes;
      if (autoResubmit) {
        return await useCase.resubmit(id);
      }
      return updateRes;
    },
    onSuccess: (res, variables) => {
      if (!res.error) {
        queryClient.invalidateQueries({ queryKey: ['visa-transactions'] });
        queryClient.invalidateQueries({ queryKey: ['visa-transaction', variables.id] });
        toast.success(variables.autoResubmit ? 'Revisi pengajuan berhasil dikirim!' : 'Pengajuan visa berhasil diperbarui!');
        router.push(`${ROUTES.PILGRIM.TRANSACTION.INDEX}/${variables.id}`);
      } else {
        const errorMsg = res.message || res.error.message || 'Gagal memperbarui pengajuan';
        toast.error(errorMsg);
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const uploadProofMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => useCase.updatePaymentProof(id, file),
    onSuccess: (res) => {
      if (!res.error) {
        queryClient.invalidateQueries({ queryKey: ['visa-transactions'] });
        queryClient.invalidateQueries({ queryKey: ['visa-transaction', res.data?.id] });
        toast.success('Bukti pembayaran berhasil diunggah!');
      } else {
        toast.error(res.message || res.error.message || 'Gagal mengunggah bukti pembayaran');
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const resubmitMutation = useMutation({
    mutationFn: (id: string) => useCase.resubmit(id),
    onSuccess: (res) => {
      if (!res.error) {
        queryClient.invalidateQueries({ queryKey: ['visa-transactions'] });
        queryClient.invalidateQueries({ queryKey: ['visa-transaction', res.data?.id] });
        toast.success('Pengajuan berhasil direvisi dan dikirim ulang!');
      } else {
        toast.error(res.message || res.error.message || 'Gagal mengirim ulang revisi');
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const previewSubmissionMutation = useMutation({
    mutationFn: async (form: TWizardForm) => {
      const uploadedForm = await handleUploadImages(form);
      return useCase.previewSubmission(transformToRequest(uploadedForm));
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    isDownloading,
    handleDownloadAllVisas,
    useTransactions,
    useTransactionDetail,
    useCreateTransaction: () => createTransactionMutation,
    useUpdateTransaction: () => updateTransactionMutation,
    useProcessOcr: (onOcrSuccess: (data: ILogisticsOcrResponse) => void, onOcrError?: () => void) =>
      useMutation({
        mutationFn: ({ file, ocrType = 'LOGISTICS' }: { file: File; ocrType?: TOcrType }) =>
          useCase.processOcr(file, ocrType),
        onSuccess: (res) => {
          if (res.data) {
            onOcrSuccess(res.data);
          } else {
            toast.error(res.message || 'Gagal memproses OCR dokumen logistik');
            if (onOcrError) onOcrError();
          }
        },
        onError: () => {
          toast.error('Gagal memproses OCR dokumen logistik');
          if (onOcrError) onOcrError();
        },
      }),
    useUploadProof: () => uploadProofMutation,
    useResubmitTransaction: () => resubmitMutation,
    usePreviewSubmission: () => previewSubmissionMutation,
    wizardSchema,
  };
};

export const useTransactionForm = (initialData?: Partial<ITransaction>) => {
  const t = useTranslations('VisaTransaction');
  const wizardSchema = useMemo(() => getWizardSchema(t as (key: string) => string), [t]);

  return useForm<TWizardForm>({
    resolver: zodResolver(wizardSchema),
    mode: 'all',
    values: useMemo(() => {
      const fDep = initialData?.flights?.find((f) => f.type === 'DEPARTURE');
      const fRet = initialData?.flights?.find((f) => f.type === 'RETURN');
      const hM = initialData?.hotels?.find((h) => h.city === 'MAKKAH');
      const hD = initialData?.hotels?.find((h) => h.city === 'MADINAH');

      const initial: TWizardForm = {
        pilgrimIds: initialData?.pilgrimIds || [],
        departureFlightNo: fDep?.flightNo || '',
        departureCarrier: fDep?.carrier || '',
        departureFlightFrom: fDep?.from || '',
        departureFlightTo: fDep?.to || '',
        departureFlightDate: fDep?.flightDate || '',
        departureFlightEta: fDep?.eta || '',
        departureFlightEtd: fDep?.etd || '',
        returnFlightNo: fRet?.flightNo || '',
        returnCarrier: fRet?.carrier || '',
        returnFlightFrom: fRet?.from || '',
        returnFlightTo: fRet?.to || '',
        returnFlightDate: fRet?.flightDate || '',
        returnFlightEta: fRet?.eta || '',
        returnFlightEtd: fRet?.etd || '',
        hotelMakkahName: hM?.name || '',
        hotelMakkahResvNo: hM?.resvNo || '',
        hotelMakkahCheckIn: hM?.checkIn || '',
        hotelMakkahCheckOut: hM?.checkOut || '',
        hotelMadinahName: hD?.name || '',
        hotelMadinahResvNo: hD?.resvNo || '',
        hotelMadinahCheckIn: hD?.checkIn || '',
        hotelMadinahCheckOut: hD?.checkOut || '',
        hotelMakkahRoomType: hM?.roomType || '',
        hotelMadinahRoomType: hD?.roomType || '',
        transportations:
          initialData?.transportations?.map((trans) => ({
            type: trans.type,
            company: trans.company,
            date: trans.date,
            time: trans.time,
            from: trans.from,
            to: trans.to,
            total: (trans.totalVehicle as number) || 1,
          })) || [],
        rawdahMenTime: initialData?.rawdahMenTime || '',
        rawdahWomenTime: initialData?.rawdahWomenTime || '',
        notes: initialData?.notes || '',
        departureTicketUrls: fDep?.imageUrls || [],
        returnTicketUrls: fRet?.imageUrls || [],
        hotelMakkahVoucherUrls: hM?.imageUrls || [],
        hotelMadinahVoucherUrls: hD?.imageUrls || [],
        ocrConfidence: 0,
      };

      return initial as TWizardForm;
    }, [initialData]),
  });
};
