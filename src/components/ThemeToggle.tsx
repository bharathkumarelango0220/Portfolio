'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle light or dark theme"
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground transition-all duration-200 border border-border/60 hover:scale-105 active:scale-95 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 -rotate-12" />
      )}
    </button>
  );
}
