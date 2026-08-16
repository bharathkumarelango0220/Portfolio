'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  MapPin, 
  Wallet, 
  FileText, 
  Smartphone, 
  ExternalLink, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  Eye,
  Maximize2
} from 'lucide-react';

export function FeaturedProduct() {
  const [showLivePreview, setShowLivePreview] = useState(false);

  const productFeatures = [
    {
      icon: MapPin,
      title: 'GPS Google Maps Navigation',
      description: 'Instant 1-tap route navigation to top Munnar destinations including Top Station, Tea Museum, and Mattupetty.',
      badge: 'Interactive Travel',
    },
    {
      icon: Wallet,
      title: '6-Category Expense Tracker',
      description: 'Real-time multi-category budget management (Stay, Food, Transit, Activities, Shopping & Misc).',
      badge: 'Real-time Budget',
    },
    {
      icon: FileText,
      title: 'Instant PDF Trip Export',
      description: 'Generate polished PDF itinerary and expense logs ready for download and group trip sharing.',
      badge: 'Export Engine',
    },
    {
      icon: Smartphone,
      title: 'PWA & Mobile-First UX',
      description: 'Engineered for smooth on-the-road mobile experience with offline caching and lightning responsiveness.',
      badge: 'Mobile Optimized',
    },
  ];

  return (
    <section id="featured-product" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
      
      {/* Decorative foliage / emerald glow accents */}
      <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>Featured Product by Bharathkumar E</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Munnar Explorer &amp;{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-primary bg-clip-text text-transparent">
              Trip Expense Tracker
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A real-world, production-ready travel companion web application crafted by Bharathkumar E. 
            Explore tourist spots with direct GPS maps and manage complete trip budgets seamlessly.
          </p>
        </div>

        {/* Product Showcase Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Product Information & Highlights */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  🌿 LIVE WEB PRODUCT
                </span>
                <span className="px-3 py-1 rounded-lg bg-secondary text-foreground font-semibold text-xs border border-border">
                  React 19 &bull; TailwindCSS &bull; Firebase
                </span>
                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
                  100% Mobile Ready
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                The Ultimate Munnar Travel Companion
              </h3>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Engineered from ground up to solve real traveler pain points in Kerala&rsquo;s hill station:
                navigating scenic destinations without getting lost, tracking shared group expenses in real-time, 
                and downloading comprehensive summary PDF vouchers.
              </p>

              {/* Grid of Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {productFeatures.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div 
                      key={idx} 
                      className="bg-card/70 dark:bg-card/40 p-4 rounded-2xl border border-border/70 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="font-semibold text-xs sm:text-sm text-foreground">{feat.title}</div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-normal">{feat.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Product CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border/60">
                <a
                  href="https://munnartools.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                >
                  <span>Launch Live Product</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <Link
                  href="/products/munnar-tools"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-card hover:bg-secondary border border-border text-foreground font-semibold text-sm transition-all text-center"
                >
                  <span>View Product Architecture</span>
                  <Layers className="w-4 h-4 text-muted-foreground" />
                </Link>

                <button
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs font-semibold border border-border transition-all"
                >
                  <Eye className="w-4 h-4 text-emerald-500" />
                  <span>{showLivePreview ? 'Hide Preview' : 'Interactive Preview'}</span>
                </button>
              </div>

            </div>

            {/* Right Column: Live Interactive Frame / Product Preview Screen */}
            <div className="lg:col-span-6 w-full">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl">
                
                {/* Mockup Top Browser Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800/80 text-[11px] font-mono text-slate-300">
                    <span>https://munnartools.vercel.app</span>
                  </div>
                  <a 
                    href="https://munnartools.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white p-1"
                    title="Open in new tab"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Content Frame: Either Live Iframe or Rich Visual Interactive Presentation */}
                {showLivePreview ? (
                  <div className="h-[480px] w-full bg-slate-950 relative">
                    <iframe
                      src="https://munnartools.vercel.app/"
                      title="Munnar Tools Live Preview"
                      className="w-full h-full border-none"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white min-h-[440px] flex flex-col justify-between">
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg font-serif">
                          <span>🌿</span>
                          <span>Munnar Explorer</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          v1.4 Production
                        </span>
                      </div>

                      {/* Mock Destination Card Preview */}
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Spotlight Destination</div>
                            <div className="text-base font-bold text-white">Top Station &amp; Cloud Valley View</div>
                          </div>
                          <span className="text-xs font-bold text-slate-300 bg-slate-700 px-2 py-0.5 rounded">1,880m MSL</span>
                        </div>
                        <div className="text-xs text-slate-300 flex items-center gap-3">
                          <span className="flex items-center gap-1">📍 32 km from Munnar Town</span>
                          <span className="flex items-center gap-1">⏱️ Open 6:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                            Direct GPS Route
                          </span>
                          <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-[11px] font-semibold">
                            Google Maps Synced
                          </span>
                        </div>
                      </div>

                      {/* Mock Expense Overview Preview */}
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span className="font-semibold">6-Category Trip Budget Balance</span>
                          <span className="text-emerald-400 font-bold">₹18,450 / ₹25,000</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[74%] rounded-full" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-400">
                          <div>🏨 Stay: ₹8,000</div>
                          <div>🍲 Food: ₹3,250</div>
                          <div>🚗 Fuel: ₹4,200</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                      <button
                        onClick={() => setShowLivePreview(true)}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Click to load interactive live web app</span>
                      </button>
                      
                      <a
                        href="https://munnartools.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        <span>Open fullscreen</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
