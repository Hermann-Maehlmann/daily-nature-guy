// 3D-Szene "Why Your Bird Feeder Is A Germ Bomb" / "Warum dein Vogelhäuschen eine Keimschleuder ist" (21.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Opener-Stil "nachrichten": Eilmeldungs-Banner mit Laufschrift, Reporter-Mikro vor der Blaumeise.
// Klassisches Futterhaus (Villa mit rotem Dach, Körnerbett), Kot-Kleckse, Mini-Vogelklos, Schrubbbürste, grinsende Keime (Studio),
// Grünfink neu gebaut (olivgrün, gelbe Flügel- und Schwanzkanten, dicker rosa Kegelschnabel), Futtersäule an der Futterstange.
// Quellen: LBV ("In einem klassischen Futterhäuschen sitzen die Vögel direkt im Futter und können das Futter mit Kot verunreinigen";
// "Diese Krankheiten übertragen sich besonders schnell an den klassischen Futterhäuschen!"), NABU (Futtersilos statt Futterhaus,
// Futterhaus täglich ausfegen), LBV/NABU: 2009 starben schätzungsweise 70.000-80.000 Grünfinken an Trichomonaden (Ansteckung an Futter-/Wasserstellen).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let rudi, tit, tit2, tit3, bigTits = [], house, tray, toilet, toilets = [], brush, mic, germs, finches = [], pole, silo, hearts, splats = [], traySplats = [];
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }

  // ---------- Blaumeise (blaue Kappe, weiße Wangen, schwarzer Augenstreif, gelber Bauch, olivgrüner Rücken, blaue Flügel mit weißer Binde) ----------
  function makeTit() {
    const blue = M(0x2f86e0, { roughness: .5 }), navy = M(0x1b2f6b, { roughness: .6 }), yel = M(0xffd21f, { roughness: .6 }), olive = M(0x9cb33c, { roughness: .65 });
    const white = M(0xffffff, { roughness: .7 }), black = M(0x161616, { roughness: .4 }), leg = M(0x6f86a8, { roughness: .5 }), eyeW = M(0xffffff, { roughness: .15 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(yel, 0, 0, 0, .16, .15, .135));
    body.add(sph(olive, -.03, .045, 0, .15, .11, .125));
    body.add(sph(M(0x7aa83a, { roughness: .7 }), .02, -.02, 0, .05, .09, .02));
    const tail = new T.Group(); tail.position.set(-.15, .03, 0); body.add(tail); tail.add(sph(blue, -.1, .02, 0, .12, .022, .045));
    const wings = []; for (const s of [-1, 1]) { const w = new T.Group(); w.position.set(.0, .05, s * .1); body.add(w);
      w.add(sph(blue, -.06, 0, s * .03, .12, .07, .03)); w.add(sph(white, -.03, .02, s * .055, .07, .012, .01)); w.add(sph(navy, -.13, -.01, s * .035, .06, .045, .025)); wings.push(w); }
    const head = new T.Group(); head.position.set(.11, .12, 0); body.add(head);
    head.add(sph(white, 0, 0, 0, .105, .1, .1));
    head.add(sph(blue, -.01, .045, 0, .098, .065, .095));
    head.add(sph(white, .025, .045, 0, .07, .02, .098));
    head.add(sph(black, .02, -.005, 0, .085, .016, .103));
    head.add(sph(navy, -.03, -.07, 0, .09, .028, .1));
    head.add(sph(black, .07, -.07, 0, .035, .03, .04));
    const beak = mesh(new T.ConeGeometry(.022, .06, 16), black, .115, -.01, 0); beak.rotation.z = -PI / 2; head.add(beak);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.05, .005, s * .075); head.add(e);
      e.add(sph(eyeW, 0, 0, 0, .033, .036, .02)); e.add(sph(black, .012, 0, s * .012, .02, .022, .014)); e.add(sph(hl, .02, .01, s * .02, .006)); eyes.push(e); }
    const legs = []; for (const s of [-1, 1]) { const l = limb(.012, .1, leg); l.position.set(.02, -.12, s * .045); body.add(l);
      for (const a of [-.45, 0, .45]) { const toe = mesh(CYL, leg, .03 * Math.cos(a), -.1, .03 * Math.sin(a), .006, .06, .006); toe.rotation.z = -PI / 2; toe.rotation.y = -a; l.add(toe); }
      const back = mesh(CYL, leg, -.025, -.1, 0, .006, .045, .006); back.rotation.z = PI / 2; l.add(back); legs.push(l); }
    body.position.y = .22;
    return { root, body, head, wings, legs, tail, eyes };
  }
  // ---------- Grünfink (olivgrün, gelbe Flügelkante + gelbe Schwanzseiten, graue Flügel, dicker rosa Kegelschnabel, dunkles Auge) ----------
  function makeFinch() {
    const grn = M(0x7f9f2e, { roughness: .6 }), grnD = M(0x5f7d24, { roughness: .6 }), belly = M(0xb5c83a, { roughness: .65 }), yel = M(0xffd31a, { roughness: .5 }), grey = M(0x7d8a86, { roughness: .6 });
    const beakM = M(0xf0b9a8, { roughness: .4 }), black = M(0x161616, { roughness: .4 }), leg = M(0xd8a89a, { roughness: .5 }), eyeW = M(0xffffff, { roughness: .15 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(belly, 0, 0, 0, .165, .15, .14)); body.add(sph(grn, -.03, .045, 0, .16, .115, .13));
    const tail = new T.Group(); tail.position.set(-.15, .03, 0); body.add(tail); tail.add(sph(grnD, -.1, .02, 0, .12, .024, .05));
    for (const s of [-1, 1]) tail.add(sph(yel, -.07, .02, s * .035, .06, .02, .018));
    const wings = []; for (const s of [-1, 1]) { const w = new T.Group(); w.position.set(0, .05, s * .1); body.add(w);
      w.add(sph(grey, -.06, 0, s * .03, .12, .07, .03)); w.add(sph(yel, -.02, -.035, s * .05, .1, .018, .012)); wings.push(w); }
    const head = new T.Group(); head.position.set(.11, .12, 0); body.add(head);
    head.add(sph(grn, 0, 0, 0, .105, .1, .1)); head.add(sph(grey, -.01, -.03, 0, .06, .04, .102));
    const beak = mesh(new T.ConeGeometry(.04, .075, 16), beakM, .12, -.015, 0); beak.rotation.z = -PI / 2; head.add(beak);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.05, .01, s * .075); head.add(e);
      e.add(sph(eyeW, 0, 0, 0, .033, .036, .02)); e.add(sph(black, .012, 0, s * .012, .021, .023, .014)); e.add(sph(hl, .02, .01, s * .02, .006)); eyes.push(e); }
    const legs = []; for (const s of [-1, 1]) { const l = limb(.012, .1, leg); l.position.set(.02, -.12, s * .045); body.add(l); legs.push(l); }
    body.position.y = .22;
    return { root, body, head, wings, legs, tail, eyes };
  }
  // o: {flap, wide, look, peck, lean, sc, hop, sad}
  function poseBird(B, t, o) {
    o = o || {};
    const f = o.flap || 0; B.wings.forEach((w, i) => { const s = i ? 1 : -1; w.rotation.set(-s * f * (.5 + Math.sin(t * 34 + i) * .7), 0, f * .2); });
    B.head.rotation.set(o.tilt || 0, o.look || 0, (o.peck ? -sm(Math.abs(Math.sin(t * 9))) * .55 * o.peck : 0) + Math.sin(t * 2.3) * .05 + (o.sad ? -.25 : 0));
    const lid = Math.sin(t * 1.7 + 2) > .985 ? .15 : (o.sad ? .6 : 1); B.eyes.forEach((e) => e.scale.set(1, lid * (o.wide ? 1.25 : 1), o.wide ? 1.15 : 1));
    B.legs.forEach((l, i) => { l.rotation.z = (o.walk ? Math.sin(t * 16 + i * PI) * .5 : 0); });
    B.tail.rotation.z = Math.sin(t * 3) * .08 + f * Math.sin(t * 30) * .15 + (o.tailUp || 0);
    B.body.rotation.z = o.lean || 0;
    B.body.position.y = .22 + (o.hop ? Math.abs(Math.sin(t * 7)) * .07 * o.hop : 0);
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Körner-Textur (Sonnenblumenkerne, Hirse) ----------
  const seedTex = () => canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#e8cf8e"; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 340; i++) { const x = (i * 97) % w, y = (i * 57 + i * i) % h; c.save(); c.translate(x, y); c.rotate(i);
      if (i % 3) { c.fillStyle = "#2a2622"; c.beginPath(); c.ellipse(0, 0, 9, 4, 0, 0, 7); c.fill(); c.strokeStyle = "#d8d2c4"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-7, 0); c.lineTo(7, 0); c.stroke(); }
      else { c.fillStyle = ["#f3d36b", "#c98a3a", "#fff1c4"][i % 3]; c.beginPath(); c.arc(0, 0, 3.5, 0, 7); c.fill(); } c.restore(); } });
  // ---------- Kot-Klecks (cartoonig: weißer Fleck mit grauem Kern) ----------
  function makeSplat() { const root = new T.Group(); const w = M(0xfbfbf6, { roughness: .4 }), gr = M(0x6b6f6a, { roughness: .5 });
    root.add(sph(w, 0, 0, 0, .045, .01, .035)); root.add(sph(gr, .005, .006, 0, .016, .008, .013));
    for (const [x, z] of [[.05, .02], [-.04, .035], [.02, -.045]]) root.add(sph(w, x, 0, z, .012, .006, .012));
    root.traverse((m) => { if (m.isMesh) m.castShadow = false; }); return root; }
  // ---------- Futterhaus "Villa" (Wurzel am Boden, Plattform-Oberkante PY, Körnerbett-Oberkante SY) ----------
  const PY = 1.45, SY = PY + .035, HW = .46, HD = .36;
  function makeTray(withSplats) { const root = new T.Group(); const wood = M(0xc98b4e, { roughness: .7 }), woodD = M(0x9a6236, { roughness: .75 });
    root.add(mesh(BOX, wood, 0, -.03, 0, HW * 2 + .06, .06, HD * 2 + .06));
    for (const [x, z, sx, sz] of [[0, HD + .02, HW * 2 + .06, .03], [0, -HD - .02, HW * 2 + .06, .03], [HW + .02, 0, .03, HD * 2 + .06], [-HW - .02, 0, .03, HD * 2 + .06]]) root.add(mesh(BOX, woodD, x, .03, z, sx, .06, sz));
    const st = seedTex(); st.wrapS = st.wrapT = T.RepeatWrapping; st.repeat.set(3, 2.4);
    root.add(mesh(BOX, M(0xffffff, { map: st, roughness: .9 }), 0, .015, 0, HW * 2, .03, HD * 2));
    const mt = seedTex(); root.add(sph(M(0xffffff, { map: mt, roughness: .9 }), .05, .03, -.05, .26, .05, .2));
    const list = []; if (withSplats) for (const [x, z] of [[-.3, .18], [.22, .2], [-.08, -.22], [.33, -.16], [-.32, -.12], [.08, .05], [.15, -.28], [-.18, .02]]) { const s = makeSplat(); s.position.set(x, .036, z); s.visible = false; root.add(s); list.push(s); }
    return { root, splats: list }; }
  function makeHouse() { const root = new T.Group(); const post = M(0x7a4e2c, { roughness: .8 }), red = M(0xd2453a, { roughness: .45 }), wood = M(0xc98b4e, { roughness: .7 });
    root.add(mesh(CYL, post, 0, PY / 2, 0, .06, PY, .06)); root.add(mesh(CYL, post, 0, .03, 0, .3, .06, .3));
    for (const s of [-1, 1]) { const b = mesh(BOX, post, s * .14, PY - .22, 0, .035, .32, .035); b.rotation.z = -s * .7; root.add(b); }
    const tr = makeTray(true); tr.root.position.y = PY; root.add(tr.root);
    for (const [x, z] of [[-HW, -HD], [HW, -HD], [-HW, HD], [HW, HD]]) root.add(mesh(CYL, wood, x, PY + .27, z, .025, .54, .025));
    for (const s of [-1, 1]) { const r = mesh(BOX, red, 0, PY + .74, s * .26, HW * 2 + .3, .05, .62); r.rotation.x = s * .62; root.add(r); }
    root.add(mesh(CYL, M(0xb03a30), 0, PY + .93, 0, .035, HW * 2 + .32, .035).rotateZ(PI / 2));
    // Schild "VILLA" am Giebel vorn, goldene Kugel auf dem First
    const sign = mesh(new T.PlaneGeometry(.42, .14), M(0xffffff, { map: canvasTex(256, 86, (c, w, h) => { c.fillStyle = "#ffd84d"; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 18); c.fill(); c.fillStyle = "#5a2a10"; c.font = '900 52px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("VILLA", w / 2, h / 2 + 3); }), roughness: .5 }), 0, PY + .6, HD + .06);
    root.add(sign); root.add(sph(M(0xffd84d, { metalness: .6, roughness: .3 }), 0, PY + 1.0, 0, .06));
    return { root, splats: tr.splats }; }
  // ---------- Mini-Vogelklo (Wurzel unten) ----------
  function makeToilet() { const root = new T.Group(); const w = M(0xffffff, { roughness: .2 }), blue = M(0x8fd3ff, { roughness: .1, metalness: .2 });
    root.add(mesh(new T.CylinderGeometry(.05, .035, .06, 24), w, 0, .03, 0)); const seat = mesh(new T.TorusGeometry(.045, .012, 8, 24), w, 0, .062, 0); seat.rotation.x = PI / 2; root.add(seat);
    root.add(mesh(new T.CircleGeometry(.036, 20), blue, 0, .058, 0).rotateX(-PI / 2));
    root.add(mesh(BOX, w, -.055, .1, 0, .03, .09, .085)); const lid = mesh(new T.CylinderGeometry(.05, .05, .008, 24), w, -.04, .11, 0); lid.rotation.z = 1.2; root.add(lid);
    root.add(mesh(BOX, M(0xc5ced8, { metalness: .8, roughness: .3 }), -.035, .15, .03, .02, .01, .01));
    root.scale.setScalar(2.1); return { root }; }
  // ---------- Schrubbbürste (Wurzel = Griff-Ende in der Hand) ----------
  function makeBrush() { const root = new T.Group(); root.add(mesh(CYL, M(0xd9a35e, { roughness: .6 }), 0, -.15, 0, .02, .3, .02));
    root.add(mesh(BOX, M(0x2f6fd0, { roughness: .4 }), 0, -.31, 0, .18, .05, .09)); root.add(mesh(BOX, M(0xfff2b0, { roughness: .9 }), 0, -.35, 0, .17, .04, .08)); return { root }; }
  // ---------- Reporter-Mikrofon (Kopf zeigt nach +y) ----------
  function makeMic() { const root = new T.Group(); root.add(mesh(CYL, M(0x1b1b1f, { roughness: .3 }), 0, 0, 0, .028, .34, .028));
    const head = sph(M(0x8a8f99, { metalness: .6, roughness: .35 }), 0, .22, 0, .075); root.add(head);
    const flag = mesh(BOX, M(0xffffff, { map: canvasTex(128, 128, (c, w, h) => { c.fillStyle = "#e5222c"; c.fillRect(0, 0, w, h); c.fillStyle = "#fff"; c.font = '900 44px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("LIVE", w / 2, h / 2 + 2); }), roughness: .5 }), 0, .1, 0, .1, .1, .1);
    root.add(flag); return { root }; }
  // ---------- Keime (grüne Glibber-Kugeln mit Augen und Grinsen) ----------
  function makeGerms(n) { const root = new T.Group(); const list = [];
    const cols = [0x5fd35a, 0x9be03a, 0x3fc39a]; const eyeW = M(0xffffff, { roughness: .2 }), pu = M(0x101010), mouthM = M(0x1a3a12);
    for (let i = 0; i < n; i++) { const gq = new T.Group(); const m = M(cols[i % 3], { roughness: .35, emissive: cols[i % 3], emissiveIntensity: .15 });
      gq.add(sph(m, 0, 0, 0, .1)); for (let k = 0; k < 6; k++) { const a = k * 1.05, b = k * 2.1; gq.add(sph(m, Math.cos(a) * .09, Math.sin(b) * .06, Math.sin(a) * .09, .035)); }
      for (const s of [-1, 1]) { gq.add(sph(eyeW, .07, .03, s * .035, .028)); gq.add(sph(pu, .093, .03, s * .035, .013)); }
      const mo = mesh(new T.TorusGeometry(.03, .008, 6, 16, PI), mouthM, .085, -.02, 0); mo.rotation.set(0, PI / 2, PI); gq.add(mo);
      gq.traverse((mm) => { if (mm.isMesh) mm.castShadow = false; }); root.add(gq); list.push(gq); }
    return { root, list }; }
  // ---------- Futterstange + Futtersäule ----------
  const HH = 2.05;
  function makePole() { const root = new T.Group(); const m = M(0x2d4a3a, { roughness: .4, metalness: .4 });
    root.add(mesh(CYL, m, .55, HH / 2, 0, .035, HH + .1, .035));
    const arm = mesh(CYL, m, .28, HH + .03, 0, .025, .56, .025); arm.rotation.z = PI / 2; root.add(arm);
    root.add(mesh(new T.TorusGeometry(.04, .01, 8, 16, PI * 1.4), m, 0, HH - .01, 0)); root.add(sph(m, .55, HH + .06, 0, .05)); root.add(mesh(CYL, m, .55, .02, 0, .14, .04, .14));
    return { root }; }
  const P1 = -.62, P2 = -.4; // Sitzstangen-Höhen relativ zum Aufhängepunkt
  function makeSilo() { const root = new T.Group(); const grn = M(0x2f9e5a, { roughness: .4 }), met = M(0xc5ced8, { metalness: .85, roughness: .3 });
    root.add(mesh(CYL, met, 0, -.06, 0, .006, .12, .006));
    root.add(mesh(new T.ConeGeometry(.13, .09, 32), grn, 0, -.15, 0));
    const st = seedTex(); st.wrapS = st.wrapT = T.RepeatWrapping; st.repeat.set(2, 2);
    root.add(mesh(CYL, M(0xffffff, { map: st, roughness: .9 }), 0, -.45, 0, .078, .44, .078));
    const glass = mesh(CYL, M(0xdff3ff, { roughness: .05, metalness: .1, transparent: true, opacity: .28 }), 0, -.44, 0, .088, .52, .088); glass.castShadow = false; root.add(glass);
    root.add(mesh(CYL, grn, 0, -.71, 0, .1, .03, .1));
    for (const y of [P1, P2]) { const p = mesh(CYL, met, 0, y, 0, .008, .56, .008); p.rotation.z = PI / 2; root.add(p);
      for (const s of [-1, 1]) { const port = mesh(new T.CylinderGeometry(.03, .03, .02, 20), grn, s * .088, y + .05, 0); port.rotation.z = PI / 2; root.add(port); } }
    return { root }; }
  function heartGeo() { const s = new T.Shape(); s.moveTo(0, -.5); s.bezierCurveTo(-.9, .1, -.5, .75, 0, .35); s.bezierCurveTo(.5, .75, .9, .1, 0, -.5);
    const geo = new T.ExtrudeGeometry(s, { depth: .18, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 4, curveSegments: 20 }); geo.center(); return geo; }
  function makeHearts() { const root = new T.Group(); const geo = heartGeo(), m = M(0xff4d6d, { roughness: .3 }); const list = [];
    for (let i = 0; i < 4; i++) { const h = mesh(geo, m); h.castShadow = false; h.scale.setScalar(.1); root.add(h); list.push(h); } return { root, list }; }

  K3.onBuild(() => {
    rudi = K3.rudi; tit = actor(makeTit(), "Blaumeise"); tit2 = actor(makeTit(), "Blaumeise 2"); tit3 = actor(makeTit(), "Blaumeise 3");
    for (let i = 0; i < 3; i++) bigTits.push(actor(makeTit(), "Meise gross " + i));
    house = actor(makeHouse(), "Futterhaus"); tray = actor(makeTray(true), "Futterbrett"); toilet = actor(makeToilet(), "Klo in der Hand");
    for (let i = 0; i < 2; i++) toilets.push(actor(makeToilet(), "Klo " + i));
    brush = actor(makeBrush(), "Buerste"); mic = actor(makeMic(), "Mikro"); germs = actor(makeGerms(9), "Keime");
    for (let i = 0; i < 15; i++) finches.push(actor(makeFinch(), "Gruenfink " + i));
    pole = actor(makePole(), "Futterstange"); silo = actor(makeSilo(), "Futtersaeule"); hearts = actor(makeHearts(), "Herzen");
    splats = house.splats; traySplats = tray.splats;
    for (const a of [house, tray, toilet, brush, mic, germs, pole, silo, hearts, ...toilets]) a.noCheck = true;
  });
  function reset() { for (const b of [tit, tit2, tit3, ...bigTits, ...finches]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = false; b.body.rotation.set(0, 0, 0); }
    rudi.noCheck = false; rudi.body.position.set(0, 0, 0); rudi.legs.forEach((l) => l.rotation.set(0, 0, 0)); rudi.root.rotation.set(0, 0, 0);
    splats.forEach((s) => { s.visible = false; s.scale.setScalar(1); }); traySplats.forEach((s) => { s.visible = false; s.scale.setScalar(1); }); toilets.forEach((x) => x.root.scale.setScalar(2.1)); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  // Standplätze im Garten
  const FH = V(.25, 0, -.1);                     // Futterhaus
  const RX = -.88, RZ = -.12;                    // Rudi links neben dem Haus
  const HK = V(.12, HH, -.1);                    // Haken der Futterstange
  function houseAt() { place(house, FH.x, FH.z, 0); house.root.updateMatrixWorld(true); }
  function onSeeds(dx, dz) { return V(FH.x + dx, SY, FH.z + dz); }
  function showSplats(n, popT, t) { splats.forEach((s, i) => { s.visible = i < n; s.scale.setScalar(1); }); if (popT !== undefined && n > 0) { const p = clamp(popT / .25, 0, 1); splats[n - 1].scale.setScalar(easeBack(p) + .001); } }
  function rudiAt(t, o, x, z) { place(rudi, x ?? RX, z ?? RZ, 0); poseRudi(rudi, t, Object.assign({ arms: [.1, .1], spread: .1, mouth: "smile" }, o || {})); rudi.root.updateMatrixWorld(true); }
  function hand(i) { return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function birdAt(B, p, ry) { B.root.visible = true; B.root.position.copy(p); B.root.rotation.set(0, ry || 0, 0); B.noCheck = true; }
  function sparkle(x, y, s, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a, 0, 1); g.translate(x, y); g.fillStyle = "#fffbe0"; g.shadowColor = "rgba(255,230,120,.9)"; g.shadowBlur = 18;
    g.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? s * .28 : s, an = i * PI / 4; g.lineTo(Math.cos(an) * r, Math.sin(an) * r); } g.closePath(); g.fill(); g.restore(); }
  // Eilmeldungs-Banner (2D) mit Laufschrift, a = Einblendung 0..1
  function news(a, t) { if (a <= 0) return; a = clamp(a, 0, 1); g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    const x0 = 40, x1 = W - 200, y0 = H * .575, slide = (1 - sm(a)) * -900; g.translate(slide, 0);
    g.fillStyle = "#d81f26"; g.beginPath(); g.roundRect(x0, y0, x1 - x0, 92, [16, 16, 0, 0]); g.fill();
    g.font = '900 56px "Montserrat"'; g.textAlign = "left"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText(L("BREAKING NEWS", "EILMELDUNG"), x0 + 28, y0 + 48);
    const on = Math.sin(t * 6) > -.3; g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.roundRect(x1 - 158, y0 + 22, 132, 50, 25); g.fill();
    g.fillStyle = on ? "#d81f26" : "#f3a0a3"; g.beginPath(); g.arc(x1 - 130, y0 + 47, 11, 0, 7); g.fill(); g.fillStyle = "#d81f26"; g.font = '900 32px "Montserrat"'; g.fillText("LIVE", x1 - 110, y0 + 49);
    g.fillStyle = "#ffffff"; g.fillRect(x0, y0 + 92, x1 - x0, 66); g.fillStyle = "#1d2250"; g.fillRect(x0, y0 + 92, x1 - x0, 6);
    g.save(); g.beginPath(); g.rect(x0, y0 + 92, x1 - x0, 66); g.clip(); g.font = '800 40px "Montserrat"'; g.fillStyle = "#1d2250";
    const msg = L("BIRD FEEDER EXPOSED AS GERM BOMB  +++  RUDI UNDER SUSPICION  +++  ", "VOGELHÄUSCHEN ALS KEIMSCHLEUDER ENTLARVT  +++  RUDI UNTER VERDACHT  +++  ");
    const mw = g.measureText(msg).width, off = (t * 220) % mw; g.fillText(msg + msg, x0 + 20 - off, y0 + 128); g.restore();
    g.restore(); }
  function bigNumber(s, y, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a, 0, 1); g.font = '900 150px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle";
    g.lineWidth = 16; g.strokeStyle = "rgba(10,14,50,.85)"; g.strokeText(s, W * .42, y); g.fillStyle = "#ffd84d"; g.fillText(s, W * .42, y); g.restore(); }

  // ---------- Hook-Szene (auch Loop): zwei Meisen im Körnerbett, Kleckse, Reporter-Mikro schiebt sich vor die Meise ----------
  function hookScene(p, t) { inYard(); houseAt(); showSplats(5); const q = clamp(p, 0, 1);
    birdAt(tit, onSeeds(.2, .1), -1.2); poseBird(tit, t, { wide: true, look: Math.sin(t * 2) * .08 });
    birdAt(tit2, onSeeds(-.28, -.16), .35); poseBird(tit2, t + 1, { peck: 1 });
    mic.root.visible = true; const head = tit.head.getWorldPosition(V(0, 0, 0)); const reach = sm(clamp((p + .1) / .4, 0, 1));
    mic.root.position.set(head.x - .38 + reach * .2, head.y - .42 + reach * .08, head.z + .3); mic.root.rotation.set(.25, 0, -.75 + Math.sin(t * 3) * .03);
    frameOn([tit, tit2], { az: lerp(.4, .3, q), el: .16, fill: lerp(.82, .92, q), dy: .02, t }); draw(); }
  KZ.shot("vHook", (lt, d, t) => { const ph = lt / d; hookScene(ph, t); news(ph * 4 + .6, t); });
  // 1 Rudi stolz vor der Villa -> Schnitt: zwei Meisen landen mitten im Futter
  KZ.shot("vBuild", (lt, d, t) => { const ph = lt / d;
    if (ph < .5) { const k = ph / .5; inYard(); houseAt(); rudiAt(t, { arms: [lerp(.3, 1.9, sm(clamp(k / .3, 0, 1))), lerp(.3, 1.9, sm(clamp(k / .3, 0, 1)))], spread: .45, mouth: "smile", nod: .05 });
      frameOn([rudi, house], { az: lerp(.5, .42, k), el: .1, fill: lerp(.9, .96, k), t }); draw();
      const top = scr(V(FH.x, PY + 1.05, FH.z)); for (let i = 0; i < 4; i++) sparkle(top[0] + Math.cos(i * 1.7 + t) * 120, top[1] + Math.sin(i * 2.3 + t) * 80, 26, Math.sin(t * 5 + i * 1.6));
      stamp(L("LUXURY HOUSE", "LUXUS-HAUS"), W * .42, H * .17, (lt - .1) / .3, "#2f6fd0", -.06); return; }
    const k = (ph - .5) / .5; inYard(); houseAt(); showSplats(0);
    [[tit, .12, .1, -.3, 0], [tit2, -.24, -.05, .3, .15]].forEach(([B, dx, dz, ry, dl]) => { const land = sm(clamp((k - dl) / .5, 0, 1)); const p = onSeeds(dx, dz).add(V(-.55, .12, .6).multiplyScalar(1 - land)); p.y += Math.sin(land * PI) * .1;
      birdAt(B, p, ry); poseBird(B, t, { flap: land < .98 ? 1 : 0, wide: land >= .98, lean: land < .98 ? .2 : 0 }); });
    frameOn([tit, tit2], { az: lerp(.35, .28, k), el: .14, fill: lerp(.85, .92, k), dy: .03, t }); draw();
    stamp(L("RIGHT IN!", "MITTEN REIN!"), W * .42, H * .17, (k - .55) * d * .5 / .3, "#ff9f1c", .06); });
  // 2 Fressen, trampeln, Kleckse ploppen ins Körnerbett
  KZ.shot("vPoop", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); houseAt();
    const n = ph < .3 ? 0 : ph < .5 ? 1 : ph < .65 ? 2 : ph < .8 ? 3 : 4; const pops = [.3, .5, .65, .8]; showSplats(n, n ? (ph - pops[n - 1]) * d : undefined, t);
    birdAt(tit, onSeeds(.27 + Math.sin(t * 2) * .03, .14), -.5); poseBird(tit, t, { peck: ph < .45 ? 1 : 0, hop: ph >= .45 ? 1 : 0, walk: ph >= .45 ? 1 : 0, tailUp: ph > .6 && ph < .7 ? .4 : 0 });
    birdAt(tit2, onSeeds(-.3, .08 + Math.sin(t * 1.6) * .03), .3); poseBird(tit2, t + 1, { peck: 1, tailUp: ph > .28 && ph < .38 ? .4 : 0 });
    birdAt(tit3, onSeeds(-.02, -.24), 1.6); poseBird(tit3, t + 2, { hop: 1, walk: 1 });
    frameOn([tit, tit2, tit3], { az: lerp(.3, .2, k), el: .3, fill: lerp(.92, 1.0, k), t }); draw();
    if (ph < .5) stamp(L("STOMP STOMP", "TRAMPEL!"), W * .42, H * .17, (lt - .15) / .3, "#7a5cff", -.06);
    else stamp(L("SPLAT!", "PLATSCH!"), W * .42, H * .17, (ph - .5) * d / .3, "#e5484d", .07); });
  // 3 Rudi stellt Mini-Klos auf -> Schnitt: Meise steht neben dem Klo und kleckst ins Futter
  KZ.shot("vToilet", (lt, d, t) => { const ph = lt / d;
    if (ph < .5) { const k = ph / .5; inYard(); houseAt(); showSplats(3); const a = lerp(.6, 1.72, sm(clamp(k / .45, 0, 1)));
      rudiAt(t, { arms: [.15, a], spread: .02, mouth: "smile" }); const hp = hand(1);
      const placed = k > .55; toilet.root.visible = !placed; if (!placed) { toilet.root.position.copy(hp).add(V(.02, -.02, 0)); toilet.root.rotation.set(0, .4, 0); }
      toilets.forEach((x, i) => { const pk = sm(clamp((k - .55 - i * .15) / .2, 0, 1)); x.root.visible = pk > 0; x.root.position.copy(onSeeds(i ? .3 : -.32, i ? -.2 : .18)); x.root.rotation.set(0, i ? 2.4 : .6, 0); x.root.scale.setScalar(2.1 * easeBack(pk) + .001); });
      frameOn([rudi, house], { az: lerp(.48, .42, k), el: .12, fill: lerp(.92, .97, k), t }); draw();
      stamp(L("BIRD TOILET", "VOGELKLO"), W * .42, H * .17, (lt - .1) / .3, "#2f6fd0", -.06); return; }
    const k = (ph - .5) / .5; inYard(); houseAt(); showSplats(3); const pop = k > .45;
    toilets.forEach((x, i) => { x.root.visible = true; x.root.position.copy(onSeeds(i ? .3 : -.32, i ? -.2 : .18)); x.root.rotation.set(0, i ? 2.4 : .6, 0); });
    if (pop) { splats[3].visible = true; splats[3].scale.setScalar(easeBack(clamp((k - .45) * d * .5 / .25, 0, 1)) + .001); }
    birdAt(tit, onSeeds(-.12, .14), -.6); poseBird(tit, t, { look: k > .55 ? -.6 : 0, tailUp: k > .38 && k < .5 ? .45 : 0, wide: k > .55 });
    frameOn([tit, toilets[0]], { az: lerp(.4, .32, k), el: .16, fill: lerp(.7, .78, k), dy: .02, t }); draw();
    stamp(L("IGNORED", "IGNORIERT"), W * .42, H * .17, (k - .5) * d * .5 / .3, "#e5484d", .07); });
  // 4 Rudi schrubbt (Bürste in der rechten Hand), alles glänzt -> Meise landet, Platsch
  KZ.shot("vScrub", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); houseAt();
    const clean = ph < .62; const a = 1.75 + (clean ? Math.sin(t * 14) * .12 : 0);
    rudiAt(t, { arms: [.2, a], spread: .02, mouth: clean ? "smile" : "o", wide: !clean, tilt: clean ? 0 : -.08 });
    rudi.arms[1].rotation.x += clean ? Math.sin(t * 7) * .12 : 0; rudi.root.updateMatrixWorld(true);
    const hp = hand(1); brush.root.visible = true; brush.root.position.copy(hp); brush.root.rotation.set(0, 0, a - .2 + PI);
    const landK = sm(clamp((ph - .55) / .2, 0, 1));
    if (ph > .55) { const p = onSeeds(.22, .05).add(V(.5, .5, .3).multiplyScalar(1 - landK)); birdAt(tit, p, PI + .3); poseBird(tit, t, { flap: landK < .98 ? 1 : 0, tailUp: ph > .78 && ph < .88 ? .45 : 0 }); }
    if (ph > .82) { splats[1].visible = true; splats[1].scale.setScalar(easeBack(clamp((ph - .82) * d / .25, 0, 1)) + .001); }
    frameOn([rudi, house], { az: lerp(.45, .38, k), el: .12, fill: lerp(.94, 1.0, k), t }); draw();
    if (clean) { for (let i = 0; i < 5; i++) { const sp = scr(onSeeds(-.35 + i * .17, (i % 2) * .15 - .05)); sparkle(sp[0], sp[1] - 30, 42, Math.sin(t * 6 + i * 1.3)); }
      stamp(L("SPOTLESS", "BLITZBLANK"), W * .42, H * .17, (lt - .1) / .3, "#36b37e", -.06); }
    else stamp(L("SPLAT!", "PLATSCH!"), W * .42, H * .17, (ph - .82) * d / .3, "#e5484d", .07); });
  // 5 Studio: Riesen-Futterbrett mit 3 Meisen, Keime hüpfen von Vogel zu Vogel + LBV-Karte
  KZ.shot("vGerms", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    tray.root.visible = true; tray.root.scale.setScalar(2.2); tray.root.position.set(0, .2, 0); traySplats.forEach((s, i) => s.visible = i < 6);
    const spots = [V(-.62, .28, .2), V(.1, .28, -.42), V(.66, .28, .25)];
    bigTits.forEach((B, i) => { birdAt(B, spots[i], [.4, 0, -.5][i]); poseBird(B, t + i, { sc: 2.1, peck: i === 1 ? 1 : 0, wide: i !== 1 }); });
    germs.root.visible = true; germs.list.forEach((gq, i) => { const hopT = (t * .9 + i * .37) % 1, from = spots[i % 3], to = spots[(i + 1) % 3];
      const born = clamp((ph - i * .06) / .15, 0, 1); gq.visible = born > 0; const p = from.clone().lerp(to, sm(hopT)); p.y += .75 + Math.sin(hopT * PI) * .7 + (i % 3) * .08; p.z += .25;
      gq.position.copy(p); gq.rotation.y = t * 2 + i; gq.scale.setScalar(easeBack(born) * (1.6 + (i % 3) * .3) + .001); });
    frameOn([tray, ...bigTits], { az: lerp(.25, .12, k), el: .25, fill: lerp(.7, .78, k), dy: -.35, t }); draw();
    stamp(L("SALMONELLA", "SALMONELLEN"), W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .38) / .3); if (card(W * .42, H * .615, 840, 270, cp, "LBV", "#2f6fd0")) { const a = clamp(cp, 0, 1);
      if (L("en", "de") === "de") { txt("„Diese Krankheiten übertragen sich", W * .42, H * .615 - 8, 38, "#1d2250", { a }); txt("besonders schnell an den klassischen", W * .42, H * .615 + 40, 38, "#1d2250", { a }); txt("Futterhäuschen!“", W * .42, H * .615 + 88, 38, "#1d2250", { a }); }
      else { txt("Germany's bird society: diseases", W * .42, H * .615 - 8, 38, "#1d2250", { a }); txt("spread especially fast at", W * .42, H * .615 + 40, 38, "#1d2250", { a }); txt("classic bird feeder houses.", W * .42, H * .615 + 88, 38, "#1d2250", { a }); } } });
  // 6 Studio: Grünfinken erscheinen Reihe für Reihe, Zähler läuft auf 70.000 + NABU-Hinweis
  KZ.shot("vFinch", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    finches.forEach((B, i) => { const r = Math.floor(i / 5), c = i % 5; birdAt(B, V(-1.0 + c * .5, 0, -.55 + r * .5), -.25); poseBird(B, t + i * .7, { sc: .95 }); });
    frameOn(finches, { az: lerp(.3, .2, k), el: .45, fill: lerp(.82, .88, k), dy: -.25, t });
    finches.forEach((B, i) => { const pk = clamp((ph - .03 - i * .03) / .12, 0, 1); B.root.visible = pk > 0; poseBird(B, t + i * .7, { sc: (.95 * easeBack(pk) + .001), sad: ph > .55 ? 1 : 0 }); });
    draw();
    stamp("2009", W * .42, H * .17, (lt - .1) / .3, "#e5484d", -.06);
    const n = Math.round(70000 * sm(clamp((ph - .15) / .55, 0, 1))); const s = L(n.toLocaleString("en-US"), n.toLocaleString("de-DE"));
    bigNumber(s, H * .55, (ph - .1) * 4); txt(L("GREENFINCHES", "GRÜNFINKEN"), W * .42, H * .615, 52, "#ffffff", { a: clamp((ph - .25) * 4, 0, 1), w: 900 });
    const cp = sm((lt - d * .6) / .3); if (card(W * .42, H * .665, 640, 74, cp)) txt(L("Source: NABU / LBV estimate", "Quelle: Schätzung NABU / LBV"), W * .42, H * .665, 32, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 7 Pointe: Rudi stolz vor der Villa mit Klos und Klecksen, dann "Igitt"
  KZ.shot("vPunch", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); houseAt(); showSplats(6);
    toilets.forEach((x, i) => { x.root.visible = true; x.root.position.copy(onSeeds(i ? .3 : -.32, i ? -.2 : .18)); x.root.rotation.set(0, i ? 2.4 : .6, 0); });
    birdAt(tit, onSeeds(.05, .12), -.4); poseBird(tit, t, { peck: 1 });
    const proud = ph < .5; rudiAt(t, proud ? { arms: [.3, 1.6], spread: .3, mouth: "smile", nod: .06 } : { arms: [2.75, .2], spread: .1, mouth: "o", tilt: -.12, wide: true });
    frameOn([rudi, house], { az: lerp(.48, .4, k), el: .12, fill: lerp(.93, 1.0, k), t }); draw();
    if (proud) stamp(L("5 STARS", "5 STERNE"), W * .42, H * .17, (lt - .1) / .3, "#ff9f1c", -.06);
    else stamp(L("EWW!", "IGITT!"), W * .42, H * .17, (ph - .5) * d / .3, "#e5484d", .07); });
  // 8 Tipp: Futtersäule an der Stange, zwei Meisen an den Sitzstangen, Herzen
  KZ.shot("vTip", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); place(pole, HK.x, HK.z, 0);
    silo.root.visible = true; silo.root.position.copy(HK); silo.root.rotation.set(0, 0, Math.sin(t * 3) * .02); silo.root.updateMatrixWorld(true);
    const pA = silo.root.localToWorld(V(-.25, P1, 0)), pB = silo.root.localToWorld(V(.25, P2, 0));
    birdAt(tit, pA, 0); poseBird(tit, t, { peck: 1, sc: .9 }); birdAt(tit2, pB, PI); poseBird(tit2, t + 1, { peck: ph > .3 ? 1 : 0, sc: .9 });
    hearts.root.visible = ph > .45; const c = silo.root.localToWorld(V(0, -.4, 0)); hearts.list.forEach((h, i) => { const p = clamp((ph - .45 - i * .07) / .25, 0, 1); h.visible = p > 0; h.position.set(c.x - .3 + i * .2, c.y + .35 + p * .45, c.z + .2); h.rotation.y = t * 2 + i; h.scale.setScalar(.08 * easeBack(p) + .001); });
    frameOn([silo, tit, tit2], { az: lerp(.3, .2, k), el: .1, fill: lerp(.8, .88, k), t }); draw();
    stamp(L("TUBE FEEDER", "FUTTERSÄULE"), W * .42, H * .17, (lt - .1) / .3, "#36b37e", -.06);
    if (ph > .55) stamp(L("CLEAN FOOD", "SAUBER!"), W * .42, H * .64, (ph - .55) * d / .3, "#2f6fd0", .06); });
  // 9 Altes Häuschen: Rudi fegt täglich aus, Kleckse verschwinden
  KZ.shot("vSweep", (lt, d, t) => { const ph = lt / d, k = sm(ph); inYard(); houseAt();
    const left = Math.max(0, 5 - Math.floor(ph * 7)); showSplats(left);
    const a = 1.75 + Math.sin(t * 12) * .14; rudiAt(t, { arms: [.2, a], spread: .02, mouth: "smile" }); rudi.arms[1].rotation.x += Math.sin(t * 6) * .14; rudi.root.updateMatrixWorld(true);
    const hp = hand(1); brush.root.visible = true; brush.root.position.copy(hp); brush.root.rotation.set(0, 0, a - .2 + PI);
    frameOn([rudi, house], { az: lerp(.4, .46, k), el: .12, fill: lerp(.95, .98, k), t }); draw();
    for (let i = 0; i < 3; i++) { const sp = scr(onSeeds(-.3 + i * .25, .05)); sparkle(sp[0], sp[1] - 20, 22, Math.sin(t * 5 + i * 2) * clamp(ph * 2, 0, 1)); }
    stamp(L("EVERY DAY", "JEDEN TAG"), W * .42, H * .17, (lt - .1) / .3, "#36b37e", -.06); });
  // 10 Loop: zurück in die Hook-Einstellung, Eilmeldung blendet wieder ein
  KZ.shot("vLoop", (lt, d, t) => { const ph = lt / d; hookScene(lerp(-.35, 0, ph), t); news(sm((ph - .3) / .6), t);
    if (ph > .2 && ph < .6) stamp(L("GERM BOMB?", "KEIM-ALARM?"), W * .42, H * .17, (ph - .2) * d / .3, "#7a5cff", -.06); });

  window.__birdfeeder3d = true;
})();
