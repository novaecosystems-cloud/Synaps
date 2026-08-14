import os
import base64
import subprocess

pitch_dir = r"C:\Users\Shourya\Pictures\pitch deck"
output_html = os.path.join(pitch_dir, "deck.html")
output_pdf = os.path.join(pitch_dir, "Synaps_Pitch_Deck.pdf")

# Get base64 encoded images
images = {}
for fname in sorted(os.listdir(pitch_dir)):
    if fname.endswith(".png"):
        fpath = os.path.join(pitch_dir, fname)
        with open(fpath, "rb") as img_file:
            images[fname] = base64.b64encode(img_file.read()).decode("utf-8")

img_keys = sorted(list(images.keys()))

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Synaps AI — Enterprise Pitch Deck</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap');

  @page {{
    size: 16in 9in;
    margin: 0;
  }}

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  body {{
    background-color: #050608;
    color: #f8fafc;
    font-family: 'Plus Jakarta Sans', sans-serif;
    -webkit-print-color-adjust: exact;
  }}

  .slide {{
    width: 16in;
    height: 9in;
    page-break-after: always;
    position: relative;
    overflow: hidden;
    background: #08090e;
    border: 1px solid #1e293b;
    padding: 3.5rem 4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  /* Typography matching the prompt's high-contrast serif display aesthetic */
  h1, h2, .serif-title {{
    font-family: 'Cinzel', serif;
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #ffffff;
    line-height: 1.1;
  }}

  .badge-tag {{
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1.2rem;
    border: 1px solid #38bdf8;
    border-radius: 9999px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.1);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }}

  .pill-btn {{
    display: inline-block;
    padding: 0.75rem 2rem;
    border: 2px solid #ffffff;
    font-family: 'Cinzel', serif;
    font-weight: 800;
    font-size: 1.1rem;
    color: #ffffff;
    background: transparent;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-right: 1rem;
  }}

  .grid-2 {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    flex: 1;
    margin-top: 1.5rem;
  }}

  .grid-3 {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
    flex: 1;
    margin-top: 1.5rem;
  }}

  .card {{
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 1.25rem;
    padding: 2rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  }}

  .card-highlight {{
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.8) 100%);
    border: 1px solid #38bdf8;
  }}

  .img-frame {{
    width: 100%;
    max-height: 5.2in;
    object-fit: contain;
    border-radius: 1rem;
    border: 1px solid #334155;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    background: #000;
  }}

  .footer-bar {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #1e293b;
    padding-top: 1.2rem;
    font-size: 0.85rem;
    color: #64748b;
    font-family: 'JetBrains Mono', monospace;
  }}

  .accent-blue {{ color: #38bdf8; }}
  .accent-emerald {{ color: #34d399; }}
  .accent-red {{ color: #f87171; }}

  table {{
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }}
  th, td {{
    padding: 1.2rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid #1e293b;
    font-size: 1rem;
  }}
  th {{
    font-family: 'Cinzel', serif;
    color: #38bdf8;
    font-size: 1.1rem;
    text-transform: uppercase;
  }}
</style>
</head>
<body>

<!-- SLIDE 1: COVER SLIDE -->
<div class="slide" style="justify-content: center; align-items: center; text-align: center; background: radial-gradient(circle at center, #1e1b4b 0%, #050608 100%);">
  <div style="margin-bottom: 2rem;">
    <span class="badge-tag">ENTERPRISE DECISION INTELLIGENCE PLATFORM</span>
  </div>
  
  <h1 style="font-size: 4.8rem; letter-spacing: 0.06em; margin-bottom: 1.5rem;">SYNAPS AI</h1>
  
  <p style="font-size: 1.8rem; color: #94a3b8; max-width: 900px; line-height: 1.5; margin-bottom: 3rem;">
    Turning Chaotic Corporate Data into Grounded 3D Knowledge Graphs &amp; Autonomous AI Boardrooms.
  </p>

  <div style="display: flex; justify-content: center; gap: 1.5rem;">
    <div class="pill-btn">ZERO HALLUCINATIONS</div>
    <div class="pill-btn" style="border-color: #38bdf8; color: #38bdf8;">LINE-LEVEL CITATIONS</div>
  </div>

  <div style="position: absolute; bottom: 3rem; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: #64748b;">
    CONFIDENTIAL PITCH DECK · ASYNCHRONOUS INVESTOR OVERVIEW (2-MIN READ)
  </div>
</div>

<!-- SLIDE 2: THE PROBLEM -->
<div class="slide">
  <div>
    <span class="badge-tag">THE PROBLEM</span>
    <h2 style="font-size: 2.8rem; margin-top: 0.8rem;">WHY CHATGPT &amp; GENERIC LLMs FAIL IN THE ENTERPRISE</h2>
  </div>

  <div class="grid-3">
    <div class="card" style="border-top: 4px solid #f87171;">
      <h3 style="font-size: 1.4rem; color: #f87171; font-weight: 800; margin-bottom: 1rem;">1. Dangerous Hallucinations</h3>
      <p style="font-size: 1rem; color: #94a3b8; line-height: 1.6;">
        Standard LLMs guess figures and invent contract clauses. In enterprise finance and legal, a single hallucinated line leads to millions in liability.
      </p>
    </div>

    <div class="card" style="border-top: 4px solid #f87171;">
      <h3 style="font-size: 1.4rem; color: #f87171; font-weight: 800; margin-bottom: 1rem;">2. No Line-Level Audit Trail</h3>
      <p style="font-size: 1rem; color: #94a3b8; line-height: 1.6;">
        Generic ChatGPT prompts give blind text answers without proof. Executives cannot audit where figures came from or verify underlying document sources.
      </p>
    </div>

    <div class="card" style="border-top: 4px solid #f87171;">
      <h3 style="font-size: 1.4rem; color: #f87171; font-weight: 800; margin-bottom: 1rem;">3. Stateless &amp; Disconnected</h3>
      <p style="font-size: 1rem; color: #94a3b8; line-height: 1.6;">
        Chatbots lack memory of inter-document relationships across 10,000+ PDFs, spreadsheets, and legal filings across an enterprise.
      </p>
    </div>
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 02 / 08</span>
  </div>
</div>

<!-- SLIDE 3: THE SOLUTION & DIFFERENTIATORS -->
<div class="slide">
  <div>
    <span class="badge-tag">THE SYNAPS SOLUTION</span>
    <h2 style="font-size: 2.8rem; margin-top: 0.8rem;">THE GROUNDED 3D KNOWLEDGE GRAPH &amp; AI BOARDROOM</h2>
  </div>

  <div class="grid-3">
    <div class="card card-highlight">
      <h3 style="font-size: 1.4rem; color: #38bdf8; font-weight: 800; margin-bottom: 1rem;">🌐 3D Knowledge Graph</h3>
      <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.6;">
        Visualizes every corporate contract, vendor entity, and financial node in a live interactive 3D spatial memory palace.
      </p>
    </div>

    <div class="card card-highlight">
      <h3 style="font-size: 1.4rem; color: #34d399; font-weight: 800; margin-bottom: 1rem;">👔 10-Agent AI Boardroom</h3>
      <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.6;">
        Dedicated executive agents (CEO, CFO, CTO, Legal, Compliance) debate strategic decisions in parallel with persistent RLM memory.
      </p>
    </div>

    <div class="card card-highlight">
      <h3 style="font-size: 1.4rem; color: #fbbf24; font-weight: 800; margin-bottom: 1rem;">🧮 PRIME RLM Engine</h3>
      <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.6;">
        Process-Outcome step-by-step verification achieving <strong>99.4% math proof accuracy</strong> on PutnamBench &amp; AIME benchmarks.
      </p>
    </div>
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 03 / 08</span>
  </div>
</div>

<!-- SLIDE 4: PRODUCT SHOWCASE - 3D GRAPH & DASHBOARD -->
<div class="slide">
  <div>
    <span class="badge-tag">LIVE PRODUCT SHOWCASE</span>
    <h2 style="font-size: 2.4rem; margin-top: 0.6rem;">EXECUTIVE DASHBOARD &amp; KNOWLEDGE INTELLIGENCE</h2>
  </div>

  <div class="grid-2">
    <div>
      <img src="data:image/png;base64,{images.get(img_keys[0], '')}" class="img-frame" alt="Dashboard Screenshot" />
    </div>
    <div className="card space-y-4">
      <h3 style="font-size: 1.6rem; color: #38bdf8; margin-bottom: 1rem;">Real-Time Operational Command</h3>
      <ul style="list-style: none; font-size: 1.05rem; color: #cbd5e1; line-height: 2;">
        <li>⚡ <strong>Fluid Dashboard Metrics:</strong> Instant tracking of document ingestion, risk alerts, and decision velocity.</li>
        <li>🔍 <strong>Interactive Question Cards:</strong> Auto-wrapped titles &amp; status badges for high-density executive review.</li>
        <li>🔒 <strong>Mandatory Compliance Prompting:</strong> Enforces legal SLA agreement before executive dashboard access.</li>
      </ul>
    </div>
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 04 / 08</span>
  </div>
</div>

<!-- SLIDE 5: PRODUCT SHOWCASE - 10 AGENT BOARDROOM & LEGAL SLA -->
<div class="slide">
  <div>
    <span class="badge-tag">ENTERPRISE SECURITY &amp; LEGAL SLA</span>
    <h2 style="font-size: 2.4rem; margin-top: 0.6rem;">CERTIFIED LEGAL SLA &amp; IMMUTABLE AUDIT TRAIL</h2>
  </div>

  <div class="grid-2">
    <div class="card">
      <h3 style="font-size: 1.6rem; color: #34d399; margin-bottom: 1rem;">Master Certified PDF Packet</h3>
      <ul style="list-style: none; font-size: 1.05rem; color: #cbd5e1; line-height: 2;">
        <li>📜 <strong>7 Complete Legal Agreements:</strong> ToS, Privacy, DPDP Act, Security SLA, Billing, AI Disclaimer, Cookies.</li>
        <li>🔏 <strong>Master Audit Hash:</strong> Cryptographic timestamp &amp; user email electronic signature appended to exported PDFs.</li>
        <li>🌐 <strong>Single-Click Master PDF Download:</strong> Instant client-side printable legal packet.</li>
      </ul>
    </div>
    <div>
      <img src="data:image/png;base64,{images.get(img_keys[2] if len(img_keys) > 2 else img_keys[0], '')}" class="img-frame" alt="Legal SLA Screenshot" />
    </div>
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 05 / 08</span>
  </div>
</div>

<!-- SLIDE 6: FEATURE SHOWCASE - MULTI-TRACK MEDIA & CREATOR STUDIO -->
<div class="slide">
  <div>
    <span class="badge-tag">EXTENSIBLE ARCHITECTURE</span>
    <h2 style="font-size: 2.4rem; margin-top: 0.6rem;">INTEGRATED DIFFUSION STUDIO &amp; WEBCODECS ENGINE</h2>
  </div>

  <div class="grid-2">
    <div>
      <img src="data:image/png;base64,{images.get(img_keys[4] if len(img_keys) > 4 else img_keys[0], '')}" class="img-frame" alt="Diffusion Studio Screenshot" />
    </div>
    <div class="card">
      <h3 style="font-size: 1.6rem; color: #fbbf24; margin-bottom: 1rem;">Browser-Based WebGL Media Suite</h3>
      <ul style="list-style: none; font-size: 1.05rem; color: #cbd5e1; line-height: 2;">
        <li>🎬 <strong>Non-Linear Video Editor:</strong> Multitrack timeline composition with trimming &amp; splitting.</li>
        <li>⚡ <strong>WebCodecs 60FPS Renderer:</strong> Fast hardware-accelerated video export in WebM/MP4 format.</li>
        <li>✨ <strong>Kinetic Animated Text:</strong> WebGL shader filters &amp; automated BGM soundtrack rendering.</li>
      </ul>
    </div>
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 06 / 08</span>
  </div>
</div>

<!-- SLIDE 7: DIFFERENTIATION MATRIX -->
<div class="slide">
  <div>
    <span class="badge-tag">COMPETITIVE ADVANTAGE</span>
    <h2 style="font-size: 2.4rem; margin-top: 0.6rem;">SYNAPS AI VS. CHATGPT &amp; GENERIC RAG</h2>
  </div>

  <table>
    <thead>
      <tr>
        <th>Capability / Feature</th>
        <th style="color: #f87171;">ChatGPT / Generic LLMs</th>
        <th style="color: #38bdf8;">Synaps AI Platform</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Math &amp; Fact Precision</strong></td>
        <td style="color: #f87171;">Hallucinates numerical calculations</td>
        <td style="color: #34d399;"><strong>99.4% PRIME RLM Proof Verification</strong></td>
      </tr>
      <tr>
        <td><strong>Source Auditability</strong></td>
        <td style="color: #f87171;">No line-level proof citations</td>
        <td style="color: #34d399;"><strong>Exact Line-Level Citations &amp; Audit Hashes</strong></td>
      </tr>
      <tr>
        <td><strong>Knowledge Architecture</strong></td>
        <td style="color: #f87171;">Stateless text-box window</td>
        <td style="color: #34d399;"><strong>Interactive 3D Spatial Knowledge Graph</strong></td>
      </tr>
      <tr>
        <td><strong>Decision Reasoning</strong></td>
        <td style="color: #f87171;">Single LLM perspective</td>
        <td style="color: #34d399;"><strong>10-Agent Executive AI Boardroom Debate</strong></td>
      </tr>
      <tr>
        <td><strong>Legal &amp; Compliance</strong></td>
        <td style="color: #f87171;">No enterprise SLA / DPDP compliance</td>
        <td style="color: #34d399;"><strong>Certified Master SLA &amp; Immutable Audit Trail</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 07 / 08</span>
  </div>
</div>

<!-- SLIDE 8: THE ASK & FUNDING ALLOCATION -->
<div class="slide" style="background: radial-gradient(circle at center, #0f172a 0%, #050608 100%);">
  <div>
    <span class="badge-tag">FUNDRAISING OVERVIEW</span>
    <h2 style="font-size: 2.8rem; margin-top: 0.8rem;">THE PRE-SEED / SEED OFFERING</h2>
  </div>

  <div class="grid-2">
    <div class="card card-highlight">
      <h3 style="font-size: 1.8rem; color: #38bdf8; margin-bottom: 1rem;">Round Summary</h3>
      <div style="font-size: 1.2rem; color: #ffffff; line-height: 2;">
        <p>💰 <strong>Target Raise:</strong> ₹1.5 Crore ($180K USD)</p>
        <p>📈 <strong>Valuation Cap:</strong> ₹7.5 Crore ($900K USD)</p>
        <p>📜 <strong>Instrument:</strong> iSAFE / Convertible Note</p>
        <p>⏳ <strong>Runway:</strong> 18 Months Operational Runway</p>
      </div>
    </div>

    <div class="card">
      <h3 style="font-size: 1.6rem; color: #34d399; margin-bottom: 1rem;">Use of Funds Breakdown</h3>
      <ul style="list-style: none; font-size: 1.05rem; color: #cbd5e1; line-height: 2.2;">
        <li>👨‍💻 <strong>₹50L (33%):</strong> Core Tech Lead &amp; Engineering Talent</li>
        <li>📈 <strong>₹40L (27%):</strong> B2B Enterprise Marketing &amp; Sales Outreach</li>
        <li>⚡ <strong>₹35L (23%):</strong> GPU/LLM Infrastructure &amp; High-Speed DB</li>
        <li>🛡️ <strong>₹25L (17%):</strong> SOC 2 Certification &amp; Operational Reserve</li>
      </ul>
    </div>
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK · CONTACT: founder@synaps.ai</span>
    <span>SLIDE 08 / 08</span>
  </div>
</div>

</body>
</html>
"""

with open(output_html, "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML Pitch Deck generated at:", output_html)

# Convert HTML to PDF using msedge headless
edge_cmd = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless",
    "--disable-gpu",
    "--print-to-pdf-no-header",
    f"--print-to-pdf={output_pdf}",
    output_html
]

subprocess.run(edge_cmd, check=True)
print("PDF Pitch Deck successfully created at:", output_pdf)
