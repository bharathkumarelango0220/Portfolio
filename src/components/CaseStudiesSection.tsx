'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  ExternalLink, 
  Layers, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  ArrowUpRight, 
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'web-app' | 'agency' | 'saas' | 'ecommerce';
  categoryLabel: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  description: string;
  liveUrl?: string;
  internalUrl?: string;
  isFlagship?: boolean;
  color: string;
}

export function CaseStudiesSection() {
  const [filter, setFilter] = useState<'all' | 'web-app' | 'agency' | 'saas' | 'ecommerce'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 'munnar-tools',
      title: 'Munnar Explorer & Trip Expense Tracker',
      subtitle: 'Real-time travel navigation & 6-category trip expense management platform',
      category: 'web-app',
      categoryLabel: 'Flagship Web App',
      tags: ['React 19', 'TailwindCSS', 'Firebase', 'PWA', 'PDF Engine'],
      metrics: [
        { label: 'Core Web Vitals', value: '100%' },
        { label: 'Budget Categories', value: '6 Types' },
        { label: 'GPS Attractions', value: '15+ Spots' },
      ],
      description:
        'A comprehensive travel companion built for tourists exploring Munnar, Kerala. Features integrated Google Maps GPS route navigation, real-time multi-category expense balancing, and instant PDF summary trip downloads.',
      liveUrl: 'https://munnartools.vercel.app/',
      internalUrl: '/products/munnar-tools',
      isFlagship: true,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'zenith-portal',
      title: 'Zenith Health & Wellness Platform',
      subtitle: 'Modern patient booking & medical services portal with instant appointment sync',
      category: 'agency',
      categoryLabel: 'Healthcare / Web Portal',
      tags: ['Next.js 15', 'TypeScript', 'TailwindCSS', 'Fullstack API', 'PostgreSQL'],
      metrics: [
        { label: 'Booking Latency', value: '0.6s' },
        { label: 'Patient Retention', value: '+52%' },
        { label: 'Mobile Bookings', value: '84%' },
      ],
      description:
        'A high-performance digital healthcare portal engineered for frictionless specialist booking, real-time appointment reminders, and HIPAA-compliant secure records handling.',
      internalUrl: '#',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
    },
    {
      id: 'venturescale-saas',
      title: 'VentureScale Enterprise SaaS Dashboard',
      subtitle: 'Real-time telemetry and revenue tracking suite for B2B tech organizations',
      category: 'saas',
      categoryLabel: 'B2B SaaS',
      tags: ['React', 'Next.js', 'Chart.js', 'PostgreSQL', 'Tailwind'],
      metrics: [
        { label: 'Data Latency', value: '<50ms' },
        { label: 'DAU Growth', value: '+140%' },
        { label: 'Security Grade', value: 'A+' },
      ],
      description:
        'A fullstack enterprise telemetry dashboard providing real-time data stream visualizers, role-based access control, and automated periodic CSV/PDF reporting.',
      internalUrl: '#',
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
    },
    {
      id: 'swiftcart-commerce',
      title: 'SwiftCart Headless Commerce Experience',
      subtitle: 'Zero-friction modern shopping storefront with instant 1-tap checkout',
      category: 'ecommerce',
      categoryLabel: 'E-Commerce',
      tags: ['Next.js', 'Stripe', 'TailwindCSS', 'SSR', 'Redis'],
      metrics: [
        { label: 'Checkout Dropoff', value: '-62%' },
        { label: 'Mobile Sales', value: '+78%' },
        { label: 'TTFB Speed', value: '120ms' },
      ],
      description:
        'A high-conversion headless e-commerce store with dynamic inventory tracking, instant mobile-optimized cart drawers, and frictionless payment processing.',
      internalUrl: '#',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    },
  ];

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="case-studies" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>Proven Work &amp; Portfolio</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Featured Projects &amp;{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Live Case Studies
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Explore live applications and platforms engineered with performance, elegance, and measurable conversion results.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'web-app', label: 'Web Applications' },
            { id: 'agency', label: 'Agency & Portfolios' },
            { id: 'saas', label: 'SaaS Platforms' },
            { id: 'ecommerce', label: 'E-Commerce' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as typeof filter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === item.id
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filtered.map((project) => (
            <div
              key={project.id}
              className={`glass-panel rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden ${
                project.isFlagship ? 'border-emerald-500/40 ring-1 ring-emerald-500/20' : 'border-border/70'
              }`}
            >
              {project.isFlagship && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl tracking-wider uppercase shadow-md">
                  ★ Flagship Live Product
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${project.color}`}>
                    {project.categoryLabel}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {project.subtitle}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-secondary text-foreground border border-border/50">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Metrics Highlight Row */}
                <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-secondary/50 border border-border/60 mb-6 text-center">
                  {project.metrics.map((m, mIdx) => (
                    <div key={mIdx}>
                      <div className="font-serif font-bold text-base sm:text-lg text-primary">{m.value}</div>
                      <div className="text-[10px] text-muted-foreground font-medium">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/60 gap-3">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  <span>View Case Study</span>
                </button>

                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-primary/20 transition-all"
                  >
                    <span>Launch Live App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    href="/#brief-wizard"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>Build Similar &rarr;</span>
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Case Study Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl glass-panel relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              aria-label="Close project modal"
              className="absolute top-5 right-5 p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {selectedProject.categoryLabel}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {selectedProject.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-secondary/60 border border-border text-center">
                {selectedProject.metrics.map((m, i) => (
                  <div key={i}>
                    <div className="font-serif text-xl font-bold text-primary">{m.value}</div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-foreground">Technologies Utilized</div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg bg-secondary text-xs font-semibold text-foreground border border-border">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-border/60">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-primary/25 transition-all"
                  >
                    <span>Launch Live Application</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {selectedProject.internalUrl && selectedProject.internalUrl !== '#' && (
                  <Link
                    href={selectedProject.internalUrl}
                    onClick={() => setSelectedProject(null)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground transition-all"
                  >
                    <span>View Dedicated Product Page</span>
                  </Link>
                )}
                <Link
                  href="/#brief-wizard"
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:border-primary transition-all"
                >
                  <span>Request Similar Custom Platform</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
