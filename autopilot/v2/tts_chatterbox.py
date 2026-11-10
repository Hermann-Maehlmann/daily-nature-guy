# Natürliche Stimme mit Chatterbox (frei, läuft auf CPU): python tts_chatterbox.py spec.json ausgabeordner [referenz.wav]
import json, sys, re, torch, torchaudio
from chatterbox.tts import ChatterboxTTS
spec = json.load(open(sys.argv[1])); outdir = sys.argv[2]; ref = sys.argv[3] if len(sys.argv) > 3 else None
torch.set_num_threads(4)
m = ChatterboxTTS.from_pretrained(device="cpu")
for i, b in enumerate(spec["beats"]):
    text = re.sub(r"\*", "", b["say"])
    wav = m.generate(text, audio_prompt_path=ref, exaggeration=float(spec.get("exaggeration", .65)), cfg_weight=float(spec.get("cfg", .45)), temperature=.8)
    fn = f"vo_{i:02d}.wav"; torchaudio.save(f"{outdir}/{fn}", wav, m.sr); b["wav"] = fn; print(fn, text, flush=True)
json.dump(spec, open(sys.argv[1].replace(".json", "-cb.json"), "w"), indent=1)
