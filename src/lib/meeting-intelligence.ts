import prisma from '@/lib/prisma';
import { invokeLLMWithFallback } from '@/lib/llm-router';
import crypto from 'crypto';

function parseSafeJson(content: string) {
  try {
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON in meeting-intelligence:", content);
    return {};
  }
}

export interface Speaker {
  name: string;
  role?: string;
  wordCount?: number;
}

export interface DecisionItem {
  decision: string;
  rationale: string;
}

export interface ActionItem {
  item: string;
  owner: string;
  deadline?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface RiskItem {
  risk: string;
  impact: string;
  mitigation: string;
}

export interface FollowUpItem {
  topic: string;
  owner: string;
}

export interface ProcessedMeetingResult {
  id: string;
  title: string;
  transcript: string;
  summary: string;
  speakers: Speaker[];
  decisions: DecisionItem[];
  actionItems: ActionItem[];
  risks: RiskItem[];
  followUps: FollowUpItem[];
  commitHash: string;
}

export async function processMeetingData(
  title: string,
  textContent: string,
  organizationId: string,
  documentId?: string
): Promise<ProcessedMeetingResult> {

  const systemInstruction = `You are an AI Meeting Intelligence Analyst for Synaps.
Analyze the provided meeting transcript, recording notes, or raw dialogue text.

You MUST extract and generate valid JSON with the following EXACT keys:
1. "transcript": Cleaned, well-structured transcript or summary notes formatted in Markdown.
2. "summary": Executive summary of the meeting (2-4 sentences).
3. "speakers": Array of objects [{ "name": "Name", "role": "Title/Role", "wordCount": 150 }].
4. "decisions": Array of key decisions [{ "decision": "Text of decision", "rationale": "Reasoning" }].
5. "actionItems": Array of concrete action items [{ "item": "Action description", "owner": "Assigned Person", "deadline": "YYYY-MM-DD or timeframe", "priority": "HIGH"|"MEDIUM"|"LOW" }].
6. "risks": Array of identified operational/project risks [{ "risk": "Risk description", "impact": "Impact assessment", "mitigation": "Suggested mitigation" }].
7. "followUps": Array of follow-up topics [{ "topic": "Topic title", "owner": "Owner name" }].

RULES:
- Base all speakers, decisions, action items, and risks strictly on facts in the meeting text.
- If speaker names are unspecified in text, infer sensible speaker handles (e.g. "Speaker 1 (Product Lead)", "Speaker 2").
- Return ONLY valid JSON.`;

  const prompt = `MEETING TITLE: ${title}\n\nMEETING RAW CONTENT:\n${textContent.slice(0, 15000)}`;

  const rawResponse = await invokeLLMWithFallback([
    { role: 'system', content: systemInstruction },
    { role: 'user', content: prompt }
  ], { response_format: { type: 'json_object' } });

  const aiResult = parseSafeJson(rawResponse);

  const transcript = aiResult.transcript || textContent;
  const summary = aiResult.summary || `Meeting summary for ${title}`;
  const speakers = Array.isArray(aiResult.speakers) ? aiResult.speakers : [];
  const decisions = Array.isArray(aiResult.decisions) ? aiResult.decisions : [];
  const actionItems = Array.isArray(aiResult.actionItems) ? aiResult.actionItems : [];
  const risks = Array.isArray(aiResult.risks) ? aiResult.risks : [];
  const followUps = Array.isArray(aiResult.followUps) ? aiResult.followUps : [];

  let meetingId = `meeting_${Date.now()}`;
  let shortHash = crypto.createHash('md5').update(`${title}-${Date.now()}`).digest('hex').substring(0, 7);

  // Save Meeting Record in Database with graceful error handling
  try {
    const meeting = await prisma.meeting.create({
      data: {
        organizationId,
        documentId: documentId || null,
        title,
        date: new Date(),
        rawContent: textContent,
        transcript,
        summary,
        speakers,
        decisions,
        actionItems,
        risks,
        followUps
      }
    });
    meetingId = meeting.id;

    try {
      await prisma.timelineEvent.create({
        data: {
          organizationId,
          commitHash: shortHash,
          title: `Meeting: ${title}`,
          description: summary,
          category: 'MEETING',
          eventDate: new Date(),
          meetingId: meeting.id,
          documentId: documentId || null,
          metadata: {
            speakersCount: speakers.length,
            decisionsCount: decisions.length,
            actionItemsCount: actionItems.length
          }
        }
      });
    } catch (err) {
      console.warn('[MEETING DB] Timeline event warning:', err);
    }
  } catch (dbErr: any) {
    console.warn('[MEETING DB] Database warning (falling back to memory state):', dbErr?.message);
  }

  return {
    id: meetingId,
    title,
    transcript,
    summary,
    speakers,
    decisions,
    actionItems,
    risks,
    followUps,
    commitHash: shortHash
  };
}
