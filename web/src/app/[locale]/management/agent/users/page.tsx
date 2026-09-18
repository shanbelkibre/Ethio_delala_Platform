'use client';

import { useEffect, useState } from 'react';
import { agentService, type AgentUser } from '@/features/agent';
import { Link } from '@/i18n/routing';
import { Users } from 'lucide-react';

export default function AgentUsersPage() {
  const [users, setUsers] = useState<AgentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentService
      .getRegionalUsers()
      .then((res: { success?: boolean; data?: { users?: AgentUser[] } }) => {
        if (res?.success && res.data) setUsers(res.data.users || []);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Regional Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Directory of buyers, tenants, and owners active in your assigned region.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 text-center py-20 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-500">
            <div className="flex justify-center mb-4 text-emerald-500">
              <Users className="w-12 h-12 stroke-[1.5]" />
            </div>
            <p className="text-lg font-bold">No registered users in your region yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{u.phone || '-'}</td>
                    <td className="px-6 py-4 text-xs font-bold">{u.roles?.join(', ')}</td>
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
