'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  ScrollArea,
} from '@/components/atoms';
import { useScreenSize } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { X } from 'lucide-react';
import { FC } from 'react';
import { DialogDrawerProps } from './dialog-drawer';

export const DialogDrawer: FC<DialogDrawerProps> = ({
  children,
  open,
  setOpen,
  description,
  title = '',
  descriptionClassName,
  titleClassName,
  cancelButton = 'Cancel',
  cancelButtonClassName,
  disabledCancelButton,
  disabledSubmitButton = true,
  onCancel,
  onSubmit,
  submitButton = 'Submit',
  submitButtonClassName,
  submitting,
  className,
}) => {
  const { isDesktop } = useScreenSize();

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="gap-0! p-0! bg-white!">
          <DialogHeader className="mb-0! pb-0!">
            <div
              className={cn(
                (title || description) && 'shadow',
                title && !description && 'items-center',
                'p-4 flex justify-between w-full',
              )}
            >
              <div className="flex flex-col">
                <DialogTitle className={cn(titleClassName)}>{title}</DialogTitle>
                {description && (
                  <DialogDescription className={cn(descriptionClassName)}>
                    {description}
                  </DialogDescription>
                )}
                {!title && !description && <div className="h-1" />}
              </div>
              <X onClick={() => setOpen(false)} className="text-muted-foreground cursor-pointer" />
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(100vh-200px)] overflow-y-auto w-full px-0! m-0!">
            <div className={cn(className, 'p-4')}>{children}</div>
          </ScrollArea>
          {(onCancel || onSubmit) && (
            <DialogFooter
              className="flex justify-between gap-4 p-4"
              style={{ boxShadow: '0px -1px 3px rgba(0, 0, 0, 0.1)' }}
            >
              {onCancel && (
                <div className="w-full">
                  <Button
                    onClick={() => onCancel(false)}
                    disabled={disabledCancelButton || submitting}
                    size="md"
                    variant="dangerOutline"
                    className={cn(cancelButtonClassName, 'w-full')}
                  >
                    {cancelButton}
                  </Button>
                </div>
              )}
              {onSubmit && (
                <div className="w-full">
                  <Button
                    onClick={onSubmit}
                    size="md"
                    disabled={disabledSubmitButton || submitting}
                    isSubmitting={submitting}
                    variant="primary"
                    className={cn(submitButtonClassName, 'w-full')}
                  >
                    {submitButton}
                  </Button>
                </div>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className={cn(!title && !description && 'gap-0!', 'p-0! bg-white!')}>
        <DrawerHeader className="mb-0! pb-0!">
          <DrawerTitle className={cn(titleClassName)}>{title}</DrawerTitle>
          <DrawerDescription className={cn(descriptionClassName)}>{description}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="max-h-[calc(100vh-350px)] overflow-y-auto h-full px-0! m-0!">
          <div className={cn(className, 'p-4')}>{children}</div>
        </ScrollArea>
        {(onCancel || onSubmit) && (
          <DrawerFooter
            className="flex flex-col gap-2 p-4 z-[20]"
            style={{ boxShadow: '0px -1px 3px rgba(0, 0, 0, 0.1)' }}
          >
            {onSubmit && (
              <div className="w-full">
                <Button
                  onClick={onSubmit}
                  size="md"
                  disabled={disabledSubmitButton || submitting}
                  isSubmitting={submitting}
                  variant="primary"
                  className={cn(submitButtonClassName, 'w-full')}
                >
                  {submitButton}
                </Button>
              </div>
            )}
            {onCancel && (
              <div className="w-full">
                <Button
                  onClick={() => onCancel(false)}
                  disabled={disabledCancelButton || submitting}
                  size="md"
                  variant="dangerOutline"
                  className={cn(cancelButtonClassName, 'w-full')}
                >
                  {cancelButton}
                </Button>
              </div>
            )}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
