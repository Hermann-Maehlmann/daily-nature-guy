// 3D-Szene "Why You Should Never Wake Your Hamster" / "Warum du deinen Hamster tagsüber nie wecken solltest" (24.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Opener-Stil "du-pov": Riesenhand reißt das Dach vom Hamsterhaus, danach Froschperspektive aus dem Haus auf den riesigen Rudi.
// Goldhamster aus dem Bade-Video (2026-11-23) übernommen, neu: Augenlider (müde, Pupille bleibt sichtbar), böse Brauen, Sprung.
// Neu: Wohnzimmer (Fenster Tag/Abend), Anrichte, Käfig mit Holzhaus und abnehmbarem Dach, Riesenhand, Trompete, Fernseher.
// Quellen: RSPCA "Hamsters should not be handled when they are resting or sleeping unless absolutely necessary, as they can find this stressful",
// RSPCA: ultrasound from "televisions, computer screens, vacuum cleaners", PDSA: "never when they're sleeping as they're likely to be scared and bite you",
// University of Bristol Vet School (Clinical Skills): surprising them when sleeping "will almost certainly result in you being bitten".
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn, view } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  let ham, rudi, room, table, cage, hand, trumpet, tv;
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  const QUIZ = () => [L("A  TV", "A  Fernseher"), L("B  Houseplant", "B  Zimmerpflanze"), L("C  Rug", "C  Teppich")];

  // ---------- Syrischer Goldhamster ----------
  function makeHamster(col, colD) {
    const cA = new T.Color(col).convertSRGBToLinear(), cDA = new T.Color(colD).convertSRGBToLinear();
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
    // Nagezähne (sichtbar bei offenem Mund)
    const teeth = new T.Group(); head.add(teeth); for (const s of [-1, 1]) teeth.add(mesh(BOX, M(0xfff8e0, { roughness: .4 }), .19, -.045, s * .006, .008, .02, .01)); teeth.visible = false;
    for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.03, .13, s * .095); e.rotation.x = s * .35; head.add(e);
      e.add(sph(fur, 0, 0, 0, .05, .06, .022)); e.add(sph(pink, .006, 0, 0, .036, .045, .016)); }
    // Augen (Look v3) + Lider: Lid = obere Halbkugel in Fellfarbe, dreht vor das Auge (müde), Pupille bleibt unten sichtbar
    const eyeM = M(0x0c0808, { roughness: .08 });
    const eyes = [], lids = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.1, .045, s * .085); e.rotation.y = -s * .55; head.add(e);
      const ey = K3.eye(.042, { white: M(0x3a2014, { roughness: .15 }), pupil: eyeM }); e.add(ey); e.userData.ey = ey; eyes.push(e);
      const lid = new T.Mesh(new T.SphereGeometry(.047, 24, 12, 0, 2 * PI, 0, PI / 2), fur); lid.castShadow = false; e.add(lid); lids.push(lid); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, M(0x3a2216, { roughness: .6 }), .12, .1, s * .085, .015, .016, .075); b.castShadow = false; head.add(b); brows.push(b); }
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .17, -.04 + i * .015, s * .09, .003, .13, .003); w.rotation.x = s * (PI / 2 - .25 + i * .2); w.castShadow = false; head.add(w); }
    // aufgestelltes Fell (Schreck)
    const spikes = new T.Group(); body.add(spikes); for (let i = 0; i < 9; i++) { const sp = mesh(new T.ConeGeometry(.035, .09, 8), furD, -.22 + i * .05, .38 + Math.sin(i * 1.7) * .015, Math.sin(i * 2.3) * .06); sp.rotation.z = -.5 + i * .12; sp.castShadow = false; spikes.add(sp); }
    spikes.visible = false;
    return { root, body, front, rear, legs, head, eyes, lids, cheeks, brows, mouth, oMouth, teeth, spikes, fur, furD, cA, cDA };
  }
  // o: {run, look, up, sc, puff, worry, angry, sleepy (0..1), poof, o, bite, jump, lookAt}
  function poseHam(Hm, t, o) {
    o = o || {}; const run = o.run || 0, sp = o.speed || 22, poof = o.poof || 0, sh = o.shiver || 0;
    Hm.legs.forEach((l, i) => l.rotation.z = Math.sin(t * sp + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .7 * run + (o.jump ? -.6 * o.jump : 0));
    Hm.body.position.y = Math.abs(Math.sin(t * sp)) * .012 * run + Math.sin(t * 3) * .004 * (1 + (o.sleepy || 0) * 2) + (o.jump || 0) * .22;
    Hm.body.position.z = Math.sin(t * 55) * .008 * sh; Hm.body.rotation.x = Math.sin(t * 47) * .04 * sh;
    Hm.head.rotation.set(0, o.look || 0, (o.up || 0) + Math.sin(t * 2.3) * .03);
    Hm.cheeks.forEach((c) => c.scale.copy(c.base).multiplyScalar(1 + (o.puff || 0) * .35));
    Hm.brows.forEach((b, i) => { b.visible = !!(o.worry || o.angry); b.rotation.x = (i ? 1 : -1) * (o.angry ? -.5 : .45); b.position.y = o.angry ? .09 : .1; });
    const om = !!(o.o || o.bite); Hm.mouth.visible = !om; Hm.oMouth.visible = om; Hm.teeth.visible = !!o.bite; Hm.oMouth.scale.copy(Hm.oMouth.base).multiplyScalar(o.bite ? 1.5 : 1);
    // Lider: 1.35 = ganz offen (hinten versteckt), 0 = halb zu (Pupille unten sichtbar)
    const sl = clamp(o.sleepy || 0, 0, 1); Hm.lids.forEach((l) => { l.rotation.set(0, 0, lerp(1.35, .05, sl)); l.visible = sl > .02; });
    const thin = 1 + .55 * poof; Hm.front.scale.set(1 + .2 * poof, thin, thin); Hm.rear.scale.set(1 + .2 * poof, thin, thin);
    Hm.head.scale.setScalar(1 + .22 * poof);
    Hm.spikes.visible = poof > .3; Hm.spikes.scale.setScalar(.7 + poof * .5);
    Hm.root.scale.setScalar(o.sc || 1);
    if (K3.aimEyes) { Hm.root.updateMatrixWorld(true); K3.aimEyes(Hm.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .5); }
  }
  function at(Hm, x, y, z, ry, t, o) { Hm.root.visible = true; Hm.root.position.set(x, y, z); Hm.root.rotation.set(0, ry || 0, 0); poseHam(Hm, t, o); }

  // ---------- Wohnzimmer ----------
  let winDay, winNight;
  function makeRoom() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#c98f5a"; c.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? "#bf8550" : "#d19a66"; c.fillRect(0, i * h / 8, w, h / 8 - 3); c.fillStyle = "#a8743f"; c.fillRect(((i * 97) % w), i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(8, 8);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    r.add(mesh(BOX, M(0x9fd3c7, { roughness: .9 }), 0, 2.5, -3, 30, 5, .2));
    r.add(mesh(BOX, M(0xffffff, { roughness: .6 }), 0, .08, -2.88, 30, .16, .06));
    // Fenster mit Tag/Abend
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
    // Vorhänge
    for (const s of [-1, 1]) r.add(mesh(BOX, M(0xe5484d, { roughness: 1 }), wx + s * 1.15, 2.2, -2.78, .35, 1.8, .06));
    // Teppich
    const rug = new T.Mesh(new T.CircleGeometry(1.6, 40), M(0xffd23f, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(-.3, .006, .3); rug.scale.set(1.6, 1, 1); rug.receiveShadow = true; r.add(rug);
    // Zimmerpflanze rechts hinten
    const pot = new T.Group(); pot.position.set(2.3, 0, -2.2); r.add(pot); pot.add(mesh(new T.CylinderGeometry(.25, .2, .45, 24), M(0xe0603c, { roughness: .7 }), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const lf = sph(M(0x36b37e, { roughness: .8 }), Math.cos(i * .9) * .2, .7 + (i % 3) * .2, Math.sin(i * .9) * .2, .12, .35, .06); lf.rotation.z = Math.cos(i * .9) * .5; lf.rotation.x = Math.sin(i * .9) * .5; pot.add(lf); }
    return r;
  }
  function setDay(day) { winDay.visible = day; winNight.visible = !day; K3.hemi.intensity = day ? .85 : .45;
    const bg = day ? 0xf3e7d3 : 0x2a2e5a; K3.scene.background = new T.Color(bg).convertSRGBToLinear(); K3.scene.fog = new T.Fog(bg, 16, 40); }
  // Anrichte (Käfig steht darauf)
  const TY = .75;
  function makeTable() { const root = new T.Group(); const w = M(0x8a5a3c, { roughness: .6 }), wl = M(0x6e4630, { roughness: .6 });
    root.add(mesh(BOX, w, 0, TY - .04, 0, 1.7, .08, .9)); root.add(mesh(BOX, wl, 0, TY / 2, -.05, 1.6, TY - .1, .75));
    for (const s of [-1, 1]) root.add(sph(M(0xffd23f, { metalness: .6, roughness: .3 }), s * .4, TY / 2, .33, .03));
    return { root }; }
  // ---------- Käfig mit Holzhaus (Dach abnehmbar) ----------
  function makeCage(Wd, Dp, Hh) { const root = new T.Group(); const tray = M(0x2f6fd0, { roughness: .45 }), wire = M(0xe8edf2, { metalness: .6, roughness: .3 }); const TH = .16;
    root.add(mesh(BOX, tray, 0, TH / 2, 0, Wd, TH, Dp)); const bed = M(0xfff4dc, { roughness: 1 }); root.add(mesh(BOX, bed, 0, TH + .005, 0, Wd - .06, .02, Dp - .06));
    for (let i = 0; i < 16; i++) { const s = sph(bed, -Wd / 2 + .1 + (i * .37) % (Wd - .2), TH + .02, -Dp / 2 + .1 + (i * .23) % (Dp - .2), .06, .025, .05); s.castShadow = false; root.add(s); }
    const n = Math.round(Wd / .09); for (let i = 0; i <= n; i++) { const x = -Wd / 2 + i * Wd / n; const b = mesh(CYL, wire, x, TH + Hh / 2, -Dp / 2 + .01, .007, Hh, .007); b.castShadow = false; root.add(b); }
    for (const s of [-1, 1]) for (let i = 0; i <= Math.round(Dp / .09); i++) { const z = -Dp / 2 + i * Dp / Math.round(Dp / .09); const b = mesh(CYL, wire, s * (Wd / 2 - .01), TH + Hh / 2, z, .007, Hh, .007); b.castShadow = false; root.add(b); }
    { const y = TH + Hh; root.add(mesh(BOX, wire, 0, y, -Dp / 2, Wd, .02, .02)); for (const s of [-1, 1]) root.add(mesh(BOX, wire, s * Wd / 2, y, 0, .02, .02, Dp)); }
    // Holzhaus: Rückwand, Seiten, niedrige Front (Hamster sichtbar), Dach als eigene Gruppe
    const HX = -.05, HZ = -.05, hw = .72, hd = .5, hh = .34; const house = new T.Group(); house.position.set(HX, TH, HZ); root.add(house); const wd = M(0xd8a86c, { roughness: .7 }), wdD = M(0xa8743f, { roughness: .7 });
    house.add(mesh(BOX, wd, 0, hh / 2, -hd / 2, hw, hh, .04)); for (const s of [-1, 1]) house.add(mesh(BOX, wd, s * hw / 2, hh / 2, 0, .04, hh, hd)); house.add(mesh(BOX, wd, 0, .05, hd / 2, hw, .1, .04));
    const nest = new T.Group(); house.add(nest); for (let i = 0; i < 10; i++) { const s = sph(M(i % 2 ? 0xfff4dc : 0xf1dfb8, { roughness: 1 }), Math.cos(i * .63) * .22, .03, Math.sin(i * .63) * .14, .08, .04, .07); s.castShadow = false; nest.add(s); }
    const roof = new T.Group(); roof.position.set(0, hh, 0); house.add(roof);
    roof.add(mesh(BOX, wdD, 0, .025, 0, hw + .1, .05, hd + .1)); roof.add(mesh(BOX, wd, 0, .06, 0, hw - .1, .03, hd - .1));
    return { root, floor: TH + .02, house, roof, HX, HZ, hh, TH }; }
  // Riesenhand: Handfläche, 4 Finger, Daumen, gelber Ärmel (Rudis Regenjacke). Finger zeigen nach +x, Handrücken oben.
  function makeHand() { const root0 = new T.Group(), root = new T.Group(); root0.add(root); const skin = M(0xf3c39d, { roughness: .6 }), yel = M(0xffc928, { roughness: .4 });
    root.add(sph(skin, 0, 0, 0, .2, .07, .17)); const fingers = [];
    for (let i = 0; i < 4; i++) { const f = new T.Group(); f.position.set(.17, 0, -.12 + i * .08); root.add(f); f.add(sph(skin, .09, 0, 0, .11, .036, .036)); fingers.push(f); }
    const th = new T.Group(); th.position.set(.05, -.02, .16); root.add(th); const ts = sph(skin, .07, 0, .03, .08, .035, .035); th.add(ts);
    const sl = mesh(new T.CylinderGeometry(.16, .18, .5, 28), yel, -.38, 0, 0); sl.rotation.z = PI / 2; root.add(sl);
    return { root: root0, inner: root, fingers, th }; }
  function poseHand(Hd, curl) { Hd.fingers.forEach((f) => f.rotation.z = -curl * 1.1); Hd.th.rotation.y = curl * .4; }
  function makeTrumpet() { const root = new T.Group(); const gold = M(0xf2c14e, { metalness: .85, roughness: .25 });
    const tube = mesh(new T.CylinderGeometry(.025, .025, .55, 16), gold, .27, 0, 0); tube.rotation.z = PI / 2; root.add(tube);
    const bell = mesh(new T.CylinderGeometry(.13, .03, .22, 28, 1, true), gold, .6, 0, 0); bell.rotation.z = PI / 2; bell.material.side = T.DoubleSide; root.add(bell);
    const loop = mesh(new T.TorusGeometry(.07, .02, 10, 24), gold, .28, -.06, 0); root.add(loop);
    for (let i = 0; i < 3; i++) root.add(mesh(new T.CylinderGeometry(.018, .018, .1, 12), gold, .2 + i * .06, .06, 0));
    root.add(mesh(new T.CylinderGeometry(.03, .015, .06, 12), gold, -.02, 0, 0)).rotation.z = PI / 2;
    return { root }; }
  function makeTV() { const root = new T.Group(); const dk = M(0x1d2230, { roughness: .4 }), st = M(0x6e4630, { roughness: .6 });
    root.add(mesh(BOX, st, 0, .25, 0, 1.4, .5, .55)); root.add(mesh(BOX, dk, 0, .55, 0, .3, .1, .2));
    root.add(mesh(BOX, dk, 0, 1.05, 0, 1.5, .9, .08));
    const scrTex = canvasTex(256, 160, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#3fa9ff"); gr.addColorStop(1, "#7a5cff"); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.fillStyle = "#ffd23f"; c.beginPath(); c.arc(w * .3, h * .55, 26, 0, 7); c.fill(); c.fillStyle = "#ffffff"; c.fillRect(w * .5, h * .4, 80, 12); c.fillRect(w * .5, h * .58, 60, 12); });
    const sc = new T.Mesh(new T.PlaneGeometry(1.38, .78), new T.MeshBasicMaterial({ map: scrTex })); sc.position.set(0, 1.05, .045); root.add(sc);
    return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; ham = actor(makeHamster(0xe9a25a, 0xc9803c), "Hamster");
    table = actor(makeTable(), "Anrichte"); cage = actor(makeCage(1.45, .85, .62), "Kaefig"); hand = actor(makeHand(), "Hand"); trumpet = actor(makeTrumpet(), "Trompete"); tv = actor(makeTV(), "Fernseher");
    for (const a of [table, cage, hand, trumpet, tv]) a.noCheck = true;
    room = makeRoom();
  });
  function reset() { ham.noCheck = false; rudi.noCheck = false; rudi.root.visible = false; ham.root.rotation.set(0, 0, 0); cage.roof.position.set(0, cage.hh, 0); cage.roof.rotation.set(0, 0, 0); hand.root.scale.setScalar(1); hand.inner.rotation.set(0, 0, 0); }
  function inRoom(day) { begin("yard"); K3.yard.visible = false; room.visible = true; setDay(day !== false); reset(); }
  function studio() { begin("studio"); room.visible = false; reset(); }
  const CX = .35, CZ = -.35; // Käfig auf der Anrichte
  function cageScene() { place(table, CX, CZ, 0); place(cage, CX, CZ, 0); cage.root.position.y = TY; }
  // Welt-Position im Haus (Nest)
  const nestW = () => V(CX + cage.HX, TY + cage.TH + .02, CZ + cage.HZ);
  const hamFrame = (r) => { ham.root.updateMatrixWorld(true); const p = ham.root.position, s = ham.root.scale.x; r = (r || .32) * s; return FR(p.x - r, p.y, p.z - r, p.x + r, p.y + r * 1.3, p.z + r); };
  const houseFrame = () => { const n = nestW(); return FR(n.x - .42, n.y - .05, n.z - .3, n.x + .42, n.y + .45, n.z + .3); };
  // 2D-Helfer
  function zzz(t, x, y, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 3; i++) { const q = (t * .5 + i / 3) % 1; g.globalAlpha = a * Math.sin(q * PI);
      g.font = `900 ${40 + i * 14}px "Montserrat"`; g.fillStyle = "#ffffff"; g.strokeStyle = "#1d2250"; g.lineWidth = 8; g.textAlign = "center"; const xx = x + q * 120 + i * 10, yy = y - q * 200;
      g.strokeText("z", xx, yy); g.fillText("z", xx, yy); } g.restore(); }
  function burst(x, y, r, a, col) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.strokeStyle = col || "#ffffff"; g.lineWidth = 10; g.lineCap = "round";
    for (let i = 0; i < 10; i++) { const an = i / 10 * 2 * PI; g.beginPath(); g.moveTo(x + Math.cos(an) * r, y + Math.sin(an) * r); g.lineTo(x + Math.cos(an) * (r + 60), y + Math.sin(an) * (r + 60)); g.stroke(); } g.restore(); }
  function chips(t, x, y, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 12; i++) { const q = clamp(a, 0, 1), an = -PI / 2 + (i - 5.5) * .22; const d = 60 + q * (180 + (i % 3) * 60);
      g.globalAlpha = (1 - q * .7); g.fillStyle = i % 2 ? "#fff4dc" : "#e8c48e"; g.save(); g.translate(x + Math.cos(an) * d, y + Math.sin(an) * d + q * q * 160); g.rotate(i + t * 6); g.fillRect(-12, -5, 24, 10); g.restore(); } g.restore(); }
  function waves(t, x0, y0, x1, y1, a, col, dots) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const an = Math.atan2(y1 - y0, x1 - x0), D = Math.hypot(x1 - x0, y1 - y0);
    g.translate(x0, y0); g.rotate(an); g.strokeStyle = col || "#ffffff"; g.lineWidth = 9; g.lineCap = "round"; if (dots) g.setLineDash([2, 22]);
    for (let i = 0; i < 4; i++) { const q = (t * 1.2 + i / 4) % 1, r = 30 + q * D; g.globalAlpha = a * Math.sin(q * PI); g.beginPath(); g.arc(0, 0, r, -.45, .45); g.stroke(); } g.restore(); }
  function clock(x, y, a, txt12) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "#ffffff"; g.beginPath(); g.arc(x, y, 70, 0, 7); g.fill(); g.strokeStyle = "#1d2250"; g.lineWidth = 8; g.stroke();
    g.lineCap = "round"; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 50); g.stroke(); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 2, y - 38); g.stroke(); g.fillStyle = "#e5484d"; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill();
    g.font = '900 38px "Montserrat"'; g.textAlign = "center"; g.fillStyle = "#ffffff"; g.strokeStyle = "#1d2250"; g.lineWidth = 8; g.strokeText(txt12, x, y + 115); g.fillText(txt12, x, y + 115); g.restore(); }

  // Dach + Hand: lift 0..1
  function roofLift(lift, t) { const n = nestW(); cage.roof.position.set(-lift * .25, cage.hh + lift * .55, lift * .1); cage.roof.rotation.set(lift * .25, 0, lift * .55);
    cage.root.updateMatrixWorld(true); const rp = cage.roof.localToWorld(V(.38, .05, 0)); place(hand, 0, 0, 0); hand.root.position.set(rp.x + .1, rp.y + .1, rp.z); hand.root.rotation.set(0, PI, -.4 - lift * .2); poseHand(hand, .8); }
  // ---------- Shots ----------
  // 0 Hook: Riesenhand reißt das Dach ab, Hamster schreckt im Nest hoch, Späne fliegen, Stempel MITTAGS?! sofort
  KZ.shot("wHook", (lt, d, t) => { inRoom(true); const ph = lt / d, k = sm(clamp(ph * 1.4, 0, 1)); cageScene();
    const lift = .55 + .45 * sm(clamp(lt / .5, 0, 1)); roofLift(lift, t); const n = nestW(); const jp = Math.abs(Math.sin(clamp(lt / .45, 0, 1) * PI)) * (lt < .9 ? 1 : 0);
    at(ham, n.x + .02, n.y, n.z + .02, -.5, t, { sc: .9, o: true, jump: jp, poof: lerp(.7, .3, k), worry: true, up: .2 }); ham.noCheck = true;
    frameOn([houseFrame()], { az: lerp(.55, .45, k), el: lerp(.55, .45, k), fill: lerp(1.0, 1.12, k), dy: -.05, t }); draw();
    ham.root.updateMatrixWorld(true); const [hx, hy] = scr(ham.root.localToWorld(V(0, .3, 0))); chips(t, hx, hy, clamp(lt / .9, 0, 1)); burst(hx, hy - 40, 150, clamp(1 - lt / .7, 0, 1) * .9);
    stamp(L("AT NOON?!", "MITTAGS?!"), W * .42, H * .62, lt / .25, "#e5484d", -.07); });
  // 1 POV aus dem Haus: riesiger Rudi beugt sich über das offene Haus, Dach in der Hand
  KZ.shot("wPov", (lt, d, t) => { inRoom(true); const ph = lt / d, k = sm(ph); cageScene(); roofLift(1, t); hand.root.visible = false;
    place(rudi, CX + cage.HX - 1.0, CZ + cage.HZ + .05, 0); poseRudi(rudi, t, { arms: [.3, 2.4 + Math.sin(t * 3) * .05], spread: .1, mouth: ph > .5 ? "o" : "smile", lean: -.32, nod: -.25 }); rudi.noCheck = true;
    rudi.root.scale.setScalar(1.25); const n = nestW();
    rudi.root.updateMatrixWorld(true); const hd = rudi.head.localToWorld(V(0, 0, 0)); const cam = V(n.x + .35, n.y + .1, n.z + .3);
    K3.camera.position.set(cam.x + Math.sin(t * .7) * .01, cam.y, cam.z); K3.camera.fov = lerp(66, 58, k); K3.camera.updateProjectionMatrix(); K3.camera.lookAt(hd.x + .15, hd.y - .35, hd.z); draw();
    rudi.root.scale.setScalar(1);
    stamp(L("GIANT!", "RIESE!"), W * .42, H * .62, (lt - .35) / .3, "#ff8a1f", .06); });
  // 2 Rate-Frage: Hamster döst müde im Nest, Zzz, Kacheln
  KZ.shot("wQuiz", (lt, d, t) => { inRoom(true); const ph = lt / d, k = sm(ph); cageScene(); cage.roof.visible = true; roofLift(1, t); hand.root.visible = false; cage.roof.visible = false;
    const n = nestW(); at(ham, n.x, n.y, n.z + .02, -.5, t, { sc: .9, sleepy: .55, up: .05 }); ham.noCheck = true;
    frameOn([houseFrame()], { az: lerp(.5, .4, k), el: .32, fill: lerp(.8, .86, k), dy: -.32, t }); draw();
    cage.roof.visible = true;
    ham.root.updateMatrixWorld(true); const [hx, hy] = scr(ham.root.localToWorld(V(.1, .4, 0))); zzz(t, hx, hy - 40, 1);
    quizTiles(W * .42, H * .57, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 3 Rudi greift mittags in den Käfig (KUSCHELN!) – Schnitt: Nahaufnahme, Hamster beißt in den Finger (AUA!)
  KZ.shot("wBite", (lt, d, t) => { inRoom(true); const ph = lt / d; cageScene(); roofLift(1, t); hand.root.visible = false; cage.roof.visible = false;
    if (ph < .45) { const k = ph / .45; const n = nestW(); at(ham, n.x, n.y, n.z + .02, -.6, t, { sc: .9, sleepy: .5, up: .05 }); ham.noCheck = true;
      place(rudi, CX - 1.25, CZ + .25, -.15); poseRudi(rudi, t, { arms: [.2, lerp(1.2, 1.6, k)], spread: .05, mouth: "smile", lean: -.12 });
      frameOn([rudi, cage], { az: lerp(.45, .38, k), el: .14, fill: lerp(.95, 1.0, k), t }); draw();
      const [sx, sy] = scr(V(CX - .2, 2.4, CZ)); clock(W * .2, H * .2, clamp(lt / .3, 0, 1), "12:00");
      stamp(L("CUDDLE TIME!", "KUSCHELN!"), W * .5, H * .17, (lt - .2) / .3, "#ff6f9f", -.06); }
    else { const k = (ph - .45) / .55, n = nestW(); at(ham, n.x - .05, n.y, n.z + .05, -.25, t, { sc: .9, bite: true, angry: true, poof: .5 + Math.sin(t * 30) * .05, up: .12 });
      ham.root.updateMatrixWorld(true); const mp = ham.head.localToWorld(V(.25, -.05, 0)); place(hand, 0, 0, 0); hand.root.rotation.set(0, 0, -.25); hand.root.position.set(mp.x - .33 * .55, mp.y + .06, mp.z); hand.root.scale.setScalar(.75);
      hand.root.rotation.y = -.25 + PI; hand.root.position.set(mp.x + .33 * .75 * Math.cos(.25), mp.y + .06, mp.z - .33 * .75 * Math.sin(.25)); poseHand(hand, .1 + Math.sin(t * 40) * .05);
      frameOn([hamFrame(.36), FR(mp.x - .05, mp.y - .1, mp.z - .1, mp.x + .35, mp.y + .15, mp.z + .1)], { az: lerp(.3, .22, k), el: .2, fill: lerp(.86, .95, k), t }); draw();
      const [bx, by] = scr(mp); burst(bx, by, 70, clamp(1 - k * 2, 0, 1), "#ffd23f");
      stamp(L("OUCH!", "AUA!"), W * .42, H * .17, (k * d * .55 - .05) / .25, "#e5484d", .07); } });
  // 4 Rudi schleicht "sanft" heran – Schnitt: TRÖÖÖT, Hamster fliegt hoch, Fell gesträubt
  KZ.shot("wTrumpet", (lt, d, t) => { inRoom(true); const ph = lt / d; cageScene(); roofLift(1, t); hand.root.visible = false; cage.roof.visible = false; const n = nestW();
    place(rudi, CX - 1.25, CZ + .25, -.15); const blow = ph > .4;
    poseRudi(rudi, t, { arms: blow ? [.4, 1.45] : [.3, .5 + Math.sin(t * 4) * .1], spread: .05, mouth: blow ? "o" : "smile", lean: blow ? .08 : -.15, walk: blow ? 0 : .25 });
    rudi.root.updateMatrixWorld(true); const mp = rudi.head.localToWorld(V(.35, -.13, 0)); place(trumpet, 0, 0, 0); trumpet.root.position.copy(mp); trumpet.root.rotation.set(0, -.15, -.12); trumpet.root.visible = blow;
    const k = blow ? (ph - .4) / .6 : ph / .4; const jp = blow ? Math.abs(Math.sin(clamp(k * 2.2, 0, 1) * PI)) * 1.3 : 0;
    at(ham, n.x, n.y, n.z + .02, -.45, t, { sc: .9, sleepy: blow ? 0 : .55, o: blow, jump: jp, poof: blow ? sm(clamp(k * 3, 0, 1)) : 0, worry: blow, up: blow ? .2 : .05 }); ham.noCheck = true;
    frameOn([rudi, cage], { az: lerp(.42, .36, sm(ph)), el: .14, fill: lerp(.95, 1.02, sm(ph)), t }); draw();
    if (!blow) { stamp(L("GENTLY…", "SANFT…"), W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.05); ham.root.updateMatrixWorld(true); const [hx, hy] = scr(ham.root.localToWorld(V(.1, .4, 0))); zzz(t, hx, hy - 30, 1); }
    else { trumpet.root.updateMatrixWorld(true); const [x0, y0] = scr(trumpet.root.localToWorld(V(.7, 0, 0))); ham.root.updateMatrixWorld(true); const [x1, y1] = scr(ham.root.localToWorld(V(0, .25, 0)));
      waves(t, x0, y0, x1, y1, 1, "#ffd23f"); stamp(L("TOOOOT!", "TÖRÖÖÖ!"), W * .42, H * .17, (k * d * .6 - .05) / .25, "#7a5cff", .06); } });
  // 5 Infografik: Tag/Nacht-Uhr, Hamster döst (Tag = Schlaf, Nacht = aktiv)
  KZ.shot("wClock", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(ham, 0, 0, 0, -.45, t, { sc: 1.1, sleepy: .55, up: .05 });
    frameOn([hamFrame(.4)], { az: lerp(.45, .35, k), el: .14, fill: lerp(.7, .76, k), dy: .3, t }); draw();
    const x = W * .42, y = H * .24, R = 185, a = clamp(lt / .3, 0, 1);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a;
    g.fillStyle = "#ffd23f"; g.beginPath(); g.moveTo(x, y); g.arc(x, y, R, PI / 2, 3 * PI / 2); g.fill();
    g.fillStyle = "#2a2e7a"; g.beginPath(); g.moveTo(x, y); g.arc(x, y, R, -PI / 2, PI / 2); g.fill();
    g.strokeStyle = "#ffffff"; g.lineWidth = 10; g.beginPath(); g.arc(x, y, R, 0, 7); g.stroke();
    g.fillStyle = "#ff8a1f"; g.beginPath(); g.arc(x - R * .5, y - R * .45, 30, 0, 7); g.fill();
    g.fillStyle = "#fff4c2"; g.beginPath(); g.arc(x + R * .5, y - R * .45, 28, 0, 7); g.fill(); g.fillStyle = "#2a2e7a"; g.beginPath(); g.arc(x + R * .5 + 12, y - R * .5, 24, 0, 7); g.fill();
    const an = lerp(PI * .75, PI * 2.2, sm(clamp((ph - .1) * 1.3, 0, 1))); g.strokeStyle = "#1d2250"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * R * .8, y + Math.sin(an) * R * .8); g.stroke();
    g.fillStyle = "#e5484d"; g.beginPath(); g.arc(x, y, 16, 0, 7); g.fill(); g.restore();
    txt(L("SLEEP", "SCHLAF"), x - R * .48, y + 50, 34, "#1d2250", { a, w: 900 }); txt(L("AWAKE", "WACH"), x + R * .48, y + 50, 34, "#ffffff", { a, w: 900 });
    if (ph > .5) stamp(L("NIGHT SHIFT", "NACHTAKTIV"), W * .42, H * .62, (ph - .5) * d / .3, "#7a5cff", -.06); });
  // 6 Quellenkarte Uni Bristol + Stress-Balken, Hamster böse
  KZ.shot("wVet", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(ham, 0, 0, 0, -.5, t, { sc: 1.1, angry: true, bite: Math.sin(t * 6) > 0, poof: .4 + Math.sin(t * 25) * .04, up: .1 });
    frameOn([hamFrame(.4)], { az: lerp(.5, .4, k), el: .14, fill: lerp(.72, .78, k), dy: -.25, t }); draw();
    const bx = W * .42, by = H * .17, bw = 620, a = clamp(lt / .3, 0, 1), v = lerp(.1, .95, sm(clamp((ph - .05) * 2, 0, 1)));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.roundRect(bx - bw / 2, by - 40, bw, 80, 40); g.fill();
    g.fillStyle = v < .5 ? "#ffb800" : "#e5484d"; g.beginPath(); g.roundRect(bx - bw / 2 + 10, by - 30, (bw - 20) * v, 60, 30); g.fill(); g.restore();
    txt("STRESS", bx, by - 80, 44, "#ffffff", { stroke: 9, a, w: 900 });
    infoCard(W * .42, H * .58, 900, 220, sm((ph - .3) * d / .35), L("University of Bristol, Vet School", "Uni Bristol, Tiermedizin"), "#2f6fd0",
      [L("\"will almost certainly result", "„…wirst du fast sicher"), L("in you being bitten\"", "gebissen“")], 38); });
  // 7 Auflösung: Fernseher sendet Ultraschall (gepunktete Wellen) zum Käfig, Kacheln A grün, dann Stempel
  KZ.shot("wTV", (lt, d, t) => { inRoom(true); const ph = lt / d, k = sm(ph); cageScene(); roofLift(1, t); hand.root.visible = false; cage.roof.visible = false; const n = nestW();
    place(tv, CX - 1.75, CZ - .2, .55);
    at(ham, n.x, n.y, n.z + .02, -.9, t, { sc: .9, worry: true, o: true, poof: .35 + Math.sin(t * 30) * .05, up: .1, lookAt: V(CX - 1.75, 1.0, CZ - .2) }); ham.noCheck = true;
    frameOn([FR(CX - 2.3, .3, CZ - .5, CX + .4, 1.6, CZ + .3)], { az: lerp(.14, .08, k), el: .12, fill: lerp(1.0, 1.08, k), t }); draw();
    tv.root.updateMatrixWorld(true); const [x0, y0] = scr(tv.root.localToWorld(V(0, 1.05, .1))); ham.root.updateMatrixWorld(true); const [x1, y1] = scr(ham.root.localToWorld(V(0, .3, 0)));
    waves(t, x0, y0, x1, y1, 1, "#ffffff", true);
    if (ph < .5) quizTiles(W * .42, H * .5, QUIZ(), 1, { reveal: sm(clamp((lt - .15) / .4, 0, 1)), correct: 0 });
    else stamp(L("ULTRASOUND!", "ULTRASCHALL!"), W * .42, H * .17, (ph - .5) * d / .3, "#2f9bff", -.06);
    txt(L("Source: RSPCA", "Quelle: RSPCA"), W * .42, H * .655, 34, "#ffffff", { stroke: 8, a: clamp((ph - .2) * 4, 0, 1) }); });
  // 8 Tipp: Abend (Mond im Fenster), Rudis offene Hand im Käfig, Hamster kommt selbst drauf
  KZ.shot("wTip", (lt, d, t) => { inRoom(false); const ph = lt / d, k = sm(ph); cageScene(); roofLift(1, t); hand.root.visible = false; cage.roof.visible = false; const n = nestW();
    // offene Hand (Handfläche oben) vorn rechts im Käfig
    place(hand, 0, 0, 0); hand.root.scale.setScalar(.7); hand.inner.rotation.set(PI, 0, 0); hand.root.rotation.set(0, PI, 0); hand.root.position.set(n.x + .6, TY + cage.TH + .1, n.z + .2); poseHand(hand, .15);
    const wk = sm(clamp((ph - .15) / .6, 0, 1)); at(ham, lerp(n.x, n.x + .42, wk), n.y + wk * .05, n.z + .05 + wk * .12, -.3, t, { sc: .8, run: wk > 0 && wk < 1 ? 1 : 0, up: .1, look: .2 }); ham.noCheck = true;
    frameOn([FR(n.x - .35, n.y - .05, n.z - .25, n.x + .8, n.y + .4, n.z + .35)], { az: lerp(.3, .22, k), el: .38, fill: lerp(.92, .98, k), dy: .05, t }); draw();
    clock(W * .2, H * .2, clamp(lt / .3, 0, 1), "20:00");
    if (ph < .55) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(lt / .3, 0, 1) * (.6 + .4 * Math.sin(t * 8)); txt(L("*rustle*", "*raschel*"), W * .62, H * .3, 44, "#ffffff", { stroke: 9, w: 900 }); g.restore(); }
    stamp(L("EVENINGS ✓", "ABENDS ✓"), W * .52, H * .17, (lt - .3) / .3, "#36b37e", -.05);
    txt(L("Sources: RSPCA, PDSA", "Quellen: RSPCA, PDSA"), W * .42, H * .655, 34, "#ffffff", { stroke: 8, a: clamp((ph - .2) * 4, 0, 1) }); });
  // 9 Loop: Hook-Einstellung (Dach geht auf, Hamster schreckt hoch)
  KZ.shot("wLoop", (lt, d, t) => { inRoom(true); const ph = lt / d, k = sm(ph); cageScene();
    const lift = .55 * sm(clamp((ph - .3) / .7, 0, 1)); roofLift(lift, t); const n = nestW();
    at(ham, n.x + .02, n.y, n.z + .02, -.5, t, { sc: .9, sleepy: lerp(.55, .2, sm(clamp((ph - .6) * 3, 0, 1))), worry: ph > .7, up: .1 }); ham.noCheck = true;
    frameOn([houseFrame()], { az: lerp(.62, .55, k), el: lerp(.6, .55, k), fill: lerp(.92, 1.0, k), dy: -.05, t }); draw();
    if (ph < .6) { ham.root.updateMatrixWorld(true); const [hx, hy] = scr(ham.root.localToWorld(V(.1, .4, 0))); zzz(t, hx, hy - 30, 1); }
    if (ph > .45) stamp(L("AT NOON?", "MITTAGS?"), W * .42, H * .62, (ph - .45) * d / .3, "#e5484d", -.06); });

  window.__hamsterWake = true;
})();
