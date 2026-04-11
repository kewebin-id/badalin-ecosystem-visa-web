'use client';

import { cn } from '@/shared/utils';
import { FC } from 'react';
import { Button } from '../button';
import { NotFoundProps } from './not-found';

export const NotFoundComp: FC<NotFoundProps> = ({
  actionButton,
  actionHref,
  icon = '/assets/images/illustration-not-found.webp',
  iconClassName,
  label,
  message,
  className,
  labelClassName,
}) => (
  <div className={cn(className, 'flex items-center justify-center flex-col h-full gap-4')}>
    <div
      className={cn(
        iconClassName,
        'bg-cover bg-center bg-no-repeat h-[130px] w-[160px] no-repeat center center',
      )}
      style={{
        backgroundImage: `url(${icon})`,
      }}
    />
    <div className="space-y-1 text-center">
      <div className={cn(labelClassName, 'text-md font-medium text-dark-default')}>
        {label || 'Data'} Not Found
      </div>
      {message && <div className="text-xs text-gray-500">{message}</div>}
    </div>
    <div className="mx-auto">
      {(actionButton || actionHref) && (
        <Button className="w-fit px-8" href={actionHref}>
          {actionButton || 'Kembali'}
        </Button>
      )}
    </div>
  </div>
);
