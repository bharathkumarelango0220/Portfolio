import { NextRequest, NextResponse } from 'next/server';
import { getLeadsAsync, saveLeadAsync, logAnalytics } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const leads = await getLeadsAsync();
    return NextResponse.json({ success: true, leads }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, source, notes } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    const newLead = await saveLeadAsync({
      name,
      email,
      phone,
      source: source || 'Website Quick Contact',
      notes: notes || '',
    });

    logAnalytics('lead_submitted', '/#contact', { leadId: newLead.id });

    return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
