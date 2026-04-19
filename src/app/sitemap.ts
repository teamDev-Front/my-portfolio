import type { MetadataRoute } from 'next';
import { projects } from '@/lib/data/projects';
import {
  SUPPORTED_LOCALES,
  localeUrl,
  buildLanguageAlternates,
  type SupportedLocale,
} from '@/lib/seo';

/**
 * Static routes (all rendered for every locale).
 * The `priority` reflects relative importance inside the site map —
 * home (1.0) > services (0.9) > portfolio list (0.85) > about/contact (0.8)
 * > individual project pages (0.7).
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
 * Sitemap generator.
 *
 * Emits one entry per (locale × route) combination. Each entry includes
 * `alternates.languages` so search engines discover every translation of a
 * URL — critical for `hreflang` to work together with the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ---- Static routes, one entry per (locale, path) ----
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
