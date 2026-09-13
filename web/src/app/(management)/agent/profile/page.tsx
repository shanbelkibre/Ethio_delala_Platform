'use client';

import { useAuthStore } from '@/hooks/useAuthStore';
import Link from 'next/link';
import { User, Mail, Phone, ShieldCheck, MapPin } from 'lucide-react';

export default function AgentProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Agent Profile</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Regional representative profile & coverage</p>
          </div>
          <Link
            href="/agent/dashboard"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-150 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {user?.name?.[0] || 'A'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.name || 'Agent User'}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Regional Field Agent
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-semibold">Email Address</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{user?.email || '-'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-semibold">Phone Number</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{user?.phone || '+251 900 000 000'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-semibold">Jurisdiction Region</p>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Addis Ababa (Bole, Yeka)</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-semibold">Account Role</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">AGENT (Regional Officer)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
