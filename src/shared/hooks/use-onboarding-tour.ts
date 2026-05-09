import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTranslations } from 'next-intl';
import { useEffect, useCallback } from 'react';

type TRole = 'PROVIDER' | 'PILGRIM';

export const useOnboardingTour = (role: string | undefined) => {
  const t = useTranslations('Onboarding');

  const startTour = useCallback(() => {
    if (!role) return;
    
    // Type guard for driver steps
    const currentRole = role as TRole;
    if (currentRole !== 'PROVIDER' && currentRole !== 'PILGRIM') return;

    const driverObj = driver({
      showProgress: true,
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
                },
              },
              {
                element: '#tour-visa-application',
                popover: {
                  title: t('pilgrim.application.title'),
                  description: t('pilgrim.application.description'),
                  side: 'right',
                  align: 'start',
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

    driverObj.drive();
  }, [role, t]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`has_seen_tour_${role}`);
    if (!hasSeenTour && role) {
      // Delay slightly to ensure DOM elements are rendered
      const timer = setTimeout(() => {
        startTour();
        localStorage.setItem(`has_seen_tour_${role}`, 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [role, startTour]);

  return { startTour };
};
