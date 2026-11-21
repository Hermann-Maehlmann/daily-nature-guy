// 3D-Szene "Why Your Cat's Belly Is A Trap" / "Warum der Bauch deiner Katze eine Falle ist" (21.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Opener-Stil "horror-trailer": Letterbox-Balken, rotes Gruselicht, Filmtitel "DIE BAUCHFALLE", drei Akte.
// Graue Tigerkatze neu gebaut (weißer Bauch/Brust/Pfoten, bernsteinfarbene Augen) mit Rückenlage-Pose (Bauch oben, Pfoten hoch, Krallen, Hasentritt).
// Kratzbaum, Ofenhandschuhe, Kraulmaschine "Kraul-O-Mat" (fliegt auseinander), Goldene Kralle (Pokal), Pflaster-Verband.
// Quellen: Cats Protection Behaviour Guide 2025 ("Many cats will do this as a greeting behaviour ... most are merely tolerating it or dislike it"),
// Cats Protection Blog (Bauch zeigen = Begrüßung/entspannt, besser Kopf/Wangen streicheln), International Cat Care ("a display of trust"),
// Live Science 7.11.2026 (Sarah Ellis, iCatCare: Bauch "particularly vulnerable to injury"; Mikel Delgado, Purdue: lieber Ohrenansatz, Wangen, Kinn).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let cat, bigCat, rudi, room, roomBg, tree, machine, trophy, hearts, mitts = [], bandage, handR, handL;
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }

  // ---------- Graue Tigerkatze ----------
  let FUR_TEX = null;
  function furTex() { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = "#8f949c"; c.fillRect(0, 0, w, h);
    c.fillStyle = "#4e535c"; for (let i = 0; i < 13; i++) { const x = i * w / 13 + 6; c.beginPath(); c.moveTo(x, h * .1); c.quadraticCurveTo(x + 16, h * .5, x - 2, h * .9); c.lineTo(x + 12, h * .9); c.quadraticCurveTo(x + 30, h * .5, x + 13, h * .1); c.fill(); } }); }
  function makeCat() {
    if (!FUR_TEX) FUR_TEX = furTex();
    const furT = new T.MeshStandardMaterial({ map: FUR_TEX, roughness: .75 }), fur = M(0x8f949c, { roughness: .75 }), furD = M(0x5a5f68, { roughness: .75 });
    const white = M(0xfbf8f2, { roughness: .8 }), pink = M(0xff9aa8, { roughness: .5 });
    const iris = M(0xf2b632, { roughness: .15 }), pupil = M(0x101010, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), dark = M(0x3a1a1a);
    const clawM = M(0xffffff, { roughness: .3 });
    const root = new T.Group();
    const claws = [];
    function paw(parent, x, y, z, sx) { const p = sph(white, x, y, z, sx || .065, .045, .06); parent.add(p);
      const cg = new T.Group(); cg.position.set(x, y, z); parent.add(cg); for (let i = -1; i <= 1; i++) { const c = mesh(new T.ConeGeometry(.011, .05, 8), clawM, .045, -.01, i * .025); c.rotation.z = -PI / 2 - .3; c.castShadow = false; cg.add(c); } cg.visible = false; claws.push(cg); return p; }
    // Sitzend
    const sit = new T.Group(); root.add(sit);
    const sb = sph(furT, 0, .32, 0, .25, .33, .23); sb.rotation.z = -.18; sit.add(sb);
    sit.add(sph(white, .15, .38, 0, .13, .21, .15));
    for (const s of [-1, 1]) { sit.add(sph(furT, -.06, .15, s * .15, .21, .16, .12));
      const fl = limb(.05, .3, fur); fl.position.set(.16, .32, s * .085); paw(fl, .03, -.31, 0); sit.add(fl);
      sit.add(sph(white, .11, .035, s * .2, .08, .04, .06)); }
    const tc = new T.CatmullRomCurve3([V(-.22, .06, 0), V(-.34, .04, .14), V(-.22, .04, .3), V(.04, .04, .32), V(.16, .05, .25)]);
    sit.add(mesh(new T.TubeGeometry(tc, 40, .045, 12, false), fur)); sit.add(sph(furD, .16, .05, .25, .046));
    // Stehend / gehend
    const stand = new T.Group(); root.add(stand);
    stand.add(sph(furT, 0, .42, 0, .36, .19, .18)); stand.add(sph(white, .2, .38, 0, .14, .14, .13)); stand.add(sph(white, 0, .33, 0, .28, .09, .14));
    const sLegs = []; for (const [x, s] of [[.22, -1], [.22, 1], [-.22, -1], [-.22, 1]]) { const l = limb(.05, .37, fur); l.position.set(x, .4, s * .09); paw(l, .03, -.38, 0); stand.add(l); sLegs.push(l); }
    const tu = new T.CatmullRomCurve3([V(-.32, .45, 0), V(-.44, .65, 0), V(-.45, .88, 0), V(-.36, 1.0, 0)]);
    const tailU = mesh(new T.TubeGeometry(tu, 30, .045, 12, false), fur); stand.add(tailU); stand.add(sph(furD, -.36, 1.0, 0, .047));
    // Rückenlage: Bauch oben (weiß), vier Beine nach oben, Schwanz flach
    const back = new T.Group(); root.add(back);
    back.add(sph(furT, 0, .17, 0, .36, .16, .2));
    const belly = sph(white, 0, .25, 0, .3, .11, .16); back.add(belly);
    back.add(sph(white, .22, .25, 0, .12, .1, .14));
    const bLegs = []; for (const [x, s, fr] of [[.2, -1, 1], [.2, 1, 1], [-.2, -1, 0], [-.2, 1, 0]]) { const l = limb(.05, fr ? .26 : .3, fur); l.position.set(x, .24, s * .1); paw(l, 0, fr ? -.28 : -.32, 0, fr ? .065 : .075); l.front = fr; l.side = s; back.add(l); bLegs.push(l); }
    const tb = new T.CatmullRomCurve3([V(-.32, .12, 0), V(-.5, .06, .05), V(-.66, .05, .16), V(-.78, .08, .3)]);
    back.add(mesh(new T.TubeGeometry(tb, 30, .045, 12, false), fur)); back.add(sph(furD, -.78, .08, .3, .047));
    // Kopf
    const head = new T.Group(); root.add(head);
    head.add(sph(furT, 0, 0, 0, .23, .2, .22));
    for (const s of [-1, 1]) head.add(sph(fur, .05, -.06, s * .1, .13, .11, .12));
    head.add(sph(white, .17, -.075, 0, .09, .075, .12));
    head.add(sph(pink, .255, -.035, 0, .03, .022, .035));
    // M-Zeichnung auf der Stirn
    for (const z of [-.05, 0, .05]) { const st = mesh(BOX, furD, .12, .13, z, .07, .012, .018); st.rotation.z = .5; st.castShadow = false; head.add(st); }
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.02, .14, s * .12); head.add(e);
      e.add(mesh(new T.ConeGeometry(.085, .18, 24), fur, 0, .08, 0)); e.add(mesh(new T.ConeGeometry(.055, .12, 24), pink, .03, .06, 0));
      e.rotation.x = s * .32; ears.push(e); }
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.165, .035, s * .095); head.add(e);
      e.add(sph(iris, 0, 0, 0, .064, .07, .058)); const p = sph(pupil, .05, 0, 0, .014, .052, .022); e.add(p); e.add(sph(hl, .06, .03, -.012 * s, .013)); p.base = p.scale.clone(); e.pupil = p; eyes.push(e); }
    const wh = M(0xffffff, { roughness: .4 });
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .2, -.07 + i * .025, s * .2, .005, .2, .005); w.rotation.x = s * (PI / 2 - .25 + i * .18); w.castShadow = false; head.add(w); }
    const bite = new T.Group(); head.add(bite); bite.add(sph(dark, .21, -.13, 0, .045, .035, .055));
    for (const s of [-1, 1]) { const f = mesh(new T.ConeGeometry(.012, .04, 8), clawM, .235, -.105, s * .03); f.rotation.z = PI; f.castShadow = false; bite.add(f); }
    const mouth = mesh(new T.TorusGeometry(.03, .007, 8, 16, PI), M(0x5a2a20), .245, -.1, 0); mouth.rotation.set(0, PI / 2, PI); head.add(mouth);
    const tongue = sph(pink, .24, -.13, 0, .03, .015, .03); head.add(tongue); tongue.visible = false;
    return { root, sit, stand, back, sLegs, bLegs, tailU, head, ears, eyes, bite, mouth, tongue, claws, belly };
  }
  // o: {pose:"sit"|"stand"|"back", walk, ears 0..1 (angelegt), lid 0..1, wide, bite, claws, grab 0..1 (Vorderpfoten greifen), kick 0..1 (Hasentritt), look, tilt, nod, lick}
  function poseCat(C, t, o) {
    o = o || {}; const ps = o.pose || "sit";
    C.sit.visible = ps === "sit"; C.stand.visible = ps === "stand"; C.back.visible = ps === "back";
    if (ps === "stand") { C.head.position.set(.4, .62 + Math.abs(Math.sin(t * 7)) * .02 * (o.walk || 0), 0); C.sLegs.forEach((l, i) => l.rotation.z = Math.sin(t * 9 + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .45 * (o.walk || 0)); C.tailU.rotation.x = Math.sin(t * 3) * .08; }
    else if (ps === "back") { C.head.position.set(.43, .2, 0);
      const grab = o.grab || 0, kick = o.kick || 0;
      C.bLegs.forEach((l, i) => { if (l.front) { l.rotation.set(l.side * (.25 - grab * .15), 0, PI - .55 + grab * .25 + Math.sin(t * 2.2 + i) * .08 * (1 - grab)); }
        else { l.rotation.set(l.side * .2, 0, PI + .35 + Math.sin(t * 26 + i * PI) * .45 * kick + Math.sin(t * 1.7 + i) * .05); } });
      C.belly.scale.y = .11 * (1 + Math.sin(t * 2.4) * .06); }
    else { C.head.position.set(.13, .73 + Math.sin(t * 2) * .006, 0); }
    const hz = ps === "back" ? .85 + (o.up || 0) : (o.nod || 0) + Math.sin(t * 1.5) * .025;
    C.head.rotation.set(o.tilt || 0, o.look || 0, hz);
    const ea = o.ears || 0; C.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.x = s * (.32 + ea * .9); e.rotation.z = ea * .5; });
    const lid = o.lid ?? (Math.sin(t * 1.3 + 1) > .985 ? .85 : 0);
    C.eyes.forEach((e) => { e.scale.set(1, Math.max(.08, (1 - lid)) * (o.wide ? 1.15 : 1), 1); e.pupil.scale.copy(e.pupil.base); if (o.wide) e.pupil.scale.z *= 2.4; });
    C.bite.visible = !!o.bite; C.mouth.visible = !o.bite && !o.lick; C.tongue.visible = !!o.lick;
    C.claws.forEach((c) => c.visible = !!o.claws);
    C.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Wohnzimmer ----------
  function makeRoom() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(512, 512, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = ["#b98656", "#ad7a4b", "#c4915f", "#b37f50"][i % 4]; c.fillRect(0, i * h / 8, w, h / 8); c.fillStyle = "rgba(90,50,20,.35)"; c.fillRect(0, i * h / 8, w, 3); c.fillRect((i * 173) % w, i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(6, 6);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    const wallTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#cfe3df"; c.fillRect(0, 0, w, h); c.fillStyle = "#c2d9d4"; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h); });
    wallTex.wrapS = wallTex.wrapT = T.RepeatWrapping; wallTex.repeat.set(10, 3);
    r.add(mesh(BOX, new T.MeshStandardMaterial({ map: wallTex, roughness: .9 }), 0, 2.5, -3, 30, 5, .2));
    r.add(mesh(BOX, M(0xffffff), 0, .08, -2.88, 30, .16, .06));
    const sky = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(1, "#cdeeff"); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = "#fff"; c.beginPath(); c.arc(80, 90, 26, 0, 7); c.arc(110, 80, 32, 0, 7); c.arc(140, 92, 24, 0, 7); c.fill(); });
    const win = new T.Mesh(new T.PlaneGeometry(1.6, 1.4), new T.MeshStandardMaterial({ map: sky, emissive: 0xffffff, emissiveMap: sky, emissiveIntensity: .5 })); win.position.set(-2.2, 2.3, -2.89); r.add(win);
    const fr = M(0xffffff, { roughness: .5 }); for (const [x, y, sx, sy] of [[-2.2, 3.03, 1.75, .08], [-2.2, 1.57, 1.75, .08], [-3.04, 2.3, .08, 1.5], [-1.36, 2.3, .08, 1.5], [-2.2, 2.3, .05, 1.4], [-2.2, 2.3, 1.6, .05]]) r.add(mesh(BOX, fr, x, y, -2.87, sx, sy, .06));
    const pic = canvasTex(256, 200, (c, w, h) => { c.fillStyle = "#ffd23f"; c.fillRect(0, 0, w, h); c.fillStyle = "#ff6b8a"; c.beginPath(); c.arc(90, 110, 50, 0, 7); c.fill(); c.fillStyle = "#2f6fd0"; c.beginPath(); c.arc(170, 80, 36, 0, 7); c.fill(); });
    r.add(mesh(BOX, M(0x5a3a2a), 2.1, 2.5, -2.88, 1.0, .8, .04)); const pm = new T.Mesh(new T.PlaneGeometry(.88, .68), new T.MeshStandardMaterial({ map: pic })); pm.position.set(2.1, 2.5, -2.85); r.add(pm);
    const rug = new T.Mesh(new T.CircleGeometry(1.8, 48), M(0x6a5acd, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(.1, .006, -.2); rug.scale.set(1.3, .8, 1); rug.receiveShadow = true; r.add(rug);
    const rug2 = new T.Mesh(new T.RingGeometry(1.45, 1.6, 48), M(0xffd23f, { roughness: 1 })); rug2.rotation.x = -PI / 2; rug2.position.set(.1, .008, -.2); rug2.scale.set(1.3, .8, 1); r.add(rug2);
    // Sofa hinten
    const sofa = new T.Group(); sofa.position.set(.2, 0, -2.25); r.add(sofa);
    const teal = M(0xe0703c, { roughness: .8 }), tealD = M(0xc25f30, { roughness: .85 });
    sofa.add(mesh(BOX, tealD, 0, .22, 0, 2.4, .36, .8)); for (const x of [-.55, .55]) sofa.add(mesh(BOX, teal, x, .45, .04, 1.08, .14, .72));
    sofa.add(mesh(BOX, teal, 0, .85, -.32, 2.4, .8, .2)); for (const x of [-1.27, 1.27]) sofa.add(mesh(BOX, teal, x, .5, 0, .2, .62, .8));
    const pl = new T.Group(); pl.position.set(-1.9, 0, -2.4); r.add(pl); pl.add(mesh(new T.CylinderGeometry(.25, .18, .45, 24), M(0x2f6fd0), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const a = i / 7 * 2 * PI; const lf = sph(M(i % 2 ? 0x4fae4a : 0x3f9a3c), Math.cos(a) * .2, .75 + (i % 3) * .1, Math.sin(a) * .2, .1, .35, .05); lf.rotation.set(Math.sin(a) * .5, -a, Math.cos(a) * .5); pl.add(lf); }
    return r;
  }
  // ---------- Kratzbaum (Plattform oben y = TOP) ----------
  const TOP = .86;
  function makeTree() {
    const root = new T.Group();
    const carpet = M(0xe9d8b8, { roughness: 1 }), carpetD = M(0xd6c29d, { roughness: 1 });
    const rope = canvasTex(64, 256, (c, w, h) => { c.fillStyle = "#d8b878"; c.fillRect(0, 0, w, h); c.strokeStyle = "#b8955a"; c.lineWidth = 5; for (let y = 0; y < h; y += 10) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + 6); c.stroke(); } });
    rope.wrapS = rope.wrapT = T.RepeatWrapping; rope.repeat.set(3, 3);
    root.add(mesh(BOX, carpetD, 0, .04, 0, 1.0, .08, .9));
    root.add(mesh(new T.CylinderGeometry(.1, .1, TOP - .12, 24), new T.MeshStandardMaterial({ map: rope, roughness: .9 }), 0, (TOP - .12) / 2 + .08, 0));
    root.add(mesh(new T.CylinderGeometry(.55, .55, .08, 40), carpetD, 0, TOP - .06, 0));
    root.add(mesh(new T.CylinderGeometry(.5, .5, .04, 40), carpet, 0, TOP - .01, 0));
    // Spielball an Schnur
    const str = mesh(CYL, M(0xffffff), .45, TOP - .25, .2, .006, .4, .006); str.castShadow = false; root.add(str); root.add(sph(M(0xff4d6d, { roughness: .6 }), .45, TOP - .47, .2, .05));
    return { root };
  }
  // ---------- Kraulmaschine "Kraul-O-Mat" ----------
  function makeMachine() {
    const root = new T.Group(), blue = M(0x2f6fd0, { roughness: .35 }), steel = M(0xc5ced8, { metalness: .85, roughness: .3 }), yel = M(0xffd23f, { roughness: .4 }), red = M(0xe5484d, { roughness: .4 });
    const body = new T.Group(); root.add(body);
    body.add(mesh(BOX, blue, 0, .5, 0, .55, .6, .45));
    const lab = canvasTex(512, 128, (c, w, h) => { c.fillStyle = "#ffd23f"; c.beginPath(); c.roundRect(0, 0, w, h, 30); c.fill(); c.fillStyle = "#1d2250"; c.font = '900 62px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(L("RUB-O-MATIC", "KRAUL-O-MAT"), w / 2, h / 2 + 3); });
    for (const z of [.226, -.226]) { const pn = new T.Mesh(new T.PlaneGeometry(.5, .125), new T.MeshStandardMaterial({ map: lab, roughness: .4 })); pn.position.set(0, .66, z); if (z < 0) pn.rotation.y = PI; body.add(pn); }
    for (let i = 0; i < 3; i++) body.add(sph([red, yel, M(0x36b37e)][i], -.12 + i * .12, .42, .23, .035, .035, .02));
    for (const [x, z] of [[-.2, .17], [.2, .17], [-.2, -.17], [.2, -.17]]) { const wl = mesh(new T.CylinderGeometry(.07, .07, .05, 20), M(0x222222), x, .07, z); wl.rotation.x = PI / 2; body.add(wl); }
    body.add(mesh(CYL, steel, 0, .25, 0, .04, .2, .04));
    const lamp = sph(M(0xff3030, { emissive: 0xff2020, emissiveIntensity: .8 }), 0, .95, 0, .06); body.add(lamp); body.add(mesh(CYL, steel, 0, .86, 0, .012, .14, .012));
    // Teleskoparm mit Feder und Plüschhand
    const arm = new T.Group(); arm.position.set(.25, .62, 0); root.add(arm);
    const seg1 = mesh(CYL, steel, .25, 0, 0, .045, .5, .045); seg1.rotation.z = PI / 2; arm.add(seg1);
    const seg2 = mesh(CYL, steel, .62, 0, 0, .032, .35, .032); seg2.rotation.z = PI / 2; arm.add(seg2);
    const spring = mesh(new T.TorusKnotGeometry(.04, .01, 64, 8, 8, 1), yel, .84, 0, 0); arm.add(spring);
    const hand = new T.Group(); hand.position.set(.95, 0, 0); arm.add(hand);
    const plush = M(0xff8fc7, { roughness: 1 }); hand.add(sph(plush, 0, 0, 0, .09, .07, .1)); for (let i = -1; i <= 1; i++) hand.add(sph(plush, .08, 0, i * .05, .04, .035, .035));
    const parts = [seg2, spring, hand, lamp]; parts.forEach((p) => p.base = p.position.clone());
    const bolts = []; for (let i = 0; i < 6; i++) { const b = mesh(new T.CylinderGeometry(.02, .02, .05, 6), steel); b.visible = false; root.add(b); bolts.push(b); }
    return { root, arm, parts, bolts, hand, spring, seg2, lamp };
  }
  // br: 0 heil .. 1 komplett zerlegt (Teile fliegen weg)
  function poseMachine(Mc, t, ext, br) {
    Mc.arm.scale.x = .55 + ext * .45; Mc.arm.rotation.z = Math.sin(t * 9) * .04 * (1 - br) - br * .2;
    Mc.hand.rotation.x = Math.sin(t * 14) * .5 * (1 - br);
    const dirs = [[.4, .9, .5], [.9, 1.3, -.4], [1.2, .6, .3], [-.3, 1.4, .2]];
    Mc.parts.forEach((p, i) => { const d = dirs[i]; p.position.set(p.base.x + d[0] * br, p.base.y + d[1] * br - 1.6 * br * br, p.base.z + d[2] * br); p.rotation.y = br * 6 * (i + 1); });
    Mc.bolts.forEach((b, i) => { b.visible = br > 0; const a = i / 6 * 2 * PI; b.position.set(.2 + Math.cos(a) * .9 * br, .9 + 1.0 * br - 1.5 * br * br, Math.sin(a) * .6 * br); b.rotation.set(t * 8 + i, t * 5, 0); });
    Mc.lamp.material.emissiveIntensity = br > 0 ? (Math.sin(t * 30) > 0 ? 1.5 : .2) : .8;
  }
  // ---------- Pokal "Goldene Kralle" ----------
  function makeTrophy() {
    const root = new T.Group(), gold = M(0xffc83d, { metalness: .8, roughness: .25 }), wood = M(0x5a3a2a);
    root.add(mesh(BOX, wood, 0, .06, 0, .22, .12, .22)); root.add(mesh(new T.CylinderGeometry(.04, .06, .14, 20), gold, 0, .19, 0));
    // goldene Pfote mit drei Krallen
    root.add(sph(gold, 0, .32, 0, .09, .08, .07)); for (let i = -1; i <= 1; i++) { root.add(sph(gold, i * .055, .41, 0, .03, .035, .03)); const c = mesh(new T.ConeGeometry(.016, .08, 10), gold, i * .055, .47, 0); root.add(c); }
    return { root };
  }
  function heartGeo() { const s = new T.Shape(); s.moveTo(0, -.5); s.bezierCurveTo(-.9, .1, -.5, .75, 0, .35); s.bezierCurveTo(.5, .75, .9, .1, 0, -.5);
    const geo = new T.ExtrudeGeometry(s, { depth: .18, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 4, curveSegments: 20 }); geo.center(); return geo; }
  function makeHearts() { const root = new T.Group(); const geo = heartGeo(), m = M(0xff4d6d, { roughness: .3 }); const list = [];
    for (let i = 0; i < 4; i++) { const h = mesh(geo, m); h.castShadow = false; h.scale.setScalar(.12); root.add(h); list.push(h); } return { root, list }; }

  K3.onBuild(() => {
    rudi = K3.rudi; cat = actor(makeCat(), "Katze"); bigCat = actor(makeCat(), "Katze gross");
    tree = actor(makeTree(), "Kratzbaum"); tree.noCheck = true;
    machine = actor(makeMachine(), "Kraulmaschine"); trophy = actor(makeTrophy(), "Pokal"); trophy.noCheck = true;
    hearts = actor(makeHearts(), "Herzen"); hearts.noCheck = true;
    handL = rudi.arms[0].children[rudi.arms[0].children.length - 1]; handR = rudi.arms[1].children[rudi.arms[1].children.length - 1];
    const mitt = M(0xe5484d, { roughness: .9 });
    for (const hnd of [rudi.arms[0], rudi.arms[1]]) { const mg = new T.Group(); mg.add(sph(mitt, 0, -.06, 0, .19, .22, .17)); mg.add(sph(mitt, .1, .0, .13, .07, .1, .07)); mg.add(mesh(CYL, M(0xffffff, { roughness: 1 }), 0, .12, 0, .13, .06, .13)); mg.position.y = -.62; mg.visible = false; hnd.add(mg); mitts.push(mg); }
    bandage = new T.Group(); const bw = M(0xffffff, { roughness: 1 }); bandage.add(mesh(CYL, bw, 0, -.38, 0, .095, .26, .095));
    for (const y of [-.32, -.44]) { const p = mesh(BOX, M(0xf3c39d), .095, y, 0, .02, .05, .12); p.rotation.x = .6; bandage.add(p); }
    bandage.visible = false; rudi.arms[1].add(bandage);
    room = makeRoom();
    roomBg = new T.Color(0xcfe3df).convertSRGBToLinear();
  });
  function inRoom() { begin("yard"); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xcfe3df, 16, 40); K3.hemi.intensity = .8;
    mitts.forEach((m) => m.visible = false); bandage.visible = false; }
  function studio() { begin("studio"); room.visible = false; mitts.forEach((m) => m.visible = false); bandage.visible = false; }

  // Kratzbaum + Katze darauf
  const TX = .55, TZ = -.35;
  function catOnTree(t, o, ry) { place(tree, TX, TZ, 0); cat.root.visible = true; cat.root.position.set(TX + (o.dx || 0), TOP, TZ + (o.dz || 0)); cat.root.rotation.set(0, ry ?? -.75, 0); poseCat(cat, t, o); }
  // Rudi so hinstellen, dass seine rechte Hand den Punkt tgt erreicht (Armwinkel per Halbierung, dann Position verschieben)
  const _h = new T.Vector3();
  function rudiReach(t, tgt, o, ry) { o = o || {}; ry = ry ?? 0;
    let lo = .1, hi = 1.7, a = .9;
    for (let i = 0; i < 14; i++) { a = (lo + hi) / 2; place(rudi, 0, 0, ry); poseRudi(rudi, t, Object.assign({}, o, { arms: o.left ? [a, o.armR ?? .15] : [o.armL ?? .15, a] })); rudi.root.updateMatrixWorld(true); (o.left ? handL : handR).getWorldPosition(_h); if (_h.y > tgt.y) lo = a; else hi = a; }
    rudi.root.position.set(tgt.x - _h.x, 0, tgt.z - _h.z); rudi.root.updateMatrixWorld(true); }
  function bellyPt(dx) { const v = V(dx || 0, .38, 0); cat.root.updateMatrixWorld(true); return cat.back.localToWorld(v); }
  // Horror-Look: Letterbox, rot-dunkle Vignette, Filmkorn-Flackern
  function horror(a, t) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    const gr = g.createRadialGradient(W * .42, H * .42, H * .12, W * .42, H * .45, H * .75); gr.addColorStop(0, `rgba(60,0,10,${.12 * a})`); gr.addColorStop(1, `rgba(20,0,5,${.82 * a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = `rgba(0,0,0,${a})`; g.fillRect(0, 0, W, 140 * a); g.fillRect(0, H - 140 * a, W, 140 * a);
    if (Math.sin(t * 37) > .93) { g.fillStyle = `rgba(255,255,255,${.06 * a})`; g.fillRect(0, 0, W, H); }
    g.restore(); }
  function horrorTitle(s, y, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a, 0, 1); g.font = '900 96px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "rgba(255,0,0,.9)"; g.shadowBlur = 40; g.lineWidth = 12; g.strokeStyle = "rgba(0,0,0,.85)"; g.strokeText(s, W * .42, y); g.fillStyle = "#ff2a2a"; g.fillText(s, W * .42, y); g.restore(); }
  function actCard(s, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a, 0, 1); g.fillStyle = "rgba(0,0,0,.78)"; g.beginPath(); g.roundRect(W * .42 - 210, 175, 420, 92, 18); g.fill();
    g.font = '900 54px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ff3b3b"; g.fillText(s, W * .42, 223); g.restore(); }

  // ---------- Shots ----------
  // 0 Hook: Horror-Trailer. Katze liegt flauschig auf dem Rücken, Rudis Hand schleicht sich heran, Titel DIE BAUCHFALLE
  KZ.shot("bHook", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    catOnTree(t, { pose: "back", lid: .45, ears: 0, up: .1 }); cat.noCheck = true;
    const bp = bellyPt(); rudiReach(t, V(bp.x - .55 + .35 * k, bp.y + .25, bp.z + .05), { wide: true, mouth: "smile", lean: -.12 });
    frameOn([rudi, cat, tree], { az: lerp(.34, .26, k), el: .2, fill: lerp(.9, .98, k), t }); draw();
    horror(1, t); horrorTitle(L("THE BELLY TRAP", "DIE BAUCHFALLE"), H * .63, (ph - .35) * 3); });
  // 1 Akt eins: Katze rollt sich auf den Rücken, Rudi: BAUCHKRAULEN!
  KZ.shot("bRoll", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph), roll = ph > .3;
    if (!roll) catOnTree(t, { pose: "sit", ears: 0 }, -.9);
    else { catOnTree(t, { pose: "back", lid: .3, up: .1 }, -.75); cat.root.rotation.x = (1 - sm((ph - .3) / .12)) * -.9; }
    cat.noCheck = true;
    const bp = roll ? bellyPt() : V(TX, TOP + .5, TZ);
    rudiReach(t, V(bp.x - .6 + .2 * sm((ph - .5) / .5), bp.y + .3, bp.z + .05), { wide: true, mouth: "smile", lean: -.1 });
    frameOn([rudi, cat, tree], { az: lerp(.34, .28, k), el: .2, fill: lerp(.9, .96, k), t }); draw();
    actCard(L("ACT 1", "AKT 1"), lt / .25);
    if (ph > .55) stamp(L("BELLY RUB!", "KRAULEN!"), W * .42, H * .62, (ph - .55) * d / .3, "#ff5d8f", -.06); });
  // 2 Angriff: Vorderpfoten klammern, Biss, Hasentritt, Krallen
  KZ.shot("bAttack", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    catOnTree(t, { pose: "back", grab: 1, kick: ph > .25 ? 1 : 0, bite: ph > .15, claws: true, ears: .8, wide: true, up: .25 }); cat.noCheck = true;
    const bp = bellyPt(.08); const sh = Math.sin(t * 40) * .02;
    rudiReach(t, V(bp.x + sh, bp.y + .02, bp.z + .03), { wide: true, mouth: "o", lean: -.12 + sh });
    frameOn([rudi, cat], { az: lerp(.36, .28, k), el: .25, fill: lerp(.92, 1.0, k), t }); draw();
    stamp(L("TRAP!", "FALLE!"), W * .42, H * .2, lt / .3, "#e5484d", -.07);
    if (ph > .5) stamp(L("OUCH!", "AUA!"), W * .42, H * .62, (ph - .5) * d / .3, "#ff9f43", .06); });
  // 3 Akt zwei: Ofenhandschuhe, Katze steht auf und springt weg
  KZ.shot("bMitts", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph), go = sm((ph - .45) / .5);
    if (go <= 0) { catOnTree(t, { pose: "back", lid: .2, look: .2 }); }
    else { place(tree, TX, TZ, 0); cat.root.visible = true; const jx = TX + .2 + go * 1.4; cat.root.position.set(jx, TOP * (1 - sm(clamp(go * 1.6, 0, 1))) + Math.sin(clamp(go * 1.6, 0, 1) * PI) * .25, TZ + go * .3); cat.root.rotation.set(0, -.2, 0); poseCat(cat, t, { pose: "stand", walk: 1, ears: .3 }); }
    cat.noCheck = false;
    place(rudi, lerp(-1.5, -1.05, sm(ph / .45)), -.3, -.3); poseRudi(rudi, t, { arms: [1.2, 1.2], spread: .1, walk: ph < .45 ? 1 : 0, mouth: go > .2 ? "o" : "smile", wide: true }); mitts.forEach((m) => m.visible = true);
    frameOn([rudi, cat, tree], { az: lerp(.42, .36, k), el: .18, fill: lerp(.86, .9, k), t }); draw();
    actCard(L("ACT 2", "AKT 2"), lt / .25);
    if (ph < .5) stamp(L("MITTS ON", "HANDSCHUHE"), W * .42, H * .62, (lt - .3) / .3, "#e5484d", -.06);
    else stamp(L("BYE!", "TSCHÜSS!"), W * .42, H * .62, (ph - .5) * d / .3, "#7a5cff", .07); });
  // 4 Akt drei: Kraul-O-Mat fährt den Arm aus, Katze zerlegt ihn in zwei Sekunden
  KZ.shot("bMachine", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph), br = sm((ph - .55) / .35);
    const atk = ph > .45; catOnTree(t, { pose: "back", grab: atk ? 1 : 0, kick: atk && br < 1 ? 1 : 0, bite: atk && br < .6, claws: atk, ears: atk ? .8 : 0, wide: atk, up: .2, lid: atk ? 0 : .3 }); cat.noCheck = true;
    place(machine, TX - 1.35, TZ + .05, 0); poseMachine(machine, t, sm(ph / .4), br);
    place(rudi, TX - 2.4, TZ + .35, -.35); poseRudi(rudi, t, { arms: [.3, ph < .5 ? 1.0 + Math.sin(t * 5) * .1 : .2], spread: ph > .6 ? .5 : .1, mouth: br > .1 ? "o" : "smile", wide: true });
    frameOn([rudi, machine, cat, tree], { az: lerp(.48, .4, k), el: .2, fill: lerp(.88, .94, k), t }); draw();
    actCard(L("ACT 3", "AKT 3"), lt / .25);
    if (ph < .55) stamp(L("RUB-O-MATIC", "KRAUL-O-MAT"), W * .42, H * .62, (lt - .3) / .3, "#2f6fd0", -.06);
    else stamp(L("2 SECONDS", "2 SEKUNDEN"), W * .42, H * .62, (ph - .55) * d / .3, "#e5484d", .07); });
  // 5 Studio: Bauch oben = Vertrauen, keine Einladung
  KZ.shot("bTrust", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    bigCat.root.visible = true; bigCat.root.position.set(0, 0, 0); bigCat.root.rotation.set(0, -.7, 0); poseCat(bigCat, t, { pose: "back", lid: .35, up: .1 });
    frameOn([bigCat], { az: lerp(.35, .2, k), el: .35, fill: lerp(.8, .88, k), dy: -.05, t }); draw();
    stamp(L("TRUST ✓", "VERTRAUEN ✓"), W * .42, H * .2, (lt - .15) / .3, "#36b37e", -.06);
    if (ph > .5) stamp(L("INVITATION ✗", "EINLADUNG ✗"), W * .42, H * .62, (ph - .5) * d / .3, "#e5484d", .06); });
  // 6 Studio: empfindlichste Stelle, roter Puls-Ring, alle vier Pfoten mit Krallen schützen
  KZ.shot("bSoft", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph), guard = sm((ph - .45) / .2);
    bigCat.root.visible = true; bigCat.root.position.set(0, 0, 0); bigCat.root.rotation.set(0, -.7, 0); poseCat(bigCat, t, { pose: "back", grab: guard, claws: guard > .3, ears: .5 * guard, wide: guard > .3, lid: guard > .3 ? 0 : .3, up: .15 });
    frameOn([bigCat], { az: lerp(.3, .22, k), el: .4, fill: lerp(.84, .9, k), dy: -.05, t }); draw();
    bigCat.root.updateMatrixWorld(true); const [x, y] = scr(bigCat.back.localToWorld(V(0, .3, 0)));
    const pr = .5 + .5 * Math.sin(t * 7); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(ph * 4, 0, 1) * (1 - guard * .5); g.strokeStyle = "#ff3b3b"; g.lineWidth = 12 + pr * 6; g.beginPath(); g.ellipse(x, y, 190 + pr * 20, 110 + pr * 12, 0, 0, 2 * PI); g.stroke(); g.restore();
    stamp(L("VULNERABLE", "EMPFINDLICH"), W * .42, H * .2, (lt - .15) / .3, "#e5484d", -.06);
    if (ph > .5) stamp(L("4 PAWS", "4 PFOTEN"), W * .42, H * .62, (ph - .5) * d / .3, "#ff9f43", .06); });
  // 7 Und jetzt kommt's: die meisten halten es nur aus (2D-Balken + Quellenkarte Cats Protection)
  KZ.shot("bTolerate", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    bigCat.root.visible = true; bigCat.root.position.set(0, 0, 0); bigCat.root.rotation.set(0, -.7, 0); poseCat(bigCat, t, { pose: "back", lid: .55, ears: .45, up: .1 });
    frameOn([bigCat], { az: lerp(.28, .2, k), el: .35, fill: .7, dy: -.85, t }); draw();
    // Balken: wenige mögen es vs. die meisten halten es aus / mögen es nicht
    const g1 = sm((lt - .2) / .5), g2 = sm((lt - .6) / .6), base = H * .52, bw = 210;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    const bars = [[W * .42 - 150, 50 * g1, "#36b37e"], [W * .42 + 150, 180 * g2, "#e5484d"]];
    for (const [x, h, c] of bars) { g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(x - bw / 2 + 8, base - h + 8, bw, h, 18); g.fill(); g.fillStyle = c; g.beginPath(); g.roundRect(x - bw / 2, base - h, bw, h, 18); g.fill(); }
    g.restore();
    txt(L("ENJOY IT", "MÖGEN ES"), W * .42 - 150, base + 45, 40, "#ffffff", { stroke: 8, a: g1 }); txt(L("FEW", "WENIGE"), W * .42 - 150, base - 50 * g1 - 40, 46, "#ffffff", { stroke: 8, a: g1 });
    txt(L("PUT UP WITH IT", "HALTEN ES AUS"), W * .42 + 150, base + 45, 40, "#ffffff", { stroke: 8, a: g2 }); txt(L("MOST", "DIE MEISTEN"), W * .42 + 150, base - 180 * g2 - 40, 46, "#ffffff", { stroke: 8, a: g2 });
    const cp = sm((lt - d * .45) / .3); if (card(W * .42, H * .635, 900, 210, cp, "Cats Protection (UK)", "#2f6fd0")) {
      txt(L("“most are merely tolerating", "„Die meisten ertragen es nur"), W * .42, H * .635 + 8, 36, "#1d2250", { a: clamp(cp, 0, 1) });
      txt(L("it or dislike it”", "oder mögen es nicht.“"), W * .42, H * .635 + 54, 36, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 8 Pointe: Rudi mit Verband und Pokal "Goldene Kralle", Katze leckt sich die Pfote
  KZ.shot("bAward", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    catOnTree(t, { pose: "sit", lick: Math.sin(t * 6) > 0, nod: -.3, lid: .5, look: .4 }, -1.0); cat.noCheck = false;
    place(rudi, TX - 1.25, TZ + .2, -.35); poseRudi(rudi, t, { arms: [1.25 + Math.sin(t * 4) * .05, .25], spread: .05, mouth: ph > .5 ? "smile" : "o", wide: true }); bandage.visible = true;
    // Pokal in der linken Hand
    rudi.root.updateMatrixWorld(true); handL.getWorldPosition(_h); trophy.root.visible = true; trophy.root.position.set(_h.x, _h.y + .02, _h.z); trophy.root.rotation.set(0, -.4, 0);
    const sp = sm((ph - .3) / .2); trophy.root.scale.setScalar(.001 + easeBack(sp) * 1.3);
    frameOn([rudi, cat, tree], { az: lerp(.42, .36, k), el: .16, fill: lerp(.86, .9, k), t }); draw();
    if (ph > .45) stamp(L("GOLDEN CLAW", "GOLDENE KRALLE"), W * .42, H * .2, (ph - .45) * d / .3, "#ffb800", -.06); });
  // 9 Tipp: Wangen und Kinn kraulen, Katze schmiegt sich an, Herzen
  KZ.shot("bTip", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    catOnTree(t, { pose: "sit", lid: .8, ears: 0, tilt: .2 + Math.sin(t * 3) * .05, look: -.35 }, -1.35); cat.noCheck = true;
    cat.root.updateMatrixWorld(true); const cheek = cat.head.localToWorld(V(.1, -.06, .2));
    rudiReach(t, V(cheek.x, cheek.y, cheek.z), { mouth: "smile", lean: -.15, left: true }, -.5);
    hearts.root.visible = ph > .35; hearts.list.forEach((h, i) => { const p = clamp((ph - .35 - i * .08) / .25, 0, 1); h.visible = p > 0; h.position.set(cheek.x + .1 + i * .12, cheek.y + .3 + p * .5 + i * .05, cheek.z - .1); h.rotation.y = t * 2 + i; h.scale.setScalar(.1 * easeBack(p) + .001); });
    frameOn([rudi, cat, tree], { az: lerp(.2, .12, k), el: .18, fill: lerp(.9, .96, k), t }); draw();
    stamp(L("CHEEKS + CHIN", "WANGEN + KINN"), W * .42, H * .2, (lt - .2) / .3, "#36b37e", -.06);
    if (ph > .6) stamp(L("SAY HI!", "HALLO!"), W * .42, H * .62, (ph - .6) * d / .3, "#2f6fd0", .06); });
  // 10 Loop: zurück zur Hook-Einstellung, Horror-Look blendet wieder ein
  KZ.shot("bLoop", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    catOnTree(t, { pose: "back", lid: .45, ears: 0, up: .1 }); cat.noCheck = true;
    const bp = bellyPt(); rudiReach(t, V(bp.x - .55, bp.y + .25, bp.z + .05), { wide: true, mouth: "smile", lean: -.12 });
    frameOn([rudi, cat, tree], { az: lerp(.38, .34, k), el: .2, fill: lerp(.88, .9, k), t }); draw();
    horror(sm((ph - .2) / .7), t);
    if (ph > .35) stamp(L("A TRAP?", "FALLE?"), W * .42, H * .62, (ph - .35) * d / .3, "#7a5cff", -.06); });

  window.__catbelly3d = true;
})();