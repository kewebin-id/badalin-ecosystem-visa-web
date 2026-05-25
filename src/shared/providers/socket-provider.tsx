'use client';

import { useAuth } from '@/shared/hooks/use-auth';
import { useNotificationStore } from '@/shared/hooks/use-notification-store';
import { Bell, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SoundPermissionPrompt, GlobalNotificationToast } from '@/components/organisms';
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
      window.dispatchEvent(new CustomEvent('show_custom_toast', { detail: payload }));

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
    <SocketContext.Provider value={{ socket, isConnected }}>
      <SoundPermissionPrompt />
      <GlobalNotificationToast />
      {children}
    </SocketContext.Provider>
  );
};
