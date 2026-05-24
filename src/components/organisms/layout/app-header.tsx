'use client';

import { Button } from '@/components/atoms';
import { Skeleton } from '@/components/atoms/skeleton';
import {
  LocaleSwitcher,
} from '@/components/molecules';
import { SidebarTrigger, NotificationDropdown } from '@/components/organisms';
import { useAuth } from '@/shared/hooks';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/utils';
import { Bell, Building2, Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AppHeaderProps {
  className?: string;
  onMenuClick?: () => void;
}

export const AppHeader = ({ className, onMenuClick }: AppHeaderProps) => {
  const isMobile = useIsMobile();
  const { user, isLoadingAuth } = useAuth();



  return (
    <>
      <header
        className={cn(
          'h-16 shrink-0 sticky top-0 z-30 bg-white backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6',
          className,
        )}
      >
        <div className="flex items-center gap-3 justify-start">
          <Button
            variant="transparent"
            size="icon"
            className="lg:hidden flex w-full item-center"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <div
              className={cn(
                'bg-[url(/assets/images/logo-transparent.webp)] bg-contain bg-no-repeat bg-center h-[40px] w-[100px]',
              )}
            />
          </Button>

          <div className="hidden lg:block">
            <SidebarTrigger className="text-muted-foreground" />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1 text-xs text-muted-foreground border border-gray-200">
            <Building2 className="h-3 w-3" strokeWidth={1.5} />
            {isLoadingAuth ? (
              <Skeleton className="h-6 w-24 rounded-full" />
            ) : (
              <span className="text-nowrap font-medium">{user?.agency?.name || 'Badalin'}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <LocaleSwitcher />

          <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />

          <NotificationDropdown />
        </div>
      </header>
    </>
  );
};
