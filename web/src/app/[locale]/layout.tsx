import type { Metadata } from 'next';
import Providers from '@/lib/providers';
import { Navbar } from '@/components/layout/navbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAmharic = locale === 'am';
  return {
    title: isAmharic
      ? 'ኢትዮ ደላላ | የኢትዮጵያ የቤትና ንብረት መድረክ'
      : 'Ethio Delala | Ethiopian Real Estate Platform',
    description: isAmharic
      ? 'በአዲስ አበባ እና በመላው ኢትዮጵያ የሚከራዩ እና የሚሸጡ ቤቶችን፣ አፓርታማዎችንና ቦታዎችን በቀላሉ ያግኙ።'
      : 'Find residential rentals, commercial properties, and real estate for sale across Ethiopia.',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr">
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            <main>{children}</main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
