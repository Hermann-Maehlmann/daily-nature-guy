// Szenendatei "The Frog That Hides Its Blood" (Glasfrosch, Hyalinobatrachium fleischmanni). Eigene Figuren: Glasfrosch Seiten- und Bauchansicht, Blatt, Marshmallow, Vogelkopf.
// Quelle: Taboada, Delia et al., Science 378 (2022) 1315, Duke University / AMNH: schlafend ~89 % der roten Blutkörperchen in der Leber, 2-3x durchsichtiger, ohne Gerinnsel.
(function () {
  const { g, W, H, sm, lerp, clamp, easeBack, reef, cam, glow, label, kshape, fig } = window.KZ;
  const ell = (x, y, rx, ry, r) => (c) => { c.beginPath(); c.ellipse(x, y, rx, ry, r || 0, 0, 7); };
  const PAL = { sky: ["#0f4d52", "#0f3f4c", "#0b2f3d", "#061b26"], hills: [["#13463f", "#1b5a4d"], ["#0f3934", "#164a40"], ["#0a2a27", "#103a33"]], corals: false, rays: true, dust: "220,255,190" };
  const C = { skin: "#9be04a", skinD: "#7cc23a", skinL: "#c8f27c", spot: "#f4f7a0", disc: "#d6f78e", iris: "#efe3a6", pupil: "#14182c",
    heart: "#ff3a55", blood: "225,30,60", liver: "#e8f1f6", gut: "#ecd8b4", bone: "rgba(240,252,225,.85)", leaf: "#2f9e4c", leafL: "#57c262", vein: "#86dc74", mm: "#fff5f3", bird: "#24304f" };
  function bg(t, camx) {
    reef(t, camx, 0, 1, PAL);
    // Dschungelblätter im Hintergrund (Bildschirmkoordinaten, leicht unscharf)
    g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.filter = "blur(5px)";
    for (let i = 0; i < 7; i++) { const x = ((i * 233 - camx * .2) % (W + 300) + W + 300) % (W + 300) - 150, y = H * (.12 + (i * 37 % 50) / 100), a = -.6 + (i % 4) * .4 + Math.sin(t * .6 + i) * .04;
      g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = i % 2 ? "rgba(30,110,80,.55)" : "rgba(22,90,70,.6)"; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(60, -70, 220, -60, 300, 0); g.bezierCurveTo(220, 60, 60, 70, 0, 0); g.fill(); g.restore(); }
    g.restore();
  }

  // ---------- Blatt, frontal (liegt hinter dem Frosch), Stiel bei (0,0), Spitze bei (len,0) ----------
  function leafPath(len) { const w = len * .36; return (c) => { c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(len * .2, -w, len * .7, -w * .95, len, 0); c.bezierCurveTo(len * .7, w * .95, len * .2, w, 0, 0); c.closePath(); }; }
  function leafFace(x, y, len, ang, a) {
    g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha = a ?? 1; const p = leafPath(len);
    kshape(g, p, C.leaf, { rim: "rgba(210,255,170,.45)", shadow: "rgba(0,40,30,.3)", rw: 10, sw: 30 });
    g.save(); p(g); g.clip(); g.strokeStyle = C.vein; g.lineCap = "round";
    g.lineWidth = 9; g.beginPath(); g.moveTo(-10, 0); g.quadraticCurveTo(len * .5, -8, len, 0); g.stroke();
    g.lineWidth = 4; for (let i = 1; i < 9; i++) { const x0 = len * i / 9.5; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x0, -4 * (1 - i / 9)); g.quadraticCurveTo(x0 + len * .07, s * len * .1, x0 + len * .16, s * len * .26 * Math.sin(Math.PI * (i / 9.5) + .2)); g.stroke(); } }
    g.restore(); g.restore();
  }
  // Blatt von der Seite (dünn, leicht gewölbt), Unterseite bei y=0
  function leafEdge(x0, x1, sag) {
    const path = (c) => { c.beginPath(); c.moveTo(x0, -34); c.quadraticCurveTo((x0 + x1) / 2, -34 + sag, x1, -44); c.lineTo(x1 + 20, -22); c.quadraticCurveTo((x0 + x1) / 2, sag + 6, x0, 2); c.closePath(); };
    kshape(g, path, C.leaf, { rim: "rgba(210,255,170,.55)", shadow: "rgba(0,40,30,.35)", rw: 6, sw: 12 });
  }

  // ---------- Glasfrosch, Seitenansicht, Kopf nach rechts, Boden y=0, Länge ~300 ----------
  // o.trans: 0 normal .. 1 fast unsichtbar; o.blood: 0..1 rote Blutkörperchen sichtbar
  function frogSide(c, o) {
    const t = o.t || 0, tr = o.trans || 0, bl = o.blood ?? 1, br = Math.sin(t * 2.6) * .015, beat = Math.max(0, Math.sin(t * 9));
    const al = 1 - .62 * tr;
    c.save(); c.scale(1 + br, 1 - br);
    c.save(); c.globalAlpha = .3 * al; c.fillStyle = "#04150f"; c.beginPath(); c.ellipse(0, 3, 150, 10, 0, 0, 7); c.fill(); c.restore();
    c.globalAlpha = al;
    // ferner Hinterfuß
    c.strokeStyle = C.skinD; c.lineCap = "round"; c.lineJoin = "round"; c.lineWidth = 12; c.beginPath(); c.moveTo(-120, -10); c.lineTo(-60, -3); c.stroke();
    // Körper
    const body = (c) => { c.beginPath(); c.moveTo(-145, -35); c.bezierCurveTo(-140, -110, -60, -132, 20, -122); c.bezierCurveTo(80, -114, 130, -98, 152, -58);
      c.bezierCurveTo(160, -40, 148, -24, 120, -20); c.bezierCurveTo(60, -8, -60, -4, -110, -12); c.bezierCurveTo(-135, -16, -147, -24, -145, -35); c.closePath(); };
    kshape(c, body, C.skin, { rim: "rgba(240,255,200,.6)", shadow: "rgba(10,60,30,.28)", rw: 6, sw: 16 });
    // durchsichtiger Bauch mit Organen
    c.save(); body(c); c.clip();
    c.fillStyle = "rgba(225,255,215,.5)"; c.beginPath(); c.ellipse(15, -20, 120, 26, 0, 0, 7); c.fill();
    c.globalAlpha = al; c.fillStyle = C.liver; c.beginPath(); c.ellipse(20, -26, 34, 12, 0, 0, 7); c.fill();
    c.fillStyle = C.gut; c.beginPath(); c.ellipse(-50, -24, 30, 10, 0, 0, 7); c.fill();
    c.globalAlpha = al * (.35 + .65 * bl); c.fillStyle = C.heart; c.beginPath(); c.arc(75, -30, 11 + 2 * beat, 0, 7); c.fill();
    c.strokeStyle = `rgba(${C.blood},${.8 * bl})`; c.lineWidth = 3.5; c.beginPath(); c.moveTo(75, -30); c.quadraticCurveTo(0, -60, -120, -40); c.moveTo(75, -30); c.quadraticCurveTo(110, -70, 130, -66); c.moveTo(75, -30); c.lineTo(100, -10); c.stroke();
    c.globalAlpha = al;
    // Punkte auf dem Rücken
    c.fillStyle = C.spot; for (const [x, y, r] of [[-95, -78, 6], [-45, -96, 7], [5, -100, 5], [-60, -66, 5], [-10, -80, 6], [40, -92, 5], [-110, -50, 4]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
    c.restore();
    c.globalAlpha = al;
    // Mund
    c.strokeStyle = "rgba(40,90,30,.7)"; c.lineWidth = 3; c.beginPath(); c.moveTo(148, -46); c.quadraticCurveTo(125, -40, 100, -44); c.stroke();
    // Vorderbein mit Haftscheiben
    c.strokeStyle = C.skinD; c.lineWidth = 16; c.beginPath(); c.moveTo(92, -34); c.lineTo(84, -14); c.lineTo(104, -4); c.stroke();
    c.fillStyle = C.disc; for (const [x, y] of [[100, -2], [113, 0], [125, -3]]) { c.beginPath(); c.arc(x, y, 6.5, 0, 7); c.fill(); }
    // Hinterbein: Oberschenkel nach vorn, Unterschenkel zurück, Fuß nach vorn
    kshape(c, ell(-92, -40, 62, 26, .35), C.skin, { rim: "rgba(240,255,200,.55)", shadow: "rgba(10,60,30,.25)", rw: 5, sw: 10 });
    c.strokeStyle = C.skin; c.lineWidth = 20; c.beginPath(); c.moveTo(-42, -20); c.lineTo(-136, -10); c.stroke();
    c.strokeStyle = C.skinD; c.lineWidth = 12; c.beginPath(); c.moveTo(-136, -10); c.lineTo(-40, -3); c.stroke();
    c.fillStyle = C.disc; for (const [x, y] of [[-38, -3], [-48, 2], [-28, 0]]) { c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill(); }
    // Auge: groß, oben auf dem Kopf, nach vorn gerichtet
    const ex = 96, ey = -104, blink = Math.sin(t * 1.7 + 1.3) > .985 ? .15 : 1;
    kshape(c, ell(ex, ey, 34, 32), C.skin, { rim: "rgba(240,255,200,.6)", rw: 5, sw: 8 });
    c.save(); c.translate(ex + 4, ey - 2); c.scale(1, blink);
    c.fillStyle = C.iris; c.beginPath(); c.arc(0, 0, 26, 0, 7); c.fill();
    c.strokeStyle = "rgba(150,130,70,.5)"; c.lineWidth = 2; for (let k = 0; k < 10; k++) { const a = k * .63; c.beginPath(); c.moveTo(Math.cos(a) * 14, Math.sin(a) * 14); c.lineTo(Math.cos(a) * 24, Math.sin(a) * 24); c.stroke(); }
    c.fillStyle = C.pupil; c.beginPath(); c.ellipse(4 + (o.look || 0) * 4, 1, 14, 9, 0, 0, 7); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(-4, -8, 6, 0, 7); c.fill(); c.beginPath(); c.arc(10, 8, 2.5, 0, 7); c.fill();
    c.restore();
    c.restore();
  }
  function fSide(x, y, s, o, flipY) { g.save(); g.translate(x, y); g.scale(s, flipY ? -s : s); frogSide(g, o); g.restore(); }

  // ---------- Glasfrosch, Bauchansicht (von unten), Kopf oben, Mitte (0,0), Länge ~430 ----------
  const VES = [ // Blutgefäße ab Herz (0,-75)
    [[0, -75], [-40, -120], [-70, -170]], [[0, -75], [40, -120], [70, -170]],
    [[0, -75], [-80, -85], [-145, -65], [-170, -140]], [[0, -75], [80, -85], [145, -65], [170, -140]],
    [[0, -75], [-24, -20], [-26, 60], [-80, 115], [-195, 75], [-150, 200]], [[0, -75], [24, -20], [26, 60], [80, 115], [195, 75], [150, 200]]];
  function polyPt(P, u) { let L = 0; const seg = []; for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(l); L += l; }
    let d = u * L; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const k = d / seg[i]; return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k)]; } d -= seg[i]; } return P[P.length - 1]; }
  const bodyV = (c) => { c.beginPath(); c.moveTo(0, -215); c.bezierCurveTo(80, -215, 125, -170, 120, -110); c.bezierCurveTo(140, -40, 145, 60, 110, 130);
    c.bezierCurveTo(80, 175, -80, 175, -110, 130); c.bezierCurveTo(-145, 60, -140, -40, -120, -110); c.bezierCurveTo(-125, -170, -80, -215, 0, -215); c.closePath(); };
  const LIV = [[-46, -14], [46, -14]];
  function frogBelly(c, o) {
    const t = o.t || 0, bl = o.blood ?? 1, lv = o.liver || 0, beat = Math.max(0, Math.sin(t * 9)), br = Math.sin(t * 2.6) * .012;
    c.save(); c.scale(1 + br, 1 - br); c.lineCap = "round"; c.lineJoin = "round";
    // Beine (mit sichtbaren Knochen)
    const legs = [[[-85, -80], [-150, -60], [-172, -140]], [[85, -80], [150, -60], [172, -140]], [[-85, 110], [-200, 72], [-150, 200], [-215, 270]], [[85, 110], [200, 72], [150, 200], [215, 270]]];
    for (const L of legs) { c.strokeStyle = C.skinD; c.lineWidth = 36; c.beginPath(); L.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
      c.strokeStyle = C.skin; c.lineWidth = 26; c.stroke(); c.strokeStyle = C.bone; c.lineWidth = 6; c.stroke();
      const e = L[L.length - 1], p = L[L.length - 2], a = Math.atan2(e[1] - p[1], e[0] - p[0]);
      for (let k = -1.5; k <= 1.5; k++) { const aa = a + k * .42, tx = e[0] + Math.cos(aa) * 42, ty = e[1] + Math.sin(aa) * 42;
        c.strokeStyle = C.skin; c.lineWidth = 9; c.beginPath(); c.moveTo(e[0], e[1]); c.lineTo(tx, ty); c.stroke(); c.fillStyle = C.disc; c.beginPath(); c.arc(tx, ty, 9, 0, 7); c.fill(); } }
    // Augen ragen seitlich heraus
    for (const s of [-1, 1]) { kshape(c, ell(s * 96, -158, 36, 34), C.skin, { rim: "rgba(240,255,200,.6)", rw: 5, sw: 8 }); c.fillStyle = C.iris; c.beginPath(); c.arc(s * 104, -160, 22, 0, 7); c.fill(); c.fillStyle = C.pupil; c.beginPath(); c.ellipse(s * 106, -160, 11, 7, 0, 0, 7); c.fill(); }
    // Körper: grüner Rücken scheint durch, Bauchhaut fast klar
    kshape(c, bodyV, "#7fca47", { rim: "rgba(240,255,200,.55)", shadow: "rgba(10,60,30,.25)", rw: 7, sw: 18 });
    c.save(); bodyV(c); c.clip();
    c.fillStyle = "rgba(190,240,160,.35)"; c.beginPath(); c.ellipse(0, 10, 105, 150, 0, 0, 7); c.fill();
    // Darm
    c.strokeStyle = C.gut; c.lineWidth = 18; c.beginPath(); c.moveTo(-50, 50); c.bezierCurveTo(-70, 90, 10, 110, 30, 80); c.bezierCurveTo(60, 50, 70, 120, 20, 135); c.bezierCurveTo(-20, 145, -40, 120, -30, 110); c.stroke();
    // Gefäße
    if (bl > .01) { c.save(); c.globalCompositeOperation = "lighter"; c.strokeStyle = `rgba(${C.blood},${.35 * bl})`; c.lineWidth = 18; for (const P of VES) { c.beginPath(); P.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); } c.restore(); }
    c.strokeStyle = `rgba(${C.blood},${.05 + .9 * bl})`; c.lineWidth = 7; for (const P of VES) { c.beginPath(); P.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
    // Blutkörperchen im Kreislauf
    const nCells = Math.round(5 * bl);
    for (const P of VES) for (let i = 0; i < nCells; i++) { const u = (t * .35 + i / 5) % 1, q = polyPt(P, u); c.fillStyle = "#ff2b4a"; c.beginPath(); c.ellipse(q[0], q[1], 6, 4, u * 6, 0, 7); c.fill(); }
    // Zellen wandern in die Leber
    if (o.flow) for (const P of VES) for (let i = 0; i < 4; i++) { const u = 1 - ((t * .5 + i / 4) % 1); const q = polyPt(P, u); const L = LIV[P[2][0] < 0 ? 0 : 1], k = sm(1 - u);
      c.globalAlpha = o.flow; c.fillStyle = "#ff2b4a"; c.beginPath(); c.ellipse(lerp(q[0], L[0], k * k), lerp(q[1], L[1], k * k), 6, 4, 0, 0, 7); c.fill(); c.globalAlpha = 1; }
    // Leber: verspiegelt, schwillt beim Einlagern an
    const ls = 1 + .45 * lv;
    for (const [lx, ly] of LIV) { const path = ell(lx, ly, 50 * ls, 38 * ls, lx < 0 ? .3 : -.3);
      kshape(c, path, C.liver, { rim: "rgba(255,255,255,.9)", shadow: "rgba(90,120,150,.35)", rw: 6, sw: 14 });
      if (lv > 0) { c.save(); path(c); c.clip(); const n = Math.round(lv * 40); for (let i = 0; i < n; i++) { const a = i * 2.4, r = Math.sqrt(i / 40) * 44 * ls;
          c.fillStyle = `rgba(230,60,90,${.55})`; c.beginPath(); c.ellipse(lx + Math.cos(a + (o.swirl ? t * .6 : 0)) * r, ly + Math.sin(a + (o.swirl ? t * .6 : 0)) * r * .75, 7, 5, a, 0, 7); c.fill(); }
        // Spiegel-Glanz verdeckt die Zellen
        const sh = c.createLinearGradient(lx - 60, ly - 50, lx + 60, ly + 50); sh.addColorStop(0, "rgba(255,255,255,.55)"); sh.addColorStop(.5, "rgba(210,230,245,.25)"); sh.addColorStop(1, "rgba(255,255,255,.5)"); c.fillStyle = sh; c.fillRect(lx - 90, ly - 80, 180, 160); c.restore(); } }
    // Herz
    const hr = 30 * (1 + .14 * beat);
    if (bl > .1) { c.save(); c.globalCompositeOperation = "lighter"; c.globalAlpha = bl; glowC(c, 0, -75, hr * 2.6, "rgba(255,60,90,.5)"); c.restore(); }
    kshape(c, (c) => { c.beginPath(); c.moveTo(0, -75 + hr); c.bezierCurveTo(-hr * 1.4, -75, -hr * .9, -75 - hr * 1.1, 0, -75 - hr * .45); c.bezierCurveTo(hr * .9, -75 - hr * 1.1, hr * 1.4, -75, 0, -75 + hr); c.closePath(); },
      bl > .5 ? C.heart : "#ff8fa0", { rim: "rgba(255,220,220,.7)", shadow: "rgba(90,0,20,.3)", rw: 4, sw: 8 });
    c.restore();
    // Glanz auf der Bauchhaut
    c.save(); bodyV(c); c.clip(); c.fillStyle = "rgba(255,255,255,.12)"; c.beginPath(); c.ellipse(50, -90, 40, 110, -.3, 0, 7); c.fill(); c.restore();
    c.restore();
  }
  function glowC(c, x, y, r, col) { const gr = c.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  function fBelly(x, y, s, o) { g.save(); g.translate(x, y); g.scale(s, s); frogBelly(g, o); g.restore(); }

  // Glasscheibe / Blatt-Hintergrund für die Bauchansicht
  function glassBg(t) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(10,40,35,.35)"; g.fillRect(0, 0, W, H); }

  // ---------- Hook-Bild (auch Loop-Ende): Nahaufnahme Bauch, Herz + Gefäße ----------
  const HOOK0 = [10, -110, 2.2];
  KZ.shot("gHook", (lt, d, t) => { bg(t, 0); glassBg(t); const k = sm(lt / d); cam(lerp(HOOK0[0], 0, k), lerp(HOOK0[1], -115, k), lerp(HOOK0[2], 2.5, k));
    fBelly(0, 0, 1, { t, blood: 1 - .85 * sm((lt - d * .45) / (d * .45)) }); });
  KZ.shot("gLoop", (lt, d, t) => { bg(t, 0); glassBg(t); const k = sm(lt / d); cam(lerp(0, HOOK0[0], k), lerp(40, HOOK0[1], k), lerp(1.25, HOOK0[2], k));
    fBelly(0, 0, 1, { t, blood: sm((lt - d * .2) / (d * .6)) }); });

  KZ.shot("gInvisible", (lt, d, t) => { bg(t, lt * 30); const k = sm(lt / d); cam(lerp(-10, 15, k), -85, lerp(2.6, 2.9, k));
    leafFace(-420, 170, 900, -.12); const tr = sm((lt - d * .15) / (d * .6));
    fSide(0, 0, 1, { t, trans: tr, blood: 1 - tr, look: .4 });
    if (lt > d * .55) label("INVISIBLE?", W * .45, H * .2, sm((lt - d * .55) / .25)); });

  function marshmallow(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = "#f3dede"; g.beginPath(); g.ellipse(0, -130, 95, 26, 0, 0, 7); g.fill();
    kshape(g, (c) => { c.beginPath(); c.roundRect(-95, -130, 190, 130, 30); }, C.mm, { rim: "rgba(255,255,255,.9)", shadow: "rgba(200,120,140,.35)", rw: 6, sw: 22 });
    kshape(g, ell(0, -130, 95, 26), "#fffafa", { rim: "rgba(255,255,255,.9)", shadow: "rgba(200,140,150,.25)", rw: 4, sw: 8 });
    g.fillStyle = "rgba(255,255,255,.7)"; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(-70 + (i * 41 % 140), -100 + (i * 29 % 80), 3, 0, 7); g.fill(); } g.restore(); }
  KZ.shot("gMeet", (lt, d, t) => { bg(t, lt * 40); const k = sm(lt / d); cam(lerp(-80, -55, k), -110, lerp(1.75, 1.85, k));
    leafFace(-650, 120, 1000, -.08);
    const hop = Math.max(0, Math.sin(clamp(lt / (d * .35), 0, 1) * Math.PI)), hx = lerp(-60, 30, sm(lt / (d * .35)));
    fSide(hx, -hop * 70, 1, { t, look: .3 });
    marshmallow(-270, 0, easeBack((lt - d * .35) / .4) * 1);
    if (lt > d * .2) label("GLASS FROG", W * .45, H * .2, sm((lt - d * .2) / .25)); });

  KZ.shot("gHeart", (lt, d, t) => { bg(t, 0); glassBg(t); const k = sm(lt / d); cam(lerp(0, 0, k), lerp(0, -60, k), lerp(1.2, 2.2, k));
    fBelly(0, 0, 1, { t, blood: 1 });
    if (lt > d * .4) label("HEART", W * .45, H * .2, sm((lt - d * .4) / .25)); });

  KZ.shot("gSleep", (lt, d, t) => { bg(t, lt * 30); const k = sm(lt / d); cam(lerp(-10, 10, k), lerp(40, 55, k), lerp(2.4, 2.75, k));
    g.save(); g.globalCompositeOperation = "lighter"; glow(60, -260, 420, "rgba(255,250,200,.25)"); g.restore();
    leafEdge(-620, 560, 50);
    fSide(0, 12 + 24 * (1 - sm(lt / (d * .4))), 1, { t: t * .5, trans: .25, blood: .9 }, true);
    // Zzz
    const za = sm((lt - d * .45) / .3); g.save(); g.globalAlpha = za; g.fillStyle = "#fff"; g.font = '800 46px "Montserrat"';
    for (let i = 0; i < 3; i++) { const p = (lt * .5 + i / 3) % 1; g.globalAlpha = za * Math.sin(p * Math.PI); g.font = `800 ${30 + i * 10}px "Montserrat"`; g.fillText("z", -170 - p * 50, 150 - p * 90); }
    g.restore();
    if (lt > d * .55) label("UPSIDE DOWN", W * .45, H * .2, sm((lt - d * .55) / .25)); });

  function birdHead(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s);
    kshape(g, (c) => { c.beginPath(); c.moveTo(-400, -160); c.bezierCurveTo(-120, -220, 60, -120, 70, -10); c.lineTo(210, 30); c.lineTo(60, 60); c.bezierCurveTo(20, 150, -200, 190, -400, 160); c.closePath(); }, "#4a5d96", { rim: "rgba(190,210,255,.6)", shadow: "rgba(0,0,20,.35)", rw: 8, sw: 22 });
    kshape(g, (c) => { c.beginPath(); c.moveTo(60, -10); c.lineTo(230, 28); c.lineTo(60, 52); c.closePath(); }, "#ffb23a", { rim: "rgba(255,240,200,.6)", rw: 5, sw: 10 });
    g.fillStyle = "#ffd54d"; g.beginPath(); g.arc(-40, -30, 40, 0, 7); g.fill(); g.fillStyle = "#0d1020"; g.beginPath(); g.arc(-30, -30, 22, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(-40, -42, 9, 0, 7); g.fill(); g.restore(); }
  KZ.shot("gGiveAway", (lt, d, t) => { bg(t, 0); const k = sm(lt / d); cam(lerp(20, -60, k), -110, lerp(1.9, 1.7, k));
    leafFace(-380, 160, 900, -.1);
    const pulse = .5 + .5 * Math.sin(t * 9);
    g.save(); g.globalCompositeOperation = "lighter"; glow(60, -40, 140 + 30 * pulse, "rgba(255,40,70,.45)"); g.restore();
    fSide(60, 0, 1.25, { t, trans: .45, blood: 1, look: -.5 });
    const b = sm((lt - d * .05) / (d * .45)); birdHead(lerp(-750, -230, b), -170, .8, t);
    if (lt > d * .5) label("SPOTTED!", W * .45, H * .2, sm((lt - d * .5) / .25)); });

  KZ.shot("gLiver", (lt, d, t) => { bg(t, 0); glassBg(t); const k = sm(lt / d); cam(0, lerp(-20, 0, k), lerp(1.5, 1.9, k)); const p = sm(lt / (d * .85));
    fBelly(0, 0, 1, { t, blood: 1 - p, liver: p, flow: sm(lt / .4) * (1 - sm((lt - d * .8) / (d * .2))) });
    if (lt > d * .45) label("LIVER", W * .45, H * .2, sm((lt - d * .45) / .25)); });

  KZ.shot("gNinety", (lt, d, t) => { bg(t, 0); glassBg(t); const k = sm(lt / d); cam(0, lerp(0, -15, k), lerp(1.9, 2.3, k));
    fBelly(0, 0, 1, { t, blood: 0, liver: 1, swirl: true });
    g.save(); g.globalCompositeOperation = "lighter"; for (const [x, y] of LIV) glow(x, y, 110, "rgba(255,240,255,.25)"); g.restore();
    label(Math.round(lerp(0, 89, sm(lt / (d * .7)))) + "% OF RED CELLS", W * .45, H * .2, sm(lt / .25)); });

  KZ.shot("gClear", (lt, d, t) => { bg(t, lt * 30); const k = sm(lt / d); cam(lerp(0, 20, k), -85, lerp(2.6, 2.9, k));
    leafFace(-430, 170, 900, -.12); const p = sm(lt / (d * .75));
    fSide(0, 0, 1, { t, trans: lerp(.35, 1, p), blood: 0, look: .3 });
    label((1 + 2 * p).toFixed(1).replace(".0", "") + "x CLEARER", W * .45, H * .2, sm(lt / .25)); });

  KZ.shot("gNoClot", (lt, d, t) => { bg(t, 0); glassBg(t); const k = sm(lt / d); cam(lerp(-30, -46, k), lerp(-10, -14, k), lerp(2.6, 3.3, k));
    fBelly(0, 0, 1, { t, blood: 0, liver: 1, swirl: true });
    const a = sm((lt - d * .45) / .3);
    if (a > 0) { g.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.globalAlpha = a; g.strokeStyle = "#5dff8a"; g.lineWidth = 30; g.lineCap = "round"; g.lineJoin = "round"; g.shadowColor = "rgba(80,255,140,.8)"; g.shadowBlur = 30;
      g.beginPath(); g.moveTo(W * .3, H * .3); g.lineTo(W * .38, H * .36); g.lineTo(W * .55, H * .26); g.stroke(); g.restore();
      label("NO CLOTS", W * .45, H * .2, a); } });
})();
