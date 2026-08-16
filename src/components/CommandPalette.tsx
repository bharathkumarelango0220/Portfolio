'use client';

import React, { useState, useEffect } from 'react';
import { Search, Compass, Layers, Zap, Shield, FileText, Phone, MessageSquare, ExternalLink, X, Cpu, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CommandItem {
  title: string;
  category: string;
  icon: React.ElementType;
  href?: string;
  external?: boolean;
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items: CommandItem[] = [
    {
      title: 'Flagship Product: Trip Tools — Travel Companion & Expense Tracker',
      category: 'Featured Product',
      icon: Compass,
      href: '/products/trip-tools',
    },
    {
      title: 'Launch Live Trip Tools (triptools.vercel.app)',
      category: 'Featured Product',
      icon: ExternalLink,
      href: 'https://triptools.vercel.app/',
      external: true,
    },
    {
      title: 'Interactive Website Health & Audit Lab',
      category: 'Interactive Tools',
      icon: Cpu,
      href: '/#interactive-lab',
    },
    {
      title: 'Feature Blueprint Builder',
      category: 'Interactive Tools',
      icon: Layers,
      href: '/#interactive-lab',
    },
    {
      title: 'Lightning Fast Web Engineering',
      category: 'Services',
      icon: Zap,
      href: '/#services',
    },
    {
      title: 'Secure & Trusted Architecture',
      category: 'Services',
      icon: Shield,
      href: '/#services',
    },
    {
      title: '5-Step Transparent Process',
      category: 'Process',
      icon: Layers,
      href: '/#process',
    },
    {
      title: 'Filterable Portfolio & Case Studies',
      category: 'Case Studies',
      icon: Layers,
      href: '/#case-studies',
    },
    {
      title: '6-Step Project Brief (FRD) Form',
      category: 'Start Project',
      icon: FileText,
      href: '/#brief-wizard',
    },
    {
      title: 'Direct WhatsApp Chat with Bharathkumar',
      category: 'Quick Contact',
      icon: MessageSquare,
      href: 'https://wa.me/918220802736?text=Hi%20Bharathkumar,%20I%20am%20interested%20in%20ApexAssure%20services!',
      external: true,
    },
    {
      title: 'Direct Phone Call (+91 8220802736)',
      category: 'Quick Contact',
      icon: Phone,
      href: 'tel:+918220802736',
    },
  ];

  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-border/60 gap-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            placeholder="Search services, products, tools, case studies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-foreground text-sm placeholder:text-muted-foreground"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/30">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No matching pages or tools found for &quot;{query}&quot;.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href || '#'}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/70 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  {item.external ? (
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                  )}
                </Link>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-secondary/40 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>ApexAssure Studio Navigation</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
