'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Globe, ShoppingCart, Server, Bot, Palette, Megaphone, Check } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { key: 'websites', icon: Globe, id: 'websites', color: 'from-blue-500/20 to-cyan-500/20' },
  { key: 'ecommerce', icon: ShoppingCart, id: 'ecommerce', color: 'from-green-500/20 to-emerald-500/20' },
  { key: 'saas', icon: Server, id: 'saas', color: 'from-purple-500/20 to-violet-500/20' },
  { key: 'ai', icon: Bot, id: 'ai', color: 'from-orange-500/20 to-amber-500/20' },
  { key: 'design', icon: Palette, id: 'design', color: 'from-pink-500/20 to-rose-500/20' },
  { key: 'marketing', icon: Megaphone, id: 'marketing', color: 'from-red-500/20 to-accent/20' },
];

export function ServicesGrid() {
  const t = useTranslations('servicesPage');
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Progress bar animation
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 20%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        );
      }

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const isEven = index % 2 === 0;

        // Card entrance with 3D rotation
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isEven ? -80 : 80,
            rotateY: isEven ? -15 : 15,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Icon pop animation
        const icon = card.querySelector('.service-icon');
        if (icon) {
          gsap.fromTo(
            icon,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Features stagger
        const features = card.querySelectorAll('.feature-item');
        gsap.fromTo(
          features,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // 3D hover effect
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const mouseX = e.clientX - centerX;
          const mouseY = e.clientY - centerY;

          const rotateX = (mouseY / rect.height) * -8;
          const rotateY = (mouseX / rect.width) * 8;

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
    <section ref={sectionRef} className="section-padding relative">
      {/* Chapter progress indicator */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <div className="relative h-40 w-1 bg-card-border rounded-full">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent to-accent/50 rounded-full origin-top"
            style={{ height: '100%' }}
          />
        </div>
        <div className="mt-2 text-xs text-muted font-mono text-center">
          SCROLL
        </div>
      </div>

      <div className="container-custom">
        <div className="space-y-16 lg:space-y-24">
          {services.map((service, index) => (
            <div
              key={service.key}
              id={service.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="relative bg-card rounded-2xl border border-card-border p-8 lg:p-12 overflow-hidden"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Chapter number */}
              <div className="absolute top-4 right-4 lg:top-6 lg:right-6 text-6xl lg:text-8xl font-bold text-accent/5 font-mono">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

              <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div>
                  <div className="service-icon w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6 relative">
                    <service.icon className="w-8 h-8 text-accent" />
                    <div className="absolute inset-0 bg-accent/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <span className="text-accent font-mono text-xs mb-2 block">
                    SERVICE {String(index + 1).padStart(2, '0')}
                  </span>

                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    {t(`${service.key}.title`)}
                  </h2>

                  <p className="text-muted leading-relaxed">
                    {t(`${service.key}.description`)}
                  </p>
                </div>

                <div className="lg:pt-8">
                  <div className="text-xs font-mono text-accent mb-4">INCLUDES</div>
                  <ul className="space-y-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const feature = t(`${service.key}.features.${i}`);
                      if (!feature || feature.includes('.features.')) return null;
                      return (
                        <li key={i} className="feature-item flex items-start gap-3">
                          <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-accent" />
                          </div>
                          <span className="text-foreground">{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
