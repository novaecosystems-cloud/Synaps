export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface WebSearchResult {
  answer: string;
  sources: {
    title: string;
    url: string;
    snippet: string;
    favicon: string;
    domain: string;
  }[];
  searchQuery: string;
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

    // Use Gemini with Google Search grounding — no extra API key needed
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      // @ts-ignore — google_search tool is available in v0.21+
      tools: [{ google_search: {} }],
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: query }] }],
    });

    const response = result.response;
    const answerText = response.text();

    // Extract grounding metadata (sources)
    // @ts-ignore
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    // @ts-ignore
    const groundingChunks: any[] = groundingMetadata?.groundingChunks || [];
    // @ts-ignore
    const searchEntryPoint = groundingMetadata?.searchEntryPoint?.renderedContent || '';

    const sources = groundingChunks
      .filter((c: any) => c.web?.uri)
      .map((c: any) => {
        const url = c.web.uri as string;
        let domain = '';
        try { domain = new URL(url).hostname.replace('www.', ''); } catch {}
        return {
          title: c.web.title || domain,
          url,
          snippet: c.web.snippet || '',
          favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
          domain,
        };
      });

    return NextResponse.json({
      answer: answerText,
      sources,
      searchQuery: query,
    } satisfies WebSearchResult);

  } catch (error: any) {
    console.error('[WEB-SEARCH] Error:', error);
    // Graceful fallback — return an empty sources list with error note
    return NextResponse.json({
      answer: `Web search encountered an issue: ${error.message}. Please try again or rephrase your query.`,
      sources: [],
      searchQuery: '',
    }, { status: 200 });
  }
}
