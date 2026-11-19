// 3D-Szene "Why You Should Never Smash Your Pond Ice" (19.11.2026). Grasfrosch (Rana temporaria) neu gebaut: oliv-braun,
// dunkle Maske hinter dem Auge, goldene Augen oben am Kopf, lange gefaltete Hinterbeine mit Schwimmhäuten, heller Bauch.
// Gartenteich mit Steinrand + Eisdecke (Risse, Loch), Teich-Querschnitt (Schlamm, Laub, Folie, Wasser, Eis), Goldfisch,
// Hammer, Presslufthammer, Topf mit heißem Wasser (Dampf), Schockwellen-Ringe, Faulgas-Blasen, Sterne, Sauerstoff-Punkte.
// Quellen: Froglife (Just Add Water, Pond problems), RSPCA (Helping wildlife in winter), Garden Wildlife Health (Winterkill).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let frog, frog2, fish, rudi, pond, sect, hammer, jack, pan, rings, gas, stars, oxy, chunks;

  // ---------- Grasfrosch ----------
  function makeFrog() {
    const skin = M(0x8a6f22, { roughness: .45 }), skinD = M(0x6b5418, { roughness: .5 }), mask = M(0x4a3018, { roughness: .6 }), belly = M(0xf2e3b0, { roughness: .6 });
    const spot = M(0x3f2c14, { roughness: .6 }), iris = M(0xd9a02a, { roughness: .15 }), pup = M(0x111111, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const trunk = sph(skin, -.02, .11, 0, .17, .085, .12); trunk.rotation.z = .18; body.add(trunk);
    body.add(sph(belly, .0, .07, 0, .15, .05, .1));
    for (const [x, z] of [[-.08, .05], [-.02, -.06], [-.12, -.03], [.03, .04]]) body.add(sph(spot, x, .175 - Math.abs(x) * .2, z, .025, .012, .022));
    const head = new T.Group(); head.position.set(.15, .14, 0); body.add(head);
    head.add(sph(skin, 0, 0, 0, .11, .065, .1));
    head.add(sph(skin, .07, -.01, 0, .06, .045, .075));
    const throat = sph(belly, .04, -.045, 0, .07, .03, .07); head.add(throat);
    const mo = mesh(new T.TorusGeometry(.085, .006, 6, 24, PI), M(0x3a2410), .03, -.02, 0); mo.rotation.set(PI / 2, 0, -PI / 2); mo.scale.set(1, 1.15, 1); head.add(mo);
    const eyes = [], lids = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.02, .055, s * .06); head.add(e);
      e.add(sph(iris, 0, 0, 0, .048)); e.add(sph(pup, .016, .006, s * .03, .026, .017, .022)); e.add(sph(hl, .026, .022, s * .04, .01)); eyes.push(e);
      const lid = sph(skin, 0, 0, 0, .052); lid.visible = false; e.add(lid); lids.push(lid);
      const mk = sph(mask, -.06, -.02, s * .035, .055, .03, .02); head.add(mk); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, mask, .02, .1, s * .06, .06, .012, .02); head.add(b); brows.push(b); }
    const hind = []; for (const s of [-1, 1]) { const hg = new T.Group(); hg.position.set(-.1, .08, s * .1); body.add(hg);
      const th = sph(skin, .02, 0, 0, .1, .045, .045); th.rotation.z = -.3; hg.add(th);
      const sh = sph(skinD, .04, -.035, s * .045, .1, .03, .03); sh.rotation.y = s * .25; hg.add(sh);
      const ft = new T.Group(); ft.position.set(.06, -.07, s * .06); hg.add(ft);
      ft.add(sph(skinD, .05, 0, 0, .08, .01, .045)); for (let i = 0; i < 3; i++) ft.add(sph(skinD, .12, 0, (i - 1) * .03, .03, .008, .012));
      for (const st of [-1, 1]) hg.add(sph(spot, 0, .025, st * .03, .02, .01, .012)); hind.push(hg); }
    const front = []; for (const s of [-1, 1]) { const f = limb(.02, .08, skin); f.position.set(.13, .1, s * .07); f.rotation.z = .3;
      const hand = sph(skin, .01, -.085, 0, .03, .01, .025); f.add(hand); body.add(f); front.push(f); }
    // Sterne (benommen)
    const starG = new T.Group(); head.add(starG); const sm8 = M(0xffd23f, { emissive: 0xffb000, emissiveIntensity: .8 });
    const sh5 = new T.Shape(); for (let i = 0; i < 10; i++) { const a = i / 10 * 2 * PI - PI / 2, r = i % 2 ? .45 : 1; i ? sh5.lineTo(Math.cos(a) * r, -Math.sin(a) * r) : sh5.moveTo(Math.cos(a) * r, -Math.sin(a) * r); }
    const sg = new T.ExtrudeGeometry(sh5, { depth: .4, bevelEnabled: false }); sg.center();
    for (let i = 0; i < 3; i++) { const s = mesh(sg, sm8); s.scale.setScalar(.03); s.castShadow = false; starG.add(s); }
    return { root, body, head, eyes, lids, brows, hind, front, throat, starG };
  }
  // o: {sleep, wide, sad, angry, dizzy, happy, jump, look, sc, breathe}
  function poseFrog(F, t, o) { o = o || {};
    const lid = o.sleep ? 1 : (Math.sin(t * 1.3 + 2) > .985 ? 1 : 0);
    F.lids.forEach((l) => { l.visible = lid > 0; }); F.eyes.forEach((e) => e.scale.setScalar(o.wide ? 1.25 : 1));
    F.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.angry ? .5 : (o.sad ? -.45 : 0)); b.visible = !!(o.angry || o.sad || o.wide); b.position.y = o.wide ? .115 : .1; });
    const br = o.breathe ?? 1; F.throat.scale.set(.07, .03 * (1 + Math.max(0, Math.sin(t * (o.sleep ? 2 : 6))) * .5 * br), .07);
    F.head.rotation.set(o.dizzy ? Math.sin(t * 6) * .25 : 0, o.look || 0, o.sleep ? -.08 : (o.happy ? .15 : 0));
    const j = o.jump || 0; F.hind.forEach((h) => h.rotation.z = j * .9); F.body.position.y = j * .15 + Math.sin(t * 2) * .003;
    F.body.rotation.z = (o.dizzy ? Math.sin(t * 6 + 1) * .08 : 0) + j * .3;
    F.starG.visible = !!o.dizzy; F.starG.children.forEach((s, i) => { const a = t * 5 + i * 2.1; s.position.set(Math.cos(a) * .12 - .02, .17 + Math.sin(a * 2) * .015, Math.sin(a) * .12); s.rotation.set(0, a, 0); });
    F.root.scale.setScalar(o.sc || 1); }

  // ---------- Goldfisch ----------
  function makeFish() { const root = new T.Group(), body = new T.Group(); root.add(body); const o = M(0xff8a1a, { roughness: .35 }), o2 = M(0xffb347, { roughness: .4 });
    body.add(sph(o, 0, 0, 0, .13, .08, .05)); const tail = new T.Group(); tail.position.set(-.12, 0, 0); body.add(tail);
    for (const s of [-1, 1]) { const f = sph(o2, -.06, s * .04, 0, .07, .035, .008); f.rotation.z = s * .6; tail.add(f); }
    body.add(sph(o2, 0, .08, 0, .06, .03, .008));
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.08, .02, s * .04); body.add(e); e.add(sph(M(0xffffff), 0, 0, 0, .025)); e.add(sph(M(0x111111), .008, 0, s * .012, .014)); e.add(sph(M(0xffffff, { emissive: 0xffffff }), .015, .008, s * .02, .005)); eyes.push(e); }
    root.traverse((m) => m.castShadow = false); return { root, body, tail, eyes }; }
  function poseFish(F, t, o) { o = o || {}; F.tail.rotation.y = Math.sin(t * 8) * .4; F.body.rotation.z = o.dizzy ? Math.sin(t * 5) * .5 : Math.sin(t * 2) * .05; F.body.position.y = Math.sin(t * 2.4) * .02;
    F.eyes.forEach((e) => e.scale.setScalar(o.wide ? 1.3 : 1)); F.root.scale.setScalar(o.sc || 1); }

  // ---------- Gartenteich (Draufsicht-Szene im Garten): Steinrand, Wasser, Eis mit Rissen, geschmolzenes Loch, Schilf ----------
  const PR = .8;
  function makePond() { const root = new T.Group();
    const water = mesh(new T.CircleGeometry(PR, 48), M(0x1f5f8a, { roughness: .1, metalness: .2 }), 0, .015, 0); water.rotation.x = -PI / 2; water.castShadow = false; root.add(water);
    const iceTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#dff4ff"; c.fillRect(0, 0, w, h); c.globalAlpha = .35; for (let i = 0; i < 40; i++) { c.strokeStyle = i % 2 ? "#ffffff" : "#a8d8f0"; c.lineWidth = 2 + (i % 3); c.beginPath(); const x = Math.random() * w, y = Math.random() * h; c.moveTo(x, y); c.lineTo(x + 30 - Math.random() * 60, y + 30 - Math.random() * 60); c.stroke(); } });
    const ice = mesh(new T.CircleGeometry(PR * .98, 48), M(0xffffff, { map: iceTex, roughness: .15, metalness: .1, transparent: true, opacity: .9 }), 0, .03, 0); ice.rotation.x = -PI / 2; ice.castShadow = false; root.add(ice);
    const hole = mesh(new T.CircleGeometry(1, 40), M(0x1a5279, { roughness: .05, metalness: .3 }), 0, .033, 0); hole.rotation.x = -PI / 2; hole.castShadow = false; root.add(hole);
    const cracks = new T.Group(); root.add(cracks); const cm = M(0x5a7f99, { roughness: .4 });
    for (let i = 0; i < 9; i++) { const a = i * 2 * PI / 9 + (i % 2) * .2, L = .25 + (i % 3) * .15; const c = mesh(BOX, cm, Math.cos(a) * L / 2, .036, Math.sin(a) * L / 2, L, .004, .012); c.rotation.y = -a; c.castShadow = false; cracks.add(c); }
    const stones = M(0x9aa0a6, { roughness: .8 }), stones2 = M(0x7d848c, { roughness: .8 });
    for (let i = 0; i < 22; i++) { const a = i / 22 * 2 * PI; root.add(sph(i % 2 ? stones : stones2, Math.cos(a) * (PR + .05), .04, Math.sin(a) * (PR + .05), .1 + (i % 3) * .02, .06, .08)); }
    const reed = M(0x4f8a3a, { roughness: .7 }), cat = M(0x6b3e1f, { roughness: .7 });
    for (let i = 0; i < 6; i++) { const x = -PR * .55 + (i % 3) * .1, z = -PR * .6 - Math.floor(i / 3) * .08; const r = mesh(CYL, reed, x, .35 + (i % 2) * .08, z, .012, .7 + (i % 2) * .16, .012); r.rotation.z = (i - 2.5) * .05; root.add(r);
      if (i % 2 === 0) root.add(mesh(CYL, cat, x + (i - 2.5) * .02, .62 + (i % 2) * .08, z, .028, .14, .028)); }
    return { root, water, ice, hole, cracks,
      set(o) { o = o || {}; ice.visible = o.ice ?? true; cracks.visible = !!o.cracks; cracks.scale.setScalar(o.crackSize || 1); cracks.position.set(o.cx || 0, 0, o.cz || 0);
        const hr = o.hole || 0; hole.visible = hr > 0 && ice.visible; hole.scale.setScalar(Math.max(.001, hr)); hole.position.set(o.hx || 0, .033, o.hz || 0); } }; }

  // ---------- Teich-Querschnitt (Studio-Diorama): Erde, Folie, Schlamm mit Laub, Wasser, Eisdecke ----------
  const SX = .9, FLOOR = .2, WTOP = 1.0, ITOP = 1.1, SZ = .45;
  function makeSection() { const root = new T.Group();
    const earth = M(0x7a5232, { roughness: .95 }), earthD = M(0x5e3e25, { roughness: .95 }), grass = M(0x6fba52, { roughness: .9 }), liner = M(0x2a2a30, { roughness: .6 }), mud = M(0x4a3524, { roughness: .95 });
    root.add(mesh(BOX, earth, 0, .05, 0, 2 * SX + .9, .1, 2 * SZ));
    for (const s of [-1, 1]) { root.add(mesh(BOX, earth, s * (SX + .23), .575, 0, .46, 1.15, 2 * SZ)); root.add(mesh(BOX, earthD, s * (SX + .23), .35, SZ + .002, .46, .08, .001));
      root.add(mesh(BOX, grass, s * (SX + .23), 1.18, 0, .5, .07, 2 * SZ + .04)); for (let i = 0; i < 5; i++) root.add(mesh(new T.ConeGeometry(.025, .12, 6), grass, s * (SX + .05 + i * .09), 1.27, SZ - .05 - (i % 2) * .2)); }
    root.add(mesh(BOX, earth, 0, .575, -SZ - .05, 2 * SX + .9, 1.15, .1));
    root.add(mesh(BOX, liner, 0, .12, 0, 2 * SX, .02, 2 * SZ)); for (const s of [-1, 1]) root.add(mesh(BOX, liner, s * (SX - .01), .6, 0, .02, 1.0, 2 * SZ));
    root.add(mesh(BOX, liner, 0, .6, -SZ + .01, 2 * SX, 1.0, .02));
    root.add(mesh(BOX, mud, 0, .16, 0, 2 * SX - .02, .08, 2 * SZ - .02));
    const leafM = [M(0xc9672a, { roughness: .8 }), M(0x8a5a2a, { roughness: .8 }), M(0xd9a13a, { roughness: .8 })]; const leaves = [];
    for (let i = 0; i < 16; i++) { const x = -SX + .1 + (i * .37 % 1) * (2 * SX - .2), z = -SZ + .08 + (i * .61 % 1) * (2 * SZ - .25); const l = sph(leafM[i % 3], x, FLOOR + .01, z, .07, .008, .04); l.rotation.y = i * 1.3; root.add(l); leaves.push(l); }
    const water = mesh(BOX, M(0x3fa2e0, { roughness: .1, transparent: true, opacity: .2, depthWrite: false }), 0, 0, 0, 2 * SX - .04, 1, 2 * SZ - .04); water.castShadow = false; water.receiveShadow = false; root.add(water);
    const surf = mesh(BOX, M(0x8fd4ff, { roughness: .05, transparent: true, opacity: .5, depthWrite: false }), 0, 0, 0, 2 * SX - .04, .01, 2 * SZ - .04); surf.castShadow = false; root.add(surf);
    const iceTex = canvasTex(256, 64, (c, w, h) => { c.fillStyle = "#e6f7ff"; c.fillRect(0, 0, w, h); c.globalAlpha = .5; for (let i = 0; i < 30; i++) { c.fillStyle = i % 2 ? "#ffffff" : "#b5e1f5"; c.fillRect(Math.random() * w, Math.random() * h, 20 + Math.random() * 40, 3); } });
    const ice = mesh(BOX, M(0xffffff, { map: iceTex, roughness: .15, transparent: true, opacity: .85 }), 0, (WTOP + ITOP) / 2, 0, 2 * SX, ITOP - WTOP, 2 * SZ); ice.castShadow = false; root.add(ice);
    const cracks = new T.Group(); root.add(cracks); const cm = M(0x4f7894, { roughness: .4 });
    for (let i = 0; i < 6; i++) { const a = -PI / 2 + (i - 2.5) * .35, L = .12 + (i % 3) * .06; const c = mesh(BOX, cm, Math.cos(a) * L / 2, WTOP + .05 + Math.sin(a) * L / 2 + .04, SZ + .002, L, .008, .002); c.rotation.z = a; c.castShadow = false; cracks.add(c); }
    const hole = sph(M(0x0a0a0a, { roughness: 1 }), 0, .2, .12, .09, .012, .06); hole.castShadow = false; root.add(hole);
    const drips = []; const dm = M(0x6cc4ff, { roughness: .05, transparent: true, opacity: .85 }); for (let i = 0; i < 8; i++) { const d = sph(dm, 0, 0, 0, .02, .03, .02); d.castShadow = false; root.add(d); drips.push(d); }
    return { root, water, surf, ice, cracks, hole, drips, leaves,
      set(o, t) { o = o || {}; const lvl = o.level ?? 1; const top = FLOOR + (WTOP - FLOOR) * lvl; water.scale.y = Math.max(.001, top - FLOOR); water.position.y = (FLOOR + top) / 2; surf.position.y = top; surf.visible = lvl < .98;
        ice.visible = o.ice ?? true; cracks.visible = !!o.cracks; cracks.position.x = o.cx || 0; cracks.scale.setScalar(o.crackSize || 1);
        hole.visible = !!o.hole; drips.forEach((d, i) => { d.visible = !!o.hole && lvl > .05; const q = ((t || 0) * 1.5 + i / drips.length) % 1; d.position.set(Math.cos(i * 2.4) * .07 * q, FLOOR + .05 - q * .0, .12 + Math.sin(i * 2.4) * .05 * q); d.scale.setScalar(.025 * (1 - q)); }); } }; }

  // ---------- Werkzeuge ----------
  function makeHammer() { const root = new T.Group(); const wd = M(0xc98b4a, { roughness: .6 }), met = M(0x8a929c, { metalness: .8, roughness: .3 }), grip = M(0xe23b3b, { roughness: .6 });
    const handle = mesh(CYL, wd, 0, 0, 0, .03, 1, .03); root.add(handle); const head = new T.Group(); root.add(head);
    head.add(mesh(BOX, met, 0, 0, 0, .11, .11, .28)); { const fc = mesh(CYL, met, 0, 0, .17, .065, .06, .065); fc.rotation.x = PI / 2; head.add(fc); }
    const gp = mesh(CYL, grip, 0, 0, 0, .036, .2, .036); root.add(gp); return { root, handle, head, gp }; }
  // Hammer: Griff von Hand hp bis Kopf hd
  function hammerAt(Hm, hp, hd) { Hm.root.visible = true; Hm.root.position.set(0, 0, 0); Hm.root.rotation.set(0, 0, 0); stick(Hm.handle, hp, hd, .03);
    Hm.gp.position.copy(hp.clone().lerp(hd, .1)); Hm.gp.quaternion.copy(Hm.handle.quaternion); Hm.head.position.copy(hd); Hm.head.quaternion.copy(Hm.handle.quaternion); }
  function makeJack() { const root = new T.Group(); const org = M(0xff7a1a, { roughness: .4 }), gry = M(0x3a3f48, { roughness: .5 }), met = M(0xb8c0c8, { metalness: .8, roughness: .3 });
    root.add(mesh(CYL, org, 0, .55, 0, .11, .5, .11)); root.add(mesh(CYL, gry, 0, .27, 0, .06, .12, .06)); const bit = mesh(new T.ConeGeometry(.03, .26, 12), met, 0, .1, 0); bit.rotation.x = PI; root.add(bit);
    root.add(mesh(CYL, gry, 0, .84, 0, .04, .1, .04)); const bar = mesh(CYL, gry, 0, .9, 0, .03, .6, .03); bar.rotation.x = PI / 2; root.add(bar);
    for (const s of [-1, 1]) { const gq = mesh(CYL, M(0x1a1a1a), 0, .9, s * .26, .045, .12, .045); gq.rotation.x = PI / 2; root.add(gq); }
    return { root }; }
  function makePan() { const root = new T.Group(); const red = M(0xd8342c, { roughness: .3, metalness: .2 }), wht = M(0xffffff, { roughness: .4 });
    const pot = mesh(new T.CylinderGeometry(.15, .13, .12, 32, 1, true), red, 0, .06, 0); pot.material = red.clone(); pot.material.side = T.DoubleSide; root.add(pot);
    root.add(mesh(CYL, red, 0, .005, 0, .13, .01, .13)); const rim = mesh(new T.TorusGeometry(.15, .01, 8, 32), wht, 0, .12, 0); rim.rotation.x = PI / 2; root.add(rim);
    const hw = mesh(CYL, M(0x9bd9ff, { roughness: .05 }), 0, .09, 0, .14, .005, .14); root.add(hw);
    const hd = mesh(BOX, M(0x2a2a30, { roughness: .5 }), .28, .1, 0, .22, .03, .04); root.add(hd);
    const steam = []; const sm2 = M(0xffffff, { roughness: 1, transparent: true, opacity: .6 }); for (let i = 0; i < 6; i++) { const s = sph(sm2.clone(), 0, 0, 0, .05); s.castShadow = false; root.add(s); steam.push(s); }
    root.traverse((m) => m.castShadow = false); return { root, steam }; }
  function steamAt(P, t, on) { P.steam.forEach((s, i) => { s.visible = on; const q = (t * .6 + i / 6) % 1; s.position.set(Math.sin(i * 2.1 + t) * .05, .15 + q * .55, Math.cos(i * 1.7) * .05); s.scale.setScalar(.04 + q * .07); s.material.opacity = .65 * Math.sin(q * PI); }); }
  // Schockwellen (Halbringe unter dem Eis), Faulgas-Blasen, Sauerstoff-Punkte, Eisbrocken
  function makeRings() { const root = new T.Group(), list = []; for (let i = 0; i < 3; i++) { const r = mesh(new T.TorusGeometry(1, .015, 8, 48, PI), M(0xffffff, { emissive: 0xbfe8ff, emissiveIntensity: .8, transparent: true, opacity: .8 })); r.rotation.z = PI; r.castShadow = false; root.add(r); list.push(r); } return { root, list }; }
  function ringsAt(cx, t, on, speed) { rings.root.visible = on; rings.list.forEach((r, i) => { const q = (t * (speed || 1.2) + i / 3) % 1; r.position.set(cx, WTOP - .01, SZ - .05); const s = .08 + q * .8; r.scale.set(s, s * .9, 1); r.material.opacity = .85 * (1 - q); }); }
  function makeBubbles(n, col, emi) { const root = new T.Group(), list = []; const m = M(col, { roughness: .2, emissive: emi, emissiveIntensity: .5, transparent: true, opacity: .85 }); for (let i = 0; i < n; i++) { const b = sph(m, 0, 0, 0, .03); b.castShadow = false; root.add(b); list.push(b); } return { root, list }; }
  function makeChunks() { const root = new T.Group(), list = []; const m = M(0xe6f7ff, { roughness: .2, transparent: true, opacity: .9 }); for (let i = 0; i < 10; i++) { const c = mesh(BOX, m, 0, 0, 0, .06, .03, .05); c.castShadow = false; root.add(c); list.push(c); } return { root, list }; }

  K3.onBuild(() => {
    rudi = K3.rudi; frog = actor(makeFrog(), "Frosch"); frog2 = actor(makeFrog(), "Frosch 2"); fish = actor(makeFish(), "Goldfisch");
    pond = actor(makePond(), "Teich"); sect = actor(makeSection(), "Querschnitt"); hammer = actor(makeHammer(), "Hammer"); jack = actor(makeJack(), "Presslufthammer"); pan = actor(makePan(), "Topf");
    rings = actor(makeRings(), "Wellen"); gas = actor(makeBubbles(16, 0xa8e05f, 0x3a6a10), "Gas"); oxy = actor(makeBubbles(12, 0xbff0ff, 0x4aa8d8), "Sauerstoff"); chunks = actor(makeChunks(), "Eisbrocken");
    for (const a of [pond, sect, hammer, jack, pan, rings, gas, oxy, chunks, fish]) a.noCheck = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { rudi.noCheck = false; rudi.body.position.set(0, 0, 0); for (const f of [frog, frog2]) { f.root.rotation.set(0, 0, 0); f.noCheck = false; } sect.root.scale.setScalar(1); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function stick(m, a, b, r) { const d = b.clone().sub(a); m.position.copy(a).add(d.clone().multiplyScalar(.5)); m.scale.set(r, d.length(), r); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); }
  function hand(i) { return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function hands() { rudi.root.updateMatrixWorld(true); return hand(0).add(hand(1)).multiplyScalar(.5); }
  function shoulder() { rudi.root.updateMatrixWorld(true); return rudi.arms[0].localToWorld(V(0, 0, 0)).add(rudi.arms[1].localToWorld(V(0, 0, 0))).multiplyScalar(.5); }
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  function zzz(x, y, t, s) { for (let i = 0; i < 3; i++) { const ph = (t * .6 + i / 3) % 1; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = Math.sin(ph * PI); g.fillStyle = "#fff"; g.font = `900 ${Math.round((40 + i * 12) * (s || 1))}px "Montserrat"`; g.textAlign = "center"; g.lineWidth = 6; g.strokeStyle = "rgba(20,30,60,.6)"; g.strokeText("z", x + ph * 70, y - ph * 140); g.fillText("z", x + ph * 70, y - ph * 140); g.restore(); } }
  const SEC = () => FR(-SX, FLOOR, -SZ, SX, ITOP + .15, SZ);
  // Querschnitt mit schlafendem Frosch (Hook/Loop/Fakten)
  function sectScene(t, o) { studio(); place(sect, 0, 0, 0); sect.set(o.sect || {}, t);
    at(frog, o.fx ?? -.2, FLOOR + .005, .05, o.fry ?? .35); poseFrog(frog, t, Object.assign({ sc: 1.9 }, o.frog || {})); frog.noCheck = true;
    if (o.fish) { at(fish, .58, .74, -.05, PI - .45); poseFish(fish, t, Object.assign({ sc: 1.5 }, o.fishO || {})); }
  }
  function swingHammer(cx, p) { // p 0 = weit oben, 1 = Treffer auf dem Eis
    const L = .6, piv = V(cx + L, ITOP + .12, .2), a = lerp(.85, PI / 2, p); const hd = V(cx + L - Math.sin(a) * L, ITOP + .12 + Math.cos(a) * L - .0, .2);
    const dir = hd.clone().sub(piv).normalize(); hammerAt(hammer, piv.clone().sub(dir.clone().multiplyScalar(.15)), hd); }

  // ---------- Shots ----------
  // 0 Hook: Querschnitt, Frosch schläft unten, Hammer saust aufs Eis, Riss + Schockwellen, Frosch reißt die Augen auf
  KZ.shot("pHook", (lt, d, t) => { const ph = lt / d, hit = clamp((ph - .25) / .15, 0, 1), after = ph > .4;
    sectScene(t, { sect: { cracks: after, crackSize: after ? easeBack(clamp((ph - .4) / .2, 0, 1)) : 1 }, frog: after ? { wide: true, jump: Math.max(0, Math.sin(clamp((ph - .4) / .25, 0, 1) * PI)) * .6 } : { sleep: true }, fish: true, fishO: { wide: after } });
    swingHammer(0, sm(hit)); ringsAt(0, t, after, 1.3);
    frameOn([FR(-SX, FLOOR, -SZ, SX, ITOP + .2, SZ)], { az: lerp(.16, .1, ph), el: .1, fill: lerp(1.12, 1.2, ph), dy: .05, t }); draw();
    if (!after) { const [x, y] = scr(frog.head.localToWorld(V(0, .1, 0))); zzz(x + 20, y - 20, t, 1); }
    if (ph > .45) stamp("DON'T!", W * .42, H * .63, (ph - .45) * d / .3, "#e5484d", -.06); });
  // 1 Rudi friert am zugefrorenen Teich und gerät in Panik; Schnitt: Frosch schläft seelenruhig unter dem Eis
  KZ.shot("pPanic", (lt, d, t) => { const ph = lt / d;
    if (ph < .55) { const k = ph / .55; inYard(); place(pond, .45, .2, 0); pond.set({});
      place(rudi, -.85, -.25, .15); poseRudi(rudi, t, { arms: [2.7 + Math.sin(t * 9) * .1, 2.6 - Math.sin(t * 9) * .1], spread: .35, mouth: "o", wide: true, lean: Math.sin(t * 30) * .01 });
      frameOn([rudi, FR(-.35, 0, -.6, 1.25, .5, 1.0)], { az: lerp(.5, .44, k), el: .2, fill: lerp(.95, 1.0, k), t }); draw();
      stamp("FROZEN!", W * .42, H * .17, (lt - .15) / .3, "#2f6fd0", -.06); }
    else { const k = (ph - .55) / .45; sectScene(t, { frog: { sleep: true }, fry: .5 });
      frameOn([FR(-.75, FLOOR, -.3, .35, .75, .4)], { az: lerp(.25, .18, k), el: .08, fill: lerp(.95, 1.05, k), t }); draw();
      const [x, y] = scr(frog.head.localToWorld(V(0, .1, 0))); zzz(x + 20, y - 20, t, 1.2);
      stamp("TRAPPED?!", W * .42, H * .17, (k - .1) * d * .45 / .3, "#e5484d", .06); } });
  // 2 Rudi haut mit dem Hammer aufs Eis (Risse); Schnitt: unten sehen Frosch und Fisch Sterne
  KZ.shot("pHammer", (lt, d, t) => { const ph = lt / d;
    if (ph < .5) { const k = ph / .5; inYard(); place(pond, .45, .2, 0);
      const sw = k < .5 ? sm(k / .5) : 1; const hitK = k > .5; pond.set({ cracks: hitK, crackSize: hitK ? easeBack(clamp((k - .5) / .25, 0, 1)) : 1, cx: -.25, cz: -.05 });
      place(rudi, -.7, -.15, .05); poseRudi(rudi, t, { arms: [lerp(2.8, 1.25, sw), lerp(2.8, 1.25, sw)], spread: .02, mouth: hitK ? "o" : "smile", lean: lerp(-.1, .12, sw) }); rudi.noCheck = true;
      const hp = hands(), sh = shoulder(); const dir = hp.clone().sub(sh).normalize(); hammerAt(hammer, hp, hp.clone().add(dir.multiplyScalar(.55)));
      frameOn([rudi, FR(-.35, 0, -.6, 1.25, .5, 1.0)], { az: lerp(.5, .45, k), el: .2, fill: lerp(.95, 1.0, k), t }); draw();
      if (hitK) stamp("BONK!", W * .42, H * .17, (k - .5) * d * .5 / .3, "#ff7a1a", -.07); }
    else { const k = (ph - .5) / .5; sectScene(t, { sect: { cracks: true }, frog: { dizzy: true, wide: true }, fish: true, fishO: { dizzy: true, wide: true } }); ringsAt(0, t, k < .6, 1.5);
      frameOn([SEC()], { az: lerp(.14, .08, k), el: .08, fill: lerp(1.05, 1.12, k), dy: -.05, t }); draw();
      stamp("SEEING STARS", W * .42, H * .17, (k - .05) * d * .5 / .3, "#ffb800", .06); } });
  // 3 Rudi mit Presslufthammer (Eisbrocken fliegen); Schnitt: Loch in der Teichfolie, Wasser läuft aus, Frosch sitzt im Schlamm
  KZ.shot("pDrill", (lt, d, t) => { const ph = lt / d;
    if (ph < .68) { const k = ph / .68; inYard(); place(pond, .45, .2, 0); pond.set({ cracks: true, crackSize: 1.3, cx: -.25, cz: -.05 });
      place(rudi, -.55, -.05, .05); poseRudi(rudi, t, { arms: [1.05, 1.05], spread: .02, mouth: "o", wide: true, lean: .08 }); rudi.noCheck = true;
      rudi.body.position.x = Math.sin(t * 60) * .012; rudi.body.position.y = Math.abs(Math.sin(t * 45)) * .02;
      const hp = hands(); place(jack, 0, 0, 0); jack.root.position.set(hp.x + .05, hp.y - .9 + Math.abs(Math.sin(t * 50)) * .03, hp.z); jack.root.rotation.y = -.05;
      chunks.root.visible = true; chunks.list.forEach((c, i) => { const q = (t * 1.6 + i / 10) % 1, a = i * 2.399; c.position.set(hp.x + .05 + Math.cos(a) * q * .5, .05 + Math.sin(q * PI) * .4, hp.z + Math.sin(a) * q * .5); c.rotation.set(q * 6, i, q * 4); });
      frameOn([rudi, FR(-.35, 0, -.6, 1.25, .5, 1.0)], { az: lerp(.5, .45, k), el: .2, fill: lerp(.95, 1.0, k), t }); draw();
      stamp("BRRRRT!", W * .42, H * .17, (lt - .15) / .3, "#ff7a1a", -.07); }
    else { const k = (ph - .68) / .32; const lvl = lerp(.85, .12, sm(clamp(k / .8, 0, 1)));
      sectScene(t, { sect: { ice: false, level: lvl, hole: true }, frog: { sad: true, look: .3 }, fx: -.35 });
      frameOn([SEC()], { az: lerp(.12, .08, k), el: .14, fill: lerp(1.0, 1.06, k), dy: -.05, t }); draw();
      stamp("LEAK!", W * .42, H * .17, (k - .05) * d * .32 / .3, "#e5484d", .06); } });
  // 4 Fakt: Frosch schläft am Teichgrund und atmet durch die Haut (Sauerstoff-Punkte wandern in die Haut)
  KZ.shot("pSleep", (lt, d, t) => { const ph = lt / d, k = sm(ph);
    sectScene(t, { frog: { sleep: true }, fx: -.15, fry: .45 });
    oxy.root.visible = true; frog.root.updateMatrixWorld(true); const c = frog.body.localToWorld(V(0, .12, 0));
    oxy.list.forEach((b, i) => { const q = (t * .5 + i / 12) % 1, a = i * 2.399; const r = .55 * (1 - q) + .08; b.position.set(c.x + Math.cos(a) * r, c.y + .05 + Math.abs(Math.sin(a)) * r * .7, c.z + .1); b.scale.setScalar(.03 * (q < .9 ? 1 : (1 - q) * 10)); });
    frameOn([FR(-.8, FLOOR, -.3, .5, .85, .4)], { az: lerp(.22, .12, k), el: .08, fill: lerp(.92, 1.02, k), t }); draw();
    const [x, y] = scr(frog.head.localToWorld(V(0, .1, 0))); zzz(x + 20, y - 30, t, 1.2);
    stamp("SKIN BREATHING", W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .4) / .3); if (card(W * .42, H * .63, 880, 210, cp, "FROGLIFE", "#2f6fd0")) {
      txt("“Male frogs lie dormant on", W * .42, H * .63 + 6, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("the bottom of the pond.”", W * .42, H * .63 + 52, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 5 Fakt: Hammerschlag schickt Schockwellen durchs Wasser, Frosch zuckt + Froglife-Zitat
  KZ.shot("pShock", (lt, d, t) => { const ph = lt / d, k = sm(ph);
    const hit = (t * 1.1) % 1; sectScene(t, { sect: { cracks: true }, frog: { wide: true, jump: hit < .3 ? Math.sin(hit / .3 * PI) * .5 : 0 }, fish: true, fishO: { wide: true } });
    swingHammer(0, hit < .15 ? 1 : (hit < .7 ? 1 - sm((hit - .15) / .55) : sm((hit - .7) / .3))); ringsAt(0, t, true, 1.1);
    frameOn([SEC()], { az: lerp(.1, .04, k), el: .1, fill: lerp(1.0, 1.06, k), dy: .05, t }); draw();
    stamp("SHOCK WAVES", W * .42, H * .17, (lt - .15) / .3, "#e5484d", -.06);
    const cp = sm((lt - d * .4) / .3); if (card(W * .42, H * .63, 920, 210, cp, "FROGLIFE", "#2f6fd0")) {
      txt("“Don't be tempted to smash the ice...", W * .42, H * .63 + 6, 32, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("the shock-waves can kill wildlife.”", W * .42, H * .63 + 52, 32, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 6 Infografik: Laub fault am Grund, grüne Gasblasen steigen auf und bleiben unter dem Eis gefangen + RSPCA-Zitat
  KZ.shot("pGas", (lt, d, t) => { const ph = lt / d, k = sm(ph);
    sectScene(t, { frog: { sad: true, lid: 0 }, fx: -.3, fry: .4, fish: true });
    gas.root.visible = true; gas.list.forEach((b, i) => { const x0 = -SX + .15 + (i * .37 % 1) * (2 * SX - .3); const q = clamp(((t * .35 + i / 16) % 1.4), 0, 1);
      const y = q < .7 ? lerp(FLOOR + .04, WTOP - .04, q / .7) : WTOP - .04; b.position.set(x0 + (q > .7 ? (q - .7) * .4 * (i % 2 ? 1 : -1) : Math.sin(t * 3 + i) * .02), y, -.1 + (i % 3) * .15); b.scale.setScalar(.03 + (i % 3) * .012); });
    frameOn([SEC()], { az: lerp(.12, .06, k), el: .08, fill: lerp(1.0, 1.06, k), dy: .05, t }); draw();
    stamp("TOXIC GAS", W * .42, H * .17, (lt - .15) / .3, "#7cb518", -.06);
    const cp = sm((lt - d * .38) / .3); if (card(W * .42, H * .63, 920, 250, cp, "RSPCA", "#2f6fd0")) {
      txt("“Toxic gases can build up in frozen", W * .42, H * .63 + 2, 32, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("ponds, killing fish or frogs that may", W * .42, H * .63 + 46, 32, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("be hiding at the bottom.”", W * .42, H * .63 + 90, 32, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 7 Pointe: Rudi steht verlegen mit dem Presslufthammer, Frosch sitzt böse auf dem Steinrand
  KZ.shot("pOver", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(pond, .45, .2, 0); pond.set({ cracks: true, crackSize: 1.3, cx: -.25, cz: -.05, hole: .2, hx: -.25, hz: -.05 });
    place(rudi, -.6, -.05, .1); poseRudi(rudi, t, { arms: [.9, .9], spread: .02, mouth: "smile", tilt: -.12, nod: .06 }); rudi.noCheck = true;
    const hp = hands(); place(jack, 0, 0, 0); jack.root.position.set(hp.x + .05, hp.y - .9, hp.z); jack.root.rotation.z = -.1;
    at(frog, .45 + Math.cos(.35) * (PR + .05), .1, .2 + Math.sin(.35) * (PR + .05), PI + .2); poseFrog(frog, t, { angry: true, sc: 1.9, breathe: .3 }); frog.noCheck = true;
    frameOn([rudi, frog], { az: lerp(.55, .5, k), el: .14, fill: lerp(1.05, 1.12, k), t }); draw();
    if (ph > .3) stamp("OVERKILL", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", .06); });
  // 8 Tipp: Topf mit heißem Wasser steht auf dem Eis, dampft, ein rundes Loch schmilzt; Frosch schaut zufrieden zu + Quellenkarte
  KZ.shot("pTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(pond, 0, 0, 0); const melt = sm(clamp((ph - .15) / .6, 0, 1)); pond.set({ hole: lerp(.17, .34, melt), hx: .05, hz: .1 });
    place(pan, 0, 0, 0); pan.root.position.set(.05, .035 - melt * .02, .1); pan.root.rotation.y = .6; steamAt(pan, t, true);
    at(frog, Math.cos(-1.3) * (PR + .05), .1, Math.sin(-1.3) * (PR + .05), -1.75); poseFrog(frog, t, { happy: true, sc: 1.7 }); frog.noCheck = true;
    frameOn([FR(-.55, 0, -.4, .65, .55, 1.0)], { az: lerp(.3, .22, k), el: .42, fill: lerp(1.0, 1.08, k), t }); draw();
    stamp("MELT, DON'T SMASH", W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .55) / .3); if (card(W * .42, H * .64, 820, 110, cp)) txt("Source: Froglife · RSPCA", W * .42, H * .64, 34, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 9 Loop: zurück zur Hook-Einstellung (Hammer schwebt drohend über dem Eis, Frosch schläft)
  KZ.shot("pLoop", (lt, d, t) => { const ph = lt / d;
    sectScene(t, { frog: { sleep: true }, fish: true });
    swingHammer(0, lerp(0, .12, sm(ph))); rings.root.visible = false;
    frameOn([FR(-SX, FLOOR, -SZ, SX, ITOP + .2, SZ)], { az: lerp(.2, .16, ph), el: .1, fill: lerp(1.08, 1.12, ph), dy: .05, t }); draw();
    const [x, y] = scr(frog.head.localToWorld(V(0, .1, 0))); zzz(x + 20, y - 20, t, 1);
    if (ph > .3) stamp("SMASH?", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__pondice3d = true;
})();
