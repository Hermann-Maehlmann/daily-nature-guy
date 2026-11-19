// 3D-Szene "Why You Shouldn't Stop Your Bunny Eating Its Poop" (19.11.2026). Hauskaninchen (aus dem Kaninchen-Bad-Video vom 18.11.,
// erweitert um "curl" = Kopf nach hinten zum Po gedreht, und Halskrause/Leckschutz-Trichter), harte Köttel, Blinddarmkot als
// "Trauben-Büschel" (Caecotrophe), Besen + Kehrschaufel, Heuhaufen, Studio-Infografiken (zwei Kotsorten, Kreislauf, Protein-Balken, Akku).
// Quellen: House Rabbit Society (rabbit.org/care/cecotropes), Companion Animals eXtension (Cooperative Extension).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let bun, bigBun, rudi, pellets, ceco, bigCeco, bigPel, broom, hay, ring;

  // ---------- Hauskaninchen (wildfarben braun, cremefarbener Bauch, weiße Blume, lange Ohren, große Hinterpfoten) ----------
  const FUR = 0xb98a5e;
  function makeBunny(col) {
    const furC = col || FUR;
    const fur = M(furC, { roughness: .8 }), furD = M(new T.Color(furC).multiplyScalar(.8).getHex(), { roughness: .8 }), cream = M(0xf6e7cf, { roughness: .85 }), white = M(0xffffff, { roughness: .9 });
    const pink = M(0xffa3b1, { roughness: .6 }), eyeM = M(0x2a1610, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(fur, -.08, .22, 0, .27, .23, .24));
    body.add(sph(fur, .1, .25, 0, .18, .19, .17));
    body.add(sph(cream, .15, .2, 0, .12, .14, .13));
    body.add(sph(cream, -.02, .09, 0, .24, .1, .17));
    body.add(sph(furD, -.12, .38, 0, .16, .07, .14));
    const tail = sph(white, -.34, .27, 0, .075, .075, .075); body.add(tail);
    const hind = []; for (const s of [-1, 1]) { const hl2 = new T.Group(); hl2.position.set(-.1, .16, s * .15); body.add(hl2);
      hl2.add(sph(fur, 0, 0, 0, .13, .13, .07)); const foot = sph(cream, .1, -.125, 0, .16, .042, .06); hl2.add(foot); hind.push(hl2); }
    const front = []; for (const s of [-1, 1]) { const f = limb(.035, .16, fur); f.position.set(.17, .17, s * .075); f.add(sph(cream, .025, -.165, 0, .05, .028, .04)); body.add(f); front.push(f); }
    const head = new T.Group(); head.position.set(.24, .43, 0); body.add(head);
    head.add(sph(fur, 0, 0, 0, .15, .14, .135));
    for (const s of [-1, 1]) head.add(sph(cream, .1, -.045, s * .042, .06, .052, .055));
    const nose = sph(pink, .155, -.012, 0, .022, .018, .026); head.add(nose);
    const mo = mesh(new T.TorusGeometry(.016, .005, 6, 12, PI), M(0x6a3a30), .158, -.07, 0); mo.rotation.set(0, PI / 2, PI); head.add(mo);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.065, .035, s * .1); head.add(e);
      e.add(sph(eyeM, 0, 0, 0, .048, .056, .036)); e.add(sph(hl, .025, .022, .02 * s, .013)); eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, furD, .07, .1, s * .09, .05, .012, .02); head.add(b); brows.push(b); }
    const wh = M(0xffffff, { roughness: .4 }); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .12, -.04 + i * .02, s * .1, .004, .16, .004); w.rotation.x = s * (PI / 2 - .25 + i * .18); w.castShadow = false; head.add(w); }
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.04, .1, s * .055); head.add(e);
      e.add(sph(fur, 0, .2, 0, .035, .22, .07)); const inner = sph(pink, .02, .2, 0, .02, .17, .05); e.add(inner); ears.push(e); }
    // Halskrause (Leckschutz-Trichter): durchsichtig hellblau, weites Ende vorne vor der Nase, enges Ende hinter dem Kopf
    const coneM = new T.MeshStandardMaterial({ color: new T.Color(0x9fd8ff).convertSRGBToLinear(), roughness: .25, transparent: true, opacity: .42, side: T.DoubleSide, depthWrite: false });
    const cone = new T.Mesh(new T.CylinderGeometry(.36, .2, .34, 36, 1, true), coneM); cone.rotation.z = -PI / 2; cone.position.set(.1, 0, 0); cone.castShadow = false; cone.visible = false; head.add(cone);
    const coneRim = mesh(new T.TorusGeometry(.36, .012, 8, 36), M(0x5fb0ff, { roughness: .4 }), .27, 0, 0); coneRim.rotation.y = PI / 2; coneRim.castShadow = false; coneRim.visible = false; head.add(coneRim);
    return { root, body, head, ears, eyes, brows, nose, hind, front, tail, fur, furD, furC, cone, coneRim };
  }
  // o: {ears 0 aufrecht..1 angelegt, wide, lid, look, tilt, nod, lean, sc, sad, angry, happy, curl 0..1 (Kopf dreht nach hinten zum Po), chew, cone, thin, shiver}
  function poseBunny(B, t, o) {
    o = o || {};
    const cu = o.curl || 0, cn = !!o.cone;
    const ea = cn ? 1 : (o.ears || 0) * (1 - cu) + cu * .7;
    B.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.set(s * (.12 + ea * .05), 0, ea * 1.25 + Math.sin(t * 2.3 + i) * .04 * (1 - ea)); });
    // curl: Kopf wandert an die Flanke und schaut nach hinten zum Po (wie echte Kaninchen beim Fressen der Blinddarmköttel)
    const ch = o.chew ? Math.sin(t * 14) * .04 : 0;
    B.head.position.set(lerp(.24, -.06, cu), lerp(.43, .3, cu), lerp(0, .25, cu));
    B.head.rotation.set((o.tilt || 0) + cu * .25, (o.look || 0) - cu * (PI - .55), (o.nod || 0) + Math.sin(t * 1.6) * .02 - cu * .35 + ch);
    B.nose.scale.set(.022, .018 * (1 + Math.sin(t * 22) * .18), .026);
    const lid = o.lid ?? (Math.sin(t * 1.4 + 1) > .985 ? .85 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.22 : 1), o.wide ? 1.1 : 1));
    B.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.angry ? .4 : (o.wide ? -.35 : (o.sad ? .35 : 0))); b.position.y = o.wide ? .115 : .1; });
    const hop = o.hop || 0;
    B.hind.forEach((h) => { h.rotation.z = -hop * 1.1; });
    B.front.forEach((f) => { f.rotation.z = hop * .9; });
    B.body.rotation.z = hop * .25 + (o.lean || 0) + cu * .08;
    const sh = o.shiver ? Math.sin(t * 55) * .01 : 0;
    B.body.position.set(sh, Math.sin(t * 2) * .004 + (o.happy ? Math.abs(Math.sin(t * 6)) * .05 : 0), 0);
    B.cone.visible = B.coneRim.visible = cn;
    const th = o.thin || 0; B.body.scale.set(1 - th * .12, 1 - th * .05, 1 - th * .2);
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Kot: harte runde Köttel und Blinddarmkot-Büschel ("Trauben") ----------
  function makePellets(n, r) { const root = new T.Group(); const m = M(0x7a5434, { roughness: .95 }), list = [];
    for (let i = 0; i < n; i++) { const a = i * 2.399, rr = Math.sqrt(i / n) * r * 4.2; const p = sph(m, Math.cos(a) * rr, r * .9, Math.sin(a) * rr, r, r * .92, r); p.castShadow = false; root.add(p); list.push(p); }
    return { root, list }; }
  function makeCeco(r) { const root = new T.Group(); const m = M(0x3b4a24, { roughness: .18, metalness: .05 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: .6 });
    const pts = [[0, 0, 0], [1.7, 0, 0], [-1.7, 0, 0], [.85, 0, 1.5], [-.85, 0, 1.5], [.85, 0, -1.5], [-.85, 0, -1.5], [0, 1.5, .5], [.85, 1.5, -.9], [-.85, 1.5, -.9], [0, 2.9, -.3]];
    for (const [x, y, z] of pts) { root.add(sph(m, x * r * .58, r + y * r * .55, z * r * .58, r)); root.add(sph(hl, x * r * .58 + r * .45, r + y * r * .55 + r * .5, z * r * .58 + r * .45, r * .16)); }
    root.traverse((c) => c.castShadow = false); return { root }; }
  // Besen: Stiel (stick zwischen Hand und Boden) + Borstenkopf
  function makeBroom() { const root = new T.Group(); const wood = M(0xb87a45, { roughness: .6 }), straw = M(0xf2c14e, { roughness: .9 }), band = M(0xe5484d, { roughness: .5 });
    const stickM = mesh(CYL, wood, 0, 0, 0, .025, 1, .025); root.add(stickM);
    const headG = new T.Group(); root.add(headG); headG.add(mesh(new T.CylinderGeometry(.06, .17, .26, 16), straw, 0, .13, 0)); headG.add(mesh(CYL, band, 0, .25, 0, .065, .04, .065));
    return { root, stickM, headG }; }
  // Heuhaufen
  function makeHay() { const root = new T.Group(); const m1 = M(0xe8c766, { roughness: .9 }), m2 = M(0xc9a64a, { roughness: .9 }), m3 = M(0x9fbf5a, { roughness: .9 });
    root.add(sph(m1, 0, .08, 0, .38, .14, .3));
    for (let i = 0; i < 70; i++) { const a = i * 2.399, r = Math.sqrt((i % 35) / 35) * .34; const s = mesh(CYL, [m1, m2, m3][i % 3], Math.cos(a) * r, .1 + (i % 5) * .03, Math.sin(a) * r * .8, .007, .32, .007);
      s.rotation.set(Math.sin(i * 1.3) * 1.3, i, PI / 2 + Math.cos(i * .7) * .6); s.castShadow = false; root.add(s); }
    return { root }; }
  // Kreislauf-Ring (Studio): leuchtende Ellipse vor dem Kaninchen mit wandernden Kugeln
  function makeRing() { const root = new T.Group(); const rm = M(0x7ad3ff, { emissive: 0x1d6fae, emissiveIntensity: .9, roughness: .3 });
    const tor = mesh(new T.TorusGeometry(1, .018, 8, 80), rm); tor.scale.set(.95, .55, 1); root.add(tor);
    const balls = []; const bm = [M(0x67d36a, { emissive: 0x1d6a1f, emissiveIntensity: .8 }), M(0x3b4a24, { emissive: 0x20280e, emissiveIntensity: .5, roughness: .2 }), M(0xffd23f, { emissive: 0x8a6a00, emissiveIntensity: .9 })];
    for (let i = 0; i < 6; i++) { const b = sph(bm[i % 3], 0, 0, 0, .06); root.add(b); balls.push(b); }
    root.traverse((c) => c.castShadow = false); return { root, tor, balls }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bun = actor(makeBunny(), "Kaninchen"); bigBun = actor(makeBunny(), "Kaninchen gross");
    pellets = actor(makePellets(9, .028), "Koettel"); ceco = actor(makeCeco(.024), "Nachtkot"); bigCeco = actor(makeCeco(.09), "Nachtkot gross"); bigPel = actor(makePellets(7, .09), "Koettel gross");
    broom = actor(makeBroom(), "Besen"); hay = actor(makeHay(), "Heu"); ring = actor(makeRing(), "Kreislauf");
    for (const a of [pellets, ceco, bigCeco, bigPel, broom, hay, ring]) a.noCheck = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { rudi.noCheck = false; rudi.body.position.set(0, 0, 0);
    for (const b of [bun, bigBun]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = false; }
    for (const p of [pellets, ceco, bigCeco, bigPel, hay, ring]) { p.root.scale.setScalar(1); p.root.rotation.set(0, 0, 0); }
    pellets.list.forEach((p) => p.visible = true); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function local(B, x, y, z) { B.root.updateMatrixWorld(true); return B.body.localToWorld(V(x, y, z)); }
  function headPos(B, dx, dy) { B.root.updateMatrixWorld(true); return B.head.localToWorld(V(dx || 0, dy ?? .12, 0)); }
  function stick(m, a, b, r) { const d = b.clone().sub(a); m.position.copy(a).add(d.clone().multiplyScalar(.5)); m.scale.set(r, d.length(), r); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); }
  function hand(i) { return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function hands() { rudi.root.updateMatrixWorld(true); return hand(0).add(hand(1)).multiplyScalar(.5); }
  // Nachtkot-Büschel direkt am Maul des eingerollten Kaninchens
  function cecoAtMouth(B, C, sc) { C.root.visible = true; B.root.updateMatrixWorld(true); const p = B.head.localToWorld(V(.19, -.1, 0)); C.root.position.set(p.x, Math.max(0, p.y - .09 * (sc || 1)), p.z); C.root.scale.setScalar(sc || 1); }
  function broomAt(hp, foot) { broom.root.visible = true; broom.root.position.set(0, 0, 0); stick(broom.stickM, hp, foot.clone().add(V(0, .22, 0)), .025);
    broom.headG.position.copy(foot); broom.headG.quaternion.copy(broom.stickM.quaternion); }
  function battery(x, y, lv, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(x - 90, y - 45, 180, 90, 16); g.fill(); g.fillRect(x + 90, y - 18, 16, 36);
    g.fillStyle = "#1d2250"; g.beginPath(); g.roundRect(x - 80, y - 35, 160, 70, 10); g.fill(); g.fillStyle = lv < .3 ? "#e5484d" : "#36b37e"; g.beginPath(); g.roundRect(x - 74, y - 29, Math.max(6, 148 * lv), 58, 7); g.fill(); g.restore(); }

  // ---------- Shots ----------
  // Hook-Einstellung: Kaninchen dreht den Kopf zum Po, vor dem Maul der Trauben-Büschel
  function hookFrame(lt, d, t, ph) {
    at(bun, 0, 0, 0, 0); poseBunny(bun, t, { curl: 1, chew: true, lid: .25 }); cecoAtMouth(bun, ceco, 1.3);
    place(pellets, .55, -.5, 0); pellets.root.scale.setScalar(.9);
    frameOn([FR(-.45, 0, -.25, .4, .7, .5)], { az: lerp(-.45, -.38, ph), el: .2, fill: lerp(1.05, 1.13, ph), dy: -.07, t }); draw(); }
  KZ.shot("pHook", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(lt, d, t, ph);
    if (ph > .45) stamp("GROSS?!", W * .42, H * .66, (ph - .45) * d / .3, "#8a5a33", -.06); });
  // 1 Rudi erwischt das Kaninchen, Hände an die Wangen, Augen weit
  KZ.shot("pPanic", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    at(bun, -.3, 0, .3, 0); poseBunny(bun, t, { curl: 1, chew: true, sc: 1.35 }); cecoAtMouth(bun, ceco, 1.55);
    place(rudi, .75, -.35, PI + .6); poseRudi(rudi, t, { arms: [2.7 + Math.sin(t * 9) * .08, 2.6 - Math.sin(t * 9) * .08], spread: .5, mouth: "o", wide: true, lean: .08 + k * .04 });
    frameOn([bun, rudi], { az: lerp(-.4, -.34, k), el: .12, fill: lerp(.95, 1.02, k), t }); draw();
    stamp("EWWW!", W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06); });
  // 2 Rudi fegt alle Köttel weg; Schnitt: Kaninchen frisst direkt vom Po, Rudi starrt
  KZ.shot("pSweep", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .48;
    if (!half) { const k = ph / .48; at(bun, -.45, 0, .35, -.5); poseBunny(bun, t, { wide: true, ears: .2, look: .2, sc: 1.35 });
      place(pellets, .05, .45, 0); const gone = Math.floor(k * 1.3 * pellets.list.length); pellets.list.forEach((p, i) => p.visible = i >= gone);
      place(rudi, .85, -.2, PI + .6); poseRudi(rudi, t, { arms: [.85 + Math.sin(t * 7) * .12, .7 + Math.sin(t * 7) * .12], spread: .02, mouth: "smile", nod: .1 }); rudi.noCheck = true;
      const hp = hands(); broomAt(hp, V(.15 + Math.sin(t * 7) * .22, 0, .5));
      frameOn([rudi, bun], { az: lerp(.05, -.02, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw();
      stamp("SPOTLESS!", W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", -.06); }
    else { const k = (ph - .48) / .52; at(bun, -.3, 0, .3, 0); poseBunny(bun, t, { curl: sm(clamp(k / .25, 0, 1)), chew: k > .25, sc: 1.35 }); if (k > .2) cecoAtMouth(bun, ceco, 1.55);
      place(rudi, .8, -.35, PI + .6); poseRudi(rudi, t, { arms: [.15, .15], spread: .15, mouth: "o", wide: true, lean: -.06 }); broomAt(hands(), V(1.2, 0, -.1)); rudi.noCheck = true;
      frameOn([bun, rudi], { az: lerp(-.4, -.34, k), el: .14, fill: lerp(1.0, 1.06, k), t }); draw();
      stamp("FROM THE SOURCE", W * .42, H * .17, (k - .15) * d * .52 / .3, "#8a5a33", .05); } });
  // 3 Rudi setzt dem Kaninchen einen riesigen Trichter auf; Schnitt: Kaninchen kommt nicht mehr ran, Magen knurrt
  KZ.shot("pCone", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .45;
    if (!half) { const k = ph / .45; at(bun, -.6, 0, .35, -.5); poseBunny(bun, t, { cone: true, wide: true, look: .1, sc: 1.35 });
      place(rudi, .8, -.3, PI + .6); poseRudi(rudi, t, { arms: [1.1 + Math.sin(t * 4) * .1, 1.1 - Math.sin(t * 4) * .1], spread: .05, mouth: "smile", tilt: .05 });
      frameOn([bun, rudi], { az: lerp(.05, -.02, k), el: .13, fill: lerp(.84, .88, k), t }); draw();
      stamp("NO MORE POOP", W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", -.06); }
    else { const k = (ph - .45) / .55; rudi.root.visible = false; at(bun, 0, 0, 0, 0); const tries = Math.sin(t * 5) * .5 + .5;
      poseBunny(bun, t, { cone: true, sad: true, look: -tries * .5, lid: .3 });
      place(ceco, -.45, 0, .12); ceco.root.scale.setScalar(1.5);
      frameOn([FR(-.5, 0, -.35, .45, .75, .35)], { az: lerp(.75, .68, k), el: .16, fill: lerp(1.0, 1.06, k), t }); draw();
      stamp("GRRRUMBLE", W * .42, H * .17, k * d * .55 / .3 + .3, "#e5484d", .06); } });
  // 4 Studio: zwei Kotsorten nebeneinander (harte Köttel vs. Trauben-Büschel) + House-Rabbit-Society-Zitat
  KZ.shot("pTwo", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(bigPel, -.5, 0, 0); bigPel.root.rotation.y = t * .3; bigPel.root.scale.setScalar(1.2); place(bigCeco, .5, 0, 0); bigCeco.root.scale.setScalar(1.3); bigCeco.root.rotation.y = -t * .4;
    frameOn([FR(-.95, 0, -.4, .9, .5, .4)], { az: lerp(.1, .04, k), el: .3, fill: lerp(.95, 1.0, k), dy: -.05, t }); draw();
    const a = clamp((lt - .2) / .3, 0, 1); txt("DAY", W * .2, H * .41, 52, "#ffffff", { a, stroke: 8 }); txt("NIGHT", W * .56, H * .41, 52, "#ffd84d", { a: clamp((lt - .6) / .3, 0, 1), stroke: 8 });
    stamp("NIGHT DROPPINGS", W * .42, H * .17, (lt - .15) / .3, "#7a5cff", -.06);
    const cp = sm((lt - d * .4) / .3); if (card(W * .42, H * .63, 900, 210, cp, "HOUSE RABBIT SOCIETY", "#2f6fd0")) {
      txt("“Cecotrope droppings look like", W * .42, H * .63 + 6, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("tiny bunches of grapes.”", W * .42, H * .63 + 52, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 5 Studio: Kreislauf – Kugeln (Gras grün, Nachtkot, Vitamine gelb) wandern im Ring vom Po zurück zum Maul
  KZ.shot("pTwice", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bigBun, 0, 0, 0, 0); poseBunny(bigBun, t, { sc: 1.5, chew: true, lid: .2 });
    place(ring, 0, .55, .45); ring.root.position.y = .55; ring.root.scale.setScalar(.85);
    ring.balls.forEach((b, i) => { const a = -t * 1.6 + i * PI / 3; b.position.set(Math.cos(a) * .95, Math.sin(a) * .55, 0); });
    frameOn([FR(-.85, 0, -.3, .85, 1.1, .5)], { az: lerp(.1, .02, k), el: .1, fill: lerp(.84, .9, k), dy: -.12, t }); draw();
    stamp("ROUND TWO", W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .35) / .3); if (card(W * .42, H * .63, 900, 160, cp, "", "#2f6fd0")) {
      txt("grass → gut bacteria → night poop", W * .42, H * .63 - 18, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("→ eaten again for vitamins", W * .42, H * .63 + 28, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 6 Studio: großer Trauben-Büschel dreht sich, Protein-Balken füllt sich auf 30 %
  KZ.shot("pProtein", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(bigCeco, 0, 0, 0); bigCeco.root.scale.setScalar(1.5); bigCeco.root.rotation.y = t * .5;
    frameOn([FR(-.5, 0, -.5, .5, .85, .5)], { az: lerp(.2, .1, k), el: .25, fill: lerp(.7, .78, k), dy: -.14, t }); draw();
    stamp("PROTEIN BOMB", W * .42, H * .17, (lt - .15) / .3, "#ff7a1a", -.06);
    const cp = sm((lt - d * .2) / .3); if (card(W * .42, H * .63, 900, 230, cp, "HOUSE RABBIT SOCIETY", "#2f6fd0")) { const a = clamp(cp, 0, 1);
      const fill = sm(clamp((lt - d * .25) / (d * .35), 0, 1)) * .3; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a;
      g.fillStyle = "#e6e9f5"; g.beginPath(); g.roundRect(W * .42 - 380, H * .63 - 10, 760, 56, 28); g.fill(); g.fillStyle = "#ff7a1a"; g.beginPath(); g.roundRect(W * .42 - 380, H * .63 - 10, Math.max(56, 760 * fill), 56, 28); g.fill(); g.restore();
      txt("up to " + Math.round(fill * 100) + "% protein", W * .42, H * .63 + 82, 36, "#1d2250", { a }); } });
  // 7 Kaninchen mit Trichter wird dünn und müde, Akku leert sich + Extension-Zitat
  KZ.shot("pWeak", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bigBun, 0, 0, 0, -.45); poseBunny(bigBun, t, { cone: true, sad: true, thin: sm(clamp(ph / .6, 0, 1)), lid: lerp(.2, .5, k), shiver: true, sc: 1.4 });
    frameOn([FR(-.55, 0, -.6, .75, .95, .6)], { az: lerp(.35, .28, k), el: .12, fill: lerp(.74, .78, k), dy: -.12, t }); draw();
    battery(W * .42, H * .2, lerp(.85, .12, sm(clamp(ph / .7, 0, 1))), clamp(lt / .3, 0, 1));
    const cp = sm((lt - d * .35) / .3); if (card(W * .42, H * .63, 920, 210, cp, "COOPERATIVE EXTENSION", "#2f6fd0")) {
      txt("“Without them, rabbits ... could", W * .42, H * .63 + 6, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("eventually become malnourished.”", W * .42, H * .63 + 52, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 8 Pointe: Rudi hält verlegen den Trichter, Kaninchen hoppelt fröhlich und dreht sich zum Po
  KZ.shot("pOver", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(rudi, .75, -.35, PI + .6); poseRudi(rudi, t, { arms: [1.9 + Math.sin(t * 2) * .05, .2], spread: .1, mouth: "smile", tilt: .12, nod: .06 }); rudi.noCheck = true;
    rudi.root.updateMatrixWorld(true); const hp = hand(1); bun.cone.visible = false;
    at(bun, -.3, 0, .3, 0); poseBunny(bun, t, { sc: 1.35, curl: ph > .45 ? sm(clamp((ph - .45) / .2, 0, 1)) : 0, happy: ph < .45, chew: ph > .6 }); if (ph > .55) cecoAtMouth(bun, ceco, 1.55);
    // Trichter in Rudis Hand (eigene Kopie als Requisite)
    coneProp.visible = true; coneProp.position.set(1.3, .2, .25); coneProp.rotation.set(0, .4, PI / 2 - .25);
    frameOn([rudi, bun, { root: coneProp }], { az: lerp(-.3, -.36, k), el: .12, fill: lerp(.92, .96, k), t }); draw();
    if (ph > .3) stamp("OVERKILL", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", .06); });
  let coneProp;
  K3.onBuild(() => { const c = makeBunny(); coneProp = new T.Group(); const cn = c.cone.clone(), rim = c.coneRim.clone(); cn.visible = rim.visible = true; cn.position.set(0, 0, 0); rim.position.set(.17, 0, 0);
    coneProp.add(cn); coneProp.add(rim); const a = actor({ root: coneProp }, "Trichter"); a.noCheck = true; });
  function hideProp() {}
  // 9 Tipp: Kaninchen frisst Heu; Schnitt: liegengebliebene Büschel auf dem Boden + MORE HAY + VET, Quellenkarte
  KZ.shot("pTip", (lt, d, t) => { inYard(); hideProp(); const ph = lt / d, half = ph > .5;
    if (!half) { const k = ph / .5; place(hay, .35, 0, 0); hay.root.scale.setScalar(1.1); at(bun, -.25, 0, 0, 0); poseBunny(bun, t, { chew: true, lid: .3, nod: -.15 });
      frameOn([FR(-.6, 0, -.4, .75, .75, .4)], { az: lerp(.4, .34, k), el: .16, fill: lerp(.98, 1.04, k), t }); draw();
      stamp("HAY, HAY, HAY", W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06); }
    else { const k = (ph - .5) / .5; at(bun, .25, 0, -.05, PI + .5); poseBunny(bun, t, { look: -.2, sad: true });
      place(ceco, -.35, .25, 0); ceco.root.scale.setScalar(1.3); place(bigCeco, -.1, .45, 0); bigCeco.root.scale.setScalar(.33);
      frameOn([bun, ceco, bigCeco], { az: lerp(-.25, -.32, k), el: .2, fill: lerp(.92, .97, k), dy: -.1, t }); draw();
      stamp("LEFTOVERS = VET", W * .42, H * .17, (k - .05) * d * .5 / .3, "#2f6fd0", .06);
      const cp = sm((k - .3) * d * .5 / .3); if (card(W * .42, H * .64, 900, 110, cp)) txt("Source: House Rabbit Society · eXtension", W * .42, H * .64, 32, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 10 Loop: zurück zur Hook-Einstellung
  KZ.shot("pLoop", (lt, d, t) => { inYard(); hideProp(); const ph = lt / d; hookFrame(lt, d, t, 1 - ph * .9);
    if (ph > .3) stamp("POOP?", W * .42, H * .66, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__poop3d = true;
})();
