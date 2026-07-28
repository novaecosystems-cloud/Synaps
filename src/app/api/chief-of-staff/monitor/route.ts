export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

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

    const organizationId = dbUser?.organizationId || 'demo_apex_org_id';

    // Monitor channels for changes across Organization context
    let unreadNotificationsCount = 0;
    try {
      unreadNotificationsCount = await prisma.notification.count({
        where: { organizationId, isRead: false }
      });
    } catch (e) {}

    const channelsMonitored = [
      { name: 'Email & Communications', status: 'ACTIVE', lastScan: 'Just now', alerts: 1 },
      { name: 'Executive Calendar', status: 'ACTIVE', lastScan: '2m ago', alerts: 2 },
      { name: 'Active Projects & Sprints', status: 'ACTIVE', lastScan: 'Just now', alerts: 1 },
      { name: 'Document Vault & Contracts', status: 'ACTIVE', lastScan: 'Just now', alerts: 1 },
      { name: 'Enterprise CRM & Customers', status: 'ACTIVE', lastScan: '5m ago', alerts: 1 },
      { name: 'Finance & Invoicing', status: 'ACTIVE', lastScan: '3m ago', alerts: 1 },
      { name: 'Git Repositories & Commits', status: 'ACTIVE', lastScan: 'Just now', alerts: 0 },
      { name: 'Meeting Transcripts & Memory', status: 'ACTIVE', lastScan: '1m ago', alerts: 0 }
    ];

    const activeProactiveAlerts = [
      {
        id: 'alert-1',
        channel: 'Contract Vault',
        message: 'Contract #MSA-2026-884 (GlobalFreight) expires in 15 days.',
        urgency: 'CRITICAL',
        timestamp: '10m ago',
        action: 'Review Net-45 counter-terms'
      },
      {
        id: 'alert-2',
        channel: 'Enterprise CRM',
        message: 'Customer Apex Microelectronics lead time extended by 10 days — churn risk elevated to 82%.',
        urgency: 'HIGH',
        timestamp: '25m ago',
        action: 'Schedule executive touchpoint'
      },
      {
        id: 'alert-3',
        channel: 'Active Projects',
        message: 'Project Alpha milestone delay detected (4 days behind schedule).',
        urgency: 'HIGH',
        timestamp: '1h ago',
        action: 'Reallocate 2 backend engineers'
      },
      {
        id: 'alert-4',
        channel: 'Finance',
        message: 'Cloud compute cost variance +$4,200 vs monthly budget ceiling.',
        urgency: 'MEDIUM',
        timestamp: '2h ago',
        action: 'Audit unassigned GPU instances'
      }
    ];

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
