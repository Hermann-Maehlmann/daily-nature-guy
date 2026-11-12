// Szenendatei "Never Give Hedgehogs Milk" (Braunbrustigel, Erinaceus europaeus). Mix-Stil (Hermann 12.11.2026).
// Quellen: RSPCA "Hedgehogs in your garden" ("Never give hedgehogs milk, as they're lactose intolerant and it can cause diarrhoea."),
// Scottish SPCA "What do hedgehogs eat?" (Brot: wenig Energie, kein Nährwert), Wildlife Trusts (Laub-/Holzhaufen als Winterquartier).
// Helfer txt/stamp/navy/bread/rudi/at/sparkle aus duck-bread-szenen.js übernommen (Rudi bleibt gleich), Igel neu gezeichnet.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#2b2f72", "#3a3480", "#2a2560", "#141436"], hills: [["#203f55", "#284b63"], ["#18324a", "#1f3d57"], ["#10243a", "#173048"]], corals: false, rays: false, dust: "255,236,190" };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86", bread: "#f0bd70", crust: "#b8733a",
    spine: "#5e4030", spineD: "#3d281c", tip: "#f0dcb8", fur: "#d9b48a", furD: "#b4875e", belly: "#c39a70", nose: "#1c1420",
    lawn: "#2c6a55", lawnT: "#3f8a6a", fence: "#4a3a6a", fenceT: "#5c4a80", milk: "#fbf7ee", water: "#6cc6ec" };
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
  // ---------- Brotscheibe ----------
  function bread(c, x, y, s, o) { o = o || {}; c.save(); c.translate(x, y); c.scale(s, s); const sog = o.sog || 0;
    const p = (c) => { c.beginPath(); c.moveTo(-90, 110); c.lineTo(-90, -40); c.bezierCurveTo(-130, -60, -120, -130, -50, -130); c.bezierCurveTo(-20, -150, 20, -150, 50, -130); c.bezierCurveTo(120, -130, 130, -60, 90, -40); c.lineTo(90, 110); c.closePath(); };
    kshape(c, p, sog ? `rgb(${lerp(184, 120, sog)},${lerp(115, 130, sog)},${lerp(58, 90, sog)})` : C.crust, { rw: 6, sw: 14 });
    c.save(); c.translate(0, 6); c.scale(.82, .82); kshape(c, p, sog ? `rgb(${lerp(240, 170, sog)},${lerp(189, 180, sog)},${lerp(112, 140, sog)})` : C.bread, { rim: "rgba(255,250,220,.6)", rw: 5, sw: 10 }); c.restore();
    c.fillStyle = "rgba(160,100,40,.35)"; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(-50 + (i * 37) % 100, -70 + (i * 53) % 160, 5, 0, 7); c.fill(); }
    if (o.mould) { c.fillStyle = `rgba(90,140,80,${o.mould})`; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(-50 + (i * 43) % 110, -80 + (i * 61) % 170, 16 + (i % 3) * 8, 0, 7); c.fill(); } }
    c.restore(); }
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
    if (o.hold === "milk" || o.hold === "water" || o.hold === "food") dish(c, hx + 50, hy + 4, .75, o.hold, t);
    c.restore(); return { hx, hy }; }
  function at(fn, x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); fn(g, o); g.restore(); }
  function sparkle(x, y, r, a) { g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, r * 2.4, `rgba(255,230,140,${.6 * a})`); g.fillStyle = `rgba(255,250,220,${a})`; g.beginPath(); for (let i = 0; i < 8; i++) { const ang = i / 8 * 6.283, rr = i % 2 ? r * .3 : r; g.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } g.fill(); g.restore(); }

  // ---------- Hintergrund: Garten bei Nacht ----------
  const stars = Array.from({ length: 46 }, (_, i) => ({ x: (i * 397) % W, y: (i * 211) % (H * .34), r: 1.4 + (i % 3) * .9, ph: i }));
  function sky(t, camx) {
    reef(t, camx, 0, 1, PAL);
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.globalCompositeOperation = "lighter";
    glow(W * .3, H * .14, 380, "rgba(200,210,255,.35)");
    for (const s of stars) { g.fillStyle = `rgba(255,250,235,${.35 + .3 * Math.sin(t * 2 + s.ph)})`; g.beginPath(); g.arc(s.x, s.y, s.r, 0, 7); g.fill(); }
    g.restore();
    g.fillStyle = "#fff4d6"; g.beginPath(); g.arc(W * .3, H * .14, 64, 0, 7); g.fill();
    g.fillStyle = "rgba(220,200,160,.5)"; g.beginPath(); g.arc(W * .3 - 18, H * .14 - 10, 12, 0, 7); g.arc(W * .3 + 20, H * .14 + 16, 8, 0, 7); g.fill();
  }
  const leafCols = ["#e8742c", "#d9472f", "#f2b233", "#b8502a"];
  function leaf(c, x, y, s, rot, col) { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = col; c.beginPath(); c.moveTo(-22, 0); c.quadraticCurveTo(0, -16, 22, 0); c.quadraticCurveTo(0, 16, -22, 0); c.fill();
    c.strokeStyle = "rgba(0,0,0,.18)"; c.lineWidth = 2; c.beginPath(); c.moveTo(-20, 0); c.lineTo(20, 0); c.stroke(); c.restore(); }
  // Rasen (y >= 0) mit Zaun dahinter, Weltkoordinaten
  function lawn(t) {
    // Zaun
    for (let x = -2400; x < 2400; x += 92) { kshape(g, (c) => { c.beginPath(); c.moveTo(x, -10); c.lineTo(x, -330); c.lineTo(x + 40, -360); c.lineTo(x + 80, -330); c.lineTo(x + 80, -10); c.closePath(); }, C.fence, { rim: "rgba(200,190,255,.25)", shadow: "rgba(10,5,30,.3)", rw: 5, sw: 10 }); }
    g.fillStyle = "#3a2d58"; g.fillRect(-2400, -280, 4800, 22); g.fillRect(-2400, -110, 4800, 22);
    // Büsche vor dem Zaun
    for (let i = 0; i < 9; i++) { const x = -1900 + i * 460, s = .8 + (i % 3) * .2; kshape(g, (c) => { c.beginPath(); c.ellipse(x, -40, 170 * s, 120 * s, 0, Math.PI, 0); c.ellipse(x + 110 * s, -30, 110 * s, 90 * s, 0, Math.PI, 0); c.closePath(); }, "#1f5a4a", { rim: "rgba(160,255,220,.25)", rw: 6, sw: 14 }); }
    const lg = g.createLinearGradient(0, -10, 0, 900); lg.addColorStop(0, C.lawnT); lg.addColorStop(1, "#163d33"); g.fillStyle = lg; g.fillRect(-2600, -12, 5200, 3000);
    g.strokeStyle = "#4f9c78"; g.lineWidth = 5; g.lineCap = "round";
    for (let i = 0; i < 70; i++) { const x = -2000 + (i * 173) % 4000, y = 10 + (i * 61) % 520, h = 14 + (i % 4) * 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(t * 1.3 + i) * 3, y - h); g.moveTo(x + 8, y); g.lineTo(x + 12, y - h * .7); g.stroke(); }
    for (let i = 0; i < 26; i++) leaf(g, -1600 + (i * 211) % 3200, 30 + (i * 83) % 460, 1.1, i * 1.7, leafCols[i % 4]);
  }
  function garden(t, cx, cy, z) { sky(t, cx); cam(cx, cy, z); lawn(t); }

  // ---------- Schälchen: Milch / Wasser / Futter (Boden y=0) ----------
  function dish(c, x, y, s, kind, t) { c.save(); c.translate(x, y); c.scale(s, s);
    kshape(c, (c) => { c.beginPath(); c.moveTo(-95, -24); c.quadraticCurveTo(-80, 6, 0, 8); c.quadraticCurveTo(80, 6, 95, -24); c.closePath(); }, kind === "food" ? "#e5484d" : "#e9eef8", { rim: "rgba(255,255,255,.7)", rw: 4, sw: 10 });
    c.fillStyle = kind === "food" ? "#c23238" : "#c9d3e6"; c.beginPath(); c.ellipse(0, -24, 95, 20, 0, 0, 7); c.fill();
    if (kind === "milk") { c.fillStyle = C.milk; c.beginPath(); c.ellipse(0, -22, 80, 14, 0, 0, 7); c.fill(); c.fillStyle = "rgba(255,255,255,.9)"; c.beginPath(); c.ellipse(-30, -25, 22, 4, 0, 0, 7); c.fill(); }
    if (kind === "water") { c.fillStyle = C.water; c.beginPath(); c.ellipse(0, -22, 80, 14, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 3; c.beginPath(); c.ellipse(Math.sin((t || 0) * 2) * 10, -22, 30, 5, 0, 0, 7); c.stroke(); }
    if (kind === "food") { for (let i = 0; i < 9; i++) { c.fillStyle = i % 2 ? "#8a4a2a" : "#a35f35"; c.beginPath(); c.ellipse(-60 + i * 15, -30 - (i % 3) * 6, 14, 10, i, 0, 7); c.fill(); } }
    c.restore(); }

  // ---------- Igel (Erinaceus europaeus), Seitenansicht, Kopf rechts, Boden y=0, Länge ~330 ----------
  function hog(c, o) {
    const t = o.t || 0, seed = o.seed || 0, br = 1 + Math.sin(t * 2.4 + seed) * .018, walk = o.walk || 0, thin = o.thin || 0, fat = o.fat || 0, sick = o.sick || 0;
    c.save(); c.scale(1, br);
    // Beinchen
    [-85, -40, 40, 80].forEach((x, i) => { const sw = walk ? Math.sin(t * 10 + i * 1.6 + (i % 2) * Math.PI) * 9 : 0;
      c.fillStyle = i % 2 ? "#6a4630" : "#563824"; c.beginPath(); c.ellipse(x + sw, -12, 15, 20, 0, 0, 7); c.fill();
      c.fillStyle = "#3a2618"; c.beginPath(); c.ellipse(x + sw + 8, -2, 15, 6, 0, 0, 7); c.fill(); });
    // Bauchfell
    kshape(c, ell(5, -42, 140 * (1 + fat * .1), 36, 0), C.belly, { rim: "rgba(255,235,200,.5)", rw: 4, sw: 8 });
    // Stachelkleid
    const rx = 150 * (1 + fat * .12 - thin * .07), ry = 100 * (1 + fat * .16 - thin * .16), cx = -15, cy = -58;
    const dome = (c) => { c.beginPath(); const N = 46; for (let i = 0; i <= N; i++) { const a = Math.PI * 1.0 + i / N * Math.PI * .9, r = i % 2 ? 1 : 1.13;
        const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r; i ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.lineTo(cx + rx * .5, cy + 22); c.lineTo(cx - rx * .96, cy + 26); c.closePath(); };
    kshape(c, dome, C.spine, { rim: "rgba(255,225,180,.5)", shadow: "rgba(20,5,30,.35)", rw: 7, sw: 18 });
    c.save(); dome(c); c.clip(); c.lineCap = "round";
    for (let i = 0; i < 70; i++) { const a = Math.PI * 1.04 + ((i * .618) % 1) * Math.PI * .84, rr = .3 + ((i * .37) % 1) * .72;
      const x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr, d = a - .55, dx = Math.cos(d) * 36, dy = Math.sin(d) * 36;
      c.strokeStyle = C.spineD; c.lineWidth = 6; c.beginPath(); c.moveTo(x - dx * .5, y - dy * .5); c.lineTo(x + dx * .5, y + dy * .5); c.stroke();
      c.strokeStyle = C.tip; c.lineWidth = 5; c.beginPath(); c.moveTo(x + dx * .22, y + dy * .22); c.lineTo(x + dx * .5, y + dy * .5); c.stroke(); }
    c.restore();
    // Kopf
    c.save(); c.translate(82, -50); c.rotate((o.eat || 0) * .32 + (o.nod || 0));
    kshape(c, ell(-6, -50, 15, 13, 0), C.furD, { rw: 3, sw: 5 });
    const face = (c) => { c.beginPath(); c.moveTo(-38, -46); c.bezierCurveTo(30, -64, 92, -20, 122, 4); c.quadraticCurveTo(96, 30, 34, 30); c.quadraticCurveTo(-34, 32, -38, -46); c.closePath(); };
    kshape(c, face, C.fur, { rim: "rgba(255,240,215,.7)", shadow: "rgba(90,40,20,.25)", rw: 5, sw: 12 });
    c.fillStyle = "rgba(120,80,50,.35)"; c.beginPath(); c.ellipse(36, -16, 30, 20, -.3, 0, 7); c.fill(); // dunkle Augenpartie
    if (sick) { c.save(); face(c); c.fillStyle = `rgba(120,210,90,${sick * .45})`; c.fill(); c.restore(); }
    fig.eye(c, 40, -20, 15, { t, seed, look: o.look ?? .5, mood: o.mood, lid: C.fur });
    kshape(c, ell(120, 3, 13, 11, 0), C.nose, { rim: "rgba(255,255,255,.4)", rw: 3, sw: 4 });
    c.fillStyle = "rgba(255,255,255,.8)"; c.beginPath(); c.arc(123, -1, 3.5, 0, 7); c.fill();
    c.strokeStyle = "#5a3020"; c.lineWidth = 4; c.lineCap = "round";
    if (sick) { c.beginPath(); c.moveTo(70, 20); for (let i = 1; i <= 4; i++) c.lineTo(70 + i * 7, 20 + (i % 2 ? -4 : 3)); c.stroke(); }
    else if (o.lick) { c.fillStyle = "#ff7a8a"; c.beginPath(); c.ellipse(108, 24 + Math.max(0, Math.sin(t * 9)) * 8, 9, 6 + Math.max(0, Math.sin(t * 9)) * 5, 0, 0, 7); c.fill(); }
    else { c.beginPath(); c.arc(88, 10, 12, .4, 2.2); c.stroke(); }
    c.strokeStyle = "rgba(255,240,220,.55)"; c.lineWidth = 2; for (const k of [-1, 0, 1]) { c.beginPath(); c.moveTo(108, 10); c.lineTo(150, 6 + k * 12); c.stroke(); }
    c.restore();
    c.restore();
  }
  function sweat(x, y, a) { g.save(); g.globalAlpha = a; g.fillStyle = "#9fe3ff"; g.beginPath(); g.moveTo(x, y - 24); g.quadraticCurveTo(x + 16, y, x, y + 8); g.quadraticCurveTo(x - 16, y, x, y - 24); g.fill(); g.restore(); }
  function heart(x, y, s, a) { g.save(); g.globalAlpha = a; g.fillStyle = "#ff6b8a"; g.translate(x, y); g.scale(s, s); g.beginPath(); g.moveTo(0, 6); g.bezierCurveTo(-14, -6, -6, -16, 0, -8); g.bezierCurveTo(6, -16, 14, -6, 0, 6); g.fill(); g.restore(); }
  // Laktose-Molekül (Zucker-Sechseck-Paar), Bildschirmkoordinaten
  function sugar(x, y, s, rot, col) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = col || "#ff9fd0"; g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 5;
    for (const ox of [-34, 34]) { g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + .52; g.lineTo(ox + Math.cos(a) * 30, Math.sin(a) * 30); } g.closePath(); g.fill(); g.stroke(); }
    g.beginPath(); g.moveTo(-6, 0); g.lineTo(6, 0); g.stroke(); g.restore(); }
  function glass(x, y, s, lv) { g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = "rgba(220,240,255,.25)"; g.beginPath(); g.moveTo(-90, -150); g.lineTo(90, -150); g.lineTo(70, 150); g.lineTo(-70, 150); g.closePath(); g.fill();
    g.fillStyle = C.milk; g.beginPath(); g.moveTo(-90 + 20 * (1 - lv), 150 - 300 * lv); g.lineTo(90 - 20 * (1 - lv), 150 - 300 * lv); g.lineTo(70, 150); g.lineTo(-70, 150); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,255,255,.6)"; g.fillRect(-62, -120, 14, 250); g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 6; g.beginPath(); g.moveTo(-90, -150); g.lineTo(-70, 150); g.lineTo(70, 150); g.lineTo(90, -150); g.stroke(); g.restore(); }

  // ================= Shots =================
  // Hook / Loop: Nahaufnahme, Igel schleckt Milch aus der Untertasse
  function hookShot(lt, d, t, loop) { const k = sm(lt / d); garden(t, lerp(70, 85, k), lerp(-95, -85, k), loop ? lerp(1.65, 1.8, k) : lerp(1.8, 1.95, k));
    dish(g, 255, 6, 1, "milk", t); at(hog, 0, 0, 1, { t, lick: true, eat: .55 + Math.sin(t * 4.5) * .08, look: .8 });
    for (let i = 0; i < 3; i++) { const q = (lt * 1.4 + i / 3) % 1; g.fillStyle = `rgba(255,255,255,${.9 * (1 - q)})`; g.beginPath(); g.arc(215 + i * 20, -10 - q * 40, 5, 0, 7); g.fill(); }
    if (!loop && lt > d * .55) stamp("BAD IDEA", W * .44, H * .34, (lt - d * .55) / .3, "#e5484d"); }
  KZ.shot("hHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("hLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .45) { garden(t, lerp(-220, -170, k), -250, 1.2); at(rudi, -300, 0, .9, { t, arm: .35, hold: "milk", mouth: "smile" }); at(hog, 330, 10, .7, { t, walk: 1, look: -.6 }, true); }
    else hookShot(lt - d * .45, d * .55, t, true); });

  KZ.shot("hGood", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-110, -60, k), -230, lerp(1.25, 1.35, k));
    const down = sm((lt - d * .1) / (d * .35)); const put = lt > d * .45;
    at(rudi, -330, 0, .9, { t, arm: lerp(.2, .75, down), hold: put ? null : "milk", mouth: lt > d * .55 ? "grin" : "smile" });
    if (put) dish(g, -40, 8, .7, "milk", t);
    const p = sm((lt - d * .35) / (d * .55)); at(hog, lerp(420, 110, p), 14, .7, { t, walk: p < 1 ? 1 : 0, look: -.5 }, true);
    if (lt > d * .6) { const a = sm((lt - d * .6) / .25); for (let i = 0; i < 4; i++) sparkle(W * (.14 + i * .09), H * (.24 + (i % 2) * .05) + Math.sin(t * 3 + i) * 8, 24, a); stamp("GOOD DEED?", W * .44, H * .3, (lt - d * .6) / .3, "#2fae6a", .06); } });

  KZ.shot("hLactose", (lt, d, t) => { navy(t); g.setTransform(1, 0, 0, 1, 0, 0);
    const p = easeBack(lt / .45); g.save(); g.translate(W * .24, H * .32); g.scale(p * 1.35, p * 1.35); glass(0, 0, 1, .8); g.restore();
    txt("MILK", W * .24, H * .45, 52, "#fff", { a: sm(lt / .4) });
    // Laktose wandert vom Glas zum Igel
    for (let i = 0; i < 4; i++) { const q = clamp((lt - .3 - i * .2) / (d * .5), 0, 1); if (q <= 0) continue; sugar(lerp(W * .3, W * .52, q), H * (.28 + i * .025) - Math.sin(q * Math.PI) * 60, .9, q * 3 + i, "#ff9fd0"); }
    txt("LACTOSE", W * .52, H * .2, 46, "#ff9fd0", { a: sm((lt - .3) / .3), stroke: 8 });
    g.save(); g.translate(W * .6, H * .44); g.scale(1.25, 1.25); hog(g, { t, look: -.3, mood: lt > d * .55 ? "scared" : null }); g.restore();
    if (lt > d * .5) { const a = easeBack((lt - d * .5) / .3); g.save(); g.translate(W * .5, H * .3); g.scale(a * 1.3, a * 1.3); g.strokeStyle = "#ff4d5a"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(-50, -50); g.lineTo(50, 50); g.moveTo(50, -50); g.lineTo(-50, 50); g.stroke(); g.restore(); }
    if (lt > d * .6) stamp("INTOLERANT", W * .44, H * .58, (lt - d * .6) / .3, "#7b5cff", -.06); });

  // Querschnitt: Igel-Silhouette mit Darm, Zuckermoleküle bleiben ganz
  KZ.shot("hGut", (lt, d, t) => { navy(t, 1); g.setTransform(1, 0, 0, 1, 0, 0); const z = lerp(1.9, 2.05, sm(lt / d));
    g.save(); g.translate(W * .44, H * .44); g.scale(z, z); g.globalAlpha = .35; hog(g, { t, look: .4 }); g.globalAlpha = 1;
    const path = (u) => { const x = lerp(90, -110, u) + Math.sin(u * Math.PI * 4) * 14, y = -50 + Math.sin(u * Math.PI * 3) * 22; return [x, y]; };
    g.strokeStyle = "#ff8fa6"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); for (let i = 0; i <= 60; i++) { const [x, y] = path(i / 60); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.strokeStyle = "#ffd1dc"; g.lineWidth = 6; g.stroke(); g.restore();
    for (let i = 0; i < 5; i++) { const u = ((lt * .22 + i * .2) % 1); const x = lerp(90, -110, u) + Math.sin(u * Math.PI * 4) * 14, y = -50 + Math.sin(u * Math.PI * 3) * 22;
      sugar(W * .44 + x * z, H * .44 + y * z, .62, t * 2 + i, "#ff9fd0"); }
    // Schere, die nicht schneidet
    const a = sm((lt - .3) / .4); g.save(); g.globalAlpha = a; g.translate(W * .28, H * .24); const sn = Math.sin(t * 8) * .25;
    g.strokeStyle = "#cfd6ff"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.lineTo(90, -40 - sn * 60); g.moveTo(0, 0); g.lineTo(90, 40 + sn * 60); g.stroke();
    g.beginPath(); g.arc(-26, -18, 18, 0, 7); g.arc(-26, 18, 18, 0, 7); g.stroke(); g.restore();
    txt("SUGAR STAYS WHOLE", W * .44, H * .16, 50, "#ffd84d", { a, stroke: 8 });
    if (lt > d * .55) stamp("CAN'T DIGEST", W * .46, H * .6, (lt - d * .55) / .3, "#e5484d", .06); });

  KZ.shot("hSick", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(60, 90, k), -110, lerp(1.7, 1.95, k));
    dish(g, 330, 6, .9, "milk", t); const sk = sm(lt / (d * .4)); const wob = Math.sin(t * 18) * 3 * sk;
    at(hog, wob, 0, 1, { t, sick: sk, mood: "scared", look: -.2 });
    // Bauchgrummeln
    g.save(); g.strokeStyle = `rgba(160,255,120,${.8 * sk})`; g.lineWidth = 6; g.lineCap = "round";
    for (let i = 0; i < 3; i++) { const q = (lt * 1.2 + i / 3) % 1; g.globalAlpha = (1 - q) * sk; g.beginPath(); g.arc(0, -40, 120 + q * 120, Math.PI * .1, Math.PI * .9); g.stroke(); } g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); sweat(W * .62, H * .3 + Math.sin(t * 4) * 6, sk);
    for (let i = 0; i < 3; i++) txt("~", W * (.2 + i * .07), H * (.34 - (i % 2) * .03) + Math.sin(t * 5 + i) * 10, 80, "#a6ff7a", { a: sk, stroke: 6 });
    if (lt > d * .5) stamp("TUMMY TROUBLE", W * .44, H * .22, (lt - d * .5) / .3, "#4f9a2a", -.06); });

  KZ.shot("hFat", (lt, d, t) => { navy(t); g.setTransform(1, 0, 0, 1, 0, 0);
    // fallende Herbstblätter
    for (let i = 0; i < 14; i++) { const q = ((t * .12 + i * .071) % 1); leaf(g, (i * 157) % W, q * H, 1.6, t + i, leafCols[i % 4]); }
    txt("AUTUMN", W * .44, H * .12, 60, "#ffb13b", { stroke: 8, a: sm(lt / .3) });
    const f = sm((lt - .2) / (d * .7)); g.save(); g.translate(W * .42, H * .4); g.scale(1.75, 1.75); hog(g, { t, fat: f, look: .3 }); g.restore();
    // Fett-Anzeige
    const x = W * .44 - 330, y = H * .52; txt("WINTER FAT", W * .44, y - 50, 46, "#fff", {});
    g.fillStyle = "rgba(0,0,0,.4)"; g.beginPath(); g.roundRect(x, y - 20, 660, 64, 32); g.fill();
    g.fillStyle = "#ffcc4d"; g.beginPath(); g.roundRect(x + 7, y - 13, Math.max(50, 646 * f * .85), 50, 25); g.fill();
    txt(Math.round(f * 85) + "%", x + 600, y + 12, 40, "#fff", { stroke: 6, align: "right" });
    if (lt > d * .65) stamp("EVERY GRAM", W * .44, H * .6, (lt - d * .65) / .3, "#ff8a2b", .05); });

  KZ.shot("hDrain", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(20, 40, k), -150, lerp(1.45, 1.6, k));
    at(hog, 0, 0, 1, { t, thin: k, sick: .5 * (1 - k), mood: "scared", look: -.3 });
    // Schnee setzt ein
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < 40; i++) { const q = ((t * .08 + i * .037) % 1); if (k < i / 60) continue; g.beginPath(); g.arc((i * 263 + Math.sin(t + i) * 20) % W, q * H * .7, 4 + (i % 3) * 2, 0, 7); g.fill(); }
    // Akku läuft leer
    const x = W * .44 - 150, y = H * .14, lv = lerp(.85, .15, sm(lt / (d * .8)));
    g.fillStyle = "rgba(255,255,255,.92)"; g.beginPath(); g.roundRect(x, y, 300, 130, 22); g.fill(); g.fillRect(x + 300, y + 40, 22, 50);
    g.fillStyle = "#14204d"; g.beginPath(); g.roundRect(x + 12, y + 12, 276, 106, 14); g.fill();
    g.fillStyle = lv > .5 ? "#3ccf7a" : lv > .25 ? "#ffb13b" : "#ff4d5a"; g.beginPath(); g.roundRect(x + 20, y + 20, 260 * lv, 90, 10); g.fill();
    txt(Math.round(lv * 100) + "%", W * .44, y + 66, 54, "#fff", { stroke: 8 }); txt("ENERGY", W * .44, y + 170, 44, "#fff", { stroke: 8 });
    if (lt > d * .6) stamp("HIBERNATION", W * .44, H * .58, (lt - d * .6) / .3, "#4aa3e0", -.05); });

  KZ.shot("hBread", (lt, d, t) => { navy(t); g.setTransform(1, 0, 0, 1, 0, 0);
    const p = easeBack(lt / .5); g.save(); g.translate(W * .44, H * .22); g.scale(p, p); g.rotate(Math.sin(t * 1.4) * .05); bread(g, 0, 0, 1, {}); g.restore();
    txt("BREAD FOR A HEDGEHOG", W * .44, H * .33, 50, "#fff", { a: sm(lt / .4) });
    const rows = [["ENERGY", .18, "LOW"], ["NUTRITION", .05, "ALMOST 0"]];
    rows.forEach(([n, v, s], i) => { const a = sm((lt - .2 - i * .3) / .3), y = H * (.41 + i * .1), x0 = 110, w = 680;
      txt(n, x0, y - 48, 48, "#cfd6ff", { align: "left", a });
      g.globalAlpha = a; g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 5; g.setLineDash([16, 12]); g.beginPath(); g.roundRect(x0, y - 12, w, 60, 30); g.stroke(); g.setLineDash([]);
      const f = v * sm((lt - .4 - i * .3) / .5); g.fillStyle = "#ff5a5f"; g.beginPath(); g.roundRect(x0, y - 12, Math.max(60, w * f), 60, 30); g.fill(); g.globalAlpha = 1;
      txt(s, x0 + w - 10, y - 48, 42, "#ff8a8d", { align: "right", a: sm((lt - .7 - i * .3) / .3) }); });
    g.save(); const pe = sm((lt - .6) / .5); g.translate(W * .7, H * .66 - pe * 30); g.scale(.6, .6); hog(g, { t, look: -.8, mood: "angry" }); g.restore(); });

  KZ.shot("hQuote", (lt, d, t) => { navy(t, 1); g.setTransform(1, 0, 0, 1, 0, 0);
    const p = easeBack(lt / .45), cx = W * .45, cy = H * .4; g.save(); g.translate(cx, cy); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(-380 + 12, -300 + 16, 760, 600, 40); g.fill();
    g.fillStyle = "#fffaf0"; g.beginPath(); g.roundRect(-380, -300, 760, 600, 40); g.fill();
    g.fillStyle = "#2f6fb5"; g.beginPath(); g.roundRect(-380, -300, 760, 130, [40, 40, 0, 0]); g.fill(); g.restore();
    if (p > .9) { txt("RSPCA", cx, cy - 250, 46, "#fff"); txt("UK animal welfare charity", cx, cy - 202, 30, "#e6f0ff", { w: 700 });
      g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#2f6fb5"; g.font = '900 150px "Montserrat"'; g.textAlign = "left"; g.fillText("“", cx - 340, cy - 40);
      const words = ["“Never give", "hedgehogs milk…", "it can cause", "diarrhoea.”"]; words.forEach((w, i) => txt(w, cx + 10, cy - 70 + i * 76, 56, "#1b2440", { a: sm((lt - .5 - i * .35) / .3) })); }
    g.save(); const pe = sm((lt - .8) / .5); g.translate(cx + 260, cy + 360 - pe * 40); g.scale(.6, .6); hog(g, { t, look: -.5 }); g.restore(); });

  KZ.shot("hAsk", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-200, -160, k), -290, lerp(1.25, 1.4, k));
    at(rudi, -300, 0, 1, { t, arm: 1.5 + sm(lt / .4) * .5, mouth: "hmm", look: .8 }); at(hog, 110, 10, .75, { t, look: -1, seed: 2 }, true);
    g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 2; i++) { const a = easeBack((lt - .2 - i * .2) / .35); if (a <= 0) continue; g.save(); g.translate(W * (.56 + i * .12), H * (.22 - i * .03)); g.scale(a, a); g.rotate(Math.sin(t * 3 + i) * .15);
      g.font = '900 150px "Montserrat"'; g.textAlign = "center"; g.lineWidth = 14; g.strokeStyle = "#1b2440"; g.strokeText("?", 0, 0); g.fillStyle = "#ffd84d"; g.fillText("?", 0, 0); g.restore(); } });

  // Futter-Symbole (Bildschirmkoordinaten)
  function food(kind, x, y, s) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(s, s);
    if (kind === 0) { // Dose Katzenfutter (Fleisch)
      kshape(g, (c) => { c.beginPath(); c.roundRect(-80, -70, 160, 140, 18); }, "#c9d3e6", { rw: 5, sw: 12 }); g.fillStyle = "#7b5cff"; g.fillRect(-80, -40, 160, 80);
      g.fillStyle = "#e9a07a"; g.beginPath(); g.ellipse(-8, 0, 34, 24, -.4, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.ellipse(30, -18, 12, 8, -.4, 0, 7); g.ellipse(38, -26, 9, 7, 0, 0, 7); g.fill();
      g.fillStyle = "#eef2fa"; g.beginPath(); g.ellipse(0, -70, 80, 16, 0, 0, 7); g.fill(); }
    if (kind === 1) dish(g, 0, 40, 1.1, "food", 0);
    if (kind === 2) { for (let i = 0; i < 16; i++) { const a = i * 2.4, r = (i % 5) * 16; kshape(g, ell(Math.cos(a) * r * 1.3, 20 + Math.sin(a) * r * .5 - (4 - (i % 5)) * 8, 16, 12, i), i % 2 ? "#b8733a" : "#9a5a2c", { rw: 3, sw: 5 }); } }
    g.restore(); }
  KZ.shot("hFood", (lt, d, t) => { navy(t, 1); const names = ["CAT FOOD", "DOG FOOD", "BISCUITS"], step = d * .22;
    names.forEach((n, i) => { const a = (lt - .1 - i * step) / .35; if (a <= 0) return; const x = W * (i === 2 ? .44 : .24 + (i % 2) * .42), y = H * (i === 2 ? .5 : .25) + Math.sin(t * 2 + i) * 6;
      g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, 150 * clamp(a, 0, 1), "rgba(120,255,200,.25)"); g.restore();
      food(i, x, y, easeBack(a) * 1.6); txt(n, x, y + 170, 44, "#fff", { stroke: 8, a: clamp(a * 2, 0, 1) }); });
    if (lt > d * .75) txt("meaty, not fishy", W * .44, H * .65, 40, "#a6ffd0", { a: sm((lt - d * .75) / .3) }); });

  KZ.shot("hWater", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-110, -80, k), -200, lerp(1.25, 1.35, k));
    const down = sm(lt / (d * .35)); const put = lt > d * .35;
    at(rudi, -330, 0, .9, { t, arm: lerp(.2, .75, down), hold: put ? null : "water", mouth: "smile" });
    if (put) dish(g, 40, 8, .8, "water", t);
    const p = sm((lt - d * .2) / (d * .45)); at(hog, lerp(420, 190, p), 12, .7, { t, walk: p < 1 ? 1 : 0, lick: p >= 1, eat: p >= 1 ? .5 : 0, look: -.5 }, true);
    if (lt > d * .55) stamp("APPROVED", W * .44, H * .26, (lt - d * .55) / .3, "#2fae6a", -.05); });

  KZ.shot("hLeaves", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-40, 0, k), -140, lerp(1.5, 1.7, k));
    // Laubhaufen wächst
    const n = Math.floor(clamp(lt / (d * .6), 0, 1) * 60);
    for (let i = 0; i < n; i++) { const a = (i * 2.399) % 6.283, r = Math.sqrt(i / 60) * 1; leaf(g, Math.cos(a) * r * 190, -Math.abs(Math.sin(a)) * r * 120 - 4, 1.5, i * 1.3, leafCols[i % 4]); }
    for (let i = 0; i < 6; i++) { const q = ((lt * .5 + i / 6) % 1); if (lt > d * .65) continue; leaf(g, -150 + i * 60 + Math.sin(q * 6 + i) * 30, lerp(-700, -60, q), 1.5, q * 8 + i, leafCols[i % 4]); }
    // Igel krabbelt hinein
    const p = sm((lt - d * .45) / (d * .35)); if (p < 1) at(hog, lerp(480, 120, p), 6, .6, { t, walk: 1, look: -.5 }, true);
    g.save(); g.globalAlpha = sm((lt - d * .7) / .3); for (let i = 0; i < 3; i++) { const q = (lt * .7 + i / 3) % 1; g.font = `900 ${40 + i * 10}px "Montserrat"`; g.fillStyle = "#fff"; g.textAlign = "center"; g.fillText("z", 40 + q * 60 + i * 20, -150 - q * 120 - i * 30); } g.restore();
    if (lt > d * .55) stamp("WINTER BED", W * .44, H * .24, (lt - d * .55) / .3, "#ff8a2b", .05); });

  KZ.shot("hHotel", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-60, -20, k), -240, lerp(1.1, 1.2, k));
    at(rudi, -360, 0, .9, { t, arm: .3, mouth: "grin" });
    dish(g, 60, 10, .6, "food", t); dish(g, 230, 20, .6, "water", t); at(hog, 120, 40, .62, { t, eat: .5 + .3 * Math.sin(t * 5), look: -.6 }, true);
    for (let i = 0; i < 5; i++) leaf(g, 380 + Math.cos(i * 2.4) * 60, -10 - Math.abs(Math.sin(i * 2.4)) * 40, 1.4, i, leafCols[i % 4]);
    for (let i = 0; i < 6; i++) { const q = (lt * .6 + i / 6) % 1; g.save(); g.translate(0, 0); heart(-20 + i * 70, -140 - q * 200, 1.4, 1 - q); g.restore(); }
    stamp("5-STAR HOTEL", W * .44, H * .27, lt / .35, "#2fae6a", -.05); for (let i = 0; i < 4; i++) sparkle(W * (.15 + i * .2), H * (.18 + (i % 2) * .1) + Math.sin(t * 3 + i) * 8, 22, sm(lt / .4)); });
})();
