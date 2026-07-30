import Image from 'next/image';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { Choreography } from '@/components/shell/Choreography';
import { QueueCard } from '@/sections/home/QueueCard';
import { ProjectOverlay } from '@/sections/home/ProjectOverlay';
import { getFeaturedProjects } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';

/**
 * Section 03 — PORTFOLIO. The queue: featured work travelling through interpolated slots
 * with manual physics (portfolio.timeline.ts). Server Component — every project title,
 * description and image ships in the server HTML; each card links to its case-study page
 * so the crawler follows real hrefs, while a click opens the detail overlay.
 */
export async function PortfolioSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('portfolio');
  const featured = getFeaturedProjects().slice(0, 6);

  return (
    <Choreography name="portfolio">
      <section
        data-portfolio-stage
        data-stage="portfolio"
        data-stage-lead="0.7"
        className="relative min-h-screen overflow-hidden"
      >
        <div data-portfolio-headwrap className="absolute inset-x-0 top-24 z-20 px-6 md:px-12">
          <div data-portfolio-header className="mx-auto max-w-6xl">
            <p className="hud-readout text-[10px] opacity-100! text-red-bright">03 / PORTFOLIO</p>
            <h2 className="type-display mt-4 max-w-2xl text-[clamp(1.8rem,4.5vw,3.6rem)] text-fg">
              {t('title')}
            </h2>
          </div>
        </div>

        {/* The drag surface. touch-action pan-y keeps vertical scroll native on touch. */}
        <div
          data-queue-surface
          className="absolute inset-0 z-10 cursor-grab touch-pan-y select-none"
        >
          {featured.map((project, i) => {
            const copy = project.translations[locale];
            return (
              <QueueCard
                key={project.slug}
                slug={project.slug}
                index={i}
                title={copy.title}
                category={t(`filters.${project.category}`)}
              >
                <div className="border-hairline relative aspect-4/3 w-full overflow-hidden rounded-xs bg-surface">
                  <Image
                    src={project.image}
                    alt={copy.title}
                    fill
                    sizes="(max-width: 767px) 80vw, 40vw"
                    priority={i === 0}
                    className="object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                    <p className="hud-readout text-[9px] opacity-100! text-red-bright">
                      {String(i + 1).padStart(2, '0')} · {t(`filters.${project.category}`)}
                    </p>
                    <h3 className="type-display mt-2 text-[clamp(1.1rem,1.8vw,1.7rem)] text-fg">
                      {copy.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 max-w-md text-xs leading-relaxed text-fg/60 md:text-sm">
                      {copy.shortDescription}
                    </p>
                  </div>
                </div>
              </QueueCard>
            );
          })}
        </div>

        <div data-portfolio-footwrap className="absolute inset-x-0 bottom-24 z-20 px-6 md:px-12">
          <div className="mx-auto flex max-w-6xl items-end justify-between gap-6">
            <p data-queue-hint className="hud-readout text-[10px]">
              {locale === 'pt-BR' ? 'ARRASTE · CLIQUE PARA ABRIR' : 'DRAG · CLICK TO OPEN'}
            </p>
            <Link
              href={`/${locale}/portfolio`}
              data-portfolio-cta
              className="animated-underline inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-fg"
            >
              {t('viewAll')}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <ProjectOverlay />
    </Choreography>
  );
}
