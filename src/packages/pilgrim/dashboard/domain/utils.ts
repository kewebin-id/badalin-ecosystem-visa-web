import { IVisaHistory } from './index';

export const getSeasonConfig = (transaction: IVisaHistory, locale: string = 'id') => {
  const date = transaction.destinationDate ? new Date(transaction.destinationDate) : new Date();

  const hijriMonthNumeric = parseInt(
    new Intl.DateTimeFormat('en-US-u-ca-islamic', { month: 'numeric' }).format(date),
  );
  const hijriYear = new Intl.DateTimeFormat('en-US-u-ca-islamic', { year: 'numeric' }).format(date);
  const hijriMonthName = new Intl.DateTimeFormat(`${locale}-ID-u-ca-islamic`, {
    month: 'long',
  }).format(date);

  if (hijriMonthNumeric === 12) {
    return {
      title: locale === 'id' ? `Visa Musim Haji ${hijriYear}` : `Haji Season Visa ${hijriYear}`,
      themeColor: 'text-amber-600 bg-amber-50',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    };
  }

  if (hijriMonthNumeric === 9) {
    return {
      title: locale === 'id' ? 'Layanan Visa Ramadhan' : 'Ramadan Visa Service',
      themeColor: 'text-emerald-600 bg-emerald-50',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    };
  }

  return {
    title: locale === 'id' ? `Visa Umrah ${hijriMonthName}` : `Umrah Visa ${hijriMonthName}`,
    themeColor: 'text-primary-default bg-primary-lighter',
    iconColor: 'text-primary-default',
    iconBg: 'bg-primary-lighter',
  };
};

export const getAccommodationDuration = (hotels: IVisaHistory['hotels']) => {
  if (!hotels || hotels.length === 0) return 0;

  let firstCheckIn = new Date(hotels[0].checkIn);
  let lastCheckOut = new Date(hotels[0].checkOut);

  hotels.forEach((hotel) => {
    const checkIn = new Date(hotel.checkIn);
    const checkOut = new Date(hotel.checkOut);
    if (checkIn < firstCheckIn) firstCheckIn = checkIn;
    if (checkOut > lastCheckOut) lastCheckOut = checkOut;
  });

  const diffTime = Math.abs(lastCheckOut.getTime() - firstCheckIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
