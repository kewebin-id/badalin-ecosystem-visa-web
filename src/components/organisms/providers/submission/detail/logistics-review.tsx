'use client';

import { Card } from '@/components/atoms';
import { InputTextarea } from '@/components/molecules';
import { ISubmissionListItem } from '@/packages/provider/submissions/domain/response';
import { cn } from '@/shared/utils';
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
}

export const DetailLogisticsReview = ({
  submission,
  capacityWarning,
  logisticsValid,
  setLogisticsValid,
  logisticsReason,
  setLogisticsReason,
}: DetailLogisticsReviewProps) => {
  const t = useTranslations('ProviderSubmissions.detail.logistics');
  const ts = useTranslations('ProviderSubmissions.detail.sections');

  return (
    <Card className="overflow-hidden border-2 border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-xl">
            <Plane className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">
            3. {ts('logistics')}
          </h3>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t('flight')}
              </span>
            </div>
            {submission.flights?.map((flight, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm"
              >
                <p className="font-black text-gray-900">
                  {flight.carrier} ({flight.flightNo})
                </p>
                <p className="text-gray-500 font-medium">
                  {moment(flight.flightDate).format('DD MMM YYYY')} • {flight.type}
                </p>
              </div>
            ))}

            <div className="flex items-center gap-2 mt-6 mb-2">
              <Truck className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t('transport')}
              </span>
            </div>
            {submission.transportations?.map((trans, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm"
              >
                <p className="font-black text-gray-900">
                  {trans.company} ({trans.type})
                </p>
                <p className="text-gray-500 font-medium">
                  Dari {trans.from} ke {trans.to}
                </p>
                <p className="text-gray-500 font-medium">
                  {moment(trans.date).format('DD MMM YYYY')} pukul {trans.time}
                </p>
              </div>
            ))}

            {capacityWarning && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-red-800 leading-tight">
                  {capacityWarning}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Hotel className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t('hotel')}
              </span>
            </div>
            {submission.hotels?.map((hotel, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm"
              >
                <p className="font-black text-gray-900">
                  {hotel.name} - {hotel.city}
                </p>
                <p className="text-gray-500 font-medium">
                  {hotel.roomType} • RSV: {hotel.resvNo}
                </p>
                <p className="text-gray-500 font-medium">
                  In: {moment(hotel.checkIn).format('DD MMM')} • Out:{' '}
                  {moment(hotel.checkOut).format('DD MMM')}
                </p>
              </div>
            ))}

            <div className="pt-4 space-y-4">
              <ValidationToggle
                isValid={logisticsValid}
                onToggle={setLogisticsValid}
                labels={{
                  valid: t('match'),
                  invalid: t('anomaly'),
                }}
              />
              <InputTextarea
                useLabelInside
                label={t('noteLabel')}
                placeholder={t('notePlaceholder')}
                value={logisticsReason}
                setValue={setLogisticsReason}
                disabled={logisticsValid === true}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
