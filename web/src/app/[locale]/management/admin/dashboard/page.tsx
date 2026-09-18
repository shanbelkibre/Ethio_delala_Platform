'use client';

import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  Users,
  Building2,
  ShieldCheck,
  CreditCard,
  FileEdit,
  BarChart3,
  Flag,
} from 'lucide-react';

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
            { label: t('usersManagement'), icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50', href: '/management/admin/users' },
            { label: t('propertiesManagement'), icon: Building2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50', href: '/management/admin/properties' },
            { label: t('verificationQueue'), icon: ShieldCheck, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50', href: '/management/admin/verification' },
            { label: t('paymentsManagement'), icon: CreditCard, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50', href: '/management/admin/payments' },
            { label: t('cmsManagement'), icon: FileEdit, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50', href: '/management/cms/dashboard' },
            { label: t('analytics'), icon: BarChart3, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50', href: '/management/admin/dashboard' },
            { label: t('reports'), icon: Flag, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/50', href: '/management/admin/dashboard' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
