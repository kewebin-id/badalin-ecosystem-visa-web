'use client';

import { useAuth } from '@/shared/hooks';
import { useAgencySettingsController } from '@/packages/provider/agency-settings/presentation/controller';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export const AgencyRestrictionBanner = () => {
  const t = useTranslations('ProviderSubmissions.quickReview.refund.restriction');
  const { user } = useAuth();
  const { useAgencyData } = useAgencySettingsController();
  const { data: agency } = useAgencyData();
  const params = useParams();
  const slug = (params?.slug as string) || user?.agency?.slug;

  if (user?.role !== 'PROVIDER' || agency?.data?.status !== 'RESTRICTED') {
    return null;
  }

  return (
    <div className="bg-orange-500 text-white px-6 py-3 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-500 sticky top-16 z-20">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="font-black uppercase tracking-tight text-sm">{t('title')}</span>
          <span className="hidden sm:inline-block h-4 w-px bg-white/20" />
          <span className="text-xs font-bold opacity-90">{t('desc')}</span>
        </div>
      </div>
      <Link
        href={`/${slug}/refund`}
        className="flex items-center gap-2 bg-white text-orange-600 px-4 py-1.5 rounded-full text-xs font-black uppercase hover:bg-orange-50 transition-colors shadow-sm whitespace-nowrap"
      >
        {t('action')}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
};
