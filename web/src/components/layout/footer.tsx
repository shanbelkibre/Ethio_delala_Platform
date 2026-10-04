'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Home } from 'lucide-react';

export function Footer() {
  const tNav = useTranslations('nav');
  const tHome = useTranslations('home');
  const tRoles = useTranslations('roles');

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 py-12 px-4 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">{tNav('brandName')}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {tHome('footerTagline')}
          </p>
        </div>

        <div>
          <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link href="/properties" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{tNav('properties')}</Link></li>
            <li><Link href="/#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{tNav('about')}</Link></li>
            <li><Link href="/#services" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{tNav('services')}</Link></li>
            <li><Link href="/#contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{tNav('contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-3">Portals</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link href="/renter/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{tRoles('renter')} {tNav('dashboard')}</Link></li>
            <li><Link href="/owner/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{tRoles('owner')} {tNav('dashboard')}</Link></li>
            <li><Link href="/management/agent/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{tRoles('agent')} {tNav('dashboard')}</Link></li>
            <li><Link href="/management/admin/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{tRoles('admin')} {tNav('dashboard')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-3">Headquarters</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">Bole Medhaniallem, Addis Ababa, Ethiopia</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">support@ethiodelala.com</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">+251 911 000 000</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {tNav('brandName')}. All rights reserved.</p>
        <p>Built for the Ethiopian Real Estate Ecosystem</p>
      </div>
    </footer>
  );
}

export default Footer;
