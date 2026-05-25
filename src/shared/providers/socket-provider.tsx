'use client';

import { useAuth } from '@/shared/hooks/use-auth';
import { useNotificationStore } from '@/shared/hooks/use-notification-store';
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

  useEffect(() => {
    if (!isLoggedIn || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketInstance = io(`${window.location.origin}/notifications`, {
      path: '/ws-api/notifications/socket.io',
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
      toast.info(payload.title, {
        description: payload.message,
      });
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
