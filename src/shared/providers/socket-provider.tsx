'use client';

import { useAuth } from '@/shared/hooks/use-auth';
import { useNotificationStore } from '@/shared/hooks/use-notification-store';
import { Bell, Volume2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoggedIn } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { addNotification, incrementUnreadCount } = useNotificationStore();
  const t = useTranslations('SoundPermission');

  useEffect(() => {
    const granted = localStorage.getItem('sound_permission_granted');
    const lastAsked = localStorage.getItem('sound_permission_asked');
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (granted !== 'true' && (!lastAsked || now - parseInt(lastAsked) > oneWeek)) {
      const timer = setTimeout(() => {
        toast.custom(
          (tToast) => (
            <div className="relative flex w-full max-w-sm overflow-hidden bg-white rounded-xl shadow-xl dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10 pointer-events-auto p-4 flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-default/10 text-primary-default">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {t('title')}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {t('description')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={() => {
                    localStorage.setItem('sound_permission_asked', now.toString());
                    toast.dismiss(tToast);
                  }}
                  className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {t('later')}
                </button>
                <button
                  onClick={() => {
                    const audio = new Audio('/assets/sounds/notif.mp3');
                    audio.volume = 0;
                    audio.play().catch(() => {});
                    localStorage.setItem('sound_permission_granted', 'true');
                    toast.dismiss(tToast);
                  }}
                  className="px-4 py-2 text-xs font-medium text-white bg-primary-default hover:bg-primary-dark rounded-lg transition-colors shadow-sm"
                >
                  {t('allow')}
                </button>
              </div>
            </div>
          ),
          {
            duration: Number.POSITIVE_INFINITY,
            position:
              typeof window !== 'undefined' && window.innerWidth < 768 ? 'top-center' : 'top-left',
            unstyled: true,
            className: 'bg-transparent! border-none! shadow-none! p-0! flex! w-full!',
          },
        );
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const baseUrl = process.env.BASE_API_URL;
    const socketInstance = io(`${baseUrl}/notifications`, {
      auth: { token },
      autoConnect: false,
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('new_notification', (payload) => {
      addNotification(payload);
      incrementUnreadCount();
      toast.custom(
        (t) => (
          <div className="relative flex w-full max-w-sm overflow-hidden bg-white rounded-xl shadow-xl dark:bg-neutral-800 ring-1 ring-black/5 dark:ring-white/10 pointer-events-auto">
            <div className="flex items-center justify-center w-12 bg-primary">
              <Bell className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="px-4 py-3 flex-1">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 pr-4">
                {payload.title}
              </h3>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                {payload.message}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ),
        {
          duration: 10000,
          position:
            typeof window !== 'undefined' && window.innerWidth < 768 ? 'top-center' : 'top-right',
          unstyled: true,
          className: 'bg-transparent! border-none! shadow-! p-0! flex! w-full!',
        },
      );

      // Play notification sound
      try {
        const audio = new Audio('/assets/sounds/notif.mp3');
        audio.play().catch((error) => {
          console.error('Failed to play notification audio:', error);
        });
      } catch (error) {
        console.error('Audio is not supported or failed to initialize', error);
      }
    });

    socketInstance.connect();
    setSocket(socketInstance);

    return () => {
      socketInstance.off('new_notification');
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, isLoggedIn, addNotification, incrementUnreadCount]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
  );
};
