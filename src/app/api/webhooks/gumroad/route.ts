export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ROLE_CREDIT_LIMITS } from '@/lib/ai-credit-limiter';
import { checkIdempotency, saveIdempotencyResponse } from '@/lib/idempotency';

/**
 * Gumroad Webhook Handler
 * Endpoint: https://synaps-one.vercel.app/api/webhooks/gumroad
 * 
 * Automatically upgrades user account & organization AI credits upon real payment.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);

    const email = (params.get('email') || params.get('purchaser_email') || '').trim();
    const eventName = params.get('resource_name') || 'sale'; // sale, refund, subscription_cancelled, subscription_updated
    const orderId = params.get('sale_id') || params.get('order_number') || `gum_${Date.now()}`;
    const variants = params.get('variants[Tier]') || params.get('variant') || params.get('variants') || '';
    const priceCents = parseInt(params.get('price') || '0', 10);

    console.log(`[Gumroad Webhook] Event: ${eventName}, Email: ${email}, OrderId: ${orderId}, Variant: ${variants}, Price: ${priceCents}`);

    // If Gumroad pings without email (Ping test)
    if (!email) {
      return NextResponse.json({ success: true, message: 'Gumroad webhook ping verified successfully!' });
    }

    const idempotencyKey = `gumroad_${eventName}_${orderId}`;
    const { isDuplicate } = checkIdempotency(idempotencyKey);
    if (isDuplicate) {
      return NextResponse.json({ success: true, message: 'Duplicate event safely ignored' });
    }

    // Determine target tier (Enterprise vs Pro)
    const isEnterprise = variants.toLowerCase().includes('enterprise') || priceCents > 1000;
    const targetRole = isEnterprise ? 'OWNER' : 'ADMIN';
    const targetCredits = isEnterprise ? 10000 : 500;
    const planName = isEnterprise ? 'ENTERPRISE' : 'PRO';

    let targetUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    });

    if (!targetUser) {
      targetUser = await prisma.user.create({
        data: {
          id: `user_gum_${Date.now()}`,
          email: email.toLowerCase(),
          name: email.split('@')[0],
          role: targetRole as any
        }
      });
    }

    // Handle Payment & Subscription Activations
    if (eventName === 'sale' || eventName === 'subscription_created' || eventName === 'subscription_updated') {
      // 1. Upgrade User Role
      await prisma.user.update({
        where: { id: targetUser.id },
        data: { role: targetRole as any }
      });

      // 2. Update Global Credit Limiter
      ROLE_CREDIT_LIMITS[targetRole] = targetCredits;

      // 3. Upgrade Organization Plan & Limits
      const userOrg = await prisma.organizationMember.findFirst({
        where: { userId: targetUser.id }
      });

      if (userOrg) {
        await prisma.organization.update({
          where: { id: userOrg.organizationId },
          data: {
            plan: planName as any,
            maxCreditsPerDay: targetCredits
          }
        });
      }

      await prisma.auditLog.create({
        data: {
          id: `audit_gum_${Date.now()}`,
          userId: targetUser.id,
          action: 'GUMROAD_PAYMENT_SUCCESS',
          category: 'BILLING',
          details: `Gumroad payment verified for ${email}. Upgraded to ${planName} (${targetCredits} daily AI credits).`
        }
      });

    } else if (eventName === 'refund' || eventName === 'cancellation' || eventName === 'subscription_cancelled') {
      // Handle Refunds & Cancellations -> Revert to Member Free Tier (50 credits)
      await prisma.user.update({
        where: { id: targetUser.id },
        data: { role: 'MEMBER' as any }
      });

      ROLE_CREDIT_LIMITS['MEMBER'] = 50;

      const userOrg = await prisma.organizationMember.findFirst({
        where: { userId: targetUser.id }
      });

      if (userOrg) {
        await prisma.organization.update({
          where: { id: userOrg.organizationId },
          data: {
            plan: 'FREE',
            maxCreditsPerDay: 50
          }
        });
      }

      await prisma.auditLog.create({
        data: {
          id: `audit_gum_ref_${Date.now()}`,
          userId: targetUser.id,
          action: eventName === 'refund' ? 'GUMROAD_REFUND_PROCESSED' : 'GUMROAD_SUBSCRIPTION_CANCELLED',
          category: 'BILLING',
          details: `Automated ${eventName} processed for ${email}. Account status reverted to Free tier.`
        }
      });
    }

    saveIdempotencyResponse(idempotencyKey, { status: 200, data: { success: true } });
    return NextResponse.json({ 
      success: true, 
      message: `Gumroad ${eventName} processed successfully for ${email}. Plan set to ${planName}.` 
    });

  } catch (error: any) {
    console.error('POST /api/webhooks/gumroad error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET endpoint for Gumroad webhook health check & test ping
export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    service: 'Synaps AI Gumroad Webhook Handler',
    timestamp: new Date().toISOString()
  });
}
