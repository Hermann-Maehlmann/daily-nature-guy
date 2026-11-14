// Szenendatei "That Moth Didn't Eat Your Sweater" (Kleidermotte Tineola bisselliella, Mix-Stil, Hermann 12.11.2026).
// Quellen: Natural History Museum London, Clothes moths identification guide ("Adults do not feed ... and cause no damage to fabrics", Larve bis 13 mm,
// 1 Monat bis 2 Jahre Larvenzeit, -20 °C eine Woche einfrieren, luftdicht lagern), Rutgers Extension (Adulte 16-28 Tage), NC State Extension
// (Motten an Lampen meist keine Kleidermotten, meiden Licht; Keratin, Baumwolle/reine Synthetik nicht), English Heritage (Kleidung sauber einlagern).
// Helfer txt/stamp/navy/rudi/at aus cat-purr übernommen (Rudi bleibt gleich). Motte, Larve, Pullover, Schrank neu gezeichnet.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86" };
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
  function rudi(c, o) { const t = o.t || 0, br = Math.sin(t * 2.2) * 4, arm = o.arm ?? 0;
    c.save(); if (!o.armOnly) {
    const step = o.walk ? Math.sin(t * (o.slow ? 4 : 8)) * 18 : 0;
    if (o.sit) { c.strokeStyle = C.jeans; c.lineWidth = 30; c.lineCap = "round"; c.lineJoin = "round"; for (const x of [-20, 20]) { c.beginPath(); c.moveTo(x, -130); c.lineTo(x + 140, -122); c.lineTo(x + 146, -122 + o.sit - 16); c.stroke(); }
      c.fillStyle = "#2a2233"; for (const x of [-20, 20]) { c.beginPath(); c.ellipse(x + 162, -8 - 122 + o.sit, 30, 13, 0, 0, 7); c.fill(); } } else {
    c.strokeStyle = C.jeans; c.lineWidth = 30; c.lineCap = "round"; for (const [x, s] of [[-26, 1], [26, -1]]) { c.beginPath(); c.moveTo(x, -130); c.lineTo(x + 4 + step * s, -16); c.stroke(); }
    c.fillStyle = "#2a2233"; for (const [x, s] of [[-26, 1], [26, -1]]) { c.beginPath(); c.ellipse(x + 16 + step * s, -8, 30, 13, 0, 0, 7); c.fill(); } }
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
    }
    const sx = 30, sy = -330 + br; let hx, hy;
    if (arm >= 1.5) { const k = arm - 1.5; hx = lerp(80, -70, clamp(k * 2, 0, 1)); hy = lerp(-200, -470, clamp(k * 2, 0, 1)) + Math.sin(t * 14) * 6 * clamp(k * 2, 0, 1); }
    else { const a = lerp(1.35, -1.3, clamp(arm, 0, 1)); hx = sx + Math.cos(a) * 150; hy = sy + Math.sin(a) * 150; }
    if (o.hand) { hx = o.hand[0]; hy = o.hand[1]; }
    c.strokeStyle = C.coat; c.lineWidth = 30; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2 + 20, (sy + hy) / 2 + 20, hx, hy); c.stroke();
    c.fillStyle = C.skin; c.beginPath(); c.arc(hx, hy, 20, 0, 7); c.fill();
    c.restore(); return { hx, hy }; }
  function at(fn, x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); const r = fn(g, o); g.restore(); return r; }

  function qmark(x, y, s, a) { if (a <= 0) return; txt("?", x, y, 110 * s, "#fff", { a, stroke: 14, w: 900 }); }
  function bubble(s, x, y, a, r) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(r || 0); g.scale(easeBack(Math.min(a, 1)), easeBack(Math.min(a, 1)));
    g.font = '800 50px "Montserrat"'; const w = g.measureText(s).width + 64; g.fillStyle = "#fff"; g.beginPath(); g.roundRect(-w / 2, -50, w, 100, 50); g.fill(); g.beginPath(); g.moveTo(-24, 42); g.lineTo(-44, 84); g.lineTo(8, 46); g.fill();
    g.fillStyle = "#1b1d3a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 0, 2); g.restore(); }


  // ================= Farben =================
  const K = { wallD: "#261e56", lamp: "#ffd68a" };
  const M = { wing: "#d9a441", wingD: "#b07f26", head: "#e6b552", tuft: "#e0662e", fringe: "rgba(240,205,130,.85)", leg: "#c8953a", ant: "#b8862e" };
  const L = { body: "#f6ecd2", line: "rgba(170,140,90,.45)", head: "#9a5a2a", headD: "#6a3a18" };
  const S = { red: "#e8505b", redD: "#b83444", teal: "#2bb3a3", tealD: "#1d8579", must: "#f2b233", mustD: "#c98a1e", hole: "#1c1230" };

  // ================= Kleidermotte (seitlich, Kopf rechts, sitzt auf y=0, Länge ~400) =================
  // o: t, fly (0..1 Flattern), walk, look, mood, mouth ("tiny"|"o"|"smile"), seed
  function moth(c, o) { const t = o.t || 0, br = Math.sin(t * 2.6 + (o.seed || 0)) * 3, fly = o.fly || 0;
    const flap = fly * (.35 + .65 * (.5 + .5 * Math.sin(t * 34 + (o.seed || 0))));
    c.save(); c.lineCap = "round"; c.lineJoin = "round";
    // Beine (3 sichtbare)
    if (fly < .5) { c.strokeStyle = M.leg; c.lineWidth = 8; [70, 20, -30].forEach((x, i) => { const st = o.walk ? Math.sin(t * 16 + i * 2.1) * 14 : 0;
      c.beginPath(); c.moveTo(x, -46); c.lineTo(x + 22 + st * .5, -26); c.lineTo(x + 34 + st, 0); c.stroke(); }); }
    else { c.strokeStyle = M.leg; c.lineWidth = 7; [70, 20, -30].forEach((x) => { c.beginPath(); c.moveTo(x, -46); c.lineTo(x + 10, -20); c.lineTo(x - 6, -4); c.stroke(); }); }
    // Hinterleib (unter den Flügeln, nur hinten sichtbar)
    kshape(c, ell(-60, -46, 120, 24, 0), M.wingD, { rw: 3, sw: 6 });
    const wingPath = (c) => { c.beginPath(); c.moveTo(100, -66); c.bezierCurveTo(50, -150 + br, -110, -150 + br, -262, -74); c.quadraticCurveTo(-200, -48, -150, -46); c.bezierCurveTo(-60, -42, 40, -40, 100, -66); c.closePath(); };
    const fringe = (c) => { c.strokeStyle = M.fringe; c.lineWidth = 4; for (let i = 0; i < 16; i++) { const a = 2.6 + i * .085, x0 = -236, y0 = -70; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + Math.cos(a) * 66, y0 + Math.sin(a) * 66 + Math.sin(t * 5 + i) * 2); c.stroke(); }
 };
    // hinterer Flügel (nur beim Fliegen sichtbar)
    if (fly > 0) { c.save(); c.translate(96, -76); c.rotate(-flap * 1.35); c.translate(-96, 76); c.globalAlpha = .85; fringe(c); kshape(c, wingPath, M.wingD, { rw: 3, sw: 6 }); c.restore(); }
    // Flügel (dachförmig gefaltet, golden, Fransen hinten)
    c.save(); if (fly > 0) { c.translate(96, -76); c.rotate(-flap * 1.05); c.translate(-96, 76); }
    fringe(c);
    kshape(c, wingPath, M.wing, { rim: "rgba(255,240,180,.9)", shadow: "rgba(110,70,10,.3)", rw: 6, sw: 14 });
    c.strokeStyle = "rgba(140,90,20,.45)"; c.lineWidth = 6; c.beginPath(); c.moveTo(92, -60); c.bezierCurveTo(30, -48, -120, -52, -240, -72); c.stroke();
    c.strokeStyle = "rgba(255,236,170,.55)"; c.lineWidth = 5; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(70 - i * 6, -76 - i * 14); c.quadraticCurveTo(-60, -118 - i * 10 + br, -196 + i * 14, -80 - i * 6); c.stroke(); }
    c.restore();
    // Kopf
    kshape(c, ell(118, -74, 46, 42, 0), M.head, { rim: "rgba(255,240,190,.9)", shadow: "rgba(110,70,10,.3)", rw: 5, sw: 10 });
    // roter Haarschopf (typisch für Tineola)
    c.strokeStyle = M.tuft; c.lineWidth = 10; for (let i = 0; i < 7; i++) { const x = 92 + i * 9, a = -1.9 + i * .14 + Math.sin(t * 4 + i) * .06; c.beginPath(); c.moveTo(x, -104); c.lineTo(x + Math.cos(a) * 46, -104 + Math.sin(a) * 46); c.stroke(); }
    // Fühler
    c.strokeStyle = M.ant; c.lineWidth = 6; for (let k = 0; k < 2; k++) { const w = Math.sin(t * 3 + k * 1.7) * 14; c.beginPath(); c.moveTo(134 - k * 10, -108); c.quadraticCurveTo(200 - k * 20, -210 - k * 10, 290 - k * 34 + w, -186 - k * 20 + w * .5); c.stroke(); }
    // Auge + Mund
    fig.eye(c, 142, -80, 21, { t, seed: (o.seed || 0) + 2, look: o.look ?? .5, mood: o.mood });
    c.strokeStyle = "#6a3a10"; c.fillStyle = "#6a3a10"; c.lineWidth = 4;
    if (o.mouth === "o") { c.beginPath(); c.ellipse(154, -46, 6, 8, 0, 0, 7); c.fill(); }
    else if (o.mouth === "tiny") { c.beginPath(); c.arc(156, -48, 3, 0, 7); c.fill(); }
    else { c.beginPath(); c.arc(150, -54, 9, .4, 2.6); c.stroke(); }
    c.restore(); }
  function mothAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); moth(g, o); g.restore(); }
  // andere Nachtfalter (Lampe): breite dreieckige Flügel, grau-braun, von oben
  function otherMoth(x, y, s, t, seed) { const f = Math.sin(t * 30 + seed) * .5 + .5; g.save(); g.translate(x, y); g.rotate(Math.sin(t * 2 + seed) * .4); g.scale(s, s);
    for (const sd of [-1, 1]) { g.save(); g.scale(sd * lerp(1, .35, f), 1); kshape(g, (c) => { c.beginPath(); c.moveTo(4, -10); c.quadraticCurveTo(70, -60, 96, -6); c.quadraticCurveTo(70, 30, 6, 16); c.closePath(); }, "#cdb89c", { rim: "rgba(255,245,225,.8)", rw: 3, sw: 5 }); g.fillStyle = "rgba(110,80,50,.5)"; g.beginPath(); g.arc(sd * 50, -14, 9, 0, 7); g.fill(); g.restore(); }
    kshape(g, ell(0, 0, 11, 32, 0), "#7a6650", { rw: 2, sw: 3 }); g.strokeStyle = "#7a6650"; g.lineWidth = 3; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(0, -28); g.quadraticCurveTo(sd * 14, -56, sd * 26, -62); g.stroke(); } g.restore(); }

  // ================= Larve (weiße Raupe, brauner Kopf, keine Augen; seitlich, Kopf rechts, y=0 Boden, Länge ~300) =================
  function larva(c, o) { const t = o.t || 0, N = 9, crawl = o.crawl ?? 1, ch = Math.max(0, Math.sin(t * 12));
    c.save();
    const seg = (i) => ({ x: -150 + i * 31, y: -30 - Math.max(0, Math.sin(t * 5 - i * .7)) * 10 * crawl });
    // Bauchfüße hinten
    c.fillStyle = "#e7d7b4"; for (let i = 1; i < 6; i++) { const p = seg(i); c.beginPath(); c.ellipse(p.x, -4, 9, 6, 0, 0, 7); c.fill(); }
    // Brustbeine vorn
    c.strokeStyle = L.headD; c.lineWidth = 6; c.lineCap = "round"; for (let i = 6; i < 9; i++) { const p = seg(i); c.beginPath(); c.moveTo(p.x, p.y + 20); c.lineTo(p.x + 6 + Math.sin(t * 10 + i) * 4, -2); c.stroke(); }
    for (let i = 0; i < N; i++) { const p = seg(i), r = i === 0 ? 22 : 30 - Math.max(0, i - 6) * 1.5; kshape(c, ell(p.x, p.y, r * .95, r, 0), L.body, { rim: "rgba(255,255,255,.95)", shadow: "rgba(150,110,60,.28)", rw: 4, sw: 8 }); }
    c.strokeStyle = L.line; c.lineWidth = 3; for (let i = 1; i < N; i++) { const p = seg(i); c.beginPath(); c.moveTo(p.x - 14, p.y - 24); c.quadraticCurveTo(p.x - 20, p.y, p.x - 14, p.y + 24); c.stroke(); }
    // Kopfkapsel
    const hp = seg(N - 1); c.save(); c.translate(hp.x + 34, hp.y + 2);
    kshape(c, ell(0, 0, 28, 26, 0), L.head, { rim: "rgba(255,200,150,.7)", shadow: "rgba(60,20,0,.3)", rw: 3, sw: 6 });
    c.fillStyle = L.headD; c.beginPath(); c.moveTo(18, 6); c.lineTo(34, 12 - ch * 8); c.lineTo(22, 16); c.closePath(); c.fill(); c.beginPath(); c.moveTo(18, 14); c.lineTo(34, 18 + ch * 8); c.lineTo(20, 22); c.closePath(); c.fill();
    c.restore();
    // Seidengespinst (Röhre)
    if (o.tube) { c.strokeStyle = `rgba(255,255,255,${.35 * o.tube})`; c.lineWidth = 3; for (let i = 0; i < 14; i++) { const x = -170 + i * 24; c.beginPath(); c.moveTo(x, -76); c.quadraticCurveTo(x + 30, -40, x + 4, 4); c.stroke(); c.beginPath(); c.moveTo(x + 20, -78); c.quadraticCurveTo(x - 10, -40, x + 26, 2); c.stroke(); }
      c.beginPath(); c.moveTo(-180, -78); c.quadraticCurveTo(0, -92, 190, -74); c.stroke(); }
    c.restore(); }
  function larvaAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); larva(g, o); g.restore(); }

  // ================= Pullover (von vorn, Mitte 0,0, Breite ~600) =================
  function holeShape(c, x, y, r, seed) { c.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283, rr = r * (.75 + .3 * Math.sin(i * 2.7 + seed)); c.lineTo(x + Math.cos(a) * rr * 1.2, y + Math.sin(a) * rr * .85); } c.closePath(); }
  function holes(c, list, col) { (list || []).forEach(([x, y, r], i) => { if (r <= 1) return; c.fillStyle = col || S.hole; holeShape(c, x, y, r, i * 3); c.fill();
    c.strokeStyle = "rgba(255,200,190,.55)"; c.lineWidth = 3; for (let k = 0; k < 6; k++) { const a = k * 1.05 + i, rr = r * 1.05; c.beginPath(); c.moveTo(x + Math.cos(a) * rr * 1.2, y + Math.sin(a) * rr * .85); c.lineTo(x + Math.cos(a) * rr * .8, y + Math.sin(a) * rr * .55 + 6); c.stroke(); } }); }
  function knitRows(c, x0, x1, y0, y1, col, step) { c.strokeStyle = col; c.lineWidth = 4; c.lineCap = "round"; step = step || 26;
    for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + step / 2, y + step * .6); c.lineTo(x + step, y); c.stroke(); } }
  function sweater(c, o) { o = o || {}; const col = o.col || S.red, dk = o.colD || S.redD;
    c.save();
    for (const s of [-1, 1]) kshape(c, (c) => { c.beginPath(); c.moveTo(s * 120, -170); c.lineTo(s * 230, -110); c.lineTo(s * 300, 130); c.lineTo(s * 220, 150); c.lineTo(s * 165, -10); c.closePath(); }, col, { rim: "rgba(255,220,210,.6)", shadow: "rgba(80,20,30,.3)", rw: 5, sw: 12 });
    for (const s of [-1, 1]) { c.fillStyle = dk; c.beginPath(); c.moveTo(s * 300, 130); c.lineTo(s * 220, 150); c.lineTo(s * 214, 186); c.lineTo(s * 304, 166); c.closePath(); c.fill(); }
    kshape(c, (c) => { c.beginPath(); c.roundRect(-170, -175, 340, 345, 34); }, col, { rim: "rgba(255,220,210,.7)", shadow: "rgba(80,20,30,.3)", rw: 6, sw: 16 });
    c.save(); c.beginPath(); c.roundRect(-170, -175, 340, 345, 34); c.clip(); knitRows(c, -170, 170, -140, 150, "rgba(120,20,40,.18)", 28); c.restore();
    c.fillStyle = dk; c.beginPath(); c.roundRect(-170, 150, 340, 46, 14); c.fill(); c.strokeStyle = "rgba(255,255,255,.18)"; c.lineWidth = 4; for (let x = -156; x < 170; x += 18) { c.beginPath(); c.moveTo(x, 156); c.lineTo(x, 190); c.stroke(); }
    c.fillStyle = dk; c.beginPath(); c.ellipse(0, -172, 72, 26, 0, 0, 7); c.fill(); c.fillStyle = "rgba(20,10,30,.55)"; c.beginPath(); c.ellipse(0, -170, 50, 14, 0, 0, 7); c.fill();
    if (o.stain) { c.save(); c.globalCompositeOperation = "source-atop"; c.restore(); c.fillStyle = `rgba(190,140,50,${.55 * o.stain})`; c.beginPath(); c.ellipse(40, 30, 54, 40, .3, 0, 7); c.fill(); c.beginPath(); c.ellipse(-90, -100, 30, 22, -.4, 0, 7); c.fill(); }
    holes(c, o.holes);
    c.restore(); }
  // gefalteter Pullover im Regal (Breite 2*w, Höhe 80, unten bei y)
  function folded(c, x, y, w, col, dk, hl) { c.save(); c.translate(x, y);
    kshape(c, (c) => { c.beginPath(); c.roundRect(-w, -80, 2 * w, 80, 22); }, col, { rim: "rgba(255,230,220,.6)", shadow: "rgba(30,10,30,.35)", rw: 5, sw: 12 });
    c.save(); c.beginPath(); c.roundRect(-w, -80, 2 * w, 80, 22); c.clip(); knitRows(c, -w, w, -74, 0, "rgba(0,0,0,.14)", 24); c.restore();
    c.fillStyle = dk; c.fillRect(-w + 30, -14, 2 * w - 60, 10); holes(c, hl); c.restore(); }

  // ================= Hintergründe =================
  function room(t, cx, cy, z) { g.setTransform(1, 0, 0, 1, 0, 0);
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#3d2f7e"); bg.addColorStop(1, K.wallD); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(cx, cy, z);
    // Fenster mit Nachthimmel
    kshape(g, (c) => { c.beginPath(); c.roundRect(-700, -1120, 380, 470, 26); }, "#e8d8bf", { rw: 5, sw: 14 });
    const sg = g.createLinearGradient(0, -1090, 0, -680); sg.addColorStop(0, "#14235a"); sg.addColorStop(1, "#3a4fa0"); g.fillStyle = sg; g.beginPath(); g.roundRect(-676, -1096, 332, 422, 16); g.fill();
    g.save(); g.globalCompositeOperation = "lighter"; glow(-430, -1000, 120, "rgba(255,240,200,.5)"); g.restore(); g.fillStyle = "#fff4d6"; g.beginPath(); g.arc(-430, -1000, 36, 0, 7); g.fill();
    g.fillStyle = "rgba(255,255,230,.8)"; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(-650 + (i * 83) % 300, -1070 + (i * 137) % 360, 3 + (i % 2) * 2 + Math.sin(t * 3 + i), 0, 7); g.fill(); }
    g.fillStyle = "#e8d8bf"; g.fillRect(-514, -1096, 12, 422); g.fillRect(-676, -890, 332, 12);
    // Bild an der Wand
    kshape(g, (c) => { c.beginPath(); c.roundRect(60, -1060, 300, 220, 14); }, "#f2b233", { rw: 4, sw: 10 }); g.fillStyle = "#2b9c8f"; g.fillRect(80, -1040, 260, 180);
    g.fillStyle = "#1f6f8a"; g.beginPath(); g.moveTo(80, -860); g.lineTo(170, -980); g.lineTo(240, -900); g.lineTo(290, -950); g.lineTo(340, -860); g.fill(); g.fillStyle = "#ffe08a"; g.beginPath(); g.arc(290, -1000, 22, 0, 7); g.fill();
    // Stehlampe
    g.strokeStyle = "#2a2140"; g.lineWidth = 14; g.beginPath(); g.moveTo(640, 0); g.lineTo(640, -760); g.stroke(); kshape(g, ell(640, -6, 90, 18, 0), "#2a2140", { rw: 2, sw: 4 });
    g.save(); g.globalCompositeOperation = "lighter"; glow(640, -700, 520, "rgba(255,200,120,.32)"); g.restore();
    kshape(g, (c) => { c.beginPath(); c.moveTo(560, -680); c.lineTo(720, -680); c.lineTo(680, -840); c.lineTo(600, -840); c.closePath(); }, K.lamp, { rim: "rgba(255,250,220,.9)", rw: 5, sw: 10 });
    // Boden + Teppich
    const fg = g.createLinearGradient(0, 0, 0, 900); fg.addColorStop(0, "#6e4030"); fg.addColorStop(1, "#3a2018"); g.fillStyle = fg; g.fillRect(-3000, 0, 6000, 3000);
    g.strokeStyle = "rgba(0,0,0,.18)"; g.lineWidth = 4; for (let y = 60; y < 1200; y += 90) { g.beginPath(); g.moveTo(-3000, y); g.lineTo(3000, y); g.stroke(); }
    kshape(g, ell(0, 90, 760, 70, 0), "#c94f6a", { rim: "rgba(255,200,210,.5)", rw: 5, sw: 10 }); g.strokeStyle = "rgba(255,220,230,.5)"; g.lineWidth = 6; g.beginPath(); g.ellipse(0, 90, 680, 50, 0, 0, 7); g.stroke();
  }
  // Kleiderschrank innen: Regalboden oben bei y=0, Stange bei y=-760
  function closet(t, cx, cy, z) { g.setTransform(1, 0, 0, 1, 0, 0);
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#3a2470"); bg.addColorStop(1, "#160d34"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(cx, cy, z);
    g.strokeStyle = "rgba(0,0,0,.22)"; g.lineWidth = 6; for (let x = -1800; x < 1800; x += 170) { g.beginPath(); g.moveTo(x, -2200); g.lineTo(x, 1600); g.stroke(); }
    // Stange + hängende Kleider
    g.strokeStyle = "#b9b4d6"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(-1500, -760); g.lineTo(1500, -760); g.stroke();
    [[-620, S.teal, S.tealD], [-330, "#6b4fc4", "#4b35a0"], [330, S.must, S.mustD], [620, "#3b6fd0", "#2a52a8"], [-900, "#c9561e", "#9a3f14"], [900, S.red, S.redD]].forEach(([x, col, dk], i) => { const sw = Math.sin(t * 1.2 + i) * .02;
      g.save(); g.translate(x, -760); g.rotate(sw); g.strokeStyle = "#d8d2f0"; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 30); g.moveTo(-110, 70); g.lineTo(0, 30); g.lineTo(110, 70); g.stroke();
      kshape(g, (c) => { c.beginPath(); c.moveTo(-120, 64); c.lineTo(120, 64); c.lineTo(140, 520); c.lineTo(-140, 520); c.closePath(); }, col, { rim: "rgba(255,255,255,.3)", shadow: "rgba(0,0,0,.3)", rw: 4, sw: 14 }); g.restore(); });
    // Regalboden
    g.fillStyle = "#1e1238"; g.fillRect(-2000, 40, 4000, 2000);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-2000, 0, 4000, 46, 8); }, "#8a5a3a", { rim: "rgba(255,210,170,.6)", shadow: "rgba(40,10,0,.4)", rw: 5, sw: 10 }); }
  function darken(a, sx, sy, r) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const gr = g.createRadialGradient(sx, sy, r * .35, sx, sy, r); gr.addColorStop(0, "rgba(6,3,22,0)"); gr.addColorStop(1, `rgba(6,3,22,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); }
  function stack(t, hl) { folded(g, 0, 0, 240, "#3b6fd0", "#2a52a8"); folded(g, 10, -80, 230, S.teal, S.tealD); folded(g, -6, -160, 236, S.red, S.redD, hl); }

  // ================= Shots =================
  function hookShot(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    closet(t, lerp(50, 70, k), -260, loop ? 1.5 : lerp(1.5, 1.68, k));
    const hp = loop ? 1 : sm(lt / (d * .7));
    stack(t, [[-150, -40, 20 * (.6 + .4 * hp)], [130, -36, 14 * (.6 + .4 * hp)], [190, -50, 10]]);
    mothAt(40, -240, .74, { t, look: loop ? .2 : lerp(.2, -.6, sm((lt - d * .5) / .4)), mouth: "smile", seed: 1 });
    darken(.72, W * .5, H * .4, 620);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter"; glow(W * .5, H * .4, 360, "rgba(255,220,150,.18)"); g.restore();
    if (!loop) { for (let i = 0; i < 2; i++) { const a = sm((lt - d * .6 - i * .15) / .25); if (a > 0) qmark(W * (.2 + i * .52), H * (.32 - i * .03), 1, a); } } }
  KZ.shot("mHook", (lt, d, t) => hookShot(lt, d, t, false));

  function blameScene(lt, d, t, o) { o = o || {}; const k = sm(lt / d);
    room(t, lerp(-60, -30, k), -470, lerp(1.25, 1.35, k));
    const r = at(rudi, -230, 0, 1, { t, arm: .92, mouth: o.mouth || "o", mood: o.mood || "angry", look: .6 });
    g.save(); g.translate(-230 + r.hx + 60, r.hy + 150); g.rotate(-.08 + Math.sin(t * 2) * .03); g.scale(.55, .55); sweater(g, { holes: [[-60, -40, 26], [70, 60, 20], [10, 120, 14]] }); g.restore();
    const fx = 180 + Math.sin(t * 1.7) * 70, fy = -760 + Math.sin(t * 2.9) * 50;
    mothAt(fx, fy, .45, { t, fly: 1, look: -.6, mouth: "o", seed: 2 }, true);
    return k; }
  KZ.shot("mBlame", (lt, d, t) => { blameScene(lt, d, t, {});
    if (lt > d * .5) stamp("BAD MOTH!", W * .5, H * .17, (lt - d * .5) / .3, "#e5484d", -.06); });

  KZ.shot("mNever", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.06, sm(lt / d)));
    g.save(); g.translate(W * .5, H * .44); g.scale(1.25, 1.25); moth(g, { t, look: .3, mouth: "tiny", seed: 3 }); g.restore();
    // Lupe auf dem Mund
    const lp = sm((lt - .3) / .4), mx = W * .5 + 156 * 1.25, my = H * .44 - 48 * 1.25;
    if (lp > 0) { g.save(); g.globalAlpha = lp; g.strokeStyle = "#fff"; g.lineWidth = 10; g.beginPath(); g.arc(mx + 10, my + 14, 40, 0, 7); g.stroke(); g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(mx + 40, my + 44); g.lineTo(mx + 90, my + 94); g.stroke(); g.restore(); }
    label("NO WORKING MOUTH", W * .44, H * .56, sm((lt - .5) / .3));
    // Besteck durchgestrichen
    const fp = sm((lt - .2) / .3); if (fp > 0) { g.save(); g.globalAlpha = fp; g.translate(W * .2, H * .3); g.strokeStyle = "#dfe3ff"; g.lineWidth = 12; g.lineCap = "round";
      g.beginPath(); g.moveTo(-30, -70); g.lineTo(-30, 70); g.moveTo(-46, -70); g.lineTo(-46, -20); g.moveTo(-14, -70); g.lineTo(-14, -20); g.moveTo(-46, -20); g.quadraticCurveTo(-30, 0, -14, -20); g.stroke();
      g.beginPath(); g.moveTo(30, 70); g.lineTo(30, -70); g.quadraticCurveTo(54, -30, 30, -10); g.stroke(); g.restore(); cross(W * .2, H * .3, .9, fp); }
    if (lt > d * .55) stamp("NEVER EATS", W * .5, H * .15, (lt - d * .55) / .3, "#7b5cff", .05); });

  function battery(x, y, f, col) { g.save(); g.translate(x, y); g.fillStyle = "rgba(255,255,255,.14)"; g.beginPath(); g.roundRect(-300, -80, 600, 160, 30); g.fill(); g.fillRect(300, -36, 30, 72);
    g.strokeStyle = "#fff"; g.lineWidth = 10; g.beginPath(); g.roundRect(-300, -80, 600, 160, 30); g.stroke(); g.fillStyle = col; g.beginPath(); g.roundRect(-284, -64, Math.max(8, 568 * f), 128, 20); g.fill(); g.restore(); }
  KZ.shot("mLife", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    txt("A MOTH'S ENERGY", W * .44, H * .09, 62, "#fff", { w: 900, a: sm(lt / .3) });
    const ph = lt < d * .45 ? 0 : 1, fill = ph ? lerp(1, .08, sm((lt - d * .45) / (d * .5))) : sm(lt / (d * .42));
    battery(W * .44, H * .3, fill, fill > .3 ? "#3ccf7a" : "#ff5a4a");
    txt(Math.round(fill * 100) + "%", W * .44, H * .3, 70, "#fff", { w: 900, stroke: 10 });
    if (!ph) { g.save(); g.translate(W * .44, H * .47); g.scale(.75, .75); larva(g, { t, crawl: 1 }); g.restore(); txt("BABY: EATS & STORES", W * .44, H * .54, 50, "#7ef0b0", { a: sm(lt / .4) }); }
    else { g.save(); g.translate(W * .44 - 40, H * .5); g.scale(.75, .75); moth(g, { t, fly: 1, mouth: "tiny", look: .4, seed: 4 }); g.restore();
      txt("ADULT: 2-4 WEEKS", W * .44, H * .58, 54, "#ffd84d", { a: sm((lt - d * .45) / .3), stroke: 10 });
      txt("NO FOOD AT ALL", W * .44, H * .625, 42, "#fff", { a: sm((lt - d * .6) / .3), w: 700 }); } });

  KZ.shot("mBaby", (lt, d, t) => { const k = sm(lt / d); closet(t, lerp(60, 120, k), -230, lerp(1.9, 2.15, k));
    const out = sm((lt - .2) / .7), hp = .6 + .4 * sm(lt / d);
    stack(t, [[-150, -40, 20 * hp], [130, -36, 14 * hp], [190, -50, 10]]);
    // Larve kriecht aus der Falte zwischen den Pullovern
    g.save(); g.beginPath(); g.rect(-400, -400, 2000, 236); g.clip(); larvaAt(lerp(0, 150, out), -160, .55, { t, crawl: 1 }); g.restore();
    mothAt(-60, -240, .4, { t, look: .9, mouth: "smile", seed: 5 });
    darken(.7, W * .62, H * .36, 560);
    if (lt > d * .45) stamp("CULPRIT!", W * .5, H * .17, (lt - d * .45) / .3, "#e5484d", .06); });

  KZ.shot("mLarva", (lt, d, t) => { const k = sm(lt / d); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = S.redD; g.fillRect(0, 0, W, H);
    cam(lerp(-40, 60, k), -60, lerp(2.1, 2.3, k));
    g.fillStyle = S.red; g.fillRect(-1200, -1200, 2400, 2400);
    // große Strickmaschen
    for (let y = -800; y < 800; y += 46) for (let x = -900; x < 900; x += 40) { const o = (Math.floor(y / 46) % 2) * 20; for (const s of [-1, 1]) kshape(g, ell(x + o + s * 9, y, 10, 22, s * .5), S.red, { rim: "rgba(255,200,190,.55)", shadow: "rgba(90,10,30,.35)", rw: 2, sw: 4 }); }
    // Fraßspur hinter der Larve
    const lx = lerp(-160, 40, k); g.fillStyle = S.hole; holeShape(g, lx - 180, 20, 46, 2); g.fill();
    larvaAt(lx, 20, 1, { t, crawl: 1, tube: 1 });
    label("UP TO 13 MM", W * .44, H * .2, sm((lt - .4) / .3)); });

  function rowItem(s, ok, i, lt, x0, y0, sw) { const a = sm((lt - .2 - i * .32) / .28); if (a <= 0) return; const y = y0 + i * 96;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = sw; g.beginPath(); g.roundRect(x0, y - 34, 68, 68, 18); g.fill(); g.restore();
    txt(s, x0 + 100, y, 52, "#fff", { align: "left", a, stroke: 10 }); (ok ? check : cross)(x0 + 560, y, .5, a); }
  KZ.shot("mKeratin", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    txt("ON THE MENU:", W * .4, H * .09, 60, "#fff", { w: 900, a: sm(lt / .3) });
    label("KERATIN", W * .4, H * .145, sm((lt - .1) / .3));
    g.save(); g.translate(W * .72, H * .1); g.scale(.4, .4); larva(g, { t, crawl: .5 }); g.restore();
    [["WOOL", 1, "#e8d9b0"], ["SILK", 1, "#f2c6e0"], ["FUR", 1, "#a0703c"], ["FEATHERS", 1, "#9ad0ff"], ["COTTON", 0, "#ffffff"], ["POLYESTER", 0, "#5ad1c0"]].forEach(([s, ok, sw], i) => rowItem(s, ok, i, lt, W * .1, H * .21, sw)); });

  KZ.shot("mStain", (lt, d, t) => { const k = sm(lt / d); closet(t, lerp(0, 30, k), -330, lerp(1.4, 1.55, k));
    g.save(); g.translate(0, -360); g.rotate(-.04); g.scale(1.05, 1.05); sweater(g, { stain: sm((lt - .2) / .4), holes: [[-60, -60, 14]] }); g.restore();
    const sp = sm((lt - .3) / .5); g.save(); g.translate(42 - 4, -330 + 2); g.globalCompositeOperation = "lighter"; glow(0, 0, 160, `rgba(255,200,80,${.35 * sp * (0.8 + .2 * Math.sin(t * 6))})`); g.restore();
    larvaAt(lerp(-280, -100, sm(lt / d)), -280, .38, { t, crawl: 1 });
    label("SWEAT", W * .26, H * .25, sm((lt - .5) / .3)); label("FOOD", W * .66, H * .33, sm((lt - .7) / .3));
    if (lt > d * .55) stamp("YUM!", W * .5, H * .15, (lt - d * .55) / .3, "#f08a1e", -.05); });

  KZ.shot("mQuote", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .33); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -300, 780, 600, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -310, 780, 600, 34); g.fill();
    g.fillStyle = "#2b9c8f"; g.beginPath(); g.roundRect(-390, -310, 780, 120, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 40px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NATURAL HISTORY", 0, -272); g.fillText("MUSEUM, LONDON", 0, -226);
    g.fillStyle = "#e5a52a"; g.font = '900 130px "Montserrat"'; g.fillText("“", -320, -140);
    const lines = ["Adults do not", "feed ... and cause", "no damage", "to fabrics.”"]; g.font = '900 56px "Montserrat"';
    lines.forEach((l, i) => { const a = sm((lt - .4 - i * .3) / .3); g.globalAlpha = a; g.fillStyle = i >= 2 ? "#c9561e" : "#1b1d3a"; g.fillText(l, 0, -110 + i * 76); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 32px "Montserrat"'; g.fillText("nhm.ac.uk · Clothes moths guide", 0, 236);
    g.restore(); g.setTransform(1, 0, 0, 1, 0, 0);
    const pe = sm((lt - .8) / .5); mothAt(W * .62, H * .64 - pe * 30, .42, { t, look: -.5, mouth: "smile", seed: 6 }); });

  KZ.shot("mLamp", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(440, 470, k), -560, lerp(1.5, 1.6, k));
    g.save(); g.globalCompositeOperation = "lighter"; glow(640, -770, 300, "rgba(255,220,140,.25)"); g.restore(); for (let i = 0; i < 5; i++) { const a = t * (1.4 + i * .2) + i * 1.3; otherMoth(600 + Math.cos(a) * (90 + i * 28), -800 + Math.sin(a * 1.3) * (130 + i * 30), 1.05, t, i * 2); }
    at(rudi, 300, 0, 1, { t, arm: 1, mouth: "o", look: .9 });
    if (lt > d * .5) stamp("WRONG MOTH", W * .42, H * .15, (lt - d * .5) / .3, "#7b5cff", -.05); });

  KZ.shot("mHide", (lt, d, t) => { const k = sm(lt / d); closet(t, lerp(-60, -140, k), -240, 1.7);
    stack(t, [[-150, -40, 20], [130, -36, 14], [190, -50, 10]]);
    const run = sm((lt - .3) / (d * .7)); mothAt(lerp(60, -330, run), -240, .5, { t, walk: run > 0 && run < 1, look: -.3, mouth: "o", seed: 7 }, true);
    // Lichtkeil von rechts (Tür geht auf)
    const lp = sm(lt / .5); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(6,3,22,${.55})`; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = "lighter"; const gr = g.createLinearGradient(W, 0, W * .2, 0); gr.addColorStop(0, `rgba(255,230,160,${.45 * lp})`); gr.addColorStop(1, "rgba(255,230,160,0)");
    g.fillStyle = gr; g.beginPath(); g.moveTo(W, 0); g.lineTo(W * lerp(1, .3, lp), H * .1); g.lineTo(W * lerp(1, .15, lp), H * .7); g.lineTo(W, H * .75); g.closePath(); g.fill(); g.restore();
    label("HATES LIGHT", W * .42, H * .2, sm((lt - .4) / .3)); });

  KZ.shot("mAsk", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(-170, -140, k), -380, lerp(1.3, 1.4, k));
    at(rudi, -300, 0, 1, { t, arm: 1.5 + sm(lt / .4) * .5, mouth: "hmm", look: .8 });
    g.save(); g.translate(120, -40); g.scale(.45, .45); g.rotate(.05); sweater(g, { holes: [[-60, -40, 26], [70, 60, 20]] }); g.restore();
    for (let i = 0; i < 2; i++) qmark(W * (.6 + i * .14), H * (.2 - i * .03) + Math.sin(t * 3 + i) * 8, 1, sm((lt - .2 - i * .2) / .3)); });

  function washer(x, y, t, a) { g.save(); g.translate(x, y); g.globalAlpha = a;
    kshape(g, (c) => { c.beginPath(); c.roundRect(-150, -170, 300, 340, 30); }, "#eef1ff", { rim: "#fff", shadow: "rgba(40,50,110,.35)", rw: 5, sw: 14 });
    g.fillStyle = "#c9cff0"; g.fillRect(-150, -130, 300, 8); g.fillStyle = "#5ad1c0"; g.beginPath(); g.arc(90, -150, 10, 0, 7); g.fill();
    g.fillStyle = "#9aa3d8"; g.beginPath(); g.arc(0, 20, 110, 0, 7); g.fill(); g.fillStyle = "#2a5fae"; g.beginPath(); g.arc(0, 20, 90, 0, 7); g.fill();
    g.save(); g.beginPath(); g.arc(0, 20, 90, 0, 7); g.clip(); g.translate(0, 20); g.rotate(t * 4); g.scale(.2, .2); sweater(g, {}); g.restore();
    g.fillStyle = "rgba(255,255,255,.7)"; for (let i = 0; i < 6; i++) { const q = (t * .8 + i / 6) % 1; g.beginPath(); g.arc(-60 + i * 24, 80 - q * 140, 8 + i % 3 * 3, 0, 7); g.fill(); }
    g.restore(); }
  function bag(x, y, zip, a, t) { g.save(); g.translate(x, y); g.globalAlpha = a; folded(g, 0, 60, 170, S.red, S.redD);
    g.fillStyle = "rgba(200,230,255,.22)"; g.beginPath(); g.roundRect(-210, -110, 420, 210, 26); g.fill(); g.strokeStyle = "rgba(230,245,255,.85)"; g.lineWidth = 6; g.stroke();
    g.strokeStyle = "#5ad1c0"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(-200, -96); g.lineTo(-200 + 400 * zip, -96); g.stroke();
    g.fillStyle = "#ffd84d"; g.beginPath(); g.roundRect(-200 + 400 * zip - 14, -114, 28, 36, 8); g.fill(); g.restore(); }
  KZ.shot("mBag", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const a1 = sm(lt / .3), a2 = sm((lt - d * .4) / .3);
    txt("1  WASH", W * .14, H * .1, 56, "#ffd84d", { align: "left", a: a1, w: 900 }); g.save(); g.translate(W * .3, H * .27); g.scale(1.25, 1.25); washer(0, 0, t, a1); g.restore();
    txt("2  SEAL", W * .52, H * .1, 56, "#ffd84d", { align: "left", a: a2, w: 900 }); if (a2 > 0) { g.save(); g.translate(W * .6, H * .5); g.scale(1.3, 1.3); bag(0, 0, sm((lt - d * .5) / (d * .35)), a2, t); g.restore(); }
    if (a1 > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a2; g.strokeStyle = "#fff"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(W * .16, H * .4); g.quadraticCurveTo(W * .16, H * .5, W * .3, H * .5); g.stroke(); g.beginPath(); g.moveTo(W * .28, H * .47); g.lineTo(W * .31, H * .5); g.lineTo(W * .28, H * .53); g.stroke(); g.restore(); }
    check(W * .6, H * .62, .7, sm((lt - d * .85) / .25));
    label("AIRTIGHT", W * .6, H * .4, sm((lt - d * .8) / .3)); });

  KZ.shot("mFreeze", (lt, d, t) => { const k = sm(lt / d); g.setTransform(1, 0, 0, 1, 0, 0);
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2f6c86"); bg.addColorStop(1, "#123349"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(lerp(-40, -10, k), -420, lerp(1.25, 1.35, k));
    g.strokeStyle = "rgba(255,255,255,.1)"; g.lineWidth = 4; for (let x = -2000; x < 2000; x += 110) { g.beginPath(); g.moveTo(x, -1600); g.lineTo(x, 0); g.stroke(); }
    g.fillStyle = "#0e2a3c"; g.fillRect(-3000, 0, 6000, 3000);
    // Gefriertruhe (offen)
    const FX = 160; kshape(g, (c) => { c.beginPath(); c.roundRect(FX - 260, -380, 520, 380, 26); }, "#eef4ff", { rim: "#fff", shadow: "rgba(30,60,90,.35)", rw: 5, sw: 14 });
    g.fillStyle = "#8fd8ff"; g.beginPath(); g.roundRect(FX - 230, -380, 460, 60, 14); g.fill();
    g.save(); g.globalCompositeOperation = "lighter"; glow(FX, -400, 300, "rgba(150,220,255,.4)"); g.restore();
    kshape(g, (c) => { c.beginPath(); c.moveTo(FX - 260, -390); c.lineTo(FX + 260, -390); c.lineTo(FX + 230, -760); c.lineTo(FX - 230, -760); c.closePath(); }, "#dfe9fa", { rim: "#fff", rw: 4, sw: 10 });
    // Kälte-Kristalle
    g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 10; i++) { const q = (t * .4 + i / 10) % 1; sparkle(FX - 200 + (i * 47) % 400, -380 - q * 260, 10, (1 - q) * .8); } g.restore();
    // Rudi senkt die Tüte hinein
    const dn = sm((lt - .2) / (d * .6)), r = at(rudi, -230, 0, 1, { t, hand: [lerp(200, 300, dn), lerp(-500, -380, dn)], mouth: "grin", look: .6 });
    g.save(); g.translate(-230 + lerp(200, 300, dn) + 40, lerp(-500, -380, dn) + 90); g.scale(.6, .6); bag(0, 0, 1, dn < .98 ? 1 : 0, t); g.restore();
    label("-20 °C · 1 WEEK", W * .5, H * .17, sm((lt - .3) / .3));
    if (lt > d * .6) stamp("FROZEN", W * .62, H * .27, (lt - d * .6) / .3, "#2b9cd8", .06); });

  KZ.shot("mLoop", (lt, d, t) => { if (lt < d * .6) blameScene(lt, d, t, { mouth: "hmm" }); else hookShot(0, d, t, true); });
})();
