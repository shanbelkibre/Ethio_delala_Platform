import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div
        className={cn(
          'animate-spin rounded-full border-emerald-600 border-t-transparent',
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}

export default LoadingSpinner;
