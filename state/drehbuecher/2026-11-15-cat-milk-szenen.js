// Szenendatei "Your Cat Shouldn't Drink Milk" (Hauskatze + Hausrind, Comedy-Story + Mix-Stil, 15.11.2026).
// Quellen: PDSA Vet Q&A (Laktase fehlt, Erbrechen/Durchfall/Bauchweh; "A saucer of milk for your cat is like you eating an entire 12 inch pizza"),
// Cats Protection (nur Wasser, Katzenmilch nur selten), Cornell Feline Health Center ("many cats are lactose-intolerant"), Hill's/The Conversation (Laktase sinkt nach dem Absetzen).
// Helfer txt/stamp/navy/rudi/at/kitchen aus mouse-cheese, Katzenfigur aus cat-purr weiterentwickelt (neu: Schlecken, Blähbauch). Kuh (Holstein) neu gezeichnet.
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

  const K = { fur: "#f0953a", furD: "#c4601c", furL: "#ffcf96", white: "#fff3e2", nose: "#ff8a9a", earIn: "#ffaab4", iris: "#c6e04a", mouth: "#6a2a2a",
    wall: "#4a3a8a", wallD: "#261e56", floor: "#5a3424", sofa: "#2b9c8f", sofaD: "#1f7a70", lamp: "#ffd68a" };
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
  function bar(x, yBase, w, h, col, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a * 2, 0, 1); kshape(g, (c) => { c.beginPath(); c.roundRect(x - w / 2, yBase - h, w, h, [18, 18, 0, 0]); }, col, { rim: "rgba(255,255,255,.6)", rw: 5, sw: 10 }); g.restore(); }
  function wobbleAll(lt, d, t) { const z = 1 + .07 * sm(lt / d) + .012 * Math.sin(t * 3.1), ox = Math.sin(t * 1.7) * 10; const cv = g.canvas; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(cv, W * .44 * (1 - z) + ox, H * .4 * (1 - z), W * z, H * z); g.restore(); }
  function sparkle(x, y, r, a) { if (a <= 0) return; g.save(); g.globalCompositeOperation = "lighter"; glow(x, y, r * 2.4, `rgba(255,230,140,${.6 * a})`); g.fillStyle = `rgba(255,250,220,${a})`; g.beginPath(); for (let i = 0; i < 8; i++) { const ang = i / 8 * 6.283, rr = i % 2 ? r * .3 : r; g.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr); } g.fill(); g.restore(); }
  function zzz(x, y, t, s) { for (let i = 0; i < 3; i++) { const ph = (t * .6 + i / 3) % 1; g.save(); g.globalAlpha = Math.sin(ph * Math.PI); g.fillStyle = "#fff"; g.font = `900 ${Math.round((34 + i * 10) * (s || 1))}px "Montserrat"`; g.textAlign = "center"; g.fillText("z", x + ph * 60 * (s || 1), y - ph * 120 * (s || 1)); g.restore(); } }
  // ================= Katze (Hauskatze, rote Tigerkatze) =================
  function natBlink(t, seed) { return Math.sin(t * 1.7 + 1.3 + (seed || 0) * 2.1) > .988 ? 1 : 0; }
  // Katzenauge: Mandelform, gelbgrüne Iris, senkrechte Schlitzpupille (pupil 0 = Schlitz, 1 = rund/weit), Lid von oben (blink 0..1)
  function catEye(c, x, y, r, o) { const pu = o.pupil ?? .2, bl = Math.max(o.blink || 0, natBlink(o.t || 0, o.seed)), lx = (o.look || 0) * r * .22;
    c.save(); c.translate(x, y); if (o.flip) c.scale(-1, 1);
    const shape = (c) => { c.beginPath(); c.moveTo(-r * 1.12, r * .05); c.bezierCurveTo(-r * .7, -r * 1.05, r * .6, -r * 1.15, r * 1.12, -r * .15); c.bezierCurveTo(r * .7, r * 1.0, -r * .6, r * 1.0, -r * 1.12, r * .05); c.closePath(); };
    c.fillStyle = "rgba(40,15,10,.55)"; c.save(); c.scale(1.12, 1.16); shape(c); c.fill(); c.restore();
    c.save(); shape(c); c.clip();
    c.fillStyle = o.iris || K.iris; c.fillRect(-r * 1.3, -r * 1.3, r * 2.6, r * 2.6);
    const ig = c.createRadialGradient(lx, 0, r * .1, lx, 0, r * 1.2); ig.addColorStop(0, "rgba(255,255,210,.55)"); ig.addColorStop(.6, "rgba(255,255,255,0)"); ig.addColorStop(1, "rgba(50,90,10,.45)"); c.fillStyle = ig; c.fillRect(-r * 1.3, -r * 1.3, r * 2.6, r * 2.6);
    c.fillStyle = "#120f1e"; c.beginPath(); c.ellipse(lx, -r * .02, r * lerp(.13, .72, pu), r * lerp(.92, .8, pu), 0, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(lx - r * .32, -r * .36, r * .2, 0, 7); c.fill(); c.globalAlpha = .8; c.beginPath(); c.arc(lx + r * .34, r * .3, r * .08, 0, 7); c.fill(); c.globalAlpha = 1;
    if (bl > 0) { const ly = lerp(-r * 1.15, r * .75, bl); c.fillStyle = o.lid || K.fur; c.fillRect(-r * 1.3, -r * 1.4, r * 2.6, ly + r * 1.4);
      c.strokeStyle = "rgba(60,20,10,.75)"; c.lineWidth = r * .14; c.lineCap = "round"; c.beginPath(); c.moveTo(-r * 1.2, ly + (bl > .9 ? 0 : 0)); c.quadraticCurveTo(0, ly + r * .25 * bl, r * 1.2, ly - r * .1); c.stroke(); }
    c.restore(); c.restore(); }
  // Katzenkopf von vorn, Mitte (0,0), Breite ~460. o: flat (Ohren angelegt 0..1), pupil, blink, look, whisk (Schnurrhaare nach vorn/oben 0..1), open (Mund)
  function catFace(c, o) { const t = o.t || 0, flat = o.flat || 0, br = Math.sin(t * 2.4) * .012, tw = Math.sin(t * 3.1) * .04 * (1 - flat);
    c.save(); c.scale(1 + br, 1 - br);
    // Brust-Fell
    if (!o.noChest) kshape(c, (c) => { c.beginPath(); c.moveTo(-200, 120); c.bezierCurveTo(-260, 260, -200, 420, 0, 430); c.bezierCurveTo(200, 420, 260, 260, 200, 120); c.closePath(); }, K.white, { rim: "rgba(255,255,255,.8)", shadow: "rgba(120,60,30,.25)", rw: 6, sw: 18 });
    // Ohren
    for (const s of [-1, 1]) { c.save(); c.translate(s * 138, -112); c.rotate(s * (.22 + flat * 1.05) + s * tw); c.scale(1, 1 - flat * .3);
      kshape(c, (c) => { c.beginPath(); c.moveTo(-82, 46); c.quadraticCurveTo(-30, -60, s * 8, -176); c.quadraticCurveTo(40, -60, 82, 46); c.closePath(); }, K.fur, { rim: "rgba(255,225,180,.75)", shadow: "rgba(110,40,10,.3)", rw: 6, sw: 14 });
      c.fillStyle = K.earIn; c.beginPath(); c.moveTo(-48, 34); c.quadraticCurveTo(-18, -40, s * 8, -128); c.quadraticCurveTo(24, -40, 48, 34); c.closePath(); c.fill();
      c.strokeStyle = "rgba(255,245,230,.85)"; c.lineWidth = 4; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-10 + i * 10, 30); c.lineTo(-14 + i * 12, -40 - i * 8); c.stroke(); }
      c.restore(); }
    // Kopf
    kshape(c, (c) => { c.beginPath(); c.moveTo(-226, 10); c.bezierCurveTo(-232, -150, -120, -196, 0, -196); c.bezierCurveTo(120, -196, 232, -150, 226, 10);
      c.lineTo(250, 70); c.lineTo(214, 76); c.bezierCurveTo(190, 150, 110, 186, 0, 188); c.bezierCurveTo(-110, 186, -190, 150, -214, 76); c.lineTo(-250, 70); c.closePath(); }, K.fur, { rim: "rgba(255,228,180,.85)", shadow: "rgba(120,40,10,.3)", rw: 8, sw: 22 });
    // Tiger-Zeichnung: M auf der Stirn, Wangenstreifen
    c.strokeStyle = K.furD; c.lineCap = "round"; c.lineWidth = 17;
    for (const [x0, y0, x1, y1] of [[0, -188, 0, -112], [-44, -182, -30, -116], [44, -182, 30, -116], [-92, -168, -70, -122], [92, -168, 70, -122]]) { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
    c.lineWidth = 13; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(s * 226, -10 + i * 38); c.quadraticCurveTo(s * 196, -4 + i * 38, s * 168, 6 + i * 34); c.stroke(); }
    // Schnauze
    for (const s of [-1, 1]) kshape(c, ell(s * 40, 76, 54, 40, 0), K.white, { rim: "rgba(255,255,255,.9)", rw: 4, sw: 8 });
    kshape(c, ell(0, 122, 40, 22, 0), K.white, { rw: 3, sw: 6 });
    // Augen
    for (const s of [-1, 1]) catEye(c, s * 92, -28, 52, { t, seed: o.seed || 0, pupil: o.pupil, blink: o.blink, look: o.look, flip: s < 0 });
    // Nase + Mund
    kshape(c, (c) => { c.beginPath(); c.moveTo(-26, 30); c.quadraticCurveTo(0, 22, 26, 30); c.quadraticCurveTo(10, 50, 0, 58); c.quadraticCurveTo(-10, 50, -26, 30); c.closePath(); }, K.nose, { rim: "rgba(255,220,225,.9)", rw: 3, sw: 5 });
    c.strokeStyle = K.mouth; c.lineWidth = 6; c.beginPath(); c.moveTo(0, 58); c.lineTo(0, 76); c.moveTo(0, 76); c.quadraticCurveTo(-14, 94, -34, 82); c.moveTo(0, 76); c.quadraticCurveTo(14, 94, 34, 82); c.stroke();
    if (o.open) { c.fillStyle = "#5a1a2a"; c.beginPath(); c.ellipse(0, 96, 22 * o.open, 16 * o.open, 0, 0, 7); c.fill(); }
    // Schnurrhaare
    const wk = o.whisk || 0; c.strokeStyle = "rgba(255,255,255,.88)"; c.lineWidth = 4;
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const sw = Math.sin(t * 2 + i) * 4; c.beginPath(); c.moveTo(s * 70, 70 + i * 14); c.quadraticCurveTo(s * 200, 52 + i * 26 - wk * 40, s * 320, 30 + i * 44 - wk * 110 + sw); c.stroke(); }
    c.restore(); }
  // Katzenkopf seitlich (Kopf nach rechts), Mitte (0,0), Radius ~70
  function catHead(c, o) { const t = o.t || 0, flat = o.flat || 0, tw = Math.sin(t * 3.3 + (o.seed || 0)) * .05;
    c.save(); c.rotate(o.tilt || 0);
    c.save(); c.translate(-22, -48); c.rotate(-.25 - flat * 1.1 + tw); kshape(c, (c) => { c.beginPath(); c.moveTo(-26, 12); c.quadraticCurveTo(-14, -30, -4, -66); c.quadraticCurveTo(14, -30, 26, 12); c.closePath(); }, K.furD, { rw: 3, sw: 6 }); c.restore();
    kshape(c, ell(0, 0, 74, 62, 0), K.fur, { rim: "rgba(255,228,180,.85)", shadow: "rgba(120,40,10,.3)", rw: 6, sw: 14 });
    c.save(); c.translate(18, -50); c.rotate(.12 - flat * 1.15 - tw); kshape(c, (c) => { c.beginPath(); c.moveTo(-30, 14); c.quadraticCurveTo(-14, -34, 2, -74); c.quadraticCurveTo(18, -34, 32, 14); c.closePath(); }, K.fur, { rim: "rgba(255,228,180,.8)", rw: 4, sw: 8 });
      c.fillStyle = K.earIn; c.beginPath(); c.moveTo(-16, 10); c.quadraticCurveTo(-6, -26, 2, -52); c.quadraticCurveTo(10, -26, 18, 10); c.closePath(); c.fill(); c.restore();
    c.strokeStyle = K.furD; c.lineWidth = 9; c.lineCap = "round"; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-50 + i * 18, -56 + i * 2); c.lineTo(-40 + i * 16, -30); c.stroke(); }
    for (let i = 0; i < 2; i++) { c.beginPath(); c.moveTo(-64, 4 + i * 18); c.lineTo(-28, 12 + i * 16); c.stroke(); }
    kshape(c, ell(54, 20, 36, 28, 0), K.white, { rw: 3, sw: 6 }); kshape(c, ell(46, 44, 24, 13, 0), K.white, { rw: 2, sw: 4 });
    c.fillStyle = K.nose; c.beginPath(); c.moveTo(78, 2); c.lineTo(92, 6); c.lineTo(84, 18); c.closePath(); c.fill();
    c.strokeStyle = K.mouth; c.lineWidth = 4; c.beginPath(); c.moveTo(84, 18); c.lineTo(82, 28); c.quadraticCurveTo(72, 36, 62, 30); c.stroke();
    catEye(c, 34, -10, 21, { t, seed: o.seed || 0, pupil: o.pupil, blink: o.blink, look: o.look ?? .4 });
    if (o.tongue) { const fl = Math.max(0, Math.sin(t * 9)); c.fillStyle = "#ff6f8a"; c.beginPath(); c.ellipse(84, 34 + fl * 16, 9, 8 + fl * 14, -.2, 0, 7); c.fill(); }
    const wk = o.whisk || 0; c.strokeStyle = "rgba(255,255,255,.85)"; c.lineWidth = 3; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(66, 22 + i * 7); c.quadraticCurveTo(110, 14 + i * 12 - wk * 18, 160, 4 + i * 20 - wk * 44); c.stroke(); }
    c.restore(); }
  // Katze seitlich, Boden y=0, Kopf rechts. mode: "stand" | "loaf" | "sit" | "curl". o.crouch (geduckt), o.tailLow, o.bandage
  function cat(c, o) { const t = o.t || 0, mode = o.mode || "stand", wag = Math.sin(t * 1.6 + (o.seed || 0)) * 22, breathe = 1 + Math.sin(t * 2.4) * .015;
    const tail = (pts, w) => { c.lineCap = "round"; c.strokeStyle = K.fur; c.lineWidth = w; c.beginPath(); c.moveTo(pts[0], pts[1]); c.bezierCurveTo(pts[2], pts[3], pts[4], pts[5], pts[6], pts[7]); c.stroke();
      c.strokeStyle = K.furD; c.setLineDash([16, 24]); c.lineDashOffset = 0; c.stroke(); c.setLineDash([]); c.strokeStyle = "rgba(255,230,190,.35)"; c.lineWidth = w * .25; c.stroke(); };
    const leg = (pts, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke();
      const p = pts[pts.length - 1]; kshape(c, ell(p[0] + 8, p[1] - 2, w * .72, w * .38, 0), col === K.furD ? K.furD : K.white, { rw: 2, sw: 4 }); };
    const stripes = (x0, x1, ytop, ybot) => { c.strokeStyle = K.furD; c.lineWidth = 15; c.lineCap = "round"; for (let x = x0; x <= x1; x += 38) { c.beginPath(); c.moveTo(x, ytop); c.quadraticCurveTo(x + 14, (ytop + ybot) / 2, x + 2, ybot); c.stroke(); } };
    c.save();
    if (mode === "stand") { const cr = o.crouch || 0; c.translate(0, cr * 20); c.scale(1, 1 - cr * .15);
      if (o.tailLow) tail([-132, -170, -220, -140, -250, -40, -160, -14], 30); else tail([-132, -176, -230, -176, -250, -320 + wag, -190, -352 + wag], 30);
      leg([[-70, -130], [-82, -70], [-64, -12]], K.furD, 30); leg([[118, -130], [126, -12]], K.furD, 30);
      kshape(c, ell(-92, -146, 74, 80, 0), K.fur, { rim: "rgba(255,228,180,.8)", rw: 6, sw: 16 });
      const bl = o.bloat || 0; kshape(c, ell(0, -164 + bl * 22, 150 * breathe * (1 + bl * .12), 66 * breathe * (1 + bl * .5), -.03), K.fur, { rim: "rgba(255,228,180,.85)", shadow: "rgba(120,40,10,.3)", rw: 7, sw: 20 });
      kshape(c, ell(10, -114, 112, 20, 0), K.furL, { rw: 2, sw: 4 }); stripes(-90, 80, -226, -180);
      kshape(c, ell(116, -150, 48, 60, 0), K.white, { rim: "rgba(255,255,255,.9)", rw: 4, sw: 8 });
      leg([[-84, -118], [-116, -66], [-98, -12]], K.fur, 36); leg([[96, -136], [104, -12]], K.fur, 34);
      if (o.bandage) { c.fillStyle = "#fff"; c.fillRect(88, -70, 34, 34); c.fillStyle = "#e5484d"; c.fillRect(100, -64, 10, 22); c.fillRect(94, -58, 22, 10); }
      if (o.lap) { kshape(c, ell(150, -150, 54, 58, .55), K.fur, { rw: 5, sw: 10 }); c.save(); c.translate(204, -96); c.rotate(.55); catHead(c, o); c.restore(); }
      else { kshape(c, ell(140, -198, 52, 62, -.4), K.fur, { rw: 5, sw: 10 }); c.save(); c.translate(178, -246); catHead(c, o); c.restore(); } }
    if (mode === "loaf") {
      tail([-150, -30, -170, 16, 20, 16, 120, -8], 28);
      kshape(c, ell(-80, -80, 84, 74, 0), K.fur, { rw: 5, sw: 12 });
      kshape(c, ell(0, -78 * breathe, 152, 74 * breathe, 0), K.fur, { rim: "rgba(255,228,180,.85)", shadow: "rgba(120,40,10,.3)", rw: 7, sw: 20 });
      stripes(-110, 60, -146, -100);
      kshape(c, ell(110, -84, 48, 58, 0), K.white, { rim: "rgba(255,255,255,.9)", rw: 4, sw: 8 });
      kshape(c, ell(140, -14, 34, 15, 0), K.white, { rw: 3, sw: 5 }); kshape(c, ell(100, -12, 32, 14, 0), K.white, { rw: 3, sw: 5 });
      c.save(); c.translate(140, -168); catHead(c, o); c.restore(); }
    if (mode === "sit") {
      tail([-90, -18, -60, 18, 70, 18, 140, -6], 28);
      kshape(c, ell(-34, -96, 92, 96, 0), K.fur, { rim: "rgba(255,228,180,.8)", shadow: "rgba(120,40,10,.3)", rw: 7, sw: 18 });
      stripes(-90, -10, -170, -120);
      kshape(c, ell(38, -170, 64, 110, -.22), K.fur, { rim: "rgba(255,228,180,.85)", rw: 6, sw: 14 });
      kshape(c, ell(66, -176, 40, 76, -.22), K.white, { rim: "rgba(255,255,255,.9)", rw: 4, sw: 8 });
      leg([[50, -130], [56, -12]], K.furD, 28); leg([[80, -130], [88, -12]], K.fur, 30);
      kshape(c, ell(-50, -14, 50, 18, 0), K.fur, { rw: 3, sw: 5 });
      c.save(); c.translate(72, -296); catHead(c, o); c.restore(); }
    if (mode === "curl") {
      kshape(c, ell(0, -80 * breathe, 150, 82 * breathe, 0), K.fur, { rim: "rgba(255,228,180,.85)", shadow: "rgba(120,40,10,.3)", rw: 7, sw: 20 });
      stripes(-120, 60, -156, -110);
      c.save(); c.translate(84, -70); c.rotate(.15); c.scale(.32, .32); catFace(c, { t, blink: o.blink ?? 1, flat: o.flat, pupil: o.pupil, seed: o.seed, noChest: true }); c.restore();
      tail([-150, -40, -150, 20, 60, 22, 150, -10], 30);
      if (o.bandage) { kshape(c, ell(150, -24, 40, 20, 0), "#ffffff", { rw: 3, sw: 6 }); c.fillStyle = "#e5484d"; c.fillRect(144, -36, 10, 24); c.fillRect(137, -29, 24, 10); } }
    c.restore(); }
  function catAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); cat(g, o); g.restore(); }
  function faceAt(x, y, s, o) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(s, s); catFace(g, o); g.restore(); }
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
  function sofa(t) { // Sitzfläche oben bei y=-300, Breite -520..520
    kshape(g, (c) => { c.beginPath(); c.roundRect(-500, -620, 1000, 360, 70); }, K.sofaD, { rim: "rgba(160,255,240,.35)", rw: 6, sw: 16 });
    for (const x of [-250, 0, 250]) kshape(g, (c) => { c.beginPath(); c.roundRect(x - 118, -590, 236, 280, 50); }, K.sofa, { rim: "rgba(190,255,245,.5)", rw: 5, sw: 12 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-520, -330, 1040, 170, 46); }, K.sofa, { rim: "rgba(190,255,245,.55)", shadow: "rgba(0,40,40,.3)", rw: 6, sw: 16 });
    for (const s of [-1, 1]) kshape(g, (c) => { c.beginPath(); c.roundRect(s > 0 ? 440 : -580, -470, 140, 330, 60); }, K.sofaD, { rim: "rgba(160,255,240,.4)", rw: 5, sw: 12 });
    g.fillStyle = "#2a2140"; for (const x of [-480, 460]) { g.beginPath(); g.roundRect(x, -160, 24, 160, 8); g.fill(); } }

  // ================= Neue Requisiten =================
  function saucer(x, y, s, fill, t) { g.save(); g.translate(x, y); g.scale(s, s);
    kshape(g, ell(0, -14, 120, 28, 0), "#7fc8f0", { rim: "rgba(230,248,255,.9)", shadow: "rgba(20,60,110,.3)", rw: 5, sw: 8 });
    g.fillStyle = "#4f9fd0"; g.beginPath(); g.ellipse(0, -20, 96, 18, 0, 0, 7); g.fill();
    if (fill > 0) { g.fillStyle = "#fbfbf6"; g.beginPath(); g.ellipse(0, -21, 90 * Math.min(1, .3 + fill * .7), 15 * Math.min(1, .3 + fill * .7), 0, 0, 7); g.fill();
      g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.ellipse(-30 + Math.sin(t * 2) * 6, -25, 22, 4, 0, 0, 7); g.fill(); }
    g.restore(); }
  function waterBowl(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.moveTo(-110, -60); c.lineTo(110, -60); c.lineTo(84, 0); c.lineTo(-84, 0); c.closePath(); }, "#2fae6a", { rim: "rgba(200,255,220,.8)", shadow: "rgba(0,60,30,.3)", rw: 5, sw: 8 });
    g.fillStyle = "#1c7a4a"; g.beginPath(); g.ellipse(0, -60, 110, 20, 0, 0, 7); g.fill(); g.fillStyle = "#8fd8ff"; g.beginPath(); g.ellipse(0, -60, 96, 15, 0, 0, 7); g.fill();
    g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 4; g.beginPath(); g.ellipse(Math.sin(t * 2) * 10, -60, 40 + (t * 30) % 40, 6, 0, 0, 7); g.stroke();
    g.fillStyle = "#fff"; g.font = '900 30px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("H2O", 0, -28); g.restore(); }
  function carton(x, y, s, rot, label2) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-46, -80, 92, 150, 8); }, "#fbfbf6", { rim: "rgba(255,255,255,.95)", shadow: "rgba(40,60,110,.25)", rw: 4, sw: 8 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(-46, -80); c.lineTo(0, -122); c.lineTo(46, -80); c.closePath(); }, "#e9edf7", { rw: 3, sw: 4 });
    g.fillStyle = label2 ? "#e5487a" : "#3f8fe0"; g.fillRect(-46, -40, 92, 56); g.fillStyle = "#fff"; g.font = `900 ${label2 ? 20 : 26}px "Montserrat"`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(label2 || "MILK", 0, -12); g.restore(); }
  function bottle(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.moveTo(-26, 0); c.lineTo(-26, -90); c.quadraticCurveTo(-26, -112, -12, -122); c.lineTo(-12, -150); c.lineTo(12, -150); c.lineTo(12, -122); c.quadraticCurveTo(26, -112, 26, -90); c.lineTo(26, 0); c.closePath(); }, "#fbfbf6", { rim: "rgba(255,255,255,.95)", rw: 3, sw: 6 });
    g.fillStyle = "#3f8fe0"; g.fillRect(-14, -162, 28, 16); g.restore(); }
  function crate(x, s) { g.save(); g.translate(x, 0); g.scale(s, s);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) bottle(-150 + i * 60 + r * 26, -150 + r * 22 - (r ? 0 : 10), .9);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-210, -170, 420, 170, 14); }, "#e5484d", { rim: "rgba(255,200,200,.7)", shadow: "rgba(90,10,20,.3)", rw: 5, sw: 12 });
    g.fillStyle = "rgba(90,10,20,.4)"; for (let i = 0; i < 5; i++) { g.beginPath(); g.roundRect(-180 + i * 76, -140, 50, 34, 10); g.fill(); }
    g.fillStyle = "#fff"; g.font = '900 52px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("MILK", 0, -58); g.restore(); }
  function litterBox(x, s, front) { g.save(); g.translate(x, 0); g.scale(s, s);
    if (!front) { kshape(g, (c) => { c.beginPath(); c.roundRect(-230, -150, 460, 40, 14); }, "#2f6fd0", { rw: 3, sw: 6 }); g.fillStyle = "#e8d29a"; g.beginPath(); g.ellipse(0, -120, 210, 24, 0, 0, 7); g.fill(); }
    else { kshape(g, (c) => { c.beginPath(); c.moveTo(-240, -130); c.lineTo(240, -130); c.lineTo(210, 0); c.lineTo(-210, 0); c.closePath(); }, "#3f8fe0", { rim: "rgba(220,240,255,.75)", shadow: "rgba(10,30,90,.3)", rw: 6, sw: 12 }); }
    g.restore(); }
  function stink(x, y, s, t, a) { if (a <= 0) return; g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = `rgba(160,235,110,${.8 * a})`; g.lineWidth = 14; g.lineCap = "round";
    for (let i = 0; i < 3; i++) { const ph = (t * .7 + i / 3) % 1, bx = -90 + i * 90; g.globalAlpha = Math.sin(ph * Math.PI) * a; g.beginPath(); for (let k = 0; k <= 12; k++) { const yy = -k * 18 - ph * 90, xx = bx + Math.sin(k * .8 + t * 4 + i) * 20; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } g.restore(); }
  function gurgle(x, y, s, t, a) { if (a <= 0) return; g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = `rgba(255,255,255,${.9 * a})`; g.lineWidth = 7; g.lineCap = "round";
    for (let i = 0; i < 3; i++) { const ang = -2.4 + i * .8 + Math.sin(t * 6 + i) * .08, r0 = 120 + (t * 80 + i * 30) % 50; g.beginPath(); for (let k = 0; k <= 8; k++) { const rr = r0 + k * 6, aa = ang + Math.sin(k * 1.7 + t * 12) * .06; k ? g.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr) : g.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr); } g.stroke(); } g.restore(); }
  function pour(x0, y0, x1, y1, t, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = "#fbfbf6"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(x0, y0);
    g.quadraticCurveTo(x0 + 30, (y0 + y1) / 2 + Math.sin(t * 9) * 6, x1, y1); g.stroke(); g.fillStyle = "#fbfbf6"; for (let i = 0; i < 4; i++) { const ph = (t * 2 + i / 4) % 1; g.beginPath(); g.arc(x1 + (i - 1.5) * 26 * ph, y1 - 30 * Math.sin(ph * Math.PI), 6, 0, 7); g.fill(); } g.restore(); }
  function pizza(x, y, s, t) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(s, s); g.rotate(t * .2);
    kshape(g, ell(0, 0, 150, 150, 0), "#e8a64a", { rim: "rgba(255,230,180,.85)", shadow: "rgba(120,60,10,.3)", rw: 6, sw: 14 });
    g.fillStyle = "#ffd25a"; g.beginPath(); g.arc(0, 0, 124, 0, 7); g.fill();
    g.fillStyle = "#d8402e"; for (const [a, r] of [[0, 70], [1.2, 80], [2.4, 60], [3.6, 85], [4.8, 70], [5.6, 30], [.6, 30]]) { g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, 20, 0, 7); g.fill(); }
    g.strokeStyle = "rgba(160,90,20,.5)"; g.lineWidth = 5; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(Math.cos(i * .785) * -124, Math.sin(i * .785) * -124); g.lineTo(Math.cos(i * .785) * 124, Math.sin(i * .785) * 124); g.stroke(); } g.restore(); }

  // ================= Hausrind (Holstein), Seitenansicht, Kopf rechts, Boden y=0, Länge ~800 =================
  const Q = { white: "#f6f3ec", black: "#2a2632", pink: "#f4a6b0", pinkD: "#d9808e", hoof: "#4a3a34", horn: "#efe2c2" };
  function cow(c, o) { o = o || {}; const t = o.t || 0, ph = t * (o.walk || 0), mv = o.walk ? 1 : 0, br = Math.sin(t * 1.8) * 4, chew = Math.sin(t * 7) * (o.chew ? 1 : 0);
    const leg = (x, sw, col) => { const dx = Math.sin(ph + sw) * 30 * mv; c.strokeStyle = col; c.lineWidth = 58; c.lineCap = "round"; c.beginPath(); c.moveTo(x, -300); c.lineTo(x + dx * .5, -150); c.lineTo(x + dx, -40); c.stroke();
      kshape(c, (c) => { c.beginPath(); c.roundRect(x + dx - 34, -50, 70, 50, [10, 10, 6, 6]); }, Q.hoof, { rw: 2, sw: 4 }); };
    c.save(); c.translate(0, -Math.abs(Math.sin(ph)) * 6 * mv);
    // Schwanz
    const sw = Math.sin(t * 2.3) * 30; c.strokeStyle = Q.white; c.lineWidth = 16; c.lineCap = "round"; c.beginPath(); c.moveTo(-360, -500); c.quadraticCurveTo(-410 + sw * .3, -360, -390 + sw, -190); c.stroke();
    kshape(c, ell(-390 + sw, -170, 22, 44, sw * .01), Q.black, { rw: 2, sw: 4 });
    leg(-250, Math.PI, "#d8d3ca"); leg(250, 0, "#d8d3ca");
    // Körper
    const body = (c) => { c.beginPath(); c.moveTo(-370, -330); c.bezierCurveTo(-400, -520 + br, -300, -560 + br, -120, -548 + br); c.bezierCurveTo(80, -540 + br, 250, -560 + br, 320, -500); c.bezierCurveTo(360, -440, 340, -300, 290, -270); c.bezierCurveTo(150, -236, -150, -236, -300, -260); c.quadraticCurveTo(-360, -280, -370, -330); c.closePath(); };
    kshape(c, body, Q.white, { rim: "rgba(255,255,255,.95)", shadow: "rgba(80,70,90,.25)", rw: 7, sw: 22 });
    c.save(); body(c); c.clip(); c.fillStyle = Q.black;
    for (const [x, y, rx, ry, r] of [[-230, -470, 120, 90, .3], [40, -330, 110, 70, -.2], [180, -520, 90, 70, .5], [-60, -560, 70, 40, 0]]) { c.beginPath(); c.ellipse(x, y, rx, ry, r, 0, 7); c.fill(); }
    c.fillStyle = "rgba(255,255,255,.12)"; c.beginPath(); c.ellipse(-20, -500, 260, 30, 0, 0, 7); c.fill(); c.restore();
    // Euter
    kshape(c, ell(-150, -250, 78, 48, 0), Q.pink, { rim: "rgba(255,225,230,.9)", shadow: "rgba(150,60,80,.3)", rw: 4, sw: 8 });
    c.fillStyle = Q.pinkD; for (const x of [-196, -164, -136, -104]) { c.beginPath(); c.roundRect(x - 8, -214, 16, 34, 8); c.fill(); }
    leg(-210, 0, Q.white); leg(210, Math.PI, Q.white);
    c.fillStyle = Q.black; c.beginPath(); c.ellipse(-210, -230, 30, 40, 0, 0, 7); c.fill();
    // Hals + Kopf
    c.save(); c.translate(300, -470); c.rotate((o.nod ? Math.sin(t * 3) * .05 : 0) + (o.headUp || 0));
    kshape(c, (c) => { c.beginPath(); c.moveTo(-60, -70); c.quadraticCurveTo(60, -100, 110, -60); c.lineTo(80, 120); c.quadraticCurveTo(0, 120, -60, 90); c.closePath(); }, Q.white, { rim: "rgba(255,255,255,.9)", rw: 5, sw: 12 });
    // Ohren + Hörner
    kshape(c, (c) => { c.beginPath(); c.moveTo(70, -70); c.quadraticCurveTo(110, -130, 128, -150); c.quadraticCurveTo(122, -110, 100, -70); c.closePath(); }, Q.horn, { rw: 3, sw: 4 });
    c.save(); c.translate(56, -50); c.rotate(-.3 + Math.sin(t * 2.6) * .12); kshape(c, ell(-50, 0, 58, 22, 0), Q.black, { rw: 3, sw: 6 }); c.fillStyle = Q.pinkD; c.beginPath(); c.ellipse(-56, 4, 36, 10, 0, 0, 7); c.fill(); c.restore();
    const head = (c) => { c.beginPath(); c.moveTo(40, -90); c.bezierCurveTo(130, -110, 190, -80, 200, -10); c.lineTo(214, 110); c.quadraticCurveTo(170, 150, 110, 120); c.bezierCurveTo(60, 60, 30, -20, 40, -90); c.closePath(); };
    kshape(c, head, Q.white, { rim: "rgba(255,255,255,.95)", shadow: "rgba(80,70,90,.25)", rw: 6, sw: 14 });
    c.save(); head(c); c.clip(); c.fillStyle = Q.black; c.beginPath(); c.ellipse(130, -40, 70, 60, .3, 0, 7); c.fill(); c.restore();
    kshape(c, (c) => { c.beginPath(); c.moveTo(130, -100); c.quadraticCurveTo(150, -150, 172, -164); c.quadraticCurveTo(170, -124, 156, -96); c.closePath(); }, Q.horn, { rw: 3, sw: 4 });
    // Maul
    c.save(); c.translate(170, 110); kshape(c, ell(0, 0, 72, 50, -.15), Q.pink, { rim: "rgba(255,225,230,.9)", shadow: "rgba(150,60,80,.3)", rw: 4, sw: 8 });
    c.fillStyle = "#8a3a4a"; c.beginPath(); c.ellipse(20, -16, 12, 8, .3, 0, 7); c.fill(); c.beginPath(); c.ellipse(56, -6, 9, 7, .3, 0, 7); c.fill();
    c.strokeStyle = "#8a3a4a"; c.lineWidth = 5; c.beginPath(); c.moveTo(-30, 30 + chew * 5); c.quadraticCurveTo(10, 40 + chew * 8, 50, 28); c.stroke(); c.restore();
    fig.eye(c, 140, -10, 20, { t, seed: 9, look: o.look ?? .5, mood: o.mood, lid: Q.black });
    c.restore(); c.restore(); }
  function cowAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); cow(g, o); g.restore(); }

  // ================= Shots =================
  function hookK(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    kitchen(t, lerp(-70, -50, k), -200, lerp(1.32, 1.45, k));
    const sick = loop ? 0 : sm((lt - d * .5) / (d * .25));
    saucer(-230, 0, 1, lerp(.9, .6, k), t);
    catAt(100, 0, 1, { t, mode: "stand", lap: true, tongue: sick < .5, pupil: lerp(.25, .9, sick), blink: lerp(.45, 0, sick), flat: sick * .4, bloat: sick * .9, seed: 2 }, true);
    if (loop) return;
    g.save(); g.translate(100, -150); g.scale(-1, 1); gurgle(0, 0, 1, t, sick); g.restore();
    stamp("GURGLE", W * .46, H * .63, (lt - d * .62) / .22, "#2fae6a", -.06); }
  KZ.shot("kHook", (lt, d, t) => hookK(lt, d, t, false));
  function pourScene(lt, d, t, k) { kitchen(t, lerp(-80, -50, k), -330, lerp(1.0, 1.06, k));
    const fill = clamp(lt / (d * .7), 0, 1);
    saucer(-130, 0, 1, fill, t);
    const r = at(rudi, -470, 0, 1, { t, arm: .32, mouth: "grin", look: .3 });
    const hx = -470 + r.hx, hy = r.hy; carton(hx + 30, hy - 20, 1, 1.9);
    pour(hx + 112, hy + 6, -130, -24, t, fill < 1 ? 1 : 0);
    const cx = lerp(420, 150, sm(clamp(lt / (d * .6), 0, 1)));
    catAt(cx, 0, .8, { t, mode: "stand", look: .2, pupil: .6, seed: 2 }, true); }
  KZ.shot("kPour", (lt, d, t) => { const k = sm(lt / d); pourScene(lt, d, t, k);
    bubble("MILK TIME!", W * .42, H * .13, sm((lt - .1) / .3), -.04);
    stamp("TREAT!", W * .46, H * .6, (lt - d * .55) / .22, "#e5487a", .05); });
  KZ.shot("kCrate", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-60, -30, k), -380, lerp(.86, .92, k));
    const p = easeBack(clamp(lt / (d * .35), 0, 1)); crate(-160, 1.1 * p);
    at(rudi, -470, 0, .95, { t, arm: .95, mouth: "grin", look: .4 });
    saucer(150, 0, 1.5, 1, t); catAt(420, 0, .78, { t, mode: "stand", lap: true, tongue: true, blink: .5, seed: 2 }, true);
    sparkle(W * .3, H * .3, 36, sm((lt - d * .3) / .2)); sparkle(W * .52, H * .24, 28, sm((lt - d * .4) / .2));
    stamp("24 BOTTLES", W * .44, H * .2, (lt - d * .45) / .22, "#2f6fd0", -.05); });
  KZ.shot("kBox", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(-90, -60, k), -330, lerp(.98, 1.04, k));
    litterBox(100, 1.1, false);
    catAt(80, -70, .82, { t, mode: "sit", pupil: .9, flat: .55, look: .3, seed: 2 });
    litterBox(100, 1.1, true);
    stink(110, -480, 1, t, sm(lt / .4));
    at(rudi, -430, 0, 1, { t, arm: 1.5 + .4 * clamp(lt * 2, 0, 1), mouth: "o", mood: "scared", look: .6 });
    label("A FEW HOURS LATER", W * .44, H * .12, sm(lt / .25));
    stamp("OCCUPIED", W * .5, H * .6, (lt - d * .4) / .22, "#e5484d", .06); });
  KZ.shot("kCow", (lt, d, t) => { const k = sm(lt / d); const p = sm(clamp(lt / (d * .75), 0, 1));
    kitchen(t, lerp(-600, -560, k), -440, lerp(.7, .74, k));
    const cx = lerp(-1700, -500, p);
    at(rudi, cx - 560, 0, 1, { t, walk: p < 1, arm: .5, mouth: "grin", look: .3 });
    g.strokeStyle = "#c98a4a"; g.lineWidth = 10; g.beginPath(); g.moveTo(cx - 560 + 170, -230); g.quadraticCurveTo(cx - 150, -120, cx + 30, -330); g.stroke();
    cowAt(cx, 0, .9, { t, walk: p < 1 ? 5 : 0, chew: p >= 1, look: .4 });
    sparkle(W * .26, H * .2, 40, sm((lt - d * .7) / .2)); sparkle(W * .64, H * .26, 30, sm((lt - d * .75) / .2));
    stamp("FARM FRESH", W * .44, H * .6, (lt - d * .55) / .22, "#2fae6a", -.05); });
  KZ.shot("kCow2", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-250, -220, k), -380, lerp(.84, .89, k));
    cowAt(-680, 0, .8, { t, chew: true, look: .7 });
    saucer(-80, 0, 1.1, .4, t);
    catAt(230, 0, .85, { t, mode: "stand", bloat: 1, tailLow: true, flat: .5, pupil: .85, look: -.3, seed: 2 }, true);
    g.save(); g.translate(230, -140); g.scale(-.85, .85); gurgle(0, 0, 1, t, 1); g.restore();
    stamp("SAME RESULT", W * .44, H * .6, (lt - d * .45) / .22, "#e5484d", .05); });
  KZ.shot("kKitten", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("KITTENS MAKE", W * .44, H * .07, 60, "#fff", { w: 900, a: sm(lt / .3) });
    stamp("LACTASE", W * .44, H * .15, (lt - .2) / .3, "#2fae6a", -.03);
    const a = sm((lt - .3) / .4); if (a > 0) { faceAt(W * .2, H * .34, .5 * easeBack(Math.min(a, 1)), { t, pupil: .7, seed: 4 }); txt("KITTEN", W * .2, H * .47, 46, "#ffd84d", { w: 900, a }); }
    const b = sm((lt - d * .3) / .3); if (b > 0) { carton(W * .46, H * .35, 1.3 * easeBack(Math.min(b, 1)), 0, "MOM'S MILK"); txt("+", W * .33, H * .34, 90, "#fff", { w: 900, a: b }); }
    const c2 = sm((lt - d * .55) / .3); if (c2 > 0) { txt("=", W * .6, H * .34, 90, "#fff", { w: 900, a: c2 }); check(W * .74, H * .34, 1.1, c2); txt("DIGESTED", W * .74, H * .47, 46, "#7ef0b0", { w: 900, a: c2 }); }
    wobbleAll(lt, d, t); });
  KZ.shot("kBars", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("LACTASE IN THE GUT", W * .44, H * .07, 58, "#fff", { w: 900, a: sm(lt / .3) });
    const rows = [["KITTEN", 1, "#7ef0b0", .4], ["ADULT CAT", .16, "#ff6b6b", .62]]; const x0 = W * .26, full = W * .56;
    rows.forEach(([s, v, col, sc], i) => { const y = H * (.2 + i * .17), a = sm((lt - .15 - i * d * .3) / .5); if (a <= 0) return;
      faceAt(W * .13, y + 50, sc * .5 * easeBack(Math.min(a, 1)), { t, pupil: i ? .3 : .7, blink: i ? .3 : 0, seed: 4 + i });
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); kshape(g, (c) => { c.beginPath(); c.roundRect(x0, y, Math.max(20, full * v * a), 100, 20); }, col, { rim: "rgba(255,255,255,.6)", rw: 5, sw: 10 }); g.restore();
      txt(s, v < .4 ? x0 + full * v * a + 24 : x0 + 26, y + 52, 46, v < .4 ? "#e8ecff" : "#1b1d3a", { w: 900, align: "left", a: clamp(a * 2 - .4, 0, 1) }); });
    txt("after weaning", W * .44, H * .5, 44, "#c9d0ff", { w: 800, a: sm((lt - d * .45) / .3) });
    stamp("WAY LESS", W * .62, H * .58, (lt - d * .6) / .22, "#e5484d", .06); wobbleAll(lt, d, t); });
  KZ.shot("kGut", (lt, d, t) => { g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#5a1f4a"); bg.addColorStop(1, "#1a0c28"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .44, H * .36, 600, "rgba(255,120,160,.16)"); g.restore();
    const z = lerp(1.6, 1.75, sm(lt / d)); g.save(); g.translate(W * .42, H * .42); g.scale(z, z); cat(g, { t, mode: "loaf", bloat: 1, flat: .5, pupil: .8, seed: 2 });
    // Querschnitt Bauch
    const cr = 108 * sm(clamp(lt / .5, 0, 1)); if (cr > 2) { g.fillStyle = "#3a1230"; g.beginPath(); g.arc(-20, -80, cr, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 5; g.stroke();
      g.save(); g.beginPath(); g.arc(-20, -80, cr - 4, 0, 7); g.clip();
      g.strokeStyle = "#f08aa0"; g.lineWidth = 26; g.lineCap = "round"; g.beginPath(); for (let i = 0; i <= 40; i++) { const xx = -110 + i * 4.5, yy = -80 + Math.sin(i * .5 + t * 2) * 40; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke();
      for (let i = 0; i < 10; i++) { const ph = (t * .8 + i / 10) % 1; g.fillStyle = `rgba(170,240,120,${.85 * Math.sin(ph * Math.PI)})`; g.beginPath(); g.arc(-90 + (i * 37) % 150, -10 - ph * 150, 6 + (i % 3) * 4, 0, 7); g.fill(); }
      g.restore(); } g.restore();
    txt("MILK SUGAR FERMENTS", W * .44, H * .08, 54, "#fff", { w: 900, a: sm(lt / .3) });
    [["GAS", .2, .16], ["CRAMPS", .7, .22], ["DIARRHEA", .44, .6]].forEach(([s, x, y], i) => { const a = sm((lt - d * (.3 + i * .18)) / .2); if (a > 0) label(s, W * x, H * y, a); }); });
  KZ.shot("kPizza", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.07, sm(lt / d)) + Math.sin(t * 2) * .012);
    const a = sm((lt - .1) / .35); if (a > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); saucer(W * .2, H * .27, 1.3 * easeBack(Math.min(a, 1)), 1, t); g.restore(); txt("1 SAUCER", W * .2, H * .34, 44, "#fff", { w: 900, a }); }
    const b = sm((lt - d * .3) / .3); if (b > 0) { txt("=", W * .4, H * .24, 100, "#ffd84d", { w: 900, a: b }); pizza(W * .64, H * .24, .85 * easeBack(Math.min(b, 1)), t); txt("1 WHOLE PIZZA", W * .64, H * .34, 44, "#fff", { w: 900, a: b }); }
    card(W * .44, H * .52, 900, 250, (lt - d * .2) / .3, "PDSA VETS", "#2f6fd0");
    txt("“A saucer of milk for your cat is like", W * .44, H * .52 + 18, 34, "#1b1d3a", { w: 800, a: sm((lt - d * .3) / .2) });
    txt("you eating an entire 12 inch pizza.”", W * .44, H * .52 + 66, 34, "#1b1d3a", { w: 800, a: sm((lt - d * .35) / .2) });
    wobbleAll(lt, d, t); });
  KZ.shot("kUdder", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-400, -370, k), -420, lerp(.72, .76, k));
    cowAt(-1000, 0, .78, { t, chew: true, look: .3 });
    at(rudi, -320, 0, .95, { t, arm: 1.5 + .5 * clamp(lt * 2, 0, 1), mouth: "hmm", look: .5 });
    waterBowl(-60, 0, 1, t); catAt(210, 0, .74, { t, mode: "stand", lap: true, tongue: true, blink: .5, seed: 2 }, true);
    stamp("OOPS.", W * .5, H * .22, (lt - d * .4) / .22, "#f08a1e", -.07); });
  KZ.shot("kTip", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .012);
    txt("DO THIS INSTEAD", W * .44, H * .07, 60, "#fff", { w: 900, a: sm(lt / .3) });
    const p1 = (lt - .1) / .3, p2 = (lt - d * .45) / .3;
    card(W * .44, H * .2, 860, 230, p1); if (p1 > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = sm(p1); waterBowl(W * .44 - 290, H * .2 + 50, .95, t); g.restore();
      txt("FRESH WATER", W * .44 + 90, H * .2 - 24, 56, "#1b1d3a", { w: 900, a: sm(p1) }); txt("every single day", W * .44 + 90, H * .2 + 36, 42, "#4a4f70", { w: 800, a: sm(p1) }); }
    card(W * .44, H * .42, 860, 230, p2); if (p2 > 0) { const a = sm(p2); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; carton(W * .44 - 290, H * .42 + 30, .95, -.1, "CAT MILK"); g.restore();
      txt("CAT MILK?", W * .44 + 90, H * .42 - 24, 56, "#1b1d3a", { w: 900, a }); txt("only as a rare treat", W * .44 + 90, H * .42 + 36, 42, "#4a4f70", { w: 800, a }); }
    check(W * .8, H * .55, .8, (lt - d * .75) / .25); wobbleAll(lt, d, t); });
  KZ.shot("kLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .6) { pourScene(lt + .4, d, t, k); bubble("ONE MORE?", W * .42, H * .13, sm((lt - .1) / .25), -.04); }
    else hookK(0, d, t, true); });

  (function () { const SH = KZ.SHOTS; const split = (a, b, f) => (lt, d, t) => { const c = d * f; if (lt < c) SH[a](lt, c, t); else SH[b](lt - c, d - c, t); };
    KZ.shot("kCrateFull", split("kCrate", "kBox", .48));
    KZ.shot("kCowFull", split("kCow", "kCow2", .5)); })();
})();
