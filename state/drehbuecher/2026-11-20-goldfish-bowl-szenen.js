// 3D-Szene "Why Your Goldfish Bowl Is A Tiny Prison" / "Warum dein Goldfischglas ein Knast ist" (20.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Goldfisch (gewöhnlicher Goldfisch: schlanker orangefarbener Körper, Gabelschwanz, Rücken-, Brust-, Bauch- und Afterflosse, Kiemendeckel, Schuppen-Glanz),
// Goldfischglas (Kugel mit Öffnung, Wasser, Kies), Holztisch, Schnorchel, Luftblasen, langes Aquarium mit Filter, Pflanzen, Kies und Wurzel,
// Lineal-Infografik, Liter-Vergleich (Glas 10 L vs. Becken 60 L) mit 3D-Schildern.
// Quellen: RSPCA UK (Keeping fish: up to 25 years, over 30 cm; Choosing an aquarium: bowls unsuitable, at least 60 litres each, no filter, low oxygen, temperature alters rapidly),
// sciencenorway 2024 (Glas typisch ca. 10 Liter).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, canvasTex, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  let fish, fish2, bigFish, rudi, table, bowl, bowl2, tank, ruler, bubbles, snorkel, snorkelHand, tagSmall, tagBig;

  // ---------- Goldfisch (Länge ca. .34 ohne Schwanz, Blick nach +x) ----------
  function makeFish(col) {
    const A = col ?? 0xff7a1a;
    const o = M(A, { roughness: .3, metalness: .15 }), o2 = M(0xffa040, { roughness: .35, metalness: .1 }), belly = M(0xffd27a, { roughness: .4 });
    const fin = M(0xff9a3a, { roughness: .35, transparent: true, opacity: .85, side: T.DoubleSide });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(o, 0, 0, 0, .17, .095, .065));                                // Körper
    body.add(sph(belly, .01, -.035, 0, .13, .055, .055));                      // heller Bauch
    body.add(sph(o, .12, .005, 0, .075, .07, .056));                           // Kopf
    for (const s of [-1, 1]) { const gc = mesh(new T.TorusGeometry(.055, .006, 6, 16, PI * .9), o2, .1, .0, s * .055); gc.rotation.set(0, 0, -PI * .45); gc.castShadow = false; body.add(gc); } // Kiemendeckel
    const lips = sph(M(0xffb070, { roughness: .4 }), .19, -.01, 0, .02, .018, .022); body.add(lips);
    const oMouth = sph(M(0x5a1a22), .2, -.01, 0, .012, .016, .016); body.add(oMouth);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.14, .03, s * .045); body.add(e);
      e.add(sph(M(0xffffff, { roughness: .2 }), 0, 0, 0, .03, .03, .018)); e.add(sph(M(0x111111, { roughness: .1 }), .008, 0, s * .012, .018, .018, .01));
      e.add(sph(M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), .014, .01, s * .02, .006)); eyes.push(e); }
    // Rückenflosse
    const dShape = new T.Shape(); dShape.moveTo(-.09, 0); dShape.quadraticCurveTo(-.02, .1, .06, .02); dShape.lineTo(.06, 0); dShape.lineTo(-.09, 0);
    const dorsal = mesh(new T.ShapeGeometry(dShape), fin, 0, .075, 0); dorsal.castShadow = false; body.add(dorsal);
    // Schwanz (Gabel)
    const tail = new T.Group(); tail.position.set(-.16, 0, 0); body.add(tail);
    const tShape = new T.Shape(); tShape.moveTo(0, 0); tShape.quadraticCurveTo(-.08, .06, -.17, .11); tShape.quadraticCurveTo(-.11, .02, -.12, 0); tShape.quadraticCurveTo(-.11, -.02, -.17, -.11); tShape.quadraticCurveTo(-.08, -.06, 0, 0);
    const tm = mesh(new T.ShapeGeometry(tShape), fin, 0, 0, 0); tm.castShadow = false; tail.add(tm);
    // Brust-, Bauch-, Afterflossen
    const pec = []; for (const s of [-1, 1]) { const p = new T.Group(); p.position.set(.08, -.04, s * .055); body.add(p);
      const f = sph(fin, -.03, -.01, s * .01, .04, .012, .022); f.rotation.z = -.5; p.add(f); pec.push(p); }
    for (const s of [-1, 1]) { const f = sph(fin, -.02, -.085, s * .03, .03, .022, .006); f.rotation.z = .4; body.add(f); }
    { const f = sph(fin, -.11, -.07, 0, .03, .022, .006); f.rotation.z = .6; body.add(f); }
    // Schuppen-Glanz (kleine helle Punkte)
    const sc = M(0xffc070, { roughness: .2, metalness: .3 }); for (let i = 0; i < 10; i++) for (const s of [-1, 1]) { const x = -.1 + (i % 5) * .045, y = (i < 5 ? .03 : -.005); body.add(sph(sc, x, y, s * (.058 - Math.abs(x) * .12), .012, .009, .004)); }
    root.traverse((m) => { if (m.isMesh) m.castShadow = false; });
    return { root, body, tail, eyes, pec, oMouth, lips };
  }
  // o: {wide, gasp, sad, sc, swim (0..1 Seitwärts-Schwimmen), tilt, lid, angry}
  function poseFish(F, t, o) { o = o || {}; const sw = o.fast ? 14 : 7;
    F.tail.rotation.y = Math.sin(t * sw) * .45; F.pec.forEach((p, i) => p.rotation.x = Math.sin(t * 6 + i * PI) * .4);
    F.body.rotation.set(0, Math.sin(t * sw) * .06, (o.tilt || 0) + Math.sin(t * 2) * .04);
    F.body.position.y = Math.sin(t * 2.4) * .012;
    const lid = o.lid ?? (Math.sin(t * 1.1 + 1) > .985 ? .8 : 0);
    F.eyes.forEach((e) => e.scale.set(o.wide ? 1.3 : 1, Math.max(.1, 1 - lid) * (o.wide ? 1.3 : 1), o.wide ? 1.2 : 1));
    const gp = o.gasp ? (Math.sin(t * 9) * .5 + .5) : 0; F.oMouth.visible = !!o.gasp; F.oMouth.scale.set(.012, .006 + gp * .016, .006 + gp * .014);
    F.root.scale.setScalar(o.sc || 1); }

  // ---------- Kulissen ----------
  function makeTable() { const root = new T.Group(); const wood = M(0xb9763f, { roughness: .7 }), dk = M(0x8a5a33, { roughness: .7 });
    root.add(mesh(BOX, wood, 0, .76, 0, 1.0, .06, .7));
    for (const [x, z] of [[-.44, -.29], [.44, -.29], [-.44, .29], [.44, .29]]) root.add(mesh(BOX, dk, x, .37, z, .06, .74, .06));
    return { root }; }
  // Goldfischglas: Kugel mit runder Öffnung oben, Wasser bis knapp über die Mitte, bunter Kies
  const BR = .26;
  function makeBowl() { const root = new T.Group(); const cy = BR * .93;
    const glass = new T.Mesh(new T.SphereGeometry(BR, 48, 32, 0, 2 * PI, PI * .2, PI * .8), new T.MeshStandardMaterial({ color: new T.Color(0xdff3ff).convertSRGBToLinear(), transparent: true, opacity: .1, roughness: .05, metalness: .2, side: T.DoubleSide, depthWrite: false }));
    glass.position.y = cy; root.add(glass);
    const rim = mesh(new T.TorusGeometry(BR * Math.sin(PI * .2), .012, 8, 40), new T.MeshStandardMaterial({ color: 0xeaf7ff, transparent: true, opacity: .55, roughness: .1 }), 0, cy + BR * Math.cos(PI * .2), 0); rim.rotation.x = PI / 2; root.add(rim);
    const wTop = PI * .36, wr = BR * .97;
    const wm = new T.MeshStandardMaterial({ color: new T.Color(0x5cc8f0).convertSRGBToLinear(), transparent: true, opacity: .1, roughness: .1, depthWrite: false, side: T.FrontSide });
    const water = new T.Mesh(new T.SphereGeometry(wr, 48, 32, 0, 2 * PI, wTop, PI - wTop), wm); water.position.y = cy; root.add(water);
    const surf = new T.Mesh(new T.CircleGeometry(wr * Math.sin(wTop), 40), new T.MeshStandardMaterial({ color: new T.Color(0x9fe2ff).convertSRGBToLinear(), transparent: true, opacity: .3, roughness: .05, metalness: .3, depthWrite: false }));
    surf.rotation.x = -PI / 2; surf.position.y = cy + wr * Math.cos(wTop); root.add(surf);
    const gc = [0xff5d8f, 0x4fb3ff, 0xffd23f, 0x36b37e, 0xffffff]; for (let i = 0; i < 40; i++) { const a = i * 2.39, r = Math.sqrt(i / 40) * BR * .62; root.add(sph(M(gc[i % 5], { roughness: .5 }), Math.cos(a) * r, .035 + (i % 3) * .008, Math.sin(a) * r, .022)); }
    const shine = new T.Mesh(new T.PlaneGeometry(.035, BR * 1.1), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .4, depthWrite: false })); shine.position.set(-BR * .55, cy + .02, BR * .7); shine.rotation.set(0, -.6, -.35); root.add(shine);
    root.traverse((m) => { if (m.isMesh) { m.castShadow = false; } });
    return { root, waterY: cy + wr * Math.cos(wTop), cy }; }
  // Langes Aquarium (Tipp): Glas, Wasser, Kies, Pflanzen, Wurzel, Filter mit Blasen
  function makeTank() { const root = new T.Group(); const L0 = 1.5, D0 = .55, H0 = .62;
    const frame = M(0x2b2f3a, { roughness: .4, metalness: .3 });
    for (const [y] of [[.02], [H0]]) for (const s of [-1, 1]) { root.add(mesh(BOX, frame, 0, y, s * D0 / 2, L0 + .02, .03, .03)); root.add(mesh(BOX, frame, s * L0 / 2, y, 0, .03, .03, D0 + .02)); }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) root.add(mesh(BOX, frame, sx * L0 / 2, H0 / 2, sz * D0 / 2, .03, H0, .03));
    const glass = new T.Mesh(new T.BoxGeometry(L0, H0, D0), new T.MeshStandardMaterial({ color: new T.Color(0xdff3ff).convertSRGBToLinear(), transparent: true, opacity: .12, roughness: .05, depthWrite: false })); glass.position.y = H0 / 2; root.add(glass);
    const water = new T.Mesh(new T.BoxGeometry(L0 - .02, H0 * .86, D0 - .02), new T.MeshStandardMaterial({ color: new T.Color(0x4fb8e8).convertSRGBToLinear(), transparent: true, opacity: .22, roughness: .1, depthWrite: false })); water.position.y = H0 * .43 + .02; root.add(water);
    root.add(mesh(BOX, M(0xd9c08a, { roughness: 1 }), 0, .05, 0, L0 - .03, .06, D0 - .03));           // Sand/Kies
    for (let i = 0; i < 18; i++) root.add(sph(M([0xb59a6a, 0x8f8f8f, 0xe8d6a8][i % 3], { roughness: .9 }), -L0 / 2 + .1 + (i * .37) % (L0 - .2), .085, -D0 / 2 + .08 + (i * .23) % (D0 - .16), .03 + (i % 3) * .01, .02, .03));
    const plants = []; const pm = [M(0x2fa84f, { roughness: .6 }), M(0x5cc85a, { roughness: .6 }), M(0x1f8a5a, { roughness: .6 })];
    for (let i = 0; i < 9; i++) { const p = new T.Group(); const x = -L0 / 2 + .12 + (i < 5 ? i * .07 : .95 + (i - 5) * .09), z = -D0 / 2 + .1 + (i % 3) * .05; p.position.set(x, .08, z); root.add(p);
      const h = .28 + (i % 4) * .08; for (let k = 0; k < 3; k++) { const leaf = sph(pm[(i + k) % 3], 0, h / 2, 0, .025, h / 2, .012); leaf.rotation.set(0, k * 1.05, (k - 1) * .25); p.add(leaf); } plants.push(p); }
    const wood = M(0x6b4a2e, { roughness: .8 }); { const w1 = mesh(CYL, wood, .25, .14, .05, .05, .5, .05); w1.rotation.z = 1.1; root.add(w1); const w2 = mesh(CYL, wood, .33, .2, .05, .035, .28, .035); w2.rotation.z = .3; root.add(w2); }
    const filt = mesh(BOX, M(0x222831, { roughness: .4 }), L0 / 2 - .1, H0 * .5, -D0 / 2 + .07, .1, H0 * .75, .08); root.add(filt);
    root.add(mesh(BOX, M(0x3a7bd5, { roughness: .4 }), L0 / 2 - .1, H0 * .75, -D0 / 2 + .115, .07, .05, .01));
    const lid = mesh(BOX, M(0x2b2f3a, { roughness: .4 }), 0, H0 + .025, 0, L0 + .04, .03, D0 + .04); root.add(lid);
    const bub = []; const bm = new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .6, roughness: .05, depthWrite: false }); for (let i = 0; i < 10; i++) { const b = mesh(new T.SphereGeometry(1, 12, 8), bm, L0 / 2 - .17, .2, -D0 / 2 + .1, .015); root.add(b); bub.push(b); }
    root.add(mesh(BOX, M(0x5a3a22, { roughness: .7 }), 0, -.21, 0, L0 + .2, .42, D0 + .15));        // Unterschrank
    root.position.y = .42;
    root.traverse((m) => { if (m.isMesh) m.castShadow = false; });
    return { root, plants, bub, L0, D0, H0, anim(t) { plants.forEach((p, i) => p.rotation.z = Math.sin(t * 1.5 + i) * .08); bub.forEach((b, i) => { const k = (t * .5 + i / 10) % 1; b.position.y = .15 + k * (H0 * .72); b.position.x = L0 / 2 - .17 + Math.sin(t * 4 + i) * .01; }); } }; }
  // Schnorchel (rot-gelb) am Fischkopf, ragt aus dem Wasser
  function makeSnorkel() { const grp = new T.Group(); const tube = M(0xff4d4d, { roughness: .4 }), tip = M(0xffd23f, { roughness: .4 });
    grp.add(mesh(CYL, tube, 0, .17, 0, .012, .34, .012)); grp.add(mesh(CYL, tip, 0, .35, 0, .016, .04, .016));
    const bend = mesh(new T.TorusGeometry(.03, .012, 8, 16, PI / 2), tube, .03, 0, 0); bend.rotation.z = PI; grp.add(bend);
    grp.add(mesh(CYL, M(0x333333, { roughness: .5 }), .045, -.03, 0, .016, .03, .016)); grp.children[grp.children.length - 1].rotation.z = PI / 2;
    grp.traverse((m) => { if (m.isMesh) m.castShadow = false; }); return grp; }
  function makeBubbles() { const root = new T.Group(); const list = []; const bm = new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .65, roughness: .05, depthWrite: false });
    for (let i = 0; i < 6; i++) { const b = mesh(new T.SphereGeometry(1, 12, 8), bm); b.scale.setScalar(.012 + (i % 3) * .005); b.castShadow = false; root.add(b); list.push(b); } return { root, list }; }
  // Lineal 0–30 cm (Infografik)
  function makeRuler() { const tex = canvasTex(1024, 128, (c, w, h) => { c.fillStyle = "#ffd23f"; c.fillRect(0, 0, w, h); c.fillStyle = "#1d2250"; c.font = '800 34px "Montserrat"'; c.textAlign = "center";
      for (let i = 0; i <= 30; i++) { const x = 30 + i * (w - 60) / 30; c.fillRect(x - 2, 0, 4, i % 5 ? 30 : 56); if (i % 10 === 0) c.fillText(i + " cm", Math.min(w - 70, Math.max(60, x)), 104); } });
    const root = new T.Group(); const m = new T.Mesh(new T.BoxGeometry(1.6, .2, .03), [M(0xe6b82f), M(0xe6b82f), M(0xe6b82f), M(0xe6b82f), new T.MeshStandardMaterial({ map: tex, roughness: .5 }), M(0xe6b82f)]);
    m.position.y = .1; root.add(m); return { root }; }
  // 3D-Schild mit Text (für Liter-Vergleich)
  function makeTag(s, col) { const tex = canvasTex(512, 220, (c, w, h) => { c.fillStyle = col; c.beginPath(); c.roundRect(8, 8, w - 16, h - 16, 40); c.fill(); c.strokeStyle = "#ffffff"; c.lineWidth = 12; c.stroke();
      c.fillStyle = "#ffffff"; c.font = '900 120px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s, w / 2, h / 2 + 6); });
    const root = new T.Group(); const p = new T.Mesh(new T.PlaneGeometry(.46, .2), new T.MeshBasicMaterial({ map: tex, transparent: true })); p.position.y = .1; root.add(p); return { root, p }; }

  K3.onBuild(() => {
    rudi = K3.rudi;
    fish = actor(makeFish(), "Goldfisch"); fish2 = actor(makeFish(0xff9a2a), "Goldfisch 2"); bigFish = actor(makeFish(), "Goldfisch gross");
    table = actor(makeTable(), "Tisch"); bowl = actor(makeBowl(), "Glas"); bowl2 = actor(makeBowl(), "Glas 2"); tank = actor(makeTank(), "Aquarium");
    ruler = actor(makeRuler(), "Lineal"); bubbles = actor(makeBubbles(), "Blasen");
    tagSmall = actor(makeTag("10 L", "#e5484d"), "Schild 10"); tagBig = actor(makeTag("60 L", "#36b37e"), "Schild 60");
    snorkel = makeSnorkel(); fish.body.add(snorkel); snorkel.position.set(.13, .06, 0); snorkel.visible = false;
    snorkelHand = makeSnorkel(); snorkelHand.scale.setScalar(2.1); snorkelHand.visible = false; rudi.arms[1].add(snorkelHand); snorkelHand.position.set(0, -.6, 0); snorkelHand.rotation.set(0, 0, PI - .3);
    for (const a of [table, bowl, bowl2, tank, ruler, bubbles, tagSmall, tagBig, fish, fish2, bigFish]) a.noCheck = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
  });
  function reset() { snorkel.visible = false; snorkelHand.visible = false;
    for (const b of [fish, fish2, bigFish]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); }
    for (const b of [bowl, bowl2, tank, tagSmall, tagBig]) b.root.scale.setScalar(1); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); m.updateMatrixWorld(); return { root: m }; };
  function at(B, x, y, z, ry, rz) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, rz || 0); }
  const TOP = .79; // Tischplatte oben
  // Tisch mit Glas bei (bx, bz); Fisch im Glas; gibt Wasserhöhe zurück
  function bowlOnTable(bx, bz, s) { s = s || 1; place(table, bx, bz, 0); at(bowl, bx, TOP, bz, 0); bowl.root.scale.setScalar(s); return TOP + bowl.waterY * s; }
  function bubblesAt(x, y0, z, t, h, on) { bubbles.root.visible = on !== false; bubbles.root.position.set(0, 0, 0); bubbles.list.forEach((b, i) => { const k = (t * .8 + i / 6) % 1; b.position.set(x + Math.sin(t * 5 + i) * .015, y0 + k * h, z + Math.cos(t * 4 + i) * .01); }); }
  // Fisch im Glas (Weltkoordinaten), schwimmt kleine Kreise
  function fishInBowl(F, bx, bz, t, o, rad) { o = o || {}; const r = rad ?? .08, a = t * .9; const y = o.y ?? (TOP + BR * .9);
    at(F, bx + Math.cos(a) * r, y, bz + Math.sin(a) * r * .6, o.ry ?? (-a - PI / 2)); poseFish(F, t, o); }

  // ---------- Shots ----------
  // 0 Hook: Nahaufnahme Glas auf dem Tisch, Fisch schwimmt traurig im Kreis, Stempel KNAST
  KZ.shot("fHook", (lt, d, t) => { inYard(); const ph = lt / d;
    bowlOnTable(0, 0, 1.15); fishInBowl(fish, 0, 0, t, { sad: true, sc: 1.05, y: TOP + BR * 1.05, ry: Math.sin(t * .8) * .5 + .4 }, .02);
    frameOn([FR(-.32, TOP, -.32, .32, TOP + .58, .32)], { az: lerp(.25, .15, ph), el: lerp(.22, .17, ph), fill: lerp(.95, 1.05, ph), dy: -.04, t }); draw();
    if (ph > .3) stamp(L("PRISON", "KNAST"), W * .42, H * .62, (ph - .3) * d / .3, "#e5484d", -.06); });
  // 1 Rudi stellt stolz das Glas auf den Tisch
  KZ.shot("fRudi", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    bowlOnTable(.2, .1); fishInBowl(fish, .2, .1, t, { sc: 1 });
    place(rudi, -.6, -.05, .3); poseRudi(rudi, t, { arms: [.2, 1.25 + Math.sin(t * 3) * .1], spread: .15, mouth: "smile", tilt: -.06 });
    frameOn([rudi, table], { az: lerp(.62, .52, k), el: .12, fill: lerp(.9, .95, k), t }); draw();
    stamp(L("PERFECT!", "PERFEKT!"), W * .42, H * .17, (lt - .3) / .3, "#36b37e", -.06); });
  // 2 Fisch schnappt an der Oberfläche nach Luft, Blasen
  KZ.shot("fGasp", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    const wy = bowlOnTable(0, 0, 1.15); at(fish, 0, wy - .06, 0, .45, .55); poseFish(fish, t, { gasp: true, wide: true, sc: .9, tilt: 0 }); fish.body.rotation.z = .0;
    bubblesAt(.1, wy - .02, .05, t, .09);
    frameOn([FR(-.32, TOP, -.32, .32, TOP + .58, .32)], { az: lerp(.35, .25, k), el: lerp(.3, .24, k), fill: lerp(1.0, 1.12, k), dy: .03, t }); draw();
    stamp(L("GASP!", "SCHNAPP!"), W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", .06);
    if (ph > .5) stamp(L("LOW OXYGEN", "WENIG LUFT"), W * .42, H * .64, (ph - .5) * d / .3, "#e5484d", -.05); });
  // 3 Rudi hält einen Schnorchel hoch; Schnitt: Fisch mit Schnorchel im Glas
  KZ.shot("fSnorkel", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .36;
    if (!half) { const k = sm(ph / .36); bowlOnTable(.25, .1); fishInBowl(fish, .25, .1, t, { wide: true });
      place(rudi, -.65, -.05, .3); poseRudi(rudi, t, { arms: [.2, 1.35 + Math.sin(t * 4) * .08], spread: .05, mouth: "smile", tilt: -.05 });
      snorkelHand.visible = true;
      frameOn([rudi, table], { az: lerp(.55, .48, k), el: .12, fill: lerp(.9, .95, k), t }); draw();
      stamp(L("SNORKEL!", "SCHNORCHEL!"), W * .42, H * .17, (lt - .2) / .3, "#ff9f1c", -.06); }
    else { const k = (ph - .36) / .64; const wy = bowlOnTable(0, 0, 1.15);
      at(fish, 0, wy - .07, 0, .5); poseFish(fish, t, { wide: true, sc: 1.05 }); snorkel.visible = true;
      frameOn([FR(-.32, TOP, -.32, .32, TOP + .7, .32)], { az: lerp(.5, .4, k), el: .2, fill: lerp(1.0, 1.08, k), t }); draw();
      if (k > .3) stamp(L("PROBLEM SOLVED", "PROBLEM GELÖST"), W * .42, H * .64, (k - .3) * d * .64 / .3, "#36b37e", .05); } });
  // 4 Der Fisch wächst und wächst, bis er nicht mehr ins Glas passt; Rudi entsetzt
  KZ.shot("fGrow", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    const g0 = sm(clamp((ph - .05) / .55, 0, 1)), sc = lerp(1, 2.6, g0);
    bowlOnTable(.25, .1); at(fish, .25, TOP + BR * .9 + (sc - 1) * .03, .1, .9); poseFish(fish, t, { wide: g0 > .5, sc }); fish.tail.rotation.y = Math.sin(t * 7) * .2 * (1 - g0) + .05;
    place(rudi, -.85, -.05, .35); poseRudi(rudi, t, { arms: ph > .55 ? [.35, .35] : [.2, .3], spread: ph > .55 ? 1.0 : .1, mouth: ph > .55 ? "o" : "smile", lean: ph > .55 ? -.1 : 0 });
    frameOn([rudi, table, FR(-.1, TOP, -.3, .6, TOP + .6, .5)], { az: lerp(.55, .5, k), el: .12, fill: lerp(.9, .95, k), t }); draw();
    if (ph > .55) stamp(L("WHAT?!", "HÄ?!"), W * .42, H * .17, (ph - .55) * d / .3, "#e5484d", -.07); });
  // 5 Studio: großer Goldfisch über einem Lineal 0–30 cm, "25 Jahre"
  KZ.shot("fSize", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(ruler, 0, .25, 0); const gr = sm(clamp(ph / .5, 0, 1));
    at(bigFish, .14, .55, .25, 0); poseFish(bigFish, t, { sc: lerp(2.0, 3.4, gr), wide: true });
    frameOn([ruler, FR(-.8, .2, 0, .8, .9, .4)], { az: lerp(.12, .04, k), el: .1, fill: lerp(.88, .94, k), t }); draw();
    stamp(L("30+ CM", "30+ CM"), W * .42, H * .17, (lt - .25) / .3, "#ff9f1c", -.06);
    const cp = sm((lt - d * .5) / .3); if (cp > 0) txt(L("up to 25 years old", "bis zu 25 Jahre alt"), W * .42, H * .64, 72, "#ffd23f", { stroke: 12, a: clamp(cp, 0, 1) }); });
  // 6 Studio: Glas mit Fisch, drei rote X-Punkte (kein Filter, wenig Sauerstoff, Temperatur)
  function xRow(s, y, p) { if (p <= 0) return; const a = clamp(p * 2, 0, 1), k = easeBack(clamp(p, 0, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a;
    const x = W * .16; g.translate(x, y); g.scale(k, k); g.fillStyle = "#e5484d"; g.beginPath(); g.arc(0, 0, 40, 0, 2 * PI); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 11; g.lineCap = "round";
    g.beginPath(); g.moveTo(-15, -15); g.lineTo(15, 15); g.moveTo(15, -15); g.lineTo(-15, 15); g.stroke(); g.restore();
    txt(s, x + 70, y + 2, 54, "#ffffff", { stroke: 11, a, align: "left" }); }
  KZ.shot("fWhy", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bowl, 0, 0, 0, 0); bowl.root.scale.setScalar(1.6); const wy = bowl.waterY * 1.6;
    const top = ph > .45; at(fish, 0, top ? wy - .07 : BR * 1.45, 0, top ? .6 : Math.sin(t) * .6 + .3, top ? .7 : 0); poseFish(fish, t, { sc: 1.7, gasp: top, wide: top, sad: !top });
    bubblesAt(.1, wy - .1, .08, t, .12, top);
    frameOn([FR(-.45, 0, -.45, .45, .85, .45)], { az: lerp(.2, .1, k), el: lerp(.2, .14, k), fill: lerp(.6, .66, k), dy: .12, t }); draw();
    xRow(L("NO FILTER", "KEIN FILTER"), H * .52, (lt - d * .08) / .3);
    xRow(L("LITTLE OXYGEN", "WENIG SAUERSTOFF"), H * .585, (lt - d * .35) / .3);
    xRow(L("TEMP SWINGS", "TEMPERATUR KIPPT"), H * .65, (lt - d * .65) / .3); });
  // 7 Studio: kleines Glas (10 L) neben großem Becken (60 L) + RSPCA-Karte
  KZ.shot("fLitres", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    const pt = sm(clamp((ph - .05) / .3, 0, 1));
    at(bowl, -.95, 0, .1, 0); bowl.root.scale.setScalar(1.1); fishInBowl(fish2, -.95, .1, t, { sc: .9, y: BR * 1.05, sad: true }, .03);
    at(tank, .35, 0, 0, 0); tank.root.position.y = .42; tank.root.scale.setScalar(.2 + .8 * easeBack(pt)); tank.anim(t);
    at(fish, .35 + Math.sin(t * .6) * .35, .42 + .3, .02, Math.cos(t * .6) > 0 ? 0 : PI); poseFish(fish, t, { sc: 1.3 }); fish.root.visible = pt > .85;
    at(tagSmall, -.95, .62, .1, 0); at(tagBig, .35, 1.13, 0, 0); tagBig.root.scale.setScalar(easeBack(clamp((ph - .25) / .2, 0, 1)) + .001);
    frameOn([FR(-1.25, 0, -.3, 1.15, 1.35, .35)], { az: lerp(.08, 0, k), el: .1, fill: lerp(.9, .95, k), dy: .12, t }); draw();
    const cp = sm((lt - d * .55) / .3); if (card(W * .42, H * .6, 880, 210, cp, "RSPCA", "#2f6fd0")) {
      txt(L("“goldfish require at least", "„Goldfische brauchen mindestens"), W * .42, H * .6 + 18, 36, "#1d2250", { a: clamp(cp, 0, 1) });
      txt(L("60 litres of water each”", "60 Liter Wasser pro Fisch“"), W * .42, H * .6 + 64, 36, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 8 Pointe: Rudi mit dem Schnorchel in der Hand kratzt sich am Kopf, großer Fisch guckt genervt aus dem Glas
  KZ.shot("fPunch", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    bowlOnTable(.25, .1); at(fish, .25, TOP + BR * .9 + .05, .1, PI - .6); poseFish(fish, t, { sc: 2.6, lid: .45 }); fish.tail.rotation.y = .05;
    place(rudi, -.95, -.05, .35); poseRudi(rudi, t, { arms: [.15, 1.0 + Math.sin(t * 2) * .05], spread: .05, mouth: "smile", tilt: -.14 + Math.sin(t * 1.5) * .04 });
    snorkelHand.visible = true;
    frameOn([rudi, table, FR(-.1, TOP, -.3, .6, TOP + .6, .5)], { az: lerp(.55, .5, k), el: .12, fill: lerp(.92, .97, k), t }); draw();
    if (ph > .35) stamp(L("GILLS, BRO", "KIEMEN, DIGGA"), W * .42, H * .17, (ph - .35) * d / .3, "#7a5cff", .05); });
  // 9 Tipp: langes Becken mit Filter und Pflanzen, zwei Goldfische schwimmen fröhlich, Rudi daneben zufrieden
  KZ.shot("fTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(tank, .3, 0, 0); tank.root.position.y = .42; tank.anim(t);
    const sx = (o) => Math.sin(t * .5 + o) * .5;
    at(fish, .3 + sx(0), .42 + .32, .05, Math.cos(t * .5) > 0 ? 0 : PI); poseFish(fish, t, { sc: 1.4 });
    at(fish2, .3 + sx(2.2), .42 + .22, -.08, Math.cos(t * .5 + 2.2) > 0 ? 0 : PI); poseFish(fish2, t + 1, { sc: 1.25 });
    place(rudi, -.95, .6, .35); poseRudi(rudi, t, { arms: [.2, .35], spread: .12, mouth: "smile", nod: Math.sin(t * 3) * .04 });
    frameOn([rudi, tank], { az: lerp(.4, .32, k), el: .12, fill: lerp(.95, 1.0, k), t }); draw();
    stamp(L("60 L PER FISH", "60 L PRO FISCH"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06); });
  // 10 Loop: zurück zur Hook-Einstellung
  KZ.shot("fLoop", (lt, d, t) => { inYard(); const ph = lt / d;
    bowlOnTable(0, 0, 1.15); fishInBowl(fish, 0, 0, t, { sad: ph > .5, sc: 1.05, y: TOP + BR * 1.05, ry: Math.sin(t * .8) * .5 + .4 }, .02);
    frameOn([FR(-.32, TOP, -.32, .32, TOP + .58, .32)], { az: lerp(.35, .25, ph), el: lerp(.26, .22, ph), fill: lerp(.88, .95, ph), dy: -.04, t }); draw();
    if (ph > .3) stamp(L("STILL A BOWL?", "NOCH EIN GLAS?"), W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__goldfishbowl3d = true;
})();
