'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}

export const NavLink = ({ href, children, className, activeClassName, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link href={href} className={cn(className, isActive && activeClassName)} onClick={onClick}>
      {children}
    </Link>
  );
};
