// 3D-Szene "Why Your Bee Hotel Is A Ghost House" / "Warum dein Insektenhotel ein Geisterhaus ist" (22.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Opener-Stil "hotelbewertung": Ein-Stern-Bewertung von Frau Mauerbiene, kleines Gespenst schwebt aus dem leeren Baumarkt-Hotel.
// Baumarkt-Insektenhotel (Zapfen, Stroh, Lochziegel, Baumscheibe, Bambus, Holzwolle), Gehörnte Mauerbiene (Osmia cornuta: schwarzer Kopf + Brust,
// rostroter pelziger Hinterleib, rauchige Flügel, kleine Gesichtshörnchen), Akkuschrauber, Baumscheibe mit Rissen (Stirnholz), Querschnitt eines
// zugemauerten Niströhrchens (Lehmwände, Pollen, Kokons), Mülleimer, gutes Nistholz (Hartholz, seitlich gebohrt) mit Blumen.
// Quellen: NABU Aachen ("Die Fächer nicht mit Tannen-/Fichtenzapfen füllen ... völlig sinnlos. Keine Wildbiene möchte dort ein Ei legen";
// Bohrungen in Faserrichtung -> Risse, "an welchen die Tiere ihre Flügel ein- oder abreißen können"; Anleitung "regelmäßig säubern":
// "Die sicherste Insekten-Vernichtungs-Methode ohne Chemie-Einsatz!"), NABU BW (3-9 mm, mind. 10 cm tief, glatte Kanten, seitlich ins Längsholz,
// Hartholz), NABU (Nisthilfen auch im Winter ungestört draußen lassen).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let rudi, bee, bee2, bee3, hotel, ghost, drill, slice, stump, brush, bin, tubes = [], section, goodBlock, crackBlock, good, flowers = [];
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }

  // ---------- Gehörnte Mauerbiene (Kopf nach +x, Boden y = 0, Länge ~.5) ----------
  function makeBee() {
    const blk = M(0x1c1a1e, { roughness: .95 }), fur = M(0xd9532a, { roughness: 1 }), furL = M(0xf07a3a, { roughness: 1 }), face = M(0x3a3438, { roughness: .9 });
    const eyeW = M(0xffffff, { roughness: .15 }), pup = M(0x161018, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const wingM = new T.MeshStandardMaterial({ color: new T.Color(0x9fb0c4).convertSRGBToLinear(), roughness: .2, transparent: true, opacity: .55, side: T.DoubleSide, depthWrite: false });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(blk, 0, .19, 0, .1, .1, .1));                                  // Brust schwarz
    for (let i = 0; i < 10; i++) { const a = i * 2.4; body.add(sph(blk, Math.cos(a) * .07, .19 + Math.sin(i * 1.3) * .07, Math.sin(a) * .07, .035)); }
    body.add(sph(fur, -.15, .17, 0, .13, .105, .11));                             // Hinterleib rostrot, pelzig
    for (let i = 0; i < 18; i++) { const a = i * 2.4, xx = -.25 + (i % 9) * .024; body.add(sph(i % 3 ? fur : furL, xx, .17 + Math.cos(a) * .09, Math.sin(a) * .09, .03)); }
    const head = new T.Group(); head.position.set(.14, .19, 0); body.add(head);
    head.add(sph(blk, 0, 0, 0, .075, .078, .085)); head.add(sph(face, .05, -.02, 0, .035, .04, .06));
    for (const s of [-1, 1]) { const hn = mesh(new T.ConeGeometry(.01, .03, 8), blk, .075, -.035, s * .02); hn.rotation.z = -PI / 2 - .5; head.add(hn); } // Gesichtshörnchen
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.04, .025, s * .05); head.add(e);
      e.add(sph(eyeW, 0, 0, 0, .036, .046, .036)); e.add(sph(pup, .026, 0, 0, .021, .026, .021)); e.add(sph(hl, .042, .014, -s * .004, .007)); eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, M(0xf07a3a), .05, .078, s * .045, .012, .008, .04); head.add(b); brows.push(b); }
    const smile = mesh(new T.TorusGeometry(.017, .005, 6, 14, PI), M(0xff6b8a), .07, -.04, 0); smile.rotation.set(0, PI / 2, PI); head.add(smile);
    const frown = mesh(new T.TorusGeometry(.015, .005, 6, 14, PI), M(0xff6b8a), .07, -.052, 0); frown.rotation.set(0, PI / 2, 0); head.add(frown);
    const ants = []; for (const s of [-1, 1]) { const a = new T.Group(); a.position.set(.04, .055, s * .025); head.add(a);
      const s1 = limb(.006, .055, blk); s1.rotation.set(s * .35, 0, -.25); a.add(s1);
      const s2 = limb(.005, .075, blk); s2.position.set(.014, .053, s * .02); s2.rotation.set(s * .2, 0, -1.6); a.add(s2); ants.push(a); }
    const legs = []; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const l = limb(.01, .12, blk); l.position.set(.05 - i * .06, .11, s * .055); l.rotation.set(s * .55, 0, (i - 1) * .35); body.add(l); legs.push(l); }
    const wings = []; for (const s of [-1, 1]) { const w = new T.Group(); w.position.set(-.02, .28, s * .03); body.add(w);
      const w1 = sph(wingM, -.1, 0, s * .03, .12, .006, .05); w1.castShadow = false; w.add(w1); const w2 = sph(wingM, -.08, -.01, s * .055, .08, .005, .035); w2.castShadow = false; w.add(w2); wings.push(w); }
    // Pflaster für den eingerissenen Flügel
    const plaster = mesh(BOX, M(0xf2d2b0, { roughness: .8 }), -.1, .012, .035, .06, .008, .025); wings[1].add(plaster); plaster.castShadow = false;
    return { root, body, head, eyes, brows, smile, frown, ants, legs, wings, plaster };
  }
  // o: {fly, wide, sad, look, nod, sc, torn, lean}
  function poseBee(B, t, o) {
    o = o || {}; const fl = o.fly || 0; const flap = fl ? Math.sin(t * 60) * .5 : 0;
    B.wings.forEach((w, i) => { const s = i ? 1 : -1; const torn = o.torn && i === 1; w.rotation.set(s * (.15 + flap * (1 + fl)) + (torn ? .5 : 0), 0, .1 + (torn ? -.6 : 0)); w.scale.set(torn ? .7 : 1, 1, torn ? .7 : 1); });
    B.plaster.visible = !!o.torn;
    B.legs.forEach((l, i) => { const s = i < 3 ? -1 : 1, k = i % 3; l.rotation.set(s * (.55 + fl * -.2), 0, (k - 1) * .35 + fl * -.4 + Math.sin(t * 3 + i) * .03); });
    B.ants.forEach((a, i) => a.rotation.set(0, 0, Math.sin(t * 2.2 + i) * .1 - (o.sad ? .5 : 0)));
    const lid = Math.sin(t * 1.5 + 2) > .985 ? .85 : (o.sad ? .35 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.2 : 1), 1));
    B.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.sad ? .45 : (o.wide ? -.35 : (o.grumpy ? -.5 : 0))); b.position.y = o.wide ? .088 : .078; });
    B.smile.visible = !(o.sad || o.wide || o.grumpy); B.frown.visible = !B.smile.visible;
    B.head.rotation.set(0, o.look || 0, (o.nod || 0));
    B.body.position.y = fl * (.1 + Math.sin(t * 4) * .03); B.body.rotation.z = fl * .12 + (o.lean || 0);
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Texturen ----------
  const ringsTex = (holes, cracks) => canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#e8c48c"; c.fillRect(0, 0, w, h);
    for (let r = 120; r > 4; r -= 11) { c.strokeStyle = r % 22 ? "#c99a5e" : "#d8ae72"; c.lineWidth = 4; c.beginPath(); c.arc(w / 2 + 4, h / 2 - 3, r, 0, 7); c.stroke(); }
    const hp = [[70, 80], [130, 60], [190, 90], [60, 150], [128, 128], [196, 160], [95, 205], [165, 210]];
    if (cracks) { c.strokeStyle = "#3a2210"; c.lineCap = "round"; for (const [x, y] of hp.slice(0, holes)) { c.lineWidth = 6; c.beginPath(); c.moveTo(x, y); const a = Math.atan2(y - h / 2, x - w / 2); let px = x, py = y;
      for (let k = 0; k < 4; k++) { px += Math.cos(a + (k % 2 ? .4 : -.4)) * 16; py += Math.sin(a + (k % 2 ? .4 : -.4)) * 16; c.lineTo(px, py); } c.stroke(); } }
    for (const [x, y] of hp.slice(0, holes)) { c.fillStyle = "#2a1608"; c.beginPath(); c.arc(x, y, 12, 0, 7); c.fill(); c.fillStyle = "#4a2a12"; c.beginPath(); c.arc(x - 3, y - 3, 7, 0, 7); c.fill(); } });
  const sideTex = () => canvasTex(512, 256, (c, w, h) => { c.fillStyle = "#b9824a"; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) { c.strokeStyle = i % 2 ? "#a06c38" : "#c8925a"; c.lineWidth = 3 + (i % 3); c.beginPath(); const y = i * 10 + 3; c.moveTo(0, y); c.bezierCurveTo(w * .3, y + 6, w * .6, y - 6, w, y + 2); c.stroke(); }
    const sizes = [9, 7, 11, 8, 6, 10, 7, 9, 12, 8, 6, 9]; let k = 0;
    for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) { const x = 70 + col * 125 + (row % 2) * 30, y = 50 + row * 78, r = sizes[k++] * 1.6;
      c.fillStyle = "#e3b77e"; c.beginPath(); c.arc(x, y, r + 4, 0, 7); c.fill(); c.fillStyle = "#24140a"; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); } });
  const brickTex = () => canvasTex(256, 192, (c, w, h) => { c.fillStyle = "#c2502f"; c.fillRect(0, 0, w, h);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { c.fillStyle = "#4a1a0e"; c.fillRect(18 + k * 58, 18 + r * 58, 44, 40); c.fillStyle = "#7a2c18"; c.fillRect(18 + k * 58, 18 + r * 58, 44, 8); } });
  const woolTex = () => canvasTex(256, 192, (c, w, h) => { c.fillStyle = "#e7c98f"; c.fillRect(0, 0, w, h); c.lineWidth = 3;
    for (let i = 0; i < 120; i++) { c.strokeStyle = ["#caa265", "#f4dcaa", "#b88c50"][i % 3]; c.beginPath(); const x = (i * 53) % w, y = (i * 37) % h; c.arc(x, y, 8 + (i % 5) * 4, i, i + 3.5); c.stroke(); } });
  const barkM = () => M(0x7a4e2c, { roughness: .95 });

  // ---------- Bauteile ----------
  function pineCone(len) { const root = new T.Group(); const b1 = M(0x8a5a2e, { roughness: .9 }), b2 = M(0x6b4222, { roughness: .9 });
    for (let i = 0; i < 6; i++) { const r = len * .3 * Math.sin((i + 1) / 7 * PI) + .01; for (let k = 0; k < 7; k++) { const a = k / 7 * 2 * PI + i * .45;
      root.add(sph(k % 2 ? b1 : b2, -len / 2 + i * len / 6, Math.cos(a) * r * .75, Math.sin(a) * r * .75, len * .09, len * .07, len * .09)); } root.add(sph(b2, -len / 2 + i * len / 6, 0, 0, r * .8)); }
    return root; }
  function strawBundle(w, h, len) { const root = new T.Group(); const m1 = M(0xf0d062, { roughness: .8 }), m2 = M(0xd8b440, { roughness: .8 }), hole = M(0x6a5418);
    for (let ix = 0; ix < 7; ix++) for (let iy = 0; iy < 5; iy++) { const x = -w / 2 + (ix + .5) * w / 7 + (iy % 2) * .01, y = -h / 2 + (iy + .5) * h / 5; const s = mesh(CYL, (ix + iy) % 2 ? m1 : m2, x, y, 0, .021, len, .021); s.rotation.x = PI / 2; root.add(s);
      const e = mesh(new T.CircleGeometry(.012, 10), hole, x, y, len / 2 + .002); root.add(e); } return root; }
  function bambooBundle(sealedN) { const root = new T.Group(); const m = M(0xd9b46a, { roughness: .6 }), hole = M(0x2a1a0a), mud = M(0x8a7458, { roughness: 1 }); const caps = [];
    const pos = [[-.11, .07], [0, .07], [.11, .07], [-.055, -.03], [.055, -.03], [-.11, -.09], [0, -.11], [.11, -.09]];
    pos.forEach(([x, y], i) => { const s = mesh(CYL, m, x, y, 0, .045, .28, .045); s.rotation.x = PI / 2; root.add(s); const sealed = i < sealedN;
      const cap = mesh(new T.CircleGeometry(.033, 16), sealed ? mud : hole, x, y, .142); root.add(cap); caps.push({ cap, sealed, x, y }); }); return { root, caps }; }
  // ---------- Baumarkt-Insektenhotel (Wurzel am Boden, Post, Kasten mit 6 Fächern, Front +z) ----------
  const H0 = .95, HW = .46, HH = .5, HD = .17;
  function cell(col, row) { return V((col ? 1 : -1) * .215, H0 + .82 - row * .32, 0); }
  function makeHotel() { const root = new T.Group(); const post = M(0x6f4526, { roughness: .85 }), wood = M(0xc08a52, { roughness: .75 }), woodD = M(0x9a6438, { roughness: .8 }), roof = M(0x4f6b3a, { roughness: .7 });
    root.add(mesh(CYL, post, 0, H0 / 2, -.05, .05, H0, .05)); root.add(mesh(CYL, post, 0, .03, -.05, .25, .06, .25));
    const box = new T.Group(); root.add(box);
    box.add(mesh(BOX, woodD, 0, H0 + HH, -HD + .02, HW * 2, HH * 2, .04));                       // Rückwand
    for (const s of [-1, 1]) box.add(mesh(BOX, wood, s * (HW - .02), H0 + HH, 0, .04, HH * 2, HD * 2)); // Seiten
    for (const y of [H0 + .02, H0 + HH * 2 - .02, H0 + HH - .155 + .31, H0 + HH - .155]) box.add(mesh(BOX, wood, 0, y, 0, HW * 2, .04, HD * 2));
    box.add(mesh(BOX, wood, 0, H0 + HH, 0, .035, HH * 2, HD * 2));                                  // Mittelwand
    for (const s of [-1, 1]) { const r = mesh(BOX, roof, s * .29, H0 + HH * 2 + .17, 0, .66, .05, HD * 2 + .14); r.rotation.z = -s * .62; box.add(r); }
    // Giebel-Schild "HOTEL"
    const sign = mesh(new T.PlaneGeometry(.34, .1), M(0xffffff, { map: canvasTex(256, 76, (c, w, h) => { c.fillStyle = "#2a2340"; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 14); c.fill(); c.fillStyle = "#ffd84d"; c.font = '900 50px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("HOTEL", w / 2, h / 2 + 3); }), roughness: .5, emissive: 0x332a00, emissiveIntensity: .4 }), 0, H0 + HH * 2 + .1, HD + .02);
    box.add(sign);
    // Fächer: (0,0) Zapfen, (1,0) Stroh, (0,1) Lochziegel, (1,1) Baumscheibe Stirnholz, (0,2) Bambus, (1,2) Holzwolle + Zapfen
    const c00 = cell(0, 0); for (const [dx, dy, ry] of [[-.07, -.06, .3], [.08, -.06, -.2], [0, .06, .1]]) { const pc = pineCone(.17); pc.position.set(c00.x + dx, c00.y + dy, .02); pc.rotation.y = ry; box.add(pc); }
    const st = strawBundle(.36, .24, .3); st.position.copy(cell(1, 0)); st.position.z = 0; box.add(st);
    const brick = new T.Mesh(BOX, [M(0xc2502f), M(0xc2502f), M(0xc2502f), M(0xc2502f), M(0xffffff, { map: brickTex(), roughness: .9 }), M(0xc2502f)]); brick.position.copy(cell(0, 1)); brick.scale.set(.36, .25, .3); brick.castShadow = brick.receiveShadow = true; box.add(brick);
    const lg = new T.Mesh(new T.CylinderGeometry(.13, .13, .3, 32), [barkM(), M(0xffffff, { map: ringsTex(5, false), roughness: .85 }), barkM()]); lg.rotation.x = PI / 2; lg.position.copy(cell(1, 1)); lg.castShadow = lg.receiveShadow = true; box.add(lg);
    const bb = bambooBundle(4); bb.root.position.copy(cell(0, 2)); box.add(bb.root);
    const wool = new T.Mesh(BOX, [woodD, woodD, woodD, woodD, M(0xffffff, { map: woolTex(), roughness: 1 }), woodD]); wool.position.copy(cell(1, 2)); wool.scale.set(.36, .25, .28); box.add(wool);
    const pc2 = pineCone(.15); pc2.position.copy(cell(1, 2)); pc2.position.z = .1; pc2.position.x += .05; box.add(pc2);
    return { root, box, bamboo: bb, sign }; }
  // ---------- Gespenst (weiß, halb durchsichtig, Augen + O-Mund, wellige Unterkante) ----------
  function makeGhost() { const root = new T.Group(); const m = M(0xf4f6ff, { roughness: .4, emissive: 0xc8d4ff, emissiveIntensity: .35, transparent: true, opacity: .9 });
    root.add(sph(m, 0, .16, 0, .14, .16, .13)); root.add(mesh(new T.CylinderGeometry(.14, .16, .14, 24, 1, true), m, 0, .04, 0));
    for (let i = 0; i < 6; i++) { const a = i / 6 * 2 * PI; root.add(sph(m, Math.cos(a) * .13, -.03, Math.sin(a) * .13, .045)); }
    const blk = M(0x1a1a2a, { roughness: .3 }); for (const s of [-1, 1]) root.add(sph(blk, s * .05, .2, .12, .025, .035, .015));
    root.add(sph(blk, 0, .12, .125, .03, .04, .015)); for (const s of [-1, 1]) root.add(sph(m, s * .17, .1, 0, .04, .025, .03));
    root.traverse((x) => { if (x.isMesh) x.castShadow = false; }); return { root }; }
  // ---------- Akkuschrauber (Wurzel = Griff in der Hand, Bohrer zeigt nach +x) ----------
  function makeDrill() { const root = new T.Group(); const yel = M(0xf2b51c, { roughness: .45 }), blk = M(0x222226, { roughness: .5 }), met = M(0xc5ced8, { metalness: .85, roughness: .25 });
    root.add(mesh(BOX, blk, 0, -.06, 0, .07, .16, .06)); root.add(mesh(BOX, yel, 0, -.15, 0, .1, .05, .08));
    root.add(mesh(BOX, yel, .05, .05, 0, .2, .09, .08)); const ch = mesh(CYL, blk, .17, .05, 0, .03, .06, .03); ch.rotation.z = PI / 2; root.add(ch);
    const bit = new T.Group(); bit.position.set(.2, .05, 0); root.add(bit); const b = mesh(CYL, met, .08, 0, 0, .008, .16, .008); b.rotation.z = PI / 2; bit.add(b);
    for (let i = 0; i < 4; i++) { const r = mesh(BOX, met, .03 + i * .03, 0, 0, .006, .02, .002); r.rotation.x = i; bit.add(r); }
    return { root, bit }; }
  // ---------- Große Baumscheibe auf Hackklotz (Front +z) ----------
  const SLY = .75;
  function makeSlice() { const root = new T.Group(); const mats = []; for (let n = 0; n <= 8; n++) mats.push(M(0xffffff, { map: ringsTex(n, false), roughness: .85 }));
    const cracked = M(0xffffff, { map: ringsTex(8, true), roughness: .85 }); const face = M(0xffffff, { roughness: .85 }); face.map = mats[0].map;
    const m = new T.Mesh(new T.CylinderGeometry(.42, .42, .16, 40), [barkM(), face, barkM()]); m.rotation.x = PI / 2; m.position.y = SLY + .42; m.castShadow = m.receiveShadow = true; root.add(m);
    root.add(mesh(BOX, M(0x7a4e2c, { roughness: .9 }), 0, SLY + .02, -.02, .3, .06, .22));
    return { root, face, mats, cracked, set(n, cr) { face.map = cr ? cracked.map : mats[clamp(n, 0, 8)].map; face.needsUpdate = true; } }; }
  function makeStump() { const root = new T.Group(); root.add(mesh(new T.CylinderGeometry(.34, .4, SLY, 32), barkM(), 0, SLY / 2, 0));
    root.add(mesh(new T.CylinderGeometry(.33, .33, .01, 32), M(0xffffff, { map: ringsTex(0, false), roughness: .85 }), 0, SLY + .005, 0)); return { root }; }
  function makeBrush() { const root = new T.Group(); root.add(mesh(CYL, M(0xd9a35e, { roughness: .6 }), 0, -.15, 0, .02, .3, .02));
    root.add(mesh(BOX, M(0x2f6fd0, { roughness: .4 }), 0, -.31, 0, .18, .05, .09)); root.add(mesh(BOX, M(0xfff2b0, { roughness: .9 }), 0, -.35, 0, .17, .04, .08)); return { root }; }
  function makeBin() { const root = new T.Group(); const m = M(0x3a6fb0, { roughness: .4, metalness: .2 });
    root.add(mesh(new T.CylinderGeometry(.27, .22, .62, 32, 1, true), m, 0, .31, 0)); root.add(mesh(new T.CylinderGeometry(.22, .22, .02, 32), m, 0, .01, 0));
    const rim = mesh(new T.TorusGeometry(.27, .02, 8, 32), m, 0, .62, 0); rim.rotation.x = PI / 2; root.add(rim);
    const lbl = mesh(new T.PlaneGeometry(.26, .1), M(0xffffff, { map: canvasTex(256, 96, (c, w, h) => { c.fillStyle = "#fff"; c.fillRect(0, 0, w, h); c.fillStyle = "#1d2250"; c.font = '900 52px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(L("TRASH", "MÜLL"), w / 2, h / 2 + 3); }) }), 0, .38, .262);
    root.add(lbl); const inside = new T.Group(); root.add(inside);
    for (let i = 0; i < 7; i++) { const s = mesh(CYL, M(0xd9b46a, { roughness: .6 }), Math.cos(i * 2) * .1, .62, Math.sin(i * 2) * .1, .04, .28, .04); s.rotation.set(.6 * Math.sin(i), 0, .8 * Math.cos(i * 1.3)); inside.add(s); }
    return { root, inside }; }
  function makeTube() { const root = new T.Group(); const s = mesh(CYL, M(0xd9b46a, { roughness: .6 }), 0, 0, 0, .045, .28, .045); s.rotation.x = PI / 2; root.add(s);
    root.add(mesh(new T.CircleGeometry(.034, 16), M(0x8a7458, { roughness: 1 }), 0, 0, .142)); return { root }; }
  // ---------- Querschnitt Niströhre (Studio): halbe Röhre, Lehmwände, Pollen, Kokons mit schlafenden Larven ----------
  function makeSection() { const root = new T.Group(); const tubeM = M(0xd9b46a, { roughness: .6, side: T.DoubleSide }), inner = M(0xf1d7a0, { roughness: .8, side: T.DoubleSide }), mud = M(0x8a7458, { roughness: 1 });
    const half = mesh(new T.CylinderGeometry(.42, .42, 2.7, 40, 1, true, PI / 2, PI), tubeM); half.rotation.set(0, 0, PI / 2); root.add(half);
    const half2 = mesh(new T.CylinderGeometry(.39, .39, 2.7, 40, 1, true, PI / 2, PI), inner); half2.rotation.set(0, 0, PI / 2); root.add(half2);
    const cells = []; for (let i = 0; i < 5; i++) { const x = -1.32 + i * .66; const wall = mesh(new T.CylinderGeometry(.4, .4, .08, 32), mud, x, 0, 0); wall.rotation.z = PI / 2; root.add(wall); }
    const cocM = M(0xa8743e, { roughness: .7 }), pol = M(0xffc21a, { roughness: .9 }), larv = M(0xfff1d6, { roughness: .6 }), blk = M(0x2a1a10);
    for (let i = 0; i < 4; i++) { const x = -.99 + i * .66, c = new T.Group(); c.position.set(x, -.06, 0); root.add(c);
      c.add(sph(pol, .14, -.2, 0, .13, .1, .12)); const coc = sph(cocM, -.06, -.02, 0, .22, .2, .19); c.add(coc);
      const fc = sph(larv, .1, .02, .1, .11, .11, .09); c.add(fc); for (const s of [-1, 1]) { const lid = mesh(new T.TorusGeometry(.022, .006, 6, 12, PI), blk, .12 + s * .045, .04, .19); lid.rotation.set(0, 0, PI); c.add(lid); }
      cells.push(c); }
    root.traverse((x) => { if (x.isMesh) x.castShadow = false; });
    return { root, cells }; }
  // ---------- Infografik-Klötze: links Baumscheibe mit Rissen (Stirnholz), rechts Hartholz seitlich gebohrt ----------
  function makeCrackBlock() { const root = new T.Group(); const m = new T.Mesh(new T.CylinderGeometry(.5, .5, .3, 40), [barkM(), M(0xffffff, { map: ringsTex(8, true), roughness: .85 }), barkM()]); m.rotation.x = PI / 2; m.position.y = .5; m.castShadow = true; root.add(m); return { root }; }
  function makeGood() { const root = new T.Group(); const post = M(0x6f4526, { roughness: .85 }), roof = M(0x4f6b3a, { roughness: .7 }), side = M(0xffffff, { map: sideTex(), roughness: .8 }), plain = M(0xb9824a, { roughness: .8 });
    root.add(mesh(CYL, post, 0, .7, -.05, .05, 1.4, .05)); root.add(mesh(CYL, post, 0, .03, -.05, .25, .06, .25));
    const blk = new T.Mesh(BOX, [plain, plain, plain, plain, side, plain]); blk.position.set(0, 1.62, 0); blk.scale.set(.7, .35, .3); blk.castShadow = blk.receiveShadow = true; root.add(blk);
    const bb = bambooBundle(0); bb.root.position.set(0, 1.27, .01); bb.root.scale.set(1.6, 1.1, 1); root.add(bb.root);
    root.add(mesh(BOX, M(0x9a6438), 0, 1.1, 0, .74, .04, .32)); root.add(mesh(BOX, M(0x9a6438), 0, 1.44, 0, .74, .02, .32));
    for (const s of [-1, 1]) root.add(mesh(BOX, M(0x9a6438), s * .37, 1.43, 0, .03, .7, .32));
    const r = mesh(BOX, roof, 0, 1.84, .06, .9, .05, .52); r.rotation.x = .18; root.add(r);
    return { root }; }
  function makeFlower(col) { const root = new T.Group(); const stemM = M(0x3f9a3a, { roughness: .7 }), petM = M(col, { roughness: .6 }), ctr = M(0xffb21f, { roughness: .8 });
    root.add(mesh(CYL, stemM, 0, .25, 0, .02, .5, .02)); for (const s of [-1, 1]) { const lf = sph(stemM, .07 * s, .18, 0, .1, .018, .045); lf.rotation.z = s * .5; root.add(lf); }
    const head = new T.Group(); head.position.set(0, .5, 0); head.rotation.x = .5; root.add(head); head.add(sph(ctr, 0, .02, 0, .07, .04, .07));
    for (let i = 0; i < 9; i++) { const a = i / 9 * 2 * PI; const p = sph(petM, Math.cos(a) * .12, 0, Math.sin(a) * .12, .08, .012, .035); p.rotation.y = -a; head.add(p); }
    return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bee = actor(makeBee(), "Mauerbiene"); bee2 = actor(makeBee(), "Mauerbiene 2"); bee3 = actor(makeBee(), "Mauerbiene 3");
    hotel = actor(makeHotel(), "Insektenhotel"); ghost = actor(makeGhost(), "Gespenst"); drill = actor(makeDrill(), "Akkuschrauber");
    slice = actor(makeSlice(), "Baumscheibe"); stump = actor(makeStump(), "Hackklotz"); brush = actor(makeBrush(), "Buerste"); bin = actor(makeBin(), "Muelleimer");
    for (let i = 0; i < 4; i++) tubes.push(actor(makeTube(), "Roehrchen " + i));
    section = actor(makeSection(), "Querschnitt"); crackBlock = actor(makeCrackBlock(), "Rissklotz"); good = actor(makeGood(), "Nistholz");
    [0xb07cff, 0xff6fa8, 0xffd23a, 0x5aa8ff, 0xff8a3a].forEach((c, i) => flowers.push(actor(makeFlower(c), "Blume " + i)));
    for (const a of [ghost, drill, slice, brush, bin, section, crackBlock, ...tubes, ...flowers]) a.noCheck = true;
  });
  function reset() { for (const b of [bee, bee2, bee3]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = true; }
    rudi.noCheck = false; rudi.body.position.set(0, 0, 0); rudi.root.rotation.set(0, 0, 0); slice.set(0, false); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const HP = V(.3, 0, -.1);                         // Hotel-Standplatz
  const RX = -.9, RZ = -.05;                       // Rudi links vom Hotel
  function hotelAt() { place(hotel, HP.x, HP.z, 0); hotel.root.updateMatrixWorld(true); }
  function cellW(col, row, dz) { const c = cell(col, row); return V(HP.x + c.x, c.y, HP.z + HD + (dz || 0)); }
  function rudiAt(t, o, x, z, ry) { place(rudi, x ?? RX, z ?? RZ, ry || 0); poseRudi(rudi, t, Object.assign({ arms: [.1, .1], spread: .1, mouth: "smile" }, o || {})); rudi.root.updateMatrixWorld(true); }
  function hand(i) { return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function beeAt(B, p, ry) { B.root.visible = true; B.root.position.copy(p); B.root.rotation.set(0, ry || 0, 0); }
  function sparkle(x, y, s, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a, 0, 1); g.translate(x, y); g.fillStyle = "#fffbe0"; g.shadowColor = "rgba(255,230,120,.9)"; g.shadowBlur = 18;
    g.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? s * .28 : s, an = i * PI / 4; g.lineTo(Math.cos(an) * r, Math.sin(an) * r); } g.closePath(); g.fill(); g.restore(); }
  function star5(x, y, r, fillCol, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.translate(x, y); g.beginPath();
    for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * .45 : r, an = -PI / 2 + i * PI / 5; g.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } g.closePath();
    if (fillCol) { g.fillStyle = fillCol; g.fill(); } g.lineWidth = 5; g.strokeStyle = fillCol ? "#c98a00" : "#b9b4a8"; g.stroke(); g.restore(); }
  // Pfeil-Etikett auf einen Weltpunkt (2D)
  function tag(s, p3, dx, dy, a, col) { if (a <= 0) return; const [x, y] = scr(p3); a = clamp(a, 0, 1); const k = easeBack(a);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a * 2, 0, 1); g.strokeStyle = "#fff"; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx * k, y + dy * k); g.stroke();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); g.font = '900 46px "Montserrat"'; const w = g.measureText(s).width + 40;
    g.translate(x + dx * k, y + dy * k); g.scale(k, k); g.fillStyle = col || "#1d2250"; g.beginPath(); g.roundRect(-w / 2, -36, w, 72, 20); g.fill(); g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 0, 3); g.restore(); }
  function zzz(x, y, t, a) { if (a <= 0) return; for (let i = 0; i < 3; i++) { const ph = (t * .7 + i / 3) % 1; txt("z", x + ph * 50 + i * 6, y - ph * 90, 34 + i * 10, "#ffffff", { a: clamp(a, 0, 1) * Math.sin(ph * PI), w: 900, stroke: 6 }); } }

  // ---------- Hook-Szene (auch Loop): Hotel, Gespenst schwebt aus dem Stroh, Biene davor guckt skeptisch ----------
  function ghostAt(t, q) { ghost.root.visible = true; const c = cellW(1, 0, .05); ghost.root.position.set(c.x + Math.sin(t * 1.3) * .04, c.y - .1 + q * .1 + Math.sin(t * 2.2) * .025, c.z + .16); ghost.root.rotation.set(0, -.35 + Math.sin(t * 1.1) * .15, Math.sin(t * 1.7) * .1); ghost.root.scale.setScalar(.55 + q * .35); }
  function hookScene(p, t) { inYard(); hotelAt(); const q = clamp(p, 0, 1); ghostAt(t, sm(clamp(p * 1.6 + .1, 0, 1)));
    const b = cellW(0, 1, .55); beeAt(bee, V(b.x - .05, b.y - .32 + Math.sin(t * 3) * .03, b.z), -1.1); poseBee(bee, t, { fly: 1, wide: true, look: -.3, sc: 1.05 });
    frameOn([hotel], { az: lerp(.32, .22, q), el: .1, fill: lerp(.74, .84, q), dy: .45, t }); draw(); }
  KZ.shot("hHook", (lt, d, t) => { hookScene(lt / d, t); });
  // 1 Ein-Stern-Bewertung (2D-Karte) vor dem Hotel
  KZ.shot("hReview", (lt, d, t) => { const ph = lt / d; hookScene(1 + ph * .4, t);
    const cp = sm(clamp((lt - .05) / .35, 0, 1)); const cx = W * .42, cy = H * .52;
    if (card(cx, cy, 820, 330, cp, L("REVIEW", "BEWERTUNG"), "#7a5cff")) { const a = clamp(cp, 0, 1);
      for (let i = 0; i < 5; i++) { const sa = i === 0 ? clamp((lt - .5) / .2, 0, 1) : a; star5(cx - 200 + i * 100, cy - 30, 38 * (i === 0 ? easeBack(sa) : 1) + .01, i === 0 ? "#ffd21f" : null, a); }
      const qa = clamp((ph - .22) * 4, 0, 1);
      txt(L("“Rooms full of pine cones.", "„Zimmer voller Zapfen."), cx, cy + 50, 42, "#1d2250", { a: qa, w: 800 });
      txt(L("Never again.”  – Mrs. Mason Bee", "Nie wieder.“  – Frau Mauerbiene"), cx, cy + 105, 34, "#5a5a7a", { a: qa, w: 800 }); } });
  // 2 Rudi stolz neben dem Hotel (Preisschild) -> Nahaufnahme, Etiketten Zapfen / Stroh / Ziegel
  KZ.shot("hBuy", (lt, d, t) => { const ph = lt / d;
    if (ph < .38) { const k = ph / .38; inYard(); hotelAt(); rudiAt(t, { arms: [.2, lerp(.3, 1.5, sm(clamp(k / .4, 0, 1)))], spread: .1, mouth: "smile", nod: .05 });
      frameOn([rudi, hotel], { az: lerp(.5, .44, k), el: .1, fill: lerp(.9, .96, k), t }); draw();
      const top = scr(V(HP.x, H0 + 1.3, HP.z)); for (let i = 0; i < 3; i++) sparkle(top[0] + Math.cos(i * 2.1 + t) * 110, top[1] + Math.sin(i * 1.7 + t) * 70, 24, Math.sin(t * 5 + i * 1.9));
      stamp(L("$9.99", "9,99 €"), W * .42, H * .17, (lt - .1) / .3, "#2f6fd0", -.06); return; }
    const k = (ph - .38) / .62; inYard(); hotelAt();
    frameOn([hotel], { az: lerp(.18, .1, k), el: .08, fill: lerp(.68, .76, k), dy: .45, t }); draw();
    tag(L("PINE CONES", "ZAPFEN"), cellW(0, 0, .02), -60, -150, (k - .05) * 4, "#8a5a2e");
    tag(L("STRAW", "STROH"), cellW(1, 0, .02), 40, -230, (k - .3) * 4, "#c99a10");
    tag(L("BRICKS", "LOCHZIEGEL"), cellW(0, 1, .02), 30, 330, (k - .55) * 4, "#c2502f"); });
  // 3 Mauerbiene fliegt ans Hotel, schaut in die Zapfen, dreht ab
  KZ.shot("hNope", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); hotelAt();
    const c = cellW(0, 0, .3); let p, ry;
    if (ph < .4) { const a = sm(ph / .4); p = V(c.x - 1.0 + a * 1.0, c.y + .3 - a * .38, c.z + .5 - a * .45); ry = -.5 - a * 1.0; }
    else if (ph < .62) { p = V(c.x, c.y - .08 + Math.sin(t * 3) * .02, c.z + .05); ry = -PI / 2 + Math.sin(t * 2) * .2; }
    else { const a = sm((ph - .62) / .38); p = V(c.x + a * .45, c.y - .08 + a * .3, c.z + .05 + a * .5); ry = -PI / 2 + a * 1.0; }
    beeAt(bee, p, ry); poseBee(bee, t, { fly: 1, wide: ph >= .4 && ph < .62, grumpy: ph >= .62, sc: 1.1 });
    frameOn([hotel], { az: lerp(.25, .15, k), el: .1, fill: lerp(.66, .74, k), dy: .5, t }); draw();
    if (ph < .62) stamp(L("CHECK-IN?", "CHECK-IN?"), W * .42, H * .17, (lt - .1) / .3, "#2f6fd0", -.06);
    else stamp(L("NOPE!", "NÖ!"), W * .42, H * .17, (ph - .62) * d / .3, "#e5484d", .07); });
  // 4 Rudi bohrt mit dem Akkuschrauber in die Baumscheibe auf dem Hackklotz
  const SX = .35, SZ = -.05;
  function sliceAt() { place(stump, SX, SZ, 0); place(slice, SX, SZ, 0); slice.root.updateMatrixWorld(true); }
  function faceW(u, v) { return V(SX + (u - 128) / 256 * .84, SLY + .42 - (v - 128) / 256 * .84, SZ + .09); }
  KZ.shot("hDrill", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); sliceAt();
    const n = Math.floor(clamp((ph - .2) / .7, 0, 1) * 6); slice.set(n, false);
    rudiAt(t, { arms: [.2, 1.45 + Math.sin(t * 30) * .02], spread: .02, mouth: "smile", lean: -.05 }, -.68, .36, -.25);
    const hp = hand(1); drill.root.visible = true; drill.root.position.copy(hp); drill.root.rotation.set(0, -.25 - .55, 0); drill.bit.rotation.x = t * 40;
    frameOn([rudi, stump, slice], { az: lerp(.5, .42, k), el: .12, fill: lerp(.9, .97, k), t }); draw();
    if (ph > .2) { const [x, y] = scr(V(SX - .1, SLY + .45, SZ + .1)); for (let i = 0; i < 6; i++) { const a = (t * 3 + i * .37) % 1; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1 - a; g.fillStyle = "#e8c48c"; g.beginPath(); g.ellipse(x - a * 120 + i * 9, y + a * a * 220 - a * 40, 9, 5, i, 0, 7); g.fill(); g.restore(); } }
    stamp(L("BRRRRR!", "BRRRRR!"), W * .42, H * .17, (lt - .15) / .3, "#ff9f1c", -.06); });
  // 5 Nahaufnahme: Holz reißt, Biene kriecht rein, kommt mit eingerissenem Flügel raus
  KZ.shot("hCrack", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); sliceAt(); const cr = ph > .18; slice.set(8, cr);
    const hole = faceW(128, 128); let p, ry, o;
    if (ph < .35) { const a = sm(clamp((ph - .05) / .3, 0, 1)); p = V(hole.x + .7 - a * .7, hole.y + .25 - a * .3, hole.z + .35 - a * .2); ry = -PI / 2 - .4; o = { fly: 1, sc: 1.1 }; }
    else if (ph < .55) { p = V(hole.x, hole.y - .06, hole.z + .1); ry = -PI / 2; o = { sc: 1.1, wide: true }; }
    else { const a = sm(clamp((ph - .55) / .3, 0, 1)); p = V(hole.x + a * .25, hole.y - .06 + a * .05, hole.z + .1 + a * .15); ry = -PI / 2 + .6; o = { sc: 1.1, sad: true, torn: true }; }
    beeAt(bee, p, ry); poseBee(bee, t, o);
    frameOn([slice], { az: lerp(.25, .15, k), el: .06, fill: lerp(.62, .7, k), dy: .05, t }); draw();
    if (ph < .55) stamp(L("CRACK!", "KNACK!"), W * .42, H * .17, (ph - .18) * d / .3, "#e5484d", -.06);
    else stamp(L("OUCH!", "AUA!"), W * .42, H * .17, (ph - .6) * d / .3, "#7a5cff", .07); });
  // 6 Rudi putzt das Hotel, Röhrchen fliegen in den Müll
  const BX = 1.2, BZ = .35;
  KZ.shot("hClean", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); hotelAt(); place(bin, BX, BZ, -.4); bin.inside.visible = ph > .5;
    const a = 1.65 + Math.sin(t * 14) * .14; rudiAt(t, { arms: [.2, a], spread: .02, mouth: "smile" }, -.72, .3, -.15); rudi.arms[1].rotation.x += Math.sin(t * 7) * .12; rudi.root.updateMatrixWorld(true);
    const hp = hand(1); brush.root.visible = true; brush.root.position.copy(hp); brush.root.rotation.set(0, 0, a - .2 + PI);
    const caps = hotel.bamboo.caps; const out = Math.floor(clamp(ph / .7, 0, 1) * 4); caps.forEach((c, i) => c.cap.visible = !(c.sealed && i < out));
    tubes.forEach((tb, i) => { const st = i * .17 + .05, q = clamp((ph - st) / .3, 0, 1); tb.root.visible = q > 0 && q < 1; if (!tb.root.visible) return;
      const from = cellW(0, 2, 0), to = V(BX, .7, BZ); const pp = from.clone().lerp(to, q); pp.y += Math.sin(q * PI) * .9; tb.root.position.copy(pp); tb.root.rotation.set(q * 9, q * 5, 0); });
    frameOn([rudi, hotel, bin], { az: lerp(.4, .34, k), el: .14, fill: lerp(.92, .98, k), t }); draw();
    stamp(L("CLEAN-UP!", "PUTZTAG!"), W * .42, H * .17, (lt - .1) / .3, "#36b37e", -.06); });
  // 7 Studio: Querschnitt der zugemauerten Röhre, Kokons schlafen + Beschriftung
  KZ.shot("hBabies", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    section.root.visible = true; section.root.position.set(0, .85, 0); section.root.rotation.set(.12, -.08, 0);
    section.cells.forEach((c, i) => { const pk = clamp((ph - .15 - i * .1) / .2, 0, 1); c.scale.setScalar(easeBack(pk) + .001); c.rotation.z = Math.sin(t * 1.5 + i) * .04; });
    frameOn([section], { az: lerp(.12, .04, k), el: .18, fill: lerp(.8, .88, k), dy: -.1, t }); draw();
    section.cells.forEach((c, i) => { const p = c.localToWorld(V(.1, .2, .1)); const [x, y] = scr(p); zzz(x + 20, y - 30, t + i * .3, (ph - .3 - i * .1) * 4); });
    stamp(L("BABIES!", "BABYS!"), W * .42, H * .17, (ph - .35) * d / .3, "#ff6fa8", -.06);
    const w0 = section.root.localToWorld(V(-1.32, .4, 0)), c0 = section.cells[0].localToWorld(V(.14, -.2, 0)), k0 = section.cells[2].localToWorld(V(-.06, -.15, .1));
    tag(L("MUD WALL", "LEHMWAND"), w0, 40, -170, (ph - .1) * 4, "#8a7458");
    tag(L("POLLEN", "POLLEN"), c0, 0, 300, (ph - .45) * 4, "#e0a800");
    tag(L("COCOON", "KOKON"), k0, 60, 260, (ph - .6) * 4, "#a8743e"); });
  // 8 Pointe: Rudi mit vollem Mülleimer, Schreck + NABU-Karte
  KZ.shot("hEvict", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); place(bin, .25, .05, -.3); bin.inside.visible = true;
    const proud = ph < .35; rudiAt(t, proud ? { arms: [.2, 1.5], spread: .1, mouth: "smile", nod: .05 } : { arms: [2.75, .2], spread: .1, mouth: "o", wide: true, tilt: -.1 }, -.6, -.1, 0);
    frameOn([rudi, bin], { az: lerp(.5, .44, k), el: .12, fill: lerp(.66, .7, k), dy: -.55, t }); draw();
    if (proud) stamp(L("SPOTLESS", "BLITZBLANK"), W * .42, H * .17, (lt - .1) / .3, "#36b37e", -.06);
    else stamp(L("EVICTED", "RAUSGEWORFEN"), W * .42, H * .17, (ph - .35) * d / .3, "#e5484d", .06);
    const cp = sm((lt - d * .4) / .3); if (card(W * .42, H * .615, 860, 250, cp, "NABU", "#2f6fd0")) { const a = clamp(cp, 0, 1); const Y = H * .615;
      if (L("en", "de") === "de") { txt("Übers Ausputzen von Nisthilfen:", W * .42, Y - 2, 36, "#1d2250", { a }); txt("„Die sicherste Insekten-Vernichtungs-", W * .42, Y + 44, 36, "#1d2250", { a }); txt("Methode ohne Chemie-Einsatz!“", W * .42, Y + 88, 36, "#1d2250", { a }); }
      else { txt("On cleaning out bee hotels:", W * .42, Y - 2, 36, "#1d2250", { a }); txt("“The surest way to wipe out", W * .42, Y + 44, 36, "#1d2250", { a }); txt("insects without chemicals!”", W * .42, Y + 88, 36, "#1d2250", { a }); } } });
  // 9 Studio: Vergleich Stirnholz mit Rissen (X) vs. Hartholz seitlich gebohrt (Haken) + Maße
  KZ.shot("hWood", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(crackBlock, -.75, 0, .15); good.root.visible = true; good.root.position.set(.55, -1.0, 0); good.root.rotation.set(0, -.1, 0); good.root.scale.setScalar(1);
    frameOn([crackBlock, good], { az: lerp(.1, .02, k), el: .1, fill: lerp(.84, .9, k), dy: .1, t }); draw();
    const pc = scr(V(-.75, .5, .2)), pg = scr(V(.55, .62, .2));
    const xa = clamp((ph - .1) * 4, 0, 1); if (xa > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = xa; g.strokeStyle = "#e5484d"; g.lineWidth = 22; g.lineCap = "round"; const s = 70 * easeBack(xa);
      g.beginPath(); g.moveTo(pc[0] - s, pc[1] - s); g.lineTo(pc[0] + s, pc[1] + s); g.moveTo(pc[0] + s, pc[1] - s); g.lineTo(pc[0] - s, pc[1] + s); g.stroke(); g.restore(); }
    const ca = clamp((ph - .3) * 4, 0, 1); if (ca > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = ca; g.strokeStyle = "#36b37e"; g.lineWidth = 24; g.lineCap = "round"; g.lineJoin = "round"; const s = 60 * easeBack(ca);
      g.beginPath(); g.moveTo(pg[0] - s, pg[1] - 260); g.lineTo(pg[0] - s * .2, pg[1] - 260 + s * .8); g.lineTo(pg[0] + s * 1.1, pg[1] - 260 - s * .9); g.stroke(); g.restore(); }
    stamp(L("HARDWOOD", "HARTHOLZ"), W * .42, H * .17, (lt - .1) / .3, "#36b37e", -.06);
    txt(L("3–9 mm  ·  10 cm deep", "3–9 mm  ·  10 cm tief"), W * .42, H * .64, 50, "#ffffff", { a: clamp((ph - .5) * 4, 0, 1), w: 900, stroke: 10 }); });
  // 10 Tipp: gutes Nistholz in der Sonne, Blumen, Bienen fliegen ein; am Ende Schnee + "Finger weg"
  KZ.shot("hTip", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); place(good, HP.x, HP.z, 0);
    const fp = [[-.55, .35], [-.3, .55], [.9, .4], [1.15, .1], [-.75, 0]]; flowers.forEach((f, i) => { place(f, HP.x + fp[i][0], HP.z + fp[i][1], i); f.root.scale.setScalar(1.6 + (i % 2) * .3); f.root.rotation.z = Math.sin(t * 1.5 + i) * .05; });
    const hl = V(HP.x - .17, 1.62, HP.z + .2), hr = V(HP.x + .2, 1.56, HP.z + .2);
    [[bee, hl, 0], [bee2, hr, .5], [bee3, V(HP.x, 1.3, HP.z + .2), .25]].forEach(([B, h, off], i) => { const q = ((t * .35 + off) % 1); const a = sm(clamp(q / .7, 0, 1));
      const p = V(h.x + (1 - a) * [-.5, .5, -.5][i], h.y + (1 - a) * .4, h.z + (1 - a) * .6 + .02); beeAt(B, p, i === 1 ? -PI / 2 - .6 * (1 - a) : -PI / 2 + .6 * (1 - a)); B.root.visible = q < .85; poseBee(B, t + i, { fly: a < .98 ? 1 : 0, sc: 1.0 }); });
    frameOn([good], { az: lerp(.3, .2, k), el: .1, fill: lerp(.62, .7, k), dy: .3, t }); draw();
    const sun = ph < .6; if (sun) { stamp(L("SUNNY", "SONNIG"), W * .42, H * .17, (lt - .1) / .3, "#ff9f1c", -.06); }
    else { const sa = clamp((ph - .6) * 5, 0, 1); for (let i = 0; i < 40; i++) { const x = (i * 197) % (W - 220) + 40, y = ((t * 120 + i * 131) % (H * .7)) + 80; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = sa * .9; g.fillStyle = "#fff"; g.beginPath(); g.arc(x + Math.sin(t * 2 + i) * 14, y, 6 + (i % 3) * 3, 0, 7); g.fill(); g.restore(); }
      stamp(L("HANDS OFF", "FINGER WEG"), W * .42, H * .17, (ph - .6) * d / .3, "#2f6fd0", .06); } });
  // 11 Loop: zurück in die Hook-Einstellung
  KZ.shot("hLoop", (lt, d, t) => { const ph = lt / d; hookScene(lerp(-.4, 0, ph), t);
    if (ph > .15 && ph < .7) stamp(L("0 GUESTS", "0 GÄSTE"), W * .42, H * .17, (ph - .15) * d / .3, "#7a5cff", -.06); });

  window.__beehotel3d = true;
})();
