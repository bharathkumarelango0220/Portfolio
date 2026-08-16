'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileDock } from '@/components/MobileDock';
import { Lead, ProjectBrief } from '@/lib/types';
import { exportSingleBriefPDF, exportAllBriefsPDF } from '@/lib/pdfGenerator';
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
  FileText
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'briefs'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [briefs, setBriefs] = useState<ProjectBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrief, setSelectedBrief] = useState<ProjectBrief | null>(null);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setBriefs(data.briefs || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuthed = checkAuth();
    if (isAuthed) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      fetchData();
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
        if (selectedBrief?.id === id) {
          setSelectedBrief(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch {
      // ignore
    }
  };

  const exportLeadsCSV = () => {
    const headers = ['ID,Name,Email,Phone,Source,Status,Created At,Notes'];
    const rows = leads.map(l => 
      `"${l.id}","${l.name}","${l.email}","${l.phone}","${l.source || ''}","${l.status}","${l.createdAt}","${(l.notes || '').replace(/"/g, '""')}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `ApexAssure_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportBriefsPDF = () => {
    exportAllBriefsPDF(briefs);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.toLowerCase().includes(search.toLowerCase())
  );

  const filteredBriefs = briefs.filter(b => 
    b.businessName.toLowerCase().includes(search.toLowerCase()) ||
    b.yourName.toLowerCase().includes(search.toLowerCase()) ||
    b.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-border shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-primary/15 text-primary flex items-center justify-center mx-auto shadow-lg shadow-primary/10">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary">Restricted Access</span>
              <h1 className="font-serif text-2xl font-bold text-foreground">Admin Clearance Gate</h1>
              <p className="text-xs text-muted-foreground">
                Enter your secret administrator PIN to access client leads, inquiries, and project briefs.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Master Security PIN
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="Enter 4-digit Master PIN"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError(false);
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl bg-background border text-center font-mono text-lg tracking-widest outline-none transition-all ${
                    authError 
                      ? 'border-destructive ring-1 ring-destructive text-destructive animate-shake' 
                      : 'border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground'
                  }`}
                />
                {authError && (
                  <p className="text-xs text-destructive font-medium text-center pt-1">
                    Incorrect PIN. Please enter the valid administrator passkey.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Admin Dashboard</span>
              </button>
            </form>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portfolio</span>
              </Link>
              <span className="text-[11px] text-muted-foreground">ApexAssure Shield v2.0</span>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground mobile-safe-bottom">
      <Navbar />

      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portfolio</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    Lead &amp; Brief Management Portal
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    ApexAssure Admin Dashboard &bull; Bharathkumar E
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLock}
                className="p-2.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Lock Dashboard"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Lock</span>
              </button>

              <button
                onClick={fetchData}
                className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {activeTab === 'leads' ? (
                <button
                  onClick={exportLeadsCSV}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              ) : (
                <button
                  onClick={exportBriefsPDF}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export All (PDF)</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Total Quick Leads</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">{leads.length}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                {leads.filter(l => l.status === 'new').length} New Pending
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Project Briefs (FRD)</span>
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">{briefs.length}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                {briefs.filter(b => b.status === 'new').length} Detailed Briefs
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Contacted / Reviewed</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">
                {leads.filter(l => l.status === 'contacted' || l.status === 'converted').length + briefs.filter(b => b.status !== 'new').length}
              </div>
              <div className="text-[11px] text-muted-foreground font-medium mt-1">In active communication</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Flagship Product Traffic</span>
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
            
            <div className="flex p-1 bg-secondary/80 rounded-2xl border border-border max-w-xs">
              <button
                onClick={() => setActiveTab('leads')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'leads'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Quick Leads ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('briefs')}
                className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
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
                placeholder={`Search ${activeTab === 'leads' ? 'leads by name, email, phone...' : 'briefs by company, name...'}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground"
              />
            </div>

          </div>

          {/* TAB 1: Leads Table */}
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
                      <th className="px-6 py-4">Actions</th>
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
                            <div className="text-[11px] text-muted-foreground mt-0.5">{lead.notes || 'No message notes'}</div>
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
                              className="px-2.5 py-1 rounded-lg bg-card border border-border font-semibold text-xs text-foreground outline-none cursor-pointer"
                            >
                              <option value="new">🟡 New Lead</option>
                              <option value="contacted">🔵 Contacted</option>
                              <option value="in_review">🟣 In Review</option>
                              <option value="converted">🟢 Converted Client</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Date(lead.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1 border border-emerald-500/30"
                            >
                              <span>WhatsApp</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Project Briefs Cards & Drawer */}
          {activeTab === 'briefs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBriefs.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground glass-panel rounded-3xl border">
                  No project briefs found.
                </div>
              ) : (
                filteredBriefs.map((brief) => (
                  <div
                    key={brief.id}
                    className="glass-panel rounded-3xl p-6 border border-border/80 shadow-lg flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {brief.designLook}
                        </span>
                        <select
                          value={brief.status}
                          onChange={(e) => handleUpdateBriefStatus(brief.id, e.target.value as ProjectBrief['status'])}
                          className="px-2 py-0.5 rounded bg-secondary text-[11px] font-semibold text-foreground border border-border outline-none"
                        >
                          <option value="new">🟡 New</option>
                          <option value="reviewed">🔵 Reviewed</option>
                          <option value="in_progress">🟣 In Progress</option>
                          <option value="completed">🟢 Completed</option>
                        </select>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-foreground">
                        {brief.businessName}
                      </h3>
                      <div className="text-xs text-muted-foreground font-medium mb-3">
                        Contact: <strong>{brief.yourName}</strong>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {brief.description}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Goals:</span>
                          <span className="font-medium text-foreground text-right">{brief.goals.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Colors:</span>
                          <span className="font-medium text-foreground">{brief.primaryColor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedBrief(brief)}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>View 6-Step FRD</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => exportSingleBriefPDF(brief)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Download Brief as PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <a
                          href={`https://wa.me/${brief.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(brief.yourName)},%20this%20is%20Bharathkumar%20regarding%20your%20ApexAssure%20project%20brief!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                          title="Contact on WhatsApp"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </main>

      {/* Detailed Brief Modal */}
      {selectedBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl glass-panel relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Project Brief FRD</span>
                <h3 className="font-serif text-2xl font-bold text-foreground">{selectedBrief.businessName}</h3>
              </div>
              <button
                onClick={() => setSelectedBrief(null)}
                className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-secondary/50 border border-border">
                <div><span className="text-muted-foreground font-semibold">Contact Person:</span> <div className="font-bold text-sm text-foreground mt-0.5">{selectedBrief.yourName}</div></div>
                <div><span className="text-muted-foreground font-semibold">Email:</span> <div className="font-medium text-foreground mt-0.5">{selectedBrief.email}</div></div>
                <div><span className="text-muted-foreground font-semibold">Phone / WhatsApp:</span> <div className="font-medium text-foreground mt-0.5">{selectedBrief.phone}</div></div>
                <div><span className="text-muted-foreground font-semibold">Submitted Date:</span> <div className="font-medium text-foreground mt-0.5">{new Date(selectedBrief.createdAt).toLocaleString()}</div></div>
              </div>

              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider text-muted-foreground">Business Overview &amp; Goals:</span>
                <p className="p-3.5 rounded-xl bg-background border border-border text-foreground leading-relaxed">
                  {selectedBrief.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-background border border-border">
                  <div className="font-semibold text-muted-foreground">Target Demographic</div>
                  <div className="font-bold text-foreground mt-1">{selectedBrief.audienceGender} ({selectedBrief.audienceAge})</div>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border">
                  <div className="font-semibold text-muted-foreground">Visual Style</div>
                  <div className="font-bold text-foreground mt-1">{selectedBrief.designLook}</div>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border">
                  <div className="font-semibold text-muted-foreground">Color Scheme</div>
                  <div className="font-bold text-foreground mt-1">{selectedBrief.primaryColor} / {selectedBrief.secondaryColor}</div>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border">
                  <div className="font-semibold text-muted-foreground">Theme Mode</div>
                  <div className="font-bold text-foreground mt-1">{selectedBrief.colorTheme}</div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider text-muted-foreground">Selected Features:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedBrief.keyFeatures.map((kf, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-[11px] border border-primary/20">
                      ✓ {kf}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 border border-border flex justify-between">
                <span>Content Ready: <strong>{selectedBrief.hasContent}</strong></span>
                <span>Domain Ready: <strong>{selectedBrief.hasDomain}</strong></span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportSingleBriefPDF(selectedBrief)}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-600/25 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download FRD (PDF)</span>
                </button>
                <a
                  href={`https://wa.me/${selectedBrief.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(selectedBrief.yourName)},%20this%20is%20Bharathkumar%20from%20ApexAssure.%20I%20reviewed%20your%20brief%20for%20${encodeURIComponent(selectedBrief.businessName)}!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/25 transition-all"
                >
                  WhatsApp Client
                </a>
              </div>
              <button
                onClick={() => setSelectedBrief(null)}
                className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold"
              >
                Dismiss
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
