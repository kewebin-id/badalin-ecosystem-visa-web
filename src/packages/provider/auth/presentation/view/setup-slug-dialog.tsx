'use client';

import { Button } from '@/components/atoms';
import { DialogDrawer, InputText } from '@/components/molecules';
import { useAuth } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { AlertCircle, CheckCircle2, Globe, Loader2, ShieldCheck, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useProviderAuthController } from '../controller';

export const SetupSlugDialog = ({ open }: { open: boolean }) => {
  const t = useTranslations();
  const { user } = useAuth();
  const { updateAgencyMutation, checkSlugMutation } = useProviderAuthController();

  const [slug, setSlug] = useState<string>('');
  const [name, setName] = useState<string>(user?.agency?.name || '');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const handleCheckSlug = useCallback(
    async (val: string) => {
      if (!val || val.length < 3) {
        setIsAvailable(null);
        return;
      }
      setIsChecking(true);
      try {
        const res = await checkSlugMutation.mutateAsync(val);
        setIsAvailable(res?.available ?? false);
      } catch {
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    },
    [checkSlugMutation],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (slug && slug.length >= 3) {
        handleCheckSlug(slug);
      } else {
        setIsAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug, handleCheckSlug]);

  useEffect(() => {
    if (user?.agency?.name) {
      setName(user.agency.name);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!slug || isAvailable === false) {
      toast.error('Please provide a valid and available slug');
      return;
    }

    await updateAgencyMutation.mutateAsync({ slug, name });
  };

  return (
    <DialogDrawer
      open={open}
      setOpen={() => {}}
      title={t('SetupSlug.title')}
      description={t('SetupSlug.description')}
      className="max-w-lg"
      showCloseButton={false}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-primary-50 p-4 border border-primary-100">
          <div className="rounded-lg bg-primary-500 p-2 text-white shadow-lg shadow-primary-200">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{t('SetupSlug.mandatorySetup')}</h4>
            <p className="text-xs text-gray-600">{t('SetupSlug.mandatorySetupDesc')}</p>
          </div>
        </div>

        <div className="space-y-2">
          <InputText
            type="text"
            label={t('SetupSlug.agencyName')}
            value={name}
            setValue={(e) => setName(e)}
            useLabelInside
            iconType="string"
            icon={<Store className="size-4" />}
            iconPosition="right"
          />

          <div className="relative">
            <InputText
              type="text"
              label={t('SetupSlug.agencySlug')}
              value={slug}
              setValue={(e) => {
                const val = e?.toLowerCase().replace(/[^a-z0-9-]/g, '');
                setSlug(val);
                setIsAvailable(null);
              }}
              useLabelInside
              iconType="string"
              icon={
                isChecking ? (
                  <Loader2 className="size-4 animate-spin text-gray-400" />
                ) : isAvailable === true ? (
                  <CheckCircle2 className="size-4 text-success-500" />
                ) : isAvailable === false ? (
                  <AlertCircle className="size-4 text-danger-500" />
                ) : (
                  <Globe className="size-4" />
                )
              }
              iconPosition="right"
              errorMessage={isAvailable === false ? t('SetupSlug.slugTaken') : undefined}
            />
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-primary-200 bg-primary-50/50 p-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2 border border-primary-100 shadow-sm">
              <Globe className="size-5 text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-400 mb-0.5">
                {t('SetupSlug.agencyLink')}
              </p>
              <p className="truncate text-sm text-gray-700">
                {process.env.BASE_URL}/
                <span className={cn('font-bold', slug ? 'text-primary-600' : 'text-gray-300')}>
                  {slug || t('SetupSlug.yourSlug')}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Button
          className="w-full h-[54px] text-base font-bold shadow-lg shadow-primary-200/50 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 border-none rounded-xl text-white transition-all transform active:scale-[0.98]"
          onClick={handleSubmit}
          disabled={
            !slug ||
            !name ||
            isAvailable === false ||
            updateAgencyMutation.isPending ||
            isChecking ||
            slug.length < 3
          }
          isSubmitting={updateAgencyMutation.isPending}
        >
          {updateAgencyMutation.isPending ? t('SetupSlug.settingUp') : t('SetupSlug.finishSetup')}
        </Button>
      </div>
    </DialogDrawer>
  );
};
