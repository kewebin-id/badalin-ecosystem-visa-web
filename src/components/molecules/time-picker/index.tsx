'use client';

import { Clock } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import { InputText } from '../input/text';

export interface TimePickerProps {
  onChange: (date: Date) => void;
  value?: Date | string;
  label: string;
  required?: boolean;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const TimePicker: FC<TimePickerProps> = ({
  label,
  onChange,
  value,
  required,
  errorMessage,
  placeholder = '--:--',
  disabled,
  size = 'lg',
}) => {
  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const [time, setTime] = useState<string>(() => {
    if (value) {
      const date = typeof value === 'string' ? new Date(value) : value;
      if (!isNaN(date.getTime())) {
        return formatTime(date);
      }
    }
    return '';
  });

  useEffect(() => {
    if (value) {
      const date = typeof value === 'string' ? new Date(value) : value;
      if (!isNaN(date.getTime())) {
        setTime(formatTime(date));
      }
    }
  }, [value]);

  const handleIconClick = () => {
    if (!disabled && inputRef.current) {
      // Try to use showPicker() API (modern browsers)
      if (typeof inputRef.current.showPicker === 'function') {
        try {
          inputRef.current.showPicker();
        } catch {
          // Fallback if showPicker fails
          inputRef.current?.focus();
          inputRef.current?.click();
        }
      } else {
        // Fallback for older browsers
        inputRef.current.focus();
        inputRef.current.click();
      }
    }
  };

  const handleTimeChange = (timeValue: string) => {
    setTime(timeValue);
    const [hours, minutes] = timeValue.split(':');
    if (hours && minutes) {
      // Create a date with current date and selected time
      const date = value ? (typeof value === 'string' ? new Date(value) : value) : new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      date.setSeconds(0);
      date.setMilliseconds(0);
      onChange(date);
    }
  };

  return (
    <InputText
      type="time"
      value={time}
      label={label}
      required={required}
      setValue={handleTimeChange}
      placeholder={placeholder}
      icon={<Clock className="h-4 w-4 text-gray-400 cursor-pointer" />}
      iconType="string"
      iconPosition="right"
      iconOnClick={handleIconClick}
      iconClassName="cursor-pointer"
      disabled={disabled}
      errorMessage={errorMessage}
      size={size}
      inputRef={inputRef}
    />
  );
};
