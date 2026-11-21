#!/usr/bin/env python3
"""Opener-Check (Hermann 21.11.2026: "nicht immer die gleiche Beleidigung am Anfang").

Vergleicht den Einstieg (Beat 0 + Beat 1) eines neuen Drehbuchs mit den letzten
10 Drehbuechern in state/drehbuecher/ und meldet Wiederholungen.

  python3 autopilot/v2/opener_check.py out/<slug>.json      # pruefen
  python3 autopilot/v2/opener_check.py --liste               # letzte Opener anzeigen

Fehler (Exit 1), wenn:
  - "opener_stil" fehlt oder derselbe Stil in den letzten 3 Videos vorkam,
  - der Text nach der Warum-/Why-Frage (Beat 0) oder Beat 1 eine Wortfolge
    aus 3+ Woertern mit einem der letzten 10 Einstiege teilt,
  - ein Stichel-Wort aus den letzten 10 Einstiegen wieder vorkommt
    (z. B. "Pfeife", "potato").
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ARCHIV = os.path.join(ROOT, "state", "drehbuecher")
STOP = set("""der die das ein eine einen einem dem den des und oder aber ja nein
du dein deine deins deinen deinem ist sind es er sie wir ihr so nur noch auch
genau mal doch nicht kein keine zu im in am an auf mit von fuer für the a an and
or but yes no you your yours is are it he she we so just too not to in on at of
for with this that rudi rudis rudi's""".split())


def woerter(t):
    return re.findall(r"[a-zäöüß']+", (t or "").lower().replace("*", ""))


def nach_frage(t):
    # Alles nach dem ersten "?" = Roast/Reaktion nach der Hook-Frage
    return t.split("?", 1)[1].lstrip("* ") if t and "?" in t else ""


def opener(d):
    b = d.get("beats", [])
    b0 = b[0] if b else {}
    b1 = b[1] if len(b) > 1 else {}
    teile = [nach_frage(b0.get("say_de")), nach_frage(b0.get("say")),
             b1.get("say_de") or "", b1.get("say") or ""]
    return {
        "stil": d.get("opener_stil", "?"),
        "frage": (b0.get("say_de") or b0.get("say") or "").split("?")[0] + "?",
        "rest": " / ".join(x.strip() for x in teile if x and x.strip()),
        "woerter": [woerter(x) for x in teile],
        "roast": set(woerter(teile[0]) + woerter(teile[1])) - STOP,
    }


def ngrams(ws, n=3):
    return {tuple(ws[i:i + n]) for i in range(len(ws) - n + 1)
            if not all(w in STOP for w in ws[i:i + n])}


def letzte(n=10, ohne=None):
    fs = sorted(f for f in glob.glob(os.path.join(ARCHIV, "*.json")))
    if ohne:
        fs = [f for f in fs if os.path.abspath(f) != os.path.abspath(ohne)]
    return [(os.path.basename(f), opener(json.load(open(f)))) for f in fs[-n:]]


def main():
    args = sys.argv[1:]
    if not args or args[0] == "--liste":
        for name, o in letzte():
            print(f"{name}  [{o['stil']}]  {o['frage']}  ->  {o['rest']}")
        return 0
    pfad = args[0]
    neu = opener(json.load(open(pfad)))
    alt = letzte(10, ohne=pfad)
    fehler = []

    if neu["stil"] == "?":
        fehler.append('Feld "opener_stil" fehlt (siehe Stil-Liste in AUTOPILOT.md).')
    else:
        drei = [o["stil"] for _, o in alt[-3:]]
        if neu["stil"] in drei:
            fehler.append(f'opener_stil "{neu["stil"]}" kam in den letzten 3 Videos schon vor ({drei}).')

    neu_ng = set().union(*(ngrams(w) for w in neu["woerter"]))
    neu_w = set().union(*(set(w) for w in neu["woerter"])) - STOP
    for name, o in alt:
        gleich = neu_ng & set().union(*(ngrams(w) for w in o["woerter"]))
        if gleich:
            fehler.append(f"{name}: gleiche Wortfolge {sorted(' '.join(g) for g in gleich)[:3]}")
        # Stichel-Woerter (Text nach der Frage in Beat 0)
        doppelt = neu_w & o["roast"]
        if doppelt:
            fehler.append(f"{name}: Stichel-Wort wiederholt {sorted(doppelt)}")

    print(f"Neuer Opener [{neu['stil']}]: {neu['frage']} -> {neu['rest']}")
    if fehler:
        print("OPENER-CHECK FEHLGESCHLAGEN, Einstieg neu schreiben:")
        for f in fehler:
            print("  -", f)
        return 1
    print("Opener-Check ok: Einstieg ist frisch.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
