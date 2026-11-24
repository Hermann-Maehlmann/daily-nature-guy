// 3D-Szene "Why Your Guinea Pig Gets A Pirate Disease" / "Warum dein Meerschweinchen Piraten-Krankheit kriegt" (24.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Opener-Stil "piratenfilm": Kapitänslogbuch, Matrose Krümel (Meerschweinchen mit Dreispitz) hat Skorbut.
// Meerschweinchen neu gebaut (Grundform wie 20.11., jetzt mit K3.eye-Augen + aimEyes, struppiges Fell als Skorbut-Zeichen, Dreispitz),
// neu: Holzfass, Logbuch, Futtersack mit Datum, Napf, Wassernapf mit Brausetablette, Paprika.
// Quellen: NRC "Nutrient Requirements of Laboratory Animals" (NCBI NBK231932): "Approximately one-half of the initial ascorbic acid may be oxidized and lost 90 days after the diet has been mixed."
// VCA Hospitals: replace pellets within 90 days of manufacture. Merck Vet Manual: guinea pigs, like humans, can't make vitamin C. PetMD: water additives last as little as 8 hours.
// NC State Veterinary Hospital: "One to two tablespoons of pepper per day should be adequate for most guinea pigs."
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let gp, rudi, run, barrel, book, bag, bowl, wbowl, pepper, rHat;
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  const QUIZ = () => [L("A  You", "A  Du"), L("B  Your dog", "B  Dein Hund"), L("C  Your cat", "C  Deine Katze")];

  // ---------- Dreispitz (Piratenhut), schwarz mit weißem Totenkopf-Abzeichen ----------
  function makeTricorn(r) { const grp = new T.Group(); const blk = M(0x24212b, { roughness: .7 }), gold = M(0xf2c14e, { metalness: .6, roughness: .35 });
    grp.add(mesh(new T.SphereGeometry(r * .78, 32, 16, 0, 2 * PI, 0, PI / 2), blk, 0, 0, 0, 1, .85, 1));
    for (let i = 0; i < 3; i++) { const a = i / 3 * 2 * PI; const side = new T.Group(); side.rotation.y = a; grp.add(side);
      const w = mesh(BOX, blk, r * .82, r * .18, 0, r * .12, r * .55, r * 1.25); w.rotation.z = .35; side.add(w);
      const tr = mesh(BOX, gold, r * .9, r * .44, 0, r * .05, r * .05, r * 1.2); tr.rotation.z = .35; tr.castShadow = false; side.add(tr); }
    const skull = canvasTex(128, 128, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = "#ffffff"; c.beginPath(); c.arc(w / 2, h * .42, w * .26, 0, 7); c.fill(); c.fillRect(w * .36, h * .55, w * .28, h * .18);
      c.fillStyle = "#24212b"; c.beginPath(); c.arc(w * .4, h * .42, 8, 0, 7); c.arc(w * .6, h * .42, 8, 0, 7); c.fill(); c.strokeStyle = "#ffffff"; c.lineWidth = 9; c.lineCap = "round";
      c.beginPath(); c.moveTo(w * .2, h * .78); c.lineTo(w * .8, h * .95); c.moveTo(w * .8, h * .78); c.lineTo(w * .2, h * .95); c.stroke(); });
    const badge = new T.Mesh(new T.PlaneGeometry(r * .55, r * .55), new T.MeshBasicMaterial({ map: skull, transparent: true })); badge.position.set(r * 1.0, r * .42, 0); badge.rotation.set(0, PI / 2, .35); grp.add(badge);
    return grp; }

  // ---------- Meerschweinchen (rundlich, kein Schwanz, kurze Beine, kleine Hängeohren, Blesse) ----------
  function makeGp() {
    const A = 0xe8923a, B = 0xfbf4ea, D = 0x4a3122;
    const org = M(A, { roughness: .85 }), wht = M(B, { roughness: .9 }), drk = M(D, { roughness: .85 }), pink = M(0xf3a0a6, { roughness: .6 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(wht, -.02, .13, 0, .22, .125, .145));
    body.add(sph(org, .05, .145, 0, .15, .12, .15));
    body.add(sph(drk, -.14, .15, 0, .1, .11, .148));
    body.add(sph(org, -.07, .22, 0, .09, .05, .1));
    const feet = []; for (const [x, s] of [[.1, -1], [.1, 1], [-.12, -1], [-.12, 1]]) { const f = sph(pink, x, .018, s * .08, .035, .018, .03); body.add(f); feet.push(f); }
    const head = new T.Group(); head.position.set(.17, .15, 0); body.add(head);
    head.add(sph(org, 0, 0, 0, .12, .108, .112));
    head.add(sph(wht, .06, .03, 0, .075, .07, .035));
    head.add(sph(wht, .095, -.025, 0, .055, .055, .07));
    const nose = sph(pink, .145, -.008, 0, .018, .014, .022); head.add(nose);
    const mo = mesh(new T.TorusGeometry(.013, .004, 6, 12, PI), M(0x6a3a30), .145, -.05, 0); mo.rotation.set(0, PI / 2, PI); head.add(mo);
    const oMouth = sph(M(0x5a1a22), .145, -.055, 0, .012, .02, .018); head.add(oMouth);
    const eyeM = M(0x120a08, { roughness: .08 });
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.058, .032, s * .08); e.rotation.y = -s * .75; head.add(e);
      const ey = K3.eye(.036, { white: M(0x3a2014, { roughness: .15 }), pupil: eyeM }); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, M(0x5a3420, { roughness: .6 }), .07, .085, s * .07, .012, .012, .05); b.castShadow = false; head.add(b); brows.push(b); }
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.03, .075, s * .085); head.add(e);
      const ear = sph(M(new T.Color(A).multiplyScalar(.85).getHex(), { roughness: .8 }), 0, .012, s * .012, .04, .028, .016); ear.rotation.x = s * .6; e.add(ear); ears.push(e); }
    const wh = M(0xffffff, { roughness: .4 }); for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { const w = mesh(CYL, wh, .11, -.03 + i * .02, s * .07, .003, .11, .003); w.rotation.x = s * (PI / 2 - .2 + i * .25); w.castShadow = false; head.add(w); }
    // struppiges Fell (Skorbut-Zeichen)
    const spikes = new T.Group(); body.add(spikes); for (let i = 0; i < 18; i++) { const sp = mesh(new T.ConeGeometry(.016, .05, 6), i % 3 ? org : drk, -.21 + i * .023, .25 - Math.abs(i - 8.5) * .004 + Math.sin(i * 1.7) * .01, Math.sin(i * 2.3) * .08);
      sp.rotation.set(Math.sin(i * 3.1) * .5, 0, -.3 + Math.sin(i * 1.3) * .6); sp.castShadow = false; spikes.add(sp); }
    const hat = makeTricorn(.1); hat.position.set(-.01, .1, 0); hat.rotation.z = -.12; head.add(hat);
    return { root, body, head, eyes, brows, ears, nose, mo, oMouth, feet, spikes, hat };
  }
  // o: {sick (0..1 struppig + schlapp), hat, chew, wheek, look, nod, sc, run, hop, worry, lookAt}
  function poseGp(G, t, o) {
    o = o || {}; const sick = o.sick || 0;
    G.head.rotation.set(0, o.look || 0, (o.nod || 0) - sick * .14 + Math.sin(t * 2.1) * .03 + (o.chew ? Math.sin(t * 16) * .03 : 0));
    G.nose.scale.set(.018, .014 * (1 + Math.sin(t * 18) * .2), .022);
    const w = !!o.wheek || (o.chew && Math.sin(t * 16) > 0); G.oMouth.visible = w; G.mo.visible = !w;
    G.ears.forEach((e, i) => { e.rotation.z = Math.sin(t * 3 + i) * .08 - sick * .25; });
    G.brows.forEach((b, i) => { b.visible = !!o.worry || sick > .3; b.rotation.x = (i ? 1 : -1) * .45; });
    const r = o.run || 0; G.feet.forEach((f, i) => { f.position.y = .018 + Math.max(0, Math.sin(t * 20 + i * 1.7)) * .03 * r; });
    const hop = o.hop || 0;
    G.body.position.set(sick ? Math.sin(t * 2.5) * .01 * sick : 0, Math.sin(t * 2.4) * .004 + r * Math.abs(Math.sin(t * 20)) * .015 + hop * .22, 0);
    G.body.rotation.set(sick * Math.sin(t * 2.5) * .06, 0, hop * .25 * Math.sin(t * 9));
    G.body.scale.set(1, 1 - sick * .05, 1);
    G.spikes.visible = sick > .2; G.spikes.scale.setScalar(.6 + sick * .5);
    G.hat.visible = !!o.hat;
    G.root.scale.setScalar(o.sc || 1);
    G.root.updateMatrixWorld(true); K3.aimEyes(G.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .5);
  }
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }

  // ---------- Kulissen ----------
  function wireTex() { return canvasTex(256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = "#d8dde3"; c.lineWidth = 5; for (let i = 0; i <= w; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } }); }
  function wirePlane(w, h, rep) { const tx = wireTex(); tx.wrapS = tx.wrapT = T.RepeatWrapping; tx.repeat.set(rep * w, rep * h);
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: tx, transparent: true, alphaTest: .4, side: T.DoubleSide, metalness: .5, roughness: .4 })); m.castShadow = false; return m; }
  function makeRun(X0, X1, Z0, Z1, HH) { const root = new T.Group(); const post = M(0x8a5a33, { roughness: .7 });
    { const st = mesh(new T.PlaneGeometry(X1 - X0, Z1 - Z0), M(0xe8d27a, { roughness: 1 }), (X0 + X1) / 2, .006, (Z0 + Z1) / 2); st.rotation.x = -PI / 2; st.castShadow = false; root.add(st); }
    for (const [x, z] of [[X0, Z0], [X1, Z0], [X0, Z1], [X1, Z1]]) root.add(mesh(BOX, post, x, HH / 2, z, .05, HH, .05));
    const side = (x, z, w, ry) => { const p = wirePlane(w, HH, 5); p.position.set(x, HH / 2, z); p.rotation.y = ry; root.add(p); const rail = mesh(BOX, post, x, HH, z, w, .035, .035); rail.rotation.y = ry; root.add(rail); };
    side((X0 + X1) / 2, Z0, X1 - X0, 0); side(X1, (Z0 + Z1) / 2, Z1 - Z0, PI / 2); side(X0, (Z0 + Z1) / 2, Z1 - Z0, PI / 2); // vorne offen (Kamera)
    return { root }; }
  function makeBarrel() { const root = new T.Group(); const wd = M(0xa8743f, { roughness: .7 }), ring = M(0x4a4a52, { metalness: .6, roughness: .35 });
    root.add(mesh(new T.CylinderGeometry(.13, .13, .34, 24), wd, 0, .17, 0, 1, 1, 1)); root.add(sph(wd, 0, .17, 0, .16, .14, .16));
    for (const y of [.05, .17, .29]) { const r = mesh(new T.TorusGeometry(y === .17 ? .16 : .135, .012, 8, 32), ring, 0, y, 0); r.rotation.x = PI / 2; root.add(r); }
    root.add(mesh(new T.CylinderGeometry(.12, .12, .01, 24), M(0x8a5a33, { roughness: .7 }), 0, .345, 0));
    return { root }; }
  // offenes Logbuch (2 Seiten mit Pergament)
  function makeBook() { const root = new T.Group(); const cov = M(0x7a3a1c, { roughness: .7 });
    const pg = canvasTex(256, 192, (c, w, h) => { c.fillStyle = "#f6e7c1"; c.fillRect(0, 0, w, h); c.strokeStyle = "#b08a4a"; c.lineWidth = 3; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(20, 40 + i * 22); c.lineTo(w - 20 - (i % 3) * 30, 40 + i * 22); c.stroke(); } });
    for (const s of [-1, 1]) { const p = new T.Group(); p.rotation.x = s * .22; root.add(p);
      p.add(mesh(BOX, cov, 0, 0, s * .13, .22, .012, .26)); const sh = new T.Mesh(new T.PlaneGeometry(.2, .24), new T.MeshStandardMaterial({ map: pg, roughness: .9 })); sh.rotation.x = -PI / 2; sh.position.set(0, .008, s * .13); p.add(sh); }
    return { root }; }
  // Futtersack mit Datum
  function makeBag() { const root = new T.Group(); const pap = M(0xd8b57a, { roughness: .9 });
    root.add(mesh(BOX, pap, 0, .3, 0, .36, .6, .2)); root.add(mesh(BOX, M(0xc29a5c, { roughness: .9 }), 0, .63, 0, .3, .08, .17));
    const lab = canvasTex(256, 320, (c, w, h) => { c.fillStyle = "#2f9e6f"; c.fillRect(0, 0, w, h); c.fillStyle = "#ffffff"; c.font = '900 46px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(L("PELLETS", "FUTTER"), w / 2, 60); c.fillStyle = "#ffd23f"; c.beginPath(); c.roundRect(24, 120, w - 48, 120, 18); c.fill(); c.fillStyle = "#1d2250"; c.font = '900 30px "Montserrat"';
      c.fillText(L("OPENED", "OFFEN SEIT"), w / 2, 155); c.font = '900 52px "Montserrat"'; c.fillText(L("JULY", "JULI"), w / 2, 205);
      c.fillStyle = "#e8923a"; c.beginPath(); c.arc(w / 2, 285, 22, 0, 7); c.fill(); });
    const lp = new T.Mesh(new T.PlaneGeometry(.32, .4), new T.MeshStandardMaterial({ map: lab, roughness: .8 })); lp.position.set(0, .3, .101); root.add(lp);
    return { root }; }
  function makeBowl(col) { const root = new T.Group(); const cer = M(col, { roughness: .35 });
    root.add(mesh(new T.CylinderGeometry(.13, .1, .06, 28), cer, 0, .03, 0)); const rim = mesh(new T.TorusGeometry(.12, .015, 8, 32), cer, 0, .06, 0); rim.rotation.x = PI / 2; root.add(rim);
    const fill = mesh(new T.CylinderGeometry(.11, .11, .01, 28), M(0x8a6a3a, { roughness: .9 }), 0, .052, 0); root.add(fill);
    const pel = new T.Group(); root.add(pel); for (let i = 0; i < 14; i++) { const a = i * 2.4, r = (i % 4) * .025; pel.add(sph(M(0x9a7a42, { roughness: .9 }), Math.cos(a) * r, .065, Math.sin(a) * r, .018, .012, .012)); }
    return { root, fill, pel }; }
  function makeWater() { const b = makeBowl(0x2f6fd0); b.pel.visible = false; b.fill.material = new T.MeshStandardMaterial({ color: new T.Color(0x7fd0ff).convertSRGBToLinear(), roughness: .1, metalness: .2, transparent: true, opacity: .85 });
    b.tab = mesh(new T.CylinderGeometry(.035, .035, .012, 20), M(0xffffff, { roughness: .5 }), 0, .2, 0); b.root.add(b.tab); return b; }
  // rote Paprika (4 Wülste + grüner Stiel)
  function makePepper() { const root = new T.Group(); const red = M(0xe5262b, { roughness: .3 }), grn = M(0x2f9e3f, { roughness: .5 });
    for (let i = 0; i < 4; i++) { const a = i / 4 * 2 * PI; root.add(sph(red, Math.cos(a) * .035, .09, Math.sin(a) * .035, .065, .09, .065)); }
    root.add(mesh(new T.CylinderGeometry(.03, .04, .03, 16), grn, 0, .18, 0)); root.add(mesh(new T.CylinderGeometry(.01, .012, .06, 10), grn, .01, .21, 0));
    return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; gp = actor(makeGp(), "Meerschwein");
    run = actor(makeRun(-.85, .85, -.55, .55, .32), "Gehege"); barrel = actor(makeBarrel(), "Fass"); book = actor(makeBook(), "Logbuch"); bag = actor(makeBag(), "Futtersack");
    bowl = actor(makeBowl(0xff6f61), "Napf"); wbowl = actor(makeWater(), "Wassernapf"); pepper = actor(makePepper(), "Paprika");
    for (const a of [run, barrel, book, bag, bowl, wbowl, pepper]) a.noCheck = true;
    rHat = makeTricorn(.36); rHat.position.set(0, .2, 0); rudi.head.add(rHat); rHat.visible = false;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
  });
  function reset() { rudi.noCheck = false; rHat.visible = false; for (const b of [gp, bag, book, pepper, wbowl]) { b.root.rotation.set(0, 0, 0); b.root.scale.setScalar(1); } wbowl.tab.position.set(0, .2, 0); wbowl.tab.visible = true; pepper.root.scale.setScalar(1); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  function pirate(t, o) { poseRudi(rudi, t, o); rudi.hat.visible = false; rHat.visible = true; }
  const gpFrame = (r) => { gp.root.updateMatrixWorld(true); const p = gp.root.position, s = gp.root.scale.x; r = (r || .3) * s; return FR(p.x - r, p.y, p.z - r * .8, p.x + r, p.y + r * 1.25, p.z + r * .8); };
  const handW = (i) => { rudi.root.updateMatrixWorld(true); return rudi.arms[i].localToWorld(V(0, -.62, 0)); };

  // 2D-Helfer
  function bubbles(t, x, y, a, n) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < (n || 10); i++) { const q = (t * 1.3 + i / (n || 10)) % 1; g.globalAlpha = a * Math.sin(q * PI);
      g.strokeStyle = "#ffffff"; g.lineWidth = 5; g.beginPath(); g.arc(x + Math.sin(i * 2.1 + t * 3) * 50, y - q * 150, 8 + (i % 3) * 5, 0, 7); g.stroke(); } g.restore(); }
  function clockTxt(x, y, a, s) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "#ffffff"; g.beginPath(); g.arc(x, y, 62, 0, 7); g.fill(); g.strokeStyle = "#1d2250"; g.lineWidth = 8; g.stroke();
    const an = -PI / 2 + t0clock * 2 * PI; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * 44, y + Math.sin(an) * 44); g.stroke(); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 30); g.stroke();
    g.fillStyle = "#e5484d"; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); g.restore(); txt(s, x, y + 110, 52, "#ffffff", { stroke: 9, a, w: 900 }); }
  let t0clock = 0;
  function pellets(t, x0, y0, x1, y1, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 14; i++) { const q = (t * 1.6 + i / 14) % 1; g.globalAlpha = a;
      g.fillStyle = i % 2 ? "#9a7a42" : "#b8955a"; g.beginPath(); g.ellipse(lerp(x0, x1, q) + Math.sin(i * 3) * 14, lerp(y0, y1, q) + q * q * 30, 9, 6, i, 0, 7); g.fill(); } g.restore(); }
  // Pergament-Banner (Logbuch-Titel)
  function scroll(x, y, p, l1, l2) { if (p <= 0) return; const k = easeBack(clamp(p, 0, 1)), w = 640 * k, h = 190; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = "#f6e7c1"; g.strokeStyle = "#7a3a1c"; g.lineWidth = 8; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, 16); g.fill(); g.stroke();
    g.fillStyle = "#c9a25e"; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(x + s * w / 2, y, 22, h / 2 + 8, 0, 0, 7); g.fill(); g.stroke(); } g.restore();
    if (k > .7) { txt(l1, x, y - 38, 44, "#7a3a1c", { w: 900, a: clamp((k - .7) * 4, 0, 1) }); txt(l2, x, y + 34, 58, "#1d2250", { w: 900, a: clamp((k - .7) * 4, 0, 1) }); } }

  // ---------- Shots ----------
  const RUNF = () => FR(-.7, 0, -.4, .7, .5, .4);
  // 0 Hook: Krümel mit Dreispitz, struppig und wackelig neben dem Fass, Kamera fährt sofort ran, Stempel SKORBUT?! ab Bild 1
  function hookScene(lt, d, t, ph, stampP) { inYard(); place(run, 0, 0, 0); place(barrel, .32, -.18, 0); place(bowl, -.45, .15, 0);
    at(gp, -.08, 0, .08, .35); poseGp(gp, t, { sick: 1, hat: true, sc: 1.3, worry: true });
    frameOn([gpFrame(.42), barrel], { az: lerp(.32, .2, ph), el: lerp(.36, .28, ph), fill: lerp(1.15, 1.35, sm(ph)), dy: -.03, t }); draw();
    stamp(L("SCURVY?!", "SKORBUT?!"), W * .42, H * .62, stampP, "#e5484d", -.07); }
  KZ.shot("pHook", (lt, d, t) => { const ph = lt / d; hookScene(lt, d, t, ph, .45 + lt / .3); });
  // 1 Logbuch: Rudi als Kapitän (Dreispitz) mit offenem Logbuch, Krümel krank daneben; Pergament-Banner "LOGBUCH · TAG 90"
  KZ.shot("pLog", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); place(run, 0, 0, 0); place(barrel, .32, -.18, 0);
    place(rudi, -1.25, .15, -.1); pirate(t, { arms: [.95, .95], spread: -.05, mouth: ph > .55 ? "o" : "smile", nod: -.12 });
    const h0 = handW(0), h1 = handW(1); place(book, 0, 0, 0); book.root.position.set((h0.x + h1.x) / 2 + .04, (h0.y + h1.y) / 2 + .03, (h0.z + h1.z) / 2); book.root.rotation.set(0, 0, 1.15); book.root.scale.setScalar(1.5);
    at(gp, -.1, 0, .15, .4); poseGp(gp, t, { sick: 1, hat: true, sc: 1.8, worry: true, lookAt: rudi.head.localToWorld(V(0, 0, 0)) });
    frameOn([rudi, gp], { az: lerp(.55, .47, k), el: .14, fill: lerp(.8, .85, k), t }); draw();
    scroll(W * .44, H * .19, lt / .35, L("CAPTAIN'S LOG", "LOGBUCH"), L("DAY 90", "TAG 90")); });
  // 2 Rudi kippt Futter aus dem Juli-Sack in den Napf, Krümel guckt traurig, Stempel SEIT JULI!
  KZ.shot("pBag", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); place(run, 0, 0, 0);
    place(rudi, -1.15, .3, 0); poseRudi(rudi, t, { arms: [.3, lerp(1.1, 1.6, sm(clamp(ph * 2, 0, 1)))], spread: .05, mouth: "smile", lean: -.08 });
    const hp = handW(1); place(bag, 0, 0, 0); bag.root.position.set(hp.x - .02, hp.y - .38, hp.z + .05); bag.root.rotation.set(0, PI / 2, -lerp(.2, 1.3, sm(clamp(ph * 2, 0, 1)))); bag.root.scale.setScalar(.75);
    place(bowl, -.5, .3, 0); at(gp, .15, 0, .3, PI - .2); poseGp(gp, t, { sick: .8, sc: 1.8, worry: true, lookAt: bowl.root.position.clone().add(V(0, .1, 0)) });
    frameOn([rudi, gp], { az: lerp(.4, .34, k), el: .14, fill: lerp(.8, .86, k), t }); draw();
    bag.root.updateMatrixWorld(true); const [x0, y0] = scr(bag.root.localToWorld(V(0, .66, 0))); const [x1, y1] = scr(bowl.root.localToWorld(V(0, .06, 0))); if (ph > .3) pellets(t, x0, y0, x1, y1, clamp((ph - .3) * 5, 0, 1));
    stamp(L("SINCE JULY!", "SEIT JULI!"), W * .45, H * .17, (ph - .35) * d / .3, "#ff8a1f", -.06); });
  // 3 Rate-Frage: Studio, Krümel auf dem Sockel, Kacheln Du / Hund / Katze
  KZ.shot("pQuiz", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(gp, 0, 0, 0, .45); poseGp(gp, t, { sick: .6, sc: 1.6, look: Math.sin(t * 1.6) * .3, worry: true });
    frameOn([gpFrame(.4)], { az: lerp(.5, .38, k), el: .16, fill: lerp(.55, .6, k), dy: -.62, t }); draw();
    txt("?", W * .64, H * .16 + Math.sin(t * 3) * 8, 150, "#ffd23f", { stroke: 14, w: 900, a: clamp(lt / .3, 0, 1) });
    quizTiles(W * .42, H * .57, QUIZ(), clamp((lt - .5) / .9, 0, 1), {}); });
  // 4 Rudi wirft Brausetablette in den Wassernapf (VITAMIN-WASSER!) – Schnitt: Napf, Uhr +8 STD, Krümel schnüffelt, Stempel WEG!
  KZ.shot("pWater", (lt, d, t) => { inYard(); const ph = lt / d; place(run, 0, 0, 0);
    if (ph < .5) { const k = ph / .5; place(rudi, -1.1, .25, 0); poseRudi(rudi, t, { arms: [.3, lerp(1.0, 1.3, k)], spread: .05, mouth: "smile", lean: -.1 });
      const hp = handW(1); place(wbowl, -.5, .25, 0); const drop = sm(clamp((k - .25) / .5, 0, 1)); wbowl.tab.position.set(0, lerp(.2, .05, drop), 0);
      wbowl.tab.position.add(wbowl.root.worldToLocal(hp.clone()).sub(V(0, .2, 0)).multiplyScalar(1 - drop)); wbowl.tab.visible = k < .85;
      at(gp, .15, 0, .2, PI - .5); poseGp(gp, t, { sick: .8, sc: 1.7, lookAt: V(-.5, .1, .25) });
      frameOn([rudi, gp], { az: lerp(.42, .36, k), el: .16, fill: lerp(.8, .85, k), t }); draw();
      if (k > .7) { const [bx, by] = scr(wbowl.root.localToWorld(V(0, .06, 0))); bubbles(t, bx, by, 1, 12); }
      stamp(L("VITAMIN WATER!", "VITAMINWASSER!"), W * .44, H * .17, (lt - .25) / .3, "#2f9bff", -.06); }
    else { const k = (ph - .5) / .5; place(wbowl, -.3, .1, 0); wbowl.tab.visible = false;
      at(gp, .05, 0, .12, PI + .15); poseGp(gp, t, { sick: .9, sc: 1.2, worry: true, look: Math.sin(t * 5) * .15, lookAt: V(-.3, .05, .1) });
      frameOn([wbowl, gpFrame(.36)], { az: lerp(.35, .28, k), el: .32, fill: lerp(.9, 1.0, k), dy: -.05, t }); draw();
      t0clock = k * 3; clockTxt(W * .24, H * .21, clamp(k * 4, 0, 1), L("+8 HRS", "+8 STD"));
      stamp(L("GONE!", "WEG!"), W * .58, H * .2, (k * d * .5 - .35) / .25, "#e5484d", .07); } });
  // 5 Auflösung: Studio, Rudi + Krümel, Kacheln A grün, dann Stempel WIE DU!
  KZ.shot("pReveal", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    if (ph < .5) { at(gp, 0, 0, 0, .45); poseGp(gp, t, { sc: 1.6, sick: .4, hop: Math.abs(Math.sin(lt * 7)) * .5 });
      frameOn([gpFrame(.4)], { az: lerp(.38, .3, k), el: .16, fill: lerp(.6, .64, k), dy: -.62, t }); draw();
      quizTiles(W * .42, H * .57, QUIZ(), 1, { reveal: sm(clamp((lt - .1) / .4, 0, 1)), correct: 0 }); }
    else { place(rudi, -.6, -.15, -1.0); poseRudi(rudi, t, { arms: [.2, 1.5 + Math.sin(t * 5) * .08], spread: .1, mouth: "o", wide: true });
      at(gp, .6, 0, .3, -.7); poseGp(gp, t, { sc: 1.7, sick: .4, lookAt: rudi.head.localToWorld(V(0, 0, 0)) });
      frameOn([rudi, gp], { az: lerp(.5, .44, k), el: .14, fill: lerp(.9, .95, k), t }); draw();
      stamp(L("LIKE YOU!", "WIE DU!"), W * .42, H * .17, (ph - .5) * d / .3, "#36b37e", -.06);
      txt(L("Source: Merck Vet Manual", "Quelle: Merck Vet Manual"), W * .42, H * .245, 34, "#ffffff", { stroke: 8, a: clamp((ph - .55) * 6, 0, 1) }); } });
  // 6 Infografik: Vitamin-C-Balken im Sack sinkt von 100 % auf 50 %, Tageszähler 0 -> 90, Quellenkarte NRC
  KZ.shot("pDays", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(bag, -.2, 0, 0); bag.root.rotation.y = .35; at(gp, .38, 0, .2, -.3); poseGp(gp, t, { sick: .7, sc: 1.6, worry: true, lookAt: V(-.2, .4, 0) });
    frameOn([bag, gpFrame(.35)], { az: lerp(.3, .22, k), el: .14, fill: lerp(.72, .78, k), dy: -.05, t }); draw();
    const q = sm(clamp((ph - .08) / .55, 0, 1)), day = Math.round(q * 90), v = 1 - .5 * q, a = clamp(lt / .3, 0, 1);
    const bx = W * .42, by = H * .155, bw = 640;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.roundRect(bx - bw / 2, by - 42, bw, 84, 42); g.fill();
    g.fillStyle = v > .7 ? "#36b37e" : "#ffb800"; g.beginPath(); g.roundRect(bx - bw / 2 + 10, by - 32, (bw - 20) * v, 64, 32); g.fill(); g.restore();
    txt(Math.round(v * 100) + " %", bx, by, 44, "#1d2250", { a, w: 900 });
    txt(L("VITAMIN C · DAY ", "VITAMIN C · TAG ") + day, bx, by - 85, 44, "#ffffff", { stroke: 9, a, w: 900 });
    if (ph > .62) stamp("−50 %", W * .64, H * .25, (ph - .62) * d / .25, "#e5484d", .08);
    infoCard(W * .42, H * .585, 900, 200, sm((ph - .35) * d / .35), L("US National Research Council", "US National Research Council"), "#2f6fd0",
      [L("\"one-half ... may be lost", "„die Hälfte ... kann verloren"), L("90 days after mixing\"", "sein, 90 Tage nach Mischung“")], 36); });
  // 7 Tipp: Rudi (ohne Hut) legt Paprika hin – Schnitt: Krümel mampft, gesund, Popcorn-Hüpfer, Stempel PAPRIKA ✓
  KZ.shot("pTip", (lt, d, t) => { inYard(); const ph = lt / d; place(run, 0, 0, 0); place(barrel, .32, -.18, 0);
    if (ph < .4) { const k = ph / .4; place(rudi, -1.1, .25, 0); poseRudi(rudi, t, { arms: [.3, lerp(.9, 1.25, k)], spread: .05, mouth: "smile", lean: -.12 });
      const hp = handW(1); place(pepper, 0, 0, 0); pepper.root.position.set(hp.x + .05, hp.y - .12, hp.z);
      at(gp, .15, 0, .25, PI - .3); poseGp(gp, t, { sc: 1.7, sick: .3, look: .1, lookAt: hp });
      frameOn([rudi, gp], { az: lerp(.42, .36, k), el: .14, fill: lerp(.92, .98, k), t }); draw(); }
    else { const k = (ph - .4) / .6; place(pepper, -.26, .34, 0); pepper.root.scale.setScalar(lerp(1.3, .85, k));
      const hop = k > .55 ? Math.abs(Math.sin((k - .55) * 14)) : 0;
      at(gp, .1, 0, .12, -2.6); poseGp(gp, t, { sc: 1.25, chew: hop < .1, hop, lookAt: K3.camera.position });
      frameOn([gpFrame(.4), pepper], { az: lerp(.3, .24, k), el: .26, fill: lerp(.95, 1.05, k), dy: -.02, t }); draw();
      stamp(L("PEPPER ✓", "PAPRIKA ✓"), W * .44, H * .17, (k * d * .6 - .1) / .3, "#36b37e", -.05); }
    txt(L("Source: NC State Vet Hospital", "Quelle: NC State Tierklinik"), W * .42, H * .655, 34, "#ffffff", { stroke: 8, a: clamp((ph - .45) * 6, 0, 1) }); });
  // 8 Loop: dieselbe Einstellung wie der Hook (Krümel mit Dreispitz am Fass), Stempel kommt spät
  KZ.shot("pLoop", (lt, d, t) => { const ph = lt / d; hookScene(lt, d, t, (1 - ph) * .15, (ph - .55) * d / .3); });

  window.__gpVitC = true;
})();
