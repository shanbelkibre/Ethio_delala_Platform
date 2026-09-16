import * as React from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon,
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
      <div className="flex justify-center mb-4 text-slate-400 dark:text-slate-500">
        {icon || <Building2 className="w-12 h-12 stroke-[1.5]" />}
      </div>
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
