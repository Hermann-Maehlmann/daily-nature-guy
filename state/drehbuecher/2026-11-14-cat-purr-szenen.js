// Szenendatei "A Purring Cat Isn't Always Happy" (rote Tigerkatze, Mix-Stil, Hermann 12.11.2026).
// Quellen: Live Science 2023 (Mikel Delgado: "Ninety percent of the time, purring is positive"; Schnurren beim Tierarzt, Stress),
// Scientific American (Schnurren 25-150 Hz, Frequenzen fördern Knochenheilung), BBC Future (Weitzman: Knochen 25-50 Hz),
// McComb et al., Univ. of Sussex, Current Biology 2009 ("more urgent and less pleasant", Schrei-Anteil ~380 Hz), VetAgro Sup (Geburt), BBC Bitesize/Cats Protection (Körpersprache).
// Helfer txt/stamp/navy/rudi/at aus dog-colors übernommen (Rudi bleibt gleich, neu: Sitzpose + armOnly). Katze neu gezeichnet: Front- und Seitenkopf, Schlitzpupille, M-Zeichnung, Streifen.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86" };
  const K = { fur: "#f0953a", furD: "#c4601c", furL: "#ffcf96", white: "#fff3e2", nose: "#ff8a9a", earIn: "#ffaab4", iris: "#c6e04a", mouth: "#6a2a2a",
    wall: "#4a3a8a", wallD: "#261e56", floor: "#5a3424", sofa: "#2b9c8f", sofaD: "#1f7a70", lamp: "#ffd68a" };
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

  // ================= Shots =================

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
      kshape(c, ell(0, -164, 150 * breathe, 66 * breathe, -.03), K.fur, { rim: "rgba(255,228,180,.85)", shadow: "rgba(120,40,10,.3)", rw: 7, sw: 20 });
      kshape(c, ell(10, -114, 112, 20, 0), K.furL, { rw: 2, sw: 4 }); stripes(-90, 80, -226, -180);
      kshape(c, ell(116, -150, 48, 60, 0), K.white, { rim: "rgba(255,255,255,.9)", rw: 4, sw: 8 });
      leg([[-84, -118], [-116, -66], [-98, -12]], K.fur, 36); leg([[96, -136], [104, -12]], K.fur, 34);
      if (o.bandage) { c.fillStyle = "#fff"; c.fillRect(88, -70, 34, 34); c.fillStyle = "#e5484d"; c.fillRect(100, -64, 10, 22); c.fillRect(94, -58, 22, 10); }
      kshape(c, ell(140, -198, 52, 62, -.4), K.fur, { rw: 5, sw: 10 });
      c.save(); c.translate(178, -246); catHead(c, o); c.restore(); }
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
  // Schnurr-Wellen (aktuelle Koordinaten): Bögen links und rechts, wandern nach außen
  function purr(x, y, s, t, a, col) { if (a <= 0) return; g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 3; i++) { const q = (t * 1.1 + i / 3) % 1, r = lerp(60, 230, q) * s; g.strokeStyle = col || `rgba(255,214,140,${(1 - q) * .8 * a})`; if (col) g.globalAlpha = (1 - q) * a; g.lineWidth = 12 * s;
      for (const dir of [0, Math.PI]) { g.beginPath(); g.arc(x, y, r, dir - .55, dir + .55); g.stroke(); } }
    g.restore(); }

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
  function sofa(t) { // Sitzfläche oben bei y=-300, Breite -520..520
    kshape(g, (c) => { c.beginPath(); c.roundRect(-500, -620, 1000, 360, 70); }, K.sofaD, { rim: "rgba(160,255,240,.35)", rw: 6, sw: 16 });
    for (const x of [-250, 0, 250]) kshape(g, (c) => { c.beginPath(); c.roundRect(x - 118, -590, 236, 280, 50); }, K.sofa, { rim: "rgba(190,255,245,.5)", rw: 5, sw: 12 });
    kshape(g, (c) => { c.beginPath(); c.roundRect(-520, -330, 1040, 170, 46); }, K.sofa, { rim: "rgba(190,255,245,.55)", shadow: "rgba(0,40,40,.3)", rw: 6, sw: 16 });
    for (const s of [-1, 1]) kshape(g, (c) => { c.beginPath(); c.roundRect(s > 0 ? 440 : -580, -470, 140, 330, 60); }, K.sofaD, { rim: "rgba(160,255,240,.4)", rw: 5, sw: 12 });
    g.fillStyle = "#2a2140"; for (const x of [-480, 460]) { g.beginPath(); g.roundRect(x, -160, 24, 160, 8); g.fill(); } }
  function kitchen(t, cx, cy, z) { g.setTransform(1, 0, 0, 1, 0, 0);
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2f6c86"); bg.addColorStop(1, "#173a52"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(cx, cy, z);
    g.strokeStyle = "rgba(255,255,255,.12)"; g.lineWidth = 4; for (let x = -2000; x < 2000; x += 110) { g.beginPath(); g.moveTo(x, -1500); g.lineTo(x, -380); g.stroke(); } for (let y = -1500; y < -380; y += 110) { g.beginPath(); g.moveTo(-2000, y); g.lineTo(2000, y); g.stroke(); }
    kshape(g, (c) => { c.beginPath(); c.roundRect(-1600, -380, 3200, 380, 10); }, "#e9dfcf", { rw: 5, sw: 12 }); kshape(g, (c) => { c.beginPath(); c.roundRect(-1640, -420, 3280, 50, 12); }, "#f2b233", { rw: 4, sw: 8 });
    g.fillStyle = "rgba(60,40,30,.35)"; for (let x = -1500; x < 1600; x += 360) { g.fillRect(x, -340, 6, 300); g.beginPath(); g.roundRect(x + 140, -220, 70, 16, 8); g.fill(); }
    // Uhr
    kshape(g, ell(420, -1060, 110, 110, 0), "#fff6e6", { rw: 5, sw: 10 }); g.strokeStyle = "#1b1d3a"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(420, -1060); g.lineTo(420, -1130); g.moveTo(420, -1060); g.lineTo(470, -1040); g.stroke();
    const fg = g.createLinearGradient(0, 0, 0, 900); fg.addColorStop(0, "#c98a5a"); fg.addColorStop(1, "#7a4a2a"); g.fillStyle = fg; g.fillRect(-3000, 0, 6000, 3000);
    g.strokeStyle = "rgba(0,0,0,.15)"; g.lineWidth = 4; for (let x = -3000; x < 3000; x += 160) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 3000); g.stroke(); } }
  function bowl(x, y, s, full) { g.save(); g.translate(x, y); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.moveTo(-90, -50); c.lineTo(90, -50); c.lineTo(70, 0); c.lineTo(-70, 0); c.closePath(); }, "#e5484d", { rim: "rgba(255,200,200,.7)", rw: 4, sw: 8 });
    g.fillStyle = "#7a1f2a"; g.beginPath(); g.ellipse(0, -50, 90, 16, 0, 0, 7); g.fill(); if (full) { g.fillStyle = "#a0622f"; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(-60 + i * 17, -54 - (i % 2) * 6, 10, 0, 7); g.fill(); } }
    g.fillStyle = "#fff"; g.font = '900 34px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("CAT", 0, -22); g.restore(); }

  // ================= Shots =================
  const SEAT = -300, RX = -200; // Rudi sitzt auf dem Sofa, Katze auf dem Schoß
  function lapScene(lt, d, t, o) { o = o || {};
    at(rudi, RX, SEAT + 130, 1, { t, sit: 298, mouth: o.mouth || "smile", look: .3 });
    catAt(RX + 150, SEAT - 6, .62, { t, mode: "loaf", blink: o.blink ?? .55, pupil: o.pupil ?? .2, look: -.2 });
    const k = (Math.sin(t * 2.2) + 1) / 2; at(rudi, RX, SEAT + 130, 1, { t, armOnly: true, hand: [lerp(90, 210, k), -232 - Math.sin(k * Math.PI) * 18] });
    purr(RX + 150 + 95, SEAT - 90, .8, t, o.purr ?? 1); }
  function hookShot(lt, d, t, loop) { const k = loop ? 0 : sm(lt / d);
    room(t, lerp(-60, -40, k), -520, 1.6); sofa(t);
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(20,10,50,.35)"; g.fillRect(0, 0, W, H);
    const z = loop ? 1.22 : lerp(1.22, 1.34, k), cx = W * .46, cy = H * .47;
    const tense = loop ? 0 : sm((lt - d * .5) / (d * .35));
    purr(cx, cy + 190 * z, 1.4, t, 1 - tense * .5);
    faceAt(cx, cy, z, { t, blink: lerp(.5, 0, tense), pupil: lerp(.15, .85, tense), flat: tense * .55, whisk: tense * .6 });
    // Rudis Hand streichelt den Kopf
    const hk = (Math.sin(t * 2.2) + 1) / 2, hx = cx + lerp(-150, 60, hk), hy = cy - 230 * z + Math.sin(hk * Math.PI) * 10;
    if (tense < .6) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1 - tense / .6; g.strokeStyle = C.coat; g.lineWidth = 64; g.lineCap = "round"; g.beginPath(); g.moveTo(-60, cy - 520); g.quadraticCurveTo(hx - 200, hy - 160, hx - 40, hy - 30); g.stroke();
      kshape(g, (c) => { c.beginPath(); c.ellipse(hx - 10, hy, 78, 54, .15, 0, 7); for (let i = 0; i < 4; i++) { const fx = hx + 30 + i * 6, fy = hy - 30 + i * 22; c.moveTo(fx + 44, fy); c.ellipse(fx, fy, 44, 17, .35, 0, 7); } }, C.skin, { rim: "rgba(255,240,225,.8)", shadow: "rgba(150,60,40,.22)", rw: 5, sw: 10 }); g.restore(); }
    if (!loop) { for (let i = 0; i < 2; i++) { const a = sm((lt - d * .62 - i * .15) / .25); if (a > 0) qmark(W * (.18 + i * .55), H * (.3 - i * .03), 1, a); } } }
  KZ.shot("cHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("cLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .6) { room(t, lerp(-80, -50, k), -440, lerp(1.4, 1.5, k)); sofa(t); lapScene(lt, d, t, { mouth: "grin" }); }
    else hookShot(0, d, t, true); });

  KZ.shot("cLap", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(-70, -40, k), -430, lerp(1.45, 1.6, k)); sofa(t);
    lapScene(lt, d, t, { mouth: lt > d * .55 ? "grin" : "smile" });
    if (lt > d * .55) { g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 5; i++) { const q = (lt * .5 + i / 5) % 1; g.globalAlpha = (1 - q) * sm((lt - d * .55) / .3); heart(g, W * (.32 + i * .07), H * (.36 - q * .12), 3.2, "#ff6b8a"); } g.globalAlpha = 1;
      stamp("IT LOVES ME", W * .46, H * .2, (lt - d * .58) / .3, "#e5487a", -.05); } });

  KZ.shot("cMeter", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    txt("WHY CATS PURR", W * .44, H * .1, 64, "#fff", { w: 900, a: sm(lt / .3) });
    const cx = W * .44, cy = H * .36, R = 230, f = .9 * sm((lt - .2) / (d * .5));
    g.lineCap = "butt"; g.lineWidth = 80; g.strokeStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
    g.strokeStyle = "#3ccf7a"; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + f * 6.283); g.stroke();
    if (f > .89) { g.strokeStyle = "#ff8a3c"; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2 + .9 * 6.283, -Math.PI / 2 + 6.283 * sm((lt - d * .6) / .3) * .1 + .9 * 6.283); g.stroke(); }
    g.save(); g.translate(cx, cy - 10); g.scale(.32, .32); catFace(g, { t, blink: .5 }); g.restore();
    txt(Math.round(f * 100) + "%", cx, cy + R + 110, 90, "#3ccf7a", { w: 900, stroke: 10 });
    txt("HAPPY & RELAXED", cx, cy + R + 190, 48, "#fff", { a: sm((lt - .5) / .3) });
    if (lt > d * .65) stamp("YOU'RE RIGHT", W * .44, H * .2, (lt - d * .65) / .3, "#2fae6a", -.05); });

  KZ.shot("cVet", (lt, d, t) => { const k = sm(lt / d); g.setTransform(1, 0, 0, 1, 0, 0);
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2b7f9c"); bg.addColorStop(1, "#123a55"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(lerp(40, 80, k), -230, lerp(1.6, 1.8, k));
    g.strokeStyle = "rgba(255,255,255,.1)"; g.lineWidth = 4; for (let x = -1600; x < 1600; x += 140) { g.beginPath(); g.moveTo(x, -1600); g.lineTo(x, 0); g.stroke(); }
    kshape(g, (c) => { c.beginPath(); c.roundRect(-640, -1020, 230, 230, 30); }, "#ffffff", { rw: 4, sw: 10 }); g.fillStyle = "#2fae6a"; g.fillRect(-555, -990, 60, 170); g.fillRect(-610, -935, 170, 60);
    g.fillStyle = "#0e2a3c"; g.fillRect(-3000, 160, 6000, 3000);
    g.fillStyle = "#8a9ab0"; for (const x of [-380, 360]) g.fillRect(x, 20, 26, 150);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-460, -10, 920, 44, 16); }, "#c9d6e6", { rim: "rgba(255,255,255,.9)", shadow: "rgba(20,40,70,.35)", rw: 5, sw: 10 });
    const scared = sm((lt - .2) / .6);
    catAt(-20, -10, .95, { t, mode: "stand", crouch: scared, tailLow: true, flat: scared, pupil: .3 + scared * .65, whisk: scared * .7, look: .2 });
    purr(-20 + 170 * .95, -240, .7, t, 1);
    // Stethoskop kommt von rechts oben
    const sp = sm((lt - .3) / .7); g.strokeStyle = "#2a2a40"; g.lineWidth = 12; g.beginPath(); g.moveTo(-700, -900); g.quadraticCurveTo(-200, -700, lerp(-500, -40, sp), lerp(-600, -150, sp)); g.stroke();
    kshape(g, ell(lerp(-500, -40, sp), lerp(-600, -150, sp), 34, 34, 0), "#c9d6e6", { rim: "#fff", rw: 4, sw: 8 });
    if (lt > d * .55) stamp("SCARED", W * .32, H * .2, (lt - d * .55) / .3, "#e5484d", -.06); });

  function bedScene(t, cx, cy, z, o) { g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#3a2a6e"); bg.addColorStop(1, "#140e30"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .5, H * .42, 600, o.glow || "rgba(255,180,120,.18)"); g.restore();
    cam(cx, cy, z); g.fillStyle = "#24184a"; g.fillRect(-3000, 40, 6000, 3000);
    kshape(g, ell(0, 20, 300, 80, 0), "#b8733a", { rim: "rgba(255,210,160,.6)", shadow: "rgba(40,20,10,.35)", rw: 6, sw: 16 });
    kshape(g, ell(0, -6, 250, 50, 0), "#e5484d", { rim: "rgba(255,200,200,.6)", rw: 5, sw: 10 });
    g.strokeStyle = "rgba(255,255,255,.25)"; g.lineWidth = 6; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 70, -40); g.lineTo(i * 70 + 20, 30); g.stroke(); } }
  function kitten(x, y, s, col, t, i) { g.save(); g.translate(x, y); g.scale(s, s); kshape(g, ell(0, -26, 46, 26, 0), col, { rw: 3, sw: 6 });
    kshape(g, ell(40, -40, 26, 22, 0), col, { rw: 3, sw: 5 }); g.fillStyle = col; for (const ex of [28, 50]) { g.beginPath(); g.moveTo(ex - 10, -54); g.lineTo(ex - 2, -74); g.lineTo(ex + 6, -54); g.fill(); }
    g.strokeStyle = "rgba(40,20,10,.7)"; g.lineWidth = 3; g.beginPath(); g.arc(46, -42, 5, .2, 2.9); g.stroke(); g.restore(); }
  KZ.shot("cHurt", (lt, d, t) => { const k = sm(lt / d); bedScene(t, lerp(10, 40, k), -110, lerp(1.9, 2.1, k), {});
    catAt(-20, -10, 1, { t, mode: "curl", bandage: true, blink: 1 }); purr(70, -110, .65, t, 1);
    const kb = sm((lt - d * .5) / .4); if (kb > 0) { g.globalAlpha = kb; kitten(-120, 20, .9, "#f2b07a", t, 0); kitten(-10, 34, .9, "#3a3040", t, 1); kitten(100, 24, .9, "#f0953a", t, 2); g.globalAlpha = 1; }
    stamp("HURT", W * .3, H * .2, (lt - .3) / .3, "#e5484d", -.08);
    if (kb > 0) label("GIVING BIRTH", W * .58, H * .27, kb); });

  KZ.shot("cSoothe", (lt, d, t) => { const k = sm(lt / d); bedScene(t, lerp(60, 80, k), -90, lerp(2.4, 2.8, k), { glow: "rgba(120,220,255,.22)" });
    catAt(-20, -10, 1, { t, mode: "curl", blink: 1 });
    g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 4; i++) { const q = (t * .45 + i / 4) % 1; g.strokeStyle = `rgba(120,230,255,${(1 - q) * .3})`; g.lineWidth = 6; g.beginPath(); g.ellipse(40, -80, lerp(200, 380, q), lerp(110, 230, q), 0, 0, 7); g.stroke(); } g.restore();
    purr(70, -110, .6, t, .9, "rgba(140,240,255,1)");
    stamp("CALM DOWN", W * .44, H * .19, (lt - d * .4) / .3, "#2b9c8f", .05); });

  KZ.shot("cHertz", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    g.save(); g.translate(W * .44, H * .18); g.scale(.3, .3); catFace(g, { t, blink: .5 }); g.restore(); purr(W * .44, H * .18 + 60, .45, t, 1);
    // Oszilloskop
    const ox = 110, ow = 720, oy = H * .38; g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(ox - 20, oy - 140, ow + 40, 280, 30); g.fill();
    g.strokeStyle = "#ffd84d"; g.lineWidth = 8; g.lineJoin = "round"; g.save(); g.globalCompositeOperation = "lighter"; g.beginPath(); const vis = sm(lt / .6);
    for (let x = 0; x <= ow * vis; x += 4) { const y = Math.sin(x * .05 - t * 8) * 90 * (.8 + .2 * Math.sin(x * .01)); x ? g.lineTo(ox + x, oy + y) : g.moveTo(ox, oy + y); } g.stroke(); g.restore();
    // Skala 0..200 Hz
    const sx = 110, sw = 720, sy = H * .56, f2x = (hz) => sx + sw * hz / 200, a = sm((lt - .5) / .4);
    g.globalAlpha = a; g.fillStyle = "rgba(255,255,255,.15)"; g.beginPath(); g.roundRect(sx, sy - 24, sw, 48, 24); g.fill();
    g.fillStyle = "#ffb13b"; const e = lerp(25, 150, sm((lt - .7) / .6)); g.beginPath(); g.roundRect(f2x(25), sy - 24, f2x(e) - f2x(25), 48, 24); g.fill(); g.globalAlpha = 1;
    [0, 25, 150, 200].forEach((hz) => txt(String(hz), f2x(hz), sy + 70, 40, hz === 25 || hz === 150 ? "#ffd84d" : "#9aa3d8", { a }));
    txt("HERTZ", W * .44, sy + 140, 48, "#fff", { a });
    if (lt > d * .55) stamp("25-150 HZ", W * .44, H * .475, (lt - d * .55) / .3, "#ff8a2b", .04); });

  function bone(c, crack) { const p = (c) => { c.beginPath(); c.roundRect(-230, -30, 460, 60, 12); for (const [x, y] of [[-232, -40], [-232, 40], [232, -40], [232, 40]]) { c.moveTo(x + 46, y); c.arc(x, y, 46, 0, 7); } };
    kshape(c, p, "#f5ecd8", { rim: "rgba(255,255,255,.9)", shadow: "rgba(90,70,40,.3)", rw: 6, sw: 14 });
    if (crack > 0) { c.strokeStyle = `rgba(140,60,40,${crack})`; c.lineWidth = 12; c.lineJoin = "round"; c.beginPath(); c.moveTo(-14, -30); c.lineTo(12, -10); c.lineTo(-12, 8); c.lineTo(14, 30); c.stroke(); } }
  KZ.shot("cBone", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    txt("IN MEDICINE", W * .44, H * .1, 60, "#fff", { w: 900, a: sm(lt / .3) });
    const cx = W * .44, cy = H * .33, heal = sm((lt - .4) / (d * .6)), sh = Math.sin(t * 40) * 3;
    g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 3; i++) { const q = (t * .9 + i / 3) % 1; g.strokeStyle = `rgba(120,255,200,${(1 - q) * .6})`; g.lineWidth = 10; g.beginPath(); g.ellipse(cx, cy, lerp(320, 480, q), lerp(90, 200, q), 0, 0, 7); g.stroke(); } g.restore();
    g.save(); g.translate(cx + sh, cy); g.scale(1.45, 1.45); g.rotate(-.12); bone(g, 1 - heal); g.restore();
    if (heal > .95) for (let i = 0; i < 3; i++) sparkle(cx - 60 + i * 60, cy - 80 + (i % 2) * 40, 22, sm((lt - d * .7) / .3));
    txt("VIBRATION THERAPY", cx, H * .5, 50, "#7ef0b0", { a: sm((lt - .3) / .3) }); txt("helps bones heal", cx, H * .555, 44, "#fff", { a: sm((lt - .6) / .3), w: 700 });
    if (lt > d * .6) stamp("COINCIDENCE?", W * .44, H * .2, (lt - d * .6) / .3, "#7b5cff", -.05); });

  KZ.shot("cKitchen", (lt, d, t) => { const k = sm(lt / d); kitchen(t, lerp(0, 30, k), -300, lerp(1.25, 1.4, k));
    at(rudi, -230, 0, 1, { t, mouth: lt > d * .5 ? "o" : "smile", look: .6 });
    bowl(320, 0, 1, false);
    catAt(110, 0, .95, { t, mode: "sit", tilt: -.25, pupil: .75, look: .6 }, false);
    purr(110 + 72 * .95, -300 * .95, .6, t, 1);
    if (lt > d * .45) stamp("SNEAKY", W * .52, H * .2, (lt - d * .45) / .3, "#f08a1e", .06); });

  KZ.shot("cCry", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const lane = (y, name, cry, a) => { if (a <= 0) return; g.globalAlpha = a; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(90, y - 120, 760, 240, 26); g.fill();
      txt(name, 120, y - 84, 40, "#cfd6ff", { align: "left", a });
      g.globalAlpha = a; g.save(); g.globalCompositeOperation = "lighter"; g.lineWidth = 7; g.lineJoin = "round";
      g.strokeStyle = "#ffd84d"; g.beginPath(); for (let x = 0; x <= 700; x += 4) { const yy = Math.sin(x * .045 - t * 7) * 60; x ? g.lineTo(120 + x, y + 20 + yy) : g.moveTo(120, y + 20 + yy); } g.stroke();
      if (cry > 0) { g.strokeStyle = "#ff5a8a"; g.lineWidth = 5; g.beginPath(); for (let x = 0; x <= 700 * cry; x += 3) { const yy = Math.sin(x * .045 - t * 7) * 60 + Math.sin(x * .6 - t * 30) * 22; x ? g.lineTo(120 + x, y + 20 + yy) : g.moveTo(120, y + 20 + yy); } g.stroke(); }
      g.restore(); g.globalAlpha = 1; };
    lane(H * .2, "NORMAL PURR", 0, sm(lt / .3));
    lane(H * .42, "\"FEED ME\" PURR", sm((lt - .6) / .6), sm((lt - .3) / .3));
    if (lt > d * .45) label("HIDDEN CRY ~380 HZ", W * .44, H * .57, sm((lt - d * .45) / .3));
    if (lt > d * .6) stamp("LIKE A BABY", W * .5, H * .32, (lt - d * .6) / .3, "#e5487a", .06); });

  KZ.shot("cQuote", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .33); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -300, 780, 600, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -310, 780, 600, 34); g.fill();
    g.fillStyle = "#2b9c8f"; g.beginPath(); g.roundRect(-390, -310, 780, 120, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 40px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("UNIVERSITY", 0, -272); g.fillText("OF SUSSEX", 0, -226);
    g.fillStyle = "#e5a52a"; g.font = '900 130px "Montserrat"'; g.fillText("“", -320, -140);
    const lines = ["Listeners judged", "food purrs “more", "urgent and less", "pleasant.”"]; g.font = '900 54px "Montserrat"';
    lines.forEach((l, i) => { const a = sm((lt - .4 - i * .3) / .3); g.globalAlpha = a; g.fillStyle = i >= 2 ? "#c9561e" : "#1b1d3a"; g.fillText(l, 0, -110 + i * 76); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 32px "Montserrat"'; g.fillText("McComb et al. · Current Biology 2009", 0, 236);
    g.restore(); g.setTransform(1, 0, 0, 1, 0, 0);
    g.save(); const pe = sm((lt - .8) / .5); g.translate(W * .7, H * .62 - pe * 30); g.scale(.28, .28); catFace(g, { t, pupil: .7, look: -.3 }); g.restore(); });

  KZ.shot("cAsk", (lt, d, t) => { const k = sm(lt / d); room(t, lerp(-170, -140, k), -300, lerp(1.3, 1.4, k)); sofa(t);
    at(rudi, -340, 120, 1, { t, arm: 1.5 + sm(lt / .4) * .5, mouth: "hmm", look: .8 });
    catAt(60, 120, .9, { t, mode: "sit", tilt: -.2, look: -.4, pupil: .3 }, true);
    for (let i = 0; i < 2; i++) qmark(W * (.6 + i * .14), H * (.2 - i * .03) + Math.sin(t * 3 + i) * 8, 1, sm((lt - .2 - i * .2) / .3)); });

  function cueList(items, ok, lt, x0, y0) { items.forEach((s, i) => { const a = sm((lt - .25 - i * .45) / .3); if (a <= 0) return; const y = y0 + i * 100;
    (ok ? check : cross)(x0, y, .55, a); txt(s, x0 + 70, y, 52, "#fff", { align: "left", a, stroke: 10 }); }); }
  KZ.shot("cHappy", (lt, d, t) => { navy(t, true); const k = sm(lt / d);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter"; glow(W * .44, H * .28, 520, "rgba(120,255,170,.18)"); g.restore();
    const blinkCyc = Math.max(0, Math.sin((lt - .3) * 2.2)); purr(W * .44, H * .28 + 200 * .82, 1, t, 1);
    faceAt(W * .44, H * .28, lerp(.8, .86, k), { t, blink: lt > .3 ? .35 + .6 * blinkCyc : .35, pupil: .15 });
    cueList(["SOFT EYES", "RELAXED EARS", "SLOW BLINK"], true, lt, W * .2, H * .5);
    if (lt > d * .7) stamp("HAPPY PURR", W * .62, H * .1, (lt - d * .7) / .3, "#2fae6a", .05); });
  KZ.shot("cWarn", (lt, d, t) => { g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#5a1f3a"); bg.addColorStop(1, "#1a0c22"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .44, H * .28, 520, `rgba(255,80,80,${.16 + .06 * Math.sin(t * 5)})`); g.restore();
    const k = sm(lt / d), tense = sm(lt / .5); purr(W * .44, H * .28 + 180, .9, t, .7);
    faceAt(W * .44, H * .28, lerp(.8, .86, k), { t, flat: tense, pupil: lerp(.3, .95, tense), whisk: tense * .8, look: .4 });
    cueList(["FLAT EARS", "HUGE PUPILS", "HIDING, NOT EATING"], false, lt, W * .14, H * .5);
    if (lt > d * .72) stamp("CALL THE VET", W * .5, H * .1, (lt - d * .72) / .3, "#e5484d", -.05); });
})();
