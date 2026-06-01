import { AlertCircle, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DialogDrawer } from '@/components/molecules';

interface TransactionErrorDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  errors: any;
  apiErrors: string[];
  apiWarnings: string[];
}

export const TransactionErrorDrawer = ({
  open,
  setOpen,
  errors,
  apiErrors,
  apiWarnings,
}: TransactionErrorDrawerProps) => {
  const t = useTranslations('VisaTransaction');
  const tDashboard = useTranslations('PilgrimManagement');

  const getFieldLabel = (key: string) => {
    const mapping: Record<string, string> = {
      pilgrimIds: tDashboard('familyGroup'),
      departureFlightNo: `${t('form.departureSection')} - ${t('form.flightNo')}`,
      departureCarrier: `${t('form.departureSection')} - ${t('form.carrier')}`,
      departureFlightEta: `${t('form.departureSection')} - ${t('form.flightEta')}`,
      departureFlightEtd: `${t('form.departureSection')} - ${t('form.flightEtd')}`,
      returnFlightNo: `${t('form.returnSection')} - ${t('form.flightNo')}`,
      returnCarrier: `${t('form.returnSection')} - ${t('form.carrier')}`,
      returnFlightEta: `${t('form.returnSection')} - ${t('form.flightEta')}`,
      returnFlightEtd: `${t('form.returnSection')} - ${t('form.flightEtd')}`,
      hotelMakkahName: t('form.hotelMakkahName'),
      hotelMakkahResvNo: t('form.hotelMakkahResvNo'),
      hotelMakkahCheckIn: `${tDashboard('makkah')} - ${t('form.hotelCheckin')}`,
      hotelMakkahCheckOut: `${tDashboard('makkah')} - ${t('form.hotelCheckout')}`,
      hotelMadinahName: t('form.hotelMadinahName'),
      hotelMadinahResvNo: t('form.hotelMadinahResvNo'),
      hotelMadinahCheckIn: `${tDashboard('madinah')} - ${t('form.hotelCheckin')}`,
      hotelMadinahCheckOut: `${tDashboard('madinah')} - ${t('form.hotelCheckout')}`,
      departureTicketUrls: t('form.uploadDepartureTicket'),
      returnTicketUrls: t('form.uploadReturnTicket'),
      hotelMakkahVoucherUrls: t('form.uploadHotelMakkah'),
      hotelMadinahVoucherUrls: t('form.uploadHotelMadinah'),
    };

    const label =
      mapping[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

    return (
      <span className="inline-flex items-center">
        <span className="text-danger-500 mr-1 font-black">*</span>
        {label}
      </span>
    );
  };

  const flattenErrors = (
    errorsObj: Record<string, any>,
    prefix = '',
  ): { key: string; message: string }[] => {
    return Object.entries(errorsObj).reduce(
      (acc: { key: string; message: string }[], [key, value]) => {
        const currentPath = prefix ? `${prefix}.${key}` : key;
        const val = value as Record<string, any> | undefined;

        if (val && typeof val.message === 'string') {
          acc.push({ key: currentPath, message: val.message });
        } else if (typeof val === 'object' && val !== null) {
          acc.push(...flattenErrors(val, currentPath));
        }
        return acc;
      },
      [],
    );
  };

  return (
    <DialogDrawer
      open={open}
      setOpen={setOpen}
      title={t('validationErrorTitle')}
      description={t('validationErrorDesc')}
      cancelButton={t('fixErrors')}
      onCancel={() => setOpen(false)}
    >
      <div className="space-y-4">
        <div className="bg-danger-50 border border-danger-100 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="size-5 text-danger-500 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-danger-900">
              {t('form.validationRequiredBanner')}
            </p>
            <p className="text-xs text-danger-700">{t('form.validationRequiredDesc')}</p>
          </div>
        </div>
        <div className="space-y-2">
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {t('form.formIssues')}
              </p>
              <ul className="list-disc list-inside space-y-1">
                {flattenErrors(errors).map((err) => (
                  <li key={err.key} className="text-sm text-gray-600">
                    <span className="font-semibold">{getFieldLabel(err.key)}</span>: {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {apiErrors.length > 0 && (
            <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {t('form.systemBusinessRules')}
              </p>
              <ul className="list-disc list-inside space-y-2">
                {apiErrors.map((error: string, idx: number) => (
                  <li key={idx} className="text-sm text-danger-600 font-medium leading-relaxed">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {apiWarnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 mt-4">
              <AlertCircle className="size-5 text-amber-500 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-900 uppercase">
                  {t('form.attentionWarnings')}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {apiWarnings.map((warning: string, idx: number) => (
                    <li key={idx} className="text-[11px] text-amber-800 leading-tight">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 mt-4">
            <Info className="size-5 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700 font-medium leading-relaxed">
              {t('form.stepInstructions')}
            </p>
          </div>
        </div>
      </div>
    </DialogDrawer>
  );
};
