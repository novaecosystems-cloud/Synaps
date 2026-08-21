import os
import sys
import math
import random
import wave
import struct
import subprocess
import numpy as np
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output", "videos")
TEMP_DIR = os.path.join(os.path.dirname(__file__), "..", "output", "temp_ad")
ARTIFACT_DIR = r"C:\Users\Shourya\.gemini\antigravity\brain\8c69c067-7f2a-4c02-970e-2c2af20dab71"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

WIDTH = 1080
HEIGHT = 1920
FPS = 30
TOTAL_SECONDS = 15.0
TOTAL_FRAMES = int(FPS * TOTAL_SECONDS)

# ── LOAD HIGH-CONTRAST TYPOGRAPHY SYSTEM ────────────────────────────────────
FONTS = {
    "serif_huge": ImageFont.truetype("C:\\Windows\\Fonts\\georgiab.ttf", 76),
    "serif_large": ImageFont.truetype("C:\\Windows\\Fonts\\georgiab.ttf", 54),
    "serif_med": ImageFont.truetype("C:\\Windows\\Fonts\\georgiab.ttf", 40),
    "grotesque_massive": ImageFont.truetype("C:\\Windows\\Fonts\\ariblk.ttf", 84),
    "grotesque_huge": ImageFont.truetype("C:\\Windows\\Fonts\\ariblk.ttf", 64),
    "grotesque_large": ImageFont.truetype("C:\\Windows\\Fonts\\ariblk.ttf", 48),
    "mono_bold": ImageFont.truetype("C:\\Windows\\Fonts\\consolab.ttf", 28),
    "mono_med": ImageFont.truetype("C:\\Windows\\Fonts\\consolab.ttf", 22),
    "mono_small": ImageFont.truetype("C:\\Windows\\Fonts\\consola.ttf", 18),
    "sans_bold": ImageFont.truetype("C:\\Windows\\Fonts\\segoeuib.ttf", 36),
}

# ── PROCEDURAL HIGH-ENERGY ELECTRONIC SOUNDTRACK GENERATOR ──────────────────
def generate_soundtrack(wav_path: str, duration_sec: float, sample_rate=44100):
    total_samples = int(duration_sec * sample_rate)
    audio = np.zeros(total_samples, dtype=np.float32)
    t_arr = np.linspace(0, duration_sec, total_samples, endpoint=False)

    bpm = 130
    beat_dur = 60.0 / bpm
    total_beats = int(duration_sec / beat_dur)

    # 1. 808 Sub-Bass Kicks
    for b in range(total_beats):
        b_time = b * beat_dur
        b_idx = int(b_time * sample_rate)
        kick_len = int(0.4 * sample_rate)
        if b_idx + kick_len < total_samples:
            kt = np.linspace(0, 0.4, kick_len)
            # Pitch envelope from 160Hz down to 42Hz
            freq = 42 + 118 * np.exp(-kt * 22)
            phase = 2 * np.pi * np.cumsum(freq) / sample_rate
            kick_wave = np.sin(phase) * np.exp(-kt * 9) * 0.75
            # Add subtle punch transient
            punch = np.sin(2 * np.pi * 900 * kt) * np.exp(-kt * 80) * 0.35
            audio[b_idx:b_idx+kick_len] += (kick_wave + punch)

    # 2. Snare / Claps on beats 2 and 4
    for b in range(total_beats):
        if b % 2 == 1:
            b_time = b * beat_dur
            b_idx = int(b_time * sample_rate)
            snare_len = int(0.25 * sample_rate)
            if b_idx + snare_len < total_samples:
                st = np.linspace(0, 0.25, snare_len)
                noise = (np.random.rand(snare_len) * 2 - 1) * np.exp(-st * 18)
                body = np.sin(2 * np.pi * 220 * st) * np.exp(-st * 25)
                audio[b_idx:b_idx+snare_len] += (noise * 0.45 + body * 0.3)

    # 3. Hi-Hats (16th notes with velocity swing)
    sub_beats = total_beats * 4
    sub_dur = beat_dur / 4.0
    for sb in range(sub_beats):
        sb_time = sb * sub_dur
        sb_idx = int(sb_time * sample_rate)
        hat_len = int(0.06 * sample_rate)
        if sb_idx + hat_len < total_samples:
            ht = np.linspace(0, 0.06, hat_len)
            noise = (np.random.rand(hat_len) * 2 - 1) * np.exp(-ht * 90)
            vel = 0.25 if (sb % 4 == 0) else (0.12 if sb % 2 == 0 else 0.07)
            audio[sb_idx:sb_idx+hat_len] += noise * vel

    # 4. Cinematic Risers into transitions at t=2.0, t=5.0, t=8.5, t=12.0
    transitions = [2.0, 5.0, 8.5, 12.0]
    for trans in transitions:
        r_start = max(0.0, trans - 1.2)
        r_len = int((trans - r_start) * sample_rate)
        r_idx = int(r_start * sample_rate)
        if r_idx + r_len < total_samples:
            rt = np.linspace(0, 1.2, r_len)
            # Sweeping pitch from 120Hz to 1800Hz with resonance
            r_freq = 120 * np.exp(rt * 2.3)
            r_phase = 2 * np.pi * np.cumsum(r_freq) / sample_rate
            riser = np.sin(r_phase) * (rt / 1.2) ** 2 * 0.4
            # White noise sweep
            r_noise = (np.random.rand(r_len) * 2 - 1) * (rt / 1.2) ** 3 * 0.25
            audio[r_idx:r_idx+r_len] += (riser + r_noise)

    # 5. Low-Pass Synth Bassline (Cyber Minor Chord Progression: A -> F -> D -> E)
    bass_notes = [55, 43.65, 36.7, 41.2]  # A1, F1, D1, E1
    for b in range(total_beats):
        note_idx = (b // 4) % len(bass_notes)
        freq = bass_notes[note_idx]
        b_time = b * beat_dur
        b_idx = int(b_time * sample_rate)
        note_len = int(beat_dur * sample_rate)
        if b_idx + note_len < total_samples:
            bt = np.linspace(0, beat_dur, note_len)
            # Sawtooth approximation with harmonics
            saw = (np.sin(2 * np.pi * freq * bt) + 
                   0.5 * np.sin(2 * np.pi * freq * 2 * bt) + 
                   0.25 * np.sin(2 * np.pi * freq * 3 * bt)) * 0.2
            audio[b_idx:b_idx+note_len] += saw

    # Normalize audio to prevent clipping
    audio = audio / (np.max(np.abs(audio)) + 1e-6) * 0.92
    audio_int16 = (audio * 32767).astype(np.int16)

    with wave.open(wav_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(audio_int16.tobytes())
    print(f"🎵 Synthesized High-Energy Cyber Soundtrack: {wav_path}")

# ── FRAME RENDERING ENGINE ──────────────────────────────────────────────────
def render_frame(f_idx: int) -> Image.Image:
    t = f_idx / FPS
    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 10, 12))
    draw = ImageDraw.Draw(img)

    # Global Colors
    OBSIDIAN = (10, 10, 12)
    CHALK = (243, 242, 238)
    ELECTRIC_BLUE = (45, 78, 255)
    CYBER_CYAN = (6, 182, 212)
    MUTED_GRAY = (120, 125, 140)
    DARK_CARD = (18, 19, 24)
    BORDER_GLOW = (45, 78, 255)

    # ─────────────────────────────────────────────────────────────────────────
    # SCENE 1: THE BRUTAL HOOK (0.0s - 2.0s | Frames 0-60)
    # ─────────────────────────────────────────────────────────────────────────
    if t < 2.0:
        st = t / 2.0  # 0 to 1
        
        # Macro Camera Zoom & Dutch Tilt Effect
        zoom = 1.0 + 0.08 * st
        
        # Background Grid Mesh with Micro Crosshairs
        for gx in range(60, WIDTH, 160):
            draw.line((gx, 0, gx, HEIGHT), fill=(22, 24, 32), width=1)
        for gy in range(80, HEIGHT, 160):
            draw.line((0, gy, WIDTH, gy), fill=(22, 24, 32), width=1)

        # Top Technical Timestamp
        draw.text((80, 120), f"[ SYS_AUDIT // SEQ_01 // 45° MACRO ]", fill=MUTED_GRAY, font=FONTS["mono_small"])
        draw.text((WIDTH - 280, 120), f"FPS: 30.00 · LATENCY: 0ms", fill=MUTED_GRAY, font=FONTS["mono_small"])

        # Main Kinetic Typography
        # Part 1: Top Statement (0.0s - 2.0s)
        draw.text((80, 520), "98% OF $100M", fill=CHALK, font=FONTS["serif_huge"])
        draw.text((80, 620), "DECISIONS", fill=CHALK, font=FONTS["serif_huge"])

        # Part 2: Punchline Cut (Drops at t=0.9s with sudden block highlight)
        if t >= 0.9:
            punch_st = (t - 0.9) / 1.1
            block_w = int((WIDTH - 160) * min(1.0, punch_st * 8))
            draw.rectangle((80, 800, 80 + block_w, 980), fill=ELECTRIC_BLUE)
            
            if punch_st > 0.05:
                draw.text((110, 830), "ARE STILL MADE", fill=CHALK, font=FONTS["grotesque_huge"])
                draw.text((110, 900), "ON VIBES.", fill=(255, 255, 255), font=FONTS["grotesque_huge"])

        # Bottom Monospace Rule
        draw.line((80, HEIGHT - 240, WIDTH - 80, HEIGHT - 240), fill=(40, 44, 58), width=2)
        draw.text((80, HEIGHT - 200), "CORPORATE GOVERNANCE VULNERABILITY AUDIT", fill=MUTED_GRAY, font=FONTS["mono_med"])
        draw.text((WIDTH - 380, HEIGHT - 200), "STATUS: UNHEDGED EXPOSURE", fill=(255, 80, 80), font=FONTS["mono_med"])

    # ─────────────────────────────────────────────────────────────────────────
    # SCENE 2: THE PROBLEM (2.0s - 5.0s | Frames 60-150)
    # ─────────────────────────────────────────────────────────────────────────
    elif t < 5.0:
        st = (t - 2.0) / 3.0  # 0 to 1

        # Isometric 45° Wireframe Grid
        iso_offset = int(st * 180)
        for i in range(-10, 20):
            y_line = 300 + i * 90 + (iso_offset % 90)
            draw.line((0, y_line, WIDTH, y_line + 400), fill=(20, 24, 38), width=1)
            draw.line((0, y_line + 400, WIDTH, y_line), fill=(20, 24, 38), width=1)

        # Header Badge
        draw.rectangle((80, 180, 480, 235), fill=(25, 20, 25), outline=(255, 70, 70), width=1)
        draw.text((105, 195), "🚨 ENTROPY IN ENTERPRISE STACK", fill=(255, 100, 100), font=FONTS["mono_bold"])

        # 3 Rapid Staggered Cards (Slide in from left with spring bounce)
        card_items = [
            ("01", "MESSY SPREADSHEETS", "Broken formulas · 17.8% calculation drift", (239, 68, 68)),
            ("02", "HALLUCINATING LLMS", "Uncapped indemnities · Invented legal covenants", (245, 158, 11)),
            ("03", "CROSS-SILO BLIND SPOTS", "Sales committing to SLAs tech cannot deliver", (236, 72, 153))
        ]

        card_start_y = 360
        for idx, (num, title, subtitle, color) in enumerate(card_items):
            card_delay = idx * 0.32
            if st >= card_delay:
                c_prog = min(1.0, (st - card_delay) * 4.0)
                # Slide in motion from left (-600 to 80)
                card_x = int(-400 * (1 - c_prog) + 80)
                cy = card_start_y + idx * 240

                # Card Body
                draw.rounded_rectangle((card_x, cy, card_x + WIDTH - 160, cy + 190), radius=16, fill=DARK_CARD, outline=(40, 45, 60), width=2)
                # Accent bar on left edge
                draw.rounded_rectangle((card_x, cy, card_x + 8, cy + 190), radius=4, fill=color)

                # Number pill
                draw.rounded_rectangle((card_x + 35, cy + 35, card_x + 105, cy + 85), radius=8, fill=(28, 32, 45))
                draw.text((card_x + 52, cy + 45), num, fill=color, font=FONTS["mono_bold"])

                # Title & Subtitle
                draw.text((card_x + 130, cy + 42), title, fill=CHALK, font=FONTS["grotesque_large"])
                draw.text((card_x + 130, cy + 115), subtitle, fill=MUTED_GRAY, font=FONTS["sans_bold"])

        # Bottom Tech Coordinate
        draw.text((80, HEIGHT - 180), f"SYS_SCAN: 3,420 CROSS-SILO INTERSECTIONS ANALYZED", fill=MUTED_GRAY, font=FONTS["mono_small"])

    # ─────────────────────────────────────────────────────────────────────────
    # SCENE 3: THE PARADIGM SHIFT (5.0s - 8.5s | Frames 150-255)
    # ─────────────────────────────────────────────────────────────────────────
    elif t < 8.5:
        st = (t - 5.0) / 3.5  # 0 to 1

        # Ambient Royal Blue Energy Field
        glow_pulse = 0.5 + 0.5 * math.sin(st * math.pi * 4)
        for r in range(500, 0, -35):
            alpha = int((1 - r / 500) * 40 * glow_pulse)
            draw.ellipse((int(WIDTH/2 - r), int(HEIGHT/2 - r), int(WIDTH/2 + r), int(HEIGHT/2 + r)), fill=(int(45*alpha/100), int(78*alpha/100), int(255*alpha/100)))

        # Top Formal Pearl Equation Header
        draw.rectangle((80, 220, WIDTH - 80, 290), fill=(18, 24, 50), outline=ELECTRIC_BLUE, width=2)
        draw.text((110, 242), "FORMAL SCM TRANSITION : P(Y | do(X = x))", fill=CYBER_CYAN, font=FONTS["mono_bold"])

        # Massive Typography Statement
        draw.text((80, 480), "STOP GUESSING.", fill=CHALK, font=FONTS["grotesque_massive"])
        
        # Line 2 with Electric Glow Box
        box_y = 620
        draw.rounded_rectangle((80, box_y, WIDTH - 80, box_y + 140), radius=20, fill=ELECTRIC_BLUE)
        draw.text((110, box_y + 30), "ENGINEER THE", fill=(255, 255, 255), font=FONTS["grotesque_massive"])
        draw.text((110, box_y + 160), "OUTCOME.", fill=CHALK, font=FONTS["grotesque_massive"])

        # Mathematical SCM Formula Display Card
        fcard_y = 1000
        draw.rounded_rectangle((80, fcard_y, WIDTH - 80, fcard_y + 360), radius=24, fill=DARK_CARD, outline=ELECTRIC_BLUE, width=2)
        
        # 4 Corner Crosshairs
        for cx, cy in [(80, fcard_y), (WIDTH - 80, fcard_y), (80, fcard_y + 360), (WIDTH - 80, fcard_y + 360)]:
            draw.ellipse((cx - 6, cy - 6, cx + 6, cy + 6), fill=ELECTRIC_BLUE)

        draw.text((120, fcard_y + 40), "STRUCTURAL CAUSAL MODELING", fill=MUTED_GRAY, font=FONTS["mono_bold"])
        draw.text((120, fcard_y + 100), "E[Y_do(x)] = ∫ P(y | x, z) P(z) dz", fill=CHALK, font=FONTS["serif_large"])
        
        # Telemetry metrics
        draw.line((120, fcard_y + 200, WIDTH - 120, fcard_y + 200), fill=(35, 40, 60), width=2)
        draw.text((120, fcard_y + 240), "ARITHMETIC DRIFT:", fill=MUTED_GRAY, font=FONTS["mono_med"])
        draw.text((380, fcard_y + 240), "0.00%", fill=(16, 185, 129), font=FONTS["mono_bold"])

        draw.text((120, fcard_y + 290), "DECISION PROVENANCE:", fill=MUTED_GRAY, font=FONTS["mono_med"])
        draw.text((430, fcard_y + 290), "100% SHA-256", fill=CYBER_CYAN, font=FONTS["mono_bold"])

    # ─────────────────────────────────────────────────────────────────────────
    # SCENE 4: THE 3 ENGINES (8.5s - 12.0s | Frames 255-360)
    # ─────────────────────────────────────────────────────────────────────────
    elif t < 12.0:
        sub_t = t - 8.5  # 0 to 3.5
        
        # Tri-Cut Sequence: Each engine gets ~1.16s of intense focus
        engine_idx = min(2, int(sub_t / 1.16))
        e_prog = (sub_t % 1.16) / 1.16

        engines = [
            {
                "num": "01",
                "tag": "GOVERNANCE & FIDUCIARY ARENA",
                "title": "10-AGENT BOARDROOM",
                "subtitle": "Delaware DGCL § 141 Dialectic Debate",
                "stat": "QUORUM CONSENSUS VERIFIED",
                "color": (45, 78, 255)
            },
            {
                "num": "02",
                "tag": "PEARL DO-CALCULUS SCM",
                "title": "COUNTERFACTUAL STUDIO",
                "subtitle": "Deterministic Cash Runway & EBITDA Surgery",
                "stat": "0.00% CALCULATION DRIFT",
                "color": (6, 182, 212)
            },
            {
                "num": "03",
                "tag": "LIVING ENTERPRISE BRAIN",
                "title": "3D MEMORY GRAPH",
                "subtitle": "Cross-Silo Contract & SLA Interception",
                "stat": "100% SHA-256 PROVENANCE",
                "color": (168, 85, 247)
            }
        ]

        curr_eng = engines[engine_idx]
        col = curr_eng["color"]

        # Rotating Tech Grid Background
        for g in range(100, HEIGHT, 180):
            draw.line((0, g, WIDTH, g), fill=(20, 22, 35), width=1)

        # Huge Engine Number Background Watermark
        draw.text((WIDTH - 420, 180), curr_eng["num"], fill=(25, 28, 42), font=ImageFont.truetype("C:\\Windows\\Fonts\\ariblk.ttf", 260))

        # Active Top Pill
        draw.rectangle((80, 160, WIDTH - 80, 225), fill=(20, 22, 38), outline=col, width=2)
        draw.text((110, 180), f"CORE ENGINE // {curr_eng['tag']}", fill=col, font=FONTS["mono_bold"])

        # Engine Title in Massive Serif + Grotesque
        draw.text((80, 480), curr_eng["num"], fill=col, font=FONTS["serif_huge"])
        draw.text((80, 580), curr_eng["title"], fill=CHALK, font=FONTS["grotesque_huge"])
        draw.text((80, 680), curr_eng["subtitle"], fill=MUTED_GRAY, font=FONTS["sans_bold"])

        # 3D Center Interactive Glass Frame
        frame_y = 860
        draw.rounded_rectangle((80, frame_y, WIDTH - 80, frame_y + 440), radius=24, fill=DARK_CARD, outline=col, width=3)
        
        # Animated Waveform or Node Visualizer inside frame
        for b_i in range(24):
            bw = int((WIDTH - 240) / 24)
            bx = 120 + b_i * bw
            bh = int(40 + 160 * abs(math.sin(e_prog * 12 + b_i * 0.5)))
            draw.rounded_rectangle((bx, frame_y + 280 - bh, bx + bw - 4, frame_y + 280), radius=4, fill=col)

        # Status Tag Bottom of Card
        draw.rounded_rectangle((120, frame_y + 330, WIDTH - 120, frame_y + 395), radius=12, fill=(15, 17, 28))
        draw.text((150, frame_y + 350), f"STATUS: {curr_eng['stat']}", fill=CHALK, font=FONTS["mono_bold"])

    # ─────────────────────────────────────────────────────────────────────────
    # SCENE 5: FINALE & CALL TO ACTION (12.0s - 15.0s | Frames 360-450)
    # ─────────────────────────────────────────────────────────────────────────
    else:
        st = (t - 12.0) / 3.0  # 0 to 1

        # Radial Ambient Lighting from Center
        glow_rad = int(350 + 60 * math.sin(st * math.pi * 3))
        for r in range(glow_rad, 0, -25):
            alpha = int((1 - r / glow_rad) * 45)
            draw.ellipse((int(WIDTH/2 - r), int(HEIGHT*0.4 - r), int(WIDTH/2 + r), int(HEIGHT*0.4 + r)), fill=(int(45*alpha/100), int(78*alpha/100), int(255*alpha/100)))

        # Top Badge
        draw.text((int(WIDTH/2 - 180), 320), "[ SOVEREIGN DECISION OS ]", fill=CYBER_CYAN, font=FONTS["mono_bold"])

        # Massive Spaced Logo Branding
        brand_str = "C A U S A R I X"
        font_brand = ImageFont.truetype("C:\\Windows\\Fonts\\ariblk.ttf", 74)
        bw = font_brand.getlength(brand_str)
        draw.text((int((WIDTH - bw)/2), 440), brand_str, fill=CHALK, font=font_brand)

        # Tagline in Editorial Serif
        tag_str = "The Autonomous Decision Intelligence OS"
        tw = FONTS["serif_med"].getlength(tag_str)
        draw.text((int((WIDTH - tw)/2), 560), tag_str, fill=MUTED_GRAY, font=FONTS["serif_med"])

        # Middle Key Capabilities Trio
        draw.line((140, 680, WIDTH - 140, 680), fill=(35, 40, 58), width=2)
        draw.text((160, 720), "✓ 10-Agent Boardroom", fill=CHALK, font=FONTS["mono_med"])
        draw.text((160, 770), "✓ Pearl SCM Simulations", fill=CHALK, font=FONTS["mono_med"])
        draw.text((160, 820), "✓ 3D Memory Graph", fill=CHALK, font=FONTS["mono_med"])
        draw.line((140, 880, WIDTH - 140, 880), fill=(35, 40, 58), width=2)

        # Huge High-Contrast Glowing CTA Button
        btn_y = 1040
        draw.rounded_rectangle((80, btn_y, WIDTH - 80, btn_y + 140), radius=70, fill=ELECTRIC_BLUE)
        
        btn_txt = "SIMULATE LIVE IN 60 SECONDS →"
        btn_w = FONTS["grotesque_large"].getlength(btn_txt)
        draw.text((int((WIDTH - btn_w)/2), btn_y + 45), btn_txt, fill=(255, 255, 255), font=FONTS["grotesque_large"])

        # Subtitle Domain
        domain_str = "causarix.vercel.app/demo"
        dw = FONTS["mono_bold"].getlength(domain_str)
        draw.text((int((WIDTH - dw)/2), btn_y + 200), domain_str, fill=CYBER_CYAN, font=FONTS["mono_bold"])
        
        zero_login_str = "ZERO LOGIN REQUIRED · INSTANT SANDBOX"
        zw = FONTS["mono_small"].getlength(zero_login_str)
        draw.text((int((WIDTH - zw)/2), btn_y + 250), zero_login_str, fill=MUTED_GRAY, font=FONTS["mono_small"])

    # Film Grain & Letterbox Mattes
    draw.rectangle((0, 0, WIDTH, 50), fill=(0, 0, 0))
    draw.rectangle((0, HEIGHT - 50, WIDTH, HEIGHT), fill=(0, 0, 0))

    return img

def main():
    print("🎬 GENERATING CINEMATIC CAUSARIX KINETIC MOTION AD (15.0s @ 30FPS)...")
    
    # 1. Synthesize Soundtrack
    soundtrack_wav = os.path.join(TEMP_DIR, "causarix_ad_soundtrack.wav")
    generate_soundtrack(soundtrack_wav, TOTAL_SECONDS)

    # 2. Render all 450 frames
    print(f"📸 Rendering {TOTAL_FRAMES} high-resolution 1080x1920 frames...")
    frames_dir = os.path.join(TEMP_DIR, "frames")
    os.makedirs(frames_dir, exist_ok=True)

    for f_idx in range(TOTAL_FRAMES):
        frame = render_frame(f_idx)
        frame_path = os.path.join(frames_dir, f"frame_{f_idx:05d}.png")
        frame.save(frame_path, "PNG")
        if (f_idx + 1) % 75 == 0 or f_idx == TOTAL_FRAMES - 1:
            print(f"   Rendered frame {f_idx + 1}/{TOTAL_FRAMES} ({(f_idx+1)/TOTAL_FRAMES*100:.1f}%)")

    # 3. Encode into final 1080x1920 MP4 with FFmpeg
    final_video_path = os.path.join(OUTPUT_DIR, "causarix_kinetic_motion_ad.mp4")
    print(f"\n⚡ Encoding final 1080x1920 60fps MP4 with FFmpeg: {final_video_path}...")

    encode_cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", str(FPS),
        "-i", os.path.join(frames_dir, "frame_%05d.png"),
        "-i", soundtrack_wav,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "256k",
        "-shortest",
        final_video_path
    ]
    subprocess.run(encode_cmd, check=True)
    print(f"✅ Video generated successfully: {final_video_path}")

    # Copy to conversation artifact brain directory
    artifact_path = os.path.join(ARTIFACT_DIR, "causarix_kinetic_motion_ad.mp4")
    with open(final_video_path, "rb") as src, open(artifact_path, "wb") as dst:
        dst.write(src.read())
    print(f"📁 Copied to Artifact Brain Directory: {artifact_path}")

if __name__ == "__main__":
    main()
