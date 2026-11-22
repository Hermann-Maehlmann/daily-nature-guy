#!/usr/bin/env python3
"""YouTube-Fassung: Serien-Badge + Abo-Schild ins Video (Hermann 22.11.2026).
  python3 autopilot/abo_schild.py out/<slug>-en.mp4        (überschreibt die Datei)
Badge "RUDI GETS IT WRONG" oben links ab 3 s, in den letzten 1,6 s ein Abo-Schild oben mittig.
Ohne Stimme, damit der Loop heil bleibt. Vor cover.sh ausführen. Nur für YouTube (englisch), nie für TikTok."""
import os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

FONT = os.path.join(os.path.dirname(__file__), "v2", "fonts", "montserrat-900.ttf")
SERIE = os.environ.get("SERIE", "RUDI GETS IT WRONG")
ABO = os.environ.get("ABO", "Rudi messes up again tomorrow")
END = 1.6  # Sekunden Abo-Schild am Ende

def badge(path):
    f = ImageFont.truetype(FONT, 34); w = int(f.getlength(SERIE)) + 92; h = 64
    im = Image.new("RGBA", (w + 8, h + 8), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((4, 6, w + 4, h + 6), 32, fill=(0, 0, 0, 70))
    d.rounded_rectangle((0, 0, w, h), 32, fill=(255, 210, 40, 255))
    d.ellipse((18, 20, 42, 44), fill=(225, 30, 40, 255))  # Rudis gelbe Jacke + roter Punkt
    d.text((56, h / 2 + 1), SERIE, font=f, fill=(25, 25, 40, 255), anchor="lm")
    im.save(path)

def endcard(path):
    W = 860; f1 = ImageFont.truetype(FONT, 64); f2 = ImageFont.truetype(FONT, 40)
    im = Image.new("RGBA", (W, 290), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, W, 290), 40, fill=(255, 255, 255, 245))
    bw = int(f1.getlength("SUBSCRIBE")) + 150; x0 = (W - bw) // 2
    d.rounded_rectangle((x0, 34, x0 + bw, 144), 55, fill=(230, 33, 23, 255))
    d.polygon([(x0 + 48, 66), (x0 + 48, 112), (x0 + 88, 89)], fill="white")
    d.text((x0 + 110, 90), "SUBSCRIBE", font=f1, fill="white", anchor="lm")
    d.text((W / 2, 218), ABO, font=f2, fill=(25, 25, 40, 255), anchor="mm")
    im.save(path)

def main(mp4):
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]))
    t = tempfile.mkdtemp(); b, e = f"{t}/b.png", f"{t}/e.png"; badge(b); endcard(e)
    t1 = dur - END
    fc = (f"[1:v]format=rgba,fade=in:st=3:d=0.3:alpha=1[b];"
          f"[2:v]format=rgba,fade=in:st={t1:.2f}:d=0.2:alpha=1[e];"
          f"[0:v][b]overlay=40:165:enable='between(t,3,{t1:.2f})'[v1];"
          f"[v1][e]overlay=(W-w)/2-40:250:enable='gte(t,{t1:.2f})',format=yuv420p[v]")
    vk = max(1500, min(8000, int(10.4e6 * 8 / (dur + .5) / 1000) - 170))
    ins = ["-i", mp4, "-loop", "1", "-framerate", "30", "-t", f"{dur}", "-i", b, "-loop", "1", "-framerate", "30", "-t", f"{dur}", "-i", e]
    enc = ["-c:v", "libx264", "-preset", "slow", "-b:v", f"{vk}k", "-maxrate", f"{vk*16//10}k", "-bufsize", f"{vk*2}k", "-r", "30", "-passlogfile", f"{t}/p"]
    out = f"{t}/out.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", fc, "-map", "[v]", *enc, "-pass", "1", "-an", "-f", "null", "-"], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", fc, "-map", "[v]", "-map", "0:a", *enc, "-pass", "2", "-c:a", "copy", "-movflags", "+faststart", out], check=True)
    os.replace(out, mp4); print(f"OK Abo-Schild: {mp4} ({os.path.getsize(mp4)/1e6:.1f} MB)")

if __name__ == "__main__":
    main(sys.argv[1])
