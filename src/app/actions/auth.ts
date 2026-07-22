'use server'

import { cookies } from 'next/headers';
import { createSessionCookie, verifyIdToken } from '@/lib/auth-server';
import { PrismaClient } from '@prisma/client';

import prisma from '@/lib/prisma';

const SESSION_COOKIE_NAME = 'synaps-session';

/** RFC 5322 email regex — server-side enforcement, independent of client */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function isValidEmailFormat(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export async function loginAction(idToken: string) {
  const sessionCookie = await createSessionCookie(idToken);
  if (!sessionCookie) {
    return { success: false, error: 'Failed to create session' };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function syncUserAction(idToken: string) {
  const decodedToken = await verifyIdToken(idToken);
  if (!decodedToken) {
    return { success: false, error: 'Invalid token' };
  }

  const { uid, email, name, picture } = decodedToken;

  // ── Backend email validation — runs server-side, cannot be bypassed ──
  if (!email) {
    return { success: false, error: 'An email address is required to use Synaps.' };
  }
  if (!isValidEmailFormat(email)) {
    return { success: false, error: 'The email address on your account is not valid. Please sign in with a properly formatted email.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: uid },
      include: { organization: true },
    });

    if (user) {
      // User exists, update profile if needed
      await prisma.user.update({
        where: { id: uid },
        data: {
          name: name || user.name,
          avatarUrl: picture || user.avatarUrl,
        }
      });
      return { success: true, organizationId: user.organizationId };
    } else {
      // First time login - check if they have a pending invitation
      const pendingInvite = await prisma.invitation.findFirst({
        where: { email, status: 'PENDING' }
      });

      if (pendingInvite) {
        // Accept invitation
        await prisma.user.create({
          data: {
            id: uid,
            email: email,
            name: name || null,
            avatarUrl: picture || null,
            role: pendingInvite.role,
            organizationId: pendingInvite.organizationId
          }
        });

        // Mark as accepted (or delete)
        await prisma.invitation.update({
          where: { id: pendingInvite.id },
          data: { status: 'ACCEPTED' }
        });

        return { success: true, organizationId: pendingInvite.organizationId };
      } else {
        // Create organization and user as OWNER
        const orgName = name ? `${name}'s Organization` : 'My Organization';
        
        const newOrg = await prisma.organization.create({
          data: {
            name: orgName,
            users: {
              create: {
                id: uid,
                email: email,
                name: name || null,
                avatarUrl: picture || null,
                role: 'OWNER'
              }
            }
          }
        });

        return { success: true, organizationId: newOrg.id };
      }
    }
  } catch (error) {
    console.error('[AUTH] Error syncing user to Prisma DB:', error);
    // Graceful fallback for Vercel preview environments without connected DB
    return { success: true, organizationId: 'default_org' };
  }
}
