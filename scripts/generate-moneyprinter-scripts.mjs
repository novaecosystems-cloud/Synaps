/**
 * MONEYPRINTER TURBO VIDEO PROMPTS & CONFIG GENERATOR FOR CAUSARIX
 * 
 * Pre-configured viral video templates (9:16 Shorts/Reels/TikTok)
 * for automated rendering with MoneyPrinterTurbo.
 */

export const CAUSARIX_VIDEO_SCRIPTS = [
  {
    id: "video_1_delaware_redline",
    title: "Why In-House Lawyers are Ditching ChatGPT for Delaware Redlines",
    videoSubject: "AI contract redlining vs hallucination",
    voiceName: "en-US-ChristopherNeural", // Authoritative, crisp professional voice
    aspectRatio: "9:16",
    script: `
Did you know 90% of lawyers refuse to use ChatGPT for contract review?
Here's why: raw AI hallucinates liability clauses and drifts on financial math.
When you're reviewing a 40-page vendor agreement with a 10 million dollar uncapped indemnity, a single hallucinated sentence can destroy a company.
That's why enterprise teams are switching to Causarix.
It automatically checks cross-silo contradictions between Sales SLAs, Engineering cloud architecture, and CFO liability reserves in 60 seconds.
Every counter-clause is mathematically grounded in Delaware DGCL Section 141 governance rules with line-level SHA-256 coordinates.
Zero hallucinations. Zero math drift.
Test drive a 200 million dollar audit simulation live at causarix dot vercel dot app slash demo.
`.trim(),
    keywords: ["lawyer contract review", "technology server room", "corporate boardroom", "ai code screen", "successful handshake business"]
  },
  {
    id: "video_2_math_drift",
    title: "The 17% Math Trap in Generative AI",
    videoSubject: "LLM math errors vs WebAssembly Python",
    voiceName: "en-US-GuyNeural",
    aspectRatio: "9:16",
    script: `
Stop letting raw AI calculate your company's cash runway.
In a benchmark of 1,000 enterprise scenarios, frontier LLMs drifted by up to 17% on multi-step financial math.
Why? Because standard models are token predictors, not calculators.
Causarix solves this with a neuro-symbolic architecture.
It combines Google Gemini with in-process WebAssembly Python and Judea Pearl's Structural Causal Models.
The result? Exactly 0.00% arithmetic drift and sub-100 millisecond graph traversal across your entire company's contracts and codebases.
Don't guess with your company's balance sheet.
Experience deterministic decision intelligence at causarix dot vercel dot app.
`.trim(),
    keywords: ["financial stock market chart", "python code matrix", "server data analytics", "modern skyscraper office", "graph network nodes"]
  },
  {
    id: "video_3_boardroom_quorum",
    title: "Simulate Your Boardroom with 10 AI Agents Before You Vote",
    videoSubject: "10-Agent Autonomous C-Suite Deliberation",
    voiceName: "en-US-JennyNeural",
    aspectRatio: "9:16",
    script: `
What if you could stress-test your biggest business decisions before walking into the boardroom?
Meet Causarix's 10-Agent AI Boardroom.
Your autonomous CEO, CFO, General Counsel, and Red Team agents debate, stress-test 10,000 Monte Carlo scenarios, and vote in synchronous quorum.
They remember historical board votes, flag hidden GPL license risks in target codebases, and catch unbudgeted SLA penalties before you sign.
Test drive the interactive sandbox with zero login at causarix dot vercel dot app slash demo.
`.trim(),
    keywords: ["executive boardroom meeting", "futuristic holographic interface", "cyber security padlock", "business leadership presentation", "ai neural network"]
  }
];

console.log("Generated MoneyPrinterTurbo Video Templates:");
console.log(JSON.stringify(CAUSARIX_VIDEO_SCRIPTS, null, 2));
