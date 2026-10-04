'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import { authService, type AuthResponse } from '@/features/auth';
import { useAuthStore } from '@/hooks/useAuthStore';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

type SelectedRole = 'RENTER' | 'OWNER';

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

export default function RegisterPage() {
  const tAuth = useTranslations('auth');
  const tRoles = useTranslations('roles');
  const tValidation = useTranslations('validation');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated, setAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    if (isAuthenticated && user) {
      if (user.roles?.includes('ADMIN')) {
        router.replace('/management/admin/dashboard');
      } else if (user.roles?.includes('AGENT')) {
        router.replace('/management/agent/dashboard');
      } else if (user.roles?.includes('OWNER')) {
        router.replace('/owner/dashboard');
      } else {
        router.replace('/renter/dashboard');
      }
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  // Core required fields
  const [selectedRole, setSelectedRole] = useState<SelectedRole>('RENTER');
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile details
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [region, setRegion] = useState('Addis Ababa');
  const [zone, setZone] = useState('');
  const [wereda, setWereda] = useState('');
  const [kebele, setKebele] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Live password strength checks
  const hasMinLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[@$!%*&#^()_+={}[\]:;"'<>,.?/~`|\\-]/.test(password);
  const isPasswordStrong = hasMinLength && hasLower && hasUpper && hasNumber && hasSymbol;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // Handle image file selection
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(tValidation('maxFileSize'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveImage() {
    setProfileImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleGoogleSuccess(idToken: string) {
    setLoading(true);
    setError('');

    try {
      const res = (await authService.googleAuth({
        idToken,
        role: selectedRole,
      })) as {
        success?: boolean;
        data?: AuthResponse;
        error?: { message?: string };
        message?: string;
      };

      if (!res?.success || !res?.data) {
        setError(res?.error?.message || res?.message || 'Google registration failed');
        return;
      }

      const { user, tokens } = res.data;
      setAuth(user, tokens.accessToken, tokens.refreshToken);

      if (user.roles?.includes('ADMIN')) {
        router.push('/management/admin/dashboard');
      } else if (user.roles?.includes('AGENT')) {
        router.push('/management/agent/dashboard');
      } else if (user.roles?.includes('OWNER')) {
        router.push('/owner/dashboard');
      } else {
        router.push('/renter/dashboard');
      }
    } catch (err: unknown) {
      const errorObj = err as { error?: { message?: string }; message?: string };
      setError(errorObj?.error?.message || errorObj?.message || 'Google registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError(tValidation('firstNameRequired'));
      return;
    }
    if (registerMethod === 'email' && !email.trim()) {
      setError(tValidation('emailRequired'));
      return;
    }
    if (registerMethod === 'phone' && !phone.trim()) {
      setError(tValidation('phoneRequired'));
      return;
    }
    if (!isPasswordStrong) {
      setError(tValidation('passwordCriteria'));
      return;
    }
    if (password !== confirmPassword) {
      setError(tValidation('passwordMismatch'));
      return;
    }

    setLoading(true);

    const fullName = [firstName.trim(), middleName.trim(), lastName.trim()].filter(Boolean).join(' ');

    try {
      const res = await authService.register({
        firstName: firstName.trim(),
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        name: fullName,
        email: email.trim() ? email.trim().toLowerCase() : undefined,
        phone: phone.trim() ? phone.replace(/[\s\-\(\)]/g, '').trim() : undefined,
        password,
        roles: [selectedRole],
        gender: selectedRole === 'RENTER' ? gender || undefined : undefined,
        dateOfBirth: selectedRole === 'RENTER' ? dateOfBirth || undefined : undefined,
        maritalStatus: selectedRole === 'RENTER' ? maritalStatus || undefined : undefined,
        profileImageUrl: profileImageUrl.trim() || undefined,
        region: region || undefined,
        zone: zone.trim() || undefined,
        wereda: wereda.trim() || undefined,
        kebele: kebele.trim() || undefined,
      }) as { success?: boolean; data?: { user?: { email?: string; phone?: string } }; error?: { message?: string }; message?: string };

      if (!res?.success) {
        setError(res?.error?.message || res?.message || 'Registration failed');
        setLoading(false);
        return;
      }

      const target = registerMethod === 'email'
        ? (res?.data?.user?.email || email.trim().toLowerCase())
        : (res?.data?.user?.phone || phone.replace(/[\s\-\(\)]/g, '').trim());

      // Redirect to OTP verification page preserving locale prefix and method
      router.push(`/auth/verify?target=${encodeURIComponent(target)}&type=${registerMethod}`);
    } catch (err: unknown) {
      const errorObj = err as { error?: { message?: string }; message?: string };
      setError(errorObj?.error?.message || errorObj?.message || tValidation('required'));
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-sm font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {tAuth('registeringAs')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('RENTER')}
                className={`p-3.5 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                  selectedRole === 'RENTER'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span className="text-sm">{tRoles('renter')}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('OWNER')}
                className={`p-3.5 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                  selectedRole === 'OWNER'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span className="text-sm">{tRoles('owner')}</span>
              </button>
            </div>
          </div>

          {/* Name Fields (First, Middle, Last) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {tAuth('legalName')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder={tAuth('firstNamePlaceholder')}
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                />
              </div>

              <input
                type="text"
                placeholder={tAuth('middleNamePlaceholder')}
                autoComplete="additional-name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
              />

              <input
                type="text"
                placeholder={tAuth('lastNamePlaceholder')}
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Registration Method Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {tAuth('registerMethod')}
            </label>
            <div className="grid grid-cols-2 gap-3 mb-1">
              <button
                type="button"
                onClick={() => setRegisterMethod('email')}
                className={`p-2.5 rounded-xl border text-center font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  registerMethod === 'email'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{tAuth('registerWithEmail')}</span>
              </button>
              <button
                type="button"
                onClick={() => setRegisterMethod('phone')}
                className={`p-2.5 rounded-xl border text-center font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  registerMethod === 'phone'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{tAuth('registerWithPhone')}</span>
              </button>
            </div>
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>
                  {tAuth('emailLabel')}{' '}
                  {registerMethod === 'email' ? (
                    <span className="text-rose-500">*</span>
                  ) : (
                    <span className="text-xs font-normal text-slate-400">({tCommon('optional')})</span>
                  )}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required={registerMethod === 'email'}
                  placeholder={tAuth('emailPlaceholder')}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>
                  {tAuth('phoneLabel')}{' '}
                  {registerMethod === 'phone' ? (
                    <span className="text-rose-500">*</span>
                  ) : (
                    <span className="text-xs font-normal text-slate-400">({tCommon('optional')})</span>
                  )}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required={registerMethod === 'phone'}
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={tAuth('phonePlaceholder')}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {tAuth('passwordLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{tAuth('confirmPasswordLabel')}</span>
                {confirmPassword.length > 0 && (
                  passwordsMatch ? (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {tAuth('passwordsMatch')}
                    </span>
                  ) : (
                    <span className="text-[11px] text-rose-500 font-semibold">
                      {tAuth('passwordsMismatch')}
                    </span>
                  )
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all ${
                    confirmPassword.length > 0 && !passwordsMatch
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Live Password Strength Checklist */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
            <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">{tAuth('passwordStrengthTitle')}</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
                <span>{hasMinLength ? '✓' : '•'}</span> {tAuth('reqMinLength')}
              </div>
              <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
                <span>{hasUpper ? '✓' : '•'}</span> {tAuth('reqUppercase')}
              </div>
              <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
                <span>{hasLower ? '✓' : '•'}</span> {tAuth('reqLowercase')}
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
                <span>{hasNumber ? '✓' : '•'}</span> {tAuth('reqNumber')}
              </div>
              <div className={`flex items-center gap-1.5 ${hasSymbol ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'} col-span-2`}>
                <span>{hasSymbol ? '✓' : '•'}</span> {tAuth('reqSymbol')}
              </div>
            </div>
          </div>

          {/* Personal Bio Data (ONLY SHOWN FOR RENTER) */}
          {selectedRole === 'RENTER' && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {tAuth('genderLabel')}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">{tAuth('selectGender')}</option>
                    <option value="MALE">{tAuth('male')}</option>
                    <option value="FEMALE">{tAuth('female')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {tAuth('dateOfBirthLabel')}
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {tAuth('maritalStatusLabel')}
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
          )}

          {/* Ethiopian Location Hierarchy */}
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {tAuth('regionLabel')}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {ETHIOPIAN_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {tAuth('zoneLabel')}
                </label>
                <input
                  type="text"
                  placeholder={tAuth('zonePlaceholder')}
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {tAuth('weredaLabel')}
                </label>
                <input
                  type="text"
                  placeholder={tAuth('weredaPlaceholder')}
                  value={wereda}
                  onChange={(e) => setWereda(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {tAuth('kebeleLabel')}
                </label>
                <input
                  type="text"
                  placeholder={tAuth('kebelePlaceholder')}
                  value={kebele}
                  onChange={(e) => setKebele(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Profile Image (Upload or URL - Optional) */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {tAuth('profilePhotoLabel')}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      imageInputMode === 'upload'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Upload className="w-3 h-3" /> {tAuth('uploadTab')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      imageInputMode === 'url'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3" /> {tAuth('urlTab')}
                  </button>
                </div>
              </div>

              {profileImageUrl && (
                <div className="flex items-center gap-3 p-2 mb-2 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl">
                  <img
                    src={profileImageUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-full object-cover border border-emerald-400 shadow-sm"
                  />
                  <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium truncate flex-1">
                    {tAuth('photoReady')}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-rose-500 hover:text-rose-700 p-1 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> {tCommon('remove')}
                  </button>
                </div>
              )}

              {imageInputMode === 'upload' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950 dark:file:text-emerald-300 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    placeholder={tAuth('photoUrlPlaceholder')}
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              selectedRole === 'OWNER' ? tAuth('btnRegisterOwner') : tAuth('btnRegisterRenter')
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">
              {tAuth('or')}
            </span>
          </div>
        </div>

        {/* Continue with Google Button */}
        <div className="w-full flex justify-center">
          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={(msg) => setError(msg)}
            text="continue_with"
            disabled={loading}
          />
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-600 dark:text-slate-400">
          {tAuth('alreadyHaveAccount')}{' '}
          <Link href="/auth/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            {tAuth('loginTitle')}
          </Link>
        </div>
      </div>
    </div>
  );
}
