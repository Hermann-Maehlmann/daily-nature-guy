// 3D-Szene "Why Bread Is Junk Food For Ducks" / "Warum dein Brot für Enten Junkfood ist" (20.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Stockente neu gebaut: Erpel (grün schillernder Kopf, weißer Halsring, gelber Schnabel, braune Brust, grauer Körper, schwarzer Bürzel
// mit Ringellocke, blauer Flügelspiegel, orange Füße) und Weibchen/Jungente (braun gesprenkelt, Augenstreif, orange Schnabel mit dunklem Sattel).
// Posen: schwimmen, schnattern, fressen (Brot im Schnabel), pappsatt (dicker Bauch), Flügelschlag, Engelsflügel (Handschwingen stehen ab).
// Park-Teich mit Steinrand, Schilf, Seerosenblättern; Toastscheiben, Brottüte, Riesenbaguette, Wanderratten, Ratten-Imbiss-Schild,
// Balken-Infografik, echtes Entenfutter (Wasserpflanzen, Samen, Schnecke, Mücken), Teich-Querschnitt mit faulendem Brot + Algen,
// Haferflocken/Erbsen/Mais an Land.
// Quellen: Canal & River Trust (Why is bread bad for ducks, 2025), LBV (Soll man Enten füttern?), Utrecht University 2021,
// Dacorum Borough Council / RI DEM (Angel Wing, deformierte Flügel bei Jungvögeln).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let drake, hen, duck3, young, rudi, park, slices, bag, baguette, rats, diner, bars, wild, sect, fish, food, sectBread, algae, oxy;

  // ---------- Stockente ----------
  function makeDuck(kind) { // kind: "drake" | "hen" | "young"
    const dr = kind === "drake";
    const bodyC = dr ? 0xb9b6ae : 0xa0703f, backC = dr ? 0x7d7265 : 0x7a5530, chestC = dr ? 0x6e3a26 : 0xb07c48, headC = dr ? 0x1d7a45 : 0x8f6438;
    const body = M(bodyC, { roughness: .75 }), back = M(backC, { roughness: .75 }), chest = M(chestC, { roughness: .7 }), head = M(headC, dr ? { roughness: .25, metalness: .25 } : { roughness: .75 });
    const bill = M(dr ? 0xf2c82a : 0xe08a2a, { roughness: .4 }), billD = M(0x3a2a20, { roughness: .5 }), white = M(0xffffff, { roughness: .5 }), black = M(0x1a1a1c, { roughness: .5 });
    const spec = M(0x2f55d8, { roughness: .2, metalness: .3 }), feetM = M(0xff8a1f, { roughness: .5 }), eyeW = M(0xffffff, { roughness: .15 }), pup = M(0x1a120c, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const dark = M(dr ? 0x5f574c : 0x5e3f22, { roughness: .8 });
    const root = new T.Group(), bodyG = new T.Group(); root.add(bodyG);
    const trunk = sph(body, 0, .13, 0, .27, .13, .15); bodyG.add(trunk); const trunkS = trunk.scale.clone();
    bodyG.add(sph(back, -.03, .2, 0, .21, .06, .12));
    const ch = sph(chest, .16, .16, 0, .13, .12, .13); bodyG.add(ch);
    if (!dr) for (let i = 0; i < 10; i++) { const a = i * 2.399; bodyG.add(sph(dark, -.15 + (i % 5) * .07, .19 + (i % 2) * .03, Math.sin(a) * .13, .025, .012, .02)); }
    // Schwanz + Bürzel
    bodyG.add(sph(dr ? white : back, -.27, .16, 0, .08, .045, .07));
    if (dr) { bodyG.add(sph(black, -.23, .2, 0, .07, .06, .08)); const curl = mesh(new T.TorusGeometry(.028, .009, 8, 20, PI * 1.5), black, -.24, .29, 0); curl.rotation.z = .6; bodyG.add(curl); }
    // Flügel mit blauem Spiegel, Handschwingen (für Engelsflügel)
    const wings = [], prim = [];
    for (const s of [-1, 1]) { const wg = new T.Group(); wg.position.set(.04, .2, s * .12); bodyG.add(wg);
      const w = sph(back, -.1, 0, 0, .19, .055, .045); w.rotation.z = .1; wg.add(w);
      wg.add(sph(spec, -.12, -.015, s * .03, .06, .018, .012)); wg.add(sph(white, -.12, -.038, s * .028, .065, .006, .01));
      const pg = new T.Group(); pg.position.set(-.2, .01, 0); wg.add(pg); const pm = kind === "young" ? M(0xefe6d2, { roughness: .7 }) : dark;
      for (let i = 0; i < 3; i++) { const f = sph(pm, -.1, i * .014 - .012, s * i * .01, .13, .02, .024); f.rotation.z = .12 - i * .05; pg.add(f); }
      wings.push(wg); prim.push(pg); }
    // Hals + Kopf (Pivot am Halsansatz)
    const neck = new T.Group(); neck.position.set(.17, .2, 0); bodyG.add(neck);
    neck.add(sph(head, .05, .08, 0, .06, .1, .06));
    if (dr) { const col = mesh(new T.TorusGeometry(.062, .012, 8, 28), white, .045, .03, 0); col.rotation.set(PI / 2, .25, 0); neck.add(col); }
    const hd = new T.Group(); hd.position.set(.08, .19, 0); neck.add(hd);
    hd.add(sph(head, 0, 0, 0, .1, .088, .085));
    if (kind === "hen") for (const s of [-1, 1]) hd.add(sph(dark, -.03, .02, s * .07, .05, .008, .01)); // Augenstreif hinter dem Auge
    const up = sph(bill, .12, -.02, 0, .08, .022, .045); hd.add(up);
    if (!dr) hd.add(sph(billD, .1, -.005, 0, .05, .014, .03));
    hd.add(sph(billD, .19, -.018, 0, .015, .01, .02));
    const lowG = new T.Group(); lowG.position.set(.05, -.035, 0); hd.add(lowG); lowG.add(sph(bill, .065, 0, 0, .07, .014, .04));
    const crumb = new T.Group(); crumb.position.set(.17, -.03, 0); hd.add(crumb);
    crumb.add(mesh(BOX, M(0xc98a3e, { roughness: .8 }), 0, 0, 0, .09, .07, .022)); crumb.add(mesh(BOX, M(0xf5deb0, { roughness: .9 }), 0, 0, 0, .08, .062, .026)); crumb.visible = false;
    const eyes = [], lids = [], brows = [];
    for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.045, .025, s * .07); hd.add(e);
      e.add(sph(eyeW, 0, 0, 0, .03)); e.add(sph(pup, .01, .002, s * .016, .019)); e.add(sph(hl, .018, .012, s * .022, .007)); eyes.push(e);
      const lid = sph(head, 0, .004, 0, .033); lid.visible = false; e.add(lid); lids.push(lid);
      const b = mesh(BOX, dr ? black : dark, .045, .065, s * .07, .04, .008, .012); hd.add(b); brows.push(b); }
    // Beine + Schwimmfüße (an Land sichtbar)
    const legs = [];
    for (const s of [-1, 1]) { const lg = limb(.014, .1, feetM); lg.position.set(.02, .05, s * .06); const ft = sph(feetM, .04, -.1, 0, .055, .008, .04); lg.add(ft); bodyG.add(lg); legs.push(lg); }
    root.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    return { root, body: bodyG, trunk, trunkS, wings, prim, neck, head: hd, low: lowG, crumb, eyes, lids, brows, legs, kind };
  }
  // o: {quack, eat, bread, stuffed 0..1, flap 0..1, angel, land, walk, look, wide, sad, happy, sleepy, sc, hop}
  function poseDuck(D, t, o) { o = o || {}; const ph = (o.ph || 0);
    const st = o.stuffed || 0; D.trunk.scale.set(D.trunkS.x * (1 + st * .28), D.trunkS.y * (1 + st * .55), D.trunkS.z * (1 + st * .45)); D.trunk.position.y = .13 + st * .03;
    const bob = Math.sin(t * 2.6 + ph) * .01, w = o.walk || 0;
    D.body.position.y = (o.land ? .1 : 0) + bob + Math.abs(Math.sin(t * 9 + ph)) * .025 * w + (o.hop || 0) * .12;
    D.body.rotation.x = Math.sin(t * 9 + ph) * .1 * w; D.body.rotation.z = (o.tiltBody || 0);
    D.legs.forEach((l, i) => { l.visible = !!o.land; l.rotation.z = Math.sin(t * 9 + ph + i * PI) * .5 * w; });
    const eat = o.eat || 0; D.neck.rotation.z = -eat * .9 + (o.up || 0) * .25; D.neck.rotation.y = o.look || 0;
    D.head.rotation.z = eat * .5 + (o.happy ? .1 : 0);
    D.low.rotation.z = -(o.quack ? Math.abs(Math.sin(t * 13 + ph)) * .45 : 0) - (o.open || 0);
    D.crumb.visible = !!o.bread;
    const blink = Math.sin(t * 1.7 + ph * 3 + 1) > .985;
    D.lids.forEach((l) => { l.visible = blink || !!o.sleepy; l.position.y = o.sleepy ? .018 : .004; });
    D.eyes.forEach((e) => e.scale.setScalar(o.wide ? 1.3 : 1));
    D.brows.forEach((b, i) => { b.visible = !!(o.sad || o.wide || o.angry); b.rotation.x = (i ? 1 : -1) * (o.sad ? -.45 : o.angry ? .45 : 0); b.position.y = o.wide ? .075 : .065; });
    const fl = o.flap || 0; D.wings.forEach((wg, i) => { const s = i ? 1 : -1; wg.rotation.x = s * fl * (.6 + Math.abs(Math.sin(t * 16 + ph)) * .9); });
    D.prim.forEach((p, i) => { const s = i ? 1 : -1; const an = (o.angel === true || o.angel === s) ? (o.angelK ?? 1) : 0; p.rotation.set(0, s * an * 1.2, -an * .7); });
    D.root.scale.setScalar((o.sc || 1) * 1.3);
  }

  // ---------- Wanderratte ----------
  function makeRat() {
    const fur = M(0x8c8682, { roughness: .85 }), furD = M(0x6e6863, { roughness: .85 }), pink = M(0xf0a2a8, { roughness: .6 }), eyeM = M(0x111111, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(fur, 0, .1, 0, .17, .09, .095)); body.add(sph(furD, -.03, .14, 0, .13, .05, .07));
    const hd = new T.Group(); hd.position.set(.15, .12, 0); body.add(hd);
    hd.add(sph(fur, 0, 0, 0, .085, .07, .07)); hd.add(sph(fur, .08, -.015, 0, .055, .04, .042)); hd.add(sph(pink, .135, -.01, 0, .016));
    for (const s of [-1, 1]) { hd.add(sph(pink, -.02, .07, s * .05, .03, .042, .012)); hd.add(sph(fur, -.025, .068, s * .045, .036, .048, .01));
      hd.add(sph(eyeM, .045, .025, s * .047, .017)); hd.add(sph(hl, .055, .033, s * .055, .006));
      for (let k = 0; k < 2; k++) { const wk = mesh(CYL, M(0x333333), .11, -.01 + k * .012, s * .05, .002, .09, .002); wk.rotation.set(s * 1.3, 0, PI / 2 - .2 + k * .3); hd.add(wk); } }
    const curve = new T.CatmullRomCurve3([V(-.15, .08, 0), V(-.28, .05, .03), V(-.4, .04, -.04), V(-.5, .07, .02)]);
    body.add(new T.Mesh(new T.TubeGeometry(curve, 20, .012, 6), pink));
    const feet = []; for (const [x, s] of [[.08, -1], [.08, 1], [-.08, -1], [-.08, 1]]) { const f = sph(pink, x, .02, s * .06, .03, .015, .02); body.add(f); feet.push(f); }
    const brd = new T.Group(); brd.position.set(.25, .07, 0); hd.add(brd); brd.add(mesh(BOX, M(0xc98a3e), 0, 0, 0, .08, .065, .02)); brd.add(mesh(BOX, M(0xf5deb0), 0, 0, 0, .07, .056, .024)); brd.visible = false;
    root.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    return { root, body, head: hd, feet, brd };
  }
  function poseRat(R, t, o) { o = o || {}; const ph = o.ph || 0, run = o.run || 0;
    R.body.position.y = Math.abs(Math.sin(t * 14 + ph)) * .03 * run; R.body.rotation.z = (o.sit || 0) * .7;
    R.feet.forEach((f, i) => { f.position.y = .02 + Math.max(0, Math.sin(t * 14 + ph + i * 1.6)) * .03 * run; });
    R.head.rotation.z = -(o.eat ? Math.abs(Math.sin(t * 10 + ph)) * .25 : 0) - (o.sit || 0) * .5; R.head.rotation.y = o.look || 0;
    R.brd.visible = !!o.bread; R.root.scale.setScalar((o.sc || 1) * 1.3); }

  // ---------- Park-Teich ----------
  const PR = 1.45;
  function makePark() { const root = new T.Group();
    const water = mesh(new T.CircleGeometry(PR, 64), M(0x3d8fc4, { roughness: .12, metalness: .15 }), 0, .02, 0); water.rotation.x = -PI / 2; water.castShadow = false; water.receiveShadow = true; root.add(water);
    const rip = []; const rm = M(0xbfe6ff, { roughness: .1, transparent: true, opacity: .5 });
    for (let i = 0; i < 6; i++) { const r = mesh(new T.TorusGeometry(1, .006, 4, 40), rm.clone()); r.rotation.x = PI / 2; r.castShadow = false; root.add(r); rip.push(r); }
    const st = [M(0x9aa0a6, { roughness: .8 }), M(0x7d848c, { roughness: .8 }), M(0xb3a58f, { roughness: .8 })];
    for (let i = 0; i < 34; i++) { const a = i / 34 * 2 * PI; root.add(sph(st[i % 3], Math.cos(a) * (PR + .06), .04, Math.sin(a) * (PR + .06), .12 + (i % 3) * .02, .065, .09)); }
    const reed = M(0x4f8a3a, { roughness: .7 }), cat = M(0x6b3e1f, { roughness: .7 });
    for (let i = 0; i < 10; i++) { const a = -2.2 + (i % 5) * .13, rr = PR - .12 - Math.floor(i / 5) * .1; const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
      const r = mesh(CYL, reed, x, .4 + (i % 2) * .1, z, .014, .8 + (i % 3) * .14, .014); r.rotation.z = (i - 4.5) * .03; root.add(r);
      if (i % 2 === 0) root.add(mesh(CYL, cat, x, .74 + (i % 3) * .07, z, .03, .15, .03)); }
    const lily = M(0x3f9a4a, { roughness: .6 });
    for (const [x, z, r] of [[.6, -.75, .14], [.8, -.55, .1], [-.2, -.95, .12], [1.0, .6, .11]]) { const p = mesh(CYL, lily, x, .025, z, r, .008, r); root.add(p); }
    root.traverse((m) => { if (m.isMesh && m !== water) m.castShadow = true; });
    return { root, water, rip,
      ripples(t, list) { rip.forEach((r, i) => { const s = list[i % Math.max(1, list.length)]; r.visible = !!s && list.length > 0; if (!s) return; const q = (t * .7 + i / rip.length) % 1;
        r.position.set(s[0], .03, s[1]); r.scale.setScalar(.05 + q * .35); r.material.opacity = .6 * (1 - q); }); } };
  }
  // Toastscheibe
  function makeSlice() { const root = new T.Group(); const crust = M(0xc98a3e, { roughness: .8 }), crumbM = M(0xf5deb0, { roughness: .95 });
    root.add(mesh(BOX, crust, 0, 0, 0, .16, .025, .15)); root.add(sph(crust, 0, 0, -.075, .08, .0125, .03)); root.add(mesh(BOX, crumbM, 0, .002, 0, .14, .027, .13)); root.add(sph(crumbM, 0, .002, -.068, .07, .0135, .025));
    root.traverse((m) => { if (m.isMesh) m.castShadow = false; }); return { root }; }
  function makeSlices(n) { const list = []; for (let i = 0; i < n; i++) { const s = makeSlice(); list.push(s); } const root = new T.Group(); list.forEach((s) => root.add(s.root)); return { root, list }; }
  // Brottüte
  function makeBag() { const root = new T.Group(); const paper = M(0xc89a62, { roughness: .9 });
    root.add(mesh(BOX, paper, 0, .22, 0, .3, .44, .2));
    const lab = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#c89a62"; c.fillRect(0, 0, w, h); c.fillStyle = "#e5484d"; c.beginPath(); c.roundRect(20, 70, w - 40, 110, 20); c.fill(); c.fillStyle = "#fff"; c.font = '900 64px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(L("BREAD", "BROT"), w / 2, 128); });
    for (const s of [-1, 1]) { const f = new T.Mesh(new T.PlaneGeometry(.3, .3), new T.MeshStandardMaterial({ map: lab, roughness: .9 })); f.position.set(0, .22, s * .101); if (s < 0) f.rotation.y = PI; root.add(f); }
    for (let i = 0; i < 4; i++) { const s = makeSlice(); s.root.position.set(-.08 + i * .055, .47 + (i % 2) * .03, 0); s.root.rotation.set(PI / 2, 0, (i - 1.5) * .2); root.add(s.root); }
    return { root }; }
  // Riesenbaguette
  function makeBaguette() { const root = new T.Group(); const crust = M(0xd99a45, { roughness: .6 }), cut = M(0xb27428, { roughness: .7 }), top = M(0xf0c47a, { roughness: .7 });
    root.add(sph(crust, 0, 0, 0, 1.25, .14, .15));
    for (let i = 0; i < 7; i++) { const x = -.9 + i * .3; const c = sph(cut, x, .1, 0, .12, .035, .07); c.rotation.y = .5; c.rotation.z = -.1; root.add(c); root.add(sph(top, x + .02, .125, 0, .08, .015, .04)); }
    root.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return { root }; }
  // Ratten-Imbiss-Schild
  function makeDiner() { const root = new T.Group(); const wood = M(0x8a5530, { roughness: .7 });
    root.add(mesh(CYL, wood, 0, .35, 0, .025, .7, .025));
    const tex = canvasTex(512, 256, (c, w, h) => { c.fillStyle = "#e5484d"; c.beginPath(); c.roundRect(6, 6, w - 12, h - 12, 30); c.fill(); c.strokeStyle = "#ffd23f"; c.lineWidth = 12; c.stroke();
      c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle"; c.font = '900 84px "Montserrat"'; c.fillText(L("RAT", "RATTEN"), w / 2, 92); c.fillStyle = "#ffd23f"; c.fillText(L("DINER", "IMBISS"), w / 2, 180); });
    const board = new T.Mesh(new T.BoxGeometry(.56, .28, .03), [wood, wood, wood, wood, new T.MeshStandardMaterial({ map: tex, roughness: .5 }), wood]); board.position.y = .78; board.castShadow = true; root.add(board);
    return { root }; }
  // Balken-Infografik (Brot vs. echtes Futter)
  function tileTex(word, col, fs) { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = col; c.beginPath(); c.roundRect(0, 0, w, h, 60); c.fill(); c.fillStyle = "#fff"; c.font = `900 ${fs || 92}px "Montserrat"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(word, w / 2, h / 2 + 4); }); }
  function tile(word, col, fs) { const grp = new T.Group(); grp.add(mesh(BOX, M(new T.Color(col).multiplyScalar(.7).getHex(), { roughness: .4 }), 0, 0, -.06, 1.6, .8, .12));
    const f = new T.Mesh(new T.PlaneGeometry(1.6, .8), new T.MeshStandardMaterial({ map: tileTex(word, col, fs), roughness: .4 })); f.position.z = .001; grp.add(f); grp.traverse((m) => { m.castShadow = false; }); return grp; }
  function makeBars() { const root = new T.Group(); const list = [];
    for (const [x, col, lab] of [[-.5, 0xc98a3e, L("BREAD", "BROT")], [.5, 0x36b37e, L("REAL FOOD", "ECHTES FUTTER")]]) {
      const grp = new T.Group(); grp.position.x = x; root.add(grp);
      const bar = mesh(BOX, M(col, { roughness: .35 }), 0, .5, 0, .55, 1, .55); grp.add(bar);
      const lt = tile(lab, "#1d2250", lab.length > 9 ? 50 : 80); lt.scale.setScalar(.45); lt.position.set(0, -.25, .35); grp.add(lt);
      const topG = new T.Group(); grp.add(topG); list.push({ grp, bar, topG }); }
    const s = makeSlice(); s.root.rotation.x = PI / 2 - .2; s.root.scale.setScalar(1.6); list[0].topG.add(s.root);
    const pl = M(0x4caf50, { roughness: .6 }); for (let i = 0; i < 4; i++) { const lf = sph(pl, (i - 1.5) * .07, .1, 0, .03, .12, .015); lf.rotation.z = (i - 1.5) * .35; list[1].topG.add(lf); }
    for (let i = 0; i < 5; i++) list[1].topG.add(sph(M(0x8a6a3a), -.12 + i * .06, .02, .12, .02, .015, .015));
    root.traverse((m) => { if (m.isMesh) m.castShadow = false; }); return { root, list }; }
  // echtes Entenfutter auf dem Wasser: Wasserlinsen, Samen, Schnecke, Mücken
  function makeWild() { const root = new T.Group(); const list = [];
    const duckweed = M(0x7ccf4a, { roughness: .6 }), seed = M(0x9a6a2a, { roughness: .7 }), shell = M(0xb7793a, { roughness: .5 }), snail = M(0xd8c09a, { roughness: .6 }), fly = M(0x222222, { roughness: .5 }), wingM = M(0xdff4ff, { transparent: true, opacity: .7 });
    for (let i = 0; i < 18; i++) { const p = mesh(CYL, duckweed, 0, 0, 0, .03, .006, .03); root.add(p); list.push({ m: p, k: "weed", i }); }
    for (let i = 0; i < 8; i++) { const p = sph(seed, 0, 0, 0, .022, .014, .014); root.add(p); list.push({ m: p, k: "seed", i }); }
    const sn = new T.Group(); sn.add(mesh(new T.TorusGeometry(.04, .025, 10, 20), shell, 0, .05, 0)); sn.add(sph(snail, .04, .015, 0, .07, .018, .025)); sn.add(mesh(CYL, snail, .09, .045, 0, .006, .05, .006)); root.add(sn); list.push({ m: sn, k: "snail", i: 0 });
    for (let i = 0; i < 4; i++) { const f = new T.Group(); f.add(sph(fly, 0, 0, 0, .025, .012, .012)); for (const s of [-1, 1]) { const w = sph(wingM, -.005, .012, s * .02, .02, .004, .012); f.add(w); } root.add(f); list.push({ m: f, k: "fly", i }); }
    root.traverse((m) => { if (m.isMesh) m.castShadow = false; }); return { root, list }; }
  // Futter an Land: Haferflocken, Erbsen, Mais
  function makeFood() { const root = new T.Group(); const list = [];
    const pea = M(0x5fc34a, { roughness: .45 }), corn = M(0xffd23f, { roughness: .45 }), oat = M(0xe8d3a5, { roughness: .9 });
    for (let i = 0; i < 36; i++) { const k = i % 3; const m = k === 0 ? sph(pea, 0, 0, 0, .022) : k === 1 ? mesh(BOX, corn, 0, 0, 0, .03, .022, .025) : sph(oat, 0, 0, 0, .025, .006, .018); root.add(m); list.push(m); }
    root.traverse((m) => { if (m.isMesh) m.castShadow = false; }); return { root, list }; }
  // Goldfisch (für Querschnitt)
  function makeFish() { const root = new T.Group(), body = new T.Group(); root.add(body); const o = M(0xff8a1a, { roughness: .35 }), o2 = M(0xffb347, { roughness: .4 });
    body.add(sph(o, 0, 0, 0, .13, .08, .05)); const tail = new T.Group(); tail.position.set(-.12, 0, 0); body.add(tail);
    for (const s of [-1, 1]) { const f = sph(o2, -.06, s * .04, 0, .07, .035, .008); f.rotation.z = s * .6; tail.add(f); }
    body.add(sph(o2, 0, .08, 0, .06, .03, .008));
    const mouth = sph(M(0x7a2a10), .13, -.005, 0, .012, .018, .02); body.add(mouth);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.08, .02, s * .04); body.add(e); e.add(sph(M(0xffffff), 0, 0, 0, .025)); e.add(sph(M(0x111111), .008, 0, s * .012, .014)); e.add(sph(M(0xffffff, { emissive: 0xffffff }), .015, .008, s * .02, .005)); eyes.push(e); }
    root.traverse((m) => m.castShadow = false); return { root, body, tail, eyes, mouth }; }
  function poseFish(F, t, o) { o = o || {}; F.tail.rotation.y = Math.sin(t * 8) * .4; F.body.rotation.z = (o.up || 0) + Math.sin(t * 2) * .05; F.body.position.y = Math.sin(t * 2.4) * .02;
    F.mouth.scale.set(.012, .018 * (o.gasp ? .4 + Math.abs(Math.sin(t * 9)) * 1.2 : .6), .02); F.eyes.forEach((e) => e.scale.setScalar(o.wide ? 1.3 : 1)); F.root.scale.setScalar(o.sc || 1); }
  // Teich-Querschnitt (Studio): Erde, Folie, Schlamm, Wasser; faulende Brotbrocken, Algenteppich, Sauerstoffblasen
  const SX = .9, FLOOR = .2, WTOP = 1.0, SZ = .45;
  function makeSection() { const root = new T.Group();
    const earth = M(0x7a5232, { roughness: .95 }), grass = M(0x6fba52, { roughness: .9 }), liner = M(0x2a2a30, { roughness: .6 }), mud = M(0x4a3524, { roughness: .95 });
    root.add(mesh(BOX, earth, 0, .05, 0, 2 * SX + .9, .1, 2 * SZ));
    for (const s of [-1, 1]) { root.add(mesh(BOX, earth, s * (SX + .23), .525, 0, .46, 1.05, 2 * SZ));
      root.add(mesh(BOX, grass, s * (SX + .23), 1.08, 0, .5, .07, 2 * SZ + .04)); for (let i = 0; i < 5; i++) root.add(mesh(new T.ConeGeometry(.025, .12, 6), grass, s * (SX + .05 + i * .09), 1.17, SZ - .05 - (i % 2) * .2)); }
    root.add(mesh(BOX, earth, 0, .525, -SZ - .05, 2 * SX + .9, 1.05, .1));
    root.add(mesh(BOX, liner, 0, .12, 0, 2 * SX, .02, 2 * SZ)); for (const s of [-1, 1]) root.add(mesh(BOX, liner, s * (SX - .01), .55, 0, .02, .9, 2 * SZ));
    root.add(mesh(BOX, liner, 0, .55, -SZ + .01, 2 * SX, .9, .02));
    root.add(mesh(BOX, mud, 0, .16, 0, 2 * SX - .02, .08, 2 * SZ - .02));
    const water = mesh(BOX, M(0x3fa2e0, { roughness: .1, transparent: true, opacity: .2, depthWrite: false }), 0, (FLOOR + WTOP) / 2, 0, 2 * SX - .04, WTOP - FLOOR, 2 * SZ - .04); water.castShadow = false; water.receiveShadow = false; root.add(water);
    const surf = mesh(BOX, M(0x8fd4ff, { roughness: .05, transparent: true, opacity: .45, depthWrite: false }), 0, WTOP, 0, 2 * SX - .04, .01, 2 * SZ - .04); surf.castShadow = false; root.add(surf);
    root.traverse((m) => { if (m.isMesh) m.castShadow = false; });
    return { root, water }; }
  function makeSectBread() { const root = new T.Group(), list = []; for (let i = 0; i < 7; i++) { const c = new T.Group(); const a = M(0xf5deb0, { roughness: .95 }), b = M(0xc98a3e, { roughness: .9 });
      c.add(mesh(BOX, b, 0, 0, 0, .12, .05, .1)); c.add(mesh(BOX, a, 0, .003, 0, .1, .052, .08)); root.add(c); list.push({ g: c, a, b }); } return { root, list }; }
  function makeAlgae() { const root = new T.Group(), list = []; const m = M(0x5aa82a, { roughness: .7 }), m2 = M(0x3f8a22, { roughness: .7 });
    for (let i = 0; i < 26; i++) { const x = -SX + .1 + (i * .37 % 1) * (2 * SX - .2), z = -SZ + .08 + (i * .61 % 1) * (2 * SZ - .2); const b = sph(i % 2 ? m : m2, x, WTOP + .005, z, .1, .015, .08); b.castShadow = false; root.add(b); list.push(b); }
    for (let i = 0; i < 10; i++) { const x = -SX + .12 + i * .17; const s = mesh(CYL, m2, x, WTOP - .12, .2 - (i % 3) * .15, .012, .24, .012); s.rotation.z = (i % 2 ? .2 : -.2); s.castShadow = false; root.add(s); list.push(s); }
    return { root, list }; }
  function makeBubbles(n, col, emi) { const root = new T.Group(), list = []; const m = M(col, { roughness: .2, emissive: emi, emissiveIntensity: .5, transparent: true, opacity: .85 }); for (let i = 0; i < n; i++) { const b = sph(m, 0, 0, 0, .03); b.castShadow = false; root.add(b); list.push(b); } return { root, list }; }

  K3.onBuild(() => {
    rudi = K3.rudi; drake = actor(makeDuck("drake"), "Erpel"); hen = actor(makeDuck("hen"), "Ente"); duck3 = actor(makeDuck("drake"), "Erpel 2"); young = actor(makeDuck("young"), "Jungente");
    park = actor(makePark(), "Teich"); slices = actor(makeSlices(16), "Brot"); bag = actor(makeBag(), "Tuete"); baguette = actor(makeBaguette(), "Baguette");
    rats = [actor(makeRat(), "Ratte 1"), actor(makeRat(), "Ratte 2"), actor(makeRat(), "Ratte 3")]; diner = actor(makeDiner(), "Schild");
    bars = actor(makeBars(), "Balken"); wild = actor(makeWild(), "Naturfutter"); sect = actor(makeSection(), "Querschnitt"); fish = actor(makeFish(), "Goldfisch");
    food = actor(makeFood(), "Futter"); sectBread = actor(makeSectBread(), "Brotbrocken"); algae = actor(makeAlgae(), "Algen"); oxy = actor(makeBubbles(12, 0xbff0ff, 0x4aa8d8), "Sauerstoff");
    for (const a of [park, slices, bag, baguette, diner, bars, wild, sect, fish, food, sectBread, algae, oxy]) a.noCheck = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
    K3.yard.traverse((m) => { if (m.isMesh && m.geometry && m.geometry.type === "CircleGeometry" && m.scale.y > 5) m.visible = false; }); // Gartenweg aus
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
    K3.yard.traverse((m) => { if (m.isMesh && Math.abs(m.position.y - .09) < .001 && Math.abs(m.scale.x - .09) < .001) m.visible = false; }); // Blumenkugeln aus
  });
  function reset() { rudi.noCheck = false; rudi.body.position.set(0, 0, 0); rudi.root.scale.setScalar(1);
    for (const D of [drake, hen, duck3, young]) { D.root.rotation.set(0, 0, 0); D.noCheck = false; } rats.forEach((r) => { r.noCheck = false; }); }
  function inPark() { begin("yard"); reset(); place(park, PX, PZ); park.ripples(0, []); }
  function studio() { begin("studio"); reset(); }
  const PX = .55, PZ = 0; // Teichmitte
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function hand(i) { return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function hands() { rudi.root.updateMatrixWorld(true); return hand(0).add(hand(1)).multiplyScalar(.5); }
  function shoulder() { rudi.root.updateMatrixWorld(true); return rudi.arms[0].localToWorld(V(0, 0, 0)).add(rudi.arms[1].localToWorld(V(0, 0, 0))).multiplyScalar(.5); }
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  function hideSlices() { slices.list.forEach((s) => s.root.visible = false); }
  // Scheibe i fliegt im Bogen von a nach b (q 0..1), danach schwimmt sie (sink 0..1 = versinkt)
  function flySlice(i, a, b, q, t, sink) { const s = slices.list[i]; s.root.visible = true; const k = clamp(q, 0, 1);
    const p = a.clone().lerp(b, k); p.y = lerp(a.y, b.y, k) + Math.sin(k * PI) * .5; if (k >= 1) p.y = b.y + Math.sin(t * 2.5 + i) * .008 - (sink || 0) * .12;
    s.root.position.copy(p); s.root.rotation.set(k < 1 ? k * 8 + i : 0, i * 1.7, k < 1 ? k * 5 : 0); if ((sink || 0) > .95) s.root.visible = false; }
  function quackTxt(x, y, t, s, ph) { const q = ((t * 1.3 + (ph || 0)) % 1); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = Math.sin(q * PI); g.fillStyle = "#fff"; g.strokeStyle = "rgba(20,30,60,.7)"; g.lineWidth = 8;
    g.font = `900 ${Math.round(46 * (s || 1))}px "Montserrat"`; g.textAlign = "center"; const w = L("QUACK!", "QUAK!"); g.strokeText(w, x, y - q * 60); g.fillText(w, x, y - q * 60); g.restore(); }

  // ---------- Shots ----------
  // 0 Hook: Nahaufnahme, Erpel auf dem Teich schnappt eine Toastscheibe, die ins Bild fliegt
  KZ.shot("bHook", (lt, d, t) => { inPark(); const ph = lt / d;
    at(drake, PX - .3, 0, PZ + .35, -.5); const got = ph > .42;
    poseDuck(drake, t, got ? { bread: true, happy: true, sc: 1.5 } : { look: -.1, open: .25, wide: true, sc: 1.5, up: 1 });
    hideSlices(); if (!got) { drake.root.updateMatrixWorld(true); const tgt = drake.head.localToWorld(V(.2, -.02, 0)); flySlice(0, V(tgt.x - 1.4, tgt.y + .6, tgt.z + .9), tgt, ph / .42, t); }
    park.ripples(t, [[PX - .3, PZ + .35]]);
    frameOn([drake], { az: lerp(.62, .52, ph), el: .12, fill: lerp(.7, .78, ph), dy: .05, t }); draw();
    if (ph > .45) stamp(L("JUNK FOOD?!", "JUNKFOOD?!"), W * .42, H * .62, (ph - .45) * d / .3, "#e5484d", -.06); });
  // 1 Rudi am Ufer wirft Brot, drei Enten paddeln heran und schnattern; Rudi strahlt
  KZ.shot("bHero", (lt, d, t) => { inPark(); const ph = lt / d, k = sm(ph);
    place(rudi, -1.75, .05, .1); const thr = (lt * 1.6) % 1; poseRudi(rudi, t, { arms: [.2, thr < .4 ? lerp(1.7, .7, sm(thr / .4)) : lerp(.7, 1.7, sm((thr - .4) / .6))], spread: .1, mouth: "smile", nod: .05 });
    const pos = [[-.5, .6], [0, -.45], [.55, .15]]; [drake, hen, duck3].forEach((D, i) => { const ap = sm(clamp(ph * 1.3 - i * .1, 0, 1)); at(D, lerp(PX + .7, pos[i][0], ap), 0, lerp(pos[i][1] * 1.4, pos[i][1], ap), PI + .1 * (i - 1)); poseDuck(D, t, { quack: true, ph: i * 1.3, up: .6, wide: i === 1 }); });
    hideSlices(); rudi.root.updateMatrixWorld(true); const hp = hand(1); if (ph < .5) rudi.root.visible = false; else { hen.root.visible = false; duck3.root.visible = false; }
    for (let i = 0; i < 3; i++) { const q = ((lt * 1.6 - .25 - i) ); if (q < 0) continue; flySlice(i, hp, V(pos[i][0] + .12, .03, pos[i][1]), q * 1.4, t); }
    park.ripples(t, pos.map((p) => [p[0], p[1]]));
    if (ph < .5) { frameOn([drake, hen, duck3], { az: lerp(.62, .55, k), el: .2, fill: lerp(.9, .96, k), t }); draw();
      [drake, hen, duck3].forEach((D, i) => { const [x, y] = scr(D.head.localToWorld(V(0, .15, 0))); if (i !== 1) quackTxt(x, y - 20, t, 1.1, i * .4); }); }
    else { frameOn([rudi, drake], { az: lerp(.5, .45, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw(); }
    if (ph > .55) stamp(L("HERO!", "HELD!"), W * .42, H * .17, (ph - .55) * d / .3, "#ffb800", -.06); });
  // 2 Rudi kippt eine ganze Brottüte aus – Schnitt: pappsatte Enten zwischen treibenden Scheiben, Reste versinken
  KZ.shot("bBag", (lt, d, t) => { inPark(); const ph = lt / d;
    if (ph < .5) { const k = ph / .5; place(rudi, -1.15, .05, .1);
      poseRudi(rudi, t, { arms: [1.35, 1.35], spread: .02, mouth: "smile", lean: .1 });
      const hp = hands(); place(bag, 0, 0, 0); bag.root.position.set(hp.x + .1, hp.y - .25, hp.z); bag.root.rotation.set(0, 0, -lerp(.3, 1.9, sm(clamp(k * 1.5, 0, 1))));
      hideSlices(); for (let i = 0; i < 12; i++) { const q = (k * 2.2 - i * .1); if (q < 0) continue; const a = i * 2.399; flySlice(i, V(hp.x + .3, hp.y - .1, hp.z), V(PX - .6 + (i % 4) * .3, .03, PZ - .45 + Math.floor(i / 4) * .35 + Math.sin(a) * .06), q * 1.3, t); }
      [drake, hen].forEach((D, i) => { at(D, PX - .2 + i * .25, 0, PZ + (i ? -.4 : .35), PI); poseDuck(D, t, { quack: true, ph: i, up: .6, wide: true }); });
      frameOn([rudi, drake, hen], { az: lerp(.55, .5, k), el: .2, fill: lerp(.86, .9, k), t }); draw();
      stamp(L("WHOLE BAG", "GANZE TÜTE"), W * .42, H * .17, (lt - .2) / .3, "#ff9f1c", -.06); }
    else { const k = (ph - .5) / .5; hideSlices();
      for (let i = 0; i < 12; i++) { const a = i * 2.399; flySlice(i, V(0, 0, 0), V(PX - .65 + (i % 4) * .32, .03, PZ - .5 + Math.floor(i / 4) * .36 + Math.sin(a) * .06), 1, t, sm(clamp(k * 1.6 - (i % 5) * .12, 0, 1))); }
      at(drake, PX - 1.0, 0, PZ + .45, -.6); poseDuck(drake, t, { stuffed: sm(clamp(k * 2, 0, 1)), sleepy: k > .2, sc: 1.15 });
      at(hen, PX - .4, 0, PZ - .55, -.4); poseDuck(hen, t, { stuffed: sm(clamp(k * 2 - .2, 0, 1)), sleepy: k > .3, ph: 1, sc: 1.15, look: .3 });
      frameOn([drake, hen, FR(PX - 1.2, 0, PZ - .6, PX + .1, .2, PZ + .5)], { az: lerp(.5, .44, k), el: .3, fill: lerp(.88, .94, k), t }); draw();
      stamp(L("STUFFED", "PAPPSATT"), W * .42, H * .17, (k * d * .5 - .1) / .3, "#7a5cff", .06);
      if (k > .45) stamp(L("SINKING...", "VERSINKT..."), W * .42, H * .62, (k - .45) * d * .5 / .3, "#2f6fd0", -.05); } });
  // 3 Rudi schleppt ein Riesenbaguette heran – Schnitt: Ratten kommen aus dem Schilf und knabbern am Brot am Ufer
  KZ.shot("bBaguette", (lt, d, t) => { inPark(); const ph = lt / d;
    if (ph < .5) { const k = ph / .5; place(rudi, lerp(-2.0, -1.3, sm(k)), .2, 0); poseRudi(rudi, t, { arms: [1.25, 1.25], spread: .02, walk: k < .8 ? 1 : 0, mouth: "o", lean: .1 }); rudi.noCheck = true;
      const hp = hands(); place(baguette, 0, 0, 0); baguette.root.position.set(hp.x + .12, hp.y + .05, hp.z); baguette.root.rotation.set(0, PI / 2, Math.sin(t * 8) * .03 * (k < .8 ? 1 : 0));
      at(drake, PX - .55, 0, PZ + .1, PI - .3); poseDuck(drake, t, { wide: true, look: .2, up: 1, ph: 2 });
      frameOn([rudi, baguette, drake], { az: lerp(.45, .4, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw();
      stamp(L("XXL!", "XXL!"), W * .42, H * .17, (lt - .2) / .3, "#ff9f1c", -.06); }
    else { const k = (ph - .5) / .5; place(baguette, 0, 0, 0); baguette.root.position.set(-1.35, .1, -.3); baguette.root.rotation.set(0, .2, 0); baguette.root.scale.setScalar(.45);
      hideSlices(); for (let i = 0; i < 3; i++) flySlice(i, V(0, 0, 0), V(-1.05 + i * .2, .03, .3 + i * .45), 1, t);
      rats.forEach((R, i) => { const ap = sm(clamp(k * 1.6 - i * .2, 0, 1)); const tx = -1.55 + i * .2, tz = .3 + i * .45;
        at(R, lerp(tx - .35, tx, ap), 0, tz, 0); poseRat(R, t, ap < 1 ? { run: 1, ph: i, sc: 1.05 } : { eat: true, bread: true, ph: i, sc: 1.05 }); });
      frameOn([FR(-1.8, 0, .1, -.75, .35, 1.45)], { az: lerp(.95, .88, k), el: .3, fill: lerp(.92, 1.0, k), t }); draw();
      stamp(L("RATS!", "RATTEN!"), W * .42, H * .17, (k * d * .5 - .1) / .3, "#e5484d", .06); } });
  // 4 Infografik: Brot-Balken (Eiweiß/Vitamine) bleibt winzig, echtes Futter schießt hoch; dazu pappsatte Ente mit "VOLL"-Anzeige
  KZ.shot("bBars", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bars, .45, 0, -.1, 0); const a = easeBack(clamp((ph - .15) / .3, 0, 1)), b = easeBack(clamp((ph - .45) / .3, 0, 1));
    const hs = [.08 * a + .01, .01 + b * 1.3]; bars.list.forEach((B, i) => { const h = hs[i]; B.bar.scale.y = h; B.bar.position.y = h / 2; B.topG.position.y = h + .02; B.topG.visible = h > .03; });
    at(drake, -.8, 0, .35, -1.0); poseDuck(drake, t, { stuffed: 1, sleepy: true, land: true, sc: 1.0 });
    frameOn([FR(-1.35, 0, -.3, 1.0, 1.55, .7)], { az: lerp(.16, .08, k), el: .12, fill: lerp(.88, .94, k), t }); draw();
    txt(L("PROTEIN + VITAMINS", "EIWEISS + VITAMINE"), W * .42, H * .2, 62, "#ffd23f", { stroke: 12 });
    if (ph > .2 && ph < .7) stamp(L("ALMOST ZERO", "FAST NULL"), W * .5, H * .3, (ph - .2) * d / .3, "#e5484d", -.08);
    const [x, y] = scr(drake.head.localToWorld(V(0, .2, 0))); if (ph > .1) txt(L("FULL", "VOLL"), x, y - 40, 52, "#ffffff", { stroke: 10, a: clamp((ph - .1) * 4, 0, 1) }); });
  // 5 Echtes Futter treibt vorbei (Wasserlinsen, Samen, Schnecke, Mücken), satte Ente dreht den Kopf weg + Quellenkarte
  KZ.shot("bReal", (lt, d, t) => { inPark(); const ph = lt / d, k = sm(ph);
    at(drake, PX - .1, 0, PZ + .1, -.4); poseDuck(drake, t, { stuffed: .8, sleepy: true, look: -.7 * sm(clamp(ph * 3, 0, 1)), sc: 1.3 });
    place(wild, 0, 0, 0); drake.root.updateMatrixWorld(true); const c = drake.root.position;
    wild.list.forEach((w, i) => { const a = i * 2.399 + t * .15, r = .45 + (i % 4) * .08; const x = c.x + Math.cos(a) * r, z = c.z + Math.sin(a) * r * .8;
      if (w.k === "fly") w.m.position.set(c.x + Math.cos(t * 3 + i * 1.6) * .35, .55 + Math.sin(t * 5 + i) * .08, c.z + Math.sin(t * 3 + i * 1.6) * .3);
      else if (w.k === "snail") { w.m.position.set(c.x + .55, .03, c.z + .35); w.m.rotation.y = -.8; }
      else w.m.position.set(x, .03, z); });
    park.ripples(t, [[c.x, c.z]]);
    frameOn([drake, FR(c.x - .6, 0, c.z - .5, c.x + .6, .7, c.z + .5)], { az: lerp(.5, .42, k), el: .3, fill: lerp(.85, .9, k), t }); draw();
    stamp(L("NOT HUNGRY", "KEIN HUNGER"), W * .42, H * .17, (lt - .2) / .3, "#7a5cff", -.06);
    const cp = sm((lt - d * .4) / .3); if (card(W * .42, H * .62, 900, 230, cp, L("Canal & River Trust", "LBV (Vogelschutz Bayern)"), "#2f6fd0")) {
      txt(L("Bread “fills the duck's stomach", "„Brot ist kein geeignetes"), W * .42, H * .62 + 10, 38, "#1d2250", { a: clamp(cp, 0, 1) });
      txt(L("so that it doesn't forage”", "Futter“"), W * .42, H * .62 + 60, 38, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 6 Das Krasseste: Jungente mit abstehendem Flügel (Engelsflügel) flattert, hüpft, kommt nicht hoch
  KZ.shot("bAngel", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    const tryF = ph > .45; const hop = tryF ? Math.max(0, Math.sin((lt - d * .45) * 7)) * .5 : 0;
    at(young, 0, 0, 0, -.35); poseDuck(young, t, { angel: 1, angelK: easeBack(clamp((ph - .1) / .3, 0, 1)), land: true, flap: tryF ? 1 : 0, hop, sad: tryF, wide: !tryF, sc: 1.7, up: .5 });
    frameOn([FR(-.65, 0, -.4, .65, 1.1, .4)], { az: lerp(1.05, .95, k), el: .2, fill: lerp(.82, .88, k), t }); draw();
    stamp(L("ANGEL WING", "ENGELSFLÜGEL"), W * .42, H * .17, (lt - .3) / .3, "#2f6fd0", -.06);
    if (ph > .65) stamp(L("CAN'T FLY", "FLIEGT NICHT"), W * .42, H * .62, (ph - .65) * d / .3, "#e5484d", .06); });
  // 7 Querschnitt: Brotbrocken sinken, werden grau-grün, Algenteppich wächst, Fisch schnappt nach Luft, Sauerstoffblasen verschwinden
  KZ.shot("bRot", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(sect, 0, 0, 0);
    sectBread.root.visible = true; const rot = sm(clamp((ph - .2) / .5, 0, 1));
    sectBread.list.forEach((B, i) => { const q = sm(clamp(ph * 1.8 - i * .08, 0, 1)); const x = -SX + .2 + i * .24; B.g.position.set(x, lerp(WTOP - .03, FLOOR + .03, q), -.1 + (i % 3) * .12); B.g.rotation.set(0, i, q * (i % 2 ? .3 : -.3));
      B.a.color.setRGB(lerp(.91, .45, rot), lerp(.73, .5, rot), lerp(.48, .3, rot)); B.b.color.setRGB(lerp(.58, .3, rot), lerp(.27, .35, rot), lerp(.05, .15, rot)); });
    algae.root.visible = true; const gr = sm(clamp((ph - .35) / .4, 0, 1)); algae.list.forEach((b, i) => { b.visible = gr > i / algae.list.length * .9; });
    at(fish, .35, lerp(.6, WTOP - .1, sm(clamp((ph - .5) / .3, 0, 1))), .05, 0); poseFish(fish, t, { gasp: ph > .6, wide: ph > .55, up: ph > .6 ? .5 : 0, sc: 1.5 });
    oxy.root.visible = true; const nOx = Math.round(lerp(12, 1, sm(clamp((ph - .3) / .5, 0, 1)))); oxy.list.forEach((b, i) => { b.visible = i < nOx; const q = (t * .4 + i / 12) % 1; b.position.set(-SX + .15 + (i * .37 % 1) * (2 * SX - .3), lerp(FLOOR + .1, WTOP - .05, q), -.05 + (i % 3) * .1); b.scale.setScalar(.022); });
    frameOn([FR(-SX - .1, FLOOR, -SZ, SX + .1, WTOP + .15, SZ)], { az: lerp(.14, .08, k), el: .1, fill: lerp(1.0, 1.06, k), dy: .05, t }); draw();
    stamp(L("ROTTING", "FAULT"), W * .42, H * .17, (lt - .2) / .3, "#7cb518", -.06);
    if (ph > .6) stamp(L("NO OXYGEN", "KEIN SAUERSTOFF"), W * .42, H * .62, (ph - .6) * d / .3, "#e5484d", .06); });
  // 8 Pointe: Ratten sitzen am Baguette vor dem Ratten-Imbiss-Schild, Rudi kratzt sich am Kopf
  KZ.shot("bPunch", (lt, d, t) => { inPark(); const ph = lt / d, k = sm(ph);
    place(rudi, -2.4, -.3, 0); poseRudi(rudi, t, { arms: [.35, .35 + Math.sin(t * 3) * .1], spread: .9, mouth: "o", tilt: -.1 });
    place(baguette, 0, 0, 0); baguette.root.position.set(-1.35, .14, .5); baguette.root.rotation.set(0, .15, 0); baguette.root.scale.setScalar(.55);
    place(diner, -1.1, .15, .3);
    rats.forEach((R, i) => { at(R, -1.6 + i * .38, 0, 1.0 + (i % 2) * .12, PI / 2 + .15 * (i - 1)); poseRat(R, t, { eat: true, bread: i !== 1, sit: i === 1 ? .6 : 0, ph: i * 2, sc: 1.3 }); });
    frameOn([rudi, diner, ...rats], { az: lerp(.42, .36, k), el: .2, fill: lerp(.94, 1.0, k), t }); draw();
    stamp(L("FAST FOOD", "FASTFOOD"), W * .42, H * .17, (lt - .25) / .3, "#ff9f1c", -.06); });
  // 9 Tipp: Rudi streut eine kleine Handvoll Haferflocken/Erbsen/Mais ans Ufer, zwei Enten watscheln an Land und picken
  KZ.shot("bTip", (lt, d, t) => { inPark(); const ph = lt / d, k = sm(ph);
    place(rudi, -2.1, -.2, .2); const sc = (lt * 1.2) % 1; poseRudi(rudi, t, { arms: [.2, lerp(1.0, 1.5, Math.sin(sc * PI))], spread: .1, mouth: "smile", nod: .05 });
    place(food, 0, 0, 0); rudi.root.updateMatrixWorld(true); const hp = hand(1);
    food.list.forEach((m, i) => { const q = clamp(ph * 2.2 - i * .02, 0, 1); const tx = -1.35 + (i * .37 % 1) * .5, tz = .75 + (i * .61 % 1) * .55; const eaten = ph > .75 && i % 3 === 0;
      m.visible = q > 0 && !eaten; m.position.set(lerp(hp.x, tx, q), q < 1 ? lerp(hp.y, .02, q) + Math.sin(q * PI) * .2 : .02, lerp(hp.z, tz, q)); m.rotation.y = i; });
    const two = ph > .45, k2 = clamp((ph - .45) / .55, 0, 1); if (two) rudi.root.visible = false;
    const pos = [[-1.5, .5], [-.9, 1.35]]; if (two) [drake, hen].forEach((D, i) => { const ap = sm(clamp(k2 * 2.2 - i * .3, 0, 1)); at(D, lerp(pos[i][0] + .35, pos[i][0], ap), 0, lerp(pos[i][1] - .35, pos[i][1], ap), PI - .4 + i * .5);
      poseDuck(D, t, ap < 1 ? { land: true, walk: 1, ph: i * 2, up: .4 } : { land: true, eat: Math.abs(Math.sin(t * 5 + i * 2)), happy: true, ph: i * 2 }); });
    if (!two) frameOn([rudi, FR(-1.5, 0, .6, -.6, .3, 1.4)], { az: lerp(.55, .5, k), el: .2, fill: .95, t }); else frameOn([FR(-1.8, 0, .2, -.05, .55, 1.7)], { az: lerp(.95, .85, k2), el: .3, fill: lerp(.95, 1.02, k2), t }); draw();
    if (two) stamp(L("OATS · PEAS · CORN", "HAFER · ERBSEN · MAIS"), W * .42, H * .62, (k2 * d * .55 - .1) / .3, "#ff9f1c", .05);
    stamp(L("SMALL HANDFUL", "KLEINE HANDVOLL"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06);
  });
  // 10 Loop: zurück zur Hook-Einstellung (Erpel schaut hoch, Brot fliegt gleich ins Bild)
  KZ.shot("bLoop", (lt, d, t) => { inPark(); const ph = lt / d;
    at(drake, PX - .3, 0, PZ + .35, -.5); poseDuck(drake, t, { look: -.1, wide: ph > .4, up: 1, sc: 1.5 });
    hideSlices(); park.ripples(t, [[PX - .3, PZ + .35]]);
    frameOn([drake], { az: lerp(.66, .62, ph), el: .12, fill: lerp(.68, .7, ph), dy: .05, t }); draw();
    if (ph > .3) stamp(L("BREAD?", "BROT?"), W * .42, H * .62, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__duckbread3d = true;
})();
