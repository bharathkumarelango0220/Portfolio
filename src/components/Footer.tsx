'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MessageSquare, ArrowUp, Compass, Heart } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/70 bg-secondary/30 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-border/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white shadow-md shadow-primary/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-foreground">
                ApexAssure
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Led &amp; engineered by <strong>BHARATHKUMAR E</strong>. Delivering executive-grade, 
              high-converting web solutions, bespoke digital platforms, and high-utility software products.
            </p>

            <div className="pt-2">
              <Link
                href="/products/munnar-tools"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                <span>Featured Product: Munnar Tools</span>
              </Link>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">Platform Links</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#services" className="hover:text-primary transition-colors">Core Services</Link></li>
              <li><Link href="/products/munnar-tools" className="hover:text-primary transition-colors">Munnar Tools Explorer</Link></li>
              <li><Link href="/#process" className="hover:text-primary transition-colors">5-Step Process</Link></li>
              <li><Link href="/#case-studies" className="hover:text-primary transition-colors">Case Studies</Link></li>
              <li><Link href="/#interactive-lab" className="hover:text-primary transition-colors">Audit &amp; Tech Lab</Link></li>
              <li><Link href="/#brief-wizard" className="hover:text-primary transition-colors">Project Brief (FRD)</Link></li>
            </ul>
          </div>

          {/* Direct Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">Direct Contact</div>
            
            <div className="space-y-2 text-sm">
              <a
                href="tel:+918220802736"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card border border-border/70 text-foreground hover:border-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-semibold">+91 8220802736</span>
              </a>

              <a
                href="mailto:bharathkumarelango02@gmail.com"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card border border-border/70 text-foreground hover:border-primary transition-colors overflow-hidden"
              >
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-medium text-xs truncate">bharathkumarelango02@gmail.com</span>
              </a>

              <a
                href="https://wa.me/918220802736?text=Hi%20Bharathkumar,%20I%20am%20interested%20in%20ApexAssure!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card border border-border/70 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold">Chat On WhatsApp Direct</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} ApexAssure Studio. Crafted with precision by</span>
            <span className="font-bold text-foreground">BHARATHKUMAR E</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-primary text-foreground transition-all hover:-translate-y-0.5"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>

      </div>
    </footer>
  );
}
