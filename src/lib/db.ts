import fs from 'fs';
import path from 'path';
import { Lead, ProjectBrief, AnalyticsEvent } from './types';

const isVercel = Boolean(process.env.VERCEL || process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production' && !process.env.LOCAL_DEV);
const DATA_DIR = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const SEED_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const BRIEFS_FILE = path.join(DATA_DIR, 'briefs.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// In-memory fallback cache for serverless environments
let memoryLeads: Lead[] = [];
let memoryBriefs: ProjectBrief[] = [];

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // fallback to memory
  }

  try {
    if (!fs.existsSync(LEADS_FILE)) {
      let initialData: Lead[] = [];
      const seedFile = path.join(SEED_DIR, 'leads.json');
      if (fs.existsSync(seedFile)) {
        try {
          initialData = JSON.parse(fs.readFileSync(seedFile, 'utf-8'));
        } catch {
          initialData = [];
        }
      }
      fs.writeFileSync(LEADS_FILE, JSON.stringify(initialData, null, 2));
      memoryLeads = initialData;
    }
  } catch {
    // ignore
  }

  try {
    if (!fs.existsSync(BRIEFS_FILE)) {
      let initialBriefs: ProjectBrief[] = [];
      const seedBriefsFile = path.join(SEED_DIR, 'briefs.json');
      if (fs.existsSync(seedBriefsFile)) {
        try {
          initialBriefs = JSON.parse(fs.readFileSync(seedBriefsFile, 'utf-8'));
        } catch {
          initialBriefs = [];
        }
      }
      fs.writeFileSync(BRIEFS_FILE, JSON.stringify(initialBriefs, null, 2));
      memoryBriefs = initialBriefs;
    }
  } catch {
    // ignore
  }

  try {
    if (!fs.existsSync(ANALYTICS_FILE)) {
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify([], null, 2));
    }
  } catch {
    // ignore
  }
}

// Leads CRUD
export function getLeads(): Lead[] {
  ensureDataDir();
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryLeads = parsed;
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return memoryLeads;
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
  memoryLeads = leads;
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch {
    // non-blocking fallback
  }
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
  memoryLeads = leads;
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch {
    // non-blocking
  }
  return true;
}

// Briefs CRUD
export function getBriefs(): ProjectBrief[] {
  ensureDataDir();
  try {
    if (fs.existsSync(BRIEFS_FILE)) {
      const data = fs.readFileSync(BRIEFS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryBriefs = parsed;
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return memoryBriefs;
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
  memoryBriefs = briefs;
  try {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
  } catch {
    // non-blocking
  }
  return newBrief;
}

export function updateBriefStatus(id: string, status: ProjectBrief['status']): boolean {
  ensureDataDir();
  const briefs = getBriefs();
  const index = briefs.findIndex(b => b.id === id);
  if (index === -1) return false;
  briefs[index].status = status;
  memoryBriefs = briefs;
  try {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
  } catch {
    // non-blocking
  }
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
    if (events.length > 500) events.length = 500;
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(events, null, 2));
  } catch {
    // non-blocking
  }
}
