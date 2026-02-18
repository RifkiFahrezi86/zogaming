import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Check if email exists
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // Create customer
    const hashedPassword = await hashPassword(password);
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
      },
    });

    // Create JWT token
    const token = createToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      role: 'customer',
    });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Register error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    // Check common DB issues
    if (message.includes('relation') && message.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Database belum di-setup. Jalankan SQL setup di Neon SQL Editor.' },
        { status: 500 }
      );
    }
    if (message.includes('connect') || message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Tidak bisa terhubung ke database. Periksa DATABASE_URL.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Terjadi kesalahan server: ' + message },
      { status: 500 }
    );
  }
}
