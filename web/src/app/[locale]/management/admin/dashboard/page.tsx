'use client';

import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user?.roles?.includes('ADMIN')) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('dashboardTitle')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('dashboardSubtitle')} — {user.name}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: t('usersManagement'), icon: '👥', href: '/management/admin/users' },
            { label: t('propertiesManagement'), icon: '🏠', href: '/management/admin/properties' },
            { label: t('verificationQueue'), icon: '🔍', href: '/management/admin/verification' },
            { label: t('paymentsManagement'), icon: '💳', href: '/management/admin/payments' },
            { label: t('cmsManagement'), icon: '📝', href: '/management/cms/dashboard' },
            { label: t('analytics'), icon: '📊', href: '/management/admin/dashboard' },
            { label: t('reports'), icon: '🚩', href: '/management/admin/dashboard' },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
              <p className="text-3xl mb-3">{item.icon}</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
