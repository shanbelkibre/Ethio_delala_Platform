import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon = '🏠',
  title,
  description,
  actionText,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 text-center py-16 px-6 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-500 dark:text-slate-400',
        className
      )}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && <p className="mt-1 text-sm max-w-md mx-auto">{description}</p>}
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
