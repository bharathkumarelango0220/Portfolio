import fs from 'fs';
import path from 'path';
import { Lead, ProjectBrief, AnalyticsEvent } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const BRIEFS_FILE = path.join(DATA_DIR, 'briefs.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([
      {
        id: 'lead-demo-1',
        name: 'Alex Vance',
        email: 'alex.vance@techcorp.io',
        phone: '+91 9876543210',
        source: 'Website Contact Form',
        status: 'contacted',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        notes: 'Interested in full agency redesign + custom web app'
      }
    ], null, 2));
  }
  if (!fs.existsSync(BRIEFS_FILE)) {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify([
      {
        id: 'brief-demo-1',
        businessName: 'VentureScale Analytics',
        yourName: 'Samantha Green',
        email: 'samantha@venturescale.co',
        phone: '+91 9845123456',
        description: 'Next-gen analytics platform for enterprise B2B SaaS teams.',
        goals: ['Build a brand', 'Promote business', 'Sell products'],
        audienceGender: 'All',
        audienceAge: '24-50',
        designLook: 'Modern & minimalist',
        primaryColor: '#2563eb (Royal Blue)',
        secondaryColor: '#0f172a (Slate Dark)',
        colorTheme: 'Dark theme',
        keyFeatures: ['Multi interlinked pages', 'Customer response form'],
        hasContent: 'Yes',
        hasDomain: 'Yes',
        status: 'reviewed',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ], null, 2));
  }
  if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify([], null, 2));
  }
}

// Leads CRUD
export function getLeads(): Lead[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
  ensureDataDir();
  const leads = getLeads();
  const newLead: Lead = {
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...leadData,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  leads.unshift(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  return newLead;
}

export function updateLeadStatus(id: string, status: Lead['status'], notes?: string): boolean {
  ensureDataDir();
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return false;
  leads[index].status = status;
  if (notes !== undefined) {
    leads[index].notes = notes;
  }
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  return true;
}

// Briefs CRUD
export function getBriefs(): ProjectBrief[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(BRIEFS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveBrief(briefData: Omit<ProjectBrief, 'id' | 'createdAt' | 'status'>): ProjectBrief {
  ensureDataDir();
  const briefs = getBriefs();
  const newBrief: ProjectBrief = {
    id: 'brief-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...briefData,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  briefs.unshift(newBrief);
  fs.writeFileSync(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
  return newBrief;
}

export function updateBriefStatus(id: string, status: ProjectBrief['status']): boolean {
  ensureDataDir();
  const briefs = getBriefs();
  const index = briefs.findIndex(b => b.id === id);
  if (index === -1) return false;
  briefs[index].status = status;
  fs.writeFileSync(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
  return true;
}

// Analytics logging
export function logAnalytics(event: string, pathName: string, metadata?: Record<string, unknown>) {
  ensureDataDir();
  try {
    const events: AnalyticsEvent[] = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8') || '[]');
    events.unshift({
      id: 'event-' + Date.now(),
      event,
      path: pathName,
      timestamp: new Date().toISOString(),
      metadata,
    });
    // keep latest 500 events
    if (events.length > 500) events.length = 500;
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(events, null, 2));
  } catch {
    // silently catch logging errors
  }
}
