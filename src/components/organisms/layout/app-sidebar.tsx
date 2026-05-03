'use client';

import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/atoms';
import { Skeleton } from '@/components/atoms/skeleton';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/organisms';
import { NavLink } from '@/components/organisms/layout/navlink';
import { ROUTES } from '@/shared/constants/routes';
import { useAuth } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LogOut, PanelLeftClose, Plane, Users, Inbox, CreditCard, FileText, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';

export const AppSidebar = ({
  onMenuClose,
  className,
  onLogoutClick,
}: {
  onMenuClose?: () => void;
  className?: string;
  onLogoutClick?: () => void;
}) => {
  const t = useTranslations();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const pathname = usePathname();
  const { user, isLoadingAuth } = useAuth();
  const params = useParams();
  const slug = (params?.slug as string) || user?.agency?.slug || 'p';

  const isLoading = isLoadingAuth;

  const name = user?.fullName || '';
  const role = user?.role === 'PILGRIM' ? 'Jamaah Pilgrim' : user?.role || 'User';

  const isProvider = user?.role === 'PROVIDER';

  const menuItems = isProvider
    ? [
        {
          title: 'ProviderSidebar.dashboard',
          url: ROUTES.PROVIDER.DASHBOARD(slug),
          icon: LayoutDashboard,
          exact: true,
        },
        {
          title: 'ProviderSidebar.submissions',
          url: ROUTES.PROVIDER.SUBMISSIONS(slug),
          icon: Inbox,
        },
        {
          title: 'ProviderSidebar.paymentVerification',
          url: ROUTES.PROVIDER.PAYMENT_VERIFICATION(slug),
          icon: CreditCard,
        },
        {
          title: 'ProviderSidebar.manifestData',
          url: ROUTES.PROVIDER.SUBMISSIONS(slug),
          icon: FileText,
        },
        {
          title: 'ProviderSidebar.settings',
          url: ROUTES.PROVIDER.SETTINGS(slug),
          icon: Settings,
        },
      ]
    : [
        {
          title: 'Dashboard.title',
          url: ROUTES.PILGRIM.DASHBOARD,
          icon: LayoutDashboard,
          exact: true,
        },
        {
          title: 'Dashboard.familyGroup',
          url: ROUTES.PILGRIM.FAMILY.INDEX,
          icon: Users,
        },
        {
          title: 'Dashboard.transactions',
          url: ROUTES.PILGRIM.TRANSACTION.INDEX,
          icon: Plane,
        },
      ];

  return (
    <Sidebar
      collapsible="icon"
      className={cn('flex flex-col h-full transition-all duration-300 ease-in-out', className)}
    >
      <div
        className={cn(
          'h-16 shrink-0 flex items-center border-b border-gray-200 w-full',
          !collapsed ? 'justify-between px-0' : 'justify-center px-6',
        )}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              width: collapsed ? 32 : 128,
              height: collapsed ? 32 : 40,
            }}
            className={cn(
              collapsed
                ? 'bg-[url(/og-image.webp)] rounded-lg'
                : 'bg-[url(/assets/images/logo-transparent.webp)]',
              'bg-contain bg-no-repeat bg-center',
            )}
          />
        </div>

        {!collapsed && onMenuClose && (
          <div>
            <Button
              variant="transparent"
              size="icon"
              onClick={onMenuClose}
              className="md:hidden h-9 w-9 rounded-xl text-muted-foreground hover:bg-gray-100 active:scale-95 transition-all"
            >
              <PanelLeftClose
                className="h-5 w-5 hover:scale-125 transition-all duration-200"
                strokeWidth={1.5}
              />
            </Button>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-6 py-6 border-b border-gray-200 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="relative group">
              {isLoading ? (
                <Skeleton variant="ellipse" className="h-11 w-11 rounded-2xl" />
              ) : user?.photoUrl ? (
                <Avatar className="size-11 rounded-none">
                  <AvatarImage
                    src={user.photoUrl}
                    className="object-cover size-11 rounded-2xl shrink-0 border-2 border-gray-200 shadow-sm"
                  />
                  <AvatarFallback className="bg-transparent text-inherit font-black">
                    {name && name !== '-'
                      ? name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                      : '?'}
                  </AvatarFallback>
                </Avatar>
              ) : name && name !== '-' ? (
                name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
              ) : (
                '?'
              )}
              {!isLoading && (
                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              ) : (
                <>
                  <p className="text-sm font-bold text-foreground truncate">{name}</p>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground opacity-60">
                    {role}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <SidebarContent className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive = item.exact ? pathname === item.url : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild tooltip={!isLoading ? t(item.title) : ''}>
                      <NavLink
                        href={item.url}
                        onClick={onMenuClose}
                        className={cn(
                          'group flex items-center px-4 py-3 rounded-2xl transition-all duration-200 w-full relative overflow-hidden cursor-pointer',
                          isActive
                            ? 'bg-primary-default/10 text-primary-default shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-foreground',
                        )}
                        activeClassName="bg-primary-default/10 text-primary-default shadow-sm"
                      >
                        <item.icon
                          className={cn(
                            'h-[18px] w-[18px] transition-transform duration-200 shrink-0',
                            isActive ? 'scale-110 text-primary-default' : 'group-hover:scale-110',
                          )}
                          strokeWidth={isActive ? 2 : 1.5}
                        />
                        <AnimatePresence mode="wait">
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className={cn(
                                'ml-3 text-sm font-medium truncate overflow-hidden flex-1',
                                isActive && 'font-bold',
                              )}
                            >
                              {isLoading ? (
                                <Skeleton className="h-4 w-full max-w-[120px] rounded" />
                              ) : (
                                t(item.title)
                              )}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {isActive && !collapsed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-default shadow-sm shadow-primary-default/40 shrink-0"
                          />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="shrink-0 p-2 border-t border-gray-200 space-y-2 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                onMenuClose?.();
                onLogoutClick?.();
              }}
              className="group flex w-full items-center p-3 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-50/50 transition-all duration-200 cursor-pointer"
            >
              <div className="p-2 rounded-xl group-hover:bg-red-50 transition-colors shrink-0">
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="ml-2 text-sm font-semibold truncate overflow-hidden"
                  >
                    {!isLoading ? t('Common.logout') : <Skeleton className="h-4 w-16 rounded" />}
                  </motion.span>
                )}
              </AnimatePresence>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
