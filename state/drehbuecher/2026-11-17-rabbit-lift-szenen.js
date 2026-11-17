// 3D-Szene "Why Your Bunny Hates Being Picked Up" (17.11.2026). Hauskaninchen (wildfarben/agouti), Wohnzimmer, Habicht im Garten,
// Kissen, Kaninchen-Aufzug, Karton, Studio-Infografiken (Balken, Herzfrequenz). Quellen: RSPCA, PDSA, Vet Times (Bradbury 2016), Mullan & Main 2007.
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let bun, bigBun, rudi, hawk, room, roomBg, pillow, lift, box, bars, gauge, puffs, hearts;

  // ---------- Hauskaninchen (eigener Entwurf: wildfarben braun, cremefarbener Bauch, weiße Blume, lange Ohren, große Hinterpfoten) ----------
  function makeBunny() {
    const fur = M(0xb98a5e, { roughness: .8 }), furD = M(0x9a6f48, { roughness: .8 }), cream = M(0xf6e7cf, { roughness: .85 }), white = M(0xffffff, { roughness: .9 });
    const pink = M(0xffa3b1, { roughness: .6 }), eyeM = M(0x2a1610, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(fur, -.08, .22, 0, .27, .23, .24));          // Hinterteil
    body.add(sph(fur, .1, .25, 0, .18, .19, .17));            // Brust
    body.add(sph(cream, .15, .2, 0, .12, .14, .13));          // heller Bauch/Brust
    body.add(sph(cream, -.02, .09, 0, .24, .1, .17));         // Bauchseite unten
    body.add(sph(furD, -.12, .38, 0, .16, .07, .14));         // dunklerer Rücken
    const tail = sph(white, -.34, .27, 0, .075, .075, .075); body.add(tail);
    // Hinterbeine (Gelenk an der Hüfte, große lange Pfoten)
    const hind = []; for (const s of [-1, 1]) { const hl2 = new T.Group(); hl2.position.set(-.1, .16, s * .15); body.add(hl2);
      hl2.add(sph(fur, 0, 0, 0, .13, .13, .07)); const foot = sph(cream, .1, -.125, 0, .16, .042, .06); hl2.add(foot); hind.push(hl2); }
    // Vorderpfoten
    const front = []; for (const s of [-1, 1]) { const f = limb(.035, .16, fur); f.position.set(.17, .17, s * .075); f.add(sph(cream, .025, -.165, 0, .05, .028, .04)); body.add(f); front.push(f); }
    // Kopf
    const head = new T.Group(); head.position.set(.24, .43, 0); body.add(head);
    head.add(sph(fur, 0, 0, 0, .15, .14, .135));
    for (const s of [-1, 1]) head.add(sph(cream, .1, -.045, s * .042, .06, .052, .055)); // Schnauze
    const nose = sph(pink, .155, -.012, 0, .022, .018, .026); head.add(nose);
    const mo = mesh(new T.TorusGeometry(.016, .005, 6, 12, PI), M(0x6a3a30), .158, -.07, 0); mo.rotation.set(0, PI / 2, PI); head.add(mo);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.065, .035, s * .1); head.add(e);
      e.add(sph(eyeM, 0, 0, 0, .048, .056, .036)); e.add(sph(hl, .025, .022, .02 * s, .013)); eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, furD, .07, .1, s * .09, .05, .012, .02); head.add(b); brows.push(b); }
    const wh = M(0xffffff, { roughness: .4 }); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .12, -.04 + i * .02, s * .1, .004, .16, .004); w.rotation.x = s * (PI / 2 - .25 + i * .18); w.castShadow = false; head.add(w); }
    // Ohren: lang, flach, innen rosa (Gelenk an der Basis)
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.04, .1, s * .055); head.add(e);
      e.add(sph(fur, 0, .2, 0, .035, .22, .07)); const inner = sph(pink, .02, .2, 0, .02, .17, .05); e.add(inner); ears.push(e); }
    return { root, body, head, ears, eyes, brows, nose, hind, front, tail };
  }
  // o: {ears 0 aufrecht..1 angelegt, wide, kick 0..1 (strampeln), dangle (Beine hängen), lid, hop 0..1 (Sprung-Streckung), look, tilt}
  function poseBunny(B, t, o) {
    o = o || {};
    const ea = o.ears || 0; B.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.set(s * (.12 + ea * .05), 0, ea * 1.25 + Math.sin(t * 2.3 + i) * .04 * (1 - ea)); });
    B.head.rotation.set(o.tilt || 0, o.look || 0, (o.nod || 0) + Math.sin(t * 1.6) * .02);
    B.nose.scale.set(.022, .018 * (1 + Math.sin(t * 22) * .18), .026);
    const lid = o.lid ?? (Math.sin(t * 1.4 + 1) > .985 ? .85 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.22 : 1), o.wide ? 1.1 : 1));
    B.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.wide ? -.35 : 0); b.position.y = o.wide ? .115 : .1; });
    const k = o.kick || 0, hop = o.hop || 0, dg = o.dangle || 0;
    B.hind.forEach((h, i) => { h.rotation.z = -(k * (1.0 + Math.sin(t * 26 + i * 2) * .5)) - hop * 1.1 - dg * .6; });
    B.front.forEach((f, i) => { f.rotation.z = k * Math.sin(t * 24 + i * 1.5) * .6 + hop * .9 + dg * .5; });
    B.body.rotation.z = hop * .25 + (o.lean || 0); B.body.position.y = Math.sin(t * 2) * .004;
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Habicht (eigener Entwurf: braun, gestreifter heller Bauch, gelber Hakenschnabel, gelbe Fänge) ----------
  function makeHawk() {
    const br = M(0x7a4e2d, { roughness: .7 }), brD = M(0x5a3820, { roughness: .7 }), belly = M(0xf3e6cf, { roughness: .8 }), yel = M(0xffc21a, { roughness: .45 }), dark = M(0x1a1010, { roughness: .2 });
    const root = new T.Group();
    root.add(sph(br, 0, 0, 0, .42, .2, .22));
    root.add(sph(belly, .08, -.06, 0, .3, .14, .17));
    for (let i = 0; i < 4; i++) root.add(sph(brD, .12 - i * .1, -.15, 0, .03, .02, .12));
    const head = new T.Group(); head.position.set(.42, .1, 0); root.add(head);
    head.add(sph(br, 0, 0, 0, .17, .15, .15)); head.add(sph(belly, .06, -.06, 0, .1, .07, .11));
    const beak = mesh(new T.ConeGeometry(.055, .16, 20), yel, .2, -.02, 0); beak.rotation.z = -PI / 2 - .5; head.add(beak);
    head.add(sph(dark, .21, -.06, 0, .025));
    for (const s of [-1, 1]) { head.add(sph(M(0xffd84d, { roughness: .2 }), .1, .04, s * .1, .045)); head.add(sph(dark, .13, .04, s * .115, .025)); head.add(sph(M(0xffffff, { emissive: 0xffffff }), .14, .055, s * .125, .009));
      const brow = mesh(BOX, brD, .1, .1, s * .1, .1, .03, .05); brow.rotation.set(s * .2, 0, -.35); head.add(brow); }
    const tail = mesh(new T.ConeGeometry(.2, .45, 4), brD, -.55, .02, 0, 1, 1, .3); tail.rotation.z = PI / 2; root.add(tail);
    const wings = []; for (const s of [-1, 1]) { const wg = new T.Group(); wg.position.set(.05, .08, s * .15); root.add(wg);
      const w1 = sph(br, 0, 0, s * .45, .3, .05, .48); wg.add(w1); const w2 = sph(brD, -.12, 0, s * .85, .22, .04, .28); wg.add(w2); wings.push(wg); }
    const legs = []; for (const s of [-1, 1]) { const l = limb(.04, .22, yel); l.position.set(.12, -.12, s * .08); for (const a of [-.5, 0, .5]) { const c = mesh(new T.ConeGeometry(.018, .09, 8), dark, .03 + Math.cos(a) * .05, -.24, Math.sin(a) * .05); c.rotation.z = -PI / 2 - .6; l.add(c); } root.add(l); legs.push(l); }
    return { root, wings, legs, head };
  }
  function poseHawk(Hk, t, o) { o = o || {}; Hk.wings.forEach((w, i) => { const s = i ? 1 : -1; w.rotation.x = s * (Math.sin(t * (o.flap || 9)) * .45 - .1); });
    Hk.legs.forEach((l) => l.rotation.z = -(o.grab || 0) * 1.0 - .2); Hk.root.rotation.z = o.dive || 0; }

  // ---------- Wohnzimmer (wie Katzen-Video) ----------
  function makeRoom() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(512, 512, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = ["#c8935e", "#bd8752", "#d29d68", "#c28c58"][i % 4]; c.fillRect(0, i * h / 8, w, h / 8); c.fillStyle = "rgba(90,50,20,.35)"; c.fillRect(0, i * h / 8, w, 3); c.fillRect((i * 173) % w, i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(6, 6);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    const wallTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#e3f0e0"; c.fillRect(0, 0, w, h); c.fillStyle = "#d5e8d0"; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h); });
    wallTex.wrapS = wallTex.wrapT = T.RepeatWrapping; wallTex.repeat.set(10, 3);
    r.add(mesh(BOX, new T.MeshStandardMaterial({ map: wallTex, roughness: .9 }), 0, 2.5, -3, 30, 5, .2));
    r.add(mesh(BOX, M(0xffffff), 0, .08, -2.88, 30, .16, .06));
    const sky = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb6ff"); gr.addColorStop(1, "#cdeeff"); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = "#ffffff"; c.beginPath(); c.arc(70, 90, 26, 0, 7); c.arc(100, 80, 32, 0, 7); c.arc(130, 92, 24, 0, 7); c.fill(); });
    const win = new T.Mesh(new T.PlaneGeometry(1.6, 1.4), new T.MeshStandardMaterial({ map: sky, emissive: 0xffffff, emissiveMap: sky, emissiveIntensity: .5 })); win.position.set(-2.4, 2.3, -2.89); r.add(win);
    const fr = M(0xffffff, { roughness: .5 }); for (const [x, y, sx, sy] of [[-2.4, 3.03, 1.75, .08], [-2.4, 1.57, 1.75, .08], [-3.24, 2.3, .08, 1.5], [-1.56, 2.3, .08, 1.5], [-2.4, 2.3, .05, 1.4], [-2.4, 2.3, 1.6, .05]]) r.add(mesh(BOX, fr, x, y, -2.87, sx, sy, .06));
    const pic = canvasTex(256, 200, (c, w, h) => { c.fillStyle = "#ffd23f"; c.fillRect(0, 0, w, h); c.fillStyle = "#ff6b8a"; c.beginPath(); c.arc(90, 110, 50, 0, 7); c.fill(); c.fillStyle = "#2f6fd0"; c.beginPath(); c.arc(170, 80, 36, 0, 7); c.fill(); });
    r.add(mesh(BOX, M(0x5a3a2a), 1.9, 2.5, -2.88, 1.0, .8, .04)); const pm = new T.Mesh(new T.PlaneGeometry(.88, .68), new T.MeshStandardMaterial({ map: pic })); pm.position.set(1.9, 2.5, -2.85); r.add(pm);
    const rug = new T.Mesh(new T.CircleGeometry(1.8, 48), M(0xb84a5e, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(.2, .006, -.2); rug.scale.set(1.3, .8, 1); rug.receiveShadow = true; r.add(rug);
    const rug2 = new T.Mesh(new T.RingGeometry(1.45, 1.6, 48), M(0xffd23f, { roughness: 1 })); rug2.rotation.x = -PI / 2; rug2.position.set(.2, .008, -.2); rug2.scale.set(1.3, .8, 1); r.add(rug2);
    // Sofa hinten
    const sofa = new T.Group(); sofa.position.set(.6, 0, -2.3); r.add(sofa);
    const teal = M(0x2f8f9d, { roughness: .8 }), tealD = M(0x257480, { roughness: .85 });
    sofa.add(mesh(BOX, tealD, 0, .22, 0, 2.4, .36, .95)); for (const x of [-.55, .55]) sofa.add(mesh(BOX, teal, x, .45, .04, 1.08, .14, .86));
    sofa.add(mesh(BOX, teal, 0, .85, -.38, 2.4, .8, .24)); for (const x of [-1.27, 1.27]) sofa.add(mesh(BOX, teal, x, .5, 0, .2, .62, .95));
    for (const x of [-.95, .95]) sofa.add(sph(M(0xffd23f, { roughness: .8 }), x, .7, -.18, .2, .2, .07));
    // Kaninchen-Ecke: Heuraufe + Wassernapf
    const hay = new T.Group(); hay.position.set(-1.9, 0, -2.2); r.add(hay); hay.add(mesh(BOX, M(0x8a5a3a), 0, .3, 0, .6, .6, .3));
    for (let i = 0; i < 9; i++) { const st = mesh(CYL, M(i % 2 ? 0xe8d27a : 0xd4bb5c), -.25 + i * .06, .66, 0, .012, .2, .012); st.rotation.z = (i % 3 - 1) * .3; hay.add(st); }
    hay.add(mesh(new T.CylinderGeometry(.16, .12, .08, 24), M(0x2f6fd0, { roughness: .3 }), .55, .04, .1));
    // Pflanze
    const pl = new T.Group(); pl.position.set(2.3, 0, -2.4); r.add(pl); pl.add(mesh(new T.CylinderGeometry(.25, .18, .45, 24), M(0xe0703c), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const a = i / 7 * 2 * PI; const lf = sph(M(i % 2 ? 0x4fae4a : 0x3f9a3c), Math.cos(a) * .2, .75 + (i % 3) * .1, Math.sin(a) * .2, .1, .35, .05); lf.rotation.set(Math.sin(a) * .5, -a, Math.cos(a) * .5); pl.add(lf); }
    return r;
  }

  // ---------- Requisiten ----------
  function makePillow() { const root = new T.Group(); const m = M(0xff7aa8, { roughness: .9 });
    root.add(sph(m, 0, 0, 0, .34, .09, .3)); for (const [x, z] of [[-.3, -.26], [.3, -.26], [-.3, .26], [.3, .26]]) root.add(sph(M(0xffd23f), x, 0, z, .04));
    root.add(sph(M(0xffffff, { roughness: .9 }), 0, .07, 0, .05, .02, .05)); return { root }; }
  function tileTex(word, col, fs) { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = col; c.beginPath(); c.roundRect(0, 0, w, h, 60); c.fill(); c.fillStyle = "#fff"; c.font = `900 ${fs || 92}px "Montserrat"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(word, w / 2, h / 2 + 4); }); }
  function tile(word, col, fs) { const grp = new T.Group(); grp.add(mesh(BOX, M(new T.Color(col).multiplyScalar(.7).getHex(), { roughness: .4 }), 0, 0, -.06, 1.6, .8, .12));
    const f = new T.Mesh(new T.PlaneGeometry(1.6, .8), new T.MeshStandardMaterial({ map: tileTex(word, col, fs), roughness: .4 })); f.position.z = .001; grp.add(f); grp.traverse((m) => { m.castShadow = false; }); return grp; }
  // Kaninchen-Aufzug: Sockel, zwei Säulen, Schild oben, Plattform fährt hoch, Kurbel an der Seite
  function makeLift() { const root = new T.Group(); const pole = M(0xe5484d, { roughness: .4 }), metal = M(0xc5ced8, { metalness: .8, roughness: .3 });
    root.add(mesh(BOX, M(0x3b4a8a), 0, .06, 0, .9, .12, .8));
    for (const z of [-.36, .36]) root.add(mesh(CYL, pole, -.38, 1.2, z, .05, 2.3, .05));
    const sign = tile("BUNNY LIFT", "#2f6fd0", 76); sign.scale.setScalar(.55); sign.position.set(-.38, 2.45, 0); sign.rotation.y = PI / 2 - .9; root.add(sign);
    root.add(mesh(BOX, pole, -.38, 2.33, 0, .1, .08, .82));
    const plat = new T.Group(); root.add(plat); plat.add(mesh(BOX, M(0xffd23f, { roughness: .5 }), 0, 0, 0, .7, .06, .62));
    for (const z of [-.31, .31]) plat.add(mesh(BOX, metal, 0, .1, z, .7, .03, .03));
    const crank = new T.Group(); crank.position.set(-.38, .9, .45); root.add(crank);
    crank.add(mesh(new T.TorusGeometry(.14, .025, 8, 24), metal)); const handle = mesh(CYL, M(0x2a2a2a), .14, 0, .06, .025, .12, .025); handle.rotation.x = PI / 2; crank.add(handle);
    return { root, plat, crank }; }
  // Karton (offen), Kaninchen-Kopf/Ohren schauen raus
  function makeBox() { const root = new T.Group(); const cb = M(0xc89a5e, { roughness: .9 }), cbD = M(0xa97c45, { roughness: .9 });
    root.add(mesh(BOX, cb, 0, .02, 0, .7, .04, .6)); root.add(mesh(BOX, cb, 0, .25, .3, .7, .5, .03)); root.add(mesh(BOX, cbD, 0, .25, -.3, .7, .5, .03));
    root.add(mesh(BOX, cb, .35, .25, 0, .03, .5, .6)); root.add(mesh(BOX, cbD, -.35, .25, 0, .03, .5, .6));
    for (const s of [-1, 1]) { const fl = mesh(BOX, cb, 0, .5, s * .42, .7, .02, .26); fl.rotation.x = s * .5; root.add(fl); }
    root.add(mesh(BOX, M(0xe8d9b5), 0, .3, .316, .72, .08, .01));
    return { root }; }
  function makeBars() { const root = new T.Group(); const list = [];
    for (const [x, col, lab, val] of [[-.62, 0xe5484d, "LIFTED A LOT", "LESS"], [.62, 0x36b37e, "LEFT ON FLOOR", "MORE"]]) {
      const grp = new T.Group(); grp.position.x = x; root.add(grp);
      const bar = mesh(BOX, M(col, { roughness: .35 }), 0, .5, 0, .64, 1, .64); grp.add(bar);
      const lt = tile(lab, "#1d2250", 56); lt.scale.setScalar(.6); lt.position.set(0, .26, .4); grp.add(lt);
      const vt = tile(val, "#" + new T.Color(col).getHexString(), 110); vt.scale.setScalar(.4); grp.add(vt);
      list.push({ grp, bar, vt }); }
    return { root, list }; }
  // Herzfrequenz-Anzeige: Röhre mit steigendem roten Balken + Herz oben
  function heartGeo() { const s = new T.Shape(); s.moveTo(0, -.5); s.bezierCurveTo(-.9, .1, -.5, .75, 0, .35); s.bezierCurveTo(.5, .75, .9, .1, 0, -.5);
    const geo = new T.ExtrudeGeometry(s, { depth: .18, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 4, curveSegments: 20 }); geo.center(); return geo; }
  function makeGauge() { const root = new T.Group();
    root.add(mesh(new T.CylinderGeometry(.16, .16, 1.6, 32), M(0xffffff, { roughness: .1, transparent: true, opacity: .35 }), 0, .8, 0));
    const fillB = mesh(new T.CylinderGeometry(.12, .12, 1, 32), M(0xff3355, { roughness: .3, emissive: 0x550010 }), 0, .5, 0); root.add(fillB);
    root.add(mesh(new T.CylinderGeometry(.22, .22, .08, 32), M(0x3b4a8a), 0, .04, 0));
    const ht = mesh(heartGeo(), M(0xff4d6d, { roughness: .3 }), 0, 1.85, 0, .3, .3, .3); root.add(ht);
    const lab = tile("HEART RATE", "#1d2250", 66); lab.scale.setScalar(.55); lab.position.set(0, 2.3, 0); root.add(lab);
    root.traverse((m) => { m.castShadow = false; });
    return { root, fillB, ht }; }
  function makePuffs() { const root = new T.Group(); const list = []; for (let i = 0; i < 6; i++) { const p = sph(M(0xffffff, { roughness: 1 }), 0, 0, 0, .1); p.castShadow = false; root.add(p); list.push(p); } return { root, list }; }
  function makeHearts() { const root = new T.Group(); const geo = heartGeo(), m = M(0xff4d6d, { roughness: .3 }); const list = [];
    for (let i = 0; i < 4; i++) { const h = mesh(geo, m); h.castShadow = false; h.scale.setScalar(.12); root.add(h); list.push(h); } return { root, list }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bun = actor(makeBunny(), "Kaninchen"); bigBun = actor(makeBunny(), "Kaninchen gross"); hawk = actor(makeHawk(), "Habicht");
    pillow = actor(makePillow(), "Kissen"); lift = actor(makeLift(), "Aufzug"); box = actor(makeBox(), "Karton");
    bars = actor(makeBars(), "Balken"); gauge = actor(makeGauge(), "Herzfrequenz"); puffs = actor(makePuffs(), "Wolken"); hearts = actor(makeHearts(), "Herzen");
    for (const a of [bars, gauge, puffs, hearts]) a.noCheck = true;
    room = makeRoom(); roomBg = new T.Color(0xe3f0e0).convertSRGBToLinear();
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function inRoom() { begin("yard"); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xe3f0e0, 16, 40); K3.hemi.intensity = .8; reset(); }
  function inYard() { begin("yard"); room.visible = false; reset(); }
  function studio() { begin("studio"); room.visible = false; reset(); }
  function reset() { rudi.noCheck = false; bigBun.head.position.set(.24, .43, 0); for (const b of [bun, bigBun]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = false; } rudi.body.position.set(0, 0, 0); rudi.legs.forEach((l) => l.rotation.set(0, 0, 0)); }
  const RX = -.45, RZ = -.55, RRY = -.35; // Rudi-Standplatz im Wohnzimmer
  function rudiAt(t, o) { place(rudi, RX, RZ, RRY); poseRudi(rudi, t, Object.assign({ arms: [.1, .1], spread: .1, mouth: "smile" }, o || {})); rudi.root.updateMatrixWorld(true); }
  // Mitte zwischen Rudis Händen (Weltkoordinaten)
  function hands() { const a = rudi.arms[0].localToWorld(V(0, -.62, 0)), b = rudi.arms[1].localToWorld(V(0, -.62, 0)); return a.add(b).multiplyScalar(.5); }
  function bunAt(x, y, z, ry) { bun.root.visible = true; bun.root.position.set(x, y, z); bun.root.rotation.set(0, ry || 0, 0); }

  // ---------- Shots ----------
  // 0 Hook: Rudi hebt das Kaninchen hoch (Kuscheln!), es strampelt, springt aus den Händen und flitzt weg
  KZ.shot("rHook", (lt, d, t) => { inRoom(); const ph = lt / d, up = sm(ph / .3), go = clamp((ph - .58) / .42, 0, 1);
    rudiAt(t, { arms: [lerp(.55, 1.3, up), lerp(.55, 1.3, up)], spread: .02, wide: go > 0, mouth: go > 0 ? "o" : "smile", lean: -.12 * (1 - up) });
    const h = hands();
    if (go <= 0) { bun.noCheck = true; bunAt(lerp(h.x + .5, h.x + .02, up), lerp(0, h.y - .2, up), lerp(h.z + .45, h.z, up), RRY - .9); poseBunny(bun, t, { ears: sm((ph - .15) / .2), wide: ph > .2, kick: sm((ph - .25) / .15), dangle: up * .4 }); }
    else { const x = lerp(h.x + .02, h.x + .5, go), y = lerp(h.y - .2, 0, sm(go)) + Math.sin(go * PI) * .35; bun.noCheck = go < .65; bunAt(x - go * .75, Math.max(0, y), h.z + go * 1.1, lerp(RRY - .9, -1.75, go)); poseBunny(bun, t, { ears: 1 - go * .5, wide: true, hop: Math.sin(clamp(go * 1.4, 0, 1) * PI) }); }
    frameOn([rudi, bun], { az: lerp(.5, .4, ph), el: .1, fill: lerp(.95, 1.0, ph), t }); draw();
    if (ph > .08 && go <= 0) stamp("CUDDLE TIME", W * .4, H * .64, (ph - .08) * d / .3, "#ff5d8f", -.06);
    if (go > .02) stamp("NOPE", W * .4, H * .64, go * d * .42 / .3, "#e5484d", .07); });
  // 1 Kaninchen in Rudis Händen (riesige Augen), Schnitt: Garten, Habicht stößt herab
  KZ.shot("rHawk", (lt, d, t) => { const half = lt > d * .42;
    if (!half) { inRoom(); const k = sm(lt / (d * .42)); rudiAt(t, { arms: [1.3, 1.3], spread: .02, mouth: "smile" }); const h = hands();
      bun.noCheck = true; bunAt(h.x + .02, h.y - .2, h.z, RRY - .9); poseBunny(bun, t, { ears: 1, wide: true, dangle: .5, kick: .25 });
      rudi.noCheck = true; frameOn([bun], { az: lerp(.35, .25, k), el: .1, fill: lerp(.5, .58, k), dy: .1, t }); draw();
      stamp("LIFTED", W * .42, H * .17, (lt - .15) / .3, "#ff9f1c", -.06); }
    else { inYard(); const k = sm((lt - d * .42) / (d * .58));
      bunAt(.3, 0, .6, .3); poseBunny(bun, t, { ears: 1, wide: true, lean: 0 });
      hawk.root.visible = true; hawk.root.position.set(lerp(-.9, -.05, k), lerp(2.1, 1.05, k), .6); hawk.root.rotation.set(0, 0, 0); hawk.root.scale.setScalar(1.25); poseHawk(hawk, t, { dive: lerp(-.55, -.15, k), grab: k, flap: 10 });
      frameOn([bun, hawk], { az: lerp(.2, .14, k), el: .12, fill: .9, t }); draw();
      stamp("HAWK?!", W * .42, H * .17, (lt - d * .48) / .3, "#e5484d", .06); } });
  // 2 Kissen: Rudi hebt es ganz sanft auf einem Kissen, Schnitt: es schießt wie eine Rakete davon
  KZ.shot("rPillow", (lt, d, t) => { inRoom(); const ph = lt / d, half = ph > .52;
    const up = sm(clamp(ph / .5, 0, 1)) * .18; rudiAt(t, { arms: [.78 + up, .78 + up], spread: .02, mouth: half ? "o" : "smile", wide: half });
    const h = hands().add(V(.94, 0, .34).multiplyScalar(.18)); pillow.root.visible = true; pillow.root.position.set(h.x + .05, h.y + .02, h.z); pillow.root.rotation.set(0, RRY, 0); pillow.noCheck = true;
    puffs.root.visible = false;
    if (!half) { bun.noCheck = true; bunAt(h.x + .05, h.y + .1, h.z, RRY - .9); poseBunny(bun, t, { ears: .7, wide: true }); }
    else { const go = clamp((ph - .52) / .4, 0, 1), e = sm(go); bun.noCheck = true; const x = h.x + .05 + e * 1.8, y = h.y + .1 + Math.sin(go * PI * .9) * 1.2 - e * (h.y * .5);
      bunAt(x, Math.max(0, y), h.z + e * .4, RRY - .5); bun.root.rotation.z = -.4 * Math.sin(go * PI); poseBunny(bun, t, { ears: 1, wide: true, hop: 1 });
      puffs.root.visible = true; puffs.list.forEach((p, i) => { const q = clamp(go * 1.3 - i * .1, 0, 1), ii = i / 6; p.visible = q > 0 && q < 1; p.position.set(h.x + .05 + sm(q * .8) * 1.8 * (1 - ii * .6), h.y + .15 + Math.sin(q * PI * .6) * .9 * (1 - ii * .5), h.z + .1 * Math.sin(i * 3)); p.scale.setScalar(.06 + q * .14); }); }
    frameOn([rudi], { az: lerp(.48, .38, ph), el: .1, fill: lerp(.95, 1.0, ph), t }); draw();
    if (!half) stamp("SO GENTLE", W * .42, H * .17, (lt - d * .12) / .3, "#ff5d8f", -.06);
    else stamp("LAUNCH!", W * .42, H * .17, (ph - .54) * d / .3, "#ff9f1c", .07); });
  // 3 Kaninchen-Aufzug: Rudi kurbelt, Plattform fährt hoch; Schnitt: Kaninchen versteckt sich im Karton
  KZ.shot("rLift", (lt, d, t) => { inRoom(); const ph = lt / d, half = ph > .5;
    place(lift, .55, -.25, 0); place(rudi, -.85, .05, -.25);
    if (!half) { const k = sm(ph / .5), py = .12 + sm(clamp((ph - .08) / .42, 0, 1)) * 1.3;
      poseRudi(rudi, t, { arms: [.2, 1.25 + Math.sin(t * 9) * .25], spread: .1, mouth: "smile" });
      lift.plat.position.set(.05, py, 0); lift.crank.rotation.z = -t * 6; box.root.visible = false;
      bunAt(.6, py + .03, -.25, -.6); bun.noCheck = true; poseBunny(bun, t, { ears: .5 + .5 * k, wide: k > .5 });
      frameOn([lift, rudi], { az: lerp(.42, .34, k), el: .12, fill: lerp(.88, .94, k), t }); draw();
      stamp("BUNNY LIFT", W * .42, H * .17, (lt - d * .1) / .3, "#2f6fd0", -.06); }
    else { const k = sm((ph - .5) / .5); lift.plat.position.set(.05, 1.42, 0); lift.crank.rotation.z = 0;
      poseRudi(rudi, t, { arms: [.2, .2], spread: .35, mouth: "o", wide: true });
      place(box, 1.3, .45, -.35); const peek = sm((ph - .6) / .2); rudi.root.visible = false; lift.root.visible = false;
      bunAt(1.3, lerp(-.2, .06, peek), .45, -.9); bun.noCheck = true; poseBunny(bun, t, { ears: .05, wide: true, look: .2 });
      frameOn([box], { az: lerp(.3, .2, k), el: .2, fill: lerp(.55, .62, k), dy: .1, t }); draw();
      stamp("HIDING", W * .42, H * .17, (ph - .58) * d / .3, "#7a5cff", .06); } });
  // 4 Studio: großes Kaninchen schwebt vom Sockel hoch, Beine hängen, keine Fluchtmöglichkeit + Quellenkarte (Vet Times)
  KZ.shot("rPrey", (lt, d, t) => { studio(); const k = sm(lt / d), up = sm(clamp(lt / (d * .45), 0, 1));
    bigBun.root.visible = true; bigBun.root.position.set(0, up * .7, 0); bigBun.root.rotation.set(0, -.25, 0); poseBunny(bigBun, t, { ears: up, wide: up > .3, dangle: up, kick: up > .6 ? .3 : 0, sc: 2.2 });
    frameOn([bigBun], { az: lerp(.25, .12, k), el: .1, fill: lerp(.55, .62, k), dy: -.25, t }); draw();
    stamp("PREY ANIMAL", W * .42, H * .17, (lt - .15) / .3, "#ff9f1c", -.06);
    const cp = sm((lt - d * .45) / .3); if (card(W * .42, H * .6, 880, 250, cp, "Vet Times · vet Guen Bradbury", "#2f6fd0")) {
      txt("“Being lifted off the ground is", W * .42, H * .6 + 10, 38, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("usually a precursor to death”", W * .42, H * .6 + 60, 38, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 5 Studio: Balken "kommt zum Besitzer": oft hochgehoben vs. am Boden gelassen
  KZ.shot("rBars", (lt, d, t) => { studio(); const k = sm(lt / d);
    place(bars, 0, 0, 0); const hs = [.5, 1.45]; const g1 = sm((lt - .1) / .5), g2 = sm((lt - d * .35) / .5);
    bars.list.forEach((b, i) => { const hh = hs[i] * Math.max(.02, i ? g2 : g1); b.bar.scale.y = hh; b.bar.position.y = hh / 2; b.vt.position.set(0, hh + .3, 0); b.vt.visible = (i ? g2 : g1) > .3; });
    frameOn([bars], { az: lerp(.18, .06, k), el: .16, fill: lerp(.7, .76, k), dy: -.55, t }); draw();
    txt("CAME TO OWNER", W * .42, H * .2, 70, "#ffffff", { stroke: 10, a: clamp(lt / .3, 0, 1) });
    const cp = sm((lt - .3) / .3); if (card(W * .42, H * .64, 820, 110, cp)) txt("Mullan & Main · Veterinary Record, 2007", W * .42, H * .64, 32, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 6 Studio: Kaninchen auf dem Rücken ("Trance") = Totstellen, Herzfrequenz steigt
  KZ.shot("rTrance", (lt, d, t) => { studio(); const k = sm(lt / d), ph = lt / d;
    bigBun.root.visible = true; bigBun.root.rotation.set(PI, -.15, 0); bigBun.root.position.set(-.35, 1.0, 0);
    poseBunny(bigBun, t, { ears: 1.15, wide: true, lid: 0, sc: 2.2 }); bigBun.body.rotation.z = 0; bigBun.head.position.set(.38, .22, 0); bigBun.head.rotation.z = .5; bigBun.hind.forEach((h) => h.rotation.z = -.5 + Math.sin(t * 30) * .03); bigBun.front.forEach((f) => f.rotation.z = .6);
    place(gauge, 1.25, -.1, 0); const hr = .25 + sm(clamp((ph - .3) / .5, 0, 1)) * .95; gauge.fillB.scale.y = hr * 1.5; gauge.fillB.position.y = hr * .75 + .02;
    const beat = 1 + Math.max(0, Math.sin(t * (6 + hr * 10))) * .12 * hr; gauge.ht.scale.setScalar(.3 * beat);
    frameOn([bigBun, gauge], { az: lerp(.2, .1, k), el: .3, fill: lerp(.8, .86, k), dy: -.1, t }); draw();
    if (ph < .5) stamp("RELAXED?", W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    else stamp("PLAYING DEAD", W * .42, H * .17, (ph - .5) * d / .3, "#e5484d", .06);
    const cp = sm((lt - d * .55) / .3); if (card(W * .42, H * .64, 700, 110, cp)) txt("Source: RSPCA", W * .42, H * .64, 36, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 7 Pointe: Rudi kratzt sich am Kopf neben dem Aufzug, Kaninchen-Ohren schauen aus dem Karton
  KZ.shot("rOverkill", (lt, d, t) => { inRoom(); const k = sm(lt / d);
    place(lift, .55, -.25, 0); lift.plat.position.set(.05, 1.42, 0); place(rudi, -.85, .05, -.25); poseRudi(rudi, t, { arms: [2.75, .2], spread: .1, mouth: "o", tilt: -.12 });
    
    frameOn([lift, rudi], { az: lerp(.34, .28, k), el: .12, fill: lerp(.86, .9, k), t }); draw();
    if (lt > d * .35) stamp("OVERKILL", W * .42, H * .17, (lt - d * .35) / .3, "#7a5cff", .06); });
  // 8 Tipp: Rudi sitzt auf dem Boden, Kaninchen hoppelt von selbst zu ihm, Herzen
  KZ.shot("rTip", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph);
    place(rudi, -.5, -.1, -.3); poseRudi(rudi, t, { arms: [.35, .55], spread: .25, mouth: "smile" });
    rudi.body.position.y = -.6; rudi.legs.forEach((l) => l.rotation.z = PI / 2 - .05);
    const come = sm(clamp((ph - .1) / .55, 0, 1)), hopP = ph > .1 && ph < .65 ? Math.abs(Math.sin(t * 7)) : 0;
    bunAt(lerp(1.8, .8, come), hopP * .12, lerp(.9, .45, come), lerp(PI - .5, PI - .2, come)); poseBunny(bun, t, { hop: hopP * .8, ears: 0, lid: ph > .75 ? .5 : undefined });
    hearts.root.visible = ph > .72; hearts.list.forEach((hh, i) => { const p = clamp((ph - .72 - i * .04) / .16, 0, 1); hh.visible = p > 0; hh.position.set(.25 + i * .18, .75 + p * .6 + i * .06, .1 + Math.sin(i) * .1); hh.rotation.y = t * 2 + i; hh.scale.setScalar(.11 * easeBack(p) + .001); });
    frameOn([rudi, bun], { az: lerp(.4, .3, k), el: .2, fill: lerp(.95, 1.0, k), dy: -.2, t }); draw();
    if (ph < .5) stamp("FLOOR LEVEL", W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06);
    else stamp("LET IT COME", W * .42, H * .17, (ph - .5) * d / .3, "#2f6fd0", .06); });
  // 9 Loop: zurück zur Hook-Einstellung (Rudi greift nach dem Kaninchen am Boden)
  KZ.shot("rLoop", (lt, d, t) => { inRoom(); const ph = lt / d;
    rudiAt(t, { arms: [lerp(.2, .55, sm(ph)), lerp(.2, .55, sm(ph))], spread: .02, mouth: "smile", lean: -.12 * sm(ph) });
    const h = hands(); bunAt(h.x + .5, 0, h.z + .45, RRY - .9); bun.noCheck = true; poseBunny(bun, t, { ears: .2 * ph });
    frameOn([rudi, bun], { az: lerp(.56, .5, ph), el: .1, fill: lerp(.93, .95, ph), t }); draw();
    if (ph > .3) stamp("HATES CUDDLES?", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__rabbit3d = true;
})();
