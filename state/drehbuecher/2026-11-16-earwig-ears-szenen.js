// Szenendatei "Earwigs Don't Crawl Into Your Ears" (Gemeiner Ohrwurm Forficula auricularia, Comedy-Story + Mix-Stil, 16.11.2026).
// Quellen: Virginia Tech VCE 3101-1527 ("This belief is totally unfounded"), Penn State Extension (earwig = "ear creature"), NC State, OSU/Clemson (Weibchen bewacht 20-50 Eier, putzt sie), UMN (Zangen harmlos), RHS (fressen Blattläuse, Topf mit Stroh).
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

  // ======================= Gemeiner Ohrwurm (Forficula auricularia) – neu gezeichnet 16.11.2026 =======================
  // Draufsicht, Kopf zeigt nach +x, Mitte bei 0. Länge ~520 (Fühlerspitzen +330, Zangenspitzen -320), Breite ~80 (+ Beine ±105).
  // Merkmale: flacher, langer rotbrauner Körper, kurze lederartige Deckflügel (hellbraun), Hinterflügel-Spitzen schauen heraus,
  // Halsschild, Perlschnur-Fühler, 6 helle Beine, Zangen (Cerci) am Hinterleib – Männchen stark gebogen, Weibchen gerade.
  const E = { body: "#a23c22", bodyD: "#5e1e12", head: "#7e2a18", pron: "#c0603a", ely: "#dca25a", elyD: "#a8743a", wing: "#f6ead0", leg: "#efc77e", legD: "#b88a44", cer: "#6e2414", ant: "#c8804c" };
  function earwig(c, o) { o = o || {}; const t = o.t || 0, seed = o.seed || 0, ph = t * (o.walk || 0), br = 1 + .02 * Math.sin(t * 2.4 + seed);
    c.save(); c.scale(1, br);
    // Beine (Dreifuß-Gang)
    const LEGS = [[96, 60, 92, 0], [58, 2, 106, 1], [18, -58, 94, 0]];
    for (const sd of [-1, 1]) for (const [ax, fx, fy, grp] of LEGS) { const phs = ph + ((grp + (sd > 0 ? 0 : 1)) % 2) * Math.PI, sw = o.walk ? Math.sin(phs) * 18 : 0;
      const kx = ax + (fx - ax) * .25 + sw * .4 + (fx > ax ? 10 : fx < ax ? -6 : 0), ky = sd * fy * .72, px = fx + sw, py = sd * fy;
      c.lineCap = "round"; c.lineJoin = "round";
      c.strokeStyle = E.legD; c.lineWidth = 13; c.beginPath(); c.moveTo(ax, sd * 18); c.lineTo(kx, ky); c.lineTo(px, py); c.stroke();
      c.strokeStyle = E.leg; c.lineWidth = 8; c.beginPath(); c.moveTo(ax, sd * 18); c.lineTo(kx, ky); c.lineTo(px, py); c.stroke();
      c.strokeStyle = E.legD; c.lineWidth = 5; c.beginPath(); c.moveTo(px, py); c.lineTo(px + (fx >= ax ? 14 : -14), py + sd * 6); c.stroke(); }
    // Zangen
    const pin = o.pinch || 0;
    for (const m of [-1, 1]) { c.save(); c.translate(-196, m * 11); c.rotate(m * pin * .35);
      kshape(c, (c) => { c.beginPath(); c.moveTo(0, m * 12);
        if (o.female) { c.bezierCurveTo(-50, m * 22, -100, m * 16, -128, m * 5); c.bezierCurveTo(-104, m * 4, -60, m * 2, 0, m * -8); }
        else { c.bezierCurveTo(-34, m * 58, -98, m * 60, -122, m * 6); c.bezierCurveTo(-96, m * 34, -46, m * 30, 0, m * -8); }
        c.closePath(); }, E.cer, { rim: "rgba(255,190,160,.55)", shadow: "rgba(30,0,0,.3)", rw: 4, sw: 6 });
      c.restore(); }
    // Hinterleib (gegliedert)
    kshape(c, (c) => { c.beginPath(); c.moveTo(-6, -34); c.bezierCurveTo(-70, -46, -160, -42, -204, -20); c.quadraticCurveTo(-216, 0, -204, 20); c.bezierCurveTo(-160, 42, -70, 46, -6, 34); c.closePath(); }, E.body, { rim: "rgba(255,190,150,.6)", shadow: "rgba(40,0,0,.3)", rw: 6, sw: 12 });
    c.strokeStyle = "rgba(70,15,8,.65)"; c.lineWidth = 4; for (let i = 0; i < 6; i++) { const x = -40 - i * 28, h = 40 - i * 3.2; c.beginPath(); c.moveTo(x, -h); c.quadraticCurveTo(x - 12, 0, x, h); c.stroke(); }
    c.fillStyle = "rgba(255,200,170,.22)"; c.beginPath(); c.ellipse(-100, -10, 80, 8, 0, 0, 7); c.fill();
    // Hinterflügel-Spitzen
    for (const m of [-1, 1]) kshape(c, ell(-22, m * 12, 22, 10, 0), E.wing, { rw: 2, sw: 3 });
    // Deckflügel
    kshape(c, (c) => { c.beginPath(); c.roundRect(-10, -38, 78, 76, 14); }, E.ely, { rim: "rgba(255,240,200,.85)", shadow: "rgba(90,40,0,.3)", rw: 5, sw: 10 });
    c.strokeStyle = E.elyD; c.lineWidth = 4; c.beginPath(); c.moveTo(-10, 0); c.lineTo(68, 0); c.stroke();
    // Halsschild
    kshape(c, (c) => { c.beginPath(); c.roundRect(66, -30, 48, 60, 16); }, E.pron, { rim: "rgba(255,220,180,.7)", rw: 4, sw: 8 });
    c.fillStyle = "rgba(255,225,170,.55)"; c.fillRect(70, -28, 8, 56); c.fillRect(102, -28, 8, 56);
    // Fühler (Perlschnur)
    for (const m of [-1, 1]) { const sw1 = Math.sin(t * 3.1 + m + seed) * 14 * (o.antF ?? 1), sw2 = Math.sin(t * 2.3 + m * 2 + seed) * 22 * (o.antF ?? 1);
      for (let i = 0; i < 13; i++) { const u = i / 12, x = (1 - u) ** 2 * 172 + 2 * (1 - u) * u * 250 + u * u * 330, y = (1 - u) ** 2 * m * 16 + 2 * (1 - u) * u * m * (30 + sw1) + u * u * m * (96 + sw2);
        c.fillStyle = i % 2 ? E.ant : "#a8603a"; c.beginPath(); c.arc(x, y, 7 - u * 2.5, 0, 7); c.fill(); } }
    // Kopf
    kshape(c, ell(142, 0, 42, 35, 0), E.head, { rim: "rgba(255,190,150,.7)", shadow: "rgba(30,0,0,.3)", rw: 5, sw: 10 });
    const mo = o.munch ? Math.abs(Math.sin(t * 12)) * .5 : 0;
    c.strokeStyle = "#3a120a"; c.lineWidth = 6; c.lineCap = "round"; for (const m of [-1, 1]) { c.beginPath(); c.moveTo(178, m * 10); c.quadraticCurveTo(196, m * (10 + mo * 14), 194, m * (2 - mo * 4)); c.stroke(); }
    fig.eye(c, 146, -18, 15, { t, seed: seed + 5, look: o.look ?? .6, mood: o.mood }); fig.eye(c, 146, 18, 15, { t, seed: seed + 5, look: o.look ?? .6, mood: o.mood });
    c.restore(); }
  function wigAt(x, y, s, o, rot) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s); earwig(g, o); g.restore(); }
  function wigIcon(x, y, s, a, o, rot) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(rot || 0); const k = easeBack(Math.min(a, 1)); g.scale(s * k, s * k); earwig(g, o || {}); g.restore(); }

  // ---------- Schlafzimmer (Nacht) + Bett mit liegendem Rudi ----------
  function bedroom(t, cx, cy, z) { g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2b2a6e"); bg.addColorStop(1, "#151640"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(cx, cy, z);
    g.fillStyle = "#33357e"; g.fillRect(-3000, -2400, 6000, 2400); g.fillStyle = "rgba(255,255,255,.05)"; for (let x = -2000; x < 2000; x += 160) g.fillRect(x, -2400, 70, 2400);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-620, -960, 420, 460, 20); }, "#c9a46a", { rw: 5, sw: 12 }); g.fillStyle = "#0d1238"; g.fillRect(-594, -934, 368, 408);
    g.save(); g.globalCompositeOperation = "lighter"; glow(-330, -820, 160, "rgba(200,220,255,.35)"); g.restore(); g.fillStyle = "#eef2ff"; g.beginPath(); g.arc(-330, -820, 50, 0, 7); g.fill(); g.fillStyle = "#0d1238"; g.beginPath(); g.arc(-304, -832, 44, 0, 7); g.fill();
    g.fillStyle = "#fff"; for (let i = 0; i < 8; i++) { g.globalAlpha = .5 + .5 * Math.sin(t * 2 + i); g.beginPath(); g.arc(-570 + (i * 67) % 320, -910 + (i * 53) % 300, 4, 0, 7); g.fill(); } g.globalAlpha = 1;
    g.fillStyle = "#c9a46a"; g.fillRect(-416, -960, 12, 460); g.fillRect(-620, -736, 420, 12);
    const fg = g.createLinearGradient(0, 0, 0, 900); fg.addColorStop(0, "#6a4a3a"); fg.addColorStop(1, "#3a2620"); g.fillStyle = fg; g.fillRect(-3000, 0, 6000, 3000);
    g.save(); g.globalCompositeOperation = "lighter"; glow(700, -420, 520, "rgba(255,200,120,.22)"); g.restore(); }
  function nightLamp(x) { kshape(g, (c) => { c.beginPath(); c.roundRect(x - 90, -200, 180, 200, 12); }, "#8a5a3a", { rim: "rgba(255,220,180,.5)", rw: 4, sw: 8 });
    kshape(g, (c) => { c.beginPath(); c.rect(x - 8, -330, 16, 130); }, "#c9a46a", { rw: 2, sw: 4 }); kshape(g, (c) => { c.beginPath(); c.moveTo(x - 80, -320); c.lineTo(x - 50, -420); c.lineTo(x + 50, -420); c.lineTo(x + 80, -320); c.closePath(); }, "#ffd88a", { rim: "rgba(255,255,230,.9)", rw: 4, sw: 8 });
    g.save(); g.globalCompositeOperation = "lighter"; glow(x, -360, 240, "rgba(255,210,120,.35)"); g.restore(); }
  // Bett: Matratzen-Oberkante y=-200, Kopfende rechts (x ~ +560). Rudi liegt auf dem Rücken, Kopf rechts.
  function bed(t, o) { o = o || {}; const s = .95, bx = 12;
    kshape(g, (c) => { c.beginPath(); c.roundRect(560, -560, 60, 560, 20); }, "#9a5a32", { rim: "rgba(255,210,170,.6)", rw: 5, sw: 12 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-480, -330, 50, 330, 18); }, "#9a5a32", { rim: "rgba(255,210,170,.6)", rw: 5, sw: 12 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-460, -230, 1040, 150, 20); }, "#eaeaf5", { rim: "rgba(255,255,255,.9)", shadow: "rgba(40,40,90,.25)", rw: 5, sw: 14 });
    kshape(g, ell(440, -230, 120, 48, 0), "#f7f4ec", { rim: "#fff", rw: 4, sw: 8 });
    // Rudi liegt im Bett: Kopf frontal auf dem Kissen (Cartoon-Konvention), Körper unter der Decke
    const hx = 420, hy = -300 + Math.sin(t * (o.sleep ? .8 : 2)) * 3;
    kshape(g, (c) => { c.beginPath(); c.roundRect(hx - 70, hy + 40, 140, 60, 26); }, C.coat, { rim: "rgba(255,245,200,.7)", rw: 4, sw: 8 });
    if (o.muffs) { g.strokeStyle = "#e5487a"; g.lineWidth = 24; g.lineCap = "round"; g.beginPath(); g.arc(hx, hy - 10, 104, Math.PI + .25, -.25); g.stroke(); }
    kshape(g, ell(hx, hy, 82, 80, 0), C.skin, { rim: "rgba(255,240,225,.8)", shadow: "rgba(150,60,40,.22)", rw: 6, sw: 18 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(hx - 80, hy - 20); c.bezierCurveTo(hx - 84, hy - 120, hx + 84, hy - 120, hx + 80, hy - 20); c.closePath(); }, C.hat, { rim: "rgba(255,200,200,.6)", rw: 5, sw: 12 });
    g.fillStyle = "#c23238"; g.beginPath(); g.roundRect(hx - 84, hy - 36, 168, 26, 13); g.fill();
    kshape(g, ell(hx + 70, hy - 96, 22, 22, 0), "#fff1e8", { rw: 3, sw: 6 });
    g.fillStyle = "rgba(240,120,110,.35)"; g.beginPath(); g.ellipse(hx - 46, hy + 30, 15, 9, 0, 0, 7); g.ellipse(hx + 46, hy + 30, 15, 9, 0, 0, 7); g.fill();
    if (o.sleep) { g.strokeStyle = "#3a2030"; g.lineWidth = 6; g.lineCap = "round"; for (const ex of [-28, 28]) { g.beginPath(); g.arc(hx + ex, hy + 4, 13, .3, 2.8); g.stroke(); } }
    else { fig.eye(g, hx - 28, hy + 4, 17, { t, seed: 3, look: o.look ?? 0, mood: o.mood }); fig.eye(g, hx + 28, hy + 4, 17, { t, seed: 3, look: o.look ?? 0, mood: o.mood }); }
    g.strokeStyle = "#7a2a2a"; g.fillStyle = "#7a2a2a"; g.lineWidth = 6; g.lineCap = "round";
    if (o.mouth === "o") { g.beginPath(); g.ellipse(hx, hy + 46, 10, 13, 0, 0, 7); g.fill(); }
    else if (o.mouth === "hmm") { g.beginPath(); g.moveTo(hx - 16, hy + 46); g.lineTo(hx + 16, hy + 42); g.stroke(); }
    else { g.beginPath(); g.arc(hx, hy + 30, 20, .4, 2.7); g.stroke(); }
    if (o.muffs) for (const sx of [-1, 1]) { kshape(g, ell(hx + sx * 92, hy + 6, 46, 54, 0), "#ff7aa8", { rim: "rgba(255,230,240,.9)", shadow: "rgba(120,20,60,.25)", rw: 6, sw: 12 });
      g.fillStyle = "rgba(255,255,255,.55)"; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; g.beginPath(); g.arc(hx + sx * 92 + Math.cos(a) * 42, hy + 6 + Math.sin(a) * 50, 8, 0, 7); g.fill(); } }
    if (o.helmet) { g.save(); g.globalCompositeOperation = "lighter"; glow(hx, hy - 20, 230, "rgba(140,220,255,.25)"); g.restore();
      kshape(g, (c) => { c.beginPath(); c.roundRect(hx - 150, hy + 76, 300, 50, 20); }, "#c9d0e6", { rim: "#fff", rw: 4, sw: 8 });
      g.fillStyle = "#e5484d"; g.beginPath(); g.arc(hx - 100, hy + 101, 10 + 3 * Math.sin(t * 6), 0, 7); g.fill(); g.fillStyle = "#3fae5a"; g.beginPath(); g.arc(hx - 64, hy + 101, 10, 0, 7); g.fill();
      g.fillStyle = "rgba(170,230,255,.2)"; g.beginPath(); g.arc(hx, hy - 20, 150, 0, 7); g.fill();
      g.strokeStyle = "rgba(220,245,255,.9)"; g.lineWidth = 10; g.beginPath(); g.arc(hx, hy - 20, 150, 0, 7); g.stroke();
      g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.arc(hx, hy - 20, 118, -2.6, -1.9); g.stroke(); }
    // Decke
    kshape(g, (c) => { c.beginPath(); c.moveTo(-470, -150); c.bezierCurveTo(-460, -330 + Math.sin(t * 1.6) * 6, 150, -340 + Math.sin(t * 1.6) * 8, 340, -240); c.quadraticCurveTo(372, -180, 360, -110); c.lineTo(-470, -110); c.closePath(); }, "#3f6fd0", { rim: "rgba(200,225,255,.7)", shadow: "rgba(10,20,60,.35)", rw: 6, sw: 18 });
    g.fillStyle = "rgba(255,255,255,.12)"; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(-380 + i * 150, -220, 26, 0, 7); g.fill(); }
    return { hx, hy }; }
  function zzz(x, y, t, a) { if (a <= 0) return; for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; txt("z", x + ph * 120 + i * 10, y - ph * 200, 50 + ph * 40, "#c9d0ff", { a: a * Math.sin(ph * Math.PI), w: 900 }); } }

  // ---------- Riesiges Ohr (Nahaufnahme, Rudi schläft) ----------
  function earClose(t, cx, cy, z) { g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, "#f7c9a2"); bg.addColorStop(1, "#e8a77e"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(cx, cy, z);
    // Haare oben, Kissen unten
    kshape(g, (c) => { c.beginPath(); c.moveTo(-1400, -700); c.bezierCurveTo(-600, -560, 300, -640, 1400, -520); c.lineTo(1400, -2000); c.lineTo(-1400, -2000); c.closePath(); }, "#6a3a22", { rim: "rgba(255,200,150,.35)", rw: 8, sw: 20 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(-1400, 560); c.bezierCurveTo(-500, 470 + Math.sin(t) * 6, 500, 520, 1400, 470); c.lineTo(1400, 2000); c.lineTo(-1400, 2000); c.closePath(); }, "#eef0fa", { rim: "#fff", shadow: "rgba(60,60,120,.25)", rw: 8, sw: 26 });
    // Ohrmuschel
    kshape(g, (c) => { c.beginPath(); c.moveTo(-60, -330); c.bezierCurveTo(170, -380, 270, -170, 230, 20); c.bezierCurveTo(200, 170, 120, 220, 110, 330); c.bezierCurveTo(100, 420, -20, 430, -60, 360); c.bezierCurveTo(-100, 290, -40, 230, -80, 150); c.bezierCurveTo(-200, -60, -230, -300, -60, -330); c.closePath(); }, "#f3b48c", { rim: "rgba(255,235,215,.9)", shadow: "rgba(150,60,40,.3)", rw: 10, sw: 30 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(-40, -230); c.bezierCurveTo(110, -260, 170, -120, 140, 20); c.bezierCurveTo(120, 120, 40, 160, 20, 240); c.bezierCurveTo(-30, 180, -10, 120, -40, 60); c.bezierCurveTo(-120, -60, -140, -210, -40, -230); c.closePath(); }, "#e0906a", { rim: "rgba(255,210,190,.5)", shadow: "rgba(120,40,30,.35)", rw: 6, sw: 22 });
    g.strokeStyle = "rgba(255,225,200,.8)"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(-60, -150); g.bezierCurveTo(60, -190, 110, -70, 70, 30); g.stroke();
    const cg = g.createRadialGradient(10, 90, 6, 10, 90, 70); cg.addColorStop(0, "#2a0e10"); cg.addColorStop(1, "#8a3a30"); g.fillStyle = cg; g.beginPath(); g.ellipse(10, 90, 52, 64, .2, 0, 7); g.fill(); }

  // ---------- Garten bei Nacht: Dahlie, Apfelzweig mit Blattläusen ----------
  function dahlia(x, y, s, t, bite) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 1.1) * .03);
    g.strokeStyle = "#2f8a48"; g.lineWidth = 22; g.beginPath(); g.moveTo(0, 0); g.lineTo(-30, 900); g.stroke();
    kshape(g, ell(-120, 300, 110, 40, -.5), C.leafD, { rw: 4, sw: 8 });
    for (const [n, r, col, rr] of [[16, 260, "#e5487a", 0], [14, 190, "#ff6f9a", .2], [12, 120, "#ff9ab8", .1]]) for (let i = 0; i < n; i++) { const a = i / n * 6.283 + rr;
      if (bite && r === 260 && (i === 3 || i === 4)) continue;
      g.save(); g.rotate(a); kshape(g, (c) => { c.beginPath(); c.moveTo(0, -20); c.quadraticCurveTo(r * .28, -r * .55, 0, -r); c.quadraticCurveTo(-r * .28, -r * .55, 0, -20); c.closePath(); }, col, { rim: "rgba(255,230,240,.8)", shadow: "rgba(120,20,60,.25)", rw: 4, sw: 8 }); g.restore(); }
    kshape(g, ell(0, 0, 60, 60, 0), "#ffcf3a", { rim: "#fff6c8", rw: 4, sw: 8 }); g.restore(); }
  function gardenNight(t, cx, cy, z) { nightPark(t, cx, cy, z); }
  function branchBg(t, cx, cy, z) { g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#14205a"); bg.addColorStop(1, "#0a1030"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .75, H * .12, 300, "rgba(200,220,255,.3)"); g.restore(); g.fillStyle = "#eef2ff"; g.beginPath(); g.arc(W * .75, H * .12, 60, 0, 7); g.fill();
    cam(cx, cy, z);
    g.strokeStyle = "#5a3a22"; g.lineCap = "round"; g.lineWidth = 120; g.beginPath(); g.moveTo(-1400, 500); g.quadraticCurveTo(-200, 120, 1400, 40); g.stroke();
    g.strokeStyle = "#7a5232"; g.lineWidth = 30; g.beginPath(); g.moveTo(-1400, 470); g.quadraticCurveTo(-200, 90, 1400, 10); g.stroke();
    for (const [lx, ly, r] of [[-700, 160, -.6], [-200, 40, -.3], [450, -40, -.5], [900, 0, .4], [-450, 340, 2.4], [250, 180, 2.7], [800, 160, 2.6]]) { g.save(); g.translate(lx, ly); g.rotate(r + Math.sin(t * 1.3 + lx) * .05);
      kshape(g, (c) => { c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(110, -90, 260, 0); c.quadraticCurveTo(110, 90, 0, 0); c.closePath(); }, C.leaf, { rim: "rgba(210,255,200,.5)", rw: 5, sw: 10 });
      g.strokeStyle = "rgba(220,255,200,.5)"; g.lineWidth = 4; g.beginPath(); g.moveTo(10, 0); g.lineTo(240, 0); g.stroke(); g.restore(); }
    // Apfel
    kshape(g, ell(-60, 330, 110, 100, 0), "#e5484d", { rim: "rgba(255,210,200,.8)", shadow: "rgba(90,0,0,.3)", rw: 6, sw: 16 }); g.strokeStyle = "#5a3a22"; g.lineWidth = 12; g.beginPath(); g.moveTo(-60, 232); g.lineTo(-40, 180); g.stroke(); }
  function branchY(x) { const u = (x + 1400) / 2800; return (1 - u) ** 2 * 470 + 2 * (1 - u) * u * 90 + u * u * 10 - 60; }

  function aphid(x, y, s, t, i) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 2 + i) * .08);
    g.strokeStyle = "#5aa040"; g.lineWidth = 3; for (const k of [-1, 0, 1]) { g.beginPath(); g.moveTo(k * 8, 6); g.lineTo(k * 16, 22); g.stroke(); }
    kshape(g, (c) => { c.beginPath(); c.moveTo(-26, 0); c.bezierCurveTo(-26, -24, 18, -22, 26, -4); c.quadraticCurveTo(14, 14, -26, 0); c.closePath(); }, C.aphid, { rim: "rgba(240,255,220,.8)", rw: 3, sw: 5 });
    g.fillStyle = "#22301a"; g.beginPath(); g.arc(18, -8, 3, 0, 7); g.fill(); g.restore(); }
  function handIcon(x, y, s, a, o) { if (a <= 0) return; o = o || {}; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); const k = easeBack(Math.min(a, 1)); g.scale(s * k, s * k);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-60, -40, 120, 120, 40); }, C.skin, { rim: "rgba(255,240,225,.9)", rw: 5, sw: 10 });
    for (let i = 0; i < 4; i++) kshape(g, (c) => { c.beginPath(); c.roundRect(-58 + i * 30, -120 + Math.abs(i - 1.5) * 10, 26, 100, 13); }, C.skin, { rim: "rgba(255,240,225,.9)", rw: 4, sw: 6 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(48, -30, 26, 80, 13); }, C.skin, { rw: 3, sw: 5 });
    if (o.wart) { g.fillStyle = "#b07a5a"; for (const [wx, wy, r] of [[-10, 10, 16], [22, 36, 11], [-30, 44, 9]]) { g.beginPath(); g.arc(wx, wy, r * o.wart, 0, 7); g.fill(); g.fillStyle = "#d6a080"; g.beginPath(); g.arc(wx + 3, wy - 4, r * .4 * o.wart, 0, 7); g.fill(); g.fillStyle = "#b07a5a"; } }
    if (o.drops) { g.fillStyle = "#8fd8ff"; for (let i = 0; i < 4; i++) { const ph = (o.t * 1.4 + i / 4) % 1; g.beginPath(); g.arc(-50 + i * 34, -140 + ph * 260, 9, 0, 7); g.fill(); } }
    g.restore(); }
  // ---------- Infografik-Hilfen ----------
  function eggs(x, y, s, n, t, shine) { g.save(); g.translate(x, y); g.scale(s, s); let k = 0;
    for (let row = 0; row < 5 && k < n; row++) for (let i = 0; i < 9 - row * 2 && k < n; i++, k++) { const ex = (i - (8 - row * 2) / 2) * 34, ey = -row * 26;
      kshape(g, ell(ex, ey, 18, 14, .2), "#fff6dc", { rim: "#fff", shadow: "rgba(150,120,60,.35)", rw: 2, sw: 4 }); }
    if (shine) sparkle(60, -120, 18, shine * (.5 + .5 * Math.sin(t * 5)));
    g.restore(); }
  function burrow(x, y, w, h) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#5a3a22"; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, 40); g.fill();
    g.fillStyle = "#3a2214"; g.beginPath(); g.ellipse(x, y + h * .08, w * .38, h * .3, 0, 0, 7); g.fill();
    g.fillStyle = "rgba(255,220,180,.12)"; for (let i = 0; i < 30; i++) { g.beginPath(); g.arc(x - w / 2 + (i * 97) % w, y - h / 2 + (i * 53) % h, 6, 0, 7); g.fill(); } g.restore(); }
  function pot(x, y, s, t, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); const k = easeBack(Math.min(a, 1)); g.scale(s * k, s * k);
    g.strokeStyle = "#8a5a2a"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(0, -60); g.lineTo(0, 470); g.stroke();
    kshape(g, (c) => { c.beginPath(); c.ellipse(0, 500, 200, 60, 0, Math.PI, 0); c.closePath(); }, "#5a3a22", { rim: "rgba(255,220,180,.4)", rw: 4, sw: 8 });
    for (const [fx, col] of [[-140, "#ff4d6d"], [130, "#ffd84a"]]) { g.strokeStyle = "#2f8a48"; g.lineWidth = 8; g.beginPath(); g.moveTo(fx, 490); g.lineTo(fx, 400); g.stroke(); kshape(g, ell(fx, 392, 26, 26, 0), col, { rw: 3, sw: 5 }); }
    g.strokeStyle = "#f2cf5a"; g.lineWidth = 6; for (let i = 0; i < 14; i++) { const sx = -90 + i * 13; g.beginPath(); g.moveTo(sx, 110); g.lineTo(sx + Math.sin(i * 2.1) * 14, 150 + (i % 3) * 14); g.stroke(); }
    kshape(g, (c) => { c.beginPath(); c.moveTo(-60, -40); c.lineTo(60, -40); c.lineTo(110, 120); c.lineTo(-110, 120); c.closePath(); }, "#e0735a", { rim: "rgba(255,220,200,.7)", shadow: "rgba(90,30,10,.3)", rw: 5, sw: 12 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-124, 96, 248, 34, 10); }, "#c85a40", { rim: "rgba(255,210,190,.6)", rw: 4, sw: 6 });
    g.restore(); }

  // ======================= Shots =======================
  function hookE(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    earClose(t, lerp(-40, -10, k), 70, lerp(1.12, 1.26, k));
    zzz(W * .62, H * .3, t, 1);
    // Ohrwurm läuft zum Ohr, schnuppert, dreht um
    const p1 = loop ? 0 : sm(clamp(lt / (d * .38), 0, 1)), turn = loop ? 0 : sm(clamp((lt - d * .45) / (d * .16), 0, 1)), p2 = loop ? 0 : sm(clamp((lt - d * .6) / (d * .4), 0, 1));
    let x = lerp(-560, -230, p1), y = lerp(330, 170, p1); x = lerp(x, -900, p2 * p2); y = lerp(y, 420, p2 * p2);
    const walking = !loop && (lt < d * .38 || lt > d * .6);
    wigAt(x, y, .7, { t, walk: walking ? 14 : 0, antF: lt > d * .38 && lt < d * .6 ? 2.2 : 1, look: .6, seed: 1 }, -.36 + turn * Math.PI);
    if (loop) return;
    qmark(W * .5, H * .32, .8, sm((lt - d * .38) / .2) * (1 - turn));
    stamp("NOPE!", W * .58, H * .62, (lt - d * .62) / .22, "#2fae6a", -.06); }
  KZ.shot("eHook", (lt, d, t) => hookE(lt, d, t, false));
  KZ.shot("ePanic", (lt, d, t) => { const k = sm(lt / d); bedroom(t, lerp(-120, -150, k), -340, lerp(1.15, 1.28, k));
    nightLamp(420);
    at(rudi, -380, 0, 1, { t, arm: 1.5 + .5 * clamp(lt * 3, 0, 1), arm2: .5 + .5 * Math.sin(t * 10), mouth: "scream", mood: "scared", look: .8, tired: 1 });
    sweatS(W * .16, H * .14, t, 1);
    wigAt(80, -40, .45, { t, walk: 12, seed: 2, look: -.4 }, Math.PI + .1 + Math.sin(t) * .1);
    bubble("MY BRAIN?!", W * .42, H * .1, sm((lt - .15) / .3), -.04);
    stamp("NO SLEEP", W * .56, H * .5, (lt - d * .5) / .22, "#e5484d", .06); });
  KZ.shot("eMuff", (lt, d, t) => { const k = sm(lt / d); bedroom(t, lerp(80, 120, k), -360, lerp(.95, 1.04, k));
    bed(t, { muffs: 1, mouth: "grin", look: .9 });
    const p = clamp(lt / d, 0, 1); wigAt(lerp(-700, 700, p), 60, .4, { t, walk: 14, seed: 2 }, 0);
    stamp("SAFE!", W * .3, H * .17, (lt - d * .3) / .22, "#2fae6a", -.05); });
  KZ.shot("eFlower", (lt, d, t) => { const k = sm(lt / d); gardenNight(t, lerp(-30, 10, k), -560, lerp(1.0, 1.14, k));
    dahlia(0, -560, 1, t, true);
    wigAt(150, -790, .6, { t, munch: 1, seed: 3, look: .8, antF: 1.4 }, -.6);
    for (let i = 0; i < 3; i++) { const ph = (t * 1.3 + i / 3) % 1; g.fillStyle = `rgba(255,140,180,${1 - ph})`; g.beginPath(); g.ellipse(270 + ph * 60, -880 - ph * 80 + i * 20, 14, 8, ph * 3, 0, 7); g.fill(); }
    stamp("YUM", W * .32, H * .58, (lt - d * .35) / .22, "#e5487a", .06); });
  KZ.shot("eHelm", (lt, d, t) => { const k = sm(lt / d); bedroom(t, lerp(260, 320, k), -380, lerp(1.0, 1.1, k));
    bed(t, { helmet: 1, mouth: "grin", look: .9 });
    stamp("SEALED", W * .36, H * .17, (lt - d * .3) / .22, "#2f6fd0", -.05); });
  KZ.shot("eAphid", (lt, d, t) => { const k = sm(lt / d); const ex = lerp(-700, 300, sm(clamp(lt / (d * .9), 0, 1)));
    branchBg(t, lerp(-260, 160, k), 0, lerp(1.0, 1.1, k));
    for (let i = 0; i < 9; i++) { const ax = -480 + i * 110; if (ax < ex + 150) continue; aphid(ax, branchY(ax) - 20, 1.6, t, i); }
    const ang = Math.atan2(branchY(ex + 10) - branchY(ex - 10), 20);
    wigAt(ex, branchY(ex) - 20, .62, { t, walk: 10, munch: 1, seed: 4, look: .8 }, ang);
    stamp("SNACK TIME", W * .4, H * .64, (lt - d * .35) / .22, "#2fae6a", .05); });
  KZ.shot("eName", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("WHY \"EARWIG\"?", W * .44, H * .07, 64, "#fff", { w: 900, a: sm(lt / .3) });
    wigIcon(W * .44, H * .18, .55, sm((lt - .1) / .3), { t, walk: 0, seed: 2 });
    const p = (lt - .35) / .35; if (p > 0) { const a = easeBack(clamp(p, 0, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W * .44, H * .38); g.rotate(-.03); g.scale(a, a);
      g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-420 + 10, -170 + 12, 840, 340, 30); g.fill(); g.fillStyle = "#f1dcae"; g.beginPath(); g.roundRect(-420, -170, 840, 340, 30); g.fill();
      g.fillStyle = "#c9a46a"; g.beginPath(); g.roundRect(-420, -170, 840, 90, [30, 30, 0, 0]); g.fill(); g.restore();
      txt("OLD EUROPEAN TALE", W * .44, H * .38 - 128, 46, "#fff", { w: 900, a: clamp(p * 2, 0, 1) });
      txt("“It crawls into your ear", W * .44, H * .38 - 30, 44, "#5a3a22", { w: 800, a: sm((lt - .55) / .2) });
      txt("and lays eggs in your brain!”", W * .44, H * .38 + 36, 44, "#5a3a22", { w: 800, a: sm((lt - .7) / .2) }); }
    const q = sm((lt - d * .55) / .3); txt("EAR + WIG  =  \"EAR CREATURE\"", W * .44, H * .55, 48, "#ffd84d", { w: 900, a: q, stroke: 8 });
    txt("Penn State Extension", W * .44, H * .6, 32, "#c9d0ff", { w: 700, a: q });
    wobbleAll(lt, d, t); });
  KZ.shot("eSource", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.07, sm(lt / d)) + Math.sin(t * 2) * .012);
    wigIcon(W * .44, H * .15, .6, sm(lt / .3), { t, seed: 3 });
    card(W * .44, H * .38, 920, 330, (lt - .2) / .3, "VIRGINIA TECH", "#2f6fd0");
    txt("“This belief is", W * .44, H * .38 - 6, 54, "#1b1d3a", { w: 900, a: sm((lt - .4) / .2) });
    txt("totally unfounded.”", W * .44, H * .38 + 62, 54, "#1b1d3a", { w: 900, a: sm((lt - .5) / .2) });
    txt("Insect ID Lab · Earwigs in Virginia", W * .44, H * .38 + 130, 30, "#4a4f70", { w: 700, a: sm((lt - d * .4) / .2) });
    stamp("MYTH", W * .64, H * .58, (lt - d * .55) / .22, "#e5484d", .07); wobbleAll(lt, d, t); });
  KZ.shot("ePincers", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("THE PINCERS", W * .44, H * .06, 64, "#fff", { w: 900, a: sm(lt / .3) });
    const a1 = sm((lt - .1) / .3), a2 = sm((lt - .3) / .3);
    wigIcon(W * .26, H * .26, .66, a1, { t, seed: 1, pinch: .5 + .5 * Math.sin(t * 4) }, -Math.PI / 2); txt("MALE", W * .26, H * .44, 44, "#7ef0b0", { w: 900, a: a1 }); txt("curved", W * .26, H * .475, 34, "#c9d0ff", { w: 700, a: a1 });
    wigIcon(W * .62, H * .26, .66, a2, { t, seed: 2, female: 1 }, -Math.PI / 2); txt("FEMALE", W * .62, H * .44, 44, "#ffb0d0", { w: 900, a: a2 }); txt("straight", W * .62, H * .475, 34, "#c9d0ff", { w: 700, a: a2 });
    const b = sm((lt - d * .45) / .3); handIcon(W * .24, H * .6, .6, b, {}); wigIcon(W * .24 + 30, H * .6 - 140, .32, b, { t, seed: 3, pinch: Math.abs(Math.sin(t * 6)) }, Math.PI / 2);
    txt("TOO WEAK", W * .54, H * .57, 60, "#ffd84d", { w: 900, a: b, stroke: 8 }); txt("TO HURT YOU", W * .54, H * .62, 60, "#ffd84d", { w: 900, a: b, stroke: 8 });
    check(W * .8, H * .595, .6, (lt - d * .7) / .2); wobbleAll(lt, d, t); });
  KZ.shot("eMom", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("SUPER MOM", W * .44, H * .06, 66, "#fff", { w: 900, a: sm(lt / .3) });
    const n = Math.round(50 * sm(clamp((lt - .3) / (d * .5), 0, 1)));
    txt("UP TO", W * .44, H * .12, 40, "#c9d0ff", { w: 800, a: sm((lt - .1) / .3) });
    txt(n + " EGGS", W * .44, H * .18, 110, "#ffd84d", { w: 900, a: sm((lt - .2) / .3), stroke: 10 });
    const a = sm((lt - .15) / .4); if (a > 0) { g.save(); g.globalAlpha = a; burrow(W * .44, H * .42, 860, 440); g.restore();
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; eggs(W * .3, H * .47, 1.3, Math.max(n, 6), t, sm((lt - d * .5) / .3)); g.restore();
      wigIcon(W * .62, H * .45, .48, a, { t, female: 1, munch: 1, seed: 2, look: -1, antF: 1.5 }, Math.PI + Math.sin(t * 2) * .06);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); heart(g, W * .44, H * .33 - Math.sin(t * 3) * 10, 3 * sm((lt - d * .55) / .3), "#ff4d6d"); g.restore(); }
    label("LICKS THEM CLEAN", W * .44, H * .6, sm((lt - d * .55) / .25)); wobbleAll(lt, d, t); });
  KZ.shot("eOverkill", (lt, d, t) => { const k = sm(lt / d); bedroom(t, lerp(300, 340, k), -360, lerp(1.25, 1.4, k));
    bed(t, { helmet: 1, mouth: "hmm", look: -.6 });
    wigAt(200, -330, .42, { t, seed: 5, look: .6, antF: 2 }, Math.sin(t * 1.4) * .15);
    stamp("OVERKILL", W * .44, H * .16, (lt - d * .25) / .22, "#e5484d", -.05); });
  KZ.shot("eTip", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("DO THIS INSTEAD", W * .44, H * .06, 64, "#fff", { w: 900, a: sm(lt / .3) });
    pot(W * .22, H * .14, 1, t, sm((lt - .1) / .3));
    for (let i = 0; i < 3; i++) { const ph = clamp(((lt - .5) / (d * .5) + i * .25) % 1.2, 0, 1); if (lt < .5) break; wigIcon(W * .22 + 30, lerp(H * .39, H * .21, ph), .26, 1 - sm((ph - .85) / .15), { t, walk: 14, seed: i }, -Math.PI / 2); }
    const rows = [["POT + STRAW", "upside down on a stick", 0], ["SHAKE IT OUT", "move them to fruit trees", 1]];
    rows.forEach(([h1, h2, i]) => { const p = (lt - .3 - i * d * .3) / .3, y = H * (.2 + i * .2); card(W * .6, y, 480, 220, p); if (p <= 0) return; const a = sm(p);
      txt(h1, W * .6, y - 34, 46, "#1b1d3a", { w: 900, a }); txt(h2, W * .6, y + 30, 32, "#4a4f70", { w: 800, a }); });
    txt("RHS gardening advice", W * .44, H * .62, 32, "#c9d0ff", { w: 700, a: sm((lt - d * .6) / .3) });
    check(W * .8, H * .5, .6, (lt - d * .8) / .2); wobbleAll(lt, d, t); });
  KZ.shot("eLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .6) { bedroom(t, lerp(300, 330, k), -360, lerp(1.1, 1.18, k)); bed(t, { sleep: 1 }); zzz(W * .6, H * .2, t, 1);
      wigAt(lerp(-200, 500, lt / (d * .6)), 60, .4, { t, walk: 14, seed: 2 }, 0); }
    else hookE(0, d, t, true); });
  (function () { const SH = KZ.SHOTS; const split = (a, b, f) => (lt, d, t) => { const c = d * f; if (lt < c) SH[a](lt, c, t); else SH[b](lt - c, d - c, t); };
    KZ.shot("eMuffFull", split("eMuff", "eFlower", .5));
    KZ.shot("eHelmFull", split("eHelm", "eAphid", .5)); })();
})();
