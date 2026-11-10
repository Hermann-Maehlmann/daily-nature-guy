# TikTok-Autopilot „Daily Nature Guy“

Dieses Repo gehört zu Hermanns KI-Labor. Eine geplante Aufgabe startet 4× am Tag eine frische Claude-Sitzung, die genau diesen Ablauf einmal durchläuft.

**Pro Lauf entstehen 2 Videos:**
- **Video A** wird **öffentlich** auf TikTok eingeplant (voll automatisch, von Hermann am 10.11.2026 so gewählt).
- **Video B** wird nur als **Entwurf** in Metricool abgelegt (`draft: true`), Hermann gibt es selbst frei.

Ergibt 4 öffentliche Posts + 4 Entwürfe pro Tag. **Niemals mehr als 4 öffentliche Posts in 24 Stunden** (TikTok sperrt ab ca. 15, und viele KI-Posts wirken schnell wie Spam).

## Ablauf

1. **Vorbereiten**
   - `git pull` (Repo ist `Hermann-Maehlmann/daily-nature-guy`, für Push mit `add_repo` und `access: "push"` anhängen).
   - Git-Name setzen: `git config user.name "KI-Labor Autopilot"` und `git config user.email autopilot@users.noreply.github.com`.
   - `state/videos.json` lesen: Liste aller bisherigen Videos (Thema, Titel, Datum, öffentlich/Entwurf). Prüfen, wie viele öffentliche Posts in den letzten 24 h eingeplant wurden. Sind es schon 4 oder mehr, wird Video A ebenfalls nur Entwurf.

   - **Gesundheitscheck:** Mit `getScheduledPosts` (gestern bis morgen) und `state/videos.json` prüfen, ob die öffentlichen Posts früherer Läufe wirklich rausgegangen sind. Steht ein Post, dessen Zeit vorbei ist, noch auf PENDING oder auf ERROR/FAILED, oder schlägt ein Connector (Metricool, Parallel Search, GitHub) fehl, beginnt die Zusammenfassung am Ende mit **„⚠️ Hermann, bitte kümmern:“** und sagt in einem Satz, was kaputt ist und was er tun muss (z. B. TikTok in Metricool neu verbinden). Dann nichts Neues öffentlich einplanen, solange TikTok-Posts scheitern.

2. **Themen wählen** (2 verschiedene, nie ein Thema aus `state/videos.json` wiederholen)
   - Überraschende, wahre Tier- oder Naturfakten mit Krimi-, Ekel-, Wow- oder Lach-Faktor. Gute Felder: Insekten, Tiefsee, Parasiten, Vögel, Pilze, Pflanzen, Raubtiere, Tarnung, Paarung, Rekorde.
   - Fakten mit Parallel Search (`web_search`) gegenprüfen. Nur, was eine seriöse Quelle (Uni, Museum, Fachartikel, National Geographic, BBC Earth …) belegt. Eine Quelle für die Caption merken.

3. **Drehbuch schreiben** (je Video)
   - `node autopilot/schema.js` zeigt das Format und ein Vorbild. Daraus ein JSON schreiben nach `out/<slug>.json`.
   - Regeln: `format` 9:16, `stil` cartoon, `sprache` en, `stimme` am_michael, `musik` true, `outro` true. 8–11 Szenen, zusammen 18–28 s. Erste Szene ist ein harter Hook (Frage oder Schock-Satz). Jede Szene hat Figuren (`darsteller` mit Emojis) und einen `sprecher`-Satz, der erklärt, was passiert. Witzige Sprechblasen (`sagt`). Letzte Szene `typ: ende` mit Unterzeile „Follow for daily nature facts“. **Nie** „Part 2“ oder Fortsetzung.
   - Selbst kritisch prüfen wie Kai im Labor: Hook stark? Fakten korrekt? Jede Szene mit Bewegung? Text höchstens 7 Wörter? Dann verbessern.

4. **Rendern**
   - `node autopilot/render.js out/<slug>.json out/<slug>.mp4` (dauert 2–4 Min, lädt beim ersten Mal die Stimme von npm).
   - Danach Kontrollbild: `ffmpeg -i out/<slug>.mp4 -vf "select='eq(n\,30)+eq(n\,300)+eq(n\,600)',scale=270:-1,tile=3x1" -frames:v 1 out/<slug>.png` und ansehen. Fehlen Figuren oder ist das Bild leer, nicht posten, sondern Fehler melden.

5. **Ablegen**: `autopilot/host.sh upload out/<slugA>.mp4 out/<slugB>.mp4` legt beide Videos auf den Branch `videos` und gibt je eine öffentliche URL aus (raw.githubusercontent.com). Die Meldung „push negotiation failed“ ist harmlos.

6. **In Metricool einplanen** (Metricool-Connector)
   - `getBrandSettings`: die Marke mit TikTok (blogId 7900279, Zeitzone daraus, meist Europe/Berlin).
   - Zeit: mit `getBestTimeToPostByNetwork` (tiktok) den besten Slot in den nächsten 6 Stunden wählen, frühestens 20 Min ab jetzt, mindestens 2 Stunden Abstand zum letzten öffentlichen Post aus `state/videos.json`.
   - `createScheduledPost` mit `info`:
     `{"text": <Caption>, "providers":[{"network":"tiktok"}], "media":[<URL>], "publicationDate":{"dateTime":"YYYY-MM-DDTHH:mm:ss","timezone":<tz>}, "autoPublish": true, "draft": <false für A, true für B>, "tiktokData":{"privacyOption":"PUBLIC_TO_EVERYONE","isAigc":true,"title":<Titel>}, "firstCommentText":"", "descendants":[], "shortener":false, "smartLinkData":{"ids":[]}, "hasNotReadNotes":false, "mediaAltText":[]}`
   - Caption (Englisch, kurz: höchstens 150 Zeichen ohne Hashtags, Hermanns Wunsch vom 10.11.2026): 1 knackiger Hook-Satz plus 1 Frage oder Aufforderung an die Zuschauer, die zum Kommentieren einlädt (z. B. „Would you survive this? 👇“, „Which animal should be next?“, „Tag a friend who…“, „Guess the temperature before the end 🔥“). Wechsle die Art der Frage von Video zu Video. Danach kurz die Quelle („Source: Nature“) und 3 bis 4 Hashtags (einer Nische, einer #naturefacts). Kein „Part 2“.
   - Beispiel: `This shrimp gets hotter than the sun 🦐🔥 Would you go near it? 👇 (Source: Nature) #pistolshrimp #naturefacts #oceanlife`
   - Für Entwürfe (B) als Datum den nächsten Tag 18:00 nehmen.
   - Metricool kopiert das Video beim Einplanen sofort auf eigene Server (`media` in der Antwort zeigt dann static.metricool.com). Danach `autopilot/host.sh clear`, damit die Videos nicht öffentlich im Repo liegen bleiben.

7. **Buch führen**
   - Pro Video einen Eintrag an `state/videos.json` anhängen: `{"datum", "thema", "titel", "status": "oeffentlich"|"entwurf", "geplant_fuer", "plannerUrl", "quelle"}`.
   - Drehbuch-JSON nach `state/drehbuecher/<datum>-<slug>.json` kopieren (Videos selbst nicht committen).
   - Commit „Autopilot: <titel A> + <titel B>“ und push auf `main`.

8. **Abschluss**: kurze deutsche Zusammenfassung. Gab es ein Problem (auch aus dem Gesundheitscheck), steht die Warnung „⚠️ Hermann, bitte kümmern:“ ganz oben, damit er es in der Push-Nachricht sofort sieht. Sonst (Titel, Uhrzeit, öffentlich/Entwurf, Planner-Links). Bei Fehlern klar sagen, was nicht geklappt hat. Nichts doppelt posten: wenn unklar ist, ob ein Post angelegt wurde, erst mit `getScheduledPosts` nachsehen.
