'use client';

import { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { CustomCursor } from './CustomCursor';
import { SmoothScroll } from './SmoothScroll';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <CustomCursor />
      <SmoothScroll>
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          {children}
        </div>
      </SmoothScroll>
    </>
  );
}
