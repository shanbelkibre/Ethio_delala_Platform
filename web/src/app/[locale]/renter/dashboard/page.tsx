'use client';

import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function RenterDashboardPage() {
  const t = useTranslations('renter');
  const tProp = useTranslations('property');
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth/login');
  }, [isAuthenticated, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('dashboardTitle')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('welcomeBack')}, {user.name}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: t('myFavorites'), value: '0', icon: '❤️', href: '/renter/favorites' },
            { label: t('myRentalRequests'), value: '0', icon: '📋', href: '/renter/rental-requests' },
            { label: t('mySaleRequests'), value: '0', icon: '💰', href: '/renter/purchase-requests' },
            { label: t('myMessages'), value: '0', icon: '💬', href: '/renter/messages' },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
              <p className="text-3xl mb-3">{item.icon}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{item.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.label}</p>
            </Link>
          ))}
        </div>
        <Link href="/public/properties"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors inline-block">
          {tProp('browseProperties')}
        </Link>
      </div>
    </div>
  );
}
