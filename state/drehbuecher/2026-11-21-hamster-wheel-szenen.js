// 3D-Szene "Why Your Hamster's Wheel Is Wrecking Its Back" / "Warum das Laufrad deinem Hamster schadet" (21.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Syrischer Goldhamster neu gebaut mit zweigeteiltem Körper (vorn/hinten), damit er sich im zu kleinen Rad sichtbar zur "Banane" krümmt (bend 0..1).
// Starter-Käfig mit Mini-Laufrad, Riesenrad, Rudi im Mini-Rad (Rücken knackt, Sterne), Rücken-Infografik (krumm vs. gerade), Lineal 0-30 cm,
// Nacht-Kilometerzähler, Wahltest 23 vs. 35 cm, Tipp: geschlossenes Rad ab 30 cm in tiefer Einstreu.
// Quellen: PDSA (Hamsters as pets: "At least 30cm (12″) for Syrian Hamsters", zu kleine Räder "forcing the hamster to run with a curve in their back
// which can cause long-term pain"), Blue Cross (Käfig-Räder oft zu klein), TVT (mind. 30 cm Goldhamster), PetMD (bis 5 Meilen pro Nacht),
// Reebs & St-Onge 2005, Laboratory Animals, Univ. Moncton (35 cm vor 23 cm gewählt, mit nur 23 cm halb so viel gelaufen).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let ham, ham2, rudi, room, roomBg, cage, wSmall, wGood, wGiant, wRudi, wA, wB, ruler, bigCage, boxSet, rStars, moon, handRuler;
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }

  // ---------- Syrischer Goldhamster (goldbraun oben, cremeweiß unten, dunkler Backenfleck, runde Ohren, Knopfaugen) ----------
  // Körper in zwei Hälften mit Gelenk in der Mitte: bend 1 = Kopf und Po hoch (Rücken durchgebogen wie im zu kleinen Rad).
  function makeHamster(col, colD) {
    const fur = M(col, { roughness: .8 }), furD = M(colD, { roughness: .8 }), cream = M(0xfff1dc, { roughness: .85 }), pink = M(0xffa3b1, { roughness: .5 });
    const black = M(0x120c10, { roughness: .08 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), wh = M(0xffffff, { roughness: .4 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const front = new T.Group(), rear = new T.Group(); front.position.set(0, .2, 0); rear.position.set(0, .2, 0); body.add(front); body.add(rear);
    // vordere Hälfte (Koordinaten relativ zum Gelenk bei y .2)
    front.add(sph(fur, .07, 0, 0, .17, .18, .19)); front.add(sph(furD, .02, .07, 0, .12, .09, .13)); front.add(sph(cream, .09, -.06, 0, .14, .11, .16));
    // hintere Hälfte
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
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.105, .045, s * .085); head.add(e);
      e.add(sph(black, 0, 0, 0, .04, .043, .04)); e.add(sph(hl, .03, .017, -.008 * s, .011)); eyes.push(e); }
    // Sorgenfalten-Brauen (schräg nach oben, bei Schmerz)
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, M(0x3a2216, { roughness: .6 }), .12, .1, s * .085, .015, .016, .075); b.castShadow = false; head.add(b); brows.push(b); }
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .17, -.04 + i * .015, s * .09, .003, .13, .003); w.rotation.x = s * (PI / 2 - .25 + i * .2); w.castShadow = false; head.add(w); }
    // Schweißtropfen
    const drops = []; const dm = M(0x8fd3ff, { roughness: .1, metalness: .1 }); for (let i = 0; i < 2; i++) { const d = sph(dm, 0, 0, 0, .018, .028, .018); d.castShadow = false; head.add(d); drops.push(d); }
    return { root, body, front, rear, legs, head, eyes, cheeks, brows, mouth, oMouth, drops };
  }
  // o: {run, bend, look, up, sc, puff, worry, sweat, o}
  function poseHam(Hm, t, o) {
    o = o || {}; const run = o.run || 0, bend = o.bend || 0, sp = o.speed || 22;
    Hm.legs.forEach((l, i) => l.rotation.z = Math.sin(t * sp + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .7 * run);
    Hm.body.position.y = Math.abs(Math.sin(t * sp)) * .012 * run + Math.sin(t * 3) * .004;
    Hm.front.rotation.z = bend * .75; Hm.rear.rotation.z = -bend * .7;
    Hm.front.position.y = .2 - bend * .05; Hm.rear.position.y = .2 - bend * .05;
    Hm.head.rotation.set(0, o.look || 0, (o.up || 0) - bend * .25 + Math.sin(t * 2.3) * .03);
    const lid = o.lid ?? (Math.sin(t * 1.6 + .5) > .985 ? .85 : 0);
    Hm.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid), 1));
    Hm.cheeks.forEach((c) => c.scale.copy(c.base).multiplyScalar(1 + (o.puff || 0) * .35));
    Hm.brows.forEach((b, i) => { b.visible = !!o.worry; b.rotation.x = (i ? 1 : -1) * .45; });
    Hm.mouth.visible = !o.o; Hm.oMouth.visible = !!o.o;
    Hm.drops.forEach((d, i) => { d.visible = !!o.sweat; const q = (t * 1.4 + i * .5) % 1; d.position.set(-.02 - i * .05, .17 - q * .12, (i ? -1 : 1) * .12); });
    Hm.root.scale.setScalar(o.sc || 1);
  }
  function at(Hm, x, y, z, ry, t, o) { Hm.root.visible = true; Hm.root.position.set(x, y, z); Hm.root.rotation.set(0, ry || 0, 0); poseHam(Hm, t, o); }

  // ---------- Laufrad (geschlossene Lauffläche, Speichen hinten, Ständer). Radius .55, Mitte y .62 bei Maßstab 1 ----------
  function makeWheel(col) {
    const root = new T.Group(), spin = new T.Group(); spin.position.set(0, .62, 0); root.add(spin);
    const wcol = M(col, { roughness: .4 }), wcolD = M(new T.Color(col).multiplyScalar(.75).getHex(), { roughness: .45 });
    const back = mesh(new T.CylinderGeometry(.55, .55, .03, 48), wcolD, 0, 0, -.24); back.rotation.x = PI / 2; spin.add(back);
    const run = new T.Mesh(new T.CylinderGeometry(.55, .55, .46, 48, 1, true), new T.MeshStandardMaterial({ color: new T.Color(col).convertSRGBToLinear(), roughness: .5, side: T.DoubleSide })); run.rotation.x = PI / 2; run.receiveShadow = true; spin.add(run);
    spin.add(mesh(new T.TorusGeometry(.55, .025, 10, 48), wcol, 0, 0, .23));
    for (let i = 0; i < 6; i++) { const s = mesh(BOX, M(0xffffff, { roughness: .4 }), 0, 0, -.22, .9, .04, .01); s.rotation.z = i / 6 * PI; spin.add(s); }
    spin.add(sph(M(0xffffff, { roughness: .3 }), 0, 0, -.23, .06, .06, .03));
    root.add(mesh(BOX, wcolD, 0, .32, -.3, .1, .64, .06)); root.add(mesh(BOX, wcolD, 0, .02, -.15, .6, .04, .5));
    return { root, spin };
  }
  // Hamster unten im Rad (Rad bei x,y0,z mit Maßstab sx (Höhe/Durchmesser))
  function inWheel(Wh, x, y0, z, s) { place(Wh, x, z, 0); Wh.root.position.y = y0; return y0 + (.62 - .55) * s; }

  // ---------- Drahtkäfig (Wanne + Einstreu, Gitter hinten/seitlich/oben, vorn offen wie ein Diorama) ----------
  function makeCage(Wd, Dp, Hh, deep, col) {
    const root = new T.Group(); const tray = M(col || 0x2f6fd0, { roughness: .45 }), wire = M(0xe8edf2, { metalness: .6, roughness: .3 });
    const TH = deep ? .42 : .16;
    root.add(mesh(BOX, tray, 0, TH / 2, 0, Wd, TH, Dp));
    const bed = M(0xfff4dc, { roughness: 1 }); root.add(mesh(BOX, bed, 0, TH + .005, 0, Wd - .06, .02, Dp - .06));
    for (let i = 0; i < (deep ? 40 : 18); i++) { const a = i * 2.39, r = (i * 37 % 100) / 100; const s = sph(bed, (r - .5) * (Wd - .2), TH + .02, Math.sin(a) * (Dp / 2 - .1), .07, .03, .05); s.rotation.y = a; root.add(s); }
    const bars = new T.Group(); root.add(bars); const n = Math.round(Wd / .09);
    for (let i = 0; i <= n; i++) { const x = -Wd / 2 + i * Wd / n; const b = mesh(CYL, wire, x, TH + Hh / 2, -Dp / 2 + .01, .007, Hh, .007); b.castShadow = false; bars.add(b); }
    for (const s of [-1, 1]) for (let i = 0; i <= Math.round(Dp / .09); i++) { const z = -Dp / 2 + i * Dp / Math.round(Dp / .09); const b = mesh(CYL, wire, s * (Wd / 2 - .01), TH + Hh / 2, z, .007, Hh, .007); b.castShadow = false; bars.add(b); }
    { const y = TH + Hh; bars.add(mesh(BOX, wire, 0, y, -Dp / 2, Wd, .02, .02)); for (const s of [-1, 1]) bars.add(mesh(BOX, wire, s * Wd / 2, y, 0, .02, .02, Dp)); bars.add(mesh(BOX, wire, 0, y, Dp / 2, Wd, .02, .02)); }
    for (let i = 0; i <= n; i += 2) { const x = -Wd / 2 + i * Wd / n; const b = mesh(CYL, wire, x, TH + Hh, 0, .006, Dp, .006); b.rotation.x = PI / 2; b.castShadow = false; bars.add(b); }
    const house = new T.Group(); house.position.set(-Wd / 2 + .3, TH, -Dp / 2 + .28); root.add(house); const wd = M(0xc99a63, { roughness: .7 });
    house.add(mesh(BOX, wd, 0, .14, 0, .36, .28, .32)); const roof = mesh(BOX, M(0xa8743f, { roughness: .7 }), 0, .3, 0, .42, .04, .38); roof.rotation.z = .12; house.add(roof);
    const hole = mesh(new T.CircleGeometry(.08, 24), M(0x2a1a10), .181, .11, 0); hole.rotation.y = PI / 2; house.add(hole);
    return { root, floor: TH + .02, Wd, Dp };
  }
  // ---------- Lineal 0-30 cm (Länge = Durchmesser eines Rads mit Maßstab 1) ----------
  function makeRuler(len) {
    const root = new T.Group(); const tex = canvasTex(1024, 96, (c, w, h) => { c.fillStyle = "#ffd23f"; c.fillRect(0, 0, w, h); c.fillStyle = "#1d2250";
      for (let i = 0; i <= 30; i++) { const x = 12 + i * (w - 24) / 30; c.fillRect(x - 2, 0, 4, i % 5 ? 22 : 40); }
      c.font = '900 34px "Montserrat"'; c.textAlign = "center"; for (let i = 0; i <= 30; i += 10) c.fillText(String(i), Math.min(w - 40, Math.max(30, 12 + i * (w - 24) / 30)), 76); });
    const y = M(0xe0b52f, { roughness: .5 });
    root.add(new T.Mesh(new T.BoxGeometry(len, .1, .02), [y, y, y, y, new T.MeshStandardMaterial({ map: tex, roughness: .5 }), y]));
    root.traverse((m) => { m.castShadow = false; }); return { root };
  }
  // ---------- Starter-Set-Karton ----------
  function makeBox() { const root = new T.Group(); const tex = canvasTex(512, 384, (c, w, h) => { c.fillStyle = "#ff9f43"; c.fillRect(0, 0, w, h); c.fillStyle = "#fff";
      c.font = '900 88px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("STARTER", w / 2, 110); c.fillStyle = "#1d2250"; c.fillText("SET", w / 2, 210);
      c.fillStyle = "#e5484d"; c.beginPath(); c.roundRect(60, 270, w - 120, 80, 20); c.fill(); c.fillStyle = "#fff"; c.font = '900 46px "Montserrat"'; c.fillText(L("+ WHEEL!", "+ RAD!"), w / 2, 312); });
    const o = M(0xe8882f, { roughness: .6 }); const face = new T.MeshStandardMaterial({ map: tex, roughness: .6 });
    const b = new T.Mesh(new T.BoxGeometry(.4, .52, .7), [o, o, o, o, face, o]); b.castShadow = true; root.add(b); return { root }; }
  // ---------- Sterne um Rudis Kopf ----------
  function makeStars(r, y) { const grp = new T.Group(); const st = new T.Shape(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? .4 : 1, a = i / 10 * 2 * PI - PI / 2; i ? st.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : st.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    const sg = new T.ExtrudeGeometry(st, { depth: .3, bevelEnabled: false }); sg.center(); const list = [];
    for (let i = 0; i < 3; i++) { const m = mesh(sg, M(0xffd23f, { emissive: 0x8a6a00, roughness: .3 })); m.scale.setScalar(.07); m.castShadow = false; grp.add(m); list.push(m); }
    grp.visible = false; return { grp, set(t) { list.forEach((s, i) => { const a = t * 4 + i * 2.1; s.position.set(Math.cos(a) * r, y + Math.sin(a * 2) * .03, Math.sin(a) * r); s.rotation.set(0, a, 0); }); } }; }

  K3.onBuild(() => {
    rudi = K3.rudi; ham = actor(makeHamster(0xe9a25a, 0xc9803c), "Hamster"); ham2 = actor(makeHamster(0xe9a25a, 0xc9803c), "Hamster 2"); ham2.noCheck = true;
    cage = actor(makeCage(1.25, .8, .62, false), "Kaefig"); bigCage = actor(makeCage(2.3, 1.15, 1.35, true, 0x36b37e), "Kaefig gross");
    wSmall = actor(makeWheel(0xff5d8f), "Mini-Rad"); wGood = actor(makeWheel(0x36b37e), "Rad gut"); wGiant = actor(makeWheel(0x7a5cff), "Riesenrad"); wRudi = actor(makeWheel(0xff5d8f), "Rudi-Rad");
    wA = actor(makeWheel(0xff9f43), "Rad 23"); wB = actor(makeWheel(0x36b37e), "Rad 35");
    ruler = actor(makeRuler(1.1), "Lineal"); handRuler = actor(makeRuler(1.1), "Hand-Lineal"); boxSet = actor(makeBox(), "Karton");
    moon = actor({ root: (() => { const gq = new T.Group(); const mm = sph(M(0xfff2b0, { emissive: 0xffe680, emissiveIntensity: .9 }), 0, 0, 0, .35); mm.castShadow = false; gq.add(mm);
      const sm2 = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }); for (let i = 0; i < 14; i++) { const s = sph(sm2, Math.cos(i * 2.4) * (1 + i % 3 * .5), Math.sin(i * 1.7) * .9 + .2, -.5 - (i % 4) * .2, .025); s.castShadow = false; gq.add(s); } return gq; })() }, "Mond");
    for (const a of [cage, bigCage, wSmall, wGood, wGiant, wRudi, wA, wB, ruler, handRuler, boxSet, moon]) a.noCheck = true;
    rStars = makeStars(.32, .62); rudi.head.add(rStars.grp);
    room = makeRoomW(); roomBg = new T.Color(0xdff0e6).convertSRGBToLinear();
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  // ---------- Wohnzimmer ----------
  function makeRoomW() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(512, 512, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = ["#c8935e", "#bd8752", "#d29d68", "#c28c58"][i % 4]; c.fillRect(0, i * h / 8, w, h / 8); c.fillStyle = "rgba(90,50,20,.35)"; c.fillRect(0, i * h / 8, w, 3); c.fillRect((i * 173) % w, i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(6, 6);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    const wallTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#e3f1fb"; c.fillRect(0, 0, w, h); c.fillStyle = "#d3e7f5"; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h); });
    wallTex.wrapS = wallTex.wrapT = T.RepeatWrapping; wallTex.repeat.set(10, 3);
    r.add(mesh(BOX, new T.MeshStandardMaterial({ map: wallTex, roughness: .9 }), 0, 2.5, -3, 30, 5, .2));
    r.add(mesh(BOX, M(0xffffff), 0, .08, -2.88, 30, .16, .06));
    const sky = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(1, "#cdeeff"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    const win = new T.Mesh(new T.PlaneGeometry(1.6, 1.4), new T.MeshStandardMaterial({ map: sky, emissive: 0xffffff, emissiveMap: sky, emissiveIntensity: .5 })); win.position.set(-2.4, 2.3, -2.89); r.add(win);
    const fr = M(0xffffff, { roughness: .5 }); for (const [x, y, sx, sy] of [[-2.4, 3.03, 1.75, .08], [-2.4, 1.57, 1.75, .08], [-3.24, 2.3, .08, 1.5], [-1.56, 2.3, .08, 1.5], [-2.4, 2.3, .05, 1.4], [-2.4, 2.3, 1.6, .05]]) r.add(mesh(BOX, fr, x, y, -2.87, sx, sy, .06));
    const rug = new T.Mesh(new T.CircleGeometry(1.8, 48), M(0xff9f43, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(.2, .006, -.2); rug.scale.set(1.5, .9, 1); rug.receiveShadow = true; r.add(rug);
    const rug2 = new T.Mesh(new T.RingGeometry(1.45, 1.6, 48), M(0xffd23f, { roughness: 1 })); rug2.rotation.x = -PI / 2; rug2.position.set(.2, .008, -.2); rug2.scale.set(1.5, .9, 1); r.add(rug2);
    const sh = new T.Group(); sh.position.set(2.6, 0, -2.5); r.add(sh); const wd = M(0x8a5a3a, { roughness: .6 });
    sh.add(mesh(BOX, wd, 0, .9, 0, 1.2, 1.8, .4)); for (const y of [.45, .95, 1.45]) sh.add(mesh(BOX, M(0x6e4628), 0, y, .2, 1.1, .04, .05));
    for (let i = 0; i < 6; i++) sh.add(mesh(BOX, M([0xe5484d, 0x2f6fd0, 0xffd23f, 0x36b37e, 0xff9f43, 0x7a5cff][i]), -.4 + i * .15, 1.12, .05, .1, .3, .25));
    const pl = new T.Group(); pl.position.set(-3.2, 0, -2.4); r.add(pl); pl.add(mesh(new T.CylinderGeometry(.25, .18, .45, 24), M(0xe0603c), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const a = i / 7 * 2 * PI; const lf = sph(M(i % 2 ? 0x4fae4a : 0x3f9a3c), Math.cos(a) * .2, .75 + (i % 3) * .1, Math.sin(a) * .2, .1, .35, .05); lf.rotation.set(Math.sin(a) * .5, -a, Math.cos(a) * .5); pl.add(lf); }
    return r;
  }
  function reset() { ham.noCheck = false; rudi.noCheck = false; rStars.grp.visible = false; ham.root.rotation.set(0, 0, 0);
    for (const Wh of [wSmall, wGood, wGiant, wRudi, wA, wB]) { Wh.root.scale.setScalar(1); Wh.root.rotation.set(0, 0, 0); Wh.spin.rotation.z = 0; } }
  function inRoom() { begin("yard"); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xe3f1fb, 16, 40); K3.hemi.intensity = .8; reset(); }
  function studio() { begin("studio"); room.visible = false; reset(); }
  function hand(i) { rudi.root.updateMatrixWorld(true); return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  // roter/grüner Rücken-Strich über den Hamster (2D, Bildschirm)
  function spineLine(Hm, col, a) { Hm.root.updateMatrixWorld(true);
    const p0 = scr(Hm.rear.localToWorld(V(-.24, .12, 0))), p1 = scr(Hm.body.localToWorld(V(0, .39, 0))), p2 = scr(Hm.head.localToWorld(V(.04, .15, 0)));
    const cx = 2 * p1[0] - (p0[0] + p2[0]) / 2, cy = 2 * p1[1] - (p0[1] + p2[1]) / 2; // Kurve geht genau durch p1
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a ?? 1; g.lineCap = "round";
    for (const [c, w] of [["rgba(0,0,0,.55)", 24], [col, 14]]) { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(p0[0], p0[1] - 14); g.quadraticCurveTo(cx, cy - 14, p2[0], p2[1] - 14); g.stroke(); }
    g.restore(); }
  function crackLines(x, y, t, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.strokeStyle = "#fff"; g.lineWidth = 9; g.lineCap = "round";
    for (let i = 0; i < 5; i++) { const an = -PI / 2 + (i - 2) * .45, r0 = 50 + Math.sin(t * 20 + i) * 6; g.beginPath(); g.moveTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0); g.lineTo(x + Math.cos(an) * (r0 + 45), y + Math.sin(an) * (r0 + 45)); g.stroke(); } g.restore(); }

  const CX = .2, CZ = -.3; // Käfig-Mitte im Zimmer
  const SW = .56; // Maßstab Mini-Rad (Durchmesser .62 ≈ Körperlänge -> Banane)
  // Hook/Loop/Set: kleiner Starter-Käfig, Mini-Rad, Hamster rennt krumm
  function smallCageScene(t, runK, bendK, o) { o = o || {}; place(cage, CX, CZ, 0); const F = cage.floor;
    wSmall.root.scale.set(SW, SW, 1); const y = inWheel(wSmall, CX + .25, F - .02, CZ - .05, SW); wSmall.spin.rotation.z = -t * 6 * runK;
    if (o.outside) at(ham, o.hx ?? CX - .3, F, o.hz ?? CZ + .12, o.ry ?? .3, t, { sc: .85, look: o.look || 0, up: .15 });
    else at(ham, CX + .25, y, CZ - .05, 0, t, { sc: .85, run: runK, bend: bendK, worry: bendK > .5, sweat: o.sweat, o: o.o });
    ham.noCheck = true; return F; }
  const smallFrame = () => FR(CX - .1, cage.floor - .05, CZ - .3, CX + .6, cage.floor + .58, CZ + .25);

  // ---------- Shots ----------
  // 0 Hook: Nahaufnahme, Hamster rennt im Mini-Rad krumm wie eine Banane
  KZ.shot("wHook", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph); smallCageScene(t, 1, 1, { sweat: ph > .4 });
    frameOn([smallFrame()], { az: lerp(.42, .3, k), el: .1, fill: lerp(.92, 1.02, k), t }); draw();
    if (ph > .35) stamp(L("OUCH!", "AUA!"), W * .42, H * .62, (ph - .35) * d / .3, "#e5484d", -.06); });
  // 1 Rudi präsentiert stolz das Starter-Set (Karton + Käfig) – Schnitt: Hamster rennt krumm
  KZ.shot("wSet", (lt, d, t) => { inRoom(); const ph = lt / d;
    if (ph < .5) { const k = ph / .5; smallCageScene(t, .3, 0, { outside: true, look: -.3 });
      place(rudi, CX - 1.7, CZ + .45, .35); poseRudi(rudi, t, { arms: [1.25, 1.25], spread: .05, mouth: "smile", nod: .05 });
      const hp = hand(0).add(hand(1)).multiplyScalar(.5); place(boxSet, 0, 0, 0); boxSet.root.position.set(hp.x + .15, hp.y + .05, hp.z); boxSet.root.rotation.set(0, -.15, 0);
      frameOn([rudi, cage], { az: lerp(.45, .4, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw();
      stamp(L("WHEEL INCLUDED!", "RAD INKLUSIVE!"), W * .42, H * .17, (lt - .2) / .3, "#ff9f43", -.06); }
    else { const k = (ph - .5) / .5; smallCageScene(t, 1, sm(clamp(k * 2.5, 0, 1)), {});
      frameOn([smallFrame()], { az: lerp(.25, .35, k), el: .08, fill: lerp(1.0, 1.1, k), t }); draw();
      if (k > .3) { spineLine(ham, "#e5484d", clamp((k - .3) * 4, 0, 1)); stamp(L("BANANA?", "BANANE?"), W * .42, H * .17, (k - .3) * d * .5 / .3, "#ffb800", .06); } } });
  // 2 Rudi quetscht sich selbst in ein Mini-Rad (krumm) – Schnitt: Rudi steht steif gebückt, hält den Rücken, Sterne
  KZ.shot("wRudi", (lt, d, t) => { inRoom(); const ph = lt / d;
    if (ph < .55) { const k = ph / .55, S = 2.1; wRudi.root.scale.set(S, S, 1.5); inWheel(wRudi, .3, 0, -.2, S); const fx = -.1, y = .62 * S - Math.sqrt((.55 * S) ** 2 - (fx - .3) ** 2); wRudi.spin.rotation.z = -t * 2.5;
      place(rudi, fx, -.2, 0); rudi.root.position.y = y; poseRudi(rudi, t, { arms: [.6, .9], spread: .15, walk: 1, mouth: "o", lean: -.5, nod: .55 }); rudi.noCheck = true;
      frameOn([FR(-.95, 0, -.75, 1.55, 2.65, .35)], { az: lerp(.3, .22, k), el: .08, fill: lerp(.95, 1.0, k), t }); draw();
      stamp(L("TOO SMALL!", "ZU KLEIN!"), W * .42, H * .17, (lt - .2) / .3, "#ff5d8f", -.06); }
    else { const k = (ph - .55) / .45; place(rudi, -.2, -.1, .5); poseRudi(rudi, t, { arms: [-.35, -.45], spread: .2, mouth: "o", lean: -.55, nod: .35, tilt: Math.sin(t * 9) * .05 });
      rStars.grp.visible = true; rStars.set(t);
      frameOn([rudi], { az: lerp(.55, .48, k), el: .1, fill: lerp(.82, .88, k), t }); draw();
      rudi.root.updateMatrixWorld(true); const [bx, by] = scr(rudi.body.localToWorld(V(-.3, 1.2, 0)));
      crackLines(bx, by, t, clamp(k * 5, 0, 1) * (Math.sin(t * 12) > -.3 ? 1 : .4));
      stamp(L("CRACK!", "KNACK!"), W * .42, H * .17, k * d * .45 / .25, "#e5484d", .07); } });
  // 3 Riesenrad: Rudi stolz daneben, Hamster unten drin rennt, Rad rührt sich nicht
  KZ.shot("wGiant", (lt, d, t) => { inRoom(); const ph = lt / d, S = 2.4;
    wGiant.root.scale.set(S, S, 1.3); const y = inWheel(wGiant, .5, 0, -.4, S); wGiant.spin.rotation.z = Math.sin(t * 20) * .004;
    const two = ph > .5;
    if (!two) { const k = ph / .5, rise = easeBack(clamp(ph / .22, 0, 1)); wGiant.root.scale.set(S, S * Math.max(.001, rise), 1.3);
      place(rudi, -1.5, .2, .35); poseRudi(rudi, t, { arms: [1.4, 1.4], spread: .8, mouth: "smile" });
      at(ham, .5, y, -.4, 0, t, { sc: .85, run: .4, up: .3, look: .2 }); ham.noCheck = true;
      frameOn([rudi, wGiant], { az: lerp(.4, .35, k), el: .12, fill: lerp(.95, 1.0, k), t }); draw();
      stamp("XXL!", W * .42, H * .17, (lt - .25) / .3, "#7a5cff", -.06); }
    else { const k = (ph - .5) / .5; at(ham, .5, y, -.4, 0, t, { sc: .85, run: 1, speed: 30, worry: true, sweat: true, o: true }); ham.noCheck = true;
      frameOn([ham, FR(.1, y, -.6, .9, y + .7, -.2)], { az: lerp(.35, .28, k), el: .12, fill: lerp(.7, .8, k), t }); draw();
      stamp(L("WON'T MOVE", "STECKT FEST"), W * .42, H * .17, (k * d * .5 - .1) / .3, "#e5484d", .06); } });
  // 4 Infografik: links Mini-Rad (Rücken krumm, rot), rechts großes Rad (Rücken gerade, grün)
  KZ.shot("wSpine", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    wSmall.root.scale.set(SW, SW, 1); const y1 = inWheel(wSmall, -.55, 0, 0, SW); wSmall.spin.rotation.z = -t * 6;
    const y2 = inWheel(wGood, .5, 0, 0, 1); wGood.spin.rotation.z = -t * 3.5;
    at(ham, -.55, y1, 0, 0, t, { sc: .85, run: 1, bend: 1, worry: true, sweat: true });
    const H2 = ham2; at(H2, .5, y2, 0, 0, t, { sc: .85, run: 1 }); ham.noCheck = true;
    frameOn([FR(-.9, 0, -.3, 1.05, 1.2, .3)], { az: lerp(.1, .04, k), el: .06, fill: lerp(1.0, 1.06, k), t }); draw();
    const a1 = clamp((ph - .15) * 4, 0, 1), a2 = clamp((ph - .35) * 4, 0, 1);
    spineLine(ham, "#ff4d4d", a1); spineLine(H2, "#ffe14d", a2);
    const [x1] = scr(V(-.55, 0, 0)), [x2] = scr(V(.5, 0, 0)); const [, yT] = scr(V(.5, 1.3, 0));
    txt(L("TOO SMALL", "ZU KLEIN"), x1, yT, 56, "#ff6b6b", { stroke: 12, a: a1, w: 900 }); txt(L("BIG ENOUGH", "GROSS GENUG"), x2, yT, 56, "#ffe14d", { stroke: 12, a: a2, w: 900 });
    if (ph > .55) stamp(L("PAIN", "SCHMERZEN"), W * .42, H * .62, (ph - .55) * d / .3, "#e5484d", -.06); });
  // 5 Lineal 0-30 cm vor dem großen Rad, Hamster läuft gerade + Quellenkarte
  KZ.shot("wSize", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    const y = inWheel(wGood, 0, 0, 0, 1); wGood.spin.rotation.z = -t * 3.5; at(ham, 0, y, 0, 0, t, { sc: .85, run: 1 });
    const rp = easeBack(clamp((ph - .1) / .25, 0, 1)); place(ruler, 0, .3, 0); ruler.root.position.y = .62; ruler.root.scale.set(Math.max(.001, rp), 1, 1);
    frameOn([FR(-.65, 0, -.3, .65, 1.25, .35)], { az: lerp(.12, .05, k), el: .06, fill: lerp(.78, .84, k), dy: -.08, t }); draw();
    stamp(L("30 CM+", "30 CM+"), W * .42, H * .17, (lt - .3) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .45) / .3); if (card(W * .42, H * .62, 900, 230, cp, L("PDSA (UK vet charity)", "TVT (Tierärzte für Tierschutz)"), "#2f6fd0")) {
      txt(L("Wheel: “At least 30cm (12″)", "Laufrad für Goldhamster:"), W * .42, H * .62 + 10, 38, "#1d2250", { a: clamp(cp, 0, 1) });
      txt(L("for Syrian Hamsters”", "mindestens 30 cm"), W * .42, H * .62 + 60, 38, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 6 Nacht: Mond + Sterne, Hamster rennt, Kilometerzähler zählt hoch
  KZ.shot("wNight", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    K3.scene.background = new T.Color(0x0b1030); K3.hemi.intensity = .35;
    const y = inWheel(wGood, 0, 0, 0, 1); wGood.spin.rotation.z = -t * 9; at(ham, 0, y, 0, 0, t, { sc: .85, run: 1, speed: 32, up: .1 });
    place(moon, -.9, -.6, 0); moon.root.position.y = 1.85;
    frameOn([FR(-.7, 0, -.3, .7, 1.3, .35), FR(-1.0, 1.6, -.6, -.8, 2.1, -.5)], { az: lerp(.2, .12, k), el: .1, fill: lerp(.9, .96, k), t }); draw();
    const km = Math.min(1, sm(clamp((ph - .1) / .7, 0, 1))); const val = L((km * 5).toFixed(1) + " mi", (km * 8).toFixed(1).replace(".", ",") + " km");
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "rgba(10,14,40,.85)"; g.beginPath(); g.roundRect(W * .42 - 230, H * .245, 460, 130, 26); g.fill(); g.strokeStyle = "#ffd23f"; g.lineWidth = 6; g.stroke(); g.restore();
    txt(val, W * .42, H * .245 + 68, 86, "#ffd23f", { w: 900 });
    stamp(L("ONE NIGHT", "EINE NACHT"), W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", -.06); });
  // 7 Wahltest: 23 cm vs. 35 cm, Hamster läuft ins große Rad – Schnitt: nur das kleine, Hamster läuft halb so viel
  KZ.shot("wChoice", (lt, d, t) => { studio(); const ph = lt / d, two = ph > .52;
    const sA = .72, sB = 1.1;
    if (!two) { const k = ph / .52; wA.root.scale.set(sA, sA, 1); const yA = inWheel(wA, -.8, 0, 0, sA); const yB = inWheel(wB, .55, 0, 0, sB);
      const go = sm(clamp((k - .25) / .55, 0, 1)); wB.spin.rotation.z = -Math.max(0, (k - .8)) * 20;
      at(ham, lerp(-.15, .55, go), lerp(0, yB, go), lerp(.6, 0, go), lerp(.2, 0, go), t, { sc: .85, run: go < 1 ? 1 : 1, up: .15 }); ham.noCheck = true;
      frameOn([FR(-1.25, 0, -.35, 1.2, 1.4, .7)], { az: lerp(.14, .08, k), el: .12, fill: lerp(.9, .96, k), t }); draw();
      const [xa] = scr(V(-.8, 0, 0)), [xb] = scr(V(.55, 0, 0)); txt("23 cm", xa, H * .26, 60, "#ffb36b", { stroke: 10, w: 900 }); txt("35 cm", xb, H * .26, 60, "#5be39b", { stroke: 10, w: 900 });
      if (k > .7) stamp(L("BIGGER!", "GRÖSSER!"), W * .42, H * .62, (k - .7) * d * .52 / .3, "#36b37e", -.06); }
    else { const k = (ph - .52) / .48; wA.root.scale.set(sA, sA, 1); const yA = inWheel(wA, 0, 0, 0, sA); wA.spin.rotation.z = -t * 2;
      at(ham, 0, yA, 0, 0, t, { sc: .85, run: .5, speed: 11, bend: .45, lid: .45 }); ham.noCheck = true;
      frameOn([FR(-.5, 0, -.3, .5, 1.0, .35)], { az: lerp(.2, .14, k), el: .08, fill: lerp(.8, .86, k), t }); draw();
      txt("23 cm", W * .42, H * .26, 60, "#ffb36b", { stroke: 10, w: 900 });
      stamp(L("HALF AS MUCH", "HALB SO VIEL"), W * .42, H * .62, (k * d * .48 - .1) / .3, "#e5484d", .06);
      txt(L("Univ. of Moncton, 2005", "Uni Moncton, 2005"), W * .42, H * .69, 36, "#ffffff", { stroke: 8, a: clamp(k * 3, 0, 1) }); } });
  // 8 Pointe: Rudi steif gebückt, hält ein Lineal, Hamster im guten Rad im Käfig
  KZ.shot("wPunch", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(bigCage, .35, -.5, 0); const F = bigCage.floor; const y = inWheel(wGood, .8, F - .02, -.55, 1); wGood.spin.rotation.z = -t * 3.5;
    at(ham, .8, y, -.55, 0, t, { sc: .85, run: 1 }); ham.noCheck = true;
    place(rudi, -2.15, .25, .55); poseRudi(rudi, t, { arms: [-.3, 1.3], spread: .15, mouth: "o", lean: -.3, nod: .2 });
    const hp = hand(1); place(handRuler, 0, 0, 0); handRuler.root.position.set(hp.x + .1, hp.y + .1, hp.z + .05); handRuler.root.rotation.set(0, .35, PI / 2 - .25); handRuler.root.scale.setScalar(.8);
    rStars.grp.visible = ph < .5; rStars.set(t);
    frameOn([rudi, bigCage], { az: lerp(.42, .36, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw();
    stamp(L("RULER!", "LINEAL!"), W * .42, H * .17, (lt - d * .45) / .3, "#ffb800", -.06); });
  // 9 Tipp: großer Käfig mit tiefer Einstreu und geschlossenem 30-cm-Rad, Hamster rennt mit geradem Rücken
  KZ.shot("wTip", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(bigCage, .35, -.5, 0); const F = bigCage.floor; const y = inWheel(wGood, .8, F - .02, -.55, 1); wGood.spin.rotation.z = -t * 3.5;
    at(ham, .8, y, -.55, 0, t, { sc: .85, run: 1 }); ham.noCheck = true;
    frameOn([FR(.15, F, -.85, 1.45, F + 1.2, -.25)], { az: lerp(.2, .12, k), el: .1, fill: lerp(.9, .98, k), t }); draw();
    spineLine(ham, "#ffe14d", clamp((ph - .4) * 4, 0, 1));
    stamp(L("SOLID · 30 CM+", "GESCHLOSSEN"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06);
    if (ph > .55) stamp(L("STRAIGHT BACK", "RÜCKEN GERADE"), W * .42, H * .62, (ph - .55) * d / .3, "#2f6fd0", .06); });
  // 10 Loop: Hook-Einstellung, Hamster steht vor dem Mini-Rad und will gleich rein
  KZ.shot("wLoop", (lt, d, t) => { inRoom(); const ph = lt / d; smallCageScene(t, 0, 0, { outside: true, hx: CX - .02, hz: CZ + .2, look: -.2 + Math.sin(t * 2) * .1, ry: -.25 });
    frameOn([smallFrame(), FR(CX - .3, cage.floor, CZ, CX + .1, cage.floor + .4, CZ + .35)], { az: lerp(.42, .38, ph), el: .1, fill: lerp(.92, .95, ph), t }); draw();
    if (ph > .3) stamp(L("TONIGHT?", "HEUTE NACHT?"), W * .42, H * .62, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__hamsterWheel = true;
})();
