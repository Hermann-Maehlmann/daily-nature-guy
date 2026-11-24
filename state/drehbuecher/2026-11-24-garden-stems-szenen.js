// 3D-Szene "Why You're Evicting Ladybugs Every Fall" / "Warum du im Herbst Marienkäfer rauswirfst" (24.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Siebenpunkt-Marienkäfer "Lotti" (rote Halbkugel-Flügeldecken mit Mittelnaht und 7 schwarzen Punkten, schwarzer Halsschild mit weißen Flecken, 6 Beine, Fühler),
// Mini-Koffer, Stieglitz (rote Gesichtsmaske, schwarze Kappe, weiße Wangen, schwarze Flügel mit gelbem Band), Wildbiene (Mauerbiene, braun-pelzig),
// verblühte Stauden (Karde, vertrocknete Sonnenblume, Gräser) die einzeln abgeschnitten umkippen, Heckenschere, Plastikblumen-Topf,
// aufgeschnittener hohler Halm mit Knoten und Larven-Kammern (Querschnitt), Herbstlaub.
// Opener-Stil "kuendigung": Fristlose Kündigung, Mieterin Marienkäfer, Vermieter Rudi.
// Quellen: NABU Bremen ("Eine britische Studie fand in Schilfpflanzen durchschnittlich jeweils sechs Insektenlarven zwischen den Knoten, also über 120 pro Halm!",
// "Gerade die Blattlausjäger Marienkäfer und Florfliegen brauchen Staudenstängel als Quartier", Samen als Notration z. B. für Distelfinken),
// NABU Niedersachsen (hohle Halme bis zum Frühjahr ungeschnitten, Larven verlassen sie erst im Frühjahr), NABU BW (Stieglitz an Samenständen von Karde/Disteln, Rückschnitt erst im Frühjahr).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, SPH, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const QUIZ = () => [L("About 12", "Etwa 12"), L("Over 120", "Über 120"), L("None", "Keine")];
  let lotti, lady2, lady3, finch, bee, stems, trimmer, pot, tube, halm, leaves, suit2, suit3;

  // ---------- Marienkäfer (Siebenpunkt) ----------
  function makeLady() {
    const red = M(0xe8261e, { roughness: .32 }), blk = M(0x15131a, { roughness: .45 }), wht = M(0xfdfbf2, { roughness: .6 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const dome = new T.SphereGeometry(1, 40, 20, 0, 2 * PI, 0, PI / 2);
    body.add(sph(blk, 0, .05, 0, .16, .05, .125)); // Unterseite
    const shell = new T.Group(); shell.position.y = .055; body.add(shell);
    shell.add(mesh(dome, red, 0, 0, 0, .17, .13, .14));
    shell.add(mesh(dome, blk, 0, 0, 0, .172, .132, .007)); // Mittelnaht
    // 7 Punkte: 1 vorn auf der Naht, je 3 pro Seite
    const spot = (u, v, r) => { const x = .17 * Math.cos(v) * Math.cos(u), y = .13 * Math.sin(v), z = .14 * Math.cos(v) * Math.sin(u); shell.add(sph(blk, x * .96, y * .96, z * .96, r, r * .75, r)); };
    spot(0, 1.05, .034);
    for (const s of [-1, 1]) { spot(s * .75, .62, .03); spot(s * 1.75, .55, .033); spot(s * 2.5, .78, .028); }
    const pron = new T.Group(); pron.position.set(.135, .075, 0); body.add(pron);
    pron.add(sph(blk, 0, 0, 0, .06, .055, .105));
    for (const s of [-1, 1]) pron.add(sph(wht, .03, .01, s * .06, .03, .03, .032));
    const head = new T.Group(); head.position.set(.19, .07, 0); body.add(head);
    head.add(sph(blk, 0, 0, 0, .06, .05, .07));
    head.add(sph(wht, .045, -.005, 0, .02, .015, .035));
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.035, .05, s * .042); head.add(e); const ey = K3.eye(.044); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const ants = []; for (const s of [-1, 1]) { const a = new T.Group(); a.position.set(.04, .04, s * .025); head.add(a); const st = mesh(CYL, blk, 0, .045, 0, .006, .09, .006); a.add(st); a.add(sph(blk, 0, .095, 0, .014)); a.rotation.set(s * .5, 0, -.5); ants.push(a); }
    const legs = []; for (const [x, i] of [[.08, 0], [.0, 1], [-.08, 2]]) for (const s of [-1, 1]) { const l = limb(.012, .085, blk); l.position.set(x, .055, s * .09); l.rotation.x = s * .9; body.add(l); legs.push(l); }
    // Mini-Koffer neben dem Käfer
    const suit = new T.Group(); suit.position.set(-.02, 0, .2); root.add(suit);
    const brown = M(0x9a5a2c, { roughness: .6 }), belt = M(0x5a3518, { roughness: .6 });
    suit.add(mesh(BOX, brown, 0, .075, 0, .15, .12, .055)); suit.add(mesh(BOX, belt, -.035, .075, 0, .018, .125, .06)); suit.add(mesh(BOX, belt, .035, .075, 0, .018, .125, .06));
    const hd = new T.Mesh(new T.TorusGeometry(.025, .007, 6, 16, PI), belt); hd.position.set(0, .135, 0); suit.add(hd);
    suit.visible = false;
    return { root, body, shell, head, eyes, ants, legs, suit };
  }
  // o: {walk, lid, sad, wide, lookAt, sc, suit, nod}
  function poseLady(B, t, o) {
    o = o || {};
    const w = o.walk || 0;
    B.legs.forEach((l, i) => { const s = i % 2 ? 1 : -1; l.rotation.set(s * .9, 0, Math.sin(t * 16 + i * 1.7) * .5 * w); });
    B.ants.forEach((a, i) => { const s = i ? 1 : -1; a.rotation.set(s * .5, 0, -.5 + Math.sin(t * 3 + i) * .15); });
    B.body.position.y = Math.abs(Math.sin(t * 16)) * .01 * w + Math.sin(t * 2.2) * .003;
    B.head.rotation.set(0, 0, (o.nod || 0) + Math.sin(t * 1.5) * .03);
    const lid = o.lid ?? (Math.sin(t * 1.3 + .5) > .985 ? .85 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.2 : 1), 1));
    if (K3.aimEyes) { B.root.updateMatrixWorld(true); K3.aimEyes(B.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .45); }
    B.suit.visible = !!o.suit;
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Stieglitz ----------
  function makeFinch() {
    const tan = M(0xc9a27a, { roughness: .8 }), wht = M(0xfaf6ee, { roughness: .8 }), red = M(0xe0302a, { roughness: .6 }), blk = M(0x17151b, { roughness: .6 }), yel = M(0xffcf1f, { roughness: .6 }), beakM = M(0xf2dcc0, { roughness: .5 }), leg = M(0xd9a08a, { roughness: .6 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(tan, 0, .2, 0, .15, .1, .095));
    body.add(sph(wht, .04, .16, 0, .11, .075, .08));
    const head = new T.Group(); head.position.set(.13, .29, 0); body.add(head);
    head.add(sph(wht, 0, 0, 0, .08, .075, .072));
    head.add(sph(red, .05, -.002, 0, .045, .05, .058));
    head.add(sph(blk, -.012, .04, 0, .072, .04, .074));
    head.add(sph(blk, -.05, -.005, 0, .03, .06, .075));
    const beak = mesh(new T.ConeGeometry(.022, .07, 16), beakM, .11, -.01, 0); beak.rotation.z = -PI / 2; head.add(beak);
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.05, .022, s * .064); head.add(e); const ey = K3.eye(.026); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const wings = []; for (const s of [-1, 1]) { const wg = new T.Group(); wg.position.set(.02, .24, s * .085); body.add(wg);
      wg.add(sph(blk, -.07, -.01, 0, .1, .045, .02)); wg.add(sph(yel, -.04, -.01, s * .008, .06, .02, .018)); wg.add(sph(wht, -.15, -.015, s * .004, .025, .015, .016)); wings.push(wg); }
    const tail = mesh(BOX, blk, -.2, .2, 0, .12, .018, .06); tail.rotation.z = .25; body.add(tail);
    for (const s of [-1, 1]) { const l = limb(.008, .11, leg); l.position.set(.01, .12, s * .03); body.add(l); }
    return { root, body, head, eyes, wings };
  }
  // o: {peck 0..1, flap, hop, lookAt, sc, happy}
  function poseFinch(B, t, o) {
    o = o || {};
    const pk = o.peck ? Math.max(0, Math.sin(t * 9)) * o.peck : 0;
    B.head.rotation.set(0, 0, -pk * .7 + Math.sin(t * 2.5) * .05);
    B.head.position.set(.13 + pk * .03, .29 - pk * .06, 0);
    B.wings.forEach((w, i) => { const s = i ? 1 : -1; w.rotation.set(s * (o.flap ? (.3 + Math.sin(t * 28) * .7) : .05), 0, 0); });
    B.body.position.y = (o.hop ? Math.abs(Math.sin(t * 7)) * .06 : 0) + Math.sin(t * 3) * .004;
    const lid = o.lid ?? (Math.sin(t * 1.7) > .985 ? .85 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.2 : 1), 1));
    if (K3.aimEyes) { B.root.updateMatrixWorld(true); K3.aimEyes(B.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .45); }
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Wildbiene (Mauerbiene) ----------
  function makeBee() {
    const fur = M(0xa86a34, { roughness: .9 }), dark = M(0x2a1d16, { roughness: .7 }), orange = M(0xe0873a, { roughness: .9 }), wingM = M(0xe8f4ff, { roughness: .1 });
    wingM.transparent = true; wingM.opacity = .5;
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(fur, 0, .12, 0, .075, .07, .07));
    body.add(sph(orange, -.12, .11, 0, .1, .072, .072));
    for (let i = 0; i < 3; i++) body.add(sph(dark, -.09 - i * .04, .11, 0, .012, .07 - i * .008, .07 - i * .008));
    const head = new T.Group(); head.position.set(.09, .12, 0); body.add(head);
    head.add(sph(dark, 0, 0, 0, .05, .05, .055));
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.03, .025, s * .03); head.add(e); const ey = K3.eye(.025); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    for (const s of [-1, 1]) { const a = mesh(CYL, dark, .03, .06, s * .02, .005, .08, .005); a.rotation.set(s * .4, 0, -.6); head.add(a); }
    for (const s of [-1, 1]) { const wg = sph(wingM, -.04, .19, s * .05, .08, .01, .035); wg.rotation.x = s * .3; body.add(wg); }
    for (const x of [.03, -.01, -.05]) for (const s of [-1, 1]) { const l = limb(.008, .07, dark); l.position.set(x, .08, s * .05); l.rotation.x = s * .6; body.add(l); }
    return { root, body, head, eyes };
  }
  function poseBee(B, t, o) { o = o || {}; const lid = o.lid ?? 0; B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid), 1));
    B.body.position.y = Math.sin(t * 1.4) * .004; if (K3.aimEyes) { B.root.updateMatrixWorld(true); K3.aimEyes(B.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .45); } B.root.scale.setScalar(o.sc || 1); }

  // ---------- Verblühte Stauden ----------
  const STUB = .14;
  function makeStems() {
    const root = new T.Group(); const stalk = M(0xb38d5a, { roughness: .85 }), headM = M(0x8a6238, { roughness: .9 }), disc = M(0x4a3020, { roughness: .9 }), petal = M(0xa7783e, { roughness: .9 }), grass = M(0xd6b77a, { roughness: .85 });
    const P = [[-.75, .2, .85, "g"], [-.55, -.12, 1.25, "t"], [-.3, .16, 1.0, "s"], [-.08, -.22, 1.48, "t"], [.13, .1, 1.15, "s"], [.36, -.16, 1.32, "t"], [.56, .14, .95, "g"], [.76, -.04, 1.12, "t"]];
    const list = [];
    for (const [x, z, h, ty] of P) {
      const s = new T.Group(); s.position.set(x, 0, z); root.add(s);
      s.add(mesh(CYL, stalk, 0, STUB / 2, 0, .03, STUB, .03));
      s.add(sph(M(0xf3e2bf, { roughness: .8 }), 0, STUB + .002, 0, .028, .006, .028)); // Schnittfläche
      const top = new T.Group(); top.position.y = STUB; s.add(top);
      if (ty === "g") { for (let i = 0; i < 6; i++) { const b = mesh(new T.ConeGeometry(.018, h - STUB, 6), grass, 0, (h - STUB) / 2, 0); b.rotation.set((i - 2.5) * .12, i, (i % 3 - 1) * .18); top.add(b); } }
      else { top.add(mesh(CYL, stalk, 0, (h - STUB) / 2, 0, .026, h - STUB, .026));
        for (const k of [-1, 1]) { const lf = sph(M(0x9c7a48, { roughness: .9 }), k * .07, (h - STUB) * .45, 0, .09, .012, .035); lf.rotation.z = -k * .5; top.add(lf); }
        const hg = new T.Group(); hg.position.y = h - STUB; top.add(hg);
        if (ty === "t") { hg.add(sph(headM, 0, .085, 0, .065, .115, .065));
          for (let i = 0; i < 18; i++) { const a = i * 2.4, yy = .01 + (i % 6) * .03; const sp = mesh(new T.ConeGeometry(.008, .05, 5), headM, Math.cos(a) * .06, yy + .02, Math.sin(a) * .06); sp.rotation.set(Math.sin(a) * 1.3, 0, -Math.cos(a) * 1.3); hg.add(sp); }
          for (let i = 0; i < 5; i++) { const a = i * 1.26; const br = mesh(new T.ConeGeometry(.012, .2, 5), stalk, Math.cos(a) * .07, .07, Math.sin(a) * .07); br.rotation.set(Math.sin(a) * .5, 0, -Math.cos(a) * .5); hg.add(br); } }
        else { const sf = new T.Group(); sf.position.set(.06, .0, 0); sf.rotation.z = -1.0; hg.add(sf);
          sf.add(mesh(new T.CylinderGeometry(.13, .12, .05, 28), disc, 0, 0, 0));
          for (let i = 0; i < 12; i++) { const a = i / 12 * 2 * PI; const pe = sph(petal, Math.cos(a) * .15, -.01, Math.sin(a) * .15, .05, .008, .022); pe.rotation.y = -a; sf.add(pe); } } }
      list.push({ s, top, x, z, h, ty });
    }
    return { root, list };
  }
  const CUTORDER = [7, 6, 5, 4, 3, 2, 1, 0]; // von rechts nach links (Rudi steht rechts)
  function setCut(S, f) { CUTORDER.forEach((idx, i) => { const st = S.list[idx]; const q = clamp((f * 8 - i) / 1.1, 0, 1);
    st.top.visible = q < 1; st.top.rotation.set(0, 0, q * 1.45); st.top.position.set(-q * .05, STUB - q * .1, 0); }); }
  function headTop(S, idx) { const st = S.list[idx]; S.root.updateMatrixWorld(true); return st.s.localToWorld(V(0, st.h + (st.ty === "t" ? .2 : .05), 0)); }

  // ---------- Requisiten ----------
  function makeTrimmer() { const root = new T.Group(); const body = M(0xff7a1a, { roughness: .4 }), dk = M(0x23232b, { roughness: .5 }), steel = M(0xc9d1da, { metalness: .85, roughness: .25 });
    root.add(mesh(BOX, body, 0, 0, 0, .42, .15, .13)); root.add(mesh(BOX, dk, -.15, .12, 0, .2, .045, .06));
    const blade = new T.Group(); root.add(blade); blade.add(mesh(BOX, steel, .55, 0, 0, .72, .035, .07));
    for (let i = 0; i < 11; i++) blade.add(mesh(BOX, steel, .25 + i * .06, 0, 0, .025, .03, .14));
    return { root, blade }; }
  function makePot() { const root = new T.Group(); const terra = M(0xd9773f, { roughness: .55 }), green = M(0x2fd06a, { roughness: .12 }), pink = M(0xff3fa4, { roughness: .1 }), yel = M(0xffe14d, { roughness: .1 });
    root.add(mesh(new T.CylinderGeometry(.16, .12, .22, 28), terra, 0, .11, 0)); root.add(mesh(new T.CylinderGeometry(.175, .175, .04, 28), terra, 0, .22, 0));
    const fl = []; for (const [x, z, h] of [[-.05, 0, .55], [.06, .04, .45], [0, -.06, .65]]) { root.add(mesh(CYL, green, x, .22 + h / 2, z, .014, h, .014));
      const f = new T.Group(); f.position.set(x, .22 + h, z); root.add(f); for (let i = 0; i < 6; i++) { const a = i / 6 * 2 * PI; f.add(sph(pink, Math.cos(a) * .06, 0, Math.sin(a) * .06, .05, .015, .035)); } f.add(sph(yel, 0, .01, 0, .035, .025, .035)); fl.push(f); }
    // Preisschild
    const tag = canvasTex(128, 80, (c, w, h) => { c.fillStyle = "#fff"; c.fillRect(0, 0, w, h); c.fillStyle = "#e5484d"; c.font = '900 40px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("0,99€", w / 2, h / 2 + 2); });
    const tg = new T.Mesh(new T.BoxGeometry(.16, .1, .005), new T.MeshStandardMaterial({ map: tag, roughness: .6 })); tg.position.set(0, .12, .17); root.add(tg);
    return { root, fl }; }
  // aufgeschnittener Halm: hintere Hälfte, Knoten, Larven in Kammern. open=true: Querschnitt; open=false: geschlossene Röhre
  function makeTube(open) { const root = new T.Group(); const R = .42, Hh = 2.3;
    const outM = M(0xc9a86a, { roughness: .8 }); outM.side = T.DoubleSide; const inM = M(0xb98c52, { roughness: .85 }); inM.side = T.DoubleSide; const nodeM = M(0xa8854f, { roughness: .8 }); nodeM.side = T.DoubleSide;
    const larvae = [];
    if (open) { root.add(mesh(new T.CylinderGeometry(R, R, Hh, 40, 1, true, PI / 2, PI), outM, 0, Hh / 2, 0));
      root.add(mesh(new T.CylinderGeometry(R * .88, R * .88, Hh, 40, 1, true, PI / 2, PI), inM, 0, Hh / 2, 0));
      for (const s of [-1, 1]) root.add(mesh(BOX, M(0xe9d29c, { roughness: .8 }), s * R * .94, Hh / 2, 0, R * .13, Hh, .03));
      const larvM = M(0xffffff, { roughness: .5 }), lh = M(0x8a5a2a, { roughness: .5 });
      const NODES = [.02, .6, 1.18, 1.76, 2.3];
      NODES.forEach((y) => root.add(mesh(new T.CylinderGeometry(R * .95, R * .95, .05, 40, 1, false, PI / 2, PI), nodeM, 0, y, 0)));
      for (let c = 0; c < 4; c++) { const y0 = NODES[c] + .08; for (let i = 0; i < 6; i++) { const lv = new T.Group(); const col = i % 3, row = Math.floor(i / 3);
        lv.position.set(-.2 + col * .2, y0 + .1 + row * .2, -.12 - (i % 2) * .08); lv.rotation.z = (i % 2 ? .3 : -.3);
        for (let k = 0; k < 4; k++) lv.add(sph(larvM, -.06 + k * .042, Math.sin(k * .9) * .015, 0, .045 - k * .003, .039, .039)); lv.add(sph(lh, .112, .012, 0, .027));
        root.add(lv); larvae.push(lv); } } }
    else { root.add(mesh(new T.CylinderGeometry(R, R, Hh, 40, 1, true), outM, 0, Hh / 2, 0));
      const ring = new T.Mesh(new T.TorusGeometry(R, .025, 8, 40), M(0xe9d29c, { roughness: .8 })); ring.rotation.x = PI / 2; ring.position.y = Hh; root.add(ring);
      const dark = mesh(new T.CircleGeometry(R * .98, 40), M(0x3a2a18, { roughness: 1 }), 0, Hh - .02, 0); dark.rotation.x = -PI / 2; root.add(dark);
      for (const y of [.6, 1.2, 1.8]) { const nr = new T.Mesh(new T.TorusGeometry(R * 1.005, .02, 8, 40), nodeM); nr.rotation.x = PI / 2; nr.position.y = y; root.add(nr); } }
    return { root, larvae, Hh }; }
  function wiggle(Tb, t) { Tb.larvae.forEach((l, i) => { l.rotation.y = Math.sin(t * 3 + i) * .25; l.scale.set(1 + Math.sin(t * 4 + i * 1.3) * .08, 1, 1); }); }
  function makeLeaves() { const root = new T.Group(); const cols = [0xe8892b, 0xd9502f, 0xf2b632, 0xb5652a].map((c) => M(c, { roughness: .8 }));
    for (let i = 0; i < 60; i++) { const a = i * 2.399, r = .5 + Math.sqrt(i / 60) * 3.4; const lf = sph(cols[i % 4], Math.cos(a) * r, .012, Math.sin(a) * r * .8 - .3, .07, .008, .04); lf.rotation.y = i * 1.3; lf.castShadow = false; root.add(lf); }
    return { root }; }

  K3.onBuild(() => {
    lotti = actor(makeLady(), "Lotti"); lady2 = actor(makeLady(), "Käfer 2"); lady3 = actor(makeLady(), "Käfer 3");
    finch = actor(makeFinch(), "Stieglitz"); bee = actor(makeBee(), "Wildbiene"); stems = actor(makeStems(), "Stauden");
    trimmer = actor(makeTrimmer(), "Heckenschere"); pot = actor(makePot(), "Plastikblumen"); tube = actor(makeTube(true), "Halm offen"); halm = actor(makeTube(false), "Halm zu");
    leaves = actor(makeLeaves(), "Laub");
    for (const a of [trimmer, leaves, stems]) a.noCheck = true; leaves.noBlob = true; trimmer.noBlob = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
  });
  const rudi = () => K3.rudi;
  function reset() { const R = rudi(); R.noCheck = false; setCut(stems, 0);
    for (const b of [lotti, lady2, lady3, finch, bee, pot, trimmer]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.root.scale.setScalar(1); b.noCheck = false; b.noEyeCheck = false; }
    trimmer.noCheck = true; }
  function inYard() { begin("yard"); reset(); place(leaves, 0, 0, 0); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function hand(i) { const R = rudi(); R.root.updateMatrixWorld(true); return R.arms[i].localToWorld(V(0, -.62, 0)); }
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  // Heckenschere zwischen beiden Händen, Klinge in Rudis Blickrichtung, snip = Klinge zittert
  function holdTrimmer(t, snip, tilt) { const R = rudi(); const a = hand(0), b = hand(1); const m = a.add(b).multiplyScalar(.5); trimmer.root.visible = true; trimmer.root.position.copy(m);
    trimmer.root.rotation.set(0, R.root.rotation.y, tilt || 0); trimmer.blade.position.z = snip ? Math.sin(t * 60) * .012 : 0; }
  function leaves2D(t, a, n) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const cols = ["#e8892b", "#d9502f", "#f2b632"];
    for (let i = 0; i < (n || 14); i++) { const sp = 120 + (i % 4) * 40, x = ((i * 263) % 900) + 40 + Math.sin(t * 1.6 + i) * 50, y = ((i * 151 + t * sp) % 1400) + 160;
      g.globalAlpha = a * .9; g.fillStyle = cols[i % 3]; g.save(); g.translate(x, y); g.rotate(t * 2 + i); g.beginPath(); g.ellipse(0, 0, 18, 9, 0, 0, 7); g.fill(); g.restore(); } g.restore(); }
  function zzz(x, y, t, a) { for (let i = 0; i < 3; i++) { const q = (t * .6 + i / 3) % 1; txt("z", x + q * 60 + i * 6, y - q * 90, 34 + q * 26, "#ffffff", { a: a * (1 - q), stroke: 8 }); } }
  // Kündigungsschreiben (2D)
  function notice(x, y, p, t, sig) { if (p <= 0) return; const k = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(-.05 + Math.sin(t * 2) * .01); g.scale(k, k);
    const w = 640, h = 470; g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-w / 2 + 12, -h / 2 + 14, w, h, 18); g.fill();
    g.fillStyle = "#fffdf5"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 18); g.fill();
    g.fillStyle = "#e5484d"; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, 96, [18, 18, 0, 0]); g.fill();
    g.fillStyle = "#fff"; g.font = '900 50px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(L("EVICTION NOTICE", "KÜNDIGUNG"), 0, -h / 2 + 50, w - 50);
    g.fillStyle = "#1d2250"; g.font = '800 34px "Montserrat"'; g.textAlign = "left";
    const rows = [[L("Tenant:", "Mieterin:"), L("Ladybug Lotti", "Marienkäfer Lotti")], [L("Home:", "Wohnung:"), L("hollow stem", "hohler Stängel")], [L("Move out:", "Auszug:"), L("NOW", "SOFORT")]];
    rows.forEach(([a, b], i) => { g.fillStyle = "#6a6f92"; g.fillText(a, -w / 2 + 40, -h / 2 + 150 + i * 62); g.fillStyle = i === 2 ? "#e5484d" : "#1d2250"; g.fillText(b, -w / 2 + 250, -h / 2 + 150 + i * 62, w - 290); });
    g.strokeStyle = "#c9cbe0"; g.lineWidth = 3; g.beginPath(); g.moveTo(-w / 2 + 40, h / 2 - 70); g.lineTo(40, h / 2 - 70); g.stroke();
    if (sig > 0) { g.save(); g.beginPath(); g.rect(-w / 2 + 40, h / 2 - 150, 360 * Math.min(1, sig), 100); g.clip(); g.fillStyle = "#2b62c9"; g.font = 'italic 900 62px "Montserrat"'; g.fillText("Rudi", -w / 2 + 60, h / 2 - 98); g.restore(); }
    g.fillStyle = "#6a6f92"; g.font = '700 26px "Montserrat"'; g.fillText(L("Landlord", "Vermieter"), -w / 2 + 40, h / 2 - 40);
    g.restore(); }

  // ---------- Shots ----------
  // Hook: Lotti mit Koffer vor dem abgeschnittenen Stumpf, Laub fliegt, GEKÜNDIGT! knallt sofort
  function hookFrame(t, ph) {
    place(stems, 0, 0, 0); setCut(stems, 1);
    at(lotti, .02, 0, .32, -.75); poseLady(lotti, t, { sc: 2.4, suit: true, lid: .2, nod: -.05 });
    frameOn([lotti, FR(-.35, 0, -.1, .45, .4, .35)], { az: lerp(.42, .32, ph), el: .2, fill: lerp(.86, .93, ph), dy: -.08, t }); draw(); leaves2D(t, 1); }
  KZ.shot("sHook", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(t, ph);
    stamp(L("EVICTED!", "GEKÜNDIGT!"), W * .42, H * .6, (lt + .02) / .25, "#e5484d", -.07); });
  // 1 Kündigung: Rudi mit Heckenschere vor den Stauden (noch stehend), Kündigungsschreiben ploppt auf, Unterschrift "Rudi"
  KZ.shot("sNotice", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(stems, 0, 0, 0); place(rudi(), 1.4, .15, PI + .35); poseRudi(rudi(), t, { arms: [1.05, 1.15], spread: .03, mouth: "smile", nod: .05 }); holdTrimmer(t, ph > .2, .25);
    at(lotti, -.25, 0, .55, .6); poseLady(lotti, t, { sc: 1.7, wide: true, lookAt: V(1.4, 1.7, .15) });
    frameOn([rudi(), stems, lotti], { az: lerp(.15, .25, k), el: .14, fill: lerp(.85, .9, k), dy: -.9, t }); draw(); leaves2D(t, .7, 8);
    notice(W * .42, H * .565, (lt - .15) / .4, t, (lt - d * .55) / (d * .3)); });
  // 2 Rudi schneidet alles ab (Stängel kippen nacheinander), Schnitt: kahle Stümpfe, drei Käfer ziehen mit Koffern ab
  KZ.shot("sCut", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .55;
    place(stems, 0, 0, 0);
    if (!half) { const k = ph / .55; setCut(stems, sm(clamp(k * 1.1, 0, 1)));
      place(rudi(), 1.35, .1, PI + .15 + Math.sin(t * 5) * .12); poseRudi(rudi(), t, { arms: [1.15, 1.25], spread: .03, mouth: "o", wide: true, lean: Math.sin(t * 5) * .04 }); holdTrimmer(t, true, -.15);
      frameOn([rudi(), stems], { az: lerp(.1, .18, k), el: .16, fill: lerp(.86, .92, k), dy: -.4, t }); draw();
      stamp(L("SNIP!", "SCHNIPP!"), W * .3, H * .3, ((lt % .9) / .25), "#ff7a1a", -.1); }
    else { const k = (ph - .55) / .45; setCut(stems, 1);
      const walk = (B, x0, z0, dl, sc) => { at(B, x0 - k * .55 - dl, 0, z0, PI * .92); poseLady(B, t + dl * 3, { walk: 1, sc, suit: true, lid: .3 }); };
      walk(lotti, .0, .55, 0, 2.2); walk(lady2, 1.25, .5, .1, 2.0); walk(lady3, 2.4, .45, .2, 1.8);
      frameOn([FR(-1.3, 0, .1, 2.8, .5, .8)], { az: lerp(.08, .03, k), el: .28, fill: lerp(.9, .97, k), dy: -.05, t }); draw(); leaves2D(t, .8, 10);
      stamp(L("ALL GONE!", "RATZEKAHL!"), W * .42, H * .2, (k * d * .45 - .05) / .3, "#e5484d", -.06); } });
  // 3 Rate-Frage: großer geschlossener Halm, Lotti guckt oben raus, Kacheln
  KZ.shot("sQuiz", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(halm, 0, 0, 0); at(lotti, .02, halm.Hh - .02, .12, .5); lotti.noCheck = true; poseLady(lotti, t, { sc: 1.8, wide: true });
    frameOn([halm, lotti], { az: lerp(-.2, -.1, k), el: .2, fill: lerp(.55, .6, k), dy: .3, t }); draw();
    txt(L("HOW MANY LARVAE?", "WIE VIELE LARVEN?"), W * .42, H * .2, 58, "#ffd23f", { stroke: 12, a: clamp(lt / .3, 0, 1) });
    quizTiles(W * .42, H * .56, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 4 Plastikblumen: Stieglitz sucht auf den Stümpfen, Rudi stellt stolz den Topf hin; Schnitt: Stieglitz pickt ins Plastik
  KZ.shot("sPlastic", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .5; place(stems, 0, 0, 0); setCut(stems, 1);
    if (!half) { const k = ph / .5;
      at(finch, lerp(-.85, -.4, sm(clamp(k * 1.5, 0, 1))), 0, .45, 0); poseFinch(finch, t, { sc: 2.8, hop: k < .65, lookAt: V(.6, .7, .45), wide: k > .55 });
      place(pot, .45, .45, 0); pot.root.scale.setScalar(Math.max(.01, easeBack(clamp((k - .15) / .35, 0, 1))) * 1.35); pot.noCheck = true;
      place(rudi(), 1.35, .0, PI + .5); poseRudi(rudi(), t, { arms: [.2, 2.4 + Math.sin(t * 6) * .1], spread: .2, mouth: "smile", nod: .06 });
      frameOn([rudi(), finch, pot], { az: lerp(.28, .34, k), el: .15, fill: lerp(.86, .9, k), dy: -.5, t }); draw();
      if (k > .55) stamp(L("PLASTIC?!", "PLASTIK?!"), W * .42, H * .2, (k - .55) * d * .5 / .3, "#ff3fa4", -.06); }
    else { const k = (ph - .5) / .5; place(pot, .3, 0, 0); pot.noCheck = true;
      at(finch, -.32, 0, 0, 0); poseFinch(finch, t, { sc: 2.2, peck: k > .15 ? 1 : 0, lid: Math.sin(t * 9) > .6 ? .6 : 0 });
      frameOn([finch, pot], { az: lerp(.55, .62, k), el: .1, fill: lerp(.85, .92, k), dy: -.1, t }); draw();
      stamp(L("CLONK!", "KLONK!"), W * .42, H * .2, (k * d * .5 - .1) / .3, "#2f6fd0", .06); } });
  // 5 Auflösung: aufgeschnittener Halm voller Larven, Kacheln mit Haken, dann Zähler 0 -> 120+
  KZ.shot("sLarvae", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(tube, 0, 0, 0); wiggle(tube, t);
    frameOn([tube], { az: lerp(.05, -.05, k), el: lerp(.12, .2, k), fill: lerp(.6, .68, k), dy: -.05, t }); draw();
    if (ph < .42) quizTiles(W * .42, H * .56, QUIZ(), 1, { reveal: sm(clamp((lt - .1) / .4, 0, 1)), correct: 1 });
    else { const n = Math.round(120 * sm(clamp((ph - .42) / .4, 0, 1))); txt((n >= 120 ? "120+" : String(n)), W * .42, H * .5, 190, "#ffd23f", { stroke: 22, w: 900 });
      txt(L("larvae in ONE stem", "Larven in EINEM Halm"), W * .42, H * .6, 50, "#ffffff", { stroke: 12 }); }
    stamp("NABU", W * .42, H * .17, (lt - d * .5) / .3, "#36b37e", -.05); });
  // 6 Überwintern: Querschnitt, Lotti, Käfer 2 und Wildbiene schlafen in den Kammern, Zzz, NABU-Karte
  KZ.shot("sSleep", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(tube, 0, 0, 0); tube.larvae.forEach((l, i) => l.visible = i % 3 === 0); wiggle(tube, t);
    at(lotti, -.08, 1.25, -.12, .5); poseLady(lotti, t, { sc: 1.55, lid: .92 }); lotti.noCheck = true; lotti.noEyeCheck = true;
    at(lady2, .1, .66, -.1, -.4); poseLady(lady2, t + 1, { sc: 1.45, lid: .92 }); lady2.noCheck = true; lady2.noEyeCheck = true;
    at(bee, -.05, 1.82, -.1, .3); poseBee(bee, t, { sc: 1.6, lid: .92 }); bee.noCheck = true; bee.noEyeCheck = true;
    frameOn([tube], { az: lerp(-.05, .05, k), el: .16, fill: lerp(.62, .68, k), dy: -.1, t }); draw();
    for (const B of [lotti, lady2, bee]) { B.root.updateMatrixWorld(true); const [x, y] = scr(B.root.localToWorld(V(.1, .3, 0))); zzz(Math.min(x, 800), y, t, clamp(lt / .3, 0, 1)); }
    tube.larvae.forEach((l) => l.visible = true);
    infoCard(W * .42, H * .6, 900, 200, sm((ph - .35) * d / .35), "NABU", "#36b37e",
      [L("Ladybugs need perennial", "„Marienkäfer brauchen"), L("stems as winter shelter", "Staudenstängel als Quartier.“")], 40); });
  // 7 Samen: Stauden stehen, Stieglitz sitzt auf der Karde und pickt Samen, Stempel WINTERFUTTER
  KZ.shot("sSeeds", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); place(stems, 0, 0, 0);
    const top = headTop(stems, 3); at(finch, top.x - .05, top.y - .04, top.z - .05, -.95); finch.noCheck = true; poseFinch(finch, t, { sc: 1.5, peck: ph > .2 ? 1 : 0 });
    const fT = (B) => { B.root.updateMatrixWorld(true); return B; };
    frameOn([fT(finch), FR(top.x - .45, top.y - .75, top.z - .3, top.x + .45, top.y + .45, top.z + .3)], { az: lerp(.3, .2, k), el: .1, fill: lerp(.8, .88, k), dy: -.05, t }); draw(); leaves2D(t, .6, 8);
    // Samen-Krümel fliegen vom Schnabel
    finch.head.updateMatrixWorld(true); const [bx, by] = scr(finch.head.localToWorld(V(.13, -.01, 0)));
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#5a3a1a"; for (let i = 0; i < 6; i++) { const q = (t * 1.5 + i / 6) % 1; g.globalAlpha = ph > .2 ? 1 - q : 0; g.beginPath(); g.ellipse(bx + Math.sin(i * 2.1) * 40 * q + 10, by + q * 140, 7, 4, i, 0, 7); g.fill(); } g.restore();
    stamp(L("WINTER FOOD", "WINTERFUTTER"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06); });
  // 8 Tipp: Rudi legt die Heckenschere weg, Stauden stehen, Lotti winkt (Fühler) oben vom Stängel, Tipp-Karte
  KZ.shot("sTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); place(stems, 0, 0, 0);
    place(rudi(), 1.35, .25, PI + .5); poseRudi(rudi(), t, { arms: [.15, .2], spread: .08, mouth: ph < .4 ? "o" : "smile", nod: ph < .4 ? -.06 : .06 });
    place(trimmer, .95, .8, -.6); trimmer.root.position.y = .08; trimmer.root.rotation.set(0, -.6, 0);
    const top = headTop(stems, 5); at(lotti, top.x, top.y - .03, top.z, -.6); lotti.noCheck = true; poseLady(lotti, t, { sc: 2.0 });
    frameOn([rudi(), stems], { az: lerp(-.25, -.32, k), el: .15, fill: lerp(.86, .9, k), dy: -.75, t }); draw();
    stamp(L("NOT AN O.R.!", "KEIN OP-SAAL!"), W * .42, H * .17, (lt - .1) / .3, "#e5484d", -.06);
    infoCard(W * .42, H * .6, 900, 200, sm((ph - .38) * d / .35), L("TIP", "TIPP"), "#36b37e",
      [L("Leave stems until spring", "Stängel bis Frühling stehen lassen"), L("Rake leaves under hedges", "Laub unter die Hecke")], 40); });
  // 9 Loop: zurück zur Hook-Einstellung
  KZ.shot("sLoop", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(t, 1 - ph * .9);
    if (ph > .3) stamp(L("THAT TRIMMER...", "DIE SCHERE..."), W * .42, H * .17, (ph - .3) * d / .3, "#ff7a1a", -.06); });

  window.__gardenStems = true;
})();
