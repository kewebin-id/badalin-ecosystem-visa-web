import { Button, Card } from '@/components/atoms';
import { ImageThumbnailList } from '@/components/molecules';
import { ISubmissionListItem } from '@/packages/provider/submissions/domain/response';
import { ROUTES } from '@/shared/constants/routes';
import { ExternalLink, FileText, Plane, Users } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface SubmissionQuickReviewProps {
  submission: ISubmissionListItem;
  onPreview: (image: { src: string; alt: string }) => void;
}

export const SubmissionQuickReview = ({ submission, onPreview }: SubmissionQuickReviewProps) => {
  const t = useTranslations('ProviderSubmissions.quickReview');
  const params = useParams();
  const slug = (params?.slug as string) || 'p';

  const membersToShow = (submission.members || []).filter((m) => {
    const status = submission.resultSnapshot?.memberStatuses?.[m.id];
    if (status) return status.valid;
    return true;
  });

  const departureFlights = (submission.flights || []).filter((f) => f.type === 'DEPARTURE');
  const returnFlights = (submission.flights || []).filter((f) => f.type === 'RETURN');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {t('totalJamaah')}
              </p>
              <p className="text-sm font-black text-blue-900">{membersToShow.length || '-'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                {t('visaStatus')}
              </p>
              <p className="text-sm font-black text-orange-900">{submission.reviewStatus || '-'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Visa Upload CTA */}
      {submission.reviewStatus !== 'ISSUED' && (
        <Card className="p-4 bg-green-50 border-green-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-green-900">{t('uploadVisaAction')}</p>
              <p className="text-xs text-green-600 font-medium">{t('uploadVisaDesc')}</p>
            </div>
          </div>
          <Button size="lg" href={ROUTES.PROVIDER.DETAIL(slug, submission.id)}>
            {t('uploadVisaAction')} <ExternalLink className="h-4 w-4" />
          </Button>
        </Card>
      )}

      {/* Logistics Section */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <Plane className="h-4 w-4" /> {t('logistics')}
        </h3>

        {/* Flights Row - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Departure Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-100" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {t('departure')}
              </p>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            {departureFlights.length > 0 ? (
              departureFlights.map((f, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-black text-gray-900">
                      {f.carrier} ({f.flightNo})
                    </p>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
                      FLIGHT
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    {f.from || '-'} to {f.to || '-'} •{' '}
                    {f.flightDate ? moment(f.flightDate).format('DD MMM YYYY') : '-'}
                  </p>
                  <div className="p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 mb-3 space-y-0.5">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      ETD: {moment(f.etd).format('DD MMM YYYY, HH:mm')}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      ETA: {moment(f.eta).format('DD MMM YYYY, HH:mm')}
                    </p>
                  </div>
                  <ImageThumbnailList
                    images={f.imageUrls}
                    onPreview={onPreview}
                    altPrefix="Tiket"
                  />
                </div>
              ))
            ) : (
              <div className="p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                <p className="text-xs text-gray-400 italic">No Departure Data</p>
              </div>
            )}
          </div>

          {/* Return Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-100" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {t('return')}
              </p>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            {returnFlights.length > 0 ? (
              returnFlights.map((f, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-black text-gray-900">
                      {f.carrier} ({f.flightNo})
                    </p>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full border border-purple-100">
                      FLIGHT
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    {f.from || '-'} to {f.to || '-'} •{' '}
                    {f.flightDate ? moment(f.flightDate).format('DD MMM YYYY') : '-'}
                  </p>
                  <div className="p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 mb-3 space-y-0.5">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      ETD: {moment(f.etd).format('DD MMM YYYY, HH:mm')}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      ETA: {moment(f.eta).format('DD MMM YYYY, HH:mm')}
                    </p>
                  </div>
                  <ImageThumbnailList
                    images={f.imageUrls}
                    onPreview={onPreview}
                    altPrefix="Tiket"
                  />
                </div>
              ))
            ) : (
              <div className="p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                <p className="text-xs text-gray-400 italic">No Return Data</p>
              </div>
            )}
          </div>
        </div>

        {/* Hotels Row */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-100" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {t('hotel')}
            </p>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.hotels?.map((h, i) => (
              <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm font-black text-gray-900 mb-1">
                  {h.name} - {h.city}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  In: {h.checkIn ? moment(h.checkIn).format('DD MMM') : '-'} • Out:{' '}
                  {h.checkOut ? moment(h.checkOut).format('DD MMM') : '-'}
                </p>
                <ImageThumbnailList
                  images={h.imageUrls}
                  onPreview={onPreview}
                  altPrefix="Voucher"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Transport */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-100" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {t('transport')}
            </p>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.transportations?.map((t_item, i) => (
              <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm font-black text-gray-900 mb-1">
                  {t_item.company} ({t_item.type})
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {t_item.date ? moment(t_item.date).format('DD MMM YYYY') : '-'} • {t_item.from} -{' '}
                  {t_item.to}
                </p>
                <ImageThumbnailList
                  images={t_item.imageUrls}
                  onPreview={onPreview}
                  altPrefix="Bukti"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <Users className="h-4 w-4" /> {t('members')}
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50/50 text-gray-500 font-bold">
              <tr>
                <th className="p-4 border-b border-gray-100">{t('fullName')}</th>
                <th className="p-4 border-b border-gray-100">{t('passport')}</th>
                <th className="p-4 border-b border-gray-100">{t('documents')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {membersToShow.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{m.fullName || '-'}</p>
                    <p className="text-xs text-gray-400 uppercase font-black tracking-tighter">
                      {m.relation || '-'}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-mono text-xs font-bold text-blue-600">
                      {m.passportNumber || '-'}
                    </p>
                    <p className="text-[10px] text-gray-400">{m.nik || '-'}</p>
                  </td>
                  <td className="p-4">
                    <ImageThumbnailList
                      images={
                        [m.photoUrl, m.passportUrl, m.ktpUrl, m.visaUrl].filter(Boolean) as string[]
                      }
                      onPreview={onPreview}
                      altPrefix={m.fullName || 'Jamaah'}
                      className="!mt-0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
