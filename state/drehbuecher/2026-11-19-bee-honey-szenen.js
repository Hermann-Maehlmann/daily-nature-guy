// 3D-Szene "Why You Should Never Give A Tired Bee Honey" (19.11.2026). Dunkle Erdhummel (Bombus terrestris: schwarz, gelber Kragen,
// gelbes Hinterleibsband, weißes Hinterende, 6 Beine, 2 Flügelpaare, geknickte Fühler), Honigglas mit Gießstrahl + Pfütze, "Bee Bar"
// (Tresen mit Honiggläsern + Schild), Keime, große lila Blume, Teelöffel mit Zuckerwasser-Tropfen, 2D-Uhr (45 Min) + Rezeptkarte.
// Quelle: Bumblebee Conservation Trust (bumblebeeconservation.org/faqs/sugar-water).
(function () {
  const LABROT = Math.PI;
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let bee, bee2, bee3, bee4, bigBee, rudi, jar, bigJar, stream, puddle, bar, germs = [], flower, flower2, spoon;

  // ---------- Hummel (Kopf nach +x, Boden y = 0, Länge ~.56) ----------
  function makeBee() {
    const blk = M(0x1d1a1f, { roughness: 1 }), yel = M(0xffc62e, { roughness: .95 }), wht = M(0xfbf4e6, { roughness: .95 });
    const eyeW = M(0xffffff, { roughness: .15 }), pup = M(0x161018, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const wingM = new T.MeshStandardMaterial({ color: new T.Color(0xdff3ff).convertSRGBToLinear(), roughness: .15, transparent: true, opacity: .55, side: T.DoubleSide, depthWrite: false });
    const honeyM = M(0xe88a00, { roughness: .08, metalness: .1, emissive: 0x5a2a00, emissiveIntensity: .3 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    // Brust schwarz mit gelbem Kragen vorne
    body.add(sph(blk, 0, .19, 0, .11, .105, .105));
    body.add(sph(yel, .055, .205, 0, .07, .095, .1));
    // Hinterleib: gelbes Band, schwarz, weißes Ende
    body.add(sph(yel, -.12, .18, 0, .1, .1, .105));
    body.add(sph(blk, -.2, .17, 0, .1, .096, .1));
    body.add(sph(wht, -.285, .16, 0, .075, .075, .08));
    // Fell-Büschel für den flauschigen Look
    for (let i = 0; i < 16; i++) { const a = i * 2.4, xx = -.25 + (i % 8) * .045; body.add(sph(i % 8 < 1 ? yel : (xx < -.24 ? wht : (xx < -.16 ? blk : (xx < -.07 ? yel : blk))), xx, .17 + Math.cos(a) * .085, Math.sin(a) * .085, .028)); }
    const head = new T.Group(); head.position.set(.15, .18, 0); body.add(head);
    head.add(sph(blk, 0, 0, 0, .075, .08, .085));
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.045, .025, s * .048); head.add(e);
      e.add(sph(eyeW, 0, 0, 0, .036, .048, .038)); e.add(sph(pup, .026, 0, 0, .021, .026, .021)); e.add(sph(hl, .043, .014, -s * .004, .007)); eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, yel, .055, .075, s * .045, .012, .008, .04); head.add(b); brows.push(b); }
    const smile = mesh(new T.TorusGeometry(.018, .005, 6, 14, PI), M(0xff6b8a), .07, -.035, 0); smile.rotation.set(0, PI / 2, PI); head.add(smile);
    const frown = mesh(new T.TorusGeometry(.016, .005, 6, 14, PI), M(0xff6b8a), .07, -.05, 0); frown.rotation.set(0, PI / 2, 0); head.add(frown);
    // Fühler (geknickt): Schaft nach oben, Geißel nach vorn, Knöpfchen
    const ants = []; for (const s of [-1, 1]) { const a = new T.Group(); a.position.set(.04, .06, s * .025); head.add(a);
      const s1 = limb(.006, .06, blk); s1.rotation.set(s * .35, 0, -.25); a.add(s1);
      const s2 = limb(.005, .07, blk); s2.position.set(.015, .058, s * .02); s2.rotation.set(s * .2, 0, -1.6); a.add(s2); ants.push(a); }
    // 6 Beine an der Brust
    const legs = []; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const l = limb(.011, .13, blk); l.position.set(.05 - i * .065, .1, s * .06); l.rotation.set(s * .55, 0, (i - 1) * .35); body.add(l); legs.push(l); }
    // 2 Flügelpaare auf dem Rücken
    const wings = []; for (const s of [-1, 1]) { const w = new T.Group(); w.position.set(-.02, .29, s * .03); body.add(w);
      const w1 = sph(wingM, -.1, 0, s * .03, .12, .006, .05); w1.castShadow = false; w.add(w1); const w2 = sph(wingM, -.08, -.01, s * .055, .08, .005, .035); w2.castShadow = false; w.add(w2); wings.push(w); }
    // Honigkleckse (klebrig)
    const goo = new T.Group(); body.add(goo); for (const [x, y, z, r] of [[-.05, .3, .02, .05], [-.18, .27, -.03, .06], [.1, .26, .03, .04], [-.25, .23, .05, .04], [.17, .26, 0, .035]]) goo.add(sph(honeyM, x, y, z, r, r * .6, r));
    goo.traverse((c) => c.castShadow = false);
    // Kranken-Keime, die um den Kopf kreisen
    const sickG = new T.Group(); head.add(sickG); for (let i = 0; i < 3; i++) sickG.add(makeGerm(.025).root); sickG.traverse((c) => c.castShadow = false);
    return { root, body, head, eyes, brows, smile, frown, ants, legs, wings, goo, sickG };
  }
  // o: {fly 0..1, tired 0..1, sleep, lid, sad, wide, sick, sticky, happy, look, nod, sc, drink}
  function poseBee(B, t, o) {
    o = o || {};
    const fl = o.fly || 0, ti = o.tired || 0;
    const flap = fl ? Math.sin(t * 60) * .5 : 0;
    B.wings.forEach((w, i) => { const s = i ? 1 : -1; w.rotation.set(s * (.15 + flap * (1 + fl) + ti * -.05), 0, .1 - ti * .25 + (o.sticky ? -.2 : 0)); });
    B.legs.forEach((l, i) => { const s = i < 3 ? -1 : 1, k = i % 3; l.rotation.set(s * (.55 + ti * .55 + fl * -.2), 0, (k - 1) * .35 + fl * -.4 + Math.sin(t * 3 + i) * .03); });
    B.ants.forEach((a, i) => a.rotation.set(0, 0, Math.sin(t * 2.2 + i) * .1 - ti * .5));
    const lid = o.sleep ? .92 : (o.lid ?? (Math.sin(t * 1.5 + 2) > .985 ? .85 : 0));
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.2 : 1), 1));
    B.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.sad || o.sick ? .45 : (o.wide ? -.35 : 0)); b.position.y = o.wide ? .085 : .075; });
    B.smile.visible = !(o.sad || o.sick || o.wide); B.frown.visible = !B.smile.visible;
    const ch = o.drink ? Math.sin(t * 9) * .08 : 0;
    B.head.rotation.set(o.sick ? Math.sin(t * 5) * .15 : 0, o.look || 0, (o.nod || 0) - ti * .3 + ch);
    const breathe = 1 + Math.sin(t * (o.sleep ? 2 : 3)) * (o.sleep ? .03 : .015);
    B.body.scale.set(1, breathe, 1);
    B.body.position.y = fl * (.1 + Math.sin(t * 4) * .03) - ti * .05 + (o.happy ? Math.abs(Math.sin(t * 6)) * .04 : 0);
    B.body.rotation.z = fl * .12 + (o.sick ? Math.sin(t * 4) * .06 : 0) - ti * .05;
    B.goo.visible = !!o.sticky;
    B.sickG.visible = !!o.sick; B.sickG.children.forEach((s, i) => { const a = t * 3 + i * 2.1; s.position.set(Math.cos(a) * .11, .12 + Math.sin(a * 2) * .02, Math.sin(a) * .11); s.rotation.set(a, a, 0); });
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Keim (grüne Stachelkugel) ----------
  function makeGerm(r) { const root = new T.Group(); const m = M(0x6fd34a, { emissive: 0x1f6a10, emissiveIntensity: .7, roughness: .4 }), m2 = M(0xb6ff6a, { emissive: 0x3a8a10, emissiveIntensity: .8 });
    root.add(sph(m, 0, 0, 0, r)); for (let i = 0; i < 10; i++) { const a = i * 2.399, z = 1 - (i + .5) / 5, rr = Math.sqrt(Math.max(0, 1 - z * z)); root.add(sph(m2, Math.cos(a) * rr * r * 1.15, z * r * 1.15, Math.sin(a) * rr * r * 1.15, r * .28)); }
    for (const s of [-1, 1]) root.add(sph(M(0x161018), r * .6, r * .25, s * r * .32, r * .18)); // böse Äuglein
    return { root }; }

  // ---------- Honigglas (Glas, Honig, roter Karo-Deckel, Etikett) ----------
  function makeJar() { const root = new T.Group(); const glass = new T.MeshStandardMaterial({ color: new T.Color(0xeaf6ff).convertSRGBToLinear(), roughness: .05, metalness: .1, transparent: true, opacity: .35, depthWrite: false });
    const honeyM = M(0xe88a00, { roughness: .08, metalness: .1, emissive: 0x5a2a00, emissiveIntensity: .3 });
    const honey = mesh(new T.CylinderGeometry(.105, .105, .2, 32), honeyM, 0, .105, 0); root.add(honey);
    const gl = mesh(new T.CylinderGeometry(.12, .12, .26, 32, 1, true), glass, 0, .13, 0); gl.castShadow = false; root.add(gl);
    const lab = canvasTex(768, 96, (c, w, h) => { c.fillStyle = "#fff4d6"; c.fillRect(0, 0, w, h); c.fillStyle = "#b5531a"; c.font = "900 64px Montserrat, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("HONEY", w / 2, h / 2 + 3); });
    const label = mesh(new T.CylinderGeometry(.123, .123, .09, 32, 1, true), M(0xffffff, { map: lab, roughness: .7 }), 0, .12, 0); label.rotation.y = LABROT; root.add(label);
    const lidTex = canvasTex(128, 128, (c, w, h) => { c.fillStyle = "#fff"; c.fillRect(0, 0, w, h); c.fillStyle = "#e5484d"; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2) c.fillRect(i * 16, j * 16, 16, 16); });
    const lid = mesh(new T.CylinderGeometry(.13, .13, .05, 32), M(0xffffff, { map: lidTex, roughness: .8 }), 0, .285, 0); root.add(lid);
    return { root, honey, lid }; }
  // Gießstrahl (Zylinder zwischen zwei Punkten) und Honigpfütze
  function makeStream() { const m = M(0xf2a412, { roughness: .08, metalness: .1, emissive: 0x6a3a00, emissiveIntensity: .45 }); const s = mesh(CYL, m, 0, 0, 0, .03, 1, .03); s.castShadow = false; const root = new T.Group(); root.add(s); return { root, s }; }
  function makePuddle() { const m = M(0xf2a412, { roughness: .06, metalness: .1, emissive: 0x6a3a00, emissiveIntensity: .3 }); const root = new T.Group();
    root.add(sph(m, 0, .006, 0, .5, .02, .38)); root.add(sph(m, .32, .005, .2, .2, .016, .16)); root.add(sph(m, -.3, .005, -.18, .22, .016, .14)); root.traverse((c) => c.castShadow = false); return { root }; }

  // ---------- Bee Bar: Holztresen, Schild auf Pfosten, Honiggläser ----------
  function makeBar() { const root = new T.Group(); const wood = M(0xb87a45, { roughness: .7 }), dark = M(0x8a5530, { roughness: .7 });
    root.add(mesh(BOX, wood, 0, .5, 0, 1.9, .07, .55));
    root.add(mesh(BOX, dark, 0, .25, .2, 1.85, .45, .06));
    for (const x of [-.85, .85]) for (const z of [-.22, .22]) root.add(mesh(CYL, dark, x, .25, z, .04, .5, .04));
    const signTex = canvasTex(512, 160, (c, w, h) => { c.fillStyle = "#ffd23f"; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 30); c.fill(); c.lineWidth = 10; c.strokeStyle = "#1d1a1f"; c.stroke();
      c.fillStyle = "#1d1a1f"; c.font = "900 92px Montserrat, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("BEE BAR", w / 2, h / 2 + 4); });
    const sign = mesh(BOX, M(0xffffff, { map: signTex, roughness: .6 }), 0, 1.2, -.24, 1.3, .4, .04); root.add(sign);
    for (const x of [-.55, .55]) root.add(mesh(CYL, dark, x, .85, -.24, .03, .7, .03));
    const jars = []; for (const [x, z] of [[-.6, .05], [-.05, -.08], [.5, .06]]) { const j = makeJar(); j.root.position.set(x, .535, z); j.root.scale.setScalar(.9); root.add(j.root); jars.push(j); }
    return { root, jars }; }

  // ---------- Große Blume (lila Sonnenhut-artig, gelbe Mitte) ----------
  function makeFlower(col) { const root = new T.Group(); const stemM = M(0x3f9a3a, { roughness: .7 }), petM = M(col || 0xb07cff, { roughness: .6 }), ctr = M(0xffb21f, { roughness: .8 });
    root.add(mesh(CYL, stemM, 0, .3, 0, .025, .6, .025));
    for (const s of [-1, 1]) { const lf = sph(stemM, .08 * s, .22, 0, .12, .02, .05); lf.rotation.z = s * .5; root.add(lf); }
    const head = new T.Group(); head.position.set(0, .6, 0); head.rotation.z = -.15; root.add(head);
    head.add(sph(ctr, 0, .02, 0, .1, .05, .1));
    for (let i = 0; i < 10; i++) { const a = i / 10 * 2 * PI; const p = sph(petM, Math.cos(a) * .17, 0, Math.sin(a) * .17, .11, .015, .05); p.rotation.y = -a; root.add(p); head.add(p); }
    return { root, head }; }

  // ---------- Teelöffel mit Zuckerwasser-Tropfen ----------
  function makeSpoon() { const root = new T.Group(); const st = M(0xd5dde6, { metalness: .9, roughness: .22 });
    root.add(sph(st, 0, .03, 0, .1, .025, .07)); const h = mesh(BOX, st, .3, .045, 0, .42, .015, .035); h.rotation.z = .08; root.add(h);
    const drop = new T.Mesh(SPH, new T.MeshStandardMaterial({ color: new T.Color(0x8fd4ff).convertSRGBToLinear(), roughness: .02, metalness: .2, emissive: new T.Color(0x1d6fae), emissiveIntensity: .4, transparent: true, opacity: .85 })); drop.position.set(0, .065, 0); drop.scale.set(.065, .04, .055); root.add(drop);
    return { root, drop }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bee = actor(makeBee(), "Hummel"); bee2 = actor(makeBee(), "Hummel 2"); bee3 = actor(makeBee(), "Hummel 3"); bee4 = actor(makeBee(), "Hummel 4"); bigBee = actor(makeBee(), "Hummel gross");
    jar = actor(makeJar(), "Honigglas"); bigJar = actor(makeJar(), "Honigglas gross"); stream = actor(makeStream(), "Strahl"); puddle = actor(makePuddle(), "Pfuetze");
    bar = actor(makeBar(), "Bee Bar"); flower = actor(makeFlower(), "Blume"); flower2 = actor(makeFlower(0xff6b8a), "Blume 2"); spoon = actor(makeSpoon(), "Loeffel");
    for (let i = 0; i < 9; i++) germs.push(actor(makeGerm(.09), "Keim" + i));
    for (const a of [jar, bigJar, stream, puddle, bar, flower, flower2, spoon, ...germs]) a.noCheck = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { rudi.noCheck = false; rudi.body.position.set(0, 0, 0);
    for (const b of [bee, bee2, bee3, bee4, bigBee]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = false; }
    for (const p of [jar, bigJar, puddle, bar, flower, flower2, spoon]) { p.root.scale.setScalar(1); p.root.rotation.set(0, 0, 0); } }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function stick(m, a, b, r) { const d = b.clone().sub(a); m.position.copy(a).add(d.clone().multiplyScalar(.5)); m.scale.set(r, d.length(), r); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); }
  function hand(i) { rudi.root.updateMatrixWorld(true); return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  function zzz(x, y, t, s) { for (let i = 0; i < 3; i++) { const ph = (t * .6 + i / 3) % 1; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = Math.sin(ph * PI); g.fillStyle = "#fff"; g.font = `900 ${Math.round((40 + i * 12) * (s || 1))}px "Montserrat"`; g.textAlign = "center"; g.lineWidth = 6; g.strokeStyle = "rgba(20,30,60,.6)"; g.strokeText("z", x + ph * 70, y - ph * 140); g.fillText("z", x + ph * 70, y - ph * 140); g.restore(); } }
  function headScr(B) { B.root.updateMatrixWorld(true); return scr(B.head.localToWorld(V(0, .1, 0))); }
  // Honigglas in Rudis Hand, gekippt; Strahl vom Glasrand zum Ziel
  function jarInHand(i, tilt, target) { const hp = hand(i); place(jar, hp.x, hp.z, 0); jar.root.position.set(hp.x, hp.y - .04, hp.z); jar.root.rotation.set(0, 0, tilt); jar.lid.visible = false;
    if (target) { jar.root.updateMatrixWorld(true); const m = jar.root.localToWorld(V(-.08, .27, 0)); stream.root.visible = true; stick(stream.s, m, target, .028 + Math.sin(KZ.t * 20) * .003); } }
  // 2D-Uhr: Kreis, Zeiger und Füllung bis min/60
  function clock(x, y, r, min, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "#ffffff"; g.beginPath(); g.arc(x, y, r + 14, 0, 2 * PI); g.fill();
    g.fillStyle = "#1d2250"; g.beginPath(); g.arc(x, y, r, 0, 2 * PI); g.fill(); g.fillStyle = "#ffc62e"; g.beginPath(); g.moveTo(x, y); g.arc(x, y, r - 8, -PI / 2, -PI / 2 + 2 * PI * min / 60); g.closePath(); g.fill();
    g.strokeStyle = "#ffffff"; g.lineWidth = 10; g.lineCap = "round"; const an = -PI / 2 + 2 * PI * min / 60; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * (r - 18), y + Math.sin(an) * (r - 18)); g.stroke(); g.restore();
    txt(Math.round(min) + " MIN", x, y + r + 70, 58, "#ffffff", { a, stroke: 8 }); }

  // ---------- Shots ----------
  // Hook-Einstellung: erschöpfte Hummel liegt auf dem Weg, daneben ein offenes Honigglas mit Löffel
  function hookFrame(lt, d, t, ph) {
    at(bee, 0, 0, .1, -.35); poseBee(bee, t, { tired: 1, lid: .45, sad: true, sc: 1.6 });
    place(jar, .7, -.2, 0); jar.root.scale.setScalar(1.25); jar.root.rotation.y = .35; jar.lid.visible = false;
    frameOn([FR(-.62, 0, -.3, .95, .45, .45)], { az: lerp(.3, .36, ph), el: .2, fill: lerp(1.04, 1.1, ph), dy: -.04, t }); draw(); }
  KZ.shot("bHook", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(lt, d, t, ph);
    if (ph > .45) stamp("HONEY?!", W * .42, H * .66, (ph - .45) * d / .3, "#e08a00", -.06); });
  // 1 Rudi findet die Hummel, Hände an den Wangen, dann Rettungs-Pose
  KZ.shot("bFind", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); jar.lid.visible = true;
    at(bee, -.35, 0, .35, -.5); poseBee(bee, t, { tired: 1, lid: .4, sad: true, sc: 1.9 });
    place(rudi, .75, -.3, PI + .6);
    if (ph < .5) poseRudi(rudi, t, { arms: [2.7 + Math.sin(t * 9) * .08, 2.6 - Math.sin(t * 9) * .08], spread: .5, mouth: "o", wide: true, lean: .06 });
    else poseRudi(rudi, t, { arms: [.3, 2.9], spread: .25, mouth: "smile", lean: -.04, nod: -.05 });
    frameOn([bee, rudi], { az: lerp(.02, -.04, k), el: .12, fill: lerp(.86, .9, k), t }); draw();
    stamp("BEE 911", W * .42, H * .17, (lt - .2) / .3, "#e5484d", -.06);
    if (ph > .5) stamp("RESCUE MODE", W * .42, H * .25, (ph - .5) * d / .3, "#2f6fd0", .05); });
  // 2 Rudi kippt ein ganzes Honigglas über die Hummel; Schnitt: Hummel klebt in der Pfütze, krank
  KZ.shot("bHoney", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .45;
    if (!half) { const k = ph / .45; at(bee, -.35, 0, .35, -.5); poseBee(bee, t, { tired: 1, wide: true, sc: 1.9, sticky: k > .5 });
      place(rudi, .55, -.3, PI + .6); poseRudi(rudi, t, { arms: [.4, 1.35], spread: .05, mouth: "smile", lean: .1 }); rudi.noCheck = true;
      jarInHand(1, lerp(.6, 2.1, sm(clamp(k / .4, 0, 1))), k > .3 ? V(-.3, .45, .38) : null);
      if (k > .4) { place(puddle, -.35, .38, 0); puddle.root.scale.setScalar(lerp(.3, .6, k)); }
      frameOn([bee, rudi], { az: lerp(.02, -.04, k), el: .14, fill: lerp(.86, .9, k), t }); draw();
      stamp("SWEET!", W * .42, H * .17, (lt - .2) / .3, "#e08a00", -.06); }
    else { const k = (ph - .45) / .55; at(bee, 0, 0, 0, -.35); poseBee(bee, t, { tired: 1, sticky: true, sick: k > .25, lid: .35, sc: 1.6 });
      place(puddle, -.05, .05, 0); puddle.root.scale.setScalar(.95);
      frameOn([FR(-.55, 0, -.3, .5, .5, .35)], { az: lerp(.4, .34, k), el: .22, fill: lerp(.84, .88, k), dy: -.04, t }); draw();
      stamp("STICKY", W * .42, H * .17, k * d * .55 / .3, "#e08a00", .06);
      if (k > .35) stamp("+ SICK", W * .42, H * .25, (k - .35) * d * .55 / .3, "#36b37e", -.05); } });
  // 3 Rudi eröffnet die "Bee Bar", Hummeln fliegen ein; Schnitt: am Tresen sitzen kranke Hummeln
  KZ.shot("bBar", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .48;
    if (!half) { const k = ph / .48; place(bar, -.2, -.1, 0); bar.jars.forEach((j) => j.lid.visible = false);
      place(rudi, 1.25, .35, PI + .5); poseRudi(rudi, t, { arms: [.3, 2.4], wave: true, spread: .2, mouth: "smile" });
      [bee2, bee3, bee4].forEach((b, i) => { const p = clamp(k * 1.4 - i * .15, 0, 1); at(b, lerp(-1.5, -.7 + i * .55, sm(p)), .7 + i * .12 + Math.sin(t * 3 + i) * .04, .1 + i * .05, -.3); poseBee(b, t + i, { fly: 1, happy: true, sc: 1.1 }); b.noCheck = true; });
      frameOn([bar, rudi], { az: lerp(-.05, .02, k), el: .14, fill: lerp(.86, .9, k), t }); draw();
      stamp("GRAND OPENING", W * .42, H * .17, (lt - .2) / .3, "#e08a00", -.06); }
    else { const k = (ph - .48) / .52; place(bar, 0, 0, 0); bar.jars.forEach((j) => j.lid.visible = false); rudi.root.visible = false;
      [bee2, bee3, bee4].forEach((b, i) => { at(b, -.62 + i * .62, .535, .12, -.35 + (i - 1) * .15); poseBee(b, t + i * .7, { sick: true, sticky: i !== 1, tired: .5, sc: 1.05 }); });
      frameOn([FR(-1.0, .4, -.3, 1.0, 1.0, .3)], { az: lerp(.12, .05, k), el: .2, fill: lerp(.88, .92, k), dy: -.05, t }); draw();
      stamp("OH NO", W * .42, H * .17, k * d * .52 / .3, "#36b37e", .06); } });
  // 4 Studio: großes Honigglas, Keime schwirren drumherum + Zitat Bumblebee Conservation Trust
  KZ.shot("bGerms", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(bigJar, 0, 0, 0); bigJar.root.scale.setScalar(3.2); bigJar.root.rotation.y = t * .3; bigJar.lid.visible = true;
    germs.forEach((gm, i) => { const p = clamp((lt - i * .12) / .3, 0, 1), a = t * (.8 + (i % 3) * .2) + i * .7, r = .85 + (i % 3) * .18; place(gm, Math.cos(a) * r, Math.sin(a) * r * .5, 0);
      gm.root.position.y = .25 + (i % 4) * .22 + Math.sin(t * 2 + i) * .05; gm.root.scale.setScalar(easeBack(p) * (.8 + (i % 2) * .4)); gm.root.rotation.set(t + i, t * 1.3, 0); });
    frameOn([FR(-.95, 0, -.6, .95, 1.0, .6)], { az: lerp(.2, .08, k), el: .2, fill: lerp(.82, .88, k), dy: -.18, t }); draw();
    stamp("GERMS", W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .3) / .3); if (card(W * .42, H * .63, 920, 210, cp, "BUMBLEBEE CONSERVATION TRUST", "#2f6fd0")) {
      txt("“Honey can contain pathogens which", W * .42, H * .63 + 6, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("might make the bumblebee ill.”", W * .42, H * .63 + 52, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 5 Hummel schläft neben einer Blume, atmet, zzz
  KZ.shot("bRest", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    at(bee, 0, 0, .05, -.3); poseBee(bee, t, { sleep: true, tired: .4, sc: 1.6 }); place(flower, .55, -.35, 0); flower.root.scale.setScalar(1.2);
    frameOn([FR(-.6, 0, -.4, .8, .8, .4)], { az: lerp(.42, .34, k), el: .16, fill: lerp(1.0, 1.06, k), t }); draw();
    const [hx, hy] = headScr(bee); zzz(hx + 30, hy - 20, t, 1.1);
    stamp("JUST RESTING", W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", -.06); });
  // 6 Studio: schlafende Hummel, 2D-Uhr läuft auf 45 Minuten
  KZ.shot("bWait", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bigBee, 0, 0, 0, -.35); poseBee(bigBee, t, { sleep: ph < .82, wide: ph >= .82, happy: ph >= .82, tired: ph < .82 ? .3 : 0, sc: 2.6 });
    frameOn([FR(-.75, 0, -.4, .55, .9, .4)], { az: lerp(.4, .32, k), el: .14, fill: lerp(.7, .74, k), dy: -.42, t }); draw();
    clock(W * .42, H * .6, 110, 45 * sm(clamp((lt - .2) / (d * .7), 0, 1)), clamp(lt / .3, 0, 1));
    if (ph < .82) { const [hx, hy] = headScr(bigBee); zzz(hx + 30, hy - 30, t, 1); }
    stamp("GIVE IT TIME", W * .42, H * .17, (lt - .15) / .3, "#2f6fd0", -.06); });
  // 7 Pointe: Rudi verlegen hinter der leeren Bee Bar, eine gesunde Hummel fliegt vorbei
  KZ.shot("bOver", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(bar, -.3, -.1, 0); bar.jars.forEach((j) => j.lid.visible = true);
    place(rudi, 1.15, .35, PI + .5); poseRudi(rudi, t, { arms: [1.9 + Math.sin(t * 2) * .05, .2], spread: .1, mouth: "smile", tilt: .12, nod: .06 });
    at(bee2, lerp(-1.5, .3, k), 1.15 + Math.sin(t * 3) * .05, .4, -.2); poseBee(bee2, t, { fly: 1, happy: true, sc: 1.2 }); bee2.noCheck = true;
    frameOn([bar, rudi], { az: lerp(-.02, -.08, k), el: .14, fill: lerp(.8, .84, k), t }); draw();
    if (ph > .3) stamp("OVERKILL", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", .06); });
  // 8 Tipp: Hummel trinkt auf der Blume; Schnitt: Löffel mit einem Tropfen Zuckerwasser + Rezeptkarte + Quelle
  KZ.shot("bTip", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .42;
    if (!half) { const k = ph / .42; place(flower, 0, 0, 0); flower.root.scale.setScalar(1.6); flower.head.updateMatrixWorld(true);
      at(bee, -.02, .98, .02, -.35); poseBee(bee, t, { drink: true, lid: .2, sc: 1.25 });
      place(flower2, .45, -.7, 0); flower2.root.scale.setScalar(1.1);
      frameOn([FR(-.45, .2, -.4, .5, 1.3, .4)], { az: lerp(.38, .3, k), el: .22, fill: lerp(.86, .9, k), dy: .12, t }); draw();
      stamp("FLOWER FIRST", W * .42, H * .17, (lt - .2) / .3, "#b07cff", -.06); }
    else { const k = (ph - .42) / .58; place(spoon, .02, 0, .05); spoon.root.scale.setScalar(1.6);
      at(bee, -.36, 0, .02, -.1); poseBee(bee, t, { drink: k > .2, nod: k > .2 ? -.2 : 0, tired: .2, sc: 1.6 });
      frameOn([bee, FR(-.2, 0, -.2, .75, .2, .25)], { az: lerp(.3, .24, k), el: .3, fill: lerp(.84, .88, k), dy: -.2, t }); draw();
      stamp("ONE DROP", W * .42, H * .17, k * d * .58 / .3, "#2f6fd0", .06);
      const cp = sm((k - .15) * d * .58 / .3); if (card(W * .42, H * .62 + 20, 900, 250, cp, "LAST RESORT", "#2f6fd0")) { const a = clamp(cp, 0, 1);
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(W * .42 - 360, H * .62 - 26, 720, 52, 26); g.fill();
        g.fillStyle = "#cfefff"; g.beginPath(); g.roundRect(W * .42 - 360, H * .62 - 26, 360, 52, 26); g.fill(); g.fillStyle = "#e6e9f5"; g.beginPath(); g.roundRect(W * .42, H * .62 - 26, 360, 52, 26); g.fill(); g.restore();
        txt("50% water", W * .42 - 180, H * .62, 32, "#1d2250", { a }); txt("50% white sugar", W * .42 + 180, H * .62, 32, "#1d2250", { a });
        txt("never honey · never brown sugar", W * .42, H * .62 + 58, 30, "#e5484d", { a }); }
      if (cp > 0) txt("Source: Bumblebee Conservation Trust", W * .42, H * .62 + 108, 26, "#5a6080", { a: clamp(cp, 0, 1) }); } });
  // 9 Loop: zurück zur Hook-Einstellung
  KZ.shot("bLoop", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(lt, d, t, 1 - ph * .9);
    if (ph > .3) stamp("HONEY?", W * .42, H * .66, (ph - .3) * d / .3, "#e08a00", -.06); });

  window.__bee3d = true;
})();
