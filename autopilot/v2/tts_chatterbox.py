# Natürliche Stimme mit Chatterbox (frei, läuft auf CPU): python tts_chatterbox.py spec.json ausgabeordner [referenz.wav]
# Von Hermann abgenommen (10.11.2026): Standard-Männerstimme, exaggeration .5, cfg .5 (ruhig, natürlich).
import json, sys, re, os, torch, torchaudio
spec = json.load(open(sys.argv[1])); outdir = sys.argv[2]; ref = sys.argv[3] if len(sys.argv) > 3 else None
slug = os.path.basename(sys.argv[1]).rsplit(".", 1)[0]
torch.set_num_threads(os.cpu_count() or 4)
LANG = spec.get("lang", "en")  # seit 18.11.2026 Deutsch ("de") -> mehrsprachiges Chatterbox-Modell
if LANG == "en":
    from chatterbox.tts import ChatterboxTTS
    m = ChatterboxTTS.from_pretrained(device="cpu"); kw = {}
else:
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    m = ChatterboxMultilingualTTS.from_pretrained(device="cpu"); kw = {"language_id": LANG}
# Hörprobe (seit 18.11.2026): Das mehrsprachige Modell hängt manchmal Kauderwelsch an oder wiederholt Sätze.
# Whisper hört jeden Satz nach; passt er nicht (Ähnlichkeit < 0.8 oder deutlich zu viele Wörter), wird neu eingesprochen (bis 6 Versuche, bester gewinnt).
asr = None
if LANG != "en":
    import difflib, librosa
    from transformers import pipeline
    asr = pipeline("automatic-speech-recognition", model="openai/whisper-small", device="cpu")
ZAHL = {"null": "0", "ein": "1", "eins": "1", "einen": "1", "eine": "1", "zwei": "2", "drei": "3", "vier": "4", "fünf": "5", "sechs": "6", "sieben": "7", "acht": "8", "neun": "9", "zehn": "10", "zwölf": "12", "hundert": "100"}
def norm(t): return [ZAHL.get(w, w) for w in re.sub(r"[^a-zäöüß0-9 ]", " ", t.lower().replace("-", " ")).split()]  # Whisper schreibt Zahlen als Ziffern
def score(text, w):
    a = librosa.resample(w.squeeze(0).numpy(), orig_sr=m.sr, target_sr=16000)
    heard = asr(a, generate_kwargs={"language": LANG, "task": "transcribe"})["text"]
    want, got = norm(text), norm(heard)
    sim = difflib.SequenceMatcher(None, want, got).ratio()
    if len(got) > len(want) + 2: sim -= .3  # angehängtes Kauderwelsch / Wiederholung
    return sim, heard
for i, b in enumerate(spec["beats"]):
    if b.get("wav") and os.path.exists(os.path.join(outdir, b["wav"])): continue  # schon eingesprochen (beim Nachbessern nur geänderte Sätze neu)
    text = re.sub(r"\*", "", b["say"])
    best = None
    for tries in range(6 if asr else 1):
        wav = m.generate(text, audio_prompt_path=ref, exaggeration=float(spec.get("exaggeration", .5)), cfg_weight=float(spec.get("cfg", .5)), temperature=.8, **kw)
        if not asr: best = (1, wav, ""); break
        sim, heard = score(text, wav); print(f"  Hörprobe {i:02d}/{tries + 1}: {sim:.2f} | {heard}", flush=True)
        if not best or sim > best[0]: best = (sim, wav, heard)
        if sim >= .8: break
    if best[0] < .8: print(f"WARNUNG Satz {i:02d} klingt evtl. falsch ({best[0]:.2f}): {best[2]}", flush=True)
    fn = f"vo_{slug}_{i:02d}.wav"; torchaudio.save(os.path.join(outdir, fn), best[1], m.sr); b["wav"] = fn; print(fn, text, flush=True)
    # Stille am Satzende abschneiden + Tempo ("tempo" im Drehbuch, Deutsch 1.12: deutsche Sätze sind länger), Tonhöhe bleibt
    tmp = os.path.join(outdir, "_t.wav"); fx = "areverse,silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.08,areverse"
    if float(spec.get("tempo", 1)) != 1: fx += f",atempo={float(spec['tempo'])}"
    os.system(f'ffmpeg -v error -y -i "{os.path.join(outdir, fn)}" -af "{fx}" "{tmp}" && mv "{tmp}" "{os.path.join(outdir, fn)}"')
spec["pitch"] = 1
json.dump(spec, open(sys.argv[1][:-5] + "-cb.json", "w"), indent=1)
