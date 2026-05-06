import { validationMessage } from '@/shared/constants/validation-message';
import { z } from 'zod';

export type TStep = 'input' | 'login' | 'register';

export const IDENTIFIER_REGEX = /^(08[0-9]{8,11}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export const getAuthFormSchema = (step: TStep, locale: 'id' | 'en' = 'id') => {
  const vi = (label: string) => validationMessage(label, locale);

  return z
    .object({
      identifier: z
        .string()
        .min(1, vi('Identifier').required())
        .regex(IDENTIFIER_REGEX, vi('Identifier').invalidField()),
      name:
        step === 'register'
          ? z.string().min(3, vi('Name').minChar(3))
          : z.string().optional().or(z.literal('')),
      password:
        step === 'input'
          ? z.string().optional().or(z.literal(''))
          : z.string().min(6, vi('Password').minChar(6)),
      confirmPassword:
        step === 'register'
          ? z.string().min(6, vi('Confirm Password').minChar(6))
          : z.string().optional().or(z.literal('')),
    })
    .refine(
      (data) => {
        if (step !== 'register') return true;
        return data.password === data.confirmPassword;
      },
      {
        message: vi('Confirm Password').notSame('Password'),
        path: ['confirmPassword'],
      },
    );
};

export type TAuthFormSchema = z.infer<ReturnType<typeof getAuthFormSchema>>;

export const getForgotPasswordSchema = (locale: 'id' | 'en' = 'id') => {
  const vi = (label: string) => validationMessage(label, locale);

  return z.object({
    email: z.string().min(1, vi('Email').required()).email(vi('Email').invalidField()),
  });
};

export type TForgotPasswordSchema = z.infer<ReturnType<typeof getForgotPasswordSchema>>;

export const getResetPasswordSchema = (locale: 'id' | 'en' = 'id') => {
  const vi = (label: string) => validationMessage(label, locale);

  return z
    .object({
      password: z.string().min(8, vi('Password').minChar(8)),
      confirmPassword: z.string().min(8, vi('Confirm Password').minChar(8)),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: vi('Confirm Password').notSame('Password'),
      path: ['confirmPassword'],
    });
};

export type TResetPasswordSchema = z.infer<ReturnType<typeof getResetPasswordSchema>>;
