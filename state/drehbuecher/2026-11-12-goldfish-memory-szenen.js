// Szenendatei "Goldfish Don't Forget In 3 Seconds" (Goldfisch, Carassius auratus). Mix-Stil (Hermann 12.11.2026).
// Quellen: Live Science 2021 "Do goldfish really have a 3-second memory?" (Culum Brown, Macquarie University:
// "there are thousands of studies [on goldfish] that show fish have excellent memories"; gut gehaltene Goldfische können 20 Jahre alt werden),
// Phil Gee, Plymouth University (Hebel-Futter-Versuch, Futter nur 1 Stunde pro Tag, Guardian 2003),
// RSPCA Australia "How should I care for my goldfish?" (mind. 50 Liter, Filter, Glas-Goldfischkugeln zu klein; viel Abfall).
// Helfer txt/stamp/navy/rudi/at/sparkle aus duck-bread/hedgehog übernommen (Rudi bleibt gleich), Goldfisch neu gezeichnet.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86",
    gold: "#ff8a1f", goldL: "#ffb84a", goldD: "#e8611c", fin: "#ff9a3c", belly: "#ffd27a",
    water: "rgba(90,190,240,.42)", glass: "rgba(210,240,255,.14)", wood: "#8a4e3a", woodT: "#a8634a", plant: "#2fae6a", plantD: "#1f8a52" };
  // ---------- Text in Bildschirmkoordinaten ----------
  function txt(s, x, y, size, col, o) { o = o || {}; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = o.a ?? 1; g.font = `${o.w || 800} ${size}px "Montserrat"`; g.textAlign = o.align || "center"; g.textBaseline = "middle";
    if (o.stroke) { g.lineJoin = "round"; g.lineWidth = o.stroke; g.strokeStyle = "rgba(0,0,0,.75)"; g.strokeText(s, x, y); } g.fillStyle = col; g.fillText(s, x, y); g.restore(); }
  // Stempel/Schild (leicht schräg, springt rein)
  function stamp(s, x, y, p, col, rot) { if (p <= 0) return; p = Math.min(p, 1); const k = easeBack(p); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(rot ?? -.08); g.scale(k * (1 + (1 - p) * .6), k * (1 + (1 - p) * .6)); g.globalAlpha = clamp(p * 3, 0, 1);
    g.font = '900 64px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; const w = g.measureText(s).width + 70;
    g.fillStyle = "rgba(10,10,30,.35)"; g.beginPath(); g.roundRect(-w / 2 + 8, -50 + 10, w, 100, 22); g.fill();
    g.fillStyle = col; g.beginPath(); g.roundRect(-w / 2, -50, w, 100, 22); g.fill();
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 6; g.beginPath(); g.roundRect(-w / 2 + 10, -40, w - 20, 80, 16); g.stroke();
    g.fillStyle = "#fff"; g.fillText(s, 0, 4); g.restore(); }
  function navy(t, tint) { // Infografik-Hintergrund
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, tint ? "#1b4a4a" : "#232a6b"); bg.addColorStop(1, tint ? "#0b2228" : "#0d1236"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = "rgba(255,255,255,.07)"; for (let y = 40; y < H; y += 60) for (let x = 30; x < W; x += 60) { g.beginPath(); g.arc(x + Math.sin(t * .5) * 6, y, 3, 0, 7); g.fill(); }
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .5, H * .4, 700, tint ? "rgba(80,220,180,.18)" : "rgba(120,140,255,.2)"); g.restore();
  }
  // ---------- Rudi (eigene Menschenfigur): Füße bei y=0, Höhe ~540, schaut nach rechts ----------
  function rudi(c, o) { const t = o.t || 0, br = Math.sin(t * 2.2) * 4, arm = o.arm ?? 0;
    c.save();
    // Beine
    c.strokeStyle = C.jeans; c.lineWidth = 30; c.lineCap = "round"; for (const x of [-26, 26]) { c.beginPath(); c.moveTo(x, -130); c.lineTo(x + 4, -16); c.stroke(); }
    c.fillStyle = "#2a2233"; for (const x of [-26, 26]) { c.beginPath(); c.ellipse(x + 16, -8, 30, 13, 0, 0, 7); c.fill(); }
    // hinterer Arm
    c.strokeStyle = C.coatD; c.lineWidth = 28; c.beginPath(); c.moveTo(-40, -330 + br); c.quadraticCurveTo(-74, -250, -54, -190); c.stroke();
    // Regenjacke
    kshape(c, (c) => { c.beginPath(); c.moveTo(-82, -120); c.bezierCurveTo(-96, -260, -78, -350 + br, 0, -352 + br); c.bezierCurveTo(78, -350 + br, 96, -260, 82, -120); c.quadraticCurveTo(0, -100, -82, -120); c.closePath(); }, C.coat, { rim: "rgba(255,245,200,.7)", shadow: "rgba(90,40,10,.25)", rw: 7, sw: 22 });
    c.fillStyle = "#e09a22"; c.fillRect(-4, -340 + br, 8, 220); c.fillStyle = "#fff6"; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(16, -300 + i * 60 + br, 6, 0, 7); c.fill(); }
    // Kopf
    c.save(); c.translate(0, br);
    kshape(c, ell(6, -430, 80, 78, 0), C.skin, { rim: "rgba(255,240,225,.8)", shadow: "rgba(150,60,40,.22)", rw: 6, sw: 18 });
    c.fillStyle = "rgba(240,120,110,.35)"; c.beginPath(); c.ellipse(60, -400, 16, 10, 0, 0, 7); c.fill();
    // Mütze
    kshape(c, (c) => { c.beginPath(); c.moveTo(-76, -440); c.bezierCurveTo(-80, -530, 90, -530, 86, -440); c.closePath(); }, C.hat, { rim: "rgba(255,200,200,.6)", rw: 5, sw: 12 });
    c.fillStyle = "#c23238"; c.beginPath(); c.roundRect(-80, -456, 168, 26, 13); c.fill();
    kshape(c, ell(4, -522, 20, 20, 0), "#fff1e8", { rw: 3, sw: 6 });
    fig.eye(c, 28, -418, 15, { t, seed: 3, look: o.look ?? .5 }); fig.eye(c, 66, -418, 15, { t, seed: 3, look: o.look ?? .5 });
    // Mund
    c.strokeStyle = "#7a2a2a"; c.lineWidth = 6; c.lineCap = "round"; c.fillStyle = "#7a2a2a";
    if (o.mouth === "o") { c.beginPath(); c.ellipse(52, -378, 10, 13, 0, 0, 7); c.fill(); }
    else if (o.mouth === "grin") { c.beginPath(); c.moveTo(30, -384); c.quadraticCurveTo(52, -350, 76, -386); c.closePath(); c.fill(); c.fillStyle = "#fff"; c.fillRect(36, -384, 34, 7); }
    else if (o.mouth === "hmm") { c.beginPath(); c.moveTo(36, -378); c.lineTo(70, -384); c.stroke(); }
    else { c.beginPath(); c.arc(52, -392, 20, .3, 2.8); c.stroke(); }
    c.restore();
    // vorderer Arm (arm: 0 unten, 1 nach vorn oben werfen, 2 an den Kopf kratzen)
    const sx = 30, sy = -330 + br; let hx, hy;
    if (arm >= 1.5) { const k = arm - 1.5; hx = lerp(80, 40, k * 2); hy = lerp(-200, -500, clamp(k * 2, 0, 1)) + Math.sin(t * 14) * 6 * clamp(k * 2, 0, 1); }
    else { const a = lerp(1.35, -.6, clamp(arm, 0, 1)); hx = sx + Math.cos(a) * 150; hy = sy + Math.sin(a) * 150; }
    c.strokeStyle = C.coat; c.lineWidth = 30; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2 + 20, (sy + hy) / 2 + 20, hx, hy); c.stroke();
    c.fillStyle = C.skin; c.beginPath(); c.arc(hx, hy, 20, 0, 7); c.fill();
    if (o.hold === "flakes") flakes(c, hx + 10, hy - 30, .5);
    c.restore(); return { hx, hy }; }
  function at(fn, x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); fn(g, o); g.restore(); }
  function sparkle(x, y, r, a) { g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, r * 2.4, `rgba(255,230,140,${.6 * a})`); g.fillStyle = `rgba(255,250,220,${a})`; g.beginPath(); for (let i = 0; i < 8; i++) { const ang = i / 8 * 6.283, rr = i % 2 ? r * .3 : r; g.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } g.fill(); g.restore(); }

  // ---------- Futterdose (für Rudi) ----------
  function flakes(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s);
    kshape(c, (c) => { c.beginPath(); c.roundRect(-50, -70, 100, 140, 14); }, "#2fae6a", { rim: "rgba(220,255,230,.6)", rw: 4, sw: 10 });
    c.fillStyle = "#e5484d"; c.beginPath(); c.roundRect(-56, -86, 112, 28, 10); c.fill();
    c.fillStyle = "#ff8a1f"; c.beginPath(); c.ellipse(0, 4, 26, 16, 0, 0, 7); c.fill(); c.beginPath(); c.moveTo(-20, 4); c.lineTo(-40, -10); c.lineTo(-40, 18); c.fill(); c.restore(); }

  // ---------- Goldfisch (Carassius auratus), Seitenansicht, Kopf rechts, Mitte bei 0,0, Länge ~380 ----------
  function gold(c, o) {
    const t = o.t || 0, seed = o.seed || 0, sw = Math.sin(t * (o.fast ? 11 : 6) + seed) * (o.fast ? .26 : .16), br = 1 + Math.sin(t * 2.6 + seed) * .015;
    c.save(); c.scale(br, 1 / br);
    // Schwanzflosse (gegabelt, halb durchsichtig)
    c.save(); c.translate(-118, 0); c.rotate(sw);
    const tail = (c) => { c.beginPath(); c.moveTo(0, -18); c.bezierCurveTo(-40, -40, -90, -96, -128, -92); c.quadraticCurveTo(-96, -40, -74, 0); c.quadraticCurveTo(-96, 40, -128, 92); c.bezierCurveTo(-90, 96, -40, 40, 0, 18); c.closePath(); };
    c.globalAlpha = .92; kshape(c, tail, C.fin, { rim: "rgba(255,235,190,.7)", shadow: "rgba(150,40,0,.25)", rw: 5, sw: 10 });
    c.strokeStyle = "rgba(200,70,10,.35)"; c.lineWidth = 3; for (let i = -3; i <= 3; i++) { if (!i) continue; c.beginPath(); c.moveTo(-8, i * 4); c.quadraticCurveTo(-60, i * 14, -105 + Math.abs(i) * 4, i * 26); c.stroke(); }
    c.restore();
    // Rückenflosse
    c.save(); c.translate(-20, -78); c.rotate(Math.sin(t * 3 + seed) * .05);
    kshape(c, (c) => { c.beginPath(); c.moveTo(-70, 30); c.quadraticCurveTo(-50, -50, -10, -54); c.quadraticCurveTo(30, -30, 60, 14); c.closePath(); }, C.fin, { rim: "rgba(255,235,190,.6)", rw: 4, sw: 8 });
    c.strokeStyle = "rgba(200,70,10,.35)"; c.lineWidth = 3; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-50 + i * 24, 26); c.lineTo(-40 + i * 16, -36 + i * 9); c.stroke(); }
    c.restore();
    // Afterflosse + Bauchflosse
    kshape(c, (c) => { c.beginPath(); c.moveTo(-96, 44); c.quadraticCurveTo(-104, 88 + sw * 30, -78, 96); c.quadraticCurveTo(-64, 70, -54, 56); c.closePath(); }, C.fin, { rw: 3, sw: 6 });
    kshape(c, (c) => { c.beginPath(); c.moveTo(-6, 70); c.quadraticCurveTo(-4, 110 + sw * 20, 22, 112); c.quadraticCurveTo(26, 90, 26, 72); c.closePath(); }, C.fin, { rw: 3, sw: 6 });
    // Körper (hochrückig)
    const body = (c) => { c.beginPath(); c.moveTo(152, 6); c.bezierCurveTo(140, -62, 50, -100, -30, -88); c.bezierCurveTo(-80, -80, -112, -46, -124, -16); c.lineTo(-124, 16); c.bezierCurveTo(-110, 52, -70, 82, -10, 84); c.bezierCurveTo(70, 86, 140, 64, 152, 6); c.closePath(); };
    kshape(c, body, C.gold, { rim: "rgba(255,240,180,.8)", shadow: "rgba(160,40,0,.28)", rw: 7, sw: 18 });
    c.save(); body(c); c.clip();
    c.fillStyle = C.belly; c.globalAlpha = .55; c.beginPath(); c.ellipse(10, 70, 150, 40, 0, 0, 7); c.fill(); c.globalAlpha = 1;
    c.fillStyle = C.goldL; c.globalAlpha = .45; c.beginPath(); c.ellipse(110, -10, 50, 60, 0, 0, 7); c.fill(); c.globalAlpha = 1;
    c.strokeStyle = "rgba(190,60,0,.3)"; c.lineWidth = 3.5; // Schuppen
    for (let r = 0; r < 7; r++) for (let k = 0; k < 8; k++) { const x = -96 + k * 26 + (r % 2) * 13, y = -66 + r * 21; if (x > 70) continue; c.beginPath(); c.arc(x, y, 13, -1.25, 1.25); c.stroke(); }
    c.strokeStyle = "rgba(255,240,200,.35)"; c.lineWidth = 3; c.beginPath(); c.moveTo(80, -14); c.quadraticCurveTo(0, -24, -110, -4); c.stroke(); // Seitenlinie
    c.restore();
    // Kiemendeckel
    c.strokeStyle = "rgba(180,50,0,.45)"; c.lineWidth = 6; c.lineCap = "round"; c.beginPath(); c.moveTo(84, -50); c.quadraticCurveTo(62, 0, 82, 54); c.stroke();
    // Brustflosse
    c.save(); c.translate(56, 28); c.rotate(.5 + Math.sin(t * 5 + seed) * .25);
    c.globalAlpha = .9; kshape(c, (c) => { c.beginPath(); c.moveTo(0, -8); c.quadraticCurveTo(-36, 8, -50, 34); c.quadraticCurveTo(-18, 30, 4, 10); c.closePath(); }, C.fin, { rw: 3, sw: 5 }); c.restore();
    // Auge + Maul
    fig.eye(c, 108, -24, 25, { t, seed, look: o.look ?? .4, mood: o.mood, lid: C.goldD });
    const m = o.mouth ?? (.5 + .5 * Math.sin(t * 4 + seed));
    c.fillStyle = "#b23a12"; c.beginPath(); c.ellipse(150, 10, 6 + m * 4, 4 + m * 8, 0, 0, 7); c.fill();
    c.fillStyle = "rgba(255,200,170,.6)"; c.beginPath(); c.ellipse(130, 24, 12, 7, 0, 0, 7); c.fill();
    c.restore();
  }
  // Fisch mit Wende: dir -1..1 (glatt), damit er sich umdreht statt zu springen
  function fishAt(x, y, s, o, dir) { g.save(); g.translate(x, y); g.scale(s * (dir ?? 1), s); gold(g, o); g.restore(); }
  function bubbles(x, y, n, t, a) { g.save(); g.globalAlpha = a ?? 1; g.strokeStyle = "rgba(230,250,255,.85)"; g.lineWidth = 4; for (let i = 0; i < n; i++) { const q = (t * .6 + i / n) % 1; g.beginPath(); g.arc(x + Math.sin(q * 9 + i) * 8, y - q * 160, 6 + i % 3 * 3, 0, 7); g.stroke(); } g.restore(); }

  // ---------- Glas-Goldfischkugel, Boden bei y=0, Innenraum Kreis (0,-170) r=170 ----------
  function bowl(c, x, y, s, o, inner) { o = o || {}; const t = o.t || 0, murk = o.murk || 0; c.save(); c.translate(x, y); c.scale(s, s);
    const globe = (c) => { c.beginPath(); c.arc(0, -170, 170, -1.1, Math.PI + 1.1, false); c.closePath(); };
    c.fillStyle = "rgba(0,0,10,.25)"; c.beginPath(); c.ellipse(10, 4, 150, 16, 0, 0, 7); c.fill();
    c.fillStyle = C.glass; globe(c); c.fill();
    c.save(); globe(c); c.clip();
    const wl = -290 + Math.sin(t * 2) * 4;
    const wg = c.createLinearGradient(0, wl, 0, 0); wg.addColorStop(0, `rgba(${lerp(110, 120, murk)},${lerp(205, 150, murk)},${lerp(245, 70, murk)},.55)`); wg.addColorStop(1, `rgba(${lerp(40, 80, murk)},${lerp(130, 100, murk)},${lerp(210, 40, murk)},.7)`);
    c.fillStyle = wg; c.fillRect(-200, wl, 400, 400);
    c.fillStyle = "#6a5a8a"; for (let i = 0; i < 16; i++) { c.beginPath(); c.arc(-150 + i * 20, -10 - (i % 3) * 6, 16, 0, 7); c.fill(); }
    c.fillStyle = "#8a7aaa"; for (let i = 0; i < 12; i++) { c.beginPath(); c.arc(-130 + i * 24, -18 - (i % 2) * 8, 9, 0, 7); c.fill(); }
    if (inner) inner(c);
    if (murk > 0) { c.fillStyle = `rgba(110,120,40,${murk * .45})`; c.fillRect(-200, wl, 400, 400); c.fillStyle = `rgba(70,60,30,${murk * .8})`; for (let i = 0; i < 26; i++) { const q = (i * .37 + t * .05) % 1; c.beginPath(); c.arc(-140 + (i * 53) % 280, wl + 20 + q * 260, 4 + i % 3 * 2, 0, 7); c.fill(); } }
    c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 4; c.beginPath(); c.moveTo(-160, wl); c.lineTo(160, wl); c.stroke();
    c.restore();
    // Glas: Rand + Glanz
    c.strokeStyle = "rgba(220,245,255,.55)"; c.lineWidth = 8; globe(c); c.stroke();
    c.fillStyle = "rgba(220,245,255,.35)"; c.beginPath(); c.ellipse(0, -318, 76, 14, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(255,255,255,.75)"; c.lineWidth = 6; c.stroke();
    c.save(); c.globalCompositeOperation = "lighter"; c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 14; c.lineCap = "round"; c.beginPath(); c.arc(0, -170, 140, -2.7, -2.0); c.stroke(); c.lineWidth = 7; c.beginPath(); c.arc(0, -170, 140, -1.85, -1.65); c.stroke(); c.restore();
    c.restore(); }

  // ---------- Aquarium mit Filter, Pflanzen, Höhle; Boden bei y=0 ----------
  function tank(c, x, y, w, h, o, inner) { o = o || {}; const t = o.t || 0; c.save(); c.translate(x, y);
    c.fillStyle = "rgba(0,0,10,.3)"; c.beginPath(); c.ellipse(0, 6, w * .55, 18, 0, 0, 7); c.fill();
    const wg = c.createLinearGradient(0, -h, 0, 0); wg.addColorStop(0, "#5ec4ee"); wg.addColorStop(1, "#1f6fb0"); c.fillStyle = wg; c.fillRect(-w / 2, -h, w, h);
    c.save(); c.beginPath(); c.rect(-w / 2, -h, w, h); c.clip();
    c.save(); c.globalCompositeOperation = "lighter"; for (let i = 0; i < 4; i++) { c.fillStyle = "rgba(255,255,255,.06)"; c.beginPath(); const rx = -w / 2 + w * (.15 + i * .25) + Math.sin(t * .6 + i) * 20; c.moveTo(rx, -h); c.lineTo(rx + 60, -h); c.lineTo(rx - 40, 0); c.lineTo(rx - 120, 0); c.fill(); } c.restore();
    // Kies
    c.fillStyle = "#c7a46a"; c.beginPath(); c.moveTo(-w / 2, 0); for (let i = 0; i <= 20; i++) c.lineTo(-w / 2 + w * i / 20, -h * .1 - Math.sin(i * 1.3) * 8); c.lineTo(w / 2, 0); c.fill();
    c.fillStyle = "#a8854f"; for (let i = 0; i < 30; i++) { c.beginPath(); c.arc(-w / 2 + (i * 97) % w, -h * .04 - (i % 4) * 5, 6, 0, 7); c.fill(); }
    // Höhle (Stein)
    kshape(c, (c) => { c.beginPath(); c.moveTo(w * .05, -h * .08); c.bezierCurveTo(w * .05, -h * .42, w * .38, -h * .42, w * .38, -h * .08); c.closePath(); }, "#6f6a9a", { rim: "rgba(220,220,255,.4)", rw: 5, sw: 14 });
    c.fillStyle = "#1a1c44"; c.beginPath(); c.ellipse(w * .215, -h * .08, w * .07, h * .12, 0, Math.PI, 0); c.fill();
    // Pflanzen
    const plant = (px, ph, n, col) => { for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * .22, sway = Math.sin(t * 1.2 + px * .01 + i) * 14; c.strokeStyle = col; c.lineWidth = 16; c.lineCap = "round";
      c.beginPath(); c.moveTo(px, -h * .06); c.quadraticCurveTo(px + a * 160 + sway, -ph * .5, px + a * 220 + sway * 2, -ph); c.stroke(); } };
    plant(-w * .36, h * .78, 5, C.plantD); plant(-w * .2, h * .55, 4, C.plant); plant(w * .44, h * .6, 3, C.plant);
    if (inner) inner(c);
    // Filter-Blasen
    bubbles(-w / 2 + 70, -h * .2, 6, t, .9); for (let i = 0; i < 5; i++) { const q = (t * .8 + i / 5) % 1; c.strokeStyle = "rgba(230,250,255,.8)"; c.lineWidth = 3; c.beginPath(); c.arc(-w / 2 + 70 + Math.sin(i * 3 + t * 3) * 8, -h * .2 - q * h * .7, 5 + i % 2 * 3, 0, 7); c.stroke(); }
    c.restore();
    // Filterkasten oben links
    kshape(c, (c) => { c.beginPath(); c.roundRect(-w / 2 + 30, -h - 16, 90, h * .82, 14); }, "#3b3f7a", { rim: "rgba(200,210,255,.4)", rw: 4, sw: 10 });
    c.fillStyle = "#2a2d5c"; for (let i = 0; i < 6; i++) c.fillRect(-w / 2 + 46, -h + 30 + i * 24, 58, 8);
    // Rahmen + Glanz
    c.strokeStyle = "#20234f"; c.lineWidth = 16; c.strokeRect(-w / 2, -h, w, h); c.fillStyle = "#20234f"; c.fillRect(-w / 2 - 12, -h - 22, w + 24, 26);
    c.save(); c.globalCompositeOperation = "lighter"; c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 10; c.beginPath(); c.moveTo(w / 2 - 40, -h + 30); c.lineTo(w / 2 - 40, -h * .45); c.stroke(); c.restore();
    c.restore(); }

  // ---------- Wohnzimmer: Wand im Bild, Boden y=0, Tisch (Platte y=-300) ----------
  function room(t, cx, cy, z, o) { o = o || {};
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2c2f78"); bg.addColorStop(1, "#18194a"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .72, H * .2, 520, "rgba(255,200,120,.16)"); g.restore();
    cam(cx, cy, z);
    // Tapete (Streifen), Fenster, Bild
    g.fillStyle = "rgba(255,255,255,.035)"; for (let x = -2400; x < 2400; x += 120) g.fillRect(x, -2000, 50, 2000);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-760, -1060, 360, 440, 20); }, "#3a3d8c", { rim: "rgba(220,220,255,.3)", rw: 6, sw: 12 });
    g.fillStyle = "#1b3d6e"; g.fillRect(-736, -1036, 312, 392); g.fillStyle = "#fff4d6"; g.beginPath(); g.arc(-520, -960, 34, 0, 7); g.fill();
    g.fillStyle = "#3a3d8c"; g.fillRect(-590, -1036, 16, 392); g.fillRect(-736, -850, 312, 16);
    kshape(g, (c) => { c.beginPath(); c.roundRect(560, -980, 260, 200, 12); }, "#e9a23b", { rw: 5, sw: 10 }); g.fillStyle = "#2fae6a"; g.beginPath(); g.moveTo(580, -800); g.lineTo(660, -900); g.lineTo(720, -840); g.lineTo(800, -930); g.lineTo(800, -800); g.fill();
    // Boden
    const fl = g.createLinearGradient(0, 0, 0, 900); fl.addColorStop(0, "#5a3a5e"); fl.addColorStop(1, "#2a1c3a"); g.fillStyle = fl; g.fillRect(-2600, 0, 5200, 3000);
    g.fillStyle = "#43305a"; g.fillRect(-2600, -24, 5200, 28);
    g.strokeStyle = "rgba(0,0,0,.18)"; g.lineWidth = 4; for (let x = -2600; x < 2600; x += 180) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x - 160, 900); g.stroke(); }
    if (o.table !== false) table();
  }
  function table() { for (const x of [40, 460]) kshape(g, (c) => { c.beginPath(); c.roundRect(x - 16, -290, 32, 290, 10); }, C.wood, { rw: 4, sw: 8 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-20, -318, 540, 36, 14); }, C.woodT, { rim: "rgba(255,220,190,.5)", rw: 5, sw: 10 }); }
  // Fisch in der Kugel (Kugel auf dem Tisch bei x=250)
  function bowlFish(t, o) { o = o || {}; bowl(g, 250, -318, o.s || 1, { t, murk: o.murk }, (c) => {
      const ph = t * (o.speed || .7), x = Math.sin(ph) * (o.range ?? 55), dir = clamp(Math.cos(ph) * 3, -1, 1);
      c.save(); c.translate(x, -160 + Math.sin(t * 1.3) * 10); c.scale(.5 * dir, .5); gold(c, { t, look: o.look, mood: o.mood, fast: o.fast }); c.restore();
      if (o.bub) { c.save(); c.setTransform(c.getTransform()); c.restore(); }
    }); }
  function bubble(x, y, w, h, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "#fff"; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, 40); g.fill();
    for (const [dx, dy, r] of [[-w * .3, h * .62, 18], [-w * .38, h * .85, 11]]) { g.beginPath(); g.arc(x + dx, y + dy, r, 0, 7); g.fill(); } g.restore(); }
  function cross(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#ff4d5a"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(-50, -50); g.lineTo(50, 50); g.moveTo(50, -50); g.lineTo(-50, 50); g.stroke(); g.restore(); }
  function zoomScreen(z) { g.setTransform(z, 0, 0, z, W / 2 * (1 - z), H * .42 * (1 - z)); }
  function stopwatch(x, y, r, t, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.translate(x, y);
    g.fillStyle = "#e9eef8"; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.fillStyle = "#c9d3e6"; g.fillRect(-r * .18, -r * 1.3, r * .36, r * .3);
    g.fillStyle = "#ff4d5a"; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r * .82, -Math.PI / 2, -Math.PI / 2 + (t % 3) / 3 * 6.283); g.fill();
    g.strokeStyle = "#12142b"; g.lineWidth = 8; g.lineCap = "round"; const an = -Math.PI / 2 + (t % 3) / 3 * 6.283; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * r * .8, Math.sin(an) * r * .8); g.stroke(); g.restore(); }

  // ================= Shots =================
  function hookShot(lt, d, t, loop) { const k = sm(lt / d); room(t, lerp(250, 256, k), -470, loop ? lerp(1.85, 2.0, k) : lerp(2.0, 2.2, k));
    bowlFish(t, { look: .9, range: 40, speed: .45 });
    if (!loop) { stopwatch(W * .72, H * .3, 70, t, sm(lt / .3)); txt("3 SEC", W * .72, H * .3 + 110, 50, "#fff", { a: sm(lt / .3), stroke: 8 });
      cross(W * .72, H * .3, 1.2, (lt - d * .45) / .3); if (lt > d * .5) stamp("MYTH", W * .44, H * .6, (lt - d * .5) / .3, "#e5484d"); } }
  KZ.shot("gHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("gLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .45) { room(t, lerp(20, 60, k), -330, 1.15); at(rudi, -230, 0, .9, { t, arm: .55, mouth: "grin", look: .8 }); bowlFish(t, { look: -.5 }); }
    else hookShot(lt - d * .45, d * .55, t, true); });

  KZ.shot("gRudi", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(60, 30, k), lerp(-390, -405, k), lerp(1.3, 1.4, k));
    at(rudi, -220, 0, .9, { t, arm: lerp(.1, 1.8, sm((lt - .2) / .6)), mouth: "hmm", look: .7 }); bowlFish(t, { look: -.6 });
    const a = sm((lt - d * .25) / .3); bubble(W * .3, H * .17, 300, 170, a); stopwatch(W * .24, H * .17, 50, t, a); txt("3 SEC", W * .36, H * .17, 46, "#12142b", { a });
    for (let i = 0; i < 4; i++) { const q = sm((lt - d * .4 - i * .25) / .3); if (q > 0) txt("x100", W * (.6 + (i % 2) * .12), H * (.13 + i * .045), 56, "#ffd84d", { a: q, stroke: 7 }); } });

  KZ.shot("gFine", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(80, 140, k), -420, lerp(1.45, 1.6, k));
    at(rudi, -150, 0, .9, { t, arm: lerp(.2, .75, sm(lt / .5)), mouth: "grin", look: .8 }); bowlFish(t, { look: -.8, mood: lt > d * .5 ? "scared" : null, range: 60 });
    if (lt > d * .3) { stamp("IT'S FINE", W * .44, H * .25, (lt - d * .3) / .3, "#2fae6a", -.06); for (let i = 0; i < 3; i++) sparkle(W * (.18 + i * .25), H * .15 + Math.sin(t * 3 + i) * 8, 20, sm((lt - d * .3) / .3)); }
    if (lt > d * .65) { const a = sm((lt - d * .65) / .3); txt("?", W * .66, H * .36, 110, "#ffd84d", { a, stroke: 10, w: 900 }); } });

  KZ.shot("gLab", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.08, sm(lt / d)));
    const yrs = ["1960s", "1980s", "2000s", "2020s"];
    yrs.forEach((y, i) => { const p = easeBack(clamp((lt - .2 - i * .32) / .35, 0, 1)); if (p <= 0) return; g.save(); g.translate(W * (.2 + i * .19), H * (.24 + (i % 2) * .05)); g.rotate((i % 2 ? .08 : -.07)); g.scale(p, p);
      g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(-82, -102, 176, 220, 14); g.fill(); g.fillStyle = "#f4f1ea"; g.beginPath(); g.roundRect(-90, -110, 176, 220, 14); g.fill();
      g.fillStyle = "#c9cfe0"; for (let l = 0; l < 6; l++) g.fillRect(-66, -30 + l * 20, 120 - (l % 3) * 20, 8); g.save(); g.translate(-2, -70); g.scale(.18, .18); gold(g, { t: t + i, look: .5 }); g.restore();
      g.fillStyle = "#232a6b"; g.font = '900 34px "Montserrat"'; g.textAlign = "center"; g.fillText(y, -2, 92); g.restore(); });
    fishAt(W * .44 + Math.sin(t * .8) * 40, H * .5, 1.05, { t, look: -.2 }, clamp(Math.cos(t * .8) * 3, -1, 1));
    txt("DECADES OF TESTS", W * .44, H * .64, 56, "#ffd84d", { a: sm((lt - .4) / .4), stroke: 8, w: 900 }); });

  // Laborbecken mit Hebel und Futterspender
  function labTank(t, lt, d, press) { navy(t, 1); zoomScreen(lerp(1, 1.06, sm(lt / d))); g.save(); g.translate(W * .44, H * .52);
    const w = 760, h = 520; tank(g, 0, 0, w, h, { t }, (c) => {
      // Hebel rechts
      const ang = press * .45; c.save(); c.translate(w * .36, -h * .78); c.rotate(ang); c.strokeStyle = "#e9eef8"; c.lineWidth = 12; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, h * .3); c.stroke();
      kshape(c, ell(0, h * .33, 26, 40, 0), "#e5484d", { rw: 4, sw: 8 }); c.restore(); });
    // Futterspender + fallende Pellets
    kshape(g, (c) => { c.beginPath(); c.moveTo(w * .1, -h - 140); c.lineTo(w * .3, -h - 140); c.lineTo(w * .23, -h - 30); c.lineTo(w * .17, -h - 30); c.closePath(); }, "#e9a23b", { rw: 5, sw: 10 });
    g.restore(); }
  KZ.shot("gLever", (lt, d, t) => { const reach = sm((lt - .2) / (d * .45)); const press = lt > d * .55 ? Math.max(0, Math.sin((lt - d * .55) * 7)) : 0;
    labTank(t, lt, d, press);
    g.save(); g.translate(W * .44, H * .52); fishAt(lerp(-220, 180, reach), -300 + Math.sin(t * 1.4) * 10, .62, { t, look: .6, fast: reach < 1 && reach > 0 }, 1);
    if (lt > d * .58) for (let i = 0; i < 7; i++) { const q = clamp((lt - d * .58 - i * .12) / 1.2, 0, 1); if (q <= 0) continue; g.fillStyle = "#a35f35"; g.beginPath(); g.arc(152 + (i % 3) * 14, -520 + q * 330, 9, 0, 7); g.fill(); }
    g.restore();
    txt("PLYMOUTH UNIVERSITY", W * .44, H * .13, 50, "#fff", { a: sm(lt / .4), stroke: 8, w: 900 });
    label("LEVER = FOOD", W * .44, H * .2, sm((lt - d * .5) / .3)); });

  KZ.shot("gClock", (lt, d, t) => { navy(t); zoomScreen(lerp(1.02, 1.08, sm(lt / d)));
    const cx = W * .3, cy = H * .3, r = 190, sec0 = -Math.PI / 2 + 2.1, sec1 = sec0 + Math.PI / 6;
    const p = easeBack(clamp(lt / .4, 0, 1)); g.save(); g.translate(cx, cy); g.scale(p, p);
    kshape(g, ell(0, 0, r + 18, r + 18, 0), "#3b3f7a", { rim: "rgba(200,210,255,.5)", rw: 6, sw: 14 }); g.fillStyle = "#f4f1ea"; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
    g.fillStyle = "rgba(47,174,106,.85)"; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r * .92, sec0, sec1); g.fill();
    g.fillStyle = "#232a6b"; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.beginPath(); g.arc(Math.cos(a) * r * .84, Math.sin(a) * r * .84, 8, 0, 7); g.fill(); }
    const an = -Math.PI / 2 + lt * .85; g.strokeStyle = "#12142b"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * r * .78, Math.sin(an) * r * .78); g.stroke();
    g.fillStyle = "#e5484d"; g.beginPath(); g.arc(0, 0, 16, 0, 7); g.fill(); g.restore();
    const am = ((an - sec0) % 6.283 + 6.283) % 6.283, inWin = am < Math.PI / 6;
    txt("1 HOUR A DAY", cx, cy + r + 70, 50, "#7ef0b0", { a: sm((lt - .3) / .4), stroke: 8, w: 900 });
    // Fisch + Hebel rechts unten
    const fx = W * .58, fy = H * .55; g.save(); g.translate(fx, fy);
    g.strokeStyle = "#e9eef8"; g.lineWidth = 12; g.lineCap = "round"; const pr = inWin ? Math.max(0, Math.sin(lt * 9)) * .4 : 0; g.save(); g.translate(170, -200); g.rotate(pr); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 120); g.stroke(); kshape(g, ell(0, 132, 22, 34, 0), "#e5484d", { rw: 4, sw: 8 }); g.restore();
    fishAt(inWin ? 60 : -60 + Math.sin(t * 1.5) * 30, -40, .55, { t, look: inWin ? .8 : -.4, fast: inWin }, 1); g.restore();
    if (inWin) { g.save(); g.globalCompositeOperation = "lighter"; glow(fx + 100, fy - 60, 260, "rgba(80,240,150,.35)"); g.restore(); txt("✓", fx + 120, fy - 290, 90, "#7ef0b0", { stroke: 8, w: 900 }); }
    else txt("zzz", fx - 40, fy - 130, 54, "#c9d3e6", { a: .8, stroke: 6 }); });

  KZ.shot("gMonths", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const x0 = W * .1, bw = W * .62, y1 = H * .26, y2 = H * .44;
    txt("MYTH", x0, y1 - 80, 44, "#ff9fae", { align: "left", w: 900, a: sm(lt / .3) }); txt("REAL", x0, y2 - 80, 44, "#7ef0b0", { align: "left", w: 900, a: sm((lt - .3) / .3) });
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.roundRect(x0, y1 - 40, bw, 80, 40); g.roundRect(x0, y2 - 40, bw, 80, 40); g.fill();
    g.fillStyle = "#e5484d"; g.beginPath(); g.roundRect(x0, y1 - 40, 80 * sm(lt / .4), 80, 40); g.fill(); txt("3 SECONDS", x0 + 110, y1, 40, "#fff", { align: "left", a: sm((lt - .2) / .3), w: 900 });
    const p = sm((lt - .5) / (d * .55)); g.fillStyle = "#2fae6a"; g.beginPath(); g.roundRect(x0, y2 - 40, Math.max(80, bw * p), 80, 40); g.fill();
    txt("MONTHS", x0 + 40, y2, 44, "#fff", { align: "left", a: sm((lt - .6) / .3), w: 900 });
    fishAt(x0 + Math.max(80, bw * p) + 90, y2, .35, { t, look: .5, fast: p < 1 }, 1);
    // Kalenderblätter
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"], mi = Math.min(5, Math.floor(clamp((lt - .5) / (d * .55), 0, .999) * 6));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W * .44, H * .58); g.rotate(-.05);
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(-110, -90, 230, 200, 18); g.fill(); g.fillStyle = "#f4f1ea"; g.beginPath(); g.roundRect(-118, -98, 230, 200, 18); g.fill();
    g.fillStyle = "#e5484d"; g.beginPath(); g.roundRect(-118, -98, 230, 60, [18, 18, 0, 0]); g.fill(); g.fillStyle = "#232a6b"; g.font = '900 70px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(months[mi], -3, 34); g.restore(); });

  KZ.shot("gQuote", (lt, d, t) => { navy(t, 1); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .38); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -300, 780, 620, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -310, 780, 620, 34); g.fill();
    g.fillStyle = "#232a6b"; g.beginPath(); g.roundRect(-390, -310, 780, 120, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 44px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("MACQUARIE UNIVERSITY", 0, -250);
    g.fillStyle = "#e5484d"; g.font = '900 140px "Montserrat"'; g.fillText("“", -310, -120);
    const lines = ["There are thousands", "of studies that show", "fish have excellent", "memories."]; g.font = '800 54px "Montserrat"'; g.fillStyle = "#1b1d3a";
    lines.forEach((l, i) => { const a = sm((lt - .4 - i * .3) / .3); g.globalAlpha = a; g.fillText(l, 0, -110 + i * 72); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 36px "Montserrat"'; g.fillText("Culum Brown, fish cognition expert", 0, 230); g.restore();
    fishAt(W * .44 + Math.sin(t) * 20, H * .62, .45, { t, look: .3 }, 1);
    txt("Source: Live Science", W * .44, H * .1, 36, "#c9e9ff", { a: sm(lt / .4) }); });

  KZ.shot("gSmall", (lt, d, t) => { const k = sm(lt / d); room(t, 250, lerp(-440, -470, k), lerp(1.9, 2.3, k));
    // Fisch stößt an das Glas und dreht immer wieder um
    bowl(g, 250, -318, 1, { t }, (c) => { const ph = t * 2.2, x = Math.sin(ph) * 70, dir = clamp(Math.cos(ph) * 3, -1, 1);
      c.save(); c.translate(x, -160); c.scale(.62 * dir, .62); gold(c, { t, look: .6, mood: "scared", fast: true }); c.restore(); });
    if (lt > d * .35) stamp("TOO SMALL", W * .44, H * .25, (lt - d * .35) / .3, "#e5484d", .06);
    const a = sm((lt - d * .2) / .3); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.strokeStyle = "#ffd84d"; g.lineWidth = 10; g.lineCap = "round";
    for (const s of [-1, 1]) { const x = W * .44 + s * (300 + Math.sin(t * 6) * 10); g.beginPath(); g.moveTo(x + s * 60, H * .45); g.lineTo(x, H * .45); g.moveTo(x + s * 22, H * .45 - 26); g.lineTo(x, H * .45); g.lineTo(x + s * 22, H * .45 + 26); g.stroke(); } g.restore(); });

  function hand(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); const col = "rgba(247,201,162,.9)";
    kshape(g, (c) => { c.beginPath(); c.roundRect(-110, -60, 200, 150, 50); }, col, { rw: 4, sw: 10 });
    [[-90, -60, -1.75, 120], [-40, -60, -1.6, 150], [10, -60, -1.52, 160], [60, -55, -1.42, 135]].forEach(([fx, fy, a, l]) => { g.strokeStyle = col; g.lineWidth = 42; g.lineCap = "round"; g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx + Math.cos(a) * l, fy + Math.sin(a) * l); g.stroke(); });
    g.beginPath(); g.moveTo(80, 30); g.lineTo(170, -40); g.stroke(); g.restore(); }
  KZ.shot("gGrow", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = sm((lt - .3) / (d * .6)); const yr = Math.round(lerp(1, 20, p));
    txt("YEAR " + yr, W * .44, H * .14, 80, "#ffd84d", { w: 900, stroke: 10 }); txt("UP TO 20 YEARS", W * .44, H * .2, 42, "#fff", { a: sm((lt - .5) / .3), w: 800 });
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = .9; hand(W * .3, H * .42, 1.25); g.globalAlpha = 1; txt("YOUR HAND", W * .3, H * .53, 38, "#f7c9a2", { w: 900, a: sm(lt / .4) });
    fishAt(W * .5, H * .4, lerp(.35, 1.15, p), { t, look: -.3 }, 1);
    // Lineal
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#e9a23b"; g.beginPath(); g.roundRect(W * .08, H * .6, W * .74, 60, 10); g.fill(); g.fillStyle = "#7a4a12"; for (let i = 0; i <= 30; i++) g.fillRect(W * .1 + i * W * .7 / 30, H * .6, 4, i % 5 ? 20 : 36); });

  KZ.shot("gDirty", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(180, 160, k), -470, lerp(1.7, 1.85, k));
    const murk = sm((lt - .2) / (d * .7)); bowlFish(t, { murk, look: .7, mood: murk > .5 ? "scared" : null, range: 40 });
    // Kotkrümel sinken
    for (let i = 0; i < 6; i++) { const q = ((lt * .5 + i / 6) % 1); g.fillStyle = "#6b4a2a"; g.beginPath(); g.ellipse(250 - 40 + i * 16, -480 + q * 140, 6, 10, 0, 0, 7); g.fill(); }
    // Messgerät links
    g.setTransform(1, 0, 0, 1, 0, 0); const mx = W * .1, my0 = H * .2, mh = H * .4;
    g.fillStyle = "rgba(255,255,255,.18)"; g.beginPath(); g.roundRect(mx - 34, my0, 68, mh, 34); g.fill();
    const lv = lerp(.08, .95, murk); const grd = g.createLinearGradient(0, my0 + mh, 0, my0); grd.addColorStop(0, "#2fae6a"); grd.addColorStop(.5, "#f2b233"); grd.addColorStop(1, "#e5484d");
    g.fillStyle = grd; g.beginPath(); g.roundRect(mx - 26, my0 + mh - (mh - 16) * lv - 8, 52, (mh - 16) * lv, 26); g.fill();
    txt("WASTE", mx + 6, my0 - 40, 40, "#fff", { w: 900, stroke: 7 }); });

  KZ.shot("gAsk", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(-60, -100, k), -330, lerp(1.25, 1.4, k), { table: false });
    at(rudi, -160, 0, .95, { t, arm: 1.5 + .5 * sm(lt / .5), mouth: "o", look: .3 });
    const a = easeBack(clamp((lt - .1) / .4, 0, 1)); txt("?", W * .66, H * .28, 220 * a + 1, "#ffd84d", { stroke: 14, w: 900 });
    if (lt > d * .3) stamp("WHAT NOW?", W * .44, H * .12, (lt - d * .3) / .3, "#7b5cff", -.05); });

  KZ.shot("gTank", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(140, 190, k), -380, lerp(1.0, 1.08, k), { table: false });
    // Unterschrank
    kshape(g, (c) => { c.beginPath(); c.roundRect(-30, -260, 660, 260, 18); }, C.wood, { rim: "rgba(255,220,190,.4)", rw: 5, sw: 12 });
    const pop = easeBack(clamp(lt / .5, 0, 1)); g.save(); g.translate(300, -260); g.scale(pop, pop);
    tank(g, 0, 0, 640, 400, { t }, (c) => { const ph = t * .6; c.save(); c.translate(Math.sin(ph) * 160, -230 + Math.sin(t * 1.1) * 20); c.scale(.42 * clamp(Math.cos(ph) * 3, -1, 1), .42); gold(c, { t, look: .5 }); c.restore(); }); g.restore();
    at(rudi, -240, 0, .95, { t, arm: .7, mouth: "grin", look: .7, hold: "flakes" });
    label("50+ LITRES", W * .56, H * .16, sm((lt - .3) / .3)); label("FILTER", W * .3, H * .23, sm((lt - .8) / .3));
    if (lt > d * .5) { stamp("APPROVED", W * .5, H * .62, (lt - d * .5) / .3, "#2fae6a", -.06); for (let i = 0; i < 4; i++) sparkle(W * (.18 + i * .18), H * (.08 + (i % 2) * .05) + Math.sin(t * 3 + i) * 8, 22, sm((lt - d * .5) / .3)); } });

  KZ.shot("gExplore", (lt, d, t) => { const k = sm(lt / d); room(t, 0, 0, 1, { table: false });
    g.setTransform(1, 0, 0, 1, 0, 0); const z = lerp(1.55, 1.7, k); g.translate(W / 2, H * .44); g.scale(z, z);
    const w = 640, h = 520; const path = (u) => [Math.sin(u * 6.283) * 210, -h * .5 + Math.sin(u * 12.566) * 110];
    const u = lt / d * .9, [fx, fy] = path(u), [nx] = path(u + .01);
    tank(g, 0, h * .5, w, h, { t }, (c) => { c.save(); c.translate(fx, fy); c.scale(.4 * (nx >= fx ? 1 : -1), .4); gold(c, { t, look: .6, fast: true }); c.restore(); });
    // Erinnerungs-Punkte, wo er war
    g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 6; i++) { const ui = i / 6 * .9; if (ui > u - .05) continue; const [px, py] = path(ui); sparkle(W / 2 + px * z, H * .44 + (py + h * .5) * z, 20, .9); }
    if (lt > d * .45) stamp("HAPPY FISH", W * .44, H * .14, (lt - d * .45) / .3, "#f2b233", .05); });
})();
