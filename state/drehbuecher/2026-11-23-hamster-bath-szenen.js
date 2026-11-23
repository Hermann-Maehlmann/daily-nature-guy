// 3D-Szene "Why You Should Never Bathe Your Hamster" / "Warum du deinen Hamster nie baden solltest" (23.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Opener-Stil "tatort": Absperrband, Beweis-Aufsteller (Shampoo, Badeente), nasser zitternder Hamster auf dem Handtuch, Rudi als Verdächtiger.
// Goldhamster aus dem Watte-Video (2026-11-22) übernommen, jetzt mit K3.eye/aimEyes (Look v3), nass (dunkler, glänzend, Strähnen, Tropfen),
// zittern und "geföhnt" (Kugel). Neu: Badezimmer, Schaum-Schüssel, Badeente, Erdbeer-Shampoo, Föhn, Sandschale, Staub-Schale.
// Quellen: PetMD (Lauren Jones, VMD): "Water baths can cause stress, remove natural oils, and increase the risk of illness." / "In the wild,
// hamsters roll in sand—not water" / "Use chinchilla sand, not chinchilla dust"; Chewy (vet-reviewed): "Their tiny bodies lose heat quickly,
// so a water bath can cause chilling or hypothermia"; RSPCA: "self-grooming and occasional access to a sand bath".
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let ham, rudi, bath, bowl, duck, bottle, dryer, towel, mk1, mk2, cage, sandDish, dustDish;
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  const QUIZ = () => [L("A  Puddles", "A  Pfützen"), L("B  Sand", "B  Sand"), L("C  Morning dew", "C  Morgentau")];

  // ---------- Syrischer Goldhamster ----------
  function makeHamster(col, colD) {
    const cA = new T.Color(col).convertSRGBToLinear(), cDA = new T.Color(colD).convertSRGBToLinear();
    const fur = M(col, { roughness: .8 }), furD = M(colD, { roughness: .8 }), cream = M(0xfff1dc, { roughness: .85 }), pink = M(0xffa3b1, { roughness: .5 });
    const wh = M(0xffffff, { roughness: .4 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const front = new T.Group(), rear = new T.Group(); front.position.set(0, .2, 0); rear.position.set(0, .2, 0); body.add(front); body.add(rear);
    front.add(sph(fur, .07, 0, 0, .17, .18, .19)); front.add(sph(furD, .02, .07, 0, .12, .09, .13)); front.add(sph(cream, .09, -.06, 0, .14, .11, .16));
    rear.add(sph(fur, -.08, 0, 0, .18, .18, .2)); rear.add(sph(furD, -.06, .07, 0, .13, .1, .13)); rear.add(sph(cream, -.04, -.06, 0, .14, .11, .16));
    rear.add(sph(pink, -.25, -.03, 0, .025, .02, .02));
    const legs = []; for (const [x, s, grp] of [[.13, -1, front], [.13, 1, front], [-.12, -1, rear], [-.12, 1, rear]]) { const l = limb(.028, .07, pink); l.position.set(x, -.125, s * .11); l.add(sph(pink, .015, -.075, 0, .035, .015, .028)); grp.add(l); legs.push(l); }
    const head = new T.Group(); head.position.set(.2, .07, 0); front.add(head);
    head.add(sph(fur, 0, 0, 0, .16, .15, .16));
    const cheeks = []; for (const s of [-1, 1]) { const c = sph(cream, .06, -.05, s * .095, .095, .08, .085); head.add(c); c.base = c.scale.clone(); cheeks.push(c); }
    for (const s of [-1, 1]) head.add(sph(furD, .02, .0, s * .135, .05, .045, .03));
    head.add(sph(cream, .13, -.035, 0, .065, .055, .065));
    head.add(sph(pink, .19, -.01, 0, .022, .018, .024));
    const mouth = mesh(new T.TorusGeometry(.016, .004, 6, 12, PI), M(0x5a2a20), .185, -.055, 0); mouth.rotation.set(0, PI / 2, PI); head.add(mouth);
    const oMouth = sph(M(0x5a1a22), .185, -.06, 0, .012, .02, .018); head.add(oMouth); oMouth.visible = false;
    for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.03, .13, s * .095); e.rotation.x = s * .35; head.add(e);
      e.add(sph(fur, 0, 0, 0, .05, .06, .022)); e.add(sph(pink, .006, 0, 0, .036, .045, .016)); }
    // Augen (Look v3): dunkelbrauner Augapfel, schwarze Pupille, Glanzpunkt; beide gemeinsam ausgerichtet
    const eyeM = M(0x0c0808, { roughness: .08 });
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.1, .045, s * .085); e.rotation.y = -s * .55; head.add(e);
      const ey = K3.eye(.042, { white: M(0x3a2014, { roughness: .15 }), pupil: eyeM }); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, M(0x3a2216, { roughness: .6 }), .12, .1, s * .085, .015, .016, .075); b.castShadow = false; head.add(b); brows.push(b); }
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .17, -.04 + i * .015, s * .09, .003, .13, .003); w.rotation.x = s * (PI / 2 - .25 + i * .2); w.castShadow = false; head.add(w); }
    // Tropfen (Wasser)
    const drops = []; const dm = M(0x8fd3ff, { roughness: .1, metalness: .1 }); for (let i = 0; i < 4; i++) { const d = sph(dm, 0, 0, 0, .018, .028, .018); d.castShadow = false; root.add(d); drops.push(d); }
    // nasse Strähnen auf dem Rücken (kleine Spitzen)
    const spikes = new T.Group(); body.add(spikes); for (let i = 0; i < 9; i++) { const sp = mesh(new T.ConeGeometry(.035, .09, 8), furD, -.22 + i * .05, .38 + Math.sin(i * 1.7) * .015, Math.sin(i * 2.3) * .06); sp.rotation.z = -.5 + i * .12; sp.castShadow = false; spikes.add(sp); }
    spikes.visible = false;
    return { root, body, front, rear, legs, head, eyes, cheeks, brows, mouth, oMouth, drops, spikes, fur, furD, cA, cDA };
  }
  // o: {run, bend, look, up, sc, puff, worry, wet, shiver, poof, o, roll, lookAt}
  function poseHam(Hm, t, o) {
    o = o || {}; const run = o.run || 0, sp = o.speed || 22, wet = o.wet || 0, poof = o.poof || 0, sh = o.shiver || 0;
    Hm.legs.forEach((l, i) => l.rotation.z = Math.sin(t * sp + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .7 * run);
    Hm.body.position.y = Math.abs(Math.sin(t * sp)) * .012 * run + Math.sin(t * 3) * .004;
    Hm.body.position.z = Math.sin(t * 55) * .008 * sh; Hm.body.rotation.x = Math.sin(t * 47) * .04 * sh + (o.roll || 0);
    Hm.front.rotation.z = 0; Hm.rear.rotation.z = 0; Hm.front.position.y = .2; Hm.rear.position.y = .2;
    Hm.head.rotation.set(0, o.look || 0, (o.up || 0) + Math.sin(t * 2.3) * .03);
    Hm.cheeks.forEach((c) => c.scale.copy(c.base).multiplyScalar(1 + (o.puff || 0) * .35));
    Hm.brows.forEach((b, i) => { b.visible = !!o.worry; b.rotation.x = (i ? 1 : -1) * .45; });
    Hm.mouth.visible = !o.o; Hm.oMouth.visible = !!o.o;
    // nass: dunkler + glänzend, dünner; geföhnt: aufgeplustert
    Hm.fur.color.copy(Hm.cA).multiplyScalar(1 - .45 * wet); Hm.furD.color.copy(Hm.cDA).multiplyScalar(1 - .45 * wet);
    Hm.fur.roughness = lerp(.8, .22, wet); Hm.furD.roughness = lerp(.8, .22, wet);
    const thin = 1 - .12 * wet + .55 * poof; Hm.front.scale.set(1 + .2 * poof, thin, thin); Hm.rear.scale.set(1 + .2 * poof, thin, thin);
    Hm.head.scale.setScalar(1 + .22 * poof - .04 * wet);
    Hm.spikes.visible = poof > .3; Hm.spikes.scale.setScalar(.7 + poof * .5);
    Hm.drops.forEach((d, i) => { d.visible = wet > .5; const q = (t * 1.3 + i * .27) % 1; d.position.set(-.2 + i * .13, .42 - q * .4, (i % 2 ? -1 : 1) * .17); });
    Hm.root.scale.setScalar(o.sc || 1);
    if (K3.aimEyes) { Hm.root.updateMatrixWorld(true); K3.aimEyes(Hm.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .5); }
  }
  function at(Hm, x, y, z, ry, t, o) { Hm.root.visible = true; Hm.root.position.set(x, y, z); Hm.root.rotation.set(0, ry || 0, 0); poseHam(Hm, t, o); }

  // ---------- Badezimmer ----------
  function makeBath() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const tile = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#f4f8fb"; c.fillRect(0, 0, w, h); c.fillStyle = "#cfdbe6"; for (let i = 0; i <= 4; i++) { c.fillRect(i * w / 4 - 2, 0, 4, h); c.fillRect(0, i * h / 4 - 2, w, 4); } });
    tile.wrapS = tile.wrapT = T.RepeatWrapping; tile.repeat.set(10, 10);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: tile, roughness: .5 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    const wt = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#7cc7e8"; c.fillRect(0, 0, w, h); c.fillStyle = "#a9dcf1"; for (let i = 0; i <= 4; i++) { c.fillRect(i * w / 4 - 3, 0, 6, h); c.fillRect(0, i * h / 4 - 3, w, 6); } });
    wt.wrapS = wt.wrapT = T.RepeatWrapping; wt.repeat.set(14, 3);
    r.add(mesh(BOX, new T.MeshStandardMaterial({ map: wt, roughness: .45 }), 0, 2.5, -3, 30, 5, .2));
    // Badewanne hinten links
    const tub = new T.Group(); tub.position.set(-2.2, 0, -2.3); r.add(tub); const wm = M(0xffffff, { roughness: .3 });
    tub.add(mesh(BOX, wm, 0, .35, 0, 2.2, .7, .9)); const wtr = mesh(BOX, M(0x6fc6ff, { roughness: .05, metalness: .1 }), 0, .66, 0, 2.0, .04, .72); tub.add(wtr);
    for (let i = 0; i < 14; i++) tub.add(sph(M(0xffffff, { roughness: .9 }), -.8 + (i * .13), .72 + (i % 3) * .03, Math.sin(i * 1.9) * .25, .12 + (i % 3) * .03));
    const tap = mesh(new T.CylinderGeometry(.04, .04, .4, 12), M(0xd6dde4, { metalness: .8, roughness: .2 }), -1.0, .9, -.38); tub.add(tap);
    // Handtuchhalter rechts
    const rail = new T.Group(); rail.position.set(2.4, 0, -2.85); r.add(rail); rail.add(mesh(CYL, M(0xd6dde4, { metalness: .8, roughness: .2 }), 0, 1.5, 0, .025, 1.2, .025)).rotation.z = PI / 2;
    rail.add(mesh(BOX, M(0xff9f43, { roughness: 1 }), 0, 1.15, .03, 1.0, .75, .05)); rail.add(mesh(BOX, M(0xffd23f, { roughness: 1 }), 0, 1.0, .06, 1.0, .08, .02));
    // Badematte
    const mat = new T.Mesh(new T.CircleGeometry(1.4, 40), M(0x36b37e, { roughness: 1 })); mat.rotation.x = -PI / 2; mat.position.set(.2, .006, -.2); mat.scale.set(1.5, .9, 1); mat.receiveShadow = true; r.add(mat);
    return r;
  }
  // ---------- Schaum-Schüssel ----------
  function makeBowl() { const root = new T.Group(); const bm = M(0xffffff, { roughness: .3 }), rim = M(0x2f6fd0, { roughness: .35 });
    const shell = new T.Mesh(new T.CylinderGeometry(.42, .32, .26, 40, 1, true), bm); shell.position.y = .13; shell.material.side = T.DoubleSide; shell.castShadow = true; root.add(shell);
    root.add(mesh(new T.CylinderGeometry(.32, .32, .02, 40), bm, 0, .01, 0));
    const r = mesh(new T.TorusGeometry(.42, .025, 8, 40), rim, 0, .26, 0); r.rotation.x = PI / 2; root.add(r);
    const water = new T.Mesh(new T.CircleGeometry(.4, 40), new T.MeshStandardMaterial({ color: new T.Color(0x7fd0ff).convertSRGBToLinear(), roughness: .05, metalness: .1, transparent: true, opacity: .72 }));
    water.rotation.x = -PI / 2; water.position.y = .2; root.add(water);
    const foam = new T.Group(); root.add(foam); const fm = M(0xffffff, { roughness: .95 }), fp = M(0xffd6e4, { roughness: .95 });
    for (let i = 0; i < 22; i++) { const a = i / 22 * 2 * PI, rr = .3 + (i % 3) * .03; const s = sph(i % 4 ? fm : fp, Math.cos(a) * rr, .22 + (i % 3) * .015, Math.sin(a) * rr, .05 + (i % 3) * .015); s.castShadow = false; foam.add(s); }
    return { root, foam, water }; }
  function makeDuck() { const root = new T.Group(); const y = M(0xffd23f, { roughness: .35 }), o = M(0xff8a1f, { roughness: .4 });
    root.add(sph(y, 0, .06, 0, .1, .07, .075)); root.add(sph(y, .07, .14, 0, .055)); root.add(sph(o, .125, .13, 0, .035, .015, .028)); root.add(sph(y, -.08, .1, 0, .03, .04, .03));
    for (const s of [-1, 1]) { root.add(sph(M(0x111111, { roughness: .1 }), .1, .16, s * .03, .01)); }
    return { root }; }
  function makeBottle() { const root = new T.Group(); const p = M(0xff6f9f, { roughness: .35 });
    const tex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#fff"; c.fillRect(0, 0, w, h); c.fillStyle = "#e5484d"; c.beginPath(); c.moveTo(w / 2, 200); c.bezierCurveTo(30, 120, 70, 40, w / 2, 70); c.bezierCurveTo(186, 40, 226, 120, w / 2, 200); c.fill();
      c.fillStyle = "#ffd23f"; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(90 + (i * 37) % 80, 100 + (i * 23) % 70, 5, 0, 7); c.fill(); } c.fillStyle = "#36b37e"; c.fillRect(w / 2 - 30, 52, 60, 18);
      c.fillStyle = "#7a1f3d"; c.font = '900 34px "Montserrat"'; c.textAlign = "center"; c.fillText(L("STRAWBERRY", "ERDBEERE"), w / 2, 240); });
    root.add(mesh(new T.CylinderGeometry(.13, .14, .5, 28), p, 0, .25, 0));
    const lab = new T.Mesh(new T.CylinderGeometry(.142, .142, .3, 28, 1, true, -PI / 2, PI), new T.MeshStandardMaterial({ map: tex, roughness: .5 })); lab.position.y = .25; lab.rotation.y = PI / 2; root.add(lab);
    root.add(mesh(new T.CylinderGeometry(.06, .1, .1, 20), p, 0, .55, 0)); root.add(mesh(new T.CylinderGeometry(.05, .05, .08, 16), M(0xffffff, { roughness: .4 }), 0, .63, 0));
    return { root }; }
  function makeDryer() { const root = new T.Group(); const b = M(0x7a5cff, { roughness: .35 }), dk = M(0x2a2350, { roughness: .4 });
    const barrel = mesh(new T.CylinderGeometry(.12, .1, .5, 28), b, .15, 0, 0); barrel.rotation.z = -PI / 2; root.add(barrel);
    root.add(sph(b, -.12, 0, 0, .14, .14, .14)); const noz = mesh(new T.CylinderGeometry(.08, .1, .12, 24), dk, .45, 0, 0); noz.rotation.z = -PI / 2; root.add(noz);
    root.add(mesh(new T.CylinderGeometry(.055, .05, .35, 16), b, -.05, -.2, 0)); root.add(sph(M(0xffd23f, { emissive: 0xffd23f, emissiveIntensity: .6 }), -.12, .02, .13, .03));
    return { root }; }
  function makeTowel() { const root = new T.Group(); root.add(mesh(BOX, M(0xff9f43, { roughness: 1 }), 0, .02, 0, .9, .04, .6)); root.add(mesh(BOX, M(0xffd23f, { roughness: 1 }), .38, .045, 0, .08, .01, .6)); return { root }; }
  function makeMarker(n) { const root = new T.Group(); const tex = canvasTex(128, 128, (c, w, h) => { c.fillStyle = "#ffd23f"; c.fillRect(0, 0, w, h); c.fillStyle = "#1d2250"; c.font = '900 92px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(String(n), w / 2, h / 2 + 6); });
    const m = new T.MeshStandardMaterial({ map: tex, roughness: .5 }), y = M(0xffd23f, { roughness: .5 });
    for (const s of [-1, 1]) { const p = new T.Mesh(new T.BoxGeometry(.2, .22, .012), [y, y, y, y, m, m]); p.position.set(0, .1, s * .045); p.rotation.x = -s * .4; p.castShadow = true; root.add(p); }
    return { root }; }
  // ---------- Käfig (vereinfacht) ----------
  function makeCage(Wd, Dp, Hh) { const root = new T.Group(); const tray = M(0x2f6fd0, { roughness: .45 }), wire = M(0xe8edf2, { metalness: .6, roughness: .3 }); const TH = .16;
    root.add(mesh(BOX, tray, 0, TH / 2, 0, Wd, TH, Dp)); const bed = M(0xfff4dc, { roughness: 1 }); root.add(mesh(BOX, bed, 0, TH + .005, 0, Wd - .06, .02, Dp - .06));
    const n = Math.round(Wd / .09); for (let i = 0; i <= n; i++) { const x = -Wd / 2 + i * Wd / n; const b = mesh(CYL, wire, x, TH + Hh / 2, -Dp / 2 + .01, .007, Hh, .007); b.castShadow = false; root.add(b); }
    for (const s of [-1, 1]) for (let i = 0; i <= Math.round(Dp / .09); i++) { const z = -Dp / 2 + i * Dp / Math.round(Dp / .09); const b = mesh(CYL, wire, s * (Wd / 2 - .01), TH + Hh / 2, z, .007, Hh, .007); b.castShadow = false; root.add(b); }
    { const y = TH + Hh; root.add(mesh(BOX, wire, 0, y, -Dp / 2, Wd, .02, .02)); for (const s of [-1, 1]) root.add(mesh(BOX, wire, s * Wd / 2, y, 0, .02, .02, Dp)); }
    const house = new T.Group(); house.position.set(-Wd / 2 + .3, TH, -Dp / 2 + .28); root.add(house); const wd = M(0xc99a63, { roughness: .7 });
    house.add(mesh(BOX, wd, 0, .14, 0, .36, .28, .32)); const roof = mesh(BOX, M(0xa8743f, { roughness: .7 }), 0, .3, 0, .42, .04, .38); roof.rotation.z = .12; house.add(roof);
    return { root, floor: TH + .02 }; }
  // ---------- Sandschale / Staubschale ----------
  function makeDish(col, dust) { const root = new T.Group(); const rimM = M(dust ? 0x9aa3ad : 0xe0603c, { roughness: .4 });
    const shell = new T.Mesh(new T.CylinderGeometry(.36, .3, .14, 36, 1, true), rimM); shell.material.side = T.DoubleSide; shell.position.y = .07; shell.castShadow = true; root.add(shell);
    root.add(mesh(new T.CylinderGeometry(.3, .3, .02, 36), rimM, 0, .01, 0)); const r = mesh(new T.TorusGeometry(.36, .02, 8, 36), rimM, 0, .14, 0); r.rotation.x = PI / 2; root.add(r);
    const sm_ = M(col, { roughness: 1 }); const top = new T.Mesh(new T.CircleGeometry(.345, 36), sm_); top.rotation.x = -PI / 2; top.position.y = .11; top.receiveShadow = true; root.add(top);
    for (let i = 0; i < 12; i++) { const a = i * 2.39, rr = (i % 4) * .07 + .04; const s = sph(sm_, Math.cos(a) * rr, .11, Math.sin(a) * rr, .07, .025, .06); s.castShadow = false; root.add(s); }
    const parts = new T.Group(); root.add(parts); const pm = M(col, { roughness: 1 }); const list = [];
    for (let i = 0; i < 22; i++) { const s = sph(pm, 0, 0, 0, dust ? .035 : .012); s.castShadow = false; parts.add(s); list.push(s); }
    return { root, set(t, k, spread) { list.forEach((s, i) => { const q = (t * (dust ? .5 : 1.4) + i / list.length) % 1, a = i * 2.39; s.visible = k > 0;
      s.position.set(Math.cos(a) * (.05 + q * spread), .14 + Math.sin(q * PI) * (dust ? .55 : .3) + (dust ? q * .3 : 0), Math.sin(a) * (.05 + q * spread)); s.scale.setScalar((dust ? .035 : .012) * (dust ? (1 + q * 2) : 1)); }); } }; }

  K3.onBuild(() => {
    rudi = K3.rudi; ham = actor(makeHamster(0xe9a25a, 0xc9803c), "Hamster");
    bowl = actor(makeBowl(), "Schuessel"); duck = actor(makeDuck(), "Ente"); bottle = actor(makeBottle(), "Shampoo"); dryer = actor(makeDryer(), "Foehn"); towel = actor(makeTowel(), "Handtuch");
    mk1 = actor(makeMarker(1), "Marker1"); mk2 = actor(makeMarker(2), "Marker2"); cage = actor(makeCage(1.25, .8, .62), "Kaefig");
    sandDish = actor(makeDish(0xf0cf86, false), "Sand"); dustDish = actor(makeDish(0xd9d9d9, true), "Staub");
    for (const a of [bowl, duck, bottle, dryer, towel, mk1, mk2, cage, sandDish, dustDish]) a.noCheck = true;
    bath = makeBath();
  });
  function reset() { ham.noCheck = false; rudi.noCheck = false; rudi.root.visible = false; ham.root.rotation.set(0, 0, 0); }
  function inBath() { begin("yard"); K3.yard.visible = false; bath.visible = true; K3.scene.background = new T.Color(0xcdeaf6).convertSRGBToLinear(); K3.scene.fog = new T.Fog(0xcdeaf6, 16, 40); K3.hemi.intensity = .85; reset(); }
  function studio() { begin("studio"); bath.visible = false; reset(); }
  function hand(i) { rudi.root.updateMatrixWorld(true); return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  const hamFrame = (r) => { ham.root.updateMatrixWorld(true); const p = ham.root.position, s = ham.root.scale.x; r = (r || .32) * s; return FR(p.x - r, p.y, p.z - r, p.x + r, p.y + r * 1.3, p.z + r); };
  const BX = .2, BZ = -.2; // Schüssel-Platz
  // Hamster sitzt in der Schaum-Schüssel
  function bowlScene(t, o) { o = o || {}; place(bowl, BX, BZ, 0); bowl.foam.scale.setScalar(o.foam ?? 1); bowl.foam.visible = (o.foam ?? 1) > .02;
    bowl.foam.children.forEach((s, i) => { s.position.y = .22 + (i % 3) * .02 + Math.sin(t * 3 + i) * .01; });
    at(ham, BX - .02, .11, BZ, o.ry ?? -.45, t, { sc: o.sc || .9, wet: 1, shiver: o.shiver ?? 1, worry: o.worry ?? true, o: o.o, look: o.look || 0, up: o.up ?? .12 }); ham.noCheck = true;
    if (o.duck !== false) { place(duck, BX - .2 + Math.sin(t * 1.3) * .03, BZ - .2, .4); duck.root.position.y = .17 + Math.sin(t * 2.4) * .01; duck.root.rotation.z = Math.sin(t * 2) * .08; } }
  // 2D-Blasen, die aufsteigen (Bewegung ab Bild 1)
  function bubbles2d(t, x, y, n, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < n; i++) { const q = (t * .6 + i / n) % 1, xx = x + Math.sin(i * 2.7 + t * 2) * 220 + (i - n / 2) * 26, yy = y - 170 - q * 380, r = 10 + (i % 4) * 7;
      g.globalAlpha = a * (1 - q) * .9; g.strokeStyle = "#ffffff"; g.lineWidth = 4; g.beginPath(); g.arc(xx, yy, r, 0, 7); g.stroke(); g.fillStyle = "rgba(190,230,255,.35)"; g.fill();
      g.fillStyle = "#ffffff"; g.beginPath(); g.arc(xx - r * .35, yy - r * .35, r * .22, 0, 7); g.fill(); } g.restore(); }
  // Absperrband oben (2D)
  function tape(t, y, rot, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.translate(W * .45, y); g.rotate(rot); const w = 1500, h = 78;
    g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(-w / 2 + 6, -h / 2 + 8, w, h); g.fillStyle = "#ffd23f"; g.fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle = "#1d2250"; g.font = '900 40px "Montserrat"'; g.textBaseline = "middle"; const s = L("CRIME SCENE · DO NOT CROSS · ", "TATORT · NICHT BETRETEN · "); const sw = g.measureText(s).width;
    const off = -((t * 120) % sw); for (let x = -w / 2 + off; x < w / 2; x += sw) g.fillText(s, x, 3); g.restore(); }
  // Wind-Linien (2D) vom Föhn
  function wind(t, x0, y0, x1, y1, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = "#ffffff"; g.lineCap = "round"; g.lineWidth = 9;
    for (let i = 0; i < 6; i++) { const q = (t * 2.2 + i / 6) % 1, o = (i - 2.5) * 22; const xa = lerp(x0, x1, q), ya = lerp(y0, y1, q) + o; g.globalAlpha = a * Math.sin(q * PI);
      g.beginPath(); g.moveTo(xa - 50, ya); g.quadraticCurveTo(xa, ya - 14, xa + 50, ya); g.stroke(); } g.restore(); }
  // Stinkwolken (2D)
  function stink(t, x, y, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = "#7bd66b"; g.lineWidth = 12; g.lineCap = "round";
    for (let i = 0; i < 3; i++) { const q = (t * .8 + i / 3) % 1; g.globalAlpha = a * Math.sin(q * PI); g.beginPath();
      for (let k = 0; k <= 20; k++) { const yy = y - q * 160 - k * 8, xx = x + (i - 1) * 70 + Math.sin(k * .6 + t * 4) * 16; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } g.restore(); }

  // ---------- Shots ----------
  // 0 Hook: klitschnasser Hamster in der Schaum-Schüssel, Blasen, Stempel NIE! sofort
  KZ.shot("hHook", (lt, d, t) => { inBath(); const ph = lt / d, k = sm(clamp(ph * 1.4, 0, 1)); bowlScene(t, { o: true });
    frameOn([hamFrame(.34), FR(BX - .42, .05, BZ - .2, BX + .42, .3, BZ + .2)], { az: lerp(.75, .6, k), el: .22, fill: lerp(.98, 1.12, k), t }); draw();
    ham.root.updateMatrixWorld(true); const [bx, by] = scr(V(BX, .3, BZ)); bubbles2d(t, bx, by, 10, 1);
    stamp(L("NEVER!", "NIE!"), W * .42, H * .62, lt / .25, "#e5484d", -.07); });
  // 1 Tatort: Hamster nass auf dem Handtuch, zittert, Beweis 1 Shampoo, Beweis 2 Ente, Rudi als Verdächtiger
  KZ.shot("hCrime", (lt, d, t) => { inBath(); const ph = lt / d, k = sm(ph);
    place(towel, .25, -.1, .1); at(ham, .25, .045, -.1, .5, t, { sc: 1.5, wet: 1, shiver: 1, worry: true, o: Math.sin(t * 9) > .3, up: .1 });
    place(bottle, -.35, .25, 0); place(mk1, -.35, .55, .2); place(duck, .85, .3, -.8); place(mk2, .85, .58, -.3);
    place(rudi, -.5, -1.0, -.35); poseRudi(rudi, t, { arms: [.2, 1.6 + Math.sin(t * 5) * .06], spread: .05, mouth: "o", lean: .06, nod: -.05 });
    frameOn([rudi, FR(-.5, 0, -.3, 1.0, .5, .7)], { az: lerp(.5, .42, k), el: .16, fill: lerp(.98, 1.05, k), t }); draw();
    tape(t, H * .13, -.05, clamp(lt / .25, 0, 1));
    if (ph > .5) stamp(L("SHIVERING!", "NASS!"), W * .42, H * .23, (ph - .5) * d / .3, "#2f6fd0", .06); });
  // 2 Rate-Frage: Hamster auf dem Handtuch schaut in die Kamera, Kacheln
  KZ.shot("hQuiz", (lt, d, t) => { inBath(); const ph = lt / d, k = sm(ph);
    place(towel, .2, -.1, 0); at(ham, .2, .045, -.1, -.55, t, { sc: 1, wet: 1, shiver: .6, worry: false, up: .15 });
    frameOn([hamFrame(.36)], { az: lerp(.55, .45, k), el: .16, fill: lerp(.8, .86, k), dy: -.35, t }); draw();
    quizTiles(W * .42, H * .57, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 3 Rudi riecht am Käfig (Stinkwolken) – Schnitt: Rudi kippt Erdbeer-Shampoo in die Schüssel, Schaum wächst
  KZ.shot("hStink", (lt, d, t) => { inBath(); const ph = lt / d;
    if (ph < .45) { const k = ph / .45; place(cage, .3, -.3, 0); at(ham, .45, cage.floor, -.2, -.3, t, { sc: .85, up: .1, look: .3 }); ham.noCheck = true;
      place(rudi, -.7, .1, -.45); poseRudi(rudi, t, { arms: [2.3, .15], spread: .04, mouth: "o", lean: -.1, tilt: .1 });
      frameOn([rudi, cage], { az: lerp(.36, .3, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw();
      const [cx, cy] = scr(V(.3, .9, -.3)); stink(t, cx, cy, 1);
      stamp(L("SMELLY?!", "STINKT?!"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06); }
    else { const k = (ph - .45) / .55; bowlScene(t, { foam: lerp(.3, 1.3, sm(k)), o: true, shiver: .3 });
      place(rudi, BX - 1.05, BZ - .45, -.1); poseRudi(rudi, t, { arms: [.1, 1.75], spread: .05, mouth: "smile", lean: -.08 });
      const hp = hand(1); place(bottle, 0, 0, 0); bottle.root.position.set(hp.x + .05, hp.y - .2, hp.z); bottle.root.rotation.set(0, 0, -2.1 + Math.sin(t * 6) * .1);
      frameOn([rudi, bowl], { az: lerp(.34, .28, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw();
      const [bx, by] = scr(V(BX, .3, BZ)); bubbles2d(t, bx, by, 8, 1);
      stamp(L("STRAWBERRY!", "ERDBEERE!"), W * .42, H * .17, (k * d * .55 - .15) / .3, "#ff6f9f", .06); } });
  // 4 Hamster zittert (Nah) – Schnitt: Rudi föhnt, Hamster wird zur Fellkugel
  KZ.shot("hDryer", (lt, d, t) => { inBath(); const ph = lt / d;
    if (ph < .4) { const k = ph / .4; bowlScene(t, { foam: .5, shiver: 1.6, o: true, ry: -.2, duck: false });
      frameOn([hamFrame(.34)], { az: lerp(.7, .62, k), el: .16, fill: lerp(.9, 1.0, k), t }); draw();
      stamp("BRRRR!", W * .42, H * .17, (lt - .15) / .3, "#2f6fd0", -.06); }
    else { const k = (ph - .4) / .6, pf = sm(clamp(k * 1.5, 0, 1));
      place(towel, .7, -.1, 0); at(ham, .62, .045, -.1, -1.1, t, { sc: 1.0, wet: 1 - pf, poof: pf, worry: true, o: true, up: .1 });
      place(rudi, -.35, -.35, -.2); poseRudi(rudi, t, { arms: [.2, 1.55], spread: .05, mouth: "smile", lean: -.05 });
      const hp = hand(1); place(dryer, 0, 0, 0); dryer.root.position.set(hp.x + .05, hp.y + .12, hp.z); dryer.root.rotation.set(0, .1, -.8 + Math.sin(t * 25) * .02);
      frameOn([rudi, FR(.4, 0, -.4, 1.0, .5, .2)], { az: lerp(.62, .55, k), el: .14, fill: lerp(.9, .94, k), t }); draw();
      dryer.root.updateMatrixWorld(true); const [x0, y0] = scr(dryer.root.localToWorld(V(.55, 0, 0))); ham.root.updateMatrixWorld(true); const [x1, y1] = scr(ham.root.localToWorld(V(0, .25, 0)));
      wind(t, x0, y0, x1, y1, 1);
      stamp(L("FULL BLAST", "STUFE 3"), W * .42, H * .17, (k * d * .6 - .1) / .3, "#7a5cff", .06); } });
  // 5 Infografik: Körperwärme-Thermometer sinkt, nasser Hamster zittert
  KZ.shot("hCold", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(ham, -.15, 0, 0, .5, t, { sc: 1.15, wet: 1, shiver: 1.2, worry: true, o: true, up: .08 });
    frameOn([FR(-.5, .05, -.35, .55, .55, .35)], { az: lerp(.2, .12, k), el: .1, fill: lerp(.86, .92, k), t }); draw();
    const x = W * .7, y0 = H * .22, y1 = H * .56, lvl = lerp(.92, .22, sm(clamp((ph - .1) * 1.4, 0, 1))), a = clamp(lt / .3, 0, 1);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(x - 42, y0, 84, y1 - y0, 42); g.fill(); g.beginPath(); g.arc(x, y1 + 30, 70, 0, 7); g.fill();
    const col = lvl > .5 ? "#e5484d" : "#2f9bff"; g.fillStyle = col; const yl = lerp(y1, y0 + 30, lvl); g.beginPath(); g.roundRect(x - 24, yl, 48, y1 - yl + 30, 24); g.fill(); g.beginPath(); g.arc(x, y1 + 30, 52, 0, 7); g.fill();
    g.fillStyle = "#1d2250"; for (let i = 0; i < 6; i++) g.fillRect(x + 42 - 28, y0 + 40 + i * (y1 - y0 - 60) / 5, 22, 6); g.restore();
    txt(L("BODY HEAT", "KÖRPERWÄRME"), x - 40, y0 - 40, 40, "#ffffff", { stroke: 8, a, w: 900 });
    if (ph > .55) stamp(L("SICK!", "KRANK!"), W * .38, H * .62, (ph - .55) * d / .3, "#e5484d", -.06); });
  // 6 Infografik Schutzfett-Balken leert sich + Quellenkarte PetMD
  KZ.shot("hOil", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(ham, 0, 0, 0, .55, t, { sc: 1.1, wet: 1, shiver: .5, worry: true, up: .05 });
    frameOn([hamFrame(.42)], { az: lerp(.45, .35, k), el: .12, fill: lerp(.84, .9, k), dy: -.4, t }); draw();
    const bx = W * .42, by = H * .17, bw = 620, a = clamp(lt / .3, 0, 1), v = lerp(1, .15, sm(clamp((ph - .05) * 2.2, 0, 1)));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.roundRect(bx - bw / 2, by - 40, bw, 80, 40); g.fill();
    g.fillStyle = v > .4 ? "#ffb800" : "#e5484d"; g.beginPath(); g.roundRect(bx - bw / 2 + 10, by - 30, (bw - 20) * v, 60, 30); g.fill(); g.restore();
    txt(L("FUR OIL", "SCHUTZFETT"), bx, by - 80, 44, "#ffffff", { stroke: 9, a, w: 900 });
    // Öltropfen, die aus dem Fell rutschen
    ham.root.updateMatrixWorld(true); const [hx, hy] = scr(ham.root.localToWorld(V(0, .35, 0)));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 5; i++) { const q = (t * .7 + i / 5) % 1; g.globalAlpha = a * (1 - q); g.fillStyle = "#ffcf3f";
      const xx = hx - 120 + i * 60, yy = hy + q * 220; g.beginPath(); g.moveTo(xx, yy - 26); g.quadraticCurveTo(xx + 18, yy, xx, yy + 12); g.quadraticCurveTo(xx - 18, yy, xx, yy - 26); g.fill(); } g.restore();
    infoCard(W * .42, H * .6, 900, 220, sm((ph - .35) * d / .35), L("PetMD (veterinarian)", "PetMD (Tierärztin)"), "#2f6fd0",
      [L("\"Water baths can cause stress,", "„Wasserbäder: Stress,"), L("remove natural oils\"", "weniger Hautfett“")], 38); });
  // 7 Auflösung: Hamster wälzt sich im Sandbad, Sand fliegt, Kacheln B grün
  KZ.shot("hReveal", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(sandDish, 0, 0, 0); sandDish.root.scale.setScalar(1); sandDish.set(t, 1, .4); at(ham, -.02, .1, 0, .3, t, { sc: .95, roll: Math.sin(t * 5) * .55, up: .25, o: false });
    frameOn([FR(-.45, 0, -.4, .45, .55, .4)], { az: lerp(.5, .38, k), el: .22, fill: lerp(.78, .84, k), dy: -.35, t }); draw();
    if (ph < .55) quizTiles(W * .42, H * .57, QUIZ(), 1, { reveal: sm(clamp((lt - .15) / .4, 0, 1)), correct: 1 });
    else stamp(L("SAND BATH!", "SANDBAD!"), W * .42, H * .6, (ph - .55) * d / .3, "#ffb800", -.06); });
  // 8 Tipp: Chinchilla-Sand ✓ gegen Staub ✗
  KZ.shot("hTip", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(sandDish, -.62, 0, 0); sandDish.root.scale.setScalar(1.6); sandDish.set(t, 1, .25); place(dustDish, .62, 0, 0); dustDish.root.scale.setScalar(1.6); dustDish.set(t, ph > .45 ? 1 : 0, .25);
    at(ham, -.62, .16, 0, -.4, t, { sc: 1.25, up: .2, roll: Math.sin(t * 4) * .3 });
    frameOn([FR(-1.2, 0, -.6, 1.2, .65, .6)], { az: lerp(.08, 0, k), el: .26, fill: lerp(1.0, 1.04, k), t }); draw();
    const [sx, sy] = scr(V(-.62, .2, 0)), [dx, dy] = scr(V(.62, .2, 0));
    txt(L("CHINCHILLA SAND", "CHINCHILLA-SAND"), sx, sy + 150, 36, "#ffffff", { stroke: 8, w: 900, a: clamp(lt / .3, 0, 1) });
    stamp("✓", sx, sy - 210, (lt - .25) / .3, "#36b37e", -.05);
    if (ph > .45) { txt(L("DUST", "STAUB"), dx, dy + 150, 36, "#ffffff", { stroke: 8, w: 900, a: clamp((ph - .45) * 5, 0, 1) }); stamp("✗", dx, dy - 210, (ph - .5) * d / .3, "#e5484d", .05); }
    txt(L("Sources: PetMD, RSPCA", "Quellen: PetMD, RSPCA"), W * .42, H * .655, 34, "#ffffff", { stroke: 8, a: clamp((ph - .2) * 4, 0, 1) }); });
  // 9 Loop: Hook-Einstellung (Hamster in der Schaum-Schüssel)
  KZ.shot("hLoop", (lt, d, t) => { inBath(); const ph = lt / d, k = sm(ph); bowlScene(t, { o: ph > .5 });
    frameOn([hamFrame(.34), FR(BX - .42, .05, BZ - .2, BX + .42, .3, BZ + .2)], { az: lerp(.6, .75, k), el: .22, fill: lerp(1.12, .98, k), t }); draw();
    ham.root.updateMatrixWorld(true); const [bx, by] = scr(V(BX, .3, BZ)); bubbles2d(t, bx, by, 10, 1);
    if (ph > .4) stamp(L("BUBBLE BATH?", "SCHAUMBAD?"), W * .42, H * .62, (ph - .4) * d / .3, "#ff6f9f", -.06); });

  window.__hamsterBath = true;
})();
