#!/usr/bin/env python3
"""Erste-Sekunde-Check (Hermann 23.11.2026: "Wir müssen viral gehen").

Hintergrund: Der YouTube-Short "Cut A Worm In Half? Not Two Worms" hatte eine starke
Bindung (Ø 75 %), aber 28 % wischten sofort weg (nur 71,7 % "angesehen") und er blieb
bei ~2.000 Aufrufen hängen. Ziel: unter 20 % Wegwischen. Entschieden wird das im
allerersten Bild und in der ersten Sekunde.

Aufruf:
  python3 autopilot/v2/erste_sekunde_check.py out/<slug>.json
      -> prüft das Drehbuch (vor Stimme und Rendern, zusammen mit opener_check.py)
  python3 autopilot/v2/erste_sekunde_check.py out/<slug>-de-cb.json out/<slug>-de.mp4
      -> prüft zusätzlich das fertige Video (NACH cover.sh), schreibt das Kontaktblatt
         out/<slug>-de-sek1.jpg zum Ansehen und speichert die Messwerte im Drehbuch
         unter "erste_sekunde" (für die Statistik).

Exit-Code 0 = bestanden, 1 = Fehler (Einstieg/Bild überarbeiten).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

FRAGE = {"de": ("warum",), "en": ("why",)}
SFX_OK = {"boom", "whoosh", "squish"}
MAX_WOERTER_FRAGE = 11      # Warum-Frage muss nach ~2,5 s fertig gesprochen sein
MAX_HOOK_ZEICHEN = 14       # pro Zeile, auf einen Blick lesbar
MAX_BEAT0_MIN = 3.2         # Beat 0 nicht künstlich in die Länge ziehen
# Seit 25.11.2026 (Hamster-Gitter 49,5 % weggewischt, YT-Ø-Sehdauer 15 s -> 5-9 s): Die Geschichte
# muss ab ~3 s laufen. Rudi spätestens in Beat 1, Rate-Frage nicht vor Beat 3.
RUDI_SPAETESTENS = 1
QUIZ_FRUEHESTENS = 3
QUIZ = re.compile(r"\bA,? B,? (oder|or) C\b", re.I)

# Video-Grenzwerte, geeicht am 23.11.2026 an 9 alten Videos: 3D-Videos mit
# stehendem Tier im 1. Bild hatten 0,44-1,09 (z. B. Hund-Schwanz 0,52, Kaninchenbad 1,09), Teich-Eis mit
# Bewegung 1,42. Alle hatten einen Cover-Sprung von 43-69 (Cover war ein anderes, gezoomtes Bild).
W, H, FPS = 135, 240, 30
MIN_HELL = 40               # mittlere Helligkeit (0-255) im ersten echten Bild
MIN_KONTRAST = 28           # Standardabweichung: kein leeres/einfarbiges Bild
MIN_BEWEGUNG = 1.2          # Ø Pixeländerung pro Bild in der ersten Sekunde
MAX_STILL = 12              # höchstens so viele Bilder (0,4 s) am Stück ohne Bewegung
STILL = 0.25                # darunter gilt ein Bildwechsel als "steht still"
MAX_TON_START = 0.35        # s bis Stimme/Sound hörbar ist
TON_DB = -32                # dBFS-Schwelle für "hörbar"


def woerter(s):
    return [w for w in re.sub(r"[*…\.,!?:;\"“”„]", " ", s or "").split() if w]


def drehbuch_pruefen(d):
    fehler, hinweise = [], []
    beats = d.get("beats") or []
    if not beats:
        return ["Drehbuch hat keine Beats."], hinweise
    b0 = beats[0]
    sprachen = []
    if d.get("lang") in ("de", "en"):
        sprachen = [d["lang"]]
    else:
        sprachen = [l for l in ("en", "de") if b0.get("say" if l == "en" else "say_de")]
    for l in sprachen:
        say = b0.get("say_de") if (l == "de" and b0.get("say_de")) else b0.get("say", "")
        w = woerter(say)
        if not w or w[0].lower() not in FRAGE[l]:
            fehler.append(f"[{l}] Beat 0 muss mit „{FRAGE[l][0].capitalize()} …?“ beginnen: {say!r}")
        if "?" not in (say or ""):
            fehler.append(f"[{l}] Beat 0 enthält keine Frage (kein „?“).")
        frage = woerter((say or "").split("?")[0])
        if len(frage) > MAX_WOERTER_FRAGE:
            fehler.append(f"[{l}] Die Warum-Frage hat {len(frage)} Wörter (max. {MAX_WOERTER_FRAGE}). Sie muss nach ~2,5 s stehen, kürzen.")
        hk = d.get("hook_de") if (l == "de" and "hook_de" in d) else d.get("hook")
        if not hk:
            fehler.append(f"[{l}] Feld „hook{'_de' if l == 'de' else ''}“ fehlt: die Frage muss ab Bild 1 als Text oben stehen.")
        else:
            zeilen = hk.split("\n")
            if len(zeilen) > 2 or any(len(z) > MAX_HOOK_ZEICHEN for z in zeilen):
                fehler.append(f"[{l}] Hook-Text {hk!r} zu lang: max. 2 Zeilen à {MAX_HOOK_ZEICHEN} Zeichen.")
    for l in sprachen:
        key = "say_de" if l == "de" else "say"
        texte = [(b.get(key) or b.get("say") or "") for b in beats]
        rudi = next((i for i, t in enumerate(texte) if "rudi" in t.lower()), None)
        if rudi is None or rudi > RUDI_SPAETESTENS:
            fehler.append(f"[{l}] Rudi kommt erst in Beat {rudi} vor (spätestens Beat {RUDI_SPAETESTENS}). Die Geschichte muss ab ~3 s laufen: "
                          "Opener-Stil verpackt Rudis erste Handlung, kein eigener Satz ohne Handlung.")
        quiz = next((i for i, t in enumerate(texte) if QUIZ.search(t)), None)
        if quiz is not None and quiz < QUIZ_FRUEHESTENS:
            fehler.append(f"[{l}] Rate-Frage schon in Beat {quiz} (frühestens Beat {QUIZ_FRUEHESTENS}, nach Rudis erstem Fehlversuch).")
    if (b0.get("sfx") or "") not in SFX_OK:
        fehler.append(f"Beat 0 braucht einen Knall-Sound ab Bild 1 (sfx {sorted(SFX_OK)}), ist: {b0.get('sfx')!r}.")
    if (b0.get("min") or 0) > MAX_BEAT0_MIN:
        fehler.append(f"Beat 0 hat min {b0['min']} s (max. {MAX_BEAT0_MIN}). Kein langsames Intro.")
    eb = d.get("erstes_bild") or ""
    if len(eb.split()) < 6:
        fehler.append("Feld „erstes_bild“ fehlt/zu kurz: in einem Satz beschreiben, was in Bild 1 schon passiert "
                      "(Action läuft bereits, Tier groß, Gag/Stempel sichtbar).")
    elif re.search(r"\b(leer|fade|einblend|langsam|totale|establishing|schwarz)\w*", eb.lower()):
        fehler.append(f"„erstes_bild“ klingt nach langsamem Intro: {eb!r}")
    return fehler, hinweise


def frames(mp4, sek=1.6):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", mp4, "-t", str(sek), "-vf", f"fps={FPS},scale={W}:{H}",
                          "-pix_fmt", "gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)


def ton_start(mp4):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", mp4, "-t", "2", "-ac", "1", "-ar", "16000",
                          "-f", "s16le", "-"], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    win = 800  # 50 ms
    for i in range(0, len(a) - win, win // 2):
        rms = np.sqrt(np.mean(a[i:i + win] ** 2)) + 1e-9
        if 20 * np.log10(rms) > TON_DB:
            return i / 16000
    return None


def video_pruefen(mp4, kontakt):
    f = frames(mp4)
    diffs = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2))
    # Cover von cover.sh erkennen: 3 gleiche Bilder (0,1 s), dann Wechsel
    start = 3 if len(diffs) > 4 and diffs[:2].max() < .5 and diffs[2] > 2 else 0
    erst = f[start]
    sek = diffs[start:start + FPS]
    still, lauf = 0, 0
    for x in sek:
        lauf = lauf + 1 if x < STILL else 0
        still = max(still, lauf)
    ton = ton_start(mp4)
    m = {
        "cover": bool(start),
        # nur obere 40 % (über Sticker/Verlauf des Covers): misst, ob das Bild nach dem Cover springt
        "cover_sprung": round(float(np.abs(f[3, :int(H * .4)] - f[2, :int(H * .4)]).mean()), 1) if start else None,
        "hell": round(float(erst.mean()), 1),
        "kontrast": round(float(erst.std()), 1),
        "bewegung": round(float(sek.mean()), 2),
        "still_bilder": int(still),
        "ton_start_s": None if ton is None else round(max(0.0, ton - start / FPS), 2),
    }
    fehler = []
    if m["hell"] < MIN_HELL:
        fehler.append(f"Erstes Bild zu dunkel (Helligkeit {m['hell']}, min. {MIN_HELL}).")
    if m["kontrast"] < MIN_KONTRAST:
        fehler.append(f"Erstes Bild zu flau/leer (Kontrast {m['kontrast']}, min. {MIN_KONTRAST}).")
    if m["bewegung"] < MIN_BEWEGUNG:
        fehler.append(f"Zu wenig Bewegung in Sekunde 1 (Ø {m['bewegung']}, min. {MIN_BEWEGUNG}): Kamera/Figuren müssen ab Bild 1 laufen.")
    if m["still_bilder"] > MAX_STILL:
        fehler.append(f"Bild steht {m['still_bilder']} Bilder am Stück still (max. {MAX_STILL}).")
    if m["ton_start_s"] is None or m["ton_start_s"] > MAX_TON_START:
        fehler.append(f"Ton setzt zu spät ein ({m['ton_start_s']} s, max. {MAX_TON_START} s): Stimme/Knall ab Bild 1.")
    # Kontaktblatt: Cover, 0,1 / 0,33 / 0,66 / 1,0 s nach Videostart, in Farbe
    t0 = start / FPS
    zeiten = ([0.0] if start else []) + [t0 + x for x in (0.0, 0.33, 0.66, 1.0)]
    sel = "+".join(f"eq(n\\,{round(t * FPS)})" for t in zeiten)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp4, "-vf",
                    f"select='{sel}',scale=360:-1,tile={len(zeiten)}x1", "-frames:v", "1", "-vsync", "0", str(kontakt)], check=True)
    return m, fehler


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    pfad = Path(sys.argv[1])
    d = json.loads(pfad.read_text())
    fehler, hinweise = drehbuch_pruefen(d)
    if len(sys.argv) > 2:
        mp4 = Path(sys.argv[2])
        kontakt = mp4.with_name(mp4.stem + "-sek1.jpg")
        m, vf = video_pruefen(str(mp4), kontakt)
        fehler += vf
        print("Messung Sekunde 1:", json.dumps(m, ensure_ascii=False))
        print(f"Kontaktblatt: {kontakt}  (ANSEHEN: Würde ich bei diesem 1. Bild stoppen?)")
        if not m["cover"]:
            hinweise.append("Kein Cover-Bild erkannt: cover.sh vergessen? (Check nach cover.sh laufen lassen.)")
        elif m["cover_sprung"] and m["cover_sprung"] > 12:
            fehler.append(f"Bild springt nach dem Cover (Sprung {m['cover_sprung']}, max. 12): Thumbnail neu mit thumb.js bauen (nimmt Bild 0,15 s), `thumb_at` aus dem Drehbuch löschen.")
        d["erste_sekunde"] = {**m, "bestanden": not fehler}
        pfad.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n")
    for h in hinweise:
        print("  Hinweis:", h)
    if fehler:
        print("ERSTE-SEKUNDE-CHECK FEHLGESCHLAGEN:")
        for f in fehler:
            print("  -", f)
        return 1
    print("Erste-Sekunde-Check ok.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
