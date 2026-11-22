// 3D-Szene "Why Your Dog Secretly Hates Your Hugs" / "Warum dein Hund deine Umarmungen hasst" (22.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Hund "Max": Beagle-Mischling (Figur aus dem Schuldblick-Video vom 20.11., erweitert um Stress-Signale: erstarren, Lippen lecken (Zungen-Flick),
// Gähnen, Wal-Auge (Pupillen in den Augenwinkel, Weißes sichtbar)).
// Opener-Stil "ueberwachungskamera": Deckenkamera mit Grün-Grau-Filter, REC-Punkt, Zeitstempel, Rudi nähert sich mit offenen Armen.
// Requisiten: Kuschelmaschine (Plattform, zwei Türme, gepolsterte Greifarme, roter Knopf), Teddykostüm für Rudi (Kapuze mit Ohren über den Augen,
// brauner Anzug, heller Bauch), Wohnzimmer mit Sofa (niedrige Lehne, Hund versteckt sich dahinter), Gefangen-Infografik (Umarmungs-Ring + blockierte Fluchtpfeile),
// 10 Mini-Hunde (8 gestresst), Rate-Frage-Kacheln, Quellenkarte.
// Quellen: AKC (Stephanie Gibeault, "Do Dogs Like Hugs?": Umarmung schränkt Bewegung ein, wirkt bedrohlich; Coren: 250 Fotos, 81 % zeigten Stress-Signale;
// Signale: Lippen lecken, Gähnen, Weißes im Auge, Kopf wegdrehen, Ohren zurück), RSPCA Australia (lieber sanft an den Schultern streicheln).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  let dog, rudi, room, roomBg, sofa, machine, hood, belly, ring, minis = [], stress = [];
  const QUIZ = () => [L("8 out of 10", "8 von 10"), L("1 out of 2", "Jeder 2."), L("1 out of 10", "1 von 10")];

  // ---------- Hund: Beagle-Mischling ----------
  function makeDog() {
    const tan = M(0xc9803c, { roughness: .8 }), white = M(0xfbf3e6, { roughness: .85 }), black = M(0x2b2420, { roughness: .75 }), nose = M(0x1d1614, { roughness: .3 }),
      ear = M(0x9a5a2a, { roughness: .8 }), eyeW = M(0xffffff, { roughness: .15 }), pupil = M(0x231510, { roughness: .1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const torso = sph(tan, 0, .56, 0, .46, .27, .25); body.add(torso);
    body.add(sph(black, -.06, .66, 0, .36, .19, .235));
    body.add(sph(white, .3, .5, 0, .2, .22, .2));
    body.add(sph(white, 0, .43, 0, .34, .13, .18));
    const legs = [];
    for (const [x, z] of [[.27, .14], [.27, -.14], [-.27, .14], [-.27, -.14]]) { const l = limb(.075, .36, tan); l.position.set(x, .48, z); l.add(sph(white, .035, -.38, 0, .095, .06, .085)); l.add(sph(white, 0, -.28, 0, .078, .1, .078)); body.add(l); legs.push(l); }
    const head = new T.Group(); head.position.set(.46, .88, 0); body.add(head);
    head.add(sph(tan, 0, 0, 0, .27, .25, .25));
    head.add(sph(white, .04, .17, 0, .05, .12, .06));
    head.add(sph(white, .2, -.08, 0, .17, .12, .14));
    head.add(sph(nose, .36, -.03, 0, .06, .05, .065));
    const eyes = [], brows = [], ears = [], pupils = [];
    for (const s of [-1, 1]) {
      const e = new T.Group(); e.position.set(.18, .07, s * .13); head.add(e);
      e.add(sph(eyeW, 0, 0, 0, .075)); const p = new T.Group(); e.add(p); p.add(sph(pupil, .05, 0, 0, .046)); p.add(sph(M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), .088, .022, -.014 * s, .014)); pupils.push(p); eyes.push(e);
      const b = mesh(BOX, M(0x8a4a1c), .2, .16, s * .13, .03, .02, .09); head.add(b); brows.push(b);
      const ep = new T.Group(); ep.position.set(-.03, .1, s * .23); head.add(ep);
      ep.add(sph(ear, 0, -.2, 0, .1, .24, .05)); ep.rotation.x = s * .15; ears.push(ep);
    }
    const mouth = new T.Group(); mouth.position.set(.27, -.15, 0); head.add(mouth);
    const gape = sph(M(0x5a1a22), 0, 0, 0, .09, .04, .085); mouth.add(gape);
    const yTongue = sph(M(0xff7b8a), .02, -.02, 0, .06, .02, .055); mouth.add(yTongue);
    const sadMo = mesh(new T.TorusGeometry(.045, .01, 8, 16, PI), M(0x3a2018), .3, -.15, 0); sadMo.rotation.set(0, PI / 2, 0); head.add(sadMo);
    const happyMo = mesh(new T.TorusGeometry(.05, .011, 8, 16, PI), M(0x3a2018), .3, -.12, 0); happyMo.rotation.set(0, PI / 2, PI); head.add(happyMo);
    const tongue = sph(M(0xff7b8a), .3, -.22, 0, .055, .03, .05); head.add(tongue);
    const lick = sph(M(0xff7b8a, { roughness: .3 }), .37, -.08, 0, .035, .06, .045); head.add(lick);
    const tail = new T.Group(); tail.position.set(-.42, .68, 0); tail.rotation.order = "YZX"; body.add(tail);
    const segs = []; let prev = tail;
    for (let i = 0; i < 10; i++) { const sg = new T.Group(); sg.position.set(i ? -.042 : -.02, 0, 0); prev.add(sg); sg.add(sph(i > 7 ? white : tan, -.02, 0, 0, .06 - i * .003)); segs.push(sg); prev = sg; }
    return { root, body, torso, head, legs, eyes, pupils, brows, ears, mouth, gape, sadMo, happyMo, tongue, lick, tail, segs };
  }
  // o: {stiff 0..1 (erstarrt: Kopf tief, Ohren zurück, Schwanz tief und still), look (Kopf seitlich), side (Pupillen seitlich), whale (Pupillen in den Augenwinkel),
  //     lick (Zungen-Flick), yawn 0..1, wag, wf, up, happy, tongue, sit, walk, sc, nod}
  function poseDog(D, t, o) {
    o = o || {}; const gu = o.stiff || 0;
    const wag = o.wag ?? lerp(.45, 0, gu), wf = o.wf ?? 2.2, w = Math.sin(t * wf * 2 * PI);
    D.tail.rotation.y = w * wag; D.tail.rotation.z = -lerp(.45, 1.25, o.up ?? lerp(.6, -.3, gu));
    D.segs.forEach((s, i) => { s.rotation.z = i > 0 ? (gu > .5 ? .09 : -.06) : 0; s.rotation.y = i > 0 ? -Math.sin(t * wf * 2 * PI - i * .3) * wag * .08 : 0; });
    const br = 1 + Math.sin(t * (gu > .5 ? 5 : 2.4)) * .015; D.torso.scale.set(.46, .27 * br, .25 * br);
    const yawn = o.yawn || 0;
    D.head.position.set(.46 + gu * .03, .88 - gu * .1, 0);
    D.head.rotation.set(0, (o.look || 0) + (gu ? 0 : Math.sin(t * 1.1) * .03), -gu * .2 + (o.nod || 0) + yawn * .35 + (gu ? 0 : Math.sin(t * 1.3) * .03));
    D.brows.forEach((b, i) => { const s = i ? 1 : -1; b.rotation.x = s * gu * .45; b.position.y = .16 + gu * .012; b.visible = gu > .2; });
    const blink = gu > .3 || o.whale ? 1 : (Math.sin(t * 2.1 + 1) > .985 ? .15 : 1); const wide = o.whale ? 1.25 : (o.wide ? 1.15 : 1);
    D.eyes.forEach((e) => e.scale.set(wide, blink * wide * (1 - yawn * .55), wide));
    const sd = o.side ?? 0, wh = o.whale || 0; D.pupils.forEach((p) => { p.position.set(-wh * .045, -gu * .01, sd * .035); p.scale.setScalar(1 - wh * .12); });
    D.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.x = s * (.15 + gu * .5 + Math.sin(t * 3 + i) * .03); e.rotation.z = gu * .6; });
    D.mouth.visible = yawn > .05; D.mouth.scale.set(1, 1 + yawn * 3.2, 1);
    D.sadMo.visible = gu > .3 && !o.happy && yawn < .05 && !o.lick; D.happyMo.visible = !!o.happy;
    D.tongue.visible = !!o.tongue && yawn < .05;
    D.lick.visible = !!o.lick && Math.sin(t * 11) > -.2; D.lick.position.set(.37 + Math.max(0, Math.sin(t * 11)) * .03, -.09 + Math.max(0, Math.sin(t * 11)) * .06, 0);
    const walk = o.walk || 0; D.legs.forEach((l, i) => { l.rotation.z = Math.sin(t * 9 + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .45 * walk; });
    const sit = o.sit || 0; D.body.rotation.z = sit * .42; D.body.position.y = Math.abs(Math.sin(t * 9)) * .04 * walk - sit * .12 - gu * .02;
    D.legs.forEach((l, i) => { if (i > 1) l.rotation.z += -sit * .9; else l.rotation.z += -sit * .38; });
    // Erstarren: winziges Zittern
    D.body.position.x = gu > .5 ? Math.sin(t * 40) * .004 : 0;
    D.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Wohnzimmer mit Sofa (niedrige Rückenlehne, dahinter Platz zum Verstecken) ----------
  function makeRoom() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(512, 512, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = ["#c8935e", "#bd8752", "#d29d68", "#c28c58"][i % 4]; c.fillRect(0, i * h / 8, w, h / 8); c.fillStyle = "rgba(90,50,20,.35)"; c.fillRect(0, i * h / 8, w, 3); c.fillRect((i * 173) % w, i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(6, 6);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    const wallTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#f3e2c4"; c.fillRect(0, 0, w, h); c.fillStyle = "#ecd6b2"; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h); });
    wallTex.wrapS = wallTex.wrapT = T.RepeatWrapping; wallTex.repeat.set(10, 3);
    r.add(mesh(BOX, new T.MeshStandardMaterial({ map: wallTex, roughness: .9 }), 0, 2.5, -3, 30, 5, .2));
    r.add(mesh(BOX, M(0xffffff), 0, .08, -2.88, 30, .16, .06));
    const sky = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(1, "#cdeeff"); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = "#ffffff"; c.beginPath(); c.arc(70, 90, 26, 0, 7); c.arc(100, 80, 32, 0, 7); c.arc(130, 92, 24, 0, 7); c.fill(); });
    const win = new T.Mesh(new T.PlaneGeometry(1.6, 1.4), new T.MeshStandardMaterial({ map: sky, emissive: 0xffffff, emissiveMap: sky, emissiveIntensity: .5 })); win.position.set(-2.4, 2.3, -2.89); r.add(win);
    const fr = M(0xffffff, { roughness: .5 }); for (const [x, y, sx, sy] of [[-2.4, 3.03, 1.75, .08], [-2.4, 1.57, 1.75, .08], [-3.24, 2.3, .08, 1.5], [-1.56, 2.3, .08, 1.5], [-2.4, 2.3, .05, 1.4], [-2.4, 2.3, 1.6, .05]]) r.add(mesh(BOX, fr, x, y, -2.87, sx, sy, .06));
    const rug = new T.Mesh(new T.CircleGeometry(1.8, 48), M(0x3d8a6a, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(0, .006, .1); rug.scale.set(1.3, .8, 1); rug.receiveShadow = true; r.add(rug);
    const rug2 = new T.Mesh(new T.RingGeometry(1.45, 1.6, 48), M(0xffd23f, { roughness: 1 })); rug2.rotation.x = -PI / 2; rug2.position.set(0, .008, .1); rug2.scale.set(1.3, .8, 1); r.add(rug2);
    const pl = new T.Group(); pl.position.set(-3.8, 0, -2.4); r.add(pl); pl.add(mesh(new T.CylinderGeometry(.25, .18, .45, 24), M(0xe0703c), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const a = i / 7 * 2 * PI; const lf = sph(M(i % 2 ? 0x4fae4a : 0x3f9a3c), Math.cos(a) * .2, .75 + (i % 3) * .1, Math.sin(a) * .2, .1, .35, .05); lf.rotation.set(Math.sin(a) * .5, -a, Math.cos(a) * .5); pl.add(lf); }
    return r;
  }
  function makeSofa() {
    const s = new T.Group(); const blue = M(0x4a6fd0, { roughness: .8 }), blueD = M(0x3a59ad, { roughness: .85 });
    s.add(mesh(BOX, blueD, 0, .22, 0, 2.4, .36, .95));
    for (const x of [-.55, .55]) s.add(mesh(BOX, blue, x, .45, .04, 1.08, .14, .86));
    s.add(mesh(BOX, blue, 0, .7, -.38, 2.4, .5, .24));
    for (const x of [-1.27, 1.27]) s.add(mesh(BOX, blue, x, .5, 0, .2, .62, .95));
    s.add(sph(M(0xffc23f, { roughness: .8 }), -.85, .62, -.16, .2, .18, .07));
    for (const [x, z] of [[-1.1, .4], [1.1, .4], [-1.1, -.4], [1.1, -.4]]) s.add(mesh(CYL, M(0x5a3a2a), x, .02, z, .05, .06, .05));
    return { root: s };
  }
  // Kuschelmaschine: Plattform, zwei Türme, gepolsterte Greifarme (drehen nach innen), Herzlampe, roter Knopf am Pult
  function makeMachine() {
    const root = new T.Group(); const steel = M(0x9aa7b8, { metalness: .6, roughness: .35 }), dark = M(0x4a5468, { metalness: .4, roughness: .5 }), pad = M(0xff8fb1, { roughness: .7 }), red = M(0xe5484d, { roughness: .4 });
    root.add(mesh(BOX, dark, 0, .1, 0, 1.5, .2, 1.1));
    root.add(mesh(BOX, M(0xffd23f, { roughness: .5 }), 0, .1, .56, 1.5, .06, .02));
    const sign = canvasTex(512, 96, (c, w, h) => { c.fillStyle = "#1d2250"; c.beginPath(); c.roundRect(0, 0, w, h, 20); c.fill(); c.fillStyle = "#ffd23f"; c.font = '900 58px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(L("HUG-O-MATIC", "KUSCHEL-O-MAT"), w / 2, h / 2 + 3); });
    const sg = new T.Mesh(new T.PlaneGeometry(1.2, .225), new T.MeshStandardMaterial({ map: sign, roughness: .5 })); sg.position.set(0, .12, .556); root.add(sg);
    const arms = [];
    for (const s of [-1, 1]) {
      root.add(mesh(BOX, steel, 0, .85, s * .62, .22, 1.3, .2));
      root.add(sph(steel, 0, 1.5, s * .62, .14));
      const piv = new T.Group(); piv.position.set(0, 1.45, s * .62); root.add(piv);
      const a = mesh(CYL, steel, 0, -.3, 0, .06, .6, .06); piv.add(a);
      const glove = sph(pad, 0, -.62, 0, .2, .17, .14); piv.add(glove);
      for (const x of [-.12, 0, .12]) piv.add(sph(pad, x, -.75, s * -.03, .055, .07, .055));
      arms.push({ piv, s });
    }
    const lamp = sph(M(0xff3b6b, { emissive: 0xff2050, emissiveIntensity: .8, roughness: .3 }), 0, 1.72, -.62, .1); root.add(lamp);
    const panel = new T.Group(); panel.position.set(-1.25, 0, .35); root.add(panel);
    panel.add(mesh(CYL, dark, 0, .45, 0, .06, .9, .06)); panel.add(mesh(BOX, steel, 0, .92, 0, .28, .08, .28));
    const btn = sph(red, 0, .98, 0, .1, .06, .1); panel.add(btn);
    root.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    return { root, arms, lamp, btn };
  }
  // Teddykostüm: Kapuze (sitzt wie die Mütze OBERHALB der Augen) mit runden Ohren, heller Bauch
  function makeTeddy(R) {
    const brown = M(0x9a6236, { roughness: .95 }), light = M(0xe0b88a, { roughness: .95 });
    const h = new T.Group(); h.position.y = .2; R.head.add(h);
    h.add(mesh(new T.SphereGeometry(.33, 40, 20, 0, 2 * PI, 0, PI / 2), brown, 0, 0, 0, 1, .95, 1));
    const rimH = mesh(new T.TorusGeometry(.32, .05, 12, 40), brown, 0, 0, 0); rimH.rotation.x = PI / 2; h.add(rimH);
    for (const s of [-1, 1]) { h.add(sph(brown, -.02, .3, s * .22, .1, .1, .06)); h.add(sph(light, .02, .3, s * .22, .06, .06, .04)); }
    for (const s of [-1, 1]) h.add(sph(brown, -.12, -.12, s * .28, .1, .22, .08));
    h.visible = false;
    const b = sph(light, .25, 1.02, 0, .1, .26, .2); R.body.add(b); b.visible = false;
    return { h, b, brown };
  }
  function teddyOn() { hood.h.visible = true; belly.visible = true; rudi.hat.visible = false;
    for (const m of [rudi.coat, rudi.shoulders]) m.material = hood.brown; rudi.arms.forEach((a) => a.material = hood.brown); rudi.legs.forEach((l) => l.material = hood.brown); }

  K3.onBuild(() => {
    rudi = K3.rudi; dog = actor(makeDog(), "Hund");
    for (let i = 0; i < 10; i++) { const d = actor(makeDog(), "Mini " + i); d.noCheck = true; minis.push(d);
      const r = mesh(new T.TorusGeometry(.42, .04, 10, 40), M(0xe5484d, { emissive: 0xe5222d, emissiveIntensity: .7 })); r.rotation.x = PI / 2; r.position.y = .03; r.castShadow = false; d.root.add(r); stress.push(r); }
    sofa = actor(makeSofa(), "Sofa"); machine = actor(makeMachine(), "Maschine");
    const rg = new T.Group(); const tor = mesh(new T.TorusGeometry(.5, .09, 16, 48), M(0xffc928, { roughness: .4 })); tor.rotation.y = PI / 2; rg.add(tor);
    for (const s of [-1, 1]) rg.add(sph(M(0xf3c39d), 0, .38, s * .32, .1)); ring = actor({ root: rg, tor }, "Ring");
    for (const a of [sofa, machine, ring]) a.noCheck = true;
    const t2 = makeTeddy(rudi); hood = t2; belly = t2.b;
    room = makeRoom(); roomBg = new T.Color(0xf3e2c4).convertSRGBToLinear();
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { hood.h.visible = false; belly.visible = false; dog.root.rotation.set(0, 0, 0); dog.root.position.set(0, 0, 0); dog.noCheck = false; rudi.root.position.y = 0; rudi.coat.material = rudi.yel; rudi.shoulders.material = rudi.yel; }
  function inRoom() { begin("yard"); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xf3e2c4, 16, 40); K3.hemi.intensity = .8; reset(); }
  function studio() { begin("studio"); room.visible = false; reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function scr(v) { const p = v.clone().project(K3.camera); return { x: (p.x + 1) / 2 * W, y: (1 - p.y) / 2 * H }; }

  // Umarmung: Rudi kniet hinter dem Hund (Beine im Boden versenkt), Arme um den Hals, Hund schaut zur Kamera
  function hug(t, o) { o = o || {}; const sq = o.squeeze || 0;
    place(rudi, -.42, -.05, 0); rudi.root.position.y = -.42;
    poseRudi(rudi, t, { arms: [1.3 + sq * .05, 1.3 + sq * .05], spread: -.6 - sq * .12 + Math.sin(t * 7) * .03 * sq, mouth: o.mouth || "smile", nod: .05, lean: .08 });
    at(dog, .12, 0, .02, -PI / 2 + .25); dog.noCheck = true;
    poseDog(dog, t, Object.assign({ stiff: 1, whale: 1, side: .7, look: .25 }, o.dog || {})); }
  const hugFrame = (t, ph, o) => frameOn([rudi, dog], Object.assign({ az: lerp(.55, .45, ph), el: .12, fill: lerp(.8, .86, ph), t }, o || {}));

  // Überwachungskamera-Look
  function cctv(lt) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = "saturation"; g.globalAlpha = .85; g.fillStyle = "#808080"; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = "multiply"; g.globalAlpha = 1; g.fillStyle = "#b9e0b8"; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = "source-over"; g.fillStyle = "rgba(0,0,0,.13)"; for (let y = (lt * 120) % 8; y < H; y += 8) g.fillRect(0, y, W, 3);
    const vg = g.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .7); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.55)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 8; const m = 70, l = 90, top = 180, bot = H - 460, rgt = W - 220;
    for (const [x, y, dx, dy] of [[m, top, 1, 1], [rgt, top, -1, 1], [m, bot, 1, -1], [rgt, bot, -1, -1]]) { g.beginPath(); g.moveTo(x, y + dy * l); g.lineTo(x, y); g.lineTo(x + dx * l, y); g.stroke(); }
    if (Math.floor(lt * 2.5) % 2 === 0) { g.fillStyle = "#ff2b2b"; g.beginPath(); g.arc(m + 50, top + 60, 18, 0, 7); g.fill(); }
    g.font = '800 46px "Montserrat"'; g.textAlign = "left"; g.textBaseline = "middle"; g.fillStyle = "#ffffff"; g.fillText("REC", m + 82, top + 62);
    const ss = String(Math.floor(lt) + 12).padStart(2, "0"); g.font = '800 40px "Montserrat"'; g.fillText(L("CAM 2 · 6:03:" + ss + " PM", "CAM 2 · 18:03:" + ss), m + 30, top + 130);
    g.restore(); }

  // ---------- Shots ----------
  // 0 Hook: Rudi umarmt den Hund strahlend, der Hund erstarrt mit Wal-Auge und leckt sich die Lippen
  KZ.shot("hHook", (lt, d, t) => { inRoom(); const ph = lt / d;
    hug(t, { dog: { lick: ph > .35 } }); hugFrame(t, ph, { az: lerp(.62, .55, ph), fill: lerp(.82, .88, ph) }); draw();
    if (ph > .5) stamp(L("LOVE?", "LIEBE?"), W * .42, H * .62, (ph - .5) * d / .3, "#ff4f8b", -.06); });
  // 1 Überwachungskamera: Rudi nähert sich mit weit offenen Armen, Hund sitzt und schaut alarmiert
  KZ.shot("hCam", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(rudi, lerp(-1.7, -.85, k), .15, .1); poseRudi(rudi, t, { arms: [1.45, 1.45], spread: .95, walk: ph < .92 ? 1 : 0, mouth: "smile", wide: true });
    at(dog, .3, 0, .1, PI - .5); poseDog(dog, t, { sit: 1, stiff: sm(clamp((ph - .3) / .3, 0, 1)), whale: ph > .45 ? 1 : 0, side: -.5, look: -.35, wide: true });
    frameOn([FR(-1.9, 0, -.4, .9, 2.1, .6), dog], { az: .18, el: lerp(.62, .58, ph), fill: lerp(.86, .92, ph), t }); draw(); cctv(lt); });
  // 2 Rate-Frage: Rudi drückt fester, Hund steif; Kacheln A/B/C
  KZ.shot("hQuiz", (lt, d, t) => { inRoom(); const ph = lt / d;
    hug(t, { squeeze: 1, mouth: "smile" }); hugFrame(t, ph, { az: lerp(.4, .32, ph), fill: lerp(.72, .76, ph), dy: -.25 }); draw();
    txt(L("HOW MANY ARE STRESSED?", "WIE VIELE HABEN STRESS?"), W * .42, H * .2, 54, "#ffd23f", { stroke: 12, a: clamp(lt / .3, 0, 1) });
    quizTiles(W * .42, H * .57, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 3 Hund erstarrt -> "mehr Liebe!" -> Schnitt: Kuschelmaschine drückt den Hund, Rudi drückt den Knopf
  KZ.shot("hMachine", (lt, d, t) => { inRoom(); const ph = lt / d, half = ph > .45;
    if (!half) { const k = ph / .45; hug(t, { squeeze: 1, dog: { stiff: 1, whale: 1, lick: true } }); hugFrame(t, k, { az: lerp(-.45, -.38, k), fill: lerp(.84, .9, k) }); draw();
      stamp(L("FROZEN", "ERSTARRT"), W * .42, H * .17, (lt - .1) / .3, "#2f6fd0", -.06);
      stamp(L("MORE LOVE!", "MEHR LIEBE!"), W * .42, H * .62, (lt - d * .22) / .3, "#ff4f8b", .06); }
    else { const k = (ph - .45) / .55, sq = .5 + .5 * Math.sin(t * 6);
      at(machine, .15, 0, -.2, 0); machine.arms.forEach((A) => A.piv.rotation.x = A.s * -(.2 + sq * .35)); machine.lamp.material.emissiveIntensity = .4 + sq;
      machine.btn.position.y = .98 - sq * .03;
      at(dog, .15, .2, -.2, 0); dog.noCheck = true; poseDog(dog, t, { stiff: 1, whale: 1, side: .6, look: -.9 });
      place(rudi, -1.25, .7, .55); poseRudi(rudi, t, { arms: [.15, .55 + sq * .1], spread: .1, mouth: "smile" });
      frameOn([machine, rudi], { az: lerp(.3, .22, k), el: .14, fill: lerp(.86, .92, k), t }); draw();
      stamp(L("SQUEEZE!", "DRÜCKEN!"), W * .42, H * .17, (k * d * .55 - .05) / .3, "#ff9f1c", .06); } });
  // 4 Hund versteckt sich hinter dem Sofa -> Schnitt: Rudi im Teddykostüm kommt mit offenen Armen
  KZ.shot("hTeddy", (lt, d, t) => { inRoom(); const ph = lt / d, half = ph > .42;
    at(sofa, .2, 0, -1.8, 0);
    at(dog, .05, 0, -2.6, 0); dog.noCheck = true; poseDog(dog, t, { stiff: .6, whale: half ? 1 : .4, look: -1.3, side: half ? -.6 : 0, wide: true, sc: 1.25 });
    if (!half) { const k = ph / .42; frameOn([FR(-.5, .3, -2.9, 1.1, 1.3, -1.6)], { az: lerp(.1, .02, k), el: .16, fill: lerp(.84, .92, k), t }); draw();
      stamp(L("HIDING", "VERSTECKT"), W * .42, H * .17, (lt - .1) / .3, "#7a5cff", -.06); }
    else { const k = (ph - .42) / .58;
      place(rudi, lerp(-1.0, -.6, sm(k)), -.5, .45); poseRudi(rudi, t, { arms: [1.4, 1.4], spread: .9, walk: k < .85 ? 1 : 0, mouth: "smile", wide: true }); teddyOn();
      frameOn([rudi, FR(-.3, 0, -2.9, 1.0, 1.3, -1.6)], { az: lerp(.42, .34, k), el: .14, fill: lerp(.88, .94, k), t }); draw();
      stamp(L("CUDDLE BEAR!", "KUSCHELBÄR!"), W * .42, H * .17, (k * d * .58 - .05) / .3, "#9a6236", .06); } });
  // 5 Gefangen: Hund im Studio, Umarmungs-Ring um die Brust, Fluchtpfeile werden blockiert
  KZ.shot("hTrapped", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(dog, 0, 0, 0, -.5); poseDog(dog, t, { stiff: 1, whale: 1, side: .5, look: .2, sc: 1.2 });
    const sq = 1 + Math.sin(t * 5) * .03; at(ring, .158, .67, .086, -.5); ring.root.position.y = .67; ring.root.scale.set(1, .78 * sq, .78 * sq);
    frameOn([dog], { az: lerp(.55, .45, k), el: .2, fill: lerp(.74, .8, k), dy: -.05, t }); draw();
    const c = scr(new T.Vector3(.2, .7, 0)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy], i) => { const p = clamp((lt - .25 - i * .12) / .35, 0, 1); if (p <= 0) return;
      const r0 = 250, r1 = r0 + 130 * sm(p), ax = dx * .707, ay = dy * .6;
      const x0 = c.x + ax * r0, y0 = c.y + ay * r0, x1 = c.x + ax * r1, y1 = c.y + ay * r1;
      g.strokeStyle = "#ffffff"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      const xp = clamp((lt - .75 - i * .1) / .25, 0, 1); if (xp > 0) { const s = 34 * easeBack(xp); g.strokeStyle = "#e5484d"; g.lineWidth = 18;
        g.beginPath(); g.moveTo(x1 - s, y1 - s); g.lineTo(x1 + s, y1 + s); g.moveTo(x1 + s, y1 - s); g.lineTo(x1 - s, y1 + s); g.stroke(); } });
    g.restore();
    stamp(L("TRAPPED!", "GEFANGEN!"), W * .42, H * .17, (lt - d * .45) / .3, "#e5484d", -.06); });
  // 6 Warnzeichen in Nahaufnahme: Lippen lecken, Gähnen, Wal-Auge
  KZ.shot("hSigns", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph), st = ph < .34 ? 0 : ph < .67 ? 1 : 2;
    at(dog, 0, 0, 0, -1.0); dog.noCheck = true;
    const ys = st === 1 ? sm(clamp(((ph - .34) / .33) * 2.2, 0, 1)) * (1 - sm(clamp(((ph - .34) / .33 - .7) * 3.3, 0, 1))) : 0;
    poseDog(dog, t, { stiff: .5, lick: st === 0, yawn: ys, whale: st === 2 ? 1 : 0, side: st === 2 ? .8 : 0, look: st === 2 ? .35 : .1, wag: 0 });
    frameOn([dog.head], { az: lerp(.7, .6, k), el: .1, fill: lerp(.82, .9, k), dy: -.02, t }); draw();
    const labs = [L("LIP LICK", "LIPPEN LECKEN"), L("YAWN", "GÄHNEN"), L("WHALE EYE", "WAL-AUGE")];
    stamp(labs[st], W * .42, H * .17, (lt - [0, .34, .67][st] * d - .05) / .25, ["#ff9f1c", "#7a5cff", "#e5484d"][st], st === 1 ? .06 : -.06);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 3; i++) { const on = i <= st; g.globalAlpha = on ? 1 : .35; g.fillStyle = on ? ["#ff9f1c", "#7a5cff", "#e5484d"][i] : "#ffffff";
      g.beginPath(); g.arc(W * .42 + (i - 1) * 70, H * .27, 18, 0, 7); g.fill(); } g.restore(); });
  // 7 Das Krasseste: Auflösung der Rate-Frage, 8 von 10 Mini-Hunden werden rot (gestresst), Quellenkarte
  KZ.shot("hCrazy", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    minis.forEach((m, i) => { const row = Math.floor(i / 5), col = i % 5; at(m, (col - 2) * .72 + row * .14, 0, row ? .5 : -.5, -PI / 2 + .35);
      const on = i !== 2 && i !== 7 && ph > .3 + (i % 5) * .05 + row * .04; stress[i].visible = on;
      poseDog(m, t + i * .37, on ? { stiff: 1, whale: 1, side: .5, sc: .62 } : { happy: true, wag: .6, up: .8, sc: .62 }); });
    frameOn([FR(-1.7, 0, -.9, 1.7, .8, .9)], { az: lerp(.12, .06, k), el: lerp(.4, .36, k), fill: lerp(.92, .98, k), dy: .15, t }); draw();
    if (ph < .5) quizTiles(W * .42, H * .5, QUIZ(), 1, { reveal: sm(clamp((lt - .15) / .4, 0, 1)), correct: 0 });
    else infoCard(W * .42, H * .56, 900, 250, sm((ph - .5) * d / .35), L("AKC · Coren, 250 photos", "AKC · Coren, 250 Fotos"), "#2f6fd0",
      [L("81% of hugged dogs", "81 % der umarmten Hunde"), L("showed signs of stress", "zeigten Stress-Signale")], 40);
    stamp(L("8 OUT OF 10", "8 VON 10"), W * .42, H * .17, (lt - d * .25) / .3, "#e5484d", -.06); });
  // 8 Tipp: Rudi kniet, der Hund kommt von selbst, Rudi krault ihm die Schulter, Hund wedelt
  KZ.shot("hTip", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph), come = sm(clamp(ph / .45, 0, 1)), scratch = ph > .5;
    place(rudi, -.45, 0, 0); rudi.root.position.y = -.38;
    poseRudi(rudi, t, { arms: [.12, scratch ? 1.0 + Math.sin(t * 12) * .07 : .5], spread: scratch ? -.15 : .1, mouth: "smile", lean: .05 });
    at(dog, lerp(1.5, .52, come), 0, .16, PI); dog.noCheck = true;
    poseDog(dog, t, { walk: come < 1 ? 1 : 0, happy: true, tongue: scratch, wag: .7, wf: 2.6, up: .9, look: scratch ? .5 : 0 });
    frameOn([rudi, FR(-.6, 0, -.3, 1.0, 1.0, .5)], { az: lerp(.5, .42, k), el: .14, fill: lerp(.9, .96, k), t }); draw();
    stamp(L("HIS CHOICE", "VON SELBST"), W * .42, H * .17, (lt - .1) / .3, "#36b37e", -.06);
    if (scratch) stamp(L("SHOULDERS", "SCHULTER"), W * .42, H * .62, (ph - .52) * d / .3, "#2f6fd0", .06); });
  // 9 Loop: zurück zur Hook-Einstellung
  KZ.shot("hLoop", (lt, d, t) => { inRoom(); const ph = lt / d;
    hug(t, { dog: { stiff: sm(clamp(ph * 1.6, 0, 1)), whale: ph > .4 ? 1 : 0, lick: ph > .7 } }); hugFrame(t, ph, { az: lerp(.68, .62, ph), fill: lerp(.78, .82, ph) }); draw();
    if (ph > .35) stamp(L("THAT HUG...", "DIESE UMARMUNG..."), W * .42, H * .17, (ph - .35) * d / .3, "#ff4f8b", -.06); });

  window.__doghug3d = true;
})();
