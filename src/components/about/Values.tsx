'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, RefreshCw, TrendingUp, Award } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';

gsap.registerPlugin(ScrollTrigger);

export function Values() {
  const t = useTranslations('about.values');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const values = [
    { key: 'teamwork', icon: Users },
    { key: 'adaptability', icon: RefreshCw },
    { key: 'improvement', icon: TrendingUp },
    { key: 'quality', icon: Award },
  ];

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

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Card entrance
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            rotateY: 20,
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
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
            scale: 1.05,
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
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container-custom relative">
        <div ref={titleRef}>
          <span className="text-accent font-mono text-sm mb-4 block text-center">CORE VALUES</span>
          <SectionTitle title={t('title')} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mt-12">
          {values.map((value, index) => (
            <div
              key={value.key}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group bg-card rounded-2xl border border-card-border p-4 md:p-6 text-center hover:border-accent/50 transition-colors duration-300 cursor-default"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <value.icon className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {t(value.key)}
                </h3>
                <p className="text-sm text-muted">
                  {t(`${value.key}Desc`)}
                </p>
              </div>

              {/* Index */}
              <div className="absolute top-4 right-4 text-xs font-mono text-muted/30 group-hover:text-accent/50 transition-colors">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
