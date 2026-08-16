'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { CommandPalette } from './CommandPalette';
import { AdminPinModal } from './AdminPinModal';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  Compass, 
  ArrowRight,
  Phone,
  MessageSquare,
  Lock
} from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/#services' },
    { label: 'Flagship Product', href: '/#featured-product', badge: 'Trip Tools' },
    { label: 'Process', href: '/#process' },
    { label: 'Case Studies', href: '/#case-studies' },
    { label: 'Audit & Tech Lab', href: '/#interactive-lab' },
    { label: 'Project Brief', href: '/#brief-wizard' },
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled 
            ? 'glass-panel shadow-lg shadow-black/5 py-3 border-b border-border/70' 
            : 'bg-background/80 backdrop-blur-md py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white shadow-md shadow-primary/25 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                ApexAssure
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-muted-foreground -mt-1">
                Studio &bull; Bharathkumar E
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all flex items-center gap-1.5"
              >
                {link.label}
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/60 hover:bg-secondary border border-border/60 text-xs text-muted-foreground hover:text-foreground transition-all"
              aria-label="Search and command palette"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-card border border-border rounded text-muted-foreground font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Primary CTA */}
            <Link
              href="/#brief-wizard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <span>Let&rsquo;s Grow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              aria-label="Search"
              className="p-2 rounded-xl bg-secondary/80 text-foreground border border-border/60"
            >
              <Search className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl bg-secondary/80 text-foreground border border-border/60 hover:bg-secondary focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-panel border-b border-border/80 px-4 pt-4 pb-6 mt-3 space-y-2 animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <span>{link.label}</span>
                  {link.badge ? (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                      {link.badge}
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-border/60 flex flex-col gap-2.5">
              <Link
                href="/products/trip-tools"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold text-sm"
              >
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>Explore Trip Tools Product &rarr;</span>
              </Link>
              <Link
                href="/#brief-wizard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-md shadow-primary/20"
              >
                <Sparkles className="w-4 h-4" />
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
