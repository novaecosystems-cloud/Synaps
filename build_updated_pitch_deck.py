import os
import shutil
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import fitz # PyMuPDF for visual inspection

pdf_path = r"C:\Users\Shourya\Pictures\pitch deck\Synaps_Pitch_Deck_v3.pdf"
output_pdf_final = r"C:\Users\Shourya\Pictures\pitch deck\Synaps_Pitch_Deck.pdf"
img_dir = r"C:\Users\Shourya\Pictures\pitch deck"

# Callback to draw dark background and footer on every page
def draw_background_and_footer(canvas, doc):
    canvas.saveState()
    # Dark Background matching the uploaded image aesthetic
    canvas.setFillColor(colors.HexColor('#08090e'))
    canvas.rect(0, 0, 792, 612, fill=True, stroke=False)
    
    # Footer
    canvas.setFont("Helvetica-Bold", 9)
    canvas.setFillColor(colors.HexColor('#64748b'))
    canvas.drawString(36, 18, "SYNAPS AI · ASYNCHRONOUS INVESTOR PITCH DECK")
    canvas.drawRightString(792 - 36, 18, f"SLIDE {doc.page} / 8")
    canvas.setStrokeColor(colors.HexColor('#1e293b'))
    canvas.setLineWidth(0.5)
    canvas.line(36, 30, 792 - 36, 30)
    canvas.restoreState()

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=landscape(letter),
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=45
)

# Typography Styles implementing the 10-20-30 Rule (30pt+ Main Headers, 14-18pt Large Body Text)
title_style = ParagraphStyle(
    'CoverTitle',
    fontName='Times-Bold',
    fontSize=56,
    leading=64,
    textColor=colors.HexColor('#ffffff'),
    alignment=1
)

tag_style = ParagraphStyle(
    'TagStyle',
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=16,
    textColor=colors.HexColor('#38bdf8'),
    alignment=0
)

cover_tag_style = ParagraphStyle(
    'CoverTagStyle',
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=16,
    textColor=colors.HexColor('#38bdf8'),
    alignment=1
)

sub_style = ParagraphStyle(
    'CoverSub',
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=26,
    textColor=colors.HexColor('#cbd5e1'),
    alignment=1
)

# 30-Point Rule Slide Headings
h2_style = ParagraphStyle(
    'Header2',
    fontName='Times-Bold',
    fontSize=30,
    leading=36,
    textColor=colors.HexColor('#ffffff')
)

body_style = ParagraphStyle(
    'BodyDark',
    fontName='Helvetica',
    fontSize=13,
    leading=19,
    textColor=colors.HexColor('#cbd5e1')
)

story = []

# Large Card Helper with generous 30pt-rule typography
def make_card(header_text, body_text, border_color="#38bdf8", width=225):
    h = Paragraph(f"<b>{header_text}</b>", ParagraphStyle('CardH', fontName='Helvetica-Bold', fontSize=14.5, leading=19, textColor=colors.HexColor(border_color)))
    b = Paragraph(body_text, body_style)
    t = Table([[h], [b]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0f172a')),
        ('BOX', (0,0), (-1,-1), 2, colors.HexColor(border_color)),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 16),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    return t

# Images mapping
screenshots = sorted([os.path.join(img_dir, f) for f in os.listdir(img_dir) if f.endswith('.png') and not f.startswith('page_')])

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 1: COVER
# ─────────────────────────────────────────────────────────────────────────────
story.append(Spacer(1, 40))
story.append(Paragraph("ENTERPRISE DECISION INTELLIGENCE PLATFORM", cover_tag_style))
story.append(Spacer(1, 15))
story.append(Paragraph("SYNAPS AI", title_style))
story.append(Spacer(1, 15))
story.append(Paragraph("Turning Chaotic Corporate Data into Grounded 3D Knowledge Graphs &amp; Autonomous AI Boardrooms", sub_style))
story.append(Spacer(1, 35))

btn_table = Table([
    [
        Paragraph("<font color='#ffffff'><b>ZERO HALLUCINATIONS</b></font>", ParagraphStyle('Btn1', fontName='Times-Bold', fontSize=14, alignment=1)),
        Paragraph("<font color='#38bdf8'><b>LINE-LEVEL CITATIONS</b></font>", ParagraphStyle('Btn2', fontName='Times-Bold', fontSize=14, alignment=1))
    ]
], colWidths=[230, 230])
btn_table.setStyle(TableStyle([
    ('BOX', (0,0), (0,0), 2, colors.HexColor('#ffffff')),
    ('BOX', (1,0), (1,0), 2, colors.HexColor('#38bdf8')),
    ('PADDING', (0,0), (-1,-1), 12),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
]))
story.append(btn_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 2: THE REAL PROBLEM (LEGAL OFFICES & FRAGMENTED DATA)
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("THE REAL-WORLD PROBLEM", tag_style))
story.append(Spacer(1, 6))
story.append(Paragraph("THE CORPORATE DOCUMENT &amp; DATA PARALYSIS", h2_style))
story.append(Spacer(1, 20))

c1 = make_card("1. DROWNING IN HUGE DOCUMENTS", "Law firms, corporate legal offices, and executive teams manage 10,000+ complex PDFs, vendor contracts, and regulatory filings.<br/><br/><i>Pain: Crucial terms and liabilities get buried.</i>", "#f87171", 225)
c2 = make_card("2. FRAGMENTED &amp; SCATTERED DATA", "Critical company knowledge lives scattered across disconnected folders, spreadsheets, and emails with zero cross-linking.<br/><br/><i>Pain: Days lost manually searching for facts.</i>", "#f87171", 225)
c3 = make_card("3. HIGH RISK &amp; SLOW DECISIONS", "Manual contract auditing takes weeks, leading to missed compliance deadlines, delayed deals, and expensive oversight errors.<br/><br/><i>Pain: Decision paralysis across leadership.</i>", "#f87171", 225)

prob_table = Table([[c1, c2, c3]], colWidths=[235, 235, 235])
prob_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
story.append(prob_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 3: THE SYNAPS SOLUTION
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("THE SYNAPS SOLUTION", tag_style))
story.append(Spacer(1, 6))
story.append(Paragraph("3D KNOWLEDGE GRAPH &amp; AI BOARDROOM", h2_style))
story.append(Spacer(1, 20))

s1 = make_card("🌐 3D KNOWLEDGE GRAPH", "Connects every corporate contract, legal entity, and financial record into a live interactive 3D spatial memory palace.<br/><br/><i>Value: Instant visual clarity across all files.</i>", "#38bdf8", 225)
s2 = make_card("👔 10-AGENT AI BOARDROOM", "Dedicated executive agents (CEO, CFO, CTO, Legal, Compliance) debate strategic decisions with persistent memory.<br/><br/><i>Value: 360° multi-perspective risk auditing.</i>", "#34d399", 225)
s3 = make_card("🧮 PRIME RLM ENGINE", "Process-Outcome step verification achieving <b>99.4% math proof accuracy</b> on PutnamBench &amp; AIME benchmarks.<br/><br/><i>Value: Verifiable, line-level proof citations.</i>", "#fbbf24", 225)

sol_table = Table([[s1, s2, s3]], colWidths=[235, 235, 235])
sol_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
story.append(sol_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 4: FEATURE SHOWCASE - EXECUTIVE DASHBOARD
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("LIVE PRODUCT SHOWCASE", tag_style))
story.append(Spacer(1, 6))
story.append(Paragraph("EXECUTIVE DASHBOARD &amp; KNOWLEDGE INTELLIGENCE", h2_style))
story.append(Spacer(1, 18))

img0 = Image(screenshots[0], width=400, height=260) if len(screenshots) > 0 else Paragraph("Dashboard Image", body_style)

desc_card = make_card(
    "REAL-TIME OPERATIONAL COMMAND",
    "• <b>Fluid Dashboard Metrics:</b> Instant tracking of document ingestion, risk scores, and decision velocity.<br/><br/>"
    "• <b>Interactive Question Cards:</b> High-density executive review.<br/><br/>"
    "• <b>Mandatory Compliance Prompting:</b> Enforces legal SLA agreement before dashboard access.",
    "#38bdf8",
    300
)

feat1_table = Table([[img0, desc_card]], colWidths=[410, 310])
feat1_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(feat1_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 5: FEATURE SHOWCASE - CERTIFIED LEGAL SLA
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("ENTERPRISE COMPLIANCE", tag_style))
story.append(Spacer(1, 6))
story.append(Paragraph("CERTIFIED MASTER LEGAL SLA &amp; AUDIT TRAIL", h2_style))
story.append(Spacer(1, 18))

img2 = Image(screenshots[2], width=400, height=260) if len(screenshots) > 2 else Paragraph("Legal SLA Image", body_style)

sla_card = make_card(
    "MASTER CERTIFIED PDF LEGAL PACKET",
    "• <b>7 Complete Agreements:</b> ToS, Privacy, DPDP Act, Security SLA, Billing, AI Disclaimer, Cookies.<br/><br/>"
    "• <b>Master Audit Hash:</b> Cryptographic timestamp &amp; user email signature appended to exported PDFs.<br/><br/>"
    "• <b>Single-Click Download:</b> Instant client-side printable legal packet.",
    "#34d399",
    300
)

feat2_table = Table([[sla_card, img2]], colWidths=[310, 410])
feat2_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(feat2_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 6: FEATURE SHOWCASE - DIFFUSION STUDIO SUITE
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("MEDIA ARCHITECTURE", tag_style))
story.append(Spacer(1, 6))
story.append(Paragraph("INTEGRATED DIFFUSION STUDIO ENGINE", h2_style))
story.append(Spacer(1, 18))

img4 = Image(screenshots[4], width=400, height=260) if len(screenshots) > 4 else Paragraph("Studio Image", body_style)

studio_card = make_card(
    "BROWSER-BASED WEBGL MEDIA SUITE",
    "• <b>Non-Linear Video Editor:</b> Multitrack timeline composition with trimming &amp; splitting.<br/><br/>"
    "• <b>WebCodecs 60FPS Renderer:</b> Hardware-accelerated video export in WebM/MP4 format.<br/><br/>"
    "• <b>Kinetic Text:</b> Shader filters &amp; automated BGM rendering.",
    "#fbbf24",
    300
)

feat3_table = Table([[img4, studio_card]], colWidths=[410, 310])
feat3_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(feat3_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 7: CAPABILITY ADVANTAGE MATRIX
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("COMPETITIVE ADVANTAGE", tag_style))
story.append(Spacer(1, 6))
story.append(Paragraph("SYNAPS AI PLATFORM CAPABILITY ADVANTAGE", h2_style))
story.append(Spacer(1, 18))

matrix_body_style = ParagraphStyle(
    'MBodyDark',
    fontName='Helvetica',
    fontSize=11.5,
    leading=15.5,
    textColor=colors.HexColor('#cbd5e1')
)

matrix_data = [
    [
        Paragraph("<b>Enterprise Requirement</b>", ParagraphStyle('TH1', fontName='Times-Bold', fontSize=13, textColor=colors.HexColor('#38bdf8'))),
        Paragraph("<b>Traditional Manual &amp; Basic Tools</b>", ParagraphStyle('TH2', fontName='Times-Bold', fontSize=13, textColor=colors.HexColor('#f87171'))),
        Paragraph("<b>Synaps AI Platform</b>", ParagraphStyle('TH3', fontName='Times-Bold', fontSize=13, textColor=colors.HexColor('#34d399')))
    ],
    [
        Paragraph("<b>Math &amp; Fact Precision</b>", matrix_body_style),
        Paragraph("<font color='#f87171'>Slow manual audits / unverified guesswork</font>", matrix_body_style),
        Paragraph("<font color='#34d399'><b>99.4% PRIME RLM Proof Verification</b></font>", matrix_body_style)
    ],
    [
        Paragraph("<b>Source Auditability</b>", matrix_body_style),
        Paragraph("<font color='#f87171'>No line-level proof citations or hashes</font>", matrix_body_style),
        Paragraph("<font color='#34d399'><b>Exact Citations &amp; Audit Hashes</b></font>", matrix_body_style)
    ],
    [
        Paragraph("<b>Knowledge Architecture</b>", matrix_body_style),
        Paragraph("<font color='#f87171'>Disconnected folders &amp; isolated PDFs</font>", matrix_body_style),
        Paragraph("<font color='#34d399'><b>Interactive 3D Spatial Knowledge Graph</b></font>", matrix_body_style)
    ],
    [
        Paragraph("<b>Decision Reasoning</b>", matrix_body_style),
        Paragraph("<font color='#f87171'>Single-person bottleneck review</font>", matrix_body_style),
        Paragraph("<font color='#34d399'><b>10-Agent AI Boardroom Debate</b></font>", matrix_body_style)
    ],
    [
        Paragraph("<b>Legal &amp; Compliance</b>", matrix_body_style),
        Paragraph("<font color='#f87171'>No enterprise SLA / DPDP compliance</font>", matrix_body_style),
        Paragraph("<font color='#34d399'><b>Certified Master Legal SLA &amp; Audit Packet</b></font>", matrix_body_style)
    ]
]

matrix_table = Table(matrix_data, colWidths=[190, 250, 275])
matrix_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
    ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#1e293b')),
    ('PADDING', (0,0), (-1,-1), 10),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(matrix_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 8: THE ASK & FUNDING ALLOCATION (INR 50 LAKHS)
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("FUNDRAISING OVERVIEW", tag_style))
story.append(Spacer(1, 6))
story.append(Paragraph("PRE-SEED OFFERING &amp; USE OF FUNDS (INR 50L)", h2_style))
story.append(Spacer(1, 18))

ask_card = make_card(
    "OFFERING SUMMARY",
    "• <b>Target Raise:</b> INR 50 Lakhs ($60K USD)<br/><br/>"
    "• <b>Valuation Cap:</b> INR 4.5 Crore ($550K USD)<br/><br/>"
    "• <b>Instrument:</b> iSAFE / Convertible Note<br/><br/>"
    "• <b>Runway:</b> 15 Months Operational Runway",
    "#38bdf8",
    340
)

use_card = make_card(
    "USE OF FUNDS ALLOCATION (INR 50L)",
    "• <b>INR 25L (50%):</b> Engineering Talent &amp; Dev Jobs<br/><br/>"
    "• <b>INR 12L (24%):</b> GPU/LLM Infrastructure &amp; DB<br/><br/>"
    "• <b>INR 8L (16%):</b> B2B Sales &amp; Enterprise Marketing<br/><br/>"
    "• <b>INR 5L (10%):</b> DPDP/SOC 2 Legal &amp; Operational Reserve",
    "#34d399",
    340
)

final_table = Table([[ask_card, use_card]], colWidths=[355, 355])
final_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
story.append(final_table)

# Build Document with Callback
doc.build(story, onFirstPage=draw_background_and_footer, onLaterPages=draw_background_and_footer)
print("Updated Pitch Deck PDF generated successfully at:", pdf_path)

try:
    shutil.copyfile(pdf_path, output_pdf_final)
    print("Copied to main PDF path:", output_pdf_final)
except Exception as e:
    print("Note: Main PDF path locked by viewer, v3 PDF available:", e)

# Verify & convert pages to PNG preview
vdoc = fitz.open(pdf_path)
for i, page in enumerate(vdoc):
    pix = page.get_pixmap(dpi=150)
    out_png = os.path.join(img_dir, f"page_{i+1}.png")
    pix.save(out_png)
    print(f"Generated preview: {out_png}")
