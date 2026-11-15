// Szenendatei "Mice Don't Actually Love Cheese" (Hausmaus Mus musculus, Comedy-Story + Mix-Stil, 15.11.2026).
// Quellen: BBC News 2006 (Dr David Holmes, Manchester Metropolitan University: Mäuse fressen v. a. Getreide und Obst, Käse riecht/schmeckt zu stark),
// Live Science 2023 (Phifer-Rixey, Drexel: Käse kein Lieblingsessen, Erdnussbutter schon), Univ. of Nebraska Extension (bevorzugen Getreide; Köder Erdnussbutter).
// Helfer txt/stamp/navy/rudi/at/kitchen aus fly-one-day übernommen. Maus neu gezeichnet: Seitenansicht (große runde Ohren mit rosa Innenseite,
// spitze Schnauze, rosa Nase, Schnurrhaare, rosa Pfoten, langer nackter Schwanz), Sitzpose mit Futter in den Vorderpfoten, Frontkopf.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86" };
  const F = { eye: "#c0392b", eyeD: "#7a1a14", eyeL: "#ff8a6a", thor: "#8a8d99", thorD: "#3a3c48", abd: "#b39a62", abdD: "#5a4a2a", leg: "#1e1a22", wing: "rgba(225,240,255,.38)", vein: "rgba(90,70,60,.55)" };
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
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .5, H * .4, 700, tint ? "rgba(80,220,180,.18)" : "rgba(120,140,255,.2)"); g.restore(); }
  function zoomScreen(z) { g.setTransform(z, 0, 0, z, W / 2 * (1 - z), H * .42 * (1 - z)); }
  function cross(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#ff4d5a"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(-50, -50); g.lineTo(50, 50); g.moveTo(50, -50); g.lineTo(-50, 50); g.stroke(); g.restore(); }
  function check(x, y, s, p) { if (p <= 0) return; const a = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(a * s, a * s); g.strokeStyle = "#7ef0b0"; g.lineWidth = 22; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(-50, 0); g.lineTo(-14, 36); g.lineTo(54, -40); g.stroke(); g.restore(); }
  function qmark(x, y, s, a) { if (a <= 0) return; txt("?", x, y, 110 * s, "#fff", { a, stroke: 14, w: 900 }); }
  function bubble(s, x, y, a, r) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(r || 0); g.scale(easeBack(Math.min(a, 1)), easeBack(Math.min(a, 1)));
    g.font = '800 50px "Montserrat"'; const w = g.measureText(s).width + 64; g.fillStyle = "#fff"; g.beginPath(); g.roundRect(-w / 2, -50, w, 100, 50); g.fill(); g.beginPath(); g.moveTo(-24, 42); g.lineTo(-44, 84); g.lineTo(8, 46); g.fill();
    g.fillStyle = "#1b1d3a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 0, 2); g.restore(); }
  function sweat(x, y, t, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; for (let i = 0; i < 3; i++) { const ph = (t * 1.6 + i / 3) % 1; g.fillStyle = "#8fd8ff"; g.beginPath(); const sx = x + (i - 1) * 46, sy = y + ph * 90; g.moveTo(sx, sy - 22); g.quadraticCurveTo(sx + 16, sy, sx, sy + 12); g.quadraticCurveTo(sx - 16, sy, sx, sy - 22); g.fill(); } g.restore(); }
  function card(x, y, w, h, p, head, col) { const k = easeBack(clamp(p, 0, 1)); if (k <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(k, k);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-w / 2 + 10, -h / 2 + 12, w, h, 30); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 30); g.fill();
    if (head) { g.fillStyle = col || "#2f6fd0"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, 100, [30, 30, 0, 0]); g.fill(); g.fillStyle = "#fff"; g.font = '900 44px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(head, 0, -h / 2 + 52); }
    g.restore(); }

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
  // ================= Küche (Boden y=0, Arbeitsplatte oben y=-420) =================
  const TOP = -420;
  function kitchen(t, cx, cy, z, o) { o = o || {}; const night = o.night || 0, mess = o.mess || 0; g.setTransform(1, 0, 0, 1, 0, 0);
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2f6c86"); bg.addColorStop(1, "#173a52"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(cx, cy, z);
    g.strokeStyle = "rgba(255,255,255,.12)"; g.lineWidth = 4; for (let x = -2400; x < 2400; x += 110) { g.beginPath(); g.moveTo(x, -1800); g.lineTo(x, TOP); g.stroke(); } for (let y = -1800; y < TOP; y += 110) { g.beginPath(); g.moveTo(-2400, y); g.lineTo(2400, y); g.stroke(); }
    // Fenster
    kshape(g, (c) => { c.beginPath(); c.roundRect(-180, -1240, 520, 560, 26); }, "#f2ead8", { rw: 5, sw: 14 });
    const sg = g.createLinearGradient(0, -1210, 0, -710); if (night) { sg.addColorStop(0, "#0f1a48"); sg.addColorStop(1, "#2a3a88"); } else { sg.addColorStop(0, "#6ab8ff"); sg.addColorStop(1, "#bfe6ff"); }
    g.fillStyle = sg; g.beginPath(); g.roundRect(-152, -1212, 464, 504, 16); g.fill();
    if (night) { g.fillStyle = "#fff4d6"; g.beginPath(); g.arc(220, -1110, 40, 0, 7); g.fill(); g.fillStyle = "#0f1a48"; g.beginPath(); g.arc(240, -1124, 34, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,230,.8)"; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(-120 + (i * 97) % 400, -1180 + (i * 131) % 380, 3 + Math.sin(t * 3 + i), 0, 7); g.fill(); } }
    else { g.save(); g.globalCompositeOperation = "lighter"; glow(220, -1100, 160, "rgba(255,240,180,.6)"); g.restore(); g.fillStyle = "#fff6c8"; g.beginPath(); g.arc(220, -1100, 46, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < 2; i++) { const xx = -100 + ((t * 20 + i * 240) % 420); g.beginPath(); g.ellipse(xx, -900 + i * 70, 70, 24, 0, 0, 7); g.fill(); } }
    g.fillStyle = "#f2ead8"; g.fillRect(74, -1212, 12, 504); g.fillRect(-152, -966, 464, 12);
    // Uhr
    kshape(g, ell(-640, -1080, 110, 110, 0), "#fff6e6", { rw: 5, sw: 10 }); const hs = o.clockSpin ? t * 4 : 0;
    g.strokeStyle = "#1b1d3a"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(-640, -1080); g.lineTo(-640 + Math.sin(hs) * 50, -1080 - Math.cos(hs) * 50); g.moveTo(-640, -1080); g.lineTo(-640 + Math.sin(hs * 12 + 1.2) * 78, -1080 - Math.cos(hs * 12 + 1.2) * 78); g.stroke();
    // Tür links
    kshape(g, (c) => { c.beginPath(); c.roundRect(-1500, -1100, 420, 1100, 14); }, "#b9773f", { rim: "rgba(255,230,190,.5)", rw: 5, sw: 14 });
    g.fillStyle = "rgba(0,0,0,.15)"; g.fillRect(-1450, -1040, 320, 420); g.fillRect(-1450, -560, 320, 480); g.fillStyle = "#ffd84a"; g.beginPath(); g.arc(-1130, -540, 18, 0, 7); g.fill();
    // Arbeitsplatte + Schränke
    kshape(g, (c) => { c.beginPath(); c.roundRect(-900, TOP + 40, 2200, -TOP - 40, 10); }, "#e9dfcf", { rw: 5, sw: 12 }); kshape(g, (c) => { c.beginPath(); c.roundRect(-940, TOP, 2280, 50, 12); }, "#f2b233", { rw: 4, sw: 8 });
    g.fillStyle = "rgba(60,40,30,.35)"; for (let x = -840; x < 1300; x += 360) { g.fillRect(x, TOP + 80, 6, 300); g.beginPath(); g.roundRect(x + 140, TOP + 200, 70, 16, 8); g.fill(); }
    // Obstschale + Brot
    kshape(g, (c) => { c.beginPath(); c.moveTo(300, TOP - 90); c.quadraticCurveTo(400, TOP + 10, 500, TOP - 90); c.closePath(); }, "#3f8fe0", { rim: "rgba(220,240,255,.7)", rw: 4, sw: 8 });
    for (const [bx, by, col] of [[350, TOP - 110, "#ff5a4a"], [410, TOP - 128, "#ffcf3a"], [460, TOP - 108, "#7ed36a"]]) kshape(g, ell(bx, by, 38, 34, 0), col, { rim: "rgba(255,255,255,.6)", rw: 4, sw: 6 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(-460, TOP); c.bezierCurveTo(-470, TOP - 120, -200, TOP - 130, -200, TOP); c.closePath(); }, "#d99a4e", { rim: "rgba(255,230,180,.7)", rw: 5, sw: 10 });
    g.strokeStyle = "rgba(120,60,20,.5)"; g.lineWidth = 6; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-410 + i * 70, TOP - 80); g.lineTo(-380 + i * 70, TOP - 110); g.stroke(); }
    // Mülleimer
    kshape(g, (c) => { c.beginPath(); c.moveTo(1380, -300); c.lineTo(1620, -300); c.lineTo(1590, 0); c.lineTo(1410, 0); c.closePath(); }, "#5a6ab0", { rim: "rgba(200,210,255,.6)", rw: 4, sw: 10 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(1370, -330 - mess * 40, 260, 36, 12); }, "#46548f", { rw: 3, sw: 6 });
    if (mess) { kshape(g, ell(1450, -320, 50, 30, .3), "#ffd84a", { rw: 3, sw: 4 }); kshape(g, ell(1550, -326, 40, 22, -.4), "#9a6a3a", { rw: 3, sw: 4 }); }
    // Boden
    const fg = g.createLinearGradient(0, 0, 0, 900); fg.addColorStop(0, "#c98a5a"); fg.addColorStop(1, "#7a4a2a"); g.fillStyle = fg; g.fillRect(-3000, 0, 6000, 3000);
    g.strokeStyle = "rgba(0,0,0,.15)"; g.lineWidth = 4; for (let x = -3000; x < 3000; x += 160) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 3000); g.stroke(); }
  }
  function nightTint(a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(12,14,60,${.5 * a})`; g.fillRect(0, 0, W, H); g.globalCompositeOperation = "lighter"; glow(W * .3, H * .32, 520, `rgba(255,200,120,${.25 * a})`); g.restore(); }
  function chair(x) { kshape(g, (c) => { c.beginPath(); c.roundRect(x - 120, -310, 240, 40, 12); }, "#8a5a32", { rim: "rgba(255,220,180,.5)", rw: 4, sw: 8 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(x - 130, -640, 34, 360, 12); }, "#8a5a32", { rw: 4, sw: 8 });
    g.fillStyle = "#6a4222"; for (const lx of [x - 110, x + 90]) g.fillRect(lx, -280, 22, 280); }
  function sitRudi(x, t, o) { chair(x); return at(rudi, x, -170, 1, Object.assign({ t, sit: 298 }, o)); }

  function bar(x, yBase, w, h, col, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a * 2, 0, 1); kshape(g, (c) => { c.beginPath(); c.roundRect(x - w / 2, yBase - h, w, h, [18, 18, 0, 0]); }, col, { rim: "rgba(255,255,255,.6)", rw: 5, sw: 10 }); g.restore(); }
  function wobbleAll(lt, d, t) { const z = 1 + .07 * sm(lt / d) + .012 * Math.sin(t * 3.1), ox = Math.sin(t * 1.7) * 10; const cv = g.canvas; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(cv, W * .44 * (1 - z) + ox, H * .4 * (1 - z), W * z, H * z); g.restore(); }
  function sparkle(x, y, r, a) { if (a <= 0) return; g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, r * 2.4, `rgba(255,230,140,${.6 * a})`); g.fillStyle = `rgba(255,250,220,${a})`; g.beginPath(); for (let i = 0; i < 8; i++) { const ang = i / 8 * 6.283, rr = i % 2 ? r * .3 : r; g.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } g.fill(); g.restore(); }
  function zzz(x, y, t, s) { for (let i = 0; i < 3; i++) { const ph = (t * .6 + i / 3) % 1; g.save(); g.globalAlpha = Math.sin(ph * Math.PI); g.fillStyle = "#fff"; g.font = `900 ${Math.round((34 + i * 10) * (s || 1))}px "Montserrat"`; g.textAlign = "center"; g.fillText("z", x + ph * 60 * (s || 1), y - ph * 120 * (s || 1)); g.restore(); } }

  // ================= Hausmaus (Mus musculus), Seitenansicht, Kopf rechts, Füße y=0, Länge ~250 + Schwanz =================
  // o: t, walk (Tempo), snub (0..1 Nase hoch, Augen zu = "igitt"), sit (aufrecht, knabbert), food ("cookie"|"flake"|"pb"|null),
  //    sleep, look, mood, seed, fat (0..1 dicker Bauch), sniff (Schnurrhaare zittern)
  const M = { fur: "#a39588", furD: "#7d7066", furL: "rgba(255,245,230,.7)", belly: "#efe2d2", ear: "#f3a3b2", earO: "#b3a397", skin: "#f2a7ae", nose: "#ff8296", tail: "#e7a9ad" };
  function mFoot(c, x, y, rx) { c.fillStyle = M.skin; c.beginPath(); c.ellipse(x, y, rx, rx * .38, 0, 0, 7); c.fill(); c.strokeStyle = "rgba(160,70,80,.5)"; c.lineWidth = 2; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(x + rx * .55, y + i * 4); c.lineTo(x + rx, y + i * 5); c.stroke(); } }
  function mTail(c, x0, y0, t, seed, len) { const w = Math.sin(t * 2.4 + seed) * 22; len = len || 1;
    for (const [lw, col] of [[16, M.tail], [7, "rgba(255,225,228,.7)"]]) { c.strokeStyle = col; c.lineWidth = lw; c.lineCap = "round"; c.beginPath(); c.moveTo(x0, y0);
      c.bezierCurveTo(x0 - 120 * len, y0 + 60, x0 - 210 * len, y0 - 10 + w, x0 - 300 * len, y0 + 10 + w * .5); c.quadraticCurveTo(x0 - 350 * len, y0 + 20, x0 - 380 * len, y0 - 20 - w * .6); c.stroke(); } }
  function mHead(c, o, t) { // Kopf um Hals (70,-110)
    const sn = o.snub || 0, seed = o.seed || 0;
    c.save(); c.translate(70, -112); c.rotate(-sn * .55 + (o.nod ? Math.sin(t * 9) * .06 : 0)); c.translate(-70, 112);
    // hinteres Ohr
    kshape(c, ell(64, -196, 40, 46, -.3), M.earO, { rw: 3, sw: 6 }); c.fillStyle = "#d98f9c"; c.beginPath(); c.ellipse(64, -196, 26, 30, -.3, 0, 7); c.fill();
    // Kopf + Schnauze
    kshape(c, (c) => { c.beginPath(); c.moveTo(40, -150); c.bezierCurveTo(70, -190, 150, -178, 200, -134); c.quadraticCurveTo(236, -112, 232, -100); c.quadraticCurveTo(220, -84, 180, -80); c.bezierCurveTo(130, -66, 70, -58, 40, -80); c.closePath(); }, M.fur, { rim: M.furL, shadow: "rgba(70,40,30,.25)", rw: 6, sw: 14 });
    c.fillStyle = M.belly; c.globalAlpha = .75; c.beginPath(); c.ellipse(150, -86, 50, 14, -.12, 0, 7); c.fill(); c.globalAlpha = 1;
    // Nase
    kshape(c, ell(232, -104, 13, 11, 0), M.nose, { rim: "rgba(255,255,255,.7)", rw: 3, sw: 3 });
    // Mund
    c.strokeStyle = "rgba(90,40,40,.6)"; c.lineWidth = 3; c.lineCap = "round"; c.beginPath(); c.moveTo(226, -93); c.quadraticCurveTo(220, -84, 210, -86); c.stroke();
    if (o.chew) { c.fillStyle = "#fff"; c.fillRect(214, -90, 6, 8 + Math.abs(Math.sin(t * 14)) * 3); }
    // Auge
    if (o.sleep || sn > .5) { c.strokeStyle = "#1b1724"; c.lineWidth = 5; c.beginPath(); c.arc(150, -128, 13, sn > .5 ? Math.PI + .3 : .3, sn > .5 ? -.3 : Math.PI - .3, false); c.stroke(); }
    else fig.eye(c, 150, -128, 17, { t, seed: seed + 4, look: o.look ?? .6, mood: o.mood, lid: M.furD });
    // vorderes Ohr (groß, rund, rosa innen)
    kshape(c, ell(92, -192, 50, 56, -.2), M.earO, { rim: M.furL, rw: 4, sw: 8 });
    kshape(c, ell(96, -188, 34, 40, -.2), M.ear, { rim: "rgba(255,230,235,.6)", rw: 3, sw: 6 });
    // Schnurrhaare
    const wz = (o.sniff ?? 1) * Math.sin(t * 16 + seed) * 3; c.strokeStyle = "rgba(255,255,255,.85)"; c.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(214, -100); c.quadraticCurveTo(250, -112 + i * 12 + wz, 290, -126 + i * 20 + wz * 1.5); c.stroke(); }
    c.restore(); }
  function mouse(c, o) { o = o || {}; const t = o.t || 0, seed = o.seed || 0, br = Math.sin(t * 3 + seed) * 2.5, fat = o.fat || 0;
    if (o.sit) return mouseSit(c, o);
    const mv = o.walk ? 1 : 0, ph = t * (o.walk || 0), bob = mv ? Math.abs(Math.sin(ph)) * 10 : 0;
    c.save(); c.translate(0, -bob);
    mTail(c, -118, -40, t, seed);
    // ferne Füße
    c.globalAlpha = .8; mFoot(c, -60 - Math.sin(ph + Math.PI) * 26 * mv, -6, 42); mFoot(c, 112 + Math.sin(ph) * 24 * mv, -6, 24); c.globalAlpha = 1;
    // Körper (tropfenförmig, Rücken gewölbt)
    kshape(c, (c) => { c.beginPath(); c.moveTo(-130, -40); c.bezierCurveTo(-150, -130 - fat * 20 + br, -40, -170 - fat * 20 + br, 60, -150 + br); c.bezierCurveTo(110, -138, 120, -90, 110, -50); c.bezierCurveTo(100, -18 + fat * 10, 0, -10 + fat * 14, -80, -16 + fat * 10); c.quadraticCurveTo(-128, -20, -130, -40); c.closePath(); }, M.fur, { rim: M.furL, shadow: "rgba(70,40,30,.28)", rw: 7, sw: 20 });
    c.fillStyle = M.belly; c.globalAlpha = .8; c.beginPath(); c.ellipse(20, -26 + fat * 6, 80 + fat * 14, 16 + fat * 10, 0, 0, 7); c.fill(); c.globalAlpha = 1;
    // Hinterbein (Oberschenkel) + nahe Füße
    kshape(c, ell(-66, -58, 52, 44, -.2), M.fur, { rim: M.furL, rw: 5, sw: 10 });
    mFoot(c, -48 + Math.sin(ph) * 26 * mv, -4, 46);
    c.strokeStyle = M.fur; c.lineWidth = 16; c.lineCap = "round"; c.beginPath(); c.moveTo(96, -60); c.lineTo(126 + Math.sin(ph + Math.PI) * 24 * mv, -10); c.stroke();
    mFoot(c, 134 + Math.sin(ph + Math.PI) * 24 * mv, -5, 24);
    mHead(c, o, t);
    c.restore(); }
  function food(c, kind, x, y, s, t) { c.save(); c.translate(x, y); c.scale(s, s);
    if (kind === "cookie") { kshape(c, ell(0, 0, 40, 40, 0), "#d9a35a", { rim: "rgba(255,230,180,.8)", rw: 4, sw: 6 }); c.fillStyle = "#5a3220"; for (const [a, b] of [[-14, -10], [12, -16], [4, 10], [-18, 14], [20, 8]]) { c.beginPath(); c.arc(a, b, 6, 0, 7); c.fill(); }
      c.fillStyle = "#1b1724"; c.beginPath(); c.arc(38, -22, 16, 0, 7); c.fill(); }
    else if (kind === "flake") { kshape(c, (c) => { c.beginPath(); c.moveTo(-36, -10); c.quadraticCurveTo(-10, -40, 34, -18); c.quadraticCurveTo(44, 10, 10, 26); c.quadraticCurveTo(-36, 24, -36, -10); c.closePath(); }, "#f2b84a", { rim: "rgba(255,240,190,.8)", rw: 4, sw: 6 }); }
    else if (kind === "grain") { kshape(c, ell(0, 0, 14, 26, .3), "#e8c06a", { rim: "rgba(255,240,190,.8)", rw: 3, sw: 4 }); }
    c.restore(); }
  function mouseSit(c, o) { const t = o.t || 0, seed = o.seed || 0, br = Math.sin(t * 3 + seed) * 2.5, fat = o.fat || 0, nib = o.food ? Math.sin(t * 12) * 4 : 0;
    c.save();
    mTail(c, -70, -18, t, seed, .8);
    mFoot(c, -10, -6, 50);
    // Körper aufrecht (Birne)
    kshape(c, (c) => { c.beginPath(); c.moveTo(-90, -30); c.bezierCurveTo(-120 - fat * 30, -150, -60, -250 + br, 10, -250 + br); c.bezierCurveTo(70, -248 + br, 90 + fat * 30, -150, 80, -40); c.quadraticCurveTo(0, -4, -90, -30); c.closePath(); }, M.fur, { rim: M.furL, shadow: "rgba(70,40,30,.28)", rw: 7, sw: 20 });
    c.fillStyle = M.belly; c.globalAlpha = .85; c.beginPath(); c.ellipse(30 + fat * 6, -110, 46 + fat * 22, 88, -.15, 0, 7); c.fill(); c.globalAlpha = 1;
    kshape(c, ell(-40, -60, 56, 50, 0), M.fur, { rim: M.furL, rw: 5, sw: 10 });
    // Kopf (ohne Rotation, Schnauze nach rechts) – mHead erwartet Hals bei (70,-112); hochsetzen
    c.save(); c.translate(-50, -150 + nib * .5); mHead(c, Object.assign({}, o, { chew: !!o.food }), t); c.restore();
    // Vorderpfoten halten Futter vor dem Mund
    const fx = 150, fy = -232 + nib;
    if (o.food) food(c, o.food, fx + 10, fy + 6, 1.05, t);
    c.strokeStyle = M.fur; c.lineWidth = 16; c.lineCap = "round"; c.beginPath(); c.moveTo(60, -180); c.quadraticCurveTo(100, -190, fx - 18, fy + 22); c.stroke();
    c.fillStyle = M.skin; c.beginPath(); c.arc(fx - 16, fy + 22, 11, 0, 7); c.fill(); c.beginPath(); c.arc(fx - 4, fy + 32, 10, 0, 7); c.fill();
    if (o.food) for (let i = 0; i < 4; i++) { const ph = (t * 1.4 + i / 4) % 1; c.fillStyle = `rgba(230,180,90,${1 - ph})`; c.beginPath(); c.arc(fx + (i - 1.5) * 18, fy + 40 + ph * 200, 5, 0, 7); c.fill(); }
    c.restore(); }
  function mouseAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); mouse(g, o); g.restore(); }

  // ================= Requisiten =================
  // Käsekeil (Emmentaler) – Boden y=0, Breite w, Höhe h, spitze Seite links
  function cheese(x, s, t, o) { o = o || {}; g.save(); g.translate(x, o.y || 0); g.scale(s, s);
    const w = 300, h = 170, d = 70;
    kshape(g, (c) => { c.beginPath(); c.moveTo(-w / 2, 0); c.lineTo(w / 2, 0); c.lineTo(w / 2, -h); c.lineTo(-w / 2, -h * .25); c.closePath(); }, "#ffc93a", { rim: "rgba(255,245,190,.85)", shadow: "rgba(160,90,0,.3)", rw: 6, sw: 18 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(-w / 2, -h * .25); c.lineTo(w / 2, -h); c.lineTo(w / 2 - d, -h - d * .55); c.lineTo(-w / 2 - d * .6, -h * .25 - d * .35); c.closePath(); }, "#ffe27a", { rim: "rgba(255,255,230,.9)", rw: 4, sw: 6 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, -h); c.lineTo(w / 2 + 34, -h + 30); c.lineTo(w / 2 + 34, 18); c.closePath(); }, "#e8a51e", { rw: 3, sw: 6 });
    g.fillStyle = "#e3a21c"; for (const [hx, hy, r] of [[-70, -40, 22], [20, -70, 30], [100, -40, 18], [90, -120, 22], [-10, -24, 12], [40, -128, 12]]) { g.beginPath(); g.ellipse(hx, hy, r, r * .9, 0, 0, 7); g.fill(); g.fillStyle = "rgba(150,80,0,.35)"; g.beginPath(); g.ellipse(hx + r * .2, hy + r * .2, r * .7, r * .6, 0, 0, 7); g.fill(); g.fillStyle = "#e3a21c"; }
    if (o.stink) { g.strokeStyle = `rgba(150,230,110,${.75 * o.stink})`; g.lineWidth = 12; g.lineCap = "round";
      for (let i = 0; i < 3; i++) { const ph = (t * .7 + i / 3) % 1, bx = -60 + i * 80; g.globalAlpha = Math.sin(ph * Math.PI); g.beginPath(); for (let k = 0; k <= 12; k++) { const yy = -h - 40 - k * 16 - ph * 80, xx = bx + Math.sin(k * .8 + t * 4 + i) * 18; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } g.globalAlpha = 1; }
    g.restore(); }
  function trap(x, s, t, snap) { g.save(); g.translate(x, 0); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-150, -40, 300, 40, 8); }, "#c98a4a", { rim: "rgba(255,225,180,.7)", rw: 4, sw: 8 });
    g.strokeStyle = "rgba(120,60,20,.45)"; g.lineWidth = 3; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-140, -32 + i * 8); g.lineTo(140, -30 + i * 8); g.stroke(); }
    g.strokeStyle = "#c7ccd8"; g.lineWidth = 9; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(-110, -44); g.lineTo(-110, -110); g.lineTo(-10, -110); g.lineTo(-10, -44); g.stroke();
    g.beginPath(); g.arc(-60, -48, 16, 0, 7); g.stroke(); g.beginPath(); g.moveTo(-10, -50); g.lineTo(80, -54); g.stroke();
    kshape(g, (c) => { c.beginPath(); c.roundRect(60, -64, 60, 22, 6); }, "#aeb4c4", { rw: 3, sw: 4 });
    g.restore(); }
  function cookieJar(x, s, t, tipped) { g.save(); g.translate(x, 0); g.scale(s, s); if (tipped) { g.translate(0, -90); g.rotate(-1.45); g.translate(0, 90); }
    kshape(g, (c) => { c.beginPath(); c.roundRect(-110, -260, 220, 260, 40); }, "rgba(190,230,255,.55)", { rim: "rgba(255,255,255,.9)", rw: 6, sw: 10 });
    for (let i = 0; i < 5; i++) food(g, "cookie", -50 + (i % 3) * 50, -50 - Math.floor(i / 3) * 60, .95, t);
    if (!tipped) kshape(g, (c) => { c.beginPath(); c.roundRect(-120, -290, 240, 40, 14); }, "#e5484d", { rim: "rgba(255,200,200,.7)", rw: 4, sw: 6 });
    g.restore(); if (tipped) { for (let i = 0; i < 3; i++) food(g, "cookie", x + 170 * s + i * 70 * s, -34 * s, s * .95, t); } }
  function cereal(x, s, t, o) { o = o || {}; g.save(); g.translate(x, 0); g.scale(s, s); if (o.tipped) { g.translate(0, -60); g.rotate(1.5); g.translate(0, 60); }
    kshape(g, (c) => { c.beginPath(); c.roundRect(-110, -360, 220, 360, 10); }, "#3f8fe0", { rim: "rgba(220,240,255,.7)", rw: 5, sw: 12 });
    g.fillStyle = "#ffd84a"; g.beginPath(); g.arc(0, -230, 70, 0, 7); g.fill(); g.fillStyle = "#e5484d"; g.font = '900 52px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("OATS", 0, -226);
    for (let i = 0; i < 5; i++) food(g, "flake", -60 + (i % 3) * 60, -90 + Math.floor(i / 3) * 40, .55, t);
    g.restore();
    if (o.tipped) for (let i = 0; i < 18; i++) food(g, "flake", x + (200 + (i * 53) % 340) * s, (-14 - (i % 4) * 22) * s, s * .7, t); }
  function tin(x, s, t, lid) { g.save(); g.translate(x, TOP); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-100, -220, 200, 220, 18); }, "#c7ccd8", { rim: "rgba(255,255,255,.9)", shadow: "rgba(40,40,80,.3)", rw: 6, sw: 14 });
    g.fillStyle = "#2fae6a"; g.fillRect(-100, -150, 200, 60); g.fillStyle = "#fff"; g.font = '900 36px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("OATS", 0, -118);
    const ly = -220 - (1 - lid) * 140; g.save(); g.translate(0, ly); g.rotate((1 - lid) * -.5); kshape(g, (c) => { c.beginPath(); c.roundRect(-112, -30, 224, 34, 12); }, "#9aa2b8", { rim: "rgba(255,255,255,.9)", rw: 4, sw: 6 }); g.restore();
    g.restore(); }
  function hole(x) { g.fillStyle = "#14101c"; g.beginPath(); g.moveTo(x - 70, 0); g.lineTo(x - 70, -60); g.arc(x, -60, 70, Math.PI, 0); g.lineTo(x + 70, 0); g.closePath(); g.fill();
    g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 8; g.stroke(); }
  function pbJar(x, y, s, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); const k = easeBack(Math.min(a, 1)); g.scale(s * k, s * k);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-70, -80, 140, 160, 24); }, "#c8843c", { rim: "rgba(255,230,190,.8)", rw: 5, sw: 10 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-78, -112, 156, 40, 12); }, "#e5484d", { rim: "rgba(255,200,200,.8)", rw: 4, sw: 6 });
    g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-58, -40, 116, 70, 12); g.fill(); g.fillStyle = "#8a4a1e"; g.font = '900 30px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("PB", 0, -4); g.restore(); }
  function mouseFace(x, y, s, t, o) { // Frontkopf für Infografiken
    o = o || {}; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(s, s); g.rotate(o.tilt || 0);
    for (const sx of [-1, 1]) { kshape(g, ell(sx * 92, -70, 62, 66, sx * .3), M.earO, { rim: M.furL, rw: 4, sw: 8 }); kshape(g, ell(sx * 92, -66, 42, 46, sx * .3), M.ear, { rw: 3, sw: 5 }); }
    kshape(g, (c) => { c.beginPath(); c.moveTo(-90, -30); c.bezierCurveTo(-96, -110, 96, -110, 90, -30); c.quadraticCurveTo(70, 50, 0, 90); c.quadraticCurveTo(-70, 50, -90, -30); c.closePath(); }, M.fur, { rim: M.furL, shadow: "rgba(70,40,30,.25)", rw: 6, sw: 14 });
    c_eyes(o, t); kshape(g, ell(0, 70, 16, 12, 0), M.nose, { rim: "rgba(255,255,255,.7)", rw: 3, sw: 3 });
    g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 3; for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(sx * 20, 72); g.lineTo(sx * 120, 50 + i * 22 + Math.sin(t * 14 + i) * 3); g.stroke(); }
    if (o.yuck) { g.fillStyle = "#ff6f8a"; g.beginPath(); g.ellipse(10, 104, 14, 20, .3, 0, 7); g.fill(); }
    g.restore();
    function c_eyes(o, t) { if (o.yuck) { g.strokeStyle = "#1b1724"; g.lineWidth = 7; g.lineCap = "round"; for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 52, -12); g.lineTo(sx * 30, 0); g.lineTo(sx * 52, 12); g.stroke(); } }
      else { fig.eye(g, -38, 0, 22, { t, seed: 2, look: 0 }); fig.eye(g, 38, 0, 22, { t, seed: 2, look: 0 }); } } }
  function grainIcon(x, y, s, t) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(s, s); g.strokeStyle = "#c99a3a"; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 70); g.lineTo(0, -70); g.stroke();
    for (let i = 0; i < 5; i++) for (const sx of [-1, 1]) { g.save(); g.translate(sx * 14, -50 + i * 22); g.rotate(sx * .5); kshape(g, ell(0, 0, 11, 20, 0), "#f2c862", { rim: "rgba(255,245,200,.8)", rw: 3, sw: 3 }); g.restore(); } g.restore(); }
  function seedIcon(x, y, s) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(s, s); for (const [a, b, r] of [[-30, 10, .4], [20, -20, -.3], [30, 30, .9], [-10, -40, 1.4]]) { g.save(); g.translate(a, b); g.rotate(r); kshape(g, (c) => { c.beginPath(); c.moveTo(0, -34); c.quadraticCurveTo(22, 0, 0, 34); c.quadraticCurveTo(-22, 0, 0, -34); }, "#3a3440", { rim: "rgba(255,255,255,.5)", rw: 3, sw: 3 }); g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -26); g.lineTo(0, 26); g.stroke(); g.restore(); } g.restore(); }
  function fruitIcon(x, y, s) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(s, s); kshape(g, ell(0, 8, 62, 58, 0), "#ec3a2e", { rim: "rgba(255,210,200,.85)", rw: 5, sw: 10 }); g.strokeStyle = "#6a3a1e"; g.lineWidth = 8; g.beginPath(); g.moveTo(0, -46); g.lineTo(6, -72); g.stroke(); kshape(g, ell(30, -64, 26, 12, -.4), "#4cb862", { rw: 3, sw: 3 }); g.restore(); }
  function cheeseIcon(x, y, s, t, stink) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y + 60 * s); cheese(0, s * .55, t, { stink }); g.restore(); }

  // ================= Shots =================
  const HOLE = -1010;
  function hookM(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    kitchen(t, lerp(-575, -565, k), TOP - 170, lerp(1.55, 1.65, k));
    cheese(-770, .75, t, { stink: 1, y: TOP });
    const sn = loop ? 1 : clamp((lt - d * .25) / .3, 0, 1);
    mouseAt(-470, TOP, .9, { t, snub: sn, seed: 1 });
    if (loop) return;
    stamp("NOPE.", W * .42, H * .63, (lt - d * .55) / .22, "#e5484d", -.06); }
  KZ.shot("mHook", (lt, d, t) => hookM(lt, d, t, false));
  function shop(lt, d, t, k) { kitchen(t, lerp(-720, -680, k), -520, lerp(1.0, 1.08, k)); hole(HOLE);
    const peek = sm((lt - d * .35) / .3); g.save(); g.beginPath(); g.rect(HOLE - 70, -140, 200, 140); g.clip(); mouseAt(HOLE - 160 + peek * 110, 0, .5, { t, look: -.4, seed: 2 }); g.restore();
    const r = at(rudi, -560, 0, 1, { t, arm: .75, mouth: "grin", look: -.3 }, true);
    g.save(); g.translate(-560 - r.hx - 90, r.hy + 60); cheese(0, .55, t, { stink: 1 }); g.restore(); }
  KZ.shot("mBelieve", (lt, d, t) => { const k = sm(lt / d); shop(lt, d, t, k);
    bubble("FOR YOU, BUDDY!", W * .52, H * .12, sm((lt - .1) / .3), .04);
    stamp("STINKIEST", W * .42, H * .5, (lt - d * .55) / .22, "#2fae6a", -.06); });
  KZ.shot("mTrap", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-780, -740, k), -300, lerp(1.45, 1.55, k)); hole(HOLE);
    trap(-620, 1.1, t); g.save(); g.translate(-540, -70); cheese(0, .32, t, { stink: .6 }); g.restore();
    at(rudi, -880, 0, .9, { t, arm: .35, mouth: "grin", look: .3 });
    stamp("TRAP SET", W * .55, H * .52, (lt - d * .45) / .22, "#2f6fd0", .06); });
  KZ.shot("mTrap2", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-640, -470, k), -300, 1.45); hole(HOLE);
    trap(-620, 1.1, t); g.save(); g.translate(-540, -70); cheese(0, .32, t, { stink: .6 }); g.restore();
    cookieJar(-500, .8, t, true);
    const p = clamp(lt / (d * .6), 0, 1), mx = lerp(-980, -300, p);
    if (p < 1) mouseAt(mx, 0, .62, { t, walk: 12, seed: 3, look: .5 });
    else mouseAt(-270, 0, .7, { t, sit: 1, food: "cookie", seed: 3 });
    label("...TO THE COOKIES", W * .44, H * .14, sm((lt - d * .35) / .3)); });
    KZ.shot("mGiant", (lt, d, t) => { const k = sm(lt / d); const p = sm(clamp(lt / (d * .7), 0, 1));
    kitchen(t, lerp(-420, -160, k), -560, lerp(.8, .84, k)); hole(HOLE);
    cheese(lerp(-1500, -60, p), 3.1, t, { stink: 1 });
    at(rudi, lerp(-1500, -60, p) - 590, 0, 1, { t, walk: p < 1, arm: .45, mouth: p < 1 ? "hmm" : "grin", look: .6 });
    sparkle(W * .3, H * .2, 40, sm((lt - d * .7) / .2)); sparkle(W * .62, H * .26, 30, sm((lt - d * .75) / .2));
    stamp("SOFA-SIZED", W * .44, H * .54, (lt - d * .55) / .22, "#f08a1e", -.05); });
  KZ.shot("mGiant2", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(360, 390, k), -330, lerp(1.3, 1.36, k)); hole(HOLE);
    cheese(-60, 3.1, t, { stink: 1 });
    cereal(300, .8, t, { tipped: true });
    mouseAt(540, 0, .78, { t, sit: 1, food: "flake", seed: 5 });
    at(rudi, 60, 0, .9, { t, arm: 1.5 + .5 * clamp(lt * 3, 0, 1), arm2: .6, mouth: "scream", mood: "scared", look: .8 });
    stamp("CEREAL WINS", W * .44, H * .52, (lt - d * .35) / .22, "#e5484d", .05); });
  KZ.shot("mDiet", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.1, sm(lt / d)) + Math.sin(t * 2) * .015);
    txt("A WILD MOUSE'S MENU", W * .44, H * .08, 58, "#fff", { w: 900, a: sm(lt / .3) });
    const items = [["GRAINS", grainIcon], ["SEEDS", seedIcon], ["FRUIT", fruitIcon]];
    items.forEach(([s, fn], i) => { const a = sm((lt - .15 - i * d * .14) / .3), x = W * (.16 + i * .28), y = H * .24 + Math.sin(t * 3 + i) * 8; if (a <= 0) return;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; kshape(g, ell(x, y, 120, 120, 0), "#f7f4ec", { rw: 5, sw: 10 }); g.restore();
      fn(x, y, 1.1 * easeBack(Math.min(a, 1)), t); txt(s, x, y + 170, 50, "#7ef0b0", { w: 900, a }); check(x + 90, y - 90, .55, (lt - .4 - i * d * .14) / .25); });
    const ca = sm((lt - d * .62) / .3); if (ca > 0) { cheeseIcon(W * .3, H * .5, .9, t, 0); cross(W * .3, H * .5, .9, (lt - d * .7) / .25); txt("NOT A FAVORITE", W * .62, H * .5, 50, "#ff8a8a", { w: 900, a: ca }); }
    wobbleAll(lt, d, t); });
  KZ.shot("mStudy", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.1, sm(lt / d)) + Math.sin(t * 2) * .015);
    const y = H * .27; cheeseIcon(W * .7, y, 1.25, t, 1);
    mouseFace(W * .24, y, 1.15 * easeBack(clamp(lt / .4, 0, 1)), t, { yuck: lt > d * .35, tilt: lt > d * .35 ? -.25 : 0 });
    stamp("TOO STRONG", W * .44, H * .1, (lt - d * .4) / .22, "#e5484d", -.05);
    card(W * .44, H * .52, 880, 200, (lt - .3) / .3, "SOURCE", "#2f6fd0");
    txt("Dr David Holmes, Manchester", W * .44, H * .52 + 26, 38, "#1b1d3a", { w: 800, a: sm((lt - .45) / .2) });
    txt("Metropolitan University (via BBC)", W * .44, H * .52 + 72, 34, "#4a4f70", { w: 700, a: sm((lt - .5) / .2) });
    wobbleAll(lt, d, t); });
  KZ.shot("mBait", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.1, sm(lt / d)) + Math.sin(t * 2) * .015);
    txt("BEST MOUSE BAIT", W * .44, H * .07, 62, "#fff", { w: 900, a: sm(lt / .3) });
    const rows = [["PEANUT BUTTER", 1, "#ffd84d"], ["CHOCOLATE", .72, "#c98a5a"], ["OATS", .55, "#7ef0b0"], ["CHEESE", .22, "#8a90b8"]];
    const x0 = W * .08, full = W * .7;
    rows.forEach(([s, v, col], i) => { const y = H * (.15 + i * .1), a = sm((lt - .1 - i * .18) / .5); if (a <= 0) return;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); kshape(g, (c) => { c.beginPath(); c.roundRect(x0, y, Math.max(20, full * v * a), 92, 20); }, col, { rim: "rgba(255,255,255,.6)", rw: 5, sw: 10 }); g.restore();
      const small = full * v < 300; txt(s, small ? x0 + full * v * a + 24 : x0 + 26, y + 48, 46, small ? "#e8ecff" : "#1b1d3a", { w: 900, align: "left", a: clamp(a * 2 - .4, 0, 1) }); });
    pbJar(x0 + full + 40, H * .15 + 46, .7, (lt - .5) / .3);
    stamp("#1", W * .78, H * .2, (lt - d * .3) / .22, "#e5484d", .08);
    card(W * .44, H * .6, 820, 110, (lt - d * .4) / .3); txt("Source: Live Science, Univ. of Nebraska", W * .44, H * .6, 36, "#1b1d3a", { w: 800, a: sm((lt - d * .45) / .2) });
    wobbleAll(lt, d, t); });
  KZ.shot("mOverkill", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(170, 200, k), -470, lerp(.88, .93, k)); hole(HOLE);
    cheese(-60, 3.1, t, { stink: 1 });
    at(rudi, -330, 0, 1, { t, arm: 1.5 + .5 * clamp(lt * 2, 0, 1), mouth: "hmm", look: .4 });
    cereal(330, .8, t, { tipped: true });
    mouseAt(600, 0, .8, { t, sleep: 1, fat: 1, seed: 6 }, true); g.save(); g.translate(470, -230); zzz(0, 0, t, 1.4); g.restore();
    stamp("OOPS.", W * .5, H * .5, (lt - d * .45) / .22, "#f08a1e", -.07); });
  KZ.shot("mTip", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("DO THIS INSTEAD", W * .44, H * .07, 60, "#fff", { w: 900, a: sm(lt / .3) });
    const p1 = (lt - .1) / .3, p2 = (lt - d * .45) / .3;
    card(W * .44, H * .2, 860, 230, p1); if (p1 > 0) { pbJar(W * .44 - 300, H * .2 + 10, .75, p1); txt("PEA-SIZED DAB", W * .44 + 90, H * .2 - 24, 54, "#1b1d3a", { w: 900, a: sm(p1) }); txt("of peanut butter", W * .44 + 90, H * .2 + 36, 42, "#4a4f70", { w: 800, a: sm(p1) }); }
    card(W * .44, H * .42, 860, 230, p2); if (p2 > 0) { const a = sm(p2); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.translate(W * .44 - 300, H * .42);
      g.fillStyle = "#c98a5a"; g.fillRect(-90, -70, 180, 140); g.fillStyle = "#14101c"; g.beginPath(); g.arc(0, 30, 26, Math.PI, 0); g.lineTo(26, 70); g.lineTo(-26, 70); g.fill();
      g.rotate(-.35); kshape(g, (c) => { c.beginPath(); c.roundRect(-110, -14, 190, 28, 6); }, "#ffd84a", { rw: 3, sw: 4 }); g.fillStyle = "#f7c9a2"; g.beginPath(); g.moveTo(80, -14); g.lineTo(116, 0); g.lineTo(80, 14); g.fill(); g.fillStyle = "#1b1724"; g.beginPath(); g.moveTo(104, -5); g.lineTo(116, 0); g.lineTo(104, 5); g.fill(); g.restore();
      txt("SEAL PENCIL-WIDE", W * .44 + 90, H * .42 - 24, 50, "#1b1d3a", { w: 900, a }); txt("gaps and holes", W * .44 + 90, H * .42 + 36, 42, "#4a4f70", { w: 800, a }); }
    check(W * .8, H * .55, .8, (lt - d * .75) / .25); wobbleAll(lt, d, t); });
  KZ.shot("mTins", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(210, 240, k), TOP - 220, lerp(1.42, 1.5, k));
    const lid = sm(clamp((lt - d * .15) / (d * .35), 0, 1));
    tin(-40, 1, t, lid); tin(200, .85, t, 1);
    mouseAt(470, TOP, .7, { t, look: -.6, seed: 7, mood: lid > .9 ? "angry" : null }, true);
    if (lid > .9) qmark(W * .72, H * .3, 1, sm((lt - d * .55) / .2));
    stamp("SEALED", W * .44, H * .56, (lt - d * .5) / .22, "#2fae6a", -.05); });
  KZ.shot("mLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .6) { shop(lt + 2, d, t, k); bubble("MORE CHEESE!", W * .52, H * .12, sm((lt - .1) / .25), .04); }
    else hookM(0, d, t, true); });

  (function () { const SH = KZ.SHOTS; const split = (a, b, f) => (lt, d, t) => { const c = d * f; if (lt < c) SH[a](lt, c, t); else SH[b](lt - c, d - c, t); };
    KZ.shot("mTrapFull", split("mTrap", "mTrap2", .45));
    KZ.shot("mGiantFull", split("mGiant", "mGiant2", .5)); })();
})();
