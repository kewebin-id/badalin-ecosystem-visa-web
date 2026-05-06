'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { cn } from '@/shared/utils';
import { getAvatarColor, getInitials } from '@/shared/utils/avatar';
import React from 'react';

interface UserAvatarProps {
  name: string;
  src?: string;
  seed?: string;
  className?: string;
  fallbackClassName?: string;
}

export const UserAvatar = ({ name, src, seed, className, fallbackClassName }: UserAvatarProps) => {
  const initials = getInitials(name);
  const backgroundColor = getAvatarColor(seed || name);

  return (
    <Avatar className={cn('size-10', className)}>
      {src && <AvatarImage src={src} alt={name} className="object-cover" />}
      <AvatarFallback
        className={cn('font-bold text-white', fallbackClassName)}
        style={{ backgroundColor }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
