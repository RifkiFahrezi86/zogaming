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

    if (body.name !== undefined && body.whatsapp !== undefined) {
      await sql`
        UPDATE admins SET name = ${body.name}, whatsapp = ${body.whatsapp}
        WHERE id = ${parseInt(id)}
      `;
    }

    if (body.active !== undefined) {
      await sql`
        UPDATE admins SET active = ${body.active}
        WHERE id = ${parseInt(id)}
      `;
    }

    return NextResponse.json({ message: 'Admin berhasil diupdate' });
  } catch (error) {
    console.error('PUT admin error:', error);
    return NextResponse.json({ error: 'Gagal update admin' }, { status: 500 });
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

    // Set assigned_admin_id to null for orders assigned to this admin
    try {
      await sql`UPDATE orders SET assigned_admin_id = NULL WHERE assigned_admin_id = ${parseInt(id)}`;
    } catch {
      // Column may not exist yet
    }

    await sql`DELETE FROM admins WHERE id = ${parseInt(id)}`;

    return NextResponse.json({ message: 'Admin berhasil dihapus' });
  } catch (error) {
    console.error('DELETE admin error:', error);
    return NextResponse.json({ error: 'Gagal hapus admin' }, { status: 500 });
  }
}
