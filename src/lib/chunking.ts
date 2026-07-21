import { PrismaClient } from '@prisma/client';

export interface ChunkOptions {
  chunkSize: number;
  chunkOverlap: number;
}

export interface ChunkResult {
  text: string;
  pageNumber?: number;
  section?: string;
  tokenCount: number;
}

/**
 * Heuristic-based recursive character text splitter.
 * Attempts to split by \n\n, then \n, then spaces.
 */
export function generateChunks(text: string, options: ChunkOptions = { chunkSize: 1000, chunkOverlap: 200 }): ChunkResult[] {
  const { chunkSize, chunkOverlap } = options;
  const chunks: ChunkResult[] = [];
  
  // Basic heuristic to capture "headings" (lines that are ALL CAPS or Title Case and short)
  let currentSection = 'General';
  let currentPage = 1; // Default if we don't have explicit page markers

  // If text contains a marker like "--- PAGE 2 ---", we can use that to track pages.
  // For now, we'll just track basic sections via regex.
  
  const paragraphs = text.split('\n\n');
  let currentChunkText = '';

  for (const para of paragraphs) {
    // Attempt to extract page numbers if we injected them (e.g., from PDF parser)
    const pageMatch = para.match(/\[\[PAGE_(\d+)\]\]/);
    if (pageMatch) {
      currentPage = parseInt(pageMatch[1], 10);
      continue; // Skip adding the marker itself to the chunk
    }

    // Heuristic: If it's a short line and mostly uppercase, treat as a section heading
    if (para.length > 2 && para.length < 100 && para === para.toUpperCase()) {
      currentSection = para.trim();
    }

    if (currentChunkText.length + para.length > chunkSize) {
      // Chunk is full, push it
      if (currentChunkText.length > 0) {
        chunks.push({
          text: currentChunkText.trim(),
          pageNumber: currentPage,
          section: currentSection,
          tokenCount: Math.ceil(currentChunkText.length / 4) // Standard heuristic
        });
      }
      
      // Keep overlap from previous text
      const keepLength = Math.min(currentChunkText.length, chunkOverlap);
      currentChunkText = currentChunkText.slice(-keepLength) + '\n\n' + para;
    } else {
      currentChunkText += (currentChunkText ? '\n\n' : '') + para;
    }
  }

  // Push remaining
  if (currentChunkText.trim().length > 0) {
    chunks.push({
      text: currentChunkText.trim(),
      pageNumber: currentPage,
      section: currentSection,
      tokenCount: Math.ceil(currentChunkText.length / 4)
    });
  }

  return chunks;
}
