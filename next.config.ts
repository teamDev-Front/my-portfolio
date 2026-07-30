import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // Modern formats first — project screenshots are large PNGs and AVIF cuts them hard.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // Barrel-file imports (lucide-react especially) otherwise pull the whole icon set
    // into the client bundle.
    optimizePackageImports: ['lucide-react', 'gsap'],
  },
};

export default withNextIntl(nextConfig);
