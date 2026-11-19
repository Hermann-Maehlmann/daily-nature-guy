// 3D-Szene "Why Your Hamster Doesn't Want A Friend" (19.11.2026). Syrischer Goldhamster (Einzelgänger), zweiter Hamster "Buddy",
// Drahtkäfig, Geschenkkarton, Raufwolke, zweistöckige Hamster-Villa mit zwei Laufrädern, Freundschafts-Party mit Torte und Partyhüten,
// Bau-Querschnitt (Feldstudie Syrien: je Bau nur ein erwachsener Hamster), Tunnel bis 9 m, RSPCA-Quellenkarte, Käfig mit tiefer Einstreu.
// Quellen: RSPCA (Hamster company: "Syrian and Chinese hamsters aren't naturally sociable and should always live on their own"),
// Gattermann et al. 2001, J. Zool. (Notes on the current distribution and the ecology of wild golden hamsters: kein bewohnter Bau mit mehr als einem Adulten, Gänge bis 9 m).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  let ham, bud, ham3, ham4, rudi, room, roomBg, cage, villa, gift, cloud, cake, wheelT, bedCage, soil, tunnel, seed;
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }

  // ---------- Syrischer Goldhamster (goldbraun oben, cremeweiß unten, dunkler Backenfleck, runde Ohren, Knopfaugen, Stummelschwanz) ----------
  function makeHamster(col, colD) {
    const fur = M(col, { roughness: .8 }), furD = M(colD, { roughness: .8 }), cream = M(0xfff1dc, { roughness: .85 }), pink = M(0xffa3b1, { roughness: .5 });
    const black = M(0x120c10, { roughness: .08 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), wh = M(0xffffff, { roughness: .4 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(fur, 0, .2, 0, .25, .19, .2));
    body.add(sph(furD, -.04, .27, 0, .17, .1, .13));
    body.add(sph(cream, .05, .14, 0, .2, .12, .17));
    body.add(sph(pink, -.25, .17, 0, .025, .02, .02));
    const legs = []; for (const [x, s] of [[.13, -1], [.13, 1], [-.12, -1], [-.12, 1]]) { const l = limb(.028, .07, pink); l.position.set(x, .075, s * .11); l.add(sph(pink, .015, -.075, 0, .035, .015, .028)); body.add(l); legs.push(l); }
    const head = new T.Group(); head.position.set(.2, .27, 0); body.add(head);
    head.add(sph(fur, 0, 0, 0, .16, .15, .16));
    const cheeks = []; for (const s of [-1, 1]) { const c = sph(cream, .06, -.05, s * .095, .095, .08, .085); head.add(c); c.base = c.scale.clone(); cheeks.push(c); }
    for (const s of [-1, 1]) head.add(sph(furD, .02, .0, s * .135, .05, .045, .03));
    head.add(sph(cream, .13, -.035, 0, .065, .055, .065));
    head.add(sph(pink, .19, -.01, 0, .022, .018, .024));
    const mouth = mesh(new T.TorusGeometry(.016, .004, 6, 12, PI), M(0x5a2a20), .185, -.055, 0); mouth.rotation.set(0, PI / 2, PI); head.add(mouth);
    for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.03, .13, s * .095); e.rotation.x = s * .35; head.add(e);
      e.add(sph(fur, 0, 0, 0, .05, .06, .022)); e.add(sph(pink, .006, 0, 0, .036, .045, .016)); }
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.105, .045, s * .085); head.add(e);
      e.add(sph(black, 0, 0, 0, .04, .043, .04)); e.add(sph(hl, .03, .017, -.008 * s, .011)); eyes.push(e); }
    // Böse Augenbrauen (nur beim Streit)
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, M(0x3a2216, { roughness: .6 }), .12, .1, s * .085, .015, .016, .075); b.castShadow = false; head.add(b); brows.push(b); }
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .17, -.04 + i * .015, s * .09, .003, .13, .003); w.rotation.x = s * (PI / 2 - .25 + i * .2); w.castShadow = false; head.add(w); }
    // Partyhut (Kegel mit Bommel, sitzt hinter den Ohren auf dem Kopf, Augen bleiben frei)
    const hat = new T.Group(); hat.position.set(-.04, .17, 0); hat.rotation.z = .25; head.add(hat);
    const hatTex = canvasTex(128, 128, (c, w, h) => { c.fillStyle = "#ff5d8f"; c.fillRect(0, 0, w, h); c.fillStyle = "#ffd23f"; for (let i = -4; i < 8; i++) { c.save(); c.translate(i * 22, 0); c.rotate(.5); c.fillRect(0, -20, 9, 200); c.restore(); } });
    hat.add(mesh(new T.ConeGeometry(.075, .2, 24), new T.MeshStandardMaterial({ map: hatTex, roughness: .5 }), 0, .1, 0));
    hat.add(sph(M(0xffffff, { roughness: .9 }), 0, .2, 0, .03)); hat.visible = false;
    const stars = new T.Group(); head.add(stars); const sm8 = M(0xffd23f, { emissive: 0xffb000, emissiveIntensity: .6 });
    for (let i = 0; i < 3; i++) { const s = sph(sm8, 0, 0, 0, .025); s.castShadow = false; stars.add(s); }
    return { root, body, legs, head, eyes, cheeks, stars, brows, hat };
  }
  // o: {run, lid, dizzy, look, nod, sc, puff, up, angry, hat, lean, dig}
  function poseHam(Hm, t, o) {
    o = o || {}; const run = o.run || 0;
    Hm.legs.forEach((l, i) => l.rotation.z = Math.sin(t * 22 + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .7 * run + (o.dig && i < 2 ? Math.sin(t * 30 + i * PI) * .9 - .6 : 0));
    Hm.body.position.y = Math.abs(Math.sin(t * 22)) * .012 * run + Math.sin(t * 3) * .004;
    Hm.body.rotation.z = (o.lean || 0);
    Hm.head.rotation.set(o.tilt || 0, o.look || 0, (o.nod || 0) + (o.up || 0) + Math.sin(t * 2.3) * .03);
    const lid = o.lid ?? (Math.sin(t * 1.6 + .5) > .985 ? .85 : 0);
    Hm.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid), 1));
    Hm.cheeks.forEach((c) => c.scale.copy(c.base).multiplyScalar(1 + (o.puff || 0) * .35));
    Hm.brows.forEach((b, i) => { b.visible = !!o.angry; b.rotation.x = (i ? -1 : 1) * .5; });
    Hm.hat.visible = !!o.hat;
    Hm.stars.visible = !!o.dizzy; Hm.stars.children.forEach((s, i) => { const a = t * 6 + i * 2.1; s.position.set(Math.cos(a) * .14, .2 + Math.sin(a * 2) * .02, Math.sin(a) * .14); });
    Hm.root.scale.setScalar(o.sc || 1);
  }
  function at(Hm, x, y, z, ry, t, o) { Hm.root.visible = true; Hm.root.position.set(x, y, z); Hm.root.rotation.set(0, ry || 0, 0); poseHam(Hm, t, o); }

  // ---------- Drahtkäfig (Wanne + Einstreu, Gitter hinten/seitlich/oben, vorn offen wie ein Diorama) ----------
  function makeCage(Wd, Dp, Hh, deep) {
    const root = new T.Group(); const tray = M(0x2f6fd0, { roughness: .45 }), wire = M(0xe8edf2, { metalness: .6, roughness: .3 });
    const TH = deep ? .42 : .16;
    root.add(mesh(BOX, tray, 0, TH / 2, 0, Wd, TH, Dp));
    const bed = M(0xfff4dc, { roughness: 1 }); root.add(mesh(BOX, bed, 0, TH + .005, 0, Wd - .06, .02, Dp - .06));
    for (let i = 0; i < (deep ? 40 : 18); i++) { const a = i * 2.39, r = (i * 37 % 100) / 100; const s = sph(bed, (r - .5) * (Wd - .2), TH + .02, Math.sin(a) * (Dp / 2 - .1), .07, .03, .05); s.rotation.y = a; root.add(s); }
    const bars = new T.Group(); root.add(bars); const n = Math.round(Wd / .09);
    for (let i = 0; i <= n; i++) { const x = -Wd / 2 + i * Wd / n; const b = mesh(CYL, wire, x, TH + Hh / 2, -Dp / 2 + .01, .007, Hh, .007); b.castShadow = false; bars.add(b); }
    for (const s of [-1, 1]) for (let i = 0; i <= Math.round(Dp / .09); i++) { const z = -Dp / 2 + i * Dp / Math.round(Dp / .09); const b = mesh(CYL, wire, s * (Wd / 2 - .01), TH + Hh / 2, z, .007, Hh, .007); b.castShadow = false; bars.add(b); }
    for (const y of [TH + Hh]) { const r1 = mesh(BOX, wire, 0, y, -Dp / 2, Wd, .02, .02); bars.add(r1); for (const s of [-1, 1]) bars.add(mesh(BOX, wire, s * Wd / 2, y, 0, .02, .02, Dp)); bars.add(mesh(BOX, wire, 0, y, Dp / 2, Wd, .02, .02)); }
    for (let i = 0; i <= n; i += 2) { const x = -Wd / 2 + i * Wd / n; const b = mesh(CYL, wire, x, TH + Hh, 0, .006, Dp, .006); b.rotation.x = PI / 2; b.castShadow = false; bars.add(b); }
    // Häuschen (Holz, rundes Loch) in der Ecke
    const house = new T.Group(); house.position.set(-Wd / 2 + .3, TH, -Dp / 2 + .28); root.add(house); const wd = M(0xc99a63, { roughness: .7 });
    house.add(mesh(BOX, wd, 0, .14, 0, .36, .28, .32)); const roof = mesh(BOX, M(0xa8743f, { roughness: .7 }), 0, .3, 0, .42, .04, .38); roof.rotation.z = .12; house.add(roof);
    const hole = mesh(new T.CircleGeometry(.08, 24), M(0x2a1a10), .181, .11, 0); hole.rotation.y = PI / 2; house.add(hole);
    return { root, floor: TH + .02, Wd, Dp };
  }
  // ---------- Laufrad (geschlossen) ----------
  function makeWheel(col) {
    const root = new T.Group(), spin = new T.Group(); spin.position.set(0, .62, 0); root.add(spin);
    const wcol = M(col, { roughness: .4 }), wcolD = M(new T.Color(col).multiplyScalar(.75).getHex(), { roughness: .45 });
    const back = mesh(new T.CylinderGeometry(.55, .55, .03, 48), wcolD, 0, 0, -.24); back.rotation.x = PI / 2; spin.add(back);
    const run = new T.Mesh(new T.CylinderGeometry(.55, .55, .46, 48, 1, true), new T.MeshStandardMaterial({ color: new T.Color(col).convertSRGBToLinear(), roughness: .5, side: T.DoubleSide })); run.rotation.x = PI / 2; run.receiveShadow = true; spin.add(run);
    spin.add(mesh(new T.TorusGeometry(.55, .025, 10, 48), wcol, 0, 0, .23));
    for (let i = 0; i < 6; i++) { const s = mesh(BOX, M(0xffffff, { roughness: .4 }), 0, 0, -.22, .9, .04, .01); s.rotation.z = i / 6 * PI; spin.add(s); }
    root.add(mesh(BOX, wcolD, 0, .32, -.3, .1, .64, .06)); root.add(mesh(BOX, wcolD, 0, .02, -.15, .6, .04, .5));
    return { root, spin };
  }
  // ---------- Hamster-Villa: zwei Etagen, Leiter, zwei Laufräder ----------
  const VW = 2.0, VD = 1.0, F1 = .17, F2 = .95, VS = .55;
  function makeVilla() {
    const root = new T.Group(); const c = makeCage(VW, VD, 1.55, false); root.add(c.root);
    const wd = M(0xd9a86c, { roughness: .6 }); root.add(mesh(BOX, wd, 0, F2 - .025, 0, VW - .04, .05, VD - .04));
    root.add(mesh(BOX, M(0xb7864f, { roughness: .6 }), 0, F2 - .025, VD / 2 - .03, VW - .04, .06, .03));
    const lad = new T.Group(); lad.position.set(.75, F1, .3); root.add(lad); const lm = M(0xff9f43, { roughness: .5 });
    for (const s of [-1, 1]) { const r = mesh(BOX, lm, s * .09, (F2 - F1) / 2, 0, .03, F2 - F1 + .05, .03); r.rotation.z = -.0; lad.add(r); }
    for (let i = 1; i < 6; i++) lad.add(mesh(BOX, lm, 0, i * (F2 - F1) / 6, 0, .2, .025, .025));
    // Gold-Krone auf dem Dach (Villa!)
    const crown = new T.Group(); crown.position.set(0, F1 + 1.55 + .02, 0); root.add(crown); const gold = M(0xffc83d, { metalness: .7, roughness: .3 });
    crown.add(mesh(new T.CylinderGeometry(.22, .22, .1, 24, 1, true), gold, 0, .05, 0)); for (let i = 0; i < 5; i++) { const a = i / 5 * 2 * PI; crown.add(mesh(new T.ConeGeometry(.045, .12, 12), gold, Math.cos(a) * .2, .15, Math.sin(a) * .2)); }
    const w1 = makeWheel(0x36b37e), w2 = makeWheel(0xff5d8f); w1.root.scale.setScalar(VS); w2.root.scale.setScalar(VS);
    w1.root.position.set(-.45, F1, -.1); w2.root.position.set(.25, F2, -.1); root.add(w1.root); root.add(w2.root);
    return { root, w1, w2 };
  }
  // ---------- Geschenkkarton ----------
  function makeGift() { const root = new T.Group(); const box = M(0x7a5cff, { roughness: .5 }), rib = M(0xffd23f, { roughness: .4 });
    const S = .42; root.add(mesh(BOX, box, 0, .18, 0, S, .36, S)); root.add(mesh(BOX, rib, 0, .18, 0, S + .01, .36, .06)); root.add(mesh(BOX, rib, 0, .18, 0, .06, .36, S + .01));
    const lid = new T.Group(); lid.position.set(-S / 2, .36, 0); root.add(lid); const lg = new T.Group(); lg.position.x = S / 2; lid.add(lg);
    lg.add(mesh(BOX, box, 0, .03, 0, S + .04, .06, S + .04)); lg.add(mesh(BOX, rib, 0, .035, 0, S + .05, .06, .06));
    for (const s of [-1, 1]) { const l = sph(rib, s * .07, .1, 0, .08, .05, .035); l.rotation.z = -s * .5; lg.add(l); }
    return { root, lid }; }
  // ---------- Raufwolke (Staubkugeln + fliegende Einstreu + Sterne) ----------
  function makeCloud() { const root = new T.Group(); const puffs = [], bits = [];
    const m1 = M(0xf4efe6, { roughness: 1 }), m2 = M(0xd9d2c6, { roughness: 1 });
    for (let i = 0; i < 14; i++) { const s = sph(i % 3 ? m1 : m2, 0, 0, 0, .14); s.castShadow = false; root.add(s); puffs.push(s); }
    const bm = M(0xfff4dc, { roughness: 1 }); for (let i = 0; i < 10; i++) { const s = sph(bm, 0, 0, 0, .04, .015, .03); s.castShadow = false; root.add(s); bits.push(s); }
    const legs = []; const pk = M(0xffa3b1, { roughness: .5 }), fur = M(0xe9a25a, { roughness: .8 }), furG = M(0x9a8f88, { roughness: .8 });
    for (let i = 0; i < 6; i++) { const l = limb(.03, .12, pk); root.add(l); legs.push(l); }
    const tufts = []; for (let i = 0; i < 4; i++) { const s = sph(i % 2 ? fur : furG, 0, 0, 0, .09, .07, .07); root.add(s); tufts.push(s); }
    const stars = []; const st = new T.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? .4 : 1, a = i / 10 * 2 * PI - PI / 2; i ? st.lineTo(Math.cos(a) * r, Math.sin(a) * r) : st.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    const sg = new T.ExtrudeGeometry(st, { depth: .3, bevelEnabled: false }); sg.center();
    for (let i = 0; i < 3; i++) { const m = mesh(sg, M(0xffd23f, { emissive: 0x8a6a00, roughness: .3 })); m.scale.setScalar(.05); m.castShadow = false; root.add(m); stars.push(m); }
    return { root, puffs, bits, legs, tufts, stars, set(t, S) { S = S || 1;
      puffs.forEach((p, i) => { const a = i * 2.4 + t * 9, r = .17 + .06 * Math.sin(t * 13 + i); p.position.set(Math.cos(a) * r * S, (.22 + Math.sin(i * 1.7 + t * 11) * .1) * S, Math.sin(a) * r * .7 * S); p.scale.setScalar((.13 + .04 * Math.sin(t * 17 + i * 2)) * S); });
      bits.forEach((b, i) => { const ph = (t * 1.6 + i / 10) % 1, a = i * 1.9; b.position.set(Math.cos(a) * (.25 + ph * .4) * S, (.15 + Math.sin(ph * PI) * .45) * S, Math.sin(a) * (.2 + ph * .3) * S); b.rotation.set(t * 8 + i, t * 5, 0); });
      legs.forEach((l, i) => { const a = i * 1.05 + t * 7; l.position.set(Math.cos(a) * .25 * S, (.22 + Math.sin(a * 1.3) * .08) * S, Math.sin(a) * .2 * S); l.rotation.set(Math.sin(a) * 1.3, 0, Math.cos(a) * 1.6 + PI / 2); l.scale.setScalar(S); });
      tufts.forEach((s, i) => { const a = i * 1.57 - t * 8; s.position.set(Math.cos(a) * .3 * S, (.25 + Math.cos(a * 2) * .07) * S, Math.sin(a) * .22 * S); s.scale.set(.09 * S, .07 * S, .07 * S); });
      stars.forEach((s, i) => { const a = t * 4 + i * 2.1; s.position.set(Math.cos(a) * .3 * S, (.55 + Math.sin(a * 2) * .04) * S, Math.sin(a) * .25 * S); s.rotation.set(0, a, 0); s.scale.setScalar(.05 * S); }); } };
  }
  // ---------- Torte (zwei Stockwerke, Kerzen) + Konfetti ----------
  function makeCake() { const root = new T.Group(); const sponge = M(0xffe0b3, { roughness: .7 }), icing = M(0xff9fc8, { roughness: .4 }), cream = M(0xffffff, { roughness: .6 });
    root.add(mesh(new T.CylinderGeometry(.36, .36, .22, 40), sponge, 0, .11, 0)); root.add(mesh(new T.CylinderGeometry(.37, .37, .05, 40), icing, 0, .23, 0));
    root.add(mesh(new T.CylinderGeometry(.24, .24, .18, 40), sponge, 0, .34, 0)); root.add(mesh(new T.CylinderGeometry(.25, .25, .05, 40), icing, 0, .44, 0));
    for (let i = 0; i < 12; i++) { const a = i / 12 * 2 * PI; root.add(sph(cream, Math.cos(a) * .33, .26, Math.sin(a) * .33, .04)); }
    root.add(sph(M(0xe5484d, { roughness: .3 }), 0, .51, 0, .05));
    const flames = []; for (const [x, z] of [[-.12, .05], [.12, .05], [0, -.12]]) { root.add(mesh(CYL, M(0x7ac8ff, { roughness: .4 }), x, .52, z, .015, .12, .015));
      const f = sph(M(0xffb000, { emissive: 0xff8a00, emissiveIntensity: 1.2 }), x, .61, z, .022, .04, .022); f.castShadow = false; root.add(f); flames.push(f); }
    const crumbs = []; for (let i = 0; i < 12; i++) { const c = sph(i % 2 ? sponge : icing, 0, 0, 0, .035); c.castShadow = false; c.visible = false; root.add(c); crumbs.push(c); }
    return { root, flames, crumbs }; }
  function confetti(t, n, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const cols = ["#ff5d8f", "#ffd23f", "#36b37e", "#4fb3ff", "#ff9f43"];
    for (let i = 0; i < n; i++) { const x = (i * 137.5 % 830) + 60, y = ((t * (120 + i % 5 * 30) + i * 97) % 1100) + 180; g.globalAlpha = (a ?? 1) * .9; g.fillStyle = cols[i % 5];
      g.save(); g.translate(x, y); g.rotate(t * 3 + i); g.fillRect(-9, -5, 18, 10); g.restore(); } g.restore(); }
  // ---------- Sonnenblumenkern ----------
  function makeSeed() { const root = new T.Group(); const s = sph(M(0x2b2b33, { roughness: .5 }), 0, 0, 0, .06, .025, .035); root.add(s);
    for (const z of [-.012, .012]) root.add(sph(M(0xf2f2f2, { roughness: .6 }), 0, .004, z, .055, .022, .006)); return { root }; }

  // ---------- Bau-Querschnitt (Erde mit 3 getrennten Bauen, je ein schlafender Hamster) ----------
  const SW = 3.0, SH = 1.7, CH = [[-.95, .62], [.05, .38], [1.0, .75]]; // Kammer-Mitten (x, y) in Welt
  function makeSoil() { const root = new T.Group(); const TW = 1024, TH = Math.round(1024 * SH / SW);
    const tex = canvasTex(TW, TH, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#9a6a3e"); gr.addColorStop(1, "#5e3c22"); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.fillStyle = "rgba(255,230,190,.12)"; for (let i = 0; i < 160; i++) { c.beginPath(); c.arc((i * 211) % w, (i * 97) % h, 3 + i % 5, 0, 2 * PI); c.fill(); }
      const X = (x) => (x / SW + .5) * w, Y = (y) => (1 - y / SH) * h; c.lineCap = "round"; c.lineJoin = "round";
      const tun = (pts, wd) => { c.strokeStyle = "#2e1b10"; c.lineWidth = wd; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y))); c.stroke(); };
      CH.forEach(([cx, cy], i) => { tun([[cx - .25 + i * .15, SH], [cx - .1 + i * .1, SH - .3], [cx - .3, cy + .35], [cx, cy]], 30); tun([[cx, cy], [cx + .35, cy - .12], [cx + .4, cy - .3]], 22);
        c.fillStyle = "#2e1b10"; c.beginPath(); c.ellipse(X(cx), Y(cy), .3 / SW * w, .17 / SH * h, 0, 0, 2 * PI); c.fill();
        c.beginPath(); c.ellipse(X(cx + .42), Y(cy - .32), .12 / SW * w, .08 / SH * h, 0, 0, 2 * PI); c.fill();
        c.fillStyle = "#e9c46a"; for (let k = 0; k < 7; k++) { c.beginPath(); c.ellipse(X(cx + .38 + (k % 4) * .03), Y(cy - .34 + Math.floor(k / 4) * .03), 6, 4, k, 0, 2 * PI); c.fill(); } // Vorrat
        c.fillStyle = "#f3e2c0"; c.beginPath(); c.ellipse(X(cx), Y(cy - .1), .24 / SW * w, .05 / SH * h, 0, 0, 2 * PI); c.fill(); }); // Nest
    });
    root.add(mesh(BOX, M(0x6e4628, { roughness: 1 }), 0, SH / 2, -.31, SW, SH, .6));
    const face = new T.Mesh(new T.PlaneGeometry(SW, SH), new T.MeshStandardMaterial({ map: tex, roughness: 1 })); face.position.set(0, SH / 2, .0); face.receiveShadow = true; root.add(face);
    const grass = M(0x4fae4a, { roughness: .9 }); root.add(mesh(BOX, grass, 0, SH + .04, -.3, SW + .04, .08, .64));
    for (let i = 0; i < 30; i++) { const x = -SW / 2 + .05 + i * (SW - .1) / 29; const b = mesh(new T.ConeGeometry(.03, .14 + (i % 3) * .04, 6), M(i % 2 ? 0x3f9a3c : 0x5cc057), x, SH + .12, -.05 - (i % 4) * .15); root.add(b); }
    return { root }; }
  // ---------- Tunnel (Erdröhre, wächst segmentweise) ----------
  const TN = 14, TL = .21;
  function makeTunnel() { const root = new T.Group(); const segs = []; const dirtD = M(0x5a3820, { roughness: 1 });
    for (let i = 0; i < TN; i++) { const s = new T.Group(); s.position.x = i * TL; root.add(s);
      s.add(mesh(BOX, dirtD, 0, .01, 0, TL + .005, .02, .62));
      s.add(mesh(BOX, M(i % 2 ? 0x7a4e2c : 0x6a4224, { roughness: 1 }), 0, .3, -.32, TL + .005, .6, .06));
      const arch = mesh(new T.TorusGeometry(.32, .045, 8, 24, PI), M(0x8a5a33, { roughness: 1 }), 0, .02, 0); arch.rotation.y = PI / 2; s.add(arch); segs.push(s); }
    return { root, segs }; }
  K3.onBuild(() => {
    rudi = K3.rudi; ham = actor(makeHamster(0xe9a25a, 0xc9803c), "Hamster"); bud = actor(makeHamster(0x9a8f88, 0x7a6f6a), "Buddy"); ham3 = actor(makeHamster(0xe9a25a, 0xc9803c), "Hamster 3"); ham4 = actor(makeHamster(0xdf9550, 0xbd7535), "Hamster 4");
    cage = actor(makeCage(1.8, 1.0, .85, false), "Kaefig"); villa = actor(makeVilla(), "Villa"); gift = actor(makeGift(), "Geschenk"); cloud = actor(makeCloud(), "Raufwolke");
    cake = actor(makeCake(), "Torte"); bedCage = actor(makeCage(2.4, 1.1, .85, true), "Kaefig tief"); soil = actor(makeSoil(), "Erde"); tunnel = actor(makeTunnel(), "Tunnel"); seed = actor(makeSeed(), "Kern");
    wheelT = actor(makeWheel(0x36b37e), "Laufrad");
    for (const a of [cage, villa, gift, cloud, cake, bedCage, soil, tunnel, seed, wheelT]) a.noCheck = true;
    room = makeRoomW(); roomBg = new T.Color(0xdff0e6).convertSRGBToLinear();
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  // ---------- Wohnzimmer ----------
  function makeRoomW() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(512, 512, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = ["#c8935e", "#bd8752", "#d29d68", "#c28c58"][i % 4]; c.fillRect(0, i * h / 8, w, h / 8); c.fillStyle = "rgba(90,50,20,.35)"; c.fillRect(0, i * h / 8, w, 3); c.fillRect((i * 173) % w, i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(6, 6);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    const wallTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#fbe7c6"; c.fillRect(0, 0, w, h); c.fillStyle = "#f3d9ae"; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h); });
    wallTex.wrapS = wallTex.wrapT = T.RepeatWrapping; wallTex.repeat.set(10, 3);
    r.add(mesh(BOX, new T.MeshStandardMaterial({ map: wallTex, roughness: .9 }), 0, 2.5, -3, 30, 5, .2));
    r.add(mesh(BOX, M(0xffffff), 0, .08, -2.88, 30, .16, .06));
    const sky = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(1, "#cdeeff"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    const win = new T.Mesh(new T.PlaneGeometry(1.6, 1.4), new T.MeshStandardMaterial({ map: sky, emissive: 0xffffff, emissiveMap: sky, emissiveIntensity: .5 })); win.position.set(-2.4, 2.3, -2.89); r.add(win);
    const fr = M(0xffffff, { roughness: .5 }); for (const [x, y, sx, sy] of [[-2.4, 3.03, 1.75, .08], [-2.4, 1.57, 1.75, .08], [-3.24, 2.3, .08, 1.5], [-1.56, 2.3, .08, 1.5], [-2.4, 2.3, .05, 1.4], [-2.4, 2.3, 1.6, .05]]) r.add(mesh(BOX, fr, x, y, -2.87, sx, sy, .06));
    const rug = new T.Mesh(new T.CircleGeometry(1.8, 48), M(0x36b37e, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(.2, .006, -.2); rug.scale.set(1.5, .9, 1); rug.receiveShadow = true; r.add(rug);
    const rug2 = new T.Mesh(new T.RingGeometry(1.45, 1.6, 48), M(0xffd23f, { roughness: 1 })); rug2.rotation.x = -PI / 2; rug2.position.set(.2, .008, -.2); rug2.scale.set(1.5, .9, 1); r.add(rug2);
    const sh = new T.Group(); sh.position.set(2.6, 0, -2.5); r.add(sh); const wd = M(0x8a5a3a, { roughness: .6 });
    sh.add(mesh(BOX, wd, 0, .9, 0, 1.2, 1.8, .4)); for (const y of [.45, .95, 1.45]) sh.add(mesh(BOX, M(0x6e4628), 0, y, .2, 1.1, .04, .05));
    for (let i = 0; i < 6; i++) sh.add(mesh(BOX, M([0xe5484d, 0x2f6fd0, 0xffd23f, 0x36b37e, 0xff9f43, 0x7a5cff][i]), -.4 + i * .15, 1.12, .05, .1, .3, .25));
    const pl = new T.Group(); pl.position.set(-3.2, 0, -2.4); r.add(pl); pl.add(mesh(new T.CylinderGeometry(.25, .18, .45, 24), M(0xe0603c), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const a = i / 7 * 2 * PI; const lf = sph(M(i % 2 ? 0x4fae4a : 0x3f9a3c), Math.cos(a) * .2, .75 + (i % 3) * .1, Math.sin(a) * .2, .1, .35, .05); lf.rotation.set(Math.sin(a) * .5, -a, Math.cos(a) * .5); pl.add(lf); }
    return r;
  }
  function inRoom() { begin("yard"); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xfbe7c6, 16, 40); K3.hemi.intensity = .8; reset(); }
  function studio() { begin("studio"); room.visible = false; reset(); }
  function reset() { ham.noCheck = bud.noCheck = ham3.noCheck = ham4.noCheck = false; rudi.noCheck = false; gift.lid.rotation.z = 0; cake.crumbs.forEach((c) => c.visible = false); }

  const CX = .3, CZ = -.4; // Käfig-Mitte im Zimmer
  // Hook/Loop: Nugget im Käfig, Geschenk geht auf, grauer Buddy guckt raus, Nugget erschrickt
  function hookFrame(lt, d, t, loop) { const ph = lt / d;
    place(cage, CX, CZ, 0); const F = cage.floor; place(gift, CX + .42, CZ + .05, -.2);
    const open = loop ? 0 : sm(clamp((ph - .05) / .25, 0, 1));
    gift.root.position.y = F - .02; gift.lid.rotation.z = open * 1.9; gift.root.rotation.z = loop ? Math.sin(t * 14) * .04 * sm(ph) : 0;
    at(bud, CX + .42, F - .02 + lerp(-.25, .14, open), CZ + .05, PI - .2, t, { sc: .9, look: Math.sin(t * 3) * .15, up: .1 });
    bud.root.visible = open > .05;
    const shock = clamp((open - .5) * 3, 0, 1);
    at(ham, CX - .42, F, CZ + .05, 0, t, { sc: 1, lean: shock * .18, puff: shock * .6, angry: shock > .5, up: shock * .1 });
    return open;
  }
  // ---------- Shots ----------
  KZ.shot("fHook", (lt, d, t) => { inRoom(); const k = sm(lt / d); const open = hookFrame(lt, d, t, false); bud.noCheck = ham.noCheck = true;
    frameOn([FR(CX - .75, cage.floor, CZ - .2, CX + .7, cage.floor + .62, CZ + .3)], { az: lerp(.38, .3, k), el: .2, fill: lerp(1.02, 1.1, k), t }); draw();
    stamp(open > .6 ? "A FRIEND?!" : "SURPRISE!", W * .42, H * .34, open > .6 ? (lt - d * .32) / .25 : (lt - .15) / .25, open > .6 ? "#e5484d" : "#7a5cff", open > .6 ? .07 : -.06); });

  KZ.shot("fLonely", (lt, d, t) => { inRoom(); const ph = lt / d, half = ph > .45; place(cage, CX, CZ, 0); const F = cage.floor;
    place(rudi, CX - 1.55, CZ + .25, .35);
    if (!half) { const k = sm(ph / .45);
      at(ham, CX + .1, F, CZ + .05, -.5, t, { sc: 1, look: Math.sin(t * 1.5) * .3 });
      poseRudi(rudi, t, { arms: [.2, .3], spread: .1, mouth: "o", tilt: .1, nod: -.08 });
      frameOn([rudi, cage], { az: lerp(.5, .44, k), el: .16, fill: lerp(.95, 1.0, k), t }); draw();
      stamp("SO LONELY!", W * .42, H * .17, (lt - .25) / .3, "#2f6fd0", -.06); }
    else { const k = sm((ph - .45) / .55), open = sm(clamp((ph - .55) / .2, 0, 1));
      place(gift, CX + .45, CZ + .1, -.3); gift.root.position.y = F - .02; gift.lid.rotation.z = open * 1.9;
      at(bud, CX + .45, F - .02 + lerp(-.25, .08, open), CZ + .1, PI - .3, t, { sc: .9, up: .1, look: Math.sin(t * 4) * .2 }); bud.root.visible = open > .05; bud.noCheck = true;
      at(ham, CX - .35, F, CZ + .05, -.2, t, { sc: 1, up: .1 });
      poseRudi(rudi, t, { arms: [1.2, 1.2], spread: .6, mouth: "smile", wave: true });
      frameOn([rudi, cage], { az: lerp(.44, .38, k), el: .16, fill: lerp(1.0, 1.05, k), t }); draw();
      stamp("BUDDY!", W * .42, H * .17, (ph - .62) * d / .25, "#ff5d8f", .06); } });

  KZ.shot("fFight", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph); place(cage, CX, CZ, 0); const F = cage.floor;
    place(cloud, CX, CZ + .05, 0); cloud.root.position.y = F; cloud.set(t, 1.3);
    at(ham, CX - .12, F + .05 + Math.abs(Math.sin(t * 9)) * .12, CZ + .2, Math.sin(t * 7) * 1.2, t, { sc: .85, angry: true, puff: .4, run: 1 }); ham.root.rotation.z = Math.sin(t * 11) * .5;
    at(bud, CX + .14, F + .05 + Math.abs(Math.cos(t * 9)) * .12, CZ + .15, PI + Math.cos(t * 7) * 1.2, t, { sc: .8, angry: true, run: 1 }); bud.root.rotation.z = Math.cos(t * 11) * .5;
    ham.noCheck = bud.noCheck = true;
    frameOn([FR(CX - .55, F, CZ - .3, CX + .55, F + .75, CZ + .45)], { az: lerp(.25, .15, k), el: .18, fill: lerp(1.05, 1.2, k), t }); draw();
    stamp("FIGHT!", W * .42, H * .17, (lt - .2) / .25, "#e5484d", -.07); });

  KZ.shot("fMansion", (lt, d, t) => { inRoom(); const ph = lt / d, half = ph > .5; place(villa, CX, CZ - .1, 0); const VX = CX, VZ = CZ - .1;
    villa.w2.spin.rotation.z = -t * (half ? 2.5 : 1); villa.w1.spin.rotation.z = half ? -t * 9 : -t * 1;
    if (!half) { const k = sm(ph / .5), rise = easeBack(clamp(ph / .18, 0, 1)); villa.root.scale.set(1, Math.max(.001, rise), 1);
      place(rudi, VX - 1.7, VZ + .45, .35); poseRudi(rudi, t, { arms: [1.3, 1.3], spread: .7, mouth: "smile" });
      const pop = easeBack(clamp((ph - .2) / .08, 0, 1));
      at(ham, VX - .2, F2, VZ + .2, -.4, t, { sc: .8 * Math.max(.001, pop) }); ham.root.visible = pop > 0;
      at(bud, VX + .1, F1, VZ + .25, PI - .4, t, { sc: .75 * Math.max(.001, pop) }); bud.root.visible = pop > 0;
      frameOn([rudi, villa], { az: lerp(.45, .38, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw();
      stamp("MANSION!", W * .42, H * .15, (lt - .25) / .3, "#ffb000", -.06); }
    else { const k = sm((ph - .5) / .5); villa.root.scale.set(1, 1, 1); rudi.root.visible = false;
      place(cloud, VX - .45, VZ + .05, 0); cloud.root.position.y = F1; cloud.set(t, 1.15);
      at(ham, VX - .55, F1 + .05 + Math.abs(Math.sin(t * 9)) * .1, VZ + .3, Math.sin(t * 7), t, { sc: .7, angry: true, run: 1 }); ham.root.rotation.z = Math.sin(t * 11) * .5;
      at(bud, VX - .3, F1 + .05 + Math.abs(Math.cos(t * 9)) * .1, VZ + .25, PI + Math.cos(t * 7), t, { sc: .68, angry: true, run: 1 }); bud.root.rotation.z = Math.cos(t * 11) * .5;
      ham.noCheck = bud.noCheck = true;
      frameOn([villa], { az: lerp(.3, .22, k), el: .12, fill: lerp(.95, 1.02, k), t }); draw();
      stamp("SAME WHEEL", W * .42, H * .15, (ph - .55) * d / .25, "#e5484d", .06); } });

  const PX = .3, PZ = -.2; // Party-Platz
  KZ.shot("fParty", (lt, d, t) => { inRoom(); const ph = lt / d, half = ph > .5; place(cake, PX, PZ, 0);
    cake.flames.forEach((f, i) => f.scale.set(.022, .04 * (1 + Math.sin(t * 20 + i) * .15), .022));
    if (!half) { const k = sm(ph / .5);
      place(rudi, PX - .55, PZ - .85, -.2); poseRudi(rudi, t, { arms: [2.4 + Math.sin(t * 8) * .2, 2.4 + Math.cos(t * 8) * .2], spread: .5, mouth: "smile" });
      at(ham, PX - .7, 0, PZ + .45, -.6, t, { sc: 1, hat: true, look: .3 });
      at(bud, PX + .7, 0, PZ + .45, PI + .6, t, { sc: .95, hat: true, look: -.3, lid: .45 });
      frameOn([rudi, cake, ham, bud], { az: lerp(.2, .14, k), el: .2, fill: lerp(.95, 1.02, k), t }); draw();
      confetti(t, 40, 1); stamp("PARTY!", W * .42, H * .15, (lt - .2) / .3, "#ff5d8f", -.06); }
    else { const k = sm((ph - .5) / .5); rudi.root.visible = false;
      place(cloud, PX, PZ + .05, 0); cloud.root.position.y = .3; cloud.set(t, 1.6);
      cake.crumbs.forEach((c, i) => { const q = ((t * 1.3 + i / 12) % 1), a = i * 2.1; c.visible = true; c.position.set(Math.cos(a) * (.3 + q * .6), .45 + Math.sin(q * PI) * .7, Math.sin(a) * (.3 + q * .5)); });
      at(ham, PX - .2, .3 + Math.abs(Math.sin(t * 9)) * .15, PZ + .3, Math.sin(t * 7) * 1.2, t, { sc: .9, angry: true, hat: true, run: 1, puff: .6 }); ham.root.rotation.z = Math.sin(t * 11) * .5;
      at(bud, PX + .2, .3 + Math.abs(Math.cos(t * 9)) * .15, PZ + .25, PI + Math.cos(t * 7) * 1.2, t, { sc: .85, angry: true, hat: true, run: 1 }); bud.root.rotation.z = Math.cos(t * 11) * .5;
      ham.noCheck = bud.noCheck = true;
      frameOn([cake, FR(PX - .6, 0, PZ - .4, PX + .6, 1.1, PZ + .5)], { az: lerp(.3, .2, k), el: .2, fill: lerp(1.0, 1.1, k), t }); draw();
      stamp("CAKE FIGHT!", W * .42, H * .15, (ph - .55) * d / .25, "#e5484d", .06); } });

  // 5 Studio: Nugget allein auf dem Sockel, stopft zufrieden Backen voll
  KZ.shot("fLoner", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    const eat = clamp((ph - .2) / .6, 0, 1); place(seed, .55, .1, 0); seed.root.position.y = .03; seed.root.visible = eat < .5; seed.root.rotation.y = t;
    at(ham, -.1, 0, 0, -.45, t, { sc: 2.0, puff: sm(eat) * 1.0, nod: eat > .3 && eat < .6 ? -.25 : 0, lid: eat > .7 ? .5 : undefined });
    frameOn([ham], { az: lerp(.45, .3, k), el: .16, fill: lerp(.88, .95, k), t }); draw();
    stamp("LONER", W * .42, H * .17, (lt - .2) / .3, "#7a5cff", -.06);
    if (ph > .62) stamp("ME TIME", W * .42, H * .27, (ph - .62) * d / .25, "#36b37e", .06); });

  // 6 Studio: Querschnitt durch drei wilde Baue, in jedem nur ein Hamster
  KZ.shot("fBurrow", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph); place(soil, 0, -.1, 0);
    const hs = [ham, ham4, ham3]; hs.forEach((h, i) => { const [cx, cy] = CH[i]; at(h, cx - .05, cy - .17 + .02, .12, i % 2 ? PI - .3 : .3, t + i, { sc: .62, lid: 1, nod: -.15 }); h.body.position.y += Math.sin(t * 2.5 + i) * .006; h.root.position.z = .12; h.noCheck = true; });
    frameOn([soil], { az: lerp(.12, .04, k), el: lerp(.1, .06, k), fill: lerp(.88, .95, k), dy: -.05, t }); draw();
    hs.forEach((h, i) => { const p = clamp((ph - .3 - i * .14) / .12, 0, 1); if (p <= 0) return; const [x, y] = scr(new T.Vector3(CH[i][0], CH[i][1] + .38, .15));
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const kk = easeBack(p); g.translate(x, y); g.scale(kk, kk); g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(0, 0, 52, 0, 2 * PI); g.fill();
      g.fillStyle = "#1d2250"; g.font = '900 66px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("1", 0, 4); g.restore(); });
    stamp("WILD BURROWS", W * .42, H * .15, (lt - .15) / .3, "#ff9f43", -.06);
    if (ph > .78) stamp("ONE EACH", W * .42, H * .25, (ph - .78) * d / .25, "#36b37e", .06); });

  // 7 Studio: Tunnel wächst, Hamster rennt hindurch, Zähler bis 9 M
  KZ.shot("fTunnel", (lt, d, t) => { studio(); const ph = lt / d, grow = sm(clamp(ph / .75, 0, 1)), nS = Math.max(3, Math.ceil(grow * TN));
    const X0 = -TN * TL / 2 + TL / 2; place(tunnel, X0, 0, 0); tunnel.segs.forEach((s, i) => { s.visible = i < nS; const p = i < 3 ? 1 : clamp(grow * TN - i, 0, 1); s.scale.set(1, Math.max(.001, easeBack(p)), 1); });
    const hx = X0 + Math.max(.1, Math.max(3, grow * TN) * TL - .35);
    at(ham, hx, .02, .02, 0, t, { sc: .8, run: 1 });
    const x1 = X0 + nS * TL; frameOn([FR(Math.max(X0 - .1, x1 - 1.9), 0, -.3, x1 + .2, .65, .3), ham], { az: .22, el: .12, fill: .95, t }); draw();
    const n = grow * 9; txt(n.toFixed(1) + " M", W * .42, H * .19, 160, "#ffd23f", { stroke: 14, w: 900 });
    txt("OF TUNNELS", W * .42, H * .27, 58, "#ffffff", { stroke: 10, a: clamp(lt / .3, 0, 1) });
    if (ph > .8) stamp("FOR ONE!", W * .42, H * .35, (ph - .8) * d / .25, "#ff5d8f", -.06); });

  // 8 Zimmer: Nugget allein im Käfig, zufrieden im Laufrad, RSPCA-Karte mit echtem Zitat
  KZ.shot("fSource", (lt, d, t) => { inRoom(); const k = sm(lt / d); place(cage, CX, CZ, 0); const F = cage.floor;
    place(wheelT, CX + .35, CZ - .1, 0); wheelT.root.position.y = F; wheelT.root.scale.setScalar(.55); wheelT.spin.rotation.z = -t * 6;
    at(ham, CX + .35, F + .045, CZ - .1, 0, t, { sc: .7, run: 1 });
    frameOn([cage], { az: lerp(.32, .24, k), el: .2, fill: lerp(.95, 1.02, k), dy: .15, t }); draw();
    const cp = sm((lt - .15) / .3); if (card(W * .42, H * .25, 900, 290, cp, "RSPCA", "#2f6fd0")) { const a = clamp(cp, 0, 1);
      txt("“Syrian and Chinese hamsters", W * .42, H * .25 - 5, 40, "#1d2250", { a });
      txt("aren't naturally sociable and", W * .42, H * .25 + 47, 40, "#1d2250", { a });
      txt("should always live on their own”", W * .42, H * .25 + 99, 40, "#1d2250", { a }); } });

  // 9 Pointe: Rudi allein mit Partyhut-Resten und Torte, kratzt sich am Kopf
  KZ.shot("fOverkill", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph); place(cake, PX + .45, PZ, 0);
    cake.flames.forEach((f, i) => f.scale.set(.022, .04 * (1 + Math.sin(t * 20 + i) * .15), .022));
    place(rudi, PX - .5, PZ - .3, -.5); poseRudi(rudi, t, { arms: [2.75, .2], spread: .1, mouth: "o", tilt: -.12 });
    frameOn([rudi, cake], { az: lerp(.42, .34, k), el: .14, fill: lerp(.9, .97, k), t }); draw();
    confetti(t * .3, 14, .6);
    if (ph > .3) stamp("OVERKILL", W * .42, H * .15, (ph - .3) * d / .3, "#7a5cff", .06); });

  // 10 Tipp: großer Käfig mit tiefer Einstreu, Hamster gräbt; Schnitt: Rudi reicht einen Kern, Hamster schnuppert
  const BX = .2, BZ = -.4;
  KZ.shot("fTip", (lt, d, t) => { inRoom(); const ph = lt / d, half = ph > .55; place(bedCage, BX, BZ, 0); const F = bedCage.floor;
    if (!half) { const k = sm(ph / .55);
      at(ham, BX + .1, F - .07 + Math.sin(t * 3) * .01, BZ + .15, -.9, t, { sc: 1.15, dig: true, nod: -.12, lean: -.12, puff: .2 });
      frameOn([bedCage], { az: lerp(.3, .22, k), el: .22, fill: lerp(.92, 1.0, k), dy: -.05, t }); draw();
      // Einstreu fliegt
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const [hx, hy] = scr(new T.Vector3(BX - .1, F, BZ + .1)); g.fillStyle = "#fff4dc";
      for (let i = 0; i < 10; i++) { const q = (t * 2 + i / 10) % 1; g.globalAlpha = 1 - q; g.beginPath(); g.ellipse(hx - q * (60 + i * 9), hy - Math.sin(q * PI) * (90 + i * 8), 12, 7, i, 0, 2 * PI); g.fill(); } g.restore();
      stamp(ph < .25 ? "BIG CAGE" : "DEEP BEDDING", W * .42, H * .15, ph < .25 ? (lt - .15) / .25 : (ph - .25) * d / .25, "#36b37e", -.06); }
    else { const k = sm((ph - .55) / .45);
      place(rudi, BX - 1.95, BZ + .55, .4); poseRudi(rudi, t, { arms: [.2, 1.25], spread: .1, mouth: "smile", lean: -.08 });
      at(ham, BX - .6, F, BZ + .3, PI - .25, t, { sc: 1, up: .25, look: Math.sin(t * 6) * .1, puff: .2 });
      frameOn([rudi, bedCage], { az: lerp(.45, .4, k), el: .15, fill: lerp(.95, 1.0, k), t }); draw();
      stamp("YOU!", W * .42, H * .15, (ph - .6) * d / .25, "#ff5d8f", .06); } });

  // 11 Loop: zurück in die Hook-Einstellung (Geschenk steht zu, öffnet sich am Ende)
  KZ.shot("fLoop", (lt, d, t) => { inRoom(); const k = sm(lt / d); hookFrame(lt, d, t, true); bud.noCheck = ham.noCheck = true;
    frameOn([FR(CX - .75, cage.floor, CZ - .2, CX + .7, cage.floor + .62, CZ + .3)], { az: lerp(.3, .38, k), el: .2, fill: lerp(1.1, 1.02, k), t }); draw();
    if (lt > d * .25) stamp("LONELY?", W * .42, H * .34, (lt - d * .25) / .3, "#2f6fd0", -.06); });

  window.__hamsterFriend = true;
})();
