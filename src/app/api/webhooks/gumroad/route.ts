export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkIdempotency, saveIdempotencyResponse } from '@/lib/idempotency';

/**
 * Gumroad Webhook Handler
 * Receives automated notifications for purchases, subscription cancellations, and refunds.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);

    const email = params.get('email') || params.get('purchaser_email');
    const eventName = params.get('resource_name') || 'sale'; // sale, refund, subscription_cancelled, subscription_updated
    const orderId = params.get('sale_id') || params.get('order_number') || `gum_${Date.now()}`;
    const productSlug = params.get('product_permalink') || 'synaps';

    console.log(`[Gumroad Webhook] Event: ${eventName}, Email: ${email}, OrderId: ${orderId}`);

    if (!email) {
      return NextResponse.json({ success: true, message: 'Gumroad webhook received' });
    }

    const idempotencyKey = `gumroad_${eventName}_${orderId}`;
    const { isDuplicate } = checkIdempotency(idempotencyKey);
    if (isDuplicate) {
      return NextResponse.json({ success: true, message: 'Duplicate event ignored' });
    }

    let targetUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });

    if (!targetUser) {
      targetUser = await prisma.user.create({
        data: {
          id: `user_gum_${Date.now()}`,
          email: email.toLowerCase(),
          name: email.split('@')[0],
          role: 'MEMBER'
        }
      });
    }

    // Handle Event Types
    if (eventName === 'sale' || eventName === 'subscription_created' || eventName === 'subscription_updated') {
      // Automatic Subscription / Payment Activation
      const userOrg = await prisma.organizationMember.findFirst({
        where: { userId: targetUser.id }
      });

      if (userOrg) {
        await prisma.organization.update({
          where: { id: userOrg.organizationId },
          data: {
            plan: 'PRO',
            maxCreditsPerDay: 500
          }
        });
      }

      await prisma.auditLog.create({
        data: {
          id: `audit_gum_${Date.now()}`,
          userId: targetUser.id,
          action: 'GUMROAD_PAYMENT_SUCCESS',
          category: 'BILLING',
          details: `Gumroad purchase successful for ${email}. Subscribed to Synaps Pro.`
        }
      });

    } else if (eventName === 'refund' || eventName === 'cancellation' || eventName === 'subscription_cancelled') {
      // Automatic Refund / Cancellation Processing
      const userOrg = await prisma.organizationMember.findFirst({
        where: { userId: targetUser.id }
      });

      if (userOrg) {
        await prisma.organization.update({
          where: { id: userOrg.organizationId },
          data: {
            plan: 'FREE',
            maxCreditsPerDay: 100
          }
        });
      }

      await prisma.auditLog.create({
        data: {
          id: `audit_gum_ref_${Date.now()}`,
          userId: targetUser.id,
          action: eventName === 'refund' ? 'GUMROAD_REFUND_PROCESSED' : 'GUMROAD_SUBSCRIPTION_CANCELLED',
          category: 'BILLING',
          details: `Automated ${eventName} processed for ${email}. Access safely reverted.`
        }
      });
    }

    saveIdempotencyResponse(idempotencyKey, { status: 200, data: { success: true } });
    return NextResponse.json({ success: true, message: `Gumroad ${eventName} processed successfully` });

  } catch (error: any) {
    console.error('POST /api/webhooks/gumroad error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
