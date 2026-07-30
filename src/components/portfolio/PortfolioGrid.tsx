'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { projects } from '@/lib/data/projects';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const categories = [
  'all',
  'healthPharma',
  'retailEcommerce',
  'sustainability',
  'aiData',
  'corporate',
] as const;

type Category = (typeof categories)[number];

/**
 * The work index. Client Component for ONE reason: the category filter. Everything
 * else is plain markup — no GSAP, no custom cursor, no scroll listeners. The entry
 * animation belongs to <PageReveal>, which reads the [data-reveal] blocks below.
 *
 * Cards are never revealed individually: filtering unmounts them, and a ScrollTrigger
 * bound to a dead node is a leak (and can leave replacement cards invisible). The
 * filter bar and the grid are the two reveal blocks; cards are always painted.
 */
export function PortfolioGrid() {
  const t = useTranslations('portfolio');
  const locale = useLocale() as Locale;
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filtered =
    activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory);

  // Filtering changes the document height, which invalidates every ScrollTrigger start
  // below the grid. ScrollTrigger recalculates on resize, so a synthetic resize keeps
  // them honest without importing GSAP into this component.
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [activeCategory]);

  return (
    <section className="px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div
          data-reveal
          className="flex flex-col gap-6 border-b border-line/10 pb-8 md:flex-row md:items-end md:justify-between"
        >
          <ul className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category) => {
              const active = activeCategory === category;
              return (
                <li key={category}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      'flex min-h-11 items-center rounded-xs px-4 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200',
                      active
                        ? 'border border-red bg-red text-white'
                        : 'border-hairline text-fg/60 hover:border-red-bright/40 hover:text-fg',
                    )}
                  >
                    {t(`filters.${category}`)}
                  </button>
                </li>
              );
            })}
          </ul>

          <p aria-live="polite" className="hud-readout shrink-0 text-[10px]">
            {String(filtered.length).padStart(2, '0')} /{' '}
            {String(projects.length).padStart(2, '0')}
          </p>
        </div>

        <div data-reveal className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-10">
          {filtered.map((project, index) => {
            const copy = project.translations[locale];
            const extra = project.technologies.length - 4;

            return (
              <article
                key={project.id}
                className="border-hairline group relative flex flex-col overflow-hidden rounded-xs bg-surface transition-colors duration-300 hover:border-red-bright/30"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-bg">
                  <Image
                    src={project.image}
                    alt={copy.title}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 560px"
                    className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-7">
                  <p className="hud-readout text-[9px] opacity-100! text-red-bright">
                    {String(index + 1).padStart(2, '0')} · {t(`filters.${project.category}`)}
                  </p>

                  <h2 className="type-display mt-3 text-[clamp(1.15rem,2.2vw,1.6rem)] text-fg">
                    {/* Stretched link: the whole card is clickable, with no nested anchors. */}
                    <Link
                      href={`/${locale}/portfolio/${project.slug}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {copy.title}
                    </Link>
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg/60">
                    {copy.shortDescription}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <li
                        key={tech}
                        className="hud-readout border-hairline rounded-xs px-2.5 py-1.5 text-[9px] opacity-70!"
                      >
                        {tech}
                      </li>
                    ))}
                    {extra > 0 ? (
                      <li className="hud-readout border-hairline rounded-xs px-2.5 py-1.5 text-[9px] opacity-70!">
                        +{extra}
                      </li>
                    ) : null}
                  </ul>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg/70 transition-colors duration-200 group-hover:text-red-bright">
                      {t('viewProject')}
                      <span aria-hidden>→</span>
                    </span>

                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg/50 transition-colors duration-200 hover:text-fg"
                      >
                        {t('liveDemo')}
                        <span aria-hidden>↗</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
