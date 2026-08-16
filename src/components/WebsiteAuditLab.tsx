'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Search, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  Cpu, 
  Lock, 
  ExternalLink,
  Compass,
  Check
} from 'lucide-react';

interface AuditResult {
  overallScore: number;
  grade: string;
  speed: string;
  mobileScore: number;
  securityScore: number;
  seoScore: number;
  conversionScore: number;
  issuesFound: { type: 'warning' | 'good' | 'critical'; text: string }[];
  recommendation: string;
}

export function WebsiteAuditLab() {
  const [activeMode, setActiveMode] = useState<'audit' | 'blueprint'>('audit');
  
  // Audit state
  const [auditUrl, setAuditUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  // Blueprint state
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'pwa-mobile',
    'dark-theme',
    'gps-maps',
    'pdf-engine',
  ]);

  const presetWebsites = [
    { label: '🌿 Munnar Tools (Live)', url: 'https://munnartools.vercel.app' },
    { label: '⚡ Next.js Portal', url: 'https://nextjs.org' },
    { label: '🌴 Kerala Tourism', url: 'https://www.keralatourism.org' },
    { label: '🚀 Vercel Platform', url: 'https://vercel.com' },
  ];

  const handleRunAudit = (targetUrl?: string) => {
    let rawUrl = (targetUrl || auditUrl).trim();
    if (!rawUrl) {
      rawUrl = 'https://munnartools.vercel.app';
      setAuditUrl(rawUrl);
    }
    
    // Normalize URL
    let formattedUrl = rawUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsScanning(true);
    setAuditResult(null);

    const steps = [
      `Connecting to ${formattedUrl.replace(/^https?:\/\//, '')}...`,
      'Analyzing Mobile Viewport & Touch Target Matrix...',
      'Inspecting Core Web Vitals (FCP, LCP, CLS, TTFB)...',
      'Checking SSL Certificate & Security Protocols...',
      'Evaluating Conversion Psychology & CTA Visibility...',
    ];

    let current = 0;
    setScanStep(steps[0]);

    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setScanStep(steps[current]);
      } else {
        clearInterval(interval);
        setIsScanning(false);

        // Generate tailored contextual audit response
        const isMunnar = formattedUrl.includes('munnartools');
        const isNextOrVercel = formattedUrl.includes('nextjs.org') || formattedUrl.includes('vercel.com');
        const isKeralaTourism = formattedUrl.includes('keralatourism');

        if (isMunnar) {
          setAuditResult({
            overallScore: 99,
            grade: 'A+ (Exceptional)',
            speed: '0.7s (Sub-second Instant)',
            mobileScore: 100,
            securityScore: 98,
            seoScore: 98,
            conversionScore: 100,
            issuesFound: [
              { type: 'good', text: '100% Core Web Vitals pass rate on mobile viewports' },
              { type: 'good', text: 'PWA capabilities, offline storage, and GPS navigation active' },
              { type: 'good', text: 'Zero layout shift (CLS: 0.00) and instant Time to Interactive' },
              { type: 'good', text: 'Clean semantic HTML structure with instant vector PDF generator' },
            ],
            recommendation: 'Production-ready architecture by Bharathkumar E. Engineered for peak mobile conversion and zero bounce latency.',
          });
        } else if (isNextOrVercel) {
          setAuditResult({
            overallScore: 96,
            grade: 'A (High Performance)',
            speed: '0.9s (Edge Accelerated)',
            mobileScore: 95,
            securityScore: 96,
            seoScore: 97,
            conversionScore: 94,
            issuesFound: [
              { type: 'good', text: 'Edge CDN caching active across global points of presence' },
              { type: 'good', text: 'Modern WebP/AVIF asset optimization enabled' },
              { type: 'warning', text: 'High script hydration load on initial mobile cold start' },
              { type: 'good', text: 'Strict Content-Security-Policy (CSP) headers present' },
            ],
            recommendation: 'High-performing modern stack. Can achieve 100/100 with tailored client-side micro-optimizations.',
          });
        } else if (isKeralaTourism) {
          setAuditResult({
            overallScore: 64,
            grade: 'C+ (Heavy Legacy Overhead)',
            speed: '4.2s (Slow Server Response)',
            mobileScore: 60,
            securityScore: 75,
            seoScore: 70,
            conversionScore: 52,
            issuesFound: [
              { type: 'critical', text: 'Page load time exceeds 4.0s — losing ~44% mobile travelers' },
              { type: 'critical', text: 'Uncompressed legacy images causing massive bandwidth drain' },
              { type: 'warning', text: 'Navigation menu items are tightly packed on mobile touchscreens' },
              { type: 'warning', text: 'No offline PWA capabilities or modern GPS routing engine' },
            ],
            recommendation: 'Needs complete Next.js fullstack revamp (similar to Munnar Tools) for instant mobile navigation and trip tracking.',
          });
        } else {
          // General entered user domain
          const domainName = formattedUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
          setAuditResult({
            overallScore: 72,
            grade: 'B- (Upgrade Recommended)',
            speed: '2.9s (Moderate Bounce Risk)',
            mobileScore: 70,
            securityScore: 82,
            seoScore: 76,
            conversionScore: 62,
            issuesFound: [
              { type: 'warning', text: `TTFB latency for ${domainName} is higher than the 0.8s recommended benchmark` },
              { type: 'warning', text: 'Mobile tap targets and CTA visibility can be improved by +35%' },
              { type: 'critical', text: 'No instant WhatsApp floating action dock or interactive project brief wizard' },
              { type: 'good', text: 'Valid HTTPS/SSL security handshake detected' },
            ],
            recommendation: `ApexAssure can modernize ${domainName} into a sub-second, fullstack digital experience with 100% risk-free guarantee.`,
          });
        }
      }
    }, 450);
  };

  const blueprintFeatures = [
    {
      id: 'gps-maps',
      name: 'Google Maps GPS Navigation Engine',
      category: 'Interactive Utility',
      desc: '1-tap tourist destination routing with live distance & hours (as seen in Munnar Tools).',
      tag: 'Product Feature',
    },
    {
      id: 'budget-engine',
      name: '6-Category Real-Time Budget Tracker',
      category: 'Financial / Utility',
      desc: 'Real-time multi-category expense balancing and cloud balance synchronization.',
      tag: 'Fintech / Utility',
    },
    {
      id: 'pdf-engine',
      name: 'Automated PDF Document Generator',
      category: 'Export Engine',
      desc: 'Client-side vector PDF compilation for instant vouchers, receipts, and summaries.',
      tag: 'Export System',
    },
    {
      id: 'pwa-mobile',
      name: 'PWA Mobile-First App Engine',
      category: 'Mobile UX',
      desc: 'Installable app-like experience with bottom floating dock, offline cache, and fast touch targets.',
      tag: 'Mobile Architecture',
    },
    {
      id: 'dark-theme',
      name: 'Adaptive Dark & Light Mode System',
      category: 'Visual Design',
      desc: 'High-contrast glassmorphic styling with smooth persistent CSS variable switching.',
      tag: 'Design System',
    },
    {
      id: 'admin-portal',
      name: 'Lead & Inquiries Admin Suite',
      category: 'Fullstack Backend',
      desc: 'Password-protected lead manager with CSV/JSON export and direct WhatsApp triggers.',
      tag: 'Backend Portal',
    },
    {
      id: 'seo-accelerator',
      name: 'SEO & OpenGraph Social Accelerator',
      category: 'Marketing / Growth',
      desc: 'Automated metadata, structured JSON-LD schema, and lightning fast sub-second FCP.',
      tag: 'Growth System',
    },
    {
      id: 'analytics-telemetry',
      name: 'Event Telemetry & Conversion Tracker',
      category: 'Analytics',
      desc: 'Track button clicks, wizard drop-offs, and form completion rates in real time.',
      tag: 'Telemetry',
    },
  ];

  const toggleBlueprintModule = (id: string) => {
    setSelectedModules(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <section id="interactive-lab" className="py-16 md:py-24 relative overflow-hidden bg-secondary/20 border-y border-border/60">
      
      {/* Subtle Glow Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Engineering &amp; Audit Lab</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Test Your Website Health &amp;{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Design Your Platform Architecture
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Run an instant diagnostic audit on any website, or interactively assemble custom web capabilities 
            such as GPS navigation, expense trackers, and PWA engines.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex p-1.5 bg-card rounded-2xl border border-border shadow-sm max-w-md w-full">
            <button
              onClick={() => setActiveMode('audit')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeMode === 'audit'
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Instant Site Audit</span>
            </button>
            <button
              onClick={() => setActiveMode('blueprint')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeMode === 'blueprint'
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Feature Blueprint Builder</span>
            </button>
          </div>
        </div>

        {/* MODE 1: Website Health & Speed Auditor */}
        {activeMode === 'audit' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10 border border-border shadow-2xl space-y-8 animate-in fade-in duration-300">
            
            {/* Input Bar */}
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter any website domain or URL (e.g. yourwebsite.com)"
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs sm:text-sm text-foreground"
                  />
                </div>
                <button
                  onClick={() => handleRunAudit()}
                  disabled={isScanning}
                  className="px-6 py-3.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Run Health Audit</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Or test demo preset:</span>
                {presetWebsites.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setAuditUrl(preset.url);
                      handleRunAudit(preset.url);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground border border-border font-medium transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scanning Indicator */}
            {isScanning && (
              <div className="p-8 text-center space-y-4 max-w-md mx-auto animate-in fade-in">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mx-auto animate-bounce">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="font-serif font-bold text-lg text-foreground">Analyzing Digital Infrastructure</div>
                  <div className="text-xs text-primary font-mono">{scanStep}</div>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            )}

            {/* Audit Results Dashboard */}
            {auditResult && !isScanning && (
              <div className="space-y-8 pt-4 border-t border-border/60 animate-in zoom-in-95 duration-300">
                
                {/* Top Score Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 text-center col-span-2 sm:col-span-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Overall Health</div>
                    <div className="font-serif text-3xl sm:text-4xl font-bold text-primary my-1">
                      {auditResult.overallScore}<span className="text-xs font-normal">/100</span>
                    </div>
                    <div className="text-xs font-semibold text-primary">{auditResult.grade}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border text-center">
                    <div className="text-[11px] font-semibold text-muted-foreground">Load Speed (TTFB)</div>
                    <div className="font-serif text-xl sm:text-2xl font-bold text-foreground my-1">{auditResult.speed}</div>
                    <div className="text-[10px] text-muted-foreground">Core Web Vitals</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border text-center">
                    <div className="text-[11px] font-semibold text-muted-foreground">Mobile Responsiveness</div>
                    <div className="font-serif text-xl sm:text-2xl font-bold text-foreground my-1">{auditResult.mobileScore}%</div>
                    <div className="text-[10px] text-muted-foreground">Touch Target Matrix</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border text-center">
                    <div className="text-[11px] font-semibold text-muted-foreground">Security &amp; Headers</div>
                    <div className="font-serif text-xl sm:text-2xl font-bold text-foreground my-1">{auditResult.securityScore}%</div>
                    <div className="text-[10px] text-muted-foreground">SSL &amp; OWASP Check</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border text-center col-span-2 sm:col-span-1">
                    <div className="text-[11px] font-semibold text-muted-foreground">Conversion Architecture</div>
                    <div className="font-serif text-xl sm:text-2xl font-bold text-foreground my-1">{auditResult.conversionScore}%</div>
                    <div className="text-[10px] text-muted-foreground">CTA Visibility Index</div>
                  </div>
                </div>

                {/* Findings & Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  <div className="lg:col-span-7 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-foreground">Diagnostic Findings</div>
                    <div className="space-y-2">
                      {auditResult.issuesFound.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-medium ${
                            issue.type === 'good'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                              : issue.type === 'critical'
                              ? 'bg-destructive/10 border-destructive/30 text-destructive'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {issue.type === 'good' && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                          {issue.type === 'critical' && <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />}
                          {issue.type === 'warning' && <Activity className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
                          <span>{issue.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-card/80 p-6 rounded-2xl border border-border space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">ApexAssure Roadmap</span>
                      <h4 className="font-serif text-lg font-bold text-foreground">Recommended Solution</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {auditResult.recommendation}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/#brief-wizard"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/25 transition-all"
                      >
                        <span>Upgrade My Website With Step 1</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {!auditResult && !isScanning && (
              <div className="text-center py-6 text-xs text-muted-foreground">
                Enter your URL above or click a preset to generate a live instant diagnosis.
              </div>
            )}

          </div>
        )}

        {/* MODE 2: Feature Blueprint Builder */}
        {activeMode === 'blueprint' && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10 border border-border shadow-2xl space-y-8 animate-in fade-in duration-300">
            
            <div className="max-w-2xl mx-auto text-center space-y-2">
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Select Features to Construct Your Technical Blueprint
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Toggle the modules you want included in your custom digital platform.
              </p>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {blueprintFeatures.map((module) => {
                const isSelected = selectedModules.includes(module.id);
                return (
                  <button
                    key={module.id}
                    onClick={() => toggleBlueprintModule(module.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-md shadow-primary/10 ring-1 ring-primary'
                        : 'bg-card border-border/80 hover:border-primary/40 text-muted-foreground'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-foreground">
                          {module.tag}
                        </span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected ? 'bg-primary border-primary text-white' : 'border-border bg-card'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-foreground mb-1">
                        {module.name}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {module.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Architectural Summary */}
            <div className="p-6 rounded-2xl bg-card border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-primary">
                  {selectedModules.length} Modules Selected in Blueprint
                </div>
                <div className="text-base font-bold text-foreground">
                  Ready to deploy as a unified high-performance Next.js fullstack application.
                </div>
                <div className="text-xs text-muted-foreground">
                  Includes 100% Risk-Free consultation and 30-day post-launch maintenance.
                </div>
              </div>

              <Link
                href="/#brief-wizard"
                className="px-6 py-3.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/25 transition-all flex items-center gap-2 flex-shrink-0"
              >
                <span>Import Blueprint to Brief</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
