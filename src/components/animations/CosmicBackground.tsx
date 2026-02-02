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

interface ClickParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface DragTrail {
  points: { x: number; y: number; time: number }[];
  alpha: number;
}

interface Lightning {
  start: { x: number; y: number };
  end: { x: number; y: number };
  segments: { x: number; y: number }[];
  alpha: number;
  width: number;
}

interface ClickFlash {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const gridRef = useRef<GridPoint[]>([]);
  const orbsRef = useRef<FloatingOrb[]>([]);
  const wavesRef = useRef<EnergyWave[]>([]);
  const beamsRef = useRef<LightBeam[]>([]);
  const clickParticlesRef = useRef<ClickParticle[]>([]);
  const dragTrailRef = useRef<DragTrail>({ points: [], alpha: 0 });
  const lightningsRef = useRef<Lightning[]>([]);
  const clickFlashRef = useRef<ClickFlash[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false, dragging: false });
  const timeRef = useRef(0);
  const lastWaveTimeRef = useRef(0);
  const lastBeamTimeRef = useRef(0);
  const lastDragLightningRef = useRef(0);

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
  const spawnWave = useCallback((width: number, height: number, x?: number, y?: number, isClick?: boolean) => {
    const colors = isClick
      ? ['rgba(255, 120, 120, 0.6)', 'rgba(255, 80, 80, 0.5)']
      : ['rgba(220, 50, 50, 0.4)', 'rgba(180, 40, 40, 0.35)', 'rgba(255, 80, 80, 0.3)'];

    const wave: EnergyWave = {
      x: x ?? Math.random() * width,
      y: y ?? Math.random() * height,
      radius: 0,
      maxRadius: isClick ? Math.max(width, height) * 0.4 : Math.max(width, height) * 0.6,
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: isClick ? 4 : 2 + Math.random() * 2,
    };

    wavesRef.current.push(wave);

    // Animate wave expansion
    gsap.to(wave, {
      radius: wave.maxRadius,
      alpha: 0,
      duration: isClick ? 1.5 : 4,
      ease: isClick ? 'power2.out' : 'power1.out',
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

  // Spawn click particles explosion
  const spawnClickExplosion = useCallback((x: number, y: number) => {
    const particleCount = isMobile ? 15 : 25;
    const colors = [
      'rgba(255, 150, 150, 1)',
      'rgba(255, 100, 100, 1)',
      'rgba(255, 200, 200, 1)',
      'rgba(255, 80, 80, 1)',
      'rgba(255, 255, 255, 1)',
    ];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 6;
      const particle: ClickParticle = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 60 + Math.random() * 40,
        trail: [],
      };
      clickParticlesRef.current.push(particle);
    }

    // Spawn additional spark particles
    const sparkCount = isMobile ? 8 : 15;
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 10;
      const particle: ClickParticle = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 1.5,
        alpha: 1,
        color: 'rgba(255, 255, 255, 1)',
        life: 0,
        maxLife: 30 + Math.random() * 20,
        trail: [],
      };
      clickParticlesRef.current.push(particle);
    }

    // Spawn click flash
    const flash: ClickFlash = {
      x,
      y,
      radius: 0,
      alpha: 0.8,
    };
    clickFlashRef.current.push(flash);

    gsap.to(flash, {
      radius: 80,
      alpha: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        const index = clickFlashRef.current.indexOf(flash);
        if (index > -1) clickFlashRef.current.splice(index, 1);
      },
    });
  }, [isMobile]);

  // Generate lightning segments
  const generateLightningSegments = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    const segments: { x: number; y: number }[] = [{ ...start }];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const segmentCount = Math.max(3, Math.floor(dist / 30));

    for (let i = 1; i < segmentCount; i++) {
      const t = i / segmentCount;
      const baseX = start.x + dx * t;
      const baseY = start.y + dy * t;
      const offset = (1 - Math.abs(t - 0.5) * 2) * 20; // More offset in middle
      const perpX = -dy / dist;
      const perpY = dx / dist;
      segments.push({
        x: baseX + perpX * (Math.random() - 0.5) * offset,
        y: baseY + perpY * (Math.random() - 0.5) * offset,
      });
    }
    segments.push({ ...end });
    return segments;
  }, []);

  // Spawn lightning between two points
  const spawnLightning = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    const lightning: Lightning = {
      start,
      end,
      segments: generateLightningSegments(start, end),
      alpha: 1,
      width: 1 + Math.random() * 2,
    };
    lightningsRef.current.push(lightning);

    gsap.to(lightning, {
      alpha: 0,
      duration: 0.2 + Math.random() * 0.2,
      ease: 'power2.in',
      onComplete: () => {
        const index = lightningsRef.current.indexOf(lightning);
        if (index > -1) lightningsRef.current.splice(index, 1);
      },
    });

    // Spawn branching lightnings occasionally
    if (Math.random() > 0.6) {
      const midIndex = Math.floor(lightning.segments.length / 2);
      const midPoint = lightning.segments[midIndex];
      const branchAngle = Math.atan2(end.y - start.y, end.x - start.x) + (Math.random() - 0.5) * Math.PI;
      const branchLength = 30 + Math.random() * 50;
      const branchEnd = {
        x: midPoint.x + Math.cos(branchAngle) * branchLength,
        y: midPoint.y + Math.sin(branchAngle) * branchLength,
      };

      const branch: Lightning = {
        start: midPoint,
        end: branchEnd,
        segments: generateLightningSegments(midPoint, branchEnd),
        alpha: 0.7,
        width: lightning.width * 0.6,
      };
      lightningsRef.current.push(branch);

      gsap.to(branch, {
        alpha: 0,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
          const index = lightningsRef.current.indexOf(branch);
          if (index > -1) lightningsRef.current.splice(index, 1);
        },
      });
    }
  }, [generateLightningSegments]);

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
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      // Handle drag trail
      if (mouseRef.current.dragging) {
        const trail = dragTrailRef.current;
        trail.points.push({ x: e.clientX, y: e.clientY, time: timeRef.current });

        // Limit trail length
        if (trail.points.length > 30) {
          trail.points.shift();
        }

        // Spawn lightning during drag
        if (timeRef.current - lastDragLightningRef.current > 0.05 && prevX > 0) {
          lastDragLightningRef.current = timeRef.current;

          // Find nearby grid points to connect with lightning
          const grid = gridRef.current;
          for (const point of grid) {
            const dist = Math.sqrt(
              Math.pow(point.x - e.clientX, 2) + Math.pow(point.y - e.clientY, 2)
            );
            if (dist < 100 && Math.random() > 0.85) {
              spawnLightning(
                { x: e.clientX, y: e.clientY },
                { x: point.x, y: point.y }
              );
            }
          }

          // Spawn trailing particles
          if (Math.random() > 0.5) {
            const angle = Math.atan2(e.clientY - prevY, e.clientX - prevX) + Math.PI;
            const particle: ClickParticle = {
              x: e.clientX,
              y: e.clientY,
              vx: Math.cos(angle + (Math.random() - 0.5)) * 2,
              vy: Math.sin(angle + (Math.random() - 0.5)) * 2,
              size: 1 + Math.random() * 2,
              alpha: 0.8,
              color: Math.random() > 0.5 ? 'rgba(255, 150, 150, 1)' : 'rgba(255, 255, 255, 1)',
              life: 0,
              maxLife: 20 + Math.random() * 20,
              trail: [],
            };
            clickParticlesRef.current.push(particle);
          }
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.dragging = false;
      dragTrailRef.current.points = [];
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.dragging = true;
      dragTrailRef.current.alpha = 1;

      // Spawn click effects
      spawnClickExplosion(e.clientX, e.clientY);
      spawnWave(width, height, e.clientX, e.clientY, true);

      // Boost energy of nearby grid points
      const grid = gridRef.current;
      for (const point of grid) {
        const dist = Math.sqrt(
          Math.pow(point.x - e.clientX, 2) + Math.pow(point.y - e.clientY, 2)
        );
        if (dist < 150) {
          const boost = (1 - dist / 150) * 0.5;
          gsap.to(point, {
            energy: point.energy + boost,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    };

    const handleMouseUp = () => {
      mouseRef.current.dragging = false;

      // Fade out trail
      gsap.to(dragTrailRef.current, {
        alpha: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          dragTrailRef.current.points = [];
        },
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const prevX = mouseRef.current.x;
        const prevY = mouseRef.current.y;
        mouseRef.current.x = touch.clientX;
        mouseRef.current.y = touch.clientY;
        mouseRef.current.active = true;

        if (mouseRef.current.dragging) {
          const trail = dragTrailRef.current;
          trail.points.push({ x: touch.clientX, y: touch.clientY, time: timeRef.current });

          if (trail.points.length > 20) {
            trail.points.shift();
          }

          // Spawn lightning during drag (less frequently on mobile)
          if (timeRef.current - lastDragLightningRef.current > 0.1 && prevX > 0) {
            lastDragLightningRef.current = timeRef.current;

            const grid = gridRef.current;
            for (const point of grid) {
              const dist = Math.sqrt(
                Math.pow(point.x - touch.clientX, 2) + Math.pow(point.y - touch.clientY, 2)
              );
              if (dist < 80 && Math.random() > 0.9) {
                spawnLightning(
                  { x: touch.clientX, y: touch.clientY },
                  { x: point.x, y: point.y }
                );
              }
            }
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.x = touch.clientX;
        mouseRef.current.y = touch.clientY;
        mouseRef.current.active = true;
        mouseRef.current.dragging = true;
        dragTrailRef.current.alpha = 1;

        spawnClickExplosion(touch.clientX, touch.clientY);
        spawnWave(width, height, touch.clientX, touch.clientY, true);
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
      mouseRef.current.dragging = false;

      gsap.to(dragTrailRef.current, {
        alpha: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          dragTrailRef.current.points = [];
        },
      });
    };

    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);
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
      const clickParticles = clickParticlesRef.current;
      const dragTrail = dragTrailRef.current;
      const lightnings = lightningsRef.current;
      const clickFlashes = clickFlashRef.current;

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
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius || orb.x > width + orb.radius) orb.vx *= -1;
        if (orb.y < -orb.radius || orb.y > height + orb.radius) orb.vy *= -1;

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

          ctx.strokeStyle = wave.color.replace(/[\d.]+\)$/, `${wave.alpha * 0.15})`);
          ctx.lineWidth = 8;
          ctx.stroke();
        }
      }

      // Update grid points
      for (const point of grid) {
        if (mouse.active) {
          const dx = point.x - mouse.x;
          const dy = point.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < gravitationalRadiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / gravitationalRadius) * gravitationalStrength;
            const angle = Math.atan2(dy, dx);
            // Stronger force when dragging
            const dragMultiplier = mouse.dragging ? 2 : 1;
            point.vx += Math.cos(angle) * force * gravitationalRadius * dragMultiplier;
            point.vy += Math.sin(angle) * force * gravitationalRadius * dragMultiplier;
          }
        }

        point.vx *= friction;
        point.vy *= friction;
        point.vx += (point.ox - point.x) * returnSpeed;
        point.vy += (point.oy - point.y) * returnSpeed;

        const breathX = Math.sin(time * 0.5 + point.pulsePhase) * 3;
        const breathY = Math.cos(time * 0.4 + point.pulsePhase) * 3;

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

          const maxDist = isMobile ? 120 : 90;
          if (dist < maxDist) {
            const distAlpha = 1 - dist / maxDist;
            const energyPulse = Math.sin(time * 2 + point.pulsePhase) * 0.5 + 0.5;
            const alpha = distAlpha * connectionBaseAlpha * (point.energy + connPoint.energy) * (0.7 + energyPulse * 0.3);

            let highlight = 0;
            if (mouse.active) {
              const midX = (point.x + connPoint.x) / 2;
              const midY = (point.y + connPoint.y) / 2;
              const mouseDist = Math.sqrt(
                Math.pow(midX - mouse.x, 2) + Math.pow(midY - mouse.y, 2)
              );
              if (mouseDist < gravitationalRadius) {
                highlight = (1 - mouseDist / gravitationalRadius) * (mouse.dragging ? 0.5 : 0.3);
              }
            }

            const gradient = ctx.createLinearGradient(point.x, point.y, connPoint.x, connPoint.y);
            const baseColor = highlight > 0 ? `rgba(255, 100, 100, ${alpha + highlight})` : `rgba(80, 80, 100, ${alpha})`;
            const endColor = highlight > 0 ? `rgba(200, 60, 60, ${alpha + highlight})` : `rgba(60, 60, 80, ${alpha * 0.6})`;
            gradient.addColorStop(0, baseColor);
            gradient.addColorStop(1, endColor);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = highlight > 0 ? (mouse.dragging ? 2 : 1.5) : 1;
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

        let isNearMouse = false;
        if (mouse.active) {
          const dist = Math.sqrt(
            Math.pow(point.x - mouse.x, 2) + Math.pow(point.y - mouse.y, 2)
          );
          isNearMouse = dist < gravitationalRadius;
        }

        if (isNearMouse) {
          const glowGradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, size * (mouse.dragging ? 6 : 4)
          );
          glowGradient.addColorStop(0, `rgba(255, 100, 100, ${alpha * (mouse.dragging ? 2 : 1.5)})`);
          glowGradient.addColorStop(0.5, `rgba(200, 50, 50, ${alpha * (mouse.dragging ? 0.8 : 0.5)})`);
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * (mouse.dragging ? 6 : 4), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = isNearMouse
          ? `rgba(255, 150, 150, ${alpha})`
          : `rgba(100, 100, 120, ${alpha})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw drag trail
      if (dragTrail.points.length > 1 && dragTrail.alpha > 0) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < dragTrail.points.length; i++) {
          const p1 = dragTrail.points[i - 1];
          const p2 = dragTrail.points[i];
          const progress = i / dragTrail.points.length;
          const alpha = progress * dragTrail.alpha * 0.6;
          const width = progress * 4;

          // Main trail
          const trailGradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          trailGradient.addColorStop(0, `rgba(255, 100, 100, ${alpha * 0.5})`);
          trailGradient.addColorStop(1, `rgba(255, 150, 150, ${alpha})`);

          ctx.strokeStyle = trailGradient;
          ctx.lineWidth = width;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Glow
          ctx.strokeStyle = `rgba(255, 200, 200, ${alpha * 0.3})`;
          ctx.lineWidth = width + 4;
          ctx.stroke();
        }
      }

      // Draw lightnings
      for (const lightning of lightnings) {
        if (lightning.alpha > 0 && lightning.segments.length > 1) {
          // Glow
          ctx.strokeStyle = `rgba(255, 150, 150, ${lightning.alpha * 0.3})`;
          ctx.lineWidth = lightning.width + 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(lightning.segments[0].x, lightning.segments[0].y);
          for (let i = 1; i < lightning.segments.length; i++) {
            ctx.lineTo(lightning.segments[i].x, lightning.segments[i].y);
          }
          ctx.stroke();

          // Core
          ctx.strokeStyle = `rgba(255, 255, 255, ${lightning.alpha})`;
          ctx.lineWidth = lightning.width;
          ctx.stroke();
        }
      }

      // Draw click flashes
      for (const flash of clickFlashes) {
        if (flash.alpha > 0) {
          const flashGradient = ctx.createRadialGradient(
            flash.x, flash.y, 0,
            flash.x, flash.y, flash.radius
          );
          flashGradient.addColorStop(0, `rgba(255, 255, 255, ${flash.alpha})`);
          flashGradient.addColorStop(0.3, `rgba(255, 150, 150, ${flash.alpha * 0.5})`);
          flashGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = flashGradient;
          ctx.beginPath();
          ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update and draw click particles
      for (let i = clickParticles.length - 1; i >= 0; i--) {
        const p = clickParticles[i];
        p.life++;

        // Add to trail
        if (p.trail.length === 0 || Math.random() > 0.5) {
          p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
        }
        if (p.trail.length > 8) p.trail.shift();

        // Apply gravity and friction
        p.vy += 0.1;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        // Fade based on life
        const lifeProgress = p.life / p.maxLife;
        p.alpha = 1 - lifeProgress;
        p.size *= 0.99;

        // Draw trail
        for (let j = 0; j < p.trail.length; j++) {
          const t = p.trail[j];
          const trailAlpha = (j / p.trail.length) * p.alpha * 0.3;
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${trailAlpha})`);
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.size * 0.5 * (j / p.trail.length), 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw particle
        if (p.alpha > 0.01) {
          // Glow
          const glowGradient = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.size * 3
          );
          glowGradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${p.alpha * 0.5})`));
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Core
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.alpha})`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Remove dead particles
        if (p.life >= p.maxLife || p.alpha <= 0.01) {
          clickParticles.splice(i, 1);
        }
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
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', resize);
    };
  }, [isMobile, initGrid, initOrbs, spawnWave, spawnBeam, spawnClickExplosion, spawnLightning]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ zIndex: 0, touchAction: 'none' }}
    />
  );
}
