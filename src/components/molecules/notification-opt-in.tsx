'use client';

import { Button } from '@/components/atoms';
import { NotificationRepository } from '@/packages/notification/repository';
import { NotificationUseCase } from '@/packages/notification/usecase';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const NotificationOptIn = () => {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    const repository = new NotificationRepository();
    const useCase = new NotificationUseCase(repository);

    const granted = await useCase.requestPermission();

    if (granted) {
      toast.success('Notification permission granted!');
    } else {
      toast.error('Notification permission denied');
    }

    setIsRequesting(false);
  };

  return (
    <Button onClick={handleRequestPermission} variant="primaryOutline" disabled={isRequesting}>
      <Bell className="mr-2 h-4 w-4" />
      Enable Notifications
    </Button>
  );
};
