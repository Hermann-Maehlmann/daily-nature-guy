// 3D-Szene "Why Yogurt Drops Are Junk Food For Your Rabbit" / "Warum Joghurtdrops Junkfood für dein Kaninchen sind" (23.11.2026), zweisprachig: Bildtexte als L("EN", "DE").
// Hauskaninchen "Hoppel" (Figur aus den Kaninchen-Videos vom 18./19.11., neu: Schneidezähne mit Länge "teeth", Backe halten, Flucht-Hoppeln),
// Joghurtdrops-Tüte (Etikett per canvasTex), einzelne Drops (weiß-rosa Halbkugeln), Drops-Automat (Glasfront, Knopf, Rutsche, Napf),
// Riesen-Zahnbürste, Heuhaufen (auch "kaninchengroß"), Kräuterbund (Petersilie + Minze), Zuckerwürfel.
// Opener-Stil "werbespot": Fernsehwerbung im Studio mit Strahlen-Hintergrund, NEU!-Stern, WERBUNG-Einblendung, Rudi als Werbe-Moderator.
// Quellen: RWAF ("Many of the treats that are marketed for rabbits (eg milk-based yoghurt drops ...) should be avoided";
// "Too many sweet and starchy treats ... leading to fatal digestive upsets"), RSPCA ("rabbit-sized bundle of hay every day (it should be as big as they are)"),
// PDSA (Zähne wachsen ein Leben lang, Heu schleift sie ab; Leckerlis aus dem Handel oft voller Zucker).
(function () {
  const { g, W, H, clamp, lerp, sm, easeBack } = window.KZ;
  if (!window.K3) { const x = new XMLHttpRequest(); x.open("GET", "http://lab.local/kit3d.js", false); x.send(); (0, eval)(x.responseText); } // 3D-Baukasten
  const { T, PI, M, mesh, sph, limb, canvasTex, CYL, BOX, txt, stamp, infoCard, quizTiles, poseRudi, draw, begin, place, actor, frameOn } = window.K3;
  const L = window.L || ((en) => en);
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const QUIZ = () => [L("One handful", "Eine Handvoll"), L("Rabbit-sized", "Kaninchengroß"), L("One cup", "Eine Tasse")];
  let bun, bigBun, rudi, bag, bigBag, drops, rain, machine, bowl, brush, hay, bigHay, herbs, cubes, adTex;

  // ---------- Hauskaninchen (wildfarben braun, cremefarbener Bauch, weiße Blume, lange Ohren, große Hinterpfoten) ----------
  const FUR = 0xb98a5e;
  function makeBunny() {
    const fur = M(FUR, { roughness: .8 }), furD = M(new T.Color(FUR).multiplyScalar(.8).getHex(), { roughness: .8 }), cream = M(0xf6e7cf, { roughness: .85 }), white = M(0xffffff, { roughness: .9 });
    const pink = M(0xffa3b1, { roughness: .6 }), eyeM = M(0x2a1610, { roughness: .1 }), hl = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1 }), tooth = M(0xfffaf0, { roughness: .3 });
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
    // zwei Schneidezähne unter der Nase, wachsen nach unten (teeth = Länge)
    const teeth = new T.Group(); teeth.position.set(.142, -.075, 0); head.add(teeth);
    for (const s of [-1, 1]) teeth.add(mesh(BOX, tooth, 0, -.018, s * .011, .012, .036, .02));
    const eyes = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(.065, .035, s * .1); head.add(e);
      const ey = K3.eye(.05, { white: M(0x5a3420, { roughness: .2 }), pupil: eyeM }); ey.scale.set(.75, 1.1, .8); e.add(ey); e.userData.ey = ey; eyes.push(e); }
    const brows = []; for (const s of [-1, 1]) { const b = mesh(BOX, furD, .07, .1, s * .09, .05, .012, .02); head.add(b); brows.push(b); }
    const wh = M(0xffffff, { roughness: .4 }); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { const w = mesh(CYL, wh, .12, -.04 + i * .02, s * .1, .004, .16, .004); w.rotation.x = s * (PI / 2 - .25 + i * .18); w.castShadow = false; head.add(w); }
    const ears = []; for (const s of [-1, 1]) { const e = new T.Group(); e.position.set(-.04, .1, s * .055); head.add(e);
      e.add(sph(fur, 0, .2, 0, .035, .22, .07)); e.add(sph(pink, .02, .2, 0, .02, .17, .05)); ears.push(e); }
    return { root, body, head, ears, eyes, brows, nose, hind, front, tail, teeth };
  }
  // o: {ears 0 aufrecht..1 angelegt, wide, lid, look, tilt, nod, lean, sc, sad, angry, happy, chew, hop, teeth (Länge, 1 normal), cheek (Pfote an die Backe)}
  function poseBunny(B, t, o) {
    o = o || {};
    const ea = o.ears || 0;
    B.ears.forEach((e, i) => { const s = i ? 1 : -1; e.rotation.set(s * (.12 + ea * .05), 0, ea * 1.25 + Math.sin(t * 2.3 + i) * .04 * (1 - ea)); });
    const ch = o.chew ? Math.sin(t * 14) * .04 : 0;
    B.head.position.set(.24, .43, 0);
    B.head.rotation.set(o.tilt || 0, o.look || 0, (o.nod || 0) + Math.sin(t * 1.6) * .02 + ch);
    B.nose.scale.set(.022, .018 * (1 + Math.sin(t * 22) * .18), .026);
    const lid = o.lid ?? (Math.sin(t * 1.4 + 1) > .985 ? .85 : 0);
    B.eyes.forEach((e) => e.scale.set(1, Math.max(.08, 1 - lid) * (o.wide ? 1.22 : 1), o.wide ? 1.1 : 1));
    if (K3.aimEyes) { B.root.updateMatrixWorld(true); K3.aimEyes(B.eyes.map((e) => e.userData.ey), o.lookAt || K3.camera.position, .45); }
    B.brows.forEach((b, i) => { b.rotation.x = (i ? 1 : -1) * (o.angry ? .4 : (o.wide ? -.35 : (o.sad ? .35 : 0))); b.position.y = o.wide ? .115 : .1; });
    B.teeth.scale.set(1, o.teeth || 1, 1);
    const hop = o.hop || 0;
    B.hind.forEach((h) => { h.rotation.z = -hop * 1.1; });
    B.front.forEach((f, i) => { f.rotation.z = hop * .9 + (o.cheek && i === 1 ? 1.9 : 0); f.rotation.x = o.cheek && i === 1 ? -.5 : 0; });
    B.body.rotation.z = hop * .25 + (o.lean || 0);
    B.body.position.set(0, Math.sin(t * 2) * .004 + (o.happy ? Math.abs(Math.sin(t * 6)) * .05 : 0) + hop * .12, 0);
    B.root.scale.setScalar(o.sc || 1);
  }

  // ---------- Requisiten ----------
  const dropM = () => [M(0xfffbf4, { roughness: .35 }), M(0xffc6d6, { roughness: .35 })];
  function dropMesh(m, r) { const d = mesh(new T.SphereGeometry(1, 24, 12, 0, 2 * PI, 0, PI / 2), m, 0, 0, 0, r, r * .8, r); d.castShadow = false; return d; }
  // Joghurtdrops-Tüte: Standbeutel mit rosa Etikett (vorne = +z), gezackter Verschluss oben
  function makeBag() { const root = new T.Group(), body = new T.Group(); root.add(body);
    const pinkM = M(0xff7aa8, { roughness: .45 }), foil = M(0xd9dde6, { metalness: .6, roughness: .3 });
    body.add(mesh(BOX, pinkM, 0, .27, 0, .38, .54, .14)); body.add(sph(pinkM, 0, .03, 0, .19, .05, .07));
    body.add(mesh(BOX, foil, 0, .565, 0, .39, .05, .05));
    const lab = canvasTex(380, 540, (c, w, h) => { c.fillStyle = "#ff7aa8"; c.fillRect(0, 0, w, h);
      c.fillStyle = "#ffe14d"; c.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * PI * 2, r = i % 2 ? 62 : 88; c.lineTo(285 + Math.cos(a) * r, 95 + Math.sin(a) * r); } c.fill();
      c.fillStyle = "#e5484d"; c.font = '900 54px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(L("NEW!", "NEU!"), 285, 98);
      c.fillStyle = "#ffffff"; c.font = '900 64px "Montserrat"'; c.fillText(L("YOGURT", "JOGHURT"), w / 2, 255); c.fillText("DROPS", w / 2, 325);
      for (let i = 0; i < 9; i++) { const x = 70 + (i % 5) * 60 + (i > 4 ? 30 : 0), y = 420 + (i > 4 ? 60 : 0); c.fillStyle = i % 3 ? "#fffbf4" : "#ffd6e2"; c.beginPath(); c.ellipse(x, y, 26, 20, 0, 0, PI * 2); c.fill(); }
      c.fillStyle = "#1d2250"; c.font = '800 30px "Montserrat"'; c.fillText(L("for rabbits", "für Kaninchen"), w / 2, 175); });
    const face = new T.Mesh(new T.PlaneGeometry(.36, .51), new T.MeshStandardMaterial({ map: lab, roughness: .45 })); face.position.set(0, .275, .0705); body.add(face);
    return { root, body }; }
  function makeDrops(n, r, spread) { const root = new T.Group(), list = [], ms = dropM();
    for (let i = 0; i < n; i++) { const a = i * 2.399, rr = Math.sqrt(i / n) * spread; const d = dropMesh(ms[i % 2], r); d.position.set(Math.cos(a) * rr, 0, Math.sin(a) * rr); root.add(d); list.push(d); }
    return { root, list }; }
  // fallende Drops (Regen) um das Kaninchen
  function makeRain(n) { const root = new T.Group(), list = [], ms = dropM();
    for (let i = 0; i < n; i++) { const d = dropMesh(ms[i % 2], .045); root.add(d); list.push(d); } return { root, list }; }
  function rainAt(R, t, cx, cz, rad, h) { R.root.visible = true; R.root.position.set(cx, 0, cz);
    R.list.forEach((d, i) => { const a = i * 2.399, rr = .25 + ((i * 37) % 10) / 10 * rad, sp = .9 + (i % 4) * .15, y = h - ((t * sp + i * .37) % 1.2) / 1.2 * h;
      d.position.set(Math.cos(a) * rr, Math.max(0, y), Math.sin(a) * rr * .8); d.rotation.set(t * 3 + i, i, t * 2); }); }
  // Drops-Automat: roter Kasten, Glasfront mit Drops, gelber Knopf, Schild oben, Rutsche nach vorn (+z)
  function makeMachine() { const root = new T.Group(); const red = M(0xe5484d, { roughness: .4 }), dark = M(0x2a2f5a, { roughness: .5 }), yel = M(0xffd23f, { roughness: .3, emissive: 0x6a5200, emissiveIntensity: .3 });
    root.add(mesh(BOX, red, 0, .7, 0, .72, 1.4, .5));
    root.add(mesh(BOX, dark, -.06, .95, .23, .5, .62, .06));
    const ms = dropM(); for (let i = 0; i < 26; i++) { const d = dropMesh(ms[i % 2], .045); d.position.set(-.27 + (i % 6) * .085, .7 + Math.floor(i / 6) * .1 + (i % 2) * .03, .27); d.rotation.x = PI / 2 * .3; root.add(d); }
    const glass = new T.Mesh(BOX, new T.MeshStandardMaterial({ color: 0xcfe9ff, roughness: .05, metalness: .1, transparent: true, opacity: .28 })); glass.position.set(-.06, .95, .27); glass.scale.set(.5, .62, .02); root.add(glass);
    const btn = mesh(CYL, yel, .26, .98, .27, .07, .05, .07); btn.rotation.x = PI / 2; root.add(btn);
    root.add(mesh(BOX, dark, 0, .32, .3, .3, .16, .14));
    const sign = canvasTex(512, 110, (c, w, h) => { c.fillStyle = "#1d2250"; c.beginPath(); c.roundRect(0, 0, w, h, 22); c.fill(); c.fillStyle = "#ffd23f"; c.font = '900 64px "Montserrat"'; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(L("DROP-O-MAT", "DROPS-O-MAT"), w / 2, h / 2 + 3); });
    const sg = new T.Mesh(new T.PlaneGeometry(.8, .17), new T.MeshStandardMaterial({ map: sign, roughness: .5 })); sg.position.set(0, 1.52, .26); root.add(sg);
    root.add(mesh(BOX, dark, 0, 1.52, .245, .82, .19, .02));
    return { root, btn }; }
  function makeBowl() { const root = new T.Group(); const m = M(0x7ad3ff, { roughness: .3 });
    root.add(mesh(new T.CylinderGeometry(.17, .13, .08, 32), m, 0, .04, 0)); const ms = dropM();
    for (let i = 0; i < 9; i++) { const a = i * 2.399, r = Math.sqrt(i / 9) * .12; const d = dropMesh(ms[i % 2], .04); d.position.set(Math.cos(a) * r, .08, Math.sin(a) * r); root.add(d); }
    return { root }; }
  // Riesen-Zahnbürste (Griff entlang +x)
  function makeBrush() { const root = new T.Group(); const blue = M(0x2f6fd0, { roughness: .35 }), white = M(0xffffff, { roughness: .6 }), mint = M(0x7fe0c4, { roughness: .6 });
    const h = mesh(CYL, blue, .35, 0, 0, .035, .8, .035); h.rotation.z = PI / 2; root.add(h);
    root.add(mesh(BOX, blue, .78, 0, 0, .14, .04, .07));
    for (let i = 0; i < 8; i++) for (const s of [-1, 1]) root.add(mesh(CYL, i % 3 ? white : mint, .73 + i * .015, .06, s * .018, .012, .1, .012));
    return { root }; }
  function makeHay() { const root = new T.Group(); const m1 = M(0xe8c766, { roughness: .9 }), m2 = M(0xc9a64a, { roughness: .9 }), m3 = M(0x9fbf5a, { roughness: .9 });
    root.add(sph(m1, 0, .08, 0, .38, .14, .3));
    for (let i = 0; i < 70; i++) { const a = i * 2.399, r = Math.sqrt((i % 35) / 35) * .34; const s = mesh(CYL, [m1, m2, m3][i % 3], Math.cos(a) * r, .1 + (i % 5) * .03, Math.sin(a) * r * .8, .007, .32, .007);
      s.rotation.set(Math.sin(i * 1.3) * 1.3, i, PI / 2 + Math.cos(i * .7) * .6); s.castShadow = false; root.add(s); }
    return { root }; }
  // Kräuterbund: links Petersilie (krause dunkelgrüne Kugeln), rechts Minze (helle ovale Blätter), Stiele zusammengebunden
  function makeHerbs() { const root = new T.Group(); const stem = M(0x4f9a3a), pars = M(0x2f8a3a, { roughness: .7 }), mint = M(0x7ccf6a, { roughness: .6 }), band = M(0xe5484d);
    for (let i = 0; i < 7; i++) { const a = (i - 3) * .16; const s = mesh(CYL, stem, Math.sin(a) * .12, .14, 0, .01, .28, .01); s.rotation.z = -a; root.add(s);
      const top = V(Math.sin(a) * .26, .28 + Math.cos(a) * .02, 0);
      if (i < 4) for (let k = 0; k < 4; k++) root.add(sph(pars, top.x + Math.cos(k * 1.6) * .03, top.y + Math.sin(k * 2.1) * .025, Math.sin(k * 1.6) * .03, .035));
      else for (let k = 0; k < 3; k++) { const l = sph(mint, top.x + (k - 1) * .03, top.y + (k % 2) * .03, 0, .028, .05, .018); l.rotation.z = (k - 1) * .6; root.add(l); } }
    root.add(mesh(CYL, band, 0, .06, 0, .03, .03, .03));
    return { root }; }
  function makeCubes(n) { const root = new T.Group(), list = []; const m = M(0xffffff, { roughness: .25, emissive: 0x404040, emissiveIntensity: .2 });
    for (let i = 0; i < n; i++) { const c = mesh(BOX, m, 0, 0, 0, .14, .14, .14); root.add(c); list.push(c); } return { root, list }; }

  K3.onBuild(() => {
    rudi = K3.rudi; bun = actor(makeBunny(), "Hoppel"); bigBun = actor(makeBunny(), "Hoppel gross");
    bag = actor(makeBag(), "Tuete"); bigBag = actor(makeBag(), "Tuete gross"); drops = actor(makeDrops(14, .045, .3), "Drops"); rain = actor(makeRain(26), "Drops-Regen");
    machine = actor(makeMachine(), "Automat"); bowl = actor(makeBowl(), "Napf"); brush = actor(makeBrush(), "Zahnbuerste"); hay = actor(makeHay(), "Heu"); bigHay = actor(makeHay(), "Heu gross");
    herbs = actor(makeHerbs(), "Kraeuter"); cubes = actor(makeCubes(10), "Zucker");
    for (const a of [drops, rain, bowl, brush, hay, herbs, cubes]) a.noCheck = true;
    K3.yard.traverse((m) => { if (m.isGroup && Math.abs(m.position.x + 2.4) < .01 && Math.abs(m.position.z + 2.2) < .01) m.visible = false; }); // Hundehütte aus
    adTex = canvasTex(512, 1024, (c, w, h) => { const cx = w / 2, cy = h * .42; for (let i = 0; i < 28; i++) { c.fillStyle = i % 2 ? "#ff5d8f" : "#ff8fb0"; c.beginPath(); c.moveTo(cx, cy);
      const a0 = i / 28 * PI * 2, a1 = (i + 1) / 28 * PI * 2; c.lineTo(cx + Math.cos(a0) * 1400, cy + Math.sin(a0) * 1400); c.lineTo(cx + Math.cos(a1) * 1400, cy + Math.sin(a1) * 1400); c.fill(); }
      const gr = c.createRadialGradient(cx, cy, 10, cx, cy, 300); gr.addColorStop(0, "rgba(255,240,180,.9)"); gr.addColorStop(1, "rgba(255,240,180,0)"); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  });
  function reset() { rudi.noCheck = false; rudi.body.position.set(0, 0, 0);
    for (const b of [bun, bigBun]) { b.root.rotation.set(0, 0, 0); b.root.position.set(0, 0, 0); b.noCheck = false; }
    for (const p of [bag, bigBag, drops, hay, bigHay, herbs, bowl, brush, machine, cubes]) { p.root.scale.setScalar(1); p.root.rotation.set(0, 0, 0); p.root.position.y = 0; }
    bag.body.rotation.set(0, 0, 0); bag.body.position.set(0, 0, 0); }
  function inYard() { begin("yard"); reset(); }
  function studio() { begin("studio"); reset(); }
  const FR = (x0, y0, z0, x1, y1, z1) => { const m = new T.Mesh(BOX); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.scale.set(x1 - x0, y1 - y0, z1 - z0); return { root: m }; };
  function at(B, x, y, z, ry) { B.root.visible = true; B.root.position.set(x, y, z); B.root.rotation.set(0, ry || 0, 0); }
  function hand(i) { rudi.root.updateMatrixWorld(true); return rudi.arms[i].localToWorld(V(0, -.62, 0)); }
  function holdAt(P, p, ry, sc) { P.root.visible = true; P.root.position.copy(p); P.root.rotation.set(0, ry || 0, 0); P.root.scale.setScalar(sc || 1); }
  function adBadge(a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(10,12,40,.75)"; g.beginPath(); g.roundRect(70, 175, 300, 64, 14); g.fill();
    g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(104, 207, 11, 0, PI * 2); g.fill(); g.fillStyle = "#fff"; g.font = '900 38px "Montserrat"'; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(L("AD", "WERBUNG"), 126, 209); g.restore(); }
  function burst(x, y, r, p, t, s) { if (p <= 0) return; const k = easeBack(Math.min(p, 1)); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(x, y); g.rotate(Math.sin(t * 3) * .12); g.scale(k, k);
    g.fillStyle = "#ffe14d"; g.beginPath(); for (let i = 0; i < 32; i++) { const a = i / 32 * PI * 2, rr = i % 2 ? r * .78 : r; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.fill();
    g.fillStyle = "#e5484d"; g.font = '900 64px "Montserrat"'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, 0, 4); g.restore(); }
  function sparkles(t, a) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 14; i++) { const x = 120 + ((i * 263) % 700), y = 330 + ((i * 181) % 820), s = (Math.sin(t * 5 + i * 1.7) * .5 + .5) * 22 * a; if (s < 2) continue;
      g.fillStyle = "rgba(255,250,220,.85)"; g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + s * .25, y - s * .25); g.lineTo(x + s, y); g.lineTo(x + s * .25, y + s * .25); g.lineTo(x, y + s); g.lineTo(x - s * .25, y + s * .25); g.lineTo(x - s, y); g.lineTo(x - s * .25, y - s * .25); g.fill(); }
    g.restore(); }

  // ---------- Shots ----------
  // Hook: Hoppel mitten im Drops-Regen neben der großen Tüte, kaut, Augen weit
  function hookFrame(lt, d, t, ph) {
    at(bun, -.2, 0, .15, .35); poseBunny(bun, t, { wide: true, chew: true, ears: .1, sc: 1.25 });
    place(bag, .6, -.2, -.25); bag.root.scale.setScalar(1.25); bag.body.rotation.z = Math.sin(t * 3) * .05;
    place(drops, -.05, .45, 0); rainAt(rain, t, 0, .1, .7, 1.4);
    frameOn([FR(-.9, 0, -.45, 1.0, .9, .6)], { az: lerp(.05, .14, ph), el: .2, fill: lerp(.9, .98, ph), dy: -.05, t }); draw(); }
  KZ.shot("jHook", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(lt, d, t, ph);
    stamp(L("JUNK FOOD?", "JUNKFOOD?"), W * .42, H * .62, (lt - .05) / .3, "#e5484d", -.06); });
  // 1 Werbespot: Studio mit Strahlen-Hintergrund, Rudi als Moderator hält die Tüte hoch, Hoppel auf dem Sockel mit Drops, NEU!-Stern, WERBUNG
  KZ.shot("jAd", (lt, d, t) => { studio(); K3.scene.background = adTex; const ph = lt / d, k = sm(ph);
    place(rudi, .55, -.2, PI + .7); poseRudi(rudi, t, { arms: [.4, 1.25 + Math.sin(t * 5) * .06], spread: .12, mouth: "smile", wide: true, nod: .05 });
    holdAt(bag, hand(1).add(V(0, -.32, .12)), -.25, 1.05); bag.noCheck = true;
    at(bun, -.7, 0, .3, .4); poseBunny(bun, t, { happy: true, chew: true, sc: 1.2 }); place(drops, -.3, .6, 0); drops.root.scale.setScalar(.8);
    frameOn([rudi, bun], { az: lerp(.05, .12, k), el: .12, fill: lerp(.9, .95, k), t }); draw(); bag.noCheck = false;
    sparkles(t, 1); adBadge(clamp(lt / .2, 0, 1)); burst(W * .7, H * .135, 110, (lt - .1) / .35, t, L("NEW!", "NEU!"));
    stamp(L("EXTRA SUGAR!", "EXTRA ZUCKER!"), W * .34, H * .235, (ph - .45) * d / .3, "#ff4f8b", .06); });
  // 2 Rate-Frage: Rudi hält eine Handvoll Heu, Hoppel schaut, Kacheln
  KZ.shot("jQuiz", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(rudi, .95, -.35, PI + .6); poseRudi(rudi, t, { arms: [.2, 1.35 + Math.sin(t * 2) * .05], spread: .05, mouth: "hmm", tilt: .08 });
    holdAt(hay, hand(1).add(V(0, -.09, 0)), 0, .32);
    at(bun, -.35, 0, .3, .2); poseBunny(bun, t, { look: .25, tilt: -.15, sc: 1.25 });
    frameOn([rudi, bun], { az: lerp(-.38, -.3, k), el: .14, fill: lerp(.7, .74, k), dy: -.95, t }); draw();
    txt(L("HOW MUCH HAY PER DAY?", "WIE VIEL HEU AM TAG?"), W * .42, H * .2, 52, "#ffd23f", { stroke: 12, a: clamp(lt / .3, 0, 1) });
    quizTiles(W * .42, H * .57, QUIZ(), clamp((lt - .2) / .7, 0, 1), {}); });
  // 3 Drops-Automat: Rudi drückt den Knopf, Drops rollen in den Napf; Schnitt: Hoppel am Napf, Heu daneben links liegen gelassen
  KZ.shot("jMachine", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .48;
    if (!half) { const k = ph / .48; place(machine, -.25, -.35, .35); place(rudi, .85, .35, PI + .9); const press = Math.sin(t * 9) > 0 ? .08 : 0;
      poseRudi(rudi, t, { arms: [.2, 1.45 + press], spread: .02, mouth: "smile", wide: true });
      machine.btn.position.z = .27 - press * .3; place(bowl, .2, .5, 0); bowl.root.scale.setScalar(1.3);
      frameOn([machine, rudi], { az: lerp(.25, .32, k), el: .14, fill: lerp(.9, .97, k), t }); draw();
      stamp(L("MORE LOVE!", "MEHR LIEBE!"), W * .42, H * .17, (lt - .15) / .3, "#ff4f8b", -.06); }
    else { const k = (ph - .48) / .52; place(bowl, .25, .1, 0); bowl.root.scale.setScalar(1.3); at(bun, -.15, 0, .1, 0); poseBunny(bun, t, { chew: true, nod: -.2, lid: .25, sc: 1.25 });
      place(hay, -1.15, -.3, 0); hay.root.scale.setScalar(1.5);
      frameOn([bun, bowl, hay], { az: lerp(.5, .42, k), el: .2, fill: lerp(.95, 1.02, k), t }); draw();
      stamp(L("HAY? NOPE.", "HEU? NÖ."), W * .42, H * .17, (k * d * .52 - .05) / .3, "#9a6236", .06); } });
  // 4 Zahnweh: Hoppel hält die Backe, Zähne zu lang; Schnitt: Rudi kommt mit Riesen-Zahnbürste, Hoppel weicht zurück
  KZ.shot("jBrush", (lt, d, t) => { inYard(); const ph = lt / d, half = ph > .42;
    if (!half) { const k = ph / .42; at(bun, 0, 0, 0, .5); poseBunny(bun, t, { sad: true, cheek: true, teeth: 2.2, look: .1, lid: .2, sc: 1.4 });
      frameOn([FR(-.45, 0, -.4, .55, .8, .4)], { az: lerp(1.05, 1.0, k), el: .12, fill: lerp(1.0, 1.08, k), dy: -.05, t }); draw();
      stamp(L("OUCH!", "AUA!"), W * .42, H * .17, (lt - .1) / .3, "#e5484d", -.06); }
    else { const k = (ph - .42) / .58, back = sm(clamp(k / .6, 0, 1));
      place(rudi, .85, -.15, PI + .55); poseRudi(rudi, t, { arms: [.2, 1.5 + Math.sin(t * 8) * .1], spread: .05, mouth: "smile", walk: .4 });
      holdAt(brush, hand(1), PI + .55); brush.root.position.x -= .05;
      at(bun, lerp(-.45, -.7, back), 0, .3, .3); poseBunny(bun, t, { wide: true, ears: .6, hop: Math.abs(Math.sin(t * 7)) * .6 * (1 - back * .5), teeth: 2.2, sc: 1.3 });
      frameOn([rudi, bun], { az: lerp(-.35, -.42, k), el: .13, fill: lerp(.9, .95, k), t }); draw();
      stamp(L("WRONG FIX", "FALSCHER PLAN"), W * .42, H * .17, (k * d * .58 - .05) / .3, "#7a5cff", .06); } });
  // 5 Studio: Großaufnahme Kopf von vorn, Zähne wachsen, dann Heu im Maul, Zähne werden kürzer + PDSA-Karte
  KZ.shot("jTeeth", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    const grow = ph < .45 ? lerp(1.4, 2.6, sm(ph / .45)) : lerp(2.6, 1.15, sm((ph - .45) / .4));
    at(bigBun, 0, 0, 0, -.35); poseBunny(bigBun, t, { teeth: grow, chew: ph > .45, lid: .1, sc: 1.6 });
    if (ph > .45) { holdAt(hay, V(.35, .62, .22), 0, .25); hay.root.rotation.set(.3, .2, .9); }
    frameOn([FR(.0, .45, -.3, .62, 1.1, .3)], { az: lerp(.95, .85, k), el: .05, fill: lerp(.6, .66, k), dy: -.42, t }); draw();
    stamp(L("NONSTOP GROWTH", "WACHSEN IMMER"), W * .42, H * .17, (lt - .1) / .3, "#2f6fd0", -.06);
    infoCard(W * .42, H * .615, 900, 200, sm((ph - .3) * d / .35), "PDSA", "#2f6fd0",
      [L("Rabbit teeth grow constantly.", "Kaninchenzähne wachsen ständig."), L("Hay wears them down.", "Heu schleift sie ab.")], 40); });
  // 6 Studio: Zuckerwürfel regnen auf die Tüte, Balken gute vs. schlechte Darmbakterien kippen; dann RWAF-Zitat
  KZ.shot("jGut", (lt, d, t) => { studio(); const ph = lt / d, k = sm(ph);
    place(bigBag, 0, 0, 0); bigBag.root.scale.setScalar(1.5); bigBag.root.rotation.y = Math.sin(t * .8) * .25;
    cubes.root.visible = true; cubes.list.forEach((c, i) => { const a = i * 2.399, r = .4 + (i % 3) * .15, y = 1.6 - ((t * .9 + i * .31) % 1.4); c.position.set(Math.cos(a) * r, Math.max(.07, y), Math.sin(a) * r * .6 + .1); c.rotation.set(t + i, t * 1.3 + i, 0); });
    frameOn([FR(-.75, 0, -.4, .75, 1.3, .4)], { az: lerp(.15, .05, k), el: .16, fill: lerp(.75, .82, k), dy: -.05, t }); draw();
    stamp(L("DANGER", "LEBENSGEFAHR"), W * .42, H * .17, (lt - d * .5) / .3, "#e5484d", -.06);
    if (ph < .55) { const a = clamp(lt / .3, 0, 1), sh = sm(clamp((lt - .3) / (d * .4), 0, 1));
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(14,18,56,.82)"; g.beginPath(); g.roundRect(W * .42 - 400, H * .53, 800, 250, 30); g.fill(); g.restore();
      const bar = (y, v, col, lab) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.fillStyle = "rgba(255,255,255,.15)"; g.beginPath(); g.roundRect(W * .42 - 360, y, 720, 50, 25); g.fill();
        g.fillStyle = col; g.beginPath(); g.roundRect(W * .42 - 360, y, Math.max(50, 720 * v), 50, 25); g.fill(); g.restore(); txt(lab, W * .42 - 350, y - 26, 34, "#ffffff", { a, align: "left" }); };
      bar(H * .53 + 75, lerp(.85, .3, sh), "#36b37e", L("good gut bacteria", "gute Darmbakterien")); bar(H * .53 + 180, lerp(.15, .8, sh), "#e5484d", L("bad gut bacteria", "schlechte Bakterien")); }
    else infoCard(W * .42, H * .6, 900, 260, sm((ph - .55) * d / .35), L("RABBIT WELFARE ASSOCIATION", "KANINCHENSCHUTZ RWAF"), "#e5484d",
      [L("“Too many sweet treats ...", "„Zu viele süße Leckerlis ..."), L("fatal digestive upsets.”", "tödliche Verdauungsprobleme.“")], 38); });
  // 7 Auflösung: Kacheln mit Haken, dann Hoppel neben einem Heuhaufen so groß wie er selbst + RSPCA-Karte
  KZ.shot("jReveal", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    at(bun, -.3, 0, .1, .25); poseBunny(bun, t, { happy: ph > .5, chew: ph > .5, sc: 1.25 });
    place(bigHay, .95, 0, -.1); const hs = sm(clamp(ph / .35, .05, 1)); bigHay.root.scale.set(1.3, 4.6 * hs, 1.3);
    frameOn([bun, FR(.45, 0, -.5, 1.45, .9, .3)], { az: lerp(.12, .2, k), el: .15, fill: lerp(.62, .66, k), dy: -.85, t }); draw();
    stamp(L("XXL HAY", "XXL-HEU"), W * .42, H * .17, (lt - d * .3) / .3, "#36b37e", -.06);
    if (ph < .5) quizTiles(W * .42, H * .57, QUIZ(), 1, { reveal: sm(clamp((lt - .15) / .4, 0, 1)), correct: 1 });
    else infoCard(W * .42, H * .58, 900, 250, sm((ph - .5) * d / .35), "RSPCA", "#2f6fd0",
      [L("A bundle of hay as big", "Jeden Tag Heu, so groß"), L("as your rabbit, every day", "wie dein Kaninchen")], 40); });
  // 8 Tipp: Rudi reicht den Kräuterbund, Hoppel hoppelt glücklich und kaut; Drops-Tüte liegt umgekippt hinten + Quellenzeile
  KZ.shot("jTip", (lt, d, t) => { inYard(); const ph = lt / d, k = sm(ph);
    place(rudi, .95, -.35, PI + .6); poseRudi(rudi, t, { arms: [.2, 1.35], spread: .05, mouth: "smile", nod: .06 });
    holdAt(herbs, hand(1).add(V(0, -.12, 0)), 0, 1.6);
    at(bun, -.3, 0, .3, .2); poseBunny(bun, t, { happy: true, chew: ph > .4, look: .2, sc: 1.25 });
    frameOn([rudi, bun], { az: lerp(-.32, -.38, k), el: .14, fill: lerp(.8, .84, k), dy: -lerp(0, .75, sm(clamp((ph - .25) / .15, 0, 1))), t }); draw();
    stamp(L("HERBS!", "KRÄUTER!"), W * .42, H * .17, (lt - .15) / .3, "#36b37e", -.06);
    infoCard(W * .42, H * .615, 900, 200, sm((ph - .4) * d / .35), "RWAF", "#36b37e",
      [L("“Yoghurt drops ... should", "„Joghurtdrops ... sollte man"), L("be avoided.”", "vermeiden.“")], 40); });
  // 9 Loop: zurück zur Hook-Einstellung
  KZ.shot("jLoop", (lt, d, t) => { inYard(); const ph = lt / d; hookFrame(lt, d, t, 1 - ph * .9);
    if (ph > .3) stamp(L("THOSE DROPS...", "DIESE DROPS..."), W * .42, H * .17, (ph - .3) * d / .3, "#ff4f8b", -.06); });

  window.__bunnyDrops = true;
})();
