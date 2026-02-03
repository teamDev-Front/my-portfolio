'use client';

import { useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe,
  ShoppingCart,
  Server,
  Bot,
  Palette,
  Megaphone,
  Lightbulb
} from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { key: 'websites', icon: Globe, color: 'from-blue-500/20 to-cyan-500/20' },
  { key: 'ecommerce', icon: ShoppingCart, color: 'from-green-500/20 to-emerald-500/20' },
  { key: 'saas', icon: Server, color: 'from-purple-500/20 to-violet-500/20' },
  { key: 'ai', icon: Bot, color: 'from-red-500/20 to-orange-500/20' },
  { key: 'design', icon: Palette, color: 'from-pink-500/20 to-rose-500/20' },
  { key: 'marketing', icon: Megaphone, color: 'from-yellow-500/20 to-amber-500/20' },
  { key: 'consulting', icon: Lightbulb, color: 'from-indigo-500/20 to-blue-500/20' },
];

export function ServicesPreview() {
  const t = useTranslations('services');
  const locale = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section number
      if (numberRef.current) {
        gsap.fromTo(
          numberRef.current,
          { opacity: 0, x: -100, rotateY: -90 },
          {
            opacity: 0.05,
            x: 0,
            rotateY: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Animate title
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3D Card animations
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Initial entrance with 3D rotation
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 100,
            rotateX: 45,
            rotateY: index % 2 === 0 ? -25 : 25,
            scale: 0.8,
            transformPerspective: 1000,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );

        // Parallax effect on scroll
        gsap.to(card, {
          y: (index % 3 - 1) * 30,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        // Hover effect with mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const mouseX = e.clientX - centerX;
          const mouseY = e.clientY - centerY;

          const rotateX = (mouseY / rect.height) * -20;
          const rotateY = (mouseX / rect.width) * 20;

          gsap.to(card, {
            rotateX,
            rotateY,
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 1000,
          });

          // Glow effect
          const glowX = (mouseX / rect.width) * 100 + 50;
          const glowY = (mouseY / rect.height) * 100 + 50;
          card.style.setProperty('--glow-x', `${glowX}%`);
          card.style.setProperty('--glow-y', `${glowY}%`);
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-hcs-dark relative overflow-hidden">
      {/* Large background number */}
      <div
        ref={numberRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 text-[20rem] md:text-[30rem] font-bold text-foreground pointer-events-none select-none"
        style={{ opacity: 0 }}
      >
        02
      </div>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container-custom relative">
        <div ref={titleRef}>
          <SectionTitle title={t('title')} subtitle={t('subtitle')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {services.map((service, index) => (
            <div
              key={service.key}
              ref={(el) => { cardsRef.current[index] = el; }}
              className={cn(
                'group relative p-6 bg-card rounded-2xl border border-card-border cursor-pointer',
                'hover:border-accent/50 transition-colors duration-300',
                'before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity',
                'hover:before:opacity-100',
              )}
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                // @ts-ignore
                '--glow-x': '50%',
                '--glow-y': '50%',
              }}
            >
              {/* Gradient glow on hover */}
              <div
                className={cn(
                  'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  `bg-gradient-radial ${service.color}`
                )}
                style={{
                  background: `radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(220, 38, 38, 0.15), transparent 50%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                <div
                  className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <service.icon className="w-7 h-7 text-accent" />
                </div>

                <h3
                  className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  {t(`${service.key}.title`)}
                </h3>

                <p
                  className="text-sm text-muted leading-relaxed"
                  style={{ transform: 'translateZ(15px)' }}
                >
                  {t(`${service.key}.description`)}
                </p>
              </div>

              {/* Index number */}
              <div
                className="absolute top-4 right-4 text-xs font-mono text-muted/30 group-hover:text-accent/50 transition-colors"
                style={{ transform: 'translateZ(40px)' }}
              >
                0{index + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button href={`/${locale}/services`} variant="outline" className="group">
            <span className="group-hover:translate-x-[-4px] transition-transform">
              {t('viewAll')}
            </span>
            <span className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-[-10px] transition-all">
              →
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
