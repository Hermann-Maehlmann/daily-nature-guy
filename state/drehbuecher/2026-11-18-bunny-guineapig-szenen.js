// 3D-Szene "Why Your Bunny Shouldn't Live With A Guinea Pig" (18.11.2026). Hauskaninchen (aus dem Kaninchen-Video vom 17./18.11.),
// neues Meerschweinchen (dreifarbig: orange/weiß/dunkelbraun, Blesse, kurze Hängeohren, kein Schwanz), Geschenkkarton, großer Stall,
// Schiedsrichter-Pfeife + rote Karte für Rudi, Studio-Infografiken (Sprachen, Tritt, Keim Bordetella, Vitamin C).
// Quellen: RSPCA (Rabbits and guinea pigs), RWAF (Rabbits and guinea pigs – Bordetella).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let bun, bun2, bigBun, gp, gp2, bigGp, rudi, hutch, bigHutch, run, gift, stars, germs, bars, puff, ref;

  // ---------- Hauskaninchen (wildfarben braun, cremefarbener Bauch, weiße Blume, lange Ohren, große Hinterpfoten) ----------
  function makeBunny(col) {
    const fur = M(col || 0xb98a5e, { roughness: .8 }), furD = M(new T.Color(col || 0xb98a5e).multiplyScalar(.8).getHex(), { roughness: .8 }), cream = M(0xf6e7cf, { roughness: .85 }), white = M(0xffffff, { roughness: .9 });
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
    return { root, body, head, ears, eyes, brows, nose, hind, front, tail };
  }
  // o: {ears 0 aufrecht..1 angelegt, wide, kick, lid, hop, look, tilt, nod, lean, sc, sad, thump}
  function poseBunny(B, t, o) {
    o = o || {};
    const ea = o.ears || 0; B.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.set(s * (.12 + ea * .05), 0, ea * 1.25 + Math.sin(t * 2.3 + i) * .04 * (1 - ea)); });
    B.head.rotation.set(o.tilt || 0, o.look || 0, (o.nod || 0) + Math.sin(t * 1.6) * .02);
    B.nose.scale.set(.022, .018 * (1 + Math.sin(t * 22) * .18), .026);
    const lid = o.lid ?? (Math.sin(t * 1.4 + 1) > .985 ? .85 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.22 : 1), o.wide ? 1.1 : 1));
    B.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.angry ? .4 : (o.wide ? -.35 : (o.sad ? .35 : 0))); b.position.y = o.wide ? .115 : .1; });
    const k = o.kick || 0, hop = o.hop || 0, th = o.thump ? Math.max(0, Math.sin(t * 9)) * .5 : 0;
    B.hind.forEach((h, i) => { h.rotation.z = -(k * (1.0 + Math.sin(t * 26 + i * 2) * .5)) - hop * 1.1 + th * (i ? 1 : .9); });
    B.front.forEach((f, i) => { f.rotation.z = k * Math.sin(t * 24 + i * 1.5) * .6 + hop * .9; });
    B.body.rotation.z = hop * .25 + (o.lean || 0) - k * .25;
    B.body.position.set(0, Math.sin(t * 2) * .004 + k * .05, 0);
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Meerschweinchen (eigener Entwurf: rundlicher Walzenkörper ohne Schwanz, dreifarbig orange/weiß/dunkelbraun,
  // weiße Blesse über die Nase, kurze Rosettenohren hängend, kurze Beinchen mit rosa Pfoten, große dunkle Augen) ----------
  function makeGp() {
    const org = M(0xe8923a, { roughness: .85 }), wht = M(0xfbf4ea, { roughness: .9 }), drk = M(0x4a3122, { roughness: .85 }), pink = M(0xf3a0a6, { roughness: .6 });
    const eyeM = M(0x1a0f0c, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(wht, -.02, .13, 0, .22, .125, .145));              // Körper weiß (Grund)
    body.add(sph(org, .05, .145, 0, .15, .12, .15));                // orange Schulterpartie
    body.add(sph(drk, -.14, .15, 0, .1, .11, .148));                // dunkler Hinterteil-Fleck
    body.add(sph(org, -.07, .22, 0, .09, .05, .1));                 // oranger Rückensattel
    const feet = []; for (const [x, s] of [[.1, -1], [.1, 1], [-.12, -1], [-.12, 1]]) { const f = sph(pink, x, .018, s * .08, .035, .018, .03); body.add(f); feet.push(f); }
    const head = new T.Group(); head.position.set(.17, .15, 0); body.add(head);
    head.add(sph(org, 0, 0, 0, .12, .108, .112));
    head.add(sph(wht, .055, .01, 0, .085, .085, .05));              // Blesse
    const snout = sph(wht, .095, -.025, 0, .055, .055, .07); head.add(snout);
    const nose = sph(pink, .145, -.008, 0, .018, .014, .022); head.add(nose);
    const mo = mesh(new T.TorusGeometry(.013, .004, 6, 12, PI), M(0x6a3a30), .145, -.05, 0); mo.rotation.set(0, PI / 2, PI); head.add(mo);
    const oMouth = sph(M(0x5a1a22), .145, -.055, 0, .012, .02, .018); head.add(oMouth);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.05, .035, s * .088); head.add(e);
      e.add(sph(eyeM, 0, 0, 0, .036, .04, .026)); e.add(sph(hl, .018, .016, .014 * s, .01)); eyes.push(e); }
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.03, .075, s * .085); head.add(e);
      const ear = sph(M(0xd07a32, { roughness: .8 }), 0, .012, s * .012, .04, .028, .016); ear.rotation.x = s * .6; e.add(ear); ears.push(e); }
    const wh = M(0xffffff, { roughness: .4 }); for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { const w = mesh(CYL, wh, .11, -.03 + i * .02, s * .07, .003, .11, .003); w.rotation.x = s * (PI / 2 - .2 + i * .25); w.castShadow = false; head.add(w); }
    return { root, body, head, eyes, ears, nose, mo, oMouth, feet };
  }
  // o: {sneeze 0..1 (Ablauf), wide, lid, shake, wheek, look, nod, sc, sad, run}
  function poseGp(G, t, o) {
    o = o || {};
    const sn = o.sneeze ?? -1; let pitch = 0, sq = 1;
    if (sn >= 0 && sn <= 1) { pitch = sn < .6 ? -sm(sn / .6) * .35 : lerp(-.35, .3, sm((sn - .6) / .12)) - (sn > .72 ? sm((sn - .72) / .28) * .3 : 0); sq = sn > .6 && sn < .8 ? .9 : 1; }
    const sh = o.shake ? Math.sin(t * 60) * .012 : 0;
    G.head.rotation.set(0, o.look || 0, (o.nod || 0) + pitch + Math.sin(t * 2.1) * .03);
    G.nose.scale.set(.018, .014 * (1 + Math.sin(t * 18) * .2), .022);
    const lid = o.lid ?? ((sn > .6 && sn < .8) ? .9 : (Math.sin(t * 1.3 + 2) > .985 ? .85 : 0));
    G.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.25 : 1), o.wide ? 1.1 : 1));
    const w = !!o.wheek || (sn > .6 && sn < .78); G.oMouth.visible = w; G.mo.visible = !w;
    G.ears.forEach((e, i) => { e.rotation.z = Math.sin(t * 3 + i) * .08; });
    const r = o.run || 0; G.feet.forEach((f, i) => { f.position.y = .018 + Math.max(0, Math.sin(t * 20 + i * 1.7)) * .03 * r; });
    G.body.position.set(sh, Math.sin(t * 2.4) * .004 + r * Math.abs(Math.sin(t * 20)) * .015, 0);
    G.body.scale.set(1, sq, 1);
    G.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Stall (Holz, auf Beinen, Wohnbereich vorn offen, Schlafkammer rechts) ----------
  const FLOOR = .3, IN = .62;
  function makeHutch(o) {
    o = o || {}; const root = new T.Group();
    const wood = M(o.wall || 0xc98b4f, { roughness: .75 }), trim = M(o.trim || 0x8a5a33, { roughness: .7 }), roofM = M(o.roof || 0x2f6f8f, { roughness: .6 });
    for (const [x, z] of [[-.55, -.28], [.93, -.28], [-.55, .28], [.93, .28]]) root.add(mesh(BOX, trim, x, FLOOR / 2, z, .07, FLOOR, .07));
    root.add(mesh(BOX, trim, .19, FLOOR - .02, 0, 1.56, .05, .66));
    { const st = mesh(new T.PlaneGeometry(1.0, .56), M(0xe8d27a, { roughness: 1 }), -.02, FLOOR + .007, 0); st.rotation.x = -PI / 2; root.add(st); }
    root.add(mesh(BOX, wood, .19, FLOOR + IN / 2, -.31, 1.56, IN, .04));
    root.add(mesh(BOX, wood, -.56, FLOOR + IN / 2, 0, .04, IN, .66));
    root.add(mesh(BOX, wood, .95, FLOOR + IN / 2, 0, .04, IN, .66));
    root.add(mesh(BOX, wood, .55, FLOOR + IN / 2, 0, .04, IN, .62));
    root.add(mesh(BOX, wood, .75, FLOOR + IN / 2, .31, .4, IN, .04));
    root.add(mesh(BOX, trim, -.01, FLOOR + IN + .01, .31, 1.14, .05, .05));
    const roof = mesh(BOX, roofM, .19, FLOOR + IN + .05, .02, 1.72, .05, .82); roof.rotation.x = .12; root.add(roof);
    return { root };
  }
  // Auslauf mit Gitterzaun
  function wireTex(col) { return canvasTex(256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = col || "#d8dde3"; c.lineWidth = 5; for (let i = 0; i <= w; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } }); }
  function wirePlane(w, h, rep) { const tx = wireTex(); tx.wrapS = tx.wrapT = T.RepeatWrapping; tx.repeat.set(rep * w, rep * h);
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: tx, transparent: true, alphaTest: .4, side: T.DoubleSide, metalness: .5, roughness: .4 })); m.castShadow = false; return m; }
  function makeRun(X0, X1, Z0, Z1, HH) { const root = new T.Group(); const post = M(0x8a5a33, { roughness: .7 });
    for (const [x, z] of [[X0, Z0], [X1, Z0], [X0, Z1], [X1, Z1]]) root.add(mesh(BOX, post, x, HH / 2, z, .05, HH, .05));
    const side = (x, z, w, ry) => { const p = wirePlane(w, HH, 5); p.position.set(x, HH / 2, z); p.rotation.y = ry; root.add(p); const rail = mesh(BOX, post, x, HH, z, w, .035, .035); rail.rotation.y = ry; root.add(rail); };
    side((X0 + X1) / 2, Z1, X1 - X0, 0); side((X0 + X1) / 2, Z0, X1 - X0, 0); side(X1, (Z0 + Z1) / 2, Z1 - Z0, PI / 2); side(X0, (Z0 + Z1) / 2, Z1 - Z0, PI / 2);
    return { root }; }
  // Geschenkkarton mit Schleife (Deckel fliegt auf)
  function makeGift() { const root = new T.Group(); const red = M(0x2f6fd0, { roughness: .5 }), rib = M(0xffd23f, { roughness: .4 });
    root.add(mesh(BOX, red, 0, .15, 0, .36, .3, .36)); root.add(mesh(BOX, rib, 0, .15, 0, .37, .3, .06)); root.add(mesh(BOX, rib, 0, .15, 0, .06, .3, .37));
    const lid = new T.Group(); lid.position.y = .3; root.add(lid); lid.add(mesh(BOX, red, 0, .025, 0, .4, .05, .4)); lid.add(mesh(BOX, rib, 0, .03, 0, .41, .05, .06));
    for (const s of [-1, 1]) { const l = sph(rib, s * .06, .09, 0, .07, .045, .03); l.rotation.z = -s * .5; lid.add(l); }
    return { root, lid }; }
  // Schiedsrichter: Trillerpfeife am Mund + rote Karte in der Hand (an Rudi gehängt)
  function makeRef(R) { const metal = M(0xd6dde6, { metalness: .85, roughness: .25 });
    const wh = new T.Group(); wh.position.set(.34, -.14, .03); R.head.add(wh); { const tb = mesh(CYL, metal, .04, 0, 0, .03, .08, .03); tb.rotation.z = PI / 2; wh.add(tb); } wh.add(sph(metal, -.005, -.015, 0, .045, .04, .035));
    const cardM = new T.Group(); cardM.position.set(.0, -.78, 0); R.arms[0].add(cardM); cardM.add(mesh(BOX, M(0xe5484d, { roughness: .5 }), 0, -.08, 0, .16, .22, .015));
    wh.traverse((m) => m.castShadow = false);
    return { wh, cardM }; }
  // Sterne (nach dem Tritt)
  function makeStars() { const root = new T.Group(); const list = []; const s = new T.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? .4 : 1, a = i / 10 * 2 * PI - PI / 2; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    const geo = new T.ExtrudeGeometry(s, { depth: .3, bevelEnabled: false }); geo.center();
    for (let i = 0; i < 4; i++) { const m = mesh(geo, M(0xffd23f, { emissive: 0x8a6a00, roughness: .3 })); m.scale.setScalar(.05); m.castShadow = false; root.add(m); list.push(m); } return { root, list }; }
  // Keime (Bordetella): grüne Knubbel-Kugeln mit Wimpern-Stacheln, leuchten leicht
  function makeGerms(n) { const root = new T.Group(); const list = []; const mat = M(0x7ddc5a, { emissive: 0x2a7a10, emissiveIntensity: .7, roughness: .5 }), dk = M(0x3e8f2a, { roughness: .5 });
    for (let i = 0; i < n; i++) { const gr = new T.Group(); gr.add(sph(mat, 0, 0, 0, .07, .045, .045)); for (let k = 0; k < 6; k++) { const a = k / 6 * 2 * PI; const sp = mesh(CYL, dk, Math.cos(a) * .07, Math.sin(a) * .045, 0, .006, .05, .006); sp.rotation.z = a - PI / 2; gr.add(sp); }
      for (const s of [-1, 1]) gr.add(sph(M(0x111111), .03, .015, s * .03, .012)); gr.traverse((m) => m.castShadow = false); root.add(gr); list.push(gr); }
    return { root, list }; }
  // Nies-Wölkchen
  function makePuff() { const root = new T.Group(); const list = []; const m = M(0xffffff, { roughness: 1, transparent: true, opacity: .85 }); for (let i = 0; i < 6; i++) { const s = sph(m, 0, 0, 0, .04); s.castShadow = false; root.add(s); list.push(s); } return { root, list }; }
  // Vitamin-C-Balken (Studio)
  function tileTex(word, col, fs) { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = col; c.beginPath(); c.roundRect(0, 0, w, h, 60); c.fill(); c.fillStyle = "#fff"; c.font = `900 ${fs || 92}px "Montserrat"`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(word, w / 2, h / 2 + 4); }); }
  function tile(word, col, fs) { const grp = new T.Group(); grp.add(mesh(BOX, M(new T.Color(col).multiplyScalar(.7).getHex(), { roughness: .4 }), 0, 0, -.06, 1.6, .8, .12));
    const f = new T.Mesh(new T.PlaneGeometry(1.6, .8), new T.MeshStandardMaterial({ map: tileTex(word, col, fs), roughness: .4 })); f.position.z = .001; grp.add(f); grp.traverse((m) => { m.castShadow = false; }); return grp; }
  function makeBars() { const root = new T.Group(); const orange = M(0xff9f1c, { roughness: .35, emissive: 0x552a00, emissiveIntensity: .4 }), glass = M(0xffffff, { roughness: .1, transparent: true, opacity: .22 });
    const mk = (x) => { const g2 = new T.Group(); g2.position.set(x, 0, -.25); root.add(g2); g2.add(mesh(CYL, glass, 0, .6, 0, .16, 1.2, .16)); const fill = mesh(CYL, orange, 0, 0, 0, .14, 1, .14); g2.add(fill); return { g2, fill }; };
    const a = mk(-.55), b = mk(.55);
    const ta = tile("MAKES IT", "#36b37e", 78); ta.scale.setScalar(.4); ta.position.set(-.55, 1.45, -.25); root.add(ta);
    const tb = tile("CAN'T", "#e5484d", 120); tb.scale.setScalar(.4); tb.position.set(.55, 1.45, -.25); root.add(tb);
    root.traverse((m) => m.castShadow = false);
    return { root, a, b, ta, tb }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bun = actor(makeBunny(), "Kaninchen"); bun2 = actor(makeBunny(0xe9e2d6), "Kaninchen 2"); bigBun = actor(makeBunny(), "Kaninchen gross");
    gp = actor(makeGp(), "Meerschwein"); gp2 = actor(makeGp(), "Meerschwein 2"); bigGp = actor(makeGp(), "Meerschwein gross");
    hutch = actor(makeHutch(), "Stall"); bigHutch = actor(makeHutch({ roof: 0x7a5cff }), "Grosser Stall"); run = actor(makeRun(-1.1, 1.1, -.7, .7, .45), "Auslauf");
    gift = actor(makeGift(), "Geschenk"); stars = actor(makeStars(), "Sterne"); germs = actor(makeGerms(7), "Keime"); puff = actor(makePuff(), "Nieser"); bars = actor(makeBars(), "Vitamin C");
    ref = makeRef(rudi);
    for (const a of [hutch, bigHutch, run, gift, stars, germs, puff, bars]) a.noCheck = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { rudi.noCheck = false; ref.wh.visible = ref.cardM.visible = false;
    for (const b of [bun, bun2, bigBun, gp, gp2, bigGp]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = false; }
    bigHutch.root.scale.setScalar(1); gift.lid.position.set(0, .3, 0); gift.lid.rotation.set(0, 0, 0); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function headPos(B, dx) { B.root.updateMatrixWorld(true); return B.head.localToWorld(V(dx || 0, .12, 0)); }
  function spin(x, y, z, p, t, r) { stars.root.visible = p > 0; r = r || .14; stars.list.forEach((s, i) => { const a = t * 5 + i * PI / 2; s.position.set(x + Math.cos(a) * r, y + .03 * Math.sin(t * 7 + i), z + Math.sin(a) * r); s.rotation.set(0, a, 0); s.scale.setScalar(.04 * easeBack(clamp(p, 0, 1)) + .001); }); }
  function sneezePuff(G, p, sc) { puff.root.visible = p > 0 && p < 1; if (!puff.root.visible) return; G.root.updateMatrixWorld(true); const n = G.head.localToWorld(V(.16, -.01, 0)), fw = G.head.localToWorld(V(.6, -.01, 0)).sub(n).normalize();
    puff.list.forEach((s, i) => { const d = p * (.12 + i * .05) * (sc || 1); s.position.set(n.x + fw.x * d + Math.sin(i * 2.1) * .03 * p, n.y + Math.cos(i * 1.7) * .03 * p + p * .02, n.z + fw.z * d + Math.cos(i * 2.7) * .03 * p); s.scale.setScalar(.04 * (.4 + p * 1.2) * (sc || 1) * (1 - p * .5)); }); }

  // ---------- Shots ----------
  // 0 Hook: Kaninchen und Meerschweinchen nebeneinander auf dem Rasen, Kaninchen trommelt, Meerschweinchen zittert und quiekt
  KZ.shot("gHook", (lt, d, t) => { inYard(); const ph = lt / d;
    at(bun, -.3, 0, 0, .35); poseBunny(bun, t, { thump: ph > .35, angry: ph > .35, look: -.2 });
    at(gp, .38, 0, .12, PI - .35); poseGp(gp, t, { shake: true, wide: true, wheek: ph > .35 && Math.sin(t * 7) > 0 });
    frameOn([bun, gp], { az: lerp(.3, .22, ph), el: .1, fill: lerp(.9, .98, ph), t }); draw();
    if (ph > .4) stamp("BAD ROOMMATES", W * .42, H * .64, (ph - .4) * d / .3, "#e5484d", -.06); });
  // 1 Rudi + einsames Kaninchen; Schnitt: Geschenkkarton springt auf, Meerschweinchen guckt raus
  KZ.shot("gLonely", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .45;
    at(bun, -.25, 0, .25, .3); place(rudi, -1.3, .1, -.5);
    if (!half) { poseBunny(bun, t, { ears: .55, lid: .5, sad: true, nod: -.12 }); poseRudi(rudi, t, { arms: [.15, .9], spread: .1, mouth: "smile", tilt: -.08 });
      frameOn([bun, rudi], { az: lerp(.55, .48, ph / .45), el: .12, fill: .95, t }); draw();
      stamp("LONELY", W * .42, H * .17, (lt - .2) / .3, "#7a5cff", -.06); }
    else { const k = (ph - .45) / .55, op = sm(clamp(k / .25, 0, 1));
      poseBunny(bun, t, { look: -.3, wide: true, ears: .1 }); poseRudi(rudi, t, { arms: [2.4 + Math.sin(t * 8) * .1, .4 + Math.sin(t * 6) * .1], spread: .15, mouth: "o", wide: true });
      rudi.root.visible = false; place(gift, .62, .3, .3); gift.lid.position.set(op * .15, .3 + op * .5, op * .05); gift.lid.rotation.set(op * .3, 0, -op * 1.3);
      at(gp, .62, .14 + sm(clamp((k - .1) / .3, 0, 1)) * .15, .3, PI + .2); poseGp(gp, t, { wide: true, wheek: k > .4 && Math.sin(t * 8) > 0, look: .2 }); gp.noCheck = true;
      frameOn([bun, gift, FR(-.8, 0, .1, .8, 1.0, .5)], { az: lerp(.42, .36, k), el: .14, fill: lerp(.95, 1.02, k), t }); draw();
      stamp("NEW FRIEND!", W * .42, H * .17, k * d * .55 / .3, "#ff9f1c", .06); } });
  // 2 Großer Stall: Rudi präsentiert; Schnitt: Kaninchen flitzt (Zoomies) und kickt das Meerschweinchen durch die Luft
  KZ.shot("gBig", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .48, S = 1.45; const SIT = (FLOOR + .03) * S;
    place(bigHutch, 0, 0, 0); bigHutch.root.scale.setScalar(S);
    if (!half) { const k = sm(ph / .48); place(rudi, -1.75, .6, -.5); poseRudi(rudi, t, { arms: [1.3 + Math.sin(t * 4) * .1, 1.3 - Math.sin(t * 4) * .1], spread: .3, mouth: "smile" });
      at(bun, -.45, SIT, 0, 0); bun.noCheck = true; poseBunny(bun, t, { angry: true });
      at(gp, .3, SIT, .05, PI); gp.noCheck = true; poseGp(gp, t, { shake: true, wide: true });
      frameOn([bigHutch, rudi], { az: lerp(.5, .44, k), el: .12, fill: lerp(1.0, 1.06, k), t }); draw();
      stamp("BIGGER!", W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", -.06); }
    else { const k = (ph - .48) / .52;
      // Kaninchen sprintet von links heran, schlägt bei k ~.35 mit den Hinterbeinen aus
      const bx = lerp(-.7, -.5, sm(clamp(k / .3, 0, 1))), hop = k < .3 ? Math.abs(Math.sin(t * 11)) : 0, kick = k > .3 && k < .6 ? 1 : 0;
      at(bun, bx + (k > .3 ? .15 : 0), SIT + hop * .08, 0, k > .3 ? PI : 0); bun.noCheck = true; poseBunny(bun, t, { hop, kick, ears: .2 });
      const fly = clamp((k - .33) / .35, 0, 1), gx = lerp(.25, .62, sm(fly)), gy = SIT + Math.sin(fly * PI) * .3;
      at(gp, gx, gy, .05, PI); gp.noCheck = true; gp.root.rotation.z = -fly * 2 * PI; poseGp(gp, t, { wide: true, wheek: fly > 0 && fly < 1 });
      if (fly >= 1) { const hp = headPos(gp); spin(hp.x, hp.y + .1, hp.z, (k - .68) * 6, t, .12); }
      frameOn([FR(-.85, SIT - .05, -.4, .82, SIT + .75, .4)], { az: lerp(.25, .18, k), el: .08, fill: lerp(.95, 1.0, k), t }); draw();
      if (k > .32) stamp("BOOT!", W * .42, H * .17, (k - .32) * d * .52 / .3, "#e5484d", .07); } });
  // 3 Rudi als Schiedsrichter (Pfeife + rote Karte) zwischen den beiden; Schnitt: Meerschweinchen niest groß
  KZ.shot("gRef", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .5;
    if (!half) { const k = sm(ph / .5); place(rudi, -.2, -.35, -.25); ref.wh.visible = true; ref.cardM.visible = ph > .15;
      poseRudi(rudi, t, { arms: [ph > .15 ? 2.75 : .5, .15], spread: .12, mouth: "o", wide: true });
      at(bun, -.55, 0, .55, .9); poseBunny(bun, t, { angry: true, look: -.2 }); at(gp, .75, 0, .45, PI - .6); poseGp(gp, t, { wide: true, shake: true });
      frameOn([rudi, bun, gp], { az: lerp(.35, .28, k), el: .12, fill: lerp(.92, .98, k), t }); draw();
      stamp("REFEREE", W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06); }
    else { const k = (ph - .5) / .5, sn = clamp(k / .75, 0, 1);
      at(gp, 0, 0, 0, .25); poseGp(gp, t, { sneeze: sn, sc: 1 }); sneezePuff(gp, clamp((sn - .62) / .38, 0, 1), 1);
      frameOn([gp], { az: lerp(.5, .42, k), el: .1, fill: lerp(.88, .95, k), t }); draw();
      if (sn > .6) stamp("ACHOO!", W * .42, H * .17, (sn - .6) * d * .5 * .75 / .3, "#ff9f1c", .07); } });
  // 4 Studio: Kaninchen trommelt ("THUMP"), Meerschweinchen quiekt ("WHEEK!"), Fragezeichen dazwischen
  KZ.shot("gLang", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bigBun, -.72, 0, 0, .25); poseBunny(bigBun, t, { thump: ph < .6, sc: 1.25, angry: true });
    at(bigGp, .4, 0, .05, PI - .25); poseGp(bigGp, t, { wheek: ph > .3 && Math.sin(t * 7) > 0, sc: 1.6, wide: true });
    frameOn([bigBun, bigGp], { az: lerp(.1, .03, k), el: .12, fill: lerp(.86, .9, k), dy: -.12, t }); draw();
    stamp("THUMP", W * .27, H * .2, (lt - .15) / .3, "#7a5cff", -.08);
    stamp("WHEEK!", W * .6, H * .28, (ph - .3) * d / .3, "#ff5d8f", .08);
    if (ph > .6) txt("???", W * .42, H * .36, 110, "#ffd23f", { stroke: 12, a: clamp((ph - .6) * 6, 0, 1) }); });
  // 5 Studio: großes Kaninchen schlägt aus, Meerschweinchen rutscht weg + RSPCA-Zitat
  KZ.shot("gKick", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    const kk = ph > .15 && ph < .5 ? 1 : 0; at(bigBun, -.55, 0, 0, PI); bigBun.noCheck = true; poseBunny(bigBun, t, { kick: kk, sc: 1.4, ears: .25 });
    const sl = sm(clamp((ph - .2) / .3, 0, 1)); at(bigGp, lerp(.15, .55, sl), 0, .05, PI - .3); poseGp(bigGp, t, { wide: true, shake: sl > .9, sc: 1.4 }); bigGp.root.rotation.z = -Math.sin(sl * PI) * .4;
    if (sl > .95) { const hp = headPos(bigGp); spin(hp.x, hp.y + .14, hp.z, (ph - .5) * 5, t, .16); }
    frameOn([FR(-1.15, 0, -.4, 1.05, .9, .4)], { az: lerp(.25, .18, k), el: .12, fill: .9, dy: -.2, t }); draw();
    if (ph > .2) stamp("STRONG LEGS", W * .42, H * .17, (ph - .2) * d / .3, "#e5484d", -.06);
    const cp = sm((lt - d * .42) / .3); if (card(W * .42, H * .63, 900, 210, cp, "RSPCA", "#2f6fd0")) {
      txt("“Rabbits may injure guinea pigs, either", W * .42, H * .63 + 6, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("intentionally or unintentionally.”", W * .42, H * .63 + 52, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 6 Studio: Keime schweben vom Kaninchen (Träger, unbeeindruckt) zum Meerschweinchen, das niest + RSPCA-Zitat Bordetella
  KZ.shot("gGerm", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bigBun, -.7, 0, 0, .3); poseBunny(bigBun, t, { sc: 1.25, lid: .3 }); at(bigGp, .4, 0, .05, PI - .3);
    const sn = clamp((ph - .35) / .4, 0, 1); poseGp(bigGp, t, { sneeze: sn, sc: 1.6, sad: true }); sneezePuff(bigGp, clamp((sn - .62) / .38, 0, 1), 1.6);
    germs.root.visible = true; const hb = headPos(bigBun, .1), hg = headPos(bigGp, .1);
    germs.list.forEach((gm, i) => { const u = clamp((ph * 1.6 - i * .09), 0, 1), e = sm(u); gm.position.set(lerp(hb.x, hg.x, e) + Math.sin(t * 2 + i) * .06, lerp(hb.y + .1, hg.y + .05, e) + Math.sin(u * PI) * .35 + Math.cos(t * 3 + i * 2) * .04, lerp(hb.z, hg.z, e) + Math.cos(i * 2.3) * .12);
      gm.rotation.set(t * .8 + i, t * 1.1, i); gm.scale.setScalar(u > 0 ? 1.3 : .001); });
    frameOn([bigBun, bigGp], { az: lerp(.12, .05, k), el: .12, fill: lerp(.86, .9, k), dy: -.12, t }); draw();
    stamp("GERMS", W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .38) / .3); if (card(W * .42, H * .63, 920, 250, cp, "RSPCA", "#2f6fd0")) {
      txt("“Bordetella bronchiseptica is the most", W * .42, H * .63 + 2, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("common cause of respiratory disease", W * .42, H * .63 + 46, 34, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("in guinea pigs.”", W * .42, H * .63 + 90, 34, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 7 Studio-Infografik: Vitamin-C-Röhren: Kaninchen füllt sich selbst (MAKES IT), Meerschweinchen bleibt leer (CAN'T)
  KZ.shot("gVitC", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(bars, 0, 0, 0); const fa = sm(clamp((ph - .08) / .45, 0, 1)), fb = .001; bars.b.fill.visible = false;
    bars.a.fill.visible = fa > .02; bars.a.fill.scale.set(.14, fa * 1.15 + .001, .14); bars.a.fill.position.y = fa * 1.15 / 2; bars.b.fill.scale.set(.14, fb, .14); bars.b.fill.position.y = fb / 2;
    const ta = sm(clamp((ph - .3) / .2, 0, 1)), tb = sm(clamp((ph - .5) / .2, 0, 1)); bars.ta.scale.setScalar(.4 * easeBack(ta) + .001); bars.tb.scale.setScalar(.4 * easeBack(tb) + .001);
    at(bigBun, -.8, 0, .5, .5); poseBunny(bigBun, t, { sc: .9, look: .1 }); at(bigGp, .62, 0, .5, PI - .5); poseGp(bigGp, t, { sc: 1.15, sad: tb > .5, lid: tb > .5 ? .4 : undefined });
    frameOn([bars, bigBun, bigGp], { az: lerp(.06, 0, k), el: .12, fill: lerp(.84, .88, k), dy: -.05, t }); draw();
    txt("VITAMIN C", W * .42, H * .2, 72, "#ffffff", { stroke: 10, a: clamp(lt / .3, 0, 1) });
    const cp = sm((lt - d * .6) / .3); if (card(W * .42, H * .64, 760, 110, cp)) txt("Source: RSPCA · RWAF", W * .42, H * .64, 34, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 8 Pointe: Rudi mit Pfeife kratzt sich am Kopf, die zwei sitzen weit auseinander und ignorieren ihn
  KZ.shot("gOver", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(rudi, -.2, -.35, -.25); ref.wh.visible = true; poseRudi(rudi, t, { arms: [2.75, .2], spread: .1, mouth: "smile", tilt: -.12 });
    at(bun, -.7, 0, .55, PI + .6); poseBunny(bun, t, { lid: .5, sad: true }); at(gp, .8, 0, .5, .4); poseGp(gp, t, { lid: .5 });
    frameOn([rudi, bun, gp], { az: lerp(.35, .3, k), el: .12, fill: lerp(.95, 1.0, k), t }); draw();
    if (ph > .3) stamp("OVERKILL", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", .06); });
  // 9 Tipp: zwei Kaninchen kuscheln im Auslauf links, zwei Meerschweinchen im eigenen Gehege rechts
  KZ.shot("gTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph), half = ph > .5;
    if (!half) { place(run, 0, 0, 0); at(bun, -.55, 0, -.05, .2); poseBunny(bun, t, { lid: .3, nod: Math.sin(t * 2) * .05 }); at(bun2, .5, 0, .15, PI - .3); poseBunny(bun2, t, { lid: .3, look: .1 });
      bun.noCheck = bun2.noCheck = true;
      frameOn([FR(-.95, 0, -.5, .95, .7, .5)], { az: lerp(.4, .32, k), el: .22, fill: lerp(.95, 1.02, k), t }); draw();
      stamp("BUNNY + BUNNY", W * .42, H * .17, (lt - .2) / .3, "#2f6fd0", -.06); }
    else { place(run, 0, 0, 0); run.root.scale.setScalar(.75); const r = Math.max(0, Math.sin(t * 3));
      at(gp, -.48, 0, -.05, -.5); poseGp(gp, t, { run: 0, wheek: r > .7, sc: 1.1 }); at(gp2, .5, 0, .15, -PI + .5); poseGp(gp2, t, { sc: 1.1, wheek: r < .2 });
      gp.noCheck = gp2.noCheck = true;
      frameOn([FR(-.7, 0, -.4, .7, .45, .4)], { az: lerp(.4, .32, k), el: .42, fill: lerp(.95, 1.02, k), t }); draw(); run.root.scale.setScalar(1);
      stamp("PIG + PIG", W * .42, H * .17, (ph - .5) * d / .3, "#ff9f1c", .06); } });
  // 10 Loop: zurück zur Hook-Einstellung
  KZ.shot("gLoop", (lt, d, t) => { inYard(); const ph = lt / d;
    at(bun, -.3, 0, 0, .35); poseBunny(bun, t, { look: -.2 });
    at(gp, .38, 0, .12, PI - .35); poseGp(gp, t, { shake: ph > .6, wide: ph > .6 });
    frameOn([bun, gp], { az: lerp(.4, .3, ph), el: .1, fill: lerp(.86, .92, ph), t }); draw();
    if (ph > .3) stamp("ROOMMATES?", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__gp3d = true;
})();
