export type FamilyMemberStatus = 'Lengkap' | 'Belum Lengkap' | 'Non-Aktif';

export type TRelation =
  | 'SELF'
  | 'SPOUSE'
  | 'FATHER'
  | 'MOTHER'
  | 'CHILD'
  | 'SIBLING';

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

export interface ICreateMemberRequest extends Omit<IFamilyMember, 'id' | 'isComplete'> {
  ocrConfidence?: number;
}

export interface IUpdateMemberRequest extends Partial<ICreateMemberRequest> {
  id: string;
}

export interface IOCRPasportData {
  fullName: string;
  passportNumber: string;
  birthDate: string;
  passportExpiry: string;
  confidence: number;
}

export interface IOCRIDCardData {
  fullName: string;
  nik: string;
  gender: string;
  maritalStatus: string;
  confidence: number;
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
  dob: string;
  nik: string;
  gender: 'Male' | 'Female';
  maritalStatus: string;
  relation: string;
  photoUrl?: string;
  ktpUrl?: string;
  passportUrl?: string;
  ocrConfidence?: number;
}

export interface IApiUpdateMemberRequest {
  id: string;
  fullName?: string;
  passportNumber?: string;
  passportExpiry?: string;
  dob?: string;
  nik?: string;
  gender?: 'Male' | 'Female';
  maritalStatus?: string;
  relation?: string;
  photoUrl?: string;
  ktpUrl?: string;
  passportUrl?: string;
}

export const RELATIONS: TRelation[] = [
  'SELF',
  'SPOUSE',
  'FATHER',
  'MOTHER',
  'CHILD',
  'SIBLING',
];

export const MARITAL_STATUSES = ['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati'];
