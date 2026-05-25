'use client';

import { Button } from '@/components/atoms';
import { DialogDrawer } from '@/components/molecules';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PwaInstallPrompt = () => {
  const t = useTranslations('PwaInstall');
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isAndroid = /android/i.test(navigator.userAgent);
    if (!isAndroid) return;

    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const lastAsked = localStorage.getItem('pwa_install_asked');
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (lastAsked && now - parseInt(lastAsked) < oneWeek) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();

      setDeferredPrompt(e as BeforeInstallPromptEvent);

      setOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setOpen(false);

    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');

      localStorage.setItem('pwa_install_asked', Date.now().toString());
    }
  };

  const handleCancel = () => {
    setOpen(false);

    localStorage.setItem('pwa_install_asked', Date.now().toString());
  };

  return (
    <DialogDrawer
      open={open}
      setOpen={(val) => {
        if (!val) handleCancel();
        setOpen(val);
      }}
      title=""
      showCloseButton={false}
      className="max-w-sm mx-auto overflow-hidden p-0"
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        {/* Placeholder for the illustration - you can replace src with your actual asset */}
        <div className="mb-6 relative w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden">
          <Image
            src="/og-image.webp"
            alt="App Icon"
            width={128}
            height={128}
            className="rounded-xl drop-shadow-md object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">{t('title')}</h3>

        <p className="text-sm text-gray-500 mb-8 leading-relaxed">{t('description')}</p>

        <div className="flex flex-row gap-3 w-full justify-between items-center">
          <Button onClick={handleCancel} variant="transparent" className="flex-1">
            {t('cancel')}
          </Button>
          <Button onClick={handleInstall} className="flex-1">
            {t('install')}
          </Button>
        </div>
      </div>
    </DialogDrawer>
  );
};
