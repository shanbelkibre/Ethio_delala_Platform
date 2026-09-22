'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { verificationService } from '@/features/verification';

export default function OwnerVerificationPage() {
  const { user } = useAuthStore();
  const [docType, setDocType] = useState('National ID');
  const [docNum, setDocNum] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);

  const [idLoading, setIdLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleIdentitySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!docFile) return setError('Please select an identity document file to upload.');
    setIdLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('document', docFile);
      formData.append('documentType', docType);
      formData.append('documentNumber', docNum);

      const res = await verificationService.uploadIdentityDocument(formData);
      if (res.success) {
        setSuccess('Identity document uploaded successfully! Admin will review it shortly.');
        setDocNum('');
        setDocFile(null);
      } else {
        setError(res.message || 'Upload failed');
      }
    } catch (err: unknown) {
      const errorObj = err as { error?: { message?: string } };
      setError(errorObj?.error?.message || 'Verification upload failed.');
    } finally {
      setIdLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Owner Identity Verification</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Submit your official Government ID or Fayda e-KYC to verify your owner account.</p>
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

        {/* Identity Verification Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-150 dark:border-slate-800 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Government Identity (Fayda / Passport / Kebele)</h2>
            <p className="text-xs text-slate-500 mt-1">Upload your official Ethiopian identification for account trust and verification badge.</p>
          </div>

          <form onSubmit={handleIdentitySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Document Type</label>
              <select 
                value={docType} 
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-150 text-sm focus:outline-none"
              >
                <option value="National ID">Fayda National ID (FIN)</option>
                <option value="Passport">Ethiopian Passport</option>
                <option value="Kebele ID">Resident / Kebele ID</option>
                <option value="Driver License">Driver License</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Document / ID Number</label>
              <input 
                type="text" 
                required
                value={docNum} 
                onChange={(e) => setDocNum(e.target.value)}
                placeholder="e.g. FAYDA-12345678"
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-150 text-sm focus:outline-none"
              >
              </input>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload ID File (Image or PDF)</label>
              <input 
                type="file" 
                required
                accept="image/*,application/pdf"
                onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-150 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={idLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {idLoading ? 'Uploading...' : 'Submit Identity Document'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
