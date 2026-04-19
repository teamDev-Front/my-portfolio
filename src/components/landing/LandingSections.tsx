'use client';

/**
 * Reusable landing-page sections for the SEO-targeted service pages
 * (/criar-site, /criar-saas, /automacao-com-ia).
 *
 * Each section is data-driven — the parent page passes translated content
 * via props, so the same components power every landing page in both
 * locales. GSAP + ScrollTrigger match the existing Hero / Intro / CTA
 * conventions, so the transitions feel native to the rest of the site.
 */

import { useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Search,
  Layout,
  Smartphone,
  Accessibility,
  Shield,
  Users,
  CreditCard,
  BarChart3,
  Bot,
  GitBranch,
  Check,
  MapPin,
  Plus,
  Minus,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// --------------------------------------------------------------------------
//  Icon map — translation files reference icons by string key. Keeping
//  the mapping here avoids shipping the entire lucide set in the bundle.
// --------------------------------------------------------------------------

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  zap: Zap,
  search: Search,
  layout: Layout,
  smartphone: Smartphone,
  accessibility: Accessibility,
  shield: Shield,
  users: Users,
  credit: CreditCard,
  chart: BarChart3,
  bot: Bot,
  git: GitBranch,
};

function getIcon(key: string): LucideIcon {
  return ICONS[key] ?? Sparkles;
}

// --------------------------------------------------------------------------
//  Shared data types (mirror the translation JSON shape).
// --------------------------------------------------------------------------

export interface LandingData {
  metaTitle: string;
  metaDescription: string;
  hero: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };
  pillars: Array<{ icon: string; title: string; description: string }>;
  process: Array<{ step: string; title: string; description: string }>;
  useCases: Array<{ title: string; description: string }>;
  packages: Array<{
    name: string;
    price: string;
    subtitle: string;
    features: string[];
    featured: boolean;
  }>;
  faq: Array<{ question: string; answer: string }>;
}

export interface LandingSharedCopy {
  orbitLabel: string;
  primaryCta: string;
  secondaryCta: string;
  localScopeTitle: string;
  localScopeSubtitle: string;
  pillarsTitle: string;
  pillarsSubtitle: string;
  processTitle: string;
  processSubtitle: string;
  useCasesTitle: string;
  useCasesSubtitle: string;
  packagesTitle: string;
  packagesSubtitle: string;
  faqTitle: string;
  faqSubtitle: string;
  packageFeatured: string;
  packageStartingAt: string;
  packageCta: string;
}

interface SectionProps {
  data: LandingData;
  shared: LandingSharedCopy;
}

// ==========================================================================
//  HERO
// ==========================================================================

export function LandingHero({ data, shared }: SectionProps) {
  const locale = useLocale();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const titleEl = titleRef.current;
        if (!titleEl) return;

        // Word-level split (matches site pattern: inline-block masks + normal
        // text nodes so lines wrap properly).
        const text = titleEl.textContent || '';
        titleEl.innerHTML = '';
        titleEl.style.lineHeight = '1.12';
        titleEl.style.textAlign = 'center';

        const highlight = data.hero.titleHighlight;
        const words = text.split(' ');
        const wordEls: HTMLElement[] = [];

        words.forEach((word, i) => {
          const mask = document.createElement('span');
          mask.style.display = 'inline-block';
          mask.style.overflow = 'hidden';
          mask.style.verticalAlign = 'baseline';
          mask.style.paddingBottom = '0.18em';
          mask.style.marginBottom = '-0.12em';

          const inner = document.createElement('span');
          inner.style.display = 'inline-block';
          inner.style.willChange = 'transform';
          inner.textContent = word;

          if (word === highlight) {
            inner.classList.add('gradient-text');
          }

          mask.appendChild(inner);
          titleEl.appendChild(mask);
          wordEls.push(inner);

          if (i < words.length - 1) {
            titleEl.appendChild(document.createTextNode(' '));
          }
        });

        gsap.set(wordEls, { yPercent: 115, rotate: 4 });
        gsap.set(titleEl, { opacity: 1 });

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.fromTo(
          labelRef.current,
          { opacity: 0, x: -20, letterSpacing: '0.6em' },
          { opacity: 1, x: 0, letterSpacing: '0.4em', duration: 0.8, ease: 'power3.out' },
          0.2
        )
          .to(
            wordEls,
            { yPercent: 0, rotate: 0, duration: 0.95, stagger: 0.07 },
            '-=0.5'
          )
          .fromTo(
            subtitleRef.current,
            { opacity: 0, y: 24, filter: 'blur(8px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
            '-=0.4'
          )
          .fromTo(
            Array.from(ctaRef.current?.children || []),
            { opacity: 0, y: 24, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: 'back.out(1.6)',
            },
            '-=0.3'
          )
          .fromTo(
            Array.from(statsRef.current?.children || []),
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
            '-=0.4'
          );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [titleRef.current, subtitleRef.current, ctaRef.current, statsRef.current, labelRef.current],
          { opacity: 1 }
        );
      });

      return () => mm.revert();
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-32 pb-20"
    >
      {/* Ambient glow background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmin] h-[120vmin] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle, rgba(220,38,38,0.18) 0%, rgba(220,38,38,0.05) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span
            ref={labelRef}
            className="inline-block text-accent font-mono text-xs md:text-sm tracking-[0.4em] mb-8 opacity-0"
          >
            {data.hero.label}
          </span>

          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-8 leading-tight opacity-0"
          >
            {data.hero.title}
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12 opacity-0 leading-relaxed"
          >
            {data.hero.subtitle}
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button href={`/${locale}/contact`} size="lg" className="group">
              {shared.primaryCta}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button href="#packages" variant="secondary" size="lg">
              {shared.secondaryCta}
            </Button>
          </div>

          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto"
          >
            {[
              { v: data.hero.stat1Value, l: data.hero.stat1Label },
              { v: data.hero.stat2Value, l: data.hero.stat2Label },
              { v: data.hero.stat3Value, l: data.hero.stat3Label },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center border-l first:border-l-0 md:border-l-0 md:first:border-l-0 border-white/10 md:border-none px-2"
              >
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 tabular-nums">
                  {stat.v}
                </div>
                <div className="text-[10px] md:text-xs text-muted uppercase tracking-widest">
                  {stat.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================================================
//  PILLARS — grid of features with icons
// ==========================================================================

export function LandingPillars({ data, shared }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const gridItems = Array.from(gridRef.current?.children || []);

        // Initial hidden state — applied synchronously so there is no
        // flash of content before the ScrollTrigger fires.
        gsap.set(headerRef.current, { opacity: 0, y: 30 });
        gsap.set(gridItems, { opacity: 0, y: 40 });

        // Single timeline tied to the section trigger. Using one trigger
        // per section (instead of per-element) guarantees the grid plays
        // even when the user scrolls quickly past the inner container.
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8 })
          .to(
            gridItems,
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
            '-=0.4'
          );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([headerRef.current, ...Array.from(gridRef.current?.children || [])], {
          opacity: 1,
          y: 0,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-padding relative">
      <div className="container-custom">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {shared.pillarsTitle}
          </h2>
          <p className="text-lg text-muted">{shared.pillarsSubtitle}</p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {data.pillars.map((pillar, i) => {
            const Icon = getIcon(pillar.icon);
            return (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-white/10 bg-card/40 hover:border-accent/50 hover:bg-card/70 transition-all duration-300 will-change-transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================================================
//  PROCESS — horizontal timeline with numbered steps
// ==========================================================================

export function LandingProcess({ data, shared }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const steps = Array.from(timelineRef.current?.children || []);

        gsap.set(headerRef.current, { opacity: 0, y: 30 });
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(steps, { opacity: 0, y: 40 });

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8 })
          .to(
            lineRef.current,
            { scaleX: 1, duration: 1.4, ease: 'power2.inOut' },
            '-=0.4'
          )
          .to(
            steps,
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
            '-=1.0'
          );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [
            headerRef.current,
            ...Array.from(timelineRef.current?.children || []),
          ],
          { opacity: 1, y: 0 }
        );
        gsap.set(lineRef.current, { scaleX: 1 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-padding relative bg-card/20">
      <div className="container-custom">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {shared.processTitle}
          </h2>
          <p className="text-lg text-muted">{shared.processSubtitle}</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Horizontal connector line — desktop only */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-accent/0 via-accent/60 to-accent/0"
          />

          <div
            ref={timelineRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
          >
            {data.process.map((step, i) => (
              <div key={i} className="relative">
                <div className="flex flex-col items-start lg:items-center lg:text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-background border-2 border-accent/50 flex items-center justify-center relative z-10">
                      <span className="font-mono text-accent text-lg font-bold">
                        {step.step}
                      </span>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================================================
//  USE CASES — grid of industries
// ==========================================================================

export function LandingUseCases({ data, shared }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const gridItems = Array.from(gridRef.current?.children || []);

        gsap.set(headerRef.current, { opacity: 0, y: 30 });
        gsap.set(gridItems, { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8 }).to(
          gridItems,
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          '-=0.4'
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([headerRef.current, ...Array.from(gridRef.current?.children || [])], {
          opacity: 1,
          y: 0,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-padding relative">
      <div className="container-custom">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {shared.useCasesTitle}
          </h2>
          <p className="text-lg text-muted">{shared.useCasesSubtitle}</p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {data.useCases.map((useCase, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border border-white/10 hover:border-accent/40 bg-card/30 hover:bg-card/60 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center font-mono text-accent text-sm">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================================================
//  PACKAGES — 3-tier pricing
// ==========================================================================

export function LandingPackages({ data, shared }: SectionProps) {
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const gridItems = Array.from(gridRef.current?.children || []);

        gsap.set(headerRef.current, { opacity: 0, y: 30 });
        gsap.set(gridItems, { opacity: 0, y: 50 });

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8 }).to(
          gridItems,
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          '-=0.4'
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([headerRef.current, ...Array.from(gridRef.current?.children || [])], {
          opacity: 1,
          y: 0,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="packages"
      ref={sectionRef}
      className="section-padding relative bg-card/20 scroll-mt-20"
    >
      <div className="container-custom">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {shared.packagesTitle}
          </h2>
          <p className="text-lg text-muted">{shared.packagesSubtitle}</p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {data.packages.map((pkg, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                pkg.featured
                  ? 'bg-gradient-to-b from-accent/15 to-card/60 border-2 border-accent shadow-[0_0_40px_rgba(220,38,38,0.3)] md:-translate-y-4'
                  : 'bg-card/50 border border-white/10 hover:border-white/20'
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-current" />
                  {shared.packageFeatured}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {pkg.name}
                </h3>
                <p className="text-sm text-muted">{pkg.subtitle}</p>
              </div>

              <div className="mb-8">
                <div className="text-xs text-muted uppercase tracking-widest mb-1">
                  {shared.packageStartingAt}
                </div>
                <div
                  className={`text-4xl md:text-5xl font-bold ${
                    pkg.featured ? 'gradient-text' : 'text-foreground'
                  }`}
                >
                  {pkg.price}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                href={`/${locale}/contact`}
                variant={pkg.featured ? 'primary' : 'secondary'}
                size="md"
                className="w-full group"
              >
                {shared.packageCta}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================================================
//  FAQ — accordion
// ==========================================================================

export function LandingFAQ({ data, shared }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = Array.from(listRef.current?.children || []);

        gsap.set(headerRef.current, { opacity: 0, y: 30 });
        gsap.set(items, { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }).to(
          items,
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          '-=0.4'
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([headerRef.current, ...Array.from(listRef.current?.children || [])], {
          opacity: 1,
          y: 0,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-padding relative">
      <div className="container-custom">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {shared.faqTitle}
          </h2>
          <p className="text-lg text-muted">{shared.faqSubtitle}</p>
        </div>

        <div ref={listRef} className="max-w-3xl mx-auto space-y-3">
          {data.faq.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-accent/50 bg-card/70'
                    : 'border-white/10 bg-card/30 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg font-medium text-foreground">
                    {item.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      isOpen
                        ? 'bg-accent border-accent'
                        : 'border-white/20 bg-transparent'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-muted" />
                    )}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-400 ease-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-0 text-muted leading-relaxed text-sm md:text-base border-t border-white/5">
                    <p className="pt-4">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================================================
//  LOCAL SCOPE — cities served
// ==========================================================================

interface LocalScopeProps {
  title: string;
  subtitle: string;
  cities: string[];
}

export function LandingLocalScope({ title, subtitle, cities }: LocalScopeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const citiesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cities = Array.from(citiesRef.current?.children || []);

        gsap.set(headerRef.current, { opacity: 0, y: 30 });
        gsap.set(cities, { opacity: 0, y: 10, scale: 0.9 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.to(headerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }).to(
          cities,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.04,
            ease: 'back.out(1.5)',
          },
          '-=0.4'
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          [headerRef.current, ...Array.from(citiesRef.current?.children || [])],
          { opacity: 1, y: 0, scale: 1 }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-padding relative bg-card/20">
      <div className="container-custom">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-4 text-accent">
            <MapPin className="w-5 h-5" />
            <span className="font-mono text-xs tracking-[0.4em] uppercase">
              Local scope
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted">{subtitle}</p>
        </div>

        <div
          ref={citiesRef}
          className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto"
        >
          {cities.map((city, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full border border-white/15 bg-card/50 text-foreground/90 text-sm hover:border-accent/50 hover:bg-accent/10 transition-all"
            >
              {city}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
