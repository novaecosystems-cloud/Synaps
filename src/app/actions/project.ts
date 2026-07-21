'use server'

import { PrismaClient, ProjectStatus, ProjectRole } from '@prisma/client';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

import prisma from '@/lib/prisma';

async function authenticate() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) return null;
  const decodedToken = await verifySessionCookie(session);
  if (!decodedToken) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: decodedToken.uid }
  });
  return user;
}

export async function createProject(data: { name: string; description?: string; status?: ProjectStatus; metadata?: any }) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description || null,
        status: data.status || 'DRAFT',
        metadata: data.metadata || {},
        organizationId: user.organizationId,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'MANAGER'
          }
        }
      }
    });

    return { success: true, project };
  } catch (error: any) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Failed to create project.' };
  }
}

export async function getProjects(filters?: { search?: string; status?: ProjectStatus }) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const whereClause: any = {
      organizationId: user.organizationId,
      isDeleted: false,
    };

    if (filters?.search) {
      whereClause.name = { contains: filters.search, mode: 'insensitive' };
    }

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true } },
        members: { select: { id: true, userId: true, role: true, user: { select: { name: true, avatarUrl: true } } } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return { success: true, projects };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: 'Failed to fetch projects.' };
  }
}

export async function getProjectDetails(projectId: string) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId: user.organizationId,
        isDeleted: false
      },
      include: {
        owner: { select: { id: true, name: true, avatarUrl: true, email: true } },
        members: { 
          include: { user: { select: { name: true, avatarUrl: true, email: true } } } 
        },
        tasks: {
          include: {
            notes: {
              include: { user: { select: { name: true, avatarUrl: true } } },
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) return { success: false, error: 'Project not found' };

    return { success: true, project };
  } catch (error) {
    console.error('Error fetching project details:', error);
    return { success: false, error: 'Failed to fetch project details.' };
  }
}

export async function updateProject(projectId: string, data: { name?: string; description?: string; status?: ProjectStatus; metadata?: any }) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    // Verify permissions
    const membership = await prisma.projectMember.findFirst({
      where: { projectId, userId: user.id }
    });
    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (!project || project.organizationId !== user.organizationId) {
      return { success: false, error: 'Project not found' };
    }

    if (project.ownerId !== user.id && membership?.role !== 'MANAGER') {
      return { success: false, error: 'You do not have permission to edit this project.' };
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.metadata && { metadata: data.metadata })
      }
    });

    return { success: true, project: updated };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project.' };
  }
}

export async function deleteProject(projectId: string) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.organizationId !== user.organizationId) {
      return { success: false, error: 'Project not found' };
    }

    if (project.ownerId !== user.id) {
      return { success: false, error: 'Only the project owner can delete this project.' };
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { isDeleted: true }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project.' };
  }
}

export async function archiveProject(projectId: string) {
  return updateProject(projectId, { status: 'ARCHIVED' });
}
