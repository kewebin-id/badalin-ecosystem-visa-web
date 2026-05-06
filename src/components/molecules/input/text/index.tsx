'use client';

import styles from '@/shared/styles/components/input.module.css';
import { cn, formatRupiah, unformatRupiah } from '@/shared/utils';
import { AlertTriangle, Check, Sparkles } from 'lucide-react';
import { Image } from '@/components/atoms';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { InputTextProps } from '../input';

export const InputText = (props: InputTextProps) => {
  const methods = useFormContext();

  if (methods) {
    return <InputTextWatcher {...props} methods={methods} />;
  }

  return <InputTextRoot {...props} />;
};

const InputTextWatcher = (
  props: InputTextProps & {
    methods: import('react-hook-form').UseFormReturn<Record<string, unknown>>;
  },
) => {
  const watchedValue = useWatch({
    control: props.methods.control,
    name: props.name || '',
    disabled: !props.name || !props.register,
  });

  return <InputTextRoot {...props} watchedValue={watchedValue} />;
};

const InputTextRoot = ({
  type = 'text',
  label,
  placeholder,
  labelClassName,
  required,
  iconOnClick,
  icon,
  iconPosition,
  iconType = 'string',
  iconClassName,
  iconHeight,
  iconWidth,
  className,
  register,
  name,
  errorMessage,
  setValue,
  value,
  useLabelInside,
  onBlur,
  onFocus,
  onEnter,
  size = 'lg',
  readonly,
  maxLength,
  autoComplete,
  helperText,
  isFocused: isFocusedProp,
  isAutoDetected,
  confidence,
  isReadingOcr,
  disabled,
  watchedValue,
}: InputTextProps & { watchedValue?: unknown }) => {
  const [inputState, setInputState] = useState<string | number | undefined>(value);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const tuningRegister = register && name && register(name);

  useEffect(() => {
    if (value === undefined || value === null || value === '') {
      setInputState(undefined);
    } else {
      setInputState(value);
    }
  }, [value]);

  useEffect(() => {
    if (tuningRegister && value) {
      setInputState(value);
    }
  }, [tuningRegister, value]);

  useEffect(() => {
    if (watchedValue !== undefined && watchedValue !== inputState) {
      setInputState((watchedValue as string | number | undefined) ?? undefined);
    }
  }, [watchedValue, inputState]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (tuningRegister) {
      tuningRegister?.onChange(e);
    } else {
      if (setValue) setValue(val);
    }

    if (type === 'price') {
      const numericValue = unformatRupiah(val);
      const formattedValue = formatRupiah(Number(numericValue));
      setInputState(formattedValue);
    } else {
      setInputState(val);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onEnter) onEnter();
    }
  };

  const handleIsFocused = isFocusedProp || isFocused;

  return (
    <div className={cn('relative w-full', label && !useLabelInside && 'flex flex-col gap-2')}>
      {label && !useLabelInside && (
        <label
          className={cn(
            'text-sm font-medium text-foreground',
            labelClassName,
            errorMessage && 'text-danger-500',
          )}
        >
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      <span className="relative block w-full">
        {type === 'price' ? (
          <input
            {...(tuningRegister || {})}
            onChange={onChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            value={inputState || ''}
            type="text"
            placeholder={!useLabelInside ? placeholder : ''}
            readOnly={readonly}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={autoComplete}
            required={required}
            className={cn(
              styles[size],
              className,
              'bg-white! text-black',
              errorMessage ? styles['form-input-error'] : styles['form-input'],
              disabled && 'cursor-not-allowed bg-gray-100! border-gray-200!',
              useLabelInside &&
                styles[`form-input-inside${inputState || value || watchedValue ? '-active' : ''}`],
              (iconPosition === 'left' || (icon && !iconPosition)) && 'pl-10',
              iconPosition === 'right' && 'pr-10',
              handleIsFocused && 'input-focused',
            )}
          />
        ) : (
          <input
            {...(tuningRegister || {})}
            onChange={onChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            value={inputState || ''}
            type={type}
            placeholder={!useLabelInside ? placeholder : ''}
            readOnly={readonly}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={autoComplete}
            required={required}
            className={cn(
              styles[size],
              className,
              'bg-white! text-black',
              errorMessage ? styles['form-input-error'] : styles['form-input'],
              disabled && 'cursor-not-allowed bg-gray-100! border-gray-200!',
              useLabelInside &&
                styles[`form-input-inside${inputState || value || watchedValue ? '-active' : ''}`],
              (iconPosition === 'left' || (icon && !iconPosition)) && 'pl-10',
              iconPosition === 'right' && 'pr-10',
              handleIsFocused && 'input-focused',
            )}
          />
        )}
        {label && useLabelInside && (
          <label
            className={cn(
              styles[`form-label-inside${inputState || value || watchedValue ? '-active' : ''}`],
              handleIsFocused || inputState || value || !!watchedValue
                ? 'text-gray-500'
                : 'text-gray-400',
            )}
          >
            <span className="text-nowrap">{label}</span>
            {required && (handleIsFocused || inputState || value || !!watchedValue) && (
              <span className="text-danger-500">*</span>
            )}
          </label>
        )}
        {icon &&
          iconPosition &&
          (iconType === 'string' || (iconType === 'image' && typeof icon !== 'string')) && (
            <span
              className={cn(
                iconClassName,
                'absolute top-[50%] translate-y-[-50%]',
                iconPosition === 'right' ? 'right-4' : 'left-4',
                iconPosition === 'left' && 'pr-2',
                readonly && !iconOnClick ? 'cursor-not-allowed!' : '',
              )}
              onClick={iconOnClick}
            >
              {icon}
            </span>
          )}

        {icon && iconType === 'image' && typeof icon === 'string' && (
          <span
            className={cn(
              'absolute top-[50%] translate-y-[-50%] overflow-hidden',
              iconPosition === 'right' ? 'right-4' : 'left-4',
              iconClassName,
            )}
          >
            <Image
              src={icon}
              alt="icon"
              width={iconWidth || 20}
              height={iconHeight || 20}
              className="object-contain"
            />
          </span>
        )}
      </span>

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

      {errorMessage ? (
        <p className="flex items-center gap-1 text-danger-500 text-sm mt-1">
          <AlertTriangle className="size-4 min-h-4 min-w-4 text-danger-500" />
          {errorMessage}
        </p>
      ) : (
        helperText && <p className="text-[10px] text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};
