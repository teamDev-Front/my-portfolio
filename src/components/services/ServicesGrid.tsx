'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Globe, ShoppingCart, Server, Bot, Palette, Megaphone, Check, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { key: 'websites', icon: Globe, id: 'websites', gradient: 'from-blue-500 to-cyan-400' },
  { key: 'ecommerce', icon: ShoppingCart, id: 'ecommerce', gradient: 'from-green-500 to-emerald-400' },
  { key: 'saas', icon: Server, id: 'saas', gradient: 'from-purple-500 to-violet-400' },
  { key: 'ai', icon: Bot, id: 'ai', gradient: 'from-orange-500 to-amber-400' },
  { key: 'design', icon: Palette, id: 'design', gradient: 'from-pink-500 to-rose-400' },
  { key: 'marketing', icon: Megaphone, id: 'marketing', gradient: 'from-red-500 to-accent' },
];

export function ServicesGrid() {
  const t = useTranslations('servicesPage');
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!horizontalRef.current || !cardsRef.current) return;

      const cards = cardsRef.current.children;
      const totalWidth = cardsRef.current.scrollWidth - window.innerWidth + 200;

      // Horizontal scroll animation
      const horizontalScroll = gsap.to(cardsRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Individual card animations as they come into view
      Array.from(cards).forEach((card, index) => {
        const cardEl = card as HTMLElement;
        const inner = cardEl.querySelector('.card-inner');
        const icon = cardEl.querySelector('.card-icon');
        const title = cardEl.querySelector('.card-title');
        const desc = cardEl.querySelector('.card-desc');
        const features = cardEl.querySelectorAll('.card-feature');
        const number = cardEl.querySelector('.card-number');
        const line = cardEl.querySelector('.card-line');

        // Set initial states (with null checks)
        if (inner) gsap.set(inner, { rotateY: -15, scale: 0.9, opacity: 0.5 });
        if (icon) gsap.set(icon, { scale: 0, rotation: -180 });
        if (title) gsap.set(title, { opacity: 0, y: 30 });
        if (desc) gsap.set(desc, { opacity: 0, y: 30 });
        if (features.length) gsap.set(features, { opacity: 0, x: -20 });
        if (number) gsap.set(number, { opacity: 0, scale: 0.5 });
        if (line) gsap.set(line, { scaleX: 0 });

        // Create timeline for each card
        const cardTL = gsap.timeline({
          scrollTrigger: {
            trigger: cardEl,
            containerAnimation: horizontalScroll,
            start: 'left 80%',
            end: 'left 30%',
            scrub: 1,
          },
        });

        cardTL
          .to(inner, { rotateY: 0, scale: 1, opacity: 1, duration: 0.5 })
          .to(number, { opacity: 1, scale: 1, duration: 0.3 }, '-=0.3')
          .to(line, { scaleX: 1, duration: 0.4 }, '-=0.2')
          .to(icon, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.3')
          .to(title, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
          .to(desc, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
          .to(features, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05 }, '-=0.2');
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* Horizontal Scroll Section */}
      <section ref={horizontalRef} className="relative bg-hcs-dark overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_70%)]" />

        {/* Progress indicator */}
        <div className="fixed top-1/2 left-8 -translate-y-1/2 z-50 hidden lg:block">
          <div className="flex flex-col items-center gap-2">
            {services.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-accent/30 transition-all duration-300"
                style={{ opacity: 0.3 }}
              />
            ))}
          </div>
        </div>

        <div
          ref={cardsRef}
          className="flex gap-4 md:gap-8 px-[5vw] md:px-[10vw] py-12 md:py-20 min-h-screen items-center"
          style={{ width: 'fit-content' }}
        >
          {services.map((service, index) => (
            <div
              key={service.key}
              id={service.id}
              className="w-[85vw] md:w-[60vw] lg:w-[45vw] flex-shrink-0"
              style={{ perspective: '1500px' }}
            >
              <div
                className="card-inner relative bg-card/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-card-border p-5 md:p-8 lg:p-12 h-full"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Large number background */}
                <div className="card-number absolute top-4 right-4 text-[6rem] md:text-[12rem] font-bold text-accent/5 leading-none pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Gradient line */}
                <div className={`card-line absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} rounded-t-3xl origin-left`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`card-icon w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-8 shadow-lg`}>
                    <service.icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Service label */}
                  <span className="text-accent font-mono text-xs tracking-widest mb-4 block">
                    SERVICE {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <h2 className="card-title text-3xl lg:text-4xl font-bold text-foreground mb-4">
                    {t(`${service.key}.title`)}
                  </h2>

                  {/* Description */}
                  <p className="card-desc text-muted text-lg leading-relaxed mb-8 max-w-lg">
                    {t(`${service.key}.description`)}
                  </p>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-accent mb-3">WHAT&apos;S INCLUDED</div>
                    {[0, 1, 2, 3].map((i) => {
                      const feature = t(`${service.key}.features.${i}`);
                      if (!feature || feature.includes('.features.')) return null;
                      return (
                        <div key={i} className="card-feature flex items-center gap-3 group">
                          <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <Check className="w-3 h-3 text-accent" />
                          </div>
                          <span className="text-foreground group-hover:text-accent transition-colors">
                            {feature}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA */}
                  <div className="mt-10">
                    <button className="group flex items-center gap-2 text-accent font-medium hover:gap-4 transition-all">
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* End card */}
          <div className="w-[50vw] flex-shrink-0 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-foreground mb-4">Ready to Start?</h3>
              <p className="text-muted mb-8">Let&apos;s build something amazing together</p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-xl font-medium hover:bg-accent/90 transition-colors"
              >
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
