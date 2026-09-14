'use client';

import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">{t('title')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-10">{t('subtitle')}</p>
        <div className="space-y-6">
          {[
            { label: t('email'), value: t('supportEmail') },
            { label: t('phone'), value: t('supportPhone') },
            { label: t('address'), value: t('addressValue') },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-slate-900 dark:text-slate-100 font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
