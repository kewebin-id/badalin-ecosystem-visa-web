'use client';

import { Locale, locales } from '@/i18n/config';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

const LOCALE_COOKIE = 'NEXT_LOCALE';

const localeLabels: Record<Locale, string> = {
  id: '🇮🇩 ID',
  en: '🇬🇧 EN',
};

export const LocaleSwitcher = () => {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

    startTransition(() => {
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleSwitch(loc)}
          disabled={isPending}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
            locale === loc
              ? 'bg-primary-default text-white shadow-sm'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
};
