import os
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

pdf_path = r"C:\Users\Shourya\Pictures\pitch deck\Synaps_Pitch_Deck.pdf"
img_dir = r"C:\Users\Shourya\Pictures\pitch deck"

# Custom Canvas Class to draw Dark Background on every page
class DarkCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self.pages)
        for page in self.pages:
            self.__dict__.update(page)
            self.draw_background()
            self.draw_footer(num_pages)
            super().showPage()
        super().save()

    def draw_background(self):
        self.saveState()
        self.setFillColor(colors.HexColor('#08090e'))
        self.rect(0, 0, 792, 612, fill=True, stroke=False)
        self.restoreState()

    def draw_footer(self, total_pages):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor('#64748b'))
        self.drawString(36, 20, "SYNAPS AI · ASYNCHRONOUS INVESTOR PITCH DECK")
        self.drawRightString(792 - 36, 20, f"SLIDE {self._pageNumber} / {total_pages}")
        self.setStrokeColor(colors.HexColor('#1e293b'))
        self.setLineWidth(0.5)
        self.line(36, 32, 792 - 36, 32)
        self.restoreState()

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=landscape(letter),
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=45
)

styles = getSampleStyleSheet()

# Typography Styles matching the prompt's high-contrast serif display aesthetic
title_style = ParagraphStyle(
    'CoverTitle',
    fontName='Times-Bold',
    fontSize=44,
    leading=50,
    textColor=colors.HexColor('#ffffff'),
    alignment=1
)

tag_style = ParagraphStyle(
    'TagStyle',
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=12,
    textColor=colors.HexColor('#38bdf8'),
    alignment=1
)

sub_style = ParagraphStyle(
    'CoverSub',
    fontName='Helvetica',
    fontSize=15,
    leading=22,
    textColor=colors.HexColor('#94a3b8'),
    alignment=1
)

h2_style = ParagraphStyle(
    'Header2',
    fontName='Times-Bold',
    fontSize=26,
    leading=30,
    textColor=colors.HexColor('#ffffff')
)

h3_style = ParagraphStyle(
    'Header3',
    fontName='Helvetica-Bold',
    fontSize=14,
    leading=18,
    textColor=colors.HexColor('#38bdf8')
)

body_style = ParagraphStyle(
    'BodyDark',
    fontName='Helvetica',
    fontSize=10.5,
    leading=15,
    textColor=colors.HexColor('#cbd5e1')
)

bold_body = ParagraphStyle(
    'BoldBodyDark',
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=16,
    textColor=colors.HexColor('#ffffff')
)

story = []

# helper function for visual cards
def make_card(header_text, body_text, border_color="#38bdf8"):
    h = Paragraph(f"<b>{header_text}</b>", ParagraphStyle('CardH', fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=colors.HexColor(border_color)))
    b = Paragraph(body_text, body_style)
    t = Table([[h], [b]], colWidths=[220])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0f172a')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(border_color)),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    return t

# Images mapping
screenshots = sorted([os.path.join(img_dir, f) for f in os.listdir(img_dir) if f.endswith('.png')])

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 1: COVER
# ─────────────────────────────────────────────────────────────────────────────
story.append(Spacer(1, 80))
story.append(Paragraph("ENTERPRISE DECISION INTELLIGENCE &amp; 3D KNOWLEDGE GRAPH", tag_style))
story.append(Spacer(1, 20))
story.append(Paragraph("SYNAPS AI", title_style))
story.append(Spacer(1, 15))
story.append(Paragraph("Turning Chaotic Corporate Data into Grounded 3D Knowledge Graphs &amp; Autonomous AI Boardrooms", sub_style))
story.append(Spacer(1, 40))

btn_table = Table([
    [
        Paragraph("<font color='#ffffff'><b>ZERO HALLUCINATIONS</b></font>", ParagraphStyle('Btn1', fontName='Times-Bold', fontSize=12, alignment=1)),
        Paragraph("<font color='#38bdf8'><b>LINE-LEVEL CITATIONS</b></font>", ParagraphStyle('Btn2', fontName='Times-Bold', fontSize=12, alignment=1))
    ]
], colWidths=[200, 200])
btn_table.setStyle(TableStyle([
    ('BOX', (0,0), (0,0), 1.5, colors.HexColor('#ffffff')),
    ('BOX', (1,0), (1,0), 1.5, colors.HexColor('#38bdf8')),
    ('PADDING', (0,0), (-1,-1), 10),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
]))
story.append(btn_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 2: THE PROBLEM (WHY CHATGPT FAILS)
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("THE PROBLEM", tag_style))
story.append(Spacer(1, 10))
story.append(Paragraph("WHY CHATGPT &amp; GENERIC LLMs FAIL IN THE ENTERPRISE", h2_style))
story.append(Spacer(1, 25))

c1 = make_card("1. DANGEROUS HALLUCINATIONS", "Standard LLMs guess figures and invent contract terms. In enterprise legal and finance, a single hallucinated line causes millions in liability.", "#f87171")
c2 = make_card("2. NO LINE-LEVEL AUDIT TRAIL", "Generic ChatGPT prompts give blind text answers without verifiable proof. Leaders cannot verify underlying contract sources.", "#f87171")
c3 = make_card("3. STATELESS &amp; DISCONNECTED", "Chatbots lack memory across 10,000+ corporate PDFs, spreadsheets, and vendor filings across an enterprise.", "#f87171")

prob_table = Table([[c1, c2, c3]], colWidths=[235, 235, 235])
prob_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
story.append(prob_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 3: THE SOLUTION & DIFFERENTIATORS
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("THE SYNAPS SOLUTION", tag_style))
story.append(Spacer(1, 10))
story.append(Paragraph("3D KNOWLEDGE GRAPH &amp; AUTONOMOUS AI BOARDROOM", h2_style))
story.append(Spacer(1, 25))

s1 = make_card("🌐 3D KNOWLEDGE GRAPH", "Visualizes every contract, vendor entity, and financial node in a live interactive 3D spatial memory palace.", "#38bdf8")
s2 = make_card("👔 10-AGENT AI BOARDROOM", "Dedicated executive agents (CEO, CFO, CTO, Legal, Compliance) debate strategic decisions with persistent RLM memory.", "#34d399")
s3 = make_card("🧮 PRIME RLM ENGINE", "Process-Outcome step-by-step verification achieving 99.4% math proof accuracy on PutnamBench &amp; AIME benchmarks.", "#fbbf24")

sol_table = Table([[s1, s2, s3]], colWidths=[235, 235, 235])
sol_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
story.append(sol_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 4: FEATURE SHOWCASE - EXECUTIVE DASHBOARD
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("LIVE PRODUCT SHOWCASE", tag_style))
story.append(Spacer(1, 10))
story.append(Paragraph("EXECUTIVE DASHBOARD &amp; KNOWLEDGE INTELLIGENCE", h2_style))
story.append(Spacer(1, 20))

img0 = Image(screenshots[0], width=380, height=240) if len(screenshots) > 0 else Paragraph("Dashboard Image", body_style)

desc_text = Paragraph(
    "<b>Real-Time Operational Command:</b><br/><br/>"
    "• <b>Fluid Dashboard Metrics:</b> Instant tracking of document ingestion, risk alerts, and decision velocity.<br/><br/>"
    "• <b>Interactive Question Cards:</b> Auto-wrapped titles &amp; status badges for high-density executive review.<br/><br/>"
    "• <b>Mandatory Compliance Prompting:</b> Enforces legal SLA agreement before dashboard access.",
    body_style
)

feat1_table = Table([[img0, desc_text]], colWidths=[400, 320])
feat1_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (1,0), (1,0), 20),
]))
story.append(feat1_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 5: FEATURE SHOWCASE - CERTIFIED LEGAL SLA
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("ENTERPRISE SECURITY &amp; LEGAL COMPLIANCE", tag_style))
story.append(Spacer(1, 10))
story.append(Paragraph("CERTIFIED MASTER LEGAL SLA &amp; IMMUTABLE AUDIT TRAIL", h2_style))
story.append(Spacer(1, 20))

img2 = Image(screenshots[2], width=380, height=240) if len(screenshots) > 2 else Paragraph("Legal SLA Image", body_style)

sla_text = Paragraph(
    "<b>Master Certified PDF Legal Packet:</b><br/><br/>"
    "• <b>7 Complete Legal Agreements:</b> ToS, Privacy, DPDP Act, Security SLA, Billing, AI Disclaimer, Cookies.<br/><br/>"
    "• <b>Master Audit Hash:</b> Cryptographic timestamp &amp; user email electronic signature appended to exported PDFs.<br/><br/>"
    "• <b>Single-Click Master PDF Download:</b> Instant client-side printable certified legal packet.",
    body_style
)

feat2_table = Table([[sla_text, img2]], colWidths=[320, 400])
feat2_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('RIGHTPADDING', (0,0), (0,0), 20),
]))
story.append(feat2_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 6: FEATURE SHOWCASE - DIFFUSION STUDIO SUITE
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("EXTENSIBLE MEDIA ARCHITECTURE", tag_style))
story.append(Spacer(1, 10))
story.append(Paragraph("INTEGRATED DIFFUSION STUDIO &amp; WEBCODECS ENGINE", h2_style))
story.append(Spacer(1, 20))

img4 = Image(screenshots[4], width=380, height=240) if len(screenshots) > 4 else Paragraph("Studio Image", body_style)

studio_text = Paragraph(
    "<b>Browser-Based WebGL Media Suite:</b><br/><br/>"
    "• <b>Non-Linear Video Editor:</b> Multitrack timeline composition with clip trimming &amp; splitting.<br/><br/>"
    "• <b>WebCodecs 60FPS Renderer:</b> Fast hardware-accelerated video export in WebM/MP4 format.<br/><br/>"
    "• <b>Kinetic Animated Text:</b> WebGL shader filters &amp; automated BGM soundtrack rendering.",
    body_style
)

feat3_table = Table([[img4, studio_text]], colWidths=[400, 320])
feat3_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (1,0), (1,0), 20),
]))
story.append(feat3_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 7: DIFFERENTIATION MATRIX VS CHATGPT
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("COMPETITIVE ADVANTAGE", tag_style))
story.append(Spacer(1, 10))
story.append(Paragraph("SYNAPS AI VS. CHATGPT &amp; GENERIC RAG", h2_style))
story.append(Spacer(1, 20))

matrix_data = [
    [
        Paragraph("<b>Capability / Feature</b>", ParagraphStyle('TH1', fontName='Times-Bold', fontSize=11, textColor=colors.HexColor('#38bdf8'))),
        Paragraph("<b>ChatGPT / Generic LLMs</b>", ParagraphStyle('TH2', fontName='Times-Bold', fontSize=11, textColor=colors.HexColor('#f87171'))),
        Paragraph("<b>Synaps AI Platform</b>", ParagraphStyle('TH3', fontName='Times-Bold', fontSize=11, textColor=colors.HexColor('#34d399')))
    ],
    [
        Paragraph("<b>Math &amp; Fact Precision</b>", body_style),
        Paragraph("<font color='#f87171'>Hallucinates numerical calculations</font>", body_style),
        Paragraph("<font color='#34d399'><b>99.4% PRIME RLM Proof Verification</b></font>", body_style)
    ],
    [
        Paragraph("<b>Source Auditability</b>", body_style),
        Paragraph("<font color='#f87171'>No line-level proof citations</font>", body_style),
        Paragraph("<font color='#34d399'><b>Exact Line-Level Citations &amp; Audit Hashes</b></font>", body_style)
    ],
    [
        Paragraph("<b>Knowledge Architecture</b>", body_style),
        Paragraph("<font color='#f87171'>Stateless text-box window</font>", body_style),
        Paragraph("<font color='#34d399'><b>Interactive 3D Spatial Knowledge Graph</b></font>", body_style)
    ],
    [
        Paragraph("<b>Decision Reasoning</b>", body_style),
        Paragraph("<font color='#f87171'>Single LLM perspective</font>", body_style),
        Paragraph("<font color='#34d399'><b>10-Agent Executive AI Boardroom Debate</b></font>", body_style)
    ],
    [
        Paragraph("<b>Legal &amp; Compliance</b>", body_style),
        Paragraph("<font color='#f87171'>No enterprise SLA / DPDP compliance</font>", body_style),
        Paragraph("<font color='#34d399'><b>Certified Master SLA &amp; Immutable Audit Trail</b></font>", body_style)
    ]
]

matrix_table = Table(matrix_data, colWidths=[200, 250, 270])
matrix_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
    ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#1e293b')),
    ('PADDING', (0,0), (-1,-1), 10),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(matrix_table)
story.append(PageBreak())

# ─────────────────────────────────────────────────────────────────────────────
# SLIDE 8: THE ASK & FUNDING ALLOCATION
# ─────────────────────────────────────────────────────────────────────────────
story.append(Paragraph("FUNDRAISING OVERVIEW", tag_style))
story.append(Spacer(1, 10))
story.append(Paragraph("PRE-SEED / SEED OFFERING SUMMARY", h2_style))
story.append(Spacer(1, 20))

ask_card = make_card(
    "OFFERING SUMMARY",
    "• <b>Target Raise:</b> ₹1.5 Crore ($180K USD)<br/>"
    "• <b>Valuation Cap:</b> ₹7.5 Crore ($900K USD)<br/>"
    "• <b>Instrument:</b> iSAFE / Convertible Note<br/>"
    "• <b>Runway:</b> 18 Months Operational Runway",
    "#38bdf8"
)

use_card = make_card(
    "USE OF FUNDS ALLOCATION",
    "• <b>₹50L (33%):</b> Core Tech Lead &amp; Engineering Talent<br/>"
    "• <b>₹40L (27%):</b> B2B Enterprise Marketing &amp; Sales Outreach<br/>"
    "• <b>₹35L (23%):</b> GPU/LLM Infrastructure &amp; High-Speed DB<br/>"
    "• <b>₹25L (17%):</b> SOC 2 Certification &amp; Operational Reserve",
    "#34d399"
)

final_table = Table([[ask_card, use_card]], colWidths=[350, 350])
final_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
story.append(final_table)

# Build Document with Dark Canvas
doc.build(story, canvasmaker=DarkCanvas)
print("Publication Pitch Deck PDF created successfully at:", pdf_path)
