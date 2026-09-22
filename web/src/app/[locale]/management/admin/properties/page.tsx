'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/features/admin';
import { Building2, Search, RefreshCw, MapPin, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminProperty {
  id: string;
  title: string;
  propertyType?: string;
  listingType?: string;
  transactionType?: string;
  price?: number;
  status: string;
  city?: string;
  subcity?: string;
  owner?: { name?: string; email?: string };
  createdAt?: string;
}

type StatusFilter = 'ALL' | 'PENDING_REVIEW' | 'PUBLISHED' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  PUBLISHED: { label: 'Published', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400', icon: CheckCircle2 },
  APPROVED: { label: 'Approved', cls: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400', icon: CheckCircle2 },
  PENDING_REVIEW: { label: 'Pending Review', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400', icon: Clock },
  REJECTED: { label: 'Rejected', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400', icon: XCircle },
  ARCHIVED: { label: 'Archived', cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400', icon: AlertCircle },
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  useEffect(() => { fetchProperties(); }, []);

  async function fetchProperties() {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getProperties() as any;
      if (res?.success) {
        const list: AdminProperty[] = Array.isArray(res.data)
          ? res.data
          : res.data?.properties || [];
        setProperties(list);
      } else {
        setError('Failed to load properties.');
      }
    } catch {
      setError('Failed to load properties.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id: string, status: string) {
    setReviewingId(id);
    try {
      const res = await adminService.updatePropertyStatus(id, status) as any;
      if (res?.success) {
        setProperties((prev) =>
          prev.map((p) => p.id === id ? { ...p, status } : p)
        );
      }
    } catch {
      setError('Failed to update property status.');
    } finally {
      setReviewingId(null);
    }
  }

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.owner?.name?.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    ALL: properties.length,
    PENDING_REVIEW: properties.filter((p) => p.status === 'PENDING_REVIEW').length,
    PUBLISHED: properties.filter((p) => p.status === 'PUBLISHED').length,
    APPROVED: properties.filter((p) => p.status === 'APPROVED').length,
    REJECTED: properties.filter((p) => p.status === 'REJECTED').length,
    ARCHIVED: properties.filter((p) => p.status === 'ARCHIVED').length,
  };

  const statCards = [
    { key: 'ALL', label: 'All Properties', color: 'text-slate-600' },
    { key: 'PENDING_REVIEW', label: 'Pending Review', color: 'text-amber-600' },
    { key: 'PUBLISHED', label: 'Published', color: 'text-emerald-600' },
    { key: 'APPROVED', label: 'Approved', color: 'text-blue-600' },
    { key: 'REJECTED', label: 'Rejected', color: 'text-rose-600' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Manage Properties</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Verify, audit, and manage all property listings on the platform.
            </p>
          </div>
          <button
            onClick={fetchProperties}
            suppressHydrationWarning
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl font-semibold text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {statCards.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key as StatusFilter)}
              className={cn(
                'p-4 rounded-2xl border text-left transition-all cursor-pointer',
                statusFilter === key
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-950'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800'
              )}
            >
              <Building2 className={cn('h-4 w-4 mb-2', statusFilter === key ? 'text-white' : color)} />
              <p className={cn('text-2xl font-black', statusFilter !== key && 'text-slate-900 dark:text-slate-100')}>
                {counts[key]}
              </p>
              <p className={cn('text-xs font-semibold', statusFilter !== key && 'text-slate-500 dark:text-slate-400')}>
                {label}
              </p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, city, or owner name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Building2 className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {search ? 'No properties match your search.' : 'No properties found.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((p) => {
                    const statusCfg = STATUS_CONFIG[p.status] || STATUS_CONFIG['ARCHIVED'];
                    const StatusIcon = statusCfg.icon;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Property */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{p.title}</p>
                          {(p.city || p.subcity) && (
                            <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              {[p.subcity, p.city].filter(Boolean).join(', ')}
                            </p>
                          )}
                        </td>
                        {/* Type */}
                        <td className="px-6 py-4">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{p.propertyType}</p>
                          <p className="text-xs text-slate-400">{p.listingType || p.transactionType}</p>
                        </td>
                        {/* Price */}
                        <td className="px-6 py-4 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                          ETB {p.price?.toLocaleString() || '—'}
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold', statusCfg.cls)}>
                            <StatusIcon className="h-3 w-3" />
                            {statusCfg.label}
                          </span>
                        </td>
                        {/* Owner */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{p.owner?.name || '—'}</p>
                          <p className="text-xs text-slate-400">{p.owner?.email}</p>
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {p.status === 'PENDING_REVIEW' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(p.id, 'PUBLISHED')}
                                  disabled={reviewingId === p.id}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(p.id, 'REJECTED')}
                                  disabled={reviewingId === p.id}
                                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {p.status === 'PUBLISHED' && (
                              <button
                                onClick={() => handleStatusUpdate(p.id, 'ARCHIVED')}
                                disabled={reviewingId === p.id}
                                className="bg-slate-600 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Archive
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
          Showing {filtered.length} of {properties.length} properties
        </p>
      </div>
    </div>
  );
}
