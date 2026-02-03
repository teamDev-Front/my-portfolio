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
  eaten: boolean;
  eatenAlpha: number;
  respawnTime: number;
}

interface VortexData {
  x: number;
  y: number;
  radius: number;
  pullStrength: number;
}

interface LogoParticlesProps {
  logoPath?: string;
  onReady?: () => void;
}

export function LogoParticles({
  logoPath = '/images/hcs-logo.svg',
  onReady,
}: LogoParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const isReadyRef = useRef(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const vortexesRef = useRef<VortexData[]>([]);
  const timeRef = useRef(0);
  const canvasRectRef = useRef<DOMRect | null>(null);

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
    canvasRectRef.current = rect;

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
              eaten: false,
              eatenAlpha: 1,
              respawnTime: 0,
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
    const vortexPullRadius = isMobile ? 200 : 300;
    const vortexEatRadius = 40;

    const animate = () => {
      if (!ctx) return;

      timeRef.current += 0.016; // ~60fps
      const time = timeRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const vortexes = vortexesRef.current;
      const canvasRect = canvasRectRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Handle respawning
        if (p.eaten && p.respawnTime > 0 && time >= p.respawnTime) {
          p.eaten = false;
          p.respawnTime = 0;
          p.x = p.ox;
          p.y = p.oy;
          p.vx = 0;
          p.vy = 0;
          // Fade back in
          gsap.to(p, {
            eatenAlpha: 1,
            duration: 2,
            ease: 'power2.out',
          });
        }

        // Skip fully eaten particles
        if (p.eaten && p.eatenAlpha <= 0) continue;

        // Vortex interaction
        if (vortexes.length > 0 && canvasRect) {
          for (const vortex of vortexes) {
            // Convert vortex position to logo canvas coordinates
            const localVortexX = vortex.x - canvasRect.left;
            const localVortexY = vortex.y - canvasRect.top;

            const dx = localVortexX - p.x;
            const dy = localVortexY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < vortexPullRadius && !p.eaten) {
              // Pull force - stronger as particle gets closer
              const pullForce = (1 - dist / vortexPullRadius) * vortex.pullStrength * 8;
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * pullForce;
              p.vy += Math.sin(angle) * pullForce;

              // If very close, eat the particle
              if (dist < vortexEatRadius) {
                p.eaten = true;
                p.respawnTime = time + 6 + Math.random() * 4; // Respawn after 6-10 seconds
                gsap.to(p, {
                  x: localVortexX,
                  y: localVortexY,
                  eatenAlpha: 0,
                  duration: 0.5,
                  ease: 'power2.in',
                });
              }
            }
          }
        }

        // Mouse interaction (push away)
        if (mouse.active && !p.eaten) {
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

        // Apply friction and return force (only for non-eaten particles)
        if (!p.eaten) {
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
        }

        // Draw particle
        const drawAlpha = p.alpha * p.eatenAlpha;
        if (drawAlpha > 0.01) {
          ctx.globalAlpha = drawAlpha;
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

    // Listen for vortex updates from CosmicBackground
    const handleVortexUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ vortexes: VortexData[] }>;
      vortexesRef.current = customEvent.detail.vortexes;
    };

    // Clear vortexes when no updates received
    const clearVortexesInterval = setInterval(() => {
      // Fade out vortexes if no recent update (they should be continuously sent when active)
      if (vortexesRef.current.length > 0) {
        vortexesRef.current = [];
      }
    }, 200);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd);
    }

    window.addEventListener('vortexUpdate', handleVortexUpdate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(clearVortexesInterval);
      window.removeEventListener('vortexUpdate', handleVortexUpdate);
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
