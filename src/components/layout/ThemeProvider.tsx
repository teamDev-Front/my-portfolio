'use client';

import { createContext, useContext, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * Theme state lives on <html> (the class the blocking inline script in app/layout.tsx
 * already applied before first paint), not in React state. React subscribes to that one
 * source of truth through useSyncExternalStore, so there is no mount flag, no effect
 * writing state on mount, and no window where the two disagree.
 */
const listeners = new Set<() => void>();

function currentTheme(): Theme {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, { attributeFilter: ['class'] });
  return () => {
    listeners.delete(callback);
    observer.disconnect();
  };
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('light', theme === 'light');
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Private mode / storage disabled: the theme still applies for this session.
  }
  listeners.forEach((l) => l());
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => 'dark' as Theme);

  const toggleTheme = () => applyTheme(theme === 'dark' ? 'light' : 'dark');

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
