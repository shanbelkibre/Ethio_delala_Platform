'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Building2 } from 'lucide-react';
import { propertyService, type Property } from '@/features/properties';

export default function OwnerPropertiesPage() {
  const t = useTranslations('owner');
  const tCommon = useTranslations('common');
  const tProp = useTranslations('property');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyService.getMyProperties()
      .then((res: unknown) => {
        const data = res as { success?: boolean; data?: { properties?: Property[] } };
        if (data?.success && data?.data) setProperties(data.data.properties || []);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('myProperties')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('manageAndAudit')}</p>
          </div>
          <Link href="/owner/properties/create"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            {t('postProperty')}
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 text-center py-20 rounded-2xl border border-slate-150 dark:border-slate-800">
            <div className="flex justify-center mb-4 text-emerald-500">
              <Building2 className="w-12 h-12 stroke-[1.5]" />
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('noProperties')}</p>
            <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">{t('createListingHint')}</p>
            <Link href="/owner/properties/create"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              {t('listYourFirstHouse')}
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">{tProp('propertyType')}</th>
                  <th className="px-6 py-4">{tCommon('status')}</th>
                  <th className="px-6 py-4">{tProp('totalPrice')}</th>
                  <th className="px-6 py-4">{tProp('location')}</th>
                  <th className="px-6 py-4">{tCommon('status')}</th>
                  <th className="px-6 py-4">{tCommon('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-150">{p.title}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{p.propertyType} ({p.listingType})</td>
                    <td className="px-6 py-4 font-semibold text-emerald-700 dark:text-emerald-400">ETB {p.price?.toLocaleString()}</td>
                    <td className="px-6 py-4">{p.city}, {p.areaName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                        p.status === 'APPROVED' || p.status === 'PUBLISHED' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' 
                          : p.status === 'PENDING_REVIEW' 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-450'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/public/properties/${p.id}`} className="text-emerald-600 hover:underline font-bold">
                        {tCommon('viewDetails')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
