'use client';

import { useAuthStore } from '@/hooks/useAuthStore';
import { useEffect, useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Building2, Users, ClipboardList, Flag, UserCheck, MapPin } from 'lucide-react';
import { agentService, type AgentDashboardStats } from '@/features/agent';

export default function AgentDashboardPage() {
  const t = useTranslations('agent');
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<AgentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated || (!user?.roles?.includes('AGENT') && !user?.roles?.includes('ADMIN'))) {
      router.push('/auth/login');
      return;
    }
    agentService
      .getDashboardStats()
      .then((res: { success?: boolean; data?: AgentDashboardStats }) => {
        if (res?.success && res.data) setStats(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hasHydrated, isAuthenticated, user, router]);

  if (!hasHydrated || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full text-xs">
              Agent Portal
            </span>
            <span className="flex items-center gap-1 text-slate-500 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {t('jurisdiction')}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('dashboardTitle')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t('dashboardSubtitle')} — {user.name}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: t('assignedProperties'),
                desc: 'Review, verify & manage local listings',
                icon: <Building2 className="w-6 h-6 text-emerald-600" />,
                href: '/management/agent/properties',
                badge: stats?.totalProperties ? `${stats.totalProperties} listings` : undefined,
              },
              {
                label: t('clientRequests'),
                desc: 'Rental & purchase inquiries in your jurisdiction',
                icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
                href: '/management/agent/requests',
                badge: stats?.pendingRequests ? `${stats.pendingRequests} pending` : undefined,
              },
              {
                label: 'Regional Users',
                desc: 'Tenants and owners in your zone',
                icon: <Users className="w-6 h-6 text-indigo-600" />,
                href: '/management/agent/users',
              },
              {
                label: t('inspectionReports'),
                desc: 'Flagged listings and inspection reports',
                icon: <Flag className="w-6 h-6 text-rose-600" />,
                href: '/management/agent/reports',
              },
              {
                label: 'Agent Profile & Area',
                desc: 'Regional coverage settings and credentials',
                icon: <UserCheck className="w-6 h-6 text-amber-600" />,
                href: '/management/agent/profile',
              },
            ].map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-150 dark:border-slate-800 hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit mb-4 group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1">{card.label}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{card.desc}</p>
                </div>
                {card.badge && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                      {card.badge}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
