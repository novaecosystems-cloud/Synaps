export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { agentWebSearch, agentReadWebPage, agentDiscoverContacts } from '@/lib/agent-reach';
import { requireAuth } from '@/lib/api-security';

export async function POST(req: NextRequest) {
  const _auth = await requireAuth(req);
  if (_auth instanceof NextResponse) return _auth;
  try {
    const { action, query, url, domain, maxResults } = await req.json();

    if (action === 'search' || action === 'web_search') {
      if (!query || typeof query !== 'string') {
        return NextResponse.json({ error: 'Search query is required.' }, { status: 400 });
      }
      const results = await agentWebSearch(query, maxResults || 5);
      return NextResponse.json({
        success: true,
        action: 'search',
        query,
        count: results.length,
        results
      });
    }

    if (action === 'read_page' || action === 'fetch_url') {
      if (!url || typeof url !== 'string') {
        return NextResponse.json({ error: 'Valid URL is required.' }, { status: 400 });
      }
      const page = await agentReadWebPage(url);
      return NextResponse.json({
        success: true,
        action: 'read_page',
        data: page
      });
    }

    if (action === 'discover_contacts' || action === 'b2b_reach') {
      if (!domain || typeof domain !== 'string') {
        return NextResponse.json({ error: 'Company domain is required.' }, { status: 400 });
      }
      const contacts = await agentDiscoverContacts(domain);
      return NextResponse.json({
        success: true,
        action: 'discover_contacts',
        data: contacts
      });
    }

    return NextResponse.json({
      error: 'Invalid action. Supported actions: search, read_page, discover_contacts.'
    }, { status: 400 });

  } catch (error: any) {
    console.error('POST /api/agents/reach error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to execute AgentReach web connector action.'
    }, { status: 500 });
  }
}
