import { NextRequest, NextResponse } from 'next/server';
import { logAnalytics } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, path, metadata } = body;
    if (event && path) {
      logAnalytics(event, path, metadata);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
