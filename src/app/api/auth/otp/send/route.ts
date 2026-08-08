import { NextRequest, NextResponse } from 'next/server';
import { generateOTP } from '@/lib/otp-store';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || 'guest.demo@synaps.ai').trim().toLowerCase();
    const idToken = body.idToken;

    const { code, expiresAt, isDemo } = generateOTP(email, idToken);

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
    const resendApiKey = process.env.RESEND_API_KEY;

    let emailSent = false;
    let deliveryMethod = '';

    // 1. Primary Delivery Method: Gmail SMTP (Sends to ANY email worldwide, 100% Free, No domain needed)
    if (!isDemo && gmailUser && gmailAppPassword) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailAppPassword,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        await transporter.sendMail({
          from: `"Synaps AI 2FA" <${gmailUser}>`,
          to: email,
          subject: `🔒 ${code} is your Synaps 2FA Security Code`,
          html: `
            <div style="font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif; max-width: 520px; margin: 0 auto; background: #000209; border: 2px solid #323232; border-radius: 16px; padding: 32px; color: #eeeeee;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="font-family: monospace; font-size: 28px; font-weight: 900; color: #ff0090; letter-spacing: 2px; margin: 0;">SYNAPS AI</h1>
                <p style="font-family: monospace; font-size: 11px; color: #9bb8e1; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px;">Enterprise OS & Memory Graph</p>
              </div>
              
              <div style="background: #141312; border: 1px solid #383631; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="font-size: 14px; color: #b7c6d4; margin-top: 0; margin-bottom: 12px;">Your 6-digit Two-Factor Authentication (2FA) Code:</p>
                <div style="font-family: monospace; font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #FFD750; background: #000000; padding: 16px 24px; border-radius: 8px; border: 2px solid #4C0016; display: inline-block;">
                  ${code}
                </div>
                <p style="font-size: 12px; color: #73767d; margin-bottom: 0; margin-top: 16px;">This code will expire in <strong style="color: #ff0090;">5 minutes</strong>.</p>
              </div>
              
              <p style="font-size: 12px; color: #73767d; text-align: center; line-height: 1.6; margin: 0;">
                If you did not request this 2FA security code, please disregard this message or secure your account.
              </p>
            </div>
          `,
        });

        emailSent = true;
        deliveryMethod = 'Gmail SMTP';
        console.log(`[GMAIL 2FA] ✅ Real 2FA email successfully delivered to ${email} via Gmail SMTP.`);
      } catch (gmailErr: any) {
        console.error('[GMAIL 2FA] Error sending email via Gmail SMTP:', gmailErr.message);
      }
    }

    // 2. Secondary Fallback: Resend API
    if (!emailSent && !isDemo && resendApiKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: `🔒 ${code} is your Synaps 2FA Security Code`,
            html: `<p>Synaps AI 2FA Code: <strong>${code}</strong></p>`,
          }),
        });

        if (resendRes.ok) {
          emailSent = true;
          deliveryMethod = 'Resend API';
        }
      } catch (err: any) {}
    }

    return NextResponse.json({
      success: true,
      message: isDemo
        ? `Demo 2FA Security Code: 123456`
        : emailSent
        ? `Real 2FA Security Code sent to ${email}!`
        : `2FA Security Code generated for ${email}.`,
      otpCodeHint: (!emailSent || isDemo) ? code : undefined,
      emailSent,
      deliveryMethod: deliveryMethod || undefined,
      expiresAt: new Date(expiresAt).toISOString(),
    });
  } catch (error: any) {
    console.error('[API 2FA SEND] Error generating OTP:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to generate 2FA security code.' },
      { status: 500 }
    );
  }
}
