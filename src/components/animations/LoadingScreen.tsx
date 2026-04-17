'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { CustomEase } from 'gsap/CustomEase';
import { UniverseScene, type UniverseSceneHandle } from './UniverseScene';

gsap.registerPlugin(useGSAP, CustomEase);

interface LoadingScreenProps {
  onComplete: () => void;
}

const BRAND = 'HCS CREATIVE SOLUTIONS';

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [viewportHeight, setViewportHeight] = useState<string | number>('100dvh');
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const universeHandleRef = useRef<UniverseSceneHandle | null>(null);

  const hudTopLeftRef = useRef<HTMLDivElement>(null);
  const hudTopRightRef = useRef<HTMLDivElement>(null);
  const hudBottomLeftRef = useRef<HTMLDivElement>(null);
  const hudBottomRightRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  const brandRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const subLineRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  const enterWrapRef = useRef<HTMLDivElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const enterTextRef = useRef<HTMLSpanElement>(null);
  const enterRingRef = useRef<HTMLSpanElement>(null);

  const crosshairRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  const progressValue = useRef({ p: 0 });

  // Mobile viewport height
  useEffect(() => {
    const updateHeight = () => {
      const isMobile = window.innerWidth < 1000;
      if (isMobile && window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        setViewportHeight('100dvh');
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
    }
    return () => {
      window.removeEventListener('resize', updateHeight);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
      }
    };
  }, []);

  // Live clock
  useEffect(() => {
    const el = clockRef.current;
    if (!el) return;
    const fmt = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const offsetHrs = -d.getTimezoneOffset() / 60;
      const sign = offsetHrs >= 0 ? '+' : '-';
      el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} · UTC${sign}${Math.abs(offsetHrs)}`;
    };
    fmt();
    const id = window.setInterval(fmt, 1000);
    return () => window.clearInterval(id);
  }, []);

  // -------------------------------------------------------------
  // Entrance animation — HUD first, then wait for universe onReady
  // -------------------------------------------------------------
  useGSAP(
    () => {
      CustomEase.create('uni-smooth', '0.77, 0, 0.175, 1');
      CustomEase.create('uni-reveal', '0.16, 1, 0.3, 1');

      const corners = cornersRef.current.filter(Boolean) as HTMLSpanElement[];

      // Initial state
      gsap.set(
        [
          hudTopLeftRef.current,
          hudTopRightRef.current,
          hudBottomLeftRef.current,
          hudBottomRightRef.current,
          crosshairRef.current,
        ],
        { opacity: 0, y: -6 }
      );
      gsap.set(corners, { opacity: 0, scale: 0.2 });
      gsap.set(subLineRef.current, { opacity: 0 });
      gsap.set(loaderRef.current, { opacity: 0 });
      gsap.set(brandRef.current, { opacity: 0 });

      // Timeline
      const tl = gsap.timeline({ defaults: { ease: 'uni-reveal' } });

      tl.to(corners, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(2)',
        delay: 0.4,
      })
        .to(
          [hudTopLeftRef.current, hudTopRightRef.current],
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
          },
          '-=0.4'
        )
        .to(
          [hudBottomLeftRef.current, hudBottomRightRef.current, crosshairRef.current],
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
          },
          '-=0.4'
        )
        .to(
          brandRef.current,
          { opacity: 1, duration: 0.4 },
          '-=0.3'
        )
        .to(loaderRef.current, { opacity: 1, duration: 0.4 }, '-=0.2')
        .to(subLineRef.current, { opacity: 1, duration: 0.4 }, '-=0.3');
    },
    { scope: rootRef }
  );

  // -------------------------------------------------------------
  // Brand chars reveal (runs once after mount)
  // -------------------------------------------------------------
  useGSAP(
    () => {
      const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
      if (chars.length === 0) return;

      gsap.set(chars, { yPercent: 120, opacity: 0 });

      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        stagger: { each: 0.03, from: 'start' },
        ease: 'uni-smooth',
        delay: 0.9,
      });

      // Scramble effect that settles to final chars over 0.8s
      const scrambleSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*#@$';
      gsap.to(
        {},
        {
          duration: 0.8,
          delay: 0.95,
          ease: 'none',
          onUpdate: function () {
            const p = this.progress();
            chars.forEach((c, i) => {
              const final = c.dataset.final || '';
              if (final === ' ') return;
              const revealed = p > i / chars.length;
              c.textContent = revealed
                ? final
                : scrambleSet[Math.floor(Math.random() * scrambleSet.length)];
            });
          },
          onComplete: () => {
            chars.forEach((c) => {
              c.textContent = c.dataset.final || '';
            });
          },
        }
      );
    },
    { scope: rootRef }
  );

  // -------------------------------------------------------------
  // Progress counter (visual only — paced by universe ready)
  // -------------------------------------------------------------
  useGSAP(
    () => {
      const tween = gsap.to(progressValue.current, {
        p: 100,
        duration: 2.4,
        delay: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (percentRef.current) {
            percentRef.current.textContent = String(
              Math.floor(progressValue.current.p)
            ).padStart(3, '0');
          }
        },
        onComplete: () => {
          setIsReady(true);
        },
      });
      return () => {
        tween.kill();
      };
    },
    { scope: rootRef }
  );

  // -------------------------------------------------------------
  // When ready: swap loader → ENTER button
  // -------------------------------------------------------------
  useGSAP(
    (_ctx, contextSafe) => {
      if (!isReady || !contextSafe) return;

      const tl = gsap.timeline({ defaults: { ease: 'uni-smooth' } });
      tl.to(loaderRef.current, {
        opacity: 0,
        y: -6,
        duration: 0.35,
        ease: 'power2.in',
      })
        .set(loaderRef.current, { display: 'none' })
        .set(enterWrapRef.current, { display: 'block' })
        .fromTo(
          enterWrapRef.current,
          { opacity: 0, y: 16, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }
        )
        .fromTo(
          hintRef.current,
          { opacity: 0, y: -4 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.2'
        );

      // Button magnetic + ring pulse
      const btn = enterBtnRef.current;
      const text = enterTextRef.current;
      const ring = enterRingRef.current;
      if (!btn || !text || !ring) return;

      const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });

      const ringPulse = gsap.to(ring, {
        scale: 1.18,
        opacity: 0,
        duration: 1.4,
        repeat: -1,
        ease: 'power2.out',
      });

      const breathe = gsap.to(btn, {
        scale: 1.04,
        duration: 1.7,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

      const onMove = contextSafe((e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const rx = e.clientX - rect.left - rect.width / 2;
        const ry = e.clientY - rect.top - rect.height / 2;
        xTo(rx * 0.35);
        yTo(ry * 0.5);
      });

      const onEnter = contextSafe(() => {
        breathe.pause();
        gsap.to(text, {
          letterSpacing: '0.35em',
          duration: 0.4,
        });
      });

      const onLeave = contextSafe(() => {
        xTo(0);
        yTo(0);
        breathe.resume();
        gsap.to(text, {
          letterSpacing: '0.22em',
          duration: 0.4,
        });
      });

      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseenter', onEnter);
      btn.addEventListener('mouseleave', onLeave);

      return () => {
        btn.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseenter', onEnter);
        btn.removeEventListener('mouseleave', onLeave);
        ringPulse.kill();
        breathe.kill();
      };
    },
    { scope: rootRef, dependencies: [isReady] }
  );

  // -------------------------------------------------------------
  // Exit: warp through the universe, then resolve
  // -------------------------------------------------------------
  const handleEnter = async () => {
    if (isExiting) return;
    setIsExiting(true);

    const chars = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    const corners = cornersRef.current.filter(Boolean) as HTMLSpanElement[];

    // Collapse UI slightly before warp
    const uiOut = gsap.timeline({ defaults: { ease: 'power2.in' } });
    uiOut
      .to(enterWrapRef.current, {
        opacity: 0,
        y: 16,
        scale: 0.92,
        duration: 0.3,
      })
      .to(
        [hintRef.current, subLineRef.current, hudBottomLeftRef.current, hudBottomRightRef.current],
        {
          opacity: 0,
          y: 8,
          duration: 0.3,
        },
        '<'
      )
      .to(
        chars,
        {
          y: -14,
          opacity: 0,
          stagger: { each: 0.015, from: 'end' },
          duration: 0.35,
        },
        '<'
      )
      .to(
        [hudTopLeftRef.current, hudTopRightRef.current],
        { opacity: 0, y: -6, duration: 0.3 },
        '<+=0.1'
      )
      .to(
        corners,
        {
          opacity: 0,
          scale: 0.3,
          stagger: { each: 0.03, from: 'random' },
          duration: 0.25,
        },
        '<'
      );

    await new Promise<void>((r) => uiOut.eventCallback('onComplete', r));

    // Kick the universe into warp
    if (universeHandleRef.current) {
      await universeHandleRef.current.warp();
    }

    // Final fade of the whole container
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete,
    });
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#040408] font-mono select-none"
      style={{ height: viewportHeight }}
    >
      {/* 3D universe */}
      <UniverseScene
        ref={universeHandleRef}
        className="absolute inset-0"
      />

      {/* TOP HUD — left */}
      <div
        ref={hudTopLeftRef}
        className="absolute top-6 left-6 z-10 text-[10px] tracking-[0.3em] uppercase text-white/60 flex items-center gap-2"
      >
        <span className="relative inline-block w-1.5 h-1.5">
          <span className="absolute inset-0 bg-accent rounded-full animate-ping" />
          <span className="relative block w-full h-full bg-accent rounded-full" />
        </span>
        HCS.OS · BOOT v4.7
      </div>

      {/* TOP HUD — right (clock) */}
      <div
        ref={hudTopRightRef}
        className="absolute top-6 right-6 z-10 text-[10px] tracking-[0.28em] uppercase text-white/50 tabular-nums"
      >
        <span ref={clockRef}>--:--:--</span>
      </div>

      {/* Center content — perfectly centered via flex */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pointer-events-none">
        {/* Brand (top of center stack) */}
        <div
          ref={brandRef}
          className="flex flex-wrap justify-center gap-x-[0.55em] mb-8 md:mb-10"
        >
          {BRAND.split(' ').map((word, wIdx) => (
            <div key={wIdx} className="flex overflow-hidden">
              {word.split('').map((char, cIdx) => {
                const flatIndex =
                  BRAND.split(' ')
                    .slice(0, wIdx)
                    .reduce((acc, w) => acc + w.length, 0) + cIdx;
                return (
                  <span
                    key={cIdx}
                    ref={(el) => {
                      charsRef.current[flatIndex] = el;
                    }}
                    data-final={char}
                    className="inline-block text-[11px] md:text-sm tracking-[0.38em] text-white/90 font-medium will-change-transform"
                    style={{ textShadow: '0 0 20px rgba(220, 38, 38, 0.35)' }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {/* Crosshair */}
        <div
          ref={crosshairRef}
          className="relative w-5 h-5 mb-8 md:mb-10"
          aria-hidden="true"
        >
          <span className="absolute top-1/2 left-0 right-0 h-px bg-accent/70 -translate-y-1/2" />
          <span className="absolute left-1/2 top-0 bottom-0 w-px bg-accent/70 -translate-x-1/2" />
          <span className="absolute inset-1 border border-accent/40 rounded-full" />
          <span className="absolute inset-2 bg-accent/60 rounded-full blur-[2px]" />
        </div>

        {/* Loader (before ready) */}
        <div
          ref={loaderRef}
          className="flex flex-col items-center gap-5 pointer-events-auto"
        >
          <div className="flex items-baseline gap-1">
            <span
              ref={percentRef}
              className="text-5xl md:text-7xl font-bold text-white tracking-tighter tabular-nums"
              style={{
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 0 30px rgba(220, 38, 38, 0.3)',
              }}
            >
              000
            </span>
            <span className="text-xl md:text-3xl text-accent font-bold">%</span>
          </div>

          <p className="text-[10px] tracking-[0.4em] uppercase text-white/40">
            Calibrating stellar coordinates
          </p>
        </div>

        {/* Enter button (shown when ready) */}
        <div
          ref={enterWrapRef}
          className="pointer-events-auto flex flex-col items-center gap-5"
          style={{ display: 'none' }}
        >
          <button
            ref={enterBtnRef}
            onClick={handleEnter}
            className="group relative px-14 py-5 cursor-pointer will-change-transform"
            aria-label="Enter site"
          >
            {/* Pulsing ring */}
            <span
              ref={enterRingRef}
              className="absolute inset-0 border border-accent rounded-full pointer-events-none"
            />

            {/* Primary border */}
            <span className="absolute inset-0 border border-accent/70 rounded-full group-hover:border-accent transition-colors duration-300" />

            {/* Fill on hover */}
            <span
              className="absolute inset-0 rounded-full bg-accent origin-center scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"
            />

            {/* Inner glow */}
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 30px rgba(220, 38, 38, 0.2)',
              }}
            />

            {/* Label */}
            <span
              ref={enterTextRef}
              className="relative z-10 text-[11px] md:text-xs font-bold tracking-[0.22em] uppercase text-white/90 group-hover:text-white flex items-center gap-3"
            >
              <span className="block w-4 h-px bg-current" />
              Enter the site
              <span className="block w-4 h-px bg-current" />
            </span>
          </button>

          <p
            ref={hintRef}
            className="text-[9px] tracking-[0.4em] uppercase text-white/30"
          >
            Or <span className="text-accent/80">click anywhere</span> to shift the stars
          </p>
        </div>
      </div>

      {/* BOTTOM HUD — left (coordinates) */}
      <div
        ref={hudBottomLeftRef}
        className="absolute bottom-6 left-6 z-10 text-[10px] tracking-[0.26em] uppercase text-white/30 flex items-center gap-3"
      >
        <span className="inline-block w-2 h-2 border border-accent/50 rotate-45" />
        SECTOR 07 · SAGITTARIUS ARM
      </div>

      {/* BOTTOM HUD — right (status) */}
      <div
        ref={hudBottomRightRef}
        className="absolute bottom-6 right-6 z-10 text-[10px] tracking-[0.26em] uppercase text-white/30 flex items-center gap-3"
      >
        HABAEB CREATIVE
        <span className="inline-block w-2 h-2 bg-accent/70 rounded-full animate-pulse" />
      </div>

      {/* Sublabel between brand and loader area */}
      <div
        ref={subLineRef}
        className="absolute top-[calc(50%-10rem)] md:top-[calc(50%-12rem)] left-1/2 -translate-x-1/2 text-[9px] tracking-[0.5em] uppercase text-accent/70 pointer-events-none z-10"
      >
        — Entering orbit —
      </div>

      {/* CORNERS */}
      <span
        ref={(el) => {
          cornersRef.current[0] = el;
        }}
        className="absolute top-4 left-4 w-10 h-10 border-l border-t border-accent/70 pointer-events-none z-10"
      />
      <span
        ref={(el) => {
          cornersRef.current[1] = el;
        }}
        className="absolute top-4 right-4 w-10 h-10 border-r border-t border-accent/70 pointer-events-none z-10"
      />
      <span
        ref={(el) => {
          cornersRef.current[2] = el;
        }}
        className="absolute bottom-4 left-4 w-10 h-10 border-l border-b border-accent/70 pointer-events-none z-10"
      />
      <span
        ref={(el) => {
          cornersRef.current[3] = el;
        }}
        className="absolute bottom-4 right-4 w-10 h-10 border-r border-b border-accent/70 pointer-events-none z-10"
      />
    </div>
  );
}
