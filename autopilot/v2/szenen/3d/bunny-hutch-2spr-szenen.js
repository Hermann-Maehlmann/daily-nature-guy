// 3D-Szene "Why Your Bunny's Hutch Is Too Small" / "Warum dein Kaninchenstall zu klein ist" (18.11.2026). ZWEISPRACHIGES Vorbild (19.11.2026): alle Bildtexte als L("EN", "DE"). Hauskaninchen (wildfarben, aus dem Kaninchen-Video vom 17.11.),
// kleiner Holzstall, Stall mit 2. Etage, Luxus-Stall (Fernseher, Kronleuchter), großer Auslauf mit Gitterzaun, Studio-Infografiken (3x2x1 m Fläche,
// 2. Etage zählt nicht, krumme Wirbelsäule). Quellen: RWAF (Minimum Space Requirements, A Hutch Is Not Enough), RSPCA, PDSA.
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let bun, bun2, bigBun, rudi, hutch, hutch2, lux, run, area, stars, spine, lid;

  // ---------- Hauskaninchen (eigener Entwurf: wildfarben braun, cremefarbener Bauch, weiße Blume, lange Ohren, große Hinterpfoten) ----------
  function makeBunny(col) {
    const fur = M(col || 0xb98a5e, { roughness: .8 }), furD = M(new T.Color(col || 0xb98a5e).multiplyScalar(.8).getHex(), { roughness: .8 }), cream = M(0xf6e7cf, { roughness: .85 }), white = M(0xffffff, { roughness: .9 });
    const pink = M(0xffa3b1, { roughness: .6 }), eyeM = M(0x2a1610, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(fur, -.08, .22, 0, .27, .23, .24));
    body.add(sph(fur, .1, .25, 0, .18, .19, .17));
    body.add(sph(cream, .15, .2, 0, .12, .14, .13));
    body.add(sph(cream, -.02, .09, 0, .24, .1, .17));
    body.add(sph(furD, -.12, .38, 0, .16, .07, .14));
    const tail = sph(white, -.34, .27, 0, .075, .075, .075); body.add(tail);
    const hind = []; for (const s of [-1, 1]) { const hl2 = new T.Group(); hl2.position.set(-.1, .16, s * .15); body.add(hl2);
      hl2.add(sph(fur, 0, 0, 0, .13, .13, .07)); const foot = sph(cream, .1, -.125, 0, .16, .042, .06); hl2.add(foot); hind.push(hl2); }
    const front = []; for (const s of [-1, 1]) { const f = limb(.035, .16, fur); f.position.set(.17, .17, s * .075); f.add(sph(cream, .025, -.165, 0, .05, .028, .04)); body.add(f); front.push(f); }
    const head = new T.Group(); head.position.set(.24, .43, 0); body.add(head);
    head.add(sph(fur, 0, 0, 0, .15, .14, .135));
    for (const s of [-1, 1]) head.add(sph(cream, .1, -.045, s * .042, .06, .052, .055));
    const nose = sph(pink, .155, -.012, 0, .022, .018, .026); head.add(nose);
    const mo = mesh(new T.TorusGeometry(.016, .005, 6, 12, PI), M(0x6a3a30), .158, -.07, 0); mo.rotation.set(0, PI / 2, PI); head.add(mo);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.065, .035, s * .1); head.add(e);
      e.add(sph(eyeM, 0, 0, 0, .048, .056, .036)); e.add(sph(hl, .025, .022, .02 * s, .013)); eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, furD, .07, .1, s * .09, .05, .012, .02); head.add(b); brows.push(b); }
    const wh = M(0xffffff, { roughness: .4 }); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .12, -.04 + i * .02, s * .1, .004, .16, .004); w.rotation.x = s * (PI / 2 - .25 + i * .18); w.castShadow = false; head.add(w); }
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.04, .1, s * .055); head.add(e);
      e.add(sph(fur, 0, .2, 0, .035, .22, .07)); const inner = sph(pink, .02, .2, 0, .02, .17, .05); e.add(inner); ears.push(e); }
    return { root, body, head, ears, eyes, brows, nose, hind, front, tail };
  }
  // o: {ears 0 aufrecht..1 angelegt, wide, kick, dangle, lid, hop, look, tilt, nod, lean, sc, stand 0..1 (auf die Hinterbeine)}
  function poseBunny(B, t, o) {
    o = o || {};
    const ea = o.ears || 0; B.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.set(s * (.12 + ea * .05), 0, ea * 1.25 + Math.sin(t * 2.3 + i) * .04 * (1 - ea)); });
    const st = o.stand || 0, th = st * 1.05;
    B.head.rotation.set(o.tilt || 0, o.look || 0, (o.nod || 0) - th * .85 + Math.sin(t * 1.6) * .02);
    B.nose.scale.set(.022, .018 * (1 + Math.sin(t * 22) * .18), .026);
    const lid = o.lid ?? (Math.sin(t * 1.4 + 1) > .985 ? .85 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.22 : 1), o.wide ? 1.1 : 1));
    B.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.wide ? -.35 : (o.sad ? .35 : 0)); b.position.y = o.wide ? .115 : .1; });
    const k = o.kick || 0, hop = o.hop || 0, dg = o.dangle || 0;
    B.hind.forEach((h, i) => { h.rotation.z = -(k * (1.0 + Math.sin(t * 26 + i * 2) * .5)) - hop * 1.1 - dg * .6 - th; });
    B.front.forEach((f, i) => { f.rotation.z = k * Math.sin(t * 24 + i * 1.5) * .6 + hop * .9 + dg * .5 - th * .3; });
    B.body.rotation.z = hop * .25 + (o.lean || 0) + th;
    // Aufrichten um die Hinterpfoten (Drehpunkt x -.2 am Boden)
    const P = -.2; B.body.position.set(P - P * Math.cos(th), -P * Math.sin(th) * 0 + Math.sin(t * 2) * .004 + (th ? .02 : 0), 0);
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Kaninchenstall (eigener Entwurf: Holz, auf Beinen, Wohnbereich links offen, Schlafkammer rechts, Gittertür aufgeklappt) ----------
  const FLOOR = .3, IN = .62; // Bodenhöhe, Innenhöhe
  function wireTex(col) { return canvasTex(256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = col || "#d8dde3"; c.lineWidth = 5; for (let i = 0; i <= w; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } }); }
  function wirePlane(w, h, rep) { const tx = wireTex(); tx.wrapS = tx.wrapT = T.RepeatWrapping; tx.repeat.set(rep * w, rep * h);
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: tx, transparent: true, alphaTest: .4, side: T.DoubleSide, metalness: .5, roughness: .4 })); m.castShadow = false; return m; }
  function makeHutch(o) {
    o = o || {}; const root = new T.Group();
    const wood = M(o.wall || 0xc98b4f, { roughness: .75 }), trim = M(o.trim || 0x8a5a33, { roughness: .7, metalness: o.gold ? .7 : 0 }), roofM = M(o.roof || 0x2f6f8f, { roughness: .6, metalness: o.gold ? .7 : 0 });
    const levels = o.levels || 1, LH = IN + .06;
    for (const [x, z] of [[-.55, -.28], [.93, -.28], [-.55, .28], [.93, .28]]) root.add(mesh(BOX, trim, x, (FLOOR + (levels - 1) * LH) / 2 * 0 + FLOOR / 2, z, .07, FLOOR, .07));
    const floors = [];
    for (let l = 0; l < levels; l++) { const y0 = FLOOR + l * LH;
      const fl = mesh(BOX, trim, .19, y0 - .02, 0, 1.56, .05, .66); root.add(fl); floors.push(fl);
      { const st = mesh(new T.PlaneGeometry(1.0, .56), M(0xe8d27a, { roughness: 1 }), -.02, y0 + .007, 0); st.rotation.x = -PI / 2; root.add(st); } // Stroh
      root.add(mesh(BOX, wood, .19, y0 + IN / 2, -.31, 1.56, IN, .04));                  // Rückwand
      root.add(mesh(BOX, wood, -.56, y0 + IN / 2, 0, .04, IN, .66));                     // linke Wand
      root.add(mesh(BOX, wood, .95, y0 + IN / 2, 0, .04, IN, .66));                      // rechte Wand
      root.add(mesh(BOX, wood, .55, y0 + IN / 2, 0, .04, IN, .62));                      // Trennwand Schlafkammer
      root.add(mesh(BOX, wood, .75, y0 + IN / 2, .31, .4, IN, .04));                     // Schlafkammer vorn zu
      root.add(mesh(BOX, trim, -.01, y0 + IN + .01, .31, 1.14, .05, .05));              // Sturz vorn
      if (l < levels - 1) root.add(mesh(BOX, trim, .19, y0 + IN + .04, 0, 1.6, .05, .7)); // Zwischendecke
    }
    const top = FLOOR + levels * LH - .06;
    const roof = mesh(BOX, roofM, .19, top + .05, .02, 1.72, .05, .82); roof.rotation.x = .12; root.add(roof);
    // Gittertür (aufgeklappt, Scharnier links vorn)
    const door = new T.Group(); door.position.set(-.56, FLOOR, .33); root.add(door); door.rotation.y = -2.0;
    for (const [x, y, sx, sy] of [[.27, .02, .56, .04], [.27, IN - .02, .56, .04], [.01, IN / 2, .04, IN], [.53, IN / 2, .04, IN]]) door.add(mesh(BOX, trim, x, y, 0, sx, sy, .03));
    const wp = wirePlane(.52, IN - .04, 6); wp.position.set(.27, IN / 2, 0); door.add(wp);
    // Rampe zur 2. Etage (außen links)
    const out = { root, floors, top };
    if (o.lux) { // Fernseher an der Rückwand + Kronleuchter + goldene Krone auf dem Dach
      const tv = new T.Group(); tv.position.set(.35, FLOOR + .36, -.26); root.add(tv);
      tv.add(mesh(BOX, M(0x222533, { roughness: .4 }), 0, 0, 0, .3, .2, .03));
      const scr = canvasTex(256, 170, (c, w, h) => { c.fillStyle = "#6ec6ff"; c.fillRect(0, 0, w, h); c.fillStyle = "#79c25a"; c.fillRect(0, h * .65, w, h); c.fillStyle = "#ff8a2a"; c.beginPath(); c.moveTo(80, 70); c.lineTo(190, 110); c.lineTo(80, 120); c.fill(); c.fillStyle = "#3f9a3c"; c.beginPath(); c.arc(70, 80, 22, 0, 7); c.fill(); });
      const sm2 = new T.Mesh(new T.PlaneGeometry(.26, .16), new T.MeshStandardMaterial({ map: scr, emissive: 0xffffff, emissiveMap: scr, emissiveIntensity: .8 })); sm2.position.z = .017; tv.add(sm2); out.tv = tv;
      const ch = new T.Group(); ch.position.set(.3, FLOOR + IN - .02, .05); root.add(ch); const gold = M(0xffc93c, { metalness: .8, roughness: .25 });
      ch.add(mesh(CYL, gold, 0, -.04, 0, .008, .08, .008)); const ring = mesh(new T.TorusGeometry(.07, .01, 8, 24), gold, 0, -.09, 0); ring.rotation.x = PI / 2; ch.add(ring);
      for (let i = 0; i < 5; i++) { const a = i / 5 * 2 * PI; ch.add(sph(M(0xfff3c4, { emissive: 0xffe08a, emissiveIntensity: 1 }), Math.cos(a) * .07, -.075, Math.sin(a) * .07, .018)); }
      ch.traverse((m) => m.castShadow = false); out.chand = ch;
      for (let i = 0; i < 5; i++) { const sp = mesh(new T.ConeGeometry(.04, .12, 4), gold, -.1 + i * .1 + .19, top + .16, .02); root.add(sp); }
      root.add(sph(M(0xff4d6d, { roughness: .3 }), .19, top + .2, .02, .03));
    }
    return out;
  }
  // Auslauf: Gitterzaun-Rechteck vor dem Stall (3 x 2 m, 1 m hoch)
  function makeRun() { const root = new T.Group(); const post = M(0x8a5a33, { roughness: .7 });
    const X0 = -.6, X1 = 2.4, Z0 = .4, Z1 = 2.4, HH = .75;
    for (const [x, z] of [[X0, Z0], [X1, Z0], [X0, Z1], [X1, Z1], [(X0 + X1) / 2, Z1], [(X0 + X1) / 2, Z0]]) root.add(mesh(BOX, post, x, HH / 2, z, .06, HH, .06));
    const side = (x, z, w, ry) => { const p = wirePlane(w, HH, 5); p.position.set(x, HH / 2, z); p.rotation.y = ry; root.add(p); const rail = mesh(BOX, post, x, HH, z, w, .04, .04); rail.rotation.y = ry; root.add(rail); };
    side((X0 + X1) / 2, Z1, X1 - X0, 0); side(X1, (Z0 + Z1) / 2, Z1 - Z0, PI / 2); side(X0, (Z0 + Z1) / 2 + .0, Z1 - Z0, PI / 2);
    const back = wirePlane(X1 - .95, HH, 5); back.position.set((.95 + X1) / 2, HH / 2, Z0); root.add(back);
    for (const [x, z] of [[1.9, 1.9], [.1, 2.0]]) { const tun = mesh(new T.CylinderGeometry(.16, .16, .55, 24, 1, true, 0, PI), M(0x2f6fd0, { roughness: .5, side: T.DoubleSide }), x, 0, z); tun.rotation.set(0, 0, PI / 2); root.add(tun); }
    root.add(sph(M(0xe8d27a, { roughness: 1 }), 1.5, .05, .8, .3, .1, .22)); // Heu
    return { root }; }
  // Infografik: Grundfläche 3 x 2 m mit Raster, Höhenstab 1 m, kleiner Stall-Umriss
  function tileTex(word, col, fs) { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = col; c.beginPath(); c.roundRect(0, 0, w, h, 60); c.fill(); c.fillStyle = "#fff"; c.font = `900 ${fs || 92}px "Montserrat"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(word, w / 2, h / 2 + 4); }); }
  function tile(word, col, fs) { const grp = new T.Group(); grp.add(mesh(BOX, M(new T.Color(col).multiplyScalar(.7).getHex(), { roughness: .4 }), 0, 0, -.06, 1.6, .8, .12));
    const f = new T.Mesh(new T.PlaneGeometry(1.6, .8), new T.MeshStandardMaterial({ map: tileTex(word, col, fs), roughness: .4 })); f.position.z = .001; grp.add(f); grp.traverse((m) => { m.castShadow = false; }); return grp; }
  function makeArea() { const root = new T.Group();
    const gt = canvasTex(600, 400, (c, w, h) => { c.fillStyle = "#36b37e"; c.fillRect(0, 0, w, h); c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 4; for (let i = 0; i <= 3; i++) { c.beginPath(); c.moveTo(i * w / 3, 0); c.lineTo(i * w / 3, h); c.stroke(); } for (let i = 0; i <= 2; i++) { c.beginPath(); c.moveTo(0, i * h / 2); c.lineTo(w, i * h / 2); c.stroke(); } c.lineWidth = 12; c.strokeStyle = "#fff"; c.strokeRect(6, 6, w - 12, h - 12); });
    const plate = mesh(BOX, M(0x2a8f63), 0, .03, 0, 3, .06, 2); root.add(plate);
    const top = new T.Mesh(new T.PlaneGeometry(3, 2), new T.MeshStandardMaterial({ map: gt, roughness: .7 })); top.rotation.x = -PI / 2; top.position.y = .062; top.receiveShadow = true; root.add(top);
    const small = mesh(BOX, M(0xc98b4f, { roughness: .7 }), -1.5 + .75, .1, -1 + .32, 1.5, .08, .64); root.add(small); // Stall-Grundfläche
    const sl = tile(L("HUTCH", "STALL"), "#8a5a33", 110); sl.scale.setScalar(.38); sl.rotation.x = -PI / 2; sl.position.set(-.75, .16, -.68); root.add(sl);
    const pole = new T.Group(); pole.position.set(1.5, 0, -1); root.add(pole); pole.add(mesh(CYL, M(0xffd23f, { roughness: .4 }), 0, .5, 0, .04, 1, .04));
    for (let i = 0; i <= 4; i++) pole.add(mesh(BOX, M(0xffffff), 0, i * .25, 0, .12, .015, .012));
    const t1 = tile("1 m", "#ff9f1c", 130); t1.scale.setScalar(.36); t1.position.set(0, 1.18, 0); pole.add(t1);
    const t3 = tile("3 m", "#2f6fd0", 130); t3.scale.setScalar(.42); t3.position.set(0, .22, 1.08); root.add(t3);
    const t2 = tile("2 m", "#2f6fd0", 130); t2.scale.setScalar(.42); t2.position.set(1.62, .22, .35); t2.rotation.y = PI / 2; root.add(t2);
    root.traverse((m) => m.castShadow = m.castShadow && m !== plate);
    return { root, plate, top, small, sl, pole, t1, t2, t3 }; }
  function makeStars() { const root = new T.Group(); const list = []; const s = new T.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? .4 : 1, a = i / 10 * 2 * PI - PI / 2; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    const geo = new T.ExtrudeGeometry(s, { depth: .3, bevelEnabled: false }); geo.center();
    for (let i = 0; i < 4; i++) { const m = mesh(geo, M(0xffd23f, { emissive: 0x8a6a00, roughness: .3 })); m.scale.setScalar(.05); m.castShadow = false; root.add(m); list.push(m); } return { root, list }; }
  // Wirbelsäule als leuchtender Bogen (im Körper des großen Kaninchens)
  function makeSpine(bent) { const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push(V(lerp(-.3, .22, u), .3 + Math.sin(u * PI) * (bent ? .2 : .06) + u * .1, 0)); }
    const m = mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, .02, 10), M(0xff3355, { emissive: 0xff2244, emissiveIntensity: .9, roughness: .3 })); m.material.depthTest = false; m.material.transparent = true; m.renderOrder = 10; m.castShadow = false; return m; }
  function makeLid() { const root = new T.Group(); root.add(mesh(BOX, M(0xffffff, { roughness: .1, transparent: true, opacity: .25 }), 0, .92, 0, 2.2, .04, 1.4));
    for (const [x, z] of [[-1.08, -.68], [1.08, -.68], [-1.08, .68], [1.08, .68]]) root.add(mesh(CYL, M(0xc5ced8, { metalness: .8, roughness: .3 }), x, .46, z, .03, .92, .03)); root.traverse((m) => m.castShadow = false); return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bun = actor(makeBunny(), "Kaninchen"); bun2 = actor(makeBunny(0xe9e2d6), "Kaninchen 2"); bigBun = actor(makeBunny(), "Kaninchen gross");
    hutch = actor(makeHutch(), "Stall"); hutch2 = actor(makeHutch({ levels: 2, roof: 0x7a5cff }), "Stall 2 Etagen"); lux = actor(makeHutch({ lux: true, wall: 0xff8fb8, trim: 0xffc93c, roof: 0xffc93c, gold: true }), "Luxus-Stall");
    run = actor(makeRun(), "Auslauf"); area = actor(makeArea(), "Flaeche"); stars = actor(makeStars(), "Sterne"); lid = actor(makeLid(), "Deckel");
    spine = { bent: makeSpine(true), ok: makeSpine(false) }; bigBun.body.add(spine.bent); bigBun.body.add(spine.ok);
    for (const a of [hutch, hutch2, lux, run, area, stars, lid]) a.noCheck = true; // Kaninchen sitzt bewusst IM Stall/Auslauf
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { rudi.noCheck = false; for (const b of [bun, bun2, bigBun]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = false; } spine.bent.visible = spine.ok.visible = false;
    rudi.body.position.set(0, 0, 0); rudi.legs.forEach((l) => l.rotation.set(0, 0, 0)); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  // Rahmen-Box (unsichtbar fürs Bild, nur für frameOn): feste Kamera trotz bewegter Figuren
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function bunAt(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function headTop(B) { B.root.updateMatrixWorld(true); return B.head.localToWorld(V(0, .17, .0)); }
  function bonk(x, y, z, p, t) { stars.root.visible = p > 0; stars.list.forEach((s, i) => { const a = t * 5 + i * PI / 2; s.position.set(x + Math.cos(a) * .16, y + .04 * Math.sin(t * 7 + i), z + Math.sin(a) * .16); s.rotation.set(0, a, 0); s.scale.setScalar(.05 * easeBack(clamp(p, 0, 1)) + .001); }); }
  const HX = 0, HZ = 0; // Stall-Standplatz im Garten
  const SIT = FLOOR + .03;

  // ---------- Shots ----------
  // 0 Hook: Kaninchen im kleinen Stall, Ohren platt am Dach, versucht sich aufzurichten -> stößt an
  KZ.shot("hHook", (lt, d, t) => { inYard(); const ph = lt / d;
    place(hutch, HX, HZ, 0); const st = sm(clamp((ph - .3) / .2, 0, 1)) * .3 * (1 - sm(clamp((ph - .75) / .2, 0, 1)) * .7);
    bunAt(bun, HX - .06, SIT, HZ, 0); bun.noCheck = true; poseBunny(bun, t, { ears: 1.22, stand: st, wide: ph > .45, sc: .9, nod: ph > .5 ? -.1 : 0 });
    const hp = headTop(bun); bonk(hp.x, FLOOR + IN - .06, hp.z + .05, (ph - .48) * 5, t);
    frameOn([FR(HX - .62, FLOOR - .3, -.35, HX + .62, FLOOR + IN + .1, .38)], { az: lerp(.4, .3, ph), el: .05, fill: lerp(.98, 1.06, ph), t }); draw();
    if (ph > .45) stamp(L("TOO SMALL", "ZU KLEIN"), W * .42, H * .64, (ph - .45) * d / .3, "#e5484d", -.06); });
  // 1 Rudi neben dem Stall, Kaninchen gelangweilt; Rudi hat eine Idee
  KZ.shot("hBored", (lt, d, t) => { inYard(); const ph = lt / d;
    place(hutch, HX, HZ, 0); bunAt(bun, HX - .06, SIT, HZ, 0); bun.noCheck = true; poseBunny(bun, t, { ears: 1.22, lid: .55, sad: true, nod: -.1, sc: .9 });
    place(rudi, HX - 1.42, HZ + .45, -.5); const idea = ph > .45;
    poseRudi(rudi, t, idea ? { arms: [.2, 2.6 + Math.sin(t * 8) * .1], spread: .1, mouth: "o", wide: true } : { arms: [.15, 1.0], spread: .1, mouth: "smile", tilt: -.08 });
    frameOn([hutch, rudi], { az: lerp(.55, .47, ph), el: .12, fill: lerp(.9, .96, ph), t }); draw();
    if (!idea) stamp(L("BORED", "LANGWEILIG"), W * .42, H * .17, (lt - .2) / .3, "#7a5cff", -.06);
    else stamp("UPGRADE!", W * .42, H * .17, (ph - .47) * d / .3, "#ff9f1c", .06); });
  // 2 Stall mit 2. Etage: Rudi präsentiert stolz; Schnitt: Kaninchen sitzt oben, genauso gelangweilt
  KZ.shot("hTwo", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .5; const L2 = FLOOR + IN + .06;
    place(hutch2, HX, HZ, 0); bunAt(bun, HX - .06, L2 + .03, HZ, 0); bun.noCheck = true;
    if (!half) { const k = sm(ph / .5); place(rudi, HX - 1.42, HZ + .45, -.5); poseRudi(rudi, t, { arms: [.15, 1.45 + Math.sin(t * 3) * .05], spread: .12, mouth: "smile" });
      poseBunny(bun, t, { ears: 1.22, sc: .9 });
      frameOn([hutch2, rudi], { az: lerp(.5, .44, k), el: .12, fill: lerp(.9, .95, k), t }); draw();
      stamp(L("2 FLOORS!", "2 ETAGEN!"), W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", -.06); }
    else { const k = sm((ph - .5) / .5); poseBunny(bun, t, { ears: 1.22, lid: .55, sad: true, nod: -.12, sc: .9 });
      frameOn([FR(HX - .6, L2 - .1, -.35, HX + .6, L2 + IN, .35)], { az: lerp(.3, .22, k), el: .14, fill: lerp(.85, .95, k), t }); draw();
      stamp(L("STILL BORED", "IMMER NOCH ÖDE"), W * .42, H * .17, (ph - .52) * d / .3, "#7a5cff", .06); } });
  // 3 Luxus-Stall (rosa, Gold, Kronleuchter, Mini-Fernseher); Schnitt: Kaninchen richtet sich auf -> BONK an der Decke
  KZ.shot("hLux", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .55;
    place(lux, HX, HZ, 0); bunAt(bun, HX - .2, SIT, HZ, 0); bun.noCheck = true;
    if (!half) { const k = sm(ph / .55); place(rudi, HX - 1.42, HZ + .45, -.5); poseRudi(rudi, t, { arms: [1.3 + Math.sin(t * 4) * .1, 1.3 - Math.sin(t * 4) * .1], spread: .3, mouth: "smile" });
      poseBunny(bun, t, { ears: 1.22, sc: .9, look: .3 });
      frameOn([lux, rudi], { az: lerp(.5, .42, k), el: .14, fill: lerp(.9, .96, k), t }); draw();
      stamp(L("LUXURY", "LUXUS"), W * .42, H * .17, (lt - .2) / .3, "#ff5d8f", -.06); }
    else { const k = (ph - .55) / .45, st = sm(clamp(k / .35, 0, 1)) * .36;
      poseBunny(bun, t, { ears: 1.22, stand: st, wide: k > .35, sc: .9, nod: k > .38 ? -.12 : 0 });
      const hp = headTop(bun); bonk(hp.x, FLOOR + IN - .06, hp.z + .05, (k - .36) * 4, t);
      frameOn([FR(HX - .6, FLOOR - .05, -.35, HX + .6, FLOOR + IN + .08, .35)], { az: lerp(.28, .22, k), el: .03, fill: lerp(.95, 1.02, k), t }); draw();
      if (k > .35) stamp("BONK!", W * .42, H * .17, (k - .35) * d * .45 / .3, "#e5484d", .07); } });
  // 4 Studio: großes Kaninchen sprintet und macht einen Freudensprung (Binky)
  KZ.shot("hSpace", (lt, d, t) => { studio(); const ph = lt / d;
    const x = lerp(-.7, .4, sm(clamp(ph / .7, 0, 1))), jump = ph > .55 ? Math.sin(clamp((ph - .55) / .35, 0, 1) * PI) : 0, hopP = ph < .55 ? Math.abs(Math.sin(t * 9)) * .12 : 0;
    bunAt(bigBun, x, hopP + jump * .55, .1, jump * 1.2); poseBunny(bigBun, t, { hop: ph < .55 ? Math.abs(Math.sin(t * 9)) : jump, ears: .1, sc: 1.6 }); bigBun.root.rotation.x = jump * .3;
    frameOn([FR(-1.3, 0, -.5, 1.3, 1.4, .5)], { az: lerp(.12, .04, ph), el: .14, fill: .95, t }); draw();
    stamp(ph < .55 ? L("SPRINT", "RENNEN") : L("JUMP!", "SPRUNG!"), W * .42, H * .17, ph < .55 ? (lt - .15) / .3 : (ph - .55) * d / .3, ph < .55 ? "#36b37e" : "#ff9f1c", ph < .55 ? -.06 : .06); });
  // 5 Studio-Infografik: 3 x 2 m Grundfläche, 1 m hoch, zwei Kaninchen hoppeln, kleiner Stall-Umriss + Quellenkarte
  KZ.shot("hSize", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(area, 0, 0, 0); const a1 = sm(clamp(ph / .25, 0, 1)), a2 = sm(clamp((ph - .3) / .2, 0, 1)), a3 = sm(clamp((ph - .55) / .2, 0, 1));
    area.top.scale.set(1, 1, 1); area.t3.visible = a1 > .1; area.t2.visible = a1 > .1; area.t3.scale.setScalar(.42 * easeBack(a1) + .001); area.t2.scale.setScalar(.42 * easeBack(a1) + .001);
    area.pole.visible = a3 > .01; area.pole.scale.set(1, a3 + .001, 1);
    for (const [B, x0, z0, sp] of [[bun, -.75, .35, 1], [bun2, .55, -.3, -1]]) { const u = (t * .35 * sp + (sp > 0 ? 0 : .5)) % 1; const xx = x0 + Math.sin(u * 2 * PI) * .3, zz = z0 + Math.cos(u * 2 * PI) * .2; bunAt(B, xx, .06 + Math.abs(Math.sin(t * 8 + x0)) * .08, zz, -u * 2 * PI * sp - (sp > 0 ? 0 : PI));
      poseBunny(B, t, { hop: Math.abs(Math.sin(t * 8 + x0)), ears: .1, sc: .75 }); }
    frameOn([area], { az: lerp(.35, .25, k), el: lerp(.58, .5, k), fill: lerp(1.08, 1.14, k), dy: -.3, t }); draw();
    txt(L("FOR 2 RABBITS", "FÜR 2 KANINCHEN"), W * .42, H * .2, 66, "#ffffff", { stroke: 10, a: clamp(lt / .3, 0, 1) });
    const cp = sm((lt - d * .45) / .3); if (card(W * .42, H * .64, 760, 110, cp)) txt(L("Source: RWAF · RSPCA · PDSA", "Quelle: RWAF · RSPCA · PDSA"), W * .42, H * .64, 34, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 6 Studio: Stall mit 2 Etagen, obere Etage rot durchgestrichen + RWAF-Zitat
  KZ.shot("hFloor", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph); const L2 = FLOOR + IN + .06;
    place(hutch2, -.2, 0, 0); hutch2.root.scale.setScalar(1.3); bunAt(bun, -.2 + (-.06) * 1.3, (L2 + .03) * 1.3, 0, 0); bun.noCheck = true; poseBunny(bun, t, { ears: 1.22, sc: .9 * 1.3, lid: .4 });
    const x1 = sm(clamp((ph - .25) / .2, 0, 1));
    if (!hutch2.redM) { hutch2.redM = M(0xe5484d, { emissive: 0x550000 }); hutch2.woodM = hutch2.floors[1].material; } hutch2.floors[1].material = x1 > .5 ? hutch2.redM : hutch2.woodM;
    frameOn([hutch2], { az: lerp(.3, .2, k), el: .1, fill: lerp(.86, .92, k), dy: -.15, t }); draw();
    const up = V(-.2 + .0, (L2 + IN / 2) * 1.3, .45).project(K3.camera); hutch2.root.scale.setScalar(1);
    if (x1 > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = "#e5484d"; g.lineWidth = 26; g.lineCap = "round"; const cx = (up.x + 1) / 2 * W, cy = (1 - up.y) / 2 * H, r = 130 * easeBack(x1);
      g.beginPath(); g.moveTo(cx - r, cy - r * .6); g.lineTo(cx + r, cy + r * .6); g.moveTo(cx + r, cy - r * .6); g.lineTo(cx - r, cy + r * .6); g.stroke(); g.restore(); }
    if (ph > .3) stamp(L("DOESN'T COUNT", "ZÄHLT NICHT"), W * .42, H * .14, (ph - .3) * d / .3, "#e5484d", -.05);
    const cp = sm((lt - d * .45) / .3); if (card(W * .42, H * .63, 880, 210, cp, "Rabbit Welfare Association (RWAF)", "#2f6fd0")) {
      txt(L("“The upper floor of a two-storey hutch", "„Die obere Etage eines Stalls zählt"), W * .42, H * .63 + 6, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt(L("does NOT count towards the footprint”", "NICHT zur Grundfläche“"), W * .42, H * .63 + 52, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 7 Studio: großes Kaninchen unter flachem Deckel, gekrümmte Wirbelsäule leuchtet rot + RWAF-Zitat
  KZ.shot("hSpine", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(lid, 0, 0, 0); bunAt(bigBun, -.1, 0, 0, -.2); bigBun.noCheck = true;
    poseBunny(bigBun, t, { ears: 1.35, sc: 1.6, lid: .35, sad: true, nod: -.18, lean: -.08 });
    const sp = sm(clamp((ph - .15) / .25, 0, 1)); spine.bent.visible = sp > .02; spine.bent.scale.set(1, 1, 1); spine.bent.material.emissiveIntensity = .5 + .5 * Math.abs(Math.sin(t * 5));
    frameOn([lid], { az: lerp(.3, .22, k), el: .16, fill: lerp(.8, .86, k), dy: -.25, t }); draw();
    if (ph > .2) stamp(L("BENT SPINE", "KRUMMER RÜCKEN"), W * .42, H * .17, (ph - .2) * d / .3, "#e5484d", -.06);
    const cp = sm((lt - d * .4) / .3); if (card(W * .42, H * .63, 880, 210, cp, "RWAF · A Hutch Is Not Enough", "#2f6fd0")) {
      txt(L("“If a rabbit can't stand up on its hind", "„Kann es nicht auf den Hinterbeinen stehen,"), W * .42, H * .63 + 6, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt(L("legs, it can deform the spine”", "kann sich die Wirbelsäule verformen“"), W * .42, H * .63 + 52, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 8 Pointe: Rudi kratzt sich am Kopf vor dem Luxus-Stall, Kaninchen ignoriert den Fernseher (dreht ihm den Rücken zu)
  KZ.shot("hTV", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(lux, HX, HZ, 0); bunAt(bun, HX - .2, SIT, HZ + .02, -PI / 2 + .35); bun.noCheck = true; poseBunny(bun, t, { ears: 1.22, lid: .6, sad: true, sc: .9 });
    place(rudi, HX - 1.42, HZ + .45, -.5); poseRudi(rudi, t, { arms: [.2, 2.75], spread: .1, mouth: "o", tilt: -.12 });
    frameOn([lux, rudi], { az: lerp(.5, .44, k), el: .1, fill: lerp(.98, 1.04, k), t }); draw();
    if (ph > .3) stamp(L("OVERKILL", "KNAST MIT TV"), W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", .06); });
  // 9 Tipp: Stall als Schlafzimmer + großer Auslauf mit Gitterzaun, Kaninchen macht Freudensprünge, zweites Kaninchen dabei
  KZ.shot("hTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(hutch, -1.0, -.1, 0); place(run, -1.0 + .4, -.1 - .55, 0);
    const u = (t * .3) % 1, bx = .6 + Math.sin(u * 2 * PI) * 1.0, bz = .9 + Math.cos(u * 2 * PI) * .45, jump = Math.max(0, Math.sin(t * 4.2));
    bunAt(bun, bx - .6, jump * .3, bz - .55, -u * 2 * PI - PI / 2); poseBunny(bun, t, { hop: jump, ears: .05, sc: .9 }); bun.root.rotation.x = jump * .25 * Math.sin(t * 2);
    bunAt(bun2, .8, 0, 1.45, -PI / 2 - .6); poseBunny(bun2, t, { ears: .1, sc: .9, nod: Math.sin(t * 3) * .1 });
    frameOn([run], { az: lerp(.42, .32, k), el: lerp(.4, .34, k), fill: lerp(1.08, 1.16, k), t }); draw();
    if (ph < .45) stamp(L("BEDROOM", "SCHLAFZIMMER"), W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", -.06);
    else stamp(L("BIG RUN, 24/7", "AUSLAUF, 24/7"), W * .42, H * .17, (ph - .45) * d / .3, "#36b37e", .06); });
  // 10 Loop: zurück zur Hook-Einstellung (Kaninchen im kleinen Stall, Ohren am Dach)
  KZ.shot("hLoop", (lt, d, t) => { inYard(); const ph = lt / d;
    place(hutch, HX, HZ, 0); bunAt(bun, HX - .06, SIT, HZ, 0); bun.noCheck = true; poseBunny(bun, t, { ears: 1.22, lid: .3, sc: .9 });
    frameOn([FR(HX - .62, FLOOR - .3, -.35, HX + .62, FLOOR + IN + .1, .38)], { az: lerp(.5, .4, ph), el: .05, fill: lerp(.9, .98, ph), t }); draw();
    if (ph > .3) stamp(L("BORED?", "LANGWEILIG?"), W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__hutch3d = true;
})();
