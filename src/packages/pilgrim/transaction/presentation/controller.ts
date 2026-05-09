import { ROUTES } from '@/shared/constants';
import { RestAPI } from '@/shared/utils/rest-api';
import { isBase64 } from '@/shared/utils/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useState } from 'react';
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

const getWizardSchema = (t: (key: string) => string) =>
  z
    .object({
      pilgrimIds: z.array(z.string()).min(1, t('form.validationRequired')),

      // Flight Departure
      departureFlightNo: z.string().min(1, t('form.validationRequired')),
      departureCarrier: z.string().min(1, t('form.validationRequired')),
      departureFlightFrom: z.string().min(1, t('form.validationRequired')),
      departureFlightTo: z.string().min(1, t('form.validationRequired')),
      departureFlightDate: z.string().optional(),
      departureFlightEta: z.string().min(1, t('form.validationRequired')),
      departureFlightEtd: z.string().min(1, t('form.validationRequired')),

      // Flight Return
      returnFlightNo: z.string().min(1, t('form.validationRequired')),
      returnCarrier: z.string().min(1, t('form.validationRequired')),
      returnFlightFrom: z.string().min(1, t('form.validationRequired')),
      returnFlightTo: z.string().min(1, t('form.validationRequired')),
      returnFlightDate: z.string().optional(),
      returnFlightEta: z.string().min(1, t('form.validationRequired')),
      returnFlightEtd: z.string().min(1, t('form.validationRequired')),

      // Hotel Makkah
      hotelMakkahName: z.string().min(1, t('form.validationRequired')),
      hotelMakkahResvNo: z.string().min(1, t('form.validationRequired')),
      hotelMakkahCheckIn: z.string().min(1, t('form.validationRequired')),
      hotelMakkahCheckOut: z.string().min(1, t('form.validationRequired')),

      // Hotel Madinah
      hotelMadinahName: z.string().min(1, t('form.validationRequired')),
      hotelMadinahResvNo: z.string().min(1, t('form.validationRequired')),
      hotelMadinahCheckIn: z.string().min(1, t('form.validationRequired')),
      hotelMadinahCheckOut: z.string().min(1, t('form.validationRequired')),

      hotelMakkahRoomType: z.string().min(1, t('form.validationRequired')),
      hotelMadinahRoomType: z.string().min(1, t('form.validationRequired')),

      // Transports
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
          return new Date(data.departureFlightEtd) >= new Date();
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
          return new Date(data.departureFlightEta) >= new Date(data.departureFlightEtd);
        }
        return true;
      },
      {
        message: 'Kedatangan (ETA) harus minimal dari waktu keberangkatan (ETD)',
        path: ['departureFlightEta'],
      },
    )
    .refine(
      (data) => {
        if (data.departureFlightEta && data.returnFlightEtd) {
          return new Date(data.returnFlightEtd) >= new Date(data.departureFlightEta);
        }
        return true;
      },
      {
        message: 'Return (ETD) harus minimal dari waktu kedatangan keberangkatan (ETA)',
        path: ['returnFlightEtd'],
      },
    )
    .refine(
      (data) => {
        if (data.returnFlightEtd && data.returnFlightEta) {
          return new Date(data.returnFlightEta) >= new Date(data.returnFlightEtd);
        }
        return true;
      },
      {
        message: 'Return (ETA) harus minimal dari waktu keberangkatan return (ETD)',
        path: ['returnFlightEta'],
      },
    );

export type TWizardForm = z.infer<ReturnType<typeof getWizardSchema>>;

const transformToRequest = (data: TWizardForm): ICreateTransactionRequest => {
  return {
    pilgrimIds: data.pilgrimIds,
    rawdahMenTime: data.rawdahMenTime,
    rawdahWomenTime: data.rawdahWomenTime,
    flights: [
      {
        type: 'DEPARTURE',
        flightNo: data.departureFlightNo,
        carrier: data.departureCarrier,
        from: data.departureFlightFrom,
        to: data.departureFlightTo,
        flightDate: data.departureFlightEta
          ? new Date(data.departureFlightEta).toISOString().split('T')[0]
          : '',
        eta: data.departureFlightEta,
        etd: data.departureFlightEtd,
        imageUrls: data.departureTicketUrls,
      },
      {
        type: 'RETURN',
        flightNo: data.returnFlightNo,
        carrier: data.returnCarrier,
        from: data.returnFlightFrom,
        to: data.returnFlightTo,
        flightDate: data.returnFlightEta
          ? new Date(data.returnFlightEta).toISOString().split('T')[0]
          : '',
        eta: data.returnFlightEta,
        etd: data.returnFlightEtd,
        imageUrls: data.returnTicketUrls,
      },
    ],
    hotels: [
      {
        name: data.hotelMakkahName,
        resvNo: data.hotelMakkahResvNo,
        checkIn: data.hotelMakkahCheckIn,
        checkOut: data.hotelMakkahCheckOut,
        city: 'MAKKAH',
        roomType: data.hotelMakkahRoomType,
        imageUrls: data.hotelMakkahVoucherUrls,
      },
      {
        name: data.hotelMadinahName,
        resvNo: data.hotelMadinahResvNo,
        checkIn: data.hotelMadinahCheckIn,
        checkOut: data.hotelMadinahCheckOut,
        city: 'MADINAH',
        roomType: data.hotelMadinahRoomType,
        imageUrls: data.hotelMadinahVoucherUrls,
      },
    ],
    transportations:
      data.transportations?.map((t) => ({
        type: t.type,
        company: t.company,
        date: t.date,
        time: t.time,
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

    // 1. Process top-level logistics images
    uploadedForm.departureTicketUrls = await uploadList(form.departureTicketUrls);
    uploadedForm.returnTicketUrls = await uploadList(form.returnTicketUrls);
    uploadedForm.hotelMakkahVoucherUrls = await uploadList(form.hotelMakkahVoucherUrls);
    uploadedForm.hotelMadinahVoucherUrls = await uploadList(form.hotelMadinahVoucherUrls);

    // 2. Process transportation images
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

  const useCreateTransaction = () => {
    return useMutation({
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
          toast.error(res.message || res.error.message || 'Gagal membuat pengajuan');
        }
      },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const useUpdateTransaction = () => {
    return useMutation({
      mutationFn: async ({ id, form }: { id: string; form: TWizardForm }) => {
        const uploadedForm = await handleUploadImages(form);
        return useCase.updateTransaction(id, transformToRequest(uploadedForm));
      },
      onSuccess: (res) => {
        if (!res.error) {
          queryClient.invalidateQueries({ queryKey: ['visa-transactions'] });
          queryClient.invalidateQueries({ queryKey: ['visa-transaction', res.data?.id] });
          toast.success('Pengajuan visa berhasil diperbarui!');
          router.push(ROUTES.PILGRIM.TRANSACTION.INDEX);
        } else {
          toast.error(res.message || res.error.message || 'Gagal memperbarui pengajuan');
        }
      },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const useProcessOcr = (onOcrSuccess: (data: ILogisticsOcrResponse) => void) =>
    useMutation({
      mutationFn: ({ file, ocrType = 'LOGISTICS' }: { file: File; ocrType?: TOcrType }) =>
        useCase.processOcr(file, ocrType),
      onSuccess: (res) => {
        if (res.data) onOcrSuccess(res.data);
      },
      onError: () => toast.error('Gagal memproses OCR dokumen logistik'),
    });

  const useUploadProof = () => {
    return useMutation({
      mutationFn: ({ id, file }: { id: string; file: File }) =>
        useCase.updatePaymentProof(id, file),
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
  };

  const [isDownloading, setIsDownloading] = useState(false);

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

  return {
    isDownloading,
    handleDownloadAllVisas,
    useTransactions,
    useTransactionDetail,
    useCreateTransaction,
    useUpdateTransaction,
    useProcessOcr,
    useUploadProof,
    usePreviewSubmission: () =>
      useMutation({
        mutationFn: async (form: TWizardForm) => {
          const uploadedForm = await handleUploadImages(form);
          return useCase.previewSubmission(transformToRequest(uploadedForm));
        },
        onError: (err: Error) => toast.error(err.message),
      }),
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
      // Mapping API data back to flat form
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
