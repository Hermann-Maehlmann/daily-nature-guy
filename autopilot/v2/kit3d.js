// 3D-Baukasten "Daily Nature Guy" (seit 16.11.2026, Hermann: alle Videos in 3D).
// three.js r128 im Spielzeug-/Knet-Look. Eine eigene WebGL-Leinwand wird pro Bild gerendert und auf die 2D-Leinwand
// der Engine (anim2d.js) kopiert; Untertitel, Hook, Bloom, Vignette und Korn macht weiter render5.js.
// Szenendateien laden ihn mit der ersten Zeile aus autopilot/v2/szenen/3d/dog-tail-3d-szenen.js;  danach steht alles unter window.K3 (siehe STIL.md, Abschnitt 3D).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.THREE) { const x = new XMLHttpRequest(); x.open("GET", "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", false); x.send(); (0, eval)(x.responseText); }
  const T = window.THREE, PI = Math.PI;
  // ---------- 2D-Overlays (wie Comedy-Vorbild) ----------
  function txt(s, x, y, size, col, o) { o = o || {}; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = o.a ?? 1; g.font = `${o.w || 800} ${size}px "Montserrat"`; g.textAlign = o.align || "center"; g.textBaseline = "middle";
    if (o.stroke) { g.lineJoin = "round"; g.lineWidth = o.stroke; g.strokeStyle = "rgba(0,0,0,.75)"; g.strokeText(s, x, y); } g.fillStyle = col; g.fillText(s, x, y); g.restore(); }
  function stamp(s, x, y, p, col, rot) { if (p <= 0) return; p = Math.min(p, 1); const k = easeBack(p); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(rot ?? -.08); g.scale(k * (1 + (1 - p) * .6), k * (1 + (1 - p) * .6)); g.globalAlpha = clamp(p * 3, 0, 1);
    g.font = '900 64px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; const w = g.measureText(s).width + 70;
    g.fillStyle = "rgba(10,10,30,.35)"; g.beginPath(); g.roundRect(-w / 2 + 8, -50 + 10, w, 100, 22); g.fill();
    g.fillStyle = col; g.beginPath(); g.roundRect(-w / 2, -50, w, 100, 22); g.fill();
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 6; g.beginPath(); g.roundRect(-w / 2 + 10, -40, w - 20, 80, 16); g.stroke();
    g.fillStyle = "#fff"; g.fillText(s, 0, 4); g.restore(); }
  function card(x, y, w, h, p, head, col) { const k = easeBack(clamp(p, 0, 1)); if (k <= 0) return false; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(k, k);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-w / 2 + 10, -h / 2 + 12, w, h, 30); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 30); g.fill();
    if (head) { g.fillStyle = col || "#2f6fd0"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, 100, [30, 30, 0, 0]); g.fill(); g.fillStyle = "#fff"; g.font = '900 44px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(head, 0, -h / 2 + 52); }
    g.restore(); return true; }
  // Karte MIT Text (Hermann 22.11.2026: Texte saßen nicht mittig im weißen Feld). Zeilen werden im weißen Bereich unter dem Kopf
  // senkrecht und waagrecht zentriert, Schrift schrumpft automatisch auf die Kartenbreite, Text skaliert beim Einploppen mit.
  // infoCard(x, y, w, h, p, head, col, ["Zeile 1", "Zeile 2"], size=36)  -> h darf zu klein sein, wird bei Bedarf vergrößert.
  // Karte bleibt ganz im Bild und frei von den TikTok/YouTube-Buttons rechts (w max. W-214, x wird begrenzt).
  function infoCard(x, y, w, h, p, head, col, lines, size) { lines = [].concat(lines || []); size = size || 36; w = Math.min(w, W - 214); x = clamp(x, w / 2 + 24, W - 190 - w / 2); const k = easeBack(clamp(p, 0, 1)); if (k <= 0) return false;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); let fs = size; g.font = `800 ${fs}px "Montserrat"`;
    const maxW = w - 70, widest = () => Math.max(1, ...lines.map((l) => g.measureText(l).width));
    while (fs > 22 && widest() > maxW) { fs -= 1; g.font = `800 ${fs}px "Montserrat"`; }
    const lh = fs * 1.32, top = head ? 100 : 0, need = top + lines.length * lh + 56; h = Math.max(h, need);
    g.translate(x, y); g.scale(k, k);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-w / 2 + 10, -h / 2 + 12, w, h, 30); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 30); g.fill();
    if (head) { g.fillStyle = col || "#2f6fd0"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, 100, [30, 30, 0, 0]); g.fill(); g.fillStyle = "#fff"; let hs = 44; g.font = `900 ${hs}px "Montserrat"`;
      while (hs > 26 && g.measureText(head).width > maxW) { hs -= 1; g.font = `900 ${hs}px "Montserrat"`; } g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(head, 0, -h / 2 + 52); }
    g.globalAlpha = clamp(p * 2, 0, 1); g.fillStyle = "#1d2250"; g.font = `800 ${fs}px "Montserrat"`; g.textAlign = "center"; g.textBaseline = "middle";
    const mid = -h / 2 + top + (h - top) / 2; lines.forEach((l, i) => g.fillText(l, 0, mid + (i - (lines.length - 1) / 2) * lh + fs * .06));
    g.restore(); return true; }

  // Rate-Frage (Hermann 22.11.2026: Frage ins Video für mehr Kommentare). 2–3 Antwort-Kacheln untereinander, ploppen nacheinander auf.
  // quizTiles(x, y, ["1 km", "5 km", "9 km"], p, { reveal: 0..1, correct: 2 })  -> reveal > 0: richtige Kachel wird grün mit Haken, die anderen verblassen.
  function quizTiles(x, y, opts, p, o) { o = o || {}; const n = opts.length, rh = 112, gap = 22, w = Math.min(o.w || 640, W - 260); x = clamp(x, w / 2 + 24, W - 190 - w / 2);
    const rv = clamp(o.reveal || 0, 0, 1); let fs = 44; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.font = `900 ${fs}px "Montserrat"`;
    while (fs > 26 && Math.max(...opts.map((t) => g.measureText(t).width)) > w - 270) { fs -= 1; g.font = `900 ${fs}px "Montserrat"`; }
    opts.forEach((t, i) => { const k = easeBack(clamp(p * n - i * .6, 0, 1)); if (k <= 0) return; const yy = y + (i - (n - 1) / 2) * (rh + gap), ok = i === o.correct;
      g.save(); g.translate(x, yy); g.scale(k, k); g.globalAlpha = rv > 0 && !ok ? 1 - .55 * rv : 1;
      g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-w / 2 + 8, -rh / 2 + 10, w, rh, 56); g.fill();
      g.fillStyle = rv > 0 && ok ? `rgb(${Math.round(247 - 193 * rv)},${Math.round(244 - 65 * rv)},${Math.round(236 - 110 * rv)})` : "#f7f4ec"; g.beginPath(); g.roundRect(-w / 2, -rh / 2, w, rh, 56); g.fill();
      g.fillStyle = ["#2f6fd0", "#e5484d", "#7a5cff", "#f0a020"][i % 4]; g.beginPath(); g.arc(-w / 2 + 58, 0, 40, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#fff"; g.font = '900 44px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ABCD"[i], -w / 2 + 58, 3);
      g.fillStyle = rv > .5 && ok ? "#fff" : "#1d2250"; g.font = `900 ${fs}px "Montserrat"`; g.fillText(t, 4, 3);
      if (rv > 0 && ok) { g.strokeStyle = "#fff"; g.lineWidth = 14; g.lineCap = "round"; g.lineJoin = "round"; const s2 = easeBack(rv);
        g.beginPath(); g.moveTo(w / 2 - 92, 2); g.lineTo(w / 2 - 70 , 24 * s2); g.lineTo(w / 2 - 36, -26 * s2); g.stroke(); }
      g.restore(); });
    g.restore(); return true; }

  // ---------- three.js Grundgerüst ----------
  const cv3 = document.createElement("canvas"); cv3.width = W; cv3.height = H;
  const R3 = new T.WebGLRenderer({ canvas: cv3, antialias: true, preserveDrawingBuffer: true });
  R3.setPixelRatio(1); R3.setSize(W, H, false);
  R3.outputEncoding = T.sRGBEncoding; R3.toneMapping = T.ACESFilmicToneMapping; R3.toneMappingExposure = .92;
  R3.shadowMap.enabled = true; R3.shadowMap.type = T.PCFSoftShadowMap;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(32, W / H, .1, 120);
  camera.setViewOffset(W, H, 0, H * .04, W, H); // Motiv waagrecht MITTIG (Hermann 16.11.2026: Bild war zu weit links), leicht nach oben wegen Untertitel

  const hemi = new T.HemisphereLight(0xcfe8ff, 0xe9b98a, .75); scene.add(hemi);
  const key = new T.DirectionalLight(0xfff0d8, 1.7); key.position.set(4, 7, 5); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: .5, far: 30 }); key.shadow.radius = 4; key.shadow.bias = -.0006;
  scene.add(key); scene.add(key.target);
  const rimL = new T.DirectionalLight(0xa8d4ff, .9); rimL.position.set(-4, 4, -5); scene.add(rimL);
  const fill = new T.PointLight(0xffc89a, .35, 20); fill.position.set(2, 2, 6); scene.add(fill);

  function canvasTex(w, h, draw) { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t; }
  // ---------- Look v3 (Hermann 23.11.2026: "nicht mehr Details, einfach etwas besser aussehen, flüssiger, Basics wie Augen") ----------
  // Bewusst schlicht: gleiche Figuren und Farben wie bisher, nur sauberer: Augen schauen zusammen in eine Richtung, Kanten leicht gerundet,
  // weicher Bodenschatten unter Figuren, klarere Farben, Bewegungsunschärfe (anim2d.js). Kein Weichzeichner, keine Extra-Deko.
  // Nur zum Vergleich: LOOK=1 node autopilot/v2/render5.js ... rendert den alten Look.
  const LOOK = window.K3_LOOK || 2;
  const _Box = T.BoxGeometry, rbCache = new Map();
  function roundBox(w, h, d, sx, sy, sz) { sx = Math.abs(sx || 1); sy = Math.abs(sy || 1); sz = Math.abs(sz || 1);
    const dims = [w, h, d], sc = [sx, sy, sz], world = dims.map((v, i) => v * sc[i]), r = Math.min(.05, Math.min(...world) * .12);
    const key = [w, h, d, sx, sy, sz].map((v) => v.toFixed(3)).join(); if (rbCache.has(key)) return rbCache.get(key);
    const N = 8, geo = new _Box(w, h, d, N, N, N); if (!(r > 1e-4)) { rbCache.set(key, geo); return geo; }
    const rl = dims.map((v, i) => Math.min(r / sc[i], v * .45)), prof = [0, .3, .7, 1];
    const remap = (c, i) => { const L = dims[i], k = Math.round((c / L + .5) * N); const q = k <= 3 ? prof[k] * rl[i] : k >= 5 ? L - prof[N - k] * rl[i] : L / 2; return q - L / 2; };
    const P = geo.attributes.position, Nn = geo.attributes.normal, v = [0, 0, 0], cl = [0, 0, 0], o = [0, 0, 0];
    for (let j = 0; j < P.count; j++) { v[0] = remap(P.getX(j), 0); v[1] = remap(P.getY(j), 1); v[2] = remap(P.getZ(j), 2);
      for (let i = 0; i < 3; i++) { const hl = dims[i] / 2 - rl[i]; cl[i] = Math.max(-hl, Math.min(hl, v[i])); o[i] = (v[i] - cl[i]) * sc[i]; }
      const ol = Math.hypot(o[0], o[1], o[2]) || 1; for (let i = 0; i < 3; i++) { o[i] /= ol; v[i] = cl[i] + o[i] * r / sc[i]; }
      P.setXYZ(j, v[0], v[1], v[2]); const nx = o[0] * sx, ny = o[1] * sy, nz = o[2] * sz, nl = Math.hypot(nx, ny, nz) || 1; Nn.setXYZ(j, nx / nl, ny / nl, nz / nl); }
    rbCache.set(key, geo); return geo; }
  if (LOOK >= 2) { T.BoxGeometry = function (w, h, d) { return roundBox(w ?? 1, h ?? 1, d ?? 1); }; T.BoxGeometry.prototype = _Box.prototype; }
  // weicher Kontaktschatten unter Figuren am Boden (figur.noBlob = true schaltet ihn ab)
  const blobTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"), r = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(0,0,0,1)"); r.addColorStop(.5, "rgba(0,0,0,.45)"); r.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = r; x.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })();
  const blobMat = new T.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: .3, depthWrite: false, color: 0x2a1a30, fog: false });
  const blobs = []; function blobAt(i) { if (!blobs[i]) { const m = new T.Mesh(new T.PlaneGeometry(1, 1), blobMat); m.rotation.x = -PI / 2; m.renderOrder = -1; scene.add(m); blobs[i] = m; } return blobs[i]; }
  // Look v3 (Hermann 23.11.2026: "darf nicht so nach KI aussehen"): matte Knet-Oberfläche statt glattem Plastik.
  // Etwas rauer und eine ganz feine, unregelmäßige Oberflächenstruktur (wie von Hand geknetet). Glänzend bleiben nur Augen, Metall, Wasser
  // (alles, was mit roughness < .3 angelegt wird) und Flächen mit eigener Textur.
  const clayTex = LOOK >= 2 ? (() => { const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d"); x.fillStyle = "#808080"; x.fillRect(0, 0, 256, 256);
    let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 700; i++) { const r = 3 + rnd() * 14, X = rnd() * 256, Y = rnd() * 256, v = rnd() > .5 ? 255 : 0; for (const [dx, dy] of [[0, 0], [256, 0], [-256, 0], [0, 256], [0, -256]]) {
      const gr = x.createRadialGradient(X + dx, Y + dy, 0, X + dx, Y + dy, r); gr.addColorStop(0, `rgba(${v},${v},${v},.10)`); gr.addColorStop(1, `rgba(${v},${v},${v},0)`); x.fillStyle = gr; x.fillRect(X + dx - r, Y + dy - r, 2 * r, 2 * r); } }
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(2, 2); return t; })() : null;
  const M = (col, o) => { o = o || {}; const clay = LOOK >= 2 && !o.map && (o.roughness ?? .55) >= .3 && !(o.metalness > .3);
    const m = new T.MeshStandardMaterial(Object.assign({ color: col, roughness: .55, metalness: 0 }, o, clay ? { roughness: Math.min(.92, (o.roughness ?? .55) + .15), bumpMap: clayTex, bumpScale: .006 } : {}));
    m.color.convertSRGBToLinear(); if (m.emissive) m.emissive.convertSRGBToLinear(); return m; };
  function mesh(geo, mat, x, y, z, sx, sy, sz) { if (geo === BOX && LOOK >= 2) geo = roundBox(1, 1, 1, sx ?? 1, sy ?? sx ?? 1, sz ?? sx ?? 1); const m = new T.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.scale.set(sx ?? 1, sy ?? sx ?? 1, sz ?? sx ?? 1); m.castShadow = true; m.receiveShadow = true; return m; }
  const SPH = new T.SphereGeometry(1, 48, 32), CYL = new T.CylinderGeometry(1, 1, 1, 32), BOX = new _Box(1, 1, 1);
  const sph = (mat, x, y, z, sx, sy, sz) => mesh(SPH, mat, x, y, z, sx, sy, sz);
  function limb(r, len, mat) { const gq = new T.CylinderGeometry(r, r * .9, len, 24); gq.translate(0, -len / 2, 0); const m = mesh(gq, mat); const cap = sph(mat, 0, -len, 0, r * .95); m.add(cap); return m; }

  // ---------- Welten: "yard" (Garten mit Hundehütte, Baum, Zaun) und "studio" (Infografik: Marineblau, Korallen-Sockel) ----------
  let built = false, yard, studio, skyTex, navyTex, rudi; const builders = [], actors = [];
  function build() {
    built = true;
    skyTex = canvasTex(64, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(.55, "#a9dcff"); gr.addColorStop(1, "#ffe6c4"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    navyTex = canvasTex(64, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#2b2f7a"); gr.addColorStop(1, "#0e1238"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    // Garten
    yard = new T.Group(); scene.add(yard);
    const grassTex = canvasTex(512, 512, (c, w, h) => { c.fillStyle = "#79c25a"; c.fillRect(0, 0, w, h); for (let i = 0; i < 2500; i++) { c.globalAlpha = .18; c.fillStyle = Math.random() > .5 ? "#5aa646" : "#9ad670"; c.beginPath(); c.arc(Math.random() * w, Math.random() * h, 3 + Math.random() * 6, 0, 7); c.fill(); } });
    grassTex.wrapS = grassTex.wrapT = T.RepeatWrapping; grassTex.repeat.set(10, 10);
    const ground = new T.Mesh(new T.CircleGeometry(40, 64), M(0xffffff, { map: grassTex, roughness: .9 })); ground.rotation.x = -PI / 2; ground.receiveShadow = true; yard.add(ground);
    // Weg
    const path = new T.Mesh(new T.CircleGeometry(1, 48), M(0xe9d3a6, { roughness: .95 })); path.rotation.x = -PI / 2; path.scale.set(1.6, 6, 1); path.position.set(.4, .005, 1); path.receiveShadow = true; yard.add(path);
    // Hundehütte
    const house = new T.Group(); house.position.set(-2.4, 0, -2.2); house.rotation.y = .5; yard.add(house);
    house.add(mesh(BOX, M(0xe0503c), 0, .55, 0, 1.3, 1.1, 1.2));
    for (const s of [-1, 1]) { const roof = mesh(BOX, M(0x3b4a8a), 0, 1.28, s * .36, 1.5, .12, .9); roof.rotation.x = s * .62; house.add(roof); }
    const door = mesh(new T.CircleGeometry(.32, 32), M(0x2a1a14, { roughness: 1 }), .651, .45, 0); door.rotation.y = PI / 2; house.add(door);
    house.add(mesh(BOX, M(0x2a1a14), .652, .3, 0, .001, .3, .64));
    // Baum, Büsche, Zaun, Blumen
    const tree = new T.Group(); tree.position.set(2.8, 0, -4.2); yard.add(tree);
    tree.add(mesh(CYL, M(0x8a5a3a), 0, 1.1, 0, .22, 2.2, .22));
    for (const [x, y, z, r] of [[0, 2.7, 0, 1.2], [-.8, 2.2, .3, .85], [.85, 2.3, .2, .9], [0, 3.4, -.2, .8]]) tree.add(sph(M(0x4fae4a), x, y, z, r));
    for (const [x, z, r] of [[-4.5, -3.5, .9], [-3.6, -4.4, .7], [4.6, -2, .8], [5.2, -3, .6], [-5.5, -1, .7]]) yard.add(sph(M(0x5cb84e), x, r * .6, z, r, r * .8, r));
    for (let i = -14; i <= 14; i++) { const x = i * .55; yard.add(mesh(BOX, M(0xfff8ee), x, .6, -6, .22, 1.2, .08)); }
    yard.add(mesh(BOX, M(0xfff8ee), 0, .85, -6.05, 16, .1, .05)); yard.add(mesh(BOX, M(0xfff8ee), 0, .4, -6.05, 16, .1, .05));
    const fc = [0xff6b8a, 0xffd23f, 0xffffff, 0xb08cff];
    for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 3 + (i % 5) * .7; const x = Math.cos(a) * r, z = Math.sin(a) * r - 2.5; if (z > 0 && Math.abs(x) < 2.5) continue; yard.add(sph(M(fc[i % 4]), x, .09, z, .09)); }
    // Studio (Infografiken)
    studio = new T.Group(); scene.add(studio);
    const pedestal = mesh(new T.CylinderGeometry(1.5, 1.6, .3, 64), M(0xff6f61, { roughness: .35 }), 0, -.15, 0); studio.add(pedestal);
    const floorS = new T.Mesh(new T.CircleGeometry(30, 64), M(0x1a1f55, { roughness: .6 })); floorS.rotation.x = -PI / 2; floorS.position.y = -.3; floorS.receiveShadow = true; studio.add(floorS);
    for (let i = 0; i < 40; i++) { const a = i * 1.7, r = 4 + (i % 7) * 1.3; studio.add(sph(M(0xffffff, { emissive: 0x8fa0ff, emissiveIntensity: .6 }), Math.cos(a) * r, 1 + (i % 5) * 1.1, Math.sin(a) * r - 4, .04 + (i % 3) * .02)); }
    rudi = actor(makeRudi(), "Rudi");
    builders.forEach((f) => f());
  }

  // ---------- Rudi in 3D (gelbe Regenjacke, rote Mütze, Jeans) ----------
  function makeRudi() {
    const yel = M(0xffc928, { roughness: .4 }), jeans = M(0x3b6db3, { roughness: .8 }), skin = M(0xf3c39d), red = M(0xe23b3b, { roughness: .7 }), shoe = M(0x5a3a2a), eyeW = M(0xffffff, { roughness: .15 }), pupil = M(0x161018, { roughness: .1 });
    const metal = M(0xc5ced8, { metalness: .9, roughness: .28 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const legs = []; for (const s of [-1, 1]) { const l = limb(.1, .62, jeans); l.position.set(0, .7, s * .13); const sh = sph(shoe, .07, -.64, 0, .14, .08, .1); l.add(sh); body.add(l); legs.push(l); }
    const coatG = new T.CylinderGeometry(.27, .37, .78, 40); const coat = mesh(coatG, yel, 0, 1.02, 0); body.add(coat);
    const shoulders = sph(yel, 0, 1.38, 0, .29, .14, .31); body.add(shoulders);
    for (let i = 0; i < 3; i++) body.add(sph(M(0x2b62c9), .3 - i * .012, 1.25 - i * .18, 0, .03));
    const arms = []; for (const s of [-1, 1]) { const a = limb(.075, .56, yel); a.position.set(0, 1.36, s * .33); const hand = sph(skin, 0, -.62, 0, .085); a.add(hand); body.add(a); arms.push(a); }
    const head = new T.Group(); head.position.set(0, 1.74, 0); body.add(head);
    head.add(sph(skin, 0, 0, 0, .31));
    head.add(sph(skin, .29, -.02, 0, .06, .055, .06));
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.25, .06, s * .11); head.add(e);
      if (LOOK < 2) { e.add(sph(eyeW, 0, 0, 0, .085, .1, .085)); e.add(sph(pupil, .06, 0, 0, .048)); e.add(sph(M(0xffffff, { emissive: 0xffffff }), .1, .03, -.01 * s, .014)); }
      else { // Look v3: Auge sitzt flacher im Gesicht, Pupille als Scheibe vorn auf dem Augapfel, beide Pupillen schauen leicht zur Mitte (kein Silberblick),
        // Glanzpunkt bei beiden Augen auf derselben Seite (oben, zum Licht)
        e.position.set(.232, .06, s * .112); e.rotation.y = s * .32; // Auge folgt der Kopfrundung
        e.add(sph(eyeW, 0, 0, 0, .07, .1, .082)); const pv = new T.Group(); pv.rotation.y = -s * .2; e.add(pv); // Pupille zur Nase gedreht
        pv.add(sph(pupil, .05, 0, 0, .03, .06, .054)); pv.add(sph(M(0xffffff, { emissive: 0xffffff }), .074, .026, .016, .012, .016, .016)); }
      eyes.push(e); }
    const smile = mesh(new T.TorusGeometry(.08, .016, 8, 24, PI), M(0x6a2a20), .27, -.13, 0); smile.rotation.set(0, PI / 2, PI); head.add(smile);
    const oMouth = sph(M(0x5a1a22), .28, -.14, 0, .03, .05, .045); head.add(oMouth);
    // Mütze sitzt OBERHALB der Augen (Augen-Oberkante y ≈ .16, Mützenrand ab y ≈ .17), Hermann 16.11.2026
    const hat = new T.Group(); hat.position.y = .22; head.add(hat);
    hat.add(mesh(new T.SphereGeometry(.315, 40, 20, 0, 2 * PI, 0, PI / 2), red, 0, 0, 0, 1, .9, 1));
    const band = mesh(new T.TorusGeometry(.305, .045, 12, 40), red, 0, 0, 0); band.rotation.x = PI / 2; hat.add(band);
    hat.add(sph(M(0xffffff, { roughness: .9 }), 0, .32, 0, .08));
    // Rüstung
    const armor = new T.Group(); body.add(armor);
    armor.add(mesh(new T.CylinderGeometry(.31, .4, .82, 40), metal, 0, 1.02, 0));
    armor.add(sph(metal, 0, 1.4, 0, .33, .16, .35));
    for (const s of [-1, 1]) { armor.add(sph(metal, 0, 1.4, s * .34, .14)); }
    const helmet = new T.Group(); head.add(helmet);
    // Offener Ritterhelm: Kuppel über der Stirn + Wangenschutz an den Seiten, Gesicht und Augen bleiben frei (kein Visier!)
    helmet.add(mesh(new T.SphereGeometry(.34, 40, 20, 0, 2 * PI, 0, PI / 2), metal, 0, .2, 0, 1, .95, 1));
    const rim = mesh(new T.TorusGeometry(.33, .035, 12, 40), metal, 0, .2, 0); rim.rotation.x = PI / 2; helmet.add(rim);
    for (const s of [-1, 1]) helmet.add(sph(metal, -.1, .0, s * .27, .12, .2, .07));
    helmet.add(sph(metal, -.2, .02, 0, .14, .24, .26));
    const plume = sph(M(0xe23b3b), -.05, .62, 0, .1, .2, .05); helmet.add(plume);
    const armM = [];
    return { root, body, legs, arms, head, eyes, smile, oMouth, hat, armor, helmet, coat, shoulders, yel, metal, jeans };
  }
  function poseRudi(R, t, o) {
    o = o || {};
    const arm = o.arms || [0, 0], spread = o.spread || 0;
    R.arms.forEach((a, i) => { const s = i ? 1 : -1; const wv = o.wave && i === 1 ? Math.sin(t * 10) * .35 : 0; a.rotation.set(-s * (spread + .08) + wv * s, 0, arm[i]); });
    const walk = o.walk || 0; R.legs.forEach((l, i) => { l.rotation.z = Math.sin(t * 8 + i * PI) * .5 * walk; });
    R.body.position.y = Math.abs(Math.cos(t * 8)) * .05 * walk + Math.sin(t * 2) * .006;
    R.body.rotation.z = o.lean || 0;
    R.head.rotation.z = (o.nod || 0) + Math.sin(t * 1.7) * .03; R.head.rotation.x = o.tilt || 0;
    const blink = Math.sin(t * 1.9 + 2) > .985 ? .15 : 1; R.eyes.forEach((e) => e.scale.set(1, blink * (o.wide ? 1.2 : 1), 1));
    R.smile.visible = o.mouth !== "o"; R.oMouth.visible = o.mouth === "o";
    const arm0 = !!o.armor; R.armor.visible = arm0; R.helmet.visible = arm0; R.hat.visible = !arm0; R.coat.visible = !arm0; R.shoulders.visible = !arm0;
    R.arms.forEach((a) => a.material = arm0 ? R.metal : R.yel); R.legs.forEach((l) => l.material = arm0 ? R.metal : R.jeans);
  }


  // ---------- Kamera + Bild ----------
  function world(which) { const y = which === "yard"; yard.visible = y; studio.visible = !y; scene.background = y ? skyTex : navyTex; scene.fog = y ? new T.Fog(0xcfe9ff, 14, 40) : new T.Fog(0x141a4a, 10, 34); hemi.intensity = y ? .75 : .55; }
  function actor(o, name) { o.name = name || o.name || "figur" + actors.length; actors.push(o); scene.add(o.root); return o; }
  // ---------- Automatische Prüfung (Hermann 16.11.2026: Figuren überlappten, Bild zu weit links) ----------
  // Bei jedem draw(): Stecken zwei sichtbare Figuren ineinander oder ist eine Figur seitlich angeschnitten,
  // erscheint in der Konsole von render5.js eine Zeile "[page] [3D-Check] ...". Jede solche Zeile muss vor dem Rendern behoben werden.
  // Sichere Zone für TikTok UND YouTube Shorts (1080×1920): rechts ~190 px Buttons, unten ~420 px Titel/Caption, oben ~150 px
  const SAFE = { l: 40, r: W - 190 };
  const _bx = new T.Box3(), _v = new T.Vector3(); const warned = new Set();
  function boxOf(root) { const b = new T.Box3(); root.updateMatrixWorld(true);
    root.traverseVisible((m) => { if (!m.isMesh) return; if (!m.geometry.boundingBox) m.geometry.computeBoundingBox(); _bx.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld); b.union(_bx); }); return b; }
  function shrink(b, f) { const c = b.getCenter(new T.Vector3()), sz = b.getSize(new T.Vector3()).multiplyScalar(f / 2); return new T.Box3(c.clone().sub(sz), c.clone().add(sz)); }
  function warn(msg) { const k = msg + "@" + Math.floor(KZ.t); if (warned.has(k)) return; warned.add(k); console.error("[3D-Check] t=" + KZ.t.toFixed(1) + "s " + msg); }
  function check() {
    const all = actors.filter((a) => a.root.visible), boxes = new Map(all.map((a) => [a, boxOf(a.root)])); const vis = all.filter((a) => !a.noCheck), bs = vis.map((a) => boxes.get(a));
    for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) if (shrink(bs[i], .8).intersectsBox(shrink(bs[j], .8))) warn("Überlappung: " + vis[i].name + " steckt in " + vis[j].name);
    camera.updateMatrixWorld(); vis.forEach((a, i) => { const b = bs[i]; let x0 = 1e9, x1 = -1e9;
      for (let k = 0; k < 8; k++) { _v.set(k & 1 ? b.max.x : b.min.x, k & 2 ? b.max.y : b.min.y, k & 4 ? b.max.z : b.min.z).project(camera); if (_v.z > 1) continue; const x = (_v.x + 1) / 2 * W; x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
      if (x1 - x0 < W * .8 && (x0 < SAFE.l || x1 > SAFE.r)) warn("außerhalb der sicheren Zone: " + a.name + " ragt " + (x0 < SAFE.l ? "links aus dem Bild" : "rechts in die TikTok/YouTube-Buttons") + " (x " + Math.round(x0) + "–" + Math.round(x1) + ", erlaubt " + SAFE.l + "–" + SAFE.r + ")"); });
    return boxes;
  }
  function hideAll() { actors.forEach((a) => a.root.visible = false); }
  let ZK = 2.2; // Hochformat ist schmal: alle Kamera-Abstände werden mit ZK gestreckt (1.9 = Figuren ganz im Bild)
  function view(px, py, pz, tx, ty, tz, fov, t) {
    const Z = ZK; px = tx + (px - tx) * Z; py = ty + (py - ty) * Z; pz = tz + (pz - tz) * Z;
    const f = .06; camera.position.set(px + Math.sin(t * .7) * f, py + Math.cos(t * .55) * f, pz); camera.fov = fov || 32; camera.updateProjectionMatrix(); camera.lookAt(tx, ty, tz);
  }
  // Auto-Kamera: frameOn([figuren], {az, el, fill, fov, dy, t}) setzt die Kamera so, dass alle genannten Figuren zusammen
  // waagrecht mittig in der sicheren Zone stehen (TikTok + YouTube Shorts) und nicht angeschnitten sind.
  // az = Blickwinkel um die Hochachse (0 = Kamera vorn bei +z, positiv = von rechts/+x), el = Höhe (rad), fill = Anteil der sicheren Breite (.6–.9).
  // Für Kamerafahrten az/fill mit lerp über den Beat ändern (fill größer = näher dran).
  function frameOn(list, o) { o = o || {}; const az = o.az ?? .15, el = o.el ?? .14, fill = o.fill ?? .8, fov = o.fov || 32, t = o.t || 0;
    const b = new T.Box3(); list.forEach((a) => b.union(boxOf(a.root || a)));
    const c = b.getCenter(new T.Vector3()); const Rv = new T.Vector3(Math.cos(az), 0, -Math.sin(az)); let r0 = 1e9, r1 = -1e9;
    for (let k = 0; k < 8; k++) { _v.set(k & 1 ? b.max.x : b.min.x, k & 2 ? b.max.y : b.min.y, k & 4 ? b.max.z : b.min.z); const d = _v.clone().sub(c).dot(Rv); r0 = Math.min(r0, d); r1 = Math.max(r1, d); }
    const wid = r1 - r0, hgt = b.max.y - b.min.y, vf = fov * PI / 360, hf = Math.atan(Math.tan(vf) * W / H), safeW = (SAFE.r - SAFE.l) / W;
    const dist = Math.max(wid / 2 / Math.tan(hf) / (safeW * fill), hgt / 2 / Math.tan(vf) / .6) + (b.max.z - b.min.z) * .3;
    const tg = c.clone().add(Rv.clone().multiplyScalar((r0 + r1) / 2)); tg.y += (o.dy || 0);
    // Motiv halb zwischen Bildmitte (540) und Mitte der sicheren Zone (465) setzen: wirkt mittig und bleibt frei von den Buttons
    const shiftPx = (W / 2 - (SAFE.l + SAFE.r) / 2) * .5, worldPerPx = 2 * dist * Math.tan(hf) / W; tg.add(Rv.clone().multiplyScalar(shiftPx * worldPerPx));
    const f = .05 * dist / 5; camera.position.set(tg.x + Math.sin(az) * Math.cos(el) * dist + Math.sin(t * .7) * f, tg.y + Math.sin(el) * dist + Math.cos(t * .55) * f, tg.z + Math.cos(az) * Math.cos(el) * dist);
    camera.fov = fov; camera.updateProjectionMatrix(); camera.lookAt(tg); }
  const _ctr = new T.Vector3(), _sz = new T.Vector3();
  function draw() { key.target.position.set(0, 0, 0); const boxes = check(); let nb = 0;
    if (LOOK >= 2) { window.KZ.bloomAmt = .12; actors.forEach((a) => { if (!a.root.visible || a.noBlob) return; const b = boxes.get(a); if (!b || b.isEmpty() || b.min.y > .2 || b.min.y < -.35) return;
      b.getCenter(_ctr); b.getSize(_sz); const m = blobAt(nb++); m.visible = true; m.position.set(_ctr.x, Math.max(b.min.y, 0) + .012, _ctr.z); m.scale.set(_sz.x * 1.15 + .15, _sz.z * 1.15 + .15, 1); }); }
    for (let i = nb; i < blobs.length; i++) blobs[i].visible = false;
    R3.render(scene, camera); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = LOOK >= 2 ? "contrast(1.06) saturate(1.1)" : "none";
    const mb = window.__MB; if (mb) { // Bewegungsunschärfe nur fürs 3D-Bild: Zwischenbilder mitteln, 2D-Texte danach bleiben scharf
      if (!draw.acc) { draw.acc = document.createElement("canvas"); draw.acc.width = W; draw.acc.height = H; draw.ax = draw.acc.getContext("2d"); }
      const ax = draw.ax; ax.globalAlpha = 1 / (mb.k + 1); ax.drawImage(cv3, 0, 0); if (mb.k === mb.n - 1) g.drawImage(draw.acc, 0, 0); }
    else g.drawImage(cv3, 0, 0); g.filter = "none"; }
  function begin(which) { if (!built) build(); hideAll(); world(which); }
  // Augen-Baustein für Tiere (Look v3, Hermann 23.11.2026: "die Basics müssen stimmen, wie Augen"):
  // eye(r) -> Gruppe mit Augapfel, Pupille (Scheibe, ca. 55 % des Augapfels) und Glanzpunkt oben. Blickrichtung lokal +x.
  // aimEyes([auge1, auge2], punkt) dreht die Pupillen beider Augen auf denselben Punkt (z. B. K3.camera.position = schaut in die Kamera,
  // oder die Welt-Position des anderen Tiers). So schielt nichts und beide Augen schauen immer gemeinsam.
  function eye(r, o) { o = o || {}; const e = new T.Group(), pv = new T.Group(); e.add(sph(o.white || M(0xffffff, { roughness: .15 }), 0, 0, 0, r * .9, r, r)); e.add(pv);
    pv.add(sph(o.pupil || M(0x161018, { roughness: .1 }), r * .62, 0, 0, r * .4, r * .58, r * .55)); pv.add(sph(M(0xffffff, { emissive: 0xffffff }), r * .9, r * .28, r * .18, r * .13, r * .17, r * .17));
    e.userData.pv = pv; return e; }
  const _q = new T.Vector3(), _m4 = new T.Matrix4();
  function aimEyes(list, target, max) { max = max ?? .5; list.forEach((e) => { const pv = e.userData.pv; if (!pv) return; e.updateMatrixWorld(true); _q.copy(target); e.worldToLocal(_q);
    const yaw = clamp(Math.atan2(-_q.z, _q.x), -max, max), pitch = clamp(Math.atan2(_q.y, Math.hypot(_q.x, _q.z)), -max * .7, max * .7); pv.rotation.set(0, yaw, pitch); }); }
  const place = (o, x, z, ry) => { o.root.visible = true; o.root.position.set(x, 0, z); o.root.rotation.y = ry || 0; };

  window.K3 = { T, PI, scene, camera, R3, key, hemi, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, infoCard, quizTiles, poseRudi, makeRudi, view, draw, begin, place, actor, frameOn, eye, aimEyes,
    onBuild(f) { builders.push(f); }, get rudi() { return rudi; }, get yard() { return yard; }, get studio() { return studio; },
    get zoom() { return ZK; }, set zoom(z) { ZK = z; }, look: LOOK };
})();
