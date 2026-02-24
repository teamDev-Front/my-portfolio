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

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  strength: number;
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

  // Mobile-specific refs
  const gyroRef = useRef({ x: 0, y: 0 });
  const ripplesRef = useRef<Ripple[]>([]);
  const gyroPermissionRequestedRef = useRef(false);
  const lastShakeRef = useRef(0);

  const [isMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Request gyroscope permission (iOS 13+ requires user gesture)
  const requestGyroPermission = useCallback(() => {
    if (gyroPermissionRequestedRef.current) return;
    gyroPermissionRequestedRef.current = true;

    try {
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DOE.requestPermission === 'function') {
        DOE.requestPermission().catch(() => {
          // Permission denied - gyroscope won't work, but other effects will
        });
      }
    } catch {
      // DeviceOrientationEvent not available
    }
  }, []);

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

      // Particle sampling - smaller step = more particles = sharper logo
      const step = 2;
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
              size: isMobile ? 1.8 : 2.5,
              alpha: a / 255,
            });
          }
        }
      }

      particlesRef.current = particles;

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
      const time = performance.now() * 0.001;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Clean up expired ripples (mobile)
      if (isMobile) {
        ripplesRef.current = ripplesRef.current.filter(
          (r) => time - r.startTime < 1.2
        );
      }

      const activeRipples = ripplesRef.current;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Calculate dynamic home position
        let homeX = p.ox;
        let homeY = p.oy;

        if (isMobile) {
          // --- GYROSCOPE PARALLAX ---
          // Particles shift based on phone tilt (like a snow globe)
          const gyro = gyroRef.current;
          homeX += gyro.x * 20;
          homeY += gyro.y * 15;

          // --- AUTO-BREATHING WAVE ---
          // Subtle sine wave ripples through particles, keeping logo sharp but alive
          const waveOffsetX =
            Math.sin(time * 0.8 + p.oy * 0.012 + p.ox * 0.005) * 1.5;
          const waveOffsetY =
            Math.cos(time * 0.6 + p.ox * 0.012 + p.oy * 0.005) * 1.5;
          homeX += waveOffsetX;
          homeY += waveOffsetY;

          // --- TAP RIPPLE EFFECT ---
          // Expanding ring pushes particles outward from tap point
          for (let r = 0; r < activeRipples.length; r++) {
            const ripple = activeRipples[r];
            const elapsed = time - ripple.startTime;
            const rippleRadius = elapsed * 280;
            const ringWidth = 50;
            const fadeFactor = Math.max(0, 1 - elapsed / 1.2);

            const dx = p.x - ripple.x;
            const dy = p.y - ripple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const distFromRing = Math.abs(dist - rippleRadius);
            if (distFromRing < ringWidth && dist > 1) {
              const ringForce =
                (1 - distFromRing / ringWidth) *
                ripple.strength *
                fadeFactor;
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * ringForce;
              p.vy += Math.sin(angle) * ringForce;
            }
          }
        } else {
          // --- DESKTOP: Mouse interaction ---
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < distortionRadiusSq && distSq > 1) {
              const dist = Math.sqrt(distSq);
              const force =
                (1 - dist / distortionRadius) *
                forceStrength *
                distortionRadius;
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * force;
              p.vy += Math.sin(angle) * force;
            }
          }
        }

        // Apply friction and return force (toward dynamic home position)
        p.vx *= friction;
        p.vy *= friction;
        p.vx += (homeX - p.x) * returnSpeed;
        p.vy += (homeY - p.y) * returnSpeed;

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

    // --- DESKTOP: Mouse handlers ---
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

    // --- MOBILE: Touch handlers ---
    const handleTouchStart = (e: TouchEvent) => {
      if (!isMobile) return;

      // Request gyroscope permission on first touch (iOS 13+ needs user gesture)
      if (!gyroPermissionRequestedRef.current) {
        requestGyroPermission();
      }

      // Create ripple at tap point
      if (e.touches.length > 0) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        ripplesRef.current.push({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          startTime: performance.now() * 0.001,
          strength: 6,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      if (isMobile) {
        // Create trail ripples along drag path (throttled)
        const now = performance.now() * 0.001;
        const lastRipple = ripplesRef.current[ripplesRef.current.length - 1];
        if (!lastRipple || now - lastRipple.startTime > 0.06) {
          ripplesRef.current.push({
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
            startTime: now,
            strength: 3,
          });
          // Prevent memory buildup
          if (ripplesRef.current.length > 25) {
            ripplesRef.current = ripplesRef.current.slice(-18);
          }
        }
      } else {
        // Desktop touch: treat as mouse
        mouseRef.current.x = e.touches[0].clientX - rect.left;
        mouseRef.current.y = e.touches[0].clientY - rect.top;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    // --- MOBILE: Gyroscope handler ---
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!isMobile) return;
      const gamma = e.gamma || 0; // left/right tilt (-90 to 90)
      const beta = e.beta || 0; // front/back tilt (-180 to 180)

      // Normalize to -1..1, centered at ~50 degrees (typical phone holding angle)
      const targetX = Math.max(-1, Math.min(1, gamma / 25));
      const targetY = Math.max(-1, Math.min(1, (beta - 50) / 25));

      // Smooth interpolation to avoid jittery movement
      gyroRef.current.x += (targetX - gyroRef.current.x) * 0.1;
      gyroRef.current.y += (targetY - gyroRef.current.y) * 0.1;
    };

    // --- MOBILE: Shake detection ---
    const handleMotion = (e: DeviceMotionEvent) => {
      if (!isMobile) return;
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const totalForce = Math.sqrt(
        acc.x ** 2 + acc.y ** 2 + acc.z ** 2
      );
      const now = Date.now();

      // Threshold above gravity (~9.8) + shake force, with cooldown
      if (totalForce > 25 && now - lastShakeRef.current > 1500) {
        lastShakeRef.current = now;

        // Scatter all particles with random velocities
        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
          particles[i].vx += (Math.random() - 0.5) * 80;
          particles[i].vy += (Math.random() - 0.5) * 80;
        }
      }
    };

    // Attach event listeners
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      container.addEventListener('touchmove', handleTouchMove, {
        passive: true,
      });
      container.addEventListener('touchend', handleTouchEnd);
    }

    // Mobile device sensor listeners
    if (isMobile) {
      window.addEventListener('deviceorientation', handleOrientation);
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
      if (isMobile) {
        window.removeEventListener('deviceorientation', handleOrientation);
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [initParticles, isMobile, requestGyroPermission]);

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
