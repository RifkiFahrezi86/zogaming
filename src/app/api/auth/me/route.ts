import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ user: null });
    }

    const sql = getDb();
    const users = await sql`SELECT id, name, email, phone, role, created_at FROM users WHERE id = ${authUser.userId}`;
    
    if (users.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: users[0] });
  } catch {
    return NextResponse.json({ user: null });
  }
}
