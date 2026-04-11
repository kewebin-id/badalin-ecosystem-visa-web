import { ReactNode } from 'react';

export interface NotFoundProps {
  message?: ReactNode;
  label?: string;
  icon?: ReactNode;
  className?: string;
  iconClassName?: string;
  actionButton?: ReactNode;
  actionHref?: string;
  labelClassName?: string;
}
