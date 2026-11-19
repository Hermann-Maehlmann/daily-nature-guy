# Zweisprachige Fassungen (Hermann 19.11.2026: TikTok DEUTSCH, YouTube Shorts ENGLISCH).
#   python3 autopilot/v2/sprache.py out/<slug>.json   ->  out/<slug>-en.json + out/<slug>-de.json
# Im Drehbuch: say = Englisch, say_de = Deutsch (optional sprich/sprich_de = Aussprache, wenn sie vom Untertitel abweicht),
# titel/titel_de, hook/hook_de, thumbnail/thumbnail_de. Die Szenendatei ist für beide gleich und schreibt Bildtexte als L("EN", "DE").
import json, sys, copy
src = sys.argv[1]; s = json.load(open(src)); base = src[:-5]
DE = {"lang": "de", "stimme": "autopilot/v2/stimmen/de-moderator.wav", "exaggeration": 0.9, "cfg": 0.5, "tempo": 1.1}
for lang in ("en", "de"):
    o = copy.deepcopy(s)
    for k in list(o):
        if k.endswith("_de"): o.pop(k)
    if lang == "de":
        for k in ("titel", "hook", "thumbnail"):
            if s.get(k + "_de"): o[k] = s[k + "_de"]
        o.update(DE)  # deutsche Stimme fest; abweichende Werte als <feld>_de ins Drehbuch
        o.update({k[:-3]: v for k, v in s.items() if k.endswith("_de") and k[:-3] not in ("titel", "hook", "thumbnail")})
    for b, ob in zip(s["beats"], o["beats"]):
        for k in list(ob):
            if k.endswith("_de") or k == "wav": ob.pop(k)
        if lang == "de":
            missing = [k for k in ("say_de",) if not b.get(k)]
            if missing: sys.exit(f"Beat ohne say_de: {b['say']}")
            ob["say"] = b["say_de"]; ob.pop("sprich", None)
            if b.get("sprich_de"): ob["sprich"] = b["sprich_de"]
    json.dump(o, open(f"{base}-{lang}.json", "w"), indent=1, ensure_ascii=False); print(f"{base}-{lang}.json")
