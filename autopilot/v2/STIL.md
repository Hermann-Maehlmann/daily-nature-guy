# Fester Videostil „Daily Nature Guy“ (seit 10.11.2026, von Hermann bestätigt)

Gezeichneter Wissenschafts-Erklärfilm, angelehnt an den Look bekannter Erklärkanäle (flache Vektorformen, leuchtende Farben, ruhige Kamera).
**Nie** fremde Figuren, Logos, Musik oder Szenen kopieren (z. B. keine Kurzgesagt-Vögel) – nur die Machart, eigene Figuren.

## Wie ein Video gebaut wird

1. **Drehbuch** `out/<slug>.json` (Format unten) und **Szenendatei** `out/<slug>-szenen.js` mit eigenen Figuren und Shots fürs Thema.
2. **Stimme**: `bash autopilot/v2/stimme.sh out/<slug>.json` (natürliche Chatterbox-Stimme) -> `out/<slug>-cb.json`. Alle weiteren Schritte mit dieser Datei.
3. **Vorschau** (schnell, ca. 1 Min): `PREVIEW=0.5,3,6,9,12,15 node autopilot/v2/render5.js out/<slug>-cb.json out/<slug>-p` erzeugt `out/<slug>-p-<t>.jpg`. Ansehen, verbessern, wiederholen, bis jedes Bild gut aussieht.
4. **Rendern**: `node autopilot/v2/render5.js out/<slug>-cb.json out/<slug>.mp4` (30 fps, Bild für Bild, ca. 4–10 Min, ~10 MB).
5. Danach wie gewohnt Kontrollbild, `thumb.js`, `cover.sh` (siehe AUTOPILOT.md).

Vorbilder: `autopilot/v2/szenen/pistolenkrebs.js` (kurzes Beispiel mit eigenen Figuren) und die Shots in `anim2d.js` (Zungen-Parasit, das von Hermann abgenommene Video).

## Drehbuch-Format

```json
{ "titel": "Pistol Shrimp", "thumbnail": "Hotter than the *sun*?!",
  "voice": "bm_george", "speed": 1.1, "hook": "LOUDER THAN\nA GUNSHOT", "capY": 0.75, "musicVol": 0.2,
  "sceneFile": "pistol-shrimp-szenen.js",
  "beats": [ { "say": "This tiny shrimp has a *weapon.*", "scene": { "shot": "krebsHook" } }, ... ] }
```
- `sceneFile` relativ zum Drehbuch. `shot` = Name eines Shots aus der Szenendatei (oder aus anim2d.js).
- 13–16 Beats, zusammen 35–50 s (Mix-Stil seit 12.11.2026). Jeder Satz kurz, ein Schlüsselwort in *Sternchen* (gelb im Untertitel).
- Gesprochen wird mit Chatterbox (stimme.sh). `voice`/`speed` gelten nur für den Notfall ohne Chatterbox (Kokoro `bm_george`, `speed` 1.1). Hermann: ruhig erzählen, nicht hetzen. Kein „Follow“-Outro.
- **Hook (Hermann 10.11.2026, Pflicht):** Der erste Satz ist eine schockierende, kurze Behauptung, die neugierig macht, ohne schon alles zu erklären (z. B. „This fish's tongue... is *alive.*“), nicht „Look at this…“. Erstes Bild schon spannend (Nahaufnahme des Rätsels), `sfx: "boom"` auf Beat 0, `hook`-Text = dieselbe Behauptung in 2–4 Wörtern. Der zweite Satz bricht die Erwartung („That's NOT a tongue. It's a *parasite!*“).
- **Loop-Ende (Pflicht):** Der letzte Satz ist unvollständig und führt grammatisch direkt in den ersten Satz, z. B. Ende „So if you ever look into a fish's mouth... remember:“ → Anfang „This fish's tongue... is alive.“ Das letzte Bild zeigt dieselbe Einstellung wie das erste Bild, damit der Übergang nahtlos ist.
- `hook`: 2 Zeilen Großtext im ersten Bild. Optional pro Beat `sfx`: `soft` (Standard), `whoosh`, `boom`, `squish`.
- Für Landtiere: `"fg": false` (kein Riff-Vordergrund) und eigener Hintergrund, siehe unten.

## Szenendatei (window.KZ)

```js
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, rim, shadowCut } = window.KZ;
  function kaefer(c, o) { /* Figur zeichnen, Koordinaten der Figur, Länge ~300 */ }
  KZ.shot("hook", (lt, d, t) => { reef(t, t * 20, 0, 1); cam(x, y, zoom); /* Figuren zeichnen */ });
})();
```
- Ein Shot bekommt `lt` (Zeit im Beat), `d` (Beat-Länge), `t` (Gesamtzeit). Zuerst Hintergrund, dann `cam(x, y, zoom)` (setzt Weltkoordinaten, schwebt automatisch leicht), dann Figuren.
- `reef(t, camx, camy, 1, pal)` Unterwasser-Riff mit Parallaxe, Lichtstrahlen, Partikeln. Für andere Welten `pal` ändern, z. B. Wald bei Nacht:
  `{ sky: ["#1b2a5e","#203a70","#162a4f","#0c1630"], hills: [["#1d4a46","#256058"],["#173b3a","#1e4c49"],["#0f2a2a","#163837"]], corals: false, rays: false, dust: "255,240,180" }`
- `kshape(c, pfad, farbe, {rim, shadow, rw, sw})` zeichnet eine Form im Look: Grundfarbe + harter flacher Schatten unten links + heller Lichtsaum oben rechts. **Jede größere Form damit zeichnen.**
- `glow(x, y, r, "rgba(...)")` weicher Leuchtpunkt, `label("TEXT", x, y, alpha)` weiße Pille mit Text (Bildschirmkoordinaten).
- Bloom, Vignette, Filmkorn, Untertitel und Hook macht die Engine automatisch.

## Figuren-Bibliothek (`autopilot/v2/figuren.js`, in jeder Szene als `KZ.fig`)

Fertige Grundfiguren im Stil, Seitenansicht, Kopf nach rechts, Boden bei y=0, Länge ~400 (mit `g.scale` anpassen):
`fish`, `insect` (Option `ant`, `wings`, `fly`, `stripes`, `bite`), `bird` (`fly`, `beakOpen`), `mammal` (`ears: "pointy"|"round"`, `tail`, `mouth`), `crustacean` (`snap`, `clawSize`), `octopus`, `snake`.
Alle: `{ t, walk, pal: {Farben}, mood: "angry"|"scared", look }`. Helfer: `fig.eye`, `fig.legA` (Gliederbein), `fig.legM` (Pfote), `fig.shade`, `fig.ell`.
Übersicht ansehen: `PREVIEW=1.3 node autopilot/v2/render5.js autopilot/v2/szenen/bibliothek.json out/bib`.
Wichtig: Jedes Tier wird für jedes Video neu und genau nach dem echten Tier gezeichnet (Hermann). Die Grundfiguren und Helfer sind nur Bausteine und Anschauung, keine fertigen Figuren.

## Stilregeln (Checkliste vor dem Rendern)

- **Formen:** flach, rund, ohne Umrisslinien. Pro Teil 1 Grundfarbe + Schatten + Lichtsaum (kshape). Wenige Details, klare Silhouette.
- **Farben:** tiefer, satter Hintergrund (Marineblau, Petrol, Violett), Figuren in warmen, leuchtenden Kontrastfarben (Korallrot, Orange, Gelb, Pink). Höchstens 5–6 Farben pro Video.
- **Licht:** alles, was leuchtet (Blasen, Blitze, Gift, Biolumineszenz), mit `glow` und `globalCompositeOperation = "lighter"`.
- **Figuren:** große runde Augen mit weißem Glanzpunkt, blinzeln ab und zu, atmen/wippen (leichtes Skalieren mit sin(t)). Tiere bleiben erkennbar (richtige Anzahl Beine, typische Merkmale).
- **Bewegung:** nie stillstehen. Kamera fährt in jedem Beat (Zoom oder Schwenk mit `sm`), Figuren haben Nebenbewegung (Fühler, Flossen, Beine). Auftritte mit `easeBack` (leichtes Überschwingen).
- **Bild erklärt den Satz:** jeder Beat zeigt genau, was gesagt wird (Schnittbild, Vergrößerung, Zahl als `label`).
- **TikTok-Zonen:** Wichtiges nicht rechts (150 px Buttons) und nicht unten (unteres Viertel = Untertitel + Caption). Hook-Text oben links-mittig.

## Mix-Stil (seit 12.11.2026, von Hermann abgenommen)

Anlass: ein fremdes Erklärvideo mit 1,6 Mio Aufrufen (Hausspinne). Wir behalten unseren Zeichenstil, übernehmen aber die Erzählweise. **Nichts von dort kopieren** (keine Spinnen-Geschichte, keine gleichen Gags, keine Figuren). Vorbild: `autopilot/v2/szenen/mix/duck-bread-szenen.js` + `duck-bread.json` ("Stop Feeding Ducks Bread").

Pflicht-Bausteine in jedem Video:
1. **Alltagsthema + Irrtum:** Ein Tier, das jeder kennt, und etwas, das viele falsch machen oder glauben. Hook = Irrtum auflösen („That bread you feed ducks... is *junk food* for them.“).
2. **Du-Ansprache:** Der Zuschauer steckt in der Geschichte („You toss a slice... and you feel like a *hero.*“).
3. **Menschenfigur Rudi** als Stellvertreter des Zuschauers: eigene Figur (gelbe Regenjacke, rote Mütze, Jeans, große Augen), Funktion `rudi()` aus der Vorbild-Datei kopieren und weiterverwenden. Posen: `arm` 0..1 (werfen/zeigen), 1.5..2 (am Kopf kratzen), `mouth` smile/grin/o/hmm, `hold` bread/seeds/bag (für neue Gegenstände ergänzen). Rudi bleibt immer gleich, damit Zuschauer ihn wiedererkennen. **Tiere werden weiterhin jedes Mal neu und genau gezeichnet.**
4. **Stempel-Schilder** mit `stamp(text, x, y, p, farbe, drehung)` für kleine Gags und Schlüsselbegriffe („+100 KARMA“, „JUNK FOOD“, „CAN'T FLY“, „DUCK APPROVED“). Pro Video 4–6, kurz (1–3 Wörter).
5. **Mindestens 2 Infografiken** auf dem dunklen Infografik-Hintergrund `navy(t)` oder im Bild: Balken, Anzeige/Meter, Akku, Querschnitt, Vorher/Nachher, Symbole die nacheinander erscheinen.
6. **Quellenkarte:** ein Beat mit Karte (Name der Organisation/Uni + kurzes, **echtes** Zitat oder eine echte Zahl aus der Quelle). Nie ein Zitat erfinden.
7. **Praktischer Tipp** gegen Ende („So what *should* you do?“ + 1–2 Beats Lösung), danach Loop-Satz.
8. **Viele Schauplätze:** Wechsel zwischen Szene (Park/Haus/Garten), Nahaufnahme, Infografik und Querschnitt; kein Schauplatz länger als 2 Beats am Stück.

Technik-Hinweise: `stamp()` muss `p` auf 1 begrenzen (sonst wird der Text gespiegelt). Texte (`txt`) mindestens 40 px. Nichts unter 0,68 H (Untertitel) und nichts rechts in den TikTok-Buttons.
