import { getLocale, getTranslations } from 'next-intl/server';
import { Choreography } from '@/components/shell/Choreography';
import { testimonials } from '@/lib/data/testimonials';
import type { Locale } from '@/i18n/routing';

/**
 * Section 04 — RESULTS. Metrics in display type are the hero (they count with the scroll);
 * the client quote is supporting text with the name in mono. No stars, no giant quote
 * marks. Server Component — every number, label and quote is in the server HTML, and the
 * counters only overwrite the number's textContent once the client takes over.
 */
export async function ResultsSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('testimonials');
  const withMetrics = testimonials.filter((x) => x.metrics);

  return (
    <Choreography name="results">
      <section
        data-results-stage
        data-stage="results"
        data-stage-lead="0.6"
        className="relative flex min-h-screen items-center overflow-hidden px-6 py-24 md:px-12"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div data-results-header className="max-w-2xl">
            <p className="hud-readout text-[10px] opacity-100! text-red-bright">04 / RESULTS</p>
            <h2 className="type-display mt-6 text-[clamp(2rem,5vw,4rem)] text-fg">{t('title')}</h2>
            <p className="mt-6 text-base leading-relaxed text-fg/60 md:text-lg">{t('subtitle')}</p>
          </div>

          <dl className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {withMetrics.map((item) => {
              const raw = item.metrics!.value;
              const numeric = raw.replace(/[^\d]/g, '');
              const prefix = raw.startsWith('+') ? '+' : '';
              const suffix = raw.includes('%') ? '%' : '';
              return (
                <div
                  key={item.id}
                  data-metric
                  data-metric-value={numeric}
                  data-metric-prefix={prefix}
                  data-metric-suffix={suffix}
                  className="border-t border-line/15 pt-5"
                >
                  <dd
                    data-metric-number
                    className="type-display text-[clamp(2.6rem,6vw,4.6rem)] text-red-bright tabular-nums"
                  >
                    {raw}
                  </dd>
                  <dt className="hud-readout mt-3 text-[10px] opacity-70!">
                    {t(`metrics.${item.metrics!.key}`)}
                  </dt>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg/45">
                    {item.name}
                  </p>
                </div>
              );
            })}
          </dl>

          <div className="mt-20 grid gap-10 border-t border-line/10 pt-12 md:grid-cols-2 lg:gap-16">
            {withMetrics.slice(0, 2).map((item) => (
              <figure key={item.id} data-metric-quote>
                <blockquote className="text-sm leading-relaxed text-fg/60 md:text-base">
                  {item.translations[locale].quote}
                </blockquote>
                <figcaption className="hud-readout mt-5 text-[10px] opacity-70!">
                  {item.name} · {item.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </Choreography>
  );
}
