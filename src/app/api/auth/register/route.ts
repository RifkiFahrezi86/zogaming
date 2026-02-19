import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, password, phone } = body;

    // Validation - only name, phone, password required
    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: 'Nama, Nomor WhatsApp, dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Format phone
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) formattedPhone = '62' + formattedPhone.slice(1);
    else if (!formattedPhone.startsWith('62')) formattedPhone = '62' + formattedPhone;

    // Auto-generate email from phone
    const autoEmail = `${formattedPhone}@wa.zogaming`;

    // Check if phone already registered
    const existing = await prisma.customer.findFirst({ 
      where: { 
        OR: [
          { phone: formattedPhone },
          { email: autoEmail },
        ]
      } 
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp sudah terdaftar' },
        { status: 409 }
      );
    }

    // Create customer
    const hashedPassword = await hashPassword(password);
    const customer = await prisma.customer.create({
      data: {
        name,
        email: autoEmail,
        password: hashedPassword,
        phone: formattedPhone,
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
