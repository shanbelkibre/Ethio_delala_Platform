'use client';

import { useEffect, useState } from 'react';
import { notificationService } from '@/features/notifications';
import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';

export default function OwnerNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationService
      .getMyNotifications()
      .then((res) => {
        if (res.success && res.data) setNotifications(res.data.notifications || []);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Owner Notifications</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Alerts about your listings, verification status and requests</p>
          </div>
          <div className="flex items-center gap-4">
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" /> Mark all read
              </button>
            )}
            <Link
              href="/owner/dashboard"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 text-center py-20 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-500">
            <Bell className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-lg font-bold">No notifications yet.</p>
            <p className="text-sm text-slate-400 mt-1">You will receive alerts here when clients request or review listings.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition-all ${
                  n.isRead
                    ? 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-600'
                    : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-900 dark:text-slate-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-base">{n.title}</h4>
                  <span className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
