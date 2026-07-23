import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { verifySessionCookie } from './auth-server';

// Fallback alias resolution for environment variable names on Vercel
const envAny = process.env as any;
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
  if (envAny.DATABASE_URL_2 || envAny.databseurl1 || envAny.DATABASE_URL1) {
    process.env.DATABASE_URL = envAny.DATABASE_URL_2 || envAny.databseurl1 || envAny['databseurl1'] || envAny['databseurl 1'] || envAny.DATABASE_URL1 || envAny.DATABASEURL1;
  }
}
if (!process.env.DIRECT_URL || process.env.DIRECT_URL.includes('localhost')) {
  if (envAny.DIRECT_URL_2 || envAny['direct url 2'] || envAny.DIRECT_URL1) {
    process.env.DIRECT_URL = envAny.DIRECT_URL_2 || envAny['direct url 2'] || envAny.directurl2 || envAny.DIRECT_URL1 || process.env.DATABASE_URL;
  }
}

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const getOrgId = async () => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return null;
    
    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return null;

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.uid },
      select: { organizationId: true }
    });
    
    return user?.organizationId || null;
  } catch (error) {
    return null;
  }
};

export const rawPrisma = prisma;
export default prisma;
