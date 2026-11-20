// 3D-Szene "Why Your Guinea Pig Should Never Live Alone" / "Warum dein Meerschweinchen nie allein leben darf" (20.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Meerschweinchen (Grundform aus dem Video vom 18.11., jetzt mit wählbaren Farben: dreifarbig, sandfarben, schwarz-weiß, rotbraun …),
// Gehege mit Gitter, Holzhäuschen zum Verstecken, Spiegel (Spiegelbild = zweite, gespiegelte Figur hinter halbdurchsichtigem Glas),
// Rudi im Meerschweinchen-Kostüm (Kapuze mit Ohren, rosa Nase, Fell-Jacke), Herde im Studio, Schweizer Fahne, "Zu vermieten"-Schild.
// Quellen: RSPCA (Guinea pigs / Keeping guinea pigs together), Schweizer Tierschutzverordnung 2008 (swissinfo 2019, BLV), Miet-Service Priska Küng (SPIEGEL/ABC 2011).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, canvasTex, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let gp, gp2, refl, bigGp, herd = [], rudi, run, house, mirror, flag, sign, stars, costume, notes;

  // ---------- Meerschweinchen (rundlich, kein Schwanz, kurze Beine, kleine Hängeohren, Blesse) ----------
  // c = {a: Hauptfarbe (Kopf/Schulter), b: Grundfarbe Körper, d: Hinterteil-Fleck}
  function makeGp(c) {
    c = c || {}; const A = c.a ?? 0xe8923a, B = c.b ?? 0xfbf4ea, D = c.d ?? 0x4a3122;
    const org = M(A, { roughness: .85 }), wht = M(B, { roughness: .9 }), drk = M(D, { roughness: .85 }), pink = M(0xf3a0a6, { roughness: .6 });
    const eyeM = M(0x1a0f0c, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(wht, -.02, .13, 0, .22, .125, .145));
    body.add(sph(org, .05, .145, 0, .15, .12, .15));
    body.add(sph(drk, -.14, .15, 0, .1, .11, .148));
    body.add(sph(org, -.07, .22, 0, .09, .05, .1));
    const feet = []; for (const [x, s] of [[.1, -1], [.1, 1], [-.12, -1], [-.12, 1]]) { const f = sph(pink, x, .018, s * .08, .035, .018, .03); body.add(f); feet.push(f); }
    const head = new T.Group(); head.position.set(.17, .15, 0); body.add(head);
    head.add(sph(org, 0, 0, 0, .12, .108, .112));
    head.add(sph(wht, .055, .01, 0, .085, .085, .05));
    head.add(sph(wht, .095, -.025, 0, .055, .055, .07));
    const nose = sph(pink, .145, -.008, 0, .018, .014, .022); head.add(nose);
    const mo = mesh(new T.TorusGeometry(.013, .004, 6, 12, PI), M(0x6a3a30), .145, -.05, 0); mo.rotation.set(0, PI / 2, PI); head.add(mo);
    const oMouth = sph(M(0x5a1a22), .145, -.055, 0, .012, .02, .018); head.add(oMouth);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.05, .035, s * .088); head.add(e);
      e.add(sph(eyeM, 0, 0, 0, .036, .04, .026)); e.add(sph(hl, .018, .016, .014 * s, .01)); eyes.push(e); }
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.03, .075, s * .085); head.add(e);
      const ear = sph(M(new T.Color(A).multiplyScalar(.85).getHex(), { roughness: .8 }), 0, .012, s * .012, .04, .028, .016); ear.rotation.x = s * .6; e.add(ear); ears.push(e); }
    const wh = M(0xffffff, { roughness: .4 }); for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { const w = mesh(CYL, wh, .11, -.03 + i * .02, s * .07, .003, .11, .003); w.rotation.x = s * (PI / 2 - .2 + i * .25); w.castShadow = false; head.add(w); }
    return { root, body, head, eyes, ears, nose, mo, oMouth, feet };
  }
  // o: {wide, lid, shake, wheek, look, nod, sc, run, hop (Popcorn-Sprung 0..1), sad}
  function poseGp(G, t, o) {
    o = o || {};
    const sh = o.shake ? Math.sin(t * 60) * .012 : 0;
    G.head.rotation.set(0, o.look || 0, (o.nod || 0) + (o.sad ? -.18 : 0) + Math.sin(t * 2.1) * .03);
    G.nose.scale.set(.018, .014 * (1 + Math.sin(t * 18) * .2), .022);
    const lid = o.lid ?? (Math.sin(t * 1.3 + 2) > .985 ? .85 : 0);
    G.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.25 : 1), o.wide ? 1.1 : 1));
    const w = !!o.wheek; G.oMouth.visible = w; G.mo.visible = !w;
    G.ears.forEach((e, i) => { e.rotation.z = Math.sin(t * 3 + i) * .08 + (o.sad ? -.25 : 0); });
    const r = o.run || 0; G.feet.forEach((f, i) => { f.position.y = .018 + Math.max(0, Math.sin(t * 20 + i * 1.7)) * .03 * r; });
    const hop = o.hop || 0;
    G.body.position.set(sh, Math.sin(t * 2.4) * .004 + r * Math.abs(Math.sin(t * 20)) * .015 + hop * .22, 0);
    G.body.rotation.z = hop * .25 * Math.sin(t * 9);
    G.body.scale.set(1, o.sad ? .94 : 1, 1);
    G.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Kulissen ----------
  function wireTex() { return canvasTex(256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = "#d8dde3"; c.lineWidth = 5; for (let i = 0; i <= w; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } }); }
  function wirePlane(w, h, rep) { const tx = wireTex(); tx.wrapS = tx.wrapT = T.RepeatWrapping; tx.repeat.set(rep * w, rep * h);
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: tx, transparent: true, alphaTest: .4, side: T.DoubleSide, metalness: .5, roughness: .4 })); m.castShadow = false; return m; }
  function makeRun(X0, X1, Z0, Z1, HH) { const root = new T.Group(); const post = M(0x8a5a33, { roughness: .7 });
    { const st = mesh(new T.PlaneGeometry(X1 - X0, Z1 - Z0), M(0xe8d27a, { roughness: 1 }), (X0 + X1) / 2, .006, (Z0 + Z1) / 2); st.rotation.x = -PI / 2; st.castShadow = false; root.add(st); } // Heu-Einstreu
    for (const [x, z] of [[X0, Z0], [X1, Z0], [X0, Z1], [X1, Z1]]) root.add(mesh(BOX, post, x, HH / 2, z, .05, HH, .05));
    const side = (x, z, w, ry) => { const p = wirePlane(w, HH, 5); p.position.set(x, HH / 2, z); p.rotation.y = ry; root.add(p); const rail = mesh(BOX, post, x, HH, z, w, .035, .035); rail.rotation.y = ry; root.add(rail); };
    side((X0 + X1) / 2, Z1, X1 - X0, 0); side((X0 + X1) / 2, Z0, X1 - X0, 0); side(X1, (Z0 + Z1) / 2, Z1 - Z0, PI / 2); side(X0, (Z0 + Z1) / 2, Z1 - Z0, PI / 2);
    return { root }; }
  // Holzhäuschen, Tür nach +x
  function makeHouse() { const root = new T.Group(); const wood = M(0xc98b4f, { roughness: .75 }), dk = M(0x8a5a33, { roughness: .7 }), roof = M(0x2f9e6f, { roughness: .6 });
    const Wd = .42, Dp = .36, Hh = .3;
    root.add(mesh(BOX, wood, -Wd / 2, Hh / 2, 0, .03, Hh, Dp));                  // Rückwand
    root.add(mesh(BOX, wood, 0, Hh / 2, -Dp / 2, Wd, Hh, .03));                  // Seiten
    root.add(mesh(BOX, wood, 0, Hh / 2, Dp / 2, Wd, Hh, .03));
    root.add(mesh(BOX, wood, Wd / 2, Hh / 2, -Dp / 2 + .05, .03, Hh, .1));       // Front links/rechts der Tür
    root.add(mesh(BOX, wood, Wd / 2, Hh / 2, Dp / 2 - .05, .03, Hh, .1));
    root.add(mesh(BOX, wood, Wd / 2, Hh - .04, 0, .03, .08, Dp));                // Sturz
    for (const s of [-1, 1]) { const r = mesh(BOX, roof, 0, Hh + .07, s * .1, Wd + .1, .03, .26); r.rotation.x = s * .55; root.add(r); }
    root.add(mesh(BOX, dk, Wd / 2 + .005, .006, 0, .05, .012, .18));
    return { root }; }
  // Spiegel (Glas zeigt nach +z), Rahmen golden
  function makeMirror() { const root = new T.Group(); const gold = M(0xd9a441, { metalness: .7, roughness: .3 });
    const Wm = .7, Hm = .55;
    root.add(mesh(BOX, gold, 0, Hm / 2 + .02, -.02, Wm + .08, .05, .05)); root.add(mesh(BOX, gold, 0, Hm + .06, -.02, Wm + .08, .05, .05));
    root.add(mesh(BOX, gold, -Wm / 2 - .02, Hm / 2 + .04, -.02, .05, Hm + .05, .05)); root.add(mesh(BOX, gold, Wm / 2 + .02, Hm / 2 + .04, -.02, .05, Hm + .05, .05));
    root.children[0].position.y = .02;
    const glass = new T.Mesh(new T.PlaneGeometry(Wm, Hm), new T.MeshStandardMaterial({ color: new T.Color(0xbfe3ff).convertSRGBToLinear(), transparent: true, opacity: .22, metalness: .9, roughness: .05 }));
    glass.position.set(0, Hm / 2 + .04, -.02); glass.castShadow = false; root.add(glass);
    const shine = new T.Mesh(new T.PlaneGeometry(.06, Hm * .9), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .35 })); shine.position.set(-.18, Hm / 2 + .04, -.015); shine.rotation.z = -.5; root.add(shine);
    for (const s of [-1, 1]) root.add(mesh(BOX, gold, s * .25, .01, -.12, .04, .02, .22));
    return { root }; }
  // Schweizer Fahne am Mast
  function makeFlag() { const root = new T.Group(); const pole = M(0xe6e6e6, { metalness: .6, roughness: .3 });
    root.add(mesh(CYL, pole, 0, .75, 0, .025, 1.5, .025)); root.add(sph(M(0xffd23f, { metalness: .5, roughness: .3 }), 0, 1.52, 0, .045));
    const tex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#e5262b"; c.fillRect(0, 0, w, h); c.fillStyle = "#fff"; c.fillRect(w * .4, h * .19, w * .2, h * .62); c.fillRect(w * .19, h * .4, w * .62, h * .2); });
    const geo = new T.PlaneGeometry(.6, .6, 12, 1); const cloth = new T.Mesh(geo, new T.MeshStandardMaterial({ map: tex, side: T.DoubleSide, roughness: .7 })); cloth.position.set(.31, 1.2, 0); root.add(cloth);
    const base = geo.attributes.position.array.slice();
    return { root, cloth, wave(t) { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const x = base[i * 3]; p.setZ(i, Math.sin(t * 5 - x * 9) * .04 * (x + .3)); } p.needsUpdate = true; } }; }
  // Schild "zu vermieten" auf Stab
  function makeSign() { const root = new T.Group(); const wood = M(0x8a5a33, { roughness: .7 });
    root.add(mesh(CYL, wood, 0, .3, 0, .02, .6, .02));
    const tex = canvasTex(512, 256, (c, w, h) => { c.fillStyle = "#ffd23f"; c.beginPath(); c.roundRect(6, 6, w - 12, h - 12, 30); c.fill(); c.strokeStyle = "#1d2250"; c.lineWidth = 10; c.stroke();
      c.fillStyle = "#1d2250"; const s = L("FOR RENT", "ZU MIETEN"); c.font = `900 ${s.length > 8 ? 70 : 84}px "Montserrat"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s, w / 2, h / 2 + 4); });
    const bd = new T.Mesh(new T.PlaneGeometry(.56, .28), new T.MeshStandardMaterial({ map: tex, roughness: .6, side: T.DoubleSide })); bd.position.set(0, .66, .012); root.add(bd);
    root.add(mesh(BOX, wood, 0, .66, 0, .58, .3, .02));
    return { root }; }
  function makeStars() { const root = new T.Group(); const list = []; const s = new T.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? .4 : 1, a = i / 10 * 2 * PI - PI / 2; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    const geo = new T.ExtrudeGeometry(s, { depth: .3, bevelEnabled: false }); geo.center();
    for (let i = 0; i < 4; i++) { const m = mesh(geo, M(0xffd23f, { emissive: 0x8a6a00, roughness: .3 })); m.scale.setScalar(.05); m.castShadow = false; root.add(m); list.push(m); } return { root, list }; }
  // Rudis Meerschweinchen-Kostüm: Kapuze (nur hinten/seitlich, Gesicht frei), Öhrchen, rosa Nase, Barthaare
  function makeCostume(R) { const grp = new T.Group(); R.head.add(grp);
    const fur = M(0xe8923a, { roughness: .9, side: T.DoubleSide }), wht = M(0xfbf4ea, { roughness: .9 }), pink = M(0xf3a0a6, { roughness: .6 });
    const hood = new T.Mesh(new T.SphereGeometry(.37, 32, 20, -PI / 2 - .3, PI + .6, 0, PI * .62), fur); hood.position.set(-.02, .02, 0); hood.castShadow = false; grp.add(hood);
    grp.add(sph(wht, -.05, .36, 0, .12, .05, .14));                                  // weiße Blesse oben
    for (const s of [-1, 1]) { const e = sph(M(0xd07a32, { roughness: .8 }), -.08, .3, s * .3, .1, .07, .04); e.rotation.x = s * .7; grp.add(e); }
    grp.add(sph(pink, .345, -.02, 0, .055, .045, .065));                              // rosa Nase über Rudis Nase
    const wh = M(0xffffff, { roughness: .4 }); for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { const w = mesh(CYL, wh, .33, -.06 + i * .04, s * .1, .006, .26, .006); w.rotation.x = s * (PI / 2 - .25 + i * .3); w.castShadow = false; grp.add(w); }
    grp.visible = false; return grp; }
  // Musiknoten/Sprechbögen fürs Quieken (2D)
  function wheekText(s, x, y, p, col) { if (p <= 0) return; txt(s, x, y - p * 30, 58, col || "#ffffff", { stroke: 10, a: clamp(Math.sin(clamp(p, 0, 1) * PI) * 2, 0, 1), w: 900 }); }

  K3.onBuild(() => {
    rudi = K3.rudi;
    gp = actor(makeGp(), "Meerschwein"); gp2 = actor(makeGp({ a: 0xd9b27c, b: 0xf3e3c6, d: 0xb07a45 }), "Meerschwein 2");
    refl = actor(makeGp(), "Spiegelbild"); bigGp = actor(makeGp(), "Meerschwein gross");
    const cols = [{ a: 0xd9b27c, b: 0xf3e3c6, d: 0xb07a45 }, { a: 0x3b2a22, b: 0xfbf4ea, d: 0x3b2a22 }, { a: 0xb5562a, b: 0xe6a46a, d: 0x7a3a1c }, {}, { a: 0x8a8f99, b: 0xfbf4ea, d: 0x5a5f69 }, { a: 0xe8c14a, b: 0xfbf4ea, d: 0xb07a45 }];
    herd = cols.map((c, i) => actor(makeGp(c), "Herde " + i));
    run = actor(makeRun(-.85, .85, -.55, .55, .32), "Gehege"); house = actor(makeHouse(), "Haeuschen"); mirror = actor(makeMirror(), "Spiegel");
    flag = actor(makeFlag(), "Fahne"); sign = actor(makeSign(), "Schild"); stars = actor(makeStars(), "Sterne");
    costume = makeCostume(rudi);
    for (const a of [run, house, mirror, flag, sign, stars, refl]) a.noCheck = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  let yelCol = null;
  function suit(on) { if (!yelCol) yelCol = rudi.yel.color.clone(); costume.visible = on; rudi.yel.color.copy(on ? new T.Color(0xe8923a).convertSRGBToLinear() : yelCol); }
  function reset() { rudi.noCheck = false; suit(false); refl.root.scale.set(1, 1, 1);
    for (const b of [gp, gp2, refl, bigGp, ...herd]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = b === refl; } }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function costumeOn(t, o) { poseRudi(rudi, t, o); rudi.hat.visible = false; suit(true); }

  // ---------- Shots ----------
  // 0 Hook: ein einzelnes Meerschweinchen im großen, leeren Gehege, quiekt in die Leere
  KZ.shot("aHook", (lt, d, t) => { inYard(); const ph = lt / d;
    place(run, 0, 0, 0); place(house, -.55, -.25, 0);
    const wk = Math.sin(t * 6) > .2; at(gp, .15, 0, .1, .5); poseGp(gp, t, { wheek: wk, look: Math.sin(t * 1.5) * .35, sad: ph > .55 });
    frameOn([FR(-.75, 0, -.45, .75, .5, .45)], { az: lerp(.3, .22, ph), el: lerp(.36, .3, ph), fill: lerp(1.05, 1.15, ph), t }); draw();
    if (ph > .15) wheekText(L("WHEEK?", "QUIEK?"), W * .5, H * .36, ((lt - d * .15) % 1.1) / 1.1, "#ffd23f");
    if (ph > .45) stamp(L("ALONE", "ALLEIN"), W * .42, H * .62, (ph - .45) * d / .3, "#7a5cff", -.06); });
  // 1 Rudi steht stolz am Gehege: "Ich bin doch da!" – Meerschweinchen quiekt weiter
  KZ.shot("aRudi", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    at(gp, .15, 0, .45, PI - .7); poseGp(gp, t, { wheek: Math.sin(t * 6) > .3, look: .2, sad: true, sc: 1.4 });
    place(rudi, -.85, .1, -.25); poseRudi(rudi, t, { arms: [.2, 1.2 + Math.sin(t * 3) * .1], spread: .15, mouth: "smile", tilt: -.06 });
    frameOn([rudi, gp], { az: lerp(.6, .52, k), el: .14, fill: lerp(.9, .95, k), t }); draw();
    stamp(L("I'M ENOUGH!", "ICH REICHE!"), W * .42, H * .17, (lt - .25) / .3, "#ff9f1c", -.06); });
  // 2 Spiegel: Rudi stellt den Spiegel rein; Schnitt: Meerschweinchen quiekt sein Spiegelbild an – keine Antwort
  KZ.shot("aMirror", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .42;
    if (!half) { const k = sm(ph / .42); place(mirror, .25, -.15, 0); mirror.root.scale.setScalar(1.3);
      place(rudi, -.85, .15, .15); poseRudi(rudi, t, { arms: [1.0 + Math.sin(t * 4) * .1, 1.0], spread: .2, mouth: "smile" });
      at(gp, .4, 0, .45, PI / 2 + .3); poseGp(gp, t, { wide: true, look: -.2 });
      frameOn([rudi, mirror, gp], { az: lerp(.42, .36, k), el: .14, fill: lerp(.9, .95, k), t }); draw(); mirror.root.scale.setScalar(1);
      stamp(L("MIRROR!", "SPIEGEL!"), W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", -.06); }
    else { const k = (ph - .42) / .58; place(mirror, 0, 0, 0);
      const wk = Math.sin(t * 7) > 0; at(gp, .05, 0, .26, PI / 2); poseGp(gp, t, { wheek: wk, wide: true });
      // Spiegelbild: gleiche Haltung, an der Glasebene (z = -.02) gespiegelt, Mund bleibt zu ("keine Antwort")
      at(refl, .05, 0, -.3, -PI / 2); poseGp(refl, t, { wide: true }); refl.root.scale.set(1, 1, -1);
      frameOn([mirror, gp], { az: lerp(.62, .52, k), el: .12, fill: lerp(.95, 1.02, k), t }); draw();
      wheekText(L("WHEEK!", "QUIEK!"), W * .36, H * .34, (k * d * .58 % .9) / .9, "#ffd23f");
      if (k > .5) stamp(L("NO ANSWER", "KEINE ANTWORT"), W * .42, H * .17, (k - .5) * d * .58 / .3, "#e5484d", .06); } });
  // 3 Kostüm: Rudi im Meerschweinchen-Kostüm quiekt; Schnitt: Meerschweinchen flitzt ins Häuschen, nur die Nase guckt raus
  KZ.shot("aSuit", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .5;
    if (!half) { const k = sm(ph / .5); place(rudi, -.75, 0, -.1); costumeOn(t, { arms: [1.1 + Math.sin(t * 6) * .15, 1.1 - Math.sin(t * 6) * .15], spread: .25, mouth: "o", lean: Math.sin(t * 6) * .04 });
      at(gp, .4, 0, .6, PI - .3); poseGp(gp, t, { wide: true, shake: ph > .3, sc: 1.3 });
      frameOn([rudi, gp], { az: lerp(.5, .42, k), el: .12, fill: lerp(.9, .95, k), t }); draw();
      wheekText(L("SQUEAK!", "QUIEK!"), W * .66, H * .3, ((lt) % .9) / .9, "#ff5d8f");
      stamp(L("COSTUME", "KOSTÜM"), W * .42, H * .17, (lt - .3) / .3, "#ff9f1c", -.06); }
    else { const k = (ph - .5) / .5; place(house, 0, 0, 0); house.root.rotation.y = .9;
      const go = sm(clamp(k / .3, 0, 1)); // flitzt rein
      const hx = .9 * Math.cos(.9), hz = -.9 * Math.sin(.9); // Tür-Richtung in Weltkoordinaten
      at(gp, lerp(.55, .12, go) * Math.cos(.9), 0, -lerp(.55, .12, go) * Math.sin(.9), PI + .9); gp.noCheck = true;
      poseGp(gp, t, { run: go < 1 ? 1 : 0, wide: true, shake: go >= 1 });
      frameOn([house, FR(-.35, 0, -.35, .35, .45, .35)], { az: lerp(.95, 1.05, k), el: .18, fill: lerp(.85, .9, k), t }); draw();
      if (k > .35) stamp(L("NOPE", "NÖ"), W * .42, H * .17, (k - .35) * d * .5 / .3, "#e5484d", .07); } });
  // 4 Studio: Herdentiere – 7 Meerschweinchen ploppen im Kreis auf, Zahl "5–10"
  KZ.shot("aHerd", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph); const all = [gp, ...herd];
    all.forEach((G, i) => { const a = i / all.length * 2 * PI + .3, r = .62, p = sm(clamp((ph - .05 - i * .06) / .18, 0, 1));
      at(G, Math.cos(a) * r, 0, Math.sin(a) * r * .75, -a + PI); G.noCheck = true;
      poseGp(G, t + i, { sc: 1.15 * easeBack(p) + .001, wheek: Math.sin(t * 5 + i * 1.3) > .6, hop: i % 3 === 0 ? Math.max(0, Math.sin(t * 6 + i)) * .5 : 0 }); });
    frameOn([FR(-.9, 0, -.6, .9, .45, .6)], { az: lerp(.1, 0, k), el: lerp(.55, .48, k), fill: lerp(.86, .92, k), dy: -.05, t }); draw();
    stamp(L("HERD ANIMALS", "HERDENTIERE"), W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .45) / .3); if (cp > 0) txt(L("5–10 per group", "5–10 pro Gruppe"), W * .42, H * .62, 70, "#ffd23f", { stroke: 12, a: clamp(cp, 0, 1) }); });
  // 5 Studio: allein im Lichtkegel, traurig + RSPCA-Zitat
  KZ.shot("aLonely", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bigGp, 0, 0, 0, .45); poseGp(bigGp, t, { sc: 1.7, sad: true, lid: .35 });
    frameOn([bigGp], { az: lerp(.5, .4, k), el: .14, fill: lerp(.66, .72, k), dy: -.08, t }); draw();
    stamp(L("LONELY", "EINSAM"), W * .42, H * .17, (lt - .15) / .3, "#7a5cff", -.06);
    const cp = sm((lt - d * .3) / .3); if (card(W * .42, H * .63, 900, 220, cp, "RSPCA", "#2f6fd0")) {
      txt(L("“Guinea pigs get lonely and", "„Meerschweinchen werden einsam und"), W * .42, H * .63 + 8, 36, "#1d2250", { a: clamp(cp, 0, 1) });
      txt(L("shouldn't be kept alone.”", "sollten nicht allein leben.“"), W * .42, H * .63 + 56, 36, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 6 Studio: Schweiz – Fahne, Meerschweinchen mit "Zu vermieten"-Schild, Stempel VERBOTEN
  KZ.shot("aSwiss", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph), half = ph > .5;
    place(flag, -.55, -.1, 0); flag.wave(t);
    at(bigGp, .15, 0, .1, -.3); poseGp(bigGp, t, { sc: 1.5, wide: !half, hop: half ? Math.max(0, Math.sin(t * 6)) * .4 : 0, wheek: half && Math.sin(t * 6) > .5 });
    if (half) { place(sign, .55, -.15, -.3); }
    frameOn([flag, bigGp, FR(-.6, 0, -.2, .75, .3, .3)], { az: lerp(.2, .1, k), el: .12, fill: lerp(.86, .92, k), dy: -.05, t }); draw();
    if (!half) stamp(L("ILLEGAL", "VERBOTEN"), W * .42, H * .17, (lt - .35) / .3, "#e5484d", -.07);
    else { const cp = sm((ph - .55) * d / .3); if (card(W * .42, H * .645, 860, 110, cp)) txt(L("Source: Swiss Animal Welfare Ordinance", "Quelle: Schweizer Tierschutzverordnung"), W * .42, H * .645, 32, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 7 Pointe: Rudi im Kostüm kratzt sich am Kopf, Meerschweinchen guckt genervt aus dem Häuschen
  KZ.shot("aPunch", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(rudi, -.55, -.1, 0); costumeOn(t, { arms: [.2, 2.75], spread: .1, mouth: "smile", tilt: -.1 });
    const HR = PI + .9; place(house, .45, .2, HR); house.root.scale.setScalar(1.5); at(gp, .45 + .36 * Math.cos(HR) * 1.05, 0, .2 - .36 * Math.sin(HR) * 1.05, HR); gp.noCheck = true; poseGp(gp, t, { lid: .45, look: -.15, sc: 1.4 });
    frameOn([rudi, house], { az: lerp(.5, .44, k), el: .12, fill: lerp(.92, .97, k), t }); draw(); house.root.scale.setScalar(1);
    if (ph > .35) stamp(L("NOT A GUINEA PIG", "KEIN MEERSCHWEIN"), W * .42, H * .17, (ph - .35) * d / .3, "#7a5cff", .05); });
  // 8 Tipp: zwei Meerschweinchen im Gehege, kuscheln/fressen nebeneinander, eins macht Popcorn-Sprünge; jedes hat ein Häuschen
  KZ.shot("aTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(run, 0, 0, 0); place(house, -.55, -.25, 0);
    at(gp, -.2, 0, .12, .25); poseGp(gp, t, { hop: Math.max(0, Math.sin(t * 5)) * .8, wheek: Math.sin(t * 5) > .6 });
    at(gp2, .38, 0, .05, PI - .35); poseGp(gp2, t, { look: .15, nod: Math.sin(t * 3) * .05 });
    frameOn([FR(-.7, 0, -.4, .7, .45, .4)], { az: lerp(.3, .22, k), el: lerp(.34, .28, k), fill: lerp(1.0, 1.08, k), t }); draw();
    stamp(L("AT LEAST 2", "MINDESTENS 2"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06);
    if (ph > .45) wheekText(L("POPCORN!", "POPCORN!"), W * .38, H * .3, ((lt - d * .45) % 1.2) / 1.2, "#ffd23f"); });
  // 9 Loop: zurück zur Hook-Einstellung (einzelnes Meerschweinchen im Gehege)
  KZ.shot("aLoop", (lt, d, t) => { inYard(); const ph = lt / d;
    place(run, 0, 0, 0); place(house, -.55, -.25, 0);
    at(gp, .15, 0, .1, .5); poseGp(gp, t, { look: Math.sin(t * 1.5) * .35, wheek: ph > .6 && Math.sin(t * 6) > .2 });
    frameOn([FR(-.75, 0, -.45, .75, .5, .45)], { az: lerp(.38, .3, ph), el: lerp(.4, .36, ph), fill: lerp(.95, 1.05, ph), t }); draw();
    if (ph > .3) stamp(L("ONLY ONE?", "NUR EINS?"), W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__gpalone3d = true;
})();
