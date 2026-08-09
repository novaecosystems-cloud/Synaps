import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { invokeLLMWithFallback } from '@/lib/llm-router';

export async function POST(req: Request) {
  try {
    const { role = 'CEO', digestType = 'DAILY', webhookUrl, emailOverride } = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://synaps-one.vercel.app';
    const targetEmail = emailOverride || process.env.GMAIL_USER || 'novaecosystems@gmail.com';

    // Fetch recent documents and projects for deep linking
    const docs = await prisma.document.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
    const projects = await prisma.project.findMany({ take: 3, orderBy: { createdAt: 'desc' } });

    // Generate Role-Tailored Digest with AI
    const prompt = [
      {
        role: 'system',
        content: `You are an Executive AI Operations Assistant for Synaps. Generate a highly structured ${digestType} Executive Digest tailored specifically for the ${role} role.

Include:
1. Key Risk & Operational Highlights
2. Strategic Priorities & Action Items
3. Line-level citations and deep links.`
      },
      {
        role: 'user',
        content: `Generate ${digestType} digest for ${role} based on recent projects and documents.`
      }
    ];

    const digestText = await invokeLLMWithFallback(prompt);

    const docLinksHtml = docs.length > 0 
      ? docs.map(d => `<li style="margin-bottom: 6px;"><a href="${baseUrl}/dashboard/documents/${d.id}" style="color: #f59e0b; font-weight: bold; text-decoration: underline;">📄 ${d.name}</a> — <span style="color: #94a3b8; font-size: 11px;">Deep Link</span></li>`).join('')
      : `<li><a href="${baseUrl}/dashboard/documents" style="color: #f59e0b; font-weight: bold;">📄 Explore All Documents</a></li>`;

    const projectLinksHtml = projects.length > 0
      ? projects.map(p => `<li style="margin-bottom: 6px;"><a href="${baseUrl}/dashboard/projects/${p.id}" style="color: #6366f1; font-weight: bold; text-decoration: underline;">📁 ${p.name}</a> — <span style="color: #94a3b8; font-size: 11px;">Project Dashboard</span></li>`).join('')
      : `<li><a href="${baseUrl}/dashboard/projects" style="color: #6366f1; font-weight: bold;">📁 View Active Projects</a></li>`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; padding: 28px; background-color: #0f172a; color: #ffffff; border-radius: 20px; border: 1px solid #334155;">
        <div style="display: flex; align-items: center; justify-between: space-between; border-bottom: 1px solid #334155; padding-bottom: 16px;">
          <h1 style="color: #f59e0b; font-size: 22px; font-weight: 800; margin: 0;">Synaps AI — ${digestType} ${role} Digest 🚀</h1>
        </div>

        <div style="font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap; margin-top: 20px;">${digestText}</div>

        <div style="margin-top: 24px; padding: 16px; background-color: #1e293b; border-radius: 14px; border: 1px solid #334155;">
          <h3 style="color: #f59e0b; font-size: 14px; font-weight: 800; margin-top: 0;">🔗 Direct Document & Project Deep Links:</h3>
          <ul style="padding-left: 20px; font-size: 13px; margin: 0;">
            ${docLinksHtml}
            ${projectLinksHtml}
          </ul>
        </div>

        <div style="margin-top: 32px; text-align: center;">
          <a href="${baseUrl}/dashboard" style="background-color: #f59e0b; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 14px; font-weight: 800; display: inline-block;">Open Executive Dashboard →</a>
        </div>
      </div>
    `;

    // 1. Send via Gmail SMTP
    const gmailUser = process.env.GMAIL_USER || 'novaecosystems@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (!gmailPass) {
      return NextResponse.json({ success: false, error: 'Gmail SMTP credentials missing in environment variables.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });

    await transporter.sendMail({
      from: `"Synaps Executive Digest" <${gmailUser}>`,
      to: targetEmail,
      subject: `[${digestType} DIGEST] Synaps Executive Brief for ${role}`,
      html: htmlContent
    });

    // 2. Send via Slack / Teams Webhook if provided
    let webhookStatus = 'NOT_CONFIGURED';
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `*Synaps ${digestType} ${role} Digest*\n\n${digestText.slice(0, 1000)}\n\n*Deep Links:*\n• <${baseUrl}/dashboard/documents|View Documents>\n• <${baseUrl}/dashboard/projects|View Projects>`
          })
        });
        webhookStatus = 'DELIVERED';
      } catch (err: any) {
        webhookStatus = `FAILED: ${err.message}`;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Executive ${digestType} digest sent successfully for role: ${role}!`,
      targetEmail,
      webhookStatus
    });

  } catch (error: any) {
    console.error('Digest API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
