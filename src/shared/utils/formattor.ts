import moment from 'moment';
import 'moment/locale/id';
import { isNumber, isString } from './validator';

export const thousandFormat = (value: number | string): string => {
  if (value === null || value === undefined) return '';

  const number = Number(value);
  if (isNaN(number)) return String(value);

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatDate = (
  dateString: string | Date,
  format?: string,
  relative: boolean = true,
): string => {
  if (!dateString) return '-';

  const date = moment(dateString).locale('id');
  const now = moment();

  const diffInHours = Math.abs(now.diff(date, 'hours'));

  if (relative && diffInHours < 24) {
    return date.fromNow();
  }

  return date.format(format || 'D MMMM YYYY');
};

export const toSeoSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

export const parseNumberParam = (value: unknown): number | undefined => {
  if (isNumber(String(value))) {
    return Number(value);
  }

  return undefined;
};

export const parseStringParam = (value: unknown): string | undefined => {
  if (isString(value) && value.trim()) {
    return value.trim();
  }
  return undefined;
};

export const currencyFormat = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
