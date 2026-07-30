'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useExperience, type JourneyStage } from '@/stores/experienceStore';

/**
 * THE global HUD — mounted ONCE in AppShell, never per section. The discreet terminal
 * chrome of HCS.OS: corner readouts in mono type at the viewport edges. Values animate
 * through GSAP writes to textContent — ZERO React re-renders per frame. The HUD recedes
 * while a project overlay owns the screen ("you're inside the work — no control panel").
 * Decorative: aria-hidden, pointer-events-none, desktop only (lg+).
 */

const SEC: Record<JourneyStage, { n: string; label: string }> = {
  hero: { n: '00', label: 'SURFACE' },
  about: { n: '01', label: 'ABOUT' },
  services: { n: '02', label: 'SERVICES' },
  portfolio: { n: '03', label: 'PORTFOLIO' },
  results: { n: '04', label: 'RESULTS' },
  contact: { n: '05', label: 'CONTACT' },
  footer: { n: '05', label: 'CONTACT' },
  page: { n: '--', label: 'PAGE' },
};

export function GlobalHud() {
  const overlayOpen = useExperience((s) => s.activeProjectSlug !== null);
  const stage = useExperience((s) => s.stage);
  const sec = SEC[stage];

  return (
    <div
      aria-hidden
      data-hud
      className={`pointer-events-none fixed inset-0 z-40 hidden transition-opacity duration-500 lg:block ${
        overlayOpen ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <HudTelemetry />

      {/* Bottom-left — depth + section readout */}
      <div className="hud-readout absolute bottom-[22px] left-(--page-margin) text-[10px]">
        <p>
          Z-DEPTH <span data-hud-z>0.00000</span>
        </p>
        <p className="mt-1">
          SEC {sec.n}/05 · {sec.label}
        </p>
      </div>

      {/* Bottom-right — clock + coordinates (Jacareí SP) */}
      <div className="hud-readout absolute bottom-[22px] right-(--page-margin) text-right text-[10px]">
        <p>
          <span data-hud-clock>--:--:--</span> LOCAL
        </p>
        <p className="mt-1">23.3053 S / 45.9658 W</p>
      </div>

      {/* Right-top — system tag (below the header) */}
      <div className="hud-readout absolute right-(--page-margin) top-[96px] text-right text-[10px]">
        <p>HCS.OS V2.0</p>
        <p className="mt-1">
          <span className="mr-1.5 inline-block h-[5px] w-[5px] rounded-full bg-red-bright align-middle" />
          SYS ONLINE
        </p>
      </div>
    </div>
  );
}

/** Scroll-linked Z-DEPTH + wall clock, written straight to textContent. */
function HudTelemetry() {
  const reduced = useReducedMotion();

  useEffect(() => {
    const clockEl = document.querySelector<HTMLElement>('[data-hud-clock]');
    const writeClock = () => {
      if (!clockEl) return;
      clockEl.textContent = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    };
    writeClock();
    const clock = window.setInterval(writeClock, 1000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    if (reduced) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const zEl = document.querySelector<HTMLElement>('[data-hud-z]');
      if (zEl) {
        ScrollTrigger.create({
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          onUpdate: (self) => {
            zEl.textContent = (self.progress * 4.20408).toFixed(5);
          },
        });
      }
    });

    return () => ctx.revert();
  }, [reduced]);

  return null;
}
