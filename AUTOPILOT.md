# TikTok-Autopilot „Daily Nature Guy“

Dieses Repo gehört zu Hermanns KI-Labor. Eine geplante Aufgabe startet 4× am Tag eine frische Claude-Sitzung, die genau diesen Ablauf einmal durchläuft.

**Pro Lauf entsteht 1 Video, dafür besonders sorgfältig** (Hermanns Wahl vom 10.11.2026: lieber jedes Tier so ausgefeilt wie das Zungen-Parasit-Video):
- Es wird **öffentlich** auf TikTok eingeplant (voll automatisch), **wenn es die Qualitätsprüfung besteht** (Schritt 4).
- Besteht es nach 3 Verbesserungsrunden nicht, kommt es nur als **Entwurf** in Metricool (`draft: true`) und die Zusammenfassung sagt warum.

Ergibt bis zu 4 öffentliche Posts pro Tag. **Niemals mehr als 4 öffentliche Posts in 24 Stunden** (TikTok sperrt ab ca. 15, und viele KI-Posts wirken schnell wie Spam).

## Ablauf

1. **Vorbereiten**
   - `git pull` (Repo ist `Hermann-Maehlmann/daily-nature-guy`, für Push mit `add_repo` und `access: "push"` anhängen).
   - Git-Name setzen: `git config user.name "KI-Labor Autopilot"` und `git config user.email autopilot@users.noreply.github.com`.
   - `state/videos.json` lesen: Liste aller bisherigen Videos (Thema, Titel, Datum, öffentlich/Entwurf). Prüfen, wie viele öffentliche Posts in den letzten 24 h eingeplant wurden. Sind es schon 4 oder mehr, wird das Video nur Entwurf.

   - **Gesundheitscheck:** Mit `getScheduledPosts` (gestern bis morgen) und `state/videos.json` prüfen, ob die öffentlichen Posts früherer Läufe wirklich rausgegangen sind. Steht ein Post, dessen Zeit vorbei ist, noch auf PENDING oder auf ERROR/FAILED, oder schlägt ein Connector (Metricool, Parallel Search, GitHub) fehl, beginnt die Zusammenfassung am Ende mit **„⚠️ Hermann, bitte kümmern:“** und sagt in einem Satz, was kaputt ist und was er tun muss (z. B. TikTok in Metricool neu verbinden). Dann nichts Neues öffentlich einplanen, solange TikTok-Posts scheitern.

2. **Thema wählen** (nie ein Thema aus `state/videos.json` wiederholen; bevorzugt Tiere, für die es in `autopilot/v2/figuren.js` schon eine Grundfigur gibt oder die sich daraus ableiten lassen)
   - Überraschende, wahre Tier- oder Naturfakten mit Krimi-, Ekel-, Wow- oder Lach-Faktor. Gute Felder: Insekten, Tiefsee, Parasiten, Vögel, Pilze, Pflanzen, Raubtiere, Tarnung, Paarung, Rekorde.
   - Fakten mit Parallel Search (`web_search`) gegenprüfen. Nur, was eine seriöse Quelle (Uni, Museum, Fachartikel, National Geographic, BBC Earth …) belegt. Eine Quelle für die Caption merken.

3. **Drehbuch + Animation bauen** – **fester Stil seit 10.11.2026: gezeichneter Erklärfilm, Anleitung in `autopilot/v2/STIL.md` genau lesen.**
   - Drehbuch `out/<slug>.json` und Szenendatei `out/<slug>-szenen.js` mit eigenen, für das Tier gezeichneten Figuren. **Zuerst die Figuren-Bibliothek nutzen** (`KZ.fig.fish/insect/bird/mammal/crustacean/octopus/snake`, Übersicht `autopilot/v2/szenen/bibliothek.js`) und mit Farben (`pal`) und Zusatzteilen an das echte Tier anpassen (Hörner, Stacheln, Muster, Proportionen). Vorbild für eine Szenendatei: `autopilot/v2/szenen/pistolenkrebs.js`. Englisch, ruhig erzählt (nicht hetzen), 9–12 Beats, 20–30 s, erster Beat harter Hook, kein Outro, **nie** „Part 2“.
   - Feld `"thumbnail"`: Cover-Text, höchstens 4 Wörter, ein Wort in *Sternchen*, nicht derselbe Satz wie der Hook.
   - Altes Emoji-Format (`autopilot/render.js`, `schema.js`) **nicht mehr verwenden**.
   - Selbst kritisch prüfen wie Kai im Labor: Hook stark? Fakten korrekt? Zeigt jedes Bild genau den gesprochenen Satz? Ist das Tier erkennbar und schön gezeichnet (Stil-Checkliste in STIL.md)?

4. **Stimme, Vorschau, dann rendern**
   - **Stimme (Pflicht):** `bash autopilot/v2/stimme.sh out/<slug>.json` spricht jeden Satz mit der natürlichen Chatterbox-Männerstimme ein (von Hermann am 10.11.2026 abgenommen) und schreibt `out/<slug>-cb.json`. Erster Aufruf installiert das Modell (5–10 Min), dann ca. 35 s pro Satz. **Ab hier immer `out/<slug>-cb.json` rendern.** Nur wenn Chatterbox gar nicht startet: mit `out/<slug>.json` rendern (Kokoro `bm_george`, `speed` 1.1) und in der Zusammenfassung „⚠️ Hermann, bitte kümmern: natürliche Stimme ging nicht“ melden.
   - **Qualitätsprüfung in 3 Runden (Pflicht):** Vorschau `PREVIEW=<Mitte jedes Beats, kommagetrennt> node autopilot/v2/render5.js out/<slug>-cb.json out/<slug>-p` (die Beat-Zeiten druckt der Befehl aus) und **jedes** Bild ansehen. Pro Runde streng wie Kai prüfen und verbessern:
     1. Runde: Ist das Tier sofort erkennbar (richtige Körperform, Beine, typische Merkmale)? Zeigt jedes Bild genau den gesprochenen Satz?
     2. Runde: Stil-Checkliste aus STIL.md (kshape überall, satte Farben, Leuchten, große Augen, nichts leer oder abgeschnitten, nichts in TikTok-Zonen).
     3. Runde: Bewegung und Wirkung (Kamera fährt in jedem Beat, Figuren lebendig, starker erster Beat). Letzte Fehler beheben.
     Bestanden nur, wenn nach Runde 3 kein Bild mehr einen klaren Fehler hat. Sonst wird das Video Entwurf.
   - Gelungene neue Figur (z. B. ein Tier, das es noch nicht gab) als Funktion in `autopilot/v2/figuren.js` ergänzen und mit committen, damit spätere Videos sie nutzen.
   - Rendern: `node autopilot/v2/render5.js out/<slug>-cb.json out/<slug>.mp4` (30 fps Bild für Bild, ca. 4–10 Min).
   - Flüssigkeit prüfen: `ffmpeg -i out/<slug>.mp4 -vf mpdecimate -loglevel debug -f null - 2>&1 | grep -c "drop pts"` muss unter 100 liegen (sonst nicht posten, Fehler melden).
   - Kontrollbild: `ffmpeg -i out/<slug>.mp4 -vf "select='eq(n\,30)+eq(n\,300)+eq(n\,600)',scale=270:-1,tile=3x1" -frames:v 1 out/<slug>.png` ansehen. Leer oder kaputt → nicht posten, Fehler melden.

   - **Thumbnail:** `node autopilot/thumb.js out/<slug>.mp4 out/<slug>.json out/<slug>.jpg` (Hook-Bild plus Cover-Text-Sticker, 1080×1920). Ansehen: Figur sichtbar, Text lesbar, nichts abgeschnitten.
   - **Cover ins Video:** `bash autopilot/cover.sh out/<slug>.mp4 out/<slug>.jpg` setzt das Thumbnail als erstes Bild (0,1 s) ins Video. Hermanns Konto übernimmt `videoThumbnailUrl` nicht, TikTok nimmt das erste Bild als Cover. Deshalb ist dieser Schritt Pflicht.
   - **TikTok-Layout:** rechts ca. 150 px Buttons, unten ca. 360 px Name/Caption, oben 120 px. Im Kontrollbild prüfen, dass nichts Wichtiges dort liegt.

5. **Ablegen**: `autopilot/host.sh upload out/<slug>.mp4` legt das Video (mit eingebautem Cover) auf den Branch `videos` und gibt je eine öffentliche URL aus (raw.githubusercontent.com). Die Meldung „push negotiation failed“ ist harmlos.

6. **In Metricool einplanen** (Metricool-Connector)
   - `getBrandSettings`: die Marke mit TikTok (blogId 7900279, Zeitzone daraus, meist Europe/Berlin).
   - Zeit: mit `getBestTimeToPostByNetwork` (tiktok) den besten Slot in den nächsten 6 Stunden wählen, frühestens 20 Min ab jetzt, mindestens 2 Stunden Abstand zum letzten öffentlichen Post aus `state/videos.json`.
   - `createScheduledPost` mit `info`:
     `{"text": <Caption>, "providers":[{"network":"tiktok"}], "media":[<Video-URL>], "publicationDate":{"dateTime":"YYYY-MM-DDTHH:mm:ss","timezone":<tz>}, "autoPublish": true, "draft": <false wenn Prüfung bestanden, sonst true>, "tiktokData":{"privacyOption":"PUBLIC_TO_EVERYONE","isAigc":true,"title":<Titel>}, "firstCommentText":"", "descendants":[], "shortener":false, "smartLinkData":{"ids":[]}, "hasNotReadNotes":false, "mediaAltText":[]}`
   - Caption (Englisch, kurz: höchstens 150 Zeichen ohne Hashtags, Hermanns Wunsch vom 10.11.2026): 1 knackiger Hook-Satz plus 1 Frage oder Aufforderung an die Zuschauer, die zum Kommentieren einlädt (z. B. „Would you survive this? 👇“, „Which animal should be next?“, „Tag a friend who…“, „Guess the temperature before the end 🔥“). Wechsle die Art der Frage von Video zu Video. Danach kurz die Quelle („Source: Nature“) und 3 bis 4 Hashtags (einer Nische, einer #naturefacts). Kein „Part 2“.
   - Beispiel: `This shrimp gets hotter than the sun 🦐🔥 Would you go near it? 👇 (Source: Nature) #pistolshrimp #naturefacts #oceanlife`
   - Für einen Entwurf als Datum den nächsten Tag 18:00 nehmen.
   - Metricool kopiert das Video beim Einplanen sofort auf eigene Server (`media` in der Antwort zeigt dann static.metricool.com). Danach `autopilot/host.sh clear`, damit die Videos nicht öffentlich im Repo liegen bleiben.

7. **Buch führen**
   - Pro Video einen Eintrag an `state/videos.json` anhängen: `{"datum", "thema", "titel", "status": "oeffentlich"|"entwurf", "geplant_fuer", "plannerUrl", "quelle"}`.
   - Drehbuch-JSON und Szenendatei nach `state/drehbuecher/<datum>-<slug>.json` bzw. `<datum>-<slug>-szenen.js` kopieren (bewährte Figuren können später wiederverwendet werden) (Videos selbst nicht committen).
   - Commit „Autopilot: <titel>“ und push auf `main`.

8. **Abschluss**: kurze deutsche Zusammenfassung. Gab es ein Problem (auch aus dem Gesundheitscheck), steht die Warnung „⚠️ Hermann, bitte kümmern:“ ganz oben, damit er es in der Push-Nachricht sofort sieht. Sonst (Titel, Uhrzeit, öffentlich/Entwurf, Planner-Links). Bei Fehlern klar sagen, was nicht geklappt hat. Nichts doppelt posten: wenn unklar ist, ob ein Post angelegt wurde, erst mit `getScheduledPosts` nachsehen.
