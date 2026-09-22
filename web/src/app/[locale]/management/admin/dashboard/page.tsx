'use client';

import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect, useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { adminService, type AdminStats } from '@/features/admin';
import {
  Users,
  Building2,
  ShieldCheck,
  CreditCard,
  FileEdit,
  BarChart3,
  Flag,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface DashboardMetrics extends AdminStats {
  totalOwners?: number;
  pendingProperties?: number;
}

export default function AdminDashboardPage() {
  const t = useTranslations('admin');
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return; // Wait until Zustand finishes loading from localStorage

    if (!isAuthenticated || !user?.roles?.includes('ADMIN')) {
      router.push('/auth/login');
      return;
    }

    adminService
      .getStats()
      .then((res: any) => {
        if (res?.success && res.data) {
          setStats(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch admin stats:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [hasHydrated, isAuthenticated, user, router]);

  if (!hasHydrated || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const cards = [
    {
      label: t('usersManagement'),
      desc: 'Directory of tenants, landlords, and agents',
      icon: Users,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50',
      href: '/management/admin/users',
      value: stats ? `${stats.totalUsers} Users` : '...',
      badge: stats?.totalOwners ? `${stats.totalOwners} Owners` : undefined,
    },
    {
      label: t('propertiesManagement'),
      desc: 'Verify, audit, and manage all property listings',
      icon: Building2,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50',
      href: '/management/admin/properties',
      value: stats ? `${stats.totalProperties} Properties` : '...',
      badge: stats?.pendingProperties ? `${stats.pendingProperties} Pending` : undefined,
    },
    {
      label: t('manageSubscriptions'),
      desc: 'Configure owner tiers, ETB pricing & listing limits',
      icon: CreditCard,
      color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/50',
      href: '/management/admin/subscriptions',
      value: stats ? `${stats.activeSubscriptions ?? 0} Active` : '...',
      badge: 'Tier Config',
    },
    {
      label: t('verificationQueue'),
      desc: 'Audit National IDs, Passports & Fayda e-KYC',
      icon: ShieldCheck,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50',
      href: '/management/admin/verification',
      value: stats ? `${stats.pendingVerifications} Pending` : '...',
      badge: stats?.pendingVerifications ? 'Action Required' : 'Up to Date',
      badgeColor: stats?.pendingVerifications
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    },
    {
      label: t('paymentsManagement'),
      desc: 'Chapa transaction logs and subscription payments',
      icon: CreditCard,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50',
      href: '/management/admin/payments',
      value: 'Transaction Log',
      badge: 'Chapa Live',
    },
    {
      label: t('cmsManagement'),
      desc: 'Hero banners, navigation, and landing page content',
      icon: FileEdit,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50',
      href: '/management/cms/dashboard',
      value: 'Content Editor',
      badge: 'Live',
    },
    {
      label: t('analytics'),
      desc: 'Platform growth, rental metrics & activity trends',
      icon: BarChart3,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50',
      href: '/management/admin/dashboard',
      value: 'Active',
    },
    {
      label: t('reports'),
      desc: 'System event logs, audit records & security history',
      icon: Flag,
      color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/50',
      href: '/management/admin/dashboard',
      value: 'Audit Trail',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-bold px-2.5 py-0.5 rounded-full text-xs">
                Platform Admin
              </span>
              <span className="flex items-center gap-1 text-slate-500 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Live Control Center
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {t('dashboardTitle')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {t('dashboardSubtitle')} — {user.name}
            </p>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.badgeColor ||
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    {loading ? (
                      <span className="inline-block w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    ) : (
                      item.value
                    )}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <span>Open Operation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
