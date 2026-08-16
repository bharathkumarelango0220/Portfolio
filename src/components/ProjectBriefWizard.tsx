'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { exportSingleBriefPDF } from '@/lib/pdfGenerator';
import { 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Download, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Building,
  User,
  Mail,
  Phone,
  Compass,
  Palette,
  Layers
} from 'lucide-react';

export function ProjectBriefWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const stepTitles = [
    'About You',
    'Your Business',
    'Target Audience',
    'Design & Aesthetic',
    'Features & Readiness',
    'Review & Submit',
  ];

  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    yourName: '',
    email: '',
    phone: '',
    description: '',
    goals: ['Promote business', 'Build a brand'] as string[],
    audienceGender: 'All',
    audienceAge: '',
    designLook: 'Modern & minimalist',
    primaryColor: '',
    secondaryColor: '',
    colorTheme: 'Light & Dark Adaptive',
    keyFeatures: ['Multi interlinked pages', 'Customer response form', 'SEO Acceleration'] as string[],
    hasContent: 'Yes',
    hasDomain: 'Yes',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Local storage auto-load and auto-save
  useEffect(() => {
    try {
      const saved = localStorage.getItem('apexassure-brief-draft');
      if (saved) {
        setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // ignore
    }
  }, []);

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem('apexassure-brief-draft', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const toggleArrayItem = (field: 'goals' | 'keyFeatures', item: string) => {
    setFormData((prev) => {
      const list = prev[field];
      const next = list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
      const updated = { ...prev, [field]: next };
      try {
        localStorage.setItem('apexassure-brief-draft', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const validateCurrentStep = () => {
    if (step === 1) {
      if (!formData.businessName.trim()) {
        setErrorMsg('Please enter your business or project name.');
        return false;
      }
      if (!formData.yourName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setErrorMsg('Please provide a valid email address.');
        return false;
      }
      if (!formData.phone.trim() || formData.phone.length < 7) {
        setErrorMsg('Please provide a valid contact phone number.');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.description.trim()) {
        setErrorMsg('Please describe what your business does in a few sentences.');
        return false;
      }
      if (formData.goals.length === 0) {
        setErrorMsg('Please select at least one primary goal.');
        return false;
      }
    }
    setErrorMsg('');
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    setErrorMsg('');
    if (step > 1) setStep(step - 1);
  };

  const handleDownloadPDF = () => {
    exportSingleBriefPDF(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Submit to Next.js fullstack local DB API
      const res = await fetch('/api/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // 2. Asynchronous sync with Google Apps Script endpoint
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw8WDqzf1om_QrqZE0BuSXL_gBIvATB56-hEIjFMjJGWUmczrNzBcuW79HRYrNbp8tNSw/exec";
      try {
        const payload = new URLSearchParams({
          formType: 'frd',
          businessName: formData.businessName,
          yourName: formData.yourName,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
          goals: formData.goals.join(', '),
          audienceGender: formData.audienceGender,
          audienceAge: formData.audienceAge,
          designLook: formData.designLook,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          colorTheme: formData.colorTheme,
          keyFeatures: formData.keyFeatures.join(', '),
          hasContent: formData.hasContent,
          hasDomain: formData.hasDomain,
        });
        fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: payload });
      } catch {
        // non-blocking fallback
      }

      if (res.ok) {
        setSubmitted(true);
        try {
          localStorage.removeItem('apexassure-brief-draft');
        } catch {
          // ignore
        }
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        throw new Error('Server submission error');
      }
    } catch {
      setErrorMsg('Failed to submit brief. Please check your internet connection or reach out on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="brief-wizard" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Project Brief (FRD)</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Start Your Custom Project{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Risk-Free
            </span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground">
            Tell us about your brand vision, goals, and preferred features. No budget barriers, no guesswork — takes just 2 minutes.
          </p>
        </div>

        {/* Wizard Card Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-border shadow-2xl relative">
          
          {!submitted ? (
            <div>
              {/* Progress Header */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="text-xs font-bold uppercase tracking-wider text-primary">
                  Step {step} of {totalSteps}: {stepTitles[step - 1]}
                </div>
                <div className="text-xs font-semibold text-muted-foreground font-mono">
                  {Math.round((step / totalSteps) * 100)}% Completed
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mb-8">
                <div 
                  className="bg-gradient-to-r from-primary to-blue-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-3 text-xs font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: About You */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Tell us about yourself</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Let&rsquo;s start with your business and contact information.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Business / Brand Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your business or brand name"
                        value={formData.businessName}
                        onChange={(e) => updateField('businessName', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.yourName}
                        onChange={(e) => updateField('yourName', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your phone / WhatsApp number"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: About Your Business */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">About Your Business &amp; Objectives</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">What does your company do, and what are your primary targets?</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Business Overview &amp; Vision *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your business, products, or services..."
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-foreground resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Key Goals &amp; Objectives (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        'Promote business',
                        'Build a brand',
                        'Sell products',
                        'Generate qualified leads',
                        'Automate client workflows',
                        'Showcase portfolio / tools',
                      ].map((goal) => {
                        const active = formData.goals.includes(goal);
                        return (
                          <button
                            type="button"
                            key={goal}
                            onClick={() => toggleArrayItem('goals', goal)}
                            className={`p-3 rounded-xl text-xs font-semibold border flex items-center justify-between text-left transition-all ${
                              active
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                            }`}
                          >
                            <span>{goal}</span>
                            {active && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Target Audience */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Target Audience &amp; Demographics</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Who will be using and browsing your website?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Target Gender Demographics
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['All / General', 'Men', 'Women'].map((g) => (
                          <button
                            type="button"
                            key={g}
                            onClick={() => updateField('audienceGender', g)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                              formData.audienceGender === g
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-background border-border text-muted-foreground hover:bg-secondary'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Target Age Group
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. All ages, 18-35, 25-50"
                        value={formData.audienceAge}
                        onChange={(e) => updateField('audienceAge', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-foreground"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Design & Aesthetic */}
              {step === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Visual Style &amp; Brand Feel</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Select the artistic direction and color aesthetics.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Visual Direction
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { title: 'Modern & Minimalist', desc: 'Clean whitespace, elegant typography' },
                        { title: 'Corporate & Executive', desc: 'Trustworthy, formal, structured layout' },
                        { title: 'Creative & Dynamic', desc: 'Vibrant, interactive, bold animations' },
                      ].map((dir) => (
                        <button
                          type="button"
                          key={dir.title}
                          onClick={() => updateField('designLook', dir.title)}
                          className={`p-4 rounded-xl text-left border transition-all ${
                            formData.designLook === dir.title
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-background border-border text-foreground hover:border-primary/50'
                          }`}
                        >
                          <div className="font-bold text-xs sm:text-sm">{dir.title}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{dir.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Preferred Primary Colour
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Blue, Emerald Green, Slate"
                        value={formData.primaryColor}
                        onChange={(e) => updateField('primaryColor', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-foreground"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Preferred Secondary Colour
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dark Slate, Gold, White"
                        value={formData.secondaryColor}
                        onChange={(e) => updateField('secondaryColor', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Theme Mode Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Light & Dark Adaptive', 'Dark Theme Only', 'Light Theme Only'].map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => updateField('colorTheme', t)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            formData.colorTheme === t
                              ? 'bg-primary text-white border-primary'
                              : 'bg-background border-border text-muted-foreground hover:bg-secondary'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Features & Readiness */}
              {step === 5 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Technical Features &amp; Readiness</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Select required website capabilities and project readiness.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Key Technical Features
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Multi interlinked pages',
                        'Customer response form',
                        'Custom Web Tool / Calculator (like Munnar Tools)',
                        'SEO Acceleration & Analytics',
                        'Interactive Portfolio / Case Studies',
                        'Dark / Light Mode Switcher',
                        'WhatsApp & Direct Call Floating Dock',
                        'PDF Export / Document Generator',
                      ].map((feat) => {
                        const active = formData.keyFeatures.includes(feat);
                        return (
                          <button
                            type="button"
                            key={feat}
                            onClick={() => toggleArrayItem('keyFeatures', feat)}
                            className={`p-3 rounded-xl text-xs font-semibold border flex items-center justify-between text-left transition-all ${
                              active
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                            }`}
                          >
                            <span>{feat}</span>
                            {active && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Do you have content / logo ready?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Yes', 'No (Need ApexAssure Assistance)'].map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => updateField('hasContent', opt)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                              formData.hasContent === opt
                                ? 'bg-primary text-white border-primary'
                                : 'bg-background border-border text-muted-foreground hover:bg-secondary'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Do you already have a domain?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Yes', 'No (Need Setup Guidance)'].map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => updateField('hasDomain', opt)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                              formData.hasDomain === opt
                                ? 'bg-primary text-white border-primary'
                                : 'bg-background border-border text-muted-foreground hover:bg-secondary'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Review & Submit */}
              {step === 6 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">Review Your Project Brief</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Confirm your project details before submission.</p>
                  </div>

                  <div className="space-y-2 border border-border rounded-2xl overflow-hidden bg-card/60">
                    {[
                      { label: 'Business Name', value: formData.businessName },
                      { label: 'Contact Person', value: formData.yourName },
                      { label: 'Email & Phone', value: `${formData.email} • ${formData.phone}` },
                      { label: 'Business Scope', value: formData.description },
                      { label: 'Goals', value: formData.goals.join(', ') },
                      { label: 'Audience Demographics', value: `${formData.audienceGender} (${formData.audienceAge})` },
                      { label: 'Design Direction', value: formData.designLook },
                      { label: 'Preferred Colors', value: `${formData.primaryColor} & ${formData.secondaryColor}` },
                      { label: 'Features Selected', value: formData.keyFeatures.join(', ') },
                      { label: 'Content / Domain', value: `Content: ${formData.hasContent} | Domain: ${formData.hasDomain}` },
                    ].map((row, rIdx) => (
                      <div key={rIdx} className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 border-b border-border/50 last:border-b-0 text-xs gap-1">
                        <span className="font-bold text-muted-foreground uppercase tracking-wider">{row.label}:</span>
                        <span className="font-medium text-foreground sm:text-right max-w-sm">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Copy (PDF)</span>
                    </button>
                    <span className="text-xs text-muted-foreground">100% Risk-Free Guarantee</span>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border/60">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-xs font-semibold transition-all ${
                    step === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-secondary text-foreground'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-primary/25 transition-all"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Submitting Brief...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Project Brief</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Success View */
            <div className="py-10 text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  Project Brief Received!
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Thank you, <strong>{formData.yourName}</strong>. Bharathkumar E and the ApexAssure 
                  team will review your requirements and reach out within 24 hours.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <a
                  href={`https://wa.me/918220802736?text=Hi%20Bharathkumar,%20I%20just%20submitted%20a%20project%20brief%20for%20${encodeURIComponent(formData.businessName)}!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/30 transition-all"
                >
                  Notify On WhatsApp Direct
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                  }}
                  className="px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground transition-all"
                >
                  Submit Another Brief
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
