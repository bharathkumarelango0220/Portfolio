export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source?: string;
  status: 'new' | 'contacted' | 'in_review' | 'converted';
  createdAt: string;
  notes?: string;
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
  status: 'new' | 'reviewed' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  event: string;
  path: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
