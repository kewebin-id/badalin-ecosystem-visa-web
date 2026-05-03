import { ProviderSubmission } from '@/packages/provider/submissions/domain/entities';

export const PROVIDER_SUBMISSIONS: ProviderSubmission[] = [
  {
    id: "TRX-20250310-001",
    leaderName: "Ahmad Fauzi",
    totalMembers: 4,
    paymentStatus: "PENDING",
    reviewStatus: "PENDING",
    amount: 15000000,
    pilgrims: [
      {
        id: 'P-001',
        name: 'Ahmad Fauzi',
        passportNo: 'A1234567',
        nik: '3201234567890001',
        passportUrl: 'https://via.placeholder.com/600x400?text=Passport+Ahmad',
        ktpUrl: 'https://via.placeholder.com/600x400?text=KTP+Ahmad',
      },
      {
        id: 'P-002',
        name: 'Siti Aminah',
        passportNo: 'A7654321',
        nik: '3201234567890002',
        passportUrl: 'https://via.placeholder.com/600x400?text=Passport+Siti',
        ktpUrl: 'https://via.placeholder.com/600x400?text=KTP+Siti',
      },
    ],
  },
  {
    id: "TRX-20250310-002",
    leaderName: "Dewi Kartika",
    totalMembers: 2,
    paymentStatus: "CHECKING",
    reviewStatus: "VERIFIED",
    paymentProofUrl: "https://via.placeholder.com/300x400?text=Bukti+Transfer+Dewi",
    amount: 7500000,
  },
  {
    id: "TRX-20250310-003",
    leaderName: "Siti Nurhaliza",
    totalMembers: 6,
    paymentStatus: "COMPLETED",
    reviewStatus: "REJECTED",
    paymentProofUrl: "https://via.placeholder.com/300x400?text=Bukti+Transfer+Siti",
    rejectionReason: "Foto KTP buram",
    amount: 22500000,
  },
  {
    id: "TRX-20250310-004",
    leaderName: "Budi Santoso",
    totalMembers: 1,
    paymentStatus: "COMPLETED",
    reviewStatus: "VERIFIED",
    paymentProofUrl: "https://via.placeholder.com/300x400?text=Bukti+Transfer+Budi",
    amount: 3750000,
  },
];
