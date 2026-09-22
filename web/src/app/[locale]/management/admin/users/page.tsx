'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/features/admin';
import {
  Users, Search, RefreshCw, ShieldCheck, ShieldAlert,
  User, Phone, Mail, ChevronDown, UserX, UserCheck,
  Shield, X, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles?: string[];
  accountStatus?: string;
  isIdentityVerified?: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

type RoleFilter = 'ALL' | 'ADMIN' | 'AGENT' | 'OWNER' | 'RENTER';

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300',
  AGENT: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
  OWNER: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  RENTER: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
};

const ALL_ROLES = ['ADMIN', 'AGENT', 'OWNER', 'RENTER'];

export default function AdminUsersPage() {
  // Initialize loading as false to avoid SSR/client hydration mismatch
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');

  // Action panel state
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [showRoleEditor, setShowRoleEditor] = useState<string | null>(null);
  const [pendingRoles, setPendingRoles] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getUsers() as any;
      if (res?.success) {
        const list: AdminUser[] = Array.isArray(res.data)
          ? res.data
          : res.data?.users || [];
        setUsers(list);
      } else {
        setError('Failed to load users.');
      }
    } catch {
      setError('Failed to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(user: AdminUser) {
    const newStatus = user.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setActionLoading(true);
    setActionError('');
    try {
      const res = await adminService.updateUserStatus(user.id, newStatus) as any;
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) => u.id === user.id ? { ...u, accountStatus: newStatus } : u)
        );
        setActionUserId(null);
      } else {
        setActionError(res?.error?.message || 'Failed to update status.');
      }
    } catch (e: any) {
      setActionError(e?.error?.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  }

  function openRoleEditor(user: AdminUser) {
    setPendingRoles(user.roles || []);
    setShowRoleEditor(user.id);
    setActionUserId(null);
  }

  async function handleSaveRoles(userId: string) {
    setActionLoading(true);
    setActionError('');
    try {
      const res = await adminService.updateUserRoles(userId, pendingRoles) as any;
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) => u.id === userId ? { ...u, roles: pendingRoles } : u)
        );
        setShowRoleEditor(null);
      } else {
        setActionError(res?.error?.message || 'Failed to update roles.');
      }
    } catch (e: any) {
      setActionError(e?.error?.message || 'Failed to update roles.');
    } finally {
      setActionLoading(false);
    }
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q);
    const matchRole =
      roleFilter === 'ALL' || u.roles?.includes(roleFilter);
    return matchSearch && matchRole;
  });

  const counts = {
    ALL: users.length,
    ADMIN: users.filter((u) => u.roles?.includes('ADMIN')).length,
    AGENT: users.filter((u) => u.roles?.includes('AGENT')).length,
    OWNER: users.filter((u) => u.roles?.includes('OWNER')).length,
    RENTER: users.filter((u) => u.roles?.includes('RENTER')).length,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">User Management</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Directory of all registered tenants, landlords, agents, and admins.
            </p>
          </div>
          <button
            onClick={fetchUsers}
            suppressHydrationWarning
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl font-semibold text-sm">
            {error}
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl font-semibold text-sm flex items-center justify-between">
            <span>{actionError}</span>
            <button onClick={() => setActionError('')} className="text-rose-400 hover:text-rose-600 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(['ALL', 'ADMIN', 'AGENT', 'OWNER', 'RENTER'] as RoleFilter[]).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={cn(
                'p-4 rounded-2xl border text-left transition-all cursor-pointer',
                roleFilter === role
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-950'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800'
              )}
            >
              <Users className={cn('h-4 w-4 mb-2', roleFilter === role ? 'text-white' : 'text-emerald-600')} />
              <p className={cn('text-2xl font-black', roleFilter !== role && 'text-slate-900 dark:text-slate-100')}>
                {counts[role]}
              </p>
              <p className={cn('text-xs font-semibold capitalize', roleFilter !== role && 'text-slate-500 dark:text-slate-400')}>
                {role === 'ALL' ? 'All Users' : role.charAt(0) + role.slice(1).toLowerCase() + 's'}
              </p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Users className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {search ? 'No users match your search.' : 'No users found.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Identity</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors relative">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 shrink-0">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{u.name}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[160px]">{u.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>
                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <Mail className="h-3 w-3 text-slate-400" />{u.email}
                          </p>
                          {u.phone && (
                            <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <Phone className="h-3 w-3 text-slate-400" />{u.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-6 py-4">
                        {showRoleEditor === u.id ? (
                          <div className="space-y-2 min-w-[200px]">
                            <div className="flex flex-wrap gap-1">
                              {ALL_ROLES.map((role) => (
                                <button
                                  key={role}
                                  onClick={() =>
                                    setPendingRoles((prev) =>
                                      prev.includes(role)
                                        ? prev.filter((r) => r !== role)
                                        : [...prev, role]
                                    )
                                  }
                                  className={cn(
                                    'px-2 py-0.5 rounded-full text-xs font-bold border transition-all cursor-pointer',
                                    pendingRoles.includes(role)
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-emerald-400'
                                  )}
                                >
                                  {role}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleSaveRoles(u.id)}
                                disabled={actionLoading}
                                className="flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer disabled:opacity-50"
                              >
                                <Check className="h-3 w-3" /> Save
                              </button>
                              <button
                                onClick={() => setShowRoleEditor(null)}
                                className="flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
                              >
                                <X className="h-3 w-3" /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {(u.roles || []).map((role) => (
                              <span key={role} className={cn('px-2 py-0.5 rounded-full text-xs font-bold', ROLE_COLORS[role] || 'bg-slate-100 text-slate-700')}>
                                {role}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      {/* Account Status */}
                      <td className="px-6 py-4">
                        <span className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-bold',
                          u.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : u.accountStatus === 'SUSPENDED'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        )}>
                          {u.accountStatus || 'ACTIVE'}
                        </span>
                      </td>
                      {/* Identity Verified */}
                      <td className="px-6 py-4">
                        {u.isIdentityVerified ? (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                            <ShieldAlert className="h-4 w-4" /> Unverified
                          </span>
                        )}
                      </td>
                      {/* Joined */}
                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="relative flex items-center gap-2">
                          {/* Suspend / Activate Toggle */}
                          <button
                            onClick={() => { setActionUserId(u.id); handleToggleStatus(u); }}
                            disabled={actionLoading && actionUserId === u.id}
                            title={u.accountStatus === 'ACTIVE' ? 'Suspend account' : 'Activate account'}
                            className={cn(
                              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50',
                              u.accountStatus === 'ACTIVE'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 dark:text-rose-400'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:text-emerald-400'
                            )}
                          >
                            {u.accountStatus === 'ACTIVE' ? (
                              <><UserX className="h-3.5 w-3.5" /> Suspend</>
                            ) : (
                              <><UserCheck className="h-3.5 w-3.5" /> Activate</>
                            )}
                          </button>

                          {/* Edit Roles */}
                          <button
                            onClick={() => openRoleEditor(u)}
                            title="Edit roles"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 dark:text-blue-400 transition-colors cursor-pointer"
                          >
                            <Shield className="h-3.5 w-3.5" /> Roles
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
          Showing {filtered.length} of {users.length} users
        </p>
      </div>
    </div>
  );
}
