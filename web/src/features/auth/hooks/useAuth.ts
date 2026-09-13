'use client';

import { useAuthStore } from '../../../hooks/useAuthStore';
import { authService } from '../auth.service';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ROLE_DASHBOARD_ROUTES } from '../../../constants/roles';

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout network errors
    } finally {
      clearAuth();
      router.push('/auth/login');
    }
  }, [clearAuth, router]);

  const getDefaultDashboard = useCallback(() => {
    if (!user || !user.roles || user.roles.length === 0) return '/';
    const primaryRole = user.roles[0];
    return ROLE_DASHBOARD_ROUTES[primaryRole] || '/';
  }, [user]);

  return {
    user,
    token: accessToken,
    isAuthenticated,
    setAuth,
    logout: handleLogout,
    getDefaultDashboard,
  };
}
