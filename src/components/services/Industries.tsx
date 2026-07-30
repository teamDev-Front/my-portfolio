import { useTranslations } from 'next-intl';

/**
 * SERVICES — industries served. A numbered hairline list, not a grid of tilting icon
 * cards. Server Component; reveal via the [data-reveal] contract read by <PageReveal />.
 */

const INDUSTRY_SLOTS = [0, 1, 2, 3, 4, 5];

export function Industries() {
  const t = useTranslations('servicesPage.industries');

  return (
    <section className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p data-reveal className="hud-readout text-[10px] opacity-100! text-red-bright">
            INDUSTRIES
          </p>
          <h2 data-reveal className="type-display mt-6 text-[clamp(1.9rem,4.5vw,3.2rem)] text-fg">
            {t('title')}
          </h2>
          <p data-reveal className="mt-6 text-base leading-relaxed text-fg/60 md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <ul className="mt-14 grid border-t border-line/10 md:mt-20 md:grid-cols-2">
          {INDUSTRY_SLOTS.map((slot) => (
            <li
              key={slot}
              data-reveal
              className="flex items-baseline gap-5 border-b border-line/10 py-6 md:py-7 md:odd:pr-12 md:even:border-l md:even:border-l-line/10 md:even:pl-12"
            >
              <span className="hud-readout shrink-0 text-[10px] opacity-100! text-red-bright">
                {String(slot + 1).padStart(2, '0')}
              </span>
              <span className="text-[clamp(0.95rem,2.2vw,1.15rem)] text-fg/80">
                {t(`list.${slot}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
