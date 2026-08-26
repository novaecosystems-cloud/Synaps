import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { requireAuth } from '@/lib/api-security';

export async function POST(req: NextRequest) {
  const _auth = await requireAuth(req);
  if (_auth instanceof NextResponse) return _auth;
  try {
    const { email, docTitle, sections } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const auditToken = `SYNAPS-LEGAL-AUDIT-${crypto.randomUUID().slice(0, 8).toUpperCase()}-${Date.now()}`;
    const timestamp = new Date().toUTCString();

    // Format plain text legal document copy for mailto & download attachments
    const plainTextCopy = `SYNAPS ENTERPRISE LEGAL GOVERNANCE
OFFICIAL CERTIFIED COPY · ${docTitle || 'LEGAL AGREEMENT'}
AUDIT VERIFICATION HASH: ${auditToken}
ISSUED: ${timestamp}
----------------------------------------------------------------------

${(sections || [])
  .map(
    (sec: any) => `
SECTION #${sec.num}: ${sec.title.toUpperCase()}
${(sec.content || []).join('\n\n')}
`
  )
  .join('\n----------------------------------------------------------------------\n')}

----------------------------------------------------------------------
© 2026 Synaps Intelligence Inc. All rights reserved.
Certified Electronic Audit Token: ${auditToken}
`;

    // Try server SMTP dispatch if credentials exist
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    let emailSentViaSmtp = false;

    if (smtpUser && smtpPass) {
      try {
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
          text: plainTextCopy,
        });

        emailSentViaSmtp = true;
      } catch (e) {
        console.warn('SMTP Dispatch skipped/failed:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Certified copy prepared for ${email}`,
      auditToken,
      timestamp,
      plainTextCopy,
      emailSentViaSmtp,
    });
  } catch (error: any) {
    console.error('Error in send-email API:', error);
    return NextResponse.json({ error: 'Failed to dispatch email copy' }, { status: 500 });
  }
}
