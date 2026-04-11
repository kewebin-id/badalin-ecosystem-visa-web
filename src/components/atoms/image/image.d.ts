export interface ImageCompProps {
  src: string | StaticImport;
  alt: string;
  height: number;
  width: number;
  placeholder?: string;
  onClick?: () => void;
  useBaseUrl?: boolean;
  className?: string;
  priority?: boolean;
  errorImage?: string;
  errorClassName?: string;
}
