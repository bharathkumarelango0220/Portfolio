import fs from 'fs';
import path from 'path';
import { Lead, ProjectBrief, AnalyticsEvent } from './types';

const isVercel = Boolean(process.env.VERCEL || (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production' && !process.env.LOCAL_DEV));
const DATA_DIR = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const SEED_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const BRIEFS_FILE = path.join(DATA_DIR, 'briefs.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Cloud Persistent Database Store IDs
const CLOUD_API_BASE = 'https://api.restful-api.dev/objects';
const LEADS_STORE_ID = 'ff8081819ff5b11001a00996cd762a00';
const BRIEFS_STORE_ID = 'ff8081819ff5b11001a00996ea452a01';

// In-memory fallback cache
let memoryLeads: Lead[] = [];
let memoryBriefs: ProjectBrief[] = [];

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // fallback
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

// ----------------------------------------------------
// CLOUD PERSISTENCE HELPERS
// ----------------------------------------------------
async function fetchCloudLeads(): Promise<Lead[]> {
  try {
    const res = await fetch(`${CLOUD_API_BASE}/${LEADS_STORE_ID}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.items && Array.isArray(json.data.items)) {
        return json.data.items as Lead[];
      }
    }
  } catch {
    // ignore
  }
  return [];
}

async function syncCloudLeads(leads: Lead[]): Promise<void> {
  try {
    await fetch(`${CLOUD_API_BASE}/${LEADS_STORE_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'ApexAssure_Master_Leads_Store_0220',
        data: { items: leads.slice(0, 200) },
      }),
    });
  } catch {
    // non-blocking
  }
}

async function fetchCloudBriefs(): Promise<ProjectBrief[]> {
  try {
    const res = await fetch(`${CLOUD_API_BASE}/${BRIEFS_STORE_ID}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.items && Array.isArray(json.data.items)) {
        return json.data.items as ProjectBrief[];
      }
    }
  } catch {
    // ignore
  }
  return [];
}

async function syncCloudBriefs(briefs: ProjectBrief[]): Promise<void> {
  try {
    await fetch(`${CLOUD_API_BASE}/${BRIEFS_STORE_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'ApexAssure_Master_Briefs_Store_0220',
        data: { items: briefs.slice(0, 200) },
      }),
    });
  } catch {
    // non-blocking
  }
}

// ----------------------------------------------------
// LEADS CRUD
// ----------------------------------------------------
export function getLeads(): Lead[] {
  ensureDataDir();
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryLeads = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return memoryLeads;
}

export async function getLeadsAsync(): Promise<Lead[]> {
  ensureDataDir();
  const localList = getLeads();
  const cloudList = await fetchCloudLeads();

  const mergedMap = new Map<string, Lead>();
  cloudList.forEach(l => mergedMap.set(l.id, l));
  localList.forEach(l => mergedMap.set(l.id, l));

  const result = Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  memoryLeads = result;
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(result, null, 2));
  } catch {
    // ignore
  }
  return result;
}

export async function saveLeadAsync(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
  ensureDataDir();
  const currentLeads = await getLeadsAsync();
  const newLead: Lead = {
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...leadData,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  currentLeads.unshift(newLead);
  memoryLeads = currentLeads;

  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(currentLeads, null, 2));
  } catch {
    // ignore
  }

  await syncCloudLeads(currentLeads);
  return newLead;
}

export function saveLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
  const newLead: Lead = {
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...leadData,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  saveLeadAsync(leadData).catch(() => {});
  return newLead;
}

export async function updateLeadStatusAsync(id: string, status: Lead['status'], internalNotes?: string): Promise<boolean> {
  const leads = await getLeadsAsync();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return false;
  leads[index].status = status;
  if (internalNotes !== undefined) {
    leads[index].internalNotes = internalNotes;
  }
  memoryLeads = leads;
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch {
    // ignore
  }
  await syncCloudLeads(leads);
  return true;
}

export async function updateLeadNotesAsync(id: string, internalNotes: string): Promise<boolean> {
  const leads = await getLeadsAsync();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return false;
  leads[index].internalNotes = internalNotes;
  memoryLeads = leads;
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch {
    // ignore
  }
  await syncCloudLeads(leads);
  return true;
}

export async function deleteLeadAsync(id: string): Promise<boolean> {
  let leads = await getLeadsAsync();
  leads = leads.filter(l => l.id !== id);
  memoryLeads = leads;
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch {
    // ignore
  }
  await syncCloudLeads(leads);
  return true;
}

export function updateLeadStatus(id: string, status: Lead['status'], internalNotes?: string): boolean {
  updateLeadStatusAsync(id, status, internalNotes).catch(() => {});
  return true;
}

// ----------------------------------------------------
// BRIEFS CRUD
// ----------------------------------------------------
export function getBriefs(): ProjectBrief[] {
  ensureDataDir();
  try {
    if (fs.existsSync(BRIEFS_FILE)) {
      const data = fs.readFileSync(BRIEFS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memoryBriefs = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return memoryBriefs;
}

export async function getBriefsAsync(): Promise<ProjectBrief[]> {
  ensureDataDir();
  const localList = getBriefs();
  const cloudList = await fetchCloudBriefs();

  const mergedMap = new Map<string, ProjectBrief>();
  cloudList.forEach(b => mergedMap.set(b.id, b));
  localList.forEach(b => mergedMap.set(b.id, b));

  const result = Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  memoryBriefs = result;
  try {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify(result, null, 2));
  } catch {
    // ignore
  }
  return result;
}

export async function saveBriefAsync(briefData: Omit<ProjectBrief, 'id' | 'createdAt' | 'status'>): Promise<ProjectBrief> {
  ensureDataDir();
  const currentBriefs = await getBriefsAsync();
  const newBrief: ProjectBrief = {
    id: 'brief-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...briefData,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  currentBriefs.unshift(newBrief);
  memoryBriefs = currentBriefs;

  try {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify(currentBriefs, null, 2));
  } catch {
    // ignore
  }

  await syncCloudBriefs(currentBriefs);
  return newBrief;
}

export function saveBrief(briefData: Omit<ProjectBrief, 'id' | 'createdAt' | 'status'>): ProjectBrief {
  const newBrief: ProjectBrief = {
    id: 'brief-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...briefData,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  saveBriefAsync(briefData).catch(() => {});
  return newBrief;
}

export async function updateBriefStatusAsync(id: string, status: ProjectBrief['status'], internalNotes?: string): Promise<boolean> {
  const briefs = await getBriefsAsync();
  const index = briefs.findIndex(b => b.id === id);
  if (index === -1) return false;
  briefs[index].status = status;
  if (internalNotes !== undefined) {
    briefs[index].internalNotes = internalNotes;
  }
  memoryBriefs = briefs;
  try {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
  } catch {
    // ignore
  }
  await syncCloudBriefs(briefs);
  return true;
}

export async function updateBriefNotesAsync(id: string, internalNotes: string): Promise<boolean> {
  const briefs = await getBriefsAsync();
  const index = briefs.findIndex(b => b.id === id);
  if (index === -1) return false;
  briefs[index].internalNotes = internalNotes;
  memoryBriefs = briefs;
  try {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
  } catch {
    // ignore
  }
  await syncCloudBriefs(briefs);
  return true;
}

export async function deleteBriefAsync(id: string): Promise<boolean> {
  let briefs = await getBriefsAsync();
  briefs = briefs.filter(b => b.id !== id);
  memoryBriefs = briefs;
  try {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
  } catch {
    // ignore
  }
  await syncCloudBriefs(briefs);
  return true;
}

export function updateBriefStatus(id: string, status: ProjectBrief['status'], internalNotes?: string): boolean {
  updateBriefStatusAsync(id, status, internalNotes).catch(() => {});
  return true;
}

// ----------------------------------------------------
// ANALYTICS
// ----------------------------------------------------
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
    // ignore
  }
}
