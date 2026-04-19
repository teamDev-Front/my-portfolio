import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_SHORT } from '@/lib/seo';

/**
 * PWA manifest — makes the site installable on mobile devices and provides
 * theme / icon metadata for browser tab UI, splash screens, and the
 * Windows / macOS "add to home screen" flows.
 *
 * Icons point to the existing `hcs-logo.svg` which scales to any resolution.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT,
    description:
      'Habaeb Creative Solutions — desenvolvimento de sites, SaaS, e-commerce e automação com IA. Jacareí, São José dos Campos e todo o Brasil.',
    start_url: '/',
    display: 'standalone',
    background_color: '#040408',
    theme_color: '#dc2626',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity', 'developer'],
    lang: 'pt-BR',
    icons: [
      {
        src: '/images/hcs-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/images/hcs-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
