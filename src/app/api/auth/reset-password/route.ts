import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Admin reset password for any user
export async function PUT(request: Request) {
  try {
    const admin = await getAuthUser();
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, newPassword } = await request.json();

    if (!userId || !newPassword) {
      return NextResponse.json({ error: 'User ID dan password baru wajib diisi' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 });
    }

    const sql = getDb();

    // Check user exists
    const users = await sql`SELECT id, name, email FROM users WHERE id = ${userId}`;
    if (users.length === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Hash and update
    const newHash = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password_hash = ${newHash} WHERE id = ${userId}`;

    return NextResponse.json({ 
      message: `Password untuk ${users[0].name} berhasil direset` 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
