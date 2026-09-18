'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Heart } from 'lucide-react';
import { favoriteService } from '@/features/favorites';
import { PropertyCard } from '@/features/properties/components/PropertyCard';
import { type Property } from '@/features/properties';
import { LoadingSpinner } from '@/components/feedback';

interface FavoriteItem {
  id: string;
  property?: Property;
}

export default function RenterFavoritesPage() {
  const t = useTranslations('renter');
  const tProp = useTranslations('property');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoriteService
      .getMyFavorites()
      .then((res: unknown) => {
        const data = res as { success?: boolean; data?: { favorites?: FavoriteItem[] } };
        if (data?.success && data?.data) {
          setFavorites(data.data.favorites || []);
        }
      })
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t('savedProperties')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">{t('savedPropertiesSubtitle')}</p>

        {loading ? (
          <LoadingSpinner />
        ) : favorites.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 text-center py-20 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-500">
            <div className="flex justify-center mb-4 text-rose-500">
              <Heart className="w-12 h-12 stroke-[1.5]" />
            </div>
            <p className="text-lg font-bold">{t('noSavedProperties')}</p>
            <Link
              href="/public/properties"
              className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              {tProp('browseProperties')}
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <PropertyCard key={fav.id} property={fav.property || (fav as unknown as Property)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
