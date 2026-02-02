'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextScrambleProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  scrambleOnScroll?: boolean;
  delay?: number;
}

const chars = '!<>-_\\/[]{}—=+*^?#________';

export function TextScramble({
  children,
  className = '',
  as: Tag = 'span',
  scrambleOnScroll = true,
  delay = 0,
}: TextScrambleProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elementRef = useRef<any>(null);
  const [displayText, setDisplayText] = useState(children);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated) return;

    const finalText = children;
    let frame = 0;
    const totalFrames = 30;

    const scramble = () => {
      const progress = frame / totalFrames;
      const revealedLength = Math.floor(finalText.length * progress);

      let result = '';
      for (let i = 0; i < finalText.length; i++) {
        if (i < revealedLength) {
          result += finalText[i];
        } else if (finalText[i] === ' ') {
          result += ' ';
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(result);
      frame++;

      if (frame <= totalFrames) {
        requestAnimationFrame(scramble);
      } else {
        setDisplayText(finalText);
        setHasAnimated(true);
      }
    };

    if (scrambleOnScroll) {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        onEnter: () => {
          setTimeout(() => {
            scramble();
          }, delay * 1000);
        },
        once: true,
      });
    } else {
      setTimeout(() => {
        scramble();
      }, delay * 1000);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [children, scrambleOnScroll, delay, hasAnimated]);

  return (
    <Tag
      ref={elementRef}
      className={`font-mono ${className}`}
    >
      {displayText}
    </Tag>
  );
}
