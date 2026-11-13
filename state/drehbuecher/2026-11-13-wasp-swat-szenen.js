// Szenendatei "Never Swat A Wasp" (Gemeine Wespe / Deutsche Wespe, Vespula vulgaris/germanica). Mix-Stil (Hermann 12.11.2026).
// Quellen: WSU Insider 2013 "Close encounters of the wasp kind" (Peter Landolt, USDA-Entomologe: "When a yellowjacket is smashed,
// its venom sac releases an alarm chemical that alerts nearby guard wasps to come and defend"), BBC Science Focus (Wespenaugen auf
// plötzliche Bewegungen optimiert, Erschlagen setzt Pheromone frei, ruhig unter einem Glas fangen), Oklahoma State Univ. Extension
// EPP-7305 (Wespen verlieren den Stachel nicht wie Honigbienen und können mehrmals stechen; still bleiben oder langsam weggehen),
// NYC Health / NHS (nicht schlagen, ruhig langsam weggehen, Getränke abdecken).
// Helfer txt/stamp/navy/rudi/at/sparkle/cross/check aus baby-bird übernommen (Rudi bleibt gleich). Wespe neu gezeichnet:
// gelb-schwarz geringelter Hinterleib mit schwarzen Dreiecken, Wespentaille (Stiel), schwarze Brust mit gelben Flecken,
// gelbes Gesicht, großes nierenförmiges Facettenauge, geknickte Fühler, längs gefaltete rauchige Flügel, gelbe Beine, Stachel.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#3f58b0", "#5a6cc4", "#45509a", "#22285e"], hills: [["#2a6a5a", "#327a66"], ["#22584c", "#2a6858"], ["#1a463e", "#22564a"]], corals: false, rays: false, dust: "255,236,190" };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86",
    wy: "#ffd02e", wyL: "rgba(255,250,200,.85)", wk: "#1c1a2a", wkL: "rgba(170,170,255,.45)", wleg: "#f2b41e", wing: "rgba(200,220,255,.34)",
    alarm: "120,255,140", lawn: "#3f9a5a", lawnT: "#5ab872", hedge: "#24704f", wood: "#c9824a", woodD: "#9a5a2e", lemon: "#ffe25a",
    paper: "#e9e4d6", paperD: "#c9c2b0", nest: "#cdbfa6", nestD: "#a8977c", bee: "#e8a02a", beeD: "#6a3d1a" };
  const TY = -240; // Tischplatte
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
  function sparkle(x, y, r, a) { if (a <= 0) return; g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, r * 2.4, `rgba(255,230,140,${.6 * a})`); g.fillStyle = `rgba(255,250,220,${a})`; g.beginPath(); for (let i = 0; i < 8; i++) { const ang = i / 8 * 6.283, rr = i % 2 ? r * .3 : r; g.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } g.fill(); g.restore(); }
  function cross(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#ff4d5a"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(-50, -50); g.lineTo(50, 50); g.moveTo(50, -50); g.lineTo(-50, 50); g.stroke(); g.restore(); }
  function check(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#7ef0b0"; g.lineWidth = 22; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(-50, 0); g.lineTo(-14, 36); g.lineTo(54, -40); g.stroke(); g.restore(); }
  function heart(c, x, y, s, col) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col || "#ff4d6d"; c.beginPath(); c.moveTo(0, 8); c.bezierCurveTo(-18, -6, -8, -20, 0, -10); c.bezierCurveTo(8, -20, 18, -6, 0, 8); c.fill(); c.restore(); }

  // ================= Wespe (Seitenansicht, Kopf nach rechts, Füße bei y=0, Länge ~300) =================
  // o: t, fly, mood, look, walk, sting (0..1 Stachel raus), squash (0..1 platt), drink, alarm (0..1 grüner Duft)
  function wleg(c, hx, hy, ph, reach, dir, w) { const sw = Math.sin(ph) * 14, lift = Math.max(0, Math.cos(ph)) * 10;
    const kx = hx + dir * reach * .45 + sw * .3, ky = hy * .45 - lift * .4, fx = hx + dir * reach + sw, fy = -lift;
    c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = C.wk; c.lineWidth = w * 1.15; c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + (kx - hx) * .4, hy + (ky - hy) * .4); c.stroke();
    c.strokeStyle = C.wleg; c.lineWidth = w; c.beginPath(); c.moveTo(hx + (kx - hx) * .4, hy + (ky - hy) * .4); c.lineTo(kx, ky); c.lineTo(fx, fy); c.lineTo(fx + dir * 14, fy); c.stroke(); }
  function wasp(c, o) {
    const t = o.t || 0, wk = (o.walk || 0) * t * 14, br = Math.sin(t * 3.2) * .015, sq = o.squash || 0;
    const pump = Math.sin(t * 5) * .03; // Hinterleib pumpt (atmet)
    c.save(); c.scale(1 + br + sq * .5, 1 - br - sq * .7);
    if (!o.fly) { c.save(); c.globalAlpha = .28; c.fillStyle = "#0b0618"; c.beginPath(); c.ellipse(-10, 4, 160, 10, 0, 0, 7); c.fill(); c.restore(); }
    // ferne Beine
    if (!o.fly) { wleg(c, 50, -62, wk + 1, 64, 1, 7); wleg(c, 22, -58, wk + 3, 60, -1, 7); wleg(c, 0, -60, wk + 5, 92, -1, 7); }
    else { c.strokeStyle = C.wleg; c.lineWidth = 7; c.lineCap = "round"; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(40 - i * 22, -66); c.lineTo(30 - i * 30, -26); c.lineTo(10 - i * 34, -12); c.stroke(); } }
    // Hinterleib (Gaster) mit Ringen
    c.save(); c.translate(-30, -84); c.rotate(.18 - (o.sting || 0) * .35); c.scale(1 + pump, 1 - pump);
    c.strokeStyle = C.wk; c.lineWidth = 9; c.lineCap = "round"; c.beginPath(); c.moveTo(4, 0); c.lineTo(-18, 2); c.stroke(); // Wespentaille
    const gas = (c) => { c.beginPath(); c.moveTo(-16, 0); c.bezierCurveTo(-24, -54, -128, -62, -168, -16); c.quadraticCurveTo(-196, 6, -204, 16); c.quadraticCurveTo(-176, 30, -140, 36); c.bezierCurveTo(-80, 50, -22, 40, -16, 0); c.closePath(); };
    kshape(c, gas, C.wy, { rim: C.wyL, shadow: "rgba(120,60,0,.35)", rw: 6, sw: 16 });
    c.save(); gas(c); c.clip();
    c.fillStyle = C.wk; for (const [x, wdt] of [[-22, 22], [-64, 18], [-104, 17], [-142, 16], [-178, 30]]) { c.beginPath(); c.moveTo(x, -70); c.lineTo(x - wdt, -70); c.lineTo(x - wdt - 4, 60); c.lineTo(x + 2, 60); c.closePath(); c.fill(); }
    // schwarze Dreiecke (typisch Vespula) von den Bändern nach unten
    for (const x of [-46, -86, -124]) { c.beginPath(); c.moveTo(x - 6, -48); c.lineTo(x + 10, -48); c.lineTo(x + 2, -18); c.closePath(); c.fill(); }
    c.fillStyle = "rgba(255,255,255,.28)"; c.beginPath(); c.ellipse(-90, -36, 60, 9, -.08, 0, 7); c.fill(); c.restore();
    // Stachel
    const sl = 18 + (o.sting || 0) * 28; c.strokeStyle = "#2b1d14"; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.moveTo(-200, 16); c.lineTo(-200 - sl, 22); c.stroke();
    if (o.sting) { c.save(); c.globalCompositeOperation = "lighter"; glow(-204 - sl, 22, 36 * o.sting, "rgba(255,240,140,.8)"); c.restore(); }
    c.restore();
    // Brust (schwarz mit gelben Flecken)
    const tho = (c) => { c.beginPath(); c.ellipse(28, -86, 52, 38, -.08, 0, 7); };
    kshape(c, tho, C.wk, { rim: C.wkL, shadow: "rgba(0,0,30,.4)", rw: 6, sw: 12 });
    c.fillStyle = C.wy; c.beginPath(); c.ellipse(70, -104, 8, 16, .5, 0, 7); c.fill(); c.beginPath(); c.ellipse(4, -66, 12, 7, .2, 0, 7); c.fill(); c.beginPath(); c.ellipse(-6, -110, 9, 5, 0, 0, 7); c.fill();
    c.fillStyle = "rgba(255,240,180,.25)"; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(-10 + (i * 37) % 80, -118 + (i * 13) % 18, 2.5, 0, 7); c.fill(); }
    // Flügel: längs gefaltet, rauchig; im Flug schnelles Schlagen
    const fl = o.fly ? Math.sin(t * 70) : 0;
    c.save(); c.translate(26, -118); c.rotate(o.fly ? -.55 + fl * .45 : .14); c.scale(1, o.fly ? .5 + .5 * Math.abs(fl) : 1);
    c.fillStyle = C.wing; c.beginPath(); c.ellipse(-92, -6, 110, o.fly ? 30 : 15, .04, 0, 7); c.fill();
    c.fillStyle = "rgba(200,220,255,.22)"; c.beginPath(); c.ellipse(-76, 6, 88, o.fly ? 22 : 10, .1, 0, 7); c.fill();
    c.strokeStyle = "rgba(40,50,90,.5)"; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, -6); c.lineTo(-190, -10); c.moveTo(-10, 0); c.quadraticCurveTo(-90, 10, -160, 4); c.stroke();
    c.fillStyle = "rgba(255,255,255,.4)"; c.beginPath(); c.ellipse(-110, -12, 46, 4, .03, 0, 7); c.fill(); c.restore();
    if (o.fly) { c.save(); c.globalAlpha = .18; c.fillStyle = "#e8f0ff"; c.beginPath(); c.ellipse(-30, -170, 120, 60, -.2, 0, 7); c.fill(); c.restore(); }
    // Kopf: schwarzer Scheitel, gelbes Gesicht, nierenförmiges Auge
    const hd = o.drink ? .25 + Math.sin(t * 6) * .05 : 0;
    c.save(); c.translate(84, -92); c.rotate(hd);
    kshape(c, ell(26, -2, 38, 40, .15), C.wy, { rim: C.wyL, shadow: "rgba(120,60,0,.35)", rw: 5, sw: 10 });
    c.fillStyle = C.wk; c.beginPath(); c.ellipse(16, -26, 32, 18, .1, 0, 7); c.fill();
    // Facettenauge (Niere) + Comic-Pupille
    c.fillStyle = "#2a2440"; c.beginPath(); c.moveTo(4, -32); c.bezierCurveTo(34, -40, 40, -6, 30, 18); c.bezierCurveTo(22, 30, 8, 26, 12, 10); c.bezierCurveTo(16, -2, -4, -10, 4, -32); c.fill();
    fig.eye(c, 22, -10, 15, { t, seed: o.seed ?? 2, look: o.look ?? .5, mood: o.mood, lid: C.wk });
    // Kiefer
    c.fillStyle = "#b07a10"; c.beginPath(); c.moveTo(50, 22); c.quadraticCurveTo(64, 30, 56, 42); c.lineTo(46, 32); c.fill();
    if (o.drink) { c.strokeStyle = "#e0a020"; c.lineWidth = 5; c.beginPath(); c.moveTo(52, 34); c.lineTo(58, 50 + Math.sin(t * 9) * 3); c.stroke(); }
    // geknickte Fühler
    c.strokeStyle = C.wk; c.lineWidth = 5; c.lineCap = "round"; c.lineJoin = "round"; const as = Math.sin(t * 3.4) * 7, bs = Math.cos(t * 2.9) * 6;
    c.beginPath(); c.moveTo(40, -30); c.lineTo(58, -64); c.quadraticCurveTo(80 + as, -74, 98 + as, -54); c.stroke();
    c.beginPath(); c.moveTo(32, -34); c.lineTo(44, -72); c.quadraticCurveTo(64 + bs, -86, 84 + bs, -72); c.stroke();
    c.restore();
    // nahe Beine
    if (!o.fly) { wleg(c, 56, -60, wk, 66, 1, 8); wleg(c, 28, -56, wk + 2.1, 62, -1, 8); wleg(c, 6, -58, wk + 4.2, 96, -1, 8); }
    // Alarmduft
    if (o.alarm) { c.save(); c.globalCompositeOperation = "lighter"; for (let i = 0; i < 7; i++) { const p = (t * .5 + i / 7) % 1; glow(-180 - p * 60 + Math.sin(i * 3 + t) * 30, -80 - p * 260, 40 + p * 70, `rgba(${C.alarm},${.45 * o.alarm * (1 - p)})`); } c.restore(); }
    c.restore();
  }
  function wAt(x, y, s, o) { g.save(); g.translate(x, y); g.scale(s, Math.abs(s)); wasp(g, o); g.restore(); }
  // Honigbiene (Infografik): pelzig, braun-gold, Widerhaken-Stachel
  function bee(c, o) { const t = o.t || 0;
    c.save(); c.translate(-30, -84); c.rotate(.15);
    const ab = ell(-80, 0, 84, 50, 0); kshape(c, ab, C.bee, { rim: "rgba(255,240,190,.7)", rw: 5, sw: 12 });
    c.save(); ab(c); c.clip(); c.fillStyle = C.beeD; for (const x of [-60, -100, -140]) { c.fillRect(x - 10, -60, 18, 120); } c.restore();
    c.strokeStyle = "#2b1d14"; c.lineWidth = 4; c.beginPath(); c.moveTo(-162, 6); c.lineTo(-190, 10); c.stroke();
    for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-170 - i * 7, 8); c.lineTo(-166 - i * 7, 15); c.stroke(); } c.restore();
    kshape(c, ell(24, -88, 44, 38, 0), "#a8742a", { rim: "rgba(255,230,180,.6)", rw: 5, sw: 10 });
    c.strokeStyle = "rgba(255,220,150,.7)"; c.lineWidth = 3; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; c.beginPath(); c.moveTo(24 + Math.cos(a) * 40, -88 + Math.sin(a) * 34); c.lineTo(24 + Math.cos(a) * 50, -88 + Math.sin(a) * 44); c.stroke(); }
    c.fillStyle = "rgba(220,235,255,.4)"; c.beginPath(); c.ellipse(-30, -150, 80, 26, -.3, 0, 7); c.fill();
    kshape(c, ell(86, -88, 30, 32, 0), "#4a2e18", { rim: "rgba(255,220,180,.5)", rw: 4, sw: 6 });
    fig.eye(c, 92, -96, 13, { t, seed: 4, look: .4 });
    c.strokeStyle = "#2b1d14"; c.lineWidth = 4; c.beginPath(); c.moveTo(96, -116); c.quadraticCurveTo(110, -150, 130, -140); c.stroke();
    c.strokeStyle = "#4a2e18"; c.lineWidth = 6; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(40 - i * 20, -56); c.lineTo(50 - i * 34, -20); c.lineTo(60 - i * 40, 0); c.stroke(); }
  }

  // ---------- Garten + Tisch ----------
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
  function table(x0, x1) { // Holztisch, Platte bei TY
    g.fillStyle = C.woodD; for (const x of [x0 + 60, x1 - 80]) g.fillRect(x, TY, 28, -TY);
    kshape(g, (c) => { c.beginPath(); c.roundRect(x0, TY - 10, x1 - x0, 34, 10); }, C.wood, { rim: "rgba(255,230,190,.7)", rw: 5, sw: 10 });
    g.strokeStyle = "rgba(120,60,20,.35)"; g.lineWidth = 3; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(x0 + 40 + i * 260, TY + 2); g.lineTo(x0 + 200 + i * 260, TY + 2); g.stroke(); } }
  // Limonadenglas (Boden bei y, Höhe 220*s), gibt Randpunkt zurück
  function glass(x, y, s, o) { o = o || {}; const t = o.t || 0; g.save(); g.translate(x, y); g.scale(s, s);
    const body = (c) => { c.beginPath(); c.moveTo(-58, 0); c.lineTo(-72, -220); c.lineTo(72, -220); c.lineTo(58, 0); c.closePath(); };
    g.fillStyle = "rgba(220,240,255,.18)"; body(g); g.fill();
    g.save(); body(g); g.clip(); const lv = -150; const lg = g.createLinearGradient(0, lv, 0, 0); lg.addColorStop(0, "#ffe97a"); lg.addColorStop(1, "#f7c63a"); g.fillStyle = lg; g.fillRect(-80, lv + Math.sin(t * 2) * 2, 160, 160);
    g.fillStyle = "rgba(255,255,255,.7)"; for (let i = 0; i < 7; i++) { const p = (t * .4 + i / 7) % 1; g.beginPath(); g.arc(-40 + (i * 23) % 80, -10 - p * 130, 4 + i % 3, 0, 7); g.fill(); } g.restore();
    g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 5; body(g); g.stroke(); g.fillStyle = "rgba(255,255,255,.45)"; g.fillRect(-56, -200, 12, 170);
    if (!o.noStraw) { g.strokeStyle = "#ff5a7a"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(10, -30); g.lineTo(40, -270); g.lineTo(70, -300); g.stroke(); }
    if (!o.noLemon) { g.save(); g.translate(-64, -222); kshape(g, (c) => { c.beginPath(); c.arc(0, 0, 40, Math.PI, 0); c.closePath(); }, C.lemon, { rim: "rgba(255,255,220,.8)", rw: 4, sw: 6 }); g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 3; for (let i = 1; i < 6; i++) { const a = Math.PI + i / 6 * Math.PI; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 34, Math.sin(a) * 34); g.stroke(); } g.restore(); }
    if (o.lid) { const p = o.lid; g.save(); g.translate(0, lerp(-500, -226, p)); kshape(g, ell(0, 0, 90, 16, 0), "#7ec8e3", { rim: "rgba(255,255,255,.7)", rw: 4, sw: 6 }); g.restore(); }
    g.restore(); return [x, y - 220 * s]; }
  // Wespennest (Papier), hängt am Punkt (x,y), Höhe ~360*s
  function nest(x, y, s, t, alarm) { g.save(); g.translate(x, y); g.scale(s, s);
    g.strokeStyle = "#5a3a26"; g.lineWidth = 16; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 30); g.stroke();
    const sh = ell(0, 190, 150, 175, 0); kshape(g, sh, C.nest, { rim: "rgba(255,250,235,.7)", shadow: "rgba(80,50,20,.3)", rw: 6, sw: 18 });
    g.save(); sh(g); g.clip(); g.strokeStyle = C.nestD; g.lineWidth = 7; for (let i = 0; i < 9; i++) { g.beginPath(); g.ellipse(-60 + (i % 3) * 60, 60 + i * 34, 120, 24, .1 * (i % 2 ? 1 : -1), 0, Math.PI); g.stroke(); } g.restore();
    g.fillStyle = "#2a1a12"; g.beginPath(); g.ellipse(0, 330, 30, 18, 0, 0, 7); g.fill();
    if (alarm) { g.save(); g.globalCompositeOperation = "lighter"; glow(0, 190, 260 * alarm, `rgba(${C.alarm},${.3 * alarm})`); g.restore(); }
    g.restore(); }
  // gerollte Zeitung, Griff bei (0,0), zeigt in Richtung rot
  function paper(c, rot, len) { c.save(); c.rotate(rot); len = len || 300;
    kshape(c, (c) => { c.beginPath(); c.roundRect(-30, -26, len, 52, 24); }, C.paper, { rim: "rgba(255,255,255,.9)", shadow: "rgba(80,70,50,.3)", rw: 4, sw: 10 });
    c.fillStyle = "rgba(60,60,80,.45)"; for (let i = 0; i < 6; i++) c.fillRect(20 + i * 42, -14 + (i % 2) * 10, 30, 5);
    c.fillStyle = C.paperD; c.beginPath(); c.ellipse(len - 30, 0, 14, 26, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(120,110,90,.7)"; c.lineWidth = 3; c.beginPath(); c.arc(len - 30, 0, 8, 0, 5); c.stroke();
    c.restore(); }

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
    if (o.hold === "paper") { c.save(); c.translate(hx, hy); paper(c, o.paperRot ?? -1.2, 260); c.restore(); }
    c.fillStyle = C.skin; c.beginPath(); c.arc(hx, hy, 20, 0, 7); c.fill();
    c.restore(); return { hx, hy }; }
  function at(fn, x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); const r = fn(g, o); g.restore(); return r; }

  // ================= Shots =================
  // Hook: Nahaufnahme Wespe auf dem Glasrand, Zeitung holt von links oben aus; Ende = Loop-Bild
  function hookShot(lt, d, t, loop) { const k = sm(lt / d); lawn(t, 0, 0, 1); cam(lerp(60, 80, k) , TY - 230, loop ? lerp(2.15, 2.25, k) : lerp(2.25, 2.45, k));
    table(-700, 700); const [rx, ry] = glass(60, TY, 1, { t, noStraw: true });
    wAt(rx + 20, ry + 4, .55, { t, drink: true, look: -.3, seed: 1 });
    const p = loop ? .35 : sm(lt / (d * .55)); g.save(); g.translate(lerp(-420, -260, p), lerp(-760, -620, p)); paper(g, lerp(.2, .55, p) + Math.sin(t * 6) * .04, 300); g.restore();
    if (!loop && lt > d * .55) stamp("DON'T!", W * .42, H * .6, (lt - d * .55) / .3, "#e5484d"); }
  KZ.shot("wHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("wLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .5) { lawn(t, lerp(-120, -60, k), -260, 1.05); table(-300, 700); glass(150, TY, .9, { t }); const r = sm(lt / (d * .45));
      at(rudi, -330, 0, .95, { t, arm: lerp(.3, .95, r), hold: "paper", paperRot: lerp(.4, -1.0, r), mouth: "hmm", look: .7 }); wAt(150 + 24, TY - 198, .32, { t, drink: true }); }
    else hookShot(lt - d * .5, d * .5, t, true); });

  // sichtbare Alarm-Duftwolken (grüne Kringel)
  function puffs(x, y, a, t) { if (a <= 0) return; g.save(); for (let i = 0; i < 6; i++) { const p = (t * .45 + i / 6) % 1, px = x + Math.sin(i * 2.3 + t) * 60 - p * 40, py = y - p * 320;
      g.globalAlpha = a * (1 - p) * .85; g.strokeStyle = `rgb(${C.alarm})`; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.arc(px, py, 22 + p * 30, 0, 4.4); g.stroke(); }
    g.globalCompositeOperation = "lighter"; glow(x, y - 120, 220, `rgba(${C.alarm},${.35 * a})`); g.restore(); }
  // Alarm -> Verstärkung fliegt an
  KZ.shot("wBackup", (lt, d, t) => { const k = sm(lt / d); lawn(t, 0, 0, 1); cam(lerp(40, 0, k), TY - 260, lerp(1.9, 1.6, k));
    table(-900, 900); const [rx, ry] = glass(60, TY, 1, { t, noStraw: true });
    const al = sm((lt - .1) / .4); puffs(rx - 40, ry - 40, al, t);
    wAt(rx + 20, ry + 4, .55, { t, alarm: al, look: .2, mood: "angry", seed: 1 });
    const n = 6; for (let i = 0; i < n; i++) { const p = sm((lt - .3 - i * .12) / 1.0); if (p <= 0) continue; const a = Math.PI * (1.08 + i / (n - 1) * .84), R = lerp(900, 260 + (i % 2) * 80, p);
      wAt(rx + Math.cos(a) * R * 1.1, ry - 140 + Math.sin(a) * R * .7 + Math.sin(t * 5 + i) * 12, (Math.cos(a) > 0 ? -.34 : .34), { t: t + i, fly: true, mood: "angry", seed: i }); }
    if (lt > d * .55) stamp("BACKUP!", W * .44, H * .14, (lt - d * .55) / .3, "#2fae6a", .06); });

  KZ.shot("wPicnic", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-60, 20, k), -280, lerp(1.0, 1.12, k));
    table(-300, 700); glass(150, TY, .9, { t });
    // Teller mit Kuchen
    kshape(g, ell(420, TY - 12, 110, 18, 0), "#f4f2ff", { rim: "rgba(255,255,255,.9)", rw: 3, sw: 5 }); kshape(g, (c) => { c.beginPath(); c.moveTo(360, TY - 20); c.lineTo(480, TY - 20); c.lineTo(470, TY - 80); c.lineTo(370, TY - 64); c.closePath(); }, "#f2c88a", { rim: "rgba(255,240,210,.8)", rw: 4, sw: 6 }); g.fillStyle = "#ff6b8a"; g.fillRect(370, TY - 84, 100, 16);
    at(rudi, -330, 0, .95, { t, arm: .25, mouth: lt > d * .6 ? "o" : "smile", look: lt > d * .6 ? .9 : .4 });
    // Wespe fliegt ein und landet
    const p = sm((lt - .3) / (d * .5)); const fx = lerp(800, 174, p), fy = lerp(-900, TY - 198, p) + Math.sin(t * 6) * 20 * (1 - p);
    wAt(fx, fy, .32, { t, fly: p < .98, drink: p >= .98, look: -.2 });
    label("YOUR LEMONADE", W * .5, H * .12, sm((lt - .4) / .3)); });

  KZ.shot("wSplat", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-120, -20, k), -300, lerp(1.1, 1.25, k));
    table(-300, 700); glass(150, TY, .9, { t });
    const hit = d * .8, r = sm(lt / (hit * .7)), sw = lt < hit * .75 ? 0 : sm((lt - hit * .75) / (hit * .25));
    // Rudi rollt die Zeitung, holt aus, schlägt auf den Tisch neben dem Glas
    at(rudi, -330, 0, .95, { t, hold: "paper", arm: lt < hit ? lerp(lerp(.2, 1, r), .35, sw) : .35, paperRot: lt < hit ? lerp(lerp(.5, -1.3, r), .3, sw) : .3, mouth: lt < hit ? "grin" : "o", look: .8 });
    if (lt < hit * .8) wAt(lerp(174, 300, sm(lt / hit)), TY - 198 + (lt > hit * .5 ? -sm((lt - hit * .5) / (hit * .3)) * 180 + 198 : 0), .32, { t, fly: lt > hit * .5, drink: lt <= hit * .5 });
    else { wAt(300, TY - 10, .32, { t, squash: .8, mood: "scared" }); puffs(300, TY - 30, sm((lt - hit) / .4), t); }
    if (lt > hit) { const f = sm((lt - hit) / .15) * (1 - sm((lt - hit - .2) / .3)); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(255,255,255,${.5 * f})`; g.fillRect(0, 0, W, H);
      stamp("SPLAT!", W * .44, H * .16, (lt - hit) / .25, "#e5484d", -.07); } });

  // Infografik 1: Querschnitt Giftblase -> Alarmduft
  KZ.shot("wSac", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.06, sm(lt / d)));
    g.save(); g.translate(W * .52, H * .44); g.scale(1.55, 1.55); wasp(g, { t, look: .3, squash: .15, mood: "scared", seed: 3 });
    // Giftblase im Hinterleib (Querschnitt)
    const a = sm((lt - .4) / .4); g.save(); g.translate(-30, -84); g.rotate(.18); g.globalAlpha = a;
    g.fillStyle = "rgba(10,10,40,.55)"; g.beginPath(); g.ellipse(-130, 6, 62, 32, 0, 0, 7); g.fill();
    g.save(); g.globalCompositeOperation = "lighter"; glow(-140, 8, 70 + Math.sin(t * 6) * 6, `rgba(${C.alarm},.75)`); g.restore();
    g.fillStyle = `rgb(${C.alarm})`; g.beginPath(); g.ellipse(-140, 8, 28, 20, 0, 0, 7); g.fill(); g.strokeStyle = `rgba(${C.alarm},.9)`; g.lineWidth = 5; g.beginPath(); g.moveTo(-160, 12); g.quadraticCurveTo(-185, 16, -200, 18); g.stroke();
    g.restore(); g.restore();
    // Duft steigt auf
    const b = sm((lt - 1.1) / .5); g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 10; i++) { const p = (t * .35 + i / 10) % 1; glow(W * .22 - p * 40 + Math.sin(t * 2 + i) * 40, H * .5 - p * H * .3, 50 + p * 90, `rgba(${C.alarm},${.4 * b * (1 - p)})`); } g.restore();
    label("VENOM SAC", W * .3, H * .6, sm((lt - .6) / .3));
    if (lt > d * .5) stamp("ALARM!", W * .44, H * .14, (lt - d * .5) / .3, "#2fae6a", -.06); });

  // Duftwolke treibt zum Nest in der Hecke
  KZ.shot("wSignal", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-50, 300, k), -380, .78);
    table(-600, 300); glass(-150, TY, .9, { t }); wAt(0, TY - 10, .32, { t, squash: .8 }); puffs(0, TY - 40, 1, t);
    // Nest hängt in einem Strauch rechts
    for (let i = 0; i < 5; i++) kshape(g, ell(480 + i * 90 - 180, -520 - (i % 2) * 60, 170, 120, .2), "#2a7a58", { rim: "rgba(170,255,210,.3)", rw: 5, sw: 10 });
    g.strokeStyle = "#5a3a26"; g.lineWidth = 30; g.lineCap = "round"; g.beginPath(); g.moveTo(180, -700); g.quadraticCurveTo(400, -620, 680, -720); g.stroke();
    const al = sm((lt - d * .5) / .4); nest(360, -660, .9, t, al);
    // Wolke
    const p = sm((lt - .1) / (d * .6)); g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 14; i++) { const q = clamp(p - i * .04, 0, 1); glow(lerp(0, 340, q) + Math.sin(t * 2 + i) * 40, lerp(TY - 40, -500, q) + Math.cos(t * 1.7 + i) * 30, 70 + i * 4, `rgba(${C.alarm},${.28 * (q > 0 ? 1 : 0)})`); } g.restore();
    // Wächter am Eingang
    for (let i = 0; i < 3; i++) wAt(320 + i * 50, -330 + Math.sin(t * 4 + i) * 6, -.28, { t: t + i, mood: al > .5 ? "angry" : undefined, look: -.5, seed: i });
    if (lt > d * .55) stamp("ATTACK!", W * .44, H * .14, (lt - d * .55) / .3, "#e5484d", .07); });

  KZ.shot("wSwarm", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-200, -120, k), -320, lerp(1.0, 1.08, k));
    table(-300, 700); glass(150, TY, .9, { t });
    at(rudi, -330, 0, .95, { t, arm: 1.5 + .5 * sm(lt / .4), mouth: "scream", look: .9, mood: "scared" });
    for (let i = 0; i < 9; i++) { const p = sm((lt - i * .07) / .9), a = i * 2.4; const tx = -260 + Math.cos(a) * 200, ty = -480 + Math.sin(a) * 150;
      wAt(lerp(900 + i * 60, tx, p) + Math.sin(t * 7 + i) * 18, lerp(-700 + i * 40, ty, p) + Math.cos(t * 8 + i) * 14, -.3, { t: t + i, fly: true, mood: "angry", seed: i, sting: .6 }); }
    if (lt > d * .5) stamp("GUARDS", W * .44, H * .14, (lt - d * .5) / .3, "#e5484d", -.06); });

  // Infografik 2: Biene 1 Stich vs. Wespe immer wieder
  KZ.shot("wStings", (lt, d, t) => { navy(t, 1); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const a1 = sm((lt - .1) / .4), a2 = sm((lt - .5) / .4);
    g.save(); g.globalAlpha = a1; g.translate(W * .3, H * .3); g.scale(.95 * easeBack(a1), .95 * easeBack(a1)); bee(g, { t }); g.restore();
    g.save(); g.globalAlpha = a2; g.translate(W * .3, H * .53); g.scale(.85 * easeBack(a2), .85 * easeBack(a2)); wasp(g, { t, sting: .5 + .5 * Math.sin(t * 8), mood: "angry", seed: 5 }); g.restore();
    txt("HONEYBEE", W * .3, H * .1, 46, "#ffd84d", { a: a1, stroke: 8, w: 900 }); txt("WASP", W * .3, H * .385, 46, "#ffd84d", { a: a2, stroke: 8, w: 900 });
    // Zähler
    txt("1×", W * .7, H * .25, 120, "#fff", { a: sm((lt - .7) / .3), stroke: 12, w: 900 });
    const n = Math.min(9, Math.floor(clamp((lt - 1.1) / (d * .6), 0, 1) * 9) + 1);
    txt(lt > d * .8 ? "∞" : n + "×", W * .7, H * .48, 130, "#7ef0b0", { a: sm((lt - 1.1) / .3), stroke: 12, w: 900 });
    label("BARBED", W * .7, H * .32, sm((lt - .9) / .3)); label("SMOOTH", W * .7, H * .56, sm((lt - 1.3) / .3));
    if (lt > d * .75) stamp("AGAIN!", W * .44, H * .64, (lt - d * .75) / .25, "#e5484d", .06); });

  // Quellenkarte
  KZ.shot("wQuote", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .33); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -330, 780, 680, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -340, 780, 680, 34); g.fill();
    g.fillStyle = "#232a6b"; g.beginPath(); g.roundRect(-390, -340, 780, 120, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 40px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("WASHINGTON STATE UNI", 0, -280);
    g.fillStyle = "#e5484d"; g.font = '900 130px "Montserrat"'; g.fillText("“", -320, -170);
    const lines = ["When a yellowjacket", "is smashed, its venom", "sac releases an alarm", "chemical that alerts", "nearby guard wasps."]; g.font = '800 48px "Montserrat"'; g.fillStyle = "#1b1d3a";
    lines.forEach((l, i) => { const a = sm((lt - .4 - i * .3) / .3); g.globalAlpha = a; g.fillText(l, 0, -160 + i * 64); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 30px "Montserrat"'; g.fillText("Peter Landolt, USDA entomologist", 0, 220); g.fillText("WSU Insider, 2013", 0, 262);
    g.restore();
    if (lt > d * .7) stamp("SCIENCE", W * .44, H * .62, (lt - d * .7) / .25, "#7b5cff", -.05); });

  // Infografik 3: Rudi fuchtelt, Bewegungs-Meter schlägt aus
  KZ.shot("wEyes", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-150, -120, k), -300, lerp(1.05, 1.15, k));
    table(-200, 700); glass(250, TY, .9, { t });
    const fl = lt > .4; at(rudi, -300, 0, .95, { t, arm: fl ? .5 + .5 * Math.sin(t * 14) : .2, arm2: fl ? .5 + .5 * Math.sin(t * 13 + 1) : null, mouth: "scream", mood: "scared", look: .6 });
    wAt(lerp(300, 30, sm((lt - .5) / 1.2)) + Math.sin(t * 6) * 30, -560 + Math.cos(t * 5) * 20, -.4, { t, fly: true, mood: "angry", look: -.6, seed: 2 });
    // Facettenauge-Panel + Meter
    g.setTransform(1, 0, 0, 1, 0, 0); const a = sm((lt - .2) / .3); g.save(); g.globalAlpha = a; g.translate(W * .44, H * .12);
    g.fillStyle = "rgba(15,18,50,.85)"; g.beginPath(); g.roundRect(-360, -90, 720, 180, 30); g.fill();
    // Facetten
    g.save(); g.translate(-250, 0); g.fillStyle = "#2a2440"; g.beginPath(); g.ellipse(0, 0, 70, 70, 0, 0, 7); g.fill(); g.strokeStyle = "rgba(160,170,255,.6)"; g.lineWidth = 2;
    for (let y = -60; y <= 60; y += 18) for (let x = -60; x <= 60; x += 20) { const xx = x + (Math.abs(y / 18) % 2 ? 10 : 0); if (xx * xx + y * y > 3600) continue; g.beginPath(); for (let j = 0; j < 6; j++) { const an = j / 6 * 6.283; g.lineTo(xx + Math.cos(an) * 9, y + Math.sin(an) * 9); } g.closePath(); g.stroke(); }
    g.restore();
    const m = fl ? clamp(.25 + .75 * sm((lt - .4) / .8) + Math.sin(t * 20) * .04, 0, 1) : .15;
    g.fillStyle = "rgba(255,255,255,.18)"; g.beginPath(); g.roundRect(-150, 6, 460, 44, 22); g.fill();
    const mg = g.createLinearGradient(-150, 0, 310, 0); mg.addColorStop(0, "#7ef0b0"); mg.addColorStop(.5, "#ffd84d"); mg.addColorStop(1, "#ff4d5a"); g.fillStyle = mg; g.beginPath(); g.roundRect(-150, 6, 460 * m, 44, 22); g.fill();
    g.fillStyle = "#fff"; g.font = '900 44px "Montserrat"'; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("MOVEMENT", -150, -40); g.restore();
    if (lt > d * .6) stamp("TARGET", W * .44, H * .32, (lt - d * .6) / .3, "#e5484d", .06); });

  KZ.shot("wSugar", (lt, d, t) => { const k = sm(lt / d); lawn(t, 0, 0, 1); cam(lerp(30, 70, k), TY - 220, lerp(2.0, 2.25, k));
    table(-700, 700); const [rx, ry] = glass(60, TY, 1, { t, noStraw: true });
    // Tropfen am Glas
    g.fillStyle = "#ffe25a"; g.beginPath(); g.ellipse(rx + 62, ry + 30, 14, 20, 0, 0, 7); g.fill();
    wAt(rx + 20, ry + 4, .55, { t, drink: true, look: .1, seed: 1 });
    g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 3; i++) heart(g, W * (.32 + i * .1), H * .3 - ((t * 50 + i * 30) % 70), 3, "#ff6b8a");
    label("SUGAR", W * .3, H * .58, sm((lt - .3) / .3)); check(W * .3 + 150, H * .58, .5, (lt - .5) / .3);
    label("YOU", W * .62, H * .58, sm((lt - d * .55) / .3)); cross(W * .62 + 110, H * .58, .5, (lt - d * .6) / .3);
    if (lt > d * .3) stamp("JUST HUNGRY", W * .44, H * .14, (lt - d * .3) / .3, "#f2b233", -.05); });

  KZ.shot("wAsk", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-60, -100, k), -260, lerp(1.25, 1.4, k));
    at(rudi, -160, 0, .95, { t, arm: 1.5 + .5 * sm(lt / .5), mouth: "o", look: .3 });
    const a = easeBack(clamp((lt - .1) / .4, 0, 1)); txt("?", W * .66, H * .28, 220 * a + 1, "#ffd84d", { stroke: 14, w: 900 });
    if (lt > d * .3) stamp("WHAT NOW?", W * .44, H * .12, (lt - d * .3) / .3, "#7b5cff", -.05); });

  // Tipp 1: ruhig, langsam weg, Getränk abdecken
  KZ.shot("wCalm", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-40, -120, k), -300, 1.05);
    table(-300, 700); const lid = sm((lt - .3) / .6); glass(150, TY, .9, { t, lid, noStraw: lid > .5 });
    wAt(lerp(260, 420, k), -560 + Math.sin(t * 4) * 20, .3, { t, fly: true, look: .4 });
    const w = sm((lt - d * .45) / (d * .5)); at(rudi, lerp(-330, -620, w), 0, .95, { t, walk: w > 0 && w < 1, slow: true, mouth: "smile", look: .6, arm: lid < 1 ? .55 : .2 });
    label("CALM", W * .22, H * .1, sm((lt - .1) / .3)); label("SLOW", W * .44, H * .1, sm((lt - d * .45) / .3)); label("COVER", W * .66, H * .1, sm((lt - .5) / .3));
    if (lt > d * .65) stamp("CHILL", W * .44, H * .27, (lt - d * .65) / .25, "#2fae6a", .05); });

  // Tipp 2: drinnen unter ein Glas, Karte drunter, draußen freilassen
  KZ.shot("wGlass", (lt, d, t) => { const k = sm(lt / d);
    // Innenraum: Fensterbrett mit Fenster
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#3a3f8a"); bg.addColorStop(1, "#1d2050"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(lerp(0, 40, k), -300, lerp(1.25, 1.35, k));
    const op = sm((lt - d * .55) / .4);
    g.fillStyle = "#5a6cc4"; g.fillRect(-420, -820, 840, 600); g.fillStyle = "#3f9a5a"; g.fillRect(-420, -420, 840, 200); g.fillStyle = "#fff1c4"; g.beginPath(); g.arc(200, -700, 50, 0, 7); g.fill();
    g.save(); g.translate(-420, -820); g.scale(1 - op * .85, 1); g.fillStyle = "rgba(200,230,255,.35)"; g.fillRect(0, 0, 420, 600); g.strokeStyle = "#f4f2ff"; g.lineWidth = 22; g.strokeRect(0, 0, 420, 600); g.restore();
    g.save(); g.translate(420, -820); g.scale(-(1 - op * .85), 1); g.fillStyle = "rgba(200,230,255,.35)"; g.fillRect(0, 0, 420, 600); g.strokeStyle = "#f4f2ff"; g.lineWidth = 22; g.strokeRect(0, 0, 420, 600); g.restore();
    kshape(g, (c) => { c.beginPath(); c.roundRect(-560, -220, 1120, 50, 10); }, "#f4f2ff", { rim: "rgba(255,255,255,.9)", rw: 4, sw: 10 });
    g.fillStyle = "#c9824a"; g.fillRect(-1200, -170, 2400, 1400);
    // Wespe unter Glas, dann frei
    const free = sm((lt - d * .7) / (d * .3));
    if (free <= 0) { wAt(-60, -220, .45, { t, look: .3, walk: 0 }); const gp = sm((lt - .2) / .5); g.save(); g.translate(-60, lerp(-700, -220, gp)); g.fillStyle = "rgba(220,240,255,.25)"; g.beginPath(); g.moveTo(-130, 0); g.lineTo(-110, -230); g.lineTo(110, -230); g.lineTo(130, 0); g.closePath(); g.fill(); g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 6; g.stroke(); g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(-100, -210, 14, 180); g.restore();
      const cp = sm((lt - .9) / .5); if (cp > 0) { g.fillStyle = "#fff"; g.fillRect(lerp(-500, -200, cp), -224, 300, 8); } }
    else { wAt(lerp(-60, 300, free), lerp(-300, -760, free), .45, { t, fly: true, look: .6 }); for (let i = 0; i < 3; i++) heart(g, lerp(-60, 300, free) - 60 - i * 40, lerp(-300, -760, free) + 40 + i * 30, 2.5, "#ff6b8a"); }
    label("GLASS + CARD", W * .44, H * .62, sm((lt - .5) / .3) * (1 - op));
    if (lt > d * .7) stamp("FREE!", W * .44, H * .62, (lt - d * .7) / .25, "#2fae6a", -.06); });
})();
