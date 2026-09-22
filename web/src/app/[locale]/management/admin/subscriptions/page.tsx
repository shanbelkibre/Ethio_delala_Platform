'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/features/admin';
import {
  CreditCard,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Layers,
  Save,
  X,
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number | string;
  durationDays: number;
  maxListings: number;
  features?: string[] | string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit Modal State
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<number>(30);
  const [editMaxListings, setEditMaxListings] = useState<number>(5);
  const [editIsActive, setEditIsActive] = useState(true);
  const [editFeatures, setEditFeatures] = useState('');
  const [saving, setSaving] = useState(false);

  // New Plan Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<number>(100);
  const [newDuration, setNewDuration] = useState<number>(30);
  const [newMaxListings, setNewMaxListings] = useState<number>(5);
  const [newFeatures, setNewFeatures] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    setLoading(true);
    try {
      const res = (await adminService.getSubscriptionPlans()) as {
        success?: boolean;
        data?: SubscriptionPlan[];
      };
      if (res?.success && Array.isArray(res.data)) {
        setPlans(res.data);
      } else {
        setPlans([]);
      }
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(plan: SubscriptionPlan) {
    setEditingPlan(plan);
    setEditName(plan.name);
    setEditPrice(Number(plan.price));
    setEditDuration(plan.durationDays);
    setEditMaxListings(plan.maxListings);
    setEditIsActive(plan.isActive);

    let featArr: string[] = [];
    if (Array.isArray(plan.features)) {
      featArr = plan.features;
    } else if (typeof plan.features === 'string') {
      try {
        featArr = JSON.parse(plan.features);
      } catch {
        featArr = [plan.features];
      }
    }
    setEditFeatures(featArr.join(', '));
  }

  async function handleUpdatePlan(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPlan) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const featuresArray = editFeatures
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        name: editName,
        price: Number(editPrice),
        durationDays: Number(editDuration),
        maxListings: Number(editMaxListings),
        isActive: editIsActive,
        features: featuresArray,
      };

      const res = (await adminService.updateSubscriptionPlan(editingPlan.id, payload)) as {
        success?: boolean;
        message?: string;
      };

      if (res?.success) {
        setSuccess(`Subscription plan "${editName}" updated successfully!`);
        setEditingPlan(null);
        fetchPlans();
      } else {
        setError(res?.message || 'Failed to update subscription plan.');
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'error' in err
          ? (err as { error?: { message?: string } }).error?.message
          : 'Failed to update plan.';
      setError(msg || 'Failed to update plan.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const featuresArray = newFeatures
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        name: newName,
        price: Number(newPrice),
        durationDays: Number(newDuration),
        maxListings: Number(newMaxListings),
        features: featuresArray,
      };

      const res = (await adminService.createSubscriptionPlan(payload)) as {
        success?: boolean;
        message?: string;
      };

      if (res?.success) {
        setSuccess(`Subscription plan "${newName}" created successfully!`);
        setShowCreateModal(false);
        setNewName('');
        setNewPrice(100);
        setNewDuration(30);
        setNewMaxListings(5);
        setNewFeatures('');
        fetchPlans();
      } else {
        setError(res?.message || 'Failed to create subscription plan.');
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'error' in err
          ? (err as { error?: { message?: string } }).error?.message
          : 'Failed to create plan.';
      setError(msg || 'Failed to create plan.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Manage Subscriptions
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Configure owner subscription tiers, ETB pricing, listing allowances, and tier features.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Plan</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-semibold text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl font-semibold text-sm">
            {success}
          </div>
        )}

        {/* Plans Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 text-center py-20 rounded-2xl border border-slate-150 dark:border-slate-800 text-slate-500">
            <CreditCard className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="text-lg font-bold">No subscription plans found.</p>
            <p className="text-xs text-slate-400 mt-1">Click &quot;Add New Plan&quot; to define your first subscription tier.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              let feats: string[] = [];
              if (Array.isArray(plan.features)) {
                feats = plan.features;
              } else if (typeof plan.features === 'string') {
                try {
                  feats = JSON.parse(plan.features);
                } catch {
                  feats = [plan.features];
                }
              }

              return (
                <div
                  key={plan.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          plan.isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {plan.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Inactive
                          </>
                        )}
                      </span>
                      <button
                        onClick={() => openEditModal(plan)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Plan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {plan.name}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                          ETB {Number(plan.price).toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          / {plan.durationDays} days
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span>Up to <strong className="text-slate-900 dark:text-slate-100">{plan.maxListings}</strong> active property listings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>Duration: <strong className="text-slate-900 dark:text-slate-100">{plan.durationDays} days</strong></span>
                      </div>
                    </div>

                    {feats.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Included Features
                        </p>
                        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                          {feats.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => openEditModal(plan)}
                      className="w-full bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 hover:text-emerald-700 font-semibold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Plan Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* EDIT MODAL */}
        {editingPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Edit Subscription Plan
                </h2>
                <button
                  onClick={() => setEditingPlan(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdatePlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editDuration}
                      onChange={(e) => setEditDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Max Listings
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editMaxListings}
                    onChange={(e) => setEditMaxListings(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Features (comma separated)
                  </label>
                  <textarea
                    rows={3}
                    value={editFeatures}
                    onChange={(e) => setEditFeatures(e.target.value)}
                    placeholder="List up to 10 properties, Verified Owner badge, Priority search sorting"
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="isActiveToggle"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Active for new subscriptions
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingPlan(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Create Subscription Plan
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. VIP Landlord Tier"
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step="any"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Max Listings
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newMaxListings}
                    onChange={(e) => setNewMaxListings(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Features (comma separated)
                  </label>
                  <textarea
                    rows={3}
                    value={newFeatures}
                    onChange={(e) => setNewFeatures(e.target.value)}
                    placeholder="List up to 25 properties, Featured badges, Direct SMS alerts"
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{creating ? 'Creating...' : 'Create Plan'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
