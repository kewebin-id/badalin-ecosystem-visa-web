'use client';

import { Button } from '@/components/atoms';
import { InputText } from '@/components/molecules';
import {
  getForgotPasswordSchema,
  TForgotPasswordSchema,
} from '@/packages/pilgrim/auth/dto/form.dto';
import { ROUTES } from '@/shared/constants/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthController } from '../controller';

type FlowStep = 'request' | 'sent';

export const ForgotPasswordView = () => {
  const t = useTranslations('ForgotPassword');
  const locale = useLocale() as 'id' | 'en';

  const [step, setStep] = useState<FlowStep>('request');
  const [countdown, setCountdown] = useState<number>(0);

  const { forgotPasswordMutation } = useAuthController();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<TForgotPasswordSchema>({
    mode: 'onChange',
    resolver: zodResolver(getForgotPasswordSchema(locale)),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const onFormSubmit = async (data: TForgotPasswordSchema) => {
    await forgotPasswordMutation.mutateAsync(data.email);
    setStep('sent');
    setCountdown(60);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    const currentEmail = getValues('email');
    forgotPasswordMutation.mutateAsync(currentEmail);
    setCountdown(60);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/60 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-16 bg-[url(/assets/images/logo-transparent.webp)] bg-contain bg-no-repeat bg-center" />
          </div>

          {step === 'request' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h1 className="text-xl font-semibold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">{t('description')}</p>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                <InputText
                  label={t('emailLabel')}
                  name="email"
                  type="email"
                  register={register}
                  disabled={forgotPasswordMutation.isPending}
                  placeholder={t('emailPlaceholder')}
                  errorMessage={errors.email?.message}
                />

                <Button
                  size="lg"
                  type="submit"
                  disabled={!isValid}
                  isSubmitting={forgotPasswordMutation.isPending}
                >
                  {t('submitRequest')}
                </Button>
              </form>

              <Link
                href={ROUTES.AUTH.LOGIN}
                className="flex items-center justify-center gap-1.5 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t('backToLogin')}
              </Link>
            </div>
          )}

          {step === 'sent' && (
            <div className="space-y-5 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary-default/10 flex items-center justify-center text-primary-default">
                <MailCheck className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-foreground">{t('sentTitle')}</h1>
                <p className="text-sm text-muted-foreground">
                  {t('sentDescription', { email: getValues('email') })}
                </p>
              </div>

              <Button
                onClick={() => window.open('https://mail.google.com', '_blank')}
                variant="primaryOutline"
                className="w-full rounded-full h-12 text-sm font-semibold border-gray-200"
              >
                {t('openEmailApp')}
              </Button>

              <button
                onClick={handleResend}
                disabled={countdown > 0 || forgotPasswordMutation.isPending}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('resendPrompt')}
                {countdown > 0 && (
                  <span className="ml-1 font-medium text-foreground">({countdown}s)</span>
                )}
              </button>

              <Link
                href={ROUTES.AUTH.LOGIN}
                className="flex items-center justify-center gap-1.5 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t('backToLogin')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
