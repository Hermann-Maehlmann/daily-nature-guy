# Statistik für den Autopiloten „Daily Nature Guy“

Seit 16.11.2026 (Hermann): Der Autopilot lernt aus den echten Zahlen. Zwei Teile:

- **A. Statistik-Check in jedem Lauf** (AUTOPILOT.md Schritt 2): Thema und Format nach dem wählen, was bisher am besten lief.
- **B. Wochenbericht jeden Montag**: kurzer deutscher Bericht für Hermann, aktualisiert `state/statistik.json`.

## Datenquellen (Metricool, Marke 7900279, Zeitzone Europe/Berlin)

`getAnalyticsDataByMetrics` mit `brandId` 7900279. Metricool liefert Zeiten in UTC.

| Was | Metriken (genau diese Reihenfolge, `autopilot/stats.py` erwartet sie so) |
|---|---|
| TikTok pro Video | `TKPO02, TKPO05, TKPO06, TKPO07, TKPO08, TKPO09, TKPO10` (Zeit, Caption, Dauer, Aufrufe, Likes, Kommentare, Shares) |
| YouTube pro Short | `YTVP02, YTVP17, YTVP06, YTVP08, YTVP09, YTVP11, YTVP12` (Zeit, Titel, Aufrufe, Ø Sehdauer in s, Likes, Kommentare, Shares) |
| TikTok-Follower | `TKEV07` (Stand), `TKEV08` (neu pro Tag) |
| YouTube-Abos und Quellen | `YTEV01`, `YTEV05`, `YTTS01, YTTS02` (Shorts-Feed vs. Suche vs. Kanal) |

Wichtig:
- **Verzögerung:** TikTok-Zahlen kommen etwa 1 Tag später an, YouTube-Zahlen 2 bis 3 Tage. Videos, die jünger sind, nie als Flop werten. `stats.py` wertet TikTok erst ab 24 h, YouTube ab 72 h.
- **Keine Zuschauerbindung über Metricool:** `TKPO13/14/15` (Watch-Time, komplett gesehen) bleiben `null`. Die Bindungskurve (wo Leute wegwischen) gibt es nur in TikTok Studio und YouTube Studio. YouTube liefert wenigstens die Ø Sehdauer (`YTVP08`); im Verhältnis zur Videolänge ist das unser bester Bindungswert.
- Videos vom 10.11. mit unter 50 Aufrufen waren Test-Posts im 30-Minuten-Takt und zählen nicht.

So holen (Daten als Datei speichern, z. B. mit `python3 -c` aus der Tool-Antwort):

```
TikTok:  from = heute − 14 Tage, to = jetzt  →  out/tk.json   ({"rows": [...]} wie von Metricool)
YouTube: from = heute − 21 Tage, to = jetzt  →  out/yt.json
python3 autopilot/stats.py --tiktok out/tk.json --youtube out/yt.json
```

`stats.py` ordnet die Zeilen den Einträgen in `state/videos.json` zu (TikTok über die Sendezeit, YouTube über den Titel), Videos vor dem 16.11. über `state/statistik.json` → `kategorien_alt`, und druckt Tabellen plus Mediane nach **Kategorie**, **Format** und **Sendezeit**. Mit `--schreiben` speichert es die Auswertung in `state/statistik.json` → `auswertung` (nur der Wochenbericht macht das).

Kategorien (in `state/videos.json` pro Video als `"kategorie"`): `haustier` (Hund, Katze, Kaninchen, Goldfisch, Meerschweinchen …), `garten` (Garten, Park, Balkon, Vogelhaus), `haus-kueche` (Wohnung, Küche, Keller: Motten, Fliegen, Mäuse, Spinnen), `exotisch` (alles, was der Zuschauer nie selbst trifft). Format (`"format"`): `comedy` (Comedy-Story mit Rudi), `mix` (Mix-Stil ohne Geschichte), `fakt` (alter reiner Fakten-Stil).

## A. Statistik-Check in jedem Lauf

Läuft am Anfang von AUTOPILOT.md Schritt 2, dauert 1 bis 2 Minuten. Scheitert Metricool, mit `state/statistik.json` weitermachen und das nicht als Fehler melden.

1. TikTok-Zahlen der letzten 14 Tage und YouTube der letzten 21 Tage holen, `stats.py` laufen lassen (ohne `--schreiben`).
2. `state/statistik.json` → `lernregeln` lesen. Diese Regeln gelten, bis der nächste Wochenbericht sie ändert.
3. **Kategorie wählen:** die Kategorie mit dem höchsten TikTok-Median. War sie schon bei den letzten 2 Videos dran, die zweitbeste. `exotisch` nur, wenn ihr Median über dem Gesamtmedian liegt (Stand 16.11.2026: 0 von 11 exotischen Videos kamen über die Testgruppe von ~750 Aufrufen hinaus → vorerst gar keine).
4. **Vom Gewinner lernen, nicht kopieren:** die 3 besten Videos der letzten 14 Tage ansehen (Zeile in `state/videos.json`). Den *Winkel* übernehmen, nie das Thema. Bisherige Gewinner hatten alle denselben Winkel: **„Etwas, das du selbst mit deinem Tier/Garten machst, ist falsch“** (Möhre fürs Kaninchen, Wurm durchschneiden, Wespe wegschlagen, Jungvogel retten, Hund sieht nur schwarz-weiß).
5. **Share-Test fürs Thema:** Würde jemand das Video einer bestimmten Person schicken („Schick das deiner Freundin mit dem Kaninchen“)? Wenn nicht, anderes Thema. Shares sind das stärkste Signal (Möhre: 14 Shares → 4.533 Aufrufe; fast alle anderen 0).
6. In die Zusammenfassung am Ende eine Zeile: `Statistik: <Kategorie> gewählt (Median <x> vs. gesamt <y>), Vorbild: <Gewinner>`.

## B. Wochenbericht (montags)

Eigene geplante Aufgabe (nicht im normalen Autopilot-Lauf). Ablauf:

1. `git pull`, Git-Name wie in AUTOPILOT.md.
2. Zahlen holen wie oben, dazu Follower (`TKEV07`, `TKEV08`) und YouTube-Abos/Quellen (`YTEV01`, `YTEV05`, `YTTS01`, `YTTS02`) für die letzten 7 Tage. Dann `python3 autopilot/stats.py --tiktok out/tk.json --youtube out/yt.json --schreiben`.
3. Auswerten, und zwar ehrlich: wenige Videos sind wenig Beweis. Ein Muster gilt erst, wenn es bei mindestens 3 Videos auftaucht; sonst „Hinweis“, keine Regel.
4. `state/statistik.json` → `lernregeln` neu schreiben: höchstens 5 kurze Regeln, jede mit Datum und Beleg (`{"regel": "...", "beleg": "Möhre 4533, Wurm 4633 vs. exotisch Median 762", "seit": "2026-11-16"}`). Regeln, die sich nicht bestätigt haben, streichen.
5. Bericht als `state/berichte/<JJJJ-MM-TT>.md` speichern, Commit „Wochenbericht <Datum>“, push auf `main`.
6. Ausgabe = der Bericht selbst (Hermann bekommt ihn als Push-Nachricht). **Deutsch, kurz, höchstens 250 Wörter**, genau diese Teile:

```
📊 Wochenbericht Daily Nature Guy, KW <nr>
TikTok: <Aufrufe gesamt> Aufrufe aus <n> Videos (Median <x>, Vorwoche <y>), Follower <stand> (+<neu>)
YouTube: <Aufrufe> Aufrufe aus <n> Shorts (Median <x>), Ø gesehen <s> s von <länge> s (<%>), Abos <stand> (+<neu>)
🏆 Top 3: <Titel – Aufrufe – warum vermutlich>
👎 Flop 3: <Titel – Aufrufe – warum vermutlich>
📺 YouTube vs. TikTok: <1–2 Sätze, was dort anders läuft>
💡 Gelernt: <2–3 Punkte>
➡️ Nächste Woche ändert der Autopilot: <1–2 konkrete Dinge, schon in lernregeln eingetragen>
🚀 Promote-Kandidat: <Video ≥ 3× Median ohne Werbung, oder „keiner“>
```

7. Liegt ein Video über dem 3-fachen Median, als Promote-Kandidat nennen (Hermann entscheidet selbst in der TikTok-App, Ziel „Follower“, 5 bis 10 €). Der Autopilot startet nie selbst Werbung.
8. Fehlen Zahlen (Connector kaputt), beginnt der Bericht mit „⚠️ Hermann, bitte kümmern:“.
9. Bindungskurve: Einmal im Monat Hermann bitten, für das beste und das schlechteste Video einen Screenshot der Bindungskurve aus TikTok Studio zu schicken, weil Metricool sie nicht liefert.

## C. YouTube Shorts (eigene Regeln seit 16.11.2026)

Stand 16.11.2026: YouTube-Zahlen gibt es erst für 3 Shorts (Enten 1.276, Goldfisch 1.277, Igel 74). Ø Sehdauer 6 bis 22 s bei 37 bis 44 s Länge, also sieht kaum jemand die Hälfte. 2.536 Aufrufe kamen aus dem Shorts-Feed, 69 über die YouTube-Suche. Was daraus folgt:

1. **Titel = Suchfrage.** Die Suche ist auf YouTube die zweite Quelle (auf TikTok spielt sie kaum eine Rolle) und bringt auch Monate später noch Aufrufe. Deshalb `youtubeData.title` als Frage oder Satz, den Leute wirklich eintippen, Schlüsselwort vorn, höchstens 60 Zeichen plus „ #shorts“: z. B. „Can Dogs See Color? 🐶 #shorts“, „Is Milk Bad For Cats? 🥛 #shorts“, „Are Bats Really Blind? 🦇 #shorts“ statt „Bats Aren't Actually Blind“. Der TikTok-Titel bleibt wie gehabt.
2. **Tags** = die 3 bis 5 Suchbegriffe dazu („can dogs see color“, „dog vision“, „are dogs colorblind“), nicht „nature facts“.
3. **Länge:** YouTube zählt, wie viel Prozent gesehen werden, und Wiederholungen. Videos über 36 s fallen dort stärker ab als auf TikTok. Die Comedy-Story mit 28 bis 36 s passt; länger nicht.
4. **Sendezeit:** bleibt gleich wie TikTok (feste Slots). Die zwei Shorts am Vormittag hatten je ~1.280 Aufrufe, der am Abend 74. Das ist noch zu wenig für eine Regel; der Wochenbericht schaut weiter auf „Nach Sendezeit“ bei YouTube und schlägt eine Änderung vor, sobald es mindestens 3 Videos pro Zeitfenster gibt.
5. Im Wochenbericht hat YouTube immer eine eigene Zeile und den Vergleich „dasselbe Video auf beiden Plattformen“ (druckt `stats.py`).
