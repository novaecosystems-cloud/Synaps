import os
import base64
import subprocess
import fitz # PyMuPDF for verification

pitch_dir = r"C:\Users\Shourya\Pictures\pitch deck"
output_html = os.path.join(pitch_dir, "deck.html")
output_pdf = os.path.join(pitch_dir, "Synaps_Pitch_Deck.pdf")

# Read and encode all PNG screenshots
images = {}
for fname in sorted(os.listdir(pitch_dir)):
    if fname.endswith(".png") and not fname.startswith("page_"):
        fpath = os.path.join(pitch_dir, fname)
        with open(fpath, "rb") as img_file:
            images[fname] = base64.b64encode(img_file.read()).decode("utf-8")

img_list = [images[k] for k in sorted(images.keys())]

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Synaps AI Pitch Deck</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap');

  @page {{
    size: 11in 8.5in;
    margin: 0;
  }}

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  html, body {{
    width: 11in;
    margin: 0;
    padding: 0;
    background-color: #08090e;
    color: #f8fafc;
    font-family: 'Plus Jakarta Sans', sans-serif;
    -webkit-print-color-adjust: exact;
  }}

  .slide {{
    width: 11in;
    height: 8.5in;
    page-break-after: always;
    break-after: page;
    page-break-inside: avoid;
    position: relative;
    overflow: hidden;
    background: #08090e;
    padding: 0.4in 0.5in;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  /* High contrast serif display headings matching the user prompt image */
  .serif-heading {{
    font-family: 'Cinzel', serif;
    font-weight: 900;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #ffffff;
    line-height: 1.2;
    font-size: 1.8rem;
  }}

  .badge-tag {{
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.9rem;
    border: 1.5px solid #38bdf8;
    border-radius: 9999px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    font-weight: 700;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }}

  .pill-btn {{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1.5rem;
    border: 2px solid #ffffff;
    font-family: 'Cinzel', serif;
    font-weight: 800;
    font-size: 0.95rem;
    color: #ffffff;
    background: transparent;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }}

  .content-body {{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 0.2in;
    margin-bottom: 0.2in;
  }}

  .grid-2 {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.3in;
    align-items: center;
  }}

  .grid-3 {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.25in;
    align-items: flex-start;
  }}

  .card {{
    background: #0f172a;
    border: 1.5px solid #1e293b;
    border-radius: 0.6rem;
    padding: 0.25in;
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.6);
  }}

  .card-highlight {{
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.85) 100%);
    border: 1.5px solid #38bdf8;
  }}

  .card-title {{
    font-size: 1.1rem;
    font-weight: 800;
    color: #38bdf8;
    margin-bottom: 0.1in;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }}

  .card-text {{
    font-size: 0.9rem;
    color: #cbd5e1;
    line-height: 1.45;
  }}

  .img-container {{
    width: 100%;
    height: 4.5in;
    border-radius: 0.6rem;
    border: 1.5px solid #334155;
    overflow: hidden;
    background: #000;
    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }}

  .img-container img {{
    width: 100%;
    height: 100%;
    object-fit: contain;
  }}

  .footer-bar {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #1e293b;
    padding-top: 0.1in;
    font-size: 0.75rem;
    color: #64748b;
    font-family: 'JetBrains Mono', monospace;
  }}

  table {{
    width: 100%;
    border-collapse: collapse;
  }}
  th, td {{
    padding: 0.15in 0.2in;
    text-align: left;
    border-bottom: 1px solid #1e293b;
    font-size: 0.9rem;
  }}
  th {{
    font-family: 'Cinzel', serif;
    color: #38bdf8;
    font-size: 0.95rem;
    text-transform: uppercase;
    background: #0f172a;
  }}
</style>
</head>
<body>

<!-- SLIDE 1: COVER -->
<div class="slide" style="background: radial-gradient(circle at center, #1e1b4b 0%, #050608 100%); text-align: center; justify-content: center; align-items: center;">
  <div style="margin-bottom: 0.2in;">
    <span class="badge-tag">ENTERPRISE DECISION INTELLIGENCE PLATFORM</span>
  </div>

  <h1 class="serif-heading" style="font-size: 3.5rem; margin-bottom: 0.2in;">SYNAPS AI</h1>

  <p style="font-size: 1.3rem; color: #94a3b8; max-width: 8.5in; line-height: 1.5; margin-bottom: 0.3in;">
    Turning Chaotic Corporate Data into Grounded 3D Knowledge Graphs &amp; Autonomous AI Boardrooms.
  </p>

  <div style="display: flex; gap: 0.2in; justify-content: center;">
    <div class="pill-btn">ZERO HALLUCINATIONS</div>
    <div class="pill-btn" style="border-color: #38bdf8; color: #38bdf8;">LINE-LEVEL CITATIONS</div>
  </div>

  <div style="position: absolute; bottom: 0.3in; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #64748b;">
    CONFIDENTIAL INVESTOR PITCH DECK · ASYNCHRONOUS OVERVIEW (2-MIN READ)
  </div>
</div>

<!-- SLIDE 2: THE PROBLEM -->
<div class="slide">
  <div>
    <span class="badge-tag">THE PROBLEM</span>
    <h2 class="serif-heading" style="margin-top: 0.1in;">WHY CHATGPT &amp; GENERIC LLMs FAIL IN THE ENTERPRISE</h2>
  </div>

  <div class="content-body">
    <div class="grid-3">
      <div class="card" style="border-top: 4px solid #f87171;">
        <div class="card-title" style="color: #f87171;">1. DANGEROUS HALLUCINATIONS</div>
        <p class="card-text">
          Standard LLMs guess figures and invent contract terms. In enterprise legal and finance, a single hallucinated line causes millions in liability.
        </p>
      </div>

      <div class="card" style="border-top: 4px solid #f87171;">
        <div class="card-title" style="color: #f87171;">2. NO LINE-LEVEL AUDIT TRAIL</div>
        <p class="card-text">
          Generic ChatGPT prompts give text answers without verifiable proof. Leaders cannot verify underlying contract sources or audit hashes.
        </p>
      </div>

      <div class="card" style="border-top: 4px solid #f87171;">
        <div class="card-title" style="color: #f87171;">3. STATELESS &amp; DISCONNECTED</div>
        <p class="card-text">
          Chatbots lack memory across 10,000+ corporate PDFs, spreadsheets, and vendor compliance filings across an enterprise.
        </p>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 02 / 08</span>
  </div>
</div>

<!-- SLIDE 3: THE SOLUTION -->
<div class="slide">
  <div>
    <span class="badge-tag">THE SYNAPS SOLUTION</span>
    <h2 class="serif-heading" style="margin-top: 0.1in;">THE GROUNDED 3D KNOWLEDGE GRAPH &amp; AI BOARDROOM</h2>
  </div>

  <div class="content-body">
    <div class="grid-3">
      <div class="card card-highlight">
        <div class="card-title" style="color: #38bdf8;">🌐 3D Knowledge Graph</div>
        <p class="card-text">
          Visualizes every corporate contract, vendor entity, and financial node in a live interactive 3D spatial memory palace.
        </p>
      </div>

      <div class="card card-highlight">
        <div class="card-title" style="color: #34d399;">👔 10-Agent AI Boardroom</div>
        <p class="card-text">
          Dedicated executive agents (CEO, CFO, CTO, Legal, Compliance) debate strategic decisions in parallel with persistent RLM memory.
        </p>
      </div>

      <div class="card card-highlight">
        <div class="card-title" style="color: #fbbf24;">🧮 PRIME RLM Engine</div>
        <p class="card-text">
          Process-Outcome step-by-step verification achieving <strong>99.4% math proof accuracy</strong> on PutnamBench &amp; AIME benchmarks.
        </p>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 03 / 08</span>
  </div>
</div>

<!-- SLIDE 4: DASHBOARD SHOWCASE -->
<div class="slide">
  <div>
    <span class="badge-tag">LIVE PRODUCT SHOWCASE</span>
    <h2 class="serif-heading" style="margin-top: 0.1in;">EXECUTIVE DASHBOARD &amp; KNOWLEDGE INTELLIGENCE</h2>
  </div>

  <div class="content-body">
    <div class="grid-2">
      <div class="img-container">
        <img src="data:image/png;base64,{img_list[0]}" alt="Dashboard Screenshot" />
      </div>
      <div class="card">
        <div class="card-title">Real-Time Operational Command</div>
        <div class="card-text" style="line-height: 1.7;">
          <p style="margin-bottom: 0.1in;">⚡ <strong>Fluid Dashboard Metrics:</strong> Instant tracking of document ingestion, risk alerts, and decision velocity.</p>
          <p style="margin-bottom: 0.1in;">🔍 <strong>Interactive Question Cards:</strong> Auto-wrapped titles &amp; status badges for high-density executive review.</p>
          <p>🔒 <strong>Mandatory Compliance Prompting:</strong> Enforces legal SLA agreement before dashboard access.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 04 / 08</span>
  </div>
</div>

<!-- SLIDE 5: LEGAL SLA SHOWCASE -->
<div class="slide">
  <div>
    <span class="badge-tag">ENTERPRISE COMPLIANCE</span>
    <h2 class="serif-heading" style="margin-top: 0.1in;">CERTIFIED MASTER LEGAL SLA &amp; IMMUTABLE AUDIT TRAIL</h2>
  </div>

  <div class="content-body">
    <div class="grid-2">
      <div class="card">
        <div class="card-title" style="color: #34d399;">Master Certified PDF Legal Packet</div>
        <div class="card-text" style="line-height: 1.7;">
          <p style="margin-bottom: 0.1in;">📜 <strong>7 Complete Legal Agreements:</strong> ToS, Privacy, DPDP Act, Security SLA, Billing, AI Disclaimer, Cookies.</p>
          <p style="margin-bottom: 0.1in;">🔏 <strong>Master Audit Hash:</strong> Cryptographic timestamp &amp; user email signature appended to exported PDFs.</p>
          <p>🌐 <strong>Single-Click Master PDF Download:</strong> Instant client-side printable legal packet.</p>
        </div>
      </div>
      <div class="img-container">
        <img src="data:image/png;base64,{img_list[2] if len(img_list) > 2 else img_list[0]}" alt="Legal SLA Screenshot" />
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 05 / 08</span>
  </div>
</div>

<!-- SLIDE 6: DIFFUSION STUDIO SHOWCASE -->
<div class="slide">
  <div>
    <span class="badge-tag">MEDIA ARCHITECTURE</span>
    <h2 class="serif-heading" style="margin-top: 0.1in;">INTEGRATED DIFFUSION STUDIO &amp; WEBCODECS ENGINE</h2>
  </div>

  <div class="content-body">
    <div class="grid-2">
      <div class="img-container">
        <img src="data:image/png;base64,{img_list[4] if len(img_list) > 4 else img_list[0]}" alt="Diffusion Studio Screenshot" />
      </div>
      <div class="card">
        <div class="card-title" style="color: #fbbf24;">Browser-Based WebGL Media Suite</div>
        <div class="card-text" style="line-height: 1.7;">
          <p style="margin-bottom: 0.1in;">🎬 <strong>Non-Linear Video Editor:</strong> Multitrack timeline composition with clip trimming &amp; splitting.</p>
          <p style="margin-bottom: 0.1in;">⚡ <strong>WebCodecs 60FPS Renderer:</strong> Fast hardware-accelerated video export in WebM/MP4 format.</p>
          <p>✨ <strong>Kinetic Animated Text:</strong> WebGL shader filters &amp; automated BGM soundtrack rendering.</p>
        </div>
      </div>
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
    <h2 class="serif-heading" style="margin-top: 0.1in;">SYNAPS AI VS. CHATGPT &amp; GENERIC RAG</h2>
  </div>

  <div class="content-body">
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
  </div>

  <div class="footer-bar">
    <span>SYNAPS AI · PITCH DECK</span>
    <span>SLIDE 07 / 08</span>
  </div>
</div>

<!-- SLIDE 8: THE ASK -->
<div class="slide" style="background: radial-gradient(circle at center, #0f172a 0%, #050608 100%);">
  <div>
    <span class="badge-tag">FUNDRAISING OVERVIEW</span>
    <h2 class="serif-heading" style="margin-top: 0.1in;">PRE-SEED / SEED OFFERING SUMMARY</h2>
  </div>

  <div class="content-body">
    <div class="grid-2">
      <div class="card card-highlight">
        <div class="card-title">Offering Summary</div>
        <div class="card-text" style="font-size: 1rem; line-height: 2;">
          <p>💰 <strong>Target Raise:</strong> ₹1.5 Crore ($180K USD)</p>
          <p>📈 <strong>Valuation Cap:</strong> ₹7.5 Crore ($900K USD)</p>
          <p>📜 <strong>Instrument:</strong> iSAFE / Convertible Note</p>
          <p>⏳ <strong>Runway:</strong> 18 Months Operational Runway</p>
        </div>
      </div>

      <div class="card">
        <div class="card-title" style="color: #34d399;">Use of Funds Allocation</div>
        <div class="card-text" style="font-size: 0.95rem; line-height: 2;">
          <p>👨‍💻 <strong>₹50L (33%):</strong> Core Tech Lead &amp; Engineering Talent</p>
          <p>📈 <strong>₹40L (27%):</strong> B2B Enterprise Marketing &amp; Sales Outreach</p>
          <p>⚡ <strong>₹35L (23%):</strong> GPU/LLM Infrastructure &amp; High-Speed DB</p>
          <p>🛡️ <strong>₹25L (17%):</strong> SOC 2 Certification &amp; Operational Reserve</p>
        </div>
      </div>
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

print("Updated 11in x 8.5in HTML Deck written to:", output_html)

# Convert to PDF via msedge
cmd = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--print-to-pdf-no-header",
    f"--print-to-pdf={output_pdf}",
    output_html
]

subprocess.run(cmd, check=True)
print("PDF Pitch Deck updated successfully at:", output_pdf)

# Convert PDF to PNGs using PyMuPDF to inspect every single page
doc = fitz.open(output_pdf)
print("Verifying PDF page count:", len(doc))
for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=150)
    out_img = os.path.join(pitch_dir, f"page_{i+1}.png")
    pix.save(out_img)
    print(f"Saved slide {i+1} preview to: {out_img}")
