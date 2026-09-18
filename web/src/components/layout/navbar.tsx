'use client';

import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  Home,
  Building2,
  Info,
  Wrench,
  MessageSquare,
  LayoutDashboard,
  User,
  FileText,
  Tag,
  Heart,
  Bell,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  ShieldAlert,
  LucideIcon,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/useAuthStore';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

// ============================================================================
// MODULAR REUSABLE NAVBAR STYLE PRESETS (Senior Frontend Design Tokens)
// ============================================================================
const navStyles = {
  // Uniform Navigation Links (Used identically for Public Discovery, Login, and Get Started)
  navLink: (active: boolean) =>
    cn(
      'rounded-lg px-3.5 py-2 text-sm font-semibold transition-all',
      active
        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
    ),

  // Mobile Drawer Links
  mobileNavLink: (active: boolean) =>
    cn(
      'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
      active
        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold'
        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
    ),

  // Dropdown Link Item
  dropdownLink:
    'flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors',

  // Theme Toggle Button
  themeToggleBtn:
    'flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors',

  // Sign Out Danger Button
  btnLogout:
    'flex w-full items-center gap-3 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors',
};

// ============================================================================
// REUSABLE SUB-COMPONENTS
// ============================================================================
interface DropdownItemProps {
  href: string;
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  onClick: () => void;
}

const DropdownItem = ({ href, icon: Icon, iconColor = 'text-slate-400', label, onClick }: DropdownItemProps) => (
  <Link href={href} onClick={onClick} className={navStyles.dropdownLink}>
    <Icon className={cn('h-4 w-4', iconColor)} />
    <span>{label}</span>
  </Link>
);

interface NavbarProps {
  cmsNavbar?: {
    siteName?: string;
    siteTagline?: string;
    logoColor?: string;
  };
}

// ============================================================================
// MAIN NAVBAR COMPONENT
// ============================================================================
export function Navbar({ cmsNavbar = {} }: NavbarProps) {
  const tNav = useTranslations('nav');
  const tRoles = useTranslations('roles');
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const publicLinks = [
    { href: '/', label: tNav('home'), icon: Home },
    { href: '/public/properties', label: tNav('properties'), icon: Building2 },
    { href: '/public/about', label: tNav('about'), icon: Info },
    { href: '/#services', label: tNav('services'), icon: Wrench },
    { href: '/public/contact', label: tNav('contact'), icon: MessageSquare },
  ];

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = savedTheme || systemTheme;
    setTheme(activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    clearAuth();
    setProfileMenuOpen(false);
    setMobileOpen(false);
    router.push('/auth/login');
  };

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    const cleanPath = pathname.split('?')[0];
    return cleanPath === href || cleanPath.startsWith(href + '/');
  };

  // Determine user primary role styling and labels
  const isRenter = user?.roles?.includes('RENTER');
  const isOwner = user?.roles?.includes('OWNER');
  const isAgent = user?.roles?.includes('AGENT');
  const isAdmin = user?.roles?.includes('ADMIN');

  let roleLabel = tRoles('renter');
  let roleBadgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  let dashboardHref = '/renter/dashboard';

  if (isAdmin) {
    roleLabel = tRoles('admin');
    roleBadgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    dashboardHref = '/management/admin/dashboard';
  } else if (isAgent) {
    roleLabel = tRoles('agent');
    roleBadgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    dashboardHref = '/management/agent/dashboard';
  } else if (isOwner) {
    roleLabel = tRoles('owner');
    roleBadgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    dashboardHref = '/owner/dashboard';
  }

  // Profile Avatar Icon
  const ProfileAvatarIcon = ({ className = 'h-9 w-9' }: { className?: string }) => (
    <div className={cn('relative rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 transition-transform bg-slate-100 dark:bg-slate-800', className)}>
      <img
        src={user?.avatarUrl || '/images/profile.png'}
        alt={user?.name || 'User profile'}
        className="h-full w-full object-cover rounded-full"
      />
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm group-hover:scale-105 transition-transform"
            style={{ backgroundColor: cmsNavbar.logoColor || '#059669' }}
          >
            <Home className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {cmsNavbar.siteName || tNav('brandName')}
            </p>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {cmsNavbar.siteTagline || tNav('brandTagline')}
            </p>
          </div>
        </Link>

        {/* Public Website Navigation (Discovery Links) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navStyles.navLink(isLinkActive(link.href))}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Header Section: Language Switcher + Auth Links + Theme Toggle */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Switcher (Amharic / English) */}
          {mounted && <LanguageSwitcher />}

          {/* AUTHENTICATED STATE: Profile Image Avatar & Dropdown Menu */}
          {mounted && isAuthenticated && user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 hover:scale-105 active:scale-95 cursor-pointer',
                  profileMenuOpen
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                )}
                aria-label="Account menu"
                aria-expanded={profileMenuOpen}
              >
                <ProfileAvatarIcon className="h-full w-full" />
              </button>

              {/* Account Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Authenticated User Header Card */}
                  <div className="px-4 py-3 border-b border-slate-150 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <ProfileAvatarIcon className="h-10 w-10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {user.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email || user.phone || ''}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border', roleBadgeClass)}>
                        {roleLabel}
                      </span>
                      {user.isIdentityVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />
                          {tNav('faydaVerified')}
                        </span>
                      ) : (
                        <Link
                          href={isOwner ? '/owner/verification' : '/renter/profile'}
                          onClick={() => setProfileMenuOpen(false)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 transition-colors"
                        >
                          <ShieldAlert className="h-3 w-3 text-amber-500" />
                          {tNav('verifyId')}
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Role-Specific Account Actions */}
                  <div className="py-1.5 text-xs font-medium space-y-0.5">
                    {isRenter && (
                      <>
                        <DropdownItem href="/renter/dashboard" icon={LayoutDashboard} iconColor="text-emerald-600 dark:text-emerald-400" label={tNav('dashboard')} onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/renter/profile" icon={User} label={tNav('profileSettings')} onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/renter/rental-requests" icon={FileText} iconColor="text-indigo-500" label="Rental Requests" onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/renter/sale-requests" icon={Tag} iconColor="text-blue-500" label="Sale Requests" onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/renter/favorites" icon={Heart} iconColor="text-rose-500" label="Favorites" onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/renter/notifications" icon={Bell} iconColor="text-amber-500" label="Notifications" onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/renter/messages" icon={MessageSquare} iconColor="text-emerald-500" label="Messages" onClick={() => setProfileMenuOpen(false)} />
                      </>
                    )}

                    {isOwner && (
                      <>
                        <DropdownItem href="/owner/dashboard" icon={LayoutDashboard} iconColor="text-emerald-600 dark:text-emerald-400" label={tNav('dashboard')} onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/owner/profile" icon={User} label={tNav('profileSettings')} onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/owner/properties" icon={Building2} iconColor="text-emerald-500" label="My Properties" onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/owner/rental-requests" icon={FileText} iconColor="text-indigo-500" label="Rental Requests" onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/owner/sale-requests" icon={Tag} iconColor="text-blue-500" label="Sale Requests" onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/owner/notifications" icon={Bell} iconColor="text-amber-500" label="Notifications" onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/owner/messages" icon={MessageSquare} iconColor="text-emerald-500" label="Messages" onClick={() => setProfileMenuOpen(false)} />
                      </>
                    )}

                    {isAgent && (
                      <>
                        <DropdownItem href="/management/agent/dashboard" icon={LayoutDashboard} iconColor="text-emerald-600 dark:text-emerald-400" label={tNav('dashboard')} onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/management/agent/dashboard" icon={Building2} iconColor="text-blue-500" label="Properties Queue" onClick={() => setProfileMenuOpen(false)} />
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <DropdownItem href="/management/admin/dashboard" icon={LayoutDashboard} iconColor="text-emerald-600 dark:text-emerald-400" label={tNav('dashboard')} onClick={() => setProfileMenuOpen(false)} />
                        <DropdownItem href="/management/admin/dashboard" icon={User} label={tNav('profileSettings')} onClick={() => setProfileMenuOpen(false)} />
                      </>
                    )}
                  </div>

                  {/* Sign Out Action */}
                  <div className="pt-1 mt-1 border-t border-slate-150 dark:border-slate-800">
                    <button onClick={handleLogout} className={navStyles.btnLogout}>
                      <LogOut className="h-4 w-4" />
                      <span>{tNav('signOut')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* UNAUTHENTICATED GUEST STATE: Uniform links */
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Link
                href="/auth/login"
                className={navStyles.navLink(isLinkActive('/auth/login'))}
              >
                {tNav('login')}
              </Link>
              <Link
                href="/auth/register"
                className={navStyles.navLink(isLinkActive('/auth/register'))}
              >
                {tNav('getStarted')}
              </Link>
            </div>
          )}

          {/* Theme Toggle Button (Far Right) */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className={navStyles.themeToggleBtn}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5 text-amber-500" />}
            </button>
          )}

          {/* Mobile Drawer Hamburger Toggle */}
          <button
            className="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Public Discovery Navigation + Account Area) */}
      {mobileOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 lg:hidden space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Authenticated User Preview Card on Mobile */}
          {mounted && isAuthenticated && user ? (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <ProfileAvatarIcon className="h-9 w-9" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user.email || user.phone || ''}
                  </p>
                </div>
              </div>
              <span className={cn('px-2 py-0.5 rounded text-[10px] font-black uppercase border', roleBadgeClass)}>
                {roleLabel}
              </span>
            </div>
          ) : null}

          {/* Public Navigation in Mobile */}
          <div className="space-y-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={navStyles.mobileNavLink(isLinkActive(link.href))}
              >
                <link.icon className="h-4 w-4 text-slate-500" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Language Switcher */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{tNav('language')}</span>
            <LanguageSwitcher />
          </div>

          {/* Mobile Account Actions */}
          {mounted && isAuthenticated && user ? (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Link
                href={dashboardHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-sm font-bold transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{tNav('dashboard')}</span>
              </Link>

              <button onClick={handleLogout} className={cn(navStyles.btnLogout, 'rounded-xl px-4 py-2.5 text-sm')}>
                <LogOut className="h-4 w-4" />
                <span>{tNav('signOut')}</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className={cn(navStyles.mobileNavLink(isLinkActive('/auth/login')), 'justify-center font-bold border border-slate-200 dark:border-slate-800')}
              >
                {tNav('login')}
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileOpen(false)}
                className={cn(navStyles.mobileNavLink(isLinkActive('/auth/register')), 'justify-center font-bold border border-slate-200 dark:border-slate-800')}
              >
                {tNav('getStarted')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
