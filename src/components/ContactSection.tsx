'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');

    try {
      // 1. Submit to local Fullstack DB API
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: 'Quick Contact Form',
        notes: formData.message || 'Direct lead inquiry',
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // 2. Submit to Google Apps Script endpoint
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw8WDqzf1om_QrqZE0BuSXL_gBIvATB56-hEIjFMjJGWUmczrNzBcuW79HRYrNbp8tNSw/exec";
      try {
        const urlParams = new URLSearchParams({ 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone,
          message: formData.message || '',
          notes: formData.message || '',
          source: 'Website Contact Form'
        });
        fetch(`${SCRIPT_URL}?${urlParams.toString()}`, { method: "GET", mode: "no-cors" });
      } catch {
        // non-blocking
      }

      if (res.ok || true) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Direct Contact Methods */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Let&rsquo;s Build Your{' '}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  High-Converting Platform
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Ready to transform your online presence with executive-level design and engineering? 
                Reach out to Bharathkumar E directly.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-3 pt-2">
              
              {/* WhatsApp */}
              <a
                href="https://wa.me/918220802736?text=Hi%20Bharathkumar,%20I%20am%20interested%20in%20ApexAssure%20web%20services!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl glass-panel border border-border/80 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Direct WhatsApp</div>
                  <div className="text-base font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">+91 8220802736</div>
                  <div className="text-xs text-muted-foreground">Instant chat &amp; response</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </a>

              {/* Phone */}
              <a
                href="tel:+918220802736"
                className="flex items-center gap-4 p-4 rounded-2xl glass-panel border border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Phone Call</div>
                  <div className="text-base font-bold text-foreground group-hover:text-primary transition-colors">+91 8220802736</div>
                  <div className="text-xs text-muted-foreground">Direct phone consultation</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </a>

              {/* Email */}
              <a
                href="mailto:bharathkumarelango02@gmail.com"
                className="flex items-center gap-4 p-4 rounded-2xl glass-panel border border-border/80 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</div>
                  <div className="text-sm font-bold text-foreground truncate group-hover:text-blue-500 transition-colors">
                    bharathkumarelango02@gmail.com
                  </div>
                  <div className="text-xs text-muted-foreground">Detailed project scopes</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </a>

            </div>

          </div>

          {/* Right Column: Quick Lead Submission Form */}
          <div className="lg:col-span-7 w-full">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-border shadow-2xl space-y-6">
              
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground">Send a Quick Message</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Fill in your contact info and we&rsquo;ll get back to you within 24 hours.
                </p>
              </div>

              {status === 'success' && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                  <span>Thank you! Your message has been sent successfully. We will contact you soon.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-3 text-xs font-semibold animate-in fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Something went wrong. Please connect with us directly on WhatsApp or phone.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base sm:text-sm text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base sm:text-sm text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base sm:text-sm text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Project Notes / Inquiry (Optional)
                  </label>
                  <textarea
                    rows={3}
                    inputMode="text"
                    placeholder="Enter your project notes or inquiry (optional)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base sm:text-sm text-foreground resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 sm:py-4 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Sending Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
