// Szenendatei "A Dry Dog Nose Doesn't Mean Sick" (Hund Max + Rudi, Comedy-Story, 16.11.2026). Basis: dog-years-szenen.js (Hund, Rudi, Helfer).
// Quellen: VCA, AKC, Texas A&M, Uni Melbourne (Dr Leonie Richards: "It actually means nothing."), Zoetis (Nässe hält Duft "a bit like glue").
// Quellen: AVMA-Faustregel via AKC + UC Davis (1. Jahr ~15, 2. Jahr +9, danach ~5/Jahr; grosse Hunde altern schneller, Senior ab 5-6),
// UC San Diego (Ideker, Cell Systems 2020, Epigenetik-Uhr an 104 Labradoren; Zitat "a nine-month-old dog can have puppies").
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
    g.fillStyle = "rgba(255,255,255,.07)"; for (let y = 40; y < H; y += 60) for (let x = 30; x < W; x += 60) { g.beginPath(); g.arc(x + (t * 45) % 60, y - (t * 25) % 60, 3.5, 0, 7); g.fill(); }
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
    if (o.shades) { const k = clamp(o.shades, 0, 1); c.save(); c.translate(0, (1 - k) * -90); c.globalAlpha = k;
      c.strokeStyle = "#141422"; c.lineWidth = 8; c.beginPath(); c.moveTo(270, -494); c.lineTo(236, -500); c.stroke();
      c.fillStyle = "#141422"; c.beginPath(); c.roundRect(266, -514, 78, 44, 16); c.fill();
      c.fillStyle = "rgba(160,200,255,.55)"; c.beginPath(); c.moveTo(284, -508); c.lineTo(300, -508); c.lineTo(286, -478); c.lineTo(272, -478); c.closePath(); c.fill(); c.restore(); }
    if (o.nose) noseFx(c, o.nose, t);
    if (o.hat) { c.save(); c.translate(246, -528); c.rotate(-.35 + Math.sin(t * 3) * .04); partyHat(c, 1.1, o.hatCol || "#ff4d6d"); c.restore(); }
    c.restore(); c.restore(); }
  function partyHat(c, s, col) { c.save(); c.scale(s, s);
    kshape(c, (c) => { c.beginPath(); c.moveTo(-52, 0); c.lineTo(0, -150); c.lineTo(52, 0); c.quadraticCurveTo(0, 14, -52, 0); c.closePath(); }, col, { rim: "rgba(255,240,240,.75)", rw: 4, sw: 8 });
    c.fillStyle = "rgba(255,255,255,.85)"; for (const [x, y] of [[-14, -40], [18, -70], [-4, -100], [22, -24]]) { c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); }
    kshape(c, (c) => { c.beginPath(); c.arc(0, -156, 18, 0, 7); }, "#ffd84a", { rw: 3, sw: 4 }); c.restore(); }
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
    g.fillStyle = "#eef2ff"; g.beginPath(); g.arc(W * .72, H * .1, 64, 0, 7); g.fill(); 
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

  // ================= Neu: Hundejahre (Party, Teenager, Bettzeit) =================
  function balloon(x, y, t, col, i) { const sx = Math.sin(t * 1.3 + i) * 14; g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + sx, y - 120, x + sx * 1.6, y - 220); g.stroke();
    kshape(g, ell(x + sx * 1.6, y - 300, 62, 78, 0), col, { rim: "rgba(255,255,255,.75)", rw: 6, sw: 12 });
    g.fillStyle = col; g.beginPath(); g.moveTo(x + sx * 1.6 - 12, y - 218); g.lineTo(x + sx * 1.6 + 12, y - 218); g.lineTo(x + sx * 1.6, y - 232); g.fill();
    g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.ellipse(x + sx * 1.6 + 22, y - 330, 12, 22, -.4, 0, 7); g.fill(); }
  function bunting(x0, x1, y, t) { const cols = ["#ff4d6d", "#ffd84a", "#3f8fe0", "#2fae6a", "#ff9a3a"]; g.strokeStyle = "#fff"; g.lineWidth = 5; g.beginPath(); g.moveTo(x0, y); g.quadraticCurveTo((x0 + x1) / 2, y + 90, x1, y); g.stroke();
    const n = Math.floor((x1 - x0) / 110); for (let i = 0; i <= n; i++) { const u = i / n, x = lerp(x0, x1, u), yy = y + 180 * u * (1 - u); const sw = Math.sin(t * 2 + i) * .08;
      g.save(); g.translate(x, yy); g.rotate(sw); g.fillStyle = cols[i % 5]; g.beginPath(); g.moveTo(-36, 0); g.lineTo(36, 0); g.lineTo(0, 70); g.closePath(); g.fill(); g.restore(); } }
  function cake(x, s, t, num) { g.save(); g.translate(x, 0); g.scale(s, s);
    kshape(g, ell(0, -8, 190, 26, 0), "#e8ecff", { rw: 4, sw: 6 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-150, -170, 300, 160, 30); }, "#ff8fb0", { rim: "rgba(255,230,240,.8)", shadow: "rgba(150,30,70,.22)", rw: 6, sw: 16 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-104, -280, 208, 120, 26); }, "#fff1d6", { rim: "rgba(255,255,255,.9)", shadow: "rgba(150,100,40,.2)", rw: 5, sw: 12 });
    g.fillStyle = "#fff6ea"; g.beginPath(); g.moveTo(-150, -150); for (let i = 0; i <= 10; i++) { const xx = -150 + i * 30; g.quadraticCurveTo(xx - 15, -150 + (i % 2 ? 40 : 10), xx, -150); } g.lineTo(150, -170); g.lineTo(-150, -170); g.fill();
    const cols = ["#3f8fe0", "#ffd84a", "#2fae6a", "#ff4d6d"]; for (let i = 0; i < 8; i++) { g.fillStyle = cols[i % 4]; g.beginPath(); g.arc(-120 + i * 34, -100 + (i % 2) * 30, 8, 0, 7); g.fill(); }
    // Zahlenkerze
    g.font = '900 170px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "alphabetic"; g.lineJoin = "round"; g.lineWidth = 14; g.strokeStyle = "#fff"; g.strokeText(num, 0, -282); g.fillStyle = "#3f8fe0"; g.fillText(num, 0, -282);
    g.strokeStyle = "#1b1724"; g.lineWidth = 5; g.beginPath(); g.moveTo(0, -400); g.lineTo(0, -428); g.stroke();
    const fl = 1 + Math.sin(t * 17) * .08; g.save(); g.globalCompositeOperation = "lighter"; glow(0, -456, 90, "rgba(255,200,90,.6)"); g.restore();
    g.fillStyle = "#ffb52e"; g.beginPath(); g.moveTo(0, -500 * fl + 0); g.quadraticCurveTo(26, -450, 0, -428); g.quadraticCurveTo(-26, -450, 0, -500 * fl); g.fill();
    g.fillStyle = "#fff4b0"; g.beginPath(); g.ellipse(0, -448, 8, 14, 0, 0, 7); g.fill(); g.restore(); }
  function party(t, cx, cy, z) { park(t, cx, cy, z); bunting(-1100, 700, -760, t);
    [[-900, "#ff4d6d"], [-820, "#ffd84a"], [520, "#3f8fe0"], [600, "#ff9a3a"], [-1300, "#2fae6a"]].forEach(([bx, col], i) => balloon(bx, -330, t, col, i));
    kshape(g, (c) => { c.beginPath(); c.roundRect(120, -250, 520, 30, 10); }, "#f7f4ec", { rw: 4, sw: 6 }); g.fillStyle = "#c9b8a0"; g.fillRect(160, -220, 22, 220); g.fillRect(580, -220, 22, 220); }
  function partyRudi(x, s, o) { const r = at(rudi, x, 0, s, o); g.save(); g.translate(x, 0); g.scale(s, s); g.translate(10, -500 + Math.sin((o.t || 0) * 2.2) * 4); g.rotate(-.12); partyHat(g, .8, "#3f8fe0"); g.restore(); return r; }
  function horn(x, y, s, p, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col || "#ff4d6d"; g.beginPath(); g.moveTo(0, -10); g.lineTo(60, -16); g.lineTo(60, 16); g.lineTo(0, 10); g.fill();
    const L = 40 + 140 * p; g.fillStyle = "#ffd84a"; g.beginPath(); g.roundRect(56, -14, L, 28, 14); g.fill(); g.restore(); }
  function hookD(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    party(t, lerp(10, 40, k), -330, lerp(1.0, 1.1, k));
    dogAt(-200, 0, .85, { t, hat: 1, wag: .8, look: .8, mouth: "open" });
    cake(300, .8, t, "1");
    if (loop) return;
    stamp("NOT 7!", W * .44, H * .62, (lt - d * .55) / .22, "#e5484d", -.06); }
  KZ.shot("dHook", (lt, d, t) => hookD(lt, d, t, false));
  KZ.shot("dBelieve", (lt, d, t) => { const k = sm(lt / d); party(t, lerp(-240, -270, k), -360, lerp(1.08, 1.16, k));
    partyRudi(-525, 1, { t, arm: 1.5 + .5 * clamp(lt * 2, 0, 1), mouth: "grin", look: .7 });
    dogAt(-330, 0, .5, { t, hat: 1, wag: .5, look: -.3 });
    bubble("1 × 7 = 7", W * .38, H * .12, sm((lt - .1) / .3), -.04);
    stamp("LITTLE KID", W * .52, H * .3, (lt - d * .55) / .22, "#f08a1e", .06); });
  KZ.shot("dParty", (lt, d, t) => { const k = sm(lt / d); party(t, lerp(-120, -60, k), -340, lerp(1.0, 1.08, k));
    const blow = Math.max(0, Math.sin(t * 6));
    const r = partyRudi(-490, .8, { t, arm: .45, mouth: "o", look: .7 });
    horn(-490 + r.hx * .8 - 10, r.hy * .8 + 20, 1, blow, "#ff4d6d");
    dogAt(-60, 0, .7, { t, hat: 1, wag: .2, look: .9 }); cake(380, .6, t, "1");
    for (let i = 0; i < 18; i++) { const ph = (t * .5 + i / 18) % 1; g.fillStyle = ["#ff4d6d", "#ffd84a", "#3f8fe0", "#2fae6a"][i % 4]; g.save(); g.translate(-700 + (i * 97) % 1300, -900 + ph * 900); g.rotate(t * 3 + i); g.fillRect(-10, -5, 20, 10); g.restore(); }
    label("KIDDIE PARTY!", W * .44, H * .1, sm((lt - .3) / .3)); });
  KZ.shot("dParty2", (lt, d, t) => { const k = sm(lt / d); party(t, lerp(-20, 40, k), -320, lerp(1.25, 1.45, k));
    at(rudi, -490, 0, .8, { t, arm: 0, mouth: "o", look: .8 });
    dogAt(-60, 0, .7, { t, hat: 1, wag: 0, look: -.9, turn: -.5, shades: sm(lt / .45) });
    stamp("CRINGE.", W * .44, H * .14, (lt - d * .4) / .22, "#7b5cff", .06); });
  function room(t, cx, cy, z) { g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2b2a6e"); bg.addColorStop(1, "#151640"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(cx, cy, z);
    g.fillStyle = "#33357e"; g.fillRect(-3000, -2000, 6000, 2000); g.fillStyle = "rgba(255,255,255,.05)"; for (let x = -2000; x < 2000; x += 160) g.fillRect(x, -2000, 70, 2000);
    // Fenster mit Mond
    kshape(g, (c) => { c.beginPath(); c.roundRect(150, -900, 420, 460, 20); }, "#c9a46a", { rw: 5, sw: 12 }); g.fillStyle = "#0d1238"; g.fillRect(176, -874, 368, 408);
    g.save(); g.globalCompositeOperation = "lighter"; glow(440, -760, 160, "rgba(200,220,255,.35)"); g.restore(); g.fillStyle = "#eef2ff"; g.beginPath(); g.arc(440, -760, 50, 0, 7); g.fill(); g.fillStyle = "#0d1238"; g.beginPath(); g.arc(466, -772, 44, 0, 7); g.fill();
    g.fillStyle = "#fff"; for (let i = 0; i < 8; i++) { g.globalAlpha = .5 + .5 * Math.sin(t * 2 + i); g.beginPath(); g.arc(200 + (i * 67) % 320, -850 + (i * 53) % 300, 4, 0, 7); g.fill(); } g.globalAlpha = 1;
    g.fillStyle = "#c9a46a"; g.fillRect(360 - 6, -900, 12, 460); g.fillRect(150, -676, 420, 12);
    const fg = g.createLinearGradient(0, 0, 0, 900); fg.addColorStop(0, "#6a4a3a"); fg.addColorStop(1, "#3a2620"); g.fillStyle = fg; g.fillRect(-3000, 0, 6000, 3000);
    g.save(); g.globalCompositeOperation = "lighter"; glow(-700, -420, 520, "rgba(255,200,120,.22)"); g.restore(); }
  function lamp(x, t) { kshape(g, (c) => { c.beginPath(); c.rect(x - 8, -360, 16, 360); }, "#8a6a4a", { rw: 2, sw: 4 }); kshape(g, (c) => { c.beginPath(); c.moveTo(x - 90, -360); c.lineTo(x - 55, -480); c.lineTo(x + 55, -480); c.lineTo(x + 90, -360); c.closePath(); }, "#ffd88a", { rim: "rgba(255,255,230,.9)", rw: 4, sw: 8 });
    g.save(); g.globalCompositeOperation = "lighter"; glow(x, -400, 260, "rgba(255,210,120,.35)"); g.restore(); }
  function dogBed(x, s, t, empty) { g.save(); g.translate(x, 0); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.ellipse(0, -60, 300, 90, 0, 0, 7); }, "#3f8fe0", { rim: "rgba(200,230,255,.7)", rw: 6, sw: 14 });
    kshape(g, (c) => { c.beginPath(); c.ellipse(140, -110, 110, 60, -.15, 0, 7); }, "#f7f4ec", { rw: 4, sw: 8 });
    if (!empty) dogHead(150, -170 + Math.sin(t * 2) * 3, 1.5, false, 1);
    kshape(g, (c) => { c.beginPath(); c.moveTo(-260, -60); c.bezierCurveTo(-240, -190, 60, -170 + Math.sin(t * 2) * 6, 110, -120); c.lineTo(130, -40); c.quadraticCurveTo(-60, -10, -260, -60); c.closePath(); }, empty ? "#ff8fb0" : "#ff8fb0", { rim: "rgba(255,230,240,.8)", rw: 5, sw: 12 });
    g.fillStyle = "rgba(255,255,255,.5)"; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(-180 + i * 60, -90 + (i % 2) * 20, 9, 0, 7); g.fill(); }
    if (empty) { g.fillStyle = "#1b1724"; g.font = '900 60px "Montserrat"'; g.textAlign = "center"; g.fillText("z", 150, -260 + Math.sin(t * 3) * 10); }
    g.restore(); }
  function book(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(-.15);
    kshape(g, (c) => { c.beginPath(); c.moveTo(0, 0); c.lineTo(-90, -20); c.lineTo(-90, 90); c.lineTo(0, 110); c.closePath(); }, "#ffffff", { rw: 3, sw: 4 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(0, 0); c.lineTo(90, -20); c.lineTo(90, 90); c.lineTo(0, 110); c.closePath(); }, "#f7f4ec", { rw: 3, sw: 4 });
    g.strokeStyle = "#e5484d"; g.lineWidth = 8; g.beginPath(); g.moveTo(-94, -22); g.lineTo(-94, 92); g.lineTo(0, 114); g.lineTo(94, 92); g.lineTo(94, -22); g.stroke(); g.restore(); }
  KZ.shot("dNight", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(-260, -200, k), -360, lerp(1.0, 1.08, k)); lamp(-820, t);
    const r = at(rudi, -560, 0, .8, { t, arm: .55, mouth: lt % .8 < .4 ? "o" : "smile", look: .3 });
    book(-560 + r.hx * .8 + 30, r.hy * .8 - 10, 1, t);
    dogBed(80, .9, t, false);
    bubble("ONCE UPON A TIME...", W * .36, H * .12, sm((lt - .15) / .3), -.03);
    label("BEDTIME: 7 PM", W * .44, H * .62, sm((lt - .5) / .3)); });
  function houseNight(t, cx, cy, z) { nightPark(t, cx, cy, z);
    kshape(g, (c) => { c.beginPath(); c.rect(-1400, -1100, 1300, 1100); }, "#3a3f7a", { rim: "rgba(180,190,255,.35)", rw: 6, sw: 20 });
    g.fillStyle = "rgba(255,255,255,.04)"; for (let y = -1060; y < 0; y += 70) g.fillRect(-1400, y, 1300, 6);
    // Fenster (warm)
    g.fillStyle = "#ffcf6a"; g.fillRect(-1250, -900, 340, 300); g.save(); g.globalCompositeOperation = "lighter"; glow(-1080, -750, 360, "rgba(255,200,110,.35)"); g.restore();
    g.fillStyle = "#3a3f7a"; g.fillRect(-1086, -900, 12, 300); g.fillRect(-1250, -756, 340, 12);
    // Tür mit Hundeklappe
    kshape(g, (c) => { c.beginPath(); c.roundRect(-640, -760, 380, 760, [30, 30, 0, 0]); }, "#b9773f", { rim: "rgba(255,220,180,.5)", rw: 6, sw: 14 });
    g.fillStyle = "#ffd84a"; g.beginPath(); g.arc(-320, -380, 18, 0, 7); g.fill(); }
  function flap(x, sw) { g.save(); g.translate(x, -250); g.fillStyle = "#1b1724"; g.fillRect(-110, 0, 220, 200); g.scale(1, Math.cos(sw)); kshape(g, (c) => { c.beginPath(); c.roundRect(-104, 0, 208, 196, 12); }, "#8a90b8", { rim: "rgba(255,255,255,.5)", rw: 4, sw: 6 }); g.restore(); }
  KZ.shot("dNight2", (lt, d, t) => { const k = sm(lt / d); houseNight(t, lerp(-280, -160, k), -380, lerp(1.0, 1.1, k));
    const dx = lerp(-460, 120, sm(clamp(lt / (d * .9), 0, 1)));
    flap(-450, Math.max(0, Math.sin(lt * 9) * 1.1 * (1 - clamp(lt / d, 0, 1)) + .2));
    dogAt(dx, 0, .6, { t, walk: 9, wag: .4, look: .8, shades: 1 });
    bubble("...THE END. MAX?", W * .3, H * .1, sm((lt - d * .45) / .25), -.04);
    stamp("SNEAKING OUT", W * .5, H * .3, (lt - d * .3) / .22, "#7b5cff", .06); });
  function bar(x, yBase, w, h, col, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a * 2, 0, 1); kshape(g, (c) => { c.beginPath(); c.roundRect(x - w / 2, yBase - h, w, h, [18, 18, 0, 0]); }, col, { rim: "rgba(255,255,255,.6)", rw: 5, sw: 10 }); g.restore(); }
  function wobbleAll(lt, d, t) { const z = 1 + .07 * sm(lt / d) + .012 * Math.sin(t * 3.1), ox = Math.sin(t * 1.7) * 10; const cv = g.canvas; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(cv, W * .44 * (1 - z) + ox, H * .4 * (1 - z), W * z, H * z); g.restore(); }
  KZ.shot("dTeen", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.14, sm(lt / d)) + Math.sin(t * 2) * .015);
    txt("A 1-YEAR-OLD DOG IS...", W * .44, H * .1, 52, "#fff", { w: 900 });
    const yb = H * .5, s = 30; const a1 = sm((lt - .1) / .5), a2 = sm((lt - d * .35) / .6);
    bar(W * .26, yb, 230, 7 * s * a1, "#8a90b8", a1); bar(W * .62, yb, 230, 15 * s * a2, "#ffd84d", a2);
    txt("7", W * .26, yb - 7 * s * a1 - 60, 90, "#c9cdf0", { w: 900, a: a1 }); txt(String(Math.round(15 * a2)), W * .62, yb - 15 * s * a2 - 60, 110, "#ffd84d", { w: 900, a: a2 });
    txt("×7 RULE", W * .26, yb + 50, 44, "#c9cdf0", { w: 900, a: a1 }); txt("REALITY", W * .62, yb + 50, 44, "#ffd84d", { w: 900, a: a2 });
    cross(W * .26, yb - 120, .9, (lt - d * .55) / .25);
    stamp("TEENAGER!", W * .44, H * .6, (lt - d * .62) / .22, "#e5484d", -.05); wobbleAll(lt, d, t); });
  KZ.shot("dGrow", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.12, sm(lt / d)) + Math.sin(t * 2) * .015);
    txt("DOG AGE IN HUMAN YEARS", W * .44, H * .09, 50, "#fff", { w: 900 });
    const vals = [15, 24, 29, 34, 39], yb = H * .52, s = 15.5;
    vals.forEach((v, i) => { const a = sm((lt - .1 - i * (d * .14)) / .4), x = W * .1 + i * 175; bar(x, yb, 130, v * s * a, i < 2 ? "#ffd84d" : "#7ef0b0", a);
      txt(String(Math.round(v * a)), x, yb - v * s * a - 46, 60, i < 2 ? "#ffd84d" : "#7ef0b0", { w: 900, a }); txt((i + 1) + (i ? " YRS" : " YR"), x, yb + 44, 38, "#e8ecff", { w: 800, a }); });
    label("+5 PER BIRTHDAY", W * .6, H * .58, sm((lt - d * .6) / .3)); wobbleAll(lt, d, t); });
  function helix(cx, cy, t, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; for (let i = 0; i < 14; i++) { const y = cy - 210 + i * 30, ph = t * 2 + i * .55, x1 = cx + Math.sin(ph) * 70, x2 = cx - Math.sin(ph) * 70;
      g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 6; g.beginPath(); g.moveTo(x1, y); g.lineTo(x2, y); g.stroke();
      g.fillStyle = Math.cos(ph) > 0 ? "#7ef0b0" : "#3f8fe0"; g.beginPath(); g.arc(x1, y, 14, 0, 7); g.fill(); g.fillStyle = Math.cos(ph) > 0 ? "#3f8fe0" : "#ff8fb0"; g.beginPath(); g.arc(x2, y, 14, 0, 7); g.fill(); } g.restore(); }
  KZ.shot("dDNA", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.14, sm(lt / d)) + Math.sin(t * 2) * .015);
    helix(W * .2, H * .27, t, sm(lt / .4));
    card(W * .56, H * .27, 640, 560, (lt - .2) / .4, "UC SAN DIEGO");
    const a = sm((lt - .5) / .3);
    txt("104 Labradors", W * .56, H * .2, 50, "#2f6fd0", { w: 900, a });
    txt("“a nine-month-old dog", W * .56, H * .27, 40, "#1b1d3a", { w: 800, a: sm((lt - .9) / .3) }); txt("can have puppies”", W * .56, H * .31, 40, "#1b1d3a", { w: 800, a: sm((lt - .9) / .3) });
    txt("Trey Ideker, Cell Systems 2020", W * .56, H * .37, 28, "#6a6f9a", { w: 700, a: sm((lt - 1.1) / .3) });
    stamp("×7 = WRONG", W * .44, H * .52, (lt - d * .6) / .22, "#e5484d", .05); wobbleAll(lt, d, t); });
  KZ.shot("dCool", (lt, d, t) => { const k = sm(lt / d); party(t, lerp(-190, -220, k), -360, lerp(1.12, 1.2, k));
    partyRudi(-560, .9, { t, arm: 1.6, mouth: "hmm", look: .7 });
    dogAt(-260, 0, .55, { t, hat: 1, wag: .9, look: .9, shades: 1, mouth: "open" });
    stamp("TOO COOL", W * .5, H * .14, (lt - d * .35) / .22, "#7b5cff", -.06); });
  KZ.shot("dTip", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.12, sm(lt / d)) + Math.sin(t * 2) * .015);
    txt("DOG YEARS, THE RIGHT WAY", W * .44, H * .08, 48, "#fff", { w: 900 });
    [["YEAR 1", "= 15"], ["YEAR 2", "+ 9"], ["THEN", "+ 5 / YEAR"]].forEach(([a1, b1], i) => { const p = (lt - .1 - i * d * .26) / .35, y = H * (.18 + i * .14);
      card(W * .44, y, 800, 200, p); const a = sm(p);
      txt(a1, W * .44 - 200, y, 56, "#2f6fd0", { w: 900, a }); txt(b1, W * .44 + 140, y, 70, "#1b1d3a", { w: 900, a }); }); wobbleAll(lt, d, t); });
  KZ.shot("dVet", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(-230, -180, k), -330, lerp(1.0, 1.08, k));
    g.save(); g.translate(-480, 0); g.scale(.85, .85); dog(g, { t, wag: .5, look: .7, seed: 2 }); g.restore();
    dogAt(20, 0, .38, { t, wag: 1, wagF: 14, look: .6, mouth: "open", seed: 4 });
    label("BIG DOGS AGE FASTER", W * .44, H * .1, sm((lt - .2) / .3));
    // Klemmbrett
    const a = sm((lt - d * .45) / .3); if (a > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W * .3, H * .24); g.scale(easeBack(Math.min(a, 1)), easeBack(Math.min(a, 1)));
      kshape(g, (c) => { c.beginPath(); c.roundRect(-150, -170, 300, 340, 24); }, "#b9773f", { rw: 4, sw: 8 }); g.fillStyle = "#f7f4ec"; g.fillRect(-120, -130, 240, 280); g.fillStyle = "#c8ccd8"; g.fillRect(-60, -186, 120, 40);
      txt("VET", W * .3, H * .24 - 70, 50, "#2f6fd0", { w: 900 }); g.restore(); check(W * .3, H * .24 + 40, .9, (lt - d * .6) / .25); }
    stamp("EVERY YEAR", W * .6, H * .27, (lt - d * .65) / .22, "#2fae6a", -.05); });
  KZ.shot("dLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .6) { party(t, lerp(80, 60, k), -360, lerp(1.4, 1.5, k)); cake(300, .8, t, "1"); dogAt(-200, 0, .85, { t, hat: 1, wag: .8, look: .8, shades: 1 }); }
    else hookD(0, d, t, true); });

  (function () { const SH = KZ.SHOTS; const split = (a, b, f) => (lt, d, t) => { const c = d * f; if (lt < c) SH[a](lt, c, t); else SH[b](lt - c, d - c, t); };
    KZ.shot("dPartyFull", split("dParty", "dParty2", .5));
    KZ.shot("dNightFull", split("dNight", "dNight2", .5)); })();

  // ================= Neu: Hundenase (trocken/nass), Wohnzimmer -> Regenwald, Luftbefeuchter, Sprühflasche, Hundehütte =================
  function noseFx(c, mode, t) { // Nase sitzt bei (398,-458), rx 22, ry 16
    if (mode === "dry") { kshape(c, ell(398, -458, 24, 17, .1), "#6b5652", { rw: 2, sw: 3 });
      c.strokeStyle = "rgba(240,215,200,.85)"; c.lineWidth = 2.2; c.lineCap = "round";
      for (const [x0, y0, x1, y1] of [[384, -466, 396, -460], [396, -460, 392, -450], [402, -468, 410, -458], [410, -458, 418, -462], [400, -452, 408, -446]]) { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
      c.fillStyle = "#2a1e22"; c.beginPath(); c.ellipse(412, -452, 4, 6, .4, 0, 7); c.fill();
    } else { c.fillStyle = "#1b1416"; c.beginPath(); c.ellipse(398, -458, 23, 17, .1, 0, 7); c.fill(); c.fillStyle = "#000"; c.beginPath(); c.ellipse(412, -452, 4, 6, .4, 0, 7); c.fill();
      c.fillStyle = "rgba(255,255,255,.9)"; c.beginPath(); c.ellipse(404, -466, 9, 4.5, -.2, 0, 7); c.fill(); c.beginPath(); c.arc(390, -462, 3, 0, 7); c.fill();
      c.save(); c.globalCompositeOperation = "lighter"; glow(402, -462, 26, "rgba(160,220,255,.5)"); c.restore();
      const ph = (t * .9) % 1; c.fillStyle = "rgba(170,225,255,.95)"; c.beginPath(); const dy = -444 + ph * 40; c.moveTo(406, dy - 8); c.quadraticCurveTo(413, dy + 2, 406, dy + 6); c.quadraticCurveTo(399, dy + 2, 406, dy - 8); c.fill(); } }
  function finger(x, y, s, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.rect(150, -58, 620, 116); }, C.coat, { rim: "rgba(255,245,200,.7)", rw: 6, sw: 14 });
    g.fillStyle = C.coatD; g.fillRect(150, -60, 26, 120);
    kshape(g, ell(118, 0, 54, 48, 0), C.skin, { rim: "rgba(255,240,225,.8)", rw: 4, sw: 10 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(0, -16, 110, 32, 16); }, C.skin, { rim: "rgba(255,240,225,.8)", rw: 3, sw: 6 });
    g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.ellipse(18, -6, 12, 6, 0, 0, 7); g.fill();
    g.strokeStyle = "rgba(170,90,70,.4)"; g.lineWidth = 4; g.beginPath(); g.moveTo(70, 34); g.quadraticCurveTo(100, 50, 130, 40); g.stroke(); g.restore(); }
  function monstera(x, s, t, smile, i) { if (s <= 0) return; g.save(); g.translate(x, 0); g.scale(s, s); const sw = Math.sin(t * 1.3 + (i || 0)) * .05;
    const leaves = [[-.9, 260], [-.35, 330], [.25, 300], [.8, 250], [0, 200]];
    leaves.forEach(([a, L], j) => { g.save(); g.translate(0, -170); g.rotate(a + sw * (j % 2 ? 1 : -1));
      g.strokeStyle = "#2f8a48"; g.lineWidth = 10; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(10, -L * .5, 0, -L); g.stroke();
      kshape(g, ell(0, -L - 70, 92, 110, 0), j % 2 ? "#3fb862" : "#2fa456", { rim: "rgba(200,255,200,.55)", shadow: "rgba(0,60,20,.3)", rw: 5, sw: 12 });
      g.strokeStyle = "rgba(20,90,40,.7)"; g.lineWidth = 6; g.beginPath(); g.moveTo(0, -L + 30); g.lineTo(0, -L - 170); g.stroke();
      for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(0, -L - 20 - k * 50); g.lineTo(sd * 80, -L - 50 - k * 50); g.stroke(); }
      g.restore(); });
    kshape(g, (c) => { c.beginPath(); c.moveTo(-110, -190); c.lineTo(110, -190); c.lineTo(84, 0); c.lineTo(-84, 0); c.closePath(); }, "#d9733f", { rim: "rgba(255,210,180,.7)", shadow: "rgba(120,40,10,.3)", rw: 5, sw: 14 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-122, -214, 244, 40, 12); }, "#e8854f", { rw: 4, sw: 6 });
    if (smile) { fig.eye(g, -36, -110, 18, { t, seed: i || 0, look: .5 }); fig.eye(g, 36, -110, 18, { t, seed: (i || 0) + 1, look: .5 });
      g.strokeStyle = "#5a2210"; g.lineWidth = 7; g.lineCap = "round"; g.fillStyle = "#5a2210"; g.beginPath(); g.moveTo(-30, -66); g.quadraticCurveTo(0, -30 + Math.sin(t * 4 + (i || 0)) * 4, 30, -66); g.closePath(); g.fill(); }
    g.restore(); }
  function humid(x, s, t, on) { if (s <= 0) return; g.save(); g.translate(x, 0); g.scale(s, s);
    if (on) { g.save(); for (let i = 0; i < 6; i++) { const ph = (t * .55 + i / 6) % 1, y = -250 - ph * 360, r = 26 + ph * 70; g.fillStyle = `rgba(235,245,255,${.55 * (1 - ph)})`; g.beginPath(); g.arc(Math.sin(t * 2 + i) * 30 * ph, y, r, 0, 7); g.fill(); } g.restore(); }
    kshape(g, (c) => { c.beginPath(); c.roundRect(-70, -230, 140, 230, 50); }, "#eef2ff", { rim: "rgba(255,255,255,.9)", shadow: "rgba(60,70,140,.3)", rw: 5, sw: 16 });
    g.fillStyle = "#5ab0ff"; g.beginPath(); g.roundRect(-40, -150, 80, 100, 18); g.fill(); g.fillStyle = "rgba(255,255,255,.45)"; g.fillRect(-30, -140, 14, 70);
    g.fillStyle = "#c9cfe8"; g.beginPath(); g.roundRect(-30, -258, 60, 34, 12); g.fill();
    g.fillStyle = "#7ef0b0"; g.beginPath(); g.arc(0, -190, 9, 0, 7); g.fill(); g.restore(); }
  function living(t, cx, cy, z, rain) { rain = rain || 0;
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2c3f8c"); bg.addColorStop(1, "#18225a"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(cx, cy, z);
    g.fillStyle = "#34479a"; g.fillRect(-3000, -2200, 6000, 2200); g.fillStyle = "rgba(255,255,255,.05)"; for (let x = -2400; x < 2400; x += 180) g.fillRect(x, -2200, 80, 2200);
    // Fenster mit Sonne
    kshape(g, (c) => { c.beginPath(); c.roundRect(-260, -1060, 520, 460, 20); }, "#c9a46a", { rw: 5, sw: 12 });
    const wg = g.createLinearGradient(0, -1040, 0, -620); wg.addColorStop(0, "#6fb6ff"); wg.addColorStop(1, "#bfe2ff"); g.fillStyle = wg; g.fillRect(-234, -1034, 468, 408);
    g.save(); g.globalCompositeOperation = "lighter"; glow(120, -920, 140, "rgba(255,240,170,.5)"); g.restore(); g.fillStyle = "#fff1b0"; g.beginPath(); g.arc(120, -920, 46, 0, 7); g.fill();
    g.fillStyle = "#c9a46a"; g.fillRect(-6, -1060, 12, 460); g.fillRect(-260, -836, 520, 12);
    // Sofa links
    kshape(g, (c) => { c.beginPath(); c.roundRect(-1500, -420, 640, 260, 60); }, "#e5484d", { rim: "rgba(255,200,200,.6)", rw: 6, sw: 16 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-1540, -240, 720, 200, 50); }, "#d63b40", { rim: "rgba(255,200,200,.5)", rw: 6, sw: 16 });
    g.fillStyle = "#7e4a22"; g.fillRect(-1500, -40, 30, 40); g.fillRect(-890, -40, 30, 40);
    const fg = g.createLinearGradient(0, 0, 0, 900); fg.addColorStop(0, "#9a6a44"); fg.addColorStop(1, "#5a3a26"); g.fillStyle = fg; g.fillRect(-3000, 0, 6000, 3000);
    g.strokeStyle = "rgba(0,0,0,.12)"; g.lineWidth = 4; for (let x = -3000; x < 3000; x += 200) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x - 120, 1400); g.stroke(); }
    if (rain > 0) { // Regenwald-Stufe
      g.fillStyle = `rgba(30,150,90,${.42 * rain})`; g.fillRect(-3000, -2200, 6000, 2200);
      for (let i = 0; i < 9; i++) { const vx = -1500 + i * 360 + (i % 2) * 90, L = (300 + (i * 137) % 400) * clamp(rain * 1.4 - i * .05, 0, 1); if (L <= 0) continue;
        g.strokeStyle = "#2f8a48"; g.lineWidth = 9; g.beginPath(); g.moveTo(vx, -1500); g.quadraticCurveTo(vx + Math.sin(t + i) * 30, -1500 + L * .5, vx, -1500 + L); g.stroke();
        for (let k = 1; k < 5; k++) { const ly = -1500 + L * k / 5; kshape(g, ell(vx + (k % 2 ? 26 : -26), ly, 30, 16, k % 2 ? .5 : -.5), "#3fb862", { rw: 2, sw: 4 }); } } } }
  function rainFx(t, rain) { if (rain <= 0) return; // Nebel + Tropfen in Weltkoordinaten
    for (let i = 0; i < 7; i++) { const x = -1600 + ((i * 520 + t * 40) % 3200); g.fillStyle = `rgba(230,245,255,${.16 * rain})`; g.beginPath(); g.ellipse(x, -60 - (i % 3) * 50, 420, 110, 0, 0, 7); g.fill(); }
    g.fillStyle = `rgba(170,225,255,${.85 * rain})`; for (let i = 0; i < Math.floor(40 * rain); i++) { const ph = (t * .8 + i * .137) % 1, x = -1500 + (i * 211) % 3000, y = -1300 + ph * 1300;
      g.beginPath(); g.moveTo(x, y - 14); g.quadraticCurveTo(x + 7, y + 4, x, y + 8); g.quadraticCurveTo(x - 7, y + 4, x, y - 14); g.fill(); } }
  function sprayer(x, y, s, sq, t) { g.save(); g.translate(x, y); g.scale(s, s);
    if (sq > 0) { g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 16; i++) { const ph = (t * 3 + i / 16) % 1, a = (i * 1.7) % 1 - .5; g.fillStyle = `rgba(170,225,255,${(1 - ph) * sq})`; g.beginPath(); g.arc(70 + ph * 220, -52 + a * ph * 140, 7 + ph * 5, 0, 7); g.fill(); } g.restore(); }
    kshape(g, (c) => { c.beginPath(); c.roundRect(-44, -10, 88, 150, 26); }, "#5ab0ff", { rim: "rgba(220,240,255,.9)", rw: 4, sw: 8 });
    g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(-30, 10, 12, 100);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-30, -76, 80, 66, 14); }, "#f7f4ec", { rw: 3, sw: 6 });
    g.fillStyle = "#f7f4ec"; g.fillRect(48, -62, 26, 18); g.fillStyle = "#e5484d"; g.beginPath(); g.roundRect(14, -18 - sq * 6, 18, 56, 8); g.fill(); g.restore(); }
  function doghouse(x, s, t) { g.save(); g.translate(x, 0); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.rect(-220, -300, 440, 300); }, "#e5484d", { rim: "rgba(255,200,190,.7)", shadow: "rgba(110,20,20,.3)", rw: 6, sw: 18 });
    g.strokeStyle = "rgba(120,20,30,.35)"; g.lineWidth = 5; for (let y = -260; y < 0; y += 50) { g.beginPath(); g.moveTo(-220, y); g.lineTo(220, y); g.stroke(); }
    kshape(g, (c) => { c.beginPath(); c.moveTo(-270, -280); c.lineTo(0, -500); c.lineTo(270, -280); c.lineTo(240, -260); c.lineTo(0, -450); c.lineTo(-240, -260); c.closePath(); }, "#4a2a5a", { rim: "rgba(220,190,255,.5)", rw: 6, sw: 12 });
    g.fillStyle = "#c63a40"; g.beginPath(); g.moveTo(-240, -262); g.lineTo(0, -450); g.lineTo(240, -262); g.fill();
    g.fillStyle = "#1b1724"; g.beginPath(); g.moveTo(-110, 0); g.lineTo(-110, -150); g.arc(0, -150, 110, Math.PI, 0); g.lineTo(110, 0); g.closePath(); g.fill();
    kshape(g, (c) => { c.beginPath(); c.roundRect(-80, -390, 160, 64, 14); }, "#f7f4ec", { rw: 3, sw: 6 });
    g.fillStyle = "#4a2a5a"; g.font = '900 46px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("MAX", 0, -356); g.restore(); }
  function radiator(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
    for (let i = 0; i < 5; i++) kshape(g, (c) => { c.beginPath(); c.roundRect(-110 + i * 46, -80, 36, 160, 16); }, "#ff7a4a", { rim: "rgba(255,220,190,.8)", rw: 3, sw: 6 });
    g.fillStyle = "#c94a2a"; g.fillRect(-116, 50, 232, 14); g.fillRect(-116, -64, 232, 14); g.restore(); }
  function heatWaves(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = "rgba(255,200,120,.9)"; g.lineWidth = 9; g.lineCap = "round";
    for (let i = -1; i <= 1; i++) { g.beginPath(); for (let k = 0; k <= 10; k++) { const yy = -k * 12, xx = i * 50 + Math.sin(k * .9 - t * 6) * 12; if (!k) g.moveTo(xx, yy); else g.lineTo(xx, yy); } g.stroke(); } g.restore(); }
  function windIcon(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = "#e8f4ff"; g.lineWidth = 14; g.lineCap = "round"; const o = Math.sin(t * 4) * 12;
    for (const [yy, L] of [[-50, 150], [0, 190], [50, 120]]) { g.beginPath(); g.moveTo(-110 + o, yy); g.lineTo(-110 + L + o, yy); g.arc(-110 + L + o, yy - 24, 24, Math.PI / 2, -Math.PI * .9, true); g.stroke(); }
    kshape(g, ell(90 + o * 2, 70, 26, 14, .6), "#7ef0b0", { rw: 2, sw: 4 }); g.restore(); }
  function moonIcon(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#fff1b0"; g.beginPath(); g.arc(0, 0, 80, 0, 7); g.fill(); g.fillStyle = "#3a3f7a"; g.beginPath(); g.arc(34, -24, 70, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.font = '900 56px "Montserrat"'; g.textAlign = "center"; g.fillText("z", 80, -60 - Math.sin(t * 3) * 8); g.font = '900 40px "Montserrat"'; g.fillText("z", 116, -110 - Math.sin(t * 3 + 1) * 8); g.restore(); }
  function iconDisc(x, y, r, p, col) { const k = easeBack(clamp(p, 0, 1)); if (k <= 0) return 0; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(k, k);
    kshape(g, (c) => { c.beginPath(); c.arc(0, 0, r, 0, 7); }, col, { rim: "rgba(255,255,255,.6)", shadow: "rgba(0,0,30,.3)", rw: 6, sw: 16 }); g.restore(); return k; }

  // ---------- Shots ----------
  function hookN(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    living(t, lerp(300, 318, k), lerp(-430, -440, k), lerp(2.25, 2.55, k));
    dog(g, { t, look: .75, wag: .3, nose: "dry" });
    const f = loop ? 0 : sm(clamp(lt / (d * .45), 0, 1)), tap = loop ? 0 : Math.max(0, Math.sin((lt - d * .45) * 9)) * (lt > d * .45 ? 1 : 0);
    finger(lerp(520, 424, f) + tap * 6, lerp(-610, -482, f) - tap * 6, .42, -.75);
    if (loop) return;
    stamp("NOT SICK!", W * .42, H * .6, (lt - d * .6) / .22, "#2fae6a", -.06); }
  KZ.shot("nHook", (lt, d, t) => hookN(lt, d, t, false));
  KZ.shot("nPanic", (lt, d, t) => { const k = sm(lt / d); living(t, lerp(-60, -20, k), -340, lerp(1.12, 1.2, k));
    const late = lt > d * .5;
    if (!late) at(rudi, -200, 0, .8, { t, hand: [200, -400], mouth: "o", look: .5 });
    else at(rudi, -230, 0, .8, { t, arm: .9 + Math.sin(t * 14) * .25, arm2: .5 + Math.sin(t * 13) * .4, mouth: "scream", look: .3 });
    dogAt(260, 0, .7, { t, look: .2, wag: .1, nose: "dry", seed: 1 }, true);
    if (late) sweat(-230, -560, t, 1);
    stamp("BONE DRY", W * .5, H * .14, (lt - d * .2) / .22, "#f08a1e", -.06);
    stamp("PANIC!", W * .36, H * .3, (lt - d * .55) / .22, "#e5484d", .07); });
  KZ.shot("nRain", (lt, d, t) => { const k = sm(lt / d), rain = sm(clamp((lt - d * .45) / (d * .4), 0, 1));
    living(t, lerp(-120, -60, k), -420, lerp(1.0, .86, k), rain);
    const n = Math.min(6, 1 + Math.floor(Math.max(0, lt - d * .2) / (d * .07)));
    const hx = [-700, -470, 380, 600, -1000, 820];
    [[-760, 0], [560, 1], [-1100, 2], [900, 3]].forEach(([x, i]) => monstera(x, .8 * sm(clamp(rain * 1.6 - i * .15, 0, 1)), t, false, i));
    for (let i = 0; i < 6; i++) { const p = i < n ? sm(clamp((lt - d * .12 - i * d * .07) / .25, 0, 1)) : 0; humid(hx[i], .9 * easeBack(p), t, p > .5); }
    at(rudi, -180, 0, .8, { t, arm: rain > .3 ? 1 : .3, mouth: rain > .3 ? "grin" : "smile", look: .5 });
    dogAt(170, 0, .62, { t, look: -.3, wag: 0, nose: "wet", mood: rain > .5 ? "angry" : undefined }, true);
    rainFx(t, rain);
    label("HUMIDIFIER", W * .44, H * .1, sm((lt - .1) / .3) * (1 - sm((lt - d * .45) / .2)));
    stamp("×6", W * .3, H * .3, (lt - d * .32) / .2, "#3f8fe0", .08);
    stamp("RAINFOREST", W * .44, H * .14, (lt - d * .7) / .22, "#2fae6a", -.05); });
  KZ.shot("nSpray", (lt, d, t) => { const k = sm(lt / d); living(t, lerp(10, 40, k), -380, lerp(1.35, 1.5, k), .6);
    const sq = Math.max(0, Math.sin(t * 7));
    const r = at(rudi, -330, 0, .8, { t, arm: .5, mouth: "grin", look: .5 });
    sprayer(-330 + r.hx * .8, r.hy * .8 + 10, .7, sq, t);
    dogAt(330, 0, .62, { t, look: -.5, wag: 0, nose: "wet", mood: "angry" }, true);
    rainFx(t, .6);
    // Uhr
    const a = sm((lt - .1) / .3); if (a > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W * .26, H * .14); g.scale(a, a);
      kshape(g, (c) => { c.beginPath(); c.arc(0, 0, 90, 0, 7); }, "#f7f4ec", { rw: 5, sw: 10 }); g.strokeStyle = "#1b1d3a"; g.lineWidth = 10; g.lineCap = "round";
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -60); g.stroke(); const ang = t * 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(ang) * 70, -Math.cos(ang) * 70); g.stroke(); g.restore(); }
    stamp("EVERY 5 MIN", W * .56, H * .14, (lt - d * .3) / .22, "#3f8fe0", .05); });
  KZ.shot("nShed", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(-60, -20, k), -380, lerp(1.1, 1.2, k));
    doghouse(220, 1, t);
    const peek = sm(clamp(lt / .5, 0, 1)); dogHead(220, -120 + (1 - peek) * 60, 1.3 * peek + .01, false, 1);
    const r = at(rudi, -300, 0, .8, { t, arm: .35, mouth: "hmm", look: .5 }); sprayer(-300 + r.hx * .8, r.hy * .8 + 10, .7, 0, t);
    bubble("NOPE.", W * .66, H * .24, sm((lt - .3) / .3), .05);
    stamp("MOVED OUT", W * .42, H * .12, (lt - d * .45) / .22, "#7b5cff", -.06); });
  KZ.shot("nDay", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.12, sm(lt / d)) + Math.sin(t * 2) * .015);
    txt("A DOG'S NOSE, ONE DAY", W * .45, H * .09, 52, "#fff", { w: 900 });
    const x0 = 150, x1 = 880, yT = H * .17, yB = H * .47;
    card(W * .47, (yT + yB) / 2, 860, yB - yT + 120, sm(lt / .3));
    txt("WET", x0 + 10, yT + 20, 40, "#2f6fd0", { w: 900, a: sm(lt / .3), align: "left" }); txt("DRY", x0 + 10, yB - 20, 40, "#d9733f", { w: 900, a: sm(lt / .3), align: "left" });
    const f = clamp((lt - .25) / (d * .7), 0, 1), N = 80, wv = (u) => .5 + .32 * Math.sin(u * 13.5 + .8) + .12 * Math.sin(u * 31);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = "#3f8fe0"; g.lineWidth = 12; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath();
    for (let i = 0; i <= N * f; i++) { const u = i / N, x = lerp(x0 + 130, x1, u), y = lerp(yB - 40, yT + 40, wv(u)); if (!i) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke();
    const u = f, px = lerp(x0 + 130, x1, u), py = lerp(yB - 40, yT + 40, wv(u)); if (f > 0) { g.fillStyle = "#ffd84d"; g.beginPath(); g.arc(px, py, 20, 0, 7); g.fill(); } g.restore();
    [["NAP", .2], ["WALK", .43], ["NAP", .67], ["PLAY", .9]].forEach(([s, uu], i) => { const a = sm((f - uu + .05) / .1); txt(s, lerp(x0 + 130, x1, uu), yB + 80, 40, "#e8ecff", { w: 800, a }); });
    stamp("TOTALLY NORMAL", W * .45, H * .6, (lt - d * .7) / .22, "#2fae6a", -.05); wobbleAll(lt, d, t); });
  KZ.shot("nCauses", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.12, sm(lt / d)) + Math.sin(t * 2) * .015);
    txt("WHAT DRIES A NOSE", W * .45, H * .08, 54, "#fff", { w: 900 });
    const items = [["NAP", "#3a3f7a", 0], ["HEATER", "#7a2a4a", 1], ["WIND", "#2a5a8a", 2]];
    items.forEach(([s, col, i]) => { const p = (lt - .1 - i * d * .2) / .35, x = W * (.2 + i * .25), y = H * .27;
      const k = iconDisc(x, y, 130, p, col); if (k <= 0) return; g.save(); g.setTransform(k, 0, 0, k, x * (1 - k), y * (1 - k));
      if (i === 0) moonIcon(x - 10, y + 10, .9, t); else if (i === 1) { radiator(x, y + 30, .8); heatWaves(x, y - 50, .8, t); } else windIcon(x, y, .8, t);
      g.restore(); txt(s, x, y + 190, 48, "#fff", { w: 900, a: sm(p) }); });
    stamp("ALL NORMAL", W * .45, H * .55, (lt - d * .72) / .22, "#2fae6a", .05); wobbleAll(lt, d, t); });
  KZ.shot("nSource", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.12, sm(lt / d)) + Math.sin(t * 2) * .015);
    dogHead(W * .45, H * .09, 1.4, false, sm(lt / .4));
    card(W * .45, H * .3, 820, 520, (lt - .2) / .4, "UNIVERSITY OF MELBOURNE");
    const a = sm((lt - .5) / .3);
    txt("U-Vet Animal Hospital", W * .45, H * .24, 40, "#2f6fd0", { w: 900, a });
    txt("“It actually", W * .45, H * .3, 62, "#1b1d3a", { w: 900, a: sm((lt - .8) / .3) }); txt("means nothing.”", W * .45, H * .345, 62, "#1b1d3a", { w: 900, a: sm((lt - .8) / .3) });
    txt("Dr Leonie Richards, vet", W * .45, H * .4, 32, "#6a6f9a", { w: 700, a: sm((lt - 1.1) / .3) });
    stamp("MYTH", W * .45, H * .54, (lt - d * .65) / .22, "#e5484d", -.06); wobbleAll(lt, d, t); });
  KZ.shot("nGlue", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(330, 350, k), lerp(-450, -455, k), lerp(2.4, 2.7, k));
    dog(g, { t, look: .9, wag: .6, nose: "wet", sniff: .08 + Math.sin(t * 9) * .03 });
    for (let i = 0; i < 9; i++) { const st = d * .08 + i * d * .07, p = clamp((lt - st) / .7, 0, 1); if (p <= 0) continue;
      const sx = 540 + (i % 3) * 30, sy = -560 + i * 26, tx = 386 + (i % 3) * 9, ty = -470 + (i % 4) * 7, e = sm(p);
      const x = lerp(sx, tx, e) + Math.sin(t * 5 + i) * 6 * (1 - e), y = lerp(sy, ty, e);
      g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, 16, ["rgba(255,140,200,.7)", "rgba(255,220,120,.7)", "rgba(140,255,190,.7)"][i % 3]); g.restore();
      g.fillStyle = ["#ff8fd0", "#ffd84d", "#7ef0b0"][i % 3]; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); }
    label("SMELLS STICK", W * .4, H * .12, sm((lt - .2) / .3));
    stamp("LIKE GLUE", W * .42, H * .6, (lt - d * .55) / .22, "#f08a1e", .06); });
  KZ.shot("nCheck", (lt, d, t) => { const k = sm(lt / d); park(t, lerp(-60, 0, k), -330, lerp(1.0, 1.06, k));
    dogAt(-140 + Math.sin(t * 1.2) * 40, 0, .62, { t, walk: 10, run: 1, wag: 1, wagF: 14, mouth: "ball", look: .7, nose: "dry" });
    card(W * .45, H * .22, 780, 470, (lt - .05) / .35, "CHECK THIS INSTEAD", "#2fae6a");
    [["EATING?", 0], ["PLAYING?", 1], ["ACTING NORMAL?", 2]].forEach(([s, i]) => { const p = (lt - .35 - i * d * .2) / .3, y = H * (.17 + i * .07);
      txt(s, W * .45 - 300, y, 50, "#1b1d3a", { w: 900, a: sm(p), align: "left" }); check(W * .45 + 290, y, .55, p - .3); }); });
  KZ.shot("nVet", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.12, sm(lt / d)) + Math.sin(t * 2) * .015);
    txt("SEE A VET IF...", W * .45, H * .08, 58, "#fff", { w: 900 });
    [["CRACKED", 0], ["CRUSTY", 1], ["RUNNY", 2], ["ACTS SICK", 3]].forEach(([s, i]) => { const p = (lt - .1 - i * d * .14) / .3, x = W * (i % 2 ? .65 : .26), y = H * (i < 2 ? .2 : .36);
      card(x, y, 400, 200, p); const a = sm(p);
      if (a > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "#e5484d"; g.beginPath(); g.arc(x - 130, y, 38, 0, 7); g.fill(); g.restore(); txt("!", x - 130, y + 2, 52, "#fff", { w: 900, a }); }
      txt(s, x + 40, y, 44, "#1b1d3a", { w: 900, a }); });
    stamp("OTHERWISE: RELAX", W * .45, H * .55, (lt - d * .72) / .22, "#2fae6a", -.05); wobbleAll(lt, d, t); });
  KZ.shot("nPlants", (lt, d, t) => { const k = sm(lt / d); living(t, lerp(-200, -150, k), -420, lerp(.95, 1.05, k), 1);
    [[-1250, 0], [-850, 1], [-120, 2], [380, 3], [760, 4]].forEach(([x, i]) => { g.save(); g.translate(x, 0); g.scale(1, 1 + Math.abs(Math.sin(t * 4 + i)) * .04); g.translate(-x, 0); monstera(x, .78, t, true, i); g.restore(); });
    humid(-470, .9, t, true); humid(170, .9, t, true);
    at(rudi, -620, 0, .8, { t, arm: 1, mouth: "grin", look: .6 });
    rainFx(t, 1);
    bubble("THANKS, RUDI!", W * .55, H * .12, sm((lt - .3) / .3), .04);
    stamp("PLANT HEAVEN", W * .42, H * .6, (lt - d * .5) / .22, "#2fae6a", -.06); });
  KZ.shot("nLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .55) { living(t, lerp(-40, 0, k), -380, lerp(1.25, 1.45, k)); at(rudi, -200, 0, .8, { t, hand: [lerp(120, 200, k * 1.8), -400], mouth: "hmm", look: .5 }); dogAt(260, 0, .7, { t, look: .2, wag: .3, nose: "dry", seed: 1 }, true); }
    else hookN(0, d, t, true); });
  (function () { const SH = KZ.SHOTS; const split = (a, b, f) => (lt, d, t) => { const c = d * f; if (lt < c) SH[a](lt, c, t); else SH[b](lt - c, d - c, t); };
    KZ.shot("nSprayFull", split("nSpray", "nShed", .52)); })();
})();
