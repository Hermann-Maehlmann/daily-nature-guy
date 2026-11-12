// Szenendatei "Stop Feeding Ducks Bread" (Stockente, Anas platyrhynchos). Probevideo im Mix-Stil (Hermann 12.11.2026):
// unser gezeichneter Look + Alltagsthema mit Irrtum, Du-Ansprache, eigene Menschenfigur "Rudi", Schilder/Infografiken, Quellenkarte, Tipp am Ende.
// Quellen: Canal & River Trust "Why is bread bad for ducks?" (2025), Scottish Wildlife Trust "Feed ducks healthy food" (2025), Dacorum Council (angel wing).
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#ffb06b", "#f2707a", "#8c4a98", "#3a2a6b"], hills: [["#7a4f96", "#8a5ea6"], ["#5d3d84", "#6c4a93"], ["#432e6e", "#4f377b"]], corals: false, rays: false, dust: "255,225,180" };
  const C = { grass: "#3f9a63", grassT: "#5cbf78", grassD: "#2d7a4c", water: "#2b86a8", waterT: "#57b9d2", waterD: "#1a5d83",
    body: "#c9c0b0", chest: "#8c4630", wing: "#9b8f7d", head: "#1f8a55", headR: "rgba(150,255,210,.7)", bill: "#f4c531", foot: "#ff8a2b",
    hen: "#a77a4c", henD: "#7c5634", coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86", bread: "#f0bd70", crust: "#b8733a" };
  const KARMA = "#ffd84d";

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

  // ---------- Hintergründe ----------
  const stars = Array.from({ length: 40 }, (_, i) => ({ x: (i * 397) % W, y: (i * 211) % (H * .3), r: 1.2 + (i % 3) * .8, ph: i }));
  function sky(t, camx) {
    reef(t, camx, 0, 1, PAL);
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.globalCompositeOperation = "lighter";
    glow(W * .28, H * .2, 420, "rgba(255,210,140,.45)");
    for (const s of stars) { g.fillStyle = `rgba(255,240,220,${.12 + .12 * Math.sin(t * 2 + s.ph)})`; g.beginPath(); g.arc(s.x, s.y, s.r, 0, 7); g.fill(); }
    g.restore();
    g.fillStyle = "#ffe2a8"; g.beginPath(); g.arc(W * .28, H * .2, 70, 0, 7); g.fill();
    // ferne Bäume (eigene Silhouetten)
    for (let i = 0; i < 9; i++) { const x = ((i * 170 - camx * .3) % 1500 + 1500) % 1500 - 200, y = H * .52, s = .8 + (i % 3) * .25;
      g.fillStyle = "#3b2a62"; g.fillRect(x - 6, y - 30 * s, 12, 60 * s);
      g.beginPath(); g.ellipse(x, y - 80 * s, 55 * s, 75 * s, 0, 0, 7); g.fill(); }
  }
  // Ufer links (Gras, y=0) und Teich rechts (Wasser ab x=bx, Oberfläche y=14). Weltkoordinaten (nach cam).
  function park(t, bx) {
    bx = bx ?? -40;
    g.fillStyle = C.waterD; g.fillRect(bx - 200, 14, 6000, 3000);
    const wg = g.createLinearGradient(0, 14, 0, 500); wg.addColorStop(0, C.waterT); wg.addColorStop(.15, C.water); wg.addColorStop(1, C.waterD); g.fillStyle = wg; g.fillRect(bx - 200, 14, 6000, 3000);
    // Spiegelung der Sonne
    g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 7; i++) { const y = 40 + i * 34, w = 160 - i * 16 + Math.sin(t * 2 + i) * 20; g.fillStyle = `rgba(255,210,150,${.22 - i * .025})`; g.beginPath(); g.roundRect(bx + 520 - w / 2 + Math.sin(t * 1.5 + i) * 14, y, w, 8, 4); g.fill(); } g.restore();
    // Wellenlinien
    g.strokeStyle = "rgba(220,250,255,.35)"; g.lineWidth = 5; g.lineCap = "round";
    for (let i = 0; i < 14; i++) { const x = bx + 80 + ((i * 263 + t * 30) % 2400), y = 60 + (i * 97) % 380; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 30, y - 8, x + 60, y); g.stroke(); }
    // Ufer
    kshape(g, (c) => { c.beginPath(); c.moveTo(-6000, 0); c.lineTo(bx - 30, 0); c.quadraticCurveTo(bx + 40, 4, bx + 50, 60); c.quadraticCurveTo(bx + 60, 400, bx - 40, 3000); c.lineTo(-6000, 3000); c.closePath(); }, C.grass, { rim: "rgba(200,255,200,.5)", shadow: "rgba(10,40,30,.3)", rw: 8, sw: 20 });
    g.strokeStyle = C.grassT; g.lineWidth = 6;
    for (let x = bx - 60; x > bx - 3000; x -= 70) { const h = 16 + (Math.abs(x * 13) % 20); for (const k of [-1, 0, 1]) { g.beginPath(); g.moveTo(x + k * 7, 2); g.lineTo(x + k * 13 + Math.sin(t * 1.4 + x) * 3, -h + Math.abs(k) * 6); g.stroke(); } }
    // Schilf am Ufer
    for (let i = 0; i < 4; i++) { const x = bx - 10 + i * 22, h = 150 + i * 30, sw = Math.sin(t * 1.2 + i) * 8; g.strokeStyle = "#2f7a4f"; g.lineWidth = 7; g.beginPath(); g.moveTo(x, 40); g.quadraticCurveTo(x + sw * .5, -h * .5, x + sw, -h); g.stroke();
      if (i % 2 == 0) kshape(g, ell(x + sw, -h - 20, 10, 32), "#7a4a2a", { rw: 3, sw: 5 }); }
  }
  function navy(t, tint) { // Infografik-Hintergrund
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, tint ? "#1b4a4a" : "#232a6b"); bg.addColorStop(1, tint ? "#0b2228" : "#0d1236"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = "rgba(255,255,255,.07)"; for (let y = 40; y < H; y += 60) for (let x = 30; x < W; x += 60) { g.beginPath(); g.arc(x + Math.sin(t * .5) * 6, y, 3, 0, 7); g.fill(); }
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .5, H * .4, 700, tint ? "rgba(80,220,180,.18)" : "rgba(120,140,255,.2)"); g.restore();
  }

  // ---------- Stockente (Erpel / Weibchen / Junge), Seitenansicht, Kopf nach rechts, Wasserlinie y=0, Länge ~320 ----------
  function duck(c, o) {
    const t = o.t || 0, hen = o.hen, bob = Math.sin(t * 2.6 + (o.seed || 0)) * 3, thin = o.thin || 0, eat = o.eat || 0;
    const body = hen ? C.hen : C.body, wing = hen ? C.henD : C.wing;
    c.save(); c.translate(0, bob);
    if (o.swim !== false) { c.save(); c.beginPath(); c.rect(-600, -800, 1200, 806); c.clip(); }
    // Schwanz
    if (!hen) { c.strokeStyle = "#1d1d2b"; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(-140, -66); c.quadraticCurveTo(-150, -100, -128, -102); c.stroke(); }
    kshape(c, (c) => { c.beginPath(); c.moveTo(-120, -70); c.lineTo(-188, -64); c.lineTo(-120, -28); c.closePath(); }, hen ? C.henD : "#efeae0", { rw: 4, sw: 8 });
    // Körper
    const ry = 60 * (1 - thin * .22);
    kshape(c, ell(0, -40, 150, ry, 0), body, { rim: "rgba(255,245,225,.7)", shadow: "rgba(40,20,60,.28)", rw: 7, sw: 20 });
    if (hen) { c.strokeStyle = "rgba(90,55,30,.45)"; c.lineWidth = 4; for (let i = 0; i < 12; i++) { const x = -110 + i * 20, y = -70 + (i % 3) * 18; c.beginPath(); c.arc(x, y, 7, 0, 3); c.stroke(); } }
    if (!hen) kshape(c, ell(92, -50, 58, 50 * (1 - thin * .2), .2), C.chest, { rim: "rgba(255,190,150,.6)", rw: 5, sw: 12 });
    // Flügel
    c.save(); c.translate(-10, -62);
    kshape(c, ell(-10, 0, 100, 30, -.08), wing, { rim: "rgba(255,240,220,.5)", rw: 5, sw: 10 });
    kshape(c, ell(-62, 6, 34, 11, -.1), "#3f62e0", { rim: "rgba(190,210,255,.8)", rw: 3, sw: 4 });
    if (o.angel) { // Handschwingen drehen nach außen (Engelsflügel)
      const a = sm(o.angel); for (let i = 0; i < 4; i++) { c.save(); c.translate(-96, -6 + i * 6); c.rotate(-.15 - a * (1.6 + i * .18)); kshape(c, ell(-50, 0, 52, 10, 0), i % 2 ? "#cfc6b6" : "#b5ab99", { rw: 3, sw: 5 }); c.restore(); } }
    c.restore();
    // Hals + Kopf (beim Fressen nach vorn unten)
    c.save(); c.translate(110, -70); c.rotate(eat * .9); c.translate(-110, 70);
    kshape(c, ell(118, -88, 30, 42, .2), hen ? C.hen : C.head, { rim: hen ? "rgba(255,230,200,.6)" : C.headR, rw: 5, sw: 10 });
    if (!hen) { c.fillStyle = "#fff"; c.beginPath(); c.ellipse(116, -64, 30, 7, .15, 0, 7); c.fill(); }
    kshape(c, ell(140, -126, 48, 40, .05), hen ? C.hen : C.head, { rim: hen ? "rgba(255,230,200,.6)" : C.headR, rw: 6, sw: 12 });
    if (hen) { c.fillStyle = C.henD; c.beginPath(); c.ellipse(150, -128, 40, 6, .05, 0, 7); c.fill(); }
    // Schnabel
    kshape(c, (c) => { c.beginPath(); c.moveTo(172, -136); c.quadraticCurveTo(230, -138, 238, -118); c.quadraticCurveTo(232, -106, 176, -110); c.closePath(); }, hen ? "#ff9a3c" : C.bill, { rim: "rgba(255,250,210,.7)", rw: 3, sw: 6 });
    c.fillStyle = "rgba(60,40,10,.5)"; c.beginPath(); c.ellipse(200, -128, 5, 2.5, 0, 0, 7); c.fill();
    fig.eye(c, 150, -136, 13, { t, seed: o.seed || 0, look: o.look ?? .4, mood: o.mood, lid: hen ? C.hen : C.head });
    if (o.carry) { c.save(); c.translate(236, -114); c.rotate(.4); bread(c, 0, 0, .22, { sog: 0 }); c.restore(); }
    c.restore();
    if (o.swim !== false) { c.restore(); c.strokeStyle = "rgba(230,250,255,.7)"; c.lineWidth = 5; c.beginPath(); c.ellipse(0, 6, 175 + Math.sin(t * 3) * 6, 8, 0, 0, 7); c.stroke(); }
    else { // Beine an Land
      for (const x of [-20, 30]) { c.strokeStyle = C.foot; c.lineWidth = 9; c.lineCap = "round"; c.beginPath(); c.moveTo(x, 10); c.lineTo(x + 4, 52); c.stroke(); c.fillStyle = C.foot; c.beginPath(); c.moveTo(x - 10, 56); c.lineTo(x + 34, 56); c.lineTo(x + 6, 46); c.fill(); } }
    c.restore();
  }
  function duckling(c, o) { const t = o.t || 0, b = Math.sin(t * 4 + (o.seed || 0)) * 3; c.save(); c.translate(0, b); c.save(); c.beginPath(); c.rect(-200, -300, 400, 304); c.clip();
    kshape(c, ell(0, -26, 52, 32, 0), "#e8c25a", { rim: "rgba(255,250,200,.8)", rw: 5, sw: 10 }); c.fillStyle = "#8a6230"; c.beginPath(); c.ellipse(-10, -40, 34, 12, -.1, 0, 7); c.fill();
    kshape(c, ell(42, -62, 26, 24, 0), "#f2d36a", { rim: "rgba(255,250,200,.8)", rw: 4, sw: 8 }); c.fillStyle = "#8a6230"; c.beginPath(); c.ellipse(40, -78, 22, 8, 0, 0, 7); c.fill();
    c.fillStyle = "#e08a2a"; c.beginPath(); c.moveTo(62, -64); c.lineTo(84, -60); c.lineTo(62, -54); c.fill(); fig.eye(c, 50, -66, 7, { t, seed: o.seed || 0, look: .4 }); c.restore();
    c.strokeStyle = "rgba(230,250,255,.6)"; c.lineWidth = 3; c.beginPath(); c.ellipse(0, 5, 60, 4, 0, 0, 7); c.stroke(); c.restore(); }

  // ---------- Brotscheibe ----------
  function bread(c, x, y, s, o) { o = o || {}; c.save(); c.translate(x, y); c.scale(s, s); const sog = o.sog || 0;
    const p = (c) => { c.beginPath(); c.moveTo(-90, 110); c.lineTo(-90, -40); c.bezierCurveTo(-130, -60, -120, -130, -50, -130); c.bezierCurveTo(-20, -150, 20, -150, 50, -130); c.bezierCurveTo(120, -130, 130, -60, 90, -40); c.lineTo(90, 110); c.closePath(); };
    kshape(c, p, sog ? `rgb(${lerp(184, 120, sog)},${lerp(115, 130, sog)},${lerp(58, 90, sog)})` : C.crust, { rw: 6, sw: 14 });
    c.save(); c.translate(0, 6); c.scale(.82, .82); kshape(c, p, sog ? `rgb(${lerp(240, 170, sog)},${lerp(189, 180, sog)},${lerp(112, 140, sog)})` : C.bread, { rim: "rgba(255,250,220,.6)", rw: 5, sw: 10 }); c.restore();
    c.fillStyle = "rgba(160,100,40,.35)"; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(-50 + (i * 37) % 100, -70 + (i * 53) % 160, 5, 0, 7); c.fill(); }
    if (o.mould) { c.fillStyle = `rgba(90,140,80,${o.mould})`; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(-50 + (i * 43) % 110, -80 + (i * 61) % 170, 16 + (i % 3) * 8, 0, 7); c.fill(); } }
    c.restore(); }
  function crumb(c, x, y, r, rot) { c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = C.bread; c.beginPath(); c.roundRect(-r, -r * .8, r * 2, r * 1.6, r * .4); c.fill(); c.fillStyle = C.crust; c.fillRect(-r, -r * .8, r * 2, r * .35); c.restore(); }

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
    if (o.hold === "bread") bread(c, hx + 18, hy - 10, .32, {});
    if (o.hold === "bag") { kshape(c, (c) => { c.beginPath(); c.roundRect(hx - 10, hy - 10, 120, 150, 18); }, "#e9e2d4", { rw: 4, sw: 10 }); txt; c.fillStyle = "#c98b3a"; c.beginPath(); c.roundRect(hx + 10, hy + 30, 80, 40, 10); c.fill(); }
    if (o.hold === "seeds") { c.fillStyle = "#e8c25a"; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(hx - 8 + (i % 3) * 9, hy - 14 - (i / 3 | 0) * 8, 6, 0, 7); c.fill(); } }
    c.restore(); return { hx, hy }; }

  // ---------- Ratte (fürs Ufer) ----------
  function rat(c, o) { const t = o.t || 0; c.save();
    c.strokeStyle = "#e7a3a8"; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(-70, -20); c.bezierCurveTo(-150, -10, -160, -70, -200 + Math.sin(t * 3) * 10, -50); c.stroke();
    kshape(c, ell(0, -40, 80, 42, 0), "#7d7a8f", { rim: "rgba(230,230,255,.5)", rw: 5, sw: 12 });
    kshape(c, ell(78, -56, 42, 30, .25), "#8b88a0", { rim: "rgba(230,230,255,.5)", rw: 4, sw: 8 });
    kshape(c, ell(62, -92, 18, 20, 0), "#f0b1b8", { rw: 3, sw: 5 }); c.fillStyle = "#e7a3a8"; c.beginPath(); c.arc(118, -50, 8, 0, 7); c.fill();
    fig.eye(c, 92, -66, 10, { t, seed: 5, look: .6, mood: "angry", lid: "#8b88a0" });
    c.strokeStyle = "rgba(255,255,255,.6)"; c.lineWidth = 2; for (const k of [-1, 1]) { c.beginPath(); c.moveTo(112, -48); c.lineTo(150, -48 + k * 12); c.stroke(); } c.restore(); }

  function at(fn, x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); fn(g, o); g.restore(); }
  function sparkle(x, y, r, a) { g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, r * 2.4, `rgba(255,230,140,${.6 * a})`); g.fillStyle = `rgba(255,250,220,${a})`; g.beginPath(); for (let i = 0; i < 8; i++) { const ang = i / 8 * 6.283, rr = i % 2 ? r * .3 : r; g.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } g.fill(); g.restore(); }

  // ================= Shots =================
  // Hook / Loop: Nahaufnahme, Erpel schnappt nach Brotbrocken, Krümel fallen von oben
  function hookShot(lt, d, t, loop) { sky(t, 0); const k = sm(lt / d); cam(lerp(160, 200, k), lerp(-90, -100, k), loop ? lerp(1.8, 2.2, k) : lerp(2.2, 2.6, k)); park(t, -900);
    for (let i = 0; i < 5; i++) { const p = ((lt * .5 + i * .23) % 1); crumb(g, 120 + i * 45 + Math.sin(i * 3) * 30, lerp(-460, 4, p), 10 + (i % 2) * 4, p * 6 + i); }
    at(duck, 60, 0, 1, { t, look: .7, carry: !loop && lt > d * .5 }); bread(g, 320, 8, .3, {});
    if (!loop && lt > d * .55) stamp("JUNK FOOD", W * .44, H * .3, (lt - d * .55) / .3, "#e5484d"); }
  KZ.shot("dHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("dLoop", (lt, d, t) => { // zurück zur ersten Einstellung (Loop)
    const k = sm(lt / d); if (lt < d * .45) { sky(t, 0); cam(lerp(-260, -200, k), -250, 1.2); park(t, -40); const r = rudi(g, { t, arm: .2, hold: "bread", mouth: "smile" }); at(duck, 260, 0, .7, { t, seed: 1 }); }
    else hookShot(lt - d * .45, d * .55, t, true); });

  KZ.shot("dHero", (lt, d, t) => { sky(t, t * 10); const k = sm(lt / d); cam(lerp(-60, 0, k), -240, lerp(1.05, 1.15, k)); park(t, -40);
    const th = sm(lt / (d * .3)); at(rudi, -330, 0, .9, { t, arm: lt < d * .3 ? th : 1 - sm((lt - d * .3) / .5) * .4, hold: lt < d * .25 ? "bread" : null, mouth: lt > d * .55 ? "grin" : "smile" });
    if (lt > d * .22) { const p = clamp((lt - d * .22) / .7, 0, 1); bread(g, lerp(-200, 60, p), lerp(-480, 8, p) - Math.sin(p * Math.PI) * 120, .18 * (p < 1 ? 1 : 1), {}); }
    for (let i = 0; i < 3; i++) { const p = sm((lt - .2 - i * .15) / (d * .6)); const x = lerp(520 + i * 180, 170 + i * 130, p), y = 20 + i * 70;
      at(duck, x, y, .55, { t: t + i, seed: i, hen: i === 1, look: -.6 }, true);
      g.strokeStyle = "rgba(230,250,255,.45)"; g.lineWidth = 4; for (let j = 1; j < 4; j++) { g.beginPath(); g.moveTo(x + 90 + j * 30, y - 4 - j * 6); g.lineTo(x + 70 + j * 46, y + 2); g.lineTo(x + 90 + j * 30, y + 10 + j * 6); g.stroke(); } }
    if (lt > d * .6) { const a = sm((lt - d * .6) / .25); for (let i = 0; i < 5; i++) sparkle(W * (.12 + i * .08), H * (.24 + (i % 2) * .05) + Math.sin(t * 3 + i) * 8, 26, a); stamp("+100 KARMA", W * .44, H * .3, (lt - d * .6) / .3, "#2fae6a", .06); } });

  KZ.shot("dBars", (lt, d, t) => { navy(t); g.setTransform(1, 0, 0, 1, 0, 0);
    const p = easeBack(lt / .5); g.save(); g.translate(W * .44, H * .27); g.scale(p, p); g.rotate(Math.sin(t * 1.4) * .05); bread(g, 0, 0, 1.15, {}); g.restore();
    txt("WHAT BREAD GIVES A DUCK", W * .44, H * .385, 52, "#fff", { a: sm(lt / .4) });
    const rows = [["PROTEIN", .06], ["VITAMINS", .04], ["MINERALS", .05]];
    rows.forEach(([n, v], i) => { const a = sm((lt - .2 - i * .25) / .3), y = H * (.44 + i * .085), x0 = 110, w = 680;
      txt(n, x0, y - 48, 48, "#cfd6ff", { align: "left", a });
      g.globalAlpha = a; g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 5; g.setLineDash([16, 12]); g.beginPath(); g.roundRect(x0, y - 12, w, 60, 30); g.stroke(); g.setLineDash([]);
      const f = v * sm((lt - .4 - i * .25) / .5); g.fillStyle = "#ff5a5f"; g.beginPath(); g.roundRect(x0, y - 12, Math.max(60, w * f), 60, 30); g.fill(); g.globalAlpha = 1;
      txt("ALMOST 0", x0 + w - 10, y - 48, 42, "#ff8a8d", { align: "right", a: sm((lt - .7 - i * .25) / .3) }); });
 });

  KZ.shot("dFull", (lt, d, t) => { sky(t, 0); const k = sm(lt / d); cam(lerp(40, 90, k), -150, lerp(1.6, 1.8, k)); park(t, -700);
    at(duck, 0, 0, 1, { t, look: -.8, mood: lt > d * .5 ? "angry" : null }); // satt, schaut weg
    // Schnecke + Wasserkäfer (echte Nahrung) rechts
    const sx = 330; kshape(g, ell(sx, -2, 46, 16, 0), "#c9a77a", { rw: 3, sw: 6 }); kshape(g, ell(sx - 6, -40, 34, 32, 0), "#b65a3a", { rim: "rgba(255,210,180,.6)", rw: 4, sw: 8 });
    g.strokeStyle = "#8a3c25"; g.lineWidth = 5; g.beginPath(); g.arc(sx - 6, -40, 18, 0, 5); g.stroke(); fig.eye(g, sx + 40, -30, 8, { t, look: -.8 });
    // Magen-Anzeige
    g.setTransform(1, 0, 0, 1, 0, 0); const f = sm(lt / (d * .5)), x = 150, y = H * .26;
    txt("STOMACH", x, y - 56, 48, "#fff", { align: "left", stroke: 8 });
    g.fillStyle = "rgba(0,0,0,.45)"; g.beginPath(); g.roundRect(x, y - 20, 520, 56, 28); g.fill();
    g.fillStyle = "#ffcc66"; g.beginPath(); g.roundRect(x + 6, y - 14, 508 * f, 44, 22); g.fill();
    for (let i = 0; i < 6; i++) if (f > i / 6) crumb(g, x + 40 + i * 80, y + 8, 12, i);
    if (f > .98) stamp("FULL", x + 640, y + 6, (lt - d * .5) / .3, "#e5484d", .1);
    if (lt > d * .55) txt("real food: ignored", W * .6, H * .58, 50, "#fff", { stroke: 8, a: sm((lt - d * .55) / .3) }); });

  KZ.shot("dThin", (lt, d, t) => { navy(t, 1); const k = sm(lt / d); cam(40, -60, lerp(1.7, 1.9, k));
    g.save(); g.filter = `saturate(${lerp(1, .45, k)})`; at(duck, 0, 30, 1, { t, swim: true, thin: k, mood: "scared", look: -.3, lid: C.head }); g.restore();
    // Akku läuft leer
    g.setTransform(1, 0, 0, 1, 0, 0); const x = W * .44 - 150, y = H * .25, lv = lerp(1, .12, sm(lt / (d * .8)));
    g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.roundRect(x, y, 300, 130, 22); g.fill(); g.fillRect(x + 300, y + 40, 22, 50);
    g.fillStyle = "#14204d"; g.beginPath(); g.roundRect(x + 12, y + 12, 276, 106, 14); g.fill();
    g.fillStyle = lv > .5 ? "#3ccf7a" : lv > .25 ? "#ffb13b" : "#ff4d5a"; g.beginPath(); g.roundRect(x + 20, y + 20, 260 * lv, 90, 10); g.fill();
    txt(Math.round(lv * 100) + "%", W * .44, y + 66, 54, "#fff", { stroke: 8 }); txt("ENERGY", W * .44, y - 40, 40, "#cfe", {}); });

  KZ.shot("dAngel", (lt, d, t) => { sky(t, t * 8); const k = sm(lt / d); cam(lerp(100, 300, k), lerp(-160, -110, k), lerp(1.1, 2.2, k)); park(t, -900);
    at(duck, -80, 20, .9, { t, hen: true, seed: 2 }); for (let i = 0; i < 3; i++) at(duckling, 180 + i * 120, 30 + (i % 2) * 20, .9, { t, seed: i + 4 });
    at(duck, 330, 60, .62, { t, hen: true, seed: 7, angel: sm((lt - d * .3) / (d * .5)) }); // Jungente mit Engelsflügel
    if (lt > d * .55) stamp("ANGEL WING", W * .46, H * .27, (lt - d * .55) / .3, "#7b5cff", -.06); });

  KZ.shot("dTwist", (lt, d, t) => { navy(t); const k = sm(lt / d); cam(-60, -110, lerp(2.2, 2.5, k));
    const hop = lt > d * .55 ? Math.max(0, Math.sin((lt - d * .55) * 7)) * 40 * (1 - sm((lt - d * .55) / (d * .4))) : 0;
    g.fillStyle = "rgba(255,255,255,.08)"; g.beginPath(); g.ellipse(0, 70, 220, 18, 0, 0, 7); g.fill();
    at(duck, 0, 10 - hop, 1, { t, hen: true, swim: false, seed: 7, angel: .3 + .7 * sm(lt / (d * .4)), mood: lt > d * .6 ? "scared" : null, lid: C.hen });
    // Pfeil zeigt auf verdrehte Federn
    g.setTransform(1, 0, 0, 1, 0, 0); const a = sm((lt - .2) / .3); g.globalAlpha = a; g.strokeStyle = "#ffd84d"; g.lineWidth = 10; g.lineCap = "round";
    g.beginPath(); g.moveTo(W * .2, H * .24); g.quadraticCurveTo(W * .2, H * .3, W * .29, H * .33); g.stroke(); g.beginPath(); g.moveTo(W * .27, H * .3); g.lineTo(W * .3, H * .335); g.lineTo(W * .255, H * .345); g.stroke(); g.globalAlpha = 1;
    txt("TWISTED FEATHERS", W * .44, H * .21, 46, "#ffd84d", { stroke: 10, a });
    if (lt > d * .65) stamp("CAN'T FLY", W * .6, H * .62, (lt - d * .65) / .3, "#e5484d", .08); });

  // Querschnitt Teich: oben Ufer + Wasseroberfläche, unten Wasser mit sinkendem Brot
  function pondCut(t, algae) { g.setTransform(1, 0, 0, 1, 0, 0);
    const sg = g.createLinearGradient(0, 0, 0, H * .3); sg.addColorStop(0, PAL.sky[1]); sg.addColorStop(1, PAL.sky[0]); g.fillStyle = sg; g.fillRect(0, 0, W, H * .3);
    const wg = g.createLinearGradient(0, H * .3, 0, H); wg.addColorStop(0, `rgb(${lerp(43, 70, algae)},${lerp(134, 140, algae)},${lerp(168, 80, algae)})`); wg.addColorStop(1, `rgb(${lerp(12, 22, algae)},${lerp(45, 60, algae)},${lerp(80, 35, algae)})`); g.fillStyle = wg; g.fillRect(0, H * .3, W, H * .7);
    g.fillStyle = "#4a3a5e"; g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * .86); for (let x = 0; x <= W; x += 60) g.lineTo(x, H * .86 + Math.sin(x * .02) * 20); g.lineTo(W, H); g.fill();
    // Ufer links oben
    kshape(g, (c) => { c.beginPath(); c.moveTo(0, H * .27); c.lineTo(W * .3, H * .27); c.quadraticCurveTo(W * .36, H * .3, W * .3, H * .4); c.quadraticCurveTo(W * .15, H * .5, 0, H * .52); c.closePath(); }, "#6b4f3a", { rw: 6, sw: 14 });
    g.fillStyle = C.grass; g.fillRect(0, H * .255, W * .31, 22);
    // Wasserpflanzen
    for (let i = 0; i < 7; i++) { const x = 120 + i * 150, h = 160 + (i % 3) * 70; g.strokeStyle = algae > .3 ? "#4f8a2a" : "#2e7d5b"; g.lineWidth = 12; g.beginPath(); g.moveTo(x, H * .88); g.quadraticCurveTo(x + Math.sin(t + i) * 30, H * .88 - h * .5, x + Math.sin(t * 1.3 + i) * 20, H * .88 - h); g.stroke(); }
    g.strokeStyle = "rgba(220,250,255,.6)"; g.lineWidth = 6; g.beginPath(); g.moveTo(W * .3, H * .3); g.lineTo(W, H * .3); g.stroke(); }
  KZ.shot("dRot", (lt, d, t) => { pondCut(t, 0);
    for (let i = 0; i < 3; i++) { const p = sm((lt - i * .3) / (d * .8)); const x = W * (.45 + i * .17), y = lerp(H * .31, H * (.6 + i * .07), p);
      g.save(); g.translate(x, y); g.rotate(p * (1 + i) * .6); bread(g, 0, 0, .55, { sog: p, mould: p * .9 }); g.restore();
      for (let j = 0; j < 3; j++) { const q = (t * .6 + j / 3 + i * .2) % 1; g.fillStyle = `rgba(220,250,255,${.6 * (1 - q)})`; g.beginPath(); g.arc(x + Math.sin(q * 8 + j) * 20, y - q * 200, 8, 0, 7); g.fill(); } }
    if (lt > d * .5) stamp("ROTTING", W * .6, H * .45, (lt - d * .5) / .3, "#7a8a3a", -.07); });
  KZ.shot("dAlgae", (lt, d, t) => { const a = sm(lt / (d * .7)); pondCut(t, a);
    for (let i = 0; i < 3; i++) { g.save(); g.translate(W * (.45 + i * .17), H * (.6 + i * .07)); g.rotate((1 + i) * .6); bread(g, 0, 0, .55, { sog: 1, mould: .9 }); g.restore(); }
    // Algenteppich wächst an der Oberfläche
    for (let i = 0; i < 18; i++) { const x = W * .3 + i * 45, r = 30 * sm(a * 1.6 - i * .05); if (r > 0) { g.fillStyle = i % 2 ? "#6fbf3a" : "#58a82e"; g.beginPath(); g.ellipse(x, H * .305, r * 1.4, r * .55, 0, 0, 7); g.fill(); } }
    if (lt > d * .2) stamp("ALGAE", W * .7, H * .38, (lt - d * .2) / .3, "#4f9a2a", .06);
    // Ratte kommt ans Ufer
    const r = sm((lt - d * .45) / (d * .35)); g.save(); g.translate(lerp(-220, W * .15, r), H * .257); g.scale(1.3, 1.3); rat(g, { t }); g.restore();
    if (lt > d * .6) stamp("RATS", W * .2, H * .18, (lt - d * .6) / .3, "#e5484d", -.06); });

  KZ.shot("dQuote", (lt, d, t) => { navy(t, 1); g.setTransform(1, 0, 0, 1, 0, 0);
    const p = easeBack(lt / .45), cx = W * .45, cy = H * .42; g.save(); g.translate(cx, cy); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(-380 + 12, -300 + 16, 760, 600, 40); g.fill();
    g.fillStyle = "#fffaf0"; g.beginPath(); g.roundRect(-380, -300, 760, 600, 40); g.fill();
    g.fillStyle = "#2fae6a"; g.beginPath(); g.roundRect(-380, -300, 760, 130, [40, 40, 0, 0]); g.fill(); g.restore();
    if (p > .9) { txt("SCOTTISH WILDLIFE TRUST", cx, cy - 250, 40, "#fff"); txt("UK wildlife charity", cx, cy - 202, 30, "#e6fff0", { w: 700 });
      g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#2fae6a"; g.font = '900 150px "Montserrat"'; g.textAlign = "left"; g.fillText("“", cx - 340, cy - 40);
      const words = ["“Bread is", "their version", "of junk food.”"]; words.forEach((w, i) => txt(w, cx + 10, cy - 30 + i * 84, 62, "#1b2440", { a: sm((lt - .5 - i * .45) / .3) })); }
    // kleine Ente schaut von unten rein
    g.save(); const pe = sm((lt - .8) / .5); g.translate(cx + 300, cy + 330 - pe * 40); g.scale(.55, .55); duck(g, { t, swim: false, look: -.4 }); g.restore(); });

  KZ.shot("dAsk", (lt, d, t) => { sky(t, 0); const k = sm(lt / d); cam(lerp(-200, -160, k), -290, lerp(1.25, 1.4, k)); park(t, 120);
    at(rudi, -300, 0, 1, { t, arm: 1.5 + sm(lt / .4) * .5, mouth: "hmm", look: .8 }); at(duck, 160, 0, .6, { t, swim: false, look: -1, seed: 2 }, true);
    g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 2; i++) { const a = easeBack((lt - .2 - i * .2) / .35); if (a <= 0) continue; g.save(); g.translate(W * (.62 + i * .12), H * (.24 - i * .03)); g.scale(a, a); g.rotate(Math.sin(t * 3 + i) * .15);
      g.font = '900 150px "Montserrat"'; g.textAlign = "center"; g.lineWidth = 14; g.strokeStyle = "#1b2440"; g.strokeText("?", 0, 0); g.fillStyle = "#ffd84d"; g.fillText("?", 0, 0); g.restore(); } });

  // Futter-Symbole (Bildschirmkoordinaten)
  function food(kind, x, y, s, t) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(s, s);
    if (kind === 0) { kshape(g, (c) => { c.beginPath(); c.moveTo(-90, -20); c.quadraticCurveTo(0, 110, 90, -20); c.closePath(); }, "#5b8fd6", { rw: 5, sw: 12 }); g.fillStyle = "#f1dcae"; g.beginPath(); g.ellipse(0, -22, 90, 22, 0, 0, 7); g.fill(); g.fillStyle = "#d8b97c"; for (let i = 0; i < 14; i++) { g.beginPath(); g.ellipse(-70 + (i * 37) % 140, -30 + (i % 3) * 7, 9, 5, i, 0, 7); g.fill(); } }
    if (kind === 1) { for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28, r = i ? 48 : 0; kshape(g, ell(Math.cos(a) * r * (i % 2 ? 1 : .6), Math.sin(a) * r * (i % 2 ? .8 : .5), 24, 24, 0), "#66c24a", { rim: "rgba(230,255,200,.8)", rw: 4, sw: 7 }); } }
    if (kind === 2) { kshape(g, ell(0, 0, 44, 96, .3), "#f5c933", { rw: 5, sw: 10 }); g.fillStyle = "#e3ad1e"; for (let i = 0; i < 18; i++) { g.save(); g.rotate(.3); g.beginPath(); g.ellipse(-20 + (i % 3) * 20, -72 + (i / 3 | 0) * 28, 8, 11, 0, 0, 7); g.fill(); g.restore(); } kshape(g, (c) => { c.beginPath(); c.moveTo(20, 80); c.quadraticCurveTo(-70, 40, -60, -80); c.quadraticCurveTo(-30, 30, 40, 70); c.closePath(); }, "#5aa83a", { rw: 4, sw: 8 }); }
    if (kind === 3) { for (let i = 0; i < 3; i++) { g.save(); g.rotate(-.6 + i * .6); kshape(g, ell(0, -50, 38, 70, 0), ["#7fd35a", "#9be06d", "#6cc04a"][i], { rim: "rgba(240,255,220,.8)", rw: 4, sw: 8 }); g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 10); g.lineTo(0, -100); g.stroke(); g.restore(); } }
    g.restore(); }
  KZ.shot("dFood", (lt, d, t) => { navy(t, 1); const names = ["OATS", "PEAS", "SWEETCORN", "LETTUCE"], step = d * .2;
    names.forEach((n, i) => { const a = (lt - .1 - i * step) / .35; if (a <= 0) return; const x = W * (.25 + (i % 2) * .38), y = H * (.3 + (i / 2 | 0) * .2) + Math.sin(t * 2 + i) * 6;
      g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, 150 * clamp(a, 0, 1), "rgba(120,255,200,.25)"); g.restore();
      food(i, x, y, easeBack(a), t); txt(n, x, y + 120, 42, "#fff", { stroke: 8, a: clamp(a * 2, 0, 1) }); });
    if (lt > d * .8) stamp("DUCK APPROVED", W * .44, H * .66, (lt - d * .8) / .3, "#2fae6a", -.06); });

  KZ.shot("dScatter", (lt, d, t) => { sky(t, 0); const k = sm(lt / d); cam(lerp(-80, -40, k), -240, lerp(1.15, 1.25, k)); park(t, -40);
    const th = (lt % 1.6) / 1.6; at(rudi, -330, 0, .9, { t, arm: th < .3 ? sm(th / .3) : 1 - sm((th - .3) / .4), hold: "seeds", mouth: "smile" });
    for (let i = 0; i < 10; i++) { const p = clamp((th - .25) / .5 + i * .02, 0, 1); if (p <= 0 || p >= 1) continue; g.fillStyle = i % 3 ? "#66c24a" : "#f5c933"; g.beginPath(); g.arc(lerp(-200, 60 + i * 26, p), lerp(-460, 10, p) - Math.sin(p * Math.PI) * 100, 9, 0, 7); g.fill(); }
    for (let i = 0; i < 3; i++) at(duck, 160 + i * 140, 30 + i * 40, .55, { t: t + i, seed: i, hen: i === 1, eat: .5 + .5 * Math.sin(t * 5 + i * 2), look: -.6 }, true);
    if (lt > d * .3) stamp("SMALL HANDFUL", W * .5, H * .25, (lt - d * .3) / .3, "#ff8a2b", .05); });

  KZ.shot("dHero2", (lt, d, t) => { sky(t, t * 10); const k = sm(lt / d); cam(lerp(-60, -20, k), -240, lerp(1.1, 1.2, k)); park(t, -40);
    at(rudi, -330, 0, .9, { t, arm: .3, mouth: "grin" });
    for (let i = 0; i < 3; i++) { at(duck, 170 + i * 140, 30 + i * 40, .55, { t: t + i, seed: i, hen: i === 1, look: -.8 }, true); }
    for (let i = 0; i < 6; i++) { const q = (lt * .6 + i / 6) % 1; g.save(); g.globalAlpha = 1 - q; g.fillStyle = "#ff6b8a"; g.translate(120 + i * 70, -120 - q * 200); g.scale(1.4, 1.4); g.beginPath(); g.moveTo(0, 6); g.bezierCurveTo(-14, -6, -6, -16, 0, -8); g.bezierCurveTo(6, -16, 14, -6, 0, 6); g.fill(); g.restore(); }
    stamp("REAL HERO", W * .44, H * .27, lt / .35, "#2fae6a", -.05); for (let i = 0; i < 4; i++) sparkle(W * (.15 + i * .2), H * (.2 + (i % 2) * .1) + Math.sin(t * 3 + i) * 8, 22, sm(lt / .4)); });
})();
