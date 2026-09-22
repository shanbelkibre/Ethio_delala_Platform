'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/features/admin';
import { CreditCard, Search, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminPayment {
  id: string;
  amount?: number;
  currency?: string;
  status?: string;
  transactionRef?: string;
  paymentMethod?: string;
  user?: { name?: string; email?: string };
  createdAt?: string;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  SUCCESS: { label: 'Success', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' },
  COMPLETED: { label: 'Completed', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' },
  PENDING: { label: 'Pending', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' },
  FAILED: { label: 'Failed', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400' },
  REFUNDED: { label: 'Refunded', cls: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchPayments(); }, []);

  async function fetchPayments() {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getPayments() as any;
      if (res?.success) {
        const list: AdminPayment[] = Array.isArray(res.data)
          ? res.data
          : res.data?.payments || [];
        setPayments(list);
      } else {
        setError('Failed to load payment records.');
      }
    } catch {
      setError('Failed to load payment records.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.user?.name?.toLowerCase().includes(q) ||
      p.user?.email?.toLowerCase().includes(q) ||
      p.transactionRef?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q)
    );
  });

  const totalAmount = payments
    .filter((p) => p.status === 'SUCCESS' || p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const stats = [
    { label: 'Total Transactions', value: payments.length, icon: CreditCard, color: 'text-blue-600' },
    { label: 'Successful', value: payments.filter((p) => p.status === 'SUCCESS' || p.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'Pending', value: payments.filter((p) => p.status === 'PENDING').length, icon: Clock, color: 'text-amber-600' },
    { label: 'Failed', value: payments.filter((p) => p.status === 'FAILED').length, icon: XCircle, color: 'text-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">Payment Audits</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Chapa transaction logs and subscription payment history.
            </p>
          </div>
          <button
            onClick={fetchPayments}
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <Icon className={cn('h-5 w-5 mb-2', color)} />
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{value}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Total Revenue Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
          <p className="text-sm font-semibold text-emerald-100">Total Revenue (Successful Payments)</p>
          <p className="text-4xl font-black mt-1">ETB {totalAmount.toLocaleString()}</p>
          <p className="text-xs text-emerald-200 mt-1">Based on {payments.filter((p) => p.status === 'SUCCESS' || p.status === 'COMPLETED').length} completed transactions</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, email, or transaction reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Table / Empty State */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <CreditCard className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {search ? 'No transactions match your search.' : 'No payment records yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((p) => {
                    const statusCfg = STATUS_CONFIG[p.status || ''] || { label: p.status || '—', cls: 'bg-slate-100 text-slate-700' };
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{p.transactionRef || p.id?.slice(0, 16) + '...'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{p.user?.name || '—'}</p>
                          <p className="text-xs text-slate-400">{p.user?.email}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                          ETB {p.amount?.toLocaleString() || '—'}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                          {p.paymentMethod || 'Chapa'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold', statusCfg.cls)}>
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
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
          Showing {filtered.length} of {payments.length} transactions
        </p>
      </div>
    </div>
  );
}
