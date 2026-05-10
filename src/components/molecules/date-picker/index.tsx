'use client';

import { Calendar } from '@/components/atoms';
import { cn, dateUtil } from '@/shared/utils';
import { CalendarFold, X } from 'lucide-react';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { DialogDrawer } from '../dialog-drawer';
import { InputSelect } from '../input/select';
import { InputText } from '../input/text';

export interface DatePickerProps {
  minDate?: string;
  maxDate?: string;
  onChange: (date: Date | string) => void;
  value?: Date | string;
  label: string;
  required?: boolean;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isTouched?: boolean;
  useLabelInside?: boolean;
  isAutoDetected?: boolean;
  confidence?: number;
  isReadingOcr?: boolean;
  showTime?: boolean;
}

export const DatePicker: FC<DatePickerProps> = ({
  label,
  onChange,
  minDate,
  maxDate,
  value,
  required,
  errorMessage,
  placeholder = 'dd/mm/yyyy',
  disabled,
  size = 'lg',
  isTouched,
  useLabelInside = false,
  isAutoDetected,
  confidence,
  isReadingOcr,
  showTime = false,
}: DatePickerProps) => {
  const [date, setDate] = useState<Date | null>(() => {
    if (value) {
      const parsedDate = dateUtil(value).toDate();
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return null;
  });

  const [hours, setHours] = useState<string>(() => {
    if (value) {
      const d = dateUtil(value);
      return String(d.hour()).padStart(2, '0');
    }
    return '00';
  });

  const [minutes, setMinutes] = useState<string>(() => {
    if (value) {
      const d = dateUtil(value);
      return String(d.minute()).padStart(2, '0');
    }
    return '00';
  });

  const [opened, setOpened] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      const d = dateUtil(value);
      if (d.isValid()) {
        const newDate = d.toDate();
        setDate(newDate);
        setHours(String(d.hour()).padStart(2, '0'));
        setMinutes(String(d.minute()).padStart(2, '0'));
      }
    } else {
      setDate(null);
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const d = dateUtil(selectedDate)
        .hour(parseInt(hours))
        .minute(parseInt(minutes))
        .second(0)
        .millisecond(0);
      
      setDate(d.toDate());
      onChange(d.format());
      if (!showTime) {
        setOpened(false);
      }
    }
  };

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    setHours(newHours);
    setMinutes(newMinutes);
    if (date) {
      const d = dateUtil(date)
        .hour(parseInt(newHours))
        .minute(parseInt(newMinutes))
        .second(0)
        .millisecond(0);
      onChange(d.format());
    }
  };

  const handleClear = () => {
    setDate(null);
    setHours('00');
    setMinutes('00');
    onChange('');
  };

  const hourOptions = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        label: String(i).padStart(2, '0'),
        value: String(i).padStart(2, '0'),
      })),
    [],
  );

  const minuteOptions = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        label: String(i).padStart(2, '0'),
        value: String(i).padStart(2, '0'),
      })),
    [],
  );

  return (
    <React.Fragment>
      <div
        className={cn(
          'relative w-full group/datepicker',
          label && !useLabelInside && 'flex flex-col gap-2',
        )}
      >
        {label && !useLabelInside && (
          <label>
            {label} {required && <span className="text-danger-500">*</span>}
          </label>
        )}
        <InputText
          readonly
          type="text"
          label={label}
          required={required}
          value={date ? dateUtil(date).format(showTime ? 'DD MMMM YYYY HH:mm' : 'DD MMMM YYYY') : ''}
          placeholder={placeholder}
          onFocus={() => !disabled && setOpened(true)}
          icon={
            <div className="flex items-center gap-2">
              {date && (
                <X
                  className="size-4 text-gray-400 hover:text-danger-500 opacity-0 group-hover/datepicker:opacity-100 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                />
              )}
              <CalendarFold className="size-4 text-gray-400 cursor-pointer" />
            </div>
          }
          iconType="string"
          iconPosition="right"
          disabled={disabled}
          isTouched={isTouched}
          errorMessage={errorMessage}
          size={size}
          useLabelInside={useLabelInside}
          isFocused={opened}
          isAutoDetected={isAutoDetected}
          confidence={confidence}
          isReadingOcr={isReadingOcr}
          className="cursor-pointer"
        />
      </div>
      <DialogDrawer open={opened} setOpen={setOpened}>
        <div className="flex flex-col gap-6">
          <Calendar
            disabled={[
              ...(minDate ? [{ before: new Date(minDate) }] : []),
              ...(maxDate ? [{ after: new Date(maxDate) }] : []),
            ]}
            mode="single"
            selected={date || undefined}
            captionLayout="dropdown"
            fromYear={minDate ? new Date(minDate).getFullYear() : 1900}
            toYear={maxDate ? new Date(maxDate).getFullYear() : 2100}
            className="bg-transparent! w-full"
            onSelect={handleDateSelect}
          />

          {showTime && (
            <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-default">
                Select Time
              </p>
              <div className="flex items-center gap-4">
                <InputSelect
                  size="md"
                  label="Hour"
                  value={hours}
                  setValue={(val) => handleTimeChange(val, minutes)}
                  options={hourOptions}
                  className="flex-1"
                />
                <div className="text-2xl font-black text-gray-300 self-end mb-2.5">:</div>
                <InputSelect
                  size="md"
                  label="Minute"
                  value={minutes}
                  setValue={(val) => handleTimeChange(hours, val)}
                  options={minuteOptions}
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>
      </DialogDrawer>
    </React.Fragment>
  );
};
