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
  return children;
}
