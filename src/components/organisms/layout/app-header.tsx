'use client';

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/atoms';
import { Skeleton } from '@/components/atoms/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  LocaleSwitcher,
} from '@/components/molecules';
import { SidebarTrigger } from '@/components/organisms';
import { useAuth } from '@/shared/hooks';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/utils';
import { Bell, BellOff, Building2, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface AppHeaderProps {
  className?: string;
  onMenuClick?: () => void;
}

export const AppHeader = ({ className, onMenuClick }: AppHeaderProps) => {
  const t = useTranslations();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const isMobile = useIsMobile();
  const { user, isLoadingAuth } = useAuth();

  const ComingSoonContent = () => (
    <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
      <div className="size-16 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
        <BellOff className="size-8" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-black text-foreground uppercase tracking-widest">Coming Soon</p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
          We are working hard to bring you real-time notifications about your visa status.
        </p>
      </div>
    </div>
  );

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

        <div className="flex items-center gap-3">
          <div className={cn('hidden sm:block', isMobile && 'hidden')}>
            <LocaleSwitcher />
          </div>

          <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />

          {isMobile ? (
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors relative"
            >
              <Bell className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary-default rounded-full border-2 border-white" />
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors relative outline-none">
                  <Bell className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary-default rounded-full border-2 border-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 p-0 mt-2 bg-white rounded-2xl shadow-xl border-gray-100 overflow-hidden"
              >
                <DropdownMenuLabel className="px-4 py-3 font-semibold text-sm border-b border-gray-50 flex justify-between items-center">
                  <span>{t('Dashboard.notifications')}</span>
                  <span className="text-[10px] bg-primary-default/10 text-primary-default px-2 py-0.5 rounded-full">
                    {t('Dashboard.newNotifications', { count: 3 })}
                  </span>
                </DropdownMenuLabel>
                <div className="max-h-[350px] overflow-hidden">
                  <ComingSoonContent />
                </div>
                <DropdownMenuSeparator className="m-0 bg-gray-50" />
                <button className="w-full py-3 text-xs font-medium text-primary-default hover:bg-gray-50 transition-colors">
                  {t('Dashboard.viewAllNotifications')}
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <Drawer open={isMobile && isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <DrawerContent className="rounded-t-[32px] p-0 overflow-hidden max-h-[85vh] border-none shadow-2xl">
          <DrawerHeader className="px-6 pt-6 pb-4 border-b border-gray-50 relative">
            <DrawerTitle className="text-xl font-black text-dark-950 tracking-tight text-left">
              {t('Dashboard.notifications')}
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="absolute right-6 top-6 size-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 active:bg-gray-100 transition-colors">
                <X className="size-4" strokeWidth={2.5} />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <div className="pb-10">
            <ComingSoonContent />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
