'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SmoothScroll } from '@/components/shell/SmoothScroll';
import { BackgroundWash } from '@/components/shell/BackgroundWash';
import { GlobalHud } from '@/components/shell/GlobalHud';
import { NoiseOverlay } from '@/components/shell/NoiseOverlay';
import { StageDriver } from '@/components/shell/StageDriver';
import { experienceActions } from '@/stores/experienceStore';

/**
 * The persistent engine — mounted once in the locale layout, wraps every route:
 * one grain layer, one HUD, one wash, one smooth-scroll pipeline. Pages are content
 * travelling through this machine; the shell never remounts on navigation.
 *
 * Z-layers: wash 0 · content 10 · hud 40 · header 50 · project overlay 60 · grain 70.
 *
 * CRITICAL: children render unconditionally — server HTML is never gated behind
 * client state (the old splash-screen `mounted` gate killed SEO for the whole site).
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Device quality tier — sensed once. Reduced-motion is handled live by hooks;
  // this only classifies hardware (memory / save-data) into high | reduced.
  useEffect(() => {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const weak = (nav.deviceMemory ?? 8) <= 4 || nav.connection?.saveData === true;
    if (weak) experienceActions.setQuality('reduced');
  }, []);

  // Route changes: overlays close, the stage resets. The homepage's StageDriver takes
  // over on scroll; internal routes stay on "page" (no era wash flood).
  useEffect(() => {
    experienceActions.setMenuOpen(false);
    experienceActions.closeProject();
    const isHome = /^\/(pt-BR|en)\/?$/.test(pathname);
    experienceActions.setStage(isHome ? 'hero' : 'page');
  }, [pathname]);

  return (
    <SmoothScroll>
      <BackgroundWash />
      <div className="relative z-10">{children}</div>
      <GlobalHud />
      <NoiseOverlay />
      <StageDriver />
    </SmoothScroll>
  );
}
