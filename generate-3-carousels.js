const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateHTML(carouselId, titleTag, s1Text1, s1Text2, s2Text1, s2Text2, s3Text1, s3Text2, s4Text1, s4Text2, ctaUrl) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${titleTag}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    @page { size: 1080px 1080px; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0; padding: 0;
      font-family: 'Space Grotesk', sans-serif;
      background-color: #070c18;
      color: #ffffff;
      -webkit-print-color-adjust: exact;
    }
    .slide {
      width: 1080px; height: 1080px;
      page-break-after: always;
      padding: 80px;
      display: flex; flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      background: radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.25), transparent 55%),
                  radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.2), transparent 55%),
                  #070c18;
    }
    
    /* Dotted connecting line representing continuous carousel flow */
    .dotted-path {
      position: absolute;
      top: 50%; left: -200px; right: -200px;
      height: 2px;
      border-top: 3px dashed rgba(6, 182, 212, 0.4);
      pointer-events: none;
      z-index: 1;
    }
    
    .badge {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 12px 28px; border-radius: 9999px;
      background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.4);
      color: #22d3ee; font-size: 20px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
      z-index: 10;
    }
    
    .headline {
      font-family: 'Unbounded', sans-serif;
      font-size: 58px; font-weight: 900; line-height: 1.15; text-transform: uppercase;
      margin: 30px 0 20px 0; color: #ffffff;
      z-index: 10;
    }
    
    .cyan { color: #22d3ee; }
    .indigo { color: #818cf8; }
    
    .quote-box {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 32px; padding: 44px; margin-top: 20px;
      backdrop-filter: blur(20px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      z-index: 10;
    }
    
    .genz-tag {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px; font-weight: 700; color: #818cf8;
      text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;
    }
    .box-title { font-size: 32px; font-weight: 800; color: #ffffff; line-height: 1.35; }
    .box-desc { font-size: 24px; color: #94a3b8; line-height: 1.6; margin-top: 14px; }
    
    .footer {
      display: flex; justify-content: space-between; align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.15); padding-top: 28px;
      font-size: 20px; color: #64748b; font-weight: 700;
      z-index: 10;
    }
  </style>
</head>
<body>

  <!-- SLIDE 1 -->
  <div class="slide">
    <div class="dotted-path"></div>
    <div>
      <span class="badge">${titleTag}</span>
      <h1 class="headline">${s1Text1}</h1>
      <div class="quote-box">
        <div class="genz-tag">⚡ REAL TALK</div>
        <div class="box-title">${s1Text2}</div>
      </div>
    </div>
    <div class="footer">
      <span>SYNAPS ENTERPRISE OS</span>
      <span>Swipe ➡️ (1/4)</span>
    </div>
  </div>

  <!-- SLIDE 2 -->
  <div class="slide">
    <div class="dotted-path"></div>
    <div>
      <span class="badge">🔄 RETHINK THE OLD WAY</span>
      <h1 class="headline">${s2Text1}</h1>
      <div class="quote-box">
        <div class="genz-tag">💡 THE SHIFT</div>
        <div class="box-title">${s2Text2}</div>
      </div>
    </div>
    <div class="footer">
      <span>SYNAPS ENTERPRISE OS</span>
      <span>Swipe ➡️ (2/4)</span>
    </div>
  </div>

  <!-- SLIDE 3 -->
  <div class="slide">
    <div class="dotted-path"></div>
    <div>
      <span class="badge">🛡️ GROUNDED SOLUTION</span>
      <h1 class="headline">${s3Text1}</h1>
      <div class="quote-box" style="border-color: rgba(34, 211, 238, 0.4); background: rgba(6, 182, 212, 0.08);">
        <div class="genz-tag" style="color: #22d3ee;">✅ ZERO HALLUCINATIONS</div>
        <div class="box-title" style="font-family: monospace; font-size: 26px; color: #ffffff;">${s3Text2}</div>
      </div>
    </div>
    <div class="footer">
      <span>SYNAPS ENTERPRISE OS</span>
      <span>Swipe ➡️ (3/4)</span>
    </div>
  </div>

  <!-- SLIDE 4 -->
  <div class="slide">
    <div class="dotted-path"></div>
    <div>
      <span class="badge">🚀 TAKE ACTION</span>
      <h1 class="headline">${s4Text1}</h1>
      <div class="quote-box" style="border-color: rgba(99, 102, 241, 0.5); background: rgba(99, 102, 241, 0.1);">
        <div class="genz-tag" style="color: #818cf8;">🔗 TEST FREE DEMO</div>
        <div class="box-title" style="font-family: 'Unbounded', sans-serif; font-size: 36px; color: #ffffff;">${ctaUrl}</div>
        <div class="box-desc" style="color: #22d3ee;">${s4Text2}</div>
      </div>
    </div>
    <div class="footer">
      <span>SYNAPS ENTERPRISE OS</span>
      <span>Link in Bio 🔗 (4/4)</span>
    </div>
  </div>

</body>
</html>
  `;
}

const CAROUSELS = [
  {
    filename: 'synaps_genz_carousel_1_redliner',
    tag: '⚡ CONTRACT REDLINER',
    s11: 'WHAT WORKED IN THE PAST... <span class="cyan">WON\'T WORK IN THE FUTURE</span>',
    s12: 'Reading 40-page terms & conditions manually is officially outdated. 💀',
    s21: 'SIGNING BLIND IS A <span class="indigo">SYSTEM FAILURE</span>',
    s22: 'Multi-year lock-ins & 25% cancellation fees hide inside Section 4.2. Stop trusting raw vibes.',
    s31: 'PASTE PDF $\\rightarrow$ GET SAFER COUNTER-TERMS IN <span class="cyan">60s</span>',
    s32: '✅ Proposed Redline: "Agreement renews month-to-month with 30 days notice." [Cited Page 4, Line 12]',
    s41: 'STOP SIGNING BLIND. <span class="cyan">REDLINE FREE.</span>',
    s42: 'Instant 60-Second Document Intelligence — No Credit Card Needed.',
    url: 'synaps-one.vercel.app'
  },
  {
    filename: 'synaps_genz_carousel_2_graph',
    tag: '🧠 3D MEMORY GRAPH',
    s11: 'FOLDER ORGANIZATION IS <span class="cyan">OFFICIALLY DEAD</span>',
    s12: 'Opening 47 PDF tabs at 2 AM just to find 1 invoice number? Absolute insanity. 😭',
    s21: 'CONNECT YOUR ENTIRE <span class="indigo">ENTERPRISE MEMORY</span>',
    s22: 'Synaps unifies contracts, board minutes, and invoices into a live 3D Knowledge Graph.',
    s31: 'ASK ANYTHING IN <span class="cyan">NATURAL LANGUAGE</span>',
    s32: '"Who holds Contract X for Project Y?" $\\rightarrow$ Graph RAG traces exact entity paths with source proof.',
    s41: 'EXPLORE YOUR <span class="cyan">3D MEMORY GRAPH</span>',
    s42: 'Zero Hallucinations. 100% Line-Level Citation Accuracy.',
    url: 'synaps-one.vercel.app/dashboard/graph'
  },
  {
    filename: 'synaps_genz_carousel_3_boardroom',
    tag: '🏛️ 10-AGENT BOARDROOM',
    s11: 'MAKING $50K DECISIONS OFF <span class="indigo">RAW VIBES?</span>',
    s12: 'No cap, vibes are not an enterprise business strategy. 🧢',
    s21: 'GET A 10-MEMBER <span class="cyan">AI C-SUITE</span> IN YOUR CORNER',
    s22: 'Simulate decision reviews with CEO, CFO, Legal, Risk Officer & CTO agents before taking action.',
    s31: 'MULTI-ANGLE <span class="cyan">EXECUTIVE CONSENSUS</span>',
    s32: '💡 CFO checks budget limits, Legal checks liability caps, and Risk checks single-source supplier traps.',
    s41: 'SUMMON YOUR <span class="cyan">AI BOARDROOM</span>',
    s42: 'Executive Decision Alignment Engine Deployed Live.',
    url: 'synaps-one.vercel.app/dashboard/boardroom'
  }
];

function main() {
  for (const c of CAROUSELS) {
    const html = generateHTML(c.filename, c.tag, c.s11, c.s12, c.s21, c.s22, c.s31, c.s32, c.s41, c.s42, c.url);
    const htmlPath = path.join(__dirname, `${c.filename}.html`);
    const pdfPath = path.join(__dirname, `${c.filename}.pdf`);
    fs.writeFileSync(htmlPath, html);

    try {
      execSync(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless --disable-gpu --print-to-pdf="${pdfPath}" "file://${htmlPath}"`);
      console.log(`✅ GenZ Carousel created: ${pdfPath}`);
    } catch (e) {
      console.error("Chrome error:", e.message);
    }
  }
}

main();
