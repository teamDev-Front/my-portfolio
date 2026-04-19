import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt-BR'],
  defaultLocale: 'pt-BR',
  localePrefix: 'always',
  /**
   * Localised URL slugs per locale.
   *
   * Canonical (internal) routes use English-friendly kebab-case names
   * that match the file-system folder under `src/app/[locale]/`.
   *
   * Only routes that need DIFFERENT slugs per locale must be listed
   * here — every other route keeps its literal folder name for every
   * locale (e.g. `/about` → `/pt-BR/about` + `/en/about`).
   *
   * Why: each landing page targets a specific Portuguese or English
   * search term, and the URL slug is a ranking factor. So PT-BR users
   * hit `/pt-BR/criar-site` while EN users hit `/en/build-a-website`,
   * both served by `src/app/[locale]/create-website/page.tsx`.
   */
  pathnames: {
    '/': '/',
    '/about': '/about',
    '/services': '/services',
    '/portfolio': '/portfolio',
    '/portfolio/[slug]': '/portfolio/[slug]',
    '/contact': '/contact',

    '/create-website': {
      'pt-BR': '/criar-site',
      en: '/build-a-website',
    },
    '/create-saas': {
      'pt-BR': '/criar-saas',
      en: '/build-a-saas',
    },
    '/ai-automation': {
      'pt-BR': '/automacao-com-ia',
      en: '/ai-automation',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathname = keyof typeof routing.pathnames;

/**
 * Non-parametrised pathnames — safe to pass directly to `getPathname`
 * without a `params` object. Excludes routes like `/portfolio/[slug]`.
 */
export type StaticPathname = Exclude<Pathname, `${string}[${string}]${string}`>;
