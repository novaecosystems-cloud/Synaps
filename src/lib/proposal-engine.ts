import { invokeLLMWithFallback } from './llm-router';

const DEFAULT_SECTIONS = [
  "Executive Summary",
  "Company Overview",
  "Technical Approach",
  "Scope of Work",
  "Methodology",
  "Deliverables",
  "Timeline",
  "Team Structure",
  "Pricing Placeholder",
  "Risk Mitigation",
  "Compliance Matrix",
  "Assumptions",
  "Appendix"
];

export async function generateProposalSections(documentId: string, requirementsText: string, gapsText: string, decisionText: string) {
  const sectionsData: any[] = [];

  for (let i = 0; i < DEFAULT_SECTIONS.length; i++) {
    const sectionTitle = DEFAULT_SECTIONS[i];
    const systemInstruction = `You are an expert Proposal Writer. Write the "${sectionTitle}" section for a business proposal responding to an RFP.
Use professional, persuasive business language.
Format the output strictly in clean Markdown. Do NOT wrap the entire response in a markdown block, just output the raw markdown text.
Base your writing heavily on the provided Requirements, Gap Analysis, and Final Decision Context.
Cite specific requirements or evidence where appropriate.
Never invent or hallucinate company information (like specific employee names or exact prices unless provided in the context).`;
    
    const prompt = `REQUIREMENTS EXTRACT:\n${requirementsText}\n\nGAP ANALYSIS:\n${gapsText}\n\nDECISION CONTEXT:\n${decisionText}\n\nWrite the ${sectionTitle} section now:`;
    
    try {
      const content = await invokeLLMWithFallback([
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ], { temperature: 0.3 });
      
      sectionsData.push({
        title: sectionTitle,
        content: content,
        order: i
      });
    } catch (e) {
      console.error(`Failed to generate section ${sectionTitle}:`, e);
      sectionsData.push({
        title: sectionTitle,
        content: `*Error generating section: ${sectionTitle}*`,
        order: i
      });
    }
  }
  
  return sectionsData;
}

export async function regenerateSection(currentContent: string, instructions: string, requirementsText: string) {
  const systemInstruction = `You are an expert Proposal Writer AI Assistant.
The user wants to rewrite a specific section of a business proposal.
Follow their exact instructions to modify the current content.
Format the output strictly in clean Markdown without backticks block wrappers.
Base any new factual additions on the provided Requirements Context. Never hallucinate company facts.`;

  const prompt = `CURRENT CONTENT:\n${currentContent}\n\nUSER INSTRUCTIONS:\n${instructions}\n\nREQUIREMENTS CONTEXT:\n${requirementsText}\n\nREWRITTEN CONTENT:`;
  
  try {
    return await invokeLLMWithFallback([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt }
    ], { temperature: 0.4 });
  } catch (e) {
    console.error("AI Assistant rewrite failed:", e);
    throw e;
  }
}
