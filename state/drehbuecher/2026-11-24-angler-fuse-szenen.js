// 3D-Szene "Why Does A Male Anglerfish Fuse With His Mate?" / "Warum verschmilzt der Anglerfisch-Mann mit seiner Frau?" (24.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Erstes Safari/Expeditions-Video (Themen-Mix, Hermann 24.11.2026): Rudi taucht in die Tiefsee und moderiert "Tiefsee-Dating" (Opener-Stil "dating-show").
// Figuren: Tiefsee-Anglerfisch-Weibchen (rund, dunkelviolett, Unterbiss mit Zähnen, Angel mit leuchtendem Köder), Zwerg-Männchen (grau, große Nase, winkt mit dem Schwanz),
// Rudi mit Glas-Taucherhelm (eigene Figur "Helm", folgt dem Kopf, Augen bleiben frei), Pressluftflasche, Mikrofon, Taschenlampe mit Lichtkegel.
// Welt "deep": dunkelblauer Grund, Felsen, Meeresschnee, Röhrenwürmer.
// Quellen: University of Washington News 30.07.2020 (Pietsch; "females may be more than 60 times the length and about a half-a-million times as heavy as the males",
// "fuse their tissues and then establish a common blood circulation", "where females and males otherwise rarely meet"), Pietsch 2009 UC Press (Ceratias holboelli),
// Isakov 2022 Life (Männchen verliert Augen, Flossen, innere Organe außer Hoden), Swann et al. 2020 Science / MPI Freiburg (Immunsystem).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const QUIZ = () => [L("500,000×", "500.000-mal"), L("1,000×", "1.000-mal"), L("10×", "10-mal")];
  let fem, male, rudi, helm, deep, deepTex, tank, mic, lamp, beam;
  const FS = 1.35; // Weibchen-Größe

  // ---------- Tiefsee-Welt ----------
  function makeDeep() { const root = new T.Group();
    const floor = new T.Mesh(new T.CircleGeometry(40, 64), M(0x2a3566, { roughness: .95 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; root.add(floor);
    const rock = M(0x3a4479, { roughness: .9 });
    for (const [x, z, r] of [[-3.2, -3, .9], [-4.4, -1.2, .6], [3.6, -3.4, 1.1], [4.8, -1.6, .55], [-1.4, -5.5, .8], [1.8, -6, 1.3], [-6, -5, 1.4], [6.5, -6, 1.2]]) root.add(sph(rock, x, r * .35, z, r, r * .6, r * .9));
    // Röhrenwürmer (weiße Röhren, rote Kiemen) auf den Felsen
    const tubeM = M(0xe9e2d0, { roughness: .8 }), gill = M(0xff4a5a, { emissive: 0x801020, emissiveIntensity: .5 });
    for (const [x, z] of [[-3, -2.6], [-3.4, -2.9], [3.3, -3], [3.7, -2.9], [-4.2, -1]]) { root.add(mesh(CYL, tubeM, x, .7, z, .05, .7, .05)); root.add(sph(gill, x, 1.08, z, .09, .07, .09)); }
    // Meeresschnee
    const snow = M(0xffffff, { emissive: 0xbfd8ff, emissiveIntensity: .7 }); let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    const flakes = new T.Group(); root.add(flakes);
    for (let i = 0; i < 160; i++) { const f = sph(snow, -9 + rnd() * 18, .3 + rnd() * 7, -12 + rnd() * 14, .015 + rnd() * .025); f.castShadow = false; flakes.add(f); }
    root.userData.flakes = flakes; return { root }; }

  // ---------- Anglerfisch (Weibchen und Männchen) ----------
  const SKIN = 0x6a4f96, BELLY = 0x9a86c4, FIN = 0x8466b8;
  function makeMale(sc) { const root = new T.Group(), b = new T.Group(); root.add(b); b.scale.setScalar(sc || 1);
    const grey = M(0x98a4bd, { roughness: .75 }), dark = M(0x66708c, { roughness: .8 });
    b.add(sph(grey, 0, 0, 0, .12, .06, .055)); b.add(sph(grey, .1, .005, 0, .05, .045, .045));
    b.add(sph(dark, .145, .02, 0, .02, .018, .03)); // große Nase (riecht das Weibchen)
    const tail = new T.Group(); tail.position.set(-.11, 0, 0); b.add(tail); tail.add(sph(dark, -.05, 0, 0, .06, .05, .01));
    const fins = []; for (const s of [-1, 1]) { const f = sph(dark, .02, -.01, s * .055, .035, .022, .008); b.add(f); fins.push(f); }
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.08, .025, s * .042); e.rotation.y = -s * 1.0; b.add(e); const ey = K3.eye(.028); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    return { root, b, tail, fins, eyes }; }
  function poseMale(Mm, t, o) { o = o || {}; Mm.tail.rotation.y = Math.sin(t * (o.wave ? 14 : 6)) * (o.wave ? .7 : .3); Mm.fins.forEach((f, i) => f.rotation.x = Math.sin(t * 9 + i) * .4);
    const es = o.eyes ?? 1; Mm.eyes.forEach((e) => e.scale.setScalar(es)); Mm.fins.forEach((f) => f.scale.set(.035 * (o.fin ?? 1), .022 * (o.fin ?? 1), .008));
    if (K3.aimEyes) { Mm.root.updateMatrixWorld(true); K3.aimEyes(Mm.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .5); } }

  function makeAngler() { const skin = M(SKIN, { roughness: .6 }), belly = M(BELLY, { roughness: .7 }), fin = M(FIN, { roughness: .6 }), tooth = M(0xfffbea, { roughness: .3 }), inner = M(0x2a0f24, { roughness: .9 });
    const root = new T.Group(), body = new T.Group(); body.position.y = .8; root.add(body);
    body.add(sph(skin, 0, 0, 0, .62, .55, .5));
    body.add(sph(belly, .06, -.22, 0, .5, .32, .42));
    body.add(sph(skin, .36, .12, 0, .32, .3, .4));
    body.add(sph(inner, .5, -.08, 0, .14, .17, .33));
    const jaw = new T.Group(); jaw.position.set(.38, -.2, 0); body.add(jaw);
    jaw.add(sph(skin, .14, -.04, 0, .26, .12, .42));
    const cone = new T.ConeGeometry(1, 1, 8); cone.translate(0, .5, 0);
    for (let i = 0; i < 7; i++) { const a = -1.1 + i * 2.2 / 6; const tt = mesh(cone, tooth, .14 + Math.cos(a) * .22, .03, Math.sin(a) * .36, .022, .13 + (i % 2) * .05, .022); tt.rotation.z = -.15; jaw.add(tt); }
    for (let i = 0; i < 6; i++) { const a = -1 + i * 2 / 5; const tt = mesh(cone, tooth, .38 + Math.cos(a) * .2, .0, Math.sin(a) * .32, .018, .1 + (i % 2) * .04, .018); tt.rotation.z = PI + .1; body.add(tt); }
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.42, .3, s * .27); e.rotation.y = -s * .55; body.add(e); const ey = K3.eye(.075); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, M(0x4a3570), .44, .41, s * .27, .09, .02, .03); b.rotation.y = -s * .55; body.add(b); brows.push(b); }
    body.add(sph(fin, -.18, .52, 0, .2, .12, .03));
    const pecs = []; for (const s of [-1, 1]) { const p = new T.Group(); p.position.set(.0, -.08, s * .46); body.add(p); p.add(sph(fin, -.08, 0, s * .03, .14, .1, .03)); pecs.push(p); }
    const tail = new T.Group(); tail.position.set(-.58, 0, 0); body.add(tail); tail.add(sph(skin, -.06, 0, 0, .12, .14, .1));
    for (const s of [-1, 1]) { const f = sph(fin, -.26, s * .1, 0, .2, .13, .03); f.rotation.z = s * .5; tail.add(f); }
    // Angel (Illicium) mit leuchtendem Köder (Esca)
    const lure = new T.Group(); lure.position.set(.3, .45, 0); body.add(lure);
    const curve = new T.QuadraticBezierCurve3(V(0, 0, 0), V(.12, .55, 0), V(.55, .45, 0)); lure.add(new T.Mesh(new T.TubeGeometry(curve, 20, .022, 8, false), skin));
    const esca = sph(M(0xb8fff6, { emissive: 0x7ff0ff, emissiveIntensity: 1.4, roughness: .3 }), .58, .4, 0, .075, .085, .075); lure.add(esca);
    const male1 = makeMale(2.3); male1.root.position.set(.12, -.52, .32); male1.root.rotation.set(.15, .35, .45); body.add(male1.root);
    // Blutgefäße (rot leuchtend), sichtbar beim Verschmelzen
    const veins = new T.Group(); male1.root.add(veins); const vm = M(0xff3046, { emissive: 0xff1030, emissiveIntensity: .9, roughness: .4 });
    for (const [y, z] of [[.045, .0], [.02, .045], [.02, -.045], [-.035, .03], [-.035, -.03]]) { const c = new T.QuadraticBezierCurve3(V(.16, y * .6, z * .6), V(.03, y * 1.25, z * 1.25), V(-.12, y * .5, z * .5));
      veins.add(new T.Mesh(new T.TubeGeometry(c, 12, .009, 6, false), vm)); }
    return { root, body, jaw, eyes, brows, pecs, tail, lure, esca, male: male1, veins }; }
  function poseAngler(F, t, o) { o = o || {};
    F.body.position.y = .8 + Math.sin(t * 1.3) * .03; F.body.rotation.z = Math.sin(t * .9) * .03 + (o.tilt || 0);
    F.tail.rotation.y = Math.sin(t * 3) * .35; F.pecs.forEach((p, i) => p.rotation.x = (i ? 1 : -1) * Math.sin(t * 4) * .4);
    F.jaw.rotation.z = -(o.open ?? (.05 + Math.max(0, Math.sin(t * .8)) * .06));
    F.lure.rotation.z = Math.sin(t * 2.2) * .12; F.esca.material.emissiveIntensity = 1.1 + Math.sin(t * 5) * .4;
    const lid = Math.sin(t * 1.3 + 2) > .985 ? .15 : 1; F.eyes.forEach((e) => e.scale.set(1, lid, 1));
    F.brows.forEach((b, i) => b.rotation.x = (i ? 1 : -1) * (o.angry ? .45 : 0));
    if (K3.aimEyes) { F.root.updateMatrixWorld(true); K3.aimEyes(F.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .5); }
    F.male.root.visible = o.male !== false; F.veins.visible = !!o.veins;
    if (o.veins) F.veins.children.forEach((v, i) => v.material.emissiveIntensity = .6 + Math.max(0, Math.sin(t * 6 - i)) * 1.2);
    poseMale(F.male, t, { wave: o.wave, eyes: o.maleEyes, fin: o.maleFin, lookAt: o.maleLook });
    F.root.scale.setScalar(o.sc || FS); }

  // ---------- Rudis Tauchausrüstung ----------
  function makeHelm() { const root = new T.Group();
    const glass = new T.Mesh(new T.SphereGeometry(.46, 40, 24), M(0xcfefff, { transparent: true, opacity: .16, roughness: .05, metalness: .2, depthWrite: false })); root.add(glass);
    const ring = new T.Mesh(new T.TorusGeometry(.33, .06, 12, 40), M(0xd9a441, { metalness: .8, roughness: .3 })); ring.rotation.x = PI / 2; ring.position.y = -.36; root.add(ring);
    const bub = []; for (let i = 0; i < 4; i++) { const b = sph(M(0xe8f8ff, { transparent: true, opacity: .55, roughness: .1 }), 0, 0, 0, .04 + i * .012); b.castShadow = false; root.add(b); bub.push(b); }
    root.userData.bub = bub; return { root }; }
  function gear() { const R = K3.rudi;
    tank = new T.Group(); tank.position.set(-.33, 1.12, 0); R.body.add(tank); const st = M(0xe8e8ef, { metalness: .6, roughness: .35 });
    for (const s of [-1, 1]) { tank.add(mesh(CYL, st, 0, 0, s * .1, .09, .55, .09)); tank.add(sph(st, 0, .28, s * .1, .09)); }
    mic = new T.Group(); mic.position.set(0, -.66, 0); R.arms[1].add(mic);
    mic.add(mesh(CYL, M(0x22252e), .0, .08, 0, .03, .22, .03)); mic.add(sph(M(0x9aa1ad, { metalness: .6, roughness: .35 }), 0, .22, 0, .06));
    lamp = new T.Group(); lamp.position.set(0, -.66, 0); R.arms[0].add(lamp);
    lamp.add(mesh(CYL, M(0xffc928), 0, -.05, 0, .05, .2, .05)); lamp.add(mesh(CYL, M(0xfff6c8, { emissive: 0xfff2a0, emissiveIntensity: 1 }), 0, -.16, 0, .055, .02, .055));
  }
  // Lichtkegel der Taschenlampe (2D, damit er nicht in die Figuren-Box zählt)
  function beam2d(aim) { K3.rudi.root.updateMatrixWorld(true); const [x0, y0] = scr(lamp.localToWorld(V(0, -.17, 0))), [x1, y1] = scr(aim);
    const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l, w = l * .32; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter";
    const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, "rgba(255,240,170,.45)"); gr.addColorStop(1, "rgba(255,240,170,0)"); g.fillStyle = gr;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1 + nx * w, y1 + ny * w); g.lineTo(x1 - nx * w, y1 - ny * w); g.closePath(); g.fill(); g.restore(); }
  function suit(o) { mic.visible = !!o.mic; lamp.visible = !!o.lamp; }
  function helmOn(t) { const R = K3.rudi; R.root.updateMatrixWorld(true); const p = R.head.localToWorld(V(.02, .05, 0)); helm.root.visible = true; helm.root.position.copy(p);
    helm.root.userData.bub.forEach((b, i) => { const ph = (t * .5 + i * .27) % 1; b.position.set(-.1 + Math.sin(t * 3 + i) * .05, .5 + ph * 1.2, .05 * i); b.visible = ph < .9; }); }

  K3.onBuild(() => {
    rudi = K3.rudi; deep = actor(makeDeep(), "Tiefsee"); fem = actor(makeAngler(), "Anglerfisch"); male = actor(makeMale(2.3), "Männchen"); helm = actor(makeHelm(), "Helm"); gear();
    for (const a of [deep, helm]) { a.noCheck = true; a.noBlob = true; a.noEyeCheck = true; }
    fem.noBlob = true; male.noBlob = true;
    deepTex = canvasTex(64, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#1b4a8f"); gr.addColorStop(.5, "#0f2a62"); gr.addColorStop(1, "#06102e"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  });
  function inDeep(t) { begin("studio"); K3.studio.visible = false; K3.scene.background = deepTex; K3.scene.fog = new T.Fog(0x0b1d4c, 16, 46); K3.hemi.intensity = .7;
    deep.root.visible = true; deep.root.userData.flakes.position.y = -((t * .08) % 1);
    rudi.root.rotation.set(0, 0, 0); rudi.body.position.set(0, 0, 0); suit({}); }
  function femAt(x, y, z, ry) { fem.root.visible = true; fem.root.position.set(x, y, z); fem.root.rotation.set(0, ry || 0, 0); }
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  function lureGlow(a) { fem.root.updateMatrixWorld(true); const [x, y] = scr(fem.esca.getWorldPosition(V(0, 0, 0))); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter";
    const r = 150 + Math.sin(KZ.t * 5) * 20, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(170,255,250,${.55 * (a ?? 1)})`); gr.addColorStop(1, "rgba(120,230,255,0)");
    g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.restore(); }
  // pochendes Herz neben dem angewachsenen Männchen (Hook)
  function maleHeart(t) { fem.root.updateMatrixWorld(true); const [x, y] = scr(fem.male.root.localToWorld(V(-.05, .12, 0))); const k = 1 + Math.max(0, Math.sin(t * 7)) * .25;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(Math.min(x - 70, 800), y - 40); g.scale(k, k); g.font = '900 96px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle";
    g.lineWidth = 8; g.strokeStyle = "#ffffff"; g.strokeText("♥", 0, 0); g.fillStyle = "#ff4f8b"; g.fillText("♥", 0, 0); g.restore(); }
  // Neon-Schild der Show (2D)
  function neon(a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; const fl = Math.sin(KZ.t * 13) > -.85 ? 1 : .55;
    g.font = '900 66px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "#ff4fa3"; g.shadowBlur = 40 * fl; g.lineWidth = 10; g.strokeStyle = "#5a0b3a";
    const s = L("DEEP SEA DATING", "TIEFSEE-DATING"); g.strokeText(s, W * .42, H * .145); g.fillStyle = "#ffd1ec"; g.fillText(s, W * .42, H * .145);
    g.font = '900 60px "Montserrat"'; g.fillStyle = "#ff4f8b"; for (const dx of [-1, 1]) g.fillText("♥", W * .42 + dx * 330, H * .145 + Math.sin(KZ.t * 6 + dx) * 6); g.restore(); }

  // ---------- Shots ----------
  // Hook: Weibchen schräg von vorn, Köder leuchtet, Männchen klebt am Bauch und winkt, Stempel FÜR IMMER ab Bild 1
  function hookFrame(t, ph) { femAt(0, 0, 0, -.35); poseAngler(fem, t, { wave: true, open: .12, maleLook: K3.camera.position });
    frameOn([fem], { az: lerp(.55, .7, ph), el: lerp(.02, .06, ph), fill: lerp(.84, .89, ph), dy: -.15, t }); draw(); lureGlow(); maleHeart(t); }
  KZ.shot("aHook", (lt, d, t) => { inDeep(t); hookFrame(t, lt / d);
    stamp(L("FOREVER!", "FÜR IMMER!"), W * .5, H * .58, (lt + .18) / .25, "#ff4f8b", -.07); });
  // 1 Tiefsee-Dating: Rudi im Taucherhelm mit Mikro, Weibchen schwebt rechts, Neon-Schild
  KZ.shot("aShow", (lt, d, t) => { inDeep(t); const ph = lt / d, k = sm(ph);
    place(rudi, -1.1, .4, .25); suit({ mic: true }); poseRudi(rudi, t, { arms: [.15, 1.25], spread: .05, mouth: ph < .6 ? "o" : "smile", nod: .05 }); rudi.body.position.y = .1 + Math.sin(t * 1.5) * .05; helmOn(t);
    femAt(.9, 0, -.3, -.7); poseAngler(fem, t, { male: false, lookAt: rudi.head.getWorldPosition(V(0, 0, 0)) });
    frameOn([rudi, fem], { az: lerp(.55, .45, k), el: .1, fill: lerp(.85, .9, k), dy: -.2, t }); draw(); lureGlow(); neon(clamp(lt / .2, 0, 1)); });
  // 2 Rate-Frage: Weibchen nah, Kacheln
  KZ.shot("aQuiz", (lt, d, t) => { inDeep(t); const ph = lt / d, k = sm(ph);
    femAt(0, 0, 0, -.5); poseAngler(fem, t, { male: false, open: .1 });
    frameOn([fem], { az: lerp(.4, .55, k), el: .1, fill: lerp(.62, .68, k), dy: -.75, t }); draw(); lureGlow();
    txt(L("HOW MUCH HEAVIER IS SHE?", "WIE VIEL SCHWERER IST SIE?"), W * .42, H * .18, 50, "#ffd23f", { stroke: 12, a: clamp(lt / .3, 0, 1) });
    quizTiles(W * .42, H * .56, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 3 Suche: Rudi schwenkt die Taschenlampe, sucht den Bräutigam, Weibchen hinter ihm; Stempel NICHTS.
  KZ.shot("aSearch", (lt, d, t) => { inDeep(t); const ph = lt / d, k = sm(ph);
    place(rudi, -.6, 1.0, .9 + Math.sin(ph * 3) * .2); suit({ lamp: true }); const sw = Math.sin(t * 2.4);
    poseRudi(rudi, t, { arms: [1.25 + sw * .25, .2], spread: .05, mouth: "o", walk: .4, tilt: sw * .1 }); rudi.body.position.y = .1; rudi.root.rotation.y = -.5 + sw * .5; helmOn(t);
    femAt(1.0, 0, -.6, -1.2); poseAngler(fem, t, { male: false, lookAt: rudi.head.getWorldPosition(V(0, 0, 0)), angry: ph > .6 });
    frameOn([rudi, fem], { az: lerp(.25, .4, k), el: .12, fill: lerp(.88, .94, k), dy: -.2, t }); draw(); lureGlow(.7); beam2d(V(-.8 + sw * 1.6, .5 + Math.cos(t * 1.7) * .4, -3.5));
    stamp(L("NOTHING.", "NICHTS."), W * .42, H * .17, (ph - .62) * d / .25, "#2f6fd0", -.06); });
  // 4 Gefunden: Nahaufnahme Bauch, Männchen winkt mit dem Schwanz, Rudi staunt; Stempel DAS IST ER?!
  KZ.shot("aFound", (lt, d, t) => { inDeep(t); const ph = lt / d, k = sm(ph);
    femAt(.35, 0, -.25, -.25); poseAngler(fem, t, { wave: true, maleLook: K3.camera.position });
    place(rudi, -.9, .9, .9); suit({}); poseRudi(rudi, t, { arms: [.4, .2], spread: .1, mouth: "o", wide: true, lean: -.1 }); rudi.root.rotation.y = -.3; helmOn(t);
    frameOn([rudi, fem], { az: lerp(.25, .32, k), el: lerp(-.02, -.06, k), fill: lerp(.9, .98, k), dy: -.25, t }); draw(); lureGlow(.6);
    fem.root.updateMatrixWorld(true); const [mx, my] = scr(fem.male.root.getWorldPosition(V(0, 0, 0)));
    stamp(L("THAT'S HIM?!", "DAS IST ER?!"), W * .42, H * .17, (lt - .35) / .25, "#ff4f8b", .06);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = "#ffd23f"; g.lineWidth = 10; g.globalAlpha = clamp((lt - .5) / .2, 0, 1); g.beginPath(); g.arc(mx, my, 90 + Math.sin(t * 8) * 6, 0, 7); g.stroke(); g.restore(); });
  // 5 Auflösung: Weibchen + freies Männchen nebeneinander (Größenvergleich), Kacheln mit Haken, dann UW-Karte
  KZ.shot("aReveal", (lt, d, t) => { inDeep(t); const ph = lt / d, k = sm(ph);
    femAt(-.2, 0, 0, -.3); poseAngler(fem, t, { male: false });
    male.root.visible = true; male.root.position.set(1.55, 1.1 + Math.sin(t * 2) * .05, .5); male.root.rotation.set(0, PI + .3, 0); poseMale(male, t, { lookAt: fem.root.getWorldPosition(V(0, 1, 0)) });
    frameOn([fem, male], { az: lerp(.3, .38, k), el: .08, fill: lerp(.88, .93, k), dy: -.7, t }); draw(); lureGlow(.7);
    stamp(L("500,000×!", "500.000×!"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06);
    if (ph < .45) quizTiles(W * .42, H * .56, QUIZ(), 1, { reveal: sm(clamp((lt - .1) / .4, 0, 1)), correct: 0 });
    else infoCard(W * .42, H * .59, 900, 230, sm((ph - .45) * d / .35), L("UNIV. OF WASHINGTON", "UNI WASHINGTON"), "#36b37e", [L("“60× the length,", "„60-mal so lang,"), L("half a million × as heavy”", "500.000-mal so schwer“")], 40); });
  // 6 Verschmelzen: Nahaufnahme, Männchen beißt sich fest, rote Blutbahnen pulsieren; Stempel VERWACHSEN!
  KZ.shot("aFuse", (lt, d, t) => { inDeep(t); const ph = lt / d, k = sm(ph);
    femAt(0, .9, 0, -.1); poseAngler(fem, t, { veins: ph > .25, maleLook: fem.root.getWorldPosition(V(0, 1.2, 0)) });
    fem.male.root.position.set(-.05 + (1 - sm(clamp(ph / .25, 0, 1))) * .0, -.5 - (1 - sm(clamp(ph / .25, 0, 1))) * .15, .26);
    frameOn([fem.male], { az: lerp(.15, .05, k), el: lerp(.1, .06, k), fill: lerp(.6, .7, k), dy: .05, t }); draw();
    if (ph > .25) { fem.root.updateMatrixWorld(true); const [jx, jy] = scr(fem.male.root.localToWorld(V(.17, 0, 0))); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter";
      const r = 120 + Math.sin(t * 6) * 25, gr = g.createRadialGradient(jx, jy, 0, jx, jy, r); gr.addColorStop(0, "rgba(255,60,90,.55)"); gr.addColorStop(1, "rgba(255,40,80,0)"); g.fillStyle = gr; g.fillRect(jx - r, jy - r, 2 * r, 2 * r); g.restore(); }
    stamp(L("FUSED!", "VERWACHSEN!"), W * .42, H * .17, (ph - .3) * d / .25, "#e5484d", -.06);
    infoCard(W * .42, H * .6, 860, 200, sm((ph - .5) * d / .35), L("SHARED BLOOD", "GEMEINSAMES BLUT"), "#e5484d", [L("one body, two fish", "ein Körper, zwei Fische")], 40); });
  // 7 Schrumpfen: Augen und Flossen des Männchens werden immer kleiner; Stempel AUGEN: WEG
  KZ.shot("aShrink", (lt, d, t) => { inDeep(t); const ph = lt / d, k = sm(ph);
    femAt(0, .9, 0, .15); poseAngler(fem, t, { veins: true, maleEyes: lerp(1, .4, sm(clamp(ph / .7, 0, 1))), maleFin: lerp(1, .3, k), maleLook: K3.camera.position });
    frameOn([fem.male], { az: lerp(-.05, .05, k), el: .08, fill: lerp(.65, .75, k), dy: .05, t }); draw();
    stamp(L("EYES: GONE", "AUGEN: WEG"), W * .42, H * .17, (lt - .25) / .25, "#e5484d", .05);
    stamp(L("FINS: GONE", "FLOSSEN: WEG"), W * .42, H * .26, (ph - .45) * d / .25, "#e5484d", -.05); });
  // 8 Warum: weite Tiefsee, Weibchen allein mit Licht, weit weg ein winziges Männchen; UW-Zitat; Stempel NIE LOSLASSEN
  KZ.shot("aWhy", (lt, d, t) => { inDeep(t); const ph = lt / d, k = sm(ph);
    femAt(-.6, .3, 0, -.4); poseAngler(fem, t, { male: false, sc: 1.0 });
    male.root.visible = true; male.root.position.set(1.6, 1.6 + Math.sin(t * 2) * .05, -1.2); male.root.rotation.set(0, PI + .4, 0); poseMale(male, t, { lookAt: fem.root.getWorldPosition(V(0, 1, 0)) }); male.root.scale.setScalar(.8);
    frameOn([fem, male], { az: lerp(.2, .3, k), el: .12, fill: lerp(.72, .78, k), dy: -.6, t }); draw(); lureGlow();
    male.root.scale.setScalar(1);
    stamp(L("NEVER LET GO", "NIE LOSLASSEN"), W * .42, H * .17, (ph - .45) * d / .25, "#ff4f8b", -.06);
    infoCard(W * .42, H * .59, 880, 220, sm((lt - .15) / .35), L("UNIV. OF WASHINGTON", "UNI WASHINGTON"), "#2f6fd0", [L("“Females and males otherwise", "„Weibchen und Männchen treffen"), L("rarely meet.”", "sich sonst nur selten.“")], 38); });
  // 9 Loop: zurück zur Hook-Einstellung
  KZ.shot("aLoop", (lt, d, t) => { inDeep(t); const ph = lt / d; hookFrame(t, 1 - ph);
    if (ph > .3) stamp(L("CLINGY DATE?", "KLAMMER-DATE?"), W * .42, H * .12, (ph - .3) * d / .3, "#ff4f8b", -.06); });

  window.__anglerFuse = true;
})();
