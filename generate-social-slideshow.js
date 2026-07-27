const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Synaps AI — Social Carousel</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    @page { size: 1080px 1350px; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0; padding: 0;
      font-family: 'Space Grotesk', sans-serif;
      background-color: #07090e;
      color: #ffffff;
      -webkit-print-color-adjust: exact;
    }
    .slide {
      width: 1080px; height: 1350px;
      page-break-after: always;
      padding: 90px 80px;
      display: flex; flex-direction: column;
      justify-content: space-between;
      position: relative;
      background: radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.2), transparent 50%),
                  radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.15), transparent 50%),
                  #07090e;
    }
    .badge {
      display: inline-block;
      padding: 10px 24px;
      border-radius: 9999px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      color: #fbbf24; font-size: 18px; font-weight: 800;
      letter-spacing: 2px; text-transform: uppercase;
    }
    .title {
      font-family: 'Unbounded', sans-serif;
      font-size: 58px; font-weight: 900;
      line-height: 1.15; text-transform: uppercase;
      margin: 30px 0;
      color: #ffffff;
    }
    .amber { color: #fbbf24; }
    .indigo { color: #818cf8; }
    .desc {
      font-size: 26px; color: #94a3b8;
      line-height: 1.6; font-weight: 400;
    }
    .box {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px; padding: 40px; margin-top: 30px;
    }
    .box-title { font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }
    .box-desc { font-size: 22px; color: #cbd5e1; line-height: 1.5; }
    .footer {
      display: flex; justify-content: space-between; align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 30px; font-size: 20px; color: #64748b; font-weight: 700;
    }
  </style>
</head>
<body>

  <!-- SLIDE 1: HOOK (INSTAGRAM / REDDIT) -->
  <div class="slide">
    <div>
      <span class="badge">🔥 B2B Legal Hack</span>
      <h1 class="title">How Hotels & SMBs Lose <span class="amber">$50,000+</span> to Buried Contract Traps</h1>
      <p class="desc">90% of business owners sign vendor agreements without reading Section 4.2 auto-renewals. Here is how AI redlines it in 60 seconds. 🧵👇</p>
    </div>
    <div class="footer">
      <span>SYNAPS AI</span>
      <span>Swipe ➡️</span>
    </div>
  </div>

  <!-- SLIDE 2: THE PROBLEM -->
  <div class="slide">
    <div>
      <span class="badge">⚠️ The Trap</span>
      <h1 class="title">The 3 Predatory Clauses Hidden in 40-Page PDFs</h1>
      <div class="box">
        <div class="box-title">1. Multi-Year Auto-Lock-In</div>
        <div class="box-desc">Miss a 10-day cancellation window? You're locked in for another 3 years automatically.</div>
      </div>
      <div class="box">
        <div class="box-title">2. 25% Cancellation Penalties</div>
        <div class="box-desc">Hidden termination fees that force you to pay for unused software or freight services.</div>
      </div>
      <div class="box">
        <div class="box-title">3. Single-Source Supply Trap</div>
        <div class="box-desc">Zero liability caps if the vendor delays your component supply chain.</div>
      </div>
    </div>
    <div class="footer">
      <span>SYNAPS AI</span>
      <span>Swipe ➡️</span>
    </div>
  </div>

  <!-- SLIDE 3: THE SOLUTION -->
  <div class="slide">
    <div>
      <span class="badge">⚡ The Fix</span>
      <h1 class="title">Upload Document $\rightarrow$ Get Safer Counter-Terms in <span class="indigo">60 Seconds</span></h1>
      <p class="desc">Synaps AI scans any PDF contract, flags predatory terms, and writes safer counter-clauses with 100% line-level citations.</p>
      <div class="box" style="border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.08);">
        <div class="box-title" style="color: #34d399;">✅ Proposed Redline</div>
        <div class="box-desc" style="font-family: monospace; color: #ffffff;">"Agreement renews on a month-to-month basis with 30 days written notice. Liability capped at 12 months fees."</div>
      </div>
    </div>
    <div class="footer">
      <span>SYNAPS AI</span>
      <span>Swipe ➡️</span>
    </div>
  </div>

  <!-- SLIDE 4: THE PROOF / FOUNDER -->
  <div class="slide">
    <div>
      <span class="badge">🚀 Built with Domain Passion</span>
      <h1 class="title">Built by a <span class="amber">12th-Grade Founder</span> in Pune, India</h1>
      <p class="desc">Inspired by watching my father manage 3 hotels in India and struggle with endless vendor contract burden.</p>
      <div class="box">
        <div class="box-title">Zero Model Training Required</div>
        <div class="box-desc">Works instantly on any NDA, hotel vendor lease, software agreement, or supplier contract.</div>
      </div>
    </div>
    <div class="footer">
      <span>SYNAPS AI</span>
      <span>Swipe ➡️</span>
    </div>
  </div>

  <!-- SLIDE 5: CTA -->
  <div class="slide">
    <div>
      <span class="badge">🌐 Try It Free</span>
      <h1 class="title">Test 60-Second Contract Redlining <span class="indigo">Live Today</span></h1>
      <p class="desc">Paste your first document and get line-level risk review in under 60 seconds.</p>
      <div class="box" style="border-color: #f59e0b; background: rgba(245, 158, 11, 0.1);">
        <div class="box-title" style="color: #fbbf24; font-size: 32px;">synaps-one.vercel.app</div>
        <div class="box-desc" style="color: #ffffff;">Free Instant Demo — No Credit Card Required</div>
      </div>
    </div>
    <div class="footer">
      <span>SYNAPS AI</span>
      <span>Link in Bio 🔗</span>
    </div>
  </div>

</body>
</html>
`;

async function main() {
  const htmlPath = path.join(__dirname, 'social-carousel.html');
  const pdfPath = path.join(__dirname, 'synaps_social_carousel.pdf');
  fs.writeFileSync(htmlPath, htmlContent);

  try {
    execSync(`"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --headless --disable-gpu --print-to-pdf="${pdfPath}" "file://${htmlPath}"`);
    console.log(`✅ Social Carousel PDF created at: ${pdfPath}`);
  } catch (e) {
    console.error("Chrome error:", e.message);
  }
}

main();
