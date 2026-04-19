import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Robots rules — open crawl with a few API/private paths disallowed, and
 * an explicit block for known scraper bots that burn our crawl budget.
 *
 * Generated at build time to `/robots.txt`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: everything allowed to everyone.
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/private/',
          // Avoid indexing URLs that Next generates for static asset previews
          '*.json$',
        ],
      },
      // Explicit allow for Googlebot with broadest permissions.
      {
        userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-News'],
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // LLM crawlers — allowed (we want to show up in AI answers).
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'CCBot', // Common Crawl (used by several LLM trainers)
        ],
        allow: '/',
        disallow: ['/api/'],
      },
      // Known aggressive scrapers — blocked to preserve crawl budget.
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
