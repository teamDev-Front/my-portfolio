'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface Particle {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

interface LogoParticlesProps {
  logoPath?: string;
  onReady?: () => void;
}

export function LogoParticles({
  logoPath = '/images/hcs-logo.png',
  onReady,
}: LogoParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const isReadyRef = useRef(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const initParticles = useCallback(async () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    // Load and process logo
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const logoScale = isMobile ? 0.7 : 0.45;
      const maxWidth = isMobile ? 320 : 500;
      const logoWidth = Math.min(rect.width * logoScale, maxWidth);
      const logoHeight = (logoWidth / img.width) * img.height;

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCanvas.width = Math.ceil(logoWidth);
      tempCanvas.height = Math.ceil(logoHeight);
      tempCtx.drawImage(img, 0, 0, logoWidth, logoHeight);

      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const pixels = imageData.data;

      const offsetX = (rect.width - logoWidth) / 2;
      const offsetY = (rect.height - logoHeight) / 2;

      // Particle sampling - larger step = fewer particles = better performance
      const step = isMobile ? 3 : 2;
      const particles: Particle[] = [];

      for (let y = 0; y < tempCanvas.height; y += step) {
        for (let x = 0; x < tempCanvas.width; x += step) {
          const i = (Math.floor(y) * tempCanvas.width + Math.floor(x)) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a > 50) {
            const px = offsetX + x;
            const py = offsetY + y;

            particles.push({
              x: px,
              y: py,
              ox: px,
              oy: py,
              vx: 0,
              vy: 0,
              color: `rgb(${r}, ${g}, ${b})`,
              size: isMobile ? 2 : 2.5,
              alpha: a / 255,
            });
          }
        }
      }

      particlesRef.current = particles;
      console.log(`Logo particles created: ${particles.length}`);

      // Entrance animation with GSAP
      gsap.fromTo(
        particles,
        {
          alpha: 0,
        },
        {
          alpha: (i) => pixels[(Math.floor(particles[i].oy - offsetY) * tempCanvas.width + Math.floor(particles[i].ox - offsetX)) * 4 + 3] / 255,
          duration: 1.5,
          stagger: {
            each: 0.0005,
            from: 'center',
          },
          ease: 'power2.out',
          onComplete: () => {
            if (!isReadyRef.current) {
              isReadyRef.current = true;
              onReady?.();
            }
          },
        }
      );

      startAnimation(rect.width, rect.height);
    };

    img.onerror = () => {
      console.error('Failed to load logo:', logoPath);
      onReady?.();
    };

    img.src = logoPath;
  }, [logoPath, isMobile, onReady]);

  const startAnimation = useCallback((width: number, height: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const distortionRadius = isMobile ? 60 : 100;
    const distortionRadiusSq = distortionRadius * distortionRadius;
    const forceStrength = 0.15;
    const maxDisplacement = isMobile ? 30 : 50;
    const friction = 0.9;
    const returnSpeed = 0.08;

    const animate = () => {
      if (!ctx) return;

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse interaction
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < distortionRadiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / distortionRadius) * forceStrength * distortionRadius;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        // Apply friction and return force
        p.vx *= friction;
        p.vy *= friction;
        p.vx += (p.ox - p.x) * returnSpeed;
        p.vy += (p.oy - p.y) * returnSpeed;

        // Clamp velocity
        const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (vel > maxDisplacement) {
          const scale = maxDisplacement / vel;
          p.vx *= scale;
          p.vy *= scale;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        if (p.alpha > 0.01) {
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [isMobile]);

  useEffect(() => {
    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.touches[0].clientX - rect.left;
        mouseRef.current.y = e.touches[0].clientY - rect.top;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [initParticles]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10"
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
