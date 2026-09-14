'use client';

import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">{t('title')}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
          {t('intro1')}
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {t('intro2')}
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {[
            { title: t('missionTitle'), desc: t('missionDesc') },
            { title: t('visionTitle'), desc: t('visionDesc') },
            { title: t('forOwnersTitle'), desc: t('forOwnersDesc') },
            { title: t('forRentersTitle'), desc: t('forRentersDesc') },
          ].map((item) => (
            <div key={item.title} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
