'use client';

import { Button } from '@/components/atoms';
import { DialogDrawer } from '@/components/molecules';
import { Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export const SoundPermissionPrompt = () => {
  const t = useTranslations('SoundPermission');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const granted = localStorage.getItem('sound_permission_granted');
    const lastAsked = localStorage.getItem('sound_permission_asked');
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (granted !== 'true' && (!lastAsked || now - parseInt(lastAsked) > oneWeek)) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = () => {
    const audio = new Audio('/assets/sounds/notif.mp3');
    audio.volume = 0;
    audio.play().catch(() => {});
    localStorage.setItem('sound_permission_granted', 'true');
    setOpen(false);
  };

  const handleLater = () => {
    localStorage.setItem('sound_permission_asked', Date.now().toString());
    setOpen(false);
  };

  return (
    <DialogDrawer
      open={open}
      setOpen={(val) => {
        if (!val) handleLater();
        setOpen(val);
      }}
      title=""
      showCloseButton={false}
      className="max-w-sm mx-auto overflow-hidden p-0"
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 relative w-20 h-20 bg-primary-default/10 text-primary-default rounded-full flex items-center justify-center overflow-hidden">
          <Volume2 className="w-10 h-10" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
          {t('title')}
        </h3>
        
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          {t('description')}
        </p>

        <div className="flex flex-row gap-3 w-full justify-between items-center">
          <Button
            onClick={handleLater}
            variant="transparent"
            className="flex-1"
          >
            {t('later')}
          </Button>
          <Button
            onClick={handleAllow}
            className="flex-1"
          >
            {t('allow')}
          </Button>
        </div>
      </div>
    </DialogDrawer>
  );
};
