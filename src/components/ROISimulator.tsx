'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, TrendingUp, DollarSign, Users, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export function ROISimulator() {
  const [loadTime, setLoadTime] = useState<number>(3.8); // current load time in seconds
  const [visitors, setVisitors] = useState<number>(10000); // monthly visitors
  const [leadValue, setLeadValue] = useState<number>(150); // average lead/customer value in USD

  // Calculation formulas based on Google / Akamai industry benchmarks:
  // Baseline bounce rate increases by ~32% as load time goes from 1s to 3s, and ~90% as load time hits 5s
  const currentBounceRate = Math.min(85, Math.max(25, 20 + loadTime * 12));
  const optimizedLoadTime = 0.9; // ApexAssure load time
  const optimizedBounceRate = 26; // ApexAssure bounce rate
  const bounceRateReduction = Math.max(0, currentBounceRate - optimizedBounceRate);

  // Conversion rate lift (every 1s improvement ~ 7% conversion lift)
  const speedDiffSeconds = Math.max(0, loadTime - optimizedLoadTime);
  const conversionLiftPercent = Math.round(speedDiffSeconds * 9.5);

  // Recovered visitors & extra monthly revenue
  const recoveredVisitors = Math.round(visitors * (bounceRateReduction / 100));
  const additionalLeads = Math.round(recoveredVisitors * 0.035); // 3.5% avg conversion on saved visitors
  const extraRevenue = additionalLeads * leadValue;

  return (
    <section id="roi-simulator" className="py-16 md:py-24 relative overflow-hidden bg-secondary/30 border-y border-border/60">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>Interactive Speed &amp; Revenue Benchmark</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Calculate How Speed Multiplies Your{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Revenue &amp; Conversions
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Move the sliders below to see how optimizing your website with ApexAssure recovers lost traffic, 
            slashes bounce rates, and directly increases monthly earnings.
          </p>
        </div>

        {/* Interactive Simulator Shell */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10 border border-border shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Sliders Controls */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Slider 1: Current Load Time */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Current Page Load Time
                  </span>
                  <span className="text-base font-bold text-amber-500 font-mono">
                    {loadTime.toFixed(1)} seconds
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.1"
                  value={loadTime}
                  onChange={(e) => setLoadTime(parseFloat(e.target.value))}
                  className="w-full h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>1.0s (Fast)</span>
                  <span>3.5s (Average Web)</span>
                  <span>6.0s (Slow / High Loss)</span>
                </div>
              </div>

              {/* Slider 2: Monthly Visitors */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Monthly Website Visitors
                  </span>
                  <span className="text-base font-bold text-primary font-mono">
                    {visitors.toLocaleString()} visitors/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={visitors}
                  onChange={(e) => setVisitors(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>1,000/mo</span>
                  <span>50,000/mo</span>
                  <span>100,000+/mo</span>
                </div>
              </div>

              {/* Slider 3: Average Lead / Deal Value */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    Average Value per Client / Lead
                  </span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    ${leadValue} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={leadValue}
                  onChange={(e) => setLeadValue(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>$20</span>
                  <span>$500</span>
                  <span>$1,000+</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card/60 border border-border flex items-center gap-3 text-xs text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>
                  ApexAssure builds platforms that load in under <strong>0.9s</strong> with zero bloatware, 
                  cutting bounce rates by up to <strong>{Math.round(bounceRateReduction)}%</strong>.
                </span>
              </div>

            </div>

            {/* Right Column: Calculated Impact Display */}
            <div className="lg:col-span-5 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 sm:p-8 rounded-3xl border border-primary/20 shadow-xl space-y-6">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Projected Impact</span>
                <h3 className="font-serif text-2xl font-bold text-foreground mt-1">
                  Estimated Speed Gains
                </h3>
              </div>

              <div className="space-y-4">
                
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Estimated Monthly Revenue Lift</div>
                    <div className="font-serif text-3xl font-bold text-primary mt-0.5">
                      +${extraRevenue.toLocaleString()} <span className="text-xs font-sans font-normal text-muted-foreground">/mo</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-secondary/80 border border-border">
                    <div className="text-[11px] text-muted-foreground font-medium">Recovered Visitors</div>
                    <div className="text-xl font-bold text-foreground font-mono mt-0.5">
                      +{recoveredVisitors.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Saved from bounce</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-secondary/80 border border-border">
                    <div className="text-[11px] text-muted-foreground font-medium">Conversion Lift</div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      +{conversionLiftPercent}%
                    </div>
                    <div className="text-[10px] text-muted-foreground font-semibold">Fast response boost</div>
                  </div>
                </div>

              </div>

              <div className="pt-2">
                <Link
                  href="/#brief-wizard"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-sm shadow-md shadow-primary/25 hover:shadow-lg transition-all"
                >
                  <span>Build A Lightning Fast Site</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
