'use client';

import React, { useState } from 'react';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/atoms/drawer';
import { Button } from '@/components/atoms/button';
import { cn } from '@/shared/utils';
import { CheckIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AjukanVisaWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AjukanVisaWizard = ({ open, onOpenChange }: AjukanVisaWizardProps) => {
  const isMobile = useIsMobile();
  const t = useTranslations('VisaWizard');
  const tTrx = useTranslations('VisaTransaction.stepTitles');
  const [currentStage, setCurrentStage] = useState(1);

  const STAGES = [
    { id: 1, title: tTrx('selectMembers'), key: 'selectMembers' },
    { id: 2, title: tTrx('logistics'), key: 'logistics' },
    { id: 3, title: tTrx('transport'), key: 'transport' },
    { id: 4, title: tTrx('summary'), key: 'additional' },
  ];

  const STAGE_INFO = [
    {
      id: 1,
      icon: '👥',
      description: t('descriptions.selectMembers'),
    },
    {
      id: 2,
      icon: '📦',
      description: t('descriptions.logistics'),
    },
    {
      id: 3,
      icon: '🚌',
      description: t('descriptions.transport'),
    },
    {
      id: 4,
      icon: '✨',
      description: t('descriptions.additional'),
    },
  ];

  const handleNext = () => {
    if (currentStage < STAGES.length) {
      setCurrentStage(currentStage + 1);
    } else {
      onOpenChange(false);
      // Logic for submission
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const renderStepper = () => (
    <div className="flex items-center justify-between mb-8 px-2">
      {STAGES.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div
              className={cn(
                'size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                currentStage === stage.id
                   ? 'bg-primary-default border-primary-default text-white shadow-lg shadow-primary-default/20 scale-110'
                   : currentStage > stage.id
                   ? 'bg-green-500 border-green-500 text-white'
                   : 'bg-white border-gray-200 text-gray-400'
              )}
            >
              {currentStage > stage.id ? <CheckIcon className="size-5" /> : stage.id}
            </div>
            <span
              className={cn(
                'text-[10px] font-bold uppercase tracking-tighter text-center max-w-[60px]',
                currentStage === stage.id ? 'text-primary-default' : 'text-gray-400'
              )}
            >
              {stage.title}
            </span>
          </div>
          {index < STAGES.length - 1 && (
            <div
              className={cn(
                'h-[2px] flex-1 -mt-6 transition-all duration-500',
                currentStage > stage.id ? 'bg-green-500' : 'bg-gray-100'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderContent = () => {
    const stage = STAGE_INFO.find((s) => s.id === currentStage);
    const stageTitle = STAGES.find((s) => s.id === currentStage)?.title;
    
    return (
      <div className="flex flex-col h-full min-h-[400px]">
        {renderStepper()}
        
        <div 
          key={currentStage}
          className="flex-1 py-12 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="size-24 bg-linear-to-br from-primary-lighter to-white rounded-[2.5rem] border border-primary-100 flex items-center justify-center mb-8 shadow-inner ring-8 ring-primary-default/5">
            <span className="text-5xl drop-shadow-sm">{stage?.icon}</span>
          </div>
          <h3 className="text-2xl font-black text-dark-950 mb-3 tracking-tight">
            {stageTitle}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
            {stage?.description}
          </p>
          
          <div className="mt-10 w-full max-w-md p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
             <div className="flex items-center justify-center gap-2 text-gray-400">
               <div className="size-1.5 bg-gray-300 rounded-full animate-bounce" />
               <div className="size-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
               <div className="size-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
             </div>
             <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-2">
               {t('formStage', { stage: currentStage })}
             </p>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          {currentStage > 1 && (
            <Button variant="transparent" onClick={handleBack} className="flex-1 h-12 rounded-xl font-bold border border-gray-100">
              <ChevronLeftIcon className="size-4 mr-2" />
              {t('back')}
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1 h-12 rounded-xl font-black shadow-lg shadow-primary-default/20 transition-all hover:scale-[1.02] active:scale-95">
            {currentStage === STAGES.length ? t('process') : t('next')}
            {currentStage < STAGES.length && <ChevronRightIcon className="size-4 ml-2" />}
          </Button>
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-6 pb-8 pt-2">
            <DrawerHeader>
                <DrawerTitle className="text-center">{t('title')}</DrawerTitle>
            </DrawerHeader>
          {renderContent()}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
