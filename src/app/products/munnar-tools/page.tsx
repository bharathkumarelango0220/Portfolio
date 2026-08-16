import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileDock } from '@/components/MobileDock';
import { 
  Compass, 
  MapPin, 
  Wallet, 
  FileText, 
  Smartphone, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Database,
  Code2,
  Sparkles
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Munnar Explorer & Trip Expense Tracker — Product Case Study | Bharathkumar E',
  description:
    'Comprehensive product showcase and architecture of Munnar Tools travel companion and 6-category trip expense tracker, built by Bharathkumar E.',
};

export default function MunnarToolsProductPage() {
  const architecturalHighlights = [
    {
      title: 'GPS Google Maps Integration',
      description: 'One-click deep links and integrated geographic coordinates for 15+ tourist attractions in Munnar with distance calculation and opening hours.',
      icon: MapPin,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: '6-Category Real-Time Expense Engine',
      description: 'Granular budget allocation across Accommodation, Food & Dining, Travel & Fuel, Sightseeing & Activities, Shopping, and Miscellaneous.',
      icon: Wallet,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'Automated PDF Trip Summary Generator',
      description: 'Client-side vector PDF compilation delivering immediate, beautiful receipts and travel vouchers without server overhead.',
      icon: FileText,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: 'Cloud Persistence & Firestore Sync',
      description: 'Real-time database sync for instant group collaboration, trip sharing, and multi-device persistence.',
      icon: Database,
      color: 'text-purple-500 bg-purple-500/10',
    },
    {
      title: 'PWA Mobile-First Architecture',
      description: 'Sub-second initial load, offline storage fallback, and smooth gesture navigation for travelers on mobile networks.',
      icon: Smartphone,
      color: 'text-rose-500 bg-rose-500/10',
    },
    {
      title: '100% Core Web Vitals Performance',
      description: 'Optimized asset bundles, responsive WebP media, zero layout shift, and instant interactive speeds.',
      icon: Zap,
      color: 'text-teal-500 bg-teal-500/10',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground mobile-safe-bottom">
      <Navbar />

      <main className="flex-1">
        
        {/* Top Breadcrumb & Hero */}
        <section className="pt-8 pb-12 md:pt-12 md:pb-16 bg-gradient-to-b from-secondary/40 to-background border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to ApexAssure Portfolio</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                FLAGSHIP WEB PRODUCT
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-semibold border border-border">
                Crafted by Bharathkumar E
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  Munnar Explorer &amp;{' '}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-primary bg-clip-text text-transparent">
                    Trip Expense Tracker
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  A high-utility travel companion web application built to streamline Munnar sightseeing 
                  and group trip expense management. Deployed live at{' '}
                  <a 
                    href="https://munnartools.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary font-semibold hover:underline"
                  >
                    munnartools.vercel.app
                  </a>.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="https://munnartools.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <span>Launch Live Web App</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="#live-embed"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground font-semibold text-sm transition-all"
                  >
                    <span>Try Interactive Embed</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 grid grid-cols-2 gap-3">
                <div className="glass-panel p-4 rounded-2xl border border-border/80 text-center">
                  <div className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">100%</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Core Web Vitals</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-border/80 text-center">
                  <div className="text-2xl font-serif font-bold text-primary">6</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Expense Categories</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-border/80 text-center">
                  <div className="text-2xl font-serif font-bold text-blue-500">15+</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Top Munnar Spots</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-border/80 text-center">
                  <div className="text-2xl font-serif font-bold text-amber-500">PDF</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Instant Reports</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Live Interactive Embed Section */}
        <section id="live-embed" className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Interactive Live Preview</h2>
                <p className="text-sm text-muted-foreground">Test the live Munnar Tools application in real-time below.</p>
              </div>
              <a
                href="https://munnartools.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground transition-all"
              >
                <span>Open in Full Browser Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="w-full h-[620px] rounded-3xl overflow-hidden glass-panel border border-border shadow-2xl relative">
              <iframe
                src="https://munnartools.vercel.app/"
                title="Munnar Tools Web Application"
                className="w-full h-full border-none"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
        </section>

        {/* Architectural Features Grid */}
        <section className="py-12 md:py-16 bg-secondary/30 border-y border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mb-12 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Technical Breakdown</div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Engineered for Reliability &amp; Performance
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Discover the architectural decisions, tools, and algorithms that make Munnar Tools fast, dependable, and easy to use.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architecturalHighlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="glass-panel p-6 rounded-2xl border border-border/70 hover:border-primary/40 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Tech Stack Banner */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel p-8 rounded-3xl border border-border/80 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  Want a custom web product like Munnar Tools built for your business?
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Bharathkumar E specializes in custom fullstack web applications, interactive calculators, 
                  and high-converting landing pages.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/#brief-wizard"
                  className="px-6 py-3.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-primary/25 transition-all text-center"
                >
                  Start Project Brief
                </Link>
                <a
                  href="https://wa.me/918220802736?text=Hi%20Bharathkumar,%20I%20saw%20Munnar%20Tools%20and%20want%20to%20build%20a%20similar%20product!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all text-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <MobileDock />
    </div>
  );
}
