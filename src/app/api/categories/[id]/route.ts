import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const sql = getDb();

    await sql`
      UPDATE categories SET name = ${body.name}, slug = ${body.slug}, image = ${body.image || ''}, description = ${body.description || ''}
      WHERE id = ${id}
    `;
    return NextResponse.json({ message: 'Updated' });
  } catch (error) {
    console.error('PUT category error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const sql = getDb();
    await sql`DELETE FROM categories WHERE id = ${id}`;
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('DELETE category error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
