'use client';

import styles from '@/shared/styles/components/input.module.css';
import { cn } from '@/shared/utils';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { InputTextareaProps } from '../input';

export const InputTextarea = ({
  className,
  icon,
  iconClassName,
  iconOnClick,
  iconPosition,
  register,
  label,
  required,
  labelClassName,
  errorMessage,
  placeholder,
  name,
  value,
  setValue,
  disabled = false,
  iconType = 'image',
  iconHeight = 50,
  iconWidth = 50,
  useLabelInside = false,
  onBlur,
  onFocus,
  onEnter,
  size = 'lg',
}: InputTextareaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputState, setInputState] = useState<string>();

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const tempValue = e.target.value;
    return setValue && setValue(tempValue);
  };

  return (
    <div
      className={cn(labelClassName, 'w-full', label && !useLabelInside && 'flex flex-col gap-2')}
    >
      {label && !useLabelInside && (
        <label
          className={cn(useLabelInside && styles[`form-label-inside${value ? '-active' : ''}`])}
        >
          {label}
          {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      <span className="relative block">
        {label && useLabelInside && (
          <label
            className={cn(
              styles[`form-area-label-inside${isFocused || inputState || value ? '-active' : ''}`],
              isFocused || value || inputState
                ? 'text-gray-500 bg-white w-[91%]!'
                : 'text-gray-400',
            )}
          >
            <span>{label}</span>
            {required && (isFocused || value || inputState) && (
              <span className="text-danger-500">*</span>
            )}
          </label>
        )}
        {register && name ? (
          <textarea
            {...register(name, {
              onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
                setInputState(e.target.value);
                return e;
              },
            })}
            onBlur={() => {
              setIsFocused(false);
              if (onBlur) onBlur();
            }}
            onFocus={() => {
              setIsFocused(true);
              if (onFocus) onFocus();
            }}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === 'enter') {
                e.preventDefault();
                if (onEnter) onEnter();
              }
            }}
            placeholder={useLabelInside ? '' : placeholder}
            disabled={disabled}
            className={cn(
              'bg-white! text-black min-h-20 h-full top-2!',
              styles[size],
              className,
              disabled && 'cursor-not-allowed bg-gray-100! border-gray-200!',
              useLabelInside &&
                styles[
                  `form-area-input-inside${errorMessage ? 'error' : inputState ? '-active' : ''}`
                ],
              errorMessage
                ? styles[
                    `form-input${icon && iconPosition ? `-with-icon-${iconPosition}` : ''}-error`
                  ]
                : styles[`form-input${icon && iconPosition ? `-with-icon-${iconPosition}` : ''}`],
              isFocused && 'input-focused',
            )}
          />
        ) : (
          <textarea
            onBlur={() => {
              setIsFocused(false);
              if (onBlur) onBlur();
            }}
            onFocus={() => {
              setIsFocused(true);
              if (onFocus) onFocus();
            }}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() === 'enter') {
                e.preventDefault();
                if (onEnter) onEnter();
              }
            }}
            value={value || ''}
            onChange={onChange}
            placeholder={useLabelInside ? '' : placeholder}
            disabled={disabled}
            className={cn(
              'bg-white! text-black min-h-20 h-full',
              styles[size],
              className,
              disabled && 'cursor-not-allowed bg-gray-100! border-gray-200!',
              useLabelInside && styles[`form-input-inside${value ? '-active' : ''}`],
              errorMessage ? styles['form-input-error'] : styles['form-input'],
              icon &&
                iconPosition &&
                (errorMessage
                  ? styles[`form-input-with-icon-${iconPosition}-error`]
                  : styles[`form-input-with-icon-${iconPosition}`]),
              isFocused && 'input-focused',
            )}
          />
        )}
        {icon && iconPosition && iconType === 'image' && typeof icon === 'string' && (
          <span
            className={cn(
              'absolute top-[50%] translate-y-[-50%]',
              iconPosition === 'right' ? 'right-4' : 'left-4',
              disabled ? 'cursor-not-allowed!' : '',
            )}
          >
            <Image
              alt={`input-${name}`}
              src={icon}
              className={`${iconClassName} ${disabled ? 'cursor-not-allowed!' : ''}`}
              onClick={iconOnClick}
              height={iconHeight}
              width={iconWidth}
            />
          </span>
        )}
        {icon && iconPosition && iconType === 'string' && (
          <span
            className={cn(
              iconClassName,
              'absolute top-[50%] translate-y-[-50%]',
              iconPosition === 'right' ? 'right-4' : 'left-4',
              disabled ? 'cursor-not-allowed!' : '',
            )}
            onClick={iconOnClick}
          >
            {icon}
          </span>
        )}
      </span>
      {errorMessage && (
        <p className="flex items-center gap-1 text-danger-500 font-medium text-sm">
          <AlertTriangle className="size-4 min-h-4 min-w-4 text-danger-500" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};
