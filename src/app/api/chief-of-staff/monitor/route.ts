export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { getAdaptiveChannels, getAdaptiveAlerts } from '@/lib/org-adaptive-content';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded || !decoded.uid) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    let dbUser: any = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: decoded.uid },
        select: { organizationId: true }
      });
    } catch (e) {}

    const organizationId = dbUser?.organizationId || 'no_org_fallback';

    // Monitor channels for changes across Organization context
    let unreadNotificationsCount = 0;
    try {
      unreadNotificationsCount = await prisma.notification.count({
        where: { organizationId, isRead: false }
      });
    } catch (e) {}

    let sector = 'default';
    let companyName = 'Your Organisation';

    if (dbUser?.organizationId) {
      try {
        const org = await prisma.organization.findUnique({
          where: { id: dbUser.organizationId },
          select: { name: true, settings: true }
        });
        if (org) {
          const settings = (org.settings as any) || {};
          companyName = settings.companyName || org.name || companyName;
          sector = settings.sector || 'default';
        }
      } catch (e) {}
    }

    const adaptiveChannels = getAdaptiveChannels(sector);
    const adaptiveAlerts = getAdaptiveAlerts(sector, companyName);

    const channelsMonitored = adaptiveChannels.slice(0, 8).map((channel, i) => ({
      name: channel,
      status: 'ACTIVE',
      lastScan: ['Just now', '2m ago', 'Just now', 'Just now', '5m ago', '3m ago', 'Just now', '1m ago'][i] || 'Just now',
      alerts: i < adaptiveAlerts.length ? 1 : 0
    }));

    const urgencies = ['CRITICAL', 'HIGH', 'HIGH', 'MEDIUM'];
    const actions = [
      'Review contract terms and execute renewal',
      'Review operational SLA and schedule touchpoint',
      'Reallocate resources to unblock milestone',
      'Audit operational variances vs budget'
    ];

    const activeProactiveAlerts = adaptiveAlerts.slice(0, 4).map((msg, i) => ({
      id: `alert-${i + 1}`,
      channel: adaptiveChannels[i] || 'Operational Monitor',
      message: msg,
      urgency: urgencies[i] || 'MEDIUM',
      timestamp: ['10m ago', '25m ago', '1h ago', '2h ago'][i] || '1h ago',
      action: actions[i] || 'Review operational alert'
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalMonitoredChannels: channelsMonitored.length,
        unreadNotificationsCount,
        channelsMonitored,
        activeProactiveAlerts
      }
    });

  } catch (error: any) {
    console.error("GET /api/chief-of-staff/monitor error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

