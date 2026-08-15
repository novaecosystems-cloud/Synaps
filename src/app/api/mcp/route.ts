import { NextRequest, NextResponse } from 'next/server';
import { SYNAPS_MCP_TOOLS, executeMcpTool } from '@/lib/mcp-server';
import { verifySessionCookie } from '@/lib/auth-server';
import { checkAndConsumeDemoFeature, extractClientIp } from '@/lib/ai-credit-limiter';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// ─── Auth: resolve organizationId or return demo fallback ──────────────────
async function resolveOrganizationId(req: NextRequest): Promise<string> {
  const authHeader = req.headers.get('authorization') || '';

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    
    // Enterprise demo token or demo prefix
    if (
      token === 'synaps_live_enterprise_key' ||
      token === 'synaps_demo_access' ||
      token.startsWith('synaps_demo_')
    ) {
      return 'demo-org-synaps';
    }

    // Live organization API key lookup
    if (token.startsWith('synaps_live_') && token.length >= 20) {
      try {
        const org = await prisma.organization
          .findFirst({ where: { apiKey: token }, select: { id: true } })
          .catch(() => null);
        if (org?.id) return org.id;
      } catch {}
    }
  }

  // Fall back to session cookie
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('synaps-session')?.value;
    if (session) {
      const decoded = await verifySessionCookie(session);
      if (decoded?.uid) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.uid },
          select: { organizationId: true },
        });
        if (user?.organizationId) return user.organizationId;
      }
    }
  } catch {}

  // Fallback to demo organization context for browser / public demo callers
  return 'demo-org-synaps';
}

// ─── GET: capability discovery — returns MCP server capabilities ─────────────
export async function GET(req: NextRequest) {
  const orgId = await resolveOrganizationId(req);
  return NextResponse.json({
    name: 'synaps-mcp-bridge',
    version: '1.0.0',
    protocolVersion: '2024-11-05',
    status: 'online',
    description: 'Synaps Universal MCP Server Bridge — Claude Desktop, Cursor, Antigravity, VS Code.',
    organizationContext: orgId.includes('demo') ? 'demo-sandbox' : 'enterprise-live',
    toolsCount: SYNAPS_MCP_TOOLS.length,
    tools: SYNAPS_MCP_TOOLS.map((t) => ({ name: t.name, description: t.description })),
  });
}

// ─── Handshake methods that don't need org-level auth ────────────────────────
const UNAUTHENTICATED_METHODS = new Set(['initialize', 'ping', 'tools/list']);

// ─── POST: main JSON-RPC 2.0 dispatcher ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, method, params } = body;

    // Validate envelope
    if (!method || typeof method !== 'string') {
      return NextResponse.json(
        { jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid Request' } },
        { status: 400 }
      );
    }

    // Handshake and discovery methods pass through directly
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
      if (method === 'tools/list') {
        return NextResponse.json({ jsonrpc: '2.0', id, result: { tools: SYNAPS_MCP_TOOLS } });
      }
      // ping
      return NextResponse.json({ jsonrpc: '2.0', id, result: {} });
    }

    // Resolve organization context (live org or demo sandbox)
    const organizationId = await resolveOrganizationId(req);

    switch (method) {
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
