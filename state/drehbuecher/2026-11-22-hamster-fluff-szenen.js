// 3D-Szene "Why Fluffy Hamster Bedding Is A Trap" / "Warum Hamsterwatte eine Falle ist" (22.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Opener-Stil "wetterbericht": Wetterkarte "100 % Schnee" über Rudis Hamsterkäfig. Goldhamster aus dem Laufrad-Video (2026-11-21) übernommen,
// dazu Watte-Haufen (wächst), fallende Watte-Flocken, Faden ums Hinterbein, Kuschelwatte-Tüte ("hamstersicher!"), Schneekanone, Riesen-Bein mit
// Faden (Infografik Durchblutung), Röntgen-Bauch (2D), Schneekugel über dem Käfig, Klopapierrolle + Heu als Tipp.
// Quellen: RSPCA (Hamster environment: "Don't use nesting materials that can separate into thin strands such as cotton wool or similar 'fluffy'
// bedding products ... tangled ... loss of circulation in tangled limbs resulting in amputation"), PDSA ("Cotton wool, kapok, bamboo fluff ...
// often marketed as safe for hamsters but can get wrapped around their legs and cause life-threatening gut blockages if eaten"; Klopapier
// unparfümiert, Heu, mind. 25 cm Einstreu), Woodgreen (Backentaschen-Vorfall, Darmverschluss).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let ham, rudi, room, roomBg, cage, bigCage, pile, bigPile, flakes, bag, cannon, stream, leg, globe, roll, hay, strip, legThread, mouthFluff, rudiFluff;
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

  // ---------- Watte ----------
  const fluffM = () => M(0xf8f9ff, { roughness: 1 });
  // Watte-Wolke: Kugel-Haufen (Mitte 0,0,0, Größe ~r)
  function cloud(mat, r, n, seed) { const gq = new T.Group(); for (let i = 0; i < n; i++) { const a = (i + seed) * 2.39, rr = r * (.25 + ((i * 53 + seed * 17) % 100) / 140);
      const s = sph(mat, Math.cos(a) * rr * .8, Math.sin(i * 1.3 + seed) * r * .35, Math.sin(a) * rr * .8, r * (.45 + (i % 3) * .12)); s.castShadow = i % 2 === 0; gq.add(s); } return gq; }
  // Watte-Haufen im Käfig: Höhe 1 Einheit = .16, wird mit root.scale.y "gefüllt"
  function makePile(Wd, Dp) { const root = new T.Group(), mat = fluffM();
    for (let i = 0; i < 46; i++) { const fx = ((i * 37) % 100) / 100 - .5, fz = ((i * 61) % 100) / 100 - .5; const x = fx * (Wd - .16), z = fz * (Dp - .14);
      const h = .1 * (1 - Math.min(1, (fx * fx + fz * fz) * 1.6)) + .04; const c = cloud(mat, .07 + (i % 4) * .015, 4, i); c.position.set(x, h, z); root.add(c); }
    return { root }; }
  // Watteberg (Kuppel, wächst gleichmäßig vom Boden)
  function makeMound() { const root = new T.Group(), mat = fluffM();
    for (let i = 0; i < 90; i++) { const u = ((i * 37) % 100) / 100, v = ((i * 61) % 100) / 100, a = u * 2 * PI, r = Math.sqrt(v);
      const x = Math.cos(a) * r * .72, z = Math.sin(a) * r * .5, y = Math.sqrt(Math.max(0, 1 - r * r)) * .75 * ((i % 3) * .1 + .9);
      const c = cloud(mat, .1 + (i % 4) * .02, 4, i); c.position.set(x, y, z); root.add(c); }
    return { root }; }
  // fallende Flocken (Pool), set(t, x0, x1, z0, z1, yTop, yBot)
  function makeFlakes(n) { const root = new T.Group(), mat = fluffM(), list = [];
    for (let i = 0; i < n; i++) { const c = cloud(mat, .035 + (i % 3) * .01, 3, i); c.traverse((m) => { m.castShadow = false; }); root.add(c); list.push(c); }
    return { root, set(t, x0, x1, z0, z1, y0, y1) { list.forEach((c, i) => { const q = ((t * (.18 + (i % 5) * .03) + i * .137) % 1); c.position.set(lerp(x0, x1, ((i * 41) % 100) / 100) + Math.sin(t * 1.3 + i) * .04, lerp(y0, y1, q), lerp(z0, z1, ((i * 67) % 100) / 100)); c.rotation.y = t + i; }); } }; }
  // Faden ums Hinterbein (an ham.legs[3]) + loses Ende
  function makeLegThread(Hm) { const gq = new T.Group(), mat = M(0xbfd0ff, { roughness: .5 });
    for (let k = 0; k < 2; k++) { const r = mesh(new T.TorusGeometry(.034, .011, 6, 18), mat, 0, -.035 - k * .02, 0); r.rotation.x = PI / 2 + (k ? .25 : -.2); gq.add(r); }
    const cur = new T.CatmullRomCurve3([V(.02, -.04, .03), V(.07, -.07, .09), V(.03, -.1, .17), V(.1, -.12, .24)]);
    gq.add(new T.Mesh(new T.TubeGeometry(cur, 20, .009, 5), mat)); gq.traverse((m) => { m.castShadow = false; }); Hm.legs[3].add(gq); gq.visible = false; return gq; }
  // ---------- Kuschelwatte-Tüte ----------
  function makeBag() { const root = new T.Group(); const tex = canvasTex(512, 640, (c, w, h) => { c.fillStyle = "#ff8fb8"; c.fillRect(0, 0, w, h);
      c.fillStyle = "#fff"; for (let i = 0; i < 12; i++) { c.beginPath(); c.arc((i * 97) % w, (i * 151) % h, 26, 0, 7); c.fill(); }
      c.fillStyle = "#7a2a5a"; c.font = '900 92px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(L("FLUFFY", "KUSCHEL"), w / 2, 120); c.fillText(L("BEDDING", "WATTE"), w / 2, 220);
      c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(w / 2, 430, 150, 0, 7); c.fill(); c.strokeStyle = "#e5484d"; c.lineWidth = 12; c.stroke();
      c.fillStyle = "#1d2250"; c.font = '900 52px "Montserrat"'; c.fillText(L("HAMSTER", "HAMSTER-"), w / 2, 400); c.fillText(L("SAFE!", "SICHER!"), w / 2, 465); });
    const p = M(0xf27aa8, { roughness: .5 }); const face = new T.MeshStandardMaterial({ map: tex, roughness: .5 });
    const b = new T.Mesh(new T.BoxGeometry(.32, .62, .5), [p, p, p, p, face, p]); b.position.y = .31; b.castShadow = true; root.add(b);
    const top = cloud(fluffM(), .12, 6, 3); top.position.set(0, .66, 0); root.add(top);
    return { root }; }
  // ---------- Schneekanone (Rohr entlang +x) ----------
  function makeCannon() { const root = new T.Group(); const bl = M(0x2f6fd0, { roughness: .35, metalness: .3 }), rd = M(0xe5484d, { roughness: .4 }), gr = M(0x9aa3ad, { metalness: .6, roughness: .3 });
    const barrel = mesh(new T.CylinderGeometry(.13, .1, .9, 24), bl, .35, 0, 0); barrel.rotation.z = -PI / 2; root.add(barrel);
    const mouth = mesh(new T.TorusGeometry(.13, .035, 10, 24), rd, .8, 0, 0); mouth.rotation.y = PI / 2; root.add(mouth);
    root.add(mesh(new T.CylinderGeometry(.16, .16, .32, 20), rd, -.18, -.02, 0)); root.add(sph(gr, -.18, .2, 0, .06));
    const tex = canvasTex(256, 64, (c, w, h) => { c.fillStyle = "#fff"; c.fillRect(0, 0, w, h); c.fillStyle = "#2f6fd0"; c.font = '900 40px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SNOW 3000", w / 2, h / 2); });
    const lab = new T.Mesh(new T.PlaneGeometry(.5, .12), new T.MeshStandardMaterial({ map: tex, roughness: .5 })); lab.position.set(.35, .02, .125); root.add(lab);
    return { root }; }
  function makeStream(n) { const root = new T.Group(), mat = fluffM(), list = []; for (let i = 0; i < n; i++) { const c = cloud(mat, .05 + (i % 3) * .012, 3, i); c.traverse((m) => { m.castShadow = false; }); root.add(c); list.push(c); }
    return { root, set(t, a, b) { list.forEach((c, i) => { const q = (t * 1.6 + i / n) % 1; const p = a.clone().lerp(b, q); p.y += Math.sin(q * PI) * .35 + Math.sin(i * 3.1) * .05; p.z += Math.sin(i * 1.7) * .08 * q; c.position.copy(p); c.scale.setScalar(.6 + q * .8); }); } }; }
  // ---------- Riesen-Hamsterbein mit Faden (Infografik) ----------
  function makeLeg() { const root = new T.Group(); const pinkA = new T.Color(0xffa3b1).convertSRGBToLinear(), pinkB = new T.Color(0xb86aa8).convertSRGBToLinear();
    const skin = new T.MeshStandardMaterial({ color: pinkA.clone(), roughness: .5 }), fur = M(0xe9a25a, { roughness: .8 }), cream = M(0xfff1dc, { roughness: .85 });
    root.add(sph(fur, -.35, 1.15, 0, .95, .42, .55)); root.add(sph(cream, -.25, .9, 0, .75, .2, .45)); { const hd = sph(fur, .75, 1.22, 0, .42, .38, .4); root.add(hd); root.add(sph(cream, .95, 1.1, .12, .2, .16, .22)); root.add(sph(M(0xffa3b1, { roughness: .5 }), 1.16, 1.16, .05, .05, .04, .05));
      root.add(sph(M(0x120c10, { roughness: .08 }), 1.0, 1.32, .25, .09, .1, .09)); root.add(sph(M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), 1.05, 1.36, .32, .025));
      root.add(sph(fur, .6, 1.58, .2, .12, .14, .05)); root.add(sph(M(0xffa3b1, { roughness: .5 }), .61, 1.58, .23, .08, .1, .03)); }
    root.add(mesh(new T.CylinderGeometry(.2, .18, .72, 24), skin, 0, .5, 0));
    root.add(sph(skin, .14, .12, 0, .3, .11, .2)); for (let i = 0; i < 4; i++) { root.add(sph(skin, .4, .09, (i - 1.5) * .1, .07, .06, .055)); root.add(sph(M(0xfff6ea, { roughness: .4 }), .47, .07, (i - 1.5) * .1, .03, .02, .02)); }
    root.add(mesh(new T.CylinderGeometry(.18, .16, .72, 24), skin, .55, .5, -.25)); root.add(sph(skin, .69, .12, -.25, .28, .1, .18));
    for (let i = 0; i < 4; i++) root.add(sph(skin, .93, .09, -.25 + (i - 1.5) * .09, .065, .055, .05));
    const th = M(0xffffff, { roughness: .6 }); const pts = []; for (let i = 0; i <= 60; i++) { const a = i / 60 * 3 * 2 * PI; pts.push(V(Math.cos(a) * .215, .5 + i / 60 * .16 - .08, Math.sin(a) * .215)); }
    root.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 160, .022, 6), th));
    const loose = new T.CatmullRomCurve3([V(.21, .58, .04), V(.42, .66, .2), V(.55, .48, .35), V(.8, .55, .3)]); root.add(new T.Mesh(new T.TubeGeometry(loose, 30, .02, 6), th));
    return { root, setBlue(k) { skin.color.copy(pinkA).lerp(pinkB, k); } }; }
  // ---------- Schneekugel über dem kleinen Käfig ----------
  function makeGlobe() { const root = new T.Group();
    const gl = new T.Mesh(new T.SphereGeometry(1, 40, 28), new T.MeshStandardMaterial({ color: 0xdff4ff, transparent: true, opacity: .32, roughness: .05, metalness: .1, depthWrite: false })); gl.position.y = .45; gl.scale.set(.95, .85, .7); root.add(gl);
    const hl = mesh(new T.TorusGeometry(.5, .02, 6, 30, 1.2), M(0xffffff, { emissive: 0xffffff, emissiveIntensity: .8 }), -.25, .95, .45); hl.rotation.set(0, 0, 1.9); hl.castShadow = false; root.add(hl);
    const base = mesh(new T.CylinderGeometry(1.0, 1.1, .2, 40), M(0x8a5a3a, { roughness: .5 }), 0, .1, 0); base.scale.set(1, 1, .75); root.add(base);
    const ring = mesh(new T.TorusGeometry(1.02, .04, 8, 40), M(0xffd23f, { metalness: .5, roughness: .3 }), 0, .2, 0); ring.rotation.x = PI / 2; ring.scale.set(1, .75, 1); root.add(ring);
    return { root }; }
  // ---------- Klopapierrolle, Heu, Papierstreifen ----------
  function makeRoll() { const root = new T.Group(); const w = M(0xffffff, { roughness: .9 });
    const r = mesh(new T.CylinderGeometry(.11, .11, .2, 28), w, 0, .11, 0); r.rotation.x = PI / 2; root.add(r);
    const core = mesh(new T.CylinderGeometry(.045, .045, .205, 20), M(0xb07a45, { roughness: .8 }), 0, .11, 0); core.rotation.x = PI / 2; root.add(core);
    root.add(mesh(BOX, w, .2, .005, .0, .3, .008, .19)); return { root }; }
  function makeHay() { const root = new T.Group(); const ms = [M(0xe8c35a, { roughness: .9 }), M(0xd4a843, { roughness: .9 }), M(0xc9b25a, { roughness: .9 })];
    for (let i = 0; i < 70; i++) { const a = i * 2.39, r = (i % 7) / 7 * .22; const s = mesh(CYL, ms[i % 3], Math.cos(a) * r, .03 + (i % 5) * .025 * (1 - r * 3), Math.sin(a) * r, .007, .26, .007); s.rotation.set(Math.sin(i) * 1.4 + PI / 2, a, Math.cos(i * 1.7) * .6); s.castShadow = i % 3 === 0; root.add(s); }
    return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; ham = actor(makeHamster(0xe9a25a, 0xc9803c), "Hamster");
    cage = actor(makeCage(1.25, .8, .62, false), "Kaefig"); bigCage = actor(makeCage(2.3, 1.15, 1.2, true, 0x36b37e), "Kaefig gross");
    pile = actor(makePile(1.25, .8), "Watte"); bigPile = actor(makeMound(), "Watteberg"); flakes = actor(makeFlakes(46), "Flocken"); stream = actor(makeStream(16), "Strahl");
    bag = actor(makeBag(), "Tuete"); cannon = actor(makeCannon(), "Kanone"); leg = actor(makeLeg(), "Bein"); globe = actor(makeGlobe(), "Schneekugel");
    roll = actor(makeRoll(), "Klopapier"); hay = actor(makeHay(), "Heu"); strip = actor({ root: mesh(BOX, M(0xffffff, { roughness: .9 }), 0, 0, 0, .16, .006, .05) }, "Streifen");
    for (const a of [cage, bigCage, pile, bigPile, flakes, stream, bag, cannon, globe, roll, hay, strip]) a.noCheck = true;
    legThread = makeLegThread(ham); mouthFluff = cloud(fluffM(), .035, 4, 7); mouthFluff.position.set(.2, -.07, 0); ham.head.add(mouthFluff);
    rudiFluff = new T.Group(); for (const [x, y, z, r] of [[0, 1.45, .22, .1], [0, 1.47, -.24, .09], [.05, 1.4, 0, .08]]) { const c = cloud(fluffM(), r, 4, x * 10 + z * 10); c.position.set(x, y, z); rudiFluff.add(c); }
    { const c = cloud(fluffM(), .1, 5, 5); c.position.set(-.05, .52, 0); rudi.head.add(c); rudiFluff.hatC = c; } rudi.body.add(rudiFluff);
    room = makeRoomW(); roomBg = new T.Color(0xdff0e6).convertSRGBToLinear();
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { ham.noCheck = false; rudi.noCheck = false; ham.root.rotation.set(0, 0, 0); legThread.visible = false; mouthFluff.visible = false; rudiFluff.visible = false; rudiFluff.hatC.visible = false;
    pile.root.scale.set(1, 1, 1); bigPile.root.scale.set(1, 1, 1); }
  function inRoom() { begin("yard"); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xe3f1fb, 16, 40); K3.hemi.intensity = .8; reset(); }
  function studio() { begin("studio"); room.visible = false; reset(); }
  function hand(i) { rudi.root.updateMatrixWorld(true); return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function flake2d(x, y, r, a, col) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.strokeStyle = col || "#fff"; g.lineWidth = r * .16; g.lineCap = "round"; g.translate(x, y);
    for (let i = 0; i < 6; i++) { g.rotate(PI / 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -r); g.moveTo(0, -r * .55); g.lineTo(-r * .25, -r * .78); g.moveTo(0, -r * .55); g.lineTo(r * .25, -r * .78); g.stroke(); } g.restore(); }

  const CX = .2, CZ = -.3; // Käfig-Mitte im Zimmer
  const PH = .16; // Haufenhöhe pro Füllung
  // kleiner Käfig mit Watte-Haufen (fill = Höhe), Hamster sitzt obendrauf
  function cageScene(t, fill, o) { o = o || {}; place(cage, CX, CZ, 0); const F = cage.floor;
    place(pile, CX, CZ, 0); pile.root.position.y = F - .02; pile.root.scale.y = Math.max(.02, fill); pile.root.visible = fill > .01;
    const hy = F + (fill > .01 ? PH * fill : 0);
    at(ham, o.hx ?? CX + .05, hy - .01 + (o.hy || 0), o.hz ?? CZ + .08, o.ry ?? .35, t, { sc: o.sc || .85, look: o.look || 0, up: o.up ?? .1, puff: o.puff || 0, worry: o.worry, sweat: o.sweat, o: o.o, lid: o.lid });
    legThread.visible = !!o.thread; mouthFluff.visible = !!o.mouth; ham.noCheck = true; return F; }
  const cageFrame = () => FR(CX - .65, cage.floor - .2, CZ - .42, CX + .65, cage.floor + .65, CZ + .42);
  const hamFrame = (r) => { ham.root.updateMatrixWorld(true); const p = ham.root.position; r = r || .32; return FR(p.x - r, p.y, p.z - r, p.x + r, p.y + r * 1.25, p.z + r); };

  // ---------- Shots ----------
  // 0 Hook: Watte "schneit" in den Käfig, Hamster sitzt auf dem Haufen, Faden am Bein
  KZ.shot("fHook", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph); cageScene(t, 1, { thread: true, look: -.25, up: .2, hy: .05 });
    place(flakes, 0, 0, 0); flakes.set(t, CX - .55, CX + .55, CZ - .35, CZ + .35, cage.floor + 1.0, cage.floor + .1);
    frameOn([hamFrame(.34), FR(CX - .3, cage.floor, CZ - .2, CX + .4, cage.floor + .5, CZ + .3)], { az: lerp(.5, .38, k), el: .16, fill: lerp(.86, .98, k), t }); draw();
    if (ph > .45) stamp(L("TRAP?", "FALLE?"), W * .42, H * .62, (ph - .45) * d / .3, "#e5484d", -.06); });
  // 1 Wetterbericht: Rudi als Wettermann zeigt auf den Käfig, Watte schneit, Wetter-Banner 100 %
  KZ.shot("fWeather", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph); cageScene(t, lerp(.4, .7, k), { look: .4, up: .35 });
    place(flakes, 0, 0, 0); flakes.set(t, CX - .6, CX + .6, CZ - .38, CZ + .38, cage.floor + 1.1, cage.floor + .1);
    place(rudi, CX - .95, CZ - .8, -.35); poseRudi(rudi, t, { arms: [1.35 + Math.sin(t * 3) * .05, -.15], spread: .1, mouth: Math.sin(t * 7) > 0 ? "o" : "smile", nod: .05 });
    frameOn([rudi, cage], { az: lerp(.3, .24, k), el: .12, fill: lerp(.95, 1.0, k), t }); draw();
    const a = clamp(lt / .35, 0, 1), x = W * .42, y = H * .165; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a;
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(x - 350 + 8, y - 85 + 10, 700, 170, 28); g.fill();
    const gr = g.createLinearGradient(0, y - 85, 0, y + 85); gr.addColorStop(0, "#2f6fd0"); gr.addColorStop(1, "#1d3f8f"); g.fillStyle = gr; g.beginPath(); g.roundRect(x - 350, y - 85, 700, 170, 28); g.fill();
    g.fillStyle = "#ffd23f"; g.beginPath(); g.roundRect(x - 350, y - 85, 700, 52, [28, 28, 0, 0]); g.fill(); g.restore();
    txt(L("WEATHER · HAMSTER CAGE", "WETTER · HAMSTERKÄFIG"), x, y - 58, 34, "#1d2250", { a, w: 900 });
    flake2d(x - 235, y + 28, 42, a); txt(L("100% SNOW", "100% SCHNEE"), x + 70, y + 30, 58, "#ffffff", { a, w: 900 });
    if (ph > .62) stamp(L("SNOW?!", "SCHNEE?!"), W * .42, H * .62, (ph - .62) * d / .3, "#7a5cff", .06); });
  // 2 Rudi kippt die Kuschelwatte in den Käfig – Schnitt: Hamster stopft sich die Backen voll
  KZ.shot("fCheeks", (lt, d, t) => { inRoom(); const ph = lt / d;
    if (ph < .5) { const k = ph / .5; cageScene(t, lerp(.15, .9, sm(k)), { look: .5, up: .4, o: true });
      place(rudi, CX - 1.1, CZ - .55, -.15); poseRudi(rudi, t, { arms: [1.55, 1.55], spread: .02, mouth: "smile", lean: -.12 });
      const hp = hand(0).add(hand(1)).multiplyScalar(.5); place(bag, 0, 0, 0); bag.root.position.set(hp.x + .12, hp.y - .25, hp.z); bag.root.rotation.set(0, 0, -1.1 - Math.sin(t * 6) * .08);
      place(stream, 0, 0, 0); stream.set(t * .6, V(hp.x + .55, hp.y + .1, hp.z), V(CX, cage.floor + .15, CZ));
      frameOn([rudi, cage], { az: lerp(.32, .26, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw();
      stamp(L("SO COZY!", "SO KUSCHELIG!"), W * .42, H * .17, (lt - .2) / .3, "#ff8fb8", -.06); }
    else { const k = (ph - .5) / .5, pf = sm(clamp(k * 1.6, 0, 1)) * 2.4; cageScene(t, 1, { puff: pf, mouth: true, look: -.5, up: .15, ry: .2 });
      frameOn([hamFrame(.3)], { az: lerp(.75, .85, k), el: .12, fill: lerp(.9, 1.0, k), t }); draw();
      stamp(L("STUFFED!", "VOLLGESTOPFT!"), W * .42, H * .17, (k * d * .5 - .2) / .3, "#ffb800", .06); } });
  // 3 Faden am Bein (Nahaufnahme) – Schnitt: Rudi mit Schneekanone, Watteberg, nur der Hamsterkopf schaut raus
  KZ.shot("fCannon", (lt, d, t) => { inRoom(); const ph = lt / d;
    if (ph < .45) { const k = ph / .45; cageScene(t, .9, { thread: true, sweat: true, o: true, look: .25, up: -.05, ry: .25, hy: .07 });
      frameOn([hamFrame(.28)], { az: lerp(.55, .45, k), el: .2, fill: lerp(.95, 1.05, k), t }); draw();
      stamp(L("TANGLED!", "VERHEDDERT!"), W * .42, H * .17, (lt - .25) / .3, "#e5484d", -.06); }
    else { const k = (ph - .45) / .55, F = cage.floor; place(cage, CX, CZ, 0); const gr = lerp(.35, 1.05, sm(k));
      place(bigPile, CX, CZ, 0); bigPile.root.position.y = F - .02; bigPile.root.scale.setScalar(gr); pile.root.visible = false;
      at(ham, CX + .05, F + .75 * gr - .12, CZ + .08, .5, t, { sc: .85, worry: true, o: true, up: .35, look: .3 }); ham.noCheck = true;
      place(rudi, CX - 1.25, CZ - .75, -.25); poseRudi(rudi, t, { arms: [.85, .85], spread: .1, mouth: "smile", lean: .05, nod: .05 });
      const hp = hand(0).add(hand(1)).multiplyScalar(.5); place(cannon, 0, 0, 0); cannon.root.position.set(hp.x - .05, hp.y + .05, hp.z); cannon.root.rotation.set(0, 0, .28 + Math.sin(t * 20) * .02);
      cannon.root.updateMatrixWorld(true); const mz = cannon.root.localToWorld(V(.85, 0, 0)); place(stream, 0, 0, 0); stream.set(t, mz, V(CX, F + .6 * gr, CZ));
      frameOn([rudi, cage, FR(CX - .6, F, CZ - .4, CX + .6, F + .8, CZ + .4)], { az: lerp(.3, .24, k), el: .12, fill: lerp(.94, 1.0, k), t }); draw();
      stamp(L("MORE FLUFF!", "MEHR WATTE!"), W * .42, H * .17, (k * d * .55 - .15) / .3, "#2f6fd0", .06); } });
  // 4 Infografik: Riesen-Bein, Faden schnürt ab, Blut-Pfeile stoppen
  KZ.shot("fLeg", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph); place(leg, 0, 0, 0); leg.root.rotation.y = -.15 + Math.sin(t * .8) * .04; leg.setBlue(clamp((ph - .45) * 2, 0, .8));
    frameOn([FR(-1.3, 0, -.5, 1.25, 1.7, .5)], { az: lerp(.12, .04, k), el: .08, fill: lerp(.86, .9, k), t }); draw();
    leg.root.updateMatrixWorld(true); const [x0, y0] = scr(leg.root.localToWorld(V(0, .9, 0))), [, y1] = scr(leg.root.localToWorld(V(0, .6, 0))), [, y2] = scr(leg.root.localToWorld(V(0, .18, 0)));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const xa = x0 - 200;
    for (let i = 0; i < 4; i++) { const q = (t * .9 + i / 4) % 1, yy = lerp(y0, y1 - 10, q); g.fillStyle = "#e5484d"; g.beginPath(); g.moveTo(xa - 30, yy - 36); g.lineTo(xa + 30, yy - 36); g.lineTo(xa, yy + 16); g.closePath(); g.fill(); }
    const xA = clamp((ph - .4) * 4, 0, 1); g.globalAlpha = xA; g.strokeStyle = "#e5484d"; g.lineWidth = 16; g.lineCap = "round";
    const yx = lerp(y1, y2, .45); g.beginPath(); g.moveTo(xa - 34, yx - 34); g.lineTo(xa + 34, yx + 34); g.moveTo(xa + 34, yx - 34); g.lineTo(xa - 34, yx + 34); g.stroke(); g.restore();
    txt(L("BLOOD", "BLUT"), xa, y0 - 70, 52, "#ff6b6b", { stroke: 10, w: 900 });
    if (ph > .55) stamp(L("CUT OFF", "ABGESCHNÜRT"), W * .42, H * .62, (ph - .55) * d / .3, "#e5484d", -.06);
    else stamp(L("BARELY TEARS", "REISST KAUM"), W * .42, H * .17, (lt - .15) / .3, "#2f6fd0", -.06); });
  // 5 Quellenkarte RSPCA, Hamster traurig mit Faden am Bein
  KZ.shot("fAmp", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(ham, 0, 0, 0, -.5, t, { sc: 1.1, worry: true, look: -.2, up: .05, lid: .25 }); legThread.visible = true;
    frameOn([hamFrame(.4)], { az: lerp(.35, .25, k), el: .12, fill: lerp(.66, .72, k), dy: -.2, t }); draw();
    stamp("AMPUTATION", W * .42, H * .17, (lt - .9) / .3, "#e5484d", -.05);
    const cp = sm((lt - .15) / .35); if (card(W * .42, H * .57, 900, 240, cp, L("RSPCA (UK animal welfare)", "RSPCA (Tierschutz, UK)"), "#e5484d")) {
      txt(L("Tangled limbs can lose", "Verhedderte Beinchen:"), W * .42, H * .57 + 10, 40, "#1d2250", { a: clamp(cp, 0, 1) });
      txt(L("circulation → amputation", "keine Durchblutung → Amputation"), W * .42, H * .57 + 62, 40, "#1d2250", { a: clamp(cp, 0, 1), w: 900 }); } });
  // 6 Röntgen: Watteknäuel verstopft den Darm
  KZ.shot("fGut", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(ham, 0, 0, 0, 0, t, { sc: 1.25, worry: ph > .5, look: .1, o: ph > .5 });
    frameOn([hamFrame(.45)], { az: lerp(.05, 0, k), el: .06, fill: lerp(.72, .75, k), t }); draw();
    ham.root.updateMatrixWorld(true); const [bx, by] = scr(ham.body.localToWorld(V(-.02, .2, 0))); const a = clamp((ph - .1) * 4, 0, 1), R = 150;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(8,22,60,.9)"; g.beginPath(); g.arc(bx, by, R, 0, 7); g.fill(); g.strokeStyle = "#7fdcff"; g.lineWidth = 10; g.stroke();
    g.beginPath(); g.arc(bx, by, R - 5, 0, 7); g.clip(); g.strokeStyle = "#ff8fb8"; g.lineWidth = 26; g.lineCap = "round"; g.beginPath();
    for (let i = 0; i <= 60; i++) { const q = i / 60, xx = bx - 130 + q * 260, yy = by - 45 + Math.sin(q * 3 * PI) * 52 + q * 45; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke();
    const pl = clamp((ph - .3) * 3, 0, 1); g.fillStyle = "#ffffff"; for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(bx + 10 + Math.cos(i * 2.4) * 34 * pl, by + 10 + Math.sin(i * 1.9) * 24 * pl, 30 * pl, 0, 7); g.fill(); }
    g.restore(); txt(L("X-RAY", "RÖNTGEN"), bx, by - R - 34, 40, "#7fdcff", { stroke: 10, a, w: 900 });
    if (ph > .5) stamp(L("BLOCKED!", "VERSTOPFT!"), W * .42, H * .17, (ph - .5) * d / .3, "#e5484d", -.06);
    txt(L("Source: PDSA", "Quelle: PDSA (UK)"), W * .42, H * .64, 36, "#ffffff", { stroke: 8, a: clamp((ph - .4) * 4, 0, 1) }); });
  // 7 Tüte "hamstersicher!" – Stempel "WIRKLICH?"
  KZ.shot("fBag", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(bag, -.3, 0, .55 + Math.sin(t * 1.2) * .05); bag.root.scale.setScalar(1.5); bag.root.rotation.set(0, .55 + Math.sin(t * 1.2) * .05, 0);
    at(ham, .55, 0, .15, -.9, t, { sc: 1.05, look: -.6, up: .2, worry: ph > .55, o: ph > .55 });
    frameOn([bag, ham], { az: lerp(.2, .12, k), el: .08, fill: lerp(.82, .9, k), t }); draw();
    if (ph > .5) stamp(L("REALLY?!", "WIRKLICH?!"), W * .42, H * .17, (ph - .5) * d / .3, "#e5484d", .07);
    const cp = sm((lt - d * .35) / .3); if (card(W * .42, H * .62, 880, 200, cp, "PDSA", "#2f6fd0")) txt(L("“often marketed as safe”", "„oft als sicher verkauft“"), W * .42, H * .62 + 30, 42, "#1d2250", { a: clamp(cp, 0, 1), w: 800 }); });
  // 8 Pointe: Schneekugel über dem Käfig, Rudi voller Watte daneben
  KZ.shot("fPunch", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph); cageScene(t, 1.4, { look: .5, up: .3, lid: .4 });
    place(globe, CX, CZ, 0); globe.root.position.y = -.02; place(flakes, 0, 0, 0); flakes.set(t * .7, CX - .55, CX + .55, CZ - .3, CZ + .3, cage.floor + .95, cage.floor + .15);
    place(rudi, CX - 1.05, CZ - 1.0, -.35); poseRudi(rudi, t, { arms: [.35, -.25], spread: .25, mouth: "o", nod: .12, tilt: Math.sin(t * 2) * .05 }); rudiFluff.visible = true; rudiFluff.hatC.visible = true;
    frameOn([rudi, globe], { az: lerp(.3, .24, k), el: .12, fill: lerp(1.05, 1.1, k), t }); draw();
    stamp(L("SNOW GLOBE", "SCHNEEKUGEL"), W * .42, H * .17, (lt - d * .4) / .3, "#7a5cff", -.06); });
  // 9 Tipp: großer Käfig, tiefe Einstreu, Klopapier + Heu, Hamster trägt einen Streifen
  KZ.shot("fTip", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(bigCage, .35, -.5, 0); const F = bigCage.floor; place(roll, .95, -.3, -.4); roll.root.position.y = F - .01; place(hay, -.05, -.25, 0); hay.root.position.y = F - .02;
    const wx = lerp(.75, .35, sm(clamp(ph * 1.3, 0, 1))); at(ham, wx, F - .01, -.25, PI, t, { sc: .85, run: ph < .75 ? 1 : 0, speed: 16, up: .1 });
    ham.root.updateMatrixWorld(true); const mp = ham.head.localToWorld(V(.23, -.06, 0)); place(strip, 0, 0, 0); strip.root.position.copy(mp); strip.root.rotation.set(0, PI / 2, .3);
    frameOn([FR(-.35, F, -.75, 1.25, F + .55, .05)], { az: lerp(.28, .2, k), el: .22, fill: lerp(1.0, 1.08, k), t }); draw();
    stamp(L("TOILET PAPER", "KLOPAPIER"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06);
    if (ph > .45) stamp(L("+ HAY", "+ HEU"), W * .42, H * .57, (ph - .45) * d / .3, "#ffb800", .06);
    txt(L("+ deep bedding, 25 cm (PDSA)", "+ tiefe Einstreu, 25 cm (PDSA)"), W * .42, H * .65, 36, "#ffffff", { stroke: 8, a: clamp((ph - .55) * 4, 0, 1) }); });
  // 10 Loop: Hook-Einstellung, Hamster auf dem Watte-Haufen, es fängt an zu "schneien"
  KZ.shot("fLoop", (lt, d, t) => { inRoom(); const ph = lt / d; cageScene(t, 1, { thread: true, look: -.25 + Math.sin(t * 2) * .1, up: .2, hy: .05 });
    place(flakes, 0, 0, 0); flakes.set(t, CX - .55, CX + .55, CZ - .35, CZ + .35, cage.floor + 1.0, cage.floor + .1);
    frameOn([hamFrame(.34), FR(CX - .3, cage.floor, CZ - .2, CX + .4, cage.floor + .5, CZ + .3)], { az: lerp(.56, .5, ph), el: .16, fill: lerp(.82, .86, ph), t }); draw();
    if (ph > .35) stamp(L("COZY?", "KUSCHELIG?"), W * .42, H * .62, (ph - .35) * d / .3, "#ff8fb8", -.06); });

  window.__hamsterFluff = true;
})();
