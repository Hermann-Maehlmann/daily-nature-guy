// 3D-Szene "Why Your Dog's Guilty Look Isn't Guilt" / "Warum der Schuldblick deines Hundes täuscht" (20.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Hund: Beagle-Mischling (dreifarbig: lohfarbener Kopf, schwarzer Sattel, weiße Brust/Schnauze/Pfoten/Schwanzspitze, lange Schlappohren),
// mit Schuldblick-Pose (Kopf tief und weggedreht, Ohren zurück, Schwanz tief, Augen zur Seite), Kauen (Kissenfetzen/Kauknochen im Maul).
// Wohnzimmer (Sofa, Teppich, Fenster), zerfetztes Kissen + Füllwatte, Rudi als Richter (weiße Perücke, Hammer, Richterpult), Anklagebank,
// Leckerli-Knochen, Balken-Infografik, Heiligenschein, Kauknochen.
// Quellen: Horowitz 2009, Behavioural Processes ("Disambiguating the guilty look", 14 Hunde; Barnard College), AKC, VCA.
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  let dog, bigDog, rudi, room, roomBg, fluff, pillow, pillow2, wig, gavel, bench, dock, treat, bars, halo, chew, door;

  // ---------- Hund: Beagle-Mischling ----------
  function makeDog() {
    const tan = M(0xc9803c, { roughness: .8 }), white = M(0xfbf3e6, { roughness: .85 }), black = M(0x2b2420, { roughness: .75 }), nose = M(0x1d1614, { roughness: .3 }),
      ear = M(0x9a5a2a, { roughness: .8 }), eyeW = M(0xffffff, { roughness: .15 }), pupil = M(0x231510, { roughness: .1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const torso = sph(tan, 0, .56, 0, .46, .27, .25); body.add(torso);
    const saddle = sph(black, -.06, .66, 0, .36, .19, .235); body.add(saddle);           // schwarzer Sattel
    body.add(sph(white, .3, .5, 0, .2, .22, .2));                                            // weiße Brust
    body.add(sph(white, 0, .43, 0, .34, .13, .18));                                           // weißer Bauch
    const legs = [];
    for (const [x, z] of [[.27, .14], [.27, -.14], [-.27, .14], [-.27, -.14]]) { const l = limb(.075, .36, tan); l.position.set(x, .48, z); const paw = sph(white, .035, -.38, 0, .095, .06, .085); l.add(paw); l.add(sph(white, 0, -.28, 0, .078, .1, .078)); body.add(l); legs.push(l); }
    const head = new T.Group(); head.position.set(.46, .88, 0); body.add(head);
    head.add(sph(tan, 0, 0, 0, .27, .25, .25));
    head.add(sph(white, .04, .17, 0, .05, .12, .06));                                          // Blesse
    head.add(sph(white, .2, -.08, 0, .17, .12, .14));                                          // weiße Schnauze
    head.add(sph(nose, .36, -.03, 0, .06, .05, .065));
    const eyes = [], brows = [], ears = [], pupils = [];
    for (const s of [-1, 1]) {
      const e = new T.Group(); e.position.set(.18, .07, s * .13); head.add(e);
      e.add(sph(eyeW, 0, 0, 0, .075)); const p = new T.Group(); e.add(p); p.add(sph(pupil, .05, 0, 0, .046)); p.add(sph(M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), .088, .022, -.014 * s, .014)); pupils.push(p); eyes.push(e);
      const b = mesh(BOX, M(0x8a4a1c), .2, .16, s * .13, .03, .02, .09); head.add(b); brows.push(b);
      const ep = new T.Group(); ep.position.set(-.03, .1, s * .23); head.add(ep);
      const ea = sph(ear, 0, -.2, 0, .1, .24, .05); ep.add(ea); ep.rotation.x = s * .15; ears.push(ep);
    }
    const mouth = new T.Group(); mouth.position.set(.28, -.17, 0); head.add(mouth);
    mouth.add(sph(M(0x5a1a22), 0, 0, 0, .08, .035, .08));
    const sadMo = mesh(new T.TorusGeometry(.045, .01, 8, 16, PI), M(0x3a2018), .3, -.15, 0); sadMo.rotation.set(0, PI / 2, 0); head.add(sadMo);
    const happyMo = mesh(new T.TorusGeometry(.05, .011, 8, 16, PI), M(0x3a2018), .3, -.12, 0); happyMo.rotation.set(0, PI / 2, PI); head.add(happyMo);
    const tongue = sph(M(0xff7b8a), .3, -.22, 0, .055, .03, .05); head.add(tongue);
    // Kissenfetzen / Kauknochen im Maul
    const bite = new T.Group(); bite.position.set(.32, -.17, 0); head.add(bite);
    const scrap = sph(M(0xffc23f, { roughness: .8 }), 0, 0, 0, .09, .045, .14); scrap.rotation.y = .4; bite.add(scrap);
    for (const [x, y, z] of [[.03, .03, .1], [-.02, .02, -.12], [.05, -.02, .02]]) bite.add(sph(M(0xffffff, { roughness: 1 }), x, y, z, .04));
    const bone = new T.Group(); bone.position.set(.32, -.17, 0); head.add(bone);
    const blue = M(0x2f9be0, { roughness: .45 }); const sh = mesh(CYL, blue, 0, 0, 0, .025, .3, .025); sh.rotation.x = PI / 2; bone.add(sh);
    for (const z of [-.15, .15]) for (const x of [-.025, .025]) bone.add(sph(blue, x, 0, z, .04));
    const tail = new T.Group(); tail.position.set(-.42, .68, 0); tail.rotation.order = "YZX"; body.add(tail);
    const segs = []; let prev = tail;
    for (let i = 0; i < 10; i++) { const sg = new T.Group(); sg.position.set(i ? -.042 : -.02, 0, 0); prev.add(sg); sg.add(sph(i > 7 ? white : tan, -.02, 0, 0, .06 - i * .003)); segs.push(sg); prev = sg; }
    return { root, body, torso, head, legs, eyes, pupils, brows, ears, mouth, sadMo, happyMo, tongue, bite, bone, tail, segs };
  }
  // o: {guilty 0..1 (Kopf tief, Ohren zurück, Schwanz tief, Blick weg), look (Kopf seitlich), side (Pupillen seitlich), wag, wf, up, chew (0/"scrap"/"bone"),
  //     happy, tongue, sit, walk, sc}
  function poseDog(D, t, o) {
    o = o || {}; const gu = o.guilty || 0;
    const wag = o.wag ?? lerp(.45, .12, gu), wf = o.wf ?? lerp(2.2, 3.2, gu), w = Math.sin(t * wf * 2 * PI);
    D.tail.rotation.y = w * wag; D.tail.rotation.z = -lerp(.45, 1.25, o.up ?? lerp(.6, -.35, gu));
    D.segs.forEach((s, i) => { s.rotation.z = i > 0 ? (gu > .5 ? .09 : -.06) : 0; s.rotation.y = i > 0 ? -Math.sin(t * wf * 2 * PI - i * .3) * wag * .08 : 0; });
    const br = 1 + Math.sin(t * 2.4) * .015; D.torso.scale.set(.46, .27 * br, .25 * br);
    const chewing = o.chew ? Math.sin(t * 14) * .04 : 0;
    D.head.position.set(.46 + gu * .04, .88 - gu * .16, 0);
    D.head.rotation.set(0, (o.look || 0) + Math.sin(t * 1.1) * .03, -gu * .32 + (o.nod || 0) + chewing + (gu ? 0 : Math.sin(t * 1.3) * .03));
    D.brows.forEach((b, i) => { const s = i ? 1 : -1; b.rotation.x = s * gu * .45; b.position.y = .16 + gu * .012; b.visible = gu > .2; });
    const blink = Math.sin(t * 2.1 + 1) > .985 ? .15 : 1; D.eyes.forEach((e) => e.scale.set(1, blink * (o.wide ? 1.15 : 1), 1));
    const sd = o.side ?? 0; D.pupils.forEach((p) => { p.position.set(0, -gu * .012, sd * .035); });
    D.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.x = s * (.15 + gu * .35 + Math.sin(t * 3 + i) * .03); e.rotation.z = gu * .5; });
    D.mouth.visible = !!o.open; D.sadMo.visible = gu > .3 && !o.chew && !o.happy; D.happyMo.visible = !!o.happy && !o.chew;
    D.tongue.visible = !!o.tongue && !o.chew;
    D.bite.visible = o.chew === "scrap"; D.bone.visible = o.chew === "bone";
    const walk = o.walk || 0; D.legs.forEach((l, i) => { l.rotation.z = Math.sin(t * 9 + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .45 * walk; });
    // Sitzen: Hinterteil runter, Hinterbeine gebeugt
    const sit = o.sit || 0; D.body.rotation.z = sit * .42; D.body.position.y = Math.abs(Math.sin(t * 9)) * .04 * walk - sit * .12 - gu * .03;
    D.legs.forEach((l, i) => { if (i > 1) l.rotation.z += -sit * .9; else l.rotation.z += -sit * .38; });
    D.body.scale.set(1, 1 - gu * .04, 1);
    D.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Wohnzimmer (eigene Welt) ----------
  function makeRoom() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(512, 512, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = ["#c8935e", "#bd8752", "#d29d68", "#c28c58"][i % 4]; c.fillRect(0, i * h / 8, w, h / 8); c.fillStyle = "rgba(90,50,20,.35)"; c.fillRect(0, i * h / 8, w, 3); c.fillRect((i * 173) % w, i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(6, 6);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    const wallTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#cfe3d6"; c.fillRect(0, 0, w, h); c.fillStyle = "#c2d9ca"; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h); });
    wallTex.wrapS = wallTex.wrapT = T.RepeatWrapping; wallTex.repeat.set(10, 3);
    r.add(mesh(BOX, new T.MeshStandardMaterial({ map: wallTex, roughness: .9 }), 0, 2.5, -3, 30, 5, .2));
    r.add(mesh(BOX, M(0xffffff), 0, .08, -2.88, 30, .16, .06));
    const sky = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(1, "#cdeeff"); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = "#ffffff"; c.beginPath(); c.arc(70, 90, 26, 0, 7); c.arc(100, 80, 32, 0, 7); c.arc(130, 92, 24, 0, 7); c.fill(); });
    const win = new T.Mesh(new T.PlaneGeometry(1.6, 1.4), new T.MeshStandardMaterial({ map: sky, emissive: 0xffffff, emissiveMap: sky, emissiveIntensity: .5 })); win.position.set(-2.4, 2.3, -2.89); r.add(win);
    const fr = M(0xffffff, { roughness: .5 }); for (const [x, y, sx, sy] of [[-2.4, 3.03, 1.75, .08], [-2.4, 1.57, 1.75, .08], [-3.24, 2.3, .08, 1.5], [-1.56, 2.3, .08, 1.5], [-2.4, 2.3, .05, 1.4], [-2.4, 2.3, 1.6, .05]]) r.add(mesh(BOX, fr, x, y, -2.87, sx, sy, .06));
    const pic = canvasTex(256, 200, (c, w, h) => { c.fillStyle = "#ff9f1c"; c.fillRect(0, 0, w, h); c.fillStyle = "#fff"; c.beginPath(); c.arc(128, 110, 46, 0, 7); c.fill(); for (const [x, y] of [[84, 58], [118, 44], [150, 48], [178, 66]]) { c.beginPath(); c.arc(x, y, 16, 0, 7); c.fill(); } });
    r.add(mesh(BOX, M(0x5a3a2a), 1.9, 2.5, -2.88, 1.0, .8, .04)); const pm = new T.Mesh(new T.PlaneGeometry(.88, .68), new T.MeshStandardMaterial({ map: pic })); pm.position.set(1.9, 2.5, -2.85); r.add(pm);
    const rug = new T.Mesh(new T.CircleGeometry(1.8, 48), M(0x3d5aa8, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(.2, .006, -.2); rug.scale.set(1.3, .8, 1); rug.receiveShadow = true; r.add(rug);
    const rug2 = new T.Mesh(new T.RingGeometry(1.45, 1.6, 48), M(0xffd23f, { roughness: 1 })); rug2.rotation.x = -PI / 2; rug2.position.set(.2, .008, -.2); rug2.scale.set(1.3, .8, 1); r.add(rug2);
    const sofa = new T.Group(); sofa.position.set(.6, 0, -1.9); r.add(sofa);
    const red = M(0xd9534f, { roughness: .8 }), redD = M(0xb84440, { roughness: .85 });
    sofa.add(mesh(BOX, redD, 0, .22, 0, 2.4, .36, .95));
    for (const x of [-.55, .55]) sofa.add(mesh(BOX, red, x, .45, .04, 1.08, .14, .86));
    sofa.add(mesh(BOX, red, 0, .85, -.38, 2.4, .8, .24));
    for (const x of [-1.27, 1.27]) sofa.add(mesh(BOX, red, x, .5, 0, .2, .62, .95));
    sofa.add(sph(M(0xffc23f, { roughness: .8 }), .95, .7, -.18, .2, .2, .07));
    for (const [x, z] of [[-1.1, .4], [1.1, .4], [-1.1, -.4], [1.1, -.4]]) sofa.add(mesh(CYL, M(0x5a3a2a), x, .02, z, .05, .06, .05));
    const pl = new T.Group(); pl.position.set(-1.6, 0, -2.3); r.add(pl); pl.add(mesh(new T.CylinderGeometry(.25, .18, .45, 24), M(0xe0703c), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const a = i / 7 * 2 * PI; const lf = sph(M(i % 2 ? 0x4fae4a : 0x3f9a3c), Math.cos(a) * .2, .75 + (i % 3) * .1, Math.sin(a) * .2, .1, .35, .05); lf.rotation.set(Math.sin(a) * .5, -a, Math.cos(a) * .5); pl.add(lf); }
    return r;
  }
  // Füllwatte auf dem Boden (Wolke aus weißen Kugeln) + zerfetztes Kissen
  function makeFluff(n, seed) { const root = new T.Group(); const wm = M(0xffffff, { roughness: 1 }); let s = seed || 1; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < n; i++) { const a = rnd() * 2 * PI, r = .15 + rnd() * .75, sz = .04 + rnd() * .07; const m = sph(wm, Math.cos(a) * r, sz * .7, Math.sin(a) * r * .7, sz, sz * .8, sz); m.castShadow = false; root.add(m); }
    return { root }; }
  function makePillow(torn) { const root = new T.Group(); const yel = M(0xffc23f, { roughness: .8 }), wm = M(0xffffff, { roughness: 1 });
    const p = sph(yel, 0, .07, 0, .26, .07, .26); root.add(p);
    if (torn) { root.add(sph(wm, .06, .12, .02, .12, .07, .1)); root.add(sph(wm, -.08, .13, -.05, .09, .06, .08)); root.add(sph(yel, .3, .03, .1, .1, .025, .07)); }
    else { for (const [x, z] of [[.24, .24], [-.24, .24], [.24, -.24], [-.24, -.24]]) root.add(sph(yel, x, .07, z, .05, .04, .05)); }
    return { root }; }
  // Rudis Richter-Perücke (weiße Locken, hinten und seitlich, Augen frei)
  function makeWig(R) { const grp = new T.Group(); R.head.add(grp); const wm = M(0xf4f1ea, { roughness: .95 });
    grp.add(sph(wm, -.03, .2, 0, .3, .17, .31));
    for (let i = 0; i < 7; i++) { const z = -.27 + i * .09; grp.add(sph(wm, -.2, .1, z, .07)); }
    for (const s of [-1, 1]) for (let j = 0; j < 3; j++) grp.add(sph(wm, -.06 - j * .05, .02 - j * .1, s * .3, .075));
    grp.visible = false; return grp; }
  function makeGavel() { const root = new T.Group(); const wood = M(0x7a4a26, { roughness: .6 });
    const h = mesh(CYL, wood, 0, -.12, 0, .02, .26, .02); root.add(h); const hd = mesh(CYL, wood, 0, -.26, 0, .06, .18, .06); hd.rotation.x = PI / 2; root.add(hd); return root; }
  // Richterpult mit Schild, Anklagebank
  function makeBench() { const root = new T.Group(); const wood = M(0x8a5530, { roughness: .6 }), dk = M(0x5e3a20, { roughness: .6 });
    root.add(mesh(BOX, wood, 0, .55, 0, .7, 1.1, 1.3)); root.add(mesh(BOX, dk, .03, 1.12, 0, .78, .06, 1.38));
    const tex = canvasTex(512, 160, (c, w, h) => { c.fillStyle = "#ffd23f"; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 24); c.fill(); c.fillStyle = "#1d2250"; const s = L("COURT", "GERICHT"); c.font = '900 92px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s, w / 2, h / 2 + 4); });
    const sg = new T.Mesh(new T.PlaneGeometry(1, .31), new T.MeshStandardMaterial({ map: tex, roughness: .6 })); sg.position.set(.36, .7, 0); sg.rotation.y = PI / 2; root.add(sg);
    return { root }; }
  function makeDock() { const root = new T.Group(); const wood = M(0x8a5530, { roughness: .6 });
    for (const [x, z, sx, sz] of [[.5, 0, .05, 1.0], [-.5, 0, .05, 1.0], [0, .5, 1.0, .05], [0, -.5, 1.0, .05]]) root.add(mesh(BOX, wood, x, .2, z, sx, .4, sz));
    for (const [x, z] of [[.5, .5], [-.5, .5], [.5, -.5], [-.5, -.5]]) root.add(mesh(BOX, wood, x, .24, z, .08, .48, .08));
    return { root }; }
  // Leckerli: Hundekeks in Knochenform auf einem Tellerchen
  function makeTreat() { const root = new T.Group(); const bis = M(0xc98a4a, { roughness: .7 });
    root.add(mesh(CYL, M(0xffffff, { roughness: .4 }), 0, .015, 0, .22, .03, .22));
    const sh = mesh(CYL, bis, 0, .07, 0, .04, .26, .04); sh.rotation.z = PI / 2; root.add(sh);
    for (const x of [-.13, .13]) for (const z of [-.035, .035]) root.add(sph(bis, x, .07, z, .055));
    return { root }; }
  // Balken-Infografik: drei Säulen (gefressen / nicht gefressen / geschimpft)
  function tileTex(word, col, fs) { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = col; c.beginPath(); c.roundRect(0, 0, w, h, 60); c.fill(); c.fillStyle = "#fff"; c.font = `900 ${fs || 92}px "Montserrat"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(word, w / 2, h / 2 + 4); }); }
  function tile(word, col, fs) { const grp = new T.Group(); grp.add(mesh(BOX, M(new T.Color(col).multiplyScalar(.7).getHex(), { roughness: .4 }), 0, 0, -.06, 1.6, .8, .12));
    const f = new T.Mesh(new T.PlaneGeometry(1.6, .8), new T.MeshStandardMaterial({ map: tileTex(word, col, fs), roughness: .4 })); f.position.z = .001; grp.add(f); grp.traverse((m) => { m.castShadow = false; }); return grp; }
  function makeBars() { const root = new T.Group(); const list = [];
    for (const [x, col, lab] of [[-.78, 0x8a93b8, L("ATE IT", "GEFRESSEN")], [0, 0x8a93b8, L("DIDN'T", "NICHT")], [.78, 0xe5484d, L("SCOLDED", "GESCHIMPFT")]]) {
      const grp = new T.Group(); grp.position.x = x; root.add(grp);
      const bar = mesh(BOX, M(col, { roughness: .35 }), 0, .5, 0, .5, 1, .5); grp.add(bar);
      const lt = tile(lab, "#1d2250", lab.length > 8 ? 62 : 80); lt.scale.setScalar(.42); lt.position.set(0, .2, .32); grp.add(lt);
      list.push({ grp, bar }); }
    return { root, list }; }
  function makeHalo() { const root = new T.Group(); const h = mesh(new T.TorusGeometry(.2, .03, 12, 40), M(0xffd23f, { emissive: 0xffb000, emissiveIntensity: .8, roughness: .3 })); h.rotation.x = PI / 2; h.castShadow = false; root.add(h); return { root, h }; }
  // Tür (Rudi geht raus)
  function makeDoor() { const root = new T.Group(); const wood = M(0xf3efe6, { roughness: .6 });
    root.add(mesh(BOX, M(0x8a5530), 0, .95, 0, .9, 1.9, .06)); const lf = mesh(BOX, wood, 0, .95, .02, .8, 1.82, .06); root.add(lf); root.add(sph(M(0xd9a441, { metalness: .7, roughness: .3 }), .3, .95, .07, .04)); return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; dog = actor(makeDog(), "Hund"); bigDog = actor(makeDog(), "Hund gross");
    fluff = actor(makeFluff(26, 3), "Watte"); pillow = actor(makePillow(true), "Kissen"); pillow2 = actor(makePillow(false), "Kissen 2");
    bench = actor(makeBench(), "Richterpult"); dock = actor(makeDock(), "Anklagebank"); treat = actor(makeTreat(), "Leckerli");
    bars = actor(makeBars(), "Balken"); halo = actor(makeHalo(), "Heiligenschein"); door = actor(makeDoor(), "Tuer");
    for (const a of [fluff, pillow, pillow2, bench, dock, treat, bars, halo, door]) a.noCheck = true;
    wig = makeWig(rudi); gavel = makeGavel(); rudi.arms[1].add(gavel); gavel.position.set(0, -.64, 0); gavel.visible = false;
    room = makeRoom(); roomBg = new T.Color(0xcfe3d6).convertSRGBToLinear();
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { wig.visible = false; gavel.visible = false; for (const D of [dog, bigDog]) { D.root.rotation.set(0, 0, 0); D.root.position.set(0, 0, 0); D.noCheck = false; } fluff.root.scale.setScalar(1); pillow2.root.scale.setScalar(1); }
  function inRoom() { begin("yard"); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xcfe3d6, 16, 40); K3.hemi.intensity = .8; reset(); }
  function studio() { begin("studio"); room.visible = false; reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function judge(t, o) { poseRudi(rudi, t, o); rudi.hat.visible = false; wig.visible = true; gavel.visible = true; }
  function blah(s, x, y, p, col) { if (p <= 0) return; txt(s, x, y - p * 40, 60, col || "#ffffff", { stroke: 10, a: clamp(Math.sin(clamp(p, 0, 1) * PI) * 2, 0, 1), w: 900 }); }

  // ---------- Shots ----------
  // 0 Hook: Hund mit Schuldblick neben zerfetztem Kissen und Watte auf dem Teppich
  KZ.shot("gHook", (lt, d, t) => { inRoom(); const ph = lt / d;
    place(fluff, .25, .1, 0); place(pillow, .75, .35, .4);
    at(dog, 0, 0, .1, -.35); poseDog(dog, t, { guilty: 1, look: .55, side: .6 });
    frameOn([dog, FR(-.2, 0, -.2, .8, .3, .5)], { az: lerp(.75, .65, ph), el: lerp(.2, .16, ph), fill: lerp(.82, .88, ph), dy: .08, t }); draw();
    if (ph > .5) stamp(L("GUILTY?", "SCHULDIG?"), W * .42, H * .62, (ph - .5) * d / .3, "#7a5cff", -.06); });
  // 1 Rudi kommt heim, Hände am Kopf; Hund schaut weg
  KZ.shot("gRudi", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(fluff, .6, .1, 0); place(pillow, .9, .35, .3);
    place(rudi, -1.0, .1, -.15); poseRudi(rudi, t, { arms: [1.3, 1.3], spread: 1.0, mouth: "o", wide: true, lean: -.05 });
    at(dog, .55, 0, .35, PI + .5); poseDog(dog, t, { guilty: sm(clamp(ph * 2, 0, 1)), look: -.7 * sm(clamp(ph * 2, 0, 1)), side: -.7 });
    frameOn([rudi, dog], { az: lerp(.55, .48, k), el: .14, fill: lerp(.9, .96, k), t }); draw();
    stamp(L("DESTROYED!", "ZERFETZT!"), W * .42, H * .17, (lt - .25) / .3, "#e5484d", -.06);
    if (ph > .7) stamp(L("GUILTY!", "SCHULDIG!"), W * .42, H * .62, (ph - .7) * d / .3, "#7a5cff", .06); });
  // 2 Standpauke (Zeigefinger, BLA BLA) – Schnitt: Tag 2, neues Kissen zerfetzt, Hund kaut glücklich
  KZ.shot("gLecture", (lt, d, t) => { inRoom(); const ph = lt / d, half = ph > .55;
    if (!half) { const k = sm(ph / .55);
      place(rudi, -.9, .1, -.1); poseRudi(rudi, t, { arms: [.15, 1.45 + Math.sin(t * 9) * .2], spread: .1, mouth: Math.sin(t * 8) > 0 ? "o" : "smile", lean: .06 });
      at(dog, .5, 0, .35, PI + .5); poseDog(dog, t, { guilty: 1, look: -.7, side: -.6 });
      frameOn([rudi, dog], { az: lerp(.5, .44, k), el: .14, fill: lerp(.92, .98, k), t }); draw();
      blah(L("BLA BLA", "BLA BLA"), W * .3, H * .3, (lt % .8) / .8, "#ffffff"); blah(L("BAD DOG!", "BÖSER HUND!"), W * .55, H * .26, ((lt + .4) % .8) / .8, "#ffd23f");
      stamp(L("10 MIN LECTURE", "STANDPAUKE"), W * .42, H * .17, (lt - .2) / .3, "#ff9f1c", -.06); }
    else { const k = (ph - .55) / .45;
      place(fluff, .1, .15, 0); fluff.root.scale.setScalar(1.25); place(pillow, .55, .4, .3);
      at(dog, -.1, 0, .2, .45); poseDog(dog, t, { chew: "scrap", wag: .6, wf: 2.4, up: .8, happy: true });
      frameOn([dog, FR(-.6, 0, -.4, .8, .4, .6)], { az: lerp(.3, .22, k), el: .18, fill: lerp(.95, 1.02, k), t }); draw();
      stamp(L("DAY 2", "TAG 2"), W * .42, H * .17, (k * d * .45 - .1) / .3, "#2f6fd0", .06); } });
  // 3 Gericht: Rudi als Richter mit Perücke und Hammer, Hund in der Anklagebank, Beweisstück (Kissen) – Schnitt: Hund hat es gefressen
  KZ.shot("gTrial", (lt, d, t) => { inRoom(); const ph = lt / d, half = ph > .55; const k = sm(ph);
    place(bench, -.85, -.2, 0); place(rudi, -1.35, -.2, 0);
    const bang = half ? 0 : Math.max(0, Math.sin(t * 9));
    judge(t, { arms: [.1, 1.1 + bang * .45], spread: .15, mouth: half ? "o" : "smile", wide: half });
    place(dock, .75, .1, 0); at(dog, .72, 0, .1, PI + .35); dog.noCheck = true;
    if (!half) { place(pillow2, .1, .45, 0); pillow2.root.scale.setScalar(1.3); poseDog(dog, t, { guilty: .7, look: .3, side: .5 }); }
    else { poseDog(dog, t, { chew: "scrap", wag: .55, up: .7, happy: true }); }
    frameOn([rudi, bench, dog], { az: lerp(.62, .55, k), el: .12, fill: lerp(.88, .94, k), dy: .1, t }); draw();
    if (!half) stamp(L("ON TRIAL", "ANGEKLAGT"), W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", -.06);
    else stamp(L("EVIDENCE GONE", "BEWEIS WEG"), W * .42, H * .17, ((ph - .55) * d - .15) / .3, "#e5484d", .07); });
  // 4 Studie (Studio): Rudi zeigt "Nicht fressen!", geht zur Tür raus; Hund sitzt vor dem Leckerli
  KZ.shot("gStudy", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph), go = sm(clamp((ph - .5) / .35, 0, 1));
    at(dog, .35, 0, .0, PI - .2); poseDog(dog, t, { sit: 1, look: -.1, wide: true, wag: .3, up: .5 });
    place(treat, -.05, 0, .25);
    place(door, -1.35, -.6, .5);
    if (go < .7) { place(rudi, lerp(-.75, -1.3, go), lerp(.1, -.45, go), go > 0 ? PI * .85 : 0); poseRudi(rudi, t, { arms: [.15, go > 0 ? .2 : 1.5], spread: .1, walk: go > 0 && go < 1 ? 1 : 0, mouth: "o" }); }
    frameOn([dog, FR(-1.3, 0, -.6, .9, 1.9, .6)], { az: lerp(.3, .22, k), el: .16, fill: lerp(.88, .94, k), t }); draw();
    stamp(L("DON'T EAT IT!", "NICHT FRESSEN!"), W * .42, H * .17, (lt - .2) / .3, "#e5484d", -.06);
    const cp = sm((ph - .3) * d / .3); if (cp > 0) txt(L("STUDY: 14 DOGS", "STUDIE: 14 HUNDE"), W * .42, H * .62, 62, "#ffd23f", { stroke: 12, a: clamp(cp, 0, 1) }); });
  // 5 Balken: gefressen ≈ nicht gefressen, geschimpft schießt hoch
  KZ.shot("gBars", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bars, 0, 0, 0, 0);
    const a = sm(clamp(ph / .3, 0, 1)), b = easeBack(clamp((ph - .45) / .3, 0, 1));
    const hs = [.55 * a + .02, .55 * a + .02, .55 + b * 1.25];
    bars.list.forEach((B, i) => { const h = i < 2 ? hs[i] : (ph < .45 ? .02 : hs[2]); B.bar.scale.y = h; B.bar.position.y = h / 2; });
    frameOn([FR(-1.1, 0, -.3, 1.1, 1.8, .3)], { az: lerp(.18, .08, k), el: .12, fill: lerp(.86, .92, k), t }); draw();
    txt(L("GUILTY LOOK", "SCHULDBLICK"), W * .42, H * .2, 70, "#ffd23f", { stroke: 12 });
    if (ph > .25 && ph < .62) stamp(L("SAME", "GLEICH"), W * .3, H * .5, (ph - .25) * d / .3, "#36b37e", -.08);
    if (ph > .7) stamp(L("SCOLDING!", "SCHIMPFEN!"), W * .58, H * .3, (ph - .7) * d / .3, "#e5484d", .06); });
  // 6 Das Krasseste: unschuldiger Hund mit Heiligenschein guckt am schuldigsten + Quellenkarte
  KZ.shot("gCrazy", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bigDog, 0, 0, 0, -.35); poseDog(bigDog, t, { guilty: 1, look: .4, side: .6, sc: 1.25 });
    place(halo, 0, 0, 0); const hp = bigDog.head.getWorldPosition(new T.Vector3()); halo.root.position.set(hp.x - .05, hp.y + .42 + Math.sin(t * 3) * .02, hp.z); halo.root.rotation.z = .2;
    frameOn([bigDog], { az: lerp(.75, .65, k), el: .12, fill: lerp(.84, .9, k), dy: -.42, t }); draw();
    stamp(L("INNOCENT", "UNSCHULDIG"), W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .4) / .3); if (card(W * .42, H * .62, 900, 230, cp, "Barnard College 2009", "#2f6fd0")) {
      txt(L("Guilty look = “a response", "Schuldblick = „eine Reaktion auf"), W * .42, H * .62 + 10, 38, "#1d2250", { a: clamp(cp, 0, 1) });
      txt(L("to owner cues”", "Signale des Besitzers“"), W * .42, H * .62 + 60, 38, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 7 Pointe: Rudi (noch mit Perücke) kratzt sich am Kopf, Hund schaut bittend hoch
  KZ.shot("gPunch", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(rudi, -1.0, -.15, 0); judge(t, { arms: [.2, 1.3 + Math.sin(t * 2) * .1], spread: .35, mouth: "o", tilt: -.1 });
    at(dog, .7, 0, .45, PI + .5); poseDog(dog, t, { guilty: .55, look: 0, wag: .2, wf: 3, up: .25 });
    frameOn([rudi, dog], { az: lerp(.5, .44, k), el: .14, fill: lerp(.92, .98, k), t }); draw();
    stamp(L("DON'T BE MAD", "NICHT SAUER!"), W * .42, H * .17, (lt - .2) / .3, "#7a5cff", -.05);
    if (ph > .55) stamp(L("COURTROOM?!", "GERICHT?!"), W * .42, H * .62, (ph - .55) * d / .3, "#ff9f1c", .06); });
  // 8 Tipp: Rudi gibt ruhig einen Kauknochen, Hund wedelt glücklich und kaut
  KZ.shot("gTip", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph), give = ph > .4;
    place(rudi, -.85, -.1, .05); poseRudi(rudi, t, { arms: [.15, give ? .4 : 1.3], spread: .1, mouth: "smile" });
    at(dog, .45, 0, .3, PI + .5); poseDog(dog, t, give ? { chew: "bone", wag: .7, wf: 2.4, up: .85, happy: true } : { wag: .5, up: .7, happy: true, tongue: true });
    frameOn([rudi, dog], { az: lerp(.5, .44, k), el: .14, fill: lerp(.92, .98, k), t }); draw();
    stamp(L("NO SCOLDING", "NICHT SCHIMPFEN"), W * .42, H * .17, (lt - .15) / .3, "#e5484d", -.06);
    if (give) stamp(L("CHEW TOY", "KAUSPIELZEUG"), W * .42, H * .62, (ph - .45) * d / .3, "#36b37e", .06); });
  // 9 Loop: zurück zur Hook-Einstellung
  KZ.shot("gLoop", (lt, d, t) => { inRoom(); const ph = lt / d;
    place(fluff, .25, .1, 0); place(pillow, .75, .35, .4);
    at(dog, 0, 0, .1, -.35); poseDog(dog, t, { guilty: sm(clamp(ph * 1.5, 0, 1)), look: .55 * sm(clamp(ph * 1.5, 0, 1)), side: .6 });
    frameOn([dog, FR(-.2, 0, -.2, .8, .3, .5)], { az: lerp(.8, .74, ph), el: lerp(.22, .2, ph), fill: lerp(.8, .84, ph), dy: .08, t }); draw();
    if (ph > .3) stamp(L("THAT LOOK...", "DIESER BLICK..."), W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__guiltydog3d = true;
})();
