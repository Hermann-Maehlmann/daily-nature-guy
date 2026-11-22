// 3D-Szene "Why Mealworms Are Bad For Hedgehogs" / "Warum Mehlwürmer deinem Igel schaden" (22.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Opener-Stil "selbsthilfegruppe": Stuhlkreis mit drei Igeln, Banner "Anonyme Wurmfresser", ein Igel steht auf und gesteht.
// Braunbrustigel (Grundform aus dem Laub-Video 18.11. weiterentwickelt: Mund, Aufrichten, dicker Bauch, Wackelbeine), Mehlwürmer
// (gelbe Segment-Raupen), Schalen (Würmer / Katzenfutter / Wasser), Mini-Stühle, Wurm-Automat "24/7", Wurm-Bar mit Leuchtschild.
// Quellen: Cornwall Wildlife Trust ("Mealworms ... should ideally be avoided since they contain a lot of phosphorus, which can lead to
// metabolic bone disease"; Igel der Station Prickles & Paws konnte nicht mehr laufen), Woodland Trust (Vogelfutter inkl. Mehlwürmer meiden,
// stattdessen Katzen-/Hundefutter mit Fleisch, Igelfutter), Wildlife Online/Marc Baldwin (wenig Kalzium, viel Phosphor -> Knochenschwund;
// Igel "addicted", besuchen pro Nacht viele Gärten, "only a few as a treat" summiert sich), RSPCA (Katzenfutter, flache Schale Wasser, nie Milch).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, card, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const rnd = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return s - Math.floor(s); };
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function scr(v) { const p = v.clone().project(K3.camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; }
  let hog, hog2, hog3, rudi, room, roomBg, wormBowl, bigPile, foodBowl, waterBowl, chairs, banner, vend, bar, hearts, giantWorm, dropWorms;

  // ---------- Mehlwurm (gelb-goldene Larve aus 7 Segmenten, dunkle Ringe, dunkler Kopf) ----------
  const WC = [0xe8b04a, 0xd99a33];
  let wMats = null;
  const segGeo = new T.SphereGeometry(1, 12, 8);
  function worm(i, s, bendAmt) { if (!wMats) wMats = [M(WC[0], { roughness: .35 }), M(WC[1], { roughness: .4 }), M(0x6a3d1a, { roughness: .4 })];
    const root = new T.Group(); const b = bendAmt ?? (rnd(i, 3) - .5) * 1.4;
    for (let k = 0; k < 7; k++) { const u = (k - 3) / 3; const m = new T.Mesh(segGeo, k === 6 ? wMats[2] : wMats[k % 2]);
      m.position.set(u * .065 * s, 0, (1 - Math.cos(u * b)) * .05 * s); const r = (k === 0 || k === 6 ? .011 : .014) * s; m.scale.set(r * 1.05, r, r); m.castShadow = false; m.receiveShadow = true; root.add(m); }
    return root; }
  // Haufen aus Würmern in einer Kuppel (für Schale und Riesenberg)
  function wormHeap(n, r, h, s, seed) { const root = new T.Group(), list = [];
    for (let i = 0; i < n; i++) { const a = rnd(i + seed, 1) * 2 * PI, rr = r * Math.sqrt(rnd(i + seed, 2)), y = h * Math.sqrt(Math.max(0, 1 - (rr / r) ** 2)) * (.55 + rnd(i + seed, 5) * .45);
      const w = worm(i + seed, s); w.position.set(Math.cos(a) * rr, y, Math.sin(a) * rr); w.rotation.set((rnd(i, 6) - .5) * .8, rnd(i, 7) * 6, (rnd(i, 8) - .5) * .8); root.add(w); list.push([w, rnd(i + seed, 9)]); }
    function show(f) { list.forEach(([w, q]) => w.visible = q < f); }
    return { root, list, show }; }

  // ---------- Schalen ----------
  function makeBowl(col, kind) { const root = new T.Group(); const cer = M(col, { roughness: .3 });
    root.add(mesh(new T.CylinderGeometry(.2, .15, .07, 32), cer, 0, .035, 0)); root.add(mesh(new T.TorusGeometry(.19, .018, 10, 36), cer, 0, .07, 0).rotateX(PI / 2));
    const o = { root };
    if (kind === "worms") { o.heap = wormHeap(26, .15, .07, 1.35, 3); o.heap.root.position.y = .06; root.add(o.heap.root); }
    if (kind === "food") { const br = [M(0x8a4a2a, { roughness: .6 }), M(0x6e3a20, { roughness: .6 }), M(0xa35a32, { roughness: .6 })];
      for (let i = 0; i < 26; i++) { const a = rnd(i, 11) * 2 * PI, rr = .15 * Math.sqrt(rnd(i, 12)); root.add(sph(br[i % 3], Math.cos(a) * rr, .07 + rnd(i, 13) * .03, Math.sin(a) * rr, .03, .022, .028)); } }
    if (kind === "water") { const wt = new T.Mesh(new T.CircleGeometry(.175, 32), M(0x3aa0ff, { roughness: .05, metalness: .2, emissive: 0x2a7ad0, emissiveIntensity: .5 })); wt.rotation.x = -PI / 2; wt.position.y = .066; root.add(wt); o.water = wt; }
    return o; }

  // ---------- Igel (Braunbrustigel: Stachelkleid braun mit hellen Spitzen, helles Gesicht, spitze Schnauze, schwarze Knopfnase,
  // kleine runde Ohren, glänzende Knopfaugen, kurze Beinchen; neu: Mund zum Schmatzen, Aufrichten auf die Hinterbeine, Bauch) ----------
  function makeHog(tint) {
    const spD = M(tint ? 0x4a3322 : 0x5a3d26, { roughness: .7 }), spL = M(0xe0c8a0, { roughness: .7 }), spM = M(tint ? 0x7a5a3a : 0x8a6440, { roughness: .7 }), coat = M(0x6e4c30, { roughness: .9 });
    const face = M(tint ? 0xcfa77c : 0xd9b48a, { roughness: .85 }), belly = M(0xc9a27a, { roughness: .9 }), dark = M(0x3a2a1e, { roughness: .6 }), black = M(0x141012, { roughness: .2 });
    const hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), pinkM = M(0xd98a7a, { roughness: .6 }), mouthM = M(0x5a1e1e, { roughness: .5 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const back = new T.Group(); back.position.set(-.03, .17, 0); body.add(back);
    back.add(sph(coat, 0, 0, 0, .25, .17, .2));
    const cone = new T.ConeGeometry(.017, .11, 5); cone.translate(0, .055, 0); const up = V(0, 1, 0);
    for (let i = 0; i < 190; i++) { const yy = -.2 + rnd(i, 21) * 1.2, a = rnd(i, 22) * 2 * PI, rr = Math.sqrt(Math.max(0, 1 - Math.min(yy, 1) ** 2));
      const d = V(Math.cos(a) * rr, Math.min(yy, 1), Math.sin(a) * rr); if (d.x > .62 && d.y < .7) continue;
      const m = new T.Mesh(cone, i % 3 === 0 ? spL : i % 3 === 1 ? spD : spM); m.position.set(d.x * .24, d.y * .16, d.z * .19);
      m.quaternion.setFromUnitVectors(up, d.clone().add(V(-.75, .15, 0)).normalize()); m.castShadow = i % 4 === 0; back.add(m); }
    const bel = sph(belly, .03, .1, 0, .21, .09, .15); body.add(bel);
    const head = new T.Group(); head.position.set(.19, .13, 0); body.add(head);
    head.add(sph(face, 0, 0, 0, .115, .1, .1));
    const snout = mesh(new T.ConeGeometry(.062, .17, 24), face, .13, -.025, 0); snout.rotation.z = -PI / 2; head.add(snout);
    head.add(sph(black, .215, -.026, 0, .03, .028, .03));
    head.add(sph(hl, .23, -.016, .012, .007));
    const mouth = sph(mouthM, .14, -.07, 0, .035, .012, .035); head.add(mouth);
    const earM = M(0xa07a55, { roughness: .8 }); for (const s of [-1, 1]) { head.add(sph(earM, -.03, .088, s * .065, .03, .034, .016)); head.add(sph(pinkM, -.012, .085, s * .07, .018, .022, .01)); }
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.06, .035, s * .068); head.add(e);
      e.add(sph(black, 0, 0, 0, .03, .034, .024)); e.add(sph(hl, .016, .012, s * .016, .008)); eyes.push(e); }
    const legs = []; for (const [x, z] of [[.12, .09], [.12, -.09], [-.12, .1], [-.12, -.1]]) { const l = limb(.024, .08, dark); l.position.set(x, .08, z); body.add(l); legs.push(l); }
    return { root, body, back, bel, head, mouth, eyes, legs };
  }
  // o: {curl, sleep, wide, sniff, walk, chew, stand 0..1, fat 0..1, wobble 0..1, roll, look, nod, sc}
  function poseHog(B, t, o) { o = o || {}; const c = o.curl || 0, st = o.stand || 0, ft = o.fat || 0, wb = o.wobble || 0;
    B.back.scale.set((1 - c * .12) * (1 + ft * .15), (1 + c * .3) * (1 + ft * .1), (1 + c * .05) * (1 + ft * .25));
    B.bel.scale.set(.21 * (1 + ft * .3), .09 * (1 + ft * .6), .15 * (1 + ft * .35)); B.bel.position.y = .1 - ft * .025;
    B.head.position.set(.19 - c * .07, .13 - c * .04, 0);
    B.head.rotation.set(0, o.look || 0, -c * .45 + (o.nod || 0) + (o.sniff ? Math.sin(t * 15) * .05 : 0) - st * .7);
    const ch = o.chew ? (Math.sin(t * 18) > 0 ? 1 : .3) : (o.open ? 1 : 0); B.mouth.visible = ch > 0; B.mouth.scale.set(.035, .006 + ch * .014, .035);
    B.legs.forEach((l, i) => { l.visible = c < .6; const wob = wb ? Math.sin(t * 9 + i * 1.7) * .5 * wb : 0;
      l.rotation.set(wob * .6, 0, Math.sin(t * 12 + (i % 2) * PI + (i > 1 ? PI : 0)) * .55 * (o.walk || 0) + wob + (i < 2 ? st * 1.1 : 0)); });
    const lid = o.sleep ? .12 : (Math.sin(t * 1.6 + 1) > .985 ? .15 : 1); B.eyes.forEach((e) => e.scale.set(1, lid * (o.wide ? 1.3 : 1), o.wide ? 1.15 : 1));
    B.body.position.set(-st * .06, c * .03 + Math.sin(t * 2.2) * .004 + (o.walk ? Math.abs(Math.sin(t * 12)) * .01 : 0) + st * .1 - ft * .0, 0);
    B.body.rotation.set((wb ? Math.sin(t * 7) * .12 * wb : 0), 0, st * .95 + (o.roll || 0));
    B.root.scale.setScalar(o.sc || 1); }

  // ---------- Requisiten ----------
  function makeChair(col) { const root = new T.Group(); const wd = M(col, { roughness: .6 });
    root.add(mesh(BOX, wd, 0, .2, 0, .3, .035, .3)); for (const [x, z] of [[-.12, -.12], [.12, -.12], [-.12, .12], [.12, .12]]) root.add(mesh(CYL, wd, x, .1, z, .018, .2, .018));
    root.add(mesh(BOX, wd, -.14, .36, 0, .03, .3, .3)); return root; }
  function makeChairs() { const root = new T.Group(), list = []; const cols = [0xe5484d, 0x2f6fd0, 0x36b37e, 0xffb52e];
    for (let i = 0; i < 4; i++) { const c = makeChair(cols[i]); root.add(c); list.push(c); } return { root, list }; }
  function makeBanner() { const root = new T.Group();
    const tex = canvasTex(1024, 300, (c, w, h) => { c.fillStyle = "#fff8ec"; c.beginPath(); c.roundRect(6, 6, w - 12, h - 12, 40); c.fill(); c.strokeStyle = "#7a5cff"; c.lineWidth = 14; c.stroke();
      c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = "#3a2a7a"; c.font = '900 92px "Montserrat"'; c.fillText(L("MEALWORMS", "ANONYME"), w / 2, 100); c.fillText(L("ANONYMOUS", "WURMFRESSER"), w / 2, 205); });
    const pl = new T.Mesh(new T.PlaneGeometry(2.4, .7), new T.MeshStandardMaterial({ map: tex, roughness: .8 })); pl.position.y = 1.55; root.add(pl);
    for (const x of [-1.1, 1.1]) root.add(mesh(CYL, M(0x7a5cff), x, 1.55, -.02, .02, .8, .02)); return { root }; }
  function makeVend() { const root = new T.Group(); const red = M(0xe5484d, { roughness: .35 }), dk = M(0x22263a, { roughness: .4 });
    root.add(mesh(BOX, red, 0, .75, 0, .8, 1.5, .55));
    const glass = mesh(BOX, M(0xbfe6ff, { roughness: .05, metalness: .1, transparent: true, opacity: .35 }), .05, .95, .28, .55, .85, .02); root.add(glass);
    root.add(mesh(BOX, dk, .05, .95, .2, .55, .85, .02));
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) { const w = worm(r * 4 + k, 1.6, .9); w.position.set(-.15 + k * .13, .65 + r * .2, .25); root.add(w); }
    root.add(mesh(BOX, dk, .05, .2, .28, .45, .14, .03));
    const sign = canvasTex(512, 160, (c, w, h) => { c.fillStyle = "#ffd23f"; c.fillRect(0, 0, w, h); c.fillStyle = "#1d2250"; c.font = '900 84px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(L("WORMS 24/7", "WÜRMER 24/7"), w / 2, h / 2 + 4); });
    const sp = new T.Mesh(new T.PlaneGeometry(.78, .24), new T.MeshStandardMaterial({ map: sign, emissive: 0xffffff, emissiveMap: sign, emissiveIntensity: .35 })); sp.position.set(0, 1.62, .28); root.add(sp);
    root.add(mesh(CYL, M(0x36b37e, { emissive: 0x36b37e, emissiveIntensity: .5 }), .3, .45, .29, .04, .02, .04).rotateX(PI / 2));
    return { root }; }
  function makeBar() { const root = new T.Group(); const wd = M(0x8a4a2a, { roughness: .5 }), top = M(0x5a2e18, { roughness: .3 });
    root.add(mesh(BOX, wd, 0, .3, 0, 2.0, .6, .45)); root.add(mesh(BOX, top, 0, .62, 0, 2.1, .05, .55));
    const sign = canvasTex(768, 200, (c, w, h) => { c.fillStyle = "#1d1240"; c.beginPath(); c.roundRect(0, 0, w, h, 30); c.fill(); c.shadowColor = "#ff4dc4"; c.shadowBlur = 30;
      c.fillStyle = "#ff7ad9"; c.font = '900 120px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(L("WORM BAR", "WURM-BAR"), w / 2, h / 2 + 6); });
    const sp = new T.Mesh(new T.PlaneGeometry(1.5, .4), new T.MeshStandardMaterial({ map: sign, emissive: 0xffffff, emissiveMap: sign, emissiveIntensity: .8 })); sp.position.set(0, 2.6, -.6); root.add(sp);
    const stools = []; for (let i = 0; i < 3; i++) { const s = new T.Group(); s.position.set(-.6 + i * .6, 0, .45); s.add(mesh(CYL, M(0x22263a), 0, .22, 0, .025, .44, .025)); s.add(mesh(new T.CylinderGeometry(.13, .13, .04, 24), M(0xe5484d, { roughness: .4 }), 0, .45, 0)); root.add(s); stools.push(s); }
    const bowls = []; for (let i = 0; i < 3; i++) { const b = makeBowl(0xffffff, "worms"); b.root.position.set(-.48 + i * .6, .645, .17); b.root.scale.setScalar(.55); root.add(b.root); bowls.push(b); }
    stools.forEach((s) => s.visible = false);
    return { root, stools, bowls }; }
  function heartGeo() { const s = new T.Shape(); s.moveTo(0, -.5); s.bezierCurveTo(-.9, .1, -.5, .75, 0, .35); s.bezierCurveTo(.5, .75, .9, .1, 0, -.5);
    const geo = new T.ExtrudeGeometry(s, { depth: .18, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 4, curveSegments: 20 }); geo.center(); return geo; }
  function makeHearts() { const root = new T.Group(); const geo = heartGeo(), m = M(0xff4d6d, { roughness: .3 }); const list = [];
    for (let i = 0; i < 4; i++) { const h = mesh(geo, m); h.castShadow = false; h.scale.setScalar(.1); root.add(h); list.push(h); } return { root, list }; }
  function makeDrops() { const root = new T.Group(), list = []; for (let i = 0; i < 8; i++) { const w = worm(i + 40, 1.3); root.add(w); list.push(w); } return { root, list }; }
  // Zimmer für die Selbsthilfegruppe (Holzboden, gestreifte Wand, Fenster, Teppich, Regal, Pflanze)
  function makeRoomW() {
    const r = new T.Group(); r.visible = false; K3.scene.add(r);
    const wood = canvasTex(512, 512, (c, w, h) => { for (let i = 0; i < 8; i++) { c.fillStyle = ["#c8935e", "#bd8752", "#d29d68", "#c28c58"][i % 4]; c.fillRect(0, i * h / 8, w, h / 8); c.fillStyle = "rgba(90,50,20,.35)"; c.fillRect(0, i * h / 8, w, 3); c.fillRect((i * 173) % w, i * h / 8, 3, h / 8); } });
    wood.wrapS = wood.wrapT = T.RepeatWrapping; wood.repeat.set(6, 6);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ map: wood, roughness: .7 })); floor.rotation.x = -PI / 2; floor.receiveShadow = true; r.add(floor);
    const wallTex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = "#efe3fb"; c.fillRect(0, 0, w, h); c.fillStyle = "#e2d3f3"; for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 14, h); });
    wallTex.wrapS = wallTex.wrapT = T.RepeatWrapping; wallTex.repeat.set(10, 3);
    r.add(mesh(BOX, new T.MeshStandardMaterial({ map: wallTex, roughness: .9 }), 0, 2.5, -3, 30, 5, .2));
    r.add(mesh(BOX, M(0xffffff), 0, .08, -2.88, 30, .16, .06));
    const rug = new T.Mesh(new T.CircleGeometry(1.8, 48), M(0x36b37e, { roughness: 1 })); rug.rotation.x = -PI / 2; rug.position.set(0, .006, 0); rug.scale.set(1, .8, 1); rug.receiveShadow = true; r.add(rug);
    const rug2 = new T.Mesh(new T.RingGeometry(1.6, 1.75, 48), M(0xffd23f, { roughness: 1 })); rug2.rotation.x = -PI / 2; rug2.position.set(0, .008, 0); rug2.scale.set(1, .8, 1); r.add(rug2);
    const pl = new T.Group(); pl.position.set(-2.4, 0, -2.4); r.add(pl); pl.add(mesh(new T.CylinderGeometry(.25, .18, .45, 24), M(0xe0603c), 0, .22, 0));
    for (let i = 0; i < 7; i++) { const a = i / 7 * 2 * PI; const lf = sph(M(i % 2 ? 0x4fae4a : 0x3f9a3c), Math.cos(a) * .2, .75 + (i % 3) * .1, Math.sin(a) * .2, .1, .35, .05); lf.rotation.set(Math.sin(a) * .5, -a, Math.cos(a) * .5); pl.add(lf); }
    // Tisch mit Kaffeekanne und Keksteller
    const tb = new T.Group(); tb.position.set(2.2, 0, -2.3); r.add(tb); tb.add(mesh(BOX, M(0x8a5a3a), 0, .5, 0, 1.0, .05, .5)); for (const x of [-.42, .42]) tb.add(mesh(BOX, M(0x6e4628), x, .25, 0, .05, .5, .4));
    tb.add(mesh(new T.CylinderGeometry(.09, .11, .26, 20), M(0xe5484d, { roughness: .3 }), -.2, .66, 0)); tb.add(mesh(new T.CylinderGeometry(.16, .16, .02, 24), M(0xffffff), .2, .54, 0));
    return r;
  }

  K3.onBuild(() => {
    rudi = K3.rudi; hog = actor(makeHog(), "Igel"); hog2 = actor(makeHog(1), "Igel 2"); hog3 = actor(makeHog(1), "Igel 3");
    wormBowl = actor(makeBowl(0x2f6fd0, "worms"), "Wurmschale"); foodBowl = actor(makeBowl(0xe5484d, "food"), "Futterschale"); waterBowl = actor(makeBowl(0x2f6fd0, "water"), "Wasserschale");
    bigPile = actor(wormHeap(170, .7, .5, 2.6, 50), "Wurmberg"); giantWorm = actor({ root: worm(1, 14, .9) }, "Riesenwurm");
    chairs = actor(makeChairs(), "Stuehle"); banner = actor(makeBanner(), "Banner"); vend = actor(makeVend(), "Automat"); bar = actor(makeBar(), "Bar");
    hearts = actor(makeHearts(), "Herzen"); dropWorms = actor(makeDrops(), "Fallwuermer");
    for (const a of [wormBowl, foodBowl, waterBowl, bigPile, chairs, banner, hearts, dropWorms, bar]) a.noCheck = true;
    room = makeRoomW(); roomBg = new T.Color(0xf3ecfa).convertSRGBToLinear();
    K3.studio.traverse((m) => { if (m.isMesh && m.scale.x < .1) m.castShadow = false; });
  });
  function reset() { for (const h of [hog, hog2, hog3]) { h.noCheck = false; h.root.rotation.set(0, 0, 0); h.root.position.set(0, 0, 0); } rudi.noCheck = false; rudi.body.position.set(0, 0, 0);
    wormBowl.heap.show(1); bigPile.show(1); room.visible = false; }
  function inYard() { begin("yard"); reset(); }
  function inRoom() { begin("yard"); reset(); K3.yard.visible = false; room.visible = true; K3.scene.background = roomBg; K3.scene.fog = new T.Fog(0xf3ecfa, 16, 40); K3.hemi.intensity = .8; }
  function studio() { begin("studio"); reset(); }
  function hand(i) { rudi.root.updateMatrixWorld(true); return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function hogAt(B, x, z, ry, o, t, y) { B.root.visible = true; B.root.position.set(x, y || 0, z); B.root.rotation.set(0, ry || 0, 0); poseHog(B, t, o); }
  function at(o, x, z, ry, y, s) { place(o, x, z, ry); o.root.position.y = y || 0; if (s) o.root.scale.setScalar(s); }
  // 2D-Wurm (Infografik)
  function worm2d(x, y, s, a, rot) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.translate(x, y); g.rotate(rot || 0);
    for (let k = 0; k < 7; k++) { const u = (k - 3) / 3; g.fillStyle = k === 6 ? "#6a3d1a" : k % 2 ? "#d99a33" : "#e8b04a"; g.beginPath(); g.ellipse(u * 22 * s, Math.cos(u * 1.2) * -6 * s, (k === 0 || k === 6 ? 8 : 10) * s, 10 * s, 0, 0, 2 * PI); g.fill(); }
    g.restore(); }

  // ---------- 0 Hook: Igel vor einem Berg Mehlwürmer, reißt die Augen auf und schnüffelt ----------
  function hookScene(p, t) { inYard(); at(bigPile, .15, -.35, 0, 0, 1);
    hogAt(hog, -.55, .45, -PI / 2 + 1.05, { wide: true, sniff: true, open: p > .4, sc: 1.6 }, t);
    frameOn([hog, FR(-.55, 0, -.9, .85, .6, .3)], { az: lerp(.3, .2, clamp(p, 0, 1)), el: .22, fill: lerp(.95, 1.04, clamp(p, 0, 1)), t }); draw(); }
  KZ.shot("mHook", (lt, d, t) => { hookScene(lt / d, t); stamp(L("YUMMY?", "LECKER?"), W * .42, H * .63, (lt - d * .45) / .3, "#ff9f1c", -.07); });

  // ---------- 1 Selbsthilfegruppe: Stuhlkreis, Banner, ein Igel steht auf ----------
  function groupScene(t, k, st, o) { inRoom(); place(banner, 0, -2.85, 0); place(chairs, 0, 0, 0);
    const pos = [[0, -.45, -PI / 2], [-.55, .05, 0], [.55, .05, PI], [0, .65, -PI / 2]];
    chairs.list.forEach((c, i) => { c.visible = i < 3; c.position.set(pos[i][0], 0, pos[i][1]); c.rotation.y = pos[i][2]; });
    hogAt(hog, 0, -.45, PI / 2 - PI, Object.assign({ stand: st, sc: 1.05 }, o || {}), t, .22); hog.root.rotation.y = -PI / 2;
    hogAt(hog2, -.55, .05, 0, { look: .5, nod: Math.sin(t * 3) * .05, sc: 1 }, t, .22); hog2.root.rotation.y = .5;
    hogAt(hog3, .55, .05, 0, { look: -.5, sc: 1 }, t, .22); hog3.root.rotation.y = PI - .5;
    frameOn([FR(-.75, 0, -.65, .75, .55, .3)], { az: lerp(.1, 0, k), el: lerp(.3, .24, k), fill: lerp(.66, .72, k), dy: .1, t }); draw(); }
  KZ.shot("mGroup", (lt, d, t) => { const ph = lt / d; const st = sm(clamp((ph - .3) / .2, 0, 1));
    groupScene(t, sm(ph), st, { wide: ph > .65, open: ph > .5 && ph < .9 && Math.sin(t * 14) > 0 });
    if (ph < .62) stamp(L("NIGHT 1", "ABEND 1"), W * .42, H * .63, (lt - .1) / .3, "#7a5cff", -.06);
    if (ph > .62) stamp(L("HOOKED", "SÜCHTIG"), W * .42, H * .63, (ph - .62) * d / .3, "#e5484d", .07); });

  // ---------- 2 Rudi stellt eine Schale Würmer hin; Schnitt: Schale leer, Igel kugelrund ----------
  KZ.shot("mBowl", (lt, d, t) => { const ph = lt / d;
    if (ph < .5) { const k = ph / .5; inYard(); place(rudi, -.6, -.1, 0); poseRudi(rudi, t, { arms: [.2, lerp(1.4, .9, sm(k))], spread: .05, mouth: "smile", lean: .08 * (1 - k) });
      at(wormBowl, .35, .35, 0, 0, 1.6);
      hogAt(hog, lerp(1.3, .95, sm(clamp(k * 1.6, 0, 1))), .45, -PI / 2 - .9, { walk: k < .6 ? 1 : 0, sniff: k > .6, sc: 1.3 }, t);
      frameOn([rudi, wormBowl, hog], { az: lerp(.5, .42, k), el: .14, fill: lerp(.92, .98, k), t }); draw();
      stamp(L("TREAT TIME!", "LECKERLI!"), W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06); return; }
    const k = (ph - .5) / .5; inYard(); at(wormBowl, .45, .35, 0, 0, 1.6); wormBowl.heap.show(1 - sm(clamp(k / .45, 0, 1)));
    hogAt(hog, -.2, -.05, -.55, { chew: k < .5, fat: sm(clamp(k / .5, 0, 1)), wide: k > .55, sc: 1.6 }, t);
    frameOn([hog, wormBowl], { az: lerp(.3, .22, k), el: .2, fill: lerp(.82, .9, k), t }); draw();
    stamp(L("GONE!", "WEG!"), W * .42, H * .17, (k - .45) * d * .5 / .3, "#e5484d", .07); });

  // ---------- 3 Igel verschmäht Katzenfutter; Schnitt: Rudi baut einen Wurm-Automaten, Würmer fallen raus ----------
  KZ.shot("mVend", (lt, d, t) => { const ph = lt / d;
    if (ph < .42) { const k = ph / .42; inYard(); at(foodBowl, .4, .35, 0, 0, 1.6);
      hogAt(hog, -.25, -.05, -.5, { look: sm(clamp((k - .2) / .3, 0, 1)) * -1.3, nod: .15, sc: 1.6 }, t);
      frameOn([hog, foodBowl], { az: lerp(.3, .2, k), el: .18, fill: lerp(.82, .9, k), t }); draw();
      stamp(L("NOPE", "NÖ"), W * .42, H * .17, (lt - .35) / .3, "#e5484d", -.07); return; }
    const k = (ph - .42) / .58; inYard(); place(vend, .15, -.45, -.25); place(rudi, -.95, .05, .2); poseRudi(rudi, t, { arms: [.2, 1.25], spread: .05, mouth: "smile" });
    hogAt(hog, .55, .3, -PI / 2 + .9, { wide: true, chew: k > .45, sc: 1.4 }, t);
    dropWorms.root.visible = true; dropWorms.root.position.set(0, 0, 0); dropWorms.list.forEach((w, i) => { const q = ((t * 1.3 + i / 8) % 1); w.visible = k > .25;
      w.position.set(.25 + Math.sin(i * 2.3) * .08, lerp(.22, .03, Math.min(1, q * 2)), -.05 + q * .3); w.rotation.set(t * 4 + i, i, t * 3); });
    frameOn([rudi, vend, hog], { az: lerp(.45, .38, k), el: .14, fill: lerp(.9, .97, k), t }); draw();
    stamp("24/7", W * .42, H * .17, (k - .2) * d * .58 / .3, "#ffb52e", .07); });

  // ---------- Balken-Infografik ----------
  function bars(ph, a) { const x0 = W * .42 - 380, bw = 760, rows = [[L("PHOSPHORUS", "PHOSPHOR"), 1, "#e5484d"], [L("CALCIUM", "KALZIUM"), .07, "#2f9e5a"]];
    rows.forEach(([n, v, col], i) => { const y = H * .56 + i * 150, q = sm(clamp((ph - .12 - i * .28) / .35, 0, 1)); if (q <= 0) return;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = clamp(q * 4, 0, 1) * a; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(x0 + 8, y - 40, bw, 96, 26); g.fill();
      g.fillStyle = "#3a3f6a"; g.beginPath(); g.roundRect(x0, y - 48, bw, 96, 26); g.fill();
      g.fillStyle = col; g.beginPath(); g.roundRect(x0, y - 48, Math.max(52, bw * v * q), 96, 26); g.fill(); g.restore();
      txt(n, x0 + (v > .5 ? 30 : 80), y + 1, 44, "#fff", { a: q * a, w: 900, align: "left", stroke: v > .5 ? 0 : 6 }); }); }
  // ---------- 4 Studio: Riesen-Mehlwurm auf dem Sockel, Balken Phosphor riesig, Kalzium winzig ----------
  KZ.shot("mBars", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(giantWorm, 0, 0, .5 + Math.sin(t * 1.5) * .15, .22, 1); giantWorm.root.rotation.z = Math.sin(t * 3) * .05;
    frameOn([giantWorm], { az: lerp(.4, .25, k), el: .25, fill: lerp(.55, .62, k), dy: -.3, t }); draw();
    stamp(L("MEALWORM", "MEHLWURM"), W * .42, H * .17, (lt - .1) / .3, "#ffb52e", -.06); bars(ph * 1.2, 1); });

  // ---------- 5 Studio: Igel mit Röntgen-Kreis, Knochen werden blass und bekommen Risse ----------
  function bone2d(x, y, len, a, crack) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.translate(x, y); g.fillStyle = "#f4f7ff";
    const r = len * .13; g.beginPath(); g.roundRect(-len / 2, -r * .55, len, r * 1.1, r * .5); g.fill();
    for (const s of [-1, 1]) for (const u of [-1, 1]) { g.beginPath(); g.arc(s * len / 2, u * r * .55, r * .62, 0, 2 * PI); g.fill(); }
    if (crack > 0) { g.strokeStyle = "#e5484d"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(-len * .05, -r * .6); g.lineTo(len * .04, -r * .1); g.lineTo(-len * .04, r * .2); g.lineTo(len * .05 * crack, r * .6); g.stroke(); }
    g.restore(); }
  KZ.shot("mBones", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    hogAt(hog, 0, 0, -PI / 2 + .6, { wide: ph > .5, sc: 2.3 }, t);
    frameOn([hog], { az: lerp(.35, .22, k), el: .16, fill: lerp(.55, .6, k), dy: -.3, t }); draw();
    const cx = W * .42, cy = H * .55, R = 190, a = clamp((ph - .08) * 5, 0, 1);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.arc(cx + 10, cy + 14, R, 0, 2 * PI); g.fill();
    g.fillStyle = "#14204a"; g.beginPath(); g.arc(cx, cy, R, 0, 2 * PI); g.fill(); g.strokeStyle = "#7fd3ff"; g.lineWidth = 12; g.stroke(); g.restore();
    const fade = sm(clamp((ph - .4) / .4, 0, 1));
    bone2d(cx, cy - 35, 250, a * (1 - fade * .6), fade > .3 ? fade : 0); bone2d(cx - 15, cy + 65, 185, a * (1 - fade * .65), fade > .5 ? fade : 0);
    for (let i = 0; i < 4; i++) { const q = clamp(((t * .9 + i / 4) % 1), 0, 1), on = ph > .3 ? 1 : 0; txt("Ca", cx + 120 + q * 160, cy - 60 - q * 140 + i * 40, 46, "#7fe0a0", { a: on * a * Math.sin(q * PI), w: 900 }); }
    stamp(L("BONE ALERT", "KNOCHEN-ALARM"), W * .42, H * .17, (lt - .2) / .3, "#e5484d", -.06); });

  // ---------- 6 Igel will laufen, Beine wackeln, kippt um; Quellenkarte Cornwall Wildlife Trust ----------
  KZ.shot("mWobble", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); place(rudi, -.9, -.9, -.35); poseRudi(rudi, t, { arms: [2.6, 2.6], spread: .25, mouth: "o", wide: true });
    const fall = sm(clamp((ph - .45) / .2, 0, 1));
    hogAt(hog, lerp(.05, .25, clamp(ph * 2, 0, 1)), .45, -.9, { wobble: 1 - fall * .7, walk: ph < .45 ? .4 : 0, wide: true, roll: fall * .9, sc: 1.9 }, t); hog.root.position.y = fall * .05;
    frameOn([rudi, hog], { az: lerp(.5, .42, k), el: .14, fill: lerp(.92, .98, k), dy: .2, t }); draw();
    if (ph < .42) stamp(L("WOBBLY", "WACKELIG"), W * .42, H * .17, (lt - .2) / .3, "#ff9f1c", -.06);
    const cp = sm((lt - d * .45) / .3); if (card(W * .42, H * .2, 860, 250, cp, "Cornwall Wildlife Trust", "#2f9e5a")) {
      txt("“a lot of phosphorus, which can", W * .42, H * .2 + 14, 38, "#1d2250", { a: clamp(cp, 0, 1) });
      txt("lead to metabolic bone disease”", W * .42, H * .2 + 64, 38, "#1d2250", { a: clamp(cp, 0, 1) }); } });

  // ---------- 7 Studio: Igel wandert, 4 Gärten erscheinen, jeder gibt "ein paar", Würmer stapeln sich ----------
  KZ.shot("mGardens", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    hogAt(hog, 0, 0, -PI / 2 + .5, { walk: 1, sc: 2.4 }, t);
    frameOn([hog], { az: lerp(.4, .3, k), el: .2, fill: lerp(.46, .5, k), dy: -1.25, t }); draw();
    const n = 4;
    for (let i = 0; i < n; i++) { const q = sm(clamp((ph - .05 - i * .13) / .12, 0, 1)); if (q <= 0) continue; const x = W * .42 + (i % 2 - .5) * 250, y = H * .415 + Math.floor(i / 2) * 200, s = easeBack(q);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(s, s); g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.roundRect(-104, -78, 220, 175, 26); g.fill();
      g.fillStyle = "#4fae4a"; g.beginPath(); g.roundRect(-110, -86, 220, 175, 26); g.fill(); g.fillStyle = "#e5484d"; g.beginPath(); g.moveTo(-40, -32); g.lineTo(0, -70); g.lineTo(40, -32); g.fill(); g.fillStyle = "#fff8ee"; g.fillRect(-32, -32, 64, 44); g.restore();
      txt(L("+ a few", "+ ein paar"), x, y + 50, 36, "#fff", { a: q, w: 900, stroke: 6 }); }
    const pileQ = sm(clamp((ph - .55) / .35, 0, 1)); const total = Math.round(pileQ * 28);
    for (let i = 0; i < total; i++) { const row = Math.floor(i / 10), x = W * .42 + ((i * 7) % 10 - 4.5) * (52 - row * 10), yy = H * .665 - row * 26 - (i % 2) * 6; worm2d(x, yy, 1.15, 1, (i * 1.3) % 1 - .5); }
    stamp(L("EVERY NIGHT", "JEDE NACHT"), W * .42, H * .17, (lt - .1) / .3, "#2f6fd0", -.06); });

  // ---------- 8 Pointe: Rudi hinter der Wurm-Bar, drei Igel auf Hockern ----------
  KZ.shot("mPunch", (lt, d, t) => { inRoom(); const ph = lt / d, k = sm(ph); place(bar, 0, 0, 0); place(rudi, 0, -.6, 0); poseRudi(rudi, t, { arms: [.3, 1.2 + Math.sin(t * 6) * .2], spread: .05, mouth: "smile" });
    rudi.noCheck = true;
    [hog, hog2, hog3].forEach((h, i) => { hogAt(h, -.65 + i * .6, -.06, -PI / 2 + .55, { chew: (i + Math.floor(t * 2)) % 2 === 0, fat: .6, nod: .2, sc: .95 }, t, .645); h.noCheck = true; });
    frameOn([bar, FR(-1.05, 0, -.7, 1.05, 2.8, .8)], { az: lerp(.45, .35, k), el: .18, fill: lerp(1.0, 1.08, k), dy: -.15, t }); draw();
    stamp(L("HAPPY HOUR", "HAPPY HOUR"), W * .42, H * .63, (lt - .3) / .3, "#ff4dc4", .06); });

  // ---------- 9 Tipp: Katzenfutter + flache Schale Wasser, Igel frisst glücklich, Herzen ----------
  KZ.shot("mTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph); at(foodBowl, .3, .3, 0, 0, 1.5); at(waterBowl, .75, -.25, 0, 0, 1.5);
    hogAt(hog, -.3, -.05, -.55, { chew: ph > .25, sc: 1.4 }, t);
    hearts.root.visible = ph > .45; hearts.list.forEach((hh, i) => { const p = clamp((ph - .45 - i * .07) / .25, 0, 1); hh.visible = p > 0; hh.position.set(-.45 + i * .22, .55 + p * .3, -.05); hh.rotation.y = t * 2 + i; hh.scale.setScalar(.12 * easeBack(p) + .001); });
    frameOn([hog, foodBowl, waterBowl], { az: lerp(.3, .2, k), el: .22, fill: lerp(.86, .94, k), t }); draw();
    stamp(L("HOG MENU", "IGEL-MENÜ"), W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    const cp = sm((lt - d * .35) / .3); if (card(W * .42, H * .64, 760, 100, cp)) txt(L("Cat food + water. Never milk!", "Katzenfutter + Wasser. Nie Milch!"), W * .42, H * .64, 36, "#1d2250", { a: clamp(cp, 0, 1), w: 800 }); });

  // ---------- 10 Loop: zurück zur Hook-Einstellung ----------
  KZ.shot("mLoop", (lt, d, t) => { const ph = lt / d; hookScene(lerp(-.4, 0, ph), t);
    if (ph > .3) stamp(L("STILL WORMS?", "NOCH WÜRMER?"), W * .42, H * .17, (ph - .3) * d / .3, "#7a5cff", -.06); });

  window.__hogworm3d = true;
})();
