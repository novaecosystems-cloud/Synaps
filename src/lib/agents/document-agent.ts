import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { generateEmbedding } from '@/lib/embeddings';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import { ReActAgent, AgentTool } from '@/lib/agents/react-engine';
import { enrichAgentWithPrimeRLM, calculatePrimeRLM } from '@/lib/prime-rlm';

export interface DocumentCitation {
  documentId: string;
  documentName: string;
  pageNumber: number;
  snippet: string;
  section?: string;
}

export interface AgentResponse {
  answer: string;
  toolSteps: Array<{
    thought: string;
    action?: string;
    actionInput?: any;
    observation?: any;
  }>;
  citations: DocumentCitation[];
  risks?: Array<{ title: string; severity: 'HIGH' | 'MEDIUM' | 'LOW'; explanation: string }>;
  decisions?: Array<{ title: string; owner: string; deadline?: string }>;
  timeline?: Array<{ date: string; event: string; pageNumber?: number }>;
  relationships?: Array<{ entity1: string; relation: string; entity2: string }>;
}

/**
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * PHASE 2 â€” DOCUMENT AGENT TOOLKIT IMPLEMENTATION
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 */

export function buildDocumentAgentTools(organizationId: string, currentDocumentId?: string): AgentTool[] {
  return [
    // 1. Exact Keyword Search
    {
      name: 'search_exact',
      description: 'Find exact string matches in a document or across all organization documents with page citations.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Exact string or term to search for' },
          documentId: { type: 'string', description: 'Optional specific document ID' }
        },
        required: ['query']
      },
      execute: async ({ query, documentId }) => {
        const docId = documentId || currentDocumentId;
        const docFilter = docId ? Prisma.sql`AND c."documentId" = ${docId}` : Prisma.empty;
        const chunks: any[] = await prisma.$queryRaw`
          SELECT c.id, c."documentId", d.name as "docName", COALESCE(c."pageNumber", 1) as "pageNumber", COALESCE(c.section, 'General') as section, c.text
          FROM "DocumentChunk" c
          JOIN "Document" d ON c."documentId" = d.id
          WHERE d."organizationId" = ${organizationId}
            AND d."isDeleted" = false
            ${docFilter}
            AND c.text ILIKE ${'%' + query + '%'}
          ORDER BY c."pageNumber" ASC
          LIMIT 10
        `;
        return chunks.map(c => ({
          chunkId: c.id,
          documentId: c.documentId,
          documentName: c.docName,
          pageNumber: Number(c.pageNumber),
          section: c.section,
          snippet: c.text.substring(0, 300)
        }));
      }
    },

    // 2. Fuzzy Trigram Search
    {
      name: 'search_fuzzy',
      description: 'Search for near-matches, typos, or spellings of terms using fuzzy trigram matching.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Term to fuzzy search for' },
          documentId: { type: 'string', description: 'Optional specific document ID' }
        },
        required: ['query']
      },
      execute: async ({ query, documentId }) => {
        const docId = documentId || currentDocumentId;
        const docFilter = docId ? Prisma.sql`AND c."documentId" = ${docId}` : Prisma.empty;
        const chunks: any[] = (await prisma.$queryRaw`
          SELECT c.id, c."documentId", d.name as "docName", COALESCE(c."pageNumber", 1) as "pageNumber", COALESCE(c.section, 'General') as section, c.text, similarity(c.text, ${query}) as score
          FROM "DocumentChunk" c
          JOIN "Document" d ON c."documentId" = d.id
          WHERE d."organizationId" = ${organizationId}
            AND d."isDeleted" = false
            ${docFilter}
            AND (c.text ILIKE ${'%' + query + '%'} OR similarity(c.text, ${query}) > 0.1)
          ORDER BY score DESC
          LIMIT 10
        `) as any[];

        return chunks.map(c => ({
          chunkId: c.id,
          documentId: c.documentId,
          documentName: c.docName,
          pageNumber: Number(c.pageNumber),
          section: c.section,
          score: Number(c.score),
          snippet: c.text.substring(0, 300)
        }));
      }
    },

    // 3. Semantic AI Vector Search
    {
      name: 'search_semantic',
      description: 'Search by conceptual meaning or natural language intent using AI embeddings.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Natural language query or concept' },
          documentId: { type: 'string', description: 'Optional specific document ID' }
        },
        required: ['query']
      },
      execute: async ({ query, documentId }) => {
        const docId = documentId || currentDocumentId;
        const docFilter = docId ? Prisma.sql`AND c."documentId" = ${docId}` : Prisma.empty;
        try {
          const vector = await generateEmbedding(query);
          const vectorString = `[${vector.join(',')}]`;
          const chunks: any[] = await prisma.$queryRaw`
            SELECT c.id, c."documentId", d.name as "docName", COALESCE(c."pageNumber", 1) as "pageNumber", COALESCE(c.section, 'General') as section, c.text, 1 - (c.embedding <=> ${vectorString}::vector) as score
            FROM "DocumentChunk" c
            JOIN "Document" d ON c."documentId" = d.id
            WHERE d."organizationId" = ${organizationId}
              AND d."isDeleted" = false
              ${docFilter}
              AND c.embedding IS NOT NULL
            ORDER BY c.embedding <=> ${vectorString}::vector
            LIMIT 8
          `;
          return chunks.map(c => ({
            chunkId: c.id,
            documentId: c.documentId,
            documentName: c.docName,
            pageNumber: Number(c.pageNumber),
            section: c.section,
            score: Number(c.score),
            snippet: c.text.substring(0, 300)
          }));
        } catch (e: any) {
          // Fallback to keyword search
          return { note: 'Vector search fallback to keyword', results: await prisma.documentChunk.findMany({ where: { organizationId, text: { contains: query, mode: 'insensitive' } }, take: 5 }) };
        }
      }
    },

    // 4. Search Page Content
    {
      name: 'search_page',
      description: 'Retrieve text, sections, and metadata from a specific page number of a document.',
      parameters: {
        type: 'object',
        properties: {
          pageNumber: { type: 'number', description: 'Page number to inspect' },
          documentId: { type: 'string', description: 'Document ID' }
        },
        required: ['pageNumber']
      },
      execute: async ({ pageNumber, documentId }) => {
        const docId = documentId || currentDocumentId;
        if (!docId) return { error: 'documentId required' };

        const chunks = await prisma.documentChunk.findMany({
          where: { documentId: docId, pageNumber: Number(pageNumber) },
          select: { id: true, text: true, section: true, chunkType: true, positionIdx: true },
          orderBy: { positionIdx: 'asc' }
        });

        const doc = await prisma.document.findUnique({ where: { id: docId }, select: { name: true } });

        return {
          documentId: docId,
          documentName: doc?.name || 'Document',
          pageNumber: Number(pageNumber),
          chunkCount: chunks.length,
          fullText: chunks.map(c => c.text).join('\n\n'),
          sections: [...new Set(chunks.map(c => c.section).filter(Boolean))]
        };
      }
    },

    // 5. Open Page (Get Displayable Page Snippets)
    {
      name: 'open_page',
      description: 'Open and inspect page N of a document with exact citation metadata.',
      parameters: {
        type: 'object',
        properties: {
          pageNumber: { type: 'number', description: 'Page number to open' },
          documentId: { type: 'string', description: 'Document ID' }
        },
        required: ['pageNumber']
      },
      execute: async ({ pageNumber, documentId }) => {
        const docId = documentId || currentDocumentId;
        if (!docId) return { error: 'documentId required' };

        const chunks = await prisma.documentChunk.findMany({
          where: { documentId: docId, pageNumber: Number(pageNumber) },
          select: { text: true, section: true }
        });

        const doc = await prisma.document.findUnique({ where: { id: docId }, select: { name: true } });

        return {
          citation: `[${doc?.name || 'Document'}, p.${pageNumber}]`,
          documentId: docId,
          documentName: doc?.name,
          pageNumber: Number(pageNumber),
          content: chunks.map(c => c.text).join('\n\n')
        };
      }
    },

    // 6. Find Entity (People, Orgs, Money, Dates, Clauses)
    {
      name: 'find_entity',
      description: 'Find occurrences of specific named entities (companies, executives, dates, monetary values, or key terms).',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Entity name or type (e.g. "Apex Global", "John Doe", "$500,000", "termination")' },
          documentId: { type: 'string', description: 'Optional document ID' }
        },
        required: ['query']
      },
      execute: async ({ query, documentId }) => {
        const docId = documentId || currentDocumentId;
        const docFilter = docId ? Prisma.sql`AND c."documentId" = ${docId}` : Prisma.empty;
        const chunks: any[] = await prisma.$queryRaw`
          SELECT c.id, c."documentId", d.name as "docName", COALESCE(c."pageNumber", 1) as "pageNumber", c.text
          FROM "DocumentChunk" c
          JOIN "Document" d ON c."documentId" = d.id
          WHERE d."organizationId" = ${organizationId}
            AND d."isDeleted" = false
            ${docFilter}
            AND c.text ILIKE ${'%' + query + '%'}
          LIMIT 10
        `;

        return {
          entityQuery: query,
          totalFound: chunks.length,
          occurrences: chunks.map(c => ({
            citation: `[${c.docName}, p.${c.pageNumber}]`,
            documentId: c.documentId,
            documentName: c.docName,
            pageNumber: Number(c.pageNumber),
            snippet: c.text.substring(0, 250)
          }))
        };
      }
    },

    // 7. Find All Occurrences Across Organization
    {
      name: 'find_all_occurrences',
      description: 'Search every single document in the organization for all occurrences of a keyword or company name.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Keyword or entity to search across all vault documents' }
        },
        required: ['query']
      },
      execute: async ({ query }) => {
        const chunks: any[] = await prisma.$queryRaw`
          SELECT c.id, c."documentId", d.name as "docName", COALESCE(c."pageNumber", 1) as "pageNumber", c.text
          FROM "DocumentChunk" c
          JOIN "Document" d ON c."documentId" = d.id
          WHERE d."organizationId" = ${organizationId}
            AND d."isDeleted" = false
            AND c.text ILIKE ${'%' + query + '%'}
          ORDER BY d.name ASC, c."pageNumber" ASC
          LIMIT 25
        `;

        const byDoc: Record<string, any> = {};
        for (const c of chunks) {
          if (!byDoc[c.documentId]) {
            byDoc[c.documentId] = {
              documentId: c.documentId,
              documentName: c.docName,
              occurrencesCount: 0,
              pages: [],
              snippets: []
            };
          }
          byDoc[c.documentId].occurrencesCount++;
          if (!byDoc[c.documentId].pages.includes(Number(c.pageNumber))) {
            byDoc[c.documentId].pages.push(Number(c.pageNumber));
          }
          byDoc[c.documentId].snippets.push({
            pageNumber: Number(c.pageNumber),
            text: c.text.substring(0, 200)
          });
        }

        return {
          query,
          documentsMatchedCount: Object.keys(byDoc).length,
          results: Object.values(byDoc)
        };
      }
    },

    // 8. Extract Clause
    {
      name: 'extract_clause',
      description: 'Extract legal or operational clauses (e.g. termination, liability, indemnification, warranty, confidentiality, SLA, force majeure).',
      parameters: {
        type: 'object',
        properties: {
          clauseType: { type: 'string', description: 'Type of clause e.g. "termination", "liability", "indemnification", "warranty", "confidentiality"' },
          documentId: { type: 'string', description: 'Document ID' }
        },
        required: ['clauseType']
      },
      execute: async ({ clauseType, documentId }) => {
        const docId = documentId || currentDocumentId;
        const docFilter = docId ? Prisma.sql`AND c."documentId" = ${docId}` : Prisma.empty;
        const chunks: any[] = await prisma.$queryRaw`
          SELECT c.id, c."documentId", d.name as "docName", COALESCE(c."pageNumber", 1) as "pageNumber", c.section, c.text
          FROM "DocumentChunk" c
          JOIN "Document" d ON c."documentId" = d.id
          WHERE d."organizationId" = ${organizationId}
            ${docFilter}
            AND (
              c.text ILIKE ${'%' + clauseType + '%'}
              OR c.section ILIKE ${'%' + clauseType + '%'}
            )
          LIMIT 6
        `;

        return {
          clauseType,
          found: chunks.map(c => ({
            citation: `[${c.docName}, p.${c.pageNumber}]`,
            documentId: c.documentId,
            documentName: c.docName,
            pageNumber: Number(c.pageNumber),
            section: c.section,
            text: c.text
          }))
        };
      }
    },

    // 9. Extract Table
    {
      name: 'extract_table',
      description: 'Extract tables or structured financial/operational data from document pages.',
      parameters: {
        type: 'object',
        properties: {
          pageNumber: { type: 'number', description: 'Optional page number' },
          documentId: { type: 'string', description: 'Document ID' }
        }
      },
      execute: async ({ pageNumber, documentId }) => {
        const docId = documentId || currentDocumentId;
        const chunks = await prisma.documentChunk.findMany({
          where: {
            organizationId,
            ...(docId ? { documentId: docId } : {}),
            ...(pageNumber ? { pageNumber: Number(pageNumber) } : {}),
            OR: [
              { chunkType: 'TABLE' },
              { text: { contains: '|' } },
              { text: { contains: '\t' } }
            ]
          },
          take: 5
        });

        return {
          tablesFound: chunks.length,
          tables: chunks.map(c => ({
            pageNumber: c.pageNumber,
            content: c.text
          }))
        };
      }
    },

    // 10. Compare Documents
    {
      name: 'compare_documents',
      description: 'Perform side-by-side comparison of two documents to identify differences in clauses, risks, or financial terms.',
      parameters: {
        type: 'object',
        properties: {
          doc1Id: { type: 'string', description: 'First document ID' },
          doc2Id: { type: 'string', description: 'Second document ID' }
        },
        required: ['doc1Id', 'doc2Id']
      },
      execute: async ({ doc1Id, doc2Id }) => {
        const [doc1, doc2] = await Promise.all([
          prisma.document.findUnique({
            where: { id: doc1Id },
            include: { processedDoc: true, metadata: true }
          }),
          prisma.document.findUnique({
            where: { id: doc2Id },
            include: { processedDoc: true, metadata: true }
          })
        ]);

        if (!doc1 || !doc2) return { error: 'One or both documents not found' };

        const prompt = `Compare these two enterprise documents side-by-side:

Document 1: "${doc1.name}" (${doc1.processedDoc?.detectedType || 'Document'})
Summary Content: ${doc1.processedDoc?.textContent.substring(0, 2000) || 'N/A'}

Document 2: "${doc2.name}" (${doc2.processedDoc?.detectedType || 'Document'})
Summary Content: ${doc2.processedDoc?.textContent.substring(0, 2000) || 'N/A'}

Analyze:
1. Key differences in scope, terms, and obligations
2. Differences in financial numbers or rates
3. Risk level comparison
4. Updated vs legacy clauses`;

        const comparisonText = await invokeLLMWithFallback([
          { role: 'system', content: 'You are an Expert Contract & Document Comparison Analyst.' },
          { role: 'user', content: prompt }
        ]);

        return {
          doc1Name: doc1.name,
          doc2Name: doc2.name,
          comparisonAnalysis: comparisonText
        };
      }
    },

    // 11. Cite Source
    {
      name: 'cite_source',
      description: 'Generate formatted evidence citation string [Document Name, Page N].',
      parameters: {
        type: 'object',
        properties: {
          documentId: { type: 'string', description: 'Document ID' },
          pageNumber: { type: 'number', description: 'Page number' },
          snippet: { type: 'string', description: 'Relevant text snippet' }
        },
        required: ['documentId', 'pageNumber', 'snippet']
      },
      execute: async ({ documentId, pageNumber, snippet }) => {
        const doc = await prisma.document.findUnique({ where: { id: documentId }, select: { name: true } });
        const docName = doc?.name || 'Document';
        return {
          formattedCitation: `[${docName}, p.${pageNumber}]`,
          documentName: docName,
          pageNumber,
          snippet
        };
      }
    }
  ];
}

/**
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * PHASE 2 â€” SYNAPS DOCUMENT AGENT ENGINE
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 */

export async function runDocumentAgent(
  goal: string,
  organizationId: string,
  documentId?: string
): Promise<AgentResponse> {
  const tools = buildDocumentAgentTools(organizationId, documentId);

  const systemPrompt = `You are the SYNAPS Document Intelligence Agent.
You answer user queries with precise, evidence-backed answers and page-level citations.

Guidelines:
1. Use the provided tools to fetch document chunks, open specific pages, extract clauses, or compare documents.
2. ALWAYS include page citations in your final answer in the format "[Document Name, p.N]".
3. DO NOT hallucinate facts not present in the document evidence.
4. If asked to find risks, list specific risk clauses with severity and page citations.
5. If asked to compare documents, use the compare_documents tool or fetch both document chunks.
6. Provide clear, structured markdown responses.`;

  const reactAgent = new ReActAgent('DocumentAgent', systemPrompt, new Map(), 8);
  tools.forEach(t => reactAgent.registerTool(t));

  const steps: any[] = [];
  const finalAnswer = await reactAgent.run(goal, (step) => {
    steps.push(step);
  });

  // Extract citations collected across observations
  const citations: DocumentCitation[] = [];
  const seenCitations = new Set<string>();

  steps.forEach(s => {
    if (s.observation) {
      const obsStr = JSON.stringify(s.observation);
      const matches = [...obsStr.matchAll(/\[([^\]]+),\s*p\.(\d+)\]/g)];
      matches.forEach(m => {
        const key = `${m[1]}_${m[2]}`;
        if (!seenCitations.has(key)) {
          seenCitations.add(key);
          citations.push({
            documentId: documentId || 'doc',
            documentName: m[1],
            pageNumber: parseInt(m[2], 10),
            snippet: ''
          });
        }
      });
    }
  });

  // Specialized Extraction Enhancements (Risks, Timeline, Decisions, Entity Graph)
  const risks = extractRisksFromAnswer(finalAnswer);
  const timeline = extractTimelineFromAnswer(finalAnswer);

  return {
    answer: finalAnswer,
    toolSteps: steps,
    citations,
    risks,
    timeline
  };
}

/**
 * Helper: Extract contract risks from agent output
 */
function extractRisksFromAnswer(text: string): Array<{ title: string; severity: 'HIGH' | 'MEDIUM' | 'LOW'; explanation: string }> {
  const risks: Array<{ title: string; severity: 'HIGH' | 'MEDIUM' | 'LOW'; explanation: string }> = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.toLowerCase().includes('risk') || line.toLowerCase().includes('liability') || line.toLowerCase().includes('penalty')) {
      const severity = line.toLowerCase().includes('high') || line.toLowerCase().includes('severe') ? 'HIGH' : line.toLowerCase().includes('medium') ? 'MEDIUM' : 'LOW';
      risks.push({
        title: line.replace(/^[-*â€¢\d.\s]+/, '').substring(0, 60),
        severity,
        explanation: line
      });
    }
  }
  return risks.slice(0, 5);
}

/**
 * Helper: Extract timeline events from agent output
 */
function extractTimelineFromAnswer(text: string): Array<{ date: string; event: string; pageNumber?: number }> {
  const timeline: Array<{ date: string; event: string; pageNumber?: number }> = [];
  const dateRegex = /(?:\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b)/gi;

  const matches = [...text.matchAll(dateRegex)];
  matches.forEach(m => {
    const idx = m.index || 0;
    const snippet = text.substring(Math.max(0, idx - 20), Math.min(text.length, idx + 80)).trim();
    timeline.push({
      date: m[0],
      event: snippet.replace(/\n/g, ' ')
    });
  });

  return timeline.slice(0, 8);
}
