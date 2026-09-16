'use client';

import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

import { Heart, ClipboardList, Banknote, MessageSquare } from 'lucide-react';

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
            { label: t('myFavorites'), value: '0', icon: Heart, iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40', href: '/renter/favorites' },
            { label: t('myRentalRequests'), value: '0', icon: ClipboardList, iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40', href: '/renter/rental-requests' },
            { label: t('mySaleRequests'), value: '0', icon: Banknote, iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40', href: '/renter/purchase-requests' },
            { label: t('myMessages'), value: '0', icon: MessageSquare, iconColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40', href: '/renter/messages' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{item.value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{item.label}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <Link href="/public/properties"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors inline-block">
          {tProp('browseProperties')}
        </Link>
      </div>
    </div>
  );
}
