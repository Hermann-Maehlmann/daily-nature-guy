// Szenendatei "Bats Aren't Actually Blind" (Zwergfledermaus Pipistrellus pipistrellus, Comedy-Story + Mix-Stil, 16.11.2026).
// Quellen: Smithsonian ("Blind as a bat ... is false. All bats can see"), Bat Conservation International ("First things first – bats are NOT blind!", 300.000-800.000 Stäbchen/mm² vs. Mensch ~150.000, 1.400+ Arten), USGS, Bat Conservation Trust (Echoortung), Wildlife Trusts (passt in eine Streichholzschachtel, frisst leicht 3.000 Insekten pro Nacht), BCI FAQ (nie mit bloßen Händen anfassen).
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#3f58b0", "#5a6cc4", "#45509a", "#22285e"], hills: [["#2a6a5a", "#327a66"], ["#22584c", "#2a6858"], ["#1a463e", "#22564a"]], corals: false, rays: false, dust: "255,236,190" };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86",
    red: "#ec3a2e", redL: "rgba(255,210,190,.85)", blk: "#1b1724", blkL: "rgba(170,170,255,.45)", pale: "#f4d27a",
    lawn: "#3f9a5a", lawnT: "#5ab872", hedge: "#24704f", leaf: "#4cb862", leafD: "#2f8a48", wood: "#b9773f", woodD: "#7e4a22", ring: "#e2b47a",
    goo: "#ffd53a", aphid: "#9be36a", tit: "#3f8fe0", titY: "#ffd84a", titG: "#7fae4a" };
  function txt(s, x, y, size, col, o) { o = o || {}; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = o.a ?? 1; g.font = `${o.w || 800} ${size}px "Montserrat"`; g.textAlign = o.align || "center"; g.textBaseline = "middle";
    if (o.stroke) { g.lineJoin = "round"; g.lineWidth = o.stroke; g.strokeStyle = "rgba(0,0,0,.75)"; g.strokeText(s, x, y); } g.fillStyle = col; g.fillText(s, x, y); g.restore(); }
  function stamp(s, x, y, p, col, rot) { if (p <= 0) return; p = Math.min(p, 1); const k = easeBack(p); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(rot ?? -.08); g.scale(k * (1 + (1 - p) * .6), k * (1 + (1 - p) * .6)); g.globalAlpha = clamp(p * 3, 0, 1);
    g.font = '900 64px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; const w = g.measureText(s).width + 70;
    g.fillStyle = "rgba(10,10,30,.35)"; g.beginPath(); g.roundRect(-w / 2 + 8, -50 + 10, w, 100, 22); g.fill();
    g.fillStyle = col; g.beginPath(); g.roundRect(-w / 2, -50, w, 100, 22); g.fill();
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 6; g.beginPath(); g.roundRect(-w / 2 + 10, -40, w - 20, 80, 16); g.stroke();
    g.fillStyle = "#fff"; g.fillText(s, 0, 4); g.restore(); }
  function navy(t, tint) {
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, tint ? "#1b4a4a" : "#232a6b"); bg.addColorStop(1, tint ? "#0b2228" : "#0d1236"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = "rgba(255,255,255,.07)"; for (let y = 40; y < H; y += 60) for (let x = 30; x < W; x += 60) { g.beginPath(); g.arc(x + Math.sin(t * .5) * 6, y, 3, 0, 7); g.fill(); }
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .5, H * .4, 700, tint ? "rgba(80,220,180,.18)" : "rgba(120,140,255,.2)"); g.restore();
  }
  function zoomScreen(z) { g.setTransform(z, 0, 0, z, W / 2 * (1 - z), H * .42 * (1 - z)); }
  function sparkle(x, y, r, a) { if (a <= 0) return; g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, r * 2.4, `rgba(255,230,140,${.6 * a})`); g.fillStyle = `rgba(255,250,220,${a})`; g.beginPath(); for (let i = 0; i < 8; i++) { const ang = i / 8 * 6.283, rr = i % 2 ? r * .3 : r; g.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } g.fill(); g.restore(); }
  function cross(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#ff4d5a"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(-50, -50); g.lineTo(50, 50); g.moveTo(50, -50); g.lineTo(-50, 50); g.stroke(); g.restore(); }
  function check(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#7ef0b0"; g.lineWidth = 22; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(-50, 0); g.lineTo(-14, 36); g.lineTo(54, -40); g.stroke(); g.restore(); }
  function heart(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col || "#ff4d6d"; c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(-18, -6, -8, -20, 0, -10); c.bezierCurveTo(8, -20, 18, -6, 0, 8); c.fill(); c.restore(); }
  function lawn(t, cx, cy, z) {
    reef(t, cx * .3, 0, 1, PAL);
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.globalCompositeOperation = "lighter"; glow(W * .22, H * .1, 360, "rgba(255,230,160,.35)"); g.restore();
    g.fillStyle = "#fff1c4"; g.beginPath(); g.arc(W * .22, H * .1, 60, 0, 7); g.fill();
    cam(cx, cy, z);
    for (let i = 0; i < 12; i++) { const x = -2400 + i * 420, s = .9 + (i % 3) * .18; kshape(g, (c) => { c.beginPath(); c.ellipse(x, -40, 200 * s, 190 * s, 0, Math.PI, 0); c.ellipse(x + 150 * s, -30, 150 * s, 140 * s, 0, Math.PI, 0); c.closePath(); }, C.hedge, { rim: "rgba(170,255,210,.3)", rw: 6, sw: 14 }); }
    g.fillStyle = "rgba(255,200,220,.5)"; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(-2300 + (i * 233) % 4600, -60 - (i * 71) % 260, 7, 0, 7); g.fill(); }
    const sg = g.createLinearGradient(0, -20, 0, 1200); sg.addColorStop(0, C.lawn); sg.addColorStop(1, "#1d5a3a"); g.fillStyle = sg; g.fillRect(-3000, -20, 6000, 3000);
    g.strokeStyle = C.lawnT; g.lineWidth = 6; g.lineCap = "round"; for (let i = 0; i < 260; i++) { const x = -2600 + (i * 37) % 5200 + (i % 7) * 3, y = -14 + Math.floor(i / 140) * 60 + (i % 5) * 12, h = 18 + (i % 4) * 8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(t * 1.3 + i) * 4, y - h); g.stroke(); }
  }
  // ---------- Rudi (eigene Menschenfigur): Füße bei y=0, Höhe ~540, schaut nach rechts ----------
  // ---------- Rudi (Füße bei y=0, Höhe ~540, schaut nach rechts; sit = Sitzpose, tired = Augenringe) ----------
  function rudi(c, o) { const t = o.t || 0, br = Math.sin(t * 2.2) * 4, arm = o.arm ?? 0;
    c.save(); if (!o.armOnly) {
    const step = o.walk ? Math.sin(t * (o.slow ? 4 : 8)) * 18 : 0;
    if (o.sit) { c.strokeStyle = C.jeans; c.lineWidth = 30; c.lineCap = "round"; c.lineJoin = "round"; for (const x of [-20, 20]) { c.beginPath(); c.moveTo(x, -130); c.lineTo(x + 140, -122); c.lineTo(x + 146, -122 + o.sit - 16); c.stroke(); }
      c.fillStyle = "#2a2233"; for (const x of [-20, 20]) { c.beginPath(); c.ellipse(x + 162, -8 - 122 + o.sit, 30, 13, 0, 0, 7); c.fill(); } } else {
    c.strokeStyle = C.jeans; c.lineWidth = 30; c.lineCap = "round"; for (const [x, s] of [[-26, 1], [26, -1]]) { c.beginPath(); c.moveTo(x, -130); c.lineTo(x + 4 + step * s, -16); c.stroke(); }
    c.fillStyle = "#2a2233"; for (const [x, s] of [[-26, 1], [26, -1]]) { c.beginPath(); c.ellipse(x + 16 + step * s, -8, 30, 13, 0, 0, 7); c.fill(); } }
    const back = o.arm2 != null ? o.arm2 : null;
    c.strokeStyle = C.coatD; c.lineWidth = 28; c.beginPath(); c.moveTo(-40, -330 + br);
    if (back != null) { const a = lerp(1.6, -2.4, back); c.lineTo(-40 + Math.cos(a) * 150, -330 + br + Math.sin(a) * 150); } else c.quadraticCurveTo(-74, -250, -54, -190); c.stroke();
    kshape(c, (c) => { c.beginPath(); c.moveTo(-82, -120); c.bezierCurveTo(-96, -260, -78, -350 + br, 0, -352 + br); c.bezierCurveTo(78, -350 + br, 96, -260, 82, -120); c.quadraticCurveTo(0, -100, -82, -120); c.closePath(); }, C.coat, { rim: "rgba(255,245,200,.7)", shadow: "rgba(90,40,10,.25)", rw: 7, sw: 22 });
    c.fillStyle = "#e09a22"; c.fillRect(-4, -340 + br, 8, 220); c.fillStyle = "#fff6"; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(16, -300 + i * 60 + br, 6, 0, 7); c.fill(); }
    c.save(); c.translate(0, br);
    kshape(c, ell(6, -430, 80, 78, 0), C.skin, { rim: "rgba(255,240,225,.8)", shadow: "rgba(150,60,40,.22)", rw: 6, sw: 18 });
    c.fillStyle = "rgba(240,120,110,.35)"; c.beginPath(); c.ellipse(60, -400, 16, 10, 0, 0, 7); c.fill();
    kshape(c, (c) => { c.beginPath(); c.moveTo(-76, -440); c.bezierCurveTo(-80, -530, 90, -530, 86, -440); c.closePath(); }, C.hat, { rim: "rgba(255,200,200,.6)", rw: 5, sw: 12 });
    c.fillStyle = "#c23238"; c.beginPath(); c.roundRect(-80, -456, 168, 26, 13); c.fill();
    kshape(c, ell(4, -522, 20, 20, 0), "#fff1e8", { rw: 3, sw: 6 });
    if (o.sleep) { c.strokeStyle = "#3a2030"; c.lineWidth = 6; c.lineCap = "round"; for (const ex of [28, 66]) { c.beginPath(); c.arc(ex, -422, 13, .3, 2.8); c.stroke(); } }
    else { fig.eye(c, 28, -418, 15, { t, seed: 3, look: o.look ?? .5, mood: o.mood }); fig.eye(c, 66, -418, 15, { t, seed: 3, look: o.look ?? .5, mood: o.mood }); }
    if (o.tired) { c.strokeStyle = "rgba(110,60,140,.75)"; c.lineWidth = 6; c.lineCap = "round"; for (const ex of [28, 66]) { c.beginPath(); c.arc(ex, -416, 19, .35, 2.8); c.stroke(); }
      c.fillStyle = C.skin; c.beginPath(); c.rect(6, -446, 84, 20); c.fill(); }
    c.strokeStyle = "#7a2a2a"; c.lineWidth = 6; c.lineCap = "round"; c.fillStyle = "#7a2a2a";
    if (o.mouth === "o") { c.beginPath(); c.ellipse(52, -378, 10, 13, 0, 0, 7); c.fill(); }
    else if (o.mouth === "grin") { c.beginPath(); c.moveTo(30, -384); c.quadraticCurveTo(52, -350, 76, -386); c.closePath(); c.fill(); c.fillStyle = "#fff"; c.fillRect(36, -384, 34, 7); }
    else if (o.mouth === "hmm") { c.beginPath(); c.moveTo(36, -378); c.lineTo(70, -384); c.stroke(); }
    else if (o.mouth === "scream") { c.beginPath(); c.ellipse(52, -374, 16, 22, 0, 0, 7); c.fill(); }
    else { c.beginPath(); c.arc(52, -392, 20, .3, 2.8); c.stroke(); }
    c.restore();
    }
    const sx = 30, sy = -330 + br; let hx, hy;
    if (arm >= 1.5) { const k = arm - 1.5; hx = lerp(80, -70, clamp(k * 2, 0, 1)); hy = lerp(-200, -470, clamp(k * 2, 0, 1)) + Math.sin(t * 14) * 6 * clamp(k * 2, 0, 1); }
    else { const a = lerp(1.35, -1.3, clamp(arm, 0, 1)); hx = sx + Math.cos(a) * 150; hy = sy + Math.sin(a) * 150; }
    if (o.hand) { hx = o.hand[0]; hy = o.hand[1]; }
    c.strokeStyle = C.coat; c.lineWidth = 30; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2 + 20, (sy + hy) / 2 + 20, hx, hy); c.stroke();
    if (o.watch) { c.save(); c.translate(hx + 8, hy - 30); kshape(c, ell(0, 0, 38, 38, 0), "#e9edf7", { rim: "rgba(255,255,255,.9)", rw: 4, sw: 6 }); c.fillStyle = "#3a3f6a"; c.fillRect(-8, -50, 16, 14);
      c.strokeStyle = "#e5484d"; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(t * 6) * 28, -Math.cos(t * 6) * 28); c.stroke(); c.restore(); }
    if (o.case) { c.save(); c.translate(hx, hy + 20); kshape(c, (c) => { c.beginPath(); c.roundRect(-70, 0, 140, 110, 14); }, "#3f8fe0", { rim: "rgba(220,240,255,.7)", rw: 4, sw: 8 }); c.strokeStyle = "#2a2233"; c.lineWidth = 8; c.beginPath(); c.arc(0, 0, 22, Math.PI, 0); c.stroke(); c.restore(); }
    c.fillStyle = C.skin; c.beginPath(); c.arc(hx, hy, 20, 0, 7); c.fill();
    c.restore(); return { hx, hy }; }
  function at(fn, x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); const r = fn(g, o); g.restore(); return r; }

  // ---------- Farbfilter (Bildschirm): "gray" = Schwarzweiß-Mythos, "dog" = Hunde-Sicht (2 Zapfen, Deuteranopie-Näherung nach Viénot) ----------
  function filt(mode, x0, x1, circ) { x0 = Math.max(0, Math.floor(x0)); x1 = Math.min(W, Math.ceil(x1)); if (x1 - x0 < 2) return;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const im = g.getImageData(x0, 0, x1 - x0, H), d = im.data, w = x1 - x0;
    for (let i = 0, n = d.length; i < n; i += 4) {
      if (circ) { const p = i / 4, px = x0 + p % w, py = Math.floor(p / w); if ((px - circ[0]) ** 2 + (py - circ[1]) ** 2 > circ[2] * circ[2]) continue; }
      const r = d[i], gg = d[i + 1], b = d[i + 2];
      if (mode === "gray") { const l = .3 * r + .59 * gg + .11 * b; d[i] = d[i + 1] = d[i + 2] = l; }
      else { const y = .29 * r + .71 * gg; const l = .3 * r + .59 * gg + .11 * b; const yy = lerp(y, l, .12), bb = lerp(b, l, .12); d[i] = yy; d[i + 1] = yy * .97; d[i + 2] = bb; } }
    g.putImageData(im, x0, 0); g.restore(); }
  function hx2(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function dogC(hex) { const [r, gg, b] = hx2(hex); const y = .29 * r + .71 * gg; return `rgb(${Math.round(y)},${Math.round(y * .97)},${b})`; }

  // ================= Hund (goldener Mischling, Seitenansicht, Kopf rechts, Pfoten y=0, Länge ~700, Höhe ~560) =================
  // o: t, walk (Lauftempo, 0 = steht), run (0..1 Galopp-Weite), wag (0..1), sniff (0..1 Kopf runter), turn (Kopf hoch/zurück -1..1), look, mood, mouth ("open"|"ball"), gray, glowEyes, ballCol
  const DG = { coat: "#eca848", coatD: "#c98632", belly: "#f7d79e", muz: "#f6cf92", ear: "#b8742a", nose: "#2a1e22", collar: "#3f7fe0", tag: "#ffd84a", tongue: "#ff6f8a" };
  const DGG = { coat: "#9a9a9a", coatD: "#7a7a7a", belly: "#bdbdbd", muz: "#b4b4b4", ear: "#6a6a6a", nose: "#2a2a2a", collar: "#5a5a5a", tag: "#c8c8c8", tongue: "#a0a0a0" };
  function dogLeg(c, pts, col, w) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke();
    const p = pts[pts.length - 1]; c.fillStyle = col; c.beginPath(); c.ellipse(p[0] + 14, p[1] - 4, 34, 18, 0, 0, 7); c.fill(); }
  function legPose(hip, back, a, lift) { // Bein rotiert um die Hüfte, Pfote angehoben
    const P = back ? [[0, 0], [22, 92], [-22, 150], [-8, 200]] : [[0, 0], [4, 100], [8, 200]];
    return P.map(([x, y], i) => { const yy = y - (i === P.length - 1 ? lift : i ? lift * .4 : 0); return [hip[0] + x * Math.cos(a) - yy * Math.sin(a), hip[1] + x * Math.sin(a) + yy * Math.cos(a)]; }); }
  function dog(c, o) { o = o || {}; const t = o.t || 0, P = o.gray ? DGG : DG, seed = o.seed || 0;
    const mv = o.walk ? 1 : 0, ph = t * (o.walk || 0), amp = (o.run ? .55 : .32) * mv;
    const br = Math.sin(t * 2.6 + seed) * 3, bob = mv ? Math.abs(Math.sin(ph)) * (o.run ? 26 : 10) : 0;
    c.save(); c.translate(0, -bob);
    const lp = (k, back) => { const s = Math.sin(ph + k); return [s * amp, mv ? Math.max(0, Math.cos(ph + k)) * (o.run ? 50 : 30) : 0]; };
    // ferne Beine (dunkler)
    let [a, l] = lp(Math.PI, true); dogLeg(c, legPose([-120, -200], true, a, l), P.coatD, 44);
    [a, l] = lp(0, false); dogLeg(c, legPose([150, -200], false, a, l), P.coatD, 42);
    // Schwanz
    const wag = Math.sin(t * (o.wagF || 10) + seed) * (o.wag ?? .4);
    c.save(); c.translate(-215, -275); c.rotate(-.2 + wag * .5);
    kshape(c, (c) => { c.beginPath(); c.moveTo(0, -14); c.quadraticCurveTo(-90, -40, -130, -150); c.quadraticCurveTo(-112, -160, -100, -140); c.quadraticCurveTo(-60, -50, 10, 16); c.closePath(); }, P.coat, { rim: "rgba(255,240,200,.6)", rw: 4, sw: 8 });
    c.restore();
    // Körper
    kshape(c, (c) => { c.beginPath(); c.moveTo(-230, -250); c.bezierCurveTo(-210, -320 + br, 40, -330 + br, 150, -320 + br); c.bezierCurveTo(230, -310, 236, -220, 196, -180); c.bezierCurveTo(150, -150, 90, -170, 40, -168); c.bezierCurveTo(-40, -166, -110, -150, -170, -160); c.bezierCurveTo(-232, -170, -244, -220, -230, -250); c.closePath(); }, P.coat, { rim: "rgba(255,240,200,.7)", shadow: "rgba(110,50,0,.25)", rw: 7, sw: 22 });
    c.fillStyle = P.belly; c.globalAlpha = .7; c.beginPath(); c.ellipse(140, -205, 60, 34, -.3, 0, 7); c.fill(); c.globalAlpha = 1;
    // nahe Beine
    [a, l] = lp(Math.PI * .5, true); dogLeg(c, legPose([-150, -210], true, a, l), P.coat, 48);
    c.fillStyle = P.coat; c.beginPath(); c.ellipse(-150, -215, 70, 64, 0, 0, 7); c.fill();
    [a, l] = lp(Math.PI * 1.5, false); dogLeg(c, legPose([130, -205], false, a, l), P.coat, 46);
    // Kopf + Hals (dreht um den Halsansatz)
    c.save(); const piv = [150, -300]; c.translate(piv[0], piv[1] + br); c.rotate((o.sniff || 0) * .85 - (o.turn || 0) * .25); c.translate(-piv[0], -piv[1]);
    kshape(c, (c) => { c.beginPath(); c.moveTo(80, -300); c.quadraticCurveTo(130, -430, 220, -480); c.lineTo(296, -430); c.quadraticCurveTo(246, -320, 220, -200); c.closePath(); }, P.coat, { rim: "rgba(255,240,200,.65)", rw: 6, sw: 16 });
    // Halsband
    c.save(); c.translate(196, -370); c.rotate(.55); kshape(c, (c) => { c.beginPath(); c.roundRect(-78, -18, 156, 36, 14); }, P.collar, { rim: "rgba(220,240,255,.7)", rw: 4, sw: 6 }); c.restore();
    kshape(c, (c) => { c.beginPath(); c.arc(214, -322, 17, 0, 7); }, P.tag, { rim: "rgba(255,255,230,.9)", rw: 3, sw: 4 });
    // Schädel
    kshape(c, ell(262, -462, 86, 74, -.1), P.coat, { rim: "rgba(255,240,200,.75)", shadow: "rgba(110,50,0,.2)", rw: 6, sw: 14 });
    // Schnauze
    const open = o.mouth === "open" || o.mouth === "ball" ? 1 : 0;
    kshape(c, (c) => { c.beginPath(); c.moveTo(300, -486); c.quadraticCurveTo(360, -480, 392, -462); c.quadraticCurveTo(410, -446, 398, -424); c.quadraticCurveTo(360, -408, 306, -412); c.closePath(); }, P.muz, { rim: "rgba(255,250,230,.8)", rw: 4, sw: 8 });
    if (open) { c.fillStyle = "#5a2230"; c.beginPath(); c.moveTo(310, -414); c.quadraticCurveTo(360, -412, 392, -424); c.quadraticCurveTo(372, -372, 318, -388); c.closePath(); c.fill();
      if (o.mouth === "open") { c.fillStyle = P.tongue; c.beginPath(); c.ellipse(342, -380 + Math.sin(t * 9) * 4, 22, 32, .2, 0, 7); c.fill(); }
      kshape(c, (c) => { c.beginPath(); c.moveTo(312, -392); c.quadraticCurveTo(352, -384, 380, -398); c.quadraticCurveTo(366, -370, 316, -376); c.closePath(); }, P.muz, { rw: 3, sw: 4 }); }
    else { c.strokeStyle = "rgba(90,40,20,.7)"; c.lineWidth = 5; c.lineCap = "round"; c.beginPath(); c.moveTo(392, -424); c.quadraticCurveTo(350, -404, 318, -414); c.stroke(); }
    if (o.munch) { const ch = Math.sin(t * 11) * 5; c.strokeStyle = "#5ab872"; c.lineCap = "round"; c.lineWidth = 9;
      for (let i = 0; i < 6; i++) { const bx = 330 + i * 12, ln = 70 + (i % 3) * 30; c.beginPath(); c.moveTo(bx, -412 + ch * .3); c.quadraticCurveTo(bx + 18 + Math.sin(t * 7 + i) * 8, -380, bx - 8 + (i - 3) * 10 + Math.sin(t * 9 + i) * 10, -412 + ln + ch); c.stroke(); }
      c.strokeStyle = "#3f9a5a"; c.lineWidth = 7; for (let i = 0; i < 4; i++) { const bx = 340 + i * 15; c.beginPath(); c.moveTo(bx, -408); c.lineTo(bx - 20 + i * 12 + Math.sin(t * 8 + i) * 8, -408 + 60 + i * 12); c.stroke(); } }
    if (o.mouth === "ball") { kshape(c, (c) => { c.beginPath(); c.arc(366, -404, 34, 0, 7); }, o.ballCol || "#ffd84a", { rim: "rgba(255,255,230,.9)", rw: 4, sw: 6 }); }
    kshape(c, ell(398, -458, 22, 16, .1), P.nose, { rim: "rgba(255,255,255,.5)", rw: 3, sw: 3 });
    c.fillStyle = "rgba(255,255,255,.55)"; c.beginPath(); c.ellipse(404, -464, 7, 4, 0, 0, 7); c.fill();
    // Auge + Braue
    fig.eye(c, 300, -490, 19, { t, seed: seed + 2, look: o.look ?? .5, mood: o.mood });
    if (o.glowEyes) { c.save(); c.globalCompositeOperation = "lighter"; glow(305, -490, 70, `rgba(190,255,140,${.75 * o.glowEyes})`); c.fillStyle = `rgba(210,255,170,${.85 * o.glowEyes})`; c.beginPath(); c.arc(305, -490, 15, 0, 7); c.fill(); c.restore(); }
    c.strokeStyle = P.coatD; c.lineWidth = 6; c.beginPath(); c.moveTo(282, -520); c.quadraticCurveTo(300, -528 - (o.mood === "scared" ? 8 : 0), 318, -520); c.stroke();
    // Schlappohr
    c.save(); c.translate(232, -508); c.rotate(Math.sin(t * 3 + seed) * .06 + (o.run ? Math.sin(ph) * .15 : 0) + (o.perk ? -.35 * o.perk : 0));
    kshape(c, (c) => { c.beginPath(); c.moveTo(-14, -6); c.quadraticCurveTo(34, -18, 38, 26); c.quadraticCurveTo(40, 104, 10, 128); c.quadraticCurveTo(-24, 134, -30, 100); c.quadraticCurveTo(-36, 30, -14, -6); c.closePath(); }, P.ear, { rim: "rgba(255,220,170,.5)", rw: 4, sw: 8 });
    c.restore();
    c.restore(); c.restore(); }
  function dogAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); dog(g, o); g.restore(); }

  // ---------- Requisiten ----------
  function ball(x, y, r, col, rot) { g.save(); g.translate(x, y); g.rotate(rot || 0);
    kshape(g, (c) => { c.beginPath(); c.arc(0, 0, r, 0, 7); }, col, { rim: "rgba(255,255,255,.8)", shadow: "rgba(0,0,0,.25)", rw: r * .12, sw: r * .3 });
    g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = r * .1; g.beginPath(); g.arc(-r * 1.1, 0, r * .9, -.8, .8); g.stroke(); g.beginPath(); g.arc(r * 1.1, 0, r * .9, Math.PI - .8, Math.PI + .8); g.stroke(); g.restore(); }
  function flowerSm(x, y, s, t, col) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = "#2f8a48"; g.lineWidth = 10; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 150); g.stroke(); g.rotate(Math.sin(t * 1.4 + x) * .06);
    for (let i = 0; i < 6; i++) { g.save(); g.rotate(i * Math.PI / 3); kshape(g, ell(0, -34, 20, 32, 0), col, { rim: "rgba(255,240,240,.8)", rw: 3, sw: 4 }); g.restore(); }
    kshape(g, ell(0, 0, 20, 20, 0), "#ffcf3a", { rw: 3, sw: 4 }); g.restore(); }
  function park(t, cx, cy, z) { lawn(t, cx, cy, z);
    [[-1500, "#ff4d6d"], [-1150, "#ff9a3a"], [-820, "#e5484d"], [-480, "#ff4d6d"], [-160, "#ff9a3a"], [980, "#e5484d"], [1240, "#ff4d6d"], [1180, "#ff9a3a"], [1520, "#e5484d"]].forEach(([fx, col], i) => flowerSm(fx, -150 - (i % 2) * 40, .9, t, col)); }
  function nightPark(t, cx, cy, z) {
    reef(t, cx * .3, 0, 1, { sky: ["#0d1238", "#121a4a", "#0c1236", "#060a20"], hills: [["#112a3a", "#163446"], ["#0d2230", "#122a3a"], ["#081822", "#0d202c"]], corals: false, rays: false, dust: "200,220,255" });
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.globalCompositeOperation = "lighter"; glow(W * .72, H * .1, 300, "rgba(200,220,255,.35)"); g.restore();
    g.fillStyle = "#eef2ff"; g.beginPath(); g.arc(W * .72, H * .1, 64, 0, 7); g.fill(); g.fillStyle = "#0d1238"; g.beginPath(); g.arc(W * .72 + 30, H * .1 - 14, 56, 0, 7); g.fill();
    g.fillStyle = "#fff"; for (let i = 0; i < 40; i++) { g.globalAlpha = .4 + .4 * Math.sin(t * 2 + i); g.beginPath(); g.arc((i * 263) % W, (i * 97) % (H * .3), 3, 0, 7); g.fill(); } g.globalAlpha = 1;
    cam(cx, cy, z);
    const sg = g.createLinearGradient(0, -20, 0, 1200); sg.addColorStop(0, "#1c3a40"); sg.addColorStop(1, "#0c1c22"); g.fillStyle = sg; g.fillRect(-3000, -20, 6000, 3000);
    g.strokeStyle = "#24484e"; g.lineWidth = 6; g.lineCap = "round"; for (let i = 0; i < 200; i++) { const x = -2600 + (i * 37) % 5200, y = -14 + (i % 5) * 12, h = 18 + (i % 4) * 8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(t * 1.3 + i) * 4, y - h); g.stroke(); } }
  function fence(t, x0, x1) { for (let x = x0; x < x1; x += 130) kshape(g, (c) => { c.beginPath(); c.moveTo(x - 30, 0); c.lineTo(x - 30, -400); c.lineTo(x, -440); c.lineTo(x + 30, -400); c.lineTo(x + 30, 0); c.closePath(); }, "#c48a52", { rim: "rgba(255,230,190,.6)", rw: 4, sw: 8 });
    kshape(g, (c) => { c.beginPath(); c.rect(x0 - 60, -360, x1 - x0 + 60, 36); c.rect(x0 - 60, -170, x1 - x0 + 60, 36); }, "#b07842", { rim: "rgba(255,230,190,.5)", rw: 4, sw: 6 }); }
  // Eichhörnchen (Seitenansicht, Kopf rechts, Pfoten y=0, Länge ~260)
  function squirrel(c, o) { const t = o.t || 0, run = o.run ? Math.sin(t * 22) : 0;
    c.save(); c.translate(0, -Math.abs(run) * 14);
    kshape(c, (c) => { c.beginPath(); c.moveTo(-60, -40); c.bezierCurveTo(-200, -20, -220, -200, -140, -230); c.bezierCurveTo(-60, -260, -40, -170, -100, -140); c.bezierCurveTo(-130, -120, -110, -70, -60, -60); c.closePath(); }, "#c8642e", { rim: "rgba(255,210,170,.7)", rw: 5, sw: 10 });
    c.fillStyle = "#a84e22"; c.beginPath(); c.ellipse(-30 + run * 12, -12, 30, 12, 0, 0, 7); c.ellipse(60 - run * 12, -10, 22, 10, 0, 0, 7); c.fill();
    kshape(c, ell(10, -70, 80, 50, -.15), "#c8642e", { rim: "rgba(255,210,170,.7)", rw: 5, sw: 10 });
    c.fillStyle = "#f6e0c0"; c.beginPath(); c.ellipse(40, -50, 40, 22, -.3, 0, 7); c.fill();
    kshape(c, ell(92, -112, 42, 36, 0), "#c8642e", { rim: "rgba(255,210,170,.7)", rw: 4, sw: 8 });
    kshape(c, (c) => { c.beginPath(); c.moveTo(70, -140); c.lineTo(80, -186); c.lineTo(100, -142); c.closePath(); }, "#a84e22", { rw: 3, sw: 4 });
    fig.eye(c, 106, -118, 12, { t, seed: 5, look: .6 }); c.fillStyle = "#2a1e22"; c.beginPath(); c.arc(132, -106, 6, 0, 7); c.fill(); c.restore(); }
  function qmark(x, y, s, a) { if (a <= 0) return; txt("?", x, y, 110 * s, "#fff", { a, stroke: 14, w: 900 }); }
  function bubble(s, x, y, a, r) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(r || 0); g.scale(easeBack(Math.min(a, 1)), easeBack(Math.min(a, 1)));
    g.font = '800 50px "Montserrat"'; const w = g.measureText(s).width + 64; g.fillStyle = "#fff"; g.beginPath(); g.roundRect(-w / 2, -50, w, 100, 50); g.fill(); g.beginPath(); g.moveTo(-24, 42); g.lineTo(-44, 84); g.lineTo(8, 46); g.fill();
    g.fillStyle = "#1b1d3a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 0, 2); g.restore(); }

  // ================= Neu: Hund frisst Gras (Comedy-Eskalation mit Rudi) =================
  function tuft(x, y, h, t, s) { g.save(); g.translate(x, y); g.scale(s || 1, s || 1); g.lineCap = "round";
    for (let i = 0; i < 9; i++) { const bx = (i - 4) * 14, hh = h * (.6 + (i % 3) * .2); g.strokeStyle = i % 2 ? "#5ab872" : "#3f9a5a"; g.lineWidth = 12;
      g.beginPath(); g.moveTo(bx, 0); g.quadraticCurveTo(bx + (i - 4) * 4, -hh * .5, bx + (i - 4) * 9 + Math.sin(t * 2 + i) * 8, -hh); g.stroke(); } g.restore(); }
  function sweat(x, y, t, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; for (let i = 0; i < 3; i++) { const ph = (t * 1.6 + i / 3) % 1; g.fillStyle = "#8fd8ff"; g.beginPath(); const sx = x + (i - 1) * 46, sy = y + ph * 90; g.moveTo(sx, sy - 22); g.quadraticCurveTo(sx + 16, sy, sx, sy + 12); g.quadraticCurveTo(sx - 16, sy, sx, sy - 22); g.fill(); } g.restore(); }
  function munchDog(x, s, t, o) { dogAt(x, 0, s, Object.assign({ t, sniff: .95, munch: 1, wag: .7, wagF: 8, look: .2 }, o || {})); tuft(x + 300 * s, 0, 120, t, s * 1.1); }
  function ladderFence(x0, x1, p) { if (p <= 0) return; g.save(); const k = easeBack(Math.min(p, 1)); g.translate(0, (1 - k) * 260); g.globalAlpha = clamp(p * 3, 0, 1); fence(0, x0, x1); g.restore(); }
  function robot(x, t, a) { g.save(); g.translate(x, 0); const b = Math.sin(t * 30) * 3;
    g.fillStyle = "#2a2233"; for (const wx of [-90, 90]) { g.beginPath(); g.arc(wx, -34, 34, 0, 7); g.fill(); g.fillStyle = "#8a8fb0"; g.beginPath(); g.arc(wx, -34, 12, 0, 7); g.fill(); g.fillStyle = "#2a2233"; }
    kshape(g, (c) => { c.beginPath(); c.roundRect(-150, -150 + b, 300, 110, 46); }, "#e5484d", { rim: "rgba(255,210,200,.8)", rw: 6, sw: 14 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-70, -186 + b, 140, 50, 22); }, "#3a3f6a", { rim: "rgba(200,210,255,.6)", rw: 4, sw: 6 });
    g.fillStyle = "#7ef0b0"; g.beginPath(); g.arc(-28, -162 + b, 10, 0, 7); g.arc(28, -162 + b, 10, 0, 7); g.fill();
    g.strokeStyle = "#3a3f6a"; g.lineWidth = 8; g.beginPath(); g.moveTo(40, -186 + b); g.lineTo(60, -250 + b); g.stroke();
    g.save(); g.globalCompositeOperation = "lighter"; glow(60, -256 + b, 40, `rgba(255,90,90,${.5 + .5 * Math.sin(t * 12)})`); g.restore(); g.fillStyle = "#ff6a6a"; g.beginPath(); g.arc(60, -256 + b, 12, 0, 7); g.fill();
    g.restore(); }
  function clip(x, y, r, col) { g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = col; g.fillRect(-12, -3, 24, 6); g.restore(); }
  function sky(t) { g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2a3c96"); bg.addColorStop(1, "#6a78d0"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .8, H * .12, 300, "rgba(255,230,160,.35)"); g.restore(); g.fillStyle = "#fff1c4"; g.beginPath(); g.arc(W * .8, H * .12, 56, 0, 7); g.fill();
    g.fillStyle = "rgba(255,255,255,.75)"; for (let i = 0; i < 4; i++) { const cx = ((i * 330 + t * 30) % (W + 400)) - 200, cy = 260 + i * 210; g.beginPath(); g.ellipse(cx, cy, 120, 40, 0, 0, 7); g.ellipse(cx + 70, cy - 20, 80, 40, 0, 0, 7); g.fill(); } }
  const TOP = -3000;
  function tower(t, camY, z, rudiO, dogO) { sky(t); cam(0, camY, z);
    g.fillStyle = "#3a4aa0"; for (let i = 0; i < 9; i++) { const bx = -2200 + i * 520, bh = 600 + (i * 373) % 900; if (Math.abs(bx) < 500) continue; g.fillRect(bx - 160, -bh, 320, bh); }
    g.fillStyle = "#3f9a5a"; g.fillRect(-4000, 0, 8000, 3000);
    kshape(g, (c) => { c.beginPath(); c.rect(-300, TOP, 600, -TOP); }, "#d9dcef", { rim: "rgba(255,255,255,.8)", shadow: "rgba(40,40,90,.25)", rw: 8, sw: 40 });
    for (let y = TOP + 160; y < -60; y += 150) for (let x = -230; x < 240; x += 115) { g.fillStyle = (Math.floor(y / 150) + x) % 3 ? "#7a8ad8" : "#ffe08a"; g.fillRect(x, y, 70, 90); }
    // Balkon oben
    kshape(g, (c) => { c.beginPath(); c.rect(-300, TOP - 20, 760, 40); }, "#b9bdd8", { rim: "rgba(255,255,255,.8)", rw: 5, sw: 10 });
    g.strokeStyle = "#8a90b8"; g.lineWidth = 10; g.beginPath(); g.moveTo(-300, TOP - 150); g.lineTo(460, TOP - 150); g.stroke(); for (let x = 300; x <= 460; x += 40) { g.beginPath(); g.moveTo(x, TOP - 20); g.lineTo(x, TOP - 150); g.stroke(); }
    // Pflanzkasten mit Gras
    kshape(g, (c) => { c.beginPath(); c.roundRect(240, TOP - 120, 190, 100, 14); }, C.wood, { rim: "rgba(255,230,190,.6)", rw: 4, sw: 8 });
    tuft(335, TOP - 112, 110, t, 1);
    if (rudiO) at(rudi, -140, TOP - 20, .62, Object.assign({ t }, rudiO));
    if (dogO) { dogAt(70, TOP - 20, .42, Object.assign({ t, sniff: .6, munch: 1, wag: .7 }, dogO)); }
  }
  function card(x, y, w, h, p, head, col) { const k = easeBack(clamp(p, 0, 1)); if (k <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(k, k);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-w / 2 + 10, -h / 2 + 12, w, h, 30); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 30); g.fill();
    if (head) { g.fillStyle = col || "#2f6fd0"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, 100, [30, 30, 0, 0]); g.fill(); g.fillStyle = "#fff"; g.font = '900 44px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(head, 0, -h / 2 + 52); }
    g.restore(); }
  function dogHead(x, y, s, sick, a) { if (a <= 0) return; g.save(); g.translate(x, y); const k = easeBack(Math.min(a, 1)); g.scale(s * k, s * k);
    const col = sick ? "#9fd36a" : DG.coat; kshape(g, ell(0, 0, 60, 54, 0), col, { rim: "rgba(255,255,230,.7)", rw: 4, sw: 8 });
    kshape(g, ell(-50, -10, 20, 42, .3), sick ? "#6aa040" : DG.ear, { rw: 3, sw: 4 }); kshape(g, ell(50, -10, 20, 42, -.3), sick ? "#6aa040" : DG.ear, { rw: 3, sw: 4 });
    kshape(g, ell(0, 22, 30, 22, 0), sick ? "#c4e89a" : DG.muz, { rw: 3, sw: 4 }); g.fillStyle = DG.nose; g.beginPath(); g.ellipse(0, 12, 12, 9, 0, 0, 7); g.fill();
    g.fillStyle = "#1b1724"; if (sick) { g.lineWidth = 6; g.strokeStyle = "#1b1724"; for (const ex of [-22, 22]) { g.beginPath(); g.moveTo(ex - 9, -14); g.lineTo(ex + 9, -4); g.moveTo(ex + 9, -14); g.lineTo(ex - 9, -4); g.stroke(); } }
    else { g.beginPath(); g.arc(-22, -10, 9, 0, 7); g.arc(22, -10, 9, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(-19, -13, 3, 0, 7); g.arc(25, -13, 3, 0, 7); g.fill(); }
    g.restore(); }


  // ======================= Erdkröte (Bufo bufo) – neu gezeichnet 16.11.2026 =======================
  // Seitenansicht, Kopf rechts, Füße y=0, Länge ~330, Höhe ~185. Merkmale: gedrungen, warzige Haut (Drüsen),
  // kupferne Augen mit waagrechter Pupille, Ohrdrüsen (Parotiden) hinter den Augen, kurze Beine, Zehen.
  const T = { skin: "#b9853a", skinD: "#7a5222", skinL: "rgba(255,225,160,.75)", belly: "#f2dfb2", wart: "#8f5f26", wartL: "#e2b265", gland: "#cf9f4f", iris: "#f08a24", irisD: "#a8460e", mouth: "#4a2a12" };
  function sweatS(x, y, t, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; for (let i = 0; i < 3; i++) { const ph = (t * 1.6 + i / 3) % 1; g.fillStyle = "#8fd8ff"; g.beginPath(); const sx = x + (i - 1) * 46, sy = y + ph * 90; g.moveTo(sx, sy - 22); g.quadraticCurveTo(sx + 16, sy, sx, sy + 12); g.quadraticCurveTo(sx - 16, sy, sx, sy - 22); g.fill(); } g.restore(); }
  function wobbleAll(lt, d, t) { const z = 1 + .07 * sm(lt / d) + .012 * Math.sin(t * 3.1), ox = Math.sin(t * 1.7) * 10; const cv = g.canvas; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(cv, W * .44 * (1 - z) + ox, H * .4 * (1 - z), W * z, H * z); g.restore(); }
  // ---------- Garten bei Nacht: Dahlie, Apfelzweig mit Blattläusen ----------
  function dahlia(x, y, s, t, bite) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 1.1) * .03);
    g.strokeStyle = "#2f8a48"; g.lineWidth = 22; g.beginPath(); g.moveTo(0, 0); g.lineTo(-30, 900); g.stroke();
    kshape(g, ell(-120, 300, 110, 40, -.5), C.leafD, { rw: 4, sw: 8 });
    for (const [n, r, col, rr] of [[16, 260, "#e5487a", 0], [14, 190, "#ff6f9a", .2], [12, 120, "#ff9ab8", .1]]) for (let i = 0; i < n; i++) { const a = i / n * 6.283 + rr;
      if (bite && r === 260 && (i === 3 || i === 4)) continue;
      g.save(); g.rotate(a); kshape(g, (c) => { c.beginPath(); c.moveTo(0, -20); c.quadraticCurveTo(r * .28, -r * .55, 0, -r); c.quadraticCurveTo(-r * .28, -r * .55, 0, -20); c.closePath(); }, col, { rim: "rgba(255,230,240,.8)", shadow: "rgba(120,20,60,.25)", rw: 4, sw: 8 }); g.restore(); }
    kshape(g, ell(0, 0, 60, 60, 0), "#ffcf3a", { rim: "#fff6c8", rw: 4, sw: 8 }); g.restore(); }
  function gardenNight(t, cx, cy, z) { nightPark(t, cx, cy, z); }
  function zzz(x, y, t, a) { if (a <= 0) return; for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; txt("z", x + ph * 120 + i * 10, y - ph * 200, 50 + ph * 40, "#c9d0ff", { a: a * Math.sin(ph * Math.PI), w: 900 }); } }
  function handIcon(x, y, s, a, o) { if (a <= 0) return; o = o || {}; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); const k = easeBack(Math.min(a, 1)); g.scale(s * k, s * k);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-60, -40, 120, 120, 40); }, C.skin, { rim: "rgba(255,240,225,.9)", rw: 5, sw: 10 });
    for (let i = 0; i < 4; i++) kshape(g, (c) => { c.beginPath(); c.roundRect(-58 + i * 30, -120 + Math.abs(i - 1.5) * 10, 26, 100, 13); }, C.skin, { rim: "rgba(255,240,225,.9)", rw: 4, sw: 6 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(48, -30, 26, 80, 13); }, C.skin, { rw: 3, sw: 5 });
    if (o.wart) { g.fillStyle = "#b07a5a"; for (const [wx, wy, r] of [[-10, 10, 16], [22, 36, 11], [-30, 44, 9]]) { g.beginPath(); g.arc(wx, wy, r * o.wart, 0, 7); g.fill(); g.fillStyle = "#d6a080"; g.beginPath(); g.arc(wx + 3, wy - 4, r * .4 * o.wart, 0, 7); g.fill(); g.fillStyle = "#b07a5a"; } }
    if (o.drops) { g.fillStyle = "#8fd8ff"; for (let i = 0; i < 4; i++) { const ph = (o.t * 1.4 + i / 4) % 1; g.beginPath(); g.arc(-50 + i * 34, -140 + ph * 260, 9, 0, 7); g.fill(); } }
    g.restore(); }

  // ======================= Zwergfledermaus (Pipistrellus pipistrellus) – neu gezeichnet 16.11.2026 =======================
  // Vorderansicht fliegend: Körpermitte (0,0), Spannweite ~ ±335, Kopf bei y=-96. Merkmale: warmbraunes Fell, dunkle Flughaut
  // zwischen langen Fingerknochen (Hand-Flügel) mit Daumenkralle, kurze runde Ohren, kleine Schnauze, winzige Zähne, Füße hinten.
  const B = { fur: "#c8783e", furD: "#8e4e26", furL: "rgba(255,215,170,.8)", belly: "#eaa866", wing: "#6a3a5e", bone: "#9a6488", ear: "#a2603c", earIn: "#f0a294", nose: "#4a2a2a" };
  function glassesAt(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = "#1b1724"; c.lineWidth = 6; c.fillStyle = "rgba(200,230,255,.3)";
    for (const ex of [-22, 22]) { c.beginPath(); c.arc(ex, 0, 19, 0, 7); c.fill(); c.stroke(); } c.beginPath(); c.moveTo(-4, -3); c.quadraticCurveTo(0, -9, 4, -3); c.stroke();
    c.beginPath(); c.moveTo(-41, -4); c.lineTo(-52, -10); c.moveTo(41, -4); c.lineTo(52, -10); c.stroke();
    c.fillStyle = "rgba(255,255,255,.8)"; for (const ex of [-22, 22]) { c.beginPath(); c.ellipse(ex + 7, -8, 6, 3, -.5, 0, 7); c.fill(); } c.restore(); }
  function batWing(c, side, f) {
    const P = [[30, -40], [150, -95], [335, -60], [300, 40], [205, 98], [95, 92], [28, 60]];
    const p = P.map(([x, y]) => [side * x * (1 - .2 * Math.abs(f) * (x / 335)), y - f * x * .55]);
    kshape(c, (c) => { c.beginPath(); c.moveTo(p[0][0], p[0][1]); c.lineTo(p[1][0], p[1][1]); c.lineTo(p[2][0], p[2][1]);
      for (let i = 2; i < 6; i++) { const a = p[i], b = p[i + 1]; c.quadraticCurveTo((a[0] + b[0]) / 2 * .8, (a[1] + b[1]) / 2 * .8 - 8, b[0], b[1]); }
      c.closePath(); }, B.wing, { rim: "rgba(255,190,235,.5)", shadow: "rgba(20,0,20,.3)", rw: 5, sw: 12 });
    c.strokeStyle = B.bone; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(p[0][0], p[0][1]); c.lineTo(p[1][0], p[1][1]);
    for (const i of [2, 3, 4]) { c.moveTo(p[1][0], p[1][1]); c.lineTo(p[i][0], p[i][1]); } c.stroke();
    c.fillStyle = B.furD; c.beginPath(); c.arc(p[1][0], p[1][1] - 9, 9, 0, 7); c.fill(); }
  function batHead(c, o) { const t = o.t || 0, seed = o.seed || 0;
    for (const s of [-1, 1]) { c.save(); c.translate(s * 30, -26); c.rotate(s * (.34 + Math.sin(t * 3 + seed) * .05));
      kshape(c, (c) => { c.beginPath(); c.moveTo(-22, 16); c.quadraticCurveTo(-27, -40, 0, -60); c.quadraticCurveTo(27, -40, 22, 16); c.closePath(); }, B.ear, { rim: B.furL, rw: 4, sw: 6 });
      c.fillStyle = B.earIn; c.beginPath(); c.moveTo(-11, 10); c.quadraticCurveTo(-12, -28, 0, -42); c.quadraticCurveTo(12, -28, 11, 10); c.closePath(); c.fill(); c.restore(); }
    kshape(c, ell(0, 0, 56, 48, 0), B.fur, { rim: B.furL, shadow: "rgba(90,30,0,.25)", rw: 5, sw: 10 });
    kshape(c, ell(0, 20, 25, 18, 0), B.belly, { rw: 3, sw: 4 });
    c.fillStyle = B.nose; c.beginPath(); c.ellipse(-7, 11, 5, 4, 0, 0, 7); c.ellipse(7, 11, 5, 4, 0, 0, 7); c.fill();
    if (o.mouth === "open") { c.fillStyle = "#5a2230"; c.beginPath(); c.ellipse(0, 28, 13, 10, 0, 0, 7); c.fill(); c.fillStyle = "#fff"; c.beginPath(); c.moveTo(-10, 21); c.lineTo(-7, 29); c.lineTo(-4, 21); c.moveTo(4, 21); c.lineTo(7, 29); c.lineTo(10, 21); c.fill(); }
    else { c.strokeStyle = "#5a2a22"; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.arc(0, 18, 10, .4, 2.7); c.stroke(); c.fillStyle = "#fff"; c.beginPath(); c.moveTo(-7, 26); c.lineTo(-5, 32); c.lineTo(-3, 26); c.fill(); }
    fig.eye(c, -22, -8, 14, { t, seed: seed + 1, look: o.look ?? -.8, mood: o.mood }); fig.eye(c, 22, -8, 14, { t, seed: seed + 1, look: o.look ?? -.8, mood: o.mood });
    if (o.glow) { c.save(); c.globalCompositeOperation = "lighter"; for (const ex of [-22, 22]) glow(ex, -8, 50, `rgba(255,230,140,${.6 * o.glow})`); c.restore(); }
    if (o.glasses) glassesAt(c, 0, -8, 1); }
  function bat(c, o) { o = o || {}; const t = o.t || 0, seed = o.seed || 0, f = o.still ? .2 : Math.sin(t * (o.flap || 9) + seed), br = Math.sin(t * 2.5 + seed) * 3;
    c.save(); c.translate(0, -f * 10);
    batWing(c, -1, f); batWing(c, 1, f);
    c.fillStyle = B.furD; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 24, 74, 9, 15, s * .3, 0, 7); c.fill(); }
    kshape(c, ell(0, 0, 50, 72 + br * .3, 0), B.fur, { rim: B.furL, shadow: "rgba(90,30,0,.3)", rw: 6, sw: 14 });
    c.fillStyle = B.belly; c.globalAlpha = .6; c.beginPath(); c.ellipse(0, 14, 30, 44, 0, 0, 7); c.fill(); c.globalAlpha = 1;
    c.save(); c.translate(0, -96); batHead(c, o); c.restore();
    c.restore(); }
  // Hängend (Kopf unten), Füße am Ast bei (0,0), Länge ~260 nach unten
  function batHang(c, o) { o = o || {}; const t = o.t || 0, seed = o.seed || 0;
    c.save(); c.rotate(Math.sin(t * 1.6 + seed) * .05);
    c.strokeStyle = B.furD; c.lineWidth = 9; c.lineCap = "round"; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 14, -4); c.lineTo(s * 18, 34); c.stroke(); }
    kshape(c, ell(0, 110, 54, 88, 0), B.fur, { rim: B.furL, shadow: "rgba(90,30,0,.3)", rw: 6, sw: 14 });
    for (const s of [-1, 1]) kshape(c, (c) => { c.beginPath(); c.moveTo(s * 10, 28); c.quadraticCurveTo(s * 84, 70, s * 64, 172); c.quadraticCurveTo(s * 34, 198, s * 6, 184); c.quadraticCurveTo(s * 26, 100, s * 10, 28); c.closePath(); }, B.wing, { rim: "rgba(255,190,235,.5)", rw: 4, sw: 8 });
    c.fillStyle = B.furD; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * 66, 168, 8, 0, 7); c.fill(); }
    c.save(); c.translate(0, 236); c.rotate(Math.PI); batHead(c, Object.assign({}, o, { look: o.look ?? -.8 })); c.restore();
    c.restore(); }
  function batAt(x, y, s, o, rot) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s); bat(g, o); g.restore(); }
  function hangAt(x, y, s, o) { g.save(); g.translate(x, y); g.scale(s, s); batHang(g, o); g.restore(); }
  function batIcon(x, y, s, a, o, rot) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(rot || 0); const k = easeBack(Math.min(a, 1)); g.scale(s * k, s * k); bat(g, o); g.restore(); }
  // Nachtfalter (Draufsicht, Kopf oben)
  function moth(x, y, s, t, seed, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 3 + seed) * .3);
    g.save(); g.globalCompositeOperation = "lighter"; glow(0, 0, 70, "rgba(255,230,170,.22)"); g.restore();
    const f = .55 + .45 * Math.abs(Math.sin(t * 22 + seed));
    for (const sd of [-1, 1]) { g.save(); g.scale(sd * f, 1);
      kshape(g, ell(32, -8, 38, 24, -.35), "#f1dcae", { rim: "#fff8e0", rw: 3, sw: 5 }); kshape(g, ell(24, 16, 26, 17, .4), "#d9b57a", { rw: 3, sw: 4 });
      g.fillStyle = "#a8743a"; g.beginPath(); g.arc(34, -10, 7, 0, 7); g.fill(); g.restore(); }
    g.fillStyle = "#7a5a3a"; g.beginPath(); g.ellipse(0, 2, 8, 28, 0, 0, 7); g.fill();
    g.strokeStyle = "#7a5a3a"; g.lineWidth = 3; g.beginPath(); g.moveTo(-3, -24); g.quadraticCurveTo(-14, -44, -20, -48); g.moveTo(3, -24); g.quadraticCurveTo(14, -44, 20, -48); g.stroke(); g.restore(); }
  // Baum mit Ast (Welt): Stamm bei x=-760, Ast bei y≈-700 bis x≈320
  function tree(t) { kshape(g, (c) => { c.beginPath(); c.moveTo(-860, 0); c.quadraticCurveTo(-800, -500, -830, -1300); c.lineTo(-690, -1300); c.quadraticCurveTo(-680, -500, -640, 0); c.closePath(); }, "#4a3a5a", { rim: "rgba(200,190,255,.35)", rw: 6, sw: 16 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(-700, -760); c.quadraticCurveTo(-200, -760, 340, -700); c.lineTo(340, -672); c.quadraticCurveTo(-200, -716, -700, -700); c.closePath(); }, "#4a3a5a", { rim: "rgba(200,190,255,.35)", rw: 4, sw: 8 });
    for (const [lx, ly, r] of [[-900, -1340, 230], [-620, -1400, 200], [-760, -1560, 210], [220, -730, 70], [-140, -770, 60]]) kshape(g, ell(lx, ly, r, r * .8, 0), "#1f4a4a", { rim: "rgba(150,255,220,.25)", rw: 5, sw: 12 }); }
  function branchY(x) { const u = (x + 700) / 1040; return lerp(-736, -686, u) + Math.sin(u * Math.PI) * -20; }
  function harness(c) { c.save(); c.strokeStyle = "#e5484d"; c.lineWidth = 20; c.lineCap = "round"; c.beginPath(); c.moveTo(100, -320); c.lineTo(110, -170); c.moveTo(40, -310); c.lineTo(180, -290); c.stroke();
    c.lineWidth = 12; c.strokeStyle = "#c23238"; c.beginPath(); c.moveTo(60, -312); c.lineTo(30, -460); c.lineTo(-70, -460); c.lineTo(-40, -316); c.stroke();
    c.fillStyle = "#fff"; c.beginPath(); c.roundRect(70, -270, 70, 40, 8); c.fill(); c.fillStyle = "#e5484d"; c.fillRect(98, -266, 14, 32); c.fillRect(89, -257, 32, 14); c.restore(); }
  function guideDog(x, s, o) { g.save(); g.translate(x, 0); g.scale(s, s); dog(g, o); harness(g); g.restore(); }
  function gardenB(t, cx, cy, z) { nightPark(t, cx, cy, z); tree(t); }
  function bugs(t, n, x0, y0, w, h, a) { for (let i = 0; i < n; i++) { const mx = x0 + ((i * 197 + t * 40 * (i % 2 ? 1 : -1)) % w + w) % w, my = y0 + (i * 131) % h + Math.sin(t * 2 + i) * 30; moth(mx, my, .5, t, i, a); } }
  function echoArcs(x, y, dir, t, col, a, ph0) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.lineCap = "round";
    for (let i = 0; i < 4; i++) { const ph = ((t * .9 + i / 4 + (ph0 || 0)) % 1), r = 40 + ph * 300; g.strokeStyle = col; g.globalAlpha = a * (1 - ph); g.lineWidth = 12; g.beginPath(); g.arc(x, y, r, dir > 0 ? -.55 : Math.PI - .55, dir > 0 ? .55 : Math.PI + .55); g.stroke(); }
    g.restore(); }
  function matchbox(x, y, s, a, t) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); const k = easeBack(Math.min(a, 1)); g.scale(s * k, s * k);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-200, -40, 400, 150, 12); }, "#e9dcc0", { rim: "#fff", rw: 4, sw: 8 });
    g.save(); g.beginPath(); g.rect(-200, -400, 400, 400); g.clip(); hangAtS(0, -110, .62, t); g.restore();
    kshape(g, (c) => { c.beginPath(); c.roundRect(-210, 20, 420, 130, 12); }, "#e5484d", { rim: "rgba(255,210,200,.8)", rw: 4, sw: 8 });
    g.fillStyle = "#ffd84d"; g.beginPath(); g.roundRect(-150, 48, 300, 74, 37); g.fill(); g.font = '900 40px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#7a2a2a"; g.fillText("MATCHES", 0, 87);
    g.restore(); }
  function hangAtS(x, y, s, t) { g.save(); g.translate(x, y + 260 * s); g.scale(s, -s); batHang(g, { t, seed: 4, look: -.8 }); g.restore(); }
  function batBox(x, y, s, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); const k = easeBack(Math.min(a, 1)); g.scale(s * k, s * k);
    kshape(g, (c) => { c.beginPath(); c.rect(-220, -460, 120, 900); }, "#5a4468", { rim: "rgba(220,200,255,.4)", rw: 5, sw: 10 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(-110, -110); c.lineTo(110, -150); c.lineTo(110, 220); c.lineTo(-110, 220); c.closePath(); }, "#b9773f", { rim: "rgba(255,230,190,.6)", shadow: "rgba(80,30,0,.3)", rw: 5, sw: 12 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(-130, -100); c.lineTo(130, -150); c.lineTo(130, -180); c.lineTo(-130, -130); c.closePath(); }, "#7e4a22", { rw: 3, sw: 5 });
    g.fillStyle = "#2a1a14"; g.beginPath(); g.roundRect(-80, 190, 160, 16, 8); g.fill(); g.strokeStyle = "rgba(90,50,20,.5)"; g.lineWidth = 4; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-90, -40 + i * 80); g.lineTo(90, -60 + i * 80); g.stroke(); }
    g.restore(); }

  // ======================= Shots =======================
  function hookB(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    gardenB(t, lerp(-120, -100, k), -720, lerp(1.25, 1.42, k));
    bugs(t, 5, -560, -1100, 900, 300, .9);
    batAt(-120 + Math.sin(t * 1.3) * 30, -700 + Math.sin(t * 2.1) * 20, lerp(1.15, 1.35, k), { t, flap: 8, look: -.8, glow: loop ? 0 : sm((lt - d * .45) / .3) });
    if (loop) return;
    stamp("NOT BLIND", W * .44, H * .63, (lt - d * .5) / .22, "#2fae6a", -.06); }
  KZ.shot("bHook", (lt, d, t) => hookB(lt, d, t, false));
  KZ.shot("bSad", (lt, d, t) => { const k = sm(lt / d); gardenB(t, lerp(-260, -220, k), -420, lerp(.92, 1.0, k));
    hangAt(120, branchY(120), .95, { t, seed: 1 });
    at(rudi, -470, 0, 1, { t, arm: 1.5 + .5 * clamp(lt * 2, 0, 1), mouth: "hmm", look: .5 });
    bubble("POOR THING...", W * .34, H * .12, sm((lt - .2) / .3), -.04);
    stamp("BLIND?", W * .62, H * .56, (lt - d * .45) / .22, "#8a5ad0", .06); });
  KZ.shot("bGlass", (lt, d, t) => { const k = sm(lt / d); gardenB(t, lerp(-200, -150, k), -560, lerp(1.08, 1.18, k));
    const on = sm((lt - d * .4) / .25);
    hangAt(120, branchY(120), .95, { t, seed: 1, glasses: on > .5 });
    const r = at(rudi, -420, 0, 1, { t, arm: lerp(.3, 1, sm(lt / (d * .4))) * (1 - on * .4), mouth: "grin", look: .6 });
    if (on <= .5) { g.save(); g.translate(r.hx * 1 - 420 + 20, r.hy - 20); glassesAt(g, 0, 0, 1.2); g.restore(); }
    stamp("STYLISH", W * .3, H * .17, (lt - d * .5) / .22, "#e5487a", -.05); });
  KZ.shot("bCatch", (lt, d, t) => { const k = sm(lt / d); gardenB(t, lerp(-60, 60, k), -760, lerp(1.0, 1.08, k));
    // Brille bleibt am Ast hängen
    g.save(); g.translate(100, branchY(100) + 30); g.rotate(.2); glassesAt(g, 0, 0, 1.3); g.restore();
    const p = clamp(lt / (d * .8), 0, 1), bx = lerp(-760, 520, p), by = -760 + Math.sin(p * Math.PI) * -260;
    const caught = p > .55;
    if (!caught) moth(lerp(-100, 40, p), -1000 + Math.sin(t * 4) * 30, 1.2, t, 1, 1);
    batAt(bx, by, .9, { t, flap: 13, look: 0, mouth: caught && p < .8 ? "open" : null }, Math.sin(p * Math.PI) * -.15 + .1);
    stamp("NO GLASSES", W * .44, H * .62, (lt - d * .55) / .22, "#2fae6a", .05); });
  KZ.shot("bDog", (lt, d, t) => { const k = sm(lt / d); gardenB(t, lerp(40, 70, k), -380, lerp(.95, 1.02, k));
    at(rudi, -380, 0, 1, { t, arm: .55, mouth: "smile", look: .6 });
    guideDog(-20, .72, { t, wag: .5, look: Math.sin(t * 4) * 1.2, turn: Math.sin(t * 4) * .6, mood: lt > d * .5 ? "scared" : null });
    const a = t * 4.2, ox = 230, oy = -400; for (const back of [true, false]) { const front = Math.sin(a) > 0; if (front === back) continue;
      batAt(ox + Math.cos(a) * 200, oy + Math.sin(a) * 80 - 80, .5 * (front ? 1 : .8), { t, flap: 14, look: Math.cos(a) > 0 ? -.4 : -1.2 }, Math.cos(a) * .2); }
    stamp("GUIDE DOG", W * .32, H * .16, (lt - .3) / .22, "#2f6fd0", -.05);
    stamp("DIZZY", W * .6, H * .56, (lt - d * .55) / .22, "#e5484d", .07); });
  KZ.shot("bSee", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("EVERY BAT CAN SEE", W * .44, H * .06, 64, "#fff", { w: 900, a: sm(lt / .3) });
    batIcon(W * .44, H * .26, 1.15, sm((lt - .05) / .35), { t, flap: 6, look: -.8, glow: .6 + .4 * Math.sin(t * 3) });
    for (let i = 0; i < 3; i++) { const a = sm((lt - d * .4 - i * .2) / .3), x = W * (.2 + i * .24); batIcon(x, H * .5, .38, a, { t, flap: 9, seed: i + 2 }); check(x + 70, H * .5 + 40, .45, (lt - d * .5 - i * .2) / .2); }
    txt("1,400+ SPECIES", W * .44, H * .6, 54, "#ffd84d", { w: 900, a: sm((lt - d * .6) / .3), stroke: 8 });
    txt("Smithsonian · BCI", W * .44, H * .645, 32, "#c9d0ff", { w: 700, a: sm((lt - d * .7) / .3) }); wobbleAll(lt, d, t); });
  KZ.shot("bRods", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("NIGHT VISION CELLS", W * .44, H * .06, 62, "#fff", { w: 900, a: sm(lt / .3) });
    txt("rods per mm² of retina", W * .44, H * .105, 36, "#c9d0ff", { w: 700, a: sm((lt - .1) / .3) });
    const rows = [["YOU", 150000, "#8fd8ff", 0], ["BAT", 800000, "#ffb347", 1]];
    rows.forEach(([nm, v, col, i]) => { const y = H * (.22 + i * .17), p = sm(clamp((lt - .3 - i * .5) / (d * .35), 0, 1)), a = sm((lt - .2 - i * .5) / .25); if (a <= 0) return;
      if (i === 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.translate(W * .13, y + 10); g.scale(.36, .36); rudi(g, { t, mouth: "o", look: .5, armOnly: false }); g.restore(); }
      else batIcon(W * .13, y - 50, .3, a, { t, flap: 8 });
      txt(nm, W * .13, y + 60, 40, "#fff", { w: 900, a });
      const bw = 660 * v / 800000 * p; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(255,255,255,.1)"; g.beginPath(); g.roundRect(W * .25, y - 50, 660, 100, 50); g.fill();
      g.fillStyle = col; g.beginPath(); g.roundRect(W * .25, y - 50, Math.max(bw, 100), 100, 50); g.fill(); g.restore();
      if (i) txt("UP TO " + Math.round(v * p).toLocaleString("en-US"), W * .25 + Math.max(bw, 100) - 200, y + 2, 44, "#1b1d3a", { w: 900, a }); else txt(Math.round(v * p).toLocaleString("en-US"), W * .25 + 130, y + 2, 44, "#fff", { w: 900, a, align: "left" }); });
    stamp("5× MORE", W * .44, H * .57, (lt - d * .62) / .22, "#e5487a", -.06);
    txt("Bat Conservation International", W * .44, H * .64, 32, "#c9d0ff", { w: 700, a: sm((lt - d * .7) / .3) }); wobbleAll(lt, d, t); });
  KZ.shot("bEcho", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("ECHOLOCATION", W * .44, H * .06, 64, "#fff", { w: 900, a: sm(lt / .3) });
    const bx = W * .2, by = H * .32, mx = W * .68, my = H * .3 + Math.sin(t * 3) * 20;
    batIcon(bx, by, .62, sm((lt - .05) / .3), { t, flap: 10, mouth: "open", look: .6 });
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); moth(mx, my, 1.4, t, 2, sm((lt - .1) / .3)); g.restore();
    echoArcs(bx + 110, by - 60, 1, t, "#ffb347", sm((lt - .3) / .3));
    echoArcs(mx - 70, my, -1, t, "#7ef0ff", sm((lt - d * .45) / .3), .5);
    txt("SHOUT", W * .3, H * .46, 56, "#ffb347", { w: 900, a: sm((lt - .4) / .3), stroke: 8 });
    txt("ECHO", W * .6, H * .46, 56, "#7ef0ff", { w: 900, a: sm((lt - d * .5) / .3), stroke: 8 });
    label("TOO HIGH FOR YOU TO HEAR", W * .44, H * .56, sm((lt - d * .65) / .25));
    txt("Bat Conservation Trust", W * .44, H * .63, 32, "#c9d0ff", { w: 700, a: sm((lt - d * .7) / .3) }); wobbleAll(lt, d, t); });
  KZ.shot("bSource", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.07, sm(lt / d)) + Math.sin(t * 2) * .012);
    batIcon(W * .44, H * .15, .6, sm(lt / .3), { t, flap: 7, seed: 3 });
    card(W * .44, H * .38, 920, 330, (lt - .2) / .3, "BAT CONSERVATION INTL", "#6a3a5e");
    txt("“First things first –", W * .44, H * .38 - 6, 52, "#1b1d3a", { w: 900, a: sm((lt - .4) / .2) });
    txt("bats are NOT blind!”", W * .44, H * .38 + 62, 52, "#1b1d3a", { w: 900, a: sm((lt - .5) / .2) });
    txt("batcon.org · Blind as a Bat? No Such Thing", W * .44, H * .38 + 130, 28, "#4a4f70", { w: 700, a: sm((lt - d * .4) / .2) });
    stamp("MYTH", W * .64, H * .58, (lt - d * .55) / .22, "#e5484d", .07); wobbleAll(lt, d, t); });
  KZ.shot("bMatch", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("COMMON PIPISTRELLE", W * .44, H * .06, 60, "#fff", { w: 900, a: sm(lt / .3) });
    matchbox(W * .44, H * .26, 1, sm((lt - .1) / .35), t);
    txt("FITS IN A MATCHBOX", W * .44, H * .36, 48, "#ffd84d", { w: 900, a: sm((lt - .4) / .3), stroke: 8 });
    const n = Math.round(3000 * sm(clamp((lt - d * .4) / (d * .45), 0, 1)));
    const a = sm((lt - d * .38) / .3); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < Math.min(16, n / 180); i++) moth(W * (.14 + (i % 8) * .085), H * (.44 + Math.floor(i / 8) * .045), .45, t, i, a); g.restore();
    txt(n.toLocaleString("en-US"), W * .44, H * .55, 110, "#fff", { w: 900, a, stroke: 10 });
    txt("INSECTS IN ONE NIGHT", W * .44, H * .605, 44, "#7ef0b0", { w: 900, a });
    txt("The Wildlife Trusts", W * .44, H * .645, 30, "#c9d0ff", { w: 700, a: sm((lt - d * .7) / .3) }); wobbleAll(lt, d, t); });
  KZ.shot("bJobless", (lt, d, t) => { const k = sm(lt / d); gardenB(t, lerp(0, 30, k), -400, lerp(1.0, 1.06, k));
    guideDog(60, .72, { t, wag: .05, sniff: .35, look: .2 });
    g.save(); g.translate(-230, 0); kshape(g, (c) => { c.beginPath(); c.roundRect(-150, -330, 300, 170, 10); }, "#d9b57a", { rim: "#fff1d0", rw: 4, sw: 8 }); g.strokeStyle = "#7e4a22"; g.lineWidth = 14; g.beginPath(); g.moveTo(0, -160); g.lineTo(0, 0); g.stroke();
    g.font = '900 46px "Montserrat"'; g.textAlign = "center"; g.fillStyle = "#5a2a22"; g.fillText("WILL GUIDE", 0, -262); g.fillText("FOR TREATS", 0, -200); g.restore();
    const p = (t * .35) % 1; batAt(lerp(-700, 800, p), -820 + Math.sin(p * 9) * 60, .45, { t, flap: 14, mouth: Math.sin(p * 18) > .7 ? "open" : null });
    bugs(t, 4, -500, -1050, 900, 200, .8);
    stamp("UNEMPLOYED", W * .44, H * .14, (lt - d * .3) / .22, "#e5484d", -.05); });
  KZ.shot("bTip", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("DO THIS INSTEAD", W * .44, H * .06, 64, "#fff", { w: 900, a: sm(lt / .3) });
    batBox(W * .24, H * .28, .62, sm((lt - .1) / .3));
    if (lt > d * .3) { const p = ((lt - d * .3) * .5) % 1; batIcon(lerp(W * .1, W * .24, p), lerp(H * .14, H * .34, p), .2, 1 - sm((p - .8) / .2), { t, flap: 14 }); }
    const rows = [["BAT BOX", "high on a wall or tree", 0], ["NO BARE HANDS", "never touch a bat", 1]];
    rows.forEach(([h1, h2, i]) => { const p = (lt - .3 - i * d * .3) / .3, y = H * (.2 + i * .2); card(W * .6, y, 500, 220, p); if (p <= 0) return; const a = sm(p);
      txt(h1, W * .6, y - 34, 46, "#1b1d3a", { w: 900, a }); txt(h2, W * .6, y + 30, 32, "#4a4f70", { w: 800, a }); });
    handIcon(W * .22, H * .56, .9, sm((lt - d * .5) / .3), {}); cross(W * .22, H * .55, .8, (lt - d * .6) / .2);
    txt("Bat Conservation Trust", W * .6, H * .55, 32, "#c9d0ff", { w: 700, a: sm((lt - d * .6) / .3) }); wobbleAll(lt, d, t); });
  KZ.shot("bLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .6) { gardenB(t, lerp(-200, -160, k), -420, lerp(.95, 1.02, k)); at(rudi, -420, 0, 1, { t, arm: .9 + Math.sin(t * 8) * .1, mouth: "grin", look: .6 });
      const p = clamp(lt / (d * .6), 0, 1); batAt(lerp(400, -120, p), lerp(-900, -760, p), lerp(.5, 1.1, p), { t, flap: 9, look: -.8 }); }
    else hookB(0, d, t, true); });
  (function () { const SH = KZ.SHOTS; const split = (a, b, f) => (lt, d, t) => { const c = d * f; if (lt < c) SH[a](lt, c, t); else SH[b](lt - c, d - c, t); };
    KZ.shot("bGlassFull", split("bGlass", "bCatch", .45)); })();
})();
