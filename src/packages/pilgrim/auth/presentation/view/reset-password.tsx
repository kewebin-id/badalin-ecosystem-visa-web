'use client';

import { Button } from '@/components/atoms';
import { InputText } from '@/components/molecules';
import { getResetPasswordSchema, TResetPasswordSchema } from '@/packages/pilgrim/auth/dto/form.dto';
import { ROUTES } from '@/shared/constants/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthController } from '../controller';

type FlowStep = 'reset' | 'done';

export const ResetPasswordView = () => {
  const t = useTranslations('ForgotPassword');
  const locale = useLocale() as 'id' | 'en';

  const [step, setStep] = useState<FlowStep>('reset');
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { resetPasswordMutation } = useAuthController();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<TResetPasswordSchema>({
    mode: 'onChange',
    resolver: zodResolver(getResetPasswordSchema(locale)),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('password');
  const confirmPassword = watch('confirmPassword');

  const passwordValid = newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length >= 8;

  const onFormSubmit = async (data: TResetPasswordSchema) => {
    if (!token) return;
    await resetPasswordMutation.mutateAsync({ token, password: data.password });
    setStep('done');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/60 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-16 bg-[url(/assets/images/logo-transparent.webp)] bg-contain bg-no-repeat bg-center" />
          </div>

          {step === 'reset' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary-default/10 flex items-center justify-center mb-2 text-primary-default">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">{t('resetTitle')}</h1>
                <p className="text-sm text-muted-foreground">{t('resetDescription')}</p>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                <InputText
                  disabled={resetPasswordMutation.isPending}
                  label={t('newPasswordLabel')}
                  name="password"
                  type={showNew ? 'text' : 'password'}
                  register={register}
                  placeholder={t('newPasswordPlaceholder')}
                  icon={
                    showNew ? (
                      <EyeOff className="size-6 text-gray-400" />
                    ) : (
                      <Eye className="size-6 text-gray-400" />
                    )
                  }
                  iconPosition="right"
                  iconOnClick={() => setShowNew(!showNew)}
                  errorMessage={errors.password?.message}
                  helperText={passwordValid ? t('passwordValid') : undefined}
                />

                <InputText
                  disabled={resetPasswordMutation.isPending}
                  label={t('confirmPasswordLabel')}
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  register={register}
                  placeholder={t('confirmPasswordPlaceholder')}
                  icon={
                    showConfirm ? (
                      <EyeOff className="size-6 text-gray-400" />
                    ) : (
                      <Eye className="size-6 text-gray-400" />
                    )
                  }
                  iconPosition="right"
                  iconOnClick={() => setShowConfirm(!showConfirm)}
                  errorMessage={errors.confirmPassword?.message}
                  helperText={passwordsMatch ? t('passwordMatch') : undefined}
                />

                <Button
                  size="lg"
                  type="submit"
                  isSubmitting={resetPasswordMutation.isPending}
                  disabled={resetPasswordMutation.isPending || !isValid}
                >
                  {t('submitReset')}
                </Button>
              </form>
            </div>
          )}

          {step === 'done' && (
            <div className="space-y-5 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-success-500/15 flex items-center justify-center text-success-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-foreground">{t('successTitle')}</h1>
                <p className="text-sm text-muted-foreground">{t('successDescription')}</p>
              </div>

              <Button
                onClick={() => router.push(ROUTES.AUTH.LOGIN)}
                className="w-full rounded-full h-12 text-sm font-semibold bg-primary-default hover:bg-primary-600 shadow-md shadow-primary-500/20"
              >
                {t('loginNow')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
