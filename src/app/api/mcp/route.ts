import { NextRequest, NextResponse } from 'next/server';
import { SYNAPS_MCP_TOOLS, executeMcpTool } from '@/lib/mcp-server';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
  return NextResponse.json({
    name: 'synaps-mcp-bridge',
    version: '1.0.0',
    protocolVersion: '2024-11-05',
    status: 'online',
    description: 'Synaps Universal MCP Server Bridge for Claude Desktop, Cursor, Antigravity, and external AI agents.',
    toolsCount: SYNAPS_MCP_TOOLS.length,
    tools: SYNAPS_MCP_TOOLS.map((t) => ({ name: t.name, description: t.description })),
  });
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate via Bearer token or session cookie
    const authHeader = req.headers.get('authorization') || '';
    let organizationId = 'demo_apex_org_id';

    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      if (token && token.length > 5 && token !== 'test') {
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [{ id: token }, { email: token }],
            },
            select: { organizationId: true },
          });
          if (user?.organizationId) organizationId = user.organizationId;
        } catch {}
      }
    } else {
      const cookieStore = await cookies();
      const session = cookieStore.get('synaps-session')?.value;
      if (session) {
        try {
          const decoded = await verifySessionCookie(session);
          if (decoded?.uid) {
            const user = await prisma.user.findUnique({
              where: { id: decoded.uid },
              select: { organizationId: true },
            });
            if (user?.organizationId) organizationId = user.organizationId;
          }
        } catch {}
      }
    }

    const body = await req.json();
    const { jsonrpc = '2.0', id, method, params } = body;

    // Handle MCP Methods
    switch (method) {
      case 'initialize': {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: 'synaps-mcp-server',
              version: '1.0.0',
            },
          },
        });
      }

      case 'tools/list': {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            tools: SYNAPS_MCP_TOOLS,
          },
        });
      }

      case 'tools/call': {
        const { name, arguments: args = {} } = params || {};
        if (!name) {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: 'Missing tool name parameter' },
          });
        }

        const executionResult = await executeMcpTool(name, args, organizationId);

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: executionResult,
        });
      }

      case 'ping': {
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {},
        });
      }

      default:
        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        });
    }
  } catch (error: any) {
    console.error('MCP Server Route Error:', error);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: { code: -32603, message: `Internal server error: ${error.message}` },
      },
      { status: 500 }
    );
  }
}
