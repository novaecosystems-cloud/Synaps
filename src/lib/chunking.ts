import { z } from 'zod';
import { BoundingBox, ParsedPdfLayout, PdfLineItem } from '@/lib/pdf-parser';

export const EvidentiaryChunkSchema = z.object({
  text: z.string().min(1).describe('The verbatim chunk text content'),
  pageNumber: z.number().int().positive().describe('1-indexed page where chunk begins'),
  endPageNumber: z.number().int().positive().optional().describe('1-indexed page where chunk ends if spanning pages'),
  chunkIndex: z.number().int().nonnegative().describe('0-indexed document-wide chunk sequence position'),
  tokenCount: z.number().int().nonnegative().describe('Estimated or exact token count'),
  paragraphIndex: z.number().int().nonnegative().describe('0-indexed paragraph index in document'),
  startCharIndex: z.number().int().nonnegative().describe('Document-wide character start offset'),
  endCharIndex: z.number().int().nonnegative().describe('Document-wide character end offset'),
  boundingBox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    page: z.number().optional(),
    unit: z.enum(['pt', 'normalized_1000', 'normalized_1']).optional()
  }).optional().describe('Spatial 2D bounding box union on primary page'),
  normalizedBox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    page: z.number().optional(),
    unit: z.enum(['pt', 'normalized_1000', 'normalized_1']).optional()
  }).optional().describe('0..1000 normalized bounding box for UI overlay'),
  section: z.string().default('General').describe('Identified legal or structural section heading'),
  chunkType: z.enum(['TEXT', 'TABLE', 'IMAGE', 'HEADER']).default('TEXT'),
  metadata: z.record(z.string(), z.any()).optional().describe('Additional evidentiary metadata')
});

export type EvidentiaryChunk = z.infer<typeof EvidentiaryChunkSchema>;

export interface ChunkOptions {
  chunkSize?: number;      // Default: 1000 characters (~250 tokens)
  chunkOverlap?: number;   // Default: 200 characters (~50 tokens)
  preserveParagraphs?: boolean;
}

export interface ChunkResult {
  text: string;
  pageNumber?: number;
  section?: string;
  tokenCount: number;
}

/**
 * Computes the minimum bounding box union encompassing a list of boxes
 */
export function computeUnionBoundingBox(boxes: (BoundingBox | undefined)[]): BoundingBox | undefined {
  const valid = boxes.filter((b): b is BoundingBox => b !== undefined && b.width > 0 && b.height > 0);
  if (valid.length === 0) return undefined;

  const minX = Math.min(...valid.map(b => b.x));
  const minY = Math.min(...valid.map(b => b.y));
  const maxX = Math.max(...valid.map(b => b.x + b.width));
  const maxY = Math.max(...valid.map(b => b.y + b.height));

  return {
    x: Math.round(minX * 100) / 100,
    y: Math.round(minY * 100) / 100,
    width: Math.round(Math.max(1, maxX - minX) * 100) / 100,
    height: Math.round(Math.max(1, maxY - minY) * 100) / 100,
    page: valid[0]?.page,
    unit: valid[0]?.unit || 'pt'
  };
}

/**
 * Generates evidentiary chunks with character offsets, paragraph indices, and 2D bounding boxes.
 */
export function generateEvidentiaryChunks(
  text: string,
  options: ChunkOptions = {},
  layoutData?: ParsedPdfLayout
): EvidentiaryChunk[] {
  const chunkSize = options.chunkSize ?? 1000;
  const chunkOverlap = options.chunkOverlap ?? 200;
  const chunks: EvidentiaryChunk[] = [];

  let chunkIndex = 0;
  let paragraphIndex = 0;
  let currentSection = 'General';

  if (layoutData && layoutData.hasLayoutCoordinates && layoutData.pages.length > 0) {
    // ─── Layout-Aware Generation ──────────────────────────────────────────
    let globalCharOffset = 0;

    for (const page of layoutData.pages) {
      const pageNum = page.pageNumber;
      const pageLines = page.lines;

      if (pageLines.length === 0) continue;

      // Group lines into paragraphs (gap > 8pt or heading)
      const paragraphs: Array<{ text: string; lines: PdfLineItem[]; section: string }> = [];
      let currentParaLines: PdfLineItem[] = [];

      for (let i = 0; i < pageLines.length; i++) {
        const line = pageLines[i];
        if (line.isHeading) {
          currentSection = line.text;
        }

        if (currentParaLines.length === 0) {
          currentParaLines.push(line);
          continue;
        }

        const prevLine = currentParaLines[currentParaLines.length - 1];
        const verticalGap = line.boundingBox.y - (prevLine.boundingBox.y + prevLine.boundingBox.height);

        if (verticalGap > 8 || line.isHeading) {
          // Flush current paragraph
          const pText = currentParaLines.map(l => l.text).join(' ');
          paragraphs.push({ text: pText, lines: [...currentParaLines], section: currentSection });
          currentParaLines = [line];
        } else {
          currentParaLines.push(line);
        }
      }

      if (currentParaLines.length > 0) {
        const pText = currentParaLines.map(l => l.text).join(' ');
        paragraphs.push({ text: pText, lines: [...currentParaLines], section: currentSection });
      }

      // Pack paragraphs into evidentiary chunks
      let chunkTextBuffer = '';
      let chunkLinesBuffer: PdfLineItem[] = [];
      let chunkSection = currentSection;
      let chunkStartOffset = globalCharOffset;

      for (const para of paragraphs) {
        const wouldOverflow = chunkTextBuffer.length + para.text.length + 2 > chunkSize;

        if (wouldOverflow && chunkTextBuffer.length > 0) {
          const ptBox = computeUnionBoundingBox(chunkLinesBuffer.map(l => l.boundingBox));
          const normBox = computeUnionBoundingBox(chunkLinesBuffer.map(l => l.normalizedBox));

          const cleanChunkText = chunkTextBuffer.trim();
          chunks.push({
            text: cleanChunkText,
            pageNumber: pageNum,
            chunkIndex: chunkIndex++,
            tokenCount: Math.ceil(cleanChunkText.length / 4),
            paragraphIndex: paragraphIndex++,
            startCharIndex: chunkStartOffset,
            endCharIndex: chunkStartOffset + cleanChunkText.length,
            boundingBox: ptBox,
            normalizedBox: normBox,
            section: chunkSection,
            chunkType: cleanChunkText.includes('|') ? 'TABLE' : 'TEXT'
          });

          // Compute overlap
          const keepLength = Math.min(chunkTextBuffer.length, chunkOverlap);
          const overlapText = chunkTextBuffer.slice(-keepLength);
          chunkStartOffset = chunkStartOffset + chunkTextBuffer.length - keepLength;
          chunkTextBuffer = overlapText + '\n\n' + para.text;
          chunkLinesBuffer = [...para.lines];
          chunkSection = para.section;
        } else {
          if (chunkTextBuffer.length === 0) {
            chunkStartOffset = globalCharOffset;
            chunkSection = para.section;
          }
          chunkTextBuffer += (chunkTextBuffer ? '\n\n' : '') + para.text;
          chunkLinesBuffer.push(...para.lines);
        }

        globalCharOffset += para.text.length + 2;
      }

      // Flush page remainder
      if (chunkTextBuffer.trim().length > 0) {
        const ptBox = computeUnionBoundingBox(chunkLinesBuffer.map(l => l.boundingBox));
        const normBox = computeUnionBoundingBox(chunkLinesBuffer.map(l => l.normalizedBox));
        const cleanChunkText = chunkTextBuffer.trim();

        chunks.push({
          text: cleanChunkText,
          pageNumber: pageNum,
          chunkIndex: chunkIndex++,
          tokenCount: Math.ceil(cleanChunkText.length / 4),
          paragraphIndex: paragraphIndex++,
          startCharIndex: chunkStartOffset,
          endCharIndex: chunkStartOffset + cleanChunkText.length,
          boundingBox: ptBox,
          normalizedBox: normBox,
          section: chunkSection,
          chunkType: cleanChunkText.includes('|') ? 'TABLE' : 'TEXT'
        });
      }
    }

    return chunks;
  }

  // ─── Text-Only / Non-PDF Fallback ──────────────────────────────────────────
  const paragraphs = text.split('\n\n');
  let currentPage = 1;
  let currentChunkText = '';
  let startOffset = 0;
  let runningCharOffset = 0;

  for (const para of paragraphs) {
    const pageMatch = para.match(/\[\[PAGE_(\d+)\]\]/);
    if (pageMatch) {
      currentPage = parseInt(pageMatch[1], 10);
      runningCharOffset += para.length + 2;
      continue;
    }

    if (para.length > 2 && para.length < 120 && (para === para.toUpperCase() || para.startsWith('#'))) {
      currentSection = para.replace(/^#+\s*/, '').trim();
    }

    if (currentChunkText.length + para.length > chunkSize) {
      if (currentChunkText.length > 0) {
        const cleanChunkText = currentChunkText.trim();
        chunks.push({
          text: cleanChunkText,
          pageNumber: currentPage,
          chunkIndex: chunkIndex++,
          tokenCount: Math.ceil(cleanChunkText.length / 4),
          paragraphIndex: paragraphIndex++,
          startCharIndex: startOffset,
          endCharIndex: startOffset + cleanChunkText.length,
          section: currentSection,
          chunkType: cleanChunkText.includes('|') ? 'TABLE' : 'TEXT'
        });
      }

      const keepLength = Math.min(currentChunkText.length, chunkOverlap);
      startOffset = runningCharOffset - keepLength;
      currentChunkText = currentChunkText.slice(-keepLength) + '\n\n' + para;
    } else {
      if (currentChunkText.length === 0) {
        startOffset = runningCharOffset;
      }
      currentChunkText += (currentChunkText ? '\n\n' : '') + para;
    }

    runningCharOffset += para.length + 2;
  }

  if (currentChunkText.trim().length > 0) {
    const cleanChunkText = currentChunkText.trim();
    chunks.push({
      text: cleanChunkText,
      pageNumber: currentPage,
      chunkIndex: chunkIndex++,
      tokenCount: Math.ceil(cleanChunkText.length / 4),
      paragraphIndex: paragraphIndex++,
      startCharIndex: startOffset,
      endCharIndex: startOffset + cleanChunkText.length,
      section: currentSection,
      chunkType: cleanChunkText.includes('|') ? 'TABLE' : 'TEXT'
    });
  }

  return chunks;
}

/**
 * Legacy recursive character text splitter maintaining backward compatibility.
 */
export function generateChunks(text: string, options: ChunkOptions = { chunkSize: 1000, chunkOverlap: 200 }): ChunkResult[] {
  const evidentiaryChunks = generateEvidentiaryChunks(text, options);
  return evidentiaryChunks.map(c => ({
    text: c.text,
    pageNumber: c.pageNumber,
    section: c.section,
    tokenCount: c.tokenCount
  }));
}
