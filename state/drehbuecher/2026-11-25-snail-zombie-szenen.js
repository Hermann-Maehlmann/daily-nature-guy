// 3D-Szene "Why Does This Snail Want To Get Eaten?" / "Warum will diese Schnecke gefressen werden?" (25.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Safari/Expedition-Format (Themen-Mix, exotisch): Rudi auf Expedition im Sumpf hält die pulsierenden Fühler für zwei tanzende Raupen.
// Opener-Stil "kinotrailer": "Demnächst im Kino: Zombie-Schnecke. Nach einer wahren Geschichte." (Nacht, roter Filmtitel, Blitz).
// Figuren: Bernsteinschnecke (Succinea putris: bernsteinfarbenes, längliches, dünnes Gehäuse mit kleinem Gewinde, heller gelbgrauer Körper,
// zwei lange Augenfühler mit Auge an der Spitze, zwei kurze untere Fühler), Fühler mit Brutschlauch von Leucochloridium paradoxum
// (dick geschwollen, grün-weiß-dunkelgrün gestreift, pulsiert ca. 1x pro Sekunde), Amsel (schwarz, orangegelber Schnabel, gelber Augenring),
// Schilfhalm mit Blatt, Rudi mit Lupe, Regenschirm, Steinhöhle, Vogelkot mit Eiern (Infografik Kreislauf).
// Quellen: Wesołowska & Wesołowski 2014, Journal of Zoology 292:151-155 (Białowieża): infizierte Schnecken "positioned themselves in more exposed and
// better illuminated places, situated higher in the vegetation"; BBC Wildlife / Discover Wildlife 2026 (Nick Baker): "up to 250 of these larvae in each broodsac",
// "up to 80 pulses per minute"; Wikipedia/Live Science: Pulsieren 40-80/min, ahmt Raupe nach, Vogel frisst Brutschlauch, Eier im Vogelkot, Schnecke frisst Kot;
// Vorkommen Europa inkl. Deutschland (Hohorst 1937 Frankfurt; A-Z Animals).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const QUIZ = () => ["3", "30", L("Up to 250", "Bis zu 250")];
  let snail, bird, plant, rudi, marsh, umb, lupe, cave, poop, skyTex, nightTex, bandTex;
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  const PULSE = 1.15; // Pulse pro Sekunde (~70/min)

  // ---------- Sumpfwiese ----------
  function makeMarsh() { const root = new T.Group();
    const gt = canvasTex(512, 512, (c, w, h) => { c.fillStyle = "#7cb653"; c.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { c.globalAlpha = .2; c.fillStyle = i % 2 ? "#5e9a3f" : "#a3d070"; c.beginPath(); c.arc((i * 137) % w, (i * 241) % h, 3 + (i % 7), 0, 7); c.fill(); } });
    gt.wrapS = gt.wrapT = T.RepeatWrapping; gt.repeat.set(10, 10);
    const ground = new T.Mesh(new T.CircleGeometry(40, 64), M(0xffffff, { map: gt, roughness: .95 })); ground.rotation.x = -PI / 2; ground.receiveShadow = true; root.add(ground);
    const pond = new T.Mesh(new T.CircleGeometry(1, 48), M(0x4aa3d8, { roughness: .15, metalness: .2 })); pond.rotation.x = -PI / 2; pond.scale.set(3.2, 1.6, 1); pond.position.set(3.2, .01, -4.5); root.add(pond);
    const reed = M(0x6f9a3a, { roughness: .8 }), cat = M(0x7a4a26, { roughness: .8 });
    let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 70; i++) { const x = -9 + rnd() * 18, z = -3.2 - rnd() * 5, h = 1.4 + rnd() * 1.4; if (x > .8 && x < 5.5 && z > -6 && z < -3.2) continue;
      const r = mesh(CYL, reed, x, h / 2, z, .03, h, .03); r.rotation.z = (rnd() - .5) * .15; root.add(r); if (i % 3 === 0) root.add(mesh(CYL, cat, x, h + .12, z, .06, .3, .06)); }
    for (const [x, z, r] of [[-4.5, -2.6, .8], [-5.6, -1.2, .6], [5.3, -2.2, .7], [6, -1, .5]]) root.add(sph(M(0x5aa647), x, r * .55, z, r, r * .75, r));
    for (let i = 0; i < 18; i++) { const a = i * 2.1, rr = 2.6 + (i % 5) * .6; const x = Math.cos(a) * rr, z = Math.sin(a) * rr - 1.5; if (z > -.5 && Math.abs(x) < 2.2) continue; root.add(sph(M([0xffffff, 0xffd23f, 0xb08cff][i % 3]), x, .08, z, .08)); }
    return { root }; }

  // ---------- Schilfhalm mit Blatt (Sitzplatz der Schnecke) ----------
  const LEAF_Y = 1.05;
  function makePlant() { const root = new T.Group(), st = M(0x4f8f34, { roughness: .7 }), lf = M(0x67b04a, { roughness: .6 });
    root.add(mesh(CYL, st, 0, 1.15, 0, .04, 2.3, .04));
    const leaf = sph(lf, .38, LEAF_Y - .02, 0, .55, .03, .22); leaf.rotation.z = .06; root.add(leaf);
    const leaf2 = sph(lf, -.25, .55, .05, .32, .02, .1); leaf2.rotation.z = -.3; root.add(leaf2);
    root.add(sph(M(0x8a5a2e), 0, 2.35, 0, .07, .16, .07));
    return { root }; }

  // ---------- Bernsteinschnecke mit Brutschlauch-Fühlern ----------
  function makeSnail() {
    const skin = M(0xd9cfa6, { roughness: .55 }), skinD = M(0xb8ab80, { roughness: .6 });
    const shell = M(0xd8902f, { roughness: .32 }), shellD = M(0xa8621c, { roughness: .35 }), shellL = M(0xf2c070, { roughness: .3 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    // Fuß und Hals
    body.add(sph(skin, 0, .055, 0, .36, .06, .11));
    body.add(sph(skinD, -.05, .03, 0, .34, .035, .12));
    const neck = new T.Group(); neck.position.set(.24, .07, 0); body.add(neck);
    neck.add(sph(skin, .04, .05, 0, .1, .085, .085));
    const head = new T.Group(); head.position.set(.11, .1, 0); neck.add(head);
    head.add(sph(skin, 0, 0, 0, .085, .075, .08));
    // Mund + kleine untere Fühler
    const smile = mesh(new T.TorusGeometry(.025, .006, 6, 14, PI), M(0x5a3a20), .078, -.035, 0); smile.rotation.set(0, PI / 2, PI); head.add(smile);
    for (const s of [-1, 1]) { const lt = mesh(CYL, skinD, .07, -.01, s * .045, .012, .07, .012); lt.rotation.set(s * .5, 0, -1.1); head.add(lt); }
    // Gehäuse: großer letzter Umgang, kleines spitzes Gewinde (bernsteinfarben, glänzend)
    const sh = new T.Group(); sh.position.set(-.08, .17, 0); sh.rotation.z = .35; body.add(sh);
    sh.add(sph(shell, 0, 0, 0, .21, .14, .13));
    sh.add(sph(shellL, .05, .05, .06, .1, .06, .05));
    sh.add(sph(shell, -.17, .07, 0, .11, .085, .085));
    sh.add(sph(shellD, -.26, .11, 0, .06, .05, .05));
    sh.add(sph(shellD, -.31, .13, 0, .03, .028, .028));
    const ring = mesh(new T.TorusGeometry(.13, .012, 8, 32), shellD, -.1, .04, 0); ring.rotation.y = PI / 2; ring.scale.set(1, .75, 1); sh.add(ring);
    // Augenfühler: dick, gestreift, pulsierend (Brutschlauch), Auge an der Spitze
    const bandM = M(0xffffff, { map: bandTex, roughness: .45 });
    const tents = [], eyes = [];
    for (const s of [-1, 1]) { const tg = new T.Group(); tg.position.set(.03, .05, s * .045); tg.rotation.set(s * .28, 0, -.38); head.add(tg);
      const sac = new T.Group(); tg.add(sac);
      sac.add(mesh(CYL, bandM, 0, .15, 0, .05, .26, .05)); sac.add(sph(bandM, 0, .02, 0, .05)); sac.add(sph(skin, 0, .285, 0, .045, .04, .045));
      const e = new T.Group(); e.position.set(.03, .3, 0); e.rotation.z = .38; tg.add(e); const ey = K3.eye(.042); e.add(ey); e.userData.ey = ey; eyes.push(e);
      tents.push({ tg, sac, s }); }
    return { root, body, neck, head, tents, eyes, smile, sh };
  }
  // o: {crawl, lookAt, sc, wob}
  function poseSnail(S, t, o) { o = o || {};
    const p = Math.sin(t * PI * 2 * PULSE); bandTex.offset.y = -t * PULSE * .5;
    S.tents.forEach((q, i) => { const k = 1 + .14 * Math.max(0, p) + .05 * Math.sin(t * 9 + i); q.sac.scale.set(k, 1 + .06 * p, k); q.tg.rotation.z = -.38 + Math.sin(t * 2.4 + i * 1.7) * .14 * (o.wob ?? 1); q.tg.rotation.x = q.s * (.28 + Math.sin(t * 1.9 + i) * .08 * (o.wob ?? 1)); });
    const cr = o.crawl || 0; S.body.scale.x = 1 + Math.sin(t * 5) * .04 * cr; S.neck.rotation.z = Math.sin(t * 1.3) * .06 + (o.up || 0);
    S.root.scale.setScalar(o.sc || 1.35);
    if (K3.aimEyes) { S.root.updateMatrixWorld(true); K3.aimEyes(S.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .55); } }

  // ---------- Amsel ----------
  function makeBird() { const blk = M(0x1d1c22, { roughness: .6 }), blk2 = M(0x2c2b33, { roughness: .6 }), beak = M(0xffa21f, { roughness: .4 }), ringM = M(0xffc62e, { roughness: .4 });
    const root = new T.Group(), body = new T.Group(); body.position.y = .32; root.add(body);
    body.add(sph(blk, 0, 0, 0, .26, .2, .18));
    const head = new T.Group(); head.position.set(.22, .14, 0); body.add(head); head.add(sph(blk, 0, 0, 0, .13, .12, .12));
    const bk = new T.Group(); bk.position.set(.12, -.01, 0); head.add(bk);
    const cone = new T.ConeGeometry(1, 1, 16); cone.rotateZ(-PI / 2); cone.translate(.5, 0, 0);
    const up = mesh(cone, beak, 0, .012, 0, .16, .035, .04), lo = mesh(cone, beak, 0, -.012, 0, .13, .025, .035); bk.add(up); bk.add(lo);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.06, .04, s * .085); e.rotation.y = -s * .9; head.add(e);
      const rg = mesh(new T.TorusGeometry(.04, .011, 8, 20), ringM, 0, 0, 0); rg.rotation.y = PI / 2; rg.position.x = .012; e.add(rg); const ey = K3.eye(.036); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const tail = new T.Group(); tail.position.set(-.24, .02, 0); body.add(tail); tail.add(sph(blk2, -.15, .02, 0, .2, .03, .07));
    const wings = []; for (const s of [-1, 1]) { const w = new T.Group(); w.position.set(.02, .06, s * .14); body.add(w); const f = sph(blk2, -.08, 0, s * .1, .2, .03, .14); w.add(f); wings.push({ w, s }); }
    const legs = []; for (const s of [-1, 1]) { const l = limb(.012, .14, M(0x6a4a2a)); l.position.set(.02, -.16, s * .06); body.add(l); legs.push(l); }
    return { root, body, head, lo, eyes, wings, tail, legs }; }
  function poseBird(B, t, o) { o = o || {}; const fl = o.fly || 0;
    B.wings.forEach((q) => { q.w.rotation.x = q.s * (fl ? .9 * Math.sin(t * 22) : .1); });
    B.legs.forEach((l) => l.visible = !fl || o.legs); B.body.rotation.z = (o.pitch || 0) + Math.sin(t * 3) * .03;
    B.lo.rotation.z = -(o.open || 0); B.head.rotation.z = Math.sin(t * 4) * .05 + (o.headDown || 0);
    if (K3.aimEyes) { B.root.updateMatrixWorld(true); K3.aimEyes(B.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .6); } }

  // ---------- Requisiten ----------
  function makeUmbrella() { const root = new T.Group(); const red = M(0xe23b3b, { roughness: .6 }), wht = M(0xffffff, { roughness: .6 });
    root.add(mesh(CYL, M(0x6a4a2a), 0, -.95, 0, .025, 1.9, .025));
    for (let i = 0; i < 8; i++) { const seg = mesh(new T.SphereGeometry(.62, 12, 8, i * PI / 4, PI / 4, 0, PI / 2.4), i % 2 ? red : wht, 0, 0, 0, 1, .55, 1); root.add(seg); }
    return { root }; }
  function makeLupe() { const root = new T.Group();
    root.add(mesh(CYL, M(0x7a4a26), 0, -.13, 0, .025, .22, .025));
    const rim = mesh(new T.TorusGeometry(.11, .018, 10, 32), M(0xd9a441, { metalness: .8, roughness: .3 }), 0, .1, 0); root.add(rim);
    root.add(mesh(new T.CircleGeometry(.1, 24), M(0xcfefff, { transparent: true, opacity: .3, roughness: .05 }), 0, .1, 0));
    return { root }; }
  function makeCave() { const root = new T.Group(); const st = M(0x9a9aa6, { roughness: .9 }), st2 = M(0x80808c, { roughness: .9 });
    root.add(mesh(new T.SphereGeometry(.55, 32, 16, -PI * .3, PI * 1.6, 0, PI / 2), st, 0, 0, 0, 1, .95, 1));
    for (let i = 0; i < 9; i++) { const a = -PI * .3 + i * PI * 1.6 / 8; root.add(sph(i % 2 ? st2 : st, Math.cos(a) * .55, .08, -Math.sin(a) * .55, .13, .1, .12)); }
    return { root }; }
  function makePoop() { const root = new T.Group(); const br = M(0x7a5030, { roughness: .7 }), wh = M(0xf4efe2, { roughness: .6 }), egg = M(0xe8d27a, { roughness: .4 });
    root.add(sph(wh, 0, .05, 0, .26, .06, .22)); root.add(sph(br, 0, .1, 0, .17, .08, .15)); root.add(sph(br, 0, .18, 0, .11, .06, .1)); root.add(sph(br, 0, .24, 0, .05, .05, .05));
    for (let i = 0; i < 7; i++) { const a = i * .9; root.add(sph(egg, Math.cos(a) * .15, .12 + (i % 3) * .04, Math.sin(a) * .13, .025, .018, .018)); }
    return { root }; }

  K3.onBuild(() => {
    bandTex = canvasTex(64, 256, (c, w, h) => { const cols = ["#2f9a3e", "#f4f8dc", "#1d5a28", "#f4f8dc", "#7bd04a", "#f4f8dc"]; const n = 12; for (let i = 0; i < n; i++) { c.fillStyle = cols[i % cols.length]; c.fillRect(0, i * h / n, w, h / n + 1); }
      c.fillStyle = "rgba(255,120,60,.8)"; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(w * .3 + (i % 2) * w * .4, i * h / 6 + 10, 4, 0, 7); c.fill(); } });
    bandTex.wrapS = bandTex.wrapT = T.RepeatWrapping; bandTex.repeat.set(1, 1.4);
    rudi = K3.rudi; marsh = actor(makeMarsh(), "Sumpf"); plant = actor(makePlant(), "Halm"); snail = actor(makeSnail(), "Schnecke"); bird = actor(makeBird(), "Amsel");
    umb = actor(makeUmbrella(), "Schirm"); lupe = actor(makeLupe(), "Lupe"); cave = actor(makeCave(), "Höhle"); poop = actor(makePoop(), "Kot");
    for (const a of [marsh, plant, umb, lupe, cave, poop]) { a.noCheck = true; a.noEyeCheck = true; }
    marsh.noBlob = true; plant.noBlob = true; umb.noBlob = true; lupe.noBlob = true; bird.noBlob = true; snail.noBlob = true;
    skyTex = canvasTex(64, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#58b2ff"); gr.addColorStop(.55, "#a9dcff"); gr.addColorStop(1, "#fff0c8"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    nightTex = canvasTex(64, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#10102a"); gr.addColorStop(.6, "#2a1a3e"); gr.addColorStop(1, "#4a1f2a"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  });
  function inMarsh(night) { begin("yard"); K3.yard.visible = false; marsh.root.visible = true; K3.scene.background = night ? nightTex : skyTex;
    K3.scene.fog = night ? new T.Fog(0x1a1030, 8, 26) : new T.Fog(0xd6ecff, 14, 40); K3.hemi.intensity = night ? .35 : .75;
    rudi.root.rotation.set(0, 0, 0); rudi.body.position.set(0, 0, 0); }
  function inStudio() { begin("studio"); }
  // Schnecke auf dem Blatt des Halms (Halm bei x,z)
  function onLeaf(px, pz, t, o) { plant.root.visible = true; plant.root.position.set(px, 0, pz); plant.root.rotation.set(0, o && o.prY || 0, 0);
    snail.root.visible = true; snail.root.position.set(px + .28, LEAF_Y + .03, pz); snail.root.rotation.set(0, (o && o.ry) || 0, 0); poseSnail(snail, t, o); }
  function birdAt(x, y, z, ry, t, o) { bird.root.visible = true; bird.root.position.set(x, y, z); bird.root.rotation.set(0, ry || 0, 0); poseBird(bird, t, o); }
  function notes(x, y, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.font = '900 70px "Montserrat"'; g.textAlign = "center"; g.lineWidth = 8; g.strokeStyle = "#fff";
    for (let i = 0; i < 2; i++) { const yy = y - ((KZ.t * 90 + i * 70) % 140), xx = x + (i ? 70 : -60) + Math.sin(KZ.t * 4 + i) * 12; g.strokeText(i ? "♫" : "♪", xx, yy); g.fillStyle = "#7a3cff"; g.fillText(i ? "♫" : "♪", xx, yy); } g.restore(); }
  function sunGlow(x, y, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter"; const r = 360, gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(255,236,150,${.7 * a})`); gr.addColorStop(1, "rgba(255,220,120,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.restore(); }
  function arrow(x0, y0, x1, y1, bend, p, col) { if (p <= 0) return; p = Math.min(p, 1); const mx = (x0 + x1) / 2 - (y1 - y0) * bend, my = (y0 + y1) / 2 + (x1 - x0) * bend;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = col; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); const N = 30; let px = x0, py = y0; g.moveTo(x0, y0);
    for (let i = 1; i <= N * p; i++) { const u = i / N; px = (1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * mx + u * u * x1; py = (1 - u) * (1 - u) * y0 + 2 * u * (1 - u) * my + u * u * y1; g.lineTo(px, py); } g.stroke();
    if (p > .95) { const u = .93, qx = (1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * mx + u * u * x1, qy = (1 - u) * (1 - u) * y0 + 2 * u * (1 - u) * my + u * u * y1, an = Math.atan2(py - qy, px - qx);
      g.fillStyle = col; g.beginPath(); g.moveTo(px + Math.cos(an) * 30, py + Math.sin(an) * 30); g.lineTo(px + Math.cos(an + 2.4) * 30, py + Math.sin(an + 2.4) * 30); g.lineTo(px + Math.cos(an - 2.4) * 30, py + Math.sin(an - 2.4) * 30); g.fill(); }
    g.restore(); }

  // ---------- Shots ----------
  // Hook: Schnecke groß auf dem Blatt, Fühler pulsieren, Amsel stürzt von oben links herab, schneller Zoom, Stempel FRISS MICH! ab Bild 1
  function hookFrame(t, ph) { inMarsh(false); onLeaf(0, 0, t, { ry: -.25, wob: 1.4 });
    const k = 1 - Math.pow(1 - clamp(ph, 0, 1), 3);
    birdAt(lerp(-.5, -.22, k), LEAF_Y + lerp(.9, .58, k), lerp(.25, .15, k), -.5, t, { fly: 1, pitch: -.45, open: .35, lookAt: snail.head.getWorldPosition(V(0, 0, 0)) });
    bird.root.scale.setScalar(.75); bird.noCheck = true;
    frameOn([snail], { az: lerp(.62, .5, k), el: lerp(.22, .12, k), fill: lerp(.74, .93, k), dy: .08, t }); draw(); }
  KZ.shot("sHook", (lt, d, t) => { hookFrame(t, lt / 1.6);
    stamp(L("EAT ME!", "FRISS MICH!"), W * .44, H * .6, (lt + .18) / .25, "#e5484d", -.07); });
  // 1 Kinotrailer: Nacht, Schnecke im Lichtkegel, Blitz, roter Filmtitel
  KZ.shot("sTrailer", (lt, d, t) => { const ph = lt / d, k = sm(ph); inMarsh(true); onLeaf(0, 0, t, { ry: -.5, wob: 1.6 });
    frameOn([snail], { az: lerp(-.1, .2, k), el: lerp(.02, .12, k), fill: lerp(.66, .78, k), dy: .1, t }); draw();
    const fl = (lt > .25 && lt < .38) || (lt > .5 && lt < .56) ? 1 : 0; g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    if (fl) { g.fillStyle = "rgba(220,230,255,.45)"; g.fillRect(0, 0, W, H); }
    const a = clamp((lt - .1) / .3, 0, 1); g.globalAlpha = a; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = '900 34px "Montserrat"'; g.fillStyle = "#ffd6d6"; g.fillText(L("COMING SOON", "DEMNÄCHST IM KINO"), W * .44, H * .12);
    const sz = 112 + (1 - a) * 40; g.font = `900 ${sz}px "Montserrat"`; g.lineWidth = 14; g.strokeStyle = "#2a0006"; g.shadowColor = "#ff2030"; g.shadowBlur = 30;
    const tt = L("ZOMBIE", "ZOMBIE-"), t2 = L("SNAIL", "SCHNECKE"); g.font = `900 ${Math.min(sz, 116)}px "Montserrat"`;
    g.strokeText(tt, W * .44, H * .2); g.fillStyle = "#e5232f"; g.fillText(tt, W * .44, H * .2);
    g.font = `900 ${Math.min(sz, 104)}px "Montserrat"`; g.strokeText(t2, W * .44, H * .27); g.fillText(t2, W * .44, H * .27); g.shadowBlur = 0;
    const b = clamp((ph - .5) * d / .3, 0, 1); g.globalAlpha = b; g.font = '800 34px "Montserrat"'; g.fillStyle = "#ffffff";
    g.fillText(L("BASED ON A TRUE STORY", "NACH EINER WAHREN GESCHICHTE"), W * .44, H * .62); g.restore(); });
  // 2 Rudi mit Lupe am Halm: "zwei tanzende Raupen", Noten, Stempel RAUPEN?
  KZ.shot("sRudi", (lt, d, t) => { const ph = lt / d, k = sm(ph); inMarsh(false);
    onLeaf(.55, 0, t, { ry: PI - .2, wob: 1.8, lookAt: rudi.head.getWorldPosition(V(0, 0, 0)) });
    place(rudi, -.75, .25, -.15); poseRudi(rudi, t, { arms: [.2, 1.55], spread: .08, mouth: ph < .5 ? "o" : "smile", wide: true, lean: -.12, nod: -.1 });
    rudi.root.updateMatrixWorld(true); lupe.root.visible = true; lupe.root.position.copy(rudi.arms[1].localToWorld(V(0, -.72, 0))); lupe.root.rotation.set(0, PI / 2 - .2, 0);
    frameOn([rudi, plant, snail], { az: lerp(.55, .42, k), el: .1, fill: lerp(.84, .92, k), dy: -.1, t }); draw();
    snail.root.updateMatrixWorld(true); const [nx, ny] = scr(snail.head.localToWorld(V(0, .35, 0))); notes(Math.min(nx, 800), ny, clamp(lt / .3, 0, 1));
    stamp(L("CATERPILLARS?", "RAUPEN?"), W * .42, H * .17, (lt - .3) / .25, "#7a3cff", -.06); });
  // 3 Rate-Frage: Nahaufnahme der Fühler, Kacheln
  KZ.shot("sQuiz", (lt, d, t) => { const ph = lt / d, k = sm(ph); inMarsh(false); onLeaf(0, 0, t, { ry: -.2 });
    frameOn([snail], { az: lerp(.25, .45, k), el: .15, fill: lerp(.55, .62, k), dy: -.32, t }); draw();
    txt(L("BABIES IN ONE EYE STALK?", "BABYS IN EINEM FÜHLER?"), W * .42, H * .18, 50, "#ffd23f", { stroke: 12, a: clamp(lt / .3, 0, 1) });
    quizTiles(W * .42, H * .575, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 4 Schirm: Rudi hält den Schirm über das Blatt, Schnecke kriecht den Halm hoch zurück ins Licht
  KZ.shot("sShade", (lt, d, t) => { const ph = lt / d, k = sm(ph); inMarsh(false);
    plant.root.visible = true; plant.root.position.set(.5, 0, 0); plant.root.rotation.set(0, 0, 0);
    const c = sm(clamp((ph - .35) / .55, 0, 1)); snail.root.visible = true;
    { const u = sm(clamp((c - .08) / .3, 0, 1)), v = clamp((c - .38) / .62, 0, 1);
      snail.root.position.set(lerp(lerp(.85, .7, clamp(c / .08, 0, 1)), .54, u), lerp(LEAF_Y + .03, LEAF_Y + .1, u) + v * (1.7 - LEAF_Y - .1), 0); snail.root.rotation.set(0, PI, u * PI / 2); }
    poseSnail(snail, t, { crawl: c > 0 && c < 1 ? 1 : 0, lookAt: K3.camera.position });
    place(rudi, -.6, .4, -.1); poseRudi(rudi, t, { arms: [.15, 1.2], spread: .05, mouth: c > .6 ? "o" : "smile", nod: c > .6 ? .15 : 0 });
    rudi.root.updateMatrixWorld(true); const hp = rudi.arms[1].localToWorld(V(0, -.66, 0)); umb.root.visible = true; umb.root.position.set(1.3, 1.9, -.25); umb.root.rotation.set(0, 0, .12);
    frameOn([rudi, plant], { az: lerp(.5, .4, k), el: .12, fill: lerp(.82, .9, k), dy: 0, t }); draw();
    snail.root.updateMatrixWorld(true); const [sx, sy] = scr(V(.55, 2.6, 0)); sunGlow(Math.min(sx, 820), sy - 120, .5 + .5 * c);
    stamp(L("SHADE!", "SCHATTEN!"), W * .42, H * .17, (lt - .15) / .25, "#2f6fd0", -.06);
    stamp(L("BACK TO THE SUN", "ZURÜCK INS LICHT"), W * .42, H * .25, (ph - .7) * d / .25, "#e5484d", .05); });
  // 5 Höhle: Rudi baut eine Steinhöhle, Schnitt: Schnecke sitzt auf dem Dach, Amsel landet, Rudi greift sich an den Kopf
  KZ.shot("sCave", (lt, d, t) => { const ph = lt / d, k = sm(ph); inMarsh(false);
    cave.root.visible = true; cave.root.position.set(.55, 0, 0); cave.root.rotation.set(0, -.4, 0); cave.root.scale.setScalar(1.6);
    const late = ph > .42;
    snail.root.visible = true; snail.root.rotation.set(0, late ? -.4 : -.3, 0);
    if (!late) snail.root.position.set(.95, 0, .75); else snail.root.position.set(.4, .84, 0);
    poseSnail(snail, t, { wob: 1.5, lookAt: late ? bird.head.getWorldPosition(V(0, 0, 0)) : K3.camera.position });
    place(rudi, -.75, .4, .05); poseRudi(rudi, t, late ? { arms: [1.9, 1.9], spread: .1, mouth: "o", wide: true } : { arms: [.5, .9], spread: .2, mouth: "smile", nod: .05 });
    if (late) { const b = sm(clamp((ph - .5) / .3, 0, 1)); birdAt(lerp(2.1, 1.7, b), lerp(1.5, 0, b), lerp(-.2, .1, b), PI + .2, t, { fly: b < 1 ? 1 : 0, legs: true, pitch: b < 1 ? .2 : 0, headDown: b >= 1 ? -.25 : 0, open: b >= 1 ? .3 : 0, lookAt: snail.head.getWorldPosition(V(0, 0, 0)) }); bird.root.scale.setScalar(1); bird.noCheck = b < 1; }
    else bird.root.visible = false;
    frameOn(late ? [rudi, cave, bird] : [rudi, cave], { az: lerp(.48, .4, k), el: .14, fill: lerp(.84, .9, k), dy: 0, t }); draw();
    if (!late) stamp(L("SAFE!", "SICHER!"), W * .42, H * .17, (lt - .2) / .25, "#36b37e", -.06);
    else stamp(L("HELLO, BLACKBIRD", "HALLO, AMSEL"), W * .42, H * .17, (ph - .62) * d / .25, "#1d1c22", .05); });
  // 6 Im Fühler: Studio, Nahaufnahme gestreifter Brutschlauch, Stempel SAUGWURM!, Karte Pulsieren
  KZ.shot("sInside", (lt, d, t) => { const ph = lt / d, k = sm(ph); inStudio();
    snail.root.visible = true; snail.root.position.set(0, 0, 0); snail.root.rotation.set(0, -.2, 0); poseSnail(snail, t, { wob: .6 });
    snail.root.scale.setScalar(2.2);
    frameOn([snail.head], { az: lerp(.35, .5, k), el: .12, fill: lerp(.42, .48, k), dy: .1, t }); draw();
    stamp(L("PARASITE!", "SAUGWURM!"), W * .42, H * .17, (lt - .3) / .25, "#2f9a3e", -.06);
    infoCard(W * .42, H * .6, 860, 200, sm((ph - .4) * d / .35), L("BROODSAC", "BRUTSCHLAUCH"), "#2f9a3e", [L("pulses up to 80× a minute", "pulsiert bis zu 80× pro Minute")], 38); });
  // 7 Auflösung: Kacheln mit Haken, dann BBC-Wildlife-Karte
  KZ.shot("sReveal", (lt, d, t) => { const ph = lt / d, k = sm(ph); inStudio();
    snail.root.visible = true; snail.root.position.set(0, 0, 0); snail.root.rotation.set(0, -.35, 0); poseSnail(snail, t, {}); snail.root.scale.setScalar(2.2);
    frameOn([snail], { az: lerp(.35, .45, k), el: .12, fill: lerp(.8, .86, k), dy: .3, t }); draw();
    stamp(L("UP TO 250!", "BIS ZU 250!"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06);
    if (ph < .5) quizTiles(W * .42, H * .54, QUIZ(), 1, { reveal: sm(clamp((lt - .1) / .4, 0, 1)), correct: 2 });
    else infoCard(W * .42, H * .58, 880, 220, sm((ph - .5) * d / .35), "BBC WILDLIFE", "#36b37e", [L("“up to 250 larvae", "„bis zu 250 Larven"), L("in each broodsac”", "in jedem Brutschlauch“")], 40); });
  // 8 Steuerung: Schnecke klettert den Halm hoch ins Licht, Pfeil nach oben, Karte J. of Zoology
  KZ.shot("sSteer", (lt, d, t) => { const ph = lt / d, k = sm(ph); inMarsh(false);
    plant.root.visible = true; plant.root.position.set(0, 0, 0); plant.root.rotation.set(0, 0, 0);
    const c = sm(clamp(ph / .8, 0, 1)); snail.root.visible = true; snail.root.position.set(-.04, lerp(.5, 1.9, c), 0); snail.root.rotation.set(0, 0, PI / 2);
    poseSnail(snail, t, { crawl: 1, lookAt: V(-1, 4, 2) });
    frameOn([plant], { az: lerp(.35, .5, k), el: .1, fill: lerp(.55, .6, k), dy: lerp(-.2, .1, k), t }); draw();
    const [sx, sy] = scr(V(0, 2.5, 0)); sunGlow(Math.min(sx, 800), sy - 80, .9);
    const [ax, ay] = scr(V(-.25, 1.0, 0)), [bx, by] = scr(V(-.25, 2.1, 0)); arrow(ax, ay, bx, by, 0, clamp(lt / .5, 0, 1), "#ffd23f");
    stamp(L("UP! INTO THE LIGHT!", "HOCH! INS LICHT!"), W * .42, H * .17, (lt - .2) / .25, "#e5484d", -.06);
    infoCard(W * .42, H * .6, 880, 220, sm((ph - .35) * d / .35), L("J. OF ZOOLOGY 2014", "J. OF ZOOLOGY 2014"), "#2f6fd0", [L("“more exposed, better lit,", "„offener, heller,"), L("higher in the vegetation”", "höher in den Pflanzen“")], 38); });
  // 9 Kreislauf: Studio, Amsel links, Schnecke rechts, Kot mit Eiern in der Mitte, Pfeile nacheinander
  KZ.shot("sCycle", (lt, d, t) => { const ph = lt / d, k = sm(ph); inStudio();
    birdAt(-1.15, 0, -.1, .35, t, { legs: true, lookAt: snail.head.getWorldPosition(V(0, 0, 0)) }); bird.root.scale.setScalar(1.5); bird.noCheck = false;
    snail.root.visible = true; snail.root.position.set(.8, 0, .25); snail.root.rotation.set(0, PI + .5, 0); 
    const pp = sm(clamp((ph - .3) / .2, 0, 1)); poop.root.visible = pp > 0; poop.root.position.set(-.1, 0, .9); poop.root.scale.setScalar(Math.max(.01, pp * 2.2));
    poseSnail(snail, t, { sc: 1.7, lookAt: poop.root.getWorldPosition(V(0, .2, 0)) });
    frameOn([bird, snail], { az: lerp(.05, .12, k), el: .3, fill: lerp(.9, .96, k), dy: -.15, t }); draw();
    const [bx, by] = scr(V(-1.15, .55, -.1)), [sx, sy] = scr(V(.8, .45, .25)), [px, py] = scr(V(-.1, .3, .9));
    arrow(sx - 40, sy - 120, bx + 40, by - 130, -.35, clamp(lt / .5, 0, 1), "#ffd23f");
    txt(L("EATS", "FRISST"), (sx + bx) / 2, Math.min(sy, by) - 260, 44, "#ffd23f", { stroke: 10, a: clamp(lt / .4, 0, 1) });
    arrow(bx + 10, by + 60, px - 70, py, .25, clamp((ph - .25) / .2, 0, 1), "#c98a4a");
    txt(L("EGGS", "EIER"), px, py + 110, 44, "#ffffff", { stroke: 10, a: pp });
    arrow(px + 70, py, sx - 10, sy + 60, .25, clamp((ph - .55) / .2, 0, 1), "#7bd04a");
    stamp(L("EW!", "IGITT!"), W * .42, H * .14, (ph - .75) * d / .25, "#7a5030", .06); });
  // 10 Loop: zurück zur Hook-Einstellung, Stempel AUCH BEI UNS
  KZ.shot("sLoop", (lt, d, t) => { const ph = lt / d; hookFrame(t, (1 - ph) * .2);
    stamp(L("IN EUROPE TOO!", "AUCH BEI UNS!"), W * .44, H * .6, (lt - .2) / .25, "#2f6fd0", -.06); });

  window.__snailZombie = true;
})();
