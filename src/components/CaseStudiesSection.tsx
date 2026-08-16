'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  ArrowUpRight, 
  Globe
} from 'lucide-react';
import { ShowcaseProject } from '@/lib/types';

export function CaseStudiesSection() {
  const [filter, setFilter] = useState<string>('all');
  const [projects, setProjects] = useState<ShowcaseProject[]>([
    {
      id: 'proj-trip-tools',
      title: 'Trip Tools — Travel Companion & Trip Expense Tracker',
      url: 'https://triptools.vercel.app/',
      category: 'Web App',
      description: 'Real-time smart travel planner with split expenses, offline mode, and interactive destination guide.',
      impact: '100/100 Core Web Vitals, 2.4k Monthly Users',
      tags: ['Next.js 15', 'TypeScript', 'TailwindCSS', 'PWA'],
      featured: true,
      createdAt: '2026-08-16T12:00:00.000Z',
    },
    {
      id: 'proj-zenith',
      title: 'Zenith Health & Wellness Platform',
      url: 'https://triptools.vercel.app/',
      category: 'Web App',
      description: 'Modern patient booking & medical services portal with instant appointment sync and HIPAA-compliant records.',
      impact: '0.6s Booking Latency, +52% Retention',
      tags: ['Next.js 15', 'TypeScript', 'TailwindCSS', 'PostgreSQL'],
      featured: false,
      createdAt: '2026-08-15T12:00:00.000Z',
    },
    {
      id: 'proj-venturescale',
      title: 'VentureScale Enterprise SaaS Platform',
      url: 'https://triptools.vercel.app/',
      category: 'SaaS',
      description: 'Fullstack enterprise telemetry dashboard providing real-time data visualizers and automated PDF reporting.',
      impact: '<50ms Data Latency, +140% DAU',
      tags: ['React', 'Next.js', 'Chart.js', 'Tailwind'],
      featured: false,
      createdAt: '2026-08-14T12:00:00.000Z',
    },
    {
      id: 'proj-swiftcart',
      title: 'SwiftCart Headless Storefront',
      url: 'https://triptools.vercel.app/',
      category: 'E-Commerce',
      description: 'Zero-friction modern shopping storefront with instant 1-tap checkout and sub-second page loads.',
      impact: '99 Speed Score, -62% Dropoff',
      tags: ['Next.js', 'Stripe', 'TailwindCSS', 'SSR'],
      featured: false,
      createdAt: '2026-08-13T12:00:00.000Z',
    }
  ]);

  // Fetch live dynamic projects from /api/projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch(`/api/projects?_t=${Date.now()}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      } catch {
        // fallback to default
      }
    }
    loadProjects();
  }, []);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = projects.filter(p => 
    filter === 'all' ? true : p.category.toLowerCase() === filter.toLowerCase()
  );

  return (
    <section id="case-studies" className="py-20 sm:py-28 relative overflow-hidden bg-background">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proven Results &amp; Live Showcase</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Engineered for Speed, Built for{' '}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                High Conversions
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Explore live platforms and client websites built by Bharathkumar E. Each project is crafted with sub-second performance, bulletproof security, and user-centric architecture.
            </p>
          </div>

          {/* Quick Navigation to Brief Wizard */}
          <div className="flex items-center gap-3">
            <Link
              href="/#brief-wizard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-primary/25 transition-all"
            >
              <span>Build Your Platform</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all capitalize ${
                filter === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                  : 'bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/70'
              }`}
            >
              {cat === 'all' ? `All Platforms (${projects.length})` : cat}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => {
            const isTripTools = project.id.includes('trip') || project.id.includes('munnar');
            return (
              <div
                key={project.id}
                className={`glass-panel rounded-3xl p-7 sm:p-8 border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-xl hover:-translate-y-1 ${
                  project.featured 
                    ? 'border-emerald-500/40 hover:border-emerald-500/70 shadow-emerald-500/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Featured Badge Glow */}
                {project.featured && (
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div>
                  {/* Top Bar: Category & Impact */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-xl border flex items-center gap-1.5 ${
                      project.featured 
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                        : 'bg-primary/10 text-primary border-primary/25'
                    }`}>
                      <Layers className="w-3.5 h-3.5" />
                      <span>{project.category}</span>
                    </span>

                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      {project.impact}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 mb-6">
                    <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-secondary/80 border border-border/60 text-[11px] font-medium text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-5 border-t border-border/60 flex items-center justify-between gap-3">
                  {isTripTools ? (
                    <Link
                      href="/products/trip-tools"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <Compass className="w-4 h-4" />
                      <span>View Dedicated Trip Tools Case Study &rarr;</span>
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Production Architecture</span>
                    </span>
                  )}

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground font-semibold text-xs transition-colors"
                  >
                    <span>Launch Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
