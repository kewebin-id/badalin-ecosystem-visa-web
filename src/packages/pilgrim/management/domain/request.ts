import { z } from 'zod';
import dayjs from 'dayjs';
import { TRelation } from './member';

export const getFormSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z.string().min(3, t('validation.nameMin')),
    passportNumber: z.string().min(5, t('validation.passportInvalid')),
    passportExpiry: z.string().min(1, t('validation.required')),
    dob: z.string().min(1, t('validation.required')),
    nik: z.string().optional().nullable(),
    gender: z.enum(['Male', 'Female']),
    maritalStatus: z.string().min(1, t('validation.required')),
    relation: z.enum(['SELF', 'SPOUSE', 'FATHER', 'MOTHER', 'CHILD', 'SIBLING']),
    ocrConfidence: z.number().optional(),
    selfieUrl: z.string().optional().nullable(),
    ktpUrl: z.string().optional(),
    passportUrl: z.string().optional(),
    bukuNikahUrl: z.string().optional(),
    akteKelahiranUrl: z.string().optional(),
    employmentCertificateUrl: z.string().optional().nullable(),
  }).superRefine((data, ctx) => {
    const age = dayjs().diff(dayjs(data.dob), 'year');
    const isAdult = age >= 17;

    if (isAdult) {
      if (!data.nik || data.nik.length !== 16) {
        ctx.addIssue({
          path: ['nik'],
          code: z.ZodIssueCode.custom,
          message: t('validation.nikDigit'),
        });
      }
      if (!data.ktpUrl) {
        ctx.addIssue({
          path: ['ktpUrl'],
          code: z.ZodIssueCode.custom,
          message: t('validation.required'),
        });
      }
    } else {
      if (data.nik && data.nik.length > 0 && data.nik.length !== 16) {
        ctx.addIssue({
          path: ['nik'],
          code: z.ZodIssueCode.custom,
          message: t('validation.nikDigit'),
        });
      }
    }
  });

export type TManagementForm = z.infer<ReturnType<typeof getFormSchema>>;

export interface ICreateMemberRequest {
  fullName: string;
  passportNumber: string;
  passportExpiry: string;
  dob: string;
  nik?: string | null;
  gender: 'Male' | 'Female';
  maritalStatus: string;
  relation: TRelation;
  selfieUrl?: string;
  ktpUrl?: string;
  passportUrl?: string;
  bukuNikahUrl?: string;
  akteKelahiranUrl?: string;
  employmentCertificateUrl?: string;
  ocrConfidence?: number;
}

export interface IUpdateMemberRequest extends Partial<ICreateMemberRequest> {
  id: string;
}
