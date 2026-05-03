'use client';

import { Button, Card } from '@/components/atoms';
import { DatePicker, HeaderPageContent, InputSelect, InputText } from '@/components/molecules';
import { PROVIDER_SUBMISSIONS } from '@/lib/provider-mock-data';
import { ROUTES } from '@/shared/constants/routes';
import { ArrowLeft, Bus, Download, FileText, Hotel, Lock, Plane, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';

export const SubmissionManifest = () => {
  const t = useTranslations('ProviderSubmissions.manifest');
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;
  const slug = (params?.slug as string) || 'p';

  const submission = useMemo(() => PROVIDER_SUBMISSIONS.find((s) => s.id === id), [id]);

  // Read-only values from submission (mocking the structure)
  const flight = {
    flightNo: 'GA-980',
    carrier: 'Garuda Indonesia',
    date: new Date('2025-05-10'),
    eta: '2025-05-10T10:00',
    etd: '2025-05-20T15:00',
  };

  const hotel = {
    name: 'Pullman ZamZam',
    resvNo: 'RSV-12345',
    city: 'Makkah',
    roomType: 'Quad / Triple / Double',
    checkin: new Date('2025-05-10'),
    checkout: new Date('2025-05-20'),
  };

  const vehicleType = 'Bus';

  const totalMembers = submission?.totalMembers ?? 0;
  const paymentCompleted = submission?.paymentStatus === 'COMPLETED';

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="absolute -inset-4 rounded-full bg-primary-50 blur-2xl opacity-50 animate-pulse" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-white border border-gray-100 shadow-xl">
            <svg
              className="h-16 w-16 text-primary-default"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
              />
            </svg>
          </div>
        </div>
        <div className="text-center space-y-3 max-w-md">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {t('notFoundTitle')}
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">{t('notFoundDesc')}</p>
        </div>
        <div className="mt-10">
          <Button
            onClick={() => router.push(ROUTES.PROVIDER.SUBMISSIONS(slug))}
            className="h-14 px-10 gap-3 rounded-[1.5rem] bg-gray-900 text-white font-bold shadow-xl shadow-gray-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('backToList')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <HeaderPageContent
        title={t('title')}
        subtitle={t('subtitle', {
          id: submission.id,
          leader: submission.leaderName,
          count: totalMembers,
        })}
        onBack={() => router.push(ROUTES.PROVIDER.SUBMISSIONS(slug))}
        extra={
          <Button
            disabled={!paymentCompleted}
            className="gap-2 cursor-pointer"
            variant={paymentCompleted ? 'primary' : 'secondary'}
            onClick={() => paymentCompleted && toast.success(t('downloadVisa'))}
          >
            {paymentCompleted ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {paymentCompleted ? t('downloadVisa') : t('downloadVisaLocked')}
          </Button>
        }
      />

      {/* Pilgrims Section */}
      <Card className="overflow-hidden !p-0">
        <div className="pb-4 border-b border-gray-50 mb-4 px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Users className="h-5 w-5 text-blue-500" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Daftar Jamaah</h3>
              <p className="text-xs text-gray-400 font-medium">
                Informasi data diri dan dokumen pendukung jamaah
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-3 font-semibold text-gray-500">Nama</th>
                <th className="pb-3 font-semibold text-gray-500">Paspor</th>
                <th className="pb-3 font-semibold text-gray-500">NIK</th>
                <th className="pb-3 font-semibold text-gray-500 text-right">Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {submission.pilgrims?.map((p) => (
                <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-bold text-gray-900">{p.name}</td>
                  <td className="py-4 text-gray-500 font-medium">{p.passportNo}</td>
                  <td className="py-4 text-gray-500 font-medium">{p.nik}</td>
                  <td className="py-4">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="primaryOutline"
                        size="sm"
                        className="h-9 px-3 gap-2 rounded-xl text-xs bg-white shadow-sm transition-all hover:bg-primary-50 hover:text-primary-default hover:border-primary-200"
                        onClick={() => window.open(p.passportUrl, '_blank')}
                      >
                        <FileText className="h-3.5 w-3.5" /> Paspor
                      </Button>
                      <Button
                        variant="primaryOutline"
                        size="sm"
                        className="h-9 px-3 gap-2 rounded-xl text-xs bg-white shadow-sm transition-all hover:bg-primary-50 hover:text-primary-default hover:border-primary-200"
                        onClick={() => window.open(p.ktpUrl, '_blank')}
                      >
                        <FileText className="h-3.5 w-3.5" /> KTP
                      </Button>
                    </div>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400 italic">
                    Data jamaah tidak tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Flight Section */}
      <Card className="overflow-hidden !p-0">
        <div className="pb-4 border-b border-gray-50 mb-4 px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-xl">
              <Plane className="h-5 w-5 text-orange-500" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                {t('flight.title')}
              </h3>
              <p className="text-xs text-gray-400 font-medium">{t('flight.subtitle')}</p>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 px-6 pb-6">
          <InputText
            type="text"
            disabled
            useLabelInside
            label={t('flight.flightNo')}
            value={flight.flightNo}
          />
          <InputText
            type="text"
            disabled
            useLabelInside
            label={t('flight.carrier')}
            value={flight.carrier}
          />
          <DatePicker
            disabled
            useLabelInside
            label={t('flight.date')}
            value={flight.date}
            onChange={() => {}}
          />
          <InputText
            type="time"
            disabled
            useLabelInside
            label={t('flight.eta')}
            value={flight.eta}
          />
          <InputText
            type="time"
            disabled
            useLabelInside
            label={t('flight.etd')}
            value={flight.etd}
          />
        </div>
      </Card>

      {/* Hotel Section */}
      <Card className="overflow-hidden !p-0">
        <div className="pb-4 border-b border-gray-50 mb-4 px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Hotel className="h-5 w-5 text-purple-500" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">{t('hotel.title')}</h3>
              <p className="text-xs text-gray-400 font-medium">{t('hotel.subtitle')}</p>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 px-6 pb-6">
          <InputText
            type="text"
            disabled
            useLabelInside
            label={t('hotel.name')}
            value={hotel.name}
          />
          <InputText
            type="text"
            disabled
            useLabelInside
            label={t('hotel.resvNo')}
            value={hotel.resvNo}
          />
          <InputSelect
            disabled
            useLabelInside
            label={t('hotel.city')}
            value={hotel.city}
            options={[
              { label: 'Makkah', value: 'Makkah' },
              { label: 'Madinah', value: 'Madinah' },
            ]}
          />
          <InputText
            type="text"
            disabled
            useLabelInside
            label={t('hotel.roomType')}
            value={hotel.roomType}
          />
          <DatePicker
            disabled
            useLabelInside
            label={t('hotel.checkin')}
            value={hotel.checkin}
            onChange={() => {}}
          />
          <DatePicker
            disabled
            useLabelInside
            label={t('hotel.checkout')}
            value={hotel.checkout}
            onChange={() => {}}
          />
        </div>
      </Card>

      {/* Transport Section */}
      <Card className="overflow-hidden !p-0">
        <div className="pb-4 border-b border-gray-50 mb-4 px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-xl">
              <Bus className="h-5 w-5 text-green-500" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                {t('transport.title')}
              </h3>
              <p className="text-xs text-gray-400 font-medium">{t('transport.subtitle')}</p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 max-w-md">
          <InputSelect
            disabled
            useLabelInside
            label={t('transport.vehicleType')}
            value={vehicleType}
            options={[
              { label: 'Bus', value: 'Bus' },
              { label: 'Mini Bus', value: 'Mini Bus' },
            ]}
          />
        </div>
      </Card>
    </div>
  );
};
