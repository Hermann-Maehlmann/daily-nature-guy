# Night batch: per script first the voice (gen_batch.py), then its scene images (mflux). Run from ~/Movies/tiktok-voice-clone.
import json, os, subprocess, shutil, sys
B = os.getcwd(); jobs = json.load(open("imggen/philo/philo_batch.json"))
STYLE = "black and white pen and ink stipple engraving, fine dotted texture, vertical hatching, vintage etching illustration, high detail, monochrome, full bleed image, no border, no frame, no text, no signature"
for job in jobs:
    s = job["slug"]
    if not os.path.exists(f"queue/{s}/DONE"):
        one = f"queue/_one_{s}.json"; json.dump([{k: job[k] for k in ("slug", "hook", "body")}], open(one, "w"))
        subprocess.run([".venv/bin/python", "queue/gen_batch.py", one]); os.remove(one)
    out = f"imggen/philo/{s}"; os.makedirs(out, exist_ok=True)
    for name, p in job["prompts"]:
        f = f"{out}/{name}.png"
        if os.path.exists(f): continue
        if shutil.disk_usage(B).free < 12e9: print("LOW DISK, stop", flush=True); sys.exit(1)
        subprocess.run(["imggen/.venv/bin/mflux-generate", "--model", "dhairyashil/FLUX.1-schnell-mflux-4bit", "--base-model", "schnell",
            "--steps", "4", "--seed", "23", "--width", "768", "--height", "1344", "--prompt", p + ", " + STYLE, "--output", f])
        print(s, name, "OK" if os.path.exists(f) else "FAIL", flush=True)
    open(f"{out}/DONE", "w").write("1"); print("SLUG DONE", s, flush=True)
print("NIGHT DONE", flush=True)
