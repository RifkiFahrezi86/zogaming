import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const sql = getDb();
    const badges = await sql`SELECT id, label, color, text_color, icon, active FROM badges ORDER BY label`;
    const mapped = badges.map(b => ({
      id: b.id,
      label: b.label,
      color: b.color,
      textColor: b.text_color,
      icon: b.icon,
      active: b.active,
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('GET badges error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const sql = getDb();
    const id = body.id || body.label.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    await sql`
      INSERT INTO badges (id, label, color, text_color, icon, active)
      VALUES (${id}, ${body.label}, ${body.color || '#000'}, ${body.textColor || '#fff'}, ${body.icon || 'none'}, ${body.active !== false})
    `;
    return NextResponse.json({ id, message: 'Badge created' });
  } catch (error) {
    console.error('POST badges error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
