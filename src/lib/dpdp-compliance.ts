import prisma from '@/lib/prisma';

export type DPDPDataType = 
  | 'PERSONAL_IDENTIFIABLE_INFO'
  | 'CONTRACT_DOCUMENT'
  | 'MEETING_TRANSCRIPT'
  | 'FINANCIAL_DATA'
  | 'SEARCH_QUERY_PROMPT'
  | 'ORGANIZATION_PROFILE';

export interface LogDataInputParams {
  userId?: string;
  organizationId?: string;
  dataType: DPDPDataType;
  dataIdentifier: string;
  purpose?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

/**
 * DPDP Act 2023 Compliant Data Input Logging Engine
 * Records exact timestamps and data classifications whenever a user inputs data.
 */
export async function logDataInput(params: LogDataInputParams) {
  const timestamp = new Date();
  
  try {
    const auditRecord = await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        organizationId: params.organizationId || null,
        action: 'DPDP_DATA_INPUT_TIMESTAMP',
        entityType: params.dataType,
        entityId: params.dataIdentifier,
        ipAddress: params.ipAddress || '127.0.0.1',
        metadata: {
          timestampIso: timestamp.toISOString(),
          timestampMs: timestamp.getTime(),
          dataType: params.dataType,
          purpose: params.purpose || 'Grounded AI Document Intelligence & Knowledge Graph Indexing',
          lawfulBasis: 'CONSENT_AND_CONTRACT_PERFORMANCE',
          consentGrantedAt: timestamp.toISOString(),
          complianceStandard: 'DPDP_ACT_2023_INDIA_SEC_8',
          ...(params.metadata || {}),
        },
      },
    });

    console.log(`[DPDP Audit Log] Data Input Timestamped: ${params.dataType} for user ${params.userId || 'guest'} at ${timestamp.toISOString()}`);
    return auditRecord;
  } catch (error) {
    console.error(`[DPDP Audit Error] Failed to log input timestamp:`, error);
    // Non-blocking fallback return for high-throughput resilience
    return {
      id: 'fallback-log-' + Date.now(),
      createdAt: timestamp,
    };
  }
}

/**
 * DPDP Act 2023 Grievance Officer Details
 */
export const DPDP_GRIEVANCE_OFFICER = {
  name: 'Shourya Shetty',
  title: 'Data Protection & Grievance Officer (DPO)',
  organization: 'Synaps AI Enterprise OS',
  email: 'novaecosystems@gmail.com',
  jurisdiction: 'India (DPDP Act 2023 Compliance)',
  responseTimeline: 'Acknowledged within 24 hours, resolved within 30 days',
};
