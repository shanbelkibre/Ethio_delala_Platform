'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { propertyService, type Property } from '@/features/properties';
import { PropertyCard } from '@/features/properties/components/PropertyCard';
import { LoadingSpinner, EmptyState } from '@/components/feedback';

export default function PropertiesPage() {
  const t = useTranslations('property');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyService
      .getPublicProperties({ page: 1, limit: 12 })
      .then((res: unknown) => {
        const data = res as { success?: boolean; data?: { properties?: Property[] } };
        if (data?.success && data?.data?.properties) setProperties(data.data.properties);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">{t('browseProperties')}</h1>
        {loading ? (
          <LoadingSpinner />
        ) : properties.length === 0 ? (
          <EmptyState
            title={t('noPropertiesAvailableYet')}
            description={t('checkBackSoon')}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
