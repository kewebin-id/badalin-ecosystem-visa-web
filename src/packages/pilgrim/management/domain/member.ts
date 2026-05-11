export type FamilyMemberStatus = 'Lengkap' | 'Belum Lengkap' | 'Non-Aktif';

export type TRelation = 'SELF' | 'SPOUSE' | 'FATHER' | 'MOTHER' | 'CHILD' | 'SIBLING';

export interface IFamilyMember {
  id: string;
  fullName: string;
  passportNumber: string;
  passportExpiry: string;
  dob: string;
  nik: string;
  gender: 'Male' | 'Female';
  maritalStatus: string;
  relation: string;
  isComplete: boolean;
  selfieUrl?: string;
  ktpUrl?: string;
  passportUrl?: string;
  bukuNikahUrl?: string;
  akteKelahiranUrl?: string;
  employmentCertificateUrl?: string;
  ocrConfidence?: number;
}

export interface IPaginatedPilgrims {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: IFamilyMember[];
  links: {
    prev: string | null;
    next: string | null;
  };
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface INusukCompatibility {
  score: number;
  status: 'SAFE' | 'WARNING' | 'REJECTED';
  glare_detected: boolean;
  message: string;
}

export interface IOCRPasportData {
  fullName: string;
  passportNumber: string;
  birthDate: string;
  passportExpiry: string;
  confidence: number;
  nusuk_compatibility?: INusukCompatibility;
}

export interface IOCRIDCardData {
  fullName: string;
  nik: string;
  gender: string;
  maritalStatus: string;
  confidence: number;
  nusuk_compatibility?: INusukCompatibility;
}

export interface IUploadResponse {
  publicUrl: string;
  ocr?: IOCRPasportData | IOCRIDCardData;
}

export interface IApiFamilyMember {
  id: string;
  leaderId?: string;
  agencySlug?: string;
  fullName: string;
  passportNumber: string;
  passportExpiry: string;
  dob: string;
  birthDate?: string; // API Detail Response
  nik: string;
  gender: 'Male' | 'Female';
  relation: string;
  maritalStatus: string;
  uniformSize: string | null;
  isComplete: boolean;
  photoUrl?: string;
  ktpUrl?: string;
  passportUrl?: string;
  bukuNikahUrl?: string;
  akteKelahiranUrl?: string;
  employmentCertificateUrl?: string;
  ocrConfidence?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IApiPaginatedPilgrims {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: IApiFamilyMember[];
  links: {
    prev: string | null;
    next: string | null;
  };
}

export interface IApiCreateMemberRequest {
  fullName: string;
  passportNumber: string;
  passportExpiry: string;
  birthDate: string;
  nik: string;
  gender: 'Male' | 'Female';
  maritalStatus: string;
  relation: string;
  photoUrl?: string;
  ktpUrl?: string;
  passportUrl?: string;
  employmentCertificateUrl?: string;
  ocrConfidence?: number;
}

export interface IApiUpdateMemberRequest {
  id: string;
  fullName?: string;
  passportNumber?: string;
  passportExpiry?: string;
  birthDate?: string;
  nik?: string;
  gender?: 'Male' | 'Female';
  maritalStatus?: string;
  relation?: string;
  photoUrl?: string;
  ktpUrl?: string;
  passportUrl?: string;
  employmentCertificateUrl?: string;
}

export const RELATIONS: TRelation[] = ['SELF', 'SPOUSE', 'FATHER', 'MOTHER', 'CHILD', 'SIBLING'];

export const MARITAL_STATUSES = ['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati'];

export const RELATION_MAP: Record<string, TRelation> = {
  'Saya Sendiri': 'SELF',
  SELF: 'SELF',
  Istri: 'SPOUSE',
  Suami: 'SPOUSE',
  SPOUSE: 'SPOUSE',
  Anak: 'CHILD',
  CHILD: 'CHILD',
  Ayah: 'FATHER',
  FATHER: 'FATHER',
  Ibu: 'MOTHER',
  MOTHER: 'MOTHER',
  'Saudara Kandung': 'SIBLING',
  SIBLING: 'SIBLING',
};

export const REVERSE_RELATION_MAP: Record<TRelation, string> = {
  SELF: 'SELF',
  SPOUSE: 'SPOUSE',
  FATHER: 'FATHER',
  MOTHER: 'MOTHER',
  CHILD: 'CHILD',
  SIBLING: 'SIBLING',
};

export const MARITAL_STATUS_MAP: Record<string, string> = {
  'Belum Menikah': 'Single',
  Single: 'Single',
  Menikah: 'Married',
  Married: 'Married',
  'Cerai Hidup': 'Divorced',
  Divorced: 'Divorced',
  'Cerai Mati': 'Widowed',
  Widowed: 'Widowed',
};

export const REVERSE_MARITAL_STATUS_MAP: Record<string, string> = {
  Single: 'Belum Menikah',
  SINGLE: 'Belum Menikah',
  Married: 'Menikah',
  MARRIED: 'Menikah',
  Divorced: 'Cerai Hidup',
  DIVORCED: 'Cerai Hidup',
  Widowed: 'Cerai Mati',
  WIDOWED: 'Cerai Mati',
};
