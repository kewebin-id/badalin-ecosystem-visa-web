'use client';

import { Checkbox as CheckboxPrimitive } from '@/components/atoms';
import React, { FC, ReactNode } from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  children?: ReactNode;
  setChecked: (data: boolean) => void;
  checked: boolean;
}

export const InputCheckbox: FC<CheckboxProps> = ({ id, children, checked, setChecked }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <CheckboxPrimitive id={id} checked={checked} onCheckedChange={setChecked} />
      {children && <label htmlFor={id}>{children}</label>}
    </div>
  );
};
