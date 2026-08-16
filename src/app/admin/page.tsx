'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileDock } from '@/components/MobileDock';
import { Lead, ProjectBrief } from '@/lib/types';
import { exportSingleBriefPDF, exportSingleLeadPDF, exportAllBriefsPDF, exportAllSubmissionsPDF } from '@/lib/pdfGenerator';
import { 
  ShieldCheck, 
  Users, 
  FileSpreadsheet, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  ArrowLeft, 
  RefreshCw,
  Lock,
  Unlock,
  ExternalLink,
  ChevronRight,
  FileText,
  MessageSquare,
  Sparkles,
  Layers
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'leads' | 'briefs'>('all');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [briefs, setBriefs] = useState<ProjectBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrief, setSelectedBrief] = useState<ProjectBrief | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Authentication Security Gate
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const ADMIN_PINS = ['0220'];

  const checkAuth = () => {
    try {
      const savedAuth = sessionStorage.getItem('apex_admin_auth');
      if (savedAuth === 'true') {
        setIsUnlocked(true);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_PINS.includes(passcode.trim())) {
      setIsUnlocked(true);
      setAuthError(false);
      try {
        sessionStorage.setItem('apex_admin_auth', 'true');
      } catch {
        // ignore
      }
    } else {
      setAuthError(true);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPasscode('');
    try {
      sessionStorage.removeItem('apex_admin_auth');
    } catch {
      // ignore
    }
  };

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`/api/admin?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setBriefs(data.briefs || []);
      }
    } catch {
      // ignore
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    const isAuthed = checkAuth();
    if (isAuthed) {
      fetchData(true);
    }
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      fetchData(true);
      // Auto-poll every 3 seconds so new submissions reflect live
      const interval = setInterval(() => {
        fetchData(false);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isUnlocked]);

  const handleUpdateLeadStatus = async (id: string, newStatus: Lead['status']) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_lead_status', id, status: newStatus }),
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    } catch {
      // ignore
    }
  };

  const handleUpdateBriefStatus = async (id: string, newStatus: ProjectBrief['status']) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_brief_status', id, status: newStatus }),
      });
      if (res.ok) {
        setBriefs(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        if (selectedBrief && selectedBrief.id === id) {
          setSelectedBrief(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch {
      // ignore
    }
  };

  // CSV Export for Leads
  const exportLeadsCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Source', 'Status', 'Date', 'Notes'];
    const rows = leads.map(l => [
      l.id,
      `"${l.name}"`,
      l.email,
      l.phone,
      `"${l.source}"`,
      l.status,
      new Date(l.createdAt).toLocaleDateString(),
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ApexAssure_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export Handlers
  const handleExportAllPDF = () => {
    exportAllSubmissionsPDF(leads, briefs);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    (l.notes && l.notes.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredBriefs = briefs.filter(b =>
    b.businessName.toLowerCase().includes(search.toLowerCase()) ||
    b.yourName.toLowerCase().includes(search.toLowerCase()) ||
    b.email.toLowerCase().includes(search.toLowerCase()) ||
    b.phone.includes(search) ||
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  // Combined Feed of both Leads & Briefs sorted by date
  type CombinedItem = 
    | { type: 'lead'; item: Lead; date: Date }
    | { type: 'brief'; item: ProjectBrief; date: Date };

  const combinedFeed: CombinedItem[] = [
    ...filteredLeads.map(l => ({ type: 'lead' as const, item: l, date: new Date(l.createdAt) })),
    ...filteredBriefs.map(b => ({ type: 'brief' as const, item: b, date: new Date(b.createdAt) })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // ----------------------------------------------------
  // PIN CLEARANCE GATE VIEW
  // ----------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border/80 rounded-3xl p-8 shadow-2xl glass-panel text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/10">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2 mb-6">
              <div className="text-[11px] font-bold uppercase tracking-widest text-primary">
                Security Clearance Required
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Admin Management Portal
              </h1>
              <p className="text-xs text-muted-foreground">
                Enter your 4-digit Master Security PIN to view live inquiries and generate PDF proposals.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="password"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="••••"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError(false);
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl bg-background border text-center font-mono text-xl tracking-[0.4em] outline-none transition-all ${
                    authError 
                      ? 'border-destructive ring-1 ring-destructive text-destructive' 
                      : 'border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground'
                  }`}
                />
                {authError && (
                  <p className="text-xs text-destructive font-semibold animate-in fade-in">
                    Incorrect PIN. Access restricted.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Admin Dashboard</span>
              </button>
            </form>

            <div className="mt-8 pt-4 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portfolio</span>
              </Link>
              <span>ApexAssure Studio</span>
            </div>
          </div>
        </main>
        <Footer />
        <MobileDock />
      </div>
    );
  }

  // ----------------------------------------------------
  // UNLOCKED DASHBOARD VIEW
  // ----------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Live Cloud Database Connected
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Client Leads &amp; Project Briefs
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Real-time ingestion hub. Manage inquiries and download PDF functional requirement documents.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleLock}
                className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Lock Dashboard"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Lock</span>
              </button>

              <button
                onClick={() => fetchData(true)}
                className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Refresh live data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleExportAllPDF}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-600/25 transition-all"
                title="Export Master Executive PDF containing all leads and briefs"
              >
                <FileText className="w-4 h-4" />
                <span>Export All (PDF)</span>
              </button>

              <button
                onClick={exportLeadsCSV}
                className="px-3.5 py-2.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Export leads as CSV spreadsheet"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => setActiveTab('leads')}
              className="glass-panel p-5 rounded-2xl border border-border hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Quick Contact Leads</span>
                <Users className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">{leads.length}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                {leads.filter(l => l.status === 'new').length} New Inquiries
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('briefs')}
              className="glass-panel p-5 rounded-2xl border border-border hover:border-emerald-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Project Briefs (FRD)</span>
                <FileSpreadsheet className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">{briefs.length}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                {briefs.filter(b => b.status === 'new').length} Detailed Briefs
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('all')}
              className="glass-panel p-5 rounded-2xl border border-border hover:border-blue-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Total Ingested</span>
                <Layers className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">
                {leads.length + briefs.length}
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                Combined All Responses
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Flagship Product</span>
                <ExternalLink className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="font-serif text-3xl font-bold text-emerald-600 dark:text-emerald-400">Live</div>
              <div className="text-[11px] text-muted-foreground font-medium mt-1">
                <a href="https://munnartools.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  munnartools.vercel.app &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Tab Selector & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            <div className="flex p-1 bg-secondary/80 rounded-2xl border border-border">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Responses ({leads.length + briefs.length})
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'leads'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Quick Leads ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('briefs')}
                className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'briefs'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Project Briefs ({briefs.length})
              </button>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by company, client name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground"
              />
            </div>

          </div>

          {/* TAB 1: ALL RESPONSES (COMBINED MASTER FEED) */}
          {activeTab === 'all' && (
            <div className="space-y-4">
              {combinedFeed.length === 0 ? (
                <div className="glass-panel rounded-3xl p-12 text-center text-muted-foreground border border-border">
                  No form submissions found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {combinedFeed.map((item, index) => {
                    if (item.type === 'lead') {
                      const l = item.item;
                      return (
                        <div 
                          key={`feed-lead-${l.id}-${index}`}
                          className="glass-panel rounded-3xl p-6 border border-border hover:border-primary/50 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden"
                        >
                          {/* Accent Pill */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>Quick Contact Lead</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(l.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Client Details */}
                          <div className="space-y-2 mb-4">
                            <h3 className="font-serif text-xl font-bold text-foreground">{l.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {l.notes || 'Direct contact inquiry received via website.'}
                            </p>
                            <div className="pt-2 space-y-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5 text-foreground truncate">
                                <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <a href={`mailto:${l.email}`} className="hover:underline truncate">{l.email}</a>
                              </div>
                              <div className="flex items-center gap-1.5 text-foreground">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <a href={`tel:${l.phone}`} className="hover:underline">{l.phone}</a>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                            <button
                              onClick={() => exportSingleLeadPDF(l)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 border border-red-600/30 text-red-600 dark:text-red-400 text-xs font-bold transition-colors"
                              title="Download Lead Ingestion PDF"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>

                            <a
                              href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(l.name)},%20thank%20you%20for%20contacting%20ApexAssure%20Studio!`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      );
                    } else {
                      const b = item.item;
                      return (
                        <div 
                          key={`feed-brief-${b.id}-${index}`}
                          className="glass-panel rounded-3xl p-6 border border-border hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-lg relative overflow-hidden"
                        >
                          {/* Accent Pill */}
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                              <FileSpreadsheet className="w-3 h-3" />
                              <span>Project Brief (FRD)</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Brief Details */}
                          <div className="space-y-2 mb-4">
                            <h3 className="font-serif text-xl font-bold text-foreground">{b.businessName}</h3>
                            <div className="text-xs font-semibold text-primary">Contact: {b.yourName}</div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {b.description || 'Fullstack project scope requirement.'}
                            </p>
                            <div className="text-[11px] text-muted-foreground">
                              <span className="font-semibold text-foreground">Style:</span> {b.designLook}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                            <button
                              onClick={() => setSelectedBrief(b)}
                              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                            >
                              <span>View 6-Step FRD</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => exportSingleBriefPDF(b)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 border border-red-600/30 text-red-600 dark:text-red-400 text-xs font-bold transition-colors"
                                title="Download Full FRD PDF"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </button>

                              <a
                                href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(b.yourName)},%20I%20received%20your%20project%20brief%20for%20${encodeURIComponent(b.businessName)}!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Quick Leads Dedicated Table */}
          {activeTab === 'leads' && (
            <div className="glass-panel rounded-3xl border border-border overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/60 border-b border-border/80 text-muted-foreground uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-6 py-4">Client Name</th>
                      <th className="px-6 py-4">Contact Details</th>
                      <th className="px-6 py-4">Status Stage</th>
                      <th className="px-6 py-4">Received Date</th>
                      <th className="px-6 py-4">Export &amp; Connect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                          No leads found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-foreground text-sm">{lead.name}</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5 max-w-xs truncate">{lead.notes || 'No message notes'}</div>
                          </td>
                          <td className="px-6 py-4 space-y-1">
                            <div className="flex items-center gap-1.5 text-foreground">
                              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                              <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                              <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none cursor-pointer ${
                                lead.status === 'new' 
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                                  : lead.status === 'contacted'
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                                  : lead.status === 'converted'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  : 'bg-muted text-muted-foreground border-border'
                              }`}
                            >
                              <option value="new">🟡 New Lead</option>
                              <option value="contacted">🔵 Contacted</option>
                              <option value="converted">🟢 Converted</option>
                              <option value="closed">⚪ Closed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Date(lead.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => exportSingleLeadPDF(lead)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-600/30 text-red-600 dark:text-red-400 text-xs font-bold transition-colors"
                                title="Download PDF"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </button>

                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20ApexAssure%20Studio!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Project Briefs Cards Grid */}
          {activeTab === 'briefs' && (
            <div className="space-y-4">
              {filteredBriefs.length === 0 ? (
                <div className="glass-panel rounded-3xl p-12 text-center text-muted-foreground border border-border">
                  No project briefs found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBriefs.map((b) => (
                    <div 
                      key={b.id}
                      className="glass-panel rounded-3xl p-6 border border-border hover:border-primary/50 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group"
                    >
                      <div className="space-y-4">
                        {/* Header Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-primary/10 text-primary border border-primary/20">
                            {b.designLook}
                          </span>
                          
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBriefStatus(b.id, e.target.value as ProjectBrief['status'])}
                            className="text-xs font-semibold px-2 py-1 rounded-lg bg-secondary border border-border outline-none cursor-pointer"
                          >
                            <option value="new">🟡 New</option>
                            <option value="reviewed">🔵 Reviewed</option>
                            <option value="in-progress">🟣 In Progress</option>
                            <option value="completed">🟢 Completed</option>
                          </select>
                        </div>

                        {/* Title & Contact */}
                        <div>
                          <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {b.businessName}
                          </h3>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Contact: <span className="font-semibold text-foreground">{b.yourName}</span>
                          </div>
                        </div>

                        {/* Description Scope */}
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {b.description || 'No business description provided.'}
                        </p>

                        {/* Key Info Preview */}
                        <div className="pt-2 border-t border-border/40 space-y-1.5 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Goals:</span>
                            <span className="font-medium text-foreground truncate max-w-[180px]">
                              {Array.isArray(b.goals) ? b.goals.join(', ') : b.goals}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Colors:</span>
                            <span className="font-medium text-foreground">{b.primaryColor || 'Default'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedBrief(b)}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <span>View 6-Step FRD</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => exportSingleBriefPDF(b)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-600/30 text-red-600 dark:text-red-400 text-xs font-bold transition-colors"
                            title="Download FRD PDF Document"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Download FRD (PDF)</span>
                          </button>

                          <a
                            href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(b.yourName)},%20I%20received%20your%20project%20brief%20for%20${encodeURIComponent(b.businessName)}!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors"
                            title="Direct WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* DETAILED PROJECT BRIEF MODAL VIEW */}
      {selectedBrief && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedBrief(null)}
        >
          <div 
            className="w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl glass-panel max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/80">
              <div>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  Functional Requirements Document (FRD)
                </span>
                <h2 className="font-serif text-2xl font-bold text-foreground mt-2">
                  {selectedBrief.businessName}
                </h2>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Submitted by {selectedBrief.yourName} on {new Date(selectedBrief.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportSingleBriefPDF(selectedBrief)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/25 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => setSelectedBrief(null)}
                  className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Scope Details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 space-y-2">
                <div className="font-bold text-foreground text-sm uppercase tracking-wider text-primary">
                  1. Contact Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-foreground">
                  <div><strong>Email:</strong> <a href={`mailto:${selectedBrief.email}`} className="text-primary hover:underline">{selectedBrief.email}</a></div>
                  <div><strong>Phone:</strong> <a href={`tel:${selectedBrief.phone}`} className="text-primary hover:underline">{selectedBrief.phone}</a></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 space-y-2">
                <div className="font-bold text-foreground text-sm uppercase tracking-wider text-primary">
                  2. Business Overview &amp; Goals
                </div>
                <p className="text-muted-foreground">{selectedBrief.description}</p>
                <div>
                  <strong>Primary Goals:</strong> {Array.isArray(selectedBrief.goals) ? selectedBrief.goals.join(', ') : selectedBrief.goals}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 space-y-2">
                <div className="font-bold text-foreground text-sm uppercase tracking-wider text-primary">
                  3. Target Audience &amp; Design Aesthetic
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div><strong>Audience:</strong> {selectedBrief.audienceGender} ({selectedBrief.audienceAge})</div>
                  <div><strong>Design Look:</strong> {selectedBrief.designLook}</div>
                  <div><strong>Colors:</strong> {selectedBrief.primaryColor} / {selectedBrief.secondaryColor}</div>
                  <div><strong>Theme:</strong> {selectedBrief.colorTheme}</div>
                  <div><strong>Content Ready:</strong> {selectedBrief.hasContent}</div>
                  <div><strong>Domain Ready:</strong> {selectedBrief.hasDomain}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 space-y-2">
                <div className="font-bold text-foreground text-sm uppercase tracking-wider text-primary">
                  4. Key Technical Capabilities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(selectedBrief.keyFeatures) ? selectedBrief.keyFeatures : String(selectedBrief.keyFeatures).split(',')).map((f, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-background border border-border font-medium">
                      &bull; {f.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-border/80 flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedBrief.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedBrief.yourName)},%20I%20have%20reviewed%20your%20requirements%20for%20${encodeURIComponent(selectedBrief.businessName)}!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>

              <button
                onClick={() => exportSingleBriefPDF(selectedBrief)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/25 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Download FRD (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MobileDock />
    </div>
  );
}
