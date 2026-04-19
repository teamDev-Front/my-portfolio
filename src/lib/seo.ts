/**
 * Centralised SEO configuration for Habaeb Creative Solutions.
 *
 * Everything URL-, organisation-, or schema-related flows through this
 * file so that a domain change, rebrand, or locale expansion is a single-
 * file edit rather than a codebase-wide search.
 */

import type { Metadata } from 'next';

// ---------------------------------------------------------------------------
//  Site constants
// ---------------------------------------------------------------------------

/** Canonical production origin — no trailing slash. */
export const SITE_URL = 'https://habaeb.com';

/** Short brand name used throughout metadata. */
export const SITE_NAME = 'Habaeb Creative Solutions';

/** Abbreviated brand — used in title templates. */
export const SITE_SHORT = 'HCS';

/** Default language code (matches `routing.defaultLocale`). */
export const DEFAULT_LOCALE = 'pt-BR';

/** All supported locales (matches `routing.locales`). */
export const SUPPORTED_LOCALES = ['pt-BR', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Contact channels — keep in sync with `ContactInfo.tsx`. */
export const CONTACT = {
  email: 'contato@habaeb.com',
  phone: '+55 12 97414-0491',
  whatsapp: 'https://wa.me/5512974140491',
  // Canonical geographic focus — drives LocalBusiness + copy localisation.
  addressLocality: 'Jacareí',
  addressRegion: 'SP',
  addressCountry: 'BR',
  // Regions explicitly served (Local Pack inclusion in Google).
  areaServed: [
    'Jacareí',
    'São José dos Campos',
    'Vale do Paraíba',
    'Taubaté',
    'Caçapava',
    'Guararema',
    'Santa Branca',
    'São Paulo',
    'Brasil',
  ],
} as const;

/** Social profiles — used for `sameAs` in structured data. */
export const SOCIAL = {
  linkedin: 'https://linkedin.com/in/luizhabaeb',
  github: 'https://github.com/luizhabaeb',
  instagram: 'https://instagram.com/luizhabaeb',
  twitter: '@luizhabaeb',
} as const;

/** Founder/principal — used for Person schema + authorship. */
export const PERSON = {
  name: 'Luiz Habaeb',
  jobTitle: 'Full-Stack Developer & Founder',
  url: SOCIAL.linkedin,
  sameAs: [SOCIAL.linkedin, SOCIAL.github, SOCIAL.instagram],
} as const;

// ---------------------------------------------------------------------------
//  URL helpers
// ---------------------------------------------------------------------------

/**
 * Build an absolute URL from a path (which may or may not start with /).
 * Idempotent — passing an already-absolute URL returns it unchanged.
 */
export function absoluteUrl(path = ''): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalised === '/' ? '' : normalised}`;
}

/**
 * Build the canonical URL for a given locale + path combination.
 *
 * Because `localePrefix: 'always'`, every canonical URL includes the locale
 * segment. The root path `/` resolves to `/{locale}`.
 */
export function localeUrl(locale: SupportedLocale, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return absoluteUrl(`/${locale}${clean}`);
}

/**
 * Build the `alternates.languages` map for a given path, used by Next.js
 * to emit the correct `hreflang` link tags. Includes `x-default` pointing
 * to the default locale so Google knows which version to show to users
 * outside the supported language set.
 */
export function buildLanguageAlternates(path = '/'): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    // Google expects the BCP-47 tag; `pt-BR` and `en` are already valid.
    alternates[locale] = localeUrl(locale, path);
  }
  alternates['x-default'] = localeUrl(DEFAULT_LOCALE, path);
  return alternates;
}

// ---------------------------------------------------------------------------
//  Metadata builders
// ---------------------------------------------------------------------------

interface PageMetadataInput {
  /** Locale for this page — drives OG locale + hreflang alternates. */
  locale: SupportedLocale;
  /** Localised page title (WITHOUT the brand suffix — the template adds it). */
  title: string;
  /** Localised meta description. */
  description: string;
  /** Path WITHOUT the locale prefix. Example: `'/about'` or `'/portfolio/sara-bula-digital'`. */
  path?: string;
  /** Localised keyword list (optional — falls back to sitewide defaults). */
  keywords?: string | string[];
  /** OG image — absolute URL preferred. Defaults to root `/opengraph-image`. */
  image?: string;
  /** Override OG type — defaults to 'website'. Useful for blog posts ('article'). */
  ogType?: 'website' | 'article' | 'profile';
}

/**
 * Build a complete `Metadata` object for a localised page, including
 * canonical, hreflang alternates, Open Graph with locale, and Twitter
 * card. All URLs produced are absolute.
 */
export function buildPageMetadata({
  locale,
  title,
  description,
  path = '/',
  keywords,
  image,
  ogType = 'website',
}: PageMetadataInput): Metadata {
  const canonical = localeUrl(locale, path);
  const ogImage = image ?? absoluteUrl('/opengraph-image');
  const ogLocale = locale === 'pt-BR' ? 'pt_BR' : 'en_US';
  const alternateOgLocale = locale === 'pt-BR' ? 'en_US' : 'pt_BR';

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: ogType,
      locale: ogLocale,
      alternateLocale: alternateOgLocale,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: SOCIAL.twitter,
      title,
      description,
      images: [ogImage],
    },
  };
}

// ---------------------------------------------------------------------------
//  Keyword sets (localised, location-aware)
// ---------------------------------------------------------------------------

/**
 * Sitewide keyword defaults per locale. Pages may extend these arrays
 * with page-specific terms — e.g. the contact page adds "contato
 * desenvolvedor jacareí".
 */
export const SITE_KEYWORDS: Record<SupportedLocale, string[]> = {
  'pt-BR': [
    // Core service keywords
    'criar site',
    'fazer site',
    'criar sistema',
    'criar SaaS',
    'desenvolver SaaS',
    'criar loja virtual',
    'desenvolvimento web',
    'criação de sites',
    'sistema sob medida',
    'site profissional',
    'landing page',
    // AI & automation
    'automação com IA',
    'integrar ChatGPT',
    'chatbot para empresa',
    'automação de processos',
    'soluções com inteligência artificial',
    // Geographic
    'desenvolvedor web Jacareí',
    'criar site em Jacareí',
    'agência digital Jacareí',
    'desenvolvedor São José dos Campos',
    'criar sistema São José dos Campos',
    'agência Vale do Paraíba',
    'programador Vale do Paraíba',
    'desenvolvimento web São Paulo',
    // Tech stack
    'React',
    'Next.js',
    'TypeScript',
    'Python',
    'Django',
    'Node.js',
    // Commercial intent
    'contratar desenvolvedor',
    'freelancer web',
    'agência de desenvolvimento',
  ],
  en: [
    'web development',
    'custom software development',
    'SaaS development',
    'build a SaaS',
    'website creation',
    'e-commerce development',
    'AI automation',
    'ChatGPT integration',
    'business automation',
    'chatbot development',
    'React',
    'Next.js',
    'TypeScript',
    'Python',
    'Django',
    'full-stack developer Brazil',
    'hire web developer',
    'freelance developer Brazil',
    'São Paulo software agency',
  ],
};
