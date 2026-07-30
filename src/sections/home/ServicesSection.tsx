import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Choreography } from '@/components/shell/Choreography';
import { getPathname } from '@/i18n/navigation';
import type { Locale, StaticPathname } from '@/i18n/routing';

/**
 * Section 02 — SERVICES. Editorial vertical list (no card grid): each service is a large
 * typographic row with a mono index, a hairline between rows, and a description that
 * expands on hover/focus. Server Component — the seven titles/descriptions and the three
 * landing-page links (key internal SEO links) all ship in the server HTML.
 */

const SERVICES: Array<{ key: string; landingRoute?: StaticPathname }> = [
  { key: 'websites', landingRoute: '/create-website' },
  { key: 'ecommerce' },
  { key: 'saas', landingRoute: '/create-saas' },
  { key: 'ai', landingRoute: '/ai-automation' },
  { key: 'design' },
  { key: 'marketing' },
  { key: 'consulting' },
];

export function ServicesSection() {
  const t = useTranslations('services');
  const locale = useLocale() as Locale;

  return (
    <Choreography name="services">
      <section
        data-services-stage
        data-stage="services"
        data-stage-lead="0.6"
        className="relative px-6 py-28 md:px-12 md:py-40"
      >
        <div className="mx-auto max-w-6xl">
          <div data-services-header className="max-w-2xl">
            <p className="hud-readout text-[10px] opacity-100! text-red-bright">02 / SERVICES</p>
            <h2 className="type-display mt-6 text-[clamp(2rem,5vw,4rem)] text-fg">{t('title')}</h2>
            <p className="mt-6 text-base leading-relaxed text-fg/60 md:text-lg">{t('subtitle')}</p>
          </div>

          <ul data-services-list className="mt-20 border-t border-line/10">
            {SERVICES.map(({ key, landingRoute }, i) => {
              const title = t(`${key}.title`);
              const description = t(`${key}.description`);
              const href = landingRoute ? getPathname({ href: landingRoute, locale }) : null;

              const body = (
                <>
                  <span className="hud-readout shrink-0 pt-2 text-[11px] opacity-100! text-red-bright md:pt-3">
                    0{i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="type-display block text-[clamp(1.4rem,3.4vw,2.6rem)] text-fg/85 transition-colors duration-300 group-hover:text-fg group-focus-visible:text-fg">
                      {title}
                    </span>
                    {/* Expanding description. Always open on touch (no hover there);
                        collapsed on desktop, expanding on hover/focus. */}
                    <span className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-hcs md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
                      <span className="overflow-hidden">
                        <span className="block max-w-xl pt-3 text-sm leading-relaxed text-fg/55 md:text-base">
                          {description}
                        </span>
                      </span>
                    </span>
                  </span>
                  {href ? (
                    <span className="hud-readout hidden shrink-0 items-center gap-2 self-center text-[10px] opacity-0! transition-opacity duration-300 group-hover:opacity-100! group-focus-visible:opacity-100! md:flex">
                      {t('learnMore')}
                      <span aria-hidden>↗</span>
                    </span>
                  ) : null}
                </>
              );

              return (
                <li key={key} data-service-row className="border-b border-line/10">
                  {href ? (
                    <Link
                      href={href}
                      className="group flex items-start gap-6 py-7 md:gap-10 md:py-9"
                      aria-label={`${title} — ${t('learnMore')}`}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div
                      tabIndex={0}
                      className="group flex items-start gap-6 py-7 outline-offset-4 md:gap-10 md:py-9"
                    >
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <Link
            href={`/${locale}/services`}
            data-services-cta
            className="animated-underline mt-16 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-fg"
          >
            {t('viewAll')}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </Choreography>
  );
}
