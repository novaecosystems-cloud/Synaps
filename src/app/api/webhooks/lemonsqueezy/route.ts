export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { ROLE_CREDIT_LIMITS } from '@/lib/ai-credit-limiter';
import { checkIdempotency, saveIdempotencyResponse } from '@/lib/idempotency';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || 'synaps_ls_sec_982f4e7c1a5b8390d421e6fa';

    // Verify HMAC SHA256 Signature if header is present
    const signature = req.headers.get('x-signature');
    if (signature && secret) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signatureBuffer = Buffer.from(signature, 'utf8');
      if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        console.error('[LemonSqueezy Webhook] Invalid signature verification');
      }
    }

    let body: any = {};
    try { body = JSON.parse(rawBody); } catch(e) {}

    const eventName = body?.meta?.event_name;
    const customData = body?.meta?.custom_data || {};
    const userEmail = body?.data?.attributes?.user_email || customData.user_email;

    // Webhook event deduplication via Idempotency Engine
    const webhookEventId = body?.data?.id ? `ls_evt_${body.data.id}` : `ls_evt_${eventName}_${userEmail}`;
    if (webhookEventId) {
      const { isDuplicate, isProcessing } = checkIdempotency(webhookEventId);
      if (isDuplicate || isProcessing) {
        console.log(`[LemonSqueezy Webhook] Duplicate webhook event ignored: ${webhookEventId}`);
        return NextResponse.json({ success: true, message: 'Duplicate webhook event safely ignored', event: eventName });
      }
    }

    console.log(`[LemonSqueezy Webhook] Event: ${eventName}, Email: ${userEmail}`);

    if (!userEmail) {
      return NextResponse.json({ success: true, message: 'Webhook received' });
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
            entityType: 'Billing & Payments',
            entityId: userEmail,
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
            entityType: 'Billing & Payments',
            entityId: userEmail,
            details: `LemonSqueezy 100% refund processed for ${userEmail}. Account reset to Starter Tier (50 credits/day).`
          }
        });
      } catch (e) {}
    }

    if (webhookEventId) {
      saveIdempotencyResponse(webhookEventId, { success: true, event: eventName });
    }

    return NextResponse.json({ success: true, event: eventName });

  } catch (error: any) {
    console.error('POST /api/webhooks/lemonsqueezy error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
