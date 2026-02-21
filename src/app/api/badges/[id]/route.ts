import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    const sql = getDb();
    await sql`
      UPDATE badges SET label=${body.label}, color=${body.color}, text_color=${body.textColor}, icon=${body.icon}, active=${body.active !== false}
      WHERE id = ${id}
    `;
    return NextResponse.json({ message: 'Updated' });
  } catch (error) {
    console.error('PUT badge error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const sql = getDb();
    await sql`UPDATE products SET badge = NULL WHERE badge = ${id}`;
    await sql`DELETE FROM badges WHERE id = ${id}`;
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('DELETE badge error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
