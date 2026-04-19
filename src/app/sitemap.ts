import type { MetadataRoute } from 'next';
import { projects } from '@/lib/data/projects';
import {
  SUPPORTED_LOCALES,
  localeUrl,
  buildLanguageAlternates,
  absoluteUrl,
  type SupportedLocale,
} from '@/lib/seo';
import { getPathname } from '@/i18n/navigation';
import type { StaticPathname } from '@/i18n/routing';

/**
 * Static routes (all rendered for every locale). `priority` reflects
 * relative importance; home (1.0) > landing SEO pages (0.95) > services
 * (0.9) > portfolio list (0.85) > about/contact (0.8) > project pages (0.7).
 */
const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/portfolio', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
];

/**
 * Localised landing pages — each resolves to a different URL per locale
 * via the `pathnames` config in `routing.ts`. We feed the canonical
 * internal path and rely on `getPathname` to emit the correct slug.
 */
const LOCALISED_LANDING_ROUTES: StaticPathname[] = [
  '/create-website',
  '/create-saas',
  '/ai-automation',
];

/**
 * Build `hreflang` alternates for a localised landing page — this needs
 * to use the per-locale slug, not the canonical path, or Google will be
 * confused when it compares alternates.
 */
function buildLocalisedAlternates(
  canonical: StaticPathname
): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    const p = getPathname({ href: canonical, locale });
    alternates[locale] = absoluteUrl(`/${locale}${p}`);
  }
  // x-default points to the default-locale version
  const defaultP = getPathname({ href: canonical, locale: 'pt-BR' });
  alternates['x-default'] = absoluteUrl(`/pt-BR${defaultP}`);
  return alternates;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ---- Static routes (one entry per locale × path) ----
  for (const locale of SUPPORTED_LOCALES) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: localeUrl(locale as SupportedLocale, route.path),
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: buildLanguageAlternates(route.path),
        },
      });
    }
  }

  // ---- Localised landing pages ----
  for (const locale of SUPPORTED_LOCALES) {
    for (const canonical of LOCALISED_LANDING_ROUTES) {
      const localPath = getPathname({ href: canonical, locale });
      entries.push({
        url: absoluteUrl(`/${locale}${localPath}`),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.95, // SEO landing pages — high priority
        alternates: {
          languages: buildLocalisedAlternates(canonical),
        },
      });
    }
  }

  // ---- Dynamic portfolio project pages ----
  for (const locale of SUPPORTED_LOCALES) {
    for (const project of projects) {
      const path = `/portfolio/${project.slug}`;
      entries.push({
        url: localeUrl(locale as SupportedLocale, path),
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.7,
        alternates: {
          languages: buildLanguageAlternates(path),
        },
      });
    }
  }

  return entries;
}
