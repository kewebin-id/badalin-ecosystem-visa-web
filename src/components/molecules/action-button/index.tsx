import { Image } from '@/components/atoms';
import { cn } from '@/shared/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ActionButtonProps {
  icon?: LucideIcon;
  image?: string;
  onClick: () => void;
  title?: string;
  className?: string;
  label?: ReactNode;
  iconClassName?: string;
}

export const ActionButton = ({
  icon: Icon,
  image,
  onClick,
  title,
  className,
  label,
  iconClassName,
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'flex items-center justify-center transition-all border border-gray-200 cursor-pointer active:scale-95 group overflow-hidden',
        image
          ? 'p-0 h-10 w-10 rounded-xl'
          : label
            ? 'flex-col gap-1.5 py-3 rounded-2xl bg-gray-50 text-gray-500 hover:bg-white active:bg-blue-50'
            : 'h-10 w-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600',
        className,
      )}
    >
      {image ? (
        <div className="h-full w-full relative group-hover:scale-110 transition-transform">
          <Image src={image} alt="thumbnail" fill className="object-cover" />
        </div>
      ) : (
        Icon && <Icon className={cn('h-5 w-5', iconClassName)} />
      )}
      {label && <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>}
    </button>
  );
};
