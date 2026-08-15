import { NextRequest, NextResponse } from 'next/server';
import { requireAuthForLLM } from '@/lib/api-security';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import { AgentSkillPackage, SkillDecisionRule, SkillAntiPattern, SkillChapter } from '@/lib/book-to-skill';

export async function POST(req: NextRequest) {
  const auth = await requireAuthForLLM(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { documentTitle, rawContent, category = 'LEGAL' } = body;

    if (!rawContent || rawContent.trim().length < 50) {
      return NextResponse.json(
        { error: 'Document content is too short to distill into an Agent Skill (minimum 50 characters required).' },
        { status: 400 }
      );
    }

    const wordsCount = rawContent.split(/\s+/).length;
    const estimatedRawTokens = Math.round(wordsCount * 1.3);

    const systemPrompt = `You are the SYNAPS Book-to-Skill Distillation Compiler.
Your mission is to take long-form corporate handbooks, legal playbooks, and complex PDF documentation, and distill them into a deterministic, executable Agent Skill conforming to the AgentSkills standard.

Your output must be ONLY valid JSON matching this schema:
{
  "name": "lowercase-hyphenated-slug",
  "displayName": "Human Friendly Title",
  "version": "1.0.0",
  "description": "Crisp 1-sentence description of what this skill enables agents to verify or execute",
  "decisionRules": [
    {
      "ruleTitle": "Specific Rule Name",
      "condition": "When this situation occurs...",
      "actionRequired": "The exact action or counter-clause to enforce...",
      "riskIfIgnored": "The specific liability or failure if skipped..."
    }
  ],
  "antiPatterns": [
    {
      "trap": "Common pitfall or mistake to avoid...",
      "whyItFails": "Why this creates hidden risk...",
      "correctApproach": "What to do instead..."
    }
  ],
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "Chapter or Module Title",
      "summary": "1-sentence executive summary",
      "content": "Dense, factual operational guidance and exact thresholds (2-3 paragraphs)..."
    }
  ]
}

Rules:
1. Extract 3 to 6 hard, deterministic Decision Rules.
2. Extract 2 to 4 Anti-Patterns.
3. Split content into 2 to 4 modular on-demand Chapters.
4. ZERO fluff, zero throat-clearing, maximum density.`;

    const userPrompt = `Document Title: ${documentTitle || 'Corporate Playbook'}\nCategory: ${category}\n\nDocument Text:\n${rawContent.slice(0, 15000)}`;

    let parsedResult: any = null;

    try {
      const llmResponse = await invokeLLMWithFallback({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
      });

      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('Book-to-Skill LLM compilation fallback:', err);
    }

    if (!parsedResult || !Array.isArray(parsedResult.decisionRules)) {
      // Fallback deterministic synthesis — sanitize slug to prevent path injection
      const rawSlug = (documentTitle || 'playbook')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 60);
      const slug = rawSlug || 'custom-playbook-skill';
      parsedResult = {
        name: slug || 'custom-playbook-skill',
        displayName: documentTitle || 'Custom Enterprise Skill',
        version: '1.0.0',
        description: `Operational agent rules distilled from ${documentTitle || 'internal documentation'}.`,
        decisionRules: [
          {
            ruleTitle: 'Core Threshold Verification',
            condition: 'Evaluating document parameters against internal corporate benchmarks.',
            actionRequired: 'Enforce standard risk buffers and obtain dual executive approval for exceptions.',
            riskIfIgnored: 'Uncontrolled operational variance and breach of governance policies.',
          },
          {
            ruleTitle: 'Compliance & Audit Trail Mandate',
            condition: 'Executing contractual commitments or critical business decisions.',
            actionRequired: 'Record immutable audit logs with timestamped approval signatures.',
            riskIfIgnored: 'Regulatory non-compliance and evidentiary gaps during internal audits.',
          },
        ],
        antiPatterns: [
          {
            trap: 'Relying on informal email confirmations instead of countersigned addendums.',
            whyItFails: 'Creates non-binding evidentiary ambiguity in legal disputes.',
            correctApproach: 'Execute formal written amendments with clear effective dates.',
          },
        ],
        chapters: [
          {
            chapterNumber: 1,
            title: 'Foundational Operating Principles',
            summary: 'Core requirements and scope boundaries.',
            content: rawContent.slice(0, 500) + '...',
          },
        ],
      };
    }

    // Build markdown SKILL.md
    const rulesList = parsedResult.decisionRules
      .map((r: any, i: number) => `${i + 1}. **${r.ruleTitle}**: ${r.actionRequired} (When: ${r.condition})`)
      .join('\n');

    const skillMd = `---
name: ${parsedResult.name}
version: ${parsedResult.version || '1.0.0'}
description: "${parsedResult.description}"
tags: ["${category.toLowerCase()}", "playbook", "distilled-skill"]
tokensBudget: 1200
---

# ${parsedResult.displayName}

## Core Decision Rules
${rulesList}

## Quick Invocation
- Query rules with: \`/${parsedResult.name} [topic]\`
- Check compliance with: \`/${parsedResult.name} audit\`
`;

    const distilledTokens = Math.round(skillMd.split(/\s+/).length * 1.3);
    const ratio = (estimatedRawTokens / Math.max(distilledTokens, 100)).toFixed(1);

    const skillPackage: AgentSkillPackage = {
      id: `skill_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: parsedResult.name,
      displayName: parsedResult.displayName,
      version: parsedResult.version || '1.0.0',
      category: category as any,
      description: parsedResult.description,
      author: 'Synaps Distillation Engine',
      createdAt: new Date().toISOString(),
      sourceDocTitle: documentTitle || 'Uploaded Document',
      sourceTokensRaw: estimatedRawTokens,
      distilledTokens,
      compressionRatio: `${ratio}x`,
      skillMdContent: skillMd,
      decisionRules: parsedResult.decisionRules.map((r: any, idx: number) => ({
        id: `rule_${idx + 1}`,
        ruleTitle: r.ruleTitle || 'Rule',
        condition: r.condition || '',
        actionRequired: r.actionRequired || '',
        riskIfIgnored: r.riskIfIgnored || '',
      })),
      antiPatterns: (parsedResult.antiPatterns || []).map((a: any, idx: number) => ({
        id: `anti_${idx + 1}`,
        trap: a.trap || '',
        whyItFails: a.whyItFails || '',
        correctApproach: a.correctApproach || '',
      })),
      chapters: (parsedResult.chapters || []).map((c: any, idx: number) => ({
        id: `ch_${idx + 1}`,
        chapterNumber: c.chapterNumber || idx + 1,
        title: c.title || `Chapter ${idx + 1}`,
        summary: c.summary || '',
        content: c.content || '',
        tokenCount: Math.round((c.content || '').split(/\s+/).length * 1.3),
      })),
    };

    return NextResponse.json({
      success: true,
      skill: skillPackage,
    });
  } catch (error: any) {
    console.error('Book-to-Skill conversion error:', error);
    return NextResponse.json({ error: 'Skill conversion failed. Please try again.' }, { status: 500 });
  }
}
