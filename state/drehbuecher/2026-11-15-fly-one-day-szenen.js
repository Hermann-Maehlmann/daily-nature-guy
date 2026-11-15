// Szenendatei "Flies Don't Live For Just One Day" (Stubenfliege Musca domestica, Comedy-Story + Mix-Stil, 15.11.2026).
// Quellen: Univ. of Florida IFAS EENY-048 (Erwachsene leben meist 15-25 Tage, bis 2 Monate; bis 500 Eier in Gelegen von 75-150;
// Entwicklung Ei->Fliege in 7-10 Tagen; nachts inaktiv), Penn State Extension (kann nicht beißen/kauen, nur flüssige Nahrung,
// verflüssigt feste Nahrung mit erbrochenem Speichel und saugt sie mit dem Rüssel auf).
// Helfer txt/stamp/navy/rudi/at aus dog-grass/cat-purr übernommen. Fliege neu gezeichnet: Seitenansicht (rote Facettenaugen,
// graue Brust mit 4 dunklen Längsstreifen, Tupfen-Hinterleib, Adern-Flügel, Borstenbeine, Tupfrüssel) + Draufsicht im Flug.
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

  // ================= Stubenfliege, Seitenansicht (Kopf rechts, Füße y=0, Länge ~440) =================
  // o: t, rub (0..1 Vorderbeine reiben), buzz (Flügel schwirren), sleep, spit (0..1 Speicheltropfen), seed
  function flyLeg(c, pts, w) { c.strokeStyle = F.leg; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke();
    c.lineWidth = 3; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; for (let k = 1; k < 4; k++) { const x = lerp(x0, x1, k / 4), y = lerp(y0, y1, k / 4); c.beginPath(); c.moveTo(x, y); c.lineTo(x + 10, y - 9); c.stroke(); } }
    const p = pts[pts.length - 1]; c.fillStyle = F.leg; c.beginPath(); c.ellipse(p[0] + 6, p[1] - 3, 13, 6, 0, 0, 7); c.fill(); }
  function fly(c, o) { o = o || {}; const t = o.t || 0, sd = o.seed || 0, br = Math.sin(t * 3 + sd) * 2;
    const rub = o.rub || 0, rp = Math.sin(t * 16 + sd) * rub;
    // ferne Beine
    flyLeg(c, [[-40, -120], [-120, -70], [-150, 0]], 9); flyLeg(c, [[10, -115], [-10, -60], [-30, 0]], 9);
    // Hinterleib mit Tupfen (Schachbrett-Glanz)
    kshape(c, ell(-120, -160 + br, 125, 82, -.12), F.abd, { rim: "rgba(255,240,200,.55)", shadow: "rgba(60,40,10,.35)", rw: 6, sw: 18 });
    c.save(); c.beginPath(); c.ellipse(-120, -160 + br, 125, 82, -.12, 0, 7); c.clip(); c.fillStyle = "rgba(70,55,30,.5)";
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { if ((i + j) % 2) continue; c.beginPath(); c.ellipse(-210 + i * 58, -210 + j * 48 + br, 28, 22, 0, 0, 7); c.fill(); }
    c.strokeStyle = "rgba(40,30,15,.5)"; c.lineWidth = 5; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(-120 - i * 40 + 80, -160 + br, 30, 84, 0, -1.3, 1.3); c.stroke(); } c.restore();
    c.strokeStyle = "rgba(30,25,20,.7)"; c.lineWidth = 3; for (let i = 0; i < 12; i++) { const a = -2.6 + i * .2, x = -120 + Math.cos(a) * 125, y = -160 + br + Math.sin(a) * 82; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 8, y - 12); c.stroke(); }
    // Brust (grau, 4 dunkle Längsstreifen)
    const thor = ell(30, -180 + br, 92, 84, -.05);
    kshape(c, thor, F.thor, { rim: "rgba(235,240,255,.6)", shadow: "rgba(20,20,40,.35)", rw: 6, sw: 18 });
    c.save(); thor(c); c.clip(); c.strokeStyle = F.thorD; c.lineCap = "round"; c.lineWidth = 13;
    for (let i = 0; i < 4; i++) { const yy = -246 + i * 26; c.beginPath(); c.moveTo(-60, yy + 16 + br); c.quadraticCurveTo(30, yy - 12 + br, 112, yy + 20 + br); c.stroke(); } c.restore();
    c.strokeStyle = "#141018"; c.lineWidth = 4; for (let i = 0; i < 9; i++) { const x = -30 + i * 16, y = -258 + Math.abs(i - 4) * 5 + br; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 4, y - 22); c.stroke(); }
    // nahe Beine
    flyLeg(c, [[-30, -120], [-90, -60], [-110, 0]], 12); flyLeg(c, [[20, -112], [20, -56], [10, 0]], 12);
    // Vorderbein (reibt am anderen)
    if (rub > 0) { const y1 = -60 + rp * 14; flyLeg(c, [[80, -120], [150, -86 + rp * 10], [210 + rp * 16, y1]], 12); flyLeg(c, [[70, -116], [140, -70 - rp * 8], [214 - rp * 16, y1 + 8]], 9); }
    else flyLeg(c, [[80, -120], [140, -70], [150, 0]], 12);
    // Flügel (an der Brust, liegen schräg über dem Hinterleib)
    const wingPath = (c) => { c.beginPath(); c.moveTo(0, -238 + br); c.bezierCurveTo(-90, -330 + br, -280, -320 + br, -300, -250 + br); c.bezierCurveTo(-300, -214 + br, -180, -214 + br, 0, -228 + br); c.closePath(); };
    const nW = o.buzz ? 3 : 1;
    for (let w = 0; w < nW; w++) { c.save(); const ang = o.buzz ? Math.sin(t * 60 + w * 2.1) * .5 - .25 : (o.sleep ? .05 : -.05); c.translate(0, -234 + br); c.rotate(ang); c.translate(0, 234 - br);
      c.globalAlpha = o.buzz ? .45 : 1; c.fillStyle = F.wing; wingPath(c); c.fill(); c.strokeStyle = "rgba(255,255,255,.75)"; c.lineWidth = 4; wingPath(c); c.stroke();
      c.strokeStyle = F.vein; c.lineWidth = 3.5; for (const [ex, ey] of [[-290, -282], [-280, -250], [-230, -224]]) { c.beginPath(); c.moveTo(-6, -236 + br); c.quadraticCurveTo(ex * .5, ey + br - 20, ex, ey + br); c.stroke(); }
      c.beginPath(); c.moveTo(-150, -296 + br); c.lineTo(-170, -222 + br); c.stroke(); c.restore(); }
    // Kopf: fast ganz rote Facettenaugen
    kshape(c, ell(142, -176 + br, 66, 74, 0), "#3a3640", { rim: "rgba(220,220,255,.4)", rw: 4, sw: 10 });
    const eyeP = ell(150, -192 + br, 56, 60, -.1);
    kshape(c, eyeP, F.eye, { rim: "rgba(255,190,160,.7)", shadow: "rgba(70,10,10,.45)", rw: 6, sw: 16 });
    if (o.sleep) { c.fillStyle = "#3a3640"; c.beginPath(); c.ellipse(150, -214 + br, 58, 40, -.1, Math.PI, 0); c.fill(); c.strokeStyle = "#1e1a22"; c.lineWidth = 6; c.beginPath(); c.moveTo(100, -212 + br); c.quadraticCurveTo(150, -196 + br, 204, -214 + br); c.stroke(); }
    else { c.save(); eyeP(c); c.clip(); c.strokeStyle = "rgba(90,10,10,.35)"; c.lineWidth = 2; for (let y = -260; y < -130; y += 12) for (let x = 90; x < 210; x += 14) { c.beginPath(); c.arc(x + ((y / 12) % 2) * 7, y + br, 6, 0, 7); c.stroke(); } c.restore();
      c.save(); c.globalCompositeOperation = "lighter"; c.fillStyle = "rgba(255,200,180,.55)"; c.beginPath(); c.ellipse(132, -224 + br, 18, 11, -.5, 0, 7); c.fill(); c.fillStyle = "rgba(255,230,220,.8)"; c.beginPath(); c.arc(124, -230 + br, 5, 0, 7); c.fill(); c.restore(); }
    // Fühler
    c.strokeStyle = "#1e1a22"; c.lineWidth = 6; c.beginPath(); c.moveTo(190, -150 + br); c.lineTo(214, -166 + br); c.stroke(); c.fillStyle = "#1e1a22"; c.beginPath(); c.ellipse(218, -166 + br, 9, 6, -.4, 0, 7); c.fill();
    // Tupfrüssel (Schwamm-Mund)
    const pr = Math.sin(t * 5 + sd) * 6;
    c.strokeStyle = "#2a2430"; c.lineWidth = 16; c.lineCap = "round"; c.beginPath(); c.moveTo(160, -112 + br); c.quadraticCurveTo(176, -80, 172 + pr * .3, -44); c.stroke();
    kshape(c, ell(176 + pr * .3, -36, 26, 13, 0), "#4a3f50", { rim: "rgba(255,220,255,.4)", rw: 3, sw: 4 });
    if (o.spit > 0) { const q = clamp(o.spit, 0, 1); c.save(); c.globalAlpha = .85; c.fillStyle = "#c8f06a"; c.beginPath(); c.ellipse(178, -36 + 14 * q, 18 + 22 * q, 10 + 8 * q, 0, 0, 7); c.fill(); c.globalCompositeOperation = "lighter"; c.fillStyle = "rgba(255,255,220,.6)"; c.beginPath(); c.arc(170, -34 + 12 * q, 6, 0, 7); c.fill(); c.restore(); }
    if (o.sleep) { c.save(); for (let i = 0; i < 3; i++) { const q = (t * .6 + i / 3) % 1; c.globalAlpha = 1 - q; c.fillStyle = "#fff"; c.font = `900 ${40 + i * 10}px "Montserrat"`; c.fillText("z", 200 + q * 80 + i * 18, -280 - q * 140); } c.restore(); }
  }
  function flyAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); fly(g, o); g.restore(); }
  // Fliege von oben im Flug (für Schwärme), Mitte bei x,y, Kopf in Flugrichtung
  function flyTop(x, y, s, ang, t, sd) { g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
    g.fillStyle = "rgba(225,240,255,.5)"; const fl = Math.sin(t * 70 + sd) * .35;
    for (const sg of [-1, 1]) { g.save(); g.rotate(sg * (.5 + fl)); g.beginPath(); g.ellipse(-30, sg * 34, 46, 20, sg * .2, 0, 7); g.fill(); g.restore(); }
    kshape(g, ell(-26, 0, 34, 22, 0), F.abd, { rw: 3, sw: 6 }); kshape(g, ell(8, 0, 22, 20, 0), F.thor, { rw: 3, sw: 5 });
    g.strokeStyle = F.thorD; g.lineWidth = 3; for (const yy of [-9, -3, 3, 9]) { g.beginPath(); g.moveTo(-8, yy); g.lineTo(24, yy); g.stroke(); }
    g.fillStyle = F.eye; g.beginPath(); g.ellipse(30, -11, 10, 9, 0, 0, 7); g.ellipse(30, 11, 10, 9, 0, 0, 7); g.fill(); g.restore(); }
  function swarm(n, cx, cy, rx, ry, t, s) { for (let i = 0; i < n; i++) { const sp = .7 + (i % 5) * .18, ph = t * sp * 2 + i * 1.37; const x = cx + Math.cos(ph) * rx * (.5 + (i % 3) * .25), y = cy + Math.sin(ph * 1.3 + i) * ry * (.5 + (i % 4) * .17);
    const vx = -Math.sin(ph) * rx, vy = Math.cos(ph * 1.3 + i) * ry * 1.3; flyTop(x, y, s * (.8 + (i % 3) * .15), Math.atan2(vy, vx), t, i); } }
  function buzzTrail(x, y, t, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * .7; g.strokeStyle = "#fff"; g.lineWidth = 6; g.setLineDash([16, 18]); g.lineCap = "round"; g.beginPath();
    for (let i = 0; i <= 40; i++) { const p = i / 40 * 6.283; const px = x + Math.cos(p + t * 3) * 120 * Math.cos(p * 2), py = y + Math.sin(p + t * 3) * 70; if (!i) g.moveTo(px, py); else g.lineTo(px, py); } g.stroke(); g.setLineDash([]); g.restore(); }

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

  // ================= Shots =================
  function hookF(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    kitchen(t, lerp(-330, -320, k), TOP - 190, lerp(2.3, 2.45, k));
    flyAt(-300, TOP, .62, { t, rub: 1, seed: 1 });
    if (loop) return;
    stamp("NOT 1 DAY!", W * .5, H * .58, (lt - d * .55) / .22, "#e5484d", -.06); }
  KZ.shot("fHook", (lt, d, t) => hookF(lt, d, t, false));
  KZ.shot("fBelieve", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-260, -200, k), -520, lerp(1.0, 1.1, k));
    const fx = -40 + Math.cos(t * 2.4) * 200, fy = -820 + Math.sin(t * 4.8) * 90; buzzTrail(-40, -820, t, 1); flyTop(fx, fy, 1.5, Math.atan2(Math.cos(t * 4.8) * 432, -Math.sin(t * 2.4) * 480), t, 2);
    if (lt < d * .45) at(rudi, -560, 0, 1, { t, arm: .9, watch: true, mouth: "grin", look: .6 });
    else sitRudi(-560, t, { arm: .7, watch: true, mouth: "grin", look: .7 });
    bubble("1 DAY? EASY.", W * .3, H * .1, sm((lt - .1) / .3), -.04);
    stamp("JUST WAIT", W * .62, H * .52, (lt - d * .55) / .22, "#2f6fd0", .06); });
  KZ.shot("fNight", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-260, -220, k), -500, lerp(1.15, 1.25, k), { night: 1, clockSpin: 1 }); nightTint(1);
    flyAt(-60, TOP, .45, { t, sleep: 1 });
    sitRudi(-500, t, { arm: .7, watch: true, mouth: "hmm", look: .9 });
    label("11 PM ... 2 AM ... 5 AM", W * .44, H * .14, sm((lt - .2) / .3)); });
  KZ.shot("fNight2", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-300, -320, k), -560, lerp(1.25, 1.35, k));
    sitRudi(-540, t, { arm: .2, mouth: "hmm", tired: 1, look: .7 });
    const ox = -330, oy = -980; for (let i = 0; i < 1; i++) { const p = t * 5; flyTop(ox + Math.cos(p) * 210, oy + Math.sin(p) * 110, 1.4, p + Math.PI / 2, t, 4); }
    buzzTrail(ox, oy, t * .9, .8);
    stamp("STILL BUZZING", W * .5, H * .52, (lt - d * .35) / .22, "#e5484d", .05); });
  KZ.shot("fWeek", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-900, -1000, k), -520, 1.05);
    const rx = lerp(-700, -1250, sm(clamp(lt / (d * .9), 0, 1)));
    at(rudi, rx, 0, 1, { t, walk: 1, arm: .1, case: true, mouth: "grin", look: .5 }, true);
    flyTop(-400 + Math.cos(t * 2) * 60, -700 + Math.sin(t * 4) * 40, 1.4, Math.PI, t, 5);
    label("BACK IN 7 DAYS", W * .5, H * .14, sm((lt - .2) / .3)); });
  KZ.shot("fWeek2", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-640, -610, k), -560, lerp(1.0, 1.08, k), { mess: 1 });
    at(rudi, -980, 0, 1, { t, arm: 1.5 + .5 * clamp(lt * 3, 0, 1), arm2: .5 + .5 * Math.sin(t * 10), mouth: "scream", mood: "scared", look: .8 });
    const n = Math.round(lerp(4, 18, sm(lt / (d * .5)))); swarm(n, -450, -760, 420, 260, t, 1.25);
    sweat(W * .16, H * .14, t, 1);
    stamp("FLY FAMILY", W * .55, H * .52, (lt - d * .3) / .22, "#f08a1e", -.05); });
  KZ.shot("fLife", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .01);
    txt("HOUSE FLY LIFESPAN", W * .44, H * .08, 66, "#fff", { w: 900, a: sm(lt / .3) });
    const x0 = W * .08, full = W * .74;
    txt("MYTH", x0, H * .15, 56, "#ff8a8a", { w: 900, align: "left", a: sm((lt - .1) / .2) });
    const mb = sm((lt - .2) / .3); g.fillStyle = "#e5484d"; g.beginPath(); g.roundRect(x0, H * .175, Math.max(14, full / 60 * mb), 100, 20); g.fill();
    txt("1 DAY", x0 + full / 60 + 34, H * .175 + 50, 64, "#fff", { w: 900, align: "left", a: mb });
    txt("REAL", x0, H * .27, 56, "#7ef0b0", { w: 900, align: "left", a: sm((lt - .5) / .2) });
    const rb = sm((lt - .6) / (d * .35)); g.fillStyle = "#2fae6a"; g.beginPath(); g.roundRect(x0, H * .295, full * 21 / 60 * rb, 100, 20); g.fill();
    txt("~3 WEEKS", x0 + full * 21 / 60 + 30, H * .295 + 50, 64, "#fff", { w: 900, align: "left", a: sm((lt - .6 - d * .3) / .2) });
    const lb = sm((lt - d * .55) / (d * .25)); if (lb > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = .55 * lb; g.strokeStyle = "#7ef0b0"; g.lineWidth = 6; g.setLineDash([18, 14]); g.beginPath(); g.roundRect(x0, H * .40, full * lb, 100, 20); g.stroke(); g.restore();
      txt("UP TO 2 MONTHS", x0 + 34, H * .40 + 50, 58, "#c9f5dc", { w: 900, align: "left", a: lb }); }
    if (rb > .25) flyTop(x0 + full * 21 / 60 * rb - 40, H * .295 + 50 + Math.sin(t * 8) * 6, 1.3, 0, t, 7);
    card(W * .44, H * .55, 820, 130, (lt - .4) / .3); txt("Source: University of Florida (IFAS)", W * .44, H * .55, 40, "#1b1d3a", { w: 800, a: sm((lt - .5) / .2) }); });
  KZ.shot("fEggs", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.1, sm(lt / d)) + Math.sin(t * 2) * .01);
    txt("EGGS FROM ONE FEMALE", W * .44, H * .09, 54, "#fff", { w: 900, a: sm(lt / .3) });
    const p = sm((lt - .2) / (d * .7)), n = Math.round(500 * p);
    for (let i = 0; i < 500; i++) { if (i >= n) break; const col = i % 25, row = Math.floor(i / 25); const x = W * .07 + col * 34, y = H * .14 + row * 34; g.fillStyle = "#fbf6e6"; g.beginPath(); g.ellipse(x + Math.sin(t * 3 + i) * 1.5, y, 9, 15, .4, 0, 7); g.fill(); }
    txt(String(n), W * .44, H * .58, 190, "#ffd84d", { w: 900, stroke: 14, a: sm((lt - .2) / .2) });
    stamp("UP TO", W * .2, H * .51, (lt - .3) / .25, "#2f6fd0", -.1); });
  KZ.shot("fCycle", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.08, sm(lt / d)) + Math.sin(t * 2) * .01);
    const cx = W * .44, cy = H * .33, R = 290; const p = sm((lt - .15) / (d * .75));
    g.setTransform(1, 0, 0, 1, 0, 0); g.lineWidth = 14; g.strokeStyle = "rgba(255,255,255,.15)"; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
    g.strokeStyle = "#ffd84d"; g.lineCap = "round"; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + p * 6.283); g.stroke();
    const st = [["EGG", 0], ["MAGGOT", 1], ["PUPA", 2], ["FLY", 3]];
    st.forEach(([name, i]) => { const a = -Math.PI / 2 + i * Math.PI / 2, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, on = sm((p * 4 - i) / .5 + .5);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = .35 + .65 * on; g.translate(x, y); const s = 1 + .15 * on * Math.sin(t * 6);
      kshape(g, ell(0, 0, 88 * s, 88 * s, 0), "#f7f4ec", { rw: 4, sw: 8 });
      if (i === 0) { for (let j = 0; j < 3; j++) { g.fillStyle = "#e9e0c8"; g.beginPath(); g.ellipse(-24 + j * 24, 6 - (j % 2) * 12, 11, 20, .4, 0, 7); g.fill(); g.strokeStyle = "rgba(0,0,0,.2)"; g.lineWidth = 2; g.stroke(); } }
      else if (i === 1) { g.fillStyle = "#f1e6c8"; g.beginPath(); g.ellipse(0, 0, 54, 22, Math.sin(t * 4) * .1, 0, 7); g.fill(); g.strokeStyle = "rgba(120,90,40,.45)"; g.lineWidth = 3; for (let j = -3; j <= 3; j++) { g.beginPath(); g.moveTo(j * 13, -20); g.lineTo(j * 13, 20); g.stroke(); } g.fillStyle = "#2a2233"; g.beginPath(); g.arc(50, -4, 4, 0, 7); g.fill(); }
      else if (i === 2) { kshape(g, ell(0, 0, 46, 26, 0), "#8a4a22", { rim: "rgba(255,200,150,.6)", rw: 3, sw: 6 }); }
      else { g.restore(); g.setTransform(1, 0, 0, 1, 0, 0); flyTop(x, y, 1.15, -Math.PI / 2 + Math.sin(t * 3) * .2, t, 9); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = .35 + .65 * on; g.translate(x, y); }
      g.restore(); txt(name, x, y + (i === 2 ? 0 : 0) + 124, 40, "#fff", { w: 900, a: .35 + .65 * on }); });
    txt(String(Math.max(1, Math.round(7 * p))), cx, cy - 20, 150, "#ffd84d", { w: 900, a: sm((lt - .1) / .2) });
    txt("DAYS", cx, cy + 80, 54, "#fff", { w: 900, a: sm((lt - .1) / .2) }); });
  KZ.shot("fSpit", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-450, -430, k), TOP - 140, lerp(2.15, 2.3, k));
    // Brotscheibe
    kshape(g, (c) => { c.beginPath(); c.roundRect(-560, TOP - 30, 380, 30, 10); }, "#f3d79a", { rim: "rgba(255,240,200,.8)", rw: 3, sw: 5 });
    const q = sm((lt - d * .35) / (d * .4));
    flyAt(-420, TOP - 28, .62, { t, spit: q });
    if (q > .3) { g.save(); g.globalAlpha = (q - .3) * 1.2; g.fillStyle = "#b8e05a"; g.beginPath(); g.ellipse(-310, TOP - 28, 46 * q, 8, 0, 0, 7); g.fill(); g.restore(); }
    label("NO TEETH. SPONGE MOUTH.", W * .44, H * .14, sm((lt - .1) / .3));
    stamp("EWW.", W * .6, H * .52, (lt - d * .65) / .22, "#2fae6a", .07); });
  KZ.shot("fStart", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(-640, -580, k), -580, lerp(1.1, 1.2, k), { mess: 1 });
    at(rudi, -940, 0, 1, { t, arm: .2, mouth: "hmm", look: .6 }); swarm(16, -400, -780, 430, 280, t, 1.25);
    stamp("HEAD START", W * .5, H * .5, (lt - d * .35) / .22, "#e5484d", .06); });
  KZ.shot("fTip", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.06, sm(lt / d)) + Math.sin(t * 2) * .01);
    const items = [["COVER YOUR FOOD", 0], ["EMPTY THE BIN", 1], ["OPEN A WINDOW", 2]];
    items.forEach(([s, i]) => { const a0 = d * (.05 + i * .28), y = H * (.14 + i * .15), p = (lt - a0) / .3; card(W * .44, y, 840, 220, p); if (p <= 0) return; const a = sm(p);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.translate(W * .44 - 300, y);
      if (i === 0) { kshape(g, (c) => { c.beginPath(); c.ellipse(0, 20, 80, 70, 0, Math.PI, 0); c.closePath(); }, "rgba(170,220,255,.9)", { rim: "rgba(255,255,255,.9)", rw: 4, sw: 6 }); g.fillStyle = "#d99a4e"; g.beginPath(); g.ellipse(0, 12, 50, 18, 0, 0, 7); g.fill(); g.fillStyle = "#2a2233"; g.beginPath(); g.arc(0, -56, 9, 0, 7); g.fill(); }
      else if (i === 1) { kshape(g, (c) => { c.beginPath(); c.moveTo(-50, -50); c.lineTo(50, -50); c.lineTo(40, 70); c.lineTo(-40, 70); c.closePath(); }, "#5a6ab0", { rw: 4, sw: 6 }); kshape(g, (c) => { c.beginPath(); c.roundRect(-60, -74, 120, 24, 8); }, "#46548f", { rw: 3, sw: 4 }); }
      else { kshape(g, (c) => { c.beginPath(); c.roundRect(-70, -70, 140, 140, 10); }, "#f2ead8", { rw: 4, sw: 6 }); g.fillStyle = "#8fd0ff"; g.fillRect(-58, -58, 116, 116); g.fillStyle = "#f2ead8"; g.fillRect(-4, -58, 8, 116); }
      g.restore(); txt(s, W * .44 + 80, y, 52, "#1b1d3a", { w: 900, a });
      if (i === 2) { const fp = clamp((lt - a0 - .3) / 1.2, 0, 1); if (fp > 0) flyTop(W * .44 - 300 + fp * 260, y - fp * 160, 1.1, -.6, t, 11); } }); });
  KZ.shot("fLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .6) { kitchen(t, lerp(-300, -260, k), -520, lerp(1.1, 1.18, k)); buzzTrail(-60, -820, t, 1);
      flyTop(-60 + Math.cos(t * 2.4) * 200, -820 + Math.sin(t * 4.8) * 90, 1.5, Math.atan2(Math.cos(t * 4.8) * 432, -Math.sin(t * 2.4) * 480), t, 2);
      sitRudi(-600, t, { arm: .7, watch: true, mouth: "grin", look: .7 }); bubble("I'LL JUST WAIT.", W * .32, H * .1, sm((lt - .1) / .25), -.04); }
    else hookF(0, d, t, true); });

  (function () { const SH = KZ.SHOTS; const split = (a, b, f) => (lt, d, t) => { const c = d * f; if (lt < c) SH[a](lt, c, t); else SH[b](lt - c, d - c, t); };
    KZ.shot("fNightFull", split("fNight", "fNight2", .5));
    KZ.shot("fWeekFull", split("fWeek", "fWeek2", .56)); })();
})();
