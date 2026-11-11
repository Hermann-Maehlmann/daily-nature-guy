// Szenendatei "The Wasp That Walks A Zombie Roach" (Juwelwespe Ampulex compressa + Amerikanische Großschabe Periplaneta americana).
// Eigene Figuren: Juwelwespe (metallisch grün-blau, rote Schenkel an Mittel- und Hinterbeinen), Schabe (rotbraun, heller Halsschild-Rand), Gehirn-Schnitt, Bau, Larve.
// Quelle: K. Catania, Scientific American (2021); Gal, Rosenberg & Libersat 2005; Arvidson et al. 2019: Stich 1 in Brustganglion, Stich 2 ins Gehirn,
// ~30 Min Putzen, dann Hypokinese; Wespe beißt Fühler ab, führt Schabe "wie einen Hund an der Leine" in einen Bau, klebt 1 Ei ans Mittelbein, Larve frisst sie von innen.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#2a1d5e", "#33246b", "#241a52", "#120c30"], hills: [["#2a2a5c", "#33346b"], ["#222552", "#2a2d60"], ["#1a1c44", "#212452"]], corals: false, rays: false, dust: "255,235,190" };
  const C = { roach: "#a4471f", roachD: "#6e2a12", roachL: "#c9652f", wing: "#b8582a", pron: "#e6bd6e", pronD: "#5e2510", head: "#7c3418", leg: "#7a3416", legF: "#4e1f0c", ant: "#5c2810",
    wG: "#20c98a", wB: "#1f74d6", wD: "#0f3e66", wLeg: "#ff5a3a", wLegD: "#1a2c44", ground: "#2d1f4a", groundT: "#3d2c60", grass: "#4c3a78",
    soil: "#3a2433", soilD: "#24151f", cave: "#140b16", brain: "#ff8fb0", brainD: "#e0577f", venom: "120,255,170", egg: "#fff7e8", larva: "#fff1d6", organ: "#ff9a7a" };

  // Blätter im Hintergrund (Bildschirmkoordinaten, unscharf)
  function bg(t, camx) {
    reef(t, camx, 0, 1, PAL);
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.filter = "blur(6px)";
    for (let i = 0; i < 8; i++) { const x = ((i * 241 - camx * .25) % (W + 300) + W + 300) % (W + 300) - 150, y = H * (.08 + (i * 43 % 40) / 100), a = -.7 + (i % 4) * .45 + Math.sin(t * .5 + i) * .04;
      g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = i % 2 ? "rgba(70,60,140,.55)" : "rgba(55,48,120,.6)"; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(70, -80, 240, -70, 330, 0); g.bezierCurveTo(240, 70, 70, 80, 0, 0); g.fill(); g.restore(); }
    g.restore();
    g.save(); g.globalCompositeOperation = "lighter"; glow(W * .72, H * .1, 380, "rgba(255,190,140,.22)"); g.restore();
  }
  // Waldboden; off verschiebt die Textur (Laufen)
  function ground(x0, x1, off) {
    off = off || 0;
    g.fillStyle = C.ground; g.fillRect(x0, 0, x1 - x0, 3000);
    g.fillStyle = C.groundT; g.fillRect(x0, 0, x1 - x0, 12);
    g.fillStyle = "rgba(255,255,255,.05)"; for (let x = Math.floor((x0 + off) / 70) * 70; x < x1 + off; x += 70) { const xx = x - off; g.beginPath(); g.ellipse(xx, 26 + (Math.abs(x * 13) % 40), 14, 5, 0, 0, 7); g.fill(); }
    g.strokeStyle = C.grass; g.lineWidth = 6; g.lineCap = "round";
    for (let x = Math.floor((x0 + off) / 110) * 110; x < x1 + off; x += 110) { const xx = x - off, h = 16 + (Math.abs(x * 7) % 24); for (const k of [-1, 0, 1]) { g.beginPath(); g.moveTo(xx + k * 6, 2); g.lineTo(xx + k * 12 + Math.sin(KZ.t * 1.5 + x) * 3, -h + Math.abs(k) * 6); g.stroke(); } }
  }

  // ---------- Schabe: Seitenansicht, Kopf nach rechts, Boden y=0, Länge ~430 ----------
  // o: t, walk, limp (Vorderbeine schlaff 0..1), zombie (0..1), leash [x,y] (Fühlerspitze lokal), stub (Fühler gekürzt), xray (0..1), eaten (0..1), brain (0..1), venom (0..1)
  const HEAD = [200, -44];
  function spinyLeg(c, pts, col, w, spines) {
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
    if (spines) { c.lineWidth = 2.5; for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], a = Math.atan2(by - ay, bx - ax);
      for (let k = .25; k < 1; k += .25) { const x = lerp(ax, bx, k), y = lerp(ay, by, k); c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a - 2.3) * 12, y + Math.sin(a - 2.3) * 12); c.stroke(); } } }
  }
  function roachLeg(c, hx, hy, ph, reach, dir, col, w, limp) {
    const sw = Math.sin(ph) * 20, lift = Math.max(0, Math.cos(ph)) * 14;
    let kx = hx + dir * reach * .55 + sw * .4, ky = hy - 46 - lift * .5, fx = hx + dir * reach + sw, fy = -lift;
    if (limp) { kx = lerp(kx, hx + dir * 30, limp); ky = lerp(ky, hy + 10, limp); fx = lerp(fx, hx + dir * 80, limp); fy = lerp(fy, -2, limp); }
    spinyLeg(c, [[hx, hy], [kx, ky], [fx, fy], [fx + dir * 22, fy + 1]], col, w, true);
  }
  const roachBody = (c) => { c.beginPath(); c.moveTo(-218, -46); c.bezierCurveTo(-200, -96, -90, -118, 40, -114); c.bezierCurveTo(110, -110, 150, -96, 162, -66);
    c.bezierCurveTo(168, -44, 150, -30, 120, -28); c.bezierCurveTo(40, -20, -120, -22, -190, -30); c.bezierCurveTo(-212, -33, -222, -38, -218, -46); c.closePath(); };
  const pronotum = ell(150, -82, 58, 32, .28);
  const headP = ell(HEAD[0], HEAD[1], 24, 32, -.35);
  function roach(c, o) {
    const t = o.t || 0, wk = (o.walk || 0) * t * 9, br = Math.sin(t * 2.2) * .01, z = o.zombie || 0, xr = o.xray || 0;
    c.save(); c.scale(1 + br, 1 - br);
    c.save(); c.globalAlpha = .35; c.fillStyle = "#0b0618"; c.beginPath(); c.ellipse(0, 4, 230, 14, 0, 0, 7); c.fill(); c.restore();
    // ferne Beine
    roachLeg(c, -50, -34, wk + 1.2, 150, -1, C.legF, 9, 0); roachLeg(c, 40, -32, wk + 3.3, 95, 1, C.legF, 9, 0); roachLeg(c, 120, -34, wk + 5.4, 95, 1, C.legF, 8, o.limp || 0);
    // Cerci
    c.strokeStyle = C.roachD; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(-210, -44); c.lineTo(-258, -58); c.moveTo(-212, -40); c.lineTo(-256, -34); c.stroke();
    // Körper + Flügeldecken
    kshape(c, roachBody, C.roach, { rim: "rgba(255,210,170,.55)", shadow: "rgba(40,5,20,.32)", rw: 7, sw: 18 });
    c.save(); roachBody(c); c.clip();
    c.fillStyle = C.roachD; c.beginPath(); c.moveTo(-230, -30); c.bezierCurveTo(-100, -36, 60, -34, 170, -40); c.lineTo(170, 0); c.lineTo(-230, 0); c.fill(); // Bauch-Segmente dunkler
    c.strokeStyle = "rgba(255,200,150,.25)"; c.lineWidth = 3; c.beginPath(); c.moveTo(-200, -60); c.bezierCurveTo(-100, -100, 20, -104, 110, -96); c.stroke(); // Flügelkante
    c.strokeStyle = "rgba(60,15,5,.25)"; for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(-180 + k * 50, -40); c.quadraticCurveTo(-150 + k * 52, -84, -120 + k * 55, -104); c.stroke(); } // Adern
    c.fillStyle = "rgba(255,240,220,.18)"; c.beginPath(); c.ellipse(-20, -100, 120, 9, -.05, 0, 7); c.fill(); // Glanz
    // Röntgenblick: Organe + Larve
    if (xr > 0) {
      c.globalAlpha = xr; c.fillStyle = "rgba(30,8,20,.75)"; c.fillRect(-240, -130, 420, 130);
      const e = o.eaten || 0;
      c.fillStyle = C.organ; for (const [x, y, r] of [[-130, -64, 30], [-70, -70, 34], [-10, -66, 30], [50, -68, 26], [100, -64, 18]]) { const rr = r * clamp(1 - e * 1.4 + (x + 150) / 600 * e, 0, 1); if (rr > 1) { c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill(); } }
      // Larve: weiße C-förmige Made, wächst
      const L = lerp(.35, 1.15, e), lx = lerp(-60, -40, e), chomp = Math.sin(t * 10) * .08;
      c.save(); c.translate(lx, -64); c.scale(L, L);
      c.strokeStyle = C.larva; c.lineWidth = 34; c.lineCap = "round"; c.beginPath(); c.arc(0, 0, 40, -2.6 + chomp, 1.6); c.stroke();
      c.strokeStyle = "rgba(200,170,130,.45)"; c.lineWidth = 3; for (let a = -2.3; a < 1.5; a += .38) { c.beginPath(); c.moveTo(Math.cos(a) * 25, Math.sin(a) * 25); c.lineTo(Math.cos(a) * 56, Math.sin(a) * 56); c.stroke(); }
      c.fillStyle = "#c9895a"; c.beginPath(); c.arc(Math.cos(-2.6 + chomp) * 40, Math.sin(-2.6 + chomp) * 40, 15, 0, 7); c.fill();
      c.restore(); c.globalAlpha = 1;
    }
    c.restore();
    // Halsschild (heller Rand, dunkle Mitte)
    kshape(c, pronotum, C.pron, { rim: "rgba(255,245,210,.7)", shadow: "rgba(90,40,10,.3)", rw: 5, sw: 10 });
    c.fillStyle = "#8f3c18"; c.beginPath(); c.ellipse(142, -86, 36, 18, .28, 0, 7); c.fill(); c.fillStyle = "rgba(255,220,170,.25)"; c.beginPath(); c.ellipse(150, -98, 22, 5, .28, 0, 7); c.fill();
    // Kopf
    kshape(c, headP, C.head, { rim: "rgba(255,200,160,.5)", shadow: "rgba(30,0,10,.3)", rw: 4, sw: 8 });
    // Auge (nierenförmig, groß) + Glanz; Zombie: Glanz weg, Spirale
    c.save(); c.translate(HEAD[0] + 4, HEAD[1] - 12); c.rotate(-.35);
    const blink = Math.sin(t * 1.6 + .7) > .985 && !z ? .2 : 1; c.scale(1, blink); c.globalAlpha = 1 - (o.brain || 0);
    c.fillStyle = "#14101e"; c.beginPath(); c.ellipse(0, 0, 11, 15, 0, 0, 7); c.fill();
    if (z < .5) { c.fillStyle = "#fff"; c.beginPath(); c.arc(-3, -6, 4.2, 0, 7); c.fill(); c.beginPath(); c.arc(4, 5, 1.6, 0, 7); c.fill(); }
    if (z > 0) { c.globalAlpha = z; c.strokeStyle = `rgb(${C.venom})`; c.lineWidth = 1.8; c.beginPath(); for (let a = 0; a < 12; a += .3) { const r = a * .9, aa = a - t * 4; c.lineTo(Math.cos(aa) * r, Math.sin(aa) * r * 1.3); } c.stroke(); }
    c.restore();
    // Gehirn-Schnitt
    if (o.brain) { c.save(); headP(c); c.clip(); c.globalAlpha = o.brain; c.fillStyle = "rgba(25,6,18,.8)"; c.beginPath(); c.ellipse(HEAD[0], HEAD[1] - 8, 20, 24, -.35, 0, 7); c.fill();
      kshape(c, ell(HEAD[0] - 5, HEAD[1] - 14, 13, 11), C.brain, { rim: "rgba(255,230,240,.7)", shadow: "rgba(120,20,60,.3)", rw: 2, sw: 3 });
      kshape(c, ell(HEAD[0] + 9, HEAD[1] - 8, 12, 10), C.brain, { rim: "rgba(255,230,240,.7)", shadow: "rgba(120,20,60,.3)", rw: 2, sw: 3 });
      c.strokeStyle = C.brainD; c.lineWidth = 1.2; c.beginPath(); c.moveTo(HEAD[0] - 12, HEAD[1] - 10); c.quadraticCurveTo(HEAD[0] - 6, HEAD[1] - 16, HEAD[0], HEAD[1] - 9); c.stroke();
      if (o.venom) { c.globalCompositeOperation = "lighter"; const gr = c.createRadialGradient(HEAD[0], HEAD[1] - 8, 0, HEAD[0], HEAD[1] - 8, 6 + 22 * o.venom); gr.addColorStop(0, `rgba(${C.venom},.9)`); gr.addColorStop(1, `rgba(${C.venom},0)`); c.fillStyle = gr; c.fillRect(150, -90, 100, 100); }
      c.restore(); }
    // Mundwerkzeuge
    c.fillStyle = C.roachD; c.beginPath(); c.ellipse(HEAD[0] + 10, HEAD[1] + 26, 6, 10, -.3, 0, 7); c.fill();
    // nahe Beine
    roachLeg(c, -70, -30, wk, 165, -1, C.leg, 12, 0); roachLeg(c, 30, -28, wk + 2.1, 105, 1, C.leg, 12, 0); roachLeg(c, 110, -30, wk + 4.2, 100, 1, C.leg, 11, o.limp || 0);
    // Fühler (sehr lang, dünn, wippen; Zombie: hängen)
    const sway = Math.sin(t * 2.4) * 20 * (1 - z), droop = z * 120;
    c.strokeStyle = C.ant; c.lineWidth = 4.5; c.lineCap = "round";
    const a0 = [HEAD[0] + 10, HEAD[1] - 26];
    if (o.leash) { const [lx, ly] = o.leash; c.beginPath(); c.moveTo(a0[0], a0[1]); c.quadraticCurveTo((a0[0] + lx) / 2, Math.min(a0[1], ly) - 30 + Math.sin(t * 3) * 6, lx, ly); c.stroke();
      if (o.leashGlow) { c.save(); c.globalCompositeOperation = "lighter"; c.strokeStyle = `rgba(255,220,120,${.5 * o.leashGlow})`; c.lineWidth = 8; c.stroke(); c.restore(); } }
    else { const L = o.stub ? .35 : 1; c.beginPath(); c.moveTo(a0[0], a0[1]); c.bezierCurveTo(a0[0] + 120 * L, a0[1] - 120 * L + droop * .4, a0[0] + 260 * L, a0[1] - 60 * L + droop * L + sway, a0[0] + 380 * L, a0[1] - 10 * L + droop * L + sway * 1.4); c.stroke(); }
    c.beginPath(); c.moveTo(a0[0] - 4, a0[1]); c.bezierCurveTo(a0[0] + 90, a0[1] - 170 + droop * .5, a0[0] + 230, a0[1] - 220 + droop + sway, a0[0] + 330, a0[1] - 190 + droop * 1.3 - sway); c.stroke();
    c.restore();
  }
  function rAt(x, y, s, o) { g.save(); g.translate(x, y); g.scale(s, s); roach(g, o); g.restore(); }

  // ---------- Juwelwespe: Seitenansicht, Kopf nach rechts, Boden y=0, Länge ~300 ----------
  // o: t, walk (negativ = rückwärts), curl (Hinterleib nach vorn unten, 0..1), fly, bite, shine
  function waspLeg(c, hx, hy, ph, reach, dir, femCol, w) {
    const sw = Math.sin(ph) * 16, lift = Math.max(0, Math.cos(ph)) * 12;
    const kx = hx + dir * reach * .5 + sw * .3, ky = hy - 30 - lift * .4, fx = hx + dir * reach + sw, fy = -lift;
    c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = femCol; c.lineWidth = w; c.beginPath(); c.moveTo(hx, hy); c.lineTo(kx, ky); c.stroke();
    c.strokeStyle = C.wLegD; c.lineWidth = w * .6; c.beginPath(); c.moveTo(kx, ky); c.lineTo(fx, fy); c.lineTo(fx + dir * 16, fy); c.stroke();
  }
  function metal(c, x0, y0, x1, y1, t) { const gr = c.createLinearGradient(x0, y0, x1, y1), s = (Math.sin(t * 1.3) + 1) * .5;
    gr.addColorStop(0, C.wB); gr.addColorStop(clamp(.35 + .2 * s, 0, 1), C.wG); gr.addColorStop(clamp(.55 + .2 * s, 0, 1), "#7dffc8"); gr.addColorStop(1, C.wB); return gr; }
  function wasp(c, o) {
    const t = o.t || 0, wk = (o.walk || 0) * t * 12, cu = o.curl || 0, br = Math.sin(t * 3) * .012;
    c.save(); c.scale(1 + br, 1 - br);
    c.save(); c.globalAlpha = .3; c.fillStyle = "#0b0618"; c.beginPath(); c.ellipse(-10, 4, 150, 10, 0, 0, 7); c.fill(); c.restore();
    // ferne Beine
    waspLeg(c, 52, -66, wk + 1, 70, 1, "#2a6a5a", 7); waspLeg(c, 18, -62, wk + 3, 70, -1, "#b8402c", 8); waspLeg(c, -8, -64, wk + 5, 100, -1, "#b8402c", 8);
    // Hinterleib (Gaster) an Stiel, dreht sich zum Stechen nach vorn unten
    c.save(); c.translate(-36, -80); c.rotate(-cu * 2.1);
    c.strokeStyle = C.wD; c.lineWidth = 10; c.lineCap = "round"; c.beginPath(); c.moveTo(0, 0); c.lineTo(-32, 4); c.stroke(); // Stiel
    const gas = (c) => { c.beginPath(); c.moveTo(-28, 2); c.bezierCurveTo(-40, -44, -140, -46, -170, -4); c.bezierCurveTo(-176, 8, -160, 22, -140, 26); c.bezierCurveTo(-90, 40, -40, 34, -28, 2); c.closePath(); };
    kshape(c, gas, metal(c, -170, -40, -30, 30, t), { rim: "rgba(220,255,240,.75)", shadow: "rgba(0,20,60,.35)", rw: 6, sw: 14 });
    c.save(); gas(c); c.clip(); c.strokeStyle = "rgba(0,30,60,.3)"; c.lineWidth = 4; for (const x of [-70, -105, -138]) { c.beginPath(); c.ellipse(x, 0, 10, 50, 0, -1.3, 1.3); c.stroke(); } c.restore();
    c.strokeStyle = "#2b1d14"; c.lineWidth = 3; c.beginPath(); c.moveTo(-170, 6); c.lineTo(-170 - 18 - (o.sting || 0) * 30, 10); c.stroke(); // Stachel
    if (o.sting) { c.save(); c.globalCompositeOperation = "lighter"; const gr = c.createRadialGradient(-190 - o.sting * 30, 10, 0, -190 - o.sting * 30, 10, 40); gr.addColorStop(0, `rgba(${C.venom},.9)`); gr.addColorStop(1, `rgba(${C.venom},0)`); c.fillStyle = gr; c.fillRect(-260, -40, 120, 100); c.restore(); }
    c.restore();
    // Brust
    const tho = (c) => { c.beginPath(); c.ellipse(16, -88, 56, 34, -.05, 0, 7); };
    kshape(c, tho, metal(c, -40, -120, 70, -50, t + 1), { rim: "rgba(220,255,240,.75)", shadow: "rgba(0,20,60,.35)", rw: 6, sw: 12 });
    c.fillStyle = "rgba(255,255,255,.25)"; c.beginPath(); c.ellipse(28, -112, 26, 6, -.1, 0, 7); c.fill();
    // Flügel (rauchig, durchsichtig)
    const fl = o.fly ? Math.sin(t * 60) : 0;
    c.save(); c.translate(20, -112); c.rotate(.1 + (o.fly ? -.5 + fl * .5 : 0)); c.scale(1, o.fly ? .6 + .4 * Math.abs(fl) : 1);
    c.fillStyle = "rgba(190,215,240,.32)"; c.beginPath(); c.ellipse(-80, -10, 95, 22, .08, 0, 7); c.fill();
    c.fillStyle = "rgba(190,215,240,.22)"; c.beginPath(); c.ellipse(-70, 6, 80, 16, .14, 0, 7); c.fill();
    c.strokeStyle = "rgba(60,80,120,.45)"; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -4); c.lineTo(-150, -16); c.moveTo(-20, 0); c.quadraticCurveTo(-80, 6, -130, -2); c.stroke();
    c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(-90, -18, 40, 4, .05, 0, 7); c.fill();
    c.restore();
    // Hals + Kopf
    kshape(c, ell(76, -92, 18, 17), metal(c, 60, -110, 94, -74, t), { rim: "rgba(220,255,240,.7)", rw: 4, sw: 6 });
    const bt = o.bite ? Math.sin(t * 12) * .5 + .5 : 0;
    kshape(c, ell(112, -96, 32, 30, .2), metal(c, 80, -126, 140, -66, t + 2), { rim: "rgba(220,255,240,.75)", shadow: "rgba(0,20,60,.35)", rw: 5, sw: 8 });
    // Mandibeln
    c.fillStyle = "#1a2b3a"; c.save(); c.translate(136, -78); c.rotate(.5 - bt * .6); c.beginPath(); c.moveTo(0, -4); c.quadraticCurveTo(16, -2, 18, 10); c.lineTo(4, 6); c.fill(); c.restore();
    c.save(); c.translate(134, -74); c.rotate(.9 + bt * .5); c.beginPath(); c.moveTo(0, -4); c.quadraticCurveTo(16, -2, 18, 10); c.lineTo(4, 6); c.fill(); c.restore();
    // Fühler (gebogen, nach vorn)
    c.strokeStyle = "#16222f"; c.lineWidth = 4.5; c.lineCap = "round"; const as = Math.sin(t * 3) * 8;
    c.beginPath(); c.moveTo(126, -120); c.quadraticCurveTo(150, -175, 190 + as, -160); c.quadraticCurveTo(212, -150, 214 + as, -122); c.stroke();
    c.beginPath(); c.moveTo(120, -122); c.quadraticCurveTo(136, -186, 172 - as, -186); c.stroke();
    // Auge
    fig.eye(c, 118, -102, 15, { t, seed: 2, look: o.look || .4 });
    // nahe Beine: vorn grün-dunkel, Mitte + hinten mit roten Schenkeln
    waspLeg(c, 58, -64, wk, 72, 1, "#1f7a68", 9); waspLeg(c, 22, -60, wk + 2.1, 74, -1, C.wLeg, 10); waspLeg(c, -6, -62, wk + 4.2, 108, -1, C.wLeg, 10);
    // Metall-Glitzer
    if (o.shine) { c.save(); c.globalCompositeOperation = "lighter"; for (let i = 0; i < 6; i++) { const p = (t * .6 + i / 6) % 1, x = -150 + i * 50, y = -70 - 40 * Math.sin(i * 2.1); c.globalAlpha = o.shine * Math.sin(p * Math.PI);
      c.fillStyle = "#eafff6"; c.beginPath(); c.moveTo(x, y - 14); c.lineTo(x + 3, y - 3); c.lineTo(x + 14, y); c.lineTo(x + 3, y + 3); c.lineTo(x, y + 14); c.lineTo(x - 3, y + 3); c.lineTo(x - 14, y); c.lineTo(x - 3, y - 3); c.fill(); } c.restore(); }
    c.restore();
  }
  // s<0 spiegelt (Kopf nach links)
  function wAt(x, y, s, o) { g.save(); g.translate(x, y); g.scale(s, Math.abs(s)); wasp(g, o); g.restore(); }
  // Mandibel-Position der Wespe in Weltkoordinaten
  const mand = (x, y, s) => [x + 138 * s, y - 76 * Math.abs(s)];

  // ---------- Leine: Wespe läuft rückwärts, Schabe folgt (Hook, Loop, Leine) ----------
  function leashScene(lt, t, o) {
    o = o || {};
    const v = 140, off = t * v; // Boden zieht vorbei -> beide laufen nach rechts
    ground(-1600, 1800, off);
    const rx = -250, wx = 280, ws = -.95, m = mand(wx, 0, ws);
    rAt(rx, 0, 1, { t, walk: .8, zombie: o.zombie ?? .6, leash: [(m[0] - rx), m[1]], leashGlow: o.glow || 0 });
    wAt(wx, 0, ws, { t, walk: -.9, bite: 1, look: .6 });
  }
  const HOOK = [30, -105, 1.7];
  KZ.shot("wHook", (lt, d, t) => { bg(t, t * 40); const k = sm(lt / d); cam(lerp(HOOK[0], 70, k), lerp(HOOK[1], -100, k), lerp(HOOK[2], 1.75, k));
    leashScene(lt, t, { glow: .6 + .4 * Math.sin(t * 5) }); });
  KZ.shot("wLoop", (lt, d, t) => { bg(t, t * 40); const k = sm(lt / d); cam(lerp(-40, HOOK[0], k), lerp(-90, HOOK[1], k), lerp(1.35, HOOK[2], k));
    leashScene(lt, t, { glow: sm((lt - d * .5) / (d * .5)) }); });

  KZ.shot("wBigger", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(0, 40, k), lerp(-150, -130, k), lerp(1.25, 1.4, k));
    ground(-1600, 1800, 0);
    rAt(-120, 0, 1.15, { t, zombie: 0 });
    const a = sm(lt / (d * .45)); wAt(lerp(700, 350, a), 0, -.8, { t, walk: a < 1 ? 1 : 0, look: .5 });
    // Größenvergleich: Klammern
    const la = sm((lt - d * .45) / .3);
    if (la > 0) { g.save(); g.globalAlpha = la; g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 6; g.lineCap = "round";
      g.beginPath(); g.moveTo(-430, 60); g.lineTo(-430, 80); g.lineTo(140, 80); g.lineTo(140, 60); g.stroke();
      g.beginPath(); g.moveTo(240, 60); g.lineTo(240, 80); g.lineTo(480, 80); g.lineTo(480, 60); g.stroke(); g.restore();
      label("WAY BIGGER", W * .45, H * .2, la); } });

  KZ.shot("wMeet", (lt, d, t) => { bg(t, lt * 30); const k = sm(lt / d); cam(lerp(-10, 20, k), lerp(-100, -95, k), lerp(2.5, 2.9, k));
    ground(-1000, 1000, 0);
    g.save(); g.globalCompositeOperation = "lighter"; glow(0, -90, 360, "rgba(80,255,190,.18)"); g.restore();
    wAt(0, 0, 1, { t, shine: 1, look: .3 });
    if (lt > d * .25) label("JEWEL WASP", W * .45, H * .2, sm((lt - d * .25) / .25)); });

  KZ.shot("wSting1", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(60, 110, k), lerp(-110, -90, k), lerp(1.75, 2.2, k));
    ground(-1600, 1800, 0);
    const lim = sm((lt - d * .45) / (d * .4));
    rAt(-120, 0, 1, { t, limp: lim, zombie: 0 });
    // Wespe sitzt auf dem Halsschild, Hinterleib nach vorn unten zur Brust gekrümmt
    const cu = sm(lt / (d * .4));
    wAt(-10, -78, .8, { t, curl: .85 * cu, sting: sm((lt - d * .35) / .2), look: -.3 });
    const fa = sm((lt - d * .38) / .15) * (1 - sm((lt - d * .7) / .3));
    if (fa > 0) { g.save(); g.globalCompositeOperation = "lighter"; glow(10, -40, 120, `rgba(${C.venom},${.55 * fa})`); g.restore(); }
    if (lt > d * .5) label("STING 1: CHEST", W * .45, H * .2, sm((lt - d * .5) / .25)); });

  KZ.shot("wBrain", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); const S = 3, rx = -560, hx = rx + HEAD[0] * S, hy = HEAD[1] * S;
    cam(lerp(hx - 40, hx, k), lerp(hy - 10, hy - 20, k), lerp(1.7, 2.1, k));
    ground(-2500, 2500, 0);
    rAt(rx, 0, S, { t, brain: sm(lt / .5), venom: sm((lt - d * .45) / (d * .4)), limp: 1 });
    // Stachel dringt von oben ein
    const p = sm((lt - d * .1) / (d * .35)), sx = hx - 10, sy = hy - 30, ex = lerp(hx - 140, sx, p), ey = lerp(hy - 330, sy, p);
    g.save(); g.translate(ex, ey); g.rotate(Math.atan2(sy - (hy - 330), sx - (hx - 140)));
    kshape(g, (c) => { c.beginPath(); c.moveTo(-60, -60); c.bezierCurveTo(-120, -110, -330, -120, -380, -40); c.bezierCurveTo(-340, 30, -150, 40, -60, 12); c.closePath(); }, metal(g, -380, -100, -60, 30, t), { rim: "rgba(220,255,240,.75)", rw: 7, sw: 14 });
    g.save(); g.beginPath(); g.moveTo(-60, -60); g.bezierCurveTo(-120, -110, -330, -120, -380, -40); g.bezierCurveTo(-340, 30, -150, 40, -60, 12); g.closePath(); g.clip(); g.strokeStyle = "rgba(0,30,60,.35)"; g.lineWidth = 8; for (const x of [-140, -210, -280]) { g.beginPath(); g.ellipse(x, -30, 16, 90, 0, -1.4, 1.4); g.stroke(); } g.restore();
    g.strokeStyle = "#2b1d14"; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(-62, -22); g.lineTo(0, 0); g.stroke();
    g.restore();
    if (lt > d * .45) label("STING 2: BRAIN", W * .45, H * .2, sm((lt - d * .45) / .25)); });

  KZ.shot("wZombie", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(130, 180, k), lerp(-80, -70, k), lerp(2.8, 3.4, k));
    ground(-1600, 1800, 0);
    const z = sm(lt / (d * .6));
    g.save(); g.globalCompositeOperation = "lighter"; glow(200, -60, 160 + 30 * Math.sin(t * 4), `rgba(${C.venom},${.35 * z})`); g.restore();
    rAt(0, 0, 1, { t, zombie: z, brain: .0 });
    if (lt > d * .4) label("ZOMBIE", W * .45, H * .2, sm((lt - d * .4) / .25)); });

  KZ.shot("wNoWill", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(40, 120, k), -110, lerp(1.6, 1.75, k));
    ground(-1600, 1800, 0);
    // Beine zucken kurz, dann nichts
    const tw = lt < d * .4 ? .25 : 0;
    rAt(-60, 0, 1, { t, walk: tw, zombie: 1 });
    const a = sm((lt - d * .15) / .3);
    g.save(); g.globalAlpha = a * (lt > d * .55 ? .35 : 1); g.strokeStyle = "#fff"; g.lineWidth = 10; g.lineCap = "round"; g.setLineDash([2, 26]);
    g.beginPath(); g.moveTo(180, -60); g.lineTo(470, -60); g.stroke(); g.setLineDash([]); g.beginPath(); g.moveTo(440, -90); g.lineTo(475, -60); g.lineTo(440, -30); g.stroke(); g.restore();
    const x = sm((lt - d * .55) / .2);
    if (x > 0) { g.save(); g.globalAlpha = x; g.strokeStyle = "#ff4d6a"; g.lineWidth = 18; g.lineCap = "round"; g.shadowColor = "rgba(255,60,90,.7)"; g.shadowBlur = 20;
      g.beginPath(); g.moveTo(290, -130); g.lineTo(390, 10); g.moveTo(390, -130); g.lineTo(290, 10); g.stroke(); g.restore(); }
    label(lt < d * .55 ? "RUN?" : "NO WILL TO RUN", W * .45, H * .2, a); });

  KZ.shot("wLeash", (lt, d, t) => { bg(t, t * 40); const k = sm(lt / d); cam(lerp(0, 60, k), lerp(-120, -105, k), lerp(1.45, 1.6, k));
    leashScene(lt, t, { glow: sm((lt - d * .35) / .3), zombie: 1 });
    if (lt > d * .35) label("LEASH", W * .45, H * .2, sm((lt - d * .35) / .25)); });

  // Bau im Schnitt: Erde, Höhle, Schabe drin, Wespe klebt Ei ans Mittelbein
  function burrow(t) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = C.soil; g.fillRect(0, 0, W, H);
    g.fillStyle = "rgba(0,0,0,.18)"; for (let i = 0; i < 60; i++) { g.beginPath(); g.ellipse((i * 173) % W, (i * 311) % H, 10 + i % 14, 6 + i % 8, i, 0, 7); g.fill(); } }
  KZ.shot("wEgg", (lt, d, t) => { burrow(t); const k = sm(lt / d); cam(lerp(-40, 30, k), lerp(-80, -55, k), lerp(1.55, 1.95, k));
    kshape(g, ell(-20, -90, 520, 210), C.cave, { rim: "rgba(255,180,200,.12)", shadow: "rgba(0,0,0,.3)", rw: 10, sw: 30 });
    g.save(); g.globalCompositeOperation = "lighter"; glow(60, -60, 260, "rgba(255,200,140,.12)"); g.restore();
    rAt(-100, 50, 1, { t, zombie: 1, stub: true, limp: .5 });
    const a = sm(lt / (d * .35)); wAt(lerp(-420, -175, a), 50, -.75, { t, walk: a < 1 ? 1 : 0, curl: .15 * sm((lt - d * .25) / .3), sting: sm((lt - d * .35) / .2) * .3, look: -.4 });
    const ea = easeBack((lt - d * .5) / .4);
    if (ea > 0) { g.save(); g.globalCompositeOperation = "lighter"; glow(-12, 40, 70, "rgba(255,240,200,.6)"); g.restore();
      g.save(); g.translate(-12, 40); g.rotate(.5); g.scale(ea, ea); kshape(g, ell(0, 0, 18, 8), C.egg, { rim: "rgba(255,255,255,.9)", shadow: "rgba(160,120,80,.35)", rw: 3, sw: 4 }); g.restore(); }
    if (lt > d * .5) label("1 EGG", W * .45, H * .2, sm((lt - d * .5) / .25)); });

  KZ.shot("wLarva", (lt, d, t) => { burrow(t); const k = sm(lt / d); cam(lerp(-40, -20, k), lerp(-90, -75, k), lerp(1.9, 2.4, k));
    kshape(g, ell(-20, -90, 520, 210), C.cave, { rim: "rgba(255,180,200,.12)", shadow: "rgba(0,0,0,.3)", rw: 10, sw: 30 });
    rAt(-20, 50, 1, { t, zombie: 1, stub: true, limp: .5, xray: sm(lt / .5), eaten: sm((lt - d * .2) / (d * .75)) });
    if (lt > d * .4) label("EATEN ALIVE", W * .45, H * .2, sm((lt - d * .4) / .25)); });
})();
