import { Badge } from '@/components/atoms/badge';
import { cn } from '@/shared/utils/index';
import { useTranslations } from 'next-intl';
import React from 'react';

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export const StatusBadge = ({ status, label: propLabel }: StatusBadgeProps) => {
  const t = useTranslations('TransactionHistory.statuses');

  const getStyles = () => {
    switch (status.toUpperCase()) {
      case 'SUBMIT':
        return {
          variant: 'default' as const,
          label: t('SUBMIT'),
          className: '',
        };
      case 'PROCESS':
      case 'IN_REVIEW':
        return {
          variant: 'warning' as const,
          label: t('IN_REVIEW'),
          className: '',
        };
      case 'VERIFIED':
        return {
          variant: 'ocean' as const,
          label: t('VERIFIED'),
          className: '',
        };
      case 'ISSUED':
        return {
          variant: 'success' as const,
          label: t('ISSUED'),
          className: 'bg-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.25)] border-emerald-400/30',
        };
      case 'EXPIRED':
      case 'REJECTED':
        return {
          variant: 'destructive' as const,
          label: t('REJECTED'),
          className: '',
        };
      case 'PENDING_PAYMENT':
        return {
          variant: 'warning' as const,
          label: 'Butuh Pembayaran',
          className: '',
        };
      case 'CHECKING_PAYMENT':
        return {
          variant: 'secondary' as const,
          label: 'Mengecek Pembayaran',
          className: '',
        };
      case 'REFUND_NEEDED':
      case 'BUTUH_REFUND':
        return {
          variant: 'destructive' as const,
          label: 'Butuh Refund',
          className: '',
        };
      default:
        return {
          variant: 'dark' as const,
          label: status,
          className: '',
        };
    }
  };

  const { variant, label: defaultLabel, className: statusClassName } = getStyles();

  return (
    <Badge
      variant={variant}
      className={cn(
        'px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-sm transition-all duration-300',
        statusClassName,
      )}
    >
      {propLabel || defaultLabel}
    </Badge>
  );
};
