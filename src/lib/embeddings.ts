import { GoogleGenerativeAI } from '@google/generative-ai';
import { invokeLLMWithFallback } from './llm-router';

const geminiApiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (geminiApiKey) {
  genAI = new GoogleGenerativeAI(geminiApiKey);
}

// Keep a clean JSON parse helper in case some fallback models return markdown wrapped JSON
function parseSafeJson(content: string) {
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON from LLM fallback:", content);
    return {};
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  try {
    let result;
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-embedding-2' });
      result = await model.embedContent(text);
    } catch (fallbackErr: any) {
      const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
      result = await fallbackModel.embedContent(text);
    }
    return result.embedding.values;
  } catch (error: any) {
    throw new Error('Failed to generate embedding: ' + (error.message || 'Unknown error'));
  }
}

export async function generateChatResponse(messages: any[], chunks: any[]) {
  const evidenceText = chunks.map(c => `[Doc: ${c.name || c.documentId} | Page: ${c.pageNumber || 'N/A'}] ${c.text}`).join('\n\n');

  const systemInstruction = `You are an AI assistant for Synaps, a Document Intelligence Platform. 
You are provided with context evidence from the user's documents.
Answer the user's question using ONLY the evidence provided. If the answer is not in the evidence, set insufficientEvidence to true.
Format the 'answer' field using Markdown.
You MUST output valid JSON containing the following keys:
- "answer" (string)
- "confidenceScore" (number 0-100)
- "insufficientEvidence" (boolean)
- "sources" (array of strings: filenames cited)

AVAILABLE EVIDENCE:
${evidenceText}`;

  const llmMessages: any[] = [{ role: 'system', content: systemInstruction }];
  for (const m of messages) {
    llmMessages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content });
  }

  const content = await invokeLLMWithFallback(llmMessages, { response_format: { type: 'json_object' } });
  const jsonResponse = parseSafeJson(content);
  
  if (jsonResponse.insufficientEvidence) {
    jsonResponse.answer = "I don't have enough information to answer confidently.";
    jsonResponse.confidenceScore = 0;
  }
  
  return jsonResponse;
}

export async function extractRequirements(documentText: string) {
  const systemInstruction = `You are an expert RFP Requirements Analyst. 
Analyze the provided document text and extract all relevant requirements, constraints, deliverables, and risks. 
Categorize them as FUNCTIONAL, TECHNICAL, BUSINESS, COMPLIANCE, SECURITY, FINANCIAL, TIMELINE, DELIVERABLE, EVALUATION, MANDATORY, OPTIONAL, RISK, or ASSUMPTION.
Priority: LOW, MEDIUM, HIGH, or CRITICAL.
You MUST output valid JSON containing a single key "requirements" which is an array of objects.
Each object must have: "text" (string), "category" (string), "priority" (string), "confidence" (number), "pageNumber" (number or null), "evidence" (string quote).`;

  const MAX_CHARS = 12000;
  const allRequirements: any[] = [];

  for (let i = 0; i < documentText.length; i += MAX_CHARS) {
    const chunk = documentText.substring(i, i + MAX_CHARS);
    const prompt = `DOCUMENT TEXT CHUNK:\n${chunk}`;
    try {
      const content = await invokeLLMWithFallback([
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ], { response_format: { type: 'json_object' } });
      
      const jsonResponse = parseSafeJson(content);
      if (jsonResponse.requirements && Array.isArray(jsonResponse.requirements)) {
        allRequirements.push(...jsonResponse.requirements);
      }
      
      // Prevent hitting Groq's 6000 Tokens-Per-Minute free tier rate limit
      await new Promise(r => setTimeout(r, 2000));
    } catch (e: any) {
      console.error('Failed to extract requirements from chunk:', e);
      throw e;
    }
  }

  return allRequirements;
}

export async function evaluateCoverage(requirementText: string, evidenceChunks: any[]) {
  const evidenceText = evidenceChunks.map(c => `[Doc: ${c.name} | Page: ${c.pageNumber || 'N/A'}] ${c.text}`).join('\n\n');

  const systemInstruction = `You are an expert AI Requirements Evaluator.
Determine if the company meets the requirement based on evidence.
You MUST output valid JSON containing:
- "status" (string: COVERED, PARTIALLY_COVERED, MISSING, UNKNOWN)
- "confidenceScore" (number 0-100)
- "evidence" (string reasoning)
- "matchedDocuments" (array of strings)`;

  const prompt = `REQUIREMENT:\n${requirementText}\n\nEVIDENCE:\n${evidenceText}`;
  const content = await invokeLLMWithFallback([
    { role: 'system', content: systemInstruction },
    { role: 'user', content: prompt }
  ], { response_format: { type: 'json_object' } });
  
  return parseSafeJson(content);
}

export async function evaluateCoverageBatch(items: { id: string, text: string, evidenceChunks: any[] }[]) {
  if (items.length === 0) return [];

  const systemInstruction = `You are an expert AI Requirements Evaluator.
For each requirement, determine if the company meets it based on evidence.
You MUST output valid JSON containing a single key "evaluations" which is an array of objects.
Each object must have:
- "id" (string matching the requirement ID)
- "status" (COVERED, PARTIALLY_COVERED, MISSING, UNKNOWN)
- "confidenceScore" (number)
- "evidence" (string)
- "matchedDocuments" (array of strings)`;

  const prompt = items.map(item => `
REQUIREMENT [ID: ${item.id}]:
${item.text}

EVIDENCE FOR [ID: ${item.id}]:
${item.evidenceChunks.map(c => `[Doc: ${c.name} | Page: ${c.pageNumber || 'N/A'}] ${c.text}`).join('\n\n')}
`).join('\n---\n');

  try {
    const content = await invokeLLMWithFallback([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ], { response_format: { type: 'json_object' } });
    
    const jsonResponse = parseSafeJson(content);
    return jsonResponse.evaluations || [];
  } catch (e) {
    console.error("Batch evaluation failed:", e);
    throw e;
  }
}

export async function analyzeGaps(requirementsText: string) {
  const systemInstruction = `You are an expert RFP Gap Analyst.
Analyze unmet requirements and identify missing capabilities, certifications, etc.
You MUST output valid JSON containing a single key "gaps" which is an array of objects.
Each object must have:
- "title" (string)
- "description" (string)
- "category" (CAPABILITY, CERTIFICATION, DOCUMENT, EXPERIENCE, COMPLIANCE, TEAM, TECHNICAL, OTHER)
- "severity" (LOW, MEDIUM, HIGH, CRITICAL)
- "suggestedResolution" (string)
- "relatedRequirementId" (string)`;

  const prompt = `UNMET REQUIREMENTS:\n${requirementsText}`;
  try {
    const content = await invokeLLMWithFallback([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ], { response_format: { type: 'json_object' } });
    
    const jsonResponse = parseSafeJson(content);
    return jsonResponse.gaps || [];
  } catch (e) {
    console.error("Gap analysis failed:", e);
    throw e;
  }
}

export async function generateDecision(requirementsText: string, gapsText: string) {
  const systemInstruction = `You are an expert Executive Proposal Director.
Generate a Go/No-Go decision based on requirements and gaps.
You MUST output valid JSON containing:
- "recommendation" (GO, NO_GO, CONDITIONAL_GO)
- "executiveSummary" (string)
- "businessImpact" (string)
- "technicalRisk" (string)
- "complianceRisk" (string)
- "timelineRisk" (string)
- "financialRisk" (string)
- "confidence" (number 0-100)
- "supportingEvidence" (string)
- "counterarguments" (string)
- "alternativeRecommendation" (string)`;

  const prompt = `REQUIREMENTS EXTRACT:\n${requirementsText}\n\nGAP ANALYSIS:\n${gapsText}`;
  try {
    const content = await invokeLLMWithFallback([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ], { response_format: { type: 'json_object' } });
    return parseSafeJson(content);
  } catch (e) {
    console.error("Decision generation failed:", e);
    throw e;
  }
}

export async function generateExecutiveSummary(requirementsText: string, gapsText: string, decisionText: string) {
  const systemInstruction = `You are an expert Executive Proposal Writer.
Generate a comprehensive executive summary report.
You MUST output valid JSON containing:
- "executiveSummary" (string)
- "projectOverview" (string)
- "keyRequirements" (string)
- "topRisks" (string)
- "topOpportunities" (string)
- "estimatedEffort" (string)
- "complianceStatus" (string)
- "businessRecommendation" (string)
- "evidenceReferences" (array of strings)`;

  const prompt = `REQUIREMENTS EXTRACT:\n${requirementsText}\n\nGAP ANALYSIS:\n${gapsText}\n\nDECISION:\n${decisionText}`;
  try {
    const content = await invokeLLMWithFallback([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ], { response_format: { type: 'json_object' } });
    return parseSafeJson(content);
  } catch (e) {
    console.error("Executive Summary generation failed:", e);
    throw e;
  }
}
