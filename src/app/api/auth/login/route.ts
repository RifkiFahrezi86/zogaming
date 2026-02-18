import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken, ADMIN_EMAIL, ADMIN_PASSWORD } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Check admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = createToken({
        id: 'admin',
        email: ADMIN_EMAIL,
        name: 'Admin',
        role: 'admin',
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: 'admin',
          name: 'Admin',
          email: ADMIN_EMAIL,
          role: 'admin',
        },
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    }

    // Customer login
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, customer.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const token = createToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      role: 'customer',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: 'customer',
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('relation') && message.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Database belum di-setup. Jalankan SQL setup di Neon SQL Editor.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Terjadi kesalahan server: ' + message },
      { status: 500 }
    );
  }
}
