'use client';

import { Timer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  deadline: string;
}

export const CountdownTimer = ({ deadline }: CountdownTimerProps) => {
  const t = useTranslations('VisaTransaction');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = Math.max(0, new Date(deadline).getTime() - now);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-2 bg-danger-500/10 text-danger-500 rounded-2xl p-4 text-center justify-center">
      <Timer className="size-5" />
      <span className="text-2xl font-bold font-mono">{time}</span>
      <span className="text-xs">{t('detail.timeLeft')}</span>
    </div>
  );
};
