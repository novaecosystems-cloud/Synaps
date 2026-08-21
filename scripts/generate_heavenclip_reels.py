import asyncio
import os
import sys
import json
import ssl
import subprocess
import math
import random
import numpy as np
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# SSL patch for edge-tts
ssl._create_default_https_context = ssl._create_unverified_context
import edge_tts
import edge_tts.communicate
edge_tts.communicate._SSL_CTX = ssl._create_unverified_context()

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output", "videos")
TEMP_DIR = os.path.join(os.path.dirname(__file__), "..", "output", "temp_hc")
ARTIFACT_DIR = r"C:\Users\Shourya\.gemini\antigravity\brain\8c69c067-7f2a-4c02-970e-2c2af20dab71"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

WIDTH = 1080
HEIGHT = 1920
FPS = 30

def get_font(size: int, bold=True):
    font_paths = [
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\impact.ttf",
        "C:\\Windows\\Fonts\\calibrib.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def get_mono_font(size: int):
    font_paths = [
        "C:\\Windows\\Fonts\\consola.ttf",
        "C:\\Windows\\Fonts\\courbd.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

# ── 3 HEAVENCLIP MOTION DESIGN REEL SCRIPTS ──────────────────────────────────
HEAVENCLIP_SCRIPTS = [
    {
        "id": "heavenclip_reel_1_motion_designer",
        "title": "Why Manual Video Editing is Officially Dead",
        "voice": "en-US-ChristopherNeural",
        "rate": "+15%",
        "scenes": [
            {
                "text": "Video editors are charging five thousand dollars a month for basic motion graphics.",
                "badge": "⚡ MOTION DESIGN REVOLUTION",
                "accent_color": (45, 78, 255),
                "highlight_words": ["five thousand", "motion graphics", "charging"],
                "card_title": "AI MOTION DESIGNER",
                "card_subtitle": "Zero Keyframes · Auto-Generated Kinetic Overlays"
            },
            {
                "text": "HeavenClip changes everything. You just upload your raw footage.",
                "badge": "🎬 HEAVENCLIP AI ENGINE",
                "accent_color": (99, 102, 241),
                "highlight_words": ["heavenclip", "everything", "raw footage"],
                "card_title": "1-CLICK RAW INGESTION",
                "card_subtitle": "Silence Removal & Word-Level Auto Sync"
            },
            {
                "text": "The AI automatically removes every awkward silence, trims filler words, and detects key hooks.",
                "badge": "✂️ AUTO-SILENCE & HOOK DETECTION",
                "accent_color": (16, 185, 129),
                "highlight_words": ["awkward silence", "filler words", "key hooks"],
                "card_title": "INTELLIGENT CUT ENGINE",
                "card_subtitle": "Multi-Track Timeline + AI Co-Editor"
            },
            {
                "text": "Then it generates custom kinetic motion design overlays, animated sound effects, and viral captions.",
                "badge": "🎨 KINETIC MOTION TEMPLATES",
                "accent_color": (236, 72, 153),
                "highlight_words": ["kinetic motion", "sound effects", "viral captions"],
                "card_title": "VIRAL MOTION OVERLAYS",
                "card_subtitle": "Editorial Zine · Neon UI · Blueprint Schematic"
            },
            {
                "text": "What used to take six hours in Premiere Pro is finished in literally ten seconds.",
                "badge": "⏱️ 10-SECOND EXPORT VELOCITY",
                "accent_color": (245, 158, 11),
                "highlight_words": ["six hours", "premiere pro", "ten seconds"],
                "card_title": "10x CREATOR WORKFLOW",
                "card_subtitle": "Export in 4K for TikTok, Reels & X"
            },
            {
                "text": "Start creating your first motion-designed short free at heavenclip dot com.",
                "badge": "🚀 TRY HEAVENCLIP FREE",
                "accent_color": (45, 78, 255),
                "highlight_words": ["start creating", "free", "heavenclip.com"],
                "card_title": "WWW.HEAVENCLIP.COM",
                "card_subtitle": "No Credit Card Required · Instant Free Access"
            }
        ]
    },
    {
        "id": "heavenclip_reel_2_money_printer_turbo",
        "title": "The Viral Short Money Printer Turbo",
        "voice": "en-US-GuyNeural",
        "rate": "+18%",
        "scenes": [
            {
                "text": "Top content creators are publishing thirty motion-designed Reels every week on pure autopilot.",
                "badge": "🔥 VIRAL CONTENT ENGINE",
                "accent_color": (239, 68, 68),
                "highlight_words": ["thirty", "autopilot", "creators"],
                "card_title": "MONEY PRINTER TURBO",
                "card_subtitle": "30 High-Converting Shorts / Week"
            },
            {
                "text": "Their secret weapon? HeavenClip AI Video Editor and Motion Designer.",
                "badge": "💎 SECRET WEAPON UNLOCKED",
                "accent_color": (45, 78, 255),
                "highlight_words": ["secret weapon", "heavenclip", "motion designer"],
                "card_title": "HEAVENCLIP.COM",
                "card_subtitle": "Your All-In-One AI Production Studio"
            },
            {
                "text": "Choose an AI Director for viral Shorts, cinematic storytelling, podcasts, or business demos.",
                "badge": "🤖 PRE-TRAINED AI DIRECTORS",
                "accent_color": (168, 85, 247),
                "highlight_words": ["ai director", "storytelling", "podcasts"],
                "card_title": "AI DIRECTORS SUITE",
                "card_subtitle": "Style & Pacing Matched to Your Niche"
            },
            {
                "text": "One raw video turns into five high-converting short-form clips with animated captions and kinetic graphics.",
                "badge": "⚡ 1 RAW VIDEO → 5 SHORTS",
                "accent_color": (16, 185, 129),
                "highlight_words": ["five", "animated captions", "kinetic"],
                "card_title": "CONTENT MULTIPLIER",
                "card_subtitle": "Word-by-Word Kinetic Highlighting"
            },
            {
                "text": "Stop wasting days inside clunky editing software. Let AI do the heavy lifting.",
                "badge": "🚫 NO MORE CLUNKY EDITORS",
                "accent_color": (245, 158, 11),
                "highlight_words": ["wasting days", "clunky", "heavy lifting"],
                "card_title": "ZERO KEYFRAMING FATIGUE",
                "card_subtitle": "Professional Multi-Track Power"
            },
            {
                "text": "Go to heavenclip dot com and turn your raw videos into viral gold right now.",
                "badge": "🚀 LAUNCH HEAVENCLIP NOW",
                "accent_color": (45, 78, 255),
                "highlight_words": ["heavenclip.com", "viral gold", "right now"],
                "card_title": "START CREATING FREE",
                "card_subtitle": "Claim Your Free AI Video Credits Today"
            }
        ]
    },
    {
        "id": "heavenclip_reel_3_solo_founder_story",
        "title": "Built by a 17-Year-Old Solo Founder",
        "voice": "en-US-ChristopherNeural",
        "rate": "+15%",
        "scenes": [
            {
                "text": "I am Shourya Shetty, seventeen years old, and I spent hundreds of hours editing videos by hand.",
                "badge": "👨‍💻 SOLO FOUNDER STORY",
                "accent_color": (45, 78, 255),
                "highlight_words": ["shourya shetty", "seventeen", "hundreds of hours"],
                "card_title": "BUILT BY SHOURYA SHETTY",
                "card_subtitle": "17-Year-Old Deep-Tech Builder"
            },
            {
                "text": "Cutting silences frame-by-frame and keyframing motion graphics was draining my entire day.",
                "badge": "😫 THE MANUAL EDITING TRAP",
                "accent_color": (239, 68, 68),
                "highlight_words": ["cutting silences", "keyframing", "draining"],
                "card_title": "6 HOURS OF MANUAL PAIN",
                "card_subtitle": "Keyframing Overlays & Aligning Captions"
            },
            {
                "text": "So I built HeavenClip: an autonomous AI Video Editor and Motion Designer in one unified platform.",
                "badge": "🛠️ THE BIRTH OF HEAVENCLIP",
                "accent_color": (99, 102, 241),
                "highlight_words": ["built heavenclip", "autonomous", "unified"],
                "card_title": "THE HEAVENCLIP PLATFORM",
                "card_subtitle": "AI Video Editor + Motion Designer"
            },
            {
                "text": "It understands your story, auto-removes silences, and generates scroll-stopping motion design in seconds.",
                "badge": "🧠 AI STORYTELLING ENGINE",
                "accent_color": (16, 185, 129),
                "highlight_words": ["understands", "scroll-stopping", "seconds"],
                "card_title": "NEURAL MOTION GRAPHICS",
                "card_subtitle": "Detects Hooks & Generates Overlays"
            },
            {
                "text": "No team. No bloated agency costs. Just pure deep-tech software built for the next generation of creators.",
                "badge": "⚡ SOLO FOUNDER / PURE TECH",
                "accent_color": (245, 158, 11),
                "highlight_words": ["no team", "pure deep-tech", "creators"],
                "card_title": "BUILT FOR CREATORS",
                "card_subtitle": "Automate Your Entire Content Flywheel"
            },
            {
                "text": "Try it right now for free at heavenclip dot com slash dashboard.",
                "badge": "🚀 LIVE AT HEAVENCLIP.COM",
                "accent_color": (45, 78, 255),
                "highlight_words": ["try it", "free", "heavenclip.com"],
                "card_title": "HEAVENCLIP.COM/DASHBOARD",
                "card_subtitle": "Join Thousands of Modern Creators"
            }
        ]
    }
]

async def generate_tts(text: str, voice: str, rate: str, out_path: str):
    communicate = edge_tts.Communicate(text, voice, rate=rate)
    await communicate.save(out_path)

def get_audio_duration(audio_path: str) -> float:
    cmd = [
        FFMPEG_EXE, "-i", audio_path,
        "-f", "null", "-"
    ]
    p = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    for line in p.stderr.splitlines():
        if "Duration:" in line:
            parts = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = parts.split(":")
            return float(h) * 3600 + float(m) * 60 + float(s)
    return 3.0

def create_motion_design_frame(
    scene_data: dict,
    frame_idx: int,
    total_frames: int,
    script_title: str
) -> Image.Image:
    t = frame_idx / max(total_frames, 1)
    
    # ── BASE CANVAS (Deep Space Indigo to Obsidian Gradient) ─────────────────
    img = Image.new("RGB", (WIDTH, HEIGHT), (7, 9, 24))
    draw = ImageDraw.Draw(img)

    accent_r, accent_g, accent_b = scene_data.get("accent_color", (45, 78, 255))

    # Dynamic animated radial glow in center/top
    glow_pulse = 0.5 + 0.5 * math.sin(t * math.pi * 3)
    glow_radius = int(450 + 80 * glow_pulse)
    cx = int(WIDTH / 2 + 60 * math.sin(t * math.pi * 2))
    cy = int(HEIGHT * 0.42 + 40 * math.cos(t * math.pi * 2))
    
    # Draw gradient concentric circles for soft lighting
    for r in range(glow_radius, 0, -25):
        alpha = int((1 - (r / glow_radius)) * 32 * glow_pulse)
        draw.ellipse(
            (cx - r, cy - r, cx + r, cy + r),
            fill=(int(accent_r * alpha / 100), int(accent_g * alpha / 100), int(accent_b * alpha / 100))
        )

    # ── AMBIENT CYBER GRID / PARTICLES ───────────────────────────────────────
    random.seed(42)
    for i in range(24):
        px = (random.randint(50, WIDTH - 50) + int(t * 120 * ((i % 3) - 1))) % (WIDTH - 60) + 30
        py = (random.randint(80, HEIGHT - 80) + int(t * 90 * (1 if i % 2 == 0 else -1))) % (HEIGHT - 100) + 50
        p_rad = random.randint(2, 5)
        p_alpha = int(80 + 70 * math.sin(t * 6 + i))
        draw.ellipse((px - p_rad, py - p_rad, px + p_rad, py + p_rad), fill=(accent_r, accent_g, accent_b))

    # ── TOP BRAND HEADER ─────────────────────────────────────────────────────
    font_brand = get_font(40, bold=True)
    font_sub = get_mono_font(22)
    
    # Brand logo text: Heaven (White) + Clip (Accent)
    draw.text((70, 90), "Heaven", fill=(255, 255, 255), font=font_brand)
    brand_w = font_brand.getlength("Heaven")
    draw.text((70 + brand_w, 90), "Clip", fill=(accent_r, accent_g, accent_b), font=font_brand)
    
    # Pill badge right
    draw.rounded_rectangle((WIDTH - 370, 85, WIDTH - 70, 135), radius=25, fill=(255, 255, 255, 18), outline=(accent_r, accent_g, accent_b), width=2)
    draw.text((WIDTH - 350, 98), "AI VIDEO EDITOR + MOTION", fill=(255, 255, 255), font=font_sub)

    # Top animated progress bar
    progress_w = int((WIDTH - 140) * t)
    draw.rounded_rectangle((70, 155, WIDTH - 70, 163), radius=4, fill=(30, 35, 60))
    draw.rounded_rectangle((70, 155, 70 + progress_w, 163), radius=4, fill=(accent_r, accent_g, accent_b))

    # ── TOP SCENE BADGE ──────────────────────────────────────────────────────
    badge_text = scene_data.get("badge", "⚡ MOTION DESIGN ENGINE")
    font_badge = get_mono_font(26)
    badge_w = font_badge.getlength(badge_text)
    badge_box = (int((WIDTH - badge_w) / 2) - 28, 230, int((WIDTH + badge_w) / 2) + 28, 285)
    draw.rounded_rectangle(badge_box, radius=28, fill=(15, 22, 50), outline=(accent_r, accent_g, accent_b), width=2)
    draw.text((int((WIDTH - badge_w) / 2), 243), badge_text, fill=(255, 255, 255), font=font_badge)

    # ── MAIN SPOKEN SCRIPT CAPTION (KINETIC TYPOGRAPHY) ───────────────────────
    caption_text = scene_data.get("text", "")
    words = caption_text.split()
    font_caption = get_font(52, bold=True)
    highlight_set = [w.lower() for w in scene_data.get("highlight_words", [])]

    # Break words into lines
    lines = []
    curr_line = []
    for w in words:
        test_line = " ".join(curr_line + [w])
        if font_caption.getlength(test_line) < WIDTH - 180:
            curr_line.append(w)
        else:
            lines.append(curr_line)
            curr_line = [w]
    if curr_line:
        lines.append(curr_line)

    start_y = 350
    line_h = 74
    total_text_words = len(words)
    active_word_idx = min(int(t * total_text_words * 1.15), total_text_words - 1)

    word_count_tracker = 0
    for l_idx, l_words in enumerate(lines):
        line_str = " ".join(l_words)
        line_w = font_caption.getlength(line_str)
        curr_x = int((WIDTH - line_w) / 2)
        curr_y = start_y + l_idx * line_h

        for w in l_words:
            clean_w = w.lower().strip(".,!?\"'")
            is_highlighted = any(h in clean_w for h in highlight_set)
            is_active_word = (word_count_tracker == active_word_idx)
            w_len = font_caption.getlength(w + " ")

            if is_active_word:
                # Active kinetic pulse box behind current spoken word
                box_pad = 6
                draw.rounded_rectangle(
                    (curr_x - box_pad, curr_y - box_pad, curr_x + w_len - 4 + box_pad, curr_y + font_caption.size + box_pad),
                    radius=10,
                    fill=(accent_r, accent_g, accent_b)
                )
                draw.text((curr_x, curr_y), w, fill=(255, 255, 255), font=font_caption)
            elif is_highlighted:
                # Keyword glow in bright yellow/cyan
                draw.text((curr_x, curr_y), w, fill=(255, 230, 80), font=font_caption)
            else:
                draw.text((curr_x, curr_y), w, fill=(230, 235, 250), font=font_caption)

            curr_x += int(w_len)
            word_count_tracker += 1

    # ── HEAVENCLIP SIGNATURE 3D MOTION DESIGN CARD ───────────────────────────
    # Signature Blue Bounding Box with 4 corner dots & kinetic float
    card_y = 800 + int(12 * math.sin(t * math.pi * 2))
    card_h = 580
    card_w = WIDTH - 160
    card_x = 80

    # Glass Card Background
    draw.rounded_rectangle((card_x, card_y, card_x + card_w, card_y + card_h), radius=28, fill=(13, 17, 38), outline=(accent_r, accent_g, accent_b), width=3)
    
    # HeavenClip 4 Corner Dot Crosshairs
    dot_rad = 6
    dot_color = (accent_r, accent_g, accent_b)
    # Top-Left
    draw.ellipse((card_x - dot_rad, card_y - dot_rad, card_x + dot_rad, card_y + dot_rad), fill=dot_color)
    # Top-Right
    draw.ellipse((card_x + card_w - dot_rad, card_y - dot_rad, card_x + card_w + dot_rad, card_y + dot_rad), fill=dot_color)
    # Bottom-Left
    draw.ellipse((card_x - dot_rad, card_y + card_h - dot_rad, card_x + dot_rad, card_y + card_h + dot_rad), fill=dot_color)
    # Bottom-Right
    draw.ellipse((card_x + card_w - dot_rad, card_y + card_h - dot_rad, card_x + card_w + dot_rad, card_y + card_h + dot_rad), fill=dot_color)

    # Card Title
    font_card_title = get_font(42, bold=True)
    card_title_str = scene_data.get("card_title", "AI MOTION DESIGN")
    draw.text((card_x + 40, card_y + 45), card_title_str, fill=(255, 255, 255), font=font_card_title)

    # Card Subtitle
    font_card_sub = get_mono_font(24)
    card_sub_str = scene_data.get("card_subtitle", "Automated Video Editing Engine")
    draw.text((card_x + 40, card_y + 105), card_sub_str, fill=(accent_r, accent_g, accent_b), font=font_card_sub)

    # Animated Audio Spectrum Waveform inside Card
    spectrum_y = card_y + 200
    num_bars = 32
    bar_w = int((card_w - 80) / num_bars) - 4
    for b_idx in range(num_bars):
        bar_h = int(30 + 120 * abs(math.sin(t * 10 + b_idx * 0.45)))
        bar_x = card_x + 40 + b_idx * (bar_w + 4)
        draw.rounded_rectangle(
            (bar_x, spectrum_y + 140 - bar_h, bar_x + bar_w, spectrum_y + 140),
            radius=4,
            fill=(accent_r, accent_g, accent_b)
        )

    # Timeline Cut Markers Visualizer
    timeline_y = card_y + 400
    draw.rounded_rectangle((card_x + 40, timeline_y, card_x + card_w - 40, timeline_y + 24), radius=12, fill=(25, 32, 60))
    # Animated Scrubber Head
    scrub_x = card_x + 40 + int((card_w - 80) * ((t * 2) % 1.0))
    draw.rounded_rectangle((scrub_x - 6, timeline_y - 8, scrub_x + 6, timeline_y + 32), radius=6, fill=(255, 255, 255))
    # Cut markers
    for cm in [0.2, 0.45, 0.7, 0.88]:
        cm_x = card_x + 40 + int((card_w - 80) * cm)
        draw.line((cm_x, timeline_y, cm_x, timeline_y + 24), fill=(255, 80, 80), width=3)

    # Feature checklist pill inside card
    font_feat = get_mono_font(22)
    draw.text((card_x + 40, card_y + 460), "✓ SILENCE CUT", fill=(16, 185, 129), font=font_feat)
    draw.text((card_x + 280, card_y + 460), "✓ WORD CAPTIONS", fill=(16, 185, 129), font=font_feat)
    draw.text((card_x + 570, card_y + 460), "✓ 60FPS OVERLAYS", fill=(16, 185, 129), font=font_feat)

    # ── BOTTOM SOCIAL PROOF & CALL TO ACTION ─────────────────────────────────
    cta_y = HEIGHT - 380
    
    # 3-Step Micro Workflow Pills
    pills = ["1. Upload Raw Video", "2. AI Motion Edit", "3. Export Viral 4K"]
    pill_w = int((WIDTH - 160) / 3) - 10
    font_pill = get_mono_font(19)
    for p_i, p_t in enumerate(pills):
        px = 80 + p_i * (pill_w + 10)
        draw.rounded_rectangle((px, cta_y, px + pill_w, cta_y + 55), radius=14, fill=(18, 22, 45), outline=(60, 75, 120), width=1)
        draw.text((px + 14, cta_y + 16), p_t, fill=(220, 230, 255), font=font_pill)

    # Large Glowing CTA Button at Bottom
    cta_btn_y = HEIGHT - 270
    draw.rounded_rectangle((80, cta_btn_y, WIDTH - 80, cta_btn_y + 120), radius=60, fill=(accent_r, accent_g, accent_b))
    font_cta_btn = get_font(44, bold=True)
    cta_label = "START CREATING FREE →"
    cta_w = font_cta_btn.getlength(cta_label)
    draw.text((int((WIDTH - cta_w) / 2), cta_btn_y + 35), cta_label, fill=(255, 255, 255), font=font_cta_btn)

    # Footer domain subtitle
    font_footer = get_mono_font(26)
    footer_text = "www.heavenclip.com · Built for Creators & Founders"
    f_w = font_footer.getlength(footer_text)
    draw.text((int((WIDTH - f_w) / 2), HEIGHT - 110), footer_text, fill=(160, 175, 215), font=font_footer)

    return img

async def render_script_video(script: dict) -> str:
    reel_id = script["id"]
    print(f"\n🎬 Rendering High-Impact Motion Design Reel: {reel_id} ({script['title']})...")

    scene_audio_files = []
    scene_durations = []
    
    # 1. Generate Voiceover TTS for each scene
    for s_idx, scene in enumerate(script["scenes"]):
        audio_file = os.path.join(TEMP_DIR, f"{reel_id}_scene_{s_idx}.mp3")
        await generate_tts(scene["text"], script["voice"], script.get("rate", "+15%"), audio_file)
        dur = get_audio_duration(audio_file)
        # Add 0.35s breathing buffer
        dur += 0.35
        scene_audio_files.append(audio_file)
        scene_durations.append(dur)
        print(f"   Scene {s_idx + 1}/{len(script['scenes'])} TTS generated ({dur:.2f}s)")

    # 2. Render Motion Frames for each scene
    concat_video_segments = []
    for s_idx, scene in enumerate(script["scenes"]):
        dur = scene_durations[s_idx]
        total_scene_frames = int(dur * FPS)
        scene_frames_dir = os.path.join(TEMP_DIR, f"{reel_id}_scene_{s_idx}_frames")
        os.makedirs(scene_frames_dir, exist_ok=True)

        for f_idx in range(total_scene_frames):
            frame_img = create_motion_design_frame(
                scene,
                f_idx,
                total_scene_frames,
                script["title"]
            )
            frame_path = os.path.join(scene_frames_dir, f"frame_{f_idx:05d}.png")
            frame_img.save(frame_path, "PNG")

        # Encode scene video with its audio
        scene_mp4 = os.path.join(TEMP_DIR, f"{reel_id}_scene_{s_idx}.mp4")
        encode_cmd = [
            FFMPEG_EXE, "-y",
            "-framerate", str(FPS),
            "-i", os.path.join(scene_frames_dir, "frame_%05d.png"),
            "-i", scene_audio_files[s_idx],
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            scene_mp4
        ]
        subprocess.run(encode_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        concat_video_segments.append(scene_mp4)
        print(f"   Scene {s_idx + 1} encoded into video segment ({scene_mp4})")

    # 3. Concatenate all scene video segments into final 1080x1920 MP4
    concat_list_file = os.path.join(TEMP_DIR, f"{reel_id}_concat.txt")
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for seg in concat_video_segments:
            f.write(f"file '{seg.replace(chr(92), '/')}'\n")

    final_output_path = os.path.join(OUTPUT_DIR, f"{reel_id}.mp4")
    concat_cmd = [
        FFMPEG_EXE, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list_file,
        "-c", "copy",
        final_output_path
    ]
    subprocess.run(concat_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"✅ Final 1080x1920 Reel Rendered: {final_output_path}")

    # Copy to Brain Artifacts Directory for Direct User Download
    artifact_path = os.path.join(ARTIFACT_DIR, f"{reel_id}.mp4")
    with open(final_output_path, "rb") as src, open(artifact_path, "wb") as dst:
        dst.write(src.read())
    print(f"📁 Copied to Artifact Brain Directory: {artifact_path}")

    return final_output_path

async def main():
    print("🚀 HEAVENCLIP AI VIDEO & MOTION DESIGN ENGINE INITIALIZING...")
    rendered_files = []
    for script in HEAVENCLIP_SCRIPTS:
        out_file = await render_script_video(script)
        rendered_files.append(out_file)

    print("\n🎉 ALL 3 HEAVENCLIP VIRAL MOTION DESIGN REELS GENERATED SUCCESSFULLY!")
    for rf in rendered_files:
        print(f" - {rf}")

if __name__ == "__main__":
    asyncio.run(main())
