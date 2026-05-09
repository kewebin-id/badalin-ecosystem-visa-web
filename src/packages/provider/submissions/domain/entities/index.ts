import {
  IFlight,
  IHotel,
  ITransportation,
} from '@/packages/pilgrim/transaction/domain/transaction';

export interface Pilgrim {
  id: string;
  name: string;
  passportNo: string;
  nik: string;
  passportUrl: string;
  ktpUrl: string;
  photoUrl: string;
}

export interface ProviderSubmission {
  id: string;
  leaderName: string;
  totalMembers: number;
  paymentStatus: 'PENDING' | 'CHECKING' | 'COMPLETED';
  reviewStatus: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | 'ISSUED';
  paymentProofUrl?: string;
  rejectionReason?: string;
  amount: number;
  pilgrims?: Pilgrim[];
  flights?: IFlight[];
  hotels?: IHotel[];
  transportations?: ITransportation[];
}
