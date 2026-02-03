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
  eaten: boolean;
  eatenAlpha: number;
  respawnTime: number;
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

interface Vortex {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  rotation: number;
  alpha: number;
  pullStrength: number;
  eatenPointIndices: number[];
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
  const vortexesRef = useRef<Vortex[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false, dragging: false });
  const timeRef = useRef(0);
  const lastVortexTimeRef = useRef(0);
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
          eaten: false,
          eatenAlpha: 1,
          respawnTime: 0,
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

  // Spawn vortex (black hole effect)
  const spawnVortex = useCallback((width: number, height: number) => {
    const grid = gridRef.current;
    const time = timeRef.current;

    // Random position with some margin from edges
    const margin = isMobile ? 100 : 150;
    const x = margin + Math.random() * (width - margin * 2);
    const y = margin + Math.random() * (height - margin * 2);

    const maxRadius = isMobile ? 120 : 180;

    // Find grid points within range that aren't already eaten
    const eatenPointIndices: number[] = [];
    const pullRadius = maxRadius * 1.5;

    for (let i = 0; i < grid.length; i++) {
      const point = grid[i];
      if (point.eaten) continue;

      const dist = Math.sqrt(Math.pow(point.ox - x, 2) + Math.pow(point.oy - y, 2));
      if (dist < pullRadius) {
        eatenPointIndices.push(i);
      }
    }

    const vortex: Vortex = {
      x,
      y,
      radius: 0,
      maxRadius,
      rotation: 0,
      alpha: 0,
      pullStrength: 0,
      eatenPointIndices,
    };

    vortexesRef.current.push(vortex);

    // Phase 1: Vortex appears and grows
    gsap.to(vortex, {
      radius: maxRadius,
      alpha: 1,
      pullStrength: 1,
      duration: 1.5,
      ease: 'power2.out',
    });

    // Animate rotation continuously
    gsap.to(vortex, {
      rotation: Math.PI * 8,
      duration: 6,
      ease: 'none',
    });

    // Animate points being pulled toward vortex center
    eatenPointIndices.forEach((pointIndex, i) => {
      const point = grid[pointIndex];
      const delay = 0.3 + Math.random() * 1.2;

      // First, animate the point spiraling toward the center
      gsap.to(point, {
        x: x,
        y: y,
        eatenAlpha: 0,
        duration: 1.5,
        delay: delay,
        ease: 'power2.in',
        onComplete: () => {
          point.eaten = true;
          point.respawnTime = time + 5 + Math.random() * 3; // Respawn after 5-8 seconds
        },
      });
    });

    // Phase 2: Vortex shrinks and disappears
    gsap.to(vortex, {
      radius: 0,
      alpha: 0,
      pullStrength: 0,
      duration: 1.5,
      delay: 3.5,
      ease: 'power2.in',
      onComplete: () => {
        const index = vortexesRef.current.indexOf(vortex);
        if (index > -1) vortexesRef.current.splice(index, 1);
      },
    });
  }, [isMobile]);

  // Spawn light beam (shooting star)
  const spawnBeam = useCallback((width: number, height: number) => {
    const isVertical = Math.random() > 0.5;
    // Alternate between white and red beams
    const isWhite = Math.random() > 0.5;
    const beam: LightBeam = {
      x: isVertical ? Math.random() * width : -100,
      y: isVertical ? -100 : Math.random() * height,
      angle: isVertical ? Math.PI / 2 + (Math.random() - 0.5) * 0.3 : (Math.random() - 0.5) * 0.3,
      length: Math.max(width, height) * 1.5,
      width: 1 + Math.random() * 2,
      alpha: 0,
      speed: 200 + Math.random() * 300,
      color: isWhite ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 120, 120, 0.6)',
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

  // Generate lightning segments with natural jagged paths
  const generateLightningSegments = useCallback((
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const segments: { x: number; y: number }[] = [{ ...start }];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Moderate segment count for cleaner look
    const segmentCount = Math.max(3, Math.floor(dist / 25));

    // Perpendicular vector for offsets
    const perpX = -dy / dist;
    const perpY = dx / dist;

    for (let i = 1; i < segmentCount; i++) {
      const t = i / segmentCount;
      const targetX = start.x + dx * t;
      const targetY = start.y + dy * t;

      // Subtle jaggedness - peaks in the middle
      const jaggedness = (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * 15;
      const offset = (Math.random() - 0.5) * jaggedness;

      segments.push({
        x: targetX + perpX * offset,
        y: targetY + perpY * offset,
      });
    }

    segments.push({ ...end });
    return segments;
  }, []);

  // Spawn lightning between two points
  const spawnLightning = useCallback((
    start: { x: number; y: number },
    end: { x: number; y: number },
    options: { intense?: boolean } = {}
  ) => {
    const { intense = false } = options;

    const lightning: Lightning = {
      start,
      end,
      segments: generateLightningSegments(start, end),
      alpha: 1,
      width: intense ? 1.5 + Math.random() * 1 : 1 + Math.random() * 0.5,
    };
    lightningsRef.current.push(lightning);

    gsap.to(lightning, {
      alpha: 0,
      duration: 0.15 + Math.random() * 0.1,
      ease: 'power2.in',
      onComplete: () => {
        const index = lightningsRef.current.indexOf(lightning);
        if (index > -1) lightningsRef.current.splice(index, 1);
      },
    });

    // Branch occasionally - more likely when intense
    const branchChance = intense ? 0.4 : 0.7;
    if (Math.random() > branchChance) {
      const mainAngle = Math.atan2(end.y - start.y, end.x - start.x);
      const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      const branchIndex = Math.floor(lightning.segments.length * (0.4 + Math.random() * 0.3));
      const branchPoint = lightning.segments[branchIndex];
      const branchAngle = mainAngle + (Math.random() - 0.5) * Math.PI * 0.7;
      const branchLength = dist * (0.3 + Math.random() * 0.25);
      const branchEnd = {
        x: branchPoint.x + Math.cos(branchAngle) * branchLength,
        y: branchPoint.y + Math.sin(branchAngle) * branchLength,
      };

      const branch: Lightning = {
        start: branchPoint,
        end: branchEnd,
        segments: generateLightningSegments(branchPoint, branchEnd),
        alpha: 1,
        width: lightning.width * 0.7,
      };
      lightningsRef.current.push(branch);

      gsap.to(branch, {
        alpha: 0,
        duration: 0.25 + Math.random() * 0.15,
        ease: 'power1.in',
        onComplete: () => {
          const index = lightningsRef.current.indexOf(branch);
          if (index > -1) lightningsRef.current.splice(index, 1);
        },
      });
    }
  }, [generateLightningSegments]);

  // Spawn electric burst on click - lightning rays to nearby grid points
  const spawnClickExplosion = useCallback((x: number, y: number) => {
    const grid = gridRef.current;
    const burstRadius = isMobile ? 180 : 250;
    const maxRays = isMobile ? 6 : 10;

    // Find nearby grid points and sort by distance
    const nearbyPoints: { point: GridPoint; dist: number }[] = [];
    for (const point of grid) {
      const dist = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
      if (dist < burstRadius && dist > 20) {
        nearbyPoints.push({ point, dist });
      }
    }

    // Sort by distance and take the closest ones
    nearbyPoints.sort((a, b) => a.dist - b.dist);
    const selectedPoints = nearbyPoints.slice(0, maxRays);

    // Spawn lightning to each selected point with staggered timing
    selectedPoints.forEach((item, index) => {
      setTimeout(() => {
        spawnLightning(
          { x, y },
          { x: item.point.x, y: item.point.y },
          { intense: true }
        );

        // Boost the grid point energy
        gsap.to(item.point, {
          energy: item.point.energy + 0.4,
          duration: 0.2,
          ease: 'power2.out',
        });
      }, index * 15); // Stagger each ray by 15ms
    });

    // Central flash
    const flash: ClickFlash = {
      x,
      y,
      radius: 0,
      alpha: 1,
    };
    clickFlashRef.current.push(flash);

    gsap.to(flash, {
      radius: 100,
      alpha: 0,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: () => {
        const idx = clickFlashRef.current.indexOf(flash);
        if (idx > -1) clickFlashRef.current.splice(idx, 1);
      },
    });

    // Secondary pulse flash
    const pulse: ClickFlash = {
      x,
      y,
      radius: 0,
      alpha: 0.5,
    };
    clickFlashRef.current.push(pulse);

    gsap.to(pulse, {
      radius: 60,
      alpha: 0,
      duration: 0.2,
      ease: 'power1.out',
      onComplete: () => {
        const idx = clickFlashRef.current.indexOf(pulse);
        if (idx > -1) clickFlashRef.current.splice(idx, 1);
      },
    });
  }, [isMobile, spawnLightning]);

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

        // Calculate drag speed for intensity
        const dragSpeed = Math.sqrt(
          Math.pow(e.clientX - prevX, 2) + Math.pow(e.clientY - prevY, 2)
        );
        const isIntenseDrag = dragSpeed > 20;
        const isMediumDrag = dragSpeed > 12;

        // Spawn lightning during drag
        const spawnInterval = isIntenseDrag ? 0.04 : isMediumDrag ? 0.06 : 0.09;
        if (timeRef.current - lastDragLightningRef.current > spawnInterval && prevX > 0) {
          lastDragLightningRef.current = timeRef.current;

          // Find nearby grid points
          const lightningRadius = isIntenseDrag ? 140 : isMediumDrag ? 110 : 90;
          const spawnChance = isIntenseDrag ? 0.82 : isMediumDrag ? 0.88 : 0.92;

          const grid = gridRef.current;
          for (const point of grid) {
            const dist = Math.sqrt(
              Math.pow(point.x - e.clientX, 2) + Math.pow(point.y - e.clientY, 2)
            );
            if (dist < lightningRadius && Math.random() > spawnChance) {
              spawnLightning(
                { x: e.clientX, y: e.clientY },
                { x: point.x, y: point.y },
                { intense: isIntenseDrag }
              );
            }
          }

          // Spawn trailing particles
          if (Math.random() > 0.6) {
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

          // Calculate drag speed for intensity
          const dragSpeed = Math.sqrt(
            Math.pow(touch.clientX - prevX, 2) + Math.pow(touch.clientY - prevY, 2)
          );
          const isIntenseDrag = dragSpeed > 25;

          // Spawn lightning during drag
          const spawnInterval = isIntenseDrag ? 0.07 : 0.1;
          if (timeRef.current - lastDragLightningRef.current > spawnInterval && prevX > 0) {
            lastDragLightningRef.current = timeRef.current;

            const lightningRadius = isIntenseDrag ? 120 : 90;
            const spawnChance = isIntenseDrag ? 0.85 : 0.9;

            const grid = gridRef.current;
            for (const point of grid) {
              const dist = Math.sqrt(
                Math.pow(point.x - touch.clientX, 2) + Math.pow(point.y - touch.clientY, 2)
              );
              if (dist < lightningRadius && Math.random() > spawnChance) {
                spawnLightning(
                  { x: touch.clientX, y: touch.clientY },
                  { x: point.x, y: point.y },
                  { intense: isIntenseDrag }
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

    // Listen on document to receive events even when other elements are on top
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
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
      const clickParticles = clickParticlesRef.current;
      const dragTrail = dragTrailRef.current;
      const lightnings = lightningsRef.current;
      const clickFlashes = clickFlashRef.current;
      const vortexes = vortexesRef.current;

      // Spawn vortex periodically
      if (time - lastVortexTimeRef.current > (isMobile ? 12 : 8)) {
        lastVortexTimeRef.current = time;
        spawnVortex(width, height);
      }

      // Broadcast active vortex positions for logo particle interaction
      if (vortexes.length > 0) {
        const activeVortexes = vortexes
          .filter(v => v.alpha > 0.3 && v.pullStrength > 0.3)
          .map(v => ({
            x: v.x,
            y: v.y,
            radius: v.radius,
            pullStrength: v.pullStrength,
          }));

        if (activeVortexes.length > 0) {
          window.dispatchEvent(new CustomEvent('vortexUpdate', {
            detail: { vortexes: activeVortexes }
          }));
        }
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

      // Draw vortexes (black holes) - Interstellar style
      for (const vortex of vortexes) {
        if (vortex.alpha > 0 && vortex.radius > 0) {
          ctx.save();
          ctx.translate(vortex.x, vortex.y);

          const r = vortex.radius;
          const alpha = vortex.alpha;

          // Accretion disk parameters (tilted ellipse for 3D effect)
          const diskTilt = 0.3; // How much the disk is tilted (0 = edge-on, 1 = face-on)
          const diskWidth = r * 1.8;
          const diskHeight = r * 1.8 * diskTilt;

          // Draw outer glow / gravitational lensing effect
          const lensGlow = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 2);
          lensGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
          lensGlow.addColorStop(0.3, `rgba(40, 10, 20, ${alpha * 0.3})`);
          lensGlow.addColorStop(0.6, `rgba(20, 5, 15, ${alpha * 0.15})`);
          lensGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = lensGlow;
          ctx.beginPath();
          ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
          ctx.fill();

          // Draw back part of accretion disk (behind the black hole)
          ctx.save();
          ctx.rotate(vortex.rotation * 0.1); // Slow rotation for the disk

          // Back disk (top arc - gravitational lensing makes it visible above)
          ctx.beginPath();
          ctx.ellipse(0, -r * 0.15, diskWidth, diskHeight, 0, Math.PI, 0, true);
          const backDiskGradient = ctx.createLinearGradient(-diskWidth, 0, diskWidth, 0);
          backDiskGradient.addColorStop(0, `rgba(255, 100, 50, ${alpha * 0.2})`);
          backDiskGradient.addColorStop(0.3, `rgba(255, 150, 80, ${alpha * 0.4})`);
          backDiskGradient.addColorStop(0.5, `rgba(255, 200, 120, ${alpha * 0.5})`);
          backDiskGradient.addColorStop(0.7, `rgba(255, 150, 80, ${alpha * 0.4})`);
          backDiskGradient.addColorStop(1, `rgba(255, 80, 40, ${alpha * 0.15})`);
          ctx.strokeStyle = backDiskGradient;
          ctx.lineWidth = r * 0.25;
          ctx.stroke();

          // Photon ring (bright ring very close to event horizon) - back
          ctx.beginPath();
          ctx.ellipse(0, -r * 0.05, r * 0.45, r * 0.45 * diskTilt, 0, Math.PI * 1.1, Math.PI * 1.9, true);
          const photonBack = ctx.createLinearGradient(-r * 0.5, 0, r * 0.5, 0);
          photonBack.addColorStop(0, `rgba(255, 220, 180, ${alpha * 0.3})`);
          photonBack.addColorStop(0.5, `rgba(255, 255, 220, ${alpha * 0.7})`);
          photonBack.addColorStop(1, `rgba(255, 200, 150, ${alpha * 0.2})`);
          ctx.strokeStyle = photonBack;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();

          // Draw event horizon (the black sphere)
          const eventHorizonSize = r * 0.35;
          const horizonGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, eventHorizonSize);
          horizonGradient.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
          horizonGradient.addColorStop(0.7, `rgba(0, 0, 0, ${alpha})`);
          horizonGradient.addColorStop(0.85, `rgba(10, 5, 10, ${alpha * 0.9})`);
          horizonGradient.addColorStop(1, `rgba(30, 10, 20, ${alpha * 0.5})`);
          ctx.fillStyle = horizonGradient;
          ctx.beginPath();
          ctx.arc(0, 0, eventHorizonSize, 0, Math.PI * 2);
          ctx.fill();

          // Draw front part of accretion disk (in front of black hole)
          ctx.save();
          ctx.rotate(vortex.rotation * 0.1);

          // Front disk (bottom arc)
          ctx.beginPath();
          ctx.ellipse(0, r * 0.1, diskWidth, diskHeight, 0, 0, Math.PI, false);
          const frontDiskGradient = ctx.createLinearGradient(-diskWidth, 0, diskWidth, 0);
          // Doppler effect - left side brighter (approaching), right side dimmer (receding)
          frontDiskGradient.addColorStop(0, `rgba(255, 200, 100, ${alpha * 0.9})`);
          frontDiskGradient.addColorStop(0.2, `rgba(255, 180, 80, ${alpha * 0.95})`);
          frontDiskGradient.addColorStop(0.4, `rgba(255, 220, 150, ${alpha})`);
          frontDiskGradient.addColorStop(0.6, `rgba(255, 150, 60, ${alpha * 0.8})`);
          frontDiskGradient.addColorStop(0.8, `rgba(200, 80, 30, ${alpha * 0.5})`);
          frontDiskGradient.addColorStop(1, `rgba(150, 50, 20, ${alpha * 0.3})`);
          ctx.strokeStyle = frontDiskGradient;
          ctx.lineWidth = r * 0.3;
          ctx.stroke();

          // Inner hot ring (closer to event horizon)
          ctx.beginPath();
          ctx.ellipse(0, r * 0.05, r * 0.55, r * 0.55 * diskTilt, 0, 0.1, Math.PI - 0.1, false);
          const innerRingGradient = ctx.createLinearGradient(-r * 0.6, 0, r * 0.6, 0);
          innerRingGradient.addColorStop(0, `rgba(255, 255, 200, ${alpha * 0.8})`);
          innerRingGradient.addColorStop(0.3, `rgba(255, 240, 180, ${alpha})`);
          innerRingGradient.addColorStop(0.5, `rgba(255, 255, 230, ${alpha})`);
          innerRingGradient.addColorStop(0.7, `rgba(255, 220, 150, ${alpha * 0.7})`);
          innerRingGradient.addColorStop(1, `rgba(255, 180, 100, ${alpha * 0.4})`);
          ctx.strokeStyle = innerRingGradient;
          ctx.lineWidth = r * 0.08;
          ctx.stroke();

          // Photon ring - front (very bright, thin)
          ctx.beginPath();
          ctx.ellipse(0, r * 0.02, r * 0.42, r * 0.42 * diskTilt, 0, 0.05, Math.PI - 0.05, false);
          const photonFront = ctx.createLinearGradient(-r * 0.5, 0, r * 0.5, 0);
          photonFront.addColorStop(0, `rgba(255, 250, 230, ${alpha})`);
          photonFront.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
          photonFront.addColorStop(1, `rgba(255, 230, 200, ${alpha * 0.6})`);
          ctx.strokeStyle = photonFront;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.restore();

          // Draw swirling matter particles being pulled in
          ctx.save();
          ctx.rotate(vortex.rotation);
          const numParticles = 12;
          for (let i = 0; i < numParticles; i++) {
            const angle = (i / numParticles) * Math.PI * 2 + vortex.rotation * 2;
            const spiralProgress = ((vortex.rotation * 3 + i * 0.5) % 3) / 3;
            const particleR = r * 0.4 + (1 - spiralProgress) * r * 1.2;
            const particleX = Math.cos(angle + spiralProgress * Math.PI) * particleR;
            const particleY = Math.sin(angle + spiralProgress * Math.PI) * particleR * diskTilt;
            const particleSize = (1 - spiralProgress) * 3 + 1;
            const particleAlpha = (1 - spiralProgress) * alpha * 0.8;

            if (particleAlpha > 0.05) {
              const particleGlow = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, particleSize * 3);
              particleGlow.addColorStop(0, `rgba(255, 200, 150, ${particleAlpha})`);
              particleGlow.addColorStop(0.5, `rgba(255, 150, 100, ${particleAlpha * 0.5})`);
              particleGlow.addColorStop(1, 'rgba(255, 100, 50, 0)');
              ctx.fillStyle = particleGlow;
              ctx.beginPath();
              ctx.arc(particleX, particleY, particleSize * 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();

          // Subtle outer distortion rings
          for (let ring = 0; ring < 3; ring++) {
            const ringRadius = r * (1.3 + ring * 0.25);
            const ringAlpha = alpha * (0.15 - ring * 0.04);
            ctx.strokeStyle = `rgba(100, 50, 70, ${ringAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      // Handle respawning of eaten points
      for (const point of grid) {
        if (point.eaten && point.respawnTime > 0 && time >= point.respawnTime) {
          point.eaten = false;
          point.respawnTime = 0;
          point.x = point.ox;
          point.y = point.oy;
          point.vx = 0;
          point.vy = 0;
          // Animate alpha back in
          gsap.to(point, {
            eatenAlpha: 1,
            duration: 1.5,
            ease: 'power2.out',
          });
        }
      }

      // Update grid points
      for (const point of grid) {
        // Skip eaten points - GSAP handles their animation
        if (point.eaten || point.eatenAlpha < 0.1) continue;

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
        // Skip if point is fully eaten
        if (point.eaten && point.eatenAlpha <= 0) continue;

        for (const connIndex of point.connections) {
          const connPoint = grid[connIndex];
          // Skip if connected point is fully eaten
          if (connPoint.eaten && connPoint.eatenAlpha <= 0) continue;

          const dx = point.x - connPoint.x;
          const dy = point.y - connPoint.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = isMobile ? 120 : 90;
          if (dist < maxDist) {
            const distAlpha = 1 - dist / maxDist;
            const energyPulse = Math.sin(time * 2 + point.pulsePhase) * 0.5 + 0.5;
            // Apply eatenAlpha to both points
            const eatenFactor = Math.min(point.eatenAlpha, connPoint.eatenAlpha);
            const alpha = distAlpha * connectionBaseAlpha * (point.energy + connPoint.energy) * (0.7 + energyPulse * 0.3) * eatenFactor;

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
        // Skip fully eaten points
        if (point.eaten && point.eatenAlpha <= 0) continue;

        const pulse = Math.sin(time * 1.5 + point.pulsePhase) * 0.5 + 0.5;
        const size = 1.5 + pulse * 1;
        // Apply eatenAlpha to base alpha
        const alpha = (0.2 + point.energy * 0.3 + pulse * 0.1) * point.eatenAlpha;

        let isNearMouse = false;
        if (mouse.active) {
          const dist = Math.sqrt(
            Math.pow(point.x - mouse.x, 2) + Math.pow(point.y - mouse.y, 2)
          );
          isNearMouse = dist < gravitationalRadius;
        }

        if (isNearMouse && point.eatenAlpha > 0.5) {
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
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', resize);
    };
  }, [isMobile, initGrid, initOrbs, spawnVortex, spawnBeam, spawnClickExplosion, spawnLightning]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
