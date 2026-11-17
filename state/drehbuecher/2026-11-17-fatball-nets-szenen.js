// 3D-Szene "Why Fat Ball Nets Hurt Garden Birds" (17.11.2026). Blaumeise, Buntspecht, Meisenknödel im grünen Netz,
// Futterstange, Netz-Baum mit Leiter, Schere, Metall-Knödelhalter, Studio-Infografiken (Riesen-Netz, Waage über Nacht).
// Quellen: RSPB ("Never put out any food in mesh bags"), BTO (Blau-/Kohlmeisen verlieren bis 5 % Körpergewicht über Nacht).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let tit, tit2, tit3, bigTit, pecker, rudi, pole, ball, bigBall, cage, ladder, scissors, netTree, scale, hearts, moon;

  // ---------- Blaumeise (eigener Entwurf: blaue Kappe, weiße Wangen, schwarzer Augenstreif + Kinnfleck, dunkelblauer Halsring,
  // gelber Bauch, olivgrüner Rücken, blaue Flügel mit weißer Binde, blauer Schwanz, kurzer schwarzer Schnabel, blaugraue Beine) ----------
  function makeTit() {
    const blue = M(0x2f86e0, { roughness: .5 }), navy = M(0x1b2f6b, { roughness: .6 }), yel = M(0xffd21f, { roughness: .6 }), olive = M(0x9cb33c, { roughness: .65 });
    const white = M(0xffffff, { roughness: .7 }), black = M(0x161616, { roughness: .4 }), leg = M(0x6f86a8, { roughness: .5 }), eyeW = M(0xffffff, { roughness: .15 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(yel, 0, 0, 0, .16, .15, .135));               // gelber Bauch
    body.add(sph(olive, -.03, .045, 0, .15, .11, .125));       // olivgrüner Rücken
    body.add(sph(M(0x7aa83a, { roughness: .7 }), .02, -.02, 0, .05, .09, .02)); // dunkler Bauchstreif (Mitte)
    const tail = new T.Group(); tail.position.set(-.15, .03, 0); body.add(tail); tail.add(sph(blue, -.1, .02, 0, .12, .022, .045));
    const wings = []; for (const s of [-1, 1]) { const w = new T.Group(); w.position.set(.0, .05, s * .1); body.add(w);
      w.add(sph(blue, -.06, 0, s * .03, .12, .07, .03)); w.add(sph(white, -.03, .02, s * .055, .07, .012, .01)); w.add(sph(navy, -.13, -.01, s * .035, .06, .045, .025)); wings.push(w); }
    // Kopf
    const head = new T.Group(); head.position.set(.11, .12, 0); body.add(head);
    head.add(sph(white, 0, 0, 0, .105, .1, .1));                 // weiße Wangen
    head.add(sph(blue, -.01, .045, 0, .098, .065, .095));         // blaue Kappe
    head.add(sph(white, .025, .045, 0, .07, .02, .098));          // weißer Stirnstreif unter der Kappe
    head.add(sph(black, .02, -.005, 0, .085, .016, .103));        // schwarzer Augenstreif
    head.add(sph(navy, -.03, -.07, 0, .09, .028, .1));            // dunkelblauer Halsring
    head.add(sph(black, .07, -.07, 0, .035, .03, .04));           // schwarzer Kinnfleck
    const beak = mesh(new T.ConeGeometry(.022, .06, 16), black, .115, -.01, 0); beak.rotation.z = -PI / 2; head.add(beak);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.05, .005, s * .075); head.add(e);
      e.add(sph(eyeW, 0, 0, 0, .033, .036, .02)); e.add(sph(black, .012, 0, s * .012, .02, .022, .014)); e.add(sph(hl, .02, .01, s * .02, .006)); eyes.push(e); }
    // Beine mit 3 Zehen vorn + 1 hinten
    const legs = []; for (const s of [-1, 1]) { const l = limb(.012, .1, leg); l.position.set(.02, -.12, s * .045); body.add(l);
      for (const a of [-.45, 0, .45]) { const toe = mesh(CYL, leg, .03 * Math.cos(a), -.1, .03 * Math.sin(a), .006, .06, .006); toe.rotation.set(-Math.sin(a) * PI / 2, 0, -PI / 2 * Math.cos(a)); toe.rotation.z = -PI / 2; toe.rotation.y = -a; l.add(toe); }
      const back = mesh(CYL, leg, -.025, -.1, 0, .006, .045, .006); back.rotation.z = PI / 2; l.add(back); legs.push(l); }
    body.position.y = .22; // Wurzel = Füße am Boden
    return { root, body, head, wings, legs, tail, eyes };
  }
  // o: {flap 0..1, wide, stuck (ein Bein nach oben gestreckt), look, peck 0..1, tilt}
  function poseTit(B, t, o) {
    o = o || {};
    const f = o.flap || 0; B.wings.forEach((w, i) => { const s = i ? 1 : -1; w.rotation.set(-s * f * (.5 + Math.sin(t * 34 + i) * .7), 0, f * .2); });
    B.head.rotation.set(o.tilt || 0, o.look || 0, (o.peck ? -sm(Math.abs(Math.sin(t * 9))) * .5 * o.peck : 0) + Math.sin(t * 2.3) * .05);
    const lid = Math.sin(t * 1.7 + 2) > .985 ? .15 : 1; B.eyes.forEach((e) => e.scale.set(1, lid * (o.wide ? 1.25 : 1), o.wide ? 1.15 : 1));
    const st = o.stuck || 0; B.legs.forEach((l, i) => { l.rotation.z = i === 0 ? -st * 2.6 : st * (.5 + Math.sin(t * 20) * .3); });
    B.tail.rotation.z = Math.sin(t * 3) * .08 + f * Math.sin(t * 30) * .15;
    B.body.rotation.z = o.lean || 0;
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Buntspecht (eigener Entwurf: schwarz-weiß, weiße Schulterflecken, roter Nacken + rote Unterschwanzdecken, Meißelschnabel,
  // lange Zunge mit Widerhaken, Stützschwanz, Kletterfüße) ----------
  function makePecker() {
    const blk = M(0x1a1a1e, { roughness: .45 }), wh = M(0xfafafa, { roughness: .6 }), buff = M(0xeee2cc, { roughness: .7 }), red = M(0xe0262f, { roughness: .45 });
    const grey = M(0x4a4a50, { roughness: .4 }), pink = M(0xff8fa8, { roughness: .4 }), eyeW = M(0xffffff, { roughness: .15 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    // aufrecht kletternd: Körperachse = y, Bauch zur +x-Seite (zum Knödel)
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(blk, -.02, 0, 0, .14, .28, .15));             // schwarzer Rücken
    body.add(sph(buff, .06, .02, 0, .1, .24, .12));             // heller Bauch
    body.add(sph(red, .04, -.24, 0, .08, .07, .09));            // rote Unterschwanzdecken
    for (const s of [-1, 1]) { body.add(sph(wh, -.02, .1, s * .12, .1, .07, .04));           // weiße Schulterflecken
      for (let i = 0; i < 4; i++) body.add(sph(wh, -.07, -.04 - i * .055, s * .135, .022, .012, .012)); } // weiße Flügelbänder
    const tail = mesh(new T.ConeGeometry(.08, .28, 4), blk, -.07, -.38, 0, 1, 1, .35); tail.rotation.z = PI - .25; body.add(tail);
    const head = new T.Group(); head.position.set(.03, .32, 0); body.add(head);
    head.add(sph(wh, 0, 0, 0, .12, .11, .11));                 // weißes Gesicht
    head.add(sph(blk, -.02, .06, 0, .11, .06, .1));             // schwarzer Scheitel
    head.add(sph(red, -.1, .02, 0, .045, .05, .07));            // roter Nackenfleck (Männchen)
    for (const s of [-1, 1]) head.add(sph(blk, .02, -.06, s * .085, .09, .022, .03)); // schwarzer Bartstreif
    const beak = mesh(new T.ConeGeometry(.032, .17, 4), grey, .18, -.01, 0); beak.rotation.z = -PI / 2; head.add(beak);
    // Zunge mit Widerhaken (lang aus dem Schnabel)
    const tongue = new T.Group(); tongue.position.set(.25, -.012, 0); head.add(tongue);
    const tg = mesh(CYL, pink, .1, 0, 0, .009, .2, .009); tg.rotation.z = PI / 2; tongue.add(tg);
    for (let i = 0; i < 3; i++) for (const s of [-1, 1]) { const b = mesh(new T.ConeGeometry(.008, .03, 6), pink, .16 + i * .02, s * .01, 0); b.rotation.z = PI / 2 + s * .8; tongue.add(b); }
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.06, .015, s * .085); head.add(e);
      e.add(sph(eyeW, 0, 0, 0, .036, .04, .02)); e.add(sph(M(0x8a1a1a, { roughness: .2 }), .012, 0, s * .012, .022, .024, .014)); e.add(sph(hl, .02, .012, s * .02, .006)); eyes.push(e); }
    const feet = []; for (const s of [-1, 1]) { const l = limb(.016, .1, grey); l.position.set(.08, -.12, s * .06); l.rotation.z = 1.2; body.add(l);
      for (const a of [-.5, .5]) { const c = mesh(new T.ConeGeometry(.01, .06, 6), grey, .02, -.12, a * .05); c.rotation.z = -.4; l.add(c); } feet.push(l); }
    const wings = []; for (const s of [-1, 1]) { const w = new T.Group(); w.position.set(-.03, .12, s * .14); body.add(w); w.add(sph(blk, -.02, -.12, s * .01, .07, .18, .03)); wings.push(w); }
    return { root, body, head, tongue, eyes, wings, feet };
  }
  function posePecker(P, t, o) { o = o || {};
    P.tongue.scale.x = o.tongue ?? 1; P.tongue.visible = (o.tongue ?? 1) > .05;
    P.head.rotation.z = (o.tug ? Math.sin(t * 14) * .12 * o.tug : 0) + (o.nod || 0);
    P.wings.forEach((w, i) => { const s = i ? 1 : -1; w.rotation.x = s * (o.flap || 0) * (.4 + Math.sin(t * 28) * .5); });
    const lid = Math.sin(t * 1.5 + 1) > .985 ? .15 : 1; P.eyes.forEach((e) => e.scale.set(1, lid * (o.wide ? 1.25 : 1), 1));
    P.root.scale.setScalar(o.sc || 1); }

  // ---------- Meisenknödel im grünen Netz (Wurzel = Aufhängepunkt oben, Kugel hängt 0,32 darunter) ----------
  const fatTex = () => canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#e9cf86"; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { c.fillStyle = ["#7a4a24", "#2a2420", "#c98a3a", "#f3e2b0", "#5a3a20"][i % 5]; c.beginPath(); c.ellipse((i * 97) % w, (i * 57 + i * i) % h, 3 + (i % 4), 2 + (i % 3), i, 0, 7); c.fill(); } });
  const netTex = () => { const t = canvasTex(256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = "#1fa83a"; c.lineWidth = 16; c.lineCap = "round";
      for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * w / 2, 0); c.lineTo(i * w / 2 + w, h); c.stroke(); c.beginPath(); c.moveTo(i * w / 2 + w, 0); c.lineTo(i * w / 2, h); c.stroke(); } });
    t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(5, 3); return t; };
  function makeBall() {
    const root = new T.Group(); const fat = M(0xffffff, { map: fatTex(), roughness: .85 });
    const netM = M(0xffffff, { map: netTex(), roughness: .5, transparent: true, alphaTest: .5, side: T.DoubleSide });
    const bl = new T.Group(); bl.position.y = -.32; root.add(bl);
    bl.add(sph(fat, 0, 0, 0, .12));
    const net = new T.Group(); bl.add(net); const nm = mesh(SPH, netM, 0, 0, 0, .128); nm.castShadow = false; net.add(nm);
    net.add(mesh(new T.ConeGeometry(.04, .07, 12), M(0x1fa83a), 0, .14, 0));                // Knoten oben
    const tail = mesh(new T.ConeGeometry(.03, .09, 10), M(0x1fa83a), 0, -.16, 0); tail.rotation.z = PI; net.add(tail); // Netzzipfel unten
    const str = mesh(CYL, M(0x1fa83a), 0, -.1, 0, .007, .2, .007); root.add(str);              // grüne Schlaufe
    return { root, bl, net, str };
  }
  // ---------- Futterstange (Wurzel am Boden, Haken bei (0, HH, 0), Stange rechts davon) ----------
  const HH = 2.05;
  function makePole() { const root = new T.Group(); const m = M(0x2d4a3a, { roughness: .4, metalness: .4 });
    root.add(mesh(CYL, m, .55, HH / 2, 0, .035, HH + .1, .035));
    const arm = mesh(CYL, m, .28, HH + .03, 0, .025, .56, .025); arm.rotation.z = PI / 2; root.add(arm);
    const hook = mesh(new T.TorusGeometry(.04, .01, 8, 16, PI * 1.4), m, 0, HH - .01, 0); root.add(hook);
    root.add(sph(m, .55, HH + .06, 0, .05)); root.add(mesh(CYL, m, .55, .02, 0, .14, .04, .14));
    return { root }; }
  // ---------- Metall-Knödelhalter (Wurzel = Aufhängepunkt) ----------
  function makeCage() { const root = new T.Group(); const met = M(0xc5ced8, { metalness: .85, roughness: .3 }), grn = M(0x2f9e5a, { roughness: .4 });
    root.add(mesh(CYL, met, 0, -.06, 0, .006, .12, .006));
    const top = mesh(new T.ConeGeometry(.19, .1, 32), grn, 0, -.15, 0); root.add(top);
    for (let i = 0; i < 12; i++) { const a = i / 12 * 2 * PI; root.add(mesh(CYL, met, Math.cos(a) * .16, -.38, Math.sin(a) * .16, .007, .44, .007)); }
    for (const y of [-.2, -.38, -.58]) { const r = mesh(new T.TorusGeometry(.16, .008, 6, 40), met, 0, y, 0); r.rotation.x = PI / 2; root.add(r); }
    root.add(mesh(CYL, grn, 0, -.61, 0, .17, .03, .17));
    const fat = M(0xffffff, { map: fatTex(), roughness: .85 }); for (const y of [-.29, -.48]) root.add(sph(fat, 0, y, 0, .1));
    return { root }; }
  function makeLadder() { const root = new T.Group(); const wd = M(0xd9a35e, { roughness: .7 });
    for (const z of [-.22, .22]) root.add(mesh(BOX, wd, 0, 1.3, z, .06, 2.6, .06));
    for (let i = 0; i < 8; i++) root.add(mesh(CYL, wd, 0, .2 + i * .32, 0, .025, .44, .025).rotateX(PI / 2));
    return { root }; }
  function makeScissors() { const root = new T.Group(); const met = M(0xd8dee6, { metalness: .9, roughness: .25 }), red = M(0xe5484d, { roughness: .4 });
    const a = new T.Group(), b = new T.Group(); root.add(a); root.add(b);
    for (const [grp, s] of [[a, 1], [b, -1]]) { grp.add(mesh(BOX, met, .14, 0, s * .005, .26, .03, .008)); const ring = mesh(new T.TorusGeometry(.04, .012, 8, 20), red, -.06, s * -.03, s * .005); grp.add(ring); }
    root.add(sph(met, 0, 0, 0, .015)); return { root, a, b }; }
  // Netz-Baum (Winter, kahl) mit vielen Knödeln
  function makeNetTree() { const root = new T.Group(); root.visible = false; K3.scene.add(root); const bark = M(0x7a5236, { roughness: .8 });
    root.add(mesh(new T.CylinderGeometry(.11, .17, 2.6, 16), bark, 0, 1.3, 0));
    const tips = [];
    for (const [ax, ay, az, len, rz, ry] of [[0, 1.5, 0, 1.3, -1.0, 0], [0, 1.8, 0, 1.2, 1.0, 0], [0, 2.2, 0, 1.1, -.8, 1.4], [0, 2.3, 0, 1.0, .8, -1.2], [0, 2.55, 0, .9, -.3, .6], [0, 1.6, 0, 1.1, .9, 2.2]]) {
      const br = new T.Group(); br.position.set(ax, ay, az); br.rotation.set(0, ry, rz); root.add(br);
      const m = mesh(new T.CylinderGeometry(.03, .06, len, 10), bark, 0, len / 2, 0); br.add(m); tips.push({ br, len }); }
    root.add(sph(M(0x5cb84e), 0, 2.85, 0, .45, .3, .45));
    const balls = []; root.updateMatrixWorld(true);
    tips.forEach(({ br, len }, k) => { for (let i = 1; i <= 3; i++) { const p = br.localToWorld(V(0, len * (.3 + i * .22), 0)); const b = makeBall(); b.root.position.copy(p).sub(root.position); b.str.scale.y = .2 * (1 + (i % 2) * .6); b.root.scale.setScalar(1.25); root.add(b.root); balls.push(b); } });
    return { root, balls }; }
  // Küchenwaage mit Digitalanzeige (Gramm), Anzeige wird jedes Bild neu gezeichnet
  function makeScale() { const root = new T.Group(); const body = M(0xf2f2f7, { roughness: .3 }), plat = M(0xc5ced8, { metalness: .8, roughness: .3 });
    root.add(mesh(BOX, body, 0, .12, 0, 1.0, .24, .8)); root.add(mesh(CYL, plat, 0, .26, 0, .42, .04, .42));
    const cv = document.createElement("canvas"); cv.width = 512; cv.height = 192; const tex = new T.CanvasTexture(cv); tex.encoding = T.sRGBEncoding;
    const disp = new T.Mesh(new T.PlaneGeometry(.62, .23), new T.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: .7 })); disp.position.set(0, .13, .401); root.add(disp);
    function show(s) { const c = cv.getContext("2d"); c.fillStyle = "#123a2a"; c.fillRect(0, 0, 512, 192); c.fillStyle = "#7dffb0"; c.font = '900 120px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s, 256, 100); tex.needsUpdate = true; }
    show("11.0 g"); return { root, show }; }
  function heartGeo() { const s = new T.Shape(); s.moveTo(0, -.5); s.bezierCurveTo(-.9, .1, -.5, .75, 0, .35); s.bezierCurveTo(.5, .75, .9, .1, 0, -.5);
    const geo = new T.ExtrudeGeometry(s, { depth: .18, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 4, curveSegments: 20 }); geo.center(); return geo; }
  function makeHearts() { const root = new T.Group(); const geo = heartGeo(), m = M(0xff4d6d, { roughness: .3 }); const list = [];
    for (let i = 0; i < 4; i++) { const h = mesh(geo, m); h.castShadow = false; h.scale.setScalar(.1); root.add(h); list.push(h); } return { root, list }; }
  function makeMoon() { const root = new T.Group(); root.add(sph(M(0xfff3b0, { emissive: 0xfff3b0, emissiveIntensity: .8 }), 0, 0, 0, .3)); root.add(sph(M(0x1a1f55), .14, .08, .05, .26)); return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; tit = actor(makeTit(), "Blaumeise"); tit2 = actor(makeTit(), "Blaumeise 2"); tit3 = actor(makeTit(), "Blaumeise 3"); bigTit = actor(makeTit(), "Blaumeise gross");
    pecker = actor(makePecker(), "Buntspecht"); pole = actor(makePole(), "Futterstange"); ball = actor(makeBall(), "Knoedel"); bigBall = actor(makeBall(), "Knoedel gross");
    cage = actor(makeCage(), "Knoedelhalter"); ladder = actor(makeLadder(), "Leiter"); scissors = actor(makeScissors(), "Schere"); scale = actor(makeScale(), "Waage");
    hearts = actor(makeHearts(), "Herzen"); moon = actor(makeMoon(), "Mond");
    for (const a of [hearts, moon, ball, bigBall, cage, scissors, pole, ladder]) a.noCheck = true;
    netTree = makeNetTree();
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { for (const b of [tit, tit2, tit3, bigTit]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = false; b.body.rotation.set(0, 0, 0); }
    rudi.noCheck = false; rudi.body.position.set(0, 0, 0); rudi.legs.forEach((l) => l.rotation.set(0, 0, 0)); netTree.root.visible = false;
    ball.net.visible = true; ball.net.position.set(0, 0, 0); ball.net.rotation.set(0, 0, 0); ball.str.visible = true; ball.root.rotation.set(0, 0, 0); ball.root.scale.setScalar(1); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  // Standplätze im Garten
  const RX = -.55, RZ = .25;           // Rudi
  const HK = V(.12, HH, -.1);           // Haken der Futterstange (Welt)
  function poleAt() { place(pole, HK.x, HK.z, 0); }
  function ballOnHook(sw) { ball.root.visible = true; ball.root.position.copy(HK); ball.root.rotation.set(sw || 0, 0, (sw || 0) * .6); ball.root.updateMatrixWorld(true); }
  function ballCenter() { return ball.bl.getWorldPosition(V(0, 0, 0)); }
  function rudiAt(t, o) { place(rudi, RX, RZ, 0); poseRudi(rudi, t, Object.assign({ arms: [.1, .1], spread: .1, mouth: "smile" }, o || {})); rudi.root.updateMatrixWorld(true); }
  function hand(i) { return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function hands() { return hand(0).add(hand(1)).multiplyScalar(.5); }
  function titAt(B, p, ry) { B.root.visible = true; B.root.position.copy(p); B.root.rotation.set(0, ry || 0, 0); }
  // Meise hängt mit einem Fuß im Netz (seitlich am Knödel), flattert
  function titStuck(B, t, c, side, sc) { sc = sc || 1; B.noCheck = true; B.root.visible = true; const wob = Math.sin(t * 11) * .08;
    B.root.position.set(c.x - .2 * sc * side, c.y - .2 * sc, c.z + .03 * sc); B.root.rotation.set(0, side > 0 ? 0 : PI, .55 + wob);
    poseTit(B, t, { flap: 1, wide: true, stuck: 1, sc }); }

  // ---------- Shots ----------
  // Hook-Szene (auch Loop): Meise fliegt zum Knödel, landet, Fuß rutscht durchs Netz, sie flattert und hängt fest
  function hookScene(p, t, d) { inYard(); poleAt(); const land = sm(clamp(p / .38, 0, 1)), stuck = sm(clamp((p - .45) / .2, 0, 1));
    ballOnHook(stuck * Math.sin(t * 9) * .12); const c = ballCenter();
    if (stuck <= 0) { const top = V(c.x + .02, c.y + .12, c.z); const from = V(c.x - .33, c.y + .14, c.z + .2);
      const pp = from.clone().lerp(top, land); pp.y += Math.sin(land * PI) * .15; if (p < 0) pp.add(V(-.9, .25, .3).multiplyScalar(-p / .25)); tit.noCheck = true; titAt(tit, pp, 0); poseTit(tit, t, { flap: land < .98 ? 1 : 0, wide: p > .3, lean: land < .98 ? .2 : 0 }); }
    else titStuck(tit, t, c, 1, 1);
    frameOn([ball], { az: lerp(.42, .32, clamp(p, 0, 1)), el: .08, fill: lerp(.3, .36, clamp(p, 0, 1)), dy: .02, t }); draw(); return stuck; }
  KZ.shot("fHook", (lt, d, t) => { const st = hookScene(lt / d, t, d); if (st > 0) stamp("STUCK!", W * .42, H * .64, (lt - d * .5) / .3, "#e5484d", .07); });
  // 1 Rudi hängt den Knödel im Netz an die Stange (stolz), Schnitt: Meise landet, Fuß rutscht durch
  KZ.shot("fHang", (lt, d, t) => { const ph = lt / d, half = ph > .5;
    if (!half) { inYard(); poleAt(); const up = sm(clamp(ph / .32, 0, 1)), down = sm(clamp((ph - .36) / .14, 0, 1));
      const a0 = lerp(.5, 2.62, up) - down * 2.1; rudiAt(t, { arms: [a0, .25], spread: .05, mouth: "smile", nod: up * .1 });
      if (ph < .34) { ball.root.visible = true; ball.root.position.copy(hand(0)).add(V(0, .05, 0)); ball.root.rotation.set(0, 0, Math.sin(t * 6) * .1); } else ballOnHook(Math.sin(t * 5) * .06 * (1 - down));
      frameOn([rudi, pole], { az: lerp(.5, .42, ph * 2), el: .1, fill: lerp(.9, .96, ph * 2), t }); draw();
      stamp("BIRD HELPER", W * .42, H * .17, (lt - d * .08) / .3, "#2f6fd0", -.06); }
    else { const p2 = (ph - .5) / .5; inYard(); poleAt(); const st = sm(clamp((p2 - .2) / .25, 0, 1)); ballOnHook(st * Math.sin(t * 9) * .1); const c = ballCenter();
      if (st <= 0) { tit.noCheck = true; titAt(tit, V(c.x + .02, c.y + .12, c.z), 0); poseTit(tit, t, { flap: 0, peck: 1 }); } else titStuck(tit, t, c, 1, 1);
      frameOn([ball, tit], { az: lerp(.25, .15, p2), el: .05, fill: lerp(.55, .62, p2), dy: .02, t }); draw();
      stamp("FOOT STUCK", W * .42, H * .17, (p2 - .25) * d * .5 / .3, "#e5484d", .07); } });
  // 2 Rudi befreit die Meise (hält sie, sie fliegt weg) -> Baum mit 50 Netzen -> Rudi auf der Leiter als Vogel-Rettung
  KZ.shot("fFifty", (lt, d, t) => { const ph = lt / d;
    if (ph < .3) { inYard(); poleAt(); ballOnHook(0); const k = ph / .3; rudiAt(t, { arms: [1.05, 1.05], spread: .02, mouth: "smile" }); const h = hands();
      tit.noCheck = true; const fly = sm(clamp((k - .55) / .45, 0, 1)); titAt(tit, V(h.x + .1 + fly * .5, h.y + .05 + fly * .7, h.z), .3); poseTit(tit, t, { flap: fly > 0 ? 1 : 0, wide: fly <= 0 });
      rudi.noCheck = true; frameOn([rudi], { az: lerp(.5, .44, k), el: .1, fill: .95, t }); draw();
      stamp("FREED", W * .42, H * .17, (lt - .1) / .3, "#36b37e", -.06); return; }
    inYard(); netTree.root.visible = true; netTree.root.position.set(.3, 0, -.3);
    if (ph < .62) { const k = (ph - .3) / .32;
      place(rudi, -1.05, 1.0, .5); poseRudi(rudi, t, { arms: [.3, 2.3], spread: .2, mouth: "smile" });
      frameOn([netTree, rudi], { az: lerp(.45, .35, k), el: .15, fill: lerp(.92, 1.0, k), t }); draw();
      stamp("50 NETS", W * .42, H * .17, (lt - d * .32) / .3, "#ff9f1c", .06); return; }
    const k = (ph - .62) / .38; place(ladder, -.12, .55, 0); ladder.root.rotation.set(0, PI / 2, -.18);
    place(rudi, -.62, .62, 0); rudi.body.position.y = .62; poseRudi(rudi, t, { arms: [1.5 + Math.sin(t * 6) * .15, 1.7], spread: .05, mouth: "o", wide: true }); rudi.noCheck = true;
    const bl = netTree.balls; netTree.root.updateMatrixWorld(true);
    [[tit, 1], [tit2, 6], [tit3, 13]].forEach(([B, i], j) => { const c = bl[i].bl.getWorldPosition(V(0, 0, 0)); titStuck(B, t + j, c, j % 2 ? -1 : 1, .85); });
    frameOn([netTree, rudi], { az: lerp(.4, .3, k), el: .12, fill: lerp(.88, .95, k), t }); draw();
    stamp("BIRD RESCUE", W * .42, H * .17, (ph - .64) * d / .3, "#e5484d", -.07); });
  // 3 Studio: Riesen-Knödel im Netz, Riesen-Meise mit Fuß im Netz + RSPB-Karte
  KZ.shot("fRspb", (lt, d, t) => { studio(); const k = sm(lt / d);
    bigBall.root.visible = true; bigBall.root.scale.setScalar(4); bigBall.root.position.set(0, 1.85, 0); bigBall.root.rotation.set(0, 0, Math.sin(t * 6) * .04); bigBall.root.updateMatrixWorld(true);
    const c = bigBall.bl.getWorldPosition(V(0, 0, 0)); titStuck(bigTit, t, c, 1, 2.6);
    frameOn([bigBall, bigTit], { az: lerp(.3, .15, k), el: .1, fill: lerp(.72, .8, k), dy: -.3, t }); draw();
    stamp("MESH BAG", W * .42, H * .17, (lt - .15) / .3, "#e5484d", -.06);
    const cp = sm((lt - d * .3) / .3); if (card(W * .42, H * .62, 820, 250, cp, "RSPB", "#2f6fd0")) {
      txt("“Never put out any food", W * .42, H * .62 + 10, 40, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("in mesh bags.”", W * .42, H * .62 + 62, 40, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 4 Buntspecht klammert am Knödel, Zunge mit Widerhaken hängt im Netz fest, er zerrt
  KZ.shot("fPecker", (lt, d, t) => { inYard(); poleAt(); const ph = lt / d, k = sm(ph); ballOnHook(Math.sin(t * 14) * .05 * (ph > .3 ? 1 : 0)); const c = ballCenter();
    pecker.root.visible = true; pecker.noCheck = true; pecker.root.position.set(c.x - .42, c.y - .02, c.z); pecker.root.rotation.set(0, 0, 0);
    const tug = ph > .3 ? 1 : 0; posePecker(pecker, t, { tongue: lerp(.4, 1, sm(clamp(ph / .3, 0, 1))), tug, flap: tug * .6, wide: tug > 0 });
    pecker.root.position.x -= tug * Math.abs(Math.sin(t * 7)) * .03;
    frameOn([ball, pecker], { az: lerp(.15, .05, k), el: .06, fill: lerp(.55, .62, k), t }); draw();
    stamp("BARBED TONGUE", W * .42, H * .17, (lt - .15) / .3, "#7a5cff", -.06); });
  // 5 Studio: Meise auf der Waage, Mond zieht vorbei, Anzeige fällt von 11.0 auf 10.5 g + BTO-Karte
  KZ.shot("fWeight", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(scale, 0, 0, 0); scale.root.scale.setScalar(1.6); const drop = sm(clamp((ph - .3) / .5, 0, 1)); scale.show((11 - drop * .55).toFixed(2) + " g");
    bigTit.root.visible = true; bigTit.root.position.set(0, .45, 0); bigTit.root.rotation.set(0, -.5, 0); poseTit(bigTit, t, { sc: 2.4, wide: drop > .5, lean: drop * .05 });
    moon.root.visible = true; moon.root.position.set(lerp(-1.6, 1.6, ph), 2.6 + Math.sin(ph * PI) * .4, -1);
    frameOn([scale, bigTit], { az: lerp(.25, .1, k), el: .15, fill: lerp(.55, .6, k), dy: .1, t }); draw();
    if (ph < .55) stamp("ONE COLD NIGHT", W * .42, H * .17, (lt - .15) / .3, "#2f6fd0", -.06);
    else stamp("-5% WEIGHT", W * .42, H * .17, (ph - .55) * d / .3, "#e5484d", .06);
    const cp = sm((lt - d * .5) / .3); if (card(W * .42, H * .64, 760, 110, cp)) txt("Source: BTO (blue & great tits)", W * .42, H * .64, 34, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 6 Pointe: Rudi kratzt sich unter dem Netz-Baum am Kopf
  KZ.shot("fOverkill", (lt, d, t) => { inYard(); const k = sm(lt / d); netTree.root.visible = true; netTree.root.position.set(.3, 0, -.3);
    place(rudi, -.95, 1.0, .35); poseRudi(rudi, t, { arms: [2.75, .2], spread: .1, mouth: "o", tilt: -.12 });
    frameOn([netTree, rudi], { az: lerp(.45, .35, k), el: .12, fill: lerp(.95, 1.0, k), t }); draw();
    if (lt > d * .3) stamp("50 TRAPS", W * .42, H * .17, (lt - d * .3) / .3, "#e5484d", .06); });
  // 7 Tipp: Schnipp! Netz fällt ab -> Knödel kommt in den Metall-Halter
  KZ.shot("fTip", (lt, d, t) => { inYard(); poleAt(); const ph = lt / d;
    if (ph < .55) { const k = ph / .55; rudiAt(t, { arms: [2.45, .25], spread: .05, mouth: "smile" }); ballOnHook(0);
      const c = ballCenter(); scissors.root.visible = true; scissors.root.position.set(c.x + .02, c.y + .02, c.z + .2); scissors.root.rotation.set(0, .4, -.2); scissors.root.scale.setScalar(1.7);
      const sn = Math.abs(Math.sin(t * 12)) * .35 * (k < .6 ? 1 : 0); scissors.a.rotation.z = sn; scissors.b.rotation.z = -sn;
      const fall = sm(clamp((k - .6) / .4, 0, 1)); ball.net.position.y = -fall * 1.3; ball.net.rotation.z = fall * 1.2; ball.net.visible = fall < .98;
      frameOn([rudi, pole], { az: lerp(.5, .45, k), el: .1, fill: lerp(.92, .96, k), t }); draw();
      stamp("SNIP!", W * .42, H * .17, (lt - .15) / .3, "#ff9f1c", -.06); }
    else { const k = (ph - .55) / .45; ball.root.visible = false; cage.root.visible = true; cage.root.position.copy(HK); cage.root.rotation.set(0, 0, 0);
      rudiAt(t, { arms: [.2, .2], spread: .3, mouth: "smile" }); rudi.root.visible = false;
      frameOn([cage], { az: lerp(.3, .2, k), el: .1, fill: lerp(.42, .48, k), dy: -.05, t }); draw();
      stamp("METAL FEEDER", W * .42, H * .17, (ph - .57) * d / .3, "#36b37e", .06); } });
  // 8 Meisen picken fröhlich am Halter, Herzen
  KZ.shot("fHappy", (lt, d, t) => { inYard(); poleAt(); const ph = lt / d, k = sm(ph); cage.root.visible = true; cage.root.position.copy(HK); cage.root.rotation.set(0, 0, Math.sin(t * 4) * .03);
    cage.root.updateMatrixWorld(true); const c = cage.root.localToWorld(V(0, -.38, 0));
    tit.noCheck = true; titAt(tit, V(c.x - .26, c.y - .2, c.z + .04), 0); poseTit(tit, t, { peck: 1 }); tit.root.rotation.z = .5;
    tit2.noCheck = true; titAt(tit2, V(c.x + .26, c.y - .12, c.z - .02), PI); poseTit(tit2, t + 1, { peck: 1 }); tit2.root.rotation.z = .5;
    hearts.root.visible = ph > .35; hearts.list.forEach((hh, i) => { const p = clamp((ph - .35 - i * .06) / .25, 0, 1); hh.visible = p > 0; hh.position.set(c.x - .3 + i * .2, c.y + .25 + p * .5, c.z + .2); hh.rotation.y = t * 2 + i; hh.scale.setScalar(.08 * easeBack(p) + .001); });
    frameOn([cage], { az: lerp(.35, .25, k), el: .08, fill: lerp(.38, .42, k), t }); draw();
    stamp("NOBODY STUCK", W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06); });
  // 9 Loop: Meise fliegt wieder auf einen Knödel im Netz zu (endet genau im ersten Bild des Hooks)
  KZ.shot("fLoop", (lt, d, t) => { const ph = lt / d; hookScene(lerp(-.25, 0, ph), t, d);
    if (ph > .3) stamp("STILL NETS?", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__fatball3d = true;
})();
