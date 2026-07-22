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
  prisma?: ExtendedPrismaClient;
  rawPrisma?: PrismaClient;
};

const rawPrisma = globalForPrisma.rawPrisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.rawPrisma = rawPrisma;
}

export const getOrgId = async () => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return null;
    
    const decodedToken = await verifySessionCookie(session);
    if (!decodedToken) return null;

    const user = await rawPrisma.user.findUnique({
      where: { id: decodedToken.uid },
      select: { organizationId: true }
    });
    
    return user?.organizationId || null;
  } catch (error) {
    return null;
  }
};

const createExtendedClient = () => rawPrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const systemModels = ['Organization', 'User', 'Invitation'];
        if (systemModels.includes(model)) {
          return query(args);
        }

        const orgId = await getOrgId();

        if (!orgId) {
          throw new Error(`Unauthorized: No tenant context found for query on ${model}`);
        }

        const a = args ? { ...args } : {};

        const isBulkReadOrUpdate = ['findFirst', 'findFirstOrThrow', 'findMany', 'updateMany', 'deleteMany', 'count', 'aggregate', 'groupBy'].includes(operation);
        const requiresManualOrgCheck = ['findUnique', 'findUniqueOrThrow', 'update', 'delete'].includes(operation);
        
        if (isBulkReadOrUpdate) {
          a.where = { ...(a.where || {}), organizationId: orgId };
        }

        if (requiresManualOrgCheck) {
          const record = await (rawPrisma as any)[model].findUnique({
            where: a.where,
            select: { organizationId: true }
          });
          
          if (record && record.organizationId !== orgId) {
            throw new Error(`Unauthorized: Tenant isolation violation on ${model}`);
          }
        }

        if (operation === 'create') {
          a.data = { ...a.data, organizationId: orgId };
        }

        if (operation === 'createMany' && Array.isArray(a.data)) {
          a.data = a.data.map((d: any) => ({ ...d, organizationId: orgId }));
        } else if (operation === 'createMany' && typeof a.data === 'object') {
          a.data = { ...a.data, organizationId: orgId };
        }

        if (operation === 'upsert') {
          // Check existing record first for update part
          const record = await (rawPrisma as any)[model].findUnique({
            where: a.where,
            select: { organizationId: true }
          });
          if (record && record.organizationId !== orgId) {
            throw new Error(`Unauthorized: Tenant isolation violation on ${model}`);
          }
          a.create = { ...a.create, organizationId: orgId };
          // Do not mutate a.where or a.update because it is a unique query
        }

        return query(a);
      }
    }
  }
});

type ExtendedPrismaClient = ReturnType<typeof createExtendedClient>;

export const prisma = globalForPrisma.prisma || createExtendedClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.rawPrisma = rawPrisma;
}

export { rawPrisma };
export default prisma;
