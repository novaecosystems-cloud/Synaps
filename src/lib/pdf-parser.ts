import { z } from 'zod';

// Note: pdf-parse is a CommonJS module
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

export const BoundingBoxSchema = z.object({
  x: z.number().describe('Top-left x in points or normalized scale'),
  y: z.number().describe('Top-left y in points or normalized scale'),
  width: z.number().positive().describe('Width in points or normalized scale'),
  height: z.number().positive().describe('Height in points or normalized scale'),
  page: z.number().int().positive().optional().describe('1-indexed page number'),
  unit: z.enum(['pt', 'normalized_1000', 'normalized_1']).default('pt'),
});

export type BoundingBox = z.infer<typeof BoundingBoxSchema>;

export interface PdfTokenItem {
  text: string;
  pageNumber: number;
  boundingBox: BoundingBox;        // Standard 72-dpi points (top-left origin)
  normalizedBox: BoundingBox;      // 0..1000 integer grid
  fontName?: string;
  fontSize?: number;
}

export interface PdfLineItem {
  lineIndex: number;
  pageNumber: number;
  text: string;
  items: PdfTokenItem[];
  boundingBox: BoundingBox;
  normalizedBox: BoundingBox;
  isHeading?: boolean;
}

export interface PdfPageLayout {
  pageNumber: number;
  pageWidth: number;               // Page width in points (default: 612 for Letter)
  pageHeight: number;              // Page height in points (default: 792 for Letter)
  text: string;
  lines: PdfLineItem[];
  tokens: PdfTokenItem[];
  sections: Array<{
    title: string;
    lineIndex: number;
    boundingBox: BoundingBox;
  }>;
}

export interface ParsedPdfLayout {
  text: string;
  pageCount: number;
  pages: PdfPageLayout[];
  info: Record<string, any>;
  metadata: Record<string, any>;
  hasLayoutCoordinates: boolean;
}

export interface PdfParserOptions {
  normalizeWhitespace?: boolean;
  detectHeadings?: boolean;
  lineMergeThresholdPt?: number;    // Vertical delta threshold to group items into lines (default: 2.5)
  headingFontSizeFactor?: number;   // Threshold multiplier over median font size for headings (default: 1.2)
}

/**
 * Normalizes input buffer types to Node Buffer
 */
export function toBuffer(input: Buffer | Uint8Array | ArrayBuffer): Buffer {
  if (Buffer.isBuffer(input)) return input;
  if (input instanceof Uint8Array) return Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  if (input instanceof ArrayBuffer) return Buffer.from(input);
  throw new TypeError('Unsupported PDF input type. Must be Buffer, Uint8Array, or ArrayBuffer.');
}

/**
 * Parses a PDF buffer and extracts full layout matrices, token maps, and bounding boxes.
 */
export async function parsePdfWithLayout(
  bufferInput: Buffer | Uint8Array | ArrayBuffer,
  options: PdfParserOptions = {}
): Promise<ParsedPdfLayout> {
  const buffer = toBuffer(bufferInput);
  const lineThreshold = options.lineMergeThresholdPt ?? 2.5;
  const headingFactor = options.headingFontSizeFactor ?? 1.2;

  const pagesLayout: PdfPageLayout[] = [];

  const renderPageLayout = async (pageData: any): Promise<string> => {
    const pageIndex = pageData.pageIndex ?? 0;
    const pageNumber = pageIndex + 1;

    // 1. Determine page dimensions from mediaBox / view / viewport
    let pageWidth = 612;  // Default US Letter 72 DPI
    let pageHeight = 792;
    if (pageData.view && Array.isArray(pageData.view) && pageData.view.length >= 4) {
      pageWidth = Math.abs(pageData.view[2] - pageData.view[0]) || 612;
      pageHeight = Math.abs(pageData.view[3] - pageData.view[1]) || 792;
    } else if (typeof pageData.getViewport === 'function') {
      try {
        const vp = pageData.getViewport({ scale: 1.0 });
        pageWidth = vp.width;
        pageHeight = vp.height;
      } catch (_) {}
    }

    // 2. Extract Text Content
    const textContent = await pageData.getTextContent({
      normalizeWhitespace: options.normalizeWhitespace ?? false,
      disableCombineTextItems: false
    });

    const rawItems: any[] = textContent.items || [];
    const tokens: PdfTokenItem[] = [];
    const fontSizes: number[] = [];

    // 3. Transform TextItems to Top-Left Point & Normalized Coordinates
    for (const item of rawItems) {
      const text = item.str || '';
      if (!text && text.trim().length === 0) continue;

      const transform = item.transform || [1, 0, 0, 1, 0, 0];
      const fontHeight = Math.abs(transform[3]) || item.height || 10;
      fontSizes.push(fontHeight);

      const xPdf = transform[4] || 0;
      const yPdf = transform[5] || 0;

      // Coordinate transformation: PDF bottom-left to Top-Left origin
      const xPt = Math.max(0, xPdf);
      const yPt = Math.max(0, pageHeight - yPdf - fontHeight);
      const wPt = Math.max(1, item.width || (text.length * fontHeight * 0.5));
      const hPt = Math.max(1, fontHeight);

      const normalizedBox: BoundingBox = {
        x: Math.min(1000, Math.max(0, Math.round((xPt / pageWidth) * 1000))),
        y: Math.min(1000, Math.max(0, Math.round((yPt / pageHeight) * 1000))),
        width: Math.min(1000, Math.max(1, Math.round((wPt / pageWidth) * 1000))),
        height: Math.min(1000, Math.max(1, Math.round((hPt / pageHeight) * 1000))),
        page: pageNumber,
        unit: 'normalized_1000'
      };

      const pointBox: BoundingBox = {
        x: Math.round(xPt * 100) / 100,
        y: Math.round(yPt * 100) / 100,
        width: Math.round(wPt * 100) / 100,
        height: Math.round(hPt * 100) / 100,
        page: pageNumber,
        unit: 'pt'
      };

      tokens.push({
        text,
        pageNumber,
        boundingBox: pointBox,
        normalizedBox,
        fontName: item.fontName,
        fontSize: fontHeight
      });
    }

    // 4. Calculate Median Font Size for Heading Heuristics
    const medianFontSize = fontSizes.length > 0
      ? [...fontSizes].sort((a, b) => a - b)[Math.floor(fontSizes.length / 2)]
      : 10;

    // 5. Cluster Tokens into Lines (Δy ≤ lineThreshold)
    // Sort tokens by Y ascending, then X ascending
    tokens.sort((a, b) => {
      const dy = a.boundingBox.y - b.boundingBox.y;
      if (Math.abs(dy) > lineThreshold) return dy;
      return a.boundingBox.x - b.boundingBox.x;
    });

    const lines: PdfLineItem[] = [];
    let currentLineTokens: PdfTokenItem[] = [];
    let currentLineY = -1;

    const flushLine = () => {
      if (currentLineTokens.length === 0) return;
      const lineIndex = lines.length;
      const lineText = currentLineTokens.map(t => t.text).join(' ').trim();

      if (lineText.length === 0) {
        currentLineTokens = [];
        return;
      }

      // Compute bounding box union
      const minX = Math.min(...currentLineTokens.map(t => t.boundingBox.x));
      const minY = Math.min(...currentLineTokens.map(t => t.boundingBox.y));
      const maxX = Math.max(...currentLineTokens.map(t => t.boundingBox.x + t.boundingBox.width));
      const maxY = Math.max(...currentLineTokens.map(t => t.boundingBox.y + t.boundingBox.height));

      const lineBoxPt: BoundingBox = {
        x: Math.round(minX * 100) / 100,
        y: Math.round(minY * 100) / 100,
        width: Math.round(Math.max(1, maxX - minX) * 100) / 100,
        height: Math.round(Math.max(1, maxY - minY) * 100) / 100,
        page: pageNumber,
        unit: 'pt'
      };

      const lineBoxNorm: BoundingBox = {
        x: Math.min(1000, Math.max(0, Math.round((minX / pageWidth) * 1000))),
        y: Math.min(1000, Math.max(0, Math.round((minY / pageHeight) * 1000))),
        width: Math.min(1000, Math.max(1, Math.round((Math.max(1, maxX - minX) / pageWidth) * 1000))),
        height: Math.min(1000, Math.max(1, Math.round((Math.max(1, maxY - minY) / pageHeight) * 1000))),
        page: pageNumber,
        unit: 'normalized_1000'
      };

      const maxTokenFont = Math.max(...currentLineTokens.map(t => t.fontSize || 0));
      const isHeading = maxTokenFont >= medianFontSize * headingFactor ||
        (lineText.length < 100 && lineText === lineText.toUpperCase() && lineText.length > 3);

      lines.push({
        lineIndex,
        pageNumber,
        text: lineText,
        items: [...currentLineTokens],
        boundingBox: lineBoxPt,
        normalizedBox: lineBoxNorm,
        isHeading
      });

      currentLineTokens = [];
    };

    for (const token of tokens) {
      if (currentLineY === -1 || Math.abs(token.boundingBox.y - currentLineY) <= lineThreshold) {
        currentLineTokens.push(token);
        currentLineY = token.boundingBox.y;
      } else {
        flushLine();
        currentLineTokens.push(token);
        currentLineY = token.boundingBox.y;
      }
    }
    flushLine();

    // 6. Section Header Extraction
    const sections: Array<{ title: string; lineIndex: number; boundingBox: BoundingBox }> = [];
    lines.forEach(l => {
      if (l.isHeading && l.text.length > 2) {
        sections.push({
          title: l.text,
          lineIndex: l.lineIndex,
          boundingBox: l.boundingBox
        });
      }
    });

    const pageFullText = lines.map(l => l.text).join('\n');

    pagesLayout.push({
      pageNumber,
      pageWidth: Math.round(pageWidth * 100) / 100,
      pageHeight: Math.round(pageHeight * 100) / 100,
      text: pageFullText,
      lines,
      tokens,
      sections
    });

    return `\n\n[[PAGE_${pageNumber}]]\n\n${pageFullText}`;
  };

  const parsed = await pdfParse(buffer, { pagerender: renderPageLayout });

  return {
    text: parsed.text || '',
    pageCount: pagesLayout.length || parsed.numpages || 1,
    pages: pagesLayout,
    info: parsed.info || {},
    metadata: parsed.metadata || {},
    hasLayoutCoordinates: pagesLayout.some(p => p.tokens.length > 0)
  };
}
