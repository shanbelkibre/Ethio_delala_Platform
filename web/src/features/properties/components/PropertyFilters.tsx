'use client';

import { PropertyFilters as Filters } from '../property.types';

export interface PropertyFiltersBarProps {
  filters: Filters;
  onChange: (newFilters: Filters) => void;
}

export function PropertyFiltersBar({ filters, onChange }: PropertyFiltersBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...filters, listingType: undefined, page: 1 })}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            !filters.listingType
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...filters, listingType: 'RENT', page: 1 })}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            filters.listingType === 'RENT'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          For Rent
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...filters, listingType: 'SALE', page: 1 })}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            filters.listingType === 'SALE'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          For Sale
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search properties..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
        />
      </div>
    </div>
  );
}

export default PropertyFiltersBar;
