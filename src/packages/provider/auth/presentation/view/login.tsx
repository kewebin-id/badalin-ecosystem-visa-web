'use client';

import { Button, Card, Checkbox, Image } from '@/components/atoms';
import { InputText } from '@/components/molecules';
import { useAgencySettingsController } from '@/packages/provider/agency-settings/presentation/controller';
import { ROUTES } from '@/shared/constants/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { loginSchema, TProviderLoginForm } from '../../dto/form.dto';
import { useProviderAuthController } from '../controller';

export const ProviderLoginView: FC = () => {
  const params = useParams();
  const slug = (params?.slug as string) || 'p';
  const isDefaultSlug = slug === 'p';

  const [showPassword, setShowPassword] = useState(false);
  const { loginMutation } = useProviderAuthController();
  const { useValidateSlug } = useAgencySettingsController();

  const { data: validateRes, isLoading: isValidating } = useValidateSlug(slug);
  const agencyName = validateRes?.data?.name || slug;

  const form = useForm<TProviderLoginForm>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = form;

  const onSubmit = async (data: TProviderLoginForm) => {
    try {
      await loginMutation.mutateAsync({
        identifier: data.email,
        password: data.password,
      });
    } catch {
      // Error is handled by mutation/toast
    }
  };

  const loading = loginMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
      <div className="w-full max-w-md">
        <Card className="rounded-3xl shadow-xl border-none p-8! bg-white">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-16 mb-4">
              <Image
                width={128}
                height={64}
                src="/assets/images/logo-transparent.webp"
                alt="Badalin"
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <div className="flex items-center gap-2 bg-primary-default/10 text-primary-default px-3 py-1.5 rounded-full">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold tracking-[0.1em] uppercase">
                {isValidating
                  ? 'Validating...'
                  : isDefaultSlug
                    ? 'Provider Portal'
                    : `Portal ${agencyName}`}
              </span>
            </div>
          </div>

          <div className="text-center mb-8 space-y-2">
            <h1 className="text-2xl font-bold text-dark-900 font-heading">
              {isValidating ? (
                <div className="h-8 w-48 bg-gray-100 animate-pulse rounded-lg mx-auto" />
              ) : isDefaultSlug ? (
                'Masuk ke Portal Agensi'
              ) : (
                `Masuk ke ${agencyName}`
              )}
            </h1>
            <p className="text-sm text-gray-500">
              {isValidating ? (
                <div className="h-4 w-64 bg-gray-50 animate-pulse rounded-md mx-auto" />
              ) : isDefaultSlug ? (
                'Kelola pengajuan visa dan verifikasi pembayaran jamaah Anda.'
              ) : (
                `Masuk untuk mengelola data operasional agensi ${agencyName}.`
              )}
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <InputText
                useLabelInside
                label="Email Agensi"
                name="email"
                type="email"
                register={register}
                placeholder="agensi@contoh.com"
                disabled={loading}
                errorMessage={errors.email?.message}
              />

              <div className="space-y-1">
                <InputText
                  useLabelInside
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  register={register}
                  placeholder="••••••••"
                  disabled={loading}
                  icon={
                    showPassword ? (
                      <EyeOff className="size-5 text-gray-400" />
                    ) : (
                      <Eye className="size-5 text-gray-400" />
                    )
                  }
                  iconPosition="right"
                  iconOnClick={() => setShowPassword(!showPassword)}
                  errorMessage={errors.password?.message}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium text-gray-500 cursor-pointer select-none"
                  >
                    Ingat Saya
                  </label>
                </div>
                <Link
                  href={ROUTES.PROVIDER.AUTH.FORGOT_PASSWORD(slug)}
                  className="text-xs font-semibold text-primary-default hover:text-primary-600 transition-colors"
                >
                  Lupa Password?
                </Link>
              </div>

              <Button size="lg" type="submit" disabled={loading || !isValid} isSubmitting={loading}>
                Masuk
              </Button>
            </form>
          </FormProvider>

          <div className="mt-8 pt-6 border-t border-gray-100 uppercase">
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 tracking-widest">
              <ShieldCheck className="h-4 w-4 text-success-500" />
              <span>Portal khusus mitra agensi terdaftar</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
