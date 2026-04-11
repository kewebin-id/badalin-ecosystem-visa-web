'use client';

import { SidebarProvider } from '@/components/organisms';
import { DialogDrawer } from '@/components/molecules';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { AppHeader } from '../../organisms/layout/app-header';
import { AppSidebar } from '../../organisms/layout/app-sidebar';
import { useAuth } from '@/shared/hooks';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations();
  const router = useRouter();
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-200/50">
        {/* SIDEBAR: Fluid on Desktop, Sheet on Mobile */}
        <AppSidebar 
          onMenuClose={() => setIsSidebarOpen(false)} 
          onLogoutClick={() => setIsLogoutModalOpen(true)}
          className="hidden md:flex bg-white border-r border-gray-100"
        />

        {/* MOBILE SIDEBAR: Drawer with Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop with Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 lg:hidden"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-[280px] bg-white z-60 lg:hidden shadow-2xl"
              >
                <AppSidebar 
                  onMenuClose={() => setIsSidebarOpen(false)} 
                  onLogoutClick={() => setIsLogoutModalOpen(true)}
                  className="flex w-full h-full"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* CONTENT COLUMN: Resizes fluidly alongside sidebar */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
          {/* STICKY HEADER: Stays within the flex-1 column */}
          <AppHeader onMenuClick={() => setIsSidebarOpen(true)} />

          {/* SCROLLABLE MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto bg-gray-50/50">
            <div className="mx-auto p-4 md:p-8 space-y-6">{children}</div>
          </main>
        </div>

        {/* LOGOUT CONFIRMATION MODAL */}
        <DialogDrawer
          open={isLogoutModalOpen}
          setOpen={setIsLogoutModalOpen}
          title={t('Common.logoutConfirmTitle')}
          submitButton={t('Common.logout')}
          cancelButton={t('Common.cancel')}
          onCancel={() => setIsLogoutModalOpen(false)}
          onSubmit={async () => {
            setIsLogoutModalOpen(false);
            await signOut();
            router.push('/');
          }}
          disabledSubmitButton={false}
        >
          <p className="text-sm text-gray-500">{t('Common.logoutConfirmDesc')}</p>
        </DialogDrawer>
      </div>
    </SidebarProvider>
  );
};
