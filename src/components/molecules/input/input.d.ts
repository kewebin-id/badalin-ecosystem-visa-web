import { ReactNode } from 'react';
import { UseFormRegister } from 'react-hook-form';

export interface InputProps {
  value?: string;
  setValue?: (data: string) => void;
  register?: UseFormRegister<any>; // eslint-disable-line
  name?: string;
  label?: string;
  labelClassName?: string;
  required?: boolean;
  className?: string;
  errorMessage?: string;
  isSubmitted?: boolean;
  isSubmitSuccessful?: boolean;
  isSubmitting?: boolean;
  isValidating?: boolean;
  isValid?: boolean;
  disabled?: boolean;
  isTouched?: boolean;
  isReadingOcr?: boolean;
}

export interface IInputTextType {
  type: 'text' | 'number' | 'password' | 'email' | 'price' | 'only-number' | 'time' | 'datetime-local' | 'date';
}

export interface InputTextProps extends IInputTextType {
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
  value?: string | number;
  setValue?: (data: string) => void;
  name?: string;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  required?: boolean;
  iconOnClick?: () => void;
  icon?: string | ReactNode;
  iconPosition?: 'right' | 'left';
  iconType?: 'string' | 'image';
  iconClassName?: string;
  iconHeight?: number;
  iconWidth?: number;
  className?: string;
  register?: UseFormRegister<any>; // eslint-disable-line
  errorMessage?: string;
  isSubmitted?: boolean;
  isSubmitSuccessful?: boolean;
  isSubmitting?: boolean;
  isValidating?: boolean;
  isValid?: boolean;
  disabled?: boolean;
  useLabelInside?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onEnter?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly?: boolean;
  maxLength?: number;
  autoComplete?: string;
  isTouched?: boolean;
  helperText?: string | ReactNode;
  isFocused?: boolean;
  isAutoDetected?: boolean;
  confidence?: number;
  isReadingOcr?: boolean;
}

export interface InputTextareaProps extends InputTextProps, Partial<IInputTextType> {
  type?: 'textarea';
  maxLength?: number;
  placeholder?: string;
  useLabelInside?: boolean;
  onEnter?: (value?: string) => void;
}

export interface InputTextSearchProps {
  useLabelInside?: boolean;
  search: string;
  setSearch: (value?: string, isChooseItem?: boolean) => void;
  placeholder?: string;
  className?: string;
  delayDebounce?: number;
  useSuggestion?: boolean;
  suggestionEmptyState?: ReactNode | string;
  children?: ReactNode;
  loadingSuggestion?: boolean;
  onEnter?: (value?: string) => void;
  autoHideAfterClickItem?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  suggestionLoadingState?: ReactNode | string;
}

export interface InputSelelctProps {
  placeholder?: string;
  useLabelInside?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  errorMessage?: string;
  disabled?: boolean;
  register?: UseFormRegister<any>; // eslint-disable-line
  className?: string;
  name?: string;
  value?: string;
  setValue?: (data: string) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  isLoading?: boolean;
  isTouched?: boolean;
  isAutoDetected?: boolean;
  confidence?: number;
  isReadingOcr?: boolean;
}
