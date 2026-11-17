// 3D-Szene "Why Your Hamster Hates Its Ball" (17.11.2026). Goldhamster (Syrer), Hamsterball, Wohnzimmer, RSPCA.
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  let ham, ham2, ball, bigBall, rudi, room, roomBg, table, pillows, wheel, bed, tiles, route;

  // ---------- Goldhamster (eigener Entwurf: goldbraun oben, cremeweiß unten, Backentaschen, runde Ohren, schwarze Knopfaugen, Stummelschwanz) ----------
  function makeHamster() {
    const fur = M(0xe9a25a, { roughness: .8 }), furD = M(0xc9803c, { roughness: .8 }), cream = M(0xfff1dc, { roughness: .85 }), pink = M(0xffa3b1, { roughness: .5 });
    const black = M(0x120c10, { roughness: .08 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), wh = M(0xffffff, { roughness: .4 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(fur, 0, .2, 0, .25, .19, .2));                 // Körper (rund, kompakt)
    body.add(sph(furD, -.04, .27, 0, .17, .1, .13));            // dunklerer Rücken
    body.add(sph(cream, .05, .14, 0, .2, .12, .17));            // heller Bauch
    body.add(sph(pink, -.25, .17, 0, .025, .02, .02));          // Stummelschwanz
    const legs = []; for (const [x, s] of [[.13, -1], [.13, 1], [-.12, -1], [-.12, 1]]) { const l = limb(.028, .07, pink); l.position.set(x, .075, s * .11); l.add(sph(pink, .015, -.075, 0, .035, .015, .028)); body.add(l); legs.push(l); }
    const head = new T.Group(); head.position.set(.2, .27, 0); body.add(head);
    head.add(sph(fur, 0, 0, 0, .16, .15, .16));
    const cheeks = []; for (const s of [-1, 1]) { const c = sph(cream, .06, -.05, s * .095, .095, .08, .085); head.add(c); c.base = c.scale.clone(); cheeks.push(c); }
    for (const s of [-1, 1]) head.add(sph(furD, .02, .0, s * .135, .05, .045, .03)); // dunkler Backenfleck
    head.add(sph(cream, .13, -.035, 0, .065, .055, .065));
    head.add(sph(pink, .19, -.01, 0, .022, .018, .024));
    const mouth = mesh(new T.TorusGeometry(.016, .004, 6, 12, PI), M(0x5a2a20), .185, -.055, 0); mouth.rotation.set(0, PI / 2, PI); head.add(mouth);
    for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.03, .13, s * .095); e.rotation.x = s * .35; head.add(e);
      e.add(sph(fur, 0, 0, 0, .05, .06, .022)); e.add(sph(pink, .006, 0, 0, .036, .045, .016)); }
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.105, .045, s * .085); head.add(e);
      e.add(sph(black, 0, 0, 0, .04, .043, .04)); e.add(sph(hl, .03, .017, -.008 * s, .011)); eyes.push(e); }
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .17, -.04 + i * .015, s * .09, .003, .13, .003); w.rotation.x = s * (PI / 2 - .25 + i * .2); w.castShadow = false; head.add(w); }
    // Schwindel-Sternchen
    const stars = new T.Group(); head.add(stars); const sm8 = M(0xffd23f, { emissive: 0xffb000, emissiveIntensity: .6 });
    for (let i = 0; i < 3; i++) { const s = sph(sm8, 0, 0, 0, .025); s.castShadow = false; stars.add(s); }
    // Zzz-Kugeln (schlafen)
    return { root, body, legs, head, eyes, cheeks, stars };
  }
  // o: {run 0..1, lid 0..1, dizzy, look, nod, sc, puff (Backen), up (Kopf hoch)}
  function poseHam(Hm, t, o) {
    o = o || {}; const run = o.run || 0;
    Hm.legs.forEach((l, i) => l.rotation.z = Math.sin(t * 22 + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .7 * run);
    Hm.body.position.y = Math.abs(Math.sin(t * 22)) * .012 * run + Math.sin(t * 3) * .004;
    Hm.body.rotation.z = (o.lean || 0);
    Hm.head.rotation.set(o.tilt || 0, o.look || 0, (o.nod || 0) + (o.up || 0) + Math.sin(t * 2.3) * .03);
    const lid = o.lid ?? (Math.sin(t * 1.6 + .5) > .985 ? .85 : 0);
    Hm.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid), 1));
    Hm.cheeks.forEach((c) => c.scale.copy(c.base).multiplyScalar(1 + (o.puff || 0) * .35));
    Hm.stars.visible = !!o.dizzy; Hm.stars.children.forEach((s, i) => { const a = t * 6 + i * 2.1; s.position.set(Math.cos(a) * .14, .2 + Math.sin(a * 2) * .02, Math.sin(a) * .14); });
    Hm.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Hamsterball (durchsichtig, Deckel-Naht, Luftschlitze) ----------
  function makeBall(R, col) {
    const root = new T.Group(), spin = new T.Group(); spin.position.y = R; root.add(spin);
    const shell = new T.Mesh(new T.SphereGeometry(R, 48, 32), new T.MeshStandardMaterial({ color: new T.Color(col).convertSRGBToLinear(), transparent: true, opacity: R > 1 ? .2 : .24, roughness: .05, metalness: .1, depthWrite: false }));
    shell.renderOrder = 5; spin.add(shell);
    const ringM = M(col, { roughness: .3 });
    const seam = mesh(new T.TorusGeometry(R * 1.005, R > 1 ? R * .012 : R * .03, 10, 64), ringM); spin.add(seam);
    const lid = mesh(new T.TorusGeometry(R * .42, R * .04, 10, 40), ringM, 0, 0, -R * .9); lid.scale.set(1, 1, 1); spin.add(lid);
    const slotM = M(new T.Color(col).multiplyScalar(.55).getHex(), { roughness: .4 });
    for (let i = 0; i < 10; i++) { const a = i / 10 * 2 * PI; const s = mesh(BOX, slotM, Math.cos(a) * R * .97, Math.sin(a) * R * .97, -R * .25, R * .03, R * .03, R * .22); s.lookAt(0, 0, 0); s.position.set(Math.cos(a) * R * .93, Math.sin(a) * R * .93, -R * .25); spin.add(s); }
    // Glanzpunkt
    const glint = sph(M(0xffffff, { emissive: 0xffffff, emissiveIntensity: .8, transparent: true, opacity: .55 }), R * .45, R * .55, R * .55, R * .12, R * .08, R * .04); glint.castShadow = false; root.add(glint); glint.position.y += R;
    shell.castShadow = false;
    return { root, spin, R };
  }

  // ---------- Wohnzimmer (wie Katzen-Video, eigene Welt) ----------
  function makeRoom() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(512, 512, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = ["#c8935e", "#bd8752", "#d29d68", "#c28c58"][i % 4]; c.fillRect(0, i * h / 8, w, h / 8); c.fillStyle = "rgba(90,50,20,.35)"; c.fillRect(0, i * h / 8, w, 3); c.fillRect((i * 173) % w, i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(6, 6);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    const wallTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#dff0e6"; c.fillRect(0, 0, w, h); c.fillStyle = "#cfe6d9"; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h); });
    wallTex.wrapS = wallTex.wrapT = T.RepeatWrapping; wallTex.repeat.set(10, 3);
    r.add(mesh(BOX, new T.MeshStandardMaterial({ map: wallTex, roughness: .9 }), 0, 2.5, -3, 30, 5, .2));
    r.add(mesh(BOX, M(0xffffff), 0, .08, -2.88, 30, .16, .06));
    const sky = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(1, "#cdeeff"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    const win = new T.Mesh(new T.PlaneGeometry(1.6, 1.4), new T.MeshStandardMaterial({ map: sky, emissive: 0xffffff, emissiveMap: sky, emissiveIntensity: .5 })); win.position.set(-2.4, 2.3, -2.89); r.add(win);
    const fr = M(0xffffff, { roughness: .5 }); for (const [x, y, sx, sy] of [[-2.4, 3.03, 1.75, .08], [-2.4, 1.57, 1.75, .08], [-3.24, 2.3, .08, 1.5], [-1.56, 2.3, .08, 1.5], [-2.4, 2.3, .05, 1.4], [-2.4, 2.3, 1.6, .05]]) r.add(mesh(BOX, fr, x, y, -2.87, sx, sy, .06));
    const rug = new T.Mesh(new T.CircleGeometry(1.8, 48), M(0x6a5acd, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(.2, .006, -.2); rug.scale.set(1.4, .9, 1); rug.receiveShadow = true; r.add(rug);
    const rug2 = new T.Mesh(new T.RingGeometry(1.45, 1.6, 48), M(0xffd23f, { roughness: 1 })); rug2.rotation.x = -PI / 2; rug2.position.set(.2, .008, -.2); rug2.scale.set(1.4, .9, 1); r.add(rug2);
    // Sofa
    const sofa = new T.Group(); sofa.position.set(.2, 0, -2.1); r.add(sofa);
    const red = M(0xe0603c, { roughness: .8 }), redD = M(0xc04f30, { roughness: .85 });
    sofa.add(mesh(BOX, redD, 0, .22, 0, 2.4, .36, .95));
    for (const x of [-.55, .55]) sofa.add(mesh(BOX, red, x, .45, .04, 1.08, .14, .86));
    sofa.add(mesh(BOX, red, 0, .85, -.38, 2.4, .8, .24));
    for (const x of [-1.27, 1.27]) sofa.add(mesh(BOX, red, x, .5, 0, .2, .62, .95));
    const pl = new T.Group(); pl.position.set(-3.0, 0, -2.4); r.add(pl); pl.add(mesh(new T.CylinderGeometry(.25, .18, .45, 24), M(0x2f6fd0), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const a = i / 7 * 2 * PI; const lf = sph(M(i % 2 ? 0x4fae4a : 0x3f9a3c), Math.cos(a) * .2, .75 + (i % 3) * .1, Math.sin(a) * .2, .1, .35, .05); lf.rotation.set(Math.sin(a) * .5, -a, Math.cos(a) * .5); pl.add(lf); }
    return r;
  }
  // Beistelltisch mit Wasserglas
  function makeTable() {
    const root = new T.Group(), top = new T.Group(); root.add(top); const wd = M(0x8a5a3a, { roughness: .6 });
    top.add(mesh(new T.CylinderGeometry(.42, .42, .06, 40), wd, 0, .78, 0));
    for (const [x, z] of [[.26, .26], [-.26, .26], [.26, -.26], [-.26, -.26]]) top.add(mesh(CYL, wd, x, .39, z, .035, .78, .035));
    const glass = new T.Mesh(new T.CylinderGeometry(.08, .07, .24, 32), new T.MeshStandardMaterial({ color: 0xdff4ff, transparent: true, opacity: .35, roughness: .05, depthWrite: false })); glass.position.set(0, .93, 0); top.add(glass);
    const water = mesh(new T.CylinderGeometry(.072, .065, .16, 32), M(0x4fb3ff, { roughness: .1, transparent: true, opacity: .8 }), 0, .9, 0); water.castShadow = false; top.add(water);
    return { root, top };
  }
  // Kissenwall
  function makePillows() {
    const root = new T.Group(), list = []; const cols = [0xff6b8a, 0xffd23f, 0x36b37e, 0x2f6fd0, 0xff9f43, 0xb08cff, 0xff6b8a, 0x36b37e, 0xffd23f, 0x2f6fd0];
    for (let i = 0; i < 10; i++) { const a = i / 10 * 2 * PI; const p = sph(M(cols[i], { roughness: .9 }), Math.cos(a) * 1.0, .2, Math.sin(a) * .8, .32, .2, .26); p.rotation.y = -a; root.add(p); list.push(p); p.home = p.position.clone(); }
    return { root, list };
  }
  // Laufrad (geschlossene Lauffläche) + Trinkflasche
  function makeWheel() {
    const root = new T.Group(), spin = new T.Group(); spin.position.set(0, .62, 0); root.add(spin);
    const wcol = M(0x36b37e, { roughness: .4 }), wcolD = M(0x2a8f63, { roughness: .45 });
    const back = mesh(new T.CylinderGeometry(.55, .55, .03, 48), wcolD, 0, 0, -.24); back.rotation.x = PI / 2; spin.add(back);
    const run = new T.Mesh(new T.CylinderGeometry(.55, .55, .46, 48, 1, true), new T.MeshStandardMaterial({ color: new T.Color(0x36b37e).convertSRGBToLinear(), roughness: .5, side: T.DoubleSide })); run.rotation.x = PI / 2; run.receiveShadow = true; spin.add(run);
    const rim = mesh(new T.TorusGeometry(.55, .025, 10, 48), wcol, 0, 0, .23); spin.add(rim);
    for (let i = 0; i < 6; i++) { const s = mesh(BOX, M(0xffffff, { roughness: .4 }), 0, 0, -.22, .9, .04, .01); s.rotation.z = i / 6 * PI; spin.add(s); }
    root.add(mesh(BOX, wcolD, 0, .32, -.3, .1, .64, .06)); root.add(mesh(BOX, wcolD, 0, .02, -.15, .6, .04, .5));
    const bottle = new T.Group(); bottle.position.set(1.0, 0, -.15); root.add(bottle);
    bottle.add(mesh(BOX, M(0xffffff, { roughness: .5 }), 0, .45, -.1, .06, .9, .06));
    const btl = new T.Mesh(new T.CylinderGeometry(.1, .1, .42, 32), new T.MeshStandardMaterial({ color: 0xbfe6ff, transparent: true, opacity: .45, roughness: .05, depthWrite: false })); btl.position.set(0, .66, 0); bottle.add(btl);
    bottle.add(mesh(new T.CylinderGeometry(.09, .09, .3, 32), M(0x4fb3ff, { roughness: .1 }), 0, .6, 0));
    bottle.add(mesh(new T.CylinderGeometry(.06, .06, .08, 24), M(0xe0503c), 0, .9, 0));
    const spout = mesh(new T.CylinderGeometry(.018, .018, .28, 12), M(0xc5ced8, { metalness: .9, roughness: .25 }), -.07, .34, 0); spout.rotation.z = .5; bottle.add(spout);
    return { root, spin, bottle };
  }
  // Offene Ballhälfte als Bett mit Einstreu
  function makeBed() {
    const root = new T.Group(); const R = .5;
    const half = new T.Mesh(new T.SphereGeometry(R, 48, 24, 0, 2 * PI, PI / 2, PI / 2), new T.MeshStandardMaterial({ color: new T.Color(0x8fd3ff).convertSRGBToLinear(), transparent: true, opacity: .45, roughness: .05, side: T.DoubleSide, depthWrite: false }));
    half.position.y = R; half.renderOrder = 5; root.add(half);
    const seam = mesh(new T.TorusGeometry(R, R * .04, 10, 64), M(0x8fd3ff, { roughness: .3 }), 0, R, 0); seam.rotation.x = PI / 2; root.add(seam);
    const pap = M(0xfff8ec, { roughness: 1 });
    for (let i = 0; i < 26; i++) { const a = i * 2.4, rr = .05 + (i % 6) * .045; const s = sph(pap, Math.cos(a) * rr, .1 + (i % 3) * .03, Math.sin(a) * rr, .07, .05, .06); s.rotation.y = a; root.add(s); }
    return { root };
  }
  // Kacheln (Infografik)
  function tileTex(word, col, fs) { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = col; c.beginPath(); c.roundRect(0, 0, w, h, 60); c.fill(); c.fillStyle = "#fff"; c.font = `900 ${fs || 92}px "Montserrat"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(word, w / 2, h / 2 + 4); }); }
  function tile(word, col, fs) { const grp = new T.Group(); grp.add(mesh(BOX, M(new T.Color(col).multiplyScalar(.7).getHex(), { roughness: .4 }), 0, 0, -.06, 1.6, .8, .12));
    const f = new T.Mesh(new T.PlaneGeometry(1.6, .8), new T.MeshStandardMaterial({ map: tileTex(word, col, fs), roughness: .4 })); f.position.z = .001; grp.add(f); grp.traverse((m) => { m.castShadow = false; }); return grp; }
  function makeTiles() { const root = new T.Group(); const list = [tile("NO WATER", "#2f6fd0", 70), tile("NO HIDING", "#7a5cff", 70), tile("NO EXIT", "#e5484d", 100)]; list.forEach((x) => root.add(x)); return { root, list }; }
  // Laufstrecke auf dem Sockel (gestrichelter Ring)
  function makeRoute() { const root = new T.Group(); const m = M(0xffd23f, { emissive: 0xffb000, emissiveIntensity: .4 });
    for (let i = 0; i < 24; i++) { const a = i / 24 * 2 * PI; const d = mesh(BOX, m, Math.cos(a) * 1.15, .02, Math.sin(a) * 1.15, .12, .02, .05); d.rotation.y = -a + PI / 2; d.castShadow = false; root.add(d); } return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; ham = actor(makeHamster(), "Hamster"); ham2 = actor(makeHamster(), "Hamster gross");
    ball = actor(makeBall(.5, 0x8fd3ff), "Hamsterball"); bigBall = actor(makeBall(1.3, 0xff9fd0), "Riesenball");
    table = actor(makeTable(), "Tisch"); pillows = actor(makePillows(), "Kissen"); wheel = actor(makeWheel(), "Laufrad"); bed = actor(makeBed(), "Ballbett");
    tiles = actor(makeTiles(), "Kacheln"); route = actor(makeRoute(), "Strecke");
    for (const a of [ball, bigBall, pillows, tiles, route, bed, table, wheel]) a.noCheck = true;
    room = makeRoom(); roomBg = new T.Color(0xdff0e6).convertSRGBToLinear();
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function inRoom() { begin("yard"); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xdff0e6, 16, 40); K3.hemi.intensity = .8; }
  function studio() { begin("studio"); room.visible = false; }
  // Hamster im Ball: Ball an (x, z), gerollte Strecke dist (dreht den Ball), Hamster läuft innen aufrecht
  function hamBall(B, Hm, x, z, ry, dist, t, o) {
    B.root.visible = true; B.root.position.set(x, 0, z); B.root.rotation.set(0, ry, 0); B.spin.rotation.z = -dist / B.R;
    Hm.root.visible = true; const s = (o && o.sc) || 1; Hm.root.position.set(x, .045 * s, z); Hm.root.rotation.set(0, ry, (o && o.roll) || 0);
    poseHam(Hm, t, o);
  }
  const TABLE = { x: 1.9, z: -.5 };
  function hookFrame(lt, d, t, loop) { // Hamster rollt im Ball auf den Tisch zu und knallt ans Tischbein
    place(table, TABLE.x, TABLE.z, 0);
    const ph = lt / d, hitT = loop ? 9 : .55; const p = Math.min(ph / hitT, 1);
    const x0 = -.2, xHit = TABLE.x - .42 - .43; let x = loop ? lerp(x0 - .9, x0, ph) : lerp(x0, xHit, p), bump = 0;
    if (ph > hitT) { const b = (ph - hitT) / (1 - hitT); bump = Math.sin(clamp(b * 3, 0, 1) * PI) * .18 + sm(clamp(b * 3, 0, 1)) * .12; x = xHit - bump; table.top.rotation.z = Math.sin(b * 30) * .04 * (1 - b); }
    else table.top.rotation.z = 0;
    hamBall(ball, ham, x, TABLE.z, 0, x - x0, t, { run: ph > hitT ? 0 : 1, dizzy: ph > hitT + .05, lid: ph > hitT ? .35 : undefined });
    return ph > hitT;
  }

  // ---------- Shots ----------
  // 0 Hook: Ball rollt, BONK ans Tischbein, Schwindel-Sternchen
  KZ.shot("hHook", (lt, d, t) => { inRoom(); const k = sm(lt / d); const hit = hookFrame(lt, d, t, false);
    frameOn([ball], { az: lerp(.42, .3, k), el: .16, fill: lerp(.95, 1.05, k), t }); draw();
    if (!hit) stamp("CUTE?", W * .42, H * .34, (lt - .3) / .3, "#ff5d8f", -.06);
    else stamp("BONK!", W * .42, H * .34, (lt / d - .55) * d / .25, "#e5484d", .07); });
  // 1 Studio: großer Hamster im Ball, Nase/Schnurrhaare an der Plastikwand
  KZ.shot("hBlind", (lt, d, t) => { studio(); const k = sm(lt / d);
    hamBall(ball, ham2, 0, 0, -1.2, Math.sin(t * 1.5) * .05, t, { lid: .55, look: Math.sin(t * 2) * .25, nod: -.05 });
    frameOn([ball], { az: lerp(.25, .1, k), el: .1, fill: lerp(1.0, 1.15, k), t }); draw();
    if (lt < d * .45) stamp("NEARLY BLIND", W * .42, H * .2, (lt - .2) / .3, "#7a5cff", -.06);
    else stamp("NOSE BLOCKED", W * .42, H * .2, (lt - d * .45) / .3, "#e5484d", .06); });
  // 2 Kissen: Rudi wirft Kissen, Schnitt: Hamster erstarrt im Ball zwischen Kissen
  KZ.shot("hPillows", (lt, d, t) => { inRoom(); const half = lt > d * .5, C = { x: .5, z: -.3 };
    place(pillows, C.x, C.z, 0); const up = clamp(lt / (d * .45), 0, 1);
    pillows.list.forEach((p, i) => { const q = half ? 1 : clamp(up * 10 - i, 0, 1); p.visible = q > 0; p.position.copy(p.home); p.position.y = p.home.y + (1 - q) * 1.2; p.scale.set(.32, .2, .26).multiplyScalar(Math.max(.001, easeBack(q))); });
    if (!half) { const k = sm(lt / (d * .5));
      place(rudi, -1.2, .1, -.3); poseRudi(rudi, t, { arms: [1.6 + Math.sin(t * 9) * .4, .3], spread: .15, mouth: "smile" });
      hamBall(ball, ham, C.x, C.z, -.6, 0, t, { run: .3 });
      frameOn([rudi, pillows], { az: lerp(.45, .38, k), el: .2, fill: lerp(.95, 1.02, k), t }); draw();
      stamp("PILLOWS!", W * .42, H * .17, (lt - .2) / .3, "#ff9f43", -.06); }
    else { const k = sm((lt - d * .5) / (d * .5)); rudi.root.visible = false;
      hamBall(ball, ham, C.x, C.z, -.6, 0, t, { run: 0, lid: 0, puff: .2, nod: Math.sin(t * 40) * .02 });
      frameOn([ball], { az: lerp(.3, .2, k), el: .3, fill: lerp(.9, 1.0, k), t }); draw();
      stamp("FROZEN", W * .42, H * .17, (lt - d * .55) / .3, "#2f6fd0", .06); } });
  // 3 Riesenball: Rudi steigt ein und läuft los, Schnitt: BONK an den Tisch
  KZ.shot("hGiant", (lt, d, t) => { inRoom(); const half = lt > d * .48; place(table, 2.6, -.8, 0);
    if (!half) { const k = sm(lt / (d * .48)), x = lerp(-1.6, -.9, k); table.root.visible = false;
      place(bigBall, x, -.6, 0); bigBall.spin.rotation.z = -(x + 1.6) / 1.3; place(rudi, x, -.6, -.35); poseRudi(rudi, t, { walk: 1, arms: [.5, .5], spread: .5, mouth: "smile" });
      frameOn([bigBall], { az: lerp(.4, .34, k), el: .14, fill: lerp(1.05, 1.15, k), t }); draw();
      stamp("FUN!", W * .42, H * .17, (lt - .25) / .3, "#ff5d8f", -.06); }
    else { const ph = (lt - d * .48) / (d * .52), hit = .5, xHit = 2.6 - .42 - 1.19;
      let x = lerp(-.4, xHit, Math.min(ph / hit, 1)); let lean = 0;
      if (ph > hit) { const b = (ph - hit) / (1 - hit); x = xHit - Math.sin(clamp(b * 2.5, 0, 1) * PI) * .3 - sm(clamp(b * 2.5, 0, 1)) * .15; table.top.rotation.z = Math.sin(b * 28) * .05 * (1 - b); lean = .25 * Math.sin(clamp(b * 2.5, 0, 1) * PI); } else table.top.rotation.z = 0;
      place(bigBall, x, -.6, 0); bigBall.spin.rotation.z = -(x + 1.6) / 1.3; place(rudi, x, -.6, -.35);
      poseRudi(rudi, t, { walk: ph > hit ? 0 : 1, arms: [.5, .5], spread: ph > hit ? 1.2 : .5, mouth: ph > hit ? "o" : "smile", lean, wide: ph > hit });
      frameOn([bigBall, table], { az: lerp(.4, .3, ph), el: .14, fill: 1.0, t }); draw();
      if (ph > hit) stamp("BONK!", W * .42, H * .17, (ph - hit) * d * .52 / .25, "#e5484d", .07); } });
  // 4 Studio: Hamster im Ball, drei Kacheln KEIN WASSER / KEIN VERSTECK / KEIN AUSGANG
  KZ.shot("hNoExit", (lt, d, t) => { studio(); const k = sm(lt / d), ph = lt / d;
    hamBall(ball, ham2, 0, .2, -1.0, Math.sin(t * 2) * .1, t, { run: .4, look: Math.sin(t * 2.5) * .3 });
    place(tiles, 0, -.2, 0); const starts = [.0, .28, .62];
    tiles.list.forEach((tl, i) => { const p = clamp((ph - starts[i]) / .1, 0, 1); tl.visible = p > 0; tl.position.set(0, 1.0 + (2 - i) * .55, 0); tl.scale.setScalar(Math.max(.001, easeBack(p)) * .5); tl.rotation.y = (1 - p) * 1.4; });
    frameOn([ball, tiles], { az: lerp(.16, .06, k), el: .12, fill: lerp(.8, .88, k), t }); draw(); });
  // 5 Studio: Hamster rennt im Kreis über den Sockel, Zähler 0 → 5 MILES
  KZ.shot("hMiles", (lt, d, t) => { studio(); const k = sm(lt / d);
    place(route, 0, 0, 0); const a = -lt * 1.6; ham2.root.visible = true; ham2.root.position.set(Math.cos(a) * 1.15, 0, Math.sin(a) * 1.15); ham2.root.rotation.set(0, -a - PI / 2 + PI, 0); poseHam(ham2, t, { run: 1, sc: 1.4 });
    frameOn([route, ham2], { az: lerp(.1, .02, k), el: lerp(.55, .48, k), fill: lerp(.82, .9, k), dy: -.2, t }); draw();
    const n = Math.min(5, sm(lt / (d * .75)) * 5);
    txt(n.toFixed(1), W * .42, H * .2, 170, "#ffd23f", { stroke: 14, w: 900 });
    txt("MILES A NIGHT", W * .42, H * .29, 58, "#ffffff", { stroke: 10, a: clamp(lt / .3, 0, 1) }); });
  // 6 Wohnzimmer: Hamster im Ball, Quellenkarte RSPCA mit echtem Zitat
  KZ.shot("hSource", (lt, d, t) => { inRoom(); const k = sm(lt / d);
    hamBall(ball, ham, .4, -.3, -.5, lt * .3, t, { run: .6, look: .2 });
    frameOn([ball], { az: lerp(.35, .25, k), el: .22, fill: lerp(.85, .95, k), dy: .1, t }); draw();
    const cp = sm((lt - .15) / .3); if (card(W * .42, H * .22, 860, 230, cp, "RSPCA", "#2f6fd0")) {
      txt("“the RSPCA does not", W * .42, H * .22 + 20, 40, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("recommend their use”", W * .42, H * .22 + 72, 40, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 7 Pointe: Rudi steckt im Riesenball und kratzt sich am Kopf
  KZ.shot("hOverkill", (lt, d, t) => { inRoom(); const k = sm(lt / d);
    place(bigBall, .2, -.6, 0); bigBall.spin.rotation.z = .3 + Math.sin(t * 1.2) * .05; place(rudi, .2, -.6, -.4); poseRudi(rudi, t, { arms: [2.75, .2], spread: .1, mouth: "o", tilt: -.12 });
    frameOn([bigBall], { az: lerp(.36, .28, k), el: .12, fill: lerp(1.1, 1.2, k), t }); draw();
    if (lt > d * .3) stamp("OVERKILL", W * .42, H * .17, (lt - d * .3) / .3, "#7a5cff", .06); });
  // 8 Tipp: großes Laufrad, Schnitt: Hamster springt ab und trinkt
  KZ.shot("hWheel", (lt, d, t) => { inRoom(); const half = lt > d * .55; place(wheel, .2, -.6, 0);
    if (!half) { const k = sm(lt / (d * .55)); wheel.spin.rotation.z = -lt * 6;
      ham.root.visible = true; ham.root.position.set(.2, .07, -.6); ham.root.rotation.set(0, 0, 0); poseHam(ham, t, { run: 1 });
      frameOn([wheel], { az: lerp(.3, .22, k), el: .14, fill: lerp(.8, .86, k), t }); draw();
      stamp("30 CM+", W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06); }
    else { const k = sm((lt - d * .55) / (d * .45)), j = sm(clamp(k * 2.5, 0, 1)); wheel.spin.rotation.z = -d * .55 * 6 - (1 - Math.exp(-k * 3)) * .8;
      ham.root.visible = true; ham.root.position.set(lerp(.2, .95, j), .07 * (1 - j) + Math.sin(j * PI) * .25, lerp(-.6, -.6, j)); ham.root.rotation.set(0, 0, 0);
      poseHam(ham, t, { run: j < 1 ? 1 : 0, up: j >= 1 ? .45 : 0, lid: j >= 1 ? .5 : undefined });
      frameOn([wheel], { az: lerp(.22, .14, k), el: .14, fill: .86, t }); draw();
      stamp("HOP OFF", W * .42, H * .17, (lt - d * .58) / .3, "#2f6fd0", .06); } });
  // 9 Bett: offene Ballhälfte mit Einstreu, Hamster schläft
  KZ.shot("hBed", (lt, d, t) => { inRoom(); const k = sm(lt / d);
    place(bed, .3, -.4, 0); ham.root.visible = true; ham.root.position.set(.3, .11, -.4); ham.root.rotation.set(0, -.6, 0); poseHam(ham, t, { lid: 1, nod: -.15, sc: .9 });
    ham.body.position.y += Math.sin(t * 2.5) * .006;
    frameOn([bed], { az: lerp(.35, .25, k), el: lerp(.45, .38, k), fill: lerp(.9, 1.0, k), t }); draw();
    stamp("COZY BED", W * .42, H * .17, (lt - d * .3) / .3, "#ff9f43", -.06);
    const z = (lt * .8) % 1; txt("z", W * (.5 + z * .08), H * (.27 - z * .06), 60 + z * 30, "#ffffff", { stroke: 8, a: Math.sin(z * PI) }); });
  // 10 Loop: zurück in die Hook-Einstellung (Ball rollt auf den Tisch zu)
  KZ.shot("hLoop", (lt, d, t) => { inRoom(); const k = sm(lt / d); hookFrame(lt, d, t, true);
    frameOn([ball], { az: lerp(.34, .42, k), el: .16, fill: lerp(.9, .95, k), t }); draw();
    if (lt > d * .3) stamp("HATES IT?", W * .42, H * .34, (lt - d * .3) / .3, "#7a5cff", -.06); });

  window.__hamster3d = true;
})();
