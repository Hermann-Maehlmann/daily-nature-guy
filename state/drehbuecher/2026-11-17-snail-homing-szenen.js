// 3D-Szene "Why Your Snails Keep Coming Back" (17.11.2026). Gartenschnecke (Cornu aspersum) mit Heimfinde-Instinkt.
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, view, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let snail, rudi, bed, wall, brush, bucket, homeSet, tiles, bars, sign, bushes, fenceN;

  // ---------- Gartenschnecke (eigener Entwurf: braunes Spiralhaus mit dunklen Bändern, graubrauner Fuß, Augen auf Fühlern) ----------
  function shellTex() { return canvasTex(512, 256, (c, w, h) => {
    c.fillStyle = "#b8763a"; c.fillRect(0, 0, w, h);
    // Bänder laufen längs der Röhre (wie beim echten Gehäuse)
    for (const [y, hh, col] of [[.12, .1, "#5b3418"], [.34, .06, "#7a4a22"], [.55, .12, "#5b3418"], [.78, .07, "#7a4a22"]]) { c.fillStyle = col; c.fillRect(0, y * h, w, hh * h); }
    // Querriefen (Wachstumslinien), leicht gesprenkelt
    c.globalAlpha = .18; c.fillStyle = "#f2d29a"; for (let x = 0; x < w; x += 9) c.fillRect(x, 0, 3, h);
    c.globalAlpha = .25; for (let i = 0; i < 300; i++) { c.fillStyle = Math.random() > .5 ? "#e8b878" : "#4a2a12"; c.fillRect(Math.random() * w, Math.random() * h, 4, 6); } }); }
  let SHELL_TEX = null;
  function makeSnail() {
    const skin = M(0xa8977f, { roughness: .35 }), skinD = M(0x8a7a64, { roughness: .4 }), eyeW = M(0xffffff, { roughness: .15 }), pupil = M(0x161018, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    if (!SHELL_TEX) SHELL_TEX = shellTex();
    const root = new T.Group(), body = new T.Group(); root.add(body);
    // Fuß: lang, flach, hinten spitz
    const foot = new T.Group(); body.add(foot);
    foot.add(sph(skin, 0, .09, 0, .36, .09, .13));
    foot.add(sph(skin, -.32, .06, 0, .2, .06, .09));
    foot.add(sph(skinD, 0, .03, 0, .4, .035, .14));
    // Hals und Kopf vorn, aufgerichtet
    const neck = sph(skin, .28, .17, 0, .14, .14, .11); body.add(neck);
    const head = new T.Group(); head.position.set(.38, .27, 0); body.add(head);
    head.add(sph(skin, 0, 0, 0, .12, .11, .1));
    for (let i = 0; i < 9; i++) head.add(sph(skinD, -.05 + (i % 3) * .05, .06 + (i % 2) * .02, -.06 + Math.floor(i / 3) * .06, .018)); // Hautrunzeln
    const smile = mesh(new T.TorusGeometry(.04, .009, 8, 20, PI), M(0x4a2020), .115, -.04, 0); smile.rotation.set(0, PI / 2, PI); head.add(smile);
    // Fühler: oben 2 lange mit Augen, unten 2 kurze
    const stalks = [], eyes = [], lows = [];
    for (const s of [-1, 1]) {
      const st = new T.Group(); st.position.set(.02, .08, s * .045); head.add(st);
      const l = limb(.022, .26, skin); l.rotation.z = PI; st.add(l); // zeigt nach oben
      const e = new T.Group(); e.position.set(0, .28, 0); st.add(e);
      e.add(sph(eyeW, 0, 0, 0, .062)); e.add(sph(pupil, .042, .005, 0, .034)); e.add(sph(hl, .068, .022, -.012 * s, .011));
      st.rotation.set(s * .28, 0, -.38); stalks.push(st); eyes.push(e);
      const lo = new T.Group(); lo.position.set(.1, -.02, s * .05); head.add(lo);
      const ll = limb(.018, .07, skin); ll.rotation.z = PI / 2 + .5; lo.add(ll); lo.rotation.x = s * .4; lows.push(lo);
    }
    // Gehäuse: Röhre entlang einer logarithmischen Spirale, nach innen dünner, leicht kegelförmig
    const shell = new T.Group(); shell.position.set(-.08, .4, 0); body.add(shell);
    const R0 = .21, B = .2, A1 = 4.2 * PI, K = .74; const pts = [];
    const rr = (a) => R0 * Math.exp(-B * a);
    for (let i = 0; i <= 80; i++) { const a = i / 80 * A1, r = rr(a); pts.push(V(Math.cos(a - PI * .38) * r, Math.sin(a - PI * .38) * r, -(1 - r / R0) * .1)); }
    const path = new T.CatmullRomCurve3(pts); const TS = 220, RS = 28;
    const geo = new T.TubeGeometry(path, TS, 1, RS, false); const pos = geo.attributes.position;
    for (let i = 0; i <= TS; i++) { const u = i / TS, P = path.getPointAt(u), r = rr(u * A1) * K; for (let j = 0; j <= RS; j++) { const k = i * (RS + 1) + j; const v = V(pos.getX(k), pos.getY(k), pos.getZ(k)).sub(P).multiplyScalar(r).add(P); pos.setXYZ(k, v.x, v.y, v.z); } }
    geo.computeVertexNormals();
    const tex = SHELL_TEX.clone(); tex.needsUpdate = true; tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(3, 1);
    const shellMat = new T.MeshStandardMaterial({ map: tex, roughness: .55, metalness: 0 });
    const tube = mesh(geo, shellMat); shell.add(tube);
    const P0 = path.getPointAt(0); shell.add(sph(M(0xb37538, { roughness: .4 }), P0.x, P0.y, P0.z, R0 * K, R0 * K, R0 * K * .9)); // Mündung zu
    shell.rotation.z = .1;
    // Farbpunkte auf dem Gehäuse (weiße Tupfer wie im echten Versuch mit Korrekturlack)
    const dotMat = M(0xffffff, { roughness: .3, emissive: 0xffffff, emissiveIntensity: .15 });
    const dots = [];
    for (let i = 0; i < 17; i++) {
      const u = i === 0 ? .1 : .02 + (i * .61803) % 1 * .32, a = u * A1; const P = path.getPointAt(u), r = rr(a) * K;
      const ang = i === 0 ? 0 : ((i * 2.4) % 2.2) - 1.1; // Winkel um die Röhre zur Kamera (+z) hin
      const tan = path.getTangentAt(u), n = V(0, 0, 1), side = new T.Vector3().crossVectors(tan, n).normalize();
      const dir = n.clone().multiplyScalar(Math.cos(ang)).add(side.multiplyScalar(Math.sin(ang))).normalize();
      const d = mesh(SPH, dotMat, P.x + dir.x * r * .97, P.y + dir.y * r * .97, P.z + dir.z * r * .97, .034, .034, .012);
      d.lookAt(d.position.clone().add(dir)); d.scale.set(.032, .032, .01); d.visible = false; shell.add(d); dots.push(d);
    }
    return { root, body, foot, head, neck, stalks, eyes, lows, shell, smile, dots };
  }
  function poseSnail(S, t, o) {
    o = o || {};
    const crawl = o.crawl || 0, wav = Math.sin(t * 6);
    S.foot.scale.set(1 + wav * .04 * crawl, 1, 1); S.foot.position.x = wav * .01 * crawl;
    S.body.position.y = 0;
    S.head.rotation.z = (o.nod || 0) + Math.sin(t * 1.6) * .05 + (o.chew ? Math.abs(Math.sin(t * 7)) * .08 : 0);
    S.head.rotation.y = o.look || 0;
    S.stalks.forEach((s, i) => { const k = i ? 1 : -1; s.rotation.z = -.38 + Math.sin(t * 2.3 + i * 1.7) * .1 + (o.eyesUp || 0) * .25; s.rotation.x = k * (.28 + Math.sin(t * 1.9 + i) * .06 + (o.spread || 0)); s.scale.y = 1 + (o.stretch || 0) * .35; });
    S.eyes.forEach((e) => { e.scale.y = 1 / (1 + (o.stretch || 0) * .35); });
    const blink = Math.sin(t * 1.7 + .7) > .985 ? .15 : 1; S.eyes.forEach((e) => { e.scale.y *= blink; });
    S.lows.forEach((l, i) => { l.rotation.z = Math.sin(t * 3 + i) * .15; });
    S.shell.position.y = .4 + Math.sin(t * 2.2) * .006;
    const nd = o.dots ?? 0; S.dots.forEach((d, i) => { d.visible = i < nd; });
    if (o.dotPop != null) { const d = S.dots[0]; const p = clamp(o.dotPop, 0, 1); d.visible = p > 0; d.scale.set(.032 * easeBack(p), .032 * easeBack(p), .01); }
    S.smile.visible = false;
  }

  // ---------- Hochbeet mit Salat ----------
  function lettuce(mat1, mat2) {
    const gq = new T.Group();
    gq.add(sph(mat2, 0, .14, 0, .17, .15, .17));
    for (let i = 0; i < 9; i++) { const a = i / 9 * 2 * PI; const lf = sph(i % 2 ? mat1 : mat2, Math.cos(a) * .15, .14, Math.sin(a) * .15, .17, .12, .045); lf.rotation.y = -a + PI / 2; lf.rotation.x = .5; gq.add(lf); }
    for (let i = 0; i < 6; i++) { const a = i / 6 * 2 * PI + .3; const lf = sph(mat1, Math.cos(a) * .08, .24, Math.sin(a) * .08, .11, .09, .035); lf.rotation.y = -a + PI / 2; lf.rotation.x = .35; gq.add(lf); }
    return gq;
  }
  function makeBed() {
    const root = new T.Group(); const wood = M(0x9a6a3e, { roughness: .8 }), woodD = M(0x7a4f2c, { roughness: .85 }), soil = M(0x4a2f1f, { roughness: 1 });
    root.add(mesh(BOX, wood, 0, .26, 0, 1.7, .52, .9));
    for (let i = 0; i < 3; i++) root.add(mesh(BOX, woodD, 0, .08 + i * .17, .455, 1.72, .02, .01));
    root.add(mesh(BOX, soil, 0, .525, 0, 1.6, .02, .8));
    const l1 = M(0x8fd856, { roughness: .5 }), l2 = M(0x5fb33a, { roughness: .5 });
    const lets = [];
    for (const [x, z] of [[-.5, .05], [.08, -.12], [.6, .08]]) { const l = lettuce(l1, l2); l.position.set(x, .53, z); root.add(l); lets.push(l); }
    return { root, lets };
  }
  // ---------- Riesenmauer aus Ziegeln ----------
  function makeWall() {
    const tex = canvasTex(512, 256, (c, w, h) => { c.fillStyle = "#e9dcc8"; c.fillRect(0, 0, w, h); const bw = 64, bh = 32;
      for (let r = 0; r < h / bh; r++) for (let k = -1; k < w / bw + 1; k++) { const x = k * bw + (r % 2) * bw / 2; c.fillStyle = ["#c4553c", "#b84a33", "#cf6247", "#ad432e"][(r * 7 + k * 3) & 3]; c.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6); } });
    tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(4, 4);
    const root = new T.Group(); const m = new T.MeshStandardMaterial({ map: tex, roughness: .85 });
    const w = mesh(BOX, m, 0, 1.4, 0, 5.2, 2.8, .45); root.add(w);
    root.add(mesh(BOX, M(0xd8d0c0, { roughness: .8 }), 0, 2.85, 0, 5.4, .1, .55));
    return { root, top: 2.9 };
  }
  // ---------- Pinsel (an Rudis rechter Hand) ----------
  function makeBrush() { const gq = new T.Group(); gq.add(mesh(CYL, M(0x2f6fd0), 0, -.12, 0, .025, .3, .025)); gq.add(mesh(CYL, M(0xc5ced8, { metalness: .8, roughness: .3 }), 0, -.3, 0, .03, .07, .03)); gq.add(sph(M(0xffffff, { roughness: .4 }), 0, -.37, 0, .035, .06, .035)); return gq; }
  // ---------- Eimer mit Schnecke ----------
  function makeBucket() { const gq = new T.Group(); const m = M(0x36b37e, { roughness: .35 });
    const b = mesh(new T.CylinderGeometry(.17, .13, .3, 32, 1, true), m, 0, -.2, 0); b.material.side = T.DoubleSide; gq.add(b);
    gq.add(mesh(new T.CylinderGeometry(.13, .13, .02, 32), m, 0, -.35, 0));
    const hd = mesh(new T.TorusGeometry(.16, .012, 8, 24, PI), M(0x555a66, { metalness: .6 }), 0, -.05, 0); gq.add(hd);
    const s = makeSnail(); s.root.scale.setScalar(.38); s.root.position.set(-.03, -.2, 0); s.root.rotation.z = .5; gq.add(s.root); gq.snail = s; return gq; }
  // ---------- Heim-Infografik: Salat mit HOME-Schild, Schleimspur ----------
  function tileTex(word, col, fs) { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = col; c.beginPath(); c.roundRect(0, 0, w, h, 60); c.fill(); c.fillStyle = "#fff"; c.font = `900 ${fs || 92}px "Montserrat"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(word, w / 2, h / 2 + 4); }); }
  function tile(word, col, fs) { const grp = new T.Group(); grp.add(mesh(BOX, M(new T.Color(col).multiplyScalar(.7).getHex(), { roughness: .4 }), 0, 0, -.06, 1.6, .8, .12));
    const f = new T.Mesh(new T.PlaneGeometry(1.6, .8), new T.MeshStandardMaterial({ map: tileTex(word, col, fs), roughness: .4 })); f.position.z = .001; grp.add(f); return grp; }
  function makeHome() { const root = new T.Group(); const l = lettuce(M(0x8fd856), M(0x5fb33a)); l.scale.setScalar(1.6); l.position.set(1.1, 0, 0); root.add(l);
    const trail = []; const tm = M(0xbfe8ff, { emissive: 0x9fd8ff, emissiveIntensity: .6, roughness: .1, metalness: .2 });
    for (let i = 0; i < 14; i++) { const d = sph(tm, -1.1 + i * .15, .012, Math.sin(i * .9) * .05, .07, .01, .05); root.add(d); trail.push(d); }
    const home = tile("HOME", "#36b37e"); home.scale.setScalar(.6); home.position.set(1.1, 1.05, 0); root.add(home);
    const ten = tile("10 m", "#2f6fd0", 120); ten.scale.setScalar(.55); ten.position.set(-.2, 1.25, .1); root.add(ten);
    return { root, trail, home, ten, let: l }; }
  function makeTiles() { const root = new T.Group(); const a = tile("416 SNAILS", "#2f6fd0", 74), b = tile("1,385 THROWS", "#7a5cff", 66); root.add(a); root.add(b); return { root, list: [a, b] }; }
  // ---------- Balken: 5 m vs 20 m ----------
  function makeBars() { const root = new T.Group(); const list = [];
    for (const [x, col, lab, val] of [[-.6, 0xe5484d, "5 m", "75%"], [.6, 0x36b37e, "20 m", "2%"]]) {
      const grp = new T.Group(); grp.position.x = x; root.add(grp);
      const bar = mesh(BOX, M(col, { roughness: .35 }), 0, .5, 0, .62, 1, .62); grp.add(bar);
      const lt = tile(lab, "#1d2250", 110); lt.scale.setScalar(.42); lt.position.set(0, .22, .36); grp.add(lt);
      const vt = tile(val, "#" + new T.Color(col).getHexString(), 120); vt.scale.setScalar(.38); vt.traverse((m) => { m.castShadow = false; }); lt.traverse((m) => { m.castShadow = false; }); grp.add(vt);
      list.push({ grp, bar, vt });
    }
    return { root, list }; }
  // ---------- Wegweiser 20 m, Wildecke, Nachbarzaun ----------
  function makeSign() { const root = new T.Group(); root.add(mesh(CYL, M(0x8a5a3a), 0, .6, 0, .04, 1.2, .04));
    const t = canvasTex(512, 200, (c, w, h) => { c.fillStyle = "#ffd23f"; c.beginPath(); c.moveTo(0, 0); c.lineTo(w - 90, 0); c.lineTo(w, h / 2); c.lineTo(w - 90, h); c.lineTo(0, h); c.fill(); c.fillStyle = "#1d2250"; c.font = '900 120px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("20 m", w / 2 - 30, h / 2 + 6); });
    const b = mesh(BOX, M(0xe0b52a), 0, 1.15, 0, .9, .35, .05); root.add(b); const f = new T.Mesh(new T.PlaneGeometry(.9, .35), new T.MeshStandardMaterial({ map: t, roughness: .5 })); f.position.set(0, 1.15, .03); root.add(f); return { root }; }
  function makeBushes() { const root = new T.Group(); const c = [0x4fae4a, 0x3f9a3c, 0x6cc25a];
    for (let i = 0; i < 7; i++) root.add(sph(M(c[i % 3]), (i - 3) * .35, .25 + (i % 2) * .1, Math.sin(i * 2) * .25, .35, .3 + (i % 3) * .06, .3));
    for (let i = 0; i < 14; i++) { const bl = mesh(new T.ConeGeometry(.03, .5, 6), M(0x7cc44e), (i - 7) * .14, .25, .3 + (i % 2) * .08); bl.rotation.z = Math.sin(i) * .2; root.add(bl); }
    for (let i = 0; i < 4; i++) root.add(sph(M([0xffd23f, 0xff6b8a][i % 2]), (i - 1.5) * .45, .62, .2, .06));
    return { root }; }
  function makeFenceN() { const root = new T.Group(); const m = M(0xfff8ee);
    for (let i = -3; i <= 3; i++) root.add(mesh(BOX, m, 0, .5, i * .3, .06, 1, .16));
    root.add(mesh(BOX, m, 0, .7, 0, .04, .08, 2)); root.add(mesh(BOX, m, 0, .3, 0, .04, .08, 2)); return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; snail = actor(makeSnail(), "Schnecke");
    bed = actor(makeBed(), "Hochbeet"); wall = actor(makeWall(), "Mauer"); homeSet = actor(makeHome(), "Heim"); tiles = actor(makeTiles(), "Kacheln"); bars = actor(makeBars(), "Balken");
    sign = actor(makeSign(), "Wegweiser"); bushes = actor(makeBushes(), "Wildecke"); fenceN = actor(makeFenceN(), "Nachbarzaun");
    for (const a of [bed, wall, homeSet, tiles, bars, sign, bushes, fenceN]) a.noCheck = true;
    brush = makeBrush(); brush.position.set(0, -.62, 0); rudi.arms[1].add(brush);
    bucket = makeBucket(); bucket.position.set(0, -.66, 0); rudi.arms[1].add(bucket);
    // Hundehütte aus dem Standard-Garten ausblenden (hier kein Hund)
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
    K3.yard.children.forEach((c) => { if (c.isGroup && Math.abs(c.position.x + 2.4) < .01 && Math.abs(c.position.z + 2.2) < .01) c.visible = false; });
  });
  function props(o) { snail.noCheck = !!(o && o.nc); brush.visible = !!(o && o.brush); bucket.visible = !!(o && o.bucket); }

  // Schnecke steht auf dem Hochbeet (Erdoberfläche y = .53)
  function snailOnBed(x, z, ry, sc) { snail.root.visible = true; snail.root.quaternion.identity(); snail.root.position.set(1.0 + x, .535, z); snail.root.rotation.set(0, ry || 0, 0); snail.root.scale.setScalar(sc || 1); }
  function bedAt() { place(bed, 1.0, 0, 0); }
  const BEDX = 1.0;

  // ---------- Shots ----------
  // 0 Hook: Nahaufnahme, Schnecke mit weißem Tupfer frisst seelenruhig Salat
  KZ.shot("sHook", (lt, d, t) => { begin("yard"); props(); const k = sm(lt / d);
    bedAt(); snailOnBed(.25, .2, -.35, 1.3); poseSnail(snail, t, { chew: true, dots: 1, look: -.15, nod: -.05 });
    frameOn([snail], { az: lerp(.42, .3, k), el: .2, fill: lerp(.8, .88, k), t }); draw(); });
  // 1 Rudi malt einen Punkt aufs Gehäuse
  KZ.shot("sDot", (lt, d, t) => { begin("yard"); props({ brush: true, nc: true }); const k = sm(lt / d), paint = sm((lt - d * .45) / (d * .25));
    bedAt(); snailOnBed(-.33, .28, -.15, 1.3); poseSnail(snail, t, { dotPop: (lt - d * .62) / .25, eyesUp: .5, look: .3, smile: lt < d * .6 });
    place(rudi, -.28, .35, -.05); poseRudi(rudi, t, { arms: [.25, lerp(.5, 1.12, paint) + Math.sin(t * 14) * .06 * (paint > .2 && paint < 1)], spread: .08, mouth: "smile", lean: -.08 * paint, nod: -.1 * paint });
    frameOn([rudi, snail], { az: lerp(.55, .45, k), el: .16, fill: lerp(.82, .9, k), t }); draw();
    if (lt < d * .5) stamp("NEW SNAIL?", W * .4, H * .17, (lt - .3) / .3, "#7a5cff", -.07);
    else stamp("SNAIL #1", W * .4, H * .17, (lt - d * .66) / .3, "#2f6fd0", .06); });
  // 2 Wurf über den Zaun, Schnitt: nächster Morgen, gleiche Schnecke, gleicher Salat
  KZ.shot("sToss", (lt, d, t) => { begin("yard"); props({ nc: lt < d * .5 }); const half = lt > d * .5;
    bedAt();
    if (!half) { const k = sm(lt / (d * .5)), th = clamp((lt - d * .12) / (d * .3), 0, 1);
      place(rudi, -.2, .6, PI + .95); poseRudi(rudi, t, { arms: [.3, th < .35 ? lerp(.3, 2.9, th / .35) : lerp(2.9, 1.4, (th - .35) / .65)], spread: .1, mouth: "smile", lean: th > .35 ? -.1 : .05 });
      // Schnecke fliegt in hohem Bogen nach hinten über den Gartenzaun (z = -6)
      const f = clamp((th - .35) / .65, 0, 1);
      if (th < .35) { snail.root.visible = false; } else {
        snail.root.visible = true; snail.root.quaternion.identity(); snail.root.scale.setScalar(.8);
        snail.root.position.set(lerp(-.6, -4.5, f), 1.9 + Math.sin(f * PI) * 2.0 - f * 1.4, lerp(.4, -6.5, f)); snail.root.rotation.set(f * 9, 0, f * 6); poseSnail(snail, t, { dots: 1, stretch: .6, spread: .3, smile: false }); }
      frameOn([rudi], { az: lerp(.35, .25, k), el: .22, fill: .55, dy: .35, t }); draw();
      if (th > .4) stamp("BYE!", W * .38, H * .17, (th - .4) / .2, "#ff5d8f", -.08);
    } else { const k = sm((lt - d * .5) / (d * .5));
      // Morgen: Schnecke wieder da, Rudi kommt mit offenem Mund dazu
      snailOnBed(.25, .2, -.35, 1.3); poseSnail(snail, t, { chew: true, dots: 1, look: .25 });
      place(rudi, -.45, .5, -.15); poseRudi(rudi, t, { arms: [.2, .2], spread: .35, mouth: "o", wide: true, lean: .06 });
      frameOn([rudi, snail], { az: lerp(.5, .42, k), el: .14, fill: lerp(.82, .9, k), t }); draw();
      stamp("WELCOME BACK", W * .42, H * .17, (lt - d * .55) / .3, "#36b37e", -.06); } });
  // 3 Riesenmauer: Rudi stolz davor, Schnitt: Schnecke krabbelt oben drüber und an der Vorderseite herunter
  KZ.shot("sWall", (lt, d, t) => { begin("yard"); props(); const half = lt > d * .5;
    bedAt(); place(wall, .2, -1.4, 0);
    if (!half) { const k = sm(lt / (d * .5)), up = easeBack(clamp(lt / (d * .25), 0, 1));
      wall.root.scale.set(1, Math.max(.01, up), 1);
      snail.root.visible = false;
      place(rudi, -.6, .5, -.25); poseRudi(rudi, t, { arms: [.35, .35], spread: .45, mouth: "smile", nod: Math.sin(t * 4) * .04 });
      frameOn([rudi, bed], { az: lerp(.38, .3, k), el: .2, fill: lerp(.8, .86, k), dy: .5, t }); draw();
      stamp("SNAIL-PROOF", W * .4, H * .17, (lt - d * .2) / .3, "#2f6fd0", -.06);
    } else { const k = sm((lt - d * .5) / (d * .5)), go = clamp((lt - d * .5) / (d * .5), 0, 1);
      wall.root.scale.set(1, 1, 1);
      // Schnecke an der Vorderwand (z = -1.4 + .23), Kopf nach unten, Fuß an der Wand
      snail.root.visible = true; snail.root.scale.setScalar(1.5);
      snail.root.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(V(0, -1, 0), V(0, 0, 1), V(-1, 0, 0)));
      snail.root.position.set(.5, lerp(2.75, 2.3, go), -1.4 + .225 + .005); poseSnail(snail, t, { crawl: 1, dots: 1, eyesUp: .3 });
      place(rudi, -.5, .5, -.2); poseRudi(rudi, t, { arms: [.2, .2], spread: .3, mouth: "o", wide: true, tilt: -.15 });
      frameOn([rudi, snail], { az: lerp(.3, .22, k), el: .12, fill: lerp(.82, .88, k), t }); draw();
      stamp("NOPE", W * .36, H * .17, (lt - d * .58) / .3, "#e5484d", .07); } });
  // 4 Heimfinde-Instinkt: Studio, Schnecke kriecht auf glänzender Spur heim zum Salat
  KZ.shot("sHome", (lt, d, t) => { begin("studio"); props(); const k = sm(lt / d), go = sm(lt / d);
    place(homeSet, 0, 0, 0);
    homeSet.trail.forEach((s, i) => { s.visible = i / 14 < go * .9 + .05; });
    homeSet.home.position.y = 1.0 + Math.sin(t * 2) * .03; homeSet.ten.visible = lt > d * .45; homeSet.ten.scale.setScalar(.55 * easeBack(clamp((lt - d * .45) / .25, .001, 1)));
    snail.root.visible = true; snail.root.quaternion.identity(); snail.root.scale.setScalar(1.3); snail.root.position.set(lerp(-1.3, -.1, go), 0, 0); snail.root.rotation.set(0, 0, 0);
    poseSnail(snail, t, { crawl: 1, dots: 1, eyesUp: .4 });
    frameOn([homeSet, snail], { az: lerp(.25, .12, k), el: .26, fill: lerp(.92, .98, k), t }); draw();
    if (lt < d * .45) stamp("HOMING", W * .4, H * .17, (lt - .25) / .3, "#7a5cff", -.06); });
  // 5 Studie: 416 Schnecken, 1385 Würfe, Rekord 17 Tupfer
  KZ.shot("sStudy", (lt, d, t) => { begin("studio"); props(); const k = sm(lt / d), half = lt > d * .48;
    snail.root.visible = true; snail.root.quaternion.identity(); snail.root.scale.setScalar(1.6); snail.root.position.set(0, 0, 0); snail.root.rotation.set(0, -.25, 0);
    const nd = half ? Math.min(17, Math.max(1, 1 + Math.floor((lt - d * .5) / (d * .32) * 16))) : 1;
    poseSnail(snail, t, { dots: nd, eyesUp: .3, look: -.35 });
    tiles.root.visible = !half; tiles.root.position.set(0, 0, 0);
    tiles.list.forEach((tl, i) => { const p = clamp((lt / d - [.04, .2][i]) / .1, 0, 1); tl.visible = p > 0; tl.position.set(0, 1.75 + (1 - i) * .66, .2); tl.scale.setScalar(Math.max(.001, easeBack(p)) * .75); tl.rotation.y = (1 - p) * 1.4; });
    if (!half) frameOn([snail, tiles], { az: lerp(.2, .1, k), el: .16, fill: .8, dy: -.45, t });
    else frameOn([snail], { az: lerp(.25, .1, k), el: .14, fill: lerp(.82, .92, k), t });
    draw();
    if (half) { txt("×" + nd, W * .42, H * .18, 150, "#ffd84d", { stroke: 14, w: 900 }); if (nd >= 17) stamp("RECORD", W * .42, H * .29, (lt - d * .84) / .25, "#e5484d", -.06); }
    const cp = sm((lt - .15) / .3); if (!half && card(W * .42, H * .63, 800, 120, cp)) txt("Prof. David Dunstan, Queen Mary Univ. London", W * .42, H * .63, 32, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 6 20 Meter: Balken 5 m (75 % kamen zurück) gegen 20 m (3 von 151), Quellenkarte mit Zitat
  KZ.shot("sTwenty", (lt, d, t) => { begin("studio"); props(); const k = sm(lt / d);
    place(bars, 0, 0, 0); const hs = [1.5, .06]; const g1 = sm((lt - .1) / .6), g2 = sm((lt - d * .35) / .5);
    bars.list.forEach((b, i) => { const h = hs[i] * Math.max(.02, i ? g2 : g1); b.bar.scale.y = h; b.bar.position.y = h / 2; b.vt.position.set(0, Math.max(h + .3, .72), 0); b.vt.visible = (i ? g2 : g1) > .3; });
    frameOn([bars], { az: lerp(.18, .06, k), el: .16, fill: lerp(.7, .76, k), dy: -.55, t }); draw();
    txt("CAME BACK", W * .42, H * .2, 72, "#ffffff", { stroke: 10, a: clamp(lt / .3, 0, 1) });
    const cp = sm((lt - d * .45) / .3); if (card(W * .42, H * .615, 860, 240, cp, "Queen Mary Univ. London", "#2f6fd0")) {
      txt("“When we moved them 20 metres,", W * .42, H * .615 + 10, 36, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("almost none came back.”", W * .42, H * .615 + 60, 36, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 7 Pointe: Rudi kratzt sich vor der Mauer am Kopf, Schnecke sitzt oben drauf
  KZ.shot("sOverkill", (lt, d, t) => { begin("yard"); props(); const k = sm(lt / d);
    bedAt(); place(wall, .2, -1.4, 0); wall.root.scale.set(1, 1, 1);
    snail.root.visible = true; snail.root.quaternion.identity(); snail.root.scale.setScalar(1.4); snail.root.position.set(.55, wall.top, -1.4); snail.root.rotation.set(0, -.3, 0);
    poseSnail(snail, t, { dots: 1, look: .3, eyesUp: .3 });
    place(rudi, -.45, .5, -.2); poseRudi(rudi, t, { arms: [2.75, .2], spread: .1, mouth: "o", nod: .05, tilt: -.12 });
    frameOn([rudi, snail], { az: lerp(.3, .22, k), el: .12, fill: lerp(.82, .88, k), t }); draw();
    if (lt > d * .35) stamp("OVERKILL", W * .4, H * .17, (lt - d * .35) / .3, "#7a5cff", .06); });
  // 8 Tipp: Rudi trägt die Schnecke im Eimer 20 m weit zur Wildecke, nicht in Nachbars Garten
  KZ.shot("sTip", (lt, d, t) => { begin("yard"); props({ bucket: true }); const ph = lt / d, k = sm(ph);
    place(sign, 1.3, -.6, -.25); place(bushes, 2.6, -1.4, -.3); place(fenceN, -1.6, -1.2, 0);
    const go = sm(ph / .6); place(rudi, lerp(-.6, .4, go), .3, 0); poseRudi(rudi, t, { walk: go < 1 ? 1 : 0, arms: [.2, .35], spread: .1, mouth: "smile" });
    bucket.rotation.z = -.35; bucket.snail.stalks.forEach((s, i) => s.rotation.z = -.38 + Math.sin(t * 3 + i) * .15);
    frameOn([rudi, sign], { az: lerp(.2, .12, k), el: .16, fill: lerp(.7, .74, k), t }); draw();
    if (ph < .5) stamp("20 METRES", W * .42, H * .17, (lt - .3) / .3, "#2f6fd0", -.06);
    else stamp("NOT NEXT DOOR!", W * .42, H * .17, (lt - d * .55) / .3, "#e5484d", .05); });
  // 9 Loop: Rudi kommt in den Garten, Schnecke sitzt wieder auf dem Salat, Kamera fährt in die Hook-Einstellung
  KZ.shot("sLoop", (lt, d, t) => { begin("yard"); props(); const ph = lt / d;
    bedAt(); snailOnBed(.25, .2, -.35, 1.3); poseSnail(snail, t, { chew: true, dots: 1, look: -.15, nod: -.05 });
    if (ph < .45) { const k = sm(ph / .45); place(rudi, -.45, .5, -.15); poseRudi(rudi, t, { arms: [2.75, .2], spread: .1, mouth: "o", tilt: -.1 });
      frameOn([rudi, snail], { az: .45, el: .15, fill: lerp(.82, .86, k), t }); draw(); }
    else { const k = sm((ph - .45) / .55); frameOn([snail], { az: lerp(.55, .42, k), el: .2, fill: lerp(.7, .8, k), t }); draw(); } });

  window.__snail3d = true;
})();
