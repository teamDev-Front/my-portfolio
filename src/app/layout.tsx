import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationSchema } from '@/lib/schemas';
import {
  SITE_URL,
  SITE_NAME,
  SITE_SHORT,
  SOCIAL,
  SITE_KEYWORDS,
  absoluteUrl,
  buildLanguageAlternates,
} from '@/lib/seo';

/**
 * Root metadata — the defaults every page inherits.
 *
 * `metadataBase` is the single most important field here: without it,
 * Next.js emits relative URLs for OG images and canonicals, which many
 * crawlers and social previewers do not resolve correctly. Everything
 * else (canonical, alternates, images) is built by merging per-page
 * metadata from `buildPageMetadata()` on top of these defaults.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Criamos Sites, SaaS, Lojas Virtuais & Soluções com IA`,
    template: `%s | ${SITE_SHORT}`,
  },
  description:
    'Agência de desenvolvimento digital em Jacareí (SP). Criação de sites, SaaS, e-commerce e automação com IA para empresas de São José dos Campos, Vale do Paraíba e todo o Brasil. React, Next.js, Python.',
  keywords: SITE_KEYWORDS['pt-BR'],
  applicationName: SITE_NAME,
  authors: [{ name: 'Luiz Habaeb', url: SOCIAL.linkedin }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  generator: 'Next.js',
  category: 'technology',
  classification: 'Web Development Agency',
  referrer: 'origin-when-cross-origin',
  alternates: {
    canonical: SITE_URL,
    languages: buildLanguageAlternates('/'),
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Sites, SaaS, E-commerce & Automação com IA`,
    description:
      'Sites, e-commerces, SaaS, sistemas e automações com IA. Jacareí, São José dos Campos e todo o Brasil.',
    images: [
      {
        url: absoluteUrl('/opengraph-image'),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Criamos Sites, SaaS e Soluções com IA`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: SOCIAL.twitter,
    site: SOCIAL.twitter,
    title: `${SITE_NAME} | Sites, SaaS & IA`,
    description:
      'Sites, e-commerces, SaaS, sistemas e automações com IA. Jacareí, SJC, Vale do Paraíba e Brasil.',
    images: [absoluteUrl('/opengraph-image')],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Placeholders — fill these after verifying ownership in each console.
    // Google: Search Console > Properties > Add property > HTML tag method.
    // google: 'REPLACE_WITH_GOOGLE_VERIFICATION_CODE',
    // yandex: 'REPLACE_WITH_YANDEX_CODE',
    // Bing uses the same file verification as msvalidate.01 meta.
    other: {
      // 'msvalidate.01': 'REPLACE_WITH_BING_CODE',
    },
  },
  other: {
    // Geo tags — older but still consumed by Yandex / some local engines
    'geo.region': 'BR-SP',
    'geo.placename': 'Jacareí, São José dos Campos, Vale do Paraíba',
    'geo.position': '-23.3053;-45.9658',
    ICBM: '-23.3053, -45.9658',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#040408' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className="antialiased">
        {/* Organisation schema shared across the entire site */}
        <JsonLd data={organizationSchema()} id="ld-organization" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
