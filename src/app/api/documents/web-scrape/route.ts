import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { scrapeUrlToMarkdown } from "@/lib/firecrawl-scraper";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("synaps-session")?.value;

    let userId = "demo-user";
    let orgId = "no_org_fallback";

    if (session && !session.startsWith("TEST_TOKEN_")) {
      const decoded = await verifySessionCookie(session);
      if (decoded?.uid) {
        userId = decoded.uid;
        const u = await prisma.user.findUnique({ where: { id: userId } });
        if (u?.organizationId) {
          orgId = u.organizationId;
        }
      }
    }

    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "A valid URL is required." }, { status: 400 });
    }

    // 1. Scrape real URL to Clean Markdown
    const scrapeResult = await scrapeUrlToMarkdown(url.trim());

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
        organizationId: orgId,
        ownerId: userId,
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
        organizationId: orgId,
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
          organizationId: orgId,
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
    return NextResponse.json({ success: false, error: err.message || "Failed to scrape and index web document." }, { status: 500 });
  }
}
