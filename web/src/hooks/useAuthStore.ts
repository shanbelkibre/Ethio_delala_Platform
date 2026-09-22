'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  roles: string[];
  status?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isIdentityVerified?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
