import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/health - Check database connection & tables
export async function GET() {
  const checks = {
    database: false,
    tables: {
      customers: false,
      orders: false,
      payment_settings: false,
      site_config: false,
    },
    env: {
      DATABASE_URL: !!process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('xxxxx'),
      JWT_SECRET: !!process.env.JWT_SECRET,
    },
  };

  try {
    // Test basic connection
    await prisma.$queryRawUnsafe('SELECT 1');
    checks.database = true;

    // Check each table exists
    const tableChecks = [
      { name: 'customers', key: 'customers' as const },
      { name: 'orders', key: 'orders' as const },
      { name: 'payment_settings', key: 'payment_settings' as const },
      { name: 'site_config', key: 'site_config' as const },
    ];

    for (const t of tableChecks) {
      try {
        await prisma.$queryRawUnsafe(`SELECT 1 FROM "${t.name}" LIMIT 1`);
        checks.tables[t.key] = true;
      } catch {
        checks.tables[t.key] = false;
      }
    }

    const allTablesOk = Object.values(checks.tables).every(Boolean);

    return NextResponse.json({
      status: allTablesOk ? 'healthy' : 'tables_missing',
      message: allTablesOk
        ? 'Database connected and all tables exist!'
        : 'Database connected but some tables are missing. Run the SQL setup.',
      checks,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      status: 'error',
      message: 'Cannot connect to database: ' + message,
      checks,
      hint: 'Make sure DATABASE_URL is set correctly in Vercel environment variables.',
    }, { status: 500 });
  }
}

// POST /api/health - Auto-create tables if they don't exist
export async function POST() {
  try {
    // Check if tables already exist
    try {
      await prisma.$queryRawUnsafe('SELECT 1 FROM "customers" LIMIT 1');
      return NextResponse.json({ message: 'Tables already exist. No setup needed.' });
    } catch {
      // Tables don't exist, create them
    }

    // Create enums (ignore if already exist)
    const enumQueries = [
      `DO $$ BEGIN CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
      `DO $$ BEGIN CREATE TYPE "PaymentMethod" AS ENUM ('QRIS', 'VA', 'GOPAY'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
      `DO $$ BEGIN CREATE TYPE "PaymentStatus" AS ENUM ('WAITING', 'PENDING', 'SUCCESS', 'FAILED', 'EXPIRED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
    ];

    for (const q of enumQueries) {
      await prisma.$queryRawUnsafe(q);
    }

    // Create tables
    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "customers" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "phone" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$queryRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "customers_email_key" ON "customers"("email")`);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" TEXT NOT NULL,
        "orderNumber" TEXT NOT NULL,
        "customerId" TEXT NOT NULL,
        "customerName" TEXT NOT NULL,
        "customerEmail" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "productName" TEXT NOT NULL,
        "productPrice" INTEGER NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "total" INTEGER NOT NULL,
        "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
        "paymentMethod" "PaymentMethod",
        "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'WAITING',
        "paymentExpiry" TIMESTAMP(3),
        "paidAt" TIMESTAMP(3),
        "accountEmail" TEXT,
        "accountPassword" TEXT,
        "deliveredAt" TIMESTAMP(3),
        "deliveryMethod" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$queryRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "orders_orderNumber_key" ON "orders"("orderNumber")`);
    await prisma.$queryRawUnsafe(`CREATE INDEX IF NOT EXISTS "orders_customerId_idx" ON "orders"("customerId")`);
    await prisma.$queryRawUnsafe(`CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status")`);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "payment_settings" (
        "id" TEXT NOT NULL,
        "method" TEXT NOT NULL,
        "label" TEXT NOT NULL,
        "enabled" BOOLEAN NOT NULL DEFAULT true,
        "qrisImage" TEXT,
        "bankName" TEXT,
        "vaNumber" TEXT,
        "accountName" TEXT,
        "gopayNumber" TEXT,
        "gopayName" TEXT,
        "instructions" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "payment_settings_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$queryRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "payment_settings_method_key" ON "payment_settings"("method")`);

    await prisma.$queryRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "site_config" (
        "id" TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        CONSTRAINT "site_config_pkey" PRIMARY KEY ("id")
      )
    `);
    await prisma.$queryRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "site_config_key_key" ON "site_config"("key")`);

    // Add foreign key
    await prisma.$queryRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" 
          FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL; END $$
    `);

    // Insert default payment settings
    const paymentDefaults = [
      { id: 'ps_qris', method: 'qris', label: 'QRIS', instructions: 'Scan QR code untuk pembayaran' },
      { id: 'ps_va', method: 'va', label: 'Virtual Account (VA)', instructions: 'Transfer ke nomor Virtual Account' },
      { id: 'ps_gopay', method: 'gopay', label: 'GoPay', instructions: 'Transfer ke nomor GoPay' },
    ];

    for (const p of paymentDefaults) {
      await prisma.$queryRawUnsafe(`
        INSERT INTO "payment_settings" ("id", "method", "label", "enabled", "instructions", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, true, $4, NOW(), NOW())
        ON CONFLICT ("method") DO NOTHING
      `, p.id, p.method, p.label, p.instructions);
    }

    return NextResponse.json({
      success: true,
      message: 'All tables created and default data inserted successfully!',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Setup error:', error);
    return NextResponse.json({
      error: 'Failed to setup database: ' + message,
    }, { status: 500 });
  }
}
