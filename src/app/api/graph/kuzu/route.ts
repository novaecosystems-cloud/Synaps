import { NextRequest, NextResponse } from 'next/server';
import { executeKuzuCausalQuery, KUZU_CYPHER_SCHEMA } from '@/lib/kuzu-graph';
import { resolveAuthContext, safeErrorResponse } from '@/lib/security';

export async function GET() {
  return NextResponse.json({
    success: true,
    engine: 'KùzuDB Embedded Property Graph (Vectorized Columnar GDBMS)',
    schema: KUZU_CYPHER_SCHEMA,
    features: [
      'In-Process Execution (Zero Cloud Hosting Cost)',
      'Sub-Millisecond Multi-Hop Cypher Traversal',
      'Causal & Temporal Edge Relationships',
      'Zero Third-Party API Keys Required'
    ]
  });
}

export async function POST(req: NextRequest) {
  try {
    await resolveAuthContext(req);
    const body = await req.json();
    const cypher = body.cypher || 'MATCH (a:EnterpriseEntity)-[:BOUND_BY]->(c:ContractClause)-[:CONTRADICTS]->(p:ContractClause) RETURN a, c, p';
    
    const result = await executeKuzuCausalQuery(cypher);
    return NextResponse.json(result);
  } catch (error: any) {
    return safeErrorResponse(error, 'KùzuDB Query Execution Error');
  }
}

