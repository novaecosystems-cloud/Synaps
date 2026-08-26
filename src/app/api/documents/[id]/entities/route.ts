export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

/**
 * GET /api/documents/[id]/entities
 * Phase 1 — Extract named entities from a document's text.
 * 
 * Returns people, organizations, locations, dates, monetary values,
 * key clauses, and table-of-contents headings discovered in the document.
 * 
 * Uses AI extraction if the document has been processed; 
 * falls back to regex-based extraction from chunks.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;

    let organizationId: string | null = null;
    if (sessionCookie) {
      try {
        const decoded = await verifySessionCookie(sessionCookie);
        if (decoded?.uid) {
          const dbUser = await prisma.user.findUnique({
            where: { id: decoded.uid },
            select: { organizationId: true }
          });
          organizationId = dbUser?.organizationId || null;
        }
      } catch (_) {}
    }

    const { id: documentId } = await params;

    // Verify document access
    const doc = await prisma.document.findFirst({
      where: {
        id: documentId,
        isDeleted: false,
        ...(organizationId ? { organizationId } : {})
      },
      select: {
        id: true,
        name: true,
        mimeType: true,
        processedDoc: {
          select: { textContent: true, pageCount: true, detectedType: true }
        }
      }
    });

    if (!doc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    // Get section headings from chunk metadata
    const chunks = await prisma.documentChunk.findMany({
      where: { documentId },
      select: {
        id: true,
        text: true,
        pageNumber: true,
        section: true,
        chunkType: true,
        positionIdx: true
      },
      orderBy: [{ pageNumber: 'asc' }, { positionIdx: 'asc' }]
    });

    const fullText = doc.processedDoc?.textContent || chunks.map(c => c.text).join('\n\n');
    const pageCount = doc.processedDoc?.pageCount || 1;

    // --- Regex-based entity extraction (fast, no LLM cost) ---
    const entities = extractEntities(fullText);
    
    // --- Table of Contents: sections from chunks ---
    const tableOfContents: Array<{ title: string; pageNumber: number; chunkId: string }> = [];
    const seenSections = new Set<string>();
    for (const chunk of chunks) {
      if (chunk.section && chunk.section !== 'General' && !seenSections.has(chunk.section)) {
        seenSections.add(chunk.section);
        tableOfContents.push({
          title: chunk.section,
          pageNumber: chunk.pageNumber || 1,
          chunkId: chunk.id
        });
      }
    }

    // --- Table chunks ---
    const tableChunks = chunks.filter(c => c.chunkType === 'TABLE').map(c => ({
      id: c.id,
      pageNumber: c.pageNumber || 1,
      preview: c.text.substring(0, 200)
    }));

    // --- Header chunks ---
    const headerChunks = chunks.filter(c => c.chunkType === 'HEADER').map(c => ({
      id: c.id,
      pageNumber: c.pageNumber || 1,
      text: c.text
    }));

    return NextResponse.json({
      success: true,
      documentId,
      documentName: doc.name,
      detectedType: doc.processedDoc?.detectedType || 'Unknown',
      pageCount,
      entities,
      tableOfContents,
      tables: tableChunks,
      headers: headerChunks,
      stats: {
        totalChunks: chunks.length,
        totalCharacters: fullText.length,
        estimatedReadingTime: Math.ceil(fullText.split(' ').length / 250) // ~250 wpm
      }
    });

  } catch (error: any) {
    console.error('Document entities error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

interface DocumentEntities {
  people: Array<{ name: string; count: number; pages: number[] }>;
  organizations: Array<{ name: string; count: number; pages: number[] }>;
  locations: Array<{ name: string; count: number; pages: number[] }>;
  dates: Array<{ value: string; count: number }>;
  monetary: Array<{ value: string; count: number }>;
  emails: string[];
  percentages: string[];
  keyTerms: Array<{ term: string; count: number }>;
}

/**
 * Extract named entities using pattern matching
 */
function extractEntities(text: string): DocumentEntities {
  // People: "Mr./Mrs./Dr. Name" or "Name, Title"
  const peopleRegex = /\b(?:Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|CEO|CFO|COO|CTO|Director|Manager|President|Chairman)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
  const people = extractWithCount(text, peopleRegex, 1);

  // Organizations: words followed by Inc/Ltd/LLC/Corp/Group/Co
  const orgRegex = /\b([A-Z][A-Za-z\s&'-]{2,40}(?:\s+(?:Inc|Ltd|LLC|Corp|Group|Co|Company|Holdings|International|Global|Solutions|Services|Technologies|Ventures|Capital|Partners|Enterprises|Associates)\.?))\b/g;
  const organizations = extractWithCount(text, orgRegex, 1, 5);

  // Locations: City, State/Country patterns
  const locationRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s+(?:[A-Z]{2}|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
  const locations = extractWithCount(text, locationRegex, 0);

  // Dates
  const dateRegex = /\b(?:\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi;
  const dateMatches = [...new Set((text.match(dateRegex) || []))].slice(0, 20);
  const dates = dateMatches.map(v => ({ value: v, count: (text.match(new RegExp(escapeRegex(v), 'gi')) || []).length }));

  // Monetary values
  const moneyRegex = /(?:USD|INR|EUR|GBP|₹|\$|€|£)\s*[\d,]+(?:\.\d{2})?(?:\s*(?:million|billion|crore|lakh|thousand|M|B|K))?/gi;
  const moneyMatches = [...new Set((text.match(moneyRegex) || []))].slice(0, 20);
  const monetary = moneyMatches.map(v => ({ value: v, count: (text.match(new RegExp(escapeRegex(v), 'gi')) || []).length }));

  // Emails
  const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
  const emails = [...new Set((text.match(emailRegex) || []))].slice(0, 20);

  // Percentages
  const pctRegex = /\b\d+(?:\.\d+)?%\b/g;
  const percentages = [...new Set((text.match(pctRegex) || []))].slice(0, 20);

  // Key legal/business terms (high value terms)
  const keyTermPatterns = [
    'indemnification', 'indemnify', 'liability', 'warranty', 'guarantee',
    'confidentiality', 'non-disclosure', 'intellectual property', 'termination',
    'force majeure', 'arbitration', 'jurisdiction', 'governing law',
    'liquidated damages', 'penalty', 'SLA', 'service level', 'deliverable',
    'milestone', 'payment terms', 'net 30', 'net 60', 'advance', 'deposit',
    'escrow', 'royalty', 'license', 'assignment', 'amendment', 'addendum',
    'breach', 'default', 'cure period', 'notice period', 'renewal', 'auto-renewal',
    'most favored nation', 'exclusivity', 'non-compete', 'non-solicitation'
  ];
  
  const keyTerms = keyTermPatterns
    .map(term => {
      const count = (text.match(new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi')) || []).length;
      return { term, count };
    })
    .filter(t => t.count > 0)
    .sort((a, b) => b.count - a.count);

  return { people, organizations, locations, dates, monetary, emails, percentages, keyTerms };
}

function extractWithCount(
  text: string,
  regex: RegExp,
  groupIndex: number,
  minLength = 3
): Array<{ name: string; count: number; pages: number[] }> {
  const counts: Record<string, number> = {};
  let match;
  regex.lastIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    const name = (match[groupIndex] || '').trim();
    if (name.length >= minLength && name.length < 80) {
      counts[name] = (counts[name] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, count]) => ({ name, count, pages: [] }));
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
