import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, password } = body;

    // Support both phone and email login
    const loginId = phone || email;
    if (!loginId || !password) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Format phone if provided
    let formattedPhone = '';
    if (phone) {
      formattedPhone = phone.replace(/[^0-9]/g, '');
      if (formattedPhone.startsWith('0')) formattedPhone = '62' + formattedPhone.slice(1);
      else if (!formattedPhone.startsWith('62')) formattedPhone = '62' + formattedPhone;
    }

    // Check admin login (by email or phone)
    const isAdminEmail = email && email === ADMIN_EMAIL;
    const isAdminPhone = formattedPhone && formattedPhone === ADMIN_PHONE;
    if ((isAdminEmail || isAdminPhone) && password === ADMIN_PASSWORD) {
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
          phone: ADMIN_PHONE,
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

    // Customer login - search by phone or email
    let customer = null;
    if (formattedPhone) {
      customer = await prisma.customer.findFirst({ where: { phone: formattedPhone } });
    }
    if (!customer && email) {
      customer = await prisma.customer.findUnique({ where: { email } });
    }
    if (!customer) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp atau password salah' },
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
