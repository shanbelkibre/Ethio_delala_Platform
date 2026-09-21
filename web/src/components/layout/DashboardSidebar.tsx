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

  const role =
    propRole ||
    (user?.roles?.includes('ADMIN')
      ? 'ADMIN'
      : user?.roles?.includes('AGENT')
      ? 'AGENT'
      : user?.roles?.includes('OWNER')
      ? 'OWNER'
      : 'RENTER');

  // Role-specific navigation mapping
  const navItems = [
    {
      label: t('dashboard'),
      href:
        role === 'OWNER'
          ? '/owner/dashboard'
          : role === 'AGENT'
          ? '/management/agent/dashboard'
          : role === 'ADMIN'
          ? '/management/admin/dashboard'
          : '/renter/dashboard',
      icon: LayoutDashboard,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: t('profileSettings'),
      href: role === 'OWNER' ? '/owner/profile' : '/renter/profile',
      icon: User,
      iconColor: 'text-slate-400 dark:text-slate-500',
    },
    {
      label: role === 'RENTER' ? t('savedProperties') : t('myProperties'),
      href:
        role === 'OWNER'
          ? '/owner/properties'
          : role === 'AGENT'
          ? '/management/agent/dashboard'
          : role === 'ADMIN'
          ? '/management/admin/dashboard'
          : '/renter/favorites',
      icon: Building2,
      iconColor: 'text-emerald-500',
    },
    {
      label: t('rentalRequests'),
      href: role === 'OWNER' ? '/owner/rental-requests' : '/renter/rental-requests',
      icon: FileText,
      iconColor: 'text-indigo-500',
    },
    {
      label: t('saleRequests'),
      href: role === 'OWNER' ? '/owner/sale-requests' : '/renter/sale-requests',
      icon: Tag,
      iconColor: 'text-blue-500',
    },
    {
      label: t('notifications'),
      href: role === 'OWNER' ? '/owner/notifications' : '/renter/notifications',
      icon: Bell,
      iconColor: 'text-amber-500',
    },
    {
      label: t('messages'),
      href: role === 'OWNER' ? '/owner/messages' : '/renter/messages',
      icon: MessageSquare,
      iconColor: 'text-emerald-500',
    },
  ];

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
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/renter/dashboard' && item.href !== '/owner/dashboard');

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
