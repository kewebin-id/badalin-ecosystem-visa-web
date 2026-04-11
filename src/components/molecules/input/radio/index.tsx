'use client';

import { RadioGroup, RadioGroupItem } from '@/components/atoms/radio-group';
import { cn } from '@/shared/utils';

export interface InputRadioProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string; description?: string }>;
  className?: string;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const InputRadio = ({
  value,
  onChange,
  options,
  className,
  label,
  required,
  errorMessage,
  disabled = false,
  orientation = 'vertical',
}: InputRadioProps) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
          {required && <span className="text-danger-default ml-1">*</span>}
        </label>
      )}
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(orientation === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-3')}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors',
              value === option.value
                ? 'border-primary-500 bg-primary-50'
                : errorMessage
                  ? 'border-danger-200 hover:bg-danger-50'
                  : 'border-gray-200 hover:bg-gray-50',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
            onClick={() => !disabled && onChange(option.value)}
          >
            <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
            <div className="flex-1">
              <label
                htmlFor={option.value}
                className="font-medium text-gray-900 cursor-pointer block"
              >
                {option.label}
              </label>
              {option.description && (
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
      {errorMessage && <p className="text-sm text-danger-default mt-1">{errorMessage}</p>}
    </div>
  );
};
