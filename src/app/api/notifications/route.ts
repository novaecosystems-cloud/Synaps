export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const userId = searchParams.get('userId');
  const organizationId = searchParams.get('organizationId');
  
  if (!userId || !organizationId) {
    return NextResponse.json({ error: 'Missing userId or organizationId' }, { status: 400 });
  }

  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const unreadOnly = searchParams.get('unreadOnly') === 'true';

  try {
    const whereClause: Prisma.NotificationWhereInput = { userId, organizationId };
    
    if (unreadOnly) {
      whereClause.isRead = false;
    }

    // Fetch user preferences to filter out disabled types
    const prefs = await prisma.notificationPreference.findUnique({ where: { userId } });
    if (prefs && prefs.disabledTypes.length > 0) {
      whereClause.type = { notIn: prefs.disabledTypes as any[] };
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ 
        where: { userId, organizationId, isRead: false, ...(prefs && prefs.disabledTypes.length > 0 ? { type: { notIn: prefs.disabledTypes as any[] } } : {}) } 
      })
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, organizationId, type, title, message, link } = body;

    if (!userId || !organizationId || !type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: { userId, organizationId, type, title, message, link }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Failed to create notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, notificationId, markAllAsRead } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
      return NextResponse.json({ success: true });
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'Missing notificationId' }, { status: 400 });
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Failed to update notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

