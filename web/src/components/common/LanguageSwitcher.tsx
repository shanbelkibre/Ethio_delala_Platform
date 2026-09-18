'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'button' | 'dropdown' | 'compact';
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (nextLocale: 'en' | 'am') => {
    if (nextLocale === locale) return;

    // Convert searchParams to a record
    const query: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      query[key] = value;
    });

    startTransition(() => {
      // router.replace smoothly preserves pathname and search parameters while changing locale
      router.replace(
        // @ts-ignore
        { pathname, query },
        { locale: nextLocale }
      );
    });
  };

  const toggleLanguage = () => {
    handleLanguageChange(locale === 'en' ? 'am' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border border-slate-200/80 dark:border-slate-800 disabled:opacity-50 cursor-pointer',
        className
      )}
      title={locale === 'en' ? 'ወደ አማርኛ ይቀይሩ (Switch to Amharic)' : 'Switch to English'}
      aria-label="Toggle language"
    >
      <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>{locale === 'en' ? 'EN / አማ' : 'አማ / EN'}</span>
    </button>
  );
}

export default LanguageSwitcher;
