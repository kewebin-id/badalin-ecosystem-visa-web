import { Card } from '@/components/atoms';
import { ImageThumbnailList, InputTextarea } from '@/components/molecules';
import { ISubmissionListItem } from '@/packages/provider/submissions/domain/response';
import { Hotel, Plane, Truck, XCircle } from 'lucide-react';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { ValidationToggle } from './validation-toggle';

interface DetailLogisticsReviewProps {
  submission: ISubmissionListItem;
  capacityWarning: string | null;
  logisticsValid: boolean | null;
  setLogisticsValid: (valid: boolean | null) => void;
  logisticsReason: string;
  setLogisticsReason: (reason: string) => void;
  onPreview: (image: { src: string; alt: string }) => void;
  readOnly?: boolean;
}

export const DetailLogisticsReview = ({
  submission,
  capacityWarning,
  logisticsValid,
  setLogisticsValid,
  logisticsReason,
  setLogisticsReason,
  onPreview,
  readOnly,
}: DetailLogisticsReviewProps) => {
  const t = useTranslations('ProviderSubmissions.detail.logistics');
  const tq = useTranslations('ProviderSubmissions.quickReview');
  const ts = useTranslations('ProviderSubmissions.detail.sections');

  const departureFlights = (submission.flights || []).filter((f) => f.type === 'DEPARTURE');
  const returnFlights = (submission.flights || []).filter((f) => f.type === 'RETURN');

  return (
    <Card className="overflow-hidden border-2 border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-xl">
            <Plane className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">{ts('logistics')}</h3>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {/* Flights Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Departure */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-100" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {tq('departure')}
              </p>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            {departureFlights.map((f, i) => (
              <div key={i} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
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
                <div className="p-2 bg-white rounded-lg border border-dashed border-gray-200 mb-3 space-y-0.5">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">
                    ETD: {moment(f.etd).format('DD MMM YYYY, HH:mm')}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">
                    ETA: {moment(f.eta).format('DD MMM YYYY, HH:mm')}
                  </p>
                </div>
                <ImageThumbnailList images={f.imageUrls} onPreview={onPreview} altPrefix="Tiket" />
              </div>
            ))}
          </div>

          {/* Return */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-100" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {tq('return')}
              </p>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            {returnFlights.map((f, i) => (
              <div key={i} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
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
                <div className="p-2 bg-white rounded-lg border border-dashed border-gray-200 mb-3 space-y-0.5">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">
                    ETD: {moment(f.etd).format('DD MMM YYYY, HH:mm')}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">
                    ETA: {moment(f.eta).format('DD MMM YYYY, HH:mm')}
                  </p>
                </div>
                <ImageThumbnailList images={f.imageUrls} onPreview={onPreview} altPrefix="Tiket" />
              </div>
            ))}
          </div>
        </div>

        {/* Hotels Row */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-100" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {tq('hotel')}
            </p>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.hotels?.map((h, i) => (
              <div key={i} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <p className="text-sm font-black text-gray-900 mb-1">
                  {h.name} - {h.city}
                </p>
                <p className="text-xs text-gray-500 mb-3 font-medium">
                  In: {h.checkIn ? moment(h.checkIn).format('DD MMM') : '-'} • Out:{' '}
                  {h.checkOut ? moment(h.checkOut).format('DD MMM') : '-'}
                </p>
                <ImageThumbnailList images={h.imageUrls} onPreview={onPreview} altPrefix="Voucher" />
              </div>
            ))}
          </div>
        </div>

        {/* Transport Row */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-100" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {tq('transport')}
            </p>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.transportations?.map((trans, i) => (
              <div key={i} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <p className="text-sm font-black text-gray-900 mb-1">
                  {trans.company} ({trans.type})
                </p>
                <p className="text-xs text-gray-500 mb-3 font-medium">
                  {trans.date ? moment(trans.date).format('DD MMM YYYY') : '-'} • {trans.from} -{' '}
                  {trans.to}
                </p>
                <ImageThumbnailList
                  images={trans.imageUrls}
                  onPreview={onPreview}
                  altPrefix="Transport"
                />
              </div>
            ))}
          </div>
        </div>

        {capacityWarning && (
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-red-800 leading-tight">{capacityWarning}</p>
          </div>
        )}

        <div className="pt-4 space-y-6">
          <ValidationToggle
            isValid={logisticsValid}
            onToggle={setLogisticsValid}
            labels={{
              valid: t('match'),
              invalid: t('anomaly'),
            }}
            readOnly={readOnly}
          />
          <InputTextarea
            useLabelInside
            label={t('noteLabel')}
            placeholder={t('notePlaceholder')}
            value={logisticsReason}
            setValue={setLogisticsReason}
            disabled={readOnly || logisticsValid === true}
          />
        </div>
      </div>
    </Card>
  );
};
