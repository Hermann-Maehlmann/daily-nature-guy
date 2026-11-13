// Szenendatei "Touching Butterflies Won't Kill Them" (Tagpfauenauge Aglais io, dazu Monarch). Mix-Stil (Hermann 12.11.2026).
// Quellen: Lepidopterists' Society FAQ ("It is most definitely NOT true", Schuppen gehen bei jedem Flug verloren, Farbe für Partnerwahl/Feindabwehr),
// Library of Congress (Puder = Schuppen, lebenslang abgeworfen), Physics Today 2023 (bis >1 Mio Schuppen, Monarch-Versuch 2017 ohne Schuppen flog),
// WSU Ask Dr. Universe (David James: zerfledderte Falter fliegen weiter), Florida Museum (Flügel können beim Greifen an den Spitzen brechen).
// Helfer txt/stamp/navy/rudi/at/sparkle/cross/check/lawn aus ladybug-spots übernommen (Rudi bleibt gleich). Schmetterling neu gezeichnet:
// 4 Flügel (Vorderflügel mit großem Augenfleck, Hinterflügel mit blauem Augenfleck), behaarte Brust, Hinterleib mit Ringen, Keulenfühler, eingerollter Rüssel.
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

  // ---------- Farben mischen ----------
  function hx2(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function mix(a, b, k) { const A = hx2(a), B = hx2(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(k, 0, 1)))).join(",")})`; }

  // ================= Tagpfauenauge (Aglais io) / Monarch =================
  // Draufsicht, Kopf oben, Körpermitte (0,0), Spannweite ~600.
  // o: t, pal ("io"|"monarch"), flap (Frequenz, 0 = offen), open (0..1 fest), fade (0..1 Schuppen weg), tatter (0..1), noEyes, look, mood, seed, crack (0..1 rechte Vorderflügelspitze)
  const IO = { base: "#d9432f", baseL: "rgba(255,210,180,.8)", edge: "#4a2230", spotY: "#f2d36a", spotB: "#5aa8ff", spotK: "#1b1724", body: "#3a2a30", under: "#2f2228" };
  const MO = { base: "#f28a26", baseL: "rgba(255,225,170,.8)", edge: "#1e1620", vein: "#1e1620", body: "#1e1620" };
  const FW = (c) => { c.beginPath(); c.moveTo(10, -78); c.bezierCurveTo(80, -200, 210, -258, 300, -222); c.quadraticCurveTo(318, -110, 252, -16); c.quadraticCurveTo(120, 8, 12, -6); c.closePath(); };
  const HW = (c) => { c.beginPath(); c.moveTo(12, -16); c.bezierCurveTo(140, -30, 258, 26, 236, 128); c.quadraticCurveTo(200, 222, 96, 206); c.quadraticCurveTo(30, 160, 10, 60); c.closePath(); };
  function tatterClip(c, k, seed) { if (!k) return; c.beginPath(); c.rect(-2000, -2000, 4000, 4000);
    const N = [[300, -222, 46], [276, -90, 34], [236, 128, 42], [150, 210, 36], [200, -240, 30], [262, -10, 26]];
    N.forEach(([x, y, r], i) => { const rr = r * k * (.7 + ((i * 7 + seed) % 5) * .12); c.moveTo(x + rr, y); c.arc(x, y, rr, 0, 7); }); c.clip("evenodd"); }
  function wingSide(c, o, P, fadeK) { const mon = o.pal === "monarch";
    const base = mix(P.base, "#b9aaa2", fadeK), edge = mix(P.edge, "#8a7c80", fadeK);
    c.save(); tatterClip(c, o.tatter || 0, o.seed || 0);
    // Hinterflügel
    kshape(c, HW, base, { rim: P.baseL, shadow: "rgba(70,0,20,.3)", rw: 6, sw: 16 });
    c.save(); HW(c); c.clip();
    c.fillStyle = edge; c.beginPath(); c.ellipse(150, 130, 160, 120, .3, 0, 7); c.rect(-10, -100, 600, 600); c.fill("evenodd");
    if (!mon) { c.fillStyle = edge; c.beginPath(); c.ellipse(60, 60, 80, 110, 0, 0, 7); c.fill();
      // Augenfleck Hinterflügel
      c.fillStyle = mix("#1b1724", "#8a7c80", fadeK); c.beginPath(); c.ellipse(158, 92, 58, 52, .2, 0, 7); c.fill();
      c.fillStyle = mix(P.spotB, "#a9a2b0", fadeK); for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(130 + i * 13, 70 + Math.sin(i) * 14, 9, 0, 7); c.fill(); }
      c.fillStyle = mix("#e8dccb", "#c8c0c0", fadeK); c.beginPath(); c.ellipse(158, 92, 62, 56, .2, 0, 7); c.ellipse(158, 92, 56, 50, .2, 0, 7); c.fill("evenodd"); }
    else { c.strokeStyle = edge; c.lineWidth = 7; for (const [x2, y2] of [[230, 100], [200, 170], [130, 200], [60, 170]]) { c.beginPath(); c.moveTo(16, 0); c.quadraticCurveTo((16 + x2) / 2 + 20, y2 / 2 - 20, x2, y2); c.stroke(); }
      c.fillStyle = edge; c.beginPath(); c.ellipse(150, 120, 115, 105, .3, 0, 7); c.rect(-10, -100, 600, 600); c.fill("evenodd");
      c.fillStyle = "#f4efe6"; for (let i = 0; i < 9; i++) { const a = -.5 + i * .25; c.beginPath(); c.arc(150 + Math.cos(a) * 125, 120 + Math.sin(a) * 112, 5, 0, 7); c.fill(); } }
    c.restore();
    // Vorderflügel
    kshape(c, FW, base, { rim: P.baseL, shadow: "rgba(70,0,20,.3)", rw: 6, sw: 16 });
    c.save(); FW(c); c.clip();
    if (!mon) { c.fillStyle = edge; c.beginPath(); c.ellipse(150, -110, 190, 120, -.35, 0, 7); c.rect(-10, -400, 600, 600); c.fill("evenodd");
      c.fillStyle = mix("#1b1724", "#8a7c80", fadeK); for (const [x, y, w] of [[100, -150, 26], [150, -190, 22]]) { c.beginPath(); c.ellipse(x, y, w, 40, -.5, 0, 7); c.fill(); }
      // großer Augenfleck an der Spitze
      const ex = 222, ey = -160;
      c.fillStyle = mix(P.spotY, "#d8d0c0", fadeK); c.beginPath(); c.ellipse(ex, ey, 64, 56, -.4, 0, 7); c.fill();
      c.fillStyle = mix("#c23a5a", "#a89aa0", fadeK); c.beginPath(); c.ellipse(ex - 6, ey + 4, 50, 42, -.4, 0, 7); c.fill();
      c.fillStyle = mix(P.spotB, "#a9a2b0", fadeK); c.beginPath(); c.ellipse(ex + 4, ey - 2, 34, 28, -.4, 0, 7); c.fill();
      c.fillStyle = mix("#1b1724", "#8a7c80", fadeK); c.beginPath(); c.ellipse(ex - 2, ey + 4, 18, 15, -.4, 0, 7); c.fill();
      c.fillStyle = "rgba(255,255,255,.85)"; c.beginPath(); c.arc(ex + 10, ey - 8, 6, 0, 7); c.fill(); }
    else { c.strokeStyle = edge; c.lineWidth = 7; for (const [x2, y2] of [[300, -222], [290, -150], [270, -70], [200, -10], [120, 0]]) { c.beginPath(); c.moveTo(12, -40); c.quadraticCurveTo((12 + x2) / 2, (y2 - 40) / 2 - 20, x2, y2); c.stroke(); }
      c.fillStyle = edge; c.beginPath(); c.ellipse(140, -100, 170, 104, -.3, 0, 7); c.rect(-10, -400, 600, 600); c.fill("evenodd");
      c.fillStyle = edge; c.beginPath(); c.moveTo(150, -232); c.quadraticCurveTo(250, -270, 310, -222); c.lineTo(300, -120); c.quadraticCurveTo(230, -200, 150, -232); c.fill();
      c.fillStyle = "#f4efe6"; for (let i = 0; i < 8; i++) { c.beginPath(); c.arc(258 + (i % 2) * 22, -210 + i * 22, 6, 0, 7); c.fill(); }
      c.fillStyle = "#f6b44a"; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(230 + i * 20, -190 + i * 8, 7, 0, 7); c.fill(); } }
    // Glanz
    c.globalAlpha = .22; c.fillStyle = "#fff"; c.beginPath(); c.ellipse(120, -150, 70, 16, -.6, 0, 7); c.fill(); c.globalAlpha = 1;
    c.restore(); c.restore(); }
  function bfly(c, o) { o = o || {}; const t = o.t || 0, P = o.pal === "monarch" ? MO : IO, fadeK = o.fade || 0;
    let open = o.open ?? 1; if (o.flap) open = .22 + .78 * Math.abs(Math.cos(t * o.flap + (o.seed || 0)));
    const br = Math.sin(t * 3 + (o.seed || 0)) * 2;
    for (const s of [-1, 1]) { c.save(); c.scale(s * open, 1); wingSide(c, o, P, fadeK);
      if (s > 0 && o.crack) { c.strokeStyle = `rgba(255,255,255,${.95 * Math.min(1, o.crack * 2)})`; c.lineWidth = 6; c.lineJoin = "round"; c.beginPath(); c.moveTo(200, -246); c.lineTo(222, -200); c.lineTo(206, -170); c.lineTo(236, -128); c.lineTo(222, -90); c.stroke(); }
      c.restore(); }
    // Beine (vorne sichtbar, dünn)
    c.strokeStyle = P.body; c.lineWidth = 5; c.lineCap = "round"; for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { c.beginPath(); c.moveTo(s * 10, -60 + i * 30); c.lineTo(s * 34, -70 + i * 34); c.lineTo(s * 44, -48 + i * 34); c.stroke(); }
    // Körper: Hinterleib, Brust, Kopf
    kshape(c, (c) => { c.beginPath(); c.ellipse(0, 70 + br, 17, 96, 0, 0, 7); }, P.body, { rim: "rgba(220,200,255,.45)", rw: 4, sw: 6 });
    c.strokeStyle = "rgba(255,255,255,.15)"; c.lineWidth = 3; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-15, 10 + i * 24 + br); c.quadraticCurveTo(0, 16 + i * 24 + br, 15, 10 + i * 24 + br); c.stroke(); }
    kshape(c, ell(0, -50, 24, 46, 0), P.body, { rim: "rgba(220,200,255,.5)", rw: 4, sw: 6 });
    c.fillStyle = "rgba(200,170,150,.35)"; for (let i = 0; i < 10; i++) { c.beginPath(); c.arc(-14 + (i % 4) * 9, -80 + Math.floor(i / 4) * 22, 5, 0, 7); c.fill(); }
    kshape(c, ell(0, -108, 22, 20, 0), P.body, { rim: "rgba(220,200,255,.5)", rw: 3, sw: 5 });
    // Fühler mit Keule
    c.strokeStyle = P.body; c.lineWidth = 5; const as = Math.sin(t * 2.4 + (o.seed || 0)) * 6;
    for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 8, -124); c.quadraticCurveTo(s * 34, -200, s * (64 + as * .4), -236 + as * s * .3); c.stroke(); c.fillStyle = "#f4efe6"; c.beginPath(); c.ellipse(s * (66 + as * .4), -240 + as * s * .3, 9, 13, s * .5, 0, 7); c.fill(); }
    // Rüssel (eingerollt)
    c.strokeStyle = "#5a3a40"; c.lineWidth = 3; c.beginPath(); c.arc(0, -84, 8, -1, 3.6); c.stroke();
    if (!o.noEyes) { fig.eye(c, -12, -114, 12, { t, seed: o.seed || 4, look: o.look ?? 0, mood: o.mood }); fig.eye(c, 12, -114, 12, { t, seed: o.seed || 4, look: o.look ?? 0, mood: o.mood }); } }
  function bfAt(x, y, s, rot, o) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s); bfly(g, o); g.restore(); }

  // ---------- Requisiten ----------
  // großer Zeigefinger, Spitze bei (0,0), zeigt nach rechts
  function finger(x, y, s, rot, o) { o = o || {}; g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.moveTo(-900, -70); c.lineTo(-60, -70); c.quadraticCurveTo(10, -70, 10, 0); c.quadraticCurveTo(10, 70, -60, 70); c.lineTo(-900, 70); c.closePath(); }, C.skin, { rim: "rgba(255,240,225,.85)", shadow: "rgba(150,60,40,.22)", rw: 6, sw: 18 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-110, -62, 96, 66, [30, 34, 10, 10]); }, "#fbe0d0", { rim: "rgba(255,255,255,.9)", shadow: "rgba(150,60,40,.15)", rw: 4, sw: 6 });
    g.strokeStyle = "rgba(170,90,70,.4)"; g.lineWidth = 5; for (const kx of [-290, -560]) for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(kx + i * 14, -40); g.quadraticCurveTo(kx + i * 14 + 8, 0, kx + i * 14, 40); g.stroke(); }
    if (o.sleeve) { kshape(g, (c) => { c.beginPath(); c.roundRect(-1300, -110, 520, 220, 40); }, C.coat, { rim: "rgba(255,245,200,.7)", rw: 6, sw: 16 }); }
    if (o.dust) { const cols = ["#d9432f", "#f2d36a", "#5aa8ff", "#4a2230", "#f28a26"];
      for (let i = 0; i < 46; i++) { const px = -20 - (i * 37) % 170, py = -58 + (i * 53) % 116, a = clamp(o.dust * 46 - i, 0, 1); if (a <= 0) continue; g.globalAlpha = a; g.fillStyle = cols[i % 5]; g.beginPath(); g.ellipse(px, py, 7, 4, i, 0, 7); g.fill(); }
      g.globalAlpha = 1; g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 5; i++) glow(-80 + Math.sin(i * 2.1) * 70, Math.cos(i * 1.7) * 40, 26, `rgba(255,230,160,${.5 * o.dust * (.5 + .5 * Math.sin((o.t || 0) * 6 + i))})`); g.restore(); }
    g.restore(); }
  // Daumen + Zeigefinger kneifen (Spitzen treffen sich bei 0,0)
  function pinch(x, y, s, p) { const gap = lerp(90, 14, p); finger(x - 6, y - gap, s, .18); g.save(); g.translate(x, y + gap); g.scale(s, -s); g.rotate(.18); g.scale(1 / s, 1 / s); g.restore(); finger(x - 6, y + gap, s, -.18); }
  function flower(x, y, s, t, col, ci) { g.save(); g.translate(x, y); g.scale(s, s);
    g.strokeStyle = "#2f8a48"; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(14, 200, 0, 520); g.stroke();
    kshape(g, (c) => { c.beginPath(); c.moveTo(4, 260); c.quadraticCurveTo(120, 200, 150, 250); c.quadraticCurveTo(90, 300, 4, 260); c.closePath(); }, C.leaf, { rim: "rgba(220,255,200,.6)", rw: 4, sw: 6 });
    g.rotate(Math.sin(t * 1.3 + x) * .05);
    for (let i = 0; i < 8; i++) { g.save(); g.rotate(i * Math.PI / 4); kshape(g, ell(0, -62, 30, 56, 0), col || "#ff8fc0", { rim: "rgba(255,240,250,.85)", rw: 4, sw: 6 }); g.restore(); }
    kshape(g, ell(0, 0, 36, 36, 0), ci || "#ffcf3a", { rim: "rgba(255,250,210,.9)", rw: 4, sw: 6 }); g.restore(); }
  function meadow(t, cx, cy, z) { lawn(t, cx, cy, z);
    const F = [[-900, "#ff8fc0"], [-560, "#b48cff"], [-260, "#ff8fc0"], [120, "#fff4f8"], [460, "#b48cff"], [800, "#ff8fc0"], [1150, "#fff4f8"]];
    F.forEach(([fx, col], i) => flower(fx, -260 - (i % 3) * 60, .7 + (i % 2) * .15, t, col)); }
  // Rotkehlchen (Seitenansicht, Kopf rechts, Füße y=0, Länge ~300). o: t, scare (0..1)
  function robin(c, o) { const t = o.t || 0, sc = o.scare || 0, br = Math.sin(t * 3) * 3;
    c.save(); c.translate(-sc * 60, -sc * 20); c.rotate(-sc * .25);
    c.strokeStyle = "#8a6a5a"; c.lineWidth = 7; for (const x of [-14, 18]) { c.beginPath(); c.moveTo(x, -46); c.lineTo(x + 4, 0); c.stroke(); }
    kshape(c, (c) => { c.beginPath(); c.moveTo(-90, -100); c.lineTo(-210, -60); c.lineTo(-196, -40); c.lineTo(-80, -76); c.closePath(); }, "#7a5a3e", { rim: "rgba(255,230,190,.4)", rw: 4, sw: 6 });
    kshape(c, ell(0, -96 + br, 104, 64, -.08), "#8a6a48", { rim: "rgba(255,230,190,.5)", shadow: "rgba(60,30,0,.25)", rw: 6, sw: 14 });
    kshape(c, (c) => { c.beginPath(); c.ellipse(30, -70 + br, 70, 40, -.2, 0, 7); }, "#f4ece0", { rim: "rgba(255,255,255,.8)", rw: 4, sw: 6 });
    kshape(c, (c) => { c.beginPath(); c.ellipse(-30, -112 + br, 72, 34, -.2, 0, 7); }, "#6e5236", { rim: "rgba(255,230,190,.45)", rw: 4, sw: 8 });
    c.save(); c.translate(80, -146 + br);
    kshape(c, ell(0, 0, 54, 50, 0), "#8a6a48", { rim: "rgba(255,230,190,.5)", rw: 4, sw: 8 });
    kshape(c, (c) => { c.beginPath(); c.moveTo(-30, 0); c.quadraticCurveTo(10, -18, 52, 0); c.quadraticCurveTo(70, 50, 30, 92); c.quadraticCurveTo(-20, 100, -40, 70); c.quadraticCurveTo(-46, 30, -30, 0); c.closePath(); }, "#f0702e", { rim: "rgba(255,220,170,.8)", shadow: "rgba(120,30,0,.25)", rw: 4, sw: 8 });
    fig.eye(c, 22, -10, 14, { t, seed: 9, look: .5, mood: sc > .3 ? "scared" : undefined });
    c.fillStyle = "#3a2a20"; c.beginPath(); c.moveTo(48, 2); c.lineTo(82, 8); c.lineTo(48, 16); c.fill();
    c.restore(); c.restore(); }
  function roomDay(t, cx, cy, z) {
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#5a4fa8"); bg.addColorStop(1, "#2d2868"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(cx, cy, z);
    const wx = 40, wy = -880, ww = 560, wh = 600;
    const sk = g.createLinearGradient(0, wy, 0, wy + wh); sk.addColorStop(0, "#6ec0ff"); sk.addColorStop(1, "#bfe6ff"); g.fillStyle = sk; g.fillRect(wx, wy, ww, wh);
    g.fillStyle = "#4cb862"; g.beginPath(); g.ellipse(wx + 160, wy + wh, 260, 140, 0, Math.PI, 0); g.ellipse(wx + 460, wy + wh, 220, 110, 0, Math.PI, 0); g.fill();
    g.save(); g.globalCompositeOperation = "lighter"; glow(wx + 440, wy + 130, 120, "rgba(255,240,170,.6)"); g.restore(); g.fillStyle = "#fff4c0"; g.beginPath(); g.arc(wx + 440, wy + 130, 46, 0, 7); g.fill();
    g.strokeStyle = "#f4f2ff"; g.lineWidth = 28; g.strokeRect(wx, wy, ww, wh);
    // offener Fensterflügel
    kshape(g, (c) => { c.beginPath(); c.moveTo(wx - 4, wy); c.lineTo(wx - 170, wy + 60); c.lineTo(wx - 170, wy + wh - 60); c.lineTo(wx - 4, wy + wh); c.closePath(); }, "rgba(200,230,255,.55)", { rim: "rgba(255,255,255,.9)", rw: 8, sw: 6 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(wx - 60, wy + wh, ww + 120, 44, 10); }, "#f4f2ff", { rim: "rgba(255,255,255,.9)", shadow: "rgba(40,40,100,.3)", rw: 4, sw: 10 });
    g.fillStyle = "#4a3f86"; g.fillRect(-2000, 0, 4000, 2000); g.fillStyle = "#5a4f9a"; g.fillRect(-2000, 0, 4000, 14);
    return [wx, wy, ww, wh]; }
  // eine einzelne Schuppe (Spitze oben gezackt), Basis bei (0,0)
  function scale1(c, x, y, w, h, col) { c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h * .8); for (let i = 0; i <= 4; i++) c.lineTo(x - w / 2 + i * w / 4, y - h + (i % 2 ? 0 : 10)); c.lineTo(x + w / 2, y); c.quadraticCurveTo(x, y + 12, x - w / 2, y); c.closePath(); c.fillStyle = col; c.fill(); }
  // Schuppenteppich mit Augenfleck-Muster (Pointillismus), Bildschirmkoordinaten
  function tiles(cx, cy, r, sz, t, appear) { g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.clip();
    g.fillStyle = "#7a1f2a"; g.fillRect(cx - r, cy - r, r * 2, r * 2);
    const w = sz, h = sz * 1.5, rows = Math.ceil(r * 2 / (h * .55)) + 2, cols = Math.ceil(r * 2 / w) + 2; let n = 0;
    for (let j = rows - 1; j >= 0; j--) for (let i = 0; i < cols; i++) { const x = cx - r + i * w + (j % 2) * w / 2, y = cy - r + j * h * .55 + h;
      const d = Math.hypot(x - cx - r * .1, y - cy + r * .05) / r;
      let col = d < .16 ? "#1b1724" : d < .3 ? "#5aa8ff" : d < .44 ? "#c23a5a" : d < .56 ? "#f2d36a" : (i + j) % 7 === 0 ? "#b8342a" : "#d9432f";
      const a = appear == null ? 1 : clamp(appear * 1.6 - ((i * 13 + j * 7) % 17) / 17 * .6, 0, 1); if (a <= 0) continue;
      g.globalAlpha = a; scale1(g, x, y + (1 - a) * 20, w * .96, h, col); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(x - w * .3, y - h * .7, w * .12, h * .5); n++; }
    g.globalAlpha = 1; g.restore();
    g.save(); g.strokeStyle = "#fff"; g.lineWidth = 14; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); g.restore(); }

  // ================= Shots =================
  function hookShot(lt, d, t, loop) { const k = sm(lt / d);
    meadow(t, loop ? lerp(-30, -40, k) : lerp(-20, -50, k), -330, loop ? lerp(1.5, 1.52, k) : lerp(1.52, 1.64, k));
    bfAt(60, -330, .95, -.1, { t, flap: 0, open: .92 + Math.sin(t * 2) * .06, seed: 1, look: -.4, mood: undefined });
    const tp = loop ? .3 : sm((lt - .1) / .5); finger(lerp(-560, -190, tp), -290, .8, -.05, { sleeve: true });
    if (!loop) { check(W * .5, H * .16, 1.1, (lt - d * .55) / .25); stamp("STILL ALIVE", W * .5, H * .6, (lt - d * .62) / .25, "#2fae6a", -.06); } }
  KZ.shot("bfHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("bfLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .6) { meadow(t, lerp(-60, -20, k), -390, lerp(1.3, 1.42, k)); const r = at(rudi, -170, 0, 1, { t, arm: .5, mouth: "hmm", look: .6 });
      g.save(); g.translate(-170 + r.hx + 10, r.hy - 6); g.scale(.36, .36); finger(0, 0, 1, 0, { dust: 1, t }); g.restore();
      bfAt(260, lerp(-500, -720, k), .32, .3, { t, flap: 9, seed: 2, look: .3 }); label("DUST?", W * .6, H * .2, sm((lt - .3) / .3)); }
    else hookShot(lt - d * .6, d, t, true); });

  KZ.shot("bfPanic", (lt, d, t) => { const k = sm(lt / d); meadow(t, lerp(-80, -20, k), -400, lerp(1.3, 1.45, k));
    const look = sm((lt - d * .3) / .3);
    const r = at(rudi, -180, 0, 1, { t, arm: lerp(.9, .45, look), mouth: lt > d * .55 ? "scream" : "smile", look: lerp(.8, .3, look) });
    g.save(); g.translate(-180 + r.hx + 10, r.hy - 6); g.rotate(lerp(-.6, 0, look)); g.scale(.36, .36); finger(0, 0, 1, 0, { dust: sm((lt - .3) / .8), t }); g.restore();
    const fl = sm((lt - .1) / (d * .8)); bfAt(lerp(-40, 170, fl), lerp(-560, -900, fl) + Math.sin(t * 5) * 20, .34, .2, { t, flap: 10, seed: 3, look: .4 });
    stamp("OH NO!", W * .5, H * .14, (lt - d * .58) / .25, "#e5484d", -.08); });

  KZ.shot("bfMyth", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.06, sm(lt / d)));
    txt("THE RUMOR", W * .44, H * .1, 70, "#fff", { w: 900 });
    const B = [["IT CAN'T FLY!", W * .3, H * .2, -.05], ["IT WILL DIE!", W * .58, H * .29, .05], ["NEVER TOUCH!", W * .32, H * .37, -.03]];
    B.forEach(([s, x, y, r], i) => { const a = sm((lt - .1 - i * .35) / .3); if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(r); g.scale(easeBack(a), easeBack(a));
      g.font = '800 48px "Montserrat"'; const w = g.measureText(s).width + 60; g.fillStyle = "#fff"; g.beginPath(); g.roundRect(-w / 2, -48, w, 96, 48); g.fill(); g.beginPath(); g.moveTo(-20, 40); g.lineTo(-40, 80); g.lineTo(10, 44); g.fill();
      g.fillStyle = "#1b1d3a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 0, 2); g.restore(); });
    g.setTransform(1, 0, 0, 1, 0, 0); bfAt(W * .44, H * .57, .5, 0, { t, open: .35 + Math.sin(t * 1.4) * .05, seed: 5, mood: "scared", look: 0 });
    stamp("GROUNDED?", W * .44, H * .45, (lt - d * .6) / .25, "#f08a1e", .06); });

  KZ.shot("bfZoom", (lt, d, t) => { const k = sm(lt / d);
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2a6a5a"); bg.addColorStop(1, "#123a3a"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .3, H * .3, 500, "rgba(160,255,200,.12)"); g.restore();
    cam(lerp(-60, -20, k), 0, lerp(1.0, 1.15, k)); finger(140, 140, 1.25, -.12, { dust: 1, t, sleeve: true });
    g.setTransform(1, 0, 0, 1, 0, 0); const m = easeBack(clamp((lt - .5) / .5, 0, 1));
    if (m > 0) { const cx = W * .5, cy = H * .3, r = 300 * m;
      g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 6; g.setLineDash([14, 14]); g.beginPath(); g.moveTo(W * .45, H * .48); g.lineTo(cx, cy + r); g.stroke(); g.setLineDash([]);
      tiles(cx, cy, r, 64 + (1 - k) * 20, t, sm((lt - .6) / .6)); }
    label("SCALES", W * .5, H * .53, sm((lt - d * .55) / .3)); });

  KZ.shot("bfTiles", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const p = clamp(lt / (d * .75), 0, 1), n = Math.round(1000000 * sm(p) / 1000) * 1000;
    txt(n.toLocaleString("en-US"), W * .44, H * .1, 120, "#ffd84d", { w: 900, stroke: 12 }); txt("SCALES PER BUTTERFLY", W * .44, H * .165, 44, "#fff", { w: 800 });
    tiles(W * .3, H * .38, 230, 46, t, sm(lt / .8));
    // Dach daneben
    g.save(); g.translate(W * .68, H * .44); const ra = sm((lt - d * .35) / .4); g.globalAlpha = ra; g.scale(.9 * easeBack(ra), .9 * easeBack(ra));
    kshape(g, (c) => { c.beginPath(); c.roundRect(-110, -10, 220, 170, 10); }, "#f4efe6", { rim: "rgba(255,255,255,.9)", rw: 4, sw: 10 });
    g.fillStyle = "#6ec0ff"; g.fillRect(-60, 40, 50, 50); g.fillRect(16, 40, 50, 50);
    for (let j = 0; j < 4; j++) for (let i = -j; i <= j; i++) { const x = i * 56, y = -170 + j * 44; g.fillStyle = (i + j) % 2 ? "#c94a3a" : "#e05a44"; g.beginPath(); g.moveTo(x - 30, y); g.lineTo(x + 30, y); g.lineTo(x + 30, y + 46); g.quadraticCurveTo(x, y + 58, x - 30, y + 46); g.closePath(); g.fill(); }
    g.restore(); txt("=", W * .52, H * .4, 90, "#fff", { a: ra, w: 900 });
    stamp("ROOF TILES", W * .44, H * .62, (lt - d * .6) / .25, "#7a5ce0", -.05); });

  KZ.shot("bfShed", (lt, d, t) => { const k = sm(lt / d); meadow(t, lerp(-300, 300, k), -620, 1.15);
    const bx = lerp(-700, 700, clamp(lt / d, 0, 1)), by = -760 + Math.sin(t * 3) * 60;
    for (let i = 0; i < 26; i++) { const age = (lt * 6 - i * .5); if (age < 0) continue; const px = lerp(-700, 700, clamp((lt - i / 6 * .5 - .0) / d, 0, 1)) - 0, fall = age * 40;
      const cols = ["#d9432f", "#f2d36a", "#5aa8ff"]; g.globalAlpha = clamp(1 - age / 12, 0, 1); g.fillStyle = cols[i % 3]; g.beginPath(); g.ellipse(bx - (i + 1) * 46, by + 40 + fall + Math.sin(i * 1.7 + t * 3) * 10, 13, 8, i + t, 0, 7); g.fill(); }
    g.globalAlpha = 1; bfAt(bx, by, .58, .25, { t, flap: 11, seed: 6, look: .5 });
    // Mini-Infografik: Schuppen-Anzeige
    g.setTransform(1, 0, 0, 1, 0, 0); const a = sm((lt - .2) / .3); txt("SCALES LEFT", 110, H * .12, 44, "#fff", { align: "left", a, stroke: 8 });
    g.globalAlpha = a; g.fillStyle = "rgba(10,20,50,.55)"; g.beginPath(); g.roundRect(110, H * .15, 640, 64, 32); g.fill();
    const v = lerp(1, .96, clamp(lt / d, 0, 1)); g.fillStyle = "#7ef0b0"; g.beginPath(); g.roundRect(110, H * .15, 640 * v, 64, 32); g.fill(); g.globalAlpha = 1;
    txt(Math.round(v * 100) + "%", 690, H * .15 + 34, 40, "#1b1d3a", { w: 900, a });
    stamp("TOTALLY NORMAL", W * .44, H * .6, (lt - d * .6) / .25, "#2fae6a", .05); });

  KZ.shot("bfMonarch", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    txt("MONARCH TEST", W * .44, H * .09, 70, "#fff", { w: 900 }); label("2017 STUDY", W * .44, H * .155, sm((lt - .1) / .3));
    const S = [["WITH SCALES", 0, W * .23], ["NO SCALES", .85, W * .65]];
    S.forEach(([nm, f, x], i) => { const a = sm((lt - .2 - i * .5) / .35); if (a <= 0) return; const fl = sm((lt - 1.2 - i * .3) / 1); const y = H * .38 - fl * 120 + Math.sin(t * 3 + i) * 24 * fl;
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; bfAt(x, y, .48 * easeBack(a), Math.sin(t + i) * .08, { t: t + i, pal: "monarch", fade: f, flap: fl > 0 ? 9 : 0, open: 1, seed: i, look: 0 }); g.globalAlpha = 1;
      txt(nm, x, H * .53, 44, i ? "#c9cdf5" : "#ffd84d", { w: 900, a }); check(x, H * .6, .8, (lt - d * .55 - i * .2) / .25); });
    stamp("STILL FLIES", W * .44, H * .22, (lt - d * .7) / .25, "#2fae6a", -.05); });

  KZ.shot("bfQuote", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .33); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -300, 780, 600, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -310, 780, 600, 34); g.fill();
    g.fillStyle = "#7a3cc8"; g.beginPath(); g.roundRect(-390, -310, 780, 120, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 38px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("THE LEPIDOPTERISTS'", 0, -272); g.fillText("SOCIETY", 0, -226);
    g.fillStyle = "#e5484d"; g.font = '900 130px "Montserrat"'; g.fillText("“", -320, -140);
    const lines = ["“It is most", "definitely", "NOT true.”"]; g.font = '900 66px "Montserrat"'; g.fillStyle = "#1b1d3a";
    lines.forEach((l, i) => { const a = sm((lt - .4 - i * .35) / .3); g.globalAlpha = a; g.fillStyle = i === 2 ? "#e5484d" : "#1b1d3a"; g.fillText(l, 0, -100 + i * 88); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 32px "Montserrat"'; g.fillText("on: rubbed scales = can't fly", 0, 220);
    g.restore(); g.setTransform(1, 0, 0, 1, 0, 0); bfAt(W * .74, H * .14, .26, .4 + Math.sin(t * 2) * .1, { t, flap: 8, seed: 6, look: -.3 }); });

  KZ.shot("bfTattered", (lt, d, t) => { const k = sm(lt / d); meadow(t, lerp(-120, 80, k), -520, lerp(1.25, 1.35, k));
    const ang = lt * 1.3; const x = -20 + Math.cos(ang) * 140, y = -680 + Math.sin(ang * 1.4) * 100;
    bfAt(x, y, .55, Math.sin(ang) * .2, { t, flap: 7, tatter: 1, fade: .45, seed: 3, look: .3 });
    label("OLD & TATTERED", W * .44, H * .1, sm((lt - .2) / .3)); stamp("STILL FLYING", W * .44, H * .6, (lt - d * .6) / .25, "#2fae6a", -.05); });

  KZ.shot("bfColors", (lt, d, t) => { const k = sm(lt / d);
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1d5a52"); bg.addColorStop(1, "#0d2a30"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(lerp(150, 210, k), lerp(-170, -150, k), lerp(2.6, 3.1, k)); bfAt(0, 0, 1, 0, { t, open: 1, seed: 7, noEyes: true });
    g.setTransform(1, 0, 0, 1, 0, 0); const f = sm((lt - .2) / (d * .6)); g.save(); g.globalCompositeOperation = "lighter"; glow(W * .5, H * .36, 420 * f, `rgba(120,180,255,${.3 * f})`); g.restore();
    for (let i = 0; i < 5; i++) sparkle(W * (.3 + (i * .13) % .45), H * (.2 + (i * .07) % .3), 22, sm((lt - .3 - i * .15) / .3) * (.6 + .4 * Math.sin(t * 5 + i)));
    label("COLOR = SCALES", W * .44, H * .1, sm((lt - .2) / .3)); });

  KZ.shot("bfBird", (lt, d, t) => { const k = sm(lt / d); meadow(t, lerp(-80, -40, k), -260, lerp(1.5, 1.6, k));
    const flash = sm((lt - d * .3) / .2), sc = sm((lt - d * .38) / .3);
    flower(120, -160, .7, t, "#b48cff");
    if (flash > 0) { g.save(); g.globalCompositeOperation = "lighter"; glow(120, -330, 260 * flash, `rgba(120,180,255,${.35 * flash})`); g.restore(); }
    bfAt(120, -330, .42, 0, { t, open: lerp(.25, 1, flash), seed: 8, look: -.6 });
    g.save(); g.translate(lerp(-640, -230, sm(lt / (d * .35))), -150); g.scale(.9, .9); robin(g, { t, scare: sc }); g.restore();
    const m = sm((lt - d * .5) / .5); bfAt(lerp(420, 260, m), lerp(-760, -580, m), .3, -.3, { t: t + 2, flap: 10, seed: 2, look: -.5 }); if (m > .6) heart(g, 170, -700 + Math.sin(t * 4) * 8, 2.6, "#ff4d6d");
    stamp("BACK OFF!", W * .44, H * .14, (lt - d * .42) / .25, "#e5484d", -.07); label("MATE", W * .7, H * .2, sm((lt - d * .7) / .25)); });

  KZ.shot("bfSnap", (lt, d, t) => { const k = sm(lt / d);
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#3a2a6a"); bg.addColorStop(1, "#161236"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(lerp(120, 170, k), lerp(-170, -180, k), lerp(1.5, 1.8, k));
    const p = sm((lt - .1) / .5), cr = sm((lt - d * .45) / .25);
    bfAt(-60, 40, 1, 0, { t, open: 1, seed: 1, mood: cr > 0 ? "scared" : undefined, look: .4, crack: cr });
    const tx = -60 + 260, ty = 40 - 200;
    if (cr > 0) { g.save(); g.globalCompositeOperation = "lighter"; glow(tx, ty, 200, `rgba(255,80,80,${.45 * cr})`); g.restore(); }
    finger(tx + 40, ty - lerp(110, 26, p), .5, 2.0); finger(tx + 40, ty + lerp(110, 26, p), .5, -2.0);
    label("WING TIPS", W * .3, H * .12, sm((lt - .2) / .3)); stamp("SNAP!", W * .45, H * .6, (lt - d * .5) / .25, "#e5484d", -.08); });

  KZ.shot("bfNoGrab", (lt, d, t) => { const k = sm(lt / d); meadow(t, lerp(-40, 10, k), -400, lerp(1.3, 1.38, k));
    flower(220, -160, .75, t, "#ff8fc0"); bfAt(220, -330, .36, 0, { t, open: .7 + Math.sin(t * 1.5) * .25, seed: 3, look: -.5, mood: lt > d * .3 ? "scared" : undefined });
    const r = at(rudi, -230, 0, 1, { t, arm: lerp(.2, .75, sm(lt / (d * .4))), mouth: lt > d * .5 ? "o" : "grin", look: .4 });
    cross(W * .62, H * .3, 1.2, (lt - d * .45) / .25); stamp("HANDS OFF", W * .44, H * .12, (lt - d * .55) / .25, "#e5484d", -.08); });

  KZ.shot("bfFinger", (lt, d, t) => { const k = sm(lt / d); const [wx, wy, ww, wh] = roomDay(t, lerp(-60, 120, k), -500, lerp(1.0, 1.06, k));
    const w = sm((lt - .3) / (d * .45)); const rx = lerp(-420, -60, w);
    const r = at(rudi, rx, 0, 1, { t, walk: w > 0 && w < 1, slow: true, arm: .55, mouth: "smile", look: .6 });
    const hx = rx + r.hx, hy = r.hy;
    const fl = sm((lt - d * .72) / (d * .28));
    const bx = lerp(hx + 10, wx + ww * .6, fl), by = lerp(hy - 70, wy + wh * .35, fl) - Math.sin(fl * Math.PI) * 120;
    bfAt(bx, by, .34, fl > 0 ? .3 : 0, { t, flap: fl > 0 ? 10 : 0, open: .8 + Math.sin(t * 1.5) * .15, seed: 4, look: .5 });
    label("LET IT CLIMB ON", W * .44, H * .1, sm((lt - .2) / .3) * (1 - sm((lt - d * .65) / .2)));
    stamp("FREE!", W * .5, H * .14, (lt - d * .8) / .2, "#2fae6a", -.06); });
})();
