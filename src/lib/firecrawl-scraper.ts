import https from "https";
import http from "http";

export interface ScrapeResult {
  url: string;
  title: string;
  description: string;
  markdown: string;
  sizeBytes: number;
  wordCount: number;
  extractedLinks: string[];
}

export function cleanHtmlToMarkdown(html: string, baseUrl: string): { title: string; description: string; markdown: string; links: string[] } {
  let title = "Web Document";
  let description = "";
  const links: string[] = [];

  // 1. Extract Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  }

  // 2. Extract Meta Description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch && descMatch[1]) {
    description = descMatch[1].trim();
  }

  // 3. Remove non-content tags
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "");

  // 4. Extract external/internal links
  const linkMatches = cleaned.matchAll(/<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi);
  for (const m of linkMatches) {
    const href = m[1];
    if (href && !href.startsWith("javascript:") && !href.startsWith("#")) {
      try {
        const fullUrl = new URL(href, baseUrl).href;
        if (!links.includes(fullUrl) && links.length < 20) {
          links.push(fullUrl);
        }
      } catch (_) {}
    }
  }

  // 5. Convert Headings to Markdown
  cleaned = cleaned.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n\n# $1\n\n");
  cleaned = cleaned.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n");
  cleaned = cleaned.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n");
  cleaned = cleaned.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n\n#### $1\n\n");
  cleaned = cleaned.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n\n##### $1\n\n");
  cleaned = cleaned.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n\n###### $1\n\n");

  // 6. Convert Paragraphs & Line Breaks
  cleaned = cleaned.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n\n$1\n\n");
  cleaned = cleaned.replace(/<br\s*\/?>/gi, "\n");
  cleaned = cleaned.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");

  // 7. Convert Lists
  cleaned = cleaned.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n* $1");
  cleaned = cleaned.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, "\n$1\n");
  cleaned = cleaned.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, "\n$1\n");

  // 8. Convert Bold & Italic
  cleaned = cleaned.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, "**$1**");
  cleaned = cleaned.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, "*$1*");
  cleaned = cleaned.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");
  cleaned = cleaned.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n");

  // 9. Convert Blockquotes
  cleaned = cleaned.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "\n> $1\n");

  // 10. Strip remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  // 11. Decode common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // 12. Collapse excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();

  // Prefix with metadata header
  const header = `---
title: "${title}"
source_url: "${baseUrl}"
ingested_at: "${new Date().toISOString()}"
engine: "Causarix Firecrawl Scraper"
---

# ${title}

${description ? `> **Summary**: ${description}\n\n` : ""}
`;

  return {
    title,
    description,
    markdown: header + cleaned,
    links
  };
}

function fetchHttpRaw(targetUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const isHttps = parsed.protocol === "https:";
    const client = isHttps ? https : http;

    const req = client.get(
      parsed.href,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 (Causarix Scraper)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9"
        },
        rejectUnauthorized: false // Allow self-signed or enterprise proxy certs
      },
      (res) => {
        // Follow redirects
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, targetUrl).href;
          return fetchHttpRaw(redirectUrl).then(resolve).catch(reject);
        }

        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          return reject(new Error(`HTTP ${res.statusCode} ${res.statusMessage}`));
        }

        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );

    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error("Request timed out after 15 seconds"));
    });
  });
}

export async function scrapeUrlToMarkdown(targetUrl: string): Promise<ScrapeResult> {
  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol. Only http:// and https:// are supported.");
    }
  } catch (err: any) {
    throw new Error("Invalid URL format: " + err.message);
  }

  const html = await fetchHttpRaw(parsedUrl.href);
  const { title, description, markdown, links } = cleanHtmlToMarkdown(html, parsedUrl.href);

  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const sizeBytes = Buffer.byteLength(markdown, "utf8");

  return {
    url: parsedUrl.href,
    title: title || parsedUrl.hostname,
    description,
    markdown,
    sizeBytes,
    wordCount,
    extractedLinks: links
  };
}
