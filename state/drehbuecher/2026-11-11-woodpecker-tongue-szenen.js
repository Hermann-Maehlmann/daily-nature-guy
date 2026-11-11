// Szenendatei "The Bird That Keeps Its Tongue On Its Head" (Specht, Zunge/Zungenbein um den Schädel).
// Quellen: Texas Parks & Wildlife ("Introducing Birds": Zungenbein-Hörner über den Schädel bis ins rechte Nasenloch beim Goldspecht/Flicker),
// Colby College Maine Birds (Zunge bis 3x so lang wie der Schnabel, Scheide unter der Haut über den Schädel), WDFW (Widerhaken an der Spitze).
// Eigene Figuren: Buntspecht-artiger Specht (Seitenansicht, hängt rechts am Stamm, schaut nach links), Röntgen-Kopf, Stamm mit Schnitt, Käferlarve.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#2b2a63", "#25336a", "#1a2b52", "#0c162e"], hills: [["#1c4a45", "#245c55"], ["#163c39", "#1d4b47"], ["#0f2b2a", "#163937"]], corals: false, rays: true, dust: "255,230,170" };
  const C = { black: "#1f2140", blackL: "#2c2f57", white: "#f3eee2", buff: "#eadfc8", red: "#ff3b4f", beak: "#6f7696", foot: "#8a8fa8",
    bark: "#7a4e33", barkD: "#5c3824", wood: "#e6b77d", woodD: "#c99257", tunnel: "#4a2a18", tongue: "#ff7aa8", grub: "#f6e7c4", grubD: "#e2c99a", grubH: "#b0552c" };

  // ---------- Hintergrund: Wald in der Dämmerung ----------
  function bg(t, camx) {
    reef(t, camx, 0, 1, PAL);
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.filter = "blur(6px)";
    for (let i = 0; i < 6; i++) { const x = ((i * 260 - camx * .25) % (W + 400) + W + 400) % (W + 400) - 200, w = 60 + (i * 37 % 50);
      g.fillStyle = i % 2 ? "rgba(20,30,60,.55)" : "rgba(28,40,72,.5)"; g.fillRect(x, 0, w, H); }
    g.restore();
  }

  // ---------- Stamm: Oberfläche bei x=0, Holz nach links ----------
  function trunk(t, o) {
    o = o || {};
    kshape(g, (c) => { c.beginPath(); c.rect(-460, -1600, 460, 3200); }, C.bark, { rim: "rgba(255,210,170,.35)", shadow: "rgba(30,10,0,.3)", rw: 10, sw: 40 });
    g.strokeStyle = C.barkD; g.lineCap = "round"; g.lineWidth = 9;
    for (let i = 0; i < 7; i++) { const x = -30 - i * 58; g.beginPath(); for (let y = -1500; y <= 1500; y += 60) { const xx = x + Math.sin(y * .013 + i * 1.7) * 10; y === -1500 ? g.moveTo(xx, y) : g.lineTo(xx, y); } g.stroke(); }
    // Specht-Löcher (alte)
    for (const [x, y] of [[-10, 260], [-6, -420]]) { g.fillStyle = C.tunnel; g.beginPath(); g.ellipse(x, y, 9, 15, 0, 0, 7); g.fill(); }
    if (o.hole) { g.fillStyle = C.tunnel; g.beginPath(); g.ellipse(-4, -108, 6 + 6 * o.hole, 9 + 9 * o.hole, 0, 0, 7); g.fill(); }
    if (o.cut) {
      g.save(); g.globalAlpha = o.cut;
      const cut = (c) => { c.beginPath(); c.roundRect(-330, -230, 324, 250, 40); };
      kshape(g, cut, C.wood, { rim: "rgba(255,240,210,.7)", shadow: "rgba(120,60,20,.3)", rw: 6, sw: 18 });
      g.save(); cut(g); g.clip();
      g.strokeStyle = "rgba(170,110,60,.45)"; g.lineWidth = 4; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-330, -220 + i * 46); g.bezierCurveTo(-220, -240 + i * 46, -110, -200 + i * 46, 0, -222 + i * 46); g.stroke(); }
      // Fraßgänge der Larve
      g.strokeStyle = C.tunnel; g.lineWidth = 30; g.lineCap = "round"; g.lineJoin = "round";
      g.beginPath(); g.moveTo(10, -108); g.lineTo(-215, -108); g.bezierCurveTo(-260, -108, -280, -60, -250, -10); g.stroke();
      g.lineWidth = 22; g.beginPath(); g.moveTo(-130, -108); g.bezierCurveTo(-140, -160, -200, -190, -290, -180); g.stroke();
      g.restore(); g.restore();
    }
  }

  // ---------- Käferlarve (C-Form), Mitte (0,0), Kopf rechts ----------
  function grub(x, y, s, t, ang) {
    g.save(); g.translate(x, y); g.rotate(ang || 0); g.scale(s, s);
    const n = 8;
    for (let i = n - 1; i >= 0; i--) { const a = Math.PI * (.15 + .75 * i / (n - 1)) + Math.sin(t * 5 + i * .5) * .06, r = 26;
      const px = Math.cos(a) * r * -1 + 10, py = Math.sin(a) * r - 6, rr = 13 - Math.abs(i - 3.5) * .9;
      kshape(g, ell(px, py, rr, rr * 1.05), i % 2 ? C.grub : C.grubD, { rim: "rgba(255,255,240,.8)", shadow: "rgba(150,100,40,.3)", rw: 3, sw: 5 }); }
    // Kopf
    kshape(g, ell(34, -14, 10, 9), C.grubH, { rim: "rgba(255,200,160,.7)", rw: 3, sw: 4 });
    g.fillStyle = "#3a1608"; g.beginPath(); g.arc(41, -12, 2.5, 0, 7); g.fill();
    g.restore();
  }

  // ---------- Zungen-Schiene (Kopf-Koordinaten, Kopfmitte 0,0, Schnabel nach links) ----------
  const CTRL = [[-26, -12], [-16, -34], [8, -46], [36, -38], [50, -10], [44, 20], [18, 36], [-10, 31], [-30, 10], [-60, 4], [-98, 2]];
  let TRACK = CTRL; for (let it = 0; it < 3; it++) { const N = [TRACK[0]]; for (let i = 0; i < TRACK.length - 1; i++) { const a = TRACK[i], b = TRACK[i + 1];
      N.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); } N.push(TRACK[TRACK.length - 1]); TRACK = N; }
  TRACK.push([-340, 2]);
  const SEG = []; let TL = 0; for (let i = 1; i < TRACK.length; i++) { const l = Math.hypot(TRACK[i][0] - TRACK[i - 1][0], TRACK[i][1] - TRACK[i - 1][1]); SEG.push(l); TL += l; }
  const ROPE = SEG.slice(0, SEG.length - 1).reduce((a, b) => a + b, 0) - 6; // Länge der Zunge samt Zungenbein: Nasenloch bis kurz vor Schnabelspitze
  function trackPt(s) { s = clamp(s, 0, TL); for (let i = 0; i < SEG.length; i++) { if (s <= SEG[i]) { const k = s / SEG[i]; return [lerp(TRACK[i][0], TRACK[i + 1][0], k), lerp(TRACK[i][1], TRACK[i + 1][1], k)]; } s -= SEG[i]; } return TRACK[TRACK.length - 1]; }
  function ropePts(e) { const P = []; for (let s = e; s <= e + ROPE; s += 3) P.push(trackPt(s)); P.push(trackPt(e + ROPE)); return P; }

  // Specht-Kopf (Kopf-Koordinaten)
  function head(c, o) {
    const t = o.t || 0;
    // Hinterkopf/Scheitel schwarz
    kshape(c, ell(0, 0, 42, 38), C.black, { rim: "rgba(170,180,255,.45)", shadow: "rgba(0,0,10,.35)", rw: 5, sw: 10 });
    // Stirn hell
    kshape(c, ell(-22, -10, 14, 16, .3), C.buff, { rim: "rgba(255,255,255,.6)", rw: 3, sw: 4 });
    // weiße Wange
    kshape(c, ell(2, 10, 27, 16, -.1), C.white, { rim: "rgba(255,255,255,.8)", shadow: "rgba(80,70,90,.2)", rw: 4, sw: 6 });
    // Bartstreif
    c.strokeStyle = C.black; c.lineWidth = 8; c.lineCap = "round"; c.beginPath(); c.moveTo(-26, 16); c.quadraticCurveTo(4, 30, 38, 22); c.stroke();
    // roter Nacken
    kshape(c, ell(31, -20, 15, 13, .4), C.red, { rim: "rgba(255,200,200,.7)", shadow: "rgba(90,0,20,.3)", rw: 3, sw: 5 });
    // Schnabel (Meißel)
    kshape(c, (c) => { c.beginPath(); c.moveTo(-30, -13); c.lineTo(-100, 1); c.lineTo(-30, 15); c.closePath(); }, C.beak, { rim: "rgba(230,235,255,.6)", shadow: "rgba(0,0,20,.35)", rw: 3, sw: 7 });
    c.strokeStyle = "rgba(20,20,40,.55)"; c.lineWidth = 2; c.beginPath(); c.moveTo(-34, 2); c.lineTo(-96, 2); c.stroke();
    // Nasenloch
    c.fillStyle = "rgba(20,20,40,.7)"; c.beginPath(); c.ellipse(-36, -8, 4, 2.5, -.2, 0, 7); c.fill();
    fig.eye(c, -6, -9, 12, { t, seed: 3, look: -.6 });
  }

  // ganzer Specht: Stammoberfläche x=0, Kopf bei (hx, hy)
  // o: t, pull (0 = Schnabel am Stamm, 1 = ausgeholt), e (Zunge ausgefahren, Kopf-Einheiten), xray 0..1, grub (Larve an der Spitze)
  function woodpecker(c, o) {
    const t = o.t || 0, pull = o.pull ?? .6, xr = o.xray || 0, br = Math.sin(t * 2.4) * .012;
    const hx = 100 + 25 * pull, hy = -110;
    c.save();
    c.save(); c.translate(70, 50); c.scale(1 + br, 1 - br); c.translate(-70, -50);
    c.globalAlpha = 1 - .25 * xr;
    // Schwanz (Stützfedern) am Stamm
    kshape(c, (c) => { c.beginPath(); c.moveTo(36, 140); c.lineTo(64, 146); c.lineTo(14, 222); c.lineTo(4, 214); c.closePath(); }, C.black, { rim: "rgba(170,180,255,.4)", rw: 4, sw: 8 });
    // Füße: 2 Zehen nach oben, 2 nach unten
    c.strokeStyle = C.foot; c.lineWidth = 7; c.lineCap = "round";
    for (const [y0] of [[66], [104]]) { c.beginPath(); c.moveTo(40, y0); c.lineTo(6, y0 - 16); c.moveTo(40, y0); c.lineTo(4, y0 - 4); c.moveTo(40, y0); c.lineTo(6, y0 + 12); c.stroke(); }
    // Körper (Bauch hell)
    kshape(c, ell(70, 50, 46, 105, .28), C.buff, { rim: "rgba(255,255,255,.7)", shadow: "rgba(90,70,60,.25)", rw: 5, sw: 14 });
    // roter Steiß
    kshape(c, ell(40, 132, 17, 20, .3), C.red, { rim: "rgba(255,200,200,.6)", rw: 3, sw: 5 });
    // Flügel/Rücken schwarz
    const wing = (c) => { c.beginPath(); c.moveTo(92, -66); c.bezierCurveTo(150, -40, 146, 90, 72, 176); c.lineTo(56, 150); c.bezierCurveTo(96, 70, 92, -10, 72, -52); c.closePath(); };
    kshape(c, wing, C.black, { rim: "rgba(170,180,255,.45)", shadow: "rgba(0,0,10,.35)", rw: 5, sw: 12 });
    kshape(c, ell(104, -22, 12, 30, .25), C.white, { rim: "rgba(255,255,255,.8)", rw: 3, sw: 5 });
    c.fillStyle = C.white; for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) { c.beginPath(); c.ellipse(118 - r * 9 - k * 10, 40 + r * 26 + k * 4, 4.5, 3, .5, 0, 7); c.fill(); }
    // Hals
    kshape(c, (c) => { c.beginPath(); c.moveTo(hx - 24, hy + 22); c.lineTo(hx + 36, hy + 14); c.lineTo(112, -30); c.lineTo(66, -40); c.closePath(); }, C.black, { rim: "rgba(170,180,255,.3)", rw: 3, sw: 6 });
    c.restore();
    // Kopf
    c.save(); c.translate(hx, hy); c.globalAlpha = 1 - .3 * xr; head(c, o); c.restore();
    // Zunge
    const e = o.e || 0, P = ropePts(e);
    c.save(); c.translate(hx, hy); c.lineCap = "round"; c.lineJoin = "round";
    if (xr > 0) {
      // Schädel und Scheide (Röntgen)
      c.globalAlpha = xr;
      c.strokeStyle = "rgba(170,235,255,.55)"; c.lineWidth = 3; c.setLineDash([7, 6]);
      c.beginPath(); c.ellipse(4, -4, 36, 32, 0, 0, 7); c.stroke();
      c.beginPath(); c.moveTo(-30, -11); c.lineTo(-96, 1); c.lineTo(-30, 13); c.stroke(); c.setLineDash([]);
      c.strokeStyle = "rgba(255,150,190,.28)"; c.lineWidth = 15; c.beginPath(); for (let s = 0; s <= ROPE + 2; s += 3) { const q = trackPt(s); s ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); } c.stroke();
      c.save(); c.globalCompositeOperation = "lighter"; c.strokeStyle = "rgba(255,90,150,.28)"; c.lineWidth = 16; c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.restore();
      c.strokeStyle = C.tongue; c.lineWidth = 7; c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
      c.globalAlpha = 1;
    }
    // sichtbarer Teil außerhalb des Schnabels
    const out = P.filter((q) => q[0] < -96);
    if (out.length > 1) { c.strokeStyle = C.tongue; c.lineWidth = 7; c.beginPath(); out.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
      const tp = out[out.length - 1]; barbs(c, tp[0], tp[1], 1); }
    c.restore();
    if (o.grub) { const tp = P[P.length - 1]; grub(hx + tp[0] - 4, hy + tp[1] + 2, .55, t, 0); }
    c.restore();
  }
  function barbs(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = "#ffb3cc";
    c.beginPath(); c.moveTo(-9, 0); c.lineTo(0, -4); c.lineTo(0, 4); c.closePath(); c.fill();
    for (let i = 0; i < 4; i++) for (const sg of [-1, 1]) { c.beginPath(); c.moveTo(i * 7, sg * 3); c.lineTo(i * 7 + 8, sg * 9); c.lineTo(i * 7 + 4, sg * 2); c.closePath(); c.fill(); }
    c.restore(); }
  function wpAt(x, y, s, o) { g.save(); g.translate(x, y); g.scale(s, s); woodpecker(g, o); g.restore(); }
  const tipW = (pull, e) => [100 + 25 * pull - 98 - e, -108]; // Zungenspitze in Weltkoordinaten (Specht bei 0,0)

  // ---------- Röntgen-Kopf Nahaufnahme (Hook und Loop) ----------
  const HK = [70, -118, 4.6];
  function xrayHead(t, lt, d, k) {
    bg(t, 0); cam(lerp(HK[0], HK[0] + 6, k), HK[1], lerp(HK[2], HK[2] * 1.12, k)); trunk(t);
    wpAt(0, 0, 1, { t, pull: .6, xray: 1, e: 0 });
    // Impuls läuft die Zunge entlang
    g.save(); g.translate(115, -110); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i++) { const s = ((t * 80 + i * ROPE / 3) % ROPE), q = trackPt(s); glow(q[0], q[1], 16, "rgba(255,170,210,.8)"); }
    g.restore();
  }
  KZ.shot("wHook", (lt, d, t) => { xrayHead(t, lt, d, sm(lt / d)); });
  KZ.shot("wLoop", (lt, d, t) => {
    const k = sm(lt / d);
    if (lt < d * .55) { bg(t, 0); cam(lerp(55, 70, k), lerp(20, -100, k), lerp(1.7, 3.2, k)); trunk(t);
      const ph = (lt * 4) % 1; wpAt(0, 0, 1, { t, pull: ph < .3 ? lerp(1, 0, ph / .3) : lerp(0, 1, (ph - .3) / .7), xray: sm((lt - d * .3) / (d * .25)) }); }
    else { const k2 = sm((lt - d * .55) / (d * .45)); bg(t, 0); cam(lerp(70, HK[0], k2), lerp(-100, HK[1], k2), lerp(3.2, HK[2], k2)); trunk(t);
      wpAt(0, 0, 1, { t, pull: .6, xray: 1, e: 0 }); }
  });

  KZ.shot("wWrap", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(95, 110, k), lerp(-112, -118, k), lerp(4.2, 5.2, k)); trunk(t);
    wpAt(0, 0, 1, { t, pull: .6, xray: 1, e: 0 });
    // leuchtende Spur zeichnet den Weg ums Schädeldach nach
    const u = sm(lt / (d * .7));
    g.save(); g.translate(115, -110); g.globalCompositeOperation = "lighter"; g.strokeStyle = "rgba(255,200,230,.9)"; g.lineWidth = 6; g.lineCap = "round";
    g.beginPath(); for (let s = ROPE; s >= ROPE * (1 - u); s -= 2) { const q = trackPt(s); s === ROPE ? g.moveTo(q[0], q[1]) : g.lineTo(q[0], q[1]); } g.stroke();
    const q = trackPt(ROPE * (1 - u)); glow(q[0], q[1], 26, "rgba(255,180,220,.9)"); g.restore();
    if (lt > d * .45) label("AROUND THE SKULL", W * .45, H * .2, sm((lt - d * .45) / .25)); });

  KZ.shot("wMeet", (lt, d, t) => { bg(t, lt * 25); const k = sm(lt / d); cam(lerp(40, 60, k), lerp(-10, 20, k), lerp(1.55, 1.75, k)); trunk(t, { hole: .3 });
    const ph = (lt * 2.2) % 1, pk = ph < .25 ? lerp(1, 0, sm(ph / .25)) : lerp(0, 1, sm((ph - .25) / .75));
    const inY = 60 * (1 - easeBack(lt / .5));
    wpAt(0, inY, 1, { t, pull: pk });
    if (ph < .12) { g.save(); g.globalCompositeOperation = "lighter"; glow(0, -108, 40, "rgba(255,230,170,.6)"); g.restore(); }
    if (lt > d * .25) label("WOODPECKER", W * .45, H * .2, sm((lt - d * .25) / .25)); });

  KZ.shot("wLength", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(-20, -50, k), -105, lerp(2.6, 2.4, k)); trunk(t, { cut: 1 });
    const e = 214 * easeBack(clamp((lt - .1) / .7, 0, 1));
    wpAt(0, 0, 1, { t, pull: 0, e });
    // Lineal: 3 Schnabellängen unter der Zunge, 1 über dem Schnabel
    const a = sm((lt - .9) / .4);
    if (a > 0) { g.save(); g.globalAlpha = a; g.lineCap = "round";
      g.strokeStyle = "#ffd84d"; g.lineWidth = 10; g.beginPath(); g.moveTo(27, -140); g.lineTo(97, -140); g.stroke();
      const cols = ["#ffd84d", "#ff9f43", "#ffd84d"]; for (let i = 0; i < 3; i++) { const s = sm((lt - .9 - i * .25) / .3); if (s <= 0) continue; g.strokeStyle = cols[i]; g.beginPath(); g.moveTo(2 - i * 72, -82); g.lineTo(2 - i * 72 - 66 * s, -82); g.stroke(); }
      g.restore(); }
    if (lt > d * .35) label("3x LONGER THAN THE BEAK", W * .45, H * .2, sm((lt - d * .35) / .25)); });

  KZ.shot("wSheath", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(40, 90, k), lerp(-108, -116, k), lerp(3.0, 4.6, k)); trunk(t);
    const e = 200 * (1 - sm(lt / (d * .7)));
    wpAt(0, 0, 1, { t, pull: .2, xray: sm(lt / .4), e });
    if (lt > d * .45) label("UNDER THE SKIN", W * .45, H * .2, sm((lt - d * .45) / .25)); });

  KZ.shot("wNostril", (lt, d, t) => { bg(t, 0); const k = sm(lt / d);
    // Kamera folgt dem Weg übers Schädeldach nach vorn zum Nasenloch
    const s = lerp(ROPE * .45, 0, k), q = trackPt(s); cam(115 + lerp(q[0], -36, k * k), -110 + lerp(q[1], -8, k * k), lerp(5, 7.5, k)); trunk(t);
    wpAt(0, 0, 1, { t, pull: .6, xray: 1, e: 0 });
    g.save(); g.translate(115, -110); g.globalCompositeOperation = "lighter"; glow(q[0], q[1], 18, "rgba(255,180,220,.9)");
    if (k > .7) { const p = .5 + .5 * Math.sin(t * 8); glow(-36, -8, 16 + 6 * p, "rgba(255,240,150,.8)"); } g.restore();
    if (lt > d * .55) label("INTO THE NOSTRIL!", W * .45, H * .2, sm((lt - d * .55) / .25)); });

  KZ.shot("wDrill", (lt, d, t) => { bg(t, lt * 20); const k = sm(lt / d); cam(lerp(50, 30, k), lerp(-60, -95, k), lerp(2.4, 3.1, k)); trunk(t, { hole: sm(lt / d) });
    const ph = (lt * 5) % 1, pk = ph < .3 ? lerp(.8, 0, ph / .3) : lerp(0, .8, (ph - .3) / .7);
    wpAt(0, 0, 1, { t, pull: pk });
    if (ph < .15) { g.save(); g.globalCompositeOperation = "lighter"; glow(0, -108, 34, "rgba(255,230,170,.7)"); g.restore(); }
    // Holzspäne
    for (let i = 0; i < 14; i++) { const p = (lt * 1.6 + i / 14) % 1, a = -1.1 + (i * 0.37 % 1.6), v = 120 + (i * 53 % 90);
      const x = Math.cos(a) * v * p * 1.2 + 8, y = -108 + Math.sin(a) * v * p + 260 * p * p; if (x < 0) continue;
      g.save(); g.translate(x, y); g.rotate(p * 9 + i); g.globalAlpha = 1 - p; g.fillStyle = i % 2 ? C.wood : C.woodD; g.fillRect(-6, -3, 12, 6); g.restore(); }
    if (lt > d * .5) label("DRILL!", W * .45, H * .2, sm((lt - d * .5) / .25)); });

  KZ.shot("wTunnel", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(-40, -90, k), -100, lerp(2.4, 2.7, k)); trunk(t, { cut: sm(lt / .35), hole: 1 });
    grub(-222, -102, .9, t, 0);
    const e = 214 * easeBack(clamp((lt - d * .3) / (d * .35), 0, 1));
    wpAt(0, 0, 1, { t, pull: 0, e });
    if (lt > d * .5) label("TUNNELS", W * .45, H * .2, sm((lt - d * .5) / .25)); });

  KZ.shot("wBarbs", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); const [tx, ty] = tipW(0, 214); cam(lerp(tx + 30, tx + 6, k), ty - 4, lerp(4.5, 8, k)); trunk(t, { cut: 1, hole: 1 });
    grub(-222, -102, .9, t, 0);
    wpAt(0, 0, 1, { t, pull: 0, e: 214 + Math.sin(t * 6) * 2 });
    // Widerhaken groß darüber
    const a = sm((lt - d * .2) / .4); g.save(); g.globalAlpha = a; g.globalCompositeOperation = "lighter"; glow(tx + 10, ty, 26, "rgba(255,170,210,.7)"); g.restore();
    if (lt > d * .4) label("BACKWARD BARBS", W * .45, H * .2, sm((lt - d * .4) / .25)); });

  KZ.shot("wGrub", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(-60, 30, k), lerp(-100, -105, k), lerp(2.6, 3.0, k)); trunk(t, { cut: 1 - sm((lt - d * .6) / (d * .3)), hole: 1 });
    const r = sm(clamp((lt - .15) / (d * .5), 0, 1)), e = 214 * (1 - r);
    const gone = lt > d * .72;
    wpAt(0, 0, 1, { t, pull: r * .9, e, grub: !gone });
    if (gone) { g.save(); g.globalCompositeOperation = "lighter"; glow(150, -100, 60 * (1 - sm((lt - d * .72) / .4)), "rgba(255,230,160,.6)"); g.restore(); }
    if (lt > d * .55) label("DINNER!", W * .45, H * .2, sm((lt - d * .55) / .25)); });
})();
