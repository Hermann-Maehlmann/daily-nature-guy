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
- 9–12 Beats, zusammen 20–30 s. Jeder Satz kurz, ein Schlüsselwort in *Sternchen* (gelb im Untertitel).
- Gesprochen wird mit Chatterbox (stimme.sh). `voice`/`speed` gelten nur für den Notfall ohne Chatterbox (Kokoro `bm_george`, `speed` 1.1). Hermann: ruhig erzählen, nicht hetzen. Kein Outro, kein „Follow“, letzter Satz lädt zum Neuschauen ein (Loop).
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
