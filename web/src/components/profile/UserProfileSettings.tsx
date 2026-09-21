'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { apiClient } from '@/services/api-client';
import { authService } from '@/features/auth';
import { useAuthStore } from '@/hooks/useAuthStore';
import {
  User,
  Lock,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  Eye,
  EyeOff,
  MapPin,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ETHIOPIAN_REGIONS = [
  'Addis Ababa',
  'Dire Dawa',
  'Oromia',
  'Amhara',
  'Sidama',
  'Tigray',
  'Somali',
  'Afar',
  'Benishangul-Gumuz',
  'Gambella',
  'Harari',
  'South West Ethiopia',
  'Central Ethiopia',
  'Southern Ethiopia',
];

interface UserProfileSettingsProps {
  role: 'RENTER' | 'OWNER' | 'AGENT' | 'ADMIN';
}

export default function UserProfileSettings({ role }: UserProfileSettingsProps) {
  const t = useTranslations('profile');
  const tAuth = useTranslations('auth');
  const tNav = useTranslations('nav');
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'password' ? 'password' : 'profile';
  const { user: authUser, setAuth } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'verification'>(initialTab);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Profile Form States
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [region, setRegion] = useState('Addis Ababa');
  const [zone, setZone] = useState('');
  const [wereda, setWereda] = useState('');
  const [kebele, setKebele] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);

  // Profile submission state
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Fetch current user data
  useEffect(() => {
    apiClient
      .get('/users/me')
      .then((res: any) => {
        if (res?.success && res?.data) {
          const u = res.data.user || res.data;
          setName(u.name || '');
          setEmail(u.email || '');
          setPhone(u.phone || '');
          setProfileImageUrl(u.profile?.profileImageUrl || u.avatarUrl || '');
          setIsIdentityVerified(Boolean(u.isIdentityVerified || u.identityVerification?.nationalIdVerified));

          if (u.profile) {
            setFirstName(u.profile.firstName || '');
            setMiddleName(u.profile.middleName || '');
            setLastName(u.profile.lastName || '');
            setGender(u.profile.gender || '');
            setDateOfBirth(u.profile.dateOfBirth ? u.profile.dateOfBirth.slice(0, 10) : '');
            setMaritalStatus(u.profile.maritalStatus || '');
            setRegion(u.profile.region || 'Addis Ababa');
            setZone(u.profile.zone || '');
            setWereda(u.profile.wereda || '');
            setKebele(u.profile.kebele || '');
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load user profile:', err);
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, []);

  // Handle Profile Update
  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const payload: Record<string, any> = {
        firstName: firstName.trim() || undefined,
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth || undefined,
        maritalStatus: maritalStatus || undefined,
        region: region || undefined,
        zone: zone.trim() || undefined,
        wereda: wereda.trim() || undefined,
        kebele: kebele.trim() || undefined,
        profileImageUrl: profileImageUrl.trim() || undefined,
      };

      const res = (await apiClient.patch('/users/me', payload)) as any;
      if (!res?.success) {
        setProfileError(res?.error?.message || res?.message || 'Failed to update profile');
        return;
      }

      setProfileSuccess(t('profileUpdated'));

      // Update auth store user if available
      if (authUser) {
        const updatedName = [firstName, middleName, lastName].filter(Boolean).join(' ') || name;
        setAuth(
          {
            ...authUser,
            name: updatedName,
            phone,
          },
          useAuthStore.getState().accessToken || '',
          useAuthStore.getState().refreshToken || ''
        );
      }
    } catch (err: any) {
      setProfileError(err?.error?.message || err?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  }

  // Handle Password Update
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordSuccess('');
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError(t('passwordRequired'));
      setPasswordSaving(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError(t('passwordMismatch'));
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await authService.changePassword({ currentPassword, newPassword });
      if (!res?.success) {
        setPasswordError(res?.error?.message || res?.message || 'Failed to update password');
        return;
      }

      setPasswordSuccess(t('passwordUpdated'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordError(err?.error?.message || err?.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="flex min-h-[50vh] justify-center items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          {t('title')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={cn(
            'flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap',
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          )}
        >
          <User className="h-4 w-4" />
          <span>{t('tabProfile')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={cn(
            'flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap',
            activeTab === 'password'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          )}
        >
          <KeyRound className="h-4 w-4" />
          <span>{t('tabPassword')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verification')}
          className={cn(
            'flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap',
            activeTab === 'verification'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{t('tabVerification')}</span>
        </button>
      </div>

      {/* TAB 1: PROFILE INFORMATION */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {profileSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-sm font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {/* Personal Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-600" />
              <span>{t('personalInfo')}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('firstNamePlaceholder')}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('middleNamePlaceholder')}
                </label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('lastNamePlaceholder')}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('emailLabel')}
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('phoneLabel')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('genderLabel')}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">{tAuth('selectGender')}</option>
                  <option value="MALE">{tAuth('male')}</option>
                  <option value="FEMALE">{tAuth('female')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('dateOfBirthLabel')}
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('maritalStatusLabel')}
                </label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">{tAuth('selectStatus')}</option>
                  <option value="SINGLE">{tAuth('single')}</option>
                  <option value="MARRIED">{tAuth('married')}</option>
                  <option value="DIVORCED">{tAuth('divorced')}</option>
                  <option value="WIDOWED">{tAuth('widowed')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Hierarchy Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span>{t('locationInfo')}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('regionLabel')}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {ETHIOPIAN_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('zoneLabel')}
                </label>
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('weredaLabel')}
                </label>
                <input
                  type="text"
                  value={wereda}
                  onChange={(e) => setWereda(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tAuth('kebeleLabel')}
                </label>
                <input
                  type="text"
                  value={kebele}
                  onChange={(e) => setKebele(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 text-sm"
          >
            <Save className="h-4 w-4" />
            <span>{profileSaving ? t('updating') : t('saveProfile')}</span>
          </button>
        </form>
      )}

      {/* TAB 2: CHANGE PASSWORD */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl">
          {passwordSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-sm font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-600" />
              <span>{t('security')}</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('currentPassword')}
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('newPassword')}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('confirmNewPassword')}
              </label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 text-sm"
          >
            <KeyRound className="h-4 w-4" />
            <span>{passwordSaving ? t('updating') : t('updatePassword')}</span>
          </button>
        </form>
      )}

      {/* TAB 3: VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="space-y-4 max-w-xl">
          {isIdentityVerified ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/40 p-6 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400 text-base">
                  {tNav('faydaVerified')}
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-0.5">
                  Your Ethiopian National ID (Fayda) has been verified.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-150 dark:border-amber-900/40 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-800 dark:text-amber-400 text-base">
                    {tNav('verifyId')}
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
                    Verify your Fayda National ID to boost your trust score.
                  </p>
                </div>
              </div>
              <Link
                href="/owner/verification"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs text-center shrink-0"
              >
                {tNav('verifyId')}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
