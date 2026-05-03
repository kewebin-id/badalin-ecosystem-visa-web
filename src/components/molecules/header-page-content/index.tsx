'use client';

import { Button } from '@/components/atoms';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface HeaderPageContentProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  hideBack?: boolean;
  extra?: ReactNode;
}

export const HeaderPageContent = ({
  title,
  subtitle,
  onBack,
  hideBack = false,
  extra,
}: HeaderPageContentProps) => {
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-4 rounded-[2rem] border border-gray-100 p-6 animate-in fade-in slide-in-from-top-4 duration-500"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fdfdfd 100%)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="flex-1 flex items-center gap-4">
        {!hideBack && (
          <div>
            <Button
              variant="primaryOutline"
              size="icon"
              onClick={onBack || (() => router.back())}
              className="rounded-xl h-10 w-10 hover:bg-primary-50 hover:border-primary-100 transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </Button>
          </div>
        )}
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
