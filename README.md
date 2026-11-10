# Daily Nature Guy – TikTok-Autopilot

Technik hinter Hermanns KI-Labor: Eine geplante Claude-Aufgabe baut 4× am Tag zwei Cartoon-Naturvideos mit englischer Stimme und plant sie über Metricool auf TikTok ein (eins öffentlich, eins als Entwurf).

- `AUTOPILOT.md` – der Ablauf, den jeder Lauf befolgt
- `autopilot/render.js` – rendert ein Drehbuch mit der echten Video-Engine aus `lab/ki-labor.html`
- `state/videos.json` – Logbuch aller Videos (verhindert doppelte Themen)
- Branch `videos` – kurze Ablage für Metricool, wird nach jedem Lauf geleert
