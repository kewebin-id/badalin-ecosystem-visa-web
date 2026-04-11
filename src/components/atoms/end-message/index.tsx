import { cn } from '@/shared/utils';
import { Database } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface EndMessageProps {
  message?: string;
  label?: string;
  icon?: ReactNode;
  className?: string;
}

export const EndMessage: FC<EndMessageProps> = ({ icon, label = 'data', message, className }) => {
  return (
    <div
      className={cn(
        className,
        'mx-auto flex justify-center gap-2 items-center rounded-full px-4 py-3 bg-primary-lighter/40 text-black text-sm w-fit',
      )}
    >
      <div className="text-primary-default">{icon || <Database className="size-4" />}</div>
      {message || <p>Semua {label?.toLowerCase()} telah ditampilkan</p>}
    </div>
  );
};
