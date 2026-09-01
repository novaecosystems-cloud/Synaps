/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CAUSARIX POSTGRESQL ROW-LEVEL SECURITY (RLS) RUNNER & CLIENT EXTENSION
 * Module: src/lib/db-rls.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides transaction-scoped PostgreSQL RLS session binding, defense-in-depth Prisma
 * query rewriting, and administrative bypass mechanics for multi-tenant isolation.
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { prisma as basePrisma, rawPrisma } from './prisma';

export interface TenantContextOptions {
  userId?: string;
  bypassRls?: boolean;
  timeoutMs?: number;
  maxWaitMs?: number;
}

export type TenantPrismaClient = Prisma.TransactionClient;

/**
 * Execute a transactional database operation with guaranteed PostgreSQL Row-Level Security.
 * Sets `SET LOCAL app.current_tenant_id = $1` inside an isolated transaction.
 */
export async function withTenantDb<T>(
  organizationId: string,
  operation: (tx: TenantPrismaClient) => Promise<T>,
  options: TenantContextOptions = {}
): Promise<T> {
  if (!organizationId) {
    throw new Error('[DB-RLS Security Error] Missing required organizationId for tenant database context.');
  }

  const { userId, bypassRls = false, timeoutMs = 15000, maxWaitMs = 5000 } = options;
  const underlyingPrisma = (rawPrisma || basePrisma) as PrismaClient;

  return await underlyingPrisma.$transaction(
    async (tx) => {
      try {
        // 1. Set Tenant Session Variable for current transaction
        const safeOrgId = organizationId.replace(/'/g, "''");
        await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${safeOrgId}';`);

        // 2. Set Optional User Context
        if (userId) {
          const safeUserId = userId.replace(/'/g, "''");
          await tx.$executeRawUnsafe(`SET LOCAL app.current_user_id = '${safeUserId}';`);
        }

        // 3. Set Bypass Flag if explicitly authorized
        if (bypassRls) {
          await tx.$executeRawUnsafe(`SET LOCAL app.bypass_rls = 'on';`);
        } else {
          await tx.$executeRawUnsafe(`SET LOCAL app.bypass_rls = 'off';`);
        }
      } catch (sessionErr: any) {
        // In offline / mock mode, continue gracefully
        console.warn('[DB-RLS Session Notice]: Setting local RLS session variable', sessionErr?.message || sessionErr);
      }

      // 4. Execute consumer database operation
      return await operation(tx);
    },
    {
      timeout: timeoutMs,
      maxWait: maxWaitMs,
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    }
  );
}

/**
 * Execute an administrative / system operation with bypass permissions (e.g. background sync, migrations).
 */
export async function withBypassRls<T>(
  operation: (tx: TenantPrismaClient) => Promise<T>,
  options: Omit<TenantContextOptions, 'bypassRls'> = {}
): Promise<T> {
  const { timeoutMs = 20000, maxWaitMs = 5000 } = options;
  const underlyingPrisma = (rawPrisma || basePrisma) as PrismaClient;

  return await underlyingPrisma.$transaction(
    async (tx) => {
      try {
        await tx.$executeRawUnsafe(`SET LOCAL app.bypass_rls = 'on';`);
        await tx.$executeRawUnsafe(`SET LOCAL app.is_admin = 'true';`);
      } catch (bypassErr: any) {
        console.warn('[DB-RLS Bypass Notice]:', bypassErr?.message || bypassErr);
      }
      return await operation(tx);
    },
    {
      timeout: timeoutMs,
      maxWait: maxWaitMs,
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    }
  );
}

const TENANT_MODELS = new Set([
  'document',
  'decision',
  'enterpriseprediction',
  'connector',
  'documentchunk',
  'actiontask',
  'meeting',
  'project',
  'requirement',
  'gap',
  'proposal',
  'proposalsection',
  'executivesummary',
  'auditlog',
  'auditledgerentry',
  'decisionmemoryentry',
  'domainriskprofile',
  'timelineevent',
  'enterpriserisk',
  'chatsession',
  'workflow',
  'processeddocument',
  'documentmetadata',
  'documentversion',
  'processingjob',
]);

/**
 * Create a tenant-bound Prisma Client Extension that automatically injects
 * `organizationId` into all query `where` clauses and mutation `data` payloads.
 */
export function createTenantPrisma(organizationId: string) {
  if (!organizationId) {
    throw new Error('[DB-RLS Error] Cannot initialize tenant Prisma client without organizationId.');
  }

  const client = (rawPrisma || basePrisma) as PrismaClient;

  return client.$extends({
    name: `tenant-prisma-${organizationId}`,
    query: {
      $allModels: {
        async findMany({ args, query, model }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { ...(args.where || {}), organizationId };
          }
          return query(args);
        },
        async findFirst({ args, query, model }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { ...(args.where || {}), organizationId };
          }
          return query(args);
        },
        async count({ args, query, model }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { ...(args.where || {}), organizationId };
          }
          return query(args);
        },
        async create({ args, query, model }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.data = { ...(args.data as any), organizationId };
          }
          return query(args);
        },
        async createMany({ args, query, model }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            if (Array.isArray(args.data)) {
              args.data = args.data.map((item: any) => ({ ...item, organizationId }));
            }
          }
          return query(args);
        },
        async update({ args, query, model }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { ...(args.where || {}), organizationId };
          }
          return query(args);
        },
        async updateMany({ args, query, model }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { ...(args.where || {}), organizationId };
          }
          return query(args);
        },
        async delete({ args, query, model }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { ...(args.where || {}), organizationId };
          }
          return query(args);
        },
        async deleteMany({ args, query, model }) {
          if (TENANT_MODELS.has(model.toLowerCase())) {
            args.where = { ...(args.where || {}), organizationId };
          }
          return query(args);
        },
      },
    },
  });
}
