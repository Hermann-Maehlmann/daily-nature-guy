// 3D-Szene "Why Your Cat Walks Away When You Stare" (17.11.2026). Hauskatze (rot getigert), Wohnzimmer, Slow Blink (Univ. of Sussex 2020).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let cat, rudi, room, roomBg, tower, tiles, bars, hearts, bigCat;

  // ---------- Hauskatze (eigener Entwurf: rot getigert, cremefarbene Brust/Schnauze, grüne Augen mit Schlitzpupille) ----------
  let FUR_TEX = null;
  function furTex() { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = "#f0a04b"; c.fillRect(0, 0, w, h);
    c.fillStyle = "#c86f25"; for (let i = 0; i < 14; i++) { const x = i * w / 14 + 8; c.beginPath(); c.moveTo(x, h * .12); c.quadraticCurveTo(x + 14, h * .5, x - 4, h * .88); c.lineTo(x + 9, h * .88); c.quadraticCurveTo(x + 26, h * .5, x + 10, h * .12); c.fill(); } }); }
  function makeCat() {
    if (!FUR_TEX) FUR_TEX = furTex();
    const furT = new T.MeshStandardMaterial({ map: FUR_TEX, roughness: .75 }), fur = M(0xf0a04b, { roughness: .75 }), cream = M(0xfff0d8, { roughness: .8 }), pink = M(0xff9aa8, { roughness: .5 });
    const iris = M(0x9ed040, { roughness: .15 }), pupil = M(0x101010, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), dark = M(0x3a1a1a);
    const root = new T.Group();
    // Sitzend
    const sit = new T.Group(); root.add(sit);
    const sb = sph(furT, 0, .32, 0, .25, .33, .23); sb.rotation.z = -.18; sit.add(sb);
    sit.add(sph(cream, .15, .38, 0, .13, .2, .15));
    for (const s of [-1, 1]) { sit.add(sph(furT, -.06, .15, s * .15, .21, .16, .12));
      const fl = limb(.05, .3, fur); fl.position.set(.16, .32, s * .085); fl.add(sph(cream, .03, -.31, 0, .07, .045, .065)); sit.add(fl);
      sit.add(sph(cream, .11, .035, s * .2, .08, .04, .06)); }
    const tc = new T.CatmullRomCurve3([V(-.22, .06, 0), V(-.34, .04, .14), V(-.22, .04, .3), V(.04, .04, .32), V(.16, .05, .25)]);
    const tailC = mesh(new T.TubeGeometry(tc, 40, .045, 12, false), fur); sit.add(tailC); sit.add(sph(fur, .16, .05, .25, .045));
    // Stehend / gehend
    const stand = new T.Group(); root.add(stand);
    stand.add(sph(furT, 0, .42, 0, .36, .19, .18)); stand.add(sph(cream, .2, .4, 0, .14, .14, .13));
    const sLegs = []; for (const [x, s] of [[.22, -1], [.22, 1], [-.22, -1], [-.22, 1]]) { const l = limb(.05, .37, fur); l.position.set(x, .4, s * .09); l.add(sph(cream, .03, -.38, 0, .065, .04, .06)); stand.add(l); sLegs.push(l); }
    const tu = new T.CatmullRomCurve3([V(-.32, .45, 0), V(-.44, .65, 0), V(-.45, .88, 0), V(-.36, 1.0, 0)]);
    const tailU = mesh(new T.TubeGeometry(tu, 30, .045, 12, false), fur); stand.add(tailU); stand.add(sph(fur, -.36, 1.0, 0, .045));
    // Kopf
    const head = new T.Group(); root.add(head);
    head.add(sph(furT, 0, 0, 0, .23, .2, .22));
    for (const s of [-1, 1]) head.add(sph(fur, .05, -.06, s * .1, .13, .11, .12));
    head.add(sph(cream, .17, -.075, 0, .09, .07, .12));
    head.add(sph(pink, .255, -.035, 0, .03, .022, .035));
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.02, .14, s * .12); head.add(e);
      const outer = mesh(new T.ConeGeometry(.085, .18, 24), fur, 0, .08, 0); e.add(outer); const inner = mesh(new T.ConeGeometry(.055, .12, 24), pink, .03, .06, 0); e.add(inner);
      e.rotation.x = s * .32; ears.push(e); }
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.165, .035, s * .095); head.add(e);
      e.add(sph(iris, 0, 0, 0, .064, .07, .058)); const p = sph(pupil, .05, 0, 0, .014, .052, .022); e.add(p); e.add(sph(hl, .06, .03, -.012 * s, .013)); p.base = p.scale.clone(); e.pupil = p; eyes.push(e); }
    const wh = M(0xffffff, { roughness: .4 });
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .2, -.07 + i * .025, s * .2, .005, .2, .005); w.rotation.x = s * (PI / 2 - .25 + i * .18); head.add(w); }
    const hiss = sph(dark, .21, -.13, 0, .04, .03, .05); head.add(hiss);
    const mouth = mesh(new T.TorusGeometry(.03, .007, 8, 16, PI), M(0x5a2a20), .245, -.1, 0); mouth.rotation.set(0, PI / 2, PI); head.add(mouth);
    return { root, sit, stand, sLegs, tailC, tailU, head, ears, eyes, hiss, mouth };
  }
  // o: {stand, walk, ears: 0 (aufrecht)..1 (angelegt), lid: 0 (offen)..1 (zu), wide, hiss, look, tilt, puff}
  function poseCat(C, t, o) {
    o = o || {};
    const st = !!o.stand; C.sit.visible = !st; C.stand.visible = st;
    if (st) { C.head.position.set(.4, .62 + Math.abs(Math.sin(t * 7)) * .02 * (o.walk || 0), 0); C.sLegs.forEach((l, i) => l.rotation.z = Math.sin(t * 9 + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .45 * (o.walk || 0)); C.tailU.rotation.x = Math.sin(t * 3) * .08; }
    else { C.head.position.set(.13, .73 + Math.sin(t * 2) * .006, 0); }
    C.head.rotation.set(o.tilt || 0, o.look || 0, (o.nod || 0) + Math.sin(t * 1.5) * .025);
    const ea = o.ears || 0; C.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.x = s * (.32 + ea * .9); e.rotation.z = ea * .5; });
    let lid = o.lid ?? (Math.sin(t * 1.3 + 1) > .985 ? .85 : 0);
    C.eyes.forEach((e) => { e.scale.set(1, Math.max(.08, (1 - lid)) * (o.wide ? 1.15 : 1), 1); e.pupil.scale.copy(e.pupil.base); if (o.wide) e.pupil.scale.z *= 2.4; });
    C.hiss.visible = !!o.hiss; C.mouth.visible = !o.hiss;
    C.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Wohnzimmer (eigene Welt) ----------
  function makeRoom() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(512, 512, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = ["#c8935e", "#bd8752", "#d29d68", "#c28c58"][i % 4]; c.fillRect(0, i * h / 8, w, h / 8); c.fillStyle = "rgba(90,50,20,.35)"; c.fillRect(0, i * h / 8, w, 3); c.fillRect((i * 173) % w, i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(6, 6);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    const wallTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#f6e3c4"; c.fillRect(0, 0, w, h); c.fillStyle = "#efd6b0"; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h); });
    wallTex.wrapS = wallTex.wrapT = T.RepeatWrapping; wallTex.repeat.set(10, 3);
    const wall = mesh(BOX, new T.MeshStandardMaterial({ map: wallTex, roughness: .9 }), 0, 2.5, -3, 30, 5, .2); r.add(wall);
    r.add(mesh(BOX, M(0xffffff), 0, .08, -2.88, 30, .16, .06));
    // Fenster mit Himmel
    const sky = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(1, "#cdeeff"); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = "#ffffff"; c.beginPath(); c.arc(70, 90, 26, 0, 7); c.arc(100, 80, 32, 0, 7); c.arc(130, 92, 24, 0, 7); c.fill(); });
    const win = new T.Mesh(new T.PlaneGeometry(1.6, 1.4), new T.MeshStandardMaterial({ map: sky, emissive: 0xffffff, emissiveMap: sky, emissiveIntensity: .5 })); win.position.set(-2.4, 2.3, -2.89); r.add(win);
    const fr = M(0xffffff, { roughness: .5 }); for (const [x, y, sx, sy] of [[-2.4, 3.03, 1.75, .08], [-2.4, 1.57, 1.75, .08], [-3.24, 2.3, .08, 1.5], [-1.56, 2.3, .08, 1.5], [-2.4, 2.3, .05, 1.4], [-2.4, 2.3, 1.6, .05]]) r.add(mesh(BOX, fr, x, y, -2.87, sx, sy, .06));
    // Bild an der Wand
    const pic = canvasTex(256, 200, (c, w, h) => { c.fillStyle = "#ffd23f"; c.fillRect(0, 0, w, h); c.fillStyle = "#ff6b8a"; c.beginPath(); c.arc(90, 110, 50, 0, 7); c.fill(); c.fillStyle = "#2f6fd0"; c.beginPath(); c.arc(170, 80, 36, 0, 7); c.fill(); });
    r.add(mesh(BOX, M(0x5a3a2a), 1.9, 2.5, -2.88, 1.0, .8, .04)); const pm = new T.Mesh(new T.PlaneGeometry(.88, .68), new T.MeshStandardMaterial({ map: pic })); pm.position.set(1.9, 2.5, -2.85); r.add(pm);
    // Teppich
    const rug = new T.Mesh(new T.CircleGeometry(1.8, 48), M(0xb84a5e, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(.2, .006, -.2); rug.scale.set(1.3, .8, 1); rug.receiveShadow = true; r.add(rug);
    const rug2 = new T.Mesh(new T.RingGeometry(1.45, 1.6, 48), M(0xffd23f, { roughness: 1 })); rug2.rotation.x = -PI / 2; rug2.position.set(.2, .008, -.2); rug2.scale.set(1.3, .8, 1); r.add(rug2);
    // Sofa (Sitzfläche y = .5)
    const sofa = new T.Group(); sofa.position.set(.6, 0, -1.9); r.add(sofa);
    const teal = M(0x2f8f9d, { roughness: .8 }), tealD = M(0x257480, { roughness: .85 });
    sofa.add(mesh(BOX, tealD, 0, .22, 0, 2.4, .36, .95));
    for (const x of [-.55, .55]) sofa.add(mesh(BOX, teal, x, .45, .04, 1.08, .14, .86));
    sofa.add(mesh(BOX, teal, 0, .85, -.38, 2.4, .8, .24));
    for (const x of [-1.27, 1.27]) sofa.add(mesh(BOX, teal, x, .5, 0, .2, .62, .95));
    for (const x of [-.95, .95]) sofa.add(sph(M(0xffd23f, { roughness: .8 }), x, .7, -.18, .2, .2, .07));
    for (const [x, z] of [[-1.1, .4], [1.1, .4], [-1.1, -.4], [1.1, -.4]]) sofa.add(mesh(CYL, M(0x5a3a2a), x, .02, z, .05, .06, .05));
    // Pflanze
    const pl = new T.Group(); pl.position.set(-1.6, 0, -2.3); r.add(pl); pl.add(mesh(new T.CylinderGeometry(.25, .18, .45, 24), M(0xe0703c), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const a = i / 7 * 2 * PI; const lf = sph(M(i % 2 ? 0x4fae4a : 0x3f9a3c), Math.cos(a) * .2, .75 + (i % 3) * .1, Math.sin(a) * .2, .1, .35, .05); lf.rotation.set(Math.sin(a) * .5, -a, Math.cos(a) * .5); pl.add(lf); }
    return r;
  }
  const SOFA = { x: .6, z: -1.9, seat: .52 };

  // ---------- Thunfisch-Turm ----------
  function makeTower() {
    const lab = canvasTex(512, 128, (c, w, h) => { c.fillStyle = "#2f6fd0"; c.fillRect(0, 0, w, h); c.fillStyle = "#ffd23f"; c.fillRect(0, 10, w, 8); c.fillRect(0, h - 18, w, 8); c.fillStyle = "#fff"; c.font = '900 64px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; for (const x of [w / 4, w * 3 / 4]) c.fillText("TUNA", x, h / 2 + 3); });
    const side = new T.MeshStandardMaterial({ map: lab, roughness: .45 }), lid = M(0xc5ced8, { metalness: .85, roughness: .3 });
    const root = new T.Group(); const cans = [];
    const geo = new T.CylinderGeometry(.17, .17, .22, 32);
    const pos = [[-.36, 0], [0, 0], [.36, 0], [-.18, 1], [.18, 1], [0, 2]];
    for (const [x, row] of pos) { const c = new T.Mesh(geo, [side, lid, lid]); c.castShadow = c.receiveShadow = true; c.position.set(x, .11 + row * .225, 0); root.add(c); cans.push(c); }
    const open = new T.Group(); open.add(mesh(new T.CylinderGeometry(.17, .17, .1, 32), lid, 0, .05, 0)); open.add(mesh(new T.CylinderGeometry(.15, .15, .02, 32), M(0xf2b8a0), 0, .1, 0)); root.add(open);
    return { root, cans, open };
  }
  // ---------- Kacheln, Balken, Herzen, großer Katzenkopf ----------
  function tileTex(word, col, fs) { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = col; c.beginPath(); c.roundRect(0, 0, w, h, 60); c.fill(); c.fillStyle = "#fff"; c.font = `900 ${fs || 92}px "Montserrat"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(word, w / 2, h / 2 + 4); }); }
  function tile(word, col, fs) { const grp = new T.Group(); grp.add(mesh(BOX, M(new T.Color(col).multiplyScalar(.7).getHex(), { roughness: .4 }), 0, 0, -.06, 1.6, .8, .12));
    const f = new T.Mesh(new T.PlaneGeometry(1.6, .8), new T.MeshStandardMaterial({ map: tileTex(word, col, fs), roughness: .4 })); f.position.z = .001; grp.add(f); grp.traverse((m) => { m.castShadow = false; }); return grp; }
  function makeTiles() { const root = new T.Group(); const a = tile("21 CATS", "#2f6fd0", 110), b = tile("BLINKED BACK", "#36b37e", 54); root.add(a); root.add(b); return { root, list: [a, b] }; }
  function makeBars() { const root = new T.Group(); const list = [];
    for (const [x, col, lab, val] of [[-.62, 0x8a93b8, "NEUTRAL FACE", "LESS"], [.62, 0x36b37e, "SLOW BLINK", "MORE"]]) {
      const grp = new T.Group(); grp.position.x = x; root.add(grp);
      const bar = mesh(BOX, M(col, { roughness: .35 }), 0, .5, 0, .64, 1, .64); grp.add(bar);
      const lt = tile(lab, "#1d2250", 62); lt.scale.setScalar(.6); lt.position.set(0, .26, .4); grp.add(lt);
      const vt = tile(val, "#" + new T.Color(col).getHexString(), 110); vt.scale.setScalar(.4); grp.add(vt);
      list.push({ grp, bar, vt }); }
    return { root, list }; }
  function heartGeo() { const s = new T.Shape(); s.moveTo(0, -.5); s.bezierCurveTo(-.9, .1, -.5, .75, 0, .35); s.bezierCurveTo(.5, .75, .9, .1, 0, -.5);
    const geo = new T.ExtrudeGeometry(s, { depth: .18, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 4, curveSegments: 20 }); geo.center(); return geo; }
  function makeHearts() { const root = new T.Group(); const geo = heartGeo(), m = M(0xff4d6d, { roughness: .3 }); const list = [];
    for (let i = 0; i < 4; i++) { const h = mesh(geo, m); h.castShadow = false; h.scale.setScalar(.12); root.add(h); list.push(h); } return { root, list }; }

  K3.onBuild(() => {
    rudi = K3.rudi; cat = actor(makeCat(), "Katze"); bigCat = actor(makeCat(), "Katze gross");
    tower = actor(makeTower(), "Thunfisch-Turm"); tiles = actor(makeTiles(), "Kacheln"); bars = actor(makeBars(), "Balken"); hearts = actor(makeHearts(), "Herzen");
    for (const a of [tiles, bars, hearts]) a.noCheck = true;
    room = makeRoom();
    roomBg = new T.Color(0xf6e3c4).convertSRGBToLinear();
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function inRoom() { begin("yard"); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xf6e3c4, 16, 40); K3.hemi.intensity = .8; }
  function studio() { begin("studio"); room.visible = false; }
  // Katze sitzt auf dem Sofa (dx: Position auf der Sitzfläche)
  function catOnSofa(dx, ry, sc) { cat.root.visible = true; cat.root.position.set(SOFA.x + dx, SOFA.seat, SOFA.z + .12); cat.root.rotation.set(0, ry, 0); }
  // Blickrichtung: Figur schaut nach +x; ry = -a dreht sie zur Kamera hin
  const RUDI_X = -.35, RUDI_Z = -.75;
  function rudiStare(t, o) { place(rudi, RUDI_X, RUDI_Z, -.35); poseRudi(rudi, t, Object.assign({ arms: [.15, .15], spread: .12, mouth: "smile" }, o || {})); }
  function rudiLid(v) { rudi.eyes.forEach((e) => e.scale.y = Math.max(.08, 1 - v)); }
  function rudiGrin(k) { rudi.smile.scale.set(1 + k * .9, 1 + k * .9, 1 + k * .4); }

  // ---------- Shots ----------
  // 0 Hook: Rudi starrt verliebt, Katze legt die Ohren an und springt vom Sofa weg
  KZ.shot("cHook", (lt, d, t) => { inRoom(); const k = sm(lt / d), go = clamp((lt - d * .55) / (d * .45), 0, 1);
    rudiStare(t, { wide: true, lean: .05 + .06 * k }); rudiGrin(.3);
    if (go <= 0) { catOnSofa(-.35, -2.55); poseCat(cat, t, { ears: sm(lt / (d * .45)), wide: true, look: .1 }); }
    else { cat.root.visible = true; cat.root.rotation.set(0, -.25, 0); cat.root.position.set(SOFA.x - .2 + go * 1.3, SOFA.seat * (1 - sm(go * 2)) + Math.sin(clamp(go * 2, 0, 1) * PI) * .25, SOFA.z + .3 + go * .2); poseCat(cat, t, { stand: true, walk: 1, ears: .6 }); }
    frameOn([rudi, cat], { az: lerp(.42, .32, k), el: .12, fill: lerp(.84, .92, k), t }); draw();
    if (lt > d * .2 && go <= 0) stamp("♥ STARE ♥", W * .42, H * .3, (lt - d * .2) / .3, "#ff5d8f", -.06);
    if (go > .05) stamp("NOPE", W * .42, H * .3, go / .25, "#e5484d", .07); });
  // 1 Nahaufnahme Katze: Starren = Drohung, Ohren angelegt, Fauchen
  KZ.shot("cThreat", (lt, d, t) => { inRoom(); const k = sm(lt / d), p = sm((lt - d * .4) / (d * .25));
    catOnSofa(0, -1.25); poseCat(cat, t, { ears: .4 + .6 * p, wide: true, hiss: p > .5, nod: -.06 * p, lid: 0 });
    rudi.root.visible = false;
    frameOn([cat], { az: lerp(.25, .12, k), el: .1, fill: lerp(.58, .7, k), dy: .15, t }); draw();
    if (lt < d * .45) stamp("LOVE?", W * .42, H * .17, (lt - .2) / .3, "#ff5d8f", -.06);
    else stamp("THREAT!", W * .42, H * .17, (lt - d * .45) / .3, "#e5484d", .06); });
  // 2 Riesen-Grinsen, Schnitt: Katze versteckt sich hinter dem Sofa, nur Ohren/Augen schauen hervor
  KZ.shot("cSmile", (lt, d, t) => { inRoom(); const half = lt > d * .5;
    if (!half) { const k = sm(lt / (d * .5)); rudiStare(t, { lean: .12 * k, arms: [.4, .4], spread: .3, wide: true }); rudiGrin(k);
      catOnSofa(-.35, -2.55); poseCat(cat, t, { ears: .7, wide: true });
      frameOn([rudi, cat], { az: lerp(.4, .34, k), el: .12, fill: lerp(.86, .92, k), t }); draw();
      stamp("BIG SMILE", W * .42, H * .17, (lt - d * .12) / .3, "#ffb020", -.06); }
    else { const k = sm((lt - d * .5) / (d * .5)); rudi.root.visible = false;
      // Katze hinter der Sofalehne: Kopf schaut über die Lehne (Lehne oben y = 1.25)
      cat.root.visible = true; cat.root.position.set(SOFA.x + .5, .55, SOFA.z - .72); cat.root.rotation.set(0, -1.35, 0); poseCat(cat, t, { ears: .9, wide: true, look: .15, lid: 0 });
      cat.sit.visible = false; cat.head.position.y = .72 + .12 * sm((lt - d * .6) / (d * .2));
      frameOn([cat], { az: lerp(.2, .1, k), el: .16, fill: .5, dy: .25, t }); draw();
      stamp("HIDING", W * .42, H * .17, (lt - d * .58) / .3, "#7a5cff", .06); } });
  // 3 Thunfisch-Turm: Rudi präsentiert, Schnitt: leere Dose, Katze geht mit erhobenem Schwanz weg
  KZ.shot("cTuna", (lt, d, t) => { inRoom(); const half = lt > d * .5;
    place(tower, .55, -.3, -.2);
    if (!half) { const k = sm(lt / (d * .5)), up = clamp(lt / (d * .3), 0, 1);
      tower.cans.forEach((c, i) => { const p = clamp(up * 6 - i, 0, 1); c.visible = p > 0; c.scale.setScalar(Math.max(.001, easeBack(p))); }); tower.open.visible = false;
      rudiStare(t, { arms: [.3, 1.0 + Math.sin(t * 5) * .08], spread: .15, wide: true }); rudiGrin(.4);
      cat.root.visible = false;
      frameOn([rudi, tower], { az: lerp(.4, .32, k), el: .14, fill: lerp(.84, .9, k), t }); draw();
      stamp("TUNA TOWER", W * .42, H * .17, (lt - d * .15) / .3, "#2f6fd0", -.06); }
    else { const k = sm((lt - d * .5) / (d * .5)), go = sm((lt - d * .68) / (d * .32));
      tower.cans.forEach((c, i) => { c.visible = i < 3; c.scale.setScalar(1); }); tower.open.visible = true; tower.open.position.set(.75, 0, .55);
      cat.root.visible = true; cat.root.position.set(lerp(2.05, 2.45, go), 0, lerp(.35, -.1, go)); cat.root.rotation.set(0, lerp(PI * .85, .35, clamp(go * 3, 0, 1)), 0);
      poseCat(cat, t, { stand: true, walk: go > 0 && go < 1 ? 1 : 0, look: go > 0 ? 0 : 0, nod: go > 0 ? 0 : -.25 });
      rudiStare(t, { arms: [.2, .2], spread: .4, mouth: "o", wide: true });
      frameOn([rudi, tower, cat], { az: lerp(.34, .28, k), el: .14, fill: lerp(.86, .9, k), t }); draw();
      if (go > .1) stamp("BYE", W * .42, H * .17, (go - .1) / .25, "#e5484d", .07); } });
  // 4 Studio: großer Katzenkopf macht den Slow Blink
  KZ.shot("cBlink", (lt, d, t) => { studio(); const k = sm(lt / d), ph = lt / d;
    const lid = ph < .35 ? 0 : ph < .6 ? sm((ph - .35) / .25) * .92 : ph < .78 ? .92 : .92 * (1 - sm((ph - .78) / .2));
    bigCat.root.visible = true; bigCat.root.position.set(0, 0, 0); bigCat.root.rotation.set(0, -1.35, 0); poseCat(bigCat, t, { lid, ears: 0 });
    frameOn([bigCat], { az: lerp(.2, .08, k), el: .08, fill: lerp(.62, .78, k), dy: .2, t }); draw();
    stamp("SLOW BLINK", W * .42, H * .17, (lt - d * .3) / .3, "#36b37e", -.06); });
  // 5 Wohnzimmer: Rudi blinzelt langsam, Katze blinzelt zurück, Kacheln 21 KATZEN / BLINZELN ZURÜCK
  KZ.shot("cStudy", (lt, d, t) => { inRoom(); const k = sm(lt / d), ph = lt / d;
    const rl = ph < .2 ? 0 : ph < .4 ? sm((ph - .2) / .2) * .9 : .9 * (1 - sm((ph - .4) / .15));
    const cl = ph < .5 ? 0 : ph < .68 ? sm((ph - .5) / .18) * .92 : .92 * (1 - sm((ph - .68) / .2));
    rudiStare(t, { arms: [.15, .15], spread: .12 }); rudiLid(rl);
    catOnSofa(-.35, -2.55); poseCat(cat, t, { lid: cl, ears: 0 });
    tiles.root.visible = true; tiles.root.position.set(-.2, 0, -1.3);
    tiles.list.forEach((tl, i) => { const p = clamp((ph - [.05, .55][i]) / .1, 0, 1); tl.visible = p > 0 && !(i === 0 && ph > .62); tl.position.set(0, 2.85, 0); tl.scale.setScalar(Math.max(.001, easeBack(p)) * .7); tl.rotation.y = (1 - p) * 1.4; });
    frameOn([rudi, cat], { az: lerp(.38, .3, k), el: .12, fill: lerp(.84, .9, k), t }); draw();
    const cp = sm((lt - .1) / .3); if (card(W * .42, H * .63, 820, 110, cp)) txt("University of Sussex · Scientific Reports, 2020", W * .42, H * .63, 32, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 6 Studio: Balken "kam näher" neutral vs. Slow Blink + Quellenkarte mit echtem Zitat
  KZ.shot("cStranger", (lt, d, t) => { studio(); const k = sm(lt / d);
    place(bars, 0, 0, 0); const hs = [.55, 1.45]; const g1 = sm((lt - .1) / .5), g2 = sm((lt - d * .3) / .5);
    bars.list.forEach((b, i) => { const h = hs[i] * Math.max(.02, i ? g2 : g1); b.bar.scale.y = h; b.bar.position.y = h / 2; b.vt.position.set(0, h + .3, 0); b.vt.visible = (i ? g2 : g1) > .3; });
    frameOn([bars], { az: lerp(.18, .06, k), el: .16, fill: lerp(.7, .76, k), dy: -.55, t }); draw();
    txt("WALKED UP", W * .42, H * .2, 72, "#ffffff", { stroke: 10, a: clamp(lt / .3, 0, 1) });
    const cp = sm((lt - d * .5) / .3); if (card(W * .42, H * .615, 880, 250, cp, "Prof. Karen McComb, Sussex", "#2f6fd0")) {
      txt("“Try narrowing your eyes at them", W * .42, H * .615 + 10, 36, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("as you would in a relaxed smile”", W * .42, H * .615 + 60, 36, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 7 Pointe: Rudi kratzt sich neben dem halben Turm am Kopf
  KZ.shot("cOverkill", (lt, d, t) => { inRoom(); const k = sm(lt / d);
    place(tower, .55, -.3, -.2); tower.cans.forEach((c, i) => { c.visible = true; c.scale.setScalar(1); }); tower.open.visible = false;
    cat.root.visible = false;
    rudiStare(t, { arms: [2.75, .2], spread: .1, mouth: "o", tilt: -.12 });
    frameOn([rudi, tower], { az: lerp(.36, .3, k), el: .12, fill: lerp(.84, .9, k), t }); draw();
    if (lt > d * .35) stamp("OVERKILL", W * .42, H * .17, (lt - d * .35) / .3, "#7a5cff", .06); });
  // 8 Tipp: Rudi blinzelt langsam, Katze blinzelt zurück und kommt zu ihm, Herzen
  KZ.shot("cTip", (lt, d, t) => { inRoom(); const k = sm(lt / d), ph = lt / d;
    const rl = ph < .12 ? 0 : ph < .3 ? sm((ph - .12) / .18) * .55 : ph < .45 ? .55 + sm((ph - .3) / .15) * .4 : ph < .62 ? .95 : .95 * (1 - sm((ph - .62) / .12));
    const cl = ph < .55 ? 0 : ph < .7 ? sm((ph - .55) / .15) * .9 : .9 * (1 - sm((ph - .7) / .12));
    rudiStare(t, { arms: [.15, .15], spread: .12 }); rudiLid(rl); rudiGrin(.2);
    const come = sm((ph - .8) / .2);
    if (come <= 0) { catOnSofa(-.35, -2.55); poseCat(cat, t, { lid: cl, ears: 0 }); }
    else { cat.root.visible = true; cat.root.position.set(lerp(SOFA.x + .05, .85, come), SOFA.seat * (1 - sm(clamp(come * 1.6, 0, 1))), lerp(SOFA.z + .45, -.05, come)); cat.root.rotation.set(0, lerp(-1.3, -2.2, come), 0); poseCat(cat, t, { stand: true, walk: 1, ears: 0 }); }
    hearts.root.visible = ph > .84; hearts.list.forEach((h, i) => { const p = clamp((ph - .84 - i * .03) / .14, 0, 1); h.visible = p > 0; h.position.set(.35 + i * .2, 1.0 + p * .6 + i * .08, -.15 + Math.sin(i) * .1); h.rotation.y = t * 2 + i; h.scale.setScalar(.12 * easeBack(p) + .001); });
    frameOn([rudi, cat], { az: lerp(.4, .32, k), el: .12, fill: lerp(.84, .9, k), t }); draw();
    if (ph < .45) stamp("NARROW", W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06);
    else stamp("2 SECONDS", W * .42, H * .17, (ph - .45) * d / .3, "#2f6fd0", .06); });
  // 9 Loop: zurück in die Hook-Einstellung (Rudi starrt, Katze auf dem Sofa)
  KZ.shot("cLoop", (lt, d, t) => { inRoom(); const k = sm(lt / d);
    rudiStare(t, { wide: true, lean: .05 * k }); rudiGrin(.3 * k);
    catOnSofa(-.35, -2.55); poseCat(cat, t, { ears: .3 * k, wide: true, look: .1 });
    frameOn([rudi, cat], { az: lerp(.5, .42, k), el: .12, fill: lerp(.8, .84, k), t }); draw();
    if (lt > d * .3) stamp("HATES ME?", W * .42, H * .17, (lt - d * .3) / .3, "#7a5cff", -.06); });

  window.__cat3d = true;
})();
