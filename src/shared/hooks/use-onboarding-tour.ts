import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslations } from 'next-intl';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

type TRole = 'PROVIDER' | 'PILGRIM';

export const useOnboardingTour = (role: string | undefined, slug?: string) => {
  const t = useTranslations('Onboarding');
  const router = useRouter();

  const startTour = useCallback((initialStep?: number) => {
    if (!role) return;
    
    const currentRole = role as TRole;
    if (currentRole !== 'PROVIDER' && currentRole !== 'PILGRIM') return;

    const driverObj = driver({
      showProgress: true,
      allowClose: true,
      nextBtnText: t('next'),
      prevBtnText: t('prev'),
      doneBtnText: t('done'),
      steps:
        role === 'PROVIDER'
          ? [
              {
                element: '#tour-dashboard-overview',
                popover: {
                  title: t('provider.dashboard.title'),
                  description: t('provider.dashboard.description'),
                  side: 'bottom',
                  align: 'start',
                },
              },
              {
                element: '#tour-submissions-menu',
                popover: {
                  title: t('provider.submissions.title'),
                  description: t('provider.submissions.description'),
                  side: 'right',
                  align: 'start',
                },
              },
              {
                element: '#tour-agency-settings',
                popover: {
                  title: t('provider.settings.title'),
                  description: t('provider.settings.description'),
                  side: 'right',
                  align: 'start',
                  onNextClick: () => {
                    if (slug) {
                      router.push(ROUTES.PROVIDER.SETTINGS(slug));
                      driverObj.destroy();
                      localStorage.setItem(`tour_step_${role}`, '3');
                    } else {
                      driverObj.moveNext();
                    }
                  },
                },
              },
              {
                element: '#tour-visa-pricing',
                popover: {
                  title: t('provider.pricing.title'),
                  description: t('provider.pricing.description'),
                  side: 'top',
                  align: 'start',
                },
              },
              {
                element: '#tour-bank-info',
                popover: {
                  title: t('provider.bank.title'),
                  description: t('provider.bank.description'),
                  side: 'top',
                  align: 'start',
                },
              },
            ]
          : [
              {
                element: '#tour-pilgrim-management',
                popover: {
                  title: t('pilgrim.family.title'),
                  description: t('pilgrim.family.description'),
                  side: 'right',
                  align: 'start',
                  onNextClick: () => {
                    router.push(ROUTES.PILGRIM.FAMILY.INDEX);
                    driverObj.destroy();
                    localStorage.setItem(`tour_step_${role}`, '1');
                  },
                },
              },
              {
                element: '#tour-visa-application',
                popover: {
                  title: t('pilgrim.application.title'),
                  description: t('pilgrim.application.description'),
                  side: 'right',
                  align: 'start',
                  onNextClick: () => {
                    router.push(ROUTES.PILGRIM.TRANSACTION.INDEX);
                    driverObj.destroy();
                    localStorage.setItem(`tour_step_${role}`, '2');
                  },
                },
              },
              {
                element: '#tour-payment-status',
                popover: {
                  title: t('pilgrim.payment.title'),
                  description: t('pilgrim.payment.description'),
                  side: 'right',
                  align: 'start',
                },
              },
            ],
    });

    if (initialStep !== undefined) {
      driverObj.drive(initialStep);
    } else {
      driverObj.drive();
    }
  }, [role, t, slug, router]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`has_seen_tour_${role}`);
    const savedStep = localStorage.getItem(`tour_step_${role}`);

    if (role) {
      if (savedStep) {
        // Resume tour from saved step
        const timer = setTimeout(() => {
          startTour(parseInt(savedStep));
          localStorage.removeItem(`tour_step_${role}`);
          localStorage.setItem(`has_seen_tour_${role}`, 'true');
        }, 1000);
        return () => clearTimeout(timer);
      } else if (!hasSeenTour) {
        const timer = setTimeout(() => {
          startTour();
          localStorage.setItem(`has_seen_tour_${role}`, 'true');
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [role, startTour]);

  return { startTour };
};
