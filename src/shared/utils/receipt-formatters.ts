// import { IReceiptItem } from '@/packages/execution/dto';
import { formatRupiah } from './currency';

/**
 * Format currency untuk receipt
 */
export const formatReceiptCurrency = (amount: number): string => {
  return formatRupiah(amount, '.');
};

/**
 * Format date untuk receipt (DD/MM/YYYY)
 */
export const formatReceiptDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Format date dengan bulan nama (15 Jan 2025)
 */
export const formatReceiptDateLong = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Format datetime untuk created date (DD/MM/YYYY HH:mm)
 */
export const formatReceiptDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Category label mapping
 */
export const categoryLabels: Record<string, string> = {
  FUEL: 'Bahan Bakar',
  TOLL: 'Tol',
  PARKING: 'Parkir',
  DRIVER: 'Driver',
  VEHICLE_MAINTENANCE: 'Perawatan Kendaraan',
  SEWA: 'Sewa Kendaraan',
  OTHER: 'Lainnya',
};

/**
 * Funding source label mapping
 */
export const fundingSourceLabels: Record<string, string> = {
  DRIVER_CASH: 'Driver Cash',
  MODE_B: 'Mode-B (Pribadi)',
  VENDOR: 'Vendor',
  OPERATIONAL: 'Operasional',
  COMPANY_TO_VENDOR: 'Company to Vendor (Non-Cash)',
};

/**
 * Category badge color mapping
 */
export const categoryBadgeColors: Record<string, string> = {
  FUEL: 'bg-orange-100 text-orange-800 border-orange-200',
  TOLL: 'bg-blue-100 text-blue-800 border-blue-200',
  PARKING: 'bg-green-100 text-green-800 border-green-200',
  DRIVER: 'bg-purple-100 text-purple-800 border-purple-200',
  VEHICLE_MAINTENANCE: 'bg-gray-100 text-gray-800 border-gray-200',
  SEWA: 'bg-blue-100 text-blue-800 border-blue-200',
  OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
};

/**
 * Funding source badge color mapping
 */
export const fundingSourceBadgeColors: Record<string, string> = {
  DRIVER_CASH: 'bg-blue-50 text-blue-700 border-blue-200',
  MODE_B: 'bg-green-50 text-green-700 border-green-200',
  VENDOR: 'bg-purple-50 text-purple-700 border-purple-200',
  OPERATIONAL: 'bg-orange-50 text-orange-700 border-orange-200',
  COMPANY_TO_VENDOR: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export const getItemStatus = (item: {
  status?: string;
}): 'PENDING' | 'APPROVED' | 'REJECTED' | 'EDITED' => {
  if (item.status === 'APPROVED' || item.status === 'VERIFIED') return 'APPROVED';
  if (item.status === 'REJECTED') return 'REJECTED';
  if (item.status === 'EDITED') return 'EDITED';
  return 'PENDING';
};
