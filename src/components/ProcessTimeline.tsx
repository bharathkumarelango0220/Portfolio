'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  FileCheck, 
  Palette, 
  Code2, 
  SearchCheck, 
  Rocket, 
  ShieldCheck,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

interface ProcessStep {
  number: string;
  title: string;
  badge: string;
  shortDesc: string;
  longDesc: string;
  icon: React.ElementType;
  highlights: string[];
}

export function ProcessTimeline() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const steps: ProcessStep[] = [
    {
      number: '01',
      title: 'Requirement Gathering & FRD Creation',
      badge: 'Discovery Phase',
      shortDesc: 'Deep dive into your exact business goals, audience, and functional requirements.',
      longDesc:
        'We start by understanding your exact business needs, target demographic, and functional requirements. Everything is documented in a detailed Functional Requirements Document (FRD) to ensure zero guesswork.',
      icon: FileCheck,
      highlights: [
        'In-depth discovery session to map your conversion goals',
        'Target audience & demographic persona analysis',
        'Detailed Functional Requirements Document (FRD) approval',
        'Predictable timeline and zero hidden scope surprises',
      ],
    },
    {
      number: '02',
      title: 'UI/UX Design & Prototype Creation',
      badge: 'Visual Identity',
      shortDesc: 'Crafting bespoke high-fidelity wireframes and interactive prototypes.',
      longDesc:
        'Based on the approved requirements, we create high-fidelity UI/UX mockups tailored to your brand identity. Every pixel is crafted for maximum visual impact, readability, and conversion psychology.',
      icon: Palette,
      highlights: [
        'Mobile-first responsive wireframes and layout flows',
        'High-fidelity interactive prototype presentation',
        'Brand color palettes, typography, and dark/light theme systems',
        'Collaborative feedback iteration until 100% satisfied',
      ],
    },
    {
      number: '03',
      title: 'Custom Fullstack Web Development',
      badge: 'Engineering',
      shortDesc: 'Writing clean, semantic, high-performance code matched pixel-by-pixel.',
      longDesc:
        'Once the design is approved, we build your website using modern Next.js, React, TailwindCSS, and secure API routes. Every line of code is written for speed, security, and long-term maintainability.',
      icon: Code2,
      highlights: [
        'Clean, semantic TypeScript & Next.js fullstack codebase',
        'Mobile-first responsive styling across all device viewports',
        'Bank-grade security, CSRF protection, and sanitized data inputs',
        'Regular progress milestone updates every 3–4 days',
      ],
    },
    {
      number: '04',
      title: 'Draft Review & Quality Assurance',
      badge: 'Quality Assurance',
      shortDesc: 'Rigorous cross-browser testing and live staging preview link.',
      longDesc:
        'We deploy a live staging preview link for you to test all pages, animations, forms, and tools. We conduct rigorous cross-browser testing and Google Lighthouse audits to ensure peak performance.',
      icon: SearchCheck,
      highlights: [
        'Live draft preview on a private staging link',
        'Cross-browser and mobile device compatibility testing',
        'Core Web Vitals load speed optimization (99+ score)',
        'Unlimited revisions to ensure total satisfaction',
      ],
    },
    {
      number: '05',
      title: 'Deployment, Handover & 30-Day Support',
      badge: 'Live Launch',
      shortDesc: 'Primary domain deployment, SEO configuration, and complete code ownership.',
      longDesc:
        'Upon your final approval, we launch your website live on your primary domain with SSL, configure search engine indexing, and handover all source files, credentials, and documentation.',
      icon: Rocket,
      highlights: [
        'Zero-downtime professional domain & SSL deployment',
        'Complete SEO meta-tagging, sitemap, and Google Analytics setup',
        '100% full source code ownership & credentials handover',
        '30 days of free post-launch technical support & maintenance',
      ],
    },
  ];

  return (
    <section id="process" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Transparent Workflow</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Our 5-Step{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Risk-Free Process
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A systematic, predictable approach to turning your vision into a high-converting digital platform 
            with zero surprises, zero hidden costs, and complete transparency.
          </p>
        </div>

        {/* Steps Timeline Container */}
        <div className="max-w-4xl mx-auto space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isExpanded = expandedStep === idx;

            return (
              <div
                key={idx}
                className={`glass-panel rounded-2xl transition-all duration-300 border overflow-hidden ${
                  isExpanded
                    ? 'border-primary/40 shadow-xl bg-card'
                    : 'border-border/70 hover:border-primary/30 hover:bg-card/70'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-serif text-lg font-bold flex-shrink-0 border border-primary/20">
                      {step.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          {step.badge}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block mt-0.5">
                        {step.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full bg-secondary text-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-border/50 space-y-4 animate-in fade-in duration-200">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.longDesc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {step.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 bg-secondary/60 p-3 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/#brief-wizard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            <span>Start Your Project With Step 1</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
