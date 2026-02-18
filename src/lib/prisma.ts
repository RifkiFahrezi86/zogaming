import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes('xxxxx') || connectionString.includes('user:password')) {
    console.error('[Prisma] DATABASE_URL is not configured! Set it in .env or Vercel environment variables.');
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
