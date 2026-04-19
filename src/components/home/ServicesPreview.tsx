'use client';

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe,
  ShoppingCart,
  Server,
  Bot,
  Palette,
  Megaphone,
  Lightbulb,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { getPathname } from '@/i18n/navigation';
import type { StaticPathname, Locale } from '@/i18n/routing';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Services shown on the home preview. `landingRoute` opts a card into
 * linking to its dedicated SEO landing page (key internal link for
 * indexing `/criar-site`, `/criar-saas`, `/automacao-com-ia`).
 */
const services: Array<{
  key: string;
  icon: typeof Globe;
  landingRoute?: StaticPathname;
}> = [
  { key: 'websites', icon: Globe, landingRoute: '/create-website' },
  { key: 'ecommerce', icon: ShoppingCart },
  { key: 'saas', icon: Server, landingRoute: '/create-saas' },
  { key: 'ai', icon: Bot, landingRoute: '/ai-automation' },
  { key: 'design', icon: Palette },
  { key: 'marketing', icon: Megaphone },
  { key: 'consulting', icon: Lightbulb },
];

export function ServicesPreview() {
  const t = useTranslations('services');
  const locale = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numberRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          isTouch: '(max-width: 1023px), (pointer: coarse)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isTouch: boolean;
            reduceMotion: boolean;
          };

          // Background number - scroll parallax
          if (numberRef.current && !reduceMotion) {
            gsap.fromTo(
              numberRef.current,
              { opacity: 0, x: -100, scale: 0.85 },
              {
                opacity: 0.05,
                x: 0,
                scale: 1,
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: 'top 80%',
                  toggleActions: 'play none none reverse',
                },
              }
            );

            gsap.to(numberRef.current, {
              y: -60,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            });
          }

          // Title animation
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: titleRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

          if (reduceMotion) {
            gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
            return;
          }

          // Set starting state
          gsap.set(cards, { opacity: 0, y: 80, scale: 0.92, rotateX: -25 });

          // ScrollTrigger.batch for wave-like entrance
          ScrollTrigger.batch(cards, {
            interval: 0.08,
            batchMax: 4,
            start: 'top 88%',
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 0.85,
                stagger: 0.12,
                ease: 'back.out(1.4)',
                overwrite: true,
              }),
            onLeaveBack: (batch) =>
              gsap.to(batch, {
                opacity: 0,
                y: 80,
                scale: 0.92,
                rotateX: -25,
                duration: 0.5,
                stagger: 0.05,
                ease: 'power2.in',
                overwrite: true,
              }),
          });

          // 3D hover - desktop only
          if (!isDesktop || !contextSafe) return;

          const cleanups: Array<() => void> = [];

          cards.forEach((card) => {
            const rotX = gsap.quickTo(card, 'rotateX', {
              duration: 0.5,
              ease: 'power3.out',
            });
            const rotY = gsap.quickTo(card, 'rotateY', {
              duration: 0.5,
              ease: 'power3.out',
            });

            const onMove = contextSafe((e: MouseEvent) => {
              const rect = card.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              rotX(-y * 12);
              rotY(x * 12);
            });

            const onEnter = contextSafe(() =>
              gsap.to(card, { scale: 1.03, duration: 0.4, ease: 'power3.out' })
            );

            const onLeave = contextSafe(() => {
              rotX(0);
              rotY(0);
              gsap.to(card, {
                scale: 1,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)',
              });
            });

            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseenter', onEnter);
            card.addEventListener('mouseleave', onLeave);

            cleanups.push(() => {
              card.removeEventListener('mousemove', onMove);
              card.removeEventListener('mouseenter', onEnter);
              card.removeEventListener('mouseleave', onLeave);
            });
          });

          return () => cleanups.forEach((c) => c());
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-padding bg-hcs-dark relative overflow-hidden">
      <div
        ref={numberRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 text-[20rem] md:text-[30rem] font-bold text-foreground pointer-events-none select-none will-change-transform"
        style={{ opacity: 0 }}
      >
        02
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container-custom relative">
        <div ref={titleRef}>
          <span className="text-accent font-mono text-sm mb-4 block text-center">
            02 / SERVICES
          </span>
          <SectionTitle title={t('title')} subtitle={t('subtitle')} />
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12"
          style={{ perspective: '1200px' }}
        >
          {services.map((service, index) => {
            // Resolve localised href for services that have a landing page
            const landingHref = service.landingRoute
              ? `/${locale}${getPathname({
                  href: service.landingRoute,
                  locale: locale as Locale,
                })}`
              : null;

            return (
              <div
                key={service.key}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="group relative p-6 bg-card rounded-2xl border border-card-border cursor-pointer hover:border-accent/50 transition-colors duration-300 will-change-transform"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-7 h-7 text-accent" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {t(`${service.key}.title`)}
                  </h3>

                  <p className="text-sm text-muted leading-relaxed">
                    {t(`${service.key}.description`)}
                  </p>

                  {landingHref && (
                    <Link
                      href={landingHref}
                      className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-accent/80 hover:text-accent transition-colors"
                    >
                      <span className="tracking-wide uppercase">
                        {t('learnMore')}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  )}
                </div>

                <div className="absolute top-4 right-4 text-xs font-mono text-muted/30 group-hover:text-accent/50 transition-colors">
                  0{index + 1}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Button href={`/${locale}/services`} variant="outline" className="group">
            <span>{t('viewAll')}</span>
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
