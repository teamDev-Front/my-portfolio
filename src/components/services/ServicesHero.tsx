import { useTranslations } from 'next-intl';

/**
 * SERVICES — page masthead. Server Component: title, subtitle and the three HUD figures
 * ship in the server HTML (no counters, no client JS). Reveal via the [data-reveal]
 * contract read by <PageReveal />.
 */

const STATS: Array<{ value: string; label: string }> = [
  { value: '50+', label: 'Projects' },
  { value: '8+', label: 'Years' },
  { value: '6+', label: 'Services' },
];

export function ServicesHero() {
  const t = useTranslations('servicesPage');

  return (
    <section className="relative flex min-h-[70vh] items-end px-6 pb-16 pt-36 md:min-h-[78vh] md:px-12 md:pb-24 md:pt-48">
      <div className="mx-auto w-full max-w-6xl">
        <p data-reveal className="hud-readout text-[10px] opacity-100! text-red-bright">
          WHAT I DO
        </p>

        <h1 data-reveal className="type-display mt-8 text-[clamp(2.6rem,9vw,6.5rem)] text-fg">
          {t('pageTitle')}
        </h1>

        <p
          data-reveal
          className="mt-10 max-w-2xl text-[clamp(0.95rem,2.2vw,1.15rem)] leading-relaxed text-fg/70"
        >
          {t('pageSubtitle')}
        </p>

        <dl data-reveal className="mt-14 grid max-w-2xl grid-cols-3 border-t border-line/10 pt-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="hud-readout text-[9px] opacity-100! text-fg/60 md:text-[10px]">
                {stat.label}
              </dt>
              <dd className="type-display mt-3 text-[clamp(1.8rem,5vw,3.2rem)] text-red-bright">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
