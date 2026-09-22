import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async rewrites() {
    const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || 'http://localhost:5000';
    return [
      {
        source: '/uploads/:path*',
        destination: `${backendBase}/uploads/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
