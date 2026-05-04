import { FileSearch, Clock, CheckCircle2 } from 'lucide-react';
import { TPaymentStatus } from './transaction';

export const TRANSPORT_CATEGORIES = [
  'Bandara → Hotel (Arrival)',
  'Hotel → Masjidil Haram',
  'Hotel → Madinah',
  'Madinah → Hotel',
  'Hotel → Bandara (Departure)',
];

export const VEHICLE_TYPES = [
  'Bus Standar (45 Kursi)',
  'Bus VIP (30 Kursi)',
  'GMC Sequoia (SUV)',
  'Hyundai H1 (Van)',
  'Toyota Hiace (Van)',
  'Private Car (Toyota Camry)',
];

export const PAYMENT_STEPS = [
  { key: 'PENDING', label: 'Submit', icon: FileSearch },
  { key: 'CHECKING', label: 'Checking', icon: Clock },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
] as const;

export const TRANSACTION_STATUS_MAP: Record<string, string> = {
  Submit: 'bg-info/10 text-info',
  Process: 'bg-warning/10 text-warning',
  Issued: 'bg-success/10 text-success',
  Expired: 'bg-destructive/10 text-destructive',
  IN_REVIEW: 'bg-warning/10 text-warning',
};
