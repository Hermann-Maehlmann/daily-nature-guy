// 3D-Szene "Why Your Cat Won't Drink From Her Water Bowl" / "Warum deine Katze nicht aus ihrem Napf trinkt" (21.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Opener-Stil "gameshow": Spotlights, Leuchtschild "WAS WILL DIE KATZE?", Kandidatenpult mit Buzzer, Konfetti, rote Falsch-Blitze.
// Graue Tigerkatze (aus dem Katzenbauch-Video übernommen und erweitert: Trink-Pose mit Zunge), Wohnzimmer, Futter- und Wassernapf,
// Blumenvase, Couchtisch mit Rudis Glas, goldener Doppelnapf, Studio: Abstands-Grafik, Wildkatze zwischen Maus und Wasserloch, Messbecher 200 ml.
// Quellen: International Cat Care ("Away from the food bowl: cats prefer not to drink next to their food"; "Avoid double bowls";
// wide shallow bowl, filled to the brim), Cats Protection (Wildkatzen fressen und trinken an verschiedenen Orten, damit Beutereste das Wasser
// nicht verunreinigen; Wasser weg von Futter und Katzenklo; 4-kg-Katze ca. 200 ml pro Tag), VCA ("a lot of cats don't drink enough water"),
// iCatCare (mehr trinken hilft bei Nieren, Blasenentzündung, Harnsteinen).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let cat, bigCat, rudi, room, roomBg, podium, foodB, waterB, dbl, vase, table, sFood, sWater, mouse, puddle, handR, handL;
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
    if (ps === "stand") { C.head.position.set(.4, .62 + Math.abs(Math.sin(t * 7)) * .02 * (o.walk || 0), 0); C.sLegs.forEach((l, i) => l.rotation.z = Math.sin(t * 9 + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .45 * (o.walk || 0)); C.tailU.rotation.x = Math.sin(t * 3) * .08;
      if (o.drink) { const dr = o.drink; C.head.position.x = lerp(.4, .55, dr); C.head.position.y = lerp(C.head.position.y, o.hy ?? .2, dr); } }
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

  // ---------- Näpfe ----------
  const waterM = () => M(0x4fb3ff, { roughness: .08, metalness: .1, emissive: 0x1a5ea0, emissiveIntensity: .25 });
  function makeBowl(col, kind) {
    const root = new T.Group(), m = M(col, { roughness: .35 });
    root.add(mesh(new T.CylinderGeometry(.17, .12, .09, 36), m, 0, .045, 0));
    const rim = mesh(new T.TorusGeometry(.165, .018, 10, 36), m, 0, .09, 0); rim.rotation.x = PI / 2; root.add(rim);
    if (kind === "water") root.add(mesh(new T.CylinderGeometry(.15, .15, .01, 36), waterM(), 0, .082, 0));
    else { const kib = M(0x9a5a2a, { roughness: .8 }); for (let i = 0; i < 16; i++) { const a = i * 2.4, r = .03 + (i % 4) * .028; root.add(sph(kib, Math.cos(a) * r, .085 + (i % 3) * .012, Math.sin(a) * r, .026, .018, .026)); } }
    return { root };
  }
  // goldener Doppelnapf (Futter + Wasser in einem Gestell)
  function makeDouble() {
    const root = new T.Group(), gold = M(0xffc83d, { metalness: .85, roughness: .22 });
    root.add(mesh(BOX, gold, 0, .04, 0, .78, .08, .36));
    for (const [x, k] of [[-.2, "food"], [.2, "water"]]) { const b = makeBowl(0xfff3c4, k); b.root.position.set(x, .06, 0); root.add(b.root);
      const r = mesh(new T.TorusGeometry(.17, .02, 10, 36), gold, x, .155, 0); r.rotation.x = PI / 2; root.add(r); }
    const sp = []; for (let i = 0; i < 5; i++) { const s = mesh(new T.OctahedronGeometry(.035), M(0xffffff, { emissive: 0xffe9a0, emissiveIntensity: 1 })); s.castShadow = false; root.add(s); sp.push(s); }
    return { root, sp };
  }
  // Blumenvase (blau, Wasser oben sichtbar, drei Blumen)
  function makeVase() {
    const root = new T.Group(), cer = M(0x2f6fd0, { roughness: .3 });
    root.add(mesh(new T.CylinderGeometry(.15, .12, .36, 32), cer, 0, .18, 0));
    const r = mesh(new T.TorusGeometry(.15, .02, 10, 32), cer, 0, .36, 0); r.rotation.x = PI / 2; root.add(r);
    root.add(mesh(new T.CylinderGeometry(.135, .135, .01, 32), waterM(), 0, .345, 0));
    const stem = M(0x3f9a3c), cols = [0xff5d8f, 0xffd23f, 0xff9f43];
    for (let i = 0; i < 3; i++) { const a = -1 + i, x = -.09 + i * .05, z = -.06; const st = mesh(CYL, stem, x, .55, z - .02, .012, .45, .012); st.rotation.x = -.25; st.rotation.z = a * .25; root.add(st);
      const hx = x - Math.sin(a * .25) * .22, hy = .78, hz = z - .1; root.add(sph(M(cols[i], { roughness: .6 }), hx, hy, hz, .07, .05, .07)); root.add(sph(M(0xffe066), hx, hy + .03, hz, .03)); }
    return { root };
  }
  // Couchtisch mit Rudis Wasserglas
  function makeTable() {
    const root = new T.Group(), wood = M(0x7a4a2a, { roughness: .6 });
    root.add(mesh(BOX, wood, 0, .42, 0, 1.15, .06, .55)); for (const [x, z] of [[-.5, -.2], [.5, -.2], [-.5, .2], [.5, .2]]) root.add(mesh(BOX, wood, x, .2, z, .06, .4, .06));
    const glass = new T.Group(); glass.position.set(.38, .45, .05); root.add(glass);
    glass.add(mesh(new T.CylinderGeometry(.075, .065, .24, 28, 1, true), new T.MeshStandardMaterial({ color: 0xdff4ff, transparent: true, opacity: .4, roughness: .05, side: T.DoubleSide }), 0, .12, 0));
    glass.add(mesh(new T.CylinderGeometry(.068, .062, .17, 28), new T.MeshStandardMaterial({ color: 0x8fd3ff, transparent: true, opacity: .6, roughness: .05 }), 0, .09, 0));
    return { root, glass };
  }
  // Kandidatenpult mit Buzzer und Namensschild
  function makePodium() {
    const root = new T.Group(), red = M(0xe5484d, { roughness: .4 }), gold = M(0xffc83d, { metalness: .7, roughness: .3 });
    root.add(mesh(new T.CylinderGeometry(.32, .38, .95, 6), M(0x7a5cff, { roughness: .4 }), 0, .475, 0));
    root.add(mesh(new T.CylinderGeometry(.36, .36, .06, 6), gold, 0, .98, 0));
    const lab = canvasTex(256, 96, (c, w, h) => { c.fillStyle = "#ffd23f"; c.beginPath(); c.roundRect(0, 0, w, h, 22); c.fill(); c.fillStyle = "#1d2250"; c.font = '900 60px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("RUDI", w / 2, h / 2 + 3); });
    const pn = new T.Mesh(new T.PlaneGeometry(.42, .16), new T.MeshStandardMaterial({ map: lab, roughness: .4 })); pn.position.set(.31, .65, 0); pn.rotation.y = PI / 2; root.add(pn);
    pn.position.set(.31 * Math.sin(.6), .65, .31 * Math.cos(.6)); pn.rotation.y = .6;
    root.add(mesh(new T.CylinderGeometry(.11, .12, .05, 24), M(0x222222), .05, 1.035, 0));
    const btn = new T.Mesh(new T.SphereGeometry(.1, 24, 12, 0, 2 * PI, 0, PI / 2), M(0xff3030, { emissive: 0xff2020, emissiveIntensity: .3, roughness: .3 })); btn.position.set(.05, 1.055, 0); btn.castShadow = true; root.add(btn);
    return { root, btn };
  }
  // Maus (Beute) und Wasserloch fürs Studio
  function makeMouse() {
    const root = new T.Group(), gr = M(0x8a7f78, { roughness: .8 }), pk = M(0xffa3b1, { roughness: .6 });
    root.add(sph(gr, 0, .1, 0, .16, .1, .1)); root.add(sph(gr, .15, .13, 0, .08, .07, .07));
    for (const s of [-1, 1]) { root.add(sph(pk, .12, .21, s * .05, .045, .045, .015)); root.add(sph(M(0x111111), .21, .15, s * .035, .014)); }
    root.add(sph(pk, .235, .125, 0, .016));
    const tc = new T.CatmullRomCurve3([V(-.15, .08, 0), V(-.3, .04, .05), V(-.42, .07, -.04)]); root.add(mesh(new T.TubeGeometry(tc, 20, .012, 8, false), pk));
    return { root };
  }
  function makePuddle() {
    const root = new T.Group(); const p = mesh(new T.CylinderGeometry(.45, .45, .03, 40), waterM(), 0, .015, 0); p.scale.set(1.2, 1, .8); root.add(p);
    for (let i = 0; i < 7; i++) { const a = i / 7 * 2 * PI; root.add(sph(M(0x8a8f99, { roughness: .9 }), Math.cos(a) * .55, .04, Math.sin(a) * .38, .09, .06, .08)); }
    const reed = M(0x3f9a3c); for (let i = 0; i < 4; i++) { const r = mesh(CYL, reed, -.35 + i * .07, .25, -.38, .015, .5, .015); r.rotation.z = (i - 1.5) * .12; root.add(r); }
    return { root };
  }

  K3.onBuild(() => {
    rudi = K3.rudi; cat = actor(makeCat(), "Katze"); bigCat = actor(makeCat(), "Katze gross");
    podium = actor(makePodium(), "Pult"); podium.noCheck = true;
    foodB = actor(makeBowl(0xff8fb1, "food"), "Futternapf"); foodB.noCheck = true;
    waterB = actor(makeBowl(0x36b37e, "water"), "Wassernapf"); waterB.noCheck = true;
    sFood = actor(makeBowl(0xff8fb1, "food"), "Futternapf Studio"); sFood.noCheck = true;
    sWater = actor(makeBowl(0x36b37e, "water"), "Wassernapf Studio"); sWater.noCheck = true;
    dbl = actor(makeDouble(), "Doppelnapf"); dbl.noCheck = true;
    vase = actor(makeVase(), "Vase"); vase.noCheck = true;
    table = actor(makeTable(), "Tisch"); table.noCheck = true;
    mouse = actor(makeMouse(), "Maus"); mouse.noCheck = true;
    puddle = actor(makePuddle(), "Wasserloch"); puddle.noCheck = true;
    handL = rudi.arms[0].children[rudi.arms[0].children.length - 1]; handR = rudi.arms[1].children[rudi.arms[1].children.length - 1];
    room = makeRoom();
    roomBg = new T.Color(0xcfe3df).convertSRGBToLinear();
  });
  function inRoom() { begin("yard"); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xcfe3df, 16, 40); K3.hemi.intensity = .8; }
  function studio() { begin("studio"); room.visible = false; }

  // Positionen im Wohnzimmer
  const PX = -.95, PZ = .05;         // Pult
  const FX = .1, FZ = .35;           // Futternapf
  const VX = 1.45, VZ = -.55;        // Vase
  const TBX = .35, TBZ = -1.15;      // Couchtisch
  const _h = new T.Vector3();
  function rudiAtPodium(t, o) { place(podium, PX, PZ, 0); rudi.root.visible = true;
    // Hand auf dem Buzzer (Halbierung über den Armwinkel)
    podium.root.updateMatrixWorld(true); const b = podium.btn.getWorldPosition(new T.Vector3()); b.y += .06 + (o.press || 0) * -.03;
    let lo = .1, hi = 1.6, a = .9; for (let i = 0; i < 14; i++) { a = (lo + hi) / 2; place(rudi, 0, 0, 0); poseRudi(rudi, t, Object.assign({}, o, { arms: [o.armL ?? .15, a] })); rudi.root.updateMatrixWorld(true); handR.getWorldPosition(_h); if (_h.y > b.y) lo = a; else hi = a; }
    if (o.free) { place(rudi, b.x - .62, b.z - .3, 0); poseRudi(rudi, t, o); return; }
    rudi.root.position.set(b.x - _h.x, 0, b.z - _h.z); rudi.root.updateMatrixWorld(true); }
  // Spotlights (additive Lichtkegel von oben) + dunkle Bühnen-Vignette
  function stage(a, t) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    const vg = g.createRadialGradient(W * .44, H * .45, H * .15, W * .44, H * .45, H * .7); vg.addColorStop(0, "rgba(20,0,40,0)"); vg.addColorStop(1, `rgba(20,0,40,${.6 * a})`); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = "lighter";
    const cols = ["255,90,170", "80,170,255", "255,210,60"];
    for (let i = 0; i < 3; i++) { const sx = W * (.15 + i * .3), ang = Math.sin(t * 1.3 + i * 2) * .28 + (i - 1) * -.25, len = H * .8;
      const ex = sx + Math.sin(ang) * len, ey = Math.cos(ang) * len; const gr = g.createLinearGradient(sx, 0, ex, ey); gr.addColorStop(0, `rgba(${cols[i]},${.35 * a})`); gr.addColorStop(1, `rgba(${cols[i]},0)`);
      g.fillStyle = gr; g.beginPath(); g.moveTo(sx - 20, 0); g.lineTo(sx + 20, 0); g.lineTo(ex + 150, ey); g.lineTo(ex - 150, ey); g.closePath(); g.fill(); }
    g.restore(); }
  // Leuchtschild der Show mit blinkenden Glühbirnen
  function showSign(p, t, y) { if (p <= 0) return; const k = easeBack(clamp(p, 0, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W * .44, y); g.rotate(-.04 + Math.sin(t * 2) * .015); g.scale(k, k);
    const w = 760, h = 230; g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-w / 2 + 10, -h / 2 + 14, w, h, 40); g.fill();
    g.fillStyle = "#7a2cff"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 40); g.fill(); g.strokeStyle = "#ffc83d"; g.lineWidth = 14; g.stroke();
    for (let i = 0; i < 26; i++) { const u = i / 26; let x, yy; const per = 2 * (w + h), d = u * per; if (d < w) { x = -w / 2 + d; yy = -h / 2; } else if (d < w + h) { x = w / 2; yy = -h / 2 + d - w; } else if (d < 2 * w + h) { x = w / 2 - (d - w - h); yy = h / 2; } else { x = -w / 2; yy = h / 2 - (d - 2 * w - h); }
      const on = (Math.floor(t * 8) + i) % 2 === 0; g.fillStyle = on ? "#fff7c2" : "#c9902a"; g.beginPath(); g.arc(x, yy, 9, 0, 7); g.fill(); }
    g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffffff"; g.font = '900 46px "Montserrat"'; g.fillText(L("WHAT DOES", "WAS WILL"), 0, -42);
    g.fillStyle = "#ffd23f"; g.font = '900 74px "Montserrat"'; g.fillText(L("THE CAT WANT?", "DIE KATZE?"), 0, 30); g.restore(); }
  function roundCard(s, a) { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(a, 0, 1); g.fillStyle = "#7a2cff"; g.beginPath(); g.roundRect(W * .44 - 220, 175, 440, 96, 22); g.fill();
    g.strokeStyle = "#ffc83d"; g.lineWidth = 8; g.stroke(); g.font = '900 56px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffd23f"; g.fillText(s, W * .44, 225); g.restore(); }
  function wrongFlash(p) { if (p <= 0 || p > 1) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(255,30,40,${.35 * (1 - p)})`; g.fillRect(0, 0, W, H); g.restore(); }
  function confetti(t, n, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const cols = ["#ff5d8f", "#ffd23f", "#36b37e", "#4fb3ff", "#ff9f43"];
    for (let i = 0; i < n; i++) { const x = (i * 137.5 % 830) + 60, y = ((t * (120 + i % 5 * 30) + i * 97) % 1100) + 180; g.globalAlpha = (a ?? 1) * .9; g.fillStyle = cols[i % 5];
      g.save(); g.translate(x, y); g.rotate(t * 3 + i); g.fillRect(-9, -5, 18, 10); g.restore(); } g.restore(); }
  function catAt(C, x, z, ry, t, o, y) { C.root.visible = true; C.root.position.set(x, y || 0, z); C.root.rotation.set(0, ry, 0); poseCat(C, t, o); }
  const lap = (t) => Math.sin(t * 14) > 0;

  // ---------- Shots ----------
  // 0 Hook: Bühne im Wohnzimmer. Katze sitzt vor Futter + Wasser direkt nebeneinander und schaut skeptisch, Rudi am Buzzer-Pult
  KZ.shot("wHook", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(foodB, FX, FZ, 0); place(waterB, FX + .38, FZ, 0);
    catAt(cat, FX + .85, FZ + .05, PI, t, { pose: "sit", ears: .35, lid: .35, look: .25 });
    rudiAtPodium(t, { mouth: "smile", wide: true });
    frameOn([rudi, podium, cat, foodB, waterB], { az: lerp(.62, .56, k), el: .16, fill: lerp(.98, 1.04, k), t }); draw();
    stage(1, t); });
  // 1 Show-Opener: Leuchtschild, Konfetti, Rudi winkt am Pult
  KZ.shot("wShow", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(foodB, FX, FZ, 0); place(waterB, FX + .38, FZ, 0);
    catAt(cat, FX + 1.05, FZ + .05, PI, t, { pose: "sit", ears: .2, lid: .4 }); cat.root.visible = false;
    rudiAtPodium(t, { free: true, arms: [.25, 2.6], wave: true, mouth: ph > .6 ? "o" : "smile", wide: true });
    frameOn([rudi, podium], { az: lerp(.45, .35, k), el: .14, fill: lerp(.72, .8, k), dy: .35, t }); draw();
    stage(1, t); confetti(t, 36, 1); showSign((lt - .1) / .45, t, H * .18); });
  // 2 Runde 1: Rudi stellt den Wassernapf direkt neben den Futternapf
  KZ.shot("wRound1", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph), put = sm((ph - .25) / .3);
    place(foodB, FX, FZ, 0); place(waterB, FX + .38, FZ, 0); waterB.root.position.y = (1 - put) * .9; waterB.root.visible = put > 0;
    catAt(cat, FX + 1.05, FZ + .05, PI, t, { pose: "sit", ears: .15, look: .2 });
    place(rudi, FX + .1, FZ - .55, -.15); poseRudi(rudi, t, { arms: [.2, lerp(1.1, .7, put)], spread: .05, nod: -.15 * put, mouth: "smile" });
    frameOn([rudi, cat, foodB], { az: lerp(.4, .32, k), el: .22, fill: lerp(.86, .92, k), t }); draw();
    roundCard(L("ROUND 1", "RUNDE 1"), lt / .25);
    if (ph > .55) stamp(L("HANDY!", "PRAKTISCH!"), W * .44, H * .62, (ph - .55) * d / .3, "#36b37e", -.06); });
  // 3 Katze läuft an den Näpfen vorbei und trinkt aus der Blumenvase -> Buzzer FALSCH
  KZ.shot("wVase", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph), go = sm(ph / .35), dr = sm((ph - .35) / .15);
    place(foodB, FX, FZ, 0); place(waterB, FX + .38, FZ, 0); place(vase, VX, VZ, 0);
    const cx = lerp(FX + .9, VX - .6, go), cz = lerp(FZ + .05, VZ, go);
    catAt(cat, cx, cz, go < 1 ? -.35 : 0, t, { pose: "stand", walk: go < 1 ? 1 : 0, drink: dr, hy: .44, nod: -.75 * dr, lick: dr > .5 && lap(t), lid: dr > .5 ? .5 : 0 });
    place(rudi, FX - .35, FZ - .5, .2); poseRudi(rudi, t, { arms: ph > .55 ? [1.2, 1.2] : [.2, .2], spread: ph > .55 ? .4 : .05, mouth: ph > .5 ? "o" : "smile", wide: ph > .55 });
    if (ph < .35) frameOn([rudi, cat, vase, foodB], { az: lerp(.42, .38, k), el: .2, fill: .9, t }); else { rudi.root.visible = false; foodB.root.visible = false; waterB.root.visible = false; frameOn([cat, vase], { az: lerp(.9, .8, k), el: .22, fill: .8, t }); } draw();
    if (ph > .55) { wrongFlash((ph - .55) * d / .5); stamp(L("WRONG!", "FALSCH!"), W * .44, H * .2, (ph - .55) * d / .3, "#e5484d", -.07); }
    if (ph > .2 && ph < .55) stamp(L("THE VASE?!", "DIE VASE?!"), W * .44, H * .62, (ph - .2) * d / .3, "#2f6fd0", .06); });
  // 4 Runde 2: goldener Doppelnapf glitzert, Katze springt auf den Couchtisch und trinkt aus Rudis Glas
  KZ.shot("wRound2", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph), pop = sm(ph / .2), dr = sm((ph - .55) / .12);
    place(dbl, FX + .2, FZ, 0); dbl.root.scale.setScalar(.001 + easeBack(pop)); dbl.sp.forEach((s, i) => { s.position.set(Math.cos(t * 2 + i * 1.3) * .42, .3 + Math.sin(t * 3 + i) * .12, Math.sin(t * 2 + i * 1.3) * .22); s.rotation.y = t * 4; s.visible = ph < .6; });
    place(table, TBX, TBZ, 0); table.root.updateMatrixWorld(true); const gp = table.glass.getWorldPosition(new T.Vector3());
    if (ph < .45) catAt(cat, FX + 1.0, FZ + .05, PI, t, { pose: "sit", ears: .3, lid: .4, look: .3 });
    else { const j = sm((ph - .45) / .1); const x = lerp(FX + 1.0, gp.x - .58, j), z = lerp(FZ + .05, gp.z, j), y = lerp(0, .45, j) + Math.sin(j * PI) * .35;
      catAt(cat, x, z, j < 1 ? lerp(PI, 0, j) : 0, t, { pose: "stand", drink: dr, hy: .27, nod: -.7 * dr, lick: dr > .5 && lap(t), lid: dr > .5 ? .5 : 0 }, y); }
    place(rudi, FX - .95, FZ - .35, .25); poseRudi(rudi, t, { arms: ph < .5 ? [1.9, 1.9] : [1.2, 1.2], spread: ph < .5 ? .5 : .3, mouth: ph < .5 ? "smile" : "o", wide: true });
    if (ph < .5) frameOn([rudi, dbl, cat, table], { az: lerp(.4, .34, k), el: .24, fill: .9, t }); else { rudi.root.visible = false; dbl.root.visible = false; frameOn([cat, table], { az: lerp(.75, .65, k), el: .2, fill: .9, t }); } draw();
    roundCard(L("ROUND 2", "RUNDE 2"), lt / .25);
    if (ph < .5) stamp(L("GOLD BOWL!", "GOLD-NAPF!"), W * .44, H * .62, (lt - .35) / .3, "#ffb800", -.06);
    else { wrongFlash((ph - .62) * d / .5); stamp("BZZZT!", W * .44, H * .62, (ph - .62) * d / .3, "#e5484d", .07); } });
  // 5 Studio: Futter und Wasser direkt nebeneinander = X, Wasser rutscht weg = Haken, Pfeil "Abstand"
  KZ.shot("wFact", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph), mv = sm((ph - .45) / .3);
    place(sFood, -.55, .25, 0); place(sWater, lerp(-.15, .75, mv), .25, 0); sFood.root.scale.setScalar(1.6); sWater.root.scale.setScalar(1.6);
    catAt(bigCat, .1, -.45, -.25, t, { pose: "sit", ears: mv < .5 ? .5 : 0, lid: mv > .5 ? .2 : .4, look: lerp(.5, -.2, mv) });
    frameOn([bigCat, sFood, sWater], { az: lerp(.16, .08, k), el: .45, fill: lerp(.8, .86, k), dy: -.05, t }); draw();
    sFood.root.updateMatrixWorld(true); sWater.root.updateMatrixWorld(true);
    const [ax, ay] = scr(sFood.root.localToWorld(V(0, .25, 0))), [bx, by] = scr(sWater.root.localToWorld(V(0, .25, 0)));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    if (mv < .5) { const p = clamp((lt - .3) / .3, 0, 1); g.globalAlpha = p * (1 - mv * 2); g.strokeStyle = "#e5484d"; g.lineWidth = 22; g.lineCap = "round"; const cx = (ax + bx) / 2, cy = Math.min(ay, by) - 70; g.beginPath(); g.moveTo(cx - 55, cy - 55); g.lineTo(cx + 55, cy + 55); g.moveTo(cx + 55, cy - 55); g.lineTo(cx - 55, cy + 55); g.stroke(); }
    if (mv > .5) { const p = clamp((mv - .5) * 2, 0, 1); g.globalAlpha = p; g.strokeStyle = "#ffffff"; g.fillStyle = "#ffffff"; g.lineWidth = 10; const y = Math.min(ay, by) - 60; g.setLineDash([22, 16]); g.beginPath(); g.moveTo(ax + 40, y); g.lineTo(bx - 40, y); g.stroke(); g.setLineDash([]);
      for (const [x, s] of [[ax + 30, -1], [bx - 30, 1]]) { g.beginPath(); g.moveTo(x, y); g.lineTo(x - s * 30, y - 22); g.lineTo(x - s * 30, y + 22); g.closePath(); g.fill(); }
      g.strokeStyle = "#36b37e"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.moveTo(bx - 45, by - 160); g.lineTo(bx - 10, by - 125); g.lineTo(bx + 55, by - 200); g.stroke(); }
    g.restore();
    stamp(L("NOT SIDE BY SIDE", "NICHT DANEBEN"), W * .44, H * .2, (lt - .15) / .3, "#e5484d", -.06);
    if (mv > .6) stamp(L("SPACE!", "ABSTAND!"), W * .44, H * .62, (mv - .6) * 2.5, "#36b37e", .06); });
  // 6 Studio: Wildkatze frisst die Maus links, läuft zum Wasserloch rechts und trinkt dort
  KZ.shot("wWild", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph), go = sm((ph - .3) / .35), dr = sm((ph - .65) / .12);
    place(mouse, -.95, .2, 0); place(puddle, 1.05, .1, 0);
    const x = lerp(-.55, .25, go);
    catAt(bigCat, x, .2, 0, t, { pose: "stand", walk: go > 0 && go < 1 ? 1 : 0, drink: go <= 0 ? .7 : dr, hy: .1, nod: go <= 0 ? -.4 : -.8 * dr, lick: dr > .5 && lap(t) });
    if (go <= 0) bigCat.root.rotation.y = PI;
    frameOn([bigCat, mouse, puddle], { az: lerp(.2, .1, k), el: .3, fill: lerp(1.0, 1.06, k), t }); draw();
    mouse.root.updateMatrixWorld(true); puddle.root.updateMatrixWorld(true);
    const [mx, my] = scr(mouse.root.localToWorld(V(0, .3, 0))), [px, py] = scr(puddle.root.localToWorld(V(0, .3, 0)));
    txt(L("EAT", "FRESSEN"), mx, my - 70, 50, "#ffd23f", { stroke: 10, a: clamp(lt / .3, 0, 1) });
    txt(L("DRINK", "TRINKEN"), px + 20, py - 150, 50, "#4fb3ff", { stroke: 10, a: clamp((ph - .25) * 4, 0, 1) });
    stamp(L("WILDCAT", "WILDKATZE"), W * .44, H * .2, (lt - .15) / .3, "#ff9f43", -.06);
    if (ph > .7) stamp(L("CLEAN ✓", "SAUBER ✓"), W * .44, H * .62, (ph - .7) * d / .3, "#36b37e", .06); });
  // 7 Studio: Messbecher 200 ml pro Tag (4-kg-Katze), Füllstand bleibt weit drunter, Blase + Nieren
  KZ.shot("wLittle", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    catAt(bigCat, 0, 0, -.5, t, { pose: "sit", ears: .3, lid: .3, look: -.3 });
    frameOn([bigCat], { az: lerp(.3, .2, k), el: .3, fill: .5, dy: .75, t }); draw();
    const gx = W * .44, top = H * .19, bot = H * .41, gw = 230, lvl = .78, fill = sm((lt - .3) / .9) * .32;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(lt / .3, 0, 1);
    g.fillStyle = "rgba(255,255,255,.18)"; g.beginPath(); g.roundRect(gx - gw / 2, top, gw, bot - top, [10, 10, 40, 40]); g.fill();
    const fy = bot - (bot - top) * fill; g.fillStyle = "#4fb3ff"; g.beginPath(); g.roundRect(gx - gw / 2 + 10, fy + Math.sin(t * 4) * 4, gw - 20, bot - fy - 10, [6, 6, 32, 32]); g.fill();
    g.strokeStyle = "#ffffff"; g.lineWidth = 8; g.beginPath(); g.roundRect(gx - gw / 2, top, gw, bot - top, [10, 10, 40, 40]); g.stroke();
    const ly = bot - (bot - top) * lvl; g.setLineDash([18, 12]); g.strokeStyle = "#ffd23f"; g.lineWidth = 8; g.beginPath(); g.moveTo(gx - gw / 2 - 30, ly); g.lineTo(gx + gw / 2 + 30, ly); g.stroke(); g.setLineDash([]);
    g.restore();
    txt("200 ml", gx, ly - 38, 52, "#ffd23f", { stroke: 10, a: clamp((lt - .2) / .3, 0, 1) });
    txt(L("4 kg cat / day", "4-kg-Katze / Tag"), gx, bot + 42, 40, "#ffffff", { stroke: 8, a: clamp((lt - .3) / .3, 0, 1) });
    txt("?", gx, bot - (bot - top) * fill - 50, 80, "#ffffff", { stroke: 10, a: clamp((ph - .35) * 4, 0, 1) });
    stamp(L("TOO LITTLE", "ZU WENIG"), W * .44, H * .105, (lt - .1) / .3, "#e5484d", -.06);
    txt(L("Source: Cats Protection", "Quelle: Cats Protection"), gx, bot + 90, 32, "#ffffff", { stroke: 7, a: clamp((lt - .5) / .3, 0, 1) });
    if (ph > .55) stamp(L("KIDNEYS!", "BLASE + NIEREN"), W * .44, H * .505, (ph - .55) * d / .3, "#ff9f43", .05); });
  // 8 Pointe: Näpfe getrennt, Katze trinkt endlich, Rudi gewinnt (Konfetti, Arme hoch)
  KZ.shot("wWin", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph), mv = sm(ph / .35), dr = sm((ph - .35) / .15);
    place(foodB, FX - .2, FZ, 0); const wx = lerp(FX + .18, FX + 1.05, mv), wz = lerp(FZ, FZ - .45, mv); place(waterB, wx, wz, 0);
    catAt(cat, wx - .62, wz, 0, t, { pose: "stand", walk: dr <= 0 ? 1 : 0, drink: dr, hy: .17, nod: -.85 * dr, lick: dr > .5 && lap(t), lid: dr > .5 ? .6 : 0 });
    if (dr <= 0) { cat.root.position.x = lerp(FX + .4, wx - .62, mv); }
    rudiAtPodium(t, { free: true, arms: [2.6 + Math.sin(t * 8) * .15, .3], spread: .15, mouth: "smile", wide: true, walk: 0 });
    frameOn([rudi, podium, cat, waterB], { az: lerp(.5, .44, k), el: .18, fill: lerp(.9, .94, k), t }); draw();
    stage(.7, t); if (ph > .45) confetti(t, 40, 1);
    if (ph > .5) stamp(L("GRAND PRIZE!", "HAUPTPREIS!"), W * .44, H * .2, (ph - .5) * d / .3, "#ffb800", -.06); });
  // 9 Tipp: Katze trinkt entspannt aus breiter Schale, Tippkarte mit Quellen
  KZ.shot("wTip", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(waterB, VX - .1, VZ + .15, 0); waterB.root.scale.setScalar(1.25); place(foodB, FX - .9, FZ + .1, 0);
    catAt(cat, VX - .1 - .5, VZ + .05, -.7, t, { pose: "sit", lick: Math.sin(t * 5) > .3, lid: .45, look: .35, tilt: Math.sin(t * 2) * .08 });
    foodB.root.visible = false; frameOn([cat, waterB], { az: lerp(.7, .6, k), el: .3, fill: lerp(.7, .76, k), dy: .15, t }); draw();
    const cp = sm((lt - .2) / .3); if (card(W * .44, H * .22, 820, 330, cp, "iCatCare + Cats Protection", "#36b37e")) {
      const a = clamp(cp, 0, 1);
      txt(L("✓ away from food + litter", "✓ weg von Futter + Klo"), W * .44, H * .22 - 20, 40, "#1d2250", { a });
      txt(L("✓ wide bowl", "✓ breite Schale"), W * .44, H * .22 + 40, 40, "#1d2250", { a: clamp((lt - .9) / .3, 0, 1) * a });
      txt(L("✓ filled to the brim", "✓ randvoll"), W * .44, H * .22 + 100, 40, "#1d2250", { a: clamp((lt - 1.6) / .3, 0, 1) * a }); }
    waterB.root.scale.setScalar(1.25); });
  // 10 Loop: zurück zur Hook-Einstellung (Bühne, Näpfe nebeneinander)
  KZ.shot("wLoop", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(foodB, FX, FZ, 0); place(waterB, FX + .38, FZ, 0);
    catAt(cat, FX + .85, FZ + .05, PI, t, { pose: "sit", ears: .35, lid: .35, look: .25 });
    rudiAtPodium(t, { mouth: "smile", wide: true, press: ph > .6 ? 1 : 0 });
    frameOn([rudi, podium, cat, foodB, waterB], { az: lerp(.58, .56, k), el: .16, fill: lerp(1.0, .98, k), t }); draw();
    stage(sm((ph - .2) / .6), t);
    if (ph > .4) stamp(L("WHY?", "WARUM?"), W * .44, H * .62, (ph - .4) * d / .3, "#7a5cff", -.06); });

  window.__catwater3d = true;
})();
