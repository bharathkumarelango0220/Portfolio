import { NextRequest, NextResponse } from 'next/server';
import { getBriefsAsync, saveBriefAsync, logAnalytics } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const briefs = await getBriefsAsync();
    return NextResponse.json({ success: true, briefs }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch project briefs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      yourName,
      email,
      phone,
      description,
      goals,
      audienceGender,
      audienceAge,
      designLook,
      primaryColor,
      secondaryColor,
      colorTheme,
      keyFeatures,
      hasContent,
      hasDomain,
    } = body;

    if (!businessName || !yourName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required brief contact fields' },
        { status: 400 }
      );
    }

    const newBrief = await saveBriefAsync({
      businessName,
      yourName,
      email,
      phone,
      description: description || '',
      goals: Array.isArray(goals) ? goals : [],
      audienceGender: audienceGender || 'All',
      audienceAge: audienceAge || '18-45',
      designLook: designLook || 'Modern & minimalist',
      primaryColor: primaryColor || '',
      secondaryColor: secondaryColor || '',
      colorTheme: colorTheme || 'Adaptive',
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : [],
      hasContent: hasContent || 'Yes',
      hasDomain: hasDomain || 'Yes',
    });

    logAnalytics('brief_submitted', '/#brief-wizard', { briefId: newBrief.id });

    return NextResponse.json({ success: true, brief: newBrief }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
