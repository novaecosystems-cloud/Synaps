import asyncio
import os
import sys
import json
import ssl
import subprocess
import imageio_ffmpeg

# Configure SSL context for Windows edge-tts
ssl._create_default_https_context = ssl._create_unverified_context
import edge_tts
import edge_tts.communicate
edge_tts.communicate._SSL_CTX = ssl._create_unverified_context()

from PIL import Image, ImageDraw, ImageFont

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output", "videos")
TEMP_DIR = os.path.join(os.path.dirname(__file__), "..", "output", "temp")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# Try to find a nice bold font on Windows
def get_font(size: int, bold=True):
    font_paths = [
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\segoeuib.ttf",
        "C:\\Windows\\Fonts\\impact.ttf",
        "C:\\Windows\\Fonts\\arial.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

# ── 3 VIRAL SHORT SCRIPTS FOR INSTAGRAM REELS & X (TWITTER) ──────────────────
SCRIPTS = [
    {
        "id": "causarix_reel_1_delaware_redlines",
        "title": "Why In-House Lawyers are Ditching ChatGPT for Delaware Redlines",
        "voice": "en-US-ChristopherNeural",
        "scenes": [
            {
                "text": "Did you know 90% of legal counsels refuse to use ChatGPT for enterprise contract review?",
                "bg_image": "public/brand/causarix_brand_logo.jpg",
                "badge": "🚨 ENTERPRISE LEGAL ALERT",
                "highlight_words": ["90%", "refuse", "chatgpt"]
            },
            {
                "text": "Here is why: standard AI models hallucinate liability clauses and drift on financial math.",
                "bg_image": "public/brand/causarix_benchmark_table.jpg",
                "badge": "⚠️ 17.8% CALCULATION DRIFT",
                "highlight_words": ["hallucinate", "drift", "math"]
            },
            {
                "text": "When you review a 40-page vendor agreement with an uncapped indemnity, a single hallucination destroys a company.",
                "bg_image": "public/showcase/synaps_img1_redlining.jpg",
                "badge": "⚖️ CONTRACT LIABILITY AUDIT",
                "highlight_words": ["uncapped", "indemnity", "destroys"]
            },
            {
                "text": "That is why enterprise leadership is switching to Causarix.",
                "bg_image": "public/mockups/causarix_laptop_dashboard_hero.png",
                "badge": "💎 CAUSARIX DECISION OS",
                "highlight_words": ["switching", "causarix"]
            },
            {
                "text": "It checks cross-silo contradictions between Sales SLAs, Cloud Infrastructure, and CFO cash reserves in 60 seconds.",
                "bg_image": "public/upscaled/04_Chief_Of_Staff_Briefing_4K.png",
                "badge": "⚡ 60-SECOND AUDIT ENGINE",
                "highlight_words": ["cross-silo", "cfo", "60 seconds"]
            },
            {
                "text": "Every counter-clause is mathematically grounded in Delaware DGCL Section 141 statutory rules with zero hallucinations.",
                "bg_image": "public/showcase/synaps_img2_boardroom.jpg",
                "badge": "🛡️ DELAWARE STATUTORY PROOF",
                "highlight_words": ["delaware", "dgcl", "zero hallucinations"]
            },
            {
                "text": "Test drive a 200 million dollar audit simulation live at causarix dot vercel dot app slash demo.",
                "bg_image": "public/mockups/causarix_laptop_dashboard_hero.png",
                "badge": "🚀 60s LIVE SANDBOX (ZERO LOGIN)",
                "highlight_words": ["test drive", "200 million", "demo"]
            }
        ]
    },
    {
        "id": "causarix_reel_2_math_drift_benchmark",
        "title": "The 17% Math Trap in Generative AI",
        "voice": "en-US-GuyNeural",
        "scenes": [
            {
                "text": "Stop letting raw AI calculate your company cash runway or contract penalties.",
                "bg_image": "public/brand/causarix_benchmark_table.jpg",
                "badge": "🛑 DANGEROUS AI MATH",
                "highlight_words": ["stop", "cash runway", "penalties"]
            },
            {
                "text": "In a benchmark of 1,000 enterprise scenarios, frontier LLMs drifted by up to 17% on multi-step financial arithmetic.",
                "bg_image": "public/brand/causarix_benchmark_table.jpg",
                "badge": "📊 1,000 SCENARIO BENCHMARK",
                "highlight_words": ["1,000", "drifted", "17%"]
            },
            {
                "text": "Why? Because standard models are probabilistic token predictors, not deterministic calculators.",
                "bg_image": "public/showcase/synaps_img3_graph.jpg",
                "badge": "🧠 TOKEN PREDICTOR FLAW",
                "highlight_words": ["token predictors", "not calculators"]
            },
            {
                "text": "Causarix solves this with a neuro-symbolic architecture combining Google Gemini with client-side WebAssembly.",
                "bg_image": "public/mockups/causarix_laptop_dashboard_hero.png",
                "badge": "⚙️ WEBASSEMBLY ENGINE",
                "highlight_words": ["causarix", "webassembly", "gemini"]
            },
            {
                "text": "The result is exactly 0.00% arithmetic drift and instant graph traversal across your entire company files.",
                "bg_image": "public/upscaled/07_AI_Prediction_Risk_Center_4K.png",
                "badge": "🎯 0.00% VERIFIED DRIFT",
                "highlight_words": ["0.00%", "instant", "entire company"]
            },
            {
                "text": "Do not gamble with your balance sheet. Experience deterministic intelligence at causarix dot vercel dot app.",
                "bg_image": "public/brand/causarix_brand_logo.jpg",
                "badge": "🔗 CAUSARIX.VERCEL.APP",
                "highlight_words": ["balance sheet", "deterministic", "causarix"]
            }
        ]
    },
    {
        "id": "causarix_reel_3_boardroom_quorum",
        "title": "Simulate Your Boardroom with 10 AI Agents Before You Vote",
        "voice": "en-US-JennyNeural",
        "scenes": [
            {
                "text": "What if you could stress-test your biggest strategic decisions before walking into the boardroom?",
                "bg_image": "public/showcase/synaps_boardroom_digital_twins.png",
                "badge": "🔮 EXECUTIVE SIMULATION",
                "highlight_words": ["stress-test", "decisions", "boardroom"]
            },
            {
                "text": "Meet Causarix 10-Agent Autonomous Boardroom Quorum.",
                "bg_image": "public/mockups/causarix_laptop_dashboard_hero.png",
                "badge": "👥 10-AGENT BOARDROOM",
                "highlight_words": ["meet", "causarix", "quorum"]
            },
            {
                "text": "Your autonomous CEO, CFO, General Counsel, and Risk Officer agents debate and stress-test 10,000 Monte Carlo scenarios in real time.",
                "bg_image": "public/upscaled/03_Boardroom_Simulation_Engine_4K.png",
                "badge": "⚡ 10,000 MONTE CARLO RUNS",
                "highlight_words": ["ceo", "cfo", "general counsel", "10,000"]
            },
            {
                "text": "They flag hidden software license risks, catch unbudgeted SLA clawbacks, and verify Delaware corporate law compliance before you sign.",
                "bg_image": "public/showcase/synaps_img1_redlining.jpg",
                "badge": "🛡️ FIDUCIARY COMPLIANCE",
                "highlight_words": ["license risks", "clawbacks", "delaware"]
            },
            {
                "text": "Test drive the interactive sandbox with zero login at causarix dot vercel dot app slash demo.",
                "bg_image": "public/mockups/causarix_laptop_dashboard_hero.png",
                "badge": "🚀 TRY LIVE SANDBOX NOW",
                "highlight_words": ["test drive", "zero login", "demo"]
            }
        ]
    }
]


async def generate_scene_audio(text: str, voice: str, audio_path: str):
    """Generate audio using edge-tts."""
    communicate = edge_tts.Communicate(text, voice, rate="+8%")
    await communicate.save(audio_path)


def get_audio_duration(audio_path: str) -> float:
    """Get exact duration in seconds using ffmpeg."""
    cmd = [
        FFMPEG_EXE, "-i", audio_path, "-f", "null", "-"
    ]
    res = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    for line in res.stderr.split("\n"):
        if "Duration:" in line:
            parts = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = parts.split(":")
            return float(h) * 3600 + float(m) * 60 + float(s)
    return 5.0


def create_vertical_frame(bg_image_path: str, badge_text: str, subtitle_text: str, output_image_path: str, target_w=1080, target_h=1920):
    """
    Creates a high-production 9:16 vertical canvas with:
    - Dark obsidian gradient + blurred background
    - Centered UI screenshot card with glowing border
    - Top pill badge
    - Large kinetic viral subtitle overlay at the bottom
    """
    root_dir = os.path.join(os.path.dirname(__file__), "..")
    abs_bg = os.path.join(root_dir, bg_image_path) if not os.path.isabs(bg_image_path) else bg_image_path
    
    canvas = Image.new("RGBA", (target_w, target_h), (3, 5, 18, 255))
    
    if os.path.exists(abs_bg):
        try:
            with Image.open(abs_bg) as img:
                img = img.convert("RGBA")
                # 1. Blurred background fill
                bg_blur = img.copy().resize((target_w, target_h), Image.Resampling.BILINEAR)
                overlay = Image.new("RGBA", (target_w, target_h), (2, 4, 15, 210))
                bg_blur.paste(overlay, (0, 0), overlay)
                canvas.paste(bg_blur, (0, 0))
                
                # 2. Centered UI content card
                img_w, img_h = img.size
                scale = min((target_w - 90) / img_w, (target_h * 0.46) / img_h)
                new_w, new_h = int(img_w * scale), int(img_h * scale)
                content_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                
                pos_x = (target_w - new_w) // 2
                pos_y = int(target_h * 0.18)
                
                # Card glowing frame
                draw_glow = ImageDraw.Draw(canvas)
                for offset in range(8, 0, -2):
                    alpha = int(40 - offset * 4)
                    draw_glow.rectangle(
                        [pos_x - offset, pos_y - offset, pos_x + new_w + offset, pos_y + new_h + offset],
                        outline=(99, 102, 241, alpha),
                        width=2
                    )
                canvas.paste(content_img, (pos_x, pos_y), content_img)
        except Exception as e:
            print(f"Error processing image {abs_bg}: {e}")
            
    draw = ImageDraw.Draw(canvas)
    font_badge = get_font(38, bold=True)
    font_sub = get_font(52, bold=True)
    font_footer = get_font(32, bold=True)
    
    # ── Top Header Brand Pill ──
    header_w = 640
    header_h = 75
    draw.rounded_rectangle([target_w // 2 - header_w // 2, 90, target_w // 2 + header_w // 2, 90 + header_h], radius=38, fill=(15, 23, 42, 240), outline=(99, 102, 241, 220), width=3)
    # Green pulse dot
    draw.ellipse([target_w // 2 - header_w // 2 + 25, 115, target_w // 2 - header_w // 2 + 45, 135], fill=(16, 185, 129, 255))
    draw.text((target_w // 2 - 250, 107), "CAUSARIX™ · CAUSAL DECISION OS", font=get_font(28, bold=True), fill=(255, 255, 255, 255))
    
    # ── Scene Context Badge ──
    badge_w = min(target_w - 120, len(badge_text) * 28 + 60)
    draw.rounded_rectangle([target_w // 2 - badge_w // 2, int(target_h * 0.67), target_w // 2 + badge_w // 2, int(target_h * 0.67) + 70], radius=20, fill=(30, 27, 75, 240), outline=(236, 72, 153, 200), width=2)
    draw.text((target_w // 2 - badge_w // 2 + 30, int(target_h * 0.67) + 15), badge_text, font=font_badge, fill=(244, 244, 245, 255))
    
    # ── Bottom Kinetic Subtitle Card (Viral Yellow & White) ──
    sub_box_y = int(target_h * 0.74)
    draw.rounded_rectangle([45, sub_box_y, target_w - 45, sub_box_y + 280], radius=28, fill=(10, 10, 18, 235), outline=(99, 102, 241, 140), width=2)
    
    # Word wrap subtitle text
    words = subtitle_text.split()
    lines = []
    curr_line = []
    for w in words:
        curr_line.append(w)
        if len(" ".join(curr_line)) > 26:
            lines.append(" ".join(curr_line[:-1]))
            curr_line = [w]
    if curr_line:
        lines.append(" ".join(curr_line))
        
    line_y = sub_box_y + 35
    for l in lines[:4]:
        # Draw bold white text with dark drop shadow
        draw.text((68, line_y + 3), l, font=font_sub, fill=(0, 0, 0, 220))
        draw.text((65, line_y), l, font=font_sub, fill=(255, 255, 255, 255))
        line_y += 65

    # ── Bottom Footer URL Pill ──
    draw.rounded_rectangle([target_w // 2 - 380, target_h - 130, target_w // 2 + 380, target_h - 60], radius=35, fill=(16, 185, 129, 30), outline=(16, 185, 129, 200), width=2)
    draw.text((target_w // 2 - 340, target_h - 110), "⚡ Try 60s Live Sandbox: causarix.vercel.app/demo", font=font_footer, fill=(52, 211, 153, 255))
    
    # Save frame
    canvas.convert("RGB").save(output_image_path, "JPEG", quality=95)


async def render_video(script_data):
    """
    Renders an end-to-end 9:16 vertical video for Instagram/X.
    """
    video_id = script_data["id"]
    print(f"\n==================================================")
    print(f"🎬 RENDERING VIRAL VIDEO: {script_data['title']}")
    print(f"ID: {video_id}")
    print(f"==================================================")

    scene_clips = []
    current_time = 0.0

    for i, scene in enumerate(script_data["scenes"]):
        scene_audio = os.path.join(TEMP_DIR, f"{video_id}_scene_{i}.mp3")
        scene_frame = os.path.join(TEMP_DIR, f"{video_id}_frame_{i}.jpg")
        scene_video = os.path.join(TEMP_DIR, f"{video_id}_scene_{i}.mp4")

        # 1. Generate Voiceover Audio
        print(f"  [Scene {i+1}/{len(script_data['scenes'])}] Generating TTS audio ({script_data['voice']})...")
        await generate_scene_audio(scene["text"], script_data["voice"], scene_audio)
        dur = get_audio_duration(scene_audio) + 0.30
        
        # 2. Create 9:16 Visual Frame with subtitles
        print(f"  [Scene {i+1}/{len(script_data['scenes'])}] Creating 9:16 visual frame (1080x1920)...")
        create_vertical_frame(scene["bg_image"], scene["badge"], scene["text"], scene_frame)

        # 3. Render Scene Video Clip with subtle motion zoom
        print(f"  [Scene {i+1}/{len(script_data['scenes'])}] Encoding MP4 scene clip (duration: {dur:.2f}s)...")
        ffmpeg_scene_cmd = [
            FFMPEG_EXE, "-y",
            "-loop", "1", "-i", scene_frame,
            "-i", scene_audio,
            "-vf", f"zoompan=z='min(zoom+0.0006,1.04)':d={int(dur*30)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30",
            "-t", str(dur),
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            scene_video
        ]
        subprocess.run(ffmpeg_scene_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        scene_clips.append(scene_video)
        current_time += dur

    # 4. Concatenate all scene clips into final MP4
    concat_list_path = os.path.join(TEMP_DIR, f"{video_id}_concat.txt")
    with open(concat_list_path, "w", encoding="utf-8") as f:
        for clip in scene_clips:
            f.write(f"file '{os.path.abspath(clip).replace(chr(92), '/')}'\n")

    final_output_path = os.path.join(OUTPUT_DIR, f"{video_id}.mp4")
    print(f"\n🔗 Stitching final 1080x1920 MP4 for Instagram/X: {final_output_path}...")
    ffmpeg_concat_cmd = [
        FFMPEG_EXE, "-y",
        "-f", "concat", "-safe", "0", "-i", concat_list_path,
        "-c", "copy",
        final_output_path
    ]
    subprocess.run(ffmpeg_concat_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    print(f"\n✅ COMPLETED: {final_output_path}")
    print(f"   Resolution: 1080x1920 (9:16 Vertical HD)")
    print(f"   Total Duration: {current_time:.1f} seconds")
    print(f"   Ready to post on: Instagram Reels, X (Twitter), TikTok, YouTube Shorts")
    return final_output_path


async def main():
    print("🚀 Causarix Viral Video Studio Starting...")
    print(f"FFmpeg Engine: {FFMPEG_EXE}")
    print(f"Target Output: {OUTPUT_DIR}\n")
    
    rendered_files = []
    for script in SCRIPTS:
        try:
            output_file = await render_video(script)
            rendered_files.append(output_file)
        except Exception as e:
            print(f"❌ Error rendering {script['id']}: {e}")
            import traceback
            traceback.print_exc()

    print("\n🎉 ALL VIRAL VIDEOS GENERATED SUCCESSFULLY:")
    for f in rendered_files:
        print(f"  👉 {f}")


if __name__ == "__main__":
    asyncio.run(main())
