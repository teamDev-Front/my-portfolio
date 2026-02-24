'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Scale, Building2, HeartPulse, ShoppingBag, Rocket, Briefcase } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '@/components/ui/SectionTitle';

gsap.registerPlugin(ScrollTrigger);

const industries = [
  { icon: Scale, index: 0 },
  { icon: Building2, index: 1 },
  { icon: HeartPulse, index: 2 },
  { icon: ShoppingBag, index: 3 },
  { icon: Rocket, index: 4 },
  { icon: Briefcase, index: 5 },
];

export function Industries() {
  const t = useTranslations('servicesPage.industries');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
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

      // Cards animation with wave effect
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Staggered entrance with scale
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 40,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );

        // 3D hover effect
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
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out',
          });

          // Glow effect
          const glow = card.querySelector('.card-glow');
          if (glow) {
            gsap.to(glow, {
              opacity: 1,
              duration: 0.3,
            });
          }
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          });

          const glow = card.querySelector('.card-glow');
          if (glow) {
            gsap.to(glow, {
              opacity: 0,
              duration: 0.3,
            });
          }
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-hcs-dark relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div ref={titleRef}>
          <span className="text-accent font-mono text-sm mb-4 block text-center">INDUSTRIES</span>
          <SectionTitle title={t('title')} subtitle={t('subtitle')} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mt-12">
          {industries.map((item, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="relative bg-card rounded-xl border border-card-border p-4 md:p-6 text-center cursor-default group"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '500px',
              }}
            >
              {/* Glow effect */}
              <div className="card-glow absolute inset-0 rounded-xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 transition-opacity" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <p className="text-sm text-foreground group-hover:text-accent transition-colors">
                  {t(`list.${item.index}`)}
                </p>
              </div>

              {/* Index badge */}
              <div className="absolute top-2 right-2 text-[10px] font-mono text-muted/30 group-hover:text-accent/50 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
