// Szenendatei "Cut A Worm In Half? Not Two Worms" (Regenwurm, Lumbricus terrestris). Mix-Stil (Hermann 12.11.2026).
// Quellen: Live Science 2013 "Will Two Worms Grow from a Worm Cut in Half?" ("If an earthworm is split in two, it will not become
// two new worms." Kopfende kann überleben und Schwanz nachbilden, wenn hinter dem Clitellum geschnitten; Schwanzende bildet keinen Kopf, stirbt),
// BBC Science Focus (Kopfende kann einen Schwanz nachbilden, "although often a stunted one"),
// Iowa DNR 2018 (keine Augen/Lungen, "five hearts", Clitellum nahe am Kopf, Kopfende steuert Regeneration).
// Helfer txt/stamp/navy/rudi/at/sparkle aus duck-bread/goldfish übernommen (Rudi bleibt gleich), Regenwurm neu gezeichnet:
// keine Augen (echte Regenwürmer haben keine), rosa-braun, Ringsegmente, heller Gürtel (Clitellum) im vorderen Drittel, spitzes Kopfende.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#3b4aa0", "#5a5cb8", "#3f3f8a", "#1e2058"], hills: [["#2a6a5a", "#327a66"], ["#22584c", "#2a6858"], ["#1a463e", "#22564a"]], corals: false, rays: false, dust: "255,236,190" };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86",
    worm: "#ee7f95", wormD: "#b94a68", wormL: "rgba(255,228,236,.8)", saddle: "#ff9f7a", saddleD: "#d9684e", wound: "#b8264f",
    soil: "#6e3f50", soilD: "#2f1a34", lawn: "#3f8a5a", lawnT: "#56a66c", metal: "#cfd6e6", metalD: "#8a93ad", wood: "#a8634a" };
  // ---------- Text in Bildschirmkoordinaten ----------
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
  function sparkle(x, y, r, a) { g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, r * 2.4, `rgba(255,230,140,${.6 * a})`); g.fillStyle = `rgba(255,250,220,${a})`; g.beginPath(); for (let i = 0; i < 8; i++) { const ang = i / 8 * 6.283, rr = i % 2 ? r * .3 : r; g.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } g.fill(); g.restore(); }
  function cross(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#ff4d5a"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(-50, -50); g.lineTo(50, 50); g.moveTo(50, -50); g.lineTo(-50, 50); g.stroke(); g.restore(); }
  function check(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#7ef0b0"; g.lineWidth = 22; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(-50, 0); g.lineTo(-14, 36); g.lineTo(54, -40); g.stroke(); g.restore(); }
  function heart(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col || "#ff4d6d"; c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(-18, -6, -8, -20, 0, -10); c.bezierCurveTo(8, -20, 18, -6, 0, 8); c.fill(); c.restore(); }

  // ---------- Regenwurm ----------
  // Wirbelsäule von Schwanz (u=0) bis Kopf (u=1), horizontal, Kopf rechts. o: len, amp, k (Wellen), sp (Tempo), bend
  const N = 48;
  function spine(o) { const len = o.len || 420, amp = o.amp ?? 12, k = o.k ?? 1.2, sp = o.sp ?? 3, t = o.t || 0, bend = o.bend || 0, pts = [];
    for (let i = 0; i < N; i++) { const u = i / (N - 1); let x = -len / 2 + u * len + Math.sin(u * 12.57 - t * sp * 1.4) * len * .012;
      const y = Math.sin(u * k * 6.283 - t * sp) * amp + bend * (u - .5) * (u - .5) * len; pts.push([x, y]); }
    return pts; }
  function poly(c, pts, i0, i1, dx, dy) { c.beginPath(); for (let i = i0; i <= i1; i++) { const [x, y] = pts[i]; i === i0 ? c.moveTo(x + dx, y + dy) : c.lineTo(x + dx, y + dy); } c.stroke(); }
  function band(c, pts, i0, i1, w, base, dark, rimC) { c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = dark; c.lineWidth = 2 * w; poly(c, pts, i0, i1, 0, 0);
    c.strokeStyle = base; c.lineWidth = 2 * w * .76; poly(c, pts, i0, i1, w * .1, -w * .16);
    c.strokeStyle = rimC; c.lineWidth = w * .22; poly(c, pts, i0, i1, w * .26, -w * .52); }
  // o: w (halbe Dicke), u0/u1 (sichtbarer Teil), alpha, regrow (Länge des nachgewachsenen Stücks hinten, u-Anteil), grey
  function worm(c, o) { const pts = o.pts || spine(o), w = o.w || 24;
    const i0 = Math.round((o.u0 ?? 0) * (N - 1)), i1 = Math.round((o.u1 ?? 1) * (N - 1));
    c.save(); c.globalAlpha *= o.alpha ?? 1;
    const base = o.grey ? "#b7a3ad" : C.worm, dark = o.grey ? "#7d6a78" : C.wormD;
    band(c, pts, i0, i1, w, base, dark, C.wormL);
    // nachgewachsenes Schwanzstück (heller, dünner)
    if (o.regrowPts) band(c, o.regrowPts, 0, o.regrowPts.length - 1, w * .8, "#f7b3c2", "#c86a85", C.wormL);
    // Gürtel (Clitellum) zwischen u .62 und .73
    const s0 = Math.max(i0, Math.round(.62 * (N - 1))), s1 = Math.min(i1, Math.round(.73 * (N - 1)));
    if (s1 > s0) band(c, pts, s0, s1, w * 1.14, o.grey ? "#c8a89a" : C.saddle, o.grey ? "#8a6a60" : C.saddleD, "rgba(255,235,215,.8)");
    // Ringsegmente
    c.strokeStyle = "rgba(120,25,60,.32)"; c.lineWidth = 2.6; c.lineCap = "round";
    for (let i = i0 + 1; i < i1; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i + 1]; let nx = -(y1 - y0), ny = x1 - x0; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const [x, y] = pts[i]; for (const f of [0, .5]) { const xx = x + (x1 - x0) * f * .5, yy = y + (y1 - y0) * f * .5; c.beginPath(); c.moveTo(xx + nx * w * .7 + w * .1, yy + ny * w * .7 - w * .16); c.lineTo(xx - nx * w * .62 + w * .1, yy - ny * w * .62 - w * .16); c.stroke(); } }
    // Kopfspitze (Prostomium) + kleines Maul
    if (i1 === N - 1) { const [xa, ya] = pts[N - 2], [xb, yb] = pts[N - 1]; const dl = Math.hypot(xb - xa, yb - ya) || 1, dx = (xb - xa) / dl, dy = (yb - ya) / dl;
      c.fillStyle = "rgba(150,35,75,.55)"; c.beginPath(); c.ellipse(xb + dx * w * .72, yb + dy * w * .72 + w * .12, w * .22, w * .3, Math.atan2(dy, dx), 0, 7); c.fill();
      c.fillStyle = "rgba(255,210,220,.7)"; c.beginPath(); c.arc(xb + dx * w * .2 + w * .1, yb - w * .45, w * .14, 0, 7); c.fill(); }
    // Schnittflächen
    const cut = (i) => { const [x, y] = pts[i]; c.fillStyle = C.wound; c.beginPath(); c.arc(x, y, w * .78, 0, 7); c.fill(); c.fillStyle = "#ff8aa8"; c.beginPath(); c.arc(x + w * .08, y - w * .08, w * .42, 0, 7); c.fill(); };
    if (i0 > 0 && !o.regrowPts) cut(i0); if (i1 < N - 1) cut(i1);
    c.restore(); return pts; }
  function wormAt(x, y, s, o, rot) { g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.scale(s * (o.flip ? -1 : 1), s); const p = worm(g, o); g.restore(); return p; }
  function shock(x, y, a, t) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = "#ffd84d"; g.lineWidth = 8; g.lineCap = "round"; for (let i = 0; i < 3; i++) { const an = -2.2 + i * .55, r0 = 40 + Math.sin(t * 12 + i) * 6; g.beginPath(); g.moveTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0); g.lineTo(x + Math.cos(an) * (r0 + 34), y + Math.sin(an) * (r0 + 34)); g.stroke(); } g.restore(); }

  // ---------- Garten im Querschnitt: Boden ab y=0 ----------
  const stones = Array.from({ length: 34 }, (_, i) => ({ x: -2200 + (i * 277) % 4400, y: 120 + (i * 131) % 900, r: 16 + (i % 5) * 9, c: ["#8a6a8a", "#9a7a6a", "#7a5a7a"][i % 3] }));
  function garden(t, cx, cy, z, o) { o = o || {};
    reef(t, cx * .3, 0, 1, PAL);
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.globalCompositeOperation = "lighter"; glow(W * .22, H * .1, 360, "rgba(255,230,160,.35)"); g.restore();
    g.fillStyle = "#fff1c4"; g.beginPath(); g.arc(W * .22, H * .1, 60, 0, 7); g.fill();
    cam(cx, cy, z);
    // Büsche + Blumen hinten
    for (let i = 0; i < 9; i++) { const x = -1900 + i * 460, s = .8 + (i % 3) * .2; kshape(g, (c) => { c.beginPath(); c.ellipse(x, -20, 170 * s, 130 * s, 0, Math.PI, 0); c.ellipse(x + 110 * s, -14, 110 * s, 90 * s, 0, Math.PI, 0); c.closePath(); }, "#2a7a5a", { rim: "rgba(170,255,210,.3)", rw: 6, sw: 14 }); }
    for (let i = 0; i < 12; i++) { const x = -1700 + i * 310 + (i % 2) * 70, h = 110 + (i % 3) * 40, sw = Math.sin(t * 1.4 + i) * 6; g.strokeStyle = "#2f8a4a"; g.lineWidth = 8; g.beginPath(); g.moveTo(x, -10); g.quadraticCurveTo(x + sw, -h * .5, x + sw * 2, -h); g.stroke();
      g.fillStyle = ["#ff7aa2", "#ffd84d", "#ff9a3c"][i % 3]; for (let p = 0; p < 5; p++) { const a = p / 5 * 6.283 + t * .3; g.beginPath(); g.arc(x + sw * 2 + Math.cos(a) * 18, -h + Math.sin(a) * 18, 13, 0, 7); g.fill(); } g.fillStyle = "#fff4d6"; g.beginPath(); g.arc(x + sw * 2, -h, 11, 0, 7); g.fill(); }
    // Boden
    const sg = g.createLinearGradient(0, 0, 0, 1500); sg.addColorStop(0, C.soil); sg.addColorStop(1, C.soilD); g.fillStyle = sg; g.fillRect(-3000, 0, 6000, 3000);
    g.fillStyle = "rgba(255,255,255,.04)"; for (let b = 0; b < 5; b++) { g.beginPath(); g.moveTo(-3000, 180 + b * 260); for (let x = -3000; x <= 3000; x += 200) g.lineTo(x, 180 + b * 260 + Math.sin(x * .004 + b) * 30); g.lineTo(3000, 300 + b * 260); g.lineTo(-3000, 300 + b * 260); g.fill(); }
    if (o.wet) { g.fillStyle = `rgba(40,20,60,${.35 * o.wet})`; g.fillRect(-3000, 0, 6000, 260); }
    // Gänge
    g.strokeStyle = "rgba(30,14,36,.55)"; g.lineCap = "round"; g.lineWidth = 46;
    for (const tn of (o.tunnels || [[-900, 60, -500, 380, -100, 260], [300, 40, 600, 420, 1000, 300]])) { g.beginPath(); g.moveTo(tn[0], tn[1]); g.bezierCurveTo(tn[0] + 120, tn[1] + 200, tn[2], tn[3], tn[4], tn[5]); g.stroke(); }
    for (const s of stones) kshape(g, ell(s.x, s.y, s.r * 1.3, s.r, .3), s.c, { rim: "rgba(255,240,255,.25)", rw: 3, sw: 6 });
    g.fillStyle = "rgba(255,220,200,.12)"; for (let i = 0; i < 160; i++) { g.beginPath(); g.arc(-2400 + (i * 157) % 4800, 20 + (i * 89) % 1300, 3 + i % 3, 0, 7); g.fill(); }
    // Wurzeln
    g.strokeStyle = "rgba(230,190,140,.35)"; g.lineWidth = 6; for (let i = 0; i < 12; i++) { const x = -1700 + i * 310 + (i % 2) * 70; g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x - 30, 60, x + 10, 120); g.moveTo(x, 10); g.quadraticCurveTo(x + 40, 50, x + 50, 90); g.stroke(); }
    // Rasenkante
    g.fillStyle = C.lawn; g.fillRect(-3000, -22, 6000, 30);
    g.strokeStyle = C.lawnT; g.lineWidth = 6; g.lineCap = "round"; for (let i = 0; i < 160; i++) { const x = -2400 + i * 30, h = 18 + (i % 4) * 7; g.beginPath(); g.moveTo(x, -16); g.lineTo(x + Math.sin(t * 1.3 + i) * 3, -16 - h); g.stroke(); }
  }

  // ---------- Rudi (eigene Menschenfigur): Füße bei y=0, Höhe ~540, schaut nach rechts ----------
  function tool(c, kind, hx, hy, dig) { // Stiel von der Hand nach unten, Blatt/Zinken bei y ~ 0..70
    const bx = hx + 30, by = 10 + dig * 40; c.save();
    c.strokeStyle = C.wood; c.lineWidth = 18; c.lineCap = "round"; c.beginPath(); c.moveTo(hx - 8, hy - 70); c.lineTo(bx, by); c.stroke();
    c.fillStyle = "#3b2a4a"; c.beginPath(); c.roundRect(hx - 40, hy - 96, 64, 26, 12); c.fill();
    if (kind === "spade") kshape(c, (c) => { c.beginPath(); c.moveTo(bx - 42, by - 6); c.lineTo(bx + 42, by - 6); c.lineTo(bx + 38, by + 90); c.quadraticCurveTo(bx, by + 110, bx - 38, by + 90); c.closePath(); }, C.metal, { rim: "rgba(255,255,255,.8)", shadow: "rgba(40,40,80,.35)", rw: 5, sw: 12 });
    else { c.fillStyle = C.metalD; c.fillRect(bx - 46, by - 10, 92, 16); c.strokeStyle = C.metal; c.lineWidth = 11; for (let i = 0; i < 4; i++) { const x = bx - 39 + i * 26; c.beginPath(); c.moveTo(x, by); c.lineTo(x, by + 100); c.stroke(); } }
    c.restore(); }
  function rudi(c, o) { const t = o.t || 0, br = Math.sin(t * 2.2) * 4, arm = o.arm ?? 0;
    c.save();
    c.strokeStyle = C.jeans; c.lineWidth = 30; c.lineCap = "round"; for (const x of [-26, 26]) { c.beginPath(); c.moveTo(x, -130); c.lineTo(x + 4, -16); c.stroke(); }
    c.fillStyle = "#2a2233"; for (const x of [-26, 26]) { c.beginPath(); c.ellipse(x + 16, -8, 30, 13, 0, 0, 7); c.fill(); }
    c.strokeStyle = C.coatD; c.lineWidth = 28; c.beginPath(); c.moveTo(-40, -330 + br); c.quadraticCurveTo(-74, -250, -54, -190); c.stroke();
    kshape(c, (c) => { c.beginPath(); c.moveTo(-82, -120); c.bezierCurveTo(-96, -260, -78, -350 + br, 0, -352 + br); c.bezierCurveTo(78, -350 + br, 96, -260, 82, -120); c.quadraticCurveTo(0, -100, -82, -120); c.closePath(); }, C.coat, { rim: "rgba(255,245,200,.7)", shadow: "rgba(90,40,10,.25)", rw: 7, sw: 22 });
    c.fillStyle = "#e09a22"; c.fillRect(-4, -340 + br, 8, 220); c.fillStyle = "#fff6"; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(16, -300 + i * 60 + br, 6, 0, 7); c.fill(); }
    c.save(); c.translate(0, br);
    kshape(c, ell(6, -430, 80, 78, 0), C.skin, { rim: "rgba(255,240,225,.8)", shadow: "rgba(150,60,40,.22)", rw: 6, sw: 18 });
    c.fillStyle = "rgba(240,120,110,.35)"; c.beginPath(); c.ellipse(60, -400, 16, 10, 0, 0, 7); c.fill();
    kshape(c, (c) => { c.beginPath(); c.moveTo(-76, -440); c.bezierCurveTo(-80, -530, 90, -530, 86, -440); c.closePath(); }, C.hat, { rim: "rgba(255,200,200,.6)", rw: 5, sw: 12 });
    c.fillStyle = "#c23238"; c.beginPath(); c.roundRect(-80, -456, 168, 26, 13); c.fill();
    kshape(c, ell(4, -522, 20, 20, 0), "#fff1e8", { rw: 3, sw: 6 });
    fig.eye(c, 28, -418, 15, { t, seed: 3, look: o.look ?? .5 }); fig.eye(c, 66, -418, 15, { t, seed: 3, look: o.look ?? .5 });
    c.strokeStyle = "#7a2a2a"; c.lineWidth = 6; c.lineCap = "round"; c.fillStyle = "#7a2a2a";
    if (o.mouth === "o") { c.beginPath(); c.ellipse(52, -378, 10, 13, 0, 0, 7); c.fill(); }
    else if (o.mouth === "grin") { c.beginPath(); c.moveTo(30, -384); c.quadraticCurveTo(52, -350, 76, -386); c.closePath(); c.fill(); c.fillStyle = "#fff"; c.fillRect(36, -384, 34, 7); }
    else if (o.mouth === "hmm") { c.beginPath(); c.moveTo(36, -378); c.lineTo(70, -384); c.stroke(); }
    else { c.beginPath(); c.arc(52, -392, 20, .3, 2.8); c.stroke(); }
    c.restore();
    const sx = 30, sy = -330 + br; let hx, hy;
    if (arm >= 1.5) { const k = arm - 1.5; hx = lerp(80, -70, clamp(k * 2, 0, 1)); hy = lerp(-200, -470, clamp(k * 2, 0, 1)) + Math.sin(t * 14) * 6 * clamp(k * 2, 0, 1); }
    else { const a = lerp(1.35, -.6, clamp(arm, 0, 1)); hx = sx + Math.cos(a) * 150; hy = sy + Math.sin(a) * 150; }
    if (o.hold === "spade" || o.hold === "fork") { hx = 120; hy = -230 + (o.dig || 0) * 40 + br; }
    if (o.hold === "spade" || o.hold === "fork") tool(c, o.hold, hx, hy, o.dig || 0);
    c.strokeStyle = C.coat; c.lineWidth = 30; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2 + 20, (sy + hy) / 2 + 20, hx, hy); c.stroke();
    c.fillStyle = C.skin; c.beginPath(); c.arc(hx, hy, 20, 0, 7); c.fill();
    c.restore(); return { hx, hy }; }
  function at(fn, x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); const r = fn(g, o); g.restore(); return r; }

  // ================= Shots =================
  // Hook: Nahaufnahme im Boden, Spaten kommt von oben, Wurm erschrickt; Ende = Loop-Bild
  function hookShot(lt, d, t, loop) { const k = sm(lt / d); garden(t, lerp(-10, 10, k), 150, loop ? lerp(1.55, 1.7, k) : lerp(1.7, 1.85, k));
    const fall = loop ? .2 : sm(lt / (d * .45));
    // Spatenblatt von oben
    const by = lerp(-260, -60, fall) + Math.sin(t * 9) * 4 * (1 - fall);
    g.strokeStyle = C.wood; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(20, by - 600); g.lineTo(20, by); g.stroke();
    kshape(g, (c) => { c.beginPath(); c.moveTo(-36, by); c.lineTo(76, by); c.lineTo(72, by + 110); c.quadraticCurveTo(20, by + 134, -32, by + 110); c.closePath(); }, C.metal, { rim: "rgba(255,255,255,.85)", shadow: "rgba(40,40,80,.35)", rw: 6, sw: 14 });
    wormAt(-50, 210, 1, { t, len: 470, w: 26, amp: 14 + fall * 10, sp: 3 + fall * 4 });
    const s = g.getTransform(); g.setTransform(1, 0, 0, 1, 0, 0); shock(s.e - 40 * s.a, s.f + 210 * s.d, fall, t);
    if (!loop && lt > d * .55) stamp("MYTH", W * .44, H * .6, (lt - d * .55) / .3, "#e5484d"); }
  KZ.shot("wHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("wLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .45) { garden(t, lerp(-60, -20, k), -120, 1.05); at(rudi, -200, 0, .9, { t, hold: "spade", dig: Math.max(0, Math.sin(t * 4)), mouth: "smile", look: .3 }); wormAt(160, 170, .7, { t, len: 420, w: 26 }); }
    else hookShot(lt - d * .45, d * .55, t, true); });

  KZ.shot("wRudi", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-80, -30, k), lerp(-130, -110, k), lerp(1.0, 1.1, k));
    const dig = Math.max(0, Math.sin(lt * 4.5)); at(rudi, -220, 0, .9, { t, hold: "spade", dig, mouth: lt > d * .6 ? "o" : "smile", look: .2 });
    wormAt(110, 150, .9, { t, len: 420, w: 26, amp: 16, sp: 5 });
    if (lt > d * .6) stamp("OOPS", W * .52, H * .2, (lt - d * .6) / .3, "#e5484d", .07);
    // Erinnerung: Kinderzeit-Rahmen
    const a = sm(lt / .4) * (1 - sm((lt - d * .55) / .3)); txt("AS A KID...", W * .4, H * .14, 54, "#ffd84d", { a, stroke: 8, w: 900 }); });

  KZ.shot("wTwo", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-60, -20, k), lerp(-100, -80, k), lerp(1.1, 1.2, k));
    at(rudi, -240, 0, .9, { t, arm: .45, mouth: "grin", look: .2 });
    const sp = sm(lt / .6) * 70, pts = spine({ t, len: 440, amp: 16, sp: 6 });
    g.save(); g.translate(150, 170); g.scale(.9, .9);
    g.save(); g.translate(-sp, 0); worm(g, { pts, w: 26, u0: 0, u1: .5 }); g.restore();
    g.save(); g.translate(sp, 0); worm(g, { pts, w: 26, u0: .5, u1: 1 }); g.restore(); g.restore();
    const a = sm((lt - .3) / .3); txt("1", W * .35, H * .16, 120, "#fff", { a, stroke: 12, w: 900 }); txt("→", W * .47, H * .16, 100, "#ffd84d", { a: sm((lt - .6) / .3), stroke: 10, w: 900 }); txt("2", W * .59, H * .16, 120, "#7ef0b0", { a: sm((lt - .9) / .3), stroke: 12, w: 900 });
    for (let i = 0; i < 3; i++) sparkle(W * (.22 + i * .2), H * .25 + Math.sin(t * 3 + i) * 8, 20, sm((lt - .9) / .3) * (1 - sm((lt - d * .7) / .2)));
    if (lt > d * .7) txt("?", W * .7, H * .27, 130, "#ffd84d", { a: sm((lt - d * .7) / .25), stroke: 12, w: 900 }); });

  // große Infografik-Wurm-Ansicht (Bildschirm)
  function bigWorm(t, lt, o) { o = o || {}; g.setTransform(1, 0, 0, 1, 0, 0); const z = o.z || 1; g.save(); g.translate(o.x ?? W * .44, o.y ?? H * .36); g.scale(z, z); const pts = worm(g, Object.assign({ t, len: 720, w: 40, amp: 16, k: 1, sp: 1.6 }, o.w)); g.restore(); return pts; }
  function arrowTxt(s, x, y, dir, a, col) { txt(s, x, y, 52, col || "#fff", { a, stroke: 8, w: 900 }); }
  KZ.shot("wAnatomy", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.06, sm(lt / d)));
    bigWorm(t, lt, { y: H * .38, w: { w: 48 } });
    const a2 = sm((lt - .45) / .3), a1 = sm((lt - 1.25) / .3);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a2; g.strokeStyle = "#7ef0b0"; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.moveTo(W * .7, H * .27); g.lineTo(W * .76, H * .33); g.stroke(); g.restore();
    txt("FRONT", W * .68, H * .23, 60, "#7ef0b0", { a: a2, stroke: 9, w: 900 }); txt("BACK", W * .2, H * .23, 60, "#ff9fae", { a: a1, stroke: 9, w: 900 });
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a1; g.strokeStyle = "#ff9fae"; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.moveTo(W * .2, H * .27); g.lineTo(W * .14, H * .33); g.stroke(); g.restore();
    txt("NOT THE SAME", W * .44, H * .52, 56, "#ffd84d", { a: sm((lt - d * .55) / .3), stroke: 8, w: 900 }); });

  KZ.shot("wSaddle", (lt, d, t) => { navy(t); const z = lerp(1.5, 1.75, sm(lt / d));
    // Zoom auf den Gürtel (u ~ .67 von 720 -> x ~ +122)
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W * .44 - 122 * z * .9, H * .38); g.scale(z * .9, z * .9); const pts = worm(g, { t, len: 720, w: 40, amp: 12, k: 1, sp: 1.6 });
    const [sx, sy] = pts[Math.round(.675 * (N - 1))]; g.restore();
    const px = W * .44 - 122 * z * .9 + sx * z * .9, py = H * .38 + sy * z * .9, p = sm((lt - .2) / .4);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter"; glow(px, py, 200 * p + 1, "rgba(255,190,120,.4)"); g.restore();
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = p; g.strokeStyle = "#ffd84d"; g.lineWidth = 9; g.setLineDash([22, 16]); g.lineDashOffset = -t * 40; g.beginPath(); g.ellipse(px, py, 120, 105, 0, 0, 7); g.stroke(); g.restore();
    if (lt > d * .3) stamp("SADDLE", W * .4, H * .17, (lt - d * .3) / .3, "#f2b233", -.06);
    txt("HEAD THIS WAY →", W * .48, H * .56, 50, "#7ef0b0", { a: sm((lt - d * .55) / .3), stroke: 8, w: 900 }); });

  KZ.shot("wOrgans", (lt, d, t) => { navy(t, 1); const z = lerp(1.55, 1.65, sm(lt / d));
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W * .1, H * .38); g.scale(z, z); const pts = worm(g, { t, len: 720, w: 46, amp: 8, k: .8, sp: 1.2 });
    // Organe im Vorderteil (u .78 .. 1)
    const P = (u) => pts[Math.round(u * (N - 1))];
    const m = P(1), b = P(.955); const a0 = sm((lt - .2) / .3), a1 = sm((lt - .7) / .3);
    g.save(); g.globalAlpha = a0; g.fillStyle = "#3a0f24"; g.beginPath(); g.arc(m[0] + 34, m[1] + 4, 11, 0, 7); g.fill(); g.restore();
    g.save(); g.globalAlpha = a1; g.globalCompositeOperation = "lighter"; glow(b[0], b[1] - 8, 50, "rgba(255,240,150,.6)"); g.restore();
    g.save(); g.globalAlpha = a1; g.fillStyle = "#ffe08a"; g.beginPath(); g.ellipse(b[0], b[1] - 8, 16, 11, 0, 0, 7); g.fill(); g.restore();
    for (let i = 0; i < 5; i++) { const q = easeBack(clamp((lt - 1.2 - i * .28) / .3, 0, 1)); if (q <= 0) continue; const hp = P(.755 + i * .035), beat = 1 + Math.sin(t * 9 + i) * .12;
      g.save(); g.globalCompositeOperation = "lighter"; glow(hp[0], hp[1], 50 * q, "rgba(255,80,120,.55)"); g.restore(); heart(g, hp[0], hp[1] + 2, 1.15 * q * beat, "#ff3d6a"); }
    g.restore();
    label("MOUTH", W * .7, H * .29, a0); label("BRAIN", W * .58, H * .22, a1);
    const nh = Math.max(0, Math.min(5, Math.floor((lt - 1.2) / .28) + 1)); txt(nh + (nh === 1 ? " HEART" : " HEARTS"), W * .44, H * .52, 76, "#ff7a9a", { a: sm((lt - 1.2) / .3), stroke: 10, w: 900 }); });

  KZ.shot("wCut", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const cutT = .55, sp = sm((lt - cutT) / .5) * 70, pts = spine({ t, len: 720, amp: 10, k: 1, sp: 1.6 });
    g.save(); g.translate(W * .44, H * .36);
    if (lt < cutT) worm(g, { pts, w: 40 });
    else { g.save(); g.translate(-sp, 18); worm(g, { pts, w: 40, u1: .5 }); g.restore(); g.save(); g.translate(sp, -6); worm(g, { pts, w: 40, u0: .5 }); g.restore(); }
    g.restore();
    // Klinge
    const by = lerp(H * .12, H * .44, sm(lt / cutT)), fa = 1 - sm((lt - cutT - .2) / .3);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = fa; kshape(g, (c) => { c.beginPath(); c.moveTo(W * .44 - 10, by - 240); c.lineTo(W * .44 + 12, by - 240); c.lineTo(W * .44 + 6, by); c.lineTo(W * .44 - 4, by + 20); c.closePath(); }, C.metal, { rim: "rgba(255,255,255,.9)", rw: 4, sw: 6 }); g.restore();
    if (lt > cutT) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter"; glow(W * .44, H * .36, 220 * (1 - sm((lt - cutT) / .4)), "rgba(255,255,255,.6)"); g.restore(); }
    // Schwanzhälfte braucht Kopf -> nein
    const a = sm((lt - d * .45) / .3); txt("TAIL HALF", W * .2, H * .25, 46, "#ff9fae", { a, stroke: 8, w: 900 }); txt("NEW HEAD?", W * .2, H * .48, 50, "#fff", { a: sm((lt - d * .55) / .3), stroke: 8, w: 900 });
    cross(W * .44 - 40, H * .48, .8, (lt - d * .7) / .3); });

  KZ.shot("wTail", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-20, 10, k), 220, lerp(1.6, 1.75, k), { tunnels: [[-700, 60, -300, 300, 200, 240]] });
    const life = 1 - sm((lt - d * .25) / (d * .7)), tt = t * (.2 + life);
    g.save(); g.translate(0, 230); worm(g, { pts: spine({ t: tt, len: 460, amp: 4 + life * 18, sp: 2 + life * 6 }), w: 26, u1: .5, grey: life < .35, alpha: .55 + life * .45 }); g.restore();
    // Energie-Akku links oben
    g.setTransform(1, 0, 0, 1, 0, 0); const bx = W * .12, by = H * .12, bw = 220, bh = 96;
    g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.roundRect(bx, by, bw, bh, 18); g.fill(); g.fillRect(bx + bw, by + 30, 16, 36);
    g.fillStyle = "#232a6b"; g.beginPath(); g.roundRect(bx + 10, by + 10, bw - 20, bh - 20, 12); g.fill();
    g.fillStyle = life > .5 ? "#7ef0b0" : life > .25 ? "#f2b233" : "#e5484d"; g.beginPath(); g.roundRect(bx + 16, by + 16, Math.max(8, (bw - 32) * life), bh - 32, 8); g.fill();
    txt("TAIL END", bx + bw / 2, by + bh + 50, 44, "#fff", { stroke: 7, w: 900 });
    if (lt > d * .72) stamp("NO MOUTH", W * .5, H * .58, (lt - d * .72) / .25, "#e5484d", .06); });

  KZ.shot("wHead", (lt, d, t) => { navy(t, 1); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const pts = spine({ t, len: 720, amp: 12, k: 1, sp: 1.6 }), g0 = sm((lt - d * .45) / (d * .5));
    // Schnitt hinter dem Gürtel bei u=.5; Geisterumriss des alten Schwanzes
    g.save(); g.translate(W * .48, H * .36);
    g.save(); g.setLineDash([18, 14]); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 6; g.lineCap = "round"; poly(g, pts, 0, Math.round(.5 * (N - 1)), 0, 0); g.restore();
    const iC = Math.round(.5 * (N - 1)), iR = Math.round(lerp(.5, .3, g0) * (N - 1));
    const regrow = g0 > .02 ? pts.slice(iR, iC + 1) : null;
    worm(g, { pts, w: 40, u0: .5, regrowPts: regrow });
    if (regrow) { g.save(); g.globalCompositeOperation = "lighter"; const [x, y] = pts[iR]; glow(x, y, 46, "rgba(120,255,190,.22)"); g.restore(); }
    // Schnittmarke
    const [cx, cy] = pts[iC]; g.strokeStyle = "#ffd84d"; g.lineWidth = 7; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(cx, cy - 110); g.lineTo(cx, cy + 110); g.stroke(); g.setLineDash([]);
    g.restore();
    txt("HEAD HALF", W * .62, H * .23, 50, "#7ef0b0", { a: sm(lt / .3), stroke: 8, w: 900 });
    txt("CUT BEHIND SADDLE", W * .44, H * .5, 46, "#ffd84d", { a: sm((lt - .4) / .3), stroke: 8, w: 900 });
    check(W * .82, H * .5 - 90, .55, (lt - d * .5) / .3);
    if (lt > d * .5) txt("MIGHT SURVIVE", W * .44, H * .57, 54, "#fff", { a: sm((lt - d * .5) / .3), stroke: 8, w: 900 }); });

  KZ.shot("wStunt", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const y1 = H * .22, y2 = H * .44, x0 = W * .1;
    txt("BEFORE", x0, y1 - 100, 48, "#c9d3e6", { align: "left", w: 900, a: sm(lt / .3) }); txt("AFTER", x0, y2 - 100, 48, "#ffd84d", { align: "left", w: 900, a: sm((lt - .4) / .3) });
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W * .44, y1); g.scale(.95, .95); worm(g, { t, len: 720, w: 34, amp: 8, k: 1, sp: 1.6 }); g.restore();
    const p = sm((lt - .5) / (d * .5)), pts = spine({ t: t + 1, len: 720, amp: 8, k: 1, sp: 1.6 }), iC = Math.round(.5 * (N - 1)), iR = Math.round(lerp(.5, .38, p) * (N - 1));
    g.save(); g.translate(W * .44, y2); g.scale(.95, .95); worm(g, { pts, w: 34, u0: .5, regrowPts: pts.slice(iR, iC + 1) }); g.restore();
    // Längen-Lineal
    g.fillStyle = "rgba(255,255,255,.18)"; g.beginPath(); g.roundRect(W * .1, H * .54, W * .7, 16, 8); g.fill();
    g.fillStyle = "#ff9fae"; g.beginPath(); g.roundRect(W * .1, H * .54, W * .7 * lerp(.5, .62, p), 16, 8); g.fill();
    if (lt > d * .6) stamp("STUNTED", W * .3, H * .33, (lt - d * .6) / .3, "#7b5cff", -.06); });

  KZ.shot("wQuote", (lt, d, t) => { navy(t, 1); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .34); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -290, 780, 600, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -300, 780, 600, 34); g.fill();
    g.fillStyle = "#232a6b"; g.beginPath(); g.roundRect(-390, -300, 780, 120, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 48px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("LIVE SCIENCE", 0, -240);
    g.fillStyle = "#e5484d"; g.font = '900 140px "Montserrat"'; g.fillText("“", -310, -110);
    const lines = ["If an earthworm is", "split in two, it will", "not become two", "new worms."]; g.font = '800 54px "Montserrat"'; g.fillStyle = "#1b1d3a";
    lines.forEach((l, i) => { const a = sm((lt - .4 - i * .3) / .3); g.globalAlpha = a; g.fillText(l, 0, -100 + i * 72); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 34px "Montserrat"'; g.fillText("Live Science, 2013", 0, 230); g.restore();
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W * .44, H * .6); g.scale(.55, .55); worm(g, { t, len: 600, w: 30, amp: 12 }); g.restore(); });

  KZ.shot("wGold", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-60, 40, k), 260, lerp(.95, 1.05, k), { tunnels: [[-800, 30, -500, 500, -60, 420], [-200, 20, 200, 300, 600, 520], [400, 20, 700, 260, 1000, 600]] });
    // Würmer graben, Blätter werden nach unten gezogen
    wormAt(-420, 360, .7, { t, len: 420, w: 26, amp: 14 }, .5); wormAt(240, 300, .7, { t: t + 2, len: 420, w: 26, amp: 14 }, -.3); wormAt(-60, 560, .7, { t: t + 4, len: 420, w: 26, amp: 14, flip: true }, .1);
    for (let i = 0; i < 4; i++) { const q = ((lt * .3 + i * .25) % 1); g.save(); g.translate(-500 + i * 300, lerp(-10, 200, q)); g.rotate(q * 3 + i); g.fillStyle = ["#e8742c", "#f2b233", "#d9472f", "#e8742c"][i]; g.beginPath(); g.moveTo(-26, 0); g.quadraticCurveTo(0, -18, 26, 0); g.quadraticCurveTo(0, 18, -26, 0); g.fill(); g.restore(); }
    const words = [["DIG", "#7ef0b0"], ["MIX", "#ffd84d"], ["FEED", "#ff9fae"]];
    words.forEach(([w, col], i) => { const a = sm((lt - .3 - i * .45) / .3); if (a > 0) label(w, W * (.2 + i * .25), H * .14, a); });
    if (lt > d * .65) stamp("GARDEN GOLD", W * .44, H * .26, (lt - d * .65) / .3, "#f2b233", .05);
    for (let i = 0; i < 4; i++) sparkle(W * (.15 + i * .2), H * (.36 + (i % 2) * .05) + Math.sin(t * 3 + i) * 8, 18, sm((lt - d * .65) / .3)); });

  KZ.shot("wAsk", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-60, -100, k), -260, lerp(1.25, 1.4, k));
    at(rudi, -160, 0, .95, { t, arm: 1.5 + .5 * sm(lt / .5), mouth: "o", look: .3 });
    const a = easeBack(clamp((lt - .1) / .4, 0, 1)); txt("?", W * .66, H * .28, 220 * a + 1, "#ffd84d", { stroke: 14, w: 900 });
    if (lt > d * .3) stamp("WHAT NOW?", W * .44, H * .12, (lt - d * .3) / .3, "#7b5cff", -.05); });

  KZ.shot("wFork", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-60, -20, k), lerp(-90, -70, k), lerp(1.05, 1.15, k));
    const dig = .5 + Math.sin(lt * 2) * .5; at(rudi, -220, 0, .9, { t, hold: "fork", dig, mouth: "smile", look: .2 });
    // Wurm schlüpft zwischen den Zinken durch
    wormAt(40 + lt * 30, 200, .7, { t, len: 420, w: 26, amp: 10, sp: 2 });
    // Spaten durchgestrichen oben
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W * .18, H * .15); g.rotate(.3); g.globalAlpha = sm(lt / .3);
    kshape(g, (c) => { c.beginPath(); c.moveTo(-36, 0); c.lineTo(36, 0); c.lineTo(32, 80); c.quadraticCurveTo(0, 96, -32, 80); c.closePath(); }, C.metal, { rw: 4, sw: 8 }); g.fillStyle = C.wood; g.fillRect(-7, -120, 14, 120); g.restore();
    cross(W * .18, H * .17, .8, (lt - .3) / .3);
    label("SLOWLY", W * .5, H * .13, sm((lt - .8) / .3));
    if (lt > d * .5) stamp("WORM SAFE", W * .46, H * .25, (lt - d * .5) / .3, "#2fae6a", -.06); });

  KZ.shot("wBack", (lt, d, t) => { const k = sm(lt / d); garden(t, lerp(-20, 0, k), lerp(-40, -20, k), lerp(1.7, 1.85, k), { wet: 1 });
    // Schatten-Bereich (Busch) + Tropfen
    for (let i = 0; i < 8; i++) { const q = (lt * .7 + i / 8) % 1; g.fillStyle = "rgba(150,210,255,.7)"; g.beginPath(); g.ellipse(-260 + i * 70, 20 + q * 60, 6, 9, 0, 0, 7); g.fill(); }
    // Hand (Regenjackenärmel) legt Wurm ab
    const p = sm(lt / (d * .55)), hx = lerp(-380, -40, p), hy = lerp(-420, -70, p);
    const wpts = spine({ t, len: 300, amp: 8 + (1 - p) * 10, sp: 3, bend: (1 - p) * .9 });
    g.save(); g.translate(hx + 60, hy + 50 + (1 - p) * 30); g.rotate((1 - p) * .9); g.scale(.8, .8); worm(g, { pts: wpts, w: 24 }); g.restore();
    if (p < 1 || lt < d * .65) { g.save(); g.translate(hx, hy); g.rotate(-.5);
      g.strokeStyle = C.coat; g.lineWidth = 70; g.lineCap = "round"; g.beginPath(); g.moveTo(-300, -260); g.lineTo(-40, -30); g.stroke();
      kshape(g, ell(10, 0, 62, 48, .3), C.skin, { rim: "rgba(255,240,225,.8)", rw: 5, sw: 12 }); g.fillStyle = C.skin; g.beginPath(); g.ellipse(60, 26, 34, 16, .5, 0, 7); g.fill(); g.restore(); }
    label("DAMP SOIL", W * .3, H * .12, sm((lt - .5) / .3)); label("SHADE", W * .62, H * .12, sm((lt - .9) / .3));
    if (lt > d * .62) stamp("HERO", W * .44, H * .26, (lt - d * .62) / .3, "#2fae6a", .06); });
})();
