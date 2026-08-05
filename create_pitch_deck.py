import os
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfgen import canvas

class PitchDeckCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(PitchDeckCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super(PitchDeckCanvas, self).showPage()
        super(PitchDeckCanvas, self).save()

    def draw_decorations(self, page_count):
        self.saveState()
        
        # NOTE: NO full page background rect here so text is 100% visible!
        # Top banner accent line
        self.setFillColor(colors.HexColor('#4F46E5')) # Indigo
        self.rect(0, 598, 792, 14, fill=1, stroke=0)
        self.setFillColor(colors.HexColor('#0284C7')) # Cyan accent
        self.rect(0, 598, 260, 14, fill=1, stroke=0)

        # Bottom footer line
        self.setStrokeColor(colors.HexColor('#CBD5E1'))
        self.setLineWidth(1)
        self.line(36, 28, 756, 28)

        self.setFont("Helvetica-Bold", 10)
        self.setFillColor(colors.HexColor('#334155'))
        self.drawString(36, 12, "SYNAPS — Autonomous AI COO & Executive Intelligence OS")

        page_str = f"Slide {self._pageNumber} of {page_count}"
        self.drawRightString(756, 12, page_str)

        self.restoreState()

def build_pdf(filename="Synaps_Pitch_Deck_v2.pdf"):
    pdf_path = os.path.join(r"D:\Synaps", filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=landscape(letter), # 792 x 612
        leftMargin=36,
        rightMargin=36,
        topMargin=40,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # LARGE, BOLD, HIGH-CONTRAST TYPOGRAPHY
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=42,
        leading=48,
        textColor=colors.HexColor('#000000'),
        alignment=TA_LEFT
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=26,
        textColor=colors.HexColor('#4F46E5'),
        alignment=TA_LEFT
    )

    tagline_style = ParagraphStyle(
        'CoverTagline',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=20,
        textColor=colors.HexColor('#1E293B'),
        alignment=TA_LEFT
    )

    slide_title_style = ParagraphStyle(
        'SlideTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#000000'),
        alignment=TA_LEFT
    )

    slide_subtitle_style = ParagraphStyle(
        'SlideSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0284C7'),
        alignment=TA_LEFT
    )

    body_style = ParagraphStyle(
        'SlideBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=18,
        textColor=colors.HexColor('#000000')
    )

    card_header_style = ParagraphStyle(
        'CardHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#000000')
    )

    card_body_style = ParagraphStyle(
        'CardBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11.5,
        leading=16,
        textColor=colors.HexColor('#0F172A')
    )

    story = []

    # ==========================================
    # SLIDE 1: COVER SLIDE
    # ==========================================
    story.append(Spacer(1, 30))
    story.append(Paragraph("SYNAPS", title_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph("The Autonomous AI Chief Operating Officer (AI COO) OS", subtitle_style))
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=3, color=colors.HexColor('#4F46E5'), spaceAfter=18))
    story.append(Paragraph(
        "Transforming Fragmented Enterprise Documents, Contracts & Multi-Property Operations into Real-Time Spatial Decision Intelligence.",
        tagline_style
    ))
    story.append(Spacer(1, 40))

    meta_table_data = [
        [
            Paragraph("<b>Founder:</b> Shourya", card_body_style),
            Paragraph("<b>Live Platform:</b> synaps-one.vercel.app", card_body_style)
        ],
        [
            Paragraph("<b>Email:</b> novaecosystems@gmail.com", card_body_style),
            Paragraph("<b>Stage:</b> Pre-Seed / Live Production App", card_body_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[360, 360])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('PADDING', (0,0), (-1,-1), 14),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#94A3B8')),
    ]))
    story.append(meta_table)
    story.append(PageBreak())

    # ==========================================
    # SLIDE 2: ORIGIN & PROBLEM
    # ==========================================
    story.append(Paragraph("THE ORIGIN & PROBLEM", slide_subtitle_style))
    story.append(Paragraph("Operational Blindspots in Multi-Property Businesses", slide_title_style))
    story.append(Spacer(1, 15))

    p_data = [
        [
            Paragraph("<b>Personal Origin Story</b>", card_header_style),
            Paragraph("<b>The Global SMB & Enterprise Problem</b>", card_header_style)
        ],
        [
            Paragraph(
                "My father manages <b>3 hotels in India</b> overwhelmed with thousands of fragmented paper and digital documents: vendor SLAs, food & beverage compliance permits, staff rosters, and vendor invoices.<br/><br/>"
                "Without a unified operational system, crucial contract renewal dates pass, vendor price spikes go unnoticed, and leadership wastes hours answering routine operational queries.",
                card_body_style
            ),
            Paragraph(
                "• <b>30%+ Leadership Time Wasted:</b> Executives spend hours searching across drives, paper archives, and scattered emails for single compliance clauses.<br/><br/>"
                "• <b>$100K+ Annual Risk Leakage:</b> Unnoticed auto-renewals, compliance fines, and unvetted supplier rates erode net margins.<br/><br/>"
                "• <b>Zero Real-Time Visibility:</b> Multi-property owners lack a single dashboard to query overall operational health.",
                card_body_style
            )
        ]
    ]
    p_table = Table(p_data, colWidths=[355, 355])
    p_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('PADDING', (0,0), (-1,-1), 14),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#64748B')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
    ]))
    story.append(p_table)
    story.append(PageBreak())

    # ==========================================
    # SLIDE 3: THE SOLUTION
    # ==========================================
    story.append(Paragraph("THE SOLUTION", slide_subtitle_style))
    story.append(Paragraph("Synaps: Autonomous AI COO & 3D Spatial Knowledge OS", slide_title_style))
    story.append(Spacer(1, 15))

    sol_data = [
        [
            Paragraph("<b>1. Universal Ingestion</b>", card_header_style),
            Paragraph("<b>2. 3D Memory Lattice</b>", card_header_style),
            Paragraph("<b>3. 10-Agent Boardroom</b>", card_header_style)
        ],
        [
            Paragraph("Instant drag-and-drop parsing of PDFs, Word docs, spreadsheets, & compliance permits into clean vector embeddings.", card_body_style),
            Paragraph("Spatial entity-relationship graph mapping document nodes, vendor commitments, and operational dependencies.", card_body_style),
            Paragraph("Simulated AI C-Suite (CEO, CFO, CTO, Legal, HR) debating operational risks and voting in real time.", card_body_style)
        ]
    ]
    sol_table = Table(sol_data, colWidths=[230, 230, 230])
    sol_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('PADDING', (0,0), (-1,-1), 14),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#64748B')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EEF2FF')),
    ]))
    story.append(sol_table)

    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>Key Breakthrough:</b> Grounded RAG with strict document citations means 0 hallucination. Business owners get actionable answers with exact PDF page quotes.", body_style))
    story.append(PageBreak())

    # ==========================================
    # SLIDE 4: CORE PRODUCT FEATURES
    # ==========================================
    story.append(Paragraph("CORE PRODUCT ENGINE", slide_subtitle_style))
    story.append(Paragraph("Enterprise-Grade AI Architecture", slide_title_style))
    story.append(Spacer(1, 15))

    feat_data = [
        [
            Paragraph("Feature Component", card_header_style),
            Paragraph("Technical Implementation & Capability", card_header_style),
            Paragraph("Business Value", card_header_style)
        ],
        [
            Paragraph("<b>10-Agent C-Suite Boardroom</b>", card_body_style),
            Paragraph("Parallel multi-agent LLM router (Gemini 1.5, Llama 3.3 70B, GPT-4o Mini) evaluating strategy and voting.", card_body_style),
            Paragraph("Automates complex decision evaluations in seconds.", card_body_style)
        ],
        [
            Paragraph("<b>3D Memory Graph Visualizer</b>", card_body_style),
            Paragraph("React Three Fiber & Three.js spatial graph mapping decision dependencies and document nodes.", card_body_style),
            Paragraph("Visualizes hidden risks across multi-property networks.", card_body_style)
        ],
        [
            Paragraph("<b>Digital Twin Risk Simulator</b>", card_body_style),
            Paragraph("Monte Carlo probabilistic simulation testing operational stress points & budget variances.", card_body_style),
            Paragraph("Preempts financial & inventory supply chain bottlenecks.", card_body_style)
        ],
        [
            Paragraph("<b>Zero-Trust Tenant Isolation</b>", card_body_style),
            Paragraph("Cryptographically verified session-bound tenant scoping blocking cross-org access.", card_body_style),
            Paragraph("100% data privacy for confidential hotel & company records.", card_body_style)
        ]
    ]
    feat_table = Table(feat_data, colWidths=[180, 340, 190])
    feat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FFFFFF')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#64748B')),
    ]))
    story.append(feat_table)
    story.append(PageBreak())

    # ==========================================
    # SLIDE 5: MARKET OPPORTUNITY
    # ==========================================
    story.append(Paragraph("MARKET OPPORTUNITY", slide_subtitle_style))
    story.append(Paragraph("Tapping a $45B+ Global Operations & Hospitality Market", slide_title_style))
    story.append(Spacer(1, 15))

    mkt_data = [
        [
            Paragraph("<font size=28 color='#0284C7'><b>$45B+</b></font><br/><br/><b>Total Addressable Market (TAM)</b><br/>Global AI Operations, Contract Intelligence & Hospitality Management software market.", card_body_style),
            Paragraph("<font size=28 color='#4F46E5'><b>300,000+</b></font><br/><br/><b>Serviceable Market (SAM)</b><br/>Multi-property hotels, resorts, commercial real estate, and retail franchises in South Asia & APAC.", card_body_style),
            Paragraph("<font size=28 color='#059669'><b>15,000</b></font><br/><br/><b>Serviceable Obtainable Market (SOM)</b><br/>Initial target of 15,000 mid-market hospitality properties & SMB groups in Year 1-3.", card_body_style)
        ]
    ]
    mkt_table = Table(mkt_data, colWidths=[230, 230, 230])
    mkt_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('PADDING', (0,0), (-1,-1), 16),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#64748B')),
    ]))
    story.append(mkt_table)
    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>Target Customer Profile:</b> Independent Hotel Groups (2-10 properties), Franchise Operators, Commercial Property Managers, and Logistics/Retail SMBs overloaded with compliance paperwork.", body_style))
    story.append(PageBreak())

    # ==========================================
    # SLIDE 6: BUSINESS MODEL & MONETIZATION
    # ==========================================
    story.append(Paragraph("BUSINESS MODEL", slide_subtitle_style))
    story.append(Paragraph("SaaS B2B Subscription Tiers", slide_title_style))
    story.append(Spacer(1, 15))

    tier_data = [
        [
            Paragraph("<b>Starter Pro</b>", card_header_style),
            Paragraph("<b>Business Pro</b>", card_header_style),
            Paragraph("<b>Enterprise Vault</b>", card_header_style)
        ],
        [
            Paragraph("<font size=22 color='#0284C7'><b>$1.99 / week</b></font>", card_body_style),
            Paragraph("<font size=22 color='#4F46E5'><b>$49 / month</b></font>", card_body_style),
            Paragraph("<font size=22 color='#059669'><b>$499 / month</b></font>", card_body_style)
        ],
        [
            Paragraph("• Single Property / Node<br/>• Up to 50 Documents<br/>• Basic RAG Search & AI COO Answers<br/>• 500 Daily AI Credits", card_body_style),
            Paragraph("• Multi-Property Support (up to 5)<br/>• 10-Agent C-Suite Boardroom<br/>• 3D Memory Graph Visualizer<br/>• Unlimited Ingestion & Citations", card_body_style),
            Paragraph("• Unlimited Multi-Location Nodes<br/>• Digital Twin Risk Simulator OS<br/>• Dedicated AI Model Router<br/>• Priority SLA & On-Prem Options", card_body_style)
        ]
    ]
    tier_table = Table(tier_data, colWidths=[230, 230, 230])
    tier_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('PADDING', (0,0), (-1,-1), 14),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#64748B')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
    ]))
    story.append(tier_table)
    story.append(PageBreak())

    # ==========================================
    # SLIDE 7: COMPETITIVE ADVANTAGE
    # ==========================================
    story.append(Paragraph("COMPETITIVE LANDSCAPE", slide_subtitle_style))
    story.append(Paragraph("Why Synaps Wins", slide_title_style))
    story.append(Spacer(1, 15))

    comp_data = [
        [
            Paragraph("Dimension", card_header_style),
            Paragraph("Generic AI (ChatGPT / Claude)", card_header_style),
            Paragraph("Legacy ERPs (SAP / Oracle)", card_header_style),
            Paragraph("<b>SYNAPS AI COO OS</b>", card_header_style)
        ],
        [
            Paragraph("<b>Setup Time</b>", card_body_style),
            Paragraph("Instant", card_body_style),
            Paragraph("6-12 Months ($100K+ Implementation)", card_body_style),
            Paragraph("<font color='#059669'><b>Instant Drag & Drop (< 2 mins)</b></font>", card_body_style)
        ],
        [
            Paragraph("<b>Intelligence Level</b>", card_body_style),
            Paragraph("Single Chat Prompt Window", card_body_style),
            Paragraph("Static Relational Database Forms", card_body_style),
            Paragraph("<font color='#059669'><b>10-Agent Boardroom Consensus + 3D Memory Graph</b></font>", card_body_style)
        ],
        [
            Paragraph("<b>Document Citation</b>", card_body_style),
            Paragraph("Prone to Hallucinations", card_body_style),
            Paragraph("Manual Data Entry Required", card_body_style),
            Paragraph("<font color='#059669'><b>100% Grounded RAG with Direct PDF Quotes</b></font>", card_body_style)
        ],
        [
            Paragraph("<b>Cost</b>", card_body_style),
            Paragraph("$20/user/mo", card_body_style),
            Paragraph("$50,000+/year", card_body_style),
            Paragraph("<font color='#059669'><b>Flexible $1.99/wk to $49/mo</b></font>", card_body_style)
        ]
    ]
    comp_table = Table(comp_data, colWidths=[140, 180, 195, 195])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FFFFFF')),
        ('BACKGROUND', (3,0), (3,-1), colors.HexColor('#EEF2FF')), # Highlight Synaps
        ('PADDING', (0,0), (-1,-1), 10),
        ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#64748B')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(comp_table)
    story.append(PageBreak())

    # ==========================================
    # SLIDE 8: TRACTION & PRODUCTION STATUS
    # ==========================================
    story.append(Paragraph("TRACTION & MILESTONES", slide_subtitle_style))
    story.append(Paragraph("Live Production Product & Rapid Iteration", slide_title_style))
    story.append(Spacer(1, 15))

    trac_data = [
        [
            Paragraph("<b>Live Web Application</b>", card_header_style),
            Paragraph("<b>Multi-Model AI Infrastructure</b>", card_header_style),
            Paragraph("<b>Enterprise Data Security</b>", card_header_style)
        ],
        [
            Paragraph("Production web app live and deployed on Vercel at <b>synaps-one.vercel.app</b> with 3D RAG visualizer & smooth inertia WebGL interface.", card_body_style),
            Paragraph("Unified router deployed with instant failover across <b>Gemini 1.5 Flash</b>, <b>Groq Llama 3.3 70B</b>, and <b>GPT-4o Mini</b>.", card_body_style),
            Paragraph("Rate limiting and session-bound multi-tenant profile isolation active to block bot attacks and cross-org leaks.", card_body_style)
        ]
    ]
    trac_table = Table(trac_data, colWidths=[230, 230, 230])
    trac_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('PADDING', (0,0), (-1,-1), 14),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#64748B')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
    ]))
    story.append(trac_table)

    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>Initial Design Validation:</b> Tested against multi-property hospitality workflows (3 hotels in India), successfully extracting vendor contract obligations, SLA terms, and compliance timelines automatically.", body_style))
    story.append(PageBreak())

    # ==========================================
    # SLIDE 9: ROADMAP
    # ==========================================
    story.append(Paragraph("STRATEGIC ROADMAP", slide_subtitle_style))
    story.append(Paragraph("Execution Plan & Expansion Milestones", slide_title_style))
    story.append(Spacer(1, 15))

    road_data = [
        [
            Paragraph("<b>Q3 2026</b><br/><font color='#0284C7'>Hospitality Beta</font>", card_header_style),
            Paragraph("<b>Q4 2026</b><br/><font color='#4F46E5'>Multi-Region Scale</font>", card_header_style),
            Paragraph("<b>Q1 2027</b><br/><font color='#059669'>Enterprise Ecosystem</font>", card_header_style)
        ],
        [
            Paragraph("• Onboard 100 hotel & resort properties in India.<br/>• Launch WhatsApp & Email operational alert bots.<br/>• Fine-tune domain contract parsing models.", card_body_style),
            Paragraph("• Expand to commercial real estate & retail franchises.<br/>• Launch Digital Twin probabilistic stress engine.<br/>• Scale to $250K ARR.", card_body_style),
            Paragraph("• Roll out ERP integrations (Tally, QuickBooks, Opera PMS).<br/>• Launch Autonomous Vendor Re-negotiation AI.<br/>• Target $1.2M ARR.", card_body_style)
        ]
    ]
    road_table = Table(road_data, colWidths=[230, 230, 230])
    road_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('PADDING', (0,0), (-1,-1), 14),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#64748B')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
    ]))
    story.append(road_table)
    story.append(PageBreak())

    # ==========================================
    # SLIDE 10: THE ASK & CONTACT
    # ==========================================
    story.append(Spacer(1, 20))
    story.append(Paragraph("THE ASK & VISION", slide_subtitle_style))
    story.append(Paragraph("Join Us in Building the Operating System for Business Intelligence", slide_title_style))
    story.append(Spacer(1, 20))

    ask_data = [
        [
            Paragraph("<b>The Pre-Seed / Seed Ask</b>", card_header_style),
            Paragraph("<b>Contact & Next Steps</b>", card_header_style)
        ],
        [
            Paragraph(
                "• <b>Accelerate Customer Acquisition:</b> Expand sales onboarding for mid-market hotel groups & SMB operators across India & APAC.<br/><br/>"
                "• <b>Engineering & AI R&D:</b> Enhance autonomous agent reasoning, expanding automated vendor contract extraction and Memory Graph latency.<br/><br/>"
                "• <b>Vision:</b> Build the definitive AI COO platform that runs corporate operations autonomously.",
                card_body_style
            ),
            Paragraph(
                "<b>Founder:</b> Shourya<br/><br/>"
                "<b>Email:</b> novaecosystems@gmail.com<br/><br/>"
                "<b>Live Web App:</b> <font color='#0284C7'>synaps-one.vercel.app</font><br/><br/>"
                "<b>GitHub:</b> github.com/novaecosystems-cloud/Synaps",
                card_body_style
            )
        ]
    ]
    ask_table = Table(ask_data, colWidths=[355, 355])
    ask_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFFFF')),
        ('PADDING', (0,0), (-1,-1), 16),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 1.5, colors.HexColor('#64748B')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#E2E8F0')),
    ]))
    story.append(ask_table)

    # Build Document
    doc.build(story, canvasmaker=PitchDeckCanvas)
    print(f"Successfully generated clean pitch deck at: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
