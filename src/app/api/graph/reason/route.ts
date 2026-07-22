export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { invokeLLMWithFallback } from '@/lib/llm-router';

function parseSafeJson(content: string) {
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return { answer: content, relationshipPaths: [], confidenceScore: 85 };
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true }
    });

    const organizationId = dbUser?.organizationId;
    if (!organizationId) return NextResponse.json({ success: false, error: 'User must belong to an organization' }, { status: 403 });

    const { query } = await req.json();
    if (!query) return NextResponse.json({ success: false, error: 'Query parameter is required' }, { status: 400 });

    // 1. Fetch Graph Entities & Relationships
    const entities = await prisma.graphEntity.findMany({
      where: { organizationId },
      include: { document: { select: { name: true } } }
    });

    const relationships = await prisma.graphRelationship.findMany({
      where: { organizationId },
      include: {
        sourceEntity: { select: { name: true, type: true } },
        targetEntity: { select: { name: true, type: true } }
      }
    });

    if (entities.length === 0) {
      return NextResponse.json({
        success: true,
        answer: "No knowledge graph nodes have been created yet. Please upload documents to build your Enterprise Memory Graph.",
        relationshipPaths: [],
        confidenceScore: 0,
        sources: []
      });
    }

    // Format Knowledge Graph context string
    const entityContext = entities.map(e => 
      `• Node [${e.type}]: ${e.name} — ${e.description || 'No description'} (Source Doc: ${e.document?.name || 'N/A'})`
    ).join('\n');

    const relContext = relationships.map(r => 
      `• Relationship: "${r.sourceEntity.name}" [${r.sourceEntity.type}] --(${r.relationType})--> "${r.targetEntity.name}" [${r.targetEntity.type}] | Evidence: ${r.evidence || r.description}`
    ).join('\n');

    const systemInstruction = `You are the Enterprise Memory Graph Reasoning Engine for Synaps.
Instead of querying isolated documents, you possess a connected Knowledge Graph of the organization.

Use the provided Knowledge Graph Nodes and Relationships to reason across connections and answer the user query.

YOU MUST OUTPUT VALID JSON with the following keys:
- "answer": Markdown formatted response explaining the answer based on graph reasoning.
- "relationshipPaths": Array of strings representing the relationship traversal paths used (e.g. ["Employee John Smith -> BELONGS_TO -> Engineering Dept -> HAS_BUDGET -> Q3 Project"]).
- "confidenceScore": Integer between 0 and 100.
- "sources": Array of cited entity or document names.

CONNECTED KNOWLEDGE GRAPH ENTITIES:
${entityContext}

CONNECTED RELATIONSHIPS:
${relContext}`;

    const rawResponse = await invokeLLMWithFallback([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: `USER QUERY: ${query}` }
    ], { response_format: { type: 'json_object' } });

    const result = parseSafeJson(rawResponse);

    return NextResponse.json({
      success: true,
      answer: result.answer,
      relationshipPaths: result.relationshipPaths || [],
      confidenceScore: result.confidenceScore || 90,
      sources: result.sources || []
    });

  } catch (error: any) {
    console.error("POST /api/graph/reason error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
