import { useLocale, useTranslations } from 'next-intl';
import { timeline } from '@/lib/data/timeline';
import type { Locale } from '@/i18n/routing';

/**
 * ABOUT / 02 — the professional journey as an editorial ledger: mono year in the gutter,
 * role / company / description in the reading column, hairline between entries. No rail,
 * no dots, no pulsing. Server Component; reveal via the [data-reveal] contract.
 */
export function Timeline() {
  const t = useTranslations('about.timeline');
  const locale = useLocale() as Locale;

  return (
    <section className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p data-reveal className="hud-readout text-[10px] opacity-100! text-red-bright">
            02 / TIMELINE
          </p>
          <h2 data-reveal className="type-display mt-6 text-[clamp(1.9rem,4.5vw,3.2rem)] text-fg">
            {t('title')}
          </h2>
        </div>

        <ol className="mt-14 border-t border-line/10 md:mt-20">
          {timeline.map((item) => {
            const entry = item.translations[locale];

            return (
              <li key={item.year} data-reveal className="border-b border-line/10">
                <div className="grid gap-4 py-8 md:grid-cols-[9rem_1fr] md:gap-10 md:py-10">
                  <div className="flex items-center gap-3 md:flex-col md:items-start">
                    <span className="hud-readout text-[13px] opacity-100! text-red-bright">
                      {item.year}
                    </span>
                    {item.isCurrent ? (
                      <span className="rounded-xs bg-red px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white md:mt-3">
                        {t('current')}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h3 className="type-display text-[clamp(1.15rem,2.6vw,1.7rem)] text-fg">
                      {entry.title}
                    </h3>
                    <p className="hud-readout mt-3 text-[10px] opacity-100! text-red-bright">
                      {entry.company}
                    </p>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg/60 md:text-base">
                      {entry.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
