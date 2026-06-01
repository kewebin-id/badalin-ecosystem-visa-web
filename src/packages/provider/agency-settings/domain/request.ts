import * as z from 'zod';

export interface IUpdateAgencyRequest {
  name?: string;
  slug?: string;
  visaPrice?: number;
  visaCurrency?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  phoneNumber?: string;
}

export const getAgencySchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(3).max(100),
    slug: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[a-z0-9-]+$/, { message: t('validation.slugRegex') }),
    visaPrice: z.number().min(0),
    visaCurrency: z.string().optional(),
    bankName: z.string().min(1, { message: t('validation.required') }),
    bankAccountName: z.string().min(1, { message: t('validation.required') }),
    bankAccountNumber: z.string().min(1, { message: t('validation.required') }),
    phoneNumber: z.string().min(1, { message: t('validation.required') }),
  });

export type AgencyFormValues = z.infer<ReturnType<typeof getAgencySchema>>;
