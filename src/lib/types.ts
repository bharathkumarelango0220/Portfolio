export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source?: string;
  status: 'new' | 'contacted' | 'in_review' | 'converted' | 'archived';
  createdAt: string;
  notes?: string;
  internalNotes?: string;
  starred?: boolean;
  estimatedValue?: number;
}

export interface ProjectBrief {
  id: string;
  businessName: string;
  yourName: string;
  email: string;
  phone: string;
  description: string;
  goals: string[];
  audienceGender: string;
  audienceAge: string;
  designLook: string;
  primaryColor: string;
  secondaryColor: string;
  colorTheme: string;
  keyFeatures: string[];
  hasContent: string;
  hasDomain: string;
  status: 'new' | 'reviewed' | 'in_progress' | 'completed' | 'archived';
  createdAt: string;
  internalNotes?: string;
  starred?: boolean;
  estimatedValue?: number;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  url: string;
  category: 'Web App' | 'E-Commerce' | 'SaaS' | 'Landing Page' | 'Mobile PWA' | string;
  description: string;
  impact: string;
  tags: string[];
  featured?: boolean;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  event: string;
  path: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
