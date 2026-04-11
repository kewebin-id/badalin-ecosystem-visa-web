'use client';

import { AjukanVisaButton } from '@/components/organisms/dashboard/ajukan-visa-button';
import { HistoryList } from '@/components/organisms/dashboard/history-list';
import { WelcomeHeader } from '@/components/organisms/dashboard/welcome-header';
import { useAuth } from '@/shared/hooks';

export const DashboardView = () => {
  const session = useAuth();
  const { user } = session;

  return (
    <div className="mx-auto space-y-12 pb-24">
      <div className="relative overflow-hidden bg-white/40 p-8 md:p-12 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 bg-primary-default/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 size-64 bg-ocean-default/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <WelcomeHeader name={user?.fullName || '-'} />
          <div className="shrink-0">
            <AjukanVisaButton />
          </div>
        </div>
      </div>

      <section className="space-y-8">
        <HistoryList />
      </section>
    </div>
  );
};
