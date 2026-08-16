'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Compass,
  Activity,
  Layers
} from 'lucide-react';

export function Hero() {
  const [activeTab, setActiveTab] = useState<'conversions' | 'speed' | 'retention'>('conversions');

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 hero-glow-bg">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-blue-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>APEXASSURE STUDIO &bull; BHARATHKUMAR E</span>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
              Websites That Build Trust.{' '}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent block sm:inline">
                Brands That Stand Out.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Designed &amp; Engineered by <strong>Bharathkumar E</strong>. Delivering high-converting, 
              risk-free web experiences tailored for executive-grade businesses, modern agencies, and 
              ambitious products.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/#brief-wizard"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
              >
                <span>Get Started Risk-Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/products/trip-tools"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold text-sm transition-all text-center"
              >
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>Featured Product: Trip Tools &rarr;</span>
              </Link>
            </div>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">100% Risk-Free Process</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">Core Web Vitals 99+</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">Zero Budget Barriers</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Live Metrics Showcase Card */}
          <div className="lg:col-span-5 w-full">
            <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/40 dark:border-white/10 relative overflow-hidden transition-all duration-300 hover:shadow-primary/10">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ApexAssure Engine</div>
                    <div className="text-sm font-semibold text-foreground">Client Growth Performance</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Metrics
                </div>
              </div>

              {/* Metric Tabs */}
              <div className="flex p-1 bg-secondary/80 rounded-xl mb-5 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('conversions')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    activeTab === 'conversions'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Conversions
                </button>
                <button
                  onClick={() => setActiveTab('speed')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    activeTab === 'speed'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Speed (3x)
                </button>
                <button
                  onClick={() => setActiveTab('retention')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    activeTab === 'retention'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Engagement
                </button>
              </div>

              {/* Metric Stat Displays */}
              {activeTab === 'conversions' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card/70 p-3.5 rounded-2xl border border-border/60">
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                        Avg. Conversion Lift
                      </div>
                      <div className="text-2xl font-serif font-bold text-primary">+45.2%</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Post-launch baseline</div>
                    </div>
                    <div className="bg-card/70 p-3.5 rounded-2xl border border-border/60">
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        Lead Retention
                      </div>
                      <div className="text-2xl font-serif font-bold text-foreground">88.6%</div>
                      <div className="text-[11px] text-muted-foreground font-medium mt-0.5">Qualified form fills</div>
                    </div>
                  </div>

                  {/* Interactive Visual Graph Preview */}
                  <div className="bg-card/60 p-4 rounded-2xl border border-border/60 space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                      <span>Conversion Growth Curve</span>
                      <span className="text-primary font-bold">+184% YoY</span>
                    </div>
                    <div className="h-16 flex items-end gap-2 pt-2">
                      <div className="flex-1 bg-secondary/80 rounded-t-md h-[25%] relative group"><span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] bg-card px-1 rounded shadow">W1</span></div>
                      <div className="flex-1 bg-secondary/80 rounded-t-md h-[35%]" />
                      <div className="flex-1 bg-primary/40 rounded-t-md h-[48%]" />
                      <div className="flex-1 bg-primary/60 rounded-t-md h-[65%]" />
                      <div className="flex-1 bg-primary/80 rounded-t-md h-[80%]" />
                      <div className="flex-1 bg-gradient-to-t from-primary to-blue-400 rounded-t-md h-[98%] shadow-md shadow-primary/20" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'speed' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card/70 p-3.5 rounded-2xl border border-border/60">
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Time to Interactive
                      </div>
                      <div className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">0.8s</div>
                      <div className="text-[11px] text-muted-foreground font-medium mt-0.5">Industry avg: 3.4s</div>
                    </div>
                    <div className="bg-card/70 p-3.5 rounded-2xl border border-border/60">
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        Lighthouse Score
                      </div>
                      <div className="text-2xl font-serif font-bold text-primary">100/100</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">All Core Vitals Green</div>
                    </div>
                  </div>

                  <div className="bg-card/60 p-4 rounded-2xl border border-border/60 space-y-2.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>ApexAssure Optimized Page</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">0.8s</span>
                    </div>
                    <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[25%]" />
                    </div>
                    
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground pt-1">
                      <span>Standard Legacy Website</span>
                      <span className="text-amber-500 font-bold">3.8s</span>
                    </div>
                    <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div className="bg-muted-foreground/40 h-full rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'retention' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card/70 p-3.5 rounded-2xl border border-border/60">
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        Bounce Rate Reduction
                      </div>
                      <div className="text-2xl font-serif font-bold text-primary">-58.4%</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Frictionless UX</div>
                    </div>
                    <div className="bg-card/70 p-3.5 rounded-2xl border border-border/60">
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        Avg Session Time
                      </div>
                      <div className="text-2xl font-serif font-bold text-foreground">3m 42s</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">2.5x Increase</div>
                    </div>
                  </div>

                  <div className="bg-card/60 p-3.5 rounded-2xl border border-border/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold">
                      🏆
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Every pixel is architected around conversion psychology and mobile micro-interactions.
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                <span>Tailored for High-Growth Brands</span>
                <Link href="/#services" className="text-primary font-semibold hover:underline flex items-center gap-1">
                  View Full Services &rarr;
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
