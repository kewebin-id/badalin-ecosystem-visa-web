import { ReactNode } from 'react';

export interface IUsecaseResponse<T extends object | void | boolean> {
  code?: number;
  error?: Error;
  message?: string;
  data?: T;
}

export interface ISelectOption<T = string> {
  value: T;
  label: string;
  icon?: ReactNode;
}
