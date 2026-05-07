import { IFlight, IHotel, ITransportation } from '@/packages/pilgrim/transaction/domain/transaction';

export interface ILeader {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface IMember {
  id: string;
  fullName: string;
  passportNumber: string;
  nik: string;
  relation: string;
  photoUrl?: string;
  ktpUrl?: string;
  passportUrl?: string;
}

export interface ISubmissionListItem {
  id: string;
  agencySlug: string;
  paymentStatus: 'PENDING' | 'CHECKING' | 'COMPLETED';
  verifyStatus: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED';
  totalAmount: number;
  createdAt: string;
  leader: ILeader;
  members: IMember[];
  proofOfPayment?: string;
  rejectionReason?: string;
  flights?: IFlight[];
  hotels?: IHotel[];
  transportations?: ITransportation[];
  resultSnapshot?: {
    memberStatuses?: Record<string, { valid: boolean; reason?: string }>;
    [key: string]: any;
  };
}

export interface ISubmissionListResponse {
  items: ISubmissionListItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export type ISubmissionResponse = ISubmissionListItem;

export interface IVerifyPaymentResponse {
  id: string;
  paymentStatus: 'COMPLETED';
  verifyStatus: 'IN_REVIEW';
}
