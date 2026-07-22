import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';

function parseSafeJson(content: string) {
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON from LLM in memory-graph:", content);
    return {};
  }
}

export interface ExtractedGraphData {
  summary: string;
  keywords: string[];
  topics: string[];
  confidenceScore: number;
  timeline: { date?: string; event: string }[];
  sourceReferences: string[];
  entities: {
    name: string;
    type: 'DOCUMENT' | 'EMPLOYEE' | 'DEPARTMENT' | 'PROJECT' | 'BUDGET' | 'DECISION' | 'MEETING' | 'CONTRACT' | 'CUSTOMER' | 'INVOICE' | 'VENDOR' | 'POLICY' | 'COMPLIANCE_REQUIREMENT' | 'SOP' | 'REPORT' | string;
    description: string;
    properties?: Record<string, any>;
    confidenceScore?: number;
  }[];
  relationships: {
    sourceEntityName: string;
    targetEntityName: string;
    relationType: string;
    description: string;
    evidence?: string;
    confidenceScore?: number;
  }[];
}

export async function extractGraphFromDocument(documentId: string, textContent: string, organizationId: string): Promise<ExtractedGraphData> {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { name: true }
  });

  const docName = doc?.name || 'Document';
  const MAX_TEXT_LEN = 14000;
  const truncatedText = textContent.slice(0, MAX_TEXT_LEN);

  const systemInstruction = `You are an Enterprise Knowledge Graph Architect AI.
Analyze the document text and construct a living Knowledge Graph representation.

You MUST extract and generate:
1. "summary": A concise executive summary of the document (2-4 sentences).
2. "keywords": Array of 5-10 key entity terms or search tags.
3. "topics": Array of 3-6 core business or technical domain topics.
4. "confidenceScore": Overall document intelligence confidence score (number between 0.0 and 1.0).
5. "timeline": Array of objects [{ "date": "YYYY-MM-DD or timeframe", "event": "Description of milestone or date" }].
6. "sourceReferences": Array of document sections, clauses, or filenames referenced.
7. "entities": Array of extracted domain entities.
   Each entity must have:
   - "name": Unique clean title/name (e.g. "John Smith", "Engineering Dept", "Q3 Marketing Project", "ACME Corp", "Policy-404").
   - "type": One of ["EMPLOYEE", "DEPARTMENT", "PROJECT", "BUDGET", "DECISION", "MEETING", "CONTRACT", "CUSTOMER", "INVOICE", "VENDOR", "POLICY", "COMPLIANCE_REQUIREMENT", "SOP", "REPORT"].
   - "description": 1-2 sentence description based strictly on text.
   - "properties": Key-value dictionary of metadata (e.g. budget amount, status, effective date).
   - "confidenceScore": Float 0.0 - 1.0.
8. "relationships": Array of directed relationships between entities.
   Each relationship must have:
   - "sourceEntityName": Name matching an extracted entity or document name.
   - "targetEntityName": Name matching an extracted entity or document name.
   - "relationType": Short snake_case verb (e.g. "EMPLOYED_BY", "HAS_BUDGET", "DECIDED_IN", "SIGNED_WITH", "ISSUED_BY", "GOVERNED_BY", "APPLIES_TO").
   - "description": Explanation of the relationship.
   - "evidence": Direct quote or snippet from document.
   - "confidenceScore": Float 0.0 - 1.0.

RULES:
- Always include a primary Entity node for the Document itself named "${docName}" of type "DOCUMENT".
- Connect extracted entities back to "${docName}" using relationships like "DEFINED_IN", "MENTIONED_IN", or "GOVERNED_BY".
- Base all entities and relationships strictly on facts in the text. No placeholder or fake data.
- Return ONLY valid JSON matching this schema.`;

  const prompt = `DOCUMENT NAME: ${docName}\n\nDOCUMENT TEXT:\n${truncatedText}`;

  try {
    const rawContent = await invokeLLMWithFallback([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ], { response_format: { type: 'json_object' } });

    const graphData: ExtractedGraphData = parseSafeJson(rawContent);

    // Default fallbacks if empty
    graphData.summary = graphData.summary || `Extracted knowledge graph for ${docName}.`;
    graphData.keywords = Array.isArray(graphData.keywords) ? graphData.keywords : [];
    graphData.topics = Array.isArray(graphData.topics) ? graphData.topics : [];
    graphData.confidenceScore = typeof graphData.confidenceScore === 'number' ? graphData.confidenceScore : 0.95;
    graphData.timeline = Array.isArray(graphData.timeline) ? graphData.timeline : [];
    graphData.sourceReferences = Array.isArray(graphData.sourceReferences) ? graphData.sourceReferences : [docName];
    graphData.entities = Array.isArray(graphData.entities) ? graphData.entities : [];
    graphData.relationships = Array.isArray(graphData.relationships) ? graphData.relationships : [];

    // Ensure the Document entity itself exists
    const docEntityIdx = graphData.entities.findIndex(e => e.name === docName);
    if (docEntityIdx === -1) {
      graphData.entities.unshift({
        name: docName,
        type: 'DOCUMENT',
        description: graphData.summary,
        confidenceScore: graphData.confidenceScore,
        properties: { keywords: graphData.keywords, topics: graphData.topics }
      });
    } else {
      graphData.entities[docEntityIdx].type = 'DOCUMENT';
      graphData.entities[docEntityIdx].description = graphData.summary;
    }

    // Persist Entities and Relationships into Prisma database
    const entityMap = new Map<string, string>(); // name -> id

    for (const ent of graphData.entities) {
      const existing = await prisma.graphEntity.findFirst({
        where: {
          organizationId,
          name: ent.name
        }
      });

      if (existing) {
        const updated = await prisma.graphEntity.update({
          where: { id: existing.id },
          data: {
            type: ent.type || existing.type,
            description: ent.description || existing.description,
            metadata: {
              summary: graphData.summary,
              keywords: graphData.keywords,
              topics: graphData.topics,
              timeline: graphData.timeline
            },
            properties: ent.properties || existing.properties || {},
            confidenceScore: ent.confidenceScore ?? existing.confidenceScore,
            sourceReferences: graphData.sourceReferences,
            documentId: documentId
          }
        });
        entityMap.set(ent.name, updated.id);
      } else {
        const created = await prisma.graphEntity.create({
          data: {
            organizationId,
            documentId,
            name: ent.name,
            type: ent.type || 'CONCEPT',
            description: ent.description || '',
            metadata: {
              summary: graphData.summary,
              keywords: graphData.keywords,
              topics: graphData.topics,
              timeline: graphData.timeline
            },
            properties: ent.properties || {},
            confidenceScore: ent.confidenceScore ?? 0.9,
            sourceReferences: graphData.sourceReferences
          }
        });
        entityMap.set(ent.name, created.id);
      }
    }

    // Persist Relationships
    for (const rel of graphData.relationships) {
      const sourceId = entityMap.get(rel.sourceEntityName);
      const targetId = entityMap.get(rel.targetEntityName);

      if (sourceId && targetId && sourceId !== targetId) {
        const existingRel = await prisma.graphRelationship.findFirst({
          where: {
            organizationId,
            sourceEntityId: sourceId,
            targetEntityId: targetId,
            relationType: rel.relationType
          }
        });

        if (!existingRel) {
          await prisma.graphRelationship.create({
            data: {
              organizationId,
              documentId,
              sourceEntityId: sourceId,
              targetEntityId: targetId,
              relationType: rel.relationType || 'RELATED_TO',
              description: rel.description || '',
              evidence: rel.evidence || '',
              confidenceScore: rel.confidenceScore ?? 0.9
            }
          });
        }
      }
    }

    return graphData;

  } catch (error) {
    console.error("Error in extractGraphFromDocument:", error);
    throw error;
  }
}
