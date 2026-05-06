'use client';

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  Select as SelectOriginal,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@/components/atoms';
import styles from '@/shared/styles/components/input.module.css';
import { cn } from '@/shared/utils';
import { AlertTriangle, Check, ChevronDown, Sparkles } from 'lucide-react';
import { FC, useMemo, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { InputSelelctProps } from '../input';

export const InputSelect: FC<InputSelelctProps> = (props) => {
  const methods = useFormContext();

  if (methods && props.name) {
    return <InputSelectControlled {...props} control={methods.control} />;
  }

  return <InputSelectBase {...props} />;
};

const InputSelectControlled = (
  props: InputSelelctProps & {
    control: import('react-hook-form').Control<Record<string, unknown>>;
  },
) => {
  const { field, fieldState } = useController({
    name: props.name || '',
    control: props.control,
  });

  return (
    <InputSelectBase
      {...props}
      value={field.value as string}
      onValueChange={field.onChange}
      fieldRef={field.ref}
      error={fieldState.error?.message}
      isTouched={fieldState.isTouched}
    />
  );
};

interface InputSelectBaseProps extends InputSelelctProps {
  fieldRef?: import('react').Ref<HTMLButtonElement>;
  error?: string;
  onValueChange?: (value: string) => void;
}

const InputSelectBase: FC<InputSelectBaseProps> = ({
  className,
  size = 'lg',
  disabled,
  useLabelInside,
  errorMessage,
  placeholder,
  label,
  options,
  setValue: _setValue,
  value: _value,
  required,
  isLoading,
  isTouched: _isTouched,
  isAutoDetected,
  confidence,
  isReadingOcr,
  register,
  name,
  onValueChange: _onValueChange,
  fieldRef,
  error,
}) => {
  const [opened, setOpened] = useState<boolean>(false);

  const tuningRegister = register && name && register(name);

  const currentValue = useMemo(() => {
    return _value !== undefined && _value !== null && _value !== '' ? _value : undefined;
  }, [_value]);

  const effectiveError = errorMessage || error;
  const effectiveIsTouched = _isTouched;

  const onValueInternalChange = (val: string) => {
    if (!opened) return;

    if (_onValueChange) {
      _onValueChange(val);
    }

    if (tuningRegister) {
      tuningRegister?.onChange({ target: { value: val, name: name || '' }, type: 'change' });
    } else {
      if (_setValue) _setValue(val);
    }
  };

  const icon = useMemo(
    () => (
      <ChevronDown
        className={cn(
          'transition-all duration-200',
          opened ? 'rotate-180' : '',
          size === 'lg' ? 'size-6' : size === 'md' ? 'size-5' : 'size-4',
        )}
      />
    ),
    [opened, size],
  );

  return isLoading ? (
    <Skeleton className="h-[55px] w-full rounded-lg" />
  ) : (
    <div className={cn('relative w-full', label && !useLabelInside && 'flex flex-col gap-2')}>
      {label && !useLabelInside && (
        <label>
          {label}
          {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      <SelectOriginal
        disabled={disabled}
        onOpenChange={setOpened}
        onValueChange={onValueInternalChange}
        value={currentValue}
      >
        <span className="relative block w-full">
          <SelectTrigger
            ref={fieldRef}
            icon={icon}
            className={cn(
              styles[size],
              className,
              'bg-white! text-black',
              effectiveError && effectiveIsTouched
                ? styles['form-input-error']
                : styles['form-input'],
              useLabelInside && styles[`form-input-inside${currentValue ? '-active' : ''}`],
              opened && styles['input-focused'],
              disabled && 'cursor-not-allowed! border-[#DFE1E6]! bg-[#EFF1F4]!',
              'pr-10 text-left',
            )}
          >
            <SelectValue placeholder={!useLabelInside ? placeholder : ''} />
          </SelectTrigger>

          {label && useLabelInside && (
            <label
              className={cn(
                styles['form-label-inside'],
                (opened || currentValue) && styles['form-label-inside-active'],
                opened || currentValue ? 'text-gray-500' : 'text-gray-400',
              )}
            >
              <span className="text-nowrap">{label}</span>
              {required && (opened || currentValue) && <span className="text-danger-500">*</span>}
            </label>
          )}
        </span>
        <SelectContent className="overflow-y-auto max-h-64">
          <SelectGroup>
            {options
              .filter(
                (option) =>
                  option.value !== '' && option.value !== null && option.value !== undefined,
              )
              .map((option) => (
                <SelectItem className={styles[size]} key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </SelectOriginal>

      {isReadingOcr && (
        <p className="mt-1 flex items-center gap-1 text-[10px] text-primary-500 animate-pulse">
          <Sparkles className="size-3" />
          Reading OCR...
        </p>
      )}

      {isAutoDetected && !isReadingOcr && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-600">
            <Sparkles className="size-3 text-primary-500" />
            Auto-detected
          </div>
          {confidence !== undefined && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-success-600">
              <Check className="size-3" />
              {confidence?.toFixed(2)}% confidence
            </div>
          )}
        </div>
      )}

      {effectiveError && effectiveIsTouched && (
        <p className="flex items-center gap-1 text-danger-500 text-sm mt-1">
          <AlertTriangle className="size-4 min-h-4 min-w-4 text-danger-500" />
          {effectiveError}
        </p>
      )}
    </div>
  );
};
