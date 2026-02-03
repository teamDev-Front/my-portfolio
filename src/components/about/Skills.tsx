'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { skills } from '@/lib/data/timeline';

gsap.registerPlugin(ScrollTrigger);

export function Skills() {
  const t = useTranslations('about.skills');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const skillCategories = [
    { key: 'frontend', label: t('frontend'), items: skills.frontend },
    { key: 'backend', label: t('backend'), items: skills.backend },
    { key: 'databases', label: 'Databases', items: skills.databases },
    { key: 'tools', label: t('tools'), items: skills.tools },
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
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );

        // Skill tags stagger animation
        const skillTags = card.querySelectorAll('.skill-tag');
        gsap.fromTo(
          skillTags,
          {
            opacity: 0,
            scale: 0,
            y: 20,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.2 + index * 0.1,
          }
        );

        // Hover effect
        const handleMouseEnter = () => {
          gsap.to(card, {
            y: -5,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div ref={titleRef}>
          <span className="text-accent font-mono text-sm mb-4 block text-center">TECH STACK</span>
          <SectionTitle title={t('title')} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {skillCategories.map((category, index) => (
            <div
              key={category.key}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="bg-card rounded-2xl border border-card-border p-6 hover:border-accent/50 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold text-accent mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                {category.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="skill-tag px-3 py-1.5 bg-hcs-gray rounded-lg text-sm text-foreground hover:bg-accent/20 hover:text-accent transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
