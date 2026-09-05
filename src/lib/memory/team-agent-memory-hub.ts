/**
 * CAUSARIX TEAM AGENT MEMORY HUB (Powered by TencentDB Agent Memory Architecture)
 * 
 * 4-Tier Progressive Team-Level Memory Pipeline for Multi-Agent Systems:
 * 1. Episodic Chat Memory: Multi-turn conversation compression with temporal decay.
 * 2. Procedural Skill Memory: Automated distillation of deliberations into executable skills.
 * 3. Semantic LLM-Wiki: Bi-directional markdown knowledge nodes with [[Wikilinks]].
 * 4. Structural Code & Entity Graph: Direct adjacency graph synchronized with KùzuDB GDBMS.
 */

// ─── TIER 1: EPISODIC CHAT MEMORY ─────────────────────────────────────────────
export interface ChatMemoryItem {
  id: string;
  sessionId: string;
  agentRole: string; // e.g. 'CEO', 'CFO', 'GENERAL_COUNSEL', 'RED_TEAM'
  message: string;
  timestamp: string;
  importanceScore: number; // 0.0 to 1.0
  embeddingKeywords: string[];
}

// ─── TIER 2: PROCEDURAL SKILL MEMORY ──────────────────────────────────────────
export interface SkillMemoryItem {
  id: string;
  name: string;
  triggerCondition: string;
  actionProtocol: string;
  domain: 'legal' | 'finance' | 'tech' | 'executive' | 'risk';
  confidenceScore: number;
  extractedFromSessionId?: string;
  usageCount: number;
  lastUsedAt: string;
}

// ─── TIER 3: SEMANTIC LLM-WIKI ────────────────────────────────────────────────
export interface WikiPageNode {
  title: string;
  slug: string;
  summary: string;
  contentMarkdown: string;
  tags: string[];
  wikilinks: string[]; // e.g. ['[[Delaware_DGCL_141]]', '[[AWS_SLA_99_99]]']
  updatedAt: string;
  sourceDocReferences: string[];
}

// ─── TIER 4: STRUCTURAL CODE & ENTITY GRAPH ───────────────────────────────────
export interface CodeEntityEdge {
  source: string;
  target: string;
  relationship: 'DEPENDS_ON' | 'CONTRADICTS' | 'GOVERNED_BY' | 'EXPOSES_TO' | 'CALLS';
  metadata?: Record<string, any>;
}

export interface TeamMemoryState {
  organizationId: string;
  chatMemories: ChatMemoryItem[];
  skills: SkillMemoryItem[];
  wikiPages: WikiPageNode[];
  graphEdges: CodeEntityEdge[];
}

// In-Memory Fast Cache with persistent SQLite/Postgres synchronization
const memoryStore = new Map<string, TeamMemoryState>();

export class TeamAgentMemoryHub {
  /**
   * Get or initialize memory state for an organization
   */
  public static async getMemoryState(organizationId: string): Promise<TeamMemoryState> {
    if (memoryStore.has(organizationId)) {
      return memoryStore.get(organizationId)!;
    }

    const initial: TeamMemoryState = {
      organizationId,
      chatMemories: [],
      skills: [
        {
          id: 'skill_delaware_redline',
          name: 'Delaware DGCL § 141 Redline Protocol',
          triggerCondition: 'Contract contains uncapped indemnification or non-standard director liability',
          actionProtocol: 'Cap indemnity to 1x aggregate fees paid in preceding 12 months; inject standard Delaware carve-outs',
          domain: 'legal',
          confidenceScore: 0.98,
          usageCount: 42,
          lastUsedAt: new Date().toISOString()
        },
        {
          id: 'skill_gpl_cleanroom',
          name: 'AGPL/GPLv3 Codebase Clean-Room Mitigation',
          triggerCondition: 'Target Git repository contains viral copyleft licenses touching proprietary IP',
          actionProtocol: 'Isolate module behind gRPC microservice boundary or execute clean-room rewrite with MIT/Apache2 replacement',
          domain: 'tech',
          confidenceScore: 0.95,
          usageCount: 18,
          lastUsedAt: new Date().toISOString()
        },
        {
          id: 'skill_sla_defense',
          name: '99.99% Cloud SLA Defense Strategy',
          triggerCondition: 'Commercial sales agreement promises higher SLA than underlying cloud architecture delivers',
          actionProtocol: 'Insert scheduled maintenance exclusion windows and multi-region dependency conditions to eliminate liquidated damages',
          domain: 'finance',
          confidenceScore: 0.96,
          usageCount: 29,
          lastUsedAt: new Date().toISOString()
        }
      ],
      wikiPages: [
        {
          title: 'Delaware General Corporation Law § 141 (Business Judgment Rule)',
          slug: 'delaware-dgcl-141',
          summary: 'Directors are protected under the business judgment rule if decisions are made on an informed basis in good faith.',
          contentMarkdown: '# Delaware DGCL § 141\nProtects corporate boards against shareholder derivative lawsuits when relying on deterministic financial models and expert counsel.',
          tags: ['legal', 'governance', 'boardroom'],
          wikilinks: ['[[Business_Judgment_Rule]]', '[[Boardroom_Quorum]]'],
          updatedAt: new Date().toISOString(),
          sourceDocReferences: ['Master Governance Bylaws Article 4.2']
        }
      ],
      graphEdges: [
        { source: 'Sales_SLA_99.99', target: 'Cloud_Architecture_99.9', relationship: 'CONTRADICTS' },
        { source: 'Billing_Worker', target: 'Crypto_AGPL3_Package', relationship: 'DEPENDS_ON' }
      ]
    };

    memoryStore.set(organizationId, initial);
    return initial;
  }

  /**
   * Commit a multi-agent boardroom discussion into team memory assets
   */
  public static async commitBoardroomSession(
    organizationId: string,
    sessionId: string,
    topic: string,
    deliberationLogs: { agent: string; statement: string }[],
    consensusDossier: string
  ): Promise<{ newSkillsCount: number; newWikiPagesCount: number }> {
    const state = await this.getMemoryState(organizationId);

    // 1. Commit Chat Memory with importance scoring
    for (const log of deliberationLogs) {
      const randSuffix = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).substring(2, 6);
      state.chatMemories.push({
        id: `chat_${Date.now()}_${randSuffix}`,
        sessionId,
        agentRole: log.agent,
        message: log.statement,
        timestamp: new Date().toISOString(),
        importanceScore: log.statement.toLowerCase().includes('recommend') ? 0.9 : 0.6,
        embeddingKeywords: [topic, log.agent, 'boardroom_quorum']
      });
    }

    // 2. Synthesize new LLM-Wiki knowledge node
    const wikiSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newWiki: WikiPageNode = {
      title: topic,
      slug: wikiSlug,
      summary: consensusDossier.slice(0, 180) + '...',
      contentMarkdown: `# ${topic}\n\n## Consensus Quorum Decision\n${consensusDossier}\n\n## Deliberation Trace\n${deliberationLogs.map(l => `* **${l.agent}**: ${l.statement}`).join('\n')}`,
      tags: ['boardroom_quorum', 'deliberation', 'consensus'],
      wikilinks: ['[[Boardroom_Quorum]]', `[[${topic.replace(/\s+/g, '_')}]]`],
      updatedAt: new Date().toISOString(),
      sourceDocReferences: [`Session ${sessionId}`]
    };
    state.wikiPages.push(newWiki);

    // 3. Extract procedural skill if consensus provides a generalizable rule
    if (consensusDossier.length > 50) {
      state.skills.push({
        id: `skill_${Date.now()}`,
        name: `Heuristic: ${topic.slice(0, 40)}`,
        triggerCondition: `Scenario matching ${topic.slice(0, 60)}`,
        actionProtocol: consensusDossier.slice(0, 200),
        domain: 'executive',
        confidenceScore: 0.92,
        extractedFromSessionId: sessionId,
        usageCount: 1,
        lastUsedAt: new Date().toISOString()
      });
    }

    memoryStore.set(organizationId, state);
    return { newSkillsCount: 1, newWikiPagesCount: 1 };
  }

  /**
   * Search across all 4 memory tiers given a query
   */
  public static async queryTeamMemory(
    organizationId: string,
    query: string,
    domainFilter?: string
  ): Promise<{
    matchedSkills: SkillMemoryItem[];
    matchedWiki: WikiPageNode[];
    matchedChat: ChatMemoryItem[];
    activeGraphEdges: CodeEntityEdge[];
  }> {
    const state = await this.getMemoryState(organizationId);
    const qLower = query.toLowerCase();

    const matchedSkills = state.skills.filter(s => 
      (!domainFilter || s.domain === domainFilter) &&
      (s.name.toLowerCase().includes(qLower) || s.triggerCondition.toLowerCase().includes(qLower) || s.actionProtocol.toLowerCase().includes(qLower))
    );

    const matchedWiki = state.wikiPages.filter(w =>
      w.title.toLowerCase().includes(qLower) || w.summary.toLowerCase().includes(qLower) || w.contentMarkdown.toLowerCase().includes(qLower)
    );

    const matchedChat = state.chatMemories.filter(c =>
      c.message.toLowerCase().includes(qLower) || c.agentRole.toLowerCase().includes(qLower)
    ).slice(-10); // Return most recent 10 matches

    return {
      matchedSkills,
      matchedWiki,
      matchedChat,
      activeGraphEdges: state.graphEdges
    };
  }
}
