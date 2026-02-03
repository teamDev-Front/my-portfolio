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

gsap.registerPlugin(ScrollTrigger);

const services = [
  { key: 'websites', icon: Globe },
  { key: 'ecommerce', icon: ShoppingCart },
  { key: 'saas', icon: Server },
  { key: 'ai', icon: Bot },
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section number
      if (numberRef.current) {
        gsap.fromTo(
          numberRef.current,
          { opacity: 0, x: -100 },
          {
            opacity: 0.05,
            x: 0,
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

      // Cards animation - staggered entrance without parallax offset
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Entrance animation
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.08,
          }
        );

        // Hover 3D effect
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const mouseX = e.clientX - centerX;
          const mouseY = e.clientY - centerY;

          const rotateX = (mouseY / rect.height) * -15;
          const rotateY = (mouseX / rect.width) * 15;

          gsap.to(card, {
            rotateX,
            rotateY,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          });
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
          <span className="text-accent font-mono text-sm mb-4 block text-center">02 / SERVICES</span>
          <SectionTitle title={t('title')} subtitle={t('subtitle')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {services.map((service, index) => (
            <div
              key={service.key}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group relative p-6 bg-card rounded-2xl border border-card-border cursor-pointer hover:border-accent/50 transition-colors duration-300"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
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
              </div>

              {/* Index number */}
              <div className="absolute top-4 right-4 text-xs font-mono text-muted/30 group-hover:text-accent/50 transition-colors">
                0{index + 1}
              </div>
            </div>
          ))}
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
