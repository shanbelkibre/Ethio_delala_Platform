'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Building2 } from 'lucide-react';
import { Property } from '../property.types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property: p }: PropertyCardProps) {
  const t = useTranslations('property');
  const primaryImage = p.images?.find((img) => img.isPrimary)?.url || p.images?.[0]?.url;

  return (
    <Link
      href={`/properties/${p.id}`}
      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 transition-shadow flex flex-col"
    >
      <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40 h-48 flex items-center justify-center relative overflow-hidden">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={primaryImage} alt={p.title} className="w-full h-full object-cover" />
        ) : (
          <Building2 className="w-12 h-12 text-emerald-600/50 dark:text-emerald-400/40" />
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1 line-clamp-1">{p.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2">{p.description}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/60">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">ETB {p.price?.toLocaleString()}</span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              p.listingType === 'RENT'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
            }`}
          >
            {p.listingType === 'RENT' ? t('forRent') : t('forSale')}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
