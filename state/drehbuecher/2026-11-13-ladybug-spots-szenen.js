// Szenendatei "Ladybug Spots Don't Show Age" (Siebenpunkt-Marienkäfer, Coccinella septempunctata). Mix-Stil (Hermann 12.11.2026).
// Quellen: Sussex Wildlife Trust "Lovely Ladybirds" 2024 (frisch geschlüpft ohne Punkte, Punkte erscheinen in etwa einem Tag,
// "once established the ladybird will have that number of spots for the rest of its life", Lebensdauer ca. 1 Jahr),
// Natural History Museum (46 Arten in UK, alle überwintern), Buglife (Überwinterung im Haus: sanft nach draußen an einen
// geschützten Platz bringen, "a log pile is an ideal place"), Wildlife Trusts (Warnfarbe, gelbe Flüssigkeit aus den Gelenken).
// Helfer txt/stamp/navy/rudi/at/sparkle/cross/check aus wasp-swat übernommen (Rudi bleibt gleich). Marienkäfer neu gezeichnet:
// gewölbte rote Deckflügel mit Naht, 7 Punkte (1 mittig am Halsschild), schwarzer Halsschild mit weißen Ecken,
// schwarzer Kopf mit weißen Flecken, kurze gekeulte Fühler, 6 schwarze Beine.
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

  // ================= Marienkäfer =================
  // Punkte relativ zur Deckflügel-Mitte (0,30); x>0 wird gespiegelt, x==0 liegt auf der Naht
  const SPOTS = {
    seven: [[0, -112, 30], [60, -48, 30], [94, 24, 23], [52, 82, 25]],
    two: [[58, 0, 30]],
    fourteen: [[28, -88, 17], [78, -70, 17], [36, -28, 17], [92, -12, 16], [40, 34, 17], [88, 52, 15], [44, 98, 15]],
    twentytwo: [[22, -96, 10], [62, -88, 10], [96, -56, 10], [36, -44, 10], [76, -20, 10], [22, 6, 10], [100, 12, 9], [54, 34, 10], [24, 70, 10], [80, 74, 10], [46, 112, 9]]
  };
  function spotList(arr) { const out = []; for (const [x, y, r] of arr) { if (x === 0) out.push([0, y, r]); else { out.push([-x, y, r]); out.push([x, y, r]); } } return out; }
  // Draufsicht, Kopf nach oben, Mitte (0,0), Länge ~300
  // o: t, base, spots (Name oder Liste), spotN (Anzahl sichtbar, kann gebrochen sein), pale (0..1 frisch geschlüpft), walk, square, noEyes, look, mood, seed
  function lbTop(c, o) { o = o || {}; const t = o.t || 0, wk = (o.walk || 0) * t * 12, br = 1 + Math.sin(t * 2.6 + (o.seed || 0)) * .012;
    const base = o.pale ? mix(o.base || C.red, C.pale, o.pale) : (o.base || C.red);
    c.save(); c.scale(br, br);
    // Beine
    c.strokeStyle = C.blk; c.lineWidth = 11; c.lineCap = "round"; c.lineJoin = "round";
    [[-70, -.9], [-20, 0], [40, .9]].forEach(([y0, a], i) => { for (const s of [-1, 1]) { const ph = wk + i * 2.1 + (s > 0 ? Math.PI : 0), sw = Math.sin(ph) * 12;
      c.beginPath(); c.moveTo(s * 60, y0); c.lineTo(s * 132, y0 + a * 26 + sw * .6); c.lineTo(s * 152, y0 + a * 64 + sw); c.stroke(); } });
    // Fühler
    c.lineWidth = 6; const as = Math.sin(t * 3.1) * 6; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 18, -150); c.quadraticCurveTo(s * 30, -178, s * (40 + as * s * .3), -192 + as); c.stroke(); c.fillStyle = C.blk; c.beginPath(); c.ellipse(s * (42 + as * s * .3), -195 + as, 8, 6, 0, 0, 7); c.fill(); }
    // Kopf
    kshape(c, ell(0, -140, 46, 28, 0), C.blk, { rim: C.blkL, rw: 4, sw: 6 });
    c.fillStyle = "#f6f1e6"; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 34, -132, 9, 7, 0, 0, 7); c.fill(); }
    if (!o.noEyes) { fig.eye(c, -17, -150, 15, { t, seed: o.seed || 2, look: o.look ?? 0, mood: o.mood }); fig.eye(c, 17, -150, 15, { t, seed: o.seed || 2, look: o.look ?? 0, mood: o.mood }); }
    // Deckflügel
    const ely = ell(0, 30, 122, 134, 0);
    kshape(c, ely, base, { rim: C.redL, shadow: "rgba(90,0,20,.28)", rw: 7, sw: 20 });
    const list = Array.isArray(o.spots) ? o.spots : spotList(SPOTS[o.spots || "seven"]);
    const n = o.spotN ?? list.length;
    c.save(); ely(c); c.clip(); c.fillStyle = o.spotCol || C.blk;
    list.forEach(([x, y, r], i) => { const a = clamp(n - i, 0, 1); if (a <= 0) return; const rr = r * easeBack(a); c.beginPath(); if (o.square) c.roundRect(x - rr, 30 + y - rr, rr * 2, rr * 2, rr * .45); else c.ellipse(x, 30 + y, rr, rr * .92, 0, 0, 7); c.fill(); });
    c.restore();
    // Naht + Glanz
    c.strokeStyle = "rgba(60,0,10,.45)"; c.lineWidth = 4; c.beginPath(); c.moveTo(0, -100); c.lineTo(0, 162); c.stroke();
    c.save(); c.globalAlpha = .4; c.fillStyle = "#fff"; c.beginPath(); c.ellipse(52, -36, 30, 14, -.7, 0, 7); c.fill(); c.globalAlpha = .25; c.beginPath(); c.ellipse(-60, -40, 18, 9, .7, 0, 7); c.fill(); c.restore();
    // Halsschild
    const pro = (c) => { c.beginPath(); c.moveTo(-78, -84); c.quadraticCurveTo(-82, -128, -40, -128); c.lineTo(40, -128); c.quadraticCurveTo(82, -128, 78, -84); c.quadraticCurveTo(0, -70, -78, -84); c.closePath(); };
    kshape(c, pro, C.blk, { rim: C.blkL, rw: 4, sw: 8 });
    c.save(); pro(c); c.clip(); c.fillStyle = "#f6f1e6"; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 70, -112, 22, 20, 0, 0, 7); c.fill(); } c.restore();
    c.restore(); }
  function lbAt(x, y, s, rot, o) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s); lbTop(g, o); g.restore(); }

  // Seitenansicht, Kopf nach rechts, Füße bei y=0, Länge ~300. o: t, walk, bleed (0..1), pale, mood, look, upside
  function lbSide(c, o) { o = o || {}; const t = o.t || 0, wk = (o.walk || 0) * t * 12, br = Math.sin(t * 2.6) * 2;
    const base = o.pale ? mix(C.red, C.pale, o.pale) : C.red;
    const knees = [];
    c.strokeStyle = C.blk; c.lineWidth = 10; c.lineCap = "round"; c.lineJoin = "round";
    [-70, 0, 70].forEach((x0, i) => { const ph = wk + i * 2.1, sw = Math.sin(ph) * 16, lift = Math.max(0, Math.cos(ph)) * 8 * (o.walk ? 1 : 0);
      const kx = x0 + 18 + sw * .4, ky = -18 - lift; c.beginPath(); c.moveTo(x0, -34); c.lineTo(kx, ky); c.lineTo(x0 + 30 + sw, -lift); c.stroke(); knees.push([kx, ky]); });
    // Unterseite
    c.fillStyle = "#2a2230"; c.beginPath(); c.ellipse(0, -36, 128, 16, 0, 0, 7); c.fill();
    // Kopf
    kshape(c, ell(150, -46 + br * .5, 34, 30, 0), C.blk, { rim: C.blkL, rw: 4, sw: 6 });
    c.fillStyle = "#f6f1e6"; c.beginPath(); c.ellipse(166, -30 + br * .5, 9, 6, 0, 0, 7); c.fill();
    fig.eye(c, 160, -56 + br * .5, 14, { t, seed: 5, look: o.look ?? .6, mood: o.mood });
    c.strokeStyle = C.blk; c.lineWidth = 5; const as = Math.sin(t * 3.1) * 6; c.beginPath(); c.moveTo(170, -72); c.quadraticCurveTo(190, -96, 206, -98 + as); c.stroke(); c.fillStyle = C.blk; c.beginPath(); c.ellipse(208, -99 + as, 8, 6, .3, 0, 7); c.fill();
    // Halsschild
    kshape(c, (c) => { c.beginPath(); c.moveTo(80, -40); c.quadraticCurveTo(84, -108 + br, 124, -96 + br); c.quadraticCurveTo(150, -80, 140, -40); c.closePath(); }, C.blk, { rim: C.blkL, rw: 4, sw: 6 });
    c.fillStyle = "#f6f1e6"; c.beginPath(); c.ellipse(126, -66 + br, 14, 16, 0, 0, 7); c.fill();
    // Kuppel
    const dome = (c) => { c.beginPath(); c.moveTo(-136, -34); c.bezierCurveTo(-140, -160 + br, 40, -190 + br, 104, -100 + br); c.quadraticCurveTo(116, -70, 108, -34); c.closePath(); };
    kshape(c, dome, base, { rim: C.redL, shadow: "rgba(90,0,20,.28)", rw: 7, sw: 18 });
    if (!o.pale || o.pale < .9) { c.save(); dome(c); c.clip(); c.globalAlpha = 1 - (o.pale || 0); c.fillStyle = C.blk; for (const [x, y, r] of [[60, -120, 26], [-20, -128, 30], [-90, -70, 24], [20, -66, 22]]) { c.beginPath(); c.ellipse(x, y + br, r, r * .9, 0, 0, 7); c.fill(); } c.restore(); }
    c.save(); c.globalAlpha = .4; c.fillStyle = "#fff"; c.beginPath(); c.ellipse(10, -150 + br, 46, 14, -.15, 0, 7); c.fill(); c.restore();
    if (o.bleed) { c.save(); for (const [i, [kx, ky]] of knees.entries()) { const p = clamp(o.bleed * 1.4 - i * .2, 0, 1); if (p <= 0) continue; const dr = 6 + p * 12, dy = p * 18;
      c.save(); c.globalCompositeOperation = "lighter"; glow(kx, ky + dy, 40 * p, "rgba(255,210,60,.45)"); c.restore();
      kshape(c, (c) => { c.beginPath(); c.moveTo(kx, ky - 4); c.quadraticCurveTo(kx + dr, ky + dy, kx, ky + dy + dr); c.quadraticCurveTo(kx - dr, ky + dy, kx, ky - 4); c.closePath(); }, C.goo, { rim: "rgba(255,255,220,.9)", rw: 3, sw: 4 }); } c.restore(); }
    return knees; }
  function lsAt(x, y, s, o) { g.save(); g.translate(x, y); g.scale(s, Math.abs(s)); lbSide(g, o); g.restore(); }

  // Puppe (hängt am Blatt, Spitze oben bei y=0, Länge ~230). split 0..1
  function pupa(c, o) { const t = o.t || 0, sp = o.split || 0;
    const body = (c) => { c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(70, 10, 92, 140, 60, 210); c.quadraticCurveTo(0, 250, -60, 210); c.bezierCurveTo(-92, 140, -70, 10, 0, 0); c.closePath(); };
    c.save(); c.rotate(Math.sin(t * 1.5) * .03);
    kshape(c, body, "#e88a2c", { rim: "rgba(255,220,170,.8)", shadow: "rgba(90,30,0,.3)", rw: 6, sw: 14 });
    c.save(); body(c); c.clip(); c.fillStyle = "#4a2416"; for (const [x, y, r] of [[-30, 70, 14], [30, 70, 14], [0, 120, 16], [-40, 150, 12], [40, 150, 12], [-20, 190, 12], [20, 190, 12]]) { c.beginPath(); c.ellipse(x, y, r, r * .8, 0, 0, 7); c.fill(); }
    c.strokeStyle = "rgba(90,30,0,.35)"; c.lineWidth = 4; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(-90, 30 + i * 34); c.quadraticCurveTo(0, 44 + i * 34, 90, 30 + i * 34); c.stroke(); } c.restore();
    if (sp > 0) { c.strokeStyle = "#2a1208"; c.lineWidth = 6; c.beginPath(); c.moveTo(0, 230); c.lineTo(-8, 230 - sp * 120); c.lineTo(6, 230 - sp * 170); c.stroke(); }
    c.restore(); }

  // Blaumeise (Seitenansicht, Kopf rechts, Füße bei y=0, Länge ~300). o: t, yuck (0..1), hop
  function tit(c, o) { const t = o.t || 0, y = o.yuck || 0, br = Math.sin(t * 3) * 3, back = -y * 40;
    c.save(); c.translate(back, 0);
    c.strokeStyle = "#7c7f9a"; c.lineWidth = 7; for (const x of [-10, 20]) { c.beginPath(); c.moveTo(x, -50); c.lineTo(x + 6, 0); c.stroke(); }
    kshape(c, (c) => { c.beginPath(); c.moveTo(-90, -110); c.lineTo(-200, -80); c.lineTo(-186, -60); c.lineTo(-80, -80); c.closePath(); }, C.tit, { rim: "rgba(200,230,255,.6)", rw: 4, sw: 6 });
    kshape(c, ell(0, -100 + br, 105, 62, -.08), C.titY, { rim: "rgba(255,250,210,.8)", shadow: "rgba(120,80,0,.25)", rw: 6, sw: 14 });
    kshape(c, (c) => { c.beginPath(); c.moveTo(-100, -100 + br); c.bezierCurveTo(-60, -170 + br, 40, -168 + br, 70, -140 + br); c.quadraticCurveTo(20, -110 + br, -100, -100 + br); c.closePath(); }, C.titG, { rim: "rgba(220,255,190,.5)", rw: 4, sw: 6 });
    kshape(c, (c) => { c.beginPath(); c.ellipse(-30, -110 + br, 70, 32, -.25, 0, 7); }, C.tit, { rim: "rgba(200,230,255,.7)", rw: 5, sw: 8 });
    const hr = -y * .25; c.save(); c.translate(80, -150 + br); c.rotate(hr);
    kshape(c, ell(0, 0, 56, 52, 0), "#f8f6f0", { rim: "rgba(255,255,255,.9)", shadow: "rgba(60,60,100,.25)", rw: 4, sw: 10 });
    kshape(c, (c) => { c.beginPath(); c.moveTo(-52, -6); c.bezierCurveTo(-50, -60, 50, -64, 54, -12); c.quadraticCurveTo(0, -26, -52, -6); c.closePath(); }, C.tit, { rim: "rgba(200,230,255,.7)", rw: 4, sw: 6 });
    c.fillStyle = "#1b2440"; c.beginPath(); c.moveTo(-50, 0); c.quadraticCurveTo(10, -10, 56, 2); c.lineTo(56, 12); c.quadraticCurveTo(10, 4, -50, 12); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-20, 44); c.quadraticCurveTo(10, 60, 30, 46); c.lineTo(10, 30); c.closePath(); c.fill();
    fig.eye(c, 26, 2, 15, { t, seed: 7, look: .5, mood: y > .3 ? "scared" : undefined });
    c.fillStyle = "#2a2a36"; const op = y * 14; c.beginPath(); c.moveTo(50, 14); c.lineTo(80, 20 - op * .3); c.lineTo(50, 26); c.fill(); if (op > 2) { c.beginPath(); c.moveTo(50, 26); c.lineTo(76, 34 + op * .4); c.lineTo(50, 30); c.fill(); }
    if (y > .3) { c.strokeStyle = "#8ee05a"; c.lineWidth = 6; c.lineCap = "round"; for (let i = 0; i < 3; i++) { c.beginPath(); for (let k = 0; k < 12; k++) c.lineTo(96 + k * 7, 0 + i * 22 + Math.sin(k * 1.4 + t * 8 + i) * 6); c.stroke(); } }
    c.restore(); c.restore(); }

  // Holzstapel (Boden bei y=0)
  function logs(x, y, s, t, holes) { g.save(); g.translate(x, y); g.scale(s, s);
    const L = [[-170, -70, 70], [-30, -70, 72], [110, -66, 66], [-100, -190, 66], [36, -186, 64], [-34, -300, 60]];
    for (const [lx, ly, r] of L) { kshape(g, (c) => { c.beginPath(); c.roundRect(lx - 30, ly - r, 160, r * 2, r); }, C.woodD, { rim: "rgba(255,210,160,.4)", rw: 4, sw: 10 });
      kshape(g, ell(lx, ly, r * .78, r, 0), C.ring, { rim: "rgba(255,240,210,.8)", shadow: "rgba(110,60,20,.3)", rw: 4, sw: 10 });
      g.strokeStyle = "rgba(140,80,30,.55)"; g.lineWidth = 4; for (let k = 1; k < 4; k++) { g.beginPath(); g.ellipse(lx, ly, r * .78 * k / 4, r * k / 4, 0, 0, 7); g.stroke(); } }
    g.fillStyle = "#2b6a3a"; for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(-240 + i * 66, 0, 40, 20, 0, Math.PI, 0); g.fill(); }
    g.restore(); }

  // Staubsauger (Boden bei y=0), Schlauch zur Hand
  function vacuum(x, y, s, hand) { g.save(); g.translate(x, y); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-110, -150, 220, 130, 50); }, "#7a5ce0", { rim: "rgba(220,210,255,.7)", rw: 5, sw: 12 });
    g.fillStyle = "#2a2440"; for (const wx of [-70, 70]) { g.beginPath(); g.arc(wx, -18, 22, 0, 7); g.fill(); }
    kshape(g, ell(-20, -100, 40, 28, 0), "#b8a6ff", { rim: "rgba(255,255,255,.7)", rw: 3, sw: 5 });
    g.restore();
    if (hand) { g.strokeStyle = "#3a3450"; g.lineWidth = 18; g.lineCap = "round"; g.beginPath(); g.moveTo(x + 100 * s, y - 100 * s); g.quadraticCurveTo(x + 200 * s, y - 20, hand[0], hand[1]); g.stroke();
      g.strokeStyle = "#9aa0b8"; g.lineWidth = 16; g.beginPath(); g.moveTo(hand[0], hand[1]); g.lineTo(hand[0] + 150, hand[1] + 210); g.stroke();
      kshape(g, (c) => { c.beginPath(); c.roundRect(hand[0] + 110, hand[1] + 200, 110, 34, 10); }, "#5a5470", { rw: 3, sw: 5 }); } }

  // Rosenstiel mit Blattläusen
  function aphid(x, y, s, t, i) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 2 + i) * .08);
    g.strokeStyle = "#5aa040"; g.lineWidth = 3; for (const k of [-1, 0, 1]) { g.beginPath(); g.moveTo(k * 8, 6); g.lineTo(k * 16, 22); g.stroke(); }
    kshape(g, (c) => { c.beginPath(); c.moveTo(-26, 0); c.bezierCurveTo(-26, -24, 18, -22, 26, -4); c.quadraticCurveTo(14, 14, -26, 0); c.closePath(); }, C.aphid, { rim: "rgba(240,255,220,.8)", rw: 3, sw: 5 });
    g.fillStyle = "#22301a"; g.beginPath(); g.arc(18, -8, 3, 0, 7); g.fill(); g.restore(); }

  // ---------- Hintergründe ----------
  function leafBg(t, cx, cy, z, rot) {
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1d5a52"); bg.addColorStop(1, "#0d2a30"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 9; i++) glow((i * 271 + Math.sin(t * .3 + i) * 30) % W, (i * 433) % H, 160 + (i % 3) * 60, "rgba(160,255,190,.10)"); g.restore();
    cam(cx, cy, z);
    g.save(); g.rotate(rot ?? -.35);
    const lf = (c) => { c.beginPath(); c.moveTo(-1100, 0); c.bezierCurveTo(-600, -560, 600, -560, 1100, 0); c.bezierCurveTo(600, 560, -600, 560, -1100, 0); c.closePath(); };
    kshape(g, lf, C.leaf, { rim: "rgba(210,255,200,.5)", shadow: "rgba(0,40,20,.3)", rw: 10, sw: 30 });
    g.strokeStyle = "rgba(220,255,200,.45)"; g.lineWidth = 12; g.beginPath(); g.moveTo(-1080, 0); g.lineTo(1080, 0); g.stroke(); g.lineWidth = 6;
    for (let i = -4; i <= 4; i++) { if (!i) continue; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(i * 220, 0); g.quadraticCurveTo(i * 220 + 90, s * 160, i * 220 + 200, s * 330); g.stroke(); } }
    g.restore(); }
  function cake(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.roundRect(-110, -130, 220, 130, 18); }, "#ff9ac0", { rim: "rgba(255,230,240,.8)", rw: 5, sw: 12 });
    g.fillStyle = "#fff4f8"; g.beginPath(); g.moveTo(-110, -112); for (let i = 0; i <= 8; i++) g.quadraticCurveTo(-110 + i * 27.5 - 14, -70, -110 + i * 27.5, -112); g.lineTo(110, -130); g.lineTo(-110, -130); g.fill();
    g.fillStyle = "#ffd84d"; g.font = '900 120px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "alphabetic"; g.fillText("7", 0, -136);
    g.save(); g.globalCompositeOperation = "lighter"; glow(0, -270 + Math.sin(t * 9) * 3, 50, "rgba(255,200,80,.7)"); g.restore();
    g.fillStyle = "#ffcf4a"; g.beginPath(); g.ellipse(0, -262 + Math.sin(t * 9) * 3, 11, 20, 0, 0, 7); g.fill(); g.restore(); }
  function room(t, cx, cy, z, snow) {
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#3a3f8a"); bg.addColorStop(1, "#1d2050"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    cam(cx, cy, z);
    // Fenster mit Winternacht
    const wx = -80, wy = -900, ww = 640, wh = 640;
    const sk = g.createLinearGradient(0, wy, 0, wy + wh); sk.addColorStop(0, "#14204e"); sk.addColorStop(1, "#2c3f86"); g.fillStyle = sk; g.fillRect(wx, wy, ww, wh);
    g.fillStyle = "#dfe8ff"; g.fillRect(wx, wy + wh - 120, ww, 120);
    g.save(); g.globalCompositeOperation = "lighter"; glow(wx + 480, wy + 140, 90, "rgba(220,230,255,.5)"); g.restore(); g.fillStyle = "#f2f4ff"; g.beginPath(); g.arc(wx + 480, wy + 140, 40, 0, 7); g.fill();
    if (snow) { g.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < 40; i++) { const p = (t * .08 + i * .137) % 1; g.beginPath(); g.arc(wx + (i * 97 + Math.sin(t + i) * 20) % ww, wy + p * wh, 5 + i % 3 * 2, 0, 7); g.fill(); } }
    g.strokeStyle = "#f4f2ff"; g.lineWidth = 28; g.strokeRect(wx, wy, ww, wh); g.lineWidth = 16; g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.moveTo(wx, wy + wh / 2); g.lineTo(wx + ww, wy + wh / 2); g.stroke();
    kshape(g, (c) => { c.beginPath(); c.roundRect(wx - 60, wy + wh, ww + 120, 44, 10); }, "#f4f2ff", { rim: "rgba(255,255,255,.9)", shadow: "rgba(40,40,100,.3)", rw: 4, sw: 10 });
    g.fillStyle = "#4a3f86"; g.fillRect(-2000, 0, 4000, 2000); g.fillStyle = "#5a4f9a"; g.fillRect(-2000, 0, 4000, 14);
    return [wx + 400, wy + wh]; }
  // Gruppe überwinternder Käfer in der Fensterecke
  function cluster(x, y, t, n, s) { const P = [[0, 0], [-46, 6], [-22, -38], [24, -40], [-70, -30], [-94, 4], [-48, -76], [4, -82], [-118, -40]];
    for (let i = 0; i < (n ?? 9); i++) { const [px, py] = P[i]; lbAt(x + px * (s || 1) * 1.6 - 50, y + py * (s || 1) * 1.6 - 30, .17 * (s || 1), (i * 1.7) % 6.28, { t: t + i, seed: i, noEyes: true }); } }

  // ================= Shots =================
  function hookShot(lt, d, t, loop) { const k = sm(lt / d);
    leafBg(t, 0, 40, loop ? lerp(1.0, 1.04, k) : lerp(1.04, 1.12, k));
    cake(-310, 330, 1.1, t);
    lbAt(120, 130, 1.45, .12, { t, seed: 1, look: -.3 });
    if (!loop) { cross(W * .2, H * .54, 1.0, (lt - d * .45) / .3); stamp("MYTH", W * .5, H * .63, (lt - d * .55) / .25, "#e5484d", -.1); } }
  KZ.shot("lbHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("lbLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .55) { lawn(t, lerp(-40, 20, k), -380, lerp(1.25, 1.4, k)); const r = at(rudi, -160, 0, 1, { t, arm: .45, mouth: "hmm", look: .6 });
      const hx = -160 + r.hx, hy = r.hy; lsAt(hx + 10, hy - 14, .32, { t, look: -.4 });
      for (let i = 0; i < 3; i++) label(String(i + 1), W * (.38 + i * .12), H * .2, sm((lt - .3 - i * .35) / .2)); }
    else hookShot(lt - d * .55, d, t, true); });

  KZ.shot("lbCount", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-60, 30, k), -420, lerp(1.35, 1.6, k));
    const r = at(rudi, -200, 0, 1, { t, arm: .45, mouth: lt > d * .6 ? "grin" : "smile", look: .6 }); const hx = -200 + r.hx, hy = r.hy;
    lsAt(hx + 10, hy - 14, .32, { t, look: -.4 });
    for (let i = 0; i < 7; i++) { const a = sm((lt - .2 - i * .22) / .18); const ang = -2.6 + i * .37; label(String(i + 1), W * .52 + Math.cos(ang) * 330, H * .36 + Math.sin(ang) * 260, a); }
    stamp("7 YEARS?", W * .5, H * .58, (lt - d * .62) / .25, "#f08a1e", -.06); });

  KZ.shot("lbYears", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    txt("HOW OLD?", W * .44, H * .14, 76, "#fff", { w: 900 });
    const rows = [["WHAT YOU THINK", 7, "#f08a1e", "7 YEARS", .25], ["REAL LIFE", 1, "#7ef0b0", "~1 YEAR", .9]];
    rows.forEach(([nm, n, col, val, st], r) => { const y = H * (.27 + r * .19); txt(nm, 90, y - 70, 44, "#c9cdf5", { align: "left" });
      const p = sm((lt - st) / .7); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(255,255,255,.1)"; g.beginPath(); g.roundRect(90, y - 30, 760, 80, 40); g.fill();
      const wv = 760 * n / 7 * p; if (wv > 40) { g.fillStyle = col; g.beginPath(); g.roundRect(90, y - 30, wv, 80, 40); g.fill(); }
      txt(val, 90 + Math.max(wv, 80) + (n === 7 ? -150 : 130), y + 10, 44, n === 7 ? "#1b1d3a" : "#fff", { w: 900, a: p });
    });
    cross(W * .44, H * .3, 1.1, (lt - d * .6) / .25);
    g.setTransform(1, 0, 0, 1, 0, 0); lbAt(W * .44, H * .58, .55, Math.sin(t) * .1, { t, seed: 4 }); });

  KZ.shot("lbPupa", (lt, d, t) => { const k = sm(lt / d); leafBg(t, lerp(0, 20, k), lerp(-40, 40, k), lerp(1.15, 1.3, k), -.15);
    const sp = sm((lt - .1) / .6), out = sm((lt - .5) / (d * .55));
    lbAt(0, lerp(-80, 210, out), 1.0, Math.PI, { t, pale: 1, spotN: 0, seed: 3, noEyes: out < .4, walk: out < 1 ? 1 : 0 });
    g.save(); g.translate(0, -360); g.globalAlpha = 1; pupa(g, { t, split: sp }); g.restore();
    stamp("NO SPOTS", W * .5, H * .16, (lt - d * .6) / .25, "#f0a23a", -.07); });

  function clock(x, y, r, p) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(10,20,40,.55)"; g.beginPath(); g.arc(x, y, r + 10, 0, 7); g.fill();
    g.fillStyle = "#f7f4ec"; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = "rgba(240,138,30,.55)"; g.beginPath(); g.moveTo(x, y); g.arc(x, y, r * .9, -Math.PI / 2, -Math.PI / 2 + p * 6.283); g.fill();
    g.strokeStyle = "#1b1d3a"; g.lineWidth = 8; g.lineCap = "round"; const a = -Math.PI / 2 + p * 6.283 * 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * r * .75, y + Math.sin(a) * r * .75); g.stroke(); g.restore(); }
  KZ.shot("lbAppear", (lt, d, t) => { const k = sm(lt / d); leafBg(t, 0, 60, lerp(1.0, 1.12, k), -.2);
    const p = clamp(lt / (d * .9), 0, 1);
    lbAt(30, 120, 1.45, -.08, { t, pale: 1 - sm(p * 1.3), spotN: p * 7.4, seed: 3, look: .2 });
    clock(W * .2, H * .14, 90, p); label("~1 DAY", W * .2, H * .225, sm(lt / .3)); });

  KZ.shot("lbForLife", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const S = [["SPRING", "#7ef0b0"], ["SUMMER", "#ffd84d"], ["AUTUMN", "#f08a1e"], ["WINTER", "#9ad0ff"]];
    S.forEach(([nm, col], i) => { const x = W * (.25 + (i % 2) * .38), y = H * (.2 + Math.floor(i / 2) * .23), a = sm((lt - .1 - i * .25) / .3); if (a <= 0) return;
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; lbAt(x, y + 20, .55 * easeBack(a), Math.sin(t + i) * .08, { t: t + i, seed: i }); g.globalAlpha = 1;
      txt(nm, x, y - 160, 44, col, { w: 900, a }); txt("7", x + 130, y + 120, 64, "#fff", { w: 900, a, stroke: 10 }); });
    stamp("FOR LIFE", W * .44, H * .62, (lt - d * .6) / .25, "#2fae6a", .05); });

  KZ.shot("lbQuote", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .33); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -330, 780, 680, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -340, 780, 680, 34); g.fill();
    g.fillStyle = "#2f8a48"; g.beginPath(); g.roundRect(-390, -340, 780, 120, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 42px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("SUSSEX WILDLIFE TRUST", 0, -280);
    g.fillStyle = "#e5484d"; g.font = '900 130px "Montserrat"'; g.fillText("“", -320, -170);
    const lines = ["Once established,", "the ladybird will", "have that number", "of spots for the", "rest of its life."]; g.font = '800 50px "Montserrat"'; g.fillStyle = "#1b1d3a";
    lines.forEach((l, i) => { const a = sm((lt - .4 - i * .3) / .3); g.globalAlpha = a; g.fillText(l, 0, -160 + i * 66); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 32px "Montserrat"'; g.fillText("Sussex Wildlife Trust, 2024", 0, 250);
    g.restore(); g.setTransform(1, 0, 0, 1, 0, 0); lbAt(W * .74, H * .14, .32, .5 + Math.sin(t * 2) * .1, { t, seed: 6, walk: 1 }); });

  KZ.shot("lbSpecies", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const S = [["2-SPOT", { spots: "two" }], ["7-SPOT", { spots: "seven" }], ["14-SPOT", { spots: "fourteen", base: "#ffd23a", square: true }], ["22-SPOT", { spots: "twentytwo", base: "#ffe03a" }]];
    S.forEach(([nm, o], i) => { const x = W * (.25 + (i % 2) * .38), y = H * (.2 + Math.floor(i / 2) * .24), a = sm((lt - .15 - i * .3) / .3); if (a <= 0) return;
      g.setTransform(1, 0, 0, 1, 0, 0); lbAt(x, y + 30, .58 * easeBack(a), Math.sin(t * .8 + i) * .1, Object.assign({ t: t + i, seed: i }, o)); label(nm, x, y - 150, a); });
    stamp("SPECIES ID", W * .44, H * .64, (lt - d * .62) / .25, "#7a5ce0", -.05); });

  KZ.shot("lb46", (lt, d, t) => { navy(t, true); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = clamp(lt / (d * .7), 0, 1), n = Math.round(46 * sm(p));
    txt(String(n), W * .44, H * .14, 200, "#ffd84d", { w: 900, stroke: 12 }); txt("KINDS IN THE UK", W * .44, H * .225, 48, "#fff", { w: 800 });
    const cols = ["#ec3a2e", "#ffd23a", "#f08a1e", "#1b1724", "#e5484d", "#ffb43a"];
    for (let i = 0; i < 46; i++) { const a = clamp(n - i, 0, 1); if (a <= 0) continue; const cx = 130 + (i % 8) * 108, cy = H * .3 + Math.floor(i / 8) * 112;
      const b = cols[i % 6], spt = b === "#1b1724" ? { spots: "two", spotCol: "#ec3a2e" } : { spots: i % 3 ? "seven" : "two" };
      g.setTransform(1, 0, 0, 1, 0, 0); lbAt(cx, cy, .2 * easeBack(a), Math.sin(t * 2 + i) * .2, Object.assign({ t: t + i, seed: i, base: b, noEyes: true }, spt)); } });

  KZ.shot("lbBird", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-60, -20, k), -170, lerp(1.6, 1.75, k));
    // Grashalm-Blatt als Bühne
    kshape(g, (c) => { c.beginPath(); c.moveTo(-40, -20); c.quadraticCurveTo(80, -70, 260, -40); c.quadraticCurveTo(100, -10, -40, -20); c.closePath(); }, C.leaf, { rim: "rgba(210,255,200,.6)", rw: 4, sw: 6 });
    const warn = .5 + .5 * Math.sin(t * 6); g.save(); g.globalCompositeOperation = "lighter"; glow(110, -110, 160, `rgba(255,60,60,${.25 + .25 * warn * sm((lt - .2) / .3)})`); g.restore();
    lsAt(70, -42, .42, { t, look: -.8, mood: lt > d * .5 ? undefined : "scared" });
    const app = sm(lt / (d * .45)), yk = sm((lt - d * .5) / .3);
    g.save(); g.translate(lerp(-560, -210, app) - yk * 70, 0 - Math.abs(Math.sin(lt * 9)) * 30 * (1 - app)); g.scale(.95, .95); tit(g, { t, yuck: yk }); g.restore();
    label("WARNING", W * .3, H * .14, sm((lt - .2) / .3)); stamp("YUCK!", W * .5, H * .24, (lt - d * .55) / .25, "#2fae6a", .08); });

  function palm(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
    for (let i = 0; i < 4; i++) kshape(g, (c) => { c.beginPath(); c.roundRect(160 + i * 6, -130 + i * 62, 230 - Math.abs(i - 1.3) * 30, 54, 27); }, C.skin, { rim: "rgba(255,240,225,.8)", shadow: "rgba(150,60,40,.22)", rw: 4, sw: 8 });
    kshape(g, ell(0, 0, 260, 180, 0), C.skin, { rim: "rgba(255,240,225,.8)", shadow: "rgba(150,60,40,.22)", rw: 6, sw: 16 });
    g.strokeStyle = "rgba(170,90,70,.35)"; g.lineWidth = 6; g.beginPath(); g.moveTo(-160, -60); g.quadraticCurveTo(0, -20, 160, -90); g.stroke(); g.beginPath(); g.moveTo(-180, 40); g.quadraticCurveTo(-20, 20, 140, 60); g.stroke();
    kshape(g, (c) => { c.beginPath(); c.roundRect(-160, -250, 70, 200, 35); }, C.skin, { rim: "rgba(255,240,225,.8)", shadow: "rgba(150,60,40,.22)", rw: 4, sw: 8 });
    g.fillStyle = C.coat; g.fillRect(-600, -150, 360, 300); g.restore(); }
  KZ.shot("lbBleed", (lt, d, t) => { const k = sm(lt / d); lawn(t, 0, -300, 1.0);
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(20,40,60,.35)"; g.fillRect(0, 0, W, H);
    cam(lerp(-20, 30, k), -40, lerp(1.25, 1.45, k));
    palm(-40, 60, 1.25);
    lsAt(-10, -10, .75, { t, bleed: sm((lt - .3) / (d * .6)), mood: "scared", look: .4 });
    stamp("EWW!", W * .5, H * .17, (lt - d * .55) / .25, "#e0a21e", -.08); label("YELLOW GOO", W * .5, H * .62, sm((lt - .5) / .3)); });

  KZ.shot("lbWindow", (lt, d, t) => { const k = sm(lt / d); const [cx, cy] = room(t, lerp(260, 200, k), -560, lerp(1.25, 1.1, k), true);
    const n = Math.min(9, Math.floor(lt / (d * .6) * 9) + 1);
    cluster(cx - 40, cy - 30, t, n, 1);
    at(rudi, -110, 0, .95, { t, mouth: "o", look: .7, arm: 1.7 });
    for (let i = 0; i < 3; i++) { const p = (t * .4 + i / 3) % 1; txt("z", W * (.66 + p * .08), H * (.33 - p * .1), 48 + p * 30, "#fff", { a: (1 - p) * sm(lt / .5), w: 900 }); }
    label("WINTER NAP", W * .44, H * .12, sm((lt - .2) / .3)); });

  KZ.shot("lbVacuum", (lt, d, t) => { const k = sm(lt / d); const [cx, cy] = room(t, lerp(0, 40, k), -460, lerp(1.0, 1.08, k), true);
    cluster(cx - 40, cy - 30, t, 9, 1);
    const r = at(rudi, -290, 0, .95, { t, mouth: lt > d * .5 ? "o" : "grin", look: .6, arm: .5 }); vacuum(-520, 0, .9, [-290 + r.hx * .95, r.hy * .95]);
    cross(W * .63, H * .49, 1.2, (lt - d * .45) / .25); stamp("NOPE", W * .44, H * .13, (lt - d * .55) / .25, "#e5484d", -.08); });

  KZ.shot("lbLogs", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-200, 120, k), -360, lerp(1.2, 1.3, k));
    logs(230, 0, 1.0, t);
    const w = sm(lt / (d * .6)); const rx = lerp(-520, -80, w);
    const r = at(rudi, rx, 0, 1, { t, walk: w > 0 && w < 1, slow: true, mouth: "smile", look: .6, arm: .4 }); const hx = rx + r.hx, hy = r.hy;
    for (let i = 0; i < 4; i++) { const go = sm((lt - d * .6 - i * .15) / .5); const bx = lerp(hx - 10 + i * 18, 230 + i * 50, go), by = lerp(hy - 18 - (i % 2) * 14, -120 - (i % 2) * 110, go) - Math.sin(go * Math.PI) * 120;
      lbAt(bx, by, .16, 1.57 + go * .5, { t: t + i, seed: i, noEyes: true }); }
    stamp("SAFE SPOT", W * .5, H * .15, (lt - d * .65) / .25, "#2fae6a", -.06); });

  KZ.shot("lbAphids", (lt, d, t) => { const k = sm(lt / d);
    g.setTransform(1, 0, 0, 1, 0, 0); const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#5aa8e0"); bg.addColorStop(1, "#2a6a8a"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .2, H * .1, 380, "rgba(255,240,180,.45)"); g.restore();
    cam(lerp(-60, 40, k), lerp(160, -60, k), lerp(1.25, 1.35, k));
    // Stängel diagonal
    g.strokeStyle = "#3f8a3a"; g.lineWidth = 46; g.lineCap = "round"; g.beginPath(); g.moveTo(-360, 900); g.quadraticCurveTo(-40, 200, 160, -560); g.stroke();
    g.strokeStyle = "rgba(200,255,180,.4)"; g.lineWidth = 8; g.beginPath(); g.moveTo(-340, 880); g.quadraticCurveTo(-30, 190, 172, -556); g.stroke();
    kshape(g, (c) => { c.beginPath(); c.moveTo(-60, 300); c.quadraticCurveTo(-300, 180, -380, 300); c.quadraticCurveTo(-220, 400, -60, 300); c.closePath(); }, C.leaf, { rim: "rgba(220,255,200,.6)", rw: 5, sw: 10 });
    // Rosenknospe
    kshape(g, (c) => { c.beginPath(); c.moveTo(160, -560); c.bezierCurveTo(60, -640, 120, -800, 170, -820); c.bezierCurveTo(230, -800, 280, -640, 160, -560); c.closePath(); }, "#ff6b9a", { rim: "rgba(255,220,235,.8)", rw: 5, sw: 10 });
    const pt = (u) => { const a = 1 - u; return [a * a * -360 + 2 * a * u * -40 + u * u * 160, a * a * 900 + 2 * a * u * 200 + u * u * -560]; };
    const lu = lerp(.18, .78, sm(lt / (d * .9)));
    for (let i = 0; i < 10; i++) { const u = .25 + i * .055; if (u < lu + .02) continue; const [ax, ay] = pt(u); aphid(ax + (i % 2 ? 34 : -34), ay, 1.6, t, i); }
    const [lx, ly] = pt(lu), [nx, ny] = pt(lu + .01); lbAt(lx, ly, .6, Math.atan2(ny - ly, nx - lx) + Math.PI / 2, { t, seed: 2, walk: 1, look: 0 });
    stamp("GARDEN HERO", W * .46, H * .14, (lt - d * .6) / .25, "#2fae6a", -.05); });
})();
