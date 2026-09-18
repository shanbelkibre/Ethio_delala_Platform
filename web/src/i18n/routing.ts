import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Supported locales: English and Ethiopian Amharic
  locales: ['en', 'am'],

  // Default locale
  defaultLocale: 'en',

  // Deterministic locale prefix: /en/... or /am/...
  localePrefix: 'always',
});

// Lightweight typed wrappers around Next.js navigation APIs
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
