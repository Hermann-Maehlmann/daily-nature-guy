// Szenendatei "Toads Don't Give You Warts" (Erdkröte, Comedy-Story + Mix-Stil, 16.11.2026).
// Quellen: Burke Museum Frog myths ("No, there are no amphibians that give you warts", "Warts are actually caused by viruses"), Virginia DWR (American toad bis 10.000 Insekten pro Sommer, Hunde schäumen nach Kontakt), Wildlife Trusts (Erdkröte frisst Schnecken, Gift in Hautdrüsen).
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
    fig.eye(c, 28, -418, 15, { t, seed: 3, look: o.look ?? .5, mood: o.mood }); fig.eye(c, 66, -418, 15, { t, seed: 3, look: o.look ?? .5, mood: o.mood });
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
  const WARTS = [[-118, -96, 11], [-86, -128, 13], [-46, -146, 12], [-14, -124, 10], [-64, -92, 10], [-124, -58, 9], [6, -152, 8], [-28, -84, 9], [58, -126, 8], [-96, -40, 7], [22, -100, 8], [-140, -78, 7], [-54, -60, 7], [40, -150, 7]];
  function toadEye(c, x, y, r, o) { const t = o.t || 0, lid = Math.max(o.lid ?? .3, Math.sin(t * 1.3 + (o.seed || 0) * 2.3) > .985 ? 1 : 0);
    kshape(c, ell(x - 4, y + 4, r * 1.45, r * 1.3, 0), T.skin, { rim: T.skinL, rw: 4, sw: 8 });
    c.fillStyle = "#1a0f08"; c.beginPath(); c.arc(x, y, r + 2, 0, 7); c.fill();
    const ig = c.createRadialGradient(x - r * .3, y - r * .3, 1, x, y, r); ig.addColorStop(0, "#ffc06a"); ig.addColorStop(.7, T.iris); ig.addColorStop(1, T.irisD); c.fillStyle = ig; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    const lx = (o.look || 0) * r * .25; c.fillStyle = "#120a06"; c.beginPath(); c.ellipse(x + lx, y, r * .62, r * (o.wide ? .5 : .28), 0, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(x + r * .35, y - r * .4, r * .22, 0, 7); c.fill(); c.beginPath(); c.arc(x - r * .3, y + r * .35, r * .09, 0, 7); c.fill();
    if (lid > 0) { c.save(); c.beginPath(); c.arc(x, y, r + 3, 0, 7); c.clip(); c.fillStyle = T.skin; c.fillRect(x - r - 4, y - r - 4, 2 * r + 8, (2 * r + 8) * lid); c.fillStyle = T.skinD; c.fillRect(x - r - 4, y - r - 4 + (2 * r + 8) * lid - 4, 2 * r + 8, 4); c.restore(); }
    if (o.shades) { c.fillStyle = "#14141e"; c.beginPath(); c.roundRect(x - r * 1.5, y - r * .9, r * 3, r * 1.6, r * .5); c.fill(); c.fillStyle = "rgba(140,200,255,.6)"; c.fillRect(x - r * .9, y - r * .6, r * .7, r * .25); c.strokeStyle = "#14141e"; c.lineWidth = 6; c.beginPath(); c.moveTo(x - r * 1.4, y - r * .5); c.lineTo(x - r * 3, y - r * .8); c.stroke(); } }
  function toad(c, o) { o = o || {}; const t = o.t || 0, seed = o.seed || 0, br = Math.sin(t * 2.4 + seed) * .02, thr = .5 + .5 * Math.sin(t * 6 + seed * 3), hop = o.hop || 0, swim = o.swim || 0;
    c.save(); c.scale(1 + br * .5, 1 - br);
    const stretch = Math.max(hop, swim);
    // Hinterbein hinten (fern, dunkler)
    function hind(far) { const col = far ? T.skinD : T.skin; c.save(); if (far) c.translate(14, -6);
      if (stretch > 0) { const ex = lerp(-60, -250, stretch), ey = lerp(-10, 10 - 40 * swim, stretch);
        c.strokeStyle = col; c.lineWidth = 34; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(-100, -60); c.lineTo(lerp(-150, -170, stretch), lerp(-20, -40, stretch)); c.lineTo(ex, ey - 6); c.stroke();
        c.fillStyle = col; c.beginPath(); c.ellipse(ex - 30, ey, 46, 13, -.1, 0, 7); c.fill(); }
      else { kshape(c, ell(-96, -62, 64, 44, -.35), col, { rim: far ? null : T.skinL, rw: 4, sw: 10 });
        kshape(c, ell(-62, -22, 60, 20, .12), col, { rim: far ? null : T.skinL, rw: 3, sw: 6 });
        c.fillStyle = col; c.beginPath(); c.ellipse(-6, -7, 52, 12, 0, 0, 7); c.fill(); for (const k of [0, 1, 2]) { c.beginPath(); c.ellipse(40 + k * 4, -4 - k * 7, 16, 6, -.2 - k * .25, 0, 7); c.fill(); } }
      c.restore(); }
    function front(far) { const col = far ? T.skinD : T.skin; const fx = far ? 128 : 104; c.save(); c.strokeStyle = col; c.lineWidth = 24; c.lineCap = "round";
      const hx = stretch > 0 ? fx + 40 * stretch : fx, hy = stretch > 0 ? -30 - 30 * swim : -6;
      c.beginPath(); c.moveTo(fx - 26, -76); c.quadraticCurveTo(fx - 8, -40, hx, hy); c.stroke(); c.fillStyle = col; for (const k of [-1, 0, 1]) { c.beginPath(); c.ellipse(hx + 12 + k * 12, hy + 2 - Math.abs(k) * 2, 12, 6, k * .5, 0, 7); c.fill(); } c.restore(); }
    hind(true); front(true);
    // Körper
    const body = (c) => { c.beginPath(); c.moveTo(-150, -28); c.bezierCurveTo(-176, -130, -64, -176, 40, -166); c.bezierCurveTo(112, -162, 168, -132, 172, -96); c.bezierCurveTo(175, -70, 152, -52, 122, -48); c.bezierCurveTo(60, -20, -60, -12, -118, -14); c.quadraticCurveTo(-152, -14, -150, -28); c.closePath(); };
    kshape(c, body, T.skin, { rim: T.skinL, shadow: "rgba(70,35,10,.3)", rw: 7, sw: 22 });
    c.save(); body(c); c.clip(); c.fillStyle = T.belly; c.beginPath(); c.ellipse(-10, -10, 170, 36, 0, 0, 7); c.fill();
    c.fillStyle = "rgba(90,50,20,.18)"; c.beginPath(); c.ellipse(-40, -150, 120, 30, -.1, 0, 7); c.fill(); c.restore();
    // Kehle pulsiert
    c.fillStyle = T.belly; c.beginPath(); c.ellipse(120, -54, 26 + 8 * thr, 11 + 5 * thr, -.1, 0, 7); c.fill();
    // Warzen (Hautdrüsen)
    for (const [x, y, r] of WARTS) { c.fillStyle = T.wart; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.fillStyle = T.wartL; c.beginPath(); c.arc(x + r * .3, y - r * .35, r * .38, 0, 7); c.fill(); }
    // Ohrdrüse (Parotide) hinter dem Auge
    kshape(c, ell(34, -156, 48, 17, -.12), T.gland, { rim: "rgba(255,235,180,.85)", rw: 4, sw: 6 });
    if (o.glandGlow) { c.save(); c.globalCompositeOperation = "lighter"; glow(34, -156, 90, `rgba(255,240,170,${.5 * o.glandGlow})`); c.restore(); }
    // Maul, Nasenloch
    c.strokeStyle = T.mouth; c.lineWidth = 5; c.lineCap = "round"; c.beginPath(); c.moveTo(170, -92); c.quadraticCurveTo(130, -82, 74, -100); c.stroke();
    c.fillStyle = T.mouth; c.beginPath(); c.arc(160, -120, 3.5, 0, 7); c.fill();
    if (o.tongue > 0) { const L = 280 * o.tongue; c.strokeStyle = "#ff7a90"; c.lineWidth = 14; c.beginPath(); c.moveTo(165, -90); c.lineTo(165 + L, -90 - L * .25); c.stroke(); c.fillStyle = "#ff7a90"; c.beginPath(); c.arc(165 + L, -90 - L * .25, 16, 0, 7); c.fill(); }
    toadEye(c, 100, -150, 22, o);
    hind(false); front(false);
    // Gift-Sekret
    if (o.ooze > 0) { const a = clamp(o.ooze, 0, 1); c.save(); c.globalCompositeOperation = "lighter"; glow(30, -156, 70, `rgba(255,255,230,${.35 * a})`); c.restore();
      c.fillStyle = `rgba(250,248,235,${a})`; for (let i = 0; i < 4; i++) { const ph = (t * .7 + i / 4) % 1; c.beginPath(); c.ellipse(4 + i * 20, -150 + ph * 60 * a, 8 - ph * 3, 11, 0, 0, 7); c.fill(); }
      c.beginPath(); c.ellipse(34, -150, 44, 10, -.12, 0, 7); c.fill(); }
    c.restore(); }
  function toadAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); toad(g, o); g.restore(); }
  // Hüpfbogen: liefert Position zwischen a und b
  function hopPos(a, b, p, h) { return [lerp(a[0], b[0], p), lerp(a[1], b[1], p) - Math.sin(p * Math.PI) * h]; }

  // ---------- Requisiten ----------
  function mitt(x, y, s, rot) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.moveTo(-34, 40); c.bezierCurveTo(-50, -10, -40, -70, 0, -72); c.bezierCurveTo(40, -72, 48, -20, 40, 40); c.closePath(); }, "#e5484d", { rim: "rgba(255,210,210,.8)", rw: 5, sw: 10 });
    kshape(g, ell(-40, -10, 16, 26, -.5), "#e5484d", { rim: "rgba(255,210,210,.8)", rw: 3, sw: 5 });
    g.fillStyle = "#fff4e6"; g.fillRect(-38, 30, 80, 22); g.fillStyle = "rgba(255,255,255,.5)"; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-12 + i * 14, -30 + i * 20, 5, 0, 7); g.fill(); } g.restore(); }
  function boot(x, s) { g.save(); g.translate(x, 0); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.moveTo(-75, -260); c.lineTo(75, -260); c.lineTo(78, -90); c.bezierCurveTo(120, -82, 170, -60, 172, -24); c.lineTo(172, 0); c.lineTo(-82, 0); c.closePath(); }, "#3f8fe0", { rim: "rgba(210,235,255,.8)", rw: 6, sw: 18 });
    g.fillStyle = "#1d2f6a"; g.fillRect(-84, -22, 258, 22); g.fillStyle = "#2a62b8"; g.fillRect(-78, -268, 156, 22); g.restore(); }
  function shovel(x0, y0, x1, y1) { g.save(); g.strokeStyle = "#8a5a2a"; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0); g.translate(x1, y1); g.rotate(a); kshape(g, (c) => { c.beginPath(); c.moveTo(0, -34); c.lineTo(70, -30); c.quadraticCurveTo(100, 0, 70, 30); c.lineTo(0, 34); c.closePath(); }, "#aab4c8", { rim: "rgba(255,255,255,.9)", rw: 4, sw: 8 }); g.restore(); }
  function house(x, s) { g.save(); g.translate(x, 0); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.rect(-320, -620, 640, 620); }, "#e0735a", { rim: "rgba(255,220,200,.6)", rw: 7, sw: 26 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(-380, -600); c.lineTo(0, -900); c.lineTo(380, -600); c.closePath(); }, "#4a3a8a", { rim: "rgba(200,190,255,.6)", rw: 7, sw: 20 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-70, -280, 140, 280, [70, 70, 0, 0]); }, "#3f6fd0", { rim: "rgba(210,230,255,.7)", rw: 5, sw: 10 });
    g.fillStyle = "#ffd84a"; g.beginPath(); g.arc(40, -130, 10, 0, 7); g.fill();
    for (const wx of [-220, 220]) { kshape(g, (c) => { c.beginPath(); c.roundRect(wx - 70, -480, 140, 130, 14); }, "#ffe7a0", { rim: "rgba(255,255,255,.9)", rw: 4, sw: 8 }); g.fillStyle = "#e0735a"; g.fillRect(wx - 5, -480, 10, 130); g.fillRect(wx - 70, -420, 140, 10); }
    g.restore(); }
  // Wassergraben vor dem Haus (Seitenansicht, Boden y=0), p = Fortschritt 0..1 von links
  function moat(x0, x1, p, t) { if (p <= 0) return; const xe = lerp(x0, x1, clamp(p, 0, 1));
    g.fillStyle = "#5a3a22"; g.fillRect(x0 - 12, -20, xe - x0 + 24, 190);
    const wg = g.createLinearGradient(0, -14, 0, 170); wg.addColorStop(0, "#4fc8f0"); wg.addColorStop(1, "#1d5fa8"); g.fillStyle = wg; g.beginPath(); g.moveTo(x0, 170);
    for (let x = x0; x <= xe; x += 20) g.lineTo(x, -14 + Math.sin(t * 3 + x * .03) * 5); g.lineTo(xe, 170); g.closePath(); g.fill();
    g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 5; g.lineCap = "round"; for (let x = x0 + 40; x < xe - 40; x += 160) { g.beginPath(); g.moveTo(x, 4 + Math.sin(t * 2 + x) * 3); g.lineTo(x + 60, 4 + Math.sin(t * 2 + x) * 3); g.stroke(); } }
  function waterFront(x0, x1, t) { const wg = g.createLinearGradient(0, -40, 0, 170); wg.addColorStop(0, "rgba(79,200,240,.85)"); wg.addColorStop(1, "rgba(29,95,168,.95)"); g.fillStyle = wg; g.beginPath(); g.moveTo(x0, 170);
    for (let x = x0; x <= x1; x += 20) g.lineTo(x, -22 + Math.sin(t * 3 + x * .03) * 6); g.lineTo(x1, 170); g.closePath(); g.fill(); }
  function ring(x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); kshape(g, (c) => { c.beginPath(); c.ellipse(0, 0, 150, 42, 0, 0, 7); c.ellipse(0, -4, 80, 18, 0, 0, 7, true); }, col, { rim: "rgba(255,255,255,.8)", rw: 5, sw: 10 }); g.restore(); }
  function virus(x, y, r, t, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(t * .4); const k = easeBack(Math.min(a, 1)); g.scale(k, k);
    g.globalCompositeOperation = "lighter"; glow(0, 0, r * 2, "rgba(255,90,160,.35)"); g.globalCompositeOperation = "source-over";
    g.strokeStyle = "#ff5aa0"; g.lineWidth = r * .14; g.lineCap = "round"; for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283; g.beginPath(); g.moveTo(Math.cos(an) * r * .8, Math.sin(an) * r * .8); g.lineTo(Math.cos(an) * r * 1.35, Math.sin(an) * r * 1.35); g.stroke(); g.fillStyle = "#ffd0e6"; g.beginPath(); g.arc(Math.cos(an) * r * 1.4, Math.sin(an) * r * 1.4, r * .13, 0, 7); g.fill(); }
    kshape(g, (c) => { c.beginPath(); c.arc(0, 0, r, 0, 7); }, "#ff5aa0", { rim: "rgba(255,220,240,.9)", rw: r * .08, sw: r * .2 });
    g.fillStyle = "rgba(120,20,70,.5)"; for (const [px, py] of [[-.3, -.2], [.3, .1], [-.05, .4], [.2, -.4]]) { g.beginPath(); g.arc(px * r, py * r, r * .14, 0, 7); g.fill(); } g.restore(); }
  function handIcon(x, y, s, a, o) { if (a <= 0) return; o = o || {}; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); const k = easeBack(Math.min(a, 1)); g.scale(s * k, s * k);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-60, -40, 120, 120, 40); }, C.skin, { rim: "rgba(255,240,225,.9)", rw: 5, sw: 10 });
    for (let i = 0; i < 4; i++) kshape(g, (c) => { c.beginPath(); c.roundRect(-58 + i * 30, -120 + Math.abs(i - 1.5) * 10, 26, 100, 13); }, C.skin, { rim: "rgba(255,240,225,.9)", rw: 4, sw: 6 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(48, -30, 26, 80, 13); }, C.skin, { rw: 3, sw: 5 });
    if (o.wart) { g.fillStyle = "#b07a5a"; for (const [wx, wy, r] of [[-10, 10, 16], [22, 36, 11], [-30, 44, 9]]) { g.beginPath(); g.arc(wx, wy, r * o.wart, 0, 7); g.fill(); g.fillStyle = "#d6a080"; g.beginPath(); g.arc(wx + 3, wy - 4, r * .4 * o.wart, 0, 7); g.fill(); g.fillStyle = "#b07a5a"; } }
    if (o.drops) { g.fillStyle = "#8fd8ff"; for (let i = 0; i < 4; i++) { const ph = (o.t * 1.4 + i / 4) % 1; g.beginPath(); g.arc(-50 + i * 34, -140 + ph * 260, 9, 0, 7); g.fill(); } }
    g.restore(); }
  function toadIcon(x, y, s, a, o) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(s * easeBack(Math.min(a, 1)), s * easeBack(Math.min(a, 1))); toad(g, o || {}); g.restore(); }
  function arrow(x0, x1, y, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a, 0, 1); g.strokeStyle = "#fff"; g.lineWidth = 12; g.lineCap = "round"; const xe = lerp(x0, x1, clamp(a, 0, 1));
    g.beginPath(); g.moveTo(x0, y); g.lineTo(xe, y); g.stroke(); g.beginPath(); g.moveTo(xe - 26, y - 22); g.lineTo(xe, y); g.lineTo(xe - 26, y + 22); g.stroke(); g.restore(); }
  function bug(x, y, s, t, i) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 3 + i) * .2);
    if (i % 3 === 2) { kshape(g, (c) => { c.beginPath(); c.ellipse(0, 0, 46, 16, 0, 0, 7); }, "#c47a3a", { rim: "rgba(255,220,180,.7)", rw: 3, sw: 5 }); g.strokeStyle = "#c47a3a"; g.lineWidth = 4; g.beginPath(); g.moveTo(36, -8); g.lineTo(48, -26); g.moveTo(30, -10); g.lineTo(36, -28); g.stroke(); }
    else { g.strokeStyle = "#1b1724"; g.lineWidth = 4; for (const k of [-1, 0, 1]) { g.beginPath(); g.moveTo(k * 12, 0); g.lineTo(k * 16, 26); g.moveTo(k * 12, 0); g.lineTo(k * 16, -26); g.stroke(); }
      kshape(g, ell(0, 0, 30, 20, 0), i % 3 ? "#3fae5a" : "#5a3ad0", { rim: "rgba(255,255,255,.6)", rw: 3, sw: 5 }); g.fillStyle = "#1b1724"; g.beginPath(); g.arc(30, 0, 11, 0, 7); g.fill(); }
    g.restore(); }

  // ======================= Shots =======================
  function garden(t, cx, cy, z) { park(t, cx, cy, z); }
  function hookT(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    garden(t, lerp(-30, -10, k), -190, lerp(1.75, 1.95, k));
    tuft(-250, 0, 110, t, 1); tuft(260, 0, 90, t, 1);
    toadAt(30, 0, 1, { t, lid: .35, seed: 1, look: -.3 });
    // Rudis Hand kommt von links oben und stupst
    const reach = loop ? 0 : sm(clamp(lt / (d * .3), 0, 1)), poke = loop ? 0 : Math.max(0, Math.sin(clamp((lt - d * .3) / (d * .2), 0, 1) * Math.PI)) * 10;
    const hx = lerp(-520, -110, reach), hy = lerp(-560, -190 + poke, reach);
    g.strokeStyle = C.coat; g.lineWidth = 50; g.lineCap = "round"; g.beginPath(); g.moveTo(-700, -700); g.quadraticCurveTo(-380, -380, hx - 30, hy - 30); g.stroke();
    kshape(g, ell(hx, hy, 34, 30, .6), C.skin, { rim: "rgba(255,240,225,.9)", rw: 4, sw: 8 }); kshape(g, ell(hx + 34, hy + 22, 24, 11, .65), C.skin, { rw: 3, sw: 4 });
    if (loop) return;
    const wart = sm((lt - d * .45) / .3); if (wart > 0 && lt < d * .72) { qmark(W * .2, H * .38, .8, wart); g.fillStyle = "#9a6a4a"; for (const [wx, wy] of [[-10, -6], [14, 10], [-22, 14]]) { g.beginPath(); g.arc(hx + wx, hy + wy, 9 * wart, 0, 7); g.fill(); } }
    cross(W * .2, H * .38, 1.1, (lt - d * .72) / .2);
    stamp("NO WARTS!", W * .6, H * .3, (lt - d * .72) / .22, "#2fae6a", -.06); }
  KZ.shot("tHook", (lt, d, t) => hookT(lt, d, t, false));
  KZ.shot("tPanic", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-170, -210, k), -340, lerp(1.22, 1.34, k));
    at(rudi, -470, 0, 1, { t, arm: 1.5 + .5 * clamp(lt * 3, 0, 1), arm2: .5 + .5 * Math.sin(t * 10), mouth: "scream", mood: "scared", look: .8 });
    sweatS(W * .12, H * .12, t, 1); tuft(170, 0, 90, t, 1);
    toadAt(-40, 0, .75, { t, lid: .55, seed: 1 });
    bubble("WARTS?!", W * .4, H * .1, sm((lt - .15) / .3), -.04);
    stamp("PANIC", W * .62, H * .52, (lt - d * .5) / .22, "#e5484d", .06); });
  KZ.shot("tMitt", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(20, 60, k), -330, lerp(1.0, 1.08, k));
    boot(250, .7);
    const wx = lerp(-560, -330, sm(clamp(lt / (d * .7), 0, 1)));
    const r = at(rudi, wx, 0, .95, { t, walk: lt < d * .7, slow: true, arm: .25, mouth: "hmm", look: .5 });
    mitt(wx + r.hx * .95, r.hy * .95, 1, -.6);
    toadAt(40, 0, .6, { t, lid: .3, seed: 1, look: -.4 });
    stamp("SAFETY FIRST", W * .42, H * .2, (lt - d * .3) / .22, "#f08a1e", -.05); });
  KZ.shot("tBoot", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(120, 160, k), -300, lerp(1.25, 1.35, k));
    const p = sm(clamp(lt / (d * .45), 0, 1));
    const r = at(rudi, -170, 0, 1, { t, arm: .2, mouth: p < 1 ? "hmm" : "o", mood: p < 1 ? null : "scared", look: .6 });
    mitt(-170 + r.hx, r.hy, 1.05, -.6);
    if (p < 1) { const [x, y] = hopPos([40, 0], [230, -170], p, 260); boot(240, .8); toadAt(x, y, .55, { t, hop: Math.sin(p * Math.PI), seed: 1 }); }
    else { const pk = sm(clamp((lt - d * .45) / .3, 0, 1)); toadAt(232, -140 - 28 * pk, .55, { t, lid: .2, seed: 1, look: -.6 }); boot(240, .8); qmark(W * .78, H * .34, .6, pk); }
    stamp("NEW HOME", W * .58, H * .2, (lt - d * .55) / .22, "#3f8fe0", .05); });
  KZ.shot("tMoat", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-260, -200, k), -480, lerp(.62, .66, k));
    house(380, 1);
    const p = sm(clamp(lt / (d * .85), 0, 1)); moat(-240, 1000, p, t);
    const dx = lerp(-520, -360, p), dig = Math.sin(t * 9);
    const r = at(rudi, -560, 0, 1, { t, arm: .1 + .12 * dig, mouth: "grin", look: .4 });
    shovel(-560 + r.hx, r.hy, -560 + r.hx + 120, r.hy + 150 + dig * 20);
    for (let i = 0; i < 4; i++) { const ph = (t * 1.5 + i / 4) % 1; g.fillStyle = "#6a4426"; g.beginPath(); g.arc(dx - ph * 260, -40 - Math.sin(ph * Math.PI) * 200, 16, 0, 7); g.fill(); }
    stamp("MOAT", W * .5, H * .2, (lt - d * .35) / .22, "#2f6fd0", -.05); });
  KZ.shot("tMoat2", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-60, 0, k), -300, lerp(1.1, 1.2, k));
    house(560, 1); moat(-260, 1000, 1, t);
    at(rudi, -390, 0, .95, { t, arm: 1.5 + .4 * clamp(lt * 2, 0, 1), mouth: "o", mood: "scared", look: .6 });
    const p = sm(clamp(lt / (d * .4), 0, 1)); const [x, y] = hopPos([-190, 0], [150, 30], p, 240);
    toadAt(x + (p >= 1 ? Math.sin(t * 1.5) * 30 : 0), y, .7, { t, hop: p < 1 ? Math.sin(p * Math.PI) : 0, swim: p >= 1 ? 1 : 0, lid: .5, seed: 1 });
    if (p >= 1) { waterFront(-260, 1000, t); for (let i = 0; i < 3; i++) { const ph = (t * .9 + i / 3) % 1; g.strokeStyle = `rgba(255,255,255,${.7 * (1 - ph)})`; g.lineWidth = 5; g.beginPath(); g.ellipse(120 + Math.sin(t * 1.5) * 30, -20, 60 + ph * 160, 12 + ph * 30, 0, 0, 7); g.stroke(); } }
    stamp("SPLASH!", W * .56, H * .2, (lt - d * .45) / .22, "#2fae6a", .05); });
  KZ.shot("tVirus", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("WARTS COME FROM...", W * .44, H * .07, 60, "#fff", { w: 900, a: sm(lt / .3) });
    const a1 = sm((lt - .15) / .35); virus(W * .18, H * .22, 62, t, a1); txt("HUMAN VIRUS", W * .18, H * .31, 40, "#ffb0d0", { w: 900, a: a1 }); txt("(HPV)", W * .18, H * .345, 36, "#c9d0ff", { w: 800, a: a1 });
    arrow(W * .32, W * .5, H * .22, (lt - d * .15) / .3); handIcon(W * .62, H * .23, .8, sm((lt - d * .22) / .3), { wart: 1 }); check(W * .8, H * .22, .9, (lt - d * .32) / .25);
    const a2 = sm((lt - d * .5) / .35); toadIcon(W * .16, H * .5, .48, a2, { t, lid: .35, seed: 2 });
    arrow(W * .32, W * .5, H * .46, (lt - d * .58) / .3); handIcon(W * .62, H * .47, .8, sm((lt - d * .62) / .3), {}); cross(W * .8, H * .46, .9, (lt - d * .72) / .25);
    wobbleAll(lt, d, t); });
  KZ.shot("tGlands", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("NOT WARTS...", W * .44, H * .07, 60, "#fff", { w: 900, a: sm(lt / .3) });
    toadIcon(W * .46, H * .27, .95, sm(lt / .3), { t, lid: .3, seed: 2 });
    // Querschnitt Haut
    const a = sm((lt - d * .3) / .35); if (a > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; const x0 = W * .1, x1 = W * .8, y0 = H * .4;
      g.fillStyle = "#e9b98a"; g.fillRect(x0, y0 + 40, x1 - x0, 150); g.fillStyle = T.skin; g.beginPath(); g.moveTo(x0, y0 + 40);
      for (let i = 0; i < 4; i++) { const bx = x0 + 70 + i * 190; g.lineTo(bx - 75, y0 + 40); g.bezierCurveTo(bx - 70, y0 - 60, bx + 70, y0 - 60, bx + 75, y0 + 40); } g.lineTo(x1, y0 + 40); g.lineTo(x1, y0 + 80); g.lineTo(x0, y0 + 80); g.closePath(); g.fill();
      for (let i = 0; i < 4; i++) { const bx = x0 + 70 + i * 190, pulse = 1 + .06 * Math.sin(t * 4 + i); g.globalCompositeOperation = "lighter"; glow(bx, y0 + 50, 60, "rgba(255,240,160,.3)"); g.globalCompositeOperation = "source-over";
        g.fillStyle = "#f6e08a"; g.fillRect(bx - 4, y0 - 14, 8, 50); kshape(g, ell(bx, y0 + 60, 36 * pulse, 26 * pulse, 0), "#fff1b0", { rim: "rgba(255,255,255,.9)", rw: 4, sw: 6 }); }
      g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 5; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(W * .5, H * .3); g.lineTo(x0, y0 - 40); g.moveTo(W * .5, H * .3); g.lineTo(x1, y0 - 40); g.stroke(); g.setLineDash([]);
      g.strokeStyle = "#fff"; g.lineWidth = 8; g.beginPath(); g.arc(W * .5, H * .265, 46, 0, 7); g.stroke();
      txt("SKIN", x1 - 70, y0 + 150, 40, "#7a4a22", { w: 900 });
      g.restore(); label("GLAND", W * .18, H * .56, sm((lt - d * .5) / .2)); }
    stamp("GLANDS", W * .58, H * .58, (lt - d * .55) / .22, "#2fae6a", .05); wobbleAll(lt, d, t); });
  KZ.shot("tPoison", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(10, 30, k), -180, lerp(2.5, 2.8, k));
    toadAt(0, 0, 1, { t, lid: .4, seed: 1, ooze: sm(clamp((lt - d * .15) / (d * .4), 0, 1)), glandGlow: .5 + .5 * Math.sin(t * 4) });
    label("POISON GLAND", W * .5, H * .2, sm((lt - .1) / .25));
    stamp("BITTER!", W * .5, H * .63, (lt - d * .5) / .22, "#9a4ad0", -.05); });
  KZ.shot("tDog", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-20, 20, k), -330, lerp(1.05, 1.15, k));
    dogAt(-330, 0, .62, { t, mouth: "open", wag: .1, look: .3, mood: "scared" });
    // Schaum am Maul
    const fa = sm(clamp(lt / (d * .4), 0, 1)); g.fillStyle = "#fbfbf6"; for (let i = 0; i < 9; i++) { const r = (10 + (i * 7) % 12) * fa, bx = -330 + .62 * (350 + (i % 3) * 18 - 20), by = .62 * (-382 + Math.floor(i / 3) * 20) + Math.sin(t * 6 + i) * 3; g.beginPath(); g.arc(bx, by, r, 0, 7); g.fill(); }
    toadAt(200, 0, .6, { t, lid: .55, seed: 1, look: -.5, ooze: .6 }); sweatS(W * .24, H * .22, t, fa);
    stamp("FOAM!", W * .58, H * .2, (lt - d * .35) / .22, "#e5484d", .05); });
  KZ.shot("tSource", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.07, sm(lt / d)) + Math.sin(t * 2) * .012);
    toadIcon(W * .46, H * .17, .9, sm(lt / .3), { t, lid: .3, seed: 3 });
    card(W * .44, H * .4, 920, 310, (lt - .2) / .3, "BURKE MUSEUM", "#2f6fd0");
    txt("“No, there are no amphibians", W * .44, H * .4 - 16, 40, "#1b1d3a", { w: 800, a: sm((lt - .4) / .2) });
    txt("that give you warts.”", W * .44, H * .4 + 36, 40, "#1b1d3a", { w: 800, a: sm((lt - .5) / .2) });
    txt("Warts are caused by viruses.", W * .44, H * .4 + 100, 34, "#4a4f70", { w: 800, a: sm((lt - d * .45) / .2) });
    stamp("MYTH", W * .66, H * .58, (lt - d * .6) / .22, "#e5484d", .07); wobbleAll(lt, d, t); });
  KZ.shot("tBugs", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("1 TOAD, 1 SUMMER", W * .44, H * .07, 60, "#fff", { w: 900, a: sm(lt / .3) });
    const n = Math.round(10000 * sm(clamp((lt - .2) / (d * .6), 0, 1)));
    txt("UP TO", W * .44, H * .14, 44, "#c9d0ff", { w: 800, a: sm((lt - .1) / .3) });
    txt(n.toLocaleString("en-US"), W * .44, H * .22, 140, "#ffd84d", { w: 900, a: sm((lt - .15) / .3), stroke: 10 });
    txt("BUGS EATEN", W * .44, H * .3, 52, "#fff", { w: 900, a: sm((lt - .3) / .3) });
    const tg = Math.max(0, Math.sin(t * 5)) ** 3;
    toadIcon(W * .22, H * .52, .8, sm((lt - .2) / .3), { t, lid: .2, seed: 2, tongue: tg * .9 });
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 7; i++) { const ph = (t * .35 + i / 7) % 1; const x = lerp(W * .82, W * .38, ph), y = H * (.4 + (i % 3) * .06) + (H * .48 - H * (.4 + (i % 3) * .06)) * ph; g.globalAlpha = ph < .85 ? 1 : (1 - ph) / .15; bug(x, y, .9, t, i); } g.restore();
    txt("American toad · Virginia DWR", W * .44, H * .62, 32, "#c9d0ff", { w: 700, a: sm((lt - d * .5) / .3) });
    wobbleAll(lt, d, t); });
  KZ.shot("tParty", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-40, 0, k), -300, lerp(1.0, 1.08, k));
    house(560, 1); moat(-370, 1100, 1, t);
    at(rudi, -480, 0, .95, { t, arm: 1.5 + .5 * clamp(lt * 2, 0, 1), mouth: "hmm", look: .6 });
    const toads = [[-200, .7, 0, 0], [50, .78, 1, 1], [300, .66, 0, 2]];
    toads.forEach(([x, s, sh, i]) => { const a = sm((lt - .1 - i * .25) / .3); if (a <= 0) return; const bob = Math.sin(t * 2 + i) * 8;
      if (i === 1) ring(x + 20, 0 + bob, .8, "#ff6fa0"); toadAt(x + Math.sin(t * 1.2 + i) * 20, 40 + bob - 40 * a, s, { t, swim: 1, lid: .55, seed: i + 1, shades: sh }); });
    waterFront(-370, 1100, t);
    sparkle(W * .3, H * .3, 30, sm((lt - d * .4) / .2)); sparkle(W * .7, H * .26, 26, sm((lt - d * .5) / .2));
    stamp("POOL PARTY", W * .46, H * .18, (lt - d * .4) / .22, "#e5487a", -.05); });
  KZ.shot("tTip", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("DO THIS INSTEAD", W * .44, H * .06, 60, "#fff", { w: 900, a: sm(lt / .3) });
    const rows = [["LEAVE IT BE", "it eats your slugs", 0], ["WASH YOUR HANDS", "after touching one", 1], ["KEEP YOUR DOG AWAY", "no toad snacks", 2]];
    rows.forEach(([h1, h2, i]) => { const p = (lt - .1 - i * d * .25) / .3, y = H * (.16 + i * .17); card(W * .44, y, 880, 190, p); if (p <= 0) return; const a = sm(p);
      if (i === 0) toadIcon(W * .44 - 300, y + 50, .36, a, { t, lid: .4, seed: 2 }); if (i === 1) handIcon(W * .44 - 300, y + 20, .5, a, { drops: 1, t }); if (i === 2) dogHead(W * .44 - 300, y, .9, false, a);
      txt(h1, W * .44 + 80, y - 22, 48, "#1b1d3a", { w: 900, a }); txt(h2, W * .44 + 80, y + 34, 38, "#4a4f70", { w: 800, a }); });
    check(W * .8, H * .64, .7, (lt - d * .8) / .2); wobbleAll(lt, d, t); });
  KZ.shot("tLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .55) { garden(t, lerp(-170, -150, k), -340, lerp(1.2, 1.26, k)); at(rudi, -430, 0, 1, { t, arm: .6, mouth: "o", look: .8 }); tuft(250, 0, 90, t, 1); toadAt(120, 0, .75, { t, lid: .4, seed: 1 });
      bubble("A TOAD!", W * .4, H * .1, sm((lt - .1) / .25), -.04); }
    else hookT(0, d, t, true); });
  (function () { const SH = KZ.SHOTS; const split = (a, b, f) => (lt, d, t) => { const c = d * f; if (lt < c) SH[a](lt, c, t); else SH[b](lt - c, d - c, t); };
    KZ.shot("tMittFull", split("tMitt", "tBoot", .48));
    KZ.shot("tMoatFull", split("tMoat", "tMoat2", .55));
    KZ.shot("tPoisonFull", split("tPoison", "tDog", .5)); })();
})();
