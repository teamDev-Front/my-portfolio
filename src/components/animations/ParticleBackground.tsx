'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  a: number;
  size: number;
  isLogo: boolean;
  // Organic movement
  phase: number;
  speed: number;
  amplitude: number;
  // Entrance animation
  delay: number;
  scale: number;
}

interface ParticleBackgroundProps {
  logoPath?: string;
  backgroundColor?: string;
  onLoadComplete?: () => void;
}

export function ParticleBackground({
  logoPath = '/images/hcs-logo.svg',
  backgroundColor = '#0a0a0a',
  onLoadComplete,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isCleanedUpRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const isInteractingRef = useRef(false);
  const timeRef = useRef(0);
  const startTimeRef = useRef(0);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1000;
    }
    return false;
  });

  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window !== 'undefined') {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    return false;
  });

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1000);
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const createBackgroundParticles = useCallback((
    width: number,
    height: number
  ): Particle[] => {
    const particles: Particle[] = [];
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return particles;

    tempCanvas.width = width;
    tempCanvas.height = height;
    ctx.clearRect(0, 0, width, height);

    // ============================================
    // TOP LEFT RED ARC (filled crescent)
    // ============================================
    ctx.save();
    const leftArcCenterX = width * -0.12;
    const leftArcCenterY = height * -0.08;
    const leftArcRadius = Math.min(width, height) * 0.65;

    const leftGradient = ctx.createRadialGradient(
      leftArcCenterX + leftArcRadius * 0.35,
      leftArcCenterY + leftArcRadius * 0.35,
      0,
      leftArcCenterX,
      leftArcCenterY,
      leftArcRadius * 1.1
    );
    leftGradient.addColorStop(0, 'rgba(160, 30, 30, 0.95)');
    leftGradient.addColorStop(0.25, 'rgba(140, 25, 25, 0.85)');
    leftGradient.addColorStop(0.5, 'rgba(100, 18, 18, 0.6)');
    leftGradient.addColorStop(0.75, 'rgba(50, 10, 10, 0.25)');
    leftGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.arc(leftArcCenterX, leftArcCenterY, leftArcRadius, 0, Math.PI * 2);
    ctx.fillStyle = leftGradient;
    ctx.fill();
    ctx.restore();

    // ============================================
    // BOTTOM RIGHT RED ARC (stroke with intense glow)
    // ============================================
    ctx.save();
    const rightArcCenterX = width * 0.92;
    const rightArcCenterY = height * 1.12;
    const rightArcRadius = Math.min(width, height) * 0.6;

    // Multiple glow layers for depth
    for (let i = 8; i >= 0; i--) {
      ctx.beginPath();
      ctx.arc(rightArcCenterX, rightArcCenterY, rightArcRadius, -2.5, -0.4);
      ctx.lineWidth = 20 + i * 12;
      const alpha = 0.025 * (9 - i);
      ctx.strokeStyle = `rgba(200, 40, 40, ${alpha})`;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Main arc
    const arcGradient = ctx.createLinearGradient(
      rightArcCenterX - rightArcRadius,
      rightArcCenterY - rightArcRadius * 0.5,
      rightArcCenterX + rightArcRadius * 0.5,
      rightArcCenterY + rightArcRadius * 0.5
    );
    arcGradient.addColorStop(0, 'rgba(220, 50, 50, 1)');
    arcGradient.addColorStop(0.4, 'rgba(180, 35, 35, 0.95)');
    arcGradient.addColorStop(1, 'rgba(120, 25, 25, 0.8)');

    ctx.beginPath();
    ctx.arc(rightArcCenterX, rightArcCenterY, rightArcRadius, -2.5, -0.4);
    ctx.lineWidth = 16;
    ctx.strokeStyle = arcGradient;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Bright inner edge
    ctx.beginPath();
    ctx.arc(rightArcCenterX, rightArcCenterY, rightArcRadius, -2.5, -0.4);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.7)';
    ctx.stroke();

    ctx.restore();

    // ============================================
    // ABSTRACT GEOMETRIC SHAPES (< X > pattern)
    // ============================================
    ctx.save();

    const baseAlpha = 0.45;
    const shapeColor = `rgba(50, 50, 58, ${baseAlpha})`;
    const shapeLineWidth = Math.min(width, height) * 0.058;

    ctx.strokeStyle = shapeColor;
    ctx.lineWidth = shapeLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = width * 0.70;
    const cy = height * 0.28;
    const s = Math.min(width, height) * 0.32;

    // Draw chevrons < >
    const drawChevron = (context: CanvasRenderingContext2D, dir: 'left' | 'right') => {
      const sign = dir === 'left' ? -1 : 1;
      const x1 = cx + sign * (s * 0.32);
      const y1 = cy - (s * 0.34);
      const x2 = cx + sign * (s * 0.06);
      const y2 = cy;
      const x3 = cx + sign * (s * 0.32);
      const y3 = cy + (s * 0.34);

      context.save();
      context.globalAlpha = 0.2;
      context.lineWidth = shapeLineWidth * 1.3;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x3, y3);
      context.stroke();
      context.restore();

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x3, y3);
      context.stroke();
    };

    drawChevron(ctx, 'left');
    drawChevron(ctx, 'right');

    // X in center
    const xSize = s * 0.20;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - xSize, cy - xSize);
    ctx.lineTo(cx + xSize, cy + xSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + xSize, cy - xSize);
    ctx.lineTo(cx - xSize, cy + xSize);
    ctx.stroke();
    ctx.restore();

    // Large curve below
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(width * 0.54, height * 0.88, Math.min(width, height) * 0.38, -2.9, -0.25);
    ctx.stroke();
    ctx.restore();

    // Smaller decorative curve
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(width * 0.42, height * 0.64, Math.min(width, height) * 0.14, -1.6, 0.6);
    ctx.stroke();
    ctx.restore();

    ctx.restore();

    // ============================================
    // Extract particles
    // ============================================
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const step = isMobile ? 6 : 4;

    let particleIndex = 0;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        if (a > 12) {
          const distFromCenter = Math.sqrt(
            Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
          );
          
          particles.push({
            x: x,
            y: y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
            r: r / 255,
            g: g / 255,
            b: b / 255,
            a: a / 255,
            size: isMobile ? 1.8 : 2.2,
            isLogo: false,
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.5,
            amplitude: 1.5 + Math.random() * 2,
            delay: distFromCenter * 0.001 + Math.random() * 0.3,
            scale: 0,
          });
          particleIndex++;
        }
      }
    }

    return particles;
  }, [isMobile]);

  const createLogoParticles = useCallback((
    canvasWidth: number,
    canvasHeight: number
  ): Promise<Particle[]> => {
    return new Promise((resolve) => {
      const particles: Particle[] = [];
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) {
          resolve(particles);
          return;
        }

        const logoScale = isMobile ? 0.55 : 0.30;
        const logoWidth = Math.min(canvasWidth * logoScale, isMobile ? 340 : 420);
        const logoHeight = (logoWidth / img.width) * img.height;

        tempCanvas.width = Math.ceil(logoWidth);
        tempCanvas.height = Math.ceil(logoHeight);

        ctx.drawImage(img, 0, 0, logoWidth, logoHeight);

        const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const pixels = imageData.data;

        const offsetX = (canvasWidth - logoWidth) / 2;
        const offsetY = (canvasHeight - logoHeight) / 2;

        const step = isMobile ? 2.5 : 1.6;

        for (let y = 0; y < tempCanvas.height; y += step) {
          for (let x = 0; x < tempCanvas.width; x += step) {
            const i = (Math.floor(y) * tempCanvas.width + Math.floor(x)) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];

            if (a > 30) {
              const px = offsetX + x;
              const py = offsetY + y;
              const distFromLogoCenter = Math.sqrt(
                Math.pow(x - logoWidth / 2, 2) + Math.pow(y - logoHeight / 2, 2)
              );

              particles.push({
                x: px,
                y: py,
                ox: px,
                oy: py,
                vx: 0,
                vy: 0,
                r: r / 255,
                g: g / 255,
                b: b / 255,
                a: a / 255,
                size: isMobile ? 2.5 : 3.0,
                isLogo: true,
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.8,
                amplitude: 0.8 + Math.random() * 1.2,
                delay: 0.5 + distFromLogoCenter * 0.003 + Math.random() * 0.2,
                scale: 0,
              });
            }
          }
        }

        resolve(particles);
      };

      img.onerror = () => {
        console.error('Failed to load logo');
        resolve(particles);
      };

      img.src = logoPath;
    });
  }, [logoPath, isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isCleanedUpRef.current = false;
    startTimeRef.current = performance.now();

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    const getViewportSize = () => {
      if (isMobile && window.visualViewport) {
        return {
          width: window.visualViewport.width,
          height: window.visualViewport.height,
        };
      }
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };

    const { width: cssWidth, height: cssHeight } = getViewportSize();

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      console.error('Canvas 2D not supported');
      onLoadComplete?.();
      return;
    }

    ctx.scale(dpr, dpr);

    let bgParticleCount = 0;

    const initParticles = async () => {
      if (isCleanedUpRef.current) return;

      const bgParticles = createBackgroundParticles(cssWidth, cssHeight);
      bgParticleCount = bgParticles.length;

      const logoParticles = await createLogoParticles(cssWidth, cssHeight);

      if (isCleanedUpRef.current) return;

      particlesRef.current = [...bgParticles, ...logoParticles];

      console.log(`Particles: ${bgParticles.length} bg + ${logoParticles.length} logo = ${particlesRef.current.length}`);

      startAnimation();

      setTimeout(() => {
        onLoadComplete?.();
      }, 500);
    };

    const startAnimation = () => {
      const targetFPS = isMobile ? 45 : 60;
      const frameInterval = 1000 / targetFPS;
      let lastFrameTime = 0;

      const distortionRadius = isMobile ? 80 : 120;
      const distortionRadiusSq = distortionRadius * distortionRadius;
      const forceStrength = isMobile ? 0.08 : 0.12;
      const maxDisplacement = isMobile ? 40 : 60;
      const friction = 0.92;
      const returnSpeed = 0.04;

      // Connection settings
      const connectionDistance = isMobile ? 0 : 50; // Disable on mobile for performance
      const connectionAlpha = 0.15;

      const animate = (currentTime: number) => {
        if (isCleanedUpRef.current || !ctx || !canvas) return;

        const elapsed = currentTime - lastFrameTime;
        if (elapsed < frameInterval) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }
        lastFrameTime = currentTime - (elapsed % frameInterval);

        timeRef.current = (currentTime - startTimeRef.current) / 1000;

        const particles = particlesRef.current;
        const count = particles.length;
        if (count === 0) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        // Clear with fade effect for trail
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, cssWidth, cssHeight);

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const isActive = isInteractingRef.current;
        const time = timeRef.current;

        // Update and draw particles
        for (let i = 0; i < count; i++) {
          const p = particles[i];

          // Entrance animation
          const entranceProgress = Math.min(1, Math.max(0, (time - p.delay) * 1.5));
          p.scale = easeOutCubic(entranceProgress);

          if (p.scale < 0.01) continue;

          // Organic breathing movement
          const breathX = Math.sin(time * p.speed + p.phase) * p.amplitude;
          const breathY = Math.cos(time * p.speed * 0.7 + p.phase) * p.amplitude * 0.8;

          // Mouse interaction
          if (isActive) {
            const dx = (p.ox + breathX + p.vx) - mx;
            const dy = (p.oy + breathY + p.vy) - my;
            const distSq = dx * dx + dy * dy;

            if (distSq < distortionRadiusSq && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / distortionRadius) * forceStrength;
              const angle = Math.atan2(dy, dx);
              const multiplier = p.isLogo ? 1.5 : 1;
              p.vx += Math.cos(angle) * force * distortionRadius * multiplier;
              p.vy += Math.sin(angle) * force * distortionRadius * multiplier;
            }
          }

          // Physics
          p.vx *= friction;
          p.vy *= friction;
          p.vx += -p.vx * returnSpeed;
          p.vy += -p.vy * returnSpeed;

          // Clamp displacement
          const dispDist = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (dispDist > maxDisplacement) {
            const scale = maxDisplacement / dispDist;
            p.vx *= scale;
            p.vy *= scale;
          }

          // Final position
          p.x = p.ox + breathX + p.vx;
          p.y = p.oy + breathY + p.vy;
        }

        // Draw connections (only for logo particles on desktop)
        if (connectionDistance > 0 && !isMobile) {
          ctx.lineWidth = 0.5;
          for (let i = bgParticleCount; i < count; i++) {
            const p1 = particles[i];
            if (p1.scale < 0.5) continue;
            
            for (let j = i + 1; j < count; j++) {
              const p2 = particles[j];
              if (p2.scale < 0.5) continue;
              
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < connectionDistance) {
                const alpha = (1 - dist / connectionDistance) * connectionAlpha * p1.scale * p2.scale;
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }

        // Draw particles
        for (let i = 0; i < count; i++) {
          const p = particles[i];
          if (p.scale < 0.01) continue;

          const size = p.size * p.scale;
          const alpha = p.a * p.scale;

          // Glow effect for logo particles
          if (p.isLogo && !isMobile) {
            const glowSize = size * 3;
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
            gradient.addColorStop(0, `rgba(${Math.round(p.r * 255)}, ${Math.round(p.g * 255)}, ${Math.round(p.b * 255)}, ${alpha * 0.4})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
            ctx.fill();
          }

          // Main particle
          ctx.fillStyle = `rgba(${Math.round(p.r * 255)}, ${Math.round(p.g * 255)}, ${Math.round(p.b * 255)}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate(performance.now());
    };

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const handleInteraction = (clientX: number, clientY: number) => {
      if (isCleanedUpRef.current) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = clientX - rect.left;
      mouseRef.current.y = clientY - rect.top;
      isInteractingRef.current = true;
    };

    const handleInteractionEnd = () => {
      isInteractingRef.current = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isTouch) handleInteraction(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      if (!isTouch) handleInteractionEnd();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      handleInteractionEnd();
    };

    const handleResize = () => {
      if (isCleanedUpRef.current || !ctx || !canvas) return;

      const { width, height } = getViewportSize();
      const newDpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      
      canvas.width = width * newDpr;
      canvas.height = height * newDpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(newDpr, newDpr);

      // Reinitialize particles
      startTimeRef.current = performance.now();
      initParticles();
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    initParticles();

    return () => {
      isCleanedUpRef.current = true;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }

      particlesRef.current = [];
    };
  }, [logoPath, isMobile, isTouch, backgroundColor, onLoadComplete, createBackgroundParticles, createLogoParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
      }}
    />
  );
}