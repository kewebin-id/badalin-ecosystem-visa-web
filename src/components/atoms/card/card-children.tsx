'use client';

import styles from '@/shared/styles/components/card.module.css';
import { cn } from '@/shared/utils';
import { FC } from 'react';
import { CardProps } from './card';

export const CardChildren: FC<CardProps> = ({ children, className }) => {
  return <div className={cn(className, styles.card)}>{children}</div>;
};
