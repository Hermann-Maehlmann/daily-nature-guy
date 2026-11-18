// 3D-Szene "Why You Should Never Bathe Your Bunny" (18.11.2026). Hauskaninchen (aus dem Kaninchen-Video vom 17./18.11., erweitert um
// Schlammflecken, nasses Fell und "Pusteblumen"-Fellkugel), Zinkwanne mit Schaum, Quietscheente, Wasserspritzer, Laubbläser,
// Bürste + Waschlappen, Studio-Infografik Thermometer.
// Quellen: RWAF (Bathing rabbits), RSPCA (Grooming rabbits), House Rabbit Society (Grooming).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let bun, bigBun, rudi, tub, bigTub, duck, drops, blower, brush, cloth, thermo, hearts;

  // ---------- Hauskaninchen (wildfarben braun, cremefarbener Bauch, weiße Blume, lange Ohren, große Hinterpfoten) ----------
  const FUR = 0xb98a5e, WET = 0x6e4f36;
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
    // Putz-Pfoten (nur beim Putzen sichtbar: beide Vorderpfoten reiben über Gesicht und Schnauze)
    const gpaws = []; for (const s of [-1, 1]) { const p = sph(cream, .13, -.06, s * .07, .045, .06, .04); p.visible = false; head.add(p); gpaws.push(p); }
    // Schlammflecken (dunkelbraun, flach auf dem Fell)
    const mud = new T.Group(); body.add(mud); const mudM = M(0x4a3020, { roughness: .95 });
    for (const [x, y, z, s] of [[-.12, .4, .12, .07], [.02, .3, .2, .06], [-.25, .25, .15, .05], [-.05, .15, -.2, .06], [.1, .38, -.13, .045]]) { const m = sph(mudM, x, y, z, s * 1.5, s * .7, s * 1.5); m.lookAt(V(x, y, z).multiplyScalar(3)); mud.add(m); }
    { const m = sph(mudM, .02, .1, .06, .05, .03, .05); head.add(m); m.visible = false; }
    // Fellkugel ("Pusteblume" nach dem Laubbläser): Kugel aus Fell-Knubbeln um den Körper, Kopf schaut vorne raus
    const fluff = new T.Group(); fluff.position.set(-.04, .3, 0); body.add(fluff); const fluffM = M(0xd9b48a, { roughness: .95 });
    const nF = 26; for (let i = 0; i < nF; i++) { const yy = 1 - (i + .5) / nF * 2, r = Math.sqrt(1 - yy * yy), a = i * 2.399;
      const p = V(Math.cos(a) * r, yy, Math.sin(a) * r); if (p.x > .55 && Math.abs(p.y) < .5) continue; fluff.add(sph(fluffM, p.x * .3, p.y * .3, p.z * .3, .15)); }
    fluff.add(sph(fluffM, 0, 0, 0, .3));
    return { root, body, head, ears, eyes, brows, nose, hind, front, tail, mud, fluff, fur, furD, furC, gpaws };
  }
  // o: {ears 0 aufrecht..1 angelegt, wide, kick, lid, hop, look, tilt, nod, lean, sc, sad, angry, thump, groom, mud, wet, puff, shiver}
  function poseBunny(B, t, o) {
    o = o || {};
    const ea = o.ears || 0; B.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.set(s * (.12 + ea * .05), 0, ea * 1.25 + Math.sin(t * 2.3 + i) * .04 * (1 - ea)); });
    const gr = o.groom || 0;
    B.head.rotation.set(o.tilt || 0, o.look || 0, (o.nod || 0) + Math.sin(t * 1.6) * .02 - gr * (.3 + Math.sin(t * 9) * .06));
    B.nose.scale.set(.022, .018 * (1 + Math.sin(t * 22) * .18), .026);
    const lid = o.lid ?? (gr ? .7 : (Math.sin(t * 1.4 + 1) > .985 ? .85 : 0));
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.22 : 1), o.wide ? 1.1 : 1));
    B.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.angry ? .4 : (o.wide ? -.35 : (o.sad ? .35 : 0))); b.position.y = o.wide ? .115 : .1; });
    const k = o.kick || 0, hop = o.hop || 0, th = o.thump ? Math.max(0, Math.sin(t * 9)) * .5 : 0;
    B.hind.forEach((h, i) => { h.rotation.z = -(k * (1.0 + Math.sin(t * 26 + i * 2) * .5)) - hop * 1.1 + th * (i ? 1 : .9); });
    B.front.forEach((f, i) => { f.rotation.z = k * Math.sin(t * 24 + i * 1.5) * .6 + hop * .9; });
    B.body.rotation.z = hop * .25 + (o.lean || 0) - k * .25 + gr * .3;
    const sh = o.shiver ? Math.sin(t * 55) * .01 : 0;
    B.body.position.set(sh, Math.sin(t * 2) * .004 + k * .05, 0);
    B.gpaws.forEach((p, i) => { p.visible = gr > 0; if (!gr) return; const ph2 = t * 9 + i * PI; p.position.set(.13 + Math.sin(ph2) * .02, -.04 + Math.sin(ph2) * .05, (i ? 1 : -1) * (.05 + Math.cos(ph2) * .02)); });
    B.front.forEach((f) => f.visible = !gr);
    B.mud.visible = !!o.mud;
    const wet = o.wet || 0; B.fur.color.copy(new T.Color(B.furC).convertSRGBToLinear().lerp(new T.Color(WET).convertSRGBToLinear(), wet)); B.furD.color.copy(B.fur.color).multiplyScalar(.8);
    B.body.scale.set(1 - wet * .1, 1, 1 - wet * .12);
    const pf = o.puff || 0; B.fluff.visible = pf > 0; if (pf > 0) B.fluff.scale.setScalar(.3 + pf * .95 + Math.sin(t * 6) * .02 * pf);
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Zinkwanne mit Wasser und Schaum ----------
  const TUB_H = .34, TUB_R = .52;
  function makeTub() { const root = new T.Group(); const zinc = M(0xaeb8c4, { metalness: .75, roughness: .35 });
    const prof = [V(0, 0, 0), V(TUB_R * .82, 0, 0), V(TUB_R * .88, .02, 0), V(TUB_R, TUB_H, 0), V(TUB_R - .03, TUB_H, 0), V(TUB_R * .85, .04, 0), V(0, .04, 0)].map((p) => new T.Vector2(p.x, p.y));
    const shell = mesh(new T.LatheGeometry(prof, 40), zinc); shell.material = zinc.clone(); shell.material.side = T.DoubleSide; root.add(shell);
    const rim = mesh(new T.TorusGeometry(TUB_R - .01, .025, 10, 40), zinc, 0, TUB_H, 0); rim.rotation.x = PI / 2; root.add(rim);
    for (const s of [-1, 1]) { const hd = mesh(new T.TorusGeometry(.07, .014, 8, 20, PI), zinc, 0, TUB_H - .05, s * (TUB_R + .02)); hd.rotation.y = 0; root.add(hd); }
    const water = mesh(new T.CircleGeometry(TUB_R * .97, 40), M(0x6cc4ff, { roughness: .05, metalness: .1, transparent: true, opacity: .85 }), 0, TUB_H - .07, 0); water.rotation.x = -PI / 2; water.castShadow = false; root.add(water);
    const foam = new T.Group(); root.add(foam); const fm = M(0xffffff, { roughness: .6 }), fm2 = M(0xe8f6ff, { roughness: .5 });
    const bubbles = []; for (let i = 0; i < 34; i++) { const a = i * 2.399, r = TUB_R * (.55 + (i % 5) * .09); const s = .05 + (i % 4) * .022;
      const b = sph(i % 3 ? fm : fm2, Math.cos(a) * Math.min(r, TUB_R - .05), TUB_H - .04 + (i % 3) * .025, Math.sin(a) * Math.min(r, TUB_R - .05), s); b.castShadow = false; foam.add(b); bubbles.push(b); }
    const head = []; for (let i = 0; i < 4; i++) { const b = sph(fm, 0, 0, 0, .045 + i * .01); b.castShadow = false; root.add(b); head.push(b); }
    return { root, water, foam, bubbles, head };
  }
  // Quietscheente
  function makeDuck() { const root = new T.Group(); const y = M(0xffd23f, { roughness: .35 }), o = M(0xff8a1a, { roughness: .4 }), e = M(0x111111, { roughness: .1 });
    root.add(sph(y, 0, .06, 0, .11, .075, .085)); root.add(sph(y, .09, .1, 0, .04, .05, .07));
    root.add(sph(y, .07, .16, 0, .06)); root.add(sph(o, .135, .15, 0, .04, .014, .03));
    for (const s of [-1, 1]) { root.add(sph(e, .1, .18, s * .035, .012)); root.add(sph(M(0xffffff, { emissive: 0xffffff }), .108, .186, s * .036, .004)); }
    root.traverse((m) => m.castShadow = false); root.children.forEach((c) => { c.position.multiplyScalar(1.7); c.scale.multiplyScalar(1.7); }); return { root }; }
  // Wassertropfen / Spritzer
  function makeDrops(n) { const root = new T.Group(); const list = []; const m = M(0x7fd0ff, { roughness: .05, metalness: .1, transparent: true, opacity: .9 });
    for (let i = 0; i < n; i++) { const d = sph(m, 0, 0, 0, .025, .035, .025); d.castShadow = false; root.add(d); list.push(d); } return { root, list }; }
  // Laubbläser (Motor orange, Rohr grau) + Luftstreifen
  function makeBlower() { const root = new T.Group(); const org = M(0xff7a1a, { roughness: .4 }), gry = M(0x3a3f48, { roughness: .5 });
    const tube = mesh(CYL, gry, 0, 0, 0, .05, 1, .05); root.add(tube);
    const motor = new T.Group(); root.add(motor); motor.add(mesh(BOX, org, 0, 0, 0, .3, .24, .22)); motor.add(mesh(CYL, gry, -.05, .16, 0, .03, .12, .03));
    const nozzle = mesh(new T.CylinderGeometry(.07, .05, .1, 20), org, 0, 0, 0); root.add(nozzle);
    const air = []; const am = M(0xffffff, { roughness: 1, transparent: true, opacity: .55 }); for (let i = 0; i < 8; i++) { const a = mesh(CYL, am, 0, 0, 0, .008, .18, .008); a.castShadow = false; root.add(a); air.push(a); }
    return { root, tube, motor, nozzle, air }; }
  // Bürste (Holzgriff, weiche Borsten) und Waschlappen
  function makeBrush() { const root = new T.Group(); const wood = M(0xb87a45, { roughness: .6 }), br = M(0xf2e2c4, { roughness: .9 });
    root.add(mesh(BOX, wood, 0, .04, 0, .28, .05, .12)); root.add(mesh(BOX, wood, -.22, .06, 0, .2, .035, .05));
    for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) root.add(mesh(CYL, br, -.1 + i * .05, -.005, -.03 + j * .06, .012, .045, .012));
    root.traverse((m) => m.castShadow = false); return { root }; }
  function makeCloth() { const root = new T.Group(); const c = M(0x4fb3e8, { roughness: .9 }); root.add(mesh(BOX, c, 0, 0, 0, .16, .03, .12));
    root.add(mesh(BOX, M(0xffffff, { roughness: .9 }), 0, .017, 0, .16, .005, .02)); root.traverse((m) => m.castShadow = false); return { root }; }
  // Thermometer (Studio): Glasröhre, rote Säule sinkt, Skala
  function makeThermo() { const root = new T.Group(); const glass = M(0xffffff, { roughness: .1, transparent: true, opacity: .25 }), red = M(0xff2a2a, { roughness: .3, emissive: 0x8a0a0a, emissiveIntensity: .8 });
    root.add(mesh(CYL, glass, 0, .85, 0, .1, 1.4, .1)); root.add(sph(glass, 0, .1, 0, .2));
    root.add(sph(red, 0, .1, 0, .16)); const fill = mesh(CYL, red, 0, 0, 0, .06, 1, .06); root.add(fill);
    const marks = []; for (let i = 0; i < 6; i++) root.add(mesh(BOX, M(0xffffff, { roughness: .5 }), .13, .35 + i * .22, 0, .08, .015, .015));
    root.traverse((m) => m.castShadow = false); return { root, fill }; }
  function makeHearts() { const root = new T.Group(); const list = []; const s = new T.Shape(); s.moveTo(0, -.6); s.bezierCurveTo(-1.2, .2, -.5, 1.1, 0, .45); s.bezierCurveTo(.5, 1.1, 1.2, .2, 0, -.6);
    const geo = new T.ExtrudeGeometry(s, { depth: .3, bevelEnabled: false }); geo.center();
    for (let i = 0; i < 3; i++) { const m = mesh(geo, M(0xff5d8f, { emissive: 0x6a0a2a, roughness: .3 })); m.scale.setScalar(.06); m.castShadow = false; root.add(m); list.push(m); } return { root, list }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bun = actor(makeBunny(), "Kaninchen"); bigBun = actor(makeBunny(), "Kaninchen gross");
    tub = actor(makeTub(), "Wanne"); bigTub = actor(makeTub(), "Wanne gross"); duck = actor(makeDuck(), "Ente"); drops = actor(makeDrops(16), "Spritzer");
    blower = actor(makeBlower(), "Laubblaeser"); brush = actor(makeBrush(), "Buerste"); cloth = actor(makeCloth(), "Lappen"); thermo = actor(makeThermo(), "Thermometer"); hearts = actor(makeHearts(), "Herzen");
    for (const a of [tub, bigTub, duck, drops, blower, brush, cloth, thermo, hearts]) a.noCheck = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { rudi.noCheck = false; rudi.body.position.set(0, 0, 0);
    for (const b of [bun, bigBun]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = false; }
    for (const tb of [tub, bigTub]) { tb.foam.visible = true; tb.head.forEach((h) => h.visible = false); tb.root.scale.setScalar(1); } }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function headPos(B, dx, dy) { B.root.updateMatrixWorld(true); return B.head.localToWorld(V(dx || 0, dy ?? .12, 0)); }
  function stick(m, a, b, r) { const d = b.clone().sub(a); m.position.copy(a).add(d.clone().multiplyScalar(.5)); m.scale.set(r, d.length(), r); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); }
  function hand(i) { return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function hands() { rudi.root.updateMatrixWorld(true); return hand(0).add(hand(1)).multiplyScalar(.5); }
  // Schaumkrone auf dem Kopf des Kaninchens
  function foamHat(TB, B, on) { TB.head.forEach((h, i) => { h.visible = on; if (!on) return; const p = headPos(B, -.02 + i * .03, .13 + (i % 2) * .03); h.position.copy(p).sub(TB.root.position).divideScalar(TB.root.scale.x); h.position.z += (i - 1.5) * .05; }); }
  // Bunny sitzt in der Wanne (Unterkörper unter Wasser)
  function inTub(TB, B, t, o, sc) { sc = sc || 1; const p = TB.root.position; at(B, p.x - .03 * sc, .04 * sc, p.z, o.ry ?? .35); poseBunny(B, t, Object.assign({ sc }, o)); B.noCheck = true; }
  // Spritzer aus der Wanne
  function splash(TB, p, t, sc) { drops.root.visible = p > 0; if (!(p > 0)) return; sc = sc || 1; const c = TB.root.position;
    drops.list.forEach((d, i) => { const q = ((t * 1.7 + i / drops.list.length) % 1), a = i * 2.399; const r = (TUB_R * .6 + q * .9) * sc;
      d.position.set(c.x + Math.cos(a) * r, (TUB_H + Math.sin(q * PI) * .55 - q * .1) * sc, c.z + Math.sin(a) * r); d.scale.set(.025 * sc, .035 * sc, .025 * sc); }); }
  function blowAt(t, hp, dir, on) { blower.root.visible = true; blower.root.position.set(0, 0, 0); blower.motor.position.copy(hp); blower.motor.rotation.set(0, 0, -.3);
    const nz = hp.clone().add(dir); blower.nozzle.position.copy(nz); stick(blower.tube, hp, nz, .05); blower.nozzle.quaternion.copy(blower.tube.quaternion);
    const dn = dir.clone().normalize(); blower.air.forEach((a, i) => { a.visible = on; const q = (t * 2.2 + i / 8) % 1; const p = nz.clone().add(dn.clone().multiplyScalar(.1 + q * .7)); p.y += Math.sin(i * 2.1) * .07; p.z += Math.cos(i * 1.7) * .08;
      a.position.copy(p); a.quaternion.setFromUnitVectors(V(0, 1, 0), dn); }); }

  // ---------- Shots ----------
  // 0 Hook: Kaninchen sitzt mit Schaumkrone in der Zinkwanne, Augen weit, Ohren angelegt
  KZ.shot("bHook", (lt, d, t) => { inYard(); const ph = lt / d;
    place(tub, 0, 0, 0); inTub(tub, bun, t, { wide: true, ears: .65, shiver: true, look: -.15 }); foamHat(tub, bun, true);
    frameOn([FR(-.55, 0, -.55, .55, .9, .55)], { az: lerp(.35, .28, ph), el: .16, fill: lerp(1.12, 1.2, ph), t }); draw();
    if (ph > .4) stamp("NO BATHS!", W * .42, H * .64, (ph - .4) * d / .3, "#e5484d", -.06); });
  // 1 Rudi entdeckt das schmutzige Kaninchen; Schnitt: Schaumbad, Rudi strahlt
  KZ.shot("bDirty", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .45;
    if (!half) { at(bun, .15, 0, .45, PI - .3); poseBunny(bun, t, { mud: true, look: .2, sc: 1.2 }); place(rudi, -.8, -.35, .1);
      poseRudi(rudi, t, { arms: [.2, .9 + Math.sin(t * 5) * .1], spread: .1, mouth: "o", wide: true, tilt: -.1 });
      frameOn([bun, rudi], { az: lerp(.55, .48, ph / .45), el: .12, fill: .95, t }); draw();
      stamp("DIRTY!", W * .42, H * .17, (lt - .2) / .3, "#8a5a33", -.06); }
    else { const k = (ph - .45) / .55; place(tub, .35, .25, 0); inTub(tub, bun, t, { mud: k < .3, wide: true, ears: .5, look: -.3 }); foamHat(tub, bun, k > .3);
      place(rudi, -.75, -.35, .2); poseRudi(rudi, t, { arms: [2.5 + Math.sin(t * 8) * .1, 2.3 - Math.sin(t * 8) * .1], spread: .3, mouth: "smile" });
      frameOn([tub, rudi, FR(-.2, 0, -.3, .85, .9, .75)], { az: lerp(.5, .44, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw();
      stamp("SPA DAY!", W * .42, H * .17, k * d * .55 / .3, "#ff5d8f", .06); } });
  // 2 Quietscheente schwimmt an; Schnitt: Kaninchen strampelt, Wasser spritzt, Ente fliegt weg, Rudi nass
  KZ.shot("bDuck", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .48;
    place(tub, .3, .2, 0); place(rudi, -.75, -.35, .2);
    if (!half) { const k = ph / .48; inTub(tub, bun, t, { wide: true, ears: .5, look: -.2 }); foamHat(tub, bun, true);
      place(duck, .3 + lerp(.3, .2, sm(k)), .2 + .25, -2.4); duck.root.position.y = TUB_H - .02 + Math.sin(t * 4) * .015;
      poseRudi(rudi, t, { arms: [.4, 1.2], spread: .1, mouth: "smile", nod: Math.sin(t * 3) * .05 });
      frameOn([tub, rudi, FR(-.2, 0, -.3, .85, .9, .75)], { az: lerp(.45, .4, k), el: .16, fill: lerp(.98, 1.04, k), t }); draw();
      stamp("QUACK", W * .42, H * .17, (lt - .2) / .3, "#ffb800", -.06); }
    else { const k = (ph - .48) / .52; inTub(tub, bun, t, { kick: 1, wide: true, ears: .3, angry: true }); tub.foam.visible = k < .2; foamHat(tub, bun, false);
      splash(tub, 1, t, 1); const fl = clamp(k / .5, 0, 1); place(duck, .3 + .2 + fl * .9, .2 + .25 + fl * .5, -2.4 + fl * 6); duck.root.position.y = TUB_H + Math.sin(fl * PI) * .9; duck.root.rotation.z = fl * 4;
      poseRudi(rudi, t, { arms: [2.7, 2.6], spread: .5, mouth: "o", wide: true, lean: -.08 });
      frameOn([tub, rudi, FR(-.3, 0, -.4, .95, 1.1, .85)], { az: lerp(.42, .36, k), el: .14, fill: lerp(.92, .98, k), t }); draw();
      if (k > .05) stamp("SPLASH!", W * .42, H * .17, (k - .05) * d * .52 / .3, "#2f6fd0", .07); } });
  // 3 Rudi föhnt das klitschnasse Kaninchen mit dem Laubbläser; Schnitt: Fellkugel ("Pusteblume")
  KZ.shot("bBlow", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .5;
    place(rudi, -1.05, -.2, 0);
    if (!half) { const k = ph / .5; at(bun, .3, 0, .1, PI - .2); poseBunny(bun, t, { wet: 1, ears: .85, sad: true, shiver: true, lid: .35 });
      poseRudi(rudi, t, { arms: [.9, .9], spread: .02, mouth: "smile" }); rudi.noCheck = true; const hp = hands(); blowAt(t, hp, V(.85, -.65, .2), k > .2);
      bun.root.position.x += k > .2 ? Math.sin(t * 40) * .01 : 0;
      frameOn([rudi, bun], { az: lerp(.5, .45, k), el: .12, fill: lerp(.95, 1.0, k), t }); draw();
      stamp("VROOOM", W * .42, H * .17, (lt - .2) / .3, "#ff7a1a", -.07); }
    else { const k = (ph - .5) / .5; rudi.root.visible = false; at(bun, 0, 0, 0, .3); poseBunny(bun, t, { puff: sm(clamp(k / .25, 0, 1)), wide: true, ears: 0, angry: k > .4 });
      frameOn([FR(-.6, 0, -.55, .6, .95, .55)], { az: lerp(.25, .18, k), el: .12, fill: lerp(.84, .88, k), t }); draw();
      stamp("DANDELION", W * .42, H * .17, (k - .1) * d * .5 / .3, "#ffb800", .06); } });
  // 4 Studio: großes Kaninchen putzt sich selbst (Vorderpfoten übers Gesicht) + RSPCA-Zitat
  KZ.shot("bGroom", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bigBun, 0, 0, 0, -.35); poseBunny(bigBun, t, { groom: 1, sc: 1.5, lid: .45 });
    frameOn([bigBun], { az: lerp(.2, .12, k), el: .1, fill: lerp(.78, .84, k), dy: -.12, t }); draw();
    stamp("SELF-CLEANING", W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .35) / .3); if (card(W * .42, H * .63, 900, 210, cp, "RSPCA", "#2f6fd0")) {
      txt("“Rabbits are naturally clean animals", W * .42, H * .63 + 6, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("and do not need to be bathed.”", W * .42, H * .63 + 52, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 5 Studio: Kaninchen in der Wanne strampelt panisch, Wasser spritzt + RWAF-Zitat (Wirbelsäule)
  KZ.shot("bPanic", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph); const S = 1.4;
    place(bigTub, 0, 0, 0); bigTub.root.scale.setScalar(S); bigTub.foam.visible = false; inTub(bigTub, bigBun, t, { kick: 1, wide: true, ears: .3, ry: .45 }, S); splash(bigTub, 1, t, S);
    frameOn([bigTub, FR(-.7, 0, -.7, .7, 1.3, .7)], { az: lerp(.25, .18, k), el: .14, fill: lerp(.84, .9, k), dy: -.12, t }); draw();
    stamp("PANIC", W * .42, H * .17, (lt - .15) / .3, "#e5484d", -.06);
    const cp = sm((lt - d * .35) / .3); if (card(W * .42, H * .63, 920, 250, cp, "RWAF", "#2f6fd0")) {
      txt("“Rabbits ... can easily fracture their", W * .42, H * .63 + 2, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("spine or a limb if they thrash", W * .42, H * .63 + 46, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("around whilst in water.”", W * .42, H * .63 + 90, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 6 Studio-Infografik: nasses Kaninchen zittert, Thermometer sinkt, Tropfen + House-Rabbit-Society-Zitat
  KZ.shot("bCold", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bigBun, -.45, 0, .1, .4); poseBunny(bigBun, t, { wet: 1, shiver: true, ears: .85, sad: true, lid: .3, sc: 1.3 });
    place(thermo, .55, -.05, 0); thermo.root.scale.setScalar(.75); const lv = lerp(1.25, .35, sm(clamp((ph - .1) / .6, 0, 1))); thermo.fill.scale.set(.06, lv, .06); thermo.fill.position.y = .12 + lv / 2;
    drops.root.visible = true; const hp = headPos(bigBun, -.1, 0); drops.list.forEach((dr, i) => { const q = (t * 1.3 + i / 16) % 1; dr.position.set(hp.x - .45 + (i % 6) * .14, .55 * (1 - q) + .02, hp.z - .15 + (i % 3) * .12); dr.scale.set(.025, .035, .025); });
    frameOn([bigBun, thermo], { az: lerp(.08, .02, k), el: .1, fill: lerp(.86, .9, k), dy: -.2, t }); draw();
    stamp("BRRR", W * .42, H * .17, (lt - .15) / .3, "#2f6fd0", -.06);
    const cp = sm((lt - d * .45) / .3); if (card(W * .42, H * .63, 900, 210, cp, "HOUSE RABBIT SOCIETY", "#2f6fd0")) {
      txt("“A wet rabbit can quickly", W * .42, H * .63 + 6, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("become hypothermic.”", W * .42, H * .63 + 52, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 7 Pointe: Rudi hält verlegen den Laubbläser, die Fellkugel guckt ihn böse an
  KZ.shot("bOver", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(rudi, -1.0, -.25, .1); poseRudi(rudi, t, { arms: [.7, .7], spread: .02, mouth: "smile", tilt: -.12, nod: .06 }); rudi.noCheck = true;
    const hp = hands(); blowAt(t, hp, V(.55, -.7, .15), false);
    at(bun, .35, 0, .15, PI - .1); poseBunny(bun, t, { puff: 1, angry: true, lid: .35, sc: 1.15 });
    frameOn([rudi, bun], { az: lerp(.45, .4, k), el: .12, fill: lerp(.95, 1.0, k), t }); draw();
    if (ph > .3) stamp("OVERKILL", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", .06); });
  // 8 Tipp: Bürste streicht übers Fell (Herzchen); Schnitt: Waschlappen am Po + VET CHECK + Quellenkarte
  KZ.shot("bTip", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .5;
    if (!half) { const k = ph / .5; at(bun, 0, 0, 0, .35); poseBunny(bun, t, { lid: .55, nod: -.05 });
      bun.root.updateMatrixWorld(true); const s = (Math.sin(t * 4) + 1) / 2; const bp = bun.body.localToWorld(V(lerp(.12, -.22, s), .46, 0)); place(brush, 0, 0, 0); brush.root.position.copy(bp); brush.root.rotation.set(0, .35, -.15);
      hearts.root.visible = true; const hh = headPos(bun, 0, .45); hearts.list.forEach((h, i) => { const q = (t * .7 + i / 3) % 1; h.position.set(hh.x - .1 + i * .1, hh.y + q * .35, hh.z); h.scale.setScalar(.06 * Math.sin(q * PI)); });
      frameOn([FR(-.45, 0, -.35, .45, .85, .35)], { az: lerp(.4, .34, k), el: .14, fill: lerp(.98, 1.04, k), t }); draw();
      stamp("BRUSH", W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06); }
    else { const k = (ph - .5) / .5; at(bun, 0, 0, 0, PI - .4); poseBunny(bun, t, { lid: .3, look: -.2 });
      bun.root.updateMatrixWorld(true); const cpz = bun.body.localToWorld(V(-.36, .2 + Math.sin(t * 6) * .02, .05)); place(cloth, 0, 0, 0); cloth.root.position.copy(cpz); cloth.root.rotation.set(0, PI - .4, PI / 2); cloth.root.scale.setScalar(1.7);
      frameOn([FR(-.45, 0, -.35, .45, .85, .35)], { az: lerp(.35, .28, k), el: .14, fill: lerp(.98, 1.04, k), t }); draw();
      stamp("DAMP CLOTH + VET", W * .42, H * .17, (k - .05) * d * .5 / .3, "#2f6fd0", .06);
      const cp = sm((k - .35) * d * .5 / .3); if (card(W * .42, H * .64, 820, 110, cp)) txt("Source: RWAF · RSPCA · HRS", W * .42, H * .64, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 9 Loop: zurück zur Hook-Einstellung (Kaninchen in der Wanne)
  KZ.shot("bLoop", (lt, d, t) => { inYard(); const ph = lt / d;
    place(tub, 0, 0, 0); inTub(tub, bun, t, { wide: ph > .6, ears: ph > .6 ? .65 : .2, look: -.15 }); foamHat(tub, bun, ph > .5);
    frameOn([FR(-.55, 0, -.55, .55, .9, .55)], { az: lerp(.4, .33, ph), el: .16, fill: lerp(1.08, 1.14, ph), t }); draw();
    if (ph > .3) stamp("BATH?", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__bath3d = true;
})();
