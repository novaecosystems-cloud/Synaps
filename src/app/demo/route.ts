export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

/**
 * GET /demo & GET /demo/
 * Zero-Login Instant Interactive Demo Route.
 * Grants instant 100% unrestricted access to every Pro & Max feature in Synaps.
 * Sets the demo session cookie, seeds demo org + user + documents, and redirects to /dashboard.
 */
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const demoUserId = 'demo-user';
  const demoOrgId = 'no_org_fallback';

  // 1. Ensure Demo Organization exists in Database with Enterprise Max settings
  try {
    await prisma.organization.upsert({
      where: { id: demoOrgId },
      update: { 
        name: 'Causarix Sovereign Enterprise Demo',
        settings: {
          plan: 'ENTERPRISE',
          tier: 'MAX',
          unlockedFeatures: ['boardroom', 'redline', 'digital_twin', 'graph', 'mcp', 'proposals'],
          dailyCredits: 10000,
          onboardingCompleted: true,
        }
      },
      create: {
        id: demoOrgId,
        name: 'Causarix Sovereign Enterprise Demo',
        description: 'Causarix Sovereign Enterprise Intelligence Suite Demo',
        settings: {
          plan: 'ENTERPRISE',
          tier: 'MAX',
          unlockedFeatures: ['boardroom', 'redline', 'digital_twin', 'graph', 'mcp', 'proposals'],
          dailyCredits: 10000,
          onboardingCompleted: true,
        }
      }
    });

    // 2. Ensure Demo User exists with OWNER / MAX role
    let demoUser = await prisma.user.findFirst({
      where: { OR: [{ id: demoUserId }, { email: 'admin@apex-global.com' }] }
    });

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          id: demoUserId,
          email: 'admin@apex-global.com',
          name: 'Demo Administrator (Executive)',
          organizationId: demoOrgId,
          role: 'OWNER'
        }
      });
    } else {
      await prisma.user.update({
        where: { id: demoUser.id },
        data: { 
          organizationId: demoOrgId,
          role: 'OWNER'
        }
      });
    }

    // 3. Seed Demo Documents if missing
    const existingDocsCount = await prisma.document.count({
      where: { organizationId: demoOrgId, isDeleted: false }
    });

    if (existingDocsCount === 0) {
      // Document 1: Hotel Operations SOP
      const doc1 = await prisma.document.create({
        data: {
          id: 'demo-vendor-contract',
          name: 'Apex_Hotels_India_Q3_Operations_SOP.pdf',
          organizationId: demoOrgId,
          ownerId: demoUserId,
          mimeType: 'application/pdf',
          sizeBytes: 4800000,
          scanStatus: 'CLEAN'
        }
      });

      await prisma.processedDocument.create({
        data: {
          documentId: doc1.id,
          organizationId: demoOrgId,
          pageCount: 8,
          detectedType: 'PDF',
          textContent: `APEX GLOBAL HOSPITALITY & HOTEL OPERATIONS SOP 2026
Page 1: General Operating Guidelines & Exclusivity Terms.
Section 1.1: Standard Operating Procedures for 3 Hotel Properties in Mumbai, Delhi, and Jaipur.
Section 4.2: F&B Vendor Supply Terms and Exclusivity Clauses with Royal Agri Supplies.
Section 8.4: Indemnification and Price Escalation Clause. Vendor guarantees fixed pricing unless written notice is given 45 days prior to Nov 1.`
        }
      });

      await prisma.documentChunk.createMany({
        data: [
          {
            documentId: doc1.id,
            organizationId: demoOrgId,
            pageNumber: 1,
            section: 'General Operating Guidelines',
            text: 'Apex Global Hospitality SOP for 3 luxury hotel properties in Mumbai, Delhi, and Jaipur. Operating standard 104 requires monthly HVAC maintenance.'
          },
          {
            documentId: doc1.id,
            organizationId: demoOrgId,
            pageNumber: 4,
            section: 'F&B Procurement & Exclusivity',
            text: 'Section 4.2: F&B Vendor Supply Terms and Exclusivity Clauses with Royal Agri Supplies. Vendor provides exclusive organic produce.'
          },
          {
            documentId: doc1.id,
            organizationId: demoOrgId,
            pageNumber: 8,
            section: 'Indemnification & Price Escalation',
            text: 'Section 8.4: Indemnification Clause. Vendor agrees to indemnify and hold harmless Apex Global against operational losses, provided notice is served 45 days prior to auto-renewal date Oct 15.'
          }
        ]
      });

      // Document 2: Employee Handbook & HR Policy
      const doc2 = await prisma.document.create({
        data: {
          id: 'demo-hr-handbook',
          name: 'Employee_Handbook_HR_Policy_2026.pdf',
          organizationId: demoOrgId,
          ownerId: demoUserId,
          mimeType: 'application/pdf',
          sizeBytes: 3100000,
          scanStatus: 'CLEAN'
        }
      });

      await prisma.processedDocument.create({
        data: {
          documentId: doc2.id,
          organizationId: demoOrgId,
          pageCount: 5,
          detectedType: 'PDF',
          textContent: `EMPLOYEE HANDBOOK & HR POLICY 2026
Page 1: Code of Conduct, Hybrid Work Protocols, and Confidentiality.
Page 2: Cybersecurity & Zero-Trust Authentication. Use of unvetted public AI tools is strictly prohibited without CISO approval.`
        }
      });

      await prisma.documentChunk.createMany({
        data: [
          {
            documentId: doc2.id,
            organizationId: demoOrgId,
            pageNumber: 1,
            section: 'Code of Conduct',
            text: 'Employee Code of Conduct. Guidelines for workplace ethics and hybrid work protocols.'
          },
          {
            documentId: doc2.id,
            organizationId: demoOrgId,
            pageNumber: 2,
            section: 'Cybersecurity & Data Privacy',
            text: 'Strict Zero-Trust authentication requirements. Prohibition of unvetted public AI tools for enterprise document processing.'
          }
        ]
      });

      // Document 3: Market Intelligence Report
      const doc3 = await prisma.document.create({
        data: {
          id: 'demo-market-report',
          name: 'Market_Intelligence_Report_Q3.pdf',
          organizationId: demoOrgId,
          ownerId: demoUserId,
          mimeType: 'application/pdf',
          sizeBytes: 3600000,
          scanStatus: 'CLEAN'
        }
      });

      await prisma.processedDocument.create({
        data: {
          documentId: doc3.id,
          organizationId: demoOrgId,
          pageCount: 6,
          detectedType: 'PDF',
          textContent: `APAC HOSPITALITY MARKET INTELLIGENCE & EXPANSION REPORT Q3 2026
Page 1: Industry Position, Competitor Benchmarks, and Financial Outlook.
Page 3: Risk Assessment for Jaipur and Delhi Hotel Property Renovations.`
        }
      });

      await prisma.documentChunk.createMany({
        data: [
          {
            documentId: doc3.id,
            organizationId: demoOrgId,
            pageNumber: 1,
            section: 'Industry Position',
            text: 'Market intelligence report for luxury hospitality properties in India. Revenue per available room (RevPAR) increased 12.4% in Q3.'
          },
          {
            documentId: doc3.id,
            organizationId: demoOrgId,
            pageNumber: 3,
            section: 'Renovation Risk Assessment',
            text: 'Risk assessment for Jaipur property HVAC modernization and F&B supply chain restructuring.'
          }
        ]
      });
    }

  } catch (seedErr) {
    console.warn('[GET /demo] Non-fatal seeding warning:', seedErr);
  }

  // 4. Set Session Cookie for instant zero-login access
  const sessionToken = `DEMO_SESSION_${demoUserId}`;
  cookieStore.set('synaps-session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  });

  // 5. Redirect to Dashboard with active demo session
  return NextResponse.redirect(new URL('/dashboard', req.url));
}

