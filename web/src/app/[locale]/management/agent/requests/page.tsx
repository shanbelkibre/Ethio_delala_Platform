'use client';

import { useEffect, useState } from 'react';
import { agentService, type AgentRequest } from '@/features/agent';
import { Link } from '@/i18n/routing';
import { ClipboardList } from 'lucide-react';

export default function AgentRequestsPage() {
  const [requests, setRequests] = useState<AgentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentService
      .getRegionalRequests()
      .then((res: { success?: boolean; data?: { requests?: AgentRequest[] } }) => {
        if (res?.success && res.data) setRequests(res.data.requests || []);
      })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Regional Requests</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Rental and sale requests awaiting broker/agent assistance</p>
          </div>
          <Link
            href="/agent/dashboard"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 text-center py-20 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-500">
            <div className="flex justify-center mb-4 text-emerald-500">
              <ClipboardList className="w-12 h-12 stroke-[1.5]" />
            </div>
            <p className="text-lg font-bold">No active requests in your region.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{r.property?.title || r.propertyId}</td>
                    <td className="px-6 py-4">{r.renter?.name || r.buyer?.name || 'User'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</td>
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
