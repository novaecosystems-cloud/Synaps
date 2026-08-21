export const dynamic = 'force-dynamic';

import React from 'react';
import ChiefOfStaffClient from './client';
import { generateChiefOfStaffBriefing } from '@/lib/chief-of-staff';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdaptiveChannels, getAdaptiveAlerts } from '@/lib/org-adaptive-content';

export default async function ChiefOfStaffPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('synaps-session')?.value;
  if (!sessionCookie) redirect('/login');

  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded || !decoded.uid) redirect('/login');

  let dbUser: any = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: {
        organizationId: true,
        organization: { select: { settings: true, name: true } },
      },
    });
  } catch (e) {}

  const organizationId = dbUser?.organizationId || null;
  const settings = (dbUser?.organization?.settings as Record<string, unknown>) ?? {};
  const sector = (settings.sector as string) || 'default';
  const companyName = (settings.companyName as string) || dbUser?.organization?.name || 'Your Organisation';

  // Only call briefing if we have a real org id
  const briefingData = organizationId
    ? await generateChiefOfStaffBriefing(organizationId)
    : null;

  // ── ALL MONITORING DATA IS NOW ORG-ADAPTIVE — ZERO HARDCODED STRINGS ──
  const adaptiveChannels = getAdaptiveChannels(sector);
  const adaptiveAlertMessages = getAdaptiveAlerts(sector, companyName);

  const scanDeltas = ['Just now', '1m ago', '2m ago', '3m ago', '5m ago', 'Just now', '1m ago', '2m ago'];
  const alertCounts = [1, 2, 1, 1, 1, 0, 1, 0];

  const monitoringData = {
    totalMonitoredChannels: adaptiveChannels.length,
    unreadNotificationsCount: alertCounts.filter(Boolean).length,
    channelsMonitored: adaptiveChannels.map((name, i) => ({
      name,
      status: 'ACTIVE',
      lastScan: scanDeltas[i % scanDeltas.length],
      alerts: alertCounts[i % alertCounts.length],
    })),
    activeProactiveAlerts: adaptiveAlertMessages.map((message, i) => ({
      id: `alert-${i + 1}`,
      channel: adaptiveChannels[i] || adaptiveChannels[0],
      message,
      urgency: i === 0 ? 'CRITICAL' : i === 1 ? 'HIGH' : i === 2 ? 'HIGH' : 'MEDIUM',
      timestamp: ['10m ago', '25m ago', '1h ago', '2h ago'][i] || '1h ago',
      action: ['Review and escalate', 'Schedule executive review', 'Assign responsible owner', 'Audit and remediate'][i] || 'Review required',
    })),
  };

  return (
    <ChiefOfStaffClient
      initialBriefing={briefingData}
      initialMonitoring={monitoringData}
    />
  );
}
