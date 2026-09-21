'use client';

import { usePathname, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/hooks/useAuthStore';
import {
  LayoutDashboard,
  User,
  Building2,
  FileText,
  Tag,
  Bell,
  MessageSquare,
  Users,
  ShieldCheck,
  CreditCard,
  FileEdit,
  ClipboardList,
  Flag,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  role?: 'RENTER' | 'OWNER' | 'AGENT' | 'ADMIN';
  className?: string;
}

export default function DashboardSidebar({ role: propRole, className }: DashboardSidebarProps) {
  const t = useTranslations('sidebar');
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  // Determine role with route-first precedence, then prop, then user store
  const role =
    propRole ||
    (pathname.includes('/management/admin')
      ? 'ADMIN'
      : pathname.includes('/management/agent')
      ? 'AGENT'
      : pathname.includes('/owner')
      ? 'OWNER'
      : pathname.includes('/renter')
      ? 'RENTER'
      : user?.roles?.includes('ADMIN')
      ? 'ADMIN'
      : user?.roles?.includes('AGENT')
      ? 'AGENT'
      : user?.roles?.includes('OWNER')
      ? 'OWNER'
      : 'RENTER');

  // Role-specific navigation mapping
  let navItems: Array<{
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
  }> = [];

  if (role === 'ADMIN') {
    navItems = [
      {
        label: t('dashboard'),
        href: '/management/admin/dashboard',
        icon: LayoutDashboard,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      },
      {
        label: t('userManagement'),
        href: '/management/admin/users',
        icon: Users,
        iconColor: 'text-blue-500 dark:text-blue-400',
      },
      {
        label: t('propertyListings'),
        href: '/management/admin/properties',
        icon: Building2,
        iconColor: 'text-emerald-500 dark:text-emerald-400',
      },
      {
        label: t('identityVerifications'),
        href: '/management/admin/verification',
        icon: ShieldCheck,
        iconColor: 'text-purple-500 dark:text-purple-400',
      },
      {
        label: t('paymentAudits'),
        href: '/management/admin/payments',
        icon: CreditCard,
        iconColor: 'text-amber-500 dark:text-amber-400',
      },
      {
        label: t('cmsContent'),
        href: '/management/cms/dashboard',
        icon: FileEdit,
        iconColor: 'text-indigo-500 dark:text-indigo-400',
      },
      {
        label: t('profileSettings'),
        href: '/renter/profile',
        icon: User,
        iconColor: 'text-slate-400 dark:text-slate-500',
      },
    ];
  } else if (role === 'AGENT') {
    navItems = [
      {
        label: t('dashboard'),
        href: '/management/agent/dashboard',
        icon: LayoutDashboard,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      },
      {
        label: t('assignedProperties'),
        href: '/management/agent/properties',
        icon: Building2,
        iconColor: 'text-emerald-500 dark:text-emerald-400',
      },
      {
        label: t('clientRequests'),
        href: '/management/agent/requests',
        icon: ClipboardList,
        iconColor: 'text-blue-500 dark:text-blue-400',
      },
      {
        label: t('regionalUsers'),
        href: '/management/agent/users',
        icon: Users,
        iconColor: 'text-indigo-500 dark:text-indigo-400',
      },
      {
        label: t('inspectionReports'),
        href: '/management/agent/reports',
        icon: Flag,
        iconColor: 'text-rose-500 dark:text-rose-400',
      },
      {
        label: t('agentProfile'),
        href: '/management/agent/profile',
        icon: UserCheck,
        iconColor: 'text-amber-500 dark:text-amber-400',
      },
    ];
  } else if (role === 'OWNER') {
    navItems = [
      {
        label: t('dashboard'),
        href: '/owner/dashboard',
        icon: LayoutDashboard,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      },
      {
        label: t('profileSettings'),
        href: '/owner/profile',
        icon: User,
        iconColor: 'text-slate-400 dark:text-slate-500',
      },
      {
        label: t('myProperties'),
        href: '/owner/properties',
        icon: Building2,
        iconColor: 'text-emerald-500 dark:text-emerald-400',
      },
      {
        label: t('rentalRequests'),
        href: '/owner/rental-requests',
        icon: FileText,
        iconColor: 'text-indigo-500 dark:text-indigo-400',
      },
      {
        label: t('saleRequests'),
        href: '/owner/sale-requests',
        icon: Tag,
        iconColor: 'text-blue-500 dark:text-blue-400',
      },
      {
        label: t('notifications'),
        href: '/owner/notifications',
        icon: Bell,
        iconColor: 'text-amber-500 dark:text-amber-400',
      },
      {
        label: t('messages'),
        href: '/owner/messages',
        icon: MessageSquare,
        iconColor: 'text-emerald-500 dark:text-emerald-400',
      },
    ];
  } else {
    // RENTER
    navItems = [
      {
        label: t('dashboard'),
        href: '/renter/dashboard',
        icon: LayoutDashboard,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      },
      {
        label: t('profileSettings'),
        href: '/renter/profile',
        icon: User,
        iconColor: 'text-slate-400 dark:text-slate-500',
      },
      {
        label: t('savedProperties'),
        href: '/renter/favorites',
        icon: Building2,
        iconColor: 'text-emerald-500 dark:text-emerald-400',
      },
      {
        label: t('rentalRequests'),
        href: '/renter/rental-requests',
        icon: FileText,
        iconColor: 'text-indigo-500 dark:text-indigo-400',
      },
      {
        label: t('saleRequests'),
        href: '/renter/sale-requests',
        icon: Tag,
        iconColor: 'text-blue-500 dark:text-blue-400',
      },
      {
        label: t('notifications'),
        href: '/renter/notifications',
        icon: Bell,
        iconColor: 'text-amber-500 dark:text-amber-400',
      },
      {
        label: t('messages'),
        href: '/renter/messages',
        icon: MessageSquare,
        iconColor: 'text-emerald-500 dark:text-emerald-400',
      },
    ];
  }

  return (
    <aside
      className={cn(
        'w-full lg:w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-4 lg:min-h-[calc(100vh-4rem)]',
        className
      )}
    >
      <nav className="space-y-1.5" aria-label="Dashboard Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) &&
              item.href !== '/renter/dashboard' &&
              item.href !== '/owner/dashboard' &&
              item.href !== '/management/admin/dashboard' &&
              item.href !== '/management/agent/dashboard');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', item.iconColor)} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
