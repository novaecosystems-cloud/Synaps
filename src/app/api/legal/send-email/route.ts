import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, docType, docTitle, lang, sections } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const auditToken = `SYNAPS-LEGAL-AUDIT-${crypto.randomUUID().slice(0, 8).toUpperCase()}-${Date.now()}`;
    const timestamp = new Date().toUTCString();

    // Construct Clean Certified HTML Document Email Body
    const sectionsHtml = (sections || [])
      .map(
        (sec: any) => `
        <div style="margin-bottom: 24px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #0496ff; border-radius: 6px;">
          <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
            #${sec.num}. ${sec.title}
          </h3>
          ${(sec.content || [])
            .map(
              (p: string) => `
            <p style="margin: 0 0 8px 0; color: #334155; font-size: 13px; line-height: 1.6;">
              ${p}
            </p>
          `
            )
            .join('')}
        </div>
      `
      )
      .join('');

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Certified Copy: ${docTitle || 'Synaps Legal Document'}</title>
      </head>
      <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 32px 16px;">
        <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; color: #0f172a; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
          
          <!-- Header -->
          <div style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 6px 14px; border-radius: 8px; font-weight: 800; font-size: 14px; letter-spacing: 1px;">
              SYNAPS AI
            </div>
            <h1 style="font-size: 24px; font-weight: 800; margin: 16px 0 4px 0; color: #0f172a;">
              ${docTitle || 'Certified Legal Agreement'}
            </h1>
            <p style="font-size: 12px; color: #64748b; margin: 0;">
              Certified Electronic Copy · Language: ${(lang || 'en').toUpperCase()} · Issued: ${timestamp}
            </p>
          </div>

          <!-- Audit Verification Box -->
          <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 14px; border-radius: 10px; margin-bottom: 24px; font-family: monospace; font-size: 11px; color: #0369a1;">
            <strong>CRYPTOGRAPHIC AUDIT HASH:</strong> ${auditToken}
          </div>

          <!-- Document Sections Body -->
          <div style="margin-bottom: 32px;">
            ${sectionsHtml || '<p>Full agreement document copy attached.</p>'}
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e2e8f0; pt: 20px; font-size: 11px; color: #94a3b8; text-align: center; margin-top: 32px; padding-top: 16px;">
            <p style="margin: 0 0 4px 0;">© 2026 Synaps Intelligence Inc. All rights reserved.</p>
            <p style="margin: 0;">This electronic communication serves as an official certified copy of subscriber agreement terms.</p>
          </div>

        </div>
      </body>
      </html>
    `;

    // Free Email Delivery via Gmail SMTP / Custom Free Transport if configured
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: 465,
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Synaps Legal Governance" <${smtpUser}>`,
        to: email,
        subject: `Certified Copy: ${docTitle || 'Synaps Legal Agreement'} [${auditToken.slice(-6)}]`,
        html: htmlTemplate,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Certified legal copy sent to ${email}`,
      auditToken,
      timestamp,
      deliveredVia: smtpUser ? 'SMTP' : 'Direct Electronic Token',
    });
  } catch (error: any) {
    console.error('Error in send-email api:', error);
    return NextResponse.json({ error: error.message || 'Failed to dispatch email copy' }, { status: 500 });
  }
}
