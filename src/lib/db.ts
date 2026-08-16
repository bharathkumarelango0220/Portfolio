import fs from 'fs';
import path from 'path';
import { Lead, ProjectBrief, ShowcaseProject, AnalyticsEvent } from './types';

const isVercel = Boolean(process.env.VERCEL || (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production' && !process.env.LOCAL_DEV));
const DATA_DIR = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const SEED_DIR = path.join(process.cwd(), 'data');

const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const BRIEFS_FILE = path.join(DATA_DIR, 'briefs.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// In-memory fallback cache
let memoryLeads: Lead[] = [];
let memoryBriefs: ProjectBrief[] = [];
let memoryProjects: ShowcaseProject[] = [
  {
    id: 'proj-trip-tools',
    title: 'Trip Tools — Travel Companion & Trip Expense Tracker',
    url: 'https://triptools.vercel.app/',
    category: 'Web App',
    description: 'Fullstack travel companion with offline PWA caching, real-time group expense splitting, and curated destination guides.',
    impact: '100/100 Core Web Vitals, Live Production',
    tags: ['Next.js 15', 'TypeScript', 'TailwindCSS', 'PWA', 'Offline Sync'],
    featured: true,
    createdAt: '2026-08-16T12:00:00.000Z',
  }
];

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
    if (!fs.existsSync(PROJECTS_FILE)) {
      let initialProjects: ShowcaseProject[] = memoryProjects;
      const seedProjFile = path.join(SEED_DIR, 'projects.json');
      if (fs.existsSync(seedProjFile)) {
        try {
          initialProjects = JSON.parse(fs.readFileSync(seedProjFile, 'utf-8'));
        } catch {
          initialProjects = memoryProjects;
        }
      }
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2));
      memoryProjects = initialProjects;
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
  return getLeads().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveLeadAsync(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
  ensureDataDir();
  const currentLeads = await getLeadsAsync();
  const newLead: Lead = {
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...leadData,
    status: 'new',
    starred: false,
    createdAt: new Date().toISOString(),
  };
  currentLeads.unshift(newLead);
  memoryLeads = currentLeads;

  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(currentLeads, null, 2));
  } catch {
    // ignore
  }

  return newLead;
}

export function saveLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
  const newLead: Lead = {
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...leadData,
    status: 'new',
    starred: false,
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
  return true;
}

export async function toggleStarLeadAsync(id: string): Promise<boolean> {
  const leads = await getLeadsAsync();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return false;
  leads[index].starred = !leads[index].starred;
  memoryLeads = leads;
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch {
    // ignore
  }
  return true;
}

export async function updateLeadDealValueAsync(id: string, estimatedValue: number): Promise<boolean> {
  const leads = await getLeadsAsync();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return false;
  leads[index].estimatedValue = estimatedValue;
  memoryLeads = leads;
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch {
    // ignore
  }
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
  return getBriefs().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveBriefAsync(briefData: Omit<ProjectBrief, 'id' | 'createdAt' | 'status'>): Promise<ProjectBrief> {
  ensureDataDir();
  const currentBriefs = await getBriefsAsync();
  const newBrief: ProjectBrief = {
    id: 'brief-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...briefData,
    status: 'new',
    starred: false,
    createdAt: new Date().toISOString(),
  };
  currentBriefs.unshift(newBrief);
  memoryBriefs = currentBriefs;

  try {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify(currentBriefs, null, 2));
  } catch {
    // ignore
  }

  return newBrief;
}

export function saveBrief(briefData: Omit<ProjectBrief, 'id' | 'createdAt' | 'status'>): ProjectBrief {
  const newBrief: ProjectBrief = {
    id: 'brief-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ...briefData,
    status: 'new',
    starred: false,
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
  return true;
}

export async function toggleStarBriefAsync(id: string): Promise<boolean> {
  const briefs = await getBriefsAsync();
  const index = briefs.findIndex(b => b.id === id);
  if (index === -1) return false;
  briefs[index].starred = !briefs[index].starred;
  memoryBriefs = briefs;
  try {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
  } catch {
    // ignore
  }
  return true;
}

export async function updateBriefDealValueAsync(id: string, estimatedValue: number): Promise<boolean> {
  const briefs = await getBriefsAsync();
  const index = briefs.findIndex(b => b.id === id);
  if (index === -1) return false;
  briefs[index].estimatedValue = estimatedValue;
  memoryBriefs = briefs;
  try {
    fs.writeFileSync(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
  } catch {
    // ignore
  }
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
  return true;
}

// ----------------------------------------------------
// DYNAMIC PORTFOLIO SHOWCASE PROJECTS CRUD
// ----------------------------------------------------
export function getProjects(): ShowcaseProject[] {
  ensureDataDir();
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryProjects = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return memoryProjects;
}

export async function getProjectsAsync(): Promise<ShowcaseProject[]> {
  ensureDataDir();
  return getProjects().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveProjectAsync(projectData: Omit<ShowcaseProject, 'id' | 'createdAt'>): Promise<ShowcaseProject> {
  ensureDataDir();
  const currentProjects = await getProjectsAsync();
  
  // Format URL nicely
  let url = projectData.url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const newProject: ShowcaseProject = {
    id: 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    ...projectData,
    url,
    createdAt: new Date().toISOString(),
  };

  currentProjects.unshift(newProject);
  memoryProjects = currentProjects;

  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(currentProjects, null, 2));
  } catch {
    // ignore
  }

  return newProject;
}

export async function deleteProjectAsync(id: string): Promise<boolean> {
  let projects = await getProjectsAsync();
  projects = projects.filter(p => p.id !== id);
  memoryProjects = projects;
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  } catch {
    // ignore
  }
  return true;
}

export async function toggleProjectFeatureAsync(id: string): Promise<boolean> {
  const projects = await getProjectsAsync();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return false;
  projects[index].featured = !projects[index].featured;
  memoryProjects = projects;
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  } catch {
    // ignore
  }
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
