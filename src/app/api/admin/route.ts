import { NextRequest, NextResponse } from 'next/server';
import { getLeadsAsync, getBriefsAsync, updateLeadStatusAsync, updateBriefStatusAsync } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const leads = await getLeadsAsync();
    const briefs = await getBriefsAsync();

    const stats = {
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === 'new').length,
      contactedLeads: leads.filter(l => l.status === 'contacted').length,
      totalBriefs: briefs.length,
      newBriefs: briefs.filter(b => b.status === 'new').length,
    };

    return NextResponse.json({ success: true, stats, leads, briefs }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, status, notes } = body;

    if (action === 'update_lead_status') {
      const ok = await updateLeadStatusAsync(id, status, notes);
      return NextResponse.json({ success: ok });
    }

    if (action === 'update_brief_status') {
      const ok = await updateBriefStatusAsync(id, status);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
