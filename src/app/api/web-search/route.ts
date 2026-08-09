export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { generateTextWithAISDK } from '@/lib/ai-sdk-router';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export interface WebSource {
  title: string;
  url: string;
  snippet: string;
  favicon: string;
  domain: string;
}

export interface WebSearchResult {
  answer: string;
  sources: WebSource[];
  searchQuery: string;
  providerUsed?: string;
}

// ── DuckDuckGo Instant Answer API (free, no key required) ─────────────────────
async function fetchDuckDuckGoSources(query: string): Promise<WebSource[]> {
  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encoded}&format=json&no_html=1&skip_disambig=1`,
      { headers: { 'User-Agent': 'Synaps-AI/1.0' }, signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return [];
    const data = await res.json();

    const sources: WebSource[] = [];

    // RelatedTopics → source cards
    const topics: any[] = data.RelatedTopics || [];
    for (const t of topics.slice(0, 6)) {
      if (t.FirstURL && t.Text) {
        let domain = '';
        try { domain = new URL(t.FirstURL).hostname.replace('www.', ''); } catch {}
        sources.push({
          title: t.Text.split(' - ')[0]?.trim() || domain,
          url: t.FirstURL,
          snippet: t.Text.slice(0, 180),
          favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
          domain,
        });
      }
      // Nested topics
      if (t.Topics) {
        for (const sub of (t.Topics as any[]).slice(0, 3)) {
          if (sub.FirstURL && sub.Text) {
            let domain = '';
            try { domain = new URL(sub.FirstURL).hostname.replace('www.', ''); } catch {}
            sources.push({
              title: sub.Text.split(' - ')[0]?.trim() || domain,
              url: sub.FirstURL,
              snippet: sub.Text.slice(0, 180),
              favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
              domain,
            });
          }
        }
      }
    }

    // Infobox → Wikipedia-style abstract as a source
    if (data.AbstractURL && data.Abstract) {
      let domain = '';
      try { domain = new URL(data.AbstractURL).hostname.replace('www.', ''); } catch {}
      sources.unshift({
        title: data.Heading || data.AbstractSource || domain,
        url: data.AbstractURL,
        snippet: data.Abstract.slice(0, 240),
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        domain,
      });
    }

    return sources.slice(0, 6);
  } catch (e) {
    console.warn('[WEB-SEARCH] DuckDuckGo fetch error:', e);
    return [];
  }
}

// ── Fallback: Brave Search API (if BRAVE_SEARCH_API_KEY is set) ───────────────
async function fetchBraveSources(query: string): Promise<WebSource[]> {
  const key = process.env.BRAVE_SEARCH_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=6`,
      {
        headers: { 'X-Subscription-Token': key, 'Accept': 'application/json' },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.web?.results || []).slice(0, 6).map((r: any) => {
      let domain = '';
      try { domain = new URL(r.url).hostname.replace('www.', ''); } catch {}
      return {
        title: r.title || domain,
        url: r.url,
        snippet: r.description || '',
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        domain,
      };
    });
  } catch (e) {
    console.warn('[WEB-SEARCH] Brave fetch error:', e);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('synaps-session')?.value;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { query } = await req.json();
    if (!query?.trim()) return NextResponse.json({ error: 'Query required' }, { status: 400 });

    // Deduct AI credits for Web Search (2 credits)
    let userRole = 'MEMBER';
    try {
      const prisma = (await import('@/lib/prisma')).default;
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.uid },
        select: { role: true }
      });
      if (dbUser?.role) userRole = dbUser.role;
    } catch (e) {}

    const { checkAndConsumeAiCredits } = await import('@/lib/ai-credit-limiter');
    const creditCheck = await checkAndConsumeAiCredits(decoded.uid, userRole, 2);

    if (!creditCheck.success) {
      return NextResponse.json({
        answer: creditCheck.error || 'Daily AI credit limit reached.',
        sources: [],
        searchQuery: query,
        credits: { remaining: 0, creditLimit: creditCheck.creditLimit, creditsUsed: creditCheck.creditsUsed }
      }, { status: 429 });
    }

    const creditsPayload = {
      remaining: creditCheck.remaining,
      creditLimit: creditCheck.creditLimit,
      creditsUsed: creditCheck.creditsUsed,
      role: userRole
    };

    // Step 1 — Fetch live web sources (Brave preferred, DuckDuckGo fallback)
    let sources = await fetchBraveSources(query);
    if (sources.length === 0) {
      sources = await fetchDuckDuckGoSources(query);
    }

    // Step 2 — Synthesise with whatever LLM is available (uses the app's existing failover router)
    const sourceContext = sources.length > 0
      ? sources.map((s, i) =>
          `[Source ${i + 1}] ${s.title}\nURL: ${s.url}\nSnippet: ${s.snippet}`
        ).join('\n\n')
      : 'No external web sources retrieved. Answer from general knowledge.';

    const systemPrompt = `You are Synaps AI, an expert research assistant. 
A user has asked a question and you have been given live web search results as context.
Synthesise a clear, accurate, well-structured answer based on the sources provided.
Be concise and direct. If sources are limited, still answer helpfully from knowledge.
Do not mention "DuckDuckGo" or API details.`;

    const userPrompt = `User question: ${query}

Live web search results:
${sourceContext}

Provide a clear, structured answer based on these results.`;

    let answer = '';
    let providerUsed = 'unknown';
    try {
      const result = await generateTextWithAISDK({
        system: systemPrompt,
        prompt: userPrompt,
      });
      answer = result.text;
      providerUsed = result.providerUsed;
    } catch (llmErr: any) {
      // If all LLMs fail too, return sources alone with a note
      answer = sources.length > 0
        ? `Here are the top web results for "${query}":\n\n` +
          sources.map((s, i) => `${i + 1}. **${s.title}** — ${s.snippet}`).join('\n\n')
        : `Unable to complete web search for "${query}" at this time. Please try rephrasing or try again shortly.`;
    }

    return NextResponse.json({
      answer,
      sources,
      searchQuery: query,
      providerUsed,
      credits: creditsPayload
    });

  } catch (error: any) {
    console.error('[WEB-SEARCH] Fatal error:', error);
    return NextResponse.json({
      answer: 'Web search is temporarily unavailable. Please try your question in document mode.',
      sources: [],
      searchQuery: '',
    }, { status: 200 });
  }
}
