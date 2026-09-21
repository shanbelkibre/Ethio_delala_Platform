'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Mail, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { authService } from '@/features/auth';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [devResetLink, setDevResetLink] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    setDevResetLink('');

    try {
      const res = await authService.forgotPassword(email) as {
        success?: boolean;
        message?: string;
        data?: { resetLink?: string };
        resetLink?: string;
        error?: { message?: string };
      };

      if (!res?.success) {
        setStatus('error');
        setMessage(res?.error?.message || res?.message || 'Failed to request password reset');
        return;
      }

      if (res?.data?.resetLink || res?.resetLink) {
        setDevResetLink(res?.data?.resetLink || res?.resetLink || '');
      }

      setStatus('success');
      setMessage(res?.message || 'Password reset link has been sent to your email.');
    } catch (err: unknown) {
      const errorObj = err as { error?: { message?: string }; message?: string };
      setStatus('error');
      setMessage(errorObj?.error?.message || errorObj?.message || 'Network error. Please check your connection and try again.');
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10">
        
        {/* Header Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-50 dark:ring-emerald-950/40">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
            {t('forgotPasswordTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('forgotPasswordSubtitle')}
          </p>
        </div>

        {/* Success Alert */}
        {status === 'success' ? (
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-sm flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">{t('checkInbox')}</p>
                <p>{message}</p>
              </div>
            </div>

            {devResetLink && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-left space-y-1.5">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">Development Mode Reset Link:</span>
                <a
                  href={devResetLink}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-mono break-all hover:underline block"
                >
                  {devResetLink}
                </a>
              </div>
            )}

            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t('didNotReceiveEmail')}
            </p>

            <div className="pt-2">
              <Link
                href="/auth/login"
                className="w-full py-3 px-4 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('returnToSignIn')}
              </Link>
            </div>
          </div>
        ) : (
          /* Reset Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-sm font-semibold text-rose-600 dark:text-rose-400">
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('registeredEmail')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
            >
              {status === 'loading' ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                t('btnSendResetLink')
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToSignIn')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
