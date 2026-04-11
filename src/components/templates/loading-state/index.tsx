import { cn } from '@/shared/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => (
  <div
    className={cn(
      'animate-spin rounded-full border-2 border-muted border-t-accent',
      size === 'sm' && 'h-4 w-4',
      size === 'md' && 'h-8 w-8',
      size === 'lg' && 'h-12 w-12',
      className,
    )}
  />
);

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => (
  <div className="flex flex-col items-center justify-center py-12">
    <LoadingSpinner size="lg" />
    <p className="mt-4 text-sm text-muted-foreground">{message}</p>
  </div>
);

export { LoadingSpinner, LoadingState };
