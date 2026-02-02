'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Shape {
  id: number;
  type: 'circle' | 'ring' | 'heart' | 'diamond';
  size: number;
  x: number;
  y: number;
  delay: number;
}

const shapes: Shape[] = [
  { id: 1, type: 'ring', size: 80, x: 10, y: 20, delay: 0 },
  { id: 2, type: 'circle', size: 12, x: 85, y: 15, delay: 0.2 },
  { id: 3, type: 'heart', size: 40, x: 90, y: 60, delay: 0.4 },
  { id: 4, type: 'diamond', size: 24, x: 5, y: 70, delay: 0.6 },
  { id: 5, type: 'ring', size: 50, x: 75, y: 80, delay: 0.8 },
  { id: 6, type: 'circle', size: 8, x: 20, y: 85, delay: 1 },
  { id: 7, type: 'heart', size: 24, x: 65, y: 25, delay: 1.2 },
  { id: 8, type: 'diamond', size: 16, x: 40, y: 90, delay: 1.4 },
];

export function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation
      shapeRefs.current.forEach((shape, i) => {
        if (!shape) return;

        // Fade in
        gsap.fromTo(
          shape,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: shapes[i].delay,
            ease: 'elastic.out(1, 0.5)',
          }
        );

        // Floating animation
        gsap.to(shape, {
          y: 'random(-20, 20)',
          x: 'random(-10, 10)',
          rotation: 'random(-15, 15)',
          duration: 'random(3, 5)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: shapes[i].delay + 1,
        });
      });
    }, containerRef);

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (clientY / window.innerHeight - 0.5) * 2;

      shapeRefs.current.forEach((shape, i) => {
        if (!shape) return;
        const depth = (i + 1) * 10;
        gsap.to(shape, {
          x: xPercent * depth,
          y: yPercent * depth,
          duration: 1,
          ease: 'power2.out',
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const renderShape = (shape: Shape) => {
    switch (shape.type) {
      case 'circle':
        return (
          <div
            className="rounded-full bg-accent"
            style={{ width: shape.size, height: shape.size }}
          />
        );
      case 'ring':
        return (
          <div
            className="rounded-full border-2 border-accent/30"
            style={{ width: shape.size, height: shape.size }}
          />
        );
      case 'heart':
        return (
          <svg
            width={shape.size}
            height={shape.size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-accent/40"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case 'diamond':
        return (
          <div
            className="bg-accent/20 rotate-45"
            style={{ width: shape.size, height: shape.size }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {shapes.map((shape, index) => (
        <div
          key={shape.id}
          ref={(el) => { shapeRefs.current[index] = el; }}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            opacity: 0,
          }}
        >
          {renderShape(shape)}
        </div>
      ))}
    </div>
  );
}
