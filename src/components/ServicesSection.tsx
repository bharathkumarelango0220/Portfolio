'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Code, 
  ArrowRight, 
  Check, 
  Sliders, 
  Lock, 
  Sparkles,
  Gauge
} from 'lucide-react';

interface Service {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  points: string[];
  metric: string;
  metricLabel: string;
  color: string;
}

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<string>('speed');

  const services: Service[] = [
    {
      id: 'speed',
      icon: Zap,
      title: 'Lightning Fast Performance',
      subtitle: 'Sub-second loads that keep bounce rates at an absolute minimum.',
      badge: 'Core Web Vitals 99+',
      description:
        'A 1-second delay in page load time can cause a 7% loss in conversions. We engineer every script, image asset, and database query for instantaneous rendering on 4G, 5G, and desktop connections.',
      points: [
        'Edge CDN caching & next-gen WebP/AVIF asset optimization',
        'Minimal bundle sizing with zero bloat architecture',
        'Sub-second First Contentful Paint (FCP) & Time to Interactive (TTI)',
        'Server-Side Rendering (SSR) & Static Generation for instant feel',
      ],
      metric: '0.8s',
      metricLabel: 'Average First Page Load',
      color: 'from-amber-500/20 to-orange-500/10 text-amber-500 border-amber-500/30',
    },
    {
      id: 'security',
      icon: ShieldCheck,
      title: 'Secure & Trusted Architecture',
      subtitle: 'Bank-grade security protocols ensuring complete data privacy.',
      badge: 'Enterprise Security',
      description:
        'Trust is the currency of the internet. We implement modern HTTPS protocols, sanitized form inputs, rate-limiting, and OWASP-compliant data handling so your customers know their data is 100% protected.',
      points: [
        'Automated SSL / TLS certificates & Content Security Policies (CSP)',
        'XSS, CSRF, and SQL Injection prevention on all API endpoints',
        'Zero-leak form validation & secure database isolation',
        'Strict GDPR & privacy-first data handling standards',
      ],
      metric: '99.99%',
      metricLabel: 'Uptime & Integrity Guarantee',
      color: 'from-blue-500/20 to-cyan-500/10 text-blue-500 border-blue-500/30',
    },
    {
      id: 'roi',
      icon: TrendingUp,
      title: 'ROI-Focused Conversion Design',
      subtitle: 'Engineered specifically to convert casual traffic into paying clients.',
      badge: 'Revenue Multiplier',
      description:
        'A beautiful website that does not generate revenue is just expensive art. Every typography choice, button placement, and copywriting hook is designed to guide users straight into your sales pipeline.',
      points: [
        'Conversion-optimized layout architecture & high-contrast CTAs',
        'Micro-animations that draw attention to key value propositions',
        'Frictionless multi-step inquiry wizards & direct WhatsApp links',
        'Measurable Google Analytics & conversion event tracking',
      ],
      metric: '+45%',
      metricLabel: 'Average Client Conversion Boost',
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-500 border-emerald-500/30',
    },
    {
      id: 'fullstack',
      icon: Code,
      title: 'Custom Fullstack Web Engineering',
      subtitle: 'Dynamic web applications with interactive tools, APIs, and databases.',
      badge: 'Custom Architecture',
      description:
        'From custom travel companions like Trip Tools to interactive project estimators, client dashboards, and cloud databases, we build scalable software tailored to your exact business workflow.',
      points: [
        'Custom RESTful APIs & database integrations (SQLite, PostgreSQL, Firestore)',
        'Interactive client portals, admin dashboards & lead managers',
        'PDF document generation, vector reporting & automated invoices',
        'Full PWA capabilities for installable, app-like mobile experiences',
      ],
      metric: '100%',
      metricLabel: 'Custom Bespoke Codebase',
      color: 'from-purple-500/20 to-indigo-500/10 text-purple-500 border-purple-500/30',
    },
  ];

  const activeService = services.find((s) => s.id === selectedService) || services[0];
  const ActiveIcon = activeService.icon;

  return (
    <section id="services" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Your Business Needs ApexAssure</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Services Built to{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Elevate Your Authority
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            We don&rsquo;t just write code — we build revenue engines that establish market leadership, 
            protect your business credibility, and multiply customer engagement.
          </p>
        </div>

        {/* 4 Interactive Service Tabs (Pills) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = service.id === selectedService;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-5 rounded-2xl text-left transition-all duration-200 glass-panel border flex flex-col justify-between ${
                  isSelected
                    ? 'border-primary shadow-lg shadow-primary/15 bg-card ring-2 ring-primary/20 -translate-y-1'
                    : 'border-border/70 hover:border-primary/40 hover:bg-card/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center ${service.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {service.badge}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-foreground mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {service.subtitle}
                  </p>
                </div>
                
                <div className="pt-4 mt-2 border-t border-border/50 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
                    {isSelected ? 'Currently Viewing' : 'Explore Details'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-primary' : 'text-muted-foreground'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Service Detailed Spotlight Display */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10 border border-primary/20 shadow-2xl relative overflow-hidden animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-md ${activeService.color}`}>
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Detailed Capability</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    {activeService.title}
                  </h3>
                </div>
              </div>

              <p className="text-base text-muted-foreground leading-relaxed">
                {activeService.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeService.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-card/60 p-3.5 rounded-xl border border-border/70">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-foreground font-medium">{pt}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/60">
                <Link
                  href="/#brief-wizard"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-primary/25 transition-all"
                >
                  Start Project Brief
                </Link>
                <Link
                  href="/#interactive-lab"
                  className="px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground font-semibold text-xs transition-all"
                >
                  Launch Interactive Lab &rarr;
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-br from-primary/10 via-secondary to-background p-6 rounded-2xl border border-primary/20 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto">
                <Gauge className="w-6 h-6" />
              </div>
              <div>
                <div className="font-serif text-4xl sm:text-5xl font-bold text-primary mb-1">
                  {activeService.metric}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {activeService.metricLabel}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-normal pt-2 border-t border-border/60">
                Validated across real-world deployments and Google PageSpeed Insights benchmarks.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
