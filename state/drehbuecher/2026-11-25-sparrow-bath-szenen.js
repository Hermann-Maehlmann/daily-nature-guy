// 3D-Szene "Why Your Sparrow Needs A Bath In Winter" / "Warum dein Spatz im Winter eine Badewanne braucht" (25.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Haussperling-Männchen "Spatz" (graue Kappe, kastanienbraunes Band vom Auge in den Nacken, hellgraue Wangen, schwarzer Latz, braun-gestreifter Rücken,
// weiße Flügelbinde, kräftiger kegelförmiger Schnabel), aufplustern über puff. Steinerne Vogeltränke mit Wasser oder Eis, Salzsack, Mini-Pulli,
// Tischtennisball, Winter-Garten (Schnee auf dem Boden, Schneeflocken in 2D).
// Opener-Stil "hotel-bewertung": Der Spatz gibt Hotel Rudi einen Stern.
// Quellen: RSPB ("Birds need water in winter for drinking and to keep their feathers in good condition, helping them to fluff up and trap body heat";
// "float a light ball in the water"; "never add chemicals such as glycerine, antifreeze, salt or sugar, as these can damage feathers or even prove toxic"),
// BTO ("The weight of a House Sparrow's plumage increases by 70% in autumn"; "in a cold spell, the water in your garden might be the only source which isn't frozen").
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const QUIZ = () => ["+7 %", "+70 %", L("Double", "Doppelt")];
  let spatz, spatz2, bath, saltBag, sweater, ball, snow, winterSky;

  // ---------- Haussperling (Männchen) ----------
  function makeSparrow() {
    const brown = M(0x9a6a3e, { roughness: .85 }), streak = M(0x3b2718, { roughness: .85 }), grey = M(0x8f8e8b, { roughness: .85 }), belly = M(0xcfcbc2, { roughness: .85 }),
      chest = M(0x8c4a22, { roughness: .8 }), pale = M(0xece8de, { roughness: .8 }), blk = M(0x1b1716, { roughness: .7 }), beakM = M(0x3a332f, { roughness: .45 }),
      wht = M(0xf7f3ea, { roughness: .8 }), leg = M(0xc89a86, { roughness: .6 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const torso = new T.Group(); torso.position.y = .2; body.add(torso);
    torso.add(sph(belly, .02, -.02, 0, .15, .1, .1));
    torso.add(sph(brown, -.03, .025, 0, .14, .085, .098));
    for (const z of [-.04, 0, .04]) torso.add(sph(streak, -.05, .1, z, .07, .012, .012)); // Rückenstreifen
    torso.add(sph(blk, .1, .0, 0, .05, .06, .065)); // schwarzer Latz
    const head = new T.Group(); head.position.set(.13, .3, 0); body.add(head);
    head.add(sph(grey, 0, 0, 0, .08, .076, .074));
    for (const s of [-1, 1]) {
      head.add(sph(chest, -.03, .01, s * .04, .062, .042, .046)); // kastanienbraunes Band vom Auge in den Nacken
      head.add(sph(pale, .015, -.035, s * .045, .042, .03, .03)); // helle Wange
    }
    head.add(sph(blk, .06, -.05, 0, .03, .03, .04)); // Kehle schwarz
    const beak = mesh(new T.ConeGeometry(.03, .065, 16), beakM, .1, -.008, 0); beak.rotation.z = -PI / 2; head.add(beak);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.06, .032, s * .058); head.add(e); const ey = K3.eye(.032); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const wings = []; for (const s of [-1, 1]) { const wg = new T.Group(); wg.position.set(.0, .245, s * .09); body.add(wg);
      wg.add(sph(brown, -.07, -.01, 0, .11, .05, .02)); wg.add(sph(streak, -.1, -.0, s * .008, .07, .028, .016)); wg.add(sph(wht, -.04, -.03, s * .012, .035, .01, .012)); wings.push(wg); }
    const tail = mesh(BOX, streak, -.2, .21, 0, .13, .02, .07); tail.rotation.z = .3; body.add(tail);
    const legs = []; for (const s of [-1, 1]) { const l = limb(.009, .11, leg); l.position.set(.02, .12, s * .03); body.add(l); legs.push(l); }
    return { root, body, torso, head, eyes, wings, legs, tail };
  }
  // o: {flap, hop, peck, puff 1..1.5, splay, lookAt, sc, wide, lid, shiver, splash}
  function poseSparrow(B, t, o) {
    o = o || {};
    const pk = o.peck ? Math.max(0, Math.sin(t * 9)) * o.peck : 0, sh = o.shiver ? Math.sin(t * 55) * .012 * o.shiver : 0;
    B.head.rotation.set(0, 0, -pk * .7 + Math.sin(t * 2.5) * .05 + (o.tiltHead || 0));
    B.head.position.set(.13 + pk * .03 + sh, .3 - pk * .06 + (o.puff ? (o.puff - 1) * .05 : 0), 0);
    const pf = o.puff || 1; B.torso.scale.set(pf, pf * .95, pf * 1.05);
    B.wings.forEach((w, i) => { const s = i ? 1 : -1; w.position.z = s * .09 * pf; w.rotation.set(s * (o.flap ? (.4 + Math.sin(t * 30 + i) * .8) * o.flap : .05), 0, o.flap ? -.2 : 0); });
    B.legs.forEach((l, i) => { const s = i ? 1 : -1; l.rotation.set(s * (o.splay || 0), 0, (o.splay ? Math.sin(t * 14 + i * PI) * .5 : 0)); });
    B.body.position.y = (o.hop ? Math.abs(Math.sin(t * 7)) * .06 : 0) + Math.sin(t * 3) * .004;
    B.body.position.x = sh;
    B.body.rotation.z = o.lean || 0;
    B.tail.rotation.z = .3 + (o.splash ? Math.sin(t * 22) * .25 : 0);
    const lid = o.lid ?? (Math.sin(t * 1.7) > .985 ? .85 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.2 : 1), 1));
    if (K3.aimEyes) { B.root.updateMatrixWorld(true); K3.aimEyes(B.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .45); }
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Vogeltränke ----------
  const TOP = .86; // Höhe der Wasser-/Eisfläche
  function makeBath() {
    const root = new T.Group(); const stone = M(0xb9b3a8, { roughness: .9 }), dark = M(0x938c80, { roughness: .9 }), snowM = M(0xffffff, { roughness: .7 });
    root.add(mesh(new T.CylinderGeometry(.34, .4, .12, 36), dark, 0, .06, 0));
    root.add(mesh(new T.CylinderGeometry(.12, .16, .62, 28), stone, 0, .43, 0));
    root.add(mesh(new T.CylinderGeometry(.6, .26, .16, 44), stone, 0, .78, 0));
    const rim = new T.Mesh(new T.TorusGeometry(.6, .045, 10, 48), stone); rim.rotation.x = PI / 2; rim.position.y = .86; root.add(rim);
    // Schneehäubchen auf dem Rand
    for (let i = 0; i < 9; i++) { const a = i / 9 * 2 * PI + .3; if (i % 3 === 1) continue; const s = sph(snowM, Math.cos(a) * .6, .9, Math.sin(a) * .6, .11, .035, .07); s.rotation.y = -a; root.add(s); }
    const water = mesh(new T.CircleGeometry(.58, 44), M(0x58aee6, { roughness: .08, metalness: .15 }), 0, TOP + .006, 0); water.rotation.x = -PI / 2; root.add(water);
    const iceTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#e6f6ff"; c.fillRect(0, 0, w, h); c.strokeStyle = "rgba(120,170,210,.9)"; c.lineWidth = 4;
      for (let i = 0; i < 7; i++) { c.beginPath(); let x = w / 2, y = h / 2; c.moveTo(x, y); for (let k = 0; k < 4; k++) { const a = i * .9 + k * .4; x += Math.cos(a) * 34; y += Math.sin(a) * 34; c.lineTo(x, y); } c.stroke(); }
      c.fillStyle = "rgba(255,255,255,.7)"; for (let i = 0; i < 30; i++) { c.beginPath(); c.arc((i * 71) % w, (i * 113) % h, 6, 0, 7); c.fill(); } });
    const ice = mesh(new T.CylinderGeometry(.58, .58, .04, 44), M(0xffffff, { map: iceTex, roughness: .18 }), 0, TOP + .02, 0); root.add(ice);
    return { root, water, ice };
  }
  function makeSalt() {
    const root = new T.Group(); const lab = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#f4f6fb"; c.fillRect(0, 0, w, h); c.fillStyle = "#2f6fd0"; c.fillRect(0, 70, w, 110);
      c.fillStyle = "#fff"; c.font = '900 72px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(L("SALT", "SALZ"), w / 2, 128); });
    const bag = new T.Mesh(new T.BoxGeometry(.34, .46, .16), new T.MeshStandardMaterial({ map: lab, roughness: .7 })); bag.position.y = .23; root.add(bag);
    root.add(mesh(BOX, M(0xf4f6fb, { roughness: .7 }), 0, .48, 0, .3, .06, .12));
    return { root, bag };
  }
  function makeSweater() {
    const root = new T.Group(); const red = M(0xe0302a, { roughness: .95 }), wh = M(0xfff4e0, { roughness: .95 });
    root.add(mesh(BOX, red, 0, 0, 0, .22, .2, .07)); for (const s of [-1, 1]) { const sl = mesh(BOX, red, s * .15, .04, 0, .12, .07, .065); sl.rotation.z = s * -.35; root.add(sl); }
    for (const y of [-.05, .04]) root.add(mesh(BOX, wh, 0, y, .005, .225, .022, .075));
    root.add(mesh(BOX, wh, 0, .11, 0, .1, .03, .075));
    return { root };
  }
  function makeBall() { const root = new T.Group(); root.add(sph(M(0xffffff, { roughness: .35 }), 0, 0, 0, .075)); return { root }; }

  K3.onBuild(() => {
    spatz = actor(makeSparrow(), "Spatz"); spatz2 = actor(makeSparrow(), "Spatz Sommer");
    bath = actor(makeBath(), "Vogeltränke"); saltBag = actor(makeSalt(), "Salz"); sweater = actor(makeSweater(), "Pulli"); ball = actor(makeBall(), "Tischtennisball");
    sweater.noCheck = true; ball.noCheck = true; ball.noBlob = true; sweater.noBlob = true; saltBag.noBlob = true;
    // Schneedecke über dem Garten
    const snowTex = canvasTex(512, 512, (c, w, h) => { c.fillStyle = "#f3f7fc"; c.fillRect(0, 0, w, h); for (let i = 0; i < 1800; i++) { c.globalAlpha = .25; c.fillStyle = Math.random() > .5 ? "#dfe8f4" : "#ffffff"; c.beginPath(); c.arc(Math.random() * w, Math.random() * h, 3 + Math.random() * 7, 0, 7); c.fill(); } });
    snowTex.wrapS = snowTex.wrapT = T.RepeatWrapping; snowTex.repeat.set(10, 10);
    snow = new T.Mesh(new T.CircleGeometry(40, 64), M(0xffffff, { map: snowTex, roughness: .8 })); snow.rotation.x = -PI / 2; snow.position.y = .008; snow.receiveShadow = true; K3.yard.add(snow);
    // Schneehauben auf Büschen und Baum
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
    winterSky = canvasTex(64, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#7fa9d6"); gr.addColorStop(.55, "#c9def0"); gr.addColorStop(1, "#f1e9f2"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  });
  const rudi = () => K3.rudi;
  function reset() { const R = rudi(); R.noCheck = false;
    for (const b of [spatz, spatz2, bath, saltBag, sweater, ball]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.root.scale.setScalar(1); b.noCheck = false; b.noEyeCheck = false; }
    sweater.noCheck = true; ball.noCheck = true; bath.ice.visible = true; bath.water.visible = true; }
  function inYard() { begin("yard"); reset(); K3.scene.background = winterSky; K3.scene.fog = new T.Fog(0xe4edf6, 12, 34); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function hand(i) { const R = rudi(); R.root.updateMatrixWorld(true); return R.arms[i].localToWorld(V(0, -.62, 0)); }
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  function flakes(t, a, n, fast) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#ffffff";
    for (let i = 0; i < (n || 40); i++) { const sp = (fast ? 420 : 90) + (i % 5) * 30, x = ((i * 263) % 1060) + 10 + Math.sin(t * 1.3 + i) * 40 + (fast ? -((t * 260) % 1100) + 550 : 0), y = ((i * 151 + t * sp) % 1800) + 60;
      const xx = ((x % 1080) + 1080) % 1080; g.globalAlpha = a * (.55 + (i % 3) * .15); g.beginPath(); g.arc(xx, y, 5 + (i % 4) * 2.5, 0, 7); g.fill(); } g.restore(); }
  function drops(x, y, t, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#bfe6ff";
    for (let i = 0; i < 12; i++) { const q = (t * 2.2 + i / 12) % 1, ang = -PI / 2 + (i - 5.5) * .22; g.globalAlpha = a * (1 - q);
      g.beginPath(); g.arc(x + Math.cos(ang) * 260 * q, y + Math.sin(ang) * 200 * q + 260 * q * q, 9 - q * 4, 0, 7); g.fill(); } g.restore(); }
  function starPath(cx, cy, r) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -PI / 2 + i * PI / 5, rr = i % 2 ? r * .45 : r; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.closePath(); }
  function stars(x, y, n, size, p) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 5; i++) { const k = easeBack(clamp((p * 5 - i) / 1.2, 0, 1)); if (k <= 0) continue;
    g.save(); g.translate(x + (i - 2) * size * 2.3, y); g.scale(k, k); starPath(0, 0, size); g.fillStyle = i < n ? "#ffc21a" : "#c9cbe0"; g.fill(); g.lineWidth = 6; g.strokeStyle = "#1d2250"; g.stroke(); g.restore(); } g.restore(); }
  // Bewertungskarte (2D)
  function review(x, y, p, t) { if (p <= 0) return; const k = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(-.04 + Math.sin(t * 2) * .01); g.scale(k, k);
    const w = 640, h = 330; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(-w / 2 + 12, -h / 2 + 14, w, h, 22); g.fill();
    g.fillStyle = "#fffdf5"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 22); g.fill();
    g.fillStyle = "#1d2250"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, 92, [22, 22, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 46px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(L("HOTEL RUDI · REVIEW", "HOTEL RUDI · BEWERTUNG"), 0, -h / 2 + 48, w - 50);
    g.restore(); stars(x, y - 50 * k, 1, 30 * k, clamp(p * 1.4 - .2, 0, 1));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(k, k); g.textAlign = "left"; g.textBaseline = "middle";
    const rows = [[L("Bathtub:", "Wanne:"), L("frozen", "gefroren")], [L("Manager:", "Hotelchef:"), "Rudi"]];
    rows.forEach(([a, b], i) => { if (p < .45 + i * .25) return; g.font = '800 40px "Montserrat"'; g.fillStyle = "#6a6f92"; g.fillText(a, -w / 2 + 50, 25 + i * 62); g.fillStyle = i === 0 ? "#2f6fd0" : "#e5484d"; g.fillText(b, -w / 2 + 300, 25 + i * 62, w - 340); });
    g.restore(); }

  // ---------- Shots ----------
  // Hook: Spatz schlittert auf dem Eis der Tränke, flattert, Schnee wirbelt, 1-STERN-Stempel ab Bild 1
  function hookFrame(t, ph, lt) {
    place(bath, 0, 0, 0); bath.water.visible = false;
    const slide = Math.sin((lt ?? t) * 3.2) * .18;
    at(spatz, slide, TOP + .02, .05, .35 + Math.sin((lt ?? t) * 5) * .25); poseSparrow(spatz, t, { sc: 1.55, flap: 1, splay: .55, wide: true, lean: -slide * .8, lookAt: V(2.2, 1.6, .6) });
    spatz.noCheck = true;
    frameOn([spatz, FR(-.3, TOP - .05, -.2, .3, TOP + .5, .2)], { az: lerp(.6, .3, ph), el: .3, fill: lerp(.9, 1.0, sm(clamp(ph * 1.6, 0, 1))), dy: -.05, t }); draw(); flakes(t, 1, 46, true); }
  KZ.shot("bHook", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(t, ph, lt);
    stamp(L("1 STAR!", "1 STERN!"), W * .42, H * .6, (lt + .02) / .2, "#ffc21a", -.07); });
  // 1 Bewertung: Spatz pickt aufs Eis (KLONK), Rudi im Hintergrund stolz, Bewertungskarte mit 1 von 5 Sternen
  KZ.shot("bReview", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(bath, 0, 0, 0); bath.water.visible = false;
    at(spatz, -.1, TOP + .02, .1, .5); poseSparrow(spatz, t, { sc: 1.5, peck: 1, puff: 1.15, shiver: 1, lookAt: V(2.2, 1.2, .6) }); spatz.noCheck = true;
    frameOn([bath, spatz], { az: lerp(.35, .5, k), el: .22, fill: lerp(.76, .82, k), dy: .4, t }); draw(); flakes(t, .8, 30);
    review(W * .42, H * .2, (lt - .1) / .45, t);
    if (ph > .2) { spatz.head.updateMatrixWorld(true); const [bx, by] = scr(spatz.head.localToWorld(V(.14, -.02, 0))); txt(L("CLONK", "KLONK"), Math.min(bx + 40, 820), by + 70, 48, "#2f6fd0", { stroke: 10, a: clamp(Math.sin(t * 9), 0, 1) }); } });
  // 2 Rate-Frage: Studio, plustriger Spatz auf dem Sockel, Kacheln
  KZ.shot("bQuiz", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(spatz, 0, 0, 0, .45); poseSparrow(spatz, t, { sc: 3.2, puff: 1.15 + Math.sin(t * 2) * .08, lookAt: K3.camera.position });
    frameOn([spatz], { az: lerp(.35, .2, k), el: .15, fill: lerp(.55, .6, k), dy: -.55, t }); draw(); flakes(t, .35, 18);
    txt(L("HOW MUCH HEAVIER?", "WIE VIEL SCHWERER?"), W * .42, H * .2, 58, "#ffd23f", { stroke: 12, a: clamp(lt / .3, 0, 1) });
    txt(L("feathers in fall", "Gefieder im Herbst"), W * .42, H * .255, 42, "#ffffff", { stroke: 10, a: clamp((lt - .2) / .3, 0, 1) });
    quizTiles(W * .42, H * .575, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 3 Salz: Rudi kippt Salz auf die Tränke (Körner fliegen), Schnitt: Spatz entsetzt, GIFTIG!-Stempel
  KZ.shot("bSalt", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .55; place(bath, 0, 0, 0); bath.water.visible = false;
    if (!half) { const k = ph / .55;
      place(rudi(), 1.2, .1, PI + .2); poseRudi(rudi(), t, { arms: [1.0, 1.9], spread: .05, mouth: "smile", nod: -.08, lean: -.06 });
      const h1 = hand(1); saltBag.root.visible = true; saltBag.root.position.set(h1.x - .1, h1.y - .1, h1.z); saltBag.root.rotation.set(0, PI + .25, 1.9 + Math.sin(t * 8) * .1); saltBag.noCheck = true;
      at(spatz, -.2, TOP + .02, .15, .2); poseSparrow(spatz, t, { sc: 1.8, puff: 1.1, wide: true, lookAt: V(1.2, 1.8, 0) }); spatz.noCheck = true; bath.noCheck = true;
      frameOn([rudi(), bath, spatz], { az: lerp(-.35, -.45, k), el: .14, fill: lerp(.84, .86, k), dy: -.45, t }); draw(); flakes(t, .7, 24);
      saltBag.bag.updateMatrixWorld(true); const [sx, sy] = scr(saltBag.bag.localToWorld(V(0, .25, 0)));
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#ffffff"; g.strokeStyle = "#7f8fb0"; g.lineWidth = 2;
      for (let i = 0; i < 26; i++) { const q = (t * 1.8 + i / 26) % 1; const x = sx + Math.sin(i * 2.3) * 30 * q - 60 * q, y = sy + q * 260; g.globalAlpha = 1 - q * .5; g.fillRect(x, y, 9, 9); g.strokeRect(x, y, 9, 9); } g.restore();
      stamp(L("SALT!", "SALZ!"), W * .42, H * .2, (lt - .15) / .3, "#2f6fd0", -.06); }
    else { const k = (ph - .55) / .45;
      at(spatz, -.05, TOP + .02, 0, -.25); poseSparrow(spatz, t, { sc: 1.55, puff: .95, wide: true, flap: .5, hop: true, lookAt: V(.4, TOP + .1, 1.5) }); spatz.noCheck = true;
      frameOn([spatz, FR(-.35, TOP - .1, -.3, .35, TOP + .5, .3)], { az: lerp(.65, .55, k), el: .25, fill: lerp(.86, .95, k), dy: -.02, t }); draw(); flakes(t, .7, 20);
      // Salzkörner auf dem Eis
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#ffffff"; for (let i = 0; i < 14; i++) { const [x, y] = scr(V(Math.sin(i * 2.7) * .4, TOP + .035, Math.cos(i * 1.9) * .35)); g.fillRect(x, y, 10, 10); } g.restore();
      stamp(L("TOXIC!", "GIFTIG!"), W * .42, H * .2, (k * d * .45 - .02) / .25, "#e5484d", .06); } });
  // 4 Pulli: Rudi hält stolz den Mini-Pulli hin, Spatz plustert sich zur Kugel auf, Stempel HAT SCHON EINEN!
  KZ.shot("bSweater", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); place(bath, 0, 0, 0); bath.water.visible = false;
    place(rudi(), 1.3, .2, PI + .3); poseRudi(rudi(), t, { arms: [.15, 1.35], spread: .05, mouth: ph < .5 ? "smile" : "o", nod: .04 });
    const h1 = hand(1); sweater.root.visible = true; sweater.root.position.set(h1.x - .02, h1.y - .1, h1.z); sweater.root.rotation.set(0, PI / 2 + .4, Math.sin(t * 6) * .08); sweater.root.scale.setScalar(1.5);
    const puff = 1 + .45 * sm(clamp((ph - .4) / .25, 0, 1));
    at(spatz, -.15, TOP + .02, .1, .25); poseSparrow(spatz, t, { sc: 1.8, puff, lookAt: V(1.05, 1.7, .1), tiltHead: ph > .45 ? .12 : 0 }); spatz.noCheck = true; bath.noCheck = true;
    frameOn([rudi(), bath, spatz], { az: lerp(-.35, -.45, k), el: .14, fill: lerp(.84, .86, k), dy: -.5, t }); draw(); flakes(t, .7, 24);
    if (ph <= .5) stamp(L("KNITTED!", "GESTRICKT!"), W * .42, H * .2, (lt - .1) / .3, "#e0302a", -.06);
    if (ph > .5) stamp(L("HAS ONE ALREADY!", "HAT SCHON EINEN!"), W * .42, H * .2, (ph - .5) * d / .3, "#36b37e", .05); });
  // 5 Auflösung + Infografik: Kacheln mit Haken, dann Sommer-Spatz vs. Winter-Spatz und Balken +70 %
  KZ.shot("bDown", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    if (ph < .38) { at(spatz, 0, 0, 0, .45); poseSparrow(spatz, t, { sc: 3.2, puff: 1.2 });
      frameOn([spatz], { az: .2, el: .15, fill: .6, dy: -.55, t }); draw();
      quizTiles(W * .42, H * .575, QUIZ(), 1, { reveal: sm(clamp((lt - .1) / .4, 0, 1)), correct: 1 }); }
    else { const q = sm(clamp((ph - .4) / .35, 0, 1));
      at(spatz2, -.55, 0, 0, .35); poseSparrow(spatz2, t, { sc: 2.2, puff: 1 }); at(spatz, .55, 0, 0, .35); poseSparrow(spatz, t + 1, { sc: 2.2, puff: 1 + .45 * q, lid: .3 });
      frameOn([spatz, spatz2], { az: lerp(.12, .05, k), el: .14, fill: .84, dy: .35, t }); draw();
      spatz2.root.updateMatrixWorld(true); spatz.root.updateMatrixWorld(true);
      const [ax] = scr(spatz2.root.localToWorld(V(0, 0, 0))), [bx] = scr(spatz.root.localToWorld(V(0, 0, 0)));
      txt(L("SUMMER", "SOMMER"), clamp(ax, 160, 800), H * .63, 46, "#ffffff", { stroke: 10 }); txt(L("WINTER", "WINTER"), clamp(bx, 160, 800), H * .63, 46, "#8fd3ff", { stroke: 10 });
      // Balken
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const by = H * .2, bw = 300; g.fillStyle = "rgba(255,255,255,.2)"; g.fillRect(W * .42 - bw * .85, by - 26, bw * 1.7, 52);
      g.fillStyle = "#ffd23f"; g.fillRect(W * .42 - bw * .85, by - 26, bw * (1 + .7 * q), 52); g.restore();
      txt("+" + Math.round(70 * q) + " %", W * .42, H * .2, 64, "#1d2250", { w: 900, stroke: 0 });
      stamp("BTO", W * .42, H * .27, (ph - .6) * d / .3, "#36b37e", -.05); } });
  // 6 Baden: Spatz badet in der offenen Tränke, Wasser spritzt, Karte "Saubere Federn = warme Luftschicht"
  KZ.shot("bBathe", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); place(bath, 0, 0, 0); bath.ice.visible = false;
    at(spatz, 0, TOP - .05, .05, .5 + Math.sin(t * 3) * .2); poseSparrow(spatz, t, { sc: 1.6, flap: 1, splash: 1, puff: 1.1, lid: Math.sin(t * 6) > .3 ? .7 : 0 }); spatz.noCheck = true;
    frameOn([spatz, FR(-.55, TOP - .2, -.4, .55, TOP + .5, .4)], { az: lerp(.25, .45, k), el: .28, fill: lerp(.84, .92, k), dy: .0, t }); draw(); flakes(t, .6, 20);
    spatz.root.updateMatrixWorld(true); const [x, y] = scr(spatz.root.localToWorld(V(0, .25, 0))); drops(x, y, t, 1);
    stamp(L("SPA DAY!", "WELLNESS!"), W * .42, H * .2, (lt - .1) / .3, "#2f9bd0", -.06);
    infoCard(W * .42, H * .6, 900, 200, sm((ph - .4) * d / .35), "RSPB", "#2f6fd0",
      [L("Clean feathers fluff up", "Saubere Federn plustern sich"), L("and trap body heat", "auf und halten die Wärme")], 40); });
  // 7 Quellenkarte: Rudi mit Salzsack, schaut betreten; RSPB-Zitat
  KZ.shot("bSource", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); place(bath, 0, 0, 0); bath.ice.visible = false;
    place(rudi(), 1.25, .2, PI + .35); poseRudi(rudi(), t, { arms: [.2, 1.1], spread: .05, mouth: "o", nod: -.1, tilt: .05 });
    const h1 = hand(1); saltBag.root.visible = true; saltBag.root.position.set(h1.x, h1.y - .45, h1.z); saltBag.root.rotation.set(0, PI + .45, 0); saltBag.noCheck = true;
    at(spatz, -.2, TOP + .0, .15, .3); poseSparrow(spatz, t, { sc: 1.8, puff: 1.05, lookAt: V(.95, 1.8, .15) }); spatz.noCheck = true;
    frameOn([rudi(), bath, spatz], { az: lerp(-.3, -.4, k), el: .14, fill: lerp(.86, .9, k), dy: -.55, t }); draw(); flakes(t, .6, 20);
    stamp(L("OOPS...", "UPS..."), W * .42, H * .2, (lt - .1) / .3, "#e5484d", -.06);
    infoCard(W * .42, H * .58, 920, 240, sm((ph - .2) * d / .35), "RSPB", "#e5484d",
      [L("\"Never add salt, antifreeze", "„Nie Salz, Frostschutz"), L("or glycerine to the water\"", "oder Glycerin ins Wasser“")], 40); });
  // 8 Tipp: flache Schale, Tischtennisball schaukelt im offenen Wasser, Spatz trinkt, Tipp-Karte
  KZ.shot("bTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); place(bath, 0, 0, 0); bath.ice.visible = false;
    // Eisrand: Ring bleibt gefroren, Mitte offen dank Ball
    at(ball, .12 + Math.sin(t * 1.6) * .08, TOP + .03 + Math.sin(t * 3) * .01, -.05 + Math.cos(t * 1.3) * .06, 0);
    at(spatz, -.38, TOP + .0, .1, .2); poseSparrow(spatz, t, { sc: 1.45, peck: ph > .25 ? .8 : 0, lookAt: V(.12, TOP, 0) }); spatz.noCheck = true;
    frameOn([spatz, FR(-.6, TOP - .2, -.45, .6, TOP + .45, .45)], { az: lerp(.35, .2, k), el: lerp(.4, .34, k), fill: lerp(.78, .81, k), dy: .0, t }); draw(); flakes(t, .6, 20);
    ball.root.updateMatrixWorld(true); const [bx, by] = scr(ball.root.localToWorld(V(0, 0, 0)));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 4; for (let i = 0; i < 2; i++) { const q = (t * .8 + i / 2) % 1; g.globalAlpha = 1 - q; g.beginPath(); g.ellipse(bx, by + 10, 40 + q * 110, (40 + q * 110) * .35, 0, 0, 7); g.stroke(); } g.restore();
    stamp(L("PING-PONG!", "PING-PONG!"), W * .42, H * .2, (lt - .1) / .3, "#ff7a1a", -.06);
    infoCard(W * .42, H * .6, 900, 200, sm((ph - .3) * d / .35), L("TIP", "TIPP"), "#36b37e",
      [L("Shallow dish, fresh daily", "Flache Schale, täglich frisch"), L("+ ball keeps it ice-free", "+ Ball hält das Eis offen")], 40); });
  // 9 Loop: zurück zur Hook-Einstellung
  KZ.shot("bLoop", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(t, 1 - ph * .9, lt);
    if (ph > .3) stamp(L("SALT AGAIN?", "WIEDER SALZ?"), W * .42, H * .2, (ph - .3) * d / .3, "#2f6fd0", -.06); });

  window.__sparrowBath = true;
})();
