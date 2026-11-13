// Szenendatei "Carrots Are Candy For Rabbits" (Hauskaninchen / Wildkaninchen, Oryctolagus cuniculus). Mix-Stil (Hermann 12.11.2026).
// Quellen: RSPCA "What do rabbits eat?" ("Despite popular belief, carrots aren't the main source of food for rabbits – nor should they be.";
// 85 % Heu und Gras, 10 % Blattgrün, 5 % Pellets; Karotten "high in sugar and often contribute to weight gain and digestive problems";
// stattdessen Karottengrün; Heubündel "as big as they are" pro Tag; Zähne wachsen ständig nach, Heu/Gras nutzt sie ab),
// RSPCA Australia Knowledgebase (Wildkaninchen grasen bis zu 6-8 Stunden am Tag), PDSA, gov.scot Rabbit Welfare Guidance.
// Helfer txt/stamp/navy/rudi/at/sparkle/cross/check/lawn aus wasp-swat übernommen (Rudi bleibt gleich). Kaninchen neu gezeichnet:
// eiförmiger Körper, kräftige Hinterkeule mit langem Hinterfuß, kurze Vorderpfoten, runder Kopf mit Schnauzenpolster, rosa Y-Nase,
// zwei lange Löffel mit rosa Innenseite, großes seitliches Auge, Schnurrhaare, weißer Puschelschwanz, sichtbare Nagezähne.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#3f58b0", "#5a6cc4", "#45509a", "#22285e"], hills: [["#2a6a5a", "#327a66"], ["#22584c", "#2a6858"], ["#1a463e", "#22564a"]], corals: false, rays: false, dust: "255,236,190" };
  const DUSK = { sky: ["#3a2a78", "#7a4a9a", "#e0708a", "#ffb37a"], hills: [["#3a5a6a", "#46687a"], ["#2a4a52", "#345a62"], ["#1e3a40", "#26484e"]], corals: false, rays: false, dust: "255,220,180" };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86",
    fur: "#d9a06a", furL: "rgba(255,236,205,.85)", furD: "#b97f4c", belly: "#f6e2c6", earIn: "#ff9fb4", nose: "#ff7a9a",
    wfur: "#9c8466", wfurL: "rgba(240,225,200,.7)", wfurD: "#7c664c", wbelly: "#e8dcc6",
    car: "#ff8a1e", carL: "rgba(255,220,150,.9)", carD: "#d9650a", leaf: "#48c060", leafD: "#2e8a44",
    hay: "#e8c860", hayL: "#f8e7a0", hayD: "#b8952e", lawn: "#3f9a5a", lawnT: "#5ab872", hedge: "#24704f", sugar: "#fbfbff" };
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

  // ================= Karotte: Grün bei (0,0), Spitze zeigt nach +x, Länge len =================
  function carrot(c, len, o) { o = o || {}; const t = o.t || 0, w = len * .2; c.save();
    if (!o.noLeaf) { for (let i = 0; i < 4; i++) { const a = Math.PI + (i - 1.5) * .32 + Math.sin(t * 2 + i) * .05; c.save(); c.rotate(a);
      kshape(c, (cc) => { cc.beginPath(); cc.moveTo(0, 0); cc.quadraticCurveTo(len * .3, -w * .5, len * .55, 0); cc.quadraticCurveTo(len * .3, w * .5, 0, 0); cc.closePath(); }, i % 2 ? C.leaf : C.leafD, { rim: "rgba(220,255,200,.6)", rw: 3, sw: 5 }); c.restore(); } }
    const bite = o.bite || 0, L = len * (1 - bite * .7);
    const sh = (cc) => { cc.beginPath(); cc.moveTo(0, -w * .5); cc.quadraticCurveTo(L * .5, -w * .42, L, -w * .06 * (1 + bite * 3)); cc.lineTo(L, w * .06 * (1 + bite * 3)); cc.quadraticCurveTo(L * .5, w * .42, 0, w * .5); cc.quadraticCurveTo(-w * .2, 0, 0, -w * .5); cc.closePath(); };
    kshape(c, sh, C.car, { rim: C.carL, shadow: "rgba(150,50,0,.35)", rw: 5, sw: 10 });
    c.strokeStyle = C.carD; c.lineWidth = Math.max(2, len * .012); c.lineCap = "round"; for (let i = 1; i < 6; i++) { const x = i / 6 * L * .9; c.beginPath(); c.moveTo(x, -w * .32 * (1 - x / L * .7)); c.lineTo(x + len * .03, -w * .08); c.stroke(); }
    if (bite > 0) { c.fillStyle = "#ffc27a"; c.beginPath(); c.ellipse(L, 0, w * .06, w * .2 * (1 - bite * .3), 0, 0, 7); c.fill(); }
    c.restore(); }
  function carAt(x, y, len, rot, o) { g.save(); g.translate(x, y); g.rotate(rot || 0); carrot(g, len, o); g.restore(); }
  // Zuckerwürfel
  function cube(x, y, s, a) { if (a <= 0) return; g.save(); g.translate(x, y); g.scale(s * easeBack(Math.min(a, 1)), s * easeBack(Math.min(a, 1))); g.globalAlpha = clamp(a * 2, 0, 1);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-40, -40, 80, 80, 12); }, C.sugar, { rim: "rgba(255,255,255,1)", shadow: "rgba(120,120,190,.35)", rw: 5, sw: 12 });
    g.fillStyle = "rgba(200,200,230,.6)"; for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-24 + (i * 19) % 48, -22 + (i * 29) % 44, 3.5, 0, 7); g.fill(); } g.restore(); }
  // Heuhaufen, Boden bei y=0, Breite ~ 2*rx
  function hay(c, x, y, rx, ry, t) { c.save(); c.translate(x, y);
    kshape(c, (cc) => { cc.beginPath(); cc.ellipse(0, 0, rx, ry, 0, Math.PI, 0); cc.closePath(); }, C.hay, { rim: C.hayL, shadow: "rgba(130,90,10,.35)", rw: 6, sw: 16 });
    c.lineCap = "round"; for (let i = 0; i < 70; i++) { const a = Math.PI + (i * 0.6180339 % 1) * Math.PI, r = .25 + ((i * 7) % 10) / 13, px = Math.cos(a) * rx * r, py = Math.sin(a) * ry * r;
      c.strokeStyle = i % 3 ? C.hayD : C.hayL; c.lineWidth = rx * .018 + 1; const ang = (i * 1.7) % 3.1 - 1.5 + Math.sin(t + i) * .03; c.beginPath(); c.moveTo(px - Math.cos(ang) * rx * .14, py - Math.sin(ang) * rx * .05); c.lineTo(px + Math.cos(ang) * rx * .14, py + Math.sin(ang) * rx * .05); c.stroke(); }
    for (let i = 0; i < 10; i++) { const a = Math.PI + (i + .5) / 10 * Math.PI, px = Math.cos(a) * rx, py = Math.sin(a) * ry; c.strokeStyle = C.hayD; c.lineWidth = rx * .02 + 1; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(a) * rx * .12 + Math.sin(t * 2 + i) * 3, py + Math.sin(a) * rx * .1); c.stroke(); }
    c.restore(); }
  // Grashalme-Büschel
  function tuft(c, x, y, s, t, col) { c.strokeStyle = col || "#6ccf7a"; c.lineWidth = 7 * s; c.lineCap = "round"; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .22; c.beginPath(); c.moveTo(x + (i - 3) * 6 * s, y); c.quadraticCurveTo(x + Math.cos(a) * 40 * s, y + Math.sin(a) * 50 * s, x + Math.cos(a) * 70 * s + Math.sin(t * 2 + i) * 6 * s, y + Math.sin(a) * 90 * s); c.stroke(); } }

  // ================= Kaninchen (Seitenansicht, Kopf nach rechts, Füße bei y=0, Länge ~400) =================
  // o: t, eat (kauen), carrot (Karotte im Maul, 0..1 Biss), graze (0..1 Kopf unten), hop (0..1 Sprungphase), fat (0..1), wild, look, seed, mood, teeth
  function rabbit(c, o) {
    const t = o.t || 0, fat = o.fat || 0, P = o.wild ? { f: C.wfur, l: C.wfurL, d: C.wfurD, b: C.wbelly } : { f: C.fur, l: C.furL, d: C.furD, b: C.belly };
    const br = Math.sin(t * 3) * .02, hp = o.hop ? Math.sin(o.hop * Math.PI) : 0, gz = o.graze || 0;
    c.save(); c.translate(0, -hp * 120);
    if (hp < .3) { c.save(); c.globalAlpha = .28 * (1 - hp * 3); c.fillStyle = "#0b0618"; c.beginPath(); c.ellipse(-10, 4 + hp * 120, 190 + fat * 50, 14, 0, 0, 7); c.fill(); c.restore(); }
    c.scale(1 + br + fat * .12, 1 - br + fat * .05);
    // ferner Hinterfuß + Vorderpfote
    kshape(c, ell(-50 + hp * 30, -12, 70, 14, hp * .3), P.d, { rw: 0, sw: 0 });
    kshape(c, ell(92, -12, 22, 12, 0), P.d, { rw: 0, sw: 0 });
    // Körper (Ei) + Bauch
    const bod = ell(-30, -118, 150 + fat * 40, 108 + fat * 30, -.12);
    kshape(c, bod, P.f, { rim: P.l, shadow: "rgba(90,40,10,.3)", rw: 7, sw: 22 });
    c.save(); bod(c); c.clip(); c.fillStyle = P.b; c.beginPath(); c.ellipse(30, -40, 120 + fat * 40, 60 + fat * 20, -.2, 0, 7); c.fill(); c.restore();
    if (o.wild) { c.fillStyle = "rgba(60,40,20,.18)"; for (let i = 0; i < 18; i++) { c.beginPath(); c.arc(-140 + (i * 47) % 220, -200 + (i * 31) % 90, 5, 0, 7); c.fill(); } }
    // Schwanz (Puschel)
    kshape(c, ell(-178 - fat * 30, -150, 34, 32, 0), o.wild ? "#f4f0ea" : "#fffaf2", { rim: "rgba(255,255,255,1)", shadow: "rgba(120,100,90,.3)", rw: 4, sw: 8 });
    // Hinterkeule + langer Hinterfuß
    kshape(c, ell(-90 - fat * 20, -86, 86 + fat * 15, 78 + fat * 12, -.2), P.f, { rim: P.l, shadow: "rgba(90,40,10,.28)", rw: 6, sw: 16 });
    c.strokeStyle = "rgba(90,50,20,.25)"; c.lineWidth = 5; c.beginPath(); c.arc(-90 - fat * 20, -86, 60, -1.2, .9); c.stroke();
    kshape(c, ell(-40 + hp * 40, -12, 82, 16, hp * .35), P.f, { rim: P.l, rw: 4, sw: 6 });
    // nahe Vorderpfote
    c.strokeStyle = P.f; c.lineWidth = 26; c.lineCap = "round"; c.beginPath(); c.moveTo(80, -90); c.lineTo(108 + hp * 30, -14 - hp * 10); c.stroke();
    kshape(c, ell(114 + hp * 30, -12 - hp * 10, 24, 12, 0), P.b, { rw: 3, sw: 4 });
    // Kopf
    const chew = o.eat || o.carrot != null ? Math.sin(t * 15) : 0;
    c.save(); c.translate(120, -200 + gz * 120); c.rotate(gz * .85 + Math.sin(t * 1.7) * .02);
    // ferner Löffel
    const ew = Math.sin(t * 2.3 + (o.seed || 0)) * .06, droop = o.wild ? 0 : .05;
    c.save(); c.translate(-28, -40); c.rotate(-1.95 + ew * .7 + droop); kshape(c, ell(90, 0, 96, 26, 0), P.d, { rw: 0, sw: 0 }); c.restore();
    kshape(c, ell(0, 0, 80, 70, 0), P.f, { rim: P.l, shadow: "rgba(90,40,10,.28)", rw: 6, sw: 16 });
    // Schnauze, Wangenpolster
    c.save(); c.translate(0, chew * 2);
    kshape(c, ell(60, 22, 36, 30, 0), P.b, { rim: "rgba(255,255,255,.7)", rw: 3, sw: 6 });
    // Nagezähne
    if (o.teeth !== false) { c.fillStyle = "#fffdf6"; c.beginPath(); c.roundRect(70, 44, 9, 15 + (o.longTeeth || 0) * 40, 3); c.roundRect(80, 44, 9, 15 + (o.longTeeth || 0) * 40, 3); c.fill(); }
    c.strokeStyle = "#7a3a3a"; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.moveTo(86, 30); c.lineTo(86, 42); c.moveTo(86, 42); c.quadraticCurveTo(78, 50, 70, 44); c.moveTo(86, 42); c.quadraticCurveTo(94, 50, 100, 44); c.stroke();
    // Nase (Y) wackelt
    const nz = Math.sin(t * 9) * 2; kshape(c, (cc) => { cc.beginPath(); cc.moveTo(80, 14 + nz); cc.lineTo(98, 14 + nz); cc.lineTo(89, 28 + nz); cc.closePath(); }, C.nose, { rim: "rgba(255,230,240,.8)", rw: 2, sw: 3 });
    // Schnurrhaare
    c.strokeStyle = "rgba(255,255,255,.75)"; c.lineWidth = 2.5; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(78, 28 + i * 6); c.quadraticCurveTo(130, 14 + i * 14, 168, 6 + i * 22 + nz); c.stroke(); }
    if (o.carrot != null) { const L = 190 * (1 - o.carrot * .7); c.save(); c.translate(88 + Math.cos(1.05) * L, 46 + Math.sin(1.05) * L); c.rotate(1.05 + Math.PI); carrot(c, 190, { t, bite: o.carrot }); c.restore(); }
    if (o.grass) { c.save(); c.translate(84, 50); c.rotate(1.1 + Math.sin(t * 15) * .05); c.strokeStyle = "#6ccf7a"; c.lineWidth = 7; c.lineCap = "round"; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(70 + i * 12, (i - 1) * 16); c.stroke(); } c.restore(); }
    c.restore();
    // Auge
    fig.eye(c, 18, -12, 22, { t, seed: o.seed ?? 1, look: o.look ?? .5, mood: o.mood, lid: P.f });
    // naher Löffel (rosa innen)
    c.save(); c.translate(-14, -46); c.rotate(-1.75 - ew + droop);
    kshape(c, ell(96, 0, 104, 30, 0), P.f, { rim: P.l, shadow: "rgba(90,40,10,.25)", rw: 5, sw: 10 });
    c.fillStyle = C.earIn; c.beginPath(); c.ellipse(100, 4, 80, 15, 0, 0, 7); c.fill();
    if (o.wild) { c.fillStyle = "#3a2a1c"; c.beginPath(); c.ellipse(196, 0, 10, 22, 0, 0, 7); c.fill(); }
    c.restore();
    c.restore();
    c.restore();
  }
  function bAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); rabbit(g, o); g.restore(); }
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
    if (o.hold === "carrot") { c.save(); c.translate(hx, hy); c.rotate(-.35); carrot(c, 150, { t }); c.restore(); }
    c.fillStyle = C.skin; c.beginPath(); c.arc(hx, hy, 20, 0, 7); c.fill();
    c.restore(); return { hx, hy }; }
  function at(fn, x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); const r = fn(g, o); g.restore(); return r; }

  // ================= Shots =================
  // Hook: Nahaufnahme Kaninchen knabbert Karotte, Zuckerwürfel ploppen; Ende = Loop-Bild
  function hookShot(lt, d, t, loop) { const k = sm(lt / d); lawn(t, 0, 0, 1); cam(lerp(150, 170, k), -230, loop ? lerp(1.9, 2.0, k) : lerp(2.0, 2.2, k));
    tuft(g, -260, 0, 1, t); tuft(g, 420, 0, 1.2, t);
    bAt(0, 0, 1, { t, carrot: loop ? .1 : .1 + k * .25, look: .2, seed: 1 });
    if (!loop) { for (let i = 0; i < 3; i++) { const a = (lt - .5 - i * .25) / .3; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); cube(W * (.5 + i * .13), H * .4 - (i % 2) * 50, 1, a); g.restore(); }
      if (lt > d * .6) stamp("CANDY!", W * .44, H * .64, (lt - d * .6) / .3, "#ff5a9a"); } }
  KZ.shot("cHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("cLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .5) { lawn(t, lerp(-80, -40, k), -260, 1.05); const r = sm(lt / (d * .45));
      at(rudi, -330, 0, .95, { t, arm: lerp(.2, .6, r), hold: "carrot", mouth: "smile", look: .7 }); bAt(220, 0, .6, { t, look: -.2, seed: 2 }, true); }
    else hookShot(lt - d * .5, d * .5, t, true); });

  // Infografik 1: Karotte -> Zuckerwürfel
  KZ.shot("cSugar", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.06, sm(lt / d)));
    const p = easeBack(clamp(lt / .5, 0, 1)); g.save(); g.translate(W * .16, H * .34); g.rotate(.5 + Math.sin(t * 1.5) * .04); g.scale(p, p); carrot(g, 560, { t }); g.restore();
    const n = 8; for (let i = 0; i < n; i++) { const a = (lt - .6 - i * .16) / .3; cube(W * (.5 + (i % 3) * .14), H * (.22 + Math.floor(i / 3) * .1) + Math.sin(t * 2 + i) * 6, 1.25, a); }
    label("SUGAR", W * .65, H * .14, sm((lt - .6) / .3));
    if (lt > d * .6) stamp("SWEET!", W * .44, H * .6, (lt - d * .6) / .3, "#ff5a9a", .05); });

  // Du-Szene: Rudi hält Karotte hin, Kaninchen hoppelt heran
  KZ.shot("cHero", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-60, 0, k), -280, lerp(1.0, 1.1, k));
    tuft(g, 500, 0, 1, t);
    const r = at(rudi, -330, 0, .95, { t, arm: .35, hold: "carrot", mouth: lt > d * .55 ? "grin" : "smile", look: .5 });
    const hp = sm((lt - .2) / (d * .55)); const ph = (hp * 3) % 1; bAt(lerp(520, 40, hp), 0, .6, { t, hop: hp < 1 ? ph : 0, look: -.3, seed: 2 }, true);
    if (lt > d * .55) { for (let i = 0; i < 3; i++) heart(g, -60 + i * 50, -460 - ((t * 60 + i * 40) % 160), 3, "#ff6b8a"); stamp("+100 LOVE", W * .44, H * .14, (lt - d * .55) / .3, "#ff5a9a", -.06); } });

  // Wildkaninchen grasen auf der Wiese in der Abenddämmerung
  function meadow(t, cx, cy, z) { reef(t, cx * .3, 0, 1, DUSK); g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.globalCompositeOperation = "lighter"; glow(W * .7, H * .2, 420, "rgba(255,200,140,.4)"); g.restore();
    g.fillStyle = "#ffe0a8"; g.beginPath(); g.arc(W * .7, H * .2, 70, 0, 7); g.fill(); cam(cx, cy, z);
    const sg = g.createLinearGradient(0, -20, 0, 1200); sg.addColorStop(0, "#4f9a52"); sg.addColorStop(1, "#1f4a30"); g.fillStyle = sg; g.fillRect(-3000, -20, 6000, 3000);
    for (let i = 0; i < 30; i++) tuft(g, -2600 + i * 180 + (i % 3) * 40, (i % 4) * 30, .8 + (i % 3) * .2, t, i % 2 ? "#79d07e" : "#5ab872");
    g.fillStyle = "rgba(255,255,255,.8)"; for (let i = 0; i < 16; i++) { g.beginPath(); g.arc(-1500 + i * 210, -30 + (i % 3) * 30, 8, 0, 7); g.fill(); } }
  KZ.shot("cWild", (lt, d, t) => { const k = sm(lt / d); meadow(t, lerp(-100, 60, k), -240, lerp(1.0, 1.15, k));
    bAt(-260, 0, .62, { t, wild: true, graze: .9, grass: true, seed: 3, look: .4 }); bAt(220, 40, .7, { t: t + 1, wild: true, graze: .2 + .7 * sm(Math.sin(t * .8) * .5 + .5), seed: 4, look: .6 });
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W * .3, H * .27); g.rotate(.4); carrot(g, 240, { t }); g.restore(); cross(W * .42, H * .3, 1, sm((lt - .3) / .3));
    label("WILD RABBITS", W * .4, H * .12, sm((lt - .1) / .3));
    if (lt > d * .6) stamp("GRASS!", W * .44, H * .62, (lt - d * .6) / .3, "#2fae6a", -.05); });

  // Infografik 2: 24-h-Uhr, 6-8 Stunden grasen
  KZ.shot("cHours", (lt, d, t) => { navy(t, 1); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const cx = W * .44, cy = H * .36, R = 300, f = sm((lt - .3) / (d * .6));
    g.lineWidth = 60; g.strokeStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
    g.strokeStyle = "#7ef0b0"; g.lineCap = "round"; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + f * (7 / 24) * 6.283); g.stroke(); g.lineCap = "butt";
    g.save(); g.globalCompositeOperation = "lighter"; glow(cx, cy, R * 1.2, `rgba(120,240,170,${.15 * f})`); g.restore();
    for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283 - Math.PI / 2; g.fillStyle = i % 6 ? "rgba(255,255,255,.35)" : "#fff"; g.beginPath(); g.arc(cx + Math.cos(a) * (R - 70), cy + Math.sin(a) * (R - 70), i % 6 ? 5 : 9, 0, 7); g.fill(); }
    g.save(); g.translate(cx - 10, cy + 70); g.scale(.55, .55); rabbit(g, { t, wild: true, graze: .9, grass: true, seed: 5 }); tuft(g, 200, 0, 1.2, t); g.restore();
    txt(Math.round(lerp(0, 8, f)) < 6 ? Math.round(lerp(0, 8, f)) + " HRS" : "6–8 HRS", cx, cy - 110, 96, "#fff", { stroke: 12, w: 900, a: sm((lt - .2) / .3) });
    txt("EVERY DAY", cx, cy + R + 100, 52, "#7ef0b0", { stroke: 8, w: 900, a: sm((lt - .8) / .3) }); });

  // Infografik 3: Querschnitt Kopf, Zähne wachsen
  function bigHead(t, x, y, s, o) { g.save(); g.translate(x, y); g.scale(s, s); g.translate(-120, 200); rabbit(g, Object.assign({ t, seed: 6, look: .5 }, o)); g.restore(); }
  KZ.shot("cTeeth", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.06, sm(lt / d)));
    const s = 3.1, hx = W * .22, hy = H * .3, gr = sm((lt - .4) / (d * .75)); bigHead(t, hx, hy, s, { longTeeth: gr * 1.6 });
    const tx = hx + 80 * s, ty = hy + 44 * s;
    // Lineal neben den Zähnen
    g.fillStyle = "rgba(255,216,77,.9)"; g.fillRect(tx + 100, ty, 10, 15 * s + gr * 64 * s); for (let i = 0; i <= 8; i++) g.fillRect(tx + 100, ty + i * 30, i % 2 ? 22 : 36, 5);
    for (let i = 0; i < 2; i++) { const p = (t * .8 + i * .5) % 1; txt("▼", tx + 190, ty + 60 + p * 160, 64, "#ffd84d", { a: sm((lt - .5) / .3) * (1 - p), w: 900 }); }
    g.save(); g.globalCompositeOperation = "lighter"; glow(tx + 10, ty + 15 * s + gr * 64 * s, 90, `rgba(255,240,180,${.5 * gr})`); g.restore();
    label("NEVER STOPS", W * .44, H * .12, sm((lt - .5) / .3));
    if (lt > d * .65) stamp("GROWING!", W * .44, H * .62, (lt - d * .65) / .3, "#7b5cff", -.05); });

  // Infografik 4: Zahnlängen-Meter, Gras schleift ab
  KZ.shot("cGrind", (lt, d, t) => { navy(t, 1); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    g.save(); g.translate(W * .52, H * .5); g.scale(1.25, 1.25); rabbit(g, { t, wild: false, grass: true, eat: true, seed: 7, look: .3 }); g.restore();
    for (let i = 0; i < 4; i++) { const p = (t * .7 + i / 4) % 1; g.save(); g.translate(W * .52 + 300 - p * 170, H * .5 - 205 + Math.sin(i * 2) * 20); g.rotate(.3); g.strokeStyle = `rgba(108,207,122,${1 - p})`; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.lineTo(80, -10); g.stroke(); g.restore(); }
    // Meter links
    const x = W * .14, y0 = H * .58, hgt = H * .38, cyc = (lt * .9) % 1, lvl = .45 + .2 * Math.sin(cyc * 6.283);
    g.fillStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.roundRect(x - 50, y0 - hgt, 100, hgt, 24); g.fill();
    g.fillStyle = "rgba(126,240,176,.25)"; g.fillRect(x - 50, y0 - hgt * .62, 100, hgt * .34);
    const lv = sm(lt / .6) * lvl; g.fillStyle = lv > .62 ? "#ff6b6b" : "#7ef0b0"; g.beginPath(); g.roundRect(x - 40, y0 - hgt * lv - 10, 80, hgt * lv, 18); g.fill();
    txt("TOOTH", x, y0 + 50, 40, "#fff", { stroke: 6, w: 900 }); txt("LENGTH", x, y0 + 94, 40, "#fff", { stroke: 6, w: 900 });
    label("TOUGH GRASS", W * .52, H * .12, sm((lt - .2) / .3)); check(W * .78, H * .26, .8, sm((lt - d * .5) / .3));
    if (lt > d * .65) stamp("GRIND!", W * .5, H * .62, (lt - d * .65) / .3, "#2fae6a", .05); });

  // Zu viele Karotten: dickes Kaninchen, Bauchweh
  KZ.shot("cGut", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(80, 60, k), -260, lerp(1.2, 1.32, k));
    for (let i = 0; i < 6; i++) carAt(150 + (i % 3) * 60, -18 - Math.floor(i / 3) * 34, 150, -.2 + i * .1, { t, noLeaf: i % 2 });
    const f = sm((lt - .2) / (d * .5)); bAt(-80, 0, .9, { t, fat: f, mood: f > .6 ? "scared" : undefined, seed: 8, look: .2 });
    if (f > .5) { g.save(); g.globalCompositeOperation = "lighter"; glow(-90, -110, 140, `rgba(255,90,90,${.35 * (f - .5) * 2})`); g.restore();
      g.strokeStyle = `rgba(255,120,120,${(f - .5) * 2})`; g.lineWidth = 8; g.beginPath(); for (let i = 0; i < 40; i++) { const a = i * .45 + t * 4, r = i * 2.2; g.lineTo(-90 + Math.cos(a) * r, -110 + Math.sin(a) * r * .7); } g.stroke(); }
    label("WEIGHT GAIN", W * .3, H * .12, sm((lt - .4) / .3)); label("GUT TROUBLE", W * .62, H * .2, sm((lt - d * .45) / .3));
    if (lt > d * .65) stamp("OUCH!", W * .44, H * .62, (lt - d * .65) / .3, "#e5484d", -.05); });

  // Quellenkarte RSPCA (echtes Zitat)
  KZ.shot("cQuote", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .33); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -330, 780, 680, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -340, 780, 680, 34); g.fill();
    g.fillStyle = "#232a6b"; g.beginPath(); g.roundRect(-390, -340, 780, 120, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 46px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("RSPCA", 0, -280);
    g.fillStyle = "#ff8a1e"; g.font = '900 130px "Montserrat"'; g.fillText("“", -320, -170);
    const lines = ["Despite popular belief,", "carrots aren't the main", "source of food for", "rabbits – nor should", "they be."]; g.font = '800 48px "Montserrat"'; g.fillStyle = "#1b1d3a";
    lines.forEach((l, i) => { const a = sm((lt - .4 - i * .3) / .3); g.globalAlpha = a; g.fillText(l, 0, -160 + i * 64); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 30px "Montserrat"'; g.fillText("RSPCA rabbit diet advice", 0, 230);
    g.save(); g.translate(250, 170); g.rotate(-.6); carrot(g, 120, { t }); g.restore();
    g.restore();
    if (lt > d * .7) stamp("NOT FOOD", W * .44, H * .62, (lt - d * .7) / .25, "#7b5cff", -.05); });

  KZ.shot("cAsk", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-60, -100, k), -260, lerp(1.25, 1.4, k));
    at(rudi, -160, 0, .95, { t, arm: 1.5 + .5 * sm(lt / .5), mouth: "o", look: .3 }); bAt(170, 0, .55, { t, look: -.4, seed: 9 }, true);
    const a = easeBack(clamp((lt - .1) / .4, 0, 1)); txt("?", W * .7, H * .2, 220 * a + 1, "#ffd84d", { stroke: 14, w: 900 });
    if (lt > d * .3) stamp("WHAT THEN?", W * .44, H * .12, (lt - d * .3) / .3, "#7b5cff", -.05); });

  // Tipp 1: Heuhaufen so groß wie das Kaninchen
  KZ.shot("cHay", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-40, 40, k), -240, lerp(1.0, 1.08, k));
    const drop = sm((lt - .2) / .6); at(rudi, -330, 0, .95, { t, arm: lerp(.6, .1, drop), mouth: "smile", look: .5 });
    const hy = lerp(-260, 0, easeBack(drop)); hay(g, 90, hy, 130, 190, t);
    bAt(320, 0, .6, { t, eat: drop > .9, look: -.3, seed: 2 }, true);
    const m = sm((lt - d * .5) / .4); if (m > 0) { g.save(); g.globalAlpha = m; g.strokeStyle = "#fff"; g.setLineDash([18, 14]); g.lineWidth = 6; g.beginPath(); g.moveTo(-60, -195); g.lineTo(480, -195); g.stroke(); g.setLineDash([]); g.restore(); }
    label("AS BIG AS YOUR BUNNY", W * .44, H * .12, m);
    if (lt > d * .7) stamp("DAILY", W * .44, H * .62, (lt - d * .7) / .25, "#2fae6a", .05); });

  // Infografik 5: Ernährungs-Balken 85 / 10 / 5
  KZ.shot("cDiet", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const rows = [["HAY + GRASS", 85, "#e8c860"], ["LEAFY GREENS", 10, "#48c060"], ["PELLETS", 5, "#c98b5a"]];
    rows.forEach(([n, v, col], i) => { const y = H * (.16 + i * .16), a = sm((lt - .2 - i * .35) / .5), x0 = W * .1, wmax = W * .62;
      txt(n, x0, y - 54, 44, "#fff", { align: "left", stroke: 6, w: 900, a: sm((lt - .1 - i * .35) / .3) });
      g.fillStyle = "rgba(255,255,255,.1)"; g.beginPath(); g.roundRect(x0, y - 20, wmax, 64, 20); g.fill();
      g.fillStyle = col; g.beginPath(); g.roundRect(x0, y - 20, Math.max(40, wmax * v / 85 * a), 64, 20); g.fill();
      txt(Math.round(v * a) + "%", x0 + Math.max(40, wmax * v / 85 * a) + 80, y + 12, 52, col, { stroke: 8, w: 900, a: sm((lt - .2 - i * .35) / .3) }); });
    hay(g, W * .25, H * .62, 110, 120, t); g.save(); g.translate(W * .52, H * .6); for (let i = 0; i < 5; i++) { g.save(); g.rotate(-1.2 + i * .5); kshape(g, ell(50, 0, 60, 24, 0), i % 2 ? C.leaf : C.leafD, { rim: "rgba(220,255,200,.6)", rw: 3, sw: 5 }); g.restore(); } g.restore();
    const ca = sm((lt - d * .6) / .3); g.save(); g.translate(W * .72, H * .58); g.rotate(.3); g.globalAlpha = ca; carrot(g, 150 * (1 - .4 * ca), { t }); g.restore();
    label("CARROTS = TINY TREAT", W * .44, H * .66, ca); });

  // Tipp 2: kleines Stück Karotte oder Karottengrün
  KZ.shot("cTreat", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(60, 90, k), -240, lerp(1.25, 1.35, k));
    const s = 1 - .55 * sm((lt - .3) / .5); carAt(-170, -30, 220 * s, .1, { t, noLeaf: s < .5 });
    const lp = sm((lt - d * .5) / .4); if (lp > 0) { g.save(); g.translate(130, -10); g.globalAlpha = lp; for (let i = 0; i < 6; i++) { g.save(); g.rotate(-2.6 + i * .3 + Math.sin(t * 2 + i) * .04); kshape(g, ell(60, 0, 80, 24, 0), i % 2 ? C.leaf : C.leafD, { rim: "rgba(220,255,200,.6)", rw: 3, sw: 5 }); g.restore(); } g.restore(); }
    bAt(330, 0, .75, { t, eat: true, look: -.2, seed: 1 }, true);
    label("SMALL PIECE", W * .3, H * .12, sm((lt - .3) / .3)); label("+ LEAFY TOPS", W * .6, H * .2, lp);
    if (lt > d * .65) stamp("TREAT ONLY", W * .44, H * .62, (lt - d * .65) / .3, "#ff8a1e", -.05); });
})();
