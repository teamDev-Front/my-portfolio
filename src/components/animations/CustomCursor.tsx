'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    // Check for touch device
    if ('ontouchstart' in window) {
      cursor.style.display = 'none';
      dot.style.display = 'none';
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target;

      // Check if target is an Element (not a text node or other node type)
      if (!(target instanceof Element)) return;

      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        (target as HTMLElement).dataset?.cursor
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const cursorClasses = `fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-all duration-200 hidden lg:flex items-center justify-center ${
    isHovering ? 'w-20 h-20' : 'w-10 h-10'
  } ${isClicking ? 'scale-75' : 'scale-100'}`;

  const ringClasses = `rounded-full border-2 w-full h-full transition-all duration-200 ${
    isHovering ? 'border-white bg-white/10' : 'border-white/50'
  }`;

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={cursorClasses}
        style={{ top: 0, left: 0 }}
      >
        <div className={ringClasses} />
      </div>

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed w-1.5 h-1.5 bg-accent rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
        style={{ top: 0, left: 0 }}
      />
    </>
  );
}
