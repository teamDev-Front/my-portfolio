'use client';

import { useState, useLayoutEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';

interface AppWrapperProps {
  children: React.ReactNode;
}

// Safe layout effect that avoids SSR warnings
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : () => {};

export function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = useState(false);

  // useLayoutEffect runs synchronously before browser paint,
  // so the user never sees the hidden state
  useIsomorphicLayoutEffect(() => {
    setMounted(true);
    // Check if this is a return visit in the same session
    const hasLoaded = sessionStorage.getItem('hcs-loaded');
    if (hasLoaded) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setShowContent(true);
    sessionStorage.setItem('hcs-loaded', 'true');
  };

  return (
    // visibility:hidden prevents flash - useLayoutEffect flips it before paint
    <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transition: showContent ? 'opacity 0.5s ease' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
