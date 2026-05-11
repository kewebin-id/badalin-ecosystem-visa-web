import { z } from 'zod';
import { TRelation } from './member';

export const getFormSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z.string().min(3, t('validation.nameMin')),
    passportNumber: z.string().min(5, t('validation.passportInvalid')),
    passportExpiry: z.string().min(1, t('validation.required')),
    dob: z.string().min(1, t('validation.required')),
    nik: z.string().length(16, t('validation.nikDigit')),
    gender: z.enum(['Male', 'Female']),
    maritalStatus: z.string().min(1, t('validation.required')),
    relation: z.enum(['SELF', 'SPOUSE', 'FATHER', 'MOTHER', 'CHILD', 'SIBLING']),
    ocrConfidence: z.number().optional(),
    selfieUrl: z.string().optional(),
    ktpUrl: z.string().optional(),
    passportUrl: z.string().optional(),
    bukuNikahUrl: z.string().optional(),
    akteKelahiranUrl: z.string().optional(),
  });

export type TManagementForm = z.infer<ReturnType<typeof getFormSchema>>;

export interface ICreateMemberRequest {
  fullName: string;
  passportNumber: string;
  passportExpiry: string;
  dob: string;
  nik: string;
  gender: 'Male' | 'Female';
  maritalStatus: string;
  relation: TRelation;
  selfieUrl?: string;
  ktpUrl?: string;
  passportUrl?: string;
  bukuNikahUrl?: string;
  akteKelahiranUrl?: string;
  ocrConfidence?: number;
}

export interface IUpdateMemberRequest extends Partial<ICreateMemberRequest> {
  id: string;
}
