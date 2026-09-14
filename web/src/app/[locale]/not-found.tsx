'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-extrabold text-emerald-600 mb-4">404</p>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('notFoundTitle')}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">{t('notFoundSubtitle')}</p>
      <Link href="/" className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
        {t('goHome')}
      </Link>
    </div>
  );
}
