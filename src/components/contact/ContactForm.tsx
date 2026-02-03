'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate form fields with staggered reveal
      fieldsRef.current.forEach((field, index) => {
        if (!field) return;

        const label = field.querySelector('label');
        const input = field.querySelector('input, select, textarea');
        const line = field.querySelector('.field-line');

        // Set initial states with null checks
        if (label) gsap.set(label, { opacity: 0, y: 20 });
        if (input) gsap.set(input, { opacity: 0, y: 20 });
        if (line) gsap.set(line, { scaleX: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: field,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });

        if (label) {
          tl.to(label, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            delay: index * 0.1,
          });
        }
        if (input) {
          tl.to(input, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
          }, '-=0.3');
        }
        if (line) {
          tl.to(line, {
            scaleX: 1,
            duration: 0.6,
            ease: 'power2.inOut',
          }, '-=0.3');
        }
      });

      // Magnetic button effect
      const button = buttonRef.current;
      if (button) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(button, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power3.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          });
        };

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);
      }
    }, formRef);

    return () => ctx.revert();
  }, []);

  // Animate success state
  useEffect(() => {
    if (isSubmitted && successRef.current) {
      const icon = successRef.current.querySelector('.success-icon');
      const title = successRef.current.querySelector('h3');
      const text = successRef.current.querySelector('p');
      const particles = successRef.current.querySelectorAll('.particle');

      gsap.set(successRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(icon, { scale: 0, rotation: -180 });
      gsap.set([title, text], { opacity: 0, y: 20 });
      gsap.set(particles, { scale: 0, opacity: 0 });

      const tl = gsap.timeline();

      tl.to(successRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      })
      .to(icon, {
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      }, '-=0.2')
      .to(particles, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(2)',
      }, '-=0.5')
      .to([title, text], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      }, '-=0.3');

      // Floating particles
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          y: 'random(-20, 20)',
          x: 'random(-20, 20)',
          rotation: 'random(-30, 30)',
          duration: 'random(2, 3)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.1,
        });
      });
    }
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Button animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
      });
    }

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
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
        className="bg-card rounded-3xl border border-card-border p-12 text-center relative overflow-hidden"
      >
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-3 h-3 bg-accent/30 rounded-full"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
          />
        ))}

        <div className="success-icon w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <CheckCircle className="w-12 h-12 text-accent" />
          <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
        </div>
        <h3 className="text-3xl font-bold text-foreground mb-4">
          {t('success')}
        </h3>
        <p className="text-muted text-lg">
          We&apos;ll get back to you soon!
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      <div
        ref={(el) => { fieldsRef.current[0] = el; }}
        className="grid sm:grid-cols-2 gap-8"
      >
        <div className="relative group">
          <label
            htmlFor="name"
            className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
              focusedField === 'name' ? 'text-accent' : 'text-foreground'
            }`}
          >
            {t('name')} <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            onFocus={() => handleFocus('name')}
            onBlur={handleBlur}
            className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-card-border text-foreground text-lg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors duration-300"
            placeholder="John Doe"
          />
          <div className="field-line absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left" />
        </div>
        <div className="relative group">
          <label
            htmlFor="email"
            className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
              focusedField === 'email' ? 'text-accent' : 'text-foreground'
            }`}
          >
            {t('email')} <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onFocus={() => handleFocus('email')}
            onBlur={handleBlur}
            className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-card-border text-foreground text-lg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors duration-300"
            placeholder="john@example.com"
          />
          <div className="field-line absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left" />
        </div>
      </div>

      <div
        ref={(el) => { fieldsRef.current[1] = el; }}
        className="grid sm:grid-cols-2 gap-8"
      >
        <div className="relative group">
          <label
            htmlFor="company"
            className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
              focusedField === 'company' ? 'text-accent' : 'text-foreground'
            }`}
          >
            {t('company')}
          </label>
          <input
            type="text"
            id="company"
            name="company"
            onFocus={() => handleFocus('company')}
            onBlur={handleBlur}
            className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-card-border text-foreground text-lg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors duration-300"
            placeholder="Your Company"
          />
          <div className="field-line absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left" />
        </div>
        <div className="relative group">
          <label
            htmlFor="projectType"
            className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
              focusedField === 'projectType' ? 'text-accent' : 'text-foreground'
            }`}
          >
            {t('projectType')} <span className="text-accent">*</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            onFocus={() => handleFocus('projectType')}
            onBlur={handleBlur}
            className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-card-border text-foreground text-lg focus:outline-none focus:border-accent transition-colors duration-300 cursor-pointer"
          >
            <option value="" className="bg-card">Select a type</option>
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value} className="bg-card">
                {type.label}
              </option>
            ))}
          </select>
          <div className="field-line absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left" />
        </div>
      </div>

      <div ref={(el) => { fieldsRef.current[2] = el; }} className="relative group">
        <label
          htmlFor="message"
          className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
            focusedField === 'message' ? 'text-accent' : 'text-foreground'
          }`}
        >
          {t('message')} <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          onFocus={() => handleFocus('message')}
          onBlur={handleBlur}
          className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-card-border text-foreground text-lg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors duration-300 resize-none"
          placeholder="Tell me about your project..."
        />
        <div className="field-line absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left" />
      </div>

      <div ref={(el) => { fieldsRef.current[3] = el; }} className="pt-4">
        <button
          ref={buttonRef}
          type="submit"
          disabled={isSubmitting}
          className="group relative px-12 py-5 bg-accent text-white font-medium text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 disabled:opacity-70"
        >
          <span className="relative z-10 flex items-center gap-3">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('sending')}
              </>
            ) : (
              <>
                {t('submit')}
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </span>
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>
    </form>
  );
}
