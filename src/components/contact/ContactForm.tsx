'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate form fields on scroll
      fieldsRef.current.forEach((field, index) => {
        if (!field) return;

        gsap.fromTo(
          field,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: field,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  // Animate success state
  useEffect(() => {
    if (isSubmitted && successRef.current) {
      gsap.fromTo(
        successRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }
      );

      // Animate the icon
      const icon = successRef.current.querySelector('.success-icon');
      if (icon) {
        gsap.fromTo(
          icon,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.3,
          }
        );
      }
    }
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Animate button
    const button = formRef.current?.querySelector('button[type="submit"]');
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const projectTypes = [
    { value: 'website', label: t('projectTypes.website') },
    { value: 'ecommerce', label: t('projectTypes.ecommerce') },
    { value: 'saas', label: t('projectTypes.saas') },
    { value: 'landing', label: t('projectTypes.landing') },
    { value: 'consulting', label: t('projectTypes.consulting') },
    { value: 'other', label: t('projectTypes.other') },
  ];

  if (isSubmitted) {
    return (
      <div
        ref={successRef}
        className="bg-card rounded-2xl border border-card-border p-8 text-center"
      >
        <div className="success-icon w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">
          {t('success')}
        </h3>
        <p className="text-muted">
          We&apos;ll get back to you soon!
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div
        ref={(el) => { fieldsRef.current[0] = el; }}
        className="grid sm:grid-cols-2 gap-6"
      >
        <div className="group">
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            {t('name')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-lg focus:shadow-accent/10 transition-all duration-300"
          />
        </div>
        <div className="group">
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            {t('email')} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-lg focus:shadow-accent/10 transition-all duration-300"
          />
        </div>
      </div>

      <div
        ref={(el) => { fieldsRef.current[1] = el; }}
        className="grid sm:grid-cols-2 gap-6"
      >
        <div className="group">
          <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
            {t('company')}
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-lg focus:shadow-accent/10 transition-all duration-300"
          />
        </div>
        <div className="group">
          <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">
            {t('projectType')} *
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground focus:outline-none focus:border-accent focus:shadow-lg focus:shadow-accent/10 transition-all duration-300"
          >
            <option value="">--</option>
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div ref={(el) => { fieldsRef.current[2] = el; }}>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          {t('message')} *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-lg focus:shadow-accent/10 transition-all duration-300 resize-none"
        />
      </div>

      <div ref={(el) => { fieldsRef.current[3] = el; }}>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto group"
        >
          {isSubmitting ? t('sending') : t('submit')}
          <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </form>
  );
}
