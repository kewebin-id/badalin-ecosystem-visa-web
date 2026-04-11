import React from 'react';
import { useTranslations } from 'next-intl';

interface WelcomeHeaderProps {
  name?: string;
}

export const WelcomeHeader = ({ name }: WelcomeHeaderProps) => {
  const t = useTranslations('Dashboard');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="px-3 py-1 bg-primary-lighter text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-200 shadow-sm transition-all hover:shadow-md">
          {t('verified')}
        </span>
      </div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-dark-950 leading-[1.1]">
        {t('greeting')}<br />
        <span className="bg-linear-to-r from-primary-default to-ocean-default bg-clip-text text-transparent">
          {name || t('defaultName')}
        </span> 👋
      </h1>
      <p className="text-gray-500 text-lg md:text-xl font-medium max-w-md">
        {t('welcomeMessage')}
      </p>
    </div>
  );
};
