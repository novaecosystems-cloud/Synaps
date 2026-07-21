import { NextResponse } from 'next/server';
import { syncUserAction, loginAction } from '@/app/actions/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { uid, setupData } = await req.json();
  const token = `TEST_TOKEN_${uid}`;

  // 1. Sync User (creates Org and User)
  const syncResult = await syncUserAction(token);
  if (!syncResult.success) {
    return NextResponse.json({ error: syncResult.error }, { status: 400 });
  }

  // 2. Login (sets cookie)
  await loginAction(token);

  // 3. Setup mock data if requested
  if (setupData && syncResult.organizationId) {
    const orgId = syncResult.organizationId;
    
    // Manually push to DB without rawPrisma extensions intercepting if needed,
    // but the extended client handles it if we run it properly.
    // However, since this route runs on the server, getOrgId() will work once the cookie is set.
    // Wait, the cookie is set in the response, but not available in the current request context for getOrgId().
    // So we'll use rawPrisma for seeding.
    const { rawPrisma } = await import('@/lib/prisma');
    
    if (setupData.projects) {
      for (const p of setupData.projects) {
        await rawPrisma.project.create({
          data: {
            id: p.id,
            name: p.name,
            organizationId: orgId,
          }
        });
      }
    }

    if (setupData.documents) {
      for (const d of setupData.documents) {
        await rawPrisma.document.create({
          data: {
            id: d.id,
            title: d.title,
            content: d.content || '',
            organizationId: orgId,
            authorId: uid,
          }
        });
      }
    }
  }

  return NextResponse.json({ success: true, organizationId: syncResult.organizationId });
}
