// 3D-Szene "Why Raking Every Leaf Hurts Hedgehogs" (18.11.2026). Braunbrustigel (eigener Entwurf), Laubhaufen, Laubteppich,
// Rechen, Laubsauger, Gartensäcke, Hecke, Winternest im Querschnitt, Studio-Infografiken (Monate Nov-März, 30 % Fett, Energie-Akku).
// Quellen: PTES & BHPS "Helping hedgehogs on your land" (2026): Winterschlaf Nov-April, "Hibernation nests (hibernacula) are sturdy
// structures made from deciduous leaves", Stören kostet Energiereserven; Hedgehog Street: "around 30% of their body weight is fat".
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, SPH, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const rnd = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  let hog, rudi, pile, pile2, carpet, hedge, rake, bags, vac, bindle, nest, blanket, hearts;

  // ---------- Laub ----------
  const LEAFC = [0xe8742a, 0xd9481f, 0xf2b134, 0xb5651d, 0xc9361c, 0xf09a2a];
  const leafGeo = new T.SphereGeometry(1, 14, 6);
  let leafMats = null;
  function leaf(i, x, y, z, s, rx, ry, rz) { if (!leafMats) leafMats = LEAFC.map((c) => M(c, { roughness: .75 }));
    const m = new T.Mesh(leafGeo, leafMats[Math.floor(Math.abs(i)) % leafMats.length]); m.position.set(x, y, z); m.scale.set(.085 * s, .014 * s, .05 * s); m.rotation.set(rx || 0, ry || 0, rz || 0); m.castShadow = false; m.receiveShadow = true; return m; }
  // Laubhaufen (Kuppel aus Blättern auf einem braunen Kern), level 0..1 = flachgerecht .. voll
  function makePile(r, h, n) { const root = new T.Group(), inner = new T.Group(); root.add(inner);
    const core = sph(M(0x9a5422, { roughness: .9 }), 0, 0, 0, r * .93, h * .93, r * .93); inner.add(core);
    for (let i = 0; i < n; i++) { const a = rnd(i, 1) * 2 * PI, rr = r * Math.sqrt(rnd(i, 2)) * .98, y = h * Math.sqrt(Math.max(0, 1 - (rr / r) ** 2));
      const x = Math.cos(a) * rr, z = Math.sin(a) * rr; inner.add(leaf(i, x, y, z, 1.1 + rnd(i, 3) * .6, z / r * .9, rnd(i, 4) * 6, -x / r * .9)); }
    function level(l) { const k = Math.max(l, .06); inner.scale.set(1 + (1 - l) * .35, k, 1 + (1 - l) * .35); }
    return { root, inner, level }; }
  // Laubteppich auf dem Rasen (show = Anteil sichtbarer Blätter)
  function makeCarpet() { const root = new T.Group(), list = [];
    for (let i = 0; i < 230; i++) { const l = leaf(i + 7, -2.8 + rnd(i, 5) * 5.6, .012, -2.2 + rnd(i, 6) * 4.0, 1 + rnd(i, 7) * .5, (rnd(i, 8) - .5) * .3, rnd(i, 9) * 6, (rnd(i, 10) - .5) * .3); root.add(l); list.push([l, rnd(i, 11)]); }
    function show(f) { list.forEach(([l, r]) => l.visible = r < f); }
    return { root, show }; }
  // Hecke (Buschreihe)
  function makeHedge() { const root = new T.Group(); const a = M(0x3f8f3e, { roughness: .8 }), b = M(0x4fae4a, { roughness: .8 }), br = M(0x6a4a2a);
    for (const [x, y, z, r, m] of [[-.6, .45, 0, .5, a], [0, .55, -.05, .58, b], [.6, .45, 0, .5, a], [-.3, .85, -.1, .4, b], [.35, .9, -.1, .38, a], [1.05, .38, .05, .4, b], [-1.05, .38, .05, .4, b]]) root.add(sph(m, x, y, z, r, r * .9, r * .8));
    return { root }; }

  // ---------- Igel (eigener Entwurf: braunes Stachelkleid mit hellen Spitzen, helles Gesicht, spitze Schnauze, schwarze Knopfnase,
  // kleine runde Ohren, glänzende schwarze Knopfaugen, kurze Beinchen) ----------
  function makeHog() {
    const spD = M(0x5a3d26, { roughness: .7 }), spL = M(0xe0c8a0, { roughness: .7 }), spM = M(0x8a6440, { roughness: .7 }), coat = M(0x6e4c30, { roughness: .9 });
    const face = M(0xd9b48a, { roughness: .85 }), belly = M(0xc9a27a, { roughness: .9 }), dark = M(0x3a2a1e, { roughness: .6 }), black = M(0x141012, { roughness: .2 });
    const hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), pinkM = M(0xd98a7a, { roughness: .6 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const back = new T.Group(); back.position.set(-.03, .17, 0); body.add(back);
    back.add(sph(coat, 0, 0, 0, .25, .17, .2));
    const cone = new T.ConeGeometry(.017, .11, 5); cone.translate(0, .055, 0); const up = V(0, 1, 0);
    for (let i = 0; i < 190; i++) { const yy = -.2 + rnd(i, 21) * 1.2, a = rnd(i, 22) * 2 * PI, rr = Math.sqrt(Math.max(0, 1 - Math.min(yy, 1) ** 2));
      const d = V(Math.cos(a) * rr, Math.min(yy, 1), Math.sin(a) * rr); if (d.x > .62 && d.y < .7) continue;
      const m = new T.Mesh(cone, i % 3 === 0 ? spL : i % 3 === 1 ? spD : spM); m.position.set(d.x * .24, d.y * .16, d.z * .19);
      m.quaternion.setFromUnitVectors(up, d.clone().add(V(-.75, .15, 0)).normalize()); m.castShadow = i % 4 === 0; back.add(m); }
    body.add(sph(belly, .03, .1, 0, .21, .09, .15));
    const head = new T.Group(); head.position.set(.19, .13, 0); body.add(head);
    head.add(sph(face, 0, 0, 0, .115, .1, .1));
    const snout = mesh(new T.ConeGeometry(.062, .17, 24), face, .13, -.025, 0); snout.rotation.z = -PI / 2; head.add(snout);
    head.add(sph(black, .215, -.026, 0, .03, .028, .03));
    head.add(sph(hl, .23, -.016, .012, .007));
    for (const s of [-1, 1]) { head.add(sph(dark, -.02, .085, s * .065, .032, .036, .018)); head.add(sph(pinkM, -.012, .085, s * .07, .018, .022, .01)); }
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.06, .035, s * .068); head.add(e);
      e.add(sph(black, 0, 0, 0, .03, .034, .024)); e.add(sph(hl, .016, .012, s * .016, .008)); eyes.push(e); }
    const legs = []; for (const [x, z] of [[.12, .09], [.12, -.09], [-.12, .1], [-.12, -.1]]) { const l = limb(.024, .08, dark); l.position.set(x, .08, z); body.add(l); legs.push(l); }
    return { root, body, back, head, eyes, legs };
  }
  // o: {curl 0..1, sleep, wide, sniff, walk, shiver, roll, look, nod, sc}
  function poseHog(B, t, o) { o = o || {}; const c = o.curl || 0;
    B.back.scale.set(1 - c * .12, 1 + c * .3, 1 + c * .05);
    B.head.position.set(.19 - c * .07, .13 - c * .04, 0);
    B.head.rotation.set(0, o.look || 0, -c * .45 + (o.nod || 0) + (o.sniff ? Math.sin(t * 15) * .05 : 0));
    B.legs.forEach((l, i) => { l.visible = c < .6; l.rotation.z = Math.sin(t * 12 + (i % 2) * PI + (i > 1 ? PI : 0)) * .55 * (o.walk || 0); });
    const lid = o.sleep ? .12 : (Math.sin(t * 1.6 + 1) > .985 ? .15 : 1); B.eyes.forEach((e) => e.scale.set(1, lid * (o.wide ? 1.3 : 1), o.wide ? 1.15 : 1));
    B.body.position.y = c * .03 + Math.sin(t * 2.2) * .004 + (o.shiver ? Math.abs(Math.sin(t * 40)) * .008 : 0) + (o.walk ? Math.abs(Math.sin(t * 12)) * .01 : 0);
    B.body.rotation.set(0, 0, (o.shiver ? Math.sin(t * 37) * .035 : 0) + (o.roll || 0));
    B.root.scale.setScalar(o.sc || 1); }

  // ---------- Requisiten ----------
  function makeRake() { const root = new T.Group(); const wd = M(0xc98b4a, { roughness: .7 }), met = M(0x2f9e5a, { roughness: .4 });
    const handle = mesh(CYL, wd, 0, 0, 0, .025, 1, .025); root.add(handle);
    const head = new T.Group(); root.add(head); head.add(mesh(BOX, met, 0, .07, 0, .05, .045, .55));
    for (let i = 0; i < 10; i++) { const tn = mesh(CYL, met, .025, .03, -.25 + i * .055, .009, .09, .009); tn.rotation.z = -.3; head.add(tn); }
    return { root, handle, head }; }
  function stick(m, a, b, r) { const d = b.clone().sub(a); m.position.copy(a).add(d.clone().multiplyScalar(.5)); m.scale.set(r, d.length(), r); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); }
  function rakeAt(R, headP, handP) { R.root.visible = true; R.root.position.set(0, 0, 0); R.root.rotation.set(0, 0, 0); R.head.position.copy(headP); stick(R.handle, headP, handP, .025); }
  function makeBags() { const root = new T.Group(), list = []; const gm = M(0x2f7d3a, { roughness: .55 }), tie = M(0x1f5a28);
    for (const [x, z] of [[0, 0], [.5, .2], [.3, -.42]]) { const b = new T.Group(); b.position.set(x, 0, z); root.add(b);
      b.add(mesh(new T.CylinderGeometry(.22, .25, .62, 24), gm, 0, .31, 0)); b.add(sph(gm, 0, .62, 0, .22, .1, .22)); b.add(mesh(new T.ConeGeometry(.07, .14, 12), tie, 0, .72, 0));
      for (let i = 0; i < 4; i++) b.add(leaf(i + x * 10, Math.cos(i * 1.7) * .1, .7, Math.sin(i * 1.7) * .1, 1, .4, i, .3)); list.push(b); }
    return { root, list }; }
  function makeVac() { const root = new T.Group(); const org = M(0xff7a1a, { roughness: .4 }), gry = M(0x3a3f48, { roughness: .5 });
    const tube = mesh(CYL, gry, 0, 0, 0, .06, 1, .06); root.add(tube);
    const motor = new T.Group(); root.add(motor); motor.add(mesh(BOX, org, 0, 0, 0, .3, .24, .22)); motor.add(mesh(CYL, gry, -.05, .16, 0, .03, .12, .03));
    const nozzle = mesh(new T.CylinderGeometry(.11, .16, .14, 24), org, 0, 0, 0); root.add(nozzle);
    const fly = []; for (let i = 0; i < 7; i++) { const l = leaf(i, 0, 0, 0, 1.3); root.add(l); fly.push(l); }
    return { root, tube, motor, nozzle, fly }; }
  function makeBindle() { const root = new T.Group(); root.add(mesh(CYL, M(0x8a5a3a), 0, 0, 0, .012, .5, .012).rotateZ(-.9));
    const sack = sph(M(0xe23b3b, { roughness: .7 }), .2, .17, 0, .09, .08, .08); root.add(sack);
    for (let i = 0; i < 5; i++) root.add(sph(M(0xffffff), .2 + Math.cos(i * 1.3) * .07, .17 + Math.sin(i * 1.3) * .06, .07, .012)); return { root }; }
  // Winternest im Querschnitt: hintere Hälfte einer Laubkuppel, vorn offen
  function makeNest() { const root = new T.Group(); const shell = mesh(new T.SphereGeometry(1, 40, 20, 0, PI, 0, PI / 2), M(0x7a4a22, { roughness: .95, side: T.DoubleSide }), 0, 0, 0, .7, .55, .7);
    shell.rotation.y = PI; root.add(shell);
    const floor = new T.Mesh(new T.CircleGeometry(.7, 40), M(0x8a5428, { roughness: .95 })); floor.rotation.x = -PI / 2; floor.position.y = .01; floor.receiveShadow = true; root.add(floor);
    for (let i = 0; i < 170; i++) { const a = PI + rnd(i, 31) * PI, th = rnd(i, 32) * PI / 2 * .98; const d = V(Math.cos(a) * Math.sin(th), Math.cos(th), Math.sin(a) * Math.sin(th));
      root.add(leaf(i, d.x * .72, d.y * .57, d.z * .72, 1.3 + rnd(i, 33) * .6, d.z * 1.2, rnd(i, 34) * 6, -d.x * 1.2)); }
    for (let i = 0; i < 26; i++) { const a = rnd(i, 35) * 2 * PI, rr = .3 + rnd(i, 36) * .38; root.add(leaf(i + 3, Math.cos(a) * rr, .03, Math.sin(a) * rr, 1.2, 0, rnd(i, 37) * 6, 0)); }
    return { root }; }
  function makeBlanket() { const root = new T.Group(); const l = leaf(0, 0, 0, 0, 1); l.scale.set(.23, .025, .16); l.material = M(0xe8742a, { roughness: .7 }); root.add(l);
    const rib = mesh(CYL, M(0xb5501a), 0, .02, 0, .006, .4, .006); rib.rotation.z = PI / 2; root.add(rib); return { root }; }
  function heartGeo() { const s = new T.Shape(); s.moveTo(0, -.5); s.bezierCurveTo(-.9, .1, -.5, .75, 0, .35); s.bezierCurveTo(.5, .75, .9, .1, 0, -.5);
    const geo = new T.ExtrudeGeometry(s, { depth: .18, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 4, curveSegments: 20 }); geo.center(); return geo; }
  function makeHearts() { const root = new T.Group(); const geo = heartGeo(), m = M(0xff4d6d, { roughness: .3 }); const list = [];
    for (let i = 0; i < 4; i++) { const h = mesh(geo, m); h.castShadow = false; h.scale.setScalar(.1); root.add(h); list.push(h); } return { root, list }; }

  K3.onBuild(() => {
    rudi = K3.rudi; hog = actor(makeHog(), "Igel"); pile = actor(makePile(.6, .55, 160), "Laubhaufen"); pile2 = actor(makePile(.6, .42, 150), "Laubhaufen 2");
    carpet = actor(makeCarpet(), "Laubteppich"); hedge = actor(makeHedge(), "Hecke"); rake = actor(makeRake(), "Rechen"); bags = actor(makeBags(), "Saecke");
    vac = actor(makeVac(), "Laubsauger"); bindle = actor(makeBindle(), "Buendel"); nest = actor(makeNest(), "Nest"); blanket = actor(makeBlanket(), "Blatt"); hearts = actor(makeHearts(), "Herzen");
    for (const a of [carpet, rake, vac, bindle, blanket, hearts, pile, pile2, nest, hedge]) a.noCheck = true;
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { hog.noCheck = false; hog.root.rotation.set(0, 0, 0); hog.root.position.set(0, 0, 0); rudi.noCheck = false; rudi.body.position.set(0, 0, 0);
    pile.level(1); pile2.level(1); hedge.root.scale.setScalar(1); carpet.show(1); bags.list.forEach((b) => b.scale.setScalar(1)); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const PX = .35, PZ = -.15;      // Laubhaufen im Garten
  function hand(i) { return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function hands() { rudi.root.updateMatrixWorld(true); return hand(0).add(hand(1)).multiplyScalar(.5); }
  function hogAt(x, z, ry, o, t) { hog.root.visible = true; hog.root.position.set(x, 0, z); hog.root.rotation.set(0, ry || 0, 0); poseHog(hog, t, o); }

  // ---------- Hook: Rechen kratzt auf den Laubhaufen zu, ein Igel schaut verschlafen heraus und reißt die Augen auf ----------
  function hookScene(p, t) { inYard(); place(hedge, PX + .1, PZ - .75, 0); place(pile, PX, PZ, 0); place(carpet, 0, 0, 0);
    const wake = sm(clamp((p - .35) / .2, 0, 1)); hog.noCheck = true;
    hogAt(PX + .02, PZ + .42, -PI / 2, { curl: .35 * (1 - wake), sleep: wake < .5, wide: wake > .5, sniff: wake > .8, sc: 1.15 }, t);
    hog.root.position.y = -.06 + wake * .03;
    const stroke = Math.sin(t * 7) * .12, hx = lerp(PX - 1.7, PX - .78, sm(clamp(p, -.4, 1) * .5 + .5)) + stroke;
    rakeAt(rake, V(hx, 0, PZ + .35), V(hx - 1.1, 1.15, PZ + .5));
    frameOn([FR(PX - .55, 0, PZ - .1, PX + .55, .5, PZ + .8)], { az: lerp(.4, .32, clamp(p, 0, 1)), el: .16, fill: lerp(1.05, 1.15, clamp(p, 0, 1)), t }); draw(); return wake; }
  KZ.shot("lHook", (lt, d, t) => { const w = hookScene(lt / d, t); if (w > .3) stamp("OCCUPIED!", W * .42, H * .63, (lt - d * .5) / .3, "#e5484d", .07); });

  // 1 Rudi recht stolz alles weg (Säcke füllen sich), Schnitt: Haufen wird flach, Igel kullert zusammengerollt heraus
  KZ.shot("lRake", (lt, d, t) => { const ph = lt / d;
    if (ph < .5) { const k = ph / .5; inYard(); place(carpet, 0, 0, 0); carpet.show(1 - k * .85);
      place(rudi, -.9, .3, 0); const sw = Math.sin(t * 7); poseRudi(rudi, t, { arms: [.72 + sw * .12, .72 + sw * .12], spread: .02, mouth: "smile", lean: -.05 });
      const hp = hands(); rakeAt(rake, V(hp.x + .95 + sw * .14, 0, hp.z), hp);
      place(bags, -1.75, -.5, 0); bags.list.forEach((b, i) => { const q = clamp((k - .15 - i * .25) / .2, 0, 1); b.visible = q > 0; b.scale.setScalar(easeBack(q) + .001); });
      frameOn([rudi, bags, rake], { az: lerp(.55, .48, k), el: .12, fill: lerp(.95, 1.0, k), t }); draw();
      stamp("TIDY!", W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06); return; }
    const k = (ph - .5) / .5; inYard(); place(hedge, PX + .1, PZ - .75, 0); place(pile, PX, PZ, 0); place(carpet, 0, 0, 0); carpet.show(.15);
    const flat = sm(clamp(k / .35, 0, 1)); pile.level(1 - flat * .9);
    const out = sm(clamp((k - .2) / .4, 0, 1)); hog.noCheck = true;
    hogAt(PX + .02, PZ + .1 + out * .75, -PI / 2, { curl: .9 - sm(clamp((k - .7) / .2, 0, 1)) * .5, wide: k > .55, roll: -out * 2 * PI, sc: 1.15 }, t);
    hog.root.position.y = Math.sin(out * PI) * .08;
    const sw = Math.sin(t * 7) * .15; rakeAt(rake, V(PX - .55 + sw, 0, PZ + .1), V(PX - 1.6 + sw, 1.15, PZ + .25));
    frameOn([FR(PX - .5, 0, PZ, PX + .5, .45, PZ + 1.0)], { az: lerp(.35, .3, k), el: .17, fill: lerp(1.05, 1.12, k), t }); draw();
    stamp("TOO TIDY", W * .42, H * .17, (k - .55) * d * .5 / .3, "#e5484d", .07); });

  // 2 Rudi saugt den ganzen Rasen (Laubsauger), Schnitt: Igel sitzt zitternd unter einem einzigen Blatt
  KZ.shot("lVac", (lt, d, t) => { const ph = lt / d;
    if (ph < .5) { const k = ph / .5; inYard(); place(carpet, 0, 0, 0); carpet.show(.15 * (1 - k));
      place(rudi, -.9 + k * .25, .3, 0); poseRudi(rudi, t, { arms: [.9, .9], spread: .02, mouth: "o", walk: .4 }); rudi.noCheck = true;
      const hp = hands(); vac.root.visible = true; vac.root.position.set(0, 0, 0); vac.motor.position.copy(hp); vac.motor.rotation.set(0, 0, -.3);
      const nz = V(hp.x + 1.0, .1, hp.z); vac.nozzle.position.copy(nz); stick(vac.tube, hp, nz, .06); vac.nozzle.quaternion.copy(vac.tube.quaternion);
      vac.fly.forEach((l, i) => { const q = (t * 1.6 + i / 7) % 1; l.position.set(nz.x + (1 - q) * .9 + Math.sin(i * 3) * .1, .1 + Math.sin(q * PI) * .25 * (1 - q), nz.z + Math.sin(i * 5 + q * 9) * .25 * (1 - q)); l.rotation.set(t * 5 + i, t * 3, i); });
      frameOn([rudi, FR(hp.x + .6, 0, -.3, hp.x + 1.3, .5, .9)], { az: lerp(.5, .44, k), el: .12, fill: lerp(.92, .98, k), t }); draw();
      stamp("VROOOM", W * .42, H * .17, (lt - .15) / .3, "#ff7a1a", -.07); return; }
    const k = (ph - .5) / .5; inYard(); place(hedge, PX + .1, PZ - .75, 0);
    hogAt(PX, PZ + .2, -PI / 2 + .5, { shiver: true, wide: true, nod: -.1, sc: 1.25 }, t); hog.root.updateMatrixWorld(true);
    blanket.root.visible = true; blanket.root.position.copy(hog.back.localToWorld(V(0, .3, 0))); blanket.root.rotation.set(Math.sin(t * 37) * .05, -PI / 2 + .5, -.35); blanket.root.scale.setScalar(1.8);
    frameOn([hog], { az: lerp(.25, .15, k), el: .14, fill: lerp(.72, .8, k), dy: .03, t }); draw();
    stamp("ONE LEAF", W * .42, H * .17, (k - .1) * d * .5 / .3, "#e5484d", .07); });

  // Monats-Pillen (Infografik): Nov-März blau = Winterschlaf
  function months(p) { const names = ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR"];
    names.forEach((n, i) => { const q = clamp((p - i * .06) / .15, 0, 1); if (q <= 0) return; const hib = i >= 2 && i <= 6; const x = W * .42 + (i % 4 - 1.5) * 200, y = H * .585 + Math.floor(i / 4) * 120, k = easeBack(q);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(k, k); g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(-85, -42, 170, 92, 22); g.fill();
      g.fillStyle = hib ? "#2f6fd0" : "#5a5f7a"; g.beginPath(); g.roundRect(-88, -50, 176, 92, 22); g.fill(); g.restore();
      txt(n, x, y - 4, 46, hib ? "#fff" : "#c9cbe0", { a: q, w: 900 }); if (hib) txt("z", x + 62, y - 30, 30, "#ffd84d", { a: q, w: 900 }); }); }
  // 3 Studio: Igel schläft auf Laub, Monate erscheinen (Nov-März blau)
  KZ.shot("lCal", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(pile2, 0, 0, 0); pile2.level(.35); hogAt(0, .05, -PI / 2 + .35, { curl: .75, sleep: true, sc: 2.1 }, t); hog.root.position.y = .12; hog.noCheck = true;
    frameOn([hog, pile2], { az: lerp(.3, .18, k), el: .25, fill: lerp(.56, .62, k), dy: -.05, t }); draw();
    stamp("HIBERNATION", W * .42, H * .17, (lt - .15) / .3, "#2f6fd0", -.06);
    for (let i = 0; i < 3; i++) { const q = ((t * .6 + i / 3) % 1); txt("Z", W * .55 + q * 120, H * .36 - q * 160, 50 + i * 12, "#ffd84d", { a: Math.sin(q * PI), w: 900 }); }
    months(ph * 1.25 - .05); });
  // 4 Studio: Querschnitt Winternest aus Laub unter der Hecke, Igel schläft darin + PTES/BHPS-Karte
  function nestScene(t, k, o) { studio(); place(hedge, 0, -.45, 0); hedge.root.scale.setScalar(1.15); place(nest, 0, 0, 0);
    hogAt(.0, .08, -PI / 2 + .4, Object.assign({ curl: .7, sleep: true, sc: 1.55 }, o || {}), t); hog.noCheck = true;
    frameOn([nest, FR(-.75, 0, -.7, .75, 1.0, .7)], { az: lerp(.12, .04, k), el: .22, fill: lerp(.82, .9, k), dy: -.08, t }); draw(); }
  KZ.shot("lNest", (lt, d, t) => { const ph = lt / d; nestScene(t, sm(ph));
    stamp("LEAF NEST", W * .42, H * .17, (lt - .15) / .3, "#ff9f1c", -.06);
    const cp = sm((lt - d * .3) / .3); if (card(W * .42, H * .63, 840, 250, cp, "PTES & BHPS", "#2f6fd0")) {
      txt("“sturdy structures made", W * .42, H * .63 + 12, 40, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("from deciduous leaves”", W * .42, H * .63 + 64, 40, "#1d2250", { a: clamp(cp, 0, 1) }); } });
  // 5 Studio: dicker Igel, Balken Körpergewicht mit 30 % Fett
  KZ.shot("lFat", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    hogAt(0, 0, -PI / 2 + .55, { sc: 2.4, nod: .05 }, t); hog.back.scale.multiplyScalar(1 + sm(clamp(ph / .4, 0, 1)) * .12); hog.root.position.y = .0;
    frameOn([hog], { az: lerp(.35, .2, k), el: .16, fill: lerp(.66, .72, k), dy: -.12, t }); draw();
    stamp("FAT TANK", W * .42, H * .17, (lt - .15) / .3, "#ff9f1c", -.06);
    const bp = sm(clamp((ph - .15) / .45, 0, 1)), x0 = W * .42 - 380, y = H * .585, bw = 760;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(ph * 5, 0, 1); g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(x0 + 8, y - 50, bw, 110, 28); g.fill();
    g.fillStyle = "#5a5f7a"; g.beginPath(); g.roundRect(x0, y - 58, bw, 110, 28); g.fill();
    g.fillStyle = "#ffc928"; g.beginPath(); g.roundRect(x0, y - 58, Math.max(1, bw * .3 * bp), 110, 28); g.fill(); g.restore();
    if (bp > .2) { txt("FAT " + Math.round(30 * bp) + "%", x0 + 125, y - 3, 44, "#1d2250", { a: bp, w: 900 }); txt("BODY WEIGHT", x0 + 500, y - 3, 40, "#e6e8f5", { a: bp, w: 800 }); }
    const cp = sm((lt - d * .5) / .3); if (card(W * .42, H * .655, 700, 100, cp)) txt("Source: Hedgehog Street", W * .42, H * .655, 34, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 6 Studio: Igel im Nest wird geweckt (Augen auf, zittert), Energie-Akku leert sich
  KZ.shot("lWake", (lt, d, t) => { const ph = lt / d, wk = ph > .22; nestScene(t, sm(ph), wk ? { curl: .35, sleep: false, wide: true, shiver: true } : {});
    stamp(wk ? "WIDE AWAKE" : "ZZZ", W * .42, H * .17, wk ? (ph - .22) * d / .3 : (lt - .05) / .3, wk ? "#e5484d" : "#2f6fd0", -.06);
    const lv = 1 - sm(clamp((ph - .3) / .55, 0, 1)) * .7, x = W * .42, y = H * .575, bw = 560, bh = 120;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#e6e8f5"; g.beginPath(); g.roundRect(x - bw / 2 - 10, y - bh / 2 - 10, bw + 20, bh + 20, 26); g.fill();
    g.fillRect(x + bw / 2 + 10, y - 26, 26, 52); g.fillStyle = "#1d2250"; g.beginPath(); g.roundRect(x - bw / 2, y - bh / 2, bw, bh, 18); g.fill();
    g.fillStyle = lv > .6 ? "#36b37e" : lv > .4 ? "#ffc928" : "#e5484d"; g.beginPath(); g.roundRect(x - bw / 2 + 8, y - bh / 2 + 8, (bw - 16) * lv, bh - 16, 12); g.fill(); g.restore();
    txt("ENERGY " + Math.round(lv * 100) + "%", x, y + 2, 46, "#fff", { w: 900, stroke: 8 });
    const cp = sm((lt - d * .45) / .3); if (card(W * .42, H * .655, 640, 100, cp)) txt("Source: PTES & BHPS", W * .42, H * .655, 34, "#1d2250", { a: clamp(cp, 0, 1) }); });
  // 7 Pointe: kahler Rasen, Igel zieht mit Bündel davon, Rudi kratzt sich am Kopf
  KZ.shot("lEvict", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); place(rudi, -.75, .35, .25); poseRudi(rudi, t, { arms: [2.75, .2], spread: .1, mouth: "o", tilt: -.1 });
    hogAt(lerp(.1, .38, ph), .45, -.25, { walk: 1, sc: 1.35 }, t); hog.root.updateMatrixWorld(true);
    bindle.root.visible = true; bindle.root.position.copy(hog.back.localToWorld(V(-.05, .2, 0))); bindle.root.rotation.set(0, -.25, Math.sin(t * 12) * .06); bindle.root.scale.setScalar(1.35);
    frameOn([rudi, FR(.0, 0, .2, 1.05, .6, .7)], { az: lerp(.5, .44, k), el: .12, fill: lerp(.94, 1.0, k), t }); draw();
    stamp("EVICTED", W * .42, H * .17, (lt - .2) / .3, "#e5484d", .07); });
  // 8 Tipp: Rudi recht das Laub zu einem Haufen unter der Hecke, Igel zieht glücklich ein
  KZ.shot("lTip", (lt, d, t) => { const ph = lt / d;
    if (ph < .5) { const k = ph / .5; inYard(); place(hedge, PX + .1, PZ - .75, 0); place(pile, PX, PZ, 0); pile.level(.15 + sm(k) * .85); place(carpet, 0, 0, 0); carpet.show(.35 * (1 - k));
      place(rudi, -1.1, PZ + .1, 0); const sw = Math.sin(t * 7); poseRudi(rudi, t, { arms: [.72 + sw * .12, .72 + sw * .12], spread: .02, mouth: "smile" });
      const hp = hands(); rakeAt(rake, V(hp.x + .95 + sw * .14, 0, hp.z), hp);
      frameOn([rudi, pile, rake], { az: lerp(.5, .45, k), el: .14, fill: lerp(.98, 1.04, k), t }); draw();
      stamp("UNDER THE HEDGE", W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06); return; }
    const k = (ph - .5) / .5; inYard(); place(hedge, PX + .1, PZ - .75, 0); place(pile, PX, PZ, 0);
    const walk = sm(clamp(k / .6, 0, 1)); hog.noCheck = true; hogAt(lerp(PX - .8, PX - .32, walk), PZ + .55, -PI / 2 + 1.0, { walk: walk < 1 ? 1 : 0, sleep: k > .8, curl: k > .8 ? .3 : 0, sc: 1.2 }, t);
    hearts.root.visible = k > .45; hearts.list.forEach((hh, i) => { const p = clamp((k - .45 - i * .07) / .25, 0, 1); hh.visible = p > 0; hh.position.set(PX - .55 + i * .28, .45 + p * .35, PZ + .35); hh.rotation.y = t * 2 + i; hh.scale.setScalar(.16 * easeBack(p) + .001); });
    frameOn([FR(PX - 1.05, 0, PZ - .3, PX + .65, .7, PZ + .6)], { az: lerp(.3, .22, k), el: .13, fill: lerp(1.0, 1.06, k), t }); draw();
    stamp("HOG HOTEL", W * .42, H * .17, (k - .1) * d * .5 / .3, "#ff9f1c", .06); });
  // 9 Loop: zurück zur Hook-Einstellung (Rechen nähert sich, Igel schläft noch)
  KZ.shot("lLoop", (lt, d, t) => { const ph = lt / d; hookScene(lerp(-.3, 0, ph), t);
    if (ph > .3) stamp("STILL RAKING?", W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__leafhog3d = true;
})();
