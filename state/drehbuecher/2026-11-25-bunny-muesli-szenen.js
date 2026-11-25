// 3D-Szene "Why Rabbit Muesli Wrecks Your Bunny's Teeth" / "Warum Müsli die Zähne deines Kaninchens ruiniert" (25.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Hauskaninchen "Hoppel" (Figur aus den Kaninchen-Videos, Zähne wachsen über poseBunny teeth), Müslischale mit bunten Stücken (süße Flocken/Kringel + grüne Pellets/Halme),
// Müslisack mit Regenbogen-Etikett, Flocken-Regen, Kochmütze für Rudi, Nagelfeile, Heuhaufen; 2D: Kochshow-Banner, Balken-Infografiken.
// Opener-Stil "kochshow": "Willkommen bei Rudis Kochshow! Heute: bunte Knusperflocken."
// Quellen: PDSA "Feeding your rabbits" + Faltblatt "Don't feed rabbit muesli" (Zähne wachsen lebenslang, Müsli nutzt sie nicht ab, selektives Fressen,
// Heu mind. so groß wie das Kaninchen pro Tag, Müsli über 2–4 Wochen absetzen), BVNA/Lord 2022 (Schneidezähne 2–2,5 mm pro Woche ≈ 10–13 cm pro Jahr),
// Uni Edinburgh, Meredith et al. (Fütterungsversuch, 32 Kaninchen: 37,5 % der Gruppe "nur Müsli" bekam klinische Zahnkrankheit, "nur Heu" keine).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, card, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const QUIZ = () => [L("4+ inches", "Über 10 cm"), L("Half an inch", "1 cm"), L("1/10 inch", "2 mm")];
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  let bun, rudi, bowl, bag, rain, file, hay, toque, left;

  // ---------- Hauskaninchen (wie Leinen-Video, ohne Geschirr) ----------
  const FUR = 0xb98a5e;
  function makeBunny() {
    const fur = M(FUR, { roughness: .8 }), furD = M(new T.Color(FUR).multiplyScalar(.8).getHex(), { roughness: .8 }), cream = M(0xf6e7cf, { roughness: .85 }), white = M(0xffffff, { roughness: .9 });
    const pink = M(0xffa3b1, { roughness: .6 }), eyeM = M(0x2a1610, { roughness: .1 }), tooth = M(0xfffaf0, { roughness: .3 });
    const root = new T.Group(), body = new T.Group(); root.add(body);
    body.add(sph(fur, -.08, .22, 0, .27, .23, .24));
    body.add(sph(fur, .1, .25, 0, .18, .19, .17));
    body.add(sph(cream, .15, .2, 0, .12, .14, .13));
    body.add(sph(cream, -.02, .09, 0, .24, .1, .17));
    body.add(sph(furD, -.12, .38, 0, .16, .07, .14));
    const tail = sph(white, -.34, .27, 0, .075, .075, .075); body.add(tail);
    const hind = []; for (const s of [-1, 1]) { const hl2 = new T.Group(); hl2.position.set(-.1, .16, s * .15); body.add(hl2);
      hl2.add(sph(fur, 0, 0, 0, .13, .13, .07)); hl2.add(sph(cream, .1, -.125, 0, .16, .042, .06)); hind.push(hl2); }
    const front = []; for (const s of [-1, 1]) { const f = limb(.035, .16, fur); f.position.set(.17, .17, s * .075); f.add(sph(cream, .025, -.165, 0, .05, .028, .04)); body.add(f); front.push(f); }
    const head = new T.Group(); head.position.set(.24, .43, 0); body.add(head);
    head.add(sph(fur, 0, 0, 0, .15, .14, .135));
    for (const s of [-1, 1]) head.add(sph(cream, .1, -.045, s * .042, .06, .052, .055));
    const nose = sph(pink, .155, -.012, 0, .022, .018, .026); head.add(nose);
    // zwei Schneidezähne unter der Nase, wachsen nach unten (teeth = Länge, 1 normal)
    const teeth = new T.Group(); teeth.position.set(.142, -.075, 0); head.add(teeth);
    for (const s of [-1, 1]) teeth.add(mesh(BOX, tooth, 0, -.018, s * .012, .014, .036, .022));
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.065, .035, s * .1); head.add(e);
      const ey = K3.eye(.05, { white: M(0x5a3420, { roughness: .2 }), pupil: eyeM }); ey.scale.set(.75, 1.1, .8); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, furD, .07, .1, s * .09, .05, .012, .02); head.add(b); brows.push(b); }
    const wh = M(0xffffff, { roughness: .4 }); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .12, -.04 + i * .02, s * .1, .004, .16, .004); w.rotation.x = s * (PI / 2 - .25 + i * .18); w.castShadow = false; head.add(w); }
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.04, .1, s * .055); head.add(e);
      e.add(sph(fur, 0, .2, 0, .035, .22, .07)); e.add(sph(pink, .02, .2, 0, .02, .17, .05)); ears.push(e); }
    // Halm im Maul (für Heu-Szenen)
    const straw = mesh(CYL, M(0xd8c46a, { roughness: .8 }), .16, -.06, 0, .008, .22, .008); straw.rotation.x = PI / 2; straw.visible = false; head.add(straw);
    return { root, body, head, ears, eyes, brows, nose, hind, front, tail, teeth, straw };
  }
  // o: {ears, wide, lid, look, tilt, nod, lean, sc, sad, angry, happy, chew, side (Seitwärts-Kauen), hop, teeth, straw, lookAt}
  function poseBunny(B, t, o) {
    o = o || {};
    const ea = o.ears || 0;
    B.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.set(s * (.12 + ea * .05), 0, ea * 1.25 + Math.sin(t * 2.3 + i) * .04 * (1 - ea)); });
    const ch = o.chew ? Math.sin(t * 14) * .04 : 0, sd = o.side ? Math.sin(t * 9) * .09 : 0;
    B.head.position.set(.24, .43, 0);
    B.head.rotation.set((o.tilt || 0) + sd, o.look || 0, (o.nod || 0) + Math.sin(t * 1.6) * .02 + ch);
    B.nose.scale.set(.022, .018 * (1 + Math.sin(t * 22) * .18), .026);
    const lid = o.lid ?? (Math.sin(t * 1.4 + 1) > .985 ? .85 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.22 : 1), o.wide ? 1.1 : 1));
    if (K3.aimEyes) { B.root.updateMatrixWorld(true); K3.aimEyes(B.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .45); }
    B.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.angry ? .4 : (o.wide ? -.35 : (o.sad ? .35 : 0))); b.position.y = o.wide ? .115 : .1; });
    B.teeth.scale.set(1, o.teeth || 1, 1);
    B.straw.visible = !!o.straw;
    const hop = o.hop || 0;
    B.hind.forEach((h) => { h.rotation.z = -hop * 1.1; });
    B.front.forEach((f) => { f.rotation.z = hop * .9; f.rotation.x = 0; });
    B.body.rotation.set(0, 0, hop * .25 + (o.lean || 0));
    B.body.position.set(0, Math.sin(t * 2) * .004 + (o.happy ? Math.abs(Math.sin(t * 6)) * .05 : 0) + hop * .12, 0);
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Requisiten ----------
  const SWEET = [0xffd23f, 0xff8a3d, 0xff4f8b, 0xe5484d, 0x9b6bff]; // Maisflocken, Kringel, gefärbte Stücke
  const GREEN = 0x7fa650, STALK = 0xc9b46a;
  // ein Müsli-Stück: Flocke (flache Scheibe), Kringel (Torus), Pellet (kurzer grüner Zylinder), Halm
  function piece(kind, col) { const m = M(col, { roughness: .6 });
    if (kind === 0) return mesh(CYL, m, 0, 0, 0, .035, .012, .03);
    if (kind === 1) { const r = new T.Mesh(new T.TorusGeometry(.022, .01, 6, 12), m); r.castShadow = true; return r; }
    if (kind === 2) return mesh(CYL, m, 0, 0, 0, .014, .03, .014);
    const s = mesh(CYL, m, 0, 0, 0, .006, .08, .006); s.rotation.z = PI / 2; return s; }
  function makeBowl() { const root = new T.Group(); const c = M(0x4f8fe0, { roughness: .35 }), ci = M(0xeaf2ff, { roughness: .4 });
    const outer = new T.Mesh(new T.CylinderGeometry(.24, .17, .12, 36, 1, true), c); outer.position.y = .06; outer.castShadow = true; root.add(outer);
    const inner = new T.Mesh(new T.CylinderGeometry(.225, .16, .11, 36, 1, true), new T.MeshStandardMaterial({ color: 0xeaf2ff, roughness: .4, side: T.BackSide })); inner.position.y = .065; root.add(inner);
    const rim = new T.Mesh(new T.TorusGeometry(.232, .012, 8, 40), c); rim.rotation.x = PI / 2; rim.position.y = .12; root.add(rim);
    root.add(mesh(CYL, c, 0, .005, 0, .17, .01, .17));
    root.add(sph(M(0xe8c98a, { roughness: .9 }), 0, .1, 0, .2, .035, .2)); // Füllung
    const sweet = [], healthy = [];
    for (let i = 0; i < 46; i++) { const a = rnd(i) * 2 * PI, r = Math.sqrt(rnd(i + 50)) * .18, k = i % 4 === 3 ? (i % 8 === 3 ? 2 : 3) : i % 2;
      const p = piece(k, k >= 2 ? (k === 2 ? GREEN : STALK) : SWEET[i % 5]); p.position.set(Math.cos(a) * r, .125 + rnd(i + 9) * .03, Math.sin(a) * r);
      p.rotation.set(rnd(i + 3) * 3, rnd(i + 4) * 3, p.rotation.z || rnd(i + 5)); root.add(p); (k >= 2 ? healthy : sweet).push(p); }
    return { root, sweet, healthy }; }
  // liegengelassener Haufen: grüne Pellets + Halme neben der Schale
  function makeLeft() { const root = new T.Group(); for (let i = 0; i < 22; i++) { const k = i % 2 ? 2 : 3; const p = piece(k, k === 2 ? GREEN : STALK);
      const a = rnd(i + 70) * 2 * PI, r = Math.sqrt(rnd(i + 90)) * .13; p.position.set(Math.cos(a) * r, .012 + (i % 3) * .012, Math.sin(a) * r); p.rotation.y = rnd(i + 30) * 3; root.add(p); } return { root }; }
  // Müslisack mit Regenbogen-Etikett, Öffnung oben (local +y)
  function makeBag() { const root = new T.Group();
    const tex = canvasTex(256, 320, (c) => { const gr = c.createLinearGradient(0, 0, 0, 320); ["#ff4f8b", "#ffd23f", "#36b37e", "#2f6fd0", "#9b6bff"].forEach((s, i) => gr.addColorStop(i / 4, s));
      c.fillStyle = gr; c.fillRect(0, 0, 256, 320); c.fillStyle = "#fff"; c.beginPath(); c.roundRect(20, 110, 216, 110, 20); c.fill();
      c.fillStyle = "#e5484d"; c.font = "900 44px Montserrat"; c.textAlign = "center"; c.fillText(L("CRUNCHY", "KNUSPER"), 128, 160); c.fillStyle = "#1d2250"; c.font = "900 36px Montserrat"; c.fillText(L("FLAKES", "FLOCKEN"), 128, 205); });
    const front = M(0xffffff, { map: tex, roughness: .5 }), side = M(0xffd23f, { roughness: .5 });
    const b = new T.Mesh(new T.BoxGeometry(.34, .44, .16), [side, side, side, side, front, side]); b.position.y = .22; b.castShadow = true; root.add(b);
    root.add(mesh(BOX, M(0xffd23f, { roughness: .5 }), 0, .465, 0, .34, .05, .12));
    return { root }; }
  // Flocken-Regen: N Stücke, fallen im Kasten [x0..x1]×[z0..z1] von y1 nach y0 (deterministisch aus t)
  function makeRain() { const root = new T.Group(), ps = []; for (let i = 0; i < 36; i++) { const k = i % 5 === 4 ? 2 : i % 2; const p = piece(k, k === 2 ? GREEN : SWEET[i % 5]); p.scale.multiplyScalar(1.5); root.add(p); ps.push(p); } return { root, ps }; }
  function rainIn(R, t, x0, x1, z0, z1, y0, y1, sp) { R.root.visible = true; R.ps.forEach((p, i) => { const ph = (t * (sp || .9) * (.8 + rnd(i) * .5) + rnd(i + 20)) % 1;
      p.position.set(lerp(x0, x1, rnd(i + 40)), lerp(y1, y0, ph), lerp(z0, z1, rnd(i + 60))); p.rotation.set(t * 3 + i, t * 2 + i * .7, i); }); }
  // Strahl aus dem Sack in die Schale
  function rainStream(R, t, a, b) { R.root.visible = true; R.ps.forEach((p, i) => { const ph = (t * 1.6 + rnd(i + 20)) % 1; const q = a.clone().lerp(b, ph); q.y = lerp(a.y, b.y, ph * ph) + (1 - ph) * ph * .15;
      q.x += (rnd(i + 3) - .5) * .08; q.z += (rnd(i + 4) - .5) * .08; p.position.copy(q); p.rotation.set(t * 4 + i, t * 3 + i, i); }); }
  // Kochmütze auf Rudis Kopf (statt Südwester)
  function makeToque() { const root = new T.Group(); const w = M(0xffffff, { roughness: .8 });
    root.add(mesh(CYL, w, 0, .1, 0, .25, .2, .25)); for (const [x, z] of [[0, 0], [.13, .08], [-.12, .09], [.1, -.12], [-.11, -.1]]) root.add(sph(w, x, .3, z, .17, .13, .17));
    return { root }; }
  function makeFile() { const root = new T.Group(); root.add(mesh(BOX, M(0xb9c2cc, { metalness: .7, roughness: .35 }), 0, .16, 0, .03, .26, .012));
    root.add(mesh(BOX, M(0xff4f8b, { roughness: .5 }), 0, -.03, 0, .04, .14, .022)); return { root }; }
  function makeHay() { const root = new T.Group(); const m1 = M(0xd6c35e, { roughness: .95 }), m2 = M(0xb9b04a, { roughness: .95 });
    root.add(sph(m1, 0, .12, 0, .62, .42, .48)); root.add(sph(m2, .25, .1, .2, .35, .25, .3)); root.add(sph(m1, -.3, .08, -.1, .38, .22, .32));
    const sm2 = M(0xe3d278, { roughness: .9 }); for (let i = 0; i < 70; i++) { const a = rnd(i) * 2 * PI, e = rnd(i + 5) * 1.2;
      const s = mesh(CYL, i % 3 ? sm2 : m2, Math.cos(a) * .5 * Math.cos(e), .12 + Math.sin(e) * .4, Math.sin(a) * .42 * Math.cos(e), .007, .3, .007); s.rotation.set(rnd(i + 1) * 3, rnd(i + 2) * 3, rnd(i + 3) * 3); root.add(s); }
    return { root }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bun = actor(makeBunny(), "Hoppel");
    bowl = actor(makeBowl(), "Schale"); bag = actor(makeBag(), "Müslisack"); rain = actor(makeRain(), "Flocken"); file = actor(makeFile(), "Feile"); hay = actor(makeHay(), "Heu"); left = actor(makeLeft(), "Reste");
    toque = makeToque(); rudi.head.add(toque.root); toque.root.position.y = .14;
    for (const a of [bowl, bag, rain, file, left]) { a.noCheck = true; a.noBlob = true; }
  });
  function reset() { rudi.body.position.set(0, 0, 0); rudi.root.rotation.set(0, 0, 0); toque.root.visible = false;
    bun.root.rotation.set(0, 0, 0); bun.root.position.set(0, 0, 0); bowl.sweet.forEach((p) => p.visible = true); bag.root.rotation.set(0, 0, 0); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function hand(i) { rudi.root.updateMatrixWorld(true); return rudi.arms[i].localToWorld(V(0, -.64, 0)); }
  function chef(t, o) { poseRudi(rudi, t, o); rudi.hat.visible = false; toque.root.visible = true; }
  // 2D: Kochshow-Banner oben
  function banner(t, p) { if (p <= 0) return; const k = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W * .43, 300); g.scale(k, k); g.rotate(-.04);
    const s = L("RUDI'S COOKING SHOW", "RUDIS KOCHSHOW"); g.font = '900 64px "Montserrat"'; const w = g.measureText(s).width + 90;
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.roundRect(-w / 2 + 8, -58, w, 116, 58); g.fill(); g.fillStyle = "#ffd23f"; g.beginPath(); g.roundRect(-w / 2, -66, w, 116, 58); g.fill();
    for (let i = 0; i < 14; i++) { const a = i / 14 * 2 * PI; g.fillStyle = Math.sin(t * 8 + i * 2) > 0 ? "#fff" : "#ff8a3d"; g.beginPath(); g.arc(Math.cos(a) * (w / 2 - 4), -8 + Math.sin(a) * 52, 7, 0, 7); g.fill(); }
    g.fillStyle = "#e5484d"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 0, -4); g.restore(); }
  // 2D: Balken-Infografik in einer Karte. items: [{l: Beschriftung, v: 0..1, c: Farbe, s: Wert-Text}]
  function barCard(x, y, w, p, head, col, items) { const rows = items.length, h = 120 + rows * 120 + 30; w = Math.min(w, W - 214); x = clamp(x, w / 2 + 24, W - 190 - w / 2);
    if (!card(x, y, w, h, p, head, col)) return; const k = easeBack(clamp(p, 0, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.scale(k, k);
    items.forEach((it, i) => { const yy = -h / 2 + 100 + 30 + i * 120, bw = w - 80, grow = sm(clamp(p * 1.6 - .5 - i * .25, 0, 1));
      g.fillStyle = "#1d2250"; g.font = '800 36px "Montserrat"'; g.textAlign = "left"; g.textBaseline = "top"; g.fillText(it.l, -bw / 2, yy);
      g.fillStyle = "#e2ddd0"; g.beginPath(); g.roundRect(-bw / 2, yy + 46, bw, 46, 23); g.fill();
      g.fillStyle = it.c; g.beginPath(); g.roundRect(-bw / 2, yy + 46, Math.max(46, bw * it.v * grow), 46, 23); g.fill();
      g.fillStyle = "#1d2250"; g.font = '900 38px "Montserrat"'; g.textAlign = "right"; g.fillText(it.s, bw / 2, yy); });
    g.restore(); }

  // ---------- Shots ----------
  // Hook: Hoppel mit viel zu langen Zähnen, bunte Flocken prasseln auf ihn, schneller Zoom, Stempel AUA!
  function hookFrame(t, z) {
    at(bun, 0, 0, 0, -1.25); poseBunny(bun, t, { teeth: 2.8, wide: true, ears: .35, sc: 1.4, look: Math.sin(t * 9) * .18, lean: -.05, lookAt: V(-2.5, .8, 3) });
    at(bowl, .55, 0, .45, 0); bowl.root.scale.setScalar(1.2);
    rainIn(rain, t, -.6, .7, -.4, .35, .02, 1.5, 1.1);
    frameOn([bun], { az: lerp(.0, .12, z), el: .12, fill: lerp(.62, .86, z), dy: -.02, t }); draw(); bowl.root.scale.setScalar(1); }
  KZ.shot("mHook", (lt, d, t) => { studio(); hookFrame(t, sm(clamp(lt / .9, 0, 1)));
    stamp(L("OUCH!", "AUA!"), W * .66, H * .5, (lt + .02) / .25, "#e5484d", -.07); });
  // 1 Kochshow: Rudi mit Kochmütze kippt den Müslisack in die Schale, Hoppel wartet daneben, Banner
  KZ.shot("mShow", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(rudi, -.75, -.1, -.55); chef(t, { arms: [.15, 1.6 + Math.sin(t * 3) * .05], spread: .05, mouth: "smile", nod: .05 });
    const hd = hand(1); at(bowl, hd.x + .12, 0, hd.z + .05, 0);
    bag.root.visible = true; bag.root.position.copy(hd).add(V(.02, -.06, 0)); bag.root.rotation.set(0, -.55, -2.0 - Math.sin(t * 3) * .1);
    bag.root.updateMatrixWorld(true); const mouth = bag.root.localToWorld(V(0, .48, 0));
    rainStream(rain, t, mouth, V(bowl.root.position.x, .14, bowl.root.position.z));
    at(bun, hd.x + 1.05, 0, hd.z + .45, PI + .45); poseBunny(bun, t, { ears: .1, wide: true, happy: true, sc: 1.25, lookAt: bowl.root.position });
    frameOn([rudi, bun], { az: lerp(.2, .1, k), el: .14, fill: lerp(.93, .98, k), dy: -.05, t }); draw();
    banner(t, (lt - .05) / .35); });
  // 2 Rate-Frage: Hoppel frisst an der Schale, Kacheln
  KZ.shot("mQuiz", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bowl, 0, 0, 0, 0); at(bun, .52, 0, -.05, PI + .2); poseBunny(bun, t, { nod: -.35, chew: true, sc: 1.3, teeth: 1.4, lid: .2, lookAt: V(-1, .1, .5) });
    frameOn([bun, bowl], { az: lerp(-.75, -.65, k), el: .2, fill: lerp(.62, .68, k), dy: -.42, t }); draw();
    txt(L("GROWTH PER YEAR?", "WACHSTUM PRO JAHR?"), W * .42, H * .2, 56, "#ffd23f", { stroke: 12, a: clamp(lt / .3, 0, 1) });
    quizTiles(W * .42, H * .56, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 3 Wählerisch: süße Stücke verschwinden nach und nach, grüner Rest liegt daneben, Stempel WÄHLERISCH!
  KZ.shot("mPick", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bowl, 0, 0, 0, 0); const eaten = Math.floor(clamp(ph * 1.3, 0, 1) * bowl.sweet.length); bowl.sweet.forEach((p, i) => p.visible = i >= eaten);
    at(left, -.05, 0, .42, 0); left.root.scale.setScalar(clamp(ph * 3, .6, 2.0));
    const dip = Math.max(0, Math.sin(t * 4)); at(bun, .5, 0, -.02, PI + .15); poseBunny(bun, t, { nod: -.12 - dip * .12, chew: true, happy: true, sc: 1.3, teeth: 1.6, lookAt: V(-1.5, .6, 1.4) });
    frameOn([bun, bowl, FR(-.35, 0, .2, .1, .1, .6)], { az: lerp(-.7, -.6, k), el: lerp(.32, .28, k), fill: lerp(.85, .9, k), dy: -.15, t }); draw();
    stamp(L("PICKY!", "WÄHLERISCH!"), W * .42, H * .17, (lt - .35) / .25, "#9b6bff", -.06); });
  // 4 Nagelfeile: Wochen später, Zähne lang, Rudi (ohne Kochmütze) kommt mit der Feile, Hoppel lehnt sich empört zurück, Stempel NEIN!
  KZ.shot("mFile", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    const ap = sm(clamp(ph / .5, 0, 1)); place(rudi, lerp(-1.3, -.95, ap), 0, -.45); poseRudi(rudi, t, { arms: [.1, lerp(.4, 1.0, ap)], spread: .05, mouth: "smile", lean: -.12 * ap, nod: .08 });
    const hd = hand(1); file.root.visible = true; file.root.position.copy(hd); file.root.scale.setScalar(1.7); file.root.rotation.set(0, 0, -1.0 + Math.sin(t * 10) * .15 * (ph > .5 ? 1 : 0));
    at(bun, .25, 0, .15, PI + .9); poseBunny(bun, t, { teeth: 3.2, angry: ph > .4, wide: ph <= .4, ears: ph > .4 ? .8 : .2, lean: ph > .4 ? -.18 : 0, sc: 1.35 });
    frameOn([rudi, bun], { az: lerp(-.05, .05, k), el: .14, fill: lerp(.82, .86, k), dy: -.05, t }); draw();
    txt(L("WEEKS LATER", "WOCHEN SPÄTER"), W * .42, 290, 52, "#ffffff", { stroke: 12, a: clamp(lt / .3, 0, 1) * (1 - clamp((ph - .45) * 6, 0, 1)) });
    stamp(L("NOPE!", "NEIN!"), W * .42, H * .17, (ph - .55) * d / .25, "#e5484d", .06); });
  // 5 Auflösung: Kacheln mit Haken, dann Balken 1 Woche / 1 Jahr; Hoppel kaut seitwärts an einem Halm
  KZ.shot("mReveal", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bun, -.1, 0, 0, -.85); poseBunny(bun, t, { happy: true, chew: true, side: true, straw: true, teeth: 1.2, sc: 1.4, ears: .15, lid: 0, lookAt: V(2.5, .6, 1.2) });
    frameOn([bun, FR(-.4, 0, -.3, .4, .9, .3)], { el: .15, az: lerp(.1, .0, k), fill: lerp(.48, .52, k), dy: -.45, t }); draw();
    stamp(L("4+ INCHES!", "ÜBER 10 CM!"), W * .42, H * .17, (lt - .2) / .3, "#36b37e", -.06);
    if (ph < .42) quizTiles(W * .42, H * .56, QUIZ(), 1, { reveal: sm(clamp((lt - .1) / .4, 0, 1)), correct: 0 });
    else barCard(W * .42, H * .56, 900, sm((ph - .42) * d / .4), L("FRONT TEETH GROW", "SCHNEIDEZÄHNE WACHSEN"), "#2f6fd0",
      [{ l: L("1 week", "1 Woche"), v: .03, c: "#2f6fd0", s: L("0.1 in", "2 mm") }, { l: L("1 year", "1 Jahr"), v: 1, c: "#e5484d", s: L("4+ in", "über 10 cm") }]); });
  // 6 Studie: Hoppel traurig mit langen Zähnen unten, Balken Uni Edinburgh (nur Heu 0 % vs. nur Müsli 38 %)
  KZ.shot("mStudy", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    at(bun, 0, 0, 0, -.45); poseBunny(bun, t, { sad: true, teeth: 2.6, ears: .9, sc: 1.4, lid: .3, nod: .05 });
    at(bowl, .7, 0, .35, 0);
    frameOn([bun, bowl], { az: lerp(.15, .25, k), el: .16, fill: lerp(.62, .68, k), dy: -.75, t }); draw();
    stamp(L("BAD TEETH!", "KRANKE ZÄHNE!"), W * .42, H * .14, (lt - .25) / .3, "#e5484d", -.06);
    barCard(W * .42, H * .6, 900, sm((lt - .1) / .45), L("UNIVERSITY OF EDINBURGH", "UNI EDINBURGH"), "#e5484d",
      [{ l: L("Hay only: dental disease", "Nur Heu: Zahnkrankheit"), v: 0, c: "#36b37e", s: "0 %" }, { l: L("Muesli only: dental disease", "Nur Müsli: Zahnkrankheit"), v: .375, c: "#e5484d", s: "38 %" }]); });
  // 7 Tipp: großer Heuhaufen, Hoppel daneben, kaut seitwärts mit Halm, Rudi zeigt drauf
  KZ.shot("mTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(hay, -.15, 0, 0); at(bun, 1.0, 0, .3, PI + .3); poseBunny(bun, t, { happy: true, chew: true, side: true, straw: true, sc: 1.4, ears: .1, lookAt: V(-.2, .3, 0) });
    frameOn([hay, bun], { az: lerp(.25, .35, k), el: .2, fill: lerp(.84, .9, k), dy: -.35, t }); draw();
    stamp(L("HAY!", "HEU!"), W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    infoCard(W * .42, H * .6, 900, 220, sm((ph - .35) * d / .35), L("TIP", "TIPP"), "#36b37e",
      [L("Hay pile as big as your bunny", "Heu: so viel wie dein Kaninchen groß ist"), L("Swap muesli out over 2–4 weeks", "Müsli über 2–4 Wochen absetzen")], 40); });
  // 8 Loop: zurück zur Hook-Einstellung
  KZ.shot("mLoop", (lt, d, t) => { studio(); const ph = lt / d; hookFrame(t, 1 - ph * .9);
    if (ph > .3) stamp(L("THOSE FLAKES...", "DIESE FLOCKEN..."), W * .42, H * .12, (ph - .3) * d / .3, "#e5484d", -.06); });

  window.__bunnyMuesli = true;
})();
