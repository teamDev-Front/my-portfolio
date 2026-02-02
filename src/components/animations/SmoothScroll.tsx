'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate all sections on scroll
      const sections = document.querySelectorAll('section');

      sections.forEach((section) => {
        // Find elements to animate within each section
        const headings = section.querySelectorAll('h1, h2, h3');
        const paragraphs = section.querySelectorAll('p');
        const cards = section.querySelectorAll('[class*="card"], [class*="Card"]');
        const buttons = section.querySelectorAll('button, a[class*="btn"], a[class*="Button"]');

        // Animate headings
        headings.forEach((heading) => {
          gsap.fromTo(
            heading,
            {
              opacity: 0,
              y: 60,
              skewY: 3,
            },
            {
              opacity: 1,
              y: 0,
              skewY: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });

        // Animate paragraphs with stagger
        if (paragraphs.length > 0) {
          gsap.fromTo(
            paragraphs,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: paragraphs[0],
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        // Animate cards with stagger
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              y: 50,
              scale: 0.95,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: cards[0],
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });

      // Parallax effect for images
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        gsap.to(img, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      // Horizontal line reveals
      const lines = document.querySelectorAll('[class*="border-b"], [class*="border-t"], hr');
      lines.forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
