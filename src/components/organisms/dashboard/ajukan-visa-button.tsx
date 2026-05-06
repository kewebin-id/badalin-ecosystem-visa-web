'use client';

import React, { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { PlusIcon } from 'lucide-react';
import { AjukanVisaWizard } from './ajukan-visa-wizard';
import { useTranslations } from 'next-intl';

export const AjukanVisaButton = () => {
  const t = useTranslations('VisaTransaction');
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full md:w-auto h-12 px-8 rounded-xl shadow-lg shadow-primary-default/20"
        size="lg"
      >
        <PlusIcon className="size-5 mr-2" />
        {t('addTransaction')}
      </Button>

      <AjukanVisaWizard open={open} onOpenChange={setOpen} />
    </>
  );
};
