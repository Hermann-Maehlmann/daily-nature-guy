#!/usr/bin/env python3
"""Auswertung der Metricool-Zahlen fuer TikTok und YouTube Shorts.

Aufruf (Anleitung in STATISTIK.md):
  python3 autopilot/stats.py --tiktok out/tk.json --youtube out/yt.json [--jetzt 2026-11-16T19:00:00+01:00] [--schreiben]

out/tk.json = Antwort von getAnalyticsDataByMetrics mit den Metriken
  TKPO02, TKPO05, TKPO06, TKPO07, TKPO08, TKPO09, TKPO10  (genau diese Reihenfolge)
out/yt.json = Antwort mit
  YTVP02, YTVP17, YTVP06, YTVP08, YTVP09, YTVP11, YTVP12  (genau diese Reihenfolge)

Ordnet jede Zeile einem Eintrag aus state/videos.json zu (TikTok ueber die
Sendezeit, YouTube ueber den Titel), gruppiert nach Kategorie, Format und
Uhrzeit und druckt eine Markdown-Auswertung. Mit --schreiben wird das
Ergebnis in state/statistik.json unter "auswertung" gespeichert, damit jeder
Autopilot-Lauf es bei der Themenwahl lesen kann.
"""
import argparse
import json
import statistics
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REIFE_TK = timedelta(hours=24)   # juengere TikToks sind noch nicht fertig ausgespielt
REIFE_YT = timedelta(hours=72)   # Metricool-YouTube-Zahlen kommen 2-3 Tage verspaetet


def ts(s):
    """'20261114150627' (UTC, so liefert Metricool TikTok/YouTube) -> datetime."""
    return datetime.strptime(s[:14], "%Y%m%d%H%M%S").replace(tzinfo=timezone.utc)


def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return 0.0


def kategorie(v, karte):
    return v.get("kategorie") or karte.get(v["titel"], {}).get("kategorie", "unbekannt")


def fmt(v, karte):
    if v.get("format"):
        return v["format"]
    if v["titel"] in karte:
        return karte[v["titel"]].get("format", "unbekannt")
    return "comedy" if "comedy" in v.get("thema", "").lower() else "unbekannt"


def slot(dt):
    h = (dt + timedelta(hours=1)).hour  # grob Berliner Zeit (Winterzeit)
    return "morgens (<12)" if h < 12 else "mittags (12-17)" if h < 17 else "abends (17-20)" if h < 20 else "spaet (>=20)"


def zuordnen_tiktok(rows, videos):
    geplant = []
    for v in videos:
        if v.get("status") != "oeffentlich" or not v.get("geplant_fuer"):
            continue
        geplant.append((datetime.fromisoformat(v["geplant_fuer"]).astimezone(timezone.utc), v))
    out = []
    frei = list(geplant)
    for r in sorted(rows, key=lambda r: r[0]):
        t = ts(r[0])
        # naechste geplante Sendezeit (Metricool postet 0-60 Min spaeter), jedes Video nur einmal
        kandidaten = [(abs((t - g).total_seconds()), i) for i, (g, v) in enumerate(frei)
                      if g - timedelta(minutes=15) <= t <= g + timedelta(minutes=90)]
        v = None
        if kandidaten:
            v = frei.pop(min(kandidaten)[1])[1]
        out.append({
            "zeit": t, "titel": v["titel"] if v else r[1][:50], "video": v,
            "dauer": num(r[2]), "views": num(r[3]), "likes": num(r[4]), "comments": num(r[5]), "shares": num(r[6]),
        })
    return out


def zuordnen_youtube(rows, videos, karte):
    out = []
    for r in rows:
        titel = r[1].replace("#shorts", "").strip()
        v = next((v for v in videos if titel.startswith(v["titel"])), None)
        if v is None:  # Video nicht vom Autopiloten (z. B. Enten-Brot von Hand gepostet)
            v = next(({"titel": k} for k in karte if titel.startswith(k)), None)
        out.append({
            "zeit": ts(r[0]), "titel": v["titel"] if v else titel, "video": v,
            "views": num(r[2]), "avd": num(r[3]), "likes": num(r[4]), "comments": num(r[5]), "shares": num(r[6]),
        })
    return out


def gruppen(eintraege, schluessel):
    g = {}
    for e in eintraege:
        g.setdefault(schluessel(e), []).append(e["views"])
    return sorted(((k, len(v), statistics.median(v)) for k, v in g.items()), key=lambda x: -x[2])


def tabelle(titel, eintraege, extra):
    print(f"\n### {titel}\n")
    if not eintraege:
        print("(keine fertig ausgespielten Videos)")
        return None
    med = statistics.median(e["views"] for e in eintraege)
    print(f"Videos: {len(eintraege)} · Median-Aufrufe: {med:.0f}\n")
    print("| Video | Kat. | Aufrufe | x Median | Likes | Komm. | Shares |" + (" Ø Sek. |" if extra else ""))
    print("|---|---|---|---|---|---|---|" + ("---|" if extra else ""))
    for e in sorted(eintraege, key=lambda e: -e["views"]):
        z = f"| {e['titel'][:40]} | {e['kat']} | {e['views']:.0f} | {e['views'] / med if med else 0:.1f} | {e['likes']:.0f} | {e['comments']:.0f} | {e['shares']:.0f} |"
        if extra:
            z += f" {e['avd']:.0f} |"
        print(z)
    for name, k in (("Kategorie", lambda e: e["kat"]), ("Format", lambda e: e["fmt"]), ("Sendezeit", lambda e: slot(e["zeit"]))):
        print(f"\nNach {name}: " + " · ".join(f"{a} {m:.0f} ({n} Videos)" for a, n, m in gruppen(eintraege, k)))
    return med


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tiktok", required=True)
    ap.add_argument("--youtube")
    ap.add_argument("--jetzt")
    ap.add_argument("--schreiben", action="store_true")
    a = ap.parse_args()

    jetzt = datetime.fromisoformat(a.jetzt).astimezone(timezone.utc) if a.jetzt else datetime.now(timezone.utc)
    videos = json.loads((ROOT / "state/videos.json").read_text())
    stat_pfad = ROOT / "state/statistik.json"
    stat = json.loads(stat_pfad.read_text()) if stat_pfad.exists() else {}
    karte = stat.get("kategorien_alt", {})

    tk = zuordnen_tiktok(json.loads(Path(a.tiktok).read_text())["rows"], videos)
    yt = zuordnen_youtube(json.loads(Path(a.youtube).read_text())["rows"], videos, karte) if a.youtube else []
    for e in tk + yt:
        e["kat"] = kategorie(e["video"], karte) if e["video"] else "unbekannt"
        e["fmt"] = fmt(e["video"], karte) if e["video"] else "unbekannt"

    # Alte Test-Posts im 30-Minuten-Takt (10.11.) und Videos ohne Zuordnung verfaelschen den Median.
    tk_fertig = [e for e in tk if e["video"] and jetzt - e["zeit"] >= REIFE_TK and e["views"] >= 50]
    yt_fertig = [e for e in yt if e["video"] and jetzt - e["zeit"] >= REIFE_YT]
    tk_jung = [e for e in tk if e["video"] and jetzt - e["zeit"] < REIFE_TK]

    print(f"# Auswertung bis {jetzt:%d.%m.%Y %H:%M} UTC")
    tk_med = tabelle("TikTok", tk_fertig, extra=False)
    yt_med = tabelle("YouTube Shorts", yt_fertig, extra=True)
    if tk_jung:
        print("\nNoch zu jung fuer TikTok-Wertung: " + ", ".join(f"{e['titel']} ({e['views']:.0f})" for e in tk_jung))

    vergleich = []
    for e in yt_fertig:
        t = next((x for x in tk_fertig if x["titel"] == e["titel"]), None)
        if t:
            vergleich.append((e["titel"], t["views"], e["views"], e["avd"], e["video"].get("dauer_s")))
    if vergleich:
        print("\n### Dasselbe Video auf beiden Plattformen\n")
        print("| Video | TikTok | YouTube | YT Ø Sek. |")
        print("|---|---|---|---|")
        for t, a_, b, avd, _ in vergleich:
            print(f"| {t[:40]} | {a_:.0f} | {b:.0f} | {avd:.0f} |")

    if a.schreiben:
        stat["auswertung"] = {
            "stand": jetzt.isoformat(timespec="minutes"),
            "tiktok_median": tk_med,
            "youtube_median": yt_med,
            "tiktok_kategorien": [{"kategorie": k, "videos": n, "median": m} for k, n, m in gruppen(tk_fertig, lambda e: e["kat"])],
            "tiktok_formate": [{"format": k, "videos": n, "median": m} for k, n, m in gruppen(tk_fertig, lambda e: e["fmt"])],
            "youtube_kategorien": [{"kategorie": k, "videos": n, "median": m} for k, n, m in gruppen(yt_fertig, lambda e: e["kat"])],
            "tiktok_top": [{"titel": e["titel"], "views": e["views"], "kategorie": e["kat"]} for e in sorted(tk_fertig, key=lambda e: -e["views"])[:5]],
            "tiktok_flop": [{"titel": e["titel"], "views": e["views"], "kategorie": e["kat"]} for e in sorted(tk_fertig, key=lambda e: e["views"])[:3]],
        }
        stat_pfad.write_text(json.dumps(stat, ensure_ascii=False, indent=1) + "\n")
        print(f"\n(state/statistik.json aktualisiert)")


if __name__ == "__main__":
    main()
