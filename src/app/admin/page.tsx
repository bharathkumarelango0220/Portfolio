'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileDock } from '@/components/MobileDock';
import { Lead, ProjectBrief, ShowcaseProject } from '@/lib/types';
import { exportSingleBriefPDF, exportSingleLeadPDF, exportAllSubmissionsPDF } from '@/lib/pdfGenerator';
import { 
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
  Layers,
  Trash2,
  Edit3,
  Volume2,
  VolumeX,
  Plus,
  Save,
  X,
  AlertTriangle,
  FileDown,
  Star,
  DollarSign,
  Globe,
  Grid,
  List,
  Calendar,
  Send,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'leads' | 'briefs' | 'projects'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'converted' | 'starred' | 'archived'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [briefs, setBriefs] = useState<ProjectBrief[]>([]);
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals & States
  const [selectedBrief, setSelectedBrief] = useState<ProjectBrief | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'lead' | 'brief' | 'project'; name: string } | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ id: string; type: 'lead' | 'brief'; text: string } | null>(null);
  const [editingDealValue, setEditingDealValue] = useState<{ id: string; type: 'lead' | 'brief'; value: number } | null>(null);
  const [whatsAppModal, setWhatsAppModal] = useState<{ phone: string; name: string; business: string } | null>(null);
  const [customMsg, setCustomMsg] = useState('');

  // Add New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    url: '',
    category: 'Web App',
    description: '',
    impact: '100/100 Core Web Vitals, Live Production',
    tags: 'Next.js 15, TypeScript, TailwindCSS',
    featured: false,
  });
  const [addingProject, setAddingProject] = useState(false);
  const [projectSuccessMsg, setProjectSuccessMsg] = useState('');

  // Track previous counts for audio alerts
  const prevCountRef = useRef<number>(0);

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

  const playNewLeadChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.18, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.7);
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
        const newLeads = data.leads || [];
        const newBriefs = data.briefs || [];
        const newProjects = data.projects || [];
        const totalCount = newLeads.length + newBriefs.length;

        if (prevCountRef.current > 0 && totalCount > prevCountRef.current) {
          playNewLeadChime();
        }
        prevCountRef.current = totalCount;

        setLeads(newLeads);
        setBriefs(newBriefs);
        setProjects(newProjects);
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
      const interval = setInterval(() => {
        fetchData(false);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isUnlocked, soundEnabled]);

  // Stage & Status Management
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

  // Toggle Star / Priority
  const handleToggleStar = async (id: string, type: 'lead' | 'brief') => {
    try {
      const action = type === 'lead' ? 'toggle_star_lead' : 'toggle_star_brief';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id }),
      });
      if (res.ok) {
        if (type === 'lead') {
          setLeads(prev => prev.map(l => l.id === id ? { ...l, starred: !l.starred } : l));
        } else {
          setBriefs(prev => prev.map(b => b.id === id ? { ...b, starred: !b.starred } : b));
        }
      }
    } catch {
      // ignore
    }
  };

  // Save Deal Value
  const handleSaveDealValue = async () => {
    if (!editingDealValue) return;
    try {
      const action = editingDealValue.type === 'lead' ? 'update_lead_deal_value' : 'update_brief_deal_value';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id: editingDealValue.id, estimatedValue: editingDealValue.value }),
      });
      if (res.ok) {
        if (editingDealValue.type === 'lead') {
          setLeads(prev => prev.map(l => l.id === editingDealValue.id ? { ...l, estimatedValue: editingDealValue.value } : l));
        } else {
          setBriefs(prev => prev.map(b => b.id === editingDealValue.id ? { ...b, estimatedValue: editingDealValue.value } : b));
        }
        setEditingDealValue(null);
      }
    } catch {
      // ignore
    }
  };

  // Save Internal Notes
  const handleSaveNotes = async () => {
    if (!editingNotes) return;
    try {
      const action = editingNotes.type === 'lead' ? 'update_lead_notes' : 'update_brief_notes';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id: editingNotes.id, notes: editingNotes.text }),
      });
      if (res.ok) {
        if (editingNotes.type === 'lead') {
          setLeads(prev => prev.map(l => l.id === editingNotes.id ? { ...l, internalNotes: editingNotes.text } : l));
        } else {
          setBriefs(prev => prev.map(b => b.id === editingNotes.id ? { ...b, internalNotes: editingNotes.text } : b));
          if (selectedBrief && selectedBrief.id === editingNotes.id) {
            setSelectedBrief(prev => prev ? { ...prev, internalNotes: editingNotes.text } : null);
          }
        }
        setEditingNotes(null);
      }
    } catch {
      // ignore
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const action = deleteTarget.type === 'lead' ? 'delete_lead' : deleteTarget.type === 'brief' ? 'delete_brief' : 'delete_project';
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id: deleteTarget.id }),
      });
      if (res.ok) {
        if (deleteTarget.type === 'lead') {
          setLeads(prev => prev.filter(l => l.id !== deleteTarget.id));
        } else if (deleteTarget.type === 'brief') {
          setBriefs(prev => prev.filter(b => b.id !== deleteTarget.id));
          if (selectedBrief?.id === deleteTarget.id) setSelectedBrief(null);
        } else {
          setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
        }
        setDeleteTarget(null);
      }
    } catch {
      // ignore
    }
  };

  // Add Dynamic Showcase Project Action
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.url.trim()) return;

    setAddingProject(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_project',
          projectData: {
            title: newProject.title,
            url: newProject.url,
            category: newProject.category,
            description: newProject.description || 'Modern high-performance web architecture.',
            impact: newProject.impact || '100/100 Core Web Vitals',
            tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
            featured: newProject.featured,
          }
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects(prev => [data.project, ...prev]);
        setNewProject({
          title: '',
          url: '',
          category: 'Web App',
          description: '',
          impact: '100/100 Core Web Vitals, Live Production',
          tags: 'Next.js 15, TypeScript, TailwindCSS',
          featured: false,
        });
        setProjectSuccessMsg('Website successfully published to your live portfolio showcase!');
        setTimeout(() => setProjectSuccessMsg(''), 4000);
      }
    } catch {
      // ignore
    } finally {
      setAddingProject(false);
    }
  };

  // Toggle Project Featured Status
  const handleToggleProjectFeature = async (id: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_feature_project', id }),
      });
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
      }
    } catch {
      // ignore
    }
  };

  // CSV Export for Leads
  const exportLeadsCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Source', 'Status', 'DealValue', 'Starred', 'Date', 'Notes', 'InternalNotes'];
    const rows = leads.map(l => [
      l.id,
      `"${l.name}"`,
      l.email,
      l.phone,
      `"${l.source}"`,
      l.status,
      l.estimatedValue || 0,
      l.starred ? 'YES' : 'NO',
      new Date(l.createdAt).toLocaleDateString(),
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${(l.internalNotes || '').replace(/"/g, '""')}"`
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

  // Filtering Logic
  const checkDate = (dateStr: string) => {
    if (dateFilter === 'all') return true;
    const itemDate = new Date(dateStr);
    const now = new Date();
    if (dateFilter === 'today') {
      return itemDate.toDateString() === now.toDateString();
    }
    if (dateFilter === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 86400000);
      return itemDate >= oneWeekAgo;
    }
    if (dateFilter === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 86400000);
      return itemDate >= oneMonthAgo;
    }
    return true;
  };

  const filterByStatus = (status: string, starred?: boolean) => {
    if (statusFilter === 'all') return status !== 'archived';
    if (statusFilter === 'starred') return Boolean(starred);
    if (statusFilter === 'new') return status === 'new';
    if (statusFilter === 'in_progress') return status === 'contacted' || status === 'reviewed' || status === 'in_progress';
    if (statusFilter === 'converted') return status === 'converted' || status === 'completed';
    if (statusFilter === 'archived') return status === 'archived';
    return true;
  };

  const filteredLeads = leads.filter(l => 
    checkDate(l.createdAt) &&
    filterByStatus(l.status, l.starred) && (
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.notes && l.notes.toLowerCase().includes(search.toLowerCase())) ||
      (l.internalNotes && l.internalNotes.toLowerCase().includes(search.toLowerCase()))
    )
  );

  const filteredBriefs = briefs.filter(b =>
    checkDate(b.createdAt) &&
    filterByStatus(b.status, b.starred) && (
      b.businessName.toLowerCase().includes(search.toLowerCase()) ||
      b.yourName.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      (b.internalNotes && b.internalNotes.toLowerCase().includes(search.toLowerCase()))
    )
  );

  type CombinedItem = 
    | { type: 'lead'; item: Lead; date: Date; starred: boolean }
    | { type: 'brief'; item: ProjectBrief; date: Date; starred: boolean };

  const combinedFeed: CombinedItem[] = [
    ...filteredLeads.map(l => ({ type: 'lead' as const, item: l, date: new Date(l.createdAt), starred: Boolean(l.starred) })),
    ...filteredBriefs.map(b => ({ type: 'brief' as const, item: b, date: new Date(b.createdAt), starred: Boolean(b.starred) })),
  ].sort((a, b) => {
    // Starred first, then newest
    if (a.starred !== b.starred) return a.starred ? -1 : 1;
    return b.date.getTime() - a.date.getTime();
  });

  // Calculate Total Estimated Pipeline Value
  const totalPipelineRevenue = [
    ...leads.map(l => l.estimatedValue || 0),
    ...briefs.map(b => b.estimatedValue || 0),
  ].reduce((acc, val) => acc + val, 0);

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
                Enter your 4-digit Master Security PIN to view live inquiries and manage showcase projects.
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
          
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Live Cloud Database Connected
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                ApexAssure Command Center
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Ingestion hub, deal pipeline, client notes, and dynamic portfolio showcase manager.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* View Mode Toggle */}
              <div className="flex items-center p-1 bg-secondary rounded-xl border border-border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                  title="Grid Cards View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                  title="Compact Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Audio Chime Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  soundEnabled 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                    : 'bg-secondary text-muted-foreground border-border'
                }`}
                title={soundEnabled ? 'Live Audio Chime Enabled' : 'Audio Muted'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden md:inline">{soundEnabled ? 'Alerts On' : 'Muted'}</span>
              </button>

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
                onClick={() => exportAllSubmissionsPDF(leads, briefs)}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-600/25 transition-all"
                title="Export Master Executive PDF"
              >
                <FileDown className="w-4 h-4" />
                <span>Export All (PDF)</span>
              </button>

              <button
                onClick={exportLeadsCSV}
                className="px-3.5 py-2.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Export leads as CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => { setActiveTab('leads'); setStatusFilter('all'); }}
              className="glass-panel p-5 rounded-2xl border border-border hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Quick Contact Leads</span>
                <Users className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">{leads.length}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <span>{leads.filter(l => l.status === 'new').length} New Pending</span>
                {leads.filter(l => l.starred).length > 0 && (
                  <span className="text-amber-500 font-bold ml-1 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500" /> {leads.filter(l => l.starred).length}
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => { setActiveTab('briefs'); setStatusFilter('all'); }}
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
              onClick={() => setActiveTab('projects')}
              className="glass-panel p-5 rounded-2xl border border-border hover:border-blue-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Showcase Portfolio</span>
                <Globe className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">{projects.length}</div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                Live Dynamic Showcases
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Est. Pipeline Value</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="font-serif text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {totalPipelineRevenue > 0 ? `₹${totalPipelineRevenue.toLocaleString()}` : '—'}
              </div>
              <div className="text-[11px] text-muted-foreground font-medium mt-1">
                Active Client Budget Total
              </div>
            </div>
          </div>

          {/* Tab Navigation, Filters & Search */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              
              {/* Main Tabs */}
              <div className="flex p-1 bg-secondary/80 rounded-2xl border border-border overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'all'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All Inquiries ({leads.length + briefs.length})
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'leads'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Quick Leads ({leads.length})
                </button>
                <button
                  onClick={() => setActiveTab('briefs')}
                  className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'briefs'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Project Briefs ({briefs.length})
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === 'projects'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio Showcase ({projects.length})</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, company, email, notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground"
                />
              </div>

            </div>

            {/* Quick Filters (Status & Date) */}
            {activeTab !== 'projects' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                {/* Stage Filters */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1">Stage:</span>
                  {[
                    { key: 'all', label: 'All Active' },
                    { key: 'starred', label: '⭐ VIP Starred' },
                    { key: 'new', label: '🟡 New Pending' },
                    { key: 'in_progress', label: '🔵 In Review' },
                    { key: 'converted', label: '🟢 Converted' },
                    { key: 'archived', label: '📦 Archived' },
                  ].map(chip => (
                    <button
                      key={chip.key}
                      onClick={() => setStatusFilter(chip.key as typeof statusFilter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        statusFilter === chip.key
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border-border/70'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Date Filters */}
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                  {[
                    { key: 'all', label: 'All Time' },
                    { key: 'today', label: 'Today' },
                    { key: 'week', label: 'This Week' },
                    { key: 'month', label: 'This Month' },
                  ].map(d => (
                    <button
                      key={d.key}
                      onClick={() => setDateFilter(d.key as typeof dateFilter)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        dateFilter === d.key
                          ? 'bg-foreground text-background font-bold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TAB 4: DYNAMIC PORTFOLIO SHOWCASE MANAGER */}
          {activeTab === 'projects' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Add Project Form Box */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-primary/30 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Instant Portfolio Publisher</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Add a New Website to Your Portfolio Showcase
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-6">
                  Paste the live website URL and project details below. It will immediately publish live on your homepage portfolio section!
                </p>

                {projectSuccessMsg && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{projectSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Website Live URL *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://client-site.vercel.app"
                        value={newProject.url}
                        onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Project / Brand Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kerala Organic Tea Storefront"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Category
                      </label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground"
                      >
                        <option value="Web App">Web App</option>
                        <option value="E-Commerce">E-Commerce</option>
                        <option value="SaaS">SaaS Platform</option>
                        <option value="Agency">Agency / Corporate</option>
                        <option value="Landing Page">Landing Page</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Impact / Metric Badge
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 100/100 Core Web Vitals"
                        value={newProject.impact}
                        onChange={(e) => setNewProject({ ...newProject, impact: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Tech Stack Tags (Comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="Next.js 15, TypeScript, Tailwind"
                        value={newProject.tags}
                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Short Description &amp; Scope
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview of the technical architecture, purpose, and client impact."
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProject.featured}
                        onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                        className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                      />
                      <span>Mark as Featured Showcase Project</span>
                    </label>

                    <button
                      type="submit"
                      disabled={addingProject || !newProject.title || !newProject.url}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/25 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{addingProject ? 'Publishing...' : 'Publish to Portfolio Live'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Published Projects List */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Active Showcase Websites ({projects.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="glass-panel rounded-3xl p-6 border border-border hover:border-primary/50 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-primary/10 text-primary border border-primary/20">
                            {proj.category}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleProjectFeature(proj.id)}
                              className={`p-1.5 rounded-lg border transition-colors ${proj.featured ? 'bg-amber-500/15 text-amber-500 border-amber-500/30' : 'text-muted-foreground hover:text-foreground border-border'}`}
                              title={proj.featured ? 'Featured on Portfolio' : 'Mark as Featured'}
                            >
                              <Star className={`w-3.5 h-3.5 ${proj.featured ? 'fill-amber-500' : ''}`} />
                            </button>

                            <button
                              onClick={() => setDeleteTarget({ id: proj.id, type: 'project', name: proj.title })}
                              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete from Portfolio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {proj.title}
                        </h4>

                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-3">
                          {proj.description}
                        </p>

                        <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block mb-3">
                          {proj.impact}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {proj.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-secondary text-[10px] text-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                          {proj.url}
                        </span>

                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border transition-colors"
                        >
                          <span>Visit Live</span>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ALL INQUIRIES FEED */}
          {activeTab === 'all' && (
            <div className="space-y-4">
              {combinedFeed.length === 0 ? (
                <div className="glass-panel rounded-3xl p-12 text-center text-muted-foreground border border-border">
                  No submissions found matching the current filter.
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {combinedFeed.map((feedItem, index) => {
                    if (feedItem.type === 'lead') {
                      const l = feedItem.item;
                      return (
                        <div 
                          key={`feed-lead-${l.id}-${index}`}
                          className={`glass-panel rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-lg relative overflow-hidden group ${
                            l.starred ? 'border-amber-500/50 bg-amber-500/[0.02]' : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div>
                            {/* Card Header Badge & Actions */}
                            <div className="flex items-center justify-between gap-2 mb-4">
                              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25 flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>Quick Lead</span>
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleToggleStar(l.id, 'lead')}
                                  className={`p-1 rounded-lg transition-colors ${l.starred ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}
                                  title={l.starred ? 'Starred VIP Client' : 'Star Lead'}
                                >
                                  <Star className={`w-4 h-4 ${l.starred ? 'fill-amber-500' : ''}`} />
                                </button>

                                <select
                                  value={l.status}
                                  onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value as Lead['status'])}
                                  className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-secondary border border-border outline-none cursor-pointer"
                                >
                                  <option value="new">🟡 New</option>
                                  <option value="contacted">🔵 Contacted</option>
                                  <option value="converted">🟢 Converted</option>
                                  <option value="archived">📦 Archive</option>
                                </select>

                                <button
                                  onClick={() => setDeleteTarget({ id: l.id, type: 'lead', name: l.name })}
                                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Client Details */}
                            <div className="space-y-2 mb-3">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-serif text-xl font-bold text-foreground">{l.name}</h3>
                                {l.estimatedValue ? (
                                  <span 
                                    onClick={() => setEditingDealValue({ id: l.id, type: 'lead', value: l.estimatedValue || 0 })}
                                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/20"
                                  >
                                    ₹{l.estimatedValue.toLocaleString()}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => setEditingDealValue({ id: l.id, type: 'lead', value: 0 })}
                                    className="text-[10px] text-muted-foreground hover:text-emerald-600 flex items-center gap-0.5"
                                  >
                                    <DollarSign className="w-3 h-3" /> +Deal Value
                                  </button>
                                )}
                              </div>

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

                            {/* Private Notes */}
                            <div className="pt-2">
                              {l.internalNotes ? (
                                <div 
                                  onClick={() => setEditingNotes({ id: l.id, type: 'lead', text: l.internalNotes || '' })}
                                  className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-start justify-between cursor-pointer hover:bg-emerald-500/15"
                                >
                                  <span className="line-clamp-2"><strong>Note:</strong> {l.internalNotes}</span>
                                  <Edit3 className="w-3 h-3 flex-shrink-0 ml-1 mt-0.5" />
                                </div>
                              ) : (
                                <button
                                  onClick={() => setEditingNotes({ id: l.id, type: 'lead', text: '' })}
                                  className="text-[11px] font-semibold text-muted-foreground hover:text-primary flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Add Private Note
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between gap-2">
                            <button
                              onClick={() => exportSingleLeadPDF(l)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/25 border border-red-600/30 text-red-600 dark:text-red-400 text-xs font-bold transition-colors"
                              title="Download Lead Ingestion PDF"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>

                            <button
                              onClick={() => setWhatsAppModal({ phone: l.phone, name: l.name, business: 'your project' })}
                              className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors flex items-center gap-1 text-xs font-semibold"
                              title="Quick-Reply WhatsApp Templates"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      );
                    } else {
                      const b = feedItem.item;
                      return (
                        <div 
                          key={`feed-brief-${b.id}-${index}`}
                          className={`glass-panel rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-lg relative overflow-hidden group ${
                            b.starred ? 'border-amber-500/50 bg-amber-500/[0.02]' : 'border-border hover:border-emerald-500/50'
                          }`}
                        >
                          <div>
                            {/* Card Header Badge & Actions */}
                            <div className="flex items-center justify-between gap-2 mb-4">
                              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                                <FileSpreadsheet className="w-3 h-3" />
                                <span>Project Brief (FRD)</span>
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleToggleStar(b.id, 'brief')}
                                  className={`p-1 rounded-lg transition-colors ${b.starred ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}
                                  title={b.starred ? 'Starred VIP Client' : 'Star Brief'}
                                >
                                  <Star className={`w-4 h-4 ${b.starred ? 'fill-amber-500' : ''}`} />
                                </button>

                                <select
                                  value={b.status}
                                  onChange={(e) => handleUpdateBriefStatus(b.id, e.target.value as ProjectBrief['status'])}
                                  className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-secondary border border-border outline-none cursor-pointer"
                                >
                                  <option value="new">🟡 New</option>
                                  <option value="reviewed">🔵 Reviewed</option>
                                  <option value="in_progress">🟣 In Progress</option>
                                  <option value="completed">🟢 Completed</option>
                                  <option value="archived">📦 Archive</option>
                                </select>

                                <button
                                  onClick={() => setDeleteTarget({ id: b.id, type: 'brief', name: b.businessName })}
                                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                  title="Delete Brief"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Brief Details */}
                            <div className="space-y-2 mb-3">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-serif text-xl font-bold text-foreground">{b.businessName}</h3>
                                {b.estimatedValue ? (
                                  <span 
                                    onClick={() => setEditingDealValue({ id: b.id, type: 'brief', value: b.estimatedValue || 0 })}
                                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/20"
                                  >
                                    ₹{b.estimatedValue.toLocaleString()}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => setEditingDealValue({ id: b.id, type: 'brief', value: 0 })}
                                    className="text-[10px] text-muted-foreground hover:text-emerald-600 flex items-center gap-0.5"
                                  >
                                    <DollarSign className="w-3 h-3" /> +Deal Value
                                  </button>
                                )}
                              </div>

                              <div className="text-xs font-semibold text-primary">Contact: {b.yourName}</div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {b.description || 'Fullstack project scope requirement.'}
                              </p>
                              <div className="text-[11px] text-muted-foreground">
                                <span className="font-semibold text-foreground">Style:</span> {b.designLook}
                              </div>
                            </div>

                            {/* Internal Notes */}
                            <div className="pt-2">
                              {b.internalNotes ? (
                                <div 
                                  onClick={() => setEditingNotes({ id: b.id, type: 'brief', text: b.internalNotes || '' })}
                                  className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-start justify-between cursor-pointer hover:bg-emerald-500/15"
                                >
                                  <span className="line-clamp-2"><strong>Note:</strong> {b.internalNotes}</span>
                                  <Edit3 className="w-3 h-3 flex-shrink-0 ml-1 mt-0.5" />
                                </div>
                              ) : (
                                <button
                                  onClick={() => setEditingNotes({ id: b.id, type: 'brief', text: '' })}
                                  className="text-[11px] font-semibold text-muted-foreground hover:text-primary flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Add Private Note
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between gap-2">
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

                              <button
                                onClick={() => setWhatsAppModal({ phone: b.phone, name: b.yourName, business: b.businessName })}
                                className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors"
                                title="Quick-Reply WhatsApp Templates"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                /* Compact High-Density Table View */
                <div className="glass-panel rounded-3xl border border-border overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-secondary/60 border-b border-border/80 text-muted-foreground uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="px-5 py-3">VIP</th>
                          <th className="px-5 py-3">Client / Business</th>
                          <th className="px-5 py-3">Type</th>
                          <th className="px-5 py-3">Contact</th>
                          <th className="px-5 py-3">Deal Value</th>
                          <th className="px-5 py-3">Stage</th>
                          <th className="px-5 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {combinedFeed.map((item, idx) => {
                          const isLead = item.type === 'lead';
                          const data = item.item;
                          return (
                            <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                              <td className="px-5 py-3">
                                <button
                                  onClick={() => handleToggleStar(data.id, isLead ? 'lead' : 'brief')}
                                  className={`p-1 ${item.starred ? 'text-amber-500' : 'text-muted-foreground'}`}
                                >
                                  <Star className={`w-4 h-4 ${item.starred ? 'fill-amber-500' : ''}`} />
                                </button>
                              </td>
                              <td className="px-5 py-3 font-semibold text-foreground">
                                {isLead ? (data as Lead).name : (data as ProjectBrief).businessName}
                              </td>
                              <td className="px-5 py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isLead ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                  {isLead ? 'Quick Lead' : 'Project Brief'}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-muted-foreground">
                                <div>{data.email}</div>
                                <div>{data.phone}</div>
                              </td>
                              <td className="px-5 py-3 font-mono font-bold text-emerald-600">
                                {data.estimatedValue ? `₹${data.estimatedValue.toLocaleString()}` : '—'}
                              </td>
                              <td className="px-5 py-3">
                                <span className="px-2 py-0.5 rounded bg-secondary text-[11px] font-medium">
                                  {data.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => isLead ? exportSingleLeadPDF(data as Lead) : exportSingleBriefPDF(data as ProjectBrief)}
                                    className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                    title="PDF"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setWhatsAppModal({ phone: data.phone, name: isLead ? (data as Lead).name : (data as ProjectBrief).yourName, business: isLead ? 'your project' : (data as ProjectBrief).businessName })}
                                    className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded"
                                    title="WhatsApp"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget({ id: data.id, type: isLead ? 'lead' : 'brief', name: isLead ? (data as Lead).name : (data as ProjectBrief).businessName })}
                                    className="p-1 text-muted-foreground hover:text-destructive rounded"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUICK LEADS DEDICATED TABLE */}
          {activeTab === 'leads' && (
            <div className="glass-panel rounded-3xl border border-border overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/60 border-b border-border/80 text-muted-foreground uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-6 py-4">VIP</th>
                      <th className="px-6 py-4">Client Name</th>
                      <th className="px-6 py-4">Contact Details</th>
                      <th className="px-6 py-4">Deal Value</th>
                      <th className="px-6 py-4">Status Stage</th>
                      <th className="px-6 py-4">Private Notes</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          No leads found matching current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleStar(lead.id, 'lead')}
                              className={`p-1 ${lead.starred ? 'text-amber-500' : 'text-muted-foreground'}`}
                            >
                              <Star className={`w-4 h-4 ${lead.starred ? 'fill-amber-500' : ''}`} />
                            </button>
                          </td>
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
                            {lead.estimatedValue ? (
                              <span 
                                onClick={() => setEditingDealValue({ id: lead.id, type: 'lead', value: lead.estimatedValue || 0 })}
                                className="font-mono font-bold text-emerald-600 cursor-pointer hover:underline"
                              >
                                ₹{lead.estimatedValue.toLocaleString()}
                              </span>
                            ) : (
                              <button
                                onClick={() => setEditingDealValue({ id: lead.id, type: 'lead', value: 0 })}
                                className="text-[11px] text-muted-foreground hover:text-emerald-600"
                              >
                                +Add ₹
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none cursor-pointer bg-secondary"
                            >
                              <option value="new">🟡 New Lead</option>
                              <option value="contacted">🔵 Contacted</option>
                              <option value="converted">🟢 Converted</option>
                              <option value="archived">📦 Archived</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            {lead.internalNotes ? (
                              <div 
                                onClick={() => setEditingNotes({ id: lead.id, type: 'lead', text: lead.internalNotes || '' })}
                                className="text-xs text-foreground cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                              >
                                <span className="truncate">{lead.internalNotes}</span>
                                <Edit3 className="w-3 h-3 flex-shrink-0" />
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingNotes({ id: lead.id, type: 'lead', text: '' })}
                                className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Add note
                              </button>
                            )}
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

                              <button
                                onClick={() => setWhatsAppModal({ phone: lead.phone, name: lead.name, business: 'your inquiry' })}
                                className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
                                title="WhatsApp Quick Templates"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setDeleteTarget({ id: lead.id, type: 'lead', name: lead.name })}
                                className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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

          {/* TAB 3: PROJECT BRIEFS GRID */}
          {activeTab === 'briefs' && (
            <div className="space-y-4">
              {filteredBriefs.length === 0 ? (
                <div className="glass-panel rounded-3xl p-12 text-center text-muted-foreground border border-border">
                  No project briefs found matching current filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBriefs.map((b) => (
                    <div 
                      key={b.id}
                      className={`glass-panel rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group ${
                        b.starred ? 'border-amber-500/50 bg-amber-500/[0.02]' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-primary/10 text-primary border border-primary/20">
                            {b.designLook}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleStar(b.id, 'brief')}
                              className={`p-1 ${b.starred ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}
                              title={b.starred ? 'Starred VIP Client' : 'Star Brief'}
                            >
                              <Star className={`w-4 h-4 ${b.starred ? 'fill-amber-500' : ''}`} />
                            </button>

                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBriefStatus(b.id, e.target.value as ProjectBrief['status'])}
                              className="text-xs font-semibold px-2 py-1 rounded-lg bg-secondary border border-border outline-none cursor-pointer"
                            >
                              <option value="new">🟡 New</option>
                              <option value="reviewed">🔵 Reviewed</option>
                              <option value="in_progress">🟣 In Progress</option>
                              <option value="completed">🟢 Completed</option>
                              <option value="archived">📦 Archive</option>
                            </select>

                            <button
                              onClick={() => setDeleteTarget({ id: b.id, type: 'brief', name: b.businessName })}
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                              title="Delete Brief"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {b.businessName}
                            </h3>
                            {b.estimatedValue ? (
                              <span 
                                onClick={() => setEditingDealValue({ id: b.id, type: 'brief', value: b.estimatedValue || 0 })}
                                className="font-mono font-bold text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded cursor-pointer"
                              >
                                ₹{b.estimatedValue.toLocaleString()}
                              </span>
                            ) : (
                              <button
                                onClick={() => setEditingDealValue({ id: b.id, type: 'brief', value: 0 })}
                                className="text-[10px] text-muted-foreground hover:text-emerald-600"
                              >
                                +Add ₹
                              </button>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Contact: <span className="font-semibold text-foreground">{b.yourName}</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {b.description || 'No business description provided.'}
                        </p>

                        <div className="pt-1">
                          {b.internalNotes ? (
                            <div 
                              onClick={() => setEditingNotes({ id: b.id, type: 'brief', text: b.internalNotes || '' })}
                              className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-start justify-between cursor-pointer hover:bg-emerald-500/15"
                            >
                              <span className="line-clamp-2"><strong>Note:</strong> {b.internalNotes}</span>
                              <Edit3 className="w-3 h-3 flex-shrink-0 ml-1 mt-0.5" />
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingNotes({ id: b.id, type: 'brief', text: '' })}
                              className="text-[11px] font-semibold text-muted-foreground hover:text-primary flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add Private Note
                            </button>
                          )}
                        </div>
                      </div>

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

                          <button
                            onClick={() => setWhatsAppModal({ phone: b.phone, name: b.yourName, business: b.businessName })}
                            className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors"
                            title="WhatsApp Quick Templates"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
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

      {/* MODAL: WHATSAPP QUICK-REPLY TEMPLATES */}
      {whatsAppModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setWhatsAppModal(null)}
        >
          <div 
            className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl glass-panel space-y-5 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-serif text-xl font-bold">
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp Message Composer</span>
              </div>
              <button 
                onClick={() => setWhatsAppModal(null)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select a Quick-Reply Message Template:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    title: '📞 Discovery Call Request',
                    text: `Hi ${whatsAppModal.name}, thank you for reaching out to Bharathkumar E at ApexAssure Studio! When is a good time for a quick 10-minute discovery call to discuss your requirements for ${whatsAppModal.business}?`
                  },
                  {
                    title: '📄 Proposal & Requirements Document Ready',
                    text: `Hi ${whatsAppModal.name}, I have reviewed your project requirements for ${whatsAppModal.business} and prepared your Functional Requirements Document (FRD) and proposal. Let me know when you would like me to share the breakdown!`
                  },
                  {
                    title: '🚀 Scope Kickoff & Timeline',
                    text: `Hi ${whatsAppModal.name}, I am ready to begin architecture planning for ${whatsAppModal.business}. Let's finalize your key milestone deadlines and deployment setup.`
                  },
                  {
                    title: '💬 Follow-Up Check-in',
                    text: `Hi ${whatsAppModal.name}, just following up on your project inquiry for ${whatsAppModal.business}. Please feel free to let me know if you have any questions or updates!`
                  }
                ].map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => setCustomMsg(tpl.text)}
                    className="p-3 rounded-xl bg-secondary/70 hover:bg-secondary border border-border text-left text-xs font-medium text-foreground transition-all hover:border-primary/50"
                  >
                    <div className="font-bold text-primary mb-1">{tpl.title}</div>
                    <div className="text-muted-foreground text-[11px] line-clamp-2">{tpl.text}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Custom Message Preview:
              </label>
              <textarea
                rows={3}
                value={customMsg || `Hi ${whatsAppModal.name}, thank you for contacting ApexAssure regarding ${whatsAppModal.business}!`}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                To: <strong className="text-foreground">{whatsAppModal.phone}</strong>
              </div>

              <a
                href={`https://wa.me/${whatsAppModal.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(customMsg || `Hi ${whatsAppModal.name}, thank you for contacting ApexAssure regarding ${whatsAppModal.business}!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setWhatsAppModal(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/25 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DEAL ESTIMATED BUDGET VALUE */}
      {editingDealValue && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setEditingDealValue(null)}
        >
          <div 
            className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl glass-panel space-y-4 animate-in zoom-in-95 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
              <DollarSign className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-foreground">Estimated Deal Value (₹)</h3>
              <p className="text-xs text-muted-foreground">
                Enter the estimated project budget or closed revenue for pipeline analytics.
              </p>
            </div>

            <div className="relative max-w-xs mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-bold text-base">₹</span>
              <input
                type="number"
                autoFocus
                placeholder="25000"
                value={editingDealValue.value || ''}
                onChange={(e) => setEditingDealValue({ ...editingDealValue, value: Number(e.target.value) })}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-background border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-center font-mono font-bold text-lg text-foreground"
              />
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setEditingDealValue(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground bg-secondary hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDealValue}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Value</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT INTERNAL PRIVATE NOTES */}
      {editingNotes && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setEditingNotes(null)}
        >
          <div 
            className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl glass-panel space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/80">
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
                <Edit3 className="w-5 h-5 text-primary" />
                <span>Private Follow-Up Notes</span>
              </div>
              <button 
                onClick={() => setEditingNotes(null)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              These notes are private to you as the administrator and will be saved in your database and included in your export records.
            </p>

            <textarea
              rows={4}
              autoFocus
              placeholder="e.g. Discussed scope on WhatsApp. Client requested custom PWA with offline caching. Follow-up scheduled for Friday..."
              value={editingNotes.text}
              onChange={(e) => setEditingNotes({ ...editingNotes, text: e.target.value })}
              className="w-full p-3 rounded-2xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs text-foreground resize-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingNotes(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteTarget && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setDeleteTarget(null)}
        >
          <div 
            className="w-full max-w-sm bg-card border border-destructive/40 rounded-3xl p-6 shadow-2xl glass-panel space-y-4 text-center animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-foreground">Confirm Deletion</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to permanently delete <strong className="text-foreground">{deleteTarget.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-foreground bg-secondary hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-destructive hover:bg-red-600 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETAILED PROJECT BRIEF */}
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

              {selectedBrief.internalNotes && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                  <div className="font-bold text-emerald-700 dark:text-emerald-300 text-xs uppercase tracking-wider">
                    5. Private Admin Notes
                  </div>
                  <p className="text-foreground">{selectedBrief.internalNotes}</p>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-border/80 flex items-center justify-between">
              <button
                onClick={() => {
                  setWhatsAppModal({
                    phone: selectedBrief.phone,
                    name: selectedBrief.yourName,
                    business: selectedBrief.businessName,
                  });
                  setSelectedBrief(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </button>

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
