'use server'

import { PrismaClient, TaskStatus } from '@prisma/client';
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

export async function getProjectTasks(projectId: string) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.organizationId !== user.organizationId) {
      return { success: false, error: 'Unauthorized access to project' };
    }

    const tasks = await prisma.projectTask.findMany({
      where: { projectId },
      include: {
        notes: {
          include: {
            user: { select: { name: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, tasks };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { success: false, error: 'Failed to fetch tasks.' };
  }
}

export async function createTask(projectId: string, title: string, deadline?: Date | null) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.organizationId !== user.organizationId) {
      return { success: false, error: 'Unauthorized access to project' };
    }

    const task = await prisma.projectTask.create({
      data: {
        projectId,
        title,
        deadline: deadline || null,
        status: 'INCOMPLETE'
      },
      include: {
        notes: { include: { user: { select: { name: true, avatarUrl: true } } } }
      }
    });
    return { success: true, task };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task.' };
  }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const existingTask = await prisma.projectTask.findUnique({ 
      where: { id: taskId },
      include: { project: true } 
    });
    if (!existingTask || existingTask.project.organizationId !== user.organizationId) {
      return { success: false, error: 'Unauthorized access to task' };
    }

    const task = await prisma.projectTask.update({
      where: { id: taskId },
      data: { status }
    });
    return { success: true, task };
  } catch (error) {
    console.error('Error updating task status:', error);
    return { success: false, error: 'Failed to update task status.' };
  }
}

export async function addTaskNote(taskId: string, content: string) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const existingTask = await prisma.projectTask.findUnique({ 
      where: { id: taskId },
      include: { project: true } 
    });
    if (!existingTask || existingTask.project.organizationId !== user.organizationId) {
      return { success: false, error: 'Unauthorized access to task' };
    }

    const note = await prisma.taskNote.create({
      data: {
        taskId,
        userId: user.id,
        content
      },
      include: {
        user: { select: { name: true, avatarUrl: true } }
      }
    });
    return { success: true, note };
  } catch (error) {
    console.error('Error adding note:', error);
    return { success: false, error: 'Failed to add note.' };
  }
}

export async function deleteTask(taskId: string) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const existingTask = await prisma.projectTask.findUnique({ 
      where: { id: taskId },
      include: { project: true } 
    });
    if (!existingTask || existingTask.project.organizationId !== user.organizationId) {
      return { success: false, error: 'Unauthorized access to task' };
    }

    await prisma.projectTask.delete({
      where: { id: taskId }
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task.' };
  }
}
