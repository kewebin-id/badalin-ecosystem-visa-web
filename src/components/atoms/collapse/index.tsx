import classNames from 'clsx';
import { FC, ReactNode } from 'react';

interface CollapseProps {
  opened: boolean;
  children: ReactNode;
  className?: string;
}

export const Collapse: FC<CollapseProps> = ({ children, opened, className }) => {
  return (
    <div
      className={classNames([
        className,
        'transition-all duration-100 ease-in-out w-full text-sm transform-gpu overflow-hidden',
      ])}
      style={{
        transformOrigin: 'top',
        height: opened ? '900%' : 0,
        opacity: opened ? 1 : 0,
        marginBottom: opened ? '1.5rem' : 0,
      }}
    >
      {children}
    </div>
  );
};
