'use client';

import Link from 'next/link';
import { FC } from 'react';
import { CardProps } from './card';
import { CardChildren } from './card-children';

export const Card: FC<CardProps> = ({ href, onClick, ...props }) => {
  return href ? (
    <Link href={href}>
      <CardChildren {...props} />
    </Link>
  ) : (
    <div onClick={onClick}>
      <CardChildren {...props} />
    </div>
  );
};
