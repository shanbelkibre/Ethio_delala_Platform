'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { messageService } from '@/features/messaging';
import { Link } from '@/i18n/routing';
import { MessageSquare } from 'lucide-react';

export default function RenterMessagesPage() {
  const t = useTranslations('renter');
  const tProp = useTranslations('property');
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    messageService
      .getConversations()
      .then((res) => {
        if (res.success && res.data) setConversations(res.data.conversations || []);
      })
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('directInquiries')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{t('directInquiriesSubtitle')}</p>
          </div>
          <Link
            href="/renter/dashboard"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            ← {t('backToDashboard')}
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 text-center py-20 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-500">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-lg font-bold">{t('noActiveConversations')}</p>
            <p className="text-sm text-slate-400 mt-1">{t('conversationsHint')}</p>
            <Link
              href="/public/properties"
              className="mt-5 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              {tProp('browseProperties')}
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{conv.participantName || 'Owner'}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{conv.lastMessage || 'No message preview'}</p>
                </div>
                <span className="text-xs text-slate-400">{new Date(conv.lastMessageAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
