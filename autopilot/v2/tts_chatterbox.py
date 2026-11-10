# Natürliche Stimme mit Chatterbox (frei, läuft auf CPU): python tts_chatterbox.py spec.json ausgabeordner [referenz.wav]
# Von Hermann abgenommen (10.11.2026): Standard-Männerstimme, exaggeration .5, cfg .5 (ruhig, natürlich).
import json, sys, re, os, torch, torchaudio
from chatterbox.tts import ChatterboxTTS
spec = json.load(open(sys.argv[1])); outdir = sys.argv[2]; ref = sys.argv[3] if len(sys.argv) > 3 else None
slug = os.path.basename(sys.argv[1]).rsplit(".", 1)[0]
torch.set_num_threads(os.cpu_count() or 4)
m = ChatterboxTTS.from_pretrained(device="cpu")
for i, b in enumerate(spec["beats"]):
    if b.get("wav") and os.path.exists(os.path.join(outdir, b["wav"])): continue  # schon eingesprochen (beim Nachbessern nur geänderte Sätze neu)
    text = re.sub(r"\*", "", b["say"])
    wav = m.generate(text, audio_prompt_path=ref, exaggeration=float(spec.get("exaggeration", .5)), cfg_weight=float(spec.get("cfg", .5)), temperature=.8)
    fn = f"vo_{slug}_{i:02d}.wav"; torchaudio.save(os.path.join(outdir, fn), wav, m.sr); b["wav"] = fn; print(fn, text, flush=True)
spec["pitch"] = 1
json.dump(spec, open(sys.argv[1][:-5] + "-cb.json", "w"), indent=1)
