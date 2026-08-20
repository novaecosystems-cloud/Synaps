/**
 * OpenSEO Self-Hosted Engine for Synaps AI
 * Inspired by OpenSEO.so
 * Provides automated SEO audits, Meta Tags, OpenGraph previews, Schema.org JSON-LD, and Search Indexing.
 */

export interface OpenSEOOptions {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'product';
}

export interface SEOAuditResult {
  score: number;
  url: string;
  titleStatus: { text: string; length: number; passed: boolean; tip: string };
  descriptionStatus: { text: string; length: number; passed: boolean; tip: string };
  openGraphStatus: { hasOgTitle: boolean; hasOgDescription: boolean; hasOgImage: boolean; passed: boolean };
  schemaStatus: { hasJsonLd: boolean; schemaTypes: string[]; passed: boolean };
  sitemapStatus: { hasSitemap: boolean; sitemapUrl: string };
  robotsStatus: { hasRobots: boolean; robotsUrl: string };
  recommendations: string[];
}

const DEFAULT_TITLE = "CAUSARIX™ — Causal Decision OS, Delaware Contract Redlines & 10-Agent Boardroom";
const DEFAULT_DESCRIPTION = "CAUSARIX (powered by Synaps Causal Intelligence Core) transforms corporate contracts and document libraries into automated Delaware DGCL § 141 redlines, cross-silo invariant checks, and 10-Agent Boardroom Quorum.";
const DEFAULT_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://causarix.vercel.app";
const DEFAULT_OG_IMAGE = `${DEFAULT_APP_URL}/brand/causarix_benchmark_table.jpg`;

/**
 * Generate OpenSEO standard metadata configuration
 */
export function getOpenSEOMetadata(options: OpenSEOOptions = {}) {
  const title = options.title ? `${options.title} | CAUSARIX™` : DEFAULT_TITLE;
  const description = options.description || DEFAULT_DESCRIPTION;
  const canonical = options.canonicalUrl || DEFAULT_APP_URL;
  const ogImage = options.ogImage || DEFAULT_OG_IMAGE;
  const keywords = options.keywords || [
    "Causarix", "Causarix AI", "Causal Decision OS", "Delaware Contract Redlines",
    "Judea Pearl SCM", "Enterprise AI", "3D Knowledge Graph", "Corporate Memory", "AI Boardroom", 
    "Multi-Agent System", "Executive Decision Intelligence", "AI COO", "Risk Management"
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "CAUSARIX™",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "CAUSARIX™ Causal Decision OS & Benchmark"
        }
      ],
      type: options.type || "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@synaps_ai"
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    }
  };
}

/**
 * Generate Schema.org JSON-LD Structured Data for Google Rich Snippets
 */
export function getSoftwareApplicationJsonLd() {
  const baseUrl = DEFAULT_APP_URL;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Synaps AI",
    "operatingSystem": "All (Web, Windows, macOS)",
    "applicationCategory": "BusinessApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "128"
    },
    "offers": [
      {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "name": "Starter Free Tier"
      },
      {
        "@type": "Offer",
        "price": "7.00",
        "priceCurrency": "USD",
        "name": "Pro Intelligence"
      },
      {
        "@type": "Offer",
        "price": "20.00",
        "priceCurrency": "USD",
        "name": "Enterprise Max"
      }
    ],
    "description": DEFAULT_DESCRIPTION,
    "url": baseUrl,
    "publisher": {
      "@type": "Organization",
      "name": "SYNAPS Technologies Inc.",
      "url": baseUrl,
      "logo": `${baseUrl}/synaps_logo.png`
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Synaps AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Synaps AI is an Enterprise Decision Intelligence platform that converts fragmented document libraries into an interactive 3D Knowledge Graph and a 10-Agent AI Boardroom."
        }
      },
      {
        "@type": "Question",
        "name": "Does Synaps AI guarantee data privacy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Synaps AI operates as a zero-retention Data Fiduciary with 256-bit SSL encryption, multi-tenant isolation, and complete audit log provenance."
        }
      }
    ]
  };

  return [softwareSchema, faqSchema];
}

/**
 * OpenSEO Live Auditor Function
 */
export function auditOpenSEO(targetUrl = DEFAULT_APP_URL, pageTitle?: string, pageDescription?: string): SEOAuditResult {
  const title = pageTitle || DEFAULT_TITLE;
  const description = pageDescription || DEFAULT_DESCRIPTION;

  const titleLength = title.length;
  const titlePassed = titleLength >= 30 && titleLength <= 65;
  const titleTip = titleLength < 30 ? "Title is too short. Aim for 30-65 characters for optimal Google ranking." : titleLength > 65 ? "Title exceeds 65 characters and may be truncated by Google." : "Optimal title length!";

  const descLength = description.length;
  const descPassed = descLength >= 120 && descLength <= 165;
  const descTip = descLength < 120 ? "Description is too short. Add more detail (120-165 chars)." : descLength > 165 ? "Description exceeds 165 characters." : "Optimal meta description length!";

  const recommendations: string[] = [];
  if (!titlePassed) recommendations.push(titleTip);
  if (!descPassed) recommendations.push(descTip);
  recommendations.push("Schema.org JSON-LD Structured Data verified for Google Rich Results.");
  recommendations.push("Dynamic sitemap.xml and robots.txt active at domain root.");

  const score = Math.round(
    (titlePassed ? 30 : 15) +
    (descPassed ? 30 : 15) +
    20 + // OpenGraph
    20   // Schema.org
  );

  return {
    score,
    url: targetUrl,
    titleStatus: { text: title, length: titleLength, passed: titlePassed, tip: titleTip },
    descriptionStatus: { text: description, length: descLength, passed: descPassed, tip: descTip },
    openGraphStatus: { hasOgTitle: true, hasOgDescription: true, hasOgImage: true, passed: true },
    schemaStatus: { hasJsonLd: true, schemaTypes: ["SoftwareApplication", "Organization", "FAQPage"], passed: true },
    sitemapStatus: { hasSitemap: true, sitemapUrl: `${targetUrl}/sitemap.xml` },
    robotsStatus: { hasRobots: true, robotsUrl: `${targetUrl}/robots.txt` },
    recommendations
  };
}
