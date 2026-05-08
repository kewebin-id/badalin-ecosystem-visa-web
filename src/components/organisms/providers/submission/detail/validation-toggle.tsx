'use client';

import { cn } from '@/shared/utils';

interface ValidationToggleProps {
  isValid: boolean | null;
  onToggle: (valid: boolean | null) => void;
  labels: {
    valid: string;
    invalid: string;
  };
  className?: string;
  readOnly?: boolean;
}

export const ValidationToggle = ({
  isValid,
  onToggle,
  labels,
  className,
  readOnly,
}: ValidationToggleProps) => {
  return (
    <div className={cn('flex gap-2 p-1 bg-gray-100 rounded-xl', className)}>
      <button
        type="button"
        onClick={() => !readOnly && onToggle(true)}
        className={cn(
          'flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all',
          readOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          isValid === true
            ? 'bg-white text-green-600 shadow-sm'
            : 'text-gray-400 hover:text-gray-600',
        )}
      >
        {labels.valid}
      </button>
      <button
        type="button"
        onClick={() => !readOnly && onToggle(false)}
        className={cn(
          'flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all',
          readOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          isValid === false
            ? 'bg-white text-red-600 shadow-sm'
            : 'text-gray-400 hover:text-gray-600',
        )}
      >
        {labels.invalid}
      </button>
    </div>
  );
};
