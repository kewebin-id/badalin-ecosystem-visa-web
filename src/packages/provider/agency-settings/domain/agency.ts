// Domain: Agency entity & response types
export interface IAgency {
  id: string;
  name: string;
  slug: string;
  visaPrice: string | number;
  visaCurrency?: string;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  status: string;
  isActive: boolean;
  isSlugSetup: boolean;
  lastSlugUpdate: string;
  newToken?: string;
}
