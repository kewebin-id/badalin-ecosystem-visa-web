import { CSSProperties, ReactNode } from 'react';

export interface CardProps {
  style?: CSSProperties;
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}
