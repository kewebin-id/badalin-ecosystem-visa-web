import { Button } from '@/components/atoms';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Clock, Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TransactionFormFooterProps {
  step: number;
  prevStep: () => void;
  nextStep: () => void;
  isStepValid: boolean;
  isValidated: boolean;
  isPending: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  id?: string | null;
  apiErrors: string[];
  formErrors: any;
  onShowErrors: () => void;
}

export const TransactionFormFooter = ({
  step,
  prevStep,
  nextStep,
  isStepValid,
  isValidated,
  isPending,
  isCreating,
  isUpdating,
  id,
  apiErrors,
  formErrors,
  onShowErrors,
}: TransactionFormFooterProps) => {
  const t = useTranslations('VisaTransaction');
  const tCommon = useTranslations('Common');

  const errorCount = apiErrors.length + Object.keys(formErrors).length;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 shadow-sm p-6 bg-white">
      {errorCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            type="button"
            onClick={onShowErrors}
            className="group flex items-center gap-2 px-4 py-2 bg-danger-50 border border-danger-100 rounded-full shadow-lg shadow-danger-500/10 hover:bg-danger-100 transition-all active:scale-95 w-fit"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-white group-hover:scale-110 transition-transform">
              <AlertCircle className="size-3.5" />
            </div>
            <span className="text-xs font-bold text-danger-700">
              {t('validationErrorTitle')} ({errorCount})
            </span>
            <div className="h-4 w-[1px] bg-danger-200 mx-1" />
            <span className="text-[10px] font-black uppercase tracking-widest text-danger-500 group-hover:translate-x-0.5 transition-transform">
              {tCommon('detail')} ➔
            </span>
          </button>
        </motion.div>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button type="button" variant="primaryOutline" onClick={prevStep} className="flex-1">
            <ArrowLeft className="size-4 mr-2" /> {tCommon('back')}
          </Button>
        )}
        {step < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid || isPending}
            className="flex-1"
          >
            {tCommon('continue')} <ArrowRight className="size-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!isValidated || isCreating || isUpdating || isPending}
            className="flex-1 shadow-lg shadow-primary-500/20"
          >
            {isCreating || isUpdating ? (
              <Clock className="size-4 mr-2 animate-spin" />
            ) : (
              <Plane className="size-4 mr-2" />
            )}
            {id ? tCommon('edit') : t('addTransaction')}
          </Button>
        )}
      </div>
    </div>
  );
};
