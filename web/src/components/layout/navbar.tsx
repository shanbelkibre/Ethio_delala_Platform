'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Sparkles,
  ClipboardList,
  Flag,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/useAuthStore';

interface NavbarProps {
  cmsNavbar?: {
    siteName?: string;
    siteTagline?: string;
    logoColor?: string;
  };
}

const publicLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/public/properties', label: 'Properties', icon: Building2 },
  { href: '/public/about', label: 'About', icon: Info },
  { href: '/#services', label: 'Services', icon: Wrench },
  { href: '/public/contact', label: 'Contact', icon: MessageSquare },
];

export function Navbar({ cmsNavbar = {} }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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

  let roleLabel = 'Renter';
  let roleBadgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  let dashboardHref = '/renter/dashboard';

  if (isAdmin) {
    roleLabel = 'Admin';
    roleBadgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    dashboardHref = '/management/admin/dashboard';
  } else if (isAgent) {
    roleLabel = 'Agent';
    roleBadgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    dashboardHref = '/management/agent/dashboard';
  } else if (isOwner) {
    roleLabel = 'Owner';
    roleBadgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    dashboardHref = '/owner/dashboard';
  }

  // Profile Avatar Icon using image PNG profile from public/images/profile.png or user avatar
  const ProfileAvatarIcon = ({ className = 'h-9 w-9' }: { className?: string }) => {
    return (
      <div className={cn('relative rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 transition-transform bg-slate-100 dark:bg-slate-800', className)}>
        <img
          src={user?.avatarUrl || '/images/profile.png'}
          alt={user?.name || 'User profile'}
          className="h-full w-full object-cover rounded-full"
        />
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Public Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm group-hover:scale-105 transition-transform"
            style={{ backgroundColor: cmsNavbar.logoColor || '#059669' }}
          >
            <Home className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {cmsNavbar.siteName || 'Ethio Delala'}
            </p>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {cmsNavbar.siteTagline || 'Ethiopian Property Platform'}
            </p>
          </div>
        </Link>

        {/* Public Website Navigation (Public Discovery Only) */}
        <nav className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-semibold transition-all',
                  active
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Header Section: Theme Toggle & Profile Account Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5 text-amber-500" />}
            </button>
          )}

          {/* Account Profile Dropdown Trigger (Icon Only - Matched Circle Size) */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border-2 overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 hover:scale-105 active:scale-95',
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
                {mounted && isAuthenticated && user ? (
                  <>
                    {/* 1. Authenticated User Header Card */}
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
                            Fayda Verified
                          </span>
                        ) : (
                          <Link
                            href={isOwner ? '/owner/verification' : '/renter/profile'}
                            onClick={() => setProfileMenuOpen(false)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 transition-colors"
                          >
                            <ShieldAlert className="h-3 w-3 text-amber-500" />
                            Verify ID
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* 2. Role-Specific Account Actions */}
                    <div className="py-1.5 text-xs font-medium space-y-0.5">
                      {/* RENTER Profile Menu */}
                      {isRenter && (
                        <>
                          <Link
                            href="/renter/dashboard"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Renter Dashboard</span>
                          </Link>
                          <Link
                            href="/renter/profile"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <User className="h-4 w-4 text-slate-400" />
                            <span>Profile & Settings</span>
                          </Link>
                          <Link
                            href="/renter/rental-requests"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <FileText className="h-4 w-4 text-indigo-500" />
                            <span>Rental Requests</span>
                          </Link>
                          <Link
                            href="/renter/sale-requests"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span>Sale Requests</span>
                          </Link>
                          <Link
                            href="/renter/favorites"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <Heart className="h-4 w-4 text-rose-500" />
                            <span>Favorites</span>
                          </Link>
                          <Link
                            href="/renter/notifications"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <Bell className="h-4 w-4 text-amber-500" />
                            <span>Notifications</span>
                          </Link>
                          <Link
                            href="/renter/messages"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4 text-emerald-500" />
                            <span>Messages</span>
                          </Link>
                        </>
                      )}

                      {/* OWNER Profile Menu */}
                      {isOwner && (
                        <>
                          <Link
                            href="/owner/dashboard"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Owner Dashboard</span>
                          </Link>
                          <Link
                            href="/owner/profile"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <User className="h-4 w-4 text-slate-400" />
                            <span>Profile & Settings</span>
                          </Link>
                          <Link
                            href="/owner/properties"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <Building2 className="h-4 w-4 text-emerald-500" />
                            <span>My Properties</span>
                          </Link>
                          <Link
                            href="/owner/rental-requests"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <FileText className="h-4 w-4 text-indigo-500" />
                            <span>Rental Requests</span>
                          </Link>
                          <Link
                            href="/owner/sale-requests"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <Tag className="h-4 w-4 text-blue-500" />
                            <span>Sale Requests</span>
                          </Link>
                          <Link
                            href="/owner/subscription"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <span>Subscription</span>
                          </Link>
                          <Link
                            href="/owner/notifications"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <Bell className="h-4 w-4 text-amber-500" />
                            <span>Notifications</span>
                          </Link>
                          <Link
                            href="/owner/messages"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <MessageSquare className="h-4 w-4 text-emerald-500" />
                            <span>Messages</span>
                          </Link>
                        </>
                      )}

                      {/* AGENT Profile Menu */}
                      {isAgent && (
                        <>
                          <Link
                            href="/management/agent/dashboard"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Agent Workspace</span>
                          </Link>
                          <Link
                            href="/management/agent/profile"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <User className="h-4 w-4 text-slate-400" />
                            <span>Profile & Settings</span>
                          </Link>
                          <Link
                            href="/management/agent/properties"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <Building2 className="h-4 w-4 text-emerald-500" />
                            <span>Agent Properties</span>
                          </Link>
                          <Link
                            href="/management/agent/requests"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <ClipboardList className="h-4 w-4 text-blue-500" />
                            <span>Requests</span>
                          </Link>
                          <Link
                            href="/management/agent/reports"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <Flag className="h-4 w-4 text-rose-500" />
                            <span>Reports</span>
                          </Link>
                        </>
                      )}

                      {/* ADMIN Profile Menu */}
                      {isAdmin && (
                        <>
                          <Link
                            href="/management/admin/dashboard"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Admin Dashboard</span>
                          </Link>
                          <Link
                            href="/management/admin/dashboard"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                          >
                            <User className="h-4 w-4 text-slate-400" />
                            <span>Profile & Settings</span>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* 3. Sign Out Action Section */}
                    <div className="pt-1 mt-1 border-t border-slate-150 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Guest User Profile Menu (Only Sign In & Create Account) */
                  <div className="p-1 space-y-1">
                    <Link
                      href="/auth/login"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                    >
                      <LogIn className="h-4 w-4 text-emerald-600" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100 transition-colors"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Create Account</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Drawer Hamburger Toggle */}
          <button
            className="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Public Discovery Navigation + Account Area) */}
      {mobileOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 md:hidden space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
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
            {publicLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  )}
                >
                  <link.icon className="h-4 w-4 text-slate-500" />
                  {link.label}
                </Link>
              );
            })}
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
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
