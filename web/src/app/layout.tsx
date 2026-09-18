import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ethio Delala | Ethiopian Real Estate Platform',
  description: 'Find houses for rent and sale across Ethiopia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
