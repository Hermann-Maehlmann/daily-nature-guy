// 3D-Szene "Why Your Hamster Chews The Cage Bars" / "Warum dein Hamster am Gitter nagt" (25.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Opener-Stil "knast-ausbruch": Hamster beißt ins Gitter wie ein Häftling, Suchscheinwerfer, "Häftling Nummer sieben".
// Goldhamster aus dem Weck-Video (2026-11-23) übernommen, neu: Aufrichten auf die Hinterbeine (rear), Nagen am Gitter (gnaw), Vorderpfoten am Gitter.
// Neu: Käfig mit Gitter vorn (ohne Haus), Futternapf mit wachsendem Körnerberg, Futtertüte, Nagestab, Ohrstöpsel für Rudi,
// Terrarium mit 40 cm Einstreu im Querschnitt (Tunnel + Kammer), Erdquerschnitt Wildbau (2D), Balkendiagramm Studie (2D).
// Quellen: Hauzenberger, Gebhardt-Henrich & Steiger 2006, Appl Anim Behav Sci 100:280-294 (Uni Bern): 10 vs 40 vs 80 cm Einstreu,
// 10 cm deutlich mehr Gitternagen, bei 80 cm nie beobachtet, ab 40 cm bauten alle eigene Baue (laut GV-SOLAS 2020, Hamster Info Ireland, PMC7158296);
// Gattermann et al. 2001, J Zool (Uni Halle): Wildbaue 36–106 cm tief, Mittel 65 cm; Fox et al. 2024 Vet Record: flachere Einstreu -> mehr Gitterbeißen.
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn, view } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let ham, rudi, room, table, cage, bag, stick, terra, plugs;
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  const QUIZ = () => [L("A  A hand's width", "A  Eine Handbreit"), L("B  Over 1 meter", "B  Über 1 Meter"), L("C  5 meters", "C  5 Meter")];

  // ---------- Syrischer Goldhamster ----------
  function makeHamster(col, colD) {
    const fur = M(col, { roughness: .8 }), furD = M(colD, { roughness: .8 }), cream = M(0xfff1dc, { roughness: .85 }), pink = M(0xffa3b1, { roughness: .5 });
    const wh = M(0xffffff, { roughness: .4 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const front = new T.Group(), rear = new T.Group(); front.position.set(0, .2, 0); rear.position.set(0, .2, 0); body.add(front); body.add(rear);
    front.add(sph(fur, .07, 0, 0, .17, .18, .19)); front.add(sph(furD, .02, .07, 0, .12, .09, .13)); front.add(sph(cream, .09, -.06, 0, .14, .11, .16));
    rear.add(sph(fur, -.08, 0, 0, .18, .18, .2)); rear.add(sph(furD, -.06, .07, 0, .13, .1, .13)); rear.add(sph(cream, -.04, -.06, 0, .14, .11, .16));
    rear.add(sph(pink, -.25, -.03, 0, .025, .02, .02));
    const legs = []; for (const [x, s, grp] of [[.13, -1, front], [.13, 1, front], [-.12, -1, rear], [-.12, 1, rear]]) { const l = limb(.028, .07, pink); l.position.set(x, -.125, s * .11); l.add(sph(pink, .015, -.075, 0, .035, .015, .028)); grp.add(l); legs.push(l); }
    const head = new T.Group(); head.position.set(.2, .07, 0); front.add(head);
    head.add(sph(fur, 0, 0, 0, .16, .15, .16));
    const cheeks = []; for (const s of [-1, 1]) { const c = sph(cream, .06, -.05, s * .095, .095, .08, .085); head.add(c); c.base = c.scale.clone(); cheeks.push(c); }
    for (const s of [-1, 1]) head.add(sph(furD, .02, .0, s * .135, .05, .045, .03));
    head.add(sph(cream, .13, -.035, 0, .065, .055, .065));
    head.add(sph(pink, .19, -.01, 0, .022, .018, .024));
    const mouth = mesh(new T.TorusGeometry(.016, .004, 6, 12, PI), M(0x5a2a20), .185, -.055, 0); mouth.rotation.set(0, PI / 2, PI); head.add(mouth);
    const oMouth = sph(M(0x5a1a22), .185, -.06, 0, .014, .024, .02); head.add(oMouth); oMouth.visible = false; oMouth.base = oMouth.scale.clone();
    // Nagezähne (gelblich, wie echte Hamster-Schneidezähne), sichtbar beim Nagen
    const teeth = new T.Group(); head.add(teeth); for (const s of [-1, 1]) teeth.add(mesh(BOX, M(0xffe9a8, { roughness: .4 }), .192, -.05, s * .007, .01, .03, .012)); teeth.visible = false;
    for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.03, .13, s * .095); e.rotation.x = s * .35; head.add(e);
      e.add(sph(fur, 0, 0, 0, .05, .06, .022)); e.add(sph(pink, .006, 0, 0, .036, .045, .016)); }
    const eyeM = M(0x0c0808, { roughness: .08 });
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.1, .045, s * .085); e.rotation.y = -s * .55; head.add(e);
      const ey = K3.eye(.042, { white: M(0x3a2014, { roughness: .15 }), pupil: eyeM }); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, M(0x3a2216, { roughness: .6 }), .12, .1, s * .085, .015, .016, .075); b.castShadow = false; head.add(b); brows.push(b); }
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .17, -.04 + i * .015, s * .09, .003, .13, .003); w.rotation.x = s * (PI / 2 - .25 + i * .2); w.castShadow = false; head.add(w); }
    return { root, body, front, rear, legs, head, eyes, cheeks, brows, mouth, oMouth, teeth };
  }
  // o: {run, look, up, sc, puff, worry, angry, o, bite, gnaw (0..1), rear (rad), happy, lookAt}
  function poseHam(Hm, t, o) {
    o = o || {}; const run = o.run || 0, sp = o.speed || 22, rr = o.rear || 0, gn = o.gnaw || 0;
    Hm.legs.forEach((l, i) => l.rotation.z = Math.sin(t * sp + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .7 * run + (i < 2 ? -rr * 1.25 + Math.sin(t * 30 + i) * .1 * gn : rr * .9));
    Hm.body.rotation.z = rr;
    Hm.body.position.set(-.15 + .15 * Math.cos(rr), Math.abs(Math.sin(t * sp)) * .012 * run + Math.sin(t * 3) * .004 + .15 * Math.sin(rr), 0);
    Hm.head.rotation.set(Math.sin(t * 38) * .07 * gn, (o.look || 0) + Math.sin(t * 31) * .06 * gn, (o.up || 0) - rr * .85 + Math.sin(t * 2.3) * .03);
    Hm.cheeks.forEach((c) => c.scale.copy(c.base).multiplyScalar(1 + (o.puff || 0) * .35));
    Hm.brows.forEach((b, i) => { b.visible = !!(o.worry || o.angry); b.rotation.x = (i ? 1 : -1) * (o.angry ? -.5 : .45); b.position.y = o.angry ? .09 : .1; });
    const om = !!(o.o || o.bite || gn > 0); Hm.mouth.visible = !om; Hm.oMouth.visible = om; Hm.teeth.visible = !!(o.bite || gn > 0);
    Hm.oMouth.scale.copy(Hm.oMouth.base).multiplyScalar(gn > 0 || o.bite ? 1.6 : 1);
    Hm.root.scale.setScalar(o.sc || 1);
    if (K3.aimEyes) { Hm.root.updateMatrixWorld(true); K3.aimEyes(Hm.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .5); }
  }
  function at(Hm, x, y, z, ry, t, o) { Hm.root.visible = true; Hm.root.position.set(x, y, z); Hm.root.rotation.set(0, ry || 0, 0); poseHam(Hm, t, o); }

  // ---------- Wohnzimmer (aus dem Weck-Video) ----------
  let winDay, winNight;
  function makeRoom() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#c98f5a"; c.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#bf8550" : "#d19a66"; c.fillRect(0, i * h / 8, w, h / 8 - 3); c.fillStyle = "#a8743f"; c.fillRect(((i * 97) % w), i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(8, 8);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    r.add(mesh(BOX, M(0x9fd3c7, { roughness: .9 }), 0, 2.5, -3, 30, 5, .2));
    r.add(mesh(BOX, M(0xffffff, { roughness: .6 }), 0, .08, -2.88, 30, .16, .06));
    const fr = M(0xffffff, { roughness: .5 }); const wx = -.2, wy = 2.2;
    r.add(mesh(BOX, fr, wx, wy, -2.88, 1.9, 1.5, .08));
    const dayTex = canvasTex(256, 200, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#5fb8ff"); gr.addColorStop(1, "#bfe6ff"); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(w * .68, h * .35, 34, 0, 7); c.fill(); c.fillStyle = "#ffffff"; c.beginPath(); c.ellipse(w * .28, h * .55, 50, 18, 0, 0, 7); c.fill(); });
    const nightTex = canvasTex(256, 200, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#1b2260"); gr.addColorStop(1, "#5a4a9a"); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.fillStyle = "#fff4c2"; c.beginPath(); c.arc(w * .66, h * .36, 30, 0, 7); c.fill(); c.fillStyle = "#3a3f8c"; c.beginPath(); c.arc(w * .66 + 14, h * .32, 26, 0, 7); c.fill();
      c.fillStyle = "#ffffff"; for (let i = 0; i < 14; i++) { c.beginPath(); c.arc((i * 71) % w, (i * 37) % (h * .8), 2, 0, 7); c.fill(); } });
    winDay = new T.Mesh(new T.PlaneGeometry(1.7, 1.3), new T.MeshBasicMaterial({ map: dayTex })); winDay.position.set(wx, wy, -2.83); r.add(winDay);
    winNight = new T.Mesh(new T.PlaneGeometry(1.7, 1.3), new T.MeshBasicMaterial({ map: nightTex })); winNight.position.set(wx, wy, -2.83); r.add(winNight);
    r.add(mesh(BOX, fr, wx, wy, -2.8, .06, 1.3, .04)); r.add(mesh(BOX, fr, wx, wy, -2.8, 1.7, .06, .04));
    for (const s of [-1, 1]) r.add(mesh(BOX, M(0xe5484d, { roughness: 1 }), wx + s * 1.15, 2.2, -2.78, .35, 1.8, .06));
    const rug = new T.Mesh(new T.CircleGeometry(1.6, 40), M(0xffd23f, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(-.3, .006, .3); rug.scale.set(1.6, 1, 1); rug.receiveShadow = true; r.add(rug);
    const pot = new T.Group(); pot.position.set(2.3, 0, -2.2); r.add(pot); pot.add(mesh(new T.CylinderGeometry(.25, .2, .45, 24), M(0xe0603c, { roughness: .7 }), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const lf = sph(M(0x36b37e, { roughness: .8 }), Math.cos(i * .9) * .2, .7 + (i % 3) * .2, Math.sin(i * .9) * .2, .12, .35, .06); lf.rotation.z = Math.cos(i * .9) * .5; lf.rotation.x = Math.sin(i * .9) * .5; pot.add(lf); }
    // Stehlampe (warmes Licht für die Nachtszenen)
    const lamp = new T.Group(); lamp.position.set(-1.9, 0, -1.6); r.add(lamp); const dk = M(0x2a2e40, { roughness: .4 });
    lamp.add(mesh(CYL, dk, 0, .02, 0, .25, .04, .25)); lamp.add(mesh(CYL, dk, 0, .9, 0, .025, 1.8, .025));
    lamp.add(mesh(new T.CylinderGeometry(.18, .3, .35, 28, 1, true), M(0xffe2a8, { emissive: 0xffc870, emissiveIntensity: .8, side: T.DoubleSide }), 0, 1.85, 0));
    const pl = new T.PointLight(0xffc27a, 0, 7); pl.position.set(-1.9, 1.7, -1.6); r.add(pl); r.userData.lampLight = pl;
    return r;
  }
  function setDay(day) { winDay.visible = day; winNight.visible = !day; K3.hemi.intensity = day ? .85 : .62; room.userData.lampLight.intensity = day ? 0 : 1.4;
    const bg = day ? 0xf3e7d3 : 0x2a2e5a; K3.scene.background = new T.Color(bg).convertSRGBToLinear(); K3.scene.fog = new T.Fog(bg, 16, 40); }
  const TY = .75;
  function makeTable() { const root = new T.Group(); const w = M(0x8a5a3c, { roughness: .6 }), wl = M(0x6e4630, { roughness: .6 });
    root.add(mesh(BOX, w, 0, TY - .04, 0, 1.7, .08, .9)); root.add(mesh(BOX, wl, 0, TY / 2, -.05, 1.6, TY - .1, .75));
    for (const s of [-1, 1]) root.add(sph(M(0xffd23f, { metalness: .6, roughness: .3 }), s * .4, TY / 2, .33, .03));
    return { root }; }
  // ---------- Käfig mit Gitter rundum (vorn weite Stäbe, damit das Gesicht frei bleibt), Napf mit Körnerberg ----------
  const CW = 1.45, CD = .85, CH = .62;
  function makeCage(Wd, Dp, Hh) { const root = new T.Group(); const tray = M(0x2f6fd0, { roughness: .45 }), wire = M(0xe8edf2, { metalness: .6, roughness: .3 }); const TH = .16;
    root.add(mesh(BOX, tray, 0, TH / 2, 0, Wd, TH, Dp)); const bed = M(0xfff4dc, { roughness: 1 }); root.add(mesh(BOX, bed, 0, TH + .005, 0, Wd - .06, .02, Dp - .06));
    for (let i = 0; i < 16; i++) { const s = sph(bed, -Wd / 2 + .1 + (i * .37) % (Wd - .2), TH + .02, -Dp / 2 + .1 + (i * .23) % (Dp - .2), .06, .025, .05); s.castShadow = false; root.add(s); }
    const bar = (x, z, r) => { const b = mesh(CYL, wire, x, TH + Hh / 2, z, r, Hh, r); b.castShadow = false; root.add(b); return b; };
    const n = Math.round(Wd / .09); for (let i = 0; i <= n; i++) bar(-Wd / 2 + i * Wd / n, -Dp / 2 + .01, .007);
    for (const s of [-1, 1]) for (let i = 0; i <= Math.round(Dp / .09); i++) bar(s * (Wd / 2 - .01), -Dp / 2 + i * Dp / Math.round(Dp / .09), .007);
    const nf = 10, front = []; for (let i = 0; i <= nf; i++) front.push(bar(-Wd / 2 + i * Wd / nf, Dp / 2 - .01, .009));
    { const y = TH + Hh; for (const z of [-Dp / 2, Dp / 2]) root.add(mesh(BOX, wire, 0, y, z, Wd, .02, .02)); for (const s of [-1, 1]) root.add(mesh(BOX, wire, s * Wd / 2, y, 0, .02, .02, Dp)); }
    // Napf hinten links, Körnerberg wächst mit setFood(0..1)
    const bowl = new T.Group(); bowl.position.set(-.42, TH + .01, -.18); root.add(bowl);
    bowl.add(mesh(new T.CylinderGeometry(.15, .12, .07, 28), M(0xe5484d, { roughness: .35 }), 0, .035, 0)); bowl.add(mesh(new T.CylinderGeometry(.12, .12, .01, 28), M(0x8a2a2a), 0, .072, 0));
    const seeds = []; const sd = M(0x3a3434, { roughness: .6 }), sg = M(0x9a8f80, { roughness: .6 }), cr = M(0xe8c070, { roughness: .7 }), gr = M(0x6fbf4a, { roughness: .7 });
    for (let i = 0; i < 70; i++) { const a = i * 2.4, rr = .015 * Math.sqrt(i) * 1.9, y = .07 + Math.max(0, .2 - rr * 1.1) * (i / 70) + .01;
      const s = sph([sd, sg, cr, gr][i % 4], Math.cos(a) * rr, y, Math.sin(a) * rr, .028, .015, .018); s.rotation.set(i, i * .7, i * 1.3); s.castShadow = false; bowl.add(s); seeds.push(s); }
    return { root, floor: TH + .02, TH, front, bowl, seeds, frontZ: Dp / 2 - .01 }; }
  function setFood(c, f) { const n = c.seeds.length; c.seeds.forEach((s, i) => s.visible = i < 8 + f * (n - 8)); }
  // Futtertüte mit Aufschrift
  function makeBag() { const root = new T.Group(); const lab = canvasTex(256, 320, (c, w, h) => { c.fillStyle = "#f2c14e"; c.fillRect(0, 0, w, h); c.fillStyle = "#e5484d"; c.fillRect(0, h * .3, w, h * .32);
      c.fillStyle = "#ffffff"; c.font = '900 56px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(L("FOOD", "FUTTER"), w / 2, h * .46); c.fillStyle = "#8a5a3c"; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(50 + i * 40, h * .8, 12, 7, i, 0, 7); c.fill(); } });
    root.add(mesh(BOX, M(0xf2c14e, { roughness: .8 }), 0, 0, 0, .26, .34, .12));
    const p = new T.Mesh(new T.PlaneGeometry(.24, .3), new T.MeshStandardMaterial({ map: lab, roughness: .8 })); p.position.set(0, 0, .065); root.add(p);
    const p2 = p.clone(); p2.position.z = -.065; p2.rotation.y = PI; root.add(p2);
    return { root }; }
  // Nagestab: helles Holzstück mit Rinde und rotem Schleifchen
  function makeStick() { const root = new T.Group(); const s = mesh(new T.CylinderGeometry(.03, .032, .42, 16), M(0xdcb07a, { roughness: .8 }), 0, 0, 0); s.rotation.z = PI / 2; root.add(s);
    for (const x of [-.12, .05, .16]) { const k = mesh(new T.TorusGeometry(.031, .006, 6, 16), M(0x8a5a3c), x, 0, 0); k.rotation.y = PI / 2; root.add(k); }
    for (const s2 of [-1, 1]) root.add(sph(M(0xe5484d, { roughness: .5 }), -.02, .03, s2 * .025, .02, .035, .02)); root.add(sph(M(0xe5484d), -.02, .03, 0, .015));
    return { root }; }
  // Terrarium mit tiefer Einstreu: Querschnitt vorn zeigt Tunnel + Kammer
  const TW = 1.5, TD = .75, BED = .5;
  function makeTerra() { const root = new T.Group(); const glassFr = M(0xffffff, { roughness: .4 }); const TH = .04;
    root.add(mesh(BOX, M(0x3a3f55, { roughness: .5 }), 0, TH / 2, 0, TW + .04, TH, TD + .04));
    const bedM = M(0xf5e6c4, { roughness: 1 }); root.add(mesh(BOX, bedM, 0, TH + BED / 2, -.01, TW - .04, BED, TD - .06));
    const sec = canvasTex(512, 180, (c, w, h) => { c.fillStyle = "#f2deb4"; c.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) { c.fillStyle = ["#e6cc98", "#fff2d6", "#d9b97e", "#c9a46a"][i % 4]; c.save(); c.translate((i * 197) % w, (i * 71) % h); c.rotate(i); c.fillRect(-7, -2, 14, 4); c.restore(); }
      c.fillStyle = "#b98a56"; for (let i = 0; i < 40; i++) { c.fillRect((i * 131) % w, (i * 53) % h, 18, 2); } // Heu
      c.strokeStyle = "#6e4a2a"; c.lineWidth = 26; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(w * .18, 0); c.lineTo(w * .2, h * .35); c.quadraticCurveTo(w * .26, h * .72, w * .5, h * .72); c.lineTo(w * .62, h * .7); c.stroke();
      c.beginPath(); c.moveTo(w * .66, h * .66); c.quadraticCurveTo(w * .82, h * .5, w * .86, h * .2); c.stroke();
      c.fillStyle = "#5a3a20"; c.beginPath(); c.ellipse(w * .68, h * .68, 66, 46, 0, 0, 7); c.fill();
      c.fillStyle = "#fff4dc"; c.beginPath(); c.ellipse(w * .68, h * .8, 56, 16, 0, 0, 7); c.fill(); });
    const front = new T.Mesh(new T.PlaneGeometry(TW - .04, BED), new T.MeshStandardMaterial({ map: sec, roughness: 1 })); front.position.set(0, TH + BED / 2, TD / 2 - .039); root.add(front);
    // Rahmen + Glas oben (Glas nur dezent an den Seiten, vorn offen, damit nichts die Augen verdeckt)
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) root.add(mesh(BOX, glassFr, x * TW / 2, .45, z * TD / 2, .03, .9, .03));
    for (const z of [-1, 1]) root.add(mesh(BOX, glassFr, 0, .9, z * TD / 2, TW, .03, .03)); for (const x of [-1, 1]) root.add(mesh(BOX, glassFr, x * TW / 2, .9, 0, .03, .03, TD));
    const glass = new T.MeshStandardMaterial({ color: 0xcfe9ff, transparent: true, opacity: .16, roughness: .05, depthWrite: false });
    const back = new T.Mesh(new T.PlaneGeometry(TW, .9), glass); back.position.set(0, .45, -TD / 2); root.add(back);
    for (const s of [-1, 1]) { const sd = new T.Mesh(new T.PlaneGeometry(TD, .9), glass); sd.rotation.y = PI / 2; sd.position.set(s * TW / 2, .45, 0); root.add(sd); }
    // Laufrad oben auf einer Plattform hinten rechts
    root.add(mesh(BOX, M(0xd8a86c, { roughness: .7 }), .5, TH + BED + .02, -.2, .4, .04, .3));
    const wheel = mesh(new T.TorusGeometry(.17, .025, 10, 36), M(0x36b37e, { roughness: .4 }), .5, TH + BED + .22, -.2); root.add(wheel);
    root.add(mesh(BOX, M(0x36b37e, { roughness: .4 }), .5, TH + BED + .12, -.2, .04, .2, .04));
    return { root, TH }; }
  // Ohrstöpsel (orange Schaumstoff) an Rudis Kopf
  function makePlugs() { const gp = new T.Group(); for (const s of [-1, 1]) { const p = mesh(new T.CylinderGeometry(.045, .055, .13, 20), M(0xff8a1f, { roughness: .9 }), -.02, -.01, s * .31); p.rotation.x = PI / 2; gp.add(p); } return gp; }

  K3.onBuild(() => {
    rudi = K3.rudi; ham = actor(makeHamster(0xe9a25a, 0xc9803c), "Hamster");
    table = actor(makeTable(), "Anrichte"); cage = actor(makeCage(CW, CD, CH), "Kaefig"); bag = actor(makeBag(), "Futtertuete"); stick = actor(makeStick(), "Nagestab"); terra = actor(makeTerra(), "Terrarium");
    for (const a of [table, cage, bag, stick, terra]) a.noCheck = true;
    plugs = actor({ root: makePlugs() }, "Ohrstoepsel"); plugs.noCheck = true;
    room = makeRoom();
  });
  function reset() { ham.noCheck = false; rudi.noCheck = false; rudi.root.visible = false; ham.root.rotation.set(0, 0, 0); setFood(cage, 0); }
  function inRoom(day) { begin("yard"); K3.yard.visible = false; room.visible = true; setDay(day !== false); reset(); }
  function studio() { begin("studio"); room.visible = false; reset(); }
  const CX = .35, CZ = -.35;
  function cageScene() { place(table, CX, CZ, 0); place(cage, CX, CZ, 0); cage.root.position.y = TY; }
  const floorY = () => TY + cage.TH + .02;
  const barZ = () => CZ + cage.frontZ;
  // Hamster aufgerichtet am vorderen Gitter, Mund genau am Stab bx (Welt-x)
  function gnawAt(bx, t, o) { o = Object.assign({ rear: 1.05, gnaw: 1, sc: .9 }, o || {});
    const o0 = Object.assign({}, o, { gnaw: 0 }); at(ham, bx, floorY(), barZ() - .25, -PI / 2, t, o0); ham.noCheck = true; ham.root.updateMatrixWorld(true);
    const m = ham.head.localToWorld(V(.2, -.05, 0)); ham.root.position.x += bx - m.x; ham.root.position.z += barZ() - .018 - m.z; ham.root.updateMatrixWorld(true);
    const m0 = ham.head.localToWorld(V(.2, -.05, 0)); poseHam(ham, t, o); return m0; }
  const faceFrame = (m, r) => FR(m.x - r, m.y - r * 1.1, m.z - r * .6, m.x + r, m.y + r * .9, m.z + .05);
  // 2D-Helfer
  function chips(t, x, y, a, n) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); n = n || 10; for (let i = 0; i < n; i++) { const q = (t * 1.6 + i / n) % 1, an = -PI / 2 + (i - n / 2) * .35 + Math.sin(i * 7) * .2; const d = 30 + q * 220;
      g.globalAlpha = a * (1 - q); g.fillStyle = i % 3 ? "#e8edf2" : "#ffd23f"; g.save(); g.translate(x + Math.cos(an) * d, y + Math.sin(an) * d + q * q * 200); g.rotate(i + t * 8); g.fillRect(-9, -3, 18, 6); g.restore(); } g.restore(); }
  function sfxTxt(s, x, y, a, size, rot) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.translate(x, y); g.rotate(rot || -.12); g.font = `900 ${size || 58}px "Montserrat"`; g.textAlign = "center"; g.textBaseline = "middle";
    g.lineWidth = 12; g.strokeStyle = "#1d2250"; g.strokeText(s, 0, 0); g.fillStyle = "#ffffff"; g.fillText(s, 0, 0); g.restore(); }
  function burst(x, y, r, a, col) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.strokeStyle = col || "#ffffff"; g.lineWidth = 10; g.lineCap = "round";
    for (let i = 0; i < 10; i++) { const an = i / 10 * 2 * PI; g.beginPath(); g.moveTo(x + Math.cos(an) * r, y + Math.sin(an) * r); g.lineTo(x + Math.cos(an) * (r + 60), y + Math.sin(an) * (r + 60)); g.stroke(); } g.restore(); }
  function clock(x, y, a, txt12) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "#ffffff"; g.beginPath(); g.arc(x, y, 70, 0, 7); g.fill(); g.strokeStyle = "#1d2250"; g.lineWidth = 8; g.stroke();
    g.lineCap = "round"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 40, y); g.stroke(); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 50); g.stroke(); g.fillStyle = "#e5484d"; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill();
    g.font = '900 38px "Montserrat"'; g.textAlign = "center"; g.fillStyle = "#ffffff"; g.strokeStyle = "#1d2250"; g.lineWidth = 8; g.strokeText(txt12, x, y + 115); g.fillText(txt12, x, y + 115); g.restore(); }
  // Suchscheinwerfer (2D-Lichtkegel von oben links, schwenkt)
  function searchlight(t, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter"; const x0 = W * .05, y0 = -40, an = PI * .32 + Math.sin(t * 2.2) * .28;
    const gr = g.createRadialGradient(x0, y0, 0, x0, y0, H * .9); gr.addColorStop(0, `rgba(255,248,200,${.55 * a})`); gr.addColorStop(1, "rgba(255,248,200,0)"); g.fillStyle = gr;
    g.beginPath(); g.moveTo(x0, y0); g.arc(x0, y0, H * .9, an - .14, an + .14); g.closePath(); g.fill(); g.restore(); }

  // ---------- Shots ----------
  // 0 Hook: Hamster beißt ins Gitter, schaut in die Kamera, Späne, KRRK, Stempel AUSBRUCH?! ab Bild 1, schneller Zoom
  KZ.shot("gHook", (lt, d, t) => { inRoom(false); const ph = lt / d; cageScene();
    const m = gnawAt(CX, t, { gnaw: 1 }); const zk = sm(clamp(lt / .7, 0, 1));
    frameOn([faceFrame(m, .3)], { az: lerp(.3, .1, zk), el: lerp(.26, .1, zk), fill: lerp(.72, 1.0, zk) + ph * .05, dy: .02, t }); draw();
    const [mx, my] = scr(m); chips(t, mx, my, clamp((lt - .2) / .2, 0, 1), 12); if (lt > .35) burst(mx, my, 90, clamp(1 - (lt - .35) / .5, 0, 1) * .9, "#ffd23f");
    if (lt > .25) sfxTxt("KRRK!", W * .66, H * .34 + Math.sin(t * 30) * 6, clamp((lt - .25) / .1, 0, 1) * (.6 + .4 * Math.abs(Math.sin(t * 9))), 64, .14);
    stamp(L("ESCAPE?!", "AUSBRUCH?!"), W * .42, H * .62, .2 + lt / .2, "#e5484d", -.07); });
  // 1 Knast: Käfig in der Nacht, Suchscheinwerfer schwenkt, Häftling Nr. 7 nagt
  KZ.shot("gJail", (lt, d, t) => { inRoom(false); const ph = lt / d, k = sm(ph); cageScene();
    const m = gnawAt(CX + .145, t, { gnaw: 1 });
    frameOn([FR(CX - .75, TY - .1, CZ - .4, CX + .75, TY + .85, CZ + .45)], { az: lerp(-.35, -.12, k), el: lerp(.3, .2, k), fill: lerp(.95, 1.08, k), t }); draw();
    searchlight(t, clamp(lt / .2, 0, 1));
    const [mx, my] = scr(m); chips(t, mx, my, .8, 8);
    stamp(L("INMATE #7", "HÄFTLING 7"), W * .42, H * .17, (lt - .1) / .25, "#ff8a1f", .05);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const a = clamp((lt - .3) / .3, 0, 1); g.globalAlpha = a; g.fillStyle = "#1d2250"; g.beginPath(); g.roundRect(mx - 70, my + 70, 140, 64, 12); g.fill(); g.restore();
    txt("NR. 7", mx, my + 102, 36, "#ffffff", { a, w: 900 }); });
  // 2 Rate-Frage: Hamster nagt weiter (halbnah), Kacheln
  KZ.shot("gQuiz", (lt, d, t) => { inRoom(false); const ph = lt / d, k = sm(ph); cageScene();
    const m = gnawAt(CX - .145, t, { gnaw: 1 });
    frameOn([faceFrame(m, .45)], { az: lerp(.3, .2, k), el: .2, fill: lerp(.8, .86, k), dy: -.35, t }); draw();
    const [mx, my] = scr(m); chips(t, mx, my, .7, 6);
    quizTiles(W * .42, H * .57, QUIZ(), clamp((lt - .15) / .6, 0, 1), {}); });
  // 3 Rudi schüttet Futter nach, der Berg wächst, Hamster nagt trotzdem
  KZ.shot("gFood", (lt, d, t) => { inRoom(false); const ph = lt / d, k = sm(ph); cageScene(); setFood(cage, sm(clamp((ph - .1) / .6, 0, 1)));
    const m = gnawAt(CX + .29, t, { gnaw: 1 });
    place(rudi, CX - 1.15, CZ + .15, -.1); poseRudi(rudi, t, { arms: [.2, 2.25 + Math.sin(t * 9) * .06], spread: .1, mouth: "smile", lean: -.1 });
    rudi.root.updateMatrixWorld(true); const hp = rudi.arms[1].localToWorld(V(0, -.66, 0)); place(bag, 0, 0, 0); bag.root.position.set(hp.x + .1, hp.y + .05, hp.z); bag.root.rotation.set(0, 0, -2.3);
    frameOn([rudi, cage], { az: lerp(.42, .34, k), el: .16, fill: lerp(.95, 1.02, k), t }); draw();
    bag.root.updateMatrixWorld(true); const [bx, by] = scr(bag.root.localToWorld(V(0, .19, 0))); cage.root.updateMatrixWorld(true); const [px, py] = scr(cage.bowl.localToWorld(V(0, .1, 0)));
    if (ph > .1 && ph < .75) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 14; i++) { const q = (t * 2.5 + i / 14) % 1; g.fillStyle = ["#3a3434", "#9a8f80", "#e8c070"][i % 3];
        g.beginPath(); g.ellipse(lerp(bx, px, q) + Math.sin(i * 5) * 14, lerp(by, py, q * q), 9, 6, i, 0, 7); g.fill(); } g.restore(); }
    stamp(L("HUNGRY?", "HUNGER?"), W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    if (ph > .6) { const [mx, my] = scr(m); sfxTxt("KRRK!", mx + 120, my - 90, clamp((ph - .6) * 6, 0, 1), 50, .15); } });
  // 4 Nagestab liegt unbeachtet daneben, Hamster nagt am Gitter
  KZ.shot("gStick", (lt, d, t) => { inRoom(false); const ph = lt / d, k = sm(ph); cageScene(); setFood(cage, 1);
    const m = gnawAt(CX, t, { gnaw: 1 });
    place(stick, 0, 0, 0); stick.root.position.set(CX - .26, floorY() + .03, barZ() - .16); stick.root.rotation.set(0, .5, 0); stick.root.scale.setScalar(1.4);
    frameOn([faceFrame(m, .4), FR(CX - .5, floorY(), barZ() - .3, CX - .05, floorY() + .1, barZ())], { az: lerp(.55, .38, k), el: lerp(.32, .26, k), fill: lerp(.85, .95, k), t }); draw();
    stick.root.updateMatrixWorld(true); const [sx, sy] = scr(stick.root.localToWorld(V(0, .08, 0)));
    stamp(L("TEETH?", "ZÄHNE?"), W * .42, H * .17, (lt - .1) / .3, "#2f9bff", .05);
    if (ph > .35) sfxTxt("?", sx, sy - 70 - Math.sin(t * 5) * 8, clamp((ph - .35) * 5, 0, 1), 90, 0);
    const [mx, my] = scr(m); chips(t, mx, my, .8, 8); });
  // 5 Drei Uhr nachts: Rudi mit Ohrstöpseln, Hamster nagt im Hintergrund weiter
  KZ.shot("gEar", (lt, d, t) => { inRoom(false); const ph = lt / d, k = sm(ph); cageScene(); setFood(cage, 1);
    const m = gnawAt(CX + .145, t, { gnaw: 1 });
    place(rudi, CX - 1.0, CZ + .55, .25); poseRudi(rudi, t, { arms: [.1, .1], spread: .05, mouth: "o", lean: 0, nod: -.05 }); rudi.root.updateMatrixWorld(true); rudi.head.matrixWorld.decompose(plugs.root.position, plugs.root.quaternion, plugs.root.scale); plugs.root.visible = lt > .25;
    const hw = rudi.head.localToWorld(V(0, 0, 0));
    frameOn([FR(hw.x - .35, hw.y - .9, hw.z - .4, hw.x + .35, hw.y + .45, hw.z + .4), cage], { az: lerp(.75, .62, k), el: .12, fill: lerp(.9, .96, k), t }); draw();
    clock(W * .2, H * .2, clamp(lt / .25, 0, 1), "03:00");
    const [mx, my] = scr(m); sfxTxt("KRRK!", mx + 30, my - 110, .5 + .5 * Math.abs(Math.sin(t * 8)), 46, .1);
    stamp(L("QUIET!", "RUHE!"), W * .55, H * .17, (lt - .3) / .3, "#7a5cff", -.06); });
  // 6 Auflösung: Kacheln B grün, dann Erdquerschnitt Wildbau mit Tiefenlineal, Hamster im Studio
  KZ.shot("gWild", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(ham, 0, 0, 0, -.5, t, { sc: 1.1, up: .1, o: ph > .5 });
    frameOn([FR(-.35, 0, -.3, .35, .5, .3)], { az: lerp(.45, .35, k), el: .14, fill: lerp(.62, .68, k), dy: .3, t }); draw();
    if (ph < .42) quizTiles(W * .42, H * .25, QUIZ(), 1, { reveal: sm(clamp((lt - .1) / .4, 0, 1)), correct: 1 });
    else { const a = sm(clamp((ph - .42) / .12, 0, 1)), x0 = W * .42 - 330, y0 = H * .09, w = 660, h = 520;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a;
      g.fillStyle = "#8a5a3c"; g.beginPath(); g.roundRect(x0, y0, w, h, 26); g.fill(); g.fillStyle = "#6fbf4a"; g.beginPath(); g.roundRect(x0, y0, w, 44, [26, 26, 0, 0]); g.fill();
      g.fillStyle = "#a0714c"; for (let i = 0; i < 26; i++) { g.beginPath(); g.ellipse(x0 + 40 + (i * 137) % (w - 80), y0 + 80 + (i * 89) % (h - 110), 12, 7, i, 0, 7); g.fill(); }
      const dig = sm(clamp((ph - .45) / .35, 0, 1)); g.strokeStyle = "#3e2a1a"; g.lineWidth = 34; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(x0 + 230, y0 + 40);
      const ty = y0 + 40 + (h - 140) * dig; g.lineTo(x0 + 230, Math.min(ty, y0 + 220)); if (dig > .35) g.quadraticCurveTo(x0 + 240, ty, x0 + 330, ty); g.stroke();
      g.fillStyle = "#3e2a1a"; if (dig > .9) { g.beginPath(); g.ellipse(x0 + 390, ty, 80, 52, 0, 0, 7); g.fill(); g.fillStyle = "#e9a25a"; g.beginPath(); g.ellipse(x0 + 392, ty + 10, 44, 28, 0, 0, 7); g.fill();
        g.fillStyle = "#1a0c08"; g.beginPath(); g.arc(x0 + 420, ty + 2, 5, 0, 7); g.fill(); }
      // Lineal rechts
      const rx = x0 + w - 70; g.strokeStyle = "#ffffff"; g.lineWidth = 6; g.beginPath(); g.moveTo(rx, y0 + 44); g.lineTo(rx, y0 + h - 30); g.stroke();
      for (let i = 0; i <= 5; i++) { const yy = y0 + 44 + i * (h - 74) / 5; g.beginPath(); g.moveTo(rx - 16, yy); g.lineTo(rx + 16, yy); g.stroke(); } g.restore();
      txt("0", rx - 44, y0 + 50, 30, "#ffffff", { a, w: 900 }); txt(L("1 m", "1 m"), rx - 54, y0 + h - 34, 36, "#ffd23f", { a, w: 900, stroke: 7 });
      stamp(L("OVER 1 M!", "ÜBER 1 M!"), W * .42, H * .1 + h + 20, (ph - .6) * d / .3, "#36b37e", -.05);
      txt(L("Source: Univ. of Halle", "Quelle: Uni Halle"), W * .42, H * .655, 34, "#ffffff", { stroke: 8, a }); } });
  // 7 Studie Uni Bern: Balken Gitternagen bei 10 / 40 / 80 cm Einstreu, Hamster zufrieden
  KZ.shot("gStudy", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(ham, 0, 0, 0, -.45, t, { sc: 1.1, up: .15 });
    frameOn([FR(-.35, 0, -.3, .35, .5, .3)], { az: lerp(.4, .3, k), el: .14, fill: lerp(.6, .66, k), dy: .3, t }); draw();
    const a = clamp(lt / .25, 0, 1), cx = W * .42, base = H * .4, bw = 150, gap = 60, vals = [1, .3, 0], cols = ["#e5484d", "#ffb800", "#36b37e"], labs = ["10 cm", "40 cm", "80 cm"];
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.roundRect(cx - 330, H * .1, 660, base - H * .1 + 90, 26); g.fill(); g.restore();
    txt(L("BAR CHEWING", "GITTER-NAGEN"), cx, H * .13, 44, "#ffffff", { a, w: 900, stroke: 8 });
    for (let i = 0; i < 3; i++) { const x = cx + (i - 1) * (bw + gap), gr = sm(clamp((ph - .1 - i * .12) / .3, 0, 1)), hh = vals[i] * (base - H * .17) * gr;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = cols[i]; g.beginPath(); g.roundRect(x - bw / 2, base - hh - 6, bw, hh + 6, 14); g.fill(); g.restore();
      txt(L(["10 cm bedding","40 cm","80 cm"][i], ["10 cm Streu","40 cm","80 cm"][i]), x, base + 40, 34, "#ffffff", { a, w: 900 }); if (i === 2 && gr > .5) txt("0", x, base - 50, 80, "#36b37e", { a: clamp((gr - .5) * 3, 0, 1), w: 900, stroke: 10 }); }
    txt(L("Source: Univ. of Bern, 2006", "Quelle: Uni Bern, 2006"), W * .42, H * .655, 34, "#ffffff", { stroke: 8, a: clamp((ph - .2) * 4, 0, 1) }); });
  // 8 Tipp: Terrarium mit 40 cm Einstreu im Querschnitt, Hamster sitzt in seiner Kammer, Lineal 40 cm
  KZ.shot("gTip", (lt, d, t) => { inRoom(true); const ph = lt / d, k = sm(ph); place(table, CX, CZ, 0); place(terra, CX, CZ, 0); terra.root.position.y = TY;
    const cy = TY + terra.TH + BED * .25; at(ham, CX + TW * .18, cy - .09, CZ + TD / 2 - .1, -.35, t, { sc: .62, up: .05, o: Math.sin(t * 3) > .6 }); ham.noCheck = true;
    frameOn([FR(CX - TW / 2, TY, CZ - TD / 2, CX + TW / 2, TY + .95, CZ + TD / 2)], { az: lerp(.2, .1, k), el: lerp(.22, .16, k), fill: lerp(.9, 1.0, k), t }); draw();
    terra.root.updateMatrixWorld(true); const [x1, y1] = scr(V(CX - TW / 2 - .02, TY + terra.TH, CZ + TD / 2)); const [x2, y2] = scr(V(CX - TW / 2 - .02, TY + terra.TH + BED, CZ + TD / 2));
    const a = clamp((lt - .15) / .3, 0, 1); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.strokeStyle = "#ffd23f"; g.lineWidth = 8; g.lineCap = "round";
    g.beginPath(); g.moveTo(x1 - 30, y1); g.lineTo(x1 - 46, y1); g.lineTo(x2 - 46, y2); g.lineTo(x2 - 30, y2); g.stroke(); g.restore();
    txt(L("40 cm+", "40 cm+"), Math.max(x1 + 4, 120), (y1 + y2) / 2 - 140, 46, "#ffd23f", { a, w: 900, stroke: 9 });
    stamp(L("DIG ZONE ✓", "BUDDELN ✓"), W * .42, H * .17, (lt - .3) / .3, "#36b37e", -.05);
    txt(L("Sources: Univ. of Bern, Vet Record", "Quellen: Uni Bern, Vet Record"), W * .42, H * .655, 34, "#ffffff", { stroke: 8, a: clamp((ph - .2) * 4, 0, 1) }); });
  // 9 Loop: Hook-Einstellung, Kamera fährt wieder ran, Stempel kommt am Ende
  KZ.shot("gLoop", (lt, d, t) => { inRoom(false); const ph = lt / d; cageScene(); setFood(cage, 0);
    const m = gnawAt(CX, t, { gnaw: 1 }); const zk = sm(ph);
    frameOn([faceFrame(m, .3)], { az: lerp(.7, .3, zk), el: lerp(.45, .26, zk), fill: lerp(.45, .72, zk), dy: .02, t }); draw();
    const [mx, my] = scr(m); chips(t, mx, my, .7, 8);
    if (ph > .55) sfxTxt("KRRK!", W * .66, H * .34, clamp((ph - .55) * 5, 0, 1), 58, .14); });

  window.__hamsterBars = true;
})();
