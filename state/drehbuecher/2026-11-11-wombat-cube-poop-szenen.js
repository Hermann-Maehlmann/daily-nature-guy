// Szenendatei "The Animal That Poops Cubes" (Nacktnasenwombat, Vombatus ursinus). Eigene Figuren: Wombat, Kot-Würfel, Felsen, Darm-Querschnitt.
// Quelle: Yang et al., Soft Matter 17 (2021) 475, Georgia Tech / Univ. of Tasmania; BBC 2018 (80-100 Würfel pro Nacht).
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#2b2063", "#3b2b74", "#2a215c", "#150f36"], hills: [["#3a2d5c", "#47386b"], ["#2f2552", "#3a2c60"], ["#241b44", "#2c2152"]], corals: false, rays: false, dust: "255,228,180" };
  const C = { body: "#a07a5c", belly: "#c9a07c", dark: "#6b4c39", far: "#58402f", nose: "#2a1c22", ear: "#8a6249",
    cubeF: "#8f5a33", cubeT: "#c08250", cubeS: "#633b20", rock: "#7a7fa8", rockD: "#5b5f8a", ground: "#3a2c58", groundT: "#4c3b70", gut: "#ff8fa6", stiff: "#d23a63", soft: "#ffb0c4" };
  // Sterne (feste Positionen)
  const stars = Array.from({ length: 70 }, (_, i) => ({ x: (i * 397) % W, y: (i * 211) % (H * .45), r: 1.5 + (i % 3), ph: i }));

  function bg(t, camx) {
    reef(t, camx, 0, 1, PAL);
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.globalCompositeOperation = "lighter";
    for (const s of stars) { g.fillStyle = `rgba(255,250,230,${.35 + .3 * Math.sin(t * 2 + s.ph)})`; g.beginPath(); g.arc(s.x, s.y, s.r, 0, 7); g.fill(); }
    glow(W * .7, H * .09, 260, "rgba(255,240,200,.28)"); g.restore();
    g.fillStyle = "#fff6dc"; g.beginPath(); g.arc(W * .7, H * .09, 62, 0, 7); g.fill();
    g.fillStyle = "rgba(220,205,170,.5)"; g.beginPath(); g.arc(W * .7 - 18, H * .09 + 10, 14, 0, 7); g.arc(W * .7 + 20, H * .09 - 16, 9, 0, 7); g.fill();
  }
  function ground(x0, x1) {
    g.fillStyle = C.ground; g.fillRect(x0, 0, x1 - x0, 3000);
    g.fillStyle = C.groundT; g.fillRect(x0, 0, x1 - x0, 10);
    g.strokeStyle = "#5d4a85"; g.lineWidth = 6; g.lineCap = "round";
    for (let x = Math.ceil(x0 / 90) * 90; x < x1; x += 90) { const h = 18 + (Math.abs(x * 7) % 23); for (const k of [-1, 0, 1]) { g.beginPath(); g.moveTo(x + k * 6, 2); g.lineTo(x + k * 12 + Math.sin(KZ.t * 1.5 + x) * 3, -h + Math.abs(k) * 6); g.stroke(); } }
  }

  // ---------- Wombat: Seitenansicht, Kopf nach rechts, Boden y=0, Länge ~480 ----------
  const GUT = [[205, -98], [150, -92], [118, -150], [66, -176], [12, -150], [30, -102], [84, -76], [40, -52], [-22, -70], [-42, -130], [-92, -172], [-145, -150], [-124, -102], [-80, -72], [-132, -52], [-180, -78], [-212, -108]];
  function gutPt(u) { const n = GUT.length - 1, f = clamp(u, 0, 1) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i; return [lerp(GUT[i][0], GUT[i + 1][0], k), lerp(GUT[i][1], GUT[i + 1][1], k)]; }
  function gutPath(c, u0, u1) { c.beginPath(); const N = 120; for (let j = 0; j <= N; j++) { const p = gutPt(lerp(u0, u1, j / N)); j ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } }
  function wombat(c, o) {
    const t = o.t || 0, wk = (o.walk || 0) * t * 8, br = Math.sin(t * 2.4) * .012;
    c.save(); c.scale(1 + br, 1 - br);
    // Schatten am Boden
    c.save(); c.globalAlpha = .35; c.fillStyle = "#120a26"; c.beginPath(); c.ellipse(10, 4, 230, 18, 0, 0, 7); c.fill(); c.restore();
    // hintere Beine (fern)
    for (const [x, ph] of [[-125, Math.PI + .6], [115, .6]]) fig.legM(c, x, -62, wk + ph, C.far, 42, "#3d2b20");
    const body = ell(-20, -126, 208, 114, -.03);
    kshape(c, body, C.body, { rim: "rgba(255,225,190,.55)", shadow: "rgba(40,10,40,.28)", rw: 7, sw: 22 });
    c.save(); body(c); c.clip();
    c.fillStyle = C.belly; c.beginPath(); c.ellipse(10, -30, 200, 46, 0, 0, 7); c.fill();
    // Fellstriche
    c.strokeStyle = "rgba(90,60,45,.35)"; c.lineWidth = 4; c.lineCap = "round";
    for (let i = 0; i < 14; i++) { const x = -190 + i * 28, y = -170 + (i % 3) * 24; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 10, y + 14); c.stroke(); }
    if (o.cut) { // Röntgen-Schnitt: Darm sichtbar
      c.globalAlpha = o.cut; c.fillStyle = "#3a1d3f"; c.beginPath(); c.ellipse(-20, -122, 186, 88, -.03, 0, 7); c.fill();
      c.lineJoin = "round"; c.lineCap = "round";
      c.strokeStyle = "#b8476a"; c.lineWidth = 30; gutPath(c, 0, 1); c.stroke();
      c.strokeStyle = C.gut; c.lineWidth = 22; gutPath(c, 0, 1); c.stroke();
      c.strokeStyle = "rgba(255,220,230,.7)"; c.lineWidth = 6; c.save(); c.translate(2, -5); gutPath(c, 0, 1); c.stroke(); c.restore();
      if (o.hiEnd) { c.save(); c.globalCompositeOperation = "lighter"; c.strokeStyle = `rgba(255,230,120,${.55 * o.hiEnd})`; c.lineWidth = 40; gutPath(c, .83, 1); c.stroke(); c.restore(); }
      // wandernde Kotstücke: vorne weich/rund, am Ende Würfel
      for (let i = 0; i < 9; i++) { const u = ((t * .07 + i / 9) % 1), p = gutPt(u);
        if (u < .83) { c.fillStyle = "#8a5a35"; c.beginPath(); c.arc(p[0], p[1], 7, 0, 7); c.fill(); }
        else { c.save(); c.translate(p[0], p[1]); c.rotate(.3); c.fillStyle = C.cubeF; c.fillRect(-8, -8, 16, 16); c.fillStyle = C.cubeT; c.fillRect(-8, -8, 16, 4); c.restore(); } }
      c.globalAlpha = 1;
    }
    c.restore();
    // vordere Beine mit Krallen
    for (const [x, ph] of [[-140, 0], [100, Math.PI]]) { fig.legM(c, x, -64, wk + ph, C.dark, 46, "#4a3326");
      const fx = x + Math.sin(Math.sin(wk + ph) * .32) * 64 * .9 + 26; c.fillStyle = "#efe2cf"; for (let k = 0; k < 3; k++) { c.beginPath(); c.ellipse(fx + k * 7, -2, 4, 7, .6, 0, 7); c.fill(); } }
    // Kopf
    c.save(); c.translate(182, -140); c.rotate(o.headTilt || 0); c.scale(1.2, 1.2);
    for (const dx of [-24, 14]) kshape(c, (c) => { c.beginPath(); c.moveTo(-16 + dx, -58); c.quadraticCurveTo(-14 + dx, -92, 8 + dx, -90); c.quadraticCurveTo(22 + dx, -80, 18 + dx, -54); c.closePath(); }, C.ear, { rw: 4, sw: 6, rim: "rgba(255,225,190,.5)" });
    const head = (c) => { c.beginPath(); c.moveTo(-60, -40); c.bezierCurveTo(-30, -82, 60, -84, 92, -40); c.bezierCurveTo(112, -12, 110, 30, 80, 50); c.bezierCurveTo(30, 72, -40, 64, -70, 30); c.closePath(); };
    kshape(c, head, C.body, { rim: "rgba(255,225,190,.6)", shadow: "rgba(40,10,40,.25)", rw: 6, sw: 14 });
    c.fillStyle = C.belly; c.beginPath(); c.ellipse(40, 38, 46, 18, 0, 0, 7); c.fill();
    // breite nackte Nase (Nacktnasenwombat)
    kshape(c, ell(96, 0, 26, 30, .1), C.nose, { rim: "rgba(255,255,255,.35)", rw: 4, sw: 6 });
    c.fillStyle = "#120c12"; c.beginPath(); c.ellipse(108, 10, 6, 9, .2, 0, 7); c.fill();
    c.fillStyle = "rgba(255,255,255,.4)"; c.beginPath(); c.ellipse(100, -16, 9, 5, -.3, 0, 7); c.fill();
    c.strokeStyle = "#3d2a24"; c.lineWidth = 4; c.lineCap = "round"; c.beginPath(); c.moveTo(70, 36); c.quadraticCurveTo(84, 44, 96, 34); c.stroke();
    fig.eye(c, 40, -14, 15, { t, look: o.look ?? .5, seed: 2 });
    c.restore();
    c.restore();
  }
  function wAt(x, y, s, o, flip) { g.save(); g.translate(x, y); g.scale(s * (flip ? -1 : 1), s); wombat(g, o); g.restore(); }

  // ---------- Kot-Würfel (leicht isometrisch), Boden bei y=0 ----------
  function cube(x, y, s, rot, a) {
    g.save(); g.translate(x, y); g.rotate(rot || 0); g.globalAlpha = a ?? 1; const d = s * .32;
    g.fillStyle = C.cubeS; g.beginPath(); g.moveTo(s / 2, 0); g.lineTo(s / 2 + d, -d); g.lineTo(s / 2 + d, -s - d); g.lineTo(s / 2, -s); g.closePath(); g.fill();
    g.fillStyle = C.cubeT; g.beginPath(); g.moveTo(-s / 2, -s); g.lineTo(-s / 2 + d, -s - d); g.lineTo(s / 2 + d, -s - d); g.lineTo(s / 2, -s); g.closePath(); g.fill();
    kshape(g, (c) => { c.beginPath(); c.roundRect(-s / 2, -s, s, s, s * .08); }, C.cubeF, { rim: "rgba(255,210,160,.45)", shadow: "rgba(40,10,10,.25)", rw: s * .06, sw: s * .12 });
    g.fillStyle = "rgba(60,30,15,.45)"; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(-s * .25 + (k * 37 % 50) / 100 * s, -s * .7 + (k * 23 % 60) / 100 * s, s * .04, 0, 7); g.fill(); }
    g.restore();
  }
  function pellet(x, y, r, a) { g.save(); g.globalAlpha = a ?? 1; kshape(g, ell(x, y - r, r, r * .92), C.cubeF, { rim: "rgba(255,210,160,.45)", rw: r * .12, sw: r * .25 }); g.restore(); }
  function lumpy(x, y, r, a) { g.save(); g.globalAlpha = a ?? 1;
    kshape(g, (c) => { c.beginPath(); c.moveTo(x - r * 1.3, y); c.bezierCurveTo(x - r * 1.4, y - r * .9, x - r * .4, y - r * 1.3, x - r * .1, y - r * .9); c.bezierCurveTo(x + r * .3, y - r * 1.6, x + r * 1.3, y - r * 1.1, x + r * 1.2, y - r * .4); c.quadraticCurveTo(x + r * 1.5, y, x + r * 1.1, y); c.closePath(); }, C.cubeF, { rim: "rgba(255,210,160,.45)", rw: r * .1, sw: r * .2 }); g.restore(); }
  function xMark(x, y, s, a) { g.save(); g.globalAlpha = a; g.strokeStyle = "#ff4d6d"; g.lineWidth = s * .16; g.lineCap = "round"; g.beginPath(); g.moveTo(x - s, y - s); g.lineTo(x + s, y + s); g.moveTo(x + s, y - s); g.lineTo(x - s, y + s); g.stroke(); g.restore(); }
  // Fels mit flacher Oberseite (top = y der Oberseite, slope = Neigung)
  function rock(x, w, top, slope) { slope = slope || 0;
    const path = (c) => { c.beginPath(); c.moveTo(x - w / 2 - 30, 4); c.quadraticCurveTo(x - w / 2 - 20, top - slope * w / 2 + 30, x - w / 2 + 20, top - slope * w / 2); c.lineTo(x + w / 2 - 20, top + slope * w / 2); c.quadraticCurveTo(x + w / 2 + 20, top + slope * w / 2 + 20, x + w / 2 + 34, 4); c.closePath(); };
    kshape(g, path, C.rock, { rim: "rgba(225,230,255,.55)", shadow: "rgba(20,10,50,.35)", rw: 8, sw: 26 });
    g.fillStyle = "rgba(60,60,110,.35)"; g.beginPath(); g.ellipse(x - w * .15, top * .45, w * .12, 10, .2, 0, 7); g.ellipse(x + w * .2, top * .25, w * .09, 8, -.2, 0, 7); g.fill(); }

  // ---------- Hook-Bild (auch Loop-Ende) ----------
  const ROCKX = 400, ROCKTOP = -120, HOOK0 = [325, -165, 2.75];
  function hookScene(t) {
    ground(-800, 1400); wAt(0, 0, 1, { t, look: .8 });
    rock(ROCKX, 260, ROCKTOP);
    g.save(); g.globalCompositeOperation = "lighter"; glow(ROCKX + 6, ROCKTOP - 50, 120, "rgba(255,225,150,.35)"); g.restore();
    cube(ROCKX - 26, ROCKTOP, 46, -.02); cube(ROCKX + 26, ROCKTOP, 46, .03); cube(ROCKX + 2, ROCKTOP - 46, 46, .05);
  }
  KZ.shot("wHook", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(HOOK0[0], 360, k), lerp(HOOK0[1], -170, k), lerp(HOOK0[2], 3.4, k)); hookScene(t); });
  KZ.shot("wLoop", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(230, HOOK0[0], k), lerp(-150, HOOK0[1], k), lerp(2.6, HOOK0[2], k)); hookScene(t); });

  KZ.shot("wShapes", (lt, d, t) => { bg(t, 40); const k = sm(lt / d); cam(lerp(-10, 20, k), -60, lerp(2.6, 2.75, k)); ground(-800, 800);
    const a1 = sm(lt / .2), x1 = sm((lt - d * .14) / .12), a2 = sm((lt - d * .2) / .2), x2 = sm((lt - d * .36) / .12), a3 = easeBack((lt - d * .5) / .35);
    pellet(-125, 0, 40 * a1, 1 - .55 * x1); xMark(-125, -40, 42, x1);
    lumpy(-5, 0, 40 * a2, 1 - .55 * x2); xMark(-5, -42, 42, x2);
    if (a3 > 0) { g.save(); g.globalCompositeOperation = "lighter"; glow(115, -40, 130 * a3, "rgba(255,225,140,.45)"); g.restore(); g.save(); g.translate(115, 0); g.scale(a3, a3); cube(0, 0, 76, Math.sin(t * 2) * .03); g.restore(); }
  });
  KZ.shot("wMeet", (lt, d, t) => { bg(t, lt * 60); const p = sm(lt / (d * .75)), x = lerp(-330, 0, p), k = sm(lt / d);
    cam(lerp(x + 40, 60, k), -150, lerp(1.45, 1.7, k)); ground(-1200, 1200);
    kshape(g, (c) => { c.beginPath(); c.ellipse(-560, 10, 260, 120, 0, Math.PI, 0); c.closePath(); }, "#4e3c6e", { rim: "rgba(220,200,255,.35)", rw: 8, sw: 20 });
    g.fillStyle = "#140c26"; g.beginPath(); g.ellipse(-520, 6, 90, 62, 0, Math.PI, 0); g.fill();
    wAt(x, 0, 1, { t, walk: 1 - sm((lt - d * .7) / (d * .1)), look: .4 });
    if (lt > d * .35) label("WOMBAT", W * .45, H * .2, sm((lt - d * .35) / .25));
  });
  KZ.shot("wRound", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(-60, -170, k), -125, lerp(1.9, 3.0, k)); ground(-900, 900);
    wAt(0, 0, 1, { t, look: -.6, headTilt: -.05 });
    const a = sm((lt - d * .3) / .3); g.save(); g.globalAlpha = a; g.strokeStyle = "#ffd84d"; g.lineWidth = 6; g.setLineDash([16, 12]); g.lineDashOffset = -t * 40;
    g.beginPath(); g.arc(-222, -118, 30 + 6 * Math.sin(t * 4), 0, 7); g.stroke(); g.restore();
    g.save(); g.globalCompositeOperation = "lighter"; glow(-222, -118, 60 * a, "rgba(255,220,120,.35)"); g.restore();
    if (lt > d * .4) label("ROUND", W * .42, H * .22, sm((lt - d * .4) / .25));
  });
  KZ.shot("wGut", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(60, 30, k), -130, lerp(1.75, 1.95, k)); ground(-900, 900);
    wAt(0, 0, 1, { t, look: .5, cut: sm(lt / .5), hiEnd: sm((lt - d * .5) / .4) });
    if (lt > d * .45) label("CUBE FACTORY", W * .45, H * .2, sm((lt - d * .45) / .25));
  });

  // ---------- Darm-Querschnitt ----------
  function seRadius(a, n) { const c = Math.cos(a), s = Math.sin(a); return 1 / Math.pow(Math.pow(Math.abs(c), n) + Math.pow(Math.abs(s), n), 1 / n); }
  function ringPath(c, R, n, a0, a1, inner) { const N = 30; for (let j = 0; j <= N; j++) { const a = lerp(a0, a1, j / N), r = R * seRadius(a, n); const x = Math.cos(a) * r, y = Math.sin(a) * r; j ? c.lineTo(x, y) : (inner ? c.lineTo(x, y) : c.moveTo(x, y)); } }
  function section(x, y, sc, n, squeeze, hiStiff, hiSoft, t) {
    g.save(); g.translate(x, y); g.scale(sc, sc);
    const Rin = 150 * squeeze;
    // Inhalt (Kot) als Superellipse
    kshape(g, (c) => { c.beginPath(); ringPath(c, Rin - 2, n, 0, Math.PI * 2); c.closePath(); }, "#8f5a33", { rim: "rgba(255,210,160,.4)", rw: 10, sw: 26 });
    // Wand: 8 Segmente, steif (dick) an den Seiten, dehnbar (dünn) an den Diagonalen
    for (let i = 0; i < 8; i++) { const stiff = i % 2 === 0, a0 = i * Math.PI / 4 - Math.PI / 8, a1 = a0 + Math.PI / 4, th = stiff ? 74 : 38;
      g.beginPath(); ringPath(g, Rin + th, n, a0, a1); ringPath(g, Rin, n, a1, a0, true); g.closePath();
      g.fillStyle = stiff ? C.stiff : C.soft; g.fill();
      const hi = stiff ? hiStiff : hiSoft; if (hi > 0) { g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = hi * (.5 + .3 * Math.sin(t * 6)); g.fillStyle = "#ffe08a"; g.fill(); g.restore(); } }
    g.restore();
  }
  KZ.shot("wBands", (lt, d, t) => { bg(t, 0); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(20,10,45,.55)"; g.fillRect(0, 0, W, H);
    const k = sm(lt / d); cam(0, 0, lerp(1.3, 1.45, k)); const sc = easeBack(lt / .5);
    section(0, 0, sc, 2, 1 + .03 * Math.sin(t * 4), sm((lt - d * .15) / .3) * (1 - sm((lt - d * .55) / .2)), sm((lt - d * .55) / .3), t);
    if (lt > d * .15) label("STIFF", W * .5, H * .2, sm((lt - d * .15) / .25));
    if (lt > d * .55) label("STRETCHY", W * .3, H * .62, sm((lt - d * .55) / .25));
  });
  KZ.shot("wCorners", (lt, d, t) => { bg(t, 0); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(20,10,45,.55)"; g.fillRect(0, 0, W, H);
    const k = sm(lt / d); cam(0, 0, lerp(1.45, 1.65, k)); const p = sm(lt / (d * .8)), pulse = Math.max(0, Math.sin(lt * 7)) * .05 * (1 - p);
    section(0, 0, 1, lerp(2, 7, p), 1 - pulse - .06 * p, 0, 0, t);
    if (lt > d * .7) { g.save(); g.globalCompositeOperation = "lighter"; for (const a of [1, 3, 5, 7]) { const r = 140 * seRadius(a * Math.PI / 4, 7); glow(Math.cos(a * Math.PI / 4) * r, Math.sin(a * Math.PI / 4) * r, 50, "rgba(255,230,140,.6)"); } g.restore();
      label("CORNERS!", W * .5, H * .2, sm((lt - d * .7) / .2)); }
  });

  // ---------- 100 Würfel pro Nacht ----------
  const PILE = Array.from({ length: 24 }, (_, i) => { const row = i < 9 ? 0 : i < 16 ? 1 : i < 21 ? 2 : 3, inRow = [0, 9, 16, 21][row], j = i - inRow, cnt = [9, 7, 5, 3][row];
    return { x: -500 + (j - (cnt - 1) / 2) * 36 + (i * 13 % 7) - 3, y: -row * 34, r: ((i * 7) % 9 - 4) * .03 }; });
  KZ.shot("wHundred", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(-240, -200, k), -150, lerp(1.2, 1.15, k)); ground(-1200, 900);
    const p = sm(lt / (d * .9)), n = Math.floor(p * PILE.length);
    for (let i = 0; i < n; i++) cube(PILE[i].x, PILE[i].y, 34, PILE[i].r);
    if (n < PILE.length) { const f = (p * PILE.length) % 1, q = PILE[n]; cube(lerp(-380, q.x, f), lerp(-110, q.y, f) - Math.sin(f * Math.PI) * 60, 34, f * 3); }
    wAt(-120, 0, 1, { t, look: -.3 });
    label(Math.max(1, Math.round(lerp(1, 100, p))) + " CUBES", W * .45, H * .2, sm(lt / .3));
  });
  KZ.shot("wRock", (lt, d, t) => { bg(t, lt * 40); const k = sm(lt / d); cam(lerp(150, 330, k), -150, lerp(1.6, 2.0, k)); ground(-900, 1400);
    rock(ROCKX, 260, ROCKTOP); const a = easeBack((lt - d * .2) / .4);
    if (a > 0) { g.save(); g.translate(ROCKX, ROCKTOP); g.scale(a, a); cube(-22, 0, 40, -.02); cube(24, 0, 40, .03); cube(2, -40, 40, .05); g.restore(); }
    wAt(0, 0, 1, { t, look: .9, headTilt: .05 * Math.sin(t * 3) });
    if (lt > d * .45) label("TERRITORY", W * .45, H * .2, sm((lt - d * .45) / .25));
  });
  KZ.shot("wNoRoll", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(40, 70, k), -150, lerp(2.0, 2.2, k)); ground(-900, 900);
    const SL = .12, TOP = -170; rock(0, 360, TOP, SL); const yOn = (x) => TOP + SL * x;
    // runde Kugel rollt nach rechts runter und fällt
    const p = clamp(lt / (d * .5), 0, 1), r = 26;
    let bx, by; if (p < .55) { bx = lerp(-60, 180, sm(p / .55) * .4 + p / .55 * .6); by = yOn(bx) - r; } else { const f = (p - .55) / .45; bx = 180 + f * 120; by = yOn(180) - r + f * f * 190; }
    if (p < 1) { g.save(); g.translate(bx, by); g.rotate(bx / r); pellet(0, r, r); g.fillStyle = "rgba(60,30,15,.5)"; g.beginPath(); g.arc(8, -6, 4, 0, 7); g.fill(); g.restore(); }
    if (p > .1) xMark(160, -260, 34, sm((p - .1) / .3) * (1 - sm((lt - d * .5) / .2)));
    // Würfel bleibt liegen
    const a = easeBack((lt - d * .5) / .3); if (a > 0) { g.save(); g.globalCompositeOperation = "lighter"; glow(-40, yOn(-40) - 30, 110 * a, "rgba(255,225,140,.4)"); g.restore();
      g.save(); g.translate(-40, yOn(-40)); g.rotate(Math.atan(SL)); g.scale(a, a); cube(0, 0, 60, 0); g.restore(); }
    if (lt > d * .55) label("STAYS PUT", W * .45, H * .2, sm((lt - d * .55) / .25));
  });
})();
