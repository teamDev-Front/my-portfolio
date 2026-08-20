import { getLocale, getTranslations } from 'next-intl/server';
import { Choreography } from '@/components/shell/Choreography';
import { testimonials } from '@/lib/data/testimonials';
import type { Locale } from '@/i18n/routing';

/**
 * Section 04 — RESULTS. A ledger, not a card wall: one row per delivered system, the
 * number counting with the scroll on the left and the project named on the right. The
 * row form is what lets the beat carry every project without outgrowing the pinned
 * viewport — a 4-up metric grid stopped scaling at four.
 *
 * Projects with a hard number are rows; the ones whose value isn't a number close the
 * section as short quotes, so each project appears exactly once.
 *
 * Server Component — every number, label and quote is in the server HTML, and the
 * counters only overwrite the number's textContent once the client takes over.
 */
export async function ResultsSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('testimonials');
  const withMetrics = testimonials.filter((x) => x.metrics);
  const withoutMetrics = testimonials.filter((x) => !x.metrics);

  return (
    <Choreography name="results">
      {/* Track + sticky section instead of a ScrollTrigger pin (no position:fixed swap,
          so no CLS). The track's extra height is the counting beat's scroll travel. */}
      <div
        data-results-track
        data-stage="results"
        data-stage-lead="0.6"
        className="relative h-[240vh] md:h-[280vh]"
      >
      <section
        data-results-stage
        className="sticky top-0 flex h-screen items-center overflow-hidden px-6 py-20 md:px-12"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div data-results-header className="max-w-2xl">
            <p className="hud-readout text-[10px] opacity-100! text-red-bright">04 / RESULTS</p>
            <h2 className="type-display mt-5 text-[clamp(1.8rem,4.4vw,3.4rem)] text-fg">
              {t('title')}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fg/60 md:text-base">{t('subtitle')}</p>
          </div>

          <dl className="mt-10 border-t border-line/15 md:mt-12">
            {withMetrics.map((item) => {
              const { value, prefix = '', suffix = '' } = item.metrics!;
              return (
                <div
                  key={item.id}
                  data-metric
                  data-metric-value={value}
                  data-metric-prefix={prefix}
                  data-metric-suffix={suffix}
                  data-metric-locale={locale}
                  className="grid grid-cols-[minmax(0,7.5rem)_1fr] items-baseline gap-x-5 gap-y-1 border-b border-line/10 py-4 md:grid-cols-[10rem_1fr_auto] md:gap-x-8 md:py-5"
                >
                  <dd
                    data-metric-number
                    className="type-display text-[clamp(1.6rem,3.6vw,2.6rem)] leading-none text-red-bright tabular-nums"
                  >
                    {`${prefix}${value.toLocaleString(locale)}${suffix}`}
                  </dd>
                  <dt className="text-sm leading-snug text-fg/80 md:text-base">
                    {t(`metrics.${item.metrics!.key}`)}
                  </dt>
                  <p className="col-start-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg/45 md:col-start-3 md:text-right md:text-[11px]">
                    {item.name}
                    <span className="hidden md:inline"> · {item.translations[locale].role}</span>
                  </p>
                </div>
              );
            })}
          </dl>

          <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-2 lg:gap-12">
            {withoutMetrics.map((item) => (
              <figure key={item.id} data-metric-quote>
                <blockquote className="text-sm leading-relaxed text-fg/60">
                  {item.translations[locale].quote}
                </blockquote>
                <figcaption className="hud-readout mt-4 text-[10px] opacity-70!">
                  {item.name} · {item.translations[locale].role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      </div>
    </Choreography>
  );
}
