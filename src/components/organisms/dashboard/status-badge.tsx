import React from 'react';
import { Badge } from '@/components/atoms/badge';
import { useTranslations } from 'next-intl';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const t = useTranslations('TransactionHistory.statuses');

  const getStyles = () => {
    switch (status.toUpperCase()) {
      case 'SUBMIT':
        return {
          variant: 'default' as const,
          label: t('SUBMIT'),
        };
      case 'PROCESS':
      case 'IN_REVIEW':
        return {
          variant: 'warning' as const,
          label: t('IN_REVIEW'),
        };
      case 'VERIFIED':
        return {
          variant: 'ocean' as const,
          label: t('VERIFIED'),
        };
      case 'ISSUED':
        return {
          variant: 'success' as const,
          label: t('ISSUED'),
        };
      case 'EXPIRED':
      case 'REJECTED':
        return {
          variant: 'destructive' as const,
          label: t('REJECTED'),
        };
      default:
        return {
          variant: 'dark' as const,
          label: status,
        };
    }
  };

  const { variant, label } = getStyles();

  return (
    <Badge
      variant={variant}
      className="px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-sm"
    >
      {label}
    </Badge>
  );
};
