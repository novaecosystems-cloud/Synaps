export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ROLE_CREDIT_LIMITS } from '@/lib/ai-credit-limiter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventName = body?.meta?.event_name;
    const customData = body?.meta?.custom_data || {};
    const userEmail = body?.data?.attributes?.user_email || customData.user_email;

    console.log(`[LemonSqueezy Webhook] Event: ${eventName}, Email: ${userEmail}`);

    if (!userEmail) {
      return NextResponse.json({ success: true, message: 'Webhook received (no email)' });
    }

    let targetUser = await prisma.user.findFirst({
      where: { email: { equals: userEmail, mode: 'insensitive' } }
    });

    if (!targetUser) {
      try {
        targetUser = await prisma.user.create({
          data: {
            id: `user_ls_${Date.now()}`,
            email: userEmail.toLowerCase(),
            name: userEmail.split('@')[0],
            role: 'MEMBER'
          }
        });
      } catch (e) {}
    }

    // 1. Order Created / Payment Successful -> Upgrade User
    if (eventName === 'order_created' || eventName === 'subscription_created' || eventName === 'subscription_payment_success') {
      const variantName = (body?.data?.attributes?.first_order_item?.variant_name || '').toLowerCase();
      const isEnterprise = variantName.includes('enterprise') || variantName.includes('max') || customData.plan_id === 'enterprise';

      const newRole = isEnterprise ? 'OWNER' : 'ADMIN';
      const newLimit = isEnterprise ? 10000 : 500;

      if (targetUser) {
        await prisma.user.update({
          where: { id: targetUser.id },
          data: { role: newRole as any }
        });
      }

      ROLE_CREDIT_LIMITS[newRole] = newLimit;

      try {
        await prisma.auditLog.create({
          data: {
            organizationId: targetUser?.organizationId || 'default_org',
            userId: targetUser?.id || 'lemon_squeezy_system',
            action: 'LEMONSQUEEZY_PAYMENT_SUCCESS',
            resource: 'Billing & Payments',
            details: `LemonSqueezy order created for ${userEmail}. Upgraded to ${newRole} (${newLimit} Daily Credits).`
          }
        });
      } catch (e) {}
    }

    // 2. Order Refunded / Subscription Refunded -> Reset Role to MEMBER (50 Credits)
    if (eventName === 'order_refunded' || eventName === 'subscription_payment_refunded' || eventName === 'subscription_cancelled') {
      if (targetUser) {
        await prisma.user.update({
          where: { id: targetUser.id },
          data: { role: 'MEMBER' as any }
        });
      }

      ROLE_CREDIT_LIMITS['MEMBER'] = 50;

      try {
        await prisma.auditLog.create({
          data: {
            organizationId: targetUser?.organizationId || 'default_org',
            userId: targetUser?.id || 'lemon_squeezy_system',
            action: 'LEMONSQUEEZY_REFUND_PROCESSED',
            resource: 'Billing & Payments',
            details: `LemonSqueezy 100% refund processed for ${userEmail}. Account reset to Starter Tier (50 credits/day).`
          }
        });
      } catch (e) {}
    }

    return NextResponse.json({ success: true, event: eventName });

  } catch (error: any) {
    console.error('POST /api/webhooks/lemonsqueezy error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
