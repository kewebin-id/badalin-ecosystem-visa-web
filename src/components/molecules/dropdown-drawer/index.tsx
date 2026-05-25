'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  ScrollArea,
} from '@/components/atoms';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/molecules/dropdown-menu';
import { useScreenSize } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { X } from 'lucide-react';
import { FC, ReactNode } from 'react';

export interface DropdownDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger: ReactNode;
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
  showCloseButton?: boolean;
  headerRight?: ReactNode;
}

export const DropdownDrawer: FC<DropdownDrawerProps> = ({
  children,
  trigger,
  open,
  setOpen,
  description,
  title = '',
  descriptionClassName,
  titleClassName,
  className,
  showCloseButton = true,
  headerRight,
}) => {
  const { isDesktop } = useScreenSize();

  if (isDesktop) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          sideOffset={8}
          className="w-[380px] p-0! bg-white! rounded-xl overflow-hidden flex flex-col"
        >
          <div
            className={cn(
              (title || description) && 'shadow-xs border-b border-gray-100',
              'p-4 flex items-center justify-between w-full bg-white',
            )}
          >
            <div className={cn('flex flex-col flex-1', (showCloseButton || headerRight) && 'pr-4')}>
              <h4 className={cn('text-lg font-bold text-gray-900', titleClassName)}>
                {title}
              </h4>
              {description && (
                <p
                  className={cn(
                    'text-xs text-gray-500 mt-1 leading-relaxed',
                    descriptionClassName,
                  )}
                >
                  {description}
                </p>
              )}
            </div>
            {headerRight ? (
              <div className="shrink-0">{headerRight}</div>
            ) : showCloseButton ? (
              <div
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group shrink-0"
              >
                <X className="size-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            ) : null}
          </div>
          <ScrollArea className="max-h-[calc(100vh-200px)] overflow-y-auto w-full px-0! m-0!">
            <div className={cn(className, 'p-4')}>{children}</div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent className={cn(!title && !description && 'gap-0!', 'p-0! bg-white!')}>
        <DrawerHeader className="mb-0! pb-0! flex flex-row items-center justify-between w-full text-left">
          <div className="flex flex-col">
            <DrawerTitle className={cn(titleClassName)}>{title}</DrawerTitle>
            <DrawerDescription className={cn(descriptionClassName)}>{description}</DrawerDescription>
          </div>
          {headerRight && (
            <div className="shrink-0">{headerRight}</div>
          )}
        </DrawerHeader>
        <ScrollArea className="max-h-[calc(100vh-350px)] overflow-y-auto h-full px-0! m-0!">
          <div className={cn(className, 'p-4')}>{children}</div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
