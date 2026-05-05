import { Badge } from '@/components/atoms';
import { useTranslations } from 'next-intl';
import { ProviderSubmission } from '@/packages/provider/submissions/domain/entities';
import { cn } from '@/shared/utils';

interface BadgeConfig {
  label: string;
  className: string;
  dotClassName: string;
}

export const PaymentStatusBadge = ({ status }: { status: ProviderSubmission['paymentStatus'] }) => {
  const t = useTranslations('ProviderSubmissions.status');

  const config: Record<ProviderSubmission['paymentStatus'], BadgeConfig> = {
    PENDING: {
      label: t('pending'),
      className: 'bg-slate-100 text-slate-600 border-slate-200',
      dotClassName: 'bg-slate-400',
    },
    CHECKING: {
      label: t('checking'),
      className: 'bg-amber-50 text-amber-600 border-amber-100',
      dotClassName: 'bg-amber-400',
    },
    COMPLETED: {
      label: t('completed'),
      className: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      dotClassName: 'bg-emerald-400',
    },
  };

  const current = config[status];

  return (
    <Badge className={cn('rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', current.className)}>
      <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', current.dotClassName)} />
      {current.label}
    </Badge>
  );
};

export const ReviewStatusBadge = ({ status }: { status: ProviderSubmission['reviewStatus'] }) => {
  const t = useTranslations('ProviderSubmissions.status');

  const config: Record<ProviderSubmission['reviewStatus'], BadgeConfig> = {
    IN_REVIEW: {
      label: t('inReview'),
      className: 'bg-blue-50 text-blue-600 border-blue-100',
      dotClassName: 'bg-blue-400',
    },
    VERIFIED: {
      label: t('verified'),
      className: 'bg-teal-50 text-teal-600 border-teal-100',
      dotClassName: 'bg-teal-400',
    },
    REJECTED: {
      label: t('rejected'),
      className: 'bg-rose-50 text-rose-600 border-rose-100',
      dotClassName: 'bg-rose-400',
    },
  };

  const current = config[status];

  return (
    <Badge className={cn('rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', current.className)}>
      <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', current.dotClassName)} />
      {current.label}
    </Badge>
  );
};
