'use client';

import { useEffect, useState } from 'react';
import { adminService, type AdminIdentityDoc } from '@/features/admin';
import { ShieldCheck, ShieldAlert, ShieldX, Clock, RefreshCw, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusFilter = 'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    badgeCls: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    dotCls: 'bg-amber-500',
  },
  VERIFIED: {
    label: 'Verified',
    icon: ShieldCheck,
    badgeCls: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    dotCls: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'Rejected',
    icon: ShieldX,
    badgeCls: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    dotCls: 'bg-rose-500',
  },
} as const;

export default function AdminVerificationQueuePage() {
  const [allDocs, setAllDocs] = useState<AdminIdentityDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  useEffect(() => { fetchAllDocs(); }, []);

  async function fetchAllDocs() {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getAllVerifications() as { success?: boolean; data?: { identityDocuments?: AdminIdentityDoc[] } };
      if (res?.success && res.data) {
        setAllDocs(res.data.identityDocuments || []);
      }
    } catch {
      setError('Failed to load verification records.');
      setAllDocs([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(id: string, status: 'VERIFIED' | 'REJECTED') {
    setReviewingId(id);
    setError('');
    try {
      const res = await adminService.reviewVerification(id, 'identity', status) as { success?: boolean };
      if (res?.success) {
        // Optimistically update local state
        setAllDocs((prev) =>
          prev.map((doc) =>
            doc.id === id ? { ...doc, status, nationalIdVerified: status === 'VERIFIED' } : doc
          )
        );
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'error' in err
        ? (err as { error?: { message?: string } }).error?.message
        : 'Failed to update document status.';
      setError(msg || 'Failed to update document status.');
    } finally {
      setReviewingId(null);
    }
  }

  const filtered = allDocs.filter((doc) => {
    const matchesStatus = activeFilter === 'ALL' || doc.status === activeFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      doc.user?.name?.toLowerCase().includes(query) ||
      doc.documentNumber?.toLowerCase().includes(query) ||
      doc.documentType?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const counts = {
    ALL: allDocs.length,
    PENDING: allDocs.filter((d) => d.status === 'PENDING').length,
    VERIFIED: allDocs.filter((d) => d.status === 'VERIFIED').length,
    REJECTED: allDocs.filter((d) => d.status === 'REJECTED').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Identity Verification Queue</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Audit submitted Government Passports and National IDs (Fayda e-KYC). All users shown below.
            </p>
          </div>
          <button
            onClick={fetchAllDocs}
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as StatusFilter[]).map((filter) => {
            const cfg = filter === 'ALL' ? null : STATUS_CONFIG[filter];
            const Icon = filter === 'ALL' ? ShieldAlert : cfg!.icon;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'p-4 rounded-2xl border text-left transition-all cursor-pointer',
                  activeFilter === filter
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-950'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800'
                )}
              >
                <Icon className={cn('h-5 w-5 mb-2', activeFilter === filter ? 'text-white' : 'text-emerald-600')} />
                <p className={cn('text-2xl font-black', activeFilter !== filter && 'text-slate-900 dark:text-slate-100')}>
                  {counts[filter]}
                </p>
                <p className={cn('text-xs font-semibold capitalize', activeFilter !== filter && 'text-slate-500 dark:text-slate-400')}>
                  {filter === 'ALL' ? 'Total Users' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                </p>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, document type, or ID number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Documents List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <ShieldAlert className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {searchQuery ? 'No records match your search.' : 'No verification records found.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((doc) => {
                const statusKey = (doc.status as keyof typeof STATUS_CONFIG) in STATUS_CONFIG
                  ? (doc.status as keyof typeof STATUS_CONFIG)
                  : 'PENDING';
                const cfg = STATUS_CONFIG[statusKey];
                const userName = doc.user?.name || doc.user?.profile?.firstName
                  ? [doc.user?.profile?.firstName, doc.user?.profile?.lastName].filter(Boolean).join(' ') || doc.user?.name
                  : 'Unknown User';
                const avatarUrl = (doc.user as any)?.profile?.profileImageUrl || (doc.user as any)?.avatarUrl;

                return (
                  <div key={doc.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar */}
                    <div className="shrink-0">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={userName || 'User'}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
                          <User className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{userName}</p>
                        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border', cfg.badgeCls)}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dotCls)} />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {doc.documentType} · ID# {doc.documentNumber || '—'}
                      </p>
                      {doc.documentUrl && (
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline mt-1 inline-block font-semibold"
                        >
                          View Uploaded Document ↗
                        </a>
                      )}
                    </div>

                    {/* Actions — only for PENDING */}
                    {doc.status === 'PENDING' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleReview(doc.id, 'VERIFIED')}
                          disabled={reviewingId === doc.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {reviewingId === doc.id ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReview(doc.id, 'REJECTED')}
                          disabled={reviewingId === doc.id}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {reviewingId === doc.id ? '...' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
          Showing {filtered.length} of {allDocs.length} total verification records
        </p>
      </div>
    </div>
  );
}
