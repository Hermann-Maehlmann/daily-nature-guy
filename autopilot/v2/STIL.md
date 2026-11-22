# Fester Videostil „Daily Nature Guy“ (seit 10.11.2026, von Hermann bestätigt)

> **⚠️ Seit 16.11.2026 (Hermann): alle Videos in 3D.** Der 2D-Zeichenstil unten (kshape, reef, Figuren-Bibliothek) gilt nicht mehr für neue Videos. Neue Videos werden mit dem 3D-Baukasten gebaut, siehe Abschnitt **„3D-Look“** ganz unten. Weiter gültig bleiben: Drehbuch-Format, Hook-Regeln (jetzt als „Why …?“-Frage), Loop-Ende, Mix-Stil-Bausteine, Comedy-Story-Aufbau, TikTok-Zonen.

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
- 10–12 Beats, zusammen 28–36 s (Comedy-Story seit 15.11.2026). Jeder Satz kurz, ein Schlüsselwort in *Sternchen* (gelb im Untertitel).
- Gesprochen wird mit Chatterbox (stimme.sh). `voice`/`speed` gelten nur für den Notfall ohne Chatterbox (Kokoro `bm_george`, `speed` 1.1). Hermann: ruhig erzählen, nicht hetzen. Kein „Follow“-Outro.
- **Zwei Sprachen + Roast (Hermann 19.11.2026, Pflicht):** Jedes Video gibt es auf Deutsch (TikTok) und Englisch (YouTube) aus derselben Animation. Drehbuch mit `say`/`say_de`, `hook`/`hook_de`, `titel`/`titel_de`, `thumbnail`/`thumbnail_de`; alle Bildtexte in der Szenendatei als `L("EN", "DE")`; `python3 autopilot/v2/sprache.py out/<slug>.json` erzeugt beide Fassungen. Deutscher Hook beginnt mit **„Warum …?“** (`hook_de` z. B. „WARUM ZU\nKLEIN?“). Direkt nach der Warum-Frage ein **wechselnder, krasser Opener** in beiden Sprachen (seit 21.11.2026, Stil-Liste und `opener_stil` in AUTOPILOT.md „🎬 Opener-Wechsel“, Pflicht-Check `autopilot/v2/opener_check.py`). **Nie** „du Pfeife“ / „you absolute potato“ oder eine andere feste Formel; Sticheleien nur frisch erfunden. Nie Aussehen, Gewicht, Herkunft, echte Personen/Gruppen oder harte Schimpfwörter. Mindestens einmal „Und das Krasseste?“ / „And the craziest part?“ vor dem stärksten Fakt. Abkürzungen im gesprochenen Deutsch ausschreiben (`sprich_de`), Stempel max. ~12 Zeichen (deutsche Wörter sind länger). Vorbild: `autopilot/v2/szenen/3d/bunny-hutch-2spr.json` + `bunny-hutch-2spr-szenen.js`.
- **Why-Hook (Hermann 16.11.2026, Pflicht):** Der erste Satz ist **immer eine Frage, die mit „Why“ beginnt**, und löst den Irrtum als Rätsel auf (z. B. „Why does a wagging tail... *not* mean your dog is happy?“, „Why should you never give your cat milk?“). `hook`-Text = Kurzform mit WHY (z. B. „WHY WAG\n≠ HAPPY?“). Der Loop-Satz am Ende führt in diese Frage hinein („And if your friends ever ask you...“ → „Why does…?“).
- **Hook (Hermann 10.11.2026, Pflicht, ergänzt durch die Why-Regel oben):** Der erste Satz ist eine schockierende, kurze Behauptung, die neugierig macht, ohne schon alles zu erklären (z. B. „This fish's tongue... is *alive.*“), nicht „Look at this…“. Erstes Bild schon spannend (Nahaufnahme des Rätsels), `sfx: "boom"` auf Beat 0, `hook`-Text = dieselbe Behauptung in 2–4 Wörtern. Der zweite Satz bricht die Erwartung („That's NOT a tongue. It's a *parasite!*“).
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

## Comedy-Story (seit 15.11.2026, von Hermann abgenommen: „Das ist sehr gut“)

Anlass: Auswertung YouTube (Igel-Video): Hook hält, aber zwischen Sekunde 5 und 12 springt die Hälfte ab, weil es direkt ruhig erklärend wird. Vorbild für den Ton: Kanäle wie „Everyday problems. Ridiculous solutions.“ (nichts kopieren). Hermann: Bindung ans Video ist das Wichtigste, lustig und interessant erklären. Die alte Regel „kein Comedy-Stil“ gilt nicht mehr. Vorbild: `autopilot/v2/szenen/comedy/dog-grass.json` + `dog-grass-szenen.js`.

Aufbau (gilt zusätzlich zum Mix-Stil oben):
1. **Beat 0 Hook** (Irrtum auflösen), **Beat 1**: Rudi glaubt den Irrtum und reagiert übertrieben (Panik, Sprechblase, Stempel).
2. **Beats 2–3 Eskalation als Geschichte, genau 2 Stufen:** Rudi versucht eine übertriebene Lösung, das Tier kontert sofort. Erzählt mit Verbindungen statt Schildern, z. B. „So Rudi builds a fence, to keep the dog off the grass. It just eats right through it.“ → „The fence didn't work, so Rudi decided to move to the fortieth floor. But look what grows on the balcony.“ **Keine „Level 1/2/3“-Schilder** (Hermann: wirkt hingeklatscht). Aufbau und Konter in **einem** Satz/Beat (ca. 4–5 s), die Szene wechselt in der Mitte per Schnitt (`split`-Helfer in der Vorbild-Datei). Nicht 3 Stufen (zu lang), nicht ohne sichtbaren Aufbau (zu schnell).
3. **Danach die Fakten** (2–3 Beats Infografik mit echten Zahlen + Quelle), dann die Pointe, die auf die Eskalation zurückgreift („So the tower? Slightly overkill.“).
4. **Praktischer Tipp** (1 Beat), **Loop-Satz** über Rudi zurück zum Hook.
5. Alle 2–3 Sekunden passiert etwas Neues (Schnitt, Stempel, Kamerafahrt). Kein Beat länger als ~4,5 s.
6. **Kein Like/Follow im Video** (stört die Bindung). Der erste Kommentar (`firstCommentText`) ist eine Frage an die Zuschauer, die Caption endet mit einer anderen Frage (siehe AUTOPILOT.md).

## 3D-Look (seit 16.11.2026, Hermann: „komplett alle Videos auf 3D Animation umstellen“)

Erstes 3D-Video und **Vorbild**: `autopilot/v2/szenen/3d/dog-tail-3d.json` + `dog-tail-3d-szenen.js` („Why A Wagging Tail Doesn't Mean Happy“, 16.11.2026). Eigener Look, **keine Kopie** eines bekannten Studios oder einer Serie: weiche, runde Spielzeug-/Knetfiguren aus einfachen Grundkörpern, warmes Sonnenlicht mit weichen Schatten, kühles Kantenlicht von hinten, satte Farben, Garten-Diorama oder dunkelblaues Infografik-Studio.

Technik: `autopilot/v2/kit3d.js` (three.js r128, läuft in render5.js mit). Die Szenendatei lädt ihn in der ersten Zeile (aus dem Vorbild kopieren) und bekommt `window.K3`:
- **Welten:** `begin("yard")` (Garten: Gras, Weg, Hundehütte, Baum, Zaun, Blumen) oder `begin("studio")` (Marineblau mit Korallen-Sockel, für Infografiken). Neue Welten (Küche, Wohnzimmer, Teich …) in der Szenendatei mit `K3.onBuild` bauen und Sichtbarkeit selbst schalten.
- **Bauteile:** `M(farbe, {roughness, metalness, emissive})` Material (sRGB-Farben werden richtig umgerechnet), `sph(mat, x,y,z, sx,sy,sz)` Kugel/Ellipsoid, `mesh(geo, mat, …)`, `limb(r, länge, mat)` Bein/Arm mit Gelenk oben, `canvasTex(w,h,zeichne)` Textur mit Text (Schilder, Skalen, Kacheln), `SPH/CYL/BOX` Grundkörper.
- **Figuren:** in `K3.onBuild(() => { tier = actor(makeTier()); })` bauen. `actor()` meldet die Figur an, `begin()` blendet alle aus, `place(fig, x, z, drehung)` zeigt sie. Blickrichtung +x, Boden y = 0, Hund ~1,2 hoch, Rudi ~2,1.
- **Rudi in 3D:** `K3.rudi` + `poseRudi(K3.rudi, t, {arms:[l,r], spread, walk, wave, mouth:"o"|"smile", lean, nod, tilt, armor})`. Gelbe Regenjacke, rote Mütze mit Bommel, Jeans, große Augen. Rudi bleibt immer so; neue Requisiten (Schaufel, Leiter, Rüstung …) als eigene Teile dazubauen.
- **Kamera (Pflicht seit 16.11.2026): `frameOn([figuren], {az, el, fill, t})`** statt Kamera-Koordinaten von Hand. Sie setzt die genannten Figuren zusammen mittig in die sichere Zone von TikTok **und** YouTube Shorts, nicht angeschnitten und nicht zu klein. Kamerafahrt: `az`/`fill` mit `lerp` über den Beat ändern. **Zwei Figuren nebeneinander** (Rudi + Tier) nie frontal zeigen, sondern schräg (`az` ±.4–.6), dann stehen sie gestaffelt und werden groß genug. Eine Figur, die im Beat nicht vorkommen soll, ausblenden (`fig.root.visible = false`) statt halb im Bild stehen lassen.
- **Automatischer 3D-Check:** Jede Figur mit Namen anmelden (`actor(makeTier(), "Hund")`). Bei jedem Bild meldet der Baukasten in der Konsole `[3D-Check] … Überlappung …` (zwei Figuren stecken ineinander) oder `… außerhalb der sicheren Zone …` (ragt aus dem Bild oder in die Buttons). Requisiten, die bewusst schweben (Kacheln, Pfeile), mit `noCheck = true` ausnehmen.
- **Kamera von Hand (nur Sonderfälle wie Draufsicht):** `view(px,py,pz, zielX,zielY,zielZ, fov, t)` dann `draw()` (rendert 3D und kopiert es ins Bild). Abstände werden mit `K3.zoom` (1.9) gestreckt, weil das Hochformat schmal ist. Für eine Draufsicht `K3.camera.up.set(0,0,-1)` und `K3.zoom = 1`, danach zurücksetzen.
- **2D-Overlays nach `draw()`:** `stamp()`, `card()`, `txt()` wie im Comedy-Stil (Quellenkarte, Stempel-Gags). Untertitel/Hook macht die Engine.
- **Karten mit Text immer mit `infoCard()` (Hermann 22.11.2026):** `infoCard(x, y, w, h, p, kopf, farbe, ["Zeile 1", "Zeile 2"], 36)` zentriert die Zeilen senkrecht und waagrecht im weißen Feld unter dem Kopf, verkleinert die Schrift, wenn eine Zeile zu breit ist, vergrößert die Karte, wenn zu viele Zeilen drin sind, und lässt den Text beim Einploppen mitwachsen. **Nie mehr `card()` + einzelne `txt()`-Zeilen mit geschätzten y-Abständen** (Text klebte am Kopf oder hing schief im weißen Feld). Höchstens 3 Zeilen, Zitat-Anführungszeichen gehören in die Zeilen. In der Vorschau prüfen: Abstand oben und unten im weißen Feld gleich, Text nirgends am Rand.

Regeln für 3D-Figuren (Stil-Checkliste, ersetzt kshape-Regeln):
- **Tiere genau und neu:** jedes Tier aus Grundkörpern nach dem echten Tier (Körperform, richtige Beinzahl, typische Merkmale wie Ohren, Schwanz, Fell-Abzeichen). Große Augen mit Glanzpunkt (kleine weiße `emissive`-Kugel), blinzeln, atmen. Ausdruck über Augenbrauen, Ohren, Mund.
- **Licht/Farbe:** nichts selbst aufhellen, Belichtung kommt vom Baukasten. Höchstens 5–6 Hauptfarben. Glänzend nur bei Metall/Wasser (`metalness`, kleine `roughness`).
- **Augen immer sichtbar (Hermann 16.11.2026):** Bei Rudi und jedem Tier dürfen Mütze, Helm, Ohren, Requisiten oder Kamerawinkel die Augen nie verdecken. Kein Visier, keine Brille als schwarzer Balken. In jeder Vorschau prüfen: Sind bei jeder Figur beide Augen (oder bei Seitenansicht das eine) klar zu sehen? Sonst Kamera drehen oder Figur umbauen. Rudis Mütze und Ritterhelm in `kit3d.js` sitzen deshalb oberhalb der Augen; beim Umbau von Rudi nichts tiefer setzen.
- **Kamera fährt in jedem Beat**, Figuren nie ganz still (Wedeln, Wippen, Kopf). Figuren ganz im Bild, nichts angeschnitten außer bei Absicht (Nahaufnahme).
- **Sichere Zone TikTok + YouTube Shorts (Hermann 16.11.2026):** Bild 1080×1920. Rechts 190 px Buttons, unten ca. 420 px Titel/Caption/Untertitel, oben 150 px. Hauptmotiv waagrecht mittig (frameOn macht das), Figuren zwischen 15 und 68 % der Höhe, Stempel oben mittig, nichts Wichtiges rechts von x 890.
- **Vorschau zuerst:** Die Vorschau dauert ca. 15 s. Der Vollrender dauert in 3D ca. **12–15 Min** (statt 3–10 in 2D), deshalb erst rendern, wenn die Vorschau stimmt. Schatten und Kantenlicht nicht abschalten (sie machen den Look); wenn es zu langsam wird, eher Kugel-Segmente sparen.
