'use client';

import { Button } from '@/components/atoms';
import { InputText, LocaleSwitcher } from '@/components/molecules';
import { PwaInstallPrompt } from '@/components/organisms/layout/pwa-install-prompt';
import { getAuthFormSchema, TAuthFormSchema, TStep } from '@/packages/pilgrim/auth/dto/form.dto';
import { useAuthController } from '@/packages/pilgrim/auth/presentation/controller';
import { ROUTES } from '@/shared/constants/routes';
import Logger from '@/shared/utils/logger';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const LoginContent: FC<{ providerSlug?: string }> = () => {
  const locale = useLocale() as 'id' | 'en';
  const t = useTranslations('Login');
  const tr = useTranslations('Register');
  const tc = useTranslations('Common');

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl');

  const [step, setStep] = useState<TStep>('input');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (callbackUrl) {
      const segments = callbackUrl.split('/').filter(Boolean);
      const reservedPaths = [
        'console',
        'auth',
        'public',
        'api',
        'transactions',
        'family',
        'pilgrim',
        'profile',
        'dashboard',
      ];

      if (segments.length > 0 && !reservedPaths.includes(segments[0])) {
        const agencySlug = segments[0] === 'p' ? segments[1] : segments[0];
        if (agencySlug) {
          document.cookie = `agency_id=${agencySlug}; path=/; max-age=${30 * 24 * 60 * 60}`;
        }
      }
    }
  }, [callbackUrl]);

  const { checkIdentifierMutation, registerMutation, loginMutation } = useAuthController();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TAuthFormSchema>({
    mode: 'onChange',
    resolver: zodResolver(getAuthFormSchema(step, locale)),
    defaultValues: {
      identifier: '',
      password: '',
      name: '',
      confirmPassword: '',
    },
  });

  const handleContinue = async () => {
    const isIdentifierValid = await trigger('identifier');
    if (!isIdentifierValid) return;

    const identifier = getValues('identifier');
    setIsLoading(true);
    try {
      const result = await checkIdentifierMutation.mutateAsync(identifier);
      if (result?.exists) {
        setStep('login');
      } else {
        setStep('register');
      }
    } catch (error) {
      Logger.error(error, { location: 'LoginContent.handleContinue' });
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = async (data: TAuthFormSchema) => {
    if (step === 'input') {
      await handleContinue();
      return;
    }

    setIsLoading(true);
    try {
      if (step === 'login') {
        await loginMutation.mutateAsync({
          identifier: data.identifier,
          password: data.password || '',
        });
      } else {
        const isEmail = data.identifier.includes('@');
        const payload = {
          fullName: data.name || data.identifier.split('@')[0] || '',
          identifier: data.identifier,
          email: isEmail ? data.identifier : `${data.identifier}@badalin.com`,
          phoneNumber: isEmail ? '' : data.identifier,
          password: data.password || '',
        };

        await registerMutation.mutateAsync(payload);
        await loginMutation.mutateAsync({
          identifier: data.identifier,
          password: data.password || '',
        });
      }
    } catch (error) {
      Logger.error(error, { location: 'LoginContent.onSubmit' });
      setIsLoading(false);
    }
  };

  return (
    <>
      <PwaInstallPrompt />
      <div className="min-h-screen w-full flex bg-white lg:p-4 relative overflow-hidden">
        <div className="lg:hidden absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url(/assets/images/kabah.webp)] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
        </div>

        <div className="hidden lg:flex relative w-1/2 h-full min-h-[calc(100vh-32px)] overflow-hidden rounded-3xl bg-dark-900">
          <div className="absolute inset-0 bg-[url(/assets/images/kabah.webp)] bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
          <div className="absolute bottom-0 z-10 flex flex-col h-full items-center justify-end pb-10 px-12 text-center w-full">
            <div className="w-54 h-24 bg-[url(/assets/images/logo-transparent.webp)] bg-contain bg-no-repeat bg-center" />
            <h2 className="text-3xl font-bold text-white font-heading mb-2">{t('brandSlogan')}</h2>
            <p className="text-gray-300 text-lg max-w-md">{t('brandDescription')}</p>
          </div>
        </div>

        <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-0 md:p-6 lg:px-24">
          <div className="absolute top-4 right-4">
            <LocaleSwitcher />
          </div>
          <div className="w-full max-w-md bg-white lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 md:p-8 lg:p-0 rounded-xl md:rounded-3xl shadow-2xl lg:shadow-none border border-white/20 lg:border-none">
            <div className="lg:hidden flex flex-col items-center mb-6">
              <div className="w-32 h-16 bg-[url(/assets/images/logo-transparent.webp)] bg-contain bg-no-repeat bg-center" />
              <span className="text-primary-500 font-bold text-xs tracking-[0.2em] uppercase mt-[-10px]">
                {t('subtitle')}
              </span>
            </div>

            {step !== 'input' && (
              <button
                onClick={() => {
                  setStep('input');
                  setValue('password', '');
                  setValue('name', '');
                  setValue('confirmPassword', '');
                }}
                className="flex items-center gap-2 text-sm text-gray-500 lg:text-gray-500 hover:text-primary-default transition-colors mb-6 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('back')}
              </button>
            )}

            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-dark-900 font-heading">
                {step === 'register' ? tr('title') : t('welcome')}
              </h1>
              <p className="text-gray-500 text-sm">{t('enterDetail')}</p>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <InputText
                useLabelInside
                label={t('identifier')}
                name="identifier"
                type="text"
                register={register}
                placeholder={t('identifierPlaceholder')}
                className="rounded-xl border-gray-200 focus:ring-primary-500 bg-white"
                disabled={step !== 'input' || isLoading}
                errorMessage={errors.identifier?.message}
                helperText={t('identifierPlaceholder')}
              />

              {step === 'register' && (
                <InputText
                  useLabelInside
                  label={t('name')}
                  name="name"
                  type="text"
                  register={register}
                  placeholder={t('namePlaceholder')}
                  className="rounded-xl border-gray-200 bg-white"
                  disabled={isLoading}
                  helperText={t('nameHelper')}
                  errorMessage={errors.name?.message}
                />
              )}

              {(step === 'login' || step === 'register') && (
                <>
                  <InputText
                    useLabelInside
                    label={t('password')}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    register={register}
                    placeholder={t('passwordPlaceholder')}
                    className="rounded-xl border-gray-200 bg-white"
                    disabled={isLoading}
                    icon={
                      showPassword ? (
                        <EyeOff className="size-6 text-gray-400" />
                      ) : (
                        <Eye className="size-6 text-gray-400" />
                      )
                    }
                    iconPosition="right"
                    iconOnClick={() => setShowPassword(!showPassword)}
                    errorMessage={errors.password?.message}
                  />

                  {step === 'login' && (
                    <div className="flex justify-start">
                      <Link
                        href={ROUTES.AUTH.FORGOT_PASSWORD}
                        className="text-xs font-medium text-primary-default hover:text-primary-600 transition-colors"
                      >
                        {t('forgotPassword') || 'Lupa Kata Sandi?'}
                      </Link>
                    </div>
                  )}

                  {step === 'register' && (
                    <InputText
                      useLabelInside
                      label={tr('confirmPassword') || 'Confirm Password'}
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      register={register}
                      placeholder="••••••••"
                      className="rounded-xl border-gray-200 bg-white"
                      disabled={isLoading}
                      icon={
                        showConfirmPassword ? (
                          <EyeOff className="size-6 text-gray-400" />
                        ) : (
                          <Eye className="size-6 text-gray-400" />
                        )
                      }
                      iconPosition="right"
                      iconOnClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      errorMessage={errors.confirmPassword?.message}
                    />
                  )}
                </>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={
                  isLoading ||
                  (step === 'input' && (!watch('identifier') || !!errors.identifier)) ||
                  (step !== 'input' && !isValid)
                }
                isSubmitting={isLoading || isSubmitting}
              >
                {step === 'input'
                  ? t('continue')
                  : step === 'login'
                    ? t('loginNow')
                    : t('registerAccount')}
              </Button>
            </form>
          </div>
        </div>
        <p className="text-center text-xs text-white mt-8 lg:hidden absolute bottom-4 w-full">
          {tc('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </>
  );
};
