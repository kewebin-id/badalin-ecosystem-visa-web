'use client';

import { Button } from '@/components/atoms';
import { motion } from 'framer-motion';
import { ArrowLeft, Construction, Layout } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface UnderConstructionProps {
  title?: string;
  description?: string;
  backHref?: string;
}

export const UnderConstruction = ({ title, description, backHref }: UnderConstructionProps) => {
  const t = useTranslations('UnderConstruction');
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in duration-700">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-primary-default/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative bg-white p-8 rounded-[2.5rem] border-2 border-gray-900 shadow-2xl">
          <Construction
            className="h-16 w-16 text-primary-default animate-bounce"
            strokeWidth={1.5}
          />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-4 -right-4 bg-yellow-400 p-3 rounded-2xl shadow-lg border-2 border-gray-900"
        >
          <Layout className="h-6 w-6 text-gray-900" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-md space-y-4"
      >
        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">
          {title || t('title')}
        </h1>
        <p className="text-gray-500 font-medium leading-relaxed">
          {description || t('description')}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-12 flex gap-4"
      >
        <Button
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          variant="primaryOutline"
          className="rounded-2xl px-8 py-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> {t('goBack')}
        </Button>
      </motion.div>

      <div className="mt-20 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 opacity-50">
        <div className="h-2 w-2 bg-primary-default rounded-full animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {process.env.APP_VERSION || 'v1.0.0'} · {t('comingSoon')}
        </span>
      </div>
    </div>
  );
};
