import { NextRequest, NextResponse } from 'next/server';
import { getProjectsAsync, saveProjectAsync, deleteProjectAsync, toggleProjectFeatureAsync } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const projects = await getProjectsAsync();
    return NextResponse.json({ success: true, projects }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch showcase projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, title, url, category, description, impact, tags, featured } = body;

    if (action === 'delete') {
      const ok = await deleteProjectAsync(id);
      return NextResponse.json({ success: ok });
    }

    if (action === 'toggle_featured') {
      const ok = await toggleProjectFeatureAsync(id);
      return NextResponse.json({ success: ok });
    }

    if (!title || !url) {
      return NextResponse.json({ success: false, error: 'Title and URL are required' }, { status: 400 });
    }

    const newProject = await saveProjectAsync({
      title,
      url,
      category: category || 'Web App',
      description: description || 'High-performance web architecture crafted with modern engineering.',
      impact: impact || '100/100 Core Web Vitals, Live Production',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : ['Next.js', 'TypeScript', 'TailwindCSS']),
      featured: Boolean(featured),
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
