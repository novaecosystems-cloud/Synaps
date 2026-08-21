import os
import sys
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

OUTPUT_PDF = r"D:\Synaps\output\Causarix_Seed_Pitch_Deck_Shourya_Shetty.pdf"
ARTIFACT_PDF = r"C:\Users\Shourya\.gemini\antigravity\brain\8c69c067-7f2a-4c02-970e-2c2af20dab71\Causarix_Seed_Pitch_Deck_Shourya_Shetty.pdf"

os.makedirs(r"D:\Synaps\output", exist_ok=True)

# 16:9 Presentation Dimensions in Points (10 inches x 5.625 inches -> 720 x 405 pt)
WIDTH = 720
HEIGHT = 405

# ── LUXURY TECH COLOR PALETTE ────────────────────────────────────────────────
BG_DARK = colors.HexColor("#0A0A0E")
BG_CARD = colors.HexColor("#12131A")
BG_CARD_BORDER = colors.HexColor("#222638")
TEXT_WHITE = colors.HexColor("#F3F2EE")
TEXT_MUTED = colors.HexColor("#94A3B8")
TEXT_DIM = colors.HexColor("#64748B")
PRIMARY_BLUE = colors.HexColor("#2D4EFF")
ACCENT_CYAN = colors.HexColor("#06B6D4")
ACCENT_GREEN = colors.HexColor("#10B981")
ACCENT_RED = colors.HexColor("#EF4444")
ACCENT_PURPLE = colors.HexColor("#A855F7")
ACCENT_AMBER = colors.HexColor("#F59E0B")

class SlideDeck:
    def __init__(self, filename):
        self.c = canvas.Canvas(filename, pagesize=(WIDTH, HEIGHT))
        self.styles = getSampleStyleSheet()

    def draw_background(self, slide_num, total_slides=10, category="CAUSARIX"):
        # Dark Obsidian Canvas
        self.c.setFillColor(BG_DARK)
        self.c.rect(0, 0, WIDTH, HEIGHT, fill=True, stroke=False)

        # Subtle Ambient Radial Gradient / Accent Line
        self.c.setStrokeColor(PRIMARY_BLUE)
        self.c.setLineWidth(2)
        self.c.line(40, HEIGHT - 20, 140, HEIGHT - 20)

        # Slide Category & Pagination
        self.c.setFont("Helvetica-Bold", 8)
        self.c.setFillColor(PRIMARY_BLUE)
        self.c.drawString(40, HEIGHT - 32, category.upper())

        self.c.setFont("Helvetica", 8)
        self.c.setFillColor(TEXT_DIM)
        self.c.drawRightString(WIDTH - 40, HEIGHT - 32, f"{slide_num:02d} / {total_slides:02d}")

        # Bottom Footer Watermark
        self.c.setStrokeColor(colors.HexColor("#181B26"))
        self.c.setLineWidth(1)
        self.c.line(40, 30, WIDTH - 40, 30)

        self.c.setFont("Helvetica-Bold", 8)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, 18, "CAUSARIX")
        
        self.c.setFont("Helvetica", 8)
        self.c.setFillColor(TEXT_DIM)
        self.c.drawString(100, 18, "· The Autonomous Decision Intelligence OS")
        self.c.drawRightString(WIDTH - 40, 18, "causarix.vercel.app · Confidential Pitch Deck")

    def draw_card(self, x, y, w, h, border_color=BG_CARD_BORDER, fill_color=BG_CARD, radius=6):
        self.c.setFillColor(fill_color)
        self.c.setStrokeColor(border_color)
        self.c.setLineWidth(1)
        self.c.roundRect(x, y, w, h, radius, fill=True, stroke=True)

    def draw_badge(self, x, y, text, color=PRIMARY_BLUE, text_color=TEXT_WHITE):
        self.c.setFont("Helvetica-Bold", 7)
        tw = self.c.stringWidth(text, "Helvetica-Bold", 7)
        self.c.setFillColor(colors.HexColor("#1E2235"))
        self.c.setStrokeColor(color)
        self.c.setLineWidth(1)
        self.c.roundRect(x, y - 3, tw + 14, 14, 4, fill=True, stroke=True)
        self.c.setFillColor(color)
        self.c.drawString(x + 7, y + 1, text)
        return tw + 14

    # ── SLIDE 1: COVER ────────────────────────────────────────────────────────
    def slide_1_cover(self):
        self.draw_background(1, category="EXECUTIVE BRIEFING · SEED DECK")

        # Top Badge
        self.draw_badge(40, HEIGHT - 75, "SOVEREIGN DECISION INTELLIGENCE", PRIMARY_BLUE)

        # Huge Title
        self.c.setFont("Helvetica-Bold", 38)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(40, HEIGHT - 125, "CAUSARIX")

        # Subtitle
        self.c.setFont("Helvetica-Bold", 16)
        self.c.setFillColor(ACCENT_CYAN)
        self.c.drawString(40, HEIGHT - 150, "The Autonomous Enterprise Decision Intelligence Operating System")

        # Description
        self.c.setFont("Helvetica", 11)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, HEIGHT - 175, "Mathematical Pearl Do-Calculus Causal Modeling & 10-Agent Adversarial Deliberation.")
        self.c.drawString(40, HEIGHT - 192, "Engineering the outcome of high-stakes enterprise decisions before you sign or spend.")

        # 3 Key Value Metric Cards
        card_y = 65
        card_w = (WIDTH - 80 - 24) / 3
        card_h = 105

        metrics = [
            ("0.00% DRIFT", "Deterministic Python SCM", "Guarantees zero calculation error on EBITDA & cash runway.", ACCENT_GREEN),
            ("100% SHA-256", "Line-Level Citations", "Exact cryptographic coordinates across all contracts & MSAs.", ACCENT_CYAN),
            ("10-AGENT FORUM", "Delaware DGCL § 141", "Full boardroom quorum consensus with fiduciary liability shield.", PRIMARY_BLUE)
        ]

        for i, (stat, title, desc, col) in enumerate(metrics):
            cx = 40 + i * (card_w + 12)
            self.draw_card(cx, card_y, card_w, card_h, border_color=col)
            
            # Left vertical stripe
            self.c.setFillColor(col)
            self.c.rect(cx, card_y, 4, card_h, fill=True, stroke=False)

            self.c.setFont("Helvetica-Bold", 13)
            self.c.setFillColor(col)
            self.c.drawString(cx + 14, card_y + 80, stat)

            self.c.setFont("Helvetica-Bold", 10)
            self.c.setFillColor(TEXT_WHITE)
            self.c.drawString(cx + 14, card_y + 60, title)

            self.c.setFont("Helvetica", 8)
            self.c.setFillColor(TEXT_MUTED)
            self.c.drawString(cx + 14, card_y + 40, desc[:36])
            self.c.drawString(cx + 14, card_y + 28, desc[36:])

        self.c.showPage()

    # ── SLIDE 2: THE FOUNDER ──────────────────────────────────────────────────
    def slide_2_founder(self):
        self.draw_background(2, category="LEADERSHIP & ARCHITECTURE")

        self.c.setFont("Helvetica-Bold", 22)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(40, HEIGHT - 70, "The Solo Founder")

        self.c.setFont("Helvetica", 11)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, HEIGHT - 90, "Pure deep-tech engineering velocity with zero agency bloat.")

        # Left Column: Profile Card
        left_w = 260
        left_h = 240
        self.draw_card(40, 55, left_w, left_h, border_color=PRIMARY_BLUE)

        self.draw_badge(55, 55 + left_h - 25, "SOLO FOUNDER & ARCHITECT", PRIMARY_BLUE)

        self.c.setFont("Helvetica-Bold", 20)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(55, 55 + left_h - 55, "Shourya Shetty")

        self.c.setFont("Helvetica-Bold", 11)
        self.c.setFillColor(ACCENT_CYAN)
        self.c.drawString(55, 55 + left_h - 75, "17 Years Old · Pune, India")

        # Founder Facts Box
        facts = [
            ("Role", "Solo Founder & Full-Stack Deep-Tech Builder"),
            ("Location", "Pune, Maharashtra, India"),
            ("Age", "17 Years Old"),
            ("Architecture", "Engineered Causarix OS End-to-End"),
            ("Execution", "Shipped SCM Compiler, 10-Agent Forum & 3D Graph")
        ]

        fy = 55 + left_h - 105
        for label, val in facts:
            self.c.setFont("Helvetica-Bold", 8)
            self.c.setFillColor(TEXT_DIM)
            self.c.drawString(55, fy, label.upper())

            self.c.setFont("Helvetica", 9)
            self.c.setFillColor(TEXT_WHITE)
            self.c.drawString(130, fy, val)
            fy -= 24

        # Right Column: Why Solo Deep-Tech Is an Unfair Advantage
        right_x = 320
        right_w = WIDTH - right_x - 40
        self.draw_card(right_x, 55, right_w, left_h)

        self.c.setFont("Helvetica-Bold", 13)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(right_x + 20, 55 + left_h - 30, "The Unfair Advantage: 10x Engineering Velocity")

        points = [
            ("⚡ Autonomous Execution Stamina", "Architected the complete structural causal equation compiler, 10-agent consensus engine, and PostgreSQL/Prisma multi-tenant pipeline single-handedly."),
            ("🧠 Zero Bureaucracy & Infinite Agility", "Iterates in hours what traditional enterprise software teams debate for quarters. Zero bloated agency overhead or management drag."),
            ("🎯 Deep-Tech Native Focus", "Obsessed with mathematical rigor: Judea Pearl Do-Calculus, Delaware statutory law, and deterministic Python arithmetic rather than naive wrapper slop."),
            ("💎 Extreme Capital Efficiency", "Every dollar invested goes directly into GPU inference compute, proprietary compiler optimization, and high-margin enterprise GTM.")
        ]

        py = 55 + left_h - 60
        for p_title, p_desc in points:
            self.c.setFont("Helvetica-Bold", 9)
            self.c.setFillColor(ACCENT_CYAN)
            self.c.drawString(right_x + 20, py, p_title)

            self.c.setFont("Helvetica", 8)
            self.c.setFillColor(TEXT_MUTED)
            self.c.drawString(right_x + 20, py - 14, p_desc[:70])
            self.c.drawString(right_x + 20, py - 26, p_desc[70:])
            py -= 46

        self.c.showPage()

    # ── SLIDE 3: THE PROBLEM ──────────────────────────────────────────────────
    def slide_3_problem(self):
        self.draw_background(3, category="MARKET PAIN & THE GENERATIVE AI TRAP")

        self.c.setFont("Helvetica-Bold", 22)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(40, HEIGHT - 70, "The Trillion-Dollar Enterprise Decision Crisis")

        self.c.setFont("Helvetica", 11)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, HEIGHT - 90, "High-stakes corporate decisions are still made on fragmented spreadsheets and gut feel.")

        col_w = (WIDTH - 80 - 24) / 3
        col_h = 230
        col_y = 65

        cards = [
            ("PROBLEM 01", "Fragmented Silos & Blind Spots", [
                "Sales commits to 99.99% SLAs that infrastructure cannot deliver.",
                "CFO lacks real-time visibility into cross-department contract liabilities.",
                "Corporate M&A due diligence takes 6 weeks of manual document digging."
            ], ACCENT_AMBER),
            ("PROBLEM 02", "The 17.8% AI Math Drift Trap", [
                "Generic LLMs (ChatGPT, Claude) hallucinate financial arithmetic.",
                "17.8% average drift when computing cash burn, debt covenants & runway.",
                "CFOs and investment committees cannot trust stochastic token prediction."
            ], ACCENT_RED),
            ("PROBLEM 03", "Delaware Fiduciary Liability", [
                "Under Delaware DGCL § 141, board directors face personal liability.",
                "Unsubstantiated decisions lack verifiable immutable audit trails.",
                "Hidden open-source (GPLv3) and uncapped indemnity traps in MSAs."
            ], ACCENT_PURPLE)
        ]

        for i, (badge, title, bullets, col) in enumerate(cards):
            cx = 40 + i * (col_w + 12)
            self.draw_card(cx, col_y, col_w, col_h, border_color=col)

            self.draw_badge(cx + 14, col_y + col_h - 22, badge, col)

            self.c.setFont("Helvetica-Bold", 11)
            self.c.setFillColor(TEXT_WHITE)
            self.c.drawString(cx + 14, col_y + col_h - 46, title)

            by = col_y + col_h - 72
            for b in bullets:
                self.c.setFillColor(col)
                self.c.circle(cx + 18, by + 3, 2, fill=True, stroke=False)

                self.c.setFont("Helvetica", 8)
                self.c.setFillColor(TEXT_MUTED)
                self.c.drawString(cx + 26, by, b[:32])
                self.c.drawString(cx + 26, by - 12, b[32:68])
                if len(b) > 68:
                    self.c.drawString(cx + 26, by - 24, b[68:])
                    by -= 12
                by -= 32

        self.c.showPage()

    # ── SLIDE 4: THE SOLUTION ─────────────────────────────────────────────────
    def slide_4_solution(self):
        self.draw_background(4, category="THE CAUSARIX PARADIGM")

        self.c.setFont("Helvetica-Bold", 22)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(40, HEIGHT - 70, "The Solution: Autonomous Decision Intelligence")

        self.c.setFont("Helvetica", 11)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, HEIGHT - 90, "A sovereign operating system that models decisions mathematically before you sign or spend.")

        # Top Banner
        self.draw_card(40, HEIGHT - 180, WIDTH - 80, 75, border_color=PRIMARY_BLUE)
        self.c.setFont("Helvetica-Bold", 12)
        self.c.setFillColor(ACCENT_CYAN)
        self.c.drawString(55, HEIGHT - 130, "NEURO-SYMBOLIC CAUSAL ARCHITECTURE")

        self.c.setFont("Helvetica", 9)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(55, HEIGHT - 150, "Causarix combines Judea Pearl's Structural Causal Models (SCM) with 10-Agent Dialectic Deliberation.")
        self.c.drawString(55, HEIGHT - 165, "Every decision is verified by a deterministic Python sandbox for 0.00% math drift and 100% SHA-256 evidence.")

        # 4 Core Pillars Grid
        grid_y = 60
        grid_w = (WIDTH - 80 - 12) / 2
        grid_h = 95

        pillars = [
            ("01", "10-Agent Adversarial Boardroom", "General Counsel, CFO, CTO, Red Team & CEO twins stress-test decisions.", PRIMARY_BLUE),
            ("02", "Pearl Do-Calculus SCM Studio", "Computes P(Y | do(X=x)) over DAGs with dynamic real-time sliders.", ACCENT_CYAN),
            ("03", "3D Organizational Memory Graph", "Interconnects contracts, MSAs & ERP ledgers into a single queryable brain.", ACCENT_GREEN),
            ("04", "Autonomous Action Dispatch", "1-Click SCM mitigation tickets dispatched directly to Jira Cloud & ERP.", ACCENT_PURPLE)
        ]

        positions = [
            (40, grid_y + grid_h + 10),
            (40 + grid_w + 12, grid_y + grid_h + 10),
            (40, grid_y),
            (40 + grid_w + 12, grid_y)
        ]

        for (num, title, desc, col), (px, py) in zip(pillars, positions):
            self.draw_card(px, py, grid_w, grid_h, border_color=col)
            
            self.c.setFont("Helvetica-Bold", 14)
            self.c.setFillColor(col)
            self.c.drawString(px + 14, py + grid_h - 26, num)

            self.c.setFont("Helvetica-Bold", 10)
            self.c.setFillColor(TEXT_WHITE)
            self.c.drawString(px + 42, py + grid_h - 24, title)

            self.c.setFont("Helvetica", 8)
            self.c.setFillColor(TEXT_MUTED)
            self.c.drawString(px + 14, py + 35, desc[:50])
            self.c.drawString(px + 14, py + 22, desc[50:])

        self.c.showPage()

    # ── SLIDE 5: APP FEATURES & CAPABILITIES ──────────────────────────────────
    def slide_5_features(self):
        self.draw_background(5, category="PRODUCT CAPABILITIES & WORKFLOW")

        self.c.setFont("Helvetica-Bold", 22)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(40, HEIGHT - 70, "Deep-Tech Product Capabilities")

        self.c.setFont("Helvetica", 11)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, HEIGHT - 90, "End-to-end sovereign governance from document ingestion to boardroom execution.")

        row_h = 68
        cards = [
            ("🏛️ 10-Agent Boardroom Arena", "General Counsel (Delaware § 141), CFO (Python SCM), Red Team & CEO twins simulate full C-suite dialectic debates to reach unanimous quorum consensus."),
            ("🧠 Pearl Do-Calculus SCM Studio", "Models counterfactuals P(Y|do(X)) with zero fixation. Users add unlimited custom scenarios with dynamic sliders calculating EBITDA & runway in real-time."),
            ("🕸️ 3D Organizational Memory Graph", "Transforms contracts, MSAs, and SOPs into an interactive 3D knowledge graph with 100% line-level SHA-256 citations and cross-silo contradiction detection."),
            ("⚡ Sovereign Multi-Tenant Isolation", "Enterprise AES-256 encryption, zero data retention, and instant CSX-XXXXXX invite codes for seamless team onboarding without approval bottlenecks.")
        ]

        for i, (title, desc) in enumerate(cards):
            cy = HEIGHT - 180 - i * (row_h + 10)
            self.draw_card(40, cy, WIDTH - 80, row_h)

            self.c.setFont("Helvetica-Bold", 10)
            self.c.setFillColor(ACCENT_CYAN)
            self.c.drawString(55, cy + row_h - 22, title)

            self.c.setFont("Helvetica", 8)
            self.c.setFillColor(TEXT_MUTED)
            self.c.drawString(55, cy + 28, desc[:90])
            self.c.drawString(55, cy + 15, desc[90:])

        self.c.showPage()

    # ── SLIDE 6: OUR UNFAIR MOAT ──────────────────────────────────────────────
    def slide_6_moat(self):
        self.draw_background(6, category="COMPETITIVE ADVANTAGE & DEFENSIVE MOAT")

        self.c.setFont("Helvetica-Bold", 22)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(40, HEIGHT - 70, "Why Only We Can Build This (Our Moat)")

        self.c.setFont("Helvetica", 11)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, HEIGHT - 90, "Four structural compounding defensibility moats that wrappers cannot replicate.")

        card_w = (WIDTH - 80 - 12) / 2
        card_h = 110
        grid_y = 65

        moats = [
            ("01", "Causal Graph Compiler vs. Vector RAG", "While competitors rely on naive vector embeddings that hallucinate, Causarix compiles documents into formal Judea Pearl Directed Acyclic Graphs.", ACCENT_CYAN),
            ("02", "Deterministic Financial Verifier", "Mathematical equations are solved in an isolated Python runtime with 0.00% arithmetic drift, guaranteeing accurate runway & EBITDA impact.", ACCENT_GREEN),
            ("03", "Delaware Statutory Safe Harbor", "Generates legally defensible evidentiary records under Delaware DGCL § 141, insulating board directors from personal fiduciary liability.", PRIMARY_BLUE),
            ("04", "10x Capital & Engineering Efficiency", "Built solo from Pune, India with zero bloated headcount. We ship features in 48 hours that take enterprise incumbents 6 months.", ACCENT_AMBER)
        ]

        positions = [
            (40, grid_y + card_h + 12),
            (40 + card_w + 12, grid_y + card_h + 12),
            (40, grid_y),
            (40 + card_w + 12, grid_y)
        ]

        for (num, title, desc, col), (px, py) in zip(moats, positions):
            self.draw_card(px, py, card_w, card_h, border_color=col)

            self.c.setFont("Helvetica-Bold", 16)
            self.c.setFillColor(col)
            self.c.drawString(px + 14, py + card_h - 26, num)

            self.c.setFont("Helvetica-Bold", 10)
            self.c.setFillColor(TEXT_WHITE)
            self.c.drawString(px + 44, py + card_h - 24, title)

            self.c.setFont("Helvetica", 8)
            self.c.setFillColor(TEXT_MUTED)
            self.c.drawString(px + 14, py + 48, desc[:48])
            self.c.drawString(px + 14, py + 36, desc[48:96])
            self.c.drawString(px + 14, py + 24, desc[96:])

        self.c.showPage()

    # ── SLIDE 7: MARKET OPPORTUNITY & TAM ─────────────────────────────────────
    def slide_7_market(self):
        self.draw_background(7, category="MARKET SIZE & EXPANSION TRAJECTORY")

        self.c.setFont("Helvetica-Bold", 22)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(40, HEIGHT - 70, "$38.5B Addressable Market Opportunity")

        self.c.setFont("Helvetica", 11)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, HEIGHT - 90, "Riding the massive enterprise transition from probabilistic chat to deterministic intelligence.")

        # 3 Market Sizing Blocks
        card_w = (WIDTH - 80 - 24) / 3
        card_h = 230
        card_y = 65

        tiers = [
            ("$38.5B", "TAM (Total Addressable)", "Global Enterprise Decision Intelligence, Governance & Legal Tech Market by 2028.", ACCENT_PURPLE),
            ("$12.2B", "SAM (Serviceable)", "Mid-market & enterprise CFOs, General Counsels & Corporate Strategy teams.", PRIMARY_BLUE),
            ("$1.8B", "SOM (Serviceable Obtainable)", "High-growth tech companies, M&A deal rooms & cross-border PE funds.", ACCENT_CYAN)
        ]

        for i, (stat, title, desc, col) in enumerate(tiers):
            cx = 40 + i * (card_w + 12)
            self.draw_card(cx, card_y, card_w, card_h, border_color=col)

            self.c.setFont("Helvetica-Bold", 26)
            self.c.setFillColor(col)
            self.c.drawString(cx + 16, card_y + card_h - 45, stat)

            self.c.setFont("Helvetica-Bold", 10)
            self.c.setFillColor(TEXT_WHITE)
            self.c.drawString(cx + 16, card_y + card_h - 70, title)

            self.c.setFont("Helvetica", 8.5)
            self.c.setFillColor(TEXT_MUTED)
            self.c.drawString(cx + 16, card_y + card_h - 100, desc[:32])
            self.c.drawString(cx + 16, card_y + card_h - 115, desc[32:])

            # Growth Driver Box
            self.draw_card(cx + 10, card_y + 14, card_w - 20, 80, border_color=colors.HexColor("#1A1D2A"))
            self.c.setFont("Helvetica-Bold", 7.5)
            self.c.setFillColor(TEXT_DIM)
            self.c.drawString(cx + 18, card_y + 76, "GROWTH TAILWINDS")
            
            self.c.setFont("Helvetica", 7.5)
            self.c.setFillColor(TEXT_MUTED)
            if i == 0:
                self.c.drawString(cx + 18, card_y + 58, "• Delaware DGCL § 141 governance")
                self.c.drawString(cx + 18, card_y + 44, "• Global AI regulatory compliance")
            elif i == 1:
                self.c.drawString(cx + 18, card_y + 58, "• M&A due diligence acceleration")
                self.c.drawString(cx + 18, card_y + 44, "• Real-time cash runway hedging")
            else:
                self.c.drawString(cx + 18, card_y + 58, "• Instant self-serve onboarding")
                self.c.drawString(cx + 18, card_y + 44, "• Viral $29/$39/mo entry tiers")

        self.c.showPage()

    # ── SLIDE 8: BUSINESS MODEL & UNIT ECONOMICS ──────────────────────────────
    def slide_8_business_model(self):
        self.draw_background(8, category="MONETIZATION & UNIT ECONOMICS")

        self.c.setFont("Helvetica-Bold", 22)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(40, HEIGHT - 70, "High-Margin SaaS Monetization Engine")

        self.c.setFont("Helvetica", 11)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, HEIGHT - 90, "Product-led growth entry tier scaling into high-ACV enterprise custom deployments.")

        card_w = (WIDTH - 80 - 24) / 3
        card_h = 230
        card_y = 65

        plans = [
            ("STARTER", "$29", "/ month", [
                "10-Agent Boardroom Basic",
                "50 SCM Simulation Credits",
                "Document Vault (50MB)",
                "Standard Decision Logs"
            ], PRIMARY_BLUE),
            ("PROFESSIONAL", "$39", "/ month", [
                "Unlimited Boardroom Debates",
                "Pearl Do-Calculus Studio",
                "3D Memory Graph Access",
                "1-Click Jira Dispatch",
                "Priority SCM Compiler"
            ], ACCENT_CYAN),
            ("ENTERPRISE MAX", "$50k+", "/ year ACV", [
                "Custom Dedicated SCM Models",
                "On-Prem / Private VPC",
                "Custom Fiduciary Proofs",
                "Delaware Legal Twin Tuning",
                "24/7 Dedicated Support"
            ], ACCENT_GREEN)
        ]

        for i, (tier, price, period, features, col) in enumerate(plans):
            cx = 40 + i * (card_w + 12)
            self.draw_card(cx, card_y, card_w, card_h, border_color=col)

            self.draw_badge(cx + 16, card_y + card_h - 22, tier, col)

            self.c.setFont("Helvetica-Bold", 24)
            self.c.setFillColor(TEXT_WHITE)
            self.c.drawString(cx + 16, card_y + card_h - 55, price)

            pw = self.c.stringWidth(price, "Helvetica-Bold", 24)
            self.c.setFont("Helvetica", 9)
            self.c.setFillColor(TEXT_DIM)
            self.c.drawString(cx + 16 + pw + 4, card_y + card_h - 52, period)

            fy = card_y + card_h - 85
            for f in features:
                self.c.setFillColor(col)
                self.c.circle(cx + 20, fy + 3, 2, fill=True, stroke=False)

                self.c.setFont("Helvetica", 8)
                self.c.setFillColor(TEXT_MUTED)
                self.c.drawString(cx + 28, fy, f)
                fy -= 20

            # 85%+ Gross Margin Tag
            self.c.setFont("Helvetica-Bold", 7.5)
            self.c.setFillColor(col)
            self.c.drawString(cx + 16, card_y + 14, "85%+ GROSS MARGIN")

        self.c.showPage()

    # ── SLIDE 9: TRACTION & PRODUCTION STATUS ─────────────────────────────────
    def slide_9_traction(self):
        self.draw_background(9, category="TRACTION & LIVE PRODUCTION")

        self.c.setFont("Helvetica-Bold", 22)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(40, HEIGHT - 70, "Production-Ready & Fully Live")

        self.c.setFont("Helvetica", 11)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, HEIGHT - 90, "Not a concept or slide mockup: fully functional live operating system deployed in production.")

        # Top Live Status Card
        self.draw_card(40, HEIGHT - 185, WIDTH - 80, 80, border_color=ACCENT_GREEN)
        self.draw_badge(55, HEIGHT - 130, "LIVE IN PRODUCTION", ACCENT_GREEN)

        self.c.setFont("Helvetica-Bold", 12)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(55, HEIGHT - 150, "Canonical Domain: https://causarix.vercel.app")

        self.c.setFont("Helvetica", 9)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(55, HEIGHT - 168, "Instant 60-Second Sandbox (Zero Login Required) at causarix.vercel.app/demo")

        # 3 Infrastructure Pillars
        col_w = (WIDTH - 80 - 24) / 3
        col_h = 135
        col_y = 60

        infra = [
            ("⚡ Neon PostgreSQL & Prisma", "Full multi-tenant database synchronization, schema migrations, and secure RBAC isolation active in production."),
            ("🧠 Multi-LLM Causal Gateway", "Gemini 2.5 Flash, Groq Llama 3.3 70B & DeepSeek failover router with deterministic Python fallback."),
            ("🚀 Working Invite Codes", "Instant CSX-XXXXXX organizational workspace invite codes and automated onboarding workflow live.")
        ]

        for i, (title, desc) in enumerate(infra):
            cx = 40 + i * (col_w + 12)
            self.draw_card(cx, col_y, col_w, col_h)

            self.c.setFont("Helvetica-Bold", 9.5)
            self.c.setFillColor(ACCENT_CYAN)
            self.c.drawString(cx + 14, col_y + col_h - 26, title)

            self.c.setFont("Helvetica", 8)
            self.c.setFillColor(TEXT_MUTED)
            self.c.drawString(cx + 14, col_y + 70, desc[:36])
            self.c.drawString(cx + 14, col_y + 56, desc[36:72])
            self.c.drawString(cx + 14, col_y + 42, desc[72:])

        self.c.showPage()

    # ── SLIDE 10: THE ASK & CAPITAL RAISE ──────────────────────────────────────
    def slide_10_the_ask(self):
        self.draw_background(10, category="INVESTMENT OPPORTUNITY & CAPITAL RAISE")

        self.c.setFont("Helvetica-Bold", 22)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(40, HEIGHT - 70, "The Ask: $1.5M Seed Round")

        self.c.setFont("Helvetica", 11)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(40, HEIGHT - 90, "Accelerating proprietary causal compiler R&D and scaling enterprise GTM.")

        # Left: Use of Funds
        left_w = 340
        card_h = 230
        self.draw_card(40, 55, left_w, card_h, border_color=PRIMARY_BLUE)

        self.c.setFont("Helvetica-Bold", 12)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(55, 55 + card_h - 28, "Use of Funds Breakdown")

        allocations = [
            ("50% · Causal Compiler & GPU Scaling", "Proprietary DAG compiler R&D, dedicated inference GPU cluster, and sub-millisecond SCM latency.", ACCENT_CYAN),
            ("30% · Enterprise GTM & High-ACV Sales", "Mid-market & enterprise acquisition, M&A deal room partnerships, and strategic US expansion.", PRIMARY_BLUE),
            ("20% · SOC2 Type II & Security Compliance", "Enterprise SOC2 Type II audit, GDPR/DPDP certification, and legal statutory defense suite.", ACCENT_GREEN)
        ]

        ay = 55 + card_h - 58
        for title, desc, col in allocations:
            self.c.setFont("Helvetica-Bold", 9.5)
            self.c.setFillColor(col)
            self.c.drawString(55, ay, title)

            self.c.setFont("Helvetica", 8)
            self.c.setFillColor(TEXT_MUTED)
            self.c.drawString(55, ay - 14, desc[:58])
            self.c.drawString(55, ay - 26, desc[58:])
            ay -= 52

        # Right: Milestones & Contact
        right_x = 400
        right_w = WIDTH - right_x - 40
        self.draw_card(right_x, 55, right_w, card_h, border_color=ACCENT_CYAN)

        self.c.setFont("Helvetica-Bold", 12)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(right_x + 20, 55 + card_h - 28, "12–18 Month Milestones")

        milestones = [
            "• Scale to $1.2M ARR across 25+ Enterprise Accounts",
            "• Deploy Proprietary On-Prem SCM Engine for Banks",
            "• Establish Delaware Corporate Governance Benchmark",
            "• Expand US & European Enterprise Sales Footprint"
        ]

        my = 55 + card_h - 55
        for m in milestones:
            self.c.setFont("Helvetica", 8.5)
            self.c.setFillColor(TEXT_WHITE)
            self.c.drawString(right_x + 20, my, m)
            my -= 20

        # Contact Box at bottom right
        self.draw_card(right_x + 14, 68, right_w - 28, 65, border_color=PRIMARY_BLUE, fill_color=colors.HexColor("#1A1F35"))
        self.c.setFont("Helvetica-Bold", 9)
        self.c.setFillColor(ACCENT_CYAN)
        self.c.drawString(right_x + 26, 115, "CONTACT SOLO FOUNDER:")

        self.c.setFont("Helvetica-Bold", 10)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(right_x + 26, 98, "Shourya Shetty · 17 Years Old")

        self.c.setFont("Helvetica", 8)
        self.c.setFillColor(TEXT_MUTED)
        self.c.drawString(right_x + 26, 82, "Pune, India · causarix.vercel.app/demo")

        self.c.showPage()

    def build(self):
        self.slide_1_cover()
        self.slide_2_founder()
        self.slide_3_problem()
        self.slide_4_solution()
        self.slide_5_features()
        self.slide_6_moat()
        self.slide_7_market()
        self.slide_8_business_model()
        self.slide_9_traction()
        self.slide_10_the_ask()
        self.c.save()
        print(f"✅ Generated 10-Slide Pitch Deck PDF: {OUTPUT_PDF}")

if __name__ == "__main__":
    deck = SlideDeck(OUTPUT_PDF)
    deck.build()

    # Copy to Brain Artifacts Directory for 1-Click User Access
    with open(OUTPUT_PDF, "rb") as src, open(ARTIFACT_PDF, "wb") as dst:
        dst.write(src.read())
    print(f"📁 Copied to Artifact Brain Directory: {ARTIFACT_PDF}")
