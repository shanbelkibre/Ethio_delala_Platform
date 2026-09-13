import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-350 flex items-center justify-between gap-3 text-sm',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-bold underline hover:no-underline text-red-800 dark:text-red-300"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
