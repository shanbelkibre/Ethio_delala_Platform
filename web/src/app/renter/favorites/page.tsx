'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { favoriteService } from '@/features/favorites';
import { PropertyCard } from '@/features/properties/components/PropertyCard';
import { LoadingSpinner } from '@/components/feedback';

export default function RenterFavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoriteService
      .getMyFavorites()
      .then((res) => {
        if (res.success && res.data) {
          setFavorites(res.data.favorites || []);
        }
      })
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Saved Properties</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Properties you bookmarked for later review.</p>

        {loading ? (
          <LoadingSpinner />
        ) : favorites.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 text-center py-20 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-500">
            <p className="text-5xl mb-4">❤️</p>
            <p className="text-lg font-bold">No saved properties yet.</p>
            <Link
              href="/properties"
              className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav: any) => (
              <PropertyCard key={fav.id} property={fav.property || fav} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
