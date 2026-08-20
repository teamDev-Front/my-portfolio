import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { getPathname } from '@/i18n/navigation';
import type { Locale, StaticPathname } from '@/i18n/routing';

/**
 * SERVICES — the offer, as an editorial ledger instead of a horizontally-pinned card
 * carousel: mono index in the gutter, title / description / inclusions in the reading
 * column, hairline between services. Server Component — every title, description and
 * inclusion ships in the server HTML.
 *
 * The `id` on each row is load-bearing: the footer deep-links to /services#saas,
 * #mobile, #ecommerce, #ai, #websites and #design. `scroll-mt-*` clears the fixed header.
 *
 * Three services also carry the SEO landing routes (/create-website, /create-saas,
 * /ai-automation) — the same key internal links the homepage services list exposes.
 */

const SERVICES: Array<{ key: string; id: string; landingRoute?: StaticPathname }> = [
  { key: 'saas', id: 'saas', landingRoute: '/create-saas' },
  { key: 'mobile', id: 'mobile' },
  { key: 'ecommerce', id: 'ecommerce' },
  { key: 'ai', id: 'ai', landingRoute: '/ai-automation' },
  { key: 'websites', id: 'websites', landingRoute: '/create-website' },
  { key: 'design', id: 'design' },
];

const FEATURE_SLOTS = [0, 1, 2, 3, 4, 5];

export function ServicesGrid() {
  const t = useTranslations('servicesPage');
  const tServices = useTranslations('services');
  const locale = useLocale() as Locale;

  return (
    <section className="relative px-6 pb-24 md:px-12 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <ul className="border-t border-line/10">
          {SERVICES.map((service, index) => {
            const title = t(`${service.key}.title`);
            const href = service.landingRoute
              ? getPathname({ href: service.landingRoute, locale })
              : null;

            return (
              <li
                key={service.key}
                id={service.id}
                data-reveal
                className="scroll-mt-28 border-b border-line/10"
              >
                <div className="grid gap-6 py-12 md:grid-cols-[10rem_1fr] md:gap-12 md:py-16">
                  <p className="hud-readout text-[10px] opacity-100! text-red-bright">
                    SERVICE {String(index + 1).padStart(2, '0')}
                  </p>

                  <div>
                    <h2 className="type-display text-[clamp(1.6rem,4vw,2.8rem)] text-fg">
                      {title}
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg/60 md:text-lg">
                      {t(`${service.key}.description`)}
                    </p>

                    <p className="hud-readout mt-10 text-[10px] opacity-100! text-fg/60">
                      WHAT&apos;S INCLUDED
                    </p>

                    <ul className="mt-5 grid max-w-3xl gap-x-10 sm:grid-cols-2">
                      {FEATURE_SLOTS.map((slot) => {
                        const feature = t(`${service.key}.features.${slot}`);
                        if (!feature || feature.includes('.features.')) return null;

                        return (
                          <li
                            key={feature}
                            className="flex items-baseline gap-3 border-t border-line/10 py-3 text-sm leading-relaxed text-fg/70 md:text-base"
                          >
                            <span
                              aria-hidden
                              className="hud-readout shrink-0 text-[10px] opacity-100! text-red-bright"
                            >
                              +
                            </span>
                            {feature}
                          </li>
                        );
                      })}
                    </ul>

                    {href ? (
                      <Link
                        href={href}
                        className="animated-underline mt-10 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-fg"
                        aria-label={`${title} — ${tServices('learnMore')}`}
                      >
                        {tServices('learnMore')}
                        <span aria-hidden>↗</span>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
