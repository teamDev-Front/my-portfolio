'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';

interface GridPoint {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  connections: number[];
  energy: number;
  pulsePhase: number;
}

interface FloatingOrb {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  vx: number;
  vy: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface EnergyWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  speed: number;
}

interface LightBeam {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  alpha: number;
  speed: number;
  color: string;
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const gridRef = useRef<GridPoint[]>([]);
  const orbsRef = useRef<FloatingOrb[]>([]);
  const wavesRef = useRef<EnergyWave[]>([]);
  const beamsRef = useRef<LightBeam[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const timeRef = useRef(0);
  const lastWaveTimeRef = useRef(0);
  const lastBeamTimeRef = useRef(0);

  const [isMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Initialize grid points
  const initGrid = useCallback((width: number, height: number) => {
    const grid: GridPoint[] = [];
    const spacing = isMobile ? 80 : 60;
    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;
    const offsetX = (width - (cols - 1) * spacing) / 2;
    const offsetY = (height - (rows - 1) * spacing) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * spacing;
        const y = offsetY + row * spacing;
        grid.push({
          x,
          y,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
          connections: [],
          energy: 0.3 + Math.random() * 0.3,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    // Calculate connections (adjacent points)
    const connectionDistance = spacing * 1.5;
    for (let i = 0; i < grid.length; i++) {
      for (let j = i + 1; j < grid.length; j++) {
        const dx = grid[i].ox - grid[j].ox;
        const dy = grid[i].oy - grid[j].oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
          grid[i].connections.push(j);
        }
      }
    }

    gridRef.current = grid;

    // Animate grid entrance with GSAP
    gsap.fromTo(
      grid,
      { energy: 0 },
      {
        energy: (i: number) => 0.3 + (i % 5) * 0.1,
        duration: 2,
        stagger: {
          each: 0.01,
          from: 'center',
        },
        ease: 'power2.out',
      }
    );
  }, [isMobile]);

  // Initialize floating orbs
  const initOrbs = useCallback((width: number, height: number) => {
    const orbs: FloatingOrb[] = [];
    const count = isMobile ? 4 : 7;

    const colors = [
      'rgba(220, 50, 50, 0.15)',
      'rgba(200, 40, 40, 0.12)',
      'rgba(180, 30, 30, 0.18)',
      'rgba(150, 25, 25, 0.1)',
      'rgba(255, 80, 80, 0.08)',
    ];

    for (let i = 0; i < count; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 100 + Math.random() * 200,
        color: colors[i % colors.length],
        alpha: 0,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        pulseSpeed: 0.5 + Math.random() * 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    orbsRef.current = orbs;

    // Animate orbs entrance
    gsap.to(orbs, {
      alpha: 1,
      duration: 3,
      stagger: 0.3,
      ease: 'power2.out',
    });
  }, [isMobile]);

  // Spawn energy wave
  const spawnWave = useCallback((width: number, height: number) => {
    const colors = [
      'rgba(220, 50, 50, 0.4)',
      'rgba(180, 40, 40, 0.35)',
      'rgba(255, 80, 80, 0.3)',
    ];

    const wave: EnergyWave = {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0,
      maxRadius: Math.max(width, height) * 0.6,
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2 + Math.random() * 2,
    };

    wavesRef.current.push(wave);

    // Animate wave expansion
    gsap.to(wave, {
      radius: wave.maxRadius,
      alpha: 0,
      duration: 4,
      ease: 'power1.out',
      onComplete: () => {
        const index = wavesRef.current.indexOf(wave);
        if (index > -1) wavesRef.current.splice(index, 1);
      },
    });
  }, []);

  // Spawn light beam
  const spawnBeam = useCallback((width: number, height: number) => {
    const isVertical = Math.random() > 0.5;
    const beam: LightBeam = {
      x: isVertical ? Math.random() * width : -100,
      y: isVertical ? -100 : Math.random() * height,
      angle: isVertical ? Math.PI / 2 + (Math.random() - 0.5) * 0.3 : (Math.random() - 0.5) * 0.3,
      length: Math.max(width, height) * 1.5,
      width: 1 + Math.random() * 2,
      alpha: 0,
      speed: 200 + Math.random() * 300,
      color: Math.random() > 0.7 ? 'rgba(255, 100, 100, 0.6)' : 'rgba(100, 100, 120, 0.4)',
    };

    beamsRef.current.push(beam);

    // Animate beam
    const tl = gsap.timeline({
      onComplete: () => {
        const index = beamsRef.current.indexOf(beam);
        if (index > -1) beamsRef.current.splice(index, 1);
      },
    });

    tl.to(beam, {
      alpha: 1,
      duration: 0.1,
      ease: 'power2.out',
    });

    tl.to(beam, {
      x: beam.x + Math.cos(beam.angle) * beam.speed * 3,
      y: beam.y + Math.sin(beam.angle) * beam.speed * 3,
      duration: 1.5,
      ease: 'none',
    }, 0);

    tl.to(beam, {
      alpha: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, '-=0.5');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initGrid(width, height);
      initOrbs(width, height);
    };

    resize();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', resize);

    // Animation settings
    const gravitationalRadius = isMobile ? 150 : 200;
    const gravitationalRadiusSq = gravitationalRadius * gravitationalRadius;
    const gravitationalStrength = isMobile ? 0.02 : 0.03;
    const friction = 0.94;
    const returnSpeed = 0.03;
    const connectionBaseAlpha = isMobile ? 0.08 : 0.12;

    const animate = () => {
      timeRef.current += 0.016;
      const time = timeRef.current;

      // Clear with subtle fade
      ctx.fillStyle = 'rgba(10, 10, 10, 1)';
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const grid = gridRef.current;
      const orbs = orbsRef.current;
      const waves = wavesRef.current;
      const beams = beamsRef.current;

      // Spawn waves periodically
      if (time - lastWaveTimeRef.current > (isMobile ? 6 : 4)) {
        lastWaveTimeRef.current = time;
        spawnWave(width, height);
      }

      // Spawn beams periodically
      if (!isMobile && time - lastBeamTimeRef.current > 3) {
        lastBeamTimeRef.current = time;
        if (Math.random() > 0.5) spawnBeam(width, height);
      }

      // Draw aurora/gradient layer
      const auroraGradient = ctx.createLinearGradient(0, 0, width, height);
      const hueShift = Math.sin(time * 0.1) * 10;
      auroraGradient.addColorStop(0, `hsla(${350 + hueShift}, 70%, 15%, 0.05)`);
      auroraGradient.addColorStop(0.5, 'rgba(10, 10, 10, 0)');
      auroraGradient.addColorStop(1, `hsla(${355 + hueShift}, 60%, 12%, 0.04)`);
      ctx.fillStyle = auroraGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw floating orbs
      for (const orb of orbs) {
        // Update position with subtle movement
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges
        if (orb.x < -orb.radius || orb.x > width + orb.radius) orb.vx *= -1;
        if (orb.y < -orb.radius || orb.y > height + orb.radius) orb.vy *= -1;

        // Draw orb with pulsing
        const pulse = 1 + Math.sin(time * orb.pulseSpeed + orb.pulsePhase) * 0.2;
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius * pulse
        );
        gradient.addColorStop(0, orb.color.replace(/[\d.]+\)$/, `${0.2 * orb.alpha})`));
        gradient.addColorStop(0.5, orb.color.replace(/[\d.]+\)$/, `${0.1 * orb.alpha})`));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw energy waves
      for (const wave of waves) {
        if (wave.radius > 0 && wave.alpha > 0) {
          ctx.strokeStyle = wave.color.replace(/[\d.]+\)$/, `${wave.alpha * 0.3})`);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Inner glow
          ctx.strokeStyle = wave.color.replace(/[\d.]+\)$/, `${wave.alpha * 0.15})`);
          ctx.lineWidth = 8;
          ctx.stroke();
        }
      }

      // Update grid points
      for (const point of grid) {
        // Gravitational attraction/repulsion to mouse
        if (mouse.active) {
          const dx = point.x - mouse.x;
          const dy = point.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < gravitationalRadiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / gravitationalRadius) * gravitationalStrength;
            const angle = Math.atan2(dy, dx);
            point.vx += Math.cos(angle) * force * gravitationalRadius;
            point.vy += Math.sin(angle) * force * gravitationalRadius;
          }
        }

        // Apply friction and return force
        point.vx *= friction;
        point.vy *= friction;
        point.vx += (point.ox - point.x) * returnSpeed;
        point.vy += (point.oy - point.y) * returnSpeed;

        // Organic breathing movement
        const breathX = Math.sin(time * 0.5 + point.pulsePhase) * 3;
        const breathY = Math.cos(time * 0.4 + point.pulsePhase) * 3;

        // Update position
        point.x = point.ox + point.vx + breathX;
        point.y = point.oy + point.vy + breathY;
      }

      // Draw grid connections
      ctx.lineCap = 'round';
      for (const point of grid) {
        for (const connIndex of point.connections) {
          const connPoint = grid[connIndex];
          const dx = point.x - connPoint.x;
          const dy = point.y - connPoint.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Dynamic alpha based on distance and energy
          const maxDist = isMobile ? 120 : 90;
          if (dist < maxDist) {
            const distAlpha = 1 - dist / maxDist;
            const energyPulse = Math.sin(time * 2 + point.pulsePhase) * 0.5 + 0.5;
            const alpha = distAlpha * connectionBaseAlpha * (point.energy + connPoint.energy) * (0.7 + energyPulse * 0.3);

            // Check proximity to mouse for highlight effect
            let highlight = 0;
            if (mouse.active) {
              const midX = (point.x + connPoint.x) / 2;
              const midY = (point.y + connPoint.y) / 2;
              const mouseDist = Math.sqrt(
                Math.pow(midX - mouse.x, 2) + Math.pow(midY - mouse.y, 2)
              );
              if (mouseDist < gravitationalRadius) {
                highlight = (1 - mouseDist / gravitationalRadius) * 0.3;
              }
            }

            // Draw connection with gradient
            const gradient = ctx.createLinearGradient(point.x, point.y, connPoint.x, connPoint.y);
            const baseColor = highlight > 0 ? `rgba(255, 100, 100, ${alpha + highlight})` : `rgba(80, 80, 100, ${alpha})`;
            const endColor = highlight > 0 ? `rgba(200, 60, 60, ${alpha + highlight})` : `rgba(60, 60, 80, ${alpha * 0.6})`;
            gradient.addColorStop(0, baseColor);
            gradient.addColorStop(1, endColor);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = highlight > 0 ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(connPoint.x, connPoint.y);
            ctx.stroke();
          }
        }
      }

      // Draw grid points
      for (const point of grid) {
        const pulse = Math.sin(time * 1.5 + point.pulsePhase) * 0.5 + 0.5;
        const size = 1.5 + pulse * 1;
        const alpha = 0.2 + point.energy * 0.3 + pulse * 0.1;

        // Check proximity to mouse
        let isNearMouse = false;
        if (mouse.active) {
          const dist = Math.sqrt(
            Math.pow(point.x - mouse.x, 2) + Math.pow(point.y - mouse.y, 2)
          );
          isNearMouse = dist < gravitationalRadius;
        }

        if (isNearMouse) {
          // Glowing point near mouse
          const glowGradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, size * 4
          );
          glowGradient.addColorStop(0, `rgba(255, 100, 100, ${alpha * 1.5})`);
          glowGradient.addColorStop(0.5, `rgba(200, 50, 50, ${alpha * 0.5})`);
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main point
        ctx.fillStyle = isNearMouse
          ? `rgba(255, 150, 150, ${alpha})`
          : `rgba(100, 100, 120, ${alpha})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw light beams
      for (const beam of beams) {
        if (beam.alpha > 0) {
          ctx.save();
          ctx.translate(beam.x, beam.y);
          ctx.rotate(beam.angle);

          const beamGradient = ctx.createLinearGradient(0, 0, beam.length, 0);
          beamGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
          beamGradient.addColorStop(0.1, beam.color.replace(/[\d.]+\)$/, `${beam.alpha})`));
          beamGradient.addColorStop(0.5, beam.color.replace(/[\d.]+\)$/, `${beam.alpha * 0.8})`));
          beamGradient.addColorStop(0.9, beam.color.replace(/[\d.]+\)$/, `${beam.alpha * 0.3})`));
          beamGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.strokeStyle = beamGradient;
          ctx.lineWidth = beam.width;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(beam.length, 0);
          ctx.stroke();

          ctx.restore();
        }
      }

      // Vignette effect
      const vignette = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.7
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', resize);
    };
  }, [isMobile, initGrid, initOrbs, spawnWave, spawnBeam]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
