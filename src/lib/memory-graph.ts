import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import { enrichAgentWithPrimeRLM, calculatePrimeRLM } from '@/lib/prime-rlm';

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

/**
 * Automatically extracts & builds graph entity nodes and relationship links from Document text
 */
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
    const entityMap = new Map<string, string>();

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

/**
 * Automatically creates & connects a Meeting node to Speakers (Employees), Decisions, and Projects
 */
export async function extractGraphFromMeeting(meetingId: string, organizationId: string) {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId }
    });
    if (!meeting) return;

    // 1. Create or update Meeting Entity Node
    const meetingEntity = await prisma.graphEntity.upsert({
      where: {
        id: `meeting-${meeting.id}`
      },
      create: {
        id: `meeting-${meeting.id}`,
        organizationId,
        documentId: meeting.documentId,
        name: meeting.title,
        type: 'MEETING',
        description: meeting.summary || `Meeting held on ${new Date(meeting.date).toLocaleDateString()}`,
        metadata: {
          date: meeting.date,
          speakers: meeting.speakers,
          decisions: meeting.decisions,
          actionItems: meeting.actionItems
        },
        confidenceScore: 0.98
      },
      update: {
        name: meeting.title,
        description: meeting.summary || '',
        metadata: {
          date: meeting.date,
          speakers: meeting.speakers,
          decisions: meeting.decisions,
          actionItems: meeting.actionItems
        }
      }
    });

    // 2. Link speakers as EMPLOYEE nodes
    const speakers = (meeting.speakers as any[]) || [];
    for (const sp of speakers) {
      if (!sp.name) continue;
      const empEntity = await prisma.graphEntity.findFirst({
        where: { organizationId, name: sp.name }
      }) || await prisma.graphEntity.create({
        data: {
          organizationId,
          name: sp.name,
          type: 'EMPLOYEE',
          description: `Speaker in ${meeting.title} (${sp.role || 'Participant'})`,
          confidenceScore: 0.9
        }
      });

      // Link Employee -> ATTENDED -> Meeting
      await prisma.graphRelationship.create({
        data: {
          organizationId,
          sourceEntityId: empEntity.id,
          targetEntityId: meetingEntity.id,
          relationType: 'ATTENDED',
          description: `${sp.name} attended ${meeting.title}`,
          confidenceScore: 0.95
        }
      }).catch(() => {});
    }

    // 3. Link decisions as DECISION nodes
    const decisions = (meeting.decisions as any[]) || [];
    for (const dec of decisions) {
      const decTitle = typeof dec === 'string' ? dec : dec.decision || dec.title;
      if (!decTitle) continue;

      const decEntity = await prisma.graphEntity.create({
        data: {
          organizationId,
          name: decTitle,
          type: 'DECISION',
          description: `Decision reached during ${meeting.title}`,
          confidenceScore: 0.95
        }
      }).catch(() => null);

      if (decEntity) {
        // Link Meeting -> ORIGINATED -> Decision
        await prisma.graphRelationship.create({
          data: {
            organizationId,
            sourceEntityId: meetingEntity.id,
            targetEntityId: decEntity.id,
            relationType: 'ORIGINATED',
            description: `Decision originated from meeting ${meeting.title}`,
            confidenceScore: 0.95
          }
        }).catch(() => {});
      }
    }

  } catch (err) {
    console.error("Error in extractGraphFromMeeting:", err);
  }
}

/**
 * Detailed Graph Node Inspector fetcher with multi-tenancy enforcement.
 * Resolves linked documents, linked people, linked meetings, linked projects, decisions, and timeline activity.
 */
export async function getNodeDetails(nodeId: string, organizationId: string) {
  // Fetch primary entity node
  const entity = await prisma.graphEntity.findFirst({
    where: { id: nodeId, organizationId },
    include: {
      document: {
        select: { id: true, name: true, mimeType: true, sizeBytes: true, createdAt: true }
      }
    }
  });

  if (!entity) return null;

  // Fetch all 1-hop outgoing and incoming relationships
  const relationships = await prisma.graphRelationship.findMany({
    where: {
      organizationId,
      OR: [
        { sourceEntityId: nodeId },
        { targetEntityId: nodeId }
      ]
    },
    include: {
      sourceEntity: true,
      targetEntity: true,
      document: { select: { id: true, name: true } }
    }
  });

  const linkedDocs: any[] = [];
  const linkedPeople: any[] = [];
  const linkedMeetings: any[] = [];
  const linkedProjects: any[] = [];
  const relatedDecisions: any[] = [];
  const recentActivity: any[] = [];

  // Group connected nodes by domain type
  for (const rel of relationships) {
    const neighbor = rel.sourceEntityId === nodeId ? rel.targetEntity : rel.sourceEntity;
    if (!neighbor) continue;

    const item = {
      id: neighbor.id,
      name: neighbor.name,
      type: neighbor.type,
      description: neighbor.description,
      relationType: rel.relationType,
      evidence: rel.evidence || rel.description
    };

    const type = (neighbor.type || '').toUpperCase();
    if (type === 'DOCUMENT' || type === 'CONTRACT' || type === 'REPORT') linkedDocs.push(item);
    else if (type === 'EMPLOYEE' || type === 'DEPARTMENT' || type === 'CUSTOMER') linkedPeople.push(item);
    else if (type === 'MEETING') linkedMeetings.push(item);
    else if (type === 'PROJECT') linkedProjects.push(item);
    else if (type === 'DECISION') relatedDecisions.push(item);

    recentActivity.push({
      date: rel.createdAt,
      activity: `${rel.relationType}: ${rel.description || neighbor.name}`
    });
  }

  // Also include document if directly attached
  if (entity.document && !linkedDocs.some(d => d.id === entity.document?.id)) {
    linkedDocs.unshift({
      id: entity.document.id,
      name: entity.document.name,
      type: 'DOCUMENT',
      description: `Primary source document (${entity.document.mimeType})`
    });
  }

  return {
    entity: {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      description: entity.description,
      metadata: entity.metadata || {},
      properties: entity.properties || {},
      confidenceScore: entity.confidenceScore,
      createdAt: entity.createdAt
    },
    linkedDocs,
    linkedPeople,
    linkedMeetings,
    linkedProjects,
    relatedDecisions,
    recentActivity: recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)
  };
}
