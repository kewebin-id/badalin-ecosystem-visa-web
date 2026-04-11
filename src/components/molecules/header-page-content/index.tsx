'use client';

import { Button } from '@/components/atoms';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface HeaderPageContentProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  extra?: ReactNode;
}

export const HeaderPageContent = ({
  title,
  subtitle,
  onBack,
  extra,
}: HeaderPageContentProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-gray-100 shadow-sm p-6 bg-white animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex-1 flex items-center gap-4">
        <div>
          <Button
            variant="primaryOutline"
            size="icon"
            onClick={onBack || (() => router.back())}
            className="rounded-xl h-10 w-10 hover:bg-primary-50 hover:border-primary-100 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </Button>
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground truncate tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground font-medium line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {extra && (
        <div className="hidden md:flex items-center text-right border-l border-gray-100 pl-8 ml-4">
          {extra}
        </div>
      )}
    </div>
  );
};
