// 3D-Szene "Why A Wagging Tail Doesn't Mean Happy" (16.11.2026, erstes 3D-Video). Vorbild für 3D-Szenendateien.
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, view, draw, begin, place, actor } = window.K3;
  let dog, rudi, meter, tiles, arrows;
  K3.onBuild(() => { rudi = K3.rudi; dog = actor(makeDog()); meter = actor(makeMeter()); tiles = actor(makeTiles()); arrows = actor(makeArrows()); });
  // ---------- Hund (eigener Entwurf: goldbrauner Mischling, weiße Brust, Schlappohren) ----------
  function makeDog() {
    const coat = M(0xe39a4b), white = M(0xfbf1e2), dark = M(0x2a1c16, { roughness: .3 }), ear = M(0xb5662c), eyeW = M(0xffffff, { roughness: .15 }), pupil = M(0x161018, { roughness: .1 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const torso = sph(coat, 0, .62, 0, .52, .33, .3); body.add(torso);
    body.add(sph(white, .3, .56, 0, .26, .27, .24));
    body.add(sph(white, 0, .48, 0, .4, .18, .22));
    const legs = [];
    for (const [x, z] of [[.3, .16], [.3, -.16], [-.3, .16], [-.3, -.16]]) { const l = limb(.085, .42, coat); l.position.set(x, .55, z); const paw = sph(white, .04, -.44, 0, .11, .07, .1); l.add(paw); body.add(l); legs.push(l); }
    const head = new T.Group(); head.position.set(.5, 1.0, 0); body.add(head);
    head.add(sph(coat, 0, 0, 0, .33, .3, .3));
    head.add(sph(white, .24, -.1, 0, .2, .14, .17));
    head.add(sph(dark, .43, -.04, 0, .065, .055, .07));
    const eyes = [], brows = [], ears = [];
    for (const s of [-1, 1]) {
      const e = new T.Group(); e.position.set(.22, .08, s * .15); head.add(e);
      e.add(sph(eyeW, 0, 0, 0, .085)); const p = sph(pupil, .055, 0, 0, .05); e.add(p); const hl = sph(M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), .098, .025, -.015 * s, .016); e.add(hl); eyes.push(e);
      const b = mesh(BOX, dark, .25, .2, s * .15, .05, .035, .15); head.add(b); brows.push(b);
      const ep = new T.Group(); ep.position.set(-.04, .16, s * .26); head.add(ep);
      const ea = sph(ear, 0, -.17, 0, .1, .2, .06); ep.add(ea); ep.rotation.x = s * .25; ears.push(ep);
    }
    const mouth = new T.Group(); mouth.position.set(.34, -.2, 0); head.add(mouth);
    mouth.add(sph(M(0x5a1a22), 0, 0, 0, .1, .04, .1));
    for (const s of [-1, 1]) { const f = mesh(new T.ConeGeometry(.022, .07, 12), white, .05, .02, s * .045); f.rotation.z = PI; mouth.add(f); }
    const tongue = sph(M(0xff7b8a), .05, -.06, 0, .07, .04, .06); head.add(tongue); tongue.position.set(.36, -.25, 0);
    const tail = new T.Group(); tail.position.set(-.48, .78, 0); tail.rotation.order = "YZX"; body.add(tail);
    const segs = [];
    let prev = tail; for (let i = 0; i < 12; i++) { const sg = new T.Group(); sg.position.set(i ? -.042 : -.02, 0, 0); prev.add(sg); sg.add(sph(i > 9 ? white : coat, -.02, 0, 0, .082 - i * .0035)); segs.push(sg); prev = sg; }
    return { root, body, torso, head, legs, eyes, brows, ears, mouth, tongue, tail, segs };
  }
  function poseDog(D, t, o) {
    o = o || {};
    const wag = o.wag ?? .5, wf = o.wf ?? 2.2, w = Math.sin(t * wf * 2 * PI);
    D.tail.rotation.y = (o.bias || 0) + w * wag;
    D.tail.rotation.z = -lerp(.35, 1.35, o.up ?? .45);
    const curl = o.stiff ? 0 : .07; D.segs.forEach((s, i) => { s.rotation.z = -curl * (i > 0); s.rotation.y = i > 0 ? -Math.sin(t * wf * 2 * PI - i * .25) * wag * .09 * (o.stiff ? 0 : 1) : 0; });
    const wig = o.wiggle || 0; D.body.rotation.y = Math.sin(t * wf * 2 * PI + .6) * .12 * wig; D.body.rotation.x = Math.sin(t * wf * 2 * PI) * .05 * wig;
    const br = 1 + Math.sin(t * 2.4) * .015 * (o.frozen ? .2 : 1); D.torso.scale.set(.52, .33 * br, .3 * br);
    D.head.rotation.x = o.tilt || 0; D.head.rotation.z = (o.nod || 0) + (o.frozen ? 0 : Math.sin(t * 1.3) * .03);
    D.head.position.y = 1.0 - (o.lower || 0) * .12; D.head.position.x = .5 + (o.lower || 0) * .05;
    const ang = o.angry || 0; D.brows.forEach((b, i) => { const s = i ? 1 : -1; b.rotation.x = -s * ang * .55; b.position.y = .2 - ang * .03; b.visible = ang > .05 || (o.browsAlways); });
    const blink = (Math.sin(t * 2.1 + 1) > .985 && !o.frozen) ? .15 : 1; D.eyes.forEach((e) => e.scale.set(1, blink * (1 - ang * .25), 1));
    D.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.x = s * (.25 + (o.earsBack || 0) * .5 + Math.sin(t * 3 + i) * .03); e.rotation.z = (o.earsBack || 0) * .6; });
    D.mouth.visible = (o.growl || 0) > .1; D.mouth.scale.setScalar(.6 + .4 * (o.growl || 0) + Math.sin(t * 40) * .03 * (o.growl || 0));
    D.tongue.visible = !!o.tongue;
    const walk = o.walk || 0; D.legs.forEach((l, i) => { l.rotation.z = Math.sin(t * 9 + (i % 2 ? PI : 0) + (i > 1 ? PI / 2 : 0)) * .45 * walk; });
    D.body.position.y = Math.abs(Math.sin(t * 9)) * .04 * walk;
  }

  // ---------- Wag-o-Meter ----------
  function makeMeter() {
    const root = new T.Group();
    const face = canvasTex(512, 512, (c, w, h) => {
      c.fillStyle = "#fff9ec"; c.beginPath(); c.arc(256, 256, 250, 0, 7); c.fill();
      const cols = ["#4aa3ff", "#7bd389", "#ffd23f", "#ff8a3d", "#ff3d6e"];
      for (let i = 0; i < 5; i++) { c.strokeStyle = cols[i]; c.lineWidth = 46; c.beginPath(); c.arc(256, 300, 180, PI + i * PI / 5 + .02, PI + (i + 1) * PI / 5 - .02); c.stroke(); }
      c.fillStyle = "#1d2250"; c.font = '900 46px "Montserrat"'; c.textAlign = "center"; c.fillText("WAG-O-METER", 256, 420);
      c.font = '800 30px "Montserrat"'; c.fillText("MEH", 110, 340); c.fillText("SUPER HAPPY", 380, 200);
    });
    const box = mesh(BOX, M(0x2f6fd0, { roughness: .4 }), 0, .5, 0, .75, .75, .25); root.add(box);
    const dial = new T.Mesh(new T.CircleGeometry(.33, 48), new T.MeshStandardMaterial({ map: face, roughness: .5 })); dial.position.set(0, .52, .126); root.add(dial);
    const needle = new T.Group(); needle.position.set(0, .45, .135); root.add(needle);
    needle.add(mesh(BOX, M(0x1d2250), 0, .12, 0, .025, .24, .01)); needle.add(sph(M(0x1d2250), 0, 0, 0, .03));
    const ant = mesh(CYL, M(0x888888, { metalness: .8, roughness: .3 }), .25, 1.0, 0, .015, .3, .015); root.add(ant); const bulb = sph(M(0xff3d6e, { emissive: 0xff3d6e, emissiveIntensity: .8 }), .25, 1.17, 0, .05); root.add(bulb);
    root.add(mesh(CYL, M(0x555a66, { metalness: .6, roughness: .4 }), 0, .06, 0, .06, .12, .06));
    return { root, needle, bulb };
  }
  // ---------- Infografik-Kacheln ----------
  function tileTex(word, col) { return canvasTex(512, 256, (c, w, h) => { c.fillStyle = col; c.beginPath(); c.roundRect(0, 0, w, h, 60); c.fill(); c.fillStyle = "#fff"; c.font = '900 92px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(word, w / 2, h / 2 + 4); }); }
  function makeTiles() {
    const root = new T.Group(), list = [];
    for (const [w, col] of [["HAPPY", "#36b37e"], ["NERVOUS", "#f5a623"], ["ANGRY", "#e5484d"]]) {
      const grp = new T.Group(); const b = mesh(BOX, M(new T.Color(col).multiplyScalar(.7).getHex(), { roughness: .4 }), 0, 0, -.06, 1.6, .8, .12); grp.add(b);
      const f = new T.Mesh(new T.PlaneGeometry(1.6, .8), new T.MeshStandardMaterial({ map: tileTex(w, col), roughness: .4 })); f.position.z = .001; grp.add(f);
      root.add(grp); list.push(grp);
    }
    return { root, list };
  }
  function makeArrows() {
    const root = new T.Group(), list = [];
    for (const [s, col] of [[1, 0x36d07e], [-1, 0xff4d5e]]) {
      const grp = new T.Group(); const m = M(col, { emissive: col, emissiveIntensity: .35, roughness: .35 });
      const shaft = mesh(CYL, m, 0, 0, 0, .07, .9, .07); shaft.rotation.x = PI / 2; shaft.position.z = s * .45; grp.add(shaft);
      const tip = mesh(new T.ConeGeometry(.17, .35, 32), m, 0, 0, s * 1.05); tip.rotation.x = s * PI / 2; grp.add(tip);
      root.add(grp); list.push(grp);
    }
    return { root, list };
  }

  const camera = K3.camera;
  // ---------- Shots ----------
  // 0 Hook: Nahaufnahme, Schwanz wedelt, Blick misstrauisch
  KZ.shot("tHook", (lt, d, t) => { begin("yard"); const k = sm(lt / d);
    place(dog, 0, 0, -.55); poseDog(dog, t, { wag: .55, wf: 2.6, up: .6, angry: .55 + .2 * sm((lt - d * .5) / .4), browsAlways: true });
    view(lerp(1.6, 1.25, k), lerp(1.25, 1.1, k), lerp(3.4, 2.8, k), lerp(-.05, .05, k), .8, 0, 34, t); draw(); });
  // 1 Rudi rennt mit offenen Armen zum Hund
  KZ.shot("tHug", (lt, d, t) => { begin("yard"); const k = sm(lt / d), run = sm((lt - d * .25) / (d * .6));
    place(dog, .9, 0, PI + .35); poseDog(dog, t, { wag: .5, wf: 2.4, up: .7, angry: sm((lt - d * .55) / .3) * .8, browsAlways: true, earsBack: sm((lt - d * .6) / .3) * .6 });
    place(rudi, lerp(-2.4, -.6, run), lerp(.6, .2, run), -.15); poseRudi(rudi, t, { walk: run > 0 && run < 1 ? 1 : 0, arms: [lerp(.2, 1.4, run), lerp(.2, 1.4, run)], spread: lerp(.1, .9, run), mouth: run > .3 ? "smile" : "smile", wide: true });
    view(lerp(.6, .1, k), 1.35, lerp(6.4, 5.6, k), lerp(-.4, .1, k), .9, 0, 34, t); draw();
    if (lt > d * .4) stamp("HUG TIME!", W * .33, H * .2, (lt - d * .4) / .3, "#ff5d8f", -.08); });
  // 2 Wag-o-Meter: Nadel auf SUPER HAPPY, Hund knurrt trotzdem (Schnitt in der Mitte)
  KZ.shot("tMeter", (lt, d, t) => { begin("yard"); const half = lt > d * .55;
    place(dog, 1.1, 0, PI + .3); place(meter, .05, .55, .25);
    const need = sm((lt - d * .15) / (d * .3)); meter.needle.rotation.z = lerp(1.3, -1.2, need) + Math.sin(t * 30) * .04 * need; meter.bulb.material.emissiveIntensity = .4 + .6 * (Math.sin(t * 12) > 0 ? 1 : 0);
    poseDog(dog, t, { wag: .6, wf: 3, up: .75, angry: .9, browsAlways: true, growl: half ? 1 : .4, earsBack: .5, lower: .5 });
    place(rudi, -1.1, .3, -.35); poseRudi(rudi, t, { arms: [.4, half ? .2 : 1.2], spread: .15, mouth: half ? "o" : "smile", lean: half ? .12 : 0 });
    if (!half) { const k = sm(lt / (d * .55)); view(lerp(.4, .2, k), 1.2, lerp(4.4, 3.8, k), .1, .75, .2, 34, t); }
    else { const k = sm((lt - d * .55) / (d * .45)); view(lerp(1.9, 1.6, k), 1.15, lerp(3.0, 2.6, k), .55, .8, .3, 30, t); }
    draw();
    if (!half && lt > d * .3) stamp("SUPER HAPPY", W * .42, H * .17, (lt - d * .3) / .3, "#36b37e", -.06);
    if (half) stamp("GRRR...", W * .3, H * .2, (lt - d * .58) / .25, "#e5484d", .07); });
  // 3 Ritterrüstung: Rudi klappert heran, winkt
  KZ.shot("tArmor", (lt, d, t) => { begin("yard"); const k = sm(lt / d), go = sm(lt / (d * .6));
    place(dog, 1.1, 0, PI + .3); poseDog(dog, t, { wag: .4, wf: 2, up: .55, tilt: sm((lt - d * .5) / .4) * .35, angry: .2, browsAlways: true });
    place(rudi, lerp(-1.6, -.4, go), .3, -.45); poseRudi(rudi, t, { armor: true, walk: go < 1 ? .7 : 0, arms: [.2, go >= 1 ? 2.6 : .6], wave: go >= 1, spread: .1 });
    rudi.root.rotation.z = Math.sin(t * 16) * .02 * (go < 1);
    view(lerp(.0, .3, k), 1.3, lerp(5, 4.4, k), lerp(-.3, .2, k), .95, 0, 34, t); draw();
    if (lt > d * .55) stamp("CLANK CLANK", W * .34, H * .19, (lt - d * .55) / .3, "#6b7a90", -.07); });
  // 4 Wahrheit: Hund auf Sockel, drei Kacheln
  KZ.shot("tTruth", (lt, d, t) => { begin("studio"); const k = sm(lt / d);
    place(dog, 0, 0, -.5); poseDog(dog, t, { wag: .55, wf: 2.4, up: .55 });
    tiles.root.visible = true; tiles.root.position.set(0, 0, 0);
    const ts = [.32, .55, .78];
    tiles.list.forEach((tl, i) => { const p = clamp((lt / d - ts[i]) / .12, 0, 1), e = easeBack(p); tl.visible = p > 0; tl.position.set((i - 1) * .9, 2.25 + (i === 1 ? .4 : 0) + Math.sin(t * 2 + i) * .04, .2); tl.scale.setScalar(Math.max(.001, e) * .62); tl.rotation.y = (1 - p) * 1.5; tl.rotation.z = (i - 1) * -.06; });
    view(lerp(.25, -.1, k), 1.7, lerp(6.4, 5.8, k), .15, 1.45, 0, 34, t); draw();
    if (lt < d * .32) stamp("EXCITED", W * .44, H * .2, lt / .3, "#7a5cff", -.05); });
  // 5 Studie: Draufsicht, rechts = entspannt, links = gestresst
  KZ.shot("tSides", (lt, d, t) => { begin("studio"); const ph = lt / d, right = ph < .5, k = sm(ph);
    place(dog, 0, 0, PI / 2); // Kopf zeigt nach -z = Bild oben
    poseDog(dog, t, { wag: .35, wf: 2.2, bias: right ? .55 : -.55, up: .45, angry: right ? 0 : .5, earsBack: right ? 0 : .6, browsAlways: !right });
    arrows.root.visible = true; arrows.root.position.set(0, .8, .9); arrows.root.rotation.y = PI / 2;
    arrows.list[0].visible = right; arrows.list[1].visible = !right;
    arrows.list.forEach((a) => a.scale.setScalar(.8 + .1 * Math.sin(t * 6)));
    camera.up.set(0, 0, -1); K3.zoom = 1; view(0, 9.5 - k * 1.2, .7, 0, 0, .6, 34, t); K3.zoom = 1.9; camera.up.set(0, 1, 0); draw();
    if (right) stamp("RELAXED", W * .3, H * .1, (lt - .2) / .3, "#36b37e", .05); else stamp("STRESSED", W * .3, H * .1, (lt - d * .5) / .3, "#e5484d", -.05);
    const cp = sm((lt - d * .1) / .3); if (card(W * .42, H * .62, 760, 150, cp, null)) { txt("Quaranta et al., Current Biology, 2007", W * .42, H * .62, 36, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 6 Steifer, hoher, schneller Schwanz
  KZ.shot("tHigh", (lt, d, t) => { begin("studio"); const k = sm(lt / d);
    place(dog, 0, 0, -.35); poseDog(dog, t, { wag: .12, wf: 7, up: 1, stiff: true, angry: 1, growl: sm((lt - d * .5) / .3), frozen: true, browsAlways: true, earsBack: .2 });
    view(lerp(.4, .9, k), 1.2, lerp(4.4, 3.4, k), -.2, 1.0, 0, 32, t); draw();
    if (lt > d * .55) stamp("BACK OFF", W * .4, H * .18, (lt - d * .55) / .3, "#e5484d", -.07);
    const cp = sm((lt - .1) / .3); if (lt < d * .55 && card(W * .42, H * .63, 640, 120, cp)) txt("Source: AKC, VCA Hospitals", W * .42, H * .63, 36, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 7 Pointe: Rüstung, Hund sitzt entspannt
  KZ.shot("tOverkill", (lt, d, t) => { begin("yard"); const k = sm(lt / d);
    place(dog, .9, -.2, PI + .5); poseDog(dog, t, { wag: .6, wf: 2.2, up: .5, wiggle: .6, tongue: true });
    place(rudi, -.6, .2, -.5); poseRudi(rudi, t, { armor: true, arms: [.3, .3], spread: .15, nod: Math.sin(t * 3) * .05 });
    view(lerp(-.4, .2, k), 1.4, lerp(5.6, 4.8, k), 0, .9, 0, 34, t); draw();
    if (lt > d * .35) stamp("OVERKILL", W * .38, H * .19, (lt - d * .35) / .3, "#7a5cff", .06); });
  // 8 Tipp: lockerer, wackelnder Körper -> GO AHEAD
  KZ.shot("tWiggle", (lt, d, t) => { begin("yard"); const k = sm(lt / d);
    place(dog, .8, 0, PI + .35); poseDog(dog, t, { wag: .9, wf: 2.6, up: .45, wiggle: 1.4, tongue: true, tilt: Math.sin(t * 2) * .1 });
    place(rudi, -.75, .4, -.45); poseRudi(rudi, t, { arms: [.2, sm((lt - d * .5) / .4) * .9], spread: .1, mouth: "smile" });
    view(lerp(.6, .2, k), 1.25, lerp(5.2, 4.6, k), -.05, .9, 0, 34, t); draw();
    if (lt < d * .45) stamp("WHOLE DOG", W * .4, H * .18, lt / .3, "#2f6fd0", -.06);
    else stamp("GO AHEAD", W * .4, H * .18, (lt - d * .45) / .3, "#36b37e", -.06); });
  // 9 Steif + starr -> SPACE, dann zurück zur Hook-Einstellung (Loop)
  KZ.shot("tLoop", (lt, d, t) => { begin("yard"); const ph = lt / d;
    if (ph < .6) { const k = sm(ph / .6);
      place(dog, .9, 0, PI + .3); poseDog(dog, t, { wag: .1, wf: 6, up: .9, stiff: true, frozen: true, angry: .8, browsAlways: true });
      place(rudi, lerp(-.5, -1.1, sm(ph / .4)), .4, -.45); poseRudi(rudi, t, { walk: ph < .4 ? -.6 : 0, arms: [.5, .5], spread: .3, mouth: "o" });
      view(.1, 1.3, lerp(4.8, 5.3, k), -.15, .9, 0, 34, t); draw();
      stamp("GIVE SPACE", W * .4, H * .18, (lt - .2) / .3, "#f5a623", .06);
    } else { const k = sm((ph - .6) / .4); // läuft in die Hook-Einstellung hinein
      place(dog, 0, 0, -.55); poseDog(dog, t, { wag: .55, wf: 2.6, up: .6, angry: .55, browsAlways: true });
      view(lerp(2.2, 1.6, k), lerp(1.4, 1.25, k), lerp(4.2, 3.4, k), -.05, .8, 0, 34, t); draw(); } });

  window.__dogTail3d = true;
})();
