import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getRateLimitKey,
  rateLimitResponse,
  readBodyWithLimit,
  resolveAuthContext,
  safeErrorResponse,
  validateScrapeUrl,
} from "@/lib/security";
import prisma from "@/lib/prisma";
import { scrapeUrlToMarkdown } from "@/lib/firecrawl-scraper";

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const auth = await resolveAuthContext(req);

  // ── Rate limit: max 10 scrapes per IP per minute ────────────────────────────
  const ip = getRateLimitKey(req);
  if (!checkRateLimit(`scrape:${ip}`, 10, 60_000)) {
    return rateLimitResponse(60);
  }

  // ── Read body with RUDY protection (4 KB max – just a URL) ─────────────────
  const { body, error: bodyError } = await readBodyWithLimit(req, 4 * 1024);
  if (bodyError || !body) {
    return NextResponse.json({ success: false, error: bodyError || "Invalid request body." }, { status: 400 });
  }

  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ success: false, error: "A valid URL is required." }, { status: 400 });
  }

  // ── URL Sanitization: block SSRF, localhost, internal networks ──────────────
  const urlCheck = validateScrapeUrl(url);
  if (!urlCheck.valid) {
    return NextResponse.json({ success: false, error: urlCheck.error }, { status: 400 });
  }

  try {
    // 1. Scrape real URL to Clean Markdown
    const scrapeResult = await scrapeUrlToMarkdown(urlCheck.cleanUrl!);

    // 2. Format a clean document name
    let cleanHostname = "";
    try {
      cleanHostname = new URL(scrapeResult.url).hostname.replace(/^www\./, "");
    } catch (_) {
      cleanHostname = "web_document";
    }

    const docName = `[Web] ${scrapeResult.title.slice(0, 45)} (${cleanHostname}).md`;

    // 3. Create Document Record in DB
    const doc = await prisma.document.create({
      data: {
        name: docName,
        organizationId: auth.orgId,
        ownerId: auth.userId,
        mimeType: "text/markdown",
        sizeBytes: scrapeResult.sizeBytes,
        scanStatus: "CLEAN",
      },
    });

    // 4. Create ProcessedDocument Record
    const pageCount = Math.max(1, Math.ceil(scrapeResult.wordCount / 350));
    await prisma.processedDocument.create({
      data: {
        documentId: doc.id,
        organizationId: auth.orgId,
        pageCount,
        detectedType: "WEB_CRAWL",
        textContent: scrapeResult.markdown,
      },
    });

    // 5. Chunk and Index into DocumentChunks for Instant RAG
    const chunkSize = 1200;
    const text = scrapeResult.markdown;
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    for (let i = 0; i < chunks.length; i++) {
      await prisma.documentChunk.create({
        data: {
          documentId: doc.id,
          pageNumber: Math.floor(i / 2) + 1,
          section: `Web Scrape Chunk ${i + 1}`,
          text: chunks[i],
          positionIdx: i,
          tokenCount: Math.ceil(chunks[i].length / 4),
          organizationId: auth.orgId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      document: doc,
      scrapeResult: {
        url: scrapeResult.url,
        title: scrapeResult.title,
        wordCount: scrapeResult.wordCount,
        sizeBytes: scrapeResult.sizeBytes,
        pagesCreated: pageCount,
        chunksIndexed: chunks.length,
      },
    });
  } catch (err: any) {
    console.error("[Web Scrape Error]:", err);
    return safeErrorResponse(err, "Failed to scrape and index web document.");
  }
}
