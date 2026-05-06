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
        return {
          variant: 'warning' as const,
          label: t('PROCESS'),
        };
      case 'ISSUED':
        return {
          variant: 'ocean' as const,
          label: t('ISSUED'),
        };
      case 'EXPIRED':
        return {
          variant: 'destructive' as const,
          label: t('EXPIRED'),
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
