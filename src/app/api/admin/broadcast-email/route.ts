import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ success: false, error: 'Subject and message are required.' }, { status: 400 });
    }

    // Fetch all registered user emails from database
    const users = await prisma.user.findMany({
      select: { email: true, name: true }
    });

    const recipientEmails = users
      .map(u => u.email)
      .filter((email): email is string => Boolean(email && email.includes('@')));

    if (recipientEmails.length === 0) {
      return NextResponse.json({ success: false, error: 'No registered user emails found.' }, { status: 404 });
    }

    // Direct REST Email Dispatch Engine
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Synaps AI <onboarding@resend.dev>',
            to: recipientEmails,
            subject: subject,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #ffffff; border-radius: 16px;">
                <h1 style="color: #f59e0b; font-size: 24px; font-weight: 800;">Synaps AI — New Update 🚀</h1>
                <h2 style="color: #ffffff; font-size: 18px;">${subject}</h2>
                <div style="font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${message}</div>
                <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #334155; text-align: center;">
                  <a href="https://synaps-one.vercel.app/dashboard" style="background-color: #f59e0b; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 800; display: inline-block;">Open Synaps AI Dashboard →</a>
                </div>
              </div>
            `
          })
        });
      } catch (e) {
        console.warn('Resend REST dispatch notice:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Broadcast message processed for ${recipientEmails.length} registered users.`,
      recipientsCount: recipientEmails.length,
      emailsSent: recipientEmails
    });

  } catch (error: any) {
    console.error('Broadcast email error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
