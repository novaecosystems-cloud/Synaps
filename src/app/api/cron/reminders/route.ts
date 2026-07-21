export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { db } from '@/lib/firebase-admin';

import { rawPrisma as prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && (!cronSecret || authHeader !== `Bearer ${cronSecret}`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (isDev && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find all tasks that are due in the next 24 hours and are not DONE
    const tasksDueSoon = await prisma.projectTask.findMany({
      where: {
        status: { not: 'DONE' },
        deadline: {
          gte: now,
          lte: tomorrow
        }
      },
      include: {
        project: {
          include: {
            owner: true,
            members: {
              include: { user: true }
            }
          }
        }
      }
    });

    let emailsSent = 0;
    const batch = db.batch();
    
    // We will use the Firebase Trigger Email extension by writing to the 'mail' collection
    const mailCollection = db.collection('mail');

    for (const task of tasksDueSoon) {
      // Collect unique emails of everyone in the project (or just the owner and managers)
      // For now, let's notify the owner and all project members
      const notifyUsers = [task.project.owner, ...task.project.members.map(m => m.user)];
      const uniqueEmails = Array.from(new Set(notifyUsers.map(u => u.email).filter(Boolean)));

      for (const email of uniqueEmails) {
        if (!email) continue;
        
        const mailRef = mailCollection.doc();
        batch.set(mailRef, {
          to: email,
          message: {
            subject: `Reminder: Task "${task.title}" is due soon!`,
            text: `Hello,\n\nThis is an automated reminder that the task "${task.title}" in the project "${task.project.name}" is due on ${task.deadline?.toLocaleDateString()}.\n\nPlease ensure it gets completed!\n\nBest,\nSynaps Team`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #050508; color: #fff; padding: 20px; border-radius: 8px;">
                <h2 style="color: #a78bfa;">Task Reminder ⏱️</h2>
                <p>Hello,</p>
                <p>This is an automated reminder that your task is due soon:</p>
                <div style="background-color: #1a1a24; padding: 15px; border-radius: 6px; border-left: 4px solid #a78bfa; margin: 20px 0;">
                  <h3 style="margin: 0 0 10px 0;">${task.title}</h3>
                  <p style="margin: 0; color: #9ca3af;">Project: <strong>${task.project.name}</strong></p>
                  <p style="margin: 5px 0 0 0; color: #f87171;">Due: ${task.deadline?.toLocaleDateString()}</p>
                </div>
                <p>Best regards,<br/>The Synaps Team</p>
              </div>
            `
          }
        });
        emailsSent++;
      }
    }

    if (emailsSent > 0) {
      await batch.commit();
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${tasksDueSoon.length} tasks. Sent ${emailsSent} reminder emails via Firebase.` 
    });

  } catch (error: any) {
    console.error('Error running reminders cron:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

