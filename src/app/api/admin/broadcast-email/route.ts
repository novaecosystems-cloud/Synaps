import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

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

    const gmailUser = process.env.GMAIL_USER || 'novaecosystems@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (!gmailPass) {
      return NextResponse.json({ success: false, error: 'Gmail SMTP credentials missing in environment variables.' }, { status: 500 });
    }

    // Create Gmail SMTP Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    // Send broadcast email to all users
    const mailOptions = {
      from: `"Synaps AI" <${gmailUser}>`,
      to: recipientEmails.join(', '),
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #ffffff; border-radius: 16px;">
          <h1 style="color: #f59e0b; font-size: 24px; font-weight: 800;">Synaps AI — Product Update 🚀</h1>
          <h2 style="color: #ffffff; font-size: 18px; margin-top: 12px;">${subject}</h2>
          <div style="font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap; margin-top: 16px;">${message}</div>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #334155; text-align: center;">
            <a href="https://synaps-one.vercel.app/dashboard" style="background-color: #f59e0b; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 800; display: inline-block;">Open Synaps AI Dashboard →</a>
          </div>
          <p style="font-size: 11px; color: #64748b; margin-top: 24px; text-align: center;">Sent directly via Synaps AI Operations (${gmailUser})</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: `Gmail SMTP Broadcast sent successfully to ${recipientEmails.length} registered users from ${gmailUser}!`,
      recipientsCount: recipientEmails.length,
      emailsSent: recipientEmails
    });

  } catch (error: any) {
    console.error('Gmail SMTP Broadcast error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
