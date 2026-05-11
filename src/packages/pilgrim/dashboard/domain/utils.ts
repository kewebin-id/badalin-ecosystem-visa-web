import { IVisaHistory } from './index';

export const getSeasonConfig = (transaction: IVisaHistory, locale: string = 'id') => {
  const date = transaction.destinationDate ? new Date(transaction.destinationDate) : new Date();
  const month = date.getMonth();
  const year = date.getFullYear();

  const isHaji2026 = year === 2026 && (month === 5 || month === 6);

  if (isHaji2026) {
    return {
      title: locale === 'id' ? 'Visa Musim Haji 1447H' : 'Haji Season Visa 1447H',
      themeColor: 'text-amber-600 bg-amber-50',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    };
  }

  return {
    title: locale === 'id' ? 'Layanan Visa Umrah' : 'Umrah Visa Service',
    themeColor: 'text-primary-default bg-primary-lighter',
    iconColor: 'text-primary-default',
    iconBg: 'bg-primary-lighter',
  };
};
