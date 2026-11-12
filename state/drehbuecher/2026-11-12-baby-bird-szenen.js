// Szenendatei "Stop Rescuing Baby Birds" (Amsel, Turdus merula: Ästling/Fledgling, Nestling, Eltern). Mix-Stil (Hermann 12.11.2026).
// Quellen: Audubon Magazine 2018 "When You Should—and Should Not—Rescue Baby Birds" (Melanie Furr, Atlanta Audubon:
// "Eighty percent of baby birds that come in have basically just been kidnapped."), RSPB (Ästlinge verlassen das Nest absichtlich vor dem Fliegen,
// "a few days to a week" am Boden, Eltern in der Nähe, bei Gefahr in nahen Busch in Hörweite setzen), RSPCA (Haustiere fernhalten),
// Cornell Lab All About Birds ("It's a myth that parent birds will abandon young that have been touched by humans" / nicht wegen Geruch).
// Helfer txt/stamp/navy/rudi/at/sparkle/cross/check aus worm-cut-half übernommen (Rudi bleibt gleich), Amseln neu gezeichnet:
// Männchen schwarz mit gelb-orangem Schnabel und gelbem Augenring, Weibchen dunkelbraun, Ästling braun mit hellen Tropfenflecken,
// Stummelschwanz, Flaumbüschel, gelbe Schnabelwülste; Nestling rosa, fast nackt, Augen geschlossen, riesiger gelber Sperrrachen.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#3f58b0", "#5a6cc4", "#45509a", "#22285e"], hills: [["#2a6a5a", "#327a66"], ["#22584c", "#2a6858"], ["#1a463e", "#22564a"]], corals: false, rays: false, dust: "255,236,190" };
  const C = { coat: "#f2b233", coatD: "#d38f1e", skin: "#f7c9a2", hat: "#e5484d", jeans: "#2f4a86",
    male: "#23233a", maleL: "rgba(150,170,255,.45)", beak: "#ffb52e", ring: "#ffd84d", fem: "#5a3a2c", femL: "rgba(255,200,160,.35)",
    fl: "#8a5634", flD: "#6a3f26", flL: "rgba(255,210,160,.5)", spot: "#e6b07a", gape: "#ffe14d", leg: "#7a5040",
    pink: "#f6a3a8", pinkL: "rgba(255,225,225,.8)", lawn: "#3f9a5a", lawnT: "#5ab872", hedge: "#24704f", twig: "#8a5a3a", twigD: "#5a3a26",
    path: "#7a7f9e", worm: "#ee7f95" };
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
  function wiggleWorm(c, x, y, s, t) { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = C.worm; c.lineWidth = 9; c.lineCap = "round"; c.beginPath(); for (let i = 0; i <= 10; i++) { const u = i / 10; c.lineTo(u * 60, Math.sin(u * 8 + t * 9) * 7 * u); } c.stroke(); c.restore(); }

  // ================= Amseln (Seitenansicht, Kopf nach rechts, Füße bei y=0) =================
  function legs(c, xs, h, col, w) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; for (const x of xs) { c.beginPath(); c.moveTo(x, -h); c.lineTo(x - 4, -4); c.lineTo(x + 22, 0); c.moveTo(x - 4, -4); c.lineTo(x - 18, 2); c.stroke(); } }
  // Erwachsene Amsel. o: kind "male"|"female", t, beakOpen, food, hop, look, tilt
  function adult(c, o) { const t = o.t || 0, m = o.kind !== "female", body = m ? C.male : C.fem, rim = m ? C.maleL : C.femL;
    const hop = o.hop ? Math.abs(Math.sin(t * 7)) * 26 : 0, br = Math.sin(t * 2.4) * 2.5;
    c.save(); c.translate(0, -hop); legs(c, [-6, 24], 70, m ? "#4a3a3a" : "#4a3020", 8);
    c.translate(0, br * .3); c.rotate(o.tilt || 0);
    // langer Schwanz
    kshape(c, (c) => { c.beginPath(); c.moveTo(-90, -120); c.lineTo(-250, -70 + Math.sin(t * 3) * 6); c.lineTo(-240, -40 + Math.sin(t * 3) * 6); c.lineTo(-70, -78); c.closePath(); }, body, { rim, rw: 5, sw: 10 });
    kshape(c, ell(-10, -115, 118, 66, -.28), body, { rim, rw: 7, sw: 18 });
    if (!m) { c.save(); ell(-10, -115, 118, 66, -.28)(c); c.clip(); c.fillStyle = "rgba(180,120,90,.35)"; for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(30 + (i % 3) * 22, -110 + Math.floor(i / 3) * 22, 6, 9, 0, 0, 7); c.fill(); } c.restore(); }
    kshape(c, ell(92, -178, 54, 50, 0), body, { rim, rw: 6, sw: 12 });
    // Flügel
    c.save(); c.translate(-40, -135); c.rotate(-.18 + Math.sin(t * 2) * .03 - (o.flap ? Math.abs(Math.sin(t * 16)) * .9 : 0));
    kshape(c, (c) => { c.beginPath(); c.moveTo(40, -20); c.quadraticCurveTo(-40, -44, -150, 18); c.quadraticCurveTo(-50, 46, 50, 22); c.closePath(); }, m ? "#191928" : "#4a2e22", { rim, rw: 4, sw: 8 }); c.restore();
    // Schnabel
    const op = (o.beakOpen || 0) * .32; c.fillStyle = m ? C.beak : "#a5743a";
    c.save(); c.translate(136, -184); c.rotate(-op); c.beginPath(); c.moveTo(-6, -12); c.quadraticCurveTo(34, -8, 58, 4); c.lineTo(-6, 4); c.fill(); c.restore();
    c.save(); c.translate(136, -180); c.rotate(op); c.beginPath(); c.moveTo(-6, 0); c.lineTo(50, 6); c.lineTo(-6, 14); c.fill(); c.restore();
    if (o.food) wiggleWorm(c, 168, -180, .9, t);
    if (m) { c.fillStyle = C.ring; c.beginPath(); c.arc(110, -190, 19, 0, 7); c.fill(); }
    fig.eye(c, 110, -190, 15, { t, seed: m ? 5 : 7, look: o.look ?? .6 });
    c.restore(); }
  // Ästling (Fledgling): rundlich, braun, Tropfenflecken, Stummelschwanz, Flaum, gelbe Schnabelwülste
  function fledgling(c, o) { const t = o.t || 0, hop = o.hop ? Math.max(0, Math.sin(t * 6)) * 40 : 0, br = 1 + Math.sin(t * 2.6) * .025;
    c.save(); c.translate(0, -hop); legs(c, [-14, 18], 46, "#9a6a50", 9); c.scale(br, 1 / br);
    kshape(c, (c) => { c.beginPath(); c.moveTo(-80, -86); c.lineTo(-138, -64); c.lineTo(-130, -46); c.lineTo(-70, -54); c.closePath(); }, C.flD, { rim: C.flL, rw: 4, sw: 8 });
    kshape(c, ell(-5, -92, 92, 74, -.12), C.fl, { rim: C.flL, rw: 7, sw: 16 });
    // helle Brust mit Tropfen
    c.save(); ell(-5, -92, 92, 74, -.12)(c); c.clip(); c.fillStyle = "#c68a56"; c.beginPath(); c.ellipse(52, -70, 62, 58, -.3, 0, 7); c.fill();
    c.fillStyle = C.spot; for (let i = 0; i < 14; i++) { const x = 18 + (i % 4) * 22 + (Math.floor(i / 4) % 2) * 10, y = -110 + Math.floor(i / 4) * 24; c.beginPath(); c.ellipse(x, y, 6, 8, .2, 0, 7); c.fill(); } c.restore();
    // Flügel mit hellen Säumen, schlägt manchmal
    const fl = (o.flap ? Math.abs(Math.sin(t * 15)) : 0) * .9;
    c.save(); c.translate(-30, -108); c.rotate(-.12 - fl);
    kshape(c, (c) => { c.beginPath(); c.moveTo(30, -18); c.quadraticCurveTo(-40, -34, -104, 12); c.quadraticCurveTo(-30, 36, 36, 18); c.closePath(); }, C.flD, { rim: C.flL, rw: 4, sw: 8 });
    c.strokeStyle = "rgba(240,190,130,.75)"; c.lineWidth = 4; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-10 - i * 26, -10 + i * 6); c.lineTo(-24 - i * 26, 14 + i * 2); c.stroke(); } c.restore();
    // Kopf
    kshape(c, ell(66, -158, 56, 52, 0), C.fl, { rim: C.flL, rw: 6, sw: 12 });
    // Flaumbüschel
    c.strokeStyle = "rgba(225,215,205,.9)"; c.lineWidth = 4; c.lineCap = "round"; for (let i = 0; i < 5; i++) { const a = -2.3 + i * .32, x0 = 66 + Math.cos(a) * 50, y0 = -158 + Math.sin(a) * 48; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(x0 + Math.cos(a) * 14 + Math.sin(t * 3 + i) * 4, y0 + Math.sin(a) * 14, x0 + Math.cos(a) * 24, y0 + Math.sin(a) * 26); c.stroke(); }
    // Schnabel mit gelben Wülsten
    const op = (o.gape || 0) * .55; c.fillStyle = "#3a2a22";
    c.save(); c.translate(112, -160); c.rotate(-op); c.beginPath(); c.moveTo(-4, -10); c.quadraticCurveTo(22, -6, 36, 4); c.lineTo(-4, 4); c.fill(); c.restore();
    c.save(); c.translate(112, -156); c.rotate(op); c.beginPath(); c.moveTo(-4, 0); c.lineTo(30, 4); c.lineTo(-4, 12); c.fill(); c.restore();
    if (op > .05) { c.fillStyle = "#ff9a3c"; c.beginPath(); c.moveTo(110, -158); c.lineTo(110 + 30 * Math.cos(-op), -158 + 30 * Math.sin(-op)); c.lineTo(110 + 26 * Math.cos(op), -156 + 26 * Math.sin(op)); c.fill(); }
    c.fillStyle = C.gape; c.beginPath(); c.ellipse(108, -156, 9, 7, 0, 0, 7); c.fill();
    fig.eye(c, 80, -170, 19, { t, seed: o.seed ?? 2, look: o.look ?? .4, mood: o.mood, lid: C.fl });
    c.restore(); }
  // Nestling: rosa, nackt, Augen zu, großer gelber Rachen nach oben
  function nestling(c, o) { const t = o.t || 0, beg = o.beg ? .5 + .5 * Math.sin(t * 10) : 0;
    c.save(); kshape(c, ell(0, -50, 62, 46, -.1), C.pink, { rim: C.pinkL, rw: 5, sw: 10 });
    c.fillStyle = "#e88a92"; c.beginPath(); c.ellipse(-20, -56, 26, 14, -.4, 0, 7); c.fill(); // Flügelstummel
    c.save(); c.translate(42, -88); c.rotate(-.5 - beg * .3);
    kshape(c, ell(0, 0, 40, 34, 0), C.pink, { rim: C.pinkL, rw: 4, sw: 8 });
    c.fillStyle = "#7a7aa0"; c.beginPath(); c.ellipse(6, -8, 14, 11, 0, 0, 7); c.fill(); c.strokeStyle = "#4a4a6a"; c.lineWidth = 3; c.beginPath(); c.moveTo(-4, -8); c.lineTo(16, -8); c.stroke();
    const op = .25 + beg * .5; c.fillStyle = C.gape; c.beginPath(); c.moveTo(28, 4); c.lineTo(28 + 54 * Math.cos(-op), 4 + 54 * Math.sin(-op)); c.lineTo(28 + 50 * Math.cos(op * .6), 8 + 50 * Math.sin(op * .6)); c.closePath(); c.fill();
    c.fillStyle = "#ff9a3c"; c.beginPath(); c.moveTo(34, 5); c.lineTo(34 + 40 * Math.cos(-op * .7), 5 + 40 * Math.sin(-op * .7)); c.lineTo(34 + 36 * Math.cos(op * .4), 8 + 36 * Math.sin(op * .4)); c.closePath(); c.fill();
    c.strokeStyle = "rgba(200,200,215,.9)"; c.lineWidth = 3; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-14 + i * 10, -30); c.lineTo(-20 + i * 12 + Math.sin(t * 3 + i) * 3, -50); c.stroke(); }
    c.restore(); c.restore(); }
  function nest(c, x, y, s, front) { c.save(); c.translate(x, y); c.scale(s, s);
    if (!front) kshape(c, (c) => { c.beginPath(); c.ellipse(0, 0, 150, 40, 0, Math.PI, 0); c.ellipse(0, 0, 150, 80, 0, 0, Math.PI); c.closePath(); }, C.twigD, { rw: 4, sw: 10 });
    else { kshape(c, (c) => { c.beginPath(); c.moveTo(-150, 0); c.quadraticCurveTo(0, 30, 150, 0); c.ellipse(0, 0, 150, 80, 0, 0, Math.PI); c.closePath(); }, C.twig, { rim: "rgba(255,220,170,.5)", rw: 5, sw: 12 });
      c.strokeStyle = "rgba(60,35,20,.55)"; c.lineWidth = 5; c.lineCap = "round"; for (let i = 0; i < 12; i++) { const x0 = -140 + i * 24; c.beginPath(); c.moveTo(x0, 10 + (i % 3) * 14); c.lineTo(x0 + 50, 26 + ((i + 1) % 3) * 14); c.stroke(); } }
    c.restore(); }

  // ---------- Garten (Rasen ab y=0, Hecke hinten) ----------
  function lawn(t, cx, cy, z, o) { o = o || {};
    reef(t, cx * .3, 0, 1, PAL);
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.globalCompositeOperation = "lighter"; glow(W * .22, H * .1, 360, "rgba(255,230,160,.35)"); g.restore();
    g.fillStyle = "#fff1c4"; g.beginPath(); g.arc(W * .22, H * .1, 60, 0, 7); g.fill();
    cam(cx, cy, z);
    // Hecke
    for (let i = 0; i < 12; i++) { const x = -2400 + i * 420, s = .9 + (i % 3) * .18; kshape(g, (c) => { c.beginPath(); c.ellipse(x, -40, 200 * s, 190 * s, 0, Math.PI, 0); c.ellipse(x + 150 * s, -30, 150 * s, 140 * s, 0, Math.PI, 0); c.closePath(); }, C.hedge, { rim: "rgba(170,255,210,.3)", rw: 6, sw: 14 }); }
    g.fillStyle = "rgba(255,200,220,.5)"; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(-2300 + (i * 233) % 4600, -60 - (i * 71) % 260, 7, 0, 7); g.fill(); }
    if (o.path) { g.fillStyle = C.path; g.fillRect(-3000, -10, 2600 + o.path, 3000); g.fillStyle = "rgba(255,255,255,.5)"; for (let i = 0; i < 8; i++) g.fillRect(-2900 + i * 320, 90, 160, 14); }
    const sg = g.createLinearGradient(0, -20, 0, 1200); sg.addColorStop(0, C.lawn); sg.addColorStop(1, "#1d5a3a"); g.fillStyle = sg; g.fillRect(o.path ? -400 + o.path : -3000, -20, 6000, 3000);
    g.strokeStyle = C.lawnT; g.lineWidth = 6; g.lineCap = "round"; for (let i = 0; i < 260; i++) { const x = -2600 + (i * 37) % 5200 + (i % 7) * 3, y = -14 + Math.floor(i / 140) * 60 + (i % 5) * 12, h = 18 + (i % 4) * 8; if (o.path && x < -400 + o.path) continue; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(t * 1.3 + i) * 4, y - h); g.stroke(); }
    g.fillStyle = "#fff"; for (let i = 0; i < 10; i++) { const x = -1800 + i * 397, y = 40 + (i % 3) * 70; if (o.path && x < -400 + o.path) continue; for (let p = 0; p < 5; p++) { const a = p / 5 * 6.283; g.beginPath(); g.arc(x + Math.cos(a) * 9, y + Math.sin(a) * 9, 7, 0, 7); g.fill(); } g.fillStyle = "#ffd84d"; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); g.fillStyle = "#fff"; }
  }

  // ---------- Rudi (eigene Menschenfigur): Füße bei y=0, Höhe ~540, schaut nach rechts ----------
  function rudi(c, o) { const t = o.t || 0, br = Math.sin(t * 2.2) * 4, arm = o.arm ?? 0;
    c.save();
    const step = o.walk ? Math.sin(t * 8) * 18 : 0;
    c.strokeStyle = C.jeans; c.lineWidth = 30; c.lineCap = "round"; for (const [x, s] of [[-26, 1], [26, -1]]) { c.beginPath(); c.moveTo(x, -130); c.lineTo(x + 4 + step * s, -16); c.stroke(); }
    c.fillStyle = "#2a2233"; for (const [x, s] of [[-26, 1], [26, -1]]) { c.beginPath(); c.ellipse(x + 16 + step * s, -8, 30, 13, 0, 0, 7); c.fill(); }
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
    if (o.reach != null) { hx = lerp(150, 230, o.reach); hy = lerp(-260, -40, o.reach); }
    if (o.hold === "bird") { hx = 150; hy = -300 + br; }
    c.strokeStyle = C.coat; c.lineWidth = 30; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2 + 20, (sy + hy) / 2 + 20, hx, hy); c.stroke();
    if (o.hold === "bird") { c.save(); c.translate(hx + 6, hy - 6); c.scale(.42, .42); fledgling(c, { t, look: -.4, mood: "scared" }); c.restore(); }
    c.fillStyle = C.skin; c.beginPath(); c.ellipse(hx, hy + (o.hold === "bird" ? 6 : 0), o.hold === "bird" ? 38 : 20, o.hold === "bird" ? 18 : 20, 0, 0, 7); c.fill();
    c.restore(); return { hx, hy }; }
  function at(fn, x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); const r = fn(g, o); g.restore(); return r; }
  // große Hand (Ärmel gelb) in Weltkoordinaten, Finger zeigen nach rechts unten
  function bigHand(x, y, rot, s) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    g.strokeStyle = C.coat; g.lineWidth = 90; g.lineCap = "round"; g.beginPath(); g.moveTo(-420, -10); g.lineTo(-70, 0); g.stroke();
    g.fillStyle = C.coatD; g.beginPath(); g.roundRect(-120, -50, 40, 100, 14); g.fill();
    kshape(g, ell(10, 0, 74, 54, 0), C.skin, { rim: "rgba(255,240,225,.8)", shadow: "rgba(150,60,40,.22)", rw: 5, sw: 12 });
    g.fillStyle = C.skin; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(84, -30 + i * 20, 40, 11, .15, 0, 7); g.fill(); }
    g.beginPath(); g.ellipse(30, -54, 34, 13, -.6, 0, 7); g.fill(); g.restore(); }

  // ================= Shots =================
  // Hook: Nahaufnahme Ästling im Gras, große Hand kommt von links oben; Ende = Loop-Bild
  function hookShot(lt, d, t, loop) { const k = sm(lt / d); lawn(t, lerp(-10, 10, k), -110, loop ? lerp(1.75, 1.85, k) : lerp(1.85, 2.0, k));
    fledgling(g, { t, look: -.5, mood: "scared", seed: 1 });
    const p = loop ? .35 : sm(lt / (d * .5)); bigHand(lerp(-420, -200, p), lerp(-420, -250, p), .5, 1);
    if (!loop && lt > d * .55) stamp("STOP!", W * .44, H * .6, (lt - d * .55) / .3, "#e5484d"); }
  KZ.shot("bHook", (lt, d, t) => hookShot(lt, d, t, false));
  KZ.shot("bLoop", (lt, d, t) => { const k = sm(lt / d);
    if (lt < d * .5) { lawn(t, lerp(-40, 0, k), -150, 1.0); const r = sm(lt / (d * .45)); at(rudi, -230, 0, .9, { t, reach: r, mouth: "smile", look: .6 }); at(fledgling, 160, 0, .8, { t, look: -.5 }); }
    else hookShot(lt - d * .5, d * .5, t, true); });

  KZ.shot("bScoop", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-40, -10, k), lerp(-200, -180, k), lerp(1.3, 1.4, k));
    const up = sm((lt - d * .3) / (d * .25));
    if (up < .5) { at(rudi, -200, 0, .9, { t, reach: sm(lt / (d * .3)), mouth: "o", look: .7 }); at(fledgling, 170, 0, .8, { t, look: -.5 }); }
    else at(rudi, -200, 0, .9, { t, hold: "bird", mouth: "grin", look: .3 });
    txt("NO PARENTS?", W * .5, H * .13, 60, "#fff", { a: sm(lt / .3) * (1 - sm((lt - d * .45) / .2)), stroke: 9, w: 900 });
    if (lt > d * .6) { stamp("HERO", W * .56, H * .17, (lt - d * .6) / .3, "#f2b233", .07); for (let i = 0; i < 4; i++) sparkle(W * (.3 + i * .14), H * .26 + Math.sin(t * 4 + i) * 10, 18, sm((lt - d * .6) / .3)); } });

  KZ.shot("bFeathers", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-30, 10, k), -110, lerp(2.0, 2.3, k));
    fledgling(g, { t, hop: lt > d * .55, look: .3, seed: 4 });
    // Lupe
    g.setTransform(1, 0, 0, 1, 0, 0); const a = sm(lt / .3); g.save(); g.globalAlpha = a * .9; g.strokeStyle = "#fff"; g.lineWidth = 10; g.setLineDash([26, 16]); g.lineDashOffset = -t * 40; g.beginPath(); g.arc(W * .5, H * .4, 330, 0, 7); g.stroke(); g.restore();
    label("FEATHERS", W * .3, H * .17, sm((lt - .5) / .3)); check(W * .3 + 190, H * .17, .45, (lt - .7) / .3);
    label("HOPS", W * .3, H * .58, sm((lt - d * .55) / .3)); check(W * .3 + 130, H * .58, .45, (lt - d * .6) / .3); });

  // Infografik 1: Lebensstufen
  function egg(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); kshape(c, ell(0, 0, 44, 58, 0), "#7fc8c0", { rim: "rgba(230,255,250,.8)", rw: 4, sw: 8 }); c.fillStyle = "#6a5040"; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(-24 + (i * 17) % 48, -30 + (i * 23) % 64, 3 + i % 2 * 2, 0, 7); c.fill(); } c.restore(); }
  KZ.shot("bStages", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    const P = [[W * .25, H * .2], [W * .63, H * .2], [W * .25, H * .43], [W * .63, H * .43]], names = ["EGG", "NESTLING", "FLEDGLING", "FLYING"];
    const ap = (i) => sm((lt - .1 - i * .35) / .3);
    g.save(); g.strokeStyle = "rgba(255,255,255,.4)"; g.lineWidth = 8; g.setLineDash([18, 14]); g.lineDashOffset = -t * 30; g.beginPath(); g.moveTo(P[0][0] + 100, P[0][1]); g.lineTo(P[1][0] - 110, P[1][1]); g.moveTo(P[1][0], P[1][1] + 110); g.lineTo(P[2][0] + 120, P[2][1] - 90); g.moveTo(P[2][0] + 130, P[2][1]); g.lineTo(P[3][0] - 110, P[3][1]); g.stroke(); g.restore();
    const hi = sm((lt - 1.4) / .3);
    if (hi > 0) { g.save(); g.globalCompositeOperation = "lighter"; glow(P[2][0], P[2][1] - 30, 240 * hi, "rgba(255,216,77,.35)"); g.restore(); }
    for (let i = 0; i < 4; i++) { const a = ap(i); if (a <= 0) continue; const [x, y] = P[i]; g.save(); g.globalAlpha = a; g.translate(x, y + 40); const s = (i === 2 ? .85 + hi * .25 : .7) * easeBack(a);
      if (i === 0) egg(g, 0, -60, s * 1.2); else if (i === 1) { g.scale(s * 1.1, s * 1.1); nest(g, 0, 0, .7, false); nestling(g, { t, beg: 1 }); nest(g, 0, 0, .7, true); }
      else if (i === 2) { g.scale(s, s); fledgling(g, { t, flap: lt > 2, seed: 6 }); } else { g.translate(0, -60 + Math.sin(t * 3) * 10); g.scale(s * .75, s * .75); adult(g, { t, flap: true, kind: "male" }); }
      g.restore(); txt(names[i], x, y + 110, i === 2 ? 52 : 44, i === 2 ? "#ffd84d" : "#fff", { a, stroke: 8, w: 900 }); }
    if (lt > d * .55) stamp("ON PURPOSE", W * .44, H * .57, (lt - d * .55) / .3, "#2fae6a", -.05); });

  KZ.shot("bSchool", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-80, 60, k), -130, 1.45);
    const x = lerp(-180, 120, k); at(fledgling, x, 0, 1, { t, hop: true, flap: Math.sin(t * 2) > .3, look: .2, seed: 8 });
    // Tage-Leiste
    g.setTransform(1, 0, 0, 1, 0, 0); const n = Math.min(7, 1 + Math.floor(sm(lt / (d * .85)) * 7)); const bx = W * .1, by = H * .1, cw = 96;
    for (let i = 0; i < 7; i++) { g.fillStyle = i < n ? "#ffd84d" : "rgba(255,255,255,.22)"; g.beginPath(); g.roundRect(bx + i * (cw + 12), by, cw, 40, 12); g.fill(); }
    txt("DAY " + n, W * .44, by + 100, 60, "#fff", { stroke: 9, w: 900 });
    if (lt > d * .55) stamp("TRAINING", W * .44, H * .27, (lt - d * .55) / .3, "#7b5cff", .05); });

  KZ.shot("bParents", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-60, 60, k), -170, lerp(1.0, 1.1, k));
    // Eltern in der Hecke (lugen hervor)
    const peek = sm((lt - .3) / .5); g.save(); g.translate(170, -60 - peek * 50); g.scale(-.8, .8); adult(g, { t, kind: "male", look: .8 }); g.restore();
    g.save(); g.translate(330, -40 - peek * 40); g.scale(-.75, .75); adult(g, { t: t + 1, kind: "female", look: .8 }); g.restore();
    // Heckenblätter davor
    for (let i = 0; i < 6; i++) kshape(g, ell(110 + i * 60, -40 - (i % 2) * 40, 70, 46, .3), C.hedge, { rim: "rgba(170,255,210,.3)", rw: 4, sw: 8 });
    at(fledgling, -60, 0, .65, { t, look: .7 });
    at(rudi, -360, 0, .9, { t, mouth: "hmm", look: -.2, arm: .2 });
    label("DAD", W * .56, H * .25, sm((lt - .8) / .3)); label("MOM", W * .76, H * .3, sm((lt - 1.1) / .3));
    if (lt > d * .6) stamp("WAITING...", W * .4, H * .27, (lt - d * .6) / .3, "#e5484d", -.06); });

  KZ.shot("bFeed", (lt, d, t) => { lawn(t, lerp(-10, 10, sm(lt / d)), -150, lerp(1.35, 1.45, sm(lt / d)));
    const cyc = (lt % 1.6) / 1.6, n = Math.floor(lt / 1.6) + 1, near = cyc < .5 ? sm(cyc / .3) : 1 - sm((cyc - .65) / .3);
    at(fledgling, -230, 0, .9, { t, gape: near, look: .5, flap: near > .6 });
    g.save(); g.translate(lerp(260, -10, near), 0); g.scale(-.85, .85); adult(g, { t, kind: "male", food: near < .9, hop: near < .95 && near > .05, look: .5 }); g.restore();
    if (near > .9) for (let i = 0; i < 3; i++) heart(g, -160 + i * 40, -260 - ((t * 60 + i * 30) % 80), 2.2, "#ff6b8a");
    label("FEEDING #" + n, W * .44, H * .14, sm(lt / .3)); });

  // Quellenkarte + 80 %-Balken (Infografik 2)
  KZ.shot("bQuote", (lt, d, t) => { navy(t, 1); zoomScreen(lerp(1, 1.04, sm(lt / d)));
    const p = easeBack(clamp(lt / .45, 0, 1)); g.save(); g.translate(W * .44, H * .27); g.scale(p, p); g.rotate(-.02);
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-382, -270, 780, 560, 34); g.fill(); g.fillStyle = "#f7f4ec"; g.beginPath(); g.roundRect(-390, -280, 780, 560, 34); g.fill();
    g.fillStyle = "#232a6b"; g.beginPath(); g.roundRect(-390, -280, 780, 110, [34, 34, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 46px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("AUDUBON", 0, -225);
    g.fillStyle = "#e5484d"; g.font = '900 130px "Montserrat"'; g.fillText("“", -320, -110);
    const lines = ["Eighty percent of", "baby birds that come", "in have basically just", "been kidnapped."]; g.font = '800 50px "Montserrat"'; g.fillStyle = "#1b1d3a";
    lines.forEach((l, i) => { const a = sm((lt - .4 - i * .3) / .3); g.globalAlpha = a; g.fillText(l, 0, -100 + i * 66); }); g.globalAlpha = 1;
    g.fillStyle = "#6a6f9a"; g.font = '700 32px "Montserrat"'; g.fillText("Melanie Furr, Atlanta Audubon, 2018", 0, 210); g.restore();
    // 10 Vögel, 8 davon "entführt"
    g.setTransform(1, 0, 0, 1, 0, 0); const q = sm((lt - d * .45) / (d * .35));
    for (let i = 0; i < 10; i++) { const x = W * .1 + (i % 5) * 150, y = H * .5 + Math.floor(i / 5) * 140, a = sm((lt - 1 - i * .08) / .25); if (a <= 0) continue;
      g.save(); g.globalAlpha = a; g.translate(x + 30, y + 50); g.scale(.4, .4); fledgling(g, { t: t + i, seed: i }); g.restore();
      if (i < 8 && q * 8 > i) { g.save(); g.strokeStyle = "#e5484d"; g.lineWidth = 8; g.beginPath(); g.roundRect(x - 40, y - 40, 130, 110, 18); g.stroke(); g.restore(); } }
    if (lt > d * .8) stamp("80%", W * .82, H * .47, (lt - d * .8) / .25, "#e5484d", .1); });

  KZ.shot("bRule", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-60, -100, k), -200, lerp(1.15, 1.25, k));
    at(rudi, -300, 0, .95, { t, arm: 1.5 + .5 * sm(lt / .5), mouth: "hmm", look: .4 });
    // Gedankenblase
    const b = easeBack(clamp((lt - .2) / .4, 0, 1)); g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.translate(W * .6, H * .13); g.scale(b, b);
    g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.ellipse(0, 0, 250, 170, 0, 0, 7); g.fill(); g.beginPath(); g.arc(-190, 170, 30, 0, 7); g.fill(); g.beginPath(); g.arc(-240, 230, 16, 0, 7); g.fill();
    const turn = sm((lt - d * .45) / .4);
    g.save(); g.translate(-70, 80); g.scale(.55, .55); fledgling(g, { t, look: .8, mood: turn > .5 ? "scared" : undefined }); g.restore();
    g.save(); g.translate(110, 80); g.scale(lerp(-.55, .55, turn), .55); adult(g, { t, kind: "female", look: .6 }); g.restore();
    if (lt < d * .45) { g.save(); g.translate(-160, -60); g.scale(.4, .4); g.rotate(.5); g.fillStyle = C.skin; g.beginPath(); g.ellipse(0, 0, 74, 54, 0, 0, 7); g.fill(); for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(84, -30 + i * 20, 40, 11, .15, 0, 7); g.fill(); } g.restore(); }
    g.restore();
    if (lt > d * .55) stamp("REJECTED?", W * .5, H * .39, (lt - d * .55) / .3, "#7b5cff", .05); });

  // Infografik 3: Geruch
  KZ.shot("bSmell", (lt, d, t) => { navy(t); zoomScreen(lerp(1, 1.05, sm(lt / d)));
    stamp("MYTH", W * .44, H * .11, lt / .35, "#e5484d", -.06);
    // Hand mit Geruchswellen -> Vogel
    g.save(); g.translate(W * .2, H * .32); g.fillStyle = C.skin; g.beginPath(); g.ellipse(0, 0, 74, 54, 0, 0, 7); g.fill(); for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(84, -30 + i * 20, 40, 11, .15, 0, 7); g.fill(); } g.restore();
    g.save(); g.strokeStyle = "rgba(200,255,160,.8)"; g.lineWidth = 8; g.lineCap = "round"; for (let i = 0; i < 3; i++) { const ph = (t * 1.2 + i / 3) % 1; g.globalAlpha = 1 - ph; g.beginPath(); g.moveTo(W * .32 + ph * 160, H * .29 + i * 30); g.bezierCurveTo(W * .36 + ph * 160, H * .27 + i * 30, W * .4 + ph * 160, H * .31 + i * 30, W * .44 + ph * 160, H * .29 + i * 30); g.stroke(); } g.restore();
    txt("YOUR SMELL", W * .38, H * .21, 48, "#c8ffa0", { a: sm((lt - .3) / .3), stroke: 8, w: 900 });
    cross(W * .48, H * .31, .9, (lt - 1.0) / .3);
    // Eltern bleiben beim Küken
    g.save(); g.translate(W * .32, H * .56); g.scale(.75, .75); fledgling(g, { t, look: .6 }); g.restore();
    g.save(); g.translate(W * .62, H * .56); g.scale(-.7, .7); adult(g, { t, kind: "male", look: .7, food: true }); g.restore();
    const hp = sm((lt - d * .5) / .3); for (let i = 0; i < 3; i++) if (hp > 0) heart(g, W * (.38 + i * .08), H * .4 - Math.sin(t * 3 + i) * 10, 3 * hp, "#ff6b8a");
    txt("THEY STAY", W * .44, H * .62, 52, "#7ef0b0", { a: hp, stroke: 8, w: 900 }); });

  KZ.shot("bAsk", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-60, -100, k), -260, lerp(1.25, 1.4, k));
    at(rudi, -160, 0, .95, { t, arm: 1.5 + .5 * sm(lt / .5), mouth: "o", look: .3 });
    const a = easeBack(clamp((lt - .1) / .4, 0, 1)); txt("?", W * .66, H * .28, 220 * a + 1, "#ffd84d", { stroke: 14, w: 900 });
    if (lt > d * .3) stamp("WHAT NOW?", W * .44, H * .12, (lt - d * .3) / .3, "#7b5cff", -.05); });

  function catIcon(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#f29a4a"; g.beginPath(); g.moveTo(-60, -20); g.lineTo(-50, -90); g.lineTo(-10, -50); g.lineTo(10, -50); g.lineTo(50, -90); g.lineTo(60, -20); g.closePath(); g.fill(); kshape(g, ell(0, 0, 70, 58, 0), "#f29a4a", { rim: "rgba(255,230,200,.6)", rw: 4, sw: 8 });
    fig.eye(g, -24, -6, 13, { t: 0 }); fig.eye(g, 24, -6, 13, { t: 0 }); g.fillStyle = "#c2412f"; g.beginPath(); g.moveTo(-8, 16); g.lineTo(8, 16); g.lineTo(0, 26); g.fill(); g.restore(); }
  function dogIcon(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#8a5a3a"; g.beginPath(); g.ellipse(-66, 0, 24, 56, .3, 0, 7); g.ellipse(66, 0, 24, 56, -.3, 0, 7); g.fill(); kshape(g, ell(0, 0, 66, 62, 0), "#d9a066", { rim: "rgba(255,230,200,.6)", rw: 4, sw: 8 });
    g.fillStyle = "#f3d3a8"; g.beginPath(); g.ellipse(0, 26, 34, 24, 0, 0, 7); g.fill(); fig.eye(g, -24, -12, 13, { t: 0 }); fig.eye(g, 24, -12, 13, { t: 0 }); g.fillStyle = "#2a1a1a"; g.beginPath(); g.ellipse(0, 16, 12, 9, 0, 0, 7); g.fill(); g.restore(); }
  KZ.shot("bLeave", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-40, 0, k), -150, 1.05);
    at(fledgling, 180, 0, .8, { t, look: .3, hop: lt > d * .6 });
    at(rudi, lerp(-150, -420, k), 0, .9, { t, walk: true, mouth: "smile", look: .5 }, true);
    g.setTransform(1, 0, 0, 1, 0, 0); const a1 = sm((lt - .5) / .3), a2 = sm((lt - .9) / .3);
    if (a1 > 0) catIcon(W * .3, H * .14, 1.3 * easeBack(a1)); if (a2 > 0) dogIcon(W * .6, H * .14, 1.3 * easeBack(a2));
    cross(W * .3, H * .14, 1.2, (lt - .8) / .3); cross(W * .6, H * .14, 1.2, (lt - 1.2) / .3);
    if (lt > d * .55) stamp("HANDS OFF", W * .44, H * .3, (lt - d * .55) / .3, "#2fae6a", .05); });

  KZ.shot("bBush", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-20, 30, k), -140, 1.25, { path: 0 });
    // Hand trägt den Ästling vom Weg in den Busch
    const p = sm((lt - .4) / (d * .45)); const bx = lerp(-260, 220, p), by = lerp(0, -10, p) - Math.sin(p * Math.PI) * 140;
    // Busch rechts
    kshape(g, (c) => { c.beginPath(); c.ellipse(260, 0, 190, 150, 0, Math.PI, 0); c.closePath(); }, "#2f8a5a", { rim: "rgba(170,255,210,.35)", rw: 6, sw: 14 });
    at(fledgling, bx, by, .65, { t, look: .3, mood: p > 0 && p < 1 ? "scared" : undefined });
    if (p > 0 && p < 1) bigHand(bx - 40, by - 70, .3, .55);
    if (p >= 1) for (let i = 0; i < 4; i++) kshape(g, ell(170 + i * 60, -20 - (i % 2) * 24, 50, 34, .2), "#2f8a5a", { rim: "rgba(170,255,210,.35)", rw: 3, sw: 6 });
    // Ruf / Hörweite
    const a = sm((lt - d * .6) / .3); if (a > 0) { g.save(); g.globalAlpha = a; g.strokeStyle = "#ffd84d"; g.lineWidth = 7; g.setLineDash([20, 14]); for (let i = 0; i < 3; i++) { const r = 120 + ((t * 120 + i * 90) % 270); g.globalAlpha = a * (1 - (r - 120) / 270); g.beginPath(); g.arc(220, -60, r, -2.6, -.4); g.stroke(); } g.restore(); }
    txt("PEEP!", W * .62, H * .2, 56, "#ffd84d", { a, stroke: 8, w: 900 });
    label("ROAD", W * .18, H * .12, sm((lt - .1) / .3) * (1 - p)); label("NEARBY BUSH", W * .5, H * .12, sm((lt - d * .45) / .3));
    if (lt > d * .7) stamp("SAFE SPOT", W * .44, H * .3, (lt - d * .7) / .25, "#2fae6a", -.06); });

  KZ.shot("bNest", (lt, d, t) => { const k = sm(lt / d); lawn(t, lerp(-40, 20, k), lerp(-260, -320, k), 1.25);
    // Ast mit Nest
    g.strokeStyle = C.twigD; g.lineWidth = 46; g.lineCap = "round"; g.beginPath(); g.moveTo(-700, -520); g.quadraticCurveTo(-100, -440, 420, -560); g.stroke();
    for (let i = 0; i < 6; i++) kshape(g, ell(-500 + i * 170, -600 - (i % 2) * 40, 90, 50, .4), "#2f8a5a", { rim: "rgba(170,255,210,.3)", rw: 4, sw: 8 });
    nest(g, 120, -500, .9, false);
    const p = sm((lt - .9) / (d * .45)), x = lerp(-180, 120, p), y = lerp(0, -500, p) - Math.sin(p * Math.PI) * 90;
    if (p >= 1) at(nestling, 120, -510, .9, { t, beg: 1 });
    nest(g, 120, -500, .9, true);
    if (p < 1) { at(nestling, x, y, .9, { t, beg: p < .05 }); if (p > 0) bigHand(x - 50, y - 50, .2, .55); }
    label("NO FEATHERS", W * .32, H * .62, sm((lt - .2) / .3) * (1 - sm((lt - 1.2) / .3)));
    if (lt > d * .7) stamp("BACK HOME", W * .44, H * .17, (lt - d * .7) / .25, "#2fae6a", .05); });
})();
