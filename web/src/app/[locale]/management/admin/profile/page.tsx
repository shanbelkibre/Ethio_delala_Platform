'use client';

import { Suspense } from 'react';
import UserProfileSettings from '@/components/profile/UserProfileSettings';

export default function AdminProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <UserProfileSettings role="ADMIN" />
    </Suspense>
  );
}
