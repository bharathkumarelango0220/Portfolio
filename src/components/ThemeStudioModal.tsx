'use client';

import React, { useState } from 'react';
import { useTheme, THEME_PRESETS, AccentTheme } from './ThemeProvider';
import { 
  Palette, 
  X, 
  Check, 
  Sparkles, 
  Sun, 
  Moon, 
  RotateCcw,
  Sliders
} from 'lucide-react';

export function ThemeStudioModal() {
  const { theme, toggleTheme, accent, setAccent, isStudioOpen, setIsStudioOpen } = useTheme();
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleSelect = (id: AccentTheme) => {
    setAccent(id);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleReset = () => {
    setAccent('default');
  };

  return (
    <>
      {/* Floating Theme Studio Launcher Trigger */}
      <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40">
        <button
          onClick={() => setIsStudioOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-card/90 hover:bg-card text-foreground border border-border/80 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all backdrop-blur-md cursor-pointer"
          title="Open Live Theme Reskinner Studio"
          aria-label="Open Live Theme Reskinner Studio"
        >
          <div className="w-6 h-6 rounded-lg bg-primary/15 text-primary flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
            <Palette className="w-3.5 h-3.5" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[11px] font-bold tracking-tight text-foreground leading-none">
              Theme Studio
            </span>
            <span className="text-[9px] text-muted-foreground font-medium capitalize mt-0.5">
              {THEME_PRESETS.find(p => p.id === accent)?.name.split(' ')[0] || 'Default'}
            </span>
          </div>
        </button>
      </div>

      {/* Interactive Modal Drawer */}
      {isStudioOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsStudioOpen(false)}
        >
          <div 
            className="w-full sm:max-w-lg bg-card border border-border/80 rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl glass-panel space-y-5 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-border/70">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Live Studio Customizer</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Studio Theme Reskinner
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dynamically recolor the site aesthetic with 1-click modern CSS variables.
                </p>
              </div>

              <button
                onClick={() => setIsStudioOpen(false)}
                className="p-2 rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close Theme Studio"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Toast */}
            {copiedNotification && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in duration-150">
                <Check className="w-3.5 h-3.5" />
                <span>Palette applied in real-time!</span>
              </div>
            )}

            {/* Presets Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Select Aesthetic Preset:</span>
                <button
                  onClick={handleReset}
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Default</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {THEME_PRESETS.map((preset) => {
                  const isActive = accent === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelect(preset.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-md'
                          : 'bg-secondary/40 hover:bg-secondary/80 border-border/70 hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-sm bg-gradient-to-tr ${preset.previewGradient} text-white font-bold flex-shrink-0 group-hover:scale-105 transition-transform`}
                        >
                          {preset.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                            <span>{preset.name}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground line-clamp-1">
                            {preset.tagline}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: preset.primaryColor }}
                        />
                        {isActive && (
                          <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Dark / Light Mode Switch inside Studio */}
            <div className="pt-3 border-t border-border/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Base Mode:</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {theme} mode active
                </span>
              </div>

              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-semibold transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch to Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span>Switch to Dark</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
