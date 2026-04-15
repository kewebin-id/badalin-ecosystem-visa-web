import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(8, 'Password minimal 8 karakter'),
  remember: z.boolean(),
});

export type TProviderLoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap wajib diisi'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  invitationToken: z.string().min(1, 'Token undangan wajib ada'),
});

export type TProviderRegisterForm = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
});

export type TProviderForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
    token: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export type TProviderResetPasswordForm = z.infer<typeof resetPasswordSchema>;
