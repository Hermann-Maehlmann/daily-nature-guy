// Szenendatei "Dogs Don't See In Black And White" (goldener Mischling, Mix-Stil, Hermann 12.11.2026).
// Quellen: AKC "Can Dogs See Color?" (Will Judy 1937, Neitz, Zitat "field of dead hay", rote/orange Spielzeuge schwer sichtbar, blau/gelb besser),
// Scientific American 2023 (Neitz 1989 UC Santa Barbara: blau und gelb), VCA (Rot = dunkles Braungrau), Live Science/AKC (mehr Stäbchen, Bewegung, Tapetum).
// Helfer txt/stamp/navy/rudi/at/lawn aus butterfly-touch übernommen (Rudi bleibt gleich). Hund neu gezeichnet: Schlappohr, Halsband, 4 Beine mit Sprunggelenk hinten, Rute.
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
  function rudi(c, o) { const t = o.t || 0, br = Math.sin(t * 2.2) * 4, arm = o.arm ?? 0;
    c.save();
    const step = o.walk ? Math.sin(t * (o.slow ? 4 : 8)) * 18 : 0;
    c.strokeStyle = C.jeans; c.lineWidth = 30; c.lineCap = "round"; for (const [x, s] of [[-26, 1], [26, -1]]) { c.beginPath(); c.moveTo(x, -130); c.lineTo(x + 4 + step * s, -16); c.stroke(); }
    c.fillStyle = "#2a2233"; for (const [x, s] of [[-26, 1], [26, -1]]) { c.beginPath(); c.ellipse(x + 16 + step * s, -8, 30, 13, 0, 0, 7); c.fill(); }
    const back = o.arm2 != null ? o.arm2 : null; // zweiter Arm (fuchteln)
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
    c.strokeStyle = "#7a2a2a"; c.lineWidth = 6; c.lineCap = "round"; c.fillStyle = "#7a2a2a";
    if (o.mouth === "o") { c.beginPath(); c.ellipse(52, -378, 10, 13, 0, 0, 7); c.fill(); }
    else if (o.mouth === "grin") { c.beginPath(); c.moveTo(30, -384); c.quadraticCurveTo(52, -350, 76, -386); c.closePath(); c.fill(); c.fillStyle = "#fff"; c.fillRect(36, -384, 34, 7); }
    else if (o.mouth === "hmm") { c.beginPath(); c.moveTo(36, -378); c.lineTo(70, -384); c.stroke(); }
    else if (o.mouth === "scream") { c.beginPath(); c.ellipse(52, -374, 16, 22, 0, 0, 7); c.fill(); }
    else { c.beginPath(); c.arc(52, -392, 20, .3, 2.8); c.stroke(); }
    c.restore();
    const sx = 30, sy = -330 + br; let hx, hy;
    if (arm >= 1.5) { const k = arm - 1.5; hx = lerp(80, -70, clamp(k * 2, 0, 1)); hy = lerp(-200, -470, clamp(k * 2, 0, 1)) + Math.sin(t * 14) * 6 * clamp(k * 2, 0, 1); }
    else { const a = lerp(1.35, -1.3, clamp(arm, 0, 1)); hx = sx + Math.cos(a) * 150; hy = sy + Math.sin(a) * 150; }
    if (o.hand) { hx = o.hand[0]; hy = o.hand[1]; }
    c.strokeStyle = C.coat; c.lineWidth = 30; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2 + 20, (sy + hy) / 2 + 20, hx, hy); c.stroke();
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

  // ================= Shots =================
  function hookShot(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    park(t, lerp(40, 20, k), -300, lerp(.98, 1.06, k));
    ball(-430, -36, 36, "#e5484d", .4); ball(420, -36, 36, "#3f7fe0", -.2);
    dogAt(-130, 0, 1, { t, wag: .8, mouth: "open", look: .3 });
    if (loop) { filt("gray", 0, W); return; }
    const wp = sm((lt - .5) / 1.4), bx = W * wp;
    filt("gray", bx, W); filt("dog", 0, bx);
    if (wp > 0 && wp < 1) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(255,255,255,.9)"; g.fillRect(bx - 4, 0, 8, H); glow(bx, H * .45, 260, "rgba(255,240,200,.35)"); g.restore(); }
    label("DOG VIEW", W * .3, H * .63, sm((lt - d * .55) / .25));
    stamp("NOT GRAY!", W * .5, H * .17, (lt - d * .68) / .22, "#2fae6a", -.06); }
  KZ.shot("dgHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("dgLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .62) { park(t, lerp(-40, 0, k), -380, lerp(1.25, 1.33, k)); at(rudi, -380, 0, 1, { t, arm: .8, mouth: "hmm", look: .6 });
      dogAt(130, 0, .55, { t, wag: .3, look: .4, mood: "scared" }, true); bubble("DOGS SEE GRAY!", W * .36, H * .12, sm((lt - .2) / .3), -.04); filt("gray", 0, W * sm((lt - d * .3) / (d * .3))); }
    else hookShot(0, d, t, true); });

  KZ.shot("dgMyth", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.06, sm(lt / d)));
    txt("THE RUMOR", W * .44, H * .09, 70, "#fff", { w: 900 });
    [["ONLY GRAY!", W * .3, H * .19, -.05], ["COLORBLIND!", W * .58, H * .27, .05], ["NO COLORS!", W * .3, H * .35, -.03]].forEach(([s, x, y, r], i) => bubble(s, x, y, sm((lt - .1 - i * .35) / .3), r));
    g.setTransform(1, 0, 0, 1, 0, 0); dogAt(W * .4, H * .64, .62, { t, gray: true, wag: .2, look: -.2, mood: "scared" });
    stamp("MYTH?", W * .7, H * .5, (lt - d * .62) / .25, "#f08a1e", .08); });

  KZ.shot("dgBook", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .3, H * .3); g.scale(p, p); g.rotate(-.06);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-176, -236, 360, 480, 18); g.fill();
    kshape(g, (c) => { c.beginPath(); c.roundRect(-184, -246, 360, 480, 18); }, "#8a4a2a", { rim: "rgba(255,220,180,.6)", rw: 6, sw: 14 });
    g.fillStyle = "#6a3418"; g.fillRect(-184, -246, 36, 480); g.strokeStyle = "#e8c27a"; g.lineWidth = 6; g.strokeRect(-120, -200, 260, 390);
    g.fillStyle = "#f2d38a"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = '900 40px "Montserrat"'; g.fillText("TRAINING", 10, -130); g.fillText("THE DOG", 10, -82);
    g.font = '900 76px "Montserrat"'; g.fillText("1937", 10, 40); g.restore();
    // Zitat
    const q = sm((lt - .5) / .4); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = q; g.translate(W * .62, H * .36); g.rotate(.03);
    g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-250, -150, 500, 300, 28); g.fill();
    g.fillStyle = "#1b1d3a"; g.font = '800 44px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("“...highlights", 0, -80); g.fillText("of black", 0, -22); g.fillText("and gray.”", 0, 36);
    g.fillStyle = "#6a6f9a"; g.font = '700 30px "Montserrat"'; g.fillText("Will Judy, 1937", 0, 106); g.restore();
    stamp("OLD NEWS", W * .44, H * .6, (lt - d * .62) / .25, "#7a5ce0", -.05); });

  KZ.shot("dgTest", (lt, d, t) => { const k = sm(lt / d);
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2c3a7a"); bg.addColorStop(1, "#141c44"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(lerp(170, 200, k), -330, lerp(.92, .98, k));
    g.fillStyle = "#222c62"; g.fillRect(-3000, 0, 6000, 2000); g.fillStyle = "#34408a"; g.fillRect(-3000, 0, 6000, 12);
    kshape(g, (c) => { c.beginPath(); c.roundRect(10, -620, 620, 420, 30); }, "#e9ecf6", { rim: "rgba(255,255,255,.9)", shadow: "rgba(20,20,60,.3)", rw: 6, sw: 18 });
    const L = [[120, "#ffd84a"], [320, "#3f7fe0"], [520, "#ffd84a"]], hit = sm((lt - d * .55) / .15);
    L.forEach(([x, col], i) => { g.save(); g.globalCompositeOperation = "lighter"; glow(x, -410, 130, i === 1 ? `rgba(90,150,255,${.35 + .3 * hit})` : "rgba(255,220,100,.3)"); g.restore(); kshape(g, (c) => { c.beginPath(); c.arc(x, -410, 82, 0, 7); }, col, { rim: "rgba(255,255,255,.85)", rw: 5, sw: 10 }); });
    const w = sm((lt - .1) / (d * .5)); const dx = lerp(-700, 320 - 82 - 405, w);
    dogAt(dx, 0, 1, { t, walk: w > 0 && w < 1 ? 7 : 0, wag: .3 + hit * .7, look: .4, mouth: hit > .5 ? "open" : undefined });
    g.setTransform(1, 0, 0, 1, 0, 0); label("1989 · UC SANTA BARBARA", W * .44, H * .1, sm((lt - .2) / .3)); check(W * .5, H * .2, 1.3, (lt - d * .62) / .25); });

  const SPEC = ["#ff3b30", "#ff9500", "#ffd60a", "#34c759", "#0a84ff", "#7d5cff"];
  function specBar(x, y, w, h, cols, p) { g.save(); g.beginPath(); g.roundRect(x, y, w * p, h, h / 2); g.clip(); const gr = g.createLinearGradient(x, 0, x + w, 0); cols.forEach((c, i) => gr.addColorStop(i / (cols.length - 1), c)); g.fillStyle = gr; g.fillRect(x, y, w, h); g.restore();
    g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 5; g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.stroke(); }
  KZ.shot("dgSpectrum", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    txt("COLORS THEY SEE", W * .44, H * .09, 64, "#fff", { w: 900 });
    const a1 = sm((lt - .1) / .5), a2 = sm((lt - .6) / .5);
    txt("YOU", 90, H * .17, 50, "#fff", { align: "left", a: a1 }); specBar(90, H * .19, 700, 90, SPEC, a1);
    txt("DOG", 90, H * .29, 50, "#ffd84d", { align: "left", a: a2 }); specBar(90, H * .31, 700, 90, SPEC.map(dogC), a2);
    g.setTransform(1, 0, 0, 1, 0, 0); dogAt(W * .36, H * .63, .5, { t, wag: .9, mouth: "open", look: .2 });
    const s = sm((lt - d * .5) / .3); if (s > 0) { ball(W * .7, H * .5, 44 * easeBack(s), "#3f7fe0"); ball(W * .7, H * .6, 44 * easeBack(s), "#ffd84a", 1); }
    stamp("BLUE + YELLOW", W * .44, H * .43, (lt - d * .6) / .25, "#2f6fd0", -.05); });

  function cone(x, y, s, col, a) { if (a <= 0) return; g.save(); g.translate(x, y); g.scale(s * easeBack(Math.min(a, 1)), s * easeBack(Math.min(a, 1)));
    kshape(g, (c) => { c.beginPath(); c.moveTo(-36, -60); c.quadraticCurveTo(0, -84, 36, -60); c.lineTo(10, 70); c.quadraticCurveTo(0, 80, -10, 70); c.closePath(); }, col, { rim: "rgba(255,255,255,.8)", rw: 4, sw: 8 });
    g.save(); g.globalCompositeOperation = "lighter"; glow(0, -40, 70, "rgba(255,255,255,.18)"); g.restore(); g.restore(); }
  function bigEye(x, y, r, iris, a) { if (a <= 0) return; g.save(); g.translate(x, y); g.scale(easeBack(Math.min(a, 1)), easeBack(Math.min(a, 1)));
    kshape(g, (c) => { c.beginPath(); c.arc(0, 0, r, 0, 7); }, "#f4f4fa", { rim: "rgba(255,255,255,.9)", rw: 5, sw: 12 });
    g.fillStyle = iris; g.beginPath(); g.arc(r * .15, 0, r * .55, 0, 7); g.fill(); g.fillStyle = "#12142b"; g.beginPath(); g.arc(r * .2, 0, r * .28, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(r * .02, -r * .2, r * .12, 0, 7); g.fill(); g.restore(); }
  KZ.shot("dgCones", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    txt("COLOR CONES", W * .44, H * .08, 66, "#fff", { w: 900 });
    const a = sm((lt - .1) / .4), b = sm((lt - d * .45) / .4);
    g.setTransform(1, 0, 0, 1, 0, 0);
    bigEye(W * .24, H * .2, 110, "#4a7ad0", a); txt("YOU", W * .24, H * .29, 50, "#fff", { a });
    [["#ff4d4d", -1], ["#4cd964", 0], ["#3f7fe0", 1]].forEach(([c, i], j) => cone(W * .24 + i * 92, H * .38, 1, c, sm((lt - .3 - j * .2) / .3)));
    txt("3", W * .24, H * .5, 120, "#fff", { a: sm((lt - .9) / .3), w: 900, stroke: 10 });
    bigEye(W * .64, H * .2, 110, "#8a5a2a", b); txt("DOG", W * .64, H * .29, 50, "#ffd84d", { a: b });
    [["#3f7fe0", -.5], ["#ffd84a", .5]].forEach(([c, i], j) => cone(W * .64 + i * 92, H * .38, 1, c, sm((lt - d * .5 - j * .2) / .3)));
    txt("2", W * .64, H * .5, 120, "#ffd84d", { a: sm((lt - d * .75) / .25), w: 900, stroke: 10 }); });

  KZ.shot("dgRedBall", (lt, d, t) => { navy(t); const k = sm(lt / d);
    const R = 230, P2 = [[W * .26, H * .3], [W * .62, H * .42]];
    P2.forEach(([cx, cy], i) => { const a = sm((lt - .1 - i * .5) / .4); if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.arc(cx, cy, R * easeBack(a), 0, 7); g.clip();
      g.fillStyle = "#4cb862"; g.fillRect(cx - R, cy - R, 2 * R, 2 * R); g.strokeStyle = "#7ad48e"; g.lineWidth = 8; g.lineCap = "round";
      for (let j = 0; j < 60; j++) { const x = cx - R + (j * 47) % (2 * R), y = cy - R + 30 + Math.floor(j / 10) * 76; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(t + j) * 5, y - 34); g.stroke(); }
      ball(cx + Math.sin(t * 1.5) * 10, cy + 10, 90 * lerp(1, 1.06, k), "#e5484d", t * .3); g.restore();
      if (i === 1) filt("dog", cx - R, cx + R, [cx, cy, R]);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.strokeStyle = "#fff"; g.lineWidth = 12; g.beginPath(); g.arc(cx, cy, R * easeBack(a), 0, 7); g.stroke(); g.restore();
      txt(i ? "YOUR DOG" : "YOU", cx, cy + R + 56, 52, i ? "#ffd84d" : "#fff", { a }); });
    label("GRAYISH BROWN", W * .44, H * .1, sm((lt - d * .6) / .25)); });

  KZ.shot("dgQuote", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .33); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -300, 780, 600, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -310, 780, 600, 34); g.fill();
    g.fillStyle = "#2f6fd0"; g.beginPath(); g.roundRect(-390, -310, 780, 120, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 40px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("AMERICAN", 0, -272); g.fillText("KENNEL CLUB", 0, -226);
    g.fillStyle = "#e5a52a"; g.font = '900 130px "Montserrat"'; g.fillText("“", -320, -140);
    const lines = ["“That lush green", "lawn? It probably", "looks like a field", "of dead hay.”"]; g.font = '900 54px "Montserrat"';
    lines.forEach((l, i) => { const a = sm((lt - .4 - i * .3) / .3); g.globalAlpha = a; g.fillStyle = i === 3 ? "#c9821e" : "#1b1d3a"; g.fillText(l, 0, -110 + i * 76); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 32px "Montserrat"'; g.fillText("akc.org · Can Dogs See Color?", 0, 236);
    g.restore(); g.setTransform(1, 0, 0, 1, 0, 0); });

  function throwShot(lt, d, t, col, dogView) { const k = sm(lt / d);
    park(t, lerp(-260, 200, sm((lt - .45) / Math.max(.5, d - .45))), -380, .9);
    const th = sm((lt - .15) / .35), fly = clamp((lt - .45) / (d * .55), 0, 1);
    const r = at(rudi, -520, 0, .95, { t, arm: lerp(.1, 1, th), mouth: "grin", look: .5 });
    const hx = -520 + r.hx * .95, hy = r.hy * .95;
    const bx = fly > 0 ? lerp(hx, 560, fly) : hx, by = fly > 0 ? lerp(hy, -40, fly) - Math.sin(fly * Math.PI) * 520 : hy;
    const run = sm((lt - .5) / (d * .5));
    if (!dogView || fly < 1) ball(bx, by, dogView ? 40 : 34, col, t * 6);
    const dx = lerp(-200, 560 - 255, run);
    dogAt(dx, 0, .62, { t, walk: run > 0 && run < 1 ? 14 : 0, run: 1, wag: .8, mouth: dogView && run > .9 ? "ball" : "open", ballCol: col, look: .4 });
    return { k, run }; }
  KZ.shot("dgThrow", (lt, d, t) => { throwShot(lt, d, t, "#e5484d", false); label("RED BALL", W * .44, H * .1, sm((lt - .2) / .3)); });
  KZ.shot("dgLost", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(80, 140, k), -300, lerp(1.15, 1.25, k));
    ball(420, -30, 30, "#e5484d", .6);
    const lk = Math.sin(lt * 2.4); dogAt(-140, 0, .8, { t, wag: .1, look: lk, turn: lk * .4, mood: "scared" });
    filt("dog", 0, W);
    qmark(W * .2, H * .2, 1, sm((lt - .3) / .3)); qmark(W * .34, H * .15, .8, sm((lt - .6) / .3));
    label("DOG VIEW", W * .44, H * .08, sm((lt - .1) / .3)); stamp("WHERE?!", W * .5, H * .62, (lt - d * .55) / .25, "#e5484d", -.07); });

  KZ.shot("dgSniff", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(240, 300, k), -330, lerp(1.45, 1.6, k));
    const w = sm(lt / (d * .6)); const dx = lerp(-160, 60, w);
    ball(540, -26, 28, "#e5484d", .6);
    dogAt(dx, 0, .8, { t, walk: w < 1 ? 5 : 0, sniff: sm((lt - .2) / .5), wag: .5 });
    // Duftfäden
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 4; i++) { const a = sm((lt - .4 - i * .15) / .4); if (a <= 0) continue; g.strokeStyle = `rgba(150,240,255,${.55 * a})`; g.lineWidth = 9;
      g.beginPath(); for (let s = 0; s <= 1.001; s += .05) { const x = lerp(540, dx + 320 * .8 * .6, s), y = lerp(-40, -120 + i * 20, s) + Math.sin(s * 9 + t * 4 + i) * 24; s ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    glow(540, -30, 120, `rgba(150,240,255,${.35 * sm((lt - .5) / .4)})`); g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); stamp("NOSE MODE", W * .44, H * .15, (lt - d * .5) / .25, "#2fae6a", -.06); });

  KZ.shot("dgNight", (lt, d, t) => { const k = sm(lt / d); nightPark(t, lerp(-60, 0, k), -330, lerp(1.15, 1.25, k));
    dogAt(-120, 0, .85, { t, wag: .4, look: .5, glowEyes: .4 + .6 * sm((lt - .3) / .4) });
    g.setTransform(1, 0, 0, 1, 0, 0); const a = sm((lt - .3) / .3);
    txt("SEEING IN DIM LIGHT", 90, H * .08, 46, "#fff", { align: "left", a, stroke: 8 });
    [["YOU", .32, "#c9cdf5"], ["DOG", .9, "#7ef0b0"]].forEach(([nm, v, col], i) => { const y = H * .11 + i * 96, p = sm((lt - .4 - i * .3) / .5);
      g.globalAlpha = a; g.fillStyle = "rgba(10,20,50,.6)"; g.beginPath(); g.roundRect(240, y, 560, 64, 32); g.fill(); g.fillStyle = col; g.beginPath(); g.roundRect(240, y, Math.max(64, 560 * v * p), 64, 32); g.fill(); g.globalAlpha = 1;
      txt(nm, 90, y + 34, 44, col, { align: "left", a, stroke: 8 }); }); });

  KZ.shot("dgMotion", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(0, 60, k), -360, lerp(1.1, 1.18, k));
    fence(t, -900, 1100);
    const sp = clamp(lt / d, 0, 1), sx = lerp(-520, 700, sp);
    g.save(); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 8; g.lineCap = "round"; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(sx - 200 - i * 30, -520 - i * 26); g.lineTo(sx - 330 - i * 40, -520 - i * 26); g.stroke(); } g.restore();
    g.save(); g.translate(sx, -440); g.scale(.9, .9); squirrel(g, { t, run: true }); g.restore();
    const look = clamp((sx - 100) / 600, -1, 1);
    dogAt(-330, 0, .7, { t, perk: 1, turn: .5 + look * .3, look, wag: .9, mood: undefined });
    label("MOTION", W * .44, H * .1, sm((lt - .2) / .3)); });

  function toy(kind, x, y, s, a) { if (a <= 0) return; g.save(); g.translate(x, y); g.scale(s * easeBack(Math.min(a, 1)), s * easeBack(Math.min(a, 1)));
    if (kind === "bone") { kshape(g, (c) => { c.beginPath(); c.roundRect(-110, -26, 220, 52, 26); for (const sx of [-1, 1]) for (const sy of [-1, 1]) { c.moveTo(sx * 118 + 34, sy * 26); c.arc(sx * 118, sy * 26, 34, 0, 7); } }, "#e5484d", { rim: "rgba(255,220,220,.8)", rw: 5, sw: 10 }); }
    else if (kind === "ring") { kshape(g, (c) => { c.beginPath(); c.arc(0, 0, 100, 0, 7); c.arc(0, 0, 56, 0, 7, true); }, "#ff8a2a", { rim: "rgba(255,230,200,.8)", rw: 5, sw: 10 }); }
    else if (kind === "disc") { kshape(g, (c) => { c.beginPath(); c.ellipse(0, 0, 120, 52, 0, 0, 7); }, "#ffd84a", { rim: "rgba(255,255,230,.9)", rw: 5, sw: 10 }); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 6; g.beginPath(); g.ellipse(0, -6, 80, 30, 0, 0, 7); g.stroke(); }
    else ball(0, 0, 84, "#3f7fe0", .3);
    g.restore(); }
  KZ.shot("dgToys", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    txt("PICK THE RIGHT TOY", W * .44, H * .08, 60, "#fff", { w: 900 });
    g.setTransform(1, 0, 0, 1, 0, 0);
    const T = [["bone", W * .24, H * .2], ["ring", W * .62, H * .2], ["ball", W * .24, H * .42], ["disc", W * .62, H * .42]];
    T.forEach(([kd, x, y], i) => toy(kd, x, y + Math.sin(t * 2 + i) * 8, 1, sm((lt - .1 - i * .15) / .3)));
    cross(W * .24, H * .2, .9, (lt - d * .45) / .2); cross(W * .62, H * .2, .9, (lt - d * .5) / .2);
    check(W * .24, H * .53, .8, (lt - d * .62) / .2); check(W * .62, H * .53, .8, (lt - d * .67) / .2); });
  KZ.shot("dgFetch", (lt, d, t) => { const r = throwShot(lt, d, t, "#ffd84a", true); filt("dog", 0, W);
    g.setTransform(1, 0, 0, 1, 0, 0); label("DOG VIEW", W * .44, H * .08, sm((lt - .1) / .3)); stamp("FOUND IT!", W * .44, H * .17, (lt - d * .8) / .2, "#2fae6a", -.06); });
})();
