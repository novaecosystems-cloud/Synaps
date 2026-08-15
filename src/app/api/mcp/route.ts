import { NextRequest, NextResponse } from 'next/server';
import { SYNAPS_MCP_TOOLS, executeMcpTool } from '@/lib/mcp-server';
import { verifySessionCookie } from '@/lib/auth-server';
import { checkAndConsumeDemoFeature, extractClientIp } from '@/lib/ai-credit-limiter';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// ─── Auth: resolve organizationId or return null (never throws) ──────────────
async function resolveOrganizationId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization') || '';

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    // Only accept properly prefixed Synaps API keys
    if (!token.startsWith('synaps_live_') || token.length < 20) return null;

    try {
      const org = await prisma.organization
        .findFirst({ where: { apiKey: token }, select: { id: true } })
        .catch(() => null);
      return org?.id ?? null;
    } catch {
      return null;
    }
  }

  // Fall back to session cookie
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (!session) return null;
    const decoded = await verifySessionCookie(session);
    if (!decoded?.uid) return null;
    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { organizationId: true },
    });
    return user?.organizationId ?? null;
  } catch {
    return null;
  }
}

// ─── GET: capability discovery — requires valid auth ─────────────────────────
export async function GET(req: NextRequest) {
  const orgId = await resolveOrganizationId(req);
  if (!orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    name: 'synaps-mcp-bridge',
    version: '1.0.0',
    protocolVersion: '2024-11-05',
    status: 'online',
    description: 'Synaps Universal MCP Server Bridge — Claude Desktop, Cursor, Antigravity, VS Code.',
    toolsCount: SYNAPS_MCP_TOOLS.length,
    tools: SYNAPS_MCP_TOOLS.map((t) => ({ name: t.name, description: t.description })),
  });
}

// ─── Handshake methods that don't need org-level auth ────────────────────────
const UNAUTHENTICATED_METHODS = new Set(['initialize', 'ping']);

// ─── POST: main JSON-RPC 2.0 dispatcher ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, method } = body;

    // Validate envelope
    if (!method || typeof method !== 'string') {
      return NextResponse.json(
        { jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid Request' } },
        { status: 400 }
      );
    }

    // Handshake methods pass through without auth
    if (UNAUTHENTICATED_METHODS.has(method)) {
      if (method === 'initialize') {
        return NextResponse.json({
          jsonrpc: '2.0', id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'synaps-mcp-server', version: '1.0.0' },
          },
        });
      }
      // ping
      return NextResponse.json({ jsonrpc: '2.0', id, result: {} });
    }

    // All other methods require a valid organizationId
    const organizationId = await resolveOrganizationId(req);
    if (!organizationId) {
      return NextResponse.json(
        { jsonrpc: '2.0', id, error: { code: -32001, message: 'Unauthorized — valid synaps_live_ API key or session required' } },
        { status: 401 }
      );
    }

    // ─── Authenticated method dispatch ────────────────────────────────────
    const { params } = body;

    switch (method) {
      case 'tools/list':
        return NextResponse.json({ jsonrpc: '2.0', id, result: { tools: SYNAPS_MCP_TOOLS } });

      case 'tools/call': {
        const { name, arguments: args = {} } = params || {};

        // Validate tool name is present and whitelisted
        if (!name || typeof name !== 'string') {
          return NextResponse.json(
            { jsonrpc: '2.0', id, error: { code: -32602, message: 'Missing or invalid tool name' } },
            { status: 400 }
          );
        }
        const validToolNames = SYNAPS_MCP_TOOLS.map((t) => t.name);
        if (!validToolNames.includes(name)) {
          return NextResponse.json(
            { jsonrpc: '2.0', id, error: { code: -32602, message: `Unknown tool: ${name}` } },
            { status: 400 }
          );
        }

        // Demo Quota Enforcement (2 uses limit per IP address on demo sessions)
        if (organizationId.includes('demo')) {
          const clientIp = extractClientIp(req.headers);
          const demoCheck = checkAndConsumeDemoFeature(organizationId, 'mcp_tool_execution', clientIp);
          if (!demoCheck.allowed) {
            return NextResponse.json({
              jsonrpc: '2.0',
              id,
              error: {
                code: -32002,
                message: demoCheck.error || 'Demo IP limit reached: 2 free executions completed for MCP tools. Upgrade to Pro/Max for unlimited executions.'
              }
            }, { status: 429 });
          }
        }

        // Sanitize all string args to prevent prompt injection via MCP
        const sanitizedArgs: Record<string, any> = {};
        for (const [k, v] of Object.entries(args as Record<string, any>)) {
          sanitizedArgs[k] = typeof v === 'string' ? v.slice(0, 2000) : v;
        }

        const executionResult = await executeMcpTool(name, sanitizedArgs, organizationId);
        return NextResponse.json({ jsonrpc: '2.0', id, result: executionResult });
      }

      default:
        return NextResponse.json(
          { jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } },
          { status: 404 }
        );
    }
  } catch (error: any) {
    console.error('[MCP] Route error:', error);
    // Never leak internal stack traces or messages to external callers
    return NextResponse.json(
      { jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
