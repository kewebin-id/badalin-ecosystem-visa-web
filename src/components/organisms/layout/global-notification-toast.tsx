'use client';

import { Bell, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { INotification } from '@/shared/hooks/use-notification-store';

export const GlobalNotificationToast = () => {
  const [toast, setToast] = useState<INotification | null>(null);

  useEffect(() => {
    const handleShowToast = (e: Event) => {
      const customEvent = e as CustomEvent<INotification>;
      setToast(customEvent.detail);

      const timer = setTimeout(() => {
        setToast((current) => {
          if (current?.id === customEvent.detail.id) return null;
          return current;
        });
      }, 10000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('show_custom_toast', handleShowToast);
    return () => window.removeEventListener('show_custom_toast', handleShowToast);
  }, []);

  if (!toast) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      className={`fixed z-[9999] transition-all duration-500 ease-in-out ${
        isMobile ? 'bottom-4 left-4 right-4' : 'top-20 right-4'
      }`}
    >
      <div className="relative flex w-full md:w-96 overflow-hidden bg-white rounded-xl shadow-2xl ring-1 ring-black/5 pointer-events-auto">
        <div className="flex items-center justify-center w-12 bg-primary-default shrink-0">
          <Bell className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div className="px-4 py-3 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 pr-4">{toast.title}</h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{toast.message}</p>
        </div>
        <button
          onClick={() => setToast(null)}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
