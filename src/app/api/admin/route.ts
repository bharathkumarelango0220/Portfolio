import { NextRequest, NextResponse } from 'next/server';
import { 
  getLeadsAsync, 
  getBriefsAsync, 
  getProjectsAsync,
  updateLeadStatusAsync, 
  updateBriefStatusAsync,
  updateLeadNotesAsync,
  updateBriefNotesAsync,
  toggleStarLeadAsync,
  toggleStarBriefAsync,
  updateLeadDealValueAsync,
  updateBriefDealValueAsync,
  deleteLeadAsync,
  deleteBriefAsync,
  saveProjectAsync,
  deleteProjectAsync,
  toggleProjectFeatureAsync
} from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const leads = await getLeadsAsync();
    const briefs = await getBriefsAsync();
    const projects = await getProjectsAsync();

    // Calculate pipeline value
    const totalPipelineValue = [
      ...leads.map(l => l.estimatedValue || 0),
      ...briefs.map(b => b.estimatedValue || 0)
    ].reduce((sum, val) => sum + val, 0);

    const stats = {
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === 'new').length,
      contactedLeads: leads.filter(l => l.status === 'contacted').length,
      convertedLeads: leads.filter(l => l.status === 'converted').length,
      totalBriefs: briefs.length,
      newBriefs: briefs.filter(b => b.status === 'new').length,
      totalProjects: projects.length,
      totalPipelineValue,
      starredCount: leads.filter(l => l.starred).length + briefs.filter(b => b.starred).length,
      archivedCount: leads.filter(l => l.status === 'archived').length + briefs.filter(b => b.status === 'archived').length,
    };

    return NextResponse.json({ success: true, stats, leads, briefs, projects }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch admin data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, status, notes, internalNotes, estimatedValue, projectData } = body;

    if (action === 'update_lead_status') {
      const ok = await updateLeadStatusAsync(id, status, internalNotes);
      return NextResponse.json({ success: ok });
    }

    if (action === 'update_brief_status') {
      const ok = await updateBriefStatusAsync(id, status, internalNotes);
      return NextResponse.json({ success: ok });
    }

    if (action === 'update_lead_notes') {
      const ok = await updateLeadNotesAsync(id, notes || internalNotes || '');
      return NextResponse.json({ success: ok });
    }

    if (action === 'update_brief_notes') {
      const ok = await updateBriefNotesAsync(id, notes || internalNotes || '');
      return NextResponse.json({ success: ok });
    }

    if (action === 'toggle_star_lead') {
      const ok = await toggleStarLeadAsync(id);
      return NextResponse.json({ success: ok });
    }

    if (action === 'toggle_star_brief') {
      const ok = await toggleStarBriefAsync(id);
      return NextResponse.json({ success: ok });
    }

    if (action === 'update_lead_deal_value') {
      const ok = await updateLeadDealValueAsync(id, Number(estimatedValue) || 0);
      return NextResponse.json({ success: ok });
    }

    if (action === 'update_brief_deal_value') {
      const ok = await updateBriefDealValueAsync(id, Number(estimatedValue) || 0);
      return NextResponse.json({ success: ok });
    }

    if (action === 'delete_lead') {
      const ok = await deleteLeadAsync(id);
      return NextResponse.json({ success: ok });
    }

    if (action === 'delete_brief') {
      const ok = await deleteBriefAsync(id);
      return NextResponse.json({ success: ok });
    }

    if (action === 'save_project') {
      const newProj = await saveProjectAsync(projectData);
      return NextResponse.json({ success: true, project: newProj });
    }

    if (action === 'delete_project') {
      const ok = await deleteProjectAsync(id);
      return NextResponse.json({ success: ok });
    }

    if (action === 'toggle_feature_project') {
      const ok = await toggleProjectFeatureAsync(id);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
