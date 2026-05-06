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
}

export interface ISubmissionListResponse {
  data: ISubmissionListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export type ISubmissionResponse = ISubmissionListItem;

export interface IVerifyPaymentResponse {
  id: string;
  paymentStatus: 'COMPLETED';
  verifyStatus: 'IN_REVIEW';
}
