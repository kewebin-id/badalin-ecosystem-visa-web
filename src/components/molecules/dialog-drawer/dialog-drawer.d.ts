import { ReactNode } from 'react';

export interface DialogDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  submitButton?: ReactNode;
  cancelButton?: ReactNode;
  disabledSubmitButton?: boolean;
  disabledCancelButton?: boolean;
  submitting?: boolean;
  submitButtonClassName?: string;
  cancelButtonClassName?: string;
  onSubmit?: () => void;
  onCancel?: (flag?: boolean) => void;
  className?: string;
}
