export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ROLE_CREDIT_LIMITS } from '@/lib/ai-credit-limiter';

// PayPal Instant Payment Notification (IPN) & Webhook Handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const eventType = body.event_type || 'PAYMENT.CAPTURE.COMPLETED';
    const payerEmail = body.resource?.payer?.email_address || body.payer_email;
    const customUserId = body.resource?.custom_id || body.custom;
    const amountPaid = body.resource?.amount?.value || body.mc_gross;

    console.log(`[PayPal Webhook] Received ${eventType} for ${payerEmail || customUserId}, Amount: ${amountPaid}`);

    // If payer user ID or email exists, upgrade user in database
    if (customUserId || payerEmail) {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            customUserId ? { id: customUserId } : undefined,
            payerEmail ? { email: payerEmail } : undefined
          ].filter(Boolean) as any
        }
      });

      if (user) {
        const isEnterprise = Number(amountPaid) >= 15;
        const newRole = isEnterprise ? 'LEADER' : 'ADMIN';
        const newLimit = isEnterprise ? 10000 : 500;

        await prisma.user.update({
          where: { id: user.id },
          data: { role: newRole as any }
        });

        ROLE_CREDIT_LIMITS[newRole] = newLimit;

        // Create immutable payment audit log
        try {
          await prisma.auditLog.create({
            data: {
              organizationId: user.organizationId || 'default_org',
              userId: user.id,
              action: 'PAYMENT_RECEIVED',
              resource: 'PayPal Subscription',
              details: `Received $${amountPaid} via PayPal. Account role updated to ${newRole} (${newLimit} daily AI credits).`
            }
          });
        } catch (e) {}
      }
    }

    return NextResponse.json({ success: true, message: 'PayPal Webhook Processed' });

  } catch (error: any) {
    console.error('PayPal Webhook Error:', error);
    return NextResponse.json({ success: true, message: 'Webhook logged' });
  }
}
