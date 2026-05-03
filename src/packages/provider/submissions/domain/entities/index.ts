export interface Pilgrim {
  id: string;
  name: string;
  passportNo: string;
  nik: string;
  passportUrl: string;
  ktpUrl: string;
}

export interface ProviderSubmission {
  id: string;
  leaderName: string;
  totalMembers: number;
  paymentStatus: 'PENDING' | 'CHECKING' | 'COMPLETED';
  reviewStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  paymentProofUrl?: string;
  rejectionReason?: string;
  amount: number;
  pilgrims?: Pilgrim[];
}
