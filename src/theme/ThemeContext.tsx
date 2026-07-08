import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ThemeName = 'chalk' | 'editorial';

/** Map a URL path to a theme. `/2` → editorial, everything else → chalk (`/1`). */
export function themeFromPath(pathname: string): ThemeName {
  return pathname.replace(/\/+$/, '').endsWith('/2') || pathname === '/2'
    ? 'editorial'
    : 'chalk';
}

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() =>
    typeof window === 'undefined' ? 'chalk' : themeFromPath(window.location.pathname),
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function setTheme(next: ThemeName) {
    setThemeState(next);
    const path = next === 'editorial' ? '/2' : '/1';
    if (window.location.pathname !== path) {
      window.history.replaceState(null, '', path);
    }
  }

  function toggleTheme() {
    setTheme(theme === 'chalk' ? 'editorial' : 'chalk');
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
