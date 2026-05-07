'use client';

import { Button, Card, NotFoundComp } from '@/components/atoms';
import { DatePicker, HeaderPageContent, InputSelect, InputText } from '@/components/molecules';
import { ROUTES } from '@/shared/constants/routes';
import { ArrowLeft, Bus, Download, FileText, Hotel, Lock, Plane, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useProviderSubmissionsController } from '../controller';
import { SubmissionDetailSkeleton } from './skeleton';
import { toast } from 'sonner';

export const SubmissionManifest = () => {
  const t = useTranslations('ProviderSubmissions.manifest');
  const params = useParams();
  const router = useRouter();
  const { useSubmissionDetail } = useProviderSubmissionsController();

  const id = params?.id as string;
  const slug = (params?.slug as string) || 'p';

  const { data, isPending } = useSubmissionDetail(id);
  const submission = data?.data;

  const paymentCompleted = submission?.paymentStatus === 'COMPLETED';

  if (isPending) return <SubmissionDetailSkeleton />;

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in duration-500">
        <NotFoundComp
          label={t('notFoundTitle')}
          message={t('notFoundDesc')}
          actionButton={t('backToList')}
          actionHref={ROUTES.PROVIDER.SUBMISSIONS(slug)}
        />
      </div>
    );
  }

  const flight = submission.flights?.[0];
  const hotel = submission.hotels?.[0];
  const transport = submission.transportations?.[0];

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HeaderPageContent
        title={t('title')}
        subtitle={t('subtitle', {
          id: submission.id,
          leader: submission.leader?.fullName,
          count: submission.members?.length || 0,
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
      <Card className="overflow-hidden !p-0 border-2 border-gray-100 shadow-sm">
        <div className="pb-4 border-b border-gray-50 mb-4 px-6 pt-6 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Users className="h-5 w-5 text-blue-500" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Daftar Jamaah</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Informasi data diri dan dokumen pendukung jamaah
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Nama</th>
                <th className="pb-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Paspor</th>
                <th className="pb-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest">NIK</th>
                <th className="pb-4 font-bold text-gray-400 uppercase text-[10px] tracking-widest text-right">Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {submission.members?.map((p) => (
                <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-black text-gray-900">{p.fullName}</td>
                  <td className="py-4 text-gray-500 font-mono text-xs">{p.passportNumber}</td>
                  <td className="py-4 text-gray-500 font-medium">{p.nik}</td>
                  <td className="py-4">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="primaryOutline"
                        size="sm"
                        className="h-9 px-3 gap-2 rounded-xl text-[10px] font-bold uppercase tracking-tight bg-white shadow-sm transition-all hover:bg-primary-50 hover:text-primary-default hover:border-primary-200"
                        onClick={() => p.passportUrl && window.open(p.passportUrl, '_blank')}
                        disabled={!p.passportUrl}
                      >
                        <FileText className="h-3.5 w-3.5" /> Paspor
                      </Button>
                      <Button
                        variant="primaryOutline"
                        size="sm"
                        className="h-9 px-3 gap-2 rounded-xl text-[10px] font-bold uppercase tracking-tight bg-white shadow-sm transition-all hover:bg-primary-50 hover:text-primary-default hover:border-primary-200"
                        onClick={() => p.ktpUrl && window.open(p.ktpUrl, '_blank')}
                        disabled={!p.ktpUrl}
                      >
                        <FileText className="h-3.5 w-3.5" /> KTP
                      </Button>
                      <Button
                        variant="primaryOutline"
                        size="sm"
                        className="h-9 px-3 gap-2 rounded-xl text-[10px] font-bold uppercase tracking-tight bg-white shadow-sm transition-all hover:bg-primary-50 hover:text-primary-default hover:border-primary-200"
                        onClick={() => p.photoUrl && window.open(p.photoUrl, '_blank')}
                        disabled={!p.photoUrl}
                      >
                        <FileText className="h-3.5 w-3.5" /> Foto
                      </Button>
                    </div>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-gray-200" />
                      <p className="text-sm text-gray-400 font-medium italic">Data jamaah tidak tersedia</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flight Section */}
        <Card className="overflow-hidden !p-0 border-2 border-gray-100 shadow-sm">
          <div className="pb-4 border-b border-gray-50 mb-4 px-6 pt-6 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Plane className="h-5 w-5 text-orange-500" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  {t('flight.title')}
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('flight.subtitle')}</p>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 px-6 pb-6">
            <InputText
              type="text"
              readonly
              useLabelInside
              label={t('flight.flightNo')}
              value={flight?.flightNo || '-'}
            />
            <InputText
              type="text"
              readonly
              useLabelInside
              label={t('flight.carrier')}
              value={flight?.carrier || '-'}
            />
            <DatePicker
              disabled
              useLabelInside
              label={t('flight.date')}
              value={flight?.flightDate ? new Date(flight.flightDate) : undefined}
              onChange={() => {}}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputText
                type="text"
                readonly
                useLabelInside
                label={t('flight.eta')}
                value={flight?.eta || '-'}
              />
              <InputText
                type="text"
                readonly
                useLabelInside
                label={t('flight.etd')}
                value={flight?.etd || '-'}
              />
            </div>
          </div>
        </Card>

        {/* Hotel Section */}
        <Card className="overflow-hidden !p-0 border-2 border-gray-100 shadow-sm">
          <div className="pb-4 border-b border-gray-50 mb-4 px-6 pt-6 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-xl">
                <Hotel className="h-5 w-5 text-purple-500" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">{t('hotel.title')}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('hotel.subtitle')}</p>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 px-6 pb-6">
            <InputText
              type="text"
              readonly
              useLabelInside
              label={t('hotel.name')}
              value={hotel?.name || '-'}
            />
            <InputText
              type="text"
              readonly
              useLabelInside
              label={t('hotel.resvNo')}
              value={hotel?.resvNo || '-'}
            />
            <InputSelect
              disabled
              useLabelInside
              label={t('hotel.city')}
              value={hotel?.city || ''}
              options={[
                { label: 'Makkah', value: 'Makkah' },
                { label: 'Madinah', value: 'Madinah' },
              ]}
            />
            <InputText
              type="text"
              readonly
              useLabelInside
              label={t('hotel.roomType')}
              value={hotel?.roomType || '-'}
            />
            <DatePicker
              disabled
              useLabelInside
              label={t('hotel.checkin')}
              value={hotel?.checkIn ? new Date(hotel.checkIn) : undefined}
              onChange={() => {}}
            />
            <DatePicker
              disabled
              useLabelInside
              label={t('hotel.checkout')}
              value={hotel?.checkOut ? new Date(hotel.checkOut) : undefined}
              onChange={() => {}}
            />
          </div>
        </Card>

        {/* Transport Section */}
        <Card className="overflow-hidden !p-0 border-2 border-gray-100 shadow-sm">
          <div className="pb-4 border-b border-gray-50 mb-4 px-6 pt-6 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-xl">
                <Bus className="h-5 w-5 text-green-500" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  {t('transport.title')}
                </h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('transport.subtitle')}</p>
              </div>
            </div>
          </div>
          <div className="px-6 pb-6 max-w-md">
            <InputSelect
              disabled
              useLabelInside
              label={t('transport.vehicleType')}
              value={transport?.type || ''}
              options={[
                { label: 'Bus', value: 'Bus' },
                { label: 'Mini Bus', value: 'Mini Bus' },
                { label: 'Sedan', value: 'Sedan' },
                { label: 'MPV', value: 'MPV' },
                { label: 'TAXI', value: 'TAXI' },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
