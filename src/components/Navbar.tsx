'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { CommandPalette } from './CommandPalette';
import { AdminPinModal } from './AdminPinModal';
import { useTheme } from './ThemeProvider';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Search, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  Palette
} from 'lucide-react';

export function Navbar() {
  const { setIsStudioOpen } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/#services' },
    { label: 'Trip Tools', href: '/#featured-product', isFeatured: true },
    { label: 'Process', href: '/#process' },
    { label: 'Case Studies', href: '/#case-studies' },
    { label: 'Audit Lab', href: '/#interactive-lab' },
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled 
            ? 'glass-panel shadow-sm py-2.5 border-b border-border/80' 
            : 'bg-background/80 backdrop-blur-md py-3.5 border-b border-border/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group focus:outline-none rounded-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                  ApexAssure
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <span className="text-[10px] tracking-wider uppercase font-medium text-muted-foreground -mt-0.5">
                Bharathkumar E
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  link.isFeatured
                    ? 'text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <span>{link.label}</span>
                {link.isFeatured && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Minimalist Search Button */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/60 hover:bg-secondary border border-border/70 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              aria-label="Search and command palette"
              title="Search (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-background border border-border/80 rounded text-muted-foreground font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Theme Studio Palette Trigger */}
            <button
              onClick={() => setIsStudioOpen(true)}
              className="p-2 rounded-xl bg-secondary/60 hover:bg-secondary border border-border/70 text-foreground hover:text-primary transition-all cursor-pointer"
              title="Open Theme Studio Reskinner"
              aria-label="Open Theme Studio Reskinner"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Professional Primary CTA */}
            <Link
              href="/#brief-wizard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all"
            >
              <span>Start Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={() => setIsStudioOpen(true)}
              aria-label="Theme Studio"
              className="p-2 rounded-xl bg-secondary/80 text-foreground border border-border/60 active:scale-95 transition-transform"
            >
              <Palette className="w-4 h-4 text-primary" />
            </button>
            <button
              onClick={() => setCmdOpen(true)}
              aria-label="Search"
              className="p-2 rounded-xl bg-secondary/80 text-foreground border border-border/60 active:scale-95 transition-transform"
            >
              <Search className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl bg-secondary/80 text-foreground border border-border/60 hover:bg-secondary active:scale-95 transition-transform"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-border/80 px-4 pt-3 pb-5 mt-2 space-y-3 animate-in slide-in-from-top-3 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{link.label}</span>
                    {link.isFeatured && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        Live Web App
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-border/60 flex flex-col gap-2">
              <Link
                href="/products/trip-tools"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-semibold transition-colors"
              >
                <span>Trip Tools Case Study</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
              <Link
                href="/#brief-wizard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-xs shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Project Brief (FRD)</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Public Search Command Palette Modal */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Secret Keyboard Ctrl+K / Cmd+K Admin PIN Clearance Modal */}
      <AdminPinModal />
    </>
  );
}
