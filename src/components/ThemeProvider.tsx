'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ModeTheme = 'light' | 'dark';
export type AccentTheme = 'default' | 'emerald' | 'cyberpunk' | 'gold' | 'matrix' | 'crimson';

export interface ThemePreset {
  id: AccentTheme;
  name: string;
  tagline: string;
  primaryColor: string;
  previewGradient: string;
  icon: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    name: 'Apex Indigo',
    tagline: 'Modern Silicon Valley standard',
    primaryColor: '#3b82f6',
    previewGradient: 'from-blue-600 to-indigo-600',
    icon: '⚡',
  },
  {
    id: 'emerald',
    name: 'Emerald Rainforest',
    tagline: 'Kerala Tourism & Trip Tools aesthetic',
    primaryColor: '#10b981',
    previewGradient: 'from-emerald-500 to-teal-500',
    icon: '🌿',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    tagline: 'High-voltage electric violet & cyan',
    primaryColor: '#a855f7',
    previewGradient: 'from-purple-600 to-pink-500',
    icon: '🌌',
  },
  {
    id: 'gold',
    name: 'Obsidian Luxe Gold',
    tagline: 'Executive champagne gold & obsidian',
    primaryColor: '#f59e0b',
    previewGradient: 'from-amber-400 to-yellow-600',
    icon: '👑',
  },
  {
    id: 'matrix',
    name: 'Matrix Terminal',
    tagline: 'Phosphor hacker green & dark tech',
    primaryColor: '#22c55e',
    previewGradient: 'from-green-500 to-emerald-600',
    icon: '👾',
  },
  {
    id: 'crimson',
    name: 'Crimson Velocity',
    tagline: 'Bold high-conversion ruby & coral',
    primaryColor: '#f43f5e',
    previewGradient: 'from-rose-500 to-red-600',
    icon: '🏎️',
  },
];

interface ThemeContextType {
  theme: ModeTheme;
  toggleTheme: () => void;
  accent: AccentTheme;
  setAccent: (accent: AccentTheme) => void;
  isStudioOpen: boolean;
  setIsStudioOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  accent: 'default',
  setAccent: () => {},
  isStudioOpen: false,
  setIsStudioOpen: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ModeTheme>('light');
  const [accent, setAccentState] = useState<AccentTheme>('default');
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load Dark/Light Mode
    const savedTheme = localStorage.getItem('apexassure-theme') as ModeTheme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }

    // Load Accent Preset
    const savedAccent = localStorage.getItem('apexassure-accent') as AccentTheme | null;
    if (savedAccent && THEME_PRESETS.some(p => p.id === savedAccent)) {
      setAccentState(savedAccent);
      document.documentElement.setAttribute('data-accent', savedAccent);
    } else {
      document.documentElement.setAttribute('data-accent', 'default');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('apexassure-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const setAccent = (newAccent: AccentTheme) => {
    setAccentState(newAccent);
    localStorage.setItem('apexassure-accent', newAccent);
    document.documentElement.setAttribute('data-accent', newAccent);
  };

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        accent, 
        setAccent,
        isStudioOpen,
        setIsStudioOpen
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
