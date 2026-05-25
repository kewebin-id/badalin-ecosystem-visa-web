import { Skeleton } from '@/components/atoms/skeleton';
import { InputFile } from '@/components/molecules/input/file';
import { InputTextarea } from '@/components/molecules/input/text/area';
import { useManagementController } from '@/packages/pilgrim/management/presentation/controller';
import { TWizardForm } from '@/packages/pilgrim/transaction/presentation/controller';
import { cn } from '@/shared/utils';
import { formatDate } from '@/shared/utils/formattor';
import { motion } from 'framer-motion';
import { Calendar, Car, ChevronDown, Hotel, Info, Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface SummaryFormProps {
  totalAmount?: number;
  currency?: string;
  breakdown?: string;
  isLoading?: boolean;
}

export const SummaryForm = ({
  totalAmount,
  currency = 'IDR',
  breakdown,
  isLoading,
}: SummaryFormProps) => {
  const t = useTranslations('VisaTransaction');
  const tDashboard = useTranslations('PilgrimManagement');
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<TWizardForm>();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { useMembers } = useManagementController();
  const { members } = useMembers({ page: 1, limit: 100 });

  const formValues = watch();
  const selectedIds = watch('pilgrimIds') || [];
  const selectedMembersCount = selectedIds.length;

  const selectedMembers = useMemo(() => {
    return members.filter((m) => selectedIds.includes(m.id));
  }, [members, selectedIds]);

  const DetailRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: import('lucide-react').LucideIcon;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2">
      <div className="mt-0.5 p-1.5 bg-primary-default/5 rounded-lg">
        <Icon className="size-3.5 text-primary-default" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-tight">
          {label}
        </p>
        <div className="text-xs font-semibold text-foreground truncate">{value}</div>
      </div>
    </div>
  );

  const FileList = ({ urls, label }: { urls: string[]; label: string }) => {
    if (!urls || urls.length === 0) return null;
    return (
      <InputFile
        label={label}
        value={urls.map((url, i) => ({ name: `File ${i + 1}`, base64: url }))}
        onChange={() => {}}
        disabled
        maxFiles={urls.length}
        className="px-2"
      />
    );
  };

  const displayDateFormat = 'DD MMMM YYYY HH:mm';

  return (
    <div className="space-y-6">
      <InputTextarea
        label={t('form.additionalNotes')}
        placeholder={t('form.notesPlaceholder')}
        register={register}
        name="notes"
        errorMessage={errors.notes?.message}
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-default rounded-xl shadow-lg shadow-primary-default/20">
              <Info className="size-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-900">{t('form.summaryTitle')}</h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-default">
              {tDashboard('familyGroup')}
            </p>
            <p className="text-lg font-black text-foreground">
              {t('form.membersCount', { count: selectedMembersCount })}
            </p>
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-24 w-full rounded-2xl" />
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <Skeleton className="h-6 w-32 rounded" />
                <Skeleton className="h-8 w-40 rounded" />
              </div>
            </div>
          ) : (
            <>
              <motion.div
                animate={{ height: isExpanded ? 'auto' : 120 }}
                className={cn(
                  'overflow-hidden transition-all duration-500 ease-in-out',
                  !isExpanded &&
                    'relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-12 after:bg-linear-to-t after:from-white after:to-transparent',
                )}
              >
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">
                      {t('form.flightLogistics')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <DetailRow
                        icon={Plane}
                        label={t('form.departureSection')}
                        value={`${formValues.departureCarrier} (${formValues.departureFlightNo}) - ${formatDate(formValues.departureFlightEta, displayDateFormat, false)}`}
                      />
                      <DetailRow
                        icon={Plane}
                        label={t('form.returnSection')}
                        value={`${formValues.returnCarrier} (${formValues.returnFlightNo}) - ${formatDate(formValues.returnFlightEta, displayDateFormat, false)}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">
                      {t('form.hotelAccommodation')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <DetailRow
                        icon={Hotel}
                        label={tDashboard('makkah')}
                        value={`${formValues.hotelMakkahName} (${formatDate(formValues.hotelMakkahCheckIn, displayDateFormat, false)})`}
                      />
                      <DetailRow
                        icon={Hotel}
                        label={tDashboard('madinah')}
                        value={`${formValues.hotelMadinahName} (${formatDate(formValues.hotelMadinahCheckIn, displayDateFormat, false)})`}
                      />
                    </div>
                  </div>

                  {formValues.transportations && formValues.transportations.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">
                        {t('form.domesticTransport')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {formValues.transportations.map((trans, idx) => (
                          <DetailRow
                            key={idx}
                            icon={Car}
                            label={`${t(`form.transportTypeOptions.${trans.type}`)} - ${trans.from} \u2794 ${trans.to}`}
                            value={`${trans.company} (${trans.total} ${t('form.vehicles')}) - ${formatDate(trans.date, displayDateFormat, false)}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {(formValues.rawdahMenTime || formValues.rawdahWomenTime) && (
                    <div className="space-y-1 pt-2">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">
                        {t('form.rawdahSection')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {formValues.rawdahMenTime && (
                          <DetailRow
                            icon={Calendar}
                            label={tDashboard('male')}
                            value={formatDate(formValues.rawdahMenTime, displayDateFormat, false)}
                          />
                        )}
                        {formValues.rawdahWomenTime && (
                          <DetailRow
                            icon={Calendar}
                            label={tDashboard('female')}
                            value={formatDate(formValues.rawdahWomenTime, displayDateFormat, false)}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 pt-2">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">
                      {t('detail.pilgrimList')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedMembers.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl"
                        >
                          <div className="size-8 rounded-full bg-primary-default/10 flex items-center justify-center text-primary-default font-bold text-xs">
                            {m.fullName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">
                              {m.fullName}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium">
                              {m.passportNumber} • {tDashboard(`relations.${m.relation}`)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-50">
                    <p className="text-[10px] font-black text-primary-default uppercase tracking-widest px-2">
                      {t('form.uploadedDocuments')}
                    </p>
                    <FileList
                      urls={formValues.departureTicketUrls}
                      label={t('form.departureSection')}
                    />
                    <FileList urls={formValues.returnTicketUrls} label={t('form.returnSection')} />
                    <FileList
                      urls={formValues.hotelMakkahVoucherUrls}
                      label={tDashboard('makkah')}
                    />
                    <FileList
                      urls={formValues.hotelMadinahVoucherUrls}
                      label={tDashboard('madinah')}
                    />
                    {formValues.transportations?.map((t, i) => (
                      <FileList
                        key={i}
                        urls={t.imageUrls || []}
                        label={`${tDashboard('transport')} #${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-center -mt-4 relative z-10">
                <motion.button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-white border border-gray-100 shadow-xl rounded-full p-2 text-primary-default hover:bg-primary-default hover:text-white transition-colors group"
                >
                  <ChevronDown
                    className={cn(
                      'size-5 transition-transform duration-500',
                      isExpanded ? 'rotate-180' : '',
                    )}
                  />
                </motion.button>
              </div>

              <div className="p-6 bg-linear-to-br from-primary-600 to-primary-700 text-white mt-4 border-t-4 border-white/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                      {t('form.estimatedTotal')}
                    </p>
                    <h2 className="text-3xl font-black tracking-tight">
                      {new Intl.NumberFormat(
                        currency.toUpperCase() === 'USD'
                          ? 'en-US'
                          : currency.toUpperCase() === 'SAR'
                            ? 'ar-SA'
                            : 'id-ID',
                        {
                          style: 'currency',
                          currency: currency.toUpperCase(),
                          minimumFractionDigits: 0,
                        },
                      ).format(totalAmount || 0)}
                    </h2>
                  </div>
                  {breakdown && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3 w-full md:w-auto">
                      <div className="p-2 bg-white/20 rounded-xl">
                        <Info className="size-4 text-white" />
                      </div>
                      <p className="text-[11px] font-bold text-white/90 leading-snug">
                        {breakdown}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
