'use server'

import { cookies } from 'next/headers';
import { PrismaClient, Role } from '@prisma/client';
import { verifySessionCookie } from '@/lib/auth-server';
import crypto from 'crypto';

import prisma from '@/lib/prisma';
const SESSION_COOKIE_NAME = 'synaps-session';

async function getAuthUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded) return null;

  return await prisma.user.findUnique({
    where: { id: decoded.uid },
    include: { organization: true },
  });
}

export async function getOrganizationMembers() {
  const user = await getAuthUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const members = await prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });
    
    const invitations = await prisma.invitation.findMany({
      where: { organizationId: user.organizationId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });
    
    return { success: true, members, invitations, currentUserRole: user.role, currentUserId: user.id };
  } catch (error) {
    console.error('Error fetching members:', error);
    return { success: false, error: 'Internal error' };
  }
}

export async function inviteMember(email: string, role: Role) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
    return { success: false, error: 'Permission denied' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser && existingUser.organizationId === user.organizationId) {
      return { success: false, error: 'User is already a member' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        token,
        expiresAt,
        organizationId: user.organizationId,
        invitedBy: user.id
      }
    });

    return { 
      success: true, 
      message: 'Invitation created successfully'
    };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'An invitation for this email is already pending' };
    }
    console.error('Error inviting member:', error);
    return { success: false, error: 'Failed to create invitation' };
  }
}

export async function updateMemberRole(targetUserId: string, newRole: Role) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  if (user.role !== 'OWNER') {
    return { success: false, error: 'Only owners can change roles' };
  }
  
  if (user.id === targetUserId) {
    return { success: false, error: 'Cannot change your own role' };
  }

  try {
    await prisma.user.update({
      where: { 
        id: targetUserId,
        organizationId: user.organizationId
      },
      data: { role: newRole }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating role:', error);
    return { success: false, error: 'Failed to update role' };
  }
}

export async function removeMember(targetUserId: string) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
    return { success: false, error: 'Permission denied' };
  }
  
  if (user.id === targetUserId) {
    return { success: false, error: 'Cannot remove yourself' };
  }

  try {
    await prisma.user.delete({
      where: { 
        id: targetUserId,
        organizationId: user.organizationId
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error removing member:', error);
    return { success: false, error: 'Failed to remove member' };
  }
}

export async function removeInvitation(invitationId: string) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  if (user.role !== 'OWNER' && user.role !== 'ADMIN') {
    return { success: false, error: 'Permission denied' };
  }

  try {
    await prisma.invitation.delete({
      where: { 
        id: invitationId,
        organizationId: user.organizationId
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return { success: false, error: 'Failed to delete invitation' };
  }
}
